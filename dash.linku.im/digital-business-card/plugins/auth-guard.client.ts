export default defineNuxtPlugin((nuxtApp) => {
    // این plugin فقط برای navigation بین صفحات هست
    if (import.meta.client) {
        nuxtApp.hook('page:start', () => {
            const currentPath = window.location.pathname.toLowerCase()
            const publicPaths = ['/auth', '/login', '/register', '/forgot-password', '/reset-password', '/', '/card', '/c/']
            const isPublicPath = publicPaths.some(p => currentPath === p || currentPath.startsWith(p))
            
            if (!isPublicPath) {
                const token = localStorage.getItem('auth_token')
                const cookieToken = document.cookie.split('; ').find(row => row.startsWith('auth_token='))?.split('=')[1]
                
                if (!token && !cookieToken) {
                    localStorage.clear()
                    window.location.replace('/auth/login')
                }
            }
        })
    }
})
