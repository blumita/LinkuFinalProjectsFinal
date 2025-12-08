import { defineStore } from 'pinia'
import axios from 'axios'

// Create axios instance with baseURL
const apiClient = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || 'https://api.linku.im/api',
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    }
})

// In-memory fallback storage when sessionStorage is not available
let memoryToken = ''
let memoryUser: any = null

// Safe storage helpers with fallback
const getStoredToken = (): string => {
    try {
        return sessionStorage.getItem('adminToken') || ''
    } catch {
        // Fallback to memory storage
        return memoryToken || ''
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
        console.warn('sessionStorage not available, using memory storage')
        // Fallback to memory storage
        memoryToken = token
    }
}

const clearStoredToken = (): void => {
    try {
        sessionStorage.removeItem('adminToken')
        sessionStorage.removeItem('adminUser')
    } catch (e) {
        console.warn('sessionStorage not available, clearing memory storage')
        // Fallback to memory storage
        memoryToken = ''
        memoryUser = null
    }
}

const getStoredUser = (): any => {
    try {
        const user = sessionStorage.getItem('adminUser')
        return user ? JSON.parse(user) : null
    } catch {
        // Fallback to memory storage
        return memoryUser || null
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
        console.warn('sessionStorage not available, using memory storage')
        // Fallback to memory storage
        memoryUser = user
    }
}

export const useAuthStore = defineStore('auth', {
    state: () => ({
        token: '',
        user: null,
        isVerified: false,
        isVerifying: false,
        isHydrated: false
    }),
    getters: {
        isAuthenticated: (state) => !!state.token && state.token.length > 0 && state.isVerified
    },
    actions: {
        // Hydrate token from sessionStorage once
        hydrateToken() {
            if (!this.isHydrated) {
                this.token = getStoredToken()
                this.user = getStoredUser()
                // اگر هم توکن و هم یوزر وجود داشت، فرض می‌کنیم verified است
                // (نیازی به verify مجدد در هر refresh نیست)
                if (this.token && this.user) {
                    this.isVerified = true
                }
                this.isHydrated = true
            }
        },
        setToken(token: string) {
            this.token = token
            setStoredToken(token)
            this.isVerified = false
            this.isHydrated = true
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
            this.isHydrated = false
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
                const response = await apiClient.get('/user/admin/me', {
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
