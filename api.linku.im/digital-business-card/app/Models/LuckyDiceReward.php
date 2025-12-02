<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class LuckyDiceReward extends Model
{
    protected $fillable = [
        'lucky_dice_id',
        'phone',
        'reward_type',
        'reward_value',
    ];

    public function luckyDice(): BelongsTo
    {
        return $this->belongsTo(LuckyDice::class);
    }
}
