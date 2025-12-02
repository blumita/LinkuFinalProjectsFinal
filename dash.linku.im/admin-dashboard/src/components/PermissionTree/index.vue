<template>
  <div class="space-y-2">
    <div
      v-for="permission in permissions"
      :key="permission.id"
      class="permission-item"
    >
      <div class="flex items-start gap-3 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-200 dark:border-gray-600">
        <!-- Checkbox -->
        <input
          type="checkbox"
          :id="`perm-${permission.id}`"
          :checked="isSelected(permission.id)"
          @change="togglePermission(permission)"
          class="mt-1 w-5 h-5 text-blue-500 rounded focus:ring-2 focus:ring-blue-500"
        />
        
        <!-- Permission Info -->
        <div class="flex-1">
          <label :for="`perm-${permission.id}`" class="cursor-pointer block mb-2">
            <div class="flex items-center gap-2 mb-1">
              <svg
                v-if="permission.is_menu"
                class="w-5 h-5 text-purple-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
              <svg
                v-else
                class="w-5 h-5 text-green-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              <span class="font-semibold text-gray-900 dark:text-white text-base">
                {{ permission.display_name }}
              </span>
              <span
                v-if="permission.group"
                class="px-2 py-0.5 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs rounded font-medium"
              >
                {{ permission.group }}
              </span>
              <span
                v-if="permission.is_menu"
                class="px-2 py-0.5 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 text-xs rounded font-medium"
              >
                منو
              </span>
            </div>
            <p v-if="permission.description" class="text-sm text-gray-600 dark:text-gray-400">
              {{ permission.description }}
            </p>
            <div v-if="permission.is_menu && permission.menu_route" class="text-xs text-gray-500 dark:text-gray-400 mt-1 font-mono">
              🔗 {{ permission.menu_route }}
            </div>
          </label>

          <!-- Access Levels (Read, Write, Delete) -->
          <div
            v-if="isSelected(permission.id) && !permission.is_menu"
            class="flex items-center gap-4 mt-3 p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-600"
          >
            <span class="text-sm font-medium text-gray-700 dark:text-gray-300">سطح دسترسی:</span>
            
            <label class="flex items-center gap-2 cursor-pointer group">
              <input
                type="checkbox"
                :checked="hasAccess(permission.id, 'read')"
                @change="toggleAccess(permission.id, 'read')"
                class="w-4 h-4 text-green-500 rounded focus:ring-2 focus:ring-green-500"
              />
              <span class="text-sm text-gray-700 dark:text-gray-300 group-hover:text-green-600 dark:group-hover:text-green-400 transition">
                <svg class="w-4 h-4 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                خواندن
              </span>
            </label>

            <label class="flex items-center gap-2 cursor-pointer group">
              <input
                type="checkbox"
                :checked="hasAccess(permission.id, 'write')"
                @change="toggleAccess(permission.id, 'write')"
                class="w-4 h-4 text-blue-500 rounded focus:ring-2 focus:ring-blue-500"
              />
              <span class="text-sm text-gray-700 dark:text-gray-300 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition">
                <svg class="w-4 h-4 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                نوشتن
              </span>
            </label>

            <label class="flex items-center gap-2 cursor-pointer group">
              <input
                type="checkbox"
                :checked="hasAccess(permission.id, 'delete')"
                @change="toggleAccess(permission.id, 'delete')"
                class="w-4 h-4 text-red-500 rounded focus:ring-2 focus:ring-red-500"
              />
              <span class="text-sm text-gray-700 dark:text-gray-300 group-hover:text-red-600 dark:group-hover:text-red-400 transition">
                <svg class="w-4 h-4 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                حذف
              </span>
            </label>
          </div>
        </div>

        <!-- Select All Children -->
        <button
          v-if="permission.children && permission.children.length > 0"
          @click="toggleAllChildren(permission)"
          class="px-3 py-1.5 text-xs font-medium text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg transition border border-blue-200 dark:border-blue-800"
        >
          {{ areAllChildrenSelected(permission) ? '❌ لغو همه' : '✅ انتخاب همه' }}
        </button>
      </div>

      <!-- Children (Recursive) -->
      <div
        v-if="permission.children && permission.children.length > 0"
        class="mr-8 mt-2 space-y-2 border-r-2 border-blue-200 dark:border-blue-700 pr-4"
      >
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
const props = defineProps<{
  permissions: any[]
  selected: number[]
  accessLevels?: Record<number, { read: boolean; write: boolean; delete: boolean }>
}>()

