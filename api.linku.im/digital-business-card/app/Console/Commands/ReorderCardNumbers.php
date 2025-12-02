<?php

namespace App\Console\Commands;

use App\Models\Card;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;

class ReorderCardNumbers extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'cards:reorder-numbers {--dry-run : نمایش تغییرات بدون اعمال}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'رفع مشکل شماره‌گذاری کارت‌ها و reset کردن از 1';

    /**
     * Execute the console command.
     */
    public function handle(): int
    {
        $dryRun = $this->option('dry-run');
        
        if ($dryRun) {
            $this->warn('⚠️  حالت Dry Run - هیچ تغییری اعمال نمیشه');
        }
        
        $this->info('🔧 شروع رفع مشکل شماره‌گذاری کارت‌ها...');
        $this->newLine();
        
        if (!$dryRun) {
            DB::beginTransaction();
        }
        
        try {
            // 1. رفع شماره‌گذاری کارت‌های کاربران
            $this->info('📌 بررسی کارت‌های کاربران...');
            
            $users = Card::whereNotNull('user_id')
                ->select('user_id')
                ->distinct()
                ->pluck('user_id');
            
            $totalUserCards = 0;
            $userChanges = 0;
            
            foreach ($users as $userId) {
                $cards = Card::where('user_id', $userId)
                    ->orderBy('created_at')
                    ->orderBy('id')
                    ->get();
                
                $number = 1;
                foreach ($cards as $card) {
                    if ($card->card_number !== $number) {
                        $this->line("  • کاربر {$userId}: کارت #{$card->id} ({$card->card_name}) از {$card->card_number} به {$number}");
                        $userChanges++;
                    }
                    
                    if (!$dryRun) {
                        $card->card_number = $number;
                        $card->saveQuietly();
                    }
                    
                    $number++;
                    $totalUserCards++;
                }
            }
            
            if ($userChanges === 0) {
                $this->info('  ✓ شماره‌گذاری کارت‌های کاربران درست است');
            } else {
                $this->info("  ✓ {$userChanges} کارت کاربر نیاز به اصلاح داشت");
            }
            
            $this->newLine();
            
            // 2. رفع شماره‌گذاری کارت‌های Admin
            $this->info('📌 بررسی کارت‌های Admin...');
            
            $adminCards = Card::whereNull('user_id')
                ->orderBy('created_at')
                ->orderBy('id')
                ->get();
            
            $number = 1;
            $adminChanges = 0;
            
            foreach ($adminCards as $card) {
                if ($card->card_number !== $number) {
                    $this->line("  • کارت Admin #{$card->id} ({$card->card_name}) از {$card->card_number} به {$number}");
                    $adminChanges++;
                }
                
                if (!$dryRun) {
                    $card->card_number = $number;
                    $card->saveQuietly();
                }
                
                $number++;
            }
            
            $totalAdminCards = $number - 1;
            
            if ($adminChanges === 0) {
                $this->info('  ✓ شماره‌گذاری کارت‌های Admin درست است');
            } else {
                $this->info("  ✓ {$adminChanges} کارت Admin نیاز به اصلاح داشت");
            }
            
            if (!$dryRun) {
                DB::commit();
            }
            
            $this->newLine();
            $this->info('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
            
            if ($dryRun) {
                $this->warn('⚠️  هیچ تغییری اعمال نشد (Dry Run)');
            } else {
                $this->info('✅ عملیات با موفقیت انجام شد!');
            }
            
            $this->newLine();
            $this->info('📊 آمار نهایی:');
            $this->table(
                ['نوع', 'تعداد', 'تغییرات'],
                [
                    ['کارت‌های کاربران', $totalUserCards, $userChanges],
                    ['کارت‌های Admin', $totalAdminCards, $adminChanges],
                    ['جمع کل', $totalUserCards + $totalAdminCards, $userChanges + $adminChanges],
                ]
            );
            
            if ($dryRun) {
                $this->newLine();
                $this->comment('💡 برای اعمال تغییرات، بدون --dry-run اجرا کنید:');
                $this->comment('   php artisan cards:reorder-numbers');
            }
            
            return Command::SUCCESS;
            
        } catch (\Exception $e) {
            if (!$dryRun) {
                DB::rollBack();
            }
            
            $this->error('❌ خطا: ' . $e->getMessage());
            
            if ($this->output->isVerbose()) {
                $this->error($e->getTraceAsString());
            }
            
            return Command::FAILURE;
        }
    }
}
