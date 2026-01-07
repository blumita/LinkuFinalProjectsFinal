<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Log;
use Symfony\Component\HttpFoundation\Response;

/**
 * Block Suspicious Requests Middleware
 * 
 * این middleware درخواست‌های مشکوک را شناسایی و مسدود می‌کند:
 * - حملات SQL Injection
 * - حملات XSS
 * - Path Traversal
 * - Command Injection
 * - تعداد زیاد درخواست از یک IP
 */
class BlockSuspiciousRequests
{
    /**
     * پترن‌های مشکوک برای شناسایی حملات
     */
    protected array $suspiciousPatterns = [
        // SQL Injection - فقط موارد واقعاً مشکوک
        '/union\s+select/i',
        '/select\s+.*\s+from\s+/i',
        '/drop\s+table/i',
        '/insert\s+into/i',
        '/delete\s+from/i',
        '/update\s+.*\s+set/i',
        '/\'\s*(or|and)\s+[\'"\d]/i', // SQL injection با quote
        '/(;|\||&&)\s*(cat|wget|curl|exec|system)/i',
        
        // XSS
        '/<script[^>]*>.*?<\/script>/is',
        '/javascript\s*:/i',
        '/<iframe/i',
        '/<embed/i',
        '/<object/i',
        
        // Path Traversal
        '/\.\.[\/\\\\]/i',
        '/\.\.%2f/i',
        '/\.\.%5c/i',
        
        // Command Injection
        '/[;&|`]\s*(cat|ls|pwd|chmod|rm|wget|curl)/i',
    ];

    /**
     * IP های مشکوک (مانند Tor Exit Nodes, VPN های شناخته شده و...)
     */
    protected array $suspiciousIPs = [
        // می‌توانید IP های مشکوک را اینجا اضافه کنید
        // '192.168.1.1',
    ];

    /**
     * IP های معتبر که از بررسی معاف هستند
     */
    protected array $whitelistedIPs = [
        '127.0.0.1',
        '::1',
        '95.215.59.92', // IP سرور اصلی
        // می‌توانید IP های معتبر (مثل دفتر، خانه) را اینجا اضافه کنید
    ];
    
    /**
     * مسیرهایی که از بررسی محتوای مشکوک معاف هستند
     * (فقط برای rate limiting و IP blocking چک میشن)
     */
    protected array $exemptPaths = [
        'api/v1/card/*',  // ذخیره و ویرایش کارت
        'api/v1/profile/*', // پروفایل کاربر
        'api/user/card/*', // کارت کاربر
        'api/user/profile/*', // پروفایل
    ];

    /**
     * تعداد مجاز درخواست در دقیقه برای هر IP
     */
    protected int $maxRequestsPerMinute = 60;

    /**
     * Handle an incoming request.
     */
    public function handle(Request $request, Closure $next): Response
    {
        $ip = $request->ip();
        
        // Skip checks for whitelisted IPs
        if (in_array($ip, $this->whitelistedIPs)) {
            return $next($request);
        }
        
        // بررسی IP مشکوک
        if ($this->isBlockedIP($ip)) {
            Log::warning('Blocked suspicious IP', [
                'ip' => $ip,
                'url' => $request->fullUrl(),
                'user_agent' => $request->userAgent(),
            ]);
            
            return response()->json([
                'success' => false,
                'message' => 'Access denied.',
                'code' => 'ip_blocked'
            ], 403);
        }

        // بررسی Rate Limiting سخت‌گیرانه
        if ($this->isRateLimited($ip)) {
            Log::warning('Rate limit exceeded', [
                'ip' => $ip,
                'url' => $request->fullUrl(),
            ]);
            
            return response()->json([
                'success' => false,
                'message' => 'درخواست‌های شما بیش از حد مجاز است. لطفاً بعداً تلاش کنید.',
                'code' => 'rate_limit_exceeded'
            ], 429);
        }

        // بررسی پارامترها برای پترن‌های مشکوک (فقط برای مسیرهای غیر معاف)
        if (!$this->isExemptPath($request->path()) && $this->hasSuspiciousContent($request)) {
            Log::warning('Suspicious request detected', [
                'ip' => $ip,
                'url' => $request->fullUrl(),
                'method' => $request->method(),
                'params' => $request->except(['password', 'token']),
                'user_agent' => $request->userAgent(),
            ]);
            
            // مسدود کردن موقت IP
            $this->blockIPTemporarily($ip);
            
            return response()->json([
                'success' => false,
                'message' => 'درخواست مشکوک شناسایی شد.',
                'code' => 'suspicious_request'
            ], 400);
        }

        // بررسی User-Agent مشکوک
        if ($this->hasSuspiciousUserAgent($request)) {
            Log::info('Suspicious user agent', [
                'ip' => $ip,
                'user_agent' => $request->userAgent(),
            ]);
        }

        // شمارش درخواست‌ها برای Rate Limiting
        $this->incrementRequestCount($ip);

        return $next($request);
    }

