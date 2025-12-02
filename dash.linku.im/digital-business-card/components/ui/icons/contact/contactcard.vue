<template>
  <svg :width="size" :height="size" viewBox="0 0 498 497" xmlns="http://www.w3.org/2000/svg">
    <defs/>
    <g style="isolation:isolate">
      <path :fill="tabColor1" d="M379 475V362h95s11 105-95 113Z"/>
      <path :fill="tabColor2" d="M380 242h93v120h-93z"/>
      <path :fill="tabColor3" d="M380 121h93v121h-93z"/>
      <path :fill="tabColor4" d="M380 8v113h95S486 16 380 8Z"/>
      <path :fill="props.color ? props.color : '#c7b299'" d="M380.49 475h-278c-52 0-94.51-42.53-94.51-94.51v-278c0-52 42.53-94.51 94.51-94.51h278Z"/>
      <circle cx="215" cy="250" r="122" fill="none" :stroke="personStrokeColor" stroke-miterlimit="10" stroke-width="19"/>
      <path d="M118.5 324.5s18-34 96-34 91.92 40.28 91.92 40.28S220.5 433.5 118.5 324.5Z" :fill="personBgColor" :stroke="personStrokeColor" stroke-width="2"/>
      <circle cx="215" cy="233" r="50" :fill="personBgColor" :stroke="personStrokeColor" stroke-width="2"/>
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

// تعیین رنگ متن بر اساس رنگ پس‌زمینه (دقیقاً مثل WhatsApp)
const textColor = computed(() => {
  if (!props.color) return '#ffffff' // رنگ پیش‌فرض سفید
  return isWhiteColor(props.color) ? '#000000' : '#ffffff'
})

// رنگ پس‌زمینه شخص (دقیقاً مثل WhatsApp)
const personBgColor = computed(() => {
  return textColor.value // همان رنگ textColor
})

// رنگ حاشیه شخص (دقیقاً مثل WhatsApp)
const personStrokeColor = computed(() => {
  if (!props.color) return '#D0D0D0' // Default stroke color
  return isWhiteColor(props.color) ? '#000000' : '#ffffff'
})

const tabColor1 = computed(() => {
  if (!props.color) return '#39b54a' // Default green
  // استفاده از رنگ اصلی با opacity متفاوت برای تب اول
  return props.color + '80' // 50% opacity
})

const tabColor2 = computed(() => {
  if (!props.color) return '#f7931e' // Default orange
  // استفاده از رنگ اصلی با opacity متفاوت برای تب دوم
  return props.color + 'B3' // 70% opacity
})

const tabColor3 = computed(() => {
  if (!props.color) return '#29abe2' // Default blue
  // استفاده از رنگ اصلی با opacity متفاوت برای تب سوم
  return props.color + 'CC' // 80% opacity
})

const tabColor4 = computed(() => {
  if (!props.color) return '#ffdab4' // Default light orange
  // استفاده از رنگ اصلی با opacity متفاوت برای تب چهارم
  return props.color + '66' // 40% opacity
})
</script>