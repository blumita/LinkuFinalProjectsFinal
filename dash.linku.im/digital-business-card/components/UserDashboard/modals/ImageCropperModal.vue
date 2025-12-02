<template>
  <Transition name="fade">
    <div v-if="show" class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div class="bg-card rounded-lg shadow-xl w-full max-w-2xl mx-4 border border-border">
        <div class="p-4 border-b border-border flex justify-between items-center">
          <h3 class="text-lg font-medium text-foreground">ویرایش تصویر</h3>
          <button @click="closeModal" class="text-muted-foreground hover:text-foreground transition-colors">
            <i class="ti ti-x text-xl"></i>
          </button>
        </div>

        <div class="p-4">
          <div class="h-96 w-full relative bg-muted/30 rounded-lg overflow-hidden border border-border">
            <Cropper
              v-if="imageUrl"
              ref="cropperRef"
              class="cropper"
              :src="imageUrl"
              :stencil-props="{
                aspectRatio: aspectRatio,
                previewClass: 'cropper-preview'
              }"
              :auto-zoom="true"
              :background="false"
            />
            <div v-else class="h-full flex flex-col items-center justify-center text-muted-foreground">
              <i class="ti ti-photo text-4xl mb-2"></i>
              <p class="text-sm">در حال آماده‌سازی تصویر...</p>
            </div>
          </div>
        </div>

        <div class="p-4 border-t border-border flex justify-end gap-2">
          <button 
            @click="closeModal"
            class="px-4 py-2 border border-border rounded-md text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
          >
            انصراف
          </button>
          <button 
            @click="applyCrop"
            :disabled="!imageUrl"
            class="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            تایید و ذخیره
          </button>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script lang="ts" setup>
import { ref, watch, onUnmounted } from 'vue';
import { Cropper } from 'vue-advanced-cropper';
import 'vue-advanced-cropper/dist/style.css';

const props = defineProps({
  show: Boolean,
  imageFile: File,
  aspectRatio: Number,
  fieldName: String
})

const emit = defineEmits(['close', 'cropped'])

const cropperRef = ref<InstanceType<typeof Cropper> | null>(null)
const imageUrl = ref<string | null>(null)

const createImageUrl = (file: File) => {
  return new Promise<string>((resolve) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      resolve(e.target?.result as string)
    }
    reader.readAsDataURL(file)
  })
}

const closeModal = () => {
  emit('close')
}

const applyCrop = async () => {
  if (!cropperRef.value || !imageUrl.value) return

  try {
    const { canvas } = cropperRef.value.getResult()
    if (!canvas) return

    const blob = await new Promise<Blob | null>((resolve) => {
      canvas.toBlob(resolve, 'image/jpeg', 0.9)
    })

    if (blob) {
      const reader = new FileReader()
      reader.onload = (e) => {
        if (e.target?.result) {
          emit('cropped', e.target.result, props.fieldName || 'image')
          closeModal()
        }
      }
      reader.readAsDataURL(blob)
    }
  } catch (error) {
  }
}

watch(() => props.imageFile, async (newFile) => {
  if (newFile) {
    imageUrl.value = await createImageUrl(newFile)
  } else {
    imageUrl.value = null
  }
}, { immediate: true })

onUnmounted(() => {
  if (imageUrl.value) {
    URL.revokeObjectURL(imageUrl.value)
  }
})
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.cropper-preview {
  border-radius: 50%;
}
</style>