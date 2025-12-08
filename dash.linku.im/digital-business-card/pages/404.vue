<template>
  <div class="min-h-screen flex items-center justify-center bg-background px-4 transition-colors duration-300">
    <div class="max-w-2xl w-full text-center">
      <!-- Animated 404 Icon -->
      <div class="relative mb-8">
        <div class="flex items-center justify-center gap-4">
          <div class="text-[120px] md:text-[160px] font-black text-foreground leading-none animate-bounce-slow">
            4
          </div>
          <div class="relative">
            <div class="w-24 h-24 md:w-32 md:h-32 rounded-full border-4 border-border bg-card flex items-center justify-center animate-spin-slow">
              <i class="ti ti-search text-4xl md:text-5xl text-foreground"></i>
            </div>
            <div class="absolute -top-2 -right-2 w-8 h-8 bg-red-500 rounded-full flex items-center justify-center animate-ping">
              <i class="ti ti-x text-white text-sm"></i>
            </div>
          </div>
          <div class="text-[120px] md:text-[160px] font-black text-foreground leading-none animate-bounce-slow animation-delay-200">
            4
          </div>
        </div>
      </div>

      <!-- Error Message -->
      <div class="mb-8 space-y-3">
        <h1 class="text-3xl md:text-4xl font-bold text-foreground">
          صفحه مورد نظر یافت نشد!
        </h1>
        <p class="text-base md:text-lg text-muted-foreground max-w-md mx-auto">
          متأسفانه صفحه‌ای که به دنبال آن هستید وجود ندارد یا ممکن است منتقل شده باشد.
        </p>
      </div>

      <!-- Action Buttons -->
      <div class="flex flex-col sm:flex-row items-center justify-center gap-4">
        <NuxtLink 
          to="/" 
          class="group w-full sm:w-auto px-8 py-4 bg-primary text-primary-foreground rounded-lg font-semibold text-center
                 transition-all duration-300 hover:opacity-90 hover:-translate-y-0.5 shadow-lg
                 flex items-center justify-center gap-2"
        >
          <i class="ti ti-home text-xl"></i>
          <span>بازگشت به صفحه اصلی</span>
        </NuxtLink>
        
        <button 
          @click="goBack"
          class="group w-full sm:w-auto px-8 py-4 bg-card text-foreground border-2 border-border rounded-lg font-semibold
                 transition-all duration-300 hover:bg-accent hover:border-accent
                 flex items-center justify-center gap-2"
        >
          <i class="ti ti-arrow-right text-xl"></i>
          <span>بازگشت به صفحه قبل</span>
        </button>
      </div>

      <!-- Decorative Elements -->
      <div class="mt-12 flex items-center justify-center gap-8 opacity-40">
        <div class="w-16 h-1 bg-border rounded-full"></div>
        <i class="ti ti-ghost text-3xl text-foreground"></i>
        <div class="w-16 h-1 bg-border rounded-full"></div>
      </div>

      <!-- Helper Links -->
      <div class="mt-8 flex items-center justify-center gap-6 text-sm">
        <NuxtLink to="/dashboard" class="text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1">
          <i class="ti ti-layout-dashboard text-lg"></i>
          <span>داشبورد</span>
        </NuxtLink>
        <NuxtLink to="/dashboard/support" class="text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1">
          <i class="ti ti-help text-lg"></i>
          <span>پشتیبانی</span>
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useSafeNavigation } from '~/composables/useSafeNavigation'

const { goBack } = useSafeNavigation()


// Set page title
useHead({
  title: '404 - صفحه یافت نشد',
  meta: [
    { name: 'robots', content: 'noindex, nofollow' }
  ]
})
</script>

<style scoped>
@keyframes bounce-slow {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-20px);
  }
}

@keyframes spin-slow {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.animate-bounce-slow {
  animation: bounce-slow 2s ease-in-out infinite;
}

.animation-delay-200 {
  animation-delay: 0.2s;
}

.animate-spin-slow {
  animation: spin-slow 3s linear infinite;
}

@keyframes ping {
  0% {
    transform: scale(1);
    opacity: 1;
  }
  75%, 100% {
    transform: scale(2);
    opacity: 0;
  }
}

.animate-ping {
  animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;
}
</style>
