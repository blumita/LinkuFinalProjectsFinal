<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

/**
 * Migration: Clear OTP Rate Limits and Fix Database
 *
 * This migration:
 * 1. Clears all cached rate limit entries for OTP
 * 2. Creates email_otp_codes table if not exists
 * 3. Cleans up expired OTP codes
 */
return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // 1. ایجاد جدول email_otp_codes اگه وجود نداره
        if (!Schema::hasTable('email_otp_codes')) {
            Schema::create('email_otp_codes', function (Blueprint $table) {
                $table->id();
                $table->string('email');
                $table->string('code', 6);
                $table->timestamp('expires_at');
                $table->timestamps();
                
                $table->index('email');
                $table->index(['email', 'code']);
            });
        }

        // 2. پاک کردن rate limit های OTP از جدول cache
        if (Schema::hasTable('cache')) {
            DB::table('cache')
                ->where('key', 'like', '%otp%')
                ->orWhere('key', 'like', '%throttle%')
                ->orWhere('key', 'like', '%rate_limit%')
                ->orWhere('key', 'like', '%limiter%')
                ->delete();
        }
        
        // 3. پاک کردن OTP کدهای منقضی شده
        if (Schema::hasTable('otp_codes')) {
            DB::table('otp_codes')
                ->where('expires_at', '<', now())
                ->delete();
        }
        
        // 4. پاک کردن Email OTP کدهای منقضی شده
        if (Schema::hasTable('email_otp_codes')) {
            DB::table('email_otp_codes')
                ->where('expires_at', '<', now())
                ->delete();
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // این migration قابل برگشت نیست
    }
};
