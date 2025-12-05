<template>
  <div class="space-y-4">


    <!-- PRO banner - بهینه شده - فقط برای کاربران رایگان -->
    <transition
        enter-active-class="transition-all duration-300 ease-out"
        leave-active-class="transition-all duration-200 ease-in"
        enter-from-class="opacity-0 -translate-y-2"
        leave-to-class="opacity-0 -translate-y-2"
    >
      <div v-if="showBanner || !isPro" class="rounded-xl overflow-hidden border border-primary/20">
        <div class="flex items-center justify-between gap-3 p-3 bg-gradient-to-r from-primary/10 via-accent/10 to-primary/10">
          <div class="flex items-center gap-2">
            <div class="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
              <i class="ti ti-crown text-primary"></i>
            </div>
            <span class="text-sm font-medium text-foreground">برای ویرایش فیلدها، اشتراک PRO بگیرید</span>
          </div>
          <NuxtLink
              to="/pricing"
              class="shrink-0 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition flex items-center gap-1"
          >
            ارتقا
            <i class="ti ti-arrow-up-right text-xs"></i>
          </NuxtLink>
        </div>
      </div>
    </transition>

    <!-- Form title - کاربر رایگان نمیتونه ویرایش کنه -->
    <div @click="checkProBeforeAction" class="space-y-2" :class="{ 'opacity-60 pointer-events-none': !isPro }">
      <label class="block text-sm font-medium text-foreground">عنوان فرم</label>
      <input
          type="text"
          v-model="form.formTitle"
          placeholder="مثال: فرم تماس با ما"
          class="w-full border border-border rounded-xl px-4 py-3.5 text-sm text-right text-foreground bg-card focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
          :class="{'border-destructive': titleError && formTouched, 'cursor-not-allowed': !isPro}"
          :disabled="!isPro"
          @input="formTouched = true"
          @click.stop
      />
      <p v-if="titleError && formTouched && isPro" class="text-destructive text-xs flex items-center gap-1">
        <i class="ti ti-alert-circle"></i>
        عنوان فرم را وارد کنید
      </p>
    </div>

    <!-- Fields section header -->
    <div class="flex justify-between items-center">
      <span class="text-sm font-medium text-foreground">فیلدهای ورودی</span>
      <div class="relative">
        <button
            @click="toggleDropdown"
            class="text-sm px-4 py-2 rounded-xl flex items-center gap-2 transition-colors"
            :class="isPro ? 'bg-primary text-primary-foreground hover:bg-primary/90' : 'bg-muted text-muted-foreground cursor-not-allowed'"
            :disabled="!isPro"
        >
          <i class="ti ti-plus text-base"></i>
          افزودن فیلد
        </button>
        <div v-if="dropdownOpen && isPro"
             class="absolute ltr:right-0 rtl:left-0 mt-2 w-52 bg-card border border-border rounded-xl shadow-xl z-50 overflow-hidden">
          <ul class="py-2 text-sm text-foreground">
            <li>
              <button @click="addField('text')"
                      class="w-full px-4 py-2.5 hover:bg-accent flex items-center gap-3 text-right transition-colors">
                <i class="ti ti-forms text-muted-foreground"></i>
                متن
              </button>
            </li>
            <li class="relative group">
              <div class="w-full px-4 py-2.5 hover:bg-accent flex items-center gap-3 cursor-pointer text-right transition-colors">
                <i class="ti ti-selector text-muted-foreground"></i>
                <span>کشویی</span>
                <span class="rtl:mr-auto ltr:ml-auto"><i class="ti ti-chevron-left ltr:rotate-180 text-muted-foreground"></i></span>
              </div>
              <div
                  class="absolute top-0 ltr:left-full rtl:right-full mt-0 w-56 bg-card border border-border rounded-xl shadow-xl z-20 hidden group-hover:block overflow-hidden">
                <ul class="text-sm text-foreground">
                  <li>
                    <button @click="addField('dropdown', 'custom')"
                            class="w-full px-4 py-2.5 hover:bg-accent text-right transition-colors">کشویی سفارشی
                    </button>
                  </li>
                  <li class="px-4 py-2 text-muted-foreground text-xs text-right border-t border-border">پیش‌فرض</li>
                  <li>
                    <button @click="addField('dropdown', 'countries')"
                            class="w-full px-4 py-2.5 hover:bg-accent text-right transition-colors">لیست کشورها
                    </button>
                  </li>
                  <li>
                    <button @click="addField('dropdown', 'states')"
                            class="w-full px-4 py-2.5 hover:bg-accent text-right transition-colors">لیست استان‌ها
                    </button>
                  </li>
                </ul>
              </div>
            </li>
            <li>
              <button @click="addField('checkbox')"
                      class="w-full px-4 py-2.5 hover:bg-accent flex items-center gap-3 text-right transition-colors">
                <i class="ti ti-checkbox text-muted-foreground"></i>
                چک‌باکس
              </button>
            </li>
            <li>
              <button @click="addField('file')"
                      class="w-full px-4 py-2.5 hover:bg-accent flex items-center gap-3 text-right transition-colors">
                <i class="ti ti-paperclip text-muted-foreground"></i>
                فایل
              </button>
            </li>
          </ul>
        </div>
      </div>
    </div>

    <!-- Draggable fields list -->
    <draggable
        v-model="form.fields"
        item-key="id"
        :disabled="!isPro"
        handle=".drag-handle"
        ghost-class="opacity-50 bg-primary/10 scale-[1.02]"
        chosen-class="shadow-lg"
        animation="200"
        @end="onDragEnd"
    >
      <template #item="{ element, index }">
        <div 
          class="bg-card rounded-xl px-4 py-3.5 mb-3 border border-border hover:border-primary/30 transition-all" 
          @click="checkProBeforeAction"
        >
          <div class="flex justify-between items-center">
            <div class="flex items-center gap-3 w-full">
              <span class="drag-handle cursor-grab active:cursor-grabbing flex items-center p-1 rounded hover:bg-muted transition-colors" v-if="isPro">
                <i class="ti ti-grip-vertical text-muted-foreground text-lg"></i>
              </span>
              <div class="flex items-center gap-3 flex-1">
                <div class="w-8 h-8 rounded-lg bg-muted flex items-center justify-center shrink-0">
                  <i :class="getFieldIcon(element.type)" class="text-muted-foreground"></i>
                </div>
                <input
                    v-model="element.label"
                    :disabled="!isPro"
                    class="bg-transparent text-sm font-medium focus:outline-none w-full text-right text-foreground placeholder:text-muted-foreground"
                    placeholder="نام فیلد..."
                    @click.stop
                />
                <button 
                  v-if="element.type === 'dropdown'"
                  @click.stop="toggleFieldExpansion(element.id)"
                  class="p-1.5 rounded-lg hover:bg-muted transition-colors"
                >
                  <i 
                    :class="expandedFields[element.id] ? 'ti ti-chevron-up' : 'ti ti-chevron-down'"
                    class="text-muted-foreground transition-transform"
                  ></i>
                </button>
              </div>
            </div>
            <div class="flex items-center gap-3">
              <div class="flex items-center gap-2 bg-muted/50 px-3 py-1.5 rounded-lg">
                <span class="text-xs text-muted-foreground font-medium" v-if="element.type !== 'checkbox'">الزامی</span>
                <span class="text-xs text-muted-foreground font-medium" v-else>فعال</span>
                <label class="relative inline-flex items-center cursor-pointer">
                  <input
                      type="checkbox"
                      class="sr-only peer"
                      v-model="element.required"
                      :disabled="!isPro"
                      @click="handleToggle(index)"
                  />
                  <div class="w-10 h-6 bg-muted rounded-full peer peer-checked:bg-primary transition-colors"></div>
                  <div
                      class="absolute left-1 top-1 bg-background rounded-full h-4 w-4 transition-all peer-checked:translate-x-4 shadow-sm"></div>
                </label>
              </div>
              <button
                  @click="handleRemoveField(index)"
                  class="w-8 h-8 flex items-center justify-center rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                  :disabled="!isPro"
              >
                <i class="ti ti-trash text-base"></i>
              </button>
            </div>
          </div>

          <!-- Dropdown field options -->
          <div v-if="element.type === 'dropdown'" class="pr-12">
            <transition
                enter-active-class="transition-all duration-300 ease-out"
                leave-active-class="transition-all duration-200 ease-in"
                enter-from-class="opacity-0 max-h-0"
                enter-to-class="opacity-100 max-h-60"
                leave-from-class="opacity-100 max-h-60"
                leave-to-class="opacity-0 max-h-0"
            >
              <div v-if="expandedFields[element.id]" class="mt-3 space-y-2 overflow-hidden">
                <div v-for="(opt, i) in element.options" :key="i" class="flex items-center gap-2">
                  <input
                      v-model="element.options[i]"
                      class="text-sm px-3 py-2.5 w-full bg-muted/50 border border-border rounded-lg text-foreground text-right focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                      :disabled="!isPro"
                      @click.stop
                      placeholder="مقدار گزینه"
                  />
                  <button
                      @click.stop="removeOption(index, i)"
                      class="w-8 h-8 flex items-center justify-center rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                      :disabled="!isPro"
                  >
                    <i class="ti ti-x"></i>
                  </button>
                </div>
                <button
                    v-if="isPro"
                    @click.stop="addOption(index)"
                    class="text-sm text-primary hover:text-primary/80 flex items-center gap-1 transition-colors py-1"
                >
                  <i class="ti ti-plus"></i>
                  <span>افزودن گزینه</span>
                </button>
              </div>
            </transition>
          </div>
        </div>
      </template>
    </draggable>

    <!-- Form footer - فقط در دسکتاپ -->
    <div v-if="!isMobile" class="mt-6 space-y-4">
      <div @click="checkProBeforeAction" class="space-y-2">
        <label class="block text-sm font-medium text-foreground">متن دکمه ارسال</label>
        <input
            type="text"
            v-model="form.connectButtonText"
            placeholder="مثال: ارسال پیام"
            class="w-full border border-border rounded-xl px-4 py-3.5 text-sm text-right text-foreground bg-card focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
            :class="isPro ? '' : 'opacity-50 cursor-not-allowed'"
            :disabled="!isPro"
            @click.stop
        />
      </div>
      <div @click="checkProBeforeAction" class="space-y-2">
        <label class="block text-sm font-medium text-foreground">توضیح فرم</label>
        <input
            type="text"
            v-model="form.formDisclaimer"
            placeholder="مثال: اطلاعات شما محفوظ است"
            class="w-full border border-border rounded-xl px-4 py-3.5 text-sm text-right text-foreground bg-card focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
            :class="isPro ? '' : 'opacity-50 cursor-not-allowed'"
            :disabled="!isPro"
            @click.stop
        />
      </div>
    </div>

    <!-- Action buttons - فقط در دسکتاپ -->
    <div v-if="!isMobile" class="flex justify-between pt-6 border-t border-border">
      <button
          @click="resetToDefault"
          class="text-sm px-5 py-2.5 rounded-xl border border-border hover:bg-muted transition-colors text-foreground"
          :class="isPro ? '' : 'opacity-50 cursor-not-allowed'"
          :disabled="!isPro"
      >
        بازنشانی پیش‌فرض
      </button>
      <div class="flex gap-3">
        <button
            class="text-sm px-5 py-2.5 rounded-xl border border-border hover:bg-muted transition-colors text-foreground"
            :disabled="!isPro"
            @click="checkProBeforeAction"
        >
          انصراف
        </button>
        <button
            @click="saveForm"
            class="text-sm px-6 py-2.5 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 transition-colors font-medium"
        >
          ذخیره تغییرات
        </button>
      </div>
    </div>

    <!-- Mobile extra fields -->
    <div v-if="isMobile" class="space-y-4">
      <div @click="checkProBeforeAction" class="space-y-2">
        <label class="block text-sm font-medium text-foreground">متن دکمه ارسال</label>
        <input
            type="text"
            v-model="form.connectButtonText"
            placeholder="مثال: ارسال پیام"
            class="w-full border border-border rounded-xl px-4 py-3.5 text-sm text-right text-foreground bg-card focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
            :class="isPro ? '' : 'opacity-50 cursor-not-allowed'"
            :disabled="!isPro"
            @click.stop
        />
      </div>
      <div @click="checkProBeforeAction" class="space-y-2">
        <label class="block text-sm font-medium text-foreground">توضیح فرم</label>
        <input
            type="text"
            v-model="form.formDisclaimer"
            placeholder="مثال: اطلاعات شما محفوظ است"
            class="w-full border border-border rounded-xl px-4 py-3.5 text-sm text-right text-foreground bg-card focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
            :class="isPro ? '' : 'opacity-50 cursor-not-allowed'"
            :disabled="!isPro"
            @click.stop
        />
      </div>
    </div>
  </div>
  <InfoToast :visible="showToast" :message="toastMessage" :icon="toastIcon"/>
