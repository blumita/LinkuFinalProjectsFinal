<template>
  <div class="bg-background flex flex-col h-full">
    <div class="flex-1 overflow-y-auto p-4 space-y-6 pb-20 lg:pb-4">
  <!-- No template changes needed for types -->
    <!-- Icon Upload (مطابق لاکی‌اگ: آیکون راست، متن چپ) -->
    <div class="flex items-center gap-4 mb-4">
      <div class="relative w-20 h-20 flex-shrink-0">
        <img v-if="form.customIcon" :src="form.customIcon" class="w-full h-full rounded-xl bg-muted object-cover cursor-pointer" @click="fileInput?.click()" >
        <component
          :is="iconComponent" v-else-if="iconComponent"
          class="w-full h-full rounded-xl bg-muted text-muted-foreground cursor-pointer"
          v-bind="iconColor ? { color: iconColor, filled: isIconFilled } : {}"
          @click="fileInput?.click()"
        />
        <div
          v-else
          class="w-full h-full rounded-xl bg-muted flex items-center justify-center text-muted-foreground text-2xl cursor-pointer"
          @click="fileInput?.click()"
        >
          <component 
            :is="getIconComponent('workhours')"
            class="w-full h-full text-muted-foreground"
            v-bind="iconColor ? { color: iconColor, filled: isIconFilled } : {}"
          />
        </div>
        <input ref="fileInput" type="file" accept="image/*" class="hidden" @change="handleIconUpload" >
      </div>
      <p class="text-sm text-primary font-medium cursor-pointer" @click="fileInput?.click()">برای تغییر آیکون کلیک کنید</p>
      <p v-if="iconError" class="text-xs text-destructive mt-1">آیکون الزامی است</p>
    </div>

    <!-- عنوان -->
    <div>
      <label class="block text-sm font-medium text-foreground mb-1">عنوان</label>
      <input
        v-model="form.title"
        type="text"
        placeholder="مثلاً ساعات کاری شعبه مرکزی"
        class="w-full px-4 py-2 bg-muted rounded-lg border border-border text-sm text-foreground"
      >
      <p v-if="titleError" class="text-xs text-destructive mt-1">عنوان الزامی است</p>
    </div>

    <p v-if="step === 1" class="text-xs text-muted-foreground mb-2">یکی از گزینه‌ها را انتخاب کنید</p>

    <!-- مرحله ۱: انتخاب نوع برنامه -->
    <div v-if="step === 1">
      <div class="space-y-1 mt-6">
  
        <div class="rounded-md overflow-hidden border border-border">
          <div
            v-for="option in scheduleOptions"
            :key="option.value"
            class="flex items-center justify-between px-4 py-2 border-b border-border last:border-b-0 cursor-pointer hover:bg-muted transition text-foreground"
            :class="mode === option.value ? 'bg-muted border-primary font-bold' : 'bg-background border-transparent'"
            @click="mode = option.value as 'selected' | 'always' | 'appointment'; step = 2"
          >
            <span class="flex items-center gap-2 text-sm">
              <i v-if="option.value === 'selected'" class="ti ti-clock text-lg text-primary" />
              <i v-else-if="option.value === 'always'" class="ti ti-clock text-lg text-green-600" />
              <i v-else-if="option.value === 'appointment'" class="ti ti-calendar-time text-lg text-orange-500" />
              {{ option.label }}
            </span>
            <i v-if="mode === option.value" class="ti ti-check text-green-600 text-lg" />
          </div>
        </div>
      </div>
    </div>
    </div>

    <!-- Fixed Bottom Actions for step 1 -->
    <div v-if="step === 1" class="border-t border-border bg-background p-4 pb-6 mx-4 mb-4">
      <div class="flex items-center gap-3">
        <button type="button" class="flex-1 bg-muted text-muted-foreground font-medium py-3 rounded-lg hover:bg-muted/80 transition-colors" @click="$emit('cancel')">
          انصراف
        </button>
      </div>
    </div>

    <!-- مرحله ۲: انتخاب روزها و ساعت‌ها -->
    <form v-else-if="mode" @submit.prevent="handleSubmit">
      <div v-if="mode === 'selected'" class="space-y-2 mt-4">
        <div
          v-for="(day, index) in days"
          :key="index"
          class="flex items-center justify-between px-4 py-2 border border-border rounded-lg"
        >
          <div class="flex flex-col">
            <span class="text-sm font-medium text-foreground">{{ day.name }}</span>
            <span class="text-xs flex items-center gap-1"
              :class="{
                'text-muted-foreground': !day.enabled || day.type === 'closed',
                'text-primary': day.type === '24h',
                'text-green-600': day.type === 'hours',
                'text-orange-500': day.type === 'appointment',
              }"
            >
              <template v-if="!day.enabled || day.type === 'closed'">
                <i class="ti ti-ban text-lg align-middle" />
                تعطیل
              </template>
              <template v-else-if="day.type === '24h'">
                <i class="ti ti-clock text-lg align-middle" />
                همیشه باز
              </template>
              <template v-else-if="day.type === 'appointment'">
                <i class="ti ti-calendar-time text-lg align-middle" />
                با هماهنگی قبلی
              </template>
              <template v-else>
                <i class="ti ti-clock text-lg align-middle" />
                {{ formatTime(day.start ?? '') }} - {{ formatTime(day.end ?? '') }}
              </template>
            </span>
          </div>
          <div class="flex items-center gap-2">
            <input v-model="day.enabled" type="checkbox" class="form-switch-themed" >
            <button
              v-if="day.enabled"
              type="button" class="text-foreground text-xs underline rounded-lg" @click="editIndex = index"
            >ویرایش</button>
          </div>
        </div>
        <p v-if="daysError" class="text-xs text-destructive mt-2">حداقل یک روز فعال با ساعت معتبر انتخاب کنید</p>
      </div>
      <div v-else-if="mode === 'always'" class="text-sm text-muted-foreground px-2 mt-4">
        همه روزها به صورت ۲۴ ساعته فعال هستند.
      </div>
      <div v-else-if="mode === 'appointment'" class="text-sm text-muted-foreground px-2 mt-4">
        همه روزها فقط با هماهنگی قبلی فعال هستند.
      </div>
      <div class="flex justify-between gap-3 pt-6 border-t border-border mt-6 mx-4 mb-4">
        <button type="button" class="flex-1 py-3 bg-muted text-foreground font-bold text-sm rounded-lg hover:bg-muted/80" @click="step = 1">قبلی</button>
        <button type="submit" class="flex-1 py-3 bg-primary text-primary-foreground font-bold text-sm rounded-lg hover:bg-primary/90">ذخیره</button>
      </div>

      <!-- Modal-style Editor -->
      <teleport to="body">
        <div v-if="editIndex !== null" class="fixed inset-0 z-[9999] flex items-center justify-center bg-black/30">
          <div class="bg-background rounded-xl p-6 w-full max-w-xs mx-auto space-y-4 shadow-xl">
            <h3 class="font-semibold text-center mb-2 text-foreground">ویرایش ساعت {{ days[editIndex].name }}</h3>
            <ul class="w-full mb-2 flex flex-col gap-2">
              <li
                v-for="opt in [
                  { value: 'hours', label: 'ساعت کاری مشخص', icon: 'ti-clock' },
                  { value: '24h', label: '۲۴ ساعته', icon: 'ti-clock' },
                  { value: 'appointment', label: 'با هماهنگی قبلی', icon: 'ti-calendar-time' }
                ]"
                :key="opt.value"
                class="flex items-center gap-2 border border-border rounded-lg p-2 text-sm cursor-pointer transition hover:bg-muted text-foreground" @click="days[editIndex].type = opt.value"
                :class="days[editIndex].type === opt.value ? 'bg-muted border-primary font-bold' : 'bg-background border-border'"
              >
                <i :class="'ti ' + opt.icon + ' text-lg'" />
                <span>{{ opt.label }}</span>
                <span v-if="days[editIndex].type === opt.value" class="ml-auto text-xs text-green-600">انتخاب شده</span>
              </li>
            </ul>
            <div v-if="days[editIndex].type === 'hours'" class="flex gap-2 mb-2 items-center border border-border p-2 rounded-lg">
              <div class="flex flex-col items-center gap-1 w-full">
                <label class="text-xs mb-1 text-foreground">از</label>
                <input
                  v-model="days[editIndex].start"
                  maxlength="5"
                  placeholder="مثلاً 09:00"
                  class="w-full border border-border p-2 rounded-lg text-sm text-center font-bold ltr text-foreground bg-muted"
                  @input="onTimeInput(editIndex, 'start')"
                >
                <span class="text-xs text-muted-foreground">{{ getPersianPeriod(days[editIndex].start ?? '') }}</span>
              </div>
              <div class="flex flex-col items-center gap-1 w-full">
                <label class="text-xs mb-1 text-foreground">تا</label>
                <input
                  v-model="days[editIndex].end"
                  maxlength="5"
                  placeholder="مثلاً 18:00"
                  class="w-full border border-border p-2 rounded-lg text-sm text-center font-bold ltr text-foreground bg-muted"
                  @input="onTimeInput(editIndex, 'end')"
                >
                <span class="text-xs text-muted-foreground">{{ getPersianPeriod(days[editIndex].end ?? '') }}</span>
              </div>
            </div>
            <div class="flex justify-between gap-2 pt-2">
              <button type="button" class="flex-1 py-2 bg-muted text-foreground font-bold text-sm rounded-lg hover:bg-muted/80" @click="editIndex = null">انصراف</button>
              <button type="button" class="flex-1 py-2 bg-primary text-primary-foreground font-bold text-sm rounded-lg hover:bg-primary/90" @click="editIndex = null">تأیید</button>
            </div>
          </div>
        </div>
      </teleport>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue';
