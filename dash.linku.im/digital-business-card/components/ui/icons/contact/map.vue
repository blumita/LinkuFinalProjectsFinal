<template>
  <svg 
    :width="size" 
    :height="size" 
    viewBox="0 0 80 80" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
  >
    <!-- Background -->
    <path 
      d="M18.0952 0H61.9048C71.9048 0 80 8.09524 80 18.0952V61.9048C80 71.9048 71.9048 80 61.9048 80H18.0952C8.09524 80 0 71.9048 0 61.9048V18.0952C0 8.09524 8.09524 0 18.0952 0Z" 
      :fill="props.color || 'transparent'"
      :style="{ display: props.color ? 'block' : 'none' }"
    />
    
    <!-- Map icon parts -->
    <path 
      d="M45.9175 11.1029C43.9403 10.4792 41.8219 10.1379 39.6328 10.1379C33.2421 10.1379 27.5223 13.0213 23.6973 17.5642L33.5246 25.8262L45.9175 11.1029Z" 
      :fill="props.color ? textColor : '#1A73E8'"
    />
    <path 
      d="M23.6967 17.5638C20.546 21.306 18.8201 26.0418 18.8242 30.9337C18.8242 34.841 19.601 38.0187 20.8838 40.8551L33.524 25.8258L23.6967 17.5638Z" 
      :fill="props.color ? textColor : '#EA4335'"
    />
    <path 
      d="M39.6316 22.9899C41.1487 22.9913 42.6339 23.4262 43.9121 24.2434C45.1903 25.0605 46.2085 26.2259 46.8466 27.6023C47.4847 28.9787 47.7162 30.5088 47.5139 32.0123C47.3116 33.5159 46.6838 34.9303 45.7045 36.0891L58.0858 21.3658C55.5444 16.4695 51.1631 12.7824 45.9046 11.1148L33.5352 25.8381C34.2805 24.9455 35.2129 24.2277 36.2664 23.7355C37.3199 23.2434 38.4688 22.9888 39.6316 22.9899Z" 
      :fill="props.color ? textColor : '#4285F4'"
    />
    <path 
      d="M39.6312 38.9013C35.2413 38.9013 31.6752 35.3352 31.6752 30.9453C31.67 29.0761 32.3291 27.2659 33.5347 25.8375L20.8828 40.8668C23.0483 45.6568 26.638 49.5054 30.3335 54.3543L45.7041 36.0885C44.9573 36.9708 44.0271 37.6796 42.9782 38.1654C41.9293 38.6512 40.7871 38.9024 39.6312 38.9013Z" 
      :fill="props.color ? textColor : '#FBBC04'"
    />
    <path 
      d="M45.3985 59.3333C52.3424 48.4821 60.4278 43.5508 60.4278 30.9342C60.4278 27.4741 59.5804 24.214 58.0857 21.3423L30.3457 54.355C31.5226 55.8967 32.7113 57.5326 33.8647 59.3451C38.0781 65.8652 36.9129 69.7726 39.6316 69.7726C42.3503 69.7726 41.1852 65.8535 45.3985 59.3333Z" 
      :fill="props.color ? textColor : '#34A853'"
    />
    
    <!-- Gradient Definition -->
    <defs>
      <linearGradient id="paint0_linear" x1="40" y1="0" x2="40" y2="80" gradientUnits="userSpaceOnUse">
        <stop stop-color="#FF6B6B"/>
        <stop offset="1" stop-color="#FF8E8E"/>
      </linearGradient>
    </defs>
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
  name: 'MapIcon'
})
</script>
