<template>
  <div v-if="!isLoading">
    <InfoToast :visible="showToast" :message="toastMessage" :icon="toastIcon"/>
    <!-- نمایش Single Link Layout -->
    <LayoutSingle v-if="formData?.singleLink"/>

    <!-- نمایش Layout عادی -->
    <div
        v-else
        class="w-full h-screen flex flex-col overflow-hidden relative scrollbar-hide"
        :dir="formData?.layout === 'left' ? 'ltr' : 'rtl'"
    >
      <!-- پس‌زمینه با رنگ تم -->
      <div
          class="absolute inset-0 w-full h-full pointer-events-none"
          :style="`background-color: ${backgroundWithOpacity}; z-index: 0;`"
      />
      
      <!-- هدر ثابت -->
      <div class="fixed top-0 left-0 right-0 z-50 pointer-events-none" style="position: -webkit-sticky; position: sticky;">
        <div class="absolute top-4 ltr:right-4 rtl:left-4 pointer-events-auto">
            <button
                @click.prevent.stop="showOptionsMenu = !showOptionsMenu"
                type="button"
                class="w-10 h-10 rounded-full flex items-center justify-center text-white transition-all duration-300 shadow-lg"
                :style="{
                  backgroundColor: formData?.themeColor?.background || '#3b82f6',
                  opacity: 0.95
                }"
            >
              <i class="ti ti-dots-vertical text-lg"></i>
            </button>

            <!-- منوی کشویی -->
            <div
                v-show="showOptionsMenu"
                @click.stop
                class="absolute top-12 ltr:right-0 rtl:left-0 bg-white rounded-xl shadow-2xl border-2 border-gray-200 py-2 min-w-[160px] z-30"
            >
              <button
                  @click.stop="handleShareClick"
                  type="button"
                  class="w-full text-right px-4 py-3 hover:bg-gray-50 flex items-center gap-3 transition-all duration-200 font-medium text-gray-800"
              >
                <i class="ti ti-share text-lg"></i>
                اشتراک‌گذاری
              </button>
              <button
                  @click.stop="handleReportClick"
                  type="button"
                  class="w-full text-right px-4 py-3 hover:bg-gray-50 flex items-center gap-3 transition-all duration-200 font-medium text-gray-800"
              >
                <i class="ti ti-flag text-lg"></i>
                گزارش محتوا
              </button>
            </div>
        </div>
      </div>
      
      <!-- محتوای اصلی -->
      <div class="relative z-10 flex-1 pb-8 overflow-auto scrollbar-hide">
        <!-- کاور -->
        <div
            :class="[
          'relative w-full bg-gray-200 bg-cover bg-center',
          formData?.layout === 'portrait' ? 'h-60' : 'h-40'
        ]"
        >
          <template v-if="formData?.coverImage">
            <div
                class="absolute inset-0 bg-cover bg-center"
                :style="`background-image: url('${formData.coverImage}')`"
            ></div>
          </template>

          <!-- گرادینت برای فید کردن پایین عکس - فقط در حالت پورتریت -->
          <div
              v-if="formData?.layout === 'portrait'"
              class="absolute inset-0"
              :style="{
            background: `linear-gradient(to bottom,
              transparent 60%,
              ${getLighterColor(formData?.themeColor?.background ?? '#ffffff')} 100%)`
          }"
          />

          <!-- آواتار و لوگو - موقعیت بر اساس layout -->
          <div
              v-if="formData?.layout !== 'portrait'"
              :class="[
            'absolute -bottom-8 z-10 mx-5',
            formData?.layout === 'left' ? 'left-1' :
            formData?.layout === 'center' ? 'left-1/2 transform -translate-x-1/2' :
            'right-1' // default برای right
          ]"
          >
            <div v-if="formData?.profileImage" class="relative">
              <div class="rounded-full border-4 border-white bg-slate-200 w-28 h-28 overflow-hidden">
                <img :src="formData?.profileImage" class="w-full h-full object-cover">
              </div>

              <div
                  v-if="formData?.logoImage"
                  :class="[
                'absolute bottom-3 w-10 h-10 rounded-full shadow-md border-2 border-white overflow-hidden',
                formData?.layout === 'left' ? '-right-3' : '-left-3',
                'bg-white'
              ]"
              >
                <img :src="formData?.logoImage" class="w-full h-full object-cover">
              </div>
            </div>
          </div>
        </div>

        <!-- اطلاعات -->
        <div
            :class="[
          'z-10',
          formData?.layout === 'center' ? 'px-4 py-4 text-center flex flex-col items-center' :
          formData?.layout === 'portrait' ? 'px-4 py-3 text-right' :
          formData?.layout === 'left' ? 'px-4 py-4 text-left' :
          'px-4 py-4 text-right' // default برای right
        ]"
        >
          <div
              :class="[
            'space-y-2',
            formData?.layout === 'center' ? 'mt-6 mx-auto max-w-xs' :
            formData?.layout === 'portrait' ? 'mt-4 mx-2' :
            'mt-8 mx-2'
          ]"
              :style="{ color: iconText }"
          >
            <template v-if="formData?.name">
              <div
                  :class="[
                'text-xl font-bold flex items-center',
                formData?.layout === 'center' ? 'justify-center gap-3' :
                formData?.layout === 'portrait' ? 'justify-between' :
                formData?.layout === 'left' ? 'justify-start gap-3' :
                'justify-start gap-3' // default
              ]"
              >
                <!-- لوگو کوچک شرکت در حالت پورتریت - سمت چپ -->
                <div
                    v-if="formData?.layout === 'portrait' && formData?.logoImage"
                    class="w-12 h-12 rounded-full shadow-md border border-gray-200 overflow-hidden bg-white flex-shrink-0 order-2"
                >
                  <img :src="formData?.logoImage" class="w-full h-full object-cover">
                </div>
                <div class="flex items-center gap-2" :class="formData?.layout === 'portrait' ? 'order-1' : ''">
                  {{ formData?.name }}
                  <span :class="formData?.layout === 'left' ? 'ml-2' : 'mr-2'">

                  <i v-if="enableBlueTick" class="ti ti-rosette-discount-check text-blue-500"/>
                </span>
                </div>
              </div>
            </template>
            <template v-else>
              <div
                  :class="[
                'font-extrabold flex items-center',
                formData?.layout === 'center' ? 'text-2xl justify-center gap-3' :
                formData?.layout === 'portrait' ? 'text-xl justify-between' :
                formData?.layout === 'left' ? 'text-2xl justify-start gap-3' :
                'text-2xl justify-start gap-3' // default
              ]"
                  :style="{ color: iconText }"
              >
                <!-- لوگو کوچک شرکت در حالت پورتریت - سمت چپ -->
                <div
                    v-if="formData?.layout === 'portrait'"
                    class="w-12 h-12 rounded-full shadow-md border border-gray-200 overflow-hidden bg-white flex-shrink-0 order-2"
                >
                  <template v-if="formData?.logoImage">
                    <img :src="formData?.logoImage" class="w-full h-full object-cover">
                  </template>
                </div>
                <div class="flex items-center gap-2" :class="formData?.layout === 'portrait' ? 'order-1' : ''">

                </div>
              </div>
            </template>

            <template v-if="formData?.job">
              <div
                  :class="[
                'text-base font-medium flex items-center gap-1',
                formData?.layout === 'center' ? 'justify-center' :
                formData?.layout === 'portrait' ? 'justify-start' :
                formData?.layout === 'left' ? 'justify-start' :
                'justify-start' // default
              ]"
                  :style="{ color: iconText }"
              >
                <i class="ti ti-briefcase text-sm" :style="{ color: iconColor }"/>
                {{ formData?.job }}
              </div>
            </template>
            <div
                v-else
                :class="[
              'text-sm mt-4 flex items-center gap-1',
              formData?.layout === 'center' ? 'justify-center' :
              formData?.layout === 'portrait' ? 'justify-start' :
              formData?.layout === 'left' ? 'justify-start' :
              'justify-start' // default
            ]"
            >
            </div>

            <template v-if="formData?.company">
              <div
                  :class="[
                'text-base font-medium flex items-center gap-1',
                formData?.layout === 'center' ? 'justify-center' :
                formData?.layout === 'portrait' ? 'justify-start' :
                formData?.layout === 'left' ? 'justify-start' :
                'justify-start' // default
              ]"
                  :style="{ color: iconText }"
              >
                <i class="ti ti-building text-sm" :style="{ color: iconText }"/>
                {{ formData?.company }}
              </div>
            </template>
            <div
                v-else
                :class="[
              'text-sm flex items-center gap-1',
              formData?.layout === 'center' ? 'justify-center' :
              formData?.layout === 'portrait' ? 'justify-start' :
              formData?.layout === 'left' ? 'justify-start' :
              'justify-start' // default
            ]"
            >
            </div>

            <template v-if="formData?.location">
              <div
                  :class="[
                'text-base font-medium flex items-center gap-1',
                formData?.layout === 'center' ? 'justify-center' :
                formData?.layout === 'portrait' ? 'justify-start' :
                formData?.layout === 'left' ? 'justify-start' :
                'justify-start' // default
              ]"
                  :style="{ color: iconText }"
              >
                <i class="ti ti-map-pin text-sm" :style="{ color: iconText }"/>
                {{ formData?.location }}
              </div>
            </template>
            <div
                v-else
                :class="[
              'text-sm flex items-center gap-1',
              formData?.layout === 'center' ? 'justify-center' :
              formData?.layout === 'portrait' ? 'justify-start' :
              formData?.layout === 'left' ? 'justify-start' :
              'justify-start' // default
            ]"
            >
            </div>

            <template v-if="formData?.bio">
              <div
                  :class="[
                'text-xs leading-relaxed break-words',
                formData?.layout === 'center' ? 'text-center' :
                formData?.layout === 'portrait' ? 'text-justify' :
                'text-justify'
              ]"
                  :style="`overflow: hidden; display: -webkit-box; -webkit-line-clamp: 10; -webkit-box-orient: vertical; line-clamp: 10; white-space: pre-line; color: ${iconText};`"
              >
                {{ formData?.bio }}
              </div>
            </template>
            <template v-else>
              <div
                  :class="[
                'text-xs',
                formData?.layout === 'center' ? 'text-center' :
                formData?.layout === 'portrait' ? 'text-justify' :
                'text-justify'
              ]"
              >
              </div>
            </template>
          </div>

          <!-- دکمه ذخیره مخاطب -->
          <div
              :class="[
            'mt-5 w-full',
            formData?.layout === 'center' ? 'px-0' :
            formData?.layout === 'portrait' ? 'px-4' :
            'px-6'
          ]"
          >
            <button
                class="w-full py-3 rounded-full font-semibold text-center flex items-center justify-center gap-2"
                :style="{
              backgroundColor: iconBg,
              color: iconBg === '#ffffff' || iconBg === '#FFFFFF' ? '#000000' : '#ffffff',
              boxShadow: `0 2px 6px ${iconShadow}`
            }"
                @click="downloadVCard"
            >
              <i class="ti ti-download"/>
              {{ formData?.saveContact || 'ذخیره مخاطب' }}
            </button>
          </div>

        </div> <!-- پایان اطلاعات -->

        <!-- آیتم‌ها (لینک و بلاک با ترتیب اصلی) -->
        <!-- همه آیتم‌ها در یک container برای drag & drop -->
        <div
            :class="[
          'flex-1 flex flex-col justify-start min-h-0',
          formData?.layout === 'portrait' ? 'px-4' : 'px-2'
        ]"
        >
          <!-- نمایش لینک‌ها با layout - گروه‌بندی شده -->
          <template v-for="(group, groupIndex) in groupedItems" :key="groupIndex">
            <!-- گروه گریدی -->
            <div
              v-if="group.type === 'grid'"
              :class="[
                'auto-rows-max',
                formData?.layout === 'left' ? 'grid grid-cols-3 content-start gap-3' :
                formData?.layout === 'right' ? 'grid grid-cols-3 content-start gap-3' :
                'grid grid-cols-3 content-start gap-3'
              ]"
            >
              <component
                :is="getComponent(item)"
                v-for="item in group.items"
                :key="item.id"
                :link="item"
                :icon-bg="iconBg"
                :icon-text="iconText"
                :is-dark-theme="isDarkTheme"
                :is-light-theme="isLightTheme"
                :is-background-dark="isBackgroundDark"
                :form-data="formData"
                :slug="'newCard'"
                @message="showInfoToast($event)"
                @click="handleLinkClick(item)"
                :is-list-mode="false"
              />
            </div>
            
            <!-- گروه لیستی -->
            <div
              v-else
              :class="[
                'my-3',
                formData?.layout === 'center' ? 'flex flex-col items-center space-y-3 w-full' :
                'flex flex-col gap-3 w-full'
              ]"
            >
              <component
                :is="getComponent(item)"
                v-for="item in group.items"
                :key="item.id"
                :link="item"
                :icon-bg="iconBg"
                :icon-text="iconText"
                :is-dark-theme="isDarkTheme"
                :is-light-theme="isLightTheme"
                :is-background-dark="isBackgroundDark"
                :form-data="formData"
                :slug="'newCard'"
                @message="showInfoToast($event)"
                @click="handleLinkClick(item)"
                class="w-full"
                :is-list-mode="true"
              />
            </div>
          </template>
        </div>

        <!-- Made with Linku Footer - بهتر شده -->
        <div v-if="!formData?.removeBranding" class="flex items-center justify-center py-6 px-6">
          <div
              class="flex items-center gap-2 text-xs text-gray-500 bg-gray-100/50 px-4 py-2 rounded-full border border-gray-200/50 backdrop-blur-sm">
            <img src="/logo.svg" alt="Linku Logo" class="w-4 h-4" />
            <span class="font-medium">ساخته شده با</span>
            <span class="font-bold text-gray-700">لینکو</span>
          </div>
        </div>
      </div> <!-- پایان div اصلی -->

      <!-- Share Modal - Bottom Sheet -->
      <UiBottomSheet
          :visible="showShareModal"
          title="اشتراک‌گذاری پروفایل"
          :close-on-overlay="true"
          @close="showShareModal = false"
      >
        <!-- محتوای اشتراک‌گذاری -->
        <div class="space-y-4">
          <!-- پلتفرم‌های اشتراک‌گذاری -->
          <div class="space-y-3">
            <!-- تلگرام -->
            <button
                @click="shareToTelegram"
                class="w-full flex items-center gap-3 p-3 bg-gray-50 hover:bg-blue-50 rounded-lg transition-colors border border-gray-200 hover:border-blue-300"
            >
              <div
                  class="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                  :style="{ backgroundColor: iconBg }"
              >
                <i class="ti ti-brand-telegram text-white text-sm"></i>
              </div>
              <span class="font-medium text-gray-800 text-right flex-1">تلگرام</span>
            </button>

            <!-- واتساپ -->
            <button
                @click="shareToWhatsApp"
                class="w-full flex items-center gap-3 p-3 bg-gray-50 hover:bg-green-50 rounded-lg transition-colors border border-gray-200 hover:border-green-300"
            >
              <div
                  class="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                  :style="{ backgroundColor: iconBg }"
              >
                <i class="ti ti-brand-whatsapp text-white text-sm"></i>
              </div>
              <span class="font-medium text-gray-800 text-right flex-1">واتساپ</span>
            </button>

            <!-- اینستاگرام -->
            <button
                @click="shareToInstagram"
                class="w-full flex items-center gap-3 p-3 bg-gray-50 hover:bg-pink-50 rounded-lg transition-colors border border-gray-200 hover:border-pink-300"
            >
              <div
                  class="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                  :style="{ backgroundColor: iconBg }"
              >
                <i class="ti ti-brand-instagram text-white text-sm"></i>
              </div>
              <span class="font-medium text-gray-800 text-right flex-1">اینستاگرام</span>
            </button>

            <!-- لینکدین -->
            <button
                @click="shareToLinkedIn"
                class="w-full flex items-center gap-3 p-3 bg-gray-50 hover:bg-blue-50 rounded-lg transition-colors border border-gray-200 hover:border-blue-300"
            >
              <div
                  class="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                  :style="{ backgroundColor: iconBg }"
              >
                <i class="ti ti-brand-linkedin text-white text-sm"></i>
              </div>
              <span class="font-medium text-gray-800 text-right flex-1">لینکدین</span>
            </button>

            <!-- ایکس (توییتر) -->
            <button
                @click="shareToX"
                class="w-full flex items-center gap-3 p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors border border-gray-200 hover:border-gray-400"
            >
              <div
                  class="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                  :style="{ backgroundColor: iconBg }"
              >
                <i class="ti ti-brand-x text-white text-sm"></i>
              </div>
              <span class="font-medium text-gray-800 text-right flex-1">ایکس</span>
            </button>

            <!-- کپی لینک -->
            <button
                @click="copyLink"
                class="w-full flex items-center gap-3 p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors border border-gray-200 hover:border-gray-400"
            >
              <div
                  class="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                  :style="{ backgroundColor: iconBg }"
              >
                <i class="ti ti-copy text-white text-sm"></i>
              </div>
              <span class="font-medium text-gray-800 text-right flex-1">کپی لینک</span>
            </button>
          </div>

          <!-- دکمه انصراف -->
          <button
              @click="showShareModal = false"
              class="w-full py-3 px-4 bg-gray-200 text-gray-700 rounded-xl font-medium hover:bg-gray-300 transition-colors"
          >
            انصراف
          </button>
        </div>
      </UiBottomSheet>

      <!-- Report Modal - Bottom Sheet -->
      <UiBottomSheet
          :visible="showReportModal"
          title="گزارش محتوا"
          :close-on-overlay="true"
          @close="showReportModal = false"
      >
        <!-- محتوای فرم گزارش -->
        <div class="space-y-6">
          <!-- انتخاب نوع گزارش -->
          <div class="space-y-3">
            <h4 class="font-semibold text-gray-700">نوع گزارش:</h4>
            <div class="space-y-2">
              <label
                  class="flex items-center gap-3 p-3 bg-gray-50 rounded-xl cursor-pointer hover:bg-gray-100 transition-colors">
                <input type="radio" v-model="reportType" value="inappropriate" class="text-red-500">
                <div class="flex items-center gap-2">
                  <div
                      class="w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0"
                      :style="{ backgroundColor: iconBg }"
                  >
                    <i class="ti ti-alert-triangle text-white text-xs"></i>
                  </div>
                  <span class="text-gray-800">محتوای نامناسب</span>
                </div>
              </label>

              <label
                  class="flex items-center gap-3 p-3 bg-gray-50 rounded-xl cursor-pointer hover:bg-gray-100 transition-colors">
                <input type="radio" v-model="reportType" value="spam" class="text-orange-500">
                <div class="flex items-center gap-2">
                  <div
                      class="w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0"
                      :style="{ backgroundColor: iconBg }"
                  >
                    <i class="ti ti-mail-x text-white text-xs"></i>
                  </div>
                  <span class="text-gray-800">اسپم یا تبلیغات</span>
                </div>
              </label>

              <label
                  class="flex items-center gap-3 p-3 bg-gray-50 rounded-xl cursor-pointer hover:bg-gray-100 transition-colors">
                <input type="radio" v-model="reportType" value="fake" class="text-blue-500">
                <div class="flex items-center gap-2">
                  <div
                      class="w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0"
                      :style="{ backgroundColor: iconBg }"
                  >
                    <i class="ti ti-user-x text-white text-xs"></i>
                  </div>
                  <span class="text-gray-800">هویت جعلی</span>
                </div>
              </label>

              <label
                  class="flex items-center gap-3 p-3 bg-gray-50 rounded-xl cursor-pointer hover:bg-gray-100 transition-colors">
                <input type="radio" v-model="reportType" value="other" class="text-gray-500">
                <div class="flex items-center gap-2">
                  <div
                      class="w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0"
                      :style="{ backgroundColor: iconBg }"
                  >
                    <i class="ti ti-dots text-white text-xs"></i>
                  </div>
                  <span class="text-gray-800">سایر موارد</span>
                </div>
              </label>
            </div>
          </div>

          <!-- توضیحات -->
          <div class="space-y-3">
            <h4 class="font-semibold text-gray-700">توضیحات (اختیاری):</h4>
            <textarea
                v-model="reportDescription"
                placeholder="لطفاً توضیحات بیشتری در مورد گزارش خود ارائه دهید..."
                class="w-full p-4 border border-gray-200 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows="4"
            ></textarea>
          </div>

          <!-- دکمه‌های عملیات -->
          <div class="flex gap-3 pt-4 border-t border-gray-200">
            <button
                @click="showReportModal = false"
                class="flex-1 py-3 px-4 bg-gray-200 text-gray-700 rounded-xl font-medium hover:bg-gray-300 transition-colors"
            >
              انصراف
            </button>
            <button
                @click="submitReport"
                :disabled="!reportType"
                class="flex-1 py-3 px-4 rounded-xl font-medium transition-colors text-white hover:opacity-90"
                :class="{ 'bg-gray-300 !text-gray-500 cursor-not-allowed': !reportType }"
                :style="reportType ? { backgroundColor: iconBg } : { backgroundColor: '#d1d5db' }"
            >
              ارسال گزارش
            </button>
          </div>

          <p class="text-xs text-gray-500 text-center">
            گزارش شما محرمانه بررسی و اقدام لازم انجام خواهد شد
          </p>
        </div>
      </UiBottomSheet>

      <!-- Lead Capture Modal -->
      <div
          v-if="formData?.isLeadCaptureEnabled"
          class="fixed inset-0 bg-white/70 bg-opacity-50 z-50 w-full p-4 backdrop-blur-[1px]"
          style="display: grid; place-items: center;"
      >
        <LayoutLeadForm class="w-full" @close="closeLeadCapture" :cardId="null" :slug="'newCard'" :isDefault="true"/>
      </div>
      <!-- Toast Notifications -->
      <!-- Toast container is handled by useToast composable -->
    </div>
  </div>
  <!-- 🟢 Splash Screen -->
  <template v-else>
    <transition name="fade">
      <div
          class="fixed inset-0 flex items-center justify-center bg-white z-50"
      >
        <!-- لودر دایره چرخان -->
        <div class="flex flex-col items-center gap-4">
          <div class="w-10 h-10 border-3 border-gray-200 border-t-blue-600 rounded-full animate-spin"></div>
          <p class="text-sm text-gray-500">در حال بارگذاری</p>
        </div>
      </div>
    </transition>
  </template>
