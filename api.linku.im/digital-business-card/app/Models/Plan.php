<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Plan extends Model
{
    //
    protected $fillable = [
        'id',
        'title',
        'subtitle',
        'slug',
        'duration',
        'price',
        'discount',
        'description',
        'features',
        'active',
        'popularity',
    ];

    protected $casts = [
        'features' => 'array',
    ];

    public function orders(): HasMany
    {
        return $this->hasMany(Order::class);
    }
}
