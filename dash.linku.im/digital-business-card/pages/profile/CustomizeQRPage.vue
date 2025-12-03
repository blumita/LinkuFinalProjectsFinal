<template>
  <div class="min-h-screen bg-background">
    <!-- Header -->
    <div class="fixed top-0 left-0 right-0 z-40 bg-card border-b border-border">
      <div class="flex items-center justify-between h-14 px-4">
        <button
          @click="$router.back()"
          class="flex items-center justify-center w-10 h-10 rounded-lg text-foreground hover:bg-accent transition-colors"
        >
          <i class="ti ti-arrow-right text-xl"></i>
        </button>
        <h1 class="flex-1 text-lg font-semibold text-foreground">سفارشی‌سازی کیوآر کد</h1>
        <button
          @click="shareQRCode"
          class="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center hover:bg-primary/30 transition-colors"
        >
          <i class="ti ti-share-2 text-primary text-lg"></i>
        </button>
      </div>
    </div>

    <!-- Content -->
    <div class="px-4 pt-24 pb-32 lg:pb-8 overflow-y-auto">
      <!-- Desktop Layout: Two Columns -->
      <div class="max-w-7xl mx-auto lg:grid lg:grid-cols-2 lg:gap-8 lg:items-start">
        
        <!-- Left Column: QR Preview (Desktop Only) -->
        <div class="hidden lg:block lg:sticky lg:top-24">
          <div class="bg-card rounded-2xl p-6 border border-border">
            <h3 class="text-lg font-semibold text-foreground mb-4 text-center">پیش‌نمایش کیوآر کد</h3>
            <div class="flex justify-center mb-4">
              <div 
                style="width: 250px; height: 250px;"
                class="rounded-xl flex items-center justify-center border border-border shadow-sm overflow-hidden"
                :style="{ backgroundColor: selectedOptions.backgroundColor }"
              >
                <!-- Desktop QR Preview Canvas -->
                <canvas
                  ref="qrCanvasDesktop"
                  class="w-full h-full"
                  width="250"
                  height="250"
                ></canvas>
              </div>
            </div>
            
            <!-- Desktop Action Buttons -->
            <div class="space-y-3">
              <button
                @click="saveQRSettings"
                :disabled="isLoading"
                class="w-full bg-primary text-primary-foreground py-3.5 rounded-xl font-medium text-base hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                <i class="ti ti-device-floppy text-lg"></i>
                <span>ذخیره تنظیمات</span>
              </button>
              
              <button
                @click="downloadQR"
                :disabled="isLoading"
                class="w-full bg-accent text-accent-foreground py-3.5 rounded-xl font-medium text-base hover:bg-accent/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                <i class="ti ti-download text-lg"></i>
                <span>دانلود کیوآر کد</span>
              </button>
              
              <button
                @click="shareQRCode"
                class="w-full bg-accent text-accent-foreground py-3.5 rounded-xl font-medium text-base hover:bg-accent/90 transition-colors flex items-center justify-center gap-2"
              >
                <i class="ti ti-share-2 text-lg"></i>
                <span>اشتراک‌گذاری</span>
              </button>
              
              <button
                @click="resetQRSettings"
                class="w-full bg-secondary text-secondary-foreground py-3.5 rounded-xl font-medium text-base hover:bg-secondary/80 transition-colors flex items-center justify-center gap-2"
              >
                <i class="ti ti-refresh text-lg"></i>
                <span>بازنشانی</span>
              </button>
            </div>
          </div>
        </div>

        <!-- Right Column: Settings -->
        <div class="space-y-4">
          
          <!-- Mobile QR Preview -->
          <div class="lg:hidden flex justify-center mb-6">
            <div class="relative">
              <div 
                style="width: 250px; height: 250px;"
                class="rounded-xl flex items-center justify-center border border-border shadow-sm overflow-hidden"
                :style="{ backgroundColor: selectedOptions.backgroundColor }"
              >
                <!-- Real QR Code Canvas -->
                <canvas
                  ref="qrCanvas"
                  class="w-full h-full"
                  width="250"
                  height="250"
                ></canvas>
              </div>
            </div>
          </div>

          <!-- Color Selection Card -->
          <div class="bg-card rounded-xl border border-border p-5">
            <h3 class="text-base font-semibold text-foreground mb-4 flex items-center gap-2">
              <i class="ti ti-palette text-primary"></i>
              <span>انتخاب رنگ کیوآر کد</span>
            </h3>
            <div class="flex gap-1 flex-wrap">
              <button 
                @click="openColorPicker"
                class="w-8 h-8 rounded-xl border-2 border-border flex items-center justify-center hover:opacity-80 transition-all shadow-sm"
                :style="{ backgroundColor: selectedOptions.foregroundColor }"
              >
                <i class="ti ti-color-picker text-white text-lg"></i>
              </button>
              <button
                v-for="color in themeColors"
                :key="color.value"
                @click="selectedOptions.foregroundColor = color.value"
                class="w-8 h-8 rounded-xl border-2 transition-all  shadow-sm"
                :style="{ backgroundColor: color.value }"
                :class="selectedOptions.foregroundColor === color.value 
                  ? 'border-foreground  ring-2 ring-foreground ring-offset-2' 
                  : 'border-border'"
              >
              </button>
            </div>
          </div>

          <!-- Logo Upload Card -->
          <div class="bg-card rounded-xl border border-border p-5">
            <h3 class="text-base font-semibold text-foreground mb-4 flex items-center gap-2">
              <i class="ti ti-photo text-primary"></i>
              <span>لوگو کیوآر کد</span>
            </h3>
            <button 
              @click="handleLogoUploadClick"
              type="button" 
              :disabled="!subscriptionStatus.isActive"
              :class="[
                'w-full p-4 rounded-xl font-medium text-sm transition-colors relative',
                subscriptionStatus.isActive 
                  ? 'bg-primary text-primary-foreground hover:bg-primary/90 flex items-center justify-center gap-2' 
                  : 'bg-muted text-muted-foreground cursor-not-allowed flex items-center justify-between'
              ]"
            >
              <div class="flex items-center gap-2">
                <i :class="subscriptionStatus.isActive ? 'ti ti-upload' : 'ti ti-lock'"></i>
                <span class="text-sm">آپلود لوگو</span>
              </div>
              
              <!-- Upgrade Badge -->
              <div 
                v-if="!subscriptionStatus.isActive" 
                class="cursor-pointer" 
                @click.stop="router.push('/premium-upgrade')"
              >
                <div class="bg-gradient-to-r from-orange-500 to-red-500 text-white text-xs px-3 py-1 rounded-full font-bold hover:opacity-90 transition-opacity">
                  ارتقا
                </div>
              </div>
            </button>
            
            <!-- Uploaded Logo Preview -->
            <div v-if="uploadedLogo" class="mt-3 p-3 bg-muted rounded-xl">
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-2">
                  <img :src="uploadedLogo" alt="Preview" class="w-10 h-10 rounded object-cover">
                  <span class="text-sm text-foreground">لوگو انتخاب شده</span>
                </div>
                <button 
                  @click.stop="removeUploadedLogo"
                  class="w-8 h-8 hover:bg-destructive/10 text-destructive rounded flex items-center justify-center transition-colors"
                >
                  <i class="ti ti-x"></i>
                </button>
              </div>
            </div>
            
            <input 
              id="logoUpload" 
              type="file" 
              class="hidden" 
              accept="image/*,.svg"
              @change="handleLogoUpload"
            />
          </div>

        </div>
      </div>
    </div>

    <!-- Fixed Action Buttons at Bottom (Mobile Only) -->
    <div class="lg:hidden fixed bottom-0 left-0 right-0 bg-background/95 backdrop-blur-lg border-t border-border py-3 px-4 z-50">
      <div class="max-w-sm mx-auto">
        <div class="flex gap-3">
          <button
            @click="saveQRSettings"
            :disabled="isLoading"
            class="flex-1 bg-primary text-primary-foreground py-3 rounded-xl font-medium text-sm hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            <i class="ti ti-device-floppy text-base"></i>
            <span>ذخیره</span>
          </button>
          
          <button
            @click="downloadQR"
            :disabled="isLoading"
            class="flex-1 bg-accent text-accent-foreground py-3 rounded-xl font-medium text-sm hover:bg-accent/80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            <i class="ti ti-download text-base"></i>
            <span>دانلود</span>
          </button>
          
          <button
            @click="resetQRSettings"
            class="w-12 bg-secondary text-secondary-foreground py-3 rounded-xl font-medium text-sm hover:bg-secondary/80 transition-colors flex items-center justify-center"
          >
            <i class="ti ti-refresh text-base"></i>
          </button>
        </div>
      </div>
    </div>

    <!-- Download Format Selection Modal -->
    <div v-if="showFormatModal" class="fixed inset-0 bg-black/50 z-50 flex items-end lg:items-center justify-center" @click.self="showFormatModal = false">
      <div class="bg-card rounded-t-2xl lg:rounded-2xl w-full lg:max-w-md p-6 animate-slide-up border-t lg:border border-border">
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-xl font-bold text-foreground">انتخاب فرمت دانلود</h2>
          <button 
            @click="showFormatModal = false"
            class="p-2 hover:bg-muted rounded-lg transition-colors text-muted-foreground hover:text-foreground"
          >
            <i class="ti ti-x text-xl"></i>
          </button>
        </div>
        
        <div class="space-y-2">
          <button
            @click="downloadQRWithFormat('png')"
            class="w-full p-4 rounded-xl bg-primary/10 text-foreground hover:bg-primary/20 border border-primary/20 hover:border-primary/30 transition-all flex items-center justify-between group"
          >
            <div class="flex items-center gap-3">
              <div class="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center">
                <i class="ti ti-photo text-primary text-2xl"></i>
              </div>
              <div class="text-right">
                <p class="font-semibold text-foreground">تصویر PNG</p>
                <p class="text-xs text-muted-foreground">بدون پس‌زمینه و شفاف</p>
              </div>
            </div>
            <i class="ti ti-chevron-left text-lg text-muted-foreground group-hover:text-foreground transition-colors"></i>
          </button>
          
          <button
            @click="downloadQRWithFormat('jpg')"
            class="w-full p-4 rounded-xl bg-accent hover:bg-accent/80 border border-border transition-all flex items-center justify-between group"
          >
            <div class="flex items-center gap-3">
              <div class="w-12 h-12 rounded-lg bg-muted flex items-center justify-center">
                <i class="ti ti-photo text-foreground text-2xl"></i>
              </div>
              <div class="text-right">
                <p class="font-semibold text-foreground">تصویر JPG</p>
                <p class="text-xs text-muted-foreground">با پس‌زمینه سفید</p>
              </div>
            </div>
            <i class="ti ti-chevron-left text-lg text-muted-foreground group-hover:text-foreground transition-colors"></i>
          </button>
          
          <button
            @click="downloadQRWithFormat('pdf')"
            class="w-full p-4 rounded-xl bg-accent hover:bg-accent/80 border border-border transition-all flex items-center justify-between group"
          >
            <div class="flex items-center gap-3">
              <div class="w-12 h-12 rounded-lg bg-muted flex items-center justify-center">
                <i class="ti ti-file-type-pdf text-red-600 text-2xl"></i>
              </div>
              <div class="text-right">
                <p class="font-semibold text-foreground">فایل PDF</p>
                <p class="text-xs text-muted-foreground">برای چاپ حرفه‌ای</p>
              </div>
            </div>
            <i class="ti ti-chevron-left text-lg text-muted-foreground group-hover:text-foreground transition-colors"></i>
          </button>
        </div>
        
        <button
          @click="showFormatModal = false"
          class="w-full mt-4 py-3 rounded-xl bg-muted text-foreground font-medium hover:bg-muted/80 transition-colors"
        >
          انصراف
        </button>
      </div>
    </div>

    <!-- Color Picker Bottom Sheet -->
    <div v-if="showColorPicker" class="fixed inset-0 bg-black/50 z-50 flex items-end lg:items-center justify-center" @click.self="showColorPicker = false">
      <div class="bg-card rounded-t-2xl lg:rounded-2xl w-full lg:max-w-md p-6 animate-slide-up border-t lg:border border-border">
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-xl font-bold text-foreground">انتخاب رنگ دلخواه</h2>
          <button 
            @click="showColorPicker = false"
            class="p-2 hover:bg-muted rounded-lg transition-colors text-muted-foreground hover:text-foreground"
          >
            <i class="ti ti-x text-xl"></i>
          </button>
        </div>
        
        <div class="space-y-4">
          <div class="flex items-center gap-3 p-4 bg-muted rounded-xl">
            <div 
              class="w-14 h-14 rounded-lg border-2 border-border shadow-sm"
              :style="{ backgroundColor: selectedOptions.foregroundColor }"
            ></div>
            <div class="flex-1">
              <p class="text-xs text-muted-foreground mb-1">رنگ انتخاب شده</p>
              <p class="font-mono text-sm font-semibold text-foreground">{{ selectedOptions.foregroundColor }}</p>
            </div>
          </div>
          
          <input 
            v-model="selectedOptions.foregroundColor"
            type="color"
            class="w-full h-32 rounded-xl cursor-pointer border-2 border-border"
          />
        </div>
        
        <button 
          @click="showColorPicker = false" 
          class="mt-6 w-full bg-primary hover:bg-primary/90 text-primary-foreground py-3.5 rounded-xl font-medium transition-all"
        >
          تأیید
        </button>
      </div>
    </div>

    <!-- QR Code Full Screen - Removed -->

    <!-- Success Toast -->
    <div 
      v-if="showSuccessToast"
      class="fixed bottom-20 left-4 right-4 bg-green-600 text-white px-4 py-3 rounded-xl text-sm font-medium z-50 flex items-center gap-2"
    >
      <i class="ti ti-check text-lg"></i>
      {{ successMessage }}
    </div>

    <!-- Image Cropper Modal -->
    <ImageCropperModal
      v-if="tempImageFile"
      :show="showCropperModal"
      :image-file="tempImageFile"
      field-name="logo"
      @cropped="handleCroppedImage"
      @close="handleCropperCancel"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted, watch, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import QRCode from 'qrcode'
