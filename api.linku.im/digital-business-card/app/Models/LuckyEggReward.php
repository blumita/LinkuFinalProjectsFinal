<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class LuckyEggReward extends Model
{
    protected $fillable = [
        'lucky_egg_id',
        'phone',
        'reward_type',
        'reward_value',
    ];

    public function luckyEgg(): BelongsTo
    {
        return $this->belongsTo(LuckyEgg::class);
    }
}
