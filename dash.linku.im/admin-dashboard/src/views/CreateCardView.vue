<template>
  <div class="min-h-screen bg-gray-50 dark:bg-slate-900 transition-colors duration-300 p-4 sm:p-6">
    <div class="space-y-6">
      <!-- Header -->
      <div class="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl p-4 sm:p-5 transition-colors duration-300">
        <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <div>
            <h1 class="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-1">ایجاد کارت ویزیت</h1>
            <p class="text-sm text-gray-600 dark:text-gray-400">کارت‌های ویزیت جدید ایجاد کنید</p>
          </div>
          <router-link
              :to="{ name: 'cards' }"
              class="bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-slate-600 px-4 py-2 rounded-lg transition-all duration-300 font-medium flex items-center gap-2 text-sm"
          >
            <i class="ti ti-arrow-left"></i>
            بازگشت
          </router-link>
        </div>
      </div>

      <!-- Tabs -->
      <div class="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl overflow-hidden">
        <div class="flex border-b border-gray-200 dark:border-slate-700">
          <button
            @click="activeTab = 'auto'"
            :class="[
              'flex-1 py-4 px-6 text-sm font-semibold transition-all duration-200',
              activeTab === 'auto'
                ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 border-b-2 border-blue-600'
                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-slate-700'
            ]"
          >
            <div class="flex items-center justify-center gap-2">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
              </svg>
              ایجاد خودکار
            </div>
          </button>
          <button
            @click="activeTab = 'manual'"
            :class="[
              'flex-1 py-4 px-6 text-sm font-semibold transition-all duration-200',
              activeTab === 'manual'
                ? 'bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400 border-b-2 border-orange-600'
                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-slate-700'
            ]"
          >
            <div class="flex items-center justify-center gap-2">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path>
              </svg>
              ایجاد دستی
            </div>
          </button>
        </div>

        <!-- Auto Tab -->
        <div v-if="activeTab === 'auto'" class="p-6">
          <div class="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4 mb-6">
            <p class="text-blue-700 dark:text-blue-400 text-sm flex items-start gap-2">
              <svg class="w-5 h-5 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              <span>لایسنس به صورت خودکار تولید می‌شود</span>
            </p>
          </div>
          <form @submit.prevent="createAutoCard" class="space-y-5">
            <div>
              <label class="block text-sm font-semibold text-gray-900 dark:text-white mb-2">نام کارت <span class="text-red-500">*</span></label>
              <input v-model="autoForm.cardName" type="text" required placeholder="مثال: کارت من" class="w-full px-4 py-3 bg-white dark:bg-slate-700 border border-gray-200 dark:border-slate-600 text-gray-900 dark:text-white rounded-xl focus:ring-2 focus:ring-blue-500 transition-colors" />
            </div>
            <div>
              <label class="block text-sm font-semibold text-gray-900 dark:text-white mb-3">محصول <span class="text-red-500">*</span></label>
              <div class="grid grid-cols-3 gap-3">
                <div v-for="product in products" :key="product.id" @click="autoForm.productUnitId = product.id" :class="['relative cursor-pointer rounded-lg border-2 p-4 transition-all', autoForm.productUnitId === product.id ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 shadow-md' : 'border-gray-200 dark:border-slate-600']">
                  <div class="text-center">
                    <img :src="product.image" :alt="product.name" class="w-12 h-12 mx-auto mb-2 object-contain" />
                    <h3 class="text-sm font-medium text-gray-900 dark:text-white">{{ product.name }}</h3>
                  </div>
                  <div v-if="autoForm.productUnitId === product.id" class="absolute -top-1 -left-1 w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center"><i class="ti ti-check text-white text-xs"></i></div>
                </div>
              </div>
            </div>
            <div v-if="autoError" class="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4">
              <p class="text-red-700 dark:text-red-400 text-sm">{{ autoError }}</p>
            </div>
            <div class="flex gap-3 pt-5 border-t border-gray-200 dark:border-slate-700">
              <button type="submit" :disabled="isCreatingAuto" class="flex-1 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 disabled:from-gray-400 disabled:to-gray-500 text-white py-3 px-6 rounded-lg font-semibold flex items-center justify-center gap-2">
                <i v-if="!isCreatingAuto" class="ti ti-plus"></i>
                <i v-else class="ti ti-loader animate-spin"></i>
                {{ isCreatingAuto ? 'در حال ایجاد...' : 'ایجاد کارت' }}
              </button>
              <router-link :to="{ name: 'cards' }" class="px-6 py-3 bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-300 rounded-lg font-medium flex items-center justify-center gap-2"><i class="ti ti-x"></i>انصراف</router-link>
            </div>
          </form>
        </div>

        <!-- Manual Tab -->
        <div v-if="activeTab === 'manual'" class="p-6">
          <div class="bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-xl p-4 mb-6">
            <p class="text-orange-700 dark:text-orange-400 text-sm flex items-start gap-2">
              <svg class="w-5 h-5 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              <span>برای کارت‌های چاپ شده - لایسنس روی کارت فیزیکی نوشته شده</span>
            </p>
          </div>
          <form @submit.prevent="createManualCard" class="space-y-5">
            <div>
              <label class="block text-sm font-semibold text-gray-900 dark:text-white mb-2">شناسه لایسنس (Slug) <span class="text-red-500">*</span></label>
              <input 
                v-model="manualForm.license" 
                type="text" 
                required 
                placeholder="مثال: byli6oxl" 
                class="w-full px-4 py-3 bg-white dark:bg-slate-700 border border-gray-200 dark:border-slate-600 text-gray-900 dark:text-white rounded-xl focus:ring-2 focus:ring-orange-500 transition-colors font-mono" 
              />
              <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">فقط حروف انگلیسی، اعداد و - یا _ مجاز است (نام از محصول انتخابی گرفته می‌شود)</p>
            </div>
            <div>
              <label class="block text-sm font-semibold text-gray-900 dark:text-white mb-3">محصول <span class="text-red-500">*</span></label>
              <div class="grid grid-cols-3 gap-3">
                <div v-for="product in products" :key="product.id" @click="manualForm.productUnitId = product.id" :class="['relative cursor-pointer rounded-lg border-2 p-4 transition-all', manualForm.productUnitId === product.id ? 'border-orange-500 bg-orange-50 dark:bg-orange-900/20 shadow-md' : 'border-gray-200 dark:border-slate-600']">
                  <div class="text-center">
                    <img :src="product.image" :alt="product.name" class="w-12 h-12 mx-auto mb-2 object-contain" />
                    <h3 class="text-sm font-medium text-gray-900 dark:text-white">{{ product.name }}</h3>
                  </div>
                  <div v-if="manualForm.productUnitId === product.id" class="absolute -top-1 -left-1 w-5 h-5 bg-orange-500 rounded-full flex items-center justify-center"><i class="ti ti-check text-white text-xs"></i></div>
                </div>
              </div>
            </div>
            <div v-if="manualError" class="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4">
              <p class="text-red-700 dark:text-red-400 text-sm">{{ manualError }}</p>
            </div>
            <div class="flex gap-3 pt-5 border-t border-gray-200 dark:border-slate-700">
              <button type="submit" :disabled="isCreatingManual" class="flex-1 bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 disabled:from-gray-400 disabled:to-gray-500 text-white py-3 px-6 rounded-lg font-semibold flex items-center justify-center gap-2">
                <i v-if="!isCreatingManual" class="ti ti-plus"></i>
                <i v-else class="ti ti-loader animate-spin"></i>
                {{ isCreatingManual ? 'در حال ایجاد...' : 'ایجاد لایسنس' }}
              </button>
              <router-link :to="{ name: 'cards' }" class="px-6 py-3 bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-300 rounded-lg font-medium flex items-center justify-center gap-2"><i class="ti ti-x"></i>انصراف</router-link>
            </div>
          </form>
        </div>

        <!-- Old Bulk Tab - Hidden -->
        <div v-if="activeTab === 'bulk'" style="display:none">
          <form @submit.prevent="createBulkCards" class="space-y-5">
              <!-- Card Type Selection -->
              <div>
                <label class="block text-sm font-semibold text-gray-900 dark:text-white mb-3">نوع کارت ویزیت فیزیکی</label>
                <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
                  <div
                      v-for="cardType in products"
                      :key="cardType.id"
                      @click="bulkForm.cardType = cardType.id"
                      :class="[
                      'relative cursor-pointer rounded-lg border-2 p-3 transition-all duration-300',
                      bulkForm.cardType === cardType.id
                        ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20 shadow-md'
                        : 'border-gray-200 dark:border-slate-600 hover:border-purple-300 dark:hover:border-purple-600'
                    ]"
                  >
                    <div class="text-center">
                      <img
                          :src="cardType.image"
                          :alt="cardType.name"
                          class="w-12 h-12 mx-auto mb-2 object-contain"
                      >
                      <h3 class="text-xs font-medium text-gray-900 dark:text-white mb-1">{{ cardType.name }}</h3>
                      <p class="text-xs text-gray-500 dark:text-gray-400">موجودی: {{ cardType.stock }}</p>
                    </div>
                    <div v-if="bulkForm.cardType === cardType.id"
                         class="absolute -top-1 -left-1 w-5 h-5 bg-purple-500 rounded-full flex items-center justify-center">
                      <i class="ti ti-check text-white text-xs"></i>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Count and Status -->
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <!-- Count Selection -->
                <div>
                  <label class="block text-sm font-semibold text-gray-900 dark:text-white mb-2">تعداد کارت</label>
                  <input
                      v-model.number="bulkForm.count"
                      type="number"
                      min="1"
                      max="100"
                      required
                      class="w-full px-4 py-3 bg-gray-50 dark:bg-slate-700 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-300 border border-gray-200 dark:border-slate-600"
                      placeholder="مثال: 10"
                  >
                  <p class="text-xs text-gray-500 dark:text-gray-400 mt-1.5">حداکثر 100 کارت</p>
                </div>

                <!-- Status Selection -->
                <div>
                  <label class="block text-sm font-semibold text-gray-900 dark:text-white mb-2">وضعیت</label>
                  <div class="grid grid-cols-2 gap-2">
                    <button
                        type="button"
                        @click="bulkForm.status = 'active'"
                        :class="[
                        'flex items-center justify-center gap-2 p-3 border-2 rounded-lg transition-all duration-300',
                        bulkForm.status === 'active'
                          ? 'border-green-500 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300'
                          : 'border-gray-200 dark:border-slate-600 text-gray-700 dark:text-gray-300 hover:border-green-300'
                      ]"
                    >
                      <div class="w-4 h-4 rounded-full border-2 flex items-center justify-center"
                           :class="bulkForm.status === 'active' ? 'border-green-500 bg-green-500' : 'border-gray-300'">
                        <div v-if="bulkForm.status === 'active'" class="w-1.5 h-1.5 bg-white rounded-full"></div>
                      </div>
                      <span class="text-sm font-medium">فعال</span>
                    </button>

                    <button
                        type="button"
                        @click="bulkForm.status = 'inactive'"
                        :class="[
                        'flex items-center justify-center gap-2 p-3 border-2 rounded-lg transition-all duration-300',
                        bulkForm.status === 'inactive'
                          ? 'border-red-500 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300'
                          : 'border-gray-200 dark:border-slate-600 text-gray-700 dark:text-gray-300 hover:border-red-300'
                      ]"
                    >
                      <div class="w-4 h-4 rounded-full border-2 flex items-center justify-center"
                           :class="bulkForm.status === 'inactive' ? 'border-red-500 bg-red-500' : 'border-gray-300'">
                        <div v-if="bulkForm.status === 'inactive'" class="w-1.5 h-1.5 bg-white rounded-full"></div>
                      </div>
                      <span class="text-sm font-medium">غیرفعال</span>
                    </button>
                  </div>
                </div>
              </div>

              <!-- Right Column - Preview -->
              <!--              <div class="lg:pl-8">
                              <div class="bg-gray-50 dark:bg-slate-700 rounded-xl p-6 border border-gray-200 dark:border-slate-600">
                                <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">پیش‌نمایش</h3>
                                <div class="space-y-3">
                                  <div class="bg-white dark:bg-slate-800 rounded-lg p-4 border border-gray-200 dark:border-slate-600">
                                    <p class="text-sm text-gray-600 dark:text-gray-400 mb-2">تعداد کارت ویزیت:</p>
                                    <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ bulkForm.count }}</p>
                                  </div>
                                  <div class="bg-white dark:bg-slate-800 rounded-lg p-4 border border-gray-200 dark:border-slate-600">
                                    <p class="text-sm text-gray-600 dark:text-gray-400 mb-2">نمونه نام‌ها:</p>
                                    <div class="space-y-1">
                                      <p class="text-sm text-gray-900 dark:text-white">{{ bulkForm.namePrefix }}1</p>
                                      <p class="text-sm text-gray-900 dark:text-white">{{ bulkForm.namePrefix }}2</p>
                                      <p class="text-sm text-gray-900 dark:text-white">{{ bulkForm.namePrefix }}3</p>
                                      <p class="text-xs text-gray-500 dark:text-gray-400">...</p>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>-->

            <!-- Form Actions -->
            <div class="flex flex-col sm:flex-row gap-3 pt-5 border-t border-gray-200 dark:border-slate-700 mt-6">
              <button
                  type="submit"
                  :disabled="isBulkSaving"
                  class="flex-1 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white py-3 px-6 rounded-lg transition-all duration-300 shadow-md hover:shadow-lg font-semibold flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                <template v-if="!isBulkSaving">
                  <i class="ti ti-plus"></i>
                  ایجاد {{ bulkForm.count }} کارت
                </template>

                <template v-else>
                  <i class="ti ti-loader animate-spin"></i>
                  در حال ایجاد...
                </template>
              </button>
              <router-link
                  :to="{ name: 'cards' }"
                  class="sm:w-auto px-6 py-3 bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-slate-600 rounded-lg transition-all duration-300 font-medium text-center flex items-center justify-center gap-2"
              >
                <i class="ti ti-x"></i>
                انصراف
              </router-link>
            </div>
          </form>
        </div>
        <!-- Single Card Creation -->
