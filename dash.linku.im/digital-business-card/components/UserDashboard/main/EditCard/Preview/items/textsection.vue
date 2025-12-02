<template>
  <div
    class="w-full py-3 flex items-center px-2"
    :class="{
      'justify-start': getCurrentAlign() === 'right',
      'justify-end': getCurrentAlign() === 'left',
      'justify-center': getCurrentAlign() === 'center',
    }"
    :dir="formData?.layout === 'left' ? 'ltr' : 'rtl'"
  >
    <div class="flex-1 items-center">
      <div 
        v-if="(link && link.title) || (!link && store.textsection.title)" 
        :class="['font-bold text-lg', alignClass(getCurrentAlign()), isDarkTheme ? 'text-white' : 'text-gray-800']"
      >
        {{ link ? link.title : store.textsection.title }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useFormStore } from '@/stores/form'

const store = useFormStore()

const props = defineProps({
  link: { type: Object, required: false },
  align: { type: String, default: 'right' },
  formData: { type: Object, default: () => ({}) },
  isDarkTheme: { type: Boolean, default: false }
})

const link = computed(() => props.link)

const getCurrentAlign = () => {
  // اگر layout چپ‌چین است، alignment را برعکس کن
  if (props.formData?.layout === 'left') {
    const originalAlign = props.link ? props.link.align : store.textsection.align || props.align
    if (originalAlign === 'right') return 'left'
    if (originalAlign === 'left') return 'right'
    return originalAlign
  }
  return props.link ? props.link.align : store.textsection.align || props.align
}

function alignClass(val) {
  if (val === 'center') return 'text-center';
  if (val === 'left') return 'text-left';
  return 'text-right';
}
</script>
