<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\MorphMany;

class Form extends Model
{
    //
    protected $fillable = ['data','read_at'];

    protected $casts = [
        'data' => 'array',
    ];

    public function link(): HasMany
    {
        return $this->hasMany(Form::class);
    }
    public function files(): MorphMany
    {
        return $this->morphMany(File::class, 'fileable');
    }
}
