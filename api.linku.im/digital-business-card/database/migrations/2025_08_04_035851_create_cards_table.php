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
        Schema::create('cards', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users');
            $table->string('slug')->unique()->nullable(false);
            $table->string('card_name');
            $table->string('layout_mode')->nullable();
            $table->string('save_contact')->nullable();
            $table->string('theme_color')->default('#ffffff');
            $table->string('icon_color')->default('#000000');
            $table->boolean('single_link')->default(false);
            $table->boolean('is_default')->default(false);
            $table->boolean('lead_capture_mode')->default(false);
            $table->boolean('match_theme_color')->default(false);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('cards');
    }
};
