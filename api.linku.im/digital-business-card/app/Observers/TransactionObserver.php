<?php

namespace App\Observers;

use App\Enums\SubscriptionNotificationType;
use App\Models\Discount;
use App\Models\Order;
use App\Models\Transaction;
use App\Notifications\SubscriptionNotification;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Log;

class TransactionObserver
{
    //
    /**
     * Handle the Transaction "created" event.
     */
    public function created(Transaction $transaction): void
    {

    }

    /**
     * Handle the Transaction "updated" event.
     */
    public function updated(Transaction $transaction): void
    {

        if ($transaction->status == 'Paid' && $transaction->order && $transaction->order->user) {

            $order = $transaction->order;

            $lastActiveOrder = Order::where('user_id', $order->user_id)
                ->where('end_date', '>', now())
                ->orderBy('end_date', 'desc')
                ->first();

            $start = $lastActiveOrder
                ? Carbon::parse($lastActiveOrder->end_date)
                : now();

            //$months = (int) $order->plan->key_duration;
            $months = $this->parseDurationToMonths($order->plan->duration);

            $end = $start->copy()->addMonths(max($months, 1));

            $order->update([
                'status' => 'paid',
                'start_date' => $start,
                'end_date' => $end,
            ]);

            //check discount code for order
            if (isset($order->metadata['discountCode']) && $order->metadata['discountCode']) {
                $discount = Discount::where('code', $order->metadata['discountCode'])->first();

                if ($discount) {
                    $discount->incrementUsage();

                    if ($discount->used_count == $discount->max_usage) {
                        $discount->is_active = 0;
                        $discount->save();
                    }
                }

            }
            $order->user->is_pro = true;
            $order->user->save();

            ///
            $order->user->notify(new SubscriptionNotification(
                SubscriptionNotificationType::PURCHASE_SUCCESS,
                [
                    'start' => $order->start_date->toDateString(),
                    'end' => $order->end_date->toDateString(),
                ]
            ));
        }
    }

    private function parseDurationToMonths(string $duration): int
    {
        $duration = trim($duration);
        Log::info('duration', [$duration]);
        if (preg_match('/^(\d+)\s*ماه$/u', $duration, $matches)) {
            return (int)$matches[1];
        }
        if (preg_match('/^(\d*)\s*سال$/u', $duration, $matches)) {
            $num = $matches[1] !== '' ? (int)$matches[1] : 1;
            return $num * 12;
        }
        /*if (preg_match('/^(\d+)\s*سال$/u', $duration, $matches)) {
            //return (int) $matches[1] * 12;
        }*/

        return 1;
    }

}
