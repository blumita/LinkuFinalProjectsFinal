// پلاگین احراز هویت بیومتریک (Face ID / Touch ID)
// از Web Authentication API (WebAuthn) استفاده می‌کنه

interface BiometricCredential {
  id: string
  rawId: string
  type: string
  created: number
}

export default defineNuxtPlugin(() => {
  if (typeof window === 'undefined') return

  const STORAGE_KEY = 'biometric_credential'

  // بررسی پشتیبانی از WebAuthn
  const isSupported = (): boolean => {
    return !!(window.PublicKeyCredential && 
              navigator.credentials && 
              typeof navigator.credentials.create === 'function')
  }

  // بررسی پشتیبانی از Platform Authenticator (Face ID / Touch ID)
  const isPlatformAuthenticatorAvailable = async (): Promise<boolean> => {
    if (!isSupported()) return false
    try {
      return await PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable()
    } catch {
      return false
    }
  }

  // تبدیل ArrayBuffer به base64
  const bufferToBase64 = (buffer: ArrayBuffer): string => {
    const bytes = new Uint8Array(buffer)
    let binary = ''
    bytes.forEach(b => binary += String.fromCharCode(b))
    return btoa(binary)
  }

  // تبدیل base64 به ArrayBuffer
  const base64ToBuffer = (base64: string): ArrayBuffer => {
    const binary = atob(base64)
    const bytes = new Uint8Array(binary.length)
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i)
    }
    return bytes.buffer
  }

  // تولید challenge تصادفی
  const generateChallenge = (): Uint8Array => {
    const array = new Uint8Array(32)
    crypto.getRandomValues(array)
    return array
  }

  // ثبت Face ID / Touch ID جدید
  const register = async (userId: string, userName: string): Promise<BiometricCredential | null> => {
    if (!await isPlatformAuthenticatorAvailable()) {
      console.warn('Platform authenticator not available')
      return null
    }

    try {
      const challenge = generateChallenge()
      
      const credential = await navigator.credentials.create({
        publicKey: {
          challenge: challenge,
          rp: {
            name: 'Linku',
            id: window.location.hostname
          },
          user: {
            id: new TextEncoder().encode(userId),
            name: userName,
            displayName: userName
          },
          pubKeyCredParams: [
            { type: 'public-key', alg: -7 },   // ES256
            { type: 'public-key', alg: -257 }  // RS256
          ],
          authenticatorSelection: {
            authenticatorAttachment: 'platform', // فقط Face ID / Touch ID
            userVerification: 'required',
            requireResidentKey: false
          },
          timeout: 60000,
          attestation: 'none'
        }
      }) as PublicKeyCredential

      if (credential) {
        const biometricCredential: BiometricCredential = {
          id: credential.id,
          rawId: bufferToBase64(credential.rawId),
          type: credential.type,
          created: Date.now()
        }
        
        // ذخیره در localStorage
        localStorage.setItem(STORAGE_KEY, JSON.stringify(biometricCredential))
        
        return biometricCredential
      }
    } catch (error: any) {
      console.error('Biometric registration failed:', error)
      if (error.name === 'NotAllowedError') {
        throw new Error('دسترسی به Face ID / Touch ID رد شد')
      }
      throw error
    }
    
    return null
  }

  // احراز هویت با Face ID / Touch ID
  const authenticate = async (): Promise<boolean> => {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (!stored) {
      console.warn('No biometric credential stored')
      return false
    }

    try {
      const storedCredential: BiometricCredential = JSON.parse(stored)
      const challenge = generateChallenge()

      const assertion = await navigator.credentials.get({
        publicKey: {
          challenge: challenge,
          allowCredentials: [{
            id: base64ToBuffer(storedCredential.rawId),
            type: 'public-key',
            transports: ['internal']
          }],
          timeout: 60000,
          userVerification: 'required'
        }
      })

      return !!assertion
    } catch (error: any) {
      console.error('Biometric authentication failed:', error)
      if (error.name === 'NotAllowedError') {
        return false
      }
      throw error
    }
  }

  // بررسی آیا قبلاً ثبت شده
  const isRegistered = (): boolean => {
    return !!localStorage.getItem(STORAGE_KEY)
  }

  // حذف ثبت
  const unregister = (): void => {
    localStorage.removeItem(STORAGE_KEY)
  }

  // بررسی فعال بودن تنظیم بیومتریک
  const isBiometricEnabled = (): boolean => {
    return localStorage.getItem('biometric_enabled') === 'true'
  }

  // فعال/غیرفعال کردن
  const setBiometricEnabled = (enabled: boolean): void => {
    localStorage.setItem('biometric_enabled', enabled ? 'true' : 'false')
    if (!enabled) {
      unregister()
    }
  }

  // دریافت نوع دستگاه (برای نمایش آیکون مناسب)
  const getDeviceType = (): 'face-id' | 'touch-id' | 'biometric' => {
    const ua = navigator.userAgent.toLowerCase()
    
    // iPhone X و بالاتر = Face ID
    if (/iphone/.test(ua)) {
      // iPhone X و جدیدتر Face ID دارن
      const match = ua.match(/iphone os (\d+)/)
      if (match && parseInt(match[1]) >= 11) {
        return 'face-id'
      }
    }
    
    // iPad Pro = Face ID
    if (/ipad/.test(ua) && window.screen.height > 1024) {
      return 'face-id'
    }
    
    // iPhone قدیمی‌تر یا Mac = Touch ID
    if (/mac|iphone|ipad/.test(ua)) {
      return 'touch-id'
    }
    
    // Android یا دیگر = generic biometric
    return 'biometric'
  }

  return {
    provide: {
      biometric: {
        isSupported,
        isPlatformAuthenticatorAvailable,
        register,
        authenticate,
        isRegistered,
        unregister,
        isBiometricEnabled,
        setBiometricEnabled,
        getDeviceType
      }
    }
  }
})
