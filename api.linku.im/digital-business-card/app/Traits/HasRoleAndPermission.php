<?php

namespace App\Traits;

use App\Models\Permission;
use App\Models\Role;

trait HasRoleAndPermission
{
    /**
     * نقش کاربر
     */
    public function role()
    {
        return $this->belongsTo(Role::class);
    }

    /**
     * اختصاص نقش به کاربر
     */
    public function assignRole($role)
    {
        if (is_string($role)) {
            $role = Role::where('name', $role)->firstOrFail();
        }

        return $this->update(['role_id' => $role->id]);
    }

    /**
     * حذف نقش از کاربر
     */
    public function removeRole()
    {
        return $this->update(['role_id' => null]);
    }

    /**
     * چک کردن داشتن نقش
     */
    public function hasRole($role): bool
    {
        if (!$this->role) {
            return false;
        }

        if (is_string($role)) {
            return $this->role->name === $role;
        }

        return $this->role->id === $role->id;
    }

    /**
     * چک کردن داشتن یکی از نقش‌ها
     */
    public function hasAnyRole(array $roles): bool
    {
        if (!$this->role) {
            return false;
        }

        foreach ($roles as $role) {
            if ($this->hasRole($role)) {
                return true;
            }
        }

        return false;
    }

    /**
     * چک کردن داشتن مجوز
     */
    public function hasPermission($permission): bool
    {
        if (!$this->role) {
            return false;
        }

        return $this->role->hasPermission($permission);
    }

    /**
     * چک کردن داشتن یکی از مجوزها
     */
    public function hasAnyPermission(array $permissions): bool
    {
        foreach ($permissions as $permission) {
            if ($this->hasPermission($permission)) {
                return true;
            }
        }

        return false;
    }

    /**
     * چک کردن داشتن تمام مجوزها
     */
    public function hasAllPermissions(array $permissions): bool
    {
        foreach ($permissions as $permission) {
            if (!$this->hasPermission($permission)) {
                return false;
            }
        }

        return true;
    }

    /**
     * دریافت تمام مجوزهای کاربر
     */
    public function getPermissions()
    {
        if (!$this->role) {
            return collect([]);
        }

        return $this->role->permissions;
    }

    /**
     * دریافت منوهای مجاز کاربر به صورت درختی
     */
    public function getMenuTree()
    {
        if (!$this->role) {
            return collect([]);
        }

        $permissions = $this->role->permissions()
            ->where('is_menu', true)
            ->whereNull('parent_id')
            ->with(['allChildren' => function ($query) {
                $query->where('is_menu', true);
            }])
            ->orderBy('menu_order')
            ->get();

        return $this->filterMenuTree($permissions);
    }

    /**
     * فیلتر کردن منوها بر اساس دسترسی
     */
    protected function filterMenuTree($items)
    {
        return $items->map(function ($item) {
            if ($item->children->isNotEmpty()) {
                $item->children = $this->filterMenuTree($item->children);
            }
            return $item;
        })->filter(function ($item) {
            return $this->hasPermission($item->name) || $item->children->isNotEmpty();
        });
    }

    /**
     * آیا کاربر ادمین است؟
     */
    public function isAdmin(): bool
    {
        return $this->hasRole('admin');
    }

    /**
     * آیا کاربر مدیر است؟
     */
    public function isManager(): bool
    {
        return $this->hasAnyRole(['admin', 'manager']);
    }
}
