<template>
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 32 32" 
    :width="size" 
    :height="size"
  >
    <!-- Map base -->
    <polygon 
      :fill="primaryColor" 
      points="32,31 0,31 0,15 8,15 8,19 4,19 4,27 28,27 28,19 24,19 24,15 32,15"
    />
    <!-- Location pin top -->
    <path 
      :fill="secondaryColor" 
      d="M16,6c1.861,0,3.413,1.278,3.858,3h4.072C23.438,5.055,20.079,2,16,2S8.562,5.055,8.069,9h4.072 C12.587,7.278,14.139,6,16,6z"
    />
    <!-- Location pin bottom -->
    <path 
      :fill="secondaryColor" 
      d="M16,14c-1.861,0-3.412-1.278-3.858-3H8.124C9.101,15.594,16,23,16,23s6.899-7.406,7.876-12h-4.018 C19.412,12.722,17.861,14,16,14z"
    />
  </svg>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  size?: number | string
  filled?: boolean
  color?: string
}

const props = withDefaults(defineProps<Props>(), {
  size: 24,
  filled: false,
  color: ''
})

// تابع برای تشخیص رنگ سفید
const isWhiteColor = (color: string): boolean => {
  if (!color || color === "transparent") return false
  
  // حذف # از ابتدای رنگ hex
  const hex = color.replace("#", "").toLowerCase()
  
  // بررسی اینکه رنگ سفید باشد
  return hex === "ffffff" || hex === "fff" || color.toLowerCase() === "white"
}

// رنگ اصلی (پس‌زمینه نقشه)
const primaryColor = computed(() => {
  return props.color || '#0f518c' // رنگ آبی پیش‌فرض
})

// رنگ ثانویه (پین مکانی)  
const secondaryColor = computed(() => {
  return props.color ? textColor.value : '#ed0049' // رنگ قرمز پیش‌فرض
})

// تعیین رنگ متن بر اساس رنگ پس‌زمینه
const textColor = computed(() => {
  if (!props.color) return '#ed0049' // رنگ پیش‌فرض قرمز
  return isWhiteColor(props.color) ? '#000000' : '#ffffff'
})
</script>