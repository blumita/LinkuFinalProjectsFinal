<template>
  <div class="w-full rounded-2xl overflow-hidden shadow bg-white/90 border">
    <!-- Header -->
    <div class="flex items-center justify-between px-3 pt-3 pb-1">
      <div class="flex items-center gap-2">
        <span class="text-xs text-gray-700 font-bold">
          {{ link.title || 'ویدیوی تستی' }}
        </span>
      </div>
    </div>

    <!-- Video Container -->
    <div class="relative aspect-video bg-black rounded-t-2xl overflow-hidden">
      <!-- Embed (YouTube / Aparat) -->
      <iframe
          v-if="isEmbed"
          :src="embedUrl"
          frameborder="0"
          allowfullscreen
          class="absolute inset-0 w-full h-full object-cover"
      ></iframe>

      <!-- HTML5 Video -->
      <video
          v-else
          ref="videoRef"
          class="video-js w-full h-full object-cover"
          playsinline
          preload="auto"
          muted
      ></video>

      <!-- Poster (فریم میانی ویدیو) -->
      <img
          v-if="showPoster && !isEmbed"
          :src="posterImage"
          class="absolute inset-0 w-full h-full object-cover pointer-events-none"
          alt="poster"
      />
    </div>

    <!-- کنترل‌ها -->
    <div
        v-if="!isEmbed"
        class="flex items-center justify-between px-4 py-3 bg-gray-50 border-t"
    >
      <div class="flex items-center gap-3">
        <button
            @click="togglePlay"
            class="p-2 rounded hover:bg-gray-200 transition text-gray-700"
        >
          <i :class="isPlaying ? 'ti ti-player-pause' : 'ti ti-player-play'" class="text-xl"></i>
        </button>
        <button
            @click="toggleMute"
            class="p-2 rounded hover:bg-gray-200 transition text-gray-700"
        >
          <i :class="isMuted ? 'ti ti-volume-3' : 'ti ti-volume'" class="text-xl"></i>
        </button>
      </div>
      <button
          @click="toggleFullscreen"
          class="p-2 rounded hover:bg-gray-200 transition text-gray-700"
      >
        <i class="ti ti-arrows-maximize text-xl"></i>
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onBeforeUnmount, nextTick } from 'vue'
import videojs from 'video.js'
import 'video.js/dist/video-js.css'

const props = defineProps({
  link: { type: Object, required: true }
})

const videoRef = ref(null)
let player = null

const isPlaying = ref(false)
const isMuted = ref(false)
const showPoster = ref(true)
const posterImage = ref('') // تصویر پوستر اختصاصی

// ------------------- تشخیص نوع ویدیو -------------------
const isYoutube = (url) => /youtu\.be|youtube\.com/.test(url)
const isAparat = (url) => /aparat\.com\/v\//.test(url)
const getYoutubeId = (url) => url.match(/(?:v=|\/)([0-9A-Za-z_-]{11})/)?.[1]
const getAparatId = (url) => url.match(/aparat\.com\/v\/([^/?]+)/)?.[1]

const isEmbed = computed(() => isYoutube(props.link.value) || isAparat(props.link.value))
const embedUrl = computed(() => {
  if (isYoutube(props.link.value)) {
    const id = getYoutubeId(props.link.value)
    return id ? `https://www.youtube.com/embed/${id}` : ''
  }
  if (isAparat(props.link.value)) {
    const id = getAparatId(props.link.value)
    return id ? `https://www.aparat.com/video/video/embed/videohash/${id}/vt/frame` : ''
  }
  return ''
})

// ------------------- ساخت پوستر از فریم وسط ویدیو -------------------
const generatePosterFromVideo = async (targetSec = 2) => {
  return new Promise((resolve) => {
    const video = videoRef.value
    const canvas = document.createElement('canvas')
    const context = canvas.getContext('2d')

    video.addEventListener(
        'loadedmetadata',
        () => {
          // اگر ویدیو کوتاه‌تر از 2 ثانیه بود، از وسطش بگیر
          const duration = video.duration
          const captureTime = duration > targetSec ? targetSec : duration / 2
          video.currentTime = captureTime
        },
        { once: true }
    )

    video.addEventListener(
        'seeked',
        () => {
          canvas.width = video.videoWidth
          canvas.height = video.videoHeight
          context.drawImage(video, 0, 0, canvas.width, canvas.height)
          const imgData = canvas.toDataURL('image/jpeg')
          resolve(imgData)
        },
        { once: true }
    )
  })
}

// ------------------- واکنش به تغییر لینک -------------------
watch(
    () => props.link.value,
    async (src) => {
      if (!src || isEmbed.value) return
      player.src({ src, type: 'video/mp4' })
      showPoster.value = true
      posterImage.value = await generatePosterFromVideo()
    }
)

// ------------------- راه‌اندازی Player -------------------
onMounted(async () => {
  if (isEmbed.value) return
  nextTick(async () => {
    player = videojs(videoRef.value, {
      controls: false,
      autoplay: false,
      preload: 'auto',
      fluid: true,
      sources: [{ src: props.link.value, type: 'video/mp4' }]
    })

    // ایجاد پوستر از ثانیه‌ی 2 (یا وسط)
    posterImage.value = await generatePosterFromVideo()

    player.on('play', () => {
      isPlaying.value = true
      showPoster.value = false
    })
    player.on('pause', () => (isPlaying.value = false))
    player.on('ended', () => (showPoster.value = true))
  })
})

onBeforeUnmount(() => {
  if (player) player.dispose()
})

// ------------------- کنترل‌ها -------------------
const togglePlay = () => {
  if (player) (player.paused() ? player.play() : player.pause())
}
const toggleMute = () => {
  if (player) player.muted(!player.muted())
}
const toggleFullscreen = () => {
  if (isEmbed.value) {
    const iframe = document.querySelector('iframe')
    if (iframe?.requestFullscreen) iframe.requestFullscreen()
  } else if (player) {
    player.isFullscreen() ? player.exitFullscreen() : player.requestFullscreen()
  }
}
</script>

<style scoped>
.video-js {
  width: 100% !important;
  height: 100% !important;
  object-fit: cover !important;
}
</style>