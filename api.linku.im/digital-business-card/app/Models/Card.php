<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\Relations\MorphMany;
use Illuminate\Database\Eloquent\Relations\MorphOne;
use Illuminate\Support\Str;

class Card extends Model
{
    protected $fillable = [
        'card_user_id',
        'slug',
        'card_name',
        'card_number',
        'save_contact',
        'theme_color',
        'icon_color',
        'layout_mode',
        'single_link',
        'is_default',
        'is_active',
        'lead_capture_mode',
        'match_theme_color',
        'creator_id',
    ];

    protected $casts = [
        'single_link' => 'boolean',
        'lead_capture_mode' => 'boolean',
        'match_theme_color' => 'boolean',
        'is_default'=>'boolean',
        'is_active'=>'boolean'
    ];
    //
    protected static function boot(): void
    {
        parent::boot();

        static::creating(function ($card) {
            do {
                $slug = Str::random(7);
            } while (self::where('slug', $slug)->exists());

            $card->slug = $slug;
        });
    }
    /*public function getRouteKeyName(): string
    {
        return 'slug';
    }*/

    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }
    public function user(): HasOne
    {
        return $this->hasOne(CardUser::class);
    }
    public function cover(): MorphOne
    {
        return $this->morphOne(File::class, 'fileable')
            ->where('field', 'coverImage');
    }

    public function logo(): MorphOne
    {
        return $this->morphOne(File::class, 'fileable')
            ->where('field', 'logoImage');
    }
    public function avatar(): MorphOne
    {
        return $this->morphOne(File::class, 'fileable')
            ->where('field', 'profileImage');
    }

    public function files(): MorphMany
    {
        return $this->morphMany(File::class, 'fileable');
    }
    public function views(): MorphMany
    {
        return $this->morphMany(View::class, 'viewable');
    }
    public function qr(): HasOne
    {
        return $this->hasOne(CardQr::class);
    }
    public function leadSetting(): HasOne
    {
        return $this->hasOne(CardLeadSetting::class);
    }
    public function links(): HasMany
    {
        return $this->hasMany(CardLink::class)->orderBy('order');
    }
    public function leads(): HasMany
    {
        return $this->hasMany(CardLead::class);
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
    public function questionBoxes(): HasMany
    {
        return $this->hasMany(QuestionBox::class);
    }
    public function licenses(): HasMany
    {
        return $this->hasMany(License::class);
    }
}
