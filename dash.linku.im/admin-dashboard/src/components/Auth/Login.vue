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
        <p class="text-gray-500 dark:text-gray-400 text-sm">برای ورود، روش مورد نظر را انتخاب کنید</p>
      </div>

      <!-- مرحله انتخاب روش ورود -->
      <template v-if="step === 'method'">
        <div class="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-6 border border-gray-100 dark:border-slate-700">
          <div class="space-y-4">
            <!-- روش ورود با کد یکبار مصرف -->
            <button
                @click="selectMethod('otp')"
                class="w-full p-4 bg-gradient-to-l from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/30 border-2 border-blue-200 dark:border-blue-700 rounded-xl hover:border-blue-400 dark:hover:border-blue-500 transition-all duration-300 flex items-center gap-4 group"
            >
              <div class="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                <i class="ti ti-mail-code text-white text-2xl"></i>
              </div>
              <div class="text-right flex-1">
                <h3 class="font-bold text-gray-900 dark:text-white">ورود با کد یکبار مصرف</h3>
                <p class="text-sm text-gray-500 dark:text-gray-400">کد تایید به ایمیل شما ارسال می‌شود</p>
              </div>
              <i class="ti ti-chevron-left text-gray-400 group-hover:text-blue-500 transition-colors"></i>
            </button>

            <!-- روش ورود با رمز عبور -->
            <button
                @click="selectMethod('password')"
                class="w-full p-4 bg-gradient-to-l from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/30 border-2 border-purple-200 dark:border-purple-700 rounded-xl hover:border-purple-400 dark:hover:border-purple-500 transition-all duration-300 flex items-center gap-4 group"
            >
              <div class="w-12 h-12 bg-purple-500 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                <i class="ti ti-lock text-white text-2xl"></i>
              </div>
              <div class="text-right flex-1">
                <h3 class="font-bold text-gray-900 dark:text-white">ورود با رمز عبور</h3>
                <p class="text-sm text-gray-500 dark:text-gray-400">ایمیل و رمز عبور + تایید دو مرحله‌ای</p>
              </div>
              <i class="ti ti-chevron-left text-gray-400 group-hover:text-purple-500 transition-colors"></i>
            </button>
          </div>
        </div>
      </template>

      <!-- مرحله ورود ایمیل برای OTP -->
      <template v-else-if="step === 'email'">
        <div class="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-6 border border-gray-100 dark:border-slate-700">
          <!-- فیلد ایمیل -->
          <div class="w-full mb-6 relative">
            <div class="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
              <i class="ti ti-mail text-xl"></i>
            </div>
            <input
                id="emailInput"
                type="email"
                inputmode="email"
                placeholder=" "
                v-model="email"
                @keyup.enter="submitEmail"
                class="peer w-full px-4 py-4 pr-12 text-sm bg-white dark:bg-slate-700 border border-gray-200 dark:border-slate-600 text-gray-900 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                :class="[emailError ? 'border-red-500 focus:ring-red-500' : '']"
            />
            <label
                for="emailInput"
                class="absolute right-12 top-1/2 -translate-y-1/2 text-sm text-gray-500 dark:text-gray-400 bg-white dark:bg-slate-700 px-2 transition-all duration-300 cursor-pointer
                       peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2
                       peer-focus:top-0 peer-focus:text-xs peer-focus:text-blue-500
                       peer-[:not(:placeholder-shown)]:top-0 peer-[:not(:placeholder-shown)]:text-xs">
              ایمیل
            </label>
          </div>

          <!-- دکمه ادامه -->
          <button
              @click="submitEmail"
              :disabled="isLoading || countdown > 0"
              class="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed text-white py-4 rounded-xl text-lg font-medium flex items-center justify-center transition-all duration-300 shadow-lg shadow-blue-600/20 hover:shadow-blue-600/40"
          >
            <template v-if="isLoading">
              <i class="ti ti-loader-2 animate-spin text-xl ml-2"></i>
              در حال ارسال...
            </template>
            <template v-else-if="countdown > 0">
              <i class="ti ti-clock text-xl ml-2"></i>
              <span>ارسال مجدد تا {{ formatCountdown }}</span>
            </template>
            <template v-else>
              <span>دریافت کد تایید</span>
              <i class="ti ti-arrow-left mr-2 text-xl"></i>
            </template>
          </button>

          <!-- دکمه برگشت -->
          <button
              @click="goToMethodSelection"
              class="w-full mt-4 bg-gray-100 dark:bg-slate-700 hover:bg-gray-200 dark:hover:bg-slate-600 text-gray-700 dark:text-gray-300 py-3 rounded-xl text-sm font-medium flex items-center justify-center transition-colors"
          >
            <i class="ti ti-arrow-right ml-2"></i>
            بازگشت
          </button>
        </div>
      </template>

      <!-- مرحله ورود ایمیل و رمز عبور -->
      <template v-else-if="step === 'password'">
        <div class="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-6 border border-gray-100 dark:border-slate-700">
          <!-- فیلد ایمیل -->
          <div class="w-full mb-4 relative">
            <div class="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
              <i class="ti ti-mail text-xl"></i>
            </div>
            <input
                id="emailInputPassword"
                type="email"
                inputmode="email"
                placeholder=" "
                v-model="email"
                @keyup.enter="focusPasswordInput"
                class="peer w-full px-4 py-4 pr-12 text-sm bg-white dark:bg-slate-700 border border-gray-200 dark:border-slate-600 text-gray-900 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
                :class="[emailError ? 'border-red-500 focus:ring-red-500' : '']"
            />
            <label
                for="emailInputPassword"
                class="absolute right-12 top-1/2 -translate-y-1/2 text-sm text-gray-500 dark:text-gray-400 bg-white dark:bg-slate-700 px-2 transition-all duration-300 cursor-pointer
                       peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2
                       peer-focus:top-0 peer-focus:text-xs peer-focus:text-purple-500
                       peer-[:not(:placeholder-shown)]:top-0 peer-[:not(:placeholder-shown)]:text-xs">
              ایمیل
            </label>
          </div>

          <!-- فیلد رمز عبور -->
          <div class="w-full mb-6 relative">
            <div class="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
              <i class="ti ti-lock text-xl"></i>
            </div>
            <input
                ref="passwordInput"
                id="passwordInput"
                :type="showPassword ? 'text' : 'password'"
                placeholder=" "
                v-model="password"
                @keyup.enter="submitPassword"
                class="peer w-full px-4 py-4 pr-12 pl-12 text-sm bg-white dark:bg-slate-700 border border-gray-200 dark:border-slate-600 text-gray-900 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
                :class="[passwordError ? 'border-red-500 focus:ring-red-500' : '']"
            />
            <label
                for="passwordInput"
                class="absolute right-12 top-1/2 -translate-y-1/2 text-sm text-gray-500 dark:text-gray-400 bg-white dark:bg-slate-700 px-2 transition-all duration-300 cursor-pointer
                       peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2
                       peer-focus:top-0 peer-focus:text-xs peer-focus:text-purple-500
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
              @click="submitPassword"
              :disabled="isLoading || countdown > 0"
              class="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-purple-400 disabled:cursor-not-allowed text-white py-4 rounded-xl text-lg font-medium flex items-center justify-center transition-all duration-300 shadow-lg shadow-purple-600/20 hover:shadow-purple-600/40"
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
              <span>ورود</span>
              <i class="ti ti-login mr-2 text-xl"></i>
            </template>
          </button>

          <!-- دکمه برگشت -->
          <button
              @click="goToMethodSelection"
              class="w-full mt-4 bg-gray-100 dark:bg-slate-700 hover:bg-gray-200 dark:hover:bg-slate-600 text-gray-700 dark:text-gray-300 py-3 rounded-xl text-sm font-medium flex items-center justify-center transition-colors"
          >
            <i class="ti ti-arrow-right ml-2"></i>
            بازگشت
          </button>
        </div>
      </template>

      <!-- مرحله ورود کد تایید OTP -->
      <template v-else-if="step === 'otp'">
        <div class="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-6 border border-gray-100 dark:border-slate-700">
          <!-- آیکون و عنوان -->
          <div class="text-center mb-6">
            <div class="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
              <i class="ti ti-mail-check text-green-600 dark:text-green-400 text-3xl"></i>
            </div>
            <h2 class="text-xl font-bold text-gray-900 dark:text-white mb-2">کد تایید</h2>
            <p class="text-sm text-gray-500 dark:text-gray-400">
              کد ارسال شده به ایمیل<br/>
              <span class="font-medium text-blue-600 dark:text-blue-400 dir-ltr inline-block">{{ email }}</span>
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
            تغییر ایمیل
          </button>
        </div>
      </template>

      <!-- مرحله ورود کد تایید دو مرحله‌ای (2FA) -->
      <template v-else-if="step === '2fa'">
        <div class="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-6 border border-gray-100 dark:border-slate-700">
          <!-- آیکون و عنوان -->
          <div class="text-center mb-6">
            <div class="w-16 h-16 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
              <i class="ti ti-shield-check text-purple-600 dark:text-purple-400 text-3xl"></i>
            </div>
            <h2 class="text-xl font-bold text-gray-900 dark:text-white mb-2">تایید دو مرحله‌ای</h2>
            <p class="text-sm text-gray-500 dark:text-gray-400">
              کد تایید به ایمیل شما ارسال شد<br/>
              <span class="font-medium text-purple-600 dark:text-purple-400 dir-ltr inline-block">{{ email }}</span>
            </p>
          </div>

          <!-- ورودی کد -->
          <div ref="otpContainer2FA" class="flex flex-row justify-center gap-3 mb-6" dir="ltr">
            <input
                v-for="(_, index) in 4"
                :key="'2fa-' + index"
                :id="'2fa-input-' + index"
                type="text"
                maxlength="1"
                inputmode="numeric"
                autocomplete="one-time-code"
                placeholder="•"
                class="w-14 h-14 text-2xl font-bold text-center bg-gray-50 dark:bg-slate-700 border-2 border-gray-200 dark:border-slate-600 text-gray-900 dark:text-white rounded-xl focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all duration-300"
                :class="[otpError ? 'border-red-500' : '', otp[index] ? 'bounce' : '']"
                :value="otp[index]"
                @input="otp[index] = ($event.target as HTMLInputElement)?.value || ''"
                @keydown="handle2FAKey(index, $event)"
                @paste="handlePaste2FA"
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
                  @click="resend2FACode"
                  :disabled="isLoading"
                  class="text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 text-sm font-medium flex items-center gap-2 transition-colors"
              >
                <i class="ti ti-refresh text-lg"></i>
                ارسال مجدد کد
              </button>
            </template>
          </div>

          <!-- دکمه برگشت -->
          <button
              @click="goBackToPassword"
              class="w-full bg-gray-100 dark:bg-slate-700 hover:bg-gray-200 dark:hover:bg-slate-600 text-gray-700 dark:text-gray-300 py-3 rounded-xl text-sm font-medium flex items-center justify-center transition-colors"
          >
            <i class="ti ti-arrow-right ml-2"></i>
            بازگشت
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

