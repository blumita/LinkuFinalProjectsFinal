import { defineNuxtRouteMiddleware, abortNavigation } from 'nuxt/app'
import { useAuthStore } from '~/stores/auth'

/**
 * Global Auth Middleware
 * فقط validation token با API
 */
export default defineNuxtRouteMiddleware(async (to) => {
    // صفحات عمومی
    const publicPaths = ['/auth', '/login', '/register', '/forgot-password', '/reset-password', '/', '/card', '/c/']
    const path = to.path.toLowerCase()
    const isPublicPath = publicPaths.some(p => path === p || path.startsWith(p))
    
    if (isPublicPath) return

    // فقط در کلاینت
    if (import.meta.client) {
        const authStore = useAuthStore()
        
        // اول از store بخون، بعد از localStorage و cookie
        let token = authStore.token
        if (!token) {
            token = localStorage.getItem('auth_token') || document.cookie.split('; ').find(row => row.startsWith('auth_token='))?.split('=')[1] || null
        }
        
        if (!token) {
            console.log('❌ No token found - redirecting to login')
            return navigateTo('/auth/login')
        }
        
        // اگه token توی store نیست، set کن
        if (!authStore.token) {
            console.log('✅ Hydrating token to store')
            authStore.setToken(token)
        }
        
        // Validate با API (فقط یکبار)
        if (!authStore.isValidated) {
            try {
                const { $axios } = useNuxtApp()
                await $axios.get('/v1/profile/info')
                authStore.isValidated = true
                console.log('✅ Token validated successfully')
            } catch (error) {
                // Token invalid - پاک کن و redirect
                console.error('❌ Token validation failed:', error)
                authStore.clearToken()
                localStorage.clear()
                document.cookie.split(";").forEach(c => {
                    document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/")
                })
                return navigateTo('/auth/login')
            }
        }
    }
})
