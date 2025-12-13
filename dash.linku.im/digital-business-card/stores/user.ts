import {defineStore} from 'pinia'
import {useRouter} from 'nuxt/app'
import type {AxiosInstance} from 'axios'
import type {CardItem} from "~/stores/form";
import {useAuthStore} from "~/stores/auth";

export interface User {
    id: number
    name: string
    userName: string
    username?: string  // alias برای سازگاری با API
    isPro: boolean
    email: string
    phone: string
    countryCode:string
    emailVerified: boolean
    role: string
    referralCode: string
    referralBy: number
    location: string
    avatar: string
    removeBranding:boolean
    cardsDataList?: CardItem[]
    createdAt: typeof Date
    updatedAt: typeof Date
    // فیلدهای اشتراک
    subscriptionEndDate?: string
    subscription_end_date?: string
    daysRemaining?: number
    days_remaining?: number
}

export const useUserStore = defineStore('userStore', {
    state: () => ({
        user: {} as User,
        cards: [] as CardItem[],
        fetched: false
    }),

    getters: {
        isUserPro: (state): boolean => !!state.user?.isPro,
        cardCount: (state): number => state.cards.length,
    },

    actions: {
        async fetchUser() {
            try {
                const formStore = useFormStore()
                const {$axios} = useNuxtApp()
                const axios = $axios as AxiosInstance

                const {data} = await axios.get('/user')
                
                // دیباگ: چک کنیم بکند isPro رو برمیگردونه یا نه
                console.log('🔍 User data from backend:', data.data)
                console.log('👑 isPro status:', data.data?.isPro)
                console.log('📊 Full user object:', JSON.stringify(data.data, null, 2))
                
                this.user = data.data
                this.cards = this.user?.cardsDataList || []
                /*this.activeCard = this.cards.find((c:CardItem) => c.isDefault) || null*/
                formStore.cards = this.cards
                
                // بازیابی پروفایل فعال از localStorage
                formStore.restoreActiveProfile()

                this.fetched = true
                
                // دیباگ: بعد از ست کردن هم چک کنیم
                console.log('✅ User store updated. isPro:', this.user?.isPro)
                console.log('✅ isUserPro getter:', this.isUserPro)
            } catch (error) {
                console.error('❌ Error fetching user:', error)
                const router = useRouter()
                this.fetched = true
                await router.push('/auth/login')
            }
        },

        setActiveCard(cardId: string) {
            /*this.activeCard = this.cards.find((c:CardItem) => c.id === cardId) || null*/
        },

        clearProfile() {
            this.user = {} as User
            this.cards = []
            /*this.activeCard = null*/
        },

        async logout() {
            try {
                // Clear auth store (token, localStorage, cookie)
                const authStore = useAuthStore()
                authStore.clearToken()
                
                // Clear local storage completely
                if (import.meta.client) {
                    localStorage.removeItem('token')
                    localStorage.removeItem('authToken')
                    localStorage.removeItem('auth_token')
                    localStorage.removeItem('user')
                    // Clear any cached user data
                    localStorage.removeItem('userStore')
                    localStorage.removeItem('formStore')
                }
                
                // Clear store state
                this.clearProfile()
                this.fetched = false
                
                // Clear axios token
                const {$axios} = useNuxtApp()
                const axios = $axios as AxiosInstance
                if (axios.defaults.headers.common) {
                    delete axios.defaults.headers.common['Authorization']
                }
                
                // Clear all cookies related to auth
                if (import.meta.client) {
                    document.cookie = 'auth_token=; path=/; max-age=0'
                    document.cookie = 'token=; path=/; max-age=0'
                }
            } catch (error) {
                console.error('Logout error:', error)
            }
        },
    },
})