<template>
  <div :class="isListMode ? 'w-full' : ''">
    <a
      v-if="!showGame"
      :class="[
        isListMode
          ? 'flex items-center gap-4 backdrop-blur rounded-xl p-2 w-full cursor-pointer ' + (formData?.layout === 'left' ? 'text-left' : 'text-right')
          : 'rounded-xl text-center p-2 flex flex-col items-center justify-center transition hover:shadow-md backdrop-blur cursor-pointer',
        isDarkTheme ? 'bg-white/[0.02]' : isLightTheme ? 'bg-black/[0.02]' : 'bg-gradient-to-br from-white/60 via-white/30 to-white/10 border border-white/20'
      ]"
      @click.prevent="showGame = true"
      tabindex="0"
      role="button"
    >
      <div :class="[
        isListMode ? 'flex-shrink-0 rounded-xl flex items-center overflow-hidden w-[54px] h-[54px]' : 'w-[54px] h-[54px] rounded-xl flex items-center justify-center mb-2 overflow-hidden',
        isDarkTheme || isLightTheme ? '' : 'bg-gray-100'
      ]">
        <img
          v-if="link?.customIcon"
          :src="link.customIcon"
          class="w-full h-full object-contain"
          alt="custom icon"
        />
        <component 
          v-else
          :is="iconComponent"
          :size="50"
          v-bind="iconColor ? { color: iconColor, filled: isIconFilled } : {}"
        />
      </div>
      <div :class="isListMode ? 'flex flex-col justify-center flex-1 min-w-0 ' + (formData?.layout === 'left' ? 'text-left' : 'text-right') : 'w-full text-center mt-0 flex-1 flex flex-col justify-center'">
        <div :class="[
          isListMode ? 'font-bold text-[14px] leading-snug break-words ' + (formData?.layout === 'left' ? 'text-left' : 'text-right') : 'font-bold text-[15px] leading-snug text-center break-words',
          isDarkTheme ? 'text-white' : 'text-gray-800'
        ]">
          {{ link.displayName || link.title || link.name || link.value || link.id || 'تخم‌مرغ شانس' }}
        </div>
        <div v-if="isListMode && link.description && link.description.trim()"
             :class="[
               'text-xs font-normal mt-1 leading-relaxed whitespace-pre-line break-words ' + (formData?.layout === 'left' ? 'text-left' : 'text-right'),
               isDarkTheme ? 'text-gray-300' : 'text-gray-600'
             ]">
          {{ link.description }}
        </div>
      </div>
    </a>
    <BaseModalGame v-model="showGame">
      <template #header>
        <div class="flex justify-between items-center p-4 border-b border-gray-100 bg-white">
          <div class="flex items-center gap-3">
            <img
              v-if="link?.customIcon"
              :src="link.customIcon"
              class="w-12 h-12 object-contain"
              alt="custom icon"
            />
            <component 
              v-else
              :is="iconComponent"
              :size="50"
              v-bind="iconColor ? { color: iconColor, filled: isIconFilled } : {}"
            />
            <h3 class="text-lg font-semibold text-gray-800">{{ link.displayName || link.title || link.name || link.value || link.id || 'تخم‌مرغ شانس' }}</h3>
          </div>
          <button
            @click="showGame = false"
            class="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <i class="ti ti-x text-lg" />
          </button>
        </div>
      </template>
      <template #default>
        <div class="flex-1 overflow-y-auto p-4 text-center">
          <div class="flex flex-col items-center justify-center py-4 px-4 text-center">

            <!-- فرم احراز هویت -->
            <AuthForm
              v-if="authStep === 'phone' || authStep === 'code'"
              game-icon="🥚"
              game-title="تخم‌مرغ شانس"
              :auth-step="authStep"
              v-model:phone-number="phoneNumber"
              v-model:code-inputs="codeInputs"
              :countdown="countdown"
              @submit-phone="submitPhone"
              @submit-code="submitCode"
              @cancel-auth="cancelAuth"
            />            <!-- نمایش تخم‌مرغ و دکمه امتحان شانس فقط اگر نتیجه وجود ندارد و احراز هویت شده -->
            <template v-else-if="!result && authStep === 'authenticated'">
              <div class="mb-4 relative w-40 h-52">
                <EggIcon
                  :variant="eggVariant"
                  :is-shaking="isShaking"
                  class="w-full h-full cursor-pointer transition-all duration-300"
                  @click="handleEggClick"
                />
              </div>
              <div class="text-lg font-bold text-gray-800 mb-2"
                   :class="formData?.layout === 'left' ? 'text-left' : 'text-right'">{{ link.title || 'تخم‌مرغ شانس' }}</div>
              <div class="text-sm text-gray-500 mb-4"
                   :class="formData?.layout === 'left' ? 'text-left' : 'text-right'">
                {{ link.description || 'روی تخم‌مرغ بزن یا گوشی را تکان بده و شانس خودت را امتحان کن!' }}
              </div>
              <button
                class="bg-orange-500 text-white px-6 py-2 rounded-full font-bold shadow hover:bg-orange-600 transition"
                @click="handleEggClick"
                :disabled="hasPlayed"
              >
                امتحان شانس!
              </button>
            </template>

            <!-- دکمه شروع بازی اگر احراز هویت نشده -->
            <template v-else-if="!result && authStep === 'none'">
              <div class="mb-4 relative w-40 h-52">
                <EggIcon
                  variant="normal"
                  class="w-full h-full opacity-50"
                />
              </div>
              <div class="text-lg font-bold text-gray-800 mb-2"
                   :class="formData?.layout === 'left' ? 'text-left' : 'text-right'">{{ link.title || 'تخم‌مرغ شانس' }}</div>
              <div class="text-sm text-gray-500 mb-4"
                   :class="formData?.layout === 'left' ? 'text-left' : 'text-right'">
                {{ link.description || 'برای شرکت در بازی، ابتدا احراز هویت کنید' }}
              </div>
              <button
                class="bg-black text-white px-6 py-3 rounded-xl font-bold shadow hover:bg-gray-800 transition"
                @click="startAuth"
              >
                شروع بازی
              </button>
            </template>

        <!-- نمایش نتیجه و کد قرعه‌کشی (فقط بعد از بازی) -->
        <div v-if="result" class="mt-6 w-full flex flex-col items-center justify-center">
          <div class="text-6xl mb-4">
            <i :class="result.includes('برنده نشدی') ? 'ti ti-mood-sad text-red-500' : 'ti ti-trophy text-yellow-500 drop-shadow-lg'" />
          </div>
          <div v-if="!result.includes('برنده نشدی')" class="mb-4">
            <div class="text-2xl font-black mb-2 bg-gradient-to-r from-yellow-600 via-orange-500 to-red-500 bg-clip-text text-transparent"
                 :class="formData?.layout === 'left' ? 'text-left' : 'text-right'">
              🎉 تبریک میگم! 🎉
            </div>
            <div class="text-base text-gray-700 font-bold"
                 :class="formData?.layout === 'left' ? 'text-left' : 'text-right'">
              شما برنده خوش شانس ما هستید!
            </div>
          </div>
          <div v-else class="text-xl font-bold mb-3 text-red-600"
               :class="formData?.layout === 'left' ? 'text-left' : 'text-right'">
            متاسفانه! 😔
          </div>
          <div class="mb-6">
            <div v-if="!result.includes('برنده نشدی') && prize" class="bg-gradient-to-r from-yellow-500 to-orange-500 text-white rounded-xl p-4 mb-3 shadow-lg">
              <div class="text-xs font-medium mb-2 opacity-90 flex items-center justify-center gap-1">
                <i class="ti ti-trophy text-sm" />
                جایزه شما
              </div>
              <div class="text-lg font-mono font-bold tracking-wider bg-white/20 rounded-lg px-3 py-2 text-center select-all">
                {{ prize }}
              </div>
            </div>
            <div v-else class="text-lg font-bold text-gray-800 bg-gray-100 rounded-xl p-3"
                 :class="formData?.layout === 'left' ? 'text-left' : 'text-right'">
              {{ result }}
            </div>
          </div>
        </div>
      </div>
        </div>
      </template>
    </BaseModalGame>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useFormStore } from '~/stores/form'
