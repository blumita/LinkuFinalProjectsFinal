import { defineStore } from 'pinia'
import axios from 'axios'

// استفاده از sessionStorage به جای localStorage (امن‌تر و با بستن مرورگر پاک می‌شود)
const getStoredToken = (): string => {
    try {
        return sessionStorage.getItem('admin_token') || ''
    } catch (e) {
        console.warn('sessionStorage not available:', e)
        return ''
    }
}

export const useAuthStore = defineStore('auth', {
    state: () => ({
        token: getStoredToken(),
        user: null as any,
        isVerified: false,
        isVerifying: false // برای جلوگیری از چند بار verify همزمان
    }),
    getters: {
        isAuthenticated: (state) => !!state.token && state.token.length > 0 && state.isVerified
    },
    actions: {
        setToken(token: string) {
            this.token = token
            try {
                // ذخیره در sessionStorage (با بستن مرورگر پاک می‌شود)
                sessionStorage.setItem('admin_token', token)
                // حذف localStorage قدیمی اگر وجود داشته باشد
                localStorage.removeItem('token')
                localStorage.removeItem('auth_token')
            } catch (e) {
                console.warn('Could not save token to sessionStorage:', e)
            }
            this.isVerified = false
        },
        logout() {
            this.token = ''
            this.user = null
            this.isVerified = false
            this.isVerifying = false
            try {
                // پاک کردن همه storage ها
                sessionStorage.removeItem('admin_token')
                localStorage.removeItem('token')
                localStorage.removeItem('auth_token')
                // پاک کردن همه کوکی‌ها
                document.cookie.split(';').forEach(c => {
                    document.cookie = c.trim().split('=')[0] + '=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;'
                })
            } catch (e) {
                console.warn('Could not clear storage:', e)
            }
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
