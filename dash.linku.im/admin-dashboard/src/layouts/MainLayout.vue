<template>
  <!-- Loading state در حین بررسی authentication -->
  <div v-if="isCheckingAuth && !isAuthRoute" class="min-h-screen bg-gray-50 dark:bg-slate-900 flex items-center justify-center">
    <div class="text-center">
      <div class="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
      <p class="text-gray-600 dark:text-gray-400">در حال بررسی احراز هویت...</p>
    </div>
  </div>

  <!-- Main layout - فقط بعد از احراز هویت نمایش داده می‌شود -->
  <div v-else class="min-h-screen bg-gray-50 dark:bg-slate-900 flex flex-col">
    <!-- Header -->
    <Header v-if="!isAuthRoute" @toggle-sidebar="toggleSidebar" />

    <!-- Mobile overlay -->
    <div
      v-if="isMobileMenuOpen && isMobile"
      class="fixed inset-0 bg-black bg-opacity-50 z-50 lg:hidden"
      @click="toggleSidebar"
    ></div>

    <!-- Sidebar -->
    <Sidebar v-if="!isAuthRoute"
      :isMobile="isMobile"
      :isCollapsed="!isMobile ? isDesktopSidebarCollapsed : !isMobileMenuOpen"
      @closeSidebar="toggleSidebar"
    />

    <!-- Main Content -->
    <main
      :class="[
        'flex-1 transition-all duration-300',
        // If auth route, no padding/margin
        isAuthRoute ? '' : 'pt-16',
        // Desktop spacing based on sidebar state
        !isMobile && !isDesktopSidebarCollapsed && !isAuthRoute ? 'mr-60' : '',
        !isMobile && isDesktopSidebarCollapsed && !isAuthRoute ? 'mr-20' : '',
        // Mobile - no margin adjustment needed as sidebar is overlay
        isMobile ? 'mr-0' : '',
        // Ensure proper height
        isAuthRoute ? 'h-screen' : 'h-[calc(100vh-4rem)]'
      ]"
    >
      <div class="w-full h-full overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent dark:scrollbar-thumb-slate-600">
        <router-view />
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import {ref, provide, onMounted, onUnmounted, computed, watch} from 'vue'
import Header from '@/components/Header/index.vue'
import Sidebar from '@/components/Sidebar/index.vue'
import {useRoute} from "vue-router"
import {useAuthStore} from "@/stores/auth"

defineOptions({
  name: 'MainLayout'
})

const authStore = useAuthStore()
const isDesktopSidebarCollapsed = ref(false)
const isMobileMenuOpen = ref(false)
const isMobile = ref(false)
const isCheckingAuth = ref(false)

// Check if device is mobile
const checkMobile = () => {
  isMobile.value = window.innerWidth < 1024 // lg breakpoint
  if (isMobile.value) {
    isMobileMenuOpen.value = false // Auto close mobile menu on resize
  }
}

const route = useRoute()
const isAuthRoute = computed(() => route.name === 'login')

// وقتی route تغییر می‌کند، بررسی کن که آیا در حال بررسی authentication هستیم
watch(() => route.name, (newRoute) => {
  if (newRoute !== 'login' && !authStore.isVerified) {
    isCheckingAuth.value = true
    // بررسی می‌شود که router guard این کار را انجام می‌دهد
  } else {
    isCheckingAuth.value = false
  }
}, { immediate: true })

const toggleSidebar = () => {
  if (isMobile.value) {
    isMobileMenuOpen.value = !isMobileMenuOpen.value
  } else {
    isDesktopSidebarCollapsed.value = !isDesktopSidebarCollapsed.value
  }
}

provide('isCollapsed', isDesktopSidebarCollapsed)
provide('isMobile', isMobile)

onMounted(() => {
  checkMobile()
  window.addEventListener('resize', checkMobile)
})

onUnmounted(() => {
  window.removeEventListener('resize', checkMobile)
})
</script>


