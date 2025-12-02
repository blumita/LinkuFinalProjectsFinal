<template>
  <div class="flex flex-col">
    <!-- 🔹 هدر موبایل -->
    <div class="fixed top-0 left-0 right-0 w-full bg-background/95 backdrop-blur-lg border-b border-border z-[100] block lg:hidden">
      <div class="flex items-center justify-between w-full p-4">
        <div class="flex items-center gap-3">
          <button @click="goBack" class="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-accent transition-colors">
            <i class="ti ti-arrow-right text-xl text-foreground"></i>
          </button>
          <h1 class="text-lg font-semibold text-foreground">ویرایش پروفایل</h1>
        </div>
        
        <div class="flex items-center gap-2">
          <!-- دکمه فرم ارتباط -->
          <button
            @click.stop="goToLeadCapture"
            type="button"
            class="bg-primary text-primary-foreground px-3 py-2 rounded-xl flex items-center gap-2 relative z-[101]"
          >
            <i class="ti ti-message text-base"/>
            <span class="text-sm font-medium">فرم ارتباط</span>
          </button>
        </div>
      </div>
    </div>

    <!-- 🔹 Skeleton Loading State -->
    <div v-if="isPageLoading" class="w-full grid grid-cols-1 lg:grid-cols-6 gap-4 lg:pt-6 pb-24 lg:pb-6 animate-pulse">
      <!-- فرم و تنظیمات - Skeleton -->
      <div class="lg:col-span-4 min-h-0 px-1 lg:px-0 space-y-6">
        
        <!-- Layout Selector Skeleton -->
        <div class="bg-card p-4 rounded-xl border border-border">
          <div class="h-5 w-32 bg-muted rounded mb-3"></div>
          <div class="flex gap-3">
            <div class="h-16 flex-1 bg-muted rounded-xl"></div>
            <div class="h-16 flex-1 bg-muted rounded-xl"></div>
            <div class="h-16 flex-1 bg-muted rounded-xl"></div>
          </div>
        </div>
        
        <!-- TabAbout Skeleton -->
        <div class="bg-card p-4 sm:p-6 rounded-xl border border-border space-y-4">
          <!-- Avatar & Banner -->
          <div class="flex items-center gap-4">
            <div class="w-20 h-20 bg-muted rounded-full"></div>
            <div class="flex-1 space-y-2">
              <div class="h-5 w-3/4 bg-muted rounded"></div>
              <div class="h-4 w-1/2 bg-muted rounded"></div>
            </div>
          </div>
          <!-- Form fields -->
          <div class="space-y-3">
            <div class="h-10 bg-muted rounded-lg"></div>
            <div class="h-10 bg-muted rounded-lg"></div>
            <div class="h-20 bg-muted rounded-lg"></div>
          </div>
        </div>
        
        <!-- Lead Form Switch Skeleton -->
        <div class="bg-card p-4 sm:p-6 rounded-xl border border-border">
          <div class="flex items-center justify-between">
            <div class="space-y-2">
              <div class="h-5 w-40 bg-muted rounded"></div>
              <div class="h-4 w-56 bg-muted rounded"></div>
            </div>
            <div class="w-11 h-6 bg-muted rounded-full"></div>
          </div>
        </div>
        
        <!-- Links List Skeleton -->
        <div class="space-y-3">
          <div class="h-6 w-36 bg-muted rounded"></div>
          <div class="space-y-2">
            <div class="bg-card border border-border rounded-xl p-4 flex items-center justify-between">
              <div class="flex items-center gap-3">
                <div class="w-6 h-8 bg-muted rounded"></div>
                <div class="w-10 h-10 bg-muted rounded-lg"></div>
                <div class="h-5 w-32 bg-muted rounded"></div>
              </div>
              <div class="flex gap-2">
                <div class="w-8 h-8 bg-muted rounded-lg"></div>
                <div class="w-8 h-8 bg-muted rounded-lg"></div>
              </div>
            </div>
            <div class="bg-card border border-border rounded-xl p-4 flex items-center justify-between">
              <div class="flex items-center gap-3">
                <div class="w-6 h-8 bg-muted rounded"></div>
                <div class="w-10 h-10 bg-muted rounded-lg"></div>
                <div class="h-5 w-28 bg-muted rounded"></div>
              </div>
              <div class="flex gap-2">
                <div class="w-8 h-8 bg-muted rounded-lg"></div>
                <div class="w-8 h-8 bg-muted rounded-lg"></div>
              </div>
            </div>
            <div class="bg-card border border-border rounded-xl p-4 flex items-center justify-between">
              <div class="flex items-center gap-3">
                <div class="w-6 h-8 bg-muted rounded"></div>
                <div class="w-10 h-10 bg-muted rounded-lg"></div>
                <div class="h-5 w-36 bg-muted rounded"></div>
              </div>
              <div class="flex gap-2">
                <div class="w-8 h-8 bg-muted rounded-lg"></div>
                <div class="w-8 h-8 bg-muted rounded-lg"></div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Add Content Card Skeleton -->
        <div class="bg-card rounded-xl p-6 border border-border">
          <div class="flex gap-4 mb-6">
            <div class="w-12 h-12 bg-muted rounded-xl"></div>
            <div class="flex-1 space-y-2">
              <div class="h-5 w-28 bg-muted rounded"></div>
              <div class="h-4 w-full bg-muted rounded"></div>
            </div>
          </div>
          <div class="h-12 bg-muted rounded-xl"></div>
        </div>
      </div>
      
      <!-- Preview Skeleton - Desktop -->
      <div class="lg:col-span-2 hidden lg:block">
        <div class="sticky top-6">
          <div class="bg-card rounded-2xl border border-border p-4 space-y-4">
            <div class="h-6 w-24 bg-muted rounded mx-auto"></div>
            <div class="aspect-[9/16] bg-muted rounded-xl"></div>
          </div>
        </div>
      </div>
    </div>

    <!-- 🔹 محتوای اصلی -->
    <div v-else class="w-full grid grid-cols-1 lg:grid-cols-6 gap-4  lg:pt-6 pb-24 lg:pb-6">
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
            :cardId="cardId"
            v-model:form="formStore.value"
            @open-preview="showPreviewMobile = true"
            class="bg-card p-4 sm:p-6 rounded-xl mb-6 border border-border "
        />

        <!-- سوئیچ فرم لید -->
        <div class="bg-card p-4 sm:p-6 rounded-xl mb-6 border border-border mt-8">
          <div class="flex items-center justify-between">
            <div>
              <h3 class="text-base font-semibold text-foreground mb-1">فرم دریافت اطلاعات</h3>
              <p class="text-sm text-muted-foreground">فعال‌سازی فرم برای جمع‌آوری اطلاعات بازدیدکنندگان</p>
            </div>
            <label class="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                v-model="form.isLeadCaptureEnabled"
                class="sr-only peer"
              >
              <div class="w-11 h-6 bg-muted peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-card after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
            </label>
          </div>
        </div>
        
        <!-- لیست لینک‌های موجود -->
        <div v-if="form.links && form.links.length > 0" class="space-y-3 mb-6 mt-8">
          <h3 class="text-lg font-semibold text-foreground">محتوای اضافه شده</h3>
          <draggable
            v-model="form.links"
            :animation="200"
            ghost-class="ghost-item"
            chosen-class="chosen-item"
            drag-class="drag-item"
            item-key="id"
            handle=".drag-handle"
            class="space-y-2"
            @end="onDragEnd"
          >
            <template #item="{ element: link, index }">
              <div
                class="bg-card border border-border rounded-xl p-4 flex items-center justify-between hover:bg-muted/20 transition-all duration-200 group"
                :class="{'shadow-lg scale-[1.02]': isDragging}"
              >
                <!-- Handle للسحب -->
                <div class="flex items-center gap-3">
                  <div class="drag-handle cursor-grab active:cursor-grabbing transition-opacity p-2 -m-2 touch-none">
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
                    <!-- <p class="text-xs text-muted-foreground">{{ getLinkTypeLabel(link.action) }}</p> -->
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
        <div class="bg-card mt-4 rounded-xl  p-6 border border-border  hover:shadow-md transition-shadow">
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
              class="bg-primary text-primary-foreground px-8 py-3.5 rounded-xl text-sm font-semibold transition-all duration-200 flex items-center justify-center gap-2 hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed  hover:shadow-md"
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
                  <!-- iframe واقعی -->
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

    <!-- 🔹 پیش‌نمایش موبایل - فول اسکرین -->
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
          class="fixed inset-0 z-[9999] lg:hidden bg-white"
      >
        <!-- هدر ثابت -->
        <div class="fixed top-0 left-0 right-0 z-10 bg-white border-b border-gray-200 safe-area-top">
          <div class="flex items-center justify-between px-4 py-3">
            <button
                @click="showPreviewMobile = false"
                class="flex items-center gap-2 text-gray-700 hover:text-gray-900 transition-colors"
            >
              <i class="ti ti-arrow-right text-xl"/>
              <span class="text-sm font-medium">بازگشت</span>
            </button>
            <h2 class="text-base font-semibold text-gray-800">پیش‌نمایش</h2>
            <div class="w-16"></div>
          </div>
        </div>

        <!-- محتوای پیش‌نمایش -->
        <div class="pt-14 h-full w-full bg-white">
          <ClientOnly>
            <iframe
                ref="iframeRef"
                :key="`iframe-mobile-${iframeKey}`"
                :src="previewUrl"
                class="w-full h-full border-0 bg-white"
                sandbox="allow-scripts allow-forms allow-same-origin allow-popups"
                loading="lazy"
                @load="onIframeLoad"
            />
            <template #fallback>
              <div class="w-full h-full bg-white flex items-center justify-center">
                <div class="text-gray-500">در حال بارگذاری...</div>
              </div>
            </template>
          </ClientOnly>
        </div>
      </div>
    </transition>

    <!-- 🔹 مودال افزودن لینک -->
    <AddLinkModal
      v-if="showAddModal"
      :cardId="cardId"
      @close="showAddModal = false"
      @add-link="handleAddLink"
    />
    
    <!-- 🔹 مودال ویرایش محتوا (مثل AddLinkModal) -->
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
            <!-- دکمه مشاهده لینک - فقط برای لینک‌های با URL معتبر -->
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
              @click="() => { removeLink(editingLinkIndex); cancelEdit(); }"
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
            :cardId="cardId"
            @cancel="cancelEdit"
            @back="cancelEdit"
            @submit="saveEditedLink"
            @delete="() => { removeLink(editingLinkIndex); cancelEdit(); }"
          />
        </div>
      </div>
    </div>
  </div>
  <InfoToast :visible="showToast" :message="toastMessage" :icon="toastIcon"/>
