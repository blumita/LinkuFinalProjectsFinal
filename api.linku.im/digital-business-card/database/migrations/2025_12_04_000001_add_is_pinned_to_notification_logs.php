<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('notification_logs', function (Blueprint $table) {
            $table->boolean('is_pinned')->default(false)->after('is_sent');
            $table->index('is_pinned');
        });
        
        // Add is_pinned to notifications table too
        Schema::table('notifications', function (Blueprint $table) {
            $table->boolean('is_pinned')->default(false)->after('read_at');
            $table->index('is_pinned');
        });
    }

    public function down(): void
    {
        Schema::table('notification_logs', function (Blueprint $table) {
            $table->dropIndex(['is_pinned']);
            $table->dropColumn('is_pinned');
        });
        
        Schema::table('notifications', function (Blueprint $table) {
            $table->dropIndex(['is_pinned']);
            $table->dropColumn('is_pinned');
        });
    }
};
