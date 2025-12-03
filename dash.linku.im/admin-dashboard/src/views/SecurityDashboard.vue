<template>
  <div class="p-6 space-y-6">
    <div class="flex items-center justify-between">
      <h1 class="text-2xl font-bold">داشبورد امنیتی</h1>
      <button
        @click="refreshStats"
        :disabled="loading"
        class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"
      >
        <i class="ti ti-refresh" :class="{ 'animate-spin': loading }"></i>
        <span>بروزرسانی</span>
      </button>
    </div>

    <!-- Stats Cards -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div class="bg-red-50 dark:bg-red-900/20 p-6 rounded-lg border border-red-200 dark:border-red-800">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-red-600 dark:text-red-400">IP های مسدود شده</p>
            <p class="text-3xl font-bold text-red-700 dark:text-red-300 mt-2">{{ stats.total_blocked }}</p>
          </div>
          <i class="ti ti-ban text-4xl text-red-500"></i>
        </div>
      </div>

      <div class="bg-yellow-50 dark:bg-yellow-900/20 p-6 rounded-lg border border-yellow-200 dark:border-yellow-800">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-yellow-600 dark:text-yellow-400">محدودیت سرعت</p>
            <p class="text-3xl font-bold text-yellow-700 dark:text-yellow-300 mt-2">{{ stats.total_rate_limited }}</p>
          </div>
          <i class="ti ti-clock-pause text-4xl text-yellow-500"></i>
        </div>
      </div>

      <div class="bg-orange-50 dark:bg-orange-900/20 p-6 rounded-lg border border-orange-200 dark:border-orange-800">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-orange-600 dark:text-orange-400">درخواست‌های مشکوک</p>
            <p class="text-3xl font-bold text-orange-700 dark:text-orange-300 mt-2">{{ stats.total_suspicious }}</p>
          </div>
          <i class="ti ti-alert-triangle text-4xl text-orange-500"></i>
        </div>
      </div>
    </div>

    <!-- Blocked IPs Table -->
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow">
      <div class="p-6 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
        <h2 class="text-lg font-semibold">IP های مسدود شده</h2>
        <button
          v-if="stats.blocked_ips && stats.blocked_ips.length > 0"
          @click="clearAllBlocked"
          class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm"
        >
          پاک کردن همه
        </button>
      </div>
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead class="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">IP</th>
              <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">زمان</th>
              <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">عملیات</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
            <tr v-if="!stats.blocked_ips || stats.blocked_ips.length === 0">
              <td colspan="3" class="px-6 py-4 text-center text-gray-500">هیچ IP مسدود شده‌ای وجود ندارد</td>
            </tr>
            <tr v-for="blocked in stats.blocked_ips" :key="blocked.ip" class="hover:bg-gray-50 dark:hover:bg-gray-700">
              <td class="px-6 py-4 text-sm font-mono">{{ blocked.ip }}</td>
              <td class="px-6 py-4 text-sm text-gray-500">{{ blocked.timestamp || 'نامشخص' }}</td>
              <td class="px-6 py-4 text-sm">
                <button
                  @click="unblockIP(blocked.ip)"
                  class="text-blue-600 hover:text-blue-800 dark:text-blue-400"
                >
                  رفع مسدودیت
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Suspicious Requests Log -->
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow">
      <div class="p-6 border-b border-gray-200 dark:border-gray-700">
        <h2 class="text-lg font-semibold">لاگ درخواست‌های مشکوک</h2>
      </div>
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead class="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">زمان</th>
              <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">IP</th>
              <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">پیام</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
            <tr v-if="!stats.suspicious_requests || stats.suspicious_requests.length === 0">
              <td colspan="3" class="px-6 py-4 text-center text-gray-500">هیچ درخواست مشکوکی ثبت نشده</td>
            </tr>
            <tr v-for="(req, index) in stats.suspicious_requests" :key="index" class="hover:bg-gray-50 dark:hover:bg-gray-700">
              <td class="px-6 py-4 text-sm text-gray-500">{{ req.timestamp }}</td>
              <td class="px-6 py-4 text-sm font-mono">{{ req.ip }}</td>
              <td class="px-6 py-4 text-sm">{{ req.message }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import axios from 'axios'

interface SecurityStats {
  blocked_ips: Array<{ ip: string; timestamp?: string }>
  rate_limited_ips: Array<{ ip: string; count: number }>
  suspicious_requests: Array<{ timestamp: string; ip: string; message: string }>
  total_blocked: number
  total_rate_limited: number
  total_suspicious: number
}

const loading = ref(false)
const stats = ref<SecurityStats>({
  blocked_ips: [],
  rate_limited_ips: [],
  suspicious_requests: [],
  total_blocked: 0,
  total_rate_limited: 0,
  total_suspicious: 0
})

const fetchSecurityStats = async () => {
  loading.value = true
  try {
    const response = await axios.get('/admin/security/stats')
    if (response.data.success) {
      stats.value = response.data.data
    }
  } catch (error) {
    console.error('Error fetching security stats:', error)
  } finally {
    loading.value = false
  }
}

const unblockIP = async (ip: string) => {
  if (!confirm(`آیا می‌خواهید IP ${ip} را از لیست مسدود شده‌ها حذف کنید؟`)) {
    return
  }

  try {
    const response = await axios.post('/admin/security/unblock-ip', { ip })
    if (response.data.success) {
      alert(response.data.message)
      await fetchSecurityStats()
    }
  } catch (error) {
    console.error('Error unblocking IP:', error)
    alert('خطا در رفع مسدودیت IP')
  }
}

const clearAllBlocked = async () => {
  if (!confirm('آیا می‌خواهید تمام IP های مسدود شده را پاک کنید؟')) {
    return
  }

  try {
    const response = await axios.post('/admin/security/clear-blocked')
    if (response.data.success) {
      alert(response.data.message)
      await fetchSecurityStats()
    }
  } catch (error) {
    console.error('Error clearing blocked IPs:', error)
    alert('خطا در پاک کردن IP های مسدود')
  }
}

const refreshStats = () => {
  fetchSecurityStats()
}

onMounted(() => {
  fetchSecurityStats()
})
</script>
