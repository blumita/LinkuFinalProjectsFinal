<template>
  <div class="w-full p-4 sm:p-6 lg:p-8">
    <div class="mb-8">
      <h1 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">مدیریت طرح‌های اشتراک</h1>
      <p class="text-gray-600 dark:text-gray-400">ایجاد و مدیریت طرح‌های اشتراک ویژه</p>
    </div>

    <!-- Stats Cards -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
      <div class="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
        <div class="flex items-center">
          <div class="p-3 rounded-full bg-amber-100 dark:bg-amber-900">
            <i class="ti ti-crown text-amber-600 dark:text-amber-400 text-xl"></i>
          </div>
          <div class="mr-4">
            <p class="text-sm font-medium text-gray-600 dark:text-gray-400">اعضای ویژه</p>
            <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ stats.premiumMembers }}</p>
          </div>
        </div>
      </div>

      <div class="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
        <div class="flex items-center">
          <div class="p-3 rounded-full bg-green-100 dark:bg-green-900">
            <i class="ti ti-currency-rial text-green-600 dark:text-green-400 text-xl"></i>
          </div>
          <div class="mr-4">
            <p class="text-sm font-medium text-gray-600 dark:text-gray-400">درآمد ماهانه</p>
            <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ formatCurrency(stats.monthlyRevenue) }}</p>
          </div>
        </div>
      </div>

      <div class="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
        <div class="flex items-center">
          <div class="p-3 rounded-full bg-blue-100 dark:bg-blue-900">
            <i class="ti ti-shopping-cart text-blue-600 dark:text-blue-400 text-xl"></i>
          </div>
          <div class="mr-4">
            <p class="text-sm font-medium text-gray-600 dark:text-gray-400">خرید این ماه</p>
            <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ stats.monthlyPurchases }}</p>
          </div>
        </div>
      </div>

      <div class="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
        <div class="flex items-center">
          <div class="p-3 rounded-full bg-purple-100 dark:bg-purple-900">
            <i class="ti ti-package text-purple-600 dark:text-purple-400 text-xl"></i>
          </div>
          <div class="mr-4">
            <p class="text-sm font-medium text-gray-600 dark:text-gray-400">طرح‌های فعال</p>
            <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ planStore.activePlansCount }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Plans Management -->
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
      <div class="p-6 border-b border-gray-200 dark:border-gray-700">
        <div class="flex justify-between items-center">
          <h2 class="text-lg font-semibold text-gray-900 dark:text-white">طرح‌های اشتراک</h2>
          <router-link
              to="/subscriptions/create"
              class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors inline-flex items-center gap-2"
          >
            <i class="ti ti-plus"></i>
            طرح جدید
          </router-link>
        </div>
      </div>

      <div class="p-6">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div
              v-for="plan in plans"
              :key="plan.id"
              class="bg-gray-50 dark:bg-gray-900 rounded-lg p-6 border border-gray-200 dark:border-gray-700 relative group hover:shadow-md transition-all"
          >
            <div class="flex justify-between items-start mb-4">
              <div>
                <h3 class="text-lg font-bold text-gray-900 dark:text-white">{{ plan.title }}</h3>
                <p class="text-sm text-gray-600 dark:text-gray-400">{{ plan.subtitle }}</p>
              </div>
              <div class="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <router-link
                    :to="`/subscriptions/${plan.id}/edit`"
                    class="p-1 text-blue-600 hover:bg-blue-100 dark:hover:bg-blue-900/20 rounded transition-colors"
                >
                  <i class="ti ti-edit text-sm"></i>
                </router-link>
                <button
                    @click="deletePlan(plan)"
                    class="p-1 text-red-600 hover:bg-red-100 dark:hover:bg-red-900/20 rounded transition-colors"
                >
                  <i class="ti ti-trash text-sm"></i>
                </button>
              </div>
            </div>

            <div class="mb-4">
              <div class="flex items-baseline mb-2">
                <span class="text-2xl font-bold text-gray-900 dark:text-white">{{ formatCurrency(plan.price) }}</span>
                <span class="text-sm text-gray-600 dark:text-gray-400 mr-1">/ {{ plan.duration }}</span>
              </div>
            </div>

            <div class="space-y-2 mb-4">
              <div
                  v-for="feature in planStore.featurePlan(plan.id)"
                  :key="feature.id"
                  class="flex items-center text-sm text-gray-700 dark:text-gray-300"
              >
                <i class="ti ti-check text-green-600 dark:text-green-400 ml-2"></i>
                {{ feature.title }}
              </div>
            </div>

            <div class="flex items-center justify-between mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
              <div class="flex items-center gap-2">
                <span
                    :class="[
        'px-2 py-1 text-xs rounded-full',
        plan.active === 'active'
          ? 'bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-400'
          : plan.active === 'inactive'
          ? 'bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-400'
          : 'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-400'
      ]"
                >
                 {{
                    plan.active === 'active'
                        ? 'فعال'
                        : plan.active === 'inactive'
                            ? 'غیرفعال'
                            : plan.active === 'draft'
                                ? 'پیش‌نویس'
                                : 'نامشخص'
                  }}
                </span>
              </div>
              <span class="text-sm text-gray-500 dark:text-gray-400">
                0 عضو
              </span>
            </div>
          </div>
        </div>

        <!-- Empty State -->
        <div v-if="plans.length === 0" class="text-center py-12">
          <i class="ti ti-package text-6xl text-gray-400 dark:text-gray-600 mb-4"></i>
          <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">هنوز طرحی ایجاد نشده</h3>
          <p class="text-gray-600 dark:text-gray-400 mb-4">اولین طرح اشتراک خود را ایجاد کنید</p>
          <router-link
              to="/subscriptions/create"
              class="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors inline-flex items-center gap-2"
          >
            <i class="ti ti-plus"></i>
            ایجاد طرح جدید
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {ref, reactive, computed, onMounted, watch} from 'vue'
import {useAlert} from '@/composables/useAlert'
import {usePlanStore} from "@/stores/plan.ts";
import type {Plan} from "@/stores/plan.ts";
import {useSubscriptionStatsStore} from "@/stores/subscriptionStats.ts";

const {showAlert} = useAlert()

// Stats
interface Stats {
  premiumMembers: number
  monthlyRevenue: number
  monthlyPurchases: number
  activeDiscounts: number
}
const planStore = usePlanStore()
const plans = computed(() => planStore.plans)
// Functions
const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('fa-IR').format(amount) + ' تومان'
}

const deletePlan = async (plan:Plan) => {
  if (confirm(`آیا از حذف طرح "${plan.title}" اطمینان دارید؟`)) {
    const index = plans.value.findIndex(p => p.id === plan.id)
    if (index !== -1) {
      const res = await planStore.deletePlan(plan.id)
      if (res) {
        //plans.value.splice(index, 1)

        await showAlert({
          title: 'موفقیت',
          message: 'طرح با موفقیت حذف شد',
          type: 'success'
        })
      }
    }
  }
}
const stats=useSubscriptionStatsStore()
onMounted(async () => {
  await planStore.fetchPlans()
  await stats.fetchStats()

})
</script>
