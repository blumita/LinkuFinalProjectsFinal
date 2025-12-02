<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\MorphOne;

class CardUser extends Model
{
    protected $fillable = [
        'name',
        'location',
        'job',
        'company',
        'bio',
        'creator_id',
    ];

    protected $casts = [
        'name' => 'string',
        'location' => 'string',
        'job' => 'string',
        'company' => 'string',
        'bio' => 'string',
        'creator_id' => 'integer',
    ];
    public function card(): BelongsTo
    {
        return $this->belongsTo(Card::class);
    }
}
