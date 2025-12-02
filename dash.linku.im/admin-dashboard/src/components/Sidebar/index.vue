<script setup lang="ts">
import { inject, computed, ref, defineOptions, watch } from 'vue'
import { useRoute } from 'vue-router'
import SidebarItem from './SidebarItem.vue'
import LinkuLogo from '@/assets/images/linku.svg'

defineOptions({
  name: 'SidebarMenu'
})

interface Props {
  isMobile?: boolean
  isCollapsed?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  isMobile: false,
  isCollapsed: false
})

const emit = defineEmits<{
  closeSidebar: []
}>()

const injectedIsCollapsed = inject('isCollapsed') as { value: boolean } | undefined
const isCollapsed = computed(() => props.isCollapsed ?? injectedIsCollapsed?.value ?? false)
const itemCollapsed = computed(() => props.isMobile ? false : isCollapsed.value)

// Get current route to check if premium items are active
const route = useRoute()

// Check if any premium route is active
const isPremiumActive = computed(() => {
  return route.path === '/subscriptions' || route.path === '/pages'
})

// State for collapsible menus
const premiumMenuOpen = ref(false)

const togglePremiumMenu = () => {
  if (!itemCollapsed.value) {
    premiumMenuOpen.value = !premiumMenuOpen.value
  }
}

// Handle item click and close mobile sidebar
const handleItemClick = () => {
  if (props.isMobile) {
    emit('closeSidebar')
  }
}

// Close submenu when sidebar collapses
watch(itemCollapsed, (newValue) => {
  if (newValue) {
    premiumMenuOpen.value = false
  }
})

// Auto-open premium menu if we're on a premium page
watch(() => route.path, (newPath) => {
  if ((newPath === '/subscriptions' || newPath === '/pages') && !itemCollapsed.value) {
    premiumMenuOpen.value = true
  }
}, { immediate: true })
</script>

