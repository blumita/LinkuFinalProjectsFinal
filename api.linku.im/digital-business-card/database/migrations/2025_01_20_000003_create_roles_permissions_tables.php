<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // جدول نقش‌ها
        Schema::create('roles', function (Blueprint $table) {
            $table->id();
            $table->string('name')->unique(); // admin, manager, user, premium
            $table->string('display_name'); // نام نمایشی
            $table->text('description')->nullable();
            $table->integer('priority')->default(0); // اولویت (admin=100, user=1)
            $table->boolean('is_active')->default(true);
            $table->timestamps();
            
            $table->index('name');
            $table->index('is_active');
        });

        // جدول مجوزها (Permissions)
        Schema::create('permissions', function (Blueprint $table) {
            $table->id();
            $table->string('name')->unique(); // dashboard.view, users.create
            $table->string('display_name'); // مشاهده داشبورد
            $table->string('group')->nullable(); // dashboard, users, cards
            $table->foreignId('parent_id')->nullable()->constrained('permissions')->onDelete('cascade');
            $table->text('description')->nullable();
            $table->boolean('is_menu')->default(false); // آیا منو است؟
            $table->string('menu_icon')->nullable(); // آیکون منو
            $table->string('menu_route')->nullable(); // مسیر منو
            $table->integer('menu_order')->default(0); // ترتیب نمایش
            $table->timestamps();
            
            $table->index('name');
            $table->index('group');
            $table->index('parent_id');
        });

        // جدول ارتباط نقش و مجوز (Many to Many)
        Schema::create('role_permission', function (Blueprint $table) {
            $table->id();
            $table->foreignId('role_id')->constrained('roles')->onDelete('cascade');
            $table->foreignId('permission_id')->constrained('permissions')->onDelete('cascade');
            $table->timestamps();
            
            $table->unique(['role_id', 'permission_id']);
            $table->index('role_id');
            $table->index('permission_id');
        });

        // اضافه کردن role_id به جدول users
        Schema::table('users', function (Blueprint $table) {
            $table->foreignId('role_id')->nullable()->after('id')->constrained('roles')->onDelete('set null');
            $table->index('role_id');
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropForeign(['role_id']);
            $table->dropColumn('role_id');
        });
        
        Schema::dropIfExists('role_permission');
        Schema::dropIfExists('permissions');
        Schema::dropIfExists('roles');
    }
};
