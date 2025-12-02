<template>
  <a
    v-if="isLinkType"
    v-bind="$attrs"
    :class="[
      isListMode
        ? 'flex items-center gap-4 backdrop-blur rounded-xl p-2 w-full ' + (formData?.layout === 'left' ? 'text-left' : 'text-right') + (isDarkTheme ? ' bg-white/[0.02]' : isLightTheme ? ' bg-black/[0.02]' : ' bg-gradient-to-br from-white/60 via-white/30 to-white/10 border border-white/20')
        : 'rounded-xl text-center p-2 flex flex-col items-center justify-center transition hover:shadow-md backdrop-blur' + (isDarkTheme ? ' bg-white/[0.02]' : isLightTheme ? ' bg-black/[0.02]' : ' bg-gradient-to-br from-white/60 via-white/30 to-white/10 border border-white/20'),
    ]"
    :style="cardStyle"
    :href="finalUrl || undefined"
    :target="finalUrl ? '_blank' : undefined"
    :rel="finalUrl ? 'noopener' : undefined"
  >
    <div :class="[
      isListMode ? 'flex-shrink-0 rounded-xl flex items-center overflow-hidden w-[54px] h-[54px]' : 'w-[54px] h-[54px] rounded-xl flex items-center justify-center mb-2 overflow-hidden',
      isDarkTheme || isLightTheme ? '' : 'bg-gray-100'
    ]">
      <!-- Dynamic icon component -->
      <component
        v-if="iconComponent && iconData?.type === 'component'"
        :is="iconComponent"
        :size="50"
        v-bind="iconColor ? { color: iconColor, filled: isIconFilled } : {}"
      />

      <template v-else>
        <i class="ti ti-link text-blue-500 text-xl"></i>
      </template>
    </div>
    <div :class="isListMode ? 'flex flex-col justify-center flex-1 min-w-0 ' + (formData?.layout === 'left' ? 'text-left' : 'text-right') : 'w-full text-center mt-0 flex-1 flex flex-col justify-center'">
      <div :class="[
        isListMode ? 'font-bold text-[14px] leading-snug break-words ' + (formData?.layout === 'left' ? 'text-left' : 'text-right') : 'font-bold text-[15px] leading-snug text-center break-words',
        isDarkTheme ? 'text-white' : 'text-gray-800'
      ]">
        {{ sanitizedLink.displayName || sanitizedLink.title || sanitizedLink.name || sanitizedLink.value || sanitizedLink.id || 'بدون عنوان' }}
      </div>
      <div v-if="isListMode && sanitizedLink.description && sanitizedLink.description.trim()"
           :class="[
             'text-xs font-normal mt-1 leading-relaxed whitespace-pre-line break-words ' + (formData?.layout === 'left' ? 'text-left' : 'text-right'),
             isDarkTheme ? 'text-gray-300' : 'text-gray-600'
           ]"
           >
        {{ sanitizedLink.description }}
      </div>
    </div>
  </a>
</template>

<script setup>
import { computed } from 'vue'
import { useFormStore } from '~/stores/form'
import { useIconComponents } from '@/composables/useIconComponentsMap'

const props = defineProps({
  link: { type: Object, required: true },
  isListMode: { type: Boolean, default: false },
  formData: { type: Object, required: false },
  isDarkTheme: { type: Boolean, default: false },
  isLightTheme: { type: Boolean, default: false },
  isBackgroundDark: { type: Boolean, default: false }
})

// دسترسی به store
const formStore = useFormStore()
const formData = computed(() => props.formData || formStore)

// Get icon data and component
const sanitizedLink = computed(() => {
  const link = props.link || {}
  
  // برای آیتم‌های مشخص، title پیش‌فرض تعریف کن
  const getDefaultTitle = (action, originalTitle, name) => {
    const defaultTitles = {
      'call': 'تماس',
      'number': 'پیامک', 
      'email': 'ایمیل',
      'whatsapp': 'واتساپ'
    }
    
    // اگر کاربر title کاستوم وارد کرده (متفاوت از نام اولیه آیتم)
    if (originalTitle && originalTitle.trim() && originalTitle !== name) {
      return originalTitle
    }
    
    // اگر title خالی یا همان نام اولیه است، title پیش‌فرض برگردان
    if (defaultTitles[action]) {
      return defaultTitles[action]
    }
    
    // در غیر این صورت title اصلی یا نام را برگردان
    return originalTitle || name
  }
  
  const result = {
    ...link,
    displayName: getDefaultTitle(link.action, link.title, link.name)
  }
  
  // فقط اگر description واقعی وجود دارد آن را اضافه کن
  if (link.description && 
      link.description.trim() && 
      link.description.trim() !== '' &&
      link.description !== 'description') {
    result.description = link.description.trim()
  }
  // در غیر این صورت description اصلاً وجود ندارد
  
  return result
})
const iconData = computed(() => sanitizedLink.value?.icon || null)

