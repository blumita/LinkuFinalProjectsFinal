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
                class="w-10 h-10 bg-white backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-gray-50 transition-all duration-300 shadow-lg border border-gray-200/50 text-gray-800"
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
                formData.layout === 'left' ? 'text-2xl justify-start gap-3' :
                'text-2xl justify-start gap-3' // default
              ]"
                  :style="{ color: iconText }"
              >
                <!-- لوگو کوچک شرکت در حالت پورتریت - سمت چپ -->
                <div
                    v-if="formData.layout === 'portrait'"
                    class="w-12 h-12 rounded-full shadow-md border border-gray-200 overflow-hidden bg-white flex-shrink-0 order-2"
                >
                  <template v-if="formData.logoImage">
                    <img :src="formData.logoImage" class="w-full h-full object-cover">
                  </template>
                </div>
                <div class="flex items-center gap-2" :class="formData.layout === 'portrait' ? 'order-1' : ''">

                </div>
              </div>
            </template>

            <template v-if="formData.job">
              <div
                  :class="[
                'text-base font-medium flex items-center gap-1',
                formData.layout === 'center' ? 'justify-center' :
                formData.layout === 'portrait' ? 'justify-start' :
                formData.layout === 'left' ? 'justify-start' :
                'justify-start' // default
              ]"
                  :style="{ color: iconText }"
              >
                <i class="ti ti-briefcase text-sm" :style="{ color: iconColor }"/>
                {{ formData.job }}
              </div>
            </template>
            <div
                v-else
                :class="[
              'text-sm mt-4 flex items-center gap-1',
              formData.layout === 'center' ? 'justify-center' :
              formData.layout === 'portrait' ? 'justify-start' :
              formData.layout === 'left' ? 'justify-start' :
              'justify-start' // default
            ]"
            >
            </div>

            <template v-if="formData.company">
              <div
                  :class="[
                'text-base font-medium flex items-center gap-1',
                formData.layout === 'center' ? 'justify-center' :
                formData.layout === 'portrait' ? 'justify-start' :
                formData.layout === 'left' ? 'justify-start' :
                'justify-start' // default
              ]"
                  :style="{ color: iconText }"
              >
                <i class="ti ti-building text-sm" :style="{ color: iconText }"/>
                {{ formData.company }}
              </div>
            </template>
            <div
                v-else
                :class="[
              'text-sm flex items-center gap-1',
              formData.layout === 'center' ? 'justify-center' :
              formData.layout === 'portrait' ? 'justify-start' :
              formData.layout === 'left' ? 'justify-start' :
              'justify-start' // default
            ]"
            >
            </div>

            <template v-if="formData?.location">
              <div
                  :class="[
                'text-base font-medium flex items-center gap-1',
                formData.layout === 'center' ? 'justify-center' :
                formData.layout === 'portrait' ? 'justify-start' :
                formData.layout === 'left' ? 'justify-start' :
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
              formData.layout === 'center' ? 'justify-center' :
              formData.layout === 'portrait' ? 'justify-start' :
              formData.layout === 'left' ? 'justify-start' :
              'justify-start' // default
            ]"
            >
            </div>

            <template v-if="formData.bio">
              <div
                  :class="[
                'text-xs leading-relaxed break-words',
                formData.layout === 'center' ? 'text-center' :
                formData.layout === 'portrait' ? 'text-justify' :
                'text-justify'
              ]"
                  :style="`overflow: hidden; display: -webkit-box; -webkit-line-clamp: 10; -webkit-box-orient: vertical; line-clamp: 10; white-space: pre-line; color: ${iconText};`"
              >
                {{ formData.bio }}
              </div>
            </template>
            <template v-else>
              <div
                  :class="[
                'text-xs',
                formData.layout === 'center' ? 'text-center' :
                formData.layout === 'portrait' ? 'text-justify' :
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
            formData.layout === 'center' ? 'px-0' :
            formData.layout === 'portrait' ? 'px-4' :
            'px-6'
          ]"
          >
            <template v-if="formData.saveContact">
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
                {{ formData.saveContact }}
              </button>
            </template>
            <button
                v-else
                disabled
                class="w-full py-3 rounded-full text-center font-bold text-gray-400 bg-gray-200 flex items-center justify-center gap-2 cursor-not-allowed"
            >
              <!-- آیکون placeholder -->
              <div class="w-5 h-5 bg-gray-300 rounded-full animate-pulse"></div>

              <!-- متن placeholder -->
              <div class="h-4 w-32 bg-gray-300 rounded animate-pulse"></div>
            </button>
          </div>

        </div> <!-- پایان اطلاعات -->

        <!-- آیتم‌ها (لینک و بلاک با ترتیب اصلی) -->
        <!-- همه آیتم‌ها در یک container برای drag & drop -->
        <div
            :class="[
          'flex-1 flex flex-col justify-start min-h-0',
          formData.layout === 'portrait' ? 'px-4' : 'px-2'
        ]"
        >
          <!-- نمایش لینک‌ها با layout - گروه‌بندی شده -->
          <template v-for="(group, groupIndex) in groupedItems" :key="groupIndex">
            <!-- گروه گریدی -->
            <div
              v-if="group.type === 'grid'"
              :class="[
                'auto-rows-max',
                formData.layout === 'left' ? 'grid grid-cols-3 content-start gap-3' :
                formData.layout === 'right' ? 'grid grid-cols-3 content-start gap-3' :
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
                :slug="slug"
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
                formData.layout === 'center' ? 'flex flex-col items-center space-y-3 w-full' :
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
                :slug="slug"
                @message="showInfoToast($event)"
                @click="handleLinkClick(item)"
                class="w-full"
                :is-list-mode="true"
              />
            </div>
          </template>
        </div>

        <!-- Made with Linku Footer - بهتر شده -->
        <div v-if="!formData.removeBranding" class="flex items-center justify-center py-6 px-6">
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
        <div class="px-6 pb-6 space-y-4">
          <!-- انتخاب نوع گزارش -->
          <div class="space-y-3">
            <h4 class="font-semibold text-gray-800 text-sm">نوع گزارش:</h4>
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
            <h4 class="font-semibold text-gray-800 text-sm">توضیحات (اختیاری):</h4>
            <textarea
                v-model="reportDescription"
                placeholder="لطفاً توضیحات بیشتری در مورد گزارش خود ارائه دهید..."
                class="w-full p-4 border border-gray-200 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows="4"
            ></textarea>
          </div>

          <!-- دکمه‌های عملیات -->
          <div class="flex gap-3 pt-2">
            <button
                @click="showReportModal = false"
                class="flex-1 py-3 px-4 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-colors"
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

          <p class="text-xs text-gray-400 text-center">
            گزارش شما محرمانه بررسی و اقدام لازم انجام خواهد شد
          </p>
        </div>
      </UiBottomSheet>

      <!-- Lead Capture Modal -->
      <div
          v-if="formData.isLeadCaptureEnabled"
          class="fixed inset-0 bg-white/70 bg-opacity-50 z-50 w-full p-4 backdrop-blur-[1px]"
          style="display: grid; place-items: center;"
      >
        <LayoutLeadForm class="w-full" @close="closeLeadCapture" :cardId="cardId" :slug="slug" :isDefault="isDefault"/>
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
import {useAsyncData, useNuxtApp} from "nuxt/app";
import InfoToast from "~/components/UserDashboard/modals/InfoToast.vue";
import SkeletonProfile from "~/components/ui/SkeletonProfile.vue";
const showToast = ref(false)
const toastMessage = ref('')
const toastIcon = ref('ti-alert-triangle') // یا 'ti-lock', 'ti-check', هر چی خواستی
const showInfoToast = (message, icon = 'ti-lock') => {
  toastMessage.value = message
  toastIcon.value = icon
  showToast.value = true
  setTimeout(() => showToast.value = false, 3000) // بعد از ۳ ثانیه بسته می‌شه
}
// SEO and Meta Configuration
const isLoading = ref(true)
const formData = useFormStore();
const route = useRoute();
//const urlParams = new URLSearchParams(window.location.search)
//const cardId = urlParams.get('cardId')
//const isDefault = urlParams.get('isDefault')
// گرفتن query ها
const cardId = route.query.cardId
const slug = route.params.slug
const isDefault = route.query.isDefault
const isNewCardPreview = slug === 'newCard' // برای پیش‌نمایش کارت جدید
// Generate dynamic meta tags based on form data
const {$axios} = useNuxtApp()
const runtimeConfig = useRuntimeConfig()

