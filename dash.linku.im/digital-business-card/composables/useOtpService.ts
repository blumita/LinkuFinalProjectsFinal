import {useNuxtApp} from "nuxt/app";
import type {AxiosInstance} from 'axios'

export function useOtpService() {

    const nuxtApp = useNuxtApp()
    const $axios = nuxtApp.$axios as AxiosInstance

    const sendOtpCode = async (phone: string,
                               countryCode = '+98',
                               type='authenticate') => {
        try {
            const response = await $axios.post('auth/sendOtpCode', {
                phone: phone,
                countryCode: countryCode,
                type:type
            })
            if (response.data && response.data.success === true) {
                return { success: true, message: 'کد تأیید ارسال شد' };
            }
            return { success: false, message: response.data?.message || 'خطا در ارسال کد' };
        } catch (error: any) {
            // بررسی نوع خطا
            if (error.response?.status === 429) {
                return { success: false, message: 'تعداد درخواست‌ها زیاد است. لطفاً چند دقیقه دیگر تلاش کنید.' };
            }
            if (error.response?.status === 500) {
                return { success: false, message: 'لطفاً چند دقیقه دیگر تلاش کنید.' };
            }
            return { success: false, message: error.response?.data?.message || 'لطفاً چند دقیقه دیگر تلاش کنید.' };
        }
    }
    const verifyOtpCode = async (phone: string, code: string,
                                 countryCode = '+98',
                                 type='authenticate') => {
        try {
            const response = await $axios.post('/auth/verifyOtpCode', {
                code: code,
                phone: phone,
                countryCode: countryCode,
                type:type
            })
            if (response.data && response.data.success === true) {
                return { success: true, message: 'کد تأیید صحیح است' };
            }
            return { success: false, message: response.data?.message || 'کد تأیید نامعتبر است' };
        } catch (error: any) {
            if (error.response?.status === 429) {
                return { success: false, message: 'تعداد درخواست‌ها زیاد است. لطفاً چند دقیقه دیگر تلاش کنید.' };
            }
            return { success: false, message: error.response?.data?.message || 'کد تأیید نامعتبر است' };
        }
    }

    const toEnglishDigits = (str: string) => {
        return str.replace(/[۰-۹]/g, d => String('۰۱۲۳۴۵۶۷۸۹'.indexOf(d)))
    }

    return {sendOtpCode, verifyOtpCode}

}