<template>
  <div class="flex flex-col">
    <!-- 🔹 هدر موبایل -->
    <div class="fixed top-0 left-0 right-0 w-full bg-background/95 backdrop-blur-lg border-b border-border z-[100] block lg:hidden">
      <div class="flex items-center justify-between w-full p-4">
        <div class="flex items-center gap-3">
          <button @click="goBack" class="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-accent transition-colors">
            <i class="ti ti-arrow-right text-xl text-foreground"></i>
          </button>
          <h1 class="text-lg font-semibold text-foreground">ایجاد پروفایل جدید</h1>
        </div>
      </div>
    </div>

    <!-- 🔹 محتوای اصلی -->
    <div class="w-full grid grid-cols-1 lg:grid-cols-6 gap-4 lg:pt-6 pb-24 lg:pb-6">
      <!-- فرم و تنظیمات -->
      <div class="lg:col-span-4 min-h-0 px-1 lg:px-0">
        
        <!-- تغییر چیدمان -->
        <div class="mb-6">
          <LayoutSelector 
            v-model="selectedLayout"
            @layout-changed="handleLayoutChange"
            @confirm="handleLayoutConfirm"
          />
        </div>
        
        <TabAbout
            v-model:form="formStore.value"
            @open-preview="showPreviewMobile = true"
            class="bg-card p-4 sm:p-6 rounded-xl mb-6 border border-border"
        />
        
        <!-- لیست لینک‌های موجود -->
        <div v-if="form.links && form.links.length > 0" class="space-y-3 mb-6 mt-8">
          <h3 class="text-lg font-semibold text-foreground">محتوای اضافه شده</h3>
          <draggable
            v-model="form.links"
            :animation="200"
            :delay="150"
            :delay-on-touch-only="true"
            :touch-start-threshold="5"
            ghost-class="ghost-item"
            chosen-class="chosen-item"
            drag-class="drag-item"
            item-key="id"
            handle=".drag-handle"
            class="space-y-2"
            @start="isDragging = true"
            @end="onDragEnd"
          >
            <template #item="{ element: link, index }">
              <div
                class="bg-card border border-border rounded-xl p-4 flex items-center justify-between hover:bg-muted/20 transition-all duration-200 group"
                :class="{'shadow-lg scale-[1.02]': isDragging}"
              >
                <!-- Handle للسحب -->
                <div class="flex items-center gap-3">
                  <div class="drag-handle cursor-grab active:cursor-grabbing p-2 -m-2 hover:bg-muted/50 rounded-lg transition-all" style="touch-action: none; -webkit-user-select: none; user-select: none;">
                    <i class="ti ti-grip-vertical text-muted-foreground text-xl"></i>
                  </div>
                  
                  <!-- آیکون و عنوان -->
                  <div class="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
                    <!-- استفاده از کامپوننت آیکون اصلی -->
                    <component
                      :is="getIconComponent(link)"
                      v-if="getIconComponent(link)"
                      :size="20"
                      :color="iconColor"
                      :filled="isIconFilled"
                    />
                    <!-- Fallback to image -->
                    <img
                      v-else-if="getSafeIconUrl(link)"
                      :src="getSafeIconUrl(link)"
                      class="w-5 h-5 object-contain"
                      alt="icon"
                    >
                    <!-- Fallback آیکون پیش‌فرض -->
                    <i v-else :class="`ti ti-${getFallbackIcon(link)} text-muted-foreground`"></i>
                  </div>
                  <div>
                    <p class="font-medium text-foreground">{{ getLinkDisplayTitle(link) }}</p>
                  </div>
                </div>
                
                <!-- دکمه‌ها -->
                <div class="flex items-center gap-2">
                  <button
                    @click="editLink(link, index)"
                    class="w-8 h-8 rounded-lg bg-muted hover:bg-muted-foreground/20 flex items-center justify-center transition-colors"
                  >
                    <i class="ti ti-edit text-sm text-muted-foreground"></i>
                  </button>
                  <button
                    @click="removeLink(index)"
                    class="w-8 h-8 rounded-lg bg-destructive/10 hover:bg-destructive/20 flex items-center justify-center transition-colors"
                  >
                    <i class="ti ti-trash text-sm text-destructive"></i>
                  </button>
                </div>
              </div>
            </template>
          </draggable>
        </div>
        
        <!-- کارت افزودن محتوا -->
        <div class="bg-card mt-4 rounded-xl p-6 border border-border hover:shadow-md transition-shadow">
          <div class="flex gap-4 mb-6">
            <!-- آیکون -->
            <div class="w-12 h-12 bg-muted/40 rounded-xl flex items-center justify-center border-2 border-dashed border-border/60 hover:border-primary/50 hover:bg-primary/5 transition-colors">
              <i class="ti ti-plus text-muted-foreground text-xl"></i>
            </div>
            <!-- متن -->
            <div class="flex-1">
              <h3 class="text-base font-semibold text-foreground mb-2">افزودن محتوا</h3>
              <p class="text-sm text-muted-foreground leading-relaxed">
                اطلاعات تماس، شبکه‌های اجتماعی، لینک‌ها و محتوای دیگر را به کارت خود اضافه کنید
              </p>
            </div>
          </div>
          <!-- دکمه افزودن -->
          <button 
            @click="showAddModal = true"
            class="w-full bg-primary text-primary-foreground px-6 py-3.5 rounded-xl text-sm font-medium transition-all duration-200 flex items-center justify-center gap-3 hover:bg-primary/90 hover:shadow-lg transform hover:-translate-y-0.5"
          >
            <i class="ti ti-plus text-lg"></i>
            <span>افزودن محتوا</span>
            <i class="ti ti-arrow-left text-sm"></i>
          </button>
        </div>

        <!-- 🔹 دکمه ذخیره - دسکتاپ -->
        <div class="hidden lg:block mt-8">
          <div class="flex justify-end">
            <button
              @click="saveChanges"
              :disabled="isSaving"
              class="bg-primary text-primary-foreground px-8 py-3.5 rounded-xl text-sm font-semibold transition-all duration-200 flex items-center justify-center gap-2 hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-md"
            >
              <template v-if="isSaving">
                <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span class="text-sm font-medium">در حال ذخیره...</span>
              </template>
              <template v-else>
                <i class="ti ti-device-floppy text-lg"></i>
                <span class="text-sm font-medium">ذخیره تغییرات</span>
              </template>
            </button>
          </div>
        </div>
      </div>

      
      <!-- پیش‌نمایش دسکتاپ -->
      <div class="lg:col-span-2 space-y-4 sticky z-0 top-16 h-fit w-full hidden lg:block">
        <div class="flex justify-center">
          <div class="relative" style="width: 390px; height: 844px;">
            <!-- فریم موبایل iPhone 13 Pro -->
            <div class="absolute inset-0 rounded-[40px] border-4 border-gray-800 bg-black shadow-xl">
              <!-- دکمه‌های فیزیکی -->
              <div class="absolute top-[15%] -left-[5px] w-[4px] h-5 bg-slate-700 rounded-xl"></div>
              <div class="absolute top-[25%] -left-[5px] w-[4px] h-10 bg-slate-700 rounded-xl"></div>
              <div class="absolute top-[35%] -left-[5px] w-[4px] h-10 bg-slate-700 rounded-xl"></div>
              <div class="absolute top-[35%] -right-[5px] w-[4px] h-16 bg-slate-700 rounded-xl"></div>
              <!-- notch -->
              <div class="absolute top-3 left-1/2 -translate-x-1/2 w-16 h-5 bg-black rounded-xl z-20"></div>

              <!-- محتوای preview با iframe واقعی -->
              <div class="absolute inset-2 rounded-[32px] overflow-hidden bg-white">
                <ClientOnly>
                  <iframe
                    ref="iframeRef"
                    :key="`iframe-${iframeKey}`"
                    :src="previewUrl"
                    class="w-full h-full border-0 rounded-[28px] overflow-hidden"
                    sandbox="allow-scripts allow-forms allow-same-origin allow-popups"
                    loading="lazy"
                    @load="onIframeLoad"
                  />
                  <template #fallback>
                    <div class="w-full h-full bg-gray-100 rounded-[28px] flex items-center justify-center">
                      <div class="text-gray-500">در حال بارگذاری...</div>
                    </div>
                  </template>
                </ClientOnly>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 🔹 پیش‌نمایش موبایل -->
    <transition
      enter-active-class="transform transition ease-in-out duration-300"
      enter-from-class="translate-y-full"
      enter-to-class="translate-y-0"
      leave-active-class="transform transition ease-in-out duration-300"
      leave-from-class="translate-y-0"
      leave-to-class="translate-y-full"
    >
      <div
        v-if="showPreviewMobile"
        class="fixed inset-0 z-50 flex items-end lg:hidden"
        @click.self="showPreviewMobile = false"
      >
        <div class="bg-card w-full h-full rounded-t-2xl p-4 overflow-y-auto shadow-xl flex flex-col border-t border-border">
          <div class="flex justify-between items-center mb-4 flex-shrink-0">
            <h2 class="text-base font-semibold text-foreground">پیش‌نمایش</h2>
            <button
              @click="showPreviewMobile = false"
              class="text-muted-foreground hover:text-foreground transition-colors"
            >
              <i class="ti ti-x text-xl"></i>
            </button>
          </div>

          <div class="w-full flex-1" style="min-height: 600px;">
            <div class="w-full h-full relative overflow-hidden rounded-xl border border-border">
              <div
                v-if="isIframeLoading"
                class="absolute inset-0 flex items-center justify-center bg-muted rounded-xl z-10"
              >
                <div class="flex flex-col items-center space-y-2">
                  <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                  <span class="text-sm text-muted-foreground">در حال بارگذاری...</span>
                </div>
              </div>

              <ClientOnly>
                <iframe
                  ref="iframeRef"
                  :key="`iframe-mobile-${iframeKey}`"
                  :src="previewUrl"
                  class="w-full h-full border-0 rounded-xl overflow-hidden"
                  sandbox="allow-scripts allow-forms allow-same-origin allow-popups"
                  loading="lazy"
                  @load="onIframeLoad"
                />
                <template #fallback>
                  <div class="w-full h-full bg-muted rounded-xl flex items-center justify-center">
                    <div class="text-muted-foreground">در حال بارگذاری...</div>
                  </div>
                </template>
              </ClientOnly>
            </div>
          </div>
        </div>
      </div>
    </transition>

    <!-- 🔹 بخش ثابت ذخیره تغییرات - موبایل -->
    <div class="fixed bottom-0 left-0 right-0 bg-background/95 backdrop-blur-lg border-t border-border p-4 z-40 lg:hidden">
      <div class="max-w-4xl mx-auto flex gap-3">
        <!-- دکمه پیش‌نمایش -->
        <button
          @click="showPreviewMobile = true"
          class="flex-1 bg-muted text-foreground px-6 py-3 rounded-xl text-sm font-medium transition-all duration-200 flex items-center justify-center gap-2 hover:bg-muted/80"
        >
          <i class="ti ti-eye text-lg"></i>
          <span>پیش‌نمایش</span>
        </button>
        
        <!-- دکمه ذخیره تغییرات -->
        <button
          @click="saveChanges"
          :disabled="isSaving"
          class="flex-2 bg-primary text-primary-foreground px-6 py-3 rounded-xl text-sm font-medium transition-all duration-200 flex items-center justify-center gap-2 hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <template v-if="isSaving">
            <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span class="text-sm font-medium">در حال ذخیره...</span>
          </template>
          <template v-else>
            <i class="ti ti-device-floppy text-lg"></i>
            <span class="text-sm font-medium">ذخیره تغییرات</span>
          </template>
        </button>
      </div>
    </div>

    <!-- 🔹 مودال افزودن لینک -->
    <AddLinkModal
      v-if="showAddModal"
      @close="showAddModal = false"
      @add-link="handleAddLink"
    />
    
    <!-- 🔹 مودال ویرایش محتوا -->
    <div v-if="showEditSheet" class="fixed inset-0 bg-black/50 backdrop-blur flex items-center justify-center z-[60] p-0 lg:p-4" @click.self="cancelEdit">
      <div class="bg-background rounded-none lg:rounded-2xl w-full h-full lg:max-w-md lg:h-auto lg:max-h-[90vh] overflow-y-auto overflow-x-hidden lg:shadow-2xl border-0 lg:border border-border">
        <!-- Header -->
        <div class="flex items-center justify-between p-4 border-b border-border bg-background sticky top-0 z-10">
          <button class="text-muted-foreground hover:text-foreground flex items-center gap-2 transition-colors" @click="cancelEdit">
            <i class="ti ti-arrow-right text-lg" />
            <span class="text-sm font-medium">برگشت</span>
          </button>
          <h3 class="text-base font-semibold text-foreground">{{ getEditSheetTitle() }}</h3>
          <div class="flex items-center gap-2">
            <!-- دکمه مشاهده لینک -->
            <a 
              v-if="editingLink && getEditLinkUrl(editingLink)" 
              :href="getEditLinkUrl(editingLink)" 
              target="_blank"
              class="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
              title="مشاهده لینک"
            >
              <i class="ti ti-external-link text-lg" />
            </a>
            <!-- دکمه حذف -->
            <button 
              v-if="editingLink"
              type="button"
              class="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-destructive/10 text-destructive hover:text-destructive/80 transition-colors"
              title="حذف"
              @click="() => { removeLink(editingLinkIndex); }"
            >
              <i class="ti ti-trash text-lg" />
            </button>
          </div>
        </div>

        <!-- Form Content -->
        <div class="flex-1">
          <component
            v-if="editingLink"
            :is="getEditComponent(editingLink)"
            :link="editingLink"
            @cancel="cancelEdit"
            @back="cancelEdit"
            @submit="saveEditedLink"
            @delete="() => removeLink(editingLinkIndex)"
          />
        </div>
      </div>
    </div>
  </div>
  <InfoToast :visible="showToast" :message="toastMessage" :icon="toastIcon"/>
  <ConfirmDialog
    :visible="showDeleteConfirm"
    title="حذف محتوا"
    :message="`آیا از حذف '${linkToDelete?.title || linkToDelete?.name || 'این مورد'}' اطمینان دارید؟`"
    icon="ti ti-trash"
    confirm-text="بله، حذف شود"
    cancel-text="انصراف"
    @confirm="confirmDelete"
    @cancel="cancelDelete"
  />