</template>

<script setup>
import {ref, computed, watch, onMounted, onUnmounted, toRaw} from 'vue'
import {useRoute} from '#app'
import {useSafeFormStore} from '~/composables/useSafeFormStore'
import TabAbout from '@/components/UserDashboard/main/EditCard/tabs/TabAbout.vue'
import AddLinkModal from '@/components/UserDashboard/modals/AddLinkModal.vue'
import BottomSheet from '@/components/ui/BottomSheet.vue'
import LayoutSelector from './components/LayoutSelector.vue'
import InfoToast from "~/components/UserDashboard/modals/InfoToast.vue"
import {useFormStore} from "~/stores/form.js"
import draggable from 'vuedraggable'
import {useIconComponents} from '~/composables/useIconComponentsMap'
import * as EditForms from '@/components/ui/forms/edit'

const props = defineProps({cardId: String, cardSlug: String})

// Stores
const formStore = useSafeFormStore()
const form = useFormStore()
const route = useRoute()

// Loading state
const isPageLoading = ref(true)

// حالت drag & drop
const isDragging = ref(false)

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

const cardId = computed(() => {
  // Check multiple sources for cardId with priority
  const id = props.cardId || 
             route.params.cardId || 
             route.query.id || 
             route.params.id ||
             formStore.selectedCardId ||
             null
  

  
  return id
})

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

// Modals
const showAddModal = ref(false)
const showContactForm = ref(false)
const showEditSheet = ref(false)

// Edit link state
const editingLink = ref(null)
const editingLinkIndex = ref(-1)

// Layout selection
const selectedLayout = ref(form.layout || 'right')

// Watch form layout changes to sync selectedLayout
watch(() => form.layout, (newLayout) => {
  if (newLayout && newLayout !== selectedLayout.value) {
    selectedLayout.value = newLayout
  }
}, { immediate: true })

