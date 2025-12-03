<template>
  <div
      class="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-slate-900 px-4 transition-colors duration-300 relative">
    <!-- دکمه دارک مود -->
    <button
        @click="toggleDarkMode"
        class="fixed top-4 left-4 w-10 h-10 flex items-center justify-center rounded-lg bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors duration-300 shadow-sm"
        title="تغییر حالت نمایش"
    >
      <svg v-if="!isDarkMode" class="w-5 h-5 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor"
           viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"></path>
      </svg>
      <svg v-else class="w-5 h-5 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor"
           viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"></path>
      </svg>
    </button>

    <Toast/>
    <div class="w-full max-w-md rtl:text-right ltr:text-left">
      <!-- لوگو و عنوان -->
      <div class="text-center mb-8">
        <div class="w-20 h-20 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
          <i class="ti ti-shield-lock text-white text-4xl"></i>
        </div>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">پنل مدیریت</h1>
        <p class="text-gray-500 dark:text-gray-400 text-sm">برای ورود، اطلاعات خود را وارد کنید</p>
      </div>

      <!-- فرم لاگین یکپارچه -->
      <template v-if="step === 'login'">
        <div class="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-6 border border-gray-100 dark:border-slate-700">
          <!-- فیلد موبایل/ایمیل/نام کاربری -->
          <div class="w-full mb-4 relative">
            <div class="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
              <i :class="getInputIcon()" class="text-xl"></i>
            </div>
            <input
                id="usernameInput"
                type="text"
                placeholder=" "
                v-model="username"
                @input="detectInputType"
                @keyup.enter="handleLoginSubmit"
                class="peer w-full px-4 py-4 pr-12 text-sm bg-white dark:bg-slate-700 border border-gray-200 dark:border-slate-600 text-gray-900 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                :class="[usernameError ? 'border-red-500 focus:ring-red-500' : '']"
            />
            <label
                for="usernameInput"
                class="absolute right-12 top-1/2 -translate-y-1/2 text-sm text-gray-500 dark:text-gray-400 bg-white dark:bg-slate-700 px-2 transition-all duration-300 cursor-pointer
                       peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2
                       peer-focus:top-0 peer-focus:text-xs peer-focus:text-blue-500
                       peer-[:not(:placeholder-shown)]:top-0 peer-[:not(:placeholder-shown)]:text-xs">
              {{ getInputLabel() }}
            </label>
          </div>

          <!-- فیلد رمز عبور (فقط برای نام کاربری) -->
          <div v-if="inputType === 'username'" class="w-full mb-6 relative">
            <div class="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
              <i class="ti ti-lock text-xl"></i>
            </div>
            <input
                ref="passwordInput"
                id="passwordInput"
                :type="showPassword ? 'text' : 'password'"
                placeholder=" "
                v-model="password"
                @keyup.enter="handleLoginSubmit"
                class="peer w-full px-4 py-4 pr-12 pl-12 text-sm bg-white dark:bg-slate-700 border border-gray-200 dark:border-slate-600 text-gray-900 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                :class="[passwordError ? 'border-red-500 focus:ring-red-500' : '']"
            />
            <label
                for="passwordInput"
                class="absolute right-12 top-1/2 -translate-y-1/2 text-sm text-gray-500 dark:text-gray-400 bg-white dark:bg-slate-700 px-2 transition-all duration-300 cursor-pointer
                       peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2
                       peer-focus:top-0 peer-focus:text-xs peer-focus:text-blue-500
                       peer-[:not(:placeholder-shown)]:top-0 peer-[:not(:placeholder-shown)]:text-xs">
              رمز عبور
            </label>
            <button
                type="button"
                @click="showPassword = !showPassword"
                class="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
            >
              <i :class="showPassword ? 'ti ti-eye-off' : 'ti ti-eye'" class="text-xl"></i>
            </button>
          </div>

          <!-- دکمه ورود -->
          <button
              @click="handleLoginSubmit"
              :disabled="isLoading || countdown > 0"
              class="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed text-white py-4 rounded-xl text-lg font-medium flex items-center justify-center transition-all duration-300 shadow-lg shadow-blue-600/20 hover:shadow-blue-600/40"
          >
            <template v-if="isLoading">
              <i class="ti ti-loader-2 animate-spin text-xl ml-2"></i>
              در حال بررسی...
            </template>
            <template v-else-if="countdown > 0">
              <i class="ti ti-clock text-xl ml-2"></i>
              <span>ارسال مجدد تا {{ formatCountdown }}</span>
            </template>
            <template v-else>
              <span>{{ getSubmitButtonText() }}</span>
              <i class="ti ti-login mr-2 text-xl"></i>
            </template>
          </button>
        </div>
      </template>

      <!-- مرحله ورود کد تایید OTP -->
      <template v-else-if="step === 'otp'">
        <div class="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-6 border border-gray-100 dark:border-slate-700">
          <!-- آیکون و عنوان -->
          <div class="text-center mb-6">
            <div class="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
              <i :class="inputType === 'email' ? 'ti ti-mail-check' : 'ti ti-message-code'" class="text-green-600 dark:text-green-400 text-3xl"></i>
            </div>
            <h2 class="text-xl font-bold text-gray-900 dark:text-white mb-2">کد تایید</h2>
            <p class="text-sm text-gray-500 dark:text-gray-400">
              <template v-if="inputType === 'email'">
                کد ارسال شده به ایمیل<br/>
                <span class="font-medium text-blue-600 dark:text-blue-400 dir-ltr inline-block">{{ username }}</span>
              </template>
              <template v-else-if="inputType === 'phone'">
                کد ارسال شده به شماره<br/>
                <span class="font-medium text-blue-600 dark:text-blue-400 dir-ltr inline-block">{{ formatPhoneNumber(username) }}</span>
              </template>
            </p>
          </div>

          <!-- ورودی کد -->
          <div ref="otpContainer" class="flex flex-row justify-center gap-3 mb-6" dir="ltr">
            <input
                v-for="(_, index) in 4"
                :key="'otp-' + index"
                :id="'otp-input-' + index"
                type="text"
                maxlength="1"
                inputmode="numeric"
                autocomplete="one-time-code"
                placeholder="•"
                class="w-14 h-14 text-2xl font-bold text-center bg-gray-50 dark:bg-slate-700 border-2 border-gray-200 dark:border-slate-600 text-gray-900 dark:text-white rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-300"
                :class="[otpError ? 'border-red-500' : '', otp[index] ? 'bounce' : '']"
                :value="otp[index]"
                @input="otp[index] = ($event.target as HTMLInputElement)?.value || ''"
                @keydown="handleOtpKey(index, $event)"
                @paste="handlePaste"
                :autofocus="index === 0"
            />
          </div>

          <!-- تایمر و ارسال مجدد -->
          <div class="flex justify-center items-center mb-6">
            <template v-if="countdown > 0">
              <div class="flex items-center gap-2 text-gray-500 dark:text-gray-400">
                <i class="ti ti-clock text-lg"></i>
                <span class="text-sm">
                  ارسال مجدد تا <span class="font-bold text-gray-700 dark:text-gray-300" dir="ltr">{{ formatCountdown }}</span>
                </span>
              </div>
            </template>
            <template v-else>
              <button
                  @click="resendCode"
                  :disabled="isLoading"
                  class="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 text-sm font-medium flex items-center gap-2 transition-colors"
              >
                <i class="ti ti-refresh text-lg"></i>
                ارسال مجدد کد
              </button>
            </template>
          </div>

          <!-- دکمه برگشت -->
          <button
              @click="goBack"
              class="w-full bg-gray-100 dark:bg-slate-700 hover:bg-gray-200 dark:hover:bg-slate-600 text-gray-700 dark:text-gray-300 py-3 rounded-xl text-sm font-medium flex items-center justify-center transition-colors"
          >
            <i class="ti ti-arrow-right ml-2"></i>
            تغییر {{ inputType === 'email' ? 'ایمیل' : (inputType === 'phone' ? 'شماره موبایل' : 'مشخصات') }}
          </button>
        </div>
      </template>
    </div>
  </div>
  <InfoToast :visible="showToast" :message="toastMessage" :icon="toastIcon"/>
