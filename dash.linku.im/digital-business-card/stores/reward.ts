import { defineStore } from 'pinia'
import { useNuxtApp } from 'nuxt/app'
import type { AxiosInstance } from 'axios'

export interface Reward {
  id: string
  title: string
  description: string
  code: string
  value: number
  type: 'percentage' | 'fixed'
  status: 'active' | 'expired' | 'used'
  expiryDate: string
  minAmount?: number
  maxDiscount?: number
  usageLimit?: number
  usageCount?: number
  appliesTo?: string[]
  banner?: string // Large banner image
  image?: string // Small icon image
}

interface RewardState {
  rewards: Reward[]
  isLoading: boolean
  error: string | null
}

export const useRewardStore = defineStore('reward', {
  state: (): RewardState => ({
    rewards: [],
    isLoading: false,
    error: null
  }),

  getters: {
    activeRewards: (state) => {
      return state.rewards.filter(reward => reward.status === 'active')
    },

    expiredRewards: (state) => {
      return state.rewards.filter(reward => reward.status === 'expired')
    },

    usedRewards: (state) => {
      return state.rewards.filter(reward => reward.status === 'used')
    }
  },

  actions: {
    async fetchRewards() {
      this.isLoading = true
      this.error = null
      const { $axios } = useNuxtApp()
      const axios = $axios as AxiosInstance

      try {
        
        const response = await axios.get('user/discounts')
        
        if (response.data && response.data.data && Array.isArray(response.data.data)) {
          this.rewards = response.data.data.map((discount: any) => {
            // Determine status from API
            let status = 'active'
            
            if (discount.status === 'used' || discount.used_at) {
              status = 'used'
            } else if (discount.status === 'expired' || discount.status === 0 || discount.status === false) {
              status = 'expired'
            } else if (discount.status === 'active' || discount.status === 1 || discount.is_active) {
              status = 'active'
            }
            
            // Check expiry date
            const expiryDate = discount.expiry_date || discount.expiryDate || discount.expire_at || discount.expires_at
            if (expiryDate && status !== 'used') {
              const expiry = new Date(expiryDate)
              const now = new Date()
              if (expiry < now) {
                status = 'expired'
              }
            }
            
            return {
              id: discount.id || discount.code,
              title: discount.title || discount.name || `کد تخفیف ${discount.code}`,
              description: discount.description || `تخفیف ${discount.percent || discount.value || discount.amount}${discount.type === 'percentage' || discount.percent ? '%' : ' تومان'}`,
              code: discount.code,
              value: discount.percent || discount.value || discount.amount || 0,
              type: discount.type || (discount.percent ? 'percentage' : 'fixed'),
              status: status,
              expiryDate: expiryDate,
              minAmount: discount.min_amount || discount.minAmount || discount.minimum_amount,
              maxDiscount: discount.max_discount || discount.maxDiscount || discount.maximum_discount,
              usageLimit: discount.usage_limit || discount.usageLimit || discount.max_uses,
              usageCount: discount.usage_count || discount.usageCount || discount.used_count,
              appliesTo: discount.applies_to || discount.appliesTo || discount.applicable_items,
              banner: discount.banner || discount.banner_image || discount.image_url,
              image: discount.image || discount.icon || discount.icon_url
            }
          })
        } else {
          this.rewards = []
        }
        
      } catch (error: any) {
        this.error = error.message || 'خطا در دریافت کدهای تخفیف'
        this.rewards = []
      } finally {
        this.isLoading = false
      }
    },

    async applyReward(code: string, amount: number) {
      const { $axios } = useNuxtApp()
      const axios = $axios as AxiosInstance

      try {
        const response = await axios.post('rewards/apply', {
          code,
          amount
        })
        
        return response.data
      } catch (error: any) {
        throw error
      }
    },

    async validateReward(code: string) {
      const { $axios } = useNuxtApp()
      const axios = $axios as AxiosInstance

      try {
        const response = await axios.post('rewards/validate', {
          code
        })
        
        return response.data
      } catch (error: any) {
        throw error
      }
    }
  }
})
