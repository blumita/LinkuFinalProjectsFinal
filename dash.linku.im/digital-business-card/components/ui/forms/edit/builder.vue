<template>
  <div class="bg-background rounded-xl w-full max-h-[90vh] overflow-y-auto p-4">
    
    <!-- آیکون و عنوان و توضیحات -->
    <div class="flex flex-row items-center gap-4 mb-6 w-full justify-start rtl:justify-start">
      <div class="relative w-20 h-20 flex-shrink-0 order-1">
        <img v-if="form.customIcon" :src="form.customIcon" class="w-full h-full rounded-xl bg-muted object-cover cursor-pointer" @click="fileInput?.click()" >
        <component :is="iconComponent" v-else-if="iconComponent" class="w-full h-full rounded-xl bg-muted text-muted-foreground p-2 cursor-pointer" @click="fileInput?.click()" />
        <div v-else class="w-full h-full rounded-xl bg-muted flex items-center justify-center text-muted-foreground text-2xl cursor-pointer" @click="fileInput?.click()">
          <i class="ti ti-form" />
        </div>
        <input ref="fileInput" type="file" accept="image/png,image/jpeg,image/jpg,image/webp,image/bmp,image/svg+xml" class="hidden" @change="handleIconUpload" >
      </div>
      <div class="flex flex-col items-start justify-center flex-1 order-2">
        <p class="text-sm text-blue-500 font-medium cursor-pointer" @click="fileInput?.click()">برای تغییر آیکون کلیک کنید</p>
        <p class="text-xs text-gray-500 mt-1">فرمت‌های مجاز: PNG, JPG, JPEG, WEBP, BMP, SVG</p>
      </div>
    </div>
    <div class="mb-4">
      <label class="block text-sm font-medium text-foreground mb-2">عنوان فرم</label>
      <input v-model="form.title" type="text" class="w-full px-3 py-2.5 rounded-lg border border-border bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" placeholder="مثلاً فرم ثبت‌نام" >
    </div>
    <div class="mb-4">
      <label class="block text-sm font-medium text-foreground mb-2">توضیحات فرم</label>
      <textarea v-model="form.description" rows="2" class="w-full px-3 py-2.5 rounded-lg border border-border bg-background text-sm resize-none text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" placeholder="توضیح اختیاری"></textarea>
    </div>
    <h2 class="text-lg font-bold mb-4">ویرایش فرم‌ساز داینامیک</h2>
    <!-- تب‌ها -->
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
      <!-- اطلاعات فرم -->
      <div class="space-y-4 w-full">
        <draggable v-model="fields" item-key="id" handle=".drag-handle" @start="dragStart($event.oldIndex)" @end="dropField" :animation="200">
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
                          <li v-for="type in fieldTypes" :key="type.value" @mousedown.prevent="selectFieldType(idx, type.value)" class="px-3 py-2.5 cursor-pointer hover:bg-muted text-foreground" :class="{'bg-muted': field.type === type.value}">
                            {{ type.label }}
                          </li>
                        </ul>
                      </transition>
                    </div>
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-foreground mb-2">برچسب</label>
                    <input v-model="field.label" type="text" class="w-full px-3 py-2.5 rounded-lg border border-border bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" placeholder="مثال: نام" >
                  </div>
                </div>
                
                <!-- Row 2: Placeholder or Options -->
                <div v-if="field.type !== 'checkbox' && !['dropdown','radio','checkboxes','file'].includes(field.type)">
                  <label class="block text-sm font-medium text-foreground mb-2">متن راهنما</label>
                  <input v-model="field.placeholder" type="text" class="w-full px-3 py-2.5 rounded-lg border border-border bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" placeholder="مثال: اینجا وارد کنید..." >
                </div>
                <div v-if="['dropdown','radio','checkboxes'].includes(field.type)">
                  <label class="block text-sm font-medium text-foreground mb-2">گزینه‌ها (هر کدام در یک خط)</label>
                  <textarea v-model="field.optionsText" rows="3" class="w-full px-3 py-2.5 rounded-lg border border-border bg-background text-sm resize-none text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" placeholder="گزینه ۱&#10;گزینه ۲&#10;گزینه ۳"></textarea>
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
            <input v-model="submitButtonText" type="text" class="w-full px-3 py-2.5 rounded-lg border border-border bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" placeholder="مثال: ارسال، فرستادن، ادامه..." >
          </div>
          <div>
            <label class="block text-sm font-medium text-foreground mb-2">پیام تشکر بعد از ارسال</label>
            <input v-model="thankYouMessage" type="text" class="w-full px-3 py-2.5 rounded-lg border border-border bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" placeholder="مثال: فرم با موفقیت ارسال شد!" >
          </div>
        </div>
      </div>
    </div>
    <div v-else-if="activeTab==='preview'">
      <form @submit.prevent class="space-y-4">
        <div v-for="field in fields" :key="field.id" class="space-y-2">
          <div v-if="field.type === 'dropdown'" class="relative">
            <button
              type="button"
              @click.stop="toggleDropdown(field.id, 'preview')"
              class="w-full flex items-center justify-between px-3 py-2 rounded border border-border bg-background text-sm text-foreground"
            >
              <span>{{ previewFormData[field.id] || (field.placeholder || 'انتخاب کنید...') }}</span>
              <i class="ti ti-chevron-down text-xs" />
            </button>
            <transition name="fade">
              <ul
                v-if="dropdownOpen.idx === field.id && dropdownOpen.type === 'preview'"
                class="absolute z-50 left-0 right-0 mt-1 bg-background border border-border rounded shadow-md text-sm max-h-56 overflow-auto"
              >
                <li
                  v-for="opt in getDropdownOptions(field)"
                  :key="opt"
                  @click.stop="previewFormData[field.id] = opt; dropdownOpen.idx = null; dropdownOpen.type = null"
                  class="px-3 py-2 cursor-pointer hover:bg-muted text-foreground"
                  :class="{'bg-muted': previewFormData[field.id] === opt}"
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
              class="flex items-center gap-2"
            >
              <input
                type="radio"
                :name="'preview_radio_' + field.id"
                :value="opt"
                v-model="previewFormData[field.id]"
                class="accent-primary"
              >
              <span class="text-sm text-foreground">{{ opt }}</span>
            </div>
          </div>
          <div v-else-if="field.type === 'checkboxes'" class="flex flex-col gap-2">
            <div
              v-for="opt in getDropdownOptions(field)"
              :key="opt"
              class="flex items-center gap-2"
            >
              <input
                type="checkbox"
                :value="opt"
                v-model="previewFormData[field.id]"
                class="accent-primary"
              >
              <span class="text-sm text-foreground">{{ opt }}</span>
            </div>
          </div>
          <div v-else-if="field.type === 'file'" class="flex flex-col gap-2">
            <div class="relative w-20 h-20 mb-2">
              <img v-if="field.icon" :src="field.icon" class="w-full h-full rounded-xl bg-muted object-cover cursor-pointer" @click="() => document.getElementById('previewFileInput_' + field.id)?.click()" />
              <div v-else class="w-full h-full rounded-xl bg-muted flex items-center justify-center text-muted-foreground text-2xl cursor-pointer" @click="() => document.getElementById('previewFileInput_' + field.id)?.click()">
                <i class="ti ti-file" />
              </div>
              <input :id="'previewFileInput_' + field.id" type="file" class="hidden" @change="e => previewFormData[field.id] = e.target.files[0]" />
            </div>
            <p class="text-sm text-primary font-medium cursor-pointer" @click="() => document.getElementById('previewFileInput_' + field.id)?.click()">برای تغییر آیکون کلیک کنید</p>
            <span v-if="previewFormData[field.id]" class="text-sm text-muted-foreground">
              {{ previewFormData[field.id]?.name }}
            </span>
          </div>
          <input
            v-else-if="['text', 'email', 'number', 'mobile'].includes(field.type)"
            :v-model="previewFormData[field.id]" type="field.type === 'mobile' ? 'tel' : field.type"
            :placeholder="field.placeholder"
            class="w-full px-3 py-2 rounded border border-border bg-background text-sm text-foreground"
          >
          <textarea
            v-else-if="field.type === 'textarea'"
            v-model="previewFormData[field.id]"
            :placeholder="field.placeholder"
            rows="3"
            class="w-full px-3 py-2 rounded border border-border bg-background text-sm resize-none text-foreground"
          ></textarea>
          <div v-else-if="field.type === 'checkbox'" class="flex items-center gap-2">
            <input
              v-model="previewFormData[field.id]"
              type="checkbox"
              class="rounded border-border"
            >
            <span class="text-sm text-foreground">{{ field.placeholder || 'تیک بزنید' }}</span>
          </div>
        </div>
        <button type="button" class="w-full mt-6 px-6 py-3 bg-primary text-primary-foreground rounded text-base font-bold hover:bg-primary/90">
          {{ submitButtonText }}
        </button>
      </form>
    </div>
    <div class="border-t border-border bg-background p-4">
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
import { reactive, ref, watch, nextTick, computed } from 'vue'
import draggable from 'vuedraggable'

