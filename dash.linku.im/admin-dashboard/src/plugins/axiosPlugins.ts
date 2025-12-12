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
            baseURL: import.meta.env.VITE_API_BASE_URL || 'https://api.linku.im/api',
            withCredentials: false,
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
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

                    // لاگ برای دیدن کدوم API داره 401 برمی‌گردونه
                    console.error('🔴 401 Unauthorized:', {
                        url: error.config?.url,
                        method: error.config?.method,
                        response: error.response?.data,
                        headers: error.config?.headers
                    })

                    // Only logout if it's an auth-related endpoint (login, me, etc.)
                    // Don't logout for data fetch errors (like userList, profiles)
                    const authEndpoints = ['/admin/login', '/admin/me', '/admin/refresh']
                    const isAuthEndpoint = authEndpoints.some(endpoint => error.config?.url?.includes(endpoint))

                    if (isAuthEndpoint) {
                        console.warn('Auth token invalid, logging out...')
                        authStore.logout()

                        // Redirect to login
                        if (typeof window !== 'undefined' && !window.location.pathname.includes('/auth/login')) {
                            window.location.href = '/auth/login'
                        }
                    } else {
                        console.warn('API returned 401 but not logging out (non-auth endpoint)')
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
