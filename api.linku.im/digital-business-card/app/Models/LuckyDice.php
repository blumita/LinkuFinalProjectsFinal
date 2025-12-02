<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class LuckyDice extends Model
{
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
        return $this->hasMany(LuckyDiceReward::class);
    }
    public function prizes(): HasMany
    {
        return $this->hasMany(LuckyDicePrize::class);
    }

    public function results(): HasMany
    {
        return $this->hasMany(LuckyDiceResult::class);
    }

}
