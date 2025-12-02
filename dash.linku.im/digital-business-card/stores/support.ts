// stores/support.ts
import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { AxiosInstance } from 'axios'
import {useNuxtApp} from "nuxt/app";

export const useSupportStore = defineStore('support', () => {
    const support = ref({
        email: '',
        phone: '',
        socialMediaLink: '',
        active: true,
    })
    const {$axios} = useNuxtApp()
    const axios = $axios as AxiosInstance

    const loading = ref(false)
    const error = ref<string | null>(null)
    // دریافت اطلاعات Support
    const fetchSupport = async () => {
        loading.value = true
        error.value = null
        try {
            const res = await axios.get('support/info')
            if (res.data?.data) support.value = res.data.data
        } catch (err: any) {
            error.value = err.message || 'خطا در دریافت Support'
        } finally {
            loading.value = false
        }
    }

    return {
        support,
        loading,
        error,
        fetchSupport,
    }
})