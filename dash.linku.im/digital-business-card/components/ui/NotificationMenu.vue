<template>
  <div class="relative min-w-0">
    <button
        class="w-10 h-10 flex items-center justify-center text-gray-600 hover:text-black transition-colors rounded-lg hover:bg-gray-100 shrink-0"
        @click="open = !open"
        title="نوتیفیکیشن‌ها"
    >
      <i class="ti ti-bell text-xl"></i>
      <!-- نشانگر نوتیفیکیشن جدید -->
      <span v-if="unreadCount > 0" class="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse"></span>
    </button>

    <!-- دسکتاپ: منوی معمولی -->
    <div v-if="open && !isMobile"
         class="absolute left-0 mt-2 w-80 bg-white border border-gray-200 rounded-lg shadow-lg z-50 overflow-hidden">
      <div class="p-4 border-b border-gray-100">
        <h3 class="font-semibold text-gray-800 flex items-center gap-2">
          <i class="ti ti-bell text-lg"></i>
          نوتیفیکیشن‌ها
        </h3>
        <button
            v-if="unreadCount > 0"
            @click="notificationStore.markAllAsRead"
            class="text-xs text-blue-600 hover:text-blue-800"
        >
          علامت‌گذاری همه به عنوان خوانده شده
        </button>
      </div>

      <div class="max-h-64 overflow-y-auto">
        <div
            v-for="notif in notificationStore.notifications"
            :key="notif.id"
            class="p-4 hover:bg-gray-50 border-b border-gray-100 transition-colors cursor-pointer flex items-start gap-3"
            :class="[!notif.read ? 'border-r-4 border-blue-500 bg-blue-50': 'bg-white']"
            @click="notificationStore.markAsRead(notif.id)"
        >
          <div class="flex items-start gap-3">
            <div
                class="w-8 h-8 rounded-full flex items-center justify-center shrink-0"
                :class="iconBgClass(notif.type)"
            >
              <i :class="iconClass(notif.type)" class="text-sm"></i>
            </div>
            <div class="flex-1">
              <p class="text-sm font-medium text-gray-800">{{ notif.title }}</p>
              <p class="text-xs text-gray-600 mt-1">{{ notif.description }}</p>
              <span class="text-xs text-gray-400">
                {{ timeAgo(notif.createdAt) }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div class="p-3 border-t border-gray-100">
        <NuxtLink
            to="/dashboard/notifications"
            @click="open = false"
            class="w-full block text-center text-sm text-blue-600 hover:text-blue-800 transition-colors"
        >
          مشاهده همه نوتیفیکیشن‌ها
        </NuxtLink>
      </div>
    </div>

    <!-- موبایل: باتم شیت -->
    <UiBottomSheet
        :visible="open && isMobile"
        title="نوتیفیکیشن‌ها"
        :desktop-centered="false"
        height-class="max-h-[80vh]"
        content-padding="p-0"
        @close="open = false"
    >
      <div class="max-h-64 overflow-y-auto">
        <div
            v-for="notif in notificationStore.notifications"
            :key="notif.id"
            :class="['p-4 hover:bg-gray-50 border-b border-gray-100 transition-colors cursor-pointer',
                     !notif.read ? 'border-r-4 border-blue-500' : 'bg-white']"
            @click="handleMarkAsRead(notif.id)"
        >
          <div class="flex items-start gap-3">
            <div
                class="w-8 h-8 rounded-full flex items-center justify-center shrink-0"
                :class="iconBgClass(notif.type)"
            >
              <i :class="iconClass(notif.type)" class="text-sm"></i>
            </div>
            <div class="flex-1">
              <p class="text-sm font-medium text-gray-800">{{ notif.title }}</p>
              <p class="text-xs text-gray-600 mt-1">{{ notif.description }}</p>
              <span class="text-xs text-gray-400">
                {{ timeAgo(notif.createdAt) }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div class="p-3 border-t border-gray-100">
        <NuxtLink
            to="/dashboard/notifications"
            @click="open = false"
            class="w-full block text-center text-sm text-blue-600 hover:text-blue-800 transition-colors"
        >
          مشاهده همه نوتیفیکیشن‌ها
        </NuxtLink>
      </div>
    </UiBottomSheet>
  </div>
</template>

<script setup>
import {ref, onMounted, onBeforeUnmount} from 'vue'
import UiBottomSheet from '~/components/ui/BottomSheet.vue'
import {useNotificationStore} from "~/stores/notification.js";

const open = ref(false)
const isMobile = ref(false)
const notificationStore = useNotificationStore()
const unreadCount = computed(
    () => notificationStore.notifications?.length
        ? notificationStore.notifications.filter(n => !n.read).length
        : 0
)

onMounted(() => {
  notificationStore.fetchNotifications()
  const checkMobile = () => {
    isMobile.value = window.innerWidth < 768
  }
  checkMobile()
  window.addEventListener('resize', checkMobile)

  // بستن منو با کلیک بیرون
  const handleClickOutside = (event) => {
    if (open.value && !event.target.closest('.relative')) {
      open.value = false
    }
  }
  document.addEventListener('click', handleClickOutside)

  onBeforeUnmount(() => {
    window.removeEventListener('resize', checkMobile)
    document.removeEventListener('click', handleClickOutside)
  })
})

const handleMarkAsRead = async (id) => {
  await notificationStore.markAsRead(id)
}

// helpers
const iconClass = (type) => {
  switch (type) {
    case 'subscription':
      return 'ti ti-clock text-orange-600'
    case 'payment':
      return 'ti ti-check text-green-600'
    case 'system':
      return 'ti ti-refresh text-blue-600'
    case 'security':
      return 'ti ti-alert-circle text-red-600'
    case 'general':
      return 'ti ti-info-circle text-gray-600'
    default:
      return 'ti ti-bell text-gray-600'
  }
}

const iconBgClass = (type) => {
  switch (type) {
    case 'subscription':
      return 'bg-orange-100'
    case 'payment':
      return 'bg-green-100'
    case 'system':
      return 'bg-blue-100'
    case 'security':
      return 'bg-red-100'
    case 'general':
      return 'bg-gray-100'
    default:
      return 'bg-gray-100'
  }
}

const timeAgo = (date) => {
  const diff = (Date.now() - date.getTime()) / 1000
  if (diff < 60) return 'لحظاتی پیش'
  if (diff < 3600) return `${Math.floor(diff / 60)} دقیقه پیش`
  if (diff < 86400) return `${Math.floor(diff / 3600)} ساعت پیش`
  return `${Math.floor(diff / 86400)} روز پیش`
}
const toggleOpen = () => {
  open.value = !open.value
}
</script>
