<template>
  <div class="icon-wrapper" :style="{ width: size + 'px', height: size + 'px' }">
    <svg 
      :width="size" 
      :height="size" 
      viewBox="0 0 24 24" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      :style="iconStyle"
    >
      <path 
        d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" 
        :fill="filled ? color : 'none'"
        stroke="currentColor" 
        stroke-width="2" 
        stroke-linecap="round" 
        stroke-linejoin="round"
      />
      <line 
        x1="12" 
        x2="12" 
        y1="9" 
        y2="13" 
        stroke="currentColor" 
        stroke-width="2" 
        stroke-linecap="round"
      />
      <line 
        x1="12" 
        x2="12.01" 
        y1="17" 
        y2="17" 
        stroke="currentColor" 
        stroke-width="2" 
        stroke-linecap="round"
      />
    </svg>
  </div>
</template>

<script setup lang="ts">
interface Props {
  size?: number
  color?: string
  filled?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  size: 24,
  color: 'currentColor',
  filled: false
})

const iconStyle = computed(() => ({
  color: props.color
}))
</script>

<style scoped>
.icon-wrapper {
  display: inline-flex;
  align-items: center;
  justify-content: center;
}
</style>
