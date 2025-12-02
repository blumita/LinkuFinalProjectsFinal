<?php

namespace App\Services;

use Minishlink\WebPush\WebPush;
use Minishlink\WebPush\Subscription;

class WebPushService
{
    private WebPush $webPush;

    public function __construct()
    {
        $this->webPush = new WebPush([
            'VAPID' => [
                'subject' => 'mailto:support@linku.im',
                'publicKey' => env('VAPID_PUBLIC_KEY'),
                'privateKey' => env('VAPID_PRIVATE_KEY'),
            ]
        ]);
    }

    /**
     * ارسال نوتیفیکیشن Push به یک کاربر
     */
    public function sendNotification($subscription, string $title, string $message, ?string $url = null, ?array $options = [])
    {
        if (is_string($subscription)) {
            $subscription = json_decode($subscription, true);
        }

        $payload = json_encode([
            'title' => $title,
            'message' => $message,
            'body' => $message,
            'url' => $url ?? '/dashboard/notifications',
            'actionLink' => $url ?? '/dashboard/notifications',
            'icon' => '/AppImages/android/android-launchericon-192-192.png',
            'badge' => '/AppImages/android/android-launchericon-96-96.png',
            'timestamp' => now()->timestamp,
            'vibrate' => [200, 100, 200],
            ...$options
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
        $payload = json_encode([
            'title' => $title,
            'message' => $message,
            'body' => $message,
            'url' => $url ?? '/dashboard/notifications',
            'actionLink' => $url ?? '/dashboard/notifications',
            'icon' => '/AppImages/android/android-launchericon-192-192.png',
            'badge' => '/AppImages/android/android-launchericon-96-96.png',
            'timestamp' => now()->timestamp,
            'vibrate' => [200, 100, 200],
        ]);

        $successCount = 0;
        $failCount = 0;

        foreach ($subscriptions as $sub) {
            if (is_string($sub)) {
                $sub = json_decode($sub, true);
            }

            try {
                $pushSubscription = Subscription::create($sub);
                $this->webPush->queueNotification($pushSubscription, $payload);
            } catch (\Exception $e) {
                $failCount++;
                continue;
            }
        }

        // ارسال تمام نوتیفیکیشن‌های صف
        foreach ($this->webPush->flush() as $report) {
            if ($report->isSuccess()) {
                $successCount++;
            } else {
                $failCount++;
            }
        }

        return [
            'success' => true,
            'sent' => $successCount,
            'failed' => $failCount,
            'total' => count($subscriptions)
        ];
    }
}
