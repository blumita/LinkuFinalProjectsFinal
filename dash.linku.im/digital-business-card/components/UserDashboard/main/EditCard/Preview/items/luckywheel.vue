<template>
  <div :class="isListMode ? 'w-full' : ''">
    <a
      v-if="!showGame"
      v-bind="$attrs"
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
          {{ link.displayName || link.title || link.name || link.value || link.id || 'گردونه شانس' }}
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
            <h3 class="text-lg font-semibold text-gray-800">{{ link.displayName || link.title || link.name || link.value || link.id || 'گردونه شانس' }}</h3>
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
        <div class="flex-1 !overflow-y-auto h-full text-center relative" :class="result ? 'h-full' : 'p-4'">

          <!-- فرم احراز هویت -->
          <AuthForm
            v-if="authStep === 'phone' || authStep === 'code'"
            game-icon="🎰"
            game-title="گردونه شانس"
            :auth-step="authStep"
            v-model:phone-number="phoneNumber"
            v-model:code-inputs="codeInputs"
            :countdown="countdown"
            @submit-phone="submitPhone"
            @submit-code="submitCode"
            @cancel-auth="cancelAuth"
          />

          <!-- پیام محدودیت چرخش اگر قبلاً شرکت کرده -->
          <div v-else-if="authStep === 'authenticated' && hasSpun && !result" class="flex flex-col items-center justify-center py-8 px-4 h-full">
            <div class="text-4xl mb-4 text-orange-500">
              <i class="ti ti-clock"></i>
            </div>
            <h3 class="text-xl font-bold mb-4 text-gray-700">شما قبلاً شرکت کرده‌اید</h3>
            <p class="text-gray-600 text-center mb-4">
              هر شماره موبایل تنها یکبار می‌تواند در گردونه شانس شرکت کند.
            </p>
            <p class="text-sm text-gray-500">
              شماره موبایل: {{ phoneNumber }}
            </p>
          </div>

          <!-- نمایش گردونه -->
          <div v-else class="flex flex-col items-center justify-center py-6 px-4 text-center h-full">
            
            <!-- گردونه - فقط اگر نتیجه نداشته باشیم نمایش داده شود -->
            <div v-if="!result" class="relative w-72 h-72 mb-8 mx-auto">
              <div
                ref="wheelEl"
                class="wheel w-full h-full rounded-full border-4 relative overflow-hidden transition-transform"
                :style="{ 
                  transform: `rotate(${rotation}deg)`,
                  borderColor: form.iconColor?.background || '#3B82F6',
                  transitionDuration: isSpinning ? '3.5s' : '0s',
                  transitionTimingFunction: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                  willChange: isSpinning ? 'transform' : 'auto',
                  backfaceVisibility: 'hidden',
                  perspective: '1000px'
                }"
              >
                <div
                  v-for="(prize, index) in wheelItems"
                  :key="index"
                  class="wheel-segment absolute w-full h-full"
                  :style="{
                    transform: `rotate(${index * segmentAngle}deg)`,
                    backgroundColor: prize.color,
                    color: isDark(prize.color) ? '#fff' : '#222'
                  }"
                >
                  <div
                    class="absolute font-bold text-sm text-center flex flex-col items-center justify-center"
                    :style="{
                      transform: `rotate(${segmentAngle / 2}deg)`,
                      left: '65%',
                      top: '15px',
                      transformOrigin: '0 60px',
                      width: '60px',
                      marginLeft: '-25px',
                      color: isDark(prize.color) ? '#fff' : '#222'
                    }"
                  >
                    <div class="text-lg">{{ prize.name.split(' ')[0] }}</div>
                    <div class="text-xs font-medium mt-1 leading-tight">
                      {{ prize.name.split(' ').slice(1).join(' ') }}
                    </div>
                  </div>
                </div>

                <!-- دایره مرکزی -->
                <div 
                  class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-20 h-20 rounded-full z-10 border-4 shadow-lg flex items-center justify-center"
                  :style="{
                    backgroundColor: form.iconColor?.background || '#3B82F6',
                    borderColor: '#ffffff'
                  }"
                >
                  <div class="text-white text-2xl font-bold">●</div>
                </div>
              </div>

              <!-- پوینتر لوکیشن -->
              <div class="absolute -top-4 left-1/2 transform -translate-x-1/2 z-30">
                <div class="relative">
                  <!-- علامت لوکیشن -->
                  <div class="relative flex flex-col items-center">
                    <!-- دایره بالایی -->
                    <div 
                      class="w-6 h-6 rounded-full border-2 border-white shadow-lg flex items-center justify-center"
                      style="background-color: #FF8C00;"
                    >
                      <div class="w-2 h-2 bg-white rounded-full"></div>
                    </div>
                    
                    <!-- قسمت مثلثی (نوک) -->
                    <div 
                      class="relative -mt-1"
                    >
                      <div 
                        class="w-0 h-0 border-l-[8px] border-r-[8px] border-t-[12px] border-l-transparent border-r-transparent"
                        style="border-top-color: #FF8C00; filter: drop-shadow(0 2px 4px rgba(255,140,0,0.4));"
                      ></div>
                    </div>
                    
                    <!-- سایه کل -->
                    <div 
                      class="absolute top-1 left-1 w-6 h-6 rounded-full opacity-20"
                      style="background-color: #FF8C00; filter: blur(2px);"
                    ></div>
                  </div>
                </div>
              </div>
            </div>
            
            <!-- دکمه چرخش - فقط اگر نتیجه نداشته باشیم -->
            <button
              v-if="!result"
              @click="authStep === 'authenticated' ? spinWheel() : startAuth()"
              :disabled="isSpinning || hasSpun"
              class="px-8 py-3 rounded-xl font-bold text-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:scale-105 bg-black text-white hover:bg-gray-800"
            >
              {{ isSpinning ? 'در حال چرخش...' : (authStep === 'authenticated' ? 'بچرخون!' : 'شروع بازی') }}
            </button>
            
            <!-- نمایش نتیجه - جایگزین گردونه -->
            <transition 
              enter-active-class="transition-all duration-500 ease-out"
              enter-from-class="opacity-0 scale-75 translate-y-4"
              enter-to-class="opacity-100 scale-100 translate-y-0"
              leave-active-class="transition-all duration-300 ease-in"
              leave-from-class="opacity-100 scale-100"
              leave-to-class="opacity-0 scale-95"
            >
              <div v-if="result" class="absolute inset-0 flex flex-col items-center justify-center text-center overflow-hidden bg-white">

                <!-- محتوای اصلی بدون هیچ پس‌زمینه -->
                <div class="relative z-10 px-6 py-6 w-full h-full flex flex-col justify-center">

                  <!-- آیکون نتیجه -->
                  <div class="text-6xl mb-4">
                    <i :class="result.includes('برنده نشدید') || result === 'پوچ' ? 'ti ti-mood-sad text-red-500' : 'ti ti-trophy text-yellow-500 drop-shadow-lg'"></i>
                  </div>
                  
                  <!-- پیام اصلی برای برندگان -->
                  <div v-if="!result.includes('برنده نشدید') && result !== 'پوچ'" class="mb-4">
                    <div class="text-2xl font-black mb-2 bg-gradient-to-r from-yellow-600 via-orange-500 to-red-500 bg-clip-text text-transparent">
                      🎉 تبریک میگم! 🎉
                    </div>
                    <div class="text-base text-gray-700 font-bold">
                   شما برنده خوش شانس ما هستید!
                    </div>
                  </div>
                  
                  <!-- پیام اصلی برای بازندگان -->
                  <div v-else class="text-xl font-bold mb-3 text-red-600">
                    متاسفانه! 😔
                  </div>
                  
                  <!-- نتیجه جایزه -->
                  <div class="mb-6">
                    <div 
                      v-if="!result.includes('برنده نشدید') && result !== 'پوچ'"
                      class="border-yellow-300"
                    >
                      <!-- کد قرعه کشی -->
                      <div v-if="prize" class="bg-gradient-to-r from-yellow-500 to-orange-500 text-white rounded-xl p-4 mb-3 shadow-lg">
                        <div class="text-xs font-medium mb-2 opacity-90 flex items-center justify-center gap-1">
                          <i class="ti ti-trophy text-sm"></i>
                          جایزه شما
                        </div>
                        <div class="text-lg font-mono font-bold tracking-wider bg-white/20 rounded-lg px-3 py-2 text-center select-all">
                          {{ prize }}
                        </div>
                      </div>

                    </div>
                    
                    <!-- نمایش ساده برای بازندگان -->
                    <div 
                      v-else
                      class="text-lg font-bold text-gray-800 bg-gray-100 rounded-xl p-3"
                    >
                      {{ result }}
                    </div>
                  </div>

         
                </div>

              </div>
            </transition>
          </div>
        </div>
      </template>
    </BaseModalGame>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed, ref, onMounted } from 'vue'
