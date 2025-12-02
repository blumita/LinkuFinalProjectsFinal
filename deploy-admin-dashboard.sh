#!/bin/bash

# 🚀 اسکریپت Deploy خودکار - Admin Dashboard (Vue/Vite)

echo "🚀 شروع Deploy Admin Dashboard..."

# رنگ‌ها برای خروجی
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# مسیر پروژه روی سرور (این رو تغییر بده)
PROJECT_PATH="/var/www/dash.linku.im/admin-dashboard"

echo -e "${YELLOW}1. رفتن به مسیر پروژه...${NC}"
cd $PROJECT_PATH || { echo -e "${RED}❌ مسیر پیدا نشد!${NC}"; exit 1; }

echo -e "${YELLOW}2. ایجاد Backup از dist فعلی...${NC}"
if [ -d "dist" ]; then
    BACKUP_DIR="backups/dist-$(date +%Y%m%d-%H%M%S)"
    mkdir -p backups
    cp -r dist "$BACKUP_DIR"
    echo -e "${GREEN}✅ Backup ذخیره شد در: $BACKUP_DIR${NC}"
    
    # نگه داشتن فقط 5 backup آخر
    ls -dt backups/dist-* | tail -n +6 | xargs rm -rf 2>/dev/null
    echo -e "${GREEN}✅ Backup های قدیمی پاک شدند${NC}"
else
    echo -e "${YELLOW}⚠️  فولدر dist موجود نیست${NC}"
fi

echo -e "${YELLOW}3. Git Pull...${NC}"
git pull origin main || git pull origin master

echo -e "${YELLOW}4. نصب Dependencies...${NC}"
npm install

echo -e "${YELLOW}5. چک کردن فایل‌های مهم...${NC}"
MISSING_FILES=0

# چک کردن فایل‌های ضروری
if [ ! -f "src/pages/roles/index.vue" ]; then
    echo -e "${RED}❌ roles/index.vue پیدا نشد!${NC}"
    MISSING_FILES=$((MISSING_FILES + 1))
else
    echo -e "${GREEN}✅ roles/index.vue موجود است${NC}"
fi

if [ ! -f "src/components/PermissionTree/index.vue" ]; then
    echo -e "${RED}❌ PermissionTree پیدا نشد!${NC}"
    MISSING_FILES=$((MISSING_FILES + 1))
else
    echo -e "${GREEN}✅ PermissionTree موجود است${NC}"
fi

if [ $MISSING_FILES -gt 0 ]; then
    echo -e "${RED}⚠️  $MISSING_FILES فایل مهم پیدا نشد!${NC}"
fi

echo -e "${YELLOW}6. Build Production...${NC}"
npm run build

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Build موفقیت‌آمیز بود${NC}"
else
    echo -e "${RED}❌ Build ناموفق! Rollback به backup...${NC}"
    
    # Rollback به آخرین backup
    LAST_BACKUP=$(ls -dt backups/dist-* 2>/dev/null | head -n 1)
    if [ -n "$LAST_BACKUP" ]; then
        rm -rf dist
        cp -r "$LAST_BACKUP" dist
        echo -e "${GREEN}✅ Rollback انجام شد به: $LAST_BACKUP${NC}"
    fi
    exit 1
fi

echo -e "${YELLOW}7. ریستارت Web Server...${NC}"

# Nginx
if command -v nginx &> /dev/null; then
    sudo nginx -t && sudo systemctl reload nginx
    echo -e "${GREEN}✅ Nginx reload شد${NC}"
fi

# Apache
if command -v apache2 &> /dev/null; then
    sudo systemctl reload apache2
    echo -e "${GREEN}✅ Apache reload شد${NC}"
fi

echo -e "${GREEN}✅ Deploy Admin Dashboard تمام شد!${NC}"

echo -e "\n${YELLOW}📊 اطلاعات:${NC}"
echo "- مسیر: $PROJECT_PATH"
echo "- Build: dist/"
echo "- Backups: $(ls -d backups/dist-* 2>/dev/null | wc -l) عدد"

echo -e "\n${YELLOW}🧪 تست:${NC}"
echo "1. باز کن: https://admin.linku.im"
echo "2. چک کن: https://admin.linku.im/roles (صفحه مدیریت نقش‌ها)"

echo -e "\n${GREEN}🎉 همه چیز آماده است!${NC}"
