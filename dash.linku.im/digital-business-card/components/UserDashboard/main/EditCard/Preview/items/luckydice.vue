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
      @click.prevent="openGame"
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
          {{ link.displayName || link.title || link.name || link.value || link.id || 'تاس شانس' }}
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
            <h3 class="text-lg font-semibold text-gray-800">{{ link.displayName || link.title || link.name || link.value || link.id || 'تاس شانس' }}</h3>
          </div>
          <button 
            @click="showGame = false" 
            class="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <i class="ti ti-x text-lg"></i>
          </button>
        </div>
      </template>
      <template #default>
        <div class="flex-1 items-center h-full overflow-y-auto p-4 text-center">
          <!-- فرم احراز هویت - فقط اگر phoneRequired فعال باشه -->
          <AuthForm
            v-if="(authStep === 'phone' || authStep === 'code') && link?.phoneRequired !== false"
            game-icon="🎲"
            game-title="تاس شانس"
            :auth-step="authStep"
            v-model:phone-number="phoneNumber"
            v-model:code-inputs="codeInputs"
            :countdown="countdown"
            @submit-phone="submitPhone"
            @submit-code="submitCode"
            @cancel-auth="cancelAuth"
          />

          <!-- بازی تاس (حالت اولیه و بعد از احراز هویت) -->
          <div v-else-if="authStep === 'authenticated' || link?.phoneRequired === false" class="flex flex-col items-center justify-center py-4 px-4 text-center">
            <div class="w-full flex flex-col items-center py-8 px-4 text-center">
          <div class="dice mb-4 flex items-center justify-center gap-4 h-full">
            <ol
              class="die-list"
              :class="[rollParity ? 'odd-roll' : 'even-roll']"
              :data-roll="dice1"
              id="die-1"
              @click="rollDice"
            >
              <li v-for="n in 6" :key="n" class="die-item" :data-side="n">
                <span v-for="d in getDots(n)" :key="d" class="dot" :style="{ backgroundColor: getDotColor(), boxShadow: 'inset -0.15rem 0.15rem 0.25rem rgba(0,0,0,0.5)' }"></span>
              </li>
            </ol>
            <ol
              class="die-list"
              :class="[!rollParity ? 'odd-roll' : 'even-roll']"
              :data-roll="dice2"
              id="die-2"
              @click="rollDice"
            >
              <li v-for="n in 6" :key="n" class="die-item" :data-side="n">
                <span v-for="d in getDots(n)" :key="d" class="dot" :style="{ backgroundColor: getDotColor(), boxShadow: 'inset -0.15rem 0.15rem 0.25rem rgba(0,0,0,0.5)' }"></span>
              </li>
            </ol>
          </div>

          <!-- دکمه -->
          <button
            class="px-8 py-3 rounded-2xl font-bold text-lg transition-all duration-300 shadow-2xl hover:shadow-3xl transform hover:scale-105 active:scale-95 text-white relative overflow-hidden flex items-center justify-center gap-2"
            :style="{ background: `linear-gradient(135deg, ${formStore.iconColor?.background || '#8B5CF6'} 0%, ${adjustOpacity(formStore.iconColor?.background || '#8B5CF6', 0.8)} 100%)` }"
            @click="rollDice"
          >
            <i class="ti ti-dice text-xl"></i>
            <span>🎲 امتحان شانس!</span>
            <div class="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0 hover:opacity-20 transition-opacity duration-500"></div>
          </button>

          <!-- نمایش نتیجه و کد قرعه‌کشی -->
          <div v-if="result" class="mt-6 w-full flex flex-col items-center justify-center">
            <div class="text-6xl mb-4">
              <i :class="result.includes('برنده نشدی') ? 'ti ti-mood-sad text-red-500' : 'ti ti-trophy text-yellow-500 drop-shadow-lg'"></i>
            </div>
            <div v-if="!result.includes('برنده نشدی')" class="mb-4">
              <div class="text-2xl font-black mb-2 bg-gradient-to-r from-yellow-600 via-orange-500 to-red-500 bg-clip-text text-transparent">
                🎉 تبریک میگم! 🎉
              </div>
              <div class="text-base text-gray-700 font-bold">
                شما برنده خوش شانس ما هستید!
              </div>
            </div>
            <div v-else class="text-xl font-bold mb-3 text-red-600">
              متاسفانه! 😔
            </div>
            <div class="mb-6">
              <div v-if="!result.includes('برنده نشدی') && prize" class="bg-gradient-to-r from-yellow-500 to-orange-500 text-white rounded-xl p-4 mb-3">
                <div class="text-xs font-medium mb-2 opacity-90 flex items-center justify-center gap-1">
                  <i class="ti ti-trophy text-sm"></i>
                  جایزه شما
                </div>
                <div class="text-lg font-mono font-bold tracking-wider bg-white/20 rounded-lg px-3 py-2 text-center select-all">
                  {{ prize }}
                </div>
              </div>
              <div v-else class="text-lg font-bold text-gray-800 bg-gray-100 rounded-xl p-3">
                {{ result }}
              </div>
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
import {computed, onMounted, ref} from 'vue'
import {useFormStore} from '~/stores/form'
import confetti from 'canvas-confetti'
import BaseModalGame from './Modals/BaseModalGame.vue'
import AuthForm from './Modals/AuthForm.vue'
import {useIconComponents} from '~/composables/useIconComponentsMap'
import {useOtpService} from '~/composables/useOtpService'
import {useNuxtApp} from "#app";
const emit=defineEmits('message')
const props = defineProps({ 
  link: { type: Object, default: () => ({}) },
  isListMode: { type: Boolean, default: false },
  isDarkTheme: { type: Boolean, default: false },
  isLightTheme: { type: Boolean, default: false },
  isBackgroundDark: { type: Boolean, default: false }
})
const link = props.link || {}

