<template>
  <div
      :class="[
      'flex items-center justify-between bg-gray-50 rounded-2xl px-4 py-3 transition',
      {
        'cursor-pointer hover:bg-gray-100': !isSingleLinkActive || isFirstLink,
        'touch-action-none user-select-none': isSingleLinkActive && !isFirstLink
      }
    ]"
      :style="isSingleLinkActive && !isFirstLink ? 'pointer-events: none; touch-action: none; user-select: none;' : ''"
      @click="handleItemClick"
  >
    <!-- Right side: Icon and title (with opacity for single link mode) -->
    <div
        class="flex items-center gap-3"
        :class="{ 'opacity-50': isSingleLinkActive && !isFirstLink }"
    >
      <!-- Drag handle -->
      <span class="drag-handle text-gray-300 cursor-grab" @click.stop>
        <i class="ti ti-grip-vertical text-lg"/>
      </span>

      <!-- Icon -->
      <div class="relative w-10 h-10 rounded-xl flex items-center justify-center bg-white">
        <!-- Dynamic icon component -->
        <component
            :is="iconComponent"
            v-if="iconComponent"
            :size="32"
            :color="hasCustomColor ? iconColor : undefined"
            :filled="hasCustomColor"
        />
        <!-- Fallback to image -->
        <img
            v-else-if="safeIconUrl"
            :src="safeIconUrl"
            class="w-full h-full object-contain"
            alt="icon"
        >
        <template v-else>
          <i v-if="(link as LinkItem & BlockItem).type === 'block'" class="ti ti-layout-grid text-gray-400 text-xl"/>
          <i v-else class="ti ti-link text-gray-400 text-xl"/>
        </template>
      </div>

      <!-- Title -->
      <div class="flex items-center gap-2">
        <!-- Usage count badge -->
        <div
            v-show="count > 1"
            class="bg-blue-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center border-2 border-white shadow-md"
            style="pointer-events: none;"
        >
          {{ count }}
        </div>

        <div class="flex flex-col">
          <p class="font-semibold text-sm text-black">
            {{ displayTitle }}
          </p>
          <!-- Show single link message for basic links -->
          <p v-if="isSingleLinkActive && isBasicLink && isBasicLink(link) && isFirstLink"
             class="text-xs text-gray-500 mt-1">
            Default link
          </p>
        </div>
      </div>
    </div>

    <!-- Left side: Actions -->
    <div class="flex items-center gap-2" style="opacity: 1 !important;">
      <!-- Delete (only if disabled and enabled field exists) -->
      <button
          v-if="'enabled' in link && link.enabled === false"
          class="text-gray-400 hover:text-red-700 transition p-2"
          style="opacity: 1 !important; min-width: 44px; min-height: 44px;"
          title="Delete"
          @click.stop.prevent="handleDelete"
          @touchend.stop.prevent="handleDelete"
      >
        <i class="ti ti-trash text-lg"/>
      </button>

      <!-- In single link mode: select button instead of toggle -->
      <template v-if="isSingleLinkActive">
        <!-- Select first link button (for links and only contact card blocks) -->
        <button
            v-if="!isFirstLink && ((link as LinkItem & BlockItem).type !== 'block' || (link as LinkItem & BlockItem).action === 'contactcard')"
            class="px-3 py-2 bg-gray-200 text-gray-600 text-sm font-medium rounded-lg border-none hover:bg-gray-300 transition-all duration-200 flex items-center gap-1 cursor-pointer"
            style="opacity: 1 !important; position: relative; z-index: 10; pointer-events: auto !important; touch-action: manipulation !important; user-select: auto !important; min-height: 44px;"
            @click.stop.prevent="selectAsFirstLink"
            @touchend.stop.prevent="selectAsFirstLink"
        >
          <i class="ti ti-arrow-up text-xs"/>
          انتخاب به عنوان پیش فرض
        </button>

        <!-- For first link: active toggle -->
        <label
            v-else-if="isFirstLink"
            class="relative inline-flex items-center cursor-pointer p-2"
            style="opacity: 1 !important; z-index: 10; min-width: 44px; min-height: 44px;"
            @click.stop.prevent="handleToggleClick"
            @touchend.stop.prevent="handleToggleClick"
        >
          <input
              type="checkbox"
              class="sr-only peer"
              :checked="('enabled' in (link as Record<string, any>) ? (link as Record<string, any>).enabled : true)"
              @change.stop.prevent="handleToggleChange"
          >
          <div class="w-11 h-6 bg-gray-300 rounded-full peer peer-checked:bg-black transition-colors"/>
          <div
              class="absolute left-0.5 top-0.5 bg-white w-5 h-5 rounded-full shadow transition-transform peer-checked:translate-x-5"
          />
        </label>

        <!-- For blocks other than contact card: disabled message -->
        <span
            v-else-if="(link as LinkItem & BlockItem).type === 'block' && (link as LinkItem & BlockItem).action !== 'contactcard'"
            class="px-3 py-2 bg-gray-100 text-gray-400 text-sm font-medium rounded-lg cursor-not-allowed flex items-center gap-1">
          <i class="ti ti-ban text-xs"/>
         این گزینه نمی تواند لینک اول انتخاب شود
        </span>
      </template>

      <!-- In normal mode: activation switch -->
      <template v-else>
        <label
            class="relative inline-flex items-center cursor-pointer p-2"
            style="opacity: 1 !important; z-index: 10; min-width: 44px; min-height: 44px;"
            @click.stop.prevent="handleToggleClick"
            @touchend.stop.prevent="handleToggleClick"
        >
          <input
              type="checkbox"
              class="sr-only peer"
              :checked="('enabled' in (link as Record<string, any>) ? (link as Record<string, any>).enabled : true)"
              @change.stop.prevent="handleToggleChange"
          >
          <div class="w-11 h-6 bg-gray-300 rounded-full peer peer-checked:bg-black transition-colors"/>
          <div
              class="absolute left-0.5 top-0.5 bg-white w-5 h-5 rounded-full shadow transition-transform peer-checked:translate-x-5"
          />
        </label>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import {computed, inject, ref} from 'vue'