import ImageCropperModal from '~/components/UserDashboard/modals/ImageCropperModal.vue'
import { useUserStore } from '~/stores/user'
import { useFormStore } from '~/stores/form'

// Hide bottom navigation on this page
definePageMeta({
  layout: 'default',
  middleware: []
})

const router = useRouter()
const userStore = useUserStore()
const formStore = useFormStore()
const { $axios } = useNuxtApp()

// Subscription status
const subscriptionStatus = computed(() => ({
  isActive: userStore.isUserPro
}))

// State
const isLoading = ref(false)
const showSuccessToast = ref(false)
const successMessage = ref('تنظیمات کیوآر کد ذخیره شد!')
const showQRFullScreenModal = ref(false)
const scanCount = ref(247)
const totalScans = ref(1543)
const uploadedLogo = ref<string | null>(null)
const customHex = ref('#000000')
const showColorPicker = ref(false)
const qrCanvas = ref<HTMLCanvasElement | null>(null)
const qrCanvasDesktop = ref<HTMLCanvasElement | null>(null)

// Cropper related
const showCropperModal = ref(false)
const tempImageFile = ref<File | null>(null)

// Download format selection
const showFormatModal = ref(false)

// QR Code data - Use actual user profile URL from store
const qrData = computed(() => {
  const username = userStore.user?.userName || userStore.user?.username
  return username ? `https://linku.im/${username}` : 'https://linku.im'
})