<!--        <div v-if="activeTab === 'single'">
          <div class="flex items-center gap-3 mb-6">
            <div class="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center">
              <i class="ti ti-credit-card text-xl text-blue-600 dark:text-blue-400"></i>
            </div>
            <h2 class="text-xl font-bold text-gray-900 dark:text-white">ایجاد کارت ویزیت تکی</h2>
          </div>

          <form @submit.prevent="saveCard">
            <div class="grid grid-cols-1 xl:grid-cols-2 gap-8">

              &lt;!&ndash; Left Column - Form Fields &ndash;&gt;
              <div class="space-y-6">
                &lt;!&ndash; Owner Name &ndash;&gt;
                <div>
                  <label class="block text-sm font-semibold text-gray-900 dark:text-white mb-3">نام صاحب کارت
                    ویزیت</label>
                  <input
                      v-model="cardForm.ownerName"
                      type="text"
                      placeholder="نام کامل صاحب کارت ویزیت"
                      class="w-full px-4 py-4 bg-gray-50 dark:bg-slate-700 text-gray-900 dark:text-white rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 placeholder-gray-500 dark:placeholder-gray-400 border border-gray-200 dark:border-slate-600"
                  >
                </div>

                &lt;!&ndash; Profile Type Selection &ndash;&gt;
                <div>
                  <label class="block text-sm font-semibold text-gray-900 dark:text-white mb-3">نوع کارت ویزیت
                    فیزیکی</label>
                  <div class="grid grid-cols-2 lg:grid-cols-3 gap-3">
                    <div
                        v-for="cardType in products"
                        :key="cardType.id"
                        @click="cardForm.cardType = cardType.id"
                        :class="[
                        'relative cursor-pointer rounded-xl border-2 p-4 transition-all duration-300 bg-white',
                        cardForm.cardType === cardType.id
                          ? 'border-blue-500 shadow-lg scale-105'
                          : 'border-gray-200 dark:border-slate-600 hover:border-blue-300 dark:hover:border-blue-600 hover:shadow-md'
                      ]"
                    >
                      <div class="text-center">
                        <img
                            :src="cardType.image"
                            :alt="cardType.name"
                            class="w-12 h-12 mx-auto mb-2 object-contain"
                        >
                        <h3 class="text-sm font-medium text-gray-900 dark:text-white mb-1">{{ cardType.name }}</h3>
                        <p class="text-xs text-gray-500 dark:text-gray-400">موجودی: {{ cardType.stock }}</p>
                      </div>
                      <div v-if="cardForm.cardType === cardType.id"
                           class="absolute top-2 left-2 w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                        <i class="ti ti-check text-white text-xs"></i>
                      </div>
                    </div>
                  </div>
                </div>

                &lt;!&ndash; QR Link &ndash;&gt;
                <div>
                  <label class="block text-sm font-semibold text-gray-900 dark:text-white mb-3">لینک کارت ویزیت</label>
                  <div class="flex gap-3">
                    <input
                        v-model="cardForm.qrLink"
                        type="url"
                        readonly
                        class="flex-1 px-4 py-4 bg-gray-100 dark:bg-slate-600 text-gray-700 dark:text-gray-200 rounded-xl font-mono text-sm border border-gray-200 dark:border-slate-500 cursor-not-allowed"
                    >
                    <button
                        type="button"
                        @click="generateRandomLink"
                        class="bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white px-4 py-4 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl"
                        title="تولید لینک جدید"
                    >
                      <i class="ti ti-refresh text-lg"></i>
                    </button>
                  </div>
                  <p class="text-xs text-gray-500 dark:text-gray-400 mt-2 flex items-center gap-1">
                    <i class="ti ti-info-circle text-blue-500"></i>
                    لینک منحصر به فرد برای کارت ویزیت شما
                  </p>
                </div>

                &lt;!&ndash; Customer Mobile &ndash;&gt;
                <div>
                  <label class="block text-sm font-semibold text-gray-900 dark:text-white mb-3">شماره موبایل
                    مشتری</label>
                  <input
                      v-model="cardForm.mobile"
                      type="tel"
                      inputmode="tel"
                      pattern="09[0-9]{9}"
                      maxlength="11"
                      placeholder="مثال: 09123456789"
                      class="w-full px-4 py-4 bg-gray-50 dark:bg-slate-700 text-gray-900 dark:text-white rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 placeholder-gray-500 dark:placeholder-gray-400 border border-gray-200 dark:border-slate-600 font-mono ltr"
                  >
                  <p class="text-xs text-gray-500 dark:text-gray-400 mt-2 flex items-center gap-1">
                    <i class="ti ti-phone text-green-500"></i>
                    شماره موبایل برای ارتباط و اطلاع‌رسانی
                  </p>
                </div>

                &lt;!&ndash; Status Selection &ndash;&gt;
                <div>
                  <label class="block text-sm font-semibold text-gray-900 dark:text-white mb-3">وضعیت کارت ویزیت</label>
                  <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <button
                        type="button"
                        @click="cardForm.status = 'active'"
                        :class="[
                        'relative flex items-center p-4 border-2 rounded-xl cursor-pointer transition-all duration-300 hover:shadow-md',
                        cardForm.status === 'active'
                          ? 'border-green-500 bg-green-50 dark:bg-green-900/30 shadow-lg'
                          : 'border-gray-200 dark:border-slate-600 bg-gray-50 dark:bg-slate-700 hover:border-green-300 dark:hover:border-green-600'
                      ]"
                    >
                      <div class="flex items-center gap-3">
                        <div class="w-5 h-5 rounded-full border-2 flex items-center justify-center"
                             :class="cardForm.status === 'active' ? 'border-green-500 bg-green-500' : 'border-gray-300 dark:border-gray-600'">
                          <div v-if="cardForm.status === 'active'" class="w-2 h-2 bg-white rounded-full"></div>
                        </div>
                        <span class="font-medium"
                              :class="cardForm.status === 'active' ? 'text-green-700 dark:text-green-300' : 'text-gray-700 dark:text-gray-300'">فعال</span>
                      </div>
                      <div v-if="cardForm.status === 'active'"
                           class="absolute top-2 left-2 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                        <i class="ti ti-check text-white text-xs"></i>
                      </div>
                    </button>

                    <button
                        type="button"
                        @click="cardForm.status = 'inactive'"
                        :class="[
                        'relative flex items-center p-4 border-2 rounded-xl cursor-pointer transition-all duration-300 hover:shadow-md',
                        cardForm.status === 'inactive'
                          ? 'border-red-500 bg-red-50 dark:bg-red-900/30 shadow-lg'
                          : 'border-gray-200 dark:border-slate-600 bg-gray-50 dark:bg-slate-700 hover:border-red-300 dark:hover:border-red-600'
                      ]"
                    >
                      <div class="flex items-center gap-3">
                        <div class="w-5 h-5 rounded-full border-2 flex items-center justify-center"
                             :class="cardForm.status === 'inactive' ? 'border-red-500 bg-red-500' : 'border-gray-300 dark:border-gray-600'">
                          <div v-if="cardForm.status === 'inactive'" class="w-2 h-2 bg-white rounded-full"></div>
                        </div>
                        <span class="font-medium"
                              :class="cardForm.status === 'inactive' ? 'text-red-700 dark:text-red-300' : 'text-gray-700 dark:text-gray-300'">غیرفعال</span>
                      </div>
                      <div v-if="cardForm.status === 'inactive'"
                           class="absolute top-2 left-2 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
                        <i class="ti ti-check text-white text-xs"></i>
                      </div>
                    </button>
                  </div>
                </div>
              </div>

              &lt;!&ndash; Right Column - QR Code Preview &ndash;&gt;
              <div class="lg:pl-8">
                <div
                    class="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-slate-800 dark:to-slate-700 rounded-2xl p-6 border border-blue-200 dark:border-slate-600">
                  &lt;!&ndash; Header &ndash;&gt;
                  <div class="flex items-center justify-between mb-6">
                    <div class="flex items-center gap-3">
                      <div class="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center">
                        <i class="ti ti-qrcode text-xl text-white"></i>
                      </div>
                      <div>
                        <h3 class="text-lg font-bold text-gray-900 dark:text-white">پیش‌نمایش QR کد</h3>
                        <p class="text-sm text-gray-600 dark:text-gray-400">کد QR کارت ویزیت شما</p>
                      </div>
                    </div>
                  </div>

                  &lt;!&ndash; QR Code Display &ndash;&gt;
                  <div class="relative">
                    <div
                        class="bg-white rounded-2xl p-8 border-4 border-white mx-auto inline-block transition-all duration-300"
                        :class="{ 'scale-105': isGeneratingQR }">
                      <div v-if="qrCodeDataURL" class="relative">
                        <img
                            :src="qrCodeDataURL"
                            alt="QR Code"
                            class="w-44 h-44 mx-auto rounded-lg transition-all duration-300"
                            :class="{ 'opacity-50': isGeneratingQR }"
                        >
                        &lt;!&ndash; QR Code Frame &ndash;&gt;
                        <div
                            class="absolute inset-0 border-2 border-gray-200 rounded-lg pointer-events-none transition-colors duration-300"
                            :class="{ 'border-blue-500': isGeneratingQR }"></div>
                        &lt;!&ndash; Corner Decorations &ndash;&gt;
                        <div
                            class="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 border-blue-500 rounded-tl transition-all duration-300"
                            :class="{ 'animate-pulse': isGeneratingQR }"></div>
                        <div
                            class="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 border-blue-500 rounded-tr transition-all duration-300"
                            :class="{ 'animate-pulse': isGeneratingQR }"></div>
                        <div
                            class="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 border-blue-500 rounded-bl transition-all duration-300"
                            :class="{ 'animate-pulse': isGeneratingQR }"></div>
                        <div
                            class="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 border-blue-500 rounded-br transition-all duration-300"
                            :class="{ 'animate-pulse': isGeneratingQR }"></div>
                      </div>

                      <div v-else
                           class="w-44 h-44 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-slate-600 dark:to-slate-700 rounded-lg flex flex-col items-center justify-center border-2 border-dashed border-gray-300 dark:border-slate-500">
                        <i class="ti ti-qrcode text-5xl text-gray-400 dark:text-gray-500 mb-2"></i>
                        <p class="text-sm text-gray-500 dark:text-gray-400 font-medium">در انتظار تولید</p>
                      </div>
                    </div>

                    &lt;!&ndash; Loading Spinner &ndash;&gt;
                    <div v-if="isGeneratingQR"
                         class="absolute inset-0 flex items-center justify-center bg-white bg-opacity-90 dark:bg-slate-900 dark:bg-opacity-90 rounded-2xl backdrop-blur-sm">
                      <div class="flex flex-col items-center gap-3">
                        <div class="relative">
                          <div class="w-12 h-12 border-4 border-blue-200 rounded-full animate-spin"></div>
                          <div
                              class="absolute top-0 left-0 w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                        </div>
                        <span class="text-sm text-blue-600 dark:text-blue-400 font-medium">در حال تولید کد QR...</span>
                      </div>
                    </div>
                  </div>

                  &lt;!&ndash; QR Info &ndash;&gt;
                  <div class="mt-6 space-y-3">
                    <div class="bg-white dark:bg-slate-800 rounded-xl p-4 border border-gray-200 dark:border-slate-600">
                      <div class="flex items-center justify-between">
                        <span class="text-sm font-medium text-gray-700 dark:text-gray-300">لینک کارت ویزیت:</span>
                        <button
                            v-if="cardForm.qrLink"
                            @click="copyToClipboard(cardForm.qrLink)"
                            class="text-blue-500 hover:text-blue-600 transition-colors duration-200"
                            title="کپی لینک"
                        >
                          <i class="ti ti-copy text-sm"></i>
                        </button>
                      </div>
                      <p class="text-xs text-gray-500 dark:text-gray-400 mt-1 font-mono break-all">
                        {{ cardForm.qrLink || 'لینک تولید نشده' }}
                      </p>
                    </div>

                    <div class="bg-white dark:bg-slate-800 rounded-xl p-4 border border-gray-200 dark:border-slate-600">
                      <div class="flex items-center justify-between">
                        <span class="text-sm font-medium text-gray-700 dark:text-gray-300">صاحب کارت ویزیت:</span>
                        <div class="flex items-center gap-1">
                          <div class="w-2 h-2 rounded-full"
                               :class="cardForm.ownerName ? 'bg-green-500' : 'bg-gray-400'"></div>
                        </div>
                      </div>
                      <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        {{ cardForm.ownerName || 'نام وارد نشده' }}
                      </p>
                    </div>
                  </div>

                  &lt;!&ndash; Action Buttons &ndash;&gt;
                  <div class="mt-6 space-y-3">
                    <button
                        type="button"
                        @click="generateQRCode"
                        :disabled="!cardForm.qrLink"
                        class="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 disabled:from-gray-400 disabled:to-gray-500 text-white px-4 py-3 rounded-xl transition-all duration-300 font-medium flex items-center justify-center gap-2 disabled:cursor-not-allowed"
                    >
                      <i class="ti ti-refresh text-lg"></i>
                      تولید مجدد QR کد
                    </button>

                    <button
                        type="button"
                        @click="downloadQRCode"
                        :disabled="!qrCodeDataURL"
                        class="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 disabled:from-gray-400 disabled:to-gray-500 text-white px-4 py-3 rounded-xl transition-all duration-300 font-medium flex items-center justify-center gap-2 disabled:cursor-not-allowed"
                    >
                      <i class="ti ti-download text-lg"></i>
                      دانلود QR کد
                    </button>
                  </div>
                </div>
              </div>
            </div>

            &lt;!&ndash; Action Buttons &ndash;&gt;
            <div class="flex flex-col sm:flex-row gap-3 pt-6 border-t border-gray-200 dark:border-slate-700 mt-8">
              <button
                  type="submit"
                  :disabled="isSaving"
                  class="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700
                  text-white px-6 py-4 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl
                  font-semibold flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                <template v-if="!isSaving">
                  <i class="ti ti-plus text-lg"></i>
                  ایجاد کارت ویزیت
                </template>
                <template v-else>
                  <i class="ti ti-loader animate-spin text-lg"></i>
                  در حال افزودن...
                </template>
              </button>
              <button
                  type="button"
                  @click="resetForm"
                  class="px-6 py-4 bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-200 dark:hover:bg-slate-600 transition-all duration-300 font-medium flex items-center justify-center gap-2"
              >
                <i class="ti ti-refresh text-lg"></i>
                پاک کردن فرم
              </button>
              <router-link
                  :to="{ name: 'cards' }"
                  class="px-6 py-4 bg-gray-200 dark:bg-slate-600 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-slate-500 rounded-xl transition-all duration-300 font-medium text-center flex items-center justify-center gap-2"
              >
                <i class="ti ti-arrow-left text-lg"></i>
                انصراف
              </router-link>
            </div>
          </form>
        </div>-->

      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {ref, reactive, watch, onMounted, computed, getCurrentInstance} from 'vue'
