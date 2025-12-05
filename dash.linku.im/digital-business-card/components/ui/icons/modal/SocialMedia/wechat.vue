<template>
  <svg
   viewBox="0 0 48 48"
   version="1.1"
   :width="size"
   :height="size"
   xmlns="http://www.w3.org/2000/svg">
  <rect
     x="0"
     y="0"
     width="48"
     height="48"
     rx="12"
     ry="12"
     :fill="fillColor" />
  <g transform="translate(6, 6)">
    <path
       d="M 13.5 8 C 8.5 8 4.5 11.2 4.5 15.2 C 4.5 17.5 5.8 19.5 7.8 20.8 L 7 23.5 L 10 22 C 11 22.3 12.2 22.5 13.5 22.5 C 18.5 22.5 22.5 19.2 22.5 15.2 C 22.5 11.2 18.5 8 13.5 8 Z M 10 13.5 C 9.2 13.5 8.5 12.8 8.5 12 C 8.5 11.2 9.2 10.5 10 10.5 C 10.8 10.5 11.5 11.2 11.5 12 C 11.5 12.8 10.8 13.5 10 13.5 Z M 17 13.5 C 16.2 13.5 15.5 12.8 15.5 12 C 15.5 11.2 16.2 10.5 17 10.5 C 17.8 10.5 18.5 11.2 18.5 12 C 18.5 12.8 17.8 13.5 17 13.5 Z"
       fill="#ffffff" />
    <path
       d="M 25.5 19 C 25.5 15.5 22 12.5 17.8 12.5 C 17.5 12.5 17.2 12.5 16.9 12.6 C 17.5 13.3 17.9 14.2 17.9 15.2 C 17.9 17.8 15.2 19.9 11.9 19.9 C 11.3 19.9 10.8 19.8 10.3 19.7 C 11.5 21.5 13.9 22.8 16.7 22.8 C 17.8 22.8 18.8 22.6 19.8 22.3 L 22.5 23.8 L 21.7 21.3 C 23.5 20.1 25.5 19.8 25.5 19 Z M 20 17.5 C 19.4 17.5 18.9 17 18.9 16.4 C 18.9 15.8 19.4 15.3 20 15.3 C 20.6 15.3 21.1 15.8 21.1 16.4 C 21.1 17 20.6 17.5 20 17.5 Z M 23.5 17.5 C 22.9 17.5 22.4 17 22.4 16.4 C 22.4 15.8 22.9 15.3 23.5 15.3 C 24.1 15.3 24.6 15.8 24.6 16.4 C 24.6 17 24.1 17.5 23.5 17.5 Z"
       fill="#ffffff" />
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

// If color is provided, use it instead of default green
const fillColor = computed(() => props.color || '#09B83E')
</script>
