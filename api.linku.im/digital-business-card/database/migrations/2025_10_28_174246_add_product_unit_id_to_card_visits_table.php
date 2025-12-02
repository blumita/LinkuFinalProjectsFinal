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
        Schema::table('card_visits', function (Blueprint $table) {
            $table->unsignedBigInteger('product_unit_id')->nullable()->after('card_type');
        });
    }

    public function down(): void
    {
        Schema::table('card_visits', function (Blueprint $table) {
            $table->dropColumn('product_unit_id');
        });
    }
};
