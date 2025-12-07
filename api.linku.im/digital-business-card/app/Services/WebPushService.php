<?php

namespace App\Services;

use Minishlink\WebPush\WebPush;
use Minishlink\WebPush\Subscription;

class WebPushService
{
    private WebPush $webPush;

    public function __construct()
    {
        $publicKey = config('services.vapid.public_key') ?? env('VAPID_PUBLIC_KEY');
        $privateKey = config('services.vapid.private_key') ?? env('VAPID_PRIVATE_KEY');

        // اگر کلیدها موجود نیستند، لاگ کن و exception نزن
        if (empty($publicKey) || empty($privateKey)) {
            \Log::warning('⚠️ VAPID keys not configured. Push notifications will be disabled.', [
                'public_key_set' => !empty($publicKey),
                'private_key_set' => !empty($privateKey),
            ]);
            
            // یک WebPush ساده بدون VAPID بساز (فقط برای جلوگیری از crash)
            $this->webPush = new WebPush([]);
            return;
        }

        $this->webPush = new WebPush([
            'VAPID' => [
                'subject' => 'mailto:support@linku.im',
                'publicKey' => $publicKey,
                'privateKey' => $privateKey,
            ]
        ]);
    }

    /**
     * ارسال نوتیفیکیشن Push به یک کاربر
     */
    public function sendNotification($subscription, string $title, string $message, ?string $url = null, ?array $options = [])
    {
        // بررسی که VAPID تنظیم شده باشد
        if (!$this->isConfigured()) {
            \Log::warning('⚠️ Push notification skipped - VAPID not configured');
            return [
                'success' => false,
                'message' => 'VAPID keys not configured'
            ];
        }

        if (is_string($subscription)) {
            $subscription = json_decode($subscription, true);
        }

        // استاندارد Web Push Notification - مستقیم بدون wrapper
        $payload = json_encode([
            'title' => $title,
            'body' => $message,
            'message' => $message, // برای سازگاری با SW قدیمی
            'icon' => '/AppImages/android/android-launchericon-192-192.png',
            'badge' => '/AppImages/android/android-launchericon-96-96.png',
            'tag' => 'linku-notification',
            'requireInteraction' => false,
            'vibrate' => [200, 100, 200],
            'url' => $url ?? '/dashboard/notifications',
            'actionLink' => $url ?? '/dashboard/notifications',
            'timestamp' => now()->timestamp,
        ]);

        try {
            $pushSubscription = Subscription::create($subscription);
            
            $report = $this->webPush->sendOneNotification(
                $pushSubscription,
                $payload
            );

            if ($report->isSuccess()) {
                return [
                    'success' => true,
                    'message' => 'Push notification sent successfully'
                ];
            } else {
                return [
                    'success' => false,
                    'message' => 'Push notification failed: ' . $report->getReason()
                ];
            }
        } catch (\Exception $e) {
            return [
                'success' => false,
                'message' => 'Push notification error: ' . $e->getMessage()
            ];
        }
    }

    /**
     * ارسال نوتیفیکیشن Push به چند کاربر
     */
    public function sendBulkNotifications(array $subscriptions, string $title, string $message, ?string $url = null)
    {
        // بررسی که VAPID تنظیم شده باشد
        if (!$this->isConfigured()) {
            \Log::warning('⚠️ Bulk push notifications skipped - VAPID not configured');
            return [
                'success' => false,
                'sent' => 0,
                'failed' => count($subscriptions),
                'total' => count($subscriptions),
                'message' => 'VAPID keys not configured'
            ];
        }

        // استاندارد Web Push Notification
        $payload = json_encode([
            'notification' => [
                'title' => $title,
                'body' => $message,
                'icon' => '/icon-192x192.png',
                'badge' => '/badge-96x96.png',
                'tag' => 'linku-notification',
                'requireInteraction' => false,
                'data' => [
                    'url' => $url ?? '/dashboard/notifications',
                    'timestamp' => now()->timestamp,
                ]
            ]
        ]);

        \Log::info('📦 [WebPushService] Preparing bulk push', [
            'subscriptions_count' => count($subscriptions),
            'title' => $title,
            'payload_size' => strlen($payload)
        ]);

        $successCount = 0;
        $failCount = 0;

        foreach ($subscriptions as $index => $sub) {
            if (is_string($sub)) {
                $sub = json_decode($sub, true);
            }

            try {
                $pushSubscription = Subscription::create($sub);
                $this->webPush->queueNotification($pushSubscription, $payload);
                \Log::debug('📤 [WebPushService] Queued notification', [
                    'index' => $index + 1,
                    'endpoint' => substr($sub['endpoint'] ?? 'unknown', 0, 50) . '...'
                ]);
            } catch (\Exception $e) {
                $failCount++;
                \Log::error('❌ [WebPushService] Failed to queue notification', [
                    'index' => $index + 1,
                    'error' => $e->getMessage(),
                    'endpoint' => substr($sub['endpoint'] ?? 'unknown', 0, 50) . '...'
                ]);
                continue;
            }
        }

        // ارسال تمام نوتیفیکیشن‌های صف
        \Log::info('🔄 [WebPushService] Flushing queued notifications');
        
        foreach ($this->webPush->flush() as $report) {
            if ($report->isSuccess()) {
                $successCount++;
                \Log::debug('✅ [WebPushService] Push sent successfully', [
                    'endpoint' => substr($report->getEndpoint(), 0, 50) . '...'
                ]);
            } else {
                $failCount++;
                \Log::warning('⚠️ [WebPushService] Push failed', [
                    'endpoint' => substr($report->getEndpoint(), 0, 50) . '...',
                    'reason' => $report->getReason(),
                    'expired' => $report->isSubscriptionExpired()
                ]);
            }
        }

        \Log::info('🏁 [WebPushService] Bulk push completed', [
            'success' => $successCount,
            'failed' => $failCount,
            'total' => count($subscriptions)
        ]);

        return [
            'success' => true,
            'sent' => $successCount,
            'failed' => $failCount,
            'total' => count($subscriptions)
        ];
    }

    /**
     * بررسی اینکه VAPID keys تنظیم شده‌اند
     */
    private function isConfigured(): bool
    {
        $publicKey = config('services.vapid.public_key') ?? env('VAPID_PUBLIC_KEY');
        $privateKey = config('services.vapid.private_key') ?? env('VAPID_PRIVATE_KEY');
        
        return !empty($publicKey) && !empty($privateKey);
    }
}
