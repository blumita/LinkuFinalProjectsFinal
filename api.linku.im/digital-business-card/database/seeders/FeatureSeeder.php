<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Feature;

class FeatureSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $features = [
            [
                'title' => 'آمار بازدید پیشرفته',
                'slug' => 'advanced-analytics',
                'icon' => 'ti ti-chart-bar',
                'description' => 'دسترسی به آمار کامل بازدید کارت، شامل تعداد کلیک‌ها، زمان بازدید و مکان بازدیدکنندگان',
                'content' => '<h2>آمار بازدید پیشرفته</h2><p>با این ویژگی می‌توانید آمار کامل بازدید کارت خود را مشاهده کنید. این شامل:</p><ul><li>تعداد بازدید روزانه، هفتگی و ماهانه</li><li>مکان جغرافیایی بازدیدکنندگان</li><li>نوع دستگاه بازدیدکنندگان</li><li>ساعت‌های اوج بازدید</li><li>میزان تعامل با هر لینک</li></ul><p>با استفاده از این اطلاعات می‌توانید کارت خود را بهینه‌سازی کنید.</p>',
                'order' => 1,
                'is_active' => true,
            ],
            [
                'title' => 'تم‌های اختصاصی',
                'slug' => 'custom-themes',
                'icon' => 'ti ti-palette',
                'description' => 'دسترسی به تم‌های زیبا و اختصاصی برای شخصی‌سازی کارت کسب‌وکار',
                'content' => '<h2>تم‌های اختصاصی</h2><p>کارت ویزیت دیجیتال خود را با تم‌های زیبا و حرفه‌ای شخصی‌سازی کنید:</p><ul><li>بیش از 50 تم آماده و حرفه‌ای</li><li>امکان ایجاد تم سفارشی</li><li>تغییر رنگ‌ها، فونت‌ها و آیکون‌ها</li><li>تم‌های تاریک و روشن</li></ul>',
                'order' => 2,
                'is_active' => true,
            ],
            [
                'title' => 'لینک‌های نامحدود',
                'slug' => 'unlimited-links',
                'icon' => 'ti ti-link',
                'description' => 'اضافه کردن تعداد نامحدود لینک به کارت ویزیت دیجیتال',
                'content' => '<h2>لینک‌های نامحدود</h2><p>با اشتراک ویژه، محدودیتی برای تعداد لینک‌های شما وجود ندارد:</p><ul><li>اضافه کردن لینک‌های نامحدود</li><li>لینک به شبکه‌های اجتماعی</li><li>لینک به وب‌سایت و پورتفولیو</li><li>لینک دانلود فایل</li><li>لینک تماس مستقیم</li></ul>',
                'order' => 3,
                'is_active' => true,
            ],
            [
                'title' => 'تیک آبی تاییدیه',
                'slug' => 'verified-badge',
                'icon' => 'ti ti-rosette-discount-check',
                'description' => 'نشان تایید شده برای اعتبار بیشتر پروفایل شما',
                'content' => '<h2>تیک آبی تاییدیه</h2><p>با دریافت تیک آبی، اعتبار پروفایل خود را افزایش دهید:</p><ul><li>نشان تایید شده در کنار نام</li><li>افزایش اعتماد بازدیدکنندگان</li><li>متمایز شدن از سایر پروفایل‌ها</li><li>نمایش در جستجوها با اولویت بالاتر</li></ul>',
                'order' => 4,
                'is_active' => true,
            ],
            [
                'title' => 'فرم دریافت سرنخ',
                'slug' => 'lead-capture',
                'icon' => 'ti ti-forms',
                'description' => 'دریافت اطلاعات تماس بازدیدکنندگان علاقه‌مند',
                'content' => '<h2>فرم دریافت سرنخ</h2><p>اطلاعات تماس مشتریان بالقوه را جمع‌آوری کنید:</p><ul><li>فرم تماس سفارشی</li><li>ذخیره اطلاعات بازدیدکنندگان</li><li>اعلان ایمیلی برای سرنخ‌های جدید</li><li>مدیریت و پیگیری سرنخ‌ها</li><li>خروجی CSV از اطلاعات</li></ul>',
                'order' => 5,
                'is_active' => true,
            ],
            [
                'title' => 'QR کد سفارشی',
                'slug' => 'custom-qr',
                'icon' => 'ti ti-qrcode',
                'description' => 'طراحی QR کد سفارشی با لوگو و رنگ دلخواه',
                'content' => '<h2>QR کد سفارشی</h2><p>QR کد منحصر به فرد خود را بسازید:</p><ul><li>افزودن لوگو به QR کد</li><li>تغییر رنگ و شکل QR</li><li>دانلود در فرمت‌های مختلف</li><li>QR کد با کیفیت بالا برای چاپ</li></ul>',
                'order' => 6,
                'is_active' => true,
            ],
            [
                'title' => 'پشتیبانی VIP',
                'slug' => 'vip-support',
                'icon' => 'ti ti-headset',
                'description' => 'دسترسی به پشتیبانی اختصاصی و سریع‌تر',
                'content' => '<h2>پشتیبانی VIP</h2><p>از پشتیبانی ویژه و اولویت‌دار بهره‌مند شوید:</p><ul><li>پاسخگویی سریع‌تر</li><li>پشتیبانی تلفنی</li><li>راهنمایی اختصاصی</li><li>دسترسی به تیم فنی</li></ul>',
                'order' => 7,
                'is_active' => true,
            ],
            [
                'title' => 'بازی‌های تعاملی',
                'slug' => 'interactive-games',
                'icon' => 'ti ti-device-gamepad',
                'description' => 'اضافه کردن بازی‌های جذاب برای افزایش تعامل',
                'content' => '<h2>بازی‌های تعاملی</h2><p>با بازی‌های جذاب، تعامل بازدیدکنندگان را افزایش دهید:</p><ul><li>چرخ شانس</li><li>تخم‌مرغ شانس</li><li>تاس شانس</li><li>جوایز سفارشی</li><li>آمار و گزارش بازی‌ها</li></ul>',
                'order' => 8,
                'is_active' => true,
            ],
        ];

        foreach ($features as $feature) {
            Feature::updateOrCreate(
                ['slug' => $feature['slug']],
                $feature
            );
        }
    }
}
