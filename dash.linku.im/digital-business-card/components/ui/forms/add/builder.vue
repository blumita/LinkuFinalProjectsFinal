<template>
  <div class="bg-background flex flex-col h-full">
    <div class="flex-1 overflow-y-auto p-4 space-y-6 pb-20 lg:pb-4">
    <!-- Icon and title and descriptions -->
    <div class="flex items-center gap-4 mb-6">
      <div class="relative w-20 h-20 flex-shrink-0">
        <img v-if="form.customIcon" :src="form.customIcon" class="w-full h-full rounded-xl bg-muted object-cover cursor-pointer" @click="fileInput?.click()">
        <!-- Dynamic icon component -->
        <div
          v-else-if="iconComponent && iconData?.type === 'component'"
          class="w-full h-full rounded-xl bg-muted flex items-center justify-center cursor-pointer"
          @click="fileInput?.click()"
        >
          <component 
            :is="iconComponent"
            :size="80"
            v-bind="iconColor ? { color: iconColor, filled: isIconFilled } : {}"
          />
        </div>
        <component 
          :is="iconComponent" 
          v-else-if="iconComponent" 
          class="w-full h-full rounded-xl bg-muted p-2 cursor-pointer" 
          :size="80"
          v-bind="iconColor ? { color: iconColor, filled: isIconFilled } : {}"
          @click="fileInput?.click()" 
        />
        <div v-else class="w-full h-full rounded-xl bg-muted flex items-center justify-center text-2xl cursor-pointer" @click="fileInput?.click()">
          <component 
            :is="getIconComponent('form')" 
            :size="80"
            v-bind="iconColor ? { color: iconColor, filled: isIconFilled } : {}"
          />
        </div>
        <input ref="fileInput" type="file" accept="image/png,image/jpeg,image/jpg,image/webp,image/bmp,image/svg+xml" class="hidden" @change="handleIconUpload">
      </div>
      <div class="flex flex-col items-start justify-center flex-1">
        <p class="text-sm text-primary font-medium cursor-pointer" @click="fileInput?.click()">کلیک کنید تا آیکون تغییر کند</p>
        <p class="text-xs text-muted-foreground mt-1">فرمت‌های مجاز: PNG, JPG, JPEG, WEBP, BMP, SVG</p>
      </div>
    </div>
    <div class="mb-4">
      <label class="block text-xs font-medium text-muted-foreground mb-1">عنوان فرم</label>
      <input v-model="form.title" type="text" class="w-full px-2 py-2 rounded border border-border bg-muted text-sm text-foreground" placeholder="مثال: فرم ثبت‌نام">
    </div>
    <div class="mb-4">
      <label class="block text-xs font-medium text-muted-foreground mb-1">توضیحات</label>
      <textarea v-model="form.description" rows="2" class="w-full px-2 py-2 rounded border border-border bg-muted text-sm resize-none text-foreground" placeholder="توضیحات اختیاری" />
    </div>
    <!-- Tabs -->
    <div class="w-full flex border-b border-border mb-6">
      <button :class="['flex-1 flex items-center justify-center gap-2 py-4 text-base font-bold transition', activeTab==='form' ? 'text-primary border-b-2 border-primary bg-muted' : 'text-muted-foreground']" @click="activeTab='form'">
        <i class="ti ti-edit" />
        اطلاعات فرم
      </button>
      <button :class="['flex-1 flex items-center justify-center gap-2 py-4 text-base font-bold transition', activeTab==='preview' ? 'text-primary border-b-2 border-primary bg-muted' : 'text-muted-foreground']" @click="activeTab='preview'">
        <i class="ti ti-eye" />
        پیش‌نمایش
      </button>
    </div>
    <div v-if="activeTab==='form'">
      <!-- Form Information -->
      <div class="space-y-4">
        <draggable v-model="fields" item-key="id" handle=".drag-handle" :animation="200" @start="dragStart($event.oldIndex)" @end="dropField">
          <template #item="{ element: field, index: idx }">
            <div :key="field.id" class="bg-muted/30 rounded-xl border border-border p-4 mb-3 relative group transition-all" draggable="true" @dragstart="dragStart(idx)" @dragover.prevent="dragOver(idx)" @drop.prevent="dropField">
              <!-- Header: Drag handle + Delete -->
              <div class="flex items-center justify-between mb-4">
                <div class="flex items-center gap-2 cursor-move drag-handle select-none">
                  <i class="ti ti-grip-vertical text-muted-foreground text-lg" />
                  <span class="text-sm font-medium text-foreground">فیلد {{ idx + 1 }}</span>
                </div>
                <button class="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-destructive/10 text-destructive hover:text-destructive/80 transition-colors" title="حذف فیلد" @click="removeField(idx)">
                  <i class="ti ti-trash text-lg" />
                </button>
              </div>
              
              <!-- Field Content -->
              <div class="space-y-4">
                <!-- Row 1: Type + Label -->
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label class="block text-sm font-medium text-foreground mb-2">نوع فیلد</label>
                    <div class="relative">
                      <button type="button" class="w-full flex items-center justify-between px-3 py-2.5 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 text-foreground" @click="toggleDropdown(idx, 'type')">
                        <span>{{ fieldTypeLabel(field.type) }}</span>
                        <i class="ti ti-chevron-down text-sm" />
                      </button>
                      <transition name="fade">
                        <ul v-if="dropdownOpen.idx === idx && dropdownOpen.type === 'type'" class="absolute z-20 right-0 left-0 mt-1 bg-background border border-border rounded-lg shadow-lg text-sm max-h-56 overflow-auto">
                          <li v-for="type in fieldTypes" :key="type.value" class="px-3 py-2.5 cursor-pointer hover:bg-muted text-foreground" :class="{'bg-muted': field.type === type.value}" @mousedown.prevent="selectFieldType(idx, type.value)">
                            {{ type.label }}
                          </li>
                        </ul>
                      </transition>
                    </div>
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-foreground mb-2">برچسب</label>
                    <input v-model="field.label" type="text" class="w-full px-3 py-2.5 rounded-lg border border-border bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" placeholder="مثال: نام">
                  </div>
                </div>
                
                <!-- Row 2: Placeholder or Options -->
                <div v-if="field.type !== 'checkbox' && !['dropdown','radio','checkboxes','file'].includes(field.type)">
                  <label class="block text-sm font-medium text-foreground mb-2">متن راهنما</label>
                  <input v-model="field.placeholder" type="text" class="w-full px-3 py-2.5 rounded-lg border border-border bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" placeholder="مثال: اینجا وارد کنید...">
                </div>
                <div v-if="['dropdown','radio','checkboxes'].includes(field.type)">
                  <label class="block text-sm font-medium text-foreground mb-2">گزینه‌ها (هر کدام در یک خط)</label>
                  <textarea v-model="field.optionsText" rows="3" class="w-full px-3 py-2.5 rounded-lg border border-border bg-background text-sm resize-none text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" placeholder="گزینه ۱&#10;گزینه ۲&#10;گزینه ۳" />
                </div>
              </div>
            </div>
          </template>
        </draggable>
        
        <!-- Add Field Button -->
        <button class="w-full px-4 py-3 bg-primary/10 text-primary rounded-xl hover:bg-primary/20 text-sm font-medium flex items-center justify-center gap-2 transition-colors border-2 border-dashed border-primary/30" @click="addField">
          <i class="ti ti-plus text-lg" />
          افزودن فیلد جدید
        </button>
        
        <!-- Submit Settings -->
        <div class="mt-6 space-y-4 pt-4 border-t border-border">
          <div>
            <label class="block text-sm font-medium text-foreground mb-2">متن دکمه ارسال</label>
            <input v-model="submitButtonText" type="text" class="w-full px-3 py-2.5 rounded-lg border border-border bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" placeholder="مثال: ارسال، فرستادن، ادامه...">
          </div>
          <div>
            <label class="block text-sm font-medium text-foreground mb-2">پیام تشکر بعد از ارسال</label>
            <input v-model="thankYouMessage" type="text" class="w-full px-3 py-2.5 rounded-lg border border-border bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" placeholder="مثال: فرم با موفقیت ارسال شد!">
          </div>
        </div>
      </div>
    </div>
    <div v-else-if="activeTab==='preview'">
      <!-- Form Preview -->
      <form class="space-y-4" @submit.prevent>
        <div v-for="field in fields" :key="field.id" class="space-y-2">
          <div v-if="field.type === 'dropdown'" class="relative">
            <button
              type="button"
              class="w-full flex items-center justify-between px-3 py-2 rounded border border-border bg-background text-sm text-foreground"
              @click.stop="toggleDropdown(field.id, 'preview')"
            >
              <span>{{ previewFormData[field.id] || (field.placeholder || 'انتخاب کنید...') }}</span>
              <i class="ti ti-chevron-down text-xs text-foreground" />
            </button>
            <transition name="fade">
              <ul
                v-if="dropdownOpen.idx === field.id && dropdownOpen.type === 'preview'"
                class="absolute z-50 left-0 right-0 mt-1 bg-background border border-border rounded shadow-md text-sm max-h-56 overflow-auto"
              >
                <li
                  v-for="opt in getDropdownOptions(field)"
                  :key="opt"
                  class="px-3 py-2 cursor-pointer hover:bg-muted text-foreground"
                  :class="{'bg-muted': previewFormData[field.id] === opt}"
                  @click.stop="previewFormData[field.id] = opt; dropdownOpen.idx = null; dropdownOpen.type = null"
                >
                  {{ opt }}
                </li>
              </ul>
            </transition>
          </div>

          <div v-else-if="field.type === 'radio'" class="flex flex-col gap-2">
            <div
              v-for="opt in getDropdownOptions(field)"
              :key="opt"
              class="flex items-center gap-2 text-foreground"
            >
              <input
                v-model="previewFormData[field.id]"
                type="radio"
                :name="'preview_radio_' + field.id"
                :value="opt"
                class="accent-primary text-foreground"
              >
              <span class="text-sm">{{ opt }}</span>
            </div>
          </div>

          <div v-else-if="field.type === 'checkboxes'" class="flex flex-col gap-2">
            <div
              v-for="opt in getDropdownOptions(field)"
              :key="opt"
              class="flex items-center gap-2 text-foreground"
            >
              <input
                v-model="previewFormData[field.id]"
                :value="opt"
                type="checkbox"
                class="accent-primary text-foreground"
              >
              <span class="text-sm">{{ opt }}</span>
            </div>
          </div>

          <div v-else-if="field.type === 'file'" class="flex flex-col gap-2">
            <div class="relative w-20 h-20 mb-2">
              <img v-if="field.icon" :src="field.icon" class="w-full h-full rounded-xl bg-muted object-cover cursor-pointer" @click="() => document.getElementById('previewFileInput_' + field.id)?.click()">
              <div v-else class="w-full h-full rounded-xl bg-muted flex items-center justify-center text-muted-foreground text-2xl cursor-pointer" @click="() => document.getElementById('previewFileInput_' + field.id)?.click()">
                <i class="ti ti-file" />
              </div>
              <input :id="'previewFileInput_' + field.id" type="file" class="hidden" @change="e => previewFormData[field.id] = e.target.files[0]">
            </div>
            <p class="text-sm text-primary font-medium cursor-pointer" @click="() => document.getElementById('previewFileInput_' + field.id)?.click()">کلیک کنید تا آیکون تغییر کند</p>
            <span v-if="previewFormData[field.id]" class="text-sm text-muted-foreground">
              {{ previewFormData[field.id]?.name }}
            </span>
          </div>

          <input
            v-else-if="['text', 'email', 'number', 'mobile'].includes(field.type)"
            v-model="previewFormData[field.id]"
            :type="field.type === 'mobile' ? 'tel' : field.type"
            :placeholder="field.placeholder"
            class="w-full px-3 py-2 rounded border border-border bg-background text-sm text-foreground"
          >

          <textarea
            v-else-if="field.type === 'textarea'"
            v-model="previewFormData[field.id]"
            class="w-full px-3 py-2 rounded border border-border bg-background text-sm resize-none text-foreground"
            rows="3"
            :placeholder="field.placeholder"
          />

          <div v-else-if="field.type === 'checkbox'" class="flex items-center gap-2">
            <input
              v-model="previewFormData[field.id]"
              type="checkbox"
              class="rounded border-border"
            >
            <span class="text-sm text-foreground">{{ field.placeholder || 'اینجا تیک بزنید' }}</span>
          </div>
        </div>
        <button type="button" class="w-full mt-6 px-6 py-3 bg-primary text-primary-foreground rounded text-base font-bold hover:bg-primary/90">
          {{ submitButtonText }}
        </button>
      </form>
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
import { reactive, ref, watch, computed } from 'vue'
import draggable from 'vuedraggable'