const { getIconComponent } = useIconComponents();

const emit = defineEmits(['save', 'cancel', 'back', 'delete'])
const props = defineProps({ link: Object })

const form = reactive({
  ...props.link,
  title: props.link?.title || '',
  description: props.link?.description || '',
  customIcon: props.link?.customIcon || '',
  icon: props.link?.icon || '',
})

// Icon Management
const iconComponent = computed(() => getIconComponent(form.icon));
const safeIcon = computed(() => iconData.value?.icon || 'ti-form');

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

let idCounter = 1
const fields = ref(
  props.link?.fields
    ? JSON.parse(JSON.stringify(props.link.fields)).map(f => ({ ...f, type: f.type || 'text' }))
    : [{ id: idCounter++, type: 'text', label: 'نام', placeholder: 'مثلاً علی' }]
)
const formData = reactive({})
const dropdownOpen = ref({ idx: null, type: null })
const dragIndex = ref(null)
const dropIndex = ref(null)
const submitButtonText = ref(props.link?.submitButtonText || 'ارسال')
const thankYouMessage = ref(props.link?.thankYouMessage || 'فرم با موفقیت ارسال شد!')
const showPreviewModal = ref(false)
const previewFormData = reactive({})
const activeTab = ref('form')

const fieldTypes = [
  { value: 'text', label: 'متن' },
  { value: 'email', label: 'ایمیل' },
  { value: 'number', label: 'عدد' },
  { value: 'mobile', label: 'شماره موبایل' },
  { value: 'dropdown', label: 'کشویی' },
  { value: 'radio', label: 'چند گزینه‌ای (رادیو)' },
  { value: 'checkboxes', label: 'چند گزینه‌ای (چک‌باکس)' },
  { value: 'file', label: 'آپلود فایل' },
  { value: 'textarea', label: 'توضیحات' },
  { value: 'checkbox', label: 'چک‌باکس' },
]

