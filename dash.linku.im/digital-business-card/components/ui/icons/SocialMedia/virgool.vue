<template>
  <svg 
    :width="size" 
    :height="size" 
    viewBox="0 0 300 300" 
    xmlns="http://www.w3.org/2000/svg"
  >
    <!-- Background with rounded corners -->
    <path 
      :fill="props.color || '#000000'" 
      d="M300 255c0 24.854-20.147 45-45 45H45c-24.854 0-45-20.146-45-45V45C0 20.147 20.147 0 45 0h210c24.853 0 45 20.147 45 45v210z"
    />
    
    <!-- Virgool logo (scaled and centered) -->
    <g transform="translate(75, 75) scale(12.5)">
      <path 
        :fill="textColor"
        d="M11.214 0A9.646 9.646 0 0 0 8.97.522C5.462 1.787 3.438 4.448 3.167 8.234c-.261 3.647 1.388 6.36 4.45 8.236.777.48 1.683.742 2.564 1.109-.811 1.134-1.666 2.311-2.53 3.524 1.431.977 2.818 1.929 4.232 2.897.13-.166.21-.27.288-.375 1.378-1.902 2.783-3.795 4.144-5.715 1.186-1.684 2.39-3.367 3.473-5.121 1.073-1.736 1.265-3.69.907-5.68-.549-3.06-2.968-5.926-6.281-6.85-.688 1.163-1.679 2.853-1.99 3.366.505.171 1.027.28 1.478.51 1.79.914 2.817 2.362 2.827 4.403.013 2.123-1.007 3.7-2.907 4.548-3.21 1.442-6.176-.664-6.822-3.173-.286-1.092-.263-2.197.271-3.209.53-1.023 1.129-2.007 1.724-3.003z"
      />
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

// Component name
defineOptions({
  name: 'VirGoolIcon'
})
</script>