// Functions
function handleAddLink(newItem) {
  // اضافه کردن لینک جدید به store
  if (!form.links) {
    form.links = []
  }
  
  // پاکسازی اولیه - حذف description اضافی
  const cleanedItem = { ...newItem }
  
  // حذف کامل description اگر خالی یا پیش‌فرض است
  if (!cleanedItem.description || 
      cleanedItem.description.trim() === '' || 
      cleanedItem.description === 'description') {
    delete cleanedItem.description
  }
  
  // نرمال‌سازی لینک با استفاده از تابع normalizeLink
  const normalizedLink = form.normalizeLink ? form.normalizeLink(cleanedItem) : {
    ...cleanedItem,
    id: cleanedItem.id || Date.now() + '_' + Math.random(),
    title: cleanedItem.title || cleanedItem.name || '',
    enabled: cleanedItem.enabled !== undefined ? cleanedItem.enabled : true
  }
  
  // ایجاد لینک جدید در سرور
  createNewLink(normalizedLink)
  
  showInfoToast('لینک با موفقیت اضافه شد', 'ti-check')
  showAddModal.value = false
}

// تابع ایجاد لینک جدید در سرور
async function createNewLink(linkData) {
  if (!cardId.value) {
    console.warn('No cardId available for creating link')
    return
  }
  
  try {
    const nuxtApp = useNuxtApp()
    const axios = nuxtApp.$axios
    
    const payloadLink = {
      action: linkData.action || '',
      baseUrl: linkData.baseUrl || '',
      enabled: linkData.enabled !== undefined ? linkData.enabled : true,
      icon: linkData.icon ? JSON.stringify(linkData.icon) : null,
      id: linkData.id || `${Date.now()}_${Math.random().toString(36).slice(2)}`,
      name: linkData.name || '',
      title: linkData.title || '',
      type: linkData.type || 'link',
      value: linkData.value || '',
      username: linkData.username || '',
      placeholder: linkData.placeholder ? JSON.stringify(linkData.placeholder) : null,
      showDescription: linkData.showDescription || false,
      // اضافه کردن فیلدهای اضافی که ممکن است مورد نیاز باشد
      fullName: linkData.fullName || '',
      phoneNumber: linkData.phoneNumber || '',
      phoneRequired: linkData.phoneRequired || '',
      rewards: linkData.rewards || '',
      segments: linkData.segments || '',
      prizes: linkData.prizes || '',
      difficulty: linkData.difficulty || '',
      submitButtonText: linkData.submitButtonText || '',
      thankYouMessage: linkData.thankYouMessage || '',
      avatar: linkData.avatar || '',
      align: linkData.align || '',
      options: linkData.options || '',
      fileName: linkData.fileName || '',
      fileType: linkData.fileType || '',
      accountHolder: linkData.accountHolder || '',
      accountNumber: linkData.accountNumber || '',
      bankName: linkData.bankName || '',
      cardNumber: linkData.cardNumber || '',
      customBank: linkData.customBank || '',
      ibanNumber: linkData.ibanNumber || '',
      showBankDropdown: linkData.showBankDropdown || '',
      highlight: linkData.highlight || false,
      access: linkData.access || '',
      address: linkData.address || '',
      days: linkData.days || '',
      mode: linkData.mode || '',
      latitude: linkData.latitude || '',
      longitude: linkData.longitude || '',
      zoom: linkData.zoom || '',
      fields: linkData.fields || '',
      selectedItems: linkData.selectedItems || ''
    }
    
    // فقط اگر description معتبر باشد آن را اضافه کن
    if (linkData.description && linkData.description.trim() && linkData.description.trim() !== '') {
      payloadLink.description = linkData.description.trim()
    }
    
    // فقط اگر customIcon معتبر باشد آن را اضافه کن
    if (linkData.customIcon && linkData.customIcon.trim()) {
      payloadLink.customIcon = linkData.customIcon
    }
    
    console.log('Creating new link:', payloadLink)
    
    const response = await axios.post(`v1/cards/${cardId.value}/links`, {
      link: JSON.stringify(payloadLink)
    })
    
    if (response.data.success) {
      console.log('Link created successfully:', response.data.data)
      
      // اضافه کردن لینک جدید با ID از سرور به store (مطابق با تب لینک)
      const normalizedNewLink = form.normalizeLink ? 
        form.normalizeLink(response.data.data) : 
        response.data.data
      
      // مستقیماً به links اضافه کن تا id از سرور حفظ شود
      form.links.push(normalizedNewLink)
      
      // بروزرسانی iframe
      sendFormDataToIframe()
      
    } else {
      throw new Error(response.data.message || 'خطا در ایجاد لینک')
    }
    
  } catch (error) {
    console.error('Error creating link:', error)
    showInfoToast('خطا در ایجاد لینک', 'ti-alert-triangle')
  }
}

function editLink(link, index) {
  // باز کردن فرم ویرایش برای لینک
  
  // Map action names to icon names (for actions where icon name differs)
  const actionToIconMap = {
    'map': 'linkumap',
    'bank': 'card',
    'bankcard': 'card',
  }
  
  // Parse کردن icon اگر رشته JSON است
  let parsedIcon = link.icon
  if (typeof link.icon === 'string') {
    try {
      parsedIcon = JSON.parse(link.icon)
    } catch (e) {
      // اگر parse نشد، از action برای ساخت icon استفاده کن
      const actionLower = link.action?.toLowerCase()
      const iconName = actionToIconMap[actionLower] || actionLower
      parsedIcon = iconName ? { type: 'component', name: iconName, path: iconName } : null
    }
  }
  
  // اگر icon وجود نداره، از action بساز
  if (!parsedIcon && link.action) {
    const actionLower = link.action.toLowerCase()
    const iconName = actionToIconMap[actionLower] || actionLower
    parsedIcon = { type: 'component', name: iconName, path: iconName }
  }
  
  const editable = {
    ...link,
    icon: parsedIcon,
    type: link.type || (link.action?.includes('block') ? 'block' : 'link'),
    action: link.action?.toLowerCase() || 'basiclink',
    username: link.baseUrl && link.value?.startsWith(link.baseUrl)
        ? link.value.replace(link.baseUrl, '')
        : link.username || '',
  }

  // بررسی مقداردهی کامل
  if (!editable.title) editable.title = link.name || 'بدون عنوان'
  if (!editable.value) editable.value = ''

  editingLink.value = editable
  editingLinkIndex.value = index
  showEditSheet.value = true
}

