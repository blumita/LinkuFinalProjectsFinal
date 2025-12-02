<template>
  <div>
    <!-- اصل محتوا -->
    <slot />

    <!-- Alert Global -->
    <AlertComponent
      v-model="isAlertVisible"
      :options="alertOptions"
      @confirm="confirmAlert"
      @cancel="cancelAlert"
    />
  </div>
</template>

<script setup lang="ts">
import { useAlert } from '@/composables/useAlert'
import AlertComponent from '@/components/Alert/index.vue'

defineOptions({
  name: 'AlertProvider'
})

const {
  isAlertVisible,
  alertOptions,
  confirmAlert,
  cancelAlert
} = useAlert()
</script>
