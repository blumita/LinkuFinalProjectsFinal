<template>
  <div :class="isListMode ? 'w-full' : ''">
    <a
        v-bind="$attrs"
        :class="[
          isListMode
            ? 'flex items-center gap-4 backdrop-blur rounded-xl p-2 w-full cursor-pointer ' + (formData?.layout === 'left' ? 'text-left' : 'text-right')
            : 'rounded-xl text-center p-2 flex flex-col items-center justify-center transition hover:shadow-md backdrop-blur cursor-pointer',
          isDarkTheme ? 'bg-white/[0.02]' : isLightTheme ? 'bg-black/[0.02]' : 'bg-gradient-to-br from-white/60 via-white/30 to-white/10 border border-white/20'
        ]"
        @click.prevent="showModal = true"
        tabindex="0"
        role="button"
    >
      <!-- آیکون -->
      <div :class="[
        isListMode ? 'flex-shrink-0 rounded-xl flex items-center overflow-hidden w-[54px] h-[54px]' : 'w-[54px] h-[54px] rounded-xl flex items-center justify-center mb-2 overflow-hidden',
        isDarkTheme || isLightTheme ? '' : 'bg-gray-100'
      ]">
        <img
          v-if="sanitizedLink?.customIcon"
          :src="sanitizedLink.customIcon"
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
      <!-- متن -->
      <div :class="isListMode ? 'flex flex-col justify-center flex-1 min-w-0 ' + (formData?.layout === 'left' ? 'text-left' : 'text-right') : 'w-full text-center mt-0 flex-1 flex flex-col justify-center'">
        <div :class="[
          isListMode ? 'font-bold text-[14px] leading-snug break-words ' + (formData?.layout === 'left' ? 'text-left' : 'text-right') : 'font-bold text-[15px] leading-snug text-center break-words',
          isDarkTheme ? 'text-white' : 'text-gray-800'
        ]">
          {{ sanitizedLink.displayName || sanitizedLink.title || sanitizedLink.name || sanitizedLink.value || sanitizedLink.id || 'فرم تماس' }}
        </div>
        <div v-if="isListMode && sanitizedLink.description"
             :class="[
               'text-xs font-normal mt-1 leading-relaxed whitespace-pre-line break-words ' + (formData?.layout === 'left' ? 'text-left' : 'text-right'),
               isDarkTheme ? 'text-gray-300' : 'text-gray-600'
             ]">
          {{ sanitizedLink.description }}
        </div>
      </div>
    </a>
    <BaseModalGame v-model="showModal">
      <template #header>
        <div class="flex justify-between items-center p-4 border-b border-gray-100 bg-white">
          <div class="flex items-center gap-3">
            <img
              v-if="sanitizedLink?.customIcon"
              :src="sanitizedLink.customIcon"
              class="w-12 h-12 object-contain"
              alt="custom icon"
            />
            <component
                v-else
                :is="iconComponent"
                :size="50"
                v-bind="iconColor ? { color: iconColor, filled: isIconFilled } : {}"
            />
            <h3 class="text-lg font-semibold text-gray-800">{{
                sanitizedLink.displayName || sanitizedLink.title || sanitizedLink.name || sanitizedLink.value || sanitizedLink.id || 'فرم تماس'
              }}</h3>
          </div>
          <button
              @click="showModal = false"
              class="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <i class="ti ti-x text-lg"></i>
          </button>
        </div>
      </template>
      <template #default>
        <form @submit.prevent="handleSubmit" class="space-y-5 p-4">
          <!-- ...existing code... -->
          <template v-for="field in link.fields" :key="field.id">
            <div v-if="field.type === 'text'">
              <label class="block text-xs font-bold text-gray-600 mb-1">{{ field.label }}</label>
              <input v-model="formData[field.id]" :placeholder="field.placeholder" type="text"
                     class="w-full px-3 py-2 rounded-lg border border-gray-200 bg-gray-50 focus:ring-2 focus:ring-blue-200 focus:border-blue-400 transition"/>
            </div>
            <div v-else-if="field.type === 'email'">
              <label class="block text-xs font-bold text-gray-600 mb-1">{{ field.label }}</label>
              <input v-model="formData[field.id]" :placeholder="field.placeholder" type="email"
                     class="w-full px-3 py-2 rounded-lg border border-gray-200 bg-gray-50 ltr focus:ring-2 focus:ring-blue-200 focus:border-blue-400 transition"/>
            </div>
            <div v-else-if="field.type === 'number'">
              <label class="block text-xs font-bold text-gray-600 mb-1">{{ field.label }}</label>
              <input v-model="formData[field.id]" :placeholder="field.placeholder" type="number"
                     class="w-full px-3 py-2 rounded-lg border border-gray-200 bg-gray-50 ltr focus:ring-2 focus:ring-blue-200 focus:border-blue-400 transition"/>
            </div>
            <div v-else-if="field.type === 'mobile'">
              <label class="block text-xs font-bold text-gray-600 mb-1">{{ field.label }}</label>
              <input v-model="formData[field.id]" :placeholder="field.placeholder || 'مثلاً 09123456789'" type="tel"
                     class="w-full px-3 py-2 rounded-lg border border-gray-200 bg-gray-50 ltr focus:ring-2 focus:ring-blue-200 focus:border-blue-400 transition"/>
            </div>
            <div v-else-if="field.type === 'dropdown'">
              <label class="block text-xs font-bold text-gray-600 mb-1">{{ field.label }}</label>
              <select v-model="formData[field.id]"
                      class="w-full px-3 py-2 rounded-lg border border-gray-200 bg-gray-50 focus:ring-2 focus:ring-blue-200 focus:border-blue-400 transition">
                <option v-for="opt in getOptions(field)" :key="opt" :value="opt">{{ opt }}</option>
              </select>
            </div>
            <div v-else-if="field.type === 'radio'">
              <label class="block text-xs font-bold text-gray-600 mb-1">{{ field.label }}</label>
              <div class="flex flex-col gap-2">
                <label v-for="opt in getOptions(field)" :key="opt" class="flex items-center gap-2 cursor-pointer">
                  <input type="radio" :name="'radio_' + field.id" :value="opt" v-model="formData[field.id]"
                         class="accent-blue-600"/>
                  <span class="text-xs">{{ opt }}</span>
                </label>
              </div>
            </div>
            <div v-else-if="field.type === 'checkboxes'">
              <label class="block text-xs font-bold text-gray-600 mb-1">{{ field.label }}</label>
              <div class="flex flex-col gap-2">
                <label v-for="opt in getOptions(field)" :key="opt" class="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox"  :value="opt" v-model="formData[field.id]" class="accent-blue-600"/>
                  <span class="text-xs">{{ opt }}</span>
                </label>
              </div>
            </div>
            <div v-else-if="field.type === 'file'">
              <label class="block text-xs font-bold text-gray-600 mb-1">{{ field.label }}</label>
              <input type="file" @change="e => formData[field.id] = e.target.files[0]"
                     class="w-full file:mr-2 file:py-1 file:px-3 file:rounded-lg file:border-0 file:bg-blue-50 file:text-blue-700"/>
              <span v-if="formData[field.id]" class="text-xs text-gray-500 mt-1 block">{{
                  formData[field.id]?.name
                }}</span>
            </div>
            <div v-else-if="field.type === 'textarea'">
              <label class="block text-xs font-bold text-gray-600 mb-1">{{ field.label }}</label>
              <textarea v-model="formData[field.id]" :placeholder="field.placeholder" rows="3"
                        class="w-full px-3 py-2 rounded-lg border border-gray-200 bg-gray-50 focus:ring-2 focus:ring-blue-200 focus:border-blue-400 transition"></textarea>
            </div>
            <div v-else-if="field.type === 'checkbox'">
              <label class="flex items-center gap-2 cursor-pointer">
                <input v-model="formData[field.id]" type="checkbox" class="rounded border-gray-300 accent-blue-600"/>
                <span class="text-xs">{{ field.label || field.placeholder || 'تیک بزنید' }}</span>
              </label>
            </div>
          </template>
          <button type="submit"
                  class="w-full mt-6 py-3 bg-black text-white rounded-lg text-base font-bold hover:bg-gray-700 transition flex items-center justify-center gap-2">
            <i class="ti ti-send"></i>
            {{ link.submitButtonText || 'ارسال' }}
          </button>
          <div v-if="success" class="bg-green-100 text-green-700 p-3 rounded-lg text-center mt-4">
            {{ link.thankYouMessage || 'فرم با موفقیت ارسال شد!' }}
          </div>
        </form>
      </template>
    </BaseModalGame>
  </div>
  <InfoToast :visible="showToast" :message="toastMessage" :icon="toastIcon"/>
