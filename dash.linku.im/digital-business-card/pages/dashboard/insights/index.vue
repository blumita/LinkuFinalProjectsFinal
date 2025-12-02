<template>
  <div>
    <Filter/>
  </div>
</template>

<script setup>
import Filter from '~/components/UserDashboard/main/insights/Index.vue'

definePageMeta({
  middleware: 'require-activated'
})
</script>
