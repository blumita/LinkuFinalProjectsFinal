<template>
  <svg
   id="uuid-4b86f88c-0bf6-4544-a764-37b0ff26c515"
   viewBox="0 0 219.60001 219.6"
   version="1.1"
   :width="size"
   :height="size"
   xmlns="http://www.w3.org/2000/svg"
   xmlns:svg="http://www.w3.org/2000/svg">
  <defs
     id="defs7">
    <linearGradient
       :id="gradientId"
       x1="136.491"
       y1="242.896"
       x2="136.491"
       y2="23.296"
       gradientTransform="matrix(1,0,0,-1,-26.691,242.896)"
       gradientUnits="userSpaceOnUse">
      <stop
         offset="0"
         stop-color="#80c566"
         id="stop2" />
      <stop
         offset="1"
         stop-color="#37b44a"
         id="stop4" />
    </linearGradient>
  </defs>
  <path
     d="M 177.9,0 H 41.7 C 18.7,0 0,18.7 0,41.7 v 136.2 c 0,23 18.7,41.7 41.7,41.7 h 136.2 c 23,0 41.7,-18.7 41.7,-41.7 V 41.7 C 219.6,18.7 200.9,0 177.9,0 Z"
     :fill="props.color ? props.color : `url(#${gradientId})`"
     id="path9"
      />
  <g
     id="g15"
     transform="translate(-26.691,-20.351)">
    <path
       d="m 149.291,83.051 h -69.1 c -10.4,0 -18.8,8.4 -18.8,18.8 v 56.6 c 0,10.4 8.4,18.8 18.8,18.8 h 69.1 c 10.4,0 18.8,-8.4 18.8,-18.8 v -56.6 c 0,-10.4 -8.4,-18.8 -18.8,-18.8 z"
       :fill="textColor"
       id="path11" />
    <path
       d="m 197.291,170.451 -22.3,-18.7 c -1.5,-1.3 -2.4,-3.2 -2.4,-5.2 v -32.7 c 0,-2 0.9,-3.9 2.4,-5.2 l 22.4,-18.7 c 5.6,-4.7 14.2,-0.7 14.2,6.6 v 67.3 c 0,7.3 -8.6,11.3 -14.3,6.6 z"
       :fill="textColor"
       id="path13" />
  </g>
</svg>
</template>

<script setup lang="ts">
import { computed, useId } from 'vue'

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

const gradientId = useId()

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