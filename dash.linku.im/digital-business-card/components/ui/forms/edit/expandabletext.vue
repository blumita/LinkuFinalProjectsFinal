<template>
  <div class="bg-background rounded-xl space-y-6 w-full p-4">

    <!-- Icon Upload -->
    <div class="flex flex-row items-center gap-4 w-full justify-start rtl:justify-start">
      <div class="relative w-20 h-20 flex-shrink-0 order-1">
        <img v-if="form.customIcon" :src="form.customIcon" class="w-full h-full rounded-xl bg-muted object-cover cursor-pointer" @click="fileInput?.click()" >
        <component :is="iconComponent" v-else-if="iconComponent" class="w-full h-full rounded-xl bg-muted text-muted-foreground p-2 cursor-pointer" @click="fileInput?.click()" />
        <div v-else class="w-full h-full rounded-xl bg-muted flex items-center justify-center text-muted-foreground text-2xl cursor-pointer" @click="fileInput?.click()">
          <i class="ti ti-file-text" />
        </div>
        <input ref="fileInput" type="file" accept="image/*" class="hidden" @change="handleIconUpload" :disabled="form.isSubmitting" >
      </div>
      <p class="text-sm text-blue-500 font-medium cursor-pointer order-2" @click="fileInput?.click()">برای تغییر آیکون کلیک کنید</p>
    </div>

    <!-- Inputs -->
    <div class="space-y-4">
      <div>
        <label class="block text-sm font-medium text-foreground mb-1">محتوای قابل گسترش</label>
        <textarea
          v-model="form.value"
          rows="6"
          :placeholder="props.link.placeholder?.link || 'مثلاً متن درباره خدمات ما...'"
          class="w-full px-4 py-3 bg-background border border-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
          :disabled="form.isSubmitting"
        ></textarea>
      </div>
      <div>
        <label class="block text-sm font-medium text-foreground mb-1">عنوان</label>
        <input
          v-model="form.title"
          type="text"
          :placeholder="props.link.placeholder?.title || 'مثلاً درباره ما'"
          class="w-full px-4 py-3 bg-background border border-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
          :disabled="form.isSubmitting"
        >
      </div>
    </div>

    <!-- Actions -->
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

<script setup lang="ts">
import { ref, onMounted, watch, computed } from 'vue'
import type { LinkItem, Icon } from '~/types/data'

const { getIconComponent } = useIconComponents();

interface ExpandableTextForm {
  title: string
  value: string
  customIcon: string | null
  icon?: Icon | string
  isSubmitting?: boolean
  errors?: {
    title?: string
    value?: string
  }
}

const props = defineProps<{ link: LinkItem }>();
const emit = defineEmits(['submit', 'cancel', 'back', 'delete'])

// Access form store for dynamic coloring
const formStore = useFormStore();
const fileInput = ref<HTMLInputElement>();

const form = ref<ExpandableTextForm>({
  title: '',
  value: '',
  customIcon: null,
  icon: props.link.icon ?? undefined,
  isSubmitting: false,
  errors: {}
})

// Icon Management
const iconComponent = computed(() => {
  const icon = form.value.icon
  if (!icon) return null
  return getIconComponent(icon)
})

onMounted(() => {
  form.value = {
    title: props.link.title || '',
    value: props.link.description || props.link.text || '',
    customIcon: props.link.customIcon || null,
    icon: props.link.icon ?? undefined,
    isSubmitting: false,
    errors: {}
  }
})

watch(() => props.link, (newLink) => {
  form.value = {
    ...form.value,
    title: newLink.title || form.value.title,
    value: newLink.description || newLink.text || form.value.value,
    icon: newLink.icon ?? undefined,
    customIcon: newLink.customIcon || null
  }
})

async function handleIconUpload(event: Event) {
  const input = event.target as HTMLInputElement
  if (!input.files?.length) return
  try {
    const file = input.files[0]
    const maxSize = 5 * 1024 * 1024 // 5MB
    if (file.size > maxSize) throw new Error('حداکثر حجم مجاز ۵ مگابایت است.')
    if (!file.type.startsWith('image/')) throw new Error('فقط فایل تصویری مجاز است.')
    const reader = new FileReader()
    reader.onload = (e) => {
      form.value.customIcon = e.target?.result as string
      form.value.icon = undefined
    }
    reader.onerror = () => { throw new Error('خواندن فایل با خطا مواجه شد.') }
    reader.readAsDataURL(file)
  } catch (error) {
    // نمایش خطا به کاربر در صورت نیاز
  }
}

function validateForm(): boolean {
  form.value.errors = {}
  if (!form.value.title?.trim()) {
    form.value.errors.title = 'عنوان الزامی است'
    return false
  }
  if (!form.value.value?.trim()) {
    form.value.errors.value = 'محتوا الزامی است'
    return false
  }
  return true
}

async function submitForm() {
  if (!validateForm()) return
  try {
    form.value.isSubmitting = true
    const formData = {
      ...props.link,
      title: form.value.title.trim(),
      value: form.value.value.trim(),
      description: form.value.value.trim(),
      icon: form.value.customIcon ? { type: 'custom' as const, path: form.value.customIcon } : form.value.icon
    }
    emit('submit', formData)
  } catch (error) {
  } finally {
    form.value.isSubmitting = false
  }
}
</script>




