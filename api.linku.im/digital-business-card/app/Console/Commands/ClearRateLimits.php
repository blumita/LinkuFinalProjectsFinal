<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Cache;

class ClearRateLimits extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'rate-limits:clear {--all : پاک کردن همه rate limits}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'پاک کردن rate limits از cache برای رفع محدودیت درخواست‌ها';

    /**
     * Execute the console command.
     */
    public function handle(): int
    {
        $this->info('در حال پاک کردن rate limits...');

        // پاک کردن از جدول cache
        $deleted = DB::table('cache')
            ->where('key', 'like', '%otp%')
            ->orWhere('key', 'like', '%throttle%')
            ->orWhere('key', 'like', '%rate_limit%')
            ->orWhere('key', 'like', '%limiter%')
            ->delete();

        $this->info("تعداد {$deleted} رکورد rate limit از cache پاک شد.");

        // پاک کردن OTP های منقضی شده
        $expiredOtps = DB::table('otp_codes')
            ->where('expires_at', '<', now())
            ->delete();

        $this->info("تعداد {$expiredOtps} کد OTP منقضی شده پاک شد.");

        // پاک کردن Email OTP های منقضی شده
        if (DB::getSchemaBuilder()->hasTable('email_otp_codes')) {
            $expiredEmailOtps = DB::table('email_otp_codes')
                ->where('expires_at', '<', now())
                ->delete();

            $this->info("تعداد {$expiredEmailOtps} کد Email OTP منقضی شده پاک شد.");
        }

        if ($this->option('all')) {
            Cache::flush();
            $this->warn('همه cache پاک شد!');
        }

        $this->info('✅ عملیات با موفقیت انجام شد.');

        return Command::SUCCESS;
    }
}
