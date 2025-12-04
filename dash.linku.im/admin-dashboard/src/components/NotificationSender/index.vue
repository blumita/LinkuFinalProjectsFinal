<template>
  <div class="w-full p-4 sm:p-6 lg:p-8">
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
      <!-- Header -->
      <div class="p-6 border-b border-gray-200 dark:border-gray-700">
        <div class="flex items-center gap-3">
          <div class="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
            <i class="ti ti-bell text-white text-2xl"></i>
          </div>
          <div>
            <h2 class="text-xl font-bold text-gray-900 dark:text-white">
              ارسال نوتیفیکیشن
            </h2>
            <p class="text-sm text-gray-600 dark:text-gray-400">
              ارسال پیام به کاربران از طریق سیستم اعلان‌ها
            </p>
          </div>
        </div>
      </div>

      <!-- Form -->
      <div class="p-6 space-y-6">
        <!-- Recipients Selection -->
        <div>
          <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
            انتخاب مخاطبین
          </label>
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
            <button
              v-for="option in recipientOptions"
              :key="option.value"
              @click="selectedRecipients = option.value"
              :class="[
                'p-4 rounded-xl border-2 transition-all duration-200 text-right',
                selectedRecipients === option.value
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                  : 'border-gray-200 dark:border-gray-600 hover:border-blue-300 dark:hover:border-blue-700'
              ]"
            >
              <div class="flex items-center gap-3">
                <div :class="[
                  'w-10 h-10 rounded-lg flex items-center justify-center',
                  selectedRecipients === option.value
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                ]">
                  <i :class="option.icon + ' text-xl'"></i>
                </div>
                <div class="flex-1">
                  <div class="font-semibold text-gray-900 dark:text-white">{{ option.label }}</div>
                  <div class="text-xs text-gray-500 dark:text-gray-400">{{ option.description }}</div>
                </div>
              </div>
            </button>
          </div>
        </div>

        <!-- Specific Users (if selected) -->
        <div v-if="selectedRecipients === 'specific'" class="space-y-3">
          <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300">
            انتخاب کاربران خاص
          </label>
          <div class="relative">
            <i class="ti ti-search absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
            <input
              v-model="userSearchQuery"
              type="text"
              placeholder="جستجوی کاربر با نام، ایمیل یا شماره..."
              class="w-full pr-10 pl-3 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              @input="searchUsers"
            />
          </div>

          <!-- Selected Users -->
          <div v-if="selectedUsers.length > 0" class="flex flex-wrap gap-2">
            <div
              v-for="user in selectedUsers"
              :key="user.id"
              class="flex items-center gap-2 px-3 py-1.5 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 rounded-lg"
            >
              <span class="text-sm font-medium">{{ user.name }}</span>
              <button @click="removeUser(user.id)" class="hover:bg-blue-200 dark:hover:bg-blue-800 rounded-full p-0.5">
                <i class="ti ti-x text-sm"></i>
              </button>
            </div>
          </div>

          <!-- User Search Results -->
          <div v-if="showUserResults && filteredUsers.length > 0" class="border border-gray-200 dark:border-gray-600 rounded-xl max-h-64 overflow-y-auto">
            <div
              v-for="user in filteredUsers"
              :key="user.id"
              @click="addUser(user)"
              class="p-3 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer border-b last:border-b-0 border-gray-100 dark:border-gray-700"
            >
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm">
                  {{ getUserInitials(user.name) }}
                </div>
                <div>
                  <div class="font-semibold text-gray-900 dark:text-white">{{ user.name }}</div>
                  <div class="text-xs text-gray-500 dark:text-gray-400">{{ user.email || user.phone }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Notification Type -->
        <div>
          <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
            نوع اعلان
          </label>
          <div class="grid grid-cols-2 md:grid-cols-5 gap-3">
            <button
              v-for="type in notificationTypes"
              :key="type.value"
              @click="selectedType = type.value"
              :class="[
                'p-4 rounded-xl border-2 transition-all duration-200',
                selectedType === type.value
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                  : 'border-gray-200 dark:border-gray-600 hover:border-blue-300 dark:hover:border-blue-700'
              ]"
            >
              <div class="text-center">
                <div :class="[
                  'w-12 h-12 mx-auto rounded-xl flex items-center justify-center mb-2',
                  selectedType === type.value
                    ? type.activeColor
                    : 'bg-gray-100 dark:bg-gray-700'
                ]">
                  <i :class="[type.icon, 'text-xl', selectedType === type.value ? 'text-white' : 'text-gray-600 dark:text-gray-400']"></i>
                </div>
                <div class="text-sm font-medium text-gray-900 dark:text-white">{{ type.label }}</div>
              </div>
            </button>
          </div>
        </div>

        <!-- Title -->
        <div>
          <label for="title" class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
            عنوان اعلان
          </label>
          <input
            id="title"
            v-model="notificationData.title"
            type="text"
            placeholder="عنوان اعلان را وارد کنید..."
            class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
          />
        </div>

        <!-- Message -->
        <div>
          <label for="message" class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
            متن پیام
          </label>
          <textarea
            id="message"
            v-model="notificationData.message"
            rows="4"
            placeholder="متن پیام خود را اینجا بنویسید..."
            class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white resize-none"
          ></textarea>
          <div class="text-xs text-gray-500 dark:text-gray-400 mt-1">
            {{ notificationData.message.length }} کاراکتر
          </div>
        </div>

        <!-- Action Button Link (Optional) -->
        <div>
          <label for="actionLink" class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
            لینک دکمه اقدام (اختیاری)
          </label>
          <input
            id="actionLink"
            v-model="notificationData.actionLink"
            type="text"
            placeholder="مثال: /dashboard/profile"
            class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
          />
        </div>

        <!-- Banner Image Upload -->
        <div>
          <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
            تصویر بنر (اختیاری)
          </label>
          <div class="space-y-2">
            <input
              type="file"
              @change="handleBannerUpload"
              accept="image/*"
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white file:ml-4 file:py-1 file:px-3 file:rounded file:border-0 file:bg-blue-500 file:text-white file:cursor-pointer hover:file:bg-blue-600"
            />
            <div v-if="bannerPreview" class="relative w-full h-32 rounded-xl overflow-hidden border border-gray-300 dark:border-gray-600">
              <img :src="bannerPreview" class="w-full h-full object-cover" alt="Banner preview" />
              <button
                type="button"
                @click="removeBanner"
                class="absolute top-2 right-2 p-1 bg-red-500 hover:bg-red-600 text-white rounded-full transition-colors"
              >
                <i class="ti ti-x text-sm"></i>
              </button>
            </div>
          </div>
        </div>

        <!-- Icon Image Upload -->
        <div>
          <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
            آیکون (اختیاری)
          </label>
          <div class="space-y-2">
            <input
              type="file"
              @change="handleIconUpload"
              accept="image/*"
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white file:ml-4 file:py-1 file:px-3 file:rounded file:border-0 file:bg-blue-500 file:text-white file:cursor-pointer hover:file:bg-blue-600"
            />
            <div v-if="iconPreview" class="relative w-24 h-24 rounded-xl overflow-hidden border border-gray-300 dark:border-gray-600">
              <img :src="iconPreview" class="w-full h-full object-cover" alt="Icon preview" />
              <button
                type="button"
                @click="removeIcon"
                class="absolute top-1 right-1 p-1 bg-red-500 hover:bg-red-600 text-white rounded-full transition-colors"
              >
                <i class="ti ti-x text-xs"></i>
              </button>
            </div>
          </div>
        </div>

        <!-- Background Color Picker -->
        <div>
          <label for="backgroundColor" class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
            رنگ پس‌زمینه (اختیاری)
          </label>
          <div class="flex gap-3">
            <input
              id="backgroundColor"
              v-model="notificationData.backgroundColor"
              type="color"
              class="w-20 h-12 border border-gray-300 dark:border-gray-600 rounded-xl cursor-pointer"
            />
            <input
              v-model="notificationData.backgroundColor"
              type="text"
              placeholder="#ffffff"
              class="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            />
            <button
              v-if="notificationData.backgroundColor"
              @click="notificationData.backgroundColor = ''"
              type="button"
              class="px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              <i class="ti ti-x"></i>
            </button>
          </div>
        </div>

        <!-- Pin Notification -->
        <div class="flex items-center gap-3 p-4 bg-amber-50 dark:bg-amber-900/20 border-2 border-amber-200 dark:border-amber-800 rounded-xl">
          <input
            id="isPinned"
            v-model="notificationData.isPinned"
            type="checkbox"
            class="w-5 h-5 text-amber-600 border-gray-300 rounded focus:ring-amber-500 focus:ring-2"
          />
          <label for="isPinned" class="flex-1 cursor-pointer">
            <div class="flex items-center gap-2">
              <i class="ti ti-pin text-amber-600 dark:text-amber-400"></i>
              <span class="font-semibold text-gray-900 dark:text-white">پین کردن اعلان</span>
            </div>
            <p class="text-xs text-gray-600 dark:text-gray-400 mt-0.5">
              این اعلان همیشه در بالای لیست نمایش داده شده و قابل حذف نیست
            </p>
          </label>
        </div>

        <!-- Preview -->
        <div class="bg-gray-50 dark:bg-gray-900/50 rounded-xl p-6 border-2 border-dashed border-gray-300 dark:border-gray-600">
          <div class="flex items-center gap-2 mb-4">
            <i class="ti ti-eye text-gray-500"></i>
            <h3 class="text-sm font-semibold text-gray-700 dark:text-gray-300">پیش‌نمایش</h3>
          </div>
          <div class="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700 shadow-sm">
            <div class="flex gap-3">
              <div :class="[
                'w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0',
                getTypeColor(selectedType)
              ]">
                <i :class="getTypeIcon(selectedType) + ' text-white text-lg'"></i>
              </div>
              <div class="flex-1">
                <div class="font-semibold text-gray-900 dark:text-white mb-1">
                  {{ notificationData.title || 'عنوان اعلان' }}
                </div>
                <div class="text-sm text-gray-600 dark:text-gray-400">
                  {{ notificationData.message || 'متن پیام شما اینجا نمایش داده می‌شود...' }}
                </div>
                <div class="text-xs text-gray-500 dark:text-gray-500 mt-2">
                  الان
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Send Button -->
        <div class="flex justify-end gap-3">
          <button
            @click="resetForm"
            class="px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors font-medium"
          >
            پاک کردن فرم
          </button>
          <button
            @click="sendNotification"
            :disabled="!canSend || isSending"
            :class="[
              'px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl font-semibold transition-all duration-200 flex items-center gap-2',
              canSend && !isSending
                ? 'hover:from-blue-600 hover:to-purple-700 hover:shadow-lg'
                : 'opacity-50 cursor-not-allowed'
            ]"
          >
            <i v-if="!isSending" class="ti ti-send"></i>
            <div v-else class="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            <span>{{ isSending ? 'در حال ارسال...' : 'ارسال اعلان' }}</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Success Toast -->
    <Transition name="fade">
      <div
        v-if="showSuccessToast"
        class="fixed bottom-6 left-6 bg-green-500 text-white px-6 py-4 rounded-xl shadow-2xl flex items-center gap-3 z-50"
      >
        <i class="ti ti-check text-2xl"></i>
        <div>
          <div class="font-semibold">ارسال موفق!</div>
          <div class="text-sm opacity-90">اعلان به {{ sentCount }} کاربر ارسال شد</div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { getCurrentInstance } from 'vue'
