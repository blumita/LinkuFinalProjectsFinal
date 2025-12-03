<template>
  <header class="fixed top-0 z-50 h-14 sm:h-16 w-full flex items-center justify-between px-3 sm:px-5 py-2 border-b bg-white dark:bg-slate-800 border-gray-200 dark:border-slate-700 transition-colors duration-300">

    <!-- Left: Logo & Sidebar Toggle -->
    <div class="flex items-center gap-2 sm:gap-3">
      <button @click="toggleSidebar" class="w-9 h-9 sm:w-11 sm:h-11 flex items-center justify-center rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors duration-300 group">
        <svg class="w-5 h-5 sm:w-6 sm:h-6 text-gray-600 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
        </svg>
      </button>
      <img src="@/assets/images/logo20.png" alt="Logo" class="hidden sm:block h-4 sm:h-5 w-auto transition-all duration-300 dark:brightness-0 dark:invert">
    </div>

    <!-- Right: Actions -->
    <div class="flex items-center gap-2 relative">
      <!-- Dark Mode -->
      <button @click="toggleDarkMode" class="w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors duration-300 group" title="تغییر حالت نمایش">
        <svg v-if="!isDarkMode" class="w-4 h-4 sm:w-5 sm:h-5 text-gray-600 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"></path>
        </svg>
        <svg v-else class="w-4 h-4 sm:w-5 sm:h-5 text-gray-600 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"></path>
        </svg>
      </button>

      <!-- Reports -->
      <router-link to="/reports" class="flex items-center hover:bg-gray-100 dark:hover:bg-slate-700 gap-2 px-3 lg:px-4 py-2 rounded-lg transition-colors duration-300 group" :class="{ 'bg-blue-600 hover:bg-blue-700 text-white': route.path === '/reports' }">
        <i class="ti ti-chart-bar text-xl text-gray-600 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" :class="{ 'text-white': route.path === '/reports' }"></i>
        <span class="text-sm font-medium hidden lg:block text-gray-700 dark:text-gray-300" :class="{ 'text-white': route.path === '/reports' }">گزارشات</span>
      </router-link>

      <!-- Notifications -->
      <div class="relative">
        <button @click="toggleNotifications" class="relative hover:bg-gray-100 dark:hover:bg-slate-700 p-2 rounded-xl transition-colors" :class="{ 'bg-blue-600 hover:bg-blue-700 text-white': isNotificationsOpen }">
          <i class="ti ti-bell text-xl text-gray-600 dark:text-gray-400" :class="{ 'text-white': isNotificationsOpen }"></i>
          <span v-if="unreadCount > 0" class="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold min-w-[18px] h-[18px] flex items-center justify-center rounded-full border-2 border-gray-200 dark:border-slate-700">
            {{ unreadCount > 99 ? '99+' : unreadCount }}
          </span>
        </button>

        <!-- Notifications Dropdown -->
        <transition name="fade">
          <div v-if="isNotificationsOpen" :class="notificationDropdownClasses">
            <!-- Mobile Header -->
            <div v-if="isMobileDetected" class="flex items-center justify-between p-4 border-b border-gray-200 dark:border-slate-700">
              <h2 class="text-lg font-bold text-gray-900 dark:text-white">اطلاعیه‌ها</h2>
              <button @click="isNotificationsOpen = false" class="w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 dark:bg-slate-800 hover:bg-gray-200 dark:hover:bg-slate-700 transition-colors">
                <i class="ti ti-x text-xl text-gray-600 dark:text-gray-400"></i>
              </button>
            </div>

            <!-- Desktop Header -->
            <div v-if="!isMobileDetected" class="p-4 border-b border-gray-200 dark:border-slate-700 flex items-center justify-between">
              <button @click="markAllAsRead" class="flex items-center gap-2 text-blue-600 text-sm hover:text-blue-700 transition-colors group">
                <i class="ti ti-check text-md rounded-sm p-0.5 group-hover:bg-blue-600 group-hover:text-white transition-colors transform group-hover:scale-105"></i>
              </button>
              <h3 class="font-medium text-gray-900 dark:text-white">اطلاعیه‌ها</h3>
            </div>

            <!-- Tabs -->
            <div :class="['flex border-b border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-900', isMobileDetected ? 'sticky top-0 z-10' : '']">
              <button v-for="tab in tabs" :key="tab.id" @click="activeTab = tab.id" :class="tabClasses(tab)">
                <span v-if="tab.count > 0" class="bg-red-500 text-white text-xs rounded-full px-2 py-0.5 font-bold min-w-[16px] h-4 flex items-center justify-center">{{ tab.count }}</span>
                {{ tab.name }}
                <i :class="tab.icon" class="text-sm"></i>
              </button>
            </div>

            <!-- Mark All Read (Mobile) -->
            <div v-if="isMobileDetected" class="p-4 border-b border-gray-200 dark:border-slate-700">
              <button @click="markAllAsRead" class="w-full flex items-center justify-center gap-2 text-blue-600 text-sm hover:text-blue-700 transition-colors group bg-blue-50 dark:bg-blue-900/20 py-3 rounded-lg">
                <i class="ti ti-check text-lg rounded-sm p-0.5 group-hover:bg-blue-600 group-hover:text-white transition-colors transform group-hover:scale-105"></i>
                <span>علامت‌گذاری همه به عنوان خوانده شده</span>
              </button>
            </div>

            <!-- Notifications List -->
            <div :class="['overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent dark:scrollbar-thumb-slate-600 space-y-2', isMobileDetected ? 'p-4 max-h-[60vh]' : 'p-2 max-h-96']">
              <div v-for="notification in filteredNotifications" :key="notification.id" @click="openNotification(notification)" :class="notificationItemClasses">
                <div class="flex items-start gap-3">
                  <div class="flex-1 text-right">
                    <p :class="['mb-1', isMobileDetected ? 'text-base' : 'text-sm', notification.isRead ? 'text-gray-500 dark:text-gray-500' : 'text-gray-900 dark:text-white font-medium']">{{ notification.title }}</p>
                    <p :class="['text-gray-500 dark:text-gray-500 mb-1', isMobileDetected ? 'text-sm' : 'text-xs']">{{ notification.description }}</p>
                    <div class="flex items-center justify-between">
                      <span :class="typeClasses(notification.type)">{{ getTypeName(notification.type) }}</span>
                      <span :class="['text-gray-500 dark:text-gray-500', isMobileDetected ? 'text-sm' : 'text-xs']">{{ timeAgo(notification.time) }}</span>
                    </div>
                  </div>
                  <div :class="['rounded-full mt-1.5 flex-shrink-0', isMobileDetected ? 'w-4 h-4' : 'w-3 h-3', notification.isRead ? 'bg-gray-100 dark:bg-slate-700' : 'bg-blue-600']"></div>
                </div>
              </div>

              <!-- Empty State -->
              <div v-if="filteredNotifications.length === 0" :class="['text-center text-gray-500 dark:text-gray-500 bg-white dark:bg-slate-800 rounded-lg', isMobileDetected ? 'p-8' : 'p-6']">
                <i :class="['ti ti-bell-off mb-2 block text-gray-500 dark:text-gray-500', isMobileDetected ? 'text-4xl' : 'text-3xl']"></i>
                <p :class="isMobileDetected ? 'text-base' : 'text-sm'">هیچ اطلاعیه‌ای در این دسته وجود ندارد</p>
              </div>
            </div>

            <!-- Footer -->
            <div :class="['border-t border-gray-200 dark:border-slate-700 text-center', isMobileDetected ? 'p-6' : 'p-4']">
              <router-link to="/notifications" @click="isNotificationsOpen = false" :class="['text-blue-600 hover:text-blue-700', isMobileDetected ? 'text-base' : 'text-sm']">مشاهده همه اطلاعیه‌ها</router-link>
            </div>
          </div>
        </transition>
      </div>

      <!-- Profile -->
      <div class="relative">
        <button @click="toggleProfile" class="hover:bg-gray-100 dark:hover:bg-slate-700 rounded-xl p-2 transition-colors" :class="{ 'bg-blue-600 hover:bg-blue-700 text-white': isProfileOpen }">
          <i class="ti ti-user text-xl text-gray-600 dark:text-gray-400" :class="{ 'text-white': isProfileOpen }"></i>
        </button>

        <!-- Profile Dropdown -->
        <transition name="fade">
          <div v-if="isProfileOpen" :class="profileDropdownClasses">
            <!-- Mobile Header -->
            <div v-if="isMobileDetected" class="flex items-center justify-between p-4 border-b border-gray-200 dark:border-slate-700">
              <h2 class="text-lg font-bold text-gray-900 dark:text-white">پروفایل کاربری</h2>
              <button @click="isProfileOpen = false" class="w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 dark:bg-slate-800 hover:bg-gray-200 dark:hover:bg-slate-700 transition-colors">
                <i class="ti ti-x text-xl text-gray-600 dark:text-gray-400"></i>
              </button>
            </div>

            <!-- User Info -->
            <div :class="['border-b border-gray-200 dark:border-slate-700 text-gray-900 dark:text-white space-y-4', isMobileDetected ? 'p-6' : 'p-6']">
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-sm px-3 py-2 rounded-full font-medium">
                  مدیر کل
                  <i class="ti ti-crown text-base"></i>
                </div>
                <div :class="['bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center', isMobileDetected ? 'w-16 h-16' : 'w-12 h-12']">
                  <i :class="['ti ti-user text-white', isMobileDetected ? 'text-2xl' : 'text-xl']"></i>
                </div>
              </div>

              <div class="text-right space-y-2">
                <div :class="['font-semibold text-gray-900 dark:text-white', isMobileDetected ? 'text-xl' : 'text-lg']">
                  {{ userStore.user?.name || 'مدیر سیستم' }}</div>
                <div :class="['text-gray-600 dark:text-gray-400', isMobileDetected ? 'text-base' : 'text-sm']">مدیر ارشد سیستم</div>
                <div :class="['text-gray-500 dark:text-gray-500 direction-ltr text-right', isMobileDetected ? 'text-sm' : 'text-xs']">
                  {{ userStore.user?.email || '' }}</div>
              </div>
            </div>

            <!-- Menu Items -->
            <ul :class="['text-right', isMobileDetected ? 'text-base' : 'text-sm']">
              <li>
                <router-link to="/settings" @click="isProfileOpen = false" :class="['flex items-center justify-between hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors duration-300', isMobileDetected ? 'px-6 py-6' : 'px-6 py-4']">
                  <span class="text-gray-900 dark:text-white font-medium">ویرایش پروفایل</span>
                  <i :class="['ti ti-user-edit text-gray-500 dark:text-gray-400', isMobileDetected ? 'text-xl' : 'text-lg']"></i>
                </router-link>
              </li>
              <li class="border-t border-gray-200 dark:border-slate-700">
                <a @click="logout" :class="['flex items-center justify-between hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors duration-300 group', isMobileDetected ? 'px-6 py-6' : 'px-6 py-4']">
                  <span class="text-red-600 dark:text-red-400 font-medium group-hover:text-red-700 dark:group-hover:text-red-300">خروج از حساب کاربری</span>
                  <i :class="['ti ti-logout text-red-500 dark:text-red-400 group-hover:text-red-600 dark:group-hover:text-red-300', isMobileDetected ? 'text-xl' : 'text-lg']"></i>
                </a>
              </li>
            </ul>
          </div>
        </transition>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, computed,getCurrentInstance } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useDarkMode } from '@/composables/useDarkMode'
