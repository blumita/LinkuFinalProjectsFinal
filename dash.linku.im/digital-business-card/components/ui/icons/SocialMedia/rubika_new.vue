<template>
  <svg 
    :width="size" 
    :height="size" 
    viewBox="0 0 100 100" 
    xmlns="http://www.w3.org/2000/svg">
    <!-- پس‌زمینه -->
    <rect 
      x="0" 
      y="0" 
      width="100" 
      height="100" 
      rx="25" 
      ry="25" 
      :fill="props.color ? props.color : '#4fc3f7'" />
    
    <!-- لوگو Rubika -->
    <path 
      d="M30 35l15 8.5v17L30 69V35zm40 0v34l-15-8.5v-17L70 35zM35 25l15 8.5 15-8.5L50 16.5 35 25zm15 50l15-8.5v-17l-15 8.5v17z" 
      :fill="props.color ? textColor : '#ffffff'" />
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

// تعیین رنگ متن بر اساس رنگ پس‌زمینه
const textColor = computed(() => {
  if (!props.color) return '#ffffff' // رنگ پیش‌فرض سفید
  return isWhiteColor(props.color) ? '#000000' : '#ffffff'
})
</script>
