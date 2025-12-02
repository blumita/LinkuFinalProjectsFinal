<template>
    <div>
      <VueApexCharts :type="'area'" :height="height" :options="chartOptions" :series="series" />
    </div>
  </template>
  
  <script setup>
  import { computed } from 'vue'
  import VueApexCharts from 'vue3-apexcharts'
  
  const props = defineProps({
    series: Array,
    categories: Array,
    height: {
      type: [String, Number],
      default: 50
    },
    color: {
      type: String,
      default: '#0057ff'
    }
  })
  
  const chartOptions = computed(() => ({
    chart: {
      toolbar: { show: false },
      zoom: { enabled: false },
      sparkline: { enabled: true } // برای حذف حاشیه‌ها
    },
    stroke: {
      curve: 'smooth',
      width: 2
    },
    fill: {
      type: 'gradient',
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.4,
        opacityTo: 0,
        stops: [0, 90, 100]
      }
    },
    colors: [props.color],
    dataLabels: {
      enabled: false
    },
    xaxis: {
      labels: { show: false },
      axisBorder: { show: false },
      axisTicks: { show: false },
      categories: props.categories || []
    },
    yaxis: {
      show: false
    },
    grid: {
      show: false
    },
    markers: {
      size: 0
    },
    tooltip: {
      enabled: true,
      theme: 'light'
    }
  }))
  </script>
  