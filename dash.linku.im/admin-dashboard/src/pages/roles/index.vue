<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <!-- Header -->
    <div class="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 py-4">
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-3">
          <button
            @click="router.back()"
            class="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <div>
            <h1 class="text-xl font-bold text-gray-900 dark:text-white">مدیریت نقش‌ها و دسترسی‌ها</h1>
            <p class="text-sm text-gray-500 dark:text-gray-400">
              تعریف نقش‌ها و تنظیم مجوزها
            </p>
          </div>
        </div>
        <button
          @click="showCreateModal = true"
          class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition flex items-center gap-2"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
          نقش جدید
        </button>
      </div>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="flex items-center justify-center py-12">
      <div class="flex flex-col items-center gap-3">
        <div class="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        <p class="text-sm text-gray-500 dark:text-gray-400">در حال بارگذاری...</p>
      </div>
    </div>

    <!-- Roles List -->
    <div v-else class="p-4 space-y-3">
      <div
        v-for="role in roles"
        :key="role.id"
        class="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700 hover:shadow-md transition"
      >
        <!-- Role Header -->
        <div class="flex items-start justify-between mb-3">
          <div class="flex-1">
            <div class="flex items-center gap-2 mb-1">
              <h3 class="text-lg font-bold text-gray-900 dark:text-white">
                {{ role.display_name }}
              </h3>
              <span
                :class="[
                  'px-2 py-0.5 rounded-full text-xs font-medium',
                  role.priority >= 100 ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300' :
                  role.priority >= 50 ? 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300' :
                  role.priority >= 20 ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300' :
                  'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
                ]"
              >
                اولویت: {{ role.priority }}
              </span>
              <span
                v-if="!role.is_active"
                class="px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300"
              >
                غیرفعال
              </span>
            </div>
            <p class="text-sm text-gray-600 dark:text-gray-400 mb-2">
              {{ role.description }}
            </p>
            <div class="flex items-center gap-4 text-sm">
              <div class="flex items-center gap-1 text-gray-500 dark:text-gray-400">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                {{ role.permissions?.length || 0 }} مجوز
              </div>
              <div class="flex items-center gap-1 text-gray-500 dark:text-gray-400">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                {{ role.users_count || 0 }} کاربر
              </div>
            </div>
          </div>
          <div class="flex gap-2">
            <button
              @click="editRole(role)"
              class="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg transition"
              title="ویرایش مجوزها"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </button>
            <button
              v-if="role.name !== 'admin'"
              @click="deleteRole(role)"
              class="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition"
              title="حذف"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        </div>

        <!-- Permissions Preview -->
        <div v-if="role.permissions && role.permissions.length > 0" class="pt-3 border-t border-gray-100 dark:border-gray-700">
          <div class="flex flex-wrap gap-2">
            <span
              v-for="perm in role.permissions.slice(0, 5)"
              :key="perm.id"
              class="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded text-xs"
            >
              {{ perm.display_name }}
            </span>
            <span
              v-if="role.permissions.length > 5"
              class="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 rounded text-xs"
            >
              +{{ role.permissions.length - 5 }} مورد دیگر
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- Edit Permissions Modal -->
    <div
      v-if="showEditModal && selectedRole"
      class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
      @click.self="showEditModal = false"
    >
      <div class="bg-white dark:bg-gray-800 rounded-xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        <!-- Modal Header -->
        <div class="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
          <h2 class="text-xl font-bold text-gray-900 dark:text-white">
            مجوزهای نقش: {{ selectedRole.display_name }}
          </h2>
          <button
            @click="showEditModal = false"
            class="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <!-- Modal Body -->
        <div class="flex-1 overflow-y-auto p-4">
          <PermissionTree
            :permissions="permissionsTree"
            :selected="selectedPermissions"
            :access-levels="accessLevels"
            @update="updateSelectedPermissions"
            @update-access="updateAccessLevels"
          />
        </div>

        <!-- Modal Footer -->
        <div class="p-4 border-t border-gray-200 dark:border-gray-700 flex gap-2">
          <button
            @click="savePermissions"
            :disabled="saving"
            class="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition disabled:opacity-50"
          >
            {{ saving ? 'در حال ذخیره...' : 'ذخیره تغییرات' }}
          </button>
          <button
            @click="showEditModal = false"
            class="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition"
          >
            انصراف
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, getCurrentInstance } from 'vue'
import { useRouter } from 'vue-router'

