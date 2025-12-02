<template>
  <svg
   id="uuid-c79f64a7-2bc3-41f4-81db-171056a66f24"
   viewBox="0 0 135 113"
   version="1.1"
   :width="size"
   :height="size"
   xmlns="http://www.w3.org/2000/svg"
   xmlns:svg="http://www.w3.org/2000/svg">
  <defs
     id="defs21" />
  <path
     d="m 0,103.9 c 0,5 4,9 8.9,9 H 9 c -5,0 -9,-4 -9,-9 z"
     :fill="innerIconColor || '#fdba12'"
     id="path2" />
  <path
     d="M 76.6,33.9 V 57.5 L 107.7,31.9 V 9.1 c 0,-5 -4,-9 -8.9,-9 H 31.4 V 34 c 0,0 45.2,0 45.2,0 z"
     :fill="props.color || '#fdba12'"
     id="path4" />
  <path
     d="M 76.6,81.1 H 31.3 V 113 c 0,0 67.5,0 67.5,0 4.9,0 8.9,-4 8.9,-9 V 83.4 L 76.6,57.5 Z"
     :fill="innerIconColor || '#0dac4b'"
     id="path6" />
  <polygon
     points="448.4,104.3 448.5,70.4 417.1,104.3 "
     :fill="innerIconColor || '#e94435'"
     id="polygon8"
     transform="translate(-417.1,-70.4)" />
  <path
     d="m 0,81.1 v 22.8 c 0,5 4,9 9,9 H 31.1 V 81 C 31.1,81 0,81 0,81 Z"
     :fill="innerIconColor || '#3768b2'"
     id="path10" />
  <polygon
     points="417.1,151.5 448.3,151.5 448.4,104.3 417.1,104.3 "
     :fill="innerIconColor || '#4a7bbe'"
     id="polygon12"
     transform="translate(-417.1,-70.4)" />
  <path
     d="M 135,95.9 V 18.3 C 133.2,8 122.2,19.8 122.2,19.8 l -14.6,12 v 51.5 l 20.8,17.3 c 7.5,1 6.5,-4.8 6.5,-4.8 z"
     :fill="innerIconColor || '#0dac4b'"
     id="path14" />
  <polygon
     points="524.8,102.2 493.7,127.9 524.8,153.7 "
     :fill="innerIconColor || '#0d8441'"
     id="polygon16"
     transform="translate(-417.1,-70.4)" />
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
  filled: false
})

// Function to determine if a color is light
// تابع برای تشخیص رنگ سفید
const isWhiteColor = (color: string): boolean => {
  if (!color || color === "transparent") return false
  
  // حذف # از ابتدای رنگ hex
  const hex = color.replace("#", "").toLowerCase()
  
  // بررسی اینکه رنگ سفید باشد
  return hex === "ffffff" || hex === "fff" || color.toLowerCase() === "white"
}

// Computed property for inner icon colors
const innerIconColor = computed(() => {
  if (!props.color) return null
  // Use the same color as main color but with opacity for contrast
  return props.color + '80' // Adding 80 for 50% opacity in hex
})
</script>