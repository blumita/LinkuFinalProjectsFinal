// stores/plan.ts
import { defineStore } from 'pinia'
import {computed, getCurrentInstance, ref} from 'vue'
import type { AxiosInstance } from 'axios'

export interface Feature {
    id: number
    title: string
    description: string
}

export interface Plan {
    id: number
    slug: string
    title: string
    subtitle: string
    description: string
    price:number
    discount: number
    duration: string
    features: Feature[]
    active: string
    popularity: string
}
export const usePlanStore = defineStore('plan', () => {
    const plans = ref<Plan[]>([])
    const selectedPlanId = ref<number | null>(null)
    const selectedPlan = ref<Plan | null>(null)
    const features = ref<Feature[]>([])
    const loading = ref(false)
    const error = ref<string | null>(null)
    const { appContext } = getCurrentInstance()!
    const axios = appContext.config.globalProperties.$axios as AxiosInstance
    // 📦 دریافت لیست پلن‌ها
    const fetchPlans = async () => {
        loading.value = true
        error.value = null
        try {
            const res = await axios.get('user/admin/plan/list')
            plans.value = Array.isArray(res.data.data) ? res.data.data : []
            features.value = []
        } catch (err: any) {
            console.error('❌ خطا در دریافت پلن‌ها:', err)
            error.value = err.message || 'خطا در دریافت پلن‌ها'
        } finally {
            loading.value = false
        }
    }
    // ✏️ ویرایش پلن
    const updatePlan = async (id: number, payload: Partial<Plan>) => {
        try {
            const res = await axios.put(`user/admin/plan/update/${id}`, payload)
            const updated = res.data?.data || res.data
            const index = plans.value.findIndex(p => p.id === id)
            if (index !== -1) plans.value[index] = updated
            return true
        } catch (err) {
            console.error('❌ خطا در آپدیت پلن:', err)
            return false
        }
    }
    // ➕ ایجاد پلن جدید
    const createPlan = async (payload: object) => {
        try {
            const res = await axios.post('user/admin/plan/store', payload)
            const newPlan = res.data?.data || res.data
            plans.value.unshift(newPlan)
            return newPlan
        } catch (err:any) {
            console.error('❌ خطا در ایجاد پلن:', err.response?.data||err.message)
            throw err
        }
    }
    // 🗑️ حذف پلن
    const deletePlan = async (id: any) => {
        try {
            await axios.delete(`user/admin/plan/delete/${id}`)
            plans.value = plans.value.filter(p => Number(p.id) !== Number(id))
            return true
        } catch (err) {
            console.error('❌ خطا در حذف پلن:', err)
            return false
        }
    }

    const activePlansCount = computed(() => {
        return plans.value.filter(p => p.active === 'active').length
    })


    // ✅ انتخاب پلن
    const selectPlan = (id: number) => {
        selectedPlanId.value = id
        const plan = plans.value.find(p => Number(p.id) === id)
        if (plan) {
            selectedPlan.value = { ...plan }
            features.value = Array.isArray(plan.features)
                ? plan.features
                : JSON.parse(plan.features || '[]')
        }
    }
    // ✅ گرفتن ویژگی‌های یک پلن خاص
    const featurePlan = (id: number): Feature[] => {
        const plan = plans.value.find(p => Number(p.id) === Number(id))
        if (!plan) return []
        return Array.isArray(plan.features)
            ? plan.features
            : JSON.parse(plan.features || '[]')
    }
    // ✅ پلن انتخاب‌شده
    const resetPlan = () => {
        selectedPlan.value = {
            id: Number(`${Math.floor(Math.random() * 100000)}`),
            slug: '',
            title: '',
            subtitle: '',
            description: '',
            price:0,
            discount: 0,
            duration: 'ماه',
            features: [],
            active: 'draft',
            popularity: 'normal'
        }
        features.value = []
    }
    return {
        // state
        plans,
        selectedPlanId,
        features,
        loading,
        error,

        // getters
        selectedPlan,
        activePlansCount,

        // actions
        fetchPlans,
        updatePlan,
        createPlan,
        deletePlan,
        selectPlan,
        featurePlan,
        resetPlan
    }
})
