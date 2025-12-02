<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use App\Models\User;

class AdminUserSeeder extends Seeder
{
    public function run(): void
    {
        User::updateOrCreate(
            ['phone' => '9030264300'],
            [
                'name' => 'مدیر سیستم',
                'user_name' => 'admin',
                'phone' => '9030264300',
                'email' => 'admin@linku.im',
                'email_verified_at' => now(),
                'password' => Hash::make('admin1234'), // رمز عبور امن
                'location' => 'Tehran',
                'country_code' => 'IR',
                'is_pro' => true,
                'remove_branding' => true,
                'role' => 'admin',
                'referral_code' => null,
                'referred_by' => null,
            ]
        );
    }
}

