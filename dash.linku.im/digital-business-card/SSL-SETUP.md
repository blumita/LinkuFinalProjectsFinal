# 🔐 راهنمای نصب SSL

## ✅ محیط Development (لوکال) - انجام شده!

SSL برای محیط توسعه فعال شده است و از `vite-plugin-mkcert` استفاده می‌کند.

### استفاده:
```bash
npm run dev
```

پروژه روی آدرس زیر اجرا می‌شود:
```
https://localhost:3001
```

**نکته:** اولین بار که پروژه را اجرا می‌کنید، ممکن است مرورگر هشدار امنیتی نشان دهد. این طبیعی است و می‌توانید با کلیک روی "Advanced" و "Proceed to localhost" ادامه دهید.

---

## 🌐 محیط Production

بسته به سرویس هاستینگ خود، یکی از روش‌های زیر را انتخاب کنید:

### 1️⃣ **Vercel**
- SSL به صورت خودکار فعال می‌شود
- نیازی به تنظیمات اضافی نیست
- می‌توانید دامنه سفارشی متصل کنید

### 2️⃣ **Netlify**
- SSL به صورت خودکار با Let's Encrypt فعال می‌شود
- Settings → Domain management → HTTPS

### 3️⃣ **Cloudflare Pages**
- SSL رایگان و خودکار
- تنظیمات SSL در داشبورد Cloudflare

### 4️⃣ **سرور VPS (Ubuntu/Linux)**

#### نصب Certbot (Let's Encrypt):
```bash
# نصب Certbot
sudo apt update
sudo apt install certbot

# برای Nginx:
sudo apt install python3-certbot-nginx
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com

# برای Apache:
sudo apt install python3-certbot-apache
sudo certbot --apache -d yourdomain.com -d www.yourdomain.com
```

#### تنظیم Nginx با SSL:
```nginx
server {
    listen 443 ssl http2;
    server_name yourdomain.com www.yourdomain.com;

    ssl_certificate /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;
    
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;

    location / {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}

# Redirect HTTP to HTTPS
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;
    return 301 https://$server_name$request_uri;
}
```

#### تمدید خودکار گواهی:
```bash
# تست تمدید
sudo certbot renew --dry-run

# اضافه کردن cronjob برای تمدید خودکار
sudo crontab -e
# اضافه کردن این خط:
0 12 * * * /usr/bin/certbot renew --quiet
```

### 5️⃣ **Docker**

اگر از Docker استفاده می‌کنید، می‌توانید از `nginx-proxy` + `letsencrypt-companion` استفاده کنید:

```yaml
# docker-compose.yml
version: '3'

services:
  nginx-proxy:
    image: nginxproxy/nginx-proxy
    container_name: nginx-proxy
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - /var/run/docker.sock:/tmp/docker.sock:ro
      - certs:/etc/nginx/certs
      - vhost:/etc/nginx/vhost.d
      - html:/usr/share/nginx/html

  letsencrypt:
    image: nginxproxy/acme-companion
    container_name: letsencrypt
    volumes:
      - /var/run/docker.sock:/var/run/docker.sock:ro
      - certs:/etc/nginx/certs
      - vhost:/etc/nginx/vhost.d
      - html:/usr/share/nginx/html
      - acme:/etc/acme.sh
    environment:
      - DEFAULT_EMAIL=your-email@example.com

  nuxt-app:
    build: .
    container_name: nuxt-app
    expose:
      - "3001"
    environment:
      - VIRTUAL_HOST=yourdomain.com
      - LETSENCRYPT_HOST=yourdomain.com
      - LETSENCRYPT_EMAIL=your-email@example.com

volumes:
  certs:
  vhost:
  html:
  acme:
```

---

## 🔍 بررسی SSL

بعد از نصب، می‌توانید SSL را بررسی کنید:

1. **آنلاین:**
   - https://www.ssllabs.com/ssltest/
   - https://securityheaders.com/

2. **از ترمینال:**
```bash
# بررسی گواهی
openssl s_client -connect yourdomain.com:443 -servername yourdomain.com

# بررسی تاریخ انقضا
echo | openssl s_client -servername yourdomain.com -connect yourdomain.com:443 2>/dev/null | openssl x509 -noout -dates
```

---

## 🛡️ تنظیمات امنیتی اضافی

برای امنیت بیشتر، هدرهای زیر را به `nuxt.config.ts` اضافه کنید:

```typescript
nitro: {
  routeRules: {
    '/**': {
      headers: {
        'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
        'X-Content-Type-Options': 'nosniff',
        'X-Frame-Options': 'SAMEORIGIN',
        'X-XSS-Protection': '1; mode=block',
        'Referrer-Policy': 'strict-origin-when-cross-origin'
      }
    }
  }
}
```

---

## ❓ مشکلات رایج

### مرورگر هشدار امنیتی نشان می‌دهد
- در Development: طبیعی است، گواهی self-signed است
- در Production: مطمئن شوید گواهی به درستی نصب شده

### Mixed Content Error
- مطمئن شوید همه درخواست‌های API از HTTPS استفاده می‌کنند
- در `plugins/axios.ts` از `https://` استفاده کنید

### CORS Error بعد از فعال کردن SSL
- سرور API باید HTTPS را قبول کند
- هدر `Access-Control-Allow-Origin` را بررسی کنید

---

## 📞 پشتیبانی

اگر مشکلی داشتید:
1. لاگ‌های Nginx یا Apache را بررسی کنید
2. وضعیت سرویس Certbot را چک کنید: `sudo systemctl status certbot.timer`
3. فایروال را بررسی کنید: `sudo ufw status`
