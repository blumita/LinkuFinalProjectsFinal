import { defineNuxtRouteMiddleware, useCookie } from 'nuxt/app'

export default defineNuxtRouteMiddleware(async (to) => {

    const publicPages = ['/auth/login', '/auth/register', '/auth/forgot-password', '/auth/reset-password']

    // اگر صفحه عمومی است، اجازه بده
    if (publicPages.includes(to.path)) return

    // در سمت سرور از cookie استفاده کن
    if (import.meta.server) {
        const tokenCookie = useCookie('auth_token')
        if (!tokenCookie.value) {
            return navigateTo('/auth/login')
        }
    }

    // در سمت کلاینت از localStorage استفاده کن
    if (import.meta.client) {
        const token = localStorage.getItem('auth_token')

        if (!token) {
            return navigateTo('/auth/login')
        }
    }

})