// استفاده از متغیر محیطی برای آدرس API
const apiBase = runtimeConfig.public.apiBase || 'https://api.linku.im'
const urlPrefix = `${apiBase}/api/cards`

// ✅ واکشی اطلاعات کارت - فقط اگر کارت جدید نباشد
const { data: card } = await useAsyncData('card', async () => {
  // برای پیش‌نمایش کارت جدید از API نمی‌خونیم
  if (isNewCardPreview) {
    return { data: null }
  }
  return await $fetch(`${urlPrefix}/${slug}/preview`, {method: 'GET'})
})

// ✅ Listen for form data updates from parent (EditCard iframe)
if (process.client) {
  const handleMessage = (event) => {
    // بررسی origin برای امنیت
    if (event.origin !== window.location.origin) return
    
    if (event.data?.type === 'FORM_DATA_UPDATE' && event.data?.data) {
      // به‌روزرسانی formData با داده‌های دریافتی از iframe parent
      const newData = event.data.data
      Object.keys(newData).forEach(key => {
        if (formData[key] !== undefined) {
          formData[key] = newData[key]
        }
      })
      isLoading.value = false
    }
  }
  
  window.addEventListener('message', handleMessage)
  
  onUnmounted(() => {
    window.removeEventListener('message', handleMessage)
  })
  
  // اگر در حالت preview هستیم، اطلاع دهیم که آماده دریافت داده هستیم
  setTimeout(() => {
    if (window.parent !== window) {
      window.parent.postMessage({ type: 'IFRAME_READY' }, window.location.origin)
    }
    isLoading.value = false
  }, 100)
}

const generateMetaTags = () => {
  const data = card.value?.data || {}

  const title = data.userName
      ? `${data.userName} - پروفایل لینکو`
      : 'پروفایل شخصی - لینکو'

  /*const description = data.bio ||
      `پروفایل ${data.name || 'کاربر'} در لینکو. ${data.job || 'متخصص'} در ${data.company || 'شرکت'}. تمام لینک‌های مهم در یک مکان.`
*/
  const description = data.bio
  let image = data.avatar || 'https://linku.im/logo/logo.png'
  // تبدیل آدرس API به آدرس عمومی برای تصاویر
  if (image.startsWith('http://localhost:8000')) {
    image = image.replace('http://localhost:8000', 'https://linku.im')
  } else if (image.startsWith('https://api.linku.im')) {
    image = image.replace('https://api.linku.im', 'https://linku.im')
  }

  const themeColor = data.themeColor || ''
  const location = data.location || ''
  const url = `https://linku.im${route.fullPath}`

  return { title, description, image, location, themeColor, url }
}


const metaTags = computed(() => generateMetaTags());
watch(card, (val) => {
  if (val?.data) {
  }
})