</template>

<script setup lang="ts">
import {ref, computed, onMounted, getCurrentInstance, nextTick} from 'vue'
import Toast from '@/components/Toast.vue'
import {useDarkMode} from '@/composables/useDarkMode'
import {useAuthStore} from "@/stores/auth.ts";
import InfoToast from "@/components/InfoToast.vue";
import {useRouter} from "vue-router";

defineOptions({
  name: 'LoginComponent'
})

const step = ref<'login' | 'otp'>('login')
const inputType = ref<'unknown' | 'email' | 'phone' | 'username'>('unknown')
const {isDarkMode, toggleDarkMode, initDarkMode} = useDarkMode()
const username = ref('')
const password = ref('')
const showPassword = ref(false)
const usernameError = ref(false)
const passwordError = ref(false)
const otpError = ref(false)
const isLoading = ref(false)
const {appContext} = getCurrentInstance()!
const axios = appContext.config.globalProperties.$axios
const authStore = useAuthStore()
const countdown = ref(0)
const showToast = ref(false)
const toastMessage = ref('')
const toastIcon = ref('ti-alert-triangle')

const showInfoToast = (message: string, icon = 'ti-alert-triangle') => {
  toastMessage.value = message
  toastIcon.value = icon
  showToast.value = true
  setTimeout(() => showToast.value = false, 3000)
}

