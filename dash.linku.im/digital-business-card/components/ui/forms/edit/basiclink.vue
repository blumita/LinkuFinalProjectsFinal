<template>
  <div class="bg-background flex flex-col h-full">
    <div class="flex-1 overflow-y-auto p-4 space-y-6 pb-20 lg:pb-4">

    <!-- Icon Upload -->
    <div class="flex items-center gap-4">
      <div class="relative w-20 h-20">
        <img 
          v-if="form.customIcon" 
          :src="form.customIcon" 
          class="w-full h-full rounded-xl object-cover cursor-pointer"
          @click="fileInput?.click()"
        />
        <!-- Dynamic icon component (same as LinkItem.vue) -->
        <div
          v-else-if="iconComponent && iconData?.type === 'component'"
          class="w-full h-full rounded-xl bg-gray-100 flex items-center justify-center cursor-pointer"
          @click="fileInput?.click()"
        >
          <component 
            :is="iconComponent"
            :size="80"
            v-bind="iconColor ? { color: iconColor, filled: isIconFilled } : {}"
          />
        </div>
        <!-- Fallback to image -->
        <img 
          v-else-if="safeIcon"
          :src="safeIcon" 
          class="w-full h-full rounded-xl object-contain p-2 cursor-pointer"
          @click="fileInput?.click()"
        />
        <div 
          v-else 
          class="w-full h-full rounded-xl bg-gray-100 flex items-center justify-center text-gray-400 text-2xl cursor-pointer"
          @click="fileInput?.click()"
        >
          <i class="ti ti-link" />
        </div>
        <input 
          ref="fileInput"
          type="file" 
          accept="image/png,image/jpeg,image/jpg,image/webp,image/bmp,image/svg+xml" 
          class="hidden"
          @change="handleIconUpload"
        />
      </div>
      <div class="flex flex-col items-start gap-2 flex-1">
        <p class="text-sm text-blue-500 font-medium cursor-pointer text-right" @click="fileInput?.click()">کلیک کنید تا آیکون تغییر کند</p>
      </div>
    </div>

    <!-- Inputs -->
    <div class="space-y-4">

      <!-- WhatsApp Type selector -->
      <div v-if="form.action === 'whatsapp'" class="space-y-2">
        <label class="block text-sm font-medium text-foreground">نوع لینک WhatsApp</label>
        <div class="flex gap-2">
          <button
            type="button"
            @click="form.whatsappType = 'phone'"
            :class="form.whatsappType === 'phone' ? 'bg-primary text-primary-foreground' : 'bg-muted text-foreground'"
            class="flex-1 py-2.5 px-4 rounded-lg text-sm font-medium transition-colors"
          >
            <i class="ti ti-phone ml-1"></i>
            شماره تلفن
          </button>
          <button
            type="button"
            @click="form.whatsappType = 'channel'"
            :class="form.whatsappType === 'channel' ? 'bg-primary text-primary-foreground' : 'bg-muted text-foreground'"
            class="flex-1 py-2.5 px-4 rounded-lg text-sm font-medium transition-colors"
          >
            <i class="ti ti-link ml-1"></i>
            لینک کانال
          </button>
        </div>
      </div>

      <!-- Protocol selector for website -->
      <div v-if="form.action === 'safari' || form.action === 'website'" class="space-y-2">
        <label class="block text-sm font-medium text-foreground">پروتکل</label>
        <div class="flex gap-4">
          <label class="flex items-center gap-2 cursor-pointer">
            <input 
              type="radio" 
              v-model="form.protocol" 
              value="https" 
              class="w-4 h-4 text-primary focus:ring-2 focus:ring-primary/20"
            />
            <span class="text-sm text-foreground">HTTPS</span>
          </label>
          <label class="flex items-center gap-2 cursor-pointer">
            <input 
              type="radio" 
              v-model="form.protocol" 
              value="http" 
              class="w-4 h-4 text-primary focus:ring-2 focus:ring-primary/20"
            />
            <span class="text-sm text-foreground">HTTP</span>
          </label>
        </div>
      </div>

      <div>
        <label class="block text-sm font-medium text-foreground mb-1">
          {{ getInputLabel() }}
        </label>
        <div class="flex rtl flex-row-reverse">
          <span v-if="showPrefix() && !['call','number'].includes(form.action) && !(form.action === 'whatsapp' && form.whatsappType === 'channel')" class="inline-flex items-center px-3 rounded-l bg-muted border border-r-0 border-border text-muted-foreground text-sm ltr">
            {{ form.baseUrl || getPrefixForAction() }}
          </span>
          <input
            v-if="isUsernameAction() && !(form.action === 'whatsapp' && form.whatsappType === 'channel')"
            v-model="form.username"
            type="text"
            :placeholder="getInputPlaceholder()"
            class="w-full px-4 py-3 bg-background border border-border rounded-lg text-sm rtl text-right text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            :class="showPrefix() ? 'rounded-l-none' : ''"
          />
          <input
            v-else-if="form.action === 'whatsapp' && form.whatsappType === 'channel'"
            v-model="form.value"
            type="url"
            placeholder="مثال: https://whatsapp.com/channel/0029VaeW5Uk..."
            class="w-full px-4 py-3 bg-background border border-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary ltr"
          />
          <input
            v-else-if="isPrefixAction()"
            v-model="form.value"
            :type="['call','number'].includes(form.action) ? 'tel' : 'text'"
            :placeholder="getInputPlaceholder()"
            class="w-full px-4 py-3 bg-background border border-border rounded-lg text-sm rtl text-right text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            :class="showPrefix() ? 'rounded-l-none' : ''"
            :autocomplete="form.action === 'email' ? 'email' : undefined"
            @input="handlePrefixedInput"
          />
          <input
            v-else
            v-model="form.value"
            type="text"
            :placeholder="getInputPlaceholder()"
            class="w-full px-4 py-3 bg-background border border-border rounded-lg text-sm rtl text-right text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            @input="handleWebsiteInput"
          />
        </div>
      </div>

      <div>
        <label class="block text-sm font-medium text-foreground mb-1">عنوان</label>
        <input 
          v-model="form.title" 
          type="text" 
          :placeholder="form.placeholder?.title || 'مثال: اینستاگرام'" 
          class="w-full px-4 py-3 bg-background border border-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
        />
      </div>

      <!-- Toggle for description -->
      <div class="flex items-center justify-between">
        <div>
          <label class="text-sm font-medium text-foreground">نمایش توضیحات</label>
          <p class="text-xs text-muted-foreground mt-1">افزودن توضیحات زیر عنوان لینک</p>
        </div>
        <label class="relative inline-flex items-center cursor-pointer">
          <input v-model="form.showDescription" type="checkbox" class="sr-only peer" />
          <div class="w-11 h-6 bg-muted peer-focus:ring-2 peer-focus:ring-primary/20 rounded-full peer peer-checked:bg-primary transition-all duration-300" />
          <div class="absolute left-0.5 top-0.5 w-5 h-5 bg-background rounded-full transition-transform duration-300 peer-checked:translate-x-full" />
        </label>
      </div>

      <!-- Description Field (only show when enabled) -->
      <div v-if="form.showDescription">
        <label class="block text-sm font-medium text-foreground mb-1 mt-4">توضیحات</label>
        <textarea 
          v-model="form.description"
          rows="3"
          placeholder="توضیحات اختیاری..."
          class="w-full px-4 py-3 bg-background border border-border rounded-lg text-sm resize-none text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
        />
      </div>

    </div>

    </div>

    <!-- Fixed Bottom Actions -->
    <div class="border-t border-border bg-background p-4 fixed bottom-0 left-0 right-0 lg:relative lg:bottom-auto lg:left-auto lg:right-auto">
      <div class="flex items-center gap-3">
        <button type="button" class="flex-1 bg-muted text-muted-foreground font-medium py-3 rounded-lg hover:bg-muted/80 transition-colors" @click="$emit('cancel')">
          انصراف
        </button>
        <button type="button" class="flex-1 bg-primary text-primary-foreground font-medium py-3 rounded-lg hover:bg-primary/90 transition-colors" @click="submitForm">
          <i class="ti ti-check mr-1" />
          ذخیره
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, computed, ref, watch } from 'vue'
import { useIconComponents } from '~/composables/useIconComponentsMap'
import { useFormStore } from '~/stores/form'