// دسترسی به store
const formStore = useFormStore()
const formData = computed(() => formStore)

const { sendOtpCode, verifyOtpCode } = useOtpService()
const { $axios } = useNuxtApp()
// دسترسی به composable
const { getIconComponent } = useIconComponents()

// Get icon data and component
const iconData = computed(() => props.link?.icon || null)

const iconComponent = computed(() => {
  if (iconData.value?.type === 'component' && iconData.value?.name) {
    return getIconComponent(iconData.value.name)
  }
  // Default to luckydice component
  return getIconComponent('luckydice')
})

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

const showGame = ref(false)
const dice1 = ref(1)
const dice2 = ref(1)
const result = ref('')
const prize = ref('')
const phoneNumber = ref('')
const hasPlayed = ref(false)
const authStep = ref('none')
const codeInputs = ref(['', '', '', ''])
const countdown = ref(0)
const rolling = ref(false)
const rollParity = ref(false)

const rollSound = new Audio('/sounds/roll.mp3')

/*const rewards = [
  '🎉 جفت ۶: برنده شدی!',
  '🎉 جفت ۵: برنده شدی!',
  '🎉 جفت ۴: برنده شدی!',
  '🎉 جفت ۳: برنده شدی!',
  '🎉 جفت ۲: برنده شدی!',
  '🎉 جفت ۱: برنده شدی!',
  'متاسفانه اینبار برنده نشدی!'
]*/
const rewards = ref([])

const getDots = n => Array.from({ length: n }, (_, i) => i + 1)

// تابع گرفتن رنگ نقطه‌های تاس بر اساس تم پروفایل
const getDotColor = () => {
  const color = props.link?.iconColor?.background
  if (color && color !== 'transparent' && color !== '') {
    return color
  }
  return '#3B82F6' // آبی پیش‌فرض به جای مشکی
}

const adjustOpacity = (hex, opacity) => {
  if (!hex || !hex.startsWith('#')) return hex
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  return `rgba(${r}, ${g}, ${b}, ${opacity})`
}

// تابع پخش کاغذ رنگی برای برنده
const launchWinConfetti = () => {
  const themeColor = getDotColor()
  const colors = [themeColor, '#FFD700', '#FF6B6B', '#4ECDC4', '#45B7D1']
  
  // پخش از چپ و راست
  confetti({
    particleCount: 100,
    spread: 70,
    origin: { x: 0.1, y: 0.6 },
    colors: colors
  })
  
  confetti({
    particleCount: 100,
    spread: 70,
    origin: { x: 0.9, y: 0.6 },
    colors: colors
  })
  
  // پخش از وسط
  setTimeout(() => {
    confetti({
      particleCount: 150,
      spread: 100,
      origin: { y: 0.5 },
      colors: colors
    })
  }, 200)
}

