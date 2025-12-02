<template>
  <div class="flex flex-col">
    <!-- 🔹 تب‌ها و دکمه ذخیره -->
    <div class="flex flex-col sm:flex-row gap-4 mb-6 p-2">
      <!-- تب‌ها -->
      <div class="grid grid-cols-2 gap-4 flex-1">
        <template v-for="(group, groupIndex) in tabGroups" :key="groupIndex">
          <div class="contents">
            <button
                v-for="tab in group.items"
                :key="tab.id"
                class="flex items-center gap-1.5 px-3 py-3 rounded-md transition-all text-sm w-full justify-center"
                :class="{
                'bg-black text-white shadow-sm': activeTab === tab.id,
                'text-gray-700 hover:bg-gray-100 bg-white': activeTab !== tab.id,
                'opacity-50 cursor-not-allowed': !canAccessTab(tab.id)
              }"
                :disabled="!canAccessTab(tab.id)"
                @click="changeTab(tab.id)"
            >
              <i :class="tab.icon" class="text-base"/>
              <span>{{ tab.label }}</span>
            </button>
          </div>
        </template>
      </div>

    </div>

    <!-- 🔹 محتوای اصلی -->
    <div class="w-full grid grid-cols-1 lg:grid-cols-6 gap-4">
      <!-- فرم و تنظیمات -->
      <div class="lg:col-span-4">
        <component
            :is="currentTabComponent"
            v-model:form="formStore"
            :is-add-mode="true"
            @update:settings="updateQrSettings"
            @open-preview="showPreviewMobile = true"
            @go-to-next-step="changeTab('links',$event)"
            class="bg-white p-4 rounded-lg mb-16"
        />
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
                <!-- Loading spinner -->


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
        <div class="bg-white w-full h-full rounded-t-2xl p-4 overflow-y-auto shadow-xl flex flex-col">
          <div class="flex justify-between items-center mb-4 flex-shrink-0">
            <h2 class="text-base font-semibold">پیش‌نمایش</h2>
            <button
                @click="showPreviewMobile = false"
                class="text-gray-400 hover:text-black"
            >
              <i class="ti ti-x"/>
            </button>
          </div>

          <div class="w-full" style="height: calc(100vh - 120px);">
            <div class="w-full h-full relative overflow-hidden rounded-lg">
              <!-- Loading spinner برای موبایل -->
              <div
                  v-if="isIframeLoading"
                  class="absolute inset-0 flex items-center justify-center bg-gray-50 rounded-lg z-10"
              >
                <div class="flex flex-col items-center space-y-2">
                  <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                  <span class="text-sm text-gray-600">در حال بارگذاری...</span>
                </div>
              </div>

              <ClientOnly>
                <iframe
                    ref="iframeRef"
                    :key="`iframe-mobile-${iframeKey}`"
                    :src="previewUrl"
                    class="w-full h-full border-0 rounded-lg overflow-hidden"
                    sandbox="allow-scripts allow-forms allow-same-origin allow-popups"
                    loading="lazy"
                    @load="onIframeLoad"
                />
                <template #fallback>
                  <div class="w-full h-full bg-gray-100 rounded-lg flex items-center justify-center">
                    <div class="text-gray-500">در حال بارگذاری...</div>
                  </div>
                </template>
              </ClientOnly>
            </div>
          </div>
        </div>
      </div>
    </transition>
  </div>
  <InfoToast :visible="showToast" :message="toastMessage" :icon="toastIcon"/>
</template>

<script setup>
import {ref, computed, watch, onMounted, onUnmounted} from 'vue'
import {useFormStore} from '~/stores/form'
import TabAbout from './tabs/TabAbout.vue'
import TabLinks from './tabs/TabLinks.vue'
import InfoToast from "~/components/UserDashboard/modals/InfoToast.vue";
// استفاده از form store
const formStore = useFormStore()
const showToast = ref(false)
const toastMessage = ref('')
const toastIcon = ref('ti-alert-triangle') // یا 'ti-lock', 'ti-check', هر چی خواستی
const showInfoToast = (message, icon = 'ti-lock') => {
  toastMessage.value = message
  toastIcon.value = icon
  showToast.value = true
  setTimeout(() => showToast.value = false, 3000) // بعد از ۳ ثانیه بسته می‌شه
}
// تب فعال - شروع با About
const activeTab = ref('about')

