<template>
  <Teleport to="body">
    <Transition name="fade-scale">
      <div
          v-if="visible"
          class="fixed inset-0 z-[999] flex items-center justify-center bg-black/50 backdrop-blur-sm"
          @click.self="$emit('close')"
      >
        <div class="bg-white rounded-2xl w-96 shadow-xl p-6 scale-100">
          <!-- هدر -->
          <div class="flex items-center gap-2 mb-4 text-black">
            <i class="ti ti-device-mobile text-2xl"/>
            <h2 class="text-lg font-bold">
              {{ step === 1 ? 'ویرایش شماره موبایل' : 'تایید کد' }}
            </h2>
          </div>

          <!-- Step 1: وارد کردن شماره -->
          <div v-if="step === 1" class="mb-4">
            <label class="block text-sm text-gray-600 mb-1">شماره جدید</label>
            <input
                type="tel"
                v-model="phone"
                @input="handlePhoneInput"
                placeholder="مثلاً 09123456789"
                class="w-full px-3 py-2 rounded-md border border-gray-300 focus:ring-2 focus:ring-black focus:outline-none text-sm text-gray-700"
            />
          </div>

          <!-- Step 2: وارد کردن کد -->
          <div v-else class="mb-4">
            <div class="flex justify-center gap-2 ltr">
              <input
                  v-for="(digit, index) in otp.length"
                  :key="index"
                  :ref="el => otpRefs[index] = el"
                  v-model="otp[index]"
                  type="text"
                  inputmode="numeric"
                  maxlength="1"
                  pattern="[0-9]*"
                  class="w-12 h-12 text-xl text-center border rounded-lg font-bold text-gray-700"
                  dir="ltr"
                  @input="handleOtpInput(index)"
                  @keydown.backspace="handleBackspace(index, $event)"
              />
              <p v-if="otpError" class="text-xs text-red-600">کد وارد شده نادرست است.</p>
              <p v-if="otpSuccess" class="text-xs text-green-600">شماره موبایل تأیید شد.</p>
            </div>
            <p class="text-xs text-gray-500 mt-2">
              کد به شماره <span class="font-medium">{{ phone }}</span> ارسال شد.
            </p>
          </div>

          <!-- دکمه‌ها -->
          <div class="flex justify-end gap-2 mt-6">
            <button
                @click="$emit('close')"
                class="px-4 py-2 text-sm rounded-md border border-gray-300 text-gray-700 hover:bg-gray-100"
            >
              لغو
            </button>

            <!-- Step 1: ارسال کد -->
            <button
                v-if="step === 1"
                @click="sendOtpCode"
                class="px-4 py-2 text-sm rounded-md bg-black text-white hover:bg-gray-900"
            >
              ارسال کد
            </button>

            <!-- Step 2: تایید -->
            <button
                v-else
                @click="verifyOtpCode"
                class="px-4 py-2 text-sm rounded-md bg-black text-white hover:bg-gray-900"
            >
              تایید
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import {ref, watch} from 'vue'
import {useToast} from '~/composables/useToast'

const {error} = useToast()

const props = defineProps({
  visible: Boolean,
  modelValue: String
})

const emit = defineEmits(['close', 'update'])

const phone = ref(props.modelValue || '')

watch(() => props.modelValue, (val) => {
  phone.value = val || ''
})

const updatePhone = () => {
  if (!phone.value || phone.value.length < 10) {
    error('شماره نامعتبر', 'لطفاً شماره موبایل معتبر وارد کنید')
    return
  }
  emit('update', phone.value)
  emit('close')
}
const otpError = ref(false)
const otpSuccess = ref(false)
const step = ref(1)   // استپ پیش‌فرض = 1 (ورود شماره)
const otp = ref(['', '', '', ''])
const otpRefs = ref([])
const showToast = ref(false)
const toastMessage = ref('')
const toastIcon = ref('ti-alert-triangle') // یا 'ti-lock', 'ti-check', هر چی خواستی
const showInfoToast = (message, icon = 'ti-lock') => {
  toastMessage.value = message
  toastIcon.value = icon
  showToast.value = true
  setTimeout(() => showToast.value = false, 3000) // بعد از ۳ ثانیه بسته می‌شه
}

