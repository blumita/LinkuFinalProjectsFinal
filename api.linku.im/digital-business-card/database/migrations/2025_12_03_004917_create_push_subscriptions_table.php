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
        Schema::create('push_subscriptions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('admin_id')->constrained('admins')->onDelete('cascade');
            $table->string('endpoint', 500); // محدود کردن طول برای استفاده در index
            $table->string('p256dh')->nullable();
            $table->string('auth')->nullable();
            $table->text('keys')->nullable(); // JSON format برای ذخیره کلیدها
            $table->string('content_encoding')->nullable();
            $table->timestamps();
            
            // یک admin می‌تواند چند subscription داشته باشد (مثلا چند دستگاه)
            $table->unique(['admin_id', 'endpoint'], 'admin_endpoint_unique');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('push_subscriptions');
    }
};
