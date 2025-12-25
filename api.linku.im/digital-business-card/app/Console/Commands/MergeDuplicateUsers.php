<?php

namespace App\Console\Commands;

use App\Models\Card;
use App\Models\User;
use App\Services\OtpService;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;

class MergeDuplicateUsers extends Command
{
    protected $signature = 'users:merge-duplicates {--dry-run : Show what would be merged without actually doing it}';
    protected $description = 'Merge duplicate user accounts with different phone formats';

    public function __construct(private OtpService $otpService)
    {
        parent::__construct();
    }

    public function handle()
    {
        $isDryRun = $this->option('dry-run');

        if ($isDryRun) {
            $this->warn('DRY RUN MODE - No changes will be made');
        }

        $this->info('Finding duplicate users...');

        $users = User::whereNotNull('phone')->get();
        $phoneMap = [];

        // Group users by normalized phone
        foreach ($users as $user) {
            try {
                $normalizedPhone = $this->otpService->normalizePhone($user->phone);
                if (!isset($phoneMap[$normalizedPhone])) {
                    $phoneMap[$normalizedPhone] = [];
                }
                $phoneMap[$normalizedPhone][] = $user;
            } catch (\Exception $e) {
                // Skip invalid phones
                continue;
            }
        }

        // Find duplicates (more than 1 user with same normalized phone)
        $duplicates = array_filter($phoneMap, fn($users) => count($users) > 1);

        if (empty($duplicates)) {
            $this->info('No duplicate users found!');
            return Command::SUCCESS;
        }

        $this->info('Found ' . count($duplicates) . ' groups of duplicate users');

        $merged = 0;
        $deleted = 0;

        foreach ($duplicates as $normalizedPhone => $duplicateUsers) {
            // Sort by: 1) card count DESC, 2) created_at ASC (keep oldest with most cards)
            usort($duplicateUsers, function($a, $b) {
                $aCards = $a->cards()->count();
                $bCards = $b->cards()->count();

                if ($aCards !== $bCards) {
                    return $bCards - $aCards; // More cards = keep
                }

                return $a->created_at <=> $b->created_at; // Older = keep
            });

            $keepUser = array_shift($duplicateUsers); // First one is the keeper

            $this->line("\n<info>Phone: {$normalizedPhone}</info>");
            $this->line("Keeping: User {$keepUser->id} ({$keepUser->name}) - {$keepUser->phone} - Cards: " . $keepUser->cards()->count());

            foreach ($duplicateUsers as $duplicateUser) {
                $cardCount = $duplicateUser->cards()->count();
                $this->warn("  Merging: User {$duplicateUser->id} ({$duplicateUser->name}) - {$duplicateUser->phone} - Cards: {$cardCount}");

                if (!$isDryRun) {
                    try {
                        DB::beginTransaction();

                        // Transfer all cards to keep user
                        Card::where('user_id', $duplicateUser->id)
                            ->update(['user_id' => $keepUser->id]);

                        // Delete duplicate user
                        $duplicateUser->delete();

                        DB::commit();

                        $merged++;
                        $deleted++;

                        $this->line("    ✓ Merged and deleted");
                    } catch (\Exception $e) {
                        DB::rollBack();
                        $this->error("    ✗ Error: " . $e->getMessage());
                    }
                }
            }

            // Update keep user's phone to normalized format
            if (!$isDryRun && $keepUser->phone !== $normalizedPhone) {
                $keepUser->phone = $normalizedPhone;
                $keepUser->save();
                $this->line("  Updated phone format: {$keepUser->phone} → {$normalizedPhone}");
            }
        }

        $this->info("\n" . ($isDryRun ? 'Would merge' : 'Merged') . ": {$merged} duplicate users");
        $this->info(($isDryRun ? 'Would delete' : 'Deleted') . ": {$deleted} duplicate accounts");

        if ($isDryRun) {
            $this->warn("\nRun without --dry-run to actually merge the duplicates");
        }

        return Command::SUCCESS;
    }
}