const otp = ref(['', '', '', ''])
const otpContainer = ref<HTMLElement | null>(null)
const passwordInput = ref<HTMLInputElement | null>(null)

const formatCountdown = computed(() => {
  const minutes = Math.floor(countdown.value / 60)
  const seconds = countdown.value % 60
  return `${minutes}:${seconds.toString().padStart(2, '0')}`
})

const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

const validatePhone = (phone: string): boolean => {
  // شماره موبایل ایران: 09xxxxxxxxx یا 9xxxxxxxxx
  const phoneRegex = /^(09|9)\d{9}$/
  return phoneRegex.test(phone.replace(/\s/g, ''))
}

// تشخیص نوع ورودی
const detectInputType = () => {
  const value = username.value.trim()
  
  if (!value) {
    inputType.value = 'unknown'
    return
  }
  
  if (validateEmail(value)) {
    inputType.value = 'email'
  } else if (validatePhone(value)) {
    inputType.value = 'phone'
  } else {
    inputType.value = 'username'
  }
}

// آیکون مناسب
const getInputIcon = () => {
  switch (inputType.value) {
    case 'email':
      return 'ti ti-mail'
    case 'phone':
      return 'ti ti-phone'
    case 'username':
      return 'ti ti-user'
    default:
      return 'ti ti-user-circle'
  }
}

// لیبل مناسب
const getInputLabel = () => {
  switch (inputType.value) {
    case 'email':
      return 'ایمیل'
    case 'phone':
      return 'شماره موبایل'
    case 'username':
      return 'نام کاربری'
    default:
      return 'موبایل / ایمیل / نام کاربری'
  }
}

// متن دکمه
const getSubmitButtonText = () => {
  if (inputType.value === 'username') {
    return 'ورود'
  }
  return 'دریافت کد تایید'
}

// فرمت شماره موبایل
const formatPhoneNumber = (phone: string) => {
  const cleaned = phone.replace(/\D/g, '')
  if (cleaned.startsWith('98')) {
    return '+' + cleaned
  }
  if (cleaned.startsWith('0')) {
    return '+98' + cleaned.slice(1)
  }
  return '+98' + cleaned
}

