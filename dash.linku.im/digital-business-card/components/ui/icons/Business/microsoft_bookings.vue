<template>
  <svg
   id="uuid-1137a794-4953-47c3-8447-c7447cb7cc97"
   viewBox="0 0 219.13001 219.13"
   version="1.1"
   :width="size"
   :height="size"
   xmlns="http://www.w3.org/2000/svg"
   xmlns:svg="http://www.w3.org/2000/svg">
  <defs
     id="defs15" />
  <rect
     x="0"
     y="0"
     width="219.13"
     height="219.13"
     rx="63.405998"
     ry="63.405998"
     :fill="props.color || '#058373'"
     id="rect2" />
  <g
     id="g10"
     transform="translate(-28.440001,-20.597)">
    <path
       d="m 191.836,160.662 c -18.389,-0.071 -36.778,-0.198 -55.166,-0.197 -19.052,0.001 -38.103,0.128 -57.155,0.199 -0.569,-0.194 -0.962,-0.03 -1.145,0.562 -0.839,0.472 -0.934,1.282 -0.931,2.115 0.061,16.283 0.128,32.565 0.193,48.848 0.268,1.687 1.359,2.107 2.877,1.869 20.525,0 41.05,0 61.576,0 4.526,0.427 8.867,-0.715 13.142,-1.851 20.393,-5.419 36.704,-24.648 38.523,-45.564 0.166,-1.906 2.205,-5.15 -1.913,-5.981 z"
       :fill="textColor"
       id="path4" />
    <path
       d="m 126.582,150.438 c 3.243,0.341 4.559,-0.752 4.554,-4.021 -0.05,-31.776 -0.058,-63.553 -0.016,-95.329 0.005,-3.432 -1.614,-4.702 -4.844,-4.71 -14.895,-0.038 -29.789,-0.147 -44.684,-0.187 -1.574,-0.004 -3.433,-0.294 -3.974,1.945 0.007,17.216 0.013,34.433 0.02,51.649 1.766,27.092 21.823,47.802 48.944,50.653 z"
       :fill="textColor"
       id="path6" />
    <path
       d="m 144.146,150.629 c 16.214,-0.13 32.428,-0.218 48.643,-0.319 2.343,-1.606 1.174,-3.964 0.946,-5.854 -2.912,-24.141 -20.566,-42.39 -44.699,-46.402 -1.641,-0.108 -3.282,-0.215 -4.923,-0.323 -0.662,0.041 -1.324,0.083 -1.986,0.124 -0.749,0.164 -1.117,0.692 -1.119,1.397 -0.039,16.222 -0.062,32.445 -0.091,48.667 -0.004,2.203 1.291,2.724 3.23,2.709 z"
       :fill="textColor"
       id="path8" />
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