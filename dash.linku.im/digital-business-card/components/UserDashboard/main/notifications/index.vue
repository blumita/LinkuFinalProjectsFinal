<template>
  <div class="space-y-4">
    <!-- فیلتر نوتیفیکیشن‌ها -->
    <div class="bg-white rounded-xl p-4">
      <div class="flex items-center gap-2 mb-4">
        <button
          v-for="filter in filters"
          :key="filter.key"
          @click="activeFilter = filter.key"
          :class="[
            'px-4 py-2 rounded-full text-sm font-medium transition-all',
            activeFilter === filter.key
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          ]"
        >
          {{ filter.label }}
        </button>
      </div>
      
      <!-- آمار نوتیفیکیشن‌ها -->
      <div class="flex items-center justify-between text-sm text-gray-500">
        <span>{{ filteredNotifications.length }} نوتیفیکیشن</span>
        <button 
          @click="markAllAsRead"
          class="text-blue-600 hover:text-blue-800 transition-colors"
        >
          علامت‌گذاری همه به عنوان خوانده شده
        </button>
      </div>
    </div>

    <!-- لیست نوتیفیکیشن‌ها -->
    <div class="space-y-3">
      <div
        v-for="notification in filteredNotifications"
        :key="notification.id"
        :class="[
          'bg-white rounded-xl p-4 transition-all cursor-pointer hover:shadow-md',
          !notification.read ? 'border-r-4 border-blue-500' : ''
        ]"
        @click="handleMarkAsRead(notification.id)"
      >
        <div class="flex items-start gap-4">
          <!-- آیکن نوتیفیکیشن -->
          <div 
            :class="[
              'w-12 h-12 rounded-full flex items-center justify-center shrink-0',
              getNotificationIconClass(notification.type)
            ]"
          >
            <i :class="getNotificationIcon(notification.type)" class="text-xl"></i>
          </div>

          <!-- محتوای نوتیفیکیشن -->
          <div class="flex-1 min-w-0">
            <div class="flex items-start justify-between gap-2 mb-2">
              <h3 class="font-semibold text-gray-800 line-clamp-1">
                {{ notification.title }}
              </h3>
              <div class="flex items-center gap-2 shrink-0">
                <span class="text-xs text-gray-400">{{ formatTime(notification.createdAt) }}</span>
                <span 
                  v-if="!notification.read"
                  class="w-2 h-2 bg-blue-500 rounded-full"
                ></span>
              </div>
            </div>
            
            <p class="text-sm text-gray-600 mb-3 line-clamp-2">
              {{ notification.description }}
            </p>

            <!-- اکشن‌های نوتیفیکیشن -->
            <div v-if="notification.actions?.length" class="flex gap-2">
              <button
                v-for="action in notification.actions"
                :key="action.label"
                @click.stop="handleAction(action)"
                :class="[
                  'px-3 py-1 rounded-lg text-xs font-medium transition-colors',
                  action.type === 'primary' 
                    ? 'bg-blue-600 text-white hover:bg-blue-700'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                ]"
              >
                {{ action.label }}
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- پیام خالی -->
      <div 
        v-if="filteredNotifications.length === 0"
        class="bg-white rounded-xl p-12 text-center"
      >
        <div class="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <i class="ti ti-bell-off text-2xl text-gray-400"></i>
        </div>
        <h3 class="text-lg font-semibold text-gray-800 mb-2">نوتیفیکیشنی وجود ندارد</h3>
        <p class="text-gray-500">در این دسته‌بندی نوتیفیکیشنی برای نمایش وجود ندارد.</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import {useNotificationStore} from "~/stores/notification.js";

const activeFilter = ref('all')

const filters = [
  { key: 'all', label: 'همه' },
  { key: 'subscription', label: 'اشتراک' },
  { key: 'payment', label: 'پرداخت' },
  { key: 'system', label: 'سیستم' },
  { key: 'security', label: 'امنیت' }
]

const notificationStore = useNotificationStore()

onMounted(async ()=>{
  await notificationStore.fetchNotifications()
})


const filteredNotifications = computed(() => {
  if (activeFilter.value === 'all') {
    return notificationStore.notifications
  }
  return notificationStore.notifications.filter(n => n.type === activeFilter.value)
})

const getNotificationIcon = (type) => {
  const icons = {
    subscription: 'ti ti-crown',
    payment: 'ti ti-credit-card',
    system: 'ti ti-settings',
    security: 'ti ti-shield-check'
  }
  return icons[type] || 'ti ti-bell'
}

const getNotificationIconClass = (type) => {
  const classes = {
    subscription: 'bg-orange-100 text-orange-600',
    payment: 'bg-green-100 text-green-600',
    system: 'bg-blue-100 text-blue-600',
    security: 'bg-purple-100 text-purple-600'
  }
  return classes[type] || 'bg-gray-100 text-gray-600'
}

const formatTime = (date) => {
  const now = new Date()
  const diff = now - date
  const minutes = Math.floor(diff / (1000 * 60))
  const hours = Math.floor(diff / (1000 * 60 * 60))
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))

  if (minutes < 60) {
    return `${minutes} دقیقه پیش`
  } else if (hours < 24) {
    return `${hours} ساعت پیش`
  } else {
    return `${days} روز پیش`
  }
}

const handleMarkAsRead = async (id) => {

  await notificationStore.markAsRead(id)
}

const markAllAsRead = () => {

  notificationStore.markAllAsRead()
}

const handleAction = (action) => {
  if (action.action) {
    action.action()
  }
}
</script>

<style scoped>
.line-clamp-1 {
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
