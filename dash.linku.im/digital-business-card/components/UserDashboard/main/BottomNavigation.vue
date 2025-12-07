<script setup lang="ts">
import { ref, computed, watch, nextTick, shallowRef } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useFormStore } from '~/stores/form'
import { useUserStore } from '~/stores/user'
import type { CardItem } from '~/stores/form'
import BottomSheet from '~/components/ui/BottomSheet.vue'
import Toast from '~/components/ui/Toast.vue'

const router = useRouter()
const route = useRoute()
const formStore = useFormStore()
const userStore = useUserStore()

const emit = defineEmits(['open-share'])

const isBottomSheetOpen = ref(false)
const qrCanvas = shallowRef<HTMLCanvasElement | null>(null)
const showToast = ref(false)
const toastMessage = ref('لینک کپی شد!')
const toastType = ref<'success' | 'error' | 'warning' | 'info'>('success')
const showProfileSelector = ref(false)
const selectedSharingProfile = ref<CardItem | null>(null)

// نمایش Toast
const showToastMessage = (message: string, type: 'success' | 'error' | 'warning' | 'info' = 'success') => {
  toastMessage.value = message
  toastType.value = type
  showToast.value = true
}

// کارت پیش‌فرض - باید قبل از userAvatar باشه
const defaultCard = computed(() => {
  return formStore.defaultCard || (formStore.cards || []).filter(card => card.isActive !== false)[0] || null
})

// آواتار کاربر - اول از کارت پیش‌فرض، بعد از formStore، بعد از userStore
// استفاده از getter های safe برای رفع Mixed Content
const userAvatar = computed(() => {
  // 1. اول از کارت پیش‌فرض چک کن
  const cardAvatar = defaultCard.value?.avatar
  if (cardAvatar && typeof cardAvatar === 'string' && cardAvatar.trim().length > 0) {
    return cardAvatar
  }
  
  // 2. بعد از safeProfileImage توی formStore (transformed URL)
  const profileImage = formStore.safeProfileImage
  if (profileImage && typeof profileImage === 'string' && profileImage.trim().length > 0) {
    return profileImage
  }
  
  // 3. در آخر از userStore
  const userAvatarFromStore = userStore.user?.avatar
  if (userAvatarFromStore && typeof userAvatarFromStore === 'string' && userAvatarFromStore.trim().length > 0) {
    return userAvatarFromStore
  }
  
  return '/logo.svg'
})

// نام کاربر و یوزرنیم از userStore
const userName = computed(() => userStore.user?.name || 'کاربر')
const userUserName = computed(() => {
  // چک کردن هر دو فیلد userName و username
  return userStore.user?.userName || userStore.user?.username || ''
})

// لیست کارت‌های کاربر با فیلتر فقط کارت‌های فعال
const availableProfiles = computed(() => {
  const cards = formStore.cards || []
  return cards.filter(card => card.isActive !== false)
})

// تنظیم پروفایل انتخابی برای اشتراک‌گذاری
watch(() => defaultCard.value, (newCard) => {
  if (newCard && !selectedSharingProfile.value) {
    selectedSharingProfile.value = newCard
  }
}, { immediate: true })

// لینک پروفایل برای اشتراک‌گذاری با slug یا userName واقعی
const profileLink = computed(() => {
  if (typeof window === 'undefined') return 'https://linku.im'
  
  const baseUrl = window.location.origin
  
  // همیشه از یوزرنیم اصلی کاربر استفاده کن (از تنظیمات)
  const identifier = userUserName.value || userName.value || 'profile'
  
  return `${baseUrl}/${identifier}`
})

// وضعیت Pro کاربر
const isPro = computed(() => userStore.user?.isPro || false)

