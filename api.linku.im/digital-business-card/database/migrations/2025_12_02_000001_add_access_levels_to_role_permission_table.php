<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('role_permission', function (Blueprint $table) {
            $table->boolean('can_read')->default(true)->after('permission_id');
            $table->boolean('can_write')->default(false)->after('can_read');
            $table->boolean('can_delete')->default(false)->after('can_write');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('role_permission', function (Blueprint $table) {
            $table->dropColumn(['can_read', 'can_write', 'can_delete']);
        });
    }
};