</template>

<script setup>
import {ref, computed, watch, onMounted, onUnmounted} from 'vue'
import {useSafeFormStore} from '~/composables/useSafeFormStore'
import {useSafeNavigation} from '~/composables/useSafeNavigation'
import {useUserStore} from '~/stores/user'
import TabAbout from '@/components/UserDashboard/main/EditCard/tabs/TabAbout.vue'
import AddLinkModal from '@/components/UserDashboard/modals/AddLinkModal.vue'
import LayoutSelector from '../EditCard/components/LayoutSelector.vue'
import InfoToast from "~/components/UserDashboard/modals/InfoToast.vue"
import ConfirmDialog from "~/components/UserDashboard/modals/ConfirmDialog.vue"
import {useFormStore} from "~/stores/form.js"
import draggable from 'vuedraggable'
import {useIconComponents} from '~/composables/useIconComponentsMap'
import * as EditForms from '@/components/ui/forms/edit'

// Stores
const formStore = useSafeFormStore()
const form = useFormStore()
const userStore = useUserStore()
const { goBack: safeGoBack, safeNavigateTo } = useSafeNavigation()

// حالت drag & drop
const isDragging = ref(false)

// حالت تایید حذف
const showDeleteConfirm = ref(false)
const linkToDelete = ref(null)
const linkIndexToDelete = ref(-1)

