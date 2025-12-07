#!/bin/bash

# بررسی لاگ‌های SMS در سرور
echo "🔍 بررسی لاگ‌های SMS در سرور..."
echo "================================"

# اتصال به سرور و بررسی لاگ‌ها
ssh root@95.215.59.92 << 'ENDSSH'
    echo "📱 آخرین لاگ‌های SMS و OTP:"
    echo "----------------------------"
    
    # بررسی لاگ‌های Laravel
    cd /var/www/api.linku.im/digital-business-card
    
    # نمایش 100 خط آخر لاگ با فیلتر SMS
    echo ""
    echo "🔹 لاگ‌های مربوط به SMS:"
    tail -200 storage/logs/laravel.log | grep -E "SMS|OTP|📱|🔑|✅|❌" | tail -50
    
    echo ""
    echo "----------------------------"
    echo "📊 بررسی وضعیت کانفیگ SMS:"
    
    # بررسی متغیرهای محیطی
    if [ -f .env ]; then
        echo "✅ فایل .env موجود است"
        echo "SMS_API_KEY length: $(grep SMS_API_KEY .env | cut -d= -f2 | wc -c)"
        echo "SMS_PATTERN_CODE: $(grep SMS_PATTERN_CODE .env | cut -d= -f2)"
    else
        echo "❌ فایل .env یافت نشد"
    fi
    
    echo ""
    echo "🔄 بررسی کش کانفیگ:"
    if [ -f bootstrap/cache/config.php ]; then
        echo "⚠️  کش کانفیگ موجود است - ممکن است نیاز به پاک کردن باشد"
    else
        echo "✅ کش کانفیگ وجود ندارد"
    fi
ENDSSH

echo ""
echo "================================"
echo "✅ بررسی کامل شد"
