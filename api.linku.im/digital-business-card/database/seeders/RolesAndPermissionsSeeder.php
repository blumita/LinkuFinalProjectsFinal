<?php

namespace Database\Seeders;

use App\Models\Permission;
use App\Models\Role;
use Illuminate\Database\Seeder;

class RolesAndPermissionsSeeder extends Seeder
{
    public function run(): void
    {
        // ساخت نقش‌ها
        $admin = Role::create([
            'name' => 'admin',
            'display_name' => 'ادمین',
            'description' => 'دسترسی کامل به تمام بخش‌ها',
            'priority' => 100,
        ]);

        $manager = Role::create([
            'name' => 'manager',
            'display_name' => 'مدیر',
            'description' => 'مدیریت کاربران و محتوا',
            'priority' => 50,
        ]);

        $premium = Role::create([
            'name' => 'premium',
            'display_name' => 'کاربر پرمیوم',
            'description' => 'کاربر با اشتراک پرمیوم',
            'priority' => 20,
        ]);

        $user = Role::create([
            'name' => 'user',
            'display_name' => 'کاربر عادی',
            'description' => 'کاربر با دسترسی پایه',
            'priority' => 10,
        ]);

        // ساخت مجوزها (به صورت درختی)
        
        // 1. داشبورد
        $dashboard = Permission::create([
            'name' => 'dashboard.view',
            'display_name' => 'داشبورد',
            'group' => 'dashboard',
            'is_menu' => true,
            'menu_icon' => 'home',
            'menu_route' => '/dashboard',
            'menu_order' => 1,
        ]);

        // 2. کارت‌های دیجیتال
        $cards = Permission::create([
            'name' => 'cards.view',
            'display_name' => 'کارت‌های من',
            'group' => 'cards',
            'is_menu' => true,
            'menu_icon' => 'credit-card',
            'menu_route' => '/dashboard/cards',
            'menu_order' => 2,
        ]);

        $cardsCreate = Permission::create([
            'name' => 'cards.create',
            'display_name' => 'ساخت کارت',
            'group' => 'cards',
            'parent_id' => $cards->id,
            'is_menu' => true,
            'menu_icon' => 'plus',
            'menu_route' => '/dashboard/cards/create',
            'menu_order' => 1,
        ]);

        $cardsEdit = Permission::create([
            'name' => 'cards.edit',
            'display_name' => 'ویرایش کارت',
            'group' => 'cards',
            'parent_id' => $cards->id,
        ]);

        $cardsDelete = Permission::create([
            'name' => 'cards.delete',
            'display_name' => 'حذف کارت',
            'group' => 'cards',
            'parent_id' => $cards->id,
        ]);

        // 3. لینک‌ها
        $links = Permission::create([
            'name' => 'links.view',
            'display_name' => 'لینک‌ها',
            'group' => 'links',
            'parent_id' => $cards->id,
            'is_menu' => true,
            'menu_icon' => 'link',
            'menu_route' => '/dashboard/cards/links',
            'menu_order' => 2,
        ]);

        Permission::create([
            'name' => 'links.create',
            'display_name' => 'افزودن لینک',
            'group' => 'links',
            'parent_id' => $links->id,
        ]);

        Permission::create([
            'name' => 'links.edit',
            'display_name' => 'ویرایش لینک',
            'group' => 'links',
            'parent_id' => $links->id,
        ]);

        Permission::create([
            'name' => 'links.delete',
            'display_name' => 'حذف لینک',
            'group' => 'links',
            'parent_id' => $links->id,
        ]);

        // 4. QR Code
        $qr = Permission::create([
            'name' => 'qr.view',
            'display_name' => 'QR Code',
            'group' => 'qr',
            'parent_id' => $cards->id,
            'is_menu' => true,
            'menu_icon' => 'qrcode',
            'menu_route' => '/dashboard/cards/qr',
            'menu_order' => 3,
        ]);

        Permission::create([
            'name' => 'qr.download',
            'display_name' => 'دانلود QR',
            'group' => 'qr',
            'parent_id' => $qr->id,
        ]);

        // 5. آمار و گزارشات
        $analytics = Permission::create([
            'name' => 'analytics.view',
            'display_name' => 'آمار و گزارشات',
            'group' => 'analytics',
            'is_menu' => true,
            'menu_icon' => 'chart-bar',
            'menu_route' => '/dashboard/analytics',
            'menu_order' => 3,
        ]);

        Permission::create([
            'name' => 'analytics.advanced',
            'display_name' => 'آمار پیشرفته',
            'group' => 'analytics',
            'parent_id' => $analytics->id,
            'description' => 'مخصوص کاربران پرمیوم',
        ]);

        // 6. پروفایل
        $profile = Permission::create([
            'name' => 'profile.view',
            'display_name' => 'پروفایل',
            'group' => 'profile',
            'is_menu' => true,
            'menu_icon' => 'user',
            'menu_route' => '/dashboard/profile',
            'menu_order' => 4,
        ]);

        Permission::create([
            'name' => 'profile.edit',
            'display_name' => 'ویرایش پروفایل',
            'group' => 'profile',
            'parent_id' => $profile->id,
        ]);

        // 7. مدیریت کاربران (فقط ادمین)
        $users = Permission::create([
            'name' => 'users.view',
            'display_name' => 'مدیریت کاربران',
            'group' => 'admin',
            'is_menu' => true,
            'menu_icon' => 'users',
            'menu_route' => '/admin/users',
            'menu_order' => 10,
        ]);

        Permission::create([
            'name' => 'users.create',
            'display_name' => 'ساخت کاربر',
            'group' => 'admin',
            'parent_id' => $users->id,
        ]);

        Permission::create([
            'name' => 'users.edit',
            'display_name' => 'ویرایش کاربر',
            'group' => 'admin',
            'parent_id' => $users->id,
        ]);

        Permission::create([
            'name' => 'users.delete',
            'display_name' => 'حذف کاربر',
            'group' => 'admin',
            'parent_id' => $users->id,
        ]);

        // 8. مدیریت نقش‌ها (فقط ادمین)
        $roles = Permission::create([
            'name' => 'roles.view',
            'display_name' => 'مدیریت نقش‌ها',
            'group' => 'admin',
            'is_menu' => true,
            'menu_icon' => 'shield',
            'menu_route' => '/admin/roles',
            'menu_order' => 11,
        ]);

        Permission::create([
            'name' => 'roles.create',
            'display_name' => 'ساخت نقش',
            'group' => 'admin',
            'parent_id' => $roles->id,
        ]);

        Permission::create([
            'name' => 'roles.edit',
            'display_name' => 'ویرایش نقش',
            'group' => 'admin',
            'parent_id' => $roles->id,
        ]);

        Permission::create([
            'name' => 'roles.delete',
            'display_name' => 'حذف نقش',
            'group' => 'admin',
            'parent_id' => $roles->id,
        ]);

        // 9. نوتیفیکیشن‌ها (ادمین و مدیر)
        $notifications = Permission::create([
            'name' => 'notifications.send',
            'display_name' => 'ارسال نوتیفیکیشن',
            'group' => 'admin',
            'is_menu' => true,
            'menu_icon' => 'bell',
            'menu_route' => '/admin/notifications/send',
            'menu_order' => 12,
        ]);

        Permission::create([
            'name' => 'notifications.history',
            'display_name' => 'تاریخچه نوتیفیکیشن',
            'group' => 'admin',
            'parent_id' => $notifications->id,
            'is_menu' => true,
            'menu_route' => '/admin/notifications/history',
        ]);

        // 10. تنظیمات (ادمین)
        $settings = Permission::create([
            'name' => 'settings.view',
            'display_name' => 'تنظیمات',
            'group' => 'admin',
            'is_menu' => true,
            'menu_icon' => 'settings',
            'menu_route' => '/admin/settings',
            'menu_order' => 13,
        ]);

        Permission::create([
            'name' => 'settings.edit',
            'display_name' => 'ویرایش تنظیمات',
            'group' => 'admin',
            'parent_id' => $settings->id,
        ]);

        // اختصاص مجوزها به نقش‌ها

        // Admin: تمام مجوزها
        $allPermissions = Permission::all();
        $admin->permissions()->attach($allPermissions);

        // Manager: همه به جز مدیریت نقش‌ها و تنظیمات
        $managerPermissions = Permission::whereNotIn('group', ['admin'])
            ->orWhereIn('name', ['users.view', 'users.edit', 'notifications.send', 'notifications.history'])
            ->get();
        $manager->permissions()->attach($managerPermissions);

        // Premium: دسترسی‌های پایه + ویژگی‌های پرمیوم
        $premiumPermissions = Permission::whereIn('name', [
            'dashboard.view',
            'cards.view', 'cards.create', 'cards.edit', 'cards.delete',
            'links.view', 'links.create', 'links.edit', 'links.delete',
            'qr.view', 'qr.download',
            'analytics.view', 'analytics.advanced', // آمار پیشرفته
            'profile.view', 'profile.edit',
        ])->get();
        $premium->permissions()->attach($premiumPermissions);

        // User: دسترسی‌های پایه (بدون آمار پیشرفته)
        $userPermissions = Permission::whereIn('name', [
            'dashboard.view',
            'cards.view', 'cards.create', 'cards.edit',
            'links.view', 'links.create', 'links.edit',
            'qr.view',
            'analytics.view', // فقط آمار معمولی
            'profile.view', 'profile.edit',
        ])->get();
        $user->permissions()->attach($userPermissions);

        $this->command->info('✅ Roles and Permissions created successfully!');
    }
}
