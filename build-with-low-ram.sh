#!/bin/bash

###############################################################################
# اسکریپت بیلد بهینه برای سرورهای با RAM محدود (6GB)
# این اسکریپت پروژه‌ها را یکی‌یکی با تنظیمات بهینه بیلد می‌کند
###############################################################################

set -e  # خروج در صورت هر گونه خطا

# رنگ‌ها برای خروجی
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# پاک کردن حافظه cache
echo -e "${BLUE}🧹 پاک کردن cache های قدیمی...${NC}"
sync
echo 3 > /proc/sys/vm/drop_caches 2>/dev/null || echo "⚠️  نیاز به دسترسی root برای پاک کردن cache"

# تنظیمات محیطی برای کاهش استفاده از RAM
export NODE_OPTIONS="--max-old-space-size=4096"
export NODE_ENV=production

# مسیر اصلی پروژه
PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}  بیلد پروژه با RAM محدود (6GB)${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""

###############################################################################
# 1. بیلد Digital Business Card (Nuxt)
###############################################################################
echo -e "${BLUE}📦 شروع بیلد Digital Business Card (Nuxt)...${NC}"
cd "$PROJECT_ROOT/dash.linku.im/digital-business-card"

# پاک کردن build قبلی
echo -e "${YELLOW}  🗑️  پاک کردن build قبلی...${NC}"
rm -rf .nuxt .output node_modules/.cache

# نصب dependencies (اگر لازم باشد)
if [ ! -d "node_modules" ]; then
    echo -e "${YELLOW}  📥 نصب dependencies...${NC}"
    npm ci --prefer-offline --no-audit
fi

# بیلد با تنظیمات بهینه
echo -e "${YELLOW}  🏗️  در حال بیلد...${NC}"
NODE_OPTIONS="--max-old-space-size=4096" npm run build

if [ $? -eq 0 ]; then
    echo -e "${GREEN}  ✅ بیلد Digital Business Card با موفقیت انجام شد${NC}"
else
    echo -e "${RED}  ❌ خطا در بیلد Digital Business Card${NC}"
    exit 1
fi

# پاک کردن cache برای آزاد کردن RAM
echo -e "${YELLOW}  🧹 پاک کردن cache برای آزاد کردن RAM...${NC}"
rm -rf .nuxt/cache node_modules/.cache
sync

echo ""
echo -e "${BLUE}⏸️  منتظر 10 ثانیه برای آزاد شدن حافظه...${NC}"
sleep 10

###############################################################################
# 2. بیلد Admin Dashboard (Vite)
###############################################################################
echo -e "${BLUE}📦 شروع بیلد Admin Dashboard (Vite)...${NC}"
cd "$PROJECT_ROOT/dash.linku.im/admin-dashboard"

# پاک کردن build قبلی
echo -e "${YELLOW}  🗑️  پاک کردن build قبلی...${NC}"
rm -rf dist node_modules/.cache node_modules/.vite

# نصب dependencies (اگر لازم باشد)
if [ ! -d "node_modules" ]; then
    echo -e "${YELLOW}  📥 نصب dependencies...${NC}"
    npm ci --prefer-offline --no-audit
fi

# بیلد با تنظیمات بهینه
echo -e "${YELLOW}  🏗️  در حال بیلد...${NC}"
NODE_OPTIONS="--max-old-space-size=3072" npm run build

if [ $? -eq 0 ]; then
    echo -e "${GREEN}  ✅ بیلد Admin Dashboard با موفقیت انجام شد${NC}"
else
    echo -e "${RED}  ❌ خطا در بیلد Admin Dashboard${NC}"
    exit 1
fi

# پاک کردن cache
echo -e "${YELLOW}  🧹 پاک کردن cache...${NC}"
rm -rf node_modules/.cache node_modules/.vite

echo ""
echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}  ✅ همه بیلدها با موفقیت انجام شد${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""
echo -e "${BLUE}📂 فایل‌های بیلد شده:${NC}"
echo -e "  • Digital Business Card: ${YELLOW}dash.linku.im/digital-business-card/.output${NC}"
echo -e "  • Admin Dashboard: ${YELLOW}dash.linku.im/admin-dashboard/dist${NC}"
echo ""
echo -e "${BLUE}🚀 برای deploy:${NC}"
echo -e "  1. فایل‌های بالا را به سرور آپلود کنید"
echo -e "  2. Backend را با ${YELLOW}php artisan config:clear${NC} ریستارت کنید"
echo -e "  3. PM2 را با ${YELLOW}pm2 restart all${NC} ریستارت کنید"
echo ""
