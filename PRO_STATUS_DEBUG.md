# راهنمای دیباگ وضعیت Pro کاربر

## مشکل
کاربران Pro در نسخه دسکتاپ به عنوان کاربر رایگان شناسایی می‌شوند و به صفحه خرید اشتراک هدایت می‌شوند.

## تغییرات اعمال شده

### ۱. اضافه شدن console.log به stores/user.ts

در تابع `fetchUser` لاگ‌های زیر اضافه شد:
```typescript
console.log('🔍 User data from backend:', data.data)
console.log('👑 isPro status:', data.data?.isPro)
console.log('📊 Full user object:', JSON.stringify(data.data, null, 2))
console.log('✅ User store updated. isPro:', this.user?.isPro)
console.log('✅ isUserPro getter:', this.isUserPro)
```

### ۲. اضافه شدن console.log به pages/dashboard/index.vue

در `onMounted` لاگ‌های زیر اضافه شد:
```typescript
console.log('📱 Dashboard mounted - Checking auth...')
console.log('🔑 Auth token exists:', !!authStore.token)
console.log('👤 User data exists:', !!userStore.user?.id)
console.log('🔄 Token hydrated:', !!authStore.token)
console.log('📦 Using cached user data')
console.log('👑 Cached isPro:', userStore.user?.isPro)
console.log('✅ User fetched in dashboard')
console.log('👑 Dashboard isPro computed:', isPro.value)
console.log('📊 User object:', userStore.user)
```

### ۳. اضافه شدن console.log به pages/dashboard/checkout/index.vue

در `onMounted` لاگ‌های زیر اضافه شد:
```typescript
console.log('💳 Checkout page mounted')
console.log('👤 Current user before fetch:', userStore.user)
console.log('👑 isPro before fetch:', userStore.user?.isPro)
console.log('✅ Data loaded in checkout')
console.log('👤 User after fetch:', userStore.user)
console.log('👑 isPro after fetch:', userStore.user?.isPro)
console.log('📊 Subscription status:', currentSubscription.value)
```

## دستورالعمل دیباگ

### مرحله ۱: بیلد و دیپلوی کردن

```bash
cd dash.linku.im/digital-business-card
npm run build
pm2 restart digital-business-card
```

### مرحله ۲: باز کردن Console در مرورگر

1. در مرورگر دسکتاپ، F12 را بزنید
2. به تب Console بروید
3. وارد داشبورد شوید

### مرحله ۳: بررسی لاگ‌ها

#### اگر token وجود نداشت:
```
❌ Auth token exists: false
```
**راه حل**: مشکل از localStorage است. token پاک شده یا ذخیره نشده

#### اگر backend isPro را false برگرداند:
```
🔍 User data from backend: { isPro: false, ... }
```
**راه حل**: مشکل از backend است. باید در دیتابیس `is_pro` کاربر را چک کنید

#### اگر backend isPro را true برگرداند ولی frontend false نشان می‌دهد:
```
🔍 User data from backend: { isPro: true, ... }
✅ User store updated. isPro: false
```
**راه حل**: مشکل در hydration store است

#### اگر همه چیز درست است ولی checkout redirect می‌کند:
```
👑 isPro after fetch: true
📊 Subscription status: { status: 'active', remainingDays: 45 }
```
**راه حل**: مشکل در computed property یا logic checkout است

## بررسی Backend

### ۱. چک کردن is_pro در دیتابیس:

```sql
SELECT id, name, phone, is_pro, subscription_end_date 
FROM users 
WHERE phone = '09XXXXXXXXX';
```

### ۲. تست کردن API endpoint:

```bash
# با توکن کاربر
curl -H "Authorization: Bearer YOUR_TOKEN_HERE" https://api.linku.im/user
```

باید response زیر را برگرداند:
```json
{
  "data": {
    "id": 123,
    "name": "نام کاربر",
    "isPro": true,
    ...
  }
}
```

## علل احتمالی مشکل

1. ✅ **Backend درست کار می‌کند**: `UserResource` خط ۳۶ `isPro` را از `is_pro` برمی‌گرداند
2. ✅ **Frontend store درست است**: `isUserPro` getter از `user.isPro` استفاده می‌کند
3. ⚠️ **Token در دسکتاپ**: ممکن است localStorage پاک شده باشد
4. ⚠️ **Hydration در دسکتاپ**: ممکن است store بین SSR و client sync نشود
5. ⚠️ **دیتابیس**: ممکن است `is_pro` کاربر false باشد

## نتیجه‌گیری از لاگ‌ها

بعد از دیپلوی و باز کردن console، لطفاً تمام لاگ‌ها را کپی کنید و بفرستید تا مشکل را دقیقاً تشخیص دهیم.

لاگ‌هایی که باید چک شوند:
- 🔑 Auth token exists
- 👤 User data exists
- 🔍 User data from backend
- 👑 isPro status از backend
- ✅ isPro بعد از ذخیره در store
- 👑 isPro computed در dashboard
- 💳 isPro در checkout page

## مراحل بعدی

بعد از دریافت لاگ‌ها:
1. اگر token نبود → فیکس localStorage/cookie
2. اگر backend false داد → فیکس دیتابیس
3. اگر store false شد → فیکس hydration
4. اگر همه درست بود → فیکس logic checkout
