<template>
  <svg
   viewBox="0 0 24 24"
   :width="size"
   :height="size"
   xmlns="http://www.w3.org/2000/svg">
  <rect
     x="0"
     y="0"
     width="24"
     height="24"
     rx="6"
     ry="6"
     :fill="props.color || '#058373'" />
  <!-- Microsoft Bookings "B" logo simplified -->
  <path
     d="M7 5h5.5c1.93 0 3.5 1.12 3.5 2.5 0 1.05-.7 1.95-1.75 2.35.55.2 1.75.85 1.75 2.15 0 1.38-1.57 2.5-3.5 2.5H7V5zm2 2v2.5h3.5c.83 0 1.5-.45 1.5-1.25S13.33 7 12.5 7H9zm0 4.5V14h3.5c.83 0 1.5-.45 1.5-1.25s-.67-1.25-1.5-1.25H9z"
     :fill="textColor" />
  <path
     d="M7 16h10v1.5c0 .83-.67 1.5-1.5 1.5H8.5c-.83 0-1.5-.67-1.5-1.5V16z"
     :fill="textColor"
     opacity="0.7" />
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