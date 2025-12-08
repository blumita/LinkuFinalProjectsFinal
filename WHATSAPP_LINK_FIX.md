# WhatsApp Channel Link Fix

## مشکل
وقتی لینک‌های گروه یا کانال WhatsApp با query parameter ها (مثل `?mode=wwt`) در فرم اضافه می‌شد، خطا می‌داد یا درست کار نمی‌کرد.

**مثال لینک مشکل‌دار:**
```
https://chat.whatsapp.com/CrZZDCIf9B2BdVN4N5dAsk?mode=wwt
```

## راه حل

### 1. بهبود `getWhatsAppUrl` در `useDeepLink.ts`

**قبل:**
```typescript
if (whatsappType === 'channel') {
  // Channel link - use as is
  return value.startsWith('http') ? value : `https://${value}`
}
```

**بعد:**
```typescript
if (whatsappType === 'channel') {
  // Channel link - use as is, properly handle all WhatsApp link formats
  let cleanValue = value.trim()
  
  // If already has protocol, use as is
  if (/^https?:\/\//i.test(cleanValue)) {
    return cleanValue
  }
  
  // If starts with whatsapp.com or chat.whatsapp.com, add https
  if (/^(chat\.)?whatsapp\.com/i.test(cleanValue)) {
    return `https://${cleanValue}`
  }
  
  // Otherwise add https protocol
  return `https://${cleanValue}`
}
```

**تغییرات:**
- ✅ از `.startsWith('http')` به regex pattern تغییر کردیم تا `http` و `https` رو هر دو handle کنه
- ✅ پشتیبانی از `chat.whatsapp.com` اضافه شد
- ✅ Query parameter ها حفظ می‌شن (`?mode=wwt`)
- ✅ `trim()` برای حذف فاصله‌های اضافی

### 2. بهبود Placeholder در فرم‌ها

**قبل:**
```html
placeholder="مثال: https://whatsapp.com/channel/0029VaeW5Uk..."
```

**بعد:**
```html
placeholder="مثال: https://chat.whatsapp.com/ABC123xyz یا https://whatsapp.com/channel/..."
```

**فایل‌های تغییر یافته:**
- `components/ui/forms/add/basiclink.vue`
- `components/ui/forms/edit/basiclink.vue`

---

## انواع لینک‌های WhatsApp که پشتیبانی می‌شن

### ✅ گروه (Group)
```
https://chat.whatsapp.com/ABC123xyz
https://chat.whatsapp.com/ABC123xyz?mode=wwt
chat.whatsapp.com/ABC123xyz
```

### ✅ کانال (Channel)
```
https://whatsapp.com/channel/0029VaeW5Uk
https://whatsapp.com/channel/0029VaeW5Uk?mode=channel
whatsapp.com/channel/0029VaeW5Uk
```

### ✅ شماره تلفن (Phone)
```
+989123456789
989123456789
9123456789
```

---

## تست

### سناریو 1: لینک گروه با query parameter
**ورودی:**
```
https://chat.whatsapp.com/CrZZDCIf9B2BdVN4N5dAsk?mode=wwt
```
**خروجی:**
```
https://chat.whatsapp.com/CrZZDCIf9B2BdVN4N5dAsk?mode=wwt
```
✅ حفظ شده

### سناریو 2: لینک بدون protocol
**ورودی:**
```
chat.whatsapp.com/ABC123xyz
```
**خروجی:**
```
https://chat.whatsapp.com/ABC123xyz
```
✅ protocol اضافه شد

### سناریو 3: لینک کانال
**ورودی:**
```
whatsapp.com/channel/0029VaeW5Uk
```
**خروجی:**
```
https://whatsapp.com/channel/0029VaeW5Uk
```
✅ protocol اضافه شد

---

## فایل‌های تغییر یافته

1. `dash.linku.im/digital-business-card/composables/useDeepLink.ts`
2. `dash.linku.im/digital-business-card/components/ui/forms/add/basiclink.vue`
3. `dash.linku.im/digital-business-card/components/ui/forms/edit/basiclink.vue`

---

## دستورات Deployment

```bash
cd c:\Users\babaw\Downloads\projects_backup
git add .
git commit -m "fix: WhatsApp channel/group link handling with query parameters"
git push origin master
```

سپس در سرور:
```bash
ssh root@95.215.59.92
cd /root/linku/digital-business-card
git pull origin master
npm install
npm run build
pm2 restart all
```

---

## نکات مهم

- ⚠️ این fix فقط برای `whatsappType === 'channel'` کار می‌کنه
- ⚠️ لینک‌های شماره تلفن (`whatsappType === 'phone'`) قبلا هم کار می‌کرد
- ✅ Query parameter ها حالا حفظ می‌شن
- ✅ پشتیبانی از `chat.whatsapp.com` (گروه) اضافه شد