// ارسال فرم لاگین
const handleLoginSubmit = async () => {
  const trimmedUsername = username.value.trim()
  
  if (!trimmedUsername) {
    usernameError.value = true
    showInfoToast('لطفاً اطلاعات خود را وارد کنید')
    return
  }
  
  usernameError.value = false
  detectInputType()
  
  if (inputType.value === 'email') {
    await sendEmailOTP()
  } else if (inputType.value === 'phone') {
    await sendPhoneOTP()
  } else if (inputType.value === 'username') {
    await loginWithPassword()
  } else {
    usernameError.value = true
    showInfoToast('لطفاً ایمیل، شماره موبایل یا نام کاربری معتبر وارد کنید')
  }
}

// ارسال OTP ایمیل
const sendEmailOTP = async () => {
  isLoading.value = true
  
  try {
    const response = await axios.post('/auth/admin/sendOtpEmail', {
      email: username.value.trim().toLowerCase()
    })
    
    if (response.data && response.data.success === true) {
      step.value = 'otp'
      startTimer()
      showInfoToast('کد تایید به ایمیل شما ارسال شد', 'ti-mail-check')
    } else {
      showInfoToast(response.data?.message || 'خطا در ارسال کد تایید', 'ti-alert-triangle')
    }
  } catch (error: any) {
    const message = error.response?.data?.message || 'خطایی در ارسال کد رخ داد'
    showInfoToast(message, 'ti-alert-triangle')
  } finally {
    isLoading.value = false
  }
}

// ارسال OTP موبایل
const sendPhoneOTP = async () => {
  isLoading.value = true
  
  try {
    const cleanedPhone = username.value.replace(/\D/g, '')
    const normalizedPhone = cleanedPhone.startsWith('0') ? cleanedPhone.slice(1) : cleanedPhone
    
    const response = await axios.post('/auth/admin/sendOtpSms', {
      phone: normalizedPhone,
      countryCode: '+98'
    })
    
    if (response.data && response.data.success === true) {
      step.value = 'otp'
      startTimer()
      showInfoToast('کد تایید به شماره موبایل شما ارسال شد', 'ti-message-check')
    } else {
      showInfoToast(response.data?.message || 'خطا در ارسال کد تایید', 'ti-alert-triangle')
    }
  } catch (error: any) {
    const message = error.response?.data?.message || 'خطایی در ارسال کد رخ داد'
    showInfoToast(message, 'ti-alert-triangle')
  } finally {
    isLoading.value = false
  }
}

// ورود با رمز عبور (نام کاربری) - بدون OTP
const loginWithPassword = async () => {
  if (!password.value) {
    passwordError.value = true
    showInfoToast('لطفاً رمز عبور خود را وارد کنید', 'ti-lock')
    return
  }
  
  passwordError.value = false
  isLoading.value = true
  
  try {
    const response = await axios.post('/auth/admin/directLogin', {
      username: username.value.trim(),
      password: password.value
    })
    
    if (response.data?.success && response.data?.token) {
      authStore.setToken(response.data.token)
      await nextTick()
      showInfoToast('ورود موفقیت‌آمیز بود', 'ti-check')
      setTimeout(() => {
        window.location.href = '/'
      }, 500)
    } else {
      showInfoToast(response.data?.message || 'نام کاربری یا رمز عبور اشتباه است', 'ti-alert-triangle')
    }
  } catch (error: any) {
    const message = error.response?.data?.message || 'نام کاربری یا رمز عبور اشتباه است'
    showInfoToast(message, 'ti-alert-triangle')
  } finally {
    isLoading.value = false
  }
}

function startTimer() {
  countdown.value = 120
  const interval = setInterval(() => {
    if (countdown.value > 0) {
      countdown.value--
    } else {
      clearInterval(interval)
    }
  }, 1000)
}

const router = useRouter()

// چک کردن اینکه آیا همه فیلدهای OTP پر شدن
const isOtpFull = () => otp.value.every(d => d !== null && d !== '')