import { useIconComponents } from '~/composables/useIconComponentsMap'
import { useFormStore } from '~/stores/form'

interface Day {
  name: string;
  enabled: boolean;
  type: string;
  start?: string;
  end?: string;
}

const { getIconComponent } = useIconComponents();

const props = defineProps({
  link: {
    type: Object,
    default: () => ({})
  }
});
const emit = defineEmits(['submit', 'cancel'])

// Access form store for dynamic coloring
const formStore = useFormStore();

const step = ref(1);
const scheduleOptions = [
  { label: 'باز در ساعات مشخص', value: 'selected' },
  { label: 'همیشه باز', value: 'always' },
  { label: 'فقط با هماهنگی قبلی', value: 'appointment' },
];

const mode = ref<'selected' | 'always' | 'appointment' | null>(props.link?.mode ?? null);
const form = reactive({
  title: props.link?.title || '',
  icon: props.link?.icon || { type: 'component', name: 'workhours' },
  customIcon: props.link?.customIcon || '',
});
const days = ref(props.link?.days || [
  { name: 'شنبه', enabled: true, type: 'hours', start: '09:00', end: '18:00' },
  { name: 'یکشنبه', enabled: true, type: 'hours', start: '09:00', end: '18:00' },
  { name: 'دوشنبه', enabled: true, type: 'hours', start: '09:00', end: '18:00' },
  { name: 'سه‌شنبه', enabled: true, type: 'hours', start: '09:00', end: '18:00' },
  { name: 'چهارشنبه', enabled: true, type: 'hours', start: '09:00', end: '18:00' },
  { name: 'پنج‌شنبه', enabled: true, type: 'hours', start: '09:00', end: '18:00' },
  { name: 'جمعه', enabled: false, type: 'closed' },
]);
const editIndex = ref<number | null>(null);
const fileInput = ref<HTMLInputElement | null>(null);

