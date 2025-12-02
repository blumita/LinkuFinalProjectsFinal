<template>
  <div class="fixed top-0 left-0 right-0 w-full z-50 bg-card/95 backdrop-blur-lg border-b border-border">
    <div class="flex items-center justify-between px-4 py-3">
      <!-- Left Side - Back Button (if has back) or Profile Selector -->
      <div v-if="showBackButton" class="flex items-center gap-3">
        <button
          @click="goBack"
          class="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-foreground hover:bg-primary/10 hover:text-primary transition-all duration-200"
        >
          <i class="ti ti-arrow-right text-xl"></i>
        </button>
        <h1 v-if="pageTitle" class="text-lg font-semibold text-foreground">{{ pageTitle }}</h1>
      </div>
      
      <!-- Profile Selector (when no back button) -->
      <ClientOnly>
        <button
          v-if="!showBackButton"
          @click="showProfileSelector = true"
          class="flex items-center gap-2 transition-all duration-200 hover:bg-muted rounded-lg px-2 py-1"
        >
          <span class="text-lg font-semibold text-foreground">پروفایل‌ها</span>
          <i class="ti ti-chevron-down text-muted-foreground text-sm"></i>
        </button>
      </ClientOnly>
      
      <!-- Right Side - Action Icons -->
      <ClientOnly>
        <div class="flex items-center gap-2">
          <!-- Settings (Desktop) -->
          <button
            v-if="!showBackButton && isDesktop"
            @click="navigateTo('/settings')"
            class="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-foreground hover:bg-primary/10 hover:text-primary transition-all duration-200"
          >
            <i class="ti ti-settings text-xl"></i>
          </button>

          <!-- Inbox - فقط در داشبورد نمایش داده شود -->
          <button
            v-if="isDashboardPage"
            @click="navigateTo('/inbox')"
            class="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-foreground hover:bg-primary/10 hover:text-primary transition-all duration-200 relative"
          >
            <i class="ti ti-inbox text-xl"></i>
            <div v-if="inboxBadge > 0" class="absolute -top-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-card"></div>
          </button>

          <!-- Notifications - فقط در داشبورد نمایش داده شود -->
          <button
            v-if="isDashboardPage"
            @click="navigateTo('/dashboard/notifications')"
            class="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-foreground hover:bg-primary/10 hover:text-primary transition-all duration-200 relative"
          >
            <i class="ti ti-bell text-xl"></i>
            <div v-if="hasNotifications" class="absolute -top-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-card"></div>
          </button>

          <!-- Support -->
          <button
            @click="showSupportSheet = true"
            class="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-foreground hover:bg-primary/10 hover:text-primary transition-all duration-200"
          >
            <i class="ti ti-headset text-xl"></i>
          </button>
        </div>
      </ClientOnly>
    </div>

    <!-- Profile Selector Bottom Sheet -->
    <BottomSheet
      v-model="showProfileSelector"
      :closable="true"
      :close-on-backdrop="true"
      title="انتخاب پروفایل"
    >
      <div class="px-4 pb-6 pt-2">
        <p class="text-sm text-primary opacity-60 text-center mb-4">پروفایل مورد نظر خود را انتخاب کنید</p>
        
        <!-- Profiles List -->
        <div class="space-y-2">
          <div 
            v-for="profile in availableProfiles" 
            :key="profile.id"
            @click="selectProfile(profile)"
            class="flex items-center gap-3 p-3 rounded-2xl border cursor-pointer transition-colors"
            :class="profile.id === activeCard?.id ? 'bg-primary/5 border-primary' : 'bg-secondary border-border hover:bg-accent-bg/30'"
          >
            <!-- Avatar -->
            <div class="relative w-11 h-11 rounded-full overflow-hidden ring-2 ring-border bg-white">
              <img 
                :src="profile.avatar || '/logo.svg'" 
                :alt="profile.name"
                class="w-full h-full object-cover"
              />
            </div>

            <!-- Info -->
            <div class="flex-1">
              <div class="flex items-center justify-between mb-0.5">
                <div class="flex items-center gap-1.5">
                  <h3 class="text-sm font-semibold text-primary">
                    {{ userName }}
                  </h3>
                  <!-- تیک آبی فقط برای کاربر Pro -->
                  <i 
                    v-if="isPro"
                    class="ti ti-rosette-discount-check-filled text-primary text-lg"
                  />
                </div>
                <span 
                  v-if="profile.id === activeCard?.id"
                  class="text-xs bg-secondary text-primary border border-border px-2 py-0.5 rounded-full font-medium flex items-center gap-1"
                >
                  <i class="ti ti-check text-xs"></i>
                  پیش‌فرض
                </span>
              </div>
              
              <!-- Additional Info -->
              <div class="flex flex-wrap items-center gap-1.5 text-xs text-foreground">
                <span v-if="userUserName" class="font-medium">
                  @{{ userUserName }}
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- Add New Profile Button -->
        <div class="mt-3 pt-3">
          <div class="w-full flex items-center justify-between gap-2 p-3 rounded-2xl bg-secondary border-2 border-dashed border-border hover:bg-accent-bg/30 transition-colors">
            <div 
              @click="addNewProfile"
              class="flex items-center gap-2 flex-1 cursor-pointer"
            >
              <div class="w-11 h-11 rounded-full bg-accent-bg ring-2 ring-border flex items-center justify-center">
                <i class="ti ti-plus text-primary text-sm"></i>
              </div>
              <span class="text-sm font-medium text-primary">
                ایجاد پروفایل جدید
              </span>
            </div>
            <div 
              v-if="!isPro"
              @click="handlePremiumClick"
              class="bg-black dark:bg-white text-white dark:text-black px-3 py-1 rounded-full text-xs font-semibold cursor-pointer hover:opacity-90 transition-opacity"
            >
              خرید اشتراک
            </div>
            <div 
              v-else
              class="bg-black dark:bg-white text-white dark:text-black px-3 py-1 rounded-full text-xs font-semibold"
            >
              کاربر ویژه
            </div>
          </div>
        </div>
      </div>
    </BottomSheet>

    <!-- Support Bottom Sheet -->
    <BottomSheet
      v-model="showSupportSheet"
      :closable="true"
      :close-on-backdrop="true"
      title="پشتیبانی"
    >
      <div class="px-4 pb-6 pt-2">
        <!-- Support Options -->
        <div class="space-y-3">
          <!-- Online Support -->
          <button
            @click="handleOnlineSupport"
            class="w-full flex items-center gap-4 p-4 rounded-2xl border border-border bg-card hover:bg-accent transition-colors group"
          >
            <div class="w-12 h-12 rounded-xl bg-green-500/10 flex items-center justify-center flex-shrink-0 group-hover:bg-green-500/20 transition-colors">
              <i class="ti ti-message-circle text-green-500 text-2xl"></i>
            </div>
            <div class="flex-1 text-right">
              <h3 class="text-sm font-semibold text-foreground mb-0.5">پشتیبانی آنلاین</h3>
              <p class="text-xs text-muted-foreground">گفتگو با تیم پشتیبانی</p>
            </div>
            <i class="ti ti-chevron-left text-muted-foreground"></i>
          </button>

          <!-- FAQ -->
          <button
            @click="handleFAQ"
            class="w-full flex items-center gap-4 p-4 rounded-2xl border border-border bg-card hover:bg-accent transition-colors group"
          >
            <div class="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center flex-shrink-0 group-hover:bg-blue-500/20 transition-colors">
              <i class="ti ti-help text-blue-500 text-2xl"></i>
            </div>
            <div class="flex-1 text-right">
              <h3 class="text-sm font-semibold text-foreground mb-0.5">سوالات متداول</h3>
              <p class="text-xs text-muted-foreground">پاسخ سوالات پرتکرار</p>
            </div>
            <i class="ti ti-chevron-left text-muted-foreground"></i>
          </button>

          <!-- Ticket -->
          <button
            @click="handleTicket"
            class="w-full flex items-center gap-4 p-4 rounded-2xl border border-border bg-card hover:bg-accent transition-colors group"
          >
            <div class="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center flex-shrink-0 group-hover:bg-purple-500/20 transition-colors">
              <i class="ti ti-phone text-purple-500 text-2xl"></i>
            </div>
            <div class="flex-1 text-right">
              <h3 class="text-sm font-semibold text-foreground mb-0.5">تماس تلفنی</h3>
              <p class="text-xs text-muted-foreground">تماس با پشتیبانی</p>
            </div>
            <i class="ti ti-chevron-left text-muted-foreground"></i>
          </button>
        </div>

        <!-- Contact Info -->
        <div class="mt-6 p-4 rounded-2xl bg-muted/50 border border-border">
          <p class="text-xs text-muted-foreground text-center mb-2">
            <i class="ti ti-clock text-sm ml-1"></i>
            پاسخگویی: شنبه تا چهارشنبه، ۹ صبح تا ۶ عصر
          </p>
          <p class="text-xs text-muted-foreground text-center">
            <i class="ti ti-mail text-sm ml-1"></i>
            support@linku.im
          </p>
        </div>
      </div>
    </BottomSheet>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import BottomSheet from '~/components/ui/BottomSheet.vue'
