<template>
  <div class="flex items-center justify-center">
    <InfoToast :visible="showToast" :message="toastMessage" :icon="toastIcon"/>
    <div class="relative w-full max-w-full m-4 bg-white rounded-2xl shadow-lg overflow-hidden">

      <!-- دکمه بستن -->
      <button
          class="absolute top-3 left-3 p-2 text-white hover:text-gray-100 bg-black/30 hover:bg-black/40 rounded-full w-5 h-5 flex items-center justify-center z-10 transition"
          @click="emit('close')"
      >
        <i class="ti ti-x text-base"/>
      </button>

      <!-- هدر فرم -->
      <div class="px-6 py-3" :style="{ backgroundColor: headerColor }">
        <h3 class="text-lg font-semibold text-white">
          {{ formStore.formTitle || 'فرم تماس' }}
        </h3>
      </div>

      <!-- بدنه فرم با اسکرول داخلی -->
      <div class="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
        <!-- فیلدهای فرم -->
        <div v-if="safeFields.length > 0">
          <FormField
              v-for="field in safeFields"
              :key="field.id"
              :field="field"
              v-model="formValues[field.name]"
              :previewSrc="field.type === 'file' ? previewMap[field.id] || '' : ''"
              :error="formErrors[field.name]"
              @update:previewSrc="(val: string | null | undefined) => previewMap[field.id] = val || ''"
          />
        </div>

        <!-- دکمه ارسال -->
        <button
            @click="handleSubmit"
            class="relative w-full py-2 px-4 rounded-md text-white font-medium transition duration-200 flex items-center justify-center"
            :style="{ backgroundColor: headerColor, opacity: loading ? 0.8 : 1 }"
            :disabled="loading"
        >
          <span v-if="!loading">
            {{ formStore.connectButtonText || 'ارسال' }}
          </span>

          <!-- 🔄 اسپینر -->
          <svg
              v-else
              class="animate-spin h-5 w-5 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
          >
            <circle
                class="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                stroke-width="4"
            ></circle>
            <path
                class="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
            ></path>
          </svg>
        </button>

        <!-- پیغام زیر دکمه ارسال -->
        <p class="text-xs text-gray-500 text-center">
          {{ formStore.formDisclaimer || 'اطلاعات شما محرمانه می‌ماند' }}
        </p>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import {useFormStore} from '~/stores/form'
import FormField from './FormField.vue'
import {computed} from 'vue'
import InfoToast from "~/components/UserDashboard/modals/InfoToast.vue";
import type {AxiosInstance} from "axios";
import type {ApiResponseType} from "~/types/api";

// Define emits
const emit = defineEmits<{
  close: []
}>()
const props = defineProps({
  cardId: String,
  slug: String,
  isDefault: {
    type: String,
    default: '0'
  }
})
const loading = ref(false)
const {$axios} = useNuxtApp();
const axios = $axios as AxiosInstance;
//Add Toast
const showToast = ref(false)
const previewMap = reactive<Record<string, string>>({})
const toastMessage = ref('')
const toastIcon = ref('ti-alert-triangle') // یا 'ti-lock', 'ti-check', هر چی خواستی
const showInfoToast = (message: string, icon = 'ti-lock') => {
  toastMessage.value = message
  toastIcon.value = icon
  showToast.value = true
  setTimeout(() => showToast.value = false, 3000) // بعد از ۳ ثانیه بسته می‌شه
}

const formStore = useFormStore()
const formValues = reactive<Record<string | number, any>>({})
const formErrors = reactive<Record<string, string>>({})

// فیلدهای پیش‌فرض فرم
const defaultFields = [
  {id: '1', type: 'text' as const, label: 'نام', name: 'fullName', required: true},
  {id: '2', type: 'text' as const, label: 'ایمیل', name: 'email', required: false},
  {id: '3', type: 'text' as const, label: 'شماره تماس', name: 'phoneNumber', required: true}
]

// Fields computation with safe access
const safeFields = computed(() => {
  try {
    const fields = formStore.fields || defaultFields
    return Array.isArray(fields) ? fields : defaultFields
  } catch {
    return defaultFields
  }
})

// Validation function
const validateForm = (): boolean => {
  let isValid = true
  // Reset errors
  Object.keys(formErrors).forEach(key => delete formErrors[key])
  
  for (const field of safeFields.value) {
    // Check required fields
    if (field.required) {
      const value = formValues[field.name]
      
      // Check if value is empty
      if (value === undefined || value === null || value === '' || 
          (typeof value === 'string' && value.trim() === '')) {
        formErrors[field.name] = `${field.label || 'این فیلد'} الزامی است`
        isValid = false
      }
    }
    
    // Validate phone number format if it exists and has value
    if (field.name === 'phoneNumber' && formValues[field.name]) {
      const phone = String(formValues[field.name]).replace(/\D/g, '')
      if (phone.length < 10 || phone.length > 15) {
        formErrors[field.name] = 'شماره تماس معتبر نیست'
        isValid = false
      }
    }
    
    // Validate email format if it exists and has value
    if (field.name === 'email' && formValues[field.name] && field.required) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(formValues[field.name])) {
        formErrors[field.name] = 'ایمیل معتبر نیست'
        isValid = false
      }
    }
  }
  
  return isValid
}

