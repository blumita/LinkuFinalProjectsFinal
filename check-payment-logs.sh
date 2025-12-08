#!/bin/bash

# =============================================================================
# 🔍 اسکریپت لاگ‌گیری و عیب‌یابی درگاه پرداخت
# =============================================================================
# استفاده: ./check-payment-logs.sh
# توضیح: این اسکریپت تمام لاگ‌های مرتبط با پرداخت را بررسی و نمایش می‌دهد
# =============================================================================

# رنگ‌ها برای خروجی
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# مسیرها
LARAVEL_LOG="/var/www/api.linku.im/digital-business-card/storage/logs/laravel.log"
NGINX_ACCESS="/var/log/nginx/api.linku.im_access.log"
NGINX_ERROR="/var/log/nginx/api.linku.im_error.log"
PHP_FPM_LOG="/var/log/php8.2-fpm.log"

echo -e "${BLUE}═══════════════════════════════════════════════════════════${NC}"
echo -e "${BLUE}       🔍 بررسی لاگ‌های درگاه پرداخت لینکو${NC}"
echo -e "${BLUE}═══════════════════════════════════════════════════════════${NC}"
echo ""

# =============================================================================
# بررسی وجود فایل‌ها
# =============================================================================
echo -e "${YELLOW}📁 بررسی وجود فایل‌های لاگ...${NC}"

if [ ! -f "$LARAVEL_LOG" ]; then
    echo -e "${RED}❌ فایل Laravel Log یافت نشد: $LARAVEL_LOG${NC}"
else
    echo -e "${GREEN}✅ Laravel Log: موجود${NC}"
fi

if [ ! -f "$NGINX_ACCESS" ]; then
    echo -e "${RED}❌ فایل Nginx Access Log یافت نشد: $NGINX_ACCESS${NC}"
else
    echo -e "${GREEN}✅ Nginx Access Log: موجود${NC}"
fi

if [ ! -f "$NGINX_ERROR" ]; then
    echo -e "${RED}❌ فایل Nginx Error Log یافت نشد: $NGINX_ERROR${NC}"
else
    echo -e "${GREEN}✅ Nginx Error Log: موجود${NC}"
fi

echo ""

# =============================================================================
# 1. لاگ‌های Laravel مرتبط با Payment
# =============================================================================
echo -e "${BLUE}════════════════════════════════════════${NC}"
echo -e "${BLUE}  1️⃣  لاگ‌های Laravel - Payment${NC}"
echo -e "${BLUE}════════════════════════════════════════${NC}"

if [ -f "$LARAVEL_LOG" ]; then
    PAYMENT_LOGS=$(grep -i "payment" "$LARAVEL_LOG" | tail -20)
    
    if [ -z "$PAYMENT_LOGS" ]; then
        echo -e "${YELLOW}⚠️  هیچ لاگ payment در Laravel یافت نشد${NC}"
    else
        echo -e "${GREEN}📝 20 لاگ اخیر مرتبط با Payment:${NC}"
        echo ""
        echo "$PAYMENT_LOGS"
    fi
else
    echo -e "${RED}❌ فایل لاگ Laravel در دسترس نیست${NC}"
fi

echo ""
echo ""

# =============================================================================
# 2. خطاهای اخیر Laravel
# =============================================================================
echo -e "${BLUE}════════════════════════════════════════${NC}"
echo -e "${BLUE}  2️⃣  خطاهای اخیر Laravel${NC}"
echo -e "${BLUE}════════════════════════════════════════${NC}"

if [ -f "$LARAVEL_LOG" ]; then
    ERROR_LOGS=$(grep -i "error" "$LARAVEL_LOG" | tail -10)
    
    if [ -z "$ERROR_LOGS" ]; then
        echo -e "${GREEN}✅ هیچ خطای اخیر یافت نشد${NC}"
    else
        echo -e "${RED}⚠️  10 خطای اخیر:${NC}"
        echo ""
        echo "$ERROR_LOGS"
    fi
else
    echo -e "${RED}❌ فایل لاگ Laravel در دسترس نیست${NC}"
fi

echo ""
echo ""

