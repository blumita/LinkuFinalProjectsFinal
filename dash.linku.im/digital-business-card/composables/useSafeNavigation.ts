/**
 * Composable برای مدیریت هوشمند navigation
 * با پشتیبانی کامل از PWA، Browser و تمام سناریوها
 */

import { useRouter } from 'vue-router'
import { useNuxtApp } from 'nuxt/app'

export const useSafeNavigation = () => {
  const router = useRouter()
  const nuxtApp = useNuxtApp()

  /**
   * تشخیص حالت PWA Standalone
   */
  const isStandalone = (): boolean => {
    if (typeof window === 'undefined') return false
    
    return window.matchMedia('(display-mode: standalone)').matches ||
           (window.navigator as any).standalone === true ||
           document.referrer.includes('android-app://')
  }

  /**
   * تشخیص عمق history
   */
  const hasHistory = (): boolean => {
    if (typeof window === 'undefined') return false
    return window.history.length > 2
  }

  /**
   * بازگشت امن با fallback هوشمند
   * @param fallbackPath مسیر پیش‌فرض در صورت نبود history
   */
  const goBack = (fallbackPath: string = '/dashboard'): void => {
    if (typeof window === 'undefined') return

    // 1. سعی در استفاده از PWA plugin (اگر موجود باشد)
    if ((nuxtApp.$pwa as any)?.safeNavigateBack) {
      (nuxtApp.$pwa as any).safeNavigateBack(fallbackPath)
      return
    }

    // 2. در حالت PWA همیشه به fallback برو (جلوگیری از خروج از اپ)
    if (isStandalone()) {
      router.push(fallbackPath)
      return
    }

    // 3. اگر history داریم، برگرد
    if (hasHistory()) {
      router.back()
      return
    }

    // 4. در غیر این صورت به fallback برو
    router.push(fallbackPath)
  }

  /**
   * بازگشت به صفحه خاص بدون در نظر گرفتن history
   * @param path مسیر مقصد
   */
  const goTo = (path: string): void => {
    router.push(path)
  }

  /**
   * جایگزینی مسیر فعلی (بدون اضافه کردن به history)
   * @param path مسیر جدید
   */
  const replaceTo = (path: string): void => {
    router.replace(path)
  }

  /**
   * بازگشت به صفحه اصلی داشبورد
   */
  const goToDashboard = (): void => {
    router.push('/dashboard')
  }

  /**
   * بررسی اینکه آیا می‌توانیم back برویم
   */
  const canGoBack = (): boolean => {
    if (isStandalone()) return true // در PWA همیشه می‌تونیم برگردیم (به fallback)
    return hasHistory()
  }

  /**
   * بازگشت چندین سطح به عقب
   * @param steps تعداد صفحات برای بازگشت
   * @param fallbackPath مسیر پیش‌فرض
   */
  const goBackSteps = (steps: number = 1, fallbackPath: string = '/dashboard'): void => {
    if (typeof window === 'undefined') return

    if (isStandalone() || !hasHistory()) {
      router.push(fallbackPath)
      return
    }

    window.history.go(-steps)
  }

  return {
    // Methods
    goBack,
    goTo,
    replaceTo,
    goToDashboard,
    goBackSteps,
    
    // Utilities
    canGoBack,
    isStandalone,
    hasHistory
  }
}
