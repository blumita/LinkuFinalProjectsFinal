# 📱 راهنمای Debug کردن مشکل SMS

## 🔍 چطوری لاگ‌ها رو ببینم؟

### 1. مشاهده لاگ‌های لحظه‌ای (Real-time)
```bash
cd api.linku.im/digital-business-card
tail -f storage/logs/laravel.log
```

### 2. فیلتر کردن فقط لاگ‌های SMS
```bash
tail -f storage/logs/laravel.log | grep -E "SMS|OTP|🔑|📱|✅|❌"
```

### 3. مشاهده آخرین 100 خط لاگ
```bash
tail -100 storage/logs/laravel.log
```

### 4. جستجوی لاگ‌های امروز
```bash
cat storage/logs/laravel-$(date +%Y-%m-%d).log | grep SMS
```

## 📊 لاگ‌های مهم و معنی آن‌ها

### ✅ لاگ‌های موفقیت‌آمیز

#### 1. تولید کد OTP
```
🔑 OTP Generated
{
  "phone": "9xxxxxxxxx",
  "code_length": 4
}
```
**معنی**: کد 4 رقمی تولید شد

#### 2. تلاش برای ارسال SMS
```
📱 SMS Send Attempt (IPPanel Edge Pattern)
{
  "url": "https://edge.ippanel.com/v1/api/send",
  "phone": "+989xxxxxxxxx",
  "pattern_code": "g36m6fr6ozz0e4j",
  "sender": "+983000505",
  "otp_variable": "linku-code",
  "api_key_length": 88
}
```
**نکته**: اگر `api_key_length` صفر باشه، یعنی API Key تنظیم نشده

#### 3. پاسخ موفق از IPPanel
```
📱 SMS Response
{
  "status": 200,
  "body": {
    "meta": {
      "status": true,
      "message": "عملیات موفقیت‌آمیز بود"
    },
    "data": {
      "message_outbox_ids": [123456789]
    }
  },
  "phone": "+989xxxxxxxxx"
}
```

#### 4. تایید ارسال موفق
```
✅ SMS sent successfully to +989xxxxxxxxx
{
  "message_outbox_ids": [123456789]
}
```

#### 5. تایید OTP موفق
```
✅ OTP verified successfully
{
  "phone": "9xxxxxxxxx",
  "deleted": true
}
```

### ⚠️ لاگ‌های هشدار

#### 1. کد قبلی هنوز معتبر است
```
❌ OTP Send Exception
{
  "error": "کد تایید قبلی هنوز معتبر است",
  "phone": "9xxxxxxxxx",
  "code": "code_already_valid",
  "remaining_seconds": 540
}
```
**علت**: کاربر کمتر از 10 دقیقه پیش کد گرفته و هنوز معتبره
**راه حل**: منتظر بمون تا کد منقضی بشه یا از کد قبلی استفاده کن

#### 2. کد اشتباه وارد شده
```
❌ OTP not found in database
{
  "phone": "9xxxxxxxxx",
  "code": "1234"
}
```
**علت**: کد وارد شده در دیتابیس وجود نداره
**احتمالات**:
- کاربر کد اشتباه وارد کرده
- کد منقضی شده و پاک شده
- شماره تلفن اشتباه است

#### 3. کد منقضی شده
```
❌ OTP expired
{
  "phone": "9xxxxxxxxx",
  "expires_at": "2025-12-07 10:00:00",
  "now": "2025-12-07 10:11:00"
}
```
**علت**: کد بیشتر از 10 دقیقه گذشته
**راه حل**: درخواست کد جدید

### ❌ لاگ‌های خطا

#### 1. خطای احراز هویت IPPanel (401)
```
❌ SMS Send Failed
{
  "status": 401,
  "error_message": "توکن نامعتبر است",
  "error_code": "unauthorized",
  "phone": "+989xxxxxxxxx"
}
```
**علت**: `SMS_API_KEY` در `.env` اشتباه است یا منقضی شده
**راه حل**: 
1. برو به پنل IPPanel
2. توکن API جدید بگیر
3. در `.env` تنظیم کن:
```env
SMS_API_KEY=NEW_TOKEN_HERE
```
4. کش رو پاک کن:
```bash
php artisan config:clear
php artisan cache:clear
```

