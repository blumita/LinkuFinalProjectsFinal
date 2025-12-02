<template>
  <div v-cloak class="w-full">
    <!-- Main card -->
    <div :class="[
      'backdrop-blur rounded-xl overflow-hidden',
      isDarkTheme ? 'bg-white/[0.02]' : isLightTheme ? 'bg-black/[0.02]' : 'bg-gradient-to-br from-white/60 via-white/30 to-white/10 border border-white/20'
    ]">
      <button
        tabindex="0"
        role="button"
        :class="'flex items-center gap-4 p-2 w-full cursor-pointer hover:bg-white/20 transition-all duration-200 ' + (formData?.layout === 'left' ? 'text-left' : 'text-right')"
        @click="openPoll"
      >
        <div :class="['flex items-center justify-center flex-shrink-0 rounded-xl overflow-hidden w-12 h-12', isDarkTheme || isLightTheme ? '' : 'bg-white']">
          <component 
            :is="iconComponent"
            :size="50"
            v-bind="iconColor ? { color: iconColor, filled: isIconFilled } : {}"
          />
        </div>
        <div :class="'flex flex-col justify-center flex-1 min-w-0 ' + (formData?.layout === 'left' ? 'text-left' : 'text-right')">
          <div :class="['font-semibold text-sm leading-snug mb-1 ' + (formData?.layout === 'left' ? 'text-left' : 'text-right'), isDarkTheme ? 'text-white' : 'text-gray-800']">
            {{ link.title || 'What is your opinion?' }}
          </div>
          <div :class="'text-xs font-medium leading-relaxed flex items-center gap-1 ' + (formData?.layout === 'left' ? 'text-left' : 'text-right')">
            <span :class="isDarkTheme ? 'text-gray-300' : 'text-gray-500'">{{ link.description || 'Participate in the poll' }}</span>
          </div>
        </div>
      </button>
    </div>

    <BaseModal v-model="showPoll">
      <template #header>
        <div class="flex justify-between items-center p-4 border-b border-gray-100 bg-white">
          <div class="flex items-center gap-3">
            <component 
              :is="iconComponent"
              :size="50"
              v-bind="iconColor ? { color: iconColor, filled: isIconFilled } : {}"
            />
            <h3 class="text-lg font-semibold text-gray-800">نظر سنجی</h3>
          </div>
          <button 
            class="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
            @click="closePoll"
          >
            <i class="ti ti-x text-lg" />
          </button>
        </div>
      </template>
      <template #default>
        <div 
          class="flex-1 overflow-y-auto p-4"
          :class="formData?.layout === 'left' ? 'text-left' : 'text-right'"
        >
          <!-- Poll question -->
          <div 
            class="text-lg font-semibold text-gray-800 mb-6 leading-relaxed"
            :class="formData?.layout === 'left' ? 'text-left' : 'text-right'"
          >
            {{ link.title || 'What is your opinion?' }}
          </div>
          
          <!-- Poll options -->
          <template v-if="!voted">
            <div class="space-y-3 mb-6">
              <div
                v-for="(option, idx) in options"
                :key="idx"
                class="group relative"
              >
                <div
                  class="flex items-center gap-3 p-4 rounded-lg cursor-pointer transition-all duration-200"
                  :class="[
                    selected === idx 
                      ? 'bg-blue-50 border-2 border-blue-500' 
                      : 'bg-gray-50 border-2 border-transparent hover:bg-gray-100',
                    formData?.layout === 'left' ? 'text-left' : 'text-right'
                  ]"
                  @click="selected = option.id"
                >
                  <!-- Radio Button -->
                  <div 
                    class="flex-shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all"
                    :class="[
                      selected === option.id
                        ? 'border-blue-500 bg-blue-500' 
                        : 'border-gray-300 group-hover:border-blue-400'
                    ]"
                  >
                    <div 
                      v-if="selected === option.id"
                      class="w-2 h-2 bg-white rounded-full"
                    />
                  </div>
                  
                  <!-- Option text -->
                  <span 
                    class="flex-1 text-sm font-medium"
                    :class="[
                      selected === option.id ? 'text-blue-700' : 'text-gray-700',
                      formData?.layout === 'left' ? 'text-left' : 'text-right'
                    ]"
                  >
                    {{ option.text }}
                  </span>
                </div>
              </div>
            </div>
            
            <!-- Vote button -->
            <button
              class="w-full py-3 px-4 rounded-lg font-semibold text-sm transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              :class="[
                selected !== null 
                  ? 'bg-blue-500 hover:bg-blue-600 text-white shadow-sm' 
                  : 'bg-gray-200 text-gray-400'
              ]"
              :disabled="selected === null"
              @click="vote"
            >
              Vote
            </button>
          </template>
          
          <!-- Poll results -->
          <template v-else>
            <div class="space-y-3 mb-6">
              <div
                v-for="(option, idx) in options"
                :key="idx"
                class="relative"
              >
                <div class="p-4 rounded-lg bg-gray-50 relative overflow-hidden">
                  <!-- Percentage background -->
                  <div
                    class="absolute right-0 top-0 h-full rounded-lg transition-all duration-700 ease-out"
                    :class="[
                      selected === option.id ? 'bg-blue-500' : 'bg-gray-300'
                    ]"
                    :style="{ width: getPercent(option.votes) + '%' }"
                  />
                  
                  <!-- Option content -->
                  <div class="relative flex justify-between items-center">
                    <div class="flex items-center gap-3">
                      <!-- Selected icon -->
                      <div 
                        v-if="selected === option.id"
                        class="w-5 h-5 rounded-full bg-white flex items-center justify-center"
                      >
                        <i class="ti ti-check text-blue-500 text-xs" />
                      </div>
                      
                      <!-- Percentage -->
                      <span 
                        class="font-bold text-sm"
                        :class="[
                          getPercent(option.votes) > 15 && selected === option.id ? 'text-white' :
                          getPercent(option.votes) > 15 ? 'text-white' : 
                          'text-gray-700'
                        ]"
                      >
                        {{ getPercent(option.votes) }}%
                      </span>
                    </div>
                    
                    <!-- Option text -->
                    <span 
                      class="text-sm font-medium"
                      :class="[
                        getPercent(option.votes) > 15 && selected === option.id ? 'text-white' :
                        getPercent(option.votes) > 15 ? 'text-white' : 
                        'text-gray-700',
                        formData?.layout === 'left' ? 'text-left' : 'text-right'
                      ]"
                    >
                      {{ option.text }}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            
            <!-- Poll information -->
            <div class="text-center space-y-2">
              <div class="text-sm text-gray-500">
                <i class="ti ti-users text-gray-400 ml-1" />
                {{ totalVotes }} نظر ثبت شده
              </div>
              <div class="text-sm text-blue-600 font-medium">
                <i class="ti ti-check-circle text-blue-600 ml-1" />
                نطر شما ثبت شد
              </div>
            </div>
          </template>
        </div>
      </template>
    </BaseModal>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { useFormStore } from '~/stores/form'
