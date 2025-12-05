<template>
  <div class="w-full h-full">
    <!-- نمایش چیدمان اصلی -->
    <component
      :is="layoutComponent"
      :form="mergedFormData"
      class="w-full h-full"
    />

    <!-- نمایش فرم لید به صورت پاپ‌آپ جداگانه - فقط در حالت پیش‌نمایش -->
    <!-- در حالت edit نمایش نمی‌دهیم تا مانع ویرایش نشود -->
    <Layouts.LayoutLeadForm
      v-if="mergedFormData.isLeadCaptureEnabled && showLeadFormPreview"
      :form="mergedFormData"
      @close="showLeadFormPreview = false"
      class="absolute inset-0 z-50 bg-white/10 backdrop-blur-[1px] flex items-center justify-center m-0"
    />
  </div>
</template>

<script setup lang="ts">
import {computed, onMounted, ref, watch} from 'vue'
import {useFormStore} from '~/stores/form'
import * as Layouts from '@/components/UserDashboard/main/EditCard/Preview/layouts'

// دریافت props از والد
const props = defineProps<{
  form?: any // داده‌های فرم از EditCard
}>()

// وضعیت نمایش فرم لید - به صورت پیش‌فرض false تا مانع ویرایش نشود
const showLeadFormPreview = ref(false)

const formStore = useFormStore()

// برای مدیریت وضعیت نمایش گزینه‌های کشویی
const expandedFields = ref<{ [key: string]: boolean }>({})

// ترکیب داده‌های فرم از props و store و به‌روزرسانی store
const mergedFormData = computed(() => {
  // اگر فرم از props آمده، آن را با store ترکیب کن و store رو هم به‌روزرسانی کن
  if (props.form) {
    // به‌روزرسانی store با داده‌های props (برای real-time preview)
    const storeState = formStore.$state as any
    Object.keys(props.form).forEach(key => {
      if (storeState[key] !== undefined && props.form[key] !== undefined) {
        storeState[key] = props.form[key]
      }
    })
    
    // اگر showLeadFormPreview از props آمده، آن را به‌کار بریم
    if (props.form.showLeadFormPreview !== undefined) {
      showLeadFormPreview.value = props.form.showLeadFormPreview
    }

    return {
      ...formStore.$state,
      ...props.form,
      // اطمینان از وجود این فیلدهای مهم
      formTitle: props.form.formTitle || formStore.formTitle,
      connectButtonText: props.form.connectButtonText || formStore.connectButtonText,
      formDisclaimer: props.form.formDisclaimer || formStore.formDisclaimer,
      fields: props.form.fields || formStore.fields,
      links: props.form.links || formStore.links,
      singleLink: props.form.singleLink !== undefined ? props.form.singleLink : formStore.singleLink,
      isLeadCaptureEnabled: props.form.isLeadCaptureEnabled !== undefined ? props.form.isLeadCaptureEnabled : formStore.isLeadCaptureEnabled
    }
  }
  
  // در غیر این صورت فقط از store استفاده کن
  return formStore.$state
})

// تصمیم‌گیری برای layout اصلی (غیر از lead)
const layoutComponent = computed(() => {
  const formData = mergedFormData.value
  
  if (formData.singleLink) return Layouts.LayoutSingle

  const layoutMap: Record<string, any> = {
    right: Layouts.LayoutRight,
    left: Layouts.LayoutLeft,
    center: Layouts.LayoutCenter,
    portrait: Layouts.LayoutPortrait
  }

  return layoutMap[formData.layout] || Layouts.LayoutRight
})

// نظارت بر تغییرات props.form برای sync با store
watch(() => props.form, (newForm) => {
  if (newForm) {
    // به‌روزرسانی store با داده‌های جدید props
    const storeState = formStore.$state as any
    Object.keys(newForm).forEach(key => {
      if (storeState[key] !== undefined && newForm[key] !== undefined) {
        storeState[key] = newForm[key]
      }
    })
  }
}, { deep: true, immediate: true })

// لود کردن فرم پس از بارگذاری
onMounted(() => {
  const savedForm = localStorage.getItem('leadCaptureForm')
  if (savedForm) {
    const data = JSON.parse(savedForm)
    formStore.formTitle = data.formTitle || ''
    formStore.connectButtonText = data.connectButtonText || 'اتصال'
    formStore.formDisclaimer = data.formDisclaimer || 'ما اطلاعات شما را به اشتراک نمی‌گذاریم'
    formStore.fields = data.fields || []
  }

  // راه‌اندازی اکاردئون‌ها
  mergedFormData.value.fields.forEach((field: any) => {
    if (field.type === 'dropdown' && field.options) {
      expandedFields.value[field.id] = false
    }
  })
})
</script>

<style scoped>
/* استایل‌های اضافی یا دلخواه */
</style>