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
        Schema::table('cards', function (Blueprint $table) {
            $table->unsignedInteger('card_number')->default(1)->after('card_name');
        });

        // شماره‌گذاری کارت‌های موجود برای هر کاربر
        $users = DB::table('cards')
            ->select('user_id')
            ->distinct()
            ->pluck('user_id');

        foreach ($users as $userId) {
            $cards = DB::table('cards')
                ->where('user_id', $userId)
                ->orderBy('created_at')
                ->get();

            $number = 1;
            foreach ($cards as $card) {
                DB::table('cards')
                    ->where('id', $card->id)
                    ->update(['card_number' => $number]);
                $number++;
            }
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('cards', function (Blueprint $table) {
            $table->dropColumn('card_number');
        });
    }
};
