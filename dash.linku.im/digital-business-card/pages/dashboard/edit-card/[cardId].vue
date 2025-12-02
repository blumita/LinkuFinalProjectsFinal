<template>
  <div class="p-4">
    <EditCard :cardId="cardId" :cardSlug="cardSlug" />
  </div>
</template>

<script setup>
import EditCard from '~/components/UserDashboard/main/EditCard/index.vue'
import { useRoute } from 'vue-router'

definePageMeta({
  middleware: 'require-activated',
  ssr: false  // Force client-side rendering to avoid server proxy issues
})

const route = useRoute()
// For dynamic route like /dashboard/edit-card/123
const cardId = route.params.cardId || route.query.id || null
const cardSlug = route.query.slug || route.params.slug || null


</script>