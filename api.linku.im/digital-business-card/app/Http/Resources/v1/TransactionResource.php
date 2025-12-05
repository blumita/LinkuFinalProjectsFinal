<?php

namespace App\Http\Resources\v1;

use App\Models\Discount;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class TransactionResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $originalPrice = $this->order->plan->price ?? 0;
        $planDiscount = $this->order->plan->discount ?? 0;
        $discountCode = $this->order->metadata['discountCode'] ?? null;

        $discount = $discountCode ? Discount::where('code', $discountCode)->first() : null;

        if ($discount && $discount->type === 'percentage') {
            $discountedByPlan = $originalPrice * (1 - $planDiscount/100);
            $value = $discountedByPlan * (1-$discount->value/100);
        } elseif ($discount) {
            $value = $discount->value;
        } else {
            $value = 0;
        }

        return [
            'id' => $this->id,
            'transactionId' => $this->ref_id,
            'username' => $this->user->user_name,
            'userEmail' => $this->user->email,
            'planTitle' => $this->order->plan->title ?? null,
            'planDuration' => $this->order->plan->duration ?? null,
            'plan' => $this->order->plan->duration ?? null,
            'amount' => (int) ($this->amount / 10),
            'date' => Carbon::parse($this->start_date)->format('Y-m-d'),
            'method' => $this->translatePaymentMethod($this->payment_method),
            'originalAmount' => (int)$this->order->plan->price,
            'discount' =>(int) $this->order->plan->discount ?? null,
            'discountCode' => $this->order->metadata['discountCode'] ?? null,
            'discountAmount' =>(int) $value/10,
            'paymentMethod' => $this->gateway,
            'ref' => $this->ref_id,
            'status' => $this->status === 'Paid' ? 'success' : $this->status,
            'createdAt' => $this->created_at->format('Y-m-d'),
            'startDate' => Carbon::parse($this->created_at)->format('Y-m-d'),
            'endDate' => Carbon::parse($this->created_at ?? now())
                ->addMonths((int)($this->order->plan->key_duration ?? 1))
                ->format('Y-m-d'),
        ];
    }

    private function translatePaymentMethod(string $method): string
    {
        return match ($method) {
            'gateway' => 'درگاه بانکی',
            'wallet' => 'کیف پول',
            default => 'نامشخص',
        };
    }
}