// آیتم‌های Bottom Navigation
const navItems = computed(() => [
  {
    id: 'profile',
    icon: 'ti ti-user',
    label: 'پروفایل',
    path: '/profile',
    isActive: route.path.includes('/profile')
  },
  {
    id: 'analytics',
    icon: 'ti ti-chart-line',
    label: 'تحلیل‌ها',
    path: '/dashboard/insights',
    isActive: route.path.includes('/dashboard/insights')
  },
  {
    id: 'share',
    icon: 'ti ti-brand-telegram',
    label: '',
    action: 'share',
    isCenter: true
  },
  {
    id: 'search',
    icon: 'ti ti-search',
    label: 'جستجو',
    path: '/dashboard/search',
    action: 'search'
  },
  {
    id: 'dashboard',
    avatarUrl: userAvatar.value,
    label: 'داشبورد',
    path: '/dashboard',
    isActive: route.path === '/dashboard' || (route.path.startsWith('/dashboard') && !route.path.includes('/insights'))
  }
])

const handleItemClick = (item: any) => {
  if (item.path) {
    router.push(item.path)
  } else if (item.action === 'share') {
    openShareMenu()
  }
}

const openShareMenu = () => {
  isBottomSheetOpen.value = true
  nextTick(() => {
    drawQR()
  })
}

const drawQR = async () => {
  if (!qrCanvas.value) return
  
  try {
    const QRCode = (await import('qrcode')).default
    
    // استفاده از رنگ سفارشی از تنظیمات کارت
    const qrColor = defaultCard.value?.qrColor || '#000000'
    const qrBgColor = defaultCard.value?.qrBgColor || '#ffffff'
    
    await QRCode.toCanvas(qrCanvas.value, profileLink.value, {
      width: 200,
      margin: 1,
      color: {
        dark: qrColor,
        light: qrBgColor
      },
      errorCorrectionLevel: 'H'
    })
    
    // اضافه کردن لوگو در وسط
    const ctx = qrCanvas.value.getContext('2d')
    if (!ctx) return
    
    const logoSrc = selectedSharingProfile.value?.avatar 
      || selectedSharingProfile.value?.logo 
      || userAvatar.value
    
    const logo = new Image()
    logo.crossOrigin = 'anonymous'
    logo.onload = () => {
      const logoSize = 50
      const centerX = 100
      const centerY = 100
      
      // پس‌زمینه سفید
      ctx.fillStyle = '#ffffff'
      ctx.beginPath()
      ctx.arc(centerX, centerY, logoSize / 2 + 4, 0, 2 * Math.PI)
      ctx.fill()
      
      // رسم لوگو
      ctx.save()
      ctx.beginPath()
      ctx.arc(centerX, centerY, logoSize / 2, 0, 2 * Math.PI)
      ctx.clip()
      ctx.drawImage(logo, centerX - logoSize / 2, centerY - logoSize / 2, logoSize, logoSize)
      ctx.restore()
      
      // بوردر طلایی برای Pro
      if (isPro.value && selectedSharingProfile.value?.avatar) {
        ctx.strokeStyle = '#ffd700'
        ctx.lineWidth = 2
        ctx.beginPath()
        ctx.arc(centerX, centerY, logoSize / 2, 0, 2 * Math.PI)
        ctx.stroke()
      }
    }
    logo.onerror = () => {
    }
    logo.src = logoSrc
    
  } catch (error) {
  }
}

const copyLink = async () => {
  try {
    await navigator.clipboard.writeText(profileLink.value)
    showToastMessage('لینک کپی شد!', 'success')
  } catch (error) {
  }
}

