import { defineStore } from 'pinia';
import { a as useNuxtApp } from './server.mjs';

const useCardStore = defineStore("cardStore", {
  state: () => ({
    cards: [],
    activeCard: null
  }),
  getters: {
    cardCount: (state) => state.cards.length,
    defaultCard: (state) => state.cards.find((c) => c.isDefault) || null
  },
  actions: {
    async fetchCard(cardId) {
      var _a;
      try {
        const { $axios } = useNuxtApp();
        const axios = $axios;
        const response = await axios.get(`v1/cards/${cardId}`);
        this.activeCard = (_a = response.data) == null ? void 0 : _a.data;
      } catch (error) {
      }
    },
    setCards(cards) {
      this.cards = cards;
      this.activeCard = cards.find((c) => c.isDefault) || null;
    },
    setActiveCard(cardId) {
      const found = this.cards.find((c) => c.id === cardId);
      if (found) this.activeCard = found;
    },
    addCard(card) {
      this.cards.push(card);
    },
    updateCard(card) {
      const idx = this.cards.findIndex((c) => c.id === card.id);
      if (idx !== -1) this.cards[idx] = card;
    },
    removeCard(cardId) {
      var _a;
      this.cards = this.cards.filter((c) => c.id !== cardId);
      if (((_a = this.activeCard) == null ? void 0 : _a.id) === cardId) {
        this.activeCard = this.cards.find((c) => c.isDefault) || null;
      }
    },
    clearCards() {
      this.cards = [];
      this.activeCard = null;
    }
  }
});

export { useCardStore as u };
//# sourceMappingURL=card-CINoY8tz.mjs.map
