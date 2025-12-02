<template>
  <svg :width="size" :height="size" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <!-- Virgool Persian comma icon -->
    <path d="M12 2C13.5 2 14.9 2.5 16.1 3.4C17.5 4.5 18.4 6 18.7 7.7C19.2 10 18.5 12.1 16.9 13.9C15.9 15 14.6 15.8 13.1 16.3C12.7 16.4 12.3 16.5 11.8 16.6C12 17 12.2 17.4 12.4 17.7C11.6 18.3 10.8 18.9 10 19.4C9.5 18.7 9.1 18.1 8.6 17.4C8.1 16.6 7.5 15.9 7 15.1C6.5 14.5 6.1 13.8 5.8 13C5.3 12 5.2 10.9 5.4 9.8C5.7 8 6.9 6.6 8.7 5.9C9.4 5.7 10.1 5.5 10.9 5.5C11.1 5.5 11.3 5.5 11.6 5.5C11.4 6 11.2 6.4 11 6.9C10.8 6.8 10.7 6.8 10.5 6.8C9.3 6.7 8.2 7.5 7.9 8.7C7.5 10.1 8 11.4 9.2 12C10.5 12.7 12 12.3 12.8 11C13.4 10 13.3 8.6 12.5 7.7C12.1 7.3 11.6 7 11 6.9C11.2 6.4 11.4 6 11.6 5.5V2H12Z"
          :fill="props.color || 'currentColor'"/>
  </svg>
</template>

<script setup lang="ts">
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
</script>