<template>
  <div class="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
    <!-- Header -->
    <div class="p-6 border-b border-gray-200 dark:border-gray-700">
      <div class="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h2 class="text-xl font-bold text-gray-900 dark:text-white mb-1">
            مدیریت مدیران
          </h2>
          <p class="text-sm text-gray-600 dark:text-gray-400">
            مجموع {{ filteredAdmins.length }} مدیر
          </p>
        </div>

        <div class="flex flex-wrap gap-3">
          <button @click="addAdmin" class="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            <i class="ti ti-plus text-sm"></i>
            افزودن مدیر
          </button>
        </div>
      </div>
    </div>

    <!-- Filters -->
    <div class="p-6 border-b border-gray-200 dark:border-gray-700">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div class="relative">
          <i class="ti ti-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm"></i>
          <input v-model="searchQuery" type="text" placeholder="جستجو نام، نام کاربری، شماره..."
                 class="w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white">
        </div>

        <select v-model="filterStatus" class="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white">
          <option value="">همه وضعیت‌ها</option>
          <option value="active">فعال</option>
          <option value="inactive">غیرفعال</option>
        </select>

        <select v-model="sortBy" class="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white">
          <option value="created_desc">جدیدترین</option>
          <option value="created_asc">قدیمی‌ترین</option>
          <option value="name_asc">نام (الف - ی)</option>
          <option value="name_desc">نام (ی - الف)</option>
        </select>
      </div>
    </div>

    <!-- Admins Grid -->
    <div v-if="!userStore.fetched" class="p-6">
      <div class="flex items-center justify-center py-12">
        <div class="text-center">
          <i class="ti ti-loader-2 text-4xl text-blue-500 animate-spin mb-2"></i>
          <p class="text-gray-600 dark:text-gray-400">در حال بارگذاری...</p>
        </div>
      </div>
    </div>
    
    <div v-else-if="paginatedAdmins.length === 0" class="p-6">
      <div class="flex items-center justify-center py-12">
        <div class="text-center">
          <i class="ti ti-users-off text-6xl text-gray-400 mb-4"></i>
          <p class="text-gray-600 dark:text-gray-400 mb-2">مدیری یافت نشد</p>
          <p class="text-sm text-gray-500 dark:text-gray-500">{{ searchQuery ? 'نتیجه‌ای برای جستجوی شما یافت نشد' : 'هیچ مدیری ثبت نشده است' }}</p>
        </div>
      </div>
    </div>
    
    <div v-else class="p-6">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div v-for="admin in paginatedAdmins" :key="admin.id"
             class="bg-white dark:bg-gray-800 rounded-lg p-5 border border-gray-200 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-500 transition-colors group relative">

          <div class="flex items-start justify-between mb-4">
            <div class="flex items-center gap-3">
              <div class="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold">
                {{ getAdminInitials(admin.fullName) }}
              </div>
              <div>
                <h3 class="font-semibold text-gray-900 dark:text-white">{{ admin.fullName }}</h3>
                <p class="text-sm text-gray-600 dark:text-gray-400">{{ admin.username }}@</p>
              </div>
            </div>
          </div>

          <div class="space-y-3">
            <div class="flex items-center gap-2">
              <i class="ti ti-phone text-gray-400 text-sm"></i>
              <span class="text-sm text-gray-600 dark:text-gray-400">{{ admin.phone }}</span>
            </div>
            <div class="flex items-center gap-2">
              <i class="ti ti-mail text-gray-400 text-sm"></i>
              <span class="text-sm text-gray-600 dark:text-gray-400 truncate">{{ admin.email }}</span>
            </div>
            <div v-if="admin.createdAt" class="flex items-center gap-2">
              <i class="ti ti-calendar text-gray-400 text-sm"></i>
              <span class="text-xs text-gray-500 dark:text-gray-400">{{ formatDate(admin.createdAt) }}</span>
            </div>
          </div>

          <div class="flex items-center justify-between mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            <div class="flex gap-2">
              <span class="px-2 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded-full text-xs font-medium">
                {{ admin.status === 'active' ? 'فعال' : 'غیرفعال' }}
              </span>
              <span class="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-xs font-medium">
                مدیر
              </span>
            </div>
            
            <div class="flex gap-2">
              <button @click="editAdmin(admin)"
                      class="p-2 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg transition-colors"
                      title="ویرایش">
                <i class="ti ti-edit text-base"></i>
              </button>
              <button @click="deleteAdmin(admin)"
                      class="p-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors"
                      title="حذف">
                <i class="ti ti-trash text-base"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Pagination -->
    <div v-if="totalPages > 1" class="px-6 py-4 border-t border-gray-200 dark:border-gray-700">
      <div class="flex items-center justify-between">
        <div class="text-sm text-gray-500 dark:text-gray-400">
          صفحه {{ currentPage }} از {{ totalPages }}
        </div>
        <div class="flex items-center gap-2">
          <button @click="currentPage = Math.max(1, currentPage - 1)"
                  :disabled="currentPage === 1"
                  class="px-3 py-1 text-sm bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed">
            قبلی
          </button>
          <button @click="currentPage = Math.min(totalPages, currentPage + 1)"
                  :disabled="currentPage === totalPages"
                  class="px-3 py-1 text-sm bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed">
            بعدی
          </button>
        </div>
      </div>
    </div>
  </div>

  <!-- Add/Edit Admin Modal -->
  <div v-if="showAddModal || showEditModal" @click="closeModals" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
    <div @click.stop class="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
      <div class="p-6 border-b border-gray-200 dark:border-gray-700">
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
          {{ editingAdmin ? 'ویرایش مدیر' : 'افزودن مدیر جدید' }}
        </h3>
      </div>

      <form @submit.prevent="saveAdmin" class="p-6 space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">نام *</label>
          <input v-model="formData.firstName" type="text" required
                 class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white">
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">نام خانوادگی *</label>
          <input v-model="formData.lastName" type="text" required
                 class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white">
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">شماره موبایل *</label>
          <div class="flex flex-row-reverse items-center">
            <input
                type="text"
                v-model="formData.countryCode"
                readonly
                class="w-20 px-2 py-2 border border-gray-300 dark:border-gray-600 rounded-l-lg bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-center"
            />
            <input
                v-model="formData.phone"
                type="tel"
                required
                placeholder="9123456789"
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-r-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                @input="formData.phone.startsWith('0') ?formData.phone.slice(1) : formData.phone"
            />
          </div>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">ایمیل *</label>
          <input v-model="formData.email" type="email" required
                 class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white">
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">نام کاربری *</label>
          <input v-model="formData.username" type="text" required
                 class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white">
        </div>

        <div v-if="!editingAdmin">
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">پسورد موقت</label>
          <div class="flex gap-2">
            <input v-model="formData.password" type="text" readonly
                   class="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-600 text-gray-600 dark:text-gray-300">
            <button type="button" @click="generateTempPassword"
                    class="px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
              <i class="ti ti-refresh text-sm"></i>
            </button>
          </div>
        </div>

        <div v-if="editingAdmin">
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">رمز عبور جدید</label>
          <div class="flex gap-2">
            <input v-model="formData.password" type="text"
                   class="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                   placeholder="رمز عبور جدید وارد کنید یا تولید کنید">
            <button type="button" @click="generateTempPassword"
                    class="px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
              <i class="ti ti-refresh text-sm"></i>
            </button>
          </div>
          <p class="text-xs text-gray-500 mt-1">خالی بگذارید تا رمز عبور تغییر نکند</p>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">وضعیت *</label>
          <select v-model="formData.status" required
                  class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white">
            <option value="active">فعال</option>
            <option value="inactive">غیرفعال</option>
          </select>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">نقش *</label>
          <select v-model="formData.roleId" required
                  class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white">
            <option :value="null" disabled>انتخاب نقش...</option>
            <option v-for="role in roles" :key="role.id" :value="role.id">
              {{ role.display_name }}
            </option>
          </select>
        </div>

        <div class="flex items-center justify-end gap-3 pt-4">
          <button type="button" @click="closeModals"
                  class="px-4 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
            لغو
          </button>
          <button type="submit"
                  class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            {{ editingAdmin ? 'ویرایش' : 'افزودن' }}
          </button>
        </div>
      </form>
    </div>
  </div>

  <!-- Generate Password Modal -->
  <div v-if="showPasswordModal" @click="showPasswordModal = false" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
    <div @click.stop class="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md">
      <div class="p-6 border-b border-gray-200 dark:border-gray-700">
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
          تولید پسورد جدید
        </h3>
      </div>

      <div class="p-6 space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">انتخاب مدیر</label>
          <select v-model="selectedAdminForPassword"
                  class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white">
            <option value="">انتخاب کنید...</option>
            <option v-for="admin in admins" :key="admin.id" :value="admin.id">
              {{ admin.fullName }} (@{{ admin.username }})
            </option>
          </select>
        </div>

        <div v-if="generatedPassword">
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">پسورد جدید</label>
          <div class="flex gap-2">
            <input v-model="generatedPassword" type="text" readonly
                   class="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-600 text-gray-900 dark:text-white font-mono">
            <button @click="copyPassword"
                    class="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              <i class="ti ti-copy text-sm"></i>
            </button>
          </div>
        </div>

        <div class="flex items-center justify-end gap-3 pt-4">
          <button @click="showPasswordModal = false"
                  class="px-4 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
            بستن
          </button>
          <button @click="generateNewPassword"
                  :disabled="!selectedAdminForPassword"
                  class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
            تولید پسورد
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {ref, computed, onMounted, getCurrentInstance} from 'vue'
import { useAlert } from '@/composables/useAlert'
import {useUserStore} from "@/stores/user.ts";
import jalaali from "jalaali-js";

