<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class LuckyDicePrize extends Model
{
    protected $fillable = [
        'lucky_dice_id',
        'text',
        'order',
    ];

    public function luckyDice(): BelongsTo
    {
        return $this->belongsTo(LuckyDice::class);
    }
}

