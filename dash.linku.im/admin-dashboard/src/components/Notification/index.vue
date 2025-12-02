<template>
  <div class="space-y-4 p-4">
    <!-- فیلتر نوتیفیکیشن‌ها -->
    <div class="dark:bg-slate-800 rounded-xl p-4">
      <div class="flex items-center gap-2 mb-4">
        <button
            v-for="filter in filters"
            :key="filter.key"
            @click="activeFilter = filter.key"
            :class="['px-4 py-2 rounded-full text-sm font-medium transition-all',
            activeFilter === filter.key? 'bg-blue-100 text-blue-700 dark:bg-blue-800 dark:text-white'
            : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-slate-700 dark:text-white dark:hover:bg-slate-600'
            ]"
        >
          {{ filter.label }}
        </button>
      </div>

      <!-- آمار نوتیفیکیشن‌ها -->
      <div class="flex items-center justify-between text-sm text-gray-600 dark:text-gray-300">
        <span>{{ filteredNotifications.length }} نوتیفیکیشن</span>
        <button
            @click="markAllAsRead"
            class="text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white transition-colors"
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
          :class="['bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600 transition-all duration-300 group',
          !notification.isRead ? 'text-gray-600 dark:text-gray-400' : 'text-gray-800 dark:text-gray-100'
          ]"
          @click="handleMarkAsRead(notification.id)"
      >
        <div class="flex items-start gap-4">
          <!-- آیکن نوتیفیکیشن -->
          <div
              :class="[
              'w-12 h-12 rounded-full flex items-center justify-center text-white dark:bg-gray-500 shrink-0',
              getNotificationIconClass(notification.type)
            ]"
          >
            <i :class="getNotificationIcon(notification.type)" class="text-xl"></i>
          </div>

          <!-- محتوای نوتیفیکیشن -->
          <div class="flex-1 min-w-0">
            <div class="flex items-start justify-between gap-2 mb-2">
              <h3 class="font-semibold line-clamp-1 text-gray-800 dark:text-white">
                {{ notification.title }}
              </h3>
              <div class="flex items-center gap-2 shrink-0">
                <span class="text-xs text-white">{{ timeAgo(notification.createdAt) }}</span>
                <span
                    v-if="!notification.isRead"
                    class="w-2 h-2 bg-blue-500 rounded-full"
                ></span>
              </div>
            </div>

            <p class="text-sm mb-3 line-clamp-2 text-gray-700 dark:text-gray-300">
              {{ notification.description }}
            </p>

            <!-- اکشن‌های نوتیفیکیشن -->
            <div v-if="notification.actions?.length" class="flex gap-2">
              <button
                  v-for="action in notification.actions"
                  :key="action.label"
                  @click.stop="handleAction(action)"
                  :class="['px-3 py-1 rounded-lg text-xs font-medium transition-colors',
                  action.type === 'primary'? 'bg-blue-600 text-white hover:bg-blue-700'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-slate-700 dark:text-white dark:hover:bg-slate-600'
                  ]"              >
                {{ action.label }}
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- پیام خالی -->
      <div
          v-if="filteredNotifications.length === 0"
          class="dark:bg-gray-800 rounded-xl p-12 text-center"
      >
        <div class="bg-gray-50 dark:bg-gray-800 rounded-xl p-12 text-center">
          <div class="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
            <i class="ti ti-bell-off text-2xl text-gray-400 dark:text-gray-500"></i>
          </div>
          <h3 class="text-lg font-semibold text-gray-700 dark:text-white mb-2">نوتیفیکیشنی وجود ندارد</h3>
          <p class="text-gray-600 dark:text-gray-300">در این دسته‌بندی نوتیفیکیشنی برای نمایش وجود ندارد.</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import {ref, computed, onMounted} from 'vue'
import {useNotificationStore} from "@/stores/notification.js";

const notifyStore = useNotificationStore()
const activeFilter = ref('all')

const filters = [
  {key: 'all', label: 'همه'},
  {key: 'profile', label: 'پروفایل'},
  {key: 'violation', label: 'تخلفات'},
  {key: 'system', label: 'سیستمی'}
]

const notifications = computed(() => notifyStore.notifications)

onMounted(async () => {
  await notifyStore.fetchNotifications()
})


const filteredNotifications = computed(() => {

  if (activeFilter.value === 'all') {
    return notifyStore.notifications
  }
  return notifyStore.notifications.filter(n => n.type === activeFilter.value)
})

const getNotificationIcon = (type) => {
  const icons = {
    profile: 'ti ti-user',
    violation: 'ti ti-alert-triangle',
    system: 'ti ti-settings',
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

const timeAgo = (dateString) => {

  const date = new Date(dateString) // تبدیل رشته به Date

  let diff = (Date.now() - date.getTime()) / 1000

  diff -= 12600
  if (diff < 60) return 'لحظاتی پیش'
  if (diff < 3600) return `${Math.floor(diff / 60)} دقیقه پیش`
  if (diff < 86400) return `${Math.floor(diff / 3600)} ساعت پیش`
  return `${Math.floor(diff / 86400)} روز پیش`
}

const handleMarkAsRead = async (id) => {

  await notifyStore.markAsRead(id)
}

const markAllAsRead = () => {

  notifyStore.markAllAsRead()
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
