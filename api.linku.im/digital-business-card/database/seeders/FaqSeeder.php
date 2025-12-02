<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Faq;

class FaqSeeder extends Seeder
{
    public function run(): void
    {
        Faq::insert([
            [
                'question' => 'چطور رمز عبور خود را تغییر دهم؟',
                'answer' => 'از بخش تنظیمات حساب، رمز عبور جدید را وارد کنید.',
                'order' => 1,
            ],
            [
                'question' => 'آیا می‌توانم حسابم را حذف کنم؟',
                'answer' => 'بله، با مراجعه به پشتیبانی درخواست حذف حساب دهید.',
                'order' => 2,
            ],
        ]);
    }
}
