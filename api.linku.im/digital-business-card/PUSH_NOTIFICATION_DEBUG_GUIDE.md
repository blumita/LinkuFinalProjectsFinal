# راهنمای Debug کردن مشکل Push Notification

## 🔍 چطوری لاگ‌ها رو ببینم؟

### 1. مشاهده لاگ‌های لحظه‌ای (Real-time)
```bash
cd api.linku.im/digital-business-card
tail -f storage/logs/laravel.log
```

### 2. مشاهده لاگ‌های امروز
```bash
cat storage/logs/laravel-$(date +%Y-%m-%d).log
```

### 3. فیلتر کردن فقط لاگ‌های Push Notification
```bash
tail -f storage/logs/laravel.log | grep "Push Notification"
```

## 📊 لاگ‌های مهم و معنی اون‌ها

### ✅ لاگ‌های موفقیت‌آمیز

#### 1. کاربران پیدا شدن
```
🔵 [Push Notification] Found users
{
  "recipients": "all",
  "total_users": 150,
  "user_ids": [1, 2, 3, ...]
}
```
**معنی**: تعداد کاربرانی که باید نوتیفیکیشن بهشون بره

#### 2. شروع ارسال
```
📤 [Push Notification] Starting immediate send
{
  "title": "عنوان نوتیفیکیشن",
  "message": "پیام شما",
  "type": "system"
}
```

#### 3. پردازش هر کاربر
```
👤 [Push Notification] Processing user
{
  "user_id": 123,
  "email": "user@example.com",
  "subscriptions_count": 2
}
```
**مهم**: اگر `subscriptions_count` صفر باشه، یعنی کاربر هیچ دستگاهی ثبت نکرده

#### 4. Subscription اضافه شد
```
📱 [Push Subscription] Added subscription
{
  "user_id": 123,
  "subscription_id": 456,
  "endpoint": "https://fcm.googleapis.com/fcm/send/..."
}
```

#### 5. شروع ارسال Push
```
🚀 [Push Notification] Starting push send
{
  "total_subscriptions": 250
}
```

#### 6. ارسال موفق
```
✅ [Push Notification] Push send completed
{
  "sent": 240,
  "failed": 10,
  "total": 250
}
```

### ⚠️ لاگ‌های هشدار (مشکلات احتمالی)

#### 1. هیچ Subscription پیدا نشد
```
⚠️ [Push Notification] No push subscriptions found for users
```
**علت**: کاربرا notification permission ندادن یا PWA نصب نکردن
**راه حل**: بررسی کن که آیا کاربرا در فرانت‌اند، notification permission رو accept کردن؟

#### 2. WebPush نصب نیست
```
⚠️ [Push Notification] WebPush package not installed. Skipping push notifications.
```
**علت**: پکیج `web-push-php` نصب نیست
**راه حل**: 
```bash
composer require minishlink/web-push
```

#### 3. Push ارسال نشد
```
⚠️ [WebPushService] Push failed
{
  "endpoint": "https://fcm.googleapis.com/fcm/send/...",
  "reason": "410 Gone",
  "expired": true
}
```
**علت‌های احتمالی**:
- `410 Gone`: Subscription منقضی شده، باید پاک بشه از دیتابیس
- `401 Unauthorized`: کلیدهای VAPID اشتباه هستن
- `404 Not Found`: Endpoint دیگه معتبر نیست

### ❌ لاگ‌های خطا

#### 1. خطا در Queue کردن
```
❌ [WebPushService] Failed to queue notification
{
  "index": 5,
  "error": "Invalid subscription format",
  "endpoint": "..."
}
```
**علت**: فرمت subscription در دیتابیس اشتباه است

#### 2. خطای کلی در ارسال
```
❌ [Push Notification] Failed to send push notifications
{
  "error": "VAPID keys not configured",
  "trace": "..."
}
```

## 🔧 چک‌لیست Debug

### مرحله 1: بررسی کاربران
```bash
# تعداد کاربران فعال
grep "Found users" storage/logs/laravel.log | tail -1
```
- اگر `total_users: 0` باشه → مشکل در انتخاب کاربران
- اگر `total_users > 0` باشه → ✅ این مرحله OK

### مرحله 2: بررسی Subscriptions
```bash
# تعداد Subscriptions هر کاربر
grep "Processing user" storage/logs/laravel.log | tail -20
```
- اگر `subscriptions_count: 0` برای همه کاربرا باشه → مشکل اصلی اینجاست!
- اگر `subscriptions_count > 0` باشه → ✅ این مرحله OK

