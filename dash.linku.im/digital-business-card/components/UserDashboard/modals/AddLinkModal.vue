<template>
  <div class="fixed inset-0 backdrop-blur bg-black/50 flex items-center justify-center z-[200] p-0 lg:p-4">
    <div v-if="!activeForm" class="bg-card rounded-none lg:rounded-2xl w-full max-h-screen lg:max-w-5xl xl:max-w-6xl text-right lg:max-h-[90vh] lg:h-auto flex flex-col relative border-0 lg:border border-border overflow-y-auto overflow-x-hidden">


      <button class="text-muted-foreground hover:text-foreground text-4xl absolute top-4 left-4 z-10 w-10 h-10 flex items-center justify-center transition-colors" @click="$emit('close')">&times;</button>

      <!-- Header -->
      <div class="grid grid-cols-1 gap-3 border-b border-border px-4 py-4 pt-14 lg:pt-4 lg:grid-cols-2 lg:gap-6 lg:px-8 lg:py-6">
        <div>
          <div class="flex justify-between items-center mb-2 lg:mb-4">
            <h2 class="text-xl lg:text-2xl font-semibold text-foreground">افزودن محتوا</h2>
          </div>
          <p class="text-sm lg:text-base text-muted-foreground mb-3 lg:mb-4">از انواع مختلف لینک‌ها و اطلاعات تماس انتخاب کنید.</p>
        </div>
        <div class="flex items-end">
          <div class="relative w-full">
            <input
              v-model="searchQuery"
              type="text"
              placeholder="جستجو در نام، نوع، یا ایکون..."
              class="w-full px-3 py-2 pr-10 text-sm text-foreground bg-muted border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
            >
            <div class="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">
              <i class="ti ti-search text-sm" />
            </div>
            <button
              v-if="searchQuery"
              class="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              @click="searchQuery = ''"
            >
              <i class="ti ti-x text-sm" />
            </button>
          </div>
        </div>
      </div>

      <!-- Desktop Category Tabs - Only show when not searching -->
      <div v-if="!searchQuery.trim()" class="hidden lg:flex flex-wrap items-center gap-2 px-8 py-3 border-b border-border bg-muted/30">
        <button
          v-for="cat in categories"
          :key="cat.title"
          :class="[
            'px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200',
            activeCategory === cat.title
              ? 'bg-primary text-primary-foreground shadow-sm'
              : 'bg-background text-muted-foreground hover:bg-muted hover:text-foreground border border-border'
          ]"
          @click="activeCategory = cat.title"
        >
          {{ cat.title }}
          <span 
            v-if="cat.title !== 'همه'" 
            class="mr-1 text-xs opacity-70"
          >
            ({{ cat.items.length }})
          </span>
        </button>
      </div>

        <!-- Section Content -->
        <div class="flex-1 overflow-y-auto overflow-x-hidden min-h-0">
          <!-- Search Results Counter -->
          <div v-if="searchQuery.trim()" class="mb-4 mt-4 text-sm text-muted-foreground px-4 md:px-8 lg:px-12">
            <span v-if="filteredItems.length > 0">
              {{ filteredItems.length }} مورد یافت شد
            </span>
            <span v-else class="text-destructive">
              هیچ موردی یافت نشد
            </span>
          </div>

          <div class="h-full">
            <div v-if="filteredItems.length > 0" class="pr-4 pb-4">
              <template v-for="(group, index) in groupedItems" :key="index">
                <!-- Hide group title on desktop when a specific category tab is selected -->
                <h3 
                  v-if="group.title && !searchQuery.trim()" 
                  :class="[
                    'text-lg font-semibold mb-2 mt-4 text-foreground px-4 md:px-8 lg:px-12',
                    activeCategory !== 'همه' ? 'lg:hidden' : ''
                  ]"
                >
                  {{ group.title }}
                </h3>
                <!-- Desktop: responsive grid layout -->
                <div class="hidden lg:grid lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4 mb-6 px-4 md:px-8 lg:px-12">
                  <div
                    v-for="(item, idx) in group.items"
                    :key="getItemKey(item, idx)"
                    :class="[
                      'flex items-center gap-3 border border-border bg-card p-3 rounded-xl transition-all duration-200',
                      (!isPro && item.access === 'pro') ? 'opacity-50 cursor-not-allowed' : 'hover:bg-muted/50 cursor-pointer'
                    ]"
                    @click="tryHandleAdd(item)"
                  >
                    <!-- Icon (same as mobile) -->
                    <div class="relative w-10 h-10 rounded-lg overflow-hidden flex items-center justify-center flex-shrink-0">
                      <!-- Dynamic icon component -->
                      <component
                        :is="getItemIconComponent(item)"
                        v-if="getItemIconComponent(item)"
                        :size="40"
                        :color="iconColor"
                        :filled="isIconFilled"
                      />
                      <!-- Fallback to image -->
                      <img
                        v-else-if="isIconObject(item.icon)"
                        :src="item.icon.path"
                        class="w-full h-full object-contain"
                        alt="icon"
                      >
                      <!-- Default fallback icon -->
                      <i v-else class="ti ti-link text-slate-600 text-base" />
                    </div>

                    <!-- Content -->
                    <div class="flex-1 flex items-center justify-between">
                      <div class="flex-1">
                        <div class="flex items-center gap-2">
                          <span class="font-medium text-sm text-foreground">{{ getItemLabel(item) }}</span>
                          <!-- Usage count badge -->
                          <div
                            v-if="(countMap?.[String(item.action || item.id || '').toLowerCase()] || 0) > 1"
                            class="bg-primary text-primary-foreground text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center border-2 border-card shadow-md"
                            style="pointer-events: none;"
                          >
                            {{ countMap?.[String(item.action || item.id || '').toLowerCase()] || 1 }}
                          </div>
                        </div>
                      </div>
                      
                      <div class="flex items-center gap-2">
                        <span v-if="'access' in item && item.access === 'pro' && !isPro" class="text-xs bg-foreground text-background rounded-full px-2 py-0.5 flex items-center justify-center">
                          <i class="ti ti-lock"/>
                        </span>
                        <button
                          class="text-xs bg-primary/10 text-primary font-medium px-3 py-1.5 rounded-lg hover:bg-primary/20 transition-all duration-200"
                          @click.stop="tryHandleAdd(item)"
                          :disabled="!isPro && item.access === 'pro'"
                        >
                          افزودن
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
                
                <!-- Mobile: Swiper with 3 items per slide vertically -->
                <div class="block lg:hidden mb-6 px-4">
                  <Swiper
                    :modules="modules"
                    :slides-per-view="'auto'"
                    :space-between="12"
                    :free-mode="{ enabled: true, sticky: false, momentumBounce: false }"
                    :grab-cursor="true"
                    :touch-start-prevent-default="false"
                    :resistance-ratio="0"
                    class="!overflow-visible"
                  >
                    <SwiperSlide
                      v-for="(chunk, chunkIndex) in chunkedItems(group.items, 3)"
                      :key="`chunk-${chunkIndex}`"
                      class="!w-[70%] first:mr-0 last:ml-4"
                    >
                      <div class="space-y-3 w-full">
                        <div
                          v-for="(item, idx) in chunk"
                          :key="getItemKey(item, idx)"
                          :class="[
                            'flex items-center gap-3 border border-border bg-card p-3 rounded-xl transition-all duration-200 min-h-[60px] h-[60px] w-full',
                            (!isPro && item.access === 'pro') ? 'opacity-50 cursor-not-allowed' : 'hover:bg-muted/50 cursor-pointer active:scale-95'
                          ]"
                          @click="tryHandleAdd(item)"
                        >
                          <!-- Icon -->
                          <div class="relative w-10 h-10 rounded-lg overflow-hidden flex items-center justify-center flex-shrink-0">
                            <!-- Dynamic icon component -->
                            <component
                              :is="getItemIconComponent(item)"
                              v-if="getItemIconComponent(item)"
                              :size="40"
                              :color="iconColor"
                              :filled="isIconFilled"
                            />
                            <!-- Fallback to image -->
                            <img
                              v-else-if="isIconObject(item.icon)"
                              :src="item.icon.path"
                              class="w-full h-full object-contain"
                              alt="icon"
                            >
                            <!-- Default fallback icon -->
                            <i v-else class="ti ti-link text-slate-600 text-base" />
                          </div>

                          <!-- Content -->
                          <div class="flex-1 flex items-center justify-between min-w-0">
                            <div class="flex-1 min-w-0">
                              <div class="flex items-center gap-2">
                                <span class="font-medium text-sm text-foreground truncate block">{{ getItemLabel(item) }}</span>
                                <i v-if="'access' in item && item.access === 'pro' && !isPro" class="ti ti-lock text-xs text-amber-600 dark:text-amber-400"/>
                              </div>
                            </div>
                            
                            <button
                              class="text-xs bg-primary/10 text-primary font-medium px-3 py-1.5 rounded-lg hover:bg-primary/20 transition-all duration-200 flex-shrink-0"
                              @click.stop="tryHandleAdd(item)"
                              :disabled="!isPro && item.access === 'pro'"
                            >
                              افزودن
                            </button>
                          </div>
                        </div>
                      </div>
                    </SwiperSlide>
                  </Swiper>
                </div>
              </template>
            </div>
            <div v-else class="text-center text-muted-foreground mt-6 px-4 md:px-8 lg:px-12">موردی یافت نشد.</div>
          </div>
        </div>
    </div>
  </div>
  <!-- Selected form outside main modal -->
  <div v-if="activeForm" class="fixed inset-0 bg-black/50 backdrop-blur flex items-center justify-center z-[210] p-0 lg:p-4">
    <div class="bg-background rounded-none lg:rounded-2xl w-full h-full lg:max-w-md lg:h-auto lg:max-h-[90vh] overflow-y-auto overflow-x-hidden lg:shadow-2xl border-0 lg:border border-border">
      <!-- Header -->
      <div class="flex items-center justify-between p-4 border-b border-border bg-background sticky top-0 z-10">
        <button class="text-muted-foreground hover:text-foreground flex items-center gap-2 transition-colors" @click="handleBack">
          <i class="ti ti-arrow-right text-lg" />
          <span class="text-sm font-medium">برگشت</span>
        </button>
        <button 
          class="text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
          :class="isFormValid ? 'text-primary hover:text-primary/80' : 'text-muted-foreground'"
          :disabled="!isFormValid"
          @click="previewLink"
        >
          <i class="ti ti-external-link text-xs" />
          مشاهده لینک
        </button>
      </div>

      <!-- Form Content -->
      <div class="flex-1">
        <component
          :is="getFormComponent((activeForm as any)?.action || (activeForm as any)?.type)"
          :link="activeForm"
          :cardId="cardId"
          @submit="handleSubmit"
          @cancel="handleBack"
          @back="handleBack"
          @form-change="handleFormChange"
        />
      </div>
    </div>
  </div>
  <InfoToast :visible="showToast" :title="toastTitle" :type="toastType"/>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, type Component } from 'vue'
