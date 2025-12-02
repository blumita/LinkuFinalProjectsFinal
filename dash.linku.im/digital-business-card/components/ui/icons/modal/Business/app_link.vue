<template>
<svg
   viewBox="0 0 24 24"
   :width="size"
   :height="size"
   xmlns="http://www.w3.org/2000/svg">
  <rect
     x="0"
     y="0"
     width="24"
     height="24"
     rx="4.5"
     ry="4.5"
     :fill="props.color || '#3dc2f1'" />
  <g transform="scale(0.0875) translate(28, 26)">
    <path
         d="M 155.5,166.5 H 65.6 c -4.7,0 -9,-3.2 -9.7,-7.8 -0.9,-5.9 3.6,-10.8 9.2,-10.8 H 151 c 1.9,0 3.7,1 4.7,2.7 l 4.5,7.9 c 2.1,3.6 -0.5,8.1 -4.7,8.1 z"
         :fill="iconColor" />
    <path
         d="m 215.4,157.2 c 0,5.1 -4.2,9.3 -9.3,9.3 h -35.8 l -10.7,-18.7 h 46.6 c 5.2,0 9.3,4.2 9.3,9.3 z"
         :fill="iconColor" />
    <path
         d="m 83.8,168.9 h 9.1 c 4.2,0 6.8,4.5 4.7,8.1 l -10.5,18.3 c -1.7,3 -4.9,4.7 -8.1,4.7 -3.2,0 -3.2,-0.4 -4.7,-1.2 -4.4,-2.6 -6,-8.3 -3.4,-12.8 l 8.3,-14.3 c 1,-1.7 2.7,-2.7 4.7,-2.7 z"
         :fill="iconColor" />
    <path
         d="m 157.6,73.2 -41.8,72.4 -1.4,2.3 -1.4,2.3 -8.1,14 H 83.3 l 8.1,-14 2.7,-4.7 47.2,-81.7 c 2.6,-4.4 8.3,-6 12.7,-3.4 4.5,2.6 6,8.3 3.4,12.7 z"
         :fill="iconColor" />
    <path
         d="m 145,90.2 -10.8,18.6 -8.1,-14 -1.4,-2.3 -1.4,-2.3 -9.8,-17 c -2.6,-4.4 -1.1,-10.2 3.4,-12.7 4.5,-2.6 10.2,-1 12.7,3.4 l 4.4,7.7 1.4,2.3 1.4,2.3 8.1,14 z"
         :fill="iconColor" />
    <path
         d="m 196.9,198.7 c -1.4,0.8 -3,1.2 -4.6,1.2 -3.2,0 -6.4,-1.6 -8.1,-4.7 l -45.6,-79.1 c -1,-1.7 -1,-3.7 0,-5.4 l 4.5,-7.9 c 2.1,-3.6 7.3,-3.6 9.3,0 l 47.9,83 c 2.6,4.5 1,10.2 -3.5,12.8 z"
         :fill="iconColor" />
  </g>
</svg>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  size?: number | string
  color?: string
  filled?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  size: 24,
  color: '#3dc2f1',
  filled: false
})

// تابع برای تشخیص رنگ سفید
const isWhiteColor = (color: string): boolean => {
  if (!color || color === "transparent") return false
  const hex = color.replace("#", "").toLowerCase()
  return hex === "ffffff" || hex === "fff" || color.toLowerCase() === "white"
}

// تعیین رنگ آیکون بر اساس رنگ پس‌زمینه
const iconColor = computed(() => {
  const currentColor = props.color || '#3dc2f1'
  return isWhiteColor(currentColor) ? '#000000' : '#ffffff'
})
</script>