// Icon color logic - return user selected color or undefined for default SVG colors
const iconColor = computed(() => {
  // اگر کاربر رنگ انتخاب کرده، از آن استفاده کن
  if (formStore.iconColor?.background &&
      formStore.iconColor.background !== 'transparent') {
    return formStore.iconColor.background
  }
  // در غیر این صورت، undefined برگردان تا رنگ پیش‌فرض SVG استفاده شود
  return undefined
})

const isIconFilled = computed(() => {
  return !!(formStore.iconColor?.background &&
           formStore.iconColor.background !== 'transparent')
})

// استفاده از icon components composable
const { getIconComponent } = useIconComponents()

const iconComponent = computed(() => {
  return getIconComponent(iconData.value);
})

const isLinkType = computed(() => {
  const actions = [
    'number', 'contactcard', 'call', 'eitaa', 'telegram', 'email', 'facetime', 'whatsapp', 'address',
    'clubhouse', 'facebook', 'instagram', 'linkedin', 'pinterest', 'snapchat', 'threads', 'tiktok', 'twitch', 'twitter', 'rubika', 'youtube', 'virgool',
    'app_link', 'booksy', 'calendly', 'chili-piper', 'etsy', 'microsoft-bookings', 'reviews', 'safari', 'square', 'yelp', 'zillow', 'divar', 'snapp', 'balad', 'nshan', 'neshan', 'trustpilot',
    'poll', 'questionbox', 'expandabletext','aparat',
    'builder', 'luckyegg', 'luckydice', 'luckywheel',
    'cashapp', 'paypal', 'venmo', 'zelle', 'raymit', 'zarinpal', 'trustwallet', 'creditcard',
    'customlink', 'igap', 'discord', 'bale', 'linktree', 'poshmark', 'figma', 'medium', 'apple',
    'soundcloud', 'spotify', 'youtubemusic', 'github', 'googlemeet', 'teams', 'zoom', 'opensea', 'hobby', 'podcast', 'worktime'
  ]
  return actions.includes(props.link.action)
})

const baseUrls = {
  number: 'sms:', call: 'tel:', email: 'mailto:', facetime: 'facetime:',
  telegram: 'https://t.me/', instagram: 'https://instagram.com/', facebook: 'https://facebook.com/',
  linkedin: 'https://linkedin.com/in/', youtube: 'https://youtube.com/',aparat: 'https://aparat.com/', address: '/',
  virgool: 'https://virgool.io/@', trustpilot: 'https://www.trustpilot.com/review/'
}

const value = props.link.value || ''
const base = baseUrls[props.link.action]

// Regex to check if value already starts with a protocol (http, https, mailto, tel, facetime, sms, etc.)
const protocolRegex = /^(https?:|mailto:|tel:|facetime:|sms:|ftp:|ftps:|chrome:|edge:|file:|data:|webcal:|tg:|geo:|maps:|intent:|app:|custom:|\/)/i

const finalUrl = computed(() => {
  if (!base) return value
  if (protocolRegex.test(value)) return value
  if (/^https?:\/\//i.test(value)) return value
  if (base.endsWith(':')) return `${base}${value}`
  return `${base}${value.replace(/^[@+]/, '')}`
})

// Remove all inline/fixed widths, use Tailwind for appearance only
const cardStyle = computed(() => {
  return '' // همیشه خالی، هیچ وقت disable نمی‌شود
})

// محاسبه حالت نمایش بر اساس فیلد isListMode در لینک یا formData
const isListMode = computed(() => {
  // ابتدا از فیلد link.isListMode استفاده کن
  if (props.link.isListMode !== undefined) {
    return props.link.isListMode
  }
  
  // در غیر این صورت از props.isListMode استفاده کن
  if (props.isListMode !== undefined) {
    return props.isListMode
  }
  
  // اگر هیچ کدام تعریف نشده، پیش‌فرض true (حالت لیست)
  return true
})
</script>