import { useIconComponents } from '@/composables/useIconComponentsMap'
import confetti from 'canvas-confetti'
import EggIcon from '@/components/ui/EggIcon.vue'
import BaseModalGame from './Modals/BaseModalGame.vue'
import AuthForm from './Modals/AuthForm.vue'
import {useNuxtApp} from "nuxt/app";
import {useOtpService} from '~/composables/useOtpService'

const { sendOtpCode, verifyOtpCode } = useOtpService()
const { getIconComponent } = useIconComponents();
const emit=defineEmits('message')
const props = defineProps({
  link: {
    type: Object,
    default: () => ({})
  },
  isListMode: {
    type: Boolean,
    default: false
  },
  isDarkTheme: {
    type: Boolean,
    default: false
  },
  isLightTheme: {
    type: Boolean,
    default: false
  },
  isBackgroundDark: {
    type: Boolean,
    default: false
  }
})
const link = props.link || {}

// دسترسی به store
const formStore = useFormStore()
const formData = computed(() => formStore)

// Get icon data and component
const iconData = computed(() => props.link?.icon || null)

// Icon color logic - return user selected color or undefined for default SVG colors
const iconColor = computed(() => {
  // اگر کاربر رنگ انتخاب کرده، از آن استفاده کن
  if (formStore.iconColor?.background &&
      formStore.iconColor.background !== 'transparent') {
    return formStore.iconColor.background
  }
  // در غیر این صورت، undefined برگردان تا رنگ پیش‌فرض SVG استفاده شود
  return undefined
})