// SEO Meta Tags
useSeoMeta({
  title: () => metaTags.value.title,
  ogTitle: () => metaTags.value.title,
  description: () => metaTags.value.description,
  ogDescription: () => metaTags.value.description,
  ogImage: () => `${metaTags.value.image || 'https://linku.im/logo/logo.png'}`,
  ogUrl: () => metaTags.value.url,
  ogType: 'profile',
  ogSiteName: 'لینکو - Linku.im',
  twitterCard: 'summary_large_image',
  twitterTitle: () => metaTags.value.title,
  twitterDescription: () => metaTags.value.description,
  twitterImage: () => `${metaTags.value.image || 'https://linku.im/logo/logo.png'}`,
  twitterCreator: '@linku.im',
  twitterSite: '@linku.im',
  robots: 'index, follow',
  googlebot: 'index, follow',
  author: () => metaTags.value.title || 'linku.im User',
  creator: () => metaTags.value.title || 'linku.im User',
  publisher: 'linku.im',
  applicationName: 'linku.im',
  referrer: 'origin-when-cross-origin',
  formatDetection: 'telephone=no',
  viewport: 'width=device-width, initial-scale=1, maximum-scale=5',
  colorScheme: 'light dark',
  themeColor: () => metaTags.value.themeColor?.background || '#000000',
});
// Additional Head Tags
useHead({
  htmlAttrs: {
    lang: 'fa',
    dir: 'rtl'
  },
  meta: [
    {name: 'geo.region', content: 'IR'},
    {name: 'geo.country', content: 'Iran'},
    {name: 'geo.placename', content: () => formData?.location || 'تهران'},
    {name: 'ICBM', content: '35.6892,51.3890'},
    {name: 'msapplication-TileColor', content: () => metaTags.value.themeColor?.background || '#000000'},
    {name: 'apple-mobile-web-app-capable', content: 'yes'},
    {name: 'apple-mobile-web-app-status-bar-style', content: 'default'},
    {name: 'apple-mobile-web-app-title', content: () => metaTags.value.title},
    {name: 'mobile-web-app-capable', content: 'yes'},
    {name: 'HandheldFriendly', content: 'true'},
    {name: 'MobileOptimized', content: '320'},
    {name: 'rating', content: 'general'},
    {name: 'distribution', content: 'global'},
    {name: 'coverage', content: 'worldwide'},
    {name: 'target', content: 'all'},
    {name: 'audience', content: 'all'},
    {name: 'revisit-after', content: '7 days'},
    {name: 'owner', content: () => metaTags.value.name || 'linku.im User'},
    {name: 'url', content: () => metaTags.value.url},
    {name: 'identifier-URL', content: () => metaTags.value.url},
    {name: 'directory', content: 'submission'},
    {name: 'category', content: 'business'},
    {name: 'coverage', content: 'worldwide'},
    {name: 'distribution', content: 'global'},
    {name: 'rating', content: 'general'},
    {name: 'spiders', content: 'all'},
    {name: 'robots', content: 'all'},
    {name: 'googlebot', content: 'all'},
    {name: 'bingbot', content: 'all'},
    {name: 'slurp', content: 'all'},
    {name: 'msnbot', content: 'all'},
    // LinkedIn specific
    {property: 'profile:first_name', content: () => metaTags.value.name?.split(' ')[0] || ''},
    {property: 'profile:last_name', content: () => metaTags.value.name?.split(' ').slice(1).join(' ') || ''},
    {property: 'profile:username', content: () => metaTags.value.name?.toLowerCase().replace(/\s+/g, '') || 'user'},
    // Article meta for better SEO
    {property: 'article:author', content: () => metaTags.value.name || 'linku.im User'},
    {property: 'article:publisher', content: 'https://www.facebook.com/linku.im'},
    {property: 'article:section', content: 'Profile'},
    {property: 'article:tag', content: 'profile, business card, links, social media'},
    // Facebook App ID
    {property: 'fb:app_id', content: '123456789'}, // Replace with your actual Facebook App ID
    // Additional OG properties
    {property: 'og:locale', content: 'fa_IR'},
    {property: 'og:locale:alternate', content: 'en_US'},
    {property: 'business:contact_data:street_address', content: () => metaTags.value?.location || ''},
    {property: 'business:contact_data:locality', content: 'تهران'},
    {property: 'business:contact_data:region', content: 'تهران'},
    {property: 'business:contact_data:postal_code', content: '1234567890'},
    {property: 'business:contact_data:country_name', content: 'ایران'},
  ],
  link: [
    {rel: 'canonical', href: () => metaTags.value.url},
    {rel: 'alternate', hreflang: 'fa', href: () => metaTags.value.url},
    {rel: 'alternate', hreflang: 'en', href: () => metaTags.value.url.replace('/fa/', '/en/')},
    {rel: 'alternate', hreflang: 'x-default', href: () => metaTags.value.url},
    {rel: 'author', href: () => metaTags.value.url},
    {rel: 'publisher', href: 'https://linku.im'},
    {rel: 'me', href: () => metaTags.value.url},
    {rel: 'bookmark', href: () => metaTags.value.url},
    {rel: 'shortlink', href: () => metaTags.value.url},
    // Profile image preload
    {rel: 'preload', as: 'image', href: () => `${metaTags.value.image || 'https://linku.im/logo/logo.png'}`},
    // DNS prefetch for performance
    {rel: 'dns-prefetch', href: '//fonts.googleapis.com'},
    {rel: 'dns-prefetch', href: '//cdn.jsdelivr.net'},
    {rel: 'preconnect', href: 'https://fonts.googleapis.com'},
    {rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: 'anonymous'},
  ],
  // script: [
  //   {
  //     type: 'application/ld+json',
  //     children: () => JSON.stringify(generateStructuredData())
  //   }
  // ]
});
// Generate Structured Data (JSON-LD) - DISABLED TEMPORARILY
/*
const generateStructuredData_DISABLED = () => {
  return {};
  const baseUrl = 'https://linku.im';
  const profileUrl = `${baseUrl}${route.fullPath}`;
  const person = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    '@id': profileUrl,
    'name': formData.name || 'linku.im User',
    'url': profileUrl,
    'image': formData.profileImage || `${baseUrl}/images/default-profile.jpg`,
    'sameAs': [],
    'worksFor': formData.company ? {
      '@type': 'Organization',
      'name': formData.company,
      'logo': formData.logoImage || `${baseUrl}/images/default-logo.jpg`
    } : undefined,
    'jobTitle': formData.job || 'Professional',
    'description': formData.bio || `پروفایل ${formData.name || 'کاربر'} در لینکو`,
    'address': formData.location ? {
      '@type': 'PostalAddress',
      'addressLocality': formData.location,
      'addressCountry': 'IR'
    } : undefined,
    'contactPoint': []
  };

  // Add social media links to sameAs
  if (formData.links && Array.isArray(formData.links)) {
    formData.links
      .filter(link => link.enabled && link.value)
      .forEach(link => {
        switch (link.action) {
          case 'instagram':
          case 'twitter':
          case 'linkedin':
          case 'facebook':
          case 'youtube':
          case 'website':
            person.sameAs.push(link.value);
            break;
          case 'phone':
          case 'call':
            person.contactPoint.push({
              '@type': 'ContactPoint',
              'telephone': link.value,
              'contactType': 'customer service'
            });
            break;
          case 'email':
            person.contactPoint.push({
              '@type': 'ContactPoint',
              'email': link.value,
              'contactType': 'customer service'
            });
            break;
        }
      });
  }

  // Organization Schema
  const organization = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    'name': 'لینکو - linku.im',
    'url': baseUrl,
    'logo': `${baseUrl}/logo/logo.png`,
    'sameAs': [
      'https://www.instagram.com/linku.im',
      'https://www.twitter.com/linku.im',
      'https://www.linkedin.com/company/linku.im',
      'https://www.facebook.com/linku.im'
    ],
    'contactPoint': {
      '@type': 'ContactPoint',
      'contactType': 'customer service',
      'availableLanguage': ['Persian', 'English']
    },
    'address': {
      '@type': 'PostalAddress',
      'addressLocality': 'تهران',
      'addressCountry': 'IR'
    }
  };

  // Website Schema
  const website = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    'name': 'لینکو - linku.im',
    'url': baseUrl,
    'description': 'پلتفرم ایرانی ساخت بیو لینک و کارت دیجیتال',
    'publisher': organization,
    'potentialAction': {
      '@type': 'SearchAction',
      'target': {
        '@type': 'EntryPoint',
        'urlTemplate': `${baseUrl}/search?q={search_term_string}`
      },
      'query-input': 'required name=search_term_string'
    },
    'inLanguage': 'fa-IR'
  };

  // Profile Page Schema
  const profilePage = {
    '@context': 'https://schema.org',
    '@type': 'ProfilePage',
    'mainEntity': person,
    'url': profileUrl,
    'name': `${formData.name || 'پروفایل کاربر'} - لینکو`,
    'description': formData.bio || `پروفایل ${formData.name || 'کاربر'} در لینکو`,
    'isPartOf': website,
    'inLanguage': 'fa-IR',
    'dateModified': new Date().toISOString(),
    'publisher': organization
  };

  // Breadcrumb Schema
  const breadcrumb = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    'itemListElement': [
      {
        '@type': 'ListItem',
        'position': 1,
        'name': 'خانه',
        'item': baseUrl
      },
      {
        '@type': 'ListItem',
        'position': 2,
        'name': 'پروفایل',
        'item': `${baseUrl}/preview`
      },
      {
        '@type': 'ListItem',
        'position': 3,
        'name': formData.name || 'کاربر',
        'item': profileUrl
      }
    ]
  };

  return {
    '@context': 'https://schema.org',
    '@graph': [person, organization, website, profilePage, breadcrumb]
  };
};
*/
const enableBlueTick=ref(false)