import type {LinkItem, BlockItem} from '~/types/data'
import {useFormStore} from '~/stores/form'
import {useIconComponents} from '~/composables/useIconComponentsMap'
import {useToast} from '~/composables/useToast'

const {warning} = useToast()

const props = defineProps<{
  link: LinkItem | BlockItem,
  count: number,
}>()

// Use form store directly for icon colors
const formStore = useFormStore()

// بررسی اینکه آیا کاربر رنگ سفارشی انتخاب کرده
const hasCustomColor = computed(() => {
  return !!(formStore.iconColor?.background &&
      formStore.iconColor.background !== 'transparent')
})

// رنگ آیکون - فقط وقتی رنگ سفارشی انتخاب شده
const iconColor = computed(() => {
  if (hasCustomColor.value) {
    return formStore.iconColor.background
  }
  return undefined
})

// Get composable functions
const {getIconComponent} = useIconComponents()

// Icon data and component computation
const iconData = computed(() => {
  return (props.link as LinkItem | BlockItem).icon || null
})

// Create safeIconUrl computed for image icons
const safeIconUrl = computed(() => {
  const icon = iconData.value
  if (icon && typeof icon === 'object') {
    const iconWithUrl = icon as { url?: string }
    if (iconWithUrl.url) {
      return iconWithUrl.url
    }
  }
  return null
})

// inject function isBasicLink and singleLink from parent
const isBasicLink = inject<((link: unknown) => boolean) | null>('isBasicLink', null)
const singleLink = inject<Ref<boolean> | boolean>('singleLink', ref(false))

// computed for accessing value
const isSingleLinkActive = computed(() => {
  if (typeof singleLink === 'boolean') return singleLink
  return singleLink?.value || false
})

// Detect if this is the first link
const isFirstLink = computed(() => {
  return (props.link as LinkItem & { index?: number }).index === 0
})

const iconComponent = computed(() => {
  const icon = iconData.value
  if (icon && typeof icon === 'object') {
    return getIconComponent(icon)
  }
  return null
})