// Icon system
const {getIconComponent: getIconComponentFromMap, getSafeIcon} = useIconComponents()

// Toast
const showToast = ref(false)
const toastMessage = ref('')
const toastIcon = ref('ti-alert-triangle')
const showInfoToast = (message, icon = 'ti-check') => {
  toastMessage.value = message
  toastIcon.value = icon
  showToast.value = true
  setTimeout(() => showToast.value = false, 3000)
}

// Icon color
const iconColor = computed(() => {
  if (formStore.value.iconColor?.background && formStore.value.iconColor.background !== 'transparent') {
    return formStore.value.iconColor.background
  }
  return undefined
})

const isIconFilled = computed(() => {
  return !!(formStore.value.iconColor?.background && formStore.value.iconColor.background !== 'transparent')
})

// Modals
const showAddModal = ref(false)
const showEditSheet = ref(false)

// Edit link state
const editingLink = ref(null)
const editingLinkIndex = ref(-1)

// Layout selection
const selectedLayout = ref(form.layout || 'right')

// Watch form layout changes
watch(() => form.layout, (newLayout) => {
  if (newLayout && newLayout !== selectedLayout.value) {
    selectedLayout.value = newLayout
  }
}, { immediate: true })

// برگشت به داشبورد
const goBack = () => {
  // استفاده از safeGoBack برای برگشت به صفحه قبل
  safeGoBack()
}

