<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class CardVisit extends Model
{
    //
    protected $fillable = [
        'card_type',
        'mobile',
        'owner_name',
        'qr_link',
        'status',
        'product_unit_id',
        'sequence_number'
    ];

    public function unit(): BelongsTo
    {
        return $this->belongsTo(ProductUnit::class, 'product_unit_id');
    }
}
