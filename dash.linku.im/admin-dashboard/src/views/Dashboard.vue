<template>
  <div class="w-full h-full p-4 sm:p-6 lg:p-8 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent dark:scrollbar-thumb-slate-600">
    <!-- Header داشبورد -->
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
        <i class="ti ti-layout-dashboard text-blue-600"></i>
        داشبورد مدیریت
      </h1>
      <p class="text-gray-600 dark:text-gray-400 mt-2">خلاصه‌ای از آمار سیستم و عملکرد بخش‌های مختلف</p>
    </div>

    <!-- آمارهای کلی -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <!-- Skeleton Loader -->
      <template v-if="loading">
        <div v-for="i in 4" :key="i" class="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl p-6 animate-pulse">
          <div class="flex items-center justify-between mb-4">
            <div class="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
            <div class="text-right flex-1 ml-4">
              <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24 mb-2"></div>
              <div class="h-8 bg-gray-200 dark:bg-gray-700 rounded w-16"></div>
            </div>
          </div>
          <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-20"></div>
        </div>
      </template>

      <!-- کل پروفایل‌ها -->
      <div v-else class="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl p-6 hover:shadow-lg transition-shadow">
        <div class="flex items-center justify-between mb-4">
          <div class="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <i class="ti ti-users text-blue-600 dark:text-blue-400 text-2xl"></i>
          </div>
          <div class="text-right">
            <p class="text-sm font-medium text-gray-600 dark:text-gray-400">کل پروفایل‌ها</p>
            <p class="text-3xl font-bold text-gray-900 dark:text-white">{{ totalUsers }}</p>
          </div>
        </div>
        <div class="flex items-center gap-1">
          <i class="ti ti-arrow-up-right text-green-500"></i>
          <span class="text-sm text-green-600 dark:text-green-400">{{ activeUsers }} فعال</span>
        </div>
      </div>

      <!-- کل محصولات -->
      <div v-if="!loading" class="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl p-6 hover:shadow-lg transition-shadow">
        <div class="flex items-center justify-between mb-4">
          <div class="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
            <i class="ti ti-package text-green-600 dark:text-green-400 text-2xl"></i>
          </div>
          <div class="text-right">
            <p class="text-sm font-medium text-gray-600 dark:text-gray-400">انواع محصول</p>
            <p class="text-3xl font-bold text-gray-900 dark:text-white">{{ totalProducts }}</p>
          </div>
        </div>
        <div class="flex items-center gap-1">
          <i class="ti ti-check text-green-500"></i>
          <span class="text-sm text-green-600 dark:text-green-400">{{ activeProducts }} فعال</span>
        </div>
      </div>

      <!-- مدیران سیستم -->
      <div v-if="!loading" class="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl p-6 hover:shadow-lg transition-shadow">
        <div class="flex items-center justify-between mb-4">
          <div class="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
            <i class="ti ti-shield-check text-purple-600 dark:text-purple-400 text-2xl"></i>
          </div>
          <div class="text-right">
            <p class="text-sm font-medium text-gray-600 dark:text-gray-400">مدیران سیستم</p>
            <p class="text-3xl font-bold text-gray-900 dark:text-white">{{ totalAdmins }}</p>
          </div>
        </div>
        <div class="flex items-center gap-1">
          <i class="ti ti-user-check text-purple-500"></i>
          <span class="text-sm text-purple-600 dark:text-purple-400">{{ activeAdmins }} فعال</span>
        </div>
      </div>

      <!-- کارت‌های ایجاد شده -->
      <div v-if="!loading" class="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl p-6 hover:shadow-lg transition-shadow">
        <div class="flex items-center justify-between mb-4">
          <div class="p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
            <i class="ti ti-credit-card text-orange-600 dark:text-orange-400 text-2xl"></i>
          </div>
          <div class="text-right">
            <p class="text-sm font-medium text-gray-600 dark:text-gray-400">کارت‌های ایجاد شده</p>
            <p class="text-3xl font-bold text-gray-900 dark:text-white">{{ totalCards }}</p>
          </div>
        </div>
        <div class="flex items-center gap-1">
          <i class="ti ti-eye text-orange-500"></i>
          <span class="text-sm text-orange-600 dark:text-orange-400">{{ activeCards }} فعال</span>
        </div>
      </div>
    </div>

    <!-- گرید اصلی -->
    <div class="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-8">
      <!-- آمار کاربران -->
      <div class="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl overflow-hidden">
        <div class="p-6 border-b border-gray-200 dark:border-slate-700">
          <h3 class="font-bold text-lg text-gray-900 dark:text-white flex items-center gap-2">
            <i class="ti ti-users text-blue-600"></i>
            آمار کاربران
          </h3>
        </div>
        <div class="p-6">
          <div class="space-y-4">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-3">
                <div class="w-3 h-3 bg-green-500 rounded-full"></div>
                <span class="text-gray-700 dark:text-gray-300">کاربران فعال</span>
              </div>
              <span class="font-bold text-green-600 dark:text-green-400">{{ activeUsers }}</span>
            </div>
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-3">
                <div class="w-3 h-3 bg-blue-500 rounded-full"></div>
                <span class="text-gray-700 dark:text-gray-300">کاربران ادمین</span>
              </div>
              <span class="font-bold text-blue-600 dark:text-blue-400">{{ adminUsers }}</span>
            </div>
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-3">
                <div class="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <span class="text-gray-700 dark:text-gray-300">کاربران معلق</span>
              </div>
              <span class="font-bold text-yellow-600 dark:text-yellow-400">{{ suspendedUsers }}</span>
            </div>
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-3">
                <div class="w-3 h-3 bg-red-500 rounded-full"></div>
                <span class="text-gray-700 dark:text-gray-300">کاربران غیرفعال</span>
              </div>
              <span class="font-bold text-red-600 dark:text-red-400">{{ inactiveUsers }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- آمار محصولات و کارت‌ها -->
      <div class="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl overflow-hidden">
        <div class="p-6 border-b border-gray-200 dark:border-slate-700">
          <h3 class="font-bold text-lg text-gray-900 dark:text-white flex items-center gap-2">
            <i class="ti ti-package text-green-600"></i>
            آمار محصولات
          </h3>
        </div>
        <div class="p-6">
          <div class="space-y-4">
            <div class="flex items-center justify-between">
              <span class="text-gray-700 dark:text-gray-300">انواع محصول فعال</span>
              <span class="font-bold text-green-600 dark:text-green-400">{{ activeProducts }}</span>
            </div>
            <div class="flex items-center justify-between">
              <span class="text-gray-700 dark:text-gray-300">کارت‌های ایجاد شده</span>
              <span class="font-bold text-blue-600 dark:text-blue-400">{{ totalCards }}</span>
            </div>
            <div class="flex items-center justify-between">
              <span class="text-gray-700 dark:text-gray-300">کارت‌های فعال</span>
              <span class="font-bold text-purple-600 dark:text-purple-400">{{ activeCards }}</span>
            </div>
            <div class="flex items-center justify-between">
              <span class="text-gray-700 dark:text-gray-300">مدیران سیستم</span>
              <span class="font-bold text-orange-600 dark:text-orange-400">{{ totalAdmins }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- دسترسی سریع -->
    <div class="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl overflow-hidden">
      <div class="p-6 border-b border-gray-200 dark:border-slate-700">
        <h3 class="font-bold text-lg text-gray-900 dark:text-white flex items-center gap-2">
          <i class="ti ti-bolt text-yellow-600"></i>
          دسترسی سریع
        </h3>
      </div>
      <div class="p-6">
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <router-link
            to="/users"
            class="flex items-center gap-3 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors group"
          >
            <div class="w-10 h-10 bg-blue-600 text-white rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
              <i class="ti ti-users"></i>
            </div>
            <div>
              <p class="font-medium text-gray-900 dark:text-white">مدیریت کاربران</p>
              <p class="text-sm text-gray-600 dark:text-gray-400">{{ totalUsers }} کاربر</p>
            </div>
          </router-link>

          <router-link
            to="/admins"
            class="flex items-center gap-3 p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-colors group"
          >
            <div class="w-10 h-10 bg-purple-600 text-white rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
              <i class="ti ti-shield-check"></i>
            </div>
            <div>
              <p class="font-medium text-gray-900 dark:text-white">مدیریت مدیران</p>
              <p class="text-sm text-gray-600 dark:text-gray-400">{{ totalAdmins }} مدیر</p>
            </div>
          </router-link>

          <router-link
            to="/cards/management"
            class="flex items-center gap-3 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors group"
          >
            <div class="w-10 h-10 bg-green-600 text-white rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
              <i class="ti ti-package"></i>
            </div>
            <div>
              <p class="font-medium text-gray-900 dark:text-white">مدیریت محصولات</p>
              <p class="text-sm text-gray-600 dark:text-gray-400">{{ totalProducts }} محصول</p>
            </div>
          </router-link>

          <router-link
            to="/cards"
            class="flex items-center gap-3 p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg hover:bg-orange-100 dark:hover:bg-orange-900/30 transition-colors group"
          >
            <div class="w-10 h-10 bg-orange-600 text-white rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
              <i class="ti ti-credit-card"></i>
            </div>
            <div>
              <p class="font-medium text-gray-900 dark:text-white">مدیریت کارت‌ها</p>
              <p class="text-sm text-gray-600 dark:text-gray-400">{{ totalCards }} کارت</p>
            </div>
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {ref, computed, onMounted} from "vue"
import {useCardsStore} from "@/stores/cards.ts";
import {useProductStore} from "@/stores/product.ts";
import {useUserStore} from "@/stores/user.ts";

defineOptions({
  name: "DashboardView"
})


const cardStore = useCardsStore();
const totalCards = computed(() => cardStore.totalCards)
const activeCards = computed(() => cardStore.activeCardsCount)

const productStore = useProductStore();
const totalProducts = computed(() => productStore.totalProducts)
const activeProducts = computed(() => productStore.activeProducts)
const inactiveProducts = computed(() => productStore.inactiveProducts)

const userStore = useUserStore();

const totalUsers = computed(() => userStore.totalUsers)
const activeUsers = computed(() => userStore.activeUsers)
const adminUsers = computed(() => userStore.adminUsers)
const suspendedUsers = computed(() => userStore.suspendedUsers)
const inactiveUsers = computed(() => userStore.inactiveUsers)
const totalAdmins = computed(() => userStore.adminUsers)
const activeAdmins = computed(() => userStore.activeAdmins)

const loading = ref(true)

onMounted(async () => {
  try {
    // Load data in parallel for better performance
    await Promise.all([
      userStore.fetchAllUsers(),
      cardStore.fetchCards(),
      productStore.fetchProducts()
    ])
  } finally {
    loading.value = false
  }
})

</script>