interface Permission {
  id: number
  name: string
  display_name: string
}

interface Role {
  id: number
  name: string
  display_name: string
  description: string
  priority: number
  is_active: boolean
  permissions: Permission[]
  users_count: number
}

const router = useRouter()
const instance = getCurrentInstance()
const axios = instance?.appContext.config.globalProperties.$axios

const loading = ref(true)
const saving = ref(false)
const roles = ref<Role[]>([])
const permissionsTree = ref<any[]>([])
const selectedRole = ref<Role | null>(null)
const selectedPermissions = ref<number[]>([])
const accessLevels = ref<Record<number, { read: boolean; write: boolean; delete: boolean }>>({})
const showEditModal = ref(false)
const showCreateModal = ref(false)

// دریافت لیست نقش‌ها
async function fetchRoles() {
  if (!axios) return
  try {
    loading.value = true
    const response = await axios.get('/user/admin/roles')
    roles.value = response.data.data
  } catch (error) {
    console.error('Error fetching roles:', error)
  } finally {
    loading.value = false
  }
}

// دریافت درخت مجوزها
async function fetchPermissionsTree() {
  if (!axios) return
  try {
    const response = await axios.get('/user/admin/permissions/tree')
    permissionsTree.value = response.data.data
  } catch (error) {
    console.error('Error fetching permissions:', error)
  }
}

// ویرایش نقش
async function editRole(role: Role) {
  selectedRole.value = role
  selectedPermissions.value = role.permissions.map((p) => p.id)
  
  // بارگذاری سطوح دسترسی از سرور یا تنظیم پیش‌فرض
  accessLevels.value = {}
  role.permissions.forEach((p) => {
    // اگر دیتای دسترسی از سرور بیاد، اینجا لود میشه
    // فعلاً پیش‌فرض read رو فعال می‌کنیم
    accessLevels.value[p.id] = {
      read: (p as any).pivot?.can_read ?? true,
      write: (p as any).pivot?.can_write ?? false,
      delete: (p as any).pivot?.can_delete ?? false
    }
  })
  
  await fetchPermissionsTree()
  showEditModal.value = true
}

// آپدیت لیست مجوزهای انتخاب شده
function updateSelectedPermissions(permissions: number[]) {
  selectedPermissions.value = permissions
}

// آپدیت سطوح دسترسی
function updateAccessLevels(data: { permissionId: number; accessType: 'read' | 'write' | 'delete'; value: boolean }) {
  if (!accessLevels.value[data.permissionId]) {
    accessLevels.value[data.permissionId] = { read: false, write: false, delete: false }
  }
  accessLevels.value[data.permissionId][data.accessType] = data.value
}

// ذخیره مجوزها
async function savePermissions() {
  if (!selectedRole.value || !axios) return
  
  try {
    saving.value = true
    
    // ساخت آرایه مجوزها با سطوح دسترسی
    const permissionsWithAccess = selectedPermissions.value.map(permId => ({
      permission_id: permId,
      can_read: accessLevels.value[permId]?.read ?? true,
      can_write: accessLevels.value[permId]?.write ?? false,
      can_delete: accessLevels.value[permId]?.delete ?? false
    }))
    
    await axios.post(`/user/admin/roles/${selectedRole.value.id}/permissions`, {
      permissions: permissionsWithAccess
    })
    
    showEditModal.value = false
    await fetchRoles()
    alert('مجوزها با موفقیت ذخیره شد')
  } catch (error) {
    console.error('Error saving permissions:', error)
    alert('خطا در ذخیره مجوزها')
  } finally {
    saving.value = false
  }
}

// حذف نقش
async function deleteRole(role: Role) {
  if (!axios) return
  if (!confirm(`آیا از حذف نقش "${role.display_name}" اطمینان دارید؟`)) {
    return
  }

  try {
    await axios.delete(`/user/admin/roles/${role.id}`)
    await fetchRoles()
  } catch (error: any) {
    alert(error.response?.data?.message || 'خطا در حذف نقش')
  }
}

onMounted(() => {
  fetchRoles()
})
</script>
