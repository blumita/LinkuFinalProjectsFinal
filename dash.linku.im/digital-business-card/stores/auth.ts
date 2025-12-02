import { defineStore } from 'pinia'
import { safeStorage } from '~/utils/safeStorage'

// Define the authentication store using Pinia
export const useAuthStore = defineStore('auth', {
    // State holds the token
    state: () => ({
        token: null as string | null, // Auth token, initially null
    }),

    // Actions to manipulate the token
    actions: {
        // Set a new token
        setToken(newToken: string) {
            this.token = newToken
            // Save to localStorage
            safeStorage.setItem('auth_token', newToken)
            // Save to cookie for SSR middleware (httpOnly: false for client access)
            if (import.meta.client) {
                const maxAge = 60 * 60 * 24 * 30 // 30 days
                document.cookie = `auth_token=${newToken}; path=/; max-age=${maxAge}; SameSite=Lax`
            }
        },

        // Clear the token
        clearToken() {
            this.token = null
            safeStorage.removeItem('auth_token')
            // Remove cookie
            if (import.meta.client) {
                document.cookie = 'auth_token=; path=/; max-age=0'
            }
        },

        // Load token from localStorage if available
        hydrateToken() {
            const savedToken = safeStorage.getItem('auth_token')
            if (savedToken) {
                this.token = savedToken
                // Sync to cookie if not present
                if (import.meta.client && !document.cookie.includes('auth_token=')) {
                    const maxAge = 60 * 60 * 24 * 30 // 30 days
                    document.cookie = `auth_token=${savedToken}; path=/; max-age=${maxAge}; SameSite=Lax`
                }
            }
        }
    },

    // Getters to compute derived state
    getters: {
        // Check if the user is authenticated (token exists)
        isAuthenticated: (state) => !!state.token
    }
})