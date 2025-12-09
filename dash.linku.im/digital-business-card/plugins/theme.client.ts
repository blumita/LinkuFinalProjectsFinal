export default defineNuxtPlugin((nuxtApp) => {
  if (process.client) {
    // چک کن که آیا صفحه پروفایل عمومی هست یا نه
    const path = window.location.pathname
    const isPublicProfile = /^\/[a-zA-Z0-9_-]+$/.test(path) && !path.startsWith('/dashboard') && !path.startsWith('/auth') && !path.startsWith('/preview')
    
    // اگر صفحه پروفایل عمومی بود، تم رو اعمال نکن
    if (isPublicProfile) {
      return
    }
    
    // بررسی تنظیمات ذخیره شده کاربر برای theme mode
    const savedThemeMode = localStorage.getItem('theme-mode') || localStorage.getItem('theme')
    const savedThemeColor = localStorage.getItem('theme-color')
    
    // اگر رنگ تم ذخیره نشده بود، black رو پیش‌فرض می‌ذاریم و ذخیره می‌کنیم
    const themeColor = savedThemeColor || 'black'
    if (!savedThemeColor) {
      localStorage.setItem('theme-color', 'black')
    }
    
    // اضافه کردن کلاس رنگ تم
    document.documentElement.classList.add(`theme-${themeColor}`)
    
    // تابع آپدیت theme-color متا تگ برای status bar موبایل
    const updateStatusBarColor = (isDark: boolean) => {
      // رنگ‌های مناسب برای status bar
      const darkColor = '#0a0a0a' // تقریباً همرنگ bg-background در دارک
      const lightColor = '#ffffff' // سفید برای لایت
      const color = isDark ? darkColor : lightColor
      
      // پیدا کردن و آپدیت متا تگ‌های theme-color
      // اول همه متا تگ‌های theme-color رو پیدا می‌کنیم
      const existingMetas = document.querySelectorAll('meta[name="theme-color"]')
      
      // اگر متا تگ‌های media-based هستن، حذفشون می‌کنیم
      existingMetas.forEach(meta => {
        if (meta.getAttribute('media')) {
          meta.remove()
        }
      })
      
      // پیدا یا ساخت متا تگ بدون media
      let themeColorMeta = document.querySelector('meta[name="theme-color"]:not([media])') as HTMLMetaElement
      if (!themeColorMeta) {
        themeColorMeta = document.createElement('meta')
        themeColorMeta.name = 'theme-color'
        document.head.appendChild(themeColorMeta)
      }
      themeColorMeta.content = color
      
      // آپدیت apple-mobile-web-app-status-bar-style
      let appleStatusBar = document.querySelector('meta[name="apple-mobile-web-app-status-bar-style"]') as HTMLMetaElement
      if (!appleStatusBar) {
        appleStatusBar = document.createElement('meta')
        appleStatusBar.name = 'apple-mobile-web-app-status-bar-style'
        document.head.appendChild(appleStatusBar)
      }
      // iOS status bar styles: default (dark text), black (black bg), black-translucent (transparent)
      appleStatusBar.content = isDark ? 'black' : 'default'
      
      // آپدیت msapplication-TileColor برای ویندوز
      let msTileColor = document.querySelector('meta[name="msapplication-TileColor"]') as HTMLMetaElement
      if (msTileColor) {
        msTileColor.content = color
      }
    }
    
    // تابع اعمال dark/light mode
    const applyTheme = (isDark: boolean) => {
      // غیرفعال: همیشه لایت مود باشه، به تنظیمات سیستم توجه نکنیم
      document.documentElement.classList.remove('dark')
      // آپدیت status bar برای لایت مود
      updateStatusBarColor(false)
    }

    // همیشه لایت مود رو اعمال کن
    applyTheme(false)

    // غیرفعال: به تغییرات تنظیمات سیستم توجه نمی‌کنیم
    // همیشه لایت مود باقی می‌مونه
    
    // MutationObserver برای زمانی که کلاس dark دستی تغییر می‌کنه (از صفحه تنظیمات)
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
          const isDark = document.documentElement.classList.contains('dark')
          updateStatusBarColor(isDark)
        }
      })
    })
    
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class']
    })
  }
})
