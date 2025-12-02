<template>
  <div></div>
</template>

<script setup lang="ts">
// Redirect to activate page - QR scanner is integrated there
definePageMeta({
  layout: 'default',
  middleware: 'require-activated'
})

// Redirect immediately
onMounted(() => {
  navigateTo('/dashboard/activate')
})
</script>