</template>

<script setup>
import {computed, markRaw, onMounted, onUnmounted, ref} from 'vue'
import {useFormStore} from '~/stores/form';
import {useToast} from '~/composables/useToast';
import * as PreviewItems from '~/components/UserDashboard/main/EditCard/Preview/items';
import LayoutLeadForm from '~/components/UserDashboard/main/EditCard/Preview/layouts/LayoutLeadForm.vue';
import LayoutSingle from '~/components/UserDashboard/main/EditCard/Preview/layouts/LayoutSingle.vue';
import UiBottomSheet from '~/components/ui/BottomSheet.vue';
import InfoToast from "~/components/UserDashboard/modals/InfoToast.vue";

// ⚠️ SSR غیرفعال - این صفحه فقط در client اجرا می‌شود
definePageMeta({
  layout: 'preview',
  ssr: false
})

const showToast = ref(false)
const toastMessage = ref('')
const toastIcon = ref('ti-alert-triangle')

const showInfoToast = (message, icon = 'ti-lock') => {
  toastMessage.value = message
  toastIcon.value = icon
  showToast.value = true
  setTimeout(() => showToast.value = false, 3000)
}

const isLoading = ref(true)
const formData = useFormStore();
const route = useRoute();

const enableBlueTick = ref(false)
const {success, error, info} = useToast();

