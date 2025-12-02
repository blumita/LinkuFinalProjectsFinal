<template>
  <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
    <!-- Header -->
    <div class="p-6 border-b border-gray-200 dark:border-gray-700">
      <div class="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <!-- Title and Stats -->
        <div>
          <h2 class="text-xl font-bold text-gray-900 dark:text-white mb-1">
            مدیریت کاربران
          </h2>
          <p class="text-sm text-gray-600 dark:text-gray-400">
            مجموع {{ filteredUsers.length }} کاربر
          </p>
        </div>

        <!-- Actions -->
        <div class="flex flex-wrap gap-3">
          <button @click="addUser" class="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            <i class="ti ti-plus text-sm"></i>
            افزودن کاربر
          </button>
          <button @click="manageRoles" class="flex items-center gap-2 px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-black transition-colors">
            <i class="ti ti-shield text-sm"></i>
            مدیریت نقش‌ها
          </button>
          <button @click="showExportModal = true" class="flex items-center gap-2 px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-black transition-colors">
            <i class="ti ti-download text-sm"></i>
            خروجی اکسل
          </button>
        </div>
      </div>
    </div>

    <!-- Filters -->
    <div class="p-6 border-b border-gray-200 dark:border-gray-700">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <!-- Search -->
        <div class="relative">
          <i class="ti ti-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm"></i>
          <input v-model="searchQuery" type="text" placeholder="جستجو نام، نام کاربری، شماره..."
                 class="w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white">
        </div>

        <!-- Role Filter -->
        <select v-model="filterRole" class="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white">
          <option value="">همه نقش‌ها</option>
          <option value="super_admin">مدیر کل</option>
          <option value="admin">مدیر</option>
          <option value="moderator">مدیر محتوا</option>
          <option value="user">کاربر عادی</option>
        </select>

        <!-- Status Filter -->
        <select v-model="filterStatus" class="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white">
          <option value="">همه وضعیت‌ها</option>
          <option value="active">فعال</option>
          <option value="inactive">غیرفعال</option>
          <option value="suspended">معلق</option>
        </select>

        <!-- Sort -->
        <select v-model="sortBy" class="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white">
          <option value="created_desc">جدیدترین</option>
          <option value="created_asc">قدیمی‌ترین</option>
          <option value="name_asc">نام (الف - ی)</option>
          <option value="name_desc">نام (ی - الف)</option>
        </select>
      </div>
    </div>

    <!-- Users Grid -->
    <div class="p-6">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div v-for="user in paginatedUsers" :key="user.id"
             class="bg-gray-50 dark:bg-gray-900 rounded-lg p-6 border border-gray-200 dark:border-gray-700 group relative">

          <!-- User Header -->
          <div class="flex items-start justify-between mb-4">
            <div class="flex items-center gap-3">
              <div v-if="user.profileImage" class="w-12 h-12 rounded-full overflow-hidden">
                <img :src="user.profileImage" :alt="user.name" class="w-full h-full object-cover">
              </div>
              <div v-else class="w-12 h-12 rounded-full bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center text-white font-bold">
                {{ getUserInitials(user.name) }}
              </div>
              <div class="flex-1">
                <div class="flex items-center gap-2">
                  <i v-if="user.role !== 'user'" class="ti ti-check-circle text-blue-500" title="کاربر ویژه"></i>
                  <h3 class="font-semibold text-gray-900 dark:text-white">{{ user.name }}</h3>
                </div>
                <p class="text-sm text-gray-600 dark:text-gray-400">@{{ user.username }}</p>
              </div>
            </div>
          </div>

          <!-- User Info -->
          <div class="space-y-3">
            <div class="flex items-center gap-2">
              <i class="ti ti-phone text-gray-400 text-sm"></i>
              <span class="text-sm text-gray-600 dark:text-gray-400">{{ user.phone }}</span>
            </div>

            <div v-if="user.email" class="flex items-center gap-2">
              <i class="ti ti-mail text-gray-400 text-sm"></i>
              <span class="text-sm text-gray-600 dark:text-gray-400 truncate">{{ user.email }}</span>
            </div>

            <div class="flex items-center justify-between">
              <div class="flex items-center gap-2">
                <i class="ti ti-link text-gray-400 text-sm"></i>
                <span class="text-sm text-gray-600 dark:text-gray-400">{{ user.linkCount || 0 }} حساب</span>
              </div>
              <span class="text-xs text-gray-500 dark:text-gray-400">{{ user.createdAt }}</span>
            </div>

            <!-- Subscription Info for Premium Users -->
            <div v-if="user.role !== 'user' && user.subscriptionMonths" class="flex items-center justify-between">
              <div class="flex items-center gap-2">
                <i class="ti ti-calendar text-amber-500 text-sm"></i>
                <span class="text-sm text-amber-600 dark:text-amber-400">{{ user.subscriptionMonths }} ماهه</span>
              </div>
              <span class="text-xs text-amber-600 dark:text-amber-400">پایان: {{ user.subscriptionEndDate }}</span>
            </div>
          </div>

          <!-- Status and Role -->
          <div class="flex items-center justify-between mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            <span :class="['px-2 py-1 rounded-full text-xs font-medium', statusClasses[user.status]]">
              {{ statusNames[user.status] }}
            </span>
            <span :class="['px-2 py-1 rounded-full text-xs font-medium', roleClasses[user.role]]">
              {{ roleNames[user.role] }}
            </span>
          </div>

          <!-- Last Login -->
          <div class="mt-3 text-xs text-gray-500 dark:text-gray-400 text-center">
            آخرین ورود: {{ user.lastLogin }}
          </div>

          <!-- Action buttons - visible on hover -->
          <div class="absolute top-2 left-2 opacity-0 group-hover:opacity-100 transition-all duration-200 flex gap-2">
            <button @click="editUser(user)"
                    class="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    title="ویرایش">
              <i class="ti ti-edit text-sm"></i>
            </button>

            <button @click="viewProfile(user)" v-if="user.profileUrl"
                    class="p-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                    title="مشاهده پروفایل">
              <i class="ti ti-external-link text-sm"></i>
            </button>

            <button @click="toggleUserStatus(user)"
                    class="p-2 bg-gray-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
                    :title="user.status === 'suspended' ? 'رفع تعلیق' : 'تعلیق کردن'">
              <i class="ti ti-ban text-sm" v-if="user.status !== 'suspended'"></i>
              <i class="ti ti-check text-sm" v-else></i>
            </button>

            <button @click="deleteUser(user)"
                    class="p-2 bg-gray-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                    title="حذف">
              <i class="ti ti-trash text-sm"></i>
            </button>
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

  <!-- Add/Edit User Modal -->
  <div v-if="showAddModal || showEditModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md max-h-screen overflow-y-auto">
      <div class="p-6 border-b border-gray-200 dark:border-gray-700">
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
          {{ editingUser ? 'ویرایش کاربر' : 'افزودن کاربر جدید' }}
        </h3>
      </div>

      <form @submit.prevent="saveUser" class="p-6 space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">نام و نام خانوادگی *</label>
          <input v-model="formData.name" type="text" required
                 class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white">
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">نام کاربری *</label>
          <input v-model="formData.username" type="text" required
                 class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white">
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">شماره موبایل *</label>
          <input v-model="formData.phone" type="tel" required pattern="09\d{9}"
                 class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white">
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">ایمیل</label>
          <input v-model="formData.email" type="email"
                 class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white">
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">نقش کاربری *</label>
          <select v-model="formData.role" required
                  class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white">
            <option v-for="role in roles" :key="role.id" :value="role.name">
              {{ role.displayName }}
            </option>
          </select>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">وضعیت *</label>
          <select v-model="formData.status" required
                  class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white">
            <option value="active">فعال</option>
            <option value="inactive">غیرفعال</option>
            <option value="suspended">معلق</option>
          </select>
        </div>

        <div class="flex items-center justify-end gap-3 pt-4">
          <button type="button" @click="closeModals"
                  class="px-4 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
            لغو
          </button>
          <button type="submit"
                  class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            {{ editingUser ? 'ویرایش' : 'افزودن' }}
          </button>
        </div>
      </form>
    </div>
  </div>

  <!-- Role Management Modal -->
  <div v-if="showRoleModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-4xl max-h-screen overflow-y-auto">
      <div class="p-6 border-b border-gray-200 dark:border-gray-700">
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
          مدیریت نقش‌ها و مجوزها
        </h3>
      </div>

      <div class="p-6">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div v-for="role in roles" :key="role.id"
               class="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
            <div class="flex items-center justify-between mb-3">
              <h4 class="font-semibold text-gray-900 dark:text-white">{{ role.displayName }}</h4>
              <span :class="['px-2 py-1 rounded-full text-xs font-medium', roleClasses[role.name]]">
                {{ role.name }}
              </span>
            </div>

            <p class="text-sm text-gray-600 dark:text-gray-400 mb-4">{{ role.description }}</p>

            <div class="space-y-2">
              <h5 class="text-sm font-medium text-gray-700 dark:text-gray-300">مجوزها:</h5>
              <div class="flex flex-wrap gap-2">
                <span v-for="permission in role.permissions" :key="permission"
                      class="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-xs">
                  {{ permission === '*' ? 'تمام دسترسی‌ها' : permission }}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div class="flex justify-end mt-6">
          <button @click="closeModals"
                  class="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors">
            بستن
          </button>
        </div>
      </div>
    </div>
  </div>

  <!-- Export Modal -->
  <div v-if="showExportModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md">
      <div class="p-6 border-b border-gray-200 dark:border-gray-700">
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
          خروجی اکسل کاربران
        </h3>
      </div>

      <form @submit.prevent="exportUsers" class="p-6 space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">تعداد رکورد</label>
          <select v-model="exportSettings.count"
                  class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white">
            <option :value="50">50 رکورد</option>
            <option :value="100">100 رکورد</option>
            <option :value="500">500 رکورد</option>
            <option :value="1000">1000 رکورد</option>
            <option value="all">همه رکوردها</option>
          </select>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">فرمت فایل</label>
          <select v-model="exportSettings.format"
                  class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white">
            <option value="xlsx">Excel (.xlsx)</option>
            <option value="csv">CSV (.csv)</option>
          </select>
        </div>

        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">از تاریخ</label>
            <input v-model="exportSettings.startDate" type="date"
                   class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white">
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">تا تاریخ</label>
            <input v-model="exportSettings.endDate" type="date"
                   class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white">
          </div>
        </div>

        <div class="flex items-center justify-end gap-3 pt-4">
          <button type="button" @click="showExportModal = false"
                  class="px-4 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
            لغو
          </button>
          <button type="submit"
                  class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
            دانلود
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useAlert } from '@/composables/useAlert'

