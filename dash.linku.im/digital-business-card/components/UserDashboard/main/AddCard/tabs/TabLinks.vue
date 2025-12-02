<template>
  <div>
    <!-- Header برای AddCard -->
    <div v-if="isAddMode && !editingItem" class="border-b">
      <div class="flex items-center justify-between p-4 w-full">
        <h1 class="text-xl font-semibold text-gray-700">لینک‌های اجتماعی</h1>
        <button v-if="isAddMode && !editingItem && formStore.links && formStore.links.length > 0"
                @click="showAddModal = true"
                class="bg-black text-white px-4 py-2 rounded text-sm hover:bg-gray-800 transition"
        >
          افزودن لینک
        </button>
      </div>
    </div>

    <!-- Header برای EditCard -->
    <div v-else-if="!editingItem" class="border-b">
      <div class="lg:flex lg:space-y-0 space-y-4 items-center justify-between p-4 w-full">
        <h1 class="text-xl font-semibold w-2/4">لینک‌ها </h1>
        <div class="lg:flex items-center  gap-2 lg:space-y-0 space-y-4 lg:w-2/4">
          <div class="flex items-center gap-4  lg:w-2/3">
            <FormSwitch label="جمع‌آوری لید" v-model="isLeadCaptureEnabled"/>
            <FormSwitch
                label="لینک تکی"
                v-model="singleLink"
            />
          </div>

          <div>
            <button
                @click="showAddModal = true"
                class="bg-black text-white px-4 py-2 rounded text-sm hover:bg-gray-800 transition lg:w-24 mt-0"
            >
              افزودن
            </button>
          </div>

        </div>
      </div>
    </div>

    <!-- لیست آیتم‌ها -->
    <div class="p-4">
      <div v-if="!editingItem">
        <div v-if="formStore.links && formStore.links.length > 0">
          <draggable
              v-model="formStore.links"
              :key="formStore.newCardId"
              item-key="id"
              handle=".drag-handle"
              class="space-y-3"
              :disabled="false"
              ghost-class="ghost"
              chosen-class="chosen"
              drag-class="drag"
              @start="onDragStart"
              @end="onDragEnd"
          >
            <template #item="{ element, index }">
              <LinkItem
                  :key="element.id"
                  :link="{ ...element, displayName: element.title || element.name, index: index }"
                  :count="getUsageCount(element.action)"
                  @edit="editItem"
                  @toggle="toggleItem"
                  @remove="deleteItem"
                  @select-as-single="selectAsSingleLink"
              />
            </template>
          </draggable>
        </div>

        <!-- Empty state when no links -->
        <div v-else class="text-center py-8 text-gray-500">
          <div class="mb-4">
            <i class="ti ti-link text-4xl text-gray-300"></i>
          </div>
          <p class="text-lg font-medium mb-2">هنوز لینکی اضافه نکرده‌اید</p>
          <p class="text-sm mb-4">لینک‌های شبکه‌های اجتماعی و وب‌سایت خود را اضافه کنید</p>
          <button
              @click="showAddModal = true"
              class="bg-black text-white px-6 py-3 rounded-md text-sm hover:bg-gray-800 transition font-medium"
          >
            <i class="ti ti-plus ml-1"></i>
            افزودن اولین لینک
          </button>
        </div>
      </div>

      <!-- فرم ویرایش -->
      <component
          v-else
          :is="getEditComponent(editingItem)"
          :link="editingItem"
          :cradId="formStore.newCardId"
          @cancel="cancelEdit"
          @submit="saveItem"
          @delete="() => deleteItem(editingItem.id)"
          @upload-icon="handleIconUpload"
      />
    </div>

    <!-- مودال افزودن -->
    <AddLinkModal
        v-if="showAddModal"
        :count-map="countMap"
        :cardId="formStore.newCardId"
        @close="showAddModal = false"
        @add-link="addNewItem"
    />

    <!-- دکمه ایجاد پروفایل جدید برای AddCard -->
    <div v-if="isAddMode" class="mt-8 pt-6 border-t">
      <div class="flex justify-between items-center">
        <div class="text-sm text-gray-600">
          <span>{{
              formStore.links && formStore.links.length > 0 ? `${formStore.links.length} لینک اضافه شده` : 'هنوز لینکی اضافه نشده'
            }}</span>
        </div>
      </div>
    </div>
  </div>
  <InfoToast :visible="showToast" :message="toastMessage" :icon="toastIcon"/>
