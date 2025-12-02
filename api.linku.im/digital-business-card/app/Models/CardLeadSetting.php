<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class CardLeadSetting extends Model
{
    protected $fillable = [
        'card_id',
        'form_title',
        'fields',
        'submit_button_text',
        'form_disclaimer',
    ];

    protected $casts = [
        'fields' => 'array',
    ];
    //
    public function card(): BelongsTo
    {
        return $this->belongsTo(Card::class);
    }
}