defineOptions({
  name: 'UserManagement'
})

const { showSuccess, showDeleteConfirm } = useAlert()

interface User {
  id: number
  name: string
  username: string
  phone: string
  email?: string
  profileImage?: string
  role: string
  permissions: string[]
  status: 'active' | 'inactive' | 'suspended'
  createdAt: string
  lastLogin: string
  profileUrl?: string
  linkCount?: number
  subscriptionMonths?: number
  subscriptionEndDate?: string
}

interface Role {
  id: number
  name: string
  displayName: string
  permissions: string[]
  description: string
}

// Predefined roles
const roles = ref<Role[]>([
  {
    id: 1,
    name: 'super_admin',
    displayName: 'مدیر کل',
    permissions: ['*'],
    description: 'دسترسی کامل به تمامی قسمت‌ها'
  },
  {
    id: 2,
    name: 'admin',
    displayName: 'مدیر',
    permissions: ['dashboard', 'users.view', 'users.create', 'users.edit', 'links.*', 'cards.*', 'reports'],
    description: 'دسترسی به مدیریت کاربران، لینک‌ها و پروفایل‌ها'
  },
  {
    id: 3,
    name: 'moderator',
    displayName: 'مدیر محتوا',
    permissions: ['dashboard', 'links.view', 'links.edit', 'cards.view', 'cards.edit'],
    description: 'دسترسی به ویرایش محتوا'
  },
  {
    id: 4,
    name: 'user',
    displayName: 'کاربر عادی',
    permissions: ['dashboard'],
    description: 'دسترسی محدود به داشبورد'
  }
])

