<script setup lang="ts">
import {ref, provide, computed, onMounted, watch} from 'vue'
import {useRoute} from 'vue-router'
import Topbar from '~/components/UserDashboard/main/header/index.vue'
import MobileHeader from '~/components/UserDashboard/main/MobileHeader.vue'
import BottomNavigation from '~/components/UserDashboard/main/BottomNavigation.vue'
import ShareModal from '~/components/UserDashboard/modals/ShareModal.vue'
import CardSelect from '~/components/UserDashboard/main/header/CardSelect.vue'
import {useUserStore} from "~/stores/user";
import {useAuthStore} from "~/stores/auth";
import {useFormStore} from "~/stores/form";
import {navigateTo, useNuxtApp} from "#app";

const userStore = useUserStore()
const authStore = useAuthStore()
const formStore = useFormStore()
const {$axios} = useNuxtApp()
const route = useRoute()

// صفحاتی که هدر خودشان را دارند
const pagesWithOwnHeader = computed(() => {
  return route.path.includes('/notifications') || 
         route.path.includes('/inbox') ||
         route.path.includes('/QR') ||
         route.path.includes('/profile/CustomizeQRPage') ||
         route.path.includes('/profile/CustomizeLinkPage') ||
         route.path.includes('/profile/lead-capture') ||
         route.path.includes('/dashboard/activate') ||
         route.path.includes('/dashboard/support') ||
         route.path.includes('/dashboard/transactions') ||
         route.path.includes('/dashboard/rewards') ||
         route.path.includes('/financial') ||
         route.path.includes('/settings') ||
         route.path.includes('/rewards')
})

// صفحاتی که bottom navigation ندارند
const hideBottomNav = computed(() => {
  return route.path.includes('/checkout/order') ||
         route.path.includes('/QR') ||
         route.path.includes('/profile/CustomizeQRPage') ||
         route.path.includes('/dashboard/edit-card') ||
         route.path.includes('/dashboard/activate')
})

// بارگذاری اطلاعات کاربر فقط اگر لاگین کرده
onMounted(async () => {
  authStore.hydrateToken()
  if (authStore.isAuthenticated) {
    await userStore.fetchUser()
    formStore.cards = userStore.cards
  } else {
    navigateTo('/auth/login')
  }
})
// وضعیت مدال اشتراک‌گذاری
const showModal = ref(false)

// متغیر سرچ
const searchQuery = ref('')

// اطلاعات کاربر نمونه (برای لوگو و ... می‌تونی از API پرش کنی)
/*const user = ref({
  logo: '/logo/user-logo.png'
})*/

// کانفیگ هوشمند هدر بر اساس صفحه
const getPageConfig = (routePath: string) => {
  // بررسی مسیرهای پویا با پارامتر اول
  if (routePath.includes('/edit-card')) {
    return {
      title: 'ویرایش پروفایل',
      showBack: true,
      userName: userStore.user?.name,
      showSearch: false,
      showMore: true,
      showNotifications: false,
      showShare: true,
      showAddCard: false,
      showCardSelect: false,
      showStateSelect: false
    }
  }

  if (routePath.includes('/add-card')) {
    return {
      title: 'افزودن پروفایل جدید',
      showBack: true,
      userName: userStore.user?.name,
      showSearch: false,
      showMore: false,
      showNotifications: false,
      showShare: false,
      showAddCard: false,
      showCardSelect: false,
      showStateSelect: false
    }
  }

  const configs = {
    // صفحه فعال‌سازی کارت (باید قبل از /dashboard باشه)
    '/dashboard/activate': {
      title: 'فعال‌سازی کارت',
      showBack: true,
      userName: userStore.user?.name,
      showSearch: false,
      showMore: false,
      showNotifications: false,
      showShare: false,
      showAddCard: false,
      showCardSelect: false,
      showStateSelect: false
    },

    // صفحه اصلی داشبورد 
    '/dashboard/dashboard': {
      title: 'پروفایل‌های من',
      showBack: false,
      userName: userStore.user?.name,
      showSearch: true,
      showMore: true,
      showNotifications: true,
      showShare: false,
      showAddCard: true,
      showCardSelect: true,
      showStateSelect: false
    },

    // صفحه تحلیل‌ها
    '/dashboard/insights': {
      title: 'تحلیل و آمار',
      showBack: true,
      userName: userStore.user?.name,
      showSearch: false,
      showMore: false,
      showNotifications: true,
      showShare: false,
      showAddCard: false,
      showCardSelect: true,
      showStateSelect: false
    },

    // صفحه نوتیفیکیشن‌ها
    '/dashboard/notifications': {
      title: 'اعلان‌ها',
      showBack: true,
      userName: userStore.user?.name,
      showSearch: false,
      showMore: false,
      showNotifications: false,
      showShare: false,
      showAddCard: false,
      showCardSelect: false,
      showStateSelect: false
    },

    // صفحه پشتیبانی
    '/dashboard/support': {
      title: 'پشتیبانی',
      showBack: true,
      userName: userStore.user?.name,
      showSearch: false,
      showMore: false,
      showNotifications: false,
      showShare: false,
      showAddCard: false,
      showCardSelect: false,
      showStateSelect: false
    },

    // صفحه تراکنش‌ها
    '/dashboard/transactions': {
      title: 'تراکنش‌ها',
      showBack: true,
      userName: userStore.user?.name,
      showSearch: false,
      showMore: false,
      showNotifications: false,
      showShare: false,
      showAddCard: false,
      showCardSelect: false,
      showStateSelect: true
    },

    // صفحه خرید اشتراک
    '/dashboard/upgrade': {
      title: 'خرید اشتراک',
      showBack: true,
      userName: userStore.user?.name,
      showSearch: false,
      showMore: false,
      showNotifications: false,
      showShare: false,
      showAddCard: false,
      showCardSelect: false,
      showStateSelect: false
    },

    // صفحه اصلی (root dashboard) - باید آخر باشه
    '/dashboard': {
      title: 'پروفایل‌های من',
      showBack: false,
      userName: userStore.user?.name,
      showSearch: true,
      showMore: true,
      showNotifications: true,
      showShare: false,
      showAddCard: true,
      showCardSelect: true,
      showStateSelect: false
    },

    // صفحه تنظیمات
    '/settings': {
      title: 'تنظیمات',
      showBack: true,
      userName: userStore.user?.name,
      showSearch: false,
      showMore: false,
      showNotifications: false,
      showShare: false,
      showAddCard: false,
      showCardSelect: false,
      showStateSelect: false
    },

    // صفحه صندوق دریافتی
    '/inbox': {
      title: 'صندوق دریافتی',
      showBack: true,
      userName: userStore.user?.name,
      showSearch: false,
      showMore: false,
      showNotifications: false,
      showShare: false,
      showAddCard: false,
      showCardSelect: false,
      showStateSelect: false
    },

    // صفحه وضعیت حساب
    '/settings/account-status': {
      title: 'وضعیت حساب',
      showBack: true,
      userName: userStore.user?.name,
      showSearch: false,
      showMore: false,
      showNotifications: false,
      showShare: false,
      showAddCard: false,
      showCardSelect: false,
      showStateSelect: false
    }
  }

  // اگر مسیر دقیق پیدا نشد، بررسی کن که آیا با prefix شروع می‌شه
  for (const [path, config] of Object.entries(configs)) {
    if (routePath.startsWith(path)) {
      return config
    }
  }

  // کانفیگ پیش‌فرض
  return {
    title: 'داشبورد',
    showBack: false,
    userName: userStore.user?.name,
    showSearch: false,
    showMore: true,
    showNotifications: true,
    showShare: false,
    showAddCard: false,
    showCardSelect: false,
    showStateSelect: false
  }
}