import {useRouter} from 'vue-router'
import QRCode from 'qrcode'
import {useAlert} from '@/composables/useAlert'
import {useProductStore} from "@/stores/product.ts";
import {useCardsStore} from "@/stores/cards.ts";

defineOptions({
  name: 'CreateCardView'
})
const isSaving=ref(false)
const isBulkSaving = ref(false)
const router = useRouter()
const {showSuccess, showError} = useAlert()

const activeTab = ref<'auto' | 'manual' | 'bulk'>('auto')
const productStore = useProductStore();
const cardStore = useCardsStore()
const products = computed(()=>productStore.products);

// Auto Card Form
const autoForm = ref({
  cardName: '',
  productUnitId: ''
})
const isCreatingAuto = ref(false)
const autoError = ref('')

// Manual Card Form
const manualForm = ref({
  license: '',
  productUnitId: ''
})
const isCreatingManual = ref(false)
const manualError = ref('')

// Old Form data
const cardForm = reactive({
  ownerName: '',
  qrLink: '',
  cardType: 'business-card',
  status: 'active' as 'active' | 'inactive',
  mobile: '',
  licenseId: ''
})

// Bulk creation form
const bulkForm = reactive({
  cardType: 'business-card',
  count: 1,
  namePrefix: 'کارت',
  status: 'active' as 'active' | 'inactive'
})