import {useAuthStore} from "@/stores/auth.ts";
import {useUserStore} from "@/stores/user.ts";
import {useNotificationStore} from "@/stores/notification.ts";


interface Notification {
  id: number
  type: 'profile' | 'violation' | 'system'
  title: string
  description: string
  time: string
  isRead: boolean
  date: string
  details: string
}

interface Props {
  isCollapsed?: boolean
  isMobile?: boolean
}

defineOptions({
  name: 'HeaderComponent'
})

withDefaults(defineProps<Props>(), {
  isCollapsed: false,
  isMobile: false
})


const emit = defineEmits<{
  'toggle-sidebar': []
}>()
const {appContext} = getCurrentInstance()!
const axios = appContext.config.globalProperties.$axios
const router = useRouter()
const route = useRoute()
const { isDarkMode, toggleDarkMode, initDarkMode } = useDarkMode()

// Mobile detection
const isMobileDetected = ref(false)

const checkMobile = () => {
  isMobileDetected.value = window.innerWidth < 768
}

const toggleSidebar = () => {
  emit('toggle-sidebar')
}

// State
const isProfileOpen = ref(false)
const isNotificationsOpen = ref(false)
const activeTab = ref('all')
const userStore=useUserStore()
const notifyStore=useNotificationStore()
// Tabs
const tabs = ref([
  { id: 'all', name: 'همه', icon: 'ti ti-bell', count: 0 },
  { id: 'violation', name: 'تخلفات', icon: 'ti ti-alert-triangle', count: 0 }
])

