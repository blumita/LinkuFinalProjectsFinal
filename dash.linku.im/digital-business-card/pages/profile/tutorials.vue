<template>
  <div class="min-h-screen bg-background pb-24 lg:pb-12">
    <div class="px-3 lg:px-6 py-3 lg:py-6 bg-background">
      <div class="w-full mx-auto max-w-4xl">
        <!-- Header Banner -->
        <div class="relative overflow-hidden rounded-2xl bg-gradient-to-br from-purple-600 via-purple-700 to-pink-600 p-6 lg:p-8 mb-6 shadow-xl">
          <!-- Background Pattern -->
          <div class="absolute inset-0 opacity-10">
            <div class="absolute top-0 left-0 w-32 h-32 bg-white rounded-full blur-3xl"></div>
            <div class="absolute bottom-0 right-0 w-40 h-40 bg-pink-300 rounded-full blur-3xl"></div>
          </div>
          
          <div class="relative z-10 flex items-center gap-4">
            <div class="w-16 h-16 lg:w-20 lg:h-20 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center shadow-lg">
              <i class="ti ti-video text-3xl lg:text-4xl text-white"></i>
            </div>
            <div class="flex-1">
              <h1 class="text-xl lg:text-2xl font-bold text-white mb-2">ویدیوهای آموزشی</h1>
              <p class="text-purple-100 text-sm lg:text-base">
                آموزش کامل استفاده از محصولات و خدمات لینکو
              </p>
            </div>
          </div>
        </div>

        <!-- Categories Filter -->
        <div v-if="categories.length > 0" class="flex flex-wrap gap-2 mb-6">
          <button
            @click="selectedCategory = ''"
            :class="[
              'px-4 py-2 rounded-full text-sm font-medium transition-all',
              !selectedCategory
                ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/30'
                : 'bg-card text-foreground border border-border hover:border-purple-300'
            ]"
          >
            همه
          </button>
          <button
            v-for="cat in categories"
            :key="cat"
            @click="selectedCategory = cat"
            :class="[
              'px-4 py-2 rounded-full text-sm font-medium transition-all',
              selectedCategory === cat
                ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/30'
                : 'bg-card text-foreground border border-border hover:border-purple-300'
            ]"
          >
            {{ cat }}
          </button>
        </div>

        <!-- Loading -->
        <div v-if="loading" class="flex flex-col justify-center items-center py-20">
          <div class="animate-spin rounded-full h-10 w-10 border-2 border-purple-600 border-t-transparent mb-4"></div>
          <span class="text-muted-foreground">در حال بارگذاری...</span>
        </div>

        <!-- Tutorials List -->
        <div v-else class="space-y-4">
          <div
            v-for="tutorial in filteredTutorials"
            :key="tutorial.id"
            @click="openTutorial(tutorial)"
            class="group bg-card rounded-2xl border border-border overflow-hidden hover:shadow-lg hover:border-purple-300 transition-all duration-300 cursor-pointer"
          >
            <div class="flex flex-col sm:flex-row">
              <!-- Thumbnail -->
              <div class="relative sm:w-48 lg:w-56 aspect-video sm:aspect-auto sm:h-32 lg:h-36 bg-muted flex-shrink-0">
                <img
                  v-if="tutorial.thumbnail"
                  :src="tutorial.thumbnail"
                  :alt="tutorial.title"
                  class="w-full h-full object-cover"
                />
                <div v-else class="w-full h-full flex items-center justify-center bg-gradient-to-br from-purple-500/10 to-pink-500/10">
                  <i class="ti ti-video text-4xl text-purple-400/50"></i>
                </div>
                <!-- Duration Badge -->
                <div v-if="tutorial.duration" class="absolute bottom-2 left-2 px-2 py-1 bg-black/70 text-white text-xs rounded">
                  {{ formatDuration(tutorial.duration) }}
                </div>
                <!-- Play Button -->
                <div class="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/30">
                  <div class="w-12 h-12 rounded-full bg-white/90 flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform">
                    <i class="ti ti-player-play text-xl text-purple-600 mr-[-2px]"></i>
                  </div>
                </div>
              </div>

              <!-- Content -->
              <div class="flex-1 p-4 flex flex-col justify-between">
                <div>
                  <div class="flex items-start justify-between gap-2 mb-2">
                    <h3 class="font-bold text-foreground text-base lg:text-lg line-clamp-2 group-hover:text-purple-600 transition-colors">
                      {{ tutorial.title }}
                    </h3>
                    <span v-if="tutorial.category" class="px-2 py-0.5 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 text-xs rounded-full whitespace-nowrap">
                      {{ tutorial.category }}
                    </span>
                  </div>
                  <p v-if="tutorial.description" class="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                    {{ tutorial.description }}
                  </p>
                </div>
                <div class="flex items-center justify-between mt-3 pt-3 border-t border-border">
                  <span class="text-xs text-muted-foreground">
                    <i class="ti ti-clock ml-1"></i>
                    {{ tutorial.duration ? formatDuration(tutorial.duration) : 'بدون مدت' }}
                  </span>
                  <span class="text-xs text-purple-600 font-medium flex items-center gap-1 group-hover:gap-2 transition-all">
                    مشاهده ویدیو
                    <i class="ti ti-chevron-left"></i>
                  </span>
                </div>
              </div>
            </div>
          </div>

          <!-- Empty State -->
          <div v-if="!loading && filteredTutorials.length === 0" class="text-center py-16">
            <div class="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 flex items-center justify-center">
              <i class="ti ti-video-off text-4xl text-purple-400"></i>
            </div>
            <h3 class="text-lg font-semibold text-foreground mb-2">
              {{ selectedCategory ? 'ویدیویی در این دسته یافت نشد' : 'هنوز ویدیویی منتشر نشده' }}
            </h3>
            <p class="text-muted-foreground max-w-sm mx-auto">
              {{ selectedCategory ? 'دسته‌بندی دیگری را انتخاب کنید' : 'به زودی ویدیوهای آموزشی اضافه خواهند شد' }}
            </p>
            <button
              v-if="selectedCategory"
              @click="selectedCategory = ''"
              class="mt-4 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              نمایش همه ویدیوها
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Video Modal -->
    <Teleport to="body">
      <Transition name="modal">
        <div
          v-if="showModal && selectedTutorial"
          class="fixed inset-0 z-[100] flex items-center justify-center p-4"
        >
          <!-- Backdrop -->
          <div
            class="absolute inset-0 bg-black/80 backdrop-blur-sm"
            @click="closeModal"
          ></div>

          <!-- Modal Content -->
          <div class="relative w-full max-w-4xl bg-card rounded-2xl overflow-hidden shadow-2xl z-10 max-h-[90vh] overflow-y-auto">
            <!-- Close Button -->
            <button
              @click="closeModal"
              class="absolute top-4 left-4 z-20 w-10 h-10 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-black/70 transition-colors"
            >
              <i class="ti ti-x text-xl"></i>
            </button>

            <!-- Video Player Area -->
            <div class="aspect-video bg-black relative">
              <iframe
                v-if="getEmbedUrl(selectedTutorial.video_url)"
                :src="getEmbedUrl(selectedTutorial.video_url)"
                class="w-full h-full"
                allowfullscreen
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              ></iframe>
              <div v-else class="w-full h-full flex flex-col items-center justify-center text-white">
                <i class="ti ti-video-off text-5xl mb-4 opacity-50"></i>
                <p class="text-lg mb-4">ویدیو قابل نمایش در این قالب نیست</p>
                <a
                  :href="selectedTutorial.video_url"
                  target="_blank"
                  class="px-6 py-3 bg-purple-600 hover:bg-purple-700 rounded-xl text-white font-medium flex items-center gap-2 transition-colors"
                >
                  <i class="ti ti-external-link"></i>
                  مشاهده در سایت اصلی
                </a>
              </div>
            </div>

            <!-- Video Info -->
            <div class="p-6">
              <div class="flex items-start justify-between gap-4 mb-4">
                <h2 class="text-xl font-bold text-foreground">{{ selectedTutorial.title }}</h2>
                <span v-if="selectedTutorial.category" class="px-3 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 text-sm rounded-full whitespace-nowrap">
                  {{ selectedTutorial.category }}
                </span>
              </div>
              <p v-if="selectedTutorial.description" class="text-muted-foreground leading-relaxed">
                {{ selectedTutorial.description }}
              </p>
              <div v-if="selectedTutorial.duration" class="mt-4 pt-4 border-t border-border">
                <span class="text-sm text-muted-foreground">
                  <i class="ti ti-clock ml-1"></i>
                  مدت زمان: {{ formatDuration(selectedTutorial.duration) }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'

interface Tutorial {
  id: number
  title: string
  slug: string
  description: string | null
  video_url: string
  thumbnail: string | null
  duration: number | null
  category: string | null
  order: number
  is_active: boolean
}

const nuxtApp = useNuxtApp()
const $axios = (nuxtApp as any).$axios

// State
const tutorials = ref<Tutorial[]>([])
const categories = ref<string[]>([])
const loading = ref(true)
const selectedCategory = ref('')
const showModal = ref(false)
const selectedTutorial = ref<Tutorial | null>(null)

// Computed
const filteredTutorials = computed(() => {
  if (!selectedCategory.value) {
    return tutorials.value
  }
  return tutorials.value.filter(t => t.category === selectedCategory.value)
})

// Format duration
const formatDuration = (seconds: number): string => {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
}

// Get embed URL for video
const getEmbedUrl = (url: string): string | undefined => {
  if (!url) return undefined

  // YouTube
  const ytMatch = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/)
  if (ytMatch) {
    return `https://www.youtube.com/embed/${ytMatch[1]}`
  }

  // Aparat
  const aparatMatch = url.match(/aparat\.com\/v\/([a-zA-Z0-9]+)/)
  if (aparatMatch) {
    return `https://www.aparat.com/video/video/embed/videohash/${aparatMatch[1]}/vt/frame`
  }

  // Vimeo
  const vimeoMatch = url.match(/vimeo\.com\/(\d+)/)
  if (vimeoMatch) {
    return `https://player.vimeo.com/video/${vimeoMatch[1]}`
  }

  return undefined
}

