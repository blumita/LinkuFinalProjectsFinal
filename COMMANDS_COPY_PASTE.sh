#!/bin/bash

# ========================================
# دستورات خلاصه برای Copy-Paste
# این دستورات را مستقیم در ترمینال سرور لینوکس اجرا کنید
# ========================================

# 🔹 اتصال به سرور
ssh root@your-server-ip

# 🔹 رفتن به پوشه digital-business-card
cd /var/www/dash.linku.im/digital-business-card

# 🔹 توقف سرویس
pm2 stop digital-business-card

# 🔹 پاک کردن فایل‌های قدیمی
rm -rf .nuxt .output

# 🔹 Build با memory بالا
export NODE_OPTIONS="--max-old-space-size=4096"
npm run build

# 🔹 راه‌اندازی مجدد
pm2 restart digital-business-card

# 🔹 مشاهده logs
pm2 logs digital-business-card --lines 50

# ========================================
# برای Admin Dashboard:
# ========================================

cd /var/www/dash.linku.im/admin-dashboard
pm2 stop dash-admin
rm -rf dist
export NODE_OPTIONS="--max-old-space-size=6144"
npm run build:full
pm2 restart dash-admin
pm2 logs dash-admin --lines 50

# ========================================
# دستورات مفید دیگر:
# ========================================

# بررسی وضعیت همه سرویس‌ها
pm2 list

# بررسی memory usage
pm2 monit

# Restart همه سرویس‌ها
pm2 restart all

# بررسی RAM سرور
free -h

# بررسی لاگ‌های خطا
pm2 logs --err

# پاک کردن لاگ‌ها
pm2 flush

# ========================================
# در صورت مشکل:
# ========================================

# Kill همه process ها و شروع مجدد
pm2 kill
pm2 start ecosystem.config.js

# یا استفاده از اسکریپت deploy کامل
cd /var/www
chmod +x DEPLOY_ON_SERVER.sh
./DEPLOY_ON_SERVER.sh