</template>

<script setup>
import {ref, computed, onMounted, onUnmounted, provide, watch, nextTick} from 'vue'
import draggable from 'vuedraggable'
import {useFormStore, defaultFields} from '~/stores/form'
import {safeStorage} from '~/utils/safeStorage'
import LinkItem from '@/components/ui/LinkItem.vue'
import AddLinkModal from '@/components/UserDashboard/modals/AddLinkModal.vue'
import FormSwitch from '@/components/ui/FormSwitch.vue'
import * as EditForms from '@/components/ui/forms/edit'
import InfoToast from "~/components/UserDashboard/modals/InfoToast.vue";
import {useLinkStore} from "~/stores/link.js";

const props = defineProps({
  isAddMode: {
    type: Boolean,
    default: false
  }
})
const linkStore = useLinkStore()
const emit = defineEmits(['create-card'])
const {$axios} = useNuxtApp();
const formStore = useFormStore()
////Setting Toast
const showToast = ref(false)
const toastMessage = ref('')
const toastIcon = ref('ti-alert-triangle') // یا 'ti-lock', 'ti-check', هر چی خواستی
const showInfoToast = (message, icon = 'ti-lock') => {
  toastMessage.value = message
  toastIcon.value = icon
  showToast.value = true
  setTimeout(() => showToast.value = false, 3000) // بعد از ۳ ثانیه بسته می‌شه
}
// وضعیت‌های AddCard
const isSaving = ref(false)
const isFormValid = computed(() => {
  return !!(formStore.name && formStore.name.trim().length > 0)
})

function getUsageCount(action) {
  if (!action || !formStore.links) return 1
  return formStore.links.filter(l => l.action === action).length
}

const countMap = computed(() => {
  const map = {}
  const links = formStore.links || []

  for (const l of links) {
    // کلید گروه‌بندی — می‌تونی action یا name یا id یا هر چیز دیگر انتخاب کنی
    const key = String(l.action || l.id || 'unknown').toLowerCase()
    map[key] = (map[key] || 0) + 1
  }

  return map
})
// تابع ایجاد پروفایل
const createCard = () => {
  if (isSaving.value || !isFormValid.value) return
  emit('create-card')
}

// باقی کد EditCard...
const showAddModal = ref(false)
const editingItem = ref(null)
const categories = ref([])

// تابع بررسی اینکه آیا لینک از نوع basic است
function isBasicLink(link) {
  if (!link) return false;

  // لیست action های غیر basic که نمی‌توانند در single link استفاده شوند
  const nonBasicActions = [
    'poll',
    'expandabletext',
    'questionbox',
    'leadcapture',
    'form',
    'embeddedvideo',
    'map'
  ];

  // اگر action دارد و در لیست غیر basic است، false برگردان
  if (link.action && nonBasicActions.includes(link.action)) {
    return false;
  }

  // اگر توضیحات طولانی دارد، basic نیست
  if (link.description && String(link.description).trim().length > 0) {
    return false;
  }

  // در غیر این صورت basic است
  return true;
}

// provide تابع isBasicLink و singleLink برای LinkItem
provide('isBasicLink', isBasicLink)
provide('singleLink', computed(() => formStore.singleLink))

onMounted(async () => {
  try {
    if (!formStore.fields.length) {
      formStore.fields = JSON.parse(JSON.stringify(defaultFields))
    }

    // بررسی اگر لینک نداریم و شماره موبایل کاربر موجود است
    // می‌توانید شماره موبایل را از localStorage، auth store یا props دریافت کنید
    // فعلاً به عنوان مثال از localStorage استفاده می‌کنم
    let userPhone = null
    if (typeof window !== 'undefined') {
      userPhone = safeStorage.getItem('userPhoneNumber') || '09123456789' // شماره نمونه
    }

    // initializeWithPhoneNumber method doesn't exist - removed for now

    // تنظیم مقدار اولیه singleLink
    singleLink.value = formStore.singleLink
  } catch (error) {
  }
})