const {success, error, info} = useToast();

// Report Modal State
const showReportModal = ref(false)
const showOptionsMenu = ref(false)
const showShareModal = ref(false)
const reportType = ref('')
const reportDescription = ref('')

// Handle share button click
const handleShareClick = (event) => {
  console.log('📤 Share button clicked in preview', event)
  event?.stopPropagation()
  showShareModal.value = true
  showOptionsMenu.value = false
  console.log('📊 showShareModal:', showShareModal.value)
}

// Handle report button click
const handleReportClick = (event) => {
  console.log('🚩 Report button clicked in preview', event)
  event?.stopPropagation()
  showReportModal.value = true
  showOptionsMenu.value = false
  console.log('📊 showReportModal:', showReportModal.value)
}

// Computed properties for theme colors
const isDarkTheme = computed(() => {
  const bg = formData?.themeColor?.background
  return bg === '#000000' || bg === '#000' || bg === 'rgb(0, 0, 0)'
})

const iconColor = computed(() => {
  return formData?.themeColor?.background || '#000000'
})

const iconText = computed(() => {
  // برای تم‌های تیره (مثل مشکی، آبی تیره، سبز تیره) متن سفید باشه
  if (isDarkTheme.value) {
    return '#ffffff'
  }
  // برای تم‌های روشن (سفید، زرد، نارنجی روشن) متن مشکی باشه
  // استفاده از backgroundWithOpacity چون پس‌زمینه واقعی که کاربر می‌بینه روشن شده است
  if (isWhiteTheme.value || isLightColor(backgroundWithOpacity.value)) {
    return '#000000'
  }
  // برای بقیه تم‌ها (رنگی متوسط) سفید باشه
  return '#ffffff'
})

const iconBg = computed(() => {
  if (isDarkTheme.value) {
    return '#ffffff'
  }
  // برای رنگ‌های دیگه، همون رنگ ایکون با opacity کم
  const color = iconColor.value
  return color
})

const isWhiteTheme = computed(() => {
  const bg = formData?.themeColor?.background
  return bg === '#ffffff' || bg === '#fff' || bg === 'rgb(255, 255, 255)' || bg === '#FFFFFF'
})

const isLightTheme = computed(() => {
  return isWhiteTheme.value
})

const isBackgroundDark = computed(() => {
  return isDarkTheme.value
})

const backgroundWithOpacity = computed(() => {
  if (isDarkTheme.value) {
    return '#000000' // رنگ مشکی اصلی - استثنا، کمرنگ نمی‌شود
  }
  if (isWhiteTheme.value) {
    return '#ffffff' // رنگ سفید اصلی - استثنا، کمرنگ نمی‌شود
  }
  // برای رنگ‌های دیگه از رنگ کمرنگ‌شده استفاده کن با 70% تا بیشتر با رنگ ایکون مچ بشه
  return getLighterColor(iconColor.value, 0.7) // 70% روشن‌تر
})