// Report Modal State
const showReportModal = ref(false)
const showOptionsMenu = ref(false)
const showShareModal = ref(false)
const reportType = ref('')
const reportDescription = ref('')

// Handle share button click
const handleShareClick = (event) => {
  event?.stopPropagation()
  showShareModal.value = true
  showOptionsMenu.value = false
}

// Handle report button click
const handleReportClick = (event) => {
  event?.stopPropagation()
  showReportModal.value = true
  showOptionsMenu.value = false
}

// Computed properties for theme colors
const isDarkTheme = computed(() => {
  const bg = formData?.themeColor?.background
  if (!bg) return false // پیش‌فرض: روشن
  return bg === '#000000' || bg === '#000' || bg === 'rgb(0, 0, 0)'
})

const iconColor = computed(() => {
  return formData?.themeColor?.background || '#3b82f6'
})

const isWhiteTheme = computed(() => {
  const bg = formData?.themeColor?.background
  // اگر رنگی تنظیم نشده، پیش‌فرض سفید هست
  if (!bg) return true
  return bg === '#ffffff' || bg === '#fff' || bg === 'rgb(255, 255, 255)' || bg === '#FFFFFF'
})

const iconText = computed(() => {
  // برای تم تاریک (مشکی) متن سفید
  if (isDarkTheme.value) {
    return '#ffffff'
  }
  // برای تم سفید یا بدون رنگ (پیش‌فرض) یا رنگ‌های روشن، متن مشکی
  if (isWhiteTheme.value || !formData?.themeColor?.background || isLightColor(formData?.themeColor?.background)) {
    return '#000000'
  }
  // برای رنگ‌های تیره، متن سفید
  return '#ffffff'
})