const qrCodeDataURL = ref<string>('')
const isGeneratingQR = ref<boolean>(false)
const isGeneratingLicense = ref<boolean>(true)
const {appContext} = getCurrentInstance()!
const axios = appContext.config.globalProperties.$axios
// Generate random link with new format
const generateRandomLink = async () => {

  const selectedCardType = products.value.find((p: any) => String(p.id) === String(cardForm.cardType))

  if (isGeneratingLicense.value) {

    if (selectedCardType) {

      const res = await axios.post(`user/admin/generateLicense/${selectedCardType?.id}`)

      const licenseId = res.data.license.license_code

      cardForm.licenseId = licenseId

      cardForm.qrLink = `https://linku.im/profile/${licenseId}/${selectedCardType?.identifier}`

      isGeneratingLicense.value = false
    }
  }

}

// Generate QR Code
const generateQRCode = async () => {
  if (!cardForm.qrLink) return

  isGeneratingQR.value = true

  try {
    qrCodeDataURL.value = await QRCode.toDataURL(cardForm.qrLink, {
      width: 200,
      margin: 2,
      color: {
        dark: '#000000',
        light: '#FFFFFF'
      }
    })
  } catch (error) {
    console.error('Error generating QR code:', error)
  } finally {
    isGeneratingQR.value = false
  }
}

