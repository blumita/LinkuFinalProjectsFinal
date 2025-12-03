# تنظیمات Nginx برای Admin Dashboard

اگر از Nginx استفاده می‌کنید، این تنظیمات را به config خود اضافه کنید:

```nginx
server {
    listen 80;
    server_name dash.linku.im;
    
    # اجبار به HTTPS (در production)
    # return 301 https://$server_name$request_uri;
    
    root /var/www/admin-dashboard/dist;
    index index.html;
    
    # لاگ‌ها
    access_log /var/log/nginx/admin-dashboard-access.log;
    error_log /var/log/nginx/admin-dashboard-error.log;
    
    # فشرده‌سازی gzip
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_proxied expired no-cache no-store private auth;
    gzip_types text/plain text/css text/xml text/javascript application/javascript application/xml+rss application/json;
    
    # تنظیمات امنیتی
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;
    
    # جلوگیری از دسترسی به فایل‌های حساس
    location ~ /\. {
        deny all;
        access_log off;
        log_not_found off;
    }
    
    location ~ \.(env|log|config|yml|yaml)$ {
        deny all;
        access_log off;
        log_not_found off;
    }
    
    # تنظیمات کش برای assets استاتیک
    location ~* \.(jpg|jpeg|png|gif|ico|svg|css|js|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
        access_log off;
    }
    
    # Vue Router SPA handling
    location / {
        try_files $uri $uri/ /index.html;
        
        # جلوگیری از کش کردن index.html
        add_header Cache-Control "no-cache, no-store, must-revalidate";
        add_header Pragma "no-cache";
        add_header Expires "0";
    }
    
    # Proxy برای API (اگر API روی سرور دیگری است)
    location /api {
        proxy_pass http://127.0.0.1:8000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}

# HTTPS configuration (در production)
# server {
#     listen 443 ssl http2;
#     server_name dash.linku.im;
#     
#     ssl_certificate /etc/letsencrypt/live/dash.linku.im/fullchain.pem;
#     ssl_certificate_key /etc/letsencrypt/live/dash.linku.im/privkey.pem;
#     
#     ssl_protocols TLSv1.2 TLSv1.3;
#     ssl_ciphers HIGH:!aNULL:!MD5;
#     ssl_prefer_server_ciphers on;
#     
#     # بقیه تنظیمات مشابه بالا...
# }
```

## توضیحات:

1. **Vue Router SPA**: همه درخواست‌ها به `index.html` هدایت می‌شوند
2. **امنیت**: Headers امنیتی اضافه شده است
3. **کش**: Assets استاتیک کش می‌شوند اما HTML نه
4. **Gzip**: فشرده‌سازی فعال است
5. **API Proxy**: درخواست‌های `/api` به backend هدایت می‌شوند

## تست تنظیمات:

```bash
# بررسی syntax
sudo nginx -t

# Reload configuration
sudo systemctl reload nginx

# بررسی logs
sudo tail -f /var/log/nginx/admin-dashboard-error.log
```