// گرفتن مقادیر اولیه از store
const activeCard = computed(() => formStore.defaultCard || formStore.cards?.[0])

// گرفتن رنگ آیکون از کارت یا store
const getIconColor = () => {
  // اگه matchThemeColor فعاله، از themeColor استفاده کن
  if (formStore.matchThemeColor) {
    const bg = formStore.themeColor?.background
    if (bg && bg !== 'transparent' && bg.startsWith('#')) {
      console.log('Using themeColor (matchThemeColor):', bg)
      return bg
    }
  }
  
  // iconColor رو بگیر
  const iconColor = formStore.iconColor
  console.log('getIconColor - formStore.iconColor:', iconColor)
  
  if (iconColor && typeof iconColor === 'object') {
    // background اگه transparent نبود استفاده کن
    if (iconColor.background && iconColor.background !== 'transparent' && iconColor.background.startsWith('#')) {
      console.log('Using iconColor.background:', iconColor.background)
      return iconColor.background
    }
  }
  
  // اگر string بود
  if (typeof iconColor === 'string' && iconColor.startsWith('#')) {
    return iconColor
  }
  
  return '#000000'
}

// QR Options - مقدار پیش‌فرض مشکی تا QR نشون داده بشه
const selectedOptions = reactive({
  style: 'square',
  foregroundColor: '#000000',
  backgroundColor: '#ffffff',
  showLogo: true,
  size: 'medium',
  format: 'png'
})