const iconBg = computed(() => {
  if (isDarkTheme.value) {
    return '#ffffff'
  }
  // اگر رنگی نیست، آبی پیش‌فرض
  return formData?.themeColor?.background || '#3b82f6'
})

const isLightTheme = computed(() => {
  return isWhiteTheme.value
})

const isBackgroundDark = computed(() => {
  return isDarkTheme.value
})

const backgroundWithOpacity = computed(() => {
  if (isDarkTheme.value) {
    return '#000000'
  }
  // اگر رنگی تنظیم نشده یا سفید هست، سفید برگردون
  if (isWhiteTheme.value || !formData?.themeColor?.background) {
    return '#ffffff'
  }
  return getLighterColor(iconColor.value, 0.7)
})

const getLighterColor = (color, amount = 0.7) => {
  if (!color) return '#ffffff'
  color = color.replace('#', '')
  let r = parseInt(color.substring(0, 2), 16)
  let g = parseInt(color.substring(2, 4), 16)
  let b = parseInt(color.substring(4, 6), 16)
  r = Math.round(r + (255 - r) * amount)
  g = Math.round(g + (255 - g) * amount)
  b = Math.round(b + (255 - b) * amount)
  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`
}

const isLightColor = (color) => {
  if (!color) return false
  color = color.replace('#', '')
  const r = parseInt(color.substring(0, 2), 16)
  const g = parseInt(color.substring(2, 4), 16)
  const b = parseInt(color.substring(4, 6), 16)
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255
  return luminance > 0.6
}

const iconShadow = computed(() => {
  const rgba = hexToRgba(iconBg.value, 0.4);
  return rgba;
});

function hexToRgba(hex, alpha) {
  if (!hex || hex === 'transparent') return `rgba(0, 0, 0, ${alpha})`;
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

// دریافت پیام‌ها از parent window (AddCard)
const handleMessage = (event) => {
  // بررسی امنیت origin
  if (event.origin !== window.location.origin) return

  if (event.data?.type === 'FORM_DATA_UPDATE' && event.data?.data) {
    const newData = event.data.data

    // به‌روزرسانی مستقیم فیلدهای store
    if (newData.name !== undefined) formData.name = newData.name
    if (newData.job !== undefined) formData.job = newData.job
    if (newData.company !== undefined) formData.company = newData.company
    if (newData.location !== undefined) formData.location = newData.location
    if (newData.bio !== undefined) formData.bio = newData.bio
    if (newData.profileImage !== undefined) formData.profileImage = newData.profileImage
    if (newData.logoImage !== undefined) formData.logoImage = newData.logoImage
    if (newData.coverImage !== undefined) formData.coverImage = newData.coverImage
    if (newData.layout !== undefined) formData.layout = newData.layout
    if (newData.themeColor !== undefined) formData.themeColor = newData.themeColor
    if (newData.iconColor !== undefined) formData.iconColor = newData.iconColor
    if (newData.links !== undefined) formData.links = newData.links
    if (newData.fields !== undefined) formData.fields = newData.fields
    if (newData.formTitle !== undefined) formData.formTitle = newData.formTitle
    if (newData.connectButtonText !== undefined) formData.connectButtonText = newData.connectButtonText
    if (newData.formDisclaimer !== undefined) formData.formDisclaimer = newData.formDisclaimer
    if (newData.singleLink !== undefined) formData.singleLink = newData.singleLink
    if (newData.isLeadCaptureEnabled !== undefined) formData.isLeadCaptureEnabled = newData.isLeadCaptureEnabled
    if (newData.saveContact !== undefined) formData.saveContact = newData.saveContact
    if (newData.removeBranding !== undefined) formData.removeBranding = newData.removeBranding
  }
}

// Close options menu when clicking outside
const handleClickOutside = (e) => {
  if (showOptionsMenu.value) {
    const menuButton = e.target.closest('button[class*="ti-dots-vertical"]')?.parentElement
    const menuDropdown = e.target.closest('.absolute.top-12')

    if (!menuButton && !menuDropdown) {
      showOptionsMenu.value = false
    }
  }

  if (showShareModal.value) {
    const shareModal = e.target.closest('[data-modal="share"]')
    if (!shareModal) {
      showShareModal.value = false
    }
  }

  if (showReportModal.value) {
    const reportModal = e.target.closest('[data-modal="report"]')
    if (!reportModal) {
      showReportModal.value = false
    }
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
  
  // گوش دادن به پیام‌های postMessage
  window.addEventListener('message', handleMessage)

  // بررسی اینکه آیا در iframe هستیم
  const isInIframe = window !== window.parent

  if (isInIframe) {
    // اطلاع دادن به parent که آماده‌ایم
    setTimeout(() => {
      try {
        window.parent.postMessage({
          type: 'IFRAME_READY'
        }, window.location.origin)
      } catch {
        // خطا در ارسال پیام - نادیده گرفته می‌شود
      }
    }, 100)
  }

  // بلافاصله لود را تمام کن چون این صفحه برای پیش‌نمایش کارت جدید است
  isLoading.value = false
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
  window.removeEventListener('message', handleMessage)
})

// Method to close lead capture
const closeLeadCapture = () => {
  formData.isLeadCaptureEnabled = false
}

const handleLinkClick = async (item) => {
  // برای پیش‌نمایش، کلیک‌ها ثبت نمی‌شوند
}

function getComponent(item) {
  try {
    if (!item) return markRaw('div')

    if (item.action) {
      const actionLower = item.action.toLowerCase()
      
      if (PreviewItems[actionLower]) {
        return markRaw(PreviewItems[actionLower])
      }
    }

    return markRaw(item.type === 'block' ? PreviewItems.basicblock : PreviewItems.basiclink)
  } catch {
    return markRaw('div')
  }
}

function getIsListMode(item) {
  const isPortrait = formData?.layout === 'portrait'
  const isSpecialAction = ['poll', 'expandabletext', 'questionbox', 'textsection', 'workhours', 'map', 'file', 'embeddedvideo', 'image', 'video', 'audio', 'document'].includes(item.action)
  const hasDescriptionEnabled = item.showDescription === true
  
  return !!(isPortrait || isSpecialAction || hasDescriptionEnabled)
}

const groupedItems = computed(() => {
  if (!formData?.links) return []
  
  if (formData?.layout === 'portrait' || formData?.layout === 'center') {
    return [{ type: 'list', items: formData.links.filter(item => item.enabled) }]
  }
  
  const groups = []
  let currentGroup = null
  
  formData.links.forEach(item => {
    if (!item.enabled) return
    
    const isListItem = getIsListMode(item)
    
    if (!currentGroup || currentGroup.type !== (isListItem ? 'list' : 'grid')) {
      currentGroup = { type: isListItem ? 'list' : 'grid', items: [] }
      groups.push(currentGroup)
    }
    
    currentGroup.items.push(item)
  })
  
  return groups
})

// تولید فایل vCard برای دانلود مخاطب
function downloadVCard() {
  if (downloadVCard._isRunning) {
    return
  }
  downloadVCard._isRunning = true

  try {
    const vCardData = generateVCardData()

    const isInIframe = window !== window.parent
    const userAgent = navigator.userAgent.toLowerCase()
    const isIOS = /iphone|ipad|ipod/.test(userAgent)
    const isAndroid = /android/.test(userAgent)
    const isMobile = isIOS || isAndroid

    const safeName = (formData?.name || 'contact').replace(/[^a-zA-Z0-9\u0600-\u06FF]/g, '_')
    const fileName = `${safeName}.vcf`

    if (isInIframe) {
      try {
        window.parent.postMessage({
          type: 'DOWNLOAD_VCARD',
          data: {
            vCardData: vCardData,
            fileName: fileName,
            isIOS: isIOS,
            isAndroid: isAndroid
          }
        }, window.location.origin)

      } catch {
        useDirectMethod()
      }
    } else {
      useDirectMethod()
    }

    async function useDirectMethod() {
      if (isMobile && navigator.share) {
        try {
          const blob = new Blob([vCardData], { type: 'text/vcard;charset=utf-8' })
          const file = new File([blob], fileName, { type: 'text/vcard' })
          await navigator.share({
            files: [file],
            title: formData?.name || 'Contact',
            text: `اطلاعات تماس ${formData?.name || ''}`
          })
          return
        } catch (shareError) {
          console.log('Share cancelled or failed, falling back to download')
        }
      }

      if (isMobile) {
        try {
          const dataUri = `data:text/vcard;charset=utf-8,${encodeURIComponent(vCardData)}`
          const link = document.createElement('a')

          link.href = dataUri
          link.download = fileName
          link.style.display = 'none'
          link.target = '_blank'

          document.body.appendChild(link)
          link.click()
          document.body.removeChild(link)

        } catch {
          useBlobMethod()
        }
      } else {
        useBlobMethod()
      }
    }

    function useBlobMethod() {
      const mimeType = isMobile ? 'text/x-vcard' : 'text/vcard'
      const blob = new Blob([vCardData], {
        type: `${mimeType};charset=utf-8`
      })

      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')

      link.href = url
      link.download = fileName
      link.style.display = 'none'
      link.target = '_blank'

      document.body.appendChild(link)

      try {
        link.click()
      } catch {
        window.open(url, '_blank')
      }

      document.body.removeChild(link)

      setTimeout(() => {
        URL.revokeObjectURL(url)
      }, 2000)
    }

  } catch {
    alert(`خطا در ایجاد فایل مخاطب`)
  } finally {
    setTimeout(() => {
      downloadVCard._isRunning = false
    }, 1000)
  }
}

function generateVCardData() {
  let vcard = 'BEGIN:VCARD\r\n'
  vcard += 'VERSION:3.0\r\n'

  let nameToUse = 'مخاطب تستی'

  if (formData?.name && typeof formData.name === 'string' && formData.name.trim()) {
    nameToUse = formData.name.trim()
  }

  vcard += `FN:${nameToUse}\r\n`
  vcard += `N:${nameToUse};;;;\r\n`

  if (formData?.job && typeof formData.job === 'string' && formData.job.trim()) {
    vcard += `TITLE:${formData.job.trim()}\r\n`
  }

  if (formData?.company && typeof formData.company === 'string' && formData.company.trim()) {
    vcard += `ORG:${formData.company.trim()}\r\n`
  }

  if (formData?.location && typeof formData.location === 'string' && formData.location.trim()) {
    vcard += `ADR:;;${formData.location.trim()};;;;\r\n`
  }

  if (formData?.bio && typeof formData.bio === 'string' && formData.bio.trim()) {
    vcard += `NOTE:${formData.bio.replace(/\r?\n/g, ' ').trim()}\r\n`
  }

  if (typeof window !== 'undefined' && window.location.href) {
    vcard += `URL:${window.location.href}\r\n`
  }

  vcard += 'END:VCARD\r\n'

  return vcard
}

// Share Modal Functions
const shareToTelegram = () => {
  const text = `پروفایل ${formData?.name || 'کاربر'} را در لینکو مشاهده کنید: ${window.location.href}`
  const url = `https://t.me/share/url?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent(text)}`
  window.open(url, '_blank')
  showShareModal.value = false
  success('هدایت به تلگرام...')
}