function addField() {
  fields.value.push({ id: idCounter++, type: 'text', label: '', placeholder: '' })
}
function removeField(idx) {
  const id = fields.value[idx].id
  fields.value.splice(idx, 1)
  delete formData[id]
}
function submitForm() {
  const newLink = {
    ...form,
    id: form.id,
    title: form.title || 'فرم داینامیک',
    action: form.action || 'builder',
    type: form.type || 'block',
    fields: JSON.parse(JSON.stringify(fields.value)),
    submitButtonText: submitButtonText.value,
    thankYouMessage: thankYouMessage.value,
    enabled: form.enabled ?? true,
  }
  console.log('Submitting form:', newLink)
  emit('save', newLink)
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
    case 'dropdown': return 'کشویی';
    case 'radio': return 'چند گزینه‌ای (رادیو)';
    case 'checkboxes': return 'چند گزینه‌ای (چک‌باکس)';
    case 'file': return 'آپلود فایل';
    case 'textarea': return 'توضیحات';
    case 'checkbox': return 'چک‌باکس';
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
watch(fields, (newFields) => {
  newFields.forEach(field => {
    if ((['dropdown','radio','checkboxes'].includes(field.type)) && !('optionsText' in field)) {
      field.optionsText = ''
    }
  })
}, { deep: true })
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
.bg-white.rounded-xl.w-full {
  max-width: 100vw;
}
@media (max-width: 768px) {
  .bg-white.rounded-xl.w-full {
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
</style>



