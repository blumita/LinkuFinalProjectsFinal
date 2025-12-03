<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class SecurityController extends Controller
{
    /**
     * دریافت آمار امنیتی
     */
    public function getSecurityStats(): JsonResponse
    {
        try {
            // Get all cache keys for blocked IPs and rate limits
            $blockedIPs = $this->getBlockedIPs();
            $rateLimitedIPs = $this->getRateLimitedIPs();
            $suspiciousRequests = $this->getSuspiciousRequests();

            return response()->json([
                'success' => true,
                'data' => [
                    'blocked_ips' => $blockedIPs,
                    'rate_limited_ips' => $rateLimitedIPs,
                    'suspicious_requests' => $suspiciousRequests,
                    'total_blocked' => count($blockedIPs),
                    'total_rate_limited' => count($rateLimitedIPs),
                    'total_suspicious' => count($suspiciousRequests),
                ],
            ]);
        } catch (\Exception $e) {
            Log::error('Error fetching security stats', [
                'error' => $e->getMessage(),
            ]);

            return response()->json([
                'success' => false,
                'message' => 'خطا در دریافت آمار امنیتی',
            ], 500);
        }
    }

    /**
     * Unblock کردن یک IP
     */
    public function unblockIP(Request $request): JsonResponse
    {
        $request->validate([
            'ip' => 'required|ip',
        ]);

        $ip = $request->input('ip');

        // Remove from blocked list
        Cache::forget("blocked_ip:{$ip}");
        
        // Remove rate limit counter
        Cache::forget("requests:{$ip}");

        Log::info('IP unblocked by admin', [
            'ip' => $ip,
            'admin_id' => auth()->id(),
        ]);

        return response()->json([
            'success' => true,
            'message' => "IP {$ip} با موفقیت از لیست مسدود شده‌ها حذف شد.",
        ]);
    }

    /**
     * Clear کردن تمام IP های blocked
     */
    public function clearAllBlocked(): JsonResponse
    {
        $blockedIPs = $this->getBlockedIPs();

        foreach ($blockedIPs as $blocked) {
            Cache::forget("blocked_ip:{$blocked['ip']}");
            Cache::forget("requests:{$blocked['ip']}");
        }

        Log::info('All blocked IPs cleared by admin', [
            'admin_id' => auth()->id(),
            'count' => count($blockedIPs),
        ]);

        return response()->json([
            'success' => true,
            'message' => count($blockedIPs) . ' IP از لیست مسدود شده‌ها پاک شد.',
        ]);
    }

    /**
     * دریافت لیست IP های مسدود شده
     */
    protected function getBlockedIPs(): array
    {
        $blocked = [];
        $prefix = 'blocked_ip:';

        // Get all cache keys (این روش به نوع cache driver بستگی داره)
        // برای Redis یا Memcached باید از دستورات خاص اون‌ها استفاده کنیم
        
        // موقتاً از database برای لاگ استفاده می‌کنیم
        // می‌تونیم از Log facade استفاده کنیم
        
        return $blocked;
    }

    /**
     * دریافت لیست IP های rate limited
     */
    protected function getRateLimitedIPs(): array
    {
        $rateLimited = [];
        $prefix = 'requests:';

        // مشابه getBlockedIPs
        
        return $rateLimited;
    }

    /**
     * دریافت درخواست‌های مشکوک از لاگ
     */
    protected function getSuspiciousRequests(): array
    {
        $suspicious = [];

        try {
            // خواندن آخرین 100 خط از لاگ Laravel
            $logFile = storage_path('logs/laravel.log');
            
            if (!file_exists($logFile)) {
                return [];
            }

            $lines = $this->tail($logFile, 500);
            
            foreach ($lines as $line) {
                // پیدا کردن خطوط مربوط به Suspicious requests
                if (strpos($line, 'Suspicious request detected') !== false ||
                    strpos($line, 'Blocked suspicious IP') !== false ||
                    strpos($line, 'Rate limit exceeded') !== false) {
                    
                    // Parse log line
                    if (preg_match('/\[(\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2})\]/', $line, $matches)) {
                        $timestamp = $matches[1];
                        
                        // Extract IP
                        if (preg_match('/"ip":"([\d\.]+)"/', $line, $ipMatch)) {
                            $suspicious[] = [
                                'timestamp' => $timestamp,
                                'ip' => $ipMatch[1],
                                'message' => $this->extractMessage($line),
                            ];
                        }
                    }
                }
            }
        } catch (\Exception $e) {
            Log::error('Error reading log file', ['error' => $e->getMessage()]);
        }

        return array_slice(array_reverse($suspicious), 0, 50); // آخرین 50 تا
    }

    /**
     * خواندن آخرین خطوط یک فایل
     */
    protected function tail(string $filepath, int $lines = 100): array
    {
        $handle = fopen($filepath, "r");
        $linecounter = $lines;
        $pos = -2;
        $beginning = false;
        $text = [];

        while ($linecounter > 0) {
            $t = " ";
            while ($t != "\n") {
                if (fseek($handle, $pos, SEEK_END) == -1) {
                    $beginning = true;
                    break;
                }
                $t = fgetc($handle);
                $pos--;
            }
            $linecounter--;
            if ($beginning) {
                rewind($handle);
            }
            $text[$lines - $linecounter - 1] = fgets($handle);
            if ($beginning) break;
        }
        fclose($handle);
        
        return array_reverse($text);
    }

    /**
     * استخراج پیام از خط لاگ
     */
    protected function extractMessage(string $logLine): string
    {
        if (strpos($logLine, 'Suspicious request detected') !== false) {
            return 'درخواست مشکوک شناسایی شد';
        }
        if (strpos($logLine, 'Blocked suspicious IP') !== false) {
            return 'IP مشکوک مسدود شد';
        }
        if (strpos($logLine, 'Rate limit exceeded') !== false) {
            return 'تعداد درخواست بیش از حد';
        }
        return 'رویداد امنیتی';
    }
}