</template>

<script setup>
import {ref, onMounted, onUnmounted, computed} from 'vue'
import draggable from 'vuedraggable'
import {useFormStore, defaultFields} from '~/stores/form'
import {useUserStore} from "~/stores/user.js";
import InfoToast from "~/components/UserDashboard/modals/InfoToast.vue";


const form = useFormStore()
const userStore = useUserStore()
const user = computed(() => userStore.user)
const showBanner = ref(false)
const isPro = ref(user.value?.isPro)
const props = defineProps({
  cardId: String,
  isMobile: {
    type: Boolean,
    default: false
  }
})
const dropdownOpen = ref(false)
const expandedFields = ref({})
const {$axios} = useNuxtApp();
let bannerTimeout = null
const formTouched = ref(false)
const titleError = computed(() => !form.formTitle?.trim())

//Add Toast
const showToast = ref(false)
const toastMessage = ref('')
const toastIcon = ref('ti-alert-triangle')
const showInfoToast = (message, icon = 'ti-check') => {
  toastMessage.value = message
  toastIcon.value = icon
  showToast.value = true
  setTimeout(() => showToast.value = false, 3000)
}

const isLeadCaptureEnabled = computed({
  get: () => form.isLeadCaptureEnabled,
  set: async (val) => {
    // اول چک کن که cardId معتبر باشه
    if (!props.cardId) {
      showInfoToast('خطا: شناسه کارت یافت نشد', 'ti-alert-triangle')
      return
    }
    
    if (val && form.singleLink) {
      form.singleLink = false
      try {
        await $axios.patch(`v1/cards/${props.cardId}/singlelink`, {is_single_link: false})
      } catch (error) {
        console.error('Error disabling single link:', error)
      }
    }

    form.toggleLeadCapture(val)

    try {
      const response = await $axios.patch(`v1/cards/${props.cardId}/leadcapture`, {
        is_lead_capture_enabled: val
      })
      showInfoToast(response.data.message || (val ? 'فرم ارتباط فعال شد' : 'فرم ارتباط غیرفعال شد'), 'ti-check')
    } catch (error) {
      // اگر خطا خورد، وضعیت رو برگردون
      form.toggleLeadCapture(!val)
      showInfoToast(error.response?.data?.message || 'خطا در تغییر وضعیت فرم', 'ti-alert-triangle')
    }
  }
})

