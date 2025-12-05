<?php

namespace App\Gateways\Sms;

use App\Contracts\OtpSenderInterface;
use App\Exceptions\CustomException;
use Exception;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class ModirPayamak implements OtpSenderInterface
{
    // IPPanel Edge API settings
    protected string $apiKey;
    protected string $patternCode;
    protected string $sender;
    protected string $otpVariable;
    protected string $baseUrl = 'https://edge.ippanel.com/v1';

    public function __construct()
    {
        // Hard-coded values - no config dependency
        $this->apiKey = 'YTA4NDUxYzAtZDMzOC00ZTc3LWIxZjAtZWIzODI2MmI5ZDVhNzQ4YzNiMjVjYTYxYjkxMTIyOGI3MTdhNmUyMDViYmY=';
        $this->patternCode = 'g36m6fr6ozz0e4j';
        $this->sender = '+983000505';
        $this->otpVariable = 'linku-code';
    }

    /**
     * Send SMS using the IPPanel Edge API (Pattern)
     *
     * @param string $phone The recipient's phone number
     * @param string $code The OTP code to send
     * @return bool True if the SMS was sent successfully, false otherwise
     * @throws Exception
     */
    public function send(string $phone, string $code): bool
    {
        // Format phone to E.164 format (+98xxxxxxxxxx)
        $fullPhone = $this->formatPhoneE164($phone);

        // Payload for IPPanel Edge API - Pattern SMS
        // Based on: https://ippanelcom.github.io/Edge-Document/docs/send/pattern
        $payload = [
            'sending_type' => 'pattern',
            'from_number' => $this->sender,
            'code' => $this->patternCode,
            'recipients' => [$fullPhone],
            'params' => [
                $this->otpVariable => $code
            ]
        ];

        $url = "{$this->baseUrl}/api/send";

        Log::info('📱 SMS Send Attempt (IPPanel Edge Pattern)', [
            'url' => $url,
            'phone' => $fullPhone,
            'pattern_code' => $this->patternCode,
            'sender' => $this->sender,
            'otp_variable' => $this->otpVariable,
            'api_key_length' => strlen($this->apiKey),
        ]);

        try {
            // Send POST request with Authorization header (Edge API format)
            $response = Http::timeout(30)
                ->retry(2, 100)
                ->withHeaders([
                    'Authorization' => $this->apiKey,
                    'Content-Type' => 'application/json',
                ])
                ->post($url, $payload);

            $result = $response->json();

            Log::info('📱 SMS Response', [
                'status' => $response->status(),
                'body' => $result,
                'phone' => $fullPhone,
            ]);

            // Check for successful response based on Edge API docs
            // Success: {"data":{"message_outbox_ids":[...]},"meta":{"status":true,...}}
            $isSuccess = $response->successful() 
                && isset($result['meta']['status']) 
                && $result['meta']['status'] === true;

            if ($isSuccess) {
                Log::info("✅ SMS sent successfully to $fullPhone", [
                    'message_outbox_ids' => $result['data']['message_outbox_ids'] ?? []
                ]);
                return true;
            }

            // Handle error response
            $statusCode = $response->status();
            $errorMessage = $result['meta']['message'] ?? 'Unknown error';
            $errorCode = $result['meta']['message_code'] ?? 'unknown';

            Log::error('❌ SMS Send Failed', [
                'status' => $statusCode,
                'error_message' => $errorMessage,
                'error_code' => $errorCode,
                'phone' => $fullPhone,
                'response' => $result,
            ]);

            // در محیط توسعه، exception نزن - فقط لاگ کن
            if (env('APP_ENV') !== 'production') {
                Log::warning("⚠️ SMS failed in dev mode, but continuing...", [
                    'code' => $code,
                    'phone' => $fullPhone
                ]);
                return false;
            }

            throw match ($statusCode) {
                400 => new CustomException('درخواست نامعتبر: ' . $errorMessage),
                401 => new CustomException('خطای احراز هویت سرویس پیامک. توکن نامعتبر است.', 401),
                422 => new CustomException('اطلاعات ارسالی نامعتبر است: ' . $errorMessage, 422),
                429 => new CustomException(__('sms.max_sms_attempts')),
                500, 502, 503 => new CustomException(__('sms.gateway_unavailable')),
                default => new CustomException('خطا در ارسال پیامک: ' . $errorMessage),
            };
        } catch (CustomException $e) {
            throw $e;
        } catch (\Illuminate\Http\Client\ConnectionException $e) {
            Log::error('❌ SMS Connection Error', [
                'error' => $e->getMessage(),
                'phone' => $fullPhone,
            ]);
            
            if (env('APP_ENV') !== 'production') {
                return false;
            }
            
            throw new CustomException('خطا در اتصال به سرویس پیامک. لطفاً دوباره تلاش کنید.', 503);
        } catch (Exception $e) {
            $message = $e->getMessage();

            Log::error('❌ SMS General Error', [
                'error' => $message,
                'phone' => $fullPhone,
            ]);

            if (env('APP_ENV') !== 'production') {
                return false;
            }

            throw new CustomException('خطا در ارسال پیامک: ' . $message, 500);
        }
    }

    /**
     * Format phone number to E.164 format (+98xxxxxxxxxx)
     */
    protected function formatPhoneE164(string $phone): string
    {
        // Remove any non-digit characters except +
        $digits = preg_replace('/[^0-9]/', '', $phone);
        
        // If starts with 9 and is 10 digits (like 9xxxxxxxxx)
        if (strlen($digits) === 10 && str_starts_with($digits, '9')) {
            return '+98' . $digits;
        }
        
        // If starts with 09 and is 11 digits
        if (strlen($digits) === 11 && str_starts_with($digits, '09')) {
            return '+98' . substr($digits, 1);
        }
        
        // If already has 98 prefix (12 digits)
        if (strlen($digits) === 12 && str_starts_with($digits, '98')) {
            return '+' . $digits;
        }
        
        // If already starts with +
        if (str_starts_with($phone, '+')) {
            return $phone;
        }
        
        // Default: prepend +98
        return '+98' . $digits;
    }
}
