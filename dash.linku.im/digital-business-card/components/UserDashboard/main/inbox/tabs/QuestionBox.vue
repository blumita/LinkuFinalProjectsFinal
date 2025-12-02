<template>
  <div>
    <h2 class="text-xl font-bold mb-6 text-right flex items-center gap-2 text-primary">
      <i class="ti ti-message-circle text-2xl opacity-60"></i>
      جعبه سوالات - {{ messages.length }} پاسخ
    </h2>

    <!-- حالت لودینگ -->
    <div v-if="loading" class="space-y-3">
      <div v-for="i in 5" :key="i" class="bg-secondary border border-border rounded-xl p-4 animate-pulse">
        <div class="space-y-2">
          <div class="h-4 bg-accent-bg rounded w-1/4"></div>
          <div class="h-4 bg-accent-bg rounded w-full"></div>
          <div class="h-3 bg-accent-bg rounded w-1/3"></div>
        </div>
      </div>
    </div>

    <!-- حالت خالی -->
    <div v-else-if="messages.length === 0" class="text-center py-16">
      <i class="ti ti-message-circle text-6xl opacity-20 text-primary"></i>
      <p class="text-primary opacity-60 mt-4">هیچ سوالی دریافت نشده است</p>
    </div>

    <!-- جدول سوالات -->
    <div v-else>
      <div class="overflow-x-auto">
        <table class="w-full table-auto border-collapse text-right text-sm">
          <thead>
            <tr class="bg-accent-bg text-primary">
              <th class="p-3 border border-border">شناسه</th>
              <th class="p-3 border border-border">متن پیام</th>
              <th class="p-3 border border-border">IP کاربر</th>
              <th class="p-3 border border-border">کشور</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="msg in messages" :key="msg.id" class="odd:bg-secondary">
              <td class="p-2 border border-border text-primary">{{ msg.id }}</td>
              <td class="p-2 border border-border text-primary">{{ msg.question }}</td>
              <td class="p-2 border border-border text-primary opacity-40">{{ msg.ip || '---' }}</td>
              <td class="p-2 border border-border text-primary opacity-60">{{ msg.country_fa || '---' }}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <button
        @click="exportToExcel"
        class="w-full py-2 bg-primary text-white rounded-lg mt-6 hover:opacity-90 transition"
      >
        خروجی اکسل
      </button>
    </div>
  </div>
</template>

<script>
import * as XLSX from 'xlsx'
import countryMap from '@/assets/api/countryMap.json'
import {useNuxtApp} from "#app";


export default {
  data() {
    return {
      messages: [],
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
    this.fetchQuestions()
    this.readAllQuestion()

  },
  methods: {
    async fetchQuestions() {
      this.loading = true
      const {$axios}=useNuxtApp()
      try {
        const res = await $axios.get(`club/${this.cardId}/questions`)
        if (res.data?.data) {
          this.messages = res.data.data
        }
      } catch (err) {
      } finally {
        this.loading = false
      }
    },
    async readAllQuestion() {
      const {$axios}=useNuxtApp()
      try {
        const res = await $axios.get(`club/${this.cardId}/questions/readAllQuestions`)

      } catch (err) {

      }
    },
    exportToExcel() {
      const rows = this.messages.map(msg => ({
        شناسه: msg.id,
        'متن پیام': msg.text,
        'IP کاربر': msg.ip || '',
        کشور: msg.country_fa || ''
      }))
      const sheet = XLSX.utils.json_to_sheet(rows)
      const book = XLSX.utils.book_new()
      XLSX.utils.book_append_sheet(book, sheet, 'جعبه سوالات')
      XLSX.writeFile(book, 'جعبه-سوالات.xlsx')
    }
  }
}

export async function fetchQuestionBox(cardId, axiosInstance) {
  try {
    const response = await axiosInstance.get(`club/${cardId}/questions/questionsCount`)
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
