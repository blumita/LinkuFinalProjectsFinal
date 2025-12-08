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
        Schema::table('users', function (Blueprint $table) {
            $table->string('subscription_type')->default('free')->after('is_pro'); // free, premium
            $table->date('subscription_end_date')->nullable()->after('subscription_type');
            $table->integer('subscription_months')->default(0)->after('subscription_end_date');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn(['subscription_type', 'subscription_end_date', 'subscription_months']);
        });
    }
};
