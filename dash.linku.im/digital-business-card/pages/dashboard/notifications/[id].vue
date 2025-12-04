<template>
  <div class="min-h-screen bg-background">
    <!-- Header -->
    <div class="fixed top-0 left-0 right-0 z-40 bg-card border-b border-border">
      <div class="flex items-center h-14 px-4">
        <button
          @click="$router.back()"
          class="flex items-center justify-center w-10 h-10 rounded-lg text-foreground hover:bg-accent transition-colors"
        >
          <i class="ti ti-arrow-right text-xl"></i>
        </button>
        <h1 class="flex-1 text-lg font-semibold text-foreground">جزئیات اطلاعیه</h1>
      </div>
    </div>

    <!-- Content -->
    <div class="pt-16 pb-8 px-4">
      <div v-if="loading" class="max-w-2xl mx-auto space-y-4 animate-pulse">
        <div class="h-32 bg-accent rounded-xl"></div>
        <div class="h-24 bg-accent rounded-xl"></div>
        <div class="h-48 bg-accent rounded-xl"></div>
      </div>

      <div v-else-if="notification" class="max-w-2xl mx-auto space-y-4">
        <!-- Header Card with Icon -->
        <div 
          class="bg-card border border-border rounded-2xl p-6 space-y-4"
          :style="notification.backgroundColor ? { backgroundColor: notification.backgroundColor } : {}"
        >
          <div class="flex items-start gap-4">
            <!-- Icon -->
            <div 
              :class="[
                'w-16 h-16 rounded-xl flex items-center justify-center flex-shrink-0',
                notification.backgroundColor ? 'bg-white/20' : getNotificationStyle(notification).bg
              ]"
            >
              <img 
                v-if="notification.iconUrl"
                :src="notification.iconUrl"
                class="w-full h-full object-cover rounded-xl"
                alt="Icon"
              />
              <i 
                v-else 
                :class="[
                  getNotificationStyle(notification).icon, 
                  notification.backgroundColor ? 'text-white' : getNotificationStyle(notification).color,
                  'text-3xl'
                ]"
              ></i>
            </div>

            <!-- Title and Time -->
            <div class="flex-1 space-y-2">
              <h2 class="text-xl font-bold text-foreground">{{ notification.title }}</h2>
              <div class="flex items-center gap-2 text-sm text-muted-foreground">
                <i class="ti ti-clock text-base"></i>
                <span>{{ formatTime(notification.createdAt) }}</span>
              </div>
            </div>

            <!-- Pin Badge -->
            <div v-if="notification.is_pinned" class="bg-amber-500/10 text-amber-600 dark:text-amber-400 px-3 py-1.5 rounded-full text-xs font-medium flex items-center gap-1.5">
              <i class="ti ti-pin text-sm"></i>
              <span>سنجاق شده</span>
            </div>
          </div>

          <!-- Type Badge -->
          <div class="flex items-center gap-2">
            <span :class="[
              'px-3 py-1.5 rounded-full text-xs font-medium',
              getNotificationStyle(notification).bg,
              getNotificationStyle(notification).color
            ]">
              {{ getTypeLabel(notification.type) }}
            </span>
          </div>
        </div>

        <!-- Large Image -->
        <div v-if="notification.imageUrl" class="bg-card border border-border rounded-2xl overflow-hidden">
          <img 
            :src="notification.imageUrl" 
            class="w-full h-auto object-cover"
            alt="Notification Image"
          />
        </div>

        <!-- Message Card -->
        <div class="bg-card border border-border rounded-2xl p-6 space-y-4">
          <h3 class="text-lg font-semibold text-foreground">پیام</h3>
          <p class="text-foreground leading-relaxed whitespace-pre-wrap">{{ notification.description }}</p>
        </div>

        <!-- Action Link Card -->
        <div v-if="notification.actionLink" class="bg-card border border-border rounded-2xl p-6 space-y-4">
          <h3 class="text-lg font-semibold text-foreground">لینک عملیات</h3>
          <a 
            :href="notification.actionLink"
            target="_blank"
            rel="noopener noreferrer"
            class="flex items-center justify-between p-4 bg-primary/10 hover:bg-primary/20 rounded-xl transition-colors group"
          >
            <div class="flex items-center gap-3">
              <i class="ti ti-link text-primary text-xl"></i>
              <span class="text-primary font-medium">باز کردن لینک</span>
            </div>
            <i class="ti ti-external-link text-primary text-lg group-hover:translate-x-1 transition-transform"></i>
          </a>
        </div>

        <!-- Additional Info -->
        <div class="bg-card border border-border rounded-2xl p-6 space-y-3">
          <div class="flex items-center justify-between py-2 border-b border-border">
            <span class="text-muted-foreground">وضعیت</span>
            <span :class="notification.read ? 'text-green-600' : 'text-blue-600'" class="font-medium flex items-center gap-2">
              <i :class="notification.read ? 'ti ti-check' : 'ti ti-bell-ringing'"></i>
              {{ notification.read ? 'خوانده شده' : 'خوانده نشده' }}
            </span>
          </div>
          <div class="flex items-center justify-between py-2">
            <span class="text-muted-foreground">تاریخ دریافت</span>
            <span class="text-foreground font-medium">{{ formatFullDate(notification.createdAt) }}</span>
          </div>
        </div>
      </div>

      <!-- Error State -->
      <div v-else class="max-w-2xl mx-auto text-center py-12">
        <div class="w-20 h-20 mx-auto mb-4 rounded-full bg-red-500/10 flex items-center justify-center">
          <i class="ti ti-alert-circle text-red-500 text-4xl"></i>
        </div>
        <h3 class="text-xl font-semibold text-foreground mb-2">اطلاعیه یافت نشد</h3>
        <p class="text-muted-foreground mb-6">این اطلاعیه حذف شده یا وجود ندارد</p>
        <button
          @click="$router.back()"
          class="px-6 py-3 bg-primary text-primary-foreground rounded-xl font-medium hover:bg-primary/90 transition-colors"
        >
          بازگشت به لیست اطلاعیه‌ها
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useNotificationStore } from '~/stores/notification'
import type { Notification } from '~/types/notification'

