<?php

namespace App\Observers;

use Illuminate\Notifications\DatabaseNotification;
use App\Services\WebPushService;
use App\Models\PushSubscription;
use Illuminate\Support\Facades\Log;

class DatabaseNotificationObserver
{
    /**
     * Handle the DatabaseNotification "created" event.
     */
    public function created(DatabaseNotification $notification): void
    {
        // فقط برای کاربران عادی (نه ادمین‌ها)
        if ($notification->notifiable_type !== 'App\\Models\\User') {
            return;
        }

        try {
            $userId = $notification->notifiable_id;
            $data = $notification->data;

            // چک کردن که آیا subscription وجود دارد (بدون query اضافی برای تمام کاربران)
            $hasSubscriptions = PushSubscription::where('user_id', $userId)->exists();

            // فقط اگر subscription داشت، ادامه بده
            if (!$hasSubscriptions) {
                return; // بدون لاگ - برای جلوگیری از spam
            }

            // دریافت Push Subscriptions کاربر
            $subscriptions = PushSubscription::where('user_id', $userId)->get();

            // ارسال Push Notification
            $webPushService = app(WebPushService::class);
            
            $title = $data['title'] ?? 'از طرف لینکو';
            $message = $data['message'] ?? 'شما یک پیام جدید دارید';
            $url = $data['action_link'] ?? '/dashboard/notifications';

            $sentCount = 0;
            foreach ($subscriptions as $sub) {
                $result = $webPushService->sendNotification(
                    $sub->toWebPushFormat(),
                    $title,
                    $message,
                    $url
                );

                if ($result['success']) {
                    $sentCount++;
                }
            }

            // فقط وقتی موفق بود لاگ کن
            if ($sentCount > 0) {
                Log::info("Push notification sent to user {$userId}: {$sentCount} successful");
            }

        } catch (\Exception $e) {
            // فقط خطاهای مهم رو لاگ کن
            Log::error("Push notification error for user {$notification->notifiable_id}: " . $e->getMessage());
        }
    }
}