function cancelEdit() {
  showEditSheet.value = false
  editingLink.value = null
  editingLinkIndex.value = -1
}

function getEditSheetTitle() {
  if (!editingLink.value) return 'ویرایش محتوا'
  const actionTitles = {
    basiclink: 'ویرایش لینک',
    email: 'ویرایش ایمیل',
    phone: 'ویرایش تلفن',
    whatsapp: 'ویرایش واتساپ',
    telegram: 'ویرایش تلگرام',
    instagram: 'ویرایش اینستاگرام',
    twitter: 'ویرایش توییتر',
    youtube: 'ویرایش یوتیوب',
    linkedin: 'ویرایش لینکدین',
    map: 'ویرایش نقشه',
    text: 'ویرایش متن',
    faq: 'ویرایش سوالات متداول',
    divider: 'ویرایش جداکننده',
    contact: 'ویرایش فرم تماس',
    payment: 'ویرایش پرداخت',
    file: 'ویرایش فایل',
  }
  const action = editingLink.value.action?.toLowerCase()
  return actionTitles[action] || 'ویرایش محتوا'
}

// تابع گرفتن عنوان مناسب برای نمایش در لیست محتوای اضافه شده
function getLinkDisplayTitle(link) {
  const defaultTitles = {
    'call': 'تماس',
    'number': 'پیامک', 
    'email': 'ایمیل',
    'whatsapp': 'واتساپ',
    'telegram': 'تلگرام',
    'instagram': 'اینستاگرام',
    'linkedin': 'لینکدین',
    'twitter': 'توییتر',
    'youtube': 'یوتیوب',
    'tiktok': 'تیک‌تاک',
    'facebook': 'فیسبوک',
    'snapchat': 'اسنپ‌چت',
    'threads': 'تردز',
    'twitch': 'توییچ',
    'rubika': 'روبیکا',
    'bale': 'بله',
    'eitaa': 'ایتا',
    'igap': 'آی‌گپ',
    'discord': 'دیسکورد',
    'map': 'نقشه',
    'address': 'آدرس',
    'poll': 'نظرسنجی',
    'questionbox': 'جعبه سوال',
    'expandabletext': 'متن بازشونده',
    'textsection': 'بخش متنی',
    'file': 'فایل',
    'bankcard': 'کارت بانکی',
    'workhours': 'ساعات کاری',
    'contactcard': 'کارت تماس',
    'embeddedvideo': 'ویدیو',
    'customlink': 'لینک سفارشی',
    'luckydice': 'تاس شانس',
    'luckywheel': 'گردونه شانس',
    'luckyegg': 'تخم مرغ شانس',
    'builder': 'فرم‌ساز',
    'spotify': 'اسپاتیفای',
    'soundcloud': 'ساندکلود',
    'aparat': 'آپارات',
    'virgool': 'ویرگول',
  }
  
  const action = link.action?.toLowerCase()
  
  // اگر title معتبر باشد (نه خالی و نه فقط عدد/شماره تلفن)
  if (link.title && link.title.trim()) {
    const trimmedTitle = link.title.trim()
    // اگر title فقط عدد نیست یا خیلی طولانی نیست (احتمالاً شماره تلفن)
    if (!/^\+?[\d\s-]{8,20}$/.test(trimmedTitle) && !/^[\d]+$/.test(trimmedTitle)) {
      return trimmedTitle
    }
  }
  
  // اگر name معتبر باشد
  if (link.name && link.name.trim()) {
    return link.name.trim()
  }
  
  // برگرداندن عنوان پیش‌فرض بر اساس action
  if (action && defaultTitles[action]) {
    return defaultTitles[action]
  }
  
  return 'بدون عنوان'
}

// تابع دریافت URL لینک برای نمایش در هدر
function getEditLinkUrl(link) {
  if (!link) return null
  
  // آیتم‌های بلاکی که لینک خارجی ندارند
  const blockActions = [
    'bankcard', 'workhours', 'embeddedvideo', 'file', 'poll', 
    'textsection', 'questionbox', 'expandabletext', 'builder',
    'luckydice', 'luckywheel', 'luckyegg', 'contactcard'
  ]
  
  if (link.action && blockActions.includes(link.action.toLowerCase())) {
    return null
  }
  
  // اگر baseUrl و username داره (اولویت اول)
  if (link.baseUrl && link.username) {
    return link.baseUrl + link.username
  }
  
  // برای لینک‌های اجتماعی با username
  if (link.username && link.action) {
    const baseUrls = {
      telegram: 'https://t.me/',
      instagram: 'https://instagram.com/',
      twitter: 'https://x.com/',
      youtube: 'https://youtube.com/',
      linkedin: 'https://linkedin.com/in/',
      tiktok: 'https://www.tiktok.com/@',
      whatsapp: 'https://wa.me/',
      facebook: 'https://facebook.com/',
      threads: 'https://www.threads.net/@',
      snapchat: 'https://snapchat.com/add/',
      twitch: 'https://twitch.tv/',
      rubika: 'https://rubika.ir/',
      bale: 'https://ble.ir/',
      eitaa: 'https://eitaa.com/',
    }
    const base = baseUrls[link.action.toLowerCase()]
    if (base) return base + link.username
  }
  
  // اگر لینک مستقیم داره
  if (link.value && (link.value.startsWith('http') || link.value.startsWith('mailto:') || link.value.startsWith('tel:'))) {
    return link.value
  }
  
  // اگر فقط value داره و یک URL معتبر نیست، null برگردون
  return null
}

function getEditComponent(item) {
  if (!item || !item.action) return EditForms.basiclink
  const action = item.action.toLowerCase()

  // اگر کلید دقیقاً وجود داشت
  if (Object.prototype.hasOwnProperty.call(EditForms, action)) {
    return EditForms[action]
  }

  // اگر کلید با یکی از فرم‌ها match کند
  const altKey = Object.keys(EditForms).find(k => k.toLowerCase() === action)
  if (altKey) {
    return EditForms[altKey]
  }

  // پیش‌فرض: basiclink
  return EditForms.basiclink
}

