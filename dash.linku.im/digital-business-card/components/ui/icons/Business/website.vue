<template>
  <svg 
    :width="size" 
    :height="size" 
    viewBox="0 0 100 100" 
    xmlns="http://www.w3.org/2000/svg">
    <!-- پس‌زمینه -->
    <rect 
      x="0" 
      y="0" 
      width="100" 
      height="100" 
      rx="25" 
      ry="25" 
      :fill="props.color ? props.color : '#3ec2f1'" />
    
    <!-- آیکون کره زمین -->
    <circle 
      cx="50" 
      cy="50" 
      r="28" 
      fill="none" 
      :stroke="props.color ? textColor : '#ffffff'" 
      stroke-width="3" />
    
    <!-- خطوط عمودی -->
    <ellipse 
      cx="50" 
      cy="50" 
      rx="12" 
      ry="28" 
      fill="none" 
      :stroke="props.color ? textColor : '#ffffff'" 
      stroke-width="2" />
    
    <!-- خطوط افقی -->
    <line 
      x1="22" 
      y1="35" 
      x2="78" 
      y2="35" 
      :stroke="props.color ? textColor : '#ffffff'" 
      stroke-width="2" />
    <line 
      x1="22" 
      y1="50" 
      x2="78" 
      y2="50" 
      :stroke="props.color ? textColor : '#ffffff'" 
      stroke-width="2" />
    <line 
      x1="22" 
      y1="65" 
      x2="78" 
      y2="65" 
      :stroke="props.color ? textColor : '#ffffff'" 
      stroke-width="2" />
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
