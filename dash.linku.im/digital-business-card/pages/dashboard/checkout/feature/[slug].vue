<template>
  <div class="min-h-screen bg-background">
    <!-- Loading State -->
    <div v-if="isLoading" class="flex items-center justify-center py-20">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="flex flex-col items-center justify-center py-20 px-4">
      <i class="ti ti-alert-circle text-6xl text-muted-foreground mb-4"></i>
      <p class="text-muted-foreground text-center">{{ error }}</p>
      <button 
        @click="goBack()" 
        class="mt-4 px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
      >
        بازگشت
      </button>
    </div>

    <!-- Content -->
    <div v-else-if="feature" class="pb-24">
      <div class="xl:container xl:mx-auto xl:px-8">
        <!-- Desktop Layout -->
        <div class="xl:grid xl:grid-cols-12 xl:gap-8 xl:py-8">
          
          <!-- Sidebar - Desktop Only -->
          <div class="hidden xl:block xl:col-span-4">
            <div class="sticky top-24 space-y-4">
              <!-- Feature Card -->
              <div :class="['rounded-2xl p-6 text-center border', getCardBgClass]">
                <div :class="['inline-flex items-center justify-center w-24 h-24 rounded-2xl mb-4', getIconBgClass]">
                  <i :class="[feature.icon || 'ti ti-star', 'text-5xl', getIconColorClass]"></i>
                </div>
                <h2 class="text-2xl font-bold text-foreground mb-3">{{ feature.title }}</h2>
                <p v-if="feature.description" class="text-muted-foreground text-sm leading-relaxed">{{ feature.description }}</p>
              </div>
              
              <!-- Premium CTA -->
              <div class="bg-gradient-to-br from-amber-500/10 via-yellow-500/5 to-transparent border border-amber-500/20 rounded-2xl p-5">
                <div class="flex items-center gap-3 mb-3">
                  <i class="ti ti-crown text-2xl text-amber-500"></i>
                  <span class="font-bold text-foreground">اشتراک ویژه</span>
                </div>
                <p class="text-sm text-muted-foreground mb-4">برای دسترسی به این ویژگی و ده‌ها امکان دیگر، اشتراک ویژه تهیه کنید.</p>
                <NuxtLink 
                  to="/dashboard/checkout"
                  class="block w-full py-2.5 bg-gradient-to-r from-amber-500 to-yellow-500 text-white text-center rounded-xl font-medium hover:from-amber-600 hover:to-yellow-600 transition-all"
                >
                  مشاهده پلان‌ها
                </NuxtLink>
              </div>
            </div>
          </div>
          
          <!-- Main Content -->
          <div class="xl:col-span-8">
            <!-- Mobile Header -->
            <div class="xl:hidden px-4 py-6 text-center">
              <div :class="['inline-flex items-center justify-center w-20 h-20 rounded-2xl mb-4', getIconBgClass]">
                <i :class="[feature.icon || 'ti ti-star', 'text-4xl', getIconColorClass]"></i>
              </div>
              <h2 class="text-2xl font-bold text-foreground mb-2">{{ feature.title }}</h2>
              <p v-if="feature.description" class="text-muted-foreground">{{ feature.description }}</p>
            </div>

            <!-- Feature Content -->
            <div class="px-4 xl:px-0">
              <div 
                v-if="feature.content"
                class="prose prose-sm xl:prose-base dark:prose-invert max-w-none bg-card rounded-2xl p-6 xl:p-8 border border-border"
                v-html="feature.content"
              ></div>
              <div v-else class="bg-card rounded-2xl p-6 xl:p-8 border border-border text-center">
                <i class="ti ti-file-text text-5xl text-muted-foreground/50 mb-4 block"></i>
                <p class="text-muted-foreground">محتوایی برای این ویژگی ثبت نشده است.</p>
              </div>
            </div>
            
            <!-- Mobile Premium CTA -->
            <div class="xl:hidden px-4 mt-6">
              <div class="bg-gradient-to-br from-amber-500/10 via-yellow-500/5 to-transparent border border-amber-500/20 rounded-2xl p-4">
                <div class="flex items-center gap-3 mb-3">
                  <i class="ti ti-crown text-xl text-amber-500"></i>
                  <span class="font-bold text-foreground text-sm">اشتراک ویژه</span>
                </div>
                <NuxtLink 
                  to="/dashboard/checkout"
                  class="block w-full py-2.5 bg-gradient-to-r from-amber-500 to-yellow-500 text-white text-center rounded-xl font-medium text-sm"
                >
                  مشاهده پلان‌ها
                </NuxtLink>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useSafeNavigation } from '~/composables/useSafeNavigation'

