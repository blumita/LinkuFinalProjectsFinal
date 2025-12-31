import { defineNuxtPlugin } from 'nuxt/app'
import { useAuthStore } from "~/stores/auth"
import axios from 'axios'

export default defineNuxtPlugin((nuxtApp) => {
    const config = useRuntimeConfig()
    const api = axios.create({
        // Use server-side proxy endpoints (no CORS issues!)
        baseURL: '/api/',
        timeout: 30000,
    })

    api.interceptors.request.use(config => {
        const authStore = useAuthStore()

        // فقط اگر token توی store نیست، یکبار hydrate کن
        if (!authStore.token) {
            authStore.hydrateToken()
        }

        const token = authStore.token

        if (token) {
            config.headers['Authorization'] = `Bearer ${token}` // Set Authorization header if token exists
        }

        return config
    }, error => {
        return Promise.reject(error) // Pass the error if there's a request setup issue
    })

    // Response interceptor
    api.interceptors.response.use(
        response => {
            return response
        },
        error => {
            // Log detailed error information
            if (process.client) {
                console.error('API Error:', {
                    url: error.config?.url,
                    method: error.config?.method,
                    status: error.response?.status,
                    data: error.response?.data,
                    message: error.message
                })
            }
            
            // Handle 401 Unauthorized
            if (error.response?.status === 401) {
                const authStore = useAuthStore()
                
                // لیست endpoint‌های عمومی که نیاز به توکن ندارن
                const publicEndpoints = ['club/', 'otp/', 'v1/cards/show/', 'public/']
                const isPublicEndpoint = publicEndpoints.some(ep => error.config?.url?.includes(ep))
                
                // فقط اگر واقعاً unauthenticated باشه و endpoint عمومی نباشه لاگ‌اوت کن
                if (!isPublicEndpoint && (
                    error.response?.data?.message === 'Unauthenticated.' || 
                    error.response?.data?.code === 'unauthenticated' ||
                    error.response?.data?.message?.includes('Unauthenticated'))) {
                    
                    console.warn('Token expired or invalid, logging out...')
                    
                    // پاک کردن token
                    authStore.logout()
                    
                    // Redirect to login only if not already on login/register page and not on public profile page
                    if (process.client && 
                        !window.location.pathname.includes('/login') && 
                        !window.location.pathname.includes('/register') &&
                        window.location.pathname.startsWith('/dashboard')) {
                        navigateTo('/login')
                    }
                }
            }
            
            // Handle 500 Server Error
            if (error.response?.status === 500) {
                const errorMessage = error.response?.data?.message || 'لطفاً چند دقیقه دیگر تلاش کنید'
                console.error('❌ Server Error 500:', {
                    endpoint: error.config?.url,
                    message: errorMessage,
                    details: error.response?.data
                })
                
                // Show user-friendly message
                if (process.client) {
                    // You can show a toast notification here if you have one
                    console.error('🔴 خطا: ' + errorMessage)
                }
            }
            
            // Handle 429 Too Many Requests (Rate Limit)
            if (error.response?.status === 429) {
                console.error('Rate limit exceeded:', error.response?.data)
                
                if (process.client) {
                    console.error('تعداد درخواست‌ها بیش از حد مجاز است. لطفاً چند دقیقه دیگر تلاش کنید.')
                }
            }
            
            // Handle 503 Service Unavailable (Database issues)
            if (error.response?.status === 503) {
                console.error('Service unavailable:', error.response?.data)
                
                if (process.client) {
                    console.error('سرویس در دسترس نیست. لطفا بعدا تلاش کنید.')
                }
            }
            
            return Promise.reject(error)
        }
    )

    // Make Axios instance available via `useNuxtApp().$axios`
    nuxtApp.provide('axios', api)
})