const { getIconComponent } = useIconComponents()
const formStore = useFormStore()

// Field ID counter
let idCounter = Date.now()

const emit = defineEmits(['submit', 'cancel'])
const props = defineProps({ 
  link: {
    type: Object,
    default: () => ({})
  }
})

const form = reactive({
  ...props.link,
  title: props.link?.title || '',
  description: props.link?.description || '',
  customIcon: props.link?.customIcon || '',
  icon: props.link?.icon || { name: 'form', library: 'tabler', type: 'component' },
})

// Icon Management
const iconData = computed(() => {
  return form.icon || null;
})

const iconComponent = computed(() => getIconComponent(iconData.value))
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

const fileInput = ref(null)
function handleIconUpload(e) {
  const files = e.target.files
  if (!files || !files[0]) return
  const reader = new FileReader()
  reader.onload = (ev) => {
    form.customIcon = ev.target.result
  }
  reader.readAsDataURL(files[0])
}

const fields = ref(
    props.link?.fields
        ? JSON.parse(JSON.stringify(props.link.fields)).map(f => ({
          ...f,
          id: f.id || (idCounter++ + '_' + Math.random().toString(36).substr(2,5)),
          type: f.type || 'text'
        }))
        : [{ id: idCounter++ + '_' + Math.random().toString(36).substr(2,5), type: 'text', label: 'نام', placeholder: 'مثال: علی احمدی' }]
)

