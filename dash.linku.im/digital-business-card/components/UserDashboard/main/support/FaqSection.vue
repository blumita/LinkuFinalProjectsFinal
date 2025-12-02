<template>
  <div>
    <!-- تیتر -->
    <h3 class="text-xl font-bold text-primary mb-2 flex items-center gap-2">
      <i class="ti ti-help text-xl text-primary"></i>
      سوالات متداول
    </h3>

    <!-- سوالات صفحه جاری -->
    <div
      v-for="(faq, index) in paginatedFaqs"
      :key="index"
      class="border border-border rounded-lg bg-secondary"
    >
      <button
        @click="toggle(index)"
        class="w-full flex justify-between items-center px-4 py-3 text-right hover:bg-primary transition"
      >
        <div class="flex items-center gap-2 text-primary">
          <i class="ti ti-question-mark"></i>
          <span class="font-medium">{{ faq.question }}</span>
        </div>
        <i :class="openIndex === index ? 'ti ti-chevron-up' : 'ti ti-chevron-down'" class="text-primary"></i>
      </button>

      <transition name="fade">
        <div
          v-if="openIndex === index"
          class="px-4 py-4 text-sm text-primary opacity-80 leading-relaxed"
        >
          <i class="ti ti-info-circle opacity-60 ml-1"></i>
          {{ faq.answer }}
        </div>
      </transition>
    </div>

    <!-- صفحه‌بندی -->
    <div v-if="totalPages > 1" class="flex justify-center gap-2 mt-6">
      <button
        v-for="page in totalPages"
        :key="page"
        @click="currentPage = page"
        :class="[
          'px-3 py-1 text-sm border',
          currentPage === page
            ? 'accent-bg accent-text border-accent'
            : 'bg-secondary text-primary hover:bg-primary border-border',
          'rounded-md transition'
        ]"
      >
        {{ page }}
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'FaqSection',
  data() {
    return {
      faqs: [],
      currentPage: 1,
      perPage: 5,
      openIndex: null
    }
  },
  computed: {
    totalPages() {
      return Math.ceil(this.faqs.length / this.perPage)
    },
    paginatedFaqs() {
      const start = (this.currentPage - 1) * this.perPage
      return this.faqs.slice(start, start + this.perPage)
    }
  },
  methods: {
    toggle(index) {
      this.openIndex = this.openIndex === index ? null : index
    },
    async fetchFaqs() {
      this.loading = true
      this.error = null
      const {$axios}=useNuxtApp()
      try {
        const res = await $axios.get('faq/list')
        this.faqs = res.data.data || []
      } catch (err) {
        this.error = err.message || 'خطا در دریافت سوالات'
      } finally {
        this.loading = false
      }
    }
  },
  mounted() {
    this.fetchFaqs()
  }
}
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: all 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(-5px);
}
</style>