// تابع هندل کیبورد برای OTP
const handleOtpKey = async (index: number, event: KeyboardEvent) => {
  const key = event.key
  const container = otpContainer.value

  if (!['Backspace', 'Tab', 'ArrowLeft', 'ArrowRight'].includes(key) && !/^[0-9]$/.test(key)) {
    event.preventDefault()
    return
  }

  if (key === 'Backspace') {
    otp.value[index] = ''
    if (index > 0 && container) {
      (container.children[index - 1] as HTMLInputElement)?.focus()
    }
    event.preventDefault()
    return
  }

  if (/^[0-9]$/.test(key)) {
    otp.value[index] = key
    event.preventDefault()

    if (index < 3 && container) {
      (container.children[index + 1] as HTMLInputElement)?.focus()
    }

    if (isOtpFull()) {
      await verifyOtpCode()
    }
  }
}

const handlePaste = (event: ClipboardEvent) => {
  event.preventDefault()
  const pastedData = event.clipboardData?.getData('text') || ''
  const digits = pastedData.replace(/\D/g, '').slice(0, 4)
  const container = otpContainer.value
  
  digits.split('').forEach((digit, index) => {
    if (index < otp.value.length) {
      otp.value[index] = digit
    }
  })

  const nextEmptyIndex = otp.value.findIndex(d => d === '')
  if (nextEmptyIndex !== -1 && container) {
    (container.children[nextEmptyIndex] as HTMLInputElement)?.focus()
  } else if (container) {
    (container.children[otp.value.length - 1] as HTMLInputElement)?.focus()
    verifyOtpCode()
  }
}

const verifyOtpCode = async () => {
  const fullCode = otp.value.join('')
  
  if (fullCode.length !== 4) {
    return
  }

  isLoading.value = true

  try {
    let response
    
    if (inputType.value === 'email') {
      response = await axios.post('/auth/admin/verifyOtpEmail', {
        email: username.value.trim().toLowerCase(),
        code: fullCode
      })
    } else if (inputType.value === 'phone') {
      const cleanedPhone = username.value.replace(/\D/g, '')
      const normalizedPhone = cleanedPhone.startsWith('0') ? cleanedPhone.slice(1) : cleanedPhone
      
      response = await axios.post('/auth/admin/verifyOtpSms', {
        phone: normalizedPhone,
        countryCode: '+98',
        code: fullCode
      })
    }

    if (response?.data?.token) {
      authStore.setToken(response.data.token)
      await nextTick()
      showInfoToast('ورود موفقیت‌آمیز بود', 'ti-check')
      setTimeout(() => {
        window.location.href = '/'
      }, 500)
    } else {
      otpError.value = true
      otp.value = ['', '', '', '']
      const container = otpContainer.value
      if (container) (container.children[0] as HTMLInputElement)?.focus()
      showInfoToast(response?.data?.message || 'کد وارد شده صحیح نیست', 'ti-alert-triangle')
    }
  } catch (error: any) {
    otpError.value = true
    otp.value = ['', '', '', '']
    const container = otpContainer.value
    if (container) (container.children[0] as HTMLInputElement)?.focus()
    const message = error.response?.data?.message || 'خطایی در تایید کد رخ داد'
    showInfoToast(message, 'ti-alert-triangle')
  } finally {
    isLoading.value = false
  }
}

const resendCode = async () => {
  if (inputType.value === 'email') {
    await sendEmailOTP()
  } else if (inputType.value === 'phone') {
    await sendPhoneOTP()
  }
}

const goBack = () => {
  step.value = 'login'
  otp.value = ['', '', '', '']
  otpError.value = false
  countdown.value = 0
}

onMounted(() => {
  initDarkMode()
})
</script>
<style scoped>
.bounce {
  animation: pulse 0.25s ease-in-out alternate;
}

@keyframes pulse {
  0% {
    transform: scale(1);
  }
  100% {
    transform: scale(1.1);
  }
}
</style>