const formData = reactive({})
const previewFormData = reactive({})

// Initialize previewFormData with field changes
watch(fields, (newFields) => {
  newFields.forEach(field => {
    if (!(field.id in previewFormData)) {
      if (field.type === 'checkboxes') previewFormData[field.id] = []
      else if (field.type === 'checkbox') previewFormData[field.id] = false
      else previewFormData[field.id] = ''
    }
  })
  // حذف فیلدهای پاک شده
  Object.keys(previewFormData).forEach(id => {
    if (!newFields.find(f => f.id == id)) {
      const updatedData = { ...previewFormData }
      updatedData[id] = undefined
      Object.assign(previewFormData, updatedData)
    }
  })
}, { immediate: true, deep: true })

const dropdownOpen = ref({ idx: null, type: null })
const dragIndex = ref(null)
const dropIndex = ref(null)
const submitButtonText = ref(props.link?.submitButtonText || 'ارسال')
const thankYouMessage = ref(props.link?.thankYouMessage || 'فرم با موفقیت ارسال شد!')
const activeTab = ref('form')

const fieldTypes = [
  { value: 'text', label: 'متن' },
  { value: 'email', label: 'ایمیل' },
  { value: 'number', label: 'عدد' },
  { value: 'mobile', label: 'شماره موبایل' },
  { value: 'dropdown', label: 'لیست کشویی' },
  { value: 'radio', label: 'چند گزینه‌ای (رادیو)' },
  { value: 'checkboxes', label: 'چند گزینه‌ای (چک باکس)' },
  { value: 'file', label: 'آپلود فایل' },
  { value: 'textarea', label: 'توضیحات' },
  { value: 'checkbox', label: 'چک باکس' },
]