function toEnglishDigits(input) {
  return input.replace(/[۰-۹]/g, (d) => '۰۱۲۳۴۵۶۷۸۹'.indexOf(d)).replace(/[^\d]/g, '');
}

function handleOtpInput(index) {
  const input = otp.value[index];
  if (!/^\d$/.test(input)) {
    otp.value[index] = "";
    return;
  }
  if (index < otp.value.length - 1) {
    otpRefs.value[index + 1]?.focus();
  }
}

function handleBackspace(index) {
  if (otp.value[index] === "" && index > 0) {
    otpRefs.value[index - 1]?.focus();
  }
}

// رفتن به استپ 2 (ارسال کد)
const sendOtpCode = async () => {
  if (!phone.value || phone.value.length < 10) {
    error('شماره نامعتبر', 'لطفاً شماره موبایل معتبر وارد کنید')
    return
  }
  const {$axios} = useNuxtApp()
  const normalized = toEnglishDigits(phone.value || "");

  try {
    const response = await $axios.post('auth/sendOtpCode', {
      phone: normalized.replace(/^0/, ''), // حذف صفر اول
      countryCode: '98',
    });

    if (response.data && response.data.success === true) {
      otp.value = ["", "", "", ""];
      otpError.value = false;
      otpSuccess.value = false;
      await nextTick(() => otpRefs.value[0]?.focus());
    } else {
      showInfoToast(response.data.message || 'ارسال کد با مشکل مواجه شد.', 'ti-alert-triangle');
    }

  } catch (error) {
    if (error.response?.data?.message) {
      showInfoToast(error.response.data.message, 'ti-alert-triangle');
    } else {
      showInfoToast('مشکلی در ارتباط با سرور وجود دارد.', 'ti-alert-triangle');
    }
  }
  step.value = 2
}

async function verifyOtpCode () {
  const {$axios} = useNuxtApp();
  const code = otp.value.join("");
  const normalizePhone = toEnglishDigits(phone.value || "").replace(/^0/, '');

  try {
    const response = await $axios.post('auth/verifyPhoneChange', {
      code,
      phone:normalizePhone,
      countryCode: '98',
    });

    if (response.data?.success === true) {
      otpSuccess.value = true;
      otpError.value = false;
      showInfoToast('شماره با موفقیت تأیید شد.', 'ti-check');
      step.value = 1
      emit('update', phone.value)
      emit('close')


    } else {
      otpSuccess.value = false;
      otpError.value = true;
      showInfoToast(response.data.message || 'کد وارد شده نادرست است.', 'ti-alert-triangle');
    }

  } catch (error) {
    otpSuccess.value = false;
    otpError.value = true;
    const message = error.response?.data?.message || 'خطایی در بررسی کد تأیید رخ داد.';
    showInfoToast(message, 'ti-alert-triangle');
  }
}
function handlePhoneInput(event) {
  let cleaned = event.target.value.replace(/[^\d۰-۹]/g, '');
  cleaned = cleaned.replace(/[۰-۹]/g, d => String('۰۱۲۳۴۵۶۷۸۹'.indexOf(d)));

  // اگر شماره با 0 شروع نشد، صفر اول اضافه کن
  if (!cleaned.startsWith('0')) {
    cleaned = '0' + cleaned;
  }

  // فقط 11 رقم معتبر نگه دار
  if (cleaned.length > 11) cleaned = cleaned.slice(0, 11);

  phone.value = cleaned;
}



// تایید کد
const confirmCode = () => {

  emit('update', phone.value)
  emit('close')
  step.value = 1     // برگرده به استپ اول بعد از بستن
}

</script>
<style scoped>
.fade-scale-enter-active,
.fade-scale-leave-active {
  transition: all 0.25s ease;
}

.fade-scale-enter-from,
.fade-scale-leave-to {
  opacity: 0;
  transform: scale(0.9);
}
</style>
  