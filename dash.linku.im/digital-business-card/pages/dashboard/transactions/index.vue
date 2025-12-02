<template>
  <div class="min-h-screen bg-background">
    <!-- Header -->
    <div class="fixed top-0 left-0 right-0 z-50 bg-card border-b divide-border">
      <div class="flex items-center justify-between px-4 h-16">
        <button @click="navigateTo('/financial')" class="p-2 hover:bg-secondary rounded-lg transition-colors">
          <i class="ti ti-arrow-right text-primary text-xl"></i>
        </button>
        <h1 class="text-lg font-bold text-primary">گزارش پرداخت‌ها</h1>
        <div class="w-10"></div>
      </div>
    </div>

    <!-- Transactions Content -->
    <div class="pt-20 pb-24 px-6">
      <Transactions />
    </div>
  </div>
</template>

<script setup lang="ts">
import Transactions from '~/components/UserDashboard/main/transactions/index.vue'

definePageMeta({
  middleware: 'require-activated',
  layout: 'default'
})
</script>
