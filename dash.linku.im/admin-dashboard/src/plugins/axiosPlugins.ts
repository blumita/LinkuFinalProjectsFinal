import axios from 'axios'
import type { AxiosInstance } from 'axios'
import type { App } from 'vue'
import { useAuthStore } from '@/stores/auth'

declare module '@vue/runtime-core' {
    interface ComponentCustomProperties {
        $axios: AxiosInstance
    }
}

export default {
    install: (app: App) => {
        const instance = axios.create({
            baseURL: import.meta.env.DEV 
                ? 'http://127.0.0.1:8000/api'  // Development (local)
                : 'https://api.linku.im/api',   // Production
            /*headers: {
                'Content-Type': 'application/json'
            }*/
        })

        // ✅ افزودن توکن از store به هدر
        instance.interceptors.request.use(
            (config:any) => {
                const authStore = useAuthStore()
                const token = authStore.token
                if (token) {
                    config.headers.Authorization = `Bearer ${token}`
                }
                return config
            },
            (error:any) => Promise.reject(error)
        )
        
        // Response interceptor برای handle کردن خطاها
        instance.interceptors.response.use(
            (response) => response,
            (error) => {
                // Handle 401 Unauthorized
                if (error.response?.status === 401) {
                    const authStore = useAuthStore()
                    console.warn('Token expired or invalid, logging out...')
                    authStore.logout()
                    
                    // Redirect to login
                    if (typeof window !== 'undefined' && !window.location.pathname.includes('/login')) {
                        window.location.href = '/login'
                    }
                }
                
                // Handle 500 Server Error
                if (error.response?.status === 500) {
                    console.error('Server error:', error.response?.data)
                }
                
                // Handle 503 Service Unavailable
                if (error.response?.status === 503) {
                    console.error('Service unavailable:', error.response?.data)
                }
                
                return Promise.reject(error)
            }
        )

        app.config.globalProperties.$axios = instance
    }
}