const step = ref<'method' | 'email' | 'password' | 'otp' | '2fa'>('method')
const loginMethod = ref<'otp' | 'password'>('otp')
const {isDarkMode, toggleDarkMode, initDarkMode} = useDarkMode()
const email = ref('')
const password = ref('')
const showPassword = ref(false)
const emailError = ref(false)
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
const otpRefs = ref<Array<HTMLInputElement | null>>([])
const otpContainer = ref<HTMLElement | null>(null)
const otpContainer2FA = ref<HTMLElement | null>(null)
const passwordInput = ref<HTMLInputElement | null>(null)

const focusPasswordInput = () => {
  passwordInput.value?.focus()
}

const formatCountdown = computed(() => {
  const minutes = Math.floor(countdown.value / 60)
  const seconds = countdown.value % 60
  return `${minutes}:${seconds.toString().padStart(2, '0')}`
})

const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

// انتخاب روش ورود
const selectMethod = (method: 'otp' | 'password') => {
  loginMethod.value = method
  if (method === 'otp') {
    step.value = 'email'
  } else {
    step.value = 'password'
  }
}

// برگشت به صفحه انتخاب روش
const goToMethodSelection = () => {
  step.value = 'method'
  email.value = ''
  password.value = ''
  otp.value = ['', '', '', '']
  emailError.value = false
  passwordError.value = false
  otpError.value = false
  countdown.value = 0
}

