<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Log;
use Symfony\Component\HttpFoundation\Response;

/**
 * Anti Brute Force Middleware
 * 
 * محافظت در برابر حملات Brute Force:
 * - مسدود کردن موقت بعد از چندین تلاش ناموفق
 * - ثبت تلاش‌های ناموفق
 * - افزایش زمان انتظار به صورت تصاعدی
 */
class AntiBruteForce
{
    /**
     * تعداد مجاز تلاش‌های ناموفق
     */
    protected int $maxAttempts = 5;

    /**
     * مدت زمان مسدودی اولیه (دقیقه)
     */
    protected int $decayMinutes = 15;

    /**
     * Handle an incoming request.
     */
    public function handle(Request $request, Closure $next): Response
    {
        $identifier = $this->getIdentifier($request);
        
        // بررسی اینکه آیا مسدود است
        if ($this->isBlocked($identifier)) {
            $remainingTime = $this->getRemainingBlockTime($identifier);
            
            Log::warning('Blocked login attempt', [
                'identifier' => $identifier,
                'ip' => $request->ip(),
                'remaining_time' => $remainingTime,
            ]);
            
            return response()->json([
                'success' => false,
                'message' => "به دلیل تلاش‌های ناموفق زیاد، دسترسی شما موقتاً مسدود شده است. لطفاً {$remainingTime} دقیقه دیگر تلاش کنید.",
                'code' => 'too_many_attempts',
                'retry_after' => $remainingTime * 60, // به ثانیه
            ], 429);
        }

        $response = $next($request);

        // اگر response موفق نبود (401, 400, etc)، تلاش ناموفق ثبت شود
        if ($response->status() >= 400 && $response->status() < 500) {
            $this->incrementAttempts($identifier);
            
            $attempts = $this->getAttempts($identifier);
            $remaining = $this->maxAttempts - $attempts;
            
            if ($remaining > 0 && $remaining <= 2) {
                // اخطار به کاربر
                $content = json_decode($response->getContent(), true);
                if (is_array($content)) {
                    $content['remaining_attempts'] = $remaining;
                    $content['warning'] = "شما {$remaining} تلاش دیگر دارید.";
                    $response->setContent(json_encode($content));
                }
            }
        } elseif ($response->status() === 200) {
            // در صورت موفقیت، تلاش‌ها را پاک کن
            $this->clearAttempts($identifier);
        }

        return $response;
    }

    /**
     * دریافت شناسه یکتا برای tracking
     */
    protected function getIdentifier(Request $request): string
    {
        // ترکیب IP + username/email برای دقت بیشتر
        $username = $request->input('username') 
                 ?? $request->input('email') 
                 ?? $request->input('phone') 
                 ?? '';
        
        return sprintf(
            'bruteforce:%s:%s',
            $request->ip(),
            hash('sha256', $username)
        );
    }

    /**
     * بررسی اینکه آیا مسدود است
     */
    protected function isBlocked(string $identifier): bool
    {
        return Cache::has("{$identifier}:blocked");
    }

    /**
     * دریافت زمان باقی‌مانده از مسدودی (دقیقه)
     */
    protected function getRemainingBlockTime(string $identifier): int
    {
        $blockedUntil = Cache::get("{$identifier}:blocked_until", 0);
        $now = time();
        
        if ($blockedUntil > $now) {
            return (int) ceil(($blockedUntil - $now) / 60);
        }
        
        return 0;
    }

    /**
     * افزایش تعداد تلاش‌های ناموفق
     */
    protected function incrementAttempts(string $identifier): void
    {
        $attempts = $this->getAttempts($identifier) + 1;
        
        Cache::put(
            "{$identifier}:attempts",
            $attempts,
            now()->addMinutes($this->decayMinutes)
        );

        // اگر به حد مجاز رسید، مسدود کن
        if ($attempts >= $this->maxAttempts) {
            $this->blockUser($identifier, $attempts);
        }

        Log::info('Failed login attempt', [
            'identifier' => hash('sha256', $identifier),
            'attempts' => $attempts,
            'max_attempts' => $this->maxAttempts,
        ]);
    }

    /**
     * دریافت تعداد تلاش‌های ناموفق
     */
    protected function getAttempts(string $identifier): int
    {
        return Cache::get("{$identifier}:attempts", 0);
    }

    /**
     * پاک کردن تلاش‌های ناموفق (بعد از ورود موفق)
     */
    protected function clearAttempts(string $identifier): void
    {
        Cache::forget("{$identifier}:attempts");
        Cache::forget("{$identifier}:blocked");
        Cache::forget("{$identifier}:blocked_until");
    }

    /**
     * مسدود کردن کاربر
     */
    protected function blockUser(string $identifier, int $attempts): void
    {
        // محاسبه زمان مسدودی (تصاعدی)
        $blockMinutes = $this->calculateBlockDuration($attempts);
        $blockedUntil = time() + ($blockMinutes * 60);
        
        Cache::put(
            "{$identifier}:blocked",
            true,
            now()->addMinutes($blockMinutes)
        );
        
        Cache::put(
            "{$identifier}:blocked_until",
            $blockedUntil,
            now()->addMinutes($blockMinutes)
        );

        Log::warning('User blocked due to too many failed attempts', [
            'identifier' => hash('sha256', $identifier),
            'attempts' => $attempts,
            'blocked_minutes' => $blockMinutes,
            'blocked_until' => date('Y-m-d H:i:s', $blockedUntil),
        ]);
    }

    /**
     * محاسبه مدت زمان مسدودی (تصاعدی)
     */
    protected function calculateBlockDuration(int $attempts): int
    {
        // هر بار که تلاش ناموفق بیشتر شود، زمان مسدودی افزایش می‌یابد
        $multiplier = max(1, $attempts - $this->maxAttempts + 1);
        
        return $this->decayMinutes * $multiplier;
    }
}