async function saveEditedLink(updatedItem) {
  const item = {...updatedItem}
  if (item.baseUrl && item.username) {
    item.value = item.baseUrl + item.username
  }
  
  if (!item.id) return

  try {
    const nuxtApp = useNuxtApp()
    const axios = nuxtApp.$axios
    
    const payloadLink = {
      backgroundImage: item.backgroundImage ?? '',
      phoneRequired: item.phoneRequired ?? '',
      rewards: item.rewards ?? '',
      segments: item.segments ?? '',
      prizes: item.prizes ?? '',
      difficulty: item.difficulty ?? '',
      submitButtonText: item.submitButtonText ?? '',
      thankYouMessage: item.thankYouMessage ?? '',
      avatar: item.avatar ?? '',
      align: item.align ?? '',
      options: item.options ?? '',
      fileName: item.fileName ?? '',
      fileType: item.fileType ?? '',
      accountHolder: item.accountHolder ?? '',
      accountNumber: item.accountNumber ?? '',
      bankName: item.bankName ?? '',
      cardNumber: item.cardNumber ?? '',
      customBank: item.customBank ?? '',
      ibanNumber: item.ibanNumber ?? '',
      showBankDropdown: item.showBankDropdown ?? '',
      highlight: item.highlight ?? false,
      access: item.access ?? '',
      address: item.address ?? '',
      days: item.days ?? '',
      mode: item.mode ?? '',
      latitude: item.latitude ?? '',
      longitude: item.longitude ?? '',
      zoom: item.zoom ?? '',
      action: item.action ?? '',
      fields: item.fields ?? "",
      baseUrl: item.baseUrl ?? '',
      customIcon: item.customIcon ?? '',
      description: item.description ?? '',
      enabled: item.enabled,
      icon: item.icon 
        ? (typeof item.icon === 'string' ? item.icon : JSON.stringify(item.icon)) 
        : (item.action ? JSON.stringify({ type: 'component', name: item.action }) : null),
      id: item.id,
      name: item.name,
      username: item.username ?? '',
      selectedItems: item.selectedItems ?? '',
      placeholder: item.placeholder ? JSON.stringify(item.placeholder) : null,
      showDescription: item.showDescription ?? false,
      title: item.title,
      type: item.type,
      value: item.value ?? '',
    }

    const response = await axios.put(`v1/cards/${cardId.value}/links/${item.id}/update`, {link: JSON.stringify(payloadLink)})

    if (response.data?.success) {
      // به‌روزرسانی لینک در store محلی
      const idx = form.links.findIndex(l => l.id === item.id)
      if (idx !== -1) {
        // Parse کردن icon از response اگر رشته است
        const responseData = response.data.data || {}
        if (typeof responseData.icon === 'string') {
          try {
            responseData.icon = JSON.parse(responseData.icon)
          } catch (e) {
            responseData.icon = item.icon
          }
        }
        // اگر icon نداره، از item استفاده کن
        if (!responseData.icon) {
          responseData.icon = item.icon
        }
        
        form.links[idx] = {...item, ...responseData}
        form.links = [...form.links]
      }
      
      // بستن مودال ویرایش
      showEditSheet.value = false
      editingLink.value = null
      editingLinkIndex.value = -1
      
      sendFormDataToIframe()
      showInfoToast(response.data.message || 'لینک با موفقیت ویرایش شد', 'ti-check')
    } else {
      showInfoToast(response.data.message || 'خطا در ویرایش لینک', 'ti-alert-triangle')
    }
  } catch (error) {
    if (error.response) {
      showInfoToast(error.response.data.message || 'خطا در ویرایش لینک', 'ti-alert-triangle')
    } else {
      showInfoToast('مشکلی در ارتباط با سرور وجود دارد', 'ti-alert-triangle')
    }
  }
}

function removeLink(index) {
  // حذف لینک از store و سرور
  if (form.links && form.links.length > index) {
    const linkToRemove = form.links[index]
    
    // اگر لینک id داره، از سرور حذف کن
    if (linkToRemove.id && cardId.value) {
      deleteLinkFromServer(linkToRemove.id, index)
    } else {
      // لینک هنوز ذخیره نشده، فقط از UI حذف کن
      form.links.splice(index, 1)
      sendFormDataToIframe()
      showInfoToast('لینک حذف شد', 'ti-check')
    }
  }
}

// تابع حذف لینک از سرور
async function deleteLinkFromServer(linkId, index) {
  if (!cardId.value || !linkId) {
    console.warn('No cardId or linkId available for deletion')
    // حذف از UI حتی اگر سرور نداریم
    if (form.links && form.links.length > index) {
      form.links.splice(index, 1)
      sendFormDataToIframe()
      showInfoToast('لینک حذف شد', 'ti-check')
    }
    return
  }
  
  try {
    const nuxtApp = useNuxtApp()
    const axios = nuxtApp.$axios
    
    console.log('Deleting link:', linkId)
    
    const response = await axios.delete(`v1/cards/${cardId.value}/links/${linkId}/delete`)
    
    if (response.data.success) {
      console.log('Link deleted successfully')
      
      // حذف از store محلی
      if (form.links && form.links.length > index) {
        form.links.splice(index, 1)
      }
      
      // بروزرسانی iframe
      sendFormDataToIframe()
      
      showInfoToast('لینک حذف شد', 'ti-check')
    } else {
      // حتی اگر سرور موفق نبود، از UI حذف کن
      if (form.links && form.links.length > index) {
        form.links.splice(index, 1)
      }
      sendFormDataToIframe()
      showInfoToast('لینک حذف شد', 'ti-check')
    }
    
  } catch (error) {
    console.error('Error deleting link:', error)
    // حتی در صورت خطا، از UI حذف کن
    if (form.links && form.links.length > index) {
      form.links.splice(index, 1)
    }
    sendFormDataToIframe()
    showInfoToast('لینک حذف شد', 'ti-check')
  }
}

// توابع drag & drop
function onDragEnd(evt) {
  isDragging.value = false
  
  // در صورت تغییر ترتیب، همه لینک‌ها را به‌روزرسانی کن
  if (evt.oldIndex !== evt.newIndex) {
    // ذخیره ترتیب جدید در سرور
    saveLinksOrder()
    
    sendFormDataToIframe()
    showInfoToast('ترتیب لینک‌ها تغییر کرد', 'ti-arrows-move')
  }
}