const downloadQR = async () => {
  try {
    // ساخت QR با کیفیت بالا (1000x1000) برای دانلود
    const QRCode = (await import('qrcode')).default
    const highResCanvas = document.createElement('canvas')
    highResCanvas.width = 1000
    highResCanvas.height = 1000
    
    // استفاده از رنگ سفارشی از تنظیمات کارت
    const qrColor = defaultCard.value?.qrColor || '#000000'
    const qrBgColor = defaultCard.value?.qrBgColor || '#ffffff'
    
    await QRCode.toCanvas(highResCanvas, profileLink.value, {
      width: 1000,
      margin: 2,
      color: {
        dark: qrColor,
        light: qrBgColor
      },
      errorCorrectionLevel: 'H'
    })
    
    // اضافه کردن لوگو در وسط با سایز بزرگتر
    const ctx = highResCanvas.getContext('2d')
    if (ctx) {
      const logoSrc = selectedSharingProfile.value?.avatar 
        || selectedSharingProfile.value?.logo 
        || userAvatar.value
      
      if (logoSrc && logoSrc !== '/logo.svg') {
        const logo = new Image()
        logo.crossOrigin = 'anonymous'
        
        await new Promise<void>((resolve) => {
          logo.onload = () => {
            const logoSize = 250 // سایز لوگو برای 1000x1000
            const centerX = 500
            const centerY = 500
            
            // پس‌زمینه سفید
            ctx.fillStyle = '#ffffff'
            ctx.beginPath()
            ctx.arc(centerX, centerY, logoSize / 2 + 20, 0, 2 * Math.PI)
            ctx.fill()
            
            // رسم لوگو
            ctx.save()
            ctx.beginPath()
            ctx.arc(centerX, centerY, logoSize / 2, 0, 2 * Math.PI)
            ctx.clip()
            ctx.drawImage(logo, centerX - logoSize / 2, centerY - logoSize / 2, logoSize, logoSize)
            ctx.restore()
            
            // بوردر طلایی برای Pro
            if (isPro.value && selectedSharingProfile.value?.avatar) {
              ctx.strokeStyle = '#ffd700'
              ctx.lineWidth = 8
              ctx.beginPath()
              ctx.arc(centerX, centerY, logoSize / 2 + 4, 0, 2 * Math.PI)
              ctx.stroke()
            }
            
            resolve()
          }
          logo.onerror = () => resolve()
          logo.src = logoSrc
        })
      }
    }
    
    // دانلود با کیفیت بالا
    const link = document.createElement('a')
    link.href = highResCanvas.toDataURL('image/png', 1.0)
    link.download = `qr-${selectedSharingProfile.value?.slug || 'profile'}-1000x1000.png`
    link.click()
    
    showToastMessage('کیوآر کد با کیفیت بالا ذخیره شد!', 'success')
  } catch (error) {
    console.error('Error downloading QR:', error)
    showToastMessage('خطا در ذخیره کیوآر کد', 'error')
  }
}

const shareProfile = async () => {
  if (navigator.share) {
    try {
      await navigator.share({
        title: `پروفایل ${selectedSharingProfile.value?.name || 'من'}`,
        text: 'پروفایل من را در لینکو ببینید!',
        url: profileLink.value
      })
    } catch (error: any) {
      if (error?.name !== 'AbortError') {
        copyLink()
      }
    }
  } else {
    copyLink()
  }
}

const customizeLink = () => {
  // رفتن به صفحه سفارشی‌سازی لینک
  router.push('/profile/customize-link')
  isBottomSheetOpen.value = false
}

const customizeQR = () => {
  // رفتن به صفحه سفارشی‌سازی QR
  router.push('/QR')
  isBottomSheetOpen.value = false
}

const shareViaSMS = () => {
  const text = `پروفایل من را ببینید: ${profileLink.value}`
  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent)
  window.location.href = isIOS ? `sms:&body=${encodeURIComponent(text)}` : `sms:?body=${encodeURIComponent(text)}`
}

const shareViaEmail = () => {
  const subject = `پروفایل ${selectedSharingProfile.value?.name || 'من'}`
  const body = `سلام،\n\nپروفایل من را در لینکو ببینید:\n${profileLink.value}`
  window.location.href = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
}

const shareViaWhatsApp = () => {
  const text = `پروفایل من را ببینید: ${profileLink.value}`
  window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank')
}

