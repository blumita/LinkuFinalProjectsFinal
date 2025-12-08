# 💳 راهنمای عیب‌یابی و رفع مشکل درگاه پرداخت

## 📋 خلاصه سیستم پرداخت

### مسیر کامل:
```
Frontend (Nuxt) → POST /payment → Laravel API → ZarinPal Gateway → Redirect
```

### فایل‌های مهم:
1. **Frontend**: `pages/dashboard/checkout/order.vue`
2. **Backend Controller**: `app/Http/Controllers/v1/PaymentController.php`
3. **Service**: `app/Services/PaymentService.php`
4. **Gateway**: `app/Gateways/Payment/ZarinPal.php`
5. **Config**: `config/smart-payment.php`
6. **Routes**: `routes/api.php`

---

## 🔍 دستورات بررسی لاگ در سرور

### 1. اتصال به سرور
```bash
ssh root@95.215.59.92
```

### 2. بررسی لاگ Laravel
```bash
# لاگ اصلی Laravel
tail -f /var/www/api.linku.im/digital-business-card/storage/logs/laravel.log

# 100 خط آخر
tail -n 100 /var/www/api.linku.im/digital-business-card/storage/logs/laravel.log

# جستجوی خطاهای payment
grep -i "payment" /var/www/api.linku.im/digital-business-card/storage/logs/laravel.log | tail -50

# جستجوی خطاهای امروز
grep "$(date +%Y-%m-%d)" /var/www/api.linku.im/digital-business-card/storage/logs/laravel.log | grep -i error
```

### 3. بررسی لاگ Nginx
```bash
# لاگ دسترسی (access log)
tail -f /var/log/nginx/api.linku.im_access.log

# لاگ خطا (error log)
tail -f /var/log/nginx/api.linku.im_error.log

# فیلتر روی payment requests
tail -f /var/log/nginx/api.linku.im_access.log | grep payment
```

### 4. بررسی لاگ PHP
```bash
# لاگ PHP-FPM
tail -f /var/log/php8.2-fpm.log

# یا
tail -f /var/log/php-fpm/error.log
```

### 5. بررسی وضعیت سرویس‌ها
```bash
# وضعیت Nginx
sudo systemctl status nginx

# وضعیت PHP-FPM
sudo systemctl status php8.2-fpm

# وضعیت MySQL
sudo systemctl status mysql
```

---

## 🐛 مشکلات شایع و راه‌حل

### ❌ مشکل 1: `redirect_url_not_created`

**علت**: درگاه ZarinPal پاسخ نمی‌دهد یا merchant_id اشتباه است.

**راه‌حل**:

```bash
# بررسی .env
cd /var/www/api.linku.im/digital-business-card
cat .env | grep GATEWAY

# باید ببینی:
# GATEWAY_MERCHANT_ID=xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
```

اگر خالی است یا اشتباه است:

```bash
nano .env

# اضافه کن:
GATEWAY_MERCHANT_ID=e7403b01-5bf0-43d3-b4ef-f0a00a2335a1

# ذخیره: Ctrl+O, Enter, Ctrl+X

# پاک کردن کش
php artisan config:clear
php artisan cache:clear
```

### ❌ مشکل 2: خطای 500 Internal Server Error

**بررسی**:

```bash
# لاگ دقیق Laravel
tail -n 50 /var/www/api.linku.im/digital-business-card/storage/logs/laravel.log
```

**راه‌حل‌های احتمالی**:

1. **Permission Issue**:
```bash
cd /var/www/api.linku.im/digital-business-card
sudo chown -R www-data:www-data storage bootstrap/cache
sudo chmod -R 775 storage bootstrap/cache
```

2. **Database Connection**:
```bash
# تست اتصال MySQL
mysql -u linku_user -p linku_db

# اگر خطا داد، بررسی .env
cat .env | grep DB_
```

3. **Missing Dependencies**:
```bash
cd /var/www/api.linku.im/digital-business-card
composer install --no-dev --optimize-autoloader
```

### ❌ مشکل 3: خطای CORS

**علت**: دامنه frontend اجازه دسترسی به API ندارد.

**راه‌حل**:

```bash
nano /var/www/api.linku.im/digital-business-card/config/cors.php
```

بررسی کنید که:
```php
'allowed_origins' => ['https://dash.linku.im', 'https://linku.im'],
```

### ❌ مشکل 4: Callback برنمی‌گرده

**علت**: URL callback اشتباه است یا ZarinPal نمی‌تونه بهش برسه.

**بررسی**:

```bash
# لاگ callback
grep "callback/payment" /var/log/nginx/api.linku.im_access.log | tail -20
```

**راه‌حل**:

```bash
# بررسی route
cd /var/www/api.linku.im/digital-business-card
php artisan route:list | grep callback

# باید ببینی:
# GET|HEAD  api/callback/payment  callback.payment
```

---