import { useUserStore } from '~/stores/user.js'
import { useFormStore } from '~/stores/form.js'

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()
const formStore = useFormStore()
const showProfileSelector = ref(false)
const showSupportSheet = ref(false)

// Page titles mapping
const pageTitles = {
  '/profile': 'پروفایل',
  '/settings': 'تنظیمات',
  '/settings/account-status': 'وضعیت حساب',
  '/dashboard/transactions': 'تراکنش‌ها',
  '/dashboard/support': 'پشتیبانی',
  '/dashboard/activate': 'فعال‌سازی دستگاه',
  '/dashboard/checkout': 'خرید اشتراک',
  '/dashboard/notifications': 'اعلان‌ها',
  '/dashboard/inbox': 'صندوق ورودی',
}

// Detect if page should show back button
const showBackButton = computed(() => {
  const path = route.path
  return path !== '/dashboard' && path !== '/dashboard/dashboard'
})

// Detect if current page is dashboard (main page)
const isDashboardPage = computed(() => {
  const path = route.path
  return path === '/dashboard' || path === '/dashboard/dashboard' || path === '/'
})

// Get page title
const pageTitle = computed(() => {
  return pageTitles[route.path] || ''
})

// Detect desktop
const isDesktop = computed(() => {
  if (typeof window === 'undefined') return false
  return window.innerWidth >= 1024
})