// Reactive data
const searchQuery = ref('')
const filterRole = ref('')
const filterStatus = ref('')
const sortBy = ref('created_desc')
const currentPage = ref(1)
const itemsPerPage = 9
const showAddModal = ref(false)
const showEditModal = ref(false)
const showExportModal = ref(false)
const showRoleModal = ref(false)
const editingUser = ref<User | null>(null)

// Form data for user
const formData = ref({
  name: '',
  username: '',
  phone: '',
  email: '',
  profileImage: '',
  role: 'user',
  permissions: [] as string[],
  status: 'active' as 'active' | 'inactive' | 'suspended'
})

// Export settings
const exportSettings = ref({
  count: 100 as number | 'all',
  startDate: '',
  endDate: '',
  format: 'xlsx' as 'xlsx' | 'csv'
})

// Sample users data
const users = ref<User[]>([
  {
    id: 1,
    name: 'علی احمدی',
    username: 'ali_ahmadi',
    phone: '09123456789',
    email: 'ali@example.com',
    role: 'admin',
    permissions: ['dashboard', 'users.*', 'links.*', 'cards.*'],
    status: 'active',
    createdAt: '1403/04/15',
    lastLogin: '1403/04/22',
    profileUrl: 'https://linku.ir/ali_ahmadi',
    linkCount: 25,
    subscriptionMonths: 12,
    subscriptionEndDate: '1404/04/15'
  },
  {
    id: 2,
    name: 'فاطمه محمدی',
    username: 'fateme_m',
    phone: '09987654321',
    email: 'fateme@example.com',
    role: 'user',
    permissions: ['dashboard'],
    status: 'active',
    createdAt: '1403/04/10',
    lastLogin: '1403/04/21',
    profileUrl: 'https://linku.ir/fateme_m',
    linkCount: 12
  },
  {
    id: 3,
    name: 'محمد رضایی',
    username: 'mohammad_r',
    phone: '09345678901',
    email: 'mohammad@example.com',
    role: 'moderator',
    permissions: ['dashboard', 'links.view', 'links.edit', 'cards.view', 'cards.edit'],
    status: 'suspended',
    createdAt: '1403/04/05',
    lastLogin: '1403/04/18',
    profileUrl: 'https://linku.ir/mohammad_r',
    linkCount: 18,
    subscriptionMonths: 6,
    subscriptionEndDate: '1403/10/05'
  },
  {
    id: 4,
    name: 'مریم حسینی',
    username: 'maryam_h',
    phone: '09567890123',
    email: 'maryam@example.com',
    role: 'user',
    permissions: ['dashboard'],
    status: 'active',
    createdAt: '1403/03/28',
    lastLogin: '1403/04/20',
    profileUrl: 'https://linku.ir/maryam_h',
    linkCount: 8
  },
  {
    id: 5,
    name: 'حسن کریمی',
    username: 'hassan_k',
    phone: '09789012345',
    email: 'hassan@example.com',
    role: 'user',
    permissions: ['dashboard'],
    status: 'inactive',
    createdAt: '1403/03/20',
    lastLogin: '1403/04/15',
    profileUrl: 'https://linku.ir/hassan_k',
    linkCount: 5
  }
])

