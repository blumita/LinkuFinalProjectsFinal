<template>
  <div
    class="relative my-4 rounded-xl overflow-hidden transition duration-200 group cursor-pointer"
    @click="!isDisabled && (showMapOptions = true)"
  >
    <!-- Map container - فقط نقشه بدون پس‌زمینه اضافی -->
    <div class="h-40 rounded-xl overflow-hidden relative border border-black/10 shadow-sm">
      <ClientOnly>
        <MapboxComponent
            :latitude="mapData?.latitude || 35.6892"
            :longitude="mapData?.longitude || 51.3890"
            :zoom="mapData?.zoom || 15"
            :icon-color="iconColor"
            :interactive="false"
            :draggable="false"
            :show-marker="true"
            :show-circle="true"
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
          @click.stop="showMapOptions = true"
          title="کلیک برای مسیریابی"
      />
    </div>
    
    <!-- آدرس و توضیحات زیر نقشه -->
    <div v-if="mapData?.address || mapData?.description" class="px-3 py-3 space-y-2">
      <!-- آدرس -->
      <div v-if="mapData?.address" class="flex items-start gap-2">
        <i class="ti ti-map-pin text-primary text-base mt-0.5 flex-shrink-0"></i>
        <p class="text-sm text-foreground leading-relaxed break-words">{{ mapData.address }}</p>
      </div>
      
      <!-- توضیحات -->
      <div v-if="mapData?.description && mapData.description.trim()" class="text-xs text-muted-foreground leading-relaxed whitespace-pre-line break-words">
        {{ mapData.description }}
      </div>
    </div>
  </div>

  <!-- BottomSheet: انتخاب نحوه باز کردن نقشه -->
  <BottomSheet
    v-model="showMapOptions"
    :title="mapData?.title || 'مسیریابی'"
    size="auto"
    :closable="true"
  >
    <div class="p-4 space-y-3">
      <!-- آدرس و توضیحات -->
      <div v-if="mapData?.address || mapData?.description" class="bg-muted/50 rounded-xl p-4 mb-4 space-y-3">
        <!-- آدرس -->
        <div v-if="mapData?.address" class="flex items-start gap-2">
          <i class="ti ti-map-pin text-primary text-lg mt-0.5 flex-shrink-0"></i>
          <p class="text-sm text-foreground leading-relaxed break-words">{{ mapData.address }}</p>
        </div>
        
        <!-- توضیحات -->
        <div v-if="mapData?.description && mapData.description.trim()" class="flex items-start gap-2">
          <i class="ti ti-info-circle text-muted-foreground text-lg mt-0.5 flex-shrink-0"></i>
          <p class="text-xs text-muted-foreground leading-relaxed whitespace-pre-line break-words">{{ mapData.description }}</p>
        </div>
      </div>

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

      <!-- Waze - only on mobile -->
      <a
        v-if="isMobile"
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
          <p class="text-xs text-muted-foreground">{{ mapData?.latitude?.toFixed(6) }}, {{ mapData?.longitude?.toFixed(6) }}</p>
        </div>
      </button>
    </div>
  </BottomSheet>
</template>

<script setup lang="ts">
import { computed, ref, onMounted } from 'vue'
import type { MapBlock } from '@/types/data'
import MapboxComponent from '~/components/MapboxComponent.vue'
import BottomSheet from '~/components/ui/BottomSheet.vue'
import { useFormStore } from '~/stores/form'

const { getIconComponent } = useIconComponents()
const formStore = useFormStore()

const props = defineProps<{
  item?: MapBlock
  link?: MapBlock
  isActive?: boolean
  isDisabled?: boolean
  iconBg?: string
}>()

defineEmits(['click'])

// BottomSheet state
const showMapOptions = ref(false)

// Detect mobile device
const isMobile = ref(false)
onMounted(() => {
  isMobile.value = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
})

// Use item or link (for backward compatibility)
const mapData = computed(() => props.item || props.link)

// Get icon color from store or props
const iconColor = computed(() => {
  if (props.iconBg && props.iconBg !== '#000000' && props.iconBg !== 'transparent') {
    return props.iconBg
  }
  if (formStore.iconColor?.background && formStore.iconColor.background !== 'transparent') {
    return formStore.iconColor.background
  }
  return '#e74c3c' // default red
})

// Icon Management
const iconComponent = computed(() => {
  const icon = mapData.value?.icon
  if (!icon) return null
  
  if (typeof icon === 'string') {
    return getIconComponent(icon)
  }
  
  if (typeof icon === 'object' && icon.type === 'component') {
    return getIconComponent(icon.path || icon.url || '')
  }
  
  return null
})

// Computed URLs for navigation apps - Improved routing URLs
const googleMapsUrl = computed(() => {
  const lat = mapData.value?.latitude || 35.6992
  const lng = mapData.value?.longitude || 51.3890
  // Better Google Maps URL that works on both desktop and mobile
  return `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}&travelmode=driving`
})

const wazeUrl = computed(() => {
  const lat = mapData.value?.latitude || 35.6992
  const lng = mapData.value?.longitude || 51.3890
  return `https://waze.com/ul?ll=${lat},${lng}&navigate=yes`
})

const neshanUrl = computed(() => {
  const lat = mapData.value?.latitude || 35.6992
  const lng = mapData.value?.longitude || 51.3890
  // Neshan routing URL - works better with this format
  return `https://neshan.org/maps/@${lat},${lng},16z/directions/~/${lat},${lng}`
})

async function copyCoordinates() {
  const lat = mapData.value?.latitude || 35.6992
  const lng = mapData.value?.longitude || 51.3890
  const coords = `${lat}, ${lng}`
  
  try {
    await navigator.clipboard.writeText(coords)
    // می‌توانید toast نمایش دهید
  } catch (err) {
    console.error('Failed to copy coordinates:', err)
  }
  showMapOptions.value = false
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