// محاسبه رنگ با اطمینان از مشکی بودن در حالت پیش‌فرض
const headerColor = computed(() => {
  const color = formStore.iconColor?.background
  // اگر رنگ وجود نداشته باشه یا سفید/transparent باشه، مشکی برگردون
  if (!color || color === 'transparent' || color === '#ffffff' || color === '#FFFFFF' || color === 'white') {
    return '#000000'
  }
  return color
})

async function handleSubmit() {
  // Validate form first
  if (!validateForm()) {
    showInfoToast('لطفاً فیلدهای الزامی را پر کنید', 'ti-alert-triangle')
    return
  }
  
  loading.value = true

  const formData = new FormData();

  const files: { key: string; file: File }[] = [];

  for (const [key, value] of Object.entries(formValues)) {

    if (typeof value === 'string' &&
        (value.startsWith('http://') || value.startsWith('https://'))) {
      continue
    }

    // اگر فایل هست، جدا ذخیره کن
    if (value instanceof File) {
      files.push({key, file: value})
    } else {
      // غیر فایل → بریز تو formData اصلی
      formData.append(key, value as any)
    }

  }
  if (props.slug) {
    formData.append('slug', `${props.slug}`)
    formData.append('isDefault', '0')
  }

  if (props.cardId) {
    formData.append('card_id', `${props.cardId}`)
    formData.append('isDefault', '1')
  }

  const fieldLabels: Record<string, string> = {};

  formStore.fields.forEach((field: { name: string; label: string }) => {
    fieldLabels[field.name] = field.label;
  });
  formData.append('fieldLabels', JSON.stringify(fieldLabels));

  const response = ref<ApiResponseType | null>(null)

  try {

    if (typeof props.slug !== 'undefined' && props.slug !== null) {
      response.value = await $axios.post(`cards/${props.slug}/leadAddToCard`, formData);
    }

    if (typeof props.cardId !== 'undefined' && props.cardId !== null) {
      response.value = await $axios.post(`v1/cards/${props.cardId}/leads`, formData);
    }


    if (files.length > 0) {
      const fileForm = new FormData()
      for (const {key, file} of files) {
        fileForm.append(key, file)
      }
      const uploadResponse = await uploadFiles(
          response.value.data?.data.id, response.value.data?.data.cardId
          , response.value.data?.data.modelType,
          fileForm)
      if (uploadResponse?.data?.success) {
        showInfoToast('فایل‌ها آپلود شدند', 'ti-check')
      }

    }
    showInfoToast(response.value.data.message, 'ti-check');


  } catch (error: any) {
    showInfoToast(error.response.data.message, 'ti-alert-triangle');
  }finally{
    loading.value = false
    if(!props.cardId){
      setTimeout(() => {
        emit('close')
      }, 3000)
    }


  }
}

async function uploadFiles(leadId: any, cardId: any, modelType: string, fileForm: any):Promise<ApiResponseType> {

  const formData = new FormData()

  formData.append('modelType', modelType) // یا هر چیز دیگه که API میخواد
  formData.append('modelId', leadId)

  function base64ToBlob(base64: string, mime = 'image/png') {
    const byteString = atob(base64.split(',')[1])
    const ab = new ArrayBuffer(byteString.length)
    const ia = new Uint8Array(ab)
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i)
    }
    return new Blob([ab], {type: mime})
  }

  for (const [field, value] of fileForm.entries()) {
    if (!value) continue;

    if (typeof value === 'string' && value.startsWith('data:')) {
      // اگر base64 بود، به Blob تبدیل کن
      const blob = base64ToBlob(value, 'image/png');
      formData.append(field, blob, `${field}.png`);
    } else {
      // اگر فایل واقعی بود، مستقیم اضافه کن
      formData.append(field, value);
    }
  }

  try {
    const uploadResponse = await axios.post(`file-manager/${leadId}/upload`, formData)

    if (uploadResponse.data?.success) {
      showInfoToast('آیکون سفارشی با موفقیت آپلود شد', 'ti-image')

    } else {
      showInfoToast('آپلود آیکون سفارشی با خطا مواجه شد', 'ti-alert-triangle')
    }

    return uploadResponse;
  } catch (error) {
    showInfoToast('خطا در آپلود آیکون سفارشی', 'ti-alert-triangle')
  }
}
</script>
