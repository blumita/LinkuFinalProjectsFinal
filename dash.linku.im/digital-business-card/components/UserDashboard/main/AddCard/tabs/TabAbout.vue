<template>
  <div class="space-y-3">
    <!-- Card name and layout -->
    <div class="flex flex-wrap justify-between items-center w-full">
      <div class="flex gap-2">
        <div class="flex items-center gap-2 bg-gray-50 px-3 py-2 rounded-lg border border-gray-200"
             @click="openCardNameModal"

             :class="[
    formSaved ? 'cursor-not-allowed opacity-60' : 'cursor-pointer',
    (typeof form.cardName !== 'string' || !form.cardName.trim())
      ? 'border-red-500 text-red-600'
      : 'border-gray-200 text-gray-700'
  ]"
        >
          <label class="text-sm font-medium text-gray-700 hidden md:block">نام کارت:</label>
          <span class="text-sm font-semibold text-gray-800 hidden md:block">{{ cardNameLabel }}</span>
          <i class="ti ti-pencil text-sm"
             :class="formSaved ? 'text-gray-300' : 'text-gray-400'"></i>
        </div>

        <!-- دکمه پیش‌نمایش -->
        <button
            class="bg-black text-white px-4 py-2 rounded-lg flex items-center gap-2 shadow-sm sm:hidden"
            @click="$emit('open-preview')"
        >
          <i class="ti ti-eye text-base"/>
          <span class="text-sm font-medium">پیش‌نمایش</span>
        </button>
      </div>

      <div class="relative text-sm">
        <div
            @click="toggleDropdown"
            class="flex items-center gap-1 cursor-pointer bg-gray-50 border border-gray-200 px-3 py-2 rounded-lg"
            :class="formSaved ? 'text-gray-400 cursor-not-allowed bg-gray-100' : 'text-gray-700'"
        >
          <span>{{ layoutLabel }}</span>
          <i class="ti ti-chevron-down text-xs"></i>
        </div>
        <ul v-if="dropdownOpen"
            class="absolute right-0 mt-1 w-40 bg-white border border-gray-200 rounded shadow z-10 text-right text-gray-700">
          <li v-for="(label, value) in layoutOptions" :key="value" @click="setLayout(value)"
              class="px-3 py-1.5 hover:bg-gray-100 cursor-pointer">{{ label }}
          </li>
        </ul>
      </div>
    </div>

    <!-- Uploaders -->
    <div class="grid grid-cols-1 sm:grid-cols-3 gap-2 border p-4 border-gray-200 rounded-lg">
      <ImageUploader label="عکس پروفایل" :image="form.profileImage" field="profileImage" :aspectRatio="1"
                     @select="handleImageUpload" @remove="removeImage" :disabled="formSaved"/>
      <ImageUploader label="تصویر کاور" :image="form.coverImage" field="coverImage" :aspectRatio="1.78" wide
                     @select="handleImageUpload" @remove="removeImage" :disabled="formSaved"/>
      <ImageUploader label="لوگوی شرکت" :image="form.logoImage" field="logoImage" :aspectRatio="1"
                     @select="handleImageUpload" @remove="removeImage" :disabled="formSaved"/>
    </div>

    <!-- Text fields - مرتب شده طبق ترتیب preview -->
    <div class="space-y-4">
      <!-- ردیف اول: نام کامل -->
      <div class="grid grid-cols-1">
        <TextInput
            label="نام کامل"
            v-model="form.name"
            placeholder="نام و نام خانوادگی"
            :maxlength="40"
            :required="true"
            :error="nameError"
            :disabled="formSaved"
        />
      </div>

      <!-- ردیف دوم: سمت شغلی و شرکت -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <TextInput label="سمت شغلی" v-model="form.job" placeholder="عنوان شغلی"
                   :maxlength="30"
                   :error="form.job && form.job.length > 30 ? 'حداکثر ۳۰ کاراکتر مجاز است' : ''"
                   :disabled="formSaved"
        />
        <TextInput label="شرکت" v-model="form.company" placeholder="نام سازمان"
                   :maxlength="30"
                   :error="form.company && form.company.length > 30 ? 'حداکثر ۳۰ کاراکتر مجاز است' : ''"
                   :disabled="formSaved"
        />
      </div>

      <!-- ردیف سوم: موقعیت -->
      <div class="grid grid-cols-1">
        <TextInput label="موقعیت جغرافیایی" v-model="form.location" placeholder="شهر، کشور"
                   :maxlength="30"
                   :error="form.location && form.location.length > 30 ? 'حداکثر ۳۰ کاراکتر مجاز است' : ''"
                   :disabled="formSaved"
        />
      </div>
    </div>

    <!-- بیوگرافی - آخرین فیلد -->
    <TextAreaInput label="بیوگرافی" v-model="form.bio" placeholder="درباره خود توضیح دهید..."
                   :maxlength="100"
                   :error="form.bio && form.bio.length > 100 ? 'حداکثر 100 کاراکتر مجاز است' : ''"
                   :disabled="formSaved"
    />
    <TextInput label="عنوان دکمه ذخیره مخاطب" v-model="form.saveContact" placeholder="دکمه ذخیره مخاطب"
               :maxlength="20"
               :error="form.saveContact && form.saveContact.length > 20 ? 'حداکثر ۲۰ کاراکتر مجاز است' : ''"
               :disabled="formSaved"
    />
    <!-- Theme colors -->
    <div>
      <h3 class="text-base font-medium text-gray-600 pb-2">بخش رنگ ظاهری کارت</h3>
      <div class="bg-gray-100 p-4 rounded-2xl space-y-4">
        <ThemePicker :themeColor="form.themeColor" @update="color => form.themeColor = color" :disabled="formSaved"/>
        <IconColorPicker :selected="form.iconColor" :match-theme-color="false"
                         @update="color => form.iconColor = color"
                         @update:matchTheme="val => form.matchThemeColor = val"
                         :disabled="formSaved"/>
      </div>
    </div>

    <!-- Actions برای AddCard -->
    <div v-if="isAddMode" class="flex justify-between items-center pt-4 border-t">
      <div class="text-sm">
        <span v-if="isAboutComplete" class="text-green-600 flex items-center">
          <i class="ti ti-check ml-1"></i>
          آماده برای مرحله بعد
        </span>
        <span v-else-if="nameError" class="text-red-600 flex items-center">
          <i class="ti ti-alert-circle ml-1"></i>
          {{ nameError }}
        </span>
        <span v-else class="text-gray-600">
          نام کامل را وارد کنید
        </span>
      </div>
      <button
          @click="goToNextStep"
          :disabled="!isAboutComplete"
          class="px-6 py-3 rounded-md transition-colors text-sm font-medium"
          :class="{
          'bg-black hover:bg-gray-800 text-white': isAboutComplete,
          'bg-gray-300 text-gray-500 cursor-not-allowed': !isAboutComplete
        }"
      >
        <i class="ti ti-arrow-left ml-1"></i>
        ادامه
      </button>
    </div>

    <!-- Actions برای EditCard -->
    <div v-else class="flex justify-end space-x-3 pt-4">
      <button @click="resetForm" class="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50">
        بازنشانی
      </button>
      <button @click="onSaveClick" :disabled="saving"
              class="px-4 py-2 bg-black text-white rounded-md hover:bg-black/90 flex items-center min-w-[140px] justify-center">
        <template v-if="saving">
          <svg class="animate-spin mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none"
               viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
          </svg>
          <span>در حال ذخیره اطلاعات...</span>
        </template>
        <span v-else>ذخیره تغییرات</span>
      </button>
    </div>

    <CardNameModal
        :isOpen="cardNameModalOpen"
        :currentCardName="typeof form.cardName === 'string' ? form.cardName : ''"
        @close="closeCardNameModal"
        @update="updateCardName"
    />

    <ImageCropperModal v-if="cropper.show" :show="cropper.show" :image-file="cropper.imageFile"
                       :aspect-ratio="cropper.aspectRatio" @close="closeCropper" @save="saveCroppedImage"/>
  </div>
  <InfoToast :visible="showToast" :message="toastMessage" :icon="toastIcon"/>
