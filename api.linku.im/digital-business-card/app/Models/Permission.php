<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Permission extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'display_name',
        'group',
        'parent_id',
        'description',
        'is_menu',
        'menu_icon',
        'menu_route',
        'menu_order',
    ];

    protected $casts = [
        'is_menu' => 'boolean',
        'menu_order' => 'integer',
    ];

    /**
     * نقش‌هایی که این مجوز رو دارن
     */
    public function roles(): BelongsToMany
    {
        return $this->belongsToMany(Role::class, 'role_permission')
            ->withPivot('can_read', 'can_write', 'can_delete')
            ->withTimestamps();
    }

    /**
     * والد (Parent Permission)
     */
    public function parent(): BelongsTo
    {
        return $this->belongsTo(Permission::class, 'parent_id');
    }

    /**
     * فرزندان (Children Permissions)
     */
    public function children(): HasMany
    {
        return $this->hasMany(Permission::class, 'parent_id')
            ->orderBy('menu_order');
    }

    /**
     * تمام فرزندان به صورت بازگشتی
     */
    public function allChildren()
    {
        return $this->children()->with('allChildren');
    }

    /**
     * Scope برای منوها
     */
    public function scopeMenus($query)
    {
        return $query->where('is_menu', true);
    }

    /**
     * Scope برای والدها (Root)
     */
    public function scopeRoots($query)
    {
        return $query->whereNull('parent_id');
    }

    /**
     * دریافت تمام والدها (Breadcrumb)
     */
    public function getParents()
    {
        $parents = collect([]);
        $parent = $this->parent;

        while ($parent) {
            $parents->prepend($parent);
            $parent = $parent->parent;
        }

        return $parents;
    }

    /**
     * دریافت ساختار درختی کامل
     */
    public static function getTree()
    {
        return static::whereNull('parent_id')
            ->with('allChildren')
            ->orderBy('menu_order')
            ->get();
    }

    /**
     * دریافت منوهای درختی
     */
    public static function getMenuTree()
    {
        return static::menus()
            ->whereNull('parent_id')
            ->with(['allChildren' => function ($query) {
                $query->where('is_menu', true);
            }])
            ->orderBy('menu_order')
            ->get();
    }
}
