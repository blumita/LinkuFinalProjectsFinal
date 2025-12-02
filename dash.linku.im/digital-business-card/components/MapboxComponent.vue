<template>
  <!-- Static Map Preview with Marker (for preview mode) -->
  <div 
    v-if="props.showMarker && !props.interactive"
    class="h-full w-full relative"
  >
    <div ref="staticMapContainer" class="h-full w-full" />
    <!-- Static Marker (only show if not showing circle) -->
    <div 
      v-if="!props.showCircle"
      class="absolute pointer-events-none z-10"
      style="left: calc(50% - 15px); top: calc(50% - 38px);"
    >
      <svg width="30" height="38" viewBox="0 0 40 50" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M20 0C8.954 0 0 8.954 0 20C0 35 20 50 20 50S40 35 40 20C40 8.954 31.046 0 20 0Z" :fill="iconColor"/>
        <circle cx="20" cy="20" r="8" fill="white"/>
      </svg>
    </div>
    <!-- Circle indicator for approximate location -->
    <div 
      v-if="props.showCircle"
      class="absolute pointer-events-none z-10"
      style="left: 50%; top: 50%; transform: translate(-50%, -50%);"
    >
      <!-- Single dot marker -->
      <div 
        class="rounded-full"
        :style="{
          width: '10px',
          height: '10px',
          backgroundColor: iconColor,
          boxShadow: `0 0 0 3px ${iconColor}30, 0 0 0 6px ${iconColor}15`
        }"
      />
    </div>
    <!-- Loading -->
    <div 
      v-if="staticMapLoading"
      class="absolute inset-0 bg-muted/80 flex items-center justify-center"
    >
      <div class="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
    </div>
  </div>

  <!-- Initial Placeholder - Before opening fullscreen map -->
  <div 
    v-else-if="!isFullscreen"
    @click="openFullscreenMap"
    class="h-full w-full relative bg-muted/30 border-2 border-dashed border-muted-foreground/30 rounded-xl cursor-pointer hover:border-primary/50 hover:bg-muted/50 transition-all duration-300 flex flex-col items-center justify-center gap-3 min-h-[150px]"
  >
    <div class="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center">
      <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-primary">
        <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/>
        <circle cx="12" cy="10" r="3"/>
      </svg>
    </div>
    <span class="text-sm font-medium text-muted-foreground">انتخاب موقعیت روی نقشه</span>
    <span v-if="selectedAddress" class="text-xs text-primary/80 text-center px-4">{{ selectedAddress }}</span>
  </div>

  <!-- Fullscreen Map Modal -->
  <Teleport to="body">
    <Transition name="map-fade">
      <div 
        v-if="isFullscreen"
        class="fixed inset-0 z-[9999] bg-background"
      >
        <!-- Header -->
        <div class="absolute top-0 left-0 right-0 z-30 bg-background/95 backdrop-blur-sm border-b border-border px-4 py-3 flex items-center justify-between">
          <button 
            @click="closeFullscreenMap"
            class="w-10 h-10 flex items-center justify-center rounded-full hover:bg-muted transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="m15 18-6-6 6-6"/>
            </svg>
          </button>
          <h2 class="text-base font-semibold">انتخاب موقعیت</h2>
          <button 
            @click="confirmLocation"
            class="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors"
          >
            تأیید
          </button>
        </div>

        <!-- Search Box on Map -->
        <div class="absolute top-[72px] left-4 right-4 z-30">
          <div class="relative">
            <input
                v-model="searchQuery"
                type="text"
                placeholder="جستجوی آدرس یا نام مکان..."
                class="w-full px-4 py-3 bg-background/95 backdrop-blur-sm rounded-xl border border-border text-sm text-foreground shadow-lg pr-10"
                @input="handleSearch"
                @keydown.enter="handleSearchEnter"
            >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="absolute right-3 top-3.5 text-muted-foreground">
              <circle cx="11" cy="11" r="8"/>
              <path d="m21 21-4.3-4.3"/>
            </svg>

            <!-- Search Results -->
            <div v-if="searchResults.length > 0"
                 class="absolute top-full left-0 right-0 mt-2 bg-background border border-border rounded-xl shadow-lg z-[9999] max-h-60 overflow-y-auto">
              <button
                  v-for="result in searchResults"
                  :key="result.place_id"
                  @click="selectSearchResult(result)"
                  class="w-full px-4 py-3 text-right hover:bg-muted border-b border-border last:border-b-0 text-foreground transition-colors"
              >
                <div class="text-sm font-medium leading-relaxed">{{ result.display_name }}</div>
              </button>
            </div>
          </div>
        </div>

        <!-- Map Container -->
        <div ref="mapContainer" class="h-full w-full pt-[60px]" />
        
        <!-- Custom Center Marker -->
        <div 
          v-if="markerVisible"
          class="absolute pointer-events-none z-10"
          :style="markerStyle"
        >
          <div 
            class="relative"
            :style="{ color: iconColor }"
          >
            <svg width="40" height="50" viewBox="0 0 40 50" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M20 0C8.954 0 0 8.954 0 20C0 35 20 50 20 50S40 35 40 20C40 8.954 31.046 0 20 0Z" :fill="iconColor"/>
              <circle cx="20" cy="20" r="8" fill="white"/>
            </svg>
          </div>
        </div>

        <!-- My Location Button -->
        <button 
          @click="goToMyLocation"
          class="absolute bottom-24 left-4 z-20 w-12 h-12 bg-background shadow-lg rounded-full flex items-center justify-center hover:bg-muted transition-colors border border-border"
          :class="{ 'animate-pulse': isLocating }"
        >
          <svg v-if="!isLocating" xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-primary">
            <circle cx="12" cy="12" r="3"/>
            <path d="M12 2v2"/>
            <path d="M12 20v2"/>
            <path d="M2 12h2"/>
            <path d="M20 12h2"/>
            <path d="M12 12L4.93 4.93"/>
            <path d="M12 12l7.07-7.07"/>
            <path d="M12 12l7.07 7.07"/>
            <path d="M12 12L4.93 19.07"/>
          </svg>
          <div v-else class="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
        </button>

        <!-- Address Display -->
        <div 
          v-if="currentAddress"
          class="absolute bottom-6 left-4 right-4 z-20 bg-background/95 backdrop-blur-sm rounded-xl p-4 shadow-lg border border-border"
        >
          <p class="text-sm text-foreground text-right leading-relaxed">{{ currentAddress }}</p>
        </div>
        
        <!-- Loading Overlay -->
        <div 
          v-if="isLoading"
          class="absolute inset-0 bg-muted/80 flex items-center justify-center z-40"
        >
          <div class="text-center">
            <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
            <p class="text-sm text-muted-foreground">در حال بارگذاری نقشه...</p>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch, computed, nextTick } from 'vue'

