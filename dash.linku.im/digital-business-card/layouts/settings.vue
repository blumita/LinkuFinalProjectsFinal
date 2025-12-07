<script setup lang="ts">
import {ref, computed, onMounted, onUnmounted} from 'vue'
import {useRoute, useRouter} from 'vue-router'
import {useUserStore} from "~/stores/user"
import {useAuthStore} from "~/stores/auth"
import {useFormStore} from "~/stores/form"
import {navigateTo} from "#app"
import {useSafeNavigation} from '~/composables/useSafeNavigation'

const userStore = useUserStore()
const authStore = useAuthStore()
const formStore = useFormStore()
const route = useRoute()
const router = useRouter()
const { goBack } = useSafeNavigation()

// تشخیص دسکتاپ یا موبایل
const isDesktop = ref(false)

const checkScreenSize = () => {
  isDesktop.value = window.innerWidth >= 1024
}

// بارگذاری اطلاعات کاربر
onMounted(async () => {
  checkScreenSize()
  window.addEventListener('resize', checkScreenSize)
  
  authStore.hydrateToken()
  if (authStore.isAuthenticated) {
    await userStore.fetchUser()
    formStore.cards = userStore.cards
  } else {
    navigateTo('/auth/login')
  }
})

onUnmounted(() => {
  window.removeEventListener('resize', checkScreenSize)
})

// تنظیمات هدر بر اساس مسیر
const getPageTitle = (path: string) => {
  if (path === '/settings') return 'تنظیمات'
  if (path === '/settings/account-status') return 'وضعیت حساب'
  return 'تنظیمات'
}

const pageTitle = computed(() => getPageTitle(route.path))
</script>

<template>
  <!-- ✅ حالت موبایل - Layout ساده -->
  <div v-if="!isDesktop" class="flex flex-col min-h-screen bg-primary">
    <!-- Header ساده برای موبایل -->
    <header class="sticky top-0 z-30 bg-primary border-b border-border">
      <div class="flex items-center justify-between px-4 h-16">
        <!-- دکمه بازگشت -->
        <button 
          @click="goBack"
          class="w-10 h-10 flex items-center justify-center rounded-full hover:bg-secondary transition-colors"
        >
          <i class="ti ti-arrow-right text-2xl text-primary"></i>
        </button>

        <!-- عنوان صفحه -->
        <h1 class="text-lg font-bold text-primary">{{ pageTitle }}</h1>

        <!-- فضای خالی برای تعادل -->
        <div class="w-10"></div>
      </div>
    </header>

    <!-- محتوای اصلی موبایل -->
    <main class="flex-1 overflow-y-auto">
      <div class="max-w-2xl mx-auto p-4">
        <NuxtPage />
      </div>
    </main>
  </div>

  <!-- ✅ حالت دسکتاپ - Layout بدون Sidebar -->
  <div v-else class="flex bg-background min-h-screen overflow-hidden transition-colors duration-300">
    <!-- Main Content -->
    <div class="flex-1 flex flex-col relative">
      <!-- Header دسکتاپ -->
      <header class="sticky top-0 z-30 bg-primary border-b border-border">
        <div class="flex items-center justify-between px-6 h-20">
          <!-- دکمه بازگشت -->
          <button 
            @click="goBack"
            class="flex items-center gap-2 text-primary hover:text-accent transition-colors"
          >
            <i class="ti ti-arrow-right text-xl"></i>
            <span class="text-sm font-medium">بازگشت</span>
          </button>

          <!-- عنوان صفحه -->
          <h1 class="text-xl font-bold text-primary">{{ pageTitle }}</h1>

          <!-- اطلاعات کاربر -->
          <div class="flex items-center gap-3">
            <div class="text-left rtl:text-right">
              <p class="text-sm font-medium text-primary">{{ userStore.user?.phone }}</p>
              <p class="text-xs text-primary opacity-60">{{ userStore.isUserPro ? 'کاربر حرفه‌ای' : 'کاربر عادی' }}</p>
            </div>
            <div class="w-10 h-10 rounded-full bg-primary flex items-center justify-center overflow-hidden">
              <img 
                v-if="userStore.user?.avatar" 
                :src="userStore.user.avatar" 
                alt="User" 
                class="w-full h-full object-cover"
              />
              <i v-else class="ti ti-user text-xl text-primary"></i>
            </div>
          </div>
        </div>
      </header>

      <!-- محتوای اصلی دسکتاپ -->
      <main class="flex-1 overflow-y-auto p-6">
        <div class="max-w-4xl mx-auto">
          <NuxtPage />
        </div>
      </main>
    </div>
  </div>
</template>

<style scoped>
/* اسکرول اصلی */
main {
  -webkit-overflow-scrolling: touch;
}
</style>
