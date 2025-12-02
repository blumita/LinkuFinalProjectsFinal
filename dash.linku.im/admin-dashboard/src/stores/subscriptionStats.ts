import { defineStore } from 'pinia'
import { getCurrentInstance, ref } from 'vue'
import type { AxiosInstance } from 'axios'

export const useSubscriptionStatsStore = defineStore('subscriptionStats', () => {
    const monthlyRevenue = ref<number>(0)
    const monthlyPurchases = ref<number>(0)
    const premiumMembers = ref<number>(0)
    const loading = ref(false)
    const error = ref<string | null>(null)

    const { appContext } = getCurrentInstance()!
    const axios = appContext.config.globalProperties.$axios as AxiosInstance

    const fetchStats = async () => {
        loading.value = true
        error.value = null
        try {
            const [revenueRes, purchasesRes, membersRes] = await Promise.all([
                axios.get('user/admin/monthlyRevenue'),
                axios.get('user/admin/monthlyPurchases'),
                axios.get('user/admin/premiumMembers')
            ])
            monthlyRevenue.value = revenueRes.data?.revenue || 0
            monthlyPurchases.value = purchasesRes.data?.purchases || 0
            premiumMembers.value = membersRes.data?.count || 0
        } catch (err: any) {
            console.error('❌ خطا در دریافت آمار:', err)
            error.value = err.message || 'خطا در دریافت آمار'
        } finally {
            loading.value = false
        }
    }

    return {
        monthlyRevenue,
        monthlyPurchases,
        premiumMembers,
        loading,
        error,
        fetchStats
    }
})