### مرحله 3: بررسی دیتابیس
```sql
-- تعداد کل Subscriptions
SELECT COUNT(*) FROM push_subscriptions;

-- Subscriptions هر کاربر
SELECT user_id, COUNT(*) as count 
FROM push_subscriptions 
GROUP BY user_id;

-- بررسی یک Subscription نمونه
SELECT * FROM push_subscriptions LIMIT 1;
```

### مرحله 4: بررسی VAPID Keys
```bash
# چک کردن .env
cat .env | grep VAPID

# باید این‌ها رو داشته باشی:
# VAPID_PUBLIC_KEY=...
# VAPID_PRIVATE_KEY=...
```

### مرحله 5: بررسی نتیجه ارسال
```bash
# آخرین نتیجه ارسال
grep "Push send completed" storage/logs/laravel.log | tail -1
```
- اگر `sent: 0` باشه → هیچ push ارسال نشده
- اگر `failed` زیاد باشه → بررسی کن چرا fail شدن

## 🐛 مشکلات رایج و راه حل

### مشکل 1: نوتیفیکیشن به گوشی نمیرسه ولی تو پنل ادمین "موفق" میگه
**علت**: Database notification میره ولی Push notification نمیره
**راه حل**: 
1. چک کن لاگ `No push subscriptions found` داره؟
2. بررسی کن کاربرا notification permission دادن؟
3. چک کن PWA نصب شده و Service Worker ثبت شده؟

### مشکل 2: همه push ها fail میشن
**علت احتمالی**: VAPID keys اشتباه
**راه حل**:
```bash
# تولید VAPID keys جدید
php artisan webpush:vapid

# کپی کردن به .env
# بعد restart کردن سرور
```

### مشکل 3: بعضی کاربرا میگیرن، بعضی نمیگیرن
**علت**: Subscriptions منقضی شده
**راه حل**: پاک کردن subscriptions منقضی
```sql
-- پیدا کردن subscriptions قدیمی
SELECT * FROM push_subscriptions 
WHERE updated_at < DATE_SUB(NOW(), INTERVAL 30 DAY);

-- پاک کردن (با احتیاط!)
DELETE FROM push_subscriptions 
WHERE updated_at < DATE_SUB(NOW(), INTERVAL 90 DAY);
```

### مشکل 4: فقط اولین نوتیفیکیشن میره، بعدی‌ها نه
**علت**: Service Worker cache مشکل داره یا subscription expire شده
**راه حل**: 
1. کاربر باید PWA رو uninstall و دوباره install کنه
2. یا Clear Site Data کنه از تنظیمات مرورگر

## 📈 تست کردن Push Notification

### تست دستی از Postman
```http
POST /api/user/admin/notifications/send
Authorization: Bearer YOUR_TOKEN

{
  "recipients": "specific",
  "userIds": [YOUR_USER_ID],
  "type": "system",
  "title": "تست نوتیفیکیشن",
  "message": "این یک پیام تستی است",
  "actionLink": "/dashboard"
}
```

### تست از کد PHP
```php
// test-notification.php در root پروژه
<?php

require __DIR__.'/vendor/autoload.php';

$app = require_once __DIR__.'/bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

$user = \App\Models\User::find(1); // ID کاربر مورد نظر

$user->notify(new \App\Notifications\SystemNotification(
    \App\Enums\SystemNotificationType::GENERAL,
    'تست Push',
    'این یک تست است'
));

echo "Notification sent!\n";
```

## 📞 اگه بازم کار نکرد

1. **لاگ‌های کامل رو بفرست**:
   ```bash
   tail -200 storage/logs/laravel.log > notification-debug.log
   ```

2. **نتیجه این کوئری رو بفرست**:
   ```sql
   SELECT 
     COUNT(*) as total_users,
     (SELECT COUNT(*) FROM push_subscriptions) as total_subscriptions,
     (SELECT COUNT(DISTINCT user_id) FROM push_subscriptions) as users_with_subscription
   FROM users;
   ```

3. **چک کن VAPID keys هست یا نه**:
   ```bash
   echo $VAPID_PUBLIC_KEY
   echo $VAPID_PRIVATE_KEY
   ```

## 🎯 خلاصه: مراحل Debug

1. ✅ لاگ‌های جدید رو فعال کردیم
2. ✅ نوتیفیکیشن بفرست از پنل ادمین
3. ✅ لاگ‌ها رو بخون با `tail -f storage/logs/laravel.log | grep "Push"`
4. ✅ ببین کدوم مرحله fail میشه
5. ✅ از جدول بالا راه حل رو پیدا کن

**الان یه نوتیفیکیشن تستی بفرست و بیا لاگ‌ها رو بررسی کنیم! 🚀**
