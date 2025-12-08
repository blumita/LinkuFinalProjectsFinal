/**
 * Composable برای مدیریت هوشمند navigation
 * با پشتیبانی کامل از PWA، Browser و تمام سناریوها
 */

import { useRouter } from 'vue-router'

export const useSafeNavigation = () => {
  const router = useRouter()

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
   * بررسی آیا صفحه قبلی داریم
   * استفاده از document.referrer و window.history
   */
  const hasHistory = (): boolean => {
    if (typeof window === 'undefined') return false
    
    // چک کردن اینکه آیا از داخل سایت خودمون اومدیم
    const referrer = document.referrer
    const currentOrigin = window.location.origin
    
    // اگر referrer از سایت خودمون باشه یا history بیشتر از 1 باشه
    return (referrer.startsWith(currentOrigin) && referrer !== window.location.href) || 
           window.history.length > 1
  }

  /**
   * بازگشت امن با fallback هوشمند
   * @param fallbackPath مسیر پیش‌فرض در صورت نبود history
   */
  const goBack = (fallbackPath: string = '/dashboard'): void => {
    if (typeof window === 'undefined') {
      router.push(fallbackPath)
      return
    }

    // اگر history داریم، برگرد
    if (hasHistory()) {
      // استفاده از تایم‌اوت برای جلوگیری از مشکلات race condition
      try {
        router.back()
        
        // اگر بعد از 300ms هنوز چیزی نشد، به fallback برو
        const timeout = setTimeout(() => {
          if (window.location.pathname === router.currentRoute.value.path) {
            router.push(fallbackPath)
          }
        }, 300)
        
        // پاکسازی تایم‌اوت بعد از navigation موفق
        router.afterEach(() => {
          clearTimeout(timeout)
        })
      } catch (error) {
        // در صورت خطا، مستقیم به fallback برو
        router.push(fallbackPath)
      }
    } else {
      // در غیر این صورت به fallback برو
      router.push(fallbackPath)
    }
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