defineOptions({
  name: 'AdminManagement'
})

const { showSuccess, showDeleteConfirm, showAlert, showError } = useAlert()
const instance = getCurrentInstance()
const axios = instance?.appContext.config.globalProperties.$axios

interface Admin {
  id: number
  fullName: string
  firstName:string
  lastName:string
  username: string
  phone: string
  countryCode:string
  email: string
  password?: string
  status: 'active' | 'inactive'
  createdAt: string
}

// Reactive data
const searchQuery = ref('')
const filterStatus = ref('')
const sortBy = ref('created_desc')
const currentPage = ref(1)
const itemsPerPage = 9
const showAddModal = ref(false)
const showEditModal = ref(false)
const showPasswordModal = ref(false)
const editingAdmin = ref<Admin | null>(null)
const selectedAdminForPassword = ref('')
const generatedPassword = ref('')
const userStore=useUserStore()
const roles = ref<any[]>([])

// Form data for admin
const formData = ref({
  firstName: '',
  lastName: '',
  phone: '',
  countryCode:'',
  email: '',
  username: '',
  password: '',
  roleId: null as number | null,
  status: 'active' as 'active' | 'inactive'
})
const toJalaali = (gregorianDate: string | Date): string => {
  try {
    const dateStr = typeof gregorianDate === 'string'
        ? gregorianDate
        : gregorianDate.toISOString().split('T')[0] // "YYYY-MM-DD"

    const [gy, gm, gd] = dateStr.split('-').map(Number)
    
    // Validate year range
    if (!gy || gy < 1900 || gy > 2100) {
      return ''
    }
    
    const { jy, jm, jd } = jalaali.toJalaali(gy, gm, gd)
    return `${jy}/${String(jm).padStart(2, '0')}/${String(jd).padStart(2, '0')}`
  } catch (error) {
    console.warn('Error converting date:', error)
    return ''
  }
}
const formatDate = (date: string | null | undefined): string => {
  if (!date || typeof date !== 'string' || date.trim() === '') return '-'

  const normalized = normalizePersianDigits(date)

  if (/^(13|14)\d{2}\/\d{1,2}\/\d{1,2}$/.test(normalized)) {
    return date
  }

  const result = toJalaali(date)
  return result || '-'
}
const normalizePersianDigits = (str: string): string => {
  return str.replace(/[۰-۹]/g, d => String('۰۱۲۳۴۵۶۷۸۹'.indexOf(d)))
}

