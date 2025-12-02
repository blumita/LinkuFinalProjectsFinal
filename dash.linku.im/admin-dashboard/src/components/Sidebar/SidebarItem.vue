<script setup lang="ts">
import { computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'

interface Props {
  text?: string
  icon?: string
  active?: boolean
  to?: string
  collapsed?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  text: '',
  icon: '',
  active: false,
  to: '',
  collapsed: false
})

const emit = defineEmits<{
  itemClicked: []
}>()

const router = useRouter()
const route = useRoute()

const isActive = computed(() => {
  if (props.to) {
    return route.path === props.to
  }
  // اگر هیچ مسیر مشخص نشده، آیتم پیشخوان اکتیو باشد
  return props.text === 'پیشخوان' && route.path === '/'
})

function handleClick(e: Event) {
  if (props.to) {
    e.preventDefault()
    if (route.path !== props.to) {
      router.push(props.to)
      emit('itemClicked')
    }
  } else if (props.text === 'پیشخوان') {
    e.preventDefault()
    if (route.path !== '/') {
      router.push('/')
      emit('itemClicked')
    }
  }
}
</script>

<template>
  <a
    :href="props.to || '#'"
    @click="handleClick"
    :class="[
      'flex items-center px-4 py-3 rounded-lg transition-all duration-300',
      isActive
        ? 'bg-blue-600 text-white shadow-md'
        : 'hover:bg-gray-100 dark:hover:bg-slate-700 text-gray-900 dark:text-white',
      props.collapsed ? 'justify-center' : 'justify-start'
    ]"
  >
    <i :class="[
      props.icon,
      'text-lg',
      isActive ? 'text-white' : 'text-gray-600 dark:text-gray-400',
      'transition-colors duration-300',
      props.collapsed ? '' : 'ml-2'
    ]"></i>
    <span
      v-if="!props.collapsed"
      class="transition-all duration-300 whitespace-nowrap font-medium"
    >
      {{ props.text }}
    </span>
  </a>
</template>