const { getIconComponent, getSafeIcon } = useIconComponents()

const props = defineProps({
  link: {
    type: Object,
    default: () => ({})
  }
})

const emit = defineEmits(['submit', 'cancel', 'back', 'delete'])

// File input reference
const fileInput = ref(null)

// Access form store for dynamic coloring
const formStore = useFormStore()

// Base URLs for different actions
const baseUrls = {
  number: 'sms:', call: 'tel:', email: 'mailto:', facetime: 'facetime:',eitaa:'https://eitaa.com/',
  telegram: 'https://t.me/', instagram: 'https://instagram.com/', facebook: 'https://facebook.com/',
  linkedin: 'https://linkedin.com/in/', youtube: 'https://youtube.com/', x: 'https://x.com/',
  twitter: 'https://x.com/', tiktok: 'https://www.tiktok.com/@', threads: 'https://www.threads.net/@',
  clubhouse: 'https://www.clubhouse.com/@', snapchat: 'https://snapchat.com/add/', 
  twitch: 'https://twitch.tv/', rubika: 'https://rubika.ir/', bale: 'https://ble.ir/',
  discord: 'https://discord.com/users/', igap: 'https://igap.net/',whatsapp:'https://wa.me/',
  linktree: 'https://linktr.ee/', poshmark: 'https://poshmark.com/closet/',
  figma: 'https://figma.com/@', medium: 'https://medium.com/@',apart: 'https://aparat.com/',
  soundcloud: 'https://soundcloud.com/', spotify: 'https://open.spotify.com/user/',
  youtubemusic: 'https://music.youtube.com/', github: 'https://github.com/',
  teams: 'https://teams.microsoft.com/l/meetup-join/', zoom: 'https://zoom.us/my/',
  googlemeet: 'https://meet.google.com/', cashapp: 'https://cash.app/$',
  paypal: 'https://paypal.me/', venmo: 'https://venmo.com/', zelle: 'https://zellepay.com/',
  raymit: 'https://raymit.ir/', zarinpal: 'https://zarinp.al/', 
  pinterest: 'https://pinterest.com/', virgool: 'https://virgool.io/@',
  trustpilot: 'https://www.trustpilot.com/review/', nshan: 'https://neshan.org/maps/@',
  balad: 'https://balad.ir/', app_link: '', website: '', safari: '', address: '/'
}

