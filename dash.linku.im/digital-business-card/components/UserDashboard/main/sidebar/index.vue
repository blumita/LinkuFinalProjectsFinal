<template>
  <!-- 🔹 بک‌دراپ: فقط موبایل، پشت سایدبار -->
  <div
      v-if="isOpen"
      class="fixed inset-0 bg-black/50 backdrop-blur-sm z-30 lg:hidden transition-opacity duration-300"
      @click="$emit('close')"
  ></div>

  <!-- 🔹 سایدبار -->
  <aside
      :class="[
      'fixed rtl:right-0 ltr:left-0 top-0 w-64 h-screen bg-background border-l border-border flex flex-col text-sm text-primary z-40 transform transition-transform duration-300 ease-in-out',
      'lg:translate-x-0',
      isOpen ? 'translate-x-0' : 'rtl:translate-x-full ltr:-translate-x-full lg:rtl:translate-x-0 lg:ltr:translate-x-0'
    ]"
  >

    <!-- هدر موبایل - با استایل MobileHeader -->
    <div class="flex items-center justify-between p-4 border-b border-border lg:hidden">
      <div class="flex items-center gap-2">
        <img src="@/assets/logo/logo.png" alt="linko" class="h-7 flex-shrink-0"/>
      </div>
      <button 
        @click="$emit('close')" 
        class="w-10 h-10 rounded-full bg-secondary flex items-center justify-center hover:bg-accent-bg/30 transition-colors"
      >
        <i class="ti ti-x text-primary text-xl"/>
      </button>
    </div>

    <!-- لوگو دسکتاپ -->
    <div class="h-20 items-center justify-center border-b border-border hidden lg:flex bg-background">
      <img src="@/assets/logo/logo.png" alt="linko" class="h-7"/>
    </div>

    <!-- منو فقط موبایل و تبلت اسکرول‌دار -->
    <nav class="flex-1 px-3 py-4 space-y-1 overflow-y-auto max-h-[calc(100vh-200px)] lg:overflow-visible lg:max-h-none">
      <NuxtLink
          to="/dashboard/dashboard"
          class="sidebar-link"
          :class="isActive('/dashboard/dashboard') && 'sidebar-link--active'"
          @click="$emit('close')"
      >
        <i class="ti ti-user text-xl"></i>
        پروفایل های من
      </NuxtLink>

      <NuxtLink
          to="/dashboard/insights"
          class="sidebar-link"
          :class="isActive('/analytics') && 'sidebar-link--active'"
          @click="$emit('close')"
      >
        <i class="ti ti-chart-bar text-xl"></i>
        تحلیل‌ها
      </NuxtLink>

      <NuxtLink
          to="/dashboard/inbox"
          class="sidebar-link"
          :class="isActive('/inbox') && 'sidebar-link--active'"
          @click="$emit('close')"
      >
        <i class="ti ti-inbox text-xl"></i>
        <span>صندوق دریافتی</span>
        <span
            v-if="inboxBadge > 0"
            class="bg-blue-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full ml-auto"
        >
           {{ inboxBadge > 99 ? '99+' : inboxBadge }}
       </span>
      </NuxtLink>

      <NuxtLink
          to="/dashboard/notifications"
          class="sidebar-link"
          :class="isActive('/dashboard/notifications') && 'sidebar-link--active'"
          @click="$emit('close')"
      >
        <i class="ti ti-bell text-xl"></i>
        اطلاعیه‌ها
      </NuxtLink>

      <NuxtLink
          to="/dashboard/support"
          class="sidebar-link"
          :class="isActive('/dashboard/support') && 'sidebar-link--active'"
          @click="$emit('close')"
      >
        <i class="ti ti-headset text-xl"></i>
        پشتیبانی
      </NuxtLink>
    </nav>

    <!-- اطلاعات کاربر + خروج -->
    <div class="p-3 mx-3 mb-3 flex items-center justify-between gap-3 border border-border rounded-2xl bg-secondary">
      <div class="flex items-center gap-3 flex-1 min-w-0">
        <div class="flex-shrink-0">
          <template v-if="userAvatar">
            <img :src="userAvatar" alt="User Avatar" class="w-11 h-11 rounded-full object-cover ring-2 ring-border"/>
          </template>
          <template v-else-if="card?.avatar">
            <img :src="card?.avatar" alt="User Avatar" class="w-11 h-11 rounded-full object-cover ring-2 ring-border"/>
          </template>
          <template v-else>
            <div 
              class="w-11 h-11 rounded-full ring-2 ring-border flex items-center justify-center"
              :style="{ backgroundColor: formStore.iconColor?.background || 'rgb(var(--color-primary))' }"
            >
              <i class="ti ti-user text-white text-xl"></i>
            </div>
          </template>
              <i class="ti ti-user"></i>
            </div>
          </template>
        </div>
        <div class="flex-1 min-w-0">
          <p class="text-sm font-semibold truncate text-primary">{{ userName || userStore.user?.phone }}</p>
          <p class="text-xs text-secondary truncate">{{ userStore.isUserPro ? 'کاربر ویژه' : 'کاربر عادی' }}</p>
        </div>
      </div>
      <button
          class="w-9 h-9 rounded-full bg-background flex items-center justify-center hover:bg-red-500/10 hover:text-red-500 transition-colors flex-shrink-0"
          @click="logout"
          title="خروج"
      >
        <i class="ti ti-logout text-lg"></i>
      </button>
    </div>

    <!-- حذف حساب -->
    <div class="px-3 pb-2">
      <button
          @click="showDeleteAccountModal = true"
          class="flex items-center justify-center gap-2 w-full py-3 text-red-600 dark:text-red-400 text-sm font-semibold rounded-2xl bg-red-50 dark:bg-red-500/10 hover:bg-red-100 dark:hover:bg-red-500/20 transition-colors border border-red-200 dark:border-red-500/30"
      >
        <i class="ti ti-trash text-base"></i>
        حذف حساب کاربری
      </button>
    </div>

    <!-- ارتقاء -->
    <div class="px-3 pb-3">
      <NuxtLink
          to="/dashboard/checkout"
          class="flex items-center justify-center gap-2 w-full py-3 text-white dark:text-black text-sm font-semibold rounded-2xl bg-black dark:bg-white hover:opacity-90 transition-opacity"
          @click="$emit('close')"
      >
        <i class="ti ti-crown text-base"></i>
        ارتقاء به اکانت ویژه
      </NuxtLink>
    </div>
  </aside>

  <!-- Delete Account Modal -->
  <div v-if="showDeleteAccountModal" class="fixed inset-0 z-[9999] flex items-center justify-center p-4">
    <div class="absolute inset-0 bg-black/50 backdrop-blur-sm" @click="showDeleteAccountModal = false"></div>
    <div class="relative bg-background border border-border rounded-2xl p-6 max-w-sm w-full shadow-2xl">
      <div class="text-center mb-4">
        <div class="w-16 h-16 mx-auto mb-4 bg-destructive/10 rounded-full flex items-center justify-center">
          <i class="ti ti-alert-triangle text-destructive text-3xl"></i>
        </div>
        <h3 class="text-lg font-bold text-foreground mb-2">حذف حساب کاربری</h3>
        <p class="text-sm text-muted-foreground mb-1">این عمل غیرقابل برگشت است!</p>
        <p class="text-xs text-muted-foreground mt-2">
          با حذف حساب، تمامی کارت‌ها، لینک‌ها و داده‌های مرتبط غیرقابل بازیابی حذف می‌شوند.
        </p>
      </div>
      <div class="mb-4">
        <label class="block text-sm font-medium text-foreground mb-2">
          برای تایید، کلمه <span class="font-bold text-destructive">"حذف"</span> را وارد کنید:
        </label>
        <input
            v-model="deleteConfirmText"
            type="text"
            placeholder="حذف"
            class="w-full px-4 py-3 rounded-xl border-2 border-border bg-background text-foreground focus:border-destructive focus:outline-none transition-colors"
        />
      </div>
      <div class="flex gap-2">
        <button
            @click="showDeleteAccountModal = false; deleteConfirmText = ''"
            class="flex-1 py-3 rounded-xl border-2 border-border text-foreground font-medium hover:bg-muted transition-colors"
        >
          انصراف
        </button>
        <button
            @click="deleteAccount"
            :disabled="deleteConfirmText !== 'حذف' || isDeleting"
            :class="[
              'flex-1 py-3 rounded-xl font-medium transition-colors',
              deleteConfirmText === 'حذف' && !isDeleting
                ? 'bg-destructive text-white hover:bg-destructive/90'
                : 'bg-muted text-muted-foreground cursor-not-allowed opacity-50'
            ]"
        >
          <span v-if="isDeleting" class="flex items-center justify-center gap-2">
            <i class="ti ti-loader animate-spin"></i>
            در حال حذف...
          </span>
          <span v-else>حذف نهایی</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>