const shareToWhatsApp = () => {
  const text = `پروفایل ${formData?.name || 'کاربر'} را در لینکو مشاهده کنید: ${window.location.href}`
  const url = `https://wa.me/?text=${encodeURIComponent(text)}`
  window.open(url, '_blank')
  showShareModal.value = false
  success('هدایت به واتساپ...')
}

const shareToInstagram = () => {
  copyLink()
  info('لینک کپی شد - در اینستاگرام paste کنید')
}

const shareToLinkedIn = () => {
  const url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}`
  window.open(url, '_blank')
  showShareModal.value = false
  success('هدایت به لینکدین...')
}

const shareToX = () => {
  const text = `پروفایل ${formData?.name || 'کاربر'} را در لینکو مشاهده کنید`
  const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(window.location.href)}`
  window.open(url, '_blank')
  showShareModal.value = false
  success('هدایت به ایکس...')
}

const copyLink = async () => {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(window.location.href)
      showShareModal.value = false
      return
    }

    const textArea = document.createElement('textarea')
    textArea.value = window.location.href
    textArea.style.position = 'fixed'
    textArea.style.left = '-999999px'
    textArea.style.top = '-999999px'
    document.body.appendChild(textArea)
    textArea.focus()
    textArea.select()

    const successful = document.execCommand('copy')
    document.body.removeChild(textArea)

    if (successful) {
      showShareModal.value = false
    }
  } catch (error) {
    showShareModal.value = false
  }
}

