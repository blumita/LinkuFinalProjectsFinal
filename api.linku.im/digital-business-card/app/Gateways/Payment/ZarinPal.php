<?php

namespace App\Gateways\Payment;

use App\Contracts\GatewayInterface;
use Exception;
use Illuminate\Http\Client\ConnectionException;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class ZarinPal implements GatewayInterface
{
    public const GATEWAY_NAME='zarinpal';
    protected string $merchantId;
    protected bool $sandbox;
    protected string $callbackUrl;
    protected string $redirectUrl;
    protected string $baseUrl;

    /**
     * Load gateway configuration from package config file.
     */
    public function __construct()
    {
        $this->merchantId = config('smart-payment.merchant_id');
        $this->sandbox = config('smart-payment.sandbox', false);

        // Set base URL depending on sandbox mode
        $this->baseUrl = $this->sandbox
            ? 'https://sandbox.zarinpal.com/pg/v4/payment/request.json'
            : 'https://payment.zarinpal.com/pg/v4/payment/request.json';
    }

    /**
     * Initiates a payment request to Zarinpal and returns the redirect URL.
     *
     * @param float $amount Payment amount in Toman
     * @param string $callbackUrl URL to redirect after payment
     * @param array $meta Optional metadata (email, mobile, description)
     * @return array Contains 'authority' and 'redirect_url'
     *
     * @throws ConnectionException If HTTP request fails
     * @throws Exception If Zarinpal returns an error code
     */
    public function pay(float $amount, string $callbackUrl, array $meta = []): mixed
    {
        $this->callbackUrl = $callbackUrl;

        $response = Http::withHeaders([
            'Accept' => 'application/json',
        ])->post($this->baseUrl, [
            'merchant_id' => $this->merchantId,
            'amount' => (int) $amount,
            'callback_url' => $this->callbackUrl,
            'description' => $meta['description'] ?? 'پرداخت سفارش',
            'metadata' => [
                'email' => $meta['email'] ?? null,
                'mobile' => $meta['mobile'] ?? null,
            ],
        ]);

        $data = $response->json();

        Log::info('Zarinpal PaymentRequest', ['response' => $data]);

        // بررسی خطاهای احتمالی
        if (!isset($data['data']) || !is_array($data['data'])) {
            Log::error('Zarinpal Invalid Response', ['response' => $data]);
            throw new Exception('Zarinpal Invalid Response: ' . json_encode($data));
        }
        
        $code = $data['data']['code'] ?? null;
        $authority = $data['data']['authority'] ?? null;
        
        if ($code != 100 || empty($authority)) {
            $errorMessage = $data['errors']['message'] ?? ($data['data']['message'] ?? 'Unknown error');
            Log::error('Zarinpal Payment Error', ['code' => $code, 'message' => $errorMessage]);
            throw new Exception('Zarinpal Payment Error: ' . $errorMessage . ' (Code: ' . $code . ')');
        }

        $this->redirectUrl = $this->sandbox
            ? "https://sandbox.zarinpal.com/pg/StartPay/{$authority}"
            : "https://payment.zarinpal.com/pg/StartPay/{$authority}";

        return [
            'authority' => $authority,
            'redirect_url' => $this->getRedirectUrl(),
        ];
    }

    /**
     * Verifies the transaction after user returns from Zarinpal.
     *
     * @param array $requestData Contains 'Authority', 'Status', and 'Amount'
     * @return array Verification result including ref ID, card info, and fees
     *
     * @throws ConnectionException If HTTP request fails
     * @throws Exception If payment was canceled or data is invalid
     */
    public function verify(array $requestData): array
    {
        $this->baseUrl = $this->sandbox
            ? 'https://sandbox.zarinpal.com/pg/v4/payment/verify.json'
            : 'https://payment.zarinpal.com/pg/v4/payment/verify.json';

        $authority = $requestData['Authority'] ?? null;
        $status = $requestData['Status'] ?? null;

        if (!$authority || strtolower($status) !== 'ok') {
            throw new Exception('پرداخت توسط کاربر لغو شد یا داده ناقص بود.');
        }

        $response = Http::withHeaders([
            'Accept' => 'application/json',
        ])->post($this->baseUrl, [
            'merchant_id' => $this->merchantId,
            'authority' => $authority,
            'amount' => (int)$requestData['Amount'],
        ]);

        $data = $response->json();

        Log::info('Zarinpal PaymentVerification', ['response' => $data]);

        // بررسی کد پاسخ و استخراج اطلاعات تراکنش
        if (isset($data['data']['code'])) {
            if ($data['data']['code'] == 100) {
                return [
                    'Message' => $data['data']['message'],
                    'RefID' => $data['data']['ref_id'],
                    'CardHash' => $data['data']['card_hash'],
                    'CardPan' => $data['data']['card_pan'],
                    'Fee' => $data['data']['fee'],
                    'FeeType' => $data['data']['fee_type'],
                    'ShaparakFee' => $data['data']['shaparak_fee'],
                    'OrderId' => $data['data']['order_id'],
                ];
            } elseif ($data['data']['code'] == 101) {
                return [
                    'message' => 'Payment already verified',
                    'ref_id' => $data['data']['ref_id'],
                ];
            }
        }

        return ['error' => 'Payment failed or unauthorized transaction'];
    }

    /**
     * Returns the redirect URL for the payment gateway.
     *
     * @return string
     */
    public function getRedirectUrl(): string
    {
        return $this->redirectUrl;
    }

    /**
     * Indicates whether the user should be redirected to the gateway.
     *
     * @return bool
     */
    public function shouldRedirect(): bool
    {
        return true;
    }

}