import {useRoute} from 'vue-router';
import {computed, ref} from 'vue';
import {useUserStore} from "~/stores/user";
import {useFormStore} from "~/stores/form.js";

// TODO: مقداردهی صحیح userAvatar بر اساس نیاز پروژه
// نمونه: دریافت از store یا props یا مقدار پیش‌فرض
// در اینجا مقدار پیش‌فرض قرار داده شده است:
const userAvatar = ref(null); // یا یک آدرس عکس پیش‌فرض قرار دهید

const props = defineProps({
  isOpen: Boolean
});

const emit = defineEmits(['close']);

const route = useRoute();
const userName = ref('')
const userStore = useUserStore()
const formStore = useFormStore()
const inboxBadge = ref(formStore.inboxBadge)
const isActive = (path) => route?.path?.startsWith(path) || false;
const showDeleteAccountModal = ref(false)
const deleteConfirmText = ref('')
const isDeleting = ref(false)
watch(() => formStore.inboxBadge, (newVal, oldVal) => {
  if (newVal !== oldVal) {
    inboxBadge.value = newVal
  }
})
const logout = async () => {
  try {
    const authStore = useAuthStore()
    const {$axios} = useNuxtApp()
    const {data} = await $axios.get('user/logout');

    // Clear authentication token
    localStorage.removeItem('auth_token');
    authStore.setToken('')

    // Redirect user to login
    navigateTo('/auth/login');
  } catch (error) {
    if (error.response && error.response.data.message) {
      alert(error.response.data.message);
    } else {
      alert('مشکلی در برقراری ارتباط با سرور وجود دارد.');
    }
  }
}

