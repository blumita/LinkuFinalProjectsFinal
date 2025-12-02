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
        Schema::create('card_links', function (Blueprint $table) {
            $table->id();
            $table->foreignId('card_id')->constrained('cards');
            $table->json('data');
            $table->string('hash')->unique()->nullable(false);
            $table->unsignedInteger('clicks')->default(0);
            $table->boolean('enabled')->default(true);
            $table->unsignedInteger('order')->nullable();
            $table->boolean('asSelectedSingleLink')->default(false);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('card_links');
    }
};
