<template>
  <div>
    <!-- فرم احراز هویت -->
    <div v-if="authStep === 'phone'" class="flex flex-col items-center justify-center py-8 px-4 text-center max-w-md mx-auto">
      <div class="text-6xl mb-6">
        <i class="ti ti-device-mobile text-6xl text-black"></i>
      </div>
      <h2 class="text-2xl font-bold mb-4 text-gray-800">{{ gameTitle }}</h2>
      <p class="text-gray-600 mb-6 text-center leading-relaxed">
        برای شرکت در قرعه‌کشی و امتحان شانست، لطفاً شماره موبایلت رو وارد کن
      </p>
      
      <div class="w-full space-y-4">
        <div class="relative">
          <input
            v-model="phoneNumber"
            type="tel"
            placeholder="شماره موبایل (مثال: 09123456789)"
            :class="[
              'clean-input w-full px-4 py-4 pl-12 border-2 rounded-xl text-left text-lg font-medium transition-all duration-300 direction-ltr',
              phoneNumber && phoneNumber.length >= 11
                ? 'border-black bg-black/5 text-black' 
                : 'border-gray-300 bg-gray-50 text-gray-500 focus:border-black focus:bg-white'
            ]"
            style="direction: ltr;"
            maxlength="11"
            @keypress="handlePhoneKeypress"
            @keyup.enter="submitPhone"
          />
          <div class="absolute right-3 top-1/2 transform -translate-y-1/2">
            <button @click="clearPhone" class="p-1">
              <i class="ti ti-edit text-gray-400 hover:text-gray-600 text-lg transition-colors"></i>
            </button>
          </div>
          <div v-if="phoneNumber && phoneNumber.length >= 11" class="absolute left-3 top-1/2 transform -translate-y-1/2 p-0.5 bg-green-500 text-white rounded-full w-7 h-7">
            <i class="ti ti-check text-black text-lg"></i>
          </div>
        </div>
        
        <button
          @click="submitPhone"
          :disabled="!phoneNumber || phoneNumber.length < 11"
          :class="[
            'w-full px-6 py-4 rounded-xl font-bold transition-all duration-300 flex items-center justify-center',
            phoneNumber && phoneNumber.length >= 11 
              ? 'bg-black text-white hover:bg-gray-800' 
              : 'bg-gray-200 text-gray-400 cursor-not-allowed'
          ]"
        >
          ادامه و شروع بازی
        </button>
      </div>
    </div>

    <!-- فرم کد تایید -->
    <div v-else-if="authStep === 'code'" class="flex flex-col items-center justify-center py-8 px-4 text-center max-w-md mx-auto">
      <div class="text-6xl mb-6">
        <i class="ti ti-message-2-code text-6xl text-black"></i>
      </div>
      <h2 class="text-2xl font-bold mb-4 text-gray-800">کد تایید</h2>
      <div class="text-gray-600 mb-6 text-center">
        <p class="mb-2">کد تایید 4 رقمی ارسال شده به شماره</p>
        <div class="flex items-center justify-center gap-2">
          <strong class="text-black">{{ phoneNumber }}</strong>
          <button @click="cancelAuth" class="p-1 rounded-lg hover:bg-gray-100 transition-colors" title="تغییر شماره">
            <i class="ti ti-edit text-gray-400 hover:text-gray-600 text-sm transition-colors"></i>
          </button>
        </div>
      </div>
      
      <div class="flex gap-3 mb-6 justify-center" @paste="handlePaste" style="direction: ltr;">
        <input
          v-for="(code, index) in codeInputs"
          :key="index"
          :ref="el => codeInputRefs[index] = el"
          v-model="codeInputs[index]"
          type="text"
          inputmode="numeric"
          pattern="[0-9]*"
          maxlength="1"
          :class="[
            'clean-input otp-input w-14 h-14 text-center text-xl font-bold rounded-xl transition-all duration-300 border-2',
            code 
              ? 'border-black bg-gray-100 text-black' 
              : 'border-gray-300 bg-gray-50 text-gray-400 hover:border-gray-400 focus:border-black focus:bg-gray-100 focus:text-black'
          ]"
          @input="handleCodeInput(index, $event)"
          @keydown="handleKeyDown(index, $event)"
          @focus="onInputFocus(index)"
          @blur="onInputBlur(index)"
        />
      </div>
      
      <div class="flex flex-col gap-4 w-full">
        <button
          @click="submitCode"
          :disabled="codeInputs.join('').length < 4"
          :class="[
            'w-full px-6 py-4 rounded-xl font-bold transition-all duration-300 flex items-center justify-center',
            codeInputs.join('').length >= 4 
              ? 'bg-black text-white hover:bg-gray-800' 
              : 'bg-gray-200 text-gray-400 cursor-not-allowed'
          ]"
        >
          تایید و شروع بازی
        </button>
        
        <div class="flex justify-center items-center text-sm">
          <div v-if="countdown > 0" class="text-gray-600">
            <span class="font-mono font-bold">{{ Math.floor(countdown / 60) }}:{{ (countdown % 60).toString().padStart(2, '0') }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  gameIcon: { type: String, default: '🎲' },
  gameTitle: { type: String, default: 'بازی شانس' },
  authStep: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  codeInputs: { type: Array, required: true },
  countdown: { type: Number, default: 0 }
})

