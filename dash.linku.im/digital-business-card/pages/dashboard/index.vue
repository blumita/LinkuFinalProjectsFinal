<template>
  <div class="h-full overflow-hidden" v-if="hasValidAuth">
    <!-- Mobile Preview Modal (Full Screen) -->
    <div 
      v-if="showPreviewMobile" 
      class="fixed inset-0 z-[9999] lg:hidden bg-white"
    >
      <!-- Header with back button -->
      <div class="sticky top-0 z-10 bg-white border-b border-border safe-area-top">
        <div class="flex items-center justify-between px-4 py-3">
          <button 
            @click="showPreviewMobile = false" 
            class="flex items-center gap-2 text-foreground"
          >
            <i class="ti ti-arrow-right text-xl"></i>
            <span class="font-medium">بازگشت</span>
          </button>
          <span class="text-sm text-muted-foreground">پیش‌نمایش</span>
          <div class="w-20"></div>
        </div>
      </div>
      
      <!-- Preview Content -->
      <div class="h-[calc(100vh-60px)] overflow-y-auto">
        <iframe 
          :src="`/${userUserName}`" 
          class="w-full h-full border-0"
          title="پیش‌نمایش پروفایل"
        ></iframe>
      </div>
    </div>

    <!-- Main Content - Mobile: fixed center, no scroll -->
    <div class="fixed inset-0 top-[60px] bottom-[80px] lg:relative lg:top-auto lg:bottom-auto lg:px-6 lg:py-8 lg:h-auto flex items-center justify-center overflow-hidden bg-background">
      <!-- Profile Cards Container -->
      <div class="w-full max-w-xs mx-auto px-4 lg:px-0">
          <!-- Loading State -->
          <div v-if="loading" class="text-center animate-pulse">
            <div class="bg-card rounded-[22px] overflow-hidden shadow-[0_10px_30px_-10px_rgba(0,0,0,0.25)] border border-border">
              <!-- Banner Skeleton -->
              <div class="h-28 bg-muted"></div>

              <!-- Content Skeleton -->
              <div class="relative px-4 pb-5 -mt-8">
                <!-- Avatar Skeleton -->
                <div class="relative w-fit mx-auto">
                  <div class="w-24 h-24 rounded-full bg-muted ring-4 ring-card shadow-md"></div>
                  <!-- Chain icon skeleton -->
                  <div class="absolute -right-2 bottom-1 h-6 w-6 rounded-full bg-muted shadow border border-border"></div>
                </div>

                <!-- Info Skeleton -->
                <div class="text-center mt-3 mb-4 space-y-2">
                  <div class="flex items-center justify-center gap-1">
                    <div class="h-5 w-32 bg-muted rounded"></div>
                    <div class="w-5 h-5 bg-muted rounded-full"></div>
                  </div>
                  <div class="h-3 w-24 bg-muted-foreground/20 rounded mx-auto"></div>
                </div>

                <!-- Actions Skeleton -->
                <div class="grid gap-2.5">
                  <div class="w-full h-14 rounded-2xl bg-muted"></div>
                  <div class="w-full h-14 rounded-2xl bg-muted"></div>
                </div>
              </div>
            </div>
          </div>

          <!-- Active Profile Display -->
          <div v-else-if="activeCard" class="text-center">
            <div class="bg-card rounded-[22px] overflow-hidden shadow-[0_10px_30px_-10px_rgba(0,0,0,0.25)] border border-border">
              <!-- Banner -->
              <div class="relative h-28 bg-muted">
                <img 
                  v-if="activeCard.cover" 
                  :src="activeCard.cover" 
                  alt="بنر پروفایل" 
                  class="absolute inset-0 w-full h-full object-cover"
                />
              </div>

              <!-- Content -->
              <div class="relative px-4 pb-5 -mt-8">
                <!-- Avatar + link icon -->
                <div class="relative w-fit mx-auto">
                  <div class="w-24 h-24 rounded-full overflow-hidden ring-4 ring-card shadow-md bg-background">
                    <img 
                      v-if="activeCard.avatar || userAvatar"
                      :src="activeCard.avatar || userAvatar" 
                      alt="پروفایل" 
                      class="w-full h-full object-cover"
                    />
                    <div 
                      v-else
                      class="w-full h-full flex items-center justify-center"
                      :style="{ backgroundColor: formStore.iconColor?.background || 'rgb(var(--color-primary))' }"
                    >
                      <i class="ti ti-user text-white text-5xl"></i>
                    </div>
                  </div>
                  
                  <!-- chain icon -->
                  <button 
                    @click="copyProfileLink"
                    class="absolute -right-2 bottom-1 h-6 w-6 rounded-full bg-secondary shadow grid place-items-center border border-border hover:bg-secondary/80 transition-colors" 
                    title="کپی لینک"
                  >
                    <i class="ti ti-link text-[14px] text-primary"></i>
                  </button>
                </div>

                <!-- Info -->
                <div class="text-center mt-3 mb-4">
                  <div class="flex items-center justify-center gap-1">
                    <h3 class="text-[15px] font-extrabold text-foreground">{{ activeCard.name && activeCard.name !== 'کارت پیش فرض' ? activeCard.name : userName }}</h3>
                    <i v-if="isPro" class="ti ti-rosette-discount-check-filled text-primary text-xl"></i>
                  </div>
                  <p class="text-[12px] text-muted-foreground mt-1">{{ activeCard.bio || 'پروفایل شما' }}</p>
                </div>

                <!-- Actions -->
                <div class="grid gap-2.5">
                  <button 
                    @click="showPreviewMobile = true"
                    class="w-full h-14 rounded-2xl bg-secondary text-[13px] font-semibold text-primary hover:bg-secondary/80 transition-colors border border-border"
                  >
                    پیش‌نمایش
                  </button>
                  <button 
                    @click="navigateTo(activeCard?.id ? `/dashboard/edit-card?id=${activeCard.id}&slug=${activeCard.slug || ''}` : '/dashboard/edit-card')"
                    class="w-full h-14 rounded-2xl bg-primary text-[13px] font-semibold text-primary-foreground hover:bg-primary/90 transition-colors"
                  >
                    ویرایش
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Empty State -->
          <div v-else class="text-center py-8">
            <i class="ti ti-user-circle text-6xl text-muted-foreground mb-4"></i>
            <h3 class="text-lg font-semibold text-foreground mb-2">پروفایلی یافت نشد</h3>
            <p class="text-sm text-muted-foreground mb-4">ابتدا یک پروفایل ایجاد کنید</p>
            <button
              @click="handleAddCardClick"
              class="px-6 py-3 bg-primary text-primary-foreground rounded-xl text-sm font-semibold hover:bg-primary/90 transition-colors"
            >
              ایجاد پروفایل جدید
            </button>
          </div>
      </div>

      <!-- Toast for copy -->
      <div 
        v-if="copied"
        class="fixed bottom-24 left-1/2 transform -translate-x-1/2 bg-primary text-primary-foreground px-4 py-2 rounded-full text-sm font-medium z-50 shadow-lg"
      >
        لینک کپی شد!
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useUserStore } from "~/stores/user.js"
import { useAuthStore } from "~/stores/auth.js"
import { useFormStore } from "~/stores/form.js"
import { useMessageCounts } from "~/composables/useMessageCounts"