const getLighterColor = (color, amount = 0.7) => {
  if (!color) return '#ffffff'
  // حذف # اگر وجود داشت
  color = color.replace('#', '')
  // تبدیل به RGB
  let r = parseInt(color.substring(0, 2), 16)
  let g = parseInt(color.substring(2, 4), 16)
  let b = parseInt(color.substring(4, 6), 16)
  // روشن کردن رنگ
  r = Math.round(r + (255 - r) * amount)
  g = Math.round(g + (255 - g) * amount)
  b = Math.round(b + (255 - b) * amount)
  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`
}

// تشخیص رنگ‌های روشن (برای انتخاب رنگ متن)
const isLightColor = (color) => {
  if (!color) return false
  // حذف # اگر وجود داشت
  color = color.replace('#', '')
  // تبدیل به RGB
  const r = parseInt(color.substring(0, 2), 16)
  const g = parseInt(color.substring(2, 4), 16)
  const b = parseInt(color.substring(4, 6), 16)
  // محاسبه luminance
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255
  // اگر luminance بیشتر از 0.6 باشه، رنگ روشنه
  return luminance > 0.6
}

// Close options menu when clicking outside
onMounted(async () => {
  const handleClickOutside = (e) => {
    // بستن منوی options
    if (showOptionsMenu.value) {
      const menuButton = e.target.closest('button[class*="ti-dots-vertical"]')?.parentElement
      const menuDropdown = e.target.closest('.absolute.top-12')

      if (!menuButton && !menuDropdown) {
        showOptionsMenu.value = false
      }
    }

    // بستن share modal
    if (showShareModal.value) {
      const shareModal = e.target.closest('[data-modal="share"]')
      if (!shareModal) {
        showShareModal.value = false
      }
    }

    // بستن report modal
    if (showReportModal.value) {
      const reportModal = e.target.closest('[data-modal="report"]')
      if (!reportModal) {
        showReportModal.value = false
      }
    }
  }

  document.addEventListener('click', handleClickOutside)

  onUnmounted(() => {
    document.removeEventListener('click', handleClickOutside)
  })

  // برای پیش‌نمایش کارت جدید فقط از postMessage استفاده میکنیم
  if (slug === 'newCard') {
    isLoading.value = false
    return
  }

  if (!isDefault) {
    try {
      const response = await $axios.post(`cards/${slug}/recordViews`)
    } catch (error) {
      //navigateTo('/404')
    }
  }

  const response = await $axios.get(`cards/${slug}/preview`)

  if (response.data?.success) {
    formData.cards = [response.data.data]
    isLoading.value = false
    if(!isDefault){
      formData.setAboutFrom(response.data.data.id)
    }

  } else {
  }

  ///enable blue tick
  const res = await $axios.get(`cards/${slug}/hasBlueTick`)

  if (res.data?.success) {
    enableBlueTick.value=res.data.data

  } else {
    enableBlueTick.value=false
  }


})
const handleLinkClick = async (item) => {
  if (!isDefault) {
    try {
      await $axios.post(`links/${item.hash}/recordClick`, {
        slug, // اگه بک‌اند لازم داره
      })
    } catch (error) {
    }
  }

}


// Method to close lead capture
const closeLeadCapture = () => {
  formData.isLeadCaptureEnabled = false
}

// تابع مدیریت بازگردانی store
const handleStoreRestored = (event) => {
  // بازگردانی کامل شده است - UI به‌روزرسانی خواهد شد
  if (event.detail?.success) {
    // نمایش toast notification
    success('بازگردانی موفق', 'اطلاعات کارت بازگردانی شد')
  }
}

// دریافت پیام‌ها از parent window (EditCard)
const handleMessage = (event) => {
  // بررسی امنیت origin
  if (event.origin !== window.location.origin) return

  if (event.data?.type === 'FORM_DATA_UPDATE' && event.data?.data) {
    // به‌روزرسانی store با داده‌های جدید
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

  }
}

onMounted(() => {
  // بررسی اینکه آیا در iframe هستیم
  const isInIframe = window !== window.parent

  // گوش دادن به پیام‌های postMessage
  window.addEventListener('message', handleMessage)

  // گوش دادن به event بازگردانی store
  window.addEventListener('store-restored', handleStoreRestored)

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
})

onUnmounted(() => {
  // حذف event listener هنگام destroy
  window.removeEventListener('message', handleMessage)
  window.removeEventListener('store-restored', handleStoreRestored)
})

// تشخیص تاریک بودن رنگ بر اساس luminance
function isColorDark(hex) {
  if (!hex || hex === 'transparent') return false;
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  // محاسبه luminance
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance < 0.5;
}

// انتخاب بنر تصادفی بر اساس رنگ ایکون
const randomBanner = computed(() => {
  const banners = Array.from({length: 20}, (_, i) => `banner-${i + 1}.jpg`)

  // استفاده از iconBg.value به عنوان seed برای انتخاب ثابت
  let seed = 1
  if (iconBg.value && iconBg.value !== 'transparent') {
    // تبدیل رنگ hex به عدد برای seed
    const hex = iconBg.value.replace('#', '')
    seed = parseInt(hex.substring(0, 6), 16) % banners.length
  }

  return `/header/${banners[seed]}`
})

// ایکون پیش‌فرض user
const defaultUserIcon = '/icons/user.svg'

const iconShadow = computed(() => {
  const rgba = hexToRgba(iconBg.value, 0.4);
  return rgba;
});

// تبدیل hex به rgba
function hexToRgba(hex, alpha) {
  if (!hex || hex === 'transparent') return `rgba(0, 0, 0, ${alpha})`;
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

function getComponent(item) {

  try {
    if (!item) return markRaw('div')  // fallback ساده

    // اگر action وجود داره و component مربوطه موجوده
    if (item.action) {
      // Make action lowercase for case-insensitive matching
      const actionLower = item.action.toLowerCase()
      
      // Check if component exists with lowercase action name
      if (PreviewItems[actionLower]) {
        return markRaw(PreviewItems[actionLower])
      }
    }

    // بر اساس type انتخاب کن
    return markRaw(item.type === 'block' ? PreviewItems.basicblock : PreviewItems.basiclink)
  } catch {
    return markRaw('div')  // fallback ساده
  }
}

// تشخیص حالت list mode برای هر آیتم
function getIsListMode(item) {
  // آیتم‌های خاص که همیشه لیستی هستن
  const isSpecialAction = ['poll', 'expandabletext', 'questionbox', 'textsection', 'workhours', 'map', 'file', 'embeddedvideo', 'image', 'video', 'audio', 'document', 'luckywheel', 'luckydice', 'luckyegg'].includes(item.action?.toLowerCase())
  const hasDescriptionEnabled = item.showDescription === true
  
  return !!(isSpecialAction || hasDescriptionEnabled)
}

// گروه‌بندی آیتم‌ها برای جدا کردن آیتم‌های لیستی از گریدی
const groupedItems = computed(() => {
  if (!formData.links) return []
  
  // در حالت center همه لیستی هستن
  if (formData.layout === 'center') {
    return [{ type: 'list', items: formData.links.filter(item => item.enabled) }]
  }
  
  // در حالت portrait و left و right، گروه‌بندی انجام بده
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

// تولید class های مناسب برای هر آیتم
function getItemClasses(item) {
  // نقشه همیشه باید full width باشد - بدون توجه به layout
  if (item.action === 'map') {
    if (formData.layout === 'left' || formData.layout === 'right') {
      return 'col-span-3 w-full'
    }
    return 'w-full'
  }
  
  const isListMode = getIsListMode(item)
  
  // در حالت center، آیتم‌ها عرض محدود دارند
  if (formData.layout === 'center') {
    return isListMode ? 'w-full' : 'w-24 h-24'
  }
  
  // در حالت portrait همه آیتم‌ها full width هستند
  if (formData.layout === 'portrait') {
    return 'w-full'
  }
  
  // در حالت left/right
  if (isListMode) {
    return 'col-span-3 w-full'
  } else {
    // grid mode - هر آیتم 1 column می‌گیرد
    return ''
  }
}

// تولید فایل vCard برای دانلود مخاطب
function downloadVCard() {
  // جلوگیری از اجرای چندباره
  if (downloadVCard._isRunning) {
    return
  }
  downloadVCard._isRunning = true

  try {
    // اطمینان از وجود داده‌های اساسی

    const vCardData = generateVCardData()

    // تشخیص محیط
    const isInIframe = window !== window.parent
    const userAgent = navigator.userAgent.toLowerCase()
    const isIOS = /iphone|ipad|ipod/.test(userAgent)
    const isAndroid = /android/.test(userAgent)
    const isMobile = isIOS || isAndroid

    // نام فایل بدون کاراکتر خاص
    const safeName = (formData.name || 'contact').replace(/[^a-zA-Z0-9\u0600-\u06FF]/g, '_')
    const fileName = `${safeName}.vcf`


    if (isInIframe) {
      // اگر در iframe هستیم، از parent window استفاده می‌کنیم

      try {
        // ارسال داده به parent برای دانلود
        window.parent.postMessage({
          type: 'DOWNLOAD_VCARD',
          data: {
            vCardData: vCardData,
            fileName: fileName,
            isIOS: isIOS,
            isAndroid: isAndroid
          }
        }, window.location.origin)


        // پیام موفقیت
        setTimeout(() => {
          if (isMobile) {
            //alert('درخواست دانلود ارسال شد.\nفایل مخاطب آماده دانلود است.')
          }
          // در حالت desktop نیازی به اعلان نیست
        }, 500)

      } catch {
        useDirectMethod()
      }
    } else {
      // اگر در iframe نیستیم، مستقیم دانلود می‌کنیم
      useDirectMethod()
    }

    // تابع دانلود مستقیم
    async function useDirectMethod() {
      // اول از Web Share API استفاده کن (روی موبایل بهتر کار می‌کنه)
      if (isMobile && navigator.share) {
        try {
          const blob = new Blob([vCardData], { type: 'text/vcard;charset=utf-8' })
          const file = new File([blob], fileName, { type: 'text/vcard' })
          await navigator.share({
            files: [file],
            title: formData.name || 'Contact',
            text: `اطلاعات تماس ${formData.name || ''}`
          })
          return // اگر موفق شد، خارج شو
        } catch (shareError) {
          // اگر share کنسل شد یا خطا داد، به روش‌های دیگه برو
          console.log('Share cancelled or failed, falling back to download')
        }
      }

      if (isMobile) {
        // برای موبایل: استفاده از data URI
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

          // پیام راهنما
          setTimeout(() => {
            if (isIOS) {
              //alert('فایل مخاطب آماده است.\nاز اپ Files یا Safari Downloads فایل را باز کنید.')
            } else {
              //alert('فایل مخاطب دانلود شد.\nاز Downloads فایل .vcf را باز کنید.')
            }
          }, 500)

        } catch {
          useBlobMethod()
        }
      } else {
        // دسکتاپ: استفاده از blob method
        useBlobMethod()
      }
    }

    // تابع پشتیبان برای blob method
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

      // تلاش برای دانلود
      try {
        link.click()
      } catch {
        // روش جایگزین: باز کردن در tab جدید
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
    // آزاد کردن lock
    setTimeout(() => {
      downloadVCard._isRunning = false
    }, 1000)
  }
}

// تولید محتوای vCard
function generateVCardData() {

  let vcard = 'BEGIN:VCARD\r\n'
  vcard += 'VERSION:3.0\r\n'

  // ✅ اطلاعات شخصی - نام (واقعی یا تستی)
  let nameToUse = 'مخاطب تستی'  // پیش‌فرض

  if (formData.name && typeof formData.name === 'string' && formData.name.trim()) {
    nameToUse = formData.name.trim()
  } else {
    // در صفحه نمایش داده میشه ولی اینجا نیست - از المان HTML بخونیم
    try {
      const nameElements = document.querySelectorAll('.text-xl.font-bold, .text-2xl.font-extrabold')
      for (const element of nameElements) {
        const textContent = element.textContent || element.innerText
        if (textContent && textContent.trim() && !textContent.includes('نام کاربر تستی')) {
          nameToUse = textContent.trim().replace(/\s+/g, ' ')
          break
        }
      }
    } catch {
      // خطا در دسترسی به DOM - نادیده گرفته می‌شود
    }
  }

  vcard += `FN:${nameToUse}\r\n`
  vcard += `N:${nameToUse};;;;\r\n`

  // ✅ اطلاعات شخصی - شغل
  let jobToUse = null
  if (formData.job && typeof formData.job === 'string' && formData.job.trim()) {
    jobToUse = formData.job.trim()
  } else {
    // جستجو در DOM
    try {
      const briefcaseElements = document.querySelectorAll('i.ti-briefcase')
      for (const icon of briefcaseElements) {
        const parent = icon.parentElement
        const textContent = parent?.textContent || parent?.innerText
        if (textContent && !textContent.includes('توسعه‌دهنده فرانت‌اند')) {
          jobToUse = textContent.replace(/[\n\r]/g, ' ').trim()
          break
        }
      }
    } catch {
      // خطا در دسترسی به DOM نادیده گرفته می‌شود
    }
  }

  if (jobToUse) {
    vcard += `TITLE:${jobToUse}\r\n`
  }

  // ✅ اطلاعات شخصی - شرکت
  let companyToUse = null
  if (formData.company && typeof formData.company === 'string' && formData.company.trim()) {
    companyToUse = formData.company.trim()
  } else {
    // جستجو در DOM
    try {
      const buildingElements = document.querySelectorAll('i.ti-building')
      for (const icon of buildingElements) {
        const parent = icon.parentElement
        const textContent = parent?.textContent || parent?.innerText
        if (textContent && !textContent.includes('شرکت تستی لینک‌یو')) {
          companyToUse = textContent.replace(/[\n\r]/g, ' ').trim()
          break
        }
      }
    } catch {
      // خطا در دسترسی به DOM نادیده گرفته می‌شود
    }
  }

  if (companyToUse) {
    vcard += `ORG:${companyToUse}\r\n`
  }

  // ✅ اطلاعات شخصی - مکان
  let locationToUse = null
  if (formData?.location && typeof formData?.location === 'string' && formData?.location.trim()) {
    locationToUse = formData?.location.trim()
  } else {
    // جستجو در DOM
    try {
      const mapElements = document.querySelectorAll('i.ti-map-pin')
      for (const icon of mapElements) {
        const parent = icon.parentElement
        const textContent = parent?.textContent || parent?.innerText
        if (textContent && !textContent.includes('تهران، ایران')) {
          locationToUse = textContent.replace(/[\n\r]/g, ' ').trim()
          break
        }
      }
    } catch {
      // خطا در دسترسی به DOM نادیده گرفته می‌شود
    }
  }

  if (locationToUse) {
    vcard += `ADR:;;${locationToUse};;;;\r\n`
  }

  // ✅ اطلاعات شخصی - بیوگرافی
  let bioToUse = null
  if (formData.bio && typeof formData.bio === 'string' && formData.bio.trim()) {
    bioToUse = formData.bio.replace(/\r?\n/g, ' ').trim()
  } else {
    // جستجو در DOM برای بیو
    try {
      const bioElements = document.querySelectorAll('.text-xs.leading-relaxed, .text-xs.text-black')
      for (const element of bioElements) {
        const textContent = element.textContent || element.innerText
        if (textContent && !textContent.includes('یک برنامه‌نویس علاقه‌مند به تکنولوژی')) {
          bioToUse = textContent.replace(/\r?\n/g, ' ').trim()
          break
        }
      }
    } catch {
      // خطا در دسترسی به DOM نادیده گرفته می‌شود
    }
  }

  if (bioToUse) {
    vcard += `NOTE:${bioToUse}\r\n`
  }

  // ✅ عکس پروفایل (فقط اگر کوچک باشد)
  if (formData.profileImage && formData.profileImage.startsWith('data:image/')) {
    try {
      const base64Data = formData.profileImage.split(',')[1]
      // بررسی اندازه (حداکثر 50KB)
      if (base64Data && base64Data.length < 70000) {
        vcard += `PHOTO;ENCODING=BASE64;TYPE=JPEG:${base64Data}\r\n`
      }
    } catch {
      // خطا در پردازش تصویر نادیده گرفته می‌شود
    }
  }

  // ✅ لینک‌های فعال - اینجا همه لینک‌هایی که در صفحه نمایش داده میشن

  // فیلتر کردن فقط لینک‌ها و حذف بلاک‌ها
  const blockActions = ['poll', 'expandabletext', 'questionbox', 'countdown', 'music', 'file', 'image', 'video', 'audio', 'document', 'calendar', 'form', 'map']

  const activeLinks = formData.links?.filter(link => {
    const isEnabled = link.enabled === true
    const hasValue = link.value && typeof link.value === 'string' && link.value.trim().length > 0
    const hasAction = link.action && typeof link.action === 'string'
    const isNotBlock = !blockActions.includes(link.action?.toLowerCase())


    return isEnabled && hasValue && hasAction && isNotBlock
  }) || []

  let _addedLinksCount = 0
  activeLinks.forEach((link) => {
    const value = link.value.trim()
    if (!value) {
      return
    }

    try {

      switch (link.action?.toLowerCase()) {
        case 'phone':
        case 'call': {
          // حذف کاراکترهای غیرضروری از شماره تلفن
          const cleanPhone = value.replace(/[^\d+\-\s()]/g, '')
          if (cleanPhone) {
            vcard += `TEL;TYPE=CELL:${cleanPhone}\r\n`
            _addedLinksCount++
          }
          break
        }

        case 'sms': {
          const cleanSMS = value.replace(/[^\d+\-\s()]/g, '')
          if (cleanSMS) {
            vcard += `TEL;TYPE=MSG:${cleanSMS}\r\n`
            _addedLinksCount++
          }
          break
        }

        case 'email':
          if (value.includes('@') && value.includes('.')) {
            vcard += `EMAIL;TYPE=INTERNET:${value}\r\n`
            _addedLinksCount++
          }
          break

        case 'website':
        case 'basiclink': {
          let websiteUrl = value
          if (!websiteUrl.startsWith('http://') && !websiteUrl.startsWith('https://')) {
            websiteUrl = `https://${websiteUrl}`
          }
          vcard += `URL:${websiteUrl}\r\n`
          _addedLinksCount++
          break
        }

        case 'instagram': {
          const igUrl = value.startsWith('http') ? value : `https://instagram.com/${value.replace('@', '')}`
          vcard += `URL:${igUrl}\r\n`
          vcard += `X-SOCIALPROFILE;TYPE=Instagram:${igUrl}\r\n`
          _addedLinksCount++
          break
        }

        case 'twitter': {
          const twUrl = value.startsWith('http') ? value : `https://twitter.com/${value.replace('@', '')}`
          vcard += `URL:${twUrl}\r\n`
          vcard += `X-SOCIALPROFILE;TYPE=Twitter:${twUrl}\r\n`
          _addedLinksCount++
          break
        }

        case 'linkedin': {
          const liUrl = value.startsWith('http') ? value : `https://linkedin.com/in/${value}`
          vcard += `URL:${liUrl}\r\n`
          vcard += `X-SOCIALPROFILE;TYPE=LinkedIn:${liUrl}\r\n`
          _addedLinksCount++
          break
        }

        case 'facebook': {
          const fbUrl = value.startsWith('http') ? value : `https://facebook.com/${value}`
          vcard += `URL:${fbUrl}\r\n`
          vcard += `X-SOCIALPROFILE;TYPE=Facebook:${fbUrl}\r\n`
          _addedLinksCount++
          break
        }

        case 'youtube': {
          const ytUrl = value.startsWith('http') ? value : `https://youtube.com/@${value}`
          vcard += `URL:${ytUrl}\r\n`
          vcard += `X-SOCIALPROFILE;TYPE=YouTube:${ytUrl}\r\n`
          _addedLinksCount++
          break
        }

        case 'telegram': {
          const tgUrl = value.startsWith('http') ? value : `https://t.me/${value.replace('@', '')}`
          vcard += `URL:${tgUrl}\r\n`
          vcard += `X-SOCIALPROFILE;TYPE=Telegram:${tgUrl}\r\n`
          _addedLinksCount++
          break
        }

        case 'whatsapp': {
          if (value.includes('wa.me') || value.includes('whatsapp.com')) {
            vcard += `URL:${value}\r\n`
            vcard += `X-SOCIALPROFILE;TYPE=WhatsApp:${value}\r\n`
          } else {
            const cleanWA = value.replace(/[^\d]/g, '')
            if (cleanWA) {
              const waUrl = `https://wa.me/${cleanWA}`
              vcard += `URL:${waUrl}\r\n`
              vcard += `X-SOCIALPROFILE;TYPE=WhatsApp:${waUrl}\r\n`
            }
          }
          _addedLinksCount++
          break
        }

        default: {
          // سایر لینک‌ها
          let defaultUrl = value
          if (!defaultUrl.startsWith('http://') && !defaultUrl.startsWith('https://') && defaultUrl.includes('.')) {
            defaultUrl = `https://${defaultUrl}`
          }
          if (defaultUrl.startsWith('http')) {
            vcard += `URL:${defaultUrl}\r\n`
            _addedLinksCount++
          }
          break
        }
      }
    } catch {
      // خطا در پردازش لینک نادیده گرفته می‌شود
    }
  })

  // URL اصلی پروفایل
  if (typeof window !== 'undefined' && window.location.href) {
    vcard += `URL:${window.location.href}\r\n`
  }

  vcard += 'END:VCARD\r\n'


  return vcard
}

