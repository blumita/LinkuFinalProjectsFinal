<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class LuckyEgg extends Model
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
        return $this->hasMany(LuckyEggReward::class);
    }
    public function prizes(): HasMany
    {
        return $this->hasMany(LuckyEggPrize::class);
    }

    public function results(): HasMany
    {
        return $this->hasMany(LuckyEggResult::class);
    }
}
