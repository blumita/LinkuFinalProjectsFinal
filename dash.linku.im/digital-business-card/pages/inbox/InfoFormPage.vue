<template>
  <div class="min-h-screen bg-background">
    <!-- Header -->
    <div class="fixed top-0 left-0 right-0 z-40 bg-card border-b border-border">
      <div class="flex items-center h-12 lg:h-14 px-4 lg:px-8">
        <button
          @click="goBack()"
          class="flex items-center justify-center w-10 h-10 rounded-lg text-foreground hover:bg-accent transition-colors"
        >
          <i class="ti ti-arrow-right text-xl"></i>
        </button>
        <div class="flex-1 flex items-center justify-center lg:justify-start mr-2 lg:mr-4">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 lg:w-12 lg:h-12 rounded-xl bg-primary/10 flex items-center justify-center">
              <i class="ti ti-forms text-primary text-lg lg:text-xl"></i>
            </div>
            <h1 class="text-lg lg:text-2xl font-semibold lg:font-bold text-foreground">فرم‌های دریافتی</h1>
          </div>
        </div>
        <div class="hidden lg:flex items-center gap-3">
          <div class="bg-primary/10 text-primary px-3 py-1.5 rounded-lg">
            <span class="text-sm font-medium">{{ currentTabCount }} پیام</span>
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
      
      <!-- Tabs -->
      <div class="flex border-t border-border">
        <button
          @click="activeTab = 'leads'"
          class="flex-1 py-3 text-sm font-medium transition-colors relative"
          :class="activeTab === 'leads' 
            ? 'text-primary' 
            : 'text-muted-foreground hover:text-foreground'"
        >
          <div class="flex items-center justify-center gap-2">
            <i class="ti ti-user-plus text-lg"></i>
            <span>فرم لید</span>
            <span 
              v-if="leadCount > 0"
              class="px-1.5 py-0.5 text-xs rounded-full"
              :class="activeTab === 'leads' ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'"
            >
              {{ leadCount }}
            </span>
          </div>
          <div 
            v-if="activeTab === 'leads'"
            class="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
          ></div>
        </button>
        <button
          @click="activeTab = 'forms'"
          class="flex-1 py-3 text-sm font-medium transition-colors relative"
          :class="activeTab === 'forms' 
            ? 'text-primary' 
            : 'text-muted-foreground hover:text-foreground'"
        >
          <div class="flex items-center justify-center gap-2">
            <i class="ti ti-forms text-lg"></i>
            <span>فرم‌های دیگر</span>
            <span 
              v-if="formCount > 0"
              class="px-1.5 py-0.5 text-xs rounded-full"
              :class="activeTab === 'forms' ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'"
            >
              {{ formCount }}
            </span>
          </div>
          <div 
            v-if="activeTab === 'forms'"
            class="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
          ></div>
        </button>
      </div>
    </div>
    
    <!-- Content -->
    <div class="pt-28 lg:pt-32 pb-24 px-4 lg:px-8">
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
          <div class="grid gap-4" :class="activeTab === 'leads' ? 'grid-cols-2 lg:grid-cols-5' : 'grid-cols-2 lg:grid-cols-4'">
            <span class="font-medium text-foreground text-sm">شناسه</span>
            <span class="font-medium text-foreground text-sm">نام</span>
            <span class="hidden lg:block font-medium text-foreground text-sm">شماره موبایل</span>
            <span v-if="activeTab === 'leads'" class="hidden lg:block font-medium text-foreground text-sm">ایمیل</span>
            <span class="hidden lg:block font-medium text-foreground text-sm text-left">عملیات</span>
          </div>
        </div>
        <div class="divide-y divide-border">
          <div v-for="i in 5" :key="i" class="px-4 py-3">
            <div class="grid gap-4 items-center" :class="activeTab === 'leads' ? 'grid-cols-2 lg:grid-cols-5' : 'grid-cols-2 lg:grid-cols-4'">
              <div class="h-5 bg-muted/30 rounded animate-pulse"></div>
              <div class="h-5 bg-muted/30 rounded animate-pulse"></div>
              <div class="hidden lg:block h-5 bg-muted/30 rounded animate-pulse"></div>
              <div v-if="activeTab === 'leads'" class="hidden lg:block h-5 bg-muted/30 rounded animate-pulse"></div>
              <div class="hidden lg:flex items-center justify-end gap-2">
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
          <div class="grid gap-4" :class="activeTab === 'leads' ? 'grid-cols-2 lg:grid-cols-5' : 'grid-cols-2 lg:grid-cols-4'">
            <span class="font-medium text-foreground text-sm">شناسه</span>
            <span class="font-medium text-foreground text-sm">نام</span>
            <span class="hidden lg:block font-medium text-foreground text-sm">شماره موبایل</span>
            <span v-if="activeTab === 'leads'" class="hidden lg:block font-medium text-foreground text-sm">ایمیل</span>
            <span class="hidden lg:block font-medium text-foreground text-sm text-left">عملیات</span>
          </div>
        </div>

        <!-- Table Body -->
        <div class="divide-y divide-border">
          <div
            v-for="message in messages"
            :key="message.id"
            class="px-4 py-3 hover:bg-accent/5 transition-colors cursor-pointer"
            @click="showDetails(message)"
          >
            <div class="grid gap-4 items-center" :class="activeTab === 'leads' ? 'grid-cols-2 lg:grid-cols-5' : 'grid-cols-2 lg:grid-cols-4'">
              <span class="text-foreground font-medium">#{{ message.id }}</span>
              <div>
                <div class="text-foreground font-medium">{{ message.name || 'بدون نام' }}</div>
                <div class="lg:hidden text-muted-foreground text-sm font-mono mt-1" dir="ltr">{{ message.mobile }}</div>
              </div>
              <div class="hidden lg:block text-muted-foreground text-sm font-mono" dir="ltr">{{ message.mobile || '-' }}</div>
              <div v-if="activeTab === 'leads'" class="hidden lg:block text-muted-foreground text-sm" dir="ltr">{{ message.email || '-' }}</div>
              <div class="hidden lg:flex items-center justify-end gap-2">
                <button 
                  @click.stop="showDetails(message)"
                  class="p-2 hover:bg-primary/10 rounded-lg transition-colors group" 
                  title="مشاهده جزئیات"
                >
                  <i class="ti ti-eye text-muted-foreground group-hover:text-primary text-lg"></i>
                </button>
                <button 
                  @click.stop="deleteMessage(message.id)"
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
          <i :class="activeTab === 'leads' ? 'ti ti-user-plus' : 'ti ti-forms'" class="text-primary text-2xl opacity-50"></i>
        </div>
        <h3 class="text-foreground font-medium mb-2">هیچ پیامی وجود ندارد</h3>
        <p class="text-muted-foreground text-sm">
          {{ activeTab === 'leads' 
            ? 'هنوز هیچ پیامی از فرم لید دریافت نشده است' 
            : 'هنوز هیچ پیامی از فرم‌های دیگر دریافت نشده است' 
          }}
        </p>
      </div>
      </div>
    </div>
    
    <!-- Details Modal -->
    <Teleport to="body">
      <div 
        v-if="selectedMessage" 
        class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
        @click.self="selectedMessage = null"
      >
        <div class="bg-card rounded-2xl border border-border w-full max-w-lg max-h-[80vh] overflow-hidden">
          <!-- Modal Header -->
          <div class="flex items-center justify-between p-4 border-b border-border">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <i :class="activeTab === 'leads' ? 'ti ti-user-plus' : 'ti ti-forms'" class="text-primary text-lg"></i>
              </div>
              <div>
                <h3 class="font-bold text-foreground">جزئیات فرم #{{ selectedMessage.id }}</h3>
                <p class="text-xs text-muted-foreground">{{ formatDate(selectedMessage.createdAt) }}</p>
              </div>
            </div>
            <button 
              @click="selectedMessage = null"
              class="w-8 h-8 rounded-lg hover:bg-muted flex items-center justify-center transition-colors"
            >
              <i class="ti ti-x text-muted-foreground"></i>
            </button>
          </div>
          
          <!-- Modal Body -->
          <div class="p-4 overflow-y-auto max-h-[60vh] space-y-3">
            <!-- برای فرم لید -->
            <template v-if="activeTab === 'leads'">
              <div v-if="selectedMessage.name" class="bg-muted/30 rounded-xl p-3">
                <span class="text-xs text-muted-foreground block mb-1">نام</span>
                <span class="text-foreground font-medium">{{ selectedMessage.name }}</span>
              </div>
              <div v-if="selectedMessage.mobile" class="bg-muted/30 rounded-xl p-3">
                <span class="text-xs text-muted-foreground block mb-1">شماره موبایل</span>
                <span class="text-foreground font-medium font-mono" dir="ltr">{{ selectedMessage.mobile }}</span>
              </div>
              <div v-if="selectedMessage.email" class="bg-muted/30 rounded-xl p-3">
                <span class="text-xs text-muted-foreground block mb-1">ایمیل</span>
                <span class="text-foreground font-medium" dir="ltr">{{ selectedMessage.email }}</span>
              </div>
              <!-- فیلدهای اضافی از data -->
              <template v-if="selectedMessage.data && typeof selectedMessage.data === 'object'">
                <div 
                  v-for="(value, key) in selectedMessage.data" 
                  :key="key"
                  class="bg-muted/30 rounded-xl p-3"
                >
                  <span class="text-xs text-muted-foreground block mb-1">{{ key }}</span>
                  <span class="text-foreground font-medium">{{ value || '-' }}</span>
                </div>
              </template>
            </template>
            
            <!-- برای فرم‌های دیگر (builder) -->
            <template v-else>
              <template v-if="selectedMessage.data && typeof selectedMessage.data === 'object'">
                <div 
                  v-for="(value, key) in selectedMessage.data" 
                  :key="key"
                  class="bg-muted/30 rounded-xl p-3"
                >
                  <span class="text-xs text-muted-foreground block mb-1">{{ key }}</span>
                  <!-- اگر لینک یا URL بود -->
                  <a 
                    v-if="isUrl(value)" 
                    :href="value" 
                    target="_blank"
                    class="text-primary hover:underline font-medium break-all"
                  >
                    {{ value }}
                  </a>
                  <!-- اگر آرایه بود (مثل چک‌باکس‌های متعدد) -->
                  <span v-else-if="Array.isArray(value)" class="text-foreground font-medium">
                    {{ value.join('، ') }}
                  </span>
                  <!-- مقدار معمولی -->
                  <span v-else class="text-foreground font-medium">{{ value || '-' }}</span>
                </div>
              </template>
              <div v-else class="text-center py-8 text-muted-foreground">
                اطلاعاتی موجود نیست
              </div>
            </template>
          </div>
          
          <!-- Modal Footer -->
          <div class="flex items-center gap-3 p-4 border-t border-border">
            <button 
              @click="selectedMessage = null"
              class="flex-1 py-2.5 rounded-xl bg-muted text-foreground font-medium hover:bg-muted/80 transition-colors"
            >
              بستن
            </button>
            <button 
              @click="deleteMessage(selectedMessage.id); selectedMessage = null"
              class="py-2.5 px-4 rounded-xl bg-destructive/10 text-destructive font-medium hover:bg-destructive/20 transition-colors flex items-center gap-2"
            >
              <i class="ti ti-trash"></i>
              حذف
            </button>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useFormStore } from '~/stores/form'
