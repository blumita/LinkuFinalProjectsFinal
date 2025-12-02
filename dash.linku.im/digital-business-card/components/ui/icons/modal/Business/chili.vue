<template>
  <svg
   id="uuid-23e9927b-c4e0-4c3c-99e0-a197b305c538"
   viewBox="0 0 219.13001 219.13"
   version="1.1"
   :width="size"
   :height="size"
   xmlns="http://www.w3.org/2000/svg"
   xmlns:svg="http://www.w3.org/2000/svg">
  <defs
     id="defs19" />
  <rect
     x="0"
     y="0"
     width="219.13"
     height="219.13"
     rx="63.405998"
     ry="63.405998"
     :fill="backgroundFill"
     id="rect2" />
  <g
     id="g14"
     transform="translate(-27.627001,-20.632999)">
    <path
       d="m 211.006,112.196 c -5.25,11.689 -11.095,23.035 -18.42,33.605 -1.88,2.713 -3.54,3.548 -6.899,2.815 -9.798,-2.14 -19.201,-5.242 -28.209,-9.645 -1.817,-0.888 -1.838,-1.55 -0.89,-3.193 5.219,-9.045 9.526,-18.528 13.201,-28.303 0.739,-1.966 0.968,-3.258 -1.834,-3.562 -2.778,-0.302 -6.26,-2.444 -8.021,-1.399 -1.699,1.008 -1.566,5.064 -2.286,7.769 -1.924,7.23 -4.293,14.31 -7.028,21.276 -0.848,2.16 -1.425,3.089 -3.907,1.378 -6.166,-4.249 -6.236,-4.084 -3.767,-11.163 2.839,-8.14 5.206,-16.417 6.588,-24.938 0.451,-2.782 1.482,-4.043 4.639,-3.859 19.174,1.117 36.982,6.455 53.312,16.632 1.128,0.703 2.076,1.776 3.521,1.904 v 0.684 z"
       :fill="primaryColor"
       id="path4" />
    <path
       d="m 63.378,209.283 c 6.316,-3.722 12.954,-6.872 19.067,-10.963 7.088,-4.744 13.916,-9.812 20.146,-15.641 1.289,-1.206 2.149,-1.42 3.703,-0.373 7.24,4.883 14.93,8.996 23.176,12.962 -6.406,3.184 -12.882,5.274 -19.407,7.162 -10.896,3.154 -21.987,5.37 -33.321,6.226 -0.471,0.036 -0.884,0.119 -1.062,0.627 z"
       :fill="primaryColor"
       id="path6" />
    <path
       d="m 127.446,170.239 c 7.118,-6.112 13.063,-13.288 18.507,-20.866 1.551,-2.16 2.681,-2.597 5.127,-1.348 8.714,4.45 17.966,7.444 27.803,9.497 -3.547,4.562 -7.75,8.34 -11.954,12.085 -7.397,6.589 -15.399,12.367 -23.949,17.388 -1.254,0.737 -2.235,1.011 -3.696,0.364 -8.727,-3.862 -17.085,-8.372 -25.1,-13.557 -1.746,-1.129 -1.658,-1.786 -0.39,-3.255 7.895,-9.147 14.71,-19.048 20.188,-29.834 0.743,-1.463 1.301,-1.63 2.766,-0.748 6.772,4.076 6.751,3.988 2.727,10.99 -3.742,6.509 -8.259,12.481 -12.57,18.599 -0.769,0.81 -1.539,1.621 -2.976,3.135 2.131,-0.755 2.82,-1.608 3.518,-2.449 z"
       :fill="primaryColor"
       id="path8" />
    <path
       d="m 194,51.113 c 3.821,10.738 4.348,21.253 0.005,31.709 -1.029,2.476 -1.079,3.95 1.447,5.418 1.617,0.94 2.85,2.584 4.158,4.002 1.037,1.124 0.628,2.423 -0.154,3.438 -0.792,1.027 -1.553,-0.085 -2.226,-0.413 -8.508,-4.149 -17.407,-7.109 -26.684,-8.964 -0.723,-0.145 -2.133,0.317 -1.597,-1.339 0.316,-0.976 0.116,-2.314 1.889,-2.249 2.496,0.091 5.041,-0.341 7.491,-0.007 2.601,0.355 3.987,-0.697 5.205,-2.743 2.973,-4.995 4.69,-10.474 4.733,-16.163 0.038,-5.066 1.67,-9.005 5.735,-12.69 z"
       :fill="primaryColor"
       id="path10" />
    <path
       d="m 127.446,170.239 c -0.698,0.841 -1.387,1.693 -3.518,2.449 1.437,-1.514 2.207,-2.325 2.976,-3.135 z"
       :fill="highlightColor"
       id="path12" />
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
  filled: false
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

// رنگ پس‌زمینه
const backgroundFill = computed(() => {
  return props.color || '#ff6b35' // رنگ پیش‌فرض نارنجی chili
})

// رنگ اصلی (برای فلفل)
const primaryColor = computed(() => {
  if (!props.color) {
    // حالت پیش‌فرض: فلفل سفید (مثل SMS و app_link)
    return '#ffffff'
  }
  
  // تشخیص رنگ سفید با روش‌های مختلف
  const colorLower = props.color.toLowerCase().trim()
  const isWhite = colorLower === '#ffffff' || 
                  colorLower === '#fff' || 
                  colorLower === 'white' || 
                  colorLower === 'rgb(255,255,255)' ||
                  colorLower === 'rgb(255, 255, 255)' ||
                  isWhiteColor(props.color)
  
  if (isWhite) {
    return '#f15b2d' // فلفل قرمز فقط برای پس‌زمینه سفید/روشن
  }
  
  // برای همه رنگ‌های دیگر، فلفل سفید باشد
  return '#ffffff'
})

// رنگ برجسته (برای نقطه روشن)
const highlightColor = computed(() => {
  if (!props.color) {
    // حالت پیش‌فرض: نقطه روشن کرم رنگ
    return '#f0f0f0'
  }
  
  // تشخیص رنگ سفید با روش‌های مختلف
  const colorLower = props.color.toLowerCase().trim()
  const isWhite = colorLower === '#ffffff' || 
                  colorLower === '#fff' || 
                  colorLower === 'white' || 
                  colorLower === 'rgb(255,255,255)' ||
                  colorLower === 'rgb(255, 255, 255)' ||
                  isWhiteColor(props.color)
  
  if (isWhite) {
    return '#ffebeb' // نقطه روشن صورتی برای پس‌زمینه سفید/روشن
  }
  
  // برای همه رنگ‌های دیگر، نقطه روشن خاکستری روشن
  return '#f0f0f0'
})

// تابع برای تنظیم روشنی رنگ
const adjustBrightness = (hex: string, amount: number): string => {
  // Remove # if present
  const color = hex.replace('#', '')
  
  // Parse r, g, b values
  const num = parseInt(color, 16)
  const r = Math.max(0, Math.min(255, (num >> 16) + amount))
  const g = Math.max(0, Math.min(255, (num >> 8 & 0x00FF) + amount))
  const b = Math.max(0, Math.min(255, (num & 0x0000FF) + amount))
  
  return `#${(r << 16 | g << 8 | b).toString(16).padStart(6, '0')}`
}
</script>