import type { AxiosInstance } from 'axios'

defineOptions({
  name: 'NotificationSender'
})

interface User {
  id: number
  name: string
  email?: string
  phone?: string
}

const { appContext } = getCurrentInstance()!
const axios = appContext.config.globalProperties.$axios as AxiosInstance

// Recipient Options
const recipientOptions = [
  {
    value: 'all',
    label: 'همه کاربران',
    description: 'تمام کاربران فعال',
    icon: 'ti ti-users'
  },
  {
    value: 'premium',
    label: 'اشتراک ویژه',
    description: 'کاربران پرمیوم',
    icon: 'ti ti-crown'
  },
  {
    value: 'free',
    label: 'رایگان',
    description: 'کاربران رایگان',
    icon: 'ti ti-user'
  },
  {
    value: 'specific',
    label: 'انتخابی',
    description: 'کاربران خاص',
    icon: 'ti ti-user-check'
  }
]

// Notification Types
const notificationTypes = [
  {
    value: 'system',
    label: 'سیستمی',
    icon: 'ti ti-settings',
    activeColor: 'bg-blue-500'
  },
  {
    value: 'subscription',
    label: 'اشتراک',
    icon: 'ti ti-crown',
    activeColor: 'bg-amber-500'
  },
  {
    value: 'payment',
    label: 'پرداخت',
    icon: 'ti ti-credit-card',
    activeColor: 'bg-green-500'
  },
  {
    value: 'security',
    label: 'امنیت',
    icon: 'ti ti-shield',
    activeColor: 'bg-red-500'
  },
  {
    value: 'general',
    label: 'عمومی',
    icon: 'ti ti-bell',
    activeColor: 'bg-purple-500'
  }
]

