<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class LuckyWheelResult extends Model
{
    protected $fillable = [
        'card_link_id',
        'lucky_wheel_id',
        'phone',
        'result',
        'lottery_code',
        'ip_address',
        'country',
    ];
    protected $casts = [
        'created_at' => 'datetime',
        'read_at' => 'datetime',
    ];

    public function luckyWheel(): BelongsTo
    {
        return $this->belongsTo(LuckyWheel::class);
    }

    public function cardLink(): BelongsTo
    {
        return $this->belongsTo(CardLink::class);
    }
}