// وقتی formStore.iconColor تغییر کرد، رنگ QR رو آپدیت کن (فقط اگه qrColor نداشت)
watch(() => formStore.iconColor, (newIconColor) => {
  console.log('iconColor changed:', newIconColor)
  const card = activeCard.value
  // فقط اگه کارت qrColor نداشت، از iconColor استفاده کن
  if (!card?.qrColor && !formStore.qrColor) {
    selectedOptions.foregroundColor = getIconColor()
  }
}, { immediate: true, deep: true })

// وقتی store لود شد، رنگ‌ها رو آپدیت کن
watch(activeCard, (card) => {
  if (card) {
    console.log('activeCard changed:', card)
    // اول qrColor کارت، بعد iconColor
    if (card.qrColor) {
      selectedOptions.foregroundColor = card.qrColor
    } else {
      selectedOptions.foregroundColor = getIconColor()
    }
    if (card.qrBgColor) {
      selectedOptions.backgroundColor = card.qrBgColor
    }
  }
}, { immediate: true })

// Style Options (keeping only for QR pattern)
const styleOptions = [
  { value: 'square', label: 'مربعی', icon: 'ti ti-square' },
  { value: 'rounded', label: 'گرد', icon: 'ti ti-square-rounded' },
  { value: 'dots', label: 'نقطه‌ای', icon: 'ti ti-circle' }
]

// Color Options - Theme Colors (matching the exact image colors)
const themeColors = [
  // { value: '#000000' }, // Black
  { value: '#FF69B4' }, // Pink  
  { value: '#FF6347' }, // Orange-Red
  { value: '#FFD700' }, // Gold
  { value: '#ADFF2F' }, // Green-Yellow
  // { value: '#00FF7F' }, // Spring Green
  { value: '#00BFFF' }, // Deep Sky Blue
  // { value: '#8A2BE2' }  // Blue Violet
]

// Methods
const showQRFullScreen = () => {
  showQRFullScreenModal.value = true
}

const downloadQR = () => {
  showFormatModal.value = true
}

