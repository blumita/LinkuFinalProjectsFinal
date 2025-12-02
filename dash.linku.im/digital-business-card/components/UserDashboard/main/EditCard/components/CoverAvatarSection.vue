<template>
  <!-- Avatar and Cover Section -->
  <section class="relative rounded-xl bg-card border border-border h-36 hover:shadow-md transition-shadow">
    <!-- Cover Image Background -->
    <div 
      v-if="coverImageUrl" 
      class="absolute inset-0 w-full h-full"
    >
      <img 
        :src="coverImageUrl" 
        alt="Cover Photo" 
        class="w-full h-full object-cover"
      />
      <div class="absolute inset-0 bg-black/10"></div>
    </div>
    
    <!-- Edit Button -->
    <button 
      @click="showBottomSheet = true"
      class="absolute left-4 top-4 rounded-full bg-background/90 backdrop-blur-sm hover:bg-background text-foreground text-xs px-3 py-2 transition-all shadow-lg hover:shadow-xl border border-border/50"
    >
      ویرایش تصویر
    </button>
    
    <div class="absolute -bottom-10 left-1/2 transform -translate-x-1/2">
      <div class="relative">
        <button 
          @click="showBottomSheet = true"
          class="w-24 h-24 rounded-full bg-card ring-4 ring-card border border-border grid place-items-center hover:bg-muted/20 transition-colors overflow-hidden"
        >
          <!-- Profile Image -->
          <template v-if="profileImageUrl">
            <img 
              :src="profileImageUrl" 
              alt="Profile Photo" 
              class="w-full h-full object-cover rounded-full"
            />
          </template>
          <!-- Default Profile Icon -->
          <template v-else>
            <svg viewBox="0 0 24 24" class="w-10 h-10 text-muted-foreground">
              <path fill="currentColor" d="M12 12a4 4 0 1 0-4-4a4 4 0 0 0 4 4Zm0 2c-4.67 0-8 2.33-8 5v1h16v-1c0-2.67-3.33-5-8-5Z"/>
            </svg>
          </template>
        </button>
        <button 
          @click="showBottomSheet = true"
          class="absolute bottom-0 -left-1 w-10 h-10 rounded-full bg-muted border-2 border-card grid place-items-center hover:bg-primary/80 transition-colors overflow-hidden"
        >
          <!-- Logo Image -->
          <template v-if="logoImageUrl">
            <img 
              :src="logoImageUrl" 
              alt="Company Logo" 
              class="w-full h-full object-cover rounded-full"
            />
          </template>
          <!-- Default Logo Icon -->
          <template v-else>
            <span class="text-xs font-bold text-muted-foreground">لوگو</span>
          </template>
        </button>
      </div>
    </div>
  </section>
  <div class="h-16"></div>

  <!-- Bottom Sheet -->
  <BottomSheet 
    v-model="showBottomSheet"
    size="auto"
    :closable="false"
  >
    <div class="p-6">
      <!-- Add Cover Photo -->
      <button 
        @click="selectCoverPhoto"
        class="w-full mb-6 p-6 rounded-2xl bg-card border border-border hover:bg-muted transition-colors flex flex-col items-center justify-center gap-3"
      >
        <div class="w-12 h-12 rounded-xl bg-primary flex items-center justify-center">
          <svg viewBox="0 0 24 24" class="w-6 h-6 text-primary-foreground">
            <path fill="currentColor" d="M5 21q-.825 0-1.413-.588T3 19V5q0-.825.588-1.413T5 3h14q.825 0 1.413.588T21 5v14q0 .825-.588 1.413T19 21H5Zm1-4h12l-3.75-5-3 4L9 13l-3 4Z"/>
          </svg>
        </div>
        <span class="text-foreground font-medium text-base">افزودن عکس کاور</span>
      </button>

      <!-- Add Profile and Logo -->
      <div class="grid grid-cols-2 gap-4 mb-6">
        <!-- Add Profile -->
        <button 
          @click="selectProfilePhoto"
          class="p-6 rounded-2xl bg-card border border-border hover:bg-muted transition-colors flex flex-col items-center justify-center gap-3"
        >
          <div class="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
            <svg viewBox="0 0 24 24" class="w-5 h-5 text-primary-foreground">
              <path fill="currentColor" d="M12 12a4 4 0 1 0-4-4a4 4 0 0 0 4 4Zm0 2c-4.67 0-8 2.33-8 5v1h16v-1c0-2.67-3.33-5-8-5Z"/>
            </svg>
          </div>
          <span class="text-foreground font-medium text-sm">افزودن پروفایل</span>
        </button>

        <!-- Add Logo -->
        <button 
          @click="selectCompanyLogo"
          class="p-6 rounded-2xl bg-card border border-border hover:bg-muted transition-colors flex flex-col items-center justify-center gap-3"
        >
          <div class="w-10 h-10 rounded-full border-2 border-primary flex items-center justify-center">
            <svg viewBox="0 0 24 24" class="w-4 h-4 text-primary">
              <path fill="currentColor" d="M11 11V6h2v5h5v2h-5v5h-2v-5H6v-2z"/>
            </svg>
          </div>
          <span class="text-foreground font-medium text-sm">افزودن لوگو</span>
        </button>
      </div>

      <!-- Cancel Button -->
      <button 
        @click="showBottomSheet = false"
        class="w-full p-4 rounded-2xl bg-muted border border-border text-foreground font-semibold text-base transition-colors hover:bg-muted/80"
      >
        انصراف
      </button>
    </div>
  </BottomSheet>

  <!-- Image Cropper Modal -->
  <ImageCropperModal
    :show="showImageCropper"
    :image-file="selectedFile || undefined"
    :aspect-ratio="getAspectRatio()"
    :field-name="cropType"
    @close="closeImageCropper"
    @cropped="handleImageCropped"
  />