// State
const selectedRecipients = ref<string>('all')
const selectedType = ref<string>('general')
const userSearchQuery = ref('')
const showUserResults = ref(false)
const selectedUsers = ref<User[]>([])
const allUsers = ref<User[]>([])
const isSending = ref(false)
const showSuccessToast = ref(false)
const sentCount = ref(0)

const notificationData = ref({
  title: '',
  message: '',
  actionLink: '',
  isPinned: false,
  backgroundColor: ''
})

// Image upload state
const bannerFile = ref<File | undefined>(undefined)
const iconFile = ref<File | undefined>(undefined)
const bannerPreview = ref<string | undefined>(undefined)
const iconPreview = ref<string | undefined>(undefined)

// Computed
const filteredUsers = computed(() => {
  if (!userSearchQuery.value) return []
  const query = userSearchQuery.value.toLowerCase()
  return allUsers.value
    .filter(user => 
      user && // بررسی اینکه user وجود داره
      !selectedUsers.value.find(u => u.id === user.id) &&
      ((user.name?.toLowerCase() || '').includes(query) ||
       (user.email?.toLowerCase() || '').includes(query) ||
       (user.phone || '').includes(query))
    )
    .slice(0, 10)
})

const canSend = computed(() => {
  return notificationData.value.title.trim() !== '' &&
         notificationData.value.message.trim() !== '' &&
         (selectedRecipients.value !== 'specific' || selectedUsers.value.length > 0)
})

