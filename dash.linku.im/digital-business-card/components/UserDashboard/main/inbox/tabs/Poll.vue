<template>
  <div>
    <h2 class="text-xl font-bold mb-4 text-right flex items-center gap-2 text-primary">
      <i class="ti ti-chart-pie-2 text-2xl opacity-60"></i>
      مجموع رأی‌ها: {{ totalVotes.toLocaleString() }}
    </h2>

    <!-- حالت لودینگ -->
    <div v-if="loading" class="space-y-6">
      <div v-for="i in 2" :key="i" class="animate-pulse">
        <div class="h-6 bg-accent-bg rounded w-3/4 mb-4"></div>
        <div v-for="j in 2" :key="j" class="mb-4">
          <div class="flex justify-between mb-2">
            <div class="h-8 bg-accent-bg rounded w-32"></div>
            <div class="h-6 bg-accent-bg rounded w-12"></div>
          </div>
          <div class="h-2 bg-accent-bg rounded w-full"></div>
        </div>
      </div>
    </div>

    <!-- محتوای اصلی -->
    <div v-else>
      <div v-for="(poll, pollIndex) in polls" :key="pollIndex" class="mb-10">
        <p class="mb-4 text-lg text-right font-medium text-primary">{{ poll.question }}</p>

        <div v-for="(answer, index) in poll.options" :key="index" class="mb-5">
          <div class="flex justify-between items-center mb-1 text-sm text-right">
            <span
              :class="[
                'px-3 py-1 rounded',
                index === 0 ? 'bg-primary text-white' : 'text-primary'
              ]"
            >
              {{ answer.option }} ({{ answer.votes.toLocaleString() }} رأی)
            </span>
            <span class="text-primary opacity-60">{{ answer.percent }}٪</span>
          </div>
          <div class="w-full h-2 bg-accent-bg rounded overflow-hidden">
            <div
              class="h-2 transition-all duration-300"
              :class="index === 0 ? 'bg-primary' : 'bg-accent-bg/50'"
              :style="{ width: answer.percent + '%' }"
            ></div>
          </div>
        </div>
      </div>

      <!-- تب‌ها -->
      <div class="mt-8 border-b border-border flex gap-4 text-sm text-right">
        <button
          @click="activeTab = 'yes'"
          :class="[
            'flex items-center gap-1 px-3 py-2 transition',
            activeTab === 'yes'
              ? 'border-b-2 border-primary text-primary font-semibold'
              : 'text-primary opacity-60 hover:opacity-100'
          ]"
        >
          <i class="ti ti-thumb-up"></i> رأی‌دهندگان «بله»
        </button>
        <button
          @click="activeTab = 'no'"
          :class="[
            'flex items-center gap-1 px-3 py-2 transition',
            activeTab === 'no'
              ? 'border-b-2 border-primary text-primary font-semibold'
              : 'text-primary opacity-60 hover:opacity-100'
          ]"
        >
          <i class="ti ti-thumb-down"></i> رأی‌دهندگان «خیر»
        </button>
      </div>

      <!-- لیست رأی‌دهندگان -->
      <ul class="mt-4 space-y-2 text-sm">
        <li
          v-for="(voter, index) in filteredVoters"
          :key="index"
          class="border border-border px-3 py-2 rounded bg-secondary text-right flex justify-between items-center"
        >
          <div>
            <span class="ltr text-primary">{{ voter.ip }}</span>
          </div>
          <span class="text-primary opacity-60">{{ voter.country }}</span>
        </li>
      </ul>

      <!-- دکمه خروجی -->
      <button
        @click="exportToExcel"
        class="mt-6 w-full py-2 bg-primary text-white rounded-lg hover:opacity-90 transition"
      >
        خروجی اکسل
      </button>
    </div>
  </div>
</template>

<script>
import * as XLSX from 'xlsx'
import { useFormStore } from '~/stores/form'

export default {
  data() {
    return {
      question: '',
      polls: [],
      answers: [],
      totalVotes: 0,
      activeTab: 'yes',
      voters: [],
      ip: '',
      country: '',
      loading: true
    }
  },
  computed: {
    filteredVoters() {
      return this.voters.filter(v => v.vote === this.activeTab)
    },
    cardId() {
      const formStore = useFormStore()
      return formStore.defaultCard.id
    }
  },
  mounted() {
    this.fetchPollData()
  },
  methods: {
    async fetchPollData() {
      this.loading = true
      try {
        const response = await this.$axios.get(`v1/cards/${this.cardId}/votes`)
        const polls = response.data.polls || []
        const totalVotes = response.data.total_votes || 0
        const voters = response.data.voters || []

        this.totalVotes = totalVotes
        this.polls = polls.map(poll => {
          const options = poll.options.map(opt => ({
            option: opt.text,
            votes: opt.votes_count,
            percent: totalVotes > 0
                ? Math.round((opt.votes_count / totalVotes) * 100)
                : 0
          }))
          return {
            question: poll.question,
            options
          }
        })

        this.voters = voters.map(v => ({
          ip: v.ip,
          country: v.country,
          vote: this.resolveVoteLabel(v.option_id)
        }))
      } catch (error) {
      } finally {
        this.loading = false
      }
    },
    resolveVoteLabel(optionId) {
      const label = this.polls.flatMap(p => p.options).find(o => o.id === optionId)?.option
      return label?.toLowerCase().includes('بله') ? 'yes' : 'no'
    },
    exportToExcel() {
      const rows = this.voters.map((v, i) => ({
        ردیف: i + 1,
        IP: v.ip,
        کشور: v.country,
        گزینه: v.vote === 'yes' ? 'بله' : 'خیر'
      }))
      const sheet = XLSX.utils.json_to_sheet(rows)
      const book = XLSX.utils.book_new()
      XLSX.utils.book_append_sheet(book, sheet, 'نظرسنجی - رأی‌دهندگان')
      XLSX.writeFile(book, 'poll-voters.xlsx')
    }
  }
}
export async function fetchPollCount(cardId, axiosInstance) {
  try {
    const response = await axiosInstance.get(`v1/cards/${cardId}/votes`)
    return response.data?.total_votes || 0
  } catch (error) {
    return 0
  }
}

</script>


<style scoped>
.ltr {
  direction: ltr;
  display: inline-block;
}
</style>