// Cleanup on unmount to prevent draggable errors
onUnmounted(() => {
  try {
    // Clear any refs that might be causing issues
    editingItem.value = null
    showAddModal.value = false
    isDragging.value = false

    // Force cleanup of any remaining drag operations
    if (window.Sortable) {
      // Clear any active sortable instances
      Object.keys(window.Sortable.active || {}).forEach(key => {
        try {
          if (window.Sortable.active[key]) {
            window.Sortable.active[key].destroy()
          }
        } catch (e) {
          // Ignore cleanup errors
        }
      })
    }
  } catch (error) {
    // Silently handle cleanup errors
  }
})

// راه‌حل جدید: استفاده از ref برای sync دو طرفه
const singleLink = ref(formStore.singleLink)

// نظارت بر تغییرات store
watch(() => formStore.singleLink, (newVal) => {
  singleLink.value = newVal
})

// نظارت بر تغییرات local ref
watch(singleLink, (newVal) => {
  if (newVal) {
    // بررسی اینکه آیا می‌توان single link را فعال کرد
    const canEnable = formStore.canEnableSingleLink()

    if (!canEnable) {
      // برگرداندن به حالت قبلی بدون ایجاد خطا
      nextTick(() => {
        singleLink.value = false
      })
      return
    }

    // اگر lead capture فعال باشد، آن را غیرفعال کن
    if (formStore.isLeadCaptureEnabled) {
      formStore.toggleLeadCapture(false)
    }
  }

  // تنظیم store
  formStore.singleLink = newVal
})

const isLeadCaptureEnabled = computed({
  get: () => formStore.isLeadCaptureEnabled,
  set: val => {
    formStore.toggleLeadCapture(val)
  }
})

function normalize(text) {
  return (text || '').toString().trim().toLowerCase()
}

function findItemAction(item) {
  for (const cat of categories.value) {
    for (const entry of cat.items || []) {
      const match =
          normalize(entry.id) === normalize(item.id) ||
          normalize(entry.name) === normalize(item.name) ||
          normalize(entry.title) === normalize(item.title)
      if (match) {
        return {action: entry.action?.toLowerCase() || null}
      }
    }
  }
  return {action: null}
}

function getEditComponent(item) {
  if (!item || !item.action) return EditForms.basiclink; // پیش‌فرض: basiclink
  const action = item.action.toLowerCase();

  // اگر کلید دقیقاً وجود داشت
  if (Object.prototype.hasOwnProperty.call(EditForms, action)) {
    return EditForms[action];
  }

  // اگر کلید با یکی از فرم‌ها match کند
  const altKey = Object.keys(EditForms).find(k => k.toLowerCase() === action);
  if (altKey) {
    return EditForms[altKey];
  }

  // اگر بخشی از کلید match کند
  const partialKey = Object.keys(EditForms).find(k => k.toLowerCase().includes(action));
  if (partialKey) {
    return EditForms[partialKey];
  }

  // پیش‌فرض: basiclink
  return EditForms.basiclink;
}

function editItem(item) {
  const editable = {
    ...item,
    type: item.type || (item.action?.includes('block') ? 'block' : 'link'),
    action: item.action?.toLowerCase() || findItemAction(item).action,
    username: item.baseUrl && item.value?.startsWith(item.baseUrl)
        ? item.value.replace(item.baseUrl, '')
        : item.username || '',
  };

  // بررسی مقداردهی کامل
  if (!editable.title) editable.title = item.name || 'بدون عنوان';
  if (!editable.value) editable.value = '';

  editingItem.value = editable;
}

function cancelEdit() {
  editingItem.value = null
}

