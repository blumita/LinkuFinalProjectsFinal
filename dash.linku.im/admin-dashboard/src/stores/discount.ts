// stores/discount.ts
import { defineStore } from 'pinia'
import { ref, getCurrentInstance } from 'vue'
import type { AxiosInstance } from 'axios'

export interface Discount {
    id: number
    code: string
    title: string
    description: string
    type: 'percentage' | 'fixed'
    value: number
    maxUsage?: number
    usedCount: number
    expiryDate?: string
    active: boolean
    createdAt: string
}

export const useDiscountStore = defineStore('discount', () => {
    const discounts = ref<Discount[]>([])
    const selectedDiscount = ref<Discount | null>(null)
    const loading = ref(false)
    const error = ref<string | null>(null)
    const { appContext } = getCurrentInstance()!
    const axios = appContext.config.globalProperties.$axios as AxiosInstance
    // 📥 دریافت همه تخفیف‌ها
    const fetchDiscounts = async () => {
        loading.value = true
        try {
            const res = await axios.get('/user/admin/discount')
            discounts.value = res.data.data || []
            console.log('d',discounts.value)
        } catch (err: any) {
            error.value = err.message || 'خطا در دریافت تخفیف‌ها'
        } finally {
            loading.value = false
        }
    }
    // ➕ ایجاد تخفیف جدید
    const createDiscount = async (payload: Discount) => {
        try {
            const res = await axios.post('/user/admin/discount', payload)
            const newDiscount = res.data?.data || res.data
            discounts.value.unshift(newDiscount)
            return newDiscount
        } catch (err: any) {
            console.error('❌ خطا در ایجاد تخفیف:', err)
            throw err
        }
    }
    // ✏️ بروزرسانی تخفیف
    const updateDiscount = async (id: number, payload: Partial<Discount>) => {
        try {
            const res = await axios.put(`/user/admin/discount/update/${id}`, payload)
            const updated = res.data?.data || res.data
            const index = discounts.value.findIndex(d => d.id === id)
            if (index !== -1) discounts.value[index] = updated
            return true
        } catch (err) {
            console.error('❌ خطا در بروزرسانی تخفیف:', err)
            return false
        }
    }
    // 🗑️ حذف تخفیف
    const deleteDiscount = async (id: number) => {
        try {
            await axios.delete(`/user/admin/discount/delete/${id}`)
            return true
        } catch (err) {
            console.error('❌ خطا در حذف تخفیف:', err)
            return false
        }
    }
    // ✅ انتخاب تخفیف برای ویرایش
    const selectDiscount = (id: number) => {
        const discount = discounts.value.find(d => d.id === id)
        selectedDiscount.value = discount ? { ...discount } : null
    }
    // 🔁 فعال یا غیرفعال کردن تخفیف
    const toggleDiscountStatus = async (id: number, newStatus: boolean) => {
        try {
            const res = await axios.patch(`/user/admin/discount/${id}/status`, { active: newStatus })
            return true
        } catch (err) {
            console.error('❌ خطا در تغییر وضعیت تخفیف:', err)
            return false
        }
    }
    // 🔄 ریست تخفیف
    const resetDiscount = () => {
        selectedDiscount.value = {
            id:0,
            code: '',
            title: '',
            description: '',
            type: 'percentage',
            value: 0,
            maxUsage: 0,
            usedCount: 0,
            active: true,
            createdAt: new Date().toLocaleDateString('fa-IR')

        }
    }

    return {
        discounts,
        selectedDiscount,
        loading,
        error,
        fetchDiscounts,
        createDiscount,
        updateDiscount,
        deleteDiscount,
        selectDiscount,
        resetDiscount,
        toggleDiscountStatus
    }
})