// Initialize form with baseUrl and icon detection
const actionLower = props.link?.action?.toLowerCase()

// Parse icon if it's a JSON string
let parsedIcon = props.link?.icon
if (typeof parsedIcon === 'string') {
  try {
    parsedIcon = JSON.parse(parsedIcon)
  } catch (e) {
    parsedIcon = actionLower ? { type: 'component', name: actionLower } : undefined
  }
}
// اگر icon نداره، از action بساز
if (!parsedIcon && actionLower) {
  parsedIcon = { type: 'component', name: actionLower }
}

const form = reactive({
  ...props.link,
  action: actionLower || props.link?.action,
  baseUrl: props.link?.baseUrl || (actionLower && baseUrls[actionLower]) || '',
  countryCode: props.link?.countryCode || '+98',
  protocol: props.link?.protocol || 'https',
  whatsappType: props.link?.whatsappType || 'phone',
  icon: parsedIcon,
  showDescription: typeof props.link?.showDescription === 'boolean' ? props.link.showDescription : false,
  description: props.link?.description || '',
  isListMode: props.link?.isListMode ?? true
})

// Watch showDescription to clear description when disabled
watch(() => form.showDescription, (newValue) => {
  if (!newValue) {
    form.description = ''
  }
})

// Icon data and component computation (same as LinkItem.vue)
const iconData = computed(() => {
  return form.icon || null;
})

const iconComponent = computed(() => {
  return getIconComponent(iconData.value);
})

// Safe icon fallback using composable
const safeIcon = computed(() => {
  return getSafeIcon(form);
})

// Dynamic icon coloring from form store (same as LinkItem.vue)
const iconColor = computed(() => {
  if (formStore.iconColor?.background && 
      formStore.iconColor.background !== 'transparent') {
    return formStore.iconColor.background
  }
  return undefined
})

const isIconFilled = computed(() => {
  return !!(formStore.iconColor?.background && 
           formStore.iconColor.background !== 'transparent')
})

const fullLink = computed(() => {
  if (isUsernameAction() && form.baseUrl && form.username) {
    return form.baseUrl + form.username
  }
  if (["email", "call", "number", "facetime"].includes(form.action) && form.value) {
    let prefix = ''
    if (form.action === 'email') prefix = 'mailto:'
    if (form.action === 'call') prefix = 'tel:'
    if (form.action === 'number') prefix = 'sms:'
    if (form.action === 'facetime') prefix = 'facetime:'
    return form.value.startsWith(prefix) ? form.value : prefix + form.value
  }
  return form.value || '#'
})

function showPrefix() {
  return (isUsernameAction() && form.baseUrl) || (form.baseUrl && ['number','call','facetime'].includes(form.action))
}

function handleIconUpload(event) {
  const file = event.target.files[0]
  if (file) {
    const reader = new FileReader()
    reader.onload = e => {
      form.customIcon = e.target.result
    }
    reader.readAsDataURL(file)
  }
}

function submitForm() {
  let cleanValue = form.value?.trim() || ''

  let value = cleanValue

  if (isUsernameAction() && form.baseUrl && form.username) {
    value = form.username
  } else if (isPrefixAction() && form.value) {
    const prefix = getPrefixForAction()
    if (value.startsWith(prefix)) {
      value = value.replace(prefix, '')
    }
  }
  
  // اطمینان از حفظ icon
  const iconToSend = form.icon || (form.action ? { type: 'component', name: form.action } : undefined)
  
  // اطمینان از description: فقط ارسال کن اگر showDescription true باشد
  const descriptionToSend = form.showDescription && form.description ? form.description.trim() : ''
  
  const result = {
    ...form,
    value,
    countryCode: ['call','number'].includes(form.action) ? (form.countryCode?.trim() || '+98') : undefined,
    protocol: ['safari','website'].includes(form.action) ? form.protocol : undefined,
    whatsappType: form.action === 'whatsapp' ? form.whatsappType : undefined,
    icon: iconToSend,
    description: descriptionToSend,
    showDescription: form.showDescription,
    customIcon: form.customIcon || undefined
  }
  emit('submit', result)
}

