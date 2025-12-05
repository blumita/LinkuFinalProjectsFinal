import { defineStore } from 'pinia';
import { u as useAuthStore, a as useNuxtApp, b as useRouter } from './server.mjs';
import { u as useFormStore } from './form-CUJQskNk.mjs';

const useUserStore = defineStore("userStore", {
  state: () => ({
    user: {},
    cards: [],
    fetched: false
  }),
  getters: {
    isUserPro: (state) => {
      var _a;
      return !!((_a = state.user) == null ? void 0 : _a.isPro);
    },
    cardCount: (state) => state.cards.length
  },
  actions: {
    async fetchUser() {
      var _a;
      try {
        const formStore = useFormStore();
        const { $axios } = useNuxtApp();
        const axios = $axios;
        const { data } = await axios.get("/user");
        this.user = data.data;
        this.cards = ((_a = this.user) == null ? void 0 : _a.cardsDataList) || [];
        formStore.cards = this.cards;
        this.fetched = true;
      } catch (error) {
        const router = useRouter();
        this.fetched = true;
        await router.push("/auth/login");
      }
    },
    setActiveCard(cardId) {
    },
    clearProfile() {
      this.user = {};
      this.cards = [];
    },
    async logout() {
      try {
        const authStore = useAuthStore();
        authStore.clearToken();
        if (false) ;
        this.clearProfile();
        this.fetched = false;
        const { $axios } = useNuxtApp();
        const axios = $axios;
        if (axios.defaults.headers.common) {
          delete axios.defaults.headers.common["Authorization"];
        }
        if (false) ;
      } catch (error) {
        console.error("Logout error:", error);
      }
    }
  }
});

export { useUserStore as u };
//# sourceMappingURL=user-D1YL8aKq.mjs.map