// User data
const userName = computed(() => userStore.user?.name || 'کاربر')
const userUserName = computed(() => userStore.user?.userName || userStore.user?.username || '')
const isPro = computed(() => userStore.user?.isPro || false)
const inboxBadge = computed(() => formStore.inboxBadge || 0)
const hasNotifications = ref(true)

// Active card and profiles
const activeCard = computed(() => formStore.defaultCard || formStore.cards?.[0] || null)
const availableProfiles = computed(() => {
  const cards = formStore.cards || []
  if (!isPro.value) return cards.slice(0, 1)
  return cards.filter(card => card.isActive !== false)
})

// Go back
const goBack = () => {
  // اگر در صفحه ادیت کارت هستیم، مستقیم به داشبورد برو
  if (route.path.includes('/dashboard/edit-card')) {
    navigateTo('/dashboard')
  } else {
    router.back()
  }
}

// Select profile
const selectProfile = (profile) => {
  formStore.setDefaultCard(profile.id)
  showProfileSelector.value = false
}

// Add new profile
const addNewProfile = () => {
  showProfileSelector.value = false
  
  if (!isPro.value && availableProfiles.value.length >= 1) {
    navigateTo('/dashboard/checkout')
    return
  }
  
  if (isPro.value && availableProfiles.value.length >= 5) {
    return
  }
  
  navigateTo('/dashboard/add-card')
}

// Handle premium click
const handlePremiumClick = () => {
  showProfileSelector.value = false
  navigateTo('/dashboard/checkout')
}

// Support handlers
const handleOnlineSupport = () => {
  showSupportSheet.value = false
  navigateTo('/dashboard/support/online')
}

const handleFAQ = () => {
  showSupportSheet.value = false
  navigateTo('/dashboard/support/faq')
}

const handleTicket = () => {
  showSupportSheet.value = false
  navigateTo('/dashboard/support/ticket')
}
</script>
