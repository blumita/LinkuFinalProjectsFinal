<template>
  <svg
   id="uuid-cfa7f3fa-dd5b-4e93-95f5-39347ad8d032"
   viewBox="0 0 219.73 219.72999"
   version="1.1"
   :width="size"
   :height="size"
   xmlns="http://www.w3.org/2000/svg"
   xmlns:svg="http://www.w3.org/2000/svg">
  <defs
     id="defs9" />
  <rect
     x="0"
     y="0"
     width="219.73"
     height="219.73"
     rx="63.578999"
     ry="63.578999"
     :fill="props.color ? props.color : '#010101'"
     id="rect2" />
  <g
     id="uuid-1d765981-7cb8-42ab-8837-b6850f8f2835"
     transform="translate(-27.733,-20.221001)">
    <path
       id="uuid-16d8c9c9-eeb7-4623-8fe5-bf6f2d63ec8b"
       d="m 72.727,69.072 50.338,67.306 -50.655,54.723 h 11.401 l 44.349,-47.91 35.832,47.91 h 38.796 l -53.17,-71.092 47.15,-50.937 h -11.401 l -40.844,44.124 -33,-44.124 H 72.728 Z m 16.766,8.398 h 17.823 l 78.704,105.233 h -17.823 z"
       :fill="props.color ? textColor : '#ffffff'" />
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