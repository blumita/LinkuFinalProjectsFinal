<template>
  <svg
   id="uuid-9f49aa88-b19b-4895-9182-9db388c95eb7"
   viewBox="0 0 219.10001 219.1"
   version="1.1"
   :width="size"
   :height="size"
   xmlns="http://www.w3.org/2000/svg"
   xmlns:svg="http://www.w3.org/2000/svg">
  <defs
     id="defs19" />
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
     id="g14"
     transform="translate(-26.9,-21.799999)">
    <path
       d="m 174.1,71.6 h -23.4 c -0.6,-0.2 -1.2,-0.3 -1.9,-0.3 h -4 c -0.4,-5.1 -4.6,-9 -9.7,-9 -5.1,0 -9.4,4 -9.7,9 h -4.9 c -0.7,0 -1.3,0 -1.9,0.3 H 98.1 C 90.3,71.6 84,77.9 84,85.7 v 91.1 c 0,7.8 6.3,14.2 14.1,14.2 h 76.2 c 7.8,0 14.1,-6.4 14.1,-14.2 V 85.7 c 0,-7.8 -6.3,-14.1 -14.1,-14.1 z m -44.8,1.3 V 72 c 0,-3.2 2.6,-5.8 5.8,-5.8 3.2,0 5.8,2.6 5.8,5.8 0,3.2 0,0.6 0,0.9 l -0.5,2.4 h 8.5 l 1,0.5 c 0.9,0.4 1.4,1.3 1.4,2.3 v 6.8 c 0,1.4 -1.1,2.6 -2.5,2.6 h -28.4 c -1.4,0 -2.6,-1.1 -2.6,-2.6 v -6.8 c 0,-1 0.6,-1.9 1.4,-2.3 l 1.1,-0.5 h 9.4 l -0.5,-2.4 v 0 z m 54.6,104 c 0,5.4 -4.4,9.8 -9.8,9.8 H 98 c -5.4,0 -9.8,-4.4 -9.8,-9.8 V 85.7 c 0,-5.4 4.4,-9.8 9.8,-9.8 h 15.8 c -0.2,0.7 -0.3,1.4 -0.3,2.1 v 6.8 c 0,3.8 3.1,6.9 6.9,6.9 h 28.4 c 3.8,0 6.9,-3.1 6.9,-6.9 V 78 c 0,-0.7 -0.1,-1.4 -0.3,-2.1 h 18.8 c 5.4,0 9.8,4.4 9.8,9.8 v 91.1 0 z"
       :fill="textColor"
       id="path4" />
    <path
       d="m 127.8,123.4 c 1.2,0 2.2,-1 2.2,-2.2 0,-1.2 -1,-2.2 -2.2,-2.2 h -25.4 c -1.2,0 -2.2,1 -2.2,2.2 0,1.2 1,2.2 2.2,2.2 z"
       :fill="textColor"
       id="path6" />
    <path
       d="m 170.3,118.9 h -25.4 c -1.2,0 -2.2,1 -2.2,2.2 0,1.2 1,2.2 2.2,2.2 h 25.4 c 1.2,0 2.2,-1 2.2,-2.2 0,-1.2 -1,-2.2 -2.2,-2.2 z"
       :fill="textColor"
       id="path8" />
    <path
       d="m 169.8,153.3 h -25.4 c -1.2,0 -2.2,1 -2.2,2.2 0,1.2 1,2.2 2.2,2.2 h 25.4 c 1.2,0 2.2,-1 2.2,-2.2 0,-1.2 -1,-2.2 -2.2,-2.2 z"
       :fill="textColor"
       id="path10" />
    <path
       d="m 128.9,154 h -25.4 c -1.2,0 -2.2,1 -2.2,2.2 0,1.2 1,2.2 2.2,2.2 h 25.4 c 1.2,0 2.2,-1 2.2,-2.2 0,-1.2 -1,-2.2 -2.2,-2.2 z"
       :fill="textColor"
       id="path12" />
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