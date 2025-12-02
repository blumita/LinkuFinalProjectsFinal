<template>
<svg
   id="uuid-46efc14f-0611-47ce-a56a-95b1e205428b"
   viewBox="0 0 219.10001 219.1"
   version="1.1"
   :width="size"
   :height="size"
   xmlns="http://www.w3.org/2000/svg"
   xmlns:svg="http://www.w3.org/2000/svg">
  <defs
     id="defs17">
    <linearGradient
       v-if="props.color"
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
  <rect
     id="rect2"
     x="0"
     y="0"
     width="219.10001"
     height="219.10001"
     rx="63.400002"
     ry="63.400002"
     :fill="primaryFill" />
  <g
     id="g12"
     transform="translate(-26.9,-21.799999)">
    <path
       id="path4"
       d="m 128.3,160.5 c 0,2.8 -2.3,2.3 -4,2.3 -5.4,0 -10.9,0 -16.3,0 -5.4,0 -10.9,0 -16.4,0 -1.7,0 -4,0.7 -4,-2.2 0,-2.6 1.8,-2.7 3.7,-2.7 11.1,0 22.1,0 33.2,0 1.9,0 3.8,0 3.8,2.7 z"
       :fill="textColor" />
    <path
       id="path6"
       d="m 197.9,108.1 c 0,-9.6 -9.1,-16.8 -16.5,-16.8 -32,0 -64,0 -95.9,0 -7.9,0 -15.9,8.5 -15.9,16.3 0,17.9 0,35.8 0,53.7 0,8.8 7.8,16.5 16.7,16.5 15.7,0 31.5,0 47.2,0 15.7,0 31.5,0 47.2,0 9.1,0 17.1,-7.3 17.2,-16.5 0.2,-17.7 0.1,-35.5 0,-53.2 z m -4.1,18.5 c -0.3,10.1 -0.3,20.2 0,30.3 0.2,8.4 -5,16.4 -15.9,16.1 -29.5,-0.6 -59,-0.5 -88.5,0 -9.7,0.1 -15.7,-5.9 -15.5,-15.6 0.2,-10.4 0.2,-20.9 0,-31.3 0,-3.2 0.8,-4.2 4.1,-4.2 18.7,0.2 37.4,0 56.1,0 18.7,0 36.8,0.1 55.2,0 3.8,0 4.7,1 4.6,4.7 z m -6,-9.4 c -18,-0.4 -36.1,-0.2 -54.1,-0.2 -18,0 -36.1,-0.2 -54.2,0.2 -5.1,0.1 -6,-1.6 -5.7,-6.1 0.4,-5.4 1.6,-10.1 6.5,-13.3 2.3,-1.5 4.5,-1.7 7,-1.7 30.5,0 60.9,0.3 91.4,-0.2 9.2,-0.1 14.8,7.2 15.1,15 0.2,4.8 -0.8,6.4 -6.1,6.3 z"
       :fill="textColor" />
    <path
       id="path8"
       d="m 128.3,160.5 c 0,2.8 -2.3,2.3 -4,2.3 -5.4,0 -10.9,0 -16.3,0 -5.4,0 -10.9,0 -16.4,0 -1.7,0 -4,0.7 -4,-2.2 0,-2.6 1.8,-2.7 3.7,-2.7 11.1,0 22.1,0 33.2,0 1.9,0 3.8,0 3.8,2.7 z"
       :fill="primaryFill" />
    <path
       id="path10"
       d="m 128.3,160.5 c 0,2.8 -2.3,2.3 -4,2.3 -5.4,0 -10.9,0 -16.3,0 -5.4,0 -10.9,0 -16.4,0 -1.7,0 -4,0.7 -4,-2.2 0,-2.6 1.8,-2.7 3.7,-2.7 11.1,0 22.1,0 33.2,0 1.9,0 3.8,0 3.8,2.7 z"
       :fill="textColor" />
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
  size: 24
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
  return `card-gradient-${(props.color || '#007bff').replace('#', '')}`
})

const lightColor = computed(() => {
  return props.color ? adjustBrightness(props.color, 40) : '#f8f9fa'
})

const darkColor = computed(() => {
  return props.color ? adjustBrightness(props.color, -20) : '#e9ecef'
})

const primaryFill = computed(() => {
  return props.color || '#ffffff' // رنگ پیش‌فرض سفید
})

const textColor = computed(() => {
  if (!props.color) {
    // حالت پیش‌فرض: ایکون تیره برای پس‌زمینه سفید
    return '#333333'
  }
  
  // تشخیص رنگ سفید با روش‌های مختلف
  const colorLower = props.color.toLowerCase().trim()
  const isWhite = colorLower === '#ffffff' || 
                  colorLower === '#fff' || 
                  colorLower === 'white' || 
                  colorLower === 'rgb(255,255,255)' ||
                  colorLower === 'rgb(255, 255, 255)' ||
                  isWhiteColor(props.color)
  
  if (isWhite) {
    return '#333333' // ایکون تیره برای پس‌زمینه سفید/روشن
  }
  
  // برای همه رنگ‌های دیگر، ایکون سفید باشد
  return '#ffffff'
})
</script>