// Listen for save event from parent (mobile)
const handleMobileSave = () => {
  saveForm()
}

onMounted(() => {
  const savedForm = localStorage.getItem('leadCaptureForm')

  if (savedForm) {
    const data = JSON.parse(savedForm)
    form.formTitle = data.formTitle || ''
    form.connectButtonText = data.connectButtonText || 'ارسال'
    form.formDisclaimer = data.formDisclaimer || 'اطلاعات شما محرمانه می‌ماند'
    form.fields = data.fields || []
  }

  if (form.fields.length === 0) {
    form.fields = JSON.parse(JSON.stringify(defaultFields))
  }

  form.fields.forEach(field => {
    if (field.type === 'dropdown' && field.options) {
      expandedFields.value[field.id] = false
    }
  })

  // Listen for mobile save event
  window.addEventListener('lead-capture-save', handleMobileSave)
})

onUnmounted(() => {
  window.removeEventListener('lead-capture-save', handleMobileSave)
})


const checkProBeforeAction = (event) => {
  if (!isPro.value) {
    showBanner.value = true
    clearTimeout(bannerTimeout)
    bannerTimeout = setTimeout(() => {
      showBanner.value = false
    }, 5000)
    if (event && event.preventDefault) {
      event.preventDefault()
      event.stopPropagation()
    }
    return false
  }
  return true
}

