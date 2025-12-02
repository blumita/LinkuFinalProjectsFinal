<template>
  <UiBottomSheet
      :visible="visible"
      title="اشتراک کارت"
      @close="$emit('close')"
  >
    <div class="flex flex-col items-center gap-4 mb-8 border-b border-gray-100 pb-4">
      <canvas ref="qrCanvas" width="160" height="160" class="rounded-lg"/>
      <button
          @click="downloadQR(card.qrColor?card.qrColor:'#000000',
        card.qrBgColor?card.qrBgColor:'#ffffff')"
          class="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 px-5 py-2 rounded-full font-medium mt-2"
      >
        <i class="ti ti-download"></i>
        دانلود QR کد
      </button>
    </div>

    <div class="my-16">
      <p class="text-sm font-semibold mb-4">کپی لینک کارت</p>
      <div class="relative flex justify-between gap-4">
        <input
            readonly
            :value="profileLink"
            class="w-full bg-gray-100 text-sm text-gray-700 py-4 px-3 rounded-2xl ltr:pr-20 rtl:pl-20"
        />
        <button
            @click="copyLink"
            class="text-blue-500 text-sm font-medium flex items-center justify-end gap-1 w-28"
        >
          <i class="ti ti-copy text-base"></i> کپی لینک
        </button>
      </div>
      <p v-if="copied" class="text-xs text-blue-500 mt-1">کپی شد!</p>
    </div>

    <div class="mt-6">
      <p class="text-sm font-semibold mb-4">اشتراک از طریق</p>
      <div class="grid grid-cols-2 gap-y-4 gap-x-4 pr-1">
        <a
            v-for="item in shareLinks"
            :key="item.name"
            :href="item.url"
            target="_blank"
            rel="noreferrer"
            class="flex items-center justify-between text-gray-700 rounded-lg px-4 py-3 bg-gray-100 hover:bg-gray-50 transition"
        >
          <div class="flex items-center gap-2">
            <component :is="markRaw(item.iconComponent)" :size="24"/>
            <span class="text-sm font-medium">{{ item.name }}</span>
          </div>
          <i class="ti ti-external-link opacity-50"/>
        </a>
      </div>
    </div>
  </UiBottomSheet>
</template>

<script setup>
import {ref, watch, computed, markRaw} from 'vue'
import QRCode from 'qrcode'
import {useIconComponents} from '~/composables/useIconComponentsMap'

import logoPath from '@/assets/logo/logo.png'
import {useCardStore} from "~/stores/card.js";

const props = defineProps({visible: Boolean, card: Object})
const _emit = defineEmits(['close'])

const {getIconComponent} = useIconComponents()

const profileLink = ref('')
const qrLogoSrc = ref('/logo/logo.png')
//const profileLink = 'https://linku.im/profile/MA5PZ1jq/share'
const appLink = 'https://linku.im/app/landing'
const copied = ref(false)
const qrCanvas = ref(null)

watch(() => props.card, (newVal) => {
  if (newVal !== null && newVal !== undefined) {
    qrLogoSrc.value = newVal.qrLogo ?? '/logo/logo.png'

    profileLink.value = newVal.slug
        ? `https://linku.im/profile/${newVal.slug}/share`
        : 'https://linku.im/profile/MA5PZ1jq/share'
  } else {
    qrLogoSrc.value = '/logo/logo.png'
    profileLink.value = 'https://linku.im/profile/MA5PZ1jq/share'
  }

})
const copyLink = () => {
  navigator.clipboard.writeText(profileLink.value)
  copied.value = true
  setTimeout(() => (copied.value = false), 2000)
}

const drawQR = async (color, bgColor) => {
  if (!qrCanvas.value || !import.meta.client||!profileLink.value) return
  await QRCode.toCanvas(qrCanvas.value, profileLink.value, {
    width: 160,
    margin: 1,
    errorCorrectionLevel: 'H',
    color: {dark: bgColor, light: color}
  })
  const ctx = qrCanvas.value.getContext('2d')
  const logo = new Image()
  logo.src = qrLogoSrc.value
  logo.crossOrigin = 'anonymous'
  await logo.decode()

  const size = 160
  const boxSize = size * 0.35
  const x = (size - boxSize) / 2
  const y = (size - boxSize) / 2
  ctx.save()
  ctx.beginPath()
  const r = 8
  ctx.moveTo(x + r, y)
  ctx.lineTo(x + boxSize - r, y)
  ctx.quadraticCurveTo(x + boxSize, y, x + boxSize, y + r)
  ctx.lineTo(x + boxSize, y + boxSize - r)
  ctx.quadraticCurveTo(x + boxSize, y + boxSize, x + boxSize - r, y + boxSize)
  ctx.lineTo(x + r, y + boxSize)
  ctx.quadraticCurveTo(x, y + boxSize, x, y + boxSize - r)
  ctx.lineTo(x, y + r)
  ctx.quadraticCurveTo(x, y, x + r, y)
  ctx.closePath()
  ctx.fillStyle = '#ffffff'
  ctx.fill()
  ctx.clip()
  const padding = boxSize * 0.15
  const ratio = Math.min((boxSize - 2 * padding) / logo.width, (boxSize - 2 * padding) / logo.height)
  const logoW = logo.width * ratio
  const logoH = logo.height * ratio
  const offsetX = x + (boxSize - logoW) / 2
  const offsetY = y + (boxSize - logoH) / 2
  ctx.drawImage(logo, offsetX, offsetY, logoW, logoH)
  ctx.restore()
}