</template>

<script setup>
import {ref, computed, onMounted} from 'vue'
import {defaultFields, useFormStore} from '~/stores/form'
import {useUserStore} from '~/stores/user'
import ImageUploader from '../../EditCard/tabs/about/ImageUploader.vue'
import TextInput from '../../EditCard/tabs/about/TextInput.vue'
import TextAreaInput from '../../EditCard/tabs/about/TextAreaInput.vue'
import ThemePicker from '../../EditCard/tabs/about/ThemePicker.vue'
import IconColorPicker from '../../EditCard/tabs/about/IconColorPicker.vue'
import ImageCropperModal from '../../../modals/ImageCropperModal.vue'
import CardNameModal from '../../../modals/CardNameModal.vue'
import InfoToast from "~/components/UserDashboard/modals/InfoToast.vue";
import {useLinkStore} from "~/stores/link.js";
import {useCardStore} from "~/stores/card.js";

const props = defineProps({
  isAddMode: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['go-to-next-step'])
const {$axios} = useNuxtApp()
const formStore = useFormStore()
const form = useFormStore()
const showPreviewMobile = ref(false)
const cardNameModalOpen = ref(false)
const cropper = ref({show: false, imageFile: undefined, aspectRatio: 1, fieldName: ''})
const saving = ref(false)


// بررسی تکمیل بودن About برای AddCard
const isAboutComplete = computed(() => {
  return !!(form.name && form.name.trim().length > 0 && !nameError.value)
})

// ولیدیشن فیلد نام
const nameError = computed(() => {
  if (!form.name || form.name.trim().length === 0) {
    return props.isAddMode ? 'نام کامل الزامی است' : ''
  }
  if (form.name.trim().length < 2) {
    return 'نام باید حداقل ۲ کاراکتر باشد'
  }
  if (form.name.length > 40) {
    return 'حداکثر ۴۰ کاراکتر مجاز است'
  }
  // بررسی اینکه فقط حروف و فاصله باشد
  const namePattern = /^[آ-یa-zA-Z\s]+$/
  if (!namePattern.test(form.name.trim())) {
    return 'فقط حروف فارسی، انگلیسی و فاصله مجاز است'
  }
  return ''
})
const formSaved = computed(() => form.formSaved)
// رفتن به مرحله بعد (Links)
const goToNextStep = () => {

  if (isAboutComplete.value && !formSaved.value) {
    onSaveClick();
  }
}
const message = ref('')
const showToast = ref(false)
const toastMessage = ref('')
const toastIcon = ref('ti-alert-triangle')
const showInfoToast = (message, icon = 'ti-lock') => {
  toastMessage.value = message
  toastIcon.value = icon
  showToast.value = true
  setTimeout(() => showToast.value = false, 3000)
}

function handleImageUpload({file, field, aspectRatio}) {
  cropper.value = {show: true, imageFile: file, aspectRatio, fieldName: field}
}

function saveCroppedImage(base64) {
  if (!base64 || !cropper.value.fieldName) return
  form[cropper.value.fieldName] = base64
  closeCropper()
}

function closeCropper() {
  cropper.value = {show: false, imageFile: undefined, aspectRatio: 1, fieldName: ''}
}

function removeImage(field) {
  form[field] = null
}

async function saveForm() {

  // ارسال event برای ذخیره کامل فرم
  const saveEvent = new CustomEvent('manual-save', {
    detail: {source: 'about-form'}
  })
  window.dispatchEvent(saveEvent)

  //API for save card
  const formData = new FormData()

  formData.append('cardName', form.cardName || '')
  formData.append('name', form.name || '')
  formData.append('location', form.location || '')
  formData.append('job', form.job || '')
  formData.append('company', form.company || '')
  formData.append('bio', form.bio || '')
  formData.append('saveContact', form.saveContact || '')
  formData.append('themeColor', JSON.stringify(form.themeColor || {}))
  formData.append('iconColor', JSON.stringify(form.iconColor || {}))
  formData.append('matchThemeColor', form.matchThemeColor ? 1 : 0)
  formData.append('layout', form.layout || '')


  try {

    // Send form data to backend
    const response = await $axios.post('v1/cards', formData)

    // Check if the response was successful
    if (response.data.success) {

      const newCard = response.data.data

      await uploadImages(newCard.id)

      formStore.addCard(newCard)

      // بروزرسانی userStore برای نمایش real-time در داشبورد
      const userStore = useUserStore()
      await userStore.fetchUser()

      //showInfoToast(response.data.message, 'ti-check')
      message.value = response.data.message // مقداردهی درست
      emit('go-to-next-step', message.value)
    } else {
      // Backend responded with success: false
      showInfoToast(response.data.message, 'ti-alert-triangle')
    }

  } catch (error) {
    // Handle server-side errors
    if (error.response) {
      const status = error.response.status
      const data = error.response.data

      if (status === 403 || status === 422 || status === 500) {

        showInfoToast(data.message, 'ti-alert-circle')
      } else {
        // Unexpected status code
        showInfoToast(data.message, 'ti-alert-circle')
      }
    } else {
      // Network or unknown error
      showInfoToast('اتصال به سرور ممکن نیست.', 'ti-alert-triangle')
    }

  } finally {
    // Reset loading state
    saving.value = true
  }
}

async function uploadImages(cardId) {
  const imageFields = ['profileImage', 'coverImage', 'logoImage']
  const imageData = new FormData()

  imageData.append('modelType', 'card' || '')
  imageData.append('modelId', cardId || '')

  function base64ToBlob(base64, mime) {
    const byteString = atob(base64.split(',')[1])
    const ab = new ArrayBuffer(byteString.length)
    const ia = new Uint8Array(ab)
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i)
    }
    return new Blob([ab], {type: mime})
  }

  for (const field of imageFields) {
    const image = form[field]
    if (!image) continue
    if (typeof image === 'string' && image.startsWith('data:')) {
      const blob = base64ToBlob(image, 'image/png')
      imageData.append(field, blob, `${field}.png`)
    } else {
      imageData.append(field, image)
    }
  }

  try {
    const {$axios} = useNuxtApp()
    const uploadResponse = await $axios.post(`file-manager/${cardId}/upload`, imageData)

    if (uploadResponse.data.success) {
      showInfoToast('تصاویر با موفقیت آپلود شدند', 'ti-image')
    } else {
      showInfoToast('آپلود تصاویر با خطا مواجه شد', 'ti-alert-triangle')
    }
  } catch (error) {
    showInfoToast('خطا در آپلود تصاویر', 'ti-alert-triangle')
  }
}

