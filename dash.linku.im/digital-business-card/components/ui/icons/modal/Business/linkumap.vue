<template>
  <svg :width="size" :height="size" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="linkumap-gradient" x1="40" y1="0" x2="40" y2="80" gradientUnits="userSpaceOnUse">
        <stop stop-color="#4285F4"/>
        <stop offset="1" stop-color="#1a73e8"/>
      </linearGradient>
    </defs>
    <!-- Background rounded rect -->
    <path d="M18.0952 0H61.9048C71.9048 0 80 8.09524 80 18.0952V61.9048C80 71.9048 71.9048 80 61.9048 80H18.0952C8.09524 80 0 71.9048 0 61.9048V18.0952C0 8.09524 8.09524 0 18.0952 0Z" 
          :fill="props.color ? props.color : 'url(#linkumap-gradient)'" />
    <!-- Map pin icon -->
    <path d="M40 14C30.1 14 22 22.1 22 32C22 45.3 40 64 40 64S58 45.3 58 32C58 22.1 49.9 14 40 14ZM40 40C35.6 40 32 36.4 32 32C32 27.6 35.6 24 40 24S48 27.6 48 32C48 36.4 44.4 40 40 40Z"
          :fill="textColor"/>
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

const isWhiteColor = (color: string): boolean => {
  if (!color || color === "transparent") return false
  const hex = color.replace("#", "").toLowerCase()
  return hex === "ffffff" || hex === "fff" || color.toLowerCase() === "white"
}

const textColor = computed(() => {
  if (!props.color) return '#ffffff'
  return isWhiteColor(props.color) ? '#000000' : '#ffffff'
})
</script>