const downloadQR = async (color, bgColor) => {
  const size = 800
  const canvas = document.createElement('canvas')
  canvas.width = size
  canvas.height = size
  const ctx = canvas.getContext('2d')
  await QRCode.toCanvas(canvas, profileLink.value, {
    errorCorrectionLevel: 'H',
    width: size,
    margin: 2,
    color: {dark: bgColor, light: color}
  })

  const logo = new Image()
  logo.src = qrLogoSrc.value
  logo.crossOrigin = 'anonymous'
  await logo.decode()
  const boxSize = size * 0.35
  const x = (size - boxSize) / 2
  const y = (size - boxSize) / 2
  ctx.save()
  ctx.beginPath()
  const r = 24
  ctx.moveTo(x + r, y)
  ctx.lineTo(x + boxSize - r, y)
  ctx.quadraticCurveTo(x + boxSize, y, x + boxSize, y + r)
  ctx.lineTo(x + boxSize, y + boxSize - r)
  ctx.quadraticCurveTo(x + boxSize, y + boxSize, x + boxSize - r, y + boxSize)
  ctx.lineTo(x + r, y + boxSize)
  ctx.quadraticCurveTo(x, y + boxSize, x, y + boxSize - r)
  ctx.lineTo(x, y + r)
  ctx.quadraticCurveTo(x, y, x + r, y)
  ctx.closePath()
  ctx.fillStyle = '#ffffff'
  ctx.fill()
  ctx.clip()
  const padding = boxSize * 0.12
  const ratio = Math.min((boxSize - 2 * padding) / logo.width, (boxSize - 2 * padding) / logo.height)
  const w = logo.width * ratio
  const h = logo.height * ratio
  const offsetX = x + (boxSize - w) / 2
  const offsetY = y + (boxSize - h) / 2
  ctx.drawImage(logo, offsetX, offsetY, w, h)
  ctx.restore()
  const link = document.createElement('a')
  link.href = canvas.toDataURL('image/png')
  link.download = 'qr-high-quality.png'
  link.click()
}
const cardStore=useCardStore()
watch(() => props.visible, async (val) => {
  if(val){
    await cardStore.fetchCard(props.card.id)
    qrLogoSrc.value = cardStore.activeCard?.qrLogo??'/logo/logo.png'
    profileLink.value = `https://linku.im/profile/${cardStore.activeCard?.slug}/share`
    if (val) {
      setTimeout(() => {
        drawQR(cardStore.activeCard.qrColor ? cardStore.activeCard.qrColor : '#000000'
            , cardStore.activeCard.qrBgColor ? cardStore.activeCard.qrBgColor : '#ffffff');
      }, 50);
    }
  }

}, {immediate: true});

const shareLinks = computed(() => [
  {
    name: 'ایمیل',
    iconComponent: getIconComponent({type: 'component', name: 'email'}),
    url: `mailto:?subject=کارت دیجیتال من&body=مشاهده کارت من: ${profileLink.value}`
  },
  {
    name: 'لینکدین',
    iconComponent: getIconComponent({type: 'component', name: 'linkedin'}),
    url: `https://www.linkedin.com/sharing/share-offsite/?url=${profileLink.value}`
  },
  {
    name: 'تلگرام',
    iconComponent: getIconComponent({type: 'component', name: 'telegram'}),
    url: `https://t.me/share/url?url=${profileLink.value}`
  },
  {
    name: 'واتساپ',
    iconComponent: getIconComponent({type: 'component', name: 'whatsapp'}),
    url: `https://api.whatsapp.com/send?text=${encodeURIComponent('مشاهده کارت من: ' + profileLink.value)}`
  }
])
</script>
