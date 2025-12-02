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
        Schema::create('lucky_wheels', function (Blueprint $table) {
            $table->id();
            $table->foreignId('card_link_id')->constrained()->onDelete('cascade');
            $table->string('title')->default('بازی تخم مرغ شانس');
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('lucky_wheels');
    }
};
