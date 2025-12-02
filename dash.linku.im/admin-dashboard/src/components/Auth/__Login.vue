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
      <!-- مرحله ورود شماره -->
      <template v-if="step === 'phone'">
        <div class="text-center mb-8">
          <h1 class="text-xl font-bold mb-2 text-gray-900 dark:text-white">شماره تلفن</h1>
          <p class="text-sm text-gray-500 dark:text-gray-500">لطفاً کشور را انتخاب و سپس شماره رو وارد کنید</p>
        </div>

        <!-- کشور -->
        <div class="w-full mb-4 relative">
          <label
              class="absolute rtl:right-4 ltr:left-4 -top-2.5 bg-white dark:bg-slate-800 text-sm px-1 text-gray-600 dark:text-gray-400">کشور</label>
          <div
              class="flex items-center bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 text-gray-900 dark:text-white rounded-lg px-4 py-4">
              <span class="rtl:ml-2 ltr:mr-2">
                <img src="/src/assets/images/IR.svg" class="w-5 h-4" alt="flag"/>
              </span>
            <span class="flex-1 text-gray-900 dark:text-white">ایران</span>
            <i class="ti ti-chevron-left ltr:-rotate-180 w-4 h-4 rtl:mr-auto ltr:ml-auto text-gray-500 dark:text-gray-500"></i>
          </div>
        </div>

        <!-- شماره موبایل -->
        <div class="w-full mb-6 relative">
          <span
              class="absolute text-gray-500 dark:text-gray-500 border-gray-200 dark:border-slate-700 border-r left-2 py-3.5 pt-4 px-2">۹۸+</span>
          <input
              id="phoneInput"
              type="tel"
              inputmode="numeric"
              pattern="[0-9]*"
              maxlength="11"
              placeholder=" "
              v-model="phone"
              class="peer w-full px-4 py-4 pl-16 text-sm bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 text-gray-900 dark:text-white rounded-lg text-left focus:outline-none transition-colors duration-300"
              :class="[phoneError ? 'border-red-500' : '', phone && !phoneError ? 'focus:border-blue-500' : '']"
          />
          <label
              for="phoneInput"
              class="absolute rtl:right-4 ltr:left-4 top-3 text-sm text-gray-500 dark:text-gray-500 bg-white dark:bg-slate-800 px-1 z-10 transition-colors duration-300 cursor-pointer
                     peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2
                     peer-focus:top-1 peer-focus:text-xs peer-focus:-translate-y-1/2 peer-focus:text-blue-500">
            شماره موبایل
          </label>
        </div>

        <!-- دکمه ادامه -->
        <button
            @click="submitPhone"
            class="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-lg text-lg font-medium flex items-center justify-center transition-colors duration-300 relative"
        >
          <i class="ti ti-chevron-left absolute ltr:right-4 rtl:left-4 text-white text-2xl px-4"/>
          <span>ادامه</span>
        </button>
      </template>

      <!-- مرحله ورود کد تایید -->
      <template v-else>
        <h2 class="text-xl font-bold text-center mb-2 text-gray-900 dark:text-white">کد تایید</h2>
        <p class="text-sm text-gray-500 dark:text-gray-500 text-center mb-6">
          لطفاً کد ارسال شده به<br/>
          شماره {{ formattedPhone }} را وارد کنید
        </p>

        <!-- ورودی کد -->
        <div class="flex justify-center gap-2 flex-row-reverse">
          <input
              v-for="(digit, index) in otp"
              :key="index"
              v-model="otp[index]"
              type="text"
              maxlength="1"
              inputmode="numeric"
              autocomplete="one-time-code"
              placeholder="-"
              class="w-14 h-14 text-xl font-semibold text-center bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:border-blue-500 transition-colors duration-300"
              @input="handleInput(index, $event)"
              @keydown.backspace="handleBackspace(index)"
              :ref="el => otpRefs[index] = el as HTMLInputElement"
          />
        </div>

        <!-- تایمر -->
        <div class="flex justify-center items-center py-4 text-sm text-gray-600 dark:text-gray-400">
          <div class="text-right">
            <span class="font-bold inline-block text-gray-700" dir="ltr">{{ countdown }}</span>
            <strong class="mr-2 text-gray-700">ثانیه مانده تا ارسال مجدد کد</strong>
          </div>
        </div>
      </template>
    </div>
  </div>
  <InfoToast :visible="showToast" :message="toastMessage" :icon="toastIcon"/>
</template>

<script setup lang="ts">
import {ref, computed, onMounted, getCurrentInstance} from 'vue'
import Toast from '@/components/Toast.vue'
import {useDarkMode} from '@/composables/useDarkMode'
import {useAuthStore} from "@/stores/auth.ts";
import InfoToast from "@/components/InfoToast.vue";
import {useRouter} from "vue-router";

defineOptions({
  name: 'LoginComponent'
})

