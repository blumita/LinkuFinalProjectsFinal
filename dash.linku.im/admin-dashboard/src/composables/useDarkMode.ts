import { ref } from 'vue'

const isDarkMode = ref(false)
let memoryDarkMode: boolean | null = null

// No storage access at all - pure memory
const safeGetStorage = (): boolean | null => {
  return memoryDarkMode
}

const safeSetStorage = (value: boolean): void => {
  memoryDarkMode = value
}

// Initialize immediately when module loads
const initDarkModeImmediately = () => {
  if (memoryDarkMode !== null) {
    isDarkMode.value = memoryDarkMode
  } else {
    isDarkMode.value = window.matchMedia('(prefers-color-scheme: dark)').matches
    memoryDarkMode = isDarkMode.value
  }

  if (isDarkMode.value) {
    document.documentElement.classList.add('dark')
  } else {
    document.documentElement.classList.remove('dark')
  }
}

// Initialize on module load
if (typeof window !== 'undefined') {
  initDarkModeImmediately()
}

export function useDarkMode() {
  const toggleDarkMode = () => {
    isDarkMode.value = !isDarkMode.value
    memoryDarkMode = isDarkMode.value
    if (isDarkMode.value) {
      document.documentElement.classList.add('dark')
      safeSetStorage(true)
    } else {
      document.documentElement.classList.remove('dark')
      safeSetStorage(false)
    }
  }

  const initDarkMode = () => {
    if (memoryDarkMode !== null) {
      isDarkMode.value = memoryDarkMode
    } else {
      isDarkMode.value = window.matchMedia('(prefers-color-scheme: dark)').matches
      memoryDarkMode = isDarkMode.value
    }

    if (isDarkMode.value) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }

  return {
    isDarkMode,
    toggleDarkMode,
    initDarkMode
  }
}
