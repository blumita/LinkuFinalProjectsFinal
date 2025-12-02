<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\MorphMany;
use Illuminate\Support\Str;

class CardLead extends Model
{
    protected $fillable = [
        'card_id',
        'hash',
        'is_default',
        'data',
        'read_at'
    ];

    protected $casts = [
        'is_default' => 'boolean',
        'data' => 'array',
    ];
    protected static function boot(): void
    {
        parent::boot();

        static::creating(function ($cardLead) {
            do {
                $hash = Str::random(7);
            } while (self::where('hash', $hash)->exists());

            $cardLead->hash = $hash;
        });
    }

    public function files(): MorphMany
    {
        return $this->morphMany(File::class, 'fileable');
    }
    //
    public function card(): BelongsTo
    {
        return $this->belongsTo(Card::class);
    }
}
