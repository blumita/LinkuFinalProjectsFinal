<?php

namespace Tests\Feature;

use App\Models\OtpCode;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;

class OtpTest extends TestCase
{
    use RefreshDatabase;

    /*public function test_otp_send_with_valid_mobile()
    {
        $response = $this->postJson('/api/auth/sendOtpCode', [
            'phone' => '09355851170',
            'countryCode'=>'98'
        ]);

        $response->assertStatus(200);
        $response->assertJsonStructure(['message']);

        $this->assertDatabaseHas('otp_codes', [
            'phone' => '9355851170',
        ]);
    }

    public function test_otp_send_with_invalid_mobile()
    {
        $response = $this->postJson('/api/auth/sendOtpCode', [
            //'phone' => 'invalid',
            'countryCode'=>'98'
        ]);

        $response->assertStatus(422); // Validation error
        $response->assertJsonValidationErrors(['phone']);

    }
    public function test_otp_send_with_invalid_country_code()
    {
        $response = $this->postJson('/api/auth/sendOtpCode', [
            'phone' => '09355851170',
            //'countryCode'=>'invalid'
        ]);

        $response->assertStatus(422); // Validation error
        $response->assertJsonValidationErrors(['countryCode']);

    }*/

    public function test_otp_verify_with_valid_code()
    {

        OtpCode::create([
            'phone' => '9355851170',
            'code' => '1234',
            'expires_at' => now()->addMinutes(2),
        ]);

        $response = $this->postJson('/api/auth/verifyOtpCode', [
            'phone' => '9355851170',
            'code' => '1234',
            'countryCode'=>'98'
        ]);

        $response->assertStatus(200);
        $response->assertJsonStructure(['token']);

        $token = $response->json('token');
        dump($token);
    }

    /*public function test_otp_verify_with_invalid_code()
    {
        OtpCode::create([
            'mobile' => '09355851170',
            'code' => '1234',
            'expires_at' => now()->addMinutes(2),
        ]);

        $response = $this->postJson('/api/otp/verify', [
            'mobile' => '9355851170',
            'code' => '0000',
        ]);

        $response->assertStatus(401); // Unauthorized
        $response->assertJson(['message' => 'Invalid OTP']);
    }*/
}