// Sample notifications
/*const notifications = ref<Notification[]>([
  {
    id: 1, type: 'profile', title: 'پروفایل جدید ایجاد شد', description: 'کاربر محمد احمدی با موفقیت ثبت‌نام کرد',
    time: '10 دقیقه پیش', isRead: false, date: '1403/04/22',
    details: 'کاربر جدید با شناسه 12345 و شماره تلفن 09123456789 در سیستم ثبت شد.'
  },
  {
    id: 2, type: 'violation', title: 'گزارش تخلف جدید', description: 'تراکنش مشکوک در پروفایل ****2345 شناسایی شد',
    time: '30 دقیقه پیش', isRead: false, date: '1403/04/22',
    details: 'تراکنش با مبلغ 500,000 تومان در ساعت 14:30 انجام شده که نیاز به بررسی دارد.'
  },
  {
    id: 3, type: 'violation', title: 'گزارش تخلف مالی', description: 'فعالیت مشکوک در حساب کاربری شناسایی شد',
    time: '2 ساعت پیش', isRead: true, date: '1403/04/22',
    details: 'فعالیت غیرعادی در تراکنش‌ها شناسایی و گزارش شد.'
  },
  {
    id: 4, type: 'profile', title: 'تایید هویت انجام شد', description: 'احراز هویت کاربر علی رضایی تکمیل شد',
    time: '3 ساعت پیش', isRead: false, date: '1403/04/22',
    details: 'مدارک ارسالی بررسی و تایید شد. حساب کاربری فعال است.'
  }
])*/
const notifications=computed(()=>notifyStore.notifications)
const timeAgo = (dateString:string) => {

  const date = new Date(dateString) // تبدیل رشته به Date

  let diff = (Date.now() - date.getTime()) / 1000

  diff -= 12600
  if (diff < 60) return 'لحظاتی پیش'
  if (diff < 3600) return `${Math.floor(diff / 60)} دقیقه پیش`
  if (diff < 86400) return `${Math.floor(diff / 3600)} ساعت پیش`
  return `${Math.floor(diff / 86400)} روز پیش`
}
// Computed
const filteredNotifications = computed(() => {
  return activeTab.value === 'all'
    ? notifications.value
    : notifications.value.filter((n:any) => n.type === activeTab.value)
})