// Share Profile Function
const shareProfile = async () => {
  showOptionsMenu.value = false

  const shareData = {
    title: formData.name || 'پروفایل لینکو',
    text: `پروفایل ${formData.name || 'کاربر'} را در لینکو مشاهده کنید`,
    url: window.location.href
  }

  // بررسی دقیق‌تر Web Share API
  const canUseWebShare = () => {
    return 'share' in navigator &&
        typeof navigator.share === 'function' &&
        window.isSecureContext // HTTPS یا localhost
  }

  try {
    if (canUseWebShare()) {
      await navigator.share(shareData)
      // فقط اگر اشتراک‌گذاری موفق بود پیام نشان بده
      success('با موفقیت اشتراک‌گذاری شد')
    } else {
      // برای دسکتاپ یا مرورگرهای قدیمی
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(window.location.href)
        success('لینک کپی شد')
      } else {
        // fallback برای مرورگرهای خیلی قدیمی
        const textArea = document.createElement('textarea')
        textArea.value = window.location.href
        document.body.appendChild(textArea)
        textArea.focus()
        textArea.select()
        document.execCommand('copy')
        document.body.removeChild(textArea)
        success('لینک کپی شد')
      }
    }
  } catch (error) {

    // اگر کاربر اشتراک‌گذاری را لغو کرد
    if (error.name === 'AbortError') {
      return // هیچ پیامی نشان نده
    }

    // fallback - کپی کردن لینک
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(window.location.href)
        success('لینک کپی شد')
      } else {
        info('لینک را از آدرس‌بار کپی کنید')
      }
    } catch (clipboardError) {
      info('لینک را از آدرس‌بار کپی کنید')
    }
  }
}