function onSaveClick() {
  if (saving.value) return;
  saving.value = true;
  saveForm();
}

function resetForm() {
  form.$reset()
}

function openCardNameModal() {
  cardNameModalOpen.value = true
}

function closeCardNameModal() {
  cardNameModalOpen.value = false
}

function updateCardName(newName) {
  form.cardName = newName
  cardNameModalOpen.value = false
}

const dropdownOpen = ref(false)
const layoutOptions = {
  right: 'راست‌چین',
  left: 'چپ‌چین',
  center: 'وسط‌چین',
  portrait: 'پرتره'
}
const layoutLabel = computed(() => layoutOptions[form.layout])
const toggleDropdown = () => (dropdownOpen.value = !dropdownOpen.value)
const setLayout = (val) => {
  form.layout = val
  dropdownOpen.value = false
}
const cardNameLabel = computed(() => (typeof form.cardName === 'string' && form.cardName.trim() !== '' ? form.cardName : 'نام کارت را وارد کنید'))
const linkStore = useLinkStore()
const cardStore=useCardStore()
function handleBack() {
  // اگر نیاز به رویداد خاصی دارید اینجا emit کنید
  // $emit('back')
  history.back();
}

watchEffect(async () => {
  const id = formStore.newCard.id
  if (!id) return

  // دریافت لینک‌ها
  await linkStore.fetchLinks(id)
  form.links = linkStore.links


  await cardStore.fetchCard(id)

  const fetchedFields = cardStore.activeCard.fields


  if (Array.isArray(fetchedFields)) {
    form.fields = fetchedFields
  }

  if (!Array.isArray(form.fields) || form.fields.length === 0) {
    form.fields = structuredClone(defaultFields)
  }
})
</script>
