<script setup lang="ts">
import { ref, computed, watch } from 'vue'

interface MenuItem {
  id: string
  name: string
  icon: string
  route: string
  children?: MenuItem[]
}

interface Props {
  menus: MenuItem[]
  selected?: string[]
}

const props = withDefaults(defineProps<Props>(), {
  selected: () => []
})

const emit = defineEmits<{
  update: [menuIds: string[]]
}>()

const selectedMenus = ref<Set<string>>(new Set(props.selected))

// Watch for external changes
watch(() => props.selected, (newVal) => {
  selectedMenus.value = new Set(newVal)
}, { deep: true })

// Check if menu is selected
const isMenuSelected = (menuId: string) => {
  return selectedMenus.value.has(menuId)
}

// Check if all children are selected
const areAllChildrenSelected = (menu: MenuItem): boolean => {
  if (!menu.children || menu.children.length === 0) return false
  return menu.children.every(child => isMenuSelected(child.id))
}

// Check if some (but not all) children are selected
const areSomeChildrenSelected = (menu: MenuItem): boolean => {
  if (!menu.children || menu.children.length === 0) return false
  const selectedCount = menu.children.filter(child => isMenuSelected(child.id)).length
  return selectedCount > 0 && selectedCount < menu.children.length
}

// Toggle menu selection
const toggleMenu = (menu: MenuItem) => {
  if (isMenuSelected(menu.id)) {
    // Deselect menu and all children
    selectedMenus.value.delete(menu.id)
    if (menu.children) {
      menu.children.forEach(child => selectedMenus.value.delete(child.id))
    }
  } else {
    // Select menu and all children
    selectedMenus.value.add(menu.id)
    if (menu.children) {
      menu.children.forEach(child => selectedMenus.value.add(child.id))
    }
  }
  
  emit('update', Array.from(selectedMenus.value))
}

// Toggle parent based on children selection
const toggleParentMenu = (menu: MenuItem) => {
  const allSelected = areAllChildrenSelected(menu)
  
  if (allSelected) {
    selectedMenus.value.delete(menu.id)
  } else {
    selectedMenus.value.add(menu.id)
  }
  
  emit('update', Array.from(selectedMenus.value))
}
</script>

<template>
  <div class="space-y-2">
    <div
      v-for="menu in menus"
      :key="menu.id"
      class="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden"
    >
      <!-- Parent Menu -->
      <div class="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800/50">
        <div class="flex items-center gap-2 flex-1">
          <!-- Checkbox -->
          <div class="relative">
            <input
              type="checkbox"
              :checked="isMenuSelected(menu.id)"
              :indeterminate.prop="areSomeChildrenSelected(menu)"
              @change="toggleMenu(menu)"
              class="w-5 h-5 text-blue-600 border-gray-300 dark:border-gray-600 rounded focus:ring-2 focus:ring-blue-500 cursor-pointer"
            />
          </div>
          
          <!-- Icon & Name -->
          <i :class="[menu.icon, 'text-lg text-gray-600 dark:text-gray-400']"></i>
          <span class="text-sm font-medium text-gray-900 dark:text-white">
            {{ menu.name }}
          </span>
        </div>
        
        <!-- Badge showing selected children count -->
        <span
          v-if="menu.children && menu.children.length > 0"
          class="text-xs px-2 py-1 rounded bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300"
        >
          {{ menu.children.filter(c => isMenuSelected(c.id)).length }} / {{ menu.children.length }}
        </span>
      </div>

      <!-- Children Menus -->
      <div v-if="menu.children && menu.children.length > 0" class="p-3 space-y-2 bg-white dark:bg-gray-800">
        <div
          v-for="child in menu.children"
          :key="child.id"
          class="flex items-center gap-3 p-2 rounded hover:bg-gray-50 dark:hover:bg-gray-700/50 transition"
        >
          <input
            type="checkbox"
            :checked="isMenuSelected(child.id)"
            @change="toggleMenu(child)"
            class="w-4 h-4 text-blue-600 border-gray-300 dark:border-gray-600 rounded focus:ring-2 focus:ring-blue-500 cursor-pointer"
          />
          <i :class="[child.icon, 'text-base text-gray-500 dark:text-gray-400']"></i>
          <span class="text-sm text-gray-700 dark:text-gray-300">
            {{ child.name }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>
