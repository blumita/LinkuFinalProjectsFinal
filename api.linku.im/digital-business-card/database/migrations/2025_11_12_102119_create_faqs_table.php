<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('faqs', function (Blueprint $table) {
            $table->id();
            $table->string('question'); // سوال
            $table->text('answer');     // پاسخ
            $table->boolean('active')->default(true); // وضعیت فعال یا غیرفعال
            $table->unsignedInteger('order')->default(0); // ترتیب نمایش
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('faqs');
    }
};
