<?php

namespace App\Console\Commands;

use App\Models\NotificationLog;
use App\Models\User;
use App\Notifications\AdminPushNotification;
use App\Services\WebPushService;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Notification;

class SendScheduledNotifications extends Command
{
    protected $signature = 'notifications:send-scheduled';
    protected $description = 'Send scheduled push notifications';

    public function handle(WebPushService $webPushService)
    {
        $this->info('Checking for scheduled notifications...');

        // پیدا کردن نوتیفیکیشن‌های pending
        $pendingNotifications = NotificationLog::pending()->get();

        if ($pendingNotifications->isEmpty()) {
            $this->info('No scheduled notifications found.');
            return 0;
        }

        $this->info("Found {$pendingNotifications->count()} scheduled notifications.");

        foreach ($pendingNotifications as $notificationLog) {
            try {
                $this->info("Sending: {$notificationLog->title}");

                // انتخاب کاربران مقصد
                $users = $this->getRecipients($notificationLog);

                if ($users->isEmpty()) {
                    $this->warn("No recipients found for notification ID {$notificationLog->id}");
                    continue;
                }

                // ارسال نوتیفیکیشن Database
                Notification::send($users, new AdminPushNotification(
                    'system',
                    $notificationLog->title,
                    $notificationLog->message,
                    $notificationLog->action_link
                ));

                // ارسال Push واقعی
                $pushSubscriptions = $users->whereNotNull('push_subscription')
                    ->pluck('push_subscription')
                    ->toArray();

                $pushSentCount = 0;
                if (!empty($pushSubscriptions)) {
                    $pushResult = $webPushService->sendBulkNotifications(
                        $pushSubscriptions,
                        $notificationLog->title,
                        $notificationLog->message,
                        $notificationLog->action_link
                    );
                    $pushSentCount = $pushResult['sent'];
                }

                // آپدیت لاگ
                $notificationLog->update([
                    'is_sent' => true,
                    'sent_count' => $users->count(),
                    'delivered_count' => $pushSentCount,
                ]);

                $this->info("✓ Sent to {$users->count()} users ({$pushSentCount} push notifications)");
            } catch (\Exception $e) {
                $this->error("Failed to send notification ID {$notificationLog->id}: {$e->getMessage()}");
            }
        }

        $this->info('Scheduled notifications processing complete.');
        return 0;
    }

    private function getRecipients(NotificationLog $log)
    {
        return match ($log->type) {
            'all' => User::where('status', 'active')->get(),
            'premium' => User::where('status', 'active')->whereHas('activeSubscription')->get(),
            'free' => User::where('status', 'active')->whereDoesntHave('activeSubscription')->get(),
            'specific' => User::whereIn('id', $log->recipient_ids ?? [])->where('status', 'active')->get(),
            default => collect(),
        };
    }
}
