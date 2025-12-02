<template>
  <NuxtLink 
    :to="to"
    class="block bg-card border border-border rounded-2xl relative min-h-[280px] overflow-hidden transition-all hover:shadow-lg hover:border-primary/30"
  >
    <!-- Background Illustration Area -->
    <div class="w-full h-32 mb-6 relative flex items-center justify-center bg-muted/10">
      <div 
        class="w-16 h-16 rounded-full flex items-center justify-center"
        :class="status === 'done' ? 'bg-success/20' : 'bg-primary/20'"
      >
        <i :class="[icon, 'text-2xl', status === 'done' ? 'text-success' : 'text-primary']"></i>
      </div>
      
      <!-- Status Badge -->
      <div 
        v-if="status === 'done'"
        class="absolute top-4 right-4 w-8 h-8 bg-success rounded-full flex items-center justify-center"
      >
        <i class="ti ti-check text-white text-sm"></i>
      </div>
    </div>

    <!-- Content -->
    <div class="space-y-3 mb-12 px-6 text-center">
      <h3 class="font-semibold text-foreground">{{ title }}</h3>
      <p class="text-sm text-muted-foreground leading-relaxed">{{ description }}</p>
    </div>

    <!-- Footer Action -->
    <div class="absolute bottom-0 left-0 right-0 flex items-center justify-between px-6 py-4 border-t border-border/30">
      <div class="flex items-center gap-2">
        <span class="text-sm font-medium" :class="status === 'done' ? 'text-success' : 'text-primary'">
          {{ status === 'done' ? 'انجام شده' : action }}
        </span>
        <i 
          :class="status === 'done' ? 'ti ti-check' : 'ti ti-chevron-left'"
          class="text-sm"
        ></i>
      </div>
      
      <div 
        class="w-6 h-6 rounded-full flex items-center justify-center"
        :class="status === 'done' ? 'bg-success/20' : 'bg-primary/20'"
      >
        <i 
          :class="status === 'done' ? 'ti ti-check text-success' : 'ti ti-arrow-left text-primary'"
          class="text-xs"
        ></i>
      </div>
    </div>
  </NuxtLink>
</template>

<script setup lang="ts">
defineProps<{
  icon: string
  title: string
  description: string
  action: string
  status: 'done' | 'pending'
  to: string
}>()
</script>

<style scoped>
/* Hover effects */
</style>
