import {useNuxtApp} from "nuxt/app";
import type {AxiosInstance} from 'axios'

export function useOtpService() {

    const nuxtApp = useNuxtApp()
    const $axios = nuxtApp.$axios as AxiosInstance

    const sendOtpCode = async (phone: string,
                               countryCode = '+98',
                               type='authenticate') => {

        const response = await $axios.post('auth/sendOtpCode', {
            phone: phone,
            countryCode: countryCode,
            type:type
        })
        if (response.data && response.data.success === true) {
            return true;


        }
    }
    const verifyOtpCode = async (phone: string, code: string,
                                 countryCode = '+98',
                                 type='authenticate') => {

        const response = await $axios.post('/auth/verifyOtpCode', {
            code: code,
            phone: phone,
            countryCode: countryCode,
            type:type
        })
        if (response.data && response.data.success === true) {
            return true;
        }
    }

    const toEnglishDigits = (str: string) => {
        return str.replace(/[۰-۹]/g, d => String('۰۱۲۳۴۵۶۷۸۹'.indexOf(d)))
    }

    return {sendOtpCode, verifyOtpCode}

}