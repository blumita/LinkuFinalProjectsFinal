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
  // راه‌اندازی Push Notifications بعد از 3 ثانیه (تا UI و authentication بارگذاری شود)
  setTimeout(async () => {
    try {
      // بررسی دقیق authentication
      if (!authStore.token || !authStore.isVerified) {
        console.log('ℹ️ کاربر احراز هویت نشده، Push Notification فعال نمی‌شود')
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
  }, 3000)
})
</script>

<template>
  <AlertProvider>
    <MainLayout />
  </AlertProvider>
</template>
