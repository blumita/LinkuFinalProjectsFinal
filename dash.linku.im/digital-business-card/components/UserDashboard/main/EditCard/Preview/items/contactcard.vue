<template>
  <!-- برای لینک‌ها -->
  <a
    v-if="isLinkType"
    :class="[
      isListMode
        ? 'flex items-center gap-4 backdrop-blur rounded-xl p-2 w-full ' + (formData?.layout === 'left' ? 'text-left' : 'text-right') + (isDarkTheme ? ' bg-white/[0.02]' : isLightTheme ? ' bg-black/[0.02]' : ' bg-gradient-to-br from-white/60 via-white/30 to-white/10 border border-white/20')
        : 'rounded-xl text-center p-2 flex flex-col items-center justify-center transition hover:shadow-md backdrop-blur' + (isDarkTheme ? ' bg-white/[0.02]' : isLightTheme ? ' bg-black/[0.02]' : ' bg-gradient-to-br from-white/60 via-white/30 to-white/10 border border-white/20')
    ]"
    :href="finalUrl || undefined"
    :tabindex="finalUrl ? 0 : -1"
    :target="finalUrl ? '_blank' : undefined"
    :rel="finalUrl ? 'noopener' : undefined"
    :aria-disabled="!finalUrl"
    @click.prevent="!finalUrl"
    :style="!finalUrl ? 'pointer-events: none; opacity: 0.5; touch-action: none; user-select: none;' : ''"
  >
    <!-- آیکون -->
    <div
      :class="isListMode
        ? 'w-13 h-13 flex-shrink-0 rounded-xl flex items-center justify-center overflow-hidden'
        : 'w-16 h-16 rounded-xl flex items-center justify-center mb-2 overflow-hidden'"
      :style="{ 
        backgroundColor: iconColor && iconColor !== 'transparent' ? iconColor : (isDarkTheme || isLightTheme ? 'transparent' : '#f3f4f6')
      }"
    >
      <component 
        :is="iconComponent"
        :size="isListMode ? 20 : 24"
        v-bind="iconColor && iconColor !== 'transparent' ? { color: iconColor, filled: isIconFilled } : {}"
      />
    </div>

    <!-- متن -->
    <div
      :class="isListMode
        ? 'flex flex-col justify-center flex-1 min-w-0 ' + (formData?.layout === 'left' ? 'text-left' : 'text-right')
        : 'w-full text-center mt-0'"
    >
      <div
        :class="[
          isListMode
            ? 'font-bold text-xs leading-snug break-words ' + (formData?.layout === 'left' ? 'text-left' : 'text-right')
            : 'font-bold text-xs leading-snug text-center break-words',
          isDarkTheme ? 'text-white' : 'text-gray-800'
        ]"
      >
        {{ sanitizedLink.displayName || sanitizedLink.title || sanitizedLink.name || sanitizedLink.value || sanitizedLink.id || 'بدون عنوان' }}
      </div>

      <div
        v-if="sanitizedLink.description && sanitizedLink.description.trim()"
        :class="[
          isListMode
            ? 'text-xs font-normal mt-1 leading-relaxed whitespace-pre-line break-words ' + (formData?.layout === 'left' ? 'text-left' : 'text-right')
            : 'text-xs font-normal mt-1 leading-relaxed whitespace-pre-line break-words text-center',
          isDarkTheme ? 'text-gray-300' : 'text-gray-700'
        ]"
      >
        {{ sanitizedLink.description }}
      </div>
    </div>
  </a>

  <!-- برای بلاک‌ها -->
  <div v-else class="flex flex-col items-center justify-center rounded-xl p-4 w-full text-center"
       :class="[
         isDarkTheme ? 'backdrop-blur bg-white/[0.02]' : isLightTheme ? 'backdrop-blur bg-black/[0.02]' : 'bg-gradient-to-br from-white/60 via-white/30 to-white/10 backdrop-blur border'
       ]">
    <!-- اگر contactcard هست -->
    <template v-if="sanitizedLink.action === 'contactcard'">
      <!-- آیکون و عنوان -->
      <div class="flex flex-col items-center mb-4">
        <div 
          class="w-12 h-12 rounded-xl flex items-center justify-center mb-2 cursor-pointer hover:opacity-80 transition-opacity"
          :style="{ 
            backgroundColor: iconColor && iconColor !== 'transparent' ? iconColor : '#f3f4f6'
          }"
          @click="downloadVCard"
          title="کلیک کنید برای ذخیره در مخاطبین"
        >
          <component
              :is="iconComponent"
              :size="24"
              v-bind="iconColor && iconColor !== 'transparent' ? { color: iconColor, filled: isIconFilled } : {}"
          />
        </div>
        <div class="font-bold text-sm sm:text-base text-gray-800 leading-snug"
             :class="isDarkTheme ? 'text-white' : 'text-gray-800'">
          {{ sanitizedLink.title || sanitizedLink.name || 'کارت تماس' }}
        </div>
        <div v-if="sanitizedLink.description && sanitizedLink.description.trim()" 
             class="text-xs mt-1"
             :class="isDarkTheme ? 'text-gray-300' : 'text-gray-500'">
          {{ sanitizedLink.description }}
        </div>
      </div>

      <!-- Auto-download removed - clicking icon will download vCard -->

    </template>

    <!-- سایر بلاک‌ها -->
    <template v-else-if="previewItems && sanitizedLink.action && previewItems[sanitizedLink.action]">
      <component
          :is="previewItems[sanitizedLink.action]"
          :link="sanitizedLink"
          :is-list-mode="isListMode"
          :preview-items="previewItems"
      />
    </template>

    <!-- fallback ساده -->
    <template v-else>
      <component
          :is="iconComponent"
          :size="50"
          v-bind="iconColor ? { color: iconColor, filled: isIconFilled } : {}"
      />
      <div class="font-bold text-sm sm:text-base text-gray-800 leading-snug mb-1">
        {{ sanitizedLink.title || sanitizedLink.value || 'بدون عنوان' }}
      </div>
      <div v-if="sanitizedLink.description && sanitizedLink.description.trim()" class="text-xs text-gray-500 mt-1">
        {{ sanitizedLink.description }}
      </div>
    </template>
  </div>

  <!-- حذف ActionButtons -->