## 🧪 تست درگاه پرداخت

### تست 1: بررسی API Endpoint

```bash
# با curl
curl -X POST https://api.linku.im/api/payment \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "planId": 1,
    "amount": 1000000,
    "discountCode": "",
    "metadata": {"mobile": "09123456789"},
    "gateway": "zarinpal"
  }'
```

### تست 2: بررسی ZarinPal مستقیم

```php
// در tinker
php artisan tinker

$gateway = app(\App\Gateways\Payment\ZarinPal::class);
$result = $gateway->pay(
    10000, 
    'https://api.linku.im/api/callback/payment?gateway=zarinpal&order_id=1',
    ['mobile' => '09123456789', 'description' => 'تست']
);
print_r($result);
```

### تست 3: Log برای Debug

در `PaymentService.php` اضافه کنید:

```php
public function pay($data, $user): array
{
    Log::info('Payment initiated', [
        'user_id' => $user->id,
        'plan_id' => $data['planId'],
        'amount' => $data['amount']
    ]);
    
    return DB::transaction(function () use ($data, $user) {
        // ... کد موجود
        
        try {
            $result = $gateway->pay(
                $data['amount'],
                $callbackUrl,
                $data['metadata'] ?? []
            );
            
            Log::info('Payment gateway response', $result);
            
            return $result;
        } catch (\Exception $e) {
            Log::error('Payment gateway error', [
                'message' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            throw $e;
        }
    });
}
```

---

## 🔧 چک‌لیست عیب‌یابی

### Backend (Laravel)
- [ ] `.env` دارای `GATEWAY_MERCHANT_ID` صحیح است
- [ ] `APP_ENV=production` تنظیم شده
- [ ] Config cache پاک شده: `php artisan config:clear`
- [ ] Composer dependencies نصب شده
- [ ] Permission های storage و bootstrap/cache درست است
- [ ] Database connection کار می‌کند
- [ ] Route `/api/payment` موجود است
- [ ] Middleware auth برای payment فعال است

### Frontend (Nuxt)
- [ ] Axios baseURL به `https://api.linku.im` اشاره می‌کند
- [ ] Token authentication صحیح است
- [ ] CORS مشکلی ندارد
- [ ] Request data شامل تمام فیلدهای required است
- [ ] Error handling صحیح است

### ZarinPal
- [ ] Merchant ID معتبر است
- [ ] حساب ZarinPal active است
- [ ] Callback URL صحیح است و دسترسی داشته باشد
- [ ] در production (نه sandbox) هستیم

### Network
- [ ] سرور به اینترنت دسترسی دارد
- [ ] Firewall پورت‌های 80 و 443 را باز کرده
- [ ] SSL Certificate معتبر است
- [ ] DNS به درستی تنظیم شده

---

## 📞 دستورات اضافی برای Debugging

### Debug Mode موقت
```bash
# فعال کردن debug mode
cd /var/www/api.linku.im/digital-business-card
nano .env

# تغییر به:
APP_DEBUG=true
LOG_LEVEL=debug

# بعد از debug، برگردون به:
APP_DEBUG=false
LOG_LEVEL=error
```

### Live Monitoring
```bash
# نمایش real-time لاگ Laravel
tail -f storage/logs/laravel.log | grep -i payment

# نمایش real-time Nginx
tail -f /var/log/nginx/api.linku.im_access.log | grep POST
```

### Database Query Log
در `app/Providers/AppServiceProvider.php`:

```php
public function boot()
{
    if (config('app.debug')) {
        \DB::listen(function($query) {
            \Log::info('Query', [
                'sql' => $query->sql,
                'bindings' => $query->bindings,
                'time' => $query->time
            ]);
        });
    }
}
```

---

## 🚨 دستورات اضطراری

اگر سرور به مشکل خورد:

```bash
# Restart همه سرویس‌ها
sudo systemctl restart nginx
sudo systemctl restart php8.2-fpm
sudo systemctl restart mysql

# پاک کردن کش Laravel
cd /var/www/api.linku.im/digital-business-card
php artisan cache:clear
php artisan config:clear
php artisan route:clear
php artisan view:clear

# Optimize برای production
php artisan config:cache
php artisan route:cache
php artisan optimize
```

---

## 📧 اطلاعات تماس پشتیبانی ZarinPal

- سایت: https://www.zarinpal.com
- پنل: https://panel.zarinpal.com
- پشتیبانی: support@zarinpal.com
- تلفن: 021-41493000

---

## ✅ تست نهایی

بعد از رفع مشکل:

1. ✅ یک پرداخت تست از dashboard انجام دهید
2. ✅ لاگ Laravel را بررسی کنید
3. ✅ لاگ Nginx را بررسی کنید  
4. ✅ بررسی کنید callback درست کار می‌کند
5. ✅ بررسی کنید transaction در database ثبت شده
6. ✅ بررسی کنید user upgrade شده