const emit = defineEmits(['update:phoneNumber', 'update:codeInputs', 'submit-phone', 'submit-code', 'cancel-auth'])

const codeInputRefs = ref([])

const handlePhoneKeypress = (e) => {
  if (!/[0-9]/.test(e.key) && e.key !== 'Backspace' && e.key !== 'Delete') {
    e.preventDefault()
  }
}

const submitPhone = () => {
  if (!props.phoneNumber || props.phoneNumber.length < 11) {
    alert('شماره موبایل معتبر وارد کنید')
    return
  }
  emit('submit-phone')
  setTimeout(() => {
    const firstInput = codeInputRefs.value[0]
    if (firstInput) firstInput.focus()
  }, 100)
}

const submitCode = () => {
  //if (props.codeInputs.join('') === '1234') {
    emit('submit-code')
  /*} else {
    alert('کد تایید اشتباه است')
  }*/
}

const cancelAuth = () => {
  emit('cancel-auth')
}

const clearPhone = () => {
  phoneNumber.value = ''
}

const handleCodeInput = (index, e) => {
  const input = e.target.value
  
  // فقط اعداد را قبول کن
  if (!/^[0-9]?$/.test(input)) {
    e.target.value = props.codeInputs[index]
    return
  }
  
  const newCodeInputs = [...props.codeInputs]
  newCodeInputs[index] = input
  emit('update:codeInputs', newCodeInputs)
  
  // به اینپوت بعدی برو اگر عدد وارد شد
  if (input && index < 3) {
    setTimeout(() => {
      codeInputRefs.value[index + 1]?.focus()
    }, 10)
  }
}

const handleKeyDown = (index, e) => {
  // اگر Backspace زده شد و اینپوت خالی است، به اینپوت قبلی برو
  if (e.key === 'Backspace' && !props.codeInputs[index] && index > 0) {
    setTimeout(() => {
      codeInputRefs.value[index - 1]?.focus()
    }, 10)
  }
  // اگر Backspace زده شد و اینپوت پر است، اینپوت را خالی کن
  else if (e.key === 'Backspace' && props.codeInputs[index]) {
    const newCodeInputs = [...props.codeInputs]
    newCodeInputs[index] = ''
    emit('update:codeInputs', newCodeInputs)
  }
}

const handlePaste = (e) => {
  e.preventDefault()
  const paste = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 4)
  const newCodeInputs = [...props.codeInputs]
  
  // پاک کردن همه اینپوت‌ها
  for (let i = 0; i < 4; i++) {
    newCodeInputs[i] = ''
  }
  
  // پر کردن از چپ به راست
  for (let i = 0; i < paste.length && i < 4; i++) {
    newCodeInputs[i] = paste[i]
  }
  
  emit('update:codeInputs', newCodeInputs)
  
  // فوکوس روی اولین اینپوت خالی یا آخرین اینپوت پر شده
  setTimeout(() => {
    const nextEmptyIndex = newCodeInputs.findIndex(code => !code)
    const targetIndex = nextEmptyIndex !== -1 ? nextEmptyIndex : Math.min(paste.length, 3)
    codeInputRefs.value[targetIndex]?.focus()
  }, 10)
}

const onInputFocus = (index) => {
  // انیمیشن فوکوس برای اینپوت OTP
}

const onInputBlur = (index) => {
  // انیمیشن بلور برای اینپوت OTP
}

const onPhoneInputFocus = () => {
  // انیمیشن فوکوس برای اینپوت موبایل
}

const onPhoneInputBlur = () => {
  // انیمیشن بلور برای اینپوت موبایل
}

// وقتی phoneNumber تغییر کرد
const phoneNumber = computed({
  get: () => props.phoneNumber,
  set: (value) => emit('update:phoneNumber', value)
})
</script>

<style scoped>
.direction-ltr {
  direction: ltr;
}

input[type="tel"] {
  text-align: left;
  direction: ltr;
}

input[type="text"] {
  text-align: center;
}

/* OTP inputs specific styling */
.otp-input {
  direction: ltr !important;
  text-align: center !important;
  writing-mode: horizontal-tb;
  unicode-bidi: bidi-override;
}

/* انیمیشن ملایم برای اینپوت‌ها */
input[type="text"]:focus {
  animation: pulse-input 0.2s ease-in-out;
}

@keyframes pulse-input {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.01);
  }
  100% {
    transform: scale(1);
  }
}

/* انیمیشن برای تیک مارک */
.ti-check {
  animation: check-appear 0.3s ease-in-out;
}

@keyframes check-appear {
  0% {
    opacity: 0;
    transform: scale(0);
  }
  100% {
    opacity: 1;
    transform: scale(1);
  }
}

/* گرادیانت subtle برای پس‌زمینه */
.bg-black\/5 {
  background: linear-gradient(135deg, rgba(0,0,0,0.03), rgba(0,0,0,0.08));
}
</style>
