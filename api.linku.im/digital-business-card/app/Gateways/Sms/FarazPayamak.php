<?php

namespace App\Gateways\Sms;

use App\Contracts\OtpSenderInterface;
use App\Exceptions\CustomException;
use Exception;
use Illuminate\Support\Facades\Http;

class FarazPayamak implements OtpSenderInterface
{
    protected mixed $config;

    // API endpoint
    protected string $url = 'https://edge.ippanel.com/v1/api/send';

    public function __construct()
    {
        $this->config = config('otp-login');
    }

    /**
     * Send SMS using the specified API
     *
     * @param string $phone The recipient's phone number
     * @param string $code
     * @return bool True if the SMS was sent successfully, false otherwise
     * @throws Exception
     */
    public function send(string $phone, string $code): bool
    {

        $payload = [
            'sending_type' => 'pattern',
            'from_number' => $this->config['sender'],
            'code' => $this->config['key'],
            'recipients' => [$phone],
            'params' => ['verification-code' => $code]
        ];

        try {
            $response = Http::withToken($this->config['api_key'])
            ->asJson()
                ->post($this->url, $payload);

            if ($response->successful()) {
                return true;
            }

            throw new CustomException('ارسال پیامک ناموفق بود: ' . $response->status());
        } catch (Exception $e) {
            throw new CustomException('خطا در ارسال پیامک: ' . $e->getMessage());
        }
    }
}
