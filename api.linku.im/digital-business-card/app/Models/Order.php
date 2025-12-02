<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasOne;

/**
 * Class Order
 *
 * Represents a payment order in the SmartPayment system.
 * Each order can have multiple related transactions (e.g. retries, partial payments).
 *
 * @package SmartPayment\Models
 */
class Order extends Model
{
    protected $fillable = [
        'user_id',
        'plan_id',
        'title',
        'amount',
        'status',
        'metadata',
        'start_date',
        'end_date',
        'description',  // Optional description or notes
        'currency',     // Currency code (e.g. IRR, USD)
    ];

    protected $casts = [
        'metadata' => 'array',
        'start_date' => 'datetime',
        'end_date' => 'datetime',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function plan(): BelongsTo
    {
        return $this->belongsTo(Plan::class);
    }

    public function transaction(): HasOne
    {
        return $this->hasOne(Transaction::class);
    }
}