const deleteAccount = async () => {
  if (deleteConfirmText.value !== 'حذف') return;
  
  isDeleting.value = true;
  
  try {
    const authStore = useAuthStore()
    const {$axios} = useNuxtApp()
    
    const {data} = await $axios.delete('user/delete-account');
    
    if (data.success) {
      // Clear authentication
      localStorage.removeItem('auth_token');
      authStore.setToken('')
      
      // Close modal
      showDeleteAccountModal.value = false;
      
      // Show success message
      alert('حساب کاربری شما با موفقیت حذف شد.');
      
      // Redirect to login
      navigateTo('/auth/login');
    }
  } catch (error) {
    isDeleting.value = false;
    if (error.response?.data?.message) {
      alert(error.response.data.message);
    } else {
      alert('خطا در حذف حساب کاربری. لطفاً دوباره تلاش کنید.');
    }
  }
}
const card =computed(()=>userStore.cards.find(c=>c.isDefault===true))
userAvatar.value = card.value?.avatar
/*watch(card, (newValue) => {
  if (newValue) {
    userAvatar.value = newValue.avatar
  }
});*/
watch(
    () => userStore.user,
    (user) => {
      if (user) {
        userName.value = user.name || '';
      }
    },
    {immediate: true}
);
const userInitials = computed(() => {
  if (!userName.value) return ''
  return userName.value
      .split(' ')
      .map(word => word[0])
      .slice(0, 2)
      .join(' ')
      .toUpperCase()
})
</script>

<style scoped>
@keyframes gradient-x {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}

.animate-gradient-x {
  animation: gradient-x 6s ease infinite;
}
</style>