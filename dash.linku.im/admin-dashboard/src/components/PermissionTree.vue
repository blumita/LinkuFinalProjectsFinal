<template>
  <div class="space-y-2">
    <div v-for="permission in permissions" :key="permission.id" class="space-y-2">
      <!-- Parent Permission -->
      <div class="flex items-start gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
        <input
          type="checkbox"
          :id="`perm-${permission.id}`"
          :checked="isSelected(permission.id)"
          @change="togglePermission(permission.id)"
          class="mt-1 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
        />
        <div class="flex-1">
          <label
            :for="`perm-${permission.id}`"
            class="font-medium text-gray-900 dark:text-white cursor-pointer"
          >
            {{ permission.display_name }}
          </label>
          <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">
            {{ permission.description }}
          </p>
          
          <!-- Access Level Checkboxes -->
          <div v-if="isSelected(permission.id)" class="flex gap-4 mt-2">
            <label class="flex items-center gap-1.5 text-sm text-gray-700 dark:text-gray-300">
              <input
                type="checkbox"
                :checked="accessLevels[permission.id]?.read ?? true"
                @change="updateAccess(permission.id, 'read', ($event.target as HTMLInputElement).checked)"
                class="w-3.5 h-3.5 text-green-600 border-gray-300 rounded focus:ring-green-500"
              />
              خواندن
            </label>
            <label class="flex items-center gap-1.5 text-sm text-gray-700 dark:text-gray-300">
              <input
                type="checkbox"
                :checked="accessLevels[permission.id]?.write ?? false"
                @change="updateAccess(permission.id, 'write', ($event.target as HTMLInputElement).checked)"
                class="w-3.5 h-3.5 text-yellow-600 border-gray-300 rounded focus:ring-yellow-500"
              />
              نوشتن
            </label>
            <label class="flex items-center gap-1.5 text-sm text-gray-700 dark:text-gray-300">
              <input
                type="checkbox"
                :checked="accessLevels[permission.id]?.delete ?? false"
                @change="updateAccess(permission.id, 'delete', ($event.target as HTMLInputElement).checked)"
                class="w-3.5 h-3.5 text-red-600 border-gray-300 rounded focus:ring-red-500"
              />
              حذف
            </label>
          </div>
        </div>
      </div>

      <!-- Child Permissions -->
      <div v-if="permission.children && permission.children.length > 0" class="mr-8 space-y-2">
        <PermissionTree
          :permissions="permission.children"
          :selected="selected"
          :access-levels="accessLevels"
          @update="$emit('update', $event)"
          @update-access="$emit('update-access', $event)"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps, defineEmits } from 'vue'

interface Permission {
  id: number
  name: string
  display_name: string
  description: string
  children?: Permission[]
}

interface Props {
  permissions: Permission[]
  selected: number[]
  accessLevels: Record<number, { read: boolean; write: boolean; delete: boolean }>
}

const props = defineProps<Props>()
const emit = defineEmits<{
  update: [permissions: number[]]
  'update-access': [data: { permissionId: number; accessType: 'read' | 'write' | 'delete'; value: boolean }]
}>()

function isSelected(id: number): boolean {
  return props.selected.includes(id)
}

function togglePermission(id: number) {
  const newSelected = isSelected(id)
    ? props.selected.filter(p => p !== id)
    : [...props.selected, id]
  
  emit('update', newSelected)
}

function updateAccess(permissionId: number, accessType: 'read' | 'write' | 'delete', value: boolean) {
  emit('update-access', { permissionId, accessType, value })
}
</script>
