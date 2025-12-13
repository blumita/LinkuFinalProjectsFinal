#!/bin/bash

# ========================================
# Deploy سریع - فقط Digital Business Card
# ========================================

echo "🚀 Deploy Digital Business Card..."

cd /var/www/dash.linku.im/digital-business-card

# توقف سرویس
pm2 stop digital-business-card

# پاک کردن cache
rm -rf .nuxt .output

# Build با memory بالا
export NODE_OPTIONS="--max-old-space-size=4096"
npm run build

# راه‌اندازی مجدد
pm2 restart digital-business-card

# نمایش logs
pm2 logs digital-business-card --lines 20
