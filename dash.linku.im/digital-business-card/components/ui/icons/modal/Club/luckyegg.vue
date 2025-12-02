<template>
  <svg
   id="uuid-3780c607-8b03-4558-8b16-8e6ac26bbe98"
   viewBox="0 0 139.15491 172.86075"
   version="1.1"
   :width="size"
   :height="size"
   xmlns="http://www.w3.org/2000/svg"
   xmlns:svg="http://www.w3.org/2000/svg">
  <defs
     id="defs14">
    <radialGradient
       id="uuid-8d95afd8-97d7-4f82-8811-861d03eff376"
       cx="69.5"
       cy="35"
       fx="69.5"
       fy="35"
       r="60"
       gradientUnits="userSpaceOnUse">
      <stop
         offset="0"
         :stop-color="eggGradientColors.stop1"
         id="stop5" />
      <stop
         offset=".3"
         :stop-color="eggGradientColors.stop2"
         id="stop7" />
      <stop
         offset=".7"
         :stop-color="eggGradientColors.stop3"
         id="stop9" />
      <stop
         offset="1"
         :stop-color="eggGradientColors.stop4"
         id="stop11" />
    </radialGradient>
  </defs>
  <g
     id="g36"
     transform="matrix(1.3615941,0,0,1.3873255,-36.082244,0)">
    <g
       id="g34">
      <g
         id="g375">
        <path
           d="m 26.5,70 c 0,30.2 22.9,54.6 51.1,54.6 28.2,0 51.1,-24.4 51.1,-54.6 C 128.7,39.8 105.9,0 77.7,0 49.5,0 26.5,39.8 26.5,70 Z"
           fill="url(#uuid-8d95afd8-97d7-4f82-8811-861d03eff376)"
           id="path20"
            />
        <path
           d="m 96.1,5.3 c 0,0 3.6,4.7 -11.3,-0.7 0,0 -5.1,-1.4 -10.7,0.1 0,0 -16.8,5.5 -13.8,-0.3 l -3.5,2.2 c 0,0 -1.9,5.3 10.2,2.2 0,0 6,-2.5 12.2,-2.6 6.2,-0.1 12.8,2.5 12.8,2.5 0,0 14.5,3.8 4.1,-3.6 z"
           :fill="textColor"
           id="path22" />
        <path
           d="m 34.6,33.8 c 0,0 -2,12.1 33.9,0.2 0,0 13.3,-2.4 22.9,0.9 0,0 26.5,10.3 28.7,-0.9 l 2.1,4 c 0,0 1.1,8.8 -18.8,4.7 0,0 -22,-11.4 -52.9,0.2 0,0 -17.6,4 -18.1,-4.7 l 2.1,-4.4 z"
           :fill="textColor"
           id="path24" />
        <path
           d="m 25.5,71.1 c 0,0 1.5,9.4 29.6,0.9 0,0 17.2,-5.2 38.7,0.4 21.5,5.5 28.6,2.2 28.6,2.2 0,0 3.3,-0.9 6.6,-4.7 v 4.7 c 0,0 -10.4,9.9 -34.1,2.5 -23.7,-7.4 -43,0 -43,0 0,0 -23.1,7.6 -26.4,-1.8 v -4 z"
           :fill="textColor"
           id="path26" />
        <path
           d="m 33.8,101.1 c 0,0 5,5 24.1,-1.4 0,0 12.6,-3.1 27.9,0.3 0,0 26.8,7.6 36.6,-1.1 9.8,-8.7 -0.4,0 -0.4,0 l -1.3,3.2 c 0,0 -15.4,8.2 -35.6,0.8 0,0 -16.5,-2.7 -29.6,0.8 -13.1,3.5 -20.3,0.5 -20.3,0.5 L 33.8,101 Z"
           :fill="textColor"
           id="path28" />
        <path
           d="m 56.4,121.7 c 0,0 5.9,3 7.9,1.1 2,-1.9 16.9,-0.4 16.9,-0.4 0,0 10.4,2.7 20.6,-1.4 0,0 -17.2,1.3 -20.5,0 -3.3,-1.3 -12.6,-0.8 -15.7,-0.3 -3.1,0.5 -1.1,0.2 -1.7,0.4 -1.5,0.5 -5.2,1.4 -7.6,-0.2 v 0.9 z"
           :fill="textColor"
           id="path30" />
        <path
           d="m 26.5,70 c 0,30.2 22.9,54.6 51.1,54.6 28.2,0 51.1,-24.4 51.1,-54.6 C 128.7,39.8 105.9,0 77.7,0 49.5,0 26.5,39.8 26.5,70 Z"
           fill="none"
           stroke="#000"
           stroke-width="0.5"
           stroke-opacity="0.2"
           id="path32" />
      </g>
    </g>
  </g>
