<?php

namespace Database\Seeders;

use App\Models\Admin;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class AdminSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create a default admin user
        Admin::create([
            'first_name' => 'مدیر',
            'last_name' => 'سیستم',
            'name' => 'مدیر سیستم',
            'user_name' => 'admin',
            'email' => 'admin@linku.im',
            'phone' => '9123456789',
            'country_code' => '+98',
            'password' => Hash::make('admin123456'),
            'status' => 'active',
            'role_id' => 1, // Assuming role_id 1 is super admin
        ]);
    }
}