const route = useRoute()
const router = useRouter()
const notificationStore = useNotificationStore()

const loading = ref(true)
const notification = ref<Notification | undefined>(undefined)

onMounted(async () => {
  try {
    const id = route.params.id
    await notificationStore.fetchNotifications()
    
    notification.value = notificationStore.notifications.find(n => String(n.id) === String(id))
    
    // Mark as read if unread
    if (notification.value && !notification.value.read) {
      await notificationStore.markAsRead(notification.value.id)
    }
  } catch (error) {
    console.error('Error loading notification:', error)
  } finally {
    loading.value = false
  }
})

const getNotificationStyle = (notification: Notification) => {
  const rawTypeStyles: Record<string, { icon: string; color: string; bg: string }> = {
    'discount_code': {
      icon: 'ti ti-ticket',
      color: 'text-orange-500',
      bg: 'bg-orange-500/10'
    },
    'payment_success': {
      icon: 'ti ti-check',
      color: 'text-green-500',
      bg: 'bg-green-500/10'
    },
    'subscription_expire': {
      icon: 'ti ti-clock-exclamation',
      color: 'text-amber-500',
      bg: 'bg-amber-500/10'
    },
    'first_login': {
      icon: 'ti ti-star',
      color: 'text-amber-500',
      bg: 'bg-amber-500/10'
    }
  }

  if (notification.rawType && rawTypeStyles[notification.rawType]) {
    return rawTypeStyles[notification.rawType]
  }

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

return typeStyles[notification.type as keyof typeof typeStyles] || typeStyles.general
}

const getTypeLabel = (type: string) => {
  const labels: Record<string, string> = {
    subscription: 'اشتراک',
    payment: 'پرداخت',
    security: 'امنیت',
    system: 'سیستم',
    general: 'عمومی'
  }
  return labels[type] || 'عمومی'
}

const formatTime = (date: string | Date) => {
  const now = new Date()
  const targetDate = typeof date === 'string' ? new Date(date) : date
  const diff = now.getTime() - targetDate.getTime()
  const seconds = Math.floor(diff / 1000)
  const minutes = Math.floor(seconds / 60)
  const hours = Math.floor(minutes / 60)
  const days = Math.floor(hours / 24)

  if (days > 7) {
    return targetDate.toLocaleDateString('fa-IR')
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

const formatFullDate = (date: string | Date) => {
  const targetDate = typeof date === 'string' ? new Date(date) : date
  return targetDate.toLocaleDateString('fa-IR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}
</script>
