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
      :fill="props.color ? props.color : '#9146FF'" />
    
    <!-- لوگو Twitch -->
    <g :fill="props.color ? textColor : '#ffffff'">
      <path d="M5e2.0.0 5e2v18e2h6e2v5e2l5e2-5e2h4e2l9e2-9e2V0H5e2zm17e2 13e2-4e2 4e2h-4e2l-350 350v-350H6e2V2e2h16e2v11e2z" transform="scale(0.03) translate(500, 400)"/>
      <path d="M17e2 550h2e2v6e2h-2e2zm-550 0h2e2v6e2h-2e2z" transform="scale(0.03) translate(500, 400)"/>
    </g>
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