const router = useRouter()
const route = useRoute()
const { goBack } = useSafeNavigation()

const feature = ref<any>(null)
const isLoading = ref(true)
const error = ref<string | null>(null)

// رنگ‌بندی بر اساس آیدی ویژگی
const colorSchemes = [
  { card: 'bg-gradient-to-br from-blue-500/10 via-blue-500/5 to-transparent border-blue-500/20', icon: 'bg-blue-500/20 dark:bg-blue-500/30', color: 'text-blue-500' },
  { card: 'bg-gradient-to-br from-purple-500/10 via-purple-500/5 to-transparent border-purple-500/20', icon: 'bg-purple-500/20 dark:bg-purple-500/30', color: 'text-purple-500' },
  { card: 'bg-gradient-to-br from-emerald-500/10 via-emerald-500/5 to-transparent border-emerald-500/20', icon: 'bg-emerald-500/20 dark:bg-emerald-500/30', color: 'text-emerald-500' },
  { card: 'bg-gradient-to-br from-pink-500/10 via-pink-500/5 to-transparent border-pink-500/20', icon: 'bg-pink-500/20 dark:bg-pink-500/30', color: 'text-pink-500' },
  { card: 'bg-gradient-to-br from-amber-500/10 via-amber-500/5 to-transparent border-amber-500/20', icon: 'bg-amber-500/20 dark:bg-amber-500/30', color: 'text-amber-500' },
  { card: 'bg-gradient-to-br from-cyan-500/10 via-cyan-500/5 to-transparent border-cyan-500/20', icon: 'bg-cyan-500/20 dark:bg-cyan-500/30', color: 'text-cyan-500' },
  { card: 'bg-gradient-to-br from-rose-500/10 via-rose-500/5 to-transparent border-rose-500/20', icon: 'bg-rose-500/20 dark:bg-rose-500/30', color: 'text-rose-500' },
  { card: 'bg-gradient-to-br from-indigo-500/10 via-indigo-500/5 to-transparent border-indigo-500/20', icon: 'bg-indigo-500/20 dark:bg-indigo-500/30', color: 'text-indigo-500' },
]

const colorIndex = computed(() => {
  if (feature.value?.id) {
    return (feature.value.id - 1) % colorSchemes.length
  }
  return 0
})

const getCardBgClass = computed(() => colorSchemes[colorIndex.value].card)
const getIconBgClass = computed(() => colorSchemes[colorIndex.value].icon)
const getIconColorClass = computed(() => colorSchemes[colorIndex.value].color)

const fetchFeature = async () => {
  isLoading.value = true
  error.value = null
  
  try {
    const { $axios } = useNuxtApp()
    const axios = $axios as any
    const slug = route.params.slug
    
    const response = await axios.get(`features/${slug}`)
    feature.value = response.data.data || response.data
  } catch (err: any) {
    console.error('Error fetching feature:', err)
    if (err.response?.status === 404) {
      error.value = 'ویژگی مورد نظر یافت نشد'
    } else {
      error.value = 'خطا در بارگذاری اطلاعات'
    }
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  fetchFeature()
})
</script>

<style scoped>
.prose :deep(h1),
.prose :deep(h2),
.prose :deep(h3),
.prose :deep(h4) {
  color: var(--color-foreground);
  font-weight: 700;
  margin-bottom: 1rem;
}

.prose :deep(p) {
  color: color-mix(in srgb, var(--color-foreground) 90%, transparent);
  margin-bottom: 1rem;
  line-height: 1.625;
}

.prose :deep(ul),
.prose :deep(ol) {
  color: color-mix(in srgb, var(--color-foreground) 90%, transparent);
  margin-bottom: 1rem;
  padding-right: 1.5rem;
}

.prose :deep(li) {
  margin-bottom: 0.5rem;
}

.prose :deep(a) {
  color: var(--color-primary);
}

.prose :deep(a):hover {
  text-decoration: underline;
}

.prose :deep(img) {
  border-radius: 0.5rem;
  margin-top: 1rem;
  margin-bottom: 1rem;
}

.prose :deep(blockquote) {
  border-right-width: 4px;
  border-right-color: var(--color-primary);
  padding-right: 1rem;
  font-style: italic;
  color: var(--color-muted-foreground);
}
</style>