async function saveItem(updatedItem) {

  const item = {...updatedItem}
  if (item.baseUrl && item.username) {
    item.value = item.baseUrl + item.username
  }
  // اگر id وجود ندارد، هیچ آیتمی اضافه نشود (در حالت ویرایش همیشه باید id باشد)
  if (!item.id) return

  //Set Api for update link to card
  const customIcon = item?.customIcon ?? null
  const fileData = item?.fileData ?? null
  const backgroundImage = item?.backgroundImage ?? null


  //Set Api for add link to card
  try {
    const payloadLink = {
      //backgroundImage: item.backgroundImage || '',
      phoneRequired: item.phoneRequired || '',
      rewards: item.rewards || '',
      segments: item.segments || '',
      prizes: item.prizes || '',
      difficulty: item.difficulty || '',
      submitButtonText: item.submitButtonText || '',
      thankYouMessage: item.thankYouMessage || '',
      avatar: item.avatar || '',
      align: item.align || '',
      options: item.options || '',
      fileName: item.fileName || '',
      fileType: item.fileType || '',
      accountHolder: item.accountHolder || '',
      accountNumber: item.accountNumber || '',
      bankName: item.bankName || '',
      cardNumber: item.cardNumber || '',
      customBank: item.customBank || '',
      ibanNumber: item.ibanNumber || '',
      showBankDropdown: item.showBankDropdown || '',
      highlight: item.highlight || false,
      access: item.access || '',
      address: item.address || '',
      days: item.days || '',
      mode: item.mode || '',
      latitude: item.latitude || '',
      longitude: item.longitude || '',
      zoom: item.zoom || '',
      action: item.action || '',
      fields: item.fields || "",
      baseUrl: item.baseUrl || '',
      //customIcon: item.customIcon || '',
      description: item.description || '',
      enabled: item.enabled,
      icon: item.icon ? JSON.stringify(item.icon) : null,
      id: item.id,
      name: item.name,
      username: item.username || '',
      selectedItems: item.selectedItems || '',
      placeholder: item.placeholder ? JSON.stringify(item.placeholder) : null,
      showDescription: item.showDescription || false,
      title: item.title,
      type: item.type,
      value: item.value || '',

    }

    const response = await $axios.post(`v1/cards/${formStore.newCardId}/links`, {link: JSON.stringify(payloadLink)});

    // Ensure response contains expected data
    if (!response.data?.success) {
      showInfoToast(response.data.message, 'ti-alert-triangle');
    } else {
      const normalized = normalizeLink(response.data.data)
      const idx = formStore.links.findIndex(l => l.id === response.data.data.id)
      if (idx !== -1) {
        formStore.links[idx] = normalized
      }
      editingItem.value = null
      showInfoToast(response.data.message, 'ti-alert-triangle');
      if (customIcon && typeof customIcon === 'string' && customIcon.startsWith('data:')) {
        const uploadResponse = await uploadCustomIcon(
            response.data?.data.id, response.data?.data.cardId
            , response.data?.data.modelType,
            customIcon)

        if (uploadResponse.data?.success && uploadResponse.data.data) {
          const idx = formStore.links.findIndex(l => l.id === response.data.data.id);
          if (idx !== -1) {
            formStore.links[idx].customIcon = uploadResponse.data.data;
            formStore.links = [...formStore.links]; // trigger reactivity
          }
        }
      }
      ////
      if (fileData && typeof fileData === 'string' && fileData.startsWith('data:')) {
        const uploadResponse = await uploadCustomIcon(
            response.data?.data.id, response.data?.data.cardId
            , response.data?.data.modelType,
            fileData, 'fileData')

        if (uploadResponse.data?.success && uploadResponse.data.data) {
          const idx = formStore.links.findIndex(l => l.id === response.data.data.id);
          if (idx !== -1) {
            formStore.links[idx].fileData = uploadResponse.data.data;
            formStore.links = [...formStore.links]; // trigger reactivity
          }
        }
      }
      ///
      if (backgroundImage && typeof backgroundImage === 'string' && backgroundImage.startsWith('data:')) {
        const uploadResponse = await uploadCustomIcon(
            response.data?.data.id, response.data?.data.cardId
            , response.data?.data.modelType,
            backgroundImage,'backgroundImage')

        if (uploadResponse.data?.success && uploadResponse.data.data) {
          const idx = formStore.links.findIndex(l => l.id === response.data.data.id);
          if (idx !== -1) {
            formStore.links[idx].backgroundImage = uploadResponse.data.data;
            formStore.links = [...formStore.links]; // trigger reactivity
          }
        }
      }
    }
  } catch (error) {
    if (error.response) {
      // Show backend error message if available
      showInfoToast(error.response.data.message, 'ti-alert-triangle');
    } else {
      showInfoToast('مشکلی در ارتباط با سرور وجود دارد. لطفاً بعداً امتحان کنید.', 'ti-alert-triangle');
    }
  }
}