const emit = defineEmits<{
  update: [permissions: number[]]
  'update-access': [data: { permissionId: number; accessType: 'read' | 'write' | 'delete'; value: boolean }]
}>()

// چک کردن انتخاب شده بودن
function isSelected(id: number): boolean {
  return props.selected.includes(id)
}

// چک کردن دسترسی
function hasAccess(permissionId: number, accessType: 'read' | 'write' | 'delete'): boolean {
  return props.accessLevels?.[permissionId]?.[accessType] || false
}

// تغییر دسترسی
function toggleAccess(permissionId: number, accessType: 'read' | 'write' | 'delete') {
  const currentValue = hasAccess(permissionId, accessType)
  emit('update-access', { permissionId, accessType, value: !currentValue })
}

// تغییر وضعیت یک مجوز
function togglePermission(permission: any) {
  const newSelected = [...props.selected]
  const index = newSelected.indexOf(permission.id)

  if (index > -1) {
    // حذف مجوز و تمام فرزندانش
    newSelected.splice(index, 1)
    removeAllChildren(permission, newSelected)
  } else {
    // اضافه کردن مجوز
    newSelected.push(permission.id)
    // اگر منو نیست، به صورت پیش‌فرض دسترسی read بده
    if (!permission.is_menu) {
      emit('update-access', { permissionId: permission.id, accessType: 'read', value: true })
    }
  }

  emit('update', newSelected)
}

// حذف تمام فرزندان
function removeAllChildren(permission: any, selected: number[]) {
  if (permission.children && permission.children.length > 0) {
    permission.children.forEach((child: any) => {
      const index = selected.indexOf(child.id)
      if (index > -1) {
        selected.splice(index, 1)
      }
      removeAllChildren(child, selected)
    })
  }
}

// انتخاب/لغو تمام فرزندان
function toggleAllChildren(permission: any) {
  const newSelected = [...props.selected]
  const allSelected = areAllChildrenSelected(permission)

  if (allSelected) {
    // لغو انتخاب همه
    removeAllChildren(permission, newSelected)
  } else {
    // انتخاب همه
    addAllChildren(permission, newSelected)
  }

  emit('update', newSelected)
}

// اضافه کردن تمام فرزندان
function addAllChildren(permission: any, selected: number[]) {
  if (permission.children && permission.children.length > 0) {
    permission.children.forEach((child: any) => {
      if (!selected.includes(child.id)) {
        selected.push(child.id)
        // اگر منو نیست، به صورت پیش‌فرض دسترسی read بده
        if (!child.is_menu) {
          emit('update-access', { permissionId: child.id, accessType: 'read', value: true })
        }
      }
      addAllChildren(child, selected)
    })
  }
}

// چک کردن اینکه آیا تمام فرزندان انتخاب شده‌اند
function areAllChildrenSelected(permission: any): boolean {
  if (!permission.children || permission.children.length === 0) {
    return false
  }

  return permission.children.every((child: any) => {
    const isChildSelected = props.selected.includes(child.id)
    const areChildrenSelected = !child.children || child.children.length === 0 || areAllChildrenSelected(child)
    return isChildSelected && areChildrenSelected
  })
}
</script>

<style scoped>
.permission-item {
  animation: fadeIn 0.3s ease-in;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateX(10px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}
</style>
