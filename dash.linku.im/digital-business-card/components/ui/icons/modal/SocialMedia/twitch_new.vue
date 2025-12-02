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
      :fill="props.color ? props.color : '#9146ff'" />
    
    <!-- لوگو Twitch -->
    <path 
      d="M25 20h50v45L65 75H50l-10 10v-10H25V20zm7.5 7.5v25h7.5v-25h-7.5zm15 0v25h7.5v-25H47.5z" 
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