// تابع ذخیره ترتیب لینک‌ها
async function saveLinksOrder() {
  if (!cardId.value || !form.links || form.links.length === 0) {
    return
  }
  
  try {
    const nuxtApp = useNuxtApp()
    const axios = nuxtApp.$axios
    
    // ارسال ترتیب با hash (API با hash کار می‌کنه)
    const hashOrder = form.links.map(link => link.hash)
    
    console.log('Saving links order by hash:', hashOrder)
    
    const response = await axios.post(`v1/cards/${cardId.value}/links/reorder`, {
      hashOrder: hashOrder
    })
    
    if (response.data.success) {
      console.log('Links order saved successfully')
    } else {
      throw new Error(response.data.message || 'خطا در ذخیره ترتیب لینک‌ها')
    }
    
  } catch (error) {
    console.error('Error saving links order:', error)
    // اگر endpoint ترتیب‌دهی وجود ندارد، از روش کلی استفاده کن
    saveLinksToServer()
  }
}

// توابع آیکون
function getIconComponent(link) {
  // استفاده از همان سیستم که در LinkItem استفاده می‌شود
  const iconData = link.icon || null
  if (iconData && typeof iconData === 'object') {
    return getIconComponentFromMap(iconData)
  }
  return null
}

function getSafeIconUrl(link) {
  // بررسی آیکون URL
  return getSafeIcon(link)
}

function getFallbackIcon(link) {
  // آیکون پیش‌فرض بر اساس نوع لینک (همان getIconName قبلی)
  const iconMap = {
    // اطلاعات تماس
    'call': 'phone',
    'number': 'message',
    'email': 'mail',
    'telegram': 'brand-telegram',
    'whatsapp': 'brand-whatsapp',
    'eitaa': 'brand-telegram',
    'contactcard': 'id-badge-2',
    'address': 'map-pin',
    'facetime': 'video',
    'map': 'map',
    
    // شبکه‌های اجتماعی
    'instagram': 'brand-instagram',
    'facebook': 'brand-facebook',
    'tiktok': 'brand-tiktok',
    'twitter': 'brand-twitter',
    'x': 'brand-x',
    'linkedin': 'brand-linkedin',
    'youtube': 'brand-youtube',
    'aparat': 'video',
    'discord': 'brand-discord',
    'snapchat': 'brand-snapchat',
    'pinterest': 'brand-pinterest',
    'threads': 'brand-threads',
    'clubhouse': 'microphone',
    'twitch': 'brand-twitch',
    'rubika': 'message-circle',
    'bale': 'message-circle',
    'igap': 'message-circle',
    'medium': 'brand-medium',
    'virgool': 'article',
    
    // کسب و کار
    'website': 'world',
    'app_link': 'apps',
    'github': 'brand-github',
    'booksy': 'calendar',
    'calendly': 'calendar-event',
    'card': 'credit-card',
    'chili': 'chili',
    'etsy': 'shopping-bag',
    'reviews': 'star',
    'review': 'star',
    'square': 'square',
    'yelp': 'star',
    'divar': 'home',
    'snapp': 'car',
    'nshan': 'map',
    'neshan': 'map',
    'balad': 'map-pin',
    'figma': 'brand-figma',
    'googlemeet': 'video',
    'teams': 'brand-teams',
    'zoom': 'video',
    'trustpilot': 'star',
    'zillow': 'home',
    
    // پرداخت
    'cashapp': 'currency-dollar',
    'paypal': 'brand-paypal',
    'zelle': 'currency-dollar',
    'remit': 'currency-dollar',
    'reymit': 'currency-dollar',
    'zarinpal': 'credit-card',
    'trustwallet': 'wallet',
    
    // محتوا
    'customlink': 'external-link',
    'dropdown': 'chevron-down',
    'embeddedvideo': 'player-play',
    'featured': 'star',
    'featuredlink': 'star',
    'file': 'file',
    'textsection': 'file-text',
    'text-section': 'file-text',
    'poll': 'chart-bar',
    'questionbox': 'help-circle',
    
    // موزیک
    'hoobe': 'music',
    'linktree': 'tree',
    'opensea_color': 'palette',
    'podcasts': 'microphone',
    'poshmark': 'shopping-bag',
    'spotify': 'brand-spotify',
    'youtube_music': 'music',
    'apple_music': 'music',
    
    // فرم و بازی
    'luckyegg': 'egg',
    'luckydice': 'dice',
    'luckywheel': 'wheel',
    'form': 'forms'
  }
  
  return iconMap[link.action] || 'link'
}

// تابع ذخیره لینک‌ها در سرور
async function saveLinksToServer() {
  if (!cardId.value) {
    console.warn('No cardId available for saving links')
    return
  }
  
  try {
    const nuxtApp = useNuxtApp()
    const axios = nuxtApp.$axios
    
    // استفاده از همان endpoint که در تب لینک استفاده می‌شود
    const formData = new FormData()
    
    // ارسال لینک‌ها به سرور با فرمت صحیح
    const linksToSave = form.links ? form.links.map(link => {
      const cleanedLink = {
        ...link,
        // اطمینان از وجود فیلدهای ضروری
        id: link.id || Date.now() + '_' + Math.random(),
        title: link.title || link.name || '',
        action: link.action || 'customlink',
        url: link.url || '',
        enabled: link.enabled !== undefined ? link.enabled : true,
        icon: link.icon || null,
        customIcon: link.customIcon || null,
        isListMode: link.isListMode !== undefined ? link.isListMode : true
      }
      
      // فقط در صورت وجود description معتبر آن را اضافه کن
      if (link.description && link.description.trim() && link.description.trim() !== '') {
        cleanedLink.description = link.description.trim()
      }
      // در غیر این صورت description اصلاً ارسال نمی‌شود
      
      return cleanedLink
    }) : []
    
    formData.append('linksDataList', JSON.stringify(linksToSave))
    
    console.log('Saving links to server:', linksToSave)
    
    const response = await axios.post(`v1/cards/${cardId.value}/update`, formData, {
      headers: {'X-HTTP-Method-Override': 'PUT'}
    })
    
    if (response.data.success) {
      console.log('Links saved successfully')
      // بروزرسانی iframe
      sendFormDataToIframe()
    } else {
      throw new Error(response.data.message || 'خطا در ذخیره لینک‌ها')
    }
    
  } catch (error) {
    console.error('Error saving links:', error)
    showInfoToast('خطا در ذخیره لینک‌ها', 'ti-alert-triangle')
  }
}