const getFieldIcon = (type) => {
  const icons = {
    text: 'ti ti-forms',
    dropdown: 'ti ti-selector',
    checkbox: 'ti ti-checkbox',
    file: 'ti ti-paperclip'
  }
  return icons[type] || 'ti ti-forms'
}

const toggleDropdown = () => {
  if (!checkProBeforeAction({target: {disabled: !isPro.value}})) return
  dropdownOpen.value = !dropdownOpen.value
}

const toggleFieldExpansion = (fieldId) => {
  if (!checkProBeforeAction({target: {disabled: !isPro.value}})) return
  expandedFields.value[fieldId] = !expandedFields.value[fieldId]
}

function generateUniqueName(type = 'file', existingNames = []) {
  let index = 1
  let name = `${type}_${index}`

  while (existingNames.includes(name)) {
    index++
    name = `${type}_${index}`
  }

  return name
}

const addField = (type, preset = '') => {
  if (!checkProBeforeAction({target: {disabled: !isPro.value}})) return

  const id = Date.now().toString()

  const existingNames = form.fields.map(f => f.name)

  const name = generateUniqueName(type,existingNames)

  let field = {id, label: '',name, required: false, type}

  if (type === 'text') field.label = 'فیلد متنی'
  else if (type === 'dropdown') {
    if (preset === 'countries') {
      field.label = 'لیست کشورها'
      field.options = ['ایران', 'ترکیه', 'افغانستان']
    } else if (preset === 'states') {
      field.label = 'لیست استان‌ها'
      field.options = ['تهران', 'اصفهان', 'مشهد']
    } else {
      field.label = 'کشویی'
      field.options = ['']
    }
    expandedFields.value[id] = true
  } else if (type === 'checkbox') field.label = 'چک‌باکس'
  else if (type === 'file') field.label = 'فایل'
  else field.label = 'فیلد جدید'

  form.fields.push(field)
  dropdownOpen.value = false
}