const downloadQRWithFormat = async (format: 'png' | 'jpg' | 'pdf') => {
  showFormatModal.value = false
  
  try {
    console.log('Download QR started with format:', format)
    console.log('uploadedLogo:', uploadedLogo.value)
    console.log('showLogo:', selectedOptions.showLogo)
    
    if (!qrCanvas.value) {
      console.log('Canvas not found')
      return
    }
    
    // Simple approach for consistent download
    // Create a high-res version with logo
    const downloadCanvas = document.createElement('canvas')
    const ctx = downloadCanvas.getContext('2d')
    if (!ctx) {
      console.log('Download context not found')
      return
    }

    // Set high resolution for download
    const size = 1024
    downloadCanvas.width = size
    downloadCanvas.height = size

    // Convert colors
    let darkColor = selectedOptions.foregroundColor || '#000000'
    let lightColor = selectedOptions.backgroundColor || '#FFFFFF'
    
    if (darkColor.startsWith('hsl')) {
      darkColor = convertHslToHex(darkColor)
    }
    if (lightColor.startsWith('hsl')) {
      lightColor = convertHslToHex(lightColor)
    }

    // Generate high-res QR code
    // For PNG, use transparent background. For JPG/PDF, use white background
    await QRCode.toCanvas(downloadCanvas, qrData.value, {
      width: size,
      margin: 2,
      color: {
        dark: darkColor,
        light: format === 'png' ? '#FFFFFF00' : lightColor // Transparent for PNG
      },
      errorCorrectionLevel: 'M'
    })

    // Always add logo (either uploaded or default)
    await addLogoToDownloadCanvas(downloadCanvas, format)

    // Download based on format
    const link = document.createElement('a')
    
    if (format === 'pdf') {
      // PDF format - using dynamic import for jsPDF
      try {
        const { default: jsPDF } = await import('jspdf')
        const pdf = new jsPDF({
          orientation: 'portrait',
          unit: 'mm',
          format: 'a4'
        })
        
        // A4 dimensions in mm
        const pageWidth = pdf.internal.pageSize.getWidth()
        const pageHeight = pdf.internal.pageSize.getHeight()
        
        // QR code size (120mm x 120mm - larger and higher quality)
        const qrSize = 120
        const x = (pageWidth - qrSize) / 2
        const y = (pageHeight - qrSize) / 2
        
        // Add QR code image to PDF with high quality
        const imgData = downloadCanvas.toDataURL('image/png', 1.0)
        pdf.addImage(imgData, 'PNG', x, y, qrSize, qrSize, undefined, 'FAST')
        
        // Save PDF
        pdf.save(`qr-code-${Date.now()}.pdf`)
        
      } catch (error) {
        console.error('Failed to load jsPDF, falling back to PNG:', error)
        // Fallback to PNG if jsPDF fails
        link.download = `qr-code-${Date.now()}.png`
        link.href = downloadCanvas.toDataURL('image/png')
        link.click()
      }
    } else if (format === 'jpg') {
      // JPG format - convert with white background
      const jpgCanvas = document.createElement('canvas')
      jpgCanvas.width = size
      jpgCanvas.height = size
      const jpgCtx = jpgCanvas.getContext('2d')
      
      if (jpgCtx) {
        // Fill white background (JPG doesn't support transparency)
        jpgCtx.fillStyle = '#FFFFFF'
        jpgCtx.fillRect(0, 0, size, size)
        // Draw QR code on top
        jpgCtx.drawImage(downloadCanvas, 0, 0)
      }
      
      link.download = `qr-code-${Date.now()}.jpg`
      link.href = jpgCanvas.toDataURL('image/jpeg', 0.95)
      link.click()
    } else {
      // PNG format
      link.download = `qr-code-${Date.now()}.png`
      link.href = downloadCanvas.toDataURL('image/png')
      link.click()
    }
    
    successMessage.value = 'کیوآر کد دانلود شد!'
    showSuccessToast.value = true
    setTimeout(() => (showSuccessToast.value = false), 3000)
    
    console.log('Download completed using preview canvas')
    
  } catch (error) {
    console.error('Download failed:', error)
  }
}

const shareQRCode = async () => {
  try {
    console.log('Share QR started')
    
    if (!qrCanvas.value) {
      console.log('Canvas not found for sharing')
      return
    }
    
    // Convert canvas to blob
    const canvas = qrCanvas.value
    const dataURL = canvas.toDataURL('image/png')
    
    // Check if Web Share API is supported
    if (navigator.share && navigator.canShare) {
      // Convert data URL to blob
      const response = await fetch(dataURL)
      const blob = await response.blob()
      const file = new File([blob], 'qr-code.png', { type: 'image/png' })
      
      if (navigator.canShare({ files: [file] })) {
        await navigator.share({
          title: 'کیوآر کد من',
          text: 'کیوآر کد شخصی من در Linku.im',
          files: [file]
        })
        console.log('QR Code shared successfully')
        return
      }
    }
    
    // Fallback: Copy to clipboard or download
    if (navigator.clipboard && navigator.clipboard.write) {
      try {
        const response = await fetch(dataURL)
        const blob = await response.blob()
        await navigator.clipboard.write([
          new ClipboardItem({ 'image/png': blob })
        ])
        
        // Show success message
        successMessage.value = 'کیوآر کد کپی شد!'
        showSuccessToast.value = true
        setTimeout(() => (showSuccessToast.value = false), 3000)
        console.log('QR Code copied to clipboard')
      } catch (clipboardError) {
        console.log('Clipboard failed, falling back to download')
        // Fallback to download
        downloadQR()
      }
    } else {
      console.log('Share API not supported, falling back to download')
      // Fallback to download
      downloadQR()
    }
    
  } catch (error) {
    console.error('Share failed:', error)
    // Final fallback to download
    downloadQR()
  }
}