// تابع ذخیره تک لینک (مشابه تب لینک)
async function saveSingleLink(link) {
  if (!cardId.value || !link.id) {
    console.warn('No cardId or linkId available')
    return false
  }
  
  try {
    const nuxtApp = useNuxtApp()
    const axios = nuxtApp.$axios
    
    const payloadLink = {
      action: link.action || '',
      baseUrl: link.baseUrl || '',
      customIcon: link.customIcon || '',
      description: link.description || '',
      enabled: link.enabled,
      icon: link.icon ? JSON.stringify(link.icon) : null,
      id: link.id,
      name: link.name,
      title: link.title,
      type: link.type,
      value: link.value || '',
      username: link.username || '',
      placeholder: link.placeholder ? JSON.stringify(link.placeholder) : null,
      showDescription: link.showDescription || false,
      isListMode: link.isListMode !== undefined ? link.isListMode : true
    }
    
    const response = await axios.put(`v1/cards/${cardId.value}/links/${link.id}/update`, {
      link: JSON.stringify(payloadLink)
    })
    
    if (response.data.success) {
      console.log('Single link saved successfully')
      return true
    } else {
      throw new Error(response.data.message || 'خطا در ذخیره لینک')
    }
    
  } catch (error) {
    console.error('Error saving single link:', error)
    showInfoToast('خطا در ذخیره لینک', 'ti-alert-triangle')
    return false
  }
}

function getLinkTypeLabel(action) {
  // برچسب نوع لینک (هماهنگ با data.ts)
  const labels = {
    // اطلاعات تماس
    'call': 'تماس',
    'number': 'پیام',
    'email': 'ایمیل',
    'telegram': 'تلگرام',
    'whatsapp': 'واتساپ',
    'eitaa': 'ایتا',
    'contactcard': 'کارت تماس',
    'address': 'آدرس',
    'facetime': 'فیس‌تایم',
    'map': 'نقشه',
    
    // شبکه‌های اجتماعی
    'instagram': 'اینستاگرام',
    'facebook': 'فیسبوک',
    'tiktok': 'تیک‌تاک',
    'twitter': 'تویتر',
    'x': 'ایکس',
    'linkedin': 'لینکدین',
    'youtube': 'یوتیوب',
    'aparat': 'آپارات',
    'discord': 'دیسکورد',
    'snapchat': 'اسنپچت',
    'pinterest': 'پینترست',
    'threads': 'تردز',
    'clubhouse': 'کلاب‌هاوس',
    'twitch': 'تویچ',
    'rubika': 'روبیکا',
    'bale': 'بله',
    'igap': 'آیگپ',
    'medium': 'مدیوم',
    'virgool': 'ویرگول',
    
    // کسب و کار
    'website': 'وبسایت',
    'app_link': 'لینک اپ',
    'github': 'گیت‌هاب',
    'booksy': 'بوکسی',
    'calendly': 'تقویم',
    'card': 'کارت بانکی',
    'etsy': 'فروشگاه',
    'reviews': 'نظرات',
    'review': 'نظر',
    'divar': 'دیوار',
    'snapp': 'اسنپ',
    'nshan': 'نشان',
    'neshan': 'نشان',
    'balad': 'بلد',
    'figma': 'فیگما',
    'googlemeet': 'گوگل میت',
    'teams': 'تیمز',
    'zoom': 'زوم',
    
    // پرداخت
    'cashapp': 'کش اپ',
    'paypal': 'پی‌پال',
    'zelle': 'زل',
    'remit': 'رمیت',
    'reymit': 'رمیت',
    'zarinpal': 'زرین‌پال',
    'trustwallet': 'تراست والت',
    
    // محتوا
    'customlink': 'لینک سفارشی',
    'dropdown': 'لیست کشویی',
    'embeddedvideo': 'ویدئو',
    'featured': 'ویژه',
    'featuredlink': 'لینک ویژه',
    'file': 'فایل',
    'textsection': 'متن',
    'text-section': 'متن',
    'poll': 'نظرسنجی',
    'questionbox': 'صندوق پرسش',
    
    // موزیک
    'hoobe': 'هوبه',
    'linktree': 'لینک‌تری',
    'opensea_color': 'اوپن‌سی',
    'podcasts': 'پادکست',
    'spotify': 'اسپاتیفای',
    'youtube_music': 'یوتیوب موزیک',
    'apple_music': 'اپل موزیک',
    
    // فرم و بازی
    'luckyegg': 'تخم شانس',
    'luckydice': 'تاس شانس',
    'luckywheel': 'گردونه شانس',
    'form': 'فرم'
  }
  
  return labels[action] || 'لینک'
}

function handleLayoutChange(layout) {
}

async function handleLayoutConfirm(layout) {
  try {
    // Update local stores first
    if (formStore.value) {
      formStore.value.layout = layout
    }
    form.layout = layout
    
    // Save to API if cardId exists
    if (props.cardId) {
      const formData = new FormData()
      formData.append('layoutMode', layout)
      
      // Also save current theme colors if they exist  
      if (form.themeColor) {
        formData.append('themeColor', JSON.stringify(form.themeColor))
      }
      if (form.iconColor) {
        formData.append('iconColor', JSON.stringify(form.iconColor))
      }
      
      const nuxtApp = useNuxtApp()
      const axios = nuxtApp.$axios
      const response = await axios.post(`v1/cards/${props.cardId}/update`, formData, {
        headers: {'X-HTTP-Method-Override': 'PUT'}
      })
      
      if (response.data.success) {
        showInfoToast('چیدمان با موفقیت ذخیره شد', 'ti-check')
      } else {
        throw new Error(response.data.message || 'خطا در ذخیره چیدمان')
      }
    } else {
      showInfoToast('چیدمان تغییر کرد', 'ti-check')
    }
    
  } catch (error) {
    showInfoToast('خطا در ذخیره چیدمان', 'ti-alert-triangle')
  }
}

function goBack() {
  // اگر در حال ویرایش لینک هستیم، اول فرم ادیت رو ببند
  if (editingLink.value) {
    cancelEdit()
    return
  }
  
  // بررسی PWA standalone mode
  const isStandalone = window.matchMedia('(display-mode: standalone)').matches || 
                       (window.navigator).standalone === true
  
  // در PWA اگر history کم است، به dashboard برو بجای back
  if (isStandalone) {
    // در PWA همیشه به dashboard برو تا از اپ خارج نشه
    window.location.href = '/dashboard'
  } else if (window.history.length > 2) {
    window.history.back()
  } else {
    window.location.href = '/dashboard'
  }
}

function goToLeadCapture() {
  console.log('goToLeadCapture clicked!')
  window.location.href = '/profile/lead-capture'
}

