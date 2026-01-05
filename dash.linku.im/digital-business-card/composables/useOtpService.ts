import {useNuxtApp} from "nuxt/app";
import type {AxiosInstance} from 'axios'

export function useOtpService() {

    const nuxtApp = useNuxtApp()
    const $axios = nuxtApp.$axios as AxiosInstance

    // تبدیل اعداد فارسی و عربی به انگلیسی
    const toEnglishDigits = (str: string): string => {
        if (!str) return str
        const persianDigits = '۰۱۲۳۴۵۶۷۸۹'
        const arabicDigits = '٠١٢٣٤٥٦٧٨٩'
        let result = str
        for (let i = 0; i < 10; i++) {
            result = result.replace(new RegExp(persianDigits[i], 'g'), String(i))
            result = result.replace(new RegExp(arabicDigits[i], 'g'), String(i))
        }
        return result
    }

    // نرمال‌سازی شماره موبایل
    const normalizePhone = (phone: string): string => {
        let normalized = toEnglishDigits(phone)
        normalized = normalized.replace(/\D/g, '') // فقط اعداد
        if (normalized.startsWith('98')) {
            normalized = normalized.substring(2)
        }
        if (normalized.startsWith('0')) {
            normalized = normalized.substring(1)
        }
        return normalized
    }

    const sendOtpCode = async (phone: string,
                               countryCode = '+98',
                               type='authenticate') => {
        try {
            const normalizedPhone = normalizePhone(phone)
            const response = await $axios.post('auth/sendOtpCode', {
                phone: normalizedPhone,
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
            const normalizedPhone = normalizePhone(phone)
            const normalizedCode = toEnglishDigits(code)
            const response = await $axios.post('/auth/verifyOtpCode', {
                code: normalizedCode,
                phone: normalizedPhone,
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

    return {sendOtpCode, verifyOtpCode, toEnglishDigits, normalizePhone}

}