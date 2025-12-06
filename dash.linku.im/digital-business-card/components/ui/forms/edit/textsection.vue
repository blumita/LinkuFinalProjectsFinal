<template>
  <div class="bg-background rounded-xl space-y-6 w-full p-4">

    <!-- Icon Upload RTL: Icon right, text left -->
    <div class="flex flex-row items-center gap-4 mb-2 w-full justify-start rtl:justify-start">
      <div class="relative w-20 h-20 flex-shrink-0 order-1 flex items-center justify-center">
        <img v-if="form.customIcon" :src="form.customIcon" class="w-full h-full rounded-xl bg-muted object-cover cursor-pointer" @click="fileInput?.click()" >
        <component :is="iconComponent" v-else-if="iconComponent" class="w-full h-full rounded-xl bg-muted text-muted-foreground p-2 cursor-pointer" @click="fileInput?.click()" />
        <div v-else class="w-full h-full rounded-xl bg-muted flex items-center justify-center text-muted-foreground text-2xl cursor-pointer" @click="fileInput?.click()">
          <i class="ti ti-section" />
        </div>
        <input ref="fileInput" type="file" accept="image/png,image/jpeg,image/jpg,image/webp,image/bmp,image/svg+xml" class="hidden" @change="handleIconUpload" >
      </div>
      <p class="text-sm text-blue-500 font-medium cursor-pointer order-2" @click="fileInput?.click()">برای تغییر آیکون کلیک کنید</p>
    </div>
    <div class="mb-4 mt-4">
      <label class="block text-sm font-medium text-foreground mb-1">عنوان هدر</label>
      <input
        v-model="form.title"
        type="text"
        placeholder="مثلاً درباره ما یا متن دلخواه"
        class="w-full px-4 py-3 bg-background border border-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
      >
    </div>
    <!-- جهت چینش با آیکون‌ها -->
    <div class="mb-4">
      <label class="block text-sm font-medium text-foreground mb-1">جهت چینش عنوان در پیش‌نمایش</label>
      <div class="flex gap-2">
        <button type="button" :class="[form.align === 'right' ? 'bg-primary/10 border-primary' : 'bg-muted border-border', 'border rounded-lg p-2 flex items-center justify-center transition']" @click="form.align = 'right'">
          <i class="ti ti-align-right text-lg" />
        </button>
        <button type="button" :class="[form.align === 'center' ? 'bg-primary/10 border-primary' : 'bg-muted border-border', 'border rounded-lg p-2 flex items-center justify-center transition']" @click="form.align = 'center'">
          <i class="ti ti-align-center text-lg" />
        </button>
        <button type="button" :class="[form.align === 'left' ? 'bg-primary/10 border-primary' : 'bg-muted border-border', 'border rounded-lg p-2 flex items-center justify-center transition']" @click="form.align = 'left'">
          <i class="ti ti-align-left text-lg" />
        </button>
      </div>
    </div>
    <!-- Actions -->
    <!-- Fixed Bottom Actions -->
    <div class="border-t border-border bg-background p-4">
      <div class="flex items-center gap-3">
        <button type="button" class="flex-1 bg-muted text-muted-foreground font-medium py-3 rounded-lg hover:bg-muted/80 transition-colors" @click="$emit('cancel')">
          انصراف
        </button>
        <button type="button" class="flex-1 bg-primary text-primary-foreground font-medium py-3 rounded-lg hover:bg-primary/90 transition-colors" @click="$emit('submit', form)">
          <i class="ti ti-check mr-1" />
          ذخیره
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, computed } from 'vue'
import type { TextSectionBlock, Placeholder } from '@/types/data'

const { getIconComponent } = useIconComponents();

const props = defineProps<{ link?: Partial<TextSectionBlock> }>()
const emit = defineEmits(['submit', 'cancel', 'back', 'delete'])

// Access form store for dynamic coloring
const formStore = useFormStore()
const fileInput = ref<HTMLInputElement | null>(null)

const form = reactive<TextSectionBlock>({
  id: props.link?.id || Date.now().toString(),
  action: 'textsection',
  type: 'block',
  name: 'textsection',
  title: props.link?.title || '',
  value: props.link?.value || '',
  align: props.link?.align || 'right',
  icon: props.link?.icon || '',
  customIcon: props.link?.customIcon || '',
  displayName: props.link?.displayName || '',
  placeholder: props.link?.placeholder || {},
  access: props.link?.access || 'free',
})

// Icon Management
const iconComponent = computed(() => {
  const icon = form.icon
  if (!icon) return null
  return getIconComponent(icon)
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

function submitForm() {
  emit('submit', { ...form })
}

function handleIconUpload(event: Event) {
  const file = (event.target as HTMLInputElement).files?.[0]
  if (file) {
    const reader = new FileReader()
    reader.onload = e => {
      form.customIcon = e.target?.result as string
    }
    reader.readAsDataURL(file)
  }
}

function selectAlign(val: 'right' | 'center' | 'left') {
  form.align = val
}

function alignLabel(val: string) {
  if (val === 'center') return 'وسط'
  if (val === 'left') return 'چپ'
  return 'راست'
}

function setTextsectionField(key: keyof TextSectionBlock, value: any) {
  (form as any)[key] = value
}
</script>




