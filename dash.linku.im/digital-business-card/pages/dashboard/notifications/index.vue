<template>
  <ClientOnly>
  <div class="min-h-screen bg-background">
    <!-- Top Header -->
    <div class="fixed top-0 left-0 right-0 z-40 bg-card border-b border-border">
      <div class="flex items-center h-14 px-3 lg:px-4">
        <button 
          @click="navigateTo('/dashboard')"
          class="flex items-center justify-center w-9 h-9 rounded-lg text-foreground hover:bg-accent transition-colors"
        >
          <i class="ti ti-arrow-right text-lg"></i>
        </button>
        <h1 class="flex-1 text-base font-semibold text-foreground lg:text-lg">اطلاعیه‌ها</h1>
        <button 
          @click="markAllAsRead"
          class="flex items-center justify-center w-9 h-9 rounded-lg text-foreground hover:bg-accent transition-colors disabled:opacity-50"
          :disabled="unreadCount === 0"
        >
          <i class="ti ti-checks text-lg"></i>
        </button>
      </div>
      
      <!-- Mobile Filter Tabs -->
      <div class="lg:hidden px-3 pb-2">
        <div class="flex items-center gap-2 overflow-x-auto scrollbar-hide">
          <button
            @click="selectedCategory = 'all'"
            :class="[
              'flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all',
              selectedCategory === 'all' 
                ? 'bg-primary text-primary-foreground' 
                : 'bg-muted text-muted-foreground hover:bg-accent'
            ]"
          >
            <i class="ti ti-bell text-sm"></i>
            <span>همه</span>
            <span v-if="allCount > 0" class="px-1.5 py-0.5 rounded-full text-[10px]" :class="selectedCategory === 'all' ? 'bg-white/20' : 'bg-primary/10 text-primary'">{{ allCount }}</span>
          </button>
          
          <button
            @click="selectedCategory = 'unread'"
            :class="[
              'flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all',
              selectedCategory === 'unread' 
                ? 'bg-primary text-primary-foreground' 
                : 'bg-muted text-muted-foreground hover:bg-accent'
            ]"
          >
            <i class="ti ti-bell-ringing text-sm"></i>
            <span>نخوانده</span>
            <span v-if="unreadCount > 0" class="px-1.5 py-0.5 rounded-full text-[10px]" :class="selectedCategory === 'unread' ? 'bg-white/20' : 'bg-red-500/10 text-red-500'">{{ unreadCount }}</span>
          </button>
          
          <button
            @click="selectedCategory = 'subscription'"
            :class="[
              'flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all',
              selectedCategory === 'subscription' 
                ? 'bg-primary text-primary-foreground' 
                : 'bg-muted text-muted-foreground hover:bg-accent'
            ]"
          >
            <i class="ti ti-crown text-sm"></i>
            <span>اشتراک</span>
          </button>
          
          <button
            @click="selectedCategory = 'payment'"
            :class="[
              'flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all',
              selectedCategory === 'payment' 
                ? 'bg-primary text-primary-foreground' 
                : 'bg-muted text-muted-foreground hover:bg-accent'
            ]"
          >
            <i class="ti ti-credit-card text-sm"></i>
            <span>پرداخت</span>
          </button>
          
          <button
            @click="selectedCategory = 'security'"
            :class="[
              'flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all',
              selectedCategory === 'security' 
                ? 'bg-primary text-primary-foreground' 
                : 'bg-muted text-muted-foreground hover:bg-accent'
            ]"
          >
            <i class="ti ti-shield text-sm"></i>
            <span>امنیت</span>
          </button>
          
          <button
            @click="selectedCategory = 'general'"
            :class="[
              'flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all',
              selectedCategory === 'general' 
                ? 'bg-primary text-primary-foreground' 
                : 'bg-muted text-muted-foreground hover:bg-accent'
            ]"
          >
            <i class="ti ti-info-circle text-sm"></i>
            <span>عمومی</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div class="pt-[90px] lg:pt-16 pb-20 px-2.5 lg:px-4 mt-4 lg:mt-0">
      <div class="lg:max-w-none lg:mx-0">
        
        <!-- Notification Permission Banner -->
        <div 
          v-if="showPermissionBanner"
          class="mb-4 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-4 text-white shadow-lg"
        >
          <div class="flex items-start gap-3">
            <div class="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
              <i class="ti ti-bell-ringing text-xl"></i>
            </div>
            <div class="flex-1">
              <h3 class="font-semibold mb-1">فعال‌سازی اعلان‌ها</h3>
              <p class="text-sm text-white/90 mb-3">برای دریافت اطلاعیه‌های فوری، لطفاً دسترسی نوتیفیکیشن را فعال کنید.</p>
              <div class="flex gap-2">
                <button
                  @click="requestNotificationPermission"
                  class="px-4 py-2 bg-white text-blue-600 rounded-lg text-sm font-medium hover:bg-white/90 transition-colors"
                >
                  فعال‌سازی
                </button>
                <button
                  @click="dismissPermissionBanner"
                  class="px-4 py-2 bg-white/10 text-white rounded-lg text-sm font-medium hover:bg-white/20 transition-colors"
                >
                  بعداً
                </button>
              </div>
            </div>
            <button
              @click="dismissPermissionBanner"
              class="text-white/70 hover:text-white transition-colors"
            >
              <i class="ti ti-x text-lg"></i>
            </button>
          </div>
        </div>
        
        <!-- Desktop: Sidebar + Content Layout -->
        <div class="hidden lg:flex lg:gap-6 lg:mt-6 lg:items-start">
          <!-- Sidebar (Sticky) -->
          <div class="w-72 flex-shrink-0 space-y-3 sticky top-20">
            <!-- All Notifications -->
            <button
              type="button"
              @click="selectedCategory = 'all'"
              :class="[
                'w-full flex items-center justify-between p-4 rounded-xl transition-all text-right',
                selectedCategory === 'all' 
                  ? 'bg-primary text-primary-foreground' 
                  : 'bg-card border border-border hover:bg-accent'
              ]"
            >
              <div class="flex items-center gap-3">
                <i class="ti ti-bell text-xl"></i>
                <span class="font-semibold">همه اطلاعیه‌ها</span>
              </div>
              <span class="text-sm">{{ allCount }}</span>
            </button>

            <!-- Unread -->
            <button
              type="button"
              @click="selectedCategory = 'unread'"
              :class="[
                'w-full flex items-center justify-between p-4 rounded-xl transition-all text-right',
                selectedCategory === 'unread' 
                  ? 'bg-primary text-primary-foreground' 
                  : 'bg-card border border-border hover:bg-accent'
              ]"
            >
              <div class="flex items-center gap-3">
                <i class="ti ti-bell-ringing text-xl"></i>
                <span class="font-semibold">خوانده نشده</span>
              </div>
              <span class="text-sm">{{ unreadCount }}</span>
            </button>

            <!-- Subscription -->
            <button
              type="button"
              @click="selectedCategory = 'subscription'"
              :class="[
                'w-full flex items-center justify-between p-4 rounded-xl transition-all text-right',
                selectedCategory === 'subscription' 
                  ? 'bg-primary text-primary-foreground' 
                  : 'bg-card border border-border hover:bg-accent'
              ]"
            >
              <div class="flex items-center gap-3">
                <i class="ti ti-crown text-xl"></i>
                <span class="font-semibold">اشتراک</span>
              </div>
              <span class="text-sm">{{ categoryCount('subscription') }}</span>
            </button>

            <!-- Payment -->
            <button
              type="button"
              @click="selectedCategory = 'payment'"
              :class="[
                'w-full flex items-center justify-between p-4 rounded-xl transition-all text-right',
                selectedCategory === 'payment' 
                  ? 'bg-primary text-primary-foreground' 
                  : 'bg-card border border-border hover:bg-accent'
              ]"
            >
              <div class="flex items-center gap-3">
                <i class="ti ti-credit-card text-xl"></i>
                <span class="font-semibold">پرداخت</span>
              </div>
              <span class="text-sm">{{ categoryCount('payment') }}</span>
            </button>

            <!-- Security -->
            <button
              type="button"
              @click="selectedCategory = 'security'"
              :class="[
                'w-full flex items-center justify-between p-4 rounded-xl transition-all text-right',
                selectedCategory === 'security' 
                  ? 'bg-primary text-primary-foreground' 
                  : 'bg-card border border-border hover:bg-accent'
              ]"
            >
              <div class="flex items-center gap-3">
                <i class="ti ti-shield text-xl"></i>
                <span class="font-semibold">امنیت</span>
              </div>
              <span class="text-sm">{{ categoryCount('security') }}</span>
            </button>

            <!-- General -->
            <button
              type="button"
              @click="selectedCategory = 'general'"
              :class="[
                'w-full flex items-center justify-between p-4 rounded-xl transition-all text-right',
                selectedCategory === 'general' 
                  ? 'bg-primary text-primary-foreground' 
                  : 'bg-card border border-border hover:bg-accent'
              ]"
            >
              <div class="flex items-center gap-3">
                <i class="ti ti-info-circle text-xl"></i>
                <span class="font-semibold">عمومی</span>
              </div>
              <span class="text-sm">{{ categoryCount('general') }}</span>
            </button>
          </div>

          <!-- Content Area -->
          <div class="flex-1 space-y-4">
          <!-- Loading State -->
          <template v-if="loading">
            <div v-for="i in 6" :key="i" class="bg-card border border-border rounded-xl p-4 transition-all">
              <div class="flex items-center gap-4 animate-pulse">
                <div class="w-12 h-12 rounded-xl bg-accent flex-shrink-0"></div>
                <div class="flex-1 space-y-2">
                  <div class="h-4 bg-accent rounded-md w-1/3"></div>
                  <div class="h-3 bg-accent rounded-md w-full"></div>
                </div>
                <div class="h-3 bg-accent rounded-md w-20"></div>
                <div class="w-2.5 h-2.5 bg-accent rounded-full"></div>
              </div>
            </div>
          </template>

          <!-- Notifications List -->
          <template v-else-if="filteredNotifications.length > 0">
            <div 
              v-for="notification in filteredNotifications" 
              :key="notification.id"
              @click="handleNotificationClick(notification)"
              class="bg-card border transition-all cursor-pointer hover:bg-accent hover:border-primary/30 relative rounded-xl p-4"
              :class="!notification.read ? 'border-primary/20' : 'border-border'"
            >
              <div class="flex items-center gap-4">
                <!-- Icon -->
                <div 
                  :class="[
                    'w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 relative',
                    getNotificationStyle(notification).bg
                  ]"
                >
                  <i :class="[getNotificationStyle(notification).icon, getNotificationStyle(notification).color, 'text-xl']"></i>
                  <!-- Pinned indicator -->
                  <div 
                    v-if="notification.is_pinned"
                    class="absolute -top-1 -right-1 w-5 h-5 bg-amber-500 rounded-full flex items-center justify-center"
                    title="پین شده"
                  >
                    <i class="ti ti-pin-filled text-white text-xs"></i>
                  </div>
                </div>

                <!-- Content -->
                <div class="flex-1 min-w-0">
                  <h3 class="font-semibold text-foreground text-sm leading-tight mb-1">{{ notification.title }}</h3>
                  <p class="text-xs text-muted-foreground leading-relaxed truncate">{{ notification.description }}</p>
                </div>

                <!-- Time -->
                <span class="text-xs text-muted-foreground flex-shrink-0">{{ formatTime(notification.createdAt) }}</span>

                <!-- Unread indicator -->
                <div 
                  v-if="!notification.read"
                  class="w-2.5 h-2.5 bg-primary rounded-full flex-shrink-0"
                ></div>
              </div>
            </div>
          </template>

          <!-- Empty State -->
          <div v-else class="text-center py-20 px-4">
            <div class="w-20 h-20 mx-auto mb-4 rounded-full bg-accent flex items-center justify-center">
              <i class="ti ti-bell-off text-4xl text-muted-foreground"></i>
            </div>
            <h3 class="text-lg font-semibold text-foreground mb-2">اطلاعیه‌ای وجود ندارد</h3>
            <p class="text-sm text-muted-foreground">در این دسته‌بندی اطلاعیه‌ای یافت نشد</p>
          </div>
          </div>
        </div>

        <!-- Mobile: List Layout -->
        <div class="lg:hidden">
          <!-- Loading State -->
          <div v-if="loading" class="space-y-2">
            <div v-for="i in 8" :key="i" class="bg-card border border-border rounded-xl p-3 transition-all">
              <div class="flex items-start gap-2.5 animate-pulse">
                <div class="w-10 h-10 rounded-lg bg-accent flex-shrink-0"></div>
                <div class="flex-1 space-y-2">
                  <div class="flex items-start justify-between gap-2">
                    <div class="h-3.5 bg-accent rounded-md w-2/3"></div>
                    <div class="h-3 bg-accent rounded-md w-14 flex-shrink-0"></div>
                  </div>
                  <div class="h-3 bg-accent rounded-md w-full"></div>
                </div>
                <div class="w-2 h-2 bg-accent rounded-full flex-shrink-0 mt-1"></div>
              </div>
            </div>
          </div>

          <!-- Notifications List -->
          <div v-else-if="filteredNotifications.length > 0" class="space-y-2">
            <div 
              v-for="notification in filteredNotifications" 
              :key="notification.id"
              @click="handleNotificationClick(notification)"
              class="bg-card border transition-all cursor-pointer hover:bg-accent hover:border-primary/30 relative rounded-xl p-3"
              :class="!notification.read ? 'border-primary/20' : 'border-border'"
            >
              <div class="flex items-start gap-2.5">
                <div 
                  :class="[
                    'w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 relative',
                    getNotificationStyle(notification).bg
                  ]"
                >
                  <i :class="[getNotificationStyle(notification).icon, getNotificationStyle(notification).color, 'text-lg']"></i>
                  <!-- Pinned indicator -->
                  <div 
                    v-if="notification.is_pinned"
                    class="absolute -top-1 -right-1 w-4 h-4 bg-amber-500 rounded-full flex items-center justify-center"
                    title="پین شده"
                  >
                    <i class="ti ti-pin-filled text-white text-[10px]"></i>
                  </div>
                </div>

                <div class="flex-1 min-w-0">
                  <div class="flex items-start justify-between gap-2 mb-1">
                    <h3 class="font-semibold text-foreground text-sm leading-tight">{{ notification.title }}</h3>
                    <span class="text-[10px] text-muted-foreground flex-shrink-0 mt-0.5">{{ formatTime(notification.createdAt) }}</span>
                  </div>
                  <p class="text-xs text-muted-foreground leading-relaxed line-clamp-2">{{ notification.description }}</p>
                </div>

                <div 
                  v-if="!notification.read"
                  class="w-2 h-2 bg-primary rounded-full flex-shrink-0 mt-1"
                ></div>
              </div>
            </div>
          </div>

          <!-- Empty State -->
          <div v-else class="text-center py-16 px-4">
            <div class="w-16 h-16 mx-auto mb-4 rounded-full bg-accent flex items-center justify-center">
              <i class="ti ti-bell-off text-3xl text-muted-foreground"></i>
            </div>
            <h3 class="text-base font-semibold text-foreground mb-1">اطلاعیه‌ای وجود ندارد</h3>
            <p class="text-sm text-muted-foreground">{{ selectedCategory === 'all' ? 'شما هیچ اطلاعیه‌ای ندارید' : 'در این دسته‌بندی اطلاعیه‌ای یافت نشد' }}</p>
          </div>
        </div>

      </div>
    </div>
  </div>
  </ClientOnly>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useNotificationStore } from '~/stores/notification'

