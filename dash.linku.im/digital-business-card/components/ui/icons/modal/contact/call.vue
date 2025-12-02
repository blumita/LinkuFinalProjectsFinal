<template>
  <svg
   id="uuid-5a87f836-fbc6-425f-bacf-0397887e27c6"
   viewBox="0 0 219.24601 219.246"
   version="1.1"
   :width="size"
   :height="size"
   xmlns="http://www.w3.org/2000/svg"
   xmlns:svg="http://www.w3.org/2000/svg">
  <defs
     id="defs7">
    <linearGradient
       :id="gradientId"
       x1="137.05701"
       y1="20.705"
       x2="137.05701"
       y2="239.951"
       gradientUnits="userSpaceOnUse"
       gradientTransform="translate(-27.434,-20.705)">
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
  <rect
     x="0"
     y="0"
     width="219.246"
     height="219.246"
     rx="41.598"
     ry="41.598"
     :fill="props.color ? props.color : `url(#${gradientId})`"
     id="rect9" />
  <path
     d="M 178.03,173.734 C 160.349,191.416 115.451,175.154 77.713,137.415 40.007,99.709 23.746,54.814 41.428,37.132 c 3.771,-3.771 8.804,-6.004 14.736,-6.793 2.119,-0.282 4.243,0.563 5.47,2.314 l 26.131,37.269 c 1.551,2.213 1.289,5.219 -0.622,7.13 l -7.803,7.803 c -4.25,4.25 -4.25,11.14 0,15.39 l 35.542,35.542 c 4.25,4.251 11.142,4.251 15.392,0 l 7.935,-7.935 c 1.91,-1.91 4.916,-2.173 7.128,-0.622 l 37.237,26.091 c 1.601,1.122 2.579,3.01 2.36,4.954 -0.704,6.241 -2.964,11.519 -6.904,15.459 z"
     :fill="textColor"
     id="path11" />
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