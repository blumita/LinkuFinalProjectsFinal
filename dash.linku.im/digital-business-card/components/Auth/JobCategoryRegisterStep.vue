<template>
  <div class="relative w-full my-4" ref="dropdownRef">
    <label class="block text-sm font-medium text-gray-700 mb-1">دسته‌بندی شغل</label>
    <div @click="toggleDropdown" class="flex justify-between items-center border border-gray-300 rounded-lg px-4 py-3 cursor-pointer">
      <span>{{ selectedCategoryName || 'انتخاب کنید...' }}</span>
      <i class="ti ti-chevron-down transition-transform" :class="{ 'rotate-180': isOpen }"></i>
    </div>
    <transition name="fade">
      <ul v-if="isOpen" class="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg max-h-64 overflow-y-auto shadow-lg">
        <li
          v-for="group in categories"
          :key="group.code"
          class="text-sm text-gray-500 px-4 py-2 font-bold bg-gray-50"
        >
          {{ group.name }}
          <ul>
            <li
              v-for="sub in group.subcategories"
              :key="sub.code"
              @click="selectCategory(sub)"
              class="px-4 py-2 text-gray-700 cursor-pointer hover:bg-gray-100"
            >
              {{ sub.name }}
            </li>
          </ul>
        </li>
      </ul>
    </transition>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import categories from '@/data/jobCategories.json'

const selectedCategory = ref(null)
const selectedCategoryName = ref('')
const isOpen = ref(false)
const dropdownRef = ref(null)

const toggleDropdown = () => {
  isOpen.value = !isOpen.value
}

const selectCategory = (sub) => {
  selectedCategory.value = sub.code
  selectedCategoryName.value = sub.name
  isOpen.value = false
}

const handleClickOutside = (event) => {
  if (dropdownRef.value && !dropdownRef.value.contains(event.target)) {
    isOpen.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside)
})

defineExpose({
  selectedCategory,
  selectedCategoryName
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
</style>