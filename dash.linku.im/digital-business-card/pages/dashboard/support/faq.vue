<template>
  <div class="min-h-screen bg-background">
    <!-- Mobile Header -->
    <div class="fixed top-0 left-0 right-0 z-50 bg-card border-b border-border">
      <div class="flex items-center justify-between px-4 h-16">
        <button @click="$router.back()" class="p-2 hover:bg-secondary rounded-lg transition-colors">
          <i class="ti ti-arrow-right text-primary text-xl"></i>
        </button>
        <h1 class="text-lg font-bold text-foreground">سوالات متداول</h1>
        <div class="w-10"></div>
      </div>
    </div>

    <!-- Content -->
    <div class="pt-20 lg:pt-10 pb-6 px-4">
      <!-- Loading State -->
      <div v-if="loading" class="space-y-3">
        <div v-for="n in 5" :key="n" class="bg-card rounded-xl p-4 shadow-sm border border-border animate-pulse">
          <div class="flex items-center gap-3">
            <div class="w-5 h-5 bg-muted rounded"></div>
            <div class="h-4 flex-1 bg-muted rounded"></div>
            <div class="w-4 h-4 bg-muted rounded"></div>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-else-if="!loading && faqs.length === 0" class="text-center py-12">
        <div class="w-20 h-20 rounded-full bg-muted/50 flex items-center justify-center mx-auto mb-4">
          <i class="ti ti-help text-4xl text-muted-foreground"></i>
        </div>
        <h3 class="text-lg font-semibold text-foreground mb-2">سوالی یافت نشد</h3>
        <p class="text-sm text-muted-foreground">در حال حاضر سوال متداولی موجود نیست</p>
      </div>

      <!-- FAQ List -->
      <div v-else class="space-y-3">
        <div 
          v-for="(faq, index) in faqs" 
          :key="faq.id"
          class="bg-card rounded-xl shadow-sm border border-border overflow-hidden"
        >
          <button 
            @click="toggleFaq(index)" 
            class="w-full flex items-center justify-between p-4 text-right hover:bg-secondary/50 transition-colors"
          >
            <div class="flex items-center gap-3 flex-1 min-w-0">
              <i class="ti ti-help-circle text-primary flex-shrink-0"></i>
              <span class="font-medium text-foreground text-sm">{{ faq.question }}</span>
            </div>
            <i 
              :class="openFaq === index ? 'ti ti-chevron-up' : 'ti ti-chevron-down'" 
              class="text-muted-foreground transition-transform flex-shrink-0 text-lg"
            ></i>
          </button>
          
          <transition
            enter-active-class="transition-all duration-200 ease-out"
            enter-from-class="max-h-0 opacity-0"
            enter-to-class="max-h-96 opacity-100"
            leave-active-class="transition-all duration-200 ease-in"
            leave-from-class="max-h-96 opacity-100"
            leave-to-class="max-h-0 opacity-0"
          >
            <div 
              v-show="openFaq === index" 
              class="px-4 pb-4 text-sm text-muted-foreground border-t border-border bg-muted/20 overflow-hidden"
            >
              <div class="pt-3 leading-relaxed">{{ faq.answer }}</div>
            </div>
          </transition>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useNuxtApp } from '#app'
import type { AxiosInstance } from 'axios'

definePageMeta({
  layout: 'default'
})

interface FAQ {
  id: number
  question: string
  answer: string
  order?: number
}

const { $axios } = useNuxtApp()
const axios = $axios as AxiosInstance

const loading = ref(true)
const openFaq = ref<number | null>(null)
const faqs = ref<FAQ[]>([])

const toggleFaq = (index: number) => {
  openFaq.value = openFaq.value === index ? null : index
}

const fetchFAQs = async () => {
  loading.value = true
  try {
    const { data } = await axios.get('faq/list')
    
    if (data && data.data && Array.isArray(data.data)) {
      faqs.value = data.data.sort((a: FAQ, b: FAQ) => (a.order || 0) - (b.order || 0))
    } else if (data && Array.isArray(data.faqs)) {
      faqs.value = data.faqs.sort((a: FAQ, b: FAQ) => (a.order || 0) - (b.order || 0))
    } else if (data && Array.isArray(data)) {
      faqs.value = data.sort((a: FAQ, b: FAQ) => (a.order || 0) - (b.order || 0))
    } else {
      faqs.value = []
    }
  } catch (error) {
    faqs.value = []
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchFAQs()
})
</script>
