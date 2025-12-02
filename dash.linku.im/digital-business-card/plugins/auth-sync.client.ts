/**
 * Auth Sync Plugin
 * همگام‌سازی توکن بین localStorage و cookie
 * این plugin در startup اجرا می‌شود
 */
export default defineNuxtPlugin(() => {
    if (import.meta.client) {
        const token = localStorage.getItem('auth_token')
        
        if (token) {
            // اگر توکن در localStorage هست ولی در cookie نیست، sync کن
            if (!document.cookie.includes('auth_token=')) {
                const maxAge = 60 * 60 * 24 * 30 // 30 days
                document.cookie = `auth_token=${token}; path=/; max-age=${maxAge}; SameSite=Lax`
            }
        } else {
            // اگر توکن در localStorage نیست، cookie را هم پاک کن
            if (document.cookie.includes('auth_token=')) {
                document.cookie = 'auth_token=; path=/; max-age=0'
            }
        }
    }
})
