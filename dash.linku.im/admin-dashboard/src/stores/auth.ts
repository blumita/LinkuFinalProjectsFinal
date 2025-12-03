import { defineStore } from 'pinia'
import axios from 'axios'

// Memory store - primary storage method (no storage errors)
let memoryToken = ''
let memoryUser: any = null

const getStoredToken = (): string => {
    // Try localStorage silently
    try {
        const token = localStorage.getItem('admin_token')
        if (token) {
            memoryToken = token
        }
    } catch (e) {
        // Silently fail - use memory
    }
    
    return memoryToken
}

const setStoredToken = (token: string): void => {
    memoryToken = token
    // Try to persist but don't fail if not possible
    try {
        localStorage.setItem('admin_token', token)
    } catch (e) {
        // Silently fail - memory is enough
    }
}

const clearStoredToken = (): void => {
    memoryToken = ''
    memoryUser = null
    try {
        localStorage.removeItem('admin_token')
        localStorage.removeItem('token')
        localStorage.removeItem('auth_token')
    } catch (e) {
        // Silently fail
    }
}

export const useAuthStore = defineStore('auth', {
    state: () => ({
        token: getStoredToken(),
        user: memoryUser,
        isVerified: false,
        isVerifying: false
    }),
    getters: {
        isAuthenticated: (state) => !!state.token && state.token.length > 0 && state.isVerified
    },
    actions: {
        setToken(token: string) {
            this.token = token
            setStoredToken(token)
            this.isVerified = false
        },
        logout() {
            this.token = ''
            this.user = null
            this.isVerified = false
            this.isVerifying = false
            clearStoredToken()
        },
        async verifyToken(): Promise<boolean> {
            if (!this.token) {
                this.logout()
                return false
            }
            
            // اگر در حال verify است، منتظر بمان
            if (this.isVerifying) {
                await new Promise(resolve => setTimeout(resolve, 100))
                return this.isVerified
            }
            
            this.isVerifying = true
            
            try {
                const response = await axios.get('/admin/me', {
                    headers: {
                        Authorization: `Bearer ${this.token}`
                    },
                    timeout: 10000 // 10 ثانیه timeout
                })
                
                console.log('Admin me response:', response.data)
                
                // Backend returns: { success, message, data: { ...user } }
                const userData = response.data.data || response.data
                
                if (userData && userData.role === 'admin') {
                    this.user = userData
                    memoryUser = userData
                    this.isVerified = true
                    this.isVerifying = false
                    return true
                } else {
                    // کاربر ادمین نیست
                    console.error('کاربر ادمین نیست', userData)
                    this.logout()
                    this.isVerifying = false
                    return false
                }
            } catch (error: any) {
                console.error('Token verification failed:', error.response?.status, error.response?.data, error.message)
                // توکن نامعتبر است یا خطای سرور
                this.logout()
                this.isVerifying = false
                return false
            }
        }
    }
})
