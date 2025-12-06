# راهنمای حل مشکل درگاه پرداخت (Zarinpal)

## خطای `messages.redirect_url_not_created`

این خطا نشان می‌دهد که درگاه پرداخت Zarinpal نتوانسته لینک پرداخت را ایجاد کند.

## علل احتمالی:

### 1. **کلید API (Merchant ID) نامعتبر یا منقضی شده**
   - مسیر فایل: `api.linku.im/digital-business-card/config/services.php`
   - بررسی کنید:
   ```php
   'zarinpal' => [
       'merchant_id' => env('ZARINPAL_MERCHANT_ID'),
       'callback_url' => env('ZARINPAL_CALLBACK_URL'),
       'sandbox' => env('ZARINPAL_SANDBOX', false),
   ],
   ```

### 2. **تنظیمات `.env` Backend**
   مسیر: `api.linku.im/digital-business-card/.env`
   
   ```env
   ZARINPAL_MERCHANT_ID=xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
   ZARINPAL_CALLBACK_URL=https://linku.im/api/payment/callback
   ZARINPAL_SANDBOX=false
   ```

   **نکات مهم:**
   - `ZARINPAL_MERCHANT_ID` باید یک UUID معتبر باشه (36 کاراکتر)
   - برای تست می‌تونید از Sandbox استفاده کنید: `ZARINPAL_SANDBOX=true`
   - `CALLBACK_URL` باید دقیقاً URL برگشت از درگاه باشه

### 3. **بررسی Controller پرداخت**
   مسیر: `api.linku.im/digital-business-card/app/Http/Controllers/PaymentController.php`
   
   بررسی کنید که:
   - درخواست به Zarinpal درست فرستاده میشه
   - مبلغ به ریال تبدیل شده (× 10)
   - اطلاعات کاربر صحیح ارسال میشه
   - خطاها درست handle میشن

### 4. **بررسی Gateway Service**
   مسیر: `api.linku.im/digital-business-card/app/Services/PaymentGatewayService.php`
   
   ```php
   public function createPaymentRequest($amount, $description, $callback_url, $metadata = [])
   {
       try {
           $response = $this->client->post('https://api.zarinpal.com/pg/v4/payment/request.json', [
               'json' => [
                   'merchant_id' => $this->merchantId,
                   'amount' => $amount, // باید به ریال باشه
                   'description' => $description,
                   'callback_url' => $callback_url,
                   'metadata' => $metadata
               ]
           ]);
           
           return json_decode($response->getBody()->getContents(), true);
       } catch (\Exception $e) {
           \Log::error('Zarinpal API Error: ' . $e->getMessage());
           throw $e;
       }
   }
   ```

### 5. **تست با Sandbox**
   برای تست، از محیط Sandbox استفاده کنید:
   
   ```env
   ZARINPAL_MERCHANT_ID=00000000-0000-0000-0000-000000000000
   ZARINPAL_SANDBOX=true
   ```
   
   در این حالت:
   - URL API: `https://sandbox.zarinpal.com/pg/v4/payment/request.json`
   - Merchant ID برای تست: `00000000-0000-0000-0000-000000000000`

### 6. **بررسی Log ها**
   مسیر: `api.linku.im/digital-business-card/storage/logs/laravel.log`
   
   ```bash
   tail -f storage/logs/laravel.log
   ```
   
   دنبال این خطاها بگردید:
   - `Zarinpal API Error`
   - `Payment request failed`
   - `redirect_url_not_created`

## راه حل‌های پیشنهادی:

### ✅ راه حل 1: بررسی و تست Merchant ID
```bash
# در ترمینال Backend
php artisan tinker

# تست کردن Zarinpal
$service = app(\App\Services\PaymentGatewayService::class);
$result = $service->createPaymentRequest(10000, 'تست پرداخت', 'https://linku.im/callback');
dd($result);
```

### ✅ راه حل 2: استفاده از Sandbox برای تست
در `.env`:
```env
ZARINPAL_SANDBOX=true
```

بعد cache رو پاک کنید:
```bash
php artisan config:clear
php artisan cache:clear
```

### ✅ راه حل 3: بررسی IP و دامنه
- IP سرور شما باید در پنل Zarinpal تأیید شده باشد
- دامنه `linku.im` باید در پنل ثبت شده باشد

### ✅ راه حل 4: پشتیبانی Zarinpal
اگر مشکل حل نشد:
- وارد پنل Zarinpal شوید
- تیکت پشتیبانی بزنید
- کد خطا و جزئیات را ارسال کنید

## تست نهایی:

بعد از اعمال تغییرات:

1. **Restart Backend:**
   ```bash
   php artisan config:clear
   php artisan cache:clear
   php artisan queue:restart  # اگر از queue استفاده می‌کنید
   ```

2. **تست پرداخت:**
   - برید صفحه خرید اشتراک
   - یک پلن انتخاب کنید
   - روی دکمه پرداخت کلیک کنید
   - باید به درگاه Zarinpal منتقل بشید

## لاگ‌های مفید:

```php
// در PaymentController.php
\Log::info('Payment Request:', [
    'planId' => $planId,
    'amount' => $amount,
    'merchant_id' => config('services.zarinpal.merchant_id'),
    'callback_url' => $callbackUrl
]);

// بعد از دریافت پاسخ از Zarinpal
\Log::info('Zarinpal Response:', $response);
```

---

## خلاصه:
مشکل از Backend است نه Frontend. باید:
1. Merchant ID معتبر در `.env` باشد
2. درگاه Zarinpal فعال باشد
3. دامنه و IP در پنل Zarinpal ثبت شده باشد
4. برای تست از Sandbox استفاده کنید

Frontend فقط خطا را نمایش می‌دهد، مشکل اصلی در Backend است. ✅
