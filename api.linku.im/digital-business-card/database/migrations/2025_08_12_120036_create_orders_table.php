<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     *
     * Creates the 'orders' table to store payment-related order data.
     */
    public function up(): void
    {
        Schema::create('orders', function (Blueprint $table) {
            $table->id(); // Primary key

            $table->unsignedBigInteger('user_id')->nullable(); // If related to a user
            $table->foreignId('plan_id')->constrained()->onDelete('cascade');
            $table->string('title');
            $table->unsignedBigInteger('amount'); // Stored in rials or smallest currency unit
            $table->string('status')->default('pending'); // pending, paid, failed
            $table->json('metadata')->nullable(); // Extra data like email, mobile
            $table->dateTime('start_date')->nullable();
            $table->dateTime('end_date')->nullable();
            $table->string('currency')->default('IRR'); // Currency code (default: Iranian Rial)
            $table->string('authority')->nullable(); // Add authority field for tracking payment
            $table->string('description')->nullable(); // Optional description or notes
            $table->timestamps(); // Created_at and updated_at timestamps
        });
    }

    /**
     * Reverse the migrations.
     *
     * Drops the 'orders' table.
     */
    public function down(): void
    {
        Schema::dropIfExists('orders');
    }
};
