# 🚀 راهنمای بیلد با RAM محدود (6GB)

## ⚠️ مشکل
سرور شما 6GB RAM دارد و بیلد همزمان دو پروژه ممکن است باعث Out of Memory شود.

## ✅ راه حل‌ها

### روش 1: استفاده از اسکریپت خودکار (توصیه می‌شود)

```bash
# اجازه اجرا به اسکریپت
chmod +x build-with-low-ram.sh

# اجرای اسکریپت
./build-with-low-ram.sh
```

این اسکریپت:
- ✅ پروژه‌ها را **یکی‌یکی** بیلد می‌کند
- ✅ Cache ها را بین بیلدها پاک می‌کند
- ✅ RAM را به طور خودکار مدیریت می‌کند
- ✅ گزارش کامل از پیشرفت می‌دهد

---

### روش 2: بیلد دستی با تنظیمات بهینه

#### 1️⃣ Digital Business Card (Nuxt)
```bash
cd dash.linku.im/digital-business-card

# پاک کردن cache
rm -rf .nuxt .output node_modules/.cache

# بیلد با محدودیت RAM
NODE_OPTIONS="--max-old-space-size=4096" npm run build

# پاک کردن cache بعد از بیلد
rm -rf .nuxt/cache node_modules/.cache

# صبر کردن برای آزاد شدن RAM
sleep 10
```

#### 2️⃣ Admin Dashboard (Vite)
```bash
cd dash.linku.im/admin-dashboard

# پاک کردن cache
rm -rf dist node_modules/.cache node_modules/.vite

# بیلد با محدودیت RAM
NODE_OPTIONS="--max-old-space-size=3072" npm run build

# پاک کردن cache بعد از بیلد
rm -rf node_modules/.cache node_modules/.vite
```

---

### روش 3: استفاده از Swap File (اگر RAM کافی نیست)

اگر هنوز با Out of Memory مواجه می‌شوید، می‌توانید Swap File اضافه کنید:

```bash
# ایجاد swap file 4GB
sudo fallocate -l 4G /swapfile
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile

# دائمی کردن swap
echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab

# بررسی swap
free -h
```

بعد از اضافه کردن Swap، دوباره بیلد کنید:
```bash
./build-with-low-ram.sh
```

---

## 📊 مصرف RAM تقریبی

| پروژه | RAM مورد نیاز | زمان بیلد |
|-------|---------------|-----------|
| Digital Business Card (Nuxt) | ~3-4 GB | 2-3 دقیقه |
| Admin Dashboard (Vite) | ~2-3 GB | 1-2 دقیقه |
| **مجموع (همزمان)** | ~6-7 GB | ❌ ممکن است Crash کند |
| **مجموع (یکی‌یکی)** | ~4 GB (پیک) | ✅ بدون مشکل |

---

## 🔧 تنظیمات اعمال شده

### ✅ در `nuxt.config.ts`:
```typescript
build: {
  minify: 'terser',
  terserOptions: {
    compress: {
      drop_console: true,
      drop_debugger: true
    }
  },
  rollupOptions: {
    maxParallelFileOps: 2  // کاهش CPU/RAM
  }
}
```

### ✅ در `vite.config.ts`:
```typescript
build: {
  minify: 'terser',
  terserOptions: {
    compress: {
      drop_console: true,
      drop_debugger: true
    }
  },
  rollupOptions: {
    maxParallelFileOps: 2  // کاهش CPU/RAM
  }
}
```

---

## 🚨 اگر باز هم Out of Memory شد

### 1. بررسی فرآیندهای در حال اجرا
```bash
# مشاهده فرآیندهای سنگین
ps aux --sort=-%mem | head -10

# حافظه آزاد
free -h
```

### 2. متوقف کردن سرویس‌های غیرضروری موقتاً
```bash
# مثال: متوقف کردن MySQL موقتاً (اگر لازم نیست)
sudo systemctl stop mysql

# بیلد کردن
./build-with-low-ram.sh

# راه‌اندازی مجدد
sudo systemctl start mysql
```

### 3. استفاده از سرور جداگانه برای بیلد
اگر امکان دارد، بیلد را روی سیستم لوکال با RAM بیشتر انجام دهید و فقط فایل‌های بیلد شده را آپلود کنید:

```bash
# روی سیستم لوکال (Windows)
cd dash.linku.im\digital-business-card
npm run build

cd ..\admin-dashboard  
npm run build

# فشرده‌سازی
tar -czf builds.tar.gz digital-business-card/.output admin-dashboard/dist

# آپلود به سرور با scp
scp builds.tar.gz user@server:/path/to/project/
```

---

## 📝 یادداشت‌های مهم

1. **پاک کردن cache ها**: قبل و بعد از هر بیلد، cache ها را پاک کنید
2. **صبر کردن بین بیلدها**: 10-15 ثانیه صبر کنید تا RAM آزاد شود
3. **مانیتورینگ RAM**: با `htop` یا `free -h` حافظه را نظارت کنید
4. **Deploy تدریجی**: ابتدا یک پروژه را deploy کنید، سپس دیگری

---

## ✅ تأیید موفقیت

بعد از بیلد، فایل‌های زیر باید وجود داشته باشند:

```bash
# Digital Business Card
ls -lh dash.linku.im/digital-business-card/.output/

# Admin Dashboard  
ls -lh dash.linku.im/admin-dashboard/dist/
```

---

## 🆘 پشتیبانی

اگر مشکلی داشتید:
1. لاگ‌های بیلد را بررسی کنید
2. مصرف RAM را با `free -h` چک کنید
3. از اسکریپت `build-with-low-ram.sh` استفاده کنید
4. در صورت لزوم Swap File اضافه کنید

---

**موفق باشید! 🚀**