function isUsernameAction() {
  // WhatsApp channel should not be treated as username action
  if (form.action === 'whatsapp' && form.whatsappType === 'channel') {
    return false;
  }
  const usernameActions = [
    'telegram','whatsapp','eitaa', 'instagram', 'linkedin', 'facebook', 'clubhouse', 'snapchat', 'threads', 'tiktok', 'twitch', 'twitter', 'x', 'rubika', 'youtube','aparat', 'app_link', 'cashapp', 'paypal', 'venmo', 'zelle', 'raymit', 'remit', 'zarinpal', 'igap', 'discord', 'bale', 'linktree', 'poshmark', 'figma', 'medium', 'soundcloud', 'spotify', 'youtubemusic', 'github', 'teams', 'zoom', 'reviews', 'nshan', 'balad', 'bald', 'trustpilot', 'trustwallet', 'microsoft_bookings', 'chili-piper', 'chili_piper'
  ];
  return form.baseUrl && usernameActions.includes(form.action);
}

function isPrefixAction() {
  return ["email", "call", "number", "facetime"].includes(form.action)
}

function getPrefixForAction() {
  if (form.action === 'email') return 'mailto:'
  if (form.action === 'call') return 'tel:'
  if (form.action === 'number') return 'sms:'
  if (form.action === 'facetime') return 'facetime:'
  return ''
}

function getInputLabel() {
  // WhatsApp channel label
  if (form.action === 'whatsapp' && form.whatsappType === 'channel') {
    return 'لینک کانال WhatsApp';
  }
  if (form.action === 'email') {
    return 'ایمیل';
  }
  if (form.placeholder?.title) {
    return form.placeholder.title;
  }
  if (form.name) {
    return form.name;
  }
  if (form.title) {
    return form.title;
  }
  return 'نام کاربری یا شناسه';
}

function getInputPlaceholder() {
  // WhatsApp channel placeholder
  if (form.action === 'whatsapp' && form.whatsappType === 'channel') {
    return 'مثال: https://whatsapp.com/channel/0029VaeW5Uk...';
  }
  if (form.action === 'email') {
    return 'مثال: example@email.com';
  }
  if (form.placeholder?.link) {
    return form.placeholder.link;
  }
  const usernameActions = [
    'telegram','whatsapp','eitaa', 'instagram', 'linkedin', 'facebook', 'clubhouse', 'snapchat', 'threads', 'tiktok', 'twitch', 'twitter', 'x', 'rubika', 'youtube','aparat', 'app_link', 'cashapp', 'paypal', 'venmo', 'zelle', 'raymit', 'zarinpal', 'igap', 'discord', 'bale', 'linktree', 'poshmark', 'figma', 'medium', 'soundcloud', 'spotify', 'youtubemusic', 'github', 'teams', 'zoom', 'reviews'
  ];
  if (form.baseUrl && usernameActions.includes(form.action)) {
    return 'مثال: نام_کاربری';
  }
  if (form.baseUrl) {
    if (form.baseUrl.startsWith('http')) {
      const base = form.baseUrl.endsWith('/') ? form.baseUrl.slice(0, -1) : form.baseUrl;
      return `مثال: ${base}/نام_کاربری`;
    }
    if (form.baseUrl.startsWith('mailto:')) {
      return 'مثال: example@email.com';
    }
    if (form.baseUrl.startsWith('sms:') || form.baseUrl.startsWith('tel:')) {
      return 'مثال: +989123456789 یا 09123456789';
    }
    return `مثال: ${form.baseUrl}نام_کاربری`;
  }
  if (form.placeholder?.title) {
    return 'مثال: ' + form.placeholder.title;
  }
  if (form.name) {
    return 'مثال: ' + form.name;
  }
  if (form.title) {
    return 'مثال: ' + form.title;
  }
  return 'مثال: نام_کاربری';
}

function handlePrefixedInput(e) {
  let val = e.target.value
  val = val.replace(/^mailto:/i, '').replace(/^tel:/i, '').replace(/^sms:/i, '').replace(/^facetime:/i, '')
  form.value = val
}

function handleWebsiteInput(e) {
  // Remove http:// or https:// if user manually types it for website/safari actions
  if (form.action === 'safari' || form.action === 'website') {
    let val = e.target.value
    val = val.replace(/^https?:\/\//i, '')
    form.value = val
  }
}
</script>

<script>
export default {
  name: 'EditBasiclink',
}
</script>



