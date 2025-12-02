<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\Relations\MorphMany;
use Illuminate\Database\Eloquent\Relations\MorphOne;
use Illuminate\Database\Eloquent\Relations\MorphTo;
use Illuminate\Support\Str;

class CardLink extends Model
{
    protected $fillable = [
        'card_id',
        'data',
        'hash',
        'clicks',
        'enabled',
        'asSelectedSingleLink',
        'order',
    ];

    protected $casts = [
        'data' => 'array',
        'enabled' => 'boolean',
        'asSelectedSingleLink'=>'boolean',
        'clicks' => 'integer',
        'order' => 'integer',
    ];
    protected static function boot(): void
    {
        parent::boot();

        static::creating(function ($link) {
            do {
                $hash = Str::random(7);
            } while (self::where('hash', $hash)->exists());

            $link->hash = $hash;
        });
    }
    //
    public function card(): BelongsTo
    {
        return $this->belongsTo(Card::class);
    }
    public function customIcon(): MorphOne
    {
        return $this->morphOne(File::class, 'fileable')
            ->where('field', 'customIcon');
    }
    public function fileData(): MorphOne
    {
        return $this->morphOne(File::class, 'fileable')
            ->where('field', 'fileData');
    }
    public function backgroundImage(): MorphOne
    {
        return $this->morphOne(File::class, 'fileable')
            ->where('field', 'backgroundImage');
    }
    public function files(): MorphMany
    {
        return $this->morphMany(File::class, 'fileable');
    }
    public function views(): MorphMany
    {
        return $this->morphMany(View::class, 'viewable');
    }
    public function poll(): HasOne
    {
        return $this->hasOne(Poll::class);
    }
    public function luckyEgg(): HasOne
    {
        return $this->hasOne(LuckyEgg::class);
    }
    public function luckyDice(): HasOne
    {
        return $this->hasOne(LuckyDice::class);
    }
    public function luckyWheel(): HasOne
    {
        return $this->hasOne(LuckyWheel::class);
    }
    public function luckyDiceResults(): HasMany
    {
        return $this->hasMany(LuckyDiceResult::class);
    }

    public function forms(): HasMany
    {
        return $this->hasMany(Form::class,'card_link_id');
    }
    public function questionBoxes(): HasMany
    {
        return $this->hasMany(QuestionBox::class);
    }
}