    /**
     * بررسی اینکه آیا IP مسدود است یا نه
     */
    protected function isBlockedIP(string $ip): bool
    {
        // بررسی IP های استاتیک مشکوک
        if (in_array($ip, $this->suspiciousIPs)) {
            return true;
        }

        // بررسی IP های موقتاً مسدود شده
        return Cache::has("blocked_ip:{$ip}");
    }
    
    /**
     * بررسی اینکه آیا مسیر از بررسی محتوا معاف است
     */
    protected function isExemptPath(string $path): bool
    {
        foreach ($this->exemptPaths as $pattern) {
            // تبدیل wildcard به regex
            $pattern = str_replace(['*', '/'], ['.*', '\/'], $pattern);
            if (preg_match('/^' . $pattern . '$/i', $path)) {
                return true;
            }
        }
        return false;
    }

    /**
     * بررسی Rate Limiting
     */
    protected function isRateLimited(string $ip): bool
    {
        $key = "requests:{$ip}";
        $requests = Cache::get($key, 0);
        
        return $requests >= $this->maxRequestsPerMinute;
    }

    /**
     * افزایش شمارنده درخواست‌ها
     */
    protected function incrementRequestCount(string $ip): void
    {
        $key = "requests:{$ip}";
        $requests = Cache::get($key, 0);
        
        Cache::put($key, $requests + 1, now()->addMinute());
    }

    /**
     * بررسی محتوای مشکوک در درخواست
     */
    protected function hasSuspiciousContent(Request $request): bool
    {
        // بررسی URL
        $url = $request->fullUrl();
        foreach ($this->suspiciousPatterns as $pattern) {
            if (preg_match($pattern, $url)) {
                return true;
            }
        }

        // بررسی تمام پارامترها
        $allInputs = $request->all();
        
        foreach ($allInputs as $key => $value) {
            if (!is_string($value)) {
                continue;
            }
            
            foreach ($this->suspiciousPatterns as $pattern) {
                if (preg_match($pattern, $value)) {
                    return true;
                }
            }
        }

        // بررسی هدرها
        foreach ($request->headers->all() as $key => $values) {
            foreach ($values as $value) {
                foreach ($this->suspiciousPatterns as $pattern) {
                    if (preg_match($pattern, $value)) {
                        return true;
                    }
                }
            }
        }

        return false;
    }

    /**
     * بررسی User-Agent مشکوک
     */
    protected function hasSuspiciousUserAgent(Request $request): bool
    {
        $userAgent = $request->userAgent();
        
        // لیست User-Agent های ربات/اسکنر شناخته شده
        $suspiciousAgents = [
            'sqlmap',
            'nikto',
            'nmap',
            'masscan',
            'scanner',
            'bot',
            'crawler',
            'spider',
        ];

        $userAgentLower = strtolower($userAgent ?? '');
        
        foreach ($suspiciousAgents as $agent) {
            if (str_contains($userAgentLower, $agent)) {
                return true;
            }
        }

        return false;
    }

    /**
     * مسدود کردن موقت IP
     */
    protected function blockIPTemporarily(string $ip): void
    {
        // مسدود کردن IP برای 1 ساعت
        Cache::put("blocked_ip:{$ip}", true, now()->addHour());
        
        Log::warning("IP temporarily blocked", [
            'ip' => $ip,
            'blocked_until' => now()->addHour(),
        ]);
    }
}
