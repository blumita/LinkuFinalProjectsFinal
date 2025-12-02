<script setup lang="ts">
import MainLayout from '@/layouts/MainLayout.vue'
import AlertProvider from '@/components/AlertProvider.vue'
</script>

<template>
  <AlertProvider>
    <MainLayout />
  </AlertProvider>
</template>
