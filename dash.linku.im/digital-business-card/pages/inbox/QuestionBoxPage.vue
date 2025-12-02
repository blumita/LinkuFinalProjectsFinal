<template>
  <div class="min-h-screen bg-background">
    <!-- Header -->
    <div class="fixed top-0 left-0 right-0 z-40 bg-card border-b border-border">
      <div class="flex items-center h-12 lg:h-14 px-4 lg:px-8">
        <button
          @click="router.back()"
          class="flex items-center justify-center w-10 h-10 rounded-lg text-foreground hover:bg-accent transition-colors"
        >
          <i class="ti ti-arrow-right text-xl"></i>
        </button>
        <div class="flex-1 flex items-center justify-center lg:justify-start mr-2 lg:mr-4">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 lg:w-12 lg:h-12 rounded-xl bg-primary/10 flex items-center justify-center">
              <i class="ti ti-message-question text-primary text-lg lg:text-xl"></i>
            </div>
            <h1 class="text-lg lg:text-2xl font-semibold lg:font-bold text-foreground">جعبه سوالات</h1>
          </div>
        </div>
        <div class="hidden lg:flex items-center gap-3">
          <div class="bg-primary/10 text-primary px-3 py-1.5 rounded-lg">
            <span class="text-sm font-medium">{{ totalCount }} پیام</span>
          </div>
          <button
            @click="exportData"
            :disabled="loading"
            class="px-3 py-1.5 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors flex items-center gap-2 disabled:opacity-50"
          >
            <i class="ti ti-download text-lg"></i>
            <span>خروجی</span>
          </button>
        </div>
      </div>
    </div>
    
    <!-- Content -->
    <div class="pt-16 lg:pt-20 pb-24 px-4 lg:px-8">
      <div class="max-w-2xl lg:max-w-none mx-auto">
      
      <!-- Desktop Filter Bar -->
      <div class="hidden lg:flex items-center gap-3 mb-6">
        <div class="flex-1 relative">
          <i class="ti ti-search absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"></i>
          <input
            v-model="searchQuery"
            type="text"
            placeholder="جستجو بر اساس نام یا شماره موبایل..."
            class="w-full h-10 pr-10 pl-4 bg-card border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
          >
        </div>
        <select
          v-model="sortBy"
          class="h-10 px-4 bg-card border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
        >
          <option value="newest">جدیدترین</option>
          <option value="oldest">قدیمی‌ترین</option>
          <option value="name">نام (الف-ی)</option>
        </select>
        <button
          @click="searchQuery = ''; sortBy = 'newest'"
          class="h-10 px-4 bg-muted/50 hover:bg-muted text-foreground rounded-lg transition-colors flex items-center gap-2"
        >
          <i class="ti ti-filter-off text-lg"></i>
          <span>پاک کردن</span>
        </button>
      </div>
      
      <!-- Mobile Info Card -->
      <div class="lg:hidden flex items-center justify-between mb-6 bg-card rounded-xl border border-border p-4">
        <div class="flex items-center gap-3">
          <span class="text-muted-foreground text-sm">تعداد پیام‌ها:</span>
          <span class="text-foreground font-bold text-lg">{{ filteredCount }}</span>
        </div>
        <button
          @click="exportData"
          :disabled="loading"
          class="px-4 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors text-sm disabled:opacity-50"
        >
          خروجی
        </button>
      </div>

      <!-- Loading Skeleton -->
      <div v-if="loading" class="bg-card rounded-xl border border-border overflow-hidden">
        <div class="bg-muted/20 px-4 py-3 border-b border-border">
          <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <span class="font-medium text-foreground text-sm">شناسه</span>
            <span class="font-medium text-foreground text-sm lg:col-span-2">فرستنده</span>
            <span class="hidden lg:block font-medium text-foreground text-sm text-left">عملیات</span>
          </div>
        </div>
        <div class="divide-y divide-border">
          <div v-for="i in 5" :key="i" class="px-4 py-3">
            <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 items-center">
              <div class="h-5 bg-muted/30 rounded animate-pulse"></div>
              <div class="h-5 bg-muted/30 rounded animate-pulse lg:col-span-2"></div>
              <div class="hidden lg:flex items-center justify-end gap-2">
                <div class="w-8 h-8 bg-muted/30 rounded animate-pulse"></div>
                <div class="w-8 h-8 bg-muted/30 rounded animate-pulse"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Messages Table -->
      <div v-else class="bg-card rounded-xl border border-border overflow-hidden">
        <!-- Table Header -->
        <div class="bg-muted/20 px-4 py-3 border-b border-border">
          <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <span class="font-medium text-foreground text-sm">شناسه</span>
            <span class="font-medium text-foreground text-sm lg:col-span-2">فرستنده</span>
            <span class="hidden lg:block font-medium text-foreground text-sm text-left">عملیات</span>
          </div>
        </div>

        <!-- Table Body -->
        <div class="divide-y divide-border">
          <div
            v-for="message in messages"
            :key="message.id"
            class="px-4 py-3 hover:bg-accent/5 transition-colors"
          >
            <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 items-center">
              <span class="text-foreground font-medium">#{{ message.id }}</span>
              <div class="lg:col-span-2">
                <div class="text-foreground font-medium">{{ message.name || 'بدون نام' }}</div>
                <div class="text-muted-foreground text-sm font-mono mt-1" dir="ltr">{{ message.mobile }}</div>
              </div>
              <div class="hidden lg:flex items-center justify-end gap-2">
                <button 
                  @click="deleteMessage(message.id)"
                  class="p-2 hover:bg-destructive/10 rounded-lg transition-colors group" 
                  title="حذف"
                >
                  <i class="ti ti-trash text-muted-foreground group-hover:text-destructive text-lg"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Pagination -->
      <div v-if="!loading && totalPages > 1" class="flex items-center justify-center gap-2 mt-6">
        <button
          v-for="page in totalPages"
          :key="page"
          @click="currentPage = page"
          class="w-8 h-8 rounded-lg flex items-center justify-center text-sm font-medium transition-colors"
          :class="currentPage === page 
            ? 'bg-primary text-primary-foreground' 
            : 'text-muted-foreground hover:text-foreground hover:bg-muted/30'"
        >
          {{ page }}
        </button>
      </div>

      <!-- Empty State -->
      <div v-if="!loading && messages.length === 0" class="text-center py-12">
        <div class="w-16 h-16 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
          <i class="ti ti-message-question text-primary text-2xl opacity-50"></i>
        </div>
        <h3 class="text-foreground font-medium mb-2">هیچ پیامی وجود ندارد</h3>
        <p class="text-muted-foreground text-sm">هنوز هیچ پیامی از جعبه سوالات دریافت نشده است</p>
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
const currentPage = ref(1)
const messagesPerPage = 10
const allMessages = ref<Array<{ id: number; name: string; mobile: string }>>([])
const totalCount = ref(0)
const searchQuery = ref('')
const sortBy = ref<'newest' | 'oldest' | 'name'>('newest')

