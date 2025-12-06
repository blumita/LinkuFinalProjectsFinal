<template>
  <div class="bg-background flex flex-col h-full">
    <div class="flex-1 overflow-y-auto p-4 space-y-6 pb-20 lg:pb-4">
      <!-- Icon Upload RTL: Icon right, text left -->
      <div class="flex flex-row items-center gap-4 mb-2 w-full justify-start rtl:justify-start">
        <div class="relative w-20 h-20 flex-shrink-0 order-1 flex items-center justify-center">
          <img
            v-if="form.customIcon"
            :src="form.customIcon"
            class="w-full h-full rounded-xl bg-muted object-cover cursor-pointer"
            @click="iconFileInput?.click()"
          >
          <!-- Dynamic icon component -->
          <div
            v-else-if="iconComponent && iconData?.type === 'component'"
            class="w-full h-full rounded-xl bg-muted flex items-center justify-center cursor-pointer"
            @click="iconFileInput?.click()"
          >
            <component 
              :is="iconComponent"
              :size="80"
              v-bind="iconColor ? { color: iconColor, filled: isIconFilled } : {}"
            />
          </div>
          <!-- Fallback to image -->
          <img
            v-else-if="safeIcon"
            :src="safeIcon"
            class="w-full h-full rounded-xl bg-muted object-contain  cursor-pointer"
            @click="iconFileInput?.click()"
          >
          <div
            v-else
            class="w-full h-full rounded-xl bg-muted flex items-center justify-center text-muted-foreground text-2xl cursor-pointer"
            @click="iconFileInput?.click()"
          >
            <i class="ti ti-file" />
          </div>
          <input
            ref="iconFileInput"
            type="file"
            accept="image/png,image/jpeg,image/jpg,image/webp,image/bmp,image/svg+xml"
            class="hidden"
            @change="handleIconUpload"
          >
        </div>
        <p
          class="text-sm text-primary font-medium cursor-pointer order-2"
          @click="iconFileInput?.click()"
        >
          برای تغییر آیکون کلیک کنید
        </p>
      </div>

    <!-- Inputs -->
    <div class="space-y-4">
      <!-- نوع فایل/لینک -->
      <div class="mb-4">
        <label class="block text-sm font-medium text-foreground mb-2">نوع محتوا</label>
        <div class="flex gap-2">
          <button 
            type="button" 
            :class="[form.fileType === 'upload' ? 'bg-primary/10 border-primary text-foreground' : 'bg-muted border-border', 'border rounded-lg p-2 flex items-center justify-center transition flex-1 text-foreground']"
            @click="selectFileType('upload')"
          >
            <i class="ti ti-upload ml-1 text-foreground" />
            آپلود فایل
          </button>
          <button 
            type="button" 
            :class="[form.fileType === 'link' ? 'bg-primary/10 border-primary text-foreground' : 'bg-muted border-border', 'border rounded-lg p-2 flex items-center justify-center transition flex-1 text-foreground']"
            @click="selectFileType('link')"
          >
            <i class="ti ti-link ml-1 text-foreground" />
            لینک فایل
          </button>
        </div>
      </div>

      <!-- آپلود فایل -->
      <div v-if="form.fileType === 'upload'">
        <label class="block text-sm font-medium text-foreground mb-1">فایل (حداکثر 5 مگابایت)</label>
        <label class="flex flex-row-reverse items-center gap-2 cursor-pointer w-full">
          <input
            ref="mainFileInput"
            type="file"
            class="hidden"
            @change="handleFileUpload"
          >
          <i class="ti ti-upload text-primary text-lg" />
          <span class="px-4 py-2 bg-muted rounded-lg border border-border text-sm flex-1 text-right truncate text-foreground">
            {{ form.fileName ? 'فایل انتخاب‌شده: ' + form.fileName : 'انتخاب فایل' }}
          </span>
        </label>
        <div v-if="uploadError" class="text-destructive text-xs mt-1">{{ uploadError }}</div>
      </div>

      <!-- لینک فایل -->
      <div v-if="form.fileType === 'link'">
        <label class="block text-sm font-medium text-foreground mb-1">لینک فایل</label>
        <input
          v-model="form.value"
          type="url"
          placeholder="مثلاً https://example.com/file.pdf"
          class="w-full px-4 py-2 bg-muted rounded-lg border border-border text-sm text-foreground"
        >
      </div>

      <!-- عنوان -->
      <div>
        <label class="block text-sm font-medium text-foreground mb-1">عنوان</label>
        <input
          v-model="form.title"
          type="text"
          :placeholder="form.placeholder?.title || 'مثلاً فایل معرفی شرکت'"
          class="w-full px-4 py-2 bg-muted rounded-lg border border-border text-sm text-foreground">
      </div>

      <!-- Toggle for description -->
      <div class="flex items-center justify-between">
        <div>
          <label class="text-sm font-medium text-foreground">نمایش توضیحات</label>
          <p class="text-xs text-muted-foreground mt-1">توضیحات اضافی برای فایل نمایش داده شود</p>
        </div>
        <label class="relative inline-flex items-center cursor-pointer">
          <input v-model="form.showDescription" type="checkbox" class="sr-only peer">
          <div class="w-11 h-6 bg-muted peer-focus:ring-2 peer-focus:ring-primary/20 rounded-full peer peer-checked:bg-primary transition-all duration-300" />
          <div class="absolute left-0.5 top-0.5 w-5 h-5 bg-background rounded-full transition-transform duration-300 peer-checked:translate-x-full" />
        </label>
      </div>

      <!-- توضیحات -->
      <div v-if="form.showDescription">
        <label class="block text-sm font-medium text-foreground mb-1">توضیحات</label>
        <input
          v-model="form.description"
          type="text"
          placeholder="مثلاً توضیح درباره فایل یا لینک"
          class="w-full px-4 py-2 bg-muted rounded-lg border border-border text-sm text-foreground">
      </div>
    </div>
    </div>

    <!-- Fixed Bottom Actions -->
    <div class="border-t border-border bg-background p-4 fixed bottom-0 left-0 right-0 lg:relative lg:bottom-auto lg:left-auto lg:right-auto">
      <div class="flex items-center gap-3">
        <button type="button" class="flex-1 bg-muted text-muted-foreground font-medium py-3 rounded-lg hover:bg-muted/80 transition-colors" @click="$emit('cancel')">
          انصراف
        </button>
        <button type="button" class="flex-1 bg-primary text-primary-foreground font-medium py-3 rounded-lg hover:bg-primary/90 transition-colors" @click="submitForm">
          <i class="ti ti-check mr-1" />
          ذخیره
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, watch, computed, ref } from 'vue'
import { useIconComponents } from '~/composables/useIconComponentsMap'
import { useFormStore } from '~/stores/form'

