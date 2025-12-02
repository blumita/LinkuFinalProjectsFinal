<template>
  <div>
    <h2 class="text-xl font-bold mb-6 text-right flex items-center gap-2 text-primary">
      <i class="ti ti-dice-3 text-2xl opacity-60"></i>
      تاس شانس - لیست شرکت‌کنندگان
    </h2>

    <!-- حالت لودینگ -->
    <div v-if="loading" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      <div
        v-for="i in 6"
        :key="i"
        class="bg-secondary border border-border rounded-xl p-4 animate-pulse"
      >
        <div class="space-y-3">
          <div class="h-4 bg-accent-bg rounded w-3/4"></div>
          <div class="h-4 bg-accent-bg rounded w-1/2"></div>
          <div class="h-4 bg-accent-bg rounded w-2/3"></div>
          <div class="h-3 bg-accent-bg rounded w-full"></div>
          <div class="h-3 bg-accent-bg rounded w-1/3"></div>
        </div>
      </div>
    </div>

    <!-- حالت خالی -->
    <div v-else-if="people.length === 0" class="text-center py-16">
      <i class="ti ti-dice-3 text-6xl opacity-20 text-primary"></i>
      <p class="text-primary opacity-60 mt-4">هنوز کسی در تاس شانس شرکت نکرده است</p>
    </div>

    <!-- لیست شرکت‌کنندگان -->
    <div v-else>
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div
          v-for="(item, index) in people"
          :key="index"
          class="bg-secondary border border-border rounded-xl p-4 relative group"
        >
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
            <div v-if="item.note" class="flex items-start gap-1 opacity-60">
              {{ item.note }}
            </div>
            <div v-if="item.ip" class="flex items-center gap-1 opacity-40">
              IP: <span class="ltr">{{ item.ip }}</span>
            </div>
            <div v-if="item.country" class="flex items-center gap-1 opacity-60">
              کشور: {{ item.country }}
            </div>
          </div>

          <button
            @click="copyToClipboard(item)"
            class="absolute top-3 ltr:right-3 rtl:left-3 bg-accent-bg hover:bg-accent-bg/80 text-accent-text text-xs px-2 py-1 rounded-md transition"
          >
            <i class="ti ti-copy text-sm"></i>
          </button>
        </div>
      </div>

      <button
        @click="exportToExcel"
        class="w-full py-2 bg-primary text-white rounded-lg mt-6 hover:opacity-90 transition"
      >
        خروجی اکسل
      </button>
    </div>

    <transition name="fade">
      <div
        v-if="showToast"
        class="fixed bottom-6 ltr:left-6 rtl:right-6 bg-green-500 text-white px-4 py-2 rounded-lg text-sm z-50 flex items-center justify-center gap-4"
      >
        <span class="p-1 text-md rounded-full bg-green-600 w-6 h-6 flex items-center justify-center">
          <i class="ti ti-check"></i>
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
      people: [],
      loading: true
    }
  },
  computed: {
    cardId() {
      const formStore = useFormStore()
      return formStore.defaultCard.id
    }
  },
  mounted() {
    this.fetchPeopleLuckyDice()
    this.readAllResults()
  },
  methods: {
    async fetchPeopleLuckyDice() {
      this.loading = true
      try {
        const response = await this.$axios.get(`club/${this.cardId}/luckyDice/allResults`)
        const luckyDices = response.data.data || []

        // داده API رو بریزیم تو people
        this.people = luckyDices.map(item => ({
          name: item.name || '',
          phone: item.phone || '',
          code: item.lotteryCode || '',
          note: item.note || '',
          ip: item.ip_address || '',
          country: countryMap[item.country] || item.country || ''
        }))
      } catch (error) {
      } finally {
        this.loading = false
      }
    },
    async readAllResults() {
      try {
        const response = await this.$axios.get(`club/${this.cardId}/luckyDice/readAll`)

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
        IP: p.ip || '',
        کشور: p.country || ''
      }))
      const sheet = XLSX.utils.json_to_sheet(rows)
      const book = XLSX.utils.book_new()
      XLSX.utils.book_append_sheet(book, sheet, 'تاس شانس')
      XLSX.writeFile(book, 'LuckyDice.xlsx')
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
export async function fetchPeopleLuckyDice(cardId, axiosInstance) {
  try {
    const response = await axiosInstance.get(`club/${cardId}/luckyDice/resultCount`)
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