async function deleteItem(id) {

  try {
    // Remove link from local state before making API request
    formStore.links = formStore.links.filter(l => l.id !== id)
    editingItem.value = null

    // Make API request to remove link from backend
    const response = await $axios.delete(`v1/cards/${formStore.newCardId}/links/${id}`,
        {
          data: {
            fieldName: 'customIcon'
          }
        });

    // Ensure response is valid
    if (!response.data?.success) {
      showInfoToast(response.data.message, 'ti-check');
    } else {
      showInfoToast(response.data.message, 'ti-alert-triangle');
    }
  } catch (error) {
    if (error.response) {
      // Show meaningful error message from the backend
      showInfoToast(error.response.data.message, 'ti-alert-triangle');
    } else {
      showInfoToast('مشکلی در ارتباط با سرور وجود دارد. لطفاً بعداً امتحان کنید.');
    }
  }

}

async function toggleItem(id) {
  const item = formStore.links.find(l => l.id === id)

  if (!item) return

  const previousState = item.enabled;
  const cardId = formStore.newCardId;

  try {
    const response = await $axios.patch(`v1/cards/${cardId}/links/${id}`, {enabled: !previousState});

    if (!response.data?.success) {
      showInfoToast(response.data.message, 'ti-alert-triangle');
    } else {
      item.enabled = !previousState;
      formStore.links = [...formStore.links];
      showInfoToast(response.data.message, 'ti-check');
    }
  } catch (error) {
    if (error.response) {
      showInfoToast(error.response.data.message, 'ti-alert-triangle');
    } else {
      showInfoToast('مشکلی در ارتباط با سرور وجود دارد. لطفاً بعداً امتحان کنید.');

      item.enabled = previousState;
      formStore.links = [...formStore.links]

    }
  }
}

// انتخاب لینک به عنوان single link (جایگزین کردن با لینک اول)
async function selectAsSingleLink(selectedLink) {
  // بررسی اینکه آیا بلاک است و کارت تماس نیست
  if (selectedLink.type === 'block' && selectedLink.action !== 'contactcard') {
    alert('فقط بلاک کارت تماس می‌تواند به عنوان لینک اول انتخاب شود')
    return
  }

  try {
    const response = await $axios.put(`v1/cards/${formStore.newCardId}/links/${selectedLink.id}/toggleSelectedAsSingleLink`)

    if (response.data.success) {

      // پیدا کردن index لینک انتخاب شده
      const selectedIndex = formStore.links.findIndex(l => l.id === selectedLink.id)
      if (selectedIndex === -1 || selectedIndex === 0) return // اگر پیدا نشد یا قبلاً اول است

      // کپی آرایه لینک‌ها
      const newLinks = [...formStore.links]

      // حذف لینک انتخاب شده از موقعیت فعلی
      const [movedLink] = newLinks.splice(selectedIndex, 1)

      // قرار دادن آن در ابتدای آرایه
      newLinks.unshift(movedLink)

      // به‌روزرسانی store
      formStore.links = newLinks

      showInfoToast(response.data.message, "ti-lock")

    } else {
      showInfoToast(response.data.message, "ti-lock")
    }
  } catch (error) {
    showInfoToast('با خطا مواجه شد', "ti-lock")
  } finally {
  }
}