const saveQRSettings = async () => {
  isLoading.value = true
  
  try {
    // گرفتن کارت ID - اول از selectedCardId، بعد newCardId، بعد defaultCard
    const cardId = formStore.selectedCardId || formStore.newCardId || formStore.defaultCard?.id || formStore.cards?.[0]?.id
    
    if (!cardId) {
      console.error('No active card found')
      successMessage.value = 'کارت فعالی یافت نشد!'
      showSuccessToast.value = true
      setTimeout(() => (showSuccessToast.value = false), 3000)
      return
    }

    // ارسال به API
    const formData = new FormData()
    formData.append('qrColor', selectedOptions.foregroundColor)
    formData.append('qrBgColor', selectedOptions.backgroundColor)
    
    // اگر لوگو آپلود شده، آن را هم ارسال کن
    if (uploadedLogo.value && uploadedLogo.value.startsWith('data:')) {
      // تبدیل base64 به blob
      const res = await fetch(uploadedLogo.value)
      const blob = await res.blob()
      formData.append('qrLogo', blob, 'qr-logo.png')
    }

    console.log('Saving QR settings for card:', cardId)
    
    const apiResponse = await $axios.post(`v1/cards/${cardId}/update`, formData, {
      headers: { 'X-HTTP-Method-Override': 'PUT' }
    })

    console.log('API Response:', apiResponse.data)

    if (apiResponse.data.success) {
      // آپدیت store
      formStore.qrColor = selectedOptions.foregroundColor
      formStore.qrBgColor = selectedOptions.backgroundColor
      
      // آپدیت کارت در store
      const card = formStore.cards?.find(c => String(c.id) === String(cardId))
      if (card) {
        card.qrColor = selectedOptions.foregroundColor
        card.qrBgColor = selectedOptions.backgroundColor
      }
      
      successMessage.value = 'تنظیمات کیوآر کد ذخیره شد!'
      showSuccessToast.value = true
      setTimeout(() => {
        showSuccessToast.value = false
        router.back()
      }, 1500)
    } else {
      throw new Error(apiResponse.data.message || 'خطا در ذخیره')
    }
    
  } catch (error) {
    console.error('خطا در ذخیره تنظیمات:', error)
    successMessage.value = 'خطا در ذخیره تنظیمات!'
    showSuccessToast.value = true
    setTimeout(() => (showSuccessToast.value = false), 3000)
  } finally {
    isLoading.value = false
  }
}

// New methods for the updated UI
const handleLogoUploadClick = () => {
  if (!subscriptionStatus.value.isActive) {
    // دکمه disabled است، کاری نکن
    return
  }
  
  triggerLogoUpload()
}

const handleLogoUpload = (event: Event) => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  
  if (file) {
    console.log('File selected:', file.name, file.type)
    tempImageFile.value = file
    showCropperModal.value = true
    console.log('Cropper modal opened')
  }
}

const handleCroppedImage = (imageUrl: string, fieldName: string) => {
  console.log('Cropped image received:', imageUrl)
  uploadedLogo.value = imageUrl
  selectedOptions.showLogo = true
  showCropperModal.value = false
}

const handleCropperCancel = () => {
  console.log('Cropper cancelled')
  showCropperModal.value = false
  tempImageFile.value = null
  // Reset file input
  const fileInput = document.getElementById('logoUpload') as HTMLInputElement
  if (fileInput) {
    fileInput.value = ''
  }
}

const triggerLogoUpload = () => {
  const fileInput = document.getElementById('logoUpload') as HTMLInputElement
  if (fileInput) {
    fileInput.click()
  }
}

const removeUploadedLogo = () => {
  uploadedLogo.value = null
  selectedOptions.showLogo = false
  // Reset file input
  const fileInput = document.getElementById('logoUpload') as HTMLInputElement
  if (fileInput) {
    fileInput.value = ''
  }
}

const updateColorFromHex = () => {
  // Validate hex color format
  const hexRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/
  if (hexRegex.test(customHex.value)) {
    selectedOptions.foregroundColor = customHex.value
  }
}

const resetQRSettings = () => {
  selectedOptions.foregroundColor = '#000000'
  selectedOptions.backgroundColor = '#ffffff'
  selectedOptions.showLogo = false
  selectedOptions.style = 'square'
  uploadedLogo.value = null
  customHex.value = '#000000'
}

// Color picker methods
const openColorPicker = () => {
  showColorPicker.value = true
}

