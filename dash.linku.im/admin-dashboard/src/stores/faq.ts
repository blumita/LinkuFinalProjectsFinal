// stores/faq.ts
import { defineStore } from 'pinia'
import { ref, computed, getCurrentInstance } from 'vue'
import type { AxiosInstance } from 'axios'

// 🧩 مدل داده
export interface FAQ {
    id: number
    question: string
    answer: string
    active: boolean // 'active' یا 'draft'
}

// 🏪 استور اصلی FAQ
export const useFaqStore = defineStore('faq', () => {
    const faqs = ref<FAQ[]>([])
    const selectedFaqId = ref<number | null>(null)
    const selectedFaq = ref<FAQ | null>(null)
    const loading = ref(false)
    const error = ref<string | null>(null)

    const { appContext } = getCurrentInstance()!
    const axios = appContext.config.globalProperties.$axios as AxiosInstance

    // 📥 دریافت لیست سوالات متداول
    const fetchFaqs = async () => {
        loading.value = true
        error.value = null
        try {
            const res = await axios.get('user/admin/faq/list')
            faqs.value = Array.isArray(res.data.data) ? res.data.data : []
        } catch (err: any) {
            console.error('❌ خطا در دریافت FAQ‌ها:', err)
            error.value = err.message || 'خطا در دریافت FAQ‌ها'
        } finally {
            loading.value = false
        }
    }

    // ➕ افزودن سوال جدید
    const createFaq = async (payload: Partial<FAQ>) => {
        try {
            const res = await axios.post('user/admin/faq/store', payload)
            const newFaq = res.data?.data || res.data
            faqs.value.unshift(newFaq)
            return newFaq
        } catch (err: any) {
            console.error('❌ خطا در ایجاد FAQ:', err.response?.data || err.message)
            throw err
        }
    }

    // ✏️ ویرایش سوال
    const updateFaq = async (id: number, payload: Partial<FAQ>) => {
        try {
            const res = await axios.put(`user/admin/faq/update/${id}`, payload)
            const updated = res.data?.data || res.data
            const index = faqs.value.findIndex(f => f.id === id)
            if (index !== -1) faqs.value[index] = updated
            return true
        } catch (err) {
            console.error('❌ خطا در بروزرسانی FAQ:', err)
            return false
        }
    }

    // 🗑️ حذف سوال
    const deleteFaq = async (id: number) => {
        try {
            await axios.delete(`user/admin/faq/delete/${id}`)
            faqs.value = faqs.value.filter(f => Number(f.id) !== Number(id))
            return true
        } catch (err) {
            console.error('❌ خطا در حذف FAQ:', err)
            return false
        }
    }

    // ✅ انتخاب سوال خاص برای ویرایش
    const selectFaq = (id: number) => {
        selectedFaqId.value = id
        const faq = faqs.value.find(f => Number(f.id) === id)
        if (faq) selectedFaq.value = { ...faq }
    }

    // 🔄 بازنشانی فرم
    const resetFaq = () => {
        selectedFaq.value = {
            id: Number(`${Math.floor(Math.random() * 100000)}`),
            question: '',
            answer: '',
            active: false
        }
    }

    // 📊 تعداد سوالات فعال
    const activeFaqCount = computed(() => {
        return faqs.value.filter(f => f.active === true).length
    })

    return {
        // state
        faqs,
        selectedFaqId,
        selectedFaq,
        loading,
        error,

        // getters
        activeFaqCount,

        // actions
        fetchFaqs,
        createFaq,
        updateFaq,
        deleteFaq,
        selectFaq,
        resetFaq
    }
})