// Sample admins data
const admins = computed(() => userStore.admins || [])

// Computed properties
const filteredAdmins = computed(() => {
  let filtered = [...admins.value]
  console.log('ad', filtered)
  
  // اگر آرایه خالی یا undefined است، خالی برگردان
  if (!filtered || filtered.length === 0) {
    return []
  }

  // Search filter
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(admin =>
      admin.fullName?.toLowerCase().includes(query) ||
      admin.username?.toLowerCase().includes(query) ||
      admin.phone?.includes(query) ||
      admin.email?.toLowerCase().includes(query)
    )
  }

  // Status filter
  if (filterStatus.value) {
    filtered = filtered.filter(admin => admin.status === filterStatus.value)
  }

  // Sort
  switch (sortBy.value) {
    case 'created_desc':
      filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      break
    case 'created_asc':
      filtered.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
      break
    case 'name_asc':
      filtered.sort((a, b) => a.fullName.localeCompare(b.fullName))
      break
    case 'name_desc':
      filtered.sort((a, b) => b.fullName.localeCompare(a.fullName))
      break
  }

  return filtered
})

const paginatedAdmins = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  const end = start + itemsPerPage
  return filteredAdmins.value.slice(start, end)
})

const totalPages = computed(() => Math.ceil(filteredAdmins.value.length / itemsPerPage))

