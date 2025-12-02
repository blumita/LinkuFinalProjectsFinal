<template>
  <div class="min-h-screen bg-background">
    <!-- Header -->
    <div class="fixed top-0 left-0 right-0 z-40 bg-card border-b border-border">
      <div class="flex items-center h-14 lg:h-16 px-4 lg:px-6">
        <button
          @click="router.back()"
          class="flex items-center justify-center w-10 h-10 rounded-lg text-foreground hover:bg-muted transition-colors"
        >
          <i class="ti ti-arrow-right text-xl"></i>
        </button>
        <div class="flex-1 text-center lg:text-right lg:mr-4">
          <h1 class="text-lg lg:text-xl font-bold text-foreground">نظرسنجی</h1>
        </div>
        <button
          v-if="!loading && totalVotes > 0"
          @click="exportData"
          class="px-4 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors flex items-center gap-2"
        >
          <i class="ti ti-download text-lg"></i>
          <span class="hidden lg:inline">خروجی</span>
        </button>
      </div>
    </div>
    
    <!-- Content -->
    <div class="pt-20 lg:pt-24 pb-24 px-4 lg:px-6">
      <div class="max-w-4xl mx-auto">
      
      <!-- Loading State -->
      <div v-if="loading" class="space-y-6">
        <div class="bg-card rounded-xl border border-border p-6 animate-pulse">
          <div class="h-6 bg-muted rounded w-3/4 mb-6"></div>
          <div v-for="j in 2" :key="j" class="mb-4">
            <div class="flex justify-between mb-2">
              <div class="h-8 bg-muted rounded w-32"></div>
              <div class="h-6 bg-muted rounded w-12"></div>
            </div>
            <div class="h-3 bg-muted rounded w-full"></div>
          </div>
        </div>
      </div>

      <!-- Content -->
      <div v-else-if="pollData">
        <!-- Poll Question Card -->
        <div class="bg-card rounded-xl border border-border p-6 mb-6">
          <h2 class="text-lg font-semibold text-foreground mb-6">{{ pollData.question }}</h2>
          
          <!-- Poll Results -->
          <div class="space-y-4">
            <!-- Yes Option -->
            <div class="space-y-2">
              <div class="flex items-center justify-between">
                <span class="font-medium text-foreground">بله ({{ pollData.yesVotes }} رای)</span>
                <span class="text-sm text-muted-foreground">{{ pollData.yesPercentage }}%</span>
              </div>
              <div class="w-full bg-muted/30 rounded-full h-3 overflow-hidden">
                <div 
                  class="h-full bg-primary rounded-full transition-all duration-1000 ease-out"
                  :style="{ width: `${pollData.yesPercentage}%` }"
                ></div>
              </div>
            </div>

            <!-- No Option -->
            <div class="space-y-2">
              <div class="flex items-center justify-between">
                <span class="font-medium text-foreground">خیر ({{ pollData.noVotes }} رای)</span>
                <span class="text-sm text-muted-foreground">{{ pollData.noPercentage }}%</span>
              </div>
              <div class="w-full bg-muted/30 rounded-full h-3 overflow-hidden">
                <div 
                  class="h-full bg-muted rounded-full transition-all duration-1000 ease-out"
                  :style="{ width: `${pollData.noPercentage}%` }"
                ></div>
              </div>
            </div>
          </div>
        </div>

        <!-- Statistics Cards -->
        <div class="grid grid-cols-2 gap-4 mb-6">
          <div class="bg-card rounded-xl border border-border p-4">
            <div class="text-2xl font-bold text-foreground">{{ pollData.totalVotes }}</div>
            <div class="text-sm text-muted-foreground">کل آرا</div>
          </div>
          
          <div class="bg-card rounded-xl border border-border p-4">
            <div class="text-2xl font-bold text-primary">{{ pollData.yesPercentage }}%</div>
            <div class="text-sm text-muted-foreground">درصد بله</div>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-else-if="!loading" class="text-center py-12">
        <div class="w-16 h-16 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
          <i class="ti ti-chart-bar text-primary text-2xl opacity-50"></i>
        </div>
        <h3 class="text-foreground font-medium mb-2">هیچ نظرسنجی فعالی وجود ندارد</h3>
        <p class="text-muted-foreground text-sm">هنوز نظرسنجی ایجاد نشده است</p>
      </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useFormStore } from '~/stores/form'
import { useNuxtApp } from 'nuxt/app'
import type { AxiosInstance } from 'axios'

const router = useRouter()
const formStore = useFormStore()
const { $axios } = useNuxtApp()

// State
const loading = ref(true)
const pollData = ref<{
  question: string
  yesVotes: number
  noVotes: number
  totalVotes: number
  yesPercentage: number
  noPercentage: number
} | null>(null)

// Methods
const fetchPollData = async () => {
  const cardId = formStore.defaultCard?.id
  if (!cardId) return

  loading.value = true
  try {
    const axios = $axios as AxiosInstance
    const response = await axios.get(`v1/cards/${cardId}/votes`)
    
    const polls = response.data?.polls || []
    const totalVotes = response.data?.total_votes || 0
    
    if (polls.length > 0 && polls[0].options) {
      const poll = polls[0]
      const yesOption = poll.options[0] || { votes_count: 0 }
      const noOption = poll.options[1] || { votes_count: 0 }
      
      pollData.value = {
        question: poll.question,
        yesVotes: yesOption.votes_count,
        noVotes: noOption.votes_count,
        totalVotes: totalVotes,
        yesPercentage: totalVotes > 0 ? Math.round((yesOption.votes_count / totalVotes) * 100) : 0,
        noPercentage: totalVotes > 0 ? Math.round((noOption.votes_count / totalVotes) * 100) : 0
      }
    }
  } catch (error) {
  } finally {
    loading.value = false
  }
}

const exportData = () => {
  if (!pollData.value) return
  
  const BOM = '\uFEFF'
  const csvContent = BOM + [
    'سوال,گزینه,تعداد رای,درصد',
    `"${pollData.value.question}","بله",${pollData.value.yesVotes},${pollData.value.yesPercentage}%`,
    `"${pollData.value.question}","خیر",${pollData.value.noVotes},${pollData.value.noPercentage}%`
  ].join('\n')
  
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8' })
  const url = window.URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = 'نظرسنجی.csv'
  link.click()
  window.URL.revokeObjectURL(url)
}

const totalVotes = computed(() => pollData.value?.totalVotes || 0)

// Fetch on mount
onMounted(() => {
  fetchPollData()
})
</script>
