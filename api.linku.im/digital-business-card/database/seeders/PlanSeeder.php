<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Plan;
use Illuminate\Support\Str;

class PlanSeeder extends Seeder
{
    public function run(): void
    {
        $features = [
            ["title" => "ساخت تا ۳ کارت ویزیت", "icon" => "ti-id", "description" => ""],
            ["title" => "ایجاد QR کد اختصاصی", "icon" => "ti-qrcode", "description" => ""],
            ["title" => "تحلیل‌های دقیق و دائمی", "icon" => "ti-chart-line", "description" => ""],
            ["title" => "قالب‌های حرفه‌ای نمایه", "icon" => "ti-layout-dashboard", "description" => ""],
            ["title" => "لینک‌های پرو نامحدود", "icon" => "ti-link", "description" => ""],
            ["title" => "آیکون و عنوان سفارشی", "icon" => "ti-pencil", "description" => ""],
            ["title" => "نشان تایید پروفایل", "icon" => "ti-rosette-discount-check", "description" => ""],
            ["title" => "فرم‌های جذب اختصاصی", "icon" => "ti-forms", "description" => ""],
            ["title" => "پشتیبانی VIP کاربران ویژه", "icon" => "ti-crown", "description" => ""],
        ];

        $plans = [
            ["title" => "پایه", "subtitle" => "برای شروع کار", "duration" => "ماه", "discount" => 0, "price" => 990000, "popularity" => "normal"],
            ["title" => "حرفه‌ای", "subtitle" => "برای کسب و کارها", "duration" => "3ماه", "discount" => 20, "price" => 790000, "popularity" => "normal"],
            ["title" => "سازمانی", "subtitle" => "برای سازمان‌ها", "duration" => "6ماه", "discount" => 40, "price" => 590000, "popularity" => "normal"],
            ["title" => "ویژه", "subtitle" => "برای کسب و کار خاص", "duration" => "سال", "discount" => 71, "price" => 290000, "popularity" => "highlighted"],
        ];

        foreach ($plans as $planData) {
            Plan::updateOrCreate(
                array_merge($planData, [
                    'slug' => Str::slug($planData['title']),
                    'description' => '',
                    'features' => $features,
                    'active' => 'draft',
                ])
            );
        }
    }
}
