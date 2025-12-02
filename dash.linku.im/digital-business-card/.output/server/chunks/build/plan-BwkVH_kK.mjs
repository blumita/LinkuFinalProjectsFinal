import { defineStore } from 'pinia';
import { a as useNuxtApp } from './server.mjs';

const usePlanStore = defineStore("plan", {
  state: () => ({
    plans: [],
    selectedPlanId: 12,
    features: [],
    loading: false,
    error: null
  }),
  getters: {
    selectedPlan(state) {
      return state.plans.find((p) => Number(p.id) === Number(state.selectedPlanId)) || null;
    }
  },
  actions: {
    async fetchPlans() {
      this.loading = true;
      this.error = null;
      const { $axios } = useNuxtApp();
      const axios = $axios;
      try {
        const response = await axios.get("plan/list");
        this.plans = response.data.data || response.data;
        const highlighted = this.plans.find((p) => p.highlight) || this.plans[0];
        if (highlighted) {
          this.selectedPlanId = highlighted.id;
          this.features = Array.isArray(highlighted.features) ? highlighted.features : JSON.parse(highlighted.features || "[]");
        }
      } catch (err) {
        this.error = err;
      } finally {
        this.loading = false;
      }
    },
    selectPlan(id) {
      this.selectedPlanId = id;
      const plan = this.plans.find((p) => Number(p.id) === Number(id));
      if (plan) {
        this.features = Array.isArray(plan.features) ? plan.features : JSON.parse(plan.features || "[]");
      }
    },
    async purchasePlan(planId, paymentMethod = "card") {
      var _a, _b, _c, _d;
      this.loading = true;
      this.error = null;
      const { $axios } = useNuxtApp();
      const axios = $axios;
      try {
        const plan = this.plans.find((p) => Number(p.id) === Number(planId));
        if (!plan) {
          throw new Error("\u067E\u0644\u0646 \u06CC\u0627\u0641\u062A \u0646\u0634\u062F");
        }
        const finalPrice = Math.round(plan.price * (1 - plan.discount / 100));
        const response = await axios.post("/payment", {
          planId,
          amount: finalPrice * 10,
          // تبدیل به ریال
          discountCode: "",
          metadata: {
            planTitle: plan.title,
            duration: plan.duration
          },
          gateway: "zarinpal"
        });
        const paymentUrl = (_b = (_a = response.data) == null ? void 0 : _a.data) == null ? void 0 : _b.redirect_url;
        if (paymentUrl) {
          (void 0).location.href = paymentUrl;
          return { success: true, payment_url: paymentUrl };
        }
        return { success: false, error: "\u0644\u06CC\u0646\u06A9 \u067E\u0631\u062F\u0627\u062E\u062A \u062F\u0631\u06CC\u0627\u0641\u062A \u0646\u0634\u062F" };
      } catch (err) {
        this.error = err;
        return { success: false, error: ((_d = (_c = err.response) == null ? void 0 : _c.data) == null ? void 0 : _d.message) || "\u062E\u0637\u0627 \u062F\u0631 \u067E\u0631\u062F\u0627\u0632\u0634 \u067E\u0631\u062F\u0627\u062E\u062A" };
      } finally {
        this.loading = false;
      }
    }
  }
});

export { usePlanStore as u };
//# sourceMappingURL=plan-BwkVH_kK.mjs.map