</template>

<script setup>
import {ref, reactive, computed} from 'vue'
import BaseModalGame from './Modals/BaseModalGame.vue'
import {useFormStore} from '~/stores/form'
import {useIconComponents} from '~/composables/useIconComponentsMap'
import {useNuxtApp} from "#app";
import InfoToast from "~/components/UserDashboard/modals/InfoToast.vue";

const props = defineProps({
  link: {type: Object, default: () => ({})},
  isListMode: {type: Boolean, default: false},
  isDarkTheme: {type: Boolean, default: false},
  isLightTheme: {type: Boolean, default: false},
  isBackgroundDark: {type: Boolean, default: false}
})

// دسترسی به store
const formStore = useFormStore()

// دسترسی به composable
const {getIconComponent} = useIconComponents()

// Get icon data and component
const iconData = computed(() => props.link?.icon || null)

const iconComponent = computed(() => {
  if (iconData.value?.type === 'component' && iconData.value?.name) {
    return getIconComponent(iconData.value.name)
  }
  // Default to form component
  return getIconComponent('form')
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

const formData = reactive({})
const success = ref(false)
const showModal = ref(false)

const sanitizedLink = computed(() => {
  const link = props.link || {}
  
  // برای آیتم‌های مشخص، title پیش‌فرض تعریف کن
  const getDefaultTitle = (action, originalTitle, name) => {
    const defaultTitles = {
      'call': 'تماس با ما',
      'number': 'پیام دهید', 
      'email': 'ایمیل ارسال کنید',
      'whatsapp': 'در واتساپ پیام دهید'
    }
    
    // اگر کاربر title کاستوم وارد کرده (متفاوت از نام اولیه آیتم)
    if (originalTitle && originalTitle.trim() && originalTitle !== name) {
      return originalTitle
    }
    
    // اگر title خالی یا همان نام اولیه است، title پیش‌فرض برگردان
    if (defaultTitles[action]) {
      return defaultTitles[action]
    }
    
    // در غیر این صورت title اصلی یا نام را برگردان
    return originalTitle || name
  }
  
  return {
    ...link,
    description: link.description && link.description.trim() && link.description !== '' ? link.description : '',
    displayName: getDefaultTitle(link.action, link.title, link.name)
  }
})

function getOptions(field) {
  if (field.optionsText) {
    return field.optionsText.split(/\r?\n/).map(opt => opt.trim()).filter(Boolean)
  }
  return []
}

const {$axios} = useNuxtApp()
const showToast = ref(false)
const toastMessage = ref('')
const toastIcon = ref('ti-alert-triangle') // یا 'ti-lock', 'ti-check', هر چی خواستی
const showInfoToast = (message, icon = 'ti-lock') => {
  toastMessage.value = message
  toastIcon.value = icon
  showToast.value = true
  setTimeout(() => showToast.value = false, 3000) // بعد از ۳ ثانیه بسته می‌شه
}

async function handleSubmit() {
  try {

    const data = new FormData()
    const files = []
    sanitizedLink.value.fields.forEach(field => {
      const value = formData[field.id]

      if (value !== undefined && value !== null) {

        if (field.type === 'file' && value instanceof File) {


          //files.push({field: field.id, file: value})
          files.push({field: 'fileData', file: value})
        } else if (Array.isArray(value)) {
          value.forEach(v => data.append(field.label + '[]', v)) // برای چک‌باکس چندتایی
        } else {
          data.append(field.label, value)   // مقدار عادی با لیبل
        }
      }
    });

    const response = await $axios.post(`club/${props.link?.hash}/recordForm`, data)
    if (files.length > 0) {
      const fileForm = new FormData()
      for (const {field, file} of files) {
        fileForm.append(field, file)
      }
      const uploadResponse = await uploadFiles(
          response.data?.data.id, response.data?.data.cardId
          , response.data?.data.modelType,
          fileForm)
      showInfoToast(response.data.message, 'ti-check');
    }

    // موفقیت
    success.value = true
    setTimeout(() => {
      success.value = false
      Object.keys(formData).forEach(k => formData[k] = '')
    }, 2000)
  } catch
      (error) {
    alert('مشکلی در ارسال فرم رخ داد. لطفاً دوباره تلاش کنید.')
  }
}

async function uploadFiles(linkId, cardId, modelType, fileForm) {
  const formData = new FormData()

  formData.append('modelType', modelType)
  formData.append('modelId', linkId)

  // تبدیل فایل‌ها از fileForm به formData
  for (const [field, value] of fileForm.entries()) {
    if (!value) continue

    if (typeof value === 'string' && value.startsWith('data:')) {
      const byteString = atob(value.split(',')[1])
      const ab = new ArrayBuffer(byteString.length)
      const ia = new Uint8Array(ab)
      for (let i = 0; i < byteString.length; i++) ia[i] = byteString.charCodeAt(i)
      const blob = new Blob([ab], { type: 'image/png' })
      formData.append(field, blob, `${field}.png`)
    } else {
      formData.append(field, value)
    }
  }
  try {
    const uploadResponse = await $axios.post(`file-manager/${linkId}/upload`, formData)

    if (uploadResponse.data?.success) {
      showInfoToast('فایل‌ها با موفقیت آپلود شدند ✅', 'ti-image')
    } else {
      showInfoToast('خطا در آپلود فایل‌ها ⚠️', 'ti-alert-triangle')
    }

    return uploadResponse
  } catch (error) {
    showInfoToast('خطا در ارتباط با سرور ⚠️', 'ti-alert-triangle')
  }
}
props.link.fields.forEach(field => {
  if (field.type === 'checkboxes') {
    formData[field.id] = []
  } else {
    formData[field.id] = ''
  }
})


</script>

<style scoped>
/* حذف ترنزیشن دستی collapse-fade و استفاده فقط از ترنزیشن تیلویند */
.collapse-fade-enter-active, .collapse-fade-leave-active {
  transition: none;
}

.collapse-fade-enter-from, .collapse-fade-leave-to {
  max-height: none;
  opacity: 1;
}

.collapse-fade-enter-to, .collapse-fade-leave-from {
  max-height: none;
  opacity: 1;
}

.collapse-content {
  transition: padding 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.bg-glass {
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.6) 60%, rgba(255, 255, 255, 0.3) 100%);
  backdrop-filter: blur(16px);
}
</style>

