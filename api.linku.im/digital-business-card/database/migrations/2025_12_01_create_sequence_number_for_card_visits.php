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
        // اضافه کردن فیلد sequence_number به card_visits
        Schema::table('card_visits', function (Blueprint $table) {
            $table->unsignedInteger('sequence_number')->default(1)->after('id');
            $table->index('sequence_number');
        });

        // مقداردهی اولیه: شماره‌گذاری از 1 تا آخر بر اساس created_at
        $visits = DB::table('card_visits')
            ->orderBy('created_at')
            ->orderBy('id')
            ->get();

        $number = 1;
        foreach ($visits as $visit) {
            DB::table('card_visits')
                ->where('id', $visit->id)
                ->update(['sequence_number' => $number]);
            $number++;
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('card_visits', function (Blueprint $table) {
            $table->dropColumn('sequence_number');
        });
    }
};
