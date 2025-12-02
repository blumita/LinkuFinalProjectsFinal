<?php
namespace App\Console\Commands;

use App\Models\OtpCode;
use Illuminate\Console\Command;

class ClearOldVerifications extends Command
{
    protected $signature = 'clear:old-verifications';
    protected $description = 'پاک‌سازی کدهای تأیید قدیمی یا معتبر شده';

    public function handle(): void
    {
        $deleted = OtpCode::where('status', 'verified')
            ->orWhere('expires_at', '<', now())
            ->delete();

        $this->info("Deleted $deleted old verification codes.");
    }
}
