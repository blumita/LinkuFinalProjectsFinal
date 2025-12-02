<template>
  <div class="p-4">
    <AddCard/>
  </div>
</template>

<script setup>
import AddCard from '~/components/UserDashboard/main/AddCard/index.vue'

definePageMeta({
  middleware: 'require-activated'
})
</script>
