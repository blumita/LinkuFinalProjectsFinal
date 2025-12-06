<template>
  <div class="bg-background rounded-xl space-y-6 w-full p-4">

    <!-- Icon Upload RTL: Icon right, text left -->
    <div class="flex flex-row items-center gap-4 mb-2 w-full justify-start rtl:justify-start">
      <div class="relative w-20 h-20 flex-shrink-0 order-1 flex items-center justify-center">
        <img
          v-if="form.customIcon"
          :src="form.customIcon"
          class="w-full h-full rounded-xl bg-muted object-cover cursor-pointer"
          @click="fileInput?.click()"
        >
        <component
          :is="iconComponent" v-else-if="iconComponent"
          :size="80"
          class="w-full h-full rounded-xl bg-muted text-muted-foreground  cursor-pointer"
          v-bind="iconColor ? { color: iconColor, filled: isIconFilled } : {}"
          @click="fileInput?.click()"
        />
        <div
          v-else
          class="w-full h-full rounded-xl bg-muted text-muted-foreground flex items-center justify-center cursor-pointer"
          @click="fileInput?.click()"
        >
          <i class="ti ti-star text-4xl" />
        </div>
        <input 
          ref="fileInput"
          type="file" 
          accept="image/png,image/jpeg,image/jpg,image/webp,image/bmp,image/svg+xml" 
          class="hidden" 
          @change="handleIconUpload" 
        />
      </div>

      <div class="flex-1 order-2 text-right">
        <input
          v-model="form.title"
          placeholder="عنوان لینک ویژه"
          class="w-full text-lg font-medium border-none outline-none bg-transparent text-foreground placeholder-muted-foreground text-right"
        >
      </div>
    </div>

    <!-- Background Image Upload -->
    <div class="space-y-2">
      <label class="block text-sm font-medium text-foreground mb-1">
        عکس پس‌زمینه
      </label>
      <div class="relative">
        <div 
          v-if="form.backgroundImage" 
          class="w-full h-32 rounded-lg bg-muted overflow-hidden cursor-pointer border-2 border-dashed border-primary/50"
          @click="backgroundFileInput?.click()"
        >
          <img 
            :src="form.backgroundImage" 
            class="w-full h-full object-cover"
          >
        </div>
        <div 
          v-else 
          class="w-full h-32 rounded-lg bg-muted border-2 border-dashed border-border flex flex-col items-center justify-center cursor-pointer hover:border-primary/50"
          @click="backgroundFileInput?.click()"
        >
          <i class="ti ti-photo text-muted-foreground text-2xl mb-2" />
          <span class="text-muted-foreground text-sm">کلیک کنید تا عکس انتخاب کنید</span>
        </div>
        <input 
          ref="backgroundFileInput"
          type="file" 
          accept="image/png,image/jpeg,image/jpg,image/webp,image/bmp,image/svg+xml" 
          class="hidden" 
          @change="handleBackgroundUpload"
        >
      </div>
    </div>

    <!-- Link Input -->
    <div>
      <label class="block text-sm font-medium text-foreground mb-1">لینک</label>
      <input 
        v-model="form.value"
        type="url"
        placeholder="https://example.com"
        class="w-full px-4 py-3 bg-background border border-border rounded-lg text-sm text-right text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
      >
    </div>
    
    <!-- Description Input -->
    <div>
      <label class="block text-sm font-medium text-foreground mb-1">توضیحات</label>
      <textarea
        v-model="form.description"
        rows="3"
        placeholder="توضیحات اختیاری..."
        class="w-full px-4 py-3 bg-background border border-border rounded-lg text-sm text-right resize-none text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
      />
    </div>

    <!-- Fixed Bottom Actions -->
    <div class="border-t border-border bg-background p-4">
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
import { reactive, ref, computed } from 'vue'
import { useIconComponents } from '~/composables/useIconComponentsMap'
import { useFormStore } from '~/stores/form'

const { getIconComponent } = useIconComponents()

const props = defineProps({ 
  link: {
    type: Object,
    default: () => ({})
  }
})

const emit = defineEmits(['submit', 'cancel', 'back', 'delete'])

// Access form store for dynamic coloring
const formStore = useFormStore()

const form = reactive({
  ...props.link,
  backgroundImage: props.link?.backgroundImage || null,
  customIcon: props.link?.customIcon || null,
  title: props.link?.title || '',
  value: props.link?.value || '',
  description: props.link?.description || ''
})

const fileInput = ref(null)
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
}
</script>