// Color conversion helper
const convertHslToHex = (hslString: string): string => {
  // Parse HSL string like "hsl(0, 0%, 0%)"
  const match = hslString.match(/hsl\((\d+),\s*(\d+)%,\s*(\d+)%\)/)
  if (!match) return '#000000'
  
  const h = parseInt(match[1]) / 360
  const s = parseInt(match[2]) / 100
  const l = parseInt(match[3]) / 100
  
  const hslToRgb = (h: number, s: number, l: number) => {
    let r, g, b
    
    if (s === 0) {
      r = g = b = l // achromatic
    } else {
      const hue2rgb = (p: number, q: number, t: number) => {
        if (t < 0) t += 1
        if (t > 1) t -= 1
        if (t < 1/6) return p + (q - p) * 6 * t
        if (t < 1/2) return q
        if (t < 2/3) return p + (q - p) * (2/3 - t) * 6
        return p
      }
      
      const q = l < 0.5 ? l * (1 + s) : l + s - l * s
      const p = 2 * l - q
      r = hue2rgb(p, q, h + 1/3)
      g = hue2rgb(p, q, h)
      b = hue2rgb(p, q, h - 1/3)
    }
    
    return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)]
  }
  
  const [r, g, b] = hslToRgb(h, s, l)
  const toHex = (c: number) => {
    const hex = c.toString(16)
    return hex.length === 1 ? '0' + hex : hex
  }
  
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`
}

// Real QR Code Generation
const generateQRCode = async () => {
  await nextTick()
  
  if (!qrCanvas.value) {
    console.log('Canvas not found')
    return
  }
  
  try {
    // Convert colors to hex format if needed
    let darkColor = selectedOptions.foregroundColor || '#000000'
    let lightColor = selectedOptions.backgroundColor || '#FFFFFF'
    
    // Convert HSL to hex if needed
    if (darkColor.startsWith('hsl')) {
      darkColor = convertHslToHex(darkColor)
    }
    if (lightColor.startsWith('hsl')) {
      lightColor = convertHslToHex(lightColor)
    }

    console.log('Converting colors:', { 
      original: selectedOptions.foregroundColor, 
      converted: darkColor 
    })

    // Generate QR code on mobile canvas
    const canvas = qrCanvas.value
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    ctx.clearRect(0, 0, canvas.width, canvas.height)

    await QRCode.toCanvas(qrCanvas.value, qrData.value, {
      width: 250,
      margin: 2,
      color: {
        dark: darkColor,
        light: lightColor
      },
      errorCorrectionLevel: 'M'
    })

    // Add logo to mobile canvas
    await addLogoToQR()

    // Copy to desktop canvas if exists
    if (qrCanvasDesktop.value) {
      const desktopCtx = qrCanvasDesktop.value.getContext('2d')
      if (desktopCtx) {
        desktopCtx.clearRect(0, 0, qrCanvasDesktop.value.width, qrCanvasDesktop.value.height)
        
        // Copy from mobile canvas
        desktopCtx.drawImage(qrCanvas.value, 0, 0)
      }
    }

    console.log('QR code generated successfully')

  } catch (error) {
    console.error('QR Code generation failed:', error)
    
    // Fallback: Draw a simple placeholder
    const canvas = qrCanvas.value
    const ctx = canvas.getContext('2d')
    if (ctx) {
      ctx.fillStyle = selectedOptions.backgroundColor || '#FFFFFF'
      ctx.fillRect(0, 0, 250, 250)
      ctx.fillStyle = selectedOptions.foregroundColor || '#000000'
      ctx.font = '12px Arial'
      ctx.textAlign = 'center'
      ctx.fillText('QR Code', 125, 125)
    }
  }
}

// Add logo to QR code
const addLogoToQR = async (targetCanvas?: HTMLCanvasElement): Promise<void> => {
  return new Promise((resolve, reject) => {
    const canvas = targetCanvas || qrCanvas.value
    if (!canvas) {
      resolve()
      return
    }

    const ctx = canvas.getContext('2d')
    if (!ctx) {
      resolve()
      return
    }

    const img = new Image()
    
    img.onload = () => {
      try {
        // Logo size (25% of QR code for better visibility)
        const logoSize = canvas.width * 0.25
        const x = (canvas.width - logoSize) / 2
        const y = (canvas.height - logoSize) / 2

        // Save canvas state
        ctx.save()

        // Draw white circular background for logo
        ctx.fillStyle = '#ffffff'
        ctx.beginPath()
        ctx.arc(canvas.width / 2, canvas.height / 2, logoSize / 2 + 4, 0, 2 * Math.PI)
        ctx.fill()

        // Create circular clipping path for logo
        ctx.beginPath()
        ctx.arc(canvas.width / 2, canvas.height / 2, logoSize / 2, 0, 2 * Math.PI)
        ctx.clip()

        // Draw logo
        ctx.drawImage(img, x, y, logoSize, logoSize)
        
        // Restore canvas state
        ctx.restore()
        
        console.log('Logo added to QR code')
        resolve()
      } catch (error) {
        console.error('Error adding logo:', error)
        resolve()
      }
    }
    
    img.onerror = () => {
      console.error('Failed to load logo image')
      resolve()
    }
    
    // Determine which logo to use:
    // 1. If user uploaded a logo, use it
    // 2. If user is Pro and has profile avatar, use avatar
    // 3. Otherwise, use default Linku logo
    let logoSrc = '/logo.svg' // Default
    
    console.log('=== Logo Selection Debug ===')
    console.log('uploadedLogo.value:', uploadedLogo.value)
    console.log('subscriptionStatus.value.isActive:', subscriptionStatus.value.isActive)
    console.log('userStore.user:', userStore.user)
    console.log('userStore.user?.avatar:', userStore.user?.avatar)
    
    if (uploadedLogo.value) {
      // User uploaded a custom logo (Pro feature)
      logoSrc = uploadedLogo.value
      console.log('Using uploaded logo')
    } else if (subscriptionStatus.value.isActive && userStore.user?.avatar) {
      // User is Pro and has avatar
      logoSrc = userStore.user.avatar
      console.log('Using user avatar:', logoSrc)
    } else {
      console.log('Using default logo')
    }
    
    console.log('Final logoSrc:', logoSrc)
    console.log('=========================')
    
    img.src = logoSrc
  })
}

// Add logo to download canvas (high resolution)
const addLogoToDownloadCanvas = async (canvas: HTMLCanvasElement, format: 'png' | 'jpg' | 'pdf' = 'png'): Promise<void> => {
  return new Promise((resolve) => {
    const ctx = canvas.getContext('2d')
    if (!ctx) {
      resolve()
      return
    }

    // Create image from blob URL (cropped image) or default logo
    const img = new Image()
    
    // Set CORS if needed
    img.crossOrigin = 'anonymous'
    
    img.onload = () => {
      try {
        console.log('Image loaded successfully')
        console.log('Image dimensions:', img.width, 'x', img.height)
        console.log('Canvas dimensions:', canvas.width, 'x', canvas.height)
        
        // Logo size (25% of QR code for better visibility)
        const logoSize = canvas.width * 0.25
        const x = (canvas.width - logoSize) / 2
        const y = (canvas.height - logoSize) / 2

        console.log('Logo placement:', { x, y, logoSize })

        // Save canvas state
        ctx.save()

        // Draw white circular background for logo
        ctx.fillStyle = '#ffffff'
        ctx.beginPath()
        ctx.arc(canvas.width / 2, canvas.height / 2, logoSize / 2 + 8, 0, 2 * Math.PI)
        ctx.fill()

        // Create circular clipping path for logo
        ctx.beginPath()
        ctx.arc(canvas.width / 2, canvas.height / 2, logoSize / 2, 0, 2 * Math.PI)
        ctx.clip()

        // Draw logo
        ctx.drawImage(img, x, y, logoSize, logoSize)
        
        // Restore canvas state
        ctx.restore()
        
        console.log('Logo drawn successfully to download canvas')
        resolve()
      } catch (error) {
        console.error('Error adding logo to download canvas:', error)
        resolve()
      }
    }
    
    img.onerror = (error) => {
      console.error('Failed to load logo image for download:', error)
      resolve()
    }
    
    // Determine which logo to use for download:
    // 1. If user uploaded a logo, use it
    // 2. If user is Pro and has avatar, use avatar
    // 3. Otherwise, use default Linku logo
    let logoSrc = '/logo.svg' // Default
    
    console.log('=== Download Logo Selection Debug ===')
    console.log('uploadedLogo.value:', uploadedLogo.value)
    console.log('subscriptionStatus.value.isActive:', subscriptionStatus.value.isActive)
    console.log('userStore.user?.avatar:', userStore.user?.avatar)
    
    if (uploadedLogo.value) {
      // User uploaded a custom logo (Pro feature)
      logoSrc = uploadedLogo.value
      console.log('Using uploaded logo for download')
    } else if (subscriptionStatus.value.isActive && userStore.user?.avatar) {
      // User is Pro and has avatar
      logoSrc = userStore.user.avatar
      console.log('Using user avatar for download:', logoSrc)
    } else {
      console.log('Using default logo for download')
    }
    
    console.log('Final download logoSrc:', logoSrc)
    console.log('====================================')
    
    console.log('Setting image source:', logoSrc.substring(0, 50) + '...')
    img.src = logoSrc
  })
}

// Watch for changes to regenerate QR code
watch([
  () => selectedOptions.foregroundColor,
  () => selectedOptions.backgroundColor,
  () => qrData.value
], () => {
  nextTick(() => {
    generateQRCode()
  })
})

// Generate QR code on mount
onMounted(() => {
  nextTick(() => {
    generateQRCode()
  })
})

// Watch for color changes and regenerate QR code
watch(() => selectedOptions.foregroundColor, () => {
  nextTick(() => {
    generateQRCode()
  })
})

watch(() => selectedOptions.backgroundColor, () => {
  nextTick(() => {
    generateQRCode()
  })
})

// Watch for logo changes
watch(() => uploadedLogo.value, () => {
  nextTick(() => {
    generateQRCode()
  })
})
</script>

<style scoped>
.animate-slide-up {
  animation: slideUp 0.3s ease-out;
}

@keyframes slideUp {
  from {
    transform: translateY(100%);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}
</style>
