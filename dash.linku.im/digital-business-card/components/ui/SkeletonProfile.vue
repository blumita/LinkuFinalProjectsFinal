<!-- SkeletonProfile.vue - Full Page Skeleton for Profile -->
<template>
  <div class="w-full h-screen bg-background overflow-hidden">
    <!-- Cover Skeleton -->
    <div class="relative w-full h-40 bg-muted animate-pulse">
      <div class="absolute top-4 right-4 w-10 h-10 bg-background/50 rounded-full"></div>
    </div>

    <!-- Profile Info Section -->
    <div class="px-6 -mt-12 relative z-10">
      <!-- Avatar Skeleton -->
      <div class="w-24 h-24 rounded-full bg-muted border-4 border-background animate-pulse mb-4"></div>

      <!-- Name & Bio -->
      <div class="space-y-3 mb-6">
        <div class="h-6 w-40 bg-muted rounded-lg animate-pulse"></div>
        <div class="h-4 w-32 bg-muted rounded-lg animate-pulse"></div>
        <div class="space-y-2 mt-4">
          <div class="h-3 w-full bg-muted rounded-lg animate-pulse"></div>
          <div class="h-3 w-3/4 bg-muted rounded-lg animate-pulse"></div>
        </div>
      </div>

      <!-- Stats Skeleton -->
      <div class="grid grid-cols-3 gap-4 mb-6">
        <div v-for="i in 3" :key="i" class="text-center">
          <div class="h-8 w-16 bg-muted rounded-lg animate-pulse mx-auto mb-2"></div>
          <div class="h-3 w-12 bg-muted rounded-lg animate-pulse mx-auto"></div>
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="grid grid-cols-2 gap-3 mb-6">
        <div class="h-11 bg-muted rounded-xl animate-pulse"></div>
        <div class="h-11 bg-muted rounded-xl animate-pulse"></div>
      </div>

      <!-- Links Skeleton -->
      <div class="space-y-3">
        <div v-for="i in 5" :key="i" class="flex items-center gap-4 p-4 bg-card border border-border rounded-xl animate-pulse">
          <div class="w-12 h-12 bg-muted rounded-xl flex-shrink-0"></div>
          <div class="flex-1 space-y-2">
            <div class="h-4 w-3/4 bg-muted rounded-lg"></div>
            <div class="h-3 w-1/2 bg-muted rounded-lg"></div>
          </div>
          <div class="w-6 h-6 bg-muted rounded-full flex-shrink-0"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
// Full page skeleton - no props needed
</script>

<style scoped>
/* Smooth pulse animation */
@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

.animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}
</style>
