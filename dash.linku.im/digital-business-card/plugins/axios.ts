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
                
                // فقط اگر واقعاً unauthenticated باشه لاگ‌اوت کن
                // برای PWA و حالت offline این مهم هست
                if (error.response?.data?.message === 'Unauthenticated.' || 
                    error.response?.data?.code === 'unauthenticated' ||
                    error.response?.data?.message?.includes('Unauthenticated')) {
                    
                    console.warn('Token expired or invalid, logging out...')
                    
                    // پاک کردن token
                    authStore.logout()
                    
                    // Redirect to login only if not already on login/register page
                    if (process.client && !window.location.pathname.includes('/login') && !window.location.pathname.includes('/register')) {
                        navigateTo('/login')
                    }
                }
            }
            
            // Handle 500 Server Error
            if (error.response?.status === 500) {
                const errorMessage = error.response?.data?.message || 'خطای سرور رخ داده است'
                console.error('❌ Server Error 500:', {
                    endpoint: error.config?.url,
                    message: errorMessage,
                    details: error.response?.data
                })
                
                // Show user-friendly message
                if (process.client) {
                    // You can show a toast notification here if you have one
                    console.error('🔴 خطای سرور: ' + errorMessage)
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