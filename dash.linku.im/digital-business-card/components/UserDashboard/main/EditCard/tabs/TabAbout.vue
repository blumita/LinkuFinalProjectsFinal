<template>
  <div class="space-y-3">
    <!-- Cover and Avatar Section - New Design -->
    <CoverAvatarSection />

    <!-- Text fields - مرتب شده طبق ترتیب preview -->
    <div class="space-y-4">
      <!-- ردیف اول: نام کامل -->
      <div class="grid grid-cols-1">
        <TextInput label="نام کامل" v-model="form.name" placeholder="نام و نام خانوادگی"
                   :maxlength="40"
                   :error="form.name && form.name.length > 40 ? 'حداکثر ۴۰ کاراکتر مجاز است' : ''"
        />
      </div>

      <!-- ردیف دوم: سمت شغلی و شرکت -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <TextInput label="سمت شغلی" v-model="form.job" placeholder="عنوان شغلی"
                   :maxlength="30"
                   :error="form.job && form.job.length > 30 ? 'حداکثر ۳۰ کاراکتر مجاز است' : ''"
        />
        <TextInput label="شرکت" v-model="form.company" placeholder="نام سازمان"
                   :maxlength="30"
                   :error="form.company && form.company.length > 30 ? 'حداکثر ۳۰ کاراکتر مجاز است' : ''"
        />
      </div>

      <!-- ردیف سوم: موقعیت -->
      <div class="grid grid-cols-1">
        <TextInput label="موقعیت جغرافیایی" v-model="form.location" placeholder="شهر، کشور"
                   :maxlength="30"
                   :error="form.location && form.location.length > 30 ? 'حداکثر ۳۰ کاراکتر مجاز است' : ''"
        />
      </div>
    </div>

    <!-- بیوگرافی - آخرین فیلد -->
    <TextAreaInput label="بیوگرافی" v-model="form.bio" placeholder="درباره خود توضیح دهید... (تا 10 خط)"
                   :maxlength="500"
                   :rows="10"
                   :error="form.bio && form.bio.length > 500 ? 'حداکثر 500 کاراکتر مجاز است' : ''"
    />
    <TextInput label="عنوان دکمه ذخیره مخاطب" v-model="form.saveContact" placeholder="دکمه ذخیره مخاطب"
               :maxlength="20"
               :error="form.saveContact && form.saveContact.length > 20 ? 'حداکثر ۲۰ کاراکتر مجاز است' : ''"
    />
    <!-- بخش رنگ‌بندی یکپارچه -->
    <div>
      <h3 class="text-base font-medium text-foreground mb-3">رنگ‌بندی کارت</h3>
      <div class="bg-card border border-border p-6 rounded-xl space-y-6">
        <!-- انتخاب رنگ اصلی -->
        <div class="space-y-3">
          <h4 class="text-sm font-semibold text-foreground">رنگ اصلی</h4>
          <p class="text-xs text-muted-foreground">با انتخاب یک رنگ، هم پس‌زمینه و هم رنگ آیکون‌ها تنظیم می‌شود</p>
          <ThemePicker />
        </div>
        
        <!-- تنظیمات پیشرفته -->
        <div class="pt-4 border-t border-border/50">
          <IconColorPicker :selected="form.iconColor" :matchThemeColor="form.matchThemeColor"
                           @update="color => form.iconColor = color"
                           @update:matchTheme="val => form.matchThemeColor = val"/>
        </div>
      </div>
    </div>

    <CardNameModal
        :isOpen="cardNameModalOpen"
        :currentCardName="typeof form.cardName === 'string' ? form.cardName : ''"
        @close="closeCardNameModal"
        @update="updateCardName"
    />
  </div>
  <InfoToast :visible="showToast" :message="toastMessage" :icon="toastIcon"/>
</template>

<script setup>
import {ref, computed, onMounted, onUnmounted} from 'vue'
import {defaultFields, useFormStore} from '~/stores/form'
import TextInput from './about/TextInput.vue'
import TextAreaInput from './about/TextAreaInput.vue'
import ThemePicker from './about/ThemePicker.vue'
import IconColorPicker from './about/IconColorPicker.vue'
import CoverAvatarSection from '../components/CoverAvatarSection.vue'
import CardNameModal from '../../../modals/CardNameModal.vue'
import InfoToast from "~/components/UserDashboard/modals/InfoToast.vue";
import {useCardStore} from "~/stores/card.js";
import {useLinkStore} from "~/stores/link.js";

