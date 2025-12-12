import {defineStore} from 'pinia'
import {computed, getCurrentInstance, ref} from 'vue'
import {useUserStore} from '@/stores/user'

export const useCardsStore = defineStore('card', () => {
    const userStore = useUserStore()
    const cards = ref<Card[]>([])
    const loading = ref(false)
    const error = ref<string | null>(null)

    interface ActivatedBy {
        id: number
        name: string
        email: string
        mobile?: string | null
        cardSlug: string
    }

    interface Card {
        id: string
        identifier: string
        ownerName: string
        mobile?: string
        description?: string
        cardType?: string
        license: string
        qrLink: string
        image?: string | null
        status: 'active' | 'inactive'
        isUsed: boolean
        createdAt: string
        activatedBy?: ActivatedBy | null
    }

    // ✅ axios از پلاگین global
    const {appContext} = getCurrentInstance()!
    const axios = appContext.config.globalProperties.$axios

    // 📦 دریافت لیست کارت‌ها
    const fetchCards = async () => {
        loading.value = true
        error.value = null
        try {
            const res = await axios.get('user/admin/cardVisit')
            cards.value = Array.isArray(res.data.data) ? res.data.data : []
        } catch (err: any) {
            console.error('❌ خطا در دریافت کارت‌ها:', err)
            error.value = err.message || 'خطا در دریافت کارت‌ها'
        } finally {
            loading.value = false
        }
    }

    // 🔍 جستجو بر اساس شناسه پروفایل
    const searchByProfileId = async (profileId: string) => {
        if (!profileId) return null
        try {
            const res = await axios.get(`user/admin/cardVisit/search/${profileId}`)
            return res.data?.data || null
        } catch (err) {
            console.error('❌ خطا در جستجو بر اساس پروفایل:', err)
            return null
        }
    }

    // ⚡ فعال‌سازی کارت
    const activateCard = async (cardId: string, payload: any = {}) => {
        try {
            const res = await axios.post(`user/admin/cardVisit/${cardId}/toggleStatus`, payload)
            const updated = res.data?.data || res.data
            // جایگزینی در لیست کارت‌ها
            const index = cards.value.findIndex(c => c.id === cardId)
            if (index !== -1) cards.value[index] = updated
            return updated
        } catch (err) {
            console.error('❌ خطا در فعال‌سازی کارت:', err)
            throw err
        }
    }

    // 🗑️ حذف کارت
    const deleteCard = async (id: string) => {
        try {
            await axios.delete(`user/admin/cardVisit/${id}`)
            cards.value = cards.value.filter(card => card.id !== id)
        } catch (err) {
            console.error('❌ خطا در حذف کارت:', err)
            throw err
        }
    }

    // 🗑️ حذف گروهی کارت‌ها
    const deleteSelectedCards = async (ids: string[]) => {
        try {
            await axios.delete('user/admin/cardVisit/bulkDelete', {data: {ids}})
            cards.value = cards.value.filter(card => !ids.includes(card.id))
        } catch (err) {
            console.error('❌ خطا در حذف گروهی کارت‌ها:', err)
            throw err
        }
    }

    // ✏️ ویرایش کارت
    const updateCard = async (id: string, payload: Partial<Card>) => {
        try {
            const res = await axios.put(`user/admin/cardVisit/${id}`, payload)
            const updated = res.data?.data || res.data
            const index = cards.value.findIndex(c => c.id === id)
            if (index !== -1) cards.value[index] = updated
            return updated
        } catch (err) {
            console.error('❌ خطا در ویرایش کارت:', err)
            throw err
        }
    }

    // ➕ ایجاد کارت جدید
    const createCard = async (payload: any) => {
        try {
            const res = await axios.post('user/admin/cardVisit', payload)
            const newCard = res.data?.data || res.data
            cards.value.unshift(newCard)
            return newCard
        } catch (err) {
            console.error('❌ خطا در ایجاد کارت:', err)
            throw err
        }
    }

    // ➕ ایجاد کارت دستی (برای لایسنس‌های چاپ شده)
    const createManualCard = async (payload: { slug: string, card_name: string }) => {
        try {
            const res = await axios.post('v1/cards/manual', payload)
            if (res.data?.success) {
                // کارت جدید رو به لیست اضافه میکنیم
                await fetchCards()
                return { success: true, data: res.data.data }
            }
            return { success: false, message: res.data?.message || 'خطا در ایجاد کارت' }
        } catch (err: any) {
            console.error('❌ خطا در ایجاد کارت دستی:', err)
            return { 
                success: false, 
                message: err.response?.data?.message || err.message || 'خطا در ایجاد کارت دستی' 
            }
        }
    }

    // ✅ فیلترها و computed
    const activeCards = () => cards.value.filter(c => c.status === 'active')
    const inactiveCards = () => cards.value.filter(c => c.status === 'inactive')

    const totalCards = computed(() => cards.value.length)
    const activeCardsCount = computed(() => cards.value.filter(c => c.status === 'active').length)
    const inactiveCardsCount = computed(() => cards.value.filter(c => c.status === 'inactive').length)
    return {
        // state
        cards,
        loading,
        error,

        // getters
        activeCards,
        inactiveCards,
        totalCards,
        activeCardsCount,
        inactiveCardsCount,

        // actions
        fetchCards,
        searchByProfileId,
        activateCard,
        deleteCard,
        deleteSelectedCards,
        updateCard,
        createCard,
        createManualCard,
    }
})
