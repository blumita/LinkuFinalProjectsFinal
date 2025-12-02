<template>
  <div class="min-h-screen bg-background">
    <!-- Header -->
    <header 
      v-if="pageTitle || showBackButton"
      class="fixed top-0 left-0 right-0 z-40 bg-background/95 backdrop-blur-sm border-b border-border"
    >
      <div class="flex items-center justify-between px-4 h-16">
        <!-- Back Button -->
        <button 
          v-if="showBackButton"
          @click="goBack"
          class="p-2 -ml-2 text-foreground hover:bg-muted rounded-lg transition-colors"
        >
          <i class="ti ti-arrow-right text-xl"></i>
        </button>
        <div v-else class="w-10"></div>
        
        <!-- Title -->
        <h1 class="text-lg font-semibold text-foreground">{{ pageTitle }}</h1>
        
        <!-- Right Slot -->
        <div class="w-10">
          <slot name="header-right" />
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main>
      <slot />
    </main>

    <!-- Bottom Navigation -->
    <nav 
      v-if="showBottomNav"
      class="fixed bottom-0 left-0 right-0 z-40 bg-background/95 backdrop-blur-sm border-t border-border"
    >
      <div class="flex items-center justify-around h-16">
        <NuxtLink 
          v-for="item in navItems" 
          :key="item.to"
          :to="item.to"
          class="flex flex-col items-center justify-center p-2 text-muted-foreground hover:text-primary transition-colors"
          active-class="text-primary"
        >
          <i :class="[item.icon, 'text-xl']"></i>
          <span class="text-xs mt-1">{{ item.label }}</span>
        </NuxtLink>
      </div>
    </nav>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'

// Props
defineProps({
  pageTitle: {
    type: String,
    default: ''
  },
  showBackButton: {
    type: Boolean,
    default: false
  },
  showBottomNav: {
    type: Boolean,
    default: true
  }
})

const router = useRouter()

// Navigation items
const navItems = [
  { icon: 'ti ti-home', label: 'خانه', to: '/' },
  { icon: 'ti ti-user', label: 'پروفایل', to: '/profile' },
  { icon: 'ti ti-gift', label: 'جوایز', to: '/rewards' },
  { icon: 'ti ti-settings', label: 'تنظیمات', to: '/settings' }
]

// Methods
const goBack = () => {
  router.back()
}
</script>

<style scoped>
/* Backdrop blur support */
@supports (backdrop-filter: blur(10px)) {
  .backdrop-blur-sm {
    backdrop-filter: blur(8px);
  }
}

@supports not (backdrop-filter: blur(10px)) {
  .backdrop-blur-sm {
    background: var(--background);
  }
}
</style>