const shareViaTelegram = () => {
  const text = `پروفایل من را ببینید: ${profileLink.value}`
  window.open(`https://t.me/share/url?url=${encodeURIComponent(profileLink.value)}&text=${encodeURIComponent(text)}`, '_blank')
}

const shareViaInstagram = async () => {
  await copyLink()
  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent)
  const isAndroid = /Android/.test(navigator.userAgent)
  
  if (isIOS) {
    window.location.href = 'instagram://app'
  } else if (isAndroid) {
    window.location.href = 'intent://instagram.com/#Intent;package=com.instagram.android;scheme=https;end'
  } else {
    window.open('https://www.instagram.com/', '_blank')
  }
}

const shareAnotherWay = () => {
  shareProfile()
}

const selectProfileForSharing = (profile: CardItem) => {
  selectedSharingProfile.value = profile
  showProfileSelector.value = false
  nextTick(() => drawQR())
}

const addNewProfile = () => {
  showProfileSelector.value = false
  
  if (!isPro.value) {
    router.push('/dashboard/checkout')
    return
  }
  
  if (availableProfiles.value.length >= 5) {
    showToastMessage('حداکثر 5 پروفایل مجاز است', 'warning')
    return
  }
  
  router.push('/dashboard/add-card')
}

const handlePremiumClick = () => {
  router.push('/dashboard/checkout')
}

watch(isBottomSheetOpen, (newValue) => {
  if (newValue) {
    nextTick(() => drawQR())
  }
})
</script>

