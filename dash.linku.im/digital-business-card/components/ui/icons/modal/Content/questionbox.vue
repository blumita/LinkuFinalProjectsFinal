<template>
  <svg
   id="uuid-042fe483-9a29-42da-a94c-3c787ed149b6"
   viewBox="0 0 219.10001 219.1"
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
     width="219.10001"
     height="219.10001"
     rx="63.400002"
     ry="63.400002"
     :fill="primaryColor"
     id="rect2" />
  <g
     id="g10"
     transform="translate(-26.9,-21.799999)">
    <path
       d="m 198,135.5 c 1.3,34.9 -29.3,64.4 -63.9,64.3 -35.4,0 -65.3,-29.3 -64.5,-65.9 0.7,-32.6 28,-64 67.2,-62.7 31.3,1 62.7,29.1 61.2,64.4 z m -9.5,0.1 C 189,106 164.9,80.8 134.3,80.8 c -30.5,0 -53.2,23.1 -54.7,51.3 -1.9,33.9 24.7,56.2 50.8,57.8 32.7,2 58.4,-24.1 58.1,-54.2 z"
       :fill="textColor"
       id="path4" />
    <path
       d="m 134.3,95.1 c 8.5,0.6 16.6,2.4 22.3,9.6 7.1,9 6.4,18.5 -1.5,27 -4.3,4.6 -9.9,8 -13.5,13.3 -1.3,2 -2.1,3.8 -2.5,6.2 -0.6,3.9 -2.8,7 -7.2,6.6 -4,-0.4 -6.5,-3.2 -6.6,-7.3 -0.2,-5.7 2,-10.6 5.9,-14.6 3.3,-3.4 7.2,-6.4 10.5,-9.8 2.8,-3 5.8,-6.3 4,-10.9 -1.6,-4.1 -4,-7.7 -9,-8 -5.2,-0.3 -10,-0.1 -13.1,5.3 -1.5,2.6 -3,5.1 -3.8,7.9 -1.4,5.1 -5.2,5.2 -9,4.5 -3.5,-0.6 -4.2,-3.5 -4.7,-7 -1,-7.9 8.3,-17.8 16.4,-20.6 3.7,-1.2 7.5,-2.5 11.6,-2.2 z"
       :fill="textColor"
       id="path6" />
    <path
       d="m 133.2,178.9 c -5.3,0 -8.8,-3 -8.8,-7.7 0,-4.7 3.5,-8.2 8.5,-8.3 5,-0.1 8.5,3.3 8.4,8.2 0,4.6 -3.3,7.8 -8.1,7.8 z"
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

// رنگ اصلی آیکون - اگر کاربر رنگی انتخاب کرده باشد از آن استفاده کن، وگرنه رنگ پیش‌فرض
const primaryColor = computed(() => {
  if (props.color && props.color !== 'transparent') {
    return props.color
  }
  // رنگ پیش‌فرض سفید
  return '#ffffff'
})

// تعیین رنگ متن بر اساس رنگ پس‌زمینه
const textColor = computed(() => {
  return isWhiteColor(primaryColor.value) ? '#000000' : '#ffffff'
})
</script>