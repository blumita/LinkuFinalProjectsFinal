<template>
  <div class="w-full p-4 sm:p-6 lg:p-8">
    <!-- Header Section -->
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-slate-900 dark:text-white mb-3">
        <i class="ti ti-database-export text-blue-600 ml-3"></i>
        پشتیبان‌گیری و انتقال داده
      </h1>
      <p class="text-slate-600 dark:text-slate-400">
        مدیریت پشتیبان‌گیری از دیتابیس و خروجی/ورودی داده‌ها
      </p>
    </div>

    <!-- Quick Actions -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
      <button
        @click="downloadDatabaseBackup"
        :disabled="isDownloading"
        class="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all flex flex-col items-center gap-3 disabled:opacity-50"
      >
        <i class="ti ti-database-export text-3xl" :class="{ 'animate-pulse': isDownloading }"></i>
        <span class="font-medium">{{ isDownloading ? 'در حال دانلود...' : 'دانلود پشتیبان' }}</span>
      </button>

      <button
        @click="showRestoreModal = true"
        class="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all flex flex-col items-center gap-3"
      >
        <i class="ti ti-database-import text-3xl"></i>
        <span class="font-medium">بازیابی پشتیبان</span>
      </button>

      <button
        @click="runBackupNow"
        :disabled="isRunningBackup"
        class="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all flex flex-col items-center gap-3 disabled:opacity-50"
      >
        <i class="ti ti-player-play text-3xl" :class="{ 'animate-spin': isRunningBackup }"></i>
        <span class="font-medium">{{ isRunningBackup ? 'در حال اجرا...' : 'اجرای پشتیبان‌گیری' }}</span>
      </button>

      <button
        @click="activeTab = 'history'"
        class="bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all flex flex-col items-center gap-3"
      >
        <i class="ti ti-history text-3xl"></i>
        <span class="font-medium">تاریخچه پشتیبان‌ها</span>
      </button>
    </div>

    <!-- Tabs -->
    <div class="bg-white dark:bg-slate-800 rounded-xl shadow-lg overflow-hidden">
      <div class="border-b border-slate-200 dark:border-slate-700">
        <nav class="flex space-x-8 space-x-reverse px-6" aria-label="Tabs">
          <button
            v-for="tab in tabs"
            :key="tab.id"
            @click="activeTab = tab.id"
            :class="[
              'py-4 px-1 border-b-2 font-medium text-sm transition-colors',
              activeTab === tab.id
                ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300'
            ]"
          >
            <i :class="[tab.icon, 'ml-2']"></i>
            {{ tab.name }}
          </button>
        </nav>
      </div>

      <!-- Export/Import Tab -->
      <div v-if="activeTab === 'export'" class="p-6">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <!-- Export Section -->
          <div class="space-y-6">
            <h3 class="text-lg font-semibold text-slate-900 dark:text-white flex items-center">
              <i class="ti ti-file-export text-green-600 ml-2"></i>
              خروجی داده‌ها
            </h3>

            <!-- Export Cards -->
            <div class="bg-slate-50 dark:bg-slate-700/50 rounded-lg p-4 space-y-4">
              <h4 class="font-medium text-slate-800 dark:text-slate-200">خروجی کارت‌ها</h4>
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm text-slate-600 dark:text-slate-400 mb-1">فرمت</label>
                  <select v-model="exportCardsFormat" class="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white">
                    <option value="json">JSON</option>
                    <option value="csv">CSV</option>
                  </select>
                </div>
                <div>
                  <label class="block text-sm text-slate-600 dark:text-slate-400 mb-1">محدوده</label>
                  <div class="flex gap-2">
                    <input v-model.number="exportCardsFrom" type="number" min="1" placeholder="از" class="w-1/2 px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white">
                    <input v-model.number="exportCardsTo" type="number" min="1" placeholder="تا" class="w-1/2 px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white">
                  </div>
                </div>
              </div>
              <button
                @click="exportCards"
                :disabled="isExportingCards"
                class="w-full px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors disabled:opacity-50"
              >
                <i class="ti ti-download ml-2" :class="{ 'animate-pulse': isExportingCards }"></i>
                {{ isExportingCards ? 'در حال خروجی...' : 'دانلود خروجی کارت‌ها' }}
              </button>
            </div>

            <!-- Export Users -->
            <div class="bg-slate-50 dark:bg-slate-700/50 rounded-lg p-4 space-y-4">
              <h4 class="font-medium text-slate-800 dark:text-slate-200">خروجی کاربران</h4>
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm text-slate-600 dark:text-slate-400 mb-1">فرمت</label>
                  <select v-model="exportUsersFormat" class="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white">
                    <option value="json">JSON</option>
                    <option value="csv">CSV</option>
                  </select>
                </div>
                <div>
                  <label class="block text-sm text-slate-600 dark:text-slate-400 mb-1">محدوده</label>
                  <div class="flex gap-2">
                    <input v-model.number="exportUsersFrom" type="number" min="1" placeholder="از" class="w-1/2 px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white">
                    <input v-model.number="exportUsersTo" type="number" min="1" placeholder="تا" class="w-1/2 px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white">
                  </div>
                </div>
              </div>
              <button
                @click="exportUsers"
                :disabled="isExportingUsers"
                class="w-full px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors disabled:opacity-50"
              >
                <i class="ti ti-download ml-2" :class="{ 'animate-pulse': isExportingUsers }"></i>
                {{ isExportingUsers ? 'در حال خروجی...' : 'دانلود خروجی کاربران' }}
              </button>
            </div>
          </div>

          <!-- Import Section -->
          <div class="space-y-6">
            <h3 class="text-lg font-semibold text-slate-900 dark:text-white flex items-center">
              <i class="ti ti-file-import text-blue-600 ml-2"></i>
              ورودی داده‌ها
            </h3>

            <!-- Import Cards -->
            <div class="bg-slate-50 dark:bg-slate-700/50 rounded-lg p-4 space-y-4">
              <h4 class="font-medium text-slate-800 dark:text-slate-200">ورودی کارت‌ها</h4>
              <div>
                <label class="block text-sm text-slate-600 dark:text-slate-400 mb-1">حالت ورودی</label>
                <select v-model="importCardsMode" class="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white">
                  <option value="append">اضافه به داده‌های موجود</option>
                  <option value="replace">جایگزینی کامل (حذف قبلی‌ها)</option>
                </select>
              </div>
              <div>
                <label class="block text-sm text-slate-600 dark:text-slate-400 mb-1">فایل (JSON یا CSV)</label>
                <input
                  type="file"
                  @change="handleCardsFileSelect"
                  accept=".json,.csv,.txt"
                  class="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white file:ml-4 file:py-1 file:px-3 file:rounded file:border-0 file:bg-blue-500 file:text-white file:cursor-pointer"
                />
              </div>
              <button
                @click="importCards"
                :disabled="!importCardsFile || isImportingCards"
                class="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors disabled:opacity-50"
              >
                <i class="ti ti-upload ml-2" :class="{ 'animate-pulse': isImportingCards }"></i>
                {{ isImportingCards ? 'در حال ورودی...' : 'آپلود و ورودی کارت‌ها' }}
              </button>
            </div>

            <!-- Import Users -->
            <div class="bg-slate-50 dark:bg-slate-700/50 rounded-lg p-4 space-y-4">
              <h4 class="font-medium text-slate-800 dark:text-slate-200">ورودی کاربران</h4>
              <div>
                <label class="block text-sm text-slate-600 dark:text-slate-400 mb-1">حالت ورودی</label>
                <select v-model="importUsersMode" class="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white">
                  <option value="append">اضافه به داده‌های موجود</option>
                  <option value="replace">جایگزینی کامل (حذف قبلی‌ها بجز ادمین‌ها)</option>
                </select>
              </div>
              <div>
                <label class="block text-sm text-slate-600 dark:text-slate-400 mb-1">فایل (JSON یا CSV)</label>
                <input
                  type="file"
                  @change="handleUsersFileSelect"
                  accept=".json,.csv,.txt"
                  class="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white file:ml-4 file:py-1 file:px-3 file:rounded file:border-0 file:bg-blue-500 file:text-white file:cursor-pointer"
                />
              </div>
              <button
                @click="importUsers"
                :disabled="!importUsersFile || isImportingUsers"
                class="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors disabled:opacity-50"
              >
                <i class="ti ti-upload ml-2" :class="{ 'animate-pulse': isImportingUsers }"></i>
                {{ isImportingUsers ? 'در حال ورودی...' : 'آپلود و ورودی کاربران' }}
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Auto Backup Settings Tab -->
      <div v-if="activeTab === 'settings'" class="p-6 space-y-8">
        <!-- Enable Auto Backup -->
        <div class="flex items-center justify-between bg-slate-50 dark:bg-slate-700/50 rounded-lg p-4">
          <div>
            <h3 class="font-medium text-slate-900 dark:text-white">پشتیبان‌گیری خودکار</h3>
            <p class="text-sm text-slate-500 dark:text-slate-400">فعال‌سازی پشتیبان‌گیری اتوماتیک</p>
          </div>
          <label class="relative inline-flex items-center cursor-pointer">
            <input v-model="backupSettings.auto_backup_enabled" type="checkbox" class="sr-only peer">
            <div class="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-slate-600 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-slate-600 peer-checked:bg-blue-600"></div>
          </label>
        </div>

        <!-- Backup Frequency -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">تناوب پشتیبان‌گیری</label>
            <select v-model="backupSettings.backup_frequency" class="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white">
              <option value="hourly">ساعتی</option>
              <option value="daily">روزانه</option>
              <option value="weekly">هفتگی</option>
              <option value="monthly">ماهانه</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">ساعت پشتیبان‌گیری</label>
            <input v-model="backupSettings.backup_time" type="time" class="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white">
          </div>
          <div v-if="backupSettings.backup_frequency === 'weekly'">
            <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">روز هفته</label>
            <select v-model="backupSettings.backup_day" class="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white">
              <option :value="0">یکشنبه</option>
              <option :value="1">دوشنبه</option>
              <option :value="2">سه‌شنبه</option>
              <option :value="3">چهارشنبه</option>
              <option :value="4">پنج‌شنبه</option>
              <option :value="5">جمعه</option>
              <option :value="6">شنبه</option>
            </select>
          </div>
        </div>

        <!-- Backup Destinations -->
        <div>
          <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">مقصدهای پشتیبان‌گیری</label>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <label class="flex items-center gap-3 p-4 bg-slate-50 dark:bg-slate-700/50 rounded-lg cursor-pointer border-2 transition-colors" :class="backupSettings.backup_destinations?.includes('local') ? 'border-blue-500' : 'border-transparent'">
              <input type="checkbox" :checked="backupSettings.backup_destinations?.includes('local')" @change="toggleDestination('local')" class="w-5 h-5 text-blue-600 rounded focus:ring-blue-500">
              <div>
                <i class="ti ti-server text-2xl text-blue-600"></i>
                <span class="block font-medium text-slate-900 dark:text-white">سرور داخلی</span>
              </div>
            </label>
            <label class="flex items-center gap-3 p-4 bg-slate-50 dark:bg-slate-700/50 rounded-lg cursor-pointer border-2 transition-colors" :class="backupSettings.backup_destinations?.includes('sftp') ? 'border-green-500' : 'border-transparent'">
              <input type="checkbox" :checked="backupSettings.backup_destinations?.includes('sftp')" @change="toggleDestination('sftp')" class="w-5 h-5 text-green-600 rounded focus:ring-green-500">
              <div>
                <i class="ti ti-cloud-upload text-2xl text-green-600"></i>
                <span class="block font-medium text-slate-900 dark:text-white">SFTP</span>
              </div>
            </label>
            <label class="flex items-center gap-3 p-4 bg-slate-50 dark:bg-slate-700/50 rounded-lg cursor-pointer border-2 transition-colors" :class="backupSettings.backup_destinations?.includes('github') ? 'border-purple-500' : 'border-transparent'">
              <input type="checkbox" :checked="backupSettings.backup_destinations?.includes('github')" @change="toggleDestination('github')" class="w-5 h-5 text-purple-600 rounded focus:ring-purple-500">
              <div>
                <i class="ti ti-brand-github text-2xl text-purple-600"></i>
                <span class="block font-medium text-slate-900 dark:text-white">GitHub</span>
              </div>
            </label>
          </div>
        </div>

        <!-- GitHub Settings -->
        <div v-if="backupSettings.backup_destinations?.includes('github')" class="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-6 space-y-4">
          <h4 class="font-medium text-purple-900 dark:text-purple-100 flex items-center">
            <i class="ti ti-brand-github ml-2"></i>
            تنظیمات GitHub
          </h4>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm text-purple-700 dark:text-purple-300 mb-1">آدرس ریپازیتوری</label>
              <input v-model="backupSettings.github_repo" type="text" placeholder="username/repo" class="w-full px-4 py-2 border border-purple-300 dark:border-purple-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white">
            </div>
            <div>
              <label class="block text-sm text-purple-700 dark:text-purple-300 mb-1">شاخه (Branch)</label>
              <input v-model="backupSettings.github_branch" type="text" placeholder="main" class="w-full px-4 py-2 border border-purple-300 dark:border-purple-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white">
            </div>
            <div class="md:col-span-2">
              <label class="block text-sm text-purple-700 dark:text-purple-300 mb-1">توکن دسترسی (Personal Access Token)</label>
              <div class="relative">
                <input v-model="backupSettings.github_token" :type="showGithubToken ? 'text' : 'password'" placeholder="ghp_xxxxxxxxxxxx" class="w-full px-4 py-2 pl-10 border border-purple-300 dark:border-purple-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white">
                <button @click="showGithubToken = !showGithubToken" class="absolute left-3 top-1/2 -translate-y-1/2 text-purple-500">
                  <i :class="showGithubToken ? 'ti ti-eye-off' : 'ti ti-eye'"></i>
                </button>
              </div>
              <p class="text-xs text-purple-600 dark:text-purple-400 mt-1">برای ریپازیتوری Private حتماً توکن با دسترسی repo وارد کنید</p>
            </div>
            <div class="flex items-center gap-2">
              <input v-model="backupSettings.github_is_private" type="checkbox" class="w-4 h-4 text-purple-600 rounded focus:ring-purple-500">
              <span class="text-sm text-purple-700 dark:text-purple-300">ریپازیتوری Private است</span>
            </div>
            <div>
              <button @click="testGithubConnection" :disabled="isTestingGithub" class="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors disabled:opacity-50">
                <i class="ti ti-plug ml-1" :class="{ 'animate-spin': isTestingGithub }"></i>
                {{ isTestingGithub ? 'در حال تست...' : 'تست اتصال' }}
              </button>
            </div>
          </div>
        </div>

        <!-- SFTP Settings -->
        <div v-if="backupSettings.backup_destinations?.includes('sftp')" class="bg-green-50 dark:bg-green-900/20 rounded-lg p-6 space-y-4">
          <h4 class="font-medium text-green-900 dark:text-green-100 flex items-center">
            <i class="ti ti-cloud-upload ml-2"></i>
            تنظیمات SFTP
          </h4>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm text-green-700 dark:text-green-300 mb-1">آدرس سرور (Host)</label>
              <input v-model="backupSettings.sftp_host" type="text" placeholder="backup.example.com" class="w-full px-4 py-2 border border-green-300 dark:border-green-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white">
            </div>
            <div>
              <label class="block text-sm text-green-700 dark:text-green-300 mb-1">نام کاربری</label>
              <input v-model="backupSettings.sftp_username" type="text" placeholder="backup_user" class="w-full px-4 py-2 border border-green-300 dark:border-green-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white">
            </div>
            <div>
              <label class="block text-sm text-green-700 dark:text-green-300 mb-1">رمز عبور</label>
              <div class="relative">
                <input v-model="backupSettings.sftp_password" :type="showSftpPassword ? 'text' : 'password'" placeholder="********" class="w-full px-4 py-2 pl-10 border border-green-300 dark:border-green-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white">
                <button @click="showSftpPassword = !showSftpPassword" class="absolute left-3 top-1/2 -translate-y-1/2 text-green-500">
                  <i :class="showSftpPassword ? 'ti ti-eye-off' : 'ti ti-eye'"></i>
                </button>
              </div>
            </div>
            <div>
              <label class="block text-sm text-green-700 dark:text-green-300 mb-1">مسیر ذخیره</label>
              <input v-model="backupSettings.sftp_path" type="text" placeholder="/backups" class="w-full px-4 py-2 border border-green-300 dark:border-green-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white">
            </div>
            <div class="md:col-span-2">
              <button @click="testSftpConnection" :disabled="isTestingSftp" class="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors disabled:opacity-50">
                <i class="ti ti-plug ml-1" :class="{ 'animate-spin': isTestingSftp }"></i>
                {{ isTestingSftp ? 'در حال تست...' : 'تست اتصال' }}
              </button>
            </div>
          </div>
        </div>

        <!-- Retention -->
        <div>
          <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">مدت نگهداری پشتیبان‌ها (روز)</label>
          <input v-model.number="backupSettings.retention_days" type="number" min="1" max="365" class="w-48 px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white">
        </div>

        <!-- Save Button -->
        <div class="pt-6 border-t border-slate-200 dark:border-slate-700">
          <button
            @click="saveBackupSettings"
            :disabled="isSavingSettings"
            class="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors disabled:opacity-50 flex items-center"
          >
            <i class="ti ti-device-floppy ml-2" :class="{ 'animate-pulse': isSavingSettings }"></i>
            {{ isSavingSettings ? 'در حال ذخیره...' : 'ذخیره تنظیمات' }}
          </button>
        </div>
      </div>

      <!-- Backup History Tab -->
      <div v-if="activeTab === 'history'" class="p-6">
        <div class="overflow-x-auto">
          <table class="w-full">
            <thead>
              <tr class="border-b border-slate-200 dark:border-slate-700">
                <th class="text-right py-3 px-4 text-sm font-medium text-slate-600 dark:text-slate-400">تاریخ</th>
                <th class="text-right py-3 px-4 text-sm font-medium text-slate-600 dark:text-slate-400">مقصد</th>
                <th class="text-right py-3 px-4 text-sm font-medium text-slate-600 dark:text-slate-400">مسیر</th>
                <th class="text-right py-3 px-4 text-sm font-medium text-slate-600 dark:text-slate-400">حجم</th>
                <th class="text-right py-3 px-4 text-sm font-medium text-slate-600 dark:text-slate-400">وضعیت</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="backup in backupHistory" :key="backup.id" class="border-b border-slate-100 dark:border-slate-700/50 hover:bg-slate-50 dark:hover:bg-slate-700/30">
                <td class="py-3 px-4 text-sm text-slate-900 dark:text-white">{{ formatDate(backup.created_at) }}</td>
                <td class="py-3 px-4">
                  <span :class="getDestinationClass(backup.destination)" class="px-2 py-1 rounded text-xs font-medium">
                    {{ getDestinationLabel(backup.destination) }}
                  </span>
                </td>
                <td class="py-3 px-4 text-sm text-slate-600 dark:text-slate-400 font-mono text-xs max-w-xs truncate" :title="backup.path">{{ backup.path }}</td>
                <td class="py-3 px-4 text-sm text-slate-900 dark:text-white">{{ formatBytes(backup.size) }}</td>
                <td class="py-3 px-4">
                  <span :class="backup.status === 'success' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'" class="px-2 py-1 rounded text-xs font-medium">
                    {{ backup.status === 'success' ? 'موفق' : 'ناموفق' }}
                  </span>
                </td>
              </tr>
              <tr v-if="backupHistory.length === 0">
                <td colspan="5" class="py-8 text-center text-slate-500 dark:text-slate-400">
                  <i class="ti ti-database-off text-4xl mb-2 block"></i>
                  هیچ پشتیبانی ثبت نشده است
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Restore Modal -->
    <div v-if="showRestoreModal" class="fixed inset-0 z-50 flex items-center justify-center p-4" style="backdrop-filter: blur(8px)">
      <div @click="showRestoreModal = false" class="absolute inset-0 bg-black/40"></div>
      <div @click.stop class="relative bg-white dark:bg-slate-800 rounded-2xl p-6 max-w-md w-full shadow-xl">
        <div class="text-center mb-6">
          <div class="w-16 h-16 bg-orange-100 dark:bg-orange-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
            <i class="ti ti-database-import text-3xl text-orange-600 dark:text-orange-400"></i>
          </div>
          <h3 class="text-xl font-bold text-slate-900 dark:text-white mb-2">بازیابی پشتیبان</h3>
          <p class="text-slate-500 dark:text-slate-400 text-sm">فایل SQL پشتیبان را انتخاب کنید</p>
        </div>

        <div class="space-y-4">
          <div class="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
            <p class="text-red-700 dark:text-red-400 text-sm">
              <i class="ti ti-alert-triangle ml-1"></i>
              <strong>هشدار:</strong> این عملیات کل دیتابیس را جایگزین می‌کند. قبل از ادامه از داده‌های فعلی پشتیبان بگیرید.
            </p>
          </div>

          <div>
            <label class="block text-sm text-slate-600 dark:text-slate-400 mb-2">فایل پشتیبان (SQL)</label>
            <input
              type="file"
              @change="handleRestoreFileSelect"
              accept=".sql,.txt"
              class="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white file:ml-4 file:py-1 file:px-3 file:rounded file:border-0 file:bg-orange-500 file:text-white file:cursor-pointer"
            />
          </div>

          <div class="flex gap-3">
            <button
              @click="showRestoreModal = false"
              class="flex-1 px-4 py-2 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
            >
              انصراف
            </button>
            <button
              @click="restoreBackup"
              :disabled="!restoreFile || isRestoring"
              class="flex-1 px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg transition-colors disabled:opacity-50"
            >
              <i class="ti ti-database-import ml-1" :class="{ 'animate-pulse': isRestoring }"></i>
              {{ isRestoring ? 'در حال بازیابی...' : 'بازیابی' }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Success/Error Messages -->
    <div v-if="message" class="fixed bottom-4 right-4 z-50 max-w-md">
      <div :class="messageClass" class="p-4 rounded-lg shadow-lg flex items-center gap-3">
        <i :class="messageIcon"></i>
        <span>{{ message }}</span>
        <button @click="message = ''" class="mr-auto text-current opacity-70 hover:opacity-100">
          <i class="ti ti-x"></i>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted, getCurrentInstance } from 'vue'
