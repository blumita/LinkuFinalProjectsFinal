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

        authStore.hydrateToken() // Restore token on page load

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
            return Promise.reject(error)
        }
    )

    // Make Axios instance available via `useNuxtApp().$axios`
    nuxtApp.provide('axios', api)
})