import { Swiper, SwiperSlide } from 'swiper/vue'
import { FreeMode } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/free-mode'
import type { AnyItem, IconType } from '~/types/data'
import * as AddForms from '~/components/ui/forms/add'
import { useModalIconComponents } from '~/composables/useModalIconComponents'
import InfoToast from "~/components/UserDashboard/modals/InfoToast.vue";
const showToast = ref(false)
const toastTitle = ref('')
const toastType = ref('warning')
const showInfoToast = (message: string, type = 'warning') => {
  toastTitle.value = message
  toastType.value = type
  showToast.value = true
  setTimeout(() => showToast.value = false, 3000)
}
const props = defineProps<{
  countMap?: Record<string, number>
  cardId: string
}>()

const emit = defineEmits(['close', 'add-link'])
const userStore = useUserStore()
const isPro = computed(() => userStore.isUserPro)

// Form validation state
const isFormValid = ref(false)
const formData = ref<any>(null)

// Use form store for icon colors
const formStore = useSafeFormStore()

// Icon color - same as preview
const iconColor = computed(() => {
  if (formStore.value.iconColor?.background && formStore.value.iconColor.background !== 'transparent') {
    return formStore.value.iconColor.background
  }
  return undefined
})

const isIconFilled = computed(() => {
  return !!(formStore.value.iconColor?.background && formStore.value.iconColor.background !== 'transparent')
})

