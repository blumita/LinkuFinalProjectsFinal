<template>
  <svg :width="size" :height="size" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="github-gradient" x1="40" y1="0" x2="40" y2="80" gradientUnits="userSpaceOnUse">
        <stop stop-color="#24292e"/>
        <stop offset="1" stop-color="#1a1e22"/>
      </linearGradient>
    </defs>
    <!-- Background rounded rect -->
    <path d="M18.0952 0H61.9048C71.9048 0 80 8.09524 80 18.0952V61.9048C80 71.9048 71.9048 80 61.9048 80H18.0952C8.09524 80 0 71.9048 0 61.9048V18.0952C0 8.09524 8.09524 0 18.0952 0Z" 
          :fill="props.color ? props.color : 'url(#github-gradient)'" />
    <!-- GitHub icon -->
    <path d="M40 16C26.7 16 16 26.7 16 40C16 50.6 23.2 59.5 32.8 62.5C34.1 62.7 34.5 61.9 34.5 61.2C34.5 60.6 34.5 58.8 34.5 56.5C27.5 58.1 26 53.1 26 53.1C24.8 50.4 23.1 49.6 23.1 49.6C20.8 48 23.3 48.1 23.3 48.1C25.9 48.3 27.2 50.8 27.2 50.8C29.5 54.7 33.3 53.5 34.6 52.8C34.8 51.1 35.5 49.9 36.2 49.3C30.6 48.6 24.7 46.4 24.7 37.2C24.7 34.6 25.7 32.5 27.3 30.8C27 30.2 26.2 27.7 27.5 24.5C27.5 24.5 29.7 23.8 34.4 26.8C36.5 26.3 38.8 26 41 26C43.2 26 45.5 26.3 47.6 26.8C52.3 23.8 54.5 24.5 54.5 24.5C55.8 27.7 55 30.2 54.7 30.8C56.3 32.5 57.3 34.6 57.3 37.2C57.3 46.4 51.4 48.6 45.8 49.2C46.7 49.9 47.5 51.4 47.5 53.6C47.5 56.8 47.5 59.3 47.5 60.1C47.5 60.8 47.9 61.6 49.3 61.4C58.8 58.4 66 50.6 66 40C66 26.7 55.3 16 40 16Z"
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