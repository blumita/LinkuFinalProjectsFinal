<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class LuckyWheelPrize extends Model
{
    protected $fillable = [
        'lucky_wheel_id',
        'text',
        'order',
    ];

    public function luckyWheel(): BelongsTo
    {
        return $this->belongsTo(LuckyWheel::class);
    }
}

