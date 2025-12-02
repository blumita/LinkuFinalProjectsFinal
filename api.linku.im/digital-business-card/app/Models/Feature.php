<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class Feature extends Model
{
    protected $fillable = [
        'title',
        'slug',
        'icon',
        'description',
        'content',
        'order',
        'is_active',
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'order' => 'integer',
    ];

    /**
     * Boot method to auto-generate slug
     */
    protected static function boot()
    {
        parent::boot();

        static::creating(function ($feature) {
            if (empty($feature->slug)) {
                $feature->slug = Str::slug($feature->title);
            }
        });

        static::updating(function ($feature) {
            if ($feature->isDirty('title') && empty($feature->slug)) {
                $feature->slug = Str::slug($feature->title);
            }
        });
    }

    /**
     * Scope for active features
     */
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    /**
     * Scope for ordered features
     */
    public function scopeOrdered($query)
    {
        return $query->orderBy('order', 'asc');
    }
}