function handleIconUpload(e) {
  const file = e.target.files[0]
  const reader = new FileReader()
  reader.onload = ev => {
    editingItem.value.customIcon = ev.target.result
  }
  reader.readAsDataURL(file)
}

function normalizeLink(link) {
  return {
    ...link,
    icon: link.icon ? safeJsonParse(link.icon) : null,
    placeholder: link.placeholder ? safeJsonParse(link.placeholder) : null,
  }
}

function safeJsonParse(str) {
  try {
    return typeof str === "string" ? JSON.parse(str) : str
  } catch {
    return str
  }
}

async function addNewItem(newItem) {
  const item = {...newItem}
  // همیشه id یکتا تولید کن
  item.id = `${Date.now()}_${Math.random().toString(36).slice(2)}`
  item.enabled = true
  item.type = item.type || (item.action?.includes('block') ? 'block' : 'link')
  const found = findItemAction(item)
  if (found.action) item.action = found.action
  if (item.baseUrl && item.value?.startsWith(item.baseUrl)) {
    item.username = item.value.replace(item.baseUrl, '')
  }

  const customIcon = item?.customIcon ?? null
  const fileData = item?.fileData ?? null
  const backgroundImage = item?.backgroundImage ?? null


  //Set Api for add link to card
  try {
    const payloadLink = {
      //backgroundImage: item.backgroundImage || '',
      phoneRequired: item.phoneRequired || '',
      rewards: item.rewards || '',
      segments: item.segments || '',
      prizes: item.prizes || '',
      difficulty: item.difficulty || '',
      submitButtonText: item.submitButtonText || '',
      thankYouMessage: item.thankYouMessage || '',
      avatar: item.avatar || '',
      align: item.align || '',
      options: item.options || '',
      fileName: item.fileName || '',
      fileType: item.fileType || '',
      accountHolder: item.accountHolder || '',
      accountNumber: item.accountNumber || '',
      bankName: item.bankName || '',
      cardNumber: item.cardNumber || '',
      customBank: item.customBank || '',
      ibanNumber: item.ibanNumber || '',
      showBankDropdown: item.showBankDropdown || '',
      highlight: item.highlight || false,
      access: item.access || '',
      address: item.address || '',
      days: item.days || '',
      mode: item.mode || '',
      latitude: item.latitude || '',
      longitude: item.longitude || '',
      zoom: item.zoom || '',
      action: item.action || '',
      fields: item.fields || "",
      baseUrl: item.baseUrl || '',
      //customIcon: item.customIcon || '',
      description: item.description || '',
      enabled: item.enabled,
      icon: item.icon ? JSON.stringify(item.icon) : null,
      id: item.id,
      name: item.name,
      username: item.username || '',
      selectedItems: item.selectedItems || '',
      placeholder: item.placeholder ? JSON.stringify(item.placeholder) : null,
      showDescription: item.showDescription || false,
      title: item.title,
      type: item.type,
      value: item.value || '',

    }

    const response = await $axios.post(`v1/cards/${formStore.newCardId}/links`, {link: JSON.stringify(payloadLink)});

    // Ensure response contains expected data
    if (!response.data?.success) {
      showInfoToast(response.data.message, 'ti-alert-triangle');
    } else {
      const normalized = normalizeLink(response.data.data)

      formStore.addLink(normalized)

      showInfoToast(response.data.message, 'ti-alert-triangle');
      if (customIcon && typeof customIcon === 'string' && customIcon.startsWith('data:')) {
        const uploadResponse = await uploadCustomIcon(
            response.data?.data.id, response.data?.data.cardId
            , response.data?.data.modelType,
            customIcon)

        if (uploadResponse.data?.success && uploadResponse.data.data) {
          const idx = formStore.links.findIndex(l => l.id === response.data.data.id);
          if (idx !== -1) {
            formStore.links[idx].customIcon = uploadResponse.data.data;
            formStore.links = [...formStore.links]; // trigger reactivity
          }
        }
      }
      ////
      if (fileData && typeof fileData === 'string' && fileData.startsWith('data:')) {
        const uploadResponse = await uploadCustomIcon(
            response.data?.data.id, response.data?.data.cardId
            , response.data?.data.modelType,
            fileData)

        if (uploadResponse.data?.success && uploadResponse.data.data) {
          const idx = formStore.links.findIndex(l => l.id === response.data.data.id);
          if (idx !== -1) {
            formStore.links[idx].fileData = uploadResponse.data.data;
            formStore.links = [...formStore.links]; // trigger reactivity
          }
        }
      }
      ///
      if (backgroundImage && typeof backgroundImage === 'string' && backgroundImage.startsWith('data:')) {
        const uploadResponse = await uploadCustomIcon(
            response.data?.data.id, response.data?.data.cardId
            , response.data?.data.modelType,
            backgroundImage)

        if (uploadResponse.data?.success && uploadResponse.data.data) {
          const idx = formStore.links.findIndex(l => l.id === response.data.data.id);
          if (idx !== -1) {
            formStore.links[idx].backgroundImage = uploadResponse.data.data;
            formStore.links = [...formStore.links]; // trigger reactivity
          }
        }
      }
    }
  } catch (error) {
    if (error.response) {
      // Show backend error message if available
      showInfoToast(error.response.data.message, 'ti-alert-triangle');
    } else {
      showInfoToast('مشکلی در ارتباط با سرور وجود دارد. لطفاً بعداً امتحان کنید.', 'ti-alert-triangle');
    }
  }

  showAddModal.value = false
}

