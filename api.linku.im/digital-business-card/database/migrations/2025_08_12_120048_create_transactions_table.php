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
        Schema::create('transactions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->foreignId('order_id')->constrained()->onDelete('cascade');
            $table->string('gateway'); // e.g., zarinpal, mellat, parsian
            $table->string('payment_method');
            $table->double('amount');
            $table->string('authority')->nullable(); // transaction ID from gateway
            $table->string('ref_id')->nullable(); // reference number (if available)
            $table->boolean('is_success')->default(false);
            $table->string('card_pan')->nullable(); // Masked card number (e.g. **** **** **** 1234)
            $table->string('card_hash')->nullable(); // Hashed card identifier for security
            // Transaction status: pending, paid, failed
            $table->string('status')->default('pending');
            $table->timestamp('paid_at')->nullable(); // Timestamp when payment was completed
            $table->text('message')->nullable(); // Gateway response or errors
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('transactions');
    }
};
