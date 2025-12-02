<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Role extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'display_name',
        'description',
        'priority',
        'is_active',
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'priority' => 'integer',
    ];

    /**
     * نقش‌هایی که این مجوز دارن
     */
    public function permissions(): BelongsToMany
    {
        return $this->belongsToMany(Permission::class, 'role_permission')
            ->withPivot('can_read', 'can_write', 'can_delete')
            ->withTimestamps();
    }

    /**
     * کاربرانی که این نقش رو دارن
     */
    public function users(): HasMany
    {
        return $this->hasMany(User::class);
    }

    /**
     * اضافه کردن مجوز به نقش
     */
    public function givePermissionTo($permission)
    {
        if (is_string($permission)) {
            $permission = Permission::where('name', $permission)->firstOrFail();
        }

        return $this->permissions()->syncWithoutDetaching($permission);
    }

    /**
     * حذف مجوز از نقش
     */
    public function revokePermissionTo($permission)
    {
        if (is_string($permission)) {
            $permission = Permission::where('name', $permission)->firstOrFail();
        }

        return $this->permissions()->detach($permission);
    }

    /**
     * چک کردن داشتن مجوز
     */
    public function hasPermission($permission): bool
    {
        if (is_string($permission)) {
            return $this->permissions()->where('name', $permission)->exists();
        }

        return $this->permissions()->where('id', $permission->id)->exists();
    }

    /**
     * Sync کردن مجوزها
     */
    public function syncPermissions(array $permissions)
    {
        return $this->permissions()->sync($permissions);
    }

    /**
     * دریافت تمام مجوزها به صورت درختی
     */
    public function getTreePermissions()
    {
        return $this->permissions()
            ->whereNull('parent_id')
            ->with('children')
            ->orderBy('menu_order')
            ->get();
    }
}
