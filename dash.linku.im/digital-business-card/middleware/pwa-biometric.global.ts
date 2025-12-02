import { defineNuxtRouteMiddleware, navigateTo } from 'nuxt/app'

/**
 * PWA Biometric Auth Middleware
 * اگه در PWA باشیم و Face ID فعال باشه، موقع ورود به صفحه لاگین
 * اتوماتیک Face ID رو trigger می‌کنه
 */
export default defineNuxtRouteMiddleware(async (to) => {
    // فقط در سمت کلاینت
    if (!import.meta.client) return

    // فقط در صفحه لاگین
    if (!to.path.startsWith('/auth/login')) return

    // بررسی آیا در PWA standalone mode هستیم
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches ||
                        (window.navigator as any).standalone === true

    if (!isStandalone) return

    // بررسی آیا Face ID فعال شده
    const isPasskeyEnabled = localStorage.getItem('webauthn_enabled') === 'true'
    if (!isPasskeyEnabled) return

    // بررسی آیا توکن ذخیره شده هست
    const savedToken = localStorage.getItem('passkey_auth_token')
    if (!savedToken) return

    // بررسی پشتیبانی WebAuthn
    if (!window.PublicKeyCredential) return

    try {
        const isPlatformAvailable = await PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable()
        if (!isPlatformAvailable) return

        // ست کردن فلگ برای AuthPage که Face ID رو اتوماتیک فعال کنه
        sessionStorage.setItem('auto_biometric_auth', 'true')
    } catch (e) {
        console.warn('PWA Biometric check failed:', e)
    }
})