// وضعیت ذخیره
const isSaving = ref(false)

// Functions
function handleLayoutChange(newLayout) {
  form.layout = newLayout
}

function handleLayoutConfirm() {
  sendFormDataToIframe()
}

async function handleAddLink(newItem) {
  if (!form.links) {
    form.links = []
  }
  
  const cleanedItem = { ...newItem }
  
  if (!cleanedItem.description || 
      cleanedItem.description.trim() === '' || 
      cleanedItem.description === 'description') {
    delete cleanedItem.description
  }
  
  const normalizedLink = form.normalizeLink ? form.normalizeLink(cleanedItem) : {
    ...cleanedItem,
    id: cleanedItem.id || Date.now() + '_' + Math.random(),
    title: cleanedItem.title || cleanedItem.name || '',
    enabled: cleanedItem.enabled !== undefined ? cleanedItem.enabled : true
  }
  
  form.links.push(normalizedLink)
  showInfoToast('محتوا با موفقیت اضافه شد', 'ti-check')
  showAddModal.value = false
  sendFormDataToIframe()
}

function onDragEnd() {
  isDragging.value = false
  sendFormDataToIframe()
}

function editLink(link, index) {
  editingLink.value = { ...link }
  editingLinkIndex.value = index
  showEditSheet.value = true
}