// Computed properties
const filteredUsers = computed(() => {
  let filtered = [...users.value]

  // Search filter
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(user =>
      user.name.toLowerCase().includes(query) ||
      user.username.toLowerCase().includes(query) ||
      user.phone.includes(query) ||
      (user.email && user.email.toLowerCase().includes(query))
    )
  }

  // Role filter
  if (filterRole.value) {
    filtered = filtered.filter(user => user.role === filterRole.value)
  }

  // Status filter
  if (filterStatus.value) {
    filtered = filtered.filter(user => user.status === filterStatus.value)
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
      filtered.sort((a, b) => a.name.localeCompare(b.name))
      break
    case 'name_desc':
      filtered.sort((a, b) => b.name.localeCompare(a.name))
      break
  }

  return filtered
})

const paginatedUsers = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  const end = start + itemsPerPage
  return filteredUsers.value.slice(start, end)
})

const totalPages = computed(() => Math.ceil(filteredUsers.value.length / itemsPerPage))

// Status styling
const statusClasses: Record<User['status'], string> = {
  active: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
  inactive: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200',
  suspended: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
}

const statusNames: Record<User['status'], string> = {
  active: 'فعال',
  inactive: 'غیرفعال',
  suspended: 'معلق'
}

// Role styling and names
const roleClasses: Record<string, string> = {
  super_admin: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
  admin: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
  moderator: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
  user: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
}

