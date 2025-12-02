<template>
  <div class="min-h-screen bg-background">
    <!-- Mobile Header -->
    <div class="fixed top-0 left-0 right-0 z-50 bg-card border-b border-border">
      <div class="flex items-center justify-between px-4 h-16">
        <button @click="$router.back()" class="p-2 hover:bg-secondary rounded-lg transition-colors">
          <i class="ti ti-arrow-right text-primary text-xl"></i>
        </button>
        <h1 class="text-lg font-bold text-foreground">پشتیبانی آنلاین</h1>
        <div class="w-10"></div>
      </div>
    </div>

    <!-- Content -->
    <div class="pt-20 pb-6 px-4">
      <!-- Loading State -->
      <div v-if="isLoading" class="flex items-center justify-center py-20">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>

      <!-- No Crisp Code -->
      <div v-else-if="!crispCode" class="text-center py-20">
        <div class="w-20 h-20 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
          <i class="ti ti-message-circle-off text-muted-foreground text-3xl"></i>
        </div>
        <p class="text-muted-foreground">چت آنلاین در حال حاضر غیرفعال است</p>
      </div>

      <!-- Crisp Chat Container -->
      <div v-else id="crisp-container"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, nextTick } from 'vue'

definePageMeta({
  layout: 'blank'
})

const isLoading = ref(true)
const crispCode = ref('')

// Fetch support settings from API
const fetchSupportSettings = async () => {
  try {
    const { data } = await useFetch('/api/support/info')
    if (data.value?.data?.crispCode) {
      crispCode.value = data.value.data.crispCode
      await nextTick()
      injectCrispScript()
    }
  } catch (error) {
    console.error('Error fetching support settings:', error)
  } finally {
    isLoading.value = false
  }
}

// Inject Crisp script
const injectCrispScript = () => {
  if (!crispCode.value) return
  
  try {
    // Create script element
    const scriptEl = document.createElement('div')
    scriptEl.innerHTML = crispCode.value
    
    // Get all script tags and execute them
    const scripts = scriptEl.querySelectorAll('script')
    scripts.forEach((script) => {
      const newScript = document.createElement('script')
      if (script.src) {
        newScript.src = script.src
      } else {
        newScript.textContent = script.textContent
      }
      document.head.appendChild(newScript)
    })
  } catch (error) {
    console.error('Error injecting Crisp script:', error)
  }
}

onMounted(() => {
  fetchSupportSettings()
})

// Cleanup on unmount
onUnmounted(() => {
  // Remove Crisp elements if needed
  const crispFrame = document.querySelector('[data-crisp-frame]')
  if (crispFrame) {
    crispFrame.remove()
  }
})
</script>
