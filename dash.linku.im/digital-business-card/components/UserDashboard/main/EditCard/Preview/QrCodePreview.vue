<template>
  <div class="bg-white w-full rounded-xl border border-gray-200 shadow overflow-hidden">
    <div class="qr-header bg-white p-4 border-b">
      <div class="flex justify-between items-center">
        <div class="flex items-center gap-2">
          <i class="ti ti-qrcode text-gray-700 text-lg"></i>
          <h3 class="text-sm font-semibold text-gray-700">QR Code اختصاصی شما</h3>
        </div>
        <div class="flex gap-2">
          <button 
            @click="downloadQR('png')"
            class="download-btn flex items-center gap-1 px-3 py-1 text-xs bg-white/20 backdrop-blur-sm rounded-full hover:bg-white/30 transition-all text-gray-700"
            :disabled="!url || generating"
          >
            <i class="ti ti-download text-xs"></i>
            PNG
          </button>
          <button 
            @click="downloadQR('svg')"
            class="download-btn flex items-center gap-1 px-3 py-1 text-xs bg-white/20 backdrop-blur-sm rounded-full hover:bg-white/30 transition-all text-gray-700"
            :disabled="!url || generating"
          >
            <i class="ti ti-download text-xs"></i>
            SVG
          </button>
        </div>
      </div>
    </div>

    <div class="qr-content p-5">
      <div v-if="error" class="error-message mb-3 p-3 bg-red-50 text-red-600 rounded-lg text-sm flex items-center">
        <i class="ti ti-alert-circle text-lg mr-2"></i>
        <span>{{ error }}</span>
      </div>
      
      <div v-if="generating" class="loading-message mb-3 p-3 bg-blue-50 text-blue-600 rounded-lg text-sm flex items-center">
        <i class="ti ti-refresh animate-spin text-lg mr-2"></i>
        <span>در حال تولید QR کد اختصاصی...</span>
      </div>

      <div class="flex flex-col items-center">
        <div class="qr-display relative p-5 bg-white rounded-xl shadow-inner border border-gray-100 flex flex-col items-center"
          :style="{ backgroundColor: bgColor }">
          <div class="qr-badge mb-2 px-2 py-1 bg-blue-100 text-blue-600 rounded-full text-xs">
            QR Code اختصاصی
          </div>
          <canvas 
            ref="qrCanvas" 
            class="qr-code w-full max-w-[200px] h-auto"
          ></canvas>
        </div>

        <div class="qr-instruction mt-4 p-3 bg-gray-50 rounded-lg flex items-center border border-gray-200">
          <i class="ti ti-scan text-blue-500 text-lg mr-2"></i>
          <span class="text-gray-600 text-sm">برای دسترسی به پروفایل اختصاصی خود، این QR کد را اسکن کنید</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'
import QRCode from 'qrcode'

const props = defineProps({
  color: {
    type: String,
    default: '#1e40af'
  },
  bgColor: {
    type: String,
    default: '#ffffff'
  },
  logo: {
    type: String,
    default: '/logo/logo.png'
  },
  url: {
    type: String,
    required: true
  },
  logoSize: {
    type: Number,
    default: 30
  },
  logoPadding: {
    type: Number,
    default: 15
  },
  logoRadius: {
    type: Number,
    default: 10
  }
})

const qrCanvas = ref(null)
const error = ref(null)
const generating = ref(false)