#### 2. خطای Pattern Code نامعتبر (422)
```
❌ SMS Send Failed
{
  "status": 422,
  "error_message": "کد الگو یافت نشد",
  "error_code": "pattern_not_found"
}
```
**علت**: `SMS_PATTERN_CODE` در `.env` اشتباه است
**راه حل**:
1. برو به پنل IPPanel → الگوهای پیامکی
2. کد الگوی OTP رو کپی کن
3. در `.env` تنظیم کن:
```env
SMS_PATTERN_CODE=CORRECT_PATTERN_CODE
```

#### 3. خطای اتصال به IPPanel (503)
```
❌ SMS Connection Error
{
  "error": "Connection timeout",
  "phone": "+989xxxxxxxxx"
}
```
**علت‌های احتمالی**:
- IPPanel داون است
- اینترنت سرور قطع است
- فایروال IPPanel رو بلاک کرده
**راه حل**: چک کن که سرور به اینترنت دسترسی داره:
```bash
curl https://edge.ippanel.com/v1/api/send
```

#### 4. شماره تلفن نامعتبر
```
❌ Invalid phone format
{
  "original": "0912345678",
  "normalized": "912345678"
}
```
**علت**: شماره فرمت صحیح نداره (باید 9xxxxxxxxx باشه)

## 🛠️ چک‌لیست Debug

### مرحله 1: بررسی تنظیمات `.env`
```bash
cd api.linku.im/digital-business-card
cat .env | grep SMS
```
باید این‌ها رو ببینی:
```env
OTP_SMS_DRIVER=modirpayamak
SMS_PATTERN_CODE=g36m6fr6ozz0e4j
SMS_SENDER=+983000505
SMS_OTP_VARIABLE=linku-code
SMS_API_KEY=YTA4NDUx... (طولانی)
```

✅ چک کن:
- [ ] `SMS_API_KEY` پر شده و طولانی است (حدود 88 کاراکتر)
- [ ] `SMS_PATTERN_CODE` درست است
- [ ] `SMS_SENDER` شماره فرستنده درست است
- [ ] `SMS_OTP_VARIABLE` با نام متغیر در pattern مطابقت داره

### مرحله 2: تست دستی از Postman

#### ارسال OTP
```http
POST https://api.linku.im/api/v1/sendOtpCode
Content-Type: application/json

{
  "phone": "09123456789",
  "countryCode": "+98"
}
```

**پاسخ موفق**:
```json
{
  "message": "کد تایید با موفقیت ارسال شد",
  "data": null
}
```

**پاسخ ناموفق**:
```json
{
  "success": false,
  "message": "خطا در ارسال پیامک: ...",
  "data": null
}
```

#### تایید OTP
```http
POST https://api.linku.im/api/v1/verifyOtpCode
Content-Type: application/json

{
  "phone": "09123456789",
  "countryCode": "+98",
  "code": "1234",
  "name": "تست کاربر"
}
```

### مرحله 3: بررسی دیتابیس

```sql
-- مشاهده آخرین OTP های ارسال شده
SELECT * FROM otp_codes 
ORDER BY created_at DESC 
LIMIT 10;

-- بررسی OTP های منقضی نشده
SELECT * FROM otp_codes 
WHERE expires_at > NOW() 
ORDER BY created_at DESC;

-- تعداد OTP های یک شماره
SELECT phone, COUNT(*) as count, MAX(expires_at) as last_expires
FROM otp_codes 
GROUP BY phone 
ORDER BY count DESC;
```

### مرحله 4: تست اتصال به IPPanel

```bash
# تست اتصال به API
curl -X POST https://edge.ippanel.com/v1/api/send \
  -H "Authorization: YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "sending_type": "pattern",
    "from_number": "+983000505",
    "code": "g36m6fr6ozz0e4j",
    "recipients": ["+989123456789"],
    "params": {
      "linku-code": "1234"
    }
  }'
```