# =============================================================================
# 3. درخواست‌های API Payment در Nginx
# =============================================================================
echo -e "${BLUE}════════════════════════════════════════${NC}"
echo -e "${BLUE}  3️⃣  درخواست‌های Payment در Nginx${NC}"
echo -e "${BLUE}════════════════════════════════════════${NC}"

if [ -f "$NGINX_ACCESS" ]; then
    PAYMENT_REQUESTS=$(grep "POST.*payment" "$NGINX_ACCESS" | tail -10)
    
    if [ -z "$PAYMENT_REQUESTS" ]; then
        echo -e "${YELLOW}⚠️  هیچ درخواست payment در Nginx یافت نشد${NC}"
    else
        echo -e "${GREEN}📊 10 درخواست اخیر POST /payment:${NC}"
        echo ""
        echo "$PAYMENT_REQUESTS"
        
        # شمارش status codes
        echo ""
        echo -e "${BLUE}📈 توزیع Status Codes:${NC}"
        grep "POST.*payment" "$NGINX_ACCESS" | tail -50 | awk '{print $9}' | sort | uniq -c | sort -rn
    fi
else
    echo -e "${RED}❌ فایل Nginx Access Log در دسترس نیست${NC}"
fi

echo ""
echo ""

# =============================================================================
# 4. Callback Payment در Nginx
# =============================================================================
echo -e "${BLUE}════════════════════════════════════════${NC}"
echo -e "${BLUE}  4️⃣  Callback Payment در Nginx${NC}"
echo -e "${BLUE}════════════════════════════════════════${NC}"

if [ -f "$NGINX_ACCESS" ]; then
    CALLBACK_REQUESTS=$(grep "callback/payment" "$NGINX_ACCESS" | tail -10)
    
    if [ -z "$CALLBACK_REQUESTS" ]; then
        echo -e "${YELLOW}⚠️  هیچ callback payment در Nginx یافت نشد${NC}"
    else
        echo -e "${GREEN}📞 10 callback اخیر:${NC}"
        echo ""
        echo "$CALLBACK_REQUESTS"
    fi
else
    echo -e "${RED}❌ فایل Nginx Access Log در دسترس نیست${NC}"
fi

echo ""
echo ""

# =============================================================================
# 5. خطاهای Nginx
# =============================================================================
echo -e "${BLUE}════════════════════════════════════════${NC}"
echo -e "${BLUE}  5️⃣  خطاهای Nginx${NC}"
echo -e "${BLUE}════════════════════════════════════════${NC}"

if [ -f "$NGINX_ERROR" ]; then
    NGINX_ERRORS=$(tail -20 "$NGINX_ERROR")
    
    if [ -z "$NGINX_ERRORS" ]; then
        echo -e "${GREEN}✅ هیچ خطای Nginx یافت نشد${NC}"
    else
        echo -e "${RED}⚠️  20 خطای اخیر Nginx:${NC}"
        echo ""
        echo "$NGINX_ERRORS"
    fi
else
    echo -e "${RED}❌ فایل Nginx Error Log در دسترس نیست${NC}"
fi

echo ""
echo ""

# =============================================================================
# 6. بررسی متغیرهای محیطی
# =============================================================================
echo -e "${BLUE}════════════════════════════════════════${NC}"
echo -e "${BLUE}  6️⃣  متغیرهای محیطی Laravel${NC}"
echo -e "${BLUE}════════════════════════════════════════${NC}"

ENV_FILE="/var/www/api.linku.im/digital-business-card/.env"

if [ -f "$ENV_FILE" ]; then
    echo -e "${GREEN}📋 تنظیمات درگاه پرداخت:${NC}"
    echo ""
    grep "^GATEWAY_" "$ENV_FILE" || echo -e "${YELLOW}⚠️  متغیر GATEWAY در .env یافت نشد${NC}"
    echo ""
    grep "^APP_ENV" "$ENV_FILE" || echo -e "${YELLOW}⚠️  متغیر APP_ENV در .env یافت نشد${NC}"
    grep "^APP_DEBUG" "$ENV_FILE" || echo -e "${YELLOW}⚠️  متغیر APP_DEBUG در .env یافت نشد${NC}"
else
    echo -e "${RED}❌ فایل .env در دسترس نیست${NC}"
