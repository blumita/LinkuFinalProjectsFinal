#!/bin/bash

# 🚀 اسکریپت Deploy خودکار - Laravel API

echo "🚀 شروع Deploy Laravel API..."

# رنگ‌ها
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

# مسیر پروژه روی سرور
PROJECT_PATH="/var/www/api.linku.im/digital-business-card"

echo -e "${YELLOW}1. رفتن به مسیر پروژه...${NC}"
cd $PROJECT_PATH || { echo -e "${RED}❌ مسیر پیدا نشد!${NC}"; exit 1; }

echo -e "${YELLOW}2. Backup از دیتابیس...${NC}"
BACKUP_DIR="backups/db-$(date +%Y%m%d-%H%M%S)"
mkdir -p backups
php artisan backup:run --only-db 2>/dev/null || echo -e "${YELLOW}⚠️  Backup اتوماتیک موجود نیست${NC}"

echo -e "${YELLOW}3. Git Pull...${NC}"
git pull origin main || git pull origin master

echo -e "${YELLOW}4. نصب Composer Dependencies...${NC}"
composer install --no-dev --optimize-autoloader

echo -e "${YELLOW}5. اجرای Migrations جدید...${NC}"
php artisan migrate --force

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Migrations با موفقیت اجرا شدند${NC}"
else
    echo -e "${RED}❌ خطا در Migrations!${NC}"
    exit 1
fi

echo -e "${YELLOW}6. پاک کردن Cache...${NC}"
php artisan cache:clear
php artisan config:clear
php artisan route:clear
php artisan view:clear

echo -e "${YELLOW}7. Optimize کردن...${NC}"
php artisan config:cache
php artisan route:cache
php artisan view:cache

echo -e "${YELLOW}8. بررسی Storage Link...${NC}"
php artisan storage:link

echo -e "${YELLOW}9. تنظیم Permissions...${NC}"
sudo chown -R www-data:www-data storage bootstrap/cache
sudo chmod -R 775 storage bootstrap/cache

echo -e "${YELLOW}10. ریستارت Queue Workers (اگر داری)...${NC}"
if command -v supervisorctl &> /dev/null; then
    sudo supervisorctl restart laravel-worker:*
    echo -e "${GREEN}✅ Queue workers ریستارت شدند${NC}"
fi

echo -e "${GREEN}✅ Deploy Laravel API تمام شد!${NC}"

echo -e "\n${YELLOW}📊 اطلاعات:${NC}"
echo "- مسیر: $PROJECT_PATH"
echo "- Migration های جدید اجرا شدند"
echo "- Cache ها پاک و بازسازی شدند"

echo -e "\n${YELLOW}🧪 تست:${NC}"
echo "1. API Health: curl https://api.linku.im/health"
echo "2. تست Discount: curl https://api.linku.im/user/admin/discount"

echo -e "\n${GREEN}🎉 Backend آماده است!${NC}"