## 🐛 مشکلات رایج و راه حل

### مشکل 1: SMS ارسال نمیشه ولی خطایی نمیده
**احتمال 1**: محیط توسعه (dev mode)
```php
// در ModirPayamak.php خط 100
if (env('APP_ENV') !== 'production') {
    Log::warning("⚠️ SMS failed in dev mode, but continuing...");
    return false;
}
```
**راه حل**: موقتاً `APP_ENV=production` کن یا این بلاک رو کامنت کن

**احتمال 2**: کش Laravel
```bash
php artisan config:clear
php artisan cache:clear
php artisan route:clear
```

### مشکل 2: API Key نامعتبر است
**علت**: توکن منقضی شده یا اشتباه است
**راه حل**:
1. لاگین به پنل IPPanel
2. برو به: تنظیمات → API → مدیریت توکن‌ها
3. توکن جدید بساز
4. در `.env` قرار بده و کش رو پاک کن

### مشکل 3: Pattern Code پیدا نمیشه
**علت**: کد الگو اشتباه است یا الگو غیرفعال شده
**راه حل**:
1. برو به: الگوهای پیامکی → لیست الگوها
2. الگوی OTP رو پیدا کن
3. مطمئن شو که "فعال" است
4. کد الگو رو کپی کن و در `.env` قرار بده

### مشکل 4: متغیر الگو اشتباه است
**علت**: `SMS_OTP_VARIABLE` با نام متغیر در الگو مطابقت نداره
**راه حل**:
1. در پنل IPPanel، الگوی خودت رو باز کن
2. ببین متن الگو چیه، مثلاً:
```
کد تایید شما: {linku-code}
```
3. در `.env` باید باشه:
```env
SMS_OTP_VARIABLE=linku-code
```

### مشکل 5: شماره فرستنده اشتباه است
**علت**: `SMS_SENDER` مربوط به پنل شما نیست
**راه حل**:
1. برو به: خطوط من
2. شماره فرستنده رو کپی کن (مثلاً `+983000505`)
3. در `.env` تنظیم کن

## 🎯 سناریوی کامل Debug

1. **لاگ لحظه‌ای رو روشن کن**:
```bash
tail -f storage/logs/laravel.log | grep -E "SMS|OTP|🔑|📱"
```

2. **از Postman یا فرانت درخواست OTP بفرست**

3. **لاگ‌ها رو بخون**:
   - ✅ اگه `🔑 OTP Generated` دیدی → کد تولید شد
   - ✅ اگه `📱 SMS Send Attempt` دیدی → درخواست به IPPanel رفت
   - ✅ اگه `📱 SMS Response` با status 200 دیدی → IPPanel جواب داد
   - ✅ اگه `✅ SMS sent successfully` دیدی → SMS ارسال شد
   - ❌ اگه `❌ SMS Send Failed` دیدی → ببین چه خطایی داده

4. **دیتابیس رو چک کن**:
```sql
SELECT * FROM otp_codes WHERE phone = '9123456789' ORDER BY created_at DESC LIMIT 1;
```
باید یه رکورد با `expires_at` در آینده ببینی

5. **کد رو تست کن** از Postman با `/verifyOtpCode`

## 📞 اگه بازم کار نکرد

1. **لاگ‌های کامل 100 خط آخر رو بگیر**:
```bash
tail -100 storage/logs/laravel.log > sms-debug.log
```

2. **تنظیمات SMS رو بفرست**:
```bash
cat .env | grep SMS > sms-config.txt
```

3. **نتیجه Query دیتابیس رو بفرست**:
```sql
SELECT * FROM otp_codes ORDER BY created_at DESC LIMIT 5;
```

4. **وضعیت اتصال به IPPanel رو چک کن**:
```bash
curl -I https://edge.ippanel.com
```

**یادت باشه**: در محیط `dev`، اگه SMS fail کنه، exception نمیزنه فقط لاگ می‌کنه!
