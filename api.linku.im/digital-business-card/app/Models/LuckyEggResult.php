<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class LuckyEggResult extends Model
{
    protected $fillable = [
        'card_link_id',
        'lucky_egg_id',
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

    public function luckyEgg(): BelongsTo
    {
        return $this->belongsTo(LuckyEgg::class);
    }

    public function cardLink(): BelongsTo
    {
        return $this->belongsTo(CardLink::class);
    }
}