<template>
  <div>
    <!-- Bottom Navigation Bar -->
    <div 
      v-if="!isBottomSheetOpen"
      class="fixed bottom-0 left-0 right-0 bg-card border-t border-border z-40"
    >
      <div class="flex items-center justify-around h-20 px-6 relative">
        <template v-for="item in navItems" :key="item.id">
          <!-- دکمه وسطی بزرگتر -->
          <button
              v-if="item.isCenter"
              @click="handleItemClick(item)"
              class="w-16 h-16 bg-primary rounded-3xl flex items-center justify-center shadow-xl -mt-10 transition-all duration-200 hover:scale-105 hover:shadow-2xl"
          >
            <i :class="item.icon" class="text-primary-foreground font-bold text-4xl"></i>
          </button>

          <!-- آیتم با آواتار (داشبورد) -->
          <a
              v-else-if="item.avatarUrl"
              :href="item.path"
              @click.prevent="handleItemClick(item)"
              class="flex flex-col items-center justify-center p-3 transition-all duration-200 min-w-12"
          >
            <div :class="[
              'w-7 h-7 rounded-full overflow-hidden transition-all duration-200 border-2',
              item.isActive 
                ? 'border-primary scale-110 ring-2 ring-primary/20' 
                : 'border-muted-foreground/30 hover:border-primary/50'
            ]">
              <img :src="item.avatarUrl" :alt="item.label" class="w-full h-full object-cover">
            </div>
          </a>

          <!-- آیتم‌های عادی -->
          <div
              v-else
              @click="handleItemClick(item)"
              :class="[
                'flex flex-col items-center justify-center p-3 transition-all duration-200 min-w-12 relative cursor-pointer',
                item.isActive ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
              ]"
          >
            <i :class="item.icon" class="text-2xl"></i>
          </div>
        </template>
      </div>
    </div>

    <!-- Bottom Sheet برای اشتراک‌گذاری -->
    <BottomSheet
      v-model="isBottomSheetOpen"
      size="full"
      :closable="false"
      :close-on-backdrop="true"
    >
      <!-- Header -->
      <div class="sticky top-0 w-full z-10 bg-background lg:bg-card border-b border-border flex-shrink-0 lg:rounded-t-2xl">
        <div class="flex items-center justify-between px-6 py-4 lg:py-3">
          <h3 class="text-lg font-semibold text-foreground">اشتراک‌گذاری</h3>
          <button
            @click="isBottomSheetOpen = false"
            class="w-8 h-8 rounded-full bg-muted hover:bg-muted/80 flex items-center justify-center transition-colors"
          >
            <i class="ti ti-x text-foreground text-base"></i>
          </button>
        </div>
      </div>

      <!-- Content - Mobile: Vertical, Desktop: Two columns -->
      <div class="flex-1 overflow-y-auto lg:overflow-hidden">
        <div class="flex flex-col lg:flex-row lg:h-full">
          
          <!-- Right Column (Desktop) / Top Section (Mobile) - QR Code -->
          <div class="lg:w-1/2 lg:border-l lg:border-border p-6 lg:flex lg:flex-col lg:justify-center lg:items-center bg-muted/30">
            <!-- Profile Selector -->
            <div class="flex justify-center mb-6">
              <button
                @click="showProfileSelector = true"
                class="flex items-center gap-2 p-3 bg-background hover:bg-muted/80 rounded-full border border-border min-w-[164px] transition-colors"
              >
                <div class="w-7 h-7 rounded-full overflow-hidden flex-shrink-0 ring-2 ring-primary/30">
                  <img 
                    v-if="selectedSharingProfile?.avatar || userAvatar"
                    :src="selectedSharingProfile?.avatar || userAvatar" 
                    :alt="userName"
                    class="w-full h-full object-cover"
                  />
                  <div 
                    v-else
                    class="w-full h-full flex items-center justify-center"
                    :style="{ backgroundColor: formStore.iconColor?.background || 'rgb(var(--color-primary))' }"
                  >
                    <i class="ti ti-user text-white text-xs"></i>
                  </div>
                </div>
                <span class="text-sm font-medium text-foreground truncate flex-1">
                  {{ userName }}
                </span>
                <i class="ti ti-chevron-down text-muted-foreground flex-shrink-0"></i>
              </button>
            </div>

            <!-- QR Code -->
            <div class="flex flex-col items-center justify-center mb-6">
              <div class="p-4 rounded-2xl border-2 border-border shadow-lg bg-white">
                <canvas ref="qrCanvas" width="200" height="200" class="rounded-lg" />
              </div>
            </div>

            <!-- Share Button -->
            <div class="flex justify-center">
              <button
                @click="shareProfile"
                class="flex items-center gap-3 px-10 py-3 bg-primary text-primary-foreground rounded-full font-semibold text-base hover:opacity-90 transition-opacity shadow-lg"
              >
                <i class="ti ti-share-2 text-lg"></i>
                اشتراک‌گذاری
              </button>
            </div>
          </div>

          <!-- Left Column (Desktop) / Bottom Section (Mobile) - Actions -->
          <div class="lg:w-1/2 p-6 lg:overflow-y-auto">
            <!-- Mobile: List view -->
            <div class="lg:hidden space-y-0 bg-card rounded-2xl overflow-hidden border border-border shadow-sm">
              <button
                @click="copyLink"
                class="w-full flex items-center gap-3 p-4 hover:bg-muted/50 transition-all border-b border-border"
              >
                <div class="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center">
                  <i class="ti ti-link text-primary text-lg"></i>
                </div>
                <span class="font-medium text-foreground text-sm">کپی لینک</span>
              </button>

              <button
                @click="customizeLink"
                class="w-full flex items-center gap-3 p-4 hover:bg-muted/50 transition-all border-b border-border"
              >
                <div class="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center">
                  <i class="ti ti-edit text-primary text-lg"></i>
                </div>
                <span class="font-medium text-foreground text-sm">سفارشی‌سازی لینک</span>
              </button>

              <button
                @click="customizeQR"
                class="w-full flex items-center gap-3 p-4 hover:bg-muted/50 transition-all border-b border-border"
              >
                <div class="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center">
                  <i class="ti ti-qrcode text-primary text-lg"></i>
                </div>
                <span class="font-medium text-foreground text-sm">سفارشی‌سازی کیوآر کد</span>
              </button>

              <button
                @click="downloadQR"
                class="w-full flex items-center gap-3 p-4 hover:bg-muted/50 transition-all border-b border-border"
              >
                <div class="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center">
                  <i class="ti ti-photo text-primary text-lg"></i>
                </div>
                <span class="font-medium text-foreground text-sm">ذخیره در گالری</span>
              </button>

              <button
                @click="shareViaSMS"
                class="w-full flex items-center gap-3 p-4 hover:bg-muted/50 transition-all border-b border-border"
              >
                <div class="w-9 h-9 rounded-xl bg-blue-500/10 flex items-center justify-center">
                  <i class="ti ti-message text-blue-500 text-lg"></i>
                </div>
                <span class="font-medium text-foreground text-sm">ارسال پیامک</span>
              </button>

              <button
                @click="shareViaEmail"
                class="w-full flex items-center gap-3 p-4 hover:bg-muted/50 transition-all border-b border-border"
              >
                <div class="w-9 h-9 rounded-xl bg-red-500/10 flex items-center justify-center">
                  <i class="ti ti-mail text-red-500 text-lg"></i>
                </div>
                <span class="font-medium text-foreground text-sm">ارسال ایمیل</span>
              </button>

              <button
                @click="shareViaWhatsApp"
                class="w-full flex items-center gap-3 p-4 hover:bg-muted/50 transition-all border-b border-border"
              >
                <div class="w-9 h-9 rounded-xl bg-green-500/10 flex items-center justify-center">
                  <i class="ti ti-brand-whatsapp text-green-500 text-lg"></i>
                </div>
                <span class="font-medium text-foreground text-sm">اشتراک در واتساپ</span>
              </button>

              <button
                @click="shareViaInstagram"
                class="w-full flex items-center gap-3 p-4 hover:bg-muted/50 transition-all border-b border-border"
              >
                <div class="w-9 h-9 rounded-xl bg-pink-500/10 flex items-center justify-center">
                  <i class="ti ti-brand-instagram text-pink-500 text-lg"></i>
                </div>
                <span class="font-medium text-foreground text-sm">اشتراک در اینستاگرام</span>
              </button>

              <button
                @click="shareViaTelegram"
                class="w-full flex items-center gap-3 p-4 hover:bg-muted/50 transition-all border-b border-border"
              >
                <div class="w-9 h-9 rounded-xl bg-blue-500/10 flex items-center justify-center">
                  <i class="ti ti-brand-telegram text-blue-500 text-lg"></i>
                </div>
                <span class="font-medium text-foreground text-sm">اشتراک در تلگرام</span>
              </button>

              <button
                @click="shareAnotherWay"
                class="w-full flex items-center gap-3 p-4 hover:bg-muted/50 transition-all"
              >
                <div class="w-9 h-9 rounded-xl bg-muted flex items-center justify-center">
                  <i class="ti ti-dots text-muted-foreground text-lg"></i>
                </div>
                <span class="font-medium text-foreground text-sm">روش‌های دیگر</span>
              </button>
            </div>

            <!-- Desktop: Grid view -->
            <div class="hidden lg:block">
              <h4 class="text-sm font-semibold text-muted-foreground mb-4">روش‌های اشتراک‌گذاری</h4>
              <div class="grid grid-cols-4 gap-3">
                <button
                  @click="copyLink"
                  class="flex flex-col items-center gap-2 p-4 hover:bg-muted/50 rounded-xl transition-all border border-border bg-card"
                >
                  <div class="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center">
                    <i class="ti ti-link text-primary text-xl"></i>
                  </div>
                  <span class="font-medium text-foreground text-xs text-center">کپی لینک</span>
                </button>

                <button
                  @click="customizeLink"
                  class="flex flex-col items-center gap-2 p-4 hover:bg-muted/50 rounded-xl transition-all border border-border bg-card"
                >
                  <div class="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center">
                    <i class="ti ti-edit text-primary text-xl"></i>
                  </div>
                  <span class="font-medium text-foreground text-xs text-center">سفارشی لینک</span>
                </button>

                <button
                  @click="customizeQR"
                  class="flex flex-col items-center gap-2 p-4 hover:bg-muted/50 rounded-xl transition-all border border-border bg-card"
                >
                  <div class="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center">
                    <i class="ti ti-qrcode text-primary text-xl"></i>
                  </div>
                  <span class="font-medium text-foreground text-xs text-center">سفارشی QR</span>
                </button>

                <button
                  @click="downloadQR"
                  class="flex flex-col items-center gap-2 p-4 hover:bg-muted/50 rounded-xl transition-all border border-border bg-card"
                >
                  <div class="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center">
                    <i class="ti ti-photo text-primary text-xl"></i>
                  </div>
                  <span class="font-medium text-foreground text-xs text-center">ذخیره QR</span>
                </button>

                <button
                  @click="shareViaSMS"
                  class="flex flex-col items-center gap-2 p-4 hover:bg-muted/50 rounded-xl transition-all border border-border bg-card"
                >
                  <div class="w-11 h-11 rounded-xl bg-blue-500/10 flex items-center justify-center">
                    <i class="ti ti-message text-blue-500 text-xl"></i>
                  </div>
                  <span class="font-medium text-foreground text-xs text-center">پیامک</span>
                </button>

                <button
                  @click="shareViaEmail"
                  class="flex flex-col items-center gap-2 p-4 hover:bg-muted/50 rounded-xl transition-all border border-border bg-card"
                >
                  <div class="w-11 h-11 rounded-xl bg-red-500/10 flex items-center justify-center">
                    <i class="ti ti-mail text-red-500 text-xl"></i>
                  </div>
                  <span class="font-medium text-foreground text-xs text-center">ایمیل</span>
                </button>

                <button
                  @click="shareViaWhatsApp"
                  class="flex flex-col items-center gap-2 p-4 hover:bg-muted/50 rounded-xl transition-all border border-border bg-card"
                >
                  <div class="w-11 h-11 rounded-xl bg-green-500/10 flex items-center justify-center">
                    <i class="ti ti-brand-whatsapp text-green-500 text-xl"></i>
                  </div>
                  <span class="font-medium text-foreground text-xs text-center">واتساپ</span>
                </button>

                <button
                  @click="shareViaInstagram"
                  class="flex flex-col items-center gap-2 p-4 hover:bg-muted/50 rounded-xl transition-all border border-border bg-card"
                >
                  <div class="w-11 h-11 rounded-xl bg-pink-500/10 flex items-center justify-center">
                    <i class="ti ti-brand-instagram text-pink-500 text-xl"></i>
                  </div>
                  <span class="font-medium text-foreground text-xs text-center">اینستاگرام</span>
                </button>

                <button
                  @click="shareViaTelegram"
                  class="flex flex-col items-center gap-2 p-4 hover:bg-muted/50 rounded-xl transition-all border border-border bg-card"
                >
                  <div class="w-11 h-11 rounded-xl bg-blue-500/10 flex items-center justify-center">
                    <i class="ti ti-brand-telegram text-blue-500 text-xl"></i>
                  </div>
                  <span class="font-medium text-foreground text-xs text-center">تلگرام</span>
                </button>

                <button
                  @click="shareAnotherWay"
                  class="flex flex-col items-center gap-2 p-4 hover:bg-muted/50 rounded-xl transition-all border border-border bg-card"
                >
                  <div class="w-11 h-11 rounded-xl bg-muted flex items-center justify-center">
                    <i class="ti ti-dots text-muted-foreground text-xl"></i>
                  </div>
                  <span class="font-medium text-foreground text-xs text-center">بیشتر</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </BottomSheet>

    <!-- Toast Notification (iOS Style) -->
    <Toast
      v-if="showToast"
      :title="toastMessage"
      :type="toastType"
      @close="showToast = false"
    />

    <!-- Profile Selector Bottom Sheet -->
    <BottomSheet
      v-model="showProfileSelector"
      :closable="true"
      :close-on-backdrop="true"
      title="انتخاب پروفایل"
    >
      <div class="px-4 pb-6 pt-2">
        <p class="text-sm text-primary opacity-60 text-center mb-4">پروفایل مورد نظر خود را انتخاب کنید</p>
        
        <!-- Profiles List -->
        <div class="space-y-2">
          <div 
            v-for="profile in availableProfiles" 
            :key="profile.id"
            @click="selectProfileForSharing(profile)"
            class="flex items-center gap-3 p-3 rounded-2xl border cursor-pointer transition-colors"
            :class="selectedSharingProfile?.id === profile.id ? 'bg-primary/5 border-primary' : 'bg-secondary border-border hover:bg-accent-bg/30'"
          >
            <!-- Avatar -->
            <div class="relative w-11 h-11 rounded-full overflow-hidden ring-2 ring-border bg-white">
              <img 
                v-if="profile.avatar"
                :src="profile.avatar" 
                :alt="profile.name"
                class="w-full h-full object-cover"
              />
              <div 
                v-else
                class="w-full h-full flex items-center justify-center"
                :style="{ backgroundColor: formStore.iconColor?.background || 'rgb(var(--color-primary))' }"
              >
                <i class="ti ti-user text-white text-lg"></i>
              </div>
            </div>

            <!-- Info -->
            <div class="flex-1">
              <div class="flex items-center justify-between mb-0.5">
                <div class="flex items-center gap-1.5">
                  <h3 class="text-sm font-semibold text-primary">
                    {{ userName }}
                  </h3>
                  <!-- تیک آبی فقط برای کاربر Pro -->
                  <i 
                    v-if="isPro"
                    class="ti ti-rosette-discount-check-filled text-primary text-lg"
                  />
                </div>
                <span 
                  v-if="selectedSharingProfile?.id === profile.id"
                  class="text-xs bg-secondary text-primary border border-border px-2 py-0.5 rounded-full font-medium flex items-center gap-1"
                >
                  <i class="ti ti-check text-xs"></i>
                  پیش‌فرض
                </span>
              </div>
              
              <!-- Additional Info -->
              <div class="flex flex-wrap items-center gap-1.5 text-xs text-foreground">
                <span v-if="userUserName" class="font-medium">
                  @{{ userUserName }}
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- Add New Profile Button -->
        <div class="mt-3 pt-3">
          <div class="w-full flex items-center justify-between gap-2 p-3 rounded-2xl bg-secondary border-2 border-dashed border-border hover:bg-accent-bg/30 transition-colors">
            <div 
              @click="addNewProfile"
              class="flex items-center gap-2 flex-1 cursor-pointer"
            >
              <div class="w-11 h-11 rounded-full bg-accent-bg ring-2 ring-border flex items-center justify-center">
                <i class="ti ti-plus text-primary text-sm"></i>
              </div>
              <span class="text-sm font-medium text-primary">
                ایجاد پروفایل جدید
              </span>
            </div>
            <div 
              v-if="!isPro"
              @click="handlePremiumClick"
              class="bg-primary text-white px-3 py-1 rounded-full text-xs font-semibold cursor-pointer"
            >
              خرید اشتراک
            </div>
            <div 
              v-else
              class="bg-primary text-white px-3 py-1 rounded-full text-xs font-semibold"
            >
              کاربر ویژه
            </div>
          </div>
        </div>
      </div>
    </BottomSheet>
  </div>
</template>

<style scoped>
.w-16.h-16.shadow-xl {
  box-shadow: 0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1);
}

.w-16.h-16:hover {
  box-shadow: 0 25px 50px -12px rgb(0 0 0 / 0.25);
}
</style>