const drawLogoWithPadding = async (ctx, canvas) => {
  try {
    const logoImg = new Image()
    logoImg.crossOrigin = 'anonymous'
    logoImg.src = props.logo

    await new Promise((resolve) => {
      logoImg.onload = resolve
      logoImg.onerror = () => {
        resolve()
      }
    })

    if (!logoImg.complete || logoImg.naturalWidth === 0) return

    // محاسبه اندازه اصلی لوگو
    const logoSize = (props.logoSize / 70) * canvas.width
    
    // محاسبه پدینگ بر اساس درصدی از اندازه لوگو
    const padding = (props.logoPadding / 100) * logoSize
    
    // اندازه کل ناحیه شامل لوگو و پدینگ
    const totalArea = logoSize + padding * 2

    // مختصات مرکز برای لوگو
    const centerX = canvas.width / 2
    const centerY = canvas.height / 2

    // رسم پس‌زمینه سفید با پدینگ
    ctx.save()
    ctx.beginPath()
    ctx.roundRect(
      centerX - totalArea/2, 
      centerY - totalArea/2, 
      totalArea, 
      totalArea, 
      props.logoRadius
    )
    ctx.fillStyle = '#ffffff'
    ctx.shadowColor = 'rgba(30, 64, 175, 0.2)'
    ctx.shadowBlur = 8
    ctx.shadowOffsetY = 3
    ctx.fill()
    ctx.restore()

    // رسم لوگو با پدینگ داخلی
    ctx.save()
    ctx.beginPath()
    ctx.roundRect(
      centerX - totalArea/2, 
      centerY - totalArea/2, 
      totalArea, 
      totalArea, 
      props.logoRadius
    )
    ctx.clip()

    const scale = Math.min(
      logoSize / logoImg.width,
      logoSize / logoImg.height
    )
    const scaledWidth = logoImg.width * scale
    const scaledHeight = logoImg.height * scale
    
    ctx.drawImage(
      logoImg,
      centerX - scaledWidth/2,
      centerY - scaledHeight/2,
      scaledWidth,
      scaledHeight
    )
    ctx.restore()

  } catch (err) {
  }
}

const generateQR = async () => {
  if (!qrCanvas.value || !props.url) return
  
  generating.value = true
  error.value = null

  try {
    const size = 200
    qrCanvas.value.width = size
    qrCanvas.value.height = size
    const ctx = qrCanvas.value.getContext('2d')
    ctx.clearRect(0, 0, size, size)

    await QRCode.toCanvas(qrCanvas.value, props.url, {
      width: size,
      margin: 1,
      color: {
        dark: props.color,
        light: props.bgColor
      },
      errorCorrectionLevel: 'H'
    })

    await drawLogoWithPadding(ctx, qrCanvas.value)

  } catch (err) {
    error.value = 'خطا در تولید QR کد اختصاصی'
  } finally {
    generating.value = false
  }
}

const downloadQR = async (type) => {
  if (!props.url) {
    error.value = 'آدرس URL نامعتبر است'
    return
  }

  generating.value = true

  try {
    const canvas = document.createElement('canvas')
    const size = 500
    canvas.width = size
    canvas.height = size

    await QRCode.toCanvas(canvas, props.url, {
      width: size,
      margin: 2,
      color: {
        dark: props.color,
        light: props.bgColor
      },
      errorCorrectionLevel: 'H'
    })

    const ctx = canvas.getContext('2d')
    await drawLogoWithPadding(ctx, canvas)

    const link = document.createElement('a')
    link.href = canvas.toDataURL(`image/${type}`, 0.9)
    link.download = `my-qrcode-${new Date().getTime()}.${type}`
    document.body.appendChild(link)
    link.click()
    setTimeout(() => {
      document.body.removeChild(link)
    }, 100)

  } catch (err) {
    error.value = 'خطا در ایجاد فایل دانلود'
  } finally {
    generating.value = false
  }
}

watch(() => [
  props.url,
  props.color,
  props.bgColor,
  props.logo,
  props.logoSize,
  props.logoPadding,
  props.logoRadius
], generateQR, { immediate: true })

onMounted(generateQR)
</script>

<style scoped>
.qr-code-container {
  max-width: 350px;
  margin: 0 auto;
}



.download-btn {
  transition: all 0.2s ease;
}

.download-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.qr-display {
  min-width: 220px;
  min-height: 220px;
}

.error-message {
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(-5px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>