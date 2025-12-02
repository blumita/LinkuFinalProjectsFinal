<?php

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * Class Transaction
 *
 * Represents a payment transaction processed through a gateway.
 * Each transaction belongs to a specific order and may include metadata
 * such as card information and gateway response codes.
 *
 * @package SmartPayment\Models
 */
class Transaction extends Model
{
    protected $fillable = [
        'order_id',
        'user_id',
        'gateway',
        'payment_method',
        'amount',
        'authority',
        'ref_id',
        'is_success',
        'message',
        'status',       // Transaction status: pending, paid, failed
        'card_pan',     // Masked card number (e.g. 6037-****-****-1234)
        'card_hash',    // Hashed card identifier for fraud detection
        'paid_at',      // Timestamp when the transaction was successfully paid
    ];
    /**
     * Attributes that should be cast to specific types.
     * This ensures correct data formatting when working with the model.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'is_success' => 'boolean',
    ];
    public function scopeFilter($query, $filters)
    {
        foreach ($filters as $key => $value) {
            if ($key === 'date_range') {
                $query->whereBetween('created_at', [
                    Carbon::parse($value['start']),
                    Carbon::parse($value['end'])
                ]);
            } elseif ($key === 'min_amount') {
                $query->where('amount', '>=', $value);
            } elseif ($key === 'gateway') {
                $query->where('gateway', $value);
            }
        }

        return $query;
    }

    public function order(): BelongsTo
    {
        return $this->belongsTo(Order::class);
    }
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