// Helper functions
const getAdminInitials = (name: string) => {
  if (!name) return ''
  return name.split(' ').map(n => n[0]).join('').toUpperCase()
}

const generateRandomPassword = () => {
  const chars = 'ABCDEFGHJKMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789'
  let result = ''
  for (let i = 0; i < 8; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return result
}

// Functions
const addAdmin = () => {
  showAddModal.value = true
  resetForm()
  generateTempPassword()
}

const editAdmin = (admin: Admin) => {
  // Clone the admin object to prevent direct mutation
  editingAdmin.value = { ...admin }
  const [firstName, ...lastNameParts] = admin.fullName.split(' ')
  formData.value = {
    firstName: firstName,
    lastName: lastNameParts.join(' '),
    username: admin.username,
    phone: admin.phone,
    countryCode: admin.countryCode || '+98',
    email: admin.email,
    password: '',
    roleId: (admin as any).role_id || (admin as any).roleId || null,
    status: admin.status
  }
  showEditModal.value = true
}

const saveAdmin = async () => {
  const fullName = `${formData.value.firstName} ${formData.value.lastName}`.trim()

  const payload: any = {
    firstName: formData.value.firstName,
    lastName: formData.value.lastName,
    fullName,
    username: formData.value.username,
    email: formData.value.email,
    phone: formData.value.phone,
    countryCode: formData.value.countryCode,
    status: formData.value.status,
  }

  if (formData.value.password && formData.value.password.trim() !== '') {
    payload.password = formData.value.password
  }

  if (formData.value.roleId) {
    payload.role_id = formData.value.roleId
  }

  console.log('💾 Saving admin with payload:', payload)
  console.log('✏️ Is editing?', !!editingAdmin.value, editingAdmin.value?.id)

  try {
    if (editingAdmin.value) {
      console.log('🔄 Updating admin ID:', editingAdmin.value.id)
      const updated = await userStore.updateAdminUser(editingAdmin.value.id, payload)
      console.log('✅ Update response:', updated)
      
      // Refresh the whole list to ensure we have the latest data
      await userStore.fetchAdminUser()
    } else {
      await userStore.createAdminUser(payload)
      // refresh list from server to keep consistency
      await userStore.fetchAdminUser()
    }
    // Close modal immediately after successful save
    closeModals()
  } catch (error: any) {
    console.error('Error saving admin:', error)
    const msg = error?.response?.data?.message || error?.response?.data?.error || 'خطا در ذخیره مدیر'
    await showError('خطا', msg)
  }
}

const deleteAdmin = async (admin: Admin) => {
  try {
    const confirmed = await showDeleteConfirm(
      'حذف مدیر',
      `آیا از حذف ${admin.fullName} اطمینان دارید؟`,
      admin.fullName
    )

    if (confirmed) {
      await userStore.deleteAdminUser(admin.id)
      const index = admins.value.findIndex(a => a.id === admin.id)
      if (index > -1) {
        admins.value.splice(index, 1)
      }
    }
  } catch (error) {
    console.error('Error deleting admin:', error)
    await showError('خطا', 'خطا در حذف مدیر')
  }
}

const generateTempPassword = () => {
  formData.value.password = generateRandomPassword()
}

const generateNewPassword = () => {
  if (selectedAdminForPassword.value) {
    generatedPassword.value = generateRandomPassword()
    showSuccess('تولید پسورد موفق', 'پسورد جدید تولید شد')
  }
}

const copyPassword = async () => {
  try {
    await navigator.clipboard.writeText(generatedPassword.value)
    await showSuccess('کپی موفق', 'پسورد در کلیپبورد کپی شد')
  } catch (error) {
    console.error('Failed to copy password:', error)
  }
}

const resetForm = () => {
  formData.value = {
    firstName: '',
    lastName: '',
    phone: '',
    countryCode:'+98',
    email: '',
    username: '',
    password: '',
    roleId: null,
    status: 'active'
  }
  editingAdmin.value = null
}

const closeModals = () => {
  showAddModal.value = false
  showEditModal.value = false
  showPasswordModal.value = false
  resetForm()
}
onMounted(async () => {
  await userStore.fetchAdminUser()
  await fetchRoles()
  console.log('admins',userStore.admins)
})

// Fetch roles from API
async function fetchRoles() {
  try {
    const response = await axios!.get('user/admin/roles')
    roles.value = response.data.data || []
    console.log('Roles loaded:', roles.value)
  } catch (error) {
    console.error('Error fetching roles:', error)
    roles.value = []
  }
}
</script>
