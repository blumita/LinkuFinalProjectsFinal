
<template>
  <div class="p-1 lg:p-4">
    <EditCard :cardId="cardId" :cardSlug="cardSlug" />
  </div>
</template>

<script setup>
import EditCard from '~/components/UserDashboard/main/EditCard/index.vue'
import { useRoute, useRouter } from 'vue-router'
import { onMounted, computed } from 'vue'
import { useFormStore } from '~/stores/form'

definePageMeta({
  middleware: 'require-activated',
  ssr: false  // Force client-side rendering to avoid server proxy issues
})

const route = useRoute()
const router = useRouter()
const formStore = useFormStore()

// Check multiple sources for cardId - support both URL patterns
const cardId = computed(() => {
  const id = route.params.cardId || route.query.id || route.params.id
  // Filter out 'undefined' string
  return (id && id !== 'undefined') ? id : null
})

const cardSlug = computed(() => {
  const slug = route.query.slug || route.params.slug
  return (slug && slug !== 'undefined') ? slug : null
})

// If no cardId, redirect to default card or dashboard
onMounted(async () => {
  if (!cardId.value) {
    // Wait for formStore to load cards
    await formStore.fetchCards()
    
    const defaultCard = formStore.defaultCard || (formStore.cards && formStore.cards[0])
    
    if (defaultCard?.id && defaultCard?.slug) {
      // Redirect to the default card
      router.replace(`/dashboard/edit-card?id=${defaultCard.id}&slug=${defaultCard.slug}`)
    } else {
      // No cards at all, go to dashboard
      router.replace('/dashboard')
    }
  }
})
</script>
