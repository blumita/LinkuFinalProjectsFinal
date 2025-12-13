#!/bin/bash

# ========================================
# دستورات اجرا در سرور لینوکس
# این فایل را در سرور اجرا کنید
# ========================================

set -e

echo "=========================================="
echo "🚀 Linku Platform - Full Deployment"
echo "=========================================="
echo ""

# ========================================
# مرحله 1: بررسی وضعیت سیستم
# ========================================

echo "📊 مرحله 1: بررسی وضعیت سیستم..."
echo "-------------------------------------------"

# بررسی RAM
echo "💾 RAM موجود:"
free -h
echo ""

# بررسی Node.js version
echo "📦 Node.js Version:"
node --version
npm --version
echo ""

# بررسی PM2
echo "⚙️  PM2 Status:"
pm2 list
echo ""

read -p "آیا میخواهید ادامه دهید؟ (y/n): " continue_deploy
if [ "$continue_deploy" != "y" ]; then
    echo "❌ عملیات لغو شد"
    exit 0
fi

# ========================================
# مرحله 2: Backup
# ========================================

echo ""
echo "💾 مرحله 2: Backup گرفتن از فایل‌های قبلی..."
echo "-------------------------------------------"

BACKUP_DIR="/var/www/backups/$(date +%Y%m%d_%H%M%S)"
mkdir -p $BACKUP_DIR

# Backup digital-business-card
if [ -d "/var/www/dash.linku.im/digital-business-card/.output" ]; then
    cp -r /var/www/dash.linku.im/digital-business-card/.output $BACKUP_DIR/digital-business-card-output
    echo "✅ Backup: digital-business-card/.output"
fi

# Backup admin-dashboard
if [ -d "/var/www/dash.linku.im/admin-dashboard/dist" ]; then
    cp -r /var/www/dash.linku.im/admin-dashboard/dist $BACKUP_DIR/admin-dashboard-dist
    echo "✅ Backup: admin-dashboard/dist"
fi

echo "✅ Backup ذخیره شد در: $BACKUP_DIR"

# ========================================
# مرحله 3: توقف سرویس‌ها
# ========================================

echo ""
echo "🛑 مرحله 3: توقف سرویس‌ها..."
echo "-------------------------------------------"

pm2 stop all
echo "✅ تمام سرویس‌ها متوقف شدند"

# ========================================
# مرحله 4: Deploy Backend (Laravel API)
# ========================================

echo ""
echo "🔨 مرحله 4: Deploy Backend API..."
echo "-------------------------------------------"

cd /var/www/api.linku.im/digital-business-card

# Clear cache
php artisan cache:clear
php artisan config:clear
php artisan route:clear
php artisan view:clear

# Optimize
php artisan config:cache
php artisan route:cache
php artisan view:cache

echo "✅ Backend API آماده است"

# ========================================
# مرحله 5: Deploy Digital Business Card
# ========================================

echo ""
echo "🎴 مرحله 5: Deploy Digital Business Card..."
echo "-------------------------------------------"

cd /var/www/dash.linku.im/digital-business-card

# اجازه اجرا به اسکریپت deploy
chmod +x /var/www/deploy-digital-card.sh

# پاک کردن node_modules و cache
echo "🧹 پاک کردن فایل‌های قدیمی..."
rm -rf node_modules .nuxt .output

# نصب dependencies
echo "📦 نصب dependencies..."
npm install --legacy-peer-deps

# Build با memory بالا
echo "🔨 Building (این ممکن است چند دقیقه طول بکشد)..."
export NODE_OPTIONS="--max-old-space-size=4096"
npm run build

if [ $? -eq 0 ]; then
    echo "✅ Build موفقیت‌آمیز بود"
else
    echo "❌ خطا در Build! بازگشت به نسخه قبلی..."
    cp -r $BACKUP_DIR/digital-business-card-output .output
    exit 1
fi

# ========================================
# مرحله 6: Deploy Admin Dashboard
# ========================================

echo ""
echo "🎛️  مرحله 6: Deploy Admin Dashboard..."
echo "-------------------------------------------"

cd /var/www/dash.linku.im/admin-dashboard

# اجازه اجرا به اسکریپت deploy
chmod +x /var/www/deploy-admin-dashboard.sh

# پاک کردن node_modules و cache
echo "🧹 پاک کردن فایل‌های قدیمی..."
rm -rf node_modules dist

# نصب dependencies
echo "📦 نصب dependencies..."
npm install --legacy-peer-deps

# Build با memory بالا
echo "🔨 Building (این ممکن است چند دقیقه طول بکشد)..."
export NODE_OPTIONS="--max-old-space-size=6144"
npm run build:full

if [ $? -eq 0 ]; then
    echo "✅ Build موفقیت‌آمیز بود"
else
    echo "❌ خطا در Build! بازگشت به نسخه قبلی..."
    cp -r $BACKUP_DIR/admin-dashboard-dist dist
    exit 1
fi

# ========================================
# مرحله 7: راه‌اندازی مجدد سرویس‌ها
# ========================================

echo ""
echo "🔄 مرحله 7: راه‌اندازی مجدد سرویس‌ها..."
echo "-------------------------------------------"

# Start PM2
pm2 restart all

# یا استفاده از ecosystem.config.js
# pm2 delete all
# pm2 start ecosystem.config.js

echo "✅ سرویس‌ها راه‌اندازی شدند"

# ========================================
# مرحله 8: بررسی وضعیت نهایی
# ========================================

echo ""
echo "🔍 مرحله 8: بررسی وضعیت نهایی..."
echo "-------------------------------------------"

sleep 3

# بررسی PM2
echo "📊 وضعیت PM2:"
pm2 list

echo ""
echo "💻 استفاده از Memory:"
pm2 monit &
sleep 2
kill %1

echo ""
echo "📝 Logs اخیر:"
echo "Digital Business Card:"
pm2 logs digital-business-card --lines 10 --nostream
echo ""
echo "Admin Dashboard:"
pm2 logs dash-admin --lines 10 --nostream

# ========================================
# تمام!
# ========================================

echo ""
echo "=========================================="
echo "✅ Deploy با موفقیت انجام شد!"
echo "=========================================="
echo ""
echo "🌐 لینک‌های سایت:"
echo "   - Frontend: https://linku.im"
echo "   - Admin: https://dash.linku.im/admin"
echo "   - API: https://api.linku.im"
echo ""
echo "📊 دستورات مفید:"
echo "   - بررسی logs: pm2 logs"
echo "   - بررسی status: pm2 list"
echo "   - بررسی memory: pm2 monit"
echo "   - Restart: pm2 restart all"
echo ""
echo "💾 Backup ذخیره شده در: $BACKUP_DIR"
echo ""

# تست سریع
echo "🧪 تست سریع سرویس‌ها..."
echo ""

# Test API
echo "Testing API..."
curl -s -o /dev/null -w "API Status: %{http_code}\n" https://api.linku.im/api/health || echo "⚠️  API در دسترس نیست"

# Test Frontend
echo "Testing Frontend..."
curl -s -o /dev/null -w "Frontend Status: %{http_code}\n" https://linku.im || echo "⚠️  Frontend در دسترس نیست"

echo ""
echo "🎉 همه چیز آماده است!"