// Share Modal Functions
const shareToTelegram = () => {
  const text = `پروفایل ${formData.name || 'کاربر'} را در لینکو مشاهده کنید: ${window.location.href}`
  const url = `https://t.me/share/url?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent(text)}`
  window.open(url, '_blank')
  showShareModal.value = false
  success('هدایت به تلگرام...')
}

const shareToWhatsApp = () => {
  const text = `پروفایل ${formData.name || 'کاربر'} را در لینکو مشاهده کنید: ${window.location.href}`
  const url = `https://wa.me/?text=${encodeURIComponent(text)}`
  window.open(url, '_blank')
  showShareModal.value = false
  success('هدایت به واتساپ...')
}

const shareToInstagram = () => {
  // Instagram doesn't support direct URL sharing, so copy to clipboard
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
  const text = `پروفایل ${formData.name || 'کاربر'} را در لینکو مشاهده کنید`
  const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(window.location.href)}`
  window.open(url, '_blank')
  showShareModal.value = false
  success('هدایت به ایکس...')
}

const copyLink = async () => {
  try {
    // اول سعی می‌کنیم از Clipboard API استفاده کنیم
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(window.location.href)
      showShareModal.value = false
      return
    }

    // fallback method برای مرورگرهای قدیمی
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

// Submit Report Function
const submitReport = () => {
  if (!reportType.value) {
    error('لطفاً نوع گزارش را انتخاب کنید')
    return
  }

  // شبیه‌سازی ارسال گزارش
  const reportData = {
    type: reportType.value,
    description: reportDescription.value,
    url: window.location.href,
    timestamp: new Date().toISOString()
  }

  // نمایش پیام موفقیت
  success('گزارش شما با موفقیت ارسال شد')

  // بستن modal و ریست کردن فرم
  showReportModal.value = false
  reportType.value = ''
  reportDescription.value = ''
}

definePageMeta({layout: 'preview'})
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

/* Tailwind doesn’t have slow spin by default، پس اضافه می‌کنیم */
@keyframes spin-slow {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
.animate-spin-slow {
  animation: spin-slow 2s linear infinite;
}
</style>