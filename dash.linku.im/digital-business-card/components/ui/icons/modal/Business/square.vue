<template>
  <svg
   id="uuid-7562dc2c-bc5b-4b10-9b24-ed558f2eeee1"
   viewBox="0 0 219.13001 219.13"
   version="1.1"
   :width="size"
   :height="size"
   xmlns="http://www.w3.org/2000/svg"
   xmlns:svg="http://www.w3.org/2000/svg">
  <defs
     id="defs15" />
  <rect
     x="0"
     y="0"
     width="219.13"
     height="219.13"
     rx="63.405998"
     ry="63.405998"
     :fill="props.color ? props.color : '#ffffff'"
     id="rect2" />
  <g
     id="g10"
     transform="translate(-27.524,-22.231001)">
    <path
       d="m 137.07,205.336 c -16.338,0 -32.676,0 -49.014,0 -13.448,0 -24.426,-10.707 -24.456,-24.14 -0.073,-32.87 -0.071,-65.741 0,-98.611 0.029,-13.371 10.79,-24.225 24.177,-24.264 33.122,-0.099 66.245,-0.079 99.367,-0.002 11.04,0.026 21.333,9.114 23.114,19.994 0.259,1.583 0.375,3.157 0.375,4.753 -0.005,32.551 0,65.102 -0.006,97.654 -0.003,12.586 -9.025,22.888 -21.482,24.537 -0.88,0.116 -1.784,0.077 -2.677,0.077 -16.466,0.004 -32.931,0.003 -49.397,0.003 z"
       :fill="props.color ? textColor : '#010101'"
       id="path4" />
    <path
       d="m 137.172,180.824 c -13.337,0 -26.673,10e-4 -40.01,0 -5.66,0 -9.067,-3.313 -9.073,-9.009 -0.027,-26.612 -0.024,-53.224 -0.002,-79.835 0.005,-5.757 3.383,-9.181 9.166,-9.189 26.546,-0.035 53.092,-0.031 79.637,-0.003 5.91,0.006 9.227,3.409 9.227,9.279 0.003,26.548 0.003,53.096 0,79.644 0,5.837 -3.29,9.114 -9.126,9.114 -13.273,0 -26.546,0 -39.819,0 z"
       :fill="props.color ? (isWhiteColor(props.color) ? '#000000' : '#ffffff') : '#ffffff'"
       id="path6" />
    <path
       d="m 137.074,156.311 c -6.638,0 -13.275,0.003 -19.913,-0.001 -2.883,-0.002 -4.563,-1.59 -4.566,-4.405 -0.015,-13.34 -0.015,-26.681 -0.002,-40.021 0.003,-2.815 1.7,-4.58 4.476,-4.585 13.403,-0.022 26.806,-0.022 40.209,0.004 2.692,0.005 4.325,1.751 4.326,4.487 0.007,13.34 0.006,26.681 10e-4,40.021 -10e-4,2.898 -1.576,4.495 -4.427,4.498 -6.702,0.006 -13.403,0.002 -20.105,0.002 z"
       :fill="props.color ? props.color : '#010101'"
       id="path8" />
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
</script>