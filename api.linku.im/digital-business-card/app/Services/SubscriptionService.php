<?php

namespace App\Services;

use App\Models\Order;

class SubscriptionService
{

    public function checkStatus($user): array
    {

        $orders = Order::where('user_id', $user->id)
            ->whereHas('transaction', fn($q) => $q->where('status', 'Paid'))
            ->with('plan')
            ->orderBy('start_date')
            ->get();

        $now = now();
        $active = null;
        $next = [];
        $activeDaysLeft = 0;
        $futureDaysTotal = 0;

        foreach ($orders as $order) {

            if (!$order->plan || !$order->start_date || !$order->end_date) continue;

            if (is_null($active) && $order->start_date->lte($now) && $order->end_date->gt($now)) {

                $activeDaysLeft = (int)$now->startOfDay()->diffInDays($order->end_date->endOfDay());
                $active = [
                    'title' => $order->title,
                    'plan' => $order->plan->duration,
                    'start_date' => $order->start_date->toDateString(),
                    'end_date' => $order->end_date->toDateString(),
                    'days_left' => $activeDaysLeft,
                    'total_days' => $order->start_date->diffInDays($order->end_date)
                ];
            }
            elseif ($order->start_date->gt($now)) {

                $duration = $order->start_date->startOfDay()->diffInDays($order->end_date->endOfDay());
                $futureDaysTotal += $duration;


                if (is_null($active)) {
                    $activeDaysLeft = $duration;
                    $active = [
                        'title' => $order->title,
                        'plan' => $order->plan->duration,
                        'start_date' => $order->start_date->toDateString(),
                        'end_date' => $order->end_date->toDateString(),
                        'days_left' => $duration,
                        'total_days' => $duration
                    ];
                } else {
                    $next[] = [
                        'title' => $order->title,
                        'plan' => $order->plan->duration,
                        'start_date' => $order->start_date->toDateString(),
                        'end_date' => $order->end_date->toDateString(),
                        'duration' => $duration
                    ];
                }
            }
        }
        $totalRemainingDays = (int)$activeDaysLeft + $futureDaysTotal;

        return [
            'has_subscription' => !is_null($active),
            'valid' => !is_null($active),
            'days_left' => $activeDaysLeft,
            'total_remaining_days' => $totalRemainingDays,
            'expires_at' => $active['end_date'] ?? null,
            'active_subscription' => $active,
            'next_subscriptions' => $next,
            'message' => !is_null($active)
                ? 'اشتراک فعال دارید'
                : 'اشتراک فعال ندارید، ولی سفارش‌های آینده دارید'
        ];

    }

}
