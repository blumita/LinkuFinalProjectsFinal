# 🚀 راهنمای بهبود سرعت و عملکرد

## ✅ تغییرات انجام شده

### 1. بهبود سرعت صفحه اصلی داشبورد
- ✅ تبدیل `await` های سریالی به `Promise.all` موازی
- ✅ نمایش داده‌های کش شده قبل از fetch جدید
- ✅ اجرای موازی: `fetchUser` + `fetchCounts` + `permissions`

### 2. بهبود Navigation System
- ✅ اصلاح useSafeNavigation با منطق بهتر
- ✅ اضافه کردن timeout برای fallback خودکار
- ✅ جایگزینی همه `router.back()` در 16+ فایل

---

## 🔥 بهینه‌سازی‌های بیشتر (پیشنهادی)

### 1. فعال‌سازی Gzip Compression در سرور

در فایل `.htaccess` یا Nginx config:

```apache
# Apache (.htaccess)
<IfModule mod_deflate.c>
  AddOutputFilterByType DEFLATE text/html text/plain text/xml text/css text/javascript application/javascript application/json
</IfModule>

# فشرده‌سازی فایل‌های JavaScript و CSS
<FilesMatch "\.(js|css)$">
  SetOutputFilter DEFLATE
</FilesMatch>
```

```nginx
# Nginx
gzip on;
gzip_vary on;
gzip_min_length 1024;
gzip_proxied expired no-cache no-store private auth;
gzip_types text/plain text/css text/xml text/javascript application/x-javascript application/xml+rss application/json;
gzip_disable "MSIE [1-6]\.";
```

### 2. Browser Caching Headers

```apache
# Apache
<IfModule mod_expires.c>
  ExpiresActive On
  ExpiresByType image/jpg "access plus 1 year"
  ExpiresByType image/jpeg "access plus 1 year"
  ExpiresByType image/gif "access plus 1 year"
  ExpiresByType image/png "access plus 1 year"
  ExpiresByType text/css "access plus 1 month"
  ExpiresByType application/pdf "access plus 1 month"
  ExpiresByType text/javascript "access plus 1 month"
  ExpiresByType application/javascript "access plus 1 month"
  ExpiresByType application/x-shockwave-flash "access plus 1 month"
  ExpiresByType image/x-icon "access plus 1 year"
  ExpiresDefault "access plus 2 days"
</IfModule>
```

### 3. تنظیمات PHP برای سرعت بیشتر

در `php.ini`:

```ini
# افزایش حافظه
memory_limit = 256M

# کاهش زمان اجرا
max_execution_time = 60

# افزایش upload size
upload_max_filesize = 50M
post_max_size = 50M

# OPcache برای کش کردن PHP
opcache.enable=1
opcache.memory_consumption=128
opcache.max_accelerated_files=10000
opcache.validate_timestamps=0  # در production
```

### 4. Database Optimization

```bash
# در سرور SSH
ssh root@95.215.59.92

# بهینه‌سازی جداول MySQL
mysql -u root -p
USE linku_db;
OPTIMIZE TABLE users, cards, links, transactions, orders;

# اضافه کردن Index به جداول
ALTER TABLE transactions ADD INDEX idx_order_id (order_id);
ALTER TABLE transactions ADD INDEX idx_authority (authority);
ALTER TABLE orders ADD INDEX idx_user_id (user_id);
```

### 5. Redis برای Cache (اختیاری)

```bash
# نصب Redis
sudo apt-get install redis-server

# فعال‌سازی Redis
sudo systemctl enable redis-server
sudo systemctl start redis-server
```

در `.env`:

```env
CACHE_DRIVER=redis
SESSION_DRIVER=redis
QUEUE_CONNECTION=redis
REDIS_HOST=127.0.0.1
REDIS_PASSWORD=null
REDIS_PORT=6379
```

### 6. Lazy Loading برای کامپوننت‌ها

در Nuxt:

```vue
<script setup>
// به جای import مستقیم
const MyHeavyComponent = defineAsyncComponent(() => 
  import('~/components/Heavy/MyComponent.vue')
)
</script>
```

### 7. Image Optimization

```bash
# نصب sharp برای بهینه‌سازی تصاویر
npm install sharp

# در nuxt.config.ts
export default defineNuxtConfig({
  image: {
    formats: ['webp', 'avif'],
    quality: 80,
    screens: {
      xs: 320,
      sm: 640,
      md: 768,
      lg: 1024,
      xl: 1280,
    }
  }
})
```

### 8. Code Splitting بهتر

در `nuxt.config.ts`:

```typescript
vite: {
  build: {
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          // جداسازی vendor chunks
          if (id.includes('node_modules')) {
            if (id.includes('axios')) return 'axios'
            if (id.includes('pinia')) return 'pinia'
            if (id.includes('vue')) return 'vue-vendor'
            return 'vendor'
          }
        }
      }
    }
  }
}
```

### 9. Service Worker برای PWA

فایل `public/sw.js` برای کش کردن:

```javascript
const CACHE_NAME = 'linku-v1.0.0'
const urlsToCache = [
  '/',
  '/dashboard',
  '/offline.html',
  '/_nuxt/entry.js',
  '/logo/logo.png'
]

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(urlsToCache))
  )
})

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => response || fetch(event.request))
  )
})
```

### 10. CDN برای Static Assets

استفاده از ArvanCloud یا CDN.ir:

```typescript
// nuxt.config.ts
app: {
  cdnURL: 'https://cdn.linku.im'
}
```

---

## 📊 ابزارهای اندازه‌گیری سرعت

### 1. Google Lighthouse
```bash
npm install -g lighthouse
lighthouse https://linku.im --view
```

### 2. WebPageTest
https://www.webpagetest.org/

### 3. GTmetrix
https://gtmetrix.com/

### 4. Chrome DevTools
- Network tab → فیلتر روی JS/CSS
- Performance tab → Record و تحلیل

---

## 🎯 اهداف سرعت

| متریک | هدف فعلی | هدف بهینه |
|-------|----------|-----------|
| First Contentful Paint (FCP) | < 1.5s | < 1.0s |
| Time to Interactive (TTI) | < 3.0s | < 2.0s |
| Total Blocking Time (TBT) | < 300ms | < 200ms |
| Cumulative Layout Shift (CLS) | < 0.1 | < 0.05 |
| Largest Contentful Paint (LCP) | < 2.5s | < 1.5s |

---

## ✅ Checklist بهینه‌سازی

- [x] موازی‌سازی API calls در dashboard
- [x] بهبود navigation system
- [ ] فعال‌سازی Gzip
- [ ] تنظیم Browser Caching
- [ ] بهینه‌سازی Database Indexes
- [ ] نصب Redis (اختیاری)
- [ ] Lazy Loading کامپوننت‌های سنگین
- [ ] بهینه‌سازی تصاویر با WebP
- [ ] Code Splitting بهتر
- [ ] استفاده از CDN