const step = ref('phone')
const {isDarkMode, toggleDarkMode, initDarkMode} = useDarkMode()
const phone = ref('')
const phoneError = ref(false)
const password = ref('')
const passwordError = ref(false)
const activeTab = ref('otp') // 'otp' برای کد یکبار مصرف، 'password' برای رمز عبور
const {appContext} = getCurrentInstance()!
const axios = appContext.config.globalProperties.$axios
const authStore = useAuthStore()
const timer = ref(120)
const isResendEnabled = ref(false)
const showToast = ref(false)
const toastMessage = ref('')
const toastIcon = ref('ti-alert-triangle') // یا 'ti-lock', 'ti-check', هر چی خواستی
const showInfoToast = (message: string, icon = 'ti-lock') => {
  toastMessage.value = message
  toastIcon.value = icon
  showToast.value = true
  setTimeout(() => showToast.value = false, 3000) // بعد از ۳ ثانیه بسته می‌شه
}
const otp = ref(['', '', '', ''])
const otpRefs = ref<Array<HTMLInputElement | null>>([])
const countdown = ref(120)

const formattedPhone = computed(() => {
  const cleaned = phone.value.startsWith('0') ? phone.value.slice(1) : phone.value
  return `+98${cleaned}`
})

const switchTab = (tab:any) => {
  activeTab.value = tab
  // reset errors when switching tabs
  phoneError.value = false
  passwordError.value = false
}
const submitPhone = async () => {
  const cleaned = toEnglishDigits(phone.value).replace(/^0/, '')
  const regex = /^9\d{9}$/
  phoneError.value = !regex.test(cleaned)

  if (phoneError.value) {
    // نمایش خطا: شماره موبایل وارد شده معتبر نیست
    return
  }

  phone.value = cleaned

  if (activeTab.value === 'otp') {
    // ارسال کد یکبار مصرف
    try {
      const success = await sendOtpCode(phone.value)
      if (success) {
        step.value = 'otp'
        startTimer()
      } else {
        phoneError.value = false
        //errors.phone = 'ارسال کد تأیید ناموفق بود. لطفاً دوباره تلاش کنید.'
      }
    } catch (error) {
      phoneError.value = false
      //errors.phone = 'خطایی رخ داد. لطفاً بعداً دوباره تلاش کنید.'
    }
  } else {
    // ورود با رمز عبور
    if (!password.value.trim()) {
      passwordError.value = true
      return
    }
    // اینجا می‌توانید منطق ورود با رمز عبور را پیاده‌سازی کنید
    console.log('Login with password:', {phone: phone.value, password: password.value})
  }
}

function startTimer() {
  timer.value = 120
  isResendEnabled.value = false
  const interval = setInterval(() => {
    if (timer.value > 0) {
      timer.value--
    } else {
      isResendEnabled.value = true
      clearInterval(interval)
      step.value = 'otp'
    }
  }, 1000)
}

const router = useRouter()
const handleInput = async (index: any, event: any) => {
  const target = event.target as HTMLInputElement;
  const value = target.value
  if (!/^\d$/.test(value)) {
    otp.value[index] = ''
    return
  }
  otp.value[index] = value
  if (index < otp.value.length - 1 && otpRefs.value[index + 1]) {
    otpRefs.value[index + 1]?.focus()
  }

  if (otp.value.every(d => d !== '')) {
    const fullCode = otp.value.join('')
    const {success, userExists} = await verifyOtpCode(fullCode)
    if (success) {
      ////
      if (userExists) {
        await router.push('/')
      }
    }
  }
}

const handleBackspace = (index:any) => {
  if (!otp.value[index] && index > 0) {
    otpRefs.value[index - 1]?.focus()
  }
}

onMounted(() => {
  initDarkMode()

  const timer = setInterval(() => {
    if (countdown.value > 0) countdown.value--
    else clearInterval(timer)
  }, 1000)
})


function toEnglishDigits(str: string): string {
  return str.replace(/[۰-۹]/g, d => String('۰۱۲۳۴۵۶۷۸۹'.indexOf(d)))
}

async function sendOtpCode(normalized: string): Promise<boolean> {
  authStore.setToken('')

  try {
    const response = await axios.post('auth/sendOtpCode', {
      phone: toEnglishDigits(normalized),
      countryCode: '+98',
    })
    if (response.data && response.data.success === true) {
      return true;
    }
    showInfoToast(response.data.message);

    return false;

  } catch (error: any) {
    if (error.response && error.response.data && error.response.data.message) {
      showInfoToast(error.response.data.message);
    } else {
      showInfoToast('مشکلی در ارتباط با سرور وجود دارد.', 'ti-alert-triangle');
    }

    return false;
  }
}
async function verifyOtpCode(fullCode: string): Promise<{ success: boolean; userExists: boolean }> {
  try {
    const response = await axios.post('/auth/verifyOtpCode', {
      type: 'admin_authenticate',
      code: fullCode,
      phone: toEnglishDigits(phone.value.trim()).replace(/\D/g, '').replace(/^0/, ''),
      countryCode: '+98',
    })

    const token = response.data.token
    if (typeof token === 'string') {
      authStore.setToken(token)
    }

    if (response.status === 200) {
      return {success: true, userExists: true}
    }

    return {success: false, userExists: false}
  } catch (error: any) {
    if (error.response && error.response.data.message) {

      showInfoToast(error.response.data.message);
    } else {
      showInfoToast('مشکلی در برقراری ارتباط با سرور وجود دارد.', 'ti-alert-triangle');
    }
    return {success: false, userExists: false}
  }
}


</script>
