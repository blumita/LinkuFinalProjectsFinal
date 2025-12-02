<template>
  <section class="min-h-screen bg-white flex flex-col items-center py-8 px-2 sm:px-6">


    <!-- لیست ویژگی‌ها -->
    <div class="w-full max-w-2xl mb-8">
      <div v-if="featuresLoading" class="flex justify-center items-center h-20">
        <div class="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-900"></div>
        <span class="mr-2">در حال دریافت لیست ویژگی‌ها...</span>
      </div>
      <div v-else-if="featuresError" class="text-red-500 text-center py-4">
        {{ featuresError }}
      </div>
      <div v-else>
        <div class="mb-6">
          <h2 class="text-lg font-semibold mb-2 text-gray-800">ویژگی‌های اشتراک</h2>
          <p class="text-gray-500 text-sm mb-3">در این بخش می‌توانید با امکانات و قابلیت‌های ویژه اشتراک لینکو آشنا شوید. هر ویژگی را انتخاب کنید تا توضیحات کامل آن را مشاهده کنید.</p>
          <ul class="flex flex-wrap gap-2">
            <li v-for="item in features" :key="item.slug">
              <NuxtLink
                :to="{ path: '/dashboard/feature', query: { slug: item.slug } }"
                class="px-3 py-1 rounded bg-gray-50 hover:bg-gray-100 text-sm transition border border-gray-200"
                :class="{ 'bg-gray-900 text-white font-bold border-gray-900': item.slug === route.query.slug }"
              >
                {{ item.title }}
              </NuxtLink>
            </li>
          </ul>
        </div>
        <div v-if="loading" class="flex justify-center items-center h-40">
          <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
          <span class="mr-3">در حال بارگذاری...</span>
        </div>
        <div v-else-if="error" class="text-red-500 text-center py-8">
          {{ error }}
        </div>
        <div v-else>
          <div class="flex flex-col items-center justify-center text-center mb-8 p-6 bg-white rounded-2xl border border-gray-200 shadow-sm">
            <h1 class="text-3xl font-extrabold mb-4 text-gray-900 sm:text-4xl">{{ feature.title }}</h1>
            <div v-if="feature.description" class="text-lg sm:text-xl text-gray-900 mb-4 font-medium animate-fadein">{{ feature.description }}</div>
            <div v-else-if="feature.content" class="text-base text-gray-700 mb-4 animate-fadein">{{ getShortDescription(feature.content) }}</div>
            <div v-else class="text-gray-400 text-base mb-4 animate-fadein">توضیحی برای این ویژگی ثبت نشده است.</div>
            <div class="prose max-w-none w-full text-right bg-gray-50 rounded-xl p-4 border border-gray-200 mb-6" v-html="feature.content"></div>
            <NuxtLink to="/dashboard/upgrade" class="inline-block bg-gray-900 hover:bg-black text-white font-bold px-8 py-3 rounded-xl text-lg shadow transition-all duration-200">خرید اشتراک و فعال‌سازی این ویژگی</NuxtLink>
          </div>
        </div>
      </div>
    </div>

  </section>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const loading = ref(true)
const error = ref('')
const feature = ref({ title: '', content: '' })

const features = ref([])
const featuresLoading = ref(true)
const featuresError = ref('')

async function fetchFeatures() {
  featuresLoading.value = true
  featuresError.value = ''
  try {
    const res = await fetch('/api/features')
    if (!res.ok) throw new Error('خطا در دریافت لیست ویژگی‌ها')
    const data = await res.json()
    features.value = data
  } catch (e) {
    featuresError.value = e.message || 'خطا در دریافت لیست ویژگی‌ها'
  } finally {
    featuresLoading.value = false
  }
}

async function fetchFeature(slug) {
  loading.value = true
  error.value = ''
  try {
    if (!slug) {
      feature.value = { title: '', content: '' }
      loading.value = false
      return
    }
    const res = await fetch(`/api/features/${slug}`)
    if (!res.ok) throw new Error('خطا در دریافت اطلاعات')
    const data = await res.json()
    feature.value = data
  } catch (e) {
    error.value = e.message || 'خطا در دریافت اطلاعات'
  } finally {
    loading.value = false
  }
}

// تابع برای گرفتن خلاصه کوتاه از content (مثلاً اولین جمله)
function getShortDescription(html) {
  if (!html) return ''
  // حذف تگ‌های HTML و گرفتن اولین جمله
  const text = html.replace(/<[^>]+>/g, '').trim()
  const firstSentence = text.split(/[.!؟\n]/)[0]
  return firstSentence.length > 0 ? firstSentence : text.slice(0, 60) + '...'
}

onMounted(() => {
  fetchFeatures()
  fetchFeature(route.query.slug)
})

watch(() => route.query.slug, (newSlug) => {
  if (newSlug) fetchFeature(newSlug)
})
</script>

<style scoped>
.prose {
  direction: rtl;
}
@keyframes fadein {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: none; }
}
.animate-fadein {
  animation: fadein 0.5s;
}
section {
  min-height: 100vh;
  background: #fff;
}
</style>
