  <template>
    <div class="flex flex-col items-center">
      <!-- Outer wrapper برای موقعیت ضربدر -->
      <div :class="['relative', wide ? 'w-full h-32 rounded-lg' : 'w-28 h-28 rounded-full']">
        <!-- تصویر یا placeholder -->
        <div
          :class="[
            'w-full h-full bg-card border border-border flex items-center justify-center transition overflow-hidden',
            wide ? 'rounded-lg' : 'rounded-full',
            disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:border-primary'
          ]"
        >
          <input
            type="file"
            accept="image/*,video/*,.gif"
            class="absolute inset-0 opacity-0 w-full"
            :class="disabled ? 'cursor-not-allowed' : 'cursor-pointer'"
            :disabled="disabled"
            @change="onChange"
          />

          <!-- Uploaded image -->
          <template v-if="image">
            <img :src="image" :class="[ 'w-full h-full object-cover', wide ? 'rounded-lg' : 'rounded-full' ]" />
          </template>

          <!-- Default placeholder -->
          <template v-else>
            <div class="flex flex-col items-center justify-center text-center px-1">
              <i :class="['text-2xl text-muted-foreground', wide ? 'ti ti-photo' : 'ti ti-user']"></i>
              <span class="text-[10px] text-muted-foreground mt-1 leading-tight">
                <template v-if="disabled">غیرفعال</template>
                <template v-else-if="field === 'profileImage'">عکس پروفایل</template>
                <template v-else-if="field === 'coverImage'">عکس هدر</template>
                <template v-else-if="field === 'logoImage'">لوگو شرکت</template>
                <template v-else>انتخاب فایل</template>
              </span>
            </div>
          </template>
        </div>

        <!-- دکمه حذف -->
        <button
          v-if="image && !disabled"
          type="button"
          class="absolute -top-0 right-2 w-6 h-6 bg-background border border-border text-muted-foreground rounded-full flex items-center justify-center hover:bg-destructive hover:text-destructive-foreground transition text-xs shadow"
          @click.stop="removeImage"
        >
          <i class="ti ti-x text-sm"></i>
        </button>
      </div>
    </div>
  </template> 
   <script setup>
  const props = defineProps({
    image: String,
    field: String,
    aspectRatio: Number,
    wide: Boolean,
    disabled: Boolean
  })
  
  const emit = defineEmits(['select', 'remove'])
  
  const onChange = (e) => {
    if (props.disabled) return
    const file = e.target.files[0]
    if (file) emit('select', { file, field: props.field, aspectRatio: props.aspectRatio })
    e.target.value = ''
  }
  
  const removeImage = () => {
    if (props.disabled) return
    emit('remove', props.field)
  }
  </script>
  