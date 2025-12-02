// stores/plan.js
import {defineStore} from 'pinia'
import {useNuxtApp} from 'nuxt/app'
import type {AxiosInstance} from 'axios'

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

export const usePlanStore = defineStore('plan', {
    state: () => ({
        plans: [] as Plan[],
        selectedPlanId: 12,
        features: [] as Feature[],
        loading: false,
        error: null
    }),

    getters: {
        selectedPlan(state) {
            return state.plans.find(p => Number(p.id) === Number(state.selectedPlanId)) || null
        }
    },

    actions: {
        async fetchPlans() {
            this.loading = true
            this.error = null
            const {$axios} = useNuxtApp()
            const axios = $axios as AxiosInstance

            try {
                const response = await axios.get('plan/list')
                this.plans = response.data.data || response.data

                const highlighted = this.plans.find(p => p.highlight) || this.plans[0]
                if (highlighted) {
                    this.selectedPlanId = highlighted.id
                    this.features = Array.isArray(highlighted.features)
                        ? highlighted.features
                        : JSON.parse(highlighted.features || '[]')
                }
            } catch (err: any) {
                this.error = err
            } finally {
                this.loading = false
            }
        },

        selectPlan(id: any) {
            this.selectedPlanId = id
            const plan = this.plans.find(p => Number(p.id) === Number(id))
            if (plan) {
                this.features = Array.isArray(plan.features)
                    ? plan.features
                    : JSON.parse(plan.features || '[]')
            }
        },

        async purchasePlan(planId: number, paymentMethod: string = 'card') {
            this.loading = true
            this.error = null
            const {$axios} = useNuxtApp()
            const axios = $axios as AxiosInstance

            try {
                // پیدا کردن پلن برای محاسبه مبلغ
                const plan = this.plans.find(p => Number(p.id) === Number(planId))
                if (!plan) {
                    throw new Error('پلن یافت نشد')
                }
                
                const finalPrice = Math.round(plan.price * (1 - plan.discount / 100))
                
                const response = await axios.post('/payment', {
                    planId: planId,
                    amount: finalPrice * 10, // تبدیل به ریال
                    discountCode: '',
                    metadata: {
                        planTitle: plan.title,
                        duration: plan.duration
                    },
                    gateway: 'zarinpal'
                })
                
                // API باید redirect_url برگرداند
                const paymentUrl = response.data?.data?.redirect_url
                if (paymentUrl) {
                    // هدایت به درگاه پرداخت
                    window.location.href = paymentUrl
                    return { success: true, payment_url: paymentUrl }
                }
                
                return { success: false, error: 'لینک پرداخت دریافت نشد' }
            } catch (err: any) {
                this.error = err
                return { success: false, error: err.response?.data?.message || 'خطا در پردازش پرداخت' }
            } finally {
                this.loading = false
            }
        }
    }
})