interface Props {
  latitude?: number
  longitude?: number
  zoom?: number
  iconColor?: string
  interactive?: boolean
  draggable?: boolean
  showMarker?: boolean // برای نمایش مارکر در حالت استاتیک
  showCircle?: boolean // برای نمایش دایره محدوده در موقعیت تقریبی
}

interface Emits {
  (e: 'locationChange', data: { latitude: number; longitude: number }): void
  (e: 'confirm', data: { latitude: number; longitude: number; address?: string }): void
}

const props = withDefaults(defineProps<Props>(), {
  latitude: 35.6992,
  longitude: 51.3890,
  zoom: 14,
  iconColor: '#000000',
  interactive: true,
  draggable: true,
  showMarker: false,
  showCircle: false
})

const emit = defineEmits<Emits>()

// Mapbox Access Token
const MAPBOX_TOKEN = 'pk.eyJ1IjoiYmFiYXdlYiIsImEiOiJjazhwM201OXEweXU1M2VyeHozMHM3M3BrIn0.DuvjLzA_Knm6g4cjKzSVMQ'
// MapTiler Style URL
const MAPTILER_STYLE = 'https://api.maptiler.com/maps/019a608b-fabf-7fcb-bcec-ff6e8a08b5ab/style.json?key=HTMa05qfktg8OBQdL2hA'

