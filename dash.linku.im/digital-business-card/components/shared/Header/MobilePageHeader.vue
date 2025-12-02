<template>
  <header class="flex items-center gap-3 p-3 bg-white dark:bg-gray-900 border-b">
    <button @click="$emit('back')" aria-label="back" class="p-2">
      ‹
    </button>
    <h1 class="text-lg font-medium">{{ title }}</h1>
    <slot />
  </header>
</template>

<script setup>
defineProps({
  title: { type: String, default: '' }
})
</script>

<style scoped>
header { align-items: center; }
</style>
