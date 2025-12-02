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
            // baseURL: 'http://127.0.0.1:8000/api',
            baseURL: 'https://api.linku.im/api',
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

        app.config.globalProperties.$axios = instance
    }
}