// Swiper modules
const modules = [FreeMode]

const categories = ref<{ title: string; items: AnyItem[] }[]>([])
const activeCategory = ref('همه')
const searchQuery = ref('')
const activeForm = ref<null | AnyItem>(null)

// دریافت توابع composable
const { getModalIconComponent } = useModalIconComponents()

function isIconObject(icon: IconType | undefined | null): icon is { path: string } {
  return typeof icon === 'object' && icon !== null && 'path' in icon && typeof (icon as { path: string }).path === 'string';
}

// تابع کمکی برای تقسیم آیتم‌ها به گروه‌های n تایی
function chunkedItems(items: AnyItem[], size: number) {
  const chunks: AnyItem[][] = []
  for (let i = 0; i < items.length; i += size) {
    chunks.push(items.slice(i, i + size))
  }
  return chunks
}

// تابع کمکی برای دریافت کامپوننت آیکون برای آیتم
function getItemIconComponent(item: AnyItem) {
  if (item.icon && typeof item.icon === 'object' && 'name' in item.icon && item.icon.name) {
    const iconName = (item.icon.name as string).toLowerCase()
    const iconComponent = getModalIconComponent({ type: 'component', name: iconName })
    if (!iconComponent) {
      console.warn(`[AddLinkModal] Icon not found: ${iconName}`)
    }
    return iconComponent
  }
  return null
}

