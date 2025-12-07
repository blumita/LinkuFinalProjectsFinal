<template>
  <div
    :class="[
      'relative p-4 rounded-xl bg-white shadow-sm border transition duration-200 group',
      isActive ? 'ring-2 ring-black border-black' : 'border-gray-200',
      !isActive && !isDisabled ? 'hover:border-gray-300 cursor-pointer' : '',
      isDisabled ? 'opacity-60 cursor-not-allowed' : ''
    ]"
    @click="!isDisabled && $emit('click')"
  >
    <!-- Map container -->
    <div class="space-y-3">
      <!-- Header with icon and title -->
      <div class="flex items-start gap-3">
        <!-- Icon -->
        <div class="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0">
          <img v-if="item.customIcon" :src="item.customIcon" class="w-8 h-8 object-cover rounded" >
          <component 
            v-else-if="iconComponent" 
            :is="iconComponent" 
            :size="24"
            :color="previewColors.iconColor"
            :filled="true"
          />
          <i v-else class="ti ti-map-pin text-xl text-gray-600" />
        </div>

        <!-- Title and address -->
        <div class="flex-1 min-w-0">
          <h3 class="font-medium text-gray-900 text-sm mb-1 truncate">
            {{ item.title || 'نقشه' }}
          </h3>
          <p v-if="item.address" class="text-xs text-gray-500 line-clamp-2">
            {{ item.address }}
          </p>
        </div>
      </div>

      <!-- Interactive Map preview -->
      <div class="h-32 rounded-lg overflow-hidden relative">
        <ClientOnly>
          <MapboxComponent
            :latitude="item.latitude || 35.6892"
            :longitude="item.longitude || 51.3890"
            :zoom="item.zoom || 15"
            :icon-color="previewColors.iconColor || '#e74c3c'"
            :interactive="false"
            :draggable="false"
            :show-marker="true"
            :show-circle="item.zoom && item.zoom < 15"
          />
          <template #fallback>
            <div class="h-full bg-gray-100 flex items-center justify-center">
              <div class="text-center text-gray-400">
                <i class="ti ti-map text-3xl mb-2 block" />
                <p class="text-xs">پیش‌نمایش نقشه</p>
              </div>
            </div>
          </template>
        </ClientOnly>
        
        <!-- Overlay for click handling -->
        <div 
          class="absolute inset-0 bg-transparent cursor-pointer"
          @click.stop="handleMapClick"
          title="کلیک برای مشاهده نقشه کامل"
        />
      </div>

      <!-- Description if available -->
      <p v-if="item.description" class="text-xs text-gray-600 line-clamp-2">
        {{ item.description }}
      </p>
    </div>

    <!-- Admin controls -->
    <div class="absolute top-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity">
      <div class="flex gap-1">
        <button
          @click.stop="$emit('edit')"
          class="w-6 h-6 bg-blue-500 text-white rounded flex items-center justify-center text-xs hover:bg-blue-600"
          title="ویرایش"
        >
          <i class="ti ti-edit" />
        </button>
        <button
          @click.stop="$emit('delete')"
          class="w-6 h-6 bg-red-500 text-white rounded flex items-center justify-center text-xs hover:bg-red-600"
          title="حذف"
        >
          <i class="ti ti-trash" />
        </button>
      </div>
    </div>
  </div>

  <!-- BottomSheet: انتخاب نحوه باز کردن نقشه -->
  <BottomSheet
    v-model="showMapOptions"
    title="مسیریابی"
    size="auto"
    :closable="true"
  >
    <div class="p-4 space-y-3">
      <p class="text-sm text-muted-foreground text-center mb-4">مسیر را با کدام اپلیکیشن ببینید؟</p>
      
      <!-- Google Maps -->
      <a
        :href="googleMapsUrl"
        target="_blank"
        rel="noopener noreferrer"
        @click="showMapOptions = false"
        class="w-full flex items-center gap-3 p-3 rounded-xl border border-border hover:bg-muted transition-colors"
      >
        <div class="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
          <i class="ti ti-brand-google text-green-600 text-xl"></i>
        </div>
        <div class="flex-1 text-right">
          <p class="font-medium text-foreground">Google Maps</p>
          <p class="text-xs text-muted-foreground">مسیریابی با گوگل مپ</p>
        </div>
        <i class="ti ti-route text-muted-foreground"></i>
      </a>

      <!-- Waze - only on Android -->
      <a
        v-if="isAndroid"
        :href="wazeUrl"
        target="_blank"
        rel="noopener noreferrer"
        @click="showMapOptions = false"
        class="w-full flex items-center gap-3 p-3 rounded-xl border border-border hover:bg-muted transition-colors"
      >
        <div class="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
          <i class="ti ti-brand-waze text-blue-600 text-xl"></i>
        </div>
        <div class="flex-1 text-right">
          <p class="font-medium text-foreground">Waze</p>
          <p class="text-xs text-muted-foreground">مسیریابی با ویز</p>
        </div>
        <i class="ti ti-route text-muted-foreground"></i>
      </a>

      <!-- Balad - only on Android -->
      <a
        v-if="isAndroid"
        :href="baladUrl"
        target="_blank"
        rel="noopener noreferrer"
        @click="showMapOptions = false"
        class="w-full flex items-center gap-3 p-3 rounded-xl border border-border hover:bg-muted transition-colors"
      >
        <div class="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
          <i class="ti ti-map-pin text-purple-600 text-xl"></i>
        </div>
        <div class="flex-1 text-right">
          <p class="font-medium text-foreground">بلد</p>
          <p class="text-xs text-muted-foreground">مسیریابی با بلد</p>
        </div>
        <i class="ti ti-route text-muted-foreground"></i>
      </a>

      <!-- Neshan -->
      <a
        :href="neshanUrl"
        target="_blank"
        rel="noopener noreferrer"
        @click="showMapOptions = false"
        class="w-full flex items-center gap-3 p-3 rounded-xl border border-border hover:bg-muted transition-colors"
      >
        <div class="w-10 h-10 rounded-lg bg-orange-100 flex items-center justify-center">
          <i class="ti ti-map-2 text-orange-600 text-xl"></i>
        </div>
        <div class="flex-1 text-right">
          <p class="font-medium text-foreground">نشان</p>
          <p class="text-xs text-muted-foreground">مسیریابی با نشان</p>
        </div>
        <i class="ti ti-route text-muted-foreground"></i>
      </a>

      <!-- Copy Coordinates -->
      <button
        @click="copyCoordinates"
        class="w-full flex items-center gap-3 p-3 rounded-xl border border-border hover:bg-muted transition-colors"
      >
        <div class="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center">
          <i class="ti ti-copy text-gray-600 text-xl"></i>
        </div>
        <div class="flex-1 text-right">
          <p class="font-medium text-foreground">کپی مختصات</p>
          <p class="text-xs text-muted-foreground">{{ item.latitude?.toFixed(6) }}, {{ item.longitude?.toFixed(6) }}</p>
        </div>
      </button>
    </div>
  </BottomSheet>