import type { AxiosInstance } from 'axios'

defineOptions({
  name: 'BackupManagement'
})

const { appContext } = getCurrentInstance()!
const axios = appContext.config.globalProperties.$axios as AxiosInstance

// Tabs
const tabs = [
  { id: 'export', name: 'خروجی/ورودی', icon: 'ti ti-arrows-exchange' },
  { id: 'settings', name: 'تنظیمات پشتیبان‌گیری', icon: 'ti ti-settings' },
  { id: 'history', name: 'تاریخچه', icon: 'ti ti-history' },
]
const activeTab = ref('export')

// Loading states
const isDownloading = ref(false)
const isRunningBackup = ref(false)
const isExportingCards = ref(false)
const isExportingUsers = ref(false)
const isImportingCards = ref(false)
const isImportingUsers = ref(false)
const isSavingSettings = ref(false)
const isTestingGithub = ref(false)
const isTestingSftp = ref(false)
const isRestoring = ref(false)

// Export settings
const exportCardsFormat = ref('json')
const exportCardsFrom = ref<number | null>(null)
const exportCardsTo = ref<number | null>(null)
const exportUsersFormat = ref('json')
const exportUsersFrom = ref<number | null>(null)
const exportUsersTo = ref<number | null>(null)

// Import settings
const importCardsMode = ref('append')
const importCardsFile = ref<File | null>(null)
const importUsersMode = ref('append')
const importUsersFile = ref<File | null>(null)

