<!-- SkeletonProfile.vue -->
<template>
  <div
      :class="[
      'flex items-center animate-pulse',
      props.layout === 'center' ? 'flex-col items-center text-center space-y-2' :
      props.layout === 'portrait' ? 'flex-col items-start text-right space-y-2' :
      props.layout === 'left' ? 'flex-row items-center gap-3' :
      'flex-row-reverse items-center gap-3'
    ]"
  >
    <!-- آواتار -->
    <div
        :class="[
        'bg-gray-300 rounded-full',
        props.layout === 'portrait' ? 'w-16 h-16' :
        props.layout === 'center' ? 'w-20 h-20' :
        'w-12 h-12'
      ]"
    ></div>

    <!-- متن‌ها -->
    <div
        :class="[
        'flex flex-col gap-2',
        props.layout === 'center' ? 'items-center' :
        props.layout === 'portrait' ? 'items-start' :
        props.layout === 'left' ? 'items-start' :
        'items-end'
      ]"
    >
      <div class="h-4 w-32 bg-gray-300 rounded-full"></div>
      <div class="h-3 w-24 bg-gray-200 rounded-full"></div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  layout: {
    type: String,
    default: 'right',
  },
})
</script>