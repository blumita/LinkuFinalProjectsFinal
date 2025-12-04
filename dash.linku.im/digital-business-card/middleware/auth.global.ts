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
        
        // Validate با API (فقط یکبار یا بعد از 5 دقیقه)
        const lastValidated = authStore.lastValidated || 0
        const now = Date.now()
        const validationInterval = 5 * 60 * 1000 // 5 minutes
        
        if (!authStore.isValidated || (now - lastValidated) > validationInterval) {
            try {
                const { $axios } = useNuxtApp()
                await $axios.get('/v1/profile/info')
                authStore.isValidated = true
                authStore.lastValidated = now
                console.log('✅ Token validated successfully')
            } catch (error: any) {
                // فقط اگه واقعاً 401 Unauthenticated باشه
                if (error?.response?.status === 401 && 
                    (error?.response?.data?.message === 'Unauthenticated.' || 
                     error?.response?.data?.message?.includes('Unauthenticated'))) {
                    console.error('❌ Token validation failed - Unauthenticated')
                    authStore.clearToken()
                    return navigateTo('/auth/login')
                } else {
                    // Network error یا مشکل دیگه - token رو نگه دار
                    console.warn('⚠️ Validation failed but keeping token:', error?.message)
                    authStore.isValidated = true // فرض کن valid هست
                    authStore.lastValidated = now
                }
            }
        }
    }
})