const submitReport = () => {
  if (!reportType.value) {
    error('لطفاً نوع گزارش را انتخاب کنید')
    return
  }

  success('گزارش شما با موفقیت ارسال شد')

  showReportModal.value = false
  reportType.value = ''
  reportDescription.value = ''
}
</script>

<style scoped>
/* Hide scrollbar while keeping functionality */
.scrollbar-hide {
  -ms-overflow-style: none; /* IE and Edge */
  scrollbar-width: none; /* Firefox */
}

.scrollbar-hide::-webkit-scrollbar {
  display: none; /* Safari and Chrome */
}

/* Disable touch interactions for disabled/opacity elements */
:disabled,
[aria-disabled="true"],
.opacity-50,
[style*="opacity: 0.5"],
[style*="opacity:0.5"] {
  touch-action: none !important;
  user-select: none !important;
  -webkit-touch-callout: none !important;
  -webkit-user-select: none !important;
  -moz-user-select: none !important;
  -ms-user-select: none !important;
}

/* اما دکمه‌های داخلی باید کار کنند */
.opacity-50 button,
.opacity-50 label,
[style*="opacity: 0.5"] button,
[style*="opacity: 0.5"] label,
[style*="opacity:0.5"] button,
[style*="opacity:0.5"] label {
  touch-action: auto !important;
  user-select: auto !important;
  -webkit-touch-callout: auto !important;
  -webkit-user-select: auto !important;
  -moz-user-select: auto !important;
  -ms-user-select: auto !important;
  pointer-events: auto !important;
}

/* Tailwind doesn't have slow spin by default، پس اضافه می‌کنیم */
@keyframes spin-slow {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
.animate-spin-slow {
  animation: spin-slow 2s linear infinite;
}
</style>
