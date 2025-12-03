import { defineStore } from 'pinia'
import axios from 'axios'

// Safe storage helpers with fallback
const getStoredToken = (): string => {
    try {
        return sessionStorage.getItem('adminToken') || ''
    } catch {
        return ''
    }
}

const setStoredToken = (token: string): void => {
    try {
        if (token) {
            sessionStorage.setItem('adminToken', token)
        } else {
            sessionStorage.removeItem('adminToken')
        }
    } catch (e) {
        console.warn('Could not save token:', e)
    }
}

const clearStoredToken = (): void => {
    try {
        sessionStorage.removeItem('adminToken')
        sessionStorage.removeItem('adminUser')
    } catch (e) {
        console.warn('Could not clear token:', e)
    }
}

const getStoredUser = (): any => {
    try {
        const user = sessionStorage.getItem('adminUser')
        return user ? JSON.parse(user) : null
    } catch {
        return null
    }
}

const setStoredUser = (user: any): void => {
    try {
        if (user) {
            sessionStorage.setItem('adminUser', JSON.stringify(user))
        } else {
            sessionStorage.removeItem('adminUser')
        }
    } catch (e) {
        console.warn('Could not save user:', e)
    }
}

export const useAuthStore = defineStore('auth', {
    state: () => ({
        token: getStoredToken(),
        user: getStoredUser(),
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
        setUser(user: any) {
            this.user = user
            setStoredUser(user)
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
                    setStoredUser(userData)
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
