<template>
  <svg
   id="uuid-e52c03de-4e27-4d01-b11a-73d9fc8fa55c"
   viewBox="0 0 219.359 219.35899"
   version="1.1"
   :width="size"
   :height="size"
   xmlns="http://www.w3.org/2000/svg"
   xmlns:svg="http://www.w3.org/2000/svg">
  <defs
     id="defs7">
    <linearGradient
       :id="gradientId"
       x1="136.957"
       y1="20.591999"
       x2="136.957"
       y2="239.951"
       gradientUnits="userSpaceOnUse"
       gradientTransform="translate(-27.277,-20.592)">
      <stop
         offset="0"
         stop-color="#456fb6"
         id="stop2" />
      <stop
         offset="1"
         stop-color="#29bbe6"
         id="stop4" />
    </linearGradient>
  </defs>
  <path
     d="m 41.62,0 h 136.12 c 22.97,0 41.619,18.649 41.619,41.619 V 177.74 c 0,22.97 -18.649,41.619 -41.619,41.619 H 41.62 C 18.65,219.359 0,200.71 0,177.739 V 41.62 C 0,18.65 18.649,0 41.62,0 Z"
     :fill="props.color ? props.color : `url(#${gradientId})`"
     id="path9" />
  <g
     id="g19"
     transform="translate(-27.277,-20.592)">
    <path
       d="m 213.691,180.916 c -0.793,0.699 -1.773,1.073 -2.846,1.073 H 63.022 c -1.028,0 -2.054,-0.374 -2.801,-1.073 l 47.922,-47.506 c 0.371,-0.368 0.968,-0.369 1.339,-0.002 l 8.897,8.766 c 10.222,10.131 26.887,10.131 37.061,0 l 8.9,-8.766 c 0.372,-0.366 0.968,-0.365 1.339,0.001 l 48.013,47.508 z"
       :fill="textColor"
       id="path11" />
    <path
       d="m 105.653,130.903 -45.256,44.812 c -0.602,0.596 -1.623,0.169 -1.623,-0.677 V 85.412 c 0,-0.846 1.021,-1.272 1.623,-0.677 l 45.256,44.815 c 0.376,0.372 0.376,0.98 0,1.353 z"
       :fill="textColor"
       id="path13" />
    <path
       d="m 213.646,79.582 -48.636,48.217 -11.998,11.853 c -8.868,8.822 -23.29,8.822 -32.206,0 L 108.811,127.799 60.221,79.628 c 0.187,-0.187 0.419,-0.373 0.7,-0.513 0.328,-0.187 0.654,-0.326 1.028,-0.419 0.326,-0.094 0.7,-0.142 1.074,-0.142 h 147.822 c 0.374,0 0.747,0.048 1.073,0.142 0.373,0.093 0.7,0.232 1.028,0.419 0.232,0.093 0.465,0.281 0.7,0.467 z"
       :fill="textColor"
       id="path15" />
    <path
       d="m 215.139,85.367 v 89.81 c 0,0.846 -1.021,1.272 -1.623,0.677 l -45.35,-44.906 c -0.377,-0.373 -0.377,-0.981 0,-1.354 l 45.35,-44.905 c 0.602,-0.596 1.623,-0.17 1.623,0.677 z"
       :fill="textColor"
       id="path17" />
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