// وضعیت ذخیره
const isSaving = ref(false)

// تب‌ها و گروه‌بندی‌ها - فقط About و Links برای AddCard
const tabGroups = [
  {
    id: 1,
    items: [
      {id: 'about', label: 'درباره', icon: 'ti ti-user'},
      {id: 'links', label: 'لینک‌ها', icon: 'ti ti-link'}
    ]
  }
]

// کامپوننت تب فعال
const currentTabComponent = computed(() => {
  const components = {
    about: TabAbout,
    links: TabLinks
  }
  return components[activeTab.value] || TabAbout
})

// بررسی تکمیل بودن تب About
const isAboutComplete = computed(() => {
  const name = formStore.name?.trim()
  if (!name || name.length === 0) return false
  if (name.length < 2) return false
  if (name.length > 40) return false

  // بررسی pattern حروف
  const namePattern = /^[آ-یa-zA-Z\s]+$/
  return namePattern.test(name)
})

// بررسی اعتبار کل فرم
const isFormValid = computed(() => {
  return isAboutComplete.value
})

// بررسی امکان دسترسی به تب - برای AddCard
const canAccessTab = (tabId) => {
  if (tabId === 'about') return true
  if (tabId === 'links') return isAboutComplete.value
  return false
}

// URL پیش‌نمایش برای iframe
const previewUrl = computed(() => {
  if (typeof window === 'undefined') return 'about:blank'

  const params = new URLSearchParams()
  params.set('t', Date.now().toString())

  const slug = 'newCard'

  return `${window.location.origin}/preview/${slug}?${params.toString()}`
})

// تغییر تب
const changeTab = (tabId, msg) => {
  if (!canAccessTab(tabId)) return
  if(msg){
    showInfoToast(msg, 'ti-check')
  }
  activeTab.value = tabId
}

// به‌روزرسانی تنظیمات QR (برای سازگاری)
const updateQrSettings = (settings) => {
  // reserved for future use
}

// مدیریت iframe
const isIframeLoading = ref(true)
const isIframeReady = ref(false)
const iframeKey = ref(0)
const iframeRef = ref(null)
const showPreviewMobile = ref(false)

// مدیریت پیام‌های iframe
const handleIframeMessage = (event) => {
  if (event.origin !== window.location.origin) return

  if (event.data?.type === 'IFRAME_READY') {
    isIframeReady.value = true

    // ارسال داده‌های اولیه به iframe
    if (iframeRef.value && iframeRef.value.contentWindow) {
      try {
        iframeRef.value.contentWindow.postMessage({
          type: 'FORM_DATA_UPDATE',
          data: JSON.parse(JSON.stringify(formStore.$state))
        }, window.location.origin)
      } catch (error) {
      }
    }
  }
}

const onIframeLoad = () => {
  isIframeLoading.value = false
}

// نظارت بر تغییرات formStore برای آپدیت iframe
watch(() => formStore.$state, (newState) => {
  if (isIframeReady.value && iframeRef.value && iframeRef.value.contentWindow) {
    try {
      iframeRef.value.contentWindow.postMessage({
        type: 'FORM_DATA_UPDATE',
        data: JSON.parse(JSON.stringify(newState))
      }, window.location.origin)
      return
    } catch (error) {
    }
  }

  // fallback: refresh iframe
  clearTimeout(iframeRefreshTimeout.value)
  iframeRefreshTimeout.value = setTimeout(() => {
    iframeKey.value++
    isIframeLoading.value = true
    isIframeReady.value = false
  }, 300)
}, {deep: true})

const iframeRefreshTimeout = ref(null)

// بارگذاری اولیه
onMounted(() => {
  // ریست کردن formStore برای کارت جدید
  formStore.$reset()

  // گوش دادن به پیام‌های iframe
  window.addEventListener('message', handleIframeMessage)
})

// cleanup هنگام unmount
onUnmounted(() => {
  window.removeEventListener('message', handleIframeMessage)
  clearTimeout(iframeRefreshTimeout.value)
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
</style>