// Icon Management
const iconComponent = computed(() => {
  // اگر form.icon یک object باشه، name رو استخراج کن
  const iconName = typeof form.icon === 'object' && form.icon?.name ? form.icon.name : form.icon
  return getIconComponent(iconName || 'workhours');
})

// Dynamic icon coloring from form store
const iconColor = computed(() => {
  // اگر کاربر رنگ انتخاب کرده، از آن استفاده کن
  if (formStore.iconColor?.background && 
      formStore.iconColor.background !== 'transparent') {
    return formStore.iconColor.background
  }
  // در غیر این صورت، undefined برگردان تا رنگ پیش‌فرض SVG استفاده شود
  return undefined
})

const isIconFilled = computed(() => {
  return !!(formStore.iconColor?.background && 
           formStore.iconColor.background !== 'transparent')
})

// Validation states
const titleError = ref(false);
const iconError = ref(false);
const daysError = ref(false);

const toPersianDigits = (str: string) => (str || '').replace(/\d/g, d => '۰۱۲۳۴۵۶۷۸۹'[+d]);
const formatTime = (time: string) => {
  if (!time) return 'نامشخص';
  const [h, m] = time.split(':');
  const hour = parseInt(h, 10);
  if (isNaN(hour) || !m) return 'نامشخص';
  return `${toPersianDigits(h)}:${toPersianDigits(m)}`;
};

