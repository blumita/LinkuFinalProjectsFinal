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
        Schema::create('lucky_wheel_results', function (Blueprint $table) {
            $table->id();
            $table->foreignId('card_link_id')->constrained()->onDelete('cascade');
            $table->foreignId('lucky_wheel_id')->constrained()->onDelete('cascade');
            $table->string('phone')->nullable();
            $table->string('result');
            $table->string('lottery_code')->nullable()->unique();
            $table->ipAddress('ip_address')->nullable();
            $table->string('country')->nullable();
            $table->timestamp('read_at')->nullable();
            $table->timestamps();
        });

    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('lucky_wheel_results');
    }
};
