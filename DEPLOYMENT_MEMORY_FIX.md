# 🚀 Deployment Guide - Linku Platform

## مشکل JavaScript Heap Out of Memory

اگر با خطای زیر مواجه شدید:
```
FATAL ERROR: Reached heap limit Allocation failed - JavaScript heap out of memory
```

این راهنما برای شماست!

---

## 📋 راهنمای سریع Deploy در سرور لینوکس

### گام 1️⃣: اتصال به سرور

```bash
ssh root@your-server-ip
```

### گام 2️⃣: رفتن به مسیر پروژه

```bash
cd /var/www/dash.linku.im/digital-business-card
```

### گام 3️⃣: توقف سرویس

```bash
pm2 stop digital-business-card
```

### گام 4️⃣: پاک کردن cache

```bash
rm -rf .nuxt .output node_modules
```

### گام 5️⃣: نصب dependencies

```bash
npm install --legacy-peer-deps
```

### گام 6️⃣: Build با memory بالا

```bash
export NODE_OPTIONS="--max-old-space-size=4096"
npm run build
```

### گام 7️⃣: راه‌اندازی مجدد

```bash
pm2 restart digital-business-card
pm2 logs digital-business-card
```

---

## 🎯 یا استفاده از اسکریپت آماده

### Deploy کامل (همه چیز):
```bash
cd /var/www
chmod +x DEPLOY_ON_SERVER.sh
./DEPLOY_ON_SERVER.sh
```

### Deploy سریع (فقط Digital Card):
```bash
cd /var/www
chmod +x quick-deploy-card.sh
./quick-deploy-card.sh
```

### Deploy سریع (فقط Admin):
```bash
cd /var/www
chmod +x quick-deploy-admin.sh
./quick-deploy-admin.sh
```

---

## 🔧 راه‌حل‌ها

### 1. استفاده از اسکریپت‌های Deploy اختصاصی

#### Deploy Digital Business Card:
```bash
cd /var/www/projects_backup
chmod +x deploy-digital-card.sh
./deploy-digital-card.sh
```

#### Deploy Admin Dashboard:
```bash
cd /var/www/projects_backup
chmod +x deploy-admin-dashboard.sh
./deploy-admin-dashboard.sh
```

### 2. Build دستی با Memory بالا

#### Digital Business Card:
```bash
cd /var/www/dash.linku.im/digital-business-card

# پاک کردن فایل‌های قدیمی
rm -rf .nuxt .output node_modules

# نصب dependencies
npm install --legacy-peer-deps

# Build با 4GB memory
NODE_OPTIONS="--max-old-space-size=4096" npm run build

# Restart PM2
pm2 restart digital-business-card
```

#### Admin Dashboard:
```bash
cd /var/www/dash.linku.im/admin-dashboard

# پاک کردن فایل‌های قدیمی
rm -rf dist node_modules

# نصب dependencies
npm install --legacy-peer-deps

# Build با 6GB memory
NODE_OPTIONS="--max-old-space-size=6144" npm run build:full
```

### 3. تنظیمات انجام شده

✅ **package.json**: اضافه شدن `NODE_OPTIONS` به اسکریپت‌های build  
✅ **.npmrc**: تنظیمات global برای npm با memory limit  
✅ **ecosystem.config.js**: تنظیمات PM2 با memory restart  

### 4. بررسی وضعیت

```bash
# بررسی وضعیت PM2
pm2 list

# بررسی logs
pm2 logs digital-business-card --lines 50
pm2 logs dash-admin --lines 50

# بررسی memory usage
pm2 monit
```

### 5. Restart کل سیستم

```bash
# Restart همه process ها
pm2 restart all

# یا به صورت جداگانه
pm2 restart digital-business-card
pm2 restart dash-admin
```

## 📊 Memory Requirements

- **Digital Business Card**: حداقل 4GB برای build، 2GB برای runtime
- **Admin Dashboard**: حداقل 6GB برای build، 1GB برای runtime

## 🆘 در صورت مشکل

اگر باز هم خطای memory دیدید:

1. **بررسی RAM سرور**:
```bash
free -h
```

2. **افزایش Swap** (اگر RAM کم است):
```bash
# ساخت 4GB swap
sudo fallocate -l 4G /swapfile
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile
```

3. **Kill process های غیرضروری**:
```bash
pm2 stop all
pm2 flush
pm2 start ecosystem.config.js
```

4. **Build در محیط دیگر**:
   - Build را در سیستم local با RAM بالا انجام دهید
   - فقط فایل‌های build شده (.output یا dist) را به سرور آپلود کنید

## 📝 یادداشت‌ها

- همیشه قبل از build، `node_modules` و فایل‌های قدیمی را پاک کنید
- از `--legacy-peer-deps` برای جلوگیری از conflict استفاده کنید
- logs را چک کنید: `/var/www/dash.linku.im/*/logs/`

## ✅ Checklist Deploy موفق

- [ ] RAM سرور بالای 8GB است
- [ ] Node.js version 18+ نصب است
- [ ] npm dependencies نصب شده
- [ ] فایل‌های قدیمی پاک شده
- [ ] Build با NODE_OPTIONS انجام شده
- [ ] PM2 restart شده
- [ ] سایت در مرورگر چک شده
