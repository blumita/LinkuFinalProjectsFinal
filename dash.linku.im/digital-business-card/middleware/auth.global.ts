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
        const token = localStorage.getItem('auth_token') || document.cookie.split('; ').find(row => row.startsWith('auth_token='))?.split('=')[1]
        
        if (!token) {
            return abortNavigation()
        }
        
        // Validate با API (فقط اگه store خالیه)
        if (!authStore.token) {
            try {
                const { $axios } = useNuxtApp()
                authStore.setToken(token)
                await $axios.get('/v1/profile/info')
            } catch (error) {
                // Token invalid
                authStore.clearToken()
                localStorage.clear()
                document.cookie.split(";").forEach(c => {
                    document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/")
                })
                window.location.replace('/auth/login')
                return abortNavigation()
            }
        }
    }
})
