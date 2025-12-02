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
        Schema::create('lucky_egg_rewards', function (Blueprint $table) {
            $table->id();
            $table->foreignId('lucky_egg_id')->constrained()->onDelete('cascade');
            $table->string('phone')->nullable();
            $table->string('reward_type')->nullable(); // lottery_code, points, discount, token, etc.
            $table->string('reward_value')->nullable();
            $table->timestamps();
        });

    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('lucky_egg_rewards');
    }
};
