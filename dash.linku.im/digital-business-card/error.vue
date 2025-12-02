<template>
  <div class="min-h-screen flex items-center justify-center bg-background px-4">
    <div class="max-w-md w-full text-center">
      <!-- Error Code -->
      <div class="mb-6">
        <h1 class="text-9xl font-black text-primary">{{ errorCode }}</h1>
      </div>

      <!-- Error Message -->
      <div class="mb-8 space-y-2">
        <h2 class="text-2xl font-bold text-foreground">{{ errorTitle }}</h2>
        <p class="text-sm text-muted-foreground">{{ errorMessage }}</p>
      </div>

      <!-- Action Buttons -->
      <div class="flex flex-col gap-3">
        <NuxtLink 
          to="/" 
          class="px-6 py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:opacity-90 transition-opacity"
        >
          بازگشت به صفحه اصلی
        </NuxtLink>
        
        <button 
          @click="handleError"
          class="px-6 py-3 bg-card border border-border text-foreground rounded-lg font-semibold hover:bg-accent transition-colors"
        >
          تلاش مجدد
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps({
  error: {
    type: Object,
    required: true
  }
})

const errorCode = computed(() => {
  return props.error.statusCode?.toString() || '500'
})

const errorTitle = computed(() => {
  const code = props.error.statusCode
  if (code === 404) return 'صفحه یافت نشد'
  if (code === 403) return 'دسترسی غیرمجاز'
  if (code === 500) return 'خطای سرور'
  return 'خطایی رخ داد'
})

const errorMessage = computed(() => {
  const code = props.error.statusCode
  if (code === 404) return 'صفحه مورد نظر یافت نشد'
  if (code === 403) return 'شما اجازه دسترسی به این صفحه را ندارید'
  if (code === 500) return 'مشکلی در سرور رخ داده است'
  return props.error.message || 'خطای غیرمنتظره‌ای رخ داده است'
})

const handleError = () => {
  clearError({ redirect: '/' })
}

useHead({
  title: computed(() => `${errorCode.value} - ${errorTitle.value}`),
  meta: [
    { name: 'robots', content: 'noindex, nofollow' }
  ]
})
</script>