// Handle click for single link mode
function handleItemClick() {
  // If single link is active
  if (isSingleLinkActive.value) {
    // If it's the first link, normal edit
    if (isFirstLink.value) {
      emit('edit', props.link)
      return
    }
    // If it's a block and not a contact card, show error message
    const linkWithType = props.link as LinkItem & BlockItem
    if (linkWithType.type === 'block' && linkWithType.action !== 'contactcard') {
      warning('انتخاب نامعتبر', 'فقط بلاک کارت تماس می‌تواند به عنوان اولین لینک انتخاب شود')
      return
    }
    // Do nothing in single link mode for other links
    return
  }
  // In normal mode, edit
  emit('edit', props.link)
}

// Handle delete
function handleDelete(event?: Event) {
  if (event) {
    event.stopPropagation()
    event.preventDefault()
  }
  emit('remove', props.link.id)
}

// Function to select this link as first link
function selectAsFirstLink(event?: Event) {
  if (event) {
    event.stopPropagation()
    event.preventDefault()
  }
  // Check if it's a block and not a contact card
  const linkWithType = props.link as LinkItem & BlockItem
  if (linkWithType.type === 'block' && linkWithType.action !== 'contactcard') {
    warning('انتخاب نامعتبر', 'فقط بلاک کارت تماس می‌تواند به عنوان اولین لینک انتخاب شود')
    return
  }
  emit('select-as-single', props.link)
}

// Handle toggle click
function handleToggleClick(event?: Event) {
  if (event) {
    event.stopPropagation()
    event.preventDefault()
  }
  // If it's a block and single link is active, don't allow change
  const linkWithType = props.link as LinkItem & BlockItem
  if (linkWithType.type === 'block' && isSingleLinkActive.value) {
    return
  }
  // Emit toggle event
  emit('toggle', props.link.id)
}

// Handle toggle change
function handleToggleChange(event?: Event) {
  if (event) {
    event.stopPropagation()
    event.preventDefault()
  }
  // If it's a block and single link is active, don't allow change
  const linkWithType = props.link as LinkItem & BlockItem
  if (linkWithType.type === 'block' && isSingleLinkActive.value) {
    return
  }
  emit('toggle', props.link.id)
}

// Define emits
const emit = defineEmits(['edit', 'toggle', 'remove', 'select-as-single'])

// inject categories from parent if available
const categories = inject<unknown[] | null>('categories', null)

const displayTitle = computed((): string => {
  const link = props.link as Partial<LinkItem & BlockItem>;
  // If it has displayName or title or name, return it
  if (typeof link.displayName === 'string' && link.displayName.trim()) return link.displayName.trim();
  if (typeof link.title === 'string' && link.title.trim()) return link.title.trim();
  if (typeof link.name === 'string' && link.name.trim()) return link.name.trim();
  // If type is block and categories exist, find name from API (categories)
  if (link.type === 'block' && categories && Array.isArray(categories)) {
    for (const cat of categories) {
      if (cat && typeof cat === 'object' && 'items' in cat && Array.isArray(cat.items)) {
        const found = cat.items.find((i: unknown) => {
          if (i && typeof i === 'object') {
            const item = i as Record<string, unknown>
            return item.id === link.id || item.name === link.name || item.title === link.title
          }
          return false
        });
        if (found && typeof found === 'object') {
          const foundItem = found as Record<string, unknown>
          if (foundItem.displayName && typeof foundItem.displayName === 'string' && foundItem.displayName.trim()) return foundItem.displayName.trim();
          if (foundItem.title && typeof foundItem.title === 'string' && foundItem.title.trim()) return foundItem.title.trim();
          if (foundItem.name && typeof foundItem.name === 'string' && foundItem.name.trim()) return foundItem.name.trim();
        }
      }
    }
  }
  // Default
  return link.type === 'block' ? 'Untitled Block' : 'Untitled';
})

// Function to get usage count for testing (some test cases)
function getUsageCount(link: LinkItem | BlockItem): number {
  // Debug: log the link data

  // For testing, return numbers for specific items
  const action = String(link.action || link.id || link.name || '');

  // Various tests for displaying badge
  switch (action.toLowerCase()) {
    case 'instagram':
      return 3;
    case 'telegram':
      return 2;
    case 'email':
      return 4;
    case 'spotify':
      return 2;
    case 'luckyegg':
      return 5;
    case 'whatsapp':
      return 2;
    case 'linkedin':
      return 3;
    case 'facebook':
      return 2;
    case 'youtube':
      return 4;
    default:
      return 1; // Other items have been used only once
  }
}
</script>