function validateForm() {
  titleError.value = !form.title.trim();
  iconError.value = !form.customIcon && !form.icon;
  if (mode.value === 'selected') {
    daysError.value = !days.value.some(
      (d: { enabled: boolean; type: string; start?: string; end?: string }) =>
        d.enabled && (d.type === '24h' || d.type === 'appointment' || (d.type === 'hours' && d.start && d.end))
    );
  } else {
    daysError.value = false;
  }
  return !(titleError.value || iconError.value || daysError.value);
}

const handleSubmit = () => {
  if (!validateForm()) return;
  let result;
  if (mode.value === 'always') {
    result = days.value.map((d: Day) => ({ ...d, enabled: true, type: '24h' }));
  } else if (mode.value === 'appointment') {
    result = days.value.map((d: Day) => ({ ...d, enabled: true, type: 'appointment' }));
  } else {
    result = days.value;
  }
  emit('submit', {
    ...props.link,
    title: form.title,
    mode: mode.value,
    days: result,
    icon: form.icon,
    customIcon: form.customIcon,
    action: 'workhours',
    type: 'block' // تضمین اینکه همیشه بلاک باشد
  });
};

function getPersianPeriod(time: string) {
  if (!time) return '';
  const hour = parseInt(time.split(':')[0], 10);
  if (isNaN(hour)) return '';
  return hour < 12 ? 'قبل‌ازظهر' : 'بعدازظهر';
}
function onTimeInput(index: number, field: 'start' | 'end') {
  const val = days.value[index][field];
  days.value[index][field] = (val ?? '').replace(/[^0-9:]/g, '').slice(0, 5);
}

function handleIconUpload(e: Event) {
  const files = (e.target as HTMLInputElement).files;
  if (!files || !files[0]) return;
  const reader = new FileReader();
  reader.onload = (ev: ProgressEvent<FileReader>) => {
    form.customIcon = ev.target?.result as string;
    iconError.value = false;
  };
  reader.readAsDataURL(files[0]);
}
</script>

<style scoped>
/* تم سوئیچ */
.form-switch-themed {
  appearance: none;
  background-color: hsl(var(--muted-foreground) / 0.3);
  border-radius: 9999px;
  width: 36px;
  height: 20px;
  position: relative;
  cursor: pointer;
  transition: background-color 0.2s;
}
.form-switch-themed:checked {
  background-color: hsl(var(--primary));
}
.form-switch-themed::before {
  content: "";
  position: absolute;
  width: 16px;
  height: 16px;
  background: white;
  border-radius: 9999px;
  top: 2px;
  left: 2px;
  transition: transform 0.2s ease;
}
.form-switch-themed:checked::before {
  transform: translateX(16px);
}
</style>