const rollDice = async () => {
  // اگر شماره موبایل غیرفعال باشه، مستقیماً بازی رو شروع کن
  if (props.link?.phoneRequired === false) {
    authStep.value = 'authenticated'
    phoneNumber.value = 'guest_' + Date.now() // شماره مهمان برای تمایز
  } else {
    const canPlay = await checkForPlay()
    if (!canPlay) {
      return
    }
  }
  
  // اگر احراز هویت نشده، ابتدا به مرحله وارد کردن شماره موبایل برو
  if (authStep.value === 'none') {
    authStep.value = 'phone'
    return
  }

  // اگر در مرحله وارد کردن کد هست، نباید بتونه تاس بزنه
  if (authStep.value === 'phone' || authStep.value === 'code') {
    return
  }

  if (rolling.value || hasPlayed.value) return
  rolling.value = true
  rollSound.currentTime = 0
  rollSound.play()
  rollParity.value = !rollParity.value
  setTimeout(async () => {
    let result1 = Math.floor(Math.random() * 6) + 1
    let result2 = Math.floor(Math.random() * 6) + 1
    dice1.value = result1
    dice2.value = result2
    if (result1 === result2) {

      result.value = String(result1)

      launchWinConfetti()

    } else {
      result.value = 'متاسفانه اینبار برنده نشدی!'
    }
    hasPlayed.value = true

    await sendResultToBackend()

    rolling.value = false
  }, 1000)
}
// احراز هویت ساده (شماره موبایل و کد تستی)
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

// ✅ تابع باز کردن بازی - تنظیم صحیح authStep
const openGame = () => {
  showGame.value = true
  
  // اگر authStep هنوز none هست، باید تنظیمش کنیم
  if (authStep.value === 'none') {
    // اگر شماره موبایل غیرفعال باشه، مستقیم authenticated کن
    if (props.link?.phoneRequired === false) {
      authStep.value = 'authenticated'
      phoneNumber.value = 'guest_' + Date.now()
    } else {
      // شروع فرم شماره موبایل
      authStep.value = 'phone'
    }
  }
}

const cancelAuth = () => {
  authStep.value = 'none'
  codeInputs.value = ['', '', '', '']
  countdown.value = 0
}
const checkForPlay = async () => {
  try {
    const response = await $axios.get(`club/${props.link?.hash}/luckyDice/check`)
    emit('message',response.data.message || '')
    return response.status === 200
  } catch (error) {
    if (error.response?.status === 403) {
      emit('message',error.response.data.message || '')
      return false
    }
    // در صورت خطای غیرمنتظره (مثلاً قطع اینترنت)
    emit('message','خطا در بررسی وضعیت بازی')
    return false
  }
}

const sendResultToBackend = async () => {
  try {
    const payload = {
      phone: phoneNumber.value,
      result: result.value, // عددی مثل "1" تا "6" یا "متاسفانه اینبار برنده نشدی!"
    }

    const response = await $axios.post(`club/${props.link?.hash}/luckyDice/result`, payload)


    // ✅ جایزه برگشتی از بک‌اند رو در result.value بریز
    if (response.data?.data?.reward?.value) {
      prize.value = response.data.data.reward.value
    }
    result.value=response.data.data.result.result

  } catch (error) {
  }
}

</script>

