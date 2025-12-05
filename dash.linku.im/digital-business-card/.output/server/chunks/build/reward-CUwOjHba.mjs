import { defineStore } from 'pinia';
import { a as useNuxtApp } from './server.mjs';

const useRewardStore = defineStore("reward", {
  state: () => ({
    rewards: [],
    isLoading: false,
    error: null
  }),
  getters: {
    activeRewards: (state) => {
      return state.rewards.filter((reward) => reward.status === "active");
    },
    expiredRewards: (state) => {
      return state.rewards.filter((reward) => reward.status === "expired");
    },
    usedRewards: (state) => {
      return state.rewards.filter((reward) => reward.status === "used");
    }
  },
  actions: {
    async fetchRewards() {
      this.isLoading = true;
      this.error = null;
      const { $axios } = useNuxtApp();
      const axios = $axios;
      try {
        const response = await axios.get("user/discounts");
        if (response.data && response.data.data && Array.isArray(response.data.data)) {
          this.rewards = response.data.data.map((discount) => {
            let status = "active";
            if (discount.status === "used" || discount.used_at) {
              status = "used";
            } else if (discount.status === "expired" || discount.status === 0 || discount.status === false) {
              status = "expired";
            } else if (discount.status === "active" || discount.status === 1 || discount.is_active) {
              status = "active";
            }
            const expiryDate = discount.expiry_date || discount.expiryDate || discount.expire_at || discount.expires_at;
            if (expiryDate && status !== "used") {
              const expiry = new Date(expiryDate);
              const now = /* @__PURE__ */ new Date();
              if (expiry < now) {
                status = "expired";
              }
            }
            return {
              id: discount.id || discount.code,
              title: discount.title || discount.name || `\u06A9\u062F \u062A\u062E\u0641\u06CC\u0641 ${discount.code}`,
              description: discount.description || `\u062A\u062E\u0641\u06CC\u0641 ${discount.percent || discount.value || discount.amount}${discount.type === "percentage" || discount.percent ? "%" : " \u062A\u0648\u0645\u0627\u0646"}`,
              code: discount.code,
              value: discount.percent || discount.value || discount.amount || 0,
              type: discount.type || (discount.percent ? "percentage" : "fixed"),
              status,
              expiryDate,
              minAmount: discount.min_amount || discount.minAmount || discount.minimum_amount,
              maxDiscount: discount.max_discount || discount.maxDiscount || discount.maximum_discount,
              usageLimit: discount.usage_limit || discount.usageLimit || discount.max_uses,
              usageCount: discount.usage_count || discount.usageCount || discount.used_count,
              appliesTo: discount.applies_to || discount.appliesTo || discount.applicable_items,
              banner: discount.banner || discount.banner_image || discount.image_url || null,
              image: discount.icon || discount.image || discount.icon_url || null
            };
          });
        } else {
          this.rewards = [];
        }
      } catch (error) {
        this.error = error.message || "\u062E\u0637\u0627 \u062F\u0631 \u062F\u0631\u06CC\u0627\u0641\u062A \u06A9\u062F\u0647\u0627\u06CC \u062A\u062E\u0641\u06CC\u0641";
        this.rewards = [];
      } finally {
        this.isLoading = false;
      }
    },
    async applyReward(code, amount) {
      const { $axios } = useNuxtApp();
      const axios = $axios;
      try {
        const response = await axios.post("rewards/apply", {
          code,
          amount
        });
        return response.data;
      } catch (error) {
        throw error;
      }
    },
    async validateReward(code) {
      const { $axios } = useNuxtApp();
      const axios = $axios;
      try {
        const response = await axios.post("rewards/validate", {
          code
        });
        return response.data;
      } catch (error) {
        throw error;
      }
    }
  }
});

export { useRewardStore as u };
//# sourceMappingURL=reward-CUwOjHba.mjs.map
