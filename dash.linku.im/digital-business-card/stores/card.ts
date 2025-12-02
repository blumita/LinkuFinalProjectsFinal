// stores/card.ts
import { defineStore } from 'pinia'
import type { CardItem } from '~/stores/form'
import type {AxiosInstance} from "axios";
import {useNuxtApp} from "nuxt/app";

export const useCardStore = defineStore('cardStore', {
    state: () => ({
        cards: [] as CardItem[],
        activeCard: null as CardItem | null,
    }),

    getters: {
        cardCount: (state): number => state.cards.length,
        defaultCard: (state): CardItem | null =>
            state.cards.find(c => c.isDefault) || null,
    },

    actions: {
        async fetchCard(cardId: number | string) {
            try {
                const { $axios } = useNuxtApp()
                const axios = $axios as AxiosInstance

                const response = await axios.get(`v1/cards/${cardId}`) // فرض بر اینه که getCard همین روته
                this.activeCard = response.data?.data

            } catch (error) {

            }
        },
        setCards(cards: CardItem[]) {
            this.cards = cards
            this.activeCard = cards.find(c => c.isDefault) || null
        },

        setActiveCard(cardId: string) {
            const found = this.cards.find(c => c.id === cardId)
            if (found) this.activeCard = found
        },

        addCard(card: CardItem) {
            this.cards.push(card)
        },

        updateCard(card: CardItem) {
            const idx = this.cards.findIndex(c => c.id === card.id)
            if (idx !== -1) this.cards[idx] = card
        },

        removeCard(cardId: string) {
            this.cards = this.cards.filter(c => c.id !== cardId)
            if (this.activeCard?.id === cardId) {
                this.activeCard = this.cards.find(c => c.isDefault) || null
            }
        },

        clearCards() {
            this.cards = []
            this.activeCard = null
        },
    },
})
