<template>
  <div
    class="border border-border rounded-xl p-4 text-center shadow-sm bg-card min-h-[160px]"
  >
    <!-- حالت لودینگ -->
    <template v-if="loading">
      <div class="flex justify-end text-muted-foreground mb-1">
        <div class="w-4 h-4 rounded-full bg-muted animate-pulse"></div>
      </div>
      <div class="h-6 w-20 bg-muted mx-auto my-2 rounded animate-pulse"></div>
      <div class="h-4 w-24 bg-muted/70 mx-auto my-2 rounded animate-pulse"></div>
      <div class="h-[50px] w-full bg-muted/50 rounded animate-pulse mt-2"></div>
    </template>

    <!-- حالت عادی -->
    <template v-else>
      <div class="flex justify-end text-muted-foreground mb-1">
        <i class="ti ti-info-circle" v-tooltip="tooltip" />
      </div>
      <div class="text-2xl font-bold mb-1 text-foreground">{{ value }}</div>
      <div class="text-sm text-muted-foreground mb-2">{{ label }}</div>

      <div class="h-[50px]">
        <div v-if="!trend || trend.length === 0" class="flex items-center justify-center text-muted-foreground text-xs h-full">
          داده‌ای برای نمودار موجود نیست
        </div>
        <client-only v-else>
          <ApexChart
            :options="chartOptions"
            :series="chartSeries"
            type="line"
            height="50"
          />
        </client-only>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import ApexChart from 'vue3-apexcharts'

const props = defineProps<{
  label: string
  value: string | number
  trend: number[]
  tooltip: string
  loading?: boolean
}>()
// تنظیمات چارت
const chartOptions = {
  chart: {
    sparkline: { enabled: true },
    fontFamily: 'ShabnamFd, sans-serif',
    animations: {
      enabled: false
    },
    toolbar: {
      show: false
    }
  },
  stroke: { 
    curve: 'smooth' as const, 
    width: 2 
  },
  colors: ['#666'],
  tooltip: { enabled: false },
  xaxis: { 
    labels: { show: false },
    axisBorder: { show: false },
    axisTicks: { show: false }
  },
  yaxis: { 
    show: false 
  },
  grid: { 
    show: false,
    padding: {
      left: 0,
      right: 0,
      top: 5,
      bottom: 5
    }
  },
  dataLabels: { enabled: false }
}

// داده‌های چارت
const chartSeries = computed(() => {
  return [{
    name: 'آمار',
    data: props.trend || []
  }]
})
</script>
