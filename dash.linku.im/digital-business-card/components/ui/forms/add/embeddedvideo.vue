<template>
  <div class="bg-background flex flex-col h-full">
    <div class="flex-1 overflow-y-auto p-4 space-y-6 pb-20 lg:pb-4">
      <!-- Icon Upload RTL: Icon right, text left -->
      <div class="flex flex-row items-center gap-4 mb-2 w-full justify-start rtl:justify-start">
        <div class="relative w-20 h-20 flex-shrink-0 order-1 flex items-center justify-center">
          <img
            v-if="form.customIcon"
            :src="form.customIcon"
             :size="80"
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
            class="w-full h-full rounded-xl bg-muted flex items-center justify-center text-muted-foreground text-2xl cursor-pointer"
            @click="fileInput?.click()"
          >
            <i class="ti ti-video" />
          </div>
          <input
            ref="fileInput"
            type="file"
            accept="image/*"
            class="hidden" @change="handleIconUpload"
          >
        </div>
        <p
          class="text-sm text-primary font-medium cursor-pointer order-2"
          @click="fileInput?.click()"
        >
          برای تغییر آیکون کلیک کنید
        </p>
      </div>

      <!-- Inputs -->
      <div class="space-y-4 mt-6">
        <!-- ویدیو embed -->
        <div>
          <label class="block text-sm font-medium text-foreground mb-1">کد ویدیو / لینک Embed</label>
          <input
            v-model="form.value"
            type="text"
            :placeholder="form.placeholder?.link || 'https://www.youtube.com/embed/_vhf0RZg0fg'"
            class="w-full px-4 py-2 bg-muted rounded-lg border border-border text-sm text-foreground"
          >
        </div>

        <!-- عنوان -->
        <div>
          <label class="block text-sm font-medium text-foreground mb-1">عنوان</label>
          <input
            v-model="form.title"
            type="text"
            :placeholder="form.placeholder?.title || 'مثلاً معرفی ما'"
            class="w-full px-4 py-2 bg-muted rounded-lg border border-border text-sm text-foreground"
          >
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
import { reactive, computed, ref } from 'vue'
import { useIconComponents } from '~/composables/useIconComponentsMap'
import { useFormStore } from '~/stores/form'

const { getIconComponent } = useIconComponents()

const props = defineProps({
  link: {
    type: Object,
    default: () => ({})
  }
})
const emit = defineEmits(['submit', 'cancel'])

// File input reference
const fileInput = ref(null)

// Access form store for dynamic coloring
const formStore = useFormStore()

const form = reactive({
  ...props.link,
  title: props.link?.title || '',
  value: props.link?.value || '',
  placeholder: props.link?.placeholder || {},
  icon: props.link?.icon || '',
  customIcon: props.link?.customIcon || ''
})

// Icon Management
const iconComponent = computed(() => getIconComponent(form.icon));

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

function submitForm() {
  emit('submit', { ...form })
}
</script>

<script>
export default {
  name: 'Embeddedvideo',
}
</script>



