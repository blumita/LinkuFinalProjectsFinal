<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class License extends Model
{
    protected $fillable = [
        'license_code', 'card_id', 'expires_at', 'status','product_unit_id','expires_at'
    ];

    protected $casts = [
        'expires_at' => 'datetime',
    ];

    public function card(): BelongsTo
    {
        return $this->belongsTo(Card::class);
    }
    public function unit(): BelongsTo
    {
        return $this->belongsTo(ProductUnit::class, 'product_unit_id');
    }

    public function isValid(): bool {
        return $this->is_active && now()->lessThan($this->expires_at);
    }
}
