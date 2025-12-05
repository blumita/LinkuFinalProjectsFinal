<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-slate-900 px-4">
    <div class="text-center">
      <!-- آیکون خطا -->
      <div class="w-24 h-24 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
        <i class="ti ti-alert-triangle text-red-600 dark:text-red-400 text-5xl"></i>
      </div>
      
      <!-- کد خطا -->
      <h1 class="text-8xl font-bold text-gray-200 dark:text-gray-700 mb-4">404</h1>
      
      <!-- عنوان -->
      <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-3">
        آدرس ورود به مدیریت درست وارد نشده است
      </h2>
      
      <!-- توضیحات -->
      <p class="text-gray-500 dark:text-gray-400 mb-8 max-w-md mx-auto">
        صفحه‌ای که به دنبال آن هستید وجود ندارد یا آدرس آن تغییر کرده است.
        لطفاً آدرس را بررسی کنید یا به صفحه اصلی بازگردید.
      </p>
      
      <!-- دکمه‌ها -->
      <div class="flex flex-col sm:flex-row gap-4 justify-center">
        <router-link 
          to="/" 
          class="inline-flex items-center justify-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition-colors shadow-lg shadow-blue-600/20"
        >
          <i class="ti ti-home ml-2"></i>
          صفحه اصلی
        </router-link>
        
        <router-link 
          to="/auth/login" 
          class="inline-flex items-center justify-center px-6 py-3 bg-gray-100 dark:bg-slate-800 hover:bg-gray-200 dark:hover:bg-slate-700 text-gray-700 dark:text-gray-300 rounded-xl font-medium transition-colors border border-gray-200 dark:border-slate-700"
        >
          <i class="ti ti-login ml-2"></i>
          صفحه ورود
        </router-link>
      </div>
      
      <!-- آدرس فعلی -->
      <div class="mt-8 p-4 bg-gray-100 dark:bg-slate-800 rounded-xl max-w-md mx-auto">
        <p class="text-sm text-gray-500 dark:text-gray-400 mb-1">آدرس درخواستی:</p>
        <code class="text-sm text-red-600 dark:text-red-400 font-mono break-all" dir="ltr">
          {{ currentPath }}
        </code>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'

defineOptions({
  name: 'NotFoundView'
})

const route = useRoute()

const currentPath = computed(() => {
  return window.location.pathname
})
</script>
