<template>
  <div class="w-full p-4 sm:p-6 lg:p-8">
    <!-- Header Section -->
    <div class="mb-8 flex justify-between items-center">
      <div>
        <h1 class="text-3xl font-bold text-slate-900 dark:text-white mb-2">
          سوالات متداول
        </h1>
        <p class="text-slate-600 dark:text-slate-400">
          مدیریت سوالات پرتکرار کاربران
        </p>
      </div>
      <button
          @click="openCreateForm"
          class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
      >
        <i class="ti ti-plus"></i>
        افزودن سوال
      </button>
    </div>

    <!-- لیست سوالات -->
    <div v-if="faqStore.loading" class="text-center py-10 text-gray-500">در حال بارگذاری...</div>
    <div v-else class="space-y-4">
      <div
          v-for="(faq, index) in paginatedFaqs"
          :key="faq.id"
          class="bg-white dark:bg-slate-800 rounded-lg shadow-md overflow-hidden"
      >
        <div class="flex justify-between items-center p-4 cursor-pointer" @click="toggle(faq.id)">
          <div class="flex items-center gap-2">
            <i class="ti ti-help text-yellow-500"></i>
            <h2 class="text-lg font-semibold text-slate-900 dark:text-white">
              {{ faq.question }}
            </h2>
          </div>
          <i
              class="ti ti-chevron-down text-slate-500 dark:text-slate-400 transition-transform duration-300"
              :class="{ 'rotate-180': faqOpenMap[faq.id] }"
          ></i>
        </div>

        <transition name="faq-slide">
          <div
              v-show="faqOpenMap[faq.id]"
              class="border-t border-slate-200 dark:border-slate-700 p-4 space-y-3"
          >
            <p class="text-slate-700 dark:text-slate-300">{{ faq.answer }}</p>

            <div class="flex justify-end gap-3 text-sm">
              <button
                  @click.stop="editFaq(faq)"
                  class="text-blue-600 hover:text-blue-800 flex items-center gap-1"
              >
                <i class="ti ti-edit"></i> ویرایش
              </button>
              <button
                  @click.stop="deleteFaq(faq.id)"
                  class="text-red-600 hover:text-red-800 flex items-center gap-1"
              >
                <i class="ti ti-trash"></i> حذف
              </button>
            </div>
          </div>
        </transition>
      </div>
    </div>

    <!-- Pagination -->
    <div v-if="faqStore.faqs.length > perPage" class="flex justify-center items-center gap-2 mt-8">
      <button
          v-for="page in totalPages"
          :key="page"
          @click="currentPage = page"
          :class="[
            'px-3 py-1 rounded-full border',
            currentPage === page
              ? 'bg-blue-600 text-white border-blue-600'
              : 'bg-white dark:bg-slate-800 text-gray-700 dark:text-gray-300 border-gray-300'
          ]"
      >
        {{ page }}
      </button>
    </div>

    <!-- Modal Form -->
    <div
        v-if="showForm"
        class="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
    >
      <div class="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-xl w-full max-w-lg space-y-4">
        <h2 class="text-xl font-bold mb-2 text-slate-900 dark:text-white">
          {{ editingFaq ? 'ویرایش سوال' : 'افزودن سوال جدید' }}
        </h2>

        <div class="space-y-3">
          <input
              v-model="form.question"
              type="text"
              placeholder="عنوان سوال"
              class="w-full p-2 border rounded dark:bg-slate-700 dark:text-white"
          />
          <textarea
              v-model="form.answer"
              rows="4"
              placeholder="پاسخ سوال"
              class="w-full p-2 border rounded dark:bg-slate-700 dark:text-white"
          ></textarea>
        </div>

        <div class="flex justify-end gap-3 mt-4">
          <button
              @click="closeForm"
              class="px-4 py-2 rounded bg-gray-200 dark:bg-slate-700 dark:text-white"
          >
            انصراف
          </button>
          <button
              @click="saveFaq"
              class="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
          >
            ذخیره
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import {type FAQ, useFaqStore} from "@/stores/faq.ts";
const faqOpenMap = ref<Record<number, boolean>>({})
const faqStore = useFaqStore()

// صفحه‌بندی
const currentPage = ref(1)
const perPage = 5
const totalPages = computed(() => Math.ceil(faqStore.faqs.length / perPage))
const paginatedFaqs = computed(() =>
    faqStore.faqs.slice((currentPage.value - 1) * perPage, currentPage.value * perPage)
)

// حالت فرم
const showForm = ref(false)
const editingFaq = ref(false)
const form = ref<Partial<FAQ>>({
  question: '',
  answer: '',
  active: true
})

// ✅ بارگذاری اولیه FAQها
onMounted(async () => {
  await faqStore.fetchFaqs()
  faqStore.faqs.forEach(f => {
    faqOpenMap.value[f.id] = false
  })
})

// باز و بسته کردن سوال
const toggle = (id: number) => {
  faqOpenMap.value[id] = !faqOpenMap.value[id]
}


// باز کردن فرم ایجاد
const openCreateForm = () => {
  editingFaq.value = false
  form.value = { question: '', answer: '', active: true } // بدون id
  showForm.value = true
}

// ویرایش سوال
const editFaq = (faq: any) => {
  editingFaq.value = true
  form.value = { ...faq }
  showForm.value = true
}

// حذف سوال
const deleteFaq = async (id: number) => {
  if (confirm('آیا از حذف این سوال اطمینان دارید؟')) {
    await faqStore.deleteFaq(id)
  }
}

// ذخیره (افزودن یا ویرایش)
const saveFaq = async () => {
  if (!form.value.question || !form.value.answer)
    return alert('لطفاً تمام فیلدها را پر کنید.')

  if (editingFaq.value && form.value.id !== undefined) {
    await faqStore.updateFaq(form.value.id, form.value)
  } else {
    await faqStore.createFaq(form.value)
  }

  await faqStore.fetchFaqs()
  closeForm()
}


// بستن فرم
const closeForm = () => {
  showForm.value = false
}
</script>

<style scoped>
.faq-slide-enter-active,
.faq-slide-leave-active {
  transition: all 0.3s ease;
}
.faq-slide-enter-from,
.faq-slide-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>