definePageMeta({
  middleware: 'require-activated'
})

const notificationStore = useNotificationStore()

const selectedCategory = ref('all')
const loading = computed(() => notificationStore.loading)
const showPermissionBanner = ref(false)

const displayedNotifications = computed(() => {
  return notificationStore.notifications
})

const filteredNotifications = computed(() => {
  const all = notificationStore.notifications
  
  if (selectedCategory.value === 'all') {
    return all
  } else if (selectedCategory.value === 'unread') {
    return all.filter(n => !n.read)
  } else {
    return all.filter(n => n.type === selectedCategory.value)
  }
})

const allCount = computed(() => {
  return notificationStore.notifications.length
})

const unreadCount = computed(() => {
  return notificationStore.unreadCount
})

const categoryCount = (type) => {
  return notificationStore.notifications.filter(n => n.type === type).length
}

const getNotificationStyle = (notification) => {
  // Check if notification exists
  if (!notification) {
    return {
      icon: 'ti ti-info-circle',
      color: 'text-blue-500',
      bg: 'bg-blue-500/10'
    }
  }

  // More specific styles based on rawType first, then fallback to type
  const rawTypeStyles = {
    // Subscription related
    'renewal_reminder': {
      icon: 'ti ti-crown',
      color: 'text-yellow-500',
      bg: 'bg-yellow-500/10'
    },
    'subscription_expired': {
      icon: 'ti ti-crown',
      color: 'text-orange-500',
      bg: 'bg-orange-500/10'
    },
    'purchase_success': {
      icon: 'ti ti-credit-card',
      color: 'text-green-500',
      bg: 'bg-green-500/10'
    },
    // Security related
    'new_login': {
      icon: 'ti ti-shield',
      color: 'text-red-500',
      bg: 'bg-red-500/10'
    },
    // System related
    'profile_created': {
      icon: 'ti ti-user-plus',
      color: 'text-purple-500',
      bg: 'bg-purple-500/10'
    },
    // General actions
    'login': {
      icon: 'ti ti-login',
      color: 'text-cyan-500',
      bg: 'bg-cyan-500/10'
    },
    'logout': {
      icon: 'ti ti-logout',
      color: 'text-slate-500',
      bg: 'bg-slate-500/10'
    },
    'welcome': {
      icon: 'ti ti-hand-stop',
      color: 'text-pink-500',
      bg: 'bg-pink-500/10'
    },
    'first_login': {
      icon: 'ti ti-star',
      color: 'text-amber-500',
      bg: 'bg-amber-500/10'
    }
  }

  // Check rawType first
  if (notification.rawType && rawTypeStyles[notification.rawType]) {
    return rawTypeStyles[notification.rawType]
  }

  // Fallback to type-based styles
  const typeStyles = {
    subscription: {
      icon: 'ti ti-crown',
      color: 'text-yellow-500',
      bg: 'bg-yellow-500/10'
    },
    payment: {
      icon: 'ti ti-credit-card',
      color: 'text-green-500',
      bg: 'bg-green-500/10'
    },
    security: {
      icon: 'ti ti-shield',
      color: 'text-red-500',
      bg: 'bg-red-500/10'
    },
    system: {
      icon: 'ti ti-settings',
      color: 'text-purple-500',
      bg: 'bg-purple-500/10'
    },
    general: {
      icon: 'ti ti-info-circle',
      color: 'text-blue-500',
      bg: 'bg-blue-500/10'
    }
  }
  
  return typeStyles[notification.type] || typeStyles.general
}

