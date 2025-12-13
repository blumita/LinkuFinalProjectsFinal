#!/bin/bash

# ========================================
# Deploy سریع - فقط Admin Dashboard
# ========================================

echo "🚀 Deploy Admin Dashboard..."

cd /var/www/dash.linku.im/admin-dashboard

# توقف سرویس
pm2 stop dash-admin

# پاک کردن cache
rm -rf dist

# Build با memory بالا
export NODE_OPTIONS="--max-old-space-size=6144"
npm run build:full

# راه‌اندازی مجدد
pm2 restart dash-admin

# نمایش logs
pm2 logs dash-admin --lines 20