onMounted(async () => {
  try {
    const data = await $fetch('/api/routes/data')
    if (!data?.categories) return

    const merged: AnyItem[] = []
    const flatCategories: { title: string; items: AnyItem[] }[] = []

    for (const cat of data.categories) {
      const items = cat.items.map((i: unknown) => ({ ...(i as AnyItem), type: (i as { type?: string }).type || cat.type }))
      merged.push(...items)
      flatCategories.push({ title: cat.title, items })
    }

    categories.value = [
      { title: 'همه', items: merged },
      ...flatCategories
    ]

    activeCategory.value = 'همه'

  } catch {
    categories.value = []
  }
})

const filteredItems = computed(() => {
  const cat = categories.value.find(c => c.title === activeCategory.value)
  if (!cat) return []
  const q = searchQuery.value.toLowerCase().trim()

  // اگر جستجو خالی باشد، همه آیتم‌ها را برگردان
  if (!q) return cat.items

  return cat.items.filter(item => {
    // جستجو در نام آیتم
    const label = getItemLabel(item).toLowerCase()
    if (label.includes(q)) return true

    // جستجو در توضیحات آیتم
    const itemWithDescription = item as AnyItem & { description?: string }
    const description = itemWithDescription.description?.toLowerCase() || ''
    if (description.includes(q)) return true

    // جستجو در action آیتم
    const action = item.action?.toLowerCase() || ''
    if (action.includes(q)) return true

    // جستجو در id آیتم
    const id = String(item.id || '').toLowerCase()
    if (id.includes(q)) return true

    // جستجو در نام ایکون
    if (item.icon && typeof item.icon === 'object' && 'name' in item.icon && item.icon.name) {
      const iconName = (item.icon.name as string).toLowerCase()
      if (iconName.includes(q)) return true
    }

    return false
  })
})

const groupedItems = computed(() => {
  // اگر در حال جستجو هستیم، فقط نتایج فیلتر شده را نمایش بده
  if (searchQuery.value.trim()) {
    return [{ title: '', items: filteredItems.value }]
  }

  // در غیر این صورت، اگر category انتخاب شده "همه" نیست
  if (activeCategory.value !== 'همه') {
    return [{ title: activeCategory.value, items: filteredItems.value }]
  }

  // برای category "همه"، همه گروه‌ها را نمایش بده
  const groups: { title: string; items: AnyItem[] }[] = []
  for (const cat of categories.value) {
    if (cat.title === 'همه') continue // skip the "همه" category
    if (cat.items.length === 0) continue
    groups.push({ title: cat.title, items: cat.items })
  }
  return groups
})

function handleAdd(item: AnyItem) {

  // مقداردهی درست value و id برای لینک‌ها
  activeForm.value = {
    ...item,
    id: Date.now() + '_' + (item.action || (item as { type?: string }).type || ''),
    description: '', // همیشه description را خالی کن
    ...(typeof (item as { value?: string }).value !== 'undefined' ? { value: (item as { value?: string }).value || '' } : {}),
  }
}
function tryHandleAdd(item: AnyItem) {
  if (isPro.value || item.access !== 'pro') {
    handleAdd(item)
  } else {
    showInfoToast('این ویژگی فقط برای کاربران حرفه‌ای فعال است 🏆')
  }
}

function handleSubmit(newItem?: AnyItem) {
  const itemToSubmit = newItem || formData.value
  if (itemToSubmit) {
    emit('add-link', itemToSubmit)
    activeForm.value = null
    isFormValid.value = false
    formData.value = null
    emit('close')
  }
}

function handleBack() {
  activeForm.value = null
  isFormValid.value = false
  formData.value = null
  // برگشت به صفحه ادیت کارت بجای بستن کامل مدال
  // این فقط فرم داخلی رو می‌بنده و برمی‌گرده به لیست لینک‌ها
}

// Handle form validation changes
function handleFormChange(data: any) {
  formData.value = data
  // Check if form has required fields filled
  isFormValid.value = checkFormValidity(data)
}

// Check if form is valid based on form type and data
function checkFormValidity(data: any): boolean {
  if (!data || !activeForm.value) return false
  
  // Check different fields that could contain the main value
  const mainValue = data.url || data.value || data.link || data.content || data.username
  const hasTitle = data.title && data.title.trim().length > 0
  
  // At least main value should be filled
  if (mainValue && mainValue.trim().length > 0) {
    return true
  }
  
  return false
}

// Preview link function
function previewLink() {
  if (isFormValid.value && formData.value) {
    const link = generatePreviewLink(formData.value)
    if (link && link !== '#') {
      window.open(link, '_blank')
    } else {
      console.log('لینک قابل پیش‌نمایش نیست:', formData.value)
    }
  }
}

