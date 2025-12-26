<?php

namespace App\Console\Commands;

use App\Models\User;
use App\Services\OtpService;
use Illuminate\Console\Command;

class NormalizePhones extends Command
{
    protected $signature = 'phones:normalize';
    protected $description = 'Normalize all phone numbers to standard format (9XXXXXXXXX)';

    public function __construct(private OtpService $otpService)
    {
        parent::__construct();
    }

    public function handle()
    {
        $this->info('Starting phone normalization to 9XXXXXXXXX format (without leading zero)...');

        $users = User::all();
        $updated = 0;
        $errors = 0;
        $skipped = 0;
        $alreadyNormalized = 0;

        foreach ($users as $user) {
            try {
                // Skip if phone is null or empty
                if (empty($user->phone)) {
                    $skipped++;
                    continue;
                }

                $originalPhone = $user->phone;

                // اگر قبلاً با فرمت 9XXXXXXXXX ذخیره شده (بدون صفر)، skip کن
                if (preg_match('/^9\d{9}$/', $originalPhone)) {
                    $alreadyNormalized++;
                    continue;
                }

                $normalizedPhone = $this->otpService->normalizePhone($originalPhone);

                if ($originalPhone !== $normalizedPhone) {
                    $user->phone = $normalizedPhone;
                    $user->save();
                    $updated++;
                    $this->line("Updated: {$originalPhone} → {$normalizedPhone}");
                }
            } catch (\Exception $e) {
                $errors++;
                $this->error("Error normalizing phone for User {$user->id} ({$user->phone}): " . $e->getMessage());
            }
        }

        $this->info("\nNormalization complete!");
        $this->info("Updated: {$updated}");
        $this->info("Already normalized (9...): {$alreadyNormalized}");
        $this->info("Skipped (null/empty): {$skipped}");
        $this->info("Errors: {$errors}");

        return Command::SUCCESS;
    }
}
