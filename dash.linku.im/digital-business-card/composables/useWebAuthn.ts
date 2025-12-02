/**
 * WebAuthn Composable for Face ID / Touch ID / Passkey Support
 * این composable امکان استفاده از Face ID، Touch ID و Passkey رو فراهم میکنه
 */

interface PublicKeyCredentialCreationOptionsJSON {
  challenge: string
  rp: {
    name: string
    id?: string
  }
  user: {
    id: string
    name: string
    displayName: string
  }
  pubKeyCredParams: Array<{
    type: 'public-key'
    alg: number
  }>
  timeout?: number
  attestation?: AttestationConveyancePreference
  authenticatorSelection?: {
    authenticatorAttachment?: AuthenticatorAttachment
    residentKey?: ResidentKeyRequirement
    requireResidentKey?: boolean
    userVerification?: UserVerificationRequirement
  }
}

interface PublicKeyCredentialRequestOptionsJSON {
  challenge: string
  timeout?: number
  rpId?: string
  allowCredentials?: Array<{
    type: 'public-key'
    id: string
    transports?: AuthenticatorTransport[]
  }>
  userVerification?: UserVerificationRequirement
}

export const useWebAuthn = () => {
  const isSupported = ref(false)
  const isPlatformAuthenticatorAvailable = ref(false)
  const isLoading = ref(false)
  const error = ref<string | undefined>(undefined)

  // بررسی پشتیبانی WebAuthn
  const checkSupport = async (): Promise<boolean> => {
    if (!process.client) return false

    // بررسی API اصلی
    if (!window.PublicKeyCredential) {
      isSupported.value = false
      return false
    }

    isSupported.value = true

    // بررسی Platform Authenticator (Face ID / Touch ID)
    try {
      isPlatformAuthenticatorAvailable.value = 
        await PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable()
    } catch {
      isPlatformAuthenticatorAvailable.value = false
    }

    return isSupported.value
  }

  // تبدیل Base64URL به ArrayBuffer
  const base64URLToArrayBuffer = (base64url: string): ArrayBuffer => {
    const base64 = base64url.replace(/-/g, '+').replace(/_/g, '/')
    const padding = '='.repeat((4 - base64.length % 4) % 4)
    const binaryString = atob(base64 + padding)
    const bytes = new Uint8Array(binaryString.length)
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i)
    }
    return bytes.buffer
  }

  // تبدیل ArrayBuffer به Base64URL
  const arrayBufferToBase64URL = (buffer: ArrayBuffer): string => {
    const bytes = new Uint8Array(buffer)
    let binary = ''
    for (let i = 0; i < bytes.length; i++) {
      binary += String.fromCharCode(bytes[i])
    }
    return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '')
  }

  /**
   * ثبت Passkey جدید (Face ID / Touch ID)
   * این متد باید بعد از لاگین موفق فراخوانی بشه
   */
  const registerPasskey = async (
    userId: string,
    userName: string,
    displayName: string
  ): Promise<{ success: boolean; credential?: any; error?: string }> => {
    if (!isSupported.value) {
      return { success: false, error: 'WebAuthn پشتیبانی نمی‌شود' }
    }

    isLoading.value = true
    error.value = undefined

    try {
      // ایجاد challenge تصادفی (در production باید از سرور بیاد)
      const challenge = new Uint8Array(32)
      crypto.getRandomValues(challenge)

      const publicKeyCredentialCreationOptions: PublicKeyCredentialCreationOptions = {
        challenge: challenge,
        rp: {
          name: 'لینکو - Linku',
          id: window.location.hostname
        },
        user: {
          id: new TextEncoder().encode(userId),
          name: userName,
          displayName: displayName
        },
        pubKeyCredParams: [
          { type: 'public-key', alg: -7 },   // ES256 (recommended)
          { type: 'public-key', alg: -257 }  // RS256 (fallback)
        ],
        timeout: 60000,
        attestation: 'none',
        authenticatorSelection: {
          // Platform authenticator = Face ID / Touch ID / Windows Hello
          authenticatorAttachment: 'platform',
          residentKey: 'preferred',
          requireResidentKey: false,
          userVerification: 'preferred'
        }
      }

      const credential = await navigator.credentials.create({
        publicKey: publicKeyCredentialCreationOptions
      }) as PublicKeyCredential

      if (!credential) {
        throw new Error('ایجاد Credential ناموفق بود')
      }

      // استخراج اطلاعات برای ارسال به سرور
      const response = credential.response as AuthenticatorAttestationResponse
      const credentialData = {
        id: credential.id,
        rawId: arrayBufferToBase64URL(credential.rawId),
        type: credential.type,
        response: {
          attestationObject: arrayBufferToBase64URL(response.attestationObject),
          clientDataJSON: arrayBufferToBase64URL(response.clientDataJSON),
        }
      }

      // ذخیره در localStorage (در production باید به سرور ارسال بشه)
      const savedCredentials = JSON.parse(localStorage.getItem('webauthn_credentials') || '[]')
      savedCredentials.push({
        credentialId: credential.id,
        userId: userId,
        createdAt: new Date().toISOString()
      })
      localStorage.setItem('webauthn_credentials', JSON.stringify(savedCredentials))
      localStorage.setItem('webauthn_enabled', 'true')

      isLoading.value = false
      return { success: true, credential: credentialData }
    } catch (err: any) {
      isLoading.value = false
      
      if (err.name === 'NotAllowedError') {
        error.value = 'دسترسی رد شد. لطفاً دوباره تلاش کنید.'
      } else if (err.name === 'InvalidStateError') {
        error.value = 'این دستگاه قبلاً ثبت شده است.'
      } else {
        error.value = err.message || 'خطا در ثبت Passkey'
      }
      
      return { success: false, error: error.value }
    }
  }

  /**
   * احراز هویت با Passkey (Face ID / Touch ID)
   */
  const authenticateWithPasskey = async (): Promise<{ 
    success: boolean
    userId?: string
    credential?: any
    error?: string 
  }> => {
    if (!isSupported.value) {
      return { success: false, error: 'WebAuthn پشتیبانی نمی‌شود' }
    }

    // بررسی آیا Passkey فعال شده
    if (localStorage.getItem('webauthn_enabled') !== 'true') {
      return { success: false, error: 'Passkey فعال نیست' }
    }

    isLoading.value = true
    error.value = undefined

    try {
      // ایجاد challenge تصادفی (در production باید از سرور بیاد)
      const challenge = new Uint8Array(32)
      crypto.getRandomValues(challenge)

      // دریافت credentials ذخیره شده
      const savedCredentials = JSON.parse(localStorage.getItem('webauthn_credentials') || '[]')
      
      const publicKeyCredentialRequestOptions: PublicKeyCredentialRequestOptions = {
        challenge: challenge,
        timeout: 60000,
        rpId: window.location.hostname,
        allowCredentials: savedCredentials.map((cred: any) => ({
          type: 'public-key' as const,
          id: base64URLToArrayBuffer(cred.credentialId),
          transports: ['internal' as AuthenticatorTransport]
        })),
        userVerification: 'preferred'
      }

      const credential = await navigator.credentials.get({
        publicKey: publicKeyCredentialRequestOptions
      }) as PublicKeyCredential

      if (!credential) {
        throw new Error('احراز هویت ناموفق بود')
      }

      // پیدا کردن userId مرتبط با این credential
      const matchedCred = savedCredentials.find(
        (c: any) => c.credentialId === credential.id
      )

      isLoading.value = false
      return { 
        success: true, 
        userId: matchedCred?.userId,
        credential: {
          id: credential.id,
          type: credential.type
        }
      }
    } catch (err: any) {
      isLoading.value = false
      
      if (err.name === 'NotAllowedError') {
        error.value = 'احراز هویت لغو شد'
      } else {
        error.value = err.message || 'خطا در احراز هویت'
      }
      
      return { success: false, error: error.value }
    }
  }

  /**
   * بررسی آیا Passkey فعال شده
   */
  const isPasskeyEnabled = (): boolean => {
    if (!process.client) return false
    return localStorage.getItem('webauthn_enabled') === 'true'
  }

  /**
   * غیرفعال کردن Passkey
   */
  const disablePasskey = (): void => {
    if (!process.client) return
    localStorage.removeItem('webauthn_enabled')
    localStorage.removeItem('webauthn_credentials')
  }

  /**
   * دریافت اطلاعات دستگاه‌های ثبت شده
   */
  const getRegisteredDevices = (): Array<{ credentialId: string; userId: string; createdAt: string }> => {
    if (!process.client) return []
    return JSON.parse(localStorage.getItem('webauthn_credentials') || '[]')
  }

  // بررسی پشتیبانی در mount
  onMounted(() => {
    checkSupport()
  })

  return {
    // State
    isSupported,
    isPlatformAuthenticatorAvailable,
    isLoading,
    error,
    
    // Methods
    checkSupport,
    registerPasskey,
    authenticateWithPasskey,
    isPasskeyEnabled,
    disablePasskey,
    getRegisteredDevices
  }
}
