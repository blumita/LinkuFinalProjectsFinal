<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Log;

class UnblockIP extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'security:unblock-ip {ip : IP address to unblock}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Unblock کردن یک IP از لیست مسدود شده‌ها';

    /**
     * Execute the console command.
     */
    public function handle(): int
    {
        $ip = $this->argument('ip');

        if (!filter_var($ip, FILTER_VALIDATE_IP)) {
            $this->error("IP نامعتبر: {$ip}");
            return Command::FAILURE;
        }

        // Remove from blocked list
        $blockedKey = "blocked_ip:{$ip}";
        $wasBlocked = Cache::has($blockedKey);
        Cache::forget($blockedKey);
        
        // Remove rate limit counter
        $rateLimitKey = "requests:{$ip}";
        Cache::forget($rateLimitKey);

        if ($wasBlocked) {
            Log::info('IP unblocked via command', [
                'ip' => $ip,
            ]);

            $this->info("✅ IP {$ip} با موفقیت از لیست مسدود شده‌ها حذف شد.");
        } else {
            $this->warn("⚠️  IP {$ip} در لیست مسدود شده‌ها نبود.");
        }

        return Command::SUCCESS;
    }
}