// Save state
const isSaving = ref(false)

const saveChanges = () => {
  isSaving.value = true
  const saveEvent = new CustomEvent('manual-save', {
    detail: { source: 'header-save' }
  })
  window.dispatchEvent(saveEvent)
  
  setTimeout(() => {
    isSaving.value = false
    showInfoToast('تغییرات با موفقیت ذخیره شد', 'ti-check')
  }, 2000)
}

// Iframe
const {$axios} = useNuxtApp()
const iframeRef = ref(null)
const iframeKey = ref(0)
const showPreviewMobile = ref(false)
const isIframeLoading = ref(true)
const isIframeReady = ref(false)

const previewUrl = computed(() => {
  if (typeof window === 'undefined') return 'about:blank'

  const params = new URLSearchParams()
  params.set('t', Date.now().toString())
  params.set('cardId', String(cardId.value))
  params.set('isDefault', '1')
  const slug = props.cardSlug || 'editCard'

  return `${window.location.origin}/preview/${slug}?${params.toString()}`
})

const onIframeLoad = () => {
  isIframeLoading.value = false
}

const sendFormDataToIframe = () => {
  if (!process.client || !isIframeReady.value || !iframeRef.value?.contentWindow) return
  
  try {
    // Use toRaw to avoid RefImpl serialization issues
    const rawFormData = toRaw(form.$state)
    iframeRef.value.contentWindow.postMessage({
      type: 'FORM_DATA_UPDATE',
      data: JSON.parse(JSON.stringify(rawFormData))
    }, window.location.origin)
  } catch (error) {
  }
}

const handleIframeMessage = (event) => {
  if (!process.client) return
  if (event.origin !== window.location.origin) return

  if (event.data?.type === 'IFRAME_READY') {
    isIframeReady.value = true
    sendFormDataToIframe()
  }
}

// Lifecycle
onMounted(async () => {
  if (process.client) {
    window.addEventListener('message', handleIframeMessage)
    
    // Load card data and layout from API
    const resolvedCardId = cardId.value
    if (resolvedCardId) {
      try {
        
        // Set card data in form store
        await form.setAboutFrom(resolvedCardId)
      } catch (error) {
        console.error('Error loading card:', error)
      }
    } else {
      // Try to get default card if available
      if (formStore.cards && formStore.cards.length > 0) {
        const defaultCard = formStore.defaultCard || formStore.cards[0]
        if (defaultCard?.id) {
          await form.setAboutFrom(defaultCard.id)
        }
      }
    }
    
    // Hide loading after data is loaded
    setTimeout(() => {
      isPageLoading.value = false
    }, 300)
  }
})

// Watch for form changes to send real-time updates to preview
watch(() => form.$state, () => {
  if (process.client) {
    sendFormDataToIframe()
  }
}, { deep: true })

watch(() => form.cards, (c) => {
  if (process.client) {
    form.setAboutFrom(String(cardId.value))
  }
}, {immediate: true})

// همگام‌سازی لینک‌ها بین stores
watch(() => form.links, (newLinks) => {
  if (formStore.value) {
    formStore.value.links = newLinks || []
  }
}, { deep: true, immediate: true })

// ذخیره تغییرات سوئیچ فرم لید
watch(() => form.isLeadCaptureEnabled, async (newValue, oldValue) => {
  console.log('Lead capture watch triggered:', { newValue, oldValue, cardId: cardId.value })
  
  // اطمینان از اینکه تغییر واقعی رخ داده
  if (newValue === oldValue) {
    console.log('No change in lead capture value, skipping')
    return
  }
  
  if (cardId.value) {
    try {
      const nuxtApp = useNuxtApp()
      const axios = nuxtApp.$axios
      
      console.log('Saving lead capture mode:', newValue, 'for card:', cardId.value)
      
      const formData = new FormData()
      formData.append('leadCaptureMode', newValue ? '1' : '0')
      
      const response = await axios.post(`v1/cards/${cardId.value}/update`, formData, {
        headers: {'X-HTTP-Method-Override': 'PUT'}
      })
      
      if (response.data.success) {
        console.log('فرم لید با موفقیت ذخیره شد:', newValue)
        showInfoToast(newValue ? 'فرم لید فعال شد' : 'فرم لید غیرفعال شد', 'ti-check')
      } else {
        throw new Error(response.data.message || 'خطا در ذخیره فرم لید')
      }
    } catch (error) {
      console.error('Error saving lead capture setting:', error)
      showInfoToast('خطا در ذخیره تنظیمات فرم', 'ti-alert-triangle')
      
      // بازگرداندن به حالت قبلی در صورت خطا
      setTimeout(() => {
        form.isLeadCaptureEnabled = oldValue
      }, 100)
    }
  } else {
    console.warn('No cardId available for saving lead capture setting')
    showInfoToast('خطا: شناسه کارت موجود نیست', 'ti-alert-triangle')
    
    // بازگرداندن به حالت قبلی
    setTimeout(() => {
      form.isLeadCaptureEnabled = oldValue
    }, 100)
  }
})

onUnmounted(() => {
  if (process.client) {
    window.removeEventListener('message', handleIframeMessage)
  }
})
</script>
<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.no-scrollbar::-webkit-scrollbar {
  display: none;
}

.no-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

/* استایل‌های drag & drop */
.ghost-item {
  opacity: 0.4;
  background: rgb(var(--primary) / 0.1);
  border: 2px dashed rgb(var(--primary) / 0.3);
  transform: scale(1.05);
  transition: all 0.2s ease;
}

.chosen-item {
  opacity: 0.8;
  transform: scale(1.02);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
  border: 2px solid rgb(var(--primary) / 0.5);
  z-index: 999;
}

.drag-item {
  opacity: 0.9;
  transform: rotate(2deg) scale(1.05);
  box-shadow: 0 15px 30px rgba(0, 0, 0, 0.2);
  transition: transform 0.2s ease;
}

.drag-handle {
  touch-action: none;
  user-select: none;
  -webkit-touch-callout: none;
}

.safe-area-top {
  padding-top: env(safe-area-inset-top, 0px);
}

/* انیمیشن برای hover */
.group:hover .drag-handle {
  animation: wiggle 0.8s ease-in-out;
}

@keyframes wiggle {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-2px); }
  50% { transform: translateX(2px); }
  75% { transform: translateX(-1px); }
}
</style>