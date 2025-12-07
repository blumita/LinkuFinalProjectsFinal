# 🔐 راهنمای اصلاح خطای VAPID Keys

## ❌ مشکل فعلی:
```
[VAPID] You must provide a public key.
```

این خطا زمانی رخ میده که:
1. `VAPID_PUBLIC_KEY` یا `VAPID_PRIVATE_KEY` در `.env` تنظیم نشده
2. Config cache شده و کلیدها رو نمی‌بینه
3. کلیدها خالی هستن

## ✅ راه حل (مرحله به مرحله):

### مرحله 1: چک کردن کلیدها در سرور

```bash
cd /var/www/api.linku.im/digital-business-card
cat .env | grep VAPID
```

**باید این‌ها رو ببینی**:
```env
VAPID_PUBLIC_KEY=BFzttfamBJ5XHjuy55yNQTCdkR2rbgE3J0oYQHmEgoiRJPPrLWPt5lkTBZn7jS30UBdMLCeBplkznfAoZSjXkUY
VAPID_PRIVATE_KEY=mdaS-WH8cmi1czZYoj3Fl6nE554buDrh_d47hunqul0
```

### مرحله 2: اگر کلیدها وجود ندارند، تولید کنید

#### گزینه A: استفاده از کامند Laravel (توصیه میشه)
```bash
php artisan webpush:vapid
```

این کامند دو خط مثل این چاپ میکنه:
```
VAPID_PUBLIC_KEY=...
VAPID_PRIVATE_KEY=...
```

#### گزینه B: تولید دستی با Node.js
```bash
npx web-push generate-vapid-keys
```

#### گزینه C: تولید دستی با PHP
یه اسکریپت موقت بساز:
```bash
nano generate-vapid.php
```

محتوای فایل:
```php
<?php
require __DIR__.'/vendor/autoload.php';

use Minishlink\WebPush\VAPID;

$keys = VAPID::createVapidKeys();

echo "VAPID_PUBLIC_KEY=" . $keys['publicKey'] . "\n";
echo "VAPID_PRIVATE_KEY=" . $keys['privateKey'] . "\n";
```

اجرا:
```bash
php generate-vapid.php
```

### مرحله 3: کلیدها رو در `.env` قرار بده

```bash
nano .env
```

اضافه کن یا ویرایش کن:
```env
VAPID_PUBLIC_KEY=YOUR_PUBLIC_KEY_HERE
VAPID_PRIVATE_KEY=YOUR_PRIVATE_KEY_HERE
```

**مهم**: مطمئن شو که:
- ✅ هیچ فاصله اضافی وجود نداره
- ✅ کلیدها کامل کپی شدن
- ✅ quote یا " وجود نداره

### مرحله 4: پاک کردن کش Laravel

```bash
php artisan config:clear
php artisan cache:clear
php artisan optimize:clear
```

### مرحله 5: تست کردن

```bash
php artisan tinker
```

در tinker:
```php
config('services.vapid.public_key')
config('services.vapid.private_key')
```

باید کلیدها رو نشون بده (نه `null`)

خروج از tinker:
```php
exit
```

### مرحله 6: تست Push Notification

```bash
php artisan notifications:send-scheduled
```

اگر خطای VAPID نیومد، یعنی مشکل حل شد! ✅

## 🔍 چک کردن لاگ‌ها

```bash
tail -50 storage/logs/laravel.log | grep -E "VAPID|WebPush|Push"
```

**لاگ موفق**:
```
[WebPushService] Push sent successfully
```

**لاگ هشدار (اگه VAPID نباشه)**:
```
⚠️ VAPID keys not configured. Push notifications will be disabled.
```

**خطا (قبل از فیکس)**:
```
[VAPID] You must provide a public key.
```

## 📝 کلیدهای موجود در پروژه (فقط برای توسعه محلی)

اگر برای تست محلی نیاز داری:
```env
VAPID_PUBLIC_KEY=BFzttfamBJ5XHjuy55yNQTCdkR2rbgE3J0oYQHmEgoiRJPPrLWPt5lkTBZn7jS30UBdMLCeBplkznfAoZSjXkUY
VAPID_PRIVATE_KEY=mdaS-WH8cmi1czZYoj3Fl6nE554buDrh_d47hunqul0
```

⚠️ **توجه**: برای سرور production باید کلیدهای جدید تولید کنی!

## 🚀 فیکس اضافی که انجام دادم:

1. ✅ WebPushService حالا VAPID رو از config می‌خونه (نه env)
2. ✅ اگه VAPID نباشه، exception نمیزنه - فقط warning لاگ میکنه
3. ✅ متد `isConfigured()` اضافه شد برای چک کردن
4. ✅ تمام متدها قبل از ارسال push، VAPID رو چک می‌کنن
5. ✅ Config file `services.php` آپدیت شد

## 🐛 اگر بازم کار نکرد:

### چک 1: مالکیت فایل‌ها
```bash
ls -la .env
# باید www-data یا user وب سرور مالک باشه
chown www-data:www-data .env
chmod 644 .env
```

### چک 2: Restart PHP-FPM
```bash
systemctl restart php8.4-fpm
# یا
service php8.4-fpm restart
```

### چک 3: بررسی دقیق config
```bash
php artisan config:show services.vapid
```

باید نشون بده:
```
services.vapid.public_key => "BFztt..."
services.vapid.private_key => "mdaS-..."
```

### چک 4: تست مستقیم با PHP
```bash
php -r "require 'vendor/autoload.php'; echo env('VAPID_PUBLIC_KEY');"
```

## 🎯 تست نهایی

بعد از اعمال تمام مراحل:
```bash
# 1. پاک کردن لاگ قدیمی
> storage/logs/laravel.log

# 2. اجرای دستور scheduler
php artisan schedule:run

# 3. بررسی لاگ جدید
tail -20 storage/logs/laravel.log
```

اگر دیگه خطای VAPID نیومد، مشکل حل شده! 🎉

## ℹ️ توضیح تغییرات کد:

قبل:
```php
$this->webPush = new WebPush([
    'VAPID' => [
        'publicKey' => env('VAPID_PUBLIC_KEY'),  // ❌ در runtime کار نمیکنه
        'privateKey' => env('VAPID_PRIVATE_KEY'),
    ]
]);
```

بعد:
```php
$publicKey = config('services.vapid.public_key') ?? env('VAPID_PUBLIC_KEY');
$privateKey = config('services.vapid.private_key') ?? env('VAPID_PRIVATE_KEY');

if (empty($publicKey) || empty($privateKey)) {
    \Log::warning('⚠️ VAPID keys not configured');
    $this->webPush = new WebPush([]);  // جلوگیری از crash
    return;
}

$this->webPush = new WebPush([
    'VAPID' => [
        'publicKey' => $publicKey,
        'privateKey' => $privateKey,
    ]
]);
```

این باعث میشه:
- ✅ Config cache مشکل ایجاد نکنه
- ✅ اگه VAPID نباشه، سرور crash نکنه
- ✅ لاگ واضح بزنه که مشکل چیه