const roleNames: Record<string, string> = {
  super_admin: 'مدیر کل',
  admin: 'مدیر',
  moderator: 'مدیر محتوا',
  user: 'کاربر عادی'
}

// Helper function
const getUserInitials = (name: string) => {
  return name.split(' ').map(n => n[0]).join('').toUpperCase()
}

// Functions
const toggleUserStatus = async (user: User) => {
  try {
    const newStatus = user.status === 'suspended' ? 'active' : 'suspended'
    const message = user.status === 'suspended'
      ? `آیا از رفع تعلیق ${user.name} اطمینان دارید؟`
      : `آیا از تعلیق ${user.name} اطمینان دارید؟`

    const confirmed = await showDeleteConfirm(
      user.status === 'suspended' ? 'رفع تعلیق کاربر' : 'تعلیق کاربر',
      message,
      user.name
    )

    if (confirmed) {
      user.status = newStatus
      showSuccess(
        'تغییر وضعیت موفق',
        user.status === 'suspended' ? 'کاربر با موفقیت معلق شد' : 'تعلیق کاربر با موفقیت رفع شد'
      )
    }
  } catch (error) {
    console.error('Error changing status:', error)
  }
}

const editUser = (user: User) => {
  editingUser.value = user
  formData.value = {
    name: user.name,
    username: user.username,
    phone: user.phone,
    email: user.email || '',
    profileImage: user.profileImage || '',
    role: user.role,
    permissions: [...user.permissions],
    status: user.status
  }
  showEditModal.value = true
}

const saveUser = () => {
  if (editingUser.value) {
    // Update existing user
    Object.assign(editingUser.value, formData.value)
    showSuccess('ویرایش موفق', 'کاربر با موفقیت ویرایش شد')
  } else {
    // Add new user
    const newUser: User = {
      id: Date.now(),
      ...formData.value,
      createdAt: new Date().toLocaleDateString('fa-IR'),
      lastLogin: '-'
    }
    users.value.unshift(newUser)
    showSuccess('افزودن موفق', 'کاربر با موفقیت اضافه شد')
  }
  closeModals()
}

const deleteUser = async (user: User) => {
  try {
    const confirmed = await showDeleteConfirm(
      'حذف کاربر',
      `آیا از حذف ${user.name} اطمینان دارید؟`,
      user.name
    )

    if (confirmed) {
      const index = users.value.findIndex(u => u.id === user.id)
      if (index > -1) {
        users.value.splice(index, 1)
        showSuccess('حذف موفق', 'کاربر با موفقیت حذف شد')
      }
    }
  } catch (error) {
    console.error('Error deleting user:', error)
  }
}

const viewProfile = (user: User) => {
  if (user.profileUrl) {
    window.open(user.profileUrl, '_blank')
  }
}

const manageRoles = () => {
  showRoleModal.value = true
}

const addUser = () => {
  resetForm()
  showAddModal.value = true
}

const resetForm = () => {
  formData.value = {
    name: '',
    username: '',
    phone: '',
    email: '',
    profileImage: '',
    role: 'user',
    permissions: ['dashboard'],
    status: 'active'
  }
  editingUser.value = null
}

const closeModals = () => {
  showAddModal.value = false
  showEditModal.value = false
  showRoleModal.value = false
  resetForm()
}

const exportUsers = () => {
  // Export logic here
  showSuccess('خروجی موفق', 'اطلاعات کاربران با موفقیت خروجی گرفته شد')
  showExportModal.value = false
}
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
