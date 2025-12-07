<template>
  <div
    class="border border-border rounded-xl p-4 text-center shadow-sm bg-card min-h-[180px] flex flex-col justify-between"
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

      <div class="h-[60px] -mx-2">
        <div v-if="!trend || trend.length < 2" class="flex items-center justify-center text-muted-foreground text-xs h-full">
          <i class="ti ti-chart-line text-2xl opacity-30"></i>
        </div>
        <client-only v-else>
          <ApexChart
            :options="chartOptions"
            :series="chartSeries"
            type="area"
            height="60"
          />
        </client-only>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import ApexChart from 'vue3-apexcharts'
import { useFormStore } from '~/stores/form'

const props = defineProps<{
  label: string
  value: string | number
  trend: number[]
  tooltip: string
  loading?: boolean
}>()

const formStore = useFormStore()

// رنگ چارت بر اساس رنگ پروفایل
const chartColor = computed(() => {
  // اگر کاربر رنگ سفارشی انتخاب کرده، از آن استفاده کن
  if (formStore.iconColor?.background && formStore.iconColor.background !== 'transparent') {
    return formStore.iconColor.background
  }
  // در غیر این صورت از رنگ primary استفاده کن
  return 'rgb(var(--color-primary))'
})

// تنظیمات چارت با رنگ داینامیک
const chartOptions = computed(() => ({
  chart: {
    sparkline: { enabled: true },
    fontFamily: 'ShabnamFd, sans-serif',
    animations: {
      enabled: true,
      easing: 'easeinout',
      speed: 800
    },
    toolbar: {
      show: false
    }
  },
  stroke: { 
    curve: 'smooth' as const, 
    width: 3 
  },
  colors: [chartColor.value],
  fill: {
    type: 'gradient',
    gradient: {
      shade: 'light',
      type: 'vertical',
      shadeIntensity: 0.5,
      opacityFrom: 0.7,
      opacityTo: 0.3,
      stops: [0, 100]
    }
  },
  tooltip: { 
    enabled: true,
    theme: 'dark',
    y: {
      formatter: (val: number) => val.toString()
    }
  },
  xaxis: { 
    labels: { show: false },
    axisBorder: { show: false },
    axisTicks: { show: false }
  },
  yaxis: { 
    show: false,
    min: 0
  },
  grid: { 
    show: false,
    padding: {
      left: 0,
      right: 0,
      top: 0,
      bottom: 0
    }
  },
  dataLabels: { enabled: false }
}))

// داده‌های چارت
const chartSeries = computed(() => {
  const data = props.trend && props.trend.length > 0 ? props.trend : [0]
  return [{
    name: props.label,
    data
  }]
})
</script>
