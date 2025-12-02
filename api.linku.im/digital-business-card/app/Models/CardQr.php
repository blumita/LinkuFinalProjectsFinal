<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\MorphMany;
use Illuminate\Database\Eloquent\Relations\MorphOne;

class CardQr extends Model
{
    protected $fillable = [
        'card_id',
        'qr_color',
        'qr_bg_color',
        'qr_logo_size',
        'qr_logo_radius',
    ];

    protected $casts = [
        'qr_color' => 'string',
        'qr_bg_color' => 'string',
        'qr_logo_size' => 'integer',
        'qr_logo_radius' => 'integer',
    ];
    //
    public function logo(): MorphOne
    {
        return $this->morphOne(File::class, 'fileable')
            ->where('field', 'customQrIcon');
    }
    public function files(): MorphMany
    {
        return $this->morphMany(File::class,'fileable');
    }
    public function card(): BelongsTo
    {
        return $this->belongsTo(Card::class);
    }
}
