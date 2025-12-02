<template>
  <div>
    <ClientOnly>
      <Success/>
    </ClientOnly>
  </div>
</template>

<script setup>
import Success from '~/components/UserDashboard/main/success/index.vue'
definePageMeta({
  middleware: 'require-activated'
})

</script>
