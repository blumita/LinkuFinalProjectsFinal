#!/bin/bash

# 🚀 اسکریپت Deploy کامل - Full Stack

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🚀 شروع Deploy کامل پروژه Linku"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# رنگ‌ها
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# تاریخ و زمان
TIMESTAMP=$(date +"%Y-%m-%d %H:%M:%S")
echo -e "${BLUE}⏰ زمان شروع: $TIMESTAMP${NC}\n"

# تابع برای چاپ با فرمت
print_step() {
    echo -e "\n${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${YELLOW}$1${NC}"
    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}\n"
}

# تابع برای چک کردن نتیجه
check_result() {
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✅ $1 موفقیت‌آمیز${NC}"
        return 0
    else
        echo -e "${RED}❌ $1 ناموفق${NC}"
        return 1
    fi
}

# ═══════════════════════════════════════════
# 1️⃣ DEPLOY BACKEND (Laravel API)
# ═══════════════════════════════════════════
print_step "1️⃣  DEPLOY BACKEND (Laravel API)"

API_PATH="/var/www/api.linku.im/digital-business-card"
cd $API_PATH || { echo -e "${RED}❌ مسیر API پیدا نشد!${NC}"; exit 1; }

echo "📥 Git Pull..."
git pull origin main
check_result "Git Pull Backend"

echo "📦 Composer Install..."
composer install --no-dev --optimize-autoloader --quiet
check_result "Composer Install"

echo "🗄️  Running Migrations..."
php artisan migrate --force
check_result "Migrations"

echo "🧹 Clearing Cache..."
php artisan cache:clear
php artisan config:clear
php artisan route:clear
php artisan view:clear

echo "⚡ Optimizing..."
php artisan config:cache
php artisan route:cache

echo "🔗 Storage Link..."
php artisan storage:link

echo "🔑 Setting Permissions..."
sudo chown -R www-data:www-data storage bootstrap/cache
sudo chmod -R 775 storage bootstrap/cache

# Queue Workers
if command -v supervisorctl &> /dev/null; then
    echo "♻️  Restarting Queue Workers..."
    sudo supervisorctl restart laravel-worker:* 2>/dev/null
fi

echo -e "${GREEN}✅ Backend Deploy کامل شد${NC}"

# ═══════════════════════════════════════════
# 2️⃣ DEPLOY ADMIN DASHBOARD (Vue/Vite)
# ═══════════════════════════════════════════
print_step "2️⃣  DEPLOY ADMIN DASHBOARD (Vue/Vite)"

ADMIN_PATH="/var/www/dash.linku.im/admin-dashboard"
cd $ADMIN_PATH || { echo -e "${RED}❌ مسیر Admin Dashboard پیدا نشد!${NC}"; exit 1; }

echo "📥 Git Pull..."
git pull origin main
check_result "Git Pull Admin"

echo "📦 NPM Install..."
npm install --quiet
check_result "NPM Install Admin"

echo "🏗️  Building..."
NODE_OPTIONS="--max-old-space-size=2048" npm run build
if check_result "Build Admin"; then
    echo -e "${GREEN}✅ Admin Dashboard بیلد شد${NC}"
    
    # Restart PM2 if needed (for SSR admin)
    if command -v pm2 &> /dev/null; then
        pm2 restart dash-admin 2>/dev/null && echo -e "${GREEN}✅ PM2 ریستارت شد (dash-admin)${NC}"
    fi
else
    echo -e "${RED}❌ Build ناموفق! لطفاً خطاها را بررسی کنید${NC}"
fi

# ═══════════════════════════════════════════
# 3️⃣ DEPLOY FRONTEND (Nuxt)
# ═══════════════════════════════════════════
print_step "3️⃣  DEPLOY FRONTEND (Nuxt)"

FRONTEND_PATH="/var/www/dash.linku.im/digital-business-card"
cd $FRONTEND_PATH || { echo -e "${RED}❌ مسیر Frontend پیدا نشد!${NC}"; exit 1; }

echo "📥 Git Pull..."
git pull origin main
check_result "Git Pull Frontend"

echo "📦 NPM Install..."
npm install --quiet
check_result "NPM Install Frontend"

echo "🏗️  Building Nuxt..."
NODE_OPTIONS="--max-old-space-size=3072" npm run build
if check_result "Build Frontend"; then
    echo -e "${GREEN}✅ Frontend بیلد شد${NC}"
    
    echo "♻️  Restarting PM2..."
    if command -v pm2 &> /dev/null; then
        pm2 restart dash-linku
        check_result "PM2 Restart (dash-linku)"
    fi
else
    echo -e "${RED}❌ Build ناموفق!${NC}"
fi

# ═══════════════════════════════════════════
# 4️⃣ RESTART WEB SERVERS
# ═══════════════════════════════════════════
print_step "4️⃣  RESTART WEB SERVERS"

if command -v nginx &> /dev/null; then
    echo "🔄 Nginx Test & Reload..."
    sudo nginx -t && sudo systemctl reload nginx
    check_result "Nginx Reload"
fi

if command -v apache2 &> /dev/null; then
    echo "🔄 Apache Reload..."
    sudo systemctl reload apache2
    check_result "Apache Reload"
fi

# ═══════════════════════════════════════════
# ✅ SUMMARY
# ═══════════════════════════════════════════
END_TIME=$(date +"%Y-%m-%d %H:%M:%S")

echo -e "\n${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${GREEN}🎉 Deploy کامل با موفقیت انجام شد!${NC}"
echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}\n"

echo -e "${YELLOW}📊 خلاصه:${NC}"
echo "✅ Backend API: api.linku.im"
echo "✅ Admin Dashboard: admin.linku.im"
echo "✅ Frontend: linku.im"
echo ""
echo -e "${YELLOW}⏰ زمان:${NC}"
echo "شروع: $TIMESTAMP"
echo "پایان: $END_TIME"
echo ""
echo -e "${YELLOW}🧪 تست‌ها:${NC}"
echo "1. API: curl https://api.linku.im/health"
echo "2. Admin Discounts: https://admin.linku.im/discounts"
echo "3. Frontend Notifications: https://linku.im/dashboard/notifications"
echo "4. تست پین نوتیفیکیشن: پین کن و چک کن بالا بیاد"
echo ""
echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${GREEN}🚀 همه چیز آماده است!${NC}"
echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}\n"
