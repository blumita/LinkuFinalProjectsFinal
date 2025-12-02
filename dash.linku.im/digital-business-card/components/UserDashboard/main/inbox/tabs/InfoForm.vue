<template>
  <div>
    <!-- عنوان کلی -->
    <h2 class="text-xl font-bold mb-6 text-right flex items-center gap-2 text-primary">
      <i class="ti ti-id text-2xl text-primary"></i>
      فرم‌ها
    </h2>

    <!-- تب‌ها -->
    <div class="flex gap-2 mb-4 border-b border-border">
      <button
          :class="[
          'px-4 py-2 text-sm font-medium transition flex items-center gap-1',
          activeTab === 'form'
            ? 'border-b-2 border-accent text-accent'
            : 'text-primary opacity-70 hover:text-accent'
        ]"
          @click="activeTab = 'form'"
      >
        <i class="ti ti-form-select text-base"></i>
        فرم (پیش‌فرض)
      </button>
      <button
          :class="[
          'px-4 py-2 text-sm font-medium transition flex items-center gap-1',
          activeTab === 'submissions'
            ? 'border-b-2 border-accent text-accent'
            : 'text-primary opacity-70 hover:text-accent'
        ]"
          @click="activeTab = 'submissions'"
      >
        <i class="ti ti-database text-base"></i>
        اطلاعات دریافتی
      </button>
    </div>

    <!-- تب فرم پیش‌فرض -->
    <div v-if="activeTab === 'form'">
      <div class="border border-border rounded-lg bg-secondary">
        <div
            class="p-4 flex justify-between items-center cursor-pointer hover:bg-primary transition"
            @click="toggleLeadInfo"
        >
          <div class="text-right">
            <p class="font-semibold text-primary">فرم ثبت اطلاعات</p>
            <p class="text-sm text-primary opacity-60">شناسه: 1</p>
          </div>
          <i
              :class="[
              'ti text-xl transition-transform duration-300 text-primary',
              openLead ? 'ti-chevron-up' : 'ti-chevron-down'
            ]"
          ></i>
        </div>

        <transition name="fade">
          <div
              v-if="openLead && defaultLead"
              class="border-t border-border px-4 py-3 text-sm text-right bg-primary space-y-2 text-primary"
          >
            <p
                v-for="(value, label) in defaultLead.data"
                :key="label"
            >
              <template v-if="isFileField(label)">
                <strong>{{ formatLabel(label) }}:</strong>
                <div class="mt-1">
                  <a
                      v-if="isImage(value)"
                      :href="fileUrl(value)"
                      target="_blank"
                      class="block"
                  >
                    <img
                        :src="fileUrl(value)"
                        alt="Preview"
                        class="w-28 h-auto rounded border border-gray-300"
                    />
                  </a>
                  <a
                      v-else
                      :href="fileUrl(value)"
                      target="_blank"
                      class="text-blue-600 hover:underline text-sm"
                  >
                    دانلود فایل
                  </a>
                </div>
              </template>

              <template v-else>
                <strong>{{ formatLabel(label) }}:</strong>
                <span class="ltr" v-if="isProbablyPhoneOrIp(label)">{{ value }}</span>
                <span v-else>{{ value }}</span>
              </template>
            </p>
            <p><strong>IP:</strong> {{ defaultLead.ip || '---' }}</p>
            <p><strong>کشور:</strong> {{ defaultLead.country || '---' }}</p>
          </div>
        </transition>

      </div>

      <button
          @click="exportToExcel"
          class="w-full py-2 bg-black text-white rounded-lg mt-6 hover:bg-gray-800 transition"
      >
        خروجی اکسل
      </button>
    </div>

    <!-- تب اطلاعات دریافتی -->
    <div v-if="activeTab === 'submissions'">
      <ul class="space-y-3">
        <li
            v-for="item in paginatedData"
            :key="item.id"
            class="border border-gray-200 rounded-lg text-gray-700"
        >
          <div
              class="p-4 flex justify-between items-center cursor-pointer hover:bg-gray-50 transition"
              @click="toggleSubmission(item.id)"
          >
            <div class="text-right">
              <p class="font-semibold text-gray-800">نام: {{ item.name }}</p>
              <p class="text-sm text-gray-500">شناسه: {{ item.id }}</p>
            </div>
            <i
                :class="[
                'ti text-xl transition-transform duration-300',
                openSubmissionId === item.id ? 'ti-chevron-up' : 'ti-chevron-down'
              ]"
            ></i>
          </div>

          <transition name="fade">
            <div
                v-if="openSubmissionId === item.id"
                class="border-t border-gray-200 px-4 py-3 text-sm text-right bg-gray-50 space-y-1"
            >
              <p
                  v-for="(value, label) in item.data"
                  :key="label"
              >
                <template v-if="isFileField(label)">
                  <strong>{{ formatLabel(label) }}:</strong>
                  <div class="mt-1">
                    <a
                        v-if="isImage(value)"
                        :href="fileUrl(value)"
                        target="_blank"
                        class="block"
                    >
                      <img
                          :src="fileUrl(value)"
                          alt="Preview"
                          class="w-28 h-auto rounded border border-gray-300"
                      />
                    </a>
                    <a
                        v-else
                        :href="fileUrl(value)"
                        target="_blank"
                        class="text-blue-600 hover:underline text-sm"
                    >
                      دانلود فایل
                    </a>
                  </div>
                </template>

                <template v-else>
                  <strong>{{ formatLabel(label) }}:</strong>
                  <span class="ltr" v-if="isProbablyPhoneOrIp(label)">{{ value }}</span>
                  <span v-else>{{ value }}</span>
                </template>
              </p>

              <p><strong>IP:</strong> {{ item.ip || '---' }}</p>
              <p><strong>کشور:</strong> {{ item.country || '---' }}</p>
            </div>
          </transition>
        </li>
      </ul>

      <!-- صفحه‌بندی -->
      <div v-if="totalPages > 1" class="flex justify-center mt-6 gap-2">
        <button
            v-for="page in totalPages"
            :key="page"
            @click="currentPage = page"
            :class="[
            'px-3 py-1 text-sm border',
            currentPage === page
              ? 'bg-black text-white border-black'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200',
            'rounded-md transition'
          ]"
        >
          {{ page }}
        </button>
      </div>

      <button
          @click="exportToExcel"
          class="w-full py-2 bg-black text-white rounded-lg mt-6 hover:bg-gray-800 transition"
      >
        خروجی اکسل
      </button>
    </div>
  </div>