function addField() {
  fields.value.push({ id: idCounter++ + '_' + Math.random().toString(36).substr(2, 5)
    , type: 'text', label: '', placeholder: '' })
}
function removeField(idx) {
  const id = fields.value[idx].id
  fields.value.splice(idx, 1)
  // Remove from formData safely
  const updatedFormData = { ...formData }
  updatedFormData[id] = undefined
  Object.assign(formData, updatedFormData)
}
function submitForm() {
  const newLink = {
    ...form,
    id: form.id || `${Date.now()}_${Math.random().toString(36).slice(2)}`,
    title: form.title || 'فرم پویا',
    action: form.action || 'form',
    type: form.type || 'default',
    fields: JSON.parse(JSON.stringify(fields.value)),
    submitButtonText: submitButtonText.value,
    thankYouMessage: thankYouMessage.value,
    enabled: form.enabled ?? true,
  }
  emit('submit', newLink) // Changed to submit for compatibility with AddLinkModal
}
function getDropdownOptions(field) {
  if ((field.type === 'dropdown' || field.type === 'radio' || field.type === 'checkboxes') && field.optionsText) {
    return field.optionsText.split(/\r?\n/).map(opt => opt.trim()).filter(Boolean)
  }
  return []
}
function fieldTypeLabel(type) {
  switch(type) {
    case 'text': return 'متن';
    case 'email': return 'ایمیل';
    case 'number': return 'عدد';
    case 'mobile': return 'شماره موبایل';
    case 'dropdown': return 'لیست کشویی';
    case 'radio': return 'چند گزینه‌ای (رادیو)';
    case 'checkboxes': return 'چند گزینه‌ای (چک باکس)';
    case 'file': return 'آپلود فایل';
    case 'textarea': return 'توضیحات';
    case 'checkbox': return 'چک باکس';
    default: return '';
  }
}
function toggleDropdown(idx, type) {
  dropdownOpen.value = (dropdownOpen.value.idx === idx && dropdownOpen.value.type === type) ? { idx: null, type: null } : { idx, type }
}
function selectFieldType(idx, value) {
  fields.value[idx].type = value || 'text'
  dropdownOpen.value = { idx: null, type: null }
}
// Drag & Drop
function dragStart(idx) {
  dragIndex.value = idx
}
function dragOver(idx) {
  dropIndex.value = idx
}
function dropField() {
  if (dragIndex.value !== null && dropIndex.value !== null && dragIndex.value !== dropIndex.value) {
    const moved = fields.value.splice(dragIndex.value, 1)[0]
    fields.value.splice(dropIndex.value, 0, moved)
  }
  dragIndex.value = null
  dropIndex.value = null
}
// Sync dropdown options with optionsText value
watch(fields, (newFields) => {
  newFields.forEach(field => {
    if ((['dropdown','radio','checkboxes'].includes(field.type)) && !('optionsText' in field)) {
      field.optionsText = ''
    }
  })
}, { deep: true })
// Close dropdown on outside click
if (typeof window !== 'undefined') {
  window.addEventListener('click', (e) => {
    if (!e.target.closest('.group, .dropdown-preview')) dropdownOpen.value = { idx: null, type: null }
  })
}
</script>

