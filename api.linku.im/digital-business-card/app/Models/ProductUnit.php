<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasOne;

class ProductUnit extends Model
{
    //
    protected $fillable=['serial_number','card_product_id'];

    public function product(): BelongsTo
    {
        return $this->belongsTo(CardProduct::class,'card_product_id');
    }

    public function license(): HasOne
    {
        return $this->hasOne(License::class);
    }

}