// Methods
const getUserInitials = (name: string) => {
  if (!name) return ''
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
}

const getTypeColor = (type: string) => {
  const colors: Record<string, string> = {
    system: 'bg-blue-500',
    subscription: 'bg-amber-500',
    payment: 'bg-green-500',
    security: 'bg-red-500',
    general: 'bg-purple-500'
  }
  return colors[type] || 'bg-gray-500'
}

const getTypeIcon = (type: string) => {
  const icons: Record<string, string> = {
    system: 'ti ti-settings',
    subscription: 'ti ti-crown',
    payment: 'ti ti-credit-card',
    security: 'ti ti-shield',
    general: 'ti ti-bell'
  }
  return icons[type] || 'ti ti-bell'
}

const searchUsers = () => {
  showUserResults.value = userSearchQuery.value.length > 0
}

const addUser = (user: User) => {
  if (!selectedUsers.value.find(u => u.id === user.id)) {
    selectedUsers.value.push(user)
  }
  userSearchQuery.value = ''
  showUserResults.value = false
}

const removeUser = (userId: number) => {
  selectedUsers.value = selectedUsers.value.filter(u => u.id !== userId)
}

// Image upload handlers
const handleBannerUpload = (event: Event) => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  
  if (file) {
    bannerFile.value = file
    const reader = new FileReader()
    reader.onload = (e) => {
      bannerPreview.value = e.target?.result as string
    }
    reader.readAsDataURL(file)
  }
}