<style scoped>
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.15s;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
.group:focus-within ul,
.group:hover ul {
  display: block;
}
@media (max-width: 1024px) {
  .grid.lg\:grid-cols-5 {
    grid-template-columns: 1fr !important;
  }
}
.bg-white.rounded-xl.p-4, .bg-white.rounded-xl.p-4.lg\:p-6, .bg-white.rounded-xl.w-full {
  max-width: 100vw;
}
@media (max-width: 768px) {
  .bg-white.rounded-xl.p-4, .bg-white.rounded-xl.p-4.lg\:p-6, .bg-white.rounded-xl.w-full {
    padding: 1rem !important;
  }
  .group {
    flex-direction: column !important;
    align-items: stretch !important;
  }
  .group > * {
    width: 100% !important;
    min-width: 0 !important;
  }
  .grid-cols-1.md\:grid-cols-2 {
    grid-template-columns: 1fr !important;
  }
}
@media (max-width: 900px) {
  .flex-row.gap-8 {
    flex-direction: column !important;
    gap: 2rem !important;
  }
}
/* Preview modal fully fullscreen and edge to edge */
.preview-modal-overlay {
  padding: 0 !important;
}
.preview-modal {
  width: 100vw !important;
  max-width: 100vw !important;
  min-width: 0 !important;
  left: 0 !important;
  right: 0 !important;
  top: 0 !important;
  bottom: 0 !important;
  border-radius: 0 !important;
  position: relative;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  padding: 2.5rem 2rem !important;
}
@media (max-width: 768px) {
  .preview-modal {
    padding: 1.5rem 0.5rem !important;
  }
}
</style>