const mapContainer = ref<HTMLDivElement>()
const staticMapContainer = ref<HTMLDivElement>()
const isLoading = ref(true)
const staticMapLoading = ref(true)
const markerVisible = ref(false)
const isFullscreen = ref(false)
const isLocating = ref(false)
const currentAddress = ref('')
const selectedAddress = ref('')
const currentLocation = ref({ latitude: props.latitude, longitude: props.longitude })

// Search functionality
const searchQuery = ref('')
const searchResults = ref<any[]>([])
let searchTimeout: NodeJS.Timeout | null = null

let map: any = null
let staticMap: any = null
let mapboxgl: any = null

const markerStyle = computed(() => ({
  left: `calc(50% - 20px)`,
  top: `calc(50% - 50px + 30px)`,
  transition: 'none'
}))

const loadMapboxGL = async () => {
  if (typeof window === 'undefined') return null
  
  // Dynamic import mapbox-gl
  const mapboxModule = await import('mapbox-gl')
  await import('mapbox-gl/dist/mapbox-gl.css')
  
  return mapboxModule.default
}

// RTL Plugin setup
const setupRTLTextPlugin = (mapboxgl: any) => {
  try {
    if (!mapboxgl.getRTLTextPluginStatus || mapboxgl.getRTLTextPluginStatus() === 'unavailable') {
      mapboxgl.setRTLTextPlugin(
        'https://api.mapbox.com/mapbox-gl-js/plugins/mapbox-gl-rtl-text/v0.3.0/mapbox-gl-rtl-text.js',
        null,
        true
      )
    }
  } catch (error) {
    console.warn('RTL plugin already loaded or error:', error)
  }
}

const openFullscreenMap = () => {
  isFullscreen.value = true
  // Disable body scroll
  document.body.style.overflow = 'hidden'
  nextTick(() => {
    initMap()
  })
}

const closeFullscreenMap = () => {
  isFullscreen.value = false
  document.body.style.overflow = ''
  if (map) {
    map.remove()
    map = null
  }
  markerVisible.value = false
  isLoading.value = true
}

const confirmLocation = () => {
  selectedAddress.value = currentAddress.value
  emit('confirm', { 
    latitude: currentLocation.value.latitude, 
    longitude: currentLocation.value.longitude,
    address: currentAddress.value 
  })
  closeFullscreenMap()
}

const goToMyLocation = async () => {
  if (!navigator.geolocation) {
    alert('مرورگر شما از موقعیت‌یابی پشتیبانی نمی‌کند')
    return
  }

  isLocating.value = true
  
  try {
    const position = await new Promise<GeolocationPosition>((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(resolve, reject, {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      })
    })

    const { latitude, longitude } = position.coords
    
    if (map) {
      map.flyTo({
        center: [longitude, latitude],
        zoom: 16,
        duration: 1500
      })
    }
  } catch (error: any) {
    console.error('Error getting location:', error)
    let message = 'خطا در دریافت موقعیت'
    if (error.code === 1) {
      message = 'دسترسی به موقعیت رد شد. لطفاً دسترسی را فعال کنید.'
    } else if (error.code === 2) {
      message = 'موقعیت در دسترس نیست'
    } else if (error.code === 3) {
      message = 'زمان درخواست تمام شد'
    }
    alert(message)
  } finally {
    isLocating.value = false
  }
}

const getAddressFromCoords = async (lat: number, lng: number) => {
  try {
    // Iran bounding box for filtering
    const iranBbox = '44.0,25.0,63.5,40.0'
    const response = await fetch(
      `https://api.mapbox.com/geocoding/v5/mapbox.places/${lng},${lat}.json?access_token=${MAPBOX_TOKEN}&language=fa&types=address,poi,place,locality,neighborhood&country=IR&bbox=${iranBbox}`
    )
    const data = await response.json()
    
    if (data.features && data.features.length > 0) {
      currentAddress.value = data.features[0].place_name_fa || data.features[0].place_name || ''
    } else {
      currentAddress.value = ''
    }
  } catch (error) {
    console.error('Error getting address:', error)
    currentAddress.value = ''
  }
}

