<template>
  <svg
   id="uuid-3c52e843-e55a-49f4-88d1-135fc38df4d2"
   viewBox="0 0 218.60801 218.60899"
   version="1.1"
   :width="props.size"
   :height="props.size"
   xmlns="http://www.w3.org/2000/svg"
   xmlns:svg="http://www.w3.org/2000/svg">
  <defs
     id="defs7">
    <linearGradient
       id="uuid-ddfc84e2-3a75-43df-a65b-608065abd20b"
       x1="135.492"
       y1="19.698999"
       x2="135.492"
       y2="238.308"
       gradientUnits="userSpaceOnUse"
       gradientTransform="translate(-26.188,-19.699)">
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
     d="m 41.478,0 h 135.653 c 22.892,0 41.477,18.585 41.477,41.477 v 135.655 c 0,22.892 -18.585,41.477 -41.477,41.477 H 41.477 C 18.585,218.609 0,200.024 0,177.132 V 41.478 C 0,18.586 18.586,0 41.478,0 Z"
     :fill="props.color ? props.color : 'url(#uuid-ddfc84e2-3a75-43df-a65b-608065abd20b)'"
     id="path9" />
  <path
     d="m 189.932,104.691 c 0,-37.036 -36.099,-67.061 -80.628,-67.061 -44.529,0 -80.628,30.024 -80.628,67.061 0,23.586 14.638,44.327 36.771,56.282 3.627,1.959 2.376,8.929 -8.727,19.101 -0.358,0.328 -0.099,0.962 0.383,0.902 17.16,-2.174 28.831,-11.975 33.176,-11.101 6.1,1.228 12.471,1.878 19.025,1.878 44.53,0 80.628,-30.025 80.628,-67.062 z"
     :fill="textColor"
     id="path11" />
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