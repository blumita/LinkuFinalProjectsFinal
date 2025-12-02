<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class LuckyEggPrize extends Model
{
    protected $fillable = [
        'lucky_wheel_id',
        'text',
        'order',
    ];

    public function luckyEgg(): BelongsTo
    {
        return $this->belongsTo(LuckyEgg::class);
    }
}

