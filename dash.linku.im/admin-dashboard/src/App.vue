<script setup lang="ts">
import MainLayout from '@/layouts/MainLayout.vue'
import AlertProvider from '@/components/AlertProvider.vue'
import { onMounted } from 'vue'
import { initializePushNotifications } from '@/services/pushNotification'
import { useUserStore } from '@/stores/user'
import { useAuthStore } from '@/stores/auth'

const userStore = useUserStore()
const authStore = useAuthStore()

onMounted(async () => {
  // راه‌اندازی Push Notifications بعد از 2 ثانیه (تا UI بارگذاری شود)
  setTimeout(async () => {
    try {
      // بررسی کن آیا کاربر لاگین است و توکن معتبر است
      if (!authStore.isAuthenticated) {
        console.log('ℹ️ کاربر لاگین نیست، Push Notification فعال نمی‌شود')
        return
      }

      // تایید اعتبار توکن قبل از ادامه
      const isValid = await authStore.verifyToken()
      if (!isValid) {
        console.log('ℹ️ توکن نامعتبر است، Push Notification فعال نمی‌شود')
        return
      }

      console.log('🔔 راه‌اندازی Push Notifications...')
      const result = await initializePushNotifications()
      
      if (result.success && result.subscription) {
        console.log('✅ Push Notification فعال شد')
        
        // ذخیره subscription در بک‌اند
        try {
          await userStore.savePushSubscription(result.subscription)
          console.log('✅ Subscription در سرور ذخیره شد')
        } catch (error) {
          console.warn('⚠️ خطا در ذخیره subscription (ادامه می‌دهیم):', error)
        }
      } else {
        console.log('ℹ️ Push Notification فعال نشد:', result.error)
      }
    } catch (error) {
      console.error('❌ خطا در راه‌اندازی Push Notification:', error)
    }
  }, 2000)
})
</script>

<template>
  <AlertProvider>
    <MainLayout />
  </AlertProvider>
</template>
