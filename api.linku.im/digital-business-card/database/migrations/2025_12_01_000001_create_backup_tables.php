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
        Schema::create('backup_settings', function (Blueprint $table) {
            $table->id();
            $table->boolean('auto_backup_enabled')->default(false);
            $table->enum('backup_frequency', ['hourly', 'daily', 'weekly', 'monthly'])->default('daily');
            $table->string('backup_time')->nullable()->default('03:00'); // زمان پشتیبان‌گیری
            $table->tinyInteger('backup_day')->nullable()->default(0); // روز هفته (0=یکشنبه، 6=شنبه)
            $table->json('backup_destinations')->nullable(); // ['local', 'sftp', 'github']
            
            // GitHub settings
            $table->string('github_repo')->nullable(); // user/repo
            $table->text('github_token')->nullable(); // Personal Access Token
            $table->string('github_branch')->nullable()->default('main');
            $table->boolean('github_is_private')->default(false);
            
            // SFTP settings
            $table->boolean('sftp_enabled')->default(false);
            $table->string('sftp_host')->nullable();
            $table->string('sftp_username')->nullable();
            $table->text('sftp_password')->nullable();
            $table->string('sftp_path')->nullable()->default('/backups');
            
            // Retention
            $table->integer('retention_days')->default(30);
            
            $table->timestamps();
        });

        Schema::create('backup_logs', function (Blueprint $table) {
            $table->id();
            $table->string('destination'); // local, sftp, github
            $table->string('path');
            $table->bigInteger('size')->default(0);
            $table->enum('status', ['success', 'failed'])->default('success');
            $table->text('error_message')->nullable();
            $table->timestamp('created_at')->useCurrent();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('backup_logs');
        Schema::dropIfExists('backup_settings');
    }
};