</template>

<script>
import * as XLSX from 'xlsx'
import countryMap from '@/assets/api/countryMap.json'

export default {
  data() {
    return {
      activeTab: 'form',
      openLead: false,
      openSubmissionId: null,
      currentPage: 1,
      perPage: 5,
      sharedData: [],
      defaultLead: null,
      forms: []
    }
  },
  computed: {
    cardId() {
      const formStore = useFormStore()
      return formStore.defaultCard.id
    },
    totalPages() {
      return Math.ceil(this.sharedData.length / this.perPage)
    },
    paginatedData() {
      const start = (this.currentPage - 1) * this.perPage
      return this.sharedData.slice(start, start + this.perPage)
    }
  },
  watch: {
    activeTab() {
      this.currentPage = 1
    }
  },
  mounted() {
    this.fetchLeadData();
    this.$emit('updateCount', this.sharedData.length)
    fetch('https://ipapi.co/json/')
        .then(res => res.json())
        .then(data => {
          const ip = data.ip
          const country_en = data.country_name
          const country_fa = countryMap[country_en] || country_en
          this.defaultLead.ip = ip
          this.defaultLead.country = country_fa
        })
  },
  methods: {
    isFileField(label) {
      return label.startsWith('file_') || label.toLowerCase().includes('فایل');
    },
    isImage(filePath) {
      return /\.(jpg|jpeg|png|gif|webp)$/i.test(filePath);
    },
    fileUrl(path) {
      // اگه فایل‌ها در public ذخیره شدن مستقیم نشون می‌دی
      return path;
    },
    formatLabel(label) {
      return label.replace(/_/g, ' ');
    },
    isProbablyPhoneOrIp(label) {
      return ['شماره تماس', 'شماره_تلفن', 'ip', 'کد_پیگیری'].some(keyword =>
          label.toLowerCase().includes(keyword)
      );
    },
    async fetchLeadData() {
      try {
        const res1 = await this.$axios.get(`v1/cards/${this.cardId}/leads/readAll`)
        const leadRes = await this.$axios.get(`v1/cards/${this.cardId}/leads`)
        const leadsData = leadRes.data.data

        const res2 = await this.$axios.get(`v1/cards/${this.cardId}/forms/readAll`)
        const formsRes = await this.$axios.get(`v1/cards/${this.cardId}/forms`)
        this.forms = formsRes.data.data

        this.defaultLead = leadsData.find(item => item.isDefault === true)

        const others = leadsData.filter(item => item.isDefault !== true)
        const combined = [...others, ...this.forms]
        this.sharedData = combined.map((item, index) => ({
          id: index + 1,
          data: item.data,
          ip: '',
          country: ''
        }))
      } catch (error) {
      }
    },
    toggleLeadInfo() {
      this.openLead = !this.openLead
    },
    toggleSubmission(id) {
      this.openSubmissionId = this.openSubmissionId === id ? null : id
    },
    exportToExcel() {
      const rows = this.sharedData.map((item, index) => {
        const row = {
          ردیف: index + 1,
          IP: item.ip || '',
          کشور: item.country || ''
        }

        // اضافه کردن فیلدهای داینامیک از data
        for (const [key, value] of Object.entries(item.data)) {
          const label = this.formatLabel(key)
          row[label] = value
        }

        return row
      })

      const sheet = XLSX.utils.json_to_sheet(rows)
      const book = XLSX.utils.book_new()
      XLSX.utils.book_append_sheet(book, sheet, 'فرم‌ها')
      XLSX.writeFile(book, 'فرم‌ها.xlsx')
    }
  }
}

export async function fetchInfoFormCount(cardId, axiosInstance) {
  try {
    const [leadRes, formRes] = await Promise.all([
      axiosInstance.get(`v1/cards/${cardId}/leads/leadsCount`),
      axiosInstance.get(`v1/cards/${cardId}/forms/formsCount`)
    ])

    const leadData = leadRes.data.data || {}
    const formData = formRes.data.data || {}

    return {
      unreadCount: (leadData.unreadCount ?? 0) + (formData.unreadCount ?? 0),
      totalCount: (leadData.totalCount ?? 0) + (formData.totalCount ?? 0)
    }
  } catch (error) {
    return {
      unreadCount: 0,
      totalCount: 0
    }
  }
}
</script>

<style scoped>
.ltr {
  direction: ltr;
  display: inline-block;
}

.fade-enter-active,
.fade-leave-active {
  transition: all 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}
</style>