// Restore
const showRestoreModal = ref(false)
const restoreFile = ref<File | null>(null)

// Backup settings
const backupSettings = reactive({
  auto_backup_enabled: false,
  backup_frequency: 'daily',
  backup_time: '03:00',
  backup_day: 0,
  backup_destinations: ['local'],
  github_repo: '',
  github_token: '',
  github_branch: 'main',
  github_is_private: false,
  sftp_host: '',
  sftp_username: '',
  sftp_password: '',
  sftp_path: '/backups',
  retention_days: 30,
})

const showGithubToken = ref(false)
const showSftpPassword = ref(false)

// Backup history
const backupHistory = ref<any[]>([])

// Messages
const message = ref('')
const messageType = ref<'success' | 'error'>('success')

const messageClass = computed(() => {
  return messageType.value === 'success'
    ? 'bg-green-50 text-green-700 border border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800'
    : 'bg-red-50 text-red-700 border border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800'
})

const messageIcon = computed(() => {
  return messageType.value === 'success' ? 'ti ti-check-circle text-xl' : 'ti ti-alert-circle text-xl'
})

// Methods
const showMessage = (msg: string, type: 'success' | 'error' = 'success') => {
  message.value = msg
  messageType.value = type
  setTimeout(() => { message.value = '' }, 5000)
}