// Search functionality
const handleSearch = () => {
  if (searchTimeout) {
    clearTimeout(searchTimeout)
  }

  searchTimeout = setTimeout(async () => {
    if (searchQuery.value.trim().length < 3) {
      searchResults.value = []
      return
    }

    try {
      // Iran bounding box: SW(44.0, 25.0) to NE(63.5, 40.0)
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery.value)}&countrycodes=ir&viewbox=44.0,40.0,63.5,25.0&bounded=1&limit=5&accept-language=fa`
      )
      const data = await response.json()
      searchResults.value = data
    } catch (error) {
      searchResults.value = []
    }
  }, 300)
}

const handleSearchEnter = () => {
  if (searchResults.value.length > 0) {
    selectSearchResult(searchResults.value[0])
  }
}

const selectSearchResult = (result: any) => {
  const lat = parseFloat(result.lat)
  const lng = parseFloat(result.lon)
  
  currentLocation.value = { latitude: lat, longitude: lng }
  
  if (map) {
    map.flyTo({
      center: [lng, lat],
      zoom: 15,
      duration: 1500
    })
  }
  
  searchQuery.value = ''
  searchResults.value = []
}

const initMap = async () => {
  if (!mapContainer.value) return
  
  try {
    mapboxgl = await loadMapboxGL()
    if (!mapboxgl) return
    
    // Setup RTL plugin for Persian text
    setupRTLTextPlugin(mapboxgl)
    
    mapboxgl.accessToken = MAPBOX_TOKEN
    
    map = new mapboxgl.Map({
      container: mapContainer.value,
      style: MAPTILER_STYLE,
      center: [currentLocation.value.longitude, currentLocation.value.latitude],
      zoom: props.zoom,
      attributionControl: false,
      logoPosition: 'bottom-right',
      interactive: props.interactive,
      dragPan: props.draggable,
      scrollZoom: props.interactive,
      doubleClickZoom: props.interactive,
      touchZoomRotate: props.interactive,
      // Iran bounds
      maxBounds: [
        [43.5, 23.5], // Southwest
        [64.0, 40.5]  // Northeast
      ],
      minZoom: 5,
      maxZoom: 18,
      // RTL support
      localIdeographFontFamily: "'Shabnam', 'Tahoma', sans-serif"
    })
    
    // Add navigation controls
    if (props.interactive) {
      map.addControl(new mapboxgl.NavigationControl({
        showCompass: false
      }), 'top-left')
    }
    
    // Handle map load
    map.on('load', () => {
      isLoading.value = false
      markerVisible.value = true
      // Get initial address
      getAddressFromCoords(currentLocation.value.latitude, currentLocation.value.longitude)
    })
    
    // Handle map move - emit location change
    map.on('moveend', () => {
      const center = map.getCenter()
      currentLocation.value = { latitude: center.lat, longitude: center.lng }
      emit('locationChange', { 
        latitude: center.lat, 
        longitude: center.lng 
      })
      // Get address for new location
      getAddressFromCoords(center.lat, center.lng)
    })
    
  } catch (error) {
    console.error('Error initializing Mapbox:', error)
    isLoading.value = false
  }
}

// Initialize static map for preview mode
const initStaticMap = async () => {
  if (!staticMapContainer.value) return
  
  try {
    mapboxgl = await loadMapboxGL()
    if (!mapboxgl) return
    
    // Setup RTL plugin for Persian text
    setupRTLTextPlugin(mapboxgl)
    
    mapboxgl.accessToken = MAPBOX_TOKEN
    
    staticMap = new mapboxgl.Map({
      container: staticMapContainer.value,
      style: MAPTILER_STYLE,
      center: [props.longitude, props.latitude],
      zoom: props.zoom,
      attributionControl: false,
      interactive: false,
      dragPan: false,
      scrollZoom: false,
      doubleClickZoom: false,
      touchZoomRotate: false,
      // Iran bounds
      maxBounds: [
        [43.5, 23.5], // Southwest
        [64.0, 40.5]  // Northeast
      ],
      // RTL support
      localIdeographFontFamily: "'Shabnam', 'Tahoma', sans-serif"
    })
    
    staticMap.on('load', () => {
      staticMapLoading.value = false
      
      // اگر showCircle فعال است، دایره محدوده را اضافه کن
      if (props.showCircle) {
        addCircleToMap(staticMap, props.longitude, props.latitude, props.iconColor)
      }
    })
    
  } catch (error) {
    console.error('Error initializing static Mapbox:', error)
    staticMapLoading.value = false
  }
}

const flyToLocation = (lat: number, lng: number) => {
  if (map) {
    map.flyTo({
      center: [lng, lat],
      zoom: map.getZoom(),
      duration: 1000
    })
  }
}

// اضافه کردن دایره محدوده به نقشه
const addCircleToMap = (mapInstance: any, lng: number, lat: number, color: string) => {
  // اگر سورس قبلاً وجود دارد، حذف کن
  if (mapInstance.getSource('circle-source')) {
    mapInstance.removeLayer('circle-fill')
    mapInstance.removeLayer('circle-border')
    mapInstance.removeSource('circle-source')
  }
  
  // ایجاد GeoJSON برای دایره
  const circleGeoJSON = createCircleGeoJSON(lng, lat, 0.15) // 150 متر شعاع
  
  mapInstance.addSource('circle-source', {
    type: 'geojson',
    data: circleGeoJSON
  })
  
  // لایه پر کردن دایره
  mapInstance.addLayer({
    id: 'circle-fill',
    type: 'fill',
    source: 'circle-source',
    paint: {
      'fill-color': color,
      'fill-opacity': 0.15
    }
  })
  
  // لایه حاشیه دایره
  mapInstance.addLayer({
    id: 'circle-border',
    type: 'line',
    source: 'circle-source',
    paint: {
      'line-color': color,
      'line-width': 2,
      'line-opacity': 0.5
    }
  })
}

// ایجاد GeoJSON دایره
const createCircleGeoJSON = (lng: number, lat: number, radiusKm: number) => {
  const points = 64
  const coords: number[][] = []
  
  for (let i = 0; i <= points; i++) {
    const angle = (i / points) * 2 * Math.PI
    const dx = radiusKm * Math.cos(angle)
    const dy = radiusKm * Math.sin(angle)
    
    // تبدیل کیلومتر به درجه (تقریبی)
    const dLng = dx / (111.32 * Math.cos(lat * Math.PI / 180))
    const dLat = dy / 110.574
    
    coords.push([lng + dLng, lat + dLat])
  }
  
  return {
    type: 'Feature',
    geometry: {
      type: 'Polygon',
      coordinates: [coords]
    },
    properties: {}
  }
}

// Watch for prop changes
watch(() => [props.latitude, props.longitude], ([newLat, newLng]) => {
  if (newLat && newLng) {
    currentLocation.value = { latitude: newLat as number, longitude: newLng as number }
    if (map) {
      flyToLocation(newLat as number, newLng as number)
    }
  }
}, { immediate: false })

watch(() => props.zoom, (newZoom) => {
  if (map && newZoom) {
    map.setZoom(newZoom)
  }
})

onUnmounted(() => {
  if (map) {
    map.remove()
    map = null
  }
  if (staticMap) {
    staticMap.remove()
    staticMap = null
  }
  document.body.style.overflow = ''
})

// Initialize static map on mount if in preview mode
onMounted(() => {
  if (props.showMarker && !props.interactive) {
    nextTick(() => {
      initStaticMap()
    })
  }
})

// Expose method for external use
defineExpose({
  flyToLocation,
  openFullscreenMap,
  closeFullscreenMap
})
</script>

<style>
.mapboxgl-ctrl-top-left {
  top: 130px !important;
  left: 10px !important;
}

.mapboxgl-ctrl-group {
  border-radius: 8px !important;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1) !important;
}

.mapboxgl-ctrl-group button {
  width: 36px !important;
  height: 36px !important;
}

.mapboxgl-canvas {
  outline: none !important;
}

/* Hide Mapbox logo */
.mapboxgl-ctrl-logo,
.maplibregl-ctrl-logo {
  display: none !important;
}

/* Hide MapTiler/Mapbox attribution */
.mapboxgl-ctrl-attrib,
.maplibregl-ctrl-attrib {
  display: none !important;
}

/* Map fade transition */
.map-fade-enter-active,
.map-fade-leave-active {
  transition: opacity 0.3s ease;
}

.map-fade-enter-from,
.map-fade-leave-to {
  opacity: 0;
}
</style>