const formatTime = (date) => {
  const now = new Date()
  const diff = now - new Date(date)
  const seconds = Math.floor(diff / 1000)
  const minutes = Math.floor(seconds / 60)
  const hours = Math.floor(minutes / 60)
  const days = Math.floor(hours / 24)
  
  if (days > 7) {
    return new Date(date).toLocaleDateString('fa-IR')
  } else if (days > 0) {
    return `${days} روز پیش`
  } else if (hours > 0) {
    return `${hours} ساعت پیش`
  } else if (minutes > 0) {
    return `${minutes} دقیقه پیش`
  } else {
    return 'الان'
  }
}

const handleNotificationClick = async (notification) => {
  if (!notification.read) {
    await notificationStore.markAsRead(notification.id)
  }
}

const markAllAsRead = async () => {
  await notificationStore.markAllAsRead()
}

// تست نوتیفیکیشن
const sendTestNotification = async () => {
  try {
    const { $axios } = useNuxtApp()
    const response = await $axios.post('/user/push-subscription/test')
    
    if (response.data.success) {
      console.log('✅ Test notification sent:', response.data)
      alert('نوتیفیکیشن تست ارسال شد! اگر دیدی یعنی کار میکنه 🎉')
    } else {
      console.error('❌ Test notification failed:', response.data)
      alert(response.data.message || 'خطا در ارسال نوتیفیکیشن')
    }
  } catch (error: any) {
    console.error('❌ Error sending test notification:', error)
    alert(error.response?.data?.message || 'خطا در ارسال نوتیفیکیشن. ابتدا دسترسی نوتیفیکیشن را بدهید.')
  }
}