import { useFormStore } from '~/stores/form'
import BaseModalGame from './Modals/BaseModalGame.vue'
import AuthForm from './Modals/AuthForm.vue'
import confetti from 'canvas-confetti'
import { useIconComponents } from '~/composables/useIconComponentsMap'
import {useOtpService} from '~/composables/useOtpService'
import {useNuxtApp} from "#app";
import type {AxiosInstance} from 'axios'
export default defineComponent({
  components: {
    BaseModalGame,
    AuthForm
  },
  props: {
    link: { type: Object, required: false, default: () => ({}) },
    isListMode: { type: Boolean, default: false },
    isDarkTheme: { type: Boolean, default: false },
    isLightTheme: { type: Boolean, default: false },
    isBackgroundDark: { type: Boolean, default: false }
  },

  setup(props, { emit }) {
    const form = useFormStore()
    const formData = computed(() => form)
    const { sendOtpCode, verifyOtpCode } = useOtpService()
    // دسترسی به composable
    const { getIconComponent } = useIconComponents()

    // Get icon data and component
    const iconData = computed(() => props.link?.icon || null)

    const iconComponent = computed(() => {
      if (iconData.value?.type === 'component' && iconData.value?.name) {
        return getIconComponent(iconData.value.name)
      }
      // Default to luckywheel component
      return getIconComponent('luckywheel')
    })

    // Icon color logic - return user selected color or undefined for default SVG colors
    const iconColor = computed(() => {
      // اگر کاربر رنگ انتخاب کرده، از آن استفاده کن
      if (form.iconColor?.background && 
          form.iconColor.background !== 'transparent') {
        return form.iconColor.background
      }
      // در غیر این صورت، undefined برگردان تا رنگ پیش‌فرض SVG استفاده شود
      return undefined
    })

    const isIconFilled = computed(() => {
      return !!(form.iconColor?.background && 
               form.iconColor.background !== 'transparent')
    })

    const showGame = ref(false)
    const difficulty = ref<'ساده' | 'متوسط' | 'سخت'>('ساده')
    const isSpinning = ref(false)
    const rotation = ref(0)
    const result = ref('')
    const codeInputRefs = ref<(HTMLInputElement | null)[]>([])
    
    // حالت‌های احراز هویت
    const authStep = ref<'none' | 'phone' | 'code' | 'authenticated' | 'completed'>('none')
    const phoneNumber = ref('')
    const verificationCode = ref('')
    const codeInputs = ref(['', '', '', ''])
    const hasSpun = ref(false)
    const winningPrize = ref('')
    const countdown = ref(0)
    const canResendCode = ref(false)
    const isNewSpin = ref(false) // برای تشخیص چرخش جدید از بازیابی
    const prize = ref('') // کد قرعه‌کشی منحصر به فرد

    const adjustOpacity = (hex: string, opacity: number): string => {
      if (!hex.startsWith('#')) return hex
      const r = parseInt(hex.slice(1, 3), 16)
      const g = parseInt(hex.slice(3, 5), 16)
      const b = parseInt(hex.slice(5, 7), 16)
      return `rgba(${r}, ${g}, ${b}, ${opacity})`
    }

    const levels = [
      { value: 'ساده' as const, label: 'ساده' },
      { value: 'متوسط' as const, label: 'متوسط' },
      { value: 'سخت' as const, label: 'سخت' }
    ]

    const wheelItems = computed(() => {
      const baseColor = form.iconColor?.background || '#3B82F6';
      // رنگ‌ها از استور گرفته می‌شوند
      return [
        { name: 'پوچ', color: adjustOpacity(baseColor, 0.3) },
        { name: 'جایزه ویژه', color: adjustOpacity(baseColor, 0.9) },
        { name: 'جایزه طلایی', color: adjustOpacity(baseColor, 0.7) },
        { name: 'جایزه نقره‌ای', color: adjustOpacity(baseColor, 0.8) },
        { name: 'جایزه برنزی', color: adjustOpacity(baseColor, 0.5) },
        { name: 'جایزه ممتاز', color: adjustOpacity(baseColor, 0.6) }
      ];
    })

    // بررسی وضعیت کاربر از localStorage
    onMounted(() => {
      const savedData = localStorage.getItem('luckywheel_user_data')
      if (savedData) {
        const userData = JSON.parse(savedData)
        if (userData.phoneNumber) {
          phoneNumber.value = userData.phoneNumber
          hasSpun.value = userData.hasSpun || false
          
          if (userData.hasSpun) {
            // اگر چرخش کرده، نتیجه را بازیابی کن
            authStep.value = 'authenticated'
            if (userData.lastResult) {
              result.value = userData.lastResult
              prize.value = userData.prize || '' // بازیابی کد قرعه‌کشی
              isNewSpin.value = false // این بازیابی است، نه چرخش جدید
            }
          } else {
            authStep.value = 'authenticated'
          }
        }
      }
    })

    // تابع شروع احراز هویت
    const startAuth = () => {
      if (hasSpun.value) {
        // اگر قبلاً شرکت کرده، هیچ کاری نکن
        return

      }
      if (props.link?.phoneRequired === false) {
        authStep.value = 'authenticated'
        return
      }
      
      if (authStep.value === 'authenticated') {
        // اگر قبلاً احراز هویت شده، مستقیماً بچرخان
        spinWheel()
      } else {
        // شروع فرایند احراز هویت
        authStep.value = 'phone'
      }
    }

    // انصراف از احراز هویت
    const cancelAuth = () => {
      authStep.value = 'none'
      codeInputs.value = ['', '', '', '']
      countdown.value = 0
    }

    // تابع ارسال شماره موبایل
    const submitPhone = async () => {
      authStep.value = 'code'

      /////send otp
      // phoneNumber.value از v-model پر میشه
      await sendOtpCode(phoneNumber.value)

      startCountdown()
    }

    // شروع شمارشگر
    const startCountdown = () => {
      countdown.value = 120
      const timer = setInterval(() => {
        countdown.value--
        if (countdown.value <= 0) {
          clearInterval(timer)
          canResendCode.value = true
        }
      }, 1000)
    }

    // ارسال مجدد کد
    const resendCode = () => {
      if (canResendCode.value) {
        canResendCode.value = false
        startCountdown()
        // اینجا می‌توانید API ارسال مجدد کد را فراخوانی کنید
        alert('کد تایید مجدد ارسال شد')
      }
    }

    // ویرایش شماره موبایل
    const editPhoneNumber = () => {
      authStep.value = 'phone'
      verificationCode.value = ''
      codeInputs.value = ['', '', '', '']
      countdown.value = 0
      canResendCode.value = false
      
      // فوکوس روی فیلد شماره موبایل پس از تغییر مرحله
      setTimeout(() => {
        const phoneInput = document.querySelector('input[type="tel"]') as HTMLInputElement
        if (phoneInput) {
          phoneInput.focus()
          phoneInput.select() // انتخاب تمام متن برای ویرایش آسان‌تر
        }
      }, 100)
    }

    // مدیریت ورودی کد
    const handleCodeInput = (index: number, event: Event) => {
      const target = event.target as HTMLInputElement
      const value = target.value.replace(/[^0-9]/g, '') // فقط اعداد
      
      // اگر مقدار بیش از 1 کاراکتر باشد، فقط اولی را نگه دار
      if (value.length > 1) {
        target.value = value.slice(-1) // آخرین کاراکتر وارد شده
        codeInputs.value[index] = value.slice(-1)
      } else {
        codeInputs.value[index] = value
      }
      
      // انتقال به فیلد بعدی فقط اگر مقدار وارد شده باشد
      if (value && index < 3) {
        setTimeout(() => {
          const nextInput = codeInputRefs.value[index + 1]
          if (nextInput) {
            nextInput.focus()
          }
        }, 10)
      }
      
      // بروزرسانی verificationCode
      verificationCode.value = codeInputs.value.join('')
    }

    // مدیریت کلیدها
    const handleKeyDown = (index: number, event: KeyboardEvent) => {
      if (event.key === 'Backspace' && !codeInputs.value[index] && index > 0) {
        const prevInput = codeInputRefs.value[index - 1]
        if (prevInput) {
          prevInput.focus()
        }
      }
    }

    // مدیریت paste
    const handlePaste = (event: ClipboardEvent) => {
      event.preventDefault()
      const pasteData = event.clipboardData?.getData('text') || ''
      const digits = pasteData.replace(/[^0-9]/g, '').slice(0, 4)
      
      for (let i = 0; i < 4; i++) {
        codeInputs.value[i] = digits[i] || ''
      }
      
      verificationCode.value = codeInputs.value.join('')
      
      // فوکوس روی آخرین فیلد پر شده
      const lastFilledIndex = digits.length - 1
      if (lastFilledIndex >= 0 && lastFilledIndex < 4) {
        const targetInput = codeInputRefs.value[lastFilledIndex]
        if (targetInput) {
          targetInput.focus()
        }
      }
    }

    const submitCode = async () => {
      ////verify otp
      // codeInputs یه آرایه ۴ رقمیه ['1','2','3','4']
      const fullCode = codeInputs.value.join('')

      try{

      const res = await verifyOtpCode(phoneNumber.value, fullCode)
        if (res) {
          authStep.value = 'authenticated'
          localStorage.setItem('luckywheel_user_data', JSON.stringify({
            phoneNumber: phoneNumber.value,
            hasSpun: false,
            authenticatedAt: new Date().toISOString()
          }))
        } else {
          alert('کد تأیید اشتباه است')
        }
      } catch (e) {
        alert('مشکل در تأیید کد')
      }
    }
    // برگشت به مرحله قبل
    const goBack = () => {
      if (authStep.value === 'code') {
        authStep.value = 'phone'
        verificationCode.value = ''
        codeInputs.value = ['', '', '', '']
        countdown.value = 0
        canResendCode.value = false
      }
    }

    // ریست کامل بازی
    const resetGame = () => {
      // در صورت نیاز می‌توان localStorage را پاک کرد
      // localStorage.removeItem('luckywheel_user_data')
      showGame.value = false
    }

    // تابع ریست کامل برای تست (فقط در مرحله توسعه)
    const resetForTesting = () => {
      localStorage.removeItem('luckywheel_user_data')
      hasSpun.value = false
      authStep.value = 'none'
      phoneNumber.value = ''
      result.value = ''
      winningPrize.value = ''
      prize.value = ''
    }

    const lastMediumWasPrize = ref(false)
    const segmentAngle = computed(() => 360 / wheelItems.value.length)

    async function spinWheel() {
      const canPlay = await checkForPlay()
      if (!canPlay) {
        return
      }
      if (isSpinning.value || hasSpun.value || authStep.value !== 'authenticated') return

      isSpinning.value = true
      result.value = ''
      isNewSpin.value = true // این یک چرخش جدید است

      // تعیین نتیجه از قبل
      let selectedIndex = 0 // پیش‌فرض پوچ
      if (difficulty.value === 'ساده') {
        selectedIndex = Math.floor(Math.random() * 5) + 1
      } else if (difficulty.value === 'متوسط') {
        if (lastMediumWasPrize.value) {
          selectedIndex = 0
        } else {
          selectedIndex = Math.floor(Math.random() * 5) + 1
        }
        lastMediumWasPrize.value = !lastMediumWasPrize.value
      } else if (difficulty.value === 'سخت') {
        selectedIndex = 0
      }

      selectedIndex = Math.max(0, Math.min(selectedIndex, wheelItems.value.length - 1))

      // محاسبه زاویه دقیق برای توقف روی جایزه انتخاب شده
      const segmentSize = 360 / wheelItems.value.length

      // محاسبه زاویه مرکز جایزه انتخابی
      // اضافه کردن نیمی از segment برای قرار گیری در مرکز
      const prizeAngle = selectedIndex * segmentSize + (segmentSize / 2)

      // چرخش‌های اضافی برای جلوه بصری (6-8 دور کامل)
      const spins = 6 + Math.floor(Math.random() * 3)

      // محاسبه rotation دقیق برای توقف دقیقاً روی مرکز جایزه
      // چون پوینتر در بالا (0 درجه) است، باید جایزه در همان موقعیت باشد
      const currentRotation = rotation.value % 360
      const targetRotation = (360 - prizeAngle + 360) % 360
      const rotationDifference = (targetRotation - currentRotation + 360) % 360
      const totalRotation = 360 * spins + rotationDifference

      // تنظیم rotation جدید
      rotation.value = rotation.value + totalRotation

      // صدای تیک
      const tickSound = new Audio('/sounds/tick.mp3')
      const tickInterval = setInterval(() => {
        tickSound.play().catch(() => {
        })
      }, 120)

      setTimeout(async () => {
        clearInterval(tickInterval)

        const selectedPrize = wheelItems.value[selectedIndex]
        result.value = selectedPrize ? selectedPrize.name : 'پوچ'
        isSpinning.value = false

        await sendResultToBackend(props.link.hash)

        if (result.value.includes('پوچ')) {
          result.value = 'اینبار برنده نشدید! دوباره تلاش کنید'
        } else {
          // تولید کد قرعه‌کشی برای برندگان

        }
        // تنظیم hasSpun برای جلوگیری از چرخش مجدد فقط برای این شماره موبایل
        hasSpun.value = true

        // اگر جایزه برد، confetti نمایش داده شود (فقط برای چرخش‌های جدید)
        if (isNewSpin.value && !result.value.includes('پوچ') && !result.value.includes('برنده نشدید')) {
          setTimeout(() => {
            confetti({
              particleCount: 200,
              spread: 90,
              origin: {y: 0.6},
              colors: ['#FFD700', '#FFA500', '#FF6347', '#32CD32', '#1E90FF', '#DA70D6', '#FF69B4'],
              scalar: 1.2,
              gravity: 0.8
            })
          }, 200)
        }
      }, 3500)
    }

    function hexToRgb(hex: string) {
      if (!hex.startsWith('#')) return [255,255,255];
      const r = parseInt(hex.slice(1, 3), 16)
      const g = parseInt(hex.slice(3, 5), 16)
      const b = parseInt(hex.slice(5, 7), 16)
      return [r, g, b]
    }
    function isDark(color: string) {
      let rgb = [255,255,255];
      if (color.startsWith('rgba')) {
        rgb = color.match(/\d+/g)?.slice(0,3).map(Number) || [255,255,255];
      } else if (color.startsWith('#')) {
        rgb = hexToRgb(color);
      }
      // Perceived brightness formula
      const brightness = (rgb[0] * 299 + rgb[1] * 587 + rgb[2] * 114) / 1000;
      return brightness < 140;
    }

    function getHueRotation(hexColor: string): number {
      if (!hexColor.startsWith('#')) return 0;
      
      const r = parseInt(hexColor.slice(1, 3), 16) / 255;
      const g = parseInt(hexColor.slice(3, 5), 16) / 255;
      const b = parseInt(hexColor.slice(5, 7), 16) / 255;
      
      const max = Math.max(r, g, b);
      const min = Math.min(r, g, b);
      const diff = max - min;
      
      let hue = 0;
      if (diff !== 0) {
        if (max === r) {
          hue = ((g - b) / diff) % 6;
        } else if (max === g) {
          hue = (b - r) / diff + 2;
        } else {
          hue = (r - g) / diff + 4;
        }
      }
      
      hue = Math.round(hue * 60);
      if (hue < 0) hue += 360;
      
      // تبدیل به hue-rotate مناسب (طلایی اصلی = 45 درجه)
      return hue - 45;
    }

    async function sendResultToBackend (hash:string)  {
      const {$axios} = useNuxtApp()
      const axios = $axios as AxiosInstance
      try {
        const payload = {
          phone: phoneNumber.value,
          result: result.value,
        }

        const response = await axios.post(`club/${hash}/luckyWheel/result`, payload)

        if (response.data?.data?.reward?.value) {
          prize.value = response.data.data.reward.value
        }
        result.value=response.data.data.result.result

      } catch (error:any) {
      }
    }
    const checkForPlay = async () => {
      const {$axios} = useNuxtApp()
      const axios = $axios as AxiosInstance
      try {
        const response = await axios.get(`club/${props.link?.hash}/luckyWheel/check`)
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

    return {
      form,
      formData,
      showGame,
      wheelItems,
      difficulty,
      isSpinning,
      rotation,
      result,
      segmentAngle,
      spinWheel,
      levels,
      isDark,
      getHueRotation,
      adjustOpacity,
      authStep,
      phoneNumber,
      verificationCode,
      codeInputs,
      codeInputRefs,
      hasSpun,
      winningPrize,
      countdown,
      canResendCode,
      startAuth,
      cancelAuth,
      submitPhone,
      submitCode,
      editPhoneNumber,
      goBack,
      resetGame,
      resetForTesting,
      startCountdown,
      resendCode,
      handleCodeInput,
      handleKeyDown,
      handlePaste,
      prize,
      iconData,
      iconColor,
      isIconFilled,
      iconComponent
    }
  }
})
</script>

<style scoped>
.wheel {
  transform-origin: center;
}
.wheel-segment {
  clip-path: polygon(50% 50%, 50% 0, 140% 0);
  transform-origin: center;
}
.pointer {
  z-index: 20;
}

/* چیدمان آیکون سمت راست */
</style>
