<template>
  <div class="bg-background flex flex-col h-full">
    <div class="flex-1 overflow-y-auto p-4 space-y-6 pb-20 lg:pb-4">

    <!-- Icon Upload -->
    <div class="flex items-center gap-4">
      <div class="relative w-20 h-20">
        <img 
          v-if="form.customIcon" 
          :src="form.customIcon" 
          class="w-full h-full rounded-xl object-cover cursor-pointer"
          @click="iconFileInput?.click()"
        />
        <div
          v-else-if="iconComponent"
          class="w-full h-full rounded-xl bg-muted flex items-center justify-center cursor-pointer"
          @click="iconFileInput?.click()"
        >
          <component 
            :is="iconComponent" 
            :size="80"
            v-bind="iconColor ? { color: iconColor, filled: isIconFilled } : {}"
          />
        </div>
        <div 
          v-else 
          class="w-full h-full rounded-xl bg-muted flex items-center justify-center text-muted-foreground text-2xl cursor-pointer"
          @click="iconFileInput?.click()"
        >
          <i class="ti ti-star" />
        </div>
        <input 
          ref="iconFileInput"
          type="file" 
          accept="image/*" 
          class="hidden" @change="handleIconUpload"
        />
      </div>
      <div class="flex flex-col items-start gap-2 flex-1">
        <p class="text-sm text-primary font-medium cursor-pointer text-right" @click="iconFileInput?.click()">کلیک کنید تا آیکون تغییر کند</p>
      </div>
    </div>

    <!-- Background Image Upload -->
    <div class="space-y-2">
      <label class="block text-sm font-medium text-foreground mb-1">
        عکس پس‌زمینه (اختیاری)
      </label>
      <div class="relative">
        <div 
          v-if="form.backgroundImage" 
          class="w-full h-32 rounded-lg overflow-hidden cursor-pointer border border-border relative"
          @click="backgroundFileInput?.click()"
        >
          <img 
            :src="form.backgroundImage" 
            class="w-full h-full object-cover"
            alt="پس‌زمینه"
          />
          <button 
            type="button"
            class="absolute top-2 right-2 bg-destructive text-destructive-foreground rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-destructive/90 transition-colors" 
            @click.stop="form.backgroundImage = null"
          >
            ×
          </button>
        </div>
        <div 
          v-else 
          class="w-full h-32 rounded-lg bg-muted border-2 border-dashed border-border flex items-center justify-center cursor-pointer hover:border-primary transition-colors"
          @click="backgroundFileInput?.click()"
        >
          <div class="text-center text-muted-foreground">
            <i class="ti ti-photo text-2xl mb-2 block" />
            <p class="text-sm">کلیک کنید تا عکس پس‌زمینه اضافه کنید</p>
          </div>
        </div>
        <input 
          ref="backgroundFileInput"
          type="file" 
          accept="image/*" 
          class="hidden" @change="handleBackgroundUpload"
        />
      </div>
    </div>

    <!-- Form Fields -->
    <div class="space-y-4">
      <div>
        <label class="block text-sm font-medium text-foreground mb-1">
          عنوان لینک برجسته
        </label>
        <input
          v-model="form.title"
          type="text"
          placeholder="عنوان لینک ویژه..."
          class="w-full px-4 py-3 bg-background border border-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
        />
      </div>
      
      <div>
        <label class="block text-sm font-medium text-foreground mb-1">
          آدرس لینک
        </label>
        <input
          v-model="form.value"
          type="url"
          placeholder="https://example.com"
          class="w-full px-4 py-3 bg-background border border-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
        />
      </div>
      
      <!-- Toggle for description -->
      <div class="flex items-center justify-between">
        <div>
          <label class="text-sm font-medium text-foreground">نمایش توضیحات</label>
          <p class="text-xs text-muted-foreground mt-1">فعال‌سازی حالت لیستی با نمایش توضیحات</p>
        </div>
        <label class="relative inline-flex items-center cursor-pointer">
          <input v-model="form.showDescription" type="checkbox" class="sr-only peer" />
          <div class="w-11 h-6 bg-muted peer-focus:ring-2 peer-focus:ring-primary/20 rounded-full peer peer-checked:bg-primary transition-all duration-300" />
          <div class="absolute left-0.5 top-0.5 w-5 h-5 bg-background rounded-full transition-transform duration-300 peer-checked:translate-x-full" />
        </label>
      </div>

      <!-- Description field (only show when enabled) -->
      <div v-if="form.showDescription">
        <label class="block text-sm font-medium text-foreground mb-1">
          توضیحات
        </label>
        <textarea
          v-model="form.description"
          rows="3"
          placeholder="توضیحات اختیاری..."
          class="w-full px-4 py-3 bg-background border border-border rounded-lg text-sm resize-none text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
        />
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
import { reactive, ref, computed, watch } from 'vue'
import { useIconComponents } from '~/composables/useIconComponentsMap'
import { useFormStore } from '~/stores/form'

const { getIconComponent } = useIconComponents()

const props = defineProps({ 
  link: {
    type: Object,
    default: () => ({})
  }
})

const emit = defineEmits(['save', 'cancel', 'submit'])

// Access form store for dynamic coloring
const formStore = useFormStore()

const form = reactive({
  ...props.link,
  backgroundImage: props.link?.backgroundImage || null,
  customIcon: props.link?.customIcon || null,
  title: props.link?.title || '',
  value: props.link?.value || '',
  description: props.link?.description || '',
  isListMode: props.link?.isListMode ?? true
})

const iconFileInput = ref(null)
const backgroundFileInput = ref(null)

// Icon Management
const iconData = computed(() => {
  return form.icon || null;
});

const iconComponent = computed(() => {
  return getIconComponent(iconData.value);
});

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

// Watch showDescription to clear description when disabled
watch(() => form.showDescription, (newValue) => {
  if (!newValue) {
    form.description = ''
  }
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

function handleBackgroundUpload(event) {
  const file = event.target.files[0]
  if (file) {
    const reader = new FileReader()
    reader.onload = e => {
      form.backgroundImage = e.target.result
    }
    reader.readAsDataURL(file)
  }
}

function submitForm() {
  const result = {
    ...form,
    backgroundImage: form.backgroundImage || undefined,
    customIcon: form.customIcon || undefined
  }
  emit('submit', result)
  emit('save', result)
}
</script>