</template>

<script setup lang="ts">
import { computed, ref, onMounted } from 'vue'
import type { MapBlock } from '@/types/data'
import { usePreviewIconColors } from '@/composables/usePreviewIconColors'
import MapboxComponent from '~/components/MapboxComponent.vue'
import BottomSheet from '~/components/ui/BottomSheet.vue'

const { getIconComponent } = useIconComponents()
const { getPreviewColors } = usePreviewIconColors()

const props = defineProps<{
  item: MapBlock
  isActive?: boolean
  isDisabled?: boolean
  config?: {
    iconColor?: string
    backgroundColor?: string
  }
}>()

defineEmits(['click', 'edit', 'delete'])

// BottomSheet state
const showMapOptions = ref(false)

// Detect mobile device and platform
const isMobile = ref(false)
const isAndroid = ref(false)
const isIOS = ref(false)
onMounted(() => {
  const ua = navigator.userAgent
  isMobile.value = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(ua)
  isAndroid.value = /Android/i.test(ua)
  isIOS.value = /iPhone|iPad|iPod/i.test(ua)
})

// Get preview colors
const previewColors = computed(() => getPreviewColors(props.config))

// Computed URLs for navigation apps - Improved routing URLs
const googleMapsUrl = computed(() => {
  const lat = props.item.latitude || 35.6992
  const lng = props.item.longitude || 51.3890
  // Better Google Maps URL that works on both desktop and mobile
  return `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}&travelmode=driving`
})

const wazeUrl = computed(() => {
  const lat = props.item.latitude || 35.6992
  const lng = props.item.longitude || 51.3890
  return `https://waze.com/ul?ll=${lat},${lng}&navigate=yes`
})

const neshanUrl = computed(() => {
  const lat = props.item.latitude || 35.6992
  const lng = props.item.longitude || 51.3890
  // Neshan routing URL - works better with this format
  return `https://neshan.org/maps/@${lat},${lng},16z/directions/~/${lat},${lng}`
})

const baladUrl = computed(() => {
  const lat = props.item.latitude || 35.6992
  const lng = props.item.longitude || 51.3890
  // Balad deep link for navigation
  if (isAndroid.value) {
    return `balad://showLocation?latitude=${lat}&longitude=${lng}`
  }
  return `https://balad.ir/map?latitude=${lat}&longitude=${lng}`
})

// Icon Management
const iconComponent = computed(() => {
  const icon = props.item.icon
  if (!icon) return null
  
  if (typeof icon === 'string') {
    return getIconComponent(icon)
  }
  
  if (typeof icon === 'object' && icon.type === 'component') {
    return getIconComponent(icon.path || icon.url || '')
  }
  
  return null
})

async function copyCoordinates() {
  const lat = props.item.latitude || 35.6992
  const lng = props.item.longitude || 51.3890
  const coords = `${lat}, ${lng}`
  
  try {
    await navigator.clipboard.writeText(coords)
    // می‌توانید toast نمایش دهید
  } catch (err) {
    console.error('Failed to copy coordinates:', err)
  }
  showMapOptions.value = false
}

// Handle map click - Android uses native share, iOS/Desktop shows bottom sheet
async function handleMapClick() {
  const lat = props.item.latitude || 35.6992
  const lng = props.item.longitude || 51.3890
  const title = props.item.title || 'موقعیت مکانی'
  const address = props.item.address || ''
  
  // Android: Use native share with geo: URI
  if (isAndroid.value && navigator.share) {
    const locationUrl = `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`
    
    try {
      await navigator.share({
        title: title,
        text: address ? `${title}\n${address}` : title,
        url: locationUrl
      })
    } catch (err) {
      // User cancelled or share failed, show bottom sheet as fallback
      if (err.name !== 'AbortError') {
        showMapOptions.value = true
      }
    }
  } else {
    // iOS/Desktop: Show bottom sheet
    showMapOptions.value = true
  }
}
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
