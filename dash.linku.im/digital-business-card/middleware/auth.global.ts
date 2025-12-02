import { defineNuxtRouteMiddleware, useCookie, navigateTo } from 'nuxt/app'

/**
 * Global Auth Middleware
 * محافظت از تمام صفحات داشبورد و تنظیمات
 */
export default defineNuxtRouteMiddleware((to) => {
    // صفحات عمومی که نیاز به لاگین ندارن
    const publicPaths = ['/auth', '/login', '/register', '/forgot-password', '/reset-password', '/', '/card', '/c/']
    const path = to.path.toLowerCase() // تبدیل به حروف کوچک برای مقایسه
    
    // اگه صفحه عمومی هست، بذار رد بشه
    const isPublicPath = publicPaths.some(p => path === p || path.startsWith(p))
    if (isPublicPath) return

    // همه صفحات دیگه نیاز به لاگین دارن
    // فقط در سمت کلاینت چک کن - SSR رو skip کن تا hydration درست کار کنه
    if (import.meta.client) {
        const token = localStorage.getItem('auth_token')
        const cookieToken = document.cookie.split('; ').find(row => row.startsWith('auth_token='))?.split('=')[1]
        
        // اگه هیچکدوم نبود، برو لاگین
        if (!token && !cookieToken) {
            return navigateTo('/auth/login', { replace: true })
        }
        
        // اگه فقط یکیشون هست، sync کن
        if (token && !cookieToken) {
            const maxAge = 60 * 60 * 24 * 30 // 30 days
            document.cookie = `auth_token=${token}; path=/; max-age=${maxAge}; SameSite=Lax`
        } else if (!token && cookieToken) {
            localStorage.setItem('auth_token', cookieToken)
        }
    }
})
