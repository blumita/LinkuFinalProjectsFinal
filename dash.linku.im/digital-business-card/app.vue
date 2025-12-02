<template>
  <div dir="rtl">
    <!-- محتوای اصلی -->
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'

onMounted(() => {
  // Force RTL
  document.documentElement.dir = 'rtl'
  document.documentElement.lang = 'fa'
  
  // Prevent ALL zoom on mobile
  let lastTouchEnd = 0
  
  // Prevent pinch zoom
  document.addEventListener('touchmove', (e) => {
    if (e.touches && e.touches.length > 1) {
      e.preventDefault()
    }
  }, { passive: false })
  
  // Prevent double tap zoom
  document.addEventListener('touchend', (e) => {
    const now = Date.now()
    if (now - lastTouchEnd <= 300) {
      e.preventDefault()
    }
    lastTouchEnd = now
  }, { passive: false })
  
  // Prevent gesture zoom (Safari)
  document.addEventListener('gesturestart', (e) => {
    e.preventDefault()
  }, { passive: false })
  
  document.addEventListener('gesturechange', (e) => {
    e.preventDefault()
  }, { passive: false })
  
  document.addEventListener('gestureend', (e) => {
    e.preventDefault()
  }, { passive: false })
  
  // Prevent keyboard zoom (Ctrl/Cmd + +/-)
  document.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && (e.key === '+' || e.key === '-' || e.key === '=' || e.key === '0')) {
      e.preventDefault()
    }
  })
  
  // Prevent wheel zoom (Ctrl + scroll)
  document.addEventListener('wheel', (e) => {
    if (e.ctrlKey) {
      e.preventDefault()
    }
  }, { passive: false })
})
</script>

<style>
/* Force RTL */
html {
  direction: rtl !important;
}

/* Prevent zoom on input focus */
input, textarea, select {
  font-size: 16px !important;
}

@media screen and (max-width: 768px) {
  input, textarea, select {
    font-size: 16px !important;
  }
}

/* Prevent text selection during drag */
.no-select {
  user-select: none;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
}
</style>