// درخواست دسترسی نوتیفیکیشن
const requestNotificationPermission = async () => {
  if (!('Notification' in window)) {
    alert('مرورگر شما از نوتیفیکیشن پشتیبانی نمی‌کند')
    return
  }

  try {
    const permission = await Notification.requestPermission()
    
    if (permission === 'granted') {
      showPermissionBanner.value = false
      
      // ثبت subscription
      const { $subscribeToPush } = useNuxtApp()
      if ($subscribeToPush) {
        const success = await $subscribeToPush()
        if (success) {
          alert('دسترسی نوتیفیکیشن با موفقیت فعال شد! ✅')
        }
      }
    } else if (permission === 'denied') {
      alert('دسترسی نوتیفیکیشن رد شد. لطفاً از تنظیمات مرورگر یا گوشی، دسترسی را فعال کنید.')
    }
  } catch (error) {
    console.error('❌ Error requesting permission:', error)
    alert('خطا در درخواست دسترسی. لطفاً صفحه را رفرش کنید.')
  }
}

// بستن بنر
const dismissPermissionBanner = () => {
  showPermissionBanner.value = false
  localStorage.setItem('notification_banner_dismissed', 'true')
}

// چک کردن وضعیت دسترسی
const checkNotificationPermission = () => {
  if (!process.client || !('Notification' in window)) return
  
  const dismissed = localStorage.getItem('notification_banner_dismissed')
  const permission = Notification.permission
  
  console.log('📱 Notification permission:', permission)
  
  // اگه هنوز درخواست نداده یا رد کرده و banner رو نبسته
  if (permission === 'default' && !dismissed) {
    showPermissionBanner.value = true
  } else if (permission === 'denied') {
    console.warn('⚠️ Notification permission denied by user')
  } else if (permission === 'granted') {
    console.log('✅ Notification permission granted')
  }
}

// Fetch on client side only
if (process.client) {
  onMounted(() => {
    notificationStore.fetchNotifications()
    // Start polling every 15 seconds for real-time updates
    notificationStore.startPolling(15000)
    
    // چک کردن دسترسی نوتیفیکیشن
    setTimeout(() => {
      checkNotificationPermission()
    }, 1000)
  })

  onUnmounted(() => {
    // Stop polling when leaving the page
    notificationStore.stopPolling()
  })
}
</script>

<style scoped>
.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
.scrollbar-hide::-webkit-scrollbar {
  display: none;
}
</style>