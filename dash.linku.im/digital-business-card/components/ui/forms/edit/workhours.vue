<template>
  <div class="bg-background rounded-xl space-y-6 w-full max-h-[90vh] overflow-y-auto p-4">
    
    <!-- Header -->
    <div class="flex justify-between items-center mb-4">
      <h2 class="text-base font-bold">
        ویرایش ساعات کاری
      </h2>
    </div>

    <!-- عنوان -->
    <div>
      <label class="block text-sm font-medium text-foreground mb-1">عنوان</label>
      <input
        v-model="form.title"
        type="text"
        placeholder="مثلاً ساعات کاری شعبه مرکزی"
        class="w-full px-4 py-3 bg-background border border-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
      >
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
            <button
              type="button"
              @click="day.enabled = !day.enabled"
              class="relative w-9 h-5 flex items-center rounded-full transition-colors duration-200 focus:outline-none"
              :style="{ backgroundColor: day.enabled ? iconColor : 'rgba(156, 163, 175, 0.3)' }"
            >
              <span
                class="absolute w-4 h-4 bg-white rounded-full shadow transform transition-transform duration-200"
                :class="day.enabled ? 'left-[18px]' : 'left-0.5'"
              />
            </button>
            <button
              v-if="day.enabled"
              type="button" class="text-primary text-xs underline rounded-lg" @click="editIndex = index"
            >ویرایش</button>
          </div>
        </div>
      </div>
      <div v-else-if="mode === 'always'" class="text-sm text-muted-foreground px-2 mt-4">
        همه روزها به صورت ۲۴ ساعته فعال هستند.
      </div>
      <div v-else-if="mode === 'appointment'" class="text-sm text-muted-foreground px-2 mt-4">
        همه روزها فقط با هماهنگی قبلی فعال هستند.
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
                class="flex items-center gap-2 border rounded-lg p-2 text-sm cursor-pointer transition hover:bg-muted text-foreground" @click="days[editIndex].type = opt.value"
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
                  class="w-full border border-border p-2 rounded-lg text-sm text-center font-bold ltr text-foreground bg-background"
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
                  class="w-full border border-border p-2 rounded-lg text-sm text-center font-bold ltr text-foreground bg-background"
                  @input="onTimeInput(editIndex, 'end')"
                >
                <span class="text-xs text-muted-foreground">{{ getPersianPeriod(days[editIndex].end ?? '') }}</span>
              </div>
            </div>
            <div class="flex justify-between gap-2 pt-2">
              <button type="button" class="flex-1 py-2 bg-muted text-muted-foreground font-bold text-sm rounded-lg hover:bg-muted/80" @click="editIndex = null">انصراف</button>
              <button type="button" class="flex-1 py-2 bg-primary text-primary-foreground font-bold text-sm rounded-lg hover:bg-primary/90" @click="editIndex = null">تأیید</button>
            </div>
          </div>
        </div>
      </teleport>
    </form>

    <!-- Actions -->
    <div class="border-t border-border bg-background p-4 pb-6 mx-4 mb-4">
      <div class="flex items-center gap-3">
        <button type="button" class="flex-1 bg-muted text-muted-foreground font-medium py-3 rounded-lg hover:bg-muted/80 transition-colors" @click="$emit('cancel')">
          انصراف
        </button>
        <button type="button" class="flex-1 bg-primary text-primary-foreground font-medium py-3 rounded-lg hover:bg-primary/90 transition-colors" @click="handleSubmit">
          <i class="ti ti-check mr-1" />
          ذخیره
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue';
import { useFormStore } from '~/stores/form'

const formStore = useFormStore()

// Icon color from store
const iconColor = computed(() => {
  if (formStore.iconColor?.background && formStore.iconColor.background !== 'transparent') {
    return formStore.iconColor.background
  }
  return '#000000'
})

const props = defineProps({ link: Object });
const emit = defineEmits(['submit', 'cancel', 'back', 'delete']);

const step = ref(1);
const scheduleOptions = [
  { label: 'باز در ساعات مشخص', value: 'selected' },
  { label: 'همیشه باز', value: 'always' },
  { label: 'فقط با هماهنگی قبلی', value: 'appointment' },
];

const mode = ref<'selected' | 'always' | 'appointment' | null>(props.link?.mode ?? null);
const form = reactive({
  title: props.link?.title || '',
});
const days = ref(props.link?.days?.length
  ? props.link.days.map((d: any) => ({ ...d }))
  : [
      { name: 'شنبه', enabled: true, type: 'hours', start: '09:00', end: '18:00' },
      { name: 'یکشنبه', enabled: true, type: 'hours', start: '09:00', end: '18:00' },
      { name: 'دوشنبه', enabled: true, type: 'hours', start: '09:00', end: '18:00' },
      { name: 'سه‌شنبه', enabled: true, type: 'hours', start: '09:00', end: '18:00' },
      { name: 'چهارشنبه', enabled: true, type: 'hours', start: '09:00', end: '18:00' },
      { name: 'پنج‌شنبه', enabled: true, type: 'hours', start: '09:00', end: '18:00' },
      { name: 'جمعه', enabled: false, type: 'closed' },
    ]
);
const editIndex = ref<number | null>(null);

const toPersianDigits = (str: string) => (str || '').replace(/\d/g, d => '۰۱۲۳۴۵۶۷۸۹'[+d]);
const formatTime = (time: string) => {
  if (!time) return 'نامشخص';
  const [h, m] = time.split(':');
  const hour = parseInt(h, 10);
  if (isNaN(hour) || !m) return 'نامشخص';
  return `${toPersianDigits(h)}:${toPersianDigits(m)}`;
};
function handleSubmit() {
  let result;
  if (mode.value === 'always') {
    result = days.value.map((d: any) => ({ ...d, enabled: true, type: '24h' }));
  } else if (mode.value === 'appointment') {
    result = days.value.map((d: any) => ({ ...d, enabled: true, type: 'appointment' }));
  } else {
    result = days.value;
  }
  const updatedLink = {
    ...props.link, // لینک قبلی
    title: form.title, // مقدار جدید
    mode: mode.value,
    days: result,
    action: 'workhours',
    type: 'block',
  };

  // ۳. ارسال لینک جدید با ایونت submit
  emit('submit', updatedLink);
}
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
</script>

<style scoped>
.form-switch-primary {
  appearance: none;
  background-color: hsl(var(--muted));
  border-radius: 9999px;
  width: 36px;
  height: 20px;
  position: relative;
  cursor: pointer;
  transition: background-color 0.2s;
}
.form-switch-primary:checked {
  background-color: hsl(var(--primary));
}
.form-switch-primary::before {
  content: "";
  position: absolute;
  width: 16px;
  height: 16px;
  background: hsl(var(--background));
  border-radius: 9999px;
  top: 2px;
  left: 2px;
  transition: transform 0.2s ease;
}
.form-switch-primary:checked::before {
  transform: translateX(16px);
}
</style>



