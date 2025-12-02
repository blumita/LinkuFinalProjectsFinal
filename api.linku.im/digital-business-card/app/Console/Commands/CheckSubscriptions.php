<?php

namespace App\Console\Commands;

use App\Enums\SubscriptionNotificationType;
use App\Models\Order;
use App\Notifications\SubscriptionNotification;
use Illuminate\Console\Command;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Log;

class CheckSubscriptions extends Command
{
    protected $signature = 'subscriptions:check';
    protected $description = 'بررسی اشتراک‌ها برای یادآوری تمدید و انقضا';

    public function handle(): void
    {

        $today = Carbon::now('UTC')->startOfDay();


        $threeDaysLater = $today->copy()->addDays(3)->endOfDay();

        $ordersForReminder = Order::where('status', 'paid')
            ->whereBetween('end_date', [$today, $threeDaysLater])
            ->with('user')
            ->get();

        foreach ($ordersForReminder as $order) {
            if ($order->user) {
                $order->user->notify(new SubscriptionNotification(
                    SubscriptionNotificationType::RENEWAL_REMINDER,
                    [
                        'end' => $order->end_date->toDateString(),
                    ]
                ));
                $this->info("Reminder sent to user {$order->user_id}");
            }
        }

        $expiredOrders = Order::where('status', 'paid')
            ->where('end_date', '<', $today)
            ->with('user')
            ->get();

        foreach ($expiredOrders as $order) {
            if ($order->user) {
                $order->user->notify(new SubscriptionNotification(
                    SubscriptionNotificationType::SUBSCRIPTION_EXPIRED,
                    [
                        'end' => $order->end_date->toDateString(),
                    ]
                ));

                // کاربر دیگر پرو نیست
                $order->user->is_pro = false;
                $order->user->save();

                // بروزرسانی وضعیت سفارش
                $order->update(['status' => 'expired']);

                $this->info("Expired notification sent to user {$order->user_id}");
            }
        }

        $this->info('Subscription check completed.');
    }
}