const props = defineProps({
  link: {
    type: Object,
    default: () => ({})
  }
})
const emit = defineEmits(['submit', 'cancel'])

// File input references
const iconFileInput = ref(null)

// Access form store for dynamic coloring
const formStore = useFormStore()

// استفاده از icon components composable
const { getIconComponent } = useIconComponents()

const form = reactive({
  ...props.link,
  title: props.link?.title || '',
  value: props.link?.value || '',
  description: props.link?.description || '',
  placeholder: props.link?.placeholder || {},
  icon: props.link?.icon || { type: 'component', name: 'file' },
  customIcon: props.link?.customIcon || '',
  showDescription: typeof props.link?.showDescription === 'boolean' ? props.link.showDescription : true, // مقدار پیش‌فرض true
  fileType: props.link?.fileType || 'upload', // upload یا link
  fileName: props.link?.fileName || '', // نام فایل آپلودی
  fileData: props.link?.fileData || null // داده فایل
})

// خطا برای آپلود فایل
const uploadError = ref('')

// Icon data and component computation using composable
const iconData = computed(() => {
  return form.icon || null;
})

const iconComponent = computed(() => {
  return getIconComponent(iconData.value);
})

// Safe icon fallback using composable
const safeIcon = computed(() => {
  return getSafeIcon(form);
})

// Dynamic icon coloring from form store (same as LinkItem.vue)
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

function handleIconUpload(event) {
  const file = event.target.files[0]
  if (file) {
    const reader = new FileReader()
    reader.onload = e => {
      form.customIcon = e.target.result
    }
    reader.readAsDataURL(file)
  }
}

function handleFileUpload(event) {
  const file = event.target.files[0]
  if (file) {
    // بررسی سایز فایل (5 مگابایت = 5 * 1024 * 1024 بایت)
    const maxSize = 6 * 1024 * 1024
    if (file.size > maxSize) {
      uploadError.value = 'سایز فایل نمی‌تواند بیشتر از 5 مگابایت باشد'
      return
    }
    
    uploadError.value = ''
    form.fileName = file.name
    
    // تبدیل فایل به base64
    const reader = new FileReader()
    reader.onload = e => {
      form.fileData = e.target.result
      form.value = file.name // برای سازگاری با نسخه قبل
    }
    reader.readAsDataURL(file)
  }
}

function selectFileType(type) {
  form.fileType = type
  uploadError.value = ''
  
  // پاک کردن داده‌های قبلی
  if (type === 'upload') {
    form.value = ''
  } else {
    form.fileName = ''
    form.fileData = null
  }
}

function submitForm() {
  emit('submit', { ...form })
}

watch(() => form.showDescription, (val) => {
  if (!val) form.description = ''
})

watch(() => form.fileType, () => {
  uploadError.value = ''
})
</script>

<script>
export default {
  name: 'File',
}
</script>



