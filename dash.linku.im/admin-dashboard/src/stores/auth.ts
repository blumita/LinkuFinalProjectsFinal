import { defineStore } from 'pinia'
import axios from 'axios'

// Safe localStorage access
const getStoredToken = (): string => {
    try {
        return localStorage.getItem('token') || ''
    } catch (e) {
        console.warn('localStorage not available:', e)
        return ''
    }
}

export const useAuthStore = defineStore('auth', {
    state: () => ({
        token: getStoredToken(),
        user: null as any,
        isVerified: false
    }),
    getters: {
        isAuthenticated: (state) => !!state.token && state.token.length > 0
    },
    actions: {
        setToken(token: string) {
            this.token = token
            try {
                localStorage.setItem('token', token)
            } catch (e) {
                console.warn('Could not save token to localStorage:', e)
            }
            this.isVerified = false
        },
        logout() {
            this.token = ''
            this.user = null
            this.isVerified = false
            try {
                localStorage.removeItem('token')
            } catch (e) {
                console.warn('Could not remove token from localStorage:', e)
            }
        },
        async verifyToken(): Promise<boolean> {
            if (!this.token) {
                return false
            }
            
            try {
                const response = await axios.get('/user/admin/me', {
                    headers: {
                        Authorization: `Bearer ${this.token}`
                    }
                })
                this.user = response.data
                this.isVerified = true
                return true
            } catch (error) {
                // توکن نامعتبر است
                this.logout()
                return false
            }
        }
    }
})
