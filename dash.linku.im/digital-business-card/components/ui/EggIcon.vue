<template>
  <div class="egg-container" :class="{ 'animate-shake': isShaking }">
    <svg :viewBox="viewBoxStr" v-bind="$attrs" class="egg-svg">
      <!-- Normal Egg - مرحله اول: سالم -->
      <g v-show="props.variant === 'normal'" class="egg-variant egg-normal">
        <defs>
          <clipPath :id="`egg-clip-normal-${uniqueId}`">
            <path d="M26.5,70c0,30.2,22.9,54.6,51.1,54.6s51.1-24.4,51.1-54.6S105.9,0,77.7,0,26.5,39.8,26.5,70Z" fill="none"/>
          </clipPath>
          <radialGradient :id="`egg-bg-normal-${uniqueId}`" cx="108.2" cy="27.9" r="100.1" gradientUnits="userSpaceOnUse">
            <stop offset="0" stop-color="#fff"/>
            <stop offset=".2" stop-color="#f6f6f7"/>
            <stop offset=".6" stop-color="#e1dfe2"/>
            <stop offset="1" stop-color="#c2bfc5"/>
          </radialGradient>
        </defs>
        <g opacity=".6">
          <rect width="156" height="92" x="0" y="81.3" fill="#e0e0e0" opacity="0.3"/>
        </g>
        <g :clip-path="`url(#egg-clip-normal-${uniqueId})`">
          <g>
            <path d="M26.5,70c0,30.2,22.9,54.6,51.1,54.6s51.1-24.4,51.1-54.6S105.9,0,77.7,0,26.5,39.8,26.5,70Z" :fill="`url(#egg-bg-normal-${uniqueId})`"/>
            <path d="M96.1,5.3s3.6,4.7-11.3-.7c0,0-5.1-1.4-10.7,.1,0,0-16.8,5.5-13.8-.3l-3.5,2.2s-1.9,5.3,10.2,2.2c0,0,6-2.5,12.2-2.6s12.8,2.5,12.8,2.5c0,0,14.5,3.8,4.1-3.6Z" :fill="iconColor"/>
            <path d="M34.6,33.8s-2,12.1,33.9,.2c0,0,13.3-2.4,22.9,.9,0,0,26.5,10.3,28.7-.9l2.1,4s1.1,8.8-18.8,4.7c0,0-22-11.4-52.9,.2,0,0-17.6,4-18.1-4.7l2.1-4.4Z" :fill="iconColor"/>
            <path d="M25.5,71.1s1.5,9.4,29.6,.9c0,0,17.2-5.2,38.7,.4,21.5,5.5,28.6,2.2,28.6,2.2,0,0,3.3-.9,6.6-4.7v4.7s-10.4,9.9-34.1,2.5-43,0-43,0c0,0-23.1,7.6-26.4-1.8v-4Z" :fill="iconColor"/>
            <path d="M33.8,101.1s5,5,24.1-1.4c0,0,12.6-3.1,27.9,.3c0,0,26.8,7.6,36.6-1.1,9.8-8.7-.4,0-.4,0l-1.3,3.2s-15.4,8.2-35.6,.8c0,0-16.5-2.7-29.6,.8s-20.3,.5-20.3,.5l-1.4-3.2Z" :fill="iconColor"/>
            <path d="M56.4,121.7s5.9,3,7.9,1.1,16.9-.4,16.9-.4c0,0,10.4,2.7,20.6-1.4,0,0-17.2,1.3-20.5,0s-12.6-.8-15.7-.3-1.1,.2-1.7,.4c-1.5,.5-5.2,1.4-7.6-.2v.9Z" :fill="iconColor"/>
            <path d="M26.5,70c0,30.2,22.9,54.6,51.1,54.6s51.1-24.4,51.1-54.6S105.9,0,77.7,0,26.5,39.8,26.5,70Z" fill="none"/>
          </g>
        </g>
      </g>
      
      <!-- Cracked Egg - مرحله دوم: یکم شکسته -->
      <g v-show="props.variant === 'cracked'" class="egg-variant egg-cracked">
        <defs>
          <clipPath :id="`egg-clip-cracked-${uniqueId}`">
            <path d="M27.4,70c0,30.2,22.9,54.6,51.1,54.6s51.1-24.4,51.1-54.6S106.8,0,78.6,0,27.4,39.8,27.4,70Z" fill="none"/>
          </clipPath>
          <radialGradient :id="`egg-bg-cracked-${uniqueId}`" cx="109.1" cy="27.9" r="100.1" gradientUnits="userSpaceOnUse">
            <stop offset="0" stop-color="#fff"/>
            <stop offset=".2" stop-color="#f6f6f7"/>
            <stop offset=".6" stop-color="#e1dfe2"/>
            <stop offset="1" stop-color="#c2bfc5"/>
          </radialGradient>
        </defs>
        <g opacity=".6">
          <rect width="156" height="92" x="0" y="78.3" fill="#e0e0e0" opacity="0.3"/>
        </g>
        <g :clip-path="`url(#egg-clip-cracked-${uniqueId})`">
          <g>
            <g>
              <path d="M27.4,70c0,30.2,22.9,54.6,51.1,54.6s51.1-24.4,51.1-54.6S106.8,0,78.6,0,27.4,39.8,27.4,70Z" :fill="`url(#egg-bg-cracked-${uniqueId})`"/>
              <path d="M96.9,5.3s3.6,4.7-11.3-.7c0,0-5.1-1.4-10.7,.1,0,0-16.8,5.5-13.8-.3l-3.5,2.2s-1.9,5.3,10.2,2.2c0,0,6-2.5,12.2-2.6s12.8,2.5,12.8,2.5c0,0,14.5,3.8,4.1-3.6Z" :fill="iconColor"/>
              <path d="M35.5,33.8s-2,12.1,33.9,.2c0,0,13.3-2.4,22.9,.9,0,0,26.5,10.3,28.7-.9l2.1,4s1.1,8.8-18.8,4.7c0,0-22-11.4-52.9,.2,0,0-17.6,4-18.1-4.7l2.1-4.4Z" :fill="iconColor"/>
              <path d="M26.3,71.1s1.5,9.4,29.6,.9c0,0,17.2-5.2,38.7,.4,21.5,5.5,28.6,2.2,28.6,2.2,0,0,3.3-.9,6.6-4.7v4.7s-10.4,9.9-34.1,2.5c-23.7-7.4-43,0-43,0c0,0-23.1,7.6-26.4-1.8v-4Z" :fill="iconColor"/>
              <path d="M34.7,101.1s5,5,24.1-1.4c0,0,12.6-3.1,27.9,.3c0,0,26.8,7.6,36.6-1.1,9.8-8.7-.4,0-.4,0l-1.3,3.2s-15.4,8.2-35.6,.8c0,0-16.5-2.7-29.6,.8s-20.3,.5-20.3,.5l-1.4-3.2Z" :fill="iconColor"/>
              <path d="M57.3,121.7s5.9,3,7.9,1.1,16.9-.4,16.9-.4c0,0,10.4,2.7,20.6-1.4,0,0-17.2,1.3-20.5,0s-12.6-.8-15.7-.3-1.1,.2-1.7,.4c-1.5,.5-5.2,1.4-7.6-.2v.9Z" :fill="iconColor"/>
              <path d="M27.4,70c0,30.2,22.9,54.6,51.1,54.6s51.1-24.4,51.1-54.6S106.8,0,78.6,0,27.4,39.8,27.4,70Z" fill="none"/>
            </g>
            <path d="M27.4,70c0,30.2,22.9,54.6,51.1,54.6s51.1-24.4,51.1-54.6S106.8,0,78.6,0,27.4,39.8,27.4,70Z" fill="none"/>
            <!-- خطوط ترک اولیه -->
            <polygon points="102.1 9.3 104.3 11.1 100 25.5 102.5 46.1 98.2 59.5 99.6 71.2 98.2 75.2 98.9 71 97.4 58.9 101 46.4 99.3 24.7 102.1 9.3" :fill="crackColor"/>
            <polygon points="26.9 58 38 56.9 52 65.2 60.7 63.1 52.2 66.8 38.8 58.7 26.7 61.1 26.9 58" :fill="crackColor"/>
          </g>
        </g>
      </g>
      
      <!-- Final Egg - مرحله سوم: کاملاً شکسته -->
      <g v-show="props.variant === 'final'" class="egg-variant egg-final">
        <defs>
          <clipPath :id="`egg-clip-final-${uniqueId}`">
            <path d="M27.9,70c0,30.2,22.9,54.6,51.1,54.6s51.1-24.4,51.1-54.6S107.3,0,79.1,0,27.9,39.8,27.9,70Z" fill="none"/>
          </clipPath>
          <radialGradient :id="`egg-bg-final-${uniqueId}`" cx="109.7" cy="28.1" r="100.1" gradientUnits="userSpaceOnUse">
            <stop offset="0" stop-color="#fff"/>
            <stop offset=".2" stop-color="#f6f6f7"/>
            <stop offset=".6" stop-color="#e1dfe2"/>
            <stop offset="1" stop-color="#c2bfc5"/>
          </radialGradient>
        </defs>
        <g opacity=".6">
          <rect width="156" height="91" x="0" y="77.7" fill="#e0e0e0" opacity="0.3"/>
        </g>
        <g :clip-path="`url(#egg-clip-final-${uniqueId})`">
          <g opacity=".6">
            <rect width="156" height="92" x="1" y="78.7" fill="#e0e0e0" opacity="0.3"/>
          </g>
          <path d="M28.1,70.2c0,30.2,22.9,54.6,51.1,54.6s51.1-24.4,51.1-54.6S107.4,.2,79.2,.2,28.1,40,28.1,70.2Z" :fill="`url(#egg-bg-final-${uniqueId})`"/>
          <path d="M97.6,5.5s3.6,4.7-11.3-.7c0,0-5.1-1.4-10.7,.1,0,0-16.8,5.5-13.8-.3l-3.5,2.2s-1.9,5.3,10.2,2.2c0,0,6-2.5,12.2-2.6s12.8,2.5,12.8,2.5c0,0,14.5,3.8,4.1-3.6Z" :fill="iconColor"/>
          <path d="M36.1,34s-2,12.1,33.9,.2c0,0,13.3-2.4,22.9,.9,0,0,26.5,10.3,28.7-.9l2.1,4s1.1,8.8-18.8,4.7c0,0-22-11.4-52.9,.2,0,0-17.6,4-18.1-4.7l2.1-4.4Z" :fill="iconColor"/>
          <path d="M27,71.3s1.5,9.4,29.6,.9c0,0,17.2-5.2,38.7,.4,21.5,5.5,28.6,2.2,28.6,2.2,0,0,3.3-.9,6.6-4.7v4.7s-10.4,9.9-34.1,2.5c-23.7-7.4-43,0-43,0c0,0-23.1,7.6-26.4-1.8v-4Z" :fill="iconColor"/>
          <path d="M35.3,101.3s5,5,24.1-1.4c0,0,12.6-3.1,27.9,.3c0,0,26.8,7.6,36.6-1.1,9.8-8.7-.4,0-.4,0l-1.3,3.2s-15.4,8.2-35.6,.8c0,0-16.5-2.7-29.6,.8-13.1,3.5-20.3,.5-20.3,.5l-1.4-3.2Z" :fill="iconColor"/>
          <path d="M57.9,121.9s5.9,3,7.9,1.1,16.9-.4,16.9-.4c0,0,10.4,2.7,20.6-1.4,0,0-17.2,1.3-20.5,0s-12.6-.8-15.7-.3-1.1,.2-1.7,.4c-1.5,.5-5.2,1.4-7.6-.2v.9Z" :fill="iconColor"/>
          <path d="M28.1,70.2c0,30.2,22.9,54.6,51.1,54.6s51.1-24.4,51.1-54.6S107.4,.2,79.2,.2,28.1,40,28.1,70.2Z" fill="none"/>
          <path d="M28.1,70.2c0,30.2,22.9,54.6,51.1,54.6s51.1-24.4,51.1-54.6S107.4,.2,79.2,.2,28.1,40,28.1,70.2Z" fill="none"/>
          <!-- تمام خطوط ترک - مرحله نهایی -->
          <polygon points="103 9.5 105.6 11.7 100.5 28.8 103.4 53.4 98.3 69.5 99.9 83.5 98.3 88.3 99.1 83.2 97.3 68.8 101.6 53.9 99.6 27.9 103 9.5" :fill="crackColor"/>
          <polygon points="27.5 57.6 39.8 56.3 55.2 65.4 64.9 63.1 55.5 67.2 40.7 58.4 27.3 61 27.5 57.6" :fill="crackColor"/>
          <path d="M28.1,70.2c0,30.2,22.9,54.6,51.1,54.6s51.1-24.4,51.1-54.6S107.4,.2,79.2,.2,28.1,40,28.1,70.2Z" fill="none"/>
          <polygon points="55.5 8.8 60.9 14.7 61.8 24.6 70.8 30.7 73.7 39.2 69.2 32.2 59.8 25 58.9 16.6 53.2 9.9 55.5 8.8" :fill="crackColor"/>
          <polygon points="28.3 96.1 33.8 93.5 40.5 96 46.1 92.2 52.7 92.1 63.4 86.5 70.9 86.4 76.3 82.4 71.5 87.2 64 87.2 53.5 93 46.6 93.1 41.1 97.1 34.1 94.8 28 97.5 27.6 96.3 28.3 96.1" :fill="crackColor"/>
          <polygon points="60 123.5 69.2 121.5 72.4 117.9 80.4 114.8 83.4 112.1 81 115.7 73.1 118.7 69.6 122.7 60.4 124.4 60 123.5" :fill="crackColor"/>
          <polygon points="114.1 112.6 108.9 109.8 108.6 106.5 105.5 105.1 105 103 99.6 101.4 105.5 101.9 106.8 104.4 109.4 105.7 110.1 108.5 113.9 110.9 114.1 112.6" :fill="crackColor"/>
        </g>
      </g>
    </svg>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'

