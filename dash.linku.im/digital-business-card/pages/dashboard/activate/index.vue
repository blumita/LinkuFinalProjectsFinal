<template>
  <div class="w-full min-h-screen">
    <!-- Main Content -->
    <div class="p-4">
      <CardList />
    </div>
  </div>
</template>

<script setup lang="ts">
import CardList from '~/components/UserDashboard/main/Activate/CardList.vue'

definePageMeta({
  layout: 'default'
})
</script>
