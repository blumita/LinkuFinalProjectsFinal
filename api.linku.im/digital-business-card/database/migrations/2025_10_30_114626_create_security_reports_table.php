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
        Schema::create('security_reports', function (Blueprint $table) {
            $table->id();

            $table->unsignedBigInteger('reporter_id')->nullable();
            $table->unsignedBigInteger('target_user_id')->nullable();

            $table->string('reporter_name')->nullable();
            $table->string('reporter_email')->nullable();

            $table->enum('type', ['spam','inappropriate','harassment','copyright','fake','other']);
            $table->enum('status', ['open','reviewing','resolved','rejected'])->default('open');
            $table->enum('priority', ['low','medium','high','urgent'])->default('medium');

            $table->string('target_type');
            $table->string('target_name')->nullable();
            $table->string('target_url')->nullable();

            $table->text('description')->nullable();
            $table->json('evidence')->nullable();

            $table->text('admin_notes')->nullable();
            $table->timestamp('resolved_at')->nullable();

            $table->timestamps();
        });


    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('security_reports');
    }
};