const emit = defineEmits(['open-preview'])
//const props = defineProps({cardId: String})
const route = useRoute()
const cardId = ref('')
const slug = ref('')
const form = useFormStore()
const {$axios} = useNuxtApp()
const showPreviewMobile = ref(false)
const cardNameModalOpen = ref(false)
const saving = ref(false)
const showToast = ref(false)
const toastMessage = ref('')
const toastIcon = ref('ti-alert-triangle')
const showInfoToast = (message, icon = 'ti-lock') => {
  toastMessage.value = message
  toastIcon.value = icon
  showToast.value = true
  setTimeout(() => showToast.value = false, 3000)
}
watch(() => route.query, (query) => {
  if (query.id) {
    cardId.value = query.id
    slug.value = query.slug || ''
  }
}, {immediate: true})

async function saveForm() {
  // ارسال event برای ذخیره کامل فرم
  const saveEvent = new CustomEvent('manual-save', {
    detail: {source: 'about-form'}
  })
  window.dispatchEvent(saveEvent)
  // شبیه‌سازی تاخیر ذخیره (در صورت نیاز حذف شود)
  //await new Promise(r => setTimeout(r, 1000))

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
  formData.append('layoutMode', form.layout || '')

  try {
    // Send form data to backend
    const response = await $axios.post(`v1/cards/${cardId.value}/update`, formData,
        {
          headers: {'X-HTTP-Method-Override': 'PUT'}
        }
    )

    // Check if the response was successful
    if (response.data.success) {

      await uploadImages(cardId.value)

      // بروزرسانی userStore برای نمایش real-time در داشبورد
      const userStore = useUserStore()
      await userStore.fetchUser()

      showInfoToast(response.data.message, 'ti-check')

    } else {
      // Backend responded with success: false
      showInfoToast(response.data.message, 'ti-alert-triangle')
    }

  } catch (error) {
    // Handle server-side errors
    if (error.response) {
      const status = error.response.status

      if (status === 403 || status === 422 || status === 500) {

        showInfoToast(error.response.data.message, 'ti-alert-triangle')
      } else {
        // Unexpected status code
        showInfoToast(error.response.data.message, 'ti-alert-triangle')
      }
    } else {
      // Network or unknown error
      showInfoToast('اتصال به سرور ممکن نیست.', 'ti-alert-triangle')
    }

  } finally {
    // Reset loading state
    saving.value = false
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

  let hasFile = false

  for (const field of imageFields) {
    const image = form[field]
    if (!image) continue
    // شرط 1: کاربر تازه تصویر انتخاب کرده (base64)
    if (typeof image === 'string' && image.startsWith('data:')) {
      const blob = base64ToBlob(image, 'image/png')
      imageData.append(field, blob, `${field}.png`)
      hasFile = true
      continue
    }

    // شرط 2: تصویر یک File/Blob آبجکت هست (کاربر از input انتخاب کرده)
    if (image instanceof File || image instanceof Blob) {
      imageData.append(field, image)
      hasFile = true
      continue
    }

    // شرط 3: اگر رشته باشه و شبیه URL (http:// یا /storage/...) باشه → از سرور خونده شده → تغییر نکرده → نادیده بگیر
    if (typeof image === 'string' && (image.startsWith('http') || image.startsWith('/storage/'))) {

    }
  }

  if (!hasFile) {
    return
  }

  try {

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
  if (!form.cardName) {
    const card = form.cards.find(c => c.id === cardId.value)
    form.cardName = card?.name || ''
  }
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
const cardNameLabel = computed(() => (
    typeof form.cardName === 'string'
    && form.cardName.trim() !== ''
        ? form.cardName : 'نام کارت را وارد کنید'))
const matchThemeColor = computed(() => form.matchThemeColor ?? false)

function handleBack() {
  // اگر نیاز به رویداد خاصی دارید اینجا emit کنید
  // $emit('back')
  history.back();
}

const cardStore = useCardStore()
const linkStore = useLinkStore()
watchEffect(async () => {
  const id = cardId.value
  if (!id) return

  // دریافت لینک‌ها
  await linkStore.fetchLinks(id)
  form.links = linkStore.links


  await cardStore.fetchCard(id)

  const fetchedFields = cardStore.activeCard?.fields


  if (Array.isArray(fetchedFields)) {
    form.fields = fetchedFields
  }

  // اگر هنوز فیلدی نداشتیم، مقدار پیش‌فرض بده
  if (!Array.isArray(form.fields) || form.fields.length === 0) {
    form.fields = structuredClone(defaultFields)
  }
})


onMounted(() => {
  // Listen for manual save events from header button
  window.addEventListener('manual-save', (event) => {
    if (event.detail?.source === 'header-save') {
      saveForm()
    }
  })
})

onUnmounted(() => {
  // Clean up event listener
  window.removeEventListener('manual-save', (event) => {
    if (event.detail?.source === 'header-save') {
      saveForm()
    }
  })
})
</script>