// کانفیگ reactive بر اساس route
const topbarConfig = computed(() => getPageConfig(route.path))

const slug = route.params.slug

const selectedCard = ref({})

function openShareModal(card: any) {
  selectedCard.value = card
  showModal.value = true
}

const handleAction = (action: any) => {
  switch (action) {
    case 'show-profile':
      showProfile(formStore.defaultCard?.slug)
      break
    case 'open-share':
      openShareModal(formStore.defaultCard)
      break
    default:
  }
}

const showProfile = (slug:any) => {
  const params = new URLSearchParams()
  params.set('t', Date.now().toString())
  const url = `${window.location.origin}/preview/${slug}?${params.toString()}`

  // باز کردن در تب جدید:
  window.open(url, '_blank')
}


// انتقال کانفیگ هدر به دیگر کامپوننت‌ها در صورت نیاز
provide('topbarConfig', topbarConfig)
</script>

<template>
  <div class="flex bg-background min-h-screen overflow-hidden transition-colors duration-300">

    <!-- ✅ Main Content -->
    <div class="flex-1 flex flex-col relative">

      <!-- ✅ Mobile Header - فقط در صفحاتی که هدر خودشان ندارند -->
      <MobileHeader v-if="!pagesWithOwnHeader" />

      <!-- ✅ Topbar - فقط دسکتاپ (hidden) -->
      <Topbar
          v-bind="topbarConfig"
          v-model:search="searchQuery"
          :userLogo="userStore.user?.avatar||''"
          :userPhone="userStore.user.phone||''"
          :cardSlug="formStore.defaultCard?.slug"
          :qrBgColor="formStore.defaultCard?.qrBgColor"
          :qrColor="formStore.defaultCard?.qrColor"
          @open-share="openShareModal"
          @action="handleAction"
      >
        <template #card-select>
          <ClientOnly>
            <CardSelect/>
          </ClientOnly>
        </template>
      </Topbar>

      <!-- ✅ Main Scrollable Area -->
      <div class="flex-1 overflow-y-auto lg:pb-4"
           :class="[
             pagesWithOwnHeader ? 'pt-0' : 'pt-20',
             hideBottomNav ? 'pb-0' : 'pb-20',
             route.path.includes('/checkout') || hideBottomNav ? '' : 'lg:px-4 px-2'
           ]">
        <NuxtPage :search="searchQuery" @open-share="openShareModal"/>
      </div>

      <!-- ✅ Bottom Navigation - فقط موبایل و تبلت -->
      <BottomNavigation 
        v-if="!hideBottomNav"
        @open-share="openShareModal(formStore.defaultCard)"
      />
    </div>

    <!-- ✅ Share Modal -->
    <ShareModal :visible="showModal" :card="selectedCard" @close="showModal = false"/>
  </div>
</template>