const handleIconUpload = (event: Event) => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  
  if (file) {
    iconFile.value = file
    const reader = new FileReader()
    reader.onload = (e) => {
      iconPreview.value = e.target?.result as string
    }
    reader.readAsDataURL(file)
  }
}

const removeBanner = () => {
  bannerFile.value = undefined
  bannerPreview.value = undefined
}

const removeIcon = () => {
  iconFile.value = undefined
  iconPreview.value = undefined
}

const resetForm = () => {
  notificationData.value = {
    title: '',
    message: '',
    actionLink: '',
    isPinned: false,
    backgroundColor: ''
  }
  selectedUsers.value = []
  userSearchQuery.value = ''
  showUserResults.value = false
  bannerFile.value = undefined
  iconFile.value = undefined
  bannerPreview.value = undefined
  iconPreview.value = undefined
}

const sendNotification = async () => {
  if (!canSend.value) return

  isSending.value = true

  try {
    const hasImages = bannerFile.value || iconFile.value
    
    let response
    
    if (hasImages) {
      // Use FormData for file uploads
      const formData = new FormData()
      formData.append('recipients', selectedRecipients.value)
      formData.append('type', selectedType.value)
      formData.append('title', notificationData.value.title)
      formData.append('message', notificationData.value.message)
      
      if (notificationData.value.actionLink) {
        formData.append('actionLink', notificationData.value.actionLink)
      }
      
      if (notificationData.value.backgroundColor) {
        formData.append('backgroundColor', notificationData.value.backgroundColor)
      }
      
      formData.append('isPinned', notificationData.value.isPinned ? '1' : '0')
      
      if (selectedRecipients.value === 'specific') {
        selectedUsers.value.forEach((user, index) => {
          formData.append(`userIds[${index}]`, user.id.toString())
        })
      }
      
      if (bannerFile.value) {
        formData.append('imageUrl', bannerFile.value)
      }
      
      if (iconFile.value) {
        formData.append('iconUrl', iconFile.value)
      }
      
      response = await axios.post('/user/admin/notifications/send', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
    } else {
      // Use regular JSON payload
      const payload = {
        recipients: selectedRecipients.value,
        userIds: selectedRecipients.value === 'specific' ? selectedUsers.value.map(u => u.id) : [],
        type: selectedType.value,
        title: notificationData.value.title,
        message: notificationData.value.message,
        actionLink: notificationData.value.actionLink || null,
        backgroundColor: notificationData.value.backgroundColor || null,
        isPinned: notificationData.value.isPinned
      }
      
      response = await axios.post('/user/admin/notifications/send', payload)
    }

    sentCount.value = response.data.sentCount || 0
    showSuccessToast.value = true
    
    setTimeout(() => {
      showSuccessToast.value = false
    }, 4000)

    resetForm()

  } catch (error) {
    console.error('Error sending notification:', error)
    alert('خطا در ارسال اعلان. لطفاً دوباره تلاش کنید.')
  } finally {
    isSending.value = false
  }
}

const fetchUsers = async () => {
  try {
    const { data } = await axios.get('/user/admin')
    allUsers.value = data.data
  } catch (error) {
    console.error('Error fetching users:', error)
  }
}

onMounted(() => {
  fetchUsers()
})
</script>

<style scoped>
.fade-enter-active, .fade-leave-active {
  transition: all 0.3s ease;
}

.fade-enter-from {
  opacity: 0;
  transform: translateY(20px);
}

.fade-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}
</style>
