<template>
  <div dir="rtl">
    <!-- بررسی authentication قبل از نمایش محتوا -->
    <div v-if="!authChecked" class="h-screen w-screen bg-background flex items-center justify-center">
      <div class="flex flex-col items-center gap-4">
        <div class="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    </div>
    
    <!-- محتوای اصلی -->
    <div v-else>
      <NuxtLayout>
        <NuxtPage />
      </NuxtLayout>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '~/stores/auth'

const router = useRouter()
const authStore = useAuthStore()
const authChecked = ref(false)

onMounted(() => {
  // Hydrate token once at app start
  if (!authStore.token) {
    authStore.hydrateToken()
  }
  
  // چک فوری authentication
  const currentPath = window.location.pathname.toLowerCase()
  const publicPaths = ['/auth', '/login', '/register', '/forgot-password', '/reset-password', '/', '/card', '/c/']
  const isPublicPath = publicPaths.some(p => currentPath === p || currentPath.startsWith(p))
  
  if (!isPublicPath) {
    // صفحه محافظت شده - چک token از authStore
    if (!authStore.isAuthenticated) {
      // هیچ token ای نیست - پاک کن و برو لاگین
      localStorage.clear()
      document.cookie.split(";").forEach(c => {
        document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/")
      })
      window.location.replace('/auth/login')
      return
    }
  }
  
  // Auth OK - نمایش محتوا
  authChecked.value = true
  
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
