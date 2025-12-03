<?php

namespace App\Http\Controllers;

use App\Models\Permission;
use App\Models\Role;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class RoleController extends Controller
{
    /**
     * لیست تمام نقش‌ها
     */
    public function index(): JsonResponse
    {
        $roles = Role::with('permissions')
            ->withCount('users')
            ->orderBy('priority', 'desc')
            ->get();

        return response()->json([
            'success' => true,
            'data' => $roles
        ]);
    }

    /**
     * نمایش یک نقش
     */
    public function show($id): JsonResponse
    {
        $role = Role::with(['permissions' => function ($query) {
            $query->whereNull('parent_id')
                ->with('allChildren')
                ->orderBy('menu_order');
        }])->findOrFail($id);

        return response()->json([
            'success' => true,
            'data' => $role
        ]);
    }

    /**
     * ساخت نقش جدید
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|unique:roles,name|max:50',
            'display_name' => 'required|string|max:100',
            'description' => 'nullable|string|max:500',
            'priority' => 'nullable|integer|min:1|max:99',
            'is_active' => 'nullable|boolean',
            'menus' => 'nullable|array',
            'menus.*' => 'string',
            'permissions' => 'nullable|array',
            'permissions.*' => 'exists:permissions,id',
        ]);

        $role = Role::create($validated);

        if (!empty($validated['permissions'])) {
            $role->permissions()->attach($validated['permissions']);
        }

        return response()->json([
            'success' => true,
            'message' => 'نقش با موفقیت ساخته شد',
            'data' => $role->load('permissions')
        ], 201);
    }

    /**
     * ویرایش نقش
     */
    public function update(Request $request, $id): JsonResponse
    {
        $role = Role::findOrFail($id);

        // جلوگیری از ویرایش نقش admin
        if ($role->name === 'admin') {
            return response()->json([
                'success' => false,
                'message' => 'نقش ادمین قابل ویرایش نیست'
            ], 403);
        }

        $validated = $request->validate([
            'name' => 'nullable|string|unique:roles,name,' . $id . '|max:50',
            'display_name' => 'nullable|string|max:100',
            'description' => 'nullable|string|max:500',
            'priority' => 'nullable|integer|min:1|max:99',
            'is_active' => 'nullable|boolean',
            'menus' => 'nullable|array',
            'menus.*' => 'string',
            'permissions' => 'nullable|array',
            'permissions.*' => 'exists:permissions,id',
        ]);

        $role->update($validated);

        if (isset($validated['permissions'])) {
            $role->permissions()->sync($validated['permissions']);
        }

        return response()->json([
            'success' => true,
            'message' => 'نقش با موفقیت ویرایش شد',
            'data' => $role->load('permissions')
        ]);
    }

    /**
     * حذف نقش
     */
    public function destroy($id): JsonResponse
    {
        $role = Role::findOrFail($id);

        // جلوگیری از حذف نقش admin
        if ($role->name === 'admin') {
            return response()->json([
                'success' => false,
                'message' => 'نقش ادمین قابل حذف نیست'
            ], 403);
        }

        // چک کردن اینکه کاربری با این نقش وجود داره یا نه
        $usersCount = $role->users()->count();
        if ($usersCount > 0) {
            return response()->json([
                'success' => false,
                'message' => "این نقش به {$usersCount} کاربر اختصاص یافته. ابتدا کاربران را به نقش دیگری منتقل کنید."
            ], 400);
        }

        $role->delete();

        return response()->json([
            'success' => true,
            'message' => 'نقش با موفقیت حذف شد'
        ]);
    }

    /**
     * مدیریت مجوزهای یک نقش
     */
    public function updatePermissions(Request $request, $id): JsonResponse
    {
        $role = Role::findOrFail($id);

        $validated = $request->validate([
            'permissions' => 'required|array',
            'permissions.*.permission_id' => 'required|exists:permissions,id',
            'permissions.*.can_read' => 'boolean',
            'permissions.*.can_write' => 'boolean',
            'permissions.*.can_delete' => 'boolean',
        ]);

        // ساخت آرایه برای sync با pivot data
        $syncData = [];
        foreach ($validated['permissions'] as $permission) {
            $syncData[$permission['permission_id']] = [
                'can_read' => $permission['can_read'] ?? true,
                'can_write' => $permission['can_write'] ?? false,
                'can_delete' => $permission['can_delete'] ?? false,
            ];
        }

        $role->permissions()->sync($syncData);

        return response()->json([
            'success' => true,
            'message' => 'مجوزها با موفقیت به‌روزرسانی شد',
            'data' => $role->load('permissions')
        ]);
    }

    /**
     * دریافت ساختار درختی مجوزها
     */
    public function getPermissionsTree(): JsonResponse
    {
        $permissions = Permission::whereNull('parent_id')
            ->with('allChildren')
            ->orderBy('menu_order')
            ->get();

        return response()->json([
            'success' => true,
            'data' => $permissions
        ]);
    }

    /**
     * دریافت منوهای درختی برای کاربر فعلی
     */
    public function getUserMenuTree(Request $request): JsonResponse
    {
        $user = $request->user();

        if (!$user->role) {
            return response()->json([
                'success' => true,
                'data' => []
            ]);
        }

        $menus = $user->getMenuTree();

        return response()->json([
            'success' => true,
            'data' => $menus
        ]);
    }

    /**
     * چک کردن دسترسی کاربر فعلی
     */
    public function checkPermission(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'permission' => 'required|string',
        ]);

        $user = $request->user();
        $hasPermission = $user->hasPermission($validated['permission']);

        return response()->json([
            'success' => true,
            'hasPermission' => $hasPermission
        ]);
    }
}
