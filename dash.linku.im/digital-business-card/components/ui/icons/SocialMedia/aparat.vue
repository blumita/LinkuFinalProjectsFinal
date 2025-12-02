<template>
  <svg
      id="uuid-432a6c06-607c-43bf-93ac-97f1abf61703"
      viewBox="0 0 193.09 68.33"
      version="1.1"
      :width="size"
      :height="size"
      xmlns="http://www.w3.org/2000/svg"
      xmlns:svg="http://www.w3.org/2000/svg">
    <defs
        id="defs9" />
    <rect
        x="0"
        y="-60"
        width="190.174"
        height="190.174"
        rx="63.708"
        ry="63.708"
        :fill="props.color ? props.color : '#ffffff'"
        id="rect2" />
    <g transform="translate(-165, -45) scale(2.4)">
      <path class="cls-1" d="M104.25,2 98,.36 A10.58,10.58,0,0,0,85,7.87 l-1.58,5.93 A32.4,32.4,0,0,1,104.25,2 Z"
            :fill="props.color ? textColor : '#000000'" />
      <path class="cls-1" d="M76.66,39.33 l-1.54,5.8 a10.58,10.58,0,0,0,7.51,12.94 l6,1.6 A32.41,32.41,0,0,1,76.66,39.33 Z"
            :fill="props.color ? textColor : '#000000'" />
      <path class="cls-1" d="M135.22,10.25 l-6.74,-1.79 a32.4,32.4,0,0,1,12.4,21.7 l1.85,-7 A10.58,10.58,0,0,0,135.22,10.25 Z"
            :fill="props.color ? textColor : '#000000'" />
      <path class="cls-1"
            d="M113.45,66.26 119.89,68 a10.58,10.58,0,0,0,12.94,-7.51 l1.82,-6.84 A32.42,32.42,0,0,1,113.45,66.26 Z"
            :fill="props.color ? textColor : '#000000'" />
      <path class="cls-2"
            d="M108.92,4.54 a29.63,29.63,0,1,0,29.63,29.63 A29.63,29.63,0,0,0,108.92,4.54 Z
           M92.15,19.32 a8.46,8.46,0,1,1,6.71,9.91 A8.46,8.46,0,0,1,92.15,19.32 Z
           M104.46,44.92 A8.46,8.46,0,1,1,97.75,35 A8.46,8.46,0,0,1,104.46,44.92 Z
           M108.05,38.07 a3.76,3.76,0,1,1,4.41,-3 A3.76,3.76,0,0,1,108.05,38.07 Z
           M125.7,49 A8.46,8.46,0,1,1,119,39.1 A8.46,8.46,0,0,1,125.7,49 Z
           M120.1,33.33 A8.46,8.46,0,1,1,130,26.61 A8.46,8.46,0,0,1,120.1,33.33 Z"
            :fill="props.color ? textColor : '#ee1010'" />
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