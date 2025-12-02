<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('notification_logs', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->text('message');
            $table->enum('type', ['all', 'premium', 'free', 'specific'])->default('all');
            $table->string('action_link')->nullable();
            $table->json('recipient_ids')->nullable(); // برای specific users
            $table->integer('sent_count')->default(0);
            $table->integer('delivered_count')->default(0);
            $table->integer('clicked_count')->default(0);
            $table->timestamp('scheduled_for')->nullable(); // برای cron jobs
            $table->boolean('is_sent')->default(false);
            $table->timestamps();
            
            $table->index('type');
            $table->index('scheduled_for');
            $table->index('is_sent');
            $table->index('created_at');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('notification_logs');
    }
};