import { useNuxtApp } from 'nuxt/app'
import type { AxiosInstance } from 'axios'
import { useSafeNavigation } from '~/composables/useSafeNavigation'

const router = useRouter()
const formStore = useFormStore()
const { $axios } = useNuxtApp()
const { goBack } = useSafeNavigation()

// State
const loading = ref(true)
const activeTab = ref<'leads' | 'forms'>('leads')
const currentPage = ref(1)
const messagesPerPage = 10
const searchQuery = ref('')
const sortBy = ref<'newest' | 'oldest' | 'name'>('newest')
const selectedMessage = ref<any>(null)

// Lead messages (از فرم لید)
const leadMessages = ref<Array<{ id: number; name: string; mobile: string; email?: string; data?: any; createdAt?: string }>>([])
const leadCount = ref(0)

// Form messages (فرم‌های دیگر)
const formMessages = ref<Array<{ id: number; name: string; mobile: string; data?: any; createdAt?: string }>>([])
const formCount = ref(0)

// Current tab count
const currentTabCount = computed(() => {
  return activeTab.value === 'leads' ? leadCount.value : formCount.value
})

// Current messages based on active tab
const allMessages = computed(() => {
  return activeTab.value === 'leads' ? leadMessages.value : formMessages.value
})

// Computed
const filteredAndSortedMessages = computed(() => {
  let filtered = [...allMessages.value]
  
  // Filter by search query
  if (searchQuery.value.trim()) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(msg => 
      (msg.name || '').toLowerCase().includes(query) || 
      (msg.mobile || '').includes(query) ||
      (msg.email || '').toLowerCase().includes(query)
    )
  }
  
  // Sort
  if (sortBy.value === 'newest') {
    filtered.sort((a, b) => b.id - a.id)
  } else if (sortBy.value === 'oldest') {
    filtered.sort((a, b) => a.id - b.id)
  } else if (sortBy.value === 'name') {
    filtered.sort((a, b) => (a.name || '').localeCompare(b.name || '', 'fa'))
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

// Reset page when tab changes
watch(activeTab, () => {
  currentPage.value = 1
  searchQuery.value = ''
})

// Methods - Fetch Leads (فرم لید)
const fetchLeads = async () => {
  const cardId = formStore.defaultCard?.id
  if (!cardId) return

  try {
    const axios = $axios as AxiosInstance
    const response = await axios.get(`v1/cards/${cardId}/leads`)
    
    console.log('📊 Leads API Response:', response.data)
    
    const data = response.data?.data
    console.log('📊 Leads Data Array:', data)
    
    if (Array.isArray(data)) {
      leadMessages.value = data.map((item: any) => {
        console.log('📊 Lead Item:', item)
        return {
          id: item.id,
          name: item.fullName || item.full_name || item.name || '',
          mobile: item.phoneNumber || item.phone_number || item.mobile || item.phone || '',
          email: item.email || '',
          data: item.data || item.fields || item,
          createdAt: item.created_at || item.createdAt
        }
      })
      leadCount.value = leadMessages.value.length
      console.log('✅ Lead Messages:', leadMessages.value)
      console.log('✅ Lead Count:', leadCount.value)
    }
  } catch (error) {
    console.error('❌ Error fetching leads:', error)
  }
}

// Methods - Fetch Forms (فرم‌های دیگر - از لینک‌ها)
const fetchForms = async () => {
  const cardId = formStore.defaultCard?.id
  if (!cardId) return

  try {
    const axios = $axios as AxiosInstance
    const response = await axios.get(`v1/cards/${cardId}/forms`)
    
    console.log('📝 Forms API Response:', response.data)
    
    const data = response.data?.data
    console.log('📝 Forms Data Array:', data)
    
    if (Array.isArray(data)) {
      formMessages.value = data.map((item: any) => {
        console.log('📝 Form Item:', item)
        
        // داده‌ها در فیلد data هستن (به صورت object با کلیدهای فارسی)
        const formData = item.data || {}
        console.log('📝 Form Data Object:', formData)
        
        // استخراج نام از فیلدهای مختلف
        const name = formData['نام'] || formData['نام کامل'] || formData['name'] || formData['fullName'] || 'بدون نام'
        
        // استخراج شماره موبایل
        const mobile = formData['شماره موبایل'] || formData['موبایل'] || formData['تلفن'] || 
                       formData['شماره تماس'] || formData['mobile'] || formData['phone'] || 'بدون شماره'
        
        // استخراج ایمیل
        const email = formData['ایمیل'] || formData['email'] || ''
        
        return {
          id: item.id,
          name: name,
          mobile: mobile,
          email: email,
          data: formData,
          trackingCode: formData['کد پیگیری'] || item.hash || '',
          createdAt: item.createdAt || item.created_at,
          readAt: item.readAt || item.read_at
        }
      })
      formCount.value = formMessages.value.length
      console.log('✅ Form Messages:', formMessages.value)
      console.log('✅ Form Count:', formCount.value)
    }
  } catch (error) {
    console.error('❌ Error fetching forms:', error)
  }
}

const fetchAllData = async () => {
  loading.value = true
  await Promise.all([fetchLeads(), fetchForms()])
  loading.value = false
}

const exportData = () => {
  const currentMessages = allMessages.value
  if (currentMessages.length === 0) return
  
  const BOM = '\uFEFF'
  const tabName = activeTab.value === 'leads' ? 'فرم-لید' : 'فرم-اطلاعات'
  
  let csvContent = BOM
  if (activeTab.value === 'leads') {
    csvContent += [
      'شناسه,نام,شماره موبایل,ایمیل',
      ...currentMessages.map(msg => `${msg.id},"${msg.name}",${msg.mobile},${msg.email || ''}`)
    ].join('\n')
  } else {
    csvContent += [
      'شناسه,نام,شماره موبایل',
      ...currentMessages.map(msg => `${msg.id},"${msg.name}",${msg.mobile}`)
    ].join('\n')
  }
  
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8' })
  const url = window.URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `${tabName}.csv`
  link.click()
  window.URL.revokeObjectURL(url)
}

const deleteMessage = async (id: number) => {
  if (!confirm('آیا از حذف این پیام اطمینان دارید؟')) return
  
  const cardId = formStore.defaultCard?.id
  if (!cardId) return

  try {
    const axios = $axios as AxiosInstance
    
    if (activeTab.value === 'leads') {
      await axios.delete(`v1/cards/${cardId}/leads/${id}`)
      leadMessages.value = leadMessages.value.filter(msg => msg.id !== id)
      leadCount.value = leadMessages.value.length
    } else {
      // فرم‌های لینک فعلاً قابلیت حذف ندارند
      alert('امکان حذف فرم‌های لینک فعلاً وجود ندارد')
    }
  } catch (error) {
    alert('خطا در حذف پیام')
  }
}

// Show details modal
const showDetails = (message: any) => {
  selectedMessage.value = message
}

// Format date
const formatDate = (dateStr: string | undefined) => {
  if (!dateStr) return '-'
  try {
    const date = new Date(dateStr)
    return new Intl.DateTimeFormat('fa-IR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date)
  } catch {
    return dateStr
  }
}

// Check if value is URL
const isUrl = (value: any): boolean => {
  if (typeof value !== 'string') return false
  return value.startsWith('http://') || value.startsWith('https://')
}

// Fetch on mount
onMounted(() => {
  fetchAllData()
})
</script>
