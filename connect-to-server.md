# راهنمای اتصال به سرور

## اطلاعات سرور

- **مسیر پروژه Nuxt.js**: `/var/www/dash.linku.im/digital-business-card`
- **مسیر پروژه Laravel**: `/var/www/api.linku.im/digital-business-card`
- **مسیر Admin Dashboard**: `/var/www/admin-dashboard`
- **دامنه‌ها**: 
  - `linku.im`
  - `dash.linku.im`
  - `api.linku.im`

## اتصال SSH

```bash
# اتصال به سرور (IP یا hostname را جایگزین کنید)
ssh root@YOUR_SERVER_IP

# یا با استفاده از SSH key
ssh -i ~/.ssh/your_key root@YOUR_SERVER_IP
```

## دستورات مفید بعد از اتصال

### بررسی وضعیت PM2
```bash
# لیست اپلیکیشن‌های PM2
pm2 list

# بررسی لاگ‌های Nuxt.js
pm2 logs dash-linku

# ری‌استارت اپلیکیشن
pm2 restart dash-linku

# بررسی وضعیت
pm2 status
```

### بررسی وضعیت Laravel
```bash
# رفتن به مسیر Laravel
cd /var/www/api.linku.im/digital-business-card

# بررسی وضعیت queue
php artisan queue:work

# بررسی لاگ‌ها
tail -f storage/logs/laravel.log

# اجرای migration
php artisan migrate

# پاک کردن کش
php artisan cache:clear
php artisan config:clear
php artisan route:clear
php artisan view:clear
```

### بررسی وضعیت Nginx
```bash
# بررسی syntax
sudo nginx -t

# Reload configuration
sudo systemctl reload nginx

# بررسی وضعیت سرویس
sudo systemctl status nginx

# بررسی لاگ‌ها
sudo tail -f /var/log/nginx/error.log
```

### بررسی وضعیت MySQL
```bash
# اتصال به دیتابیس
mysql -u root -p

# یا با استفاده از credentials از .env
mysql -u DB_USERNAME -p DB_DATABASE
```

### بررسی فضای دیسک
```bash
# بررسی فضای دیسک
df -h

# بررسی فضای استفاده شده در مسیر پروژه
du -sh /var/www/*
```

### بررسی وضعیت سرویس‌ها
```bash
# بررسی تمام سرویس‌های فعال
sudo systemctl status

# بررسی Redis
sudo systemctl status redis

# بررسی MySQL
sudo systemctl status mysql
```

## Deployment

### Deploy پروژه Nuxt.js
```bash
cd /var/www/dash.linku.im/digital-business-card

# Pull آخرین تغییرات
git pull origin main

# نصب dependencies
npm install

# Build پروژه
npm run build

# ری‌استارت PM2
pm2 restart dash-linku
```

### Deploy پروژه Laravel
```bash
cd /var/www/api.linku.im/digital-business-card

# Pull آخرین تغییرات
git pull origin main

# نصب dependencies
composer install --no-dev --optimize-autoloader

# اجرای migration
php artisan migrate --force

# پاک کردن کش
php artisan optimize:clear
php artisan config:cache
php artisan route:cache
php artisan view:cache

# ری‌استارت queue worker
php artisan queue:restart
```

## Backup

### Backup دیتابیس
```bash
# Backup MySQL
mysqldump -u DB_USERNAME -p DB_DATABASE > backup_$(date +%Y%m%d_%H%M%S).sql

# یا با استفاده از Laravel
cd /var/www/api.linku.im/digital-business-card
php artisan db:backup
```

### Backup فایل‌ها
```bash
# Backup storage
tar -czf storage_backup_$(date +%Y%m%d_%H%M%S).tar.gz /var/www/api.linku.im/digital-business-card/storage
```

## Monitoring

### بررسی استفاده از منابع
```bash
# بررسی CPU و Memory
htop

# یا
top

# بررسی استفاده از Memory
free -h

# بررسی استفاده از CPU
lscpu
```

### بررسی لاگ‌های سیستم
```bash
# لاگ‌های سیستم
sudo journalctl -xe

# لاگ‌های Nginx
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log

# لاگ‌های PM2
pm2 logs
```

## Troubleshooting

### اگر Nuxt.js کار نمی‌کند
```bash
# بررسی لاگ‌های PM2
pm2 logs dash-linku --lines 100

# بررسی پورت
netstat -tulpn | grep 3000

# ری‌استارت
pm2 restart dash-linku
```

### اگر Laravel کار نمی‌کند
```bash
# بررسی لاگ‌ها
tail -f storage/logs/laravel.log

# بررسی permissions
sudo chown -R www-data:www-data storage bootstrap/cache
sudo chmod -R 775 storage bootstrap/cache

# پاک کردن کش
php artisan optimize:clear
```

### اگر Nginx کار نمی‌کند
```bash
# بررسی syntax
sudo nginx -t

# بررسی لاگ‌ها
sudo tail -f /var/log/nginx/error.log

# ری‌استارت
sudo systemctl restart nginx
```

