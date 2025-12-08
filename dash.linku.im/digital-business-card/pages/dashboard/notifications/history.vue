<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <!-- Header -->
    <div class="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 py-4">
      <div class="flex items-center gap-3">
        <button
          @click="goBack('/dashboard/notifications')"
          class="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition"
        >
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <div>
          <h1 class="text-xl font-bold text-gray-900 dark:text-white">تاریخچه اعلان‌ها</h1>
          <p class="text-sm text-gray-500 dark:text-gray-400">
            مشاهده تمام اعلان‌های ارسال شده
          </p>
        </div>
      </div>
    </div>

    <!-- Filters -->
    <div class="p-4 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
      <div class="flex gap-2 overflow-x-auto">
        <button
          v-for="filter in filters"
          :key="filter.value"
          @click="selectedFilter = filter.value"
          :class="[
            'px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition',
            selectedFilter === filter.value
              ? 'bg-blue-500 text-white'
              : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
          ]"
        >
          {{ filter.label }}
        </button>
      </div>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="flex items-center justify-center py-12">
      <div class="flex flex-col items-center gap-3">
        <div class="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        <p class="text-sm text-gray-500 dark:text-gray-400">در حال بارگذاری...</p>
      </div>
    </div>

    <!-- Notifications List -->
    <div v-else-if="filteredNotifications.length > 0" class="p-4 space-y-3">
      <div
        v-for="notification in filteredNotifications"
        :key="notification.id"
        class="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700 hover:shadow-md transition"
      >
        <!-- Header -->
        <div class="flex items-start justify-between gap-3 mb-3">
          <div class="flex-1">
            <h3 class="font-semibold text-gray-900 dark:text-white mb-1">
              {{ notification.title }}
            </h3>
            <p class="text-sm text-gray-600 dark:text-gray-400">
              {{ notification.message }}
            </p>
          </div>
          <span
            :class="[
              'px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap',
              notification.type === 'all' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300' :
              notification.type === 'premium' ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300' :
              notification.type === 'free' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300' :
              'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
            ]"
          >
            {{ getTypeLabel(notification.type) }}
          </span>
        </div>

        <!-- Stats -->
        <div class="grid grid-cols-3 gap-3 mb-3">
          <div class="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-2 text-center">
            <div class="text-lg font-bold text-gray-900 dark:text-white">
              {{ notification.sentCount || 0 }}
            </div>
            <div class="text-xs text-gray-500 dark:text-gray-400">ارسال شده</div>
          </div>
          <div class="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-2 text-center">
            <div class="text-lg font-bold text-green-600 dark:text-green-400">
              {{ notification.deliveredCount || 0 }}
            </div>
            <div class="text-xs text-gray-500 dark:text-gray-400">تحویل شده</div>
          </div>
          <div class="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-2 text-center">
            <div class="text-lg font-bold text-blue-600 dark:text-blue-400">
              {{ notification.clickedCount || 0 }}
            </div>
            <div class="text-xs text-gray-500 dark:text-gray-400">کلیک شده</div>
          </div>
        </div>

        <!-- Action Link -->
        <div v-if="notification.actionLink" class="mb-3">
          <div class="text-xs text-gray-500 dark:text-gray-400 mb-1">لینک:</div>
          <div class="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-2 text-sm text-gray-700 dark:text-gray-300 break-all">
            {{ notification.actionLink }}
          </div>
        </div>

        <!-- Footer -->
        <div class="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 pt-3 border-t border-gray-100 dark:border-gray-700">
          <div class="flex items-center gap-2">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {{ formatDate(notification.createdAt) }}
          </div>
          <div v-if="notification.scheduledFor" class="flex items-center gap-1">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            زمان‌بندی: {{ formatDate(notification.scheduledFor) }}
          </div>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else class="flex flex-col items-center justify-center py-16 px-4">
      <div class="w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
        <svg class="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
        </svg>
      </div>
      <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">
        هیچ اعلانی یافت نشد
      </h3>
      <p class="text-sm text-gray-500 dark:text-gray-400 text-center">
        تاکنون هیچ اعلانی ارسال نشده است
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useSafeNavigation } from '~/composables/useSafeNavigation'
const { goBack } = useSafeNavigation()

interface Notification {
  id: number
  title: string
  message: string
  type: 'all' | 'premium' | 'free' | 'specific'
  sentCount: number
  deliveredCount?: number
  clickedCount?: number
  actionLink?: string
  createdAt: string
  scheduledFor?: string
}

const loading = ref(true)
const notifications = ref<Notification[]>([])
const selectedFilter = ref('all')

const filters = [
  { label: 'همه', value: 'all' },
  { label: 'برای همه کاربران', value: 'all-users' },
  { label: 'پرمیوم', value: 'premium' },
  { label: 'رایگان', value: 'free' },
  { label: 'خاص', value: 'specific' }
]

const filteredNotifications = computed(() => {
  if (selectedFilter.value === 'all') {
    return notifications.value
  }
  return notifications.value.filter(n => {
    if (selectedFilter.value === 'all-users') return n.type === 'all'
    return n.type === selectedFilter.value
  })
})

function getTypeLabel(type: string) {
  const labels: Record<string, string> = {
    'all': 'همه کاربران',
    'premium': 'پرمیوم',
    'free': 'رایگان',
    'specific': 'کاربران خاص'
  }
  return labels[type] || type
}

function formatDate(dateString: string) {
  const date = new Date(dateString)
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  const hours = Math.floor(diff / (1000 * 60 * 60))
  
  if (hours < 1) return 'همین الان'
  if (hours < 24) return `${hours} ساعت پیش`
  
  const days = Math.floor(hours / 24)
  if (days < 7) return `${days} روز پیش`
  
  return new Intl.DateTimeFormat('fa-IR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date)
}

// Fetch notifications
onMounted(async () => {
  try {
    // فعلاً داده‌های تست - بعداً از API می‌خونیم
    // const response = await $fetch('/api/user/admin/notifications/history')
    // notifications.value = response.data
    
    // Mock data برای تست
    notifications.value = [
      {
        id: 1,
        title: 'به‌روزرسانی جدید',
        message: 'نسخه جدید اپلیکیشن منتشر شد',
        type: 'all',
        sentCount: 1250,
        deliveredCount: 1180,
        clickedCount: 450,
        actionLink: '/dashboard/updates',
        createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
      },
      {
        id: 2,
        title: 'پیشنهاد ویژه پرمیوم',
        message: '50٪ تخفیف برای ارتقا به پرمیوم',
        type: 'free',
        sentCount: 850,
        deliveredCount: 820,
        clickedCount: 180,
        actionLink: '/dashboard/upgrade',
        createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString()
      },
      {
        id: 3,
        title: 'قابلیت جدید',
        message: 'قابلیت کارت NFC اضافه شد',
        type: 'premium',
        sentCount: 320,
        deliveredCount: 310,
        clickedCount: 95,
        createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
      }
    ]
  } catch (error) {
    console.error('Error fetching notifications:', error)
  } finally {
    loading.value = false
  }
})
</script>