</template>

<script setup lang="ts">
import { ref, nextTick, computed } from 'vue'
import BottomSheet from '@/components/ui/BottomSheet.vue'
import ImageCropperModal from '../../../modals/ImageCropperModal.vue'
import { useFormStore } from '~/stores/form'

const form = useFormStore()

const showBottomSheet = ref(false)
const showImageCropper = ref(false)
const selectedFile = ref<File | null>(null)
const cropType = ref<'cover' | 'profile' | 'logo'>('cover')

// Use computed properties to sync with form store
// استفاده از getter های safe برای نمایش (برای Mixed Content fix)
const coverImageUrl = computed({
  get: () => form.safeCoverImage || '',
  set: (value) => { form.coverImage = value }
})

const profileImageUrl = computed({
  get: () => form.safeProfileImage || '',
  set: (value) => { form.profileImage = value }
})

const logoImageUrl = computed({
  get: () => form.safeLogoImage || '',
  set: (value) => { form.logoImage = value }
})

// Photo Functions
const selectCoverPhoto = () => {
  showBottomSheet.value = false
  triggerFileInput('cover')
}

const selectProfilePhoto = () => {
  showBottomSheet.value = false
  triggerFileInput('profile')
}

const selectCompanyLogo = () => {
  showBottomSheet.value = false
  triggerFileInput('logo')
}

const triggerFileInput = (type: 'cover' | 'profile' | 'logo') => {
  cropType.value = type
  
  // Create file input
  const input = document.createElement('input')
  input.type = 'file'
  input.accept = 'image/*'
  input.onchange = (event) => {
    const file = (event.target as HTMLInputElement).files?.[0]
    if (file) {
      selectedFile.value = file
      showImageCropper.value = true
    }
  }
  input.click()
}

const handleImageCropped = async (croppedImageUrl: string, fieldName: string) => {
  
  // Save the cropped image to form store
  switch (fieldName) {
    case 'cover':
      coverImageUrl.value = croppedImageUrl
      break
    case 'profile':
      profileImageUrl.value = croppedImageUrl
      break
    case 'logo':
      logoImageUrl.value = croppedImageUrl
      break
    default:
  }
  
  // Wait for DOM update
  await nextTick()
  
  showImageCropper.value = false
  selectedFile.value = null
}

const closeImageCropper = () => {
  showImageCropper.value = false
  selectedFile.value = null
}

// Get aspect ratio based on crop type
const getAspectRatio = () => {
  switch (cropType.value) {
    case 'cover': return 16/9  // Cover photo aspect ratio
    case 'profile': return 1   // Square for profile
    case 'logo': return 1      // Square for logo
    default: return 1
  }
}
</script>