async function uploadCustomIcon(linkId, cardId, modelType, base64Icon, fieldName) {
  const formData = new FormData()

  formData.append('modelType', modelType) // یا هر چیز دیگه که API میخواد
  formData.append('modelId', linkId)

  function base64ToBlob(base64, mime = 'image/png') {
    const byteString = atob(base64.split(',')[1])
    const ab = new ArrayBuffer(byteString.length)
    const ia = new Uint8Array(ab)
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i)
    }
    return new Blob([ab], {type: mime})
  }

  const blob = base64ToBlob(base64Icon)

  formData.append(fieldName, blob, fieldName + '.png')

  try {
    const uploadResponse = await $axios.post(`file-manager/${linkId}/upload`, formData)

    if (uploadResponse.data?.success) {
      showInfoToast('آیکون سفارشی با موفقیت آپلود شد', 'ti-image')

    } else {
      showInfoToast('آپلود آیکون سفارشی با خطا مواجه شد', 'ti-alert-triangle')
    }

    return uploadResponse;
  } catch (error) {
    showInfoToast('خطا در آپلود آیکون سفارشی', 'ti-alert-triangle')
  }
}

// Drag handlers to prevent errors
const isDragging = ref(false)

async function onDragStart() {
  isDragging.value = true
}

async function onDragEnd() {

  setTimeout(async () => {
    isDragging.value = false

    // ترتیب جدید بعد از درگ
    const hashOrder = formStore.links.map(link => link?.hash);

    const formData = new FormData();
    hashOrder.forEach((hash, index) => {
      formData.append(`hashOrder[${index}]`, hash);
    });

    try {
      const response = await $axios.post(
          `v1/cards/${formStore.newCardId}/links/reorder`,
          formData
      );

      if (!response.data?.success) {
        showInfoToast(response.data.message, 'ti-alert-triangle');
      } else {
        showInfoToast(response.data.message, 'ti-check');
      }
    } catch (error) {
      if (error.response) {
        showInfoToast(error.response.data.message, 'ti-alert-triangle');
      } else {
        showInfoToast(
            'مشکلی در ارتباط با سرور وجود دارد. لطفاً بعداً امتحان کنید.',
            'ti-alert-triangle'
        );
      }
    }
  }, 100);
}
</script>

<style scoped>
.ghost {
  opacity: 0.5;
}

.chosen {
  opacity: 0.8;
}

.drag {
  opacity: 0.9;
}
</style>
