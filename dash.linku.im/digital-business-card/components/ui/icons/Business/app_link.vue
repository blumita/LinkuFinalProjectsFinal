<template>
<svg
   id="uuid-2b6db181-7060-45fe-a152-ee1210518152"
   viewBox="0 0 219.4 219.3"
   version="1.1"
   :width="size"
   :height="size"
   xmlns="http://www.w3.org/2000/svg"
   xmlns:svg="http://www.w3.org/2000/svg">
  <defs
     id="defs7">
    <linearGradient
       :id="gradientId"
       x1="0%"
       y1="0%"
       x2="100%"
       y2="100%">
      <stop
         offset="0%"
         :stop-color="lightColor" />
      <stop
         offset="100%"
         :stop-color="darkColor" />
    </linearGradient>
  </defs>
  <path
     id="path9"
     d="m 41.6,0 h 136.2 c 23,0 41.6,18.6 41.6,41.6 v 136.1 c 0,23 -18.6,41.6 -41.6,41.6 H 41.6 C 18.6,219.3 0,200.7 0,177.7 V 41.6 C 0,18.6 18.6,0 41.6,0 Z"
     :fill="primaryFill" />
  <g
     id="g29"
     transform="translate(-25.9,-19.9)">
    <g
       id="g15">
      <path
         id="path11"
         d="M 155.5,166.5 H 65.6 c -4.7,0 -9,-3.2 -9.7,-7.8 -0.9,-5.9 3.6,-10.8 9.2,-10.8 H 151 c 1.9,0 3.7,1 4.7,2.7 l 4.5,7.9 c 2.1,3.6 -0.5,8.1 -4.7,8.1 z"
         :fill="iconColor" />
      <path
         id="path13"
         d="m 215.4,157.2 c 0,5.1 -4.2,9.3 -9.3,9.3 h -35.8 l -10.7,-18.7 h 46.6 c 5.2,0 9.3,4.2 9.3,9.3 z"
         :fill="iconColor" />
    </g>
    <g
       id="g21">
      <path
         id="path17"
         d="m 83.8,168.9 h 9.1 c 4.2,0 6.8,4.5 4.7,8.1 l -10.5,18.3 c -1.7,3 -4.9,4.7 -8.1,4.7 -3.2,0 -3.2,-0.4 -4.7,-1.2 -4.4,-2.6 -6,-8.3 -3.4,-12.8 l 8.3,-14.3 c 1,-1.7 2.7,-2.7 4.7,-2.7 z"
         :fill="iconColor" />
      <path
         id="path19"
         d="m 157.6,73.2 -41.8,72.4 -1.4,2.3 -1.4,2.3 -8.1,14 H 83.3 l 8.1,-14 2.7,-4.7 47.2,-81.7 c 2.6,-4.4 8.3,-6 12.7,-3.4 4.5,2.6 6,8.3 3.4,12.7 z"
         :fill="iconColor" />
    </g>
    <g
       id="g27">
      <path
         id="path23"
         d="m 145,90.2 -10.8,18.6 -8.1,-14 -1.4,-2.3 -1.4,-2.3 -9.8,-17 c -2.6,-4.4 -1.1,-10.2 3.4,-12.7 4.5,-2.6 10.2,-1 12.7,3.4 l 4.4,7.7 1.4,2.3 1.4,2.3 8.1,14 z"
         :fill="iconColor" />
      <path
         id="path25"
         d="m 196.9,198.7 c -1.4,0.8 -3,1.2 -4.6,1.2 -3.2,0 -6.4,-1.6 -8.1,-4.7 l -45.6,-79.1 c -1,-1.7 -1,-3.7 0,-5.4 l 4.5,-7.9 c 2.1,-3.6 7.3,-3.6 9.3,0 l 47.9,83 c 2.6,4.5 1,10.2 -3.5,12.8 z"
         :fill="iconColor" />
    </g>
  </g>
</svg>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  size?: number | string
  color?: string
}

const props = withDefaults(defineProps<Props>(), {
  size: 24,
  color: '#3dc2f1'
})

// تابع برای تشخیص رنگ سفید
const isWhiteColor = (color: string): boolean => {
  if (!color || color === "transparent") return false
  
  // حذف # از ابتدای رنگ hex
  const hex = color.replace("#", "").toLowerCase()
  
  // بررسی اینکه رنگ سفید باشد
  return hex === "ffffff" || hex === "fff" || color.toLowerCase() === "white"
}

// تابع برای تنظیم روشنی رنگ
const adjustBrightness = (hex: string, amount: number): string => {
  // Remove # if present
  const color = hex.replace('#', '')
  
  // Parse r, g, b values
  const num = parseInt(color, 16)
  const r = Math.max(0, Math.min(255, (num >> 16) + amount))
  const g = Math.max(0, Math.min(255, (num >> 8 & 0x00FF) + amount))
  const b = Math.max(0, Math.min(255, (num & 0x0000FF) + amount))
  
  return `#${(r << 16 | g << 8 | b).toString(16).padStart(6, '0')}`
}

// Computed properties
const gradientId = computed(() => {
  return `app-link-gradient-${props.color.replace('#', '')}`
})

const lightColor = computed(() => {
  return adjustBrightness(props.color, 40)
})

const darkColor = computed(() => {
  return adjustBrightness(props.color, -20)
})

const primaryFill = computed(() => {
  return `url(#${gradientId.value})`
})

// تعیین رنگ آیکون بر اساس رنگ پس‌زمینه
const iconColor = computed(() => {
  if (!props.color) return '#ffffff' // رنگ پیش‌فرض سفید
  // فقط رنگ سفید = آیکون مشکی، همه رنگهای دیگر = آیکون سفید
  return isWhiteColor(props.color) ? '#000000' : '#ffffff'
})
</script>