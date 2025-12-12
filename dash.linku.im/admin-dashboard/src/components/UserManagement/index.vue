<template>
  <div class="w-full p-4 sm:p-6 lg:p-8">
    <div
        class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
      <!-- Header -->
      <div class="p-6 border-b border-gray-200 dark:border-gray-700">
        <div class="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <!-- Title and Stats -->
          <div>
            <h2 class="text-xl font-bold text-gray-900 dark:text-white mb-1">
              مدیریت پروفایل‌ها
            </h2>
            <p class="text-sm text-gray-600 dark:text-gray-400">
              مجموع {{ filteredUsers.length }} پروفایل کاربری
            </p>
          </div>

          <!-- Actions -->
          <div class="flex flex-wrap gap-3">
            <button @click="exportToExcel"
                    class="flex items-center gap-2 px-4 py-2 bg-green-700 text-white rounded-lg hover:bg-green-800 transition-colors">
              <i class="ti ti-file-spreadsheet text-sm"></i>
              خروجی Excel
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

          <!-- Subscription Filter -->
          <div class="relative">
            <button @click="showSubscriptionDropdown = !showSubscriptionDropdown"
                    class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white text-left flex justify-between items-center">
              <span>{{
                  filterSubscription ? subscriptionNames[filterSubscription as User['subscriptionType']] : 'همه اشتراک‌ها'
                }}</span>
              <i class="ti ti-chevron-down text-sm"></i>
            </button>
            <ul v-show="showSubscriptionDropdown"
                class="absolute z-10 w-full mt-1 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg">
              <li @click="filterSubscription = ''; showSubscriptionDropdown = false"
                  class="px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 cursor-pointer">همه اشتراک‌ها
              </li>
              <li @click="filterSubscription = 'premium'; showSubscriptionDropdown = false"
                  class="px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 cursor-pointer">ویژه
              </li>
              <li @click="filterSubscription = 'free'; showSubscriptionDropdown = false"
                  class="px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 cursor-pointer">رایگان
              </li>
            </ul>
          </div>

          <!-- Status Filter -->
          <div class="relative">
            <button @click="showStatusDropdown = !showStatusDropdown"
                    class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white text-left flex justify-between items-center">
              <span>{{ filterStatus ? statusNames[filterStatus as User['status']] : 'همه وضعیت‌ها' }}</span>
              <i class="ti ti-chevron-down text-sm"></i>
            </button>
            <ul v-show="showStatusDropdown"
                class="absolute z-10 w-full mt-1 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg">
              <li @click="filterStatus = ''; showStatusDropdown = false"
                  class="px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 cursor-pointer">همه وضعیت‌ها
              </li>
              <li @click="filterStatus = 'active'; showStatusDropdown = false"
                  class="px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 cursor-pointer">فعال
              </li>
              <li @click="filterStatus = 'inactive'; showStatusDropdown = false"
                  class="px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 cursor-pointer">غیرفعال
              </li>
              <li @click="filterStatus = 'suspended'; showStatusDropdown = false"
                  class="px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 cursor-pointer">معلق
              </li>
            </ul>
          </div>

          <!-- Sort -->
          <div class="relative">
            <button @click="showSortDropdown = !showSortDropdown"
                    class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white text-left flex justify-between items-center">
              <span>{{ sortNames[sortBy] }}</span>
              <i class="ti ti-chevron-down text-sm"></i>
            </button>
            <ul v-show="showSortDropdown"
                class="absolute z-10 w-full mt-1 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg">
              <li @click="sortBy = 'created_desc'; showSortDropdown = false"
                  class="px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 cursor-pointer">جدیدترین
              </li>
              <li @click="sortBy = 'created_asc'; showSortDropdown = false"
                  class="px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 cursor-pointer">قدیمی‌ترین
              </li>
              <li @click="sortBy = 'name_asc'; showSortDropdown = false"
                  class="px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 cursor-pointer">نام (الف - ی)
              </li>
              <li @click="sortBy = 'name_desc'; showSortDropdown = false"
                  class="px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 cursor-pointer">نام (ی - الف)
              </li>
            </ul>
          </div>
        </div>
      </div>

      <!-- Results Header -->
      <div class="px-6 py-3 border-b border-gray-200 dark:border-gray-700">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-4">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
              فهرست کاربران
            </h3>
            <span
                class="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 rounded-full text-sm font-medium">
            {{ filteredUsers.length }} کاربر
          </span>
          </div>
          <div class="text-sm text-gray-500 dark:text-gray-400">
            صفحه {{ currentPage }} از {{ totalPages }}
          </div>
        </div>
      </div>

      <!-- Modern Users List -->
      <div class="p-2">
        <div class="space-y-4">
          <div v-for="user in paginatedUsers" :key="user.id"
               class="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600 transition-all duration-300 group">

            <!-- List Layout - Horizontal -->
            <div class="flex flex-wrap items-center gap-6">
              <!-- User Info Section -->
              <div class="flex items-center gap-4 flex-1">
                <!-- Avatar -->
                <div class="relative">
                  <div v-if="user.profileImage" class="w-14 h-14 rounded-full overflow-hidden">
                    <img :src="user.profileImage" :alt="user.name" class="w-full h-full object-cover">
                  </div>
                  <div v-else
                       class="w-14 h-14 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold">
                    {{ getUserInitials(user.name) }}
                  </div>
                  <!-- Premium Badge -->
                  <div v-if="user.subscriptionType === 'premium'"
                       class="absolute -top-1 -right-1 w-5 h-5 bg-amber-500 rounded-full flex items-center justify-center">
                    <i class="ti ti-star-filled text-white text-xs"></i>
                  </div>
                </div>

                <!-- User Details -->
                <div class="flex-1">
                  <div class="flex items-center gap-3 mb-1">
                    <h3 class="font-bold text-lg text-gray-900 dark:text-white">{{ user.name }}</h3>
                    <span :class="['px-2 py-1 rounded-lg text-xs font-medium', statusClasses[user.status]]">
                    {{ statusNames[user.status] }}
                  </span>
                  </div>
                  <p class="text-sm text-gray-500 dark:text-gray-400 mb-2">{{ user.username }}@</p>
                  <div class="flex flex-wrap items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                    <div class="flex items-center gap-1">
                      <i class="ti ti-phone text-xs"></i>
                      <span>{{ user.phone }}</span>
                    </div>
                    <div v-if="user.email" class="flex items-center gap-1">
                      <i class="ti ti-mail text-xs"></i>
                      <span>{{ user.email }}</span>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Links Summary for Premium Users -->
              <div v-if="user.subscriptionType === 'premium'" class="flex-shrink-0 w-full sm:w-48">
                <div
                    class="bg-gradient-to-r from-amber-50 to-yellow-50 dark:from-amber-900/20 dark:to-yellow-900/20 rounded-lg p-3 border border-amber-200 dark:border-amber-700">
                  <div class="flex items-center justify-between mb-2">
                    <div class="flex items-center gap-1">
                      <i class="ti ti-link text-amber-600 dark:text-amber-400 text-sm"></i>
                      <span class="text-sm font-medium text-amber-800 dark:text-amber-300">پروفایل ها</span>
                    </div>
                    <span class="text-sm font-bold text-amber-700 dark:text-amber-300">{{
                        (user.cardCount > 5 ? 5 : user.cardCount) || 0
                      }}/5</span>
                  </div>

                  <!-- Progress Bar -->
                  <div class="w-full bg-amber-200 dark:bg-amber-800/50 rounded-full h-1.5">
                    <div class="bg-amber-500 dark:bg-amber-400 h-1.5 rounded-full transition-all duration-300"
                         :style="{ width: Math.min(((user.cardCount > 5 ? 5 : user.cardCount || 0) / 5) * 100, 100) + '%' }"></div>
                  </div>
                </div>
              </div>

              <!-- Non-Premium Users Link Count -->
              <div v-else class="flex-shrink-0 w-full sm:w-48">
                <div
                    class="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800/50 dark:to-gray-700/50 rounded-lg p-3 border border-gray-200 dark:border-gray-600">
                  <div class="flex items-center justify-between mb-2">
                    <div class="flex items-center gap-1">
                      <i class="ti ti-link text-gray-600 dark:text-gray-400 text-sm"></i>
                      <span class="text-sm font-medium text-gray-800 dark:text-gray-300">پروفایل ها</span>
                    </div>
                    <span class="text-sm font-bold text-gray-700 dark:text-gray-300">{{ (user.cardCount > 1 ? 1 : user.cardCount) || 0 }}/1</span>
                  </div>

                  <!-- Progress Bar -->
                  <div class="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-1.5 mb-1">
                    <div class="bg-gray-500 dark:bg-gray-400 h-1.5 rounded-full transition-all duration-300"
                         :style="{ width: Math.min(((user.cardCount > 1 ? 1 : user.cardCount || 0)) * 100, 100) + '%' }"></div>
                  </div>

                  <div class="flex items-center justify-between">
                    <p class="text-xs text-gray-600 dark:text-gray-400">
                      <span v-if="(user.cardCount || 0) === 0">می‌توانید 1 پروفایل اضافه کنید</span>
                      <span v-else class="font-medium">پروفایل شما استفاده شده</span>
                    </p>
                    <span
                        class="text-xs px-1.5 py-0.5 bg-gray-200 dark:bg-gray-600 text-gray-600 dark:text-gray-400 rounded">رایگان</span>
                  </div>
                </div>
              </div>

              <!-- Action Buttons -->
              <div class="flex flex-wrap gap-2 justify-center w-full">
                <!-- View Links Button for All Users -->
                <button @click.stop="viewUserCards(user)"
                        :class="[
                        'w-full sm:w-auto px-4 py-2 text-white rounded-lg transition-all duration-300 text-sm font-medium flex justify-center items-center gap-2',
                        user.subscriptionType === 'premium'
                          ? 'bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600'
                          : 'bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700'
                      ]"
                        title="مشاهده پروفایل ها">
                  <i class="ti ti-link text-sm"></i>
                  پروفایل ‌ها
                </button>

                <!-- View Profile Button -->
                <button @click.stop="viewProfile(user)" v-if="user.profileUrl"
                        class="w-full sm:w-auto px-3 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-300 text-sm font-medium"
                        title="مشاهده پروفایل">
                  <i class="ti ti-external-link text-sm"></i>
                </button>

                <!-- Edit Button -->
                <button :disabled="true" @click.stop="editUser(user)"
                        class="w-full sm:w-auto px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300
                        bg-green-100 text-green-700 hover:bg-green-200
                        disabled:bg-gray-200 disabled:text-gray-500 disabled:cursor-not-allowed"
                        title="ویرایش">
                  <i class="ti ti-edit text-sm"></i>
                </button>

                <!-- Status Toggle Button -->
                <button @click.stop="toggleUserStatus(user)"
                        class="w-full sm:w-auto px-3 py-2 bg-orange-100 text-orange-700 rounded-lg hover:bg-orange-200 transition-all duration-300 text-sm font-medium"
                        :title="user.status === 'suspended' ? 'رفع تعلیق' : 'تعلیق کردن'">
                  <i class="ti ti-ban text-sm" v-if="user.status !== 'suspended'"></i>
                  <i class="ti ti-check text-sm" v-else></i>
                </button>

                <!-- Manual Upgrade Button -->
                <button @click.stop="openUpgradeModal(user)"
                        class="w-full sm:w-auto px-3 py-2 bg-gradient-to-r from-purple-100 to-purple-200 text-purple-700 rounded-lg hover:from-purple-200 hover:to-purple-300 transition-all duration-300 text-sm font-medium"
                        title="ارتقای دستی">
                  <i class="ti ti-crown text-sm"></i>
                </button>

                <!-- Delete Button -->
                <button
                    :disabled="true"
                    @click.stop="deleteUser(user)"
                    class="w-full sm:w-auto px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300
                    bg-red-100 text-red-700 hover:bg-red-200
                    disabled:bg-gray-200 disabled:text-gray-500 disabled:cursor-not-allowed"
                    title="حذف"
                >
                  <i class="ti ti-trash text-sm"></i>
                </button>

              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Enhanced Pagination -->
      <div v-if="totalPages > 1"
           class="px-6 py-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
        <div class="flex flex-col sm:flex-row items-center justify-between gap-4">
          <!-- Results Info -->
          <div class="flex items-center gap-4">
            <div class="text-sm text-gray-600 dark:text-gray-400">
              نمایش <span class="font-medium text-gray-900 dark:text-white">{{
                ((currentPage - 1) * itemsPerPage) + 1
              }}</span> تا
              <span class="font-medium text-gray-900 dark:text-white">{{
                  Math.min(currentPage * itemsPerPage, filteredUsers.length)
                }}</span>
              از <span class="font-medium text-gray-900 dark:text-white">{{ filteredUsers.length }}</span> کاربر
            </div>
            <div class="text-xs text-gray-500 dark:text-gray-400 bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded">
              {{ itemsPerPage }} مورد در صفحه
            </div>
          </div>

          <!-- Pagination Controls -->
          <div class="flex items-center gap-1">
            <!-- First Page -->
            <button v-if="currentPage > 2" @click="currentPage = 1"
                    class="px-3 py-2 text-sm bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-600 transition-all duration-300">
              1
            </button>
            <span v-if="currentPage > 3" class="px-2 text-gray-400">...</span>

            <!-- Previous Page -->
            <button @click="currentPage = Math.max(1, currentPage - 1)"
                    :disabled="currentPage === 1"
                    class="px-4 py-2 text-sm bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed border border-gray-200 dark:border-gray-600 transition-all duration-300 flex items-center gap-2">
              <i class="ti ti-chevron-right text-sm"></i>
              قبلی
            </button>

            <!-- Current Page -->
            <div
                class="px-4 py-2 text-sm bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg font-medium shadow-lg">
              {{ currentPage }}
            </div>

            <!-- Next Page -->
            <button @click="currentPage = Math.min(totalPages, currentPage + 1)"
                    :disabled="currentPage === totalPages"
                    class="px-4 py-2 text-sm bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed border border-gray-200 dark:border-gray-600 transition-all duration-300 flex items-center gap-2">
              بعدی
              <i class="ti ti-chevron-left text-sm"></i>
            </button>

            <!-- Last Page -->
            <span v-if="currentPage < totalPages - 2" class="px-2 text-gray-400">...</span>
            <button v-if="currentPage < totalPages - 1" @click="currentPage = totalPages"
                    class="px-3 py-2 text-sm bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-600 transition-all duration-300">
              {{ totalPages }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Edit User Modal -->
    <div v-if="showEditModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md mx-4">
        <div class="flex justify-between items-center mb-4">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white">ویرایش پروفایل</h3>
          <button @click="closeEditModal" class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
            <i class="ti ti-x text-xl"></i>
          </button>
        </div>

        <form @submit.prevent="saveUser">
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">نام</label>
              <input v-model="editForm.name" type="text" required
                     class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white">
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">نام کاربری</label>
              <input v-model="editForm.username" type="text" required
                     class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white">
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">شماره موبایل</label>
              <input v-model="editForm.phone" type="tel" required
                     class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white">
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">ایمیل</label>
              <input v-model="editForm.email" type="email"
                     class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white">
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">نوع اشتراک</label>
              <div class="relative">
                <button @click="showModalSubscriptionDropdown = !showModalSubscriptionDropdown" type="button"
                        class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white text-left flex justify-between items-center">
                  <span>{{ subscriptionNames[editForm.subscriptionType] }}</span>
                  <i class="ti ti-chevron-down text-sm"></i>
                </button>
                <ul v-show="showModalSubscriptionDropdown"
                    class="absolute z-10 w-full mt-1 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg">
                  <li @click="editForm.subscriptionType = 'free'; showModalSubscriptionDropdown = false"
                      class="px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 cursor-pointer">رایگان
                  </li>
                  <li @click="editForm.subscriptionType = 'premium'; showModalSubscriptionDropdown = false"
                      class="px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 cursor-pointer">ویژه
                  </li>
                </ul>
              </div>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">وضعیت</label>
              <div class="relative">
                <button @click="showModalStatusDropdown = !showModalStatusDropdown" type="button"
                        class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white text-left flex justify-between items-center">
                  <span>{{ statusNames[editForm.status] }}</span>
                  <i class="ti ti-chevron-down text-sm"></i>
                </button>
                <ul v-show="showModalStatusDropdown"
                    class="absolute z-10 w-full mt-1 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg">
                  <li @click="editForm.status = 'active'; showModalStatusDropdown = false"
                      class="px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 cursor-pointer">فعال
                  </li>
                  <li @click="editForm.status = 'inactive'; showModalStatusDropdown = false"
                      class="px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 cursor-pointer">غیرفعال
                  </li>
                  <li @click="editForm.status = 'suspended'; showModalStatusDropdown = false"
                      class="px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 cursor-pointer">معلق
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div class="flex gap-3 mt-6">
            <button type="submit"
                    class="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              ذخیره تغییرات
            </button>
            <button type="button" @click="closeEditModal"
                    class="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors">
              انصراف
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Role Management Modal - Not needed for customers -->
    <!-- This section is removed as we're managing customers, not admin roles -->

    <!-- Cards Modal -->
    <div v-if="showCardsModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div class="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        <!-- Modal Header -->
        <div class="p-6 border-b border-gray-200 dark:border-gray-700">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-4">
              <div v-if="selectedUser?.profileImage" class="w-12 h-12 rounded-full overflow-hidden">
                <img :src="selectedUser.profileImage" :alt="selectedUser.name" class="w-full h-full object-cover">
              </div>
              <div v-else
                   class="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold">
                {{ selectedUser ? getUserInitials(selectedUser.name) : '' }}
              </div>
              <div>
                <h3 class="text-xl font-bold text-gray-900 dark:text-white">پروفایل‌های {{ selectedUser?.name }}</h3>
                <p class="text-sm text-gray-500 dark:text-gray-400">{{ selectedUser?.username }}@</p>
              </div>
            </div>
            <button @click="closeCardsModal"
                    class="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
              <i class="ti ti-x text-xl text-gray-500 dark:text-gray-400"></i>
            </button>
          </div>

          <!-- Subscription Status -->
          <div v-if="selectedUser?.subscriptionType === 'premium'"
               class="mt-4 bg-gradient-to-r from-amber-50 to-yellow-50 dark:from-amber-900/20 dark:to-yellow-900/20 rounded-lg p-3 border border-amber-200 dark:border-amber-700">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-2">
                <i class="ti ti-star-filled text-amber-500"></i>
                <span class="font-medium text-amber-800 dark:text-amber-300">کاربر ویژه</span>
              </div>
              <span class="text-sm text-amber-700 dark:text-amber-400">{{ userCards.length }}/5 پروفایل استفاده شده</span>
            </div>
          </div>

          <div v-else
               class="mt-4 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800/50 dark:to-gray-700/50 rounded-lg p-3 border border-gray-200 dark:border-gray-600">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-2">
                <i class="ti ti-user text-gray-500 dark:text-gray-400"></i>
                <span class="font-medium text-gray-800 dark:text-gray-300">کاربر رایگان</span>
              </div>
              <span class="text-sm text-gray-700 dark:text-gray-400">{{ userCards.length }}/1 پروفایل استفاده شده</span>
            </div>
          </div>
        </div>

        <!-- Modal Body -->
        <div class="p-6 overflow-y-auto max-h-[60vh]">
          <div v-if="userCards.length === 0" class="text-center py-12">
            <div
                class="w-16 h-16 mx-auto mb-4 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
              <i class="ti ti-link-off text-2xl text-gray-400"></i>
            </div>
            <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">هیچ پروفایل موجود نیست</h3>
            <p class="text-gray-500 dark:text-gray-400">
            <span v-if="selectedUser?.subscriptionType === 'premium'">
              این کاربر ویژه هنوز از ظرفیت 5 پروفایل خود استفاده نکرده است.
            </span>
              <span v-else>
              این کاربر رایگان هنوز پروفایل خود را اضافه نکرده است.
            </span>
            </p>
          </div>

          <div v-else class="space-y-4">
            <div v-for="card in userCards" :key="card.id"
                 class="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4 border border-gray-200 dark:border-gray-600 hover:border-blue-300 dark:hover:border-blue-600 transition-all duration-300">
              <div class="flex items-center justify-between mb-3">
                <div class="flex items-center gap-3">
                  <div class="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                    <img :src="card.avatar" alt="avatar" class="w-10 h-10 rounded-lg object-cover" />

                  </div>
                  <div>
                    <h4 class="font-semibold text-gray-900 dark:text-white">{{ card.userName }}</h4>
                    <a :href="card.url" target="_blank"
                       class="text-sm text-blue-600 dark:text-blue-400 hover:underline">
                      {{ card.url }}
                    </a>
                  </div>
                </div>

                <!-- Status and Stats -->
                <div class="flex items-center gap-4">
                  <div class="text-center">
                    <p class="text-xs text-gray-500 dark:text-gray-400">کلیک‌ها</p>
                    <p class="text-sm font-bold text-gray-900 dark:text-white">{{ card.views }}</p>
                  </div>
                  <div :class="[
                          'px-3 py-1 rounded-lg text-xs font-medium',
                          card.isActive
                            ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                            : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                        ]">
                    {{ card.isActive ? 'فعال' : 'غیرفعال' }}
                  </div>
                </div>
              </div>

              <div class="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                <span>تاریخ ایجاد: {{ formatDate(card.createdAt) }}</span>
                <div class="flex items-center gap-2">
                <span class="text-xs bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 px-2 py-1 rounded">
                  ID: {{ card.id }}
                </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Modal Footer -->
        <div class="p-6 border-t border-gray-200 dark:border-gray-700">
          <div class="flex justify-between items-center">
            <!-- Info Section -->
            <div class="flex items-center gap-4">
              <div class="text-sm text-gray-600 dark:text-gray-400">
                <span class="font-medium">{{ userCards.length }}</span> پروفایل موجود
              </div>
              <div v-if="selectedUser?.subscriptionType === 'premium'"
                   class="text-xs text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 px-2 py-1 rounded">
                {{ 5 - (userCards.length || 0) }} ظرفیت باقی‌مانده
              </div>
              <div v-else
                   class="text-xs text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                کاربر رایگان
              </div>
            </div>

            <!-- Close Button -->
            <button @click="closeCardsModal"
                    class="px-6 py-2 bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-400 dark:hover:bg-gray-500 transition-colors">
              بستن
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Manual Upgrade Modal -->
  <div v-if="showUpgradeModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
    <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
      <!-- Modal Header -->
      <div class="p-6 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-purple-500 to-purple-600">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
              <i class="ti ti-crown text-white text-xl"></i>
            </div>
            <div>
              <h3 class="text-lg font-bold text-white">ارتقای دستی اشتراک</h3>
              <p class="text-sm text-white/80 mt-0.5">{{ selectedUpgradeUser?.name }}</p>
            </div>
          </div>
          <button @click="closeUpgradeModal" class="text-white/80 hover:text-white transition-colors">
            <i class="ti ti-x text-xl"></i>
          </button>
        </div>
      </div>

      <!-- Modal Body -->
      <div class="p-6 space-y-4">
        <!-- User Info -->
        <div class="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
          <div class="flex items-center gap-3 mb-3">
            <img v-if="selectedUpgradeUser?.profileImage"
                 :src="selectedUpgradeUser.profileImage"
                 class="w-12 h-12 rounded-full object-cover"
                 alt="Profile">
            <div v-else class="w-12 h-12 rounded-full bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center">
              <i class="ti ti-user text-white text-xl"></i>
            </div>
            <div class="flex-1">
              <p class="font-medium text-gray-900 dark:text-white">{{ selectedUpgradeUser?.name }}</p>
              <p class="text-sm text-gray-600 dark:text-gray-400">{{ selectedUpgradeUser?.phone }}</p>
            </div>
          </div>
          <div class="flex items-center justify-between text-sm">
            <span class="text-gray-600 dark:text-gray-400">وضعیت فعلی:</span>
            <span :class="[
              'px-3 py-1 rounded-full font-medium',
              selectedUpgradeUser?.subscriptionType === 'premium'
                ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400'
                : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
            ]">
              {{ selectedUpgradeUser?.subscriptionType === 'premium' ? 'پرمیوم' : 'رایگان' }}
            </span>
          </div>
        </div>

        <!-- Duration Selection -->
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            <i class="ti ti-calendar text-purple-500 ml-1"></i>
            مدت زمان اشتراک
          </label>
          <div class="grid grid-cols-2 gap-3">
            <button
              v-for="duration in upgradeDurations"
              :key="duration.value"
              @click="selectedDuration = duration.value"
              :class="[
                'p-4 rounded-lg border-2 transition-all duration-200 text-center',
                selectedDuration === duration.value
                  ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20'
                  : 'border-gray-200 dark:border-gray-600 hover:border-purple-300 dark:hover:border-purple-600'
              ]"
            >
              <i :class="['ti', duration.icon, 'text-2xl mb-2', selectedDuration === duration.value ? 'text-purple-600' : 'text-gray-400']"></i>
              <p :class="['font-bold text-lg', selectedDuration === duration.value ? 'text-purple-600 dark:text-purple-400' : 'text-gray-700 dark:text-gray-300']">
                {{ duration.label }}
              </p>
              <p :class="['text-xs mt-1', selectedDuration === duration.value ? 'text-purple-500' : 'text-gray-500']">
                {{ duration.months }} ماه
              </p>
            </button>
          </div>
        </div>

        <!-- Note -->
        <div class="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
          <div class="flex gap-2">
            <i class="ti ti-info-circle text-blue-500 flex-shrink-0 mt-0.5"></i>
            <p class="text-sm text-blue-700 dark:text-blue-300">
              با تایید، اشتراک کاربر به مدت
              <strong>{{ upgradeDurations.find(d => d.value === selectedDuration)?.months }} ماه</strong>
              فعال می‌شود.
            </p>
          </div>
        </div>
      </div>

      <!-- Modal Footer -->
      <div class="p-6 border-t border-gray-200 dark:border-gray-700 flex gap-3">
        <button
          @click="closeUpgradeModal"
          class="flex-1 px-4 py-3 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors font-medium"
        >
          انصراف
        </button>
        <button
          @click="confirmUpgrade"
          :disabled="!selectedDuration || isUpgrading"
          class="flex-1 px-4 py-3 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-lg hover:from-purple-600 hover:to-purple-700 transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          <i v-if="isUpgrading" class="ti ti-loader animate-spin"></i>
          <i v-else class="ti ti-check"></i>
          {{ isUpgrading ? 'در حال پردازش...' : 'تایید ارتقا' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {ref, computed, onMounted} from 'vue'
import {useAlert} from '@/composables/useAlert'
import {useUserStore} from "@/stores/user.ts";
import jalaali from "jalaali-js";

defineOptions({
  name: 'UserManagement'
})

const {showSuccess, showDeleteConfirm} = useAlert()

interface User {
  id: number
  name: string
  username: string
  phone: string
  email?: string
  profileImage?: string
  subscriptionType: 'free' | 'premium'
  status: 'active' | 'inactive' | 'suspended'
  createdAt: string
  lastLogin: string
  profileUrl?: string
  linkCount?: number
  cardCount?:number
  subscriptionMonths?: number
  subscriptionEndDate?: string
}

// Reactive data
const searchQuery = ref('')
const filterSubscription = ref('')
const filterStatus = ref('')
const sortBy = ref('created_desc')
const currentPage = ref(1)
const itemsPerPage = 5

// Dropdown states
const showSubscriptionDropdown = ref(false)
const showStatusDropdown = ref(false)
const showSortDropdown = ref(false)

// Modal dropdown states
const showModalSubscriptionDropdown = ref(false)
const showModalStatusDropdown = ref(false)

// Edit modal state
const showEditModal = ref(false)
const editingUser = ref<User | null>(null)
const editForm = ref({
  name: '',
  username: '',
  phone: '',
  email: '',
  profileImage: '',
  subscriptionType: 'free' as 'free' | 'premium',
  status: 'active' as 'active' | 'inactive' | 'suspended'
})

// Cards modal state
const showCardsModal = ref(false)
const selectedUser = ref<User | null>(null)
const userCards = ref<Array<{
  id: number
  userName: string
  avatar:string
  url: string
  isActive: boolean
  views: number
  createdAt: string
}>>([])

// Upgrade modal state
const showUpgradeModal = ref(false)
const selectedUpgradeUser = ref<User | null>(null)
const selectedDuration = ref<string>('')
const isUpgrading = ref(false)

const upgradeDurations = [
  { value: '1', label: '۱ ماه', months: 1, icon: 'ti-calendar-event' },
  { value: '3', label: '۳ ماه', months: 3, icon: 'ti-calendar-stats' },
  { value: '6', label: '۶ ماه', months: 6, icon: 'ti-calendar-plus' },
  { value: '12', label: '۱ سال', months: 12, icon: 'ti-crown' }
]

const userStore = useUserStore()
const users = computed(() => userStore.profiles)
// Computed properties
const filteredUsers = computed(() => {
  let filtered = [...users.value]

  // Search filter
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(user =>
        (user.name?.toLowerCase() || '').includes(query) ||
        (user.username?.toLowerCase() || '').includes(query) ||
        (user.phone || '').includes(query) ||
        (user.email?.toLowerCase() || '').includes(query)
    )
  }

  // Subscription filter
  if (filterSubscription.value) {
    filtered = filtered.filter(user => user.subscriptionType === filterSubscription.value)
  }

  // Status filter
  if (filterStatus.value) {
    filtered = filtered.filter(user => user.status === filterStatus.value)
  }

  // Sort
  switch (sortBy.value) {
    case 'created_desc':
      filtered.sort((a, b) => new Date(String(b.createdAt)).getTime() - new Date(String(a.createdAt)).getTime())
      break
    case 'created_asc':
      filtered.sort((a, b) => new Date(String(a.createdAt)).getTime() - new Date(String(b.createdAt)).getTime())
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

// Subscription styling and names
const subscriptionNames: Record<User['subscriptionType'], string> = {
  premium: 'ویژه',
  free: 'رایگان'
}

// Sort names
const sortNames: Record<string, string> = {
  created_desc: 'جدیدترین',
  created_asc: 'قدیمی‌ترین',
  name_asc: 'نام (الف - ی)',
  name_desc: 'نام (ی - الف)'
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
        user.status === 'suspended' ? 'رفع تعلیق مشتری' : 'تعلیق مشتری',
        message,
        user.name
    )

    if (confirmed) {
      user.status = newStatus
      await userStore.toggleUserStatus(user.id,newStatus)
      await showSuccess(
          'تغییر وضعیت موفق',
          user.status === 'suspended' ? 'پروفایل با موفقیت معلق شد' : 'تعلیق پروفایل با موفقیت رفع شد'
      )
    }
  } catch (error) {
    console.error('Error changing status:', error)
  }
}

const editUser = (user: User) => {
  editingUser.value = user
  editForm.value = {
    name: user.name,
    username: user.username,
    phone: user.phone,
    email: user.email || '',
    profileImage: user.profileImage || '',
    subscriptionType: user.subscriptionType,
    status: user.status
  }
  showEditModal.value = true
}

const closeEditModal = () => {
  showEditModal.value = false
  editingUser.value = null
  showModalSubscriptionDropdown.value = false
  showModalStatusDropdown.value = false
  editForm.value = {
    name: '',
    username: '',
    phone: '',
    email: '',
    profileImage: '',
    subscriptionType: 'free',
    status: 'active'
  }
}

const saveUser = () => {
  if (editingUser.value) {

    // Update existing user
    Object.assign(editingUser.value, editForm.value)
    showSuccess('ویرایش موفق', 'پروفایل با موفقیت ویرایش شد')
    closeEditModal()
  }
}

const deleteUser = async (user: User) => {
  try {
    const confirmed = await showDeleteConfirm(
        'حذف مشتری',
        `آیا از حذف ${user.name} اطمینان دارید؟`,
        user.name
    )

    if (confirmed) {
      const index = users.value.findIndex(u => u.id === user.id)
      if (index > -1) {
        users.value.splice(index, 1)
        await showSuccess('حذف موفق', 'پروفایل با موفقیت حذف شد')
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

const viewUserCards = (user: User) => {
  selectedUser.value = user
  userStore.selectProfile(selectedUser.value)
  userCards.value = userStore.userCards
  showCardsModal.value = true
}

const closeCardsModal = () => {
  showCardsModal.value = false
  selectedUser.value = null
  userCards.value = []
}

const exportToExcel = () => {
  // تهیه داده‌های خروجی برای Excel
  const exportData = filteredUsers.value.map(user => ({
    'نام کاربر': user.name,
    'نام کاربری': user.username,
    'شماره موبایل': user.phone,
    'ایمیل': user.email || '-',
    'نوع اشتراک': subscriptionNames[user.subscriptionType],
    'وضعیت': statusNames[user.status],
    'تاریخ عضویت': user.createdAt,
    'آخرین ورود': user.lastLogin,
    /*'تعداد لینک‌ها': user.linkCount || 0,*/
    'تعداد پروفایل ها': user.cardCount || 0,
    'مدت اشتراک (ماه)': user.subscriptionMonths || '-',
    'پایان اشتراک': user.subscriptionEndDate || '-'
  }))

  // ایجاد محتوای HTML Table برای Excel
  let tableHTML = '<table border="1"><thead><tr>'

  // Header
  const headers = Object.keys(exportData[0])
  headers.forEach(header => {
    tableHTML += `<th style="background-color: #4CAF50; color: white; padding: 8px;">${header}</th>`
  })
  tableHTML += '</tr></thead><tbody>'

  // Rows
  exportData.forEach(row => {
    tableHTML += '<tr>'
    Object.values(row).forEach(value => {
      tableHTML += `<td style="padding: 5px; border: 1px solid #ddd;">${value}</td>`
    })
    tableHTML += '</tr>'
  })
  tableHTML += '</tbody></table>'

  // ایجاد Blob و دانلود
  const blob = new Blob([tableHTML], {type: 'application/vnd.ms-excel;charset=utf-8;'})
  const link = document.createElement('a')
  const url = URL.createObjectURL(blob)

  link.setAttribute('href', url)
  link.setAttribute('download', `profiles-${new Date().toISOString().split('T')[0]}.xls`)
  link.style.visibility = 'hidden'

  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}
const toJalaali = (gregorianDate: string | Date): string => {
  const dateStr = typeof gregorianDate === 'string'
      ? gregorianDate
      : gregorianDate.toISOString().split('T')[0] // "YYYY-MM-DD"

  const [gy, gm, gd] = dateStr.split('-').map(Number)
  const { jy, jm, jd } = jalaali.toJalaali(gy, gm, gd)
  return `${jy}/${String(jm).padStart(2, '0')}/${String(jd).padStart(2, '0')}`
}
const formatDate = (date: string | null | undefined): string => {
  if (!date || typeof date !== 'string' || date.trim() === '') return ''

  const normalized = normalizePersianDigits(date)

  if (/^(13|14)\d{2}\/\d{1,2}\/\d{1,2}$/.test(normalized)) {
    return date
  }

  return toJalaali(date)
}
const normalizePersianDigits = (str: string): string => {
  return str.replace(/[۰-۹]/g, d => String('۰۱۲۳۴۵۶۷۸۹'.indexOf(d)))
}

// Upgrade functions
const openUpgradeModal = (user: User) => {
  selectedUpgradeUser.value = user
  selectedDuration.value = ''
  showUpgradeModal.value = true
}

const closeUpgradeModal = () => {
  showUpgradeModal.value = false
  selectedUpgradeUser.value = null
  selectedDuration.value = ''
  isUpgrading.value = false
}

const confirmUpgrade = async () => {
  if (!selectedUpgradeUser.value || !selectedDuration.value) return

  isUpgrading.value = true

  try {
    const token = sessionStorage.getItem('adminToken') || ''
    const baseUrl = import.meta.env.VITE_API_BASE_URL || 'https://api.linku.im/api'
    const response = await fetch(`${baseUrl}/user/admin/upgrade-subscription`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        userId: selectedUpgradeUser.value.id,
        months: parseInt(selectedDuration.value)
      })
    })

    if (!response.ok) throw new Error('Upgrade failed')

    await showSuccess('ارتقا موفق', `اشتراک ${selectedUpgradeUser.value.name} برای ${selectedDuration.value} ماه فعال شد`)

    // Refresh user list
    await userStore.fetchProfiles()

    closeUpgradeModal()
  } catch (error) {
    console.error('Upgrade error:', error)
    await showSuccess('خطا', 'ارتقا ناموفق بود. لطفا دوباره تلاش کنید')
  } finally {
    isUpgrading.value = false
  }
}

onMounted(async () => {
  await userStore.fetchProfiles()
})

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