</template>

<script setup>
import { computed } from 'vue';
import { useFormStore } from '~/stores/form'

const { getIconComponent, getSafeIcon } = useIconComponents();

const props = defineProps({
  link: { type: Object, required: true },
  previewItems: { type: Object, required: false },
  formData: { type: Object, required: false },
  isDarkTheme: { type: Boolean, default: false },
  isLightTheme: { type: Boolean, default: false },
  isBackgroundDark: { type: Boolean, default: false }
});
// دسترسی به store
const formStore = useFormStore()
const formData = computed(() => props.formData || formStore)

// Get icon data and component
const sanitizedLink = computed(() => {
  const link = props.link || {}
  
  // برای آیتم‌های مشخص، title پیش‌فرض تعریف کن
  const getDefaultTitle = (action, originalTitle, name) => {
    const defaultTitles = {
      'call': 'تماس با ما',
      'number': 'پیام دهید', 
      'email': 'ایمیل ارسال کنید',
      'whatsapp': 'در واتساپ پیام دهید'
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
  
  const sanitized = {
    ...link,
    displayName: getDefaultTitle(link.action, link.title, link.name)
  }
  
  // Only include description if it's valid
  if (link.description && link.description.trim() && link.description !== '') {
    sanitized.description = link.description
  }
  
  return sanitized
})

const iconData = computed(() => {
  // اگر link.icon وجود داره و خالی نیست، استفاده کن
  if (sanitizedLink.value?.icon) {
    return sanitizedLink.value.icon
  }
  // در غیر این صورت، ایکون پیش‌فرض contactcard
  return { type: 'component', name: 'contactcard' }
})

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

const iconComponent = computed(() => {
  const component = getIconComponent(iconData.value);
  // اگر ایکون پیدا نشد، از ایکون contactcard پیش‌فرض استفاده کن
  if (!component) {
    return getIconComponent({ type: 'component', name: 'contactcard' })
  }
  return component
})
const isLinkType = computed(() => props.link.type === 'link' || props.link.action !== 'contactcard');
const isListMode = computed(() => sanitizedLink.value?.description && sanitizedLink.value.description.trim());

const finalUrl = computed(() => {
  // اگر نیاز به ساخت لینک خاص داری اینجا بساز، مثلاً:
  if (props.link.action === 'contactcard' && props.link.value) return props.link.value;
  return '#';
});

function handleContactClick(item) {
  if (!item || !item.originalItem.action || !item.value) return

  let url = ''
  switch (item.action) {
    case 'call':
      url = `tel:${item.value}`
      break
    case 'number':
      url = `sms:${item.value}`
      break
    case 'email':
      url = `mailto:${item.value}`
      break
    case 'website':
      url = item.value.startsWith('http') ? item.value : `https://${item.value}`
      break
    default:
      url = item.value
  }

  window.location.href = url
}
async function downloadVCard() {
  // فقط لینک‌های انتخاب شده در کارت تماس رو بگیر
  let items = []
  
  // فقط از selectedItems استفاده کن
  if (props.link && props.link.selectedItems && Array.isArray(props.link.selectedItems)) {
    items = [...props.link.selectedItems]
  }

  if (items.length === 0) return

  // ساخت محتوای vCard
  let vcard = 'BEGIN:VCARD\nVERSION:3.0\n'

  // نام کارت
  const name = props.link?.title || 'Contact Card'
  vcard += `FN:${name}\n`
  
  // مرور بین آیتم‌ها
  items.forEach((item) => {
    if (!item) return
    
    // استفاده از action یا originalItem.action
    const action = item.action || item.originalItem?.action
    const value = item.value || item.originalItem?.value
    
    if (!action || !value) return

    switch (action) {
      case 'call':
        vcard += `TEL;TYPE=WORK,VOICE:${value}\n`
        break
      case 'number':
        vcard += `TEL;TYPE=CELL:${value}\n`
        break
      case 'email':
        vcard += `EMAIL;TYPE=INTERNET:${value}\n`
        break
      case 'website':
        vcard += `URL:${value}\n`
        break
      case 'address':
        vcard += `ADR;TYPE=WORK:;;${value};;;;\n`
        break
      case 'organization':
        vcard += `ORG:${value}\n`
        break
      case 'title':
        vcard += `TITLE:${value}\n`
        break
      case 'instagram':
        vcard += `X-SOCIALPROFILE;TYPE=instagram:${value}\n`
        vcard += `URL:https://instagram.com/${value.replace('@', '')}\n`
        break
      case 'telegram':
        vcard += `X-SOCIALPROFILE;TYPE=telegram:${value}\n`
        vcard += `URL:https://t.me/${value.replace('@', '')}\n`
        break
      case 'whatsapp':
        vcard += `X-SOCIALPROFILE;TYPE=whatsapp:${value}\n`
        break
      case 'linkedin':
        vcard += `X-SOCIALPROFILE;TYPE=linkedin:${value}\n`
        vcard += `URL:${value}\n`
        break
      case 'twitter':
        vcard += `X-SOCIALPROFILE;TYPE=twitter:${value}\n`
        break
      case 'facebook':
        vcard += `X-SOCIALPROFILE;TYPE=facebook:${value}\n`
        break
      case 'youtube':
        vcard += `X-SOCIALPROFILE;TYPE=youtube:${value}\n`
        vcard += `URL:${value}\n`
        break
      case 'tiktok':
        vcard += `X-SOCIALPROFILE;TYPE=tiktok:${value}\n`
        break
      default:
        // برای بقیه موارد، به عنوان URL اضافه کن
        if (value.startsWith('http')) {
          vcard += `URL:${value}\n`
        } else {
          vcard += `NOTE:${item.name || action || ''}: ${value}\n`
        }
    }
  })

  vcard += 'END:VCARD'

  // ساخت Blob و فایل
  const blob = new Blob([vcard], { type: 'text/vcard;charset=utf-8' })
  const fileName = `${name.replace(/\s+/g, '_')}.vcf`
  
  // روی موبایل از Web Share API استفاده کن (iOS و Android بهتر پشتیبانی می‌کنند)
  if (navigator.share && /Android|iPhone|iPad|iPod/i.test(navigator.userAgent)) {
    try {
      const file = new File([blob], fileName, { type: 'text/vcard' })
      await navigator.share({
        files: [file],
        title: name,
        text: `اطلاعات تماس ${name}`
      })
      return
    } catch (err) {
      // اگر share کنسل شد یا خطا داد، به روش fallback برو
      console.log('Share cancelled or failed, falling back to download')
    }
  }
  
  // Fallback: دانلود مستقیم فایل
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = fileName
  // برای iOS که download attribute رو خوب پشتیبانی نمی‌کنه
  link.setAttribute('target', '_blank')
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}


</script>