function saveEditedLink(updatedLink) {
  if (editingLinkIndex.value !== -1 && form.links) {
    form.links[editingLinkIndex.value] = updatedLink
    showInfoToast('محتوا با موفقیت ویرایش شد', 'ti-check')
  }
  cancelEdit()
  sendFormDataToIframe()
}

function cancelEdit() {
  showEditSheet.value = false
  editingLink.value = null
  editingLinkIndex.value = -1
}

function removeLink(index) {
  linkToDelete.value = form.links[index]
  linkIndexToDelete.value = index
  showDeleteConfirm.value = true
}

function confirmDelete() {
  if (linkIndexToDelete.value !== -1) {
    form.links.splice(linkIndexToDelete.value, 1)
    showInfoToast('محتوا با موفقیت حذف شد', 'ti-check')
    sendFormDataToIframe()
  }
  cancelDelete()
  if (showEditSheet.value) {
    cancelEdit()
  }
}

function cancelDelete() {
  showDeleteConfirm.value = false
  linkToDelete.value = null
  linkIndexToDelete.value = -1
}

function getIconComponent(link) {
  if (!link) return null
  const iconComp = getIconComponentFromMap(link.action)
  return iconComp
}

function getSafeIconUrl(link) {
  return getSafeIcon(link)
}

function getFallbackIcon(link) {
  const fallbackIcons = {
    link: 'link',
    email: 'mail',
    phone: 'phone',
    whatsapp: 'brand-whatsapp',
    telegram: 'brand-telegram',
    instagram: 'brand-instagram',
    twitter: 'brand-twitter',
    facebook: 'brand-facebook',
    linkedin: 'brand-linkedin',
    youtube: 'brand-youtube',
    tiktok: 'brand-tiktok',
    snapchat: 'brand-snapchat',
    contactcard: 'id',
  }
  return fallbackIcons[link.action] || 'link'
}

function getLinkDisplayTitle(link) {
  return link.title || link.name || link.value || link.action || 'بدون عنوان'
}

function getEditSheetTitle() {
  if (!editingLink.value) return 'ویرایش'
  return `ویرایش ${editingLink.value.title || editingLink.value.name || 'محتوا'}`
}

function getEditLinkUrl(link) {
  if (!link) return null
  if (link.value && (link.value.startsWith('http://') || link.value.startsWith('https://'))) {
    return link.value
  }
  if (link.baseUrl) {
    return link.baseUrl + (link.username || link.value || '')
  }
  return null
}

function getEditComponent(link) {
  if (!link || !link.action) return null
  
  const componentMap = {
    instagram: EditForms.EditInstagramForm,
    twitter: EditForms.EditTwitterForm,
    facebook: EditForms.EditFacebookForm,
    linkedin: EditForms.EditLinkedinForm,
    youtube: EditForms.EditYoutubeForm,
    tiktok: EditForms.EditTiktokForm,
    telegram: EditForms.EditTelegramForm,
    whatsapp: EditForms.EditWhatsappForm,
    phone: EditForms.EditPhoneForm,
    email: EditForms.EditEmailForm,
    link: EditForms.EditLinkForm,
    contactcard: EditForms.EditContactcardForm,
  }
  
  return componentMap[link.action] || EditForms.EditLinkForm
}

