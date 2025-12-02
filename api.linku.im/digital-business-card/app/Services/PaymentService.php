<?php

namespace App\Services;

use App\Contracts\GatewayInterface;
use App\Exceptions\CustomException;
use App\Models\Order;
use App\Models\Plan;
use App\Models\Transaction;
use Illuminate\Contracts\Container\BindingResolutionException;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class PaymentService
{
    protected mixed $gatewayName;
    protected mixed $gateways;

    public function __construct()
    {
        $this->gatewayName = config('smart-payment.default');
        $this->gateways = config('smart-payment.gateways');
    }

    public function pay($data, $user): array
    {
        return DB::transaction(function () use ($data, $user) {

            $plan = Plan::find($data['planId']);

            $order = $user->orders()->create([
                'plan_id' => $plan->id,
                'amount' => $data['amount'],
                'title' => $plan->duration,
                'status' => 'pending',
                'metadata'=>$data['metadata'],
                'description' => $data['metadata']['description'] ?? null,
            ]);

            $callbackUrl = $data['callback_url'] ?? route('callback.payment');

            $gateway = $this->gatewayResolver($this->gatewayName);

            // Initiate payment and get redirect URL
            $result = $gateway->pay(
                $data['amount'],
                $callbackUrl . '?gateway=' . $this->gatewayName . '&order_id=' . $order->id,
                $data['metadata'] ?? []
            );

            $user->transactions()->create(
                ['authority' => $result['authority'] ?? null,
                    'order_id' => $order->id,
                    'payment_method' => 'gateway',
                    'amount' => $order->amount,
                    'gateway' => $gateway::GATEWAY_NAME,
                    'ref_id' => $verification['ref_id'] ?? null,
                    //'is_success' => true,
                    'status' => 'pending',
                    'message' => 'Payment successful via callback.',
                ]
            );
            return $result;
        });
    }

    public function verifyTransaction($data)
    {
        return DB::transaction(function () use ($data) {

            $gatewayName = $data['gateway'] ?? $this->gatewayName;

            //
            $order = Order::findOrFail($data['order_id']);

            $gateway = $this->gatewayResolver($gatewayName);

            // Verify transaction with gateway
            $verifyResult = $gateway->verify([
                ...$data,
                'Amount' => $order->amount,
            ]);
            //
            $transaction = Transaction::where('order_id', $order->id)
                ->where('authority', $data['Authority'])
                ->firstOrFail();

            // Update transaction with verification result
            $transaction->update([
                'is_success'=>true,
                'status' => $verifyResult['Message'] ?? null,
                'ref_id' => $verifyResult['RefID'] ?? null,
                'card_pan' => $verifyResult['CardPan'] ?? null,
                'card_hash' => $verifyResult['CardHash'] ?? null,
                'paid_at' => Carbon::now(),
            ]);

            if (!$order->user) {
                return response()->json(['error' => 'User not found'], 404);
            }
            $phoneNumber = $order->user->phone;
            $planLabel = $order->plan->duration;

            $expireDate = \Carbon\Carbon::parse($transaction->created_at ?? now())
                ->addMonths($this->parseDurationToMonths($order->plan->duration))
                ->format('Y-m-d');  //YYYY-MM-DD

            $startDate = Carbon::parse($transaction->created_at ?? now());
            $daysLeft = $startDate->startOfDay()->diffInDays($expireDate);

            return [
                'order' => $order,
                'phoneNumber'=>$phoneNumber,
                'planLabel'=>$planLabel,
                'expireDate'=>$expireDate,
                'daysLeft'=>floor($daysLeft),
                'ref_id' => $verifyResult['RefID'] ?? null,
            ];
        });

    }

    /**
     * @throws BindingResolutionException
     * @throws CustomException
     */
    public function gatewayResolver($gateway): GatewayInterface
    {

        if (!array_key_exists($gateway, $this->gateways)) {

            throw new CustomException(__('payment.payment_gateway_not_defined') . " ({$gateway})");
        }

        $gatewayConfig = $this->gateways[$gateway];

        if (!isset($gatewayConfig)) {

            throw new CustomException(__('payment.payment_gateway_class_not_defined'));
        }

        return app()->make($gatewayConfig);

    }

    private function parseDurationToMonths(string $duration): int
    {
        $duration = trim($duration);

        if (preg_match('/^(\d+)\s*ماه$/u', $duration, $matches)) {
            return (int) $matches[1];
        }

        if (preg_match('/^(\d*)\s*سال$/u', $duration, $matches)) {
            $num = $matches[1] !== '' ? (int)$matches[1] : 1;
            return $num * 12;
        }

        /*if (preg_match('/^(\d+)\s*سال$/u', $duration, $matches)) {
            return (int) $matches[1] * 12;
        }*/

        return 1;
    }

}
