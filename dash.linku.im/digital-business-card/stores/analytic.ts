// stores/analytic.ts
import { defineStore } from 'pinia'

export interface AnalyticItem {
  id: number
  title: string
  description?: string
  isDefault?: boolean
  type: 'profile' | 'link' | 'lead' // برای تطابق دقیق با کامپوننت‌ها
}

export const useAnalyticStore = defineStore('analytic', {
  state: () => ({
    cards: [
      {
        id: 1,
        title: 'بازدید  پروفایل',
        description: 'تحلیل ترافیک بر پایه پروفایل کاربران',
        isDefault: false,
        type: 'profile',
      },
      {
        id: 2,
        title: 'لینک‌های کلیک شده',
        description: 'آمار کلیک روی لینک‌ها توسط کاربران',
        isDefault: false,
        type: 'link',
      },
      {
        id: 3,
        title: 'فرم‌های دریافتی',
        description: 'جمع‌آوری اطلاعات تماس از فرم‌ها',
        isDefault: true,
        type: 'lead',
      },
    ] as AnalyticItem[],
  }),

  getters: {
    defaultCard(state): AnalyticItem | undefined {
      return state.cards.find((card) => card.isDefault)
    },
  },

  actions: {
    setDefaultCard(cardId: number) {
      this.cards.forEach((card) => {
        card.isDefault = card.id === cardId
      })
    },
  },
})