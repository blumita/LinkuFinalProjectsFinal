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
        Schema::table('push_subscriptions', function (Blueprint $table) {
            // اضافه کردن user_id برای کاربران عادی
            $table->foreignId('user_id')->nullable()->after('admin_id')->constrained('users')->onDelete('cascade');
        });
        
        // تغییر admin_id به nullable در query جداگانه
        DB::statement('ALTER TABLE push_subscriptions MODIFY admin_id BIGINT UNSIGNED NULL');
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('push_subscriptions', function (Blueprint $table) {
            $table->dropForeign(['user_id']);
            $table->dropColumn('user_id');
        });
        
        DB::statement('ALTER TABLE push_subscriptions MODIFY admin_id BIGINT UNSIGNED NOT NULL');
    }
};
