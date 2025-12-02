// stores/support.ts
import { defineStore } from 'pinia'
import {getCurrentInstance, ref} from 'vue'
import type { AxiosInstance } from 'axios'

export interface SupportInfo {
    email: string
    phone: string
    socialMediaLink: string
}

export const useSupportStore = defineStore('support', () => {
    const support = ref<SupportInfo>({ email: '', phone: '', socialMediaLink: '' })
    const loading = ref(false)
    const error = ref<string | null>(null)
    const { appContext } = getCurrentInstance()!
    const axios = appContext.config.globalProperties.$axios as AxiosInstance

    const fetchSupport = async () => {
        loading.value = true
        error.value = null
        try {
            const res = await axios.get('/user/admin/support/info')
            support.value = res.data.data
        } catch (err: any) {
            console.error('❌ خطا در دریافت اطلاعات پشتیبانی:', err)
            error.value = err.message || 'خطا در دریافت اطلاعات پشتیبانی'
        } finally {
            loading.value = false
        }
    }

    const updateSupport = async (payload: SupportInfo) => {
        loading.value = true
        try {
            const res = await axios.put('user/admin/support/update', payload)
            support.value = res.data.data
            return true
        } catch (err) {
            console.error('❌ خطا در به‌روزرسانی اطلاعات پشتیبانی:', err)
            return false
        } finally {
            loading.value = false
        }
    }

    return {
        support,
        loading,
        error,
        fetchSupport,
        updateSupport,
    }
})