const downloadDatabaseBackup = async () => {
  try {
    isDownloading.value = true
    const response = await axios.get('/user/admin/backup/download', {
      responseType: 'blob'
    })
    
    const blob = new Blob([response.data], { type: 'application/sql' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `backup_${new Date().toISOString().slice(0, 19).replace(/[T:]/g, '-')}.sql`
    a.click()
    window.URL.revokeObjectURL(url)
    
    showMessage('فایل پشتیبان دانلود شد')
  } catch (error: any) {
    showMessage(error.response?.data?.message || 'خطا در دانلود پشتیبان', 'error')
  } finally {
    isDownloading.value = false
  }
}

const runBackupNow = async () => {
  try {
    isRunningBackup.value = true
    const response = await axios.post('/user/admin/backup/run-now')
    showMessage(response.data.message || 'پشتیبان‌گیری انجام شد')
    loadBackupHistory()
  } catch (error: any) {
    showMessage(error.response?.data?.message || 'خطا در اجرای پشتیبان‌گیری', 'error')
  } finally {
    isRunningBackup.value = false
  }
}

const exportCards = async () => {
  try {
    isExportingCards.value = true
    const params: any = { format: exportCardsFormat.value }
    if (exportCardsFrom.value) params.from = exportCardsFrom.value
    if (exportCardsTo.value) params.to = exportCardsTo.value

    const response = await axios.get('/user/admin/backup/export/cards', {
      params,
      responseType: exportCardsFormat.value === 'csv' ? 'blob' : 'json'
    })

    if (exportCardsFormat.value === 'csv') {
      const blob = new Blob([response.data], { type: 'text/csv' })
      downloadBlob(blob, `cards_${Date.now()}.csv`)
    } else {
      const blob = new Blob([JSON.stringify(response.data, null, 2)], { type: 'application/json' })
      downloadBlob(blob, `cards_${Date.now()}.json`)
    }
    
    showMessage('خروجی کارت‌ها دانلود شد')
  } catch (error: any) {
    showMessage(error.response?.data?.message || 'خطا در خروجی کارت‌ها', 'error')
  } finally {
    isExportingCards.value = false
  }
}

const exportUsers = async () => {
  try {
    isExportingUsers.value = true
    const params: any = { format: exportUsersFormat.value }
    if (exportUsersFrom.value) params.from = exportUsersFrom.value
    if (exportUsersTo.value) params.to = exportUsersTo.value

    const response = await axios.get('/user/admin/backup/export/users', {
      params,
      responseType: exportUsersFormat.value === 'csv' ? 'blob' : 'json'
    })

    if (exportUsersFormat.value === 'csv') {
      const blob = new Blob([response.data], { type: 'text/csv' })
      downloadBlob(blob, `users_${Date.now()}.csv`)
    } else {
      const blob = new Blob([JSON.stringify(response.data, null, 2)], { type: 'application/json' })
      downloadBlob(blob, `users_${Date.now()}.json`)
    }
    
    showMessage('خروجی کاربران دانلود شد')
  } catch (error: any) {
    showMessage(error.response?.data?.message || 'خطا در خروجی کاربران', 'error')
  } finally {
    isExportingUsers.value = false
  }
}

const handleCardsFileSelect = (event: Event) => {
  const target = event.target as HTMLInputElement
  importCardsFile.value = target.files?.[0] || null
}

const handleUsersFileSelect = (event: Event) => {
  const target = event.target as HTMLInputElement
  importUsersFile.value = target.files?.[0] || null
}

const handleRestoreFileSelect = (event: Event) => {
  const target = event.target as HTMLInputElement
  restoreFile.value = target.files?.[0] || null
}

const importCards = async () => {
  if (!importCardsFile.value) return
  
  try {
    isImportingCards.value = true
    const formData = new FormData()
    formData.append('file', importCardsFile.value)
    formData.append('mode', importCardsMode.value)

    const response = await axios.post('/user/admin/backup/import/cards', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
    
    showMessage(response.data.message || 'ورودی کارت‌ها انجام شد')
    importCardsFile.value = null
  } catch (error: any) {
    showMessage(error.response?.data?.message || 'خطا در ورودی کارت‌ها', 'error')
  } finally {
    isImportingCards.value = false
  }
}

const importUsers = async () => {
  if (!importUsersFile.value) return
  
  try {
    isImportingUsers.value = true
    const formData = new FormData()
    formData.append('file', importUsersFile.value)
    formData.append('mode', importUsersMode.value)

    const response = await axios.post('/user/admin/backup/import/users', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
    
    showMessage(response.data.message || 'ورودی کاربران انجام شد')
    importUsersFile.value = null
  } catch (error: any) {
    showMessage(error.response?.data?.message || 'خطا در ورودی کاربران', 'error')
  } finally {
    isImportingUsers.value = false
  }
}

const restoreBackup = async () => {
  if (!restoreFile.value) return
  
  if (!confirm('آیا از بازیابی پشتیبان اطمینان دارید؟ این عملیات غیرقابل بازگشت است!')) return
  
  try {
    isRestoring.value = true
    const formData = new FormData()
    formData.append('file', restoreFile.value)

    const response = await axios.post('/user/admin/backup/restore', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
    
    showMessage(response.data.message || 'بازیابی با موفقیت انجام شد')
    showRestoreModal.value = false
    restoreFile.value = null
  } catch (error: any) {
    showMessage(error.response?.data?.message || 'خطا در بازیابی پشتیبان', 'error')
  } finally {
    isRestoring.value = false
  }
}

const toggleDestination = (dest: string) => {
  if (!backupSettings.backup_destinations) {
    backupSettings.backup_destinations = []
  }
  const index = backupSettings.backup_destinations.indexOf(dest)
  if (index > -1) {
    backupSettings.backup_destinations.splice(index, 1)
  } else {
    backupSettings.backup_destinations.push(dest)
  }
}

const saveBackupSettings = async () => {
  try {
    isSavingSettings.value = true
    const response = await axios.post('/user/admin/backup/settings', backupSettings)
    showMessage(response.data.message || 'تنظیمات ذخیره شد')
  } catch (error: any) {
    showMessage(error.response?.data?.message || 'خطا در ذخیره تنظیمات', 'error')
  } finally {
    isSavingSettings.value = false
  }
}

const testGithubConnection = async () => {
  try {
    isTestingGithub.value = true
    const response = await axios.post('/user/admin/backup/test/github', {
      repo: backupSettings.github_repo,
      token: backupSettings.github_token,
      branch: backupSettings.github_branch,
    })
    showMessage(`اتصال موفق! ریپازیتوری: ${response.data.repo_name}`)
  } catch (error: any) {
    showMessage(error.response?.data?.message || 'خطا در اتصال به GitHub', 'error')
  } finally {
    isTestingGithub.value = false
  }
}

const testSftpConnection = async () => {
  try {
    isTestingSftp.value = true
    await axios.post('/user/admin/backup/test/sftp', {
      host: backupSettings.sftp_host,
      username: backupSettings.sftp_username,
      password: backupSettings.sftp_password,
      path: backupSettings.sftp_path,
    })
    showMessage('اتصال SFTP موفق!')
  } catch (error: any) {
    showMessage(error.response?.data?.message || 'خطا در اتصال SFTP', 'error')
  } finally {
    isTestingSftp.value = false
  }
}

const loadBackupSettings = async () => {
  try {
    const response = await axios.get('/user/admin/backup/settings')
    if (response.data.data) {
      Object.assign(backupSettings, response.data.data)
    }
  } catch (error) {
    console.error('Error loading backup settings:', error)
  }
}

const loadBackupHistory = async () => {
  try {
    const response = await axios.get('/user/admin/backup/history')
    backupHistory.value = response.data.data || []
  } catch (error) {
    console.error('Error loading backup history:', error)
  }
}

// Utility functions
const downloadBlob = (blob: Blob, filename: string) => {
  const url = window.URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  window.URL.revokeObjectURL(url)
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return new Intl.DateTimeFormat('fa-IR', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date)
}

const formatBytes = (bytes: number) => {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

const getDestinationLabel = (dest: string) => {
  switch (dest) {
    case 'local': return 'سرور'
    case 'sftp': return 'SFTP'
    case 'github': return 'GitHub'
    default: return dest
  }
}

const getDestinationClass = (dest: string) => {
  switch (dest) {
    case 'local': return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
    case 'sftp': return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
    case 'github': return 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400'
    default: return 'bg-slate-100 text-slate-700'
  }
}

onMounted(() => {
  loadBackupSettings()
  loadBackupHistory()
})
</script>