async function saveChanges() {
  isSaving.value = true
  
  try {
    const nuxtApp = useNuxtApp()
    const axios = nuxtApp.$axios
    
    // فقط نام اجباریه
    if (!form.name || form.name.trim() === '') {
      showInfoToast('لطفاً نام را وارد کنید', 'ti-alert-triangle')
      isSaving.value = false
      return
    }
    
    const payload = {
      cardName: form.name || 'کارت جدید', // cardName required by backend
      name: form.name,
    }
    
    // فیلدهای اختیاری فقط اگر مقدار داشتن
    if (form.bio) payload.bio = form.bio
    if (form.location) payload.location = form.location
    if (form.profileImage) payload.profileImage = form.profileImage
    if (form.coverImage) payload.coverImage = form.coverImage
    if (form.logoImage) payload.logoImage = form.logoImage
    if (form.layout) payload.layout = form.layout
    if (form.themeColor) payload.themeColor = JSON.stringify(form.themeColor)
    if (form.iconColor) payload.iconColor = JSON.stringify(form.iconColor)
    if (form.links && form.links.length > 0) payload.links = JSON.stringify(form.links)
    
    console.log('Payload:', payload)
    
    const response = await axios.post('/v1/cards', payload)
    
    console.log('Response:', response)
    
    if (response.data.success) {
      showInfoToast('کارت با موفقیت ایجاد شد', 'ti-check')
      
      // ✅ به‌روزرسانی userStore برای نمایش کارت جدید در داشبورد
      await userStore.fetchUser()
      
      // ✅ انتخاب پروفایل جدید به عنوان پروفایل فعال
      const newCardId = response.data.data?.id
      if (newCardId) {
        await form.setDefaultCard(newCardId)
        form.setAboutFrom(newCardId)
      }
      
      setTimeout(() => {
        safeNavigateTo('/dashboard')
      }, 1500)
    } else {
      console.error('Server returned error:', response.data)
      showInfoToast(response.data.message || 'خطا در ایجاد کارت', 'ti-alert-triangle')
    }
  } catch (error) {
    console.error('Error creating card:', error)
    console.error('Error response:', error.response?.data)
    const errorMessage = error.response?.data?.message || error.message || 'خطا در ایجاد کارت'
    showInfoToast(errorMessage, 'ti-alert-triangle')
  } finally {
    isSaving.value = false
  }
}

// مدیریت iframe
const isIframeLoading = ref(true)
const isIframeReady = ref(false)
const iframeKey = ref(0)
const iframeRef = ref(null)
const showPreviewMobile = ref(false)

const previewUrl = computed(() => {
  if (typeof window === 'undefined') return 'about:blank'
  const params = new URLSearchParams()
  params.set('t', Date.now().toString())
  return `${window.location.origin}/preview/newCard?${params.toString()}`
})

function sendFormDataToIframe() {
  if (isIframeReady.value && iframeRef.value && iframeRef.value.contentWindow) {
    try {
      iframeRef.value.contentWindow.postMessage({
        type: 'FORM_DATA_UPDATE',
        data: JSON.parse(JSON.stringify(formStore.value))
      }, window.location.origin)
    } catch (error) {
      console.error('Error sending to iframe:', error)
    }
  }
}

const handleIframeMessage = (event) => {
  if (event.origin !== window.location.origin) return
  
  if (event.data?.type === 'IFRAME_READY') {
    isIframeReady.value = true
    sendFormDataToIframe()
  }
}

const onIframeLoad = () => {
  isIframeLoading.value = false
}

watch(() => formStore.value, () => {
  sendFormDataToIframe()
}, { deep: true })

onMounted(() => {
  formStore.value.$reset()
  window.addEventListener('message', handleIframeMessage)
})

onUnmounted(() => {
  window.removeEventListener('message', handleIframeMessage)
})
</script>

<style scoped>
.ghost-item {
  opacity: 0.4;
}

.chosen-item {
  opacity: 0.9;
}

.drag-item {
  transform: rotate(2deg);
}
</style>
