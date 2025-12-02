import { defineStore } from 'pinia'
import { ref, computed, getCurrentInstance } from 'vue'
import { useUserStore } from '@/stores/user'

export const useTransactionStore = defineStore('transaction', () => {
    const userStore = useUserStore()
    const transactions = ref<Transaction[]>([])
    const loading = ref(false)
    const error = ref<string | null>(null)

    interface Transaction {
        id: number
        transactionId: string
        username: string
        userEmail: string
        planTitle: string
        planDuration: string
        amount: number
        originalAmount?: number
        discountCode?: string
        discountAmount?: number
        paymentMethod: 'zarinpal' | 'mellat' | 'pasargad'
        status: 'success' | 'failed' | 'pending' | 'refunded'
        createdAt: string
    }

    const { appContext } = getCurrentInstance()!
    const axios = appContext.config.globalProperties.$axios

    // 📦 دریافت لیست تراکنش‌ها
    const fetchTransactions = async () => {
        loading.value = true
        error.value = null
        try {
            const res = await axios.get('/user/admin/transactions/all')
            transactions.value = Array.isArray(res.data.data) ? res.data.data : []
        } catch (err: any) {
            console.error('❌ خطا در دریافت تراکنش‌ها:', err)
            error.value = err.message || 'خطا در دریافت تراکنش‌ها'
        } finally {
            loading.value = false
        }
    }

    const totalRevenue = computed(() =>
        transactions.value
            .filter(t => t.status === 'success')
            .reduce((sum, t) => sum + t.amount, 0)
    )

    const monthlyRevenue = computed(() => {
        const now = new Date()
        const currentMonth = now.getMonth()
        const currentYear = now.getFullYear()

        return transactions.value
            .filter(t => {
                const date = new Date(t.createdAt)
                return (
                    date.getMonth() === currentMonth &&
                    date.getFullYear() === currentYear &&
                    t.status === 'success'
                )
            })
            .reduce((sum, t) => sum + t.amount, 0)
    })

    const successRate = computed(() => {
        const total = transactions.value.length
        const success = transactions.value.filter(t => t.status === 'success').length
        return total > 0 ? parseFloat(((success / total) * 100).toFixed(1)) : 0
    })


    // 🔍 جستجو بر اساس transactionId یا ایمیل کاربر
    const searchTransactions = async (query: string) => {
        if (!query) return []
        try {
            const res = await axios.get(`/api/transactions/search/${query}`)
            return res.data?.data || []
        } catch (err) {
            console.error('❌ خطا در جستجو تراکنش:', err)
            return []
        }
    }
    // ✅ computed و getter ها
    const totalTransactions = computed(() => transactions.value.length)
    const successTransactions = computed(() => transactions.value.filter(t => t.status === 'success'))
    const failedTransactions = computed(() => transactions.value.filter(t => t.status === 'failed'))
    const pendingTransactions = computed(() => transactions.value.filter(t => t.status === 'pending'))
    const refundedTransactions = computed(() => transactions.value.filter(t => t.status === 'refunded'))

    return {
        // state
        transactions,
        loading,
        error,

        // getters
        totalTransactions,
        successTransactions,
        failedTransactions,
        pendingTransactions,
        refundedTransactions,
        totalRevenue,
        monthlyRevenue,
        successRate,

        // actions
        fetchTransactions,
        searchTransactions,
    }
})
