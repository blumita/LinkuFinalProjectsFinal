import { defineStore } from 'pinia'
import axios from 'axios'

export const useAuthStore = defineStore('auth', {
    state: () => ({
        token: localStorage.getItem('token') || '',
        user: null as any,
        isVerified: false
    }),
    actions: {
        isAuthenticated() {
            return !!this.token
        },
        setToken(token: string) {
            this.token = token
            localStorage.setItem('token', token)
            this.isVerified = false
        },
        logout() {
            this.token = ''
            this.user = null
            this.isVerified = false
            localStorage.removeItem('token')
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
