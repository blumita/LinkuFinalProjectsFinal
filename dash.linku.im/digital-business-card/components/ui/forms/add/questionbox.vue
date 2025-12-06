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
          <component 
           :size="80"
            :is="getIconComponent('questionbox')"
            class="w-full h-full text-muted-foreground"
            v-bind="iconColor ? { color: iconColor, filled: isIconFilled } : {}"
          />
        </div>
        <input
          ref="fileInput"
          type="file"
          accept="image/png,image/jpeg,image/jpg,image/webp,image/bmp,image/svg+xml"
          class="hidden"
          @change="handleIconUpload"
        >
      </div>
      <p
        class="text-sm text-primary font-medium cursor-pointer order-2"
        @click="fileInput?.click()"
      >
        برای تغییر آیکون کلیک کنید
      </p>
    </div>

    <!-- نام و نام خانوادگی -->
    <div>
      <label class="block text-sm font-medium text-foreground mb-1">نام و نام خانوادگی</label>
      <input
          v-model="form.fullName"
          type="text"
          placeholder="مثلاً علی رضایی"
          class="w-full px-4 py-2 bg-muted rounded-lg border border-border text-sm text-foreground"
      >
    </div>

    <!-- شماره موبایل -->
    <div>
      <label class="block text-sm font-medium text-foreground mb-1">شماره موبایل</label>
      <input
          v-model="form.phoneNumber"
          type="tel"
          placeholder="مثلاً 09123456789"
          class="w-full px-4 py-2 bg-muted rounded-lg border border-border text-sm text-foreground"
      >
    </div>


    <!-- عنوان -->
    <div class="mt-6">
      <label class="block text-sm font-medium text-foreground mb-1">سوال</label>
      <input
        v-model="form.title"
        type="text"
        :placeholder="form.placeholder?.title??'مثلاً چه سوالی دارید؟'"
        class="w-full px-4 py-2 bg-muted rounded-lg border border-border text-sm text-foreground"
      >
    </div>

    <!-- توضیحات -->
    <div>
      <label class="block text-sm font-medium text-foreground mb-1">توضیحات</label>
      <input
        v-model="form.description"
        type="text"
        placeholder="توضیح اختیاری"
        class="w-full px-4 py-2 bg-muted rounded-lg border border-border text-sm text-foreground"
      >
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
import { reactive, computed } from 'vue'
import { useIconComponents } from '~/composables/useIconComponentsMap'
import { useFormStore } from '~/stores/form'

const props = defineProps({
  link: {
    type: Object,
    default: () => ({})
  }
})
const emit = defineEmits(['submit', 'cancel'])

// Access form store for dynamic coloring
const formStore = useFormStore()

// استفاده از icon components composable
const { getIconComponent } = useIconComponents()

const form = reactive({
  ...props.link,
  fullName:props.link?.fullName??'',
  phoneNumber:props.link?.phoneNumber??'',
  title: props.link?.title??'',
  value: props.link?.value??'',
  description: props.link?.description??'',
  placeholder: props.link?.placeholder??{},
  icon: props.link?.icon??{ type: 'component', name: 'questionbox' },
  customIcon: props.link?.customIcon??''
})

// Icon Management
const iconComponent = computed(() => {
  // اگر form.icon یک object باشه، name رو استخراج کن
  const iconName = typeof form.icon === 'object' && form.icon?.name ? form.icon.name : form.icon
  return getIconComponent(iconName??'questionbox');
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

function submitForm() {
  emit('submit', { ...form })
}
</script>

<script>
export default {
  name: 'Questionbox',
}
</script>




