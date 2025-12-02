/**
 * PWA Navigation Plugin
 * مدیریت navigation در PWA mode برای جلوگیری از خروج ناخواسته از اپ
 */

export default defineNuxtPlugin((nuxtApp) => {
  if (!process.client) return

  // بررسی آیا اپ در حالت PWA standalone هست
  const isStandalone = (): boolean => {
    return window.matchMedia('(display-mode: standalone)').matches ||
           (window.navigator as any).standalone === true ||
           document.referrer.includes('android-app://')
  }

  // تنظیم history اولیه برای PWA
  const initPwaHistory = () => {
    if (isStandalone()) {
      // اضافه کردن یک entry به history برای جلوگیری از خروج با back
      if (window.history.length <= 1) {
        window.history.pushState({ pwa: true }, '', window.location.href)
      }
    }
  }

  // مدیریت popstate event
  const handlePopState = (event: PopStateEvent) => {
    if (!isStandalone()) return

    // اگر در صفحه اصلی هستیم، جلوگیری از خروج
    const protectedPaths = ['/dashboard', '/auth/login']
    const currentPath = window.location.pathname
    
    if (protectedPaths.some(p => currentPath.startsWith(p)) || currentPath === '/') {
      // اگر کاربر می‌خواهد از اپ خارج شود، به dashboard هدایت کن
      if (window.history.length <= 2) {
        window.history.pushState({ pwa: true }, '', '/dashboard')
      }
    }
  }

  // Safe navigation برای PWA
  const safeNavigateBack = (fallbackPath: string = '/dashboard') => {
    if (isStandalone()) {
      // در PWA همیشه به fallback برو تا از اپ خارج نشه
      window.location.href = fallbackPath
    } else if (window.history.length > 2) {
      window.history.back()
    } else {
      window.location.href = fallbackPath
    }
  }

  // Initialize
  nuxtApp.hook('app:mounted', () => {
    initPwaHistory()
    window.addEventListener('popstate', handlePopState)
  })

  // Cleanup
  nuxtApp.hook('app:beforeMount', () => {
    window.removeEventListener('popstate', handlePopState)
  })

  // Provide helpers
  return {
    provide: {
      pwa: {
        isStandalone,
        safeNavigateBack
      }
    }
  }
})