const unreadCount = computed(() => {
  return notifications.value.filter((n:any) => !n.isRead).length
})

// Classes
const notificationDropdownClasses = computed(() => [
  isMobileDetected.value
    ? 'fixed inset-0 bg-white dark:bg-slate-900 z-[100] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent dark:scrollbar-thumb-slate-600'
    : 'absolute top-12 left-0 w-96 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 shadow-lg rounded-lg overflow-hidden',
  'transition-all duration-300'
])

const profileDropdownClasses = computed(() => [
  isMobileDetected.value
    ? 'fixed inset-0 bg-white dark:bg-slate-900 z-[100] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent dark:scrollbar-thumb-slate-600'
    : 'absolute top-12 left-0 w-80 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 shadow-lg rounded-lg overflow-hidden',
  'transition-all duration-300'
])

const notificationItemClasses = computed(() => [
  'hover:bg-gray-100 dark:hover:bg-slate-700 cursor-pointer transition-colors duration-300 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg',
  isMobileDetected.value ? 'p-4' : 'p-3'
])

const tabClasses = (tab: { id: string; name: string; icon: string; count: number }) => [
  'flex-1 text-sm font-medium transition-colors duration-300 flex items-center justify-center gap-2 relative',
  isMobileDetected.value ? 'px-4 py-4' : 'px-4 py-3',
  activeTab.value === tab.id
    ? 'text-blue-600 bg-white dark:bg-slate-800 border-b-2 border-blue-600 shadow-sm'
    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-slate-700'
]