// Copy to clipboard function
const copyToClipboard = async (text: string) => {
  try {
    await navigator.clipboard.writeText(text)
    await showSuccess('کپی شد!', 'لینک کارت ویزیت با موفقیت کپی شد')
  } catch (error) {
    console.error('Failed to copy text:', error)
    await showError('خطا در کپی', 'متاسفانه امکان کپی کردن لینک وجود ندارد')
  }
}

// Download QR Code function
const downloadQRCode = async () => {
  if (!qrCodeDataURL.value) return

  try {
    const link = document.createElement('a')
    link.download = `qr-code-${cardForm.ownerName || 'profile'}.png`
    link.href = qrCodeDataURL.value
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    await showSuccess('دانلود موفق!', 'کد QR با موفقیت دانلود شد')
  } catch (error) {
    console.error('Error downloading QR code:', error)
    await showError('خطا در دانلود', 'متاسفانه امکان دانلود کد QR وجود ندارد')
  }
}
// Save single card
const saveCard = async () => {
  if (!cardForm.ownerName || cardForm.ownerName.trim().length < 3) {
    await showError('خطا در ورود نام صاحب کارت',"نام صاحب کارت را صحیح وارد کنید");
    return;
  }

  const mobileRegex = /^09[0-9]{9}$/;
  if (!mobileRegex.test(cardForm.mobile)) {
    await showError('خطا در ورود شماره موبایل',"شماره موبایل معتبر نیست. مثال: 09123456789");
    return;
  }

  try {
    isSaving.value = true;
    // Here you would typically send the data to your API
    await cardStore.createCard(cardForm)
    // Navigate back to cards page
    await router.push('/cards')
  } catch (error) {
    console.error('Error creating card:', error)
  }finally {
    isSaving.value = false;
  }
}

