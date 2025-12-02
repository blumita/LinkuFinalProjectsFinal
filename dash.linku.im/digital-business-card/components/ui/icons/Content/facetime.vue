<template>
  <svg :width="size" :height="size" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M17 10.5V7a1 1 0 0 0-1-1H4a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-3.5l4 2v-3l-4 2z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
</svg>
</template>

<script setup lang="ts">
interface Props {
  size?: number | string
  filled?: boolean
}

withDefaults(defineProps<Props>(), {
  size: 24,
  filled: false
})
</script>