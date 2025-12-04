#!/bin/bash

# 🚀 اسکریپت Deploy خودکار - Nuxt Frontend

echo "🚀 شروع Deploy Nuxt Frontend..."

# رنگ‌ها
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

# مسیر پروژه روی سرور
PROJECT_PATH="/var/www/dash.linku.im/digital-business-card"

echo -e "${YELLOW}1. رفتن به مسیر پروژه...${NC}"
cd $PROJECT_PATH || { echo -e "${RED}❌ مسیر پیدا نشد!${NC}"; exit 1; }

echo -e "${YELLOW}2. ایجاد Backup از .output فعلی...${NC}"
if [ -d ".output" ]; then
    BACKUP_DIR="backups/output-$(date +%Y%m%d-%H%M%S)"
    mkdir -p backups
    cp -r .output "$BACKUP_DIR"
    echo -e "${GREEN}✅ Backup ذخیره شد در: $BACKUP_DIR${NC}"
    
    # نگه داشتن فقط 5 backup آخر
    ls -dt backups/output-* | tail -n +6 | xargs rm -rf 2>/dev/null
else
    echo -e "${YELLOW}⚠️  فولدر .output موجود نیست${NC}"
fi

echo -e "${YELLOW}3. Git Pull...${NC}"
git pull origin main || git pull origin master

echo -e "${YELLOW}4. نصب Dependencies...${NC}"
npm install

echo -e "${YELLOW}5. Build Production (با حافظه بیشتر)...${NC}"
NODE_OPTIONS="--max-old-space-size=3072" npm run build

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Build موفقیت‌آمیز بود${NC}"
else
    echo -e "${RED}❌ Build ناموفق! Rollback به backup...${NC}"
    
    # Rollback به آخرین backup
    LAST_BACKUP=$(ls -dt backups/output-* 2>/dev/null | head -n 1)
    if [ -n "$LAST_BACKUP" ]; then
        rm -rf .output
        cp -r "$LAST_BACKUP" .output
        echo -e "${GREEN}✅ Rollback انجام شد به: $LAST_BACKUP${NC}"
    fi
    exit 1
fi

echo -e "${YELLOW}6. ریستارت Nuxt با PM2...${NC}"
if command -v pm2 &> /dev/null; then
    # کشتن پروسه‌های zombie پورت 3000
    lsof -ti:3000 | xargs kill -9 2>/dev/null || true
    
    # توقف و حذف پروسه قبلی
    pm2 delete dash-linku 2>/dev/null || true
    
    # اجرا با ecosystem config (.cjs برای سازگاری با ES modules)
    pm2 start ecosystem.config.cjs
    pm2 save
    
    echo -e "${GREEN}✅ PM2 با ecosystem config شروع شد (dash-linku)${NC}"
else
    echo -e "${YELLOW}⚠️  PM2 نصب نیست. نیاز به ریستارت دستی${NC}"
fi

echo -e "${GREEN}✅ Deploy Nuxt Frontend تمام شد!${NC}"

echo -e "\n${YELLOW}📊 اطلاعات:${NC}"
echo "- مسیر: $PROJECT_PATH"
echo "- Build: .output/"
echo "- Backups: $(ls -d backups/output-* 2>/dev/null | wc -l) عدد"

echo -e "\n${YELLOW}🧪 تست:${NC}"
echo "1. باز کن: https://linku.im"
echo "2. چک کن: https://linku.im/dashboard/notifications"
echo "3. تست پین: پین کن یک نوتیفیکیشن و چک کن بالا بیاد"

echo -e "\n${GREEN}🎉 Frontend آماده است!${NC}"
