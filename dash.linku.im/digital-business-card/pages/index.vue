<template>
  <div class="h-screen flex items-center justify-center">
    <div class="text-center">
      <i class="ti ti-loader-2 animate-spin text-4xl text-primary mb-2"></i>
      <p class="text-muted-foreground">در حال بارگذاری...</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '~/stores/auth'
import { onMounted } from 'vue'
import { navigateTo } from '#app'

const auth = useAuthStore()

onMounted(async () => {
  // ابتدا توکن رو از localStorage بارگذاری کن
  auth.hydrateToken()
  
  // حالا بررسی کن که کاربر لاگین هست یا نه
  if (!auth.isAuthenticated) {
    await navigateTo('/auth/login')
  } else {
    await navigateTo('/dashboard')
  }
})

</script>