<template>
  <aside
    :class="[
      'fixed top-0 min-h-screen py-4 px-4 flex flex-col',
      'bg-white dark:bg-slate-800 border-l border-gray-200 dark:border-slate-700',
      'transition-all duration-300 overflow-hidden',
      // Mobile: full height overlay with high z-index
      props.isMobile ? 'z-[60] w-64 h-screen' : 'z-40 top-16',
      // Mobile: slide in/out with translateX
      props.isMobile
        ? (isCollapsed ? 'translate-x-full' : 'translate-x-0')
        : '',
      // Desktop: width animation
      !props.isMobile ? (isCollapsed ? 'w-20' : 'w-60') : ''
    ]"
    :style="props.isMobile ? 'right: 0; max-height: 100vh;' : 'right: 0; max-height: calc(100vh - 4rem);'"
  >
    <!-- Mobile Header with Logo -->
    <div v-if="props.isMobile" class="flex justify-between items-center mb-6 pt-2 pb-4 border-b border-gray-200 dark:border-slate-600 flex-shrink-0">
      <div class="flex items-center gap-3">
        <img :src="LinkuLogo" alt="Linku" class="w-8 h-8 transition-all duration-300 dark:brightness-0 dark:invert">
        <span class="text-lg font-bold text-blue-600 dark:text-blue-400">Linku</span>
      </div>
      <button
        @click="emit('closeSidebar')"
        class="w-8 h-8 flex items-center justify-center rounded-full bg-red-50 hover:bg-red-100 dark:bg-red-900/20 dark:hover:bg-red-900/40 text-red-500 dark:text-red-400 transition-all duration-200 hover:scale-110"
      >
        <i class="ti ti-x text-lg"></i>
      </button>
    </div>

    <!-- Scrollable Content -->
    <div class="flex-1 overflow-y-auto overflow-x-hidden scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent dark:scrollbar-thumb-slate-600 hover:scrollbar-thumb-gray-400 dark:hover:scrollbar-thumb-slate-500">
      <nav :class="[
        itemCollapsed ? 'space-y-1' : 'space-y-2',
        'text-sm font-medium text-right'
      ]">
      <SidebarItem icon="ti ti-layout-grid" text="پیشخوان" :collapsed="itemCollapsed" to="/" @itemClicked="handleItemClick" />
      <SidebarItem icon="ti ti-user-circle" text="مدیریت پروفایل‌ها" :collapsed="itemCollapsed" to="/users" @itemClicked="handleItemClick" />
      <SidebarItem icon="ti ti-credit-card" text="مدیریت کارت‌ها" :collapsed="itemCollapsed" to="/cards" @itemClicked="handleItemClick" />
      <SidebarItem icon="ti ti-settings" text="مدیریت محصولات" :collapsed="itemCollapsed" to="/cards/management" @itemClicked="handleItemClick" />
      <SidebarItem icon="ti ti-users" text="مدیریت مدیران" :collapsed="itemCollapsed" to="/admins" @itemClicked="handleItemClick" />
      <SidebarItem icon="ti ti-shield-lock" text="مدیریت نقش‌ها" :collapsed="itemCollapsed" to="/roles" @itemClicked="handleItemClick" />

      <!-- جداکننده -->
      <div class="py-2">
        <div :class="[
          'border-t',
          props.isMobile ? 'border-white/20' : 'border-gray-200 dark:border-slate-700'
        ]"></div>
      </div>

      <!-- اشتراک ویژه با زیرمنو -->
      <div class="space-y-1">
        <!-- Premium Menu Header -->
        <div
          @click="togglePremiumMenu"
          :class="[
            'flex items-center px-4 py-3 rounded-lg transition-all duration-300 cursor-pointer',
            isPremiumActive
              ? 'bg-blue-600 text-white shadow-md'
              : 'hover:bg-gray-100 dark:hover:bg-slate-700 text-gray-900 dark:text-white',
            itemCollapsed ? 'justify-center' : 'justify-between'
          ]"
        >
          <div :class="['flex items-center', itemCollapsed ? 'justify-center' : 'gap-3']">
            <i :class="[
              'ti ti-crown text-lg',
              isPremiumActive ? 'text-white' : 'text-gray-600 dark:text-gray-400',
              'transition-colors duration-300'
            ]"></i>
            <span v-if="!itemCollapsed" class="font-medium">اشتراک ویژه</span>
          </div>
          <i
            v-if="!itemCollapsed"
            :class="[
              'ti ti-chevron-down transition-transform duration-300',
              isPremiumActive ? 'text-white' : 'text-gray-600 dark:text-gray-400',
              premiumMenuOpen ? 'rotate-180' : ''
            ]"
          ></i>
        </div>

        <!-- Premium Submenu with Smooth Animation -->
        <div
          :class="[
            'overflow-hidden transition-all duration-300 ease-in-out',
            itemCollapsed ? 'max-h-0' : (premiumMenuOpen ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0')
          ]"
        >
          <div class="space-y-1 pt-1">
            <SidebarItem
              icon="ti ti-star"
              text="مدیریت اشتراک"
              :collapsed="false"
              to="/subscriptions"
              class=" text-sm"
              @itemClicked="handleItemClick"
            />
            <SidebarItem
              icon="ti ti-sparkles"
              text="ویژگی‌ها"
              :collapsed="false"
              to="/features"
              class=" text-sm"
              @itemClicked="handleItemClick"
            />
          </div>
        </div>
      </div>

      <!-- سایر منوها -->
      <SidebarItem icon="ti ti-bell-ringing" text="ارسال نوتیفیکیشن" :collapsed="itemCollapsed" to="/notifications/send" @itemClicked="handleItemClick" />
      <SidebarItem icon="ti ti-discount" text="کدهای تخفیف" :collapsed="itemCollapsed" to="/discounts" @itemClicked="handleItemClick" />
      <SidebarItem icon="ti ti-credit-card" text="تراکنش‌ها" :collapsed="itemCollapsed" to="/transactions" @itemClicked="handleItemClick" />
      <SidebarItem icon="ti ti-report" text="گزارشات" :collapsed="itemCollapsed" to="/reports" @itemClicked="handleItemClick" />
    </nav>

      <!-- Footer section -->
      <div class="mt-4 pt-4">
        <div :class="[
          'mb-4 border-t',
          props.isMobile ? 'border-white/20' : 'border-gray-200 dark:border-slate-700'
        ]"></div>
        <div :class="[itemCollapsed ? 'space-y-1' : 'space-y-2']">
          <SidebarItem icon="ti ti-database-export" text="پشتیبان‌گیری" :collapsed="itemCollapsed" to="/backup" @itemClicked="handleItemClick" />
          <SidebarItem icon="ti ti-video" text="ویدیوهای آموزشی" :collapsed="itemCollapsed" to="/tutorials" @itemClicked="handleItemClick" />
          <SidebarItem icon="ti ti-settings" text="تنظیمات سیستم" :collapsed="itemCollapsed" to="/settings" @itemClicked="handleItemClick" />
          <SidebarItem icon="ti ti-question-mark" text="پرسش‌های متداول" :collapsed="itemCollapsed" to="/faqs" @itemClicked="handleItemClick"/>
          <SidebarItem icon="ti ti-help" text="راهنما" :collapsed="itemCollapsed" to="/guide" @itemClicked="handleItemClick" />
        </div>
      </div>
    </div>
  </aside>
</template>
