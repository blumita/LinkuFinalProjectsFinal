# راهنمای امنیت API - Linku Backend

این مستند تمام اقدامات امنیتی پیاده‌سازی شده در API را شرح می‌دهد.

## 📋 فهرست

1. [Middleware های امنیتی](#middleware-های-امنیتی)
2. [Rate Limiting](#rate-limiting)
3. [Authentication & Authorization](#authentication--authorization)
4. [محافظت در برابر حملات](#محافظت-در-برابر-حملات)
5. [Logging & Monitoring](#logging--monitoring)
6. [توصیه‌های امنیتی](#توصیه‌های-امنیتی)

---

## 🛡️ Middleware های امنیتی

### 1. SecurityHeaders
**مسیر**: `app/Http/Middleware/SecurityHeaders.php`

هدرهای امنیتی به تمام Response ها اضافه می‌شود:

```php
X-Frame-Options: SAMEORIGIN           // جلوگیری از Clickjacking
X-XSS-Protection: 1; mode=block       // محافظت XSS
X-Content-Type-Options: nosniff       // جلوگیری از MIME Sniffing
Referrer-Policy: strict-origin-when-cross-origin
Content-Security-Policy: default-src 'self'
Strict-Transport-Security: max-age=31536000  // HTTPS اجباری (production)
Permissions-Policy: geolocation=(), microphone=(), camera=()
```

### 2. BlockSuspiciousRequests
**مسیر**: `app/Http/Middleware/BlockSuspiciousRequests.php`

**قابلیت‌ها:**
- ✅ شناسایی SQL Injection
- ✅ شناسایی XSS Attacks
- ✅ شناسایی Path Traversal
- ✅ شناسایی Command Injection
- ✅ مسدود کردن IP های مشکوک
- ✅ Rate Limiting سخت‌گیرانه (60 درخواست در دقیقه)
- ✅ شناسایی User-Agent های مشکوک (scanners, bots)

**نمونه لاگ:**
```json
{
  "level": "warning",
  "message": "Suspicious request detected",
  "ip": "192.168.1.1",
  "url": "/api/auth/login",
  "method": "POST",
  "user_agent": "sqlmap/1.0"
}
```

### 3. AntiBruteForce
**مسیر**: `app/Http/Middleware/AntiBruteForce.php`

**محافظت در برابر Brute Force:**
- 🔒 حداکثر 5 تلاش ناموفق
- ⏰ مسدودی اولیه: 15 دقیقه
- 📈 افزایش تصاعدی زمان مسدودی
- 🎯 Tracking بر اساس: IP + Username Hash

**مثال:**
```
تلاش 1-5: آزاد
تلاش 6+: مسدود 15 دقیقه
تلاش بعدی: مسدود 30 دقیقه
تلاش بعدی: مسدود 45 دقیقه
...
```

**Response نمونه:**
```json
{
  "success": false,
  "message": "به دلیل تلاش‌های ناموفق زیاد، دسترسی شما موقتاً مسدود شده است. لطفاً 15 دقیقه دیگر تلاش کنید.",
  "code": "too_many_attempts",
  "retry_after": 900
}
```

### 4. LogUserActivity
**مسیر**: `app/Http/Middleware/LogUserActivity.php`

**شناسایی محتوای مشکوک:**
- 🚫 اسپم (لینک‌های مشکوک)
- 🚫 آزار و اذیت (کلمات توهین‌آمیز)
- 🚫 محتوای نامناسب (محتوای بزرگسال)
- 🚫 پروفایل جعلی

تمام موارد مشکوک در جدول `security_reports` ثبت می‌شوند.

---

## ⏱️ Rate Limiting

### تنظیمات Rate Limiter
**مسیر**: `app/Providers/RouteServiceProvider.php`

#### 1. OTP Endpoints
```php
Limit: 10 درخواست در 5 دقیقه (per IP)
Routes: 
  - /auth/sendOtpCode
  - /auth/sendEmailOtp
  - /auth/admin/sendOtpEmail
  - /auth/admin/sendOtpSms
```

#### 2. Admin Login
```php
Limit: 5 تلاش در 15 دقیقه (per IP)
Routes:
  - /auth/admin/directLogin
  - /auth/login
Middleware: throttle:admin.login + anti.bruteforce
```

#### 3. General API
```php
Limit: 100 درخواست در دقیقه (per IP)
Applies to: تمام /api/* routes
```

**Response Rate Limit:**
```json
{
  "success": false,
  "message": "تعداد درخواست‌های شما بیش از حد مجاز است.",
  "code": "rate_limit_exceeded"
}
```
**HTTP Status**: `429 Too Many Requests`

---

## 🔐 Authentication & Authorization

### 1. Admin Authentication

#### ورود با نام کاربری (بدون OTP)
```http
POST /auth/admin/directLogin
Content-Type: application/json

{
  "username": "admin@linku.im",  // email یا user_name
  "password": "SecurePassword123"
}
```

**بررسی‌های امنیتی:**
- ✅ Validation ورودی
- ✅ Timing Attack Prevention (تاخیر تصادفی 100-300ms)
- ✅ بررسی وضعیت اکانت (active/inactive)
- ✅ Logging تلاش‌های موفق/ناموفق
- ✅ Rate Limiting (5 تلاش در 15 دقیقه)
- ✅ Anti Brute Force

#### ورود با OTP (ایمیل یا موبایل)
**مرحله 1**: ارسال OTP
```http
POST /auth/admin/sendOtpEmail
POST /auth/admin/sendOtpSms
```

**مرحله 2**: تایید OTP
```http
POST /auth/admin/verifyOtpEmail
POST /auth/admin/verifyOtpSms
```

### 2. Sanctum Token
تمام درخواست‌های authenticated باید شامل:
```http
Authorization: Bearer {token}
```

### 3. Admin Guard
```php
Auth::guard('admin')->login($admin);
```

---

## 🛡️ محافظت در برابر حملات

### 1. SQL Injection
**محافظت:**
- ✅ Eloquent ORM (Prepared Statements)
- ✅ BlockSuspiciousRequests Middleware
- ✅ Input Validation

**پترن‌های شناسایی شده:**
```regex
/union.*?select/i
/select.*?from/i
/drop.*?table/i
/insert.*?into/i
```

### 2. XSS (Cross-Site Scripting)
**محافظت:**
- ✅ Laravel Auto-Escaping (Blade)
- ✅ Content Security Policy Header
- ✅ X-XSS-Protection Header
- ✅ BlockSuspiciousRequests Middleware

**پترن‌های شناسایی شده:**
```regex
/<script[^>]*>.*?<\/script>/i
/javascript:/i
/on\w+\s*=/i  // onclick, onload, etc.
```

### 3. CSRF (Cross-Site Request Forgery)
**محافظت:**
- ✅ Laravel CSRF Protection (Sanctum)
- ✅ SameSite Cookie Policy
- ✅ CORS Configuration

### 4. Path Traversal
**محافظت:**
- ✅ BlockSuspiciousRequests Middleware
- ✅ FileManagerMiddleware (بررسی ownership)

**پترن‌های شناسایی شده:**
```regex
/\.\.[\/\\\\]/i
/\.\.%2f/i
```

### 5. Brute Force
**محافظت:**
- ✅ AntiBruteForce Middleware
- ✅ Rate Limiting
- ✅ مسدودی تصاعدی
- ✅ Timing Attack Prevention

### 6. DDoS
**محافظت:**
- ✅ Rate Limiting چندلایه
- ✅ IP Blocking (موقت/دائمی)
- ✅ توصیه: استفاده از Cloudflare

---

## 📊 Logging & Monitoring

### لاگ‌های امنیتی

#### 1. تلاش‌های ورود ناموفق
```php
Log::warning('Failed admin login', [
    'username' => $username,
    'ip' => $request->ip(),
    'user_agent' => $request->userAgent(),
]);
```

#### 2. درخواست‌های مشکوک
```php
Log::warning('Suspicious request detected', [
    'ip' => $ip,
    'url' => $request->fullUrl(),
    'method' => $request->method(),
    'params' => $request->except(['password', 'token']),
]);
```

#### 3. مسدودی IP
```php
Log::warning('IP temporarily blocked', [
    'ip' => $ip,
    'blocked_until' => now()->addHour(),
]);
```

### مسیر لاگ‌ها
```
storage/logs/laravel.log
```

### بررسی لاگ‌ها
```bash
# آخرین 100 خط
tail -n 100 storage/logs/laravel.log

# فیلتر کردن خطاها
grep "ERROR" storage/logs/laravel.log

# فیلتر کردن تلاش‌های ناموفق
grep "Failed admin login" storage/logs/laravel.log
```

---

## ⚙️ توصیه‌های امنیتی

### 1. تنظیمات Production

#### .env
```env
APP_ENV=production
APP_DEBUG=false
APP_KEY=base64:RANDOM_32_CHARACTER_STRING

# HTTPS اجباری
SESSION_SECURE_COOKIE=true
SANCTUM_STATEFUL_DOMAINS=dash.linku.im

# Database
DB_PASSWORD=StrongRandomPassword
```

#### تنظیمات سرور
```nginx
# HTTPS اجباری
server {
    listen 80;
    return 301 https://$host$request_uri;
}

# Rate Limiting در Nginx
limit_req_zone $binary_remote_addr zone=api:10m rate=10r/s;
limit_req zone=api burst=20 nodelay;
```

### 2. به‌روزرسانی منظم
```bash
# Laravel و Package ها
composer update

# بررسی آسیب‌پذیری‌ها
composer audit

# PHP
sudo apt update && sudo apt upgrade php
```

### 3. Backup منظم
```bash
# دیتابیس (روزانه)
php artisan backup:run --only-db

# فایل‌ها (هفتگی)
php artisan backup:run
```

### 4. Monitoring
**توصیه ابزارها:**
- Laravel Telescope (Development)
- Sentry (Error Tracking)
- New Relic (Performance)
- Cloudflare (DDoS Protection)

### 5. SSL/TLS
```bash
# نصب Let's Encrypt
sudo certbot --nginx -d api.linku.im

# تمدید خودکار
sudo crontab -e
0 0 * * * certbot renew --quiet
```

### 6. Firewall
```bash
# فعال کردن UFW
sudo ufw enable

# مجاز کردن SSH, HTTP, HTTPS
sudo ufw allow 22
sudo ufw allow 80
sudo ufw allow 443

# مسدود کردن IP مشکوک
sudo ufw deny from 192.168.1.1
```

---

## 🚨 گزارش مشکلات امنیتی

اگر آسیب‌پذیری امنیتی پیدا کردید:

1. **خصوصی**: از طریق ایمیل گزارش دهید (نه GitHub Issues)
2. **جزئیات**: شرح کامل + مراحل Reproduce
3. **زمان**: ما ظرف 48 ساعت پاسخ می‌دهیم

---

## ✅ Checklist امنیتی

- [x] HTTPS اجباری
- [x] Rate Limiting فعال
- [x] CORS تنظیم شده
- [x] CSRF Protection
- [x] SQL Injection Prevention
- [x] XSS Protection
- [x] Brute Force Protection
- [x] Logging فعال
- [x] Security Headers
- [x] Input Validation
- [x] Password Hashing (bcrypt)
- [x] Token Authentication (Sanctum)
- [x] Error Handling (بدون افشای اطلاعات حساس)
- [x] File Upload Restrictions
- [x] Admin Guard Separation
- [ ] Two-Factor Authentication (در صورت نیاز)
- [ ] IP Whitelist برای ادمین (اختیاری)

---

**آخرین به‌روزرسانی**: 3 دسامبر 2025  
**نسخه**: 2.0.0
