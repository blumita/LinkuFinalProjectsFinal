<template>
  <div>
    <h2 class="text-xl font-bold mb-6 text-right flex items-center gap-2 text-primary">
      <i class="ti ti-rotate-clockwise-2 text-2xl text-primary"></i>
      چرخ شانس - شرکت‌کنندگان
    </h2>

    <!-- اسکلتون لودر -->
    <div v-if="loading" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      <div
        v-for="i in 6"
        :key="i"
        class="bg-secondary border border-border rounded-xl p-4 relative animate-pulse"
      >
        <div class="space-y-2">
          <div class="h-4 bg-primary rounded w-3/4"></div>
          <div class="h-4 bg-primary rounded w-1/2"></div>
          <div class="h-4 bg-primary rounded w-2/3"></div>
          <div class="h-4 bg-primary rounded w-1/3"></div>
        </div>
        <div class="absolute top-3 ltr:right-3 rtl:left-3 w-8 h-6 bg-primary rounded"></div>
      </div>
    </div>

    <!-- لیست شرکت‌کنندگان -->
    <div v-else-if="people.length" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      <div
        v-for="(item, index) in people"
        :key="index"
        class="bg-secondary border border-border rounded-xl p-4 relative group hover:border-accent transition-colors"
      >
        <!-- اطلاعات -->
        <div class="space-y-2 text-sm text-primary text-right">
          <div v-if="item.name" class="flex items-center gap-1">
            {{ item.name }}
          </div>
          <div v-if="item.phone" class="flex items-center gap-1">
            {{ item.phone }}
          </div>
          <div v-if="item.code" class="flex items-center gap-1">
            کد قرعه‌کشی: <span class="ltr">{{ item.code }}</span>
          </div>
          <div v-if="item.note" class="flex items-start gap-1 opacity-70">
            {{ item.note }}
          </div>
          <div v-if="item.ip_address" class="flex items-center gap-1 opacity-60">
            IP: <span class="ltr">{{ item.ip_address }}</span>
          </div>
          <div v-if="item.country" class="flex items-center gap-1 opacity-70">
            کشور: {{ item.country }}
          </div>
        </div>

        <!-- دکمه کپی -->
        <button
          @click="copyToClipboard(item)"
          class="absolute top-3 ltr:right-3 rtl:left-3 bg-primary hover:bg-accent text-primary hover:accent-text text-xs px-2 py-1 rounded-md transition"
        >
          <i class="ti ti-copy text-sm"></i>
        </button>
      </div>
    </div>

    <!-- حالت خالی -->
    <div v-else class="flex flex-col items-center justify-center py-16 text-center">
      <div class="w-24 h-24 rounded-full bg-secondary flex items-center justify-center mb-4">
        <i class="ti ti-rotate-clockwise-2 text-5xl text-primary opacity-30"></i>
      </div>
      <h3 class="text-lg font-bold text-primary mb-2">هیچ شرکت‌کننده‌ای یافت نشد</h3>
      <p class="text-sm text-primary opacity-60 max-w-sm">
        هنوز هیچ کاربری در چرخ شانس شرکت نکرده است.
      </p>
    </div>

    <!-- خروجی اکسل -->
    <button
      v-if="people.length"
      @click="exportToExcel"
      class="w-full py-2 accent-bg accent-text rounded-lg mt-6 hover:opacity-90 transition font-medium"
    >
      خروجی اکسل
    </button>

    <!-- توست -->
    <transition name="fade">
      <div
        v-if="showToast"
        class="fixed bottom-6 right-6 bg-green-500 text-white px-4 py-2 rounded-lg text-sm z-50 flex items-center justify-center gap-4 shadow-lg"
      >
        <span class="p-1 text-md rounded-full bg-green-600 w-6 h-6 flex items-center justify-center">
          <i class="ti ti-check" />
        </span>
        <span>اطلاعات با موفقیت کپی شد</span>
      </div>
    </transition>
  </div>
</template>

<script>
import * as XLSX from 'xlsx'
import countryMap from '@/assets/api/countryMap.json'

export default {
  data() {
    return {
      showToast: false,
      people: []
    }
  },
  mounted() {
    this.fetchPeopleLuckyWheel()
   this.readAllResults()
  },
  computed: {
    cardId() {
      const formStore = useFormStore()
      return formStore.defaultCard.id
    }
  },
  methods: {
    async fetchPeopleLuckyWheel() {
      try {
        const response = await this.$axios.get(`club/${this.cardId}/luckyWheel/allResults`)
        this.people = response.data.data || []
      } catch (error) {
      }
    },
    async readAllResults() {
      try {
        const response = await this.$axios.get(`club/${this.cardId}/luckyWheel/readAll`)

      } catch (error) {

      }
    },
    exportToExcel() {
      const rows = this.people.map((p, i) => ({
        ردیف: i + 1,
        'نام و نام خانوادگی': p.name || '',
        'شماره موبایل': p.phone || '',
        'کد قرعه‌کشی': p.code || '',
        'یادداشت': p.note || '',
        IP: p.ip_address || '',
        کشور: p.country || ''
      }))
      const sheet = XLSX.utils.json_to_sheet(rows)
      const book = XLSX.utils.book_new()
      XLSX.utils.book_append_sheet(book, sheet, 'چرخ شانس')
      XLSX.writeFile(book, 'SpinWheel.xlsx')
    },
    copyToClipboard(item) {
      const parts = []
      if (item.name) parts.push(`👤 ${item.name}`)
      if (item.phone) parts.push(`📞 ${item.phone}`)
      if (item.code) parts.push(`🎟 کد قرعه‌کشی: ${item.code}`)
      if (item.note) parts.push(`📝 ${item.note}`)
      if (item.ip) parts.push(`🌐 IP: ${item.ip}`)
      if (item.country) parts.push(`🏳 کشور: ${item.country}`)
      const text = parts.join('\n')
      navigator.clipboard.writeText(text).then(() => {
        this.showToast = true
        setTimeout(() => {
          this.showToast = false
        }, 2000)
      })
    }
  }
}
export async function fetchPeopleLuckyWheel(cardId, axiosInstance) {
  try {
    const response = await axiosInstance.get(`club/${cardId}/luckyWheel/resultCount`)
    const { totalCount, unreadCount } = response.data.data || {}

    return {
      totalCount: totalCount ?? 0,
      unreadCount: unreadCount ?? 0
    }
  } catch (error) {
    return {
      totalCount: 0,
      unreadCount: 0
    }
  }
}
</script>

<style scoped>
.ltr {
  direction: ltr;
  display: inline-block;
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