// Create bulk cards
const createBulkCards = async () => {
  try {
    isBulkSaving.value = true
    // Here you would typically send the data to your API
    const selectedCardType = products.value.find((p: any) => String(p.id) === String(bulkForm.cardType))

      if (selectedCardType) {

        const res = await axios.post(`user/admin/generateLicense/${selectedCardType?.id}`,bulkForm)
        await router.push('/cards')
      }else{
        await showError('خطا در ایجاد کارت','لطفا یک محصول انتخاب کنید')
      }
    // Navigate back to cards page
  } catch (error) {

    console.error('Error creating bulk cards:', error)
  }finally{
    isBulkSaving.value = false
  }
}

// Create Auto Card
const createAutoCard = async () => {
  if (!autoForm.value.cardName.trim()) {
    autoError.value = 'لطفا نام کارت را وارد کنید'
    return
  }
  if (!autoForm.value.productUnitId) {
    autoError.value = 'لطفا محصول را انتخاب کنید'
    return
  }
  isCreatingAuto.value = true
  autoError.value = ''
  try {
    const response = await cardStore.createCard({
      card_name: autoForm.value.cardName.trim(),
      product_unit_id: autoForm.value.productUnitId
    })
    if (response.success || response) {
      await showSuccess('موفق!', 'کارت با موفقیت ایجاد شد')
      await router.push({ name: 'cards' })
    } else {
      autoError.value = response.message || 'خطا در ایجاد کارت'
    }
  } catch (error: any) {
    autoError.value = error.response?.data?.message || 'خطا در ایجاد کارت'
  } finally {
    isCreatingAuto.value = false
  }
}

