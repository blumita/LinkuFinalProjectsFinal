import { defineNuxtRouteMiddleware, navigateTo } from 'nuxt/app'
import { useUserStore } from '~/stores/user'

export default defineNuxtRouteMiddleware(async (to, from) => {
  // فقط در کلاینت اجرا شود
  if (import.meta.server) return

  const userStore = useUserStore()
  
  // اگر user هنوز fetch نشده، صبر کن
  if (!userStore.fetched) {
    await userStore.fetchUser()
  }

  const isPro = userStore.user?.isPro || false
  const cardCount = userStore.cards?.length || 0

  // چک محدودیت کارت
  if (!isPro && cardCount >= 1) {
    // کاربر رایگان که قبلاً یک کارت دارد
    return navigateTo('/dashboard')
  } else if (isPro && cardCount >= 5) {
    // کاربر پرو که 5 کارت دارد
    return navigateTo('/dashboard')
  }

  // اگر در محدوده مجاز است، اجازه ورود بده
  return
})