// Computed
const filteredAndSortedMessages = computed(() => {
  let filtered = [...allMessages.value]
  
  // Filter by search query
  if (searchQuery.value.trim()) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(msg => 
      msg.name.toLowerCase().includes(query) || 
      msg.mobile.includes(query)
    )
  }
  
  // Sort
  if (sortBy.value === 'newest') {
    filtered.sort((a, b) => b.id - a.id)
  } else if (sortBy.value === 'oldest') {
    filtered.sort((a, b) => a.id - b.id)
  } else if (sortBy.value === 'name') {
    filtered.sort((a, b) => a.name.localeCompare(b.name, 'fa'))
  }
  
  return filtered
})

const filteredCount = computed(() => filteredAndSortedMessages.value.length)
const totalPages = computed(() => Math.ceil(filteredCount.value / messagesPerPage))

const messages = computed(() => {
  const start = (currentPage.value - 1) * messagesPerPage
  const end = start + messagesPerPage
  return filteredAndSortedMessages.value.slice(start, end)
})

// Methods
const fetchMessages = async () => {
  const cardId = formStore.defaultCard?.id
  if (!cardId) return

  loading.value = true
  try {
    const axios = $axios as AxiosInstance
    const response = await axios.get(`/card/${cardId}/questions`, {
      params: { page: 1, perPage: 1000 }
    })
    
    const data = response.data?.data
    if (data?.items) {
      allMessages.value = data.items.map((item: any) => ({
        id: item.id,
        name: item.name || item.full_name || '',
        mobile: item.mobile || item.phone || ''
      }))
      totalCount.value = data.pagination?.total || allMessages.value.length
    }
  } catch (error) {
  } finally {
    loading.value = false
  }
}

const exportData = () => {
  if (allMessages.value.length === 0) return
  
  const BOM = '\uFEFF'
  const csvContent = BOM + [
    'شناسه,نام,شماره موبایل',
    ...allMessages.value.map(msg => `${msg.id},"${msg.name}",${msg.mobile}`)
  ].join('\n')
  
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8' })
  const url = window.URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = 'جعبه-سوالات.csv'
  link.click()
  window.URL.revokeObjectURL(url)
}

const deleteMessage = async (id: number) => {
  if (!confirm('آیا از حذف این پیام اطمینان دارید؟')) return
  
  const cardId = formStore.defaultCard?.id
  if (!cardId) return

  try {
    const axios = $axios as AxiosInstance
    await axios.delete(`/card/${cardId}/questions/${id}`)
    
    allMessages.value = allMessages.value.filter(msg => msg.id !== id)
    totalCount.value = allMessages.value.length
  } catch (error) {
    alert('خطا در حذف پیام')
  }
}

// Fetch on mount
onMounted(() => {
  fetchMessages()
})
</script>