import { useIconComponents } from '~/composables/useIconComponentsMap'
import BaseModal from './Modals/BaseModal.vue'
import {useNuxtApp} from "nuxt/app";
import InfoToast from "~/components/UserDashboard/modals/InfoToast.vue";

const inited = ref(false)
const props = defineProps({
  link: {
    type: Object,
    required: true
  },
  formData: { 
    type: Object, 
    required: false,
    default: () => ({})
  },
  isDarkTheme: {
    type: Boolean,
    default: false
  },
  isLightTheme: {
    type: Boolean,
    default: false
  },
  isBackgroundDark: {
    type: Boolean,
    default: false
  }
})
const emit=defineEmits('message')

// Get composable
const { getIconComponent } = useIconComponents()

// Store access
const formStore = useFormStore()
const formData = computed(() => props.formData || formStore)

// Get icon data and component
const iconData = computed(() => props.link?.icon || null)

// Icon color logic - return user selected color or undefined for default SVG colors
const iconColor = computed(() => {
  // If user selected color, use it
  if (formStore.iconColor?.background && 
      formStore.iconColor.background !== 'transparent') {
    return formStore.iconColor.background
  }
  // Otherwise, return undefined to use default SVG colors
  return undefined
})

const isIconFilled = computed(() => {
  return !!(formStore.iconColor?.background && 
           formStore.iconColor.background !== 'transparent')
})

const iconComponent = computed(() => {
  const component = getIconComponent(iconData.value)
  // Default to poll component if no component found
  if (!component) {
    return 'div' // fallback component
  }
  return component
})

const showPoll = ref(false)
const isMobile = ref(false)
const handleResize = () => {
  if (typeof window !== 'undefined') {
    isMobile.value = window.innerWidth < 1024
  }
}

onBeforeUnmount(() => {
  window.removeEventListener('resize', handleResize)
})

const link = props.link
const options = ref(
  (link.options || ['Option 1', 'Option 2', 'Option 3']).map(opt =>
    typeof opt === 'string' ? { text: opt, votes: 1 } : { ...opt, votes: opt.votes ?? 1 }
  )
)
const selected = ref(null)
const voted = ref(false)

const totalVotes = computed(() =>
    options.value.reduce((sum, o) => sum + (o.votes || 0), 0)
)

function getPercent(votes) {
  if (!totalVotes.value) return 0
  return Math.round((votes / totalVotes.value) * 100)
}
const {$axios}=useNuxtApp()
async function vote() {
  if (selected.value !== null) {
    voted.value = true

    try {
      await $axios.post(`/links/${props.link.hash}/vote/${selected.value}`)

      // افزایش رأی در گزینه انتخاب‌شده
      const option = options.value.find(o => o.id === selected.value)
      if (option) option.votes++

      const res = await $axios.get(`/links/${props.link.hash}/polls`)

      emit('message',res.data.message || 'رأی شما با موفقیت ثبت شد')
      options.value = res.data.poll.options.map(opt => ({
        id: opt.id,
        text: opt.text,
        votes: opt.votes_count ?? 0
      }))

      // پخش صدا (اختیاری)
      const audio = new Audio('/sounds/success.mp3')
      audio.volume = 0.3
      audio.play().catch(() => {})
    } catch (err) {
    }
  }
}

function openPoll() {
  showPoll.value = true
  inited.value = false
  requestAnimationFrame(() => {
    inited.value = true
  })
}
function closePoll() {
  showPoll.value = false
}

onMounted(async () => {
  handleResize()
  window.addEventListener('resize', handleResize)

  try {
    const res = await $axios.get(`/links/${props.link.hash}/polls`)
    options.value = res.data.poll.options.map(opt => ({
      id: opt.id,
      text: opt.text,
      votes: opt.votes_count ?? 0
    }))
  } catch (err) {
  }

  requestAnimationFrame(() => {
    inited.value = true
  })
})
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
