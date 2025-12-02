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
        Schema::create('question_boxes', function (Blueprint $table) {
            $table->id();
            $table->foreignId('card_link_id')->constrained('card_links');
            $table->foreignId('card_id')->constrained()->onDelete('cascade');
            $table->string('question');
            $table->string('description');
            $table->timestamp('read_at')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('form');
    }
};