// Create Manual Card
const createManualCard = async () => {
  if (!manualForm.value.license.trim()) {
    manualError.value = 'لطفا شناسه لایسنس را وارد کنید'
    return
  }
  // بررسی فرمت لاتین
  const slugPattern = /^[a-zA-Z0-9-_]+$/
  if (!slugPattern.test(manualForm.value.license.trim())) {
    manualError.value = 'شناسه فقط باید شامل حروف انگلیسی، اعداد و - یا _ باشد'
    return
  }
  if (!manualForm.value.productUnitId) {
    manualError.value = 'لطفا محصول را انتخاب کنید'
    return
  }
  isCreatingManual.value = true
  manualError.value = ''
  try {
    const response = await cardStore.createManualCard({
      slug: manualForm.value.license.trim(),
      product_unit_id: manualForm.value.productUnitId
    })
    if (response.success) {
      await showSuccess('موفق!', 'لایسنس با موفقیت ایجاد شد')
      await router.push({ name: 'cards' })
    } else {
      manualError.value = response.message || 'خطا در ایجاد لایسنس'
    }
  } catch (error: any) {
    manualError.value = error.response?.data?.message || 'خطا در ایجاد لایسنس'
  } finally {
    isCreatingManual.value = false
  }
}

// Reset form function
const resetForm = () => {
  cardForm.ownerName = ''
  cardForm.qrLink = ''
  cardForm.cardType = 'business-card'
  cardForm.status = 'active'
  cardForm.mobile = ''
  generateRandomLink()
}

// Watch for qrLink changes to auto-generate QR code
watch(() => cardForm.qrLink, async (newLink) => {
  if (newLink) {
    await generateQRCode()
  }
}, {immediate: true})

// Watch for card type changes to auto-generate new link
/*watch(() => cardForm.cardType, () => {
  generateRandomLink()
}, {immediate: false})*/

// Generate initial random link
onMounted(async () => {
  //generateRandomLink()
  await productStore.fetchProducts()
})
</script>