// Open tutorial modal
const openTutorial = (tutorial: Tutorial) => {
  selectedTutorial.value = tutorial
  showModal.value = true
  document.body.style.overflow = 'hidden'
}

// Close modal
const closeModal = () => {
  showModal.value = false
  selectedTutorial.value = null
  document.body.style.overflow = ''
}

// Fetch tutorials
const fetchTutorials = async () => {
  loading.value = true
  try {
    const response = await $axios.get('/tutorials')
    tutorials.value = response.data || []
  } catch (error) {
    console.error('Error fetching tutorials:', error)
  } finally {
    loading.value = false
  }
}

// Fetch categories
const fetchCategories = async () => {
  try {
    const response = await $axios.get('/tutorials/categories')
    categories.value = response.data || []
  } catch (error) {
    console.error('Error fetching categories:', error)
  }
}

onMounted(() => {
  fetchTutorials()
  fetchCategories()
})

// Handle escape key
onMounted(() => {
  const handleEscape = (e: KeyboardEvent) => {
    if (e.key === 'Escape' && showModal.value) {
      closeModal()
    }
  }
  window.addEventListener('keydown', handleEscape)
  return () => window.removeEventListener('keydown', handleEscape)
})

definePageMeta({
  layout: 'default'
})
</script>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: all 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-from .relative,
.modal-leave-to .relative {
  transform: scale(0.95);
}
</style>
