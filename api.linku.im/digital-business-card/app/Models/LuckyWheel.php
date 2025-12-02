<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class LuckyWheel extends Model
{
    //
    use HasFactory;

    protected $fillable = [
        'card_link_id',
        'title',
        'is_active',
    ];

    public function cardLink(): BelongsTo
    {
        return $this->belongsTo(CardLink::class);
    }

    public function rewards(): HasMany
    {
        return $this->hasMany(LuckyWheelReward::class);
    }
    public function prizes(): HasMany
    {
        return $this->hasMany(LuckyWheelPrize::class);
    }

    public function results(): HasMany
    {
        return $this->hasMany(LuckyWheelResult::class);
    }
}