<style scoped>
/* همه‌ی استایل‌هایی که قبلاً دادی به‌درستی اعمال می‌شن */
.dice {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  gap: 1.5rem;
  padding: 0.5rem 0;
  perspective: 200px;
  min-height: 6rem;
}
.die-list {
  height: 4rem;
  width: 4rem;
  min-width: 4rem;
  min-height: 4rem;
  list-style-type: none;
  position: relative;
  transform-style: preserve-3d;

}
.die-item {
  background-color: #fefefe;
  border-radius: 10px;
  box-shadow: inset -0.35rem 0.35rem 0.75rem rgba(104, 104, 104, 0.3), inset 0.5rem -0.25rem 0.5rem rgba(0, 0, 0, 0.15);
  display: grid;
  grid-template-areas: "one two three" "four five six" "seven eight nine";
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: repeat(3, 1fr);
  height: 100%;
  padding: 4px;
  position: absolute;
  width: 100%;
}
.dot {
  align-self: center;
  border-radius: 50%;
  display: block;
  height: 13px;
  justify-self: center;
  width: 13px;
}
.even-roll {
  transition: transform 0.95s ease-out;
}
.odd-roll {
  transition: transform 0.85s ease-out;
}
.even-roll[data-roll="1"] { transform: rotateX(360deg) rotateY(720deg) rotateZ(360deg); }
.even-roll[data-roll="2"] { transform: rotateX(450deg) rotateY(720deg) rotateZ(360deg); }
.even-roll[data-roll="3"] { transform: rotateX(360deg) rotateY(630deg) rotateZ(360deg); }
.even-roll[data-roll="4"] { transform: rotateX(360deg) rotateY(810deg) rotateZ(360deg); }
.even-roll[data-roll="5"] { transform: rotateX(270deg) rotateY(720deg) rotateZ(360deg); }
.even-roll[data-roll="6"] { transform: rotateX(360deg) rotateY(900deg) rotateZ(360deg); }
.odd-roll[data-roll="1"] { transform: rotateX(-360deg) rotateY(-720deg) rotateZ(-360deg); }
.odd-roll[data-roll="2"] { transform: rotateX(-270deg) rotateY(-720deg) rotateZ(-360deg); }
.odd-roll[data-roll="3"] { transform: rotateX(-360deg) rotateY(-810deg) rotateZ(-360deg); }
.odd-roll[data-roll="4"] { transform: rotateX(-360deg) rotateY(-630deg) rotateZ(-360deg); }
.odd-roll[data-roll="5"] { transform: rotateX(-450deg) rotateY(-720deg) rotateZ(-360deg); }
.odd-roll[data-roll="6"] { transform: rotateX(-360deg) rotateY(-900deg) rotateZ(-360deg); }
[data-side="1"] { transform: rotate3d(0, 0, 0, 90deg) translateZ(2rem); }
[data-side="2"] { transform: rotate3d(-1, 0, 0, 90deg) translateZ(2rem); }
[data-side="3"] { transform: rotate3d(0, 1, 0, 90deg) translateZ(2rem); }
[data-side="4"] { transform: rotate3d(0, -1, 0, 90deg) translateZ(2rem); }
[data-side="5"] { transform: rotate3d(1, 0, 0, 90deg) translateZ(2rem); }
[data-side="6"] { transform: rotate3d(1, 0, 0, 180deg) translateZ(2rem); }
/* موقعیت دایره‌ها */
[data-side="1"] .dot:nth-of-type(1) { grid-area: five; }
[data-side="2"] .dot:nth-of-type(1) { grid-area: one; }
[data-side="2"] .dot:nth-of-type(2) { grid-area: nine; }
[data-side="3"] .dot:nth-of-type(1) { grid-area: one; }
[data-side="3"] .dot:nth-of-type(2) { grid-area: five; }
[data-side="3"] .dot:nth-of-type(3) { grid-area: nine; }
[data-side="4"] .dot:nth-of-type(1) { grid-area: one; }
[data-side="4"] .dot:nth-of-type(2) { grid-area: three; }
[data-side="4"] .dot:nth-of-type(3) { grid-area: seven; }
[data-side="4"] .dot:nth-of-type(4) { grid-area: nine; }
[data-side="5"] .dot:nth-of-type(1) { grid-area: one; }
[data-side="5"] .dot:nth-of-type(2) { grid-area: three; }
[data-side="5"] .dot:nth-of-type(3) { grid-area: five; }
[data-side="5"] .dot:nth-of-type(4) { grid-area: seven; }
[data-side="5"] .dot:nth-of-type(5) { grid-area: nine; }
[data-side="6"] .dot:nth-of-type(1) { grid-area: one; }
[data-side="6"] .dot:nth-of-type(2) { grid-area: three; }
[data-side="6"] .dot:nth-of-type(3) { grid-area: four; }
[data-side="6"] .dot:nth-of-type(4) { grid-area: six; }
[data-side="6"] .dot:nth-of-type(5) { grid-area: seven; }
[data-side="6"] .dot:nth-of-type(6) { grid-area: nine; }
</style>
