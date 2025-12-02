<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\Relations\MorphOne;
use Illuminate\Support\Str;

class CardProduct extends Model
{
    use HasFactory;
    //
    protected $fillable = [
        'identifier',
        'name',
        'code',
        'stock',
        'description',
        'url',
        'status',
    ];

    protected $casts = [
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    public function files(): MorphOne
    {
        return $this->morphOne(File::class, 'fileable')
            ->where('field', 'imageCardProduct');
    }
    public function units(): HasMany
    {
        return $this->hasMany(ProductUnit::class);
    }

}