const isIconFilled = computed(() => {
  return !!(formStore.iconColor?.background &&
           formStore.iconColor.background !== 'transparent')
})

const iconComponent = computed(() => {
  if (!iconData.value) return null;
  return getIconComponent(iconData.value);
});

// Computed برای variant تخم‌مرغ
const eggVariant = computed(() => {
  const variant = eggClickCount.value === 0 ? 'normal' : eggClickCount.value === 1 ? 'cracked' : 'final'
  return variant
})

const showGame = ref(false)
const isShaking = ref(false)
const eggClickCount = ref(0)
const result = ref('')
const prize = ref('')
const phoneNumber = ref('')
const hasPlayed = ref(false)
const authStep = ref('none') // 'none' | 'phone' | 'code' | 'authenticated'
const codeInputs = ref(['', '', '', ''])
const countdown = ref(0)
// مدیریت صدا با error handling
const playSound = (soundPath) => {
  try {
    const audio = new Audio(soundPath)
    audio.volume = 0.5 // کم کردن صدا
    audio.play().catch(() => {
      // اگر صدا پخش نشد، ادامه بده
    })
  } catch (error) {
    // اگر فایل صوتی وجود نداشت
  }
}

// منطق دو مرحله‌ای شکستن تخم‌مرغ
const tryLuck = async () => {
  const canPlay = await checkForPlay(props.link.hash)
  if (!canPlay) {
    return
  }

  if (isShaking.value || hasPlayed.value) return

  if (eggClickCount.value < 1) {
    // اولین کلیک: ترک خوردن تخم‌مرغ
    eggClickCount.value = 1
    isShaking.value = true
    playSound('/sounds/crack.mp3')

    setTimeout(() => {
      isShaking.value = false

    }, 600)
    return
  }

  // دومین کلیک: شکستن کامل و نمایش نتیجه
  eggClickCount.value = 2
  isShaking.value = true

  playSound('/sounds/crack.mp3')

  setTimeout(async () => {
    isShaking.value = false

    hasPlayed.value = true
    result.value = 'true'
    await sendResultToBackend()

    if (prize.value) {
      //result.value = prize.value
      confetti({particleCount: 150, spread: 90, origin: {y: 0.6}})
      playSound('/sounds/win.mp3')
    } else {
      result.value = 'متاسفانه اینبار برنده نشدی!'
      playSound('/sounds/loss.mp3')
    }
  }, 600)
}