// ✅ اعمال middleware برای محافظت از صفحه
definePageMeta({
  middleware: 'require-activated'
})

const searchQuery = ref('')
const authStore = useAuthStore()
const userStore = useUserStore()
const formStore = useFormStore()
const loading = ref(true)
const copied = ref(false)
const showPreviewMobile = ref(false)

// چک امنیتی - اگه token نیست رندر نکن
const hasValidAuth = computed(() => {
  if (import.meta.client) {
    // از authStore استفاده کن به جای مستقیم خوندن localStorage
    return authStore.isAuthenticated
  }
  return false // در SSR رندر نکن
})

// User data
const userName = computed(() => {
  // از user.name در userStore استفاده کن (نام واقعی کاربر)
  return userStore.user?.name || 'کاربر'
})
const userUserName = computed(() => userStore.user?.userName || userStore.user?.username || '')
const userAvatar = computed(() => userStore.user?.avatar || null)
const isPro = computed(() => userStore.user?.isPro || false)

// Active card
const activeCard = computed(() => formStore.defaultCard || formStore.cards?.[0] || null)

// Message counts for inbox badge
const { fetchCounts } = useMessageCounts()

// Copy profile link
const copyProfileLink = async () => {
  const link = `${window.location.origin}/${userUserName.value}`
  try {
    await navigator.clipboard.writeText(link)
    copied.value = true
    setTimeout(() => (copied.value = false), 2000)
  } catch {
    const ta = document.createElement('textarea')
    ta.value = link
    ta.style.position = 'fixed'
    ta.style.opacity = '0'
    document.body.appendChild(ta)
    ta.select()
    document.execCommand('copy')
    document.body.removeChild(ta)
    copied.value = true
    setTimeout(() => (copied.value = false), 2000)
  }
}

// Add card with limit check
const handleAddCardClick = () => {
  const isPro = userStore.user?.isPro || false
  const cardCount = userStore.cards?.length || 0

  // کاربر رایگان: فقط 1 کارت - کاربر پرو: حداکثر 5 کارت
  if (!isPro && cardCount >= 1) {
    // نمایش toast برای کاربر رایگان
    alert('کاربران رایگان فقط می‌توانند یک کارت ایجاد کنند. برای ساخت کارت‌های بیشتر به اشتراک Pro نیاز دارید')
  } else if (isPro && cardCount >= 5) {
    // نمایش toast برای کاربر پرو
    alert('شما به حداکثر تعداد مجاز کارت (5 کارت) رسیده‌اید')
  } else {
    navigateTo('/dashboard/add-card')
  }
}

// بارگذاری اطلاعات کاربر
onMounted(async () => {
  // فقط اگر token توی store نیست، hydrate کن
  if (!authStore.token) {
    authStore.hydrateToken()
  }
  
  if (authStore.isAuthenticated) {
    // نمایش داده‌های کش شده (اگر وجود داشته باشد) برای سرعت بیشتر
    if (userStore.user) {
      formStore.cards = userStore.cards
      loading.value = false
    }
    
    // همه درخواست‌ها به صورت موازی (Promise.all به جای await های پشت سر هم)
    Promise.all([
      userStore.fetchUser().then(() => {
        formStore.cards = userStore.cards
      }),
      fetchCounts(),
      // درخواست دسترسی‌های PWA به صورت غیرهمزمان (بدون await)
      (async () => {
        const { $permissions } = useNuxtApp()
        if ($permissions) {
          $permissions.requestAfterLogin()
        }
      })()
    ]).finally(() => {
      loading.value = false
    })
  } else {
    loading.value = false
  }
})
</script>

