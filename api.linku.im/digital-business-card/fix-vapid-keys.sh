#!/bin/bash

# Fix VAPID keys in .env file on server
# این اسکریپت VAPID keys رو در یک خط قرار میده

cd /var/www/api.linku.im/digital-business-card

# Backup .env
cp .env .env.backup.$(date +%Y%m%d_%H%M%S)

# Fix VAPID_PUBLIC_KEY - merge the two lines
sed -i '/VAPID_PUBLIC_KEY=/N;s/VAPID_PUBLIC_KEY=BFzttfamBJ5XHjuy55yNQTCdkR2rbgE3J0oYQHmEgoiRJPPrLWPt5lkTBZn7\njS30UBdMLCeBplkznfAoZSjXkUY/VAPID_PUBLIC_KEY=BFzttfamBJ5XHjuy55yNQTCdkR2rbgE3J0oYQHmEgoiRJPPrLWPt5lkTBZn7jS30UBdMLCeBplkznfAoZSjXkUY/' .env

# Clear config cache
php artisan config:clear
php artisan cache:clear

echo "✅ VAPID keys fixed!"
echo ""
echo "Checking .env file:"
grep "VAPID" .env

echo ""
echo "Testing env() function:"
php artisan tinker --execute="echo 'PUBLIC: ' . env('VAPID_PUBLIC_KEY') . PHP_EOL; echo 'PRIVATE: ' . env('VAPID_PRIVATE_KEY') . PHP_EOL;"