const addOption = (fieldIndex) => {
  if (!form.fields[fieldIndex].options) form.fields[fieldIndex].options = []
  form.fields[fieldIndex].options.push('')
}

const removeOption = (fieldIndex, optionIndex) => {
  form.fields[fieldIndex].options.splice(optionIndex, 1)
}

const handleToggle = (index) => {
  if (!checkProBeforeAction({target: {disabled: !isPro.value}})) return
  form.fields[index].required = !form.fields[index].required
}

const handleRemoveField = (index) => {
  if (!checkProBeforeAction({target: {disabled: !isPro.value}})) return
  const fieldId = form.fields[index].id
  delete expandedFields.value[fieldId]
  form.fields.splice(index, 1)
}

const onDragEnd = () => {
}

const resetToDefault = () => {
  if (!checkProBeforeAction({target: {disabled: !isPro.value}})) return

  if (confirm('آیا مطمئن هستید که می‌خواهید فرم را به حالت پیش‌فرض بازنشانی کنید؟')) {
    form.formTitle = ''
    form.connectButtonText = 'ارسال'
    form.formDisclaimer = 'اطلاعات شما محرمانه می‌ماند'
    form.fields = []
    isLeadCaptureEnabled.value = false
    expandedFields.value = {}
    formTouched.value = false
  }
}

const saveForm = async () => {
  // کاربر رایگان فقط میتونه فعال/غیرفعال کنه، نه ذخیره فیلدها
  if (!isPro.value) {
    showInfoToast('برای ذخیره تغییرات فرم، به PRO ارتقا دهید', 'ti-crown')
    return
  }
  
  formTouched.value = true
  
  // Validate title only when user tries to save
  if (titleError.value) {
    showInfoToast('لطفا عنوان فرم را وارد کنید', 'ti-alert-triangle')
    return
  }

  try {
    const saveEvent = new CustomEvent('manual-save', {
      detail: {source: 'lead-capture-form'}
    })
    window.dispatchEvent(saveEvent)

    form.formTitle = form.formTitle || ''
    form.connectButtonText = form.connectButtonText || 'ارسال'
    form.formDisclaimer = form.formDisclaimer || 'اطلاعات شما محرمانه می‌ماند'
    form.fields = Array.isArray(form.fields) ? [...form.fields] : []

    const response = await saveLeadSettings(form, props.cardId)
    showInfoToast(response.message, 'ti-check')
  } catch (error) {
    showInfoToast(error.response?.data?.message || 'خطا در ذخیره فرم', 'ti-alert-triangle')
  }
}

const saveLeadSettings = async (form, cardId) => {

  try {
    // تنظیف و نرمال‌سازی فیلدها
    const cleanedFields = form.fields.map(field => ({
      id: field.id,
      label: field.label?.trim() || '',
      name: field.name || '',
      required: field.required ?? false,
      type: field.type || 'text',
      options: field.type === 'dropdown' && Array.isArray(field.options) 
        ? field.options.filter(opt => opt && opt.trim()).map(opt => opt.trim())
        : []
    }))

    const response = await $axios.post(`v1/cards/${cardId}/leadsetting`, {
      formTitle: form.formTitle?.trim() || '',
      fields: cleanedFields,
      submitButtonText: form.connectButtonText?.trim() || 'ارسال',
      formDisclaimer: form.formDisclaimer?.trim() || 'اطلاعات شما محرمانه می‌ماند'
    })
    showInfoToast(response.data.message, 'ti-check')
    return response.data
  } catch (error) {
    showInfoToast(error.response.data.message, 'ti-alert-triangle')
  }
}
</script>


<style>
.animate-gradient-x {
  animation: gradient-x 3s ease infinite;
  background-size: 300% 300%;
}

@keyframes gradient-x {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}
</style>