#!/bin/bash

# Deploy Manual License Creation Fix
echo "🚀 Deploying Manual License Creation Feature..."

# 1. Upload fixed controller
echo "📤 Uploading CardVisitController..."
scp "c:\Users\babaw\Downloads\projects_backup\api.linku.im\digital-business-card\app\Http\Controllers\Admin\CardVisitController.php" root@157.90.164.166:/var/www/api.linku.im/digital-business-card/app/Http/Controllers/Admin/CardVisitController.php

# 2. Upload routes file
echo "📤 Uploading routes..."
scp "c:\Users\babaw\Downloads\projects_backup\api.linku.im\digital-business-card\routes\api.php" root@157.90.164.166:/var/www/api.linku.im/digital-business-card/routes/api.php

# 3. Clear Laravel caches
echo "🧹 Clearing Laravel caches..."
ssh root@157.90.164.166 << 'ENDSSH'
cd /var/www/api.linku.im/digital-business-card
php artisan config:clear
php artisan cache:clear
php artisan route:clear
php artisan view:clear
php artisan optimize:clear
echo "✅ Laravel caches cleared"
ENDSSH

# 4. Check logs for any errors
echo "📋 Checking recent logs..."
ssh root@157.90.164.166 "tail -50 /var/www/api.linku.im/digital-business-card/storage/logs/laravel.log"

echo "✅ Deployment completed!"
echo "🔗 Test endpoint: POST https://api.linku.im/api/user/admin/cardVisit/manual"
echo "📝 Payload: { \"slug\": \"testlic1\", \"card_name\": \"تست کارت\" }"