// ارسال ایمیل برای OTP
const submitEmail = async () => {
  const trimmedEmail = email.value.trim().toLowerCase()
  
  if (!trimmedEmail) {
    emailError.value = true
    showInfoToast('لطفاً ایمیل خود را وارد کنید', 'ti-mail')
    return
  }

  if (!validateEmail(trimmedEmail)) {
    emailError.value = true
    showInfoToast('فرمت ایمیل وارد شده صحیح نیست', 'ti-mail-x')
    return
  }

  emailError.value = false
  isLoading.value = true

  try {
    const response = await axios.post('/auth/admin/sendOtpEmail', {
      email: trimmedEmail
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

// ارسال ایمیل و رمز عبور
const submitPassword = async () => {
  const trimmedEmail = email.value.trim().toLowerCase()
  const trimmedPassword = password.value
  
  if (!trimmedEmail) {
    emailError.value = true
    showInfoToast('لطفاً ایمیل خود را وارد کنید', 'ti-mail')
    return
  }

  if (!validateEmail(trimmedEmail)) {
    emailError.value = true
    showInfoToast('فرمت ایمیل وارد شده صحیح نیست', 'ti-mail-x')
    return
  }

  if (!trimmedPassword) {
    passwordError.value = true
    showInfoToast('لطفاً رمز عبور خود را وارد کنید', 'ti-lock')
    return
  }

  emailError.value = false
  passwordError.value = false
  isLoading.value = true

  try {
    const response = await axios.post('/auth/admin/loginWithPassword', {
      email: trimmedEmail,
      password: trimmedPassword
    })

    if (response.data && response.data.success === true) {
      // رمز صحیح بود، کد 2FA ارسال شد
      step.value = '2fa'
      startTimer()
      showInfoToast('کد تایید دو مرحله‌ای به ایمیل شما ارسال شد', 'ti-shield-check')
    } else {
      showInfoToast(response.data?.message || 'ایمیل یا رمز عبور اشتباه است', 'ti-alert-triangle')
    }
  } catch (error: any) {
    const message = error.response?.data?.message || 'ایمیل یا رمز عبور اشتباه است'
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

// تابع هندل کیبورد برای OTP - مثل دیجیتال بیزینس کارت
const handleOtpKey = async (index: number, event: KeyboardEvent) => {
  const key = event.key
  const container = otpContainer.value

  // فقط اعداد، backspace و کلیدهای ناوبری مجازند
  if (!['Backspace', 'Tab', 'ArrowLeft', 'ArrowRight'].includes(key) && !/^[0-9]$/.test(key)) {
    event.preventDefault()
    return
  }

  // Backspace logic
  if (key === 'Backspace') {
    otp.value[index] = ''
    if (index > 0 && container) {
      (container.children[index - 1] as HTMLInputElement)?.focus()
    }
    event.preventDefault()
    return
  }

  // Numeric input
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

// تابع هندل کیبورد برای 2FA
const handle2FAKey = async (index: number, event: KeyboardEvent) => {
  const key = event.key
  const container = otpContainer2FA.value

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
      await verify2FACode()
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

  // فوکوس روی آخرین خونه یا خونه بعدی خالی
  const nextEmptyIndex = otp.value.findIndex(d => d === '')
  if (nextEmptyIndex !== -1 && container) {
    (container.children[nextEmptyIndex] as HTMLInputElement)?.focus()
  } else if (container) {
    (container.children[otp.value.length - 1] as HTMLInputElement)?.focus()
    verifyOtpCode()
  }
}

const handlePaste2FA = (event: ClipboardEvent) => {
  event.preventDefault()
  const pastedData = event.clipboardData?.getData('text') || ''
  const digits = pastedData.replace(/\D/g, '').slice(0, 4)
  const container = otpContainer2FA.value
  
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
    verify2FACode()
  }
}

const verifyOtpCode = async () => {
  const fullCode = otp.value.join('')
  
  if (fullCode.length !== 4) {
    return
  }

  isLoading.value = true

  try {
    const response = await axios.post('/auth/admin/verifyOtpEmail', {
      email: email.value.trim().toLowerCase(),
      code: fullCode
    })

    if (response.data?.token) {
      authStore.setToken(response.data.token)
      // منتظر بمون تا token ست بشه
      await nextTick()
      showInfoToast('ورود موفقیت‌آمیز بود', 'ti-check')
      // یک تاخیر کوتاه بذار
      setTimeout(() => {
        window.location.href = '/'
      }, 500)
    } else {
      otpError.value = true
      otp.value = ['', '', '', '']
      const container = otpContainer.value
      if (container) (container.children[0] as HTMLInputElement)?.focus()
      showInfoToast(response.data?.message || 'کد وارد شده صحیح نیست', 'ti-alert-triangle')
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

const verify2FACode = async () => {
  const fullCode = otp.value.join('')
  
  if (fullCode.length !== 4) {
    return
  }

  isLoading.value = true

  try {
    const response = await axios.post('/auth/admin/verify2FA', {
      email: email.value.trim().toLowerCase(),
      code: fullCode
    })

    if (response.data?.token) {
      authStore.setToken(response.data.token)
      await nextTick()
      showInfoToast('ورود موفقیت‌آمیز بود', 'ti-check')
      setTimeout(() => {
        window.location.href = '/'
      }, 500)
    } else {
      otpError.value = true
      otp.value = ['', '', '', '']
      const container = otpContainer2FA.value
      if (container) (container.children[0] as HTMLInputElement)?.focus()
      showInfoToast(response.data?.message || 'کد وارد شده صحیح نیست', 'ti-alert-triangle')
    }
  } catch (error: any) {
    otpError.value = true
    otp.value = ['', '', '', '']
    const container = otpContainer2FA.value
    if (container) (container.children[0] as HTMLInputElement)?.focus()
    const message = error.response?.data?.message || 'خطایی در تایید کد رخ داد'
    showInfoToast(message, 'ti-alert-triangle')
  } finally {
    isLoading.value = false
  }
}

const resendCode = async () => {
  await submitEmail()
}

const resend2FACode = async () => {
  otp.value = ['', '', '', '']
  otpError.value = false
  await submitPassword()
}

const goBack = () => {
  step.value = 'email'
  otp.value = ['', '', '', '']
  otpError.value = false
  countdown.value = 0
}

const goBackToPassword = () => {
  step.value = 'password'
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