const props = defineProps({
  variant: {
    type: String,
    default: 'normal',
    validator: value => ['normal', 'cracked', 'final'].includes(value)
  },
  size: {
    type: [String, Number],
    default: 150
  },
  iconColor: {
    type: String,
    default: '#8b5cf6'
  },
  crackColor: {
    type: String,
    default: '#4a4a4a'
  },
  shake: {
    type: Boolean,
    default: false
  }
})

const uniqueId = ref('')
const isShaking = computed(() => props.shake)

// دقیقاً همان viewBox که تو SVG ها داری - کاهش فضای خالی
const viewBoxStr = computed(() => {
  switch (props.variant) {
    case 'normal':
      return '20 0 120 125'
    case 'cracked':
      return '20 0 120 125'
    case 'final':
      return '20 0 125 125'
    default:
      return '20 0 120 125'
  }
})

onMounted(() => {
  // منحصر به فرد برای هر instance
  uniqueId.value = `egg-${Math.random().toString(36).substr(2, 9)}`
})
</script>

<style scoped>
.egg-container {
  width: 100%;
  height: auto;
  display: block;
  position: relative;
  transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

.egg-svg {
  width: 100%;
  height: auto;
  display: block;
  cursor: pointer;
  transition: transform 0.2s ease;
}

.egg-svg:hover {
  transform: scale(1.02);
}

.egg-svg:active {
  transform: scale(0.98);
}

.animate-shake {
  animation: shake 0.4s ease-in-out;
}

.egg-variant {
  transition: opacity 0.2s ease;
}

@keyframes shake {
  0%, 100% { transform: translateX(0); }
  10%, 30%, 50%, 70%, 90% { transform: translateX(-2px); }
  20%, 40%, 60%, 80% { transform: translateX(2px); }
}
</style>
