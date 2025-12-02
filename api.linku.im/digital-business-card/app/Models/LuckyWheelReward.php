<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class LuckyWheelReward extends Model
{
    protected $fillable = [
        'lucky_wheel_id',
        'phone',
        'reward_type',
        'reward_value',
    ];

    public function luckyWheel(): BelongsTo
    {
        return $this->belongsTo(LuckyWheel::class);
    }
}