fi

echo ""
echo ""

# =============================================================================
# 7. وضعیت سرویس‌ها
# =============================================================================
echo -e "${BLUE}════════════════════════════════════════${NC}"
echo -e "${BLUE}  7️⃣  وضعیت سرویس‌ها${NC}"
echo -e "${BLUE}════════════════════════════════════════${NC}"

# Nginx
if systemctl is-active --quiet nginx; then
    echo -e "${GREEN}✅ Nginx: فعال${NC}"
else
    echo -e "${RED}❌ Nginx: غیرفعال یا مشکل دارد${NC}"
fi

# PHP-FPM
if systemctl is-active --quiet php8.2-fpm; then
    echo -e "${GREEN}✅ PHP-FPM: فعال${NC}"
else
    echo -e "${RED}❌ PHP-FPM: غیرفعال یا مشکل دارد${NC}"
fi

# MySQL
if systemctl is-active --quiet mysql; then
    echo -e "${GREEN}✅ MySQL: فعال${NC}"
else
    echo -e "${RED}❌ MySQL: غیرفعال یا مشکل دارد${NC}"
fi

echo ""
echo ""

# =============================================================================
# 8. آخرین تراکنش‌های پایگاه داده
# =============================================================================
echo -e "${BLUE}════════════════════════════════════════${NC}"
echo -e "${BLUE}  8️⃣  آخرین تراکنش‌های Database${NC}"
echo -e "${BLUE}════════════════════════════════════════${NC}"

DB_USER=$(grep "^DB_USERNAME" "$ENV_FILE" | cut -d '=' -f2)
DB_PASS=$(grep "^DB_PASSWORD" "$ENV_FILE" | cut -d '=' -f2)
DB_NAME=$(grep "^DB_DATABASE" "$ENV_FILE" | cut -d '=' -f2)

if [ ! -z "$DB_USER" ] && [ ! -z "$DB_NAME" ]; then
    echo -e "${GREEN}💾 آخرین 5 تراکنش:${NC}"
    echo ""
    mysql -u "$DB_USER" -p"$DB_PASS" "$DB_NAME" -e "SELECT id, order_id, amount, gateway, status, created_at FROM transactions ORDER BY created_at DESC LIMIT 5;" 2>/dev/null || echo -e "${RED}❌ خطا در دسترسی به پایگاه داده${NC}"
    
    echo ""
    echo -e "${GREEN}🛒 آخرین 5 سفارش:${NC}"
    echo ""
    mysql -u "$DB_USER" -p"$DB_PASS" "$DB_NAME" -e "SELECT id, user_id, plan_id, amount, status, created_at FROM orders ORDER BY created_at DESC LIMIT 5;" 2>/dev/null || echo -e "${RED}❌ خطا در دسترسی به پایگاه داده${NC}"
else
    echo -e "${YELLOW}⚠️  اطلاعات دیتابیس در .env یافت نشد${NC}"
fi

echo ""
echo ""

# =============================================================================
# خلاصه و توصیه‌ها
# =============================================================================
echo -e "${BLUE}═══════════════════════════════════════════════════════════${NC}"
echo -e "${BLUE}       📋 خلاصه و توصیه‌ها${NC}"
echo -e "${BLUE}═══════════════════════════════════════════════════════════${NC}"
echo ""

echo -e "${YELLOW}💡 برای مانیتورینگ زنده:${NC}"
echo "   tail -f $LARAVEL_LOG | grep -i payment"
echo ""

echo -e "${YELLOW}🔍 برای جستجوی خطاهای خاص:${NC}"
echo "   grep 'خطای موردنظر' $LARAVEL_LOG"
echo ""

echo -e "${YELLOW}🔄 برای ریستارت سرویس‌ها:${NC}"
echo "   sudo systemctl restart nginx php8.2-fpm"
echo ""

echo -e "${YELLOW}🧹 برای پاک کردن کش Laravel:${NC}"
echo "   cd /var/www/api.linku.im/digital-business-card"
echo "   php artisan cache:clear && php artisan config:clear"
echo ""

echo -e "${GREEN}✅ بررسی لاگ‌ها تکمیل شد!${NC}"
echo ""