const typeClasses = (type: string) => [
  'px-2 py-1 rounded-full',
  isMobileDetected.value ? 'text-sm' : 'text-xs',
  {
    'bg-green-100 text-green-700': type === 'profile',
    'bg-red-100 text-red-700': type === 'violation',
    'bg-gray-100 text-gray-700': type === 'system'
  }
]

// Methods
const toggleProfile = () => {
  isProfileOpen.value = !isProfileOpen.value
  if (isNotificationsOpen.value) isNotificationsOpen.value = false
}

const toggleNotifications = () => {
  isNotificationsOpen.value = !isNotificationsOpen.value
  if (isProfileOpen.value) isProfileOpen.value = false
}

const markAllAsRead = () => {
  notifications.value.forEach((n:any) => n.isRead = true)
  updateTabCounts()
}

const openNotification =async (notification: Notification) => {

  await notifyStore.markAsRead(notification.id)
  notification.isRead = true

  updateTabCounts()
  isNotificationsOpen.value = false
  //router.push(`/notifications/${notification.id}`)
}

const updateTabCounts = () => {
  const allCount = notifications.value.filter((n:any) => !n.isRead).length
  const violationCount = notifications.value.filter((n:any) => !n.isRead && n.type === 'violation').length

  tabs.value[0].count = allCount
  tabs.value[1].count = violationCount
}

const getTypeName = (type: string) => {
  const names: Record<string, string> = {
    profile: 'پروفایل',
    violation: 'تخلف',
    system: 'سیستم'
  }
  return names[type] || 'عمومی'
}

const handleClickOutside = (event: Event) => {
  const target = event.target as HTMLElement
  if (!target.closest('.relative')) {
    isProfileOpen.value = false
    isNotificationsOpen.value = false
  }
}

onMounted(async () => {
  initDarkMode()
  checkMobile()
  
  // فقط وقتی لاگین هستیم اطلاعات یوزر و نوتیفیکیشن رو بگیر
  const authStore = useAuthStore()
  if (authStore.isAuthenticated) {
    await userStore.fetchUser()
    await notifyStore.fetchNotifications()
    updateTabCounts()
  }
  
  window.addEventListener('resize', checkMobile)
  document.addEventListener('click', handleClickOutside)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', checkMobile)
  document.removeEventListener('click', handleClickOutside)

})

const logout = async () => {
  try {
    const authStore = useAuthStore()

    try {
      // تلاش برای اطلاع‌رسانی به سرور (اما اگر خطا داد، مهم نیست)
      await axios.get('user/logout', { timeout: 3000 })
    } catch (error) {
      console.warn('Logout API call failed, continuing with local logout:', error)
    }

    // پاک کردن همه‌چیز (شامل localStorage و sessionStorage قدیمی)
    authStore.logout()

    // Redirect user to login
    await router.push('/auth/login')
  } catch (error: any) {
    // حتی اگر خطا داشت، کاربر را logout کن
    const authStore = useAuthStore()
    authStore.logout()
    await router.push('/auth/login')
  }
}
</script>


  <style scoped>
  .fade-enter-active, .fade-leave-active {
    transition: opacity 0.2s ease;
  }
  .fade-enter-from, .fade-leave-to {
    opacity: 0;
  }
  </style>