</svg>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useIconColorSystem } from '~/composables/useIconColorSystem'

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

const { primaryColor, isColorPickerActive } = useIconColorSystem()

// تابع برای تشخیص رنگ سفید
const isWhiteColor = (color: string): boolean => {
  if (!color || color === "transparent") return false
  
  // حذف # از ابتدای رنگ hex
  const hex = color.replace("#", "").toLowerCase()
  
  // بررسی اینکه رنگ سفید باشد
  return hex === "ffffff" || hex === "fff" || color.toLowerCase() === "white"
}

// تابع برای تشخیص رنگ مشکی
const isBlackColor = (color: string): boolean => {
  if (!color || color === "transparent") return false
  
  // حذف # از ابتدای رنگ hex
  const hex = color.replace("#", "").toLowerCase()
  
  // بررسی اینکه رنگ مشکی باشد
  return hex === "000000" || hex === "000" || color.toLowerCase() === "black"
}

// تعیین رنگ متن بر اساس رنگ پس‌زمینه
const textColor = computed(() => {
  // اگر color picker فعال است، از primaryColor استفاده کن
  if (isColorPickerActive.value) {
    return primaryColor.value
  }
  
  // در غیر این صورت از props.color استفاده کن
  if (!props.color) return '#000000' // رنگ پیش‌فرض مشکی
  
  // اگر پس‌زمینه مشکی است، کرش‌ها باید مشکی باشند
  if (isBlackColor(props.color)) {
    return '#000000'
  }
  
  return isWhiteColor(props.color) ? '#000000' : '#ffffff'
})

// رنگ گرادینت تخم مرغ
const eggGradientColors = computed(() => {
  // اگر color picker فعال است، گرادینت هماهنگ با آن
  if (isColorPickerActive.value) {
    const baseColor = primaryColor.value
    
    // اگر رنگ انتخابی مشکی است، از رنگ خاکستری روشن برای تخم مرغ استفاده کن
    if (isBlackColor(baseColor)) {
      return {
        stop1: '#f0f0f0',
        stop2: '#e8e8e8',
        stop3: '#d0d0d0',
        stop4: '#b8b8b8'
      }
    }
    
    // اگر رنگ انتخابی سفید است، از رنگ خاکستری تیره برای تخم مرغ استفاده کن
    if (isWhiteColor(baseColor)) {
      return {
        stop1: '#e0e0e0',
        stop2: '#d0d0d0',
        stop3: '#c0c0c0',
        stop4: '#a0a0a0'
      }
    }
    
    // برای رنگ‌های دیگر، از opacity استفاده کن
    return {
      stop1: baseColor + '40', // 25% opacity
      stop2: baseColor + '33', // 20% opacity  
      stop3: baseColor + '26', // 15% opacity
      stop4: baseColor + '1A'  // 10% opacity
    }
  }
  
  // در حالت عادی، رنگ طبیعی تخم مرغ
  if (!props.color) {
    return {
      stop1: '#fdfdfb',
      stop2: '#f9f9f5', 
      stop3: '#f0f0ea',
      stop4: '#e8e8e0'
    }
  }
  
  // اگر پس‌زمینه سفید است، گرادینت خاکستری برای تضاد
  if (isWhiteColor(props.color)) {
    return {
      stop1: '#f8f8f8',
      stop2: '#f0f0f0',
      stop3: '#e8e8e8', 
      stop4: '#d0d0d0'
    }
  }
  
  // اگر پس‌زمینه مشکی است، گرادینت روشن برای تضاد
  if (isBlackColor(props.color)) {
    return {
      stop1: '#f0f0f0',
      stop2: '#e8e8e8',
      stop3: '#d0d0d0',
      stop4: '#b8b8b8'
    }
  }
  
  // در غیر این صورت، رنگ طبیعی تخم مرغ
  return {
    stop1: '#fdfdfb',
    stop2: '#f9f9f5',
    stop3: '#f0f0ea',
    stop4: '#e8e8e0'
  }
})
</script>