# Admin Dashboard - Manual Subscription Upgrade Feature

## تغییرات انجام شده

### 1. Frontend (Admin Dashboard)

#### فایل: `dash.linku.im/admin-dashboard/src/components/UserManagement/index.vue`

**تغییرات:**
- ✅ دکمه "ارتقای دستی" با آیکون تاج و رنگ بنفش اضافه شد
- ✅ مودال ارتقا با انتخاب مدت زمان (1، 3، 6، 12 ماه) ساخته شد
- ✅ نمایش اطلاعات کاربر و وضعیت فعلی اشتراک
- ✅ توابع `openUpgradeModal`، `closeUpgradeModal`، `confirmUpgrade` پیاده‌سازی شد
- ✅ loading state برای جلوگیری از کلیک‌های مکرر

### 2. Backend (Laravel API)

#### فایل: `api.linku.im/digital-business-card/routes/api.php`

```php
Route::post('/upgrade-subscription', [UserController::class, 'upgradeSubscription'])
    ->name('admin.upgradeSubscription');
```

#### فایل: `api.linku.im/digital-business-card/app/Http/Controllers/UserController.php`

```php
public function upgradeSubscription(Request $request): JsonResponse
{
    // اعتبارسنجی ورودی
    // محاسبه تاریخ پایان اشتراک جدید
    // آپدیت اطلاعات کاربر
    // برگرداندن نتیجه
}
```

#### فایل: `api.linku.im/digital-business-card/app/Models/User.php`

**فیلدهای جدید در fillable:**
- `subscription_type` (free/premium)
- `subscription_end_date` (تاریخ پایان اشتراک)
- `subscription_months` (تعداد ماه‌های اشتراک)

#### فایل: `api.linku.im/digital-business-card/app/Http/Resources/v1/UserResource.php`

**فیلدهای جدید در API response:**
- `subscriptionType`
- `subscriptionEndDate`
- `subscriptionMonths`
- `cardCount`
- `profileImage`
- `profileUrl`
- `lastLogin`

#### فایل: `database/migrations/2025_12_09_000001_add_subscription_fields_to_users_table.php`

```php
$table->string('subscription_type')->default('free');
$table->date('subscription_end_date')->nullable();
$table->integer('subscription_months')->default(0);
```

### 3. Bug Fixes

#### فایل: `api.linku.im/digital-business-card/app/Http/Resources/v1/CardResource.php`

**مشکل:** 500 error به خاطر null pointer در دسترسی به `$this->user->name`

**راه حل:**
```php
// قبل
'userName' => $this->user->name

// بعد
'userName' => $this->user?->name
```

تمام property های user و creator با null-safe operator (?->) اصلاح شدند.

---

## دستورات Deployment

### 1. Push به GitHub

```bash
cd c:\Users\babaw\Downloads\projects_backup
git add .
git commit -m "feat: Add manual subscription upgrade feature + fix CardResource null pointer"
git push origin master
```

### 2. Pull در سرور

```bash
ssh root@95.215.59.92

# Backend
cd /root/linku/digital-business-card
git pull origin master

# Run migration
php artisan migrate

# Clear cache
php artisan config:clear
php artisan cache:clear
php artisan route:clear

# Admin Dashboard
cd /root/linku/admin-dashboard
git pull origin master
npm install
npm run build
pm2 restart admin-dashboard
```

### 3. تست

1. ورود به admin dashboard: `https://dash.linku.im`
2. رفتن به بخش User Management
3. کلیک روی دکمه بنفش "ارتقای دستی" روی یک کاربر
4. انتخاب مدت زمان (1، 3، 6، یا 12 ماه)
5. تایید و بررسی موفقیت آمیز بودن

---

## API Endpoint

### POST `/api/user/admin/upgrade-subscription`

**Headers:**
```
Authorization: Bearer {admin_token}
Content-Type: application/json
```

**Body:**
```json
{
  "userId": 123,
  "months": 3
}
```

**Response (Success):**
```json
{
  "success": true,
  "message": "اشتراک با موفقیت ارتقا یافت",
  "data": {
    "user": { ... },
    "new_end_date": "2026-03-09",
    "added_months": 3
  }
}
```

**Response (Error):**
```json
{
  "success": false,
  "message": "خطا در ارتقا اشتراک"
}
```

---

## چک لیست

- [x] دکمه ارتقا به UserManagement اضافه شد
- [x] مودال ارتقا با UI زیبا ساخته شد
- [x] Backend API endpoint پیاده‌سازی شد
- [x] Migration برای فیلدهای subscription ساخته شد
- [x] User model بروزرسانی شد
- [x] UserResource فیلدهای جدید را برمی‌گرداند
- [x] CardResource null pointer fix شد
- [x] توابع frontend برای ارتباط با API نوشته شد
- [ ] Git push توسط کاربر
- [ ] Server deployment
- [ ] تست نهایی

---

## نکات مهم

1. ✅ اگر اشتراک کاربر منقضی شده، از تاریخ امروز شروع می‌شود
2. ✅ اگر اشتراک فعال است، به آن اضافه می‌شود
3. ✅ `subscription_type` خودکار به `premium` تغییر می‌کند
4. ✅ تمام ماه‌ها در `subscription_months` جمع می‌شوند
5. ⚠️ حتما migration را اجرا کنید: `php artisan migrate`
6. ⚠️ Admin dashboard را rebuild کنید: `npm run build`

---

## تماس با توسعه‌دهنده

در صورت بروز مشکل، لاگ‌های زیر را چک کنید:

```bash
# Laravel logs
tail -f /var/www/api.linku.im/digital-business-card/storage/logs/laravel.log

# PM2 logs
pm2 logs admin-dashboard

# Nginx error logs
tail -f /var/log/nginx/error.log
```