const loadUserData = () => {
  const saved = localStorage.getItem('luckyegg_user_data')
  if (saved) {
    const data = JSON.parse(saved)
    phoneNumber.value = data.phoneNumber || ''
    hasPlayed.value = data.hasPlayed || false
    if (hasPlayed.value) {
      result.value = data.lastResult || ''
      authStep.value = 'authenticated'
    }
  }
}

onMounted(() => {
  loadUserData()
})

// احراز هویت ساده (شماره موبایل و کد تستی)
const startAuth = () => {
  if (props.link?.phoneRequired === false) {
    authStep.value = 'authenticated'
    return
  }
  if (hasPlayed.value) return

  authStep.value = 'phone'
}

const submitPhone = async () => {
  authStep.value = 'code'

  /////send otp
  // phoneNumber.value از v-model پر میشه
  await sendOtpCode(phoneNumber.value)

  startCountdown()
}

const submitCode = async () => {

  ////verify otp
  // codeInputs یه آرایه ۴ رقمیه ['1','2','3','4']
  const fullCode = codeInputs.value.join('')

  const response = await verifyOtpCode(phoneNumber.value, fullCode)
  if (response) {
    authStep.value = 'authenticated'
  } else {
    alert('کد اشتباهه یا منقضی شده!')
  }
}

const startCountdown = () => {
  countdown.value = 120
  const timer = setInterval(() => {
    countdown.value--
    if (countdown.value <= 0) clearInterval(timer)
  }, 1000)
}

const cancelAuth = () => {
  authStep.value = 'none'
  codeInputs.value = ['', '', '', '']
  countdown.value = 0
}

// هندل کلیک روی تخم‌مرغ
const handleEggClick = () => {
  if (hasPlayed.value) return
  if (authStep.value !== 'authenticated') {
    startAuth()
    return
  }
  tryLuck()
}

// ریست بازی برای تست
const resetGame = () => {
  eggClickCount.value = 0
  isShaking.value = false
  result.value = ''
  prize.value = ''
  hasPlayed.value = false
  authStep.value = 'authenticated' // برای تست، کاربر احراز هویت شده باقی بماند
  codeInputs.value = ['', '', '', '']
  countdown.value = 0
}
const { $axios } = useNuxtApp()
const sendResultToBackend = async () => {

  try {
    const payload = {
      phone: phoneNumber.value,
      result: result.value, // عددی مثل "1" تا "6" یا "متاسفانه اینبار برنده نشدی!"
    }

    const response = await $axios.post(`club/${props.link?.hash}/luckyEgg/result`, payload)


    // ✅ جایزه برگشتی از بک‌اند رو در result.value بریز
    if (response.data?.data?.reward?.value) {
      prize.value = response.data.data.reward.value
    }
    result.value=response.data.data.result.result

  } catch (error) {
  }
}
const checkForPlay = async () => {
  try {
    const response = await $axios.get(`club/${props.link?.hash}/luckyEgg/check`)
    emit('message',response.data.message || '')
    return response.status === 200
  } catch (error) {
    if (error.response?.status === 403) {
      emit('message',error.response.data.message || '')
      return false
    }
    // در صورت خطای غیرمنتظره (مثلاً قطع اینترنت)
    emit('message','خطا در بررسی وضعیت بازی:')
    return false
  }
}
</script>

<style scoped>
</style>
