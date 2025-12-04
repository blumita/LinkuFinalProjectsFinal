<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Discount extends Model
{
    use HasFactory;

    protected $fillable = [
        'code',
        'title',
        'description',
        'banner',
        'icon',
        'type',          // percentage | fixed
        'value',
        'max_usage',
        'used_count',
        'expiry_date',
        'is_active',
    ];

    protected $casts = [
        'expiry_date' => 'datetime',
        'is_active' => 'boolean',
    ];

    public function isValid(): bool
    {
        return $this->is_active
            && ($this->expiry_date === null || $this->expiry_date->isFuture())
            && ($this->max_usage === null || $this->used_count < $this->max_usage);
    }

    public function incrementUsage(): void
    {
        $this->increment('used_count');
    }
    public function scopePercentage($query, $value)
    {
        return $query->where('type', 'percentage')->where('value', $value);
    }
}