// Generate preview link based on form data (same logic as basiclink.vue fullLink)
function generatePreviewLink(data: any): string {
  if (!data) return '#'
  
  // Always combine baseUrl and username for username actions
  if (isUsernameActionForPreview(data) && data.baseUrl && data.username) {
    return data.baseUrl + data.username
  }
  
  // For number/call/facetime/email, use value with prefix if needed
  if (["email", "call", "number", "facetime"].includes(data.action) && data.value) {
    let prefix = ''
    if (data.action === 'email') prefix = 'mailto:'
    if (data.action === 'call') prefix = 'tel:'
    if (data.action === 'number') prefix = 'sms:'
    if (data.action === 'facetime') prefix = 'facetime:'
    return data.value.startsWith(prefix) ? data.value : prefix + data.value
  }
  
  // For direct links, just use value
  return data.value || '#'
}

function isUsernameActionForPreview(data: any): boolean {
  const usernameActions = [
    'telegram','whatsapp','eitaa', 'instagram', 'linkedin', 'facebook', 'clubhouse', 'snapchat', 'threads', 'tiktok', 'twitch', 'twitter', 'x', 'rubika', 'youtube','aparat', 'app_link', 'cashapp', 'paypal', 'venmo', 'zelle', 'raymit', 'remit', 'zarinpal', 'igap', 'discord', 'bale', 'linktree', 'poshmark', 'figma', 'medium', 'soundcloud', 'spotify', 'youtubemusic', 'github', 'teams', 'zoom', 'reviews', 'nshan', 'balad', 'bald', 'trustpilot', 'trustwallet', 'microsoft_bookings', 'chili-piper', 'chili_piper'
  ];
  return data.baseUrl && usernameActions.includes(data.action);
}

function getItemKey(item: AnyItem, idx: number): string | number {
  return item.id || item.cardNumber || item.bankName || item.accountNumber || idx;
}
function getItemLabel(item: AnyItem): string {
  return item.name || item.title || item.cardNumber || item.bankName || item.accountNumber || '...';
}

function getFormComponent(type: string) {
  if (!type) return AddForms.basiclink; // پیش‌فرض: basiclink
  const key = type.toLowerCase();

  // اگر کلید دقیقاً وجود داشت
  if (Object.prototype.hasOwnProperty.call(AddForms, key)) {
    return (AddForms as Record<string, Component>)[key];
  }

  // اگر کلید با یکی از فرم‌ها match کند
  const altKey = Object.keys(AddForms).find(k => k.toLowerCase() === key);
  if (altKey) {
    return (AddForms as Record<string, Component>)[altKey];
  }

  // اگر بخشی از کلید match کند
  const partialKey = Object.keys(AddForms).find(k => k.toLowerCase().includes(key));
  if (partialKey) {
    return (AddForms as Record<string, Component>)[partialKey];
  }

  // پیش‌فرض: basiclink
  return AddForms.basiclink;
}

// Function to get usage count for testing
function getUsageCount(item: AnyItem): number {
  // برای تست، برای چند آیتم خاص عدد برمی‌گردانیم
  const action = String(item.action || item.id || item.name || '');

  // نمونه‌هایی برای نمایش badge
  switch (action.toLowerCase()) {
    case 'instagram': return 3;
    case 'telegram': return 2;
    case 'email': return 4;
    case 'spotify': return 2;
    case 'luckyegg': return 5;
    case 'whatsapp': return 2;
    case 'linkedin': return 3;
    case 'facebook': return 2;
    case 'youtube': return 4;
    default: return 1; // سایر آیتم‌ها فقط یکبار استفاده شده‌اند
  }
}

// دکمه موقت - اضافه کردن همه آیتم‌ها یکجا
function addAllItems() {
  const allItemsCategory = categories.value.find(cat => cat.title === 'همه')
  if (!allItemsCategory || !allItemsCategory.items.length) {
    return
  }

  // اضافه کردن همه آیتم‌ها به صورت یکجا
  const itemsToAdd = allItemsCategory.items.map(item => ({
    ...item,
    id: Date.now() + '_' + Math.random() + '_' + (item.action || (item as { type?: string }).type || ''),
    ...(typeof (item as { value?: string }).value !== 'undefined' ? { value: (item as { value?: string }).value || '' } : {}),
  }))

  // ارسال همه آیتم‌ها به کامپوننت والد
  itemsToAdd.forEach(item => {
    emit('add-link', item)
  })

  // بستن مدال
  emit('close')
}

</script>

