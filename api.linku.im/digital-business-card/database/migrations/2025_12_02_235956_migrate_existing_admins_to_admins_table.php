<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // انتقال ادمین‌های موجود از جدول users به admins
        $adminUsers = DB::table('users')
            ->where('role', 'admin')
            ->get();

        foreach ($adminUsers as $user) {
            // چک کنیم که قبلاً منتقل نشده باشه
            $exists = DB::table('admins')
                ->where('email', $user->email)
                ->exists();

            if (!$exists) {
                DB::table('admins')->insert([
                    'first_name' => $user->first_name ?? '',
                    'last_name' => $user->last_name ?? '',
                    'name' => $user->name,
                    'user_name' => $user->user_name,
                    'phone' => $user->phone,
                    'email' => $user->email,
                    'password' => $user->password,
                    'country_code' => $user->country_code ?? '+98',
                    'status' => $user->status ?? 'active',
                    'role_id' => $user->role_id,
                    'created_at' => $user->created_at,
                    'updated_at' => $user->updated_at,
                ]);
            }
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // در صورت rollback می‌توانیم ادمین‌ها را حذف کنیم
    }
};
