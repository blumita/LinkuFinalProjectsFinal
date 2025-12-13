#!/bin/bash

# ========================================
# راهنمای کامل Deploy برای سرور لینوکس
# Linku Platform - Memory Fix
# ========================================

echo "🚀 شروع فرآیند Deploy..."

# ========================================
# مرحله 1: آپلود فایل‌های جدید به سرور
# ========================================

echo ""
echo "📤 مرحله 1: آپلود فایل‌های تغییر یافته..."
echo "---------------------------------------------"

# آپلود package.json های جدید
scp c:/Users/babaw/Downloads/projects_backup/dash.linku.im/digital-business-card/package.json root@your-server-ip:/var/www/dash.linku.im/digital-business-card/
scp c:/Users/babaw/Downloads/projects_backup/dash.linku.im/admin-dashboard/package.json root@your-server-ip:/var/www/dash.linku.im/admin-dashboard/

# آپلود .npmrc
scp c:/Users/babaw/Downloads/projects_backup/dash.linku.im/digital-business-card/.npmrc root@your-server-ip:/var/www/dash.linku.im/digital-business-card/
scp c:/Users/babaw/Downloads/projects_backup/dash.linku.im/admin-dashboard/.npmrc root@your-server-ip:/var/www/dash.linku.im/admin-dashboard/

# آپلود اسکریپت‌های deploy
scp c:/Users/babaw/Downloads/projects_backup/deploy-digital-card.sh root@your-server-ip:/var/www/
scp c:/Users/babaw/Downloads/projects_backup/deploy-admin-dashboard.sh root@your-server-ip:/var/www/

# آپلود تمام فایل‌های تغییر یافته
scp c:/Users/babaw/Downloads/projects_backup/dash.linku.im/digital-business-card/components/ui/BottomSheet.vue root@your-server-ip:/var/www/dash.linku.im/digital-business-card/components/ui/
scp c:/Users/babaw/Downloads/projects_backup/dash.linku.im/digital-business-card/pages/preview/[slug].vue root@your-server-ip:/var/www/dash.linku.im/digital-business-card/pages/preview/
scp c:/Users/babaw/Downloads/projects_backup/api.linku.im/digital-business-card/app/Http/Controllers/v1/CardController.php root@your-server-ip:/var/www/api.linku.im/digital-business-card/app/Http/Controllers/v1/
scp c:/Users/babaw/Downloads/projects_backup/dash.linku.im/admin-dashboard/src/views/CreateCardView.vue root@your-server-ip:/var/www/dash.linku.im/admin-dashboard/src/views/

echo "✅ فایل‌ها با موفقیت آپلود شدند"
echo ""
echo "حالا دستورات زیر را در سرور اجرا کنید:"
echo "ssh root@your-server-ip"
