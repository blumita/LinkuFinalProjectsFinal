<template>
  <svg
   id="uuid-2b683a1f-ec96-4b5f-a9ed-6cf0af7d30d4"
   viewBox="0 0 219.10001 219.1"
   version="1.1"
   :width="size"
   :height="size"
   xmlns="http://www.w3.org/2000/svg"
   xmlns:svg="http://www.w3.org/2000/svg">
  <defs
     id="defs13" />
  <rect
     x="0"
     y="0"
     width="219.10001"
     height="219.10001"
     rx="63.400002"
     ry="63.400002"
     :fill="props.color || '#ffffff'"
     id="rect2" />
  <g
     id="g8"
     transform="translate(-26.9,-21.799999)">
    <path
       d="m 132.3,163.9 c -14.8,0 -29.5,0 -44.3,0 -5.2,0 -8.4,-2.8 -8.5,-8.1 -0.1,-16.1 -0.1,-32.2 0,-48.2 0,-5.2 4.3,-8.4 10.7,-8.4 20.7,0 41.4,0 62.2,0 7.3,0 14.6,0 21.9,0 8,0 10.7,2.8 10.7,10.5 0,15.3 0,30.5 0,45.8 0,5.7 -2.7,8.4 -8.5,8.4 -14.8,0 -29.5,0 -44.3,0 z m 0,-56.8 c -13.8,0 -27.5,0.1 -41.3,0 -3.8,0 -4.7,1.1 -4.6,4.7 0.2,13.6 0.2,27.2 0,40.8 0,3.5 1.2,4.6 4.6,4.5 27.5,0 55,-0.1 82.5,0 3.5,0 4.6,-1.1 4.6,-4.6 -0.1,-13.8 -0.2,-27.5 0,-41.3 0,-3.2 -0.9,-4.2 -4.2,-4.2 -13.9,0.2 -27.8,0 -41.8,0 z"
       :fill="textColor"
       id="path4" />
    <path
       d="m 154.8,140.8 c -0.4,-0.3 -0.9,-0.6 -1.3,-1.1 -3.6,-4.2 -7.1,-8.4 -10.7,-12.6 -0.9,-1.1 -1.3,-2.7 -0.2,-3.6 1.5,-1.1 2.4,0.6 3.2,1.5 2.5,2.7 5,5.5 7.3,8.5 1.4,1.8 2.3,2.4 4,0.3 2.6,-3.2 5.4,-6.2 8.1,-9.3 0.8,-1 1.6,-1.8 2.8,-0.9 1.4,1.1 0.9,2.1 -0.1,3.3 -3.6,4.1 -7,8.3 -10.5,12.5 -0.6,0.8 -1.1,1.7 -2.5,1.6 z"
       :fill="textColor"
       id="path6" />
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
  if (!props.color) return '#000000' // رنگ پیش‌فرض مشکی
  return isWhiteColor(props.color) ? '#000000' : '#ffffff'
})
</script>