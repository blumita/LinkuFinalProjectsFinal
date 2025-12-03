import { ref } from 'vue'

const isDarkMode = ref(false)
let memoryDarkMode: boolean | null = null

// Safe storage access
const safeGetStorage = (key: string): string | null => {
  try {
    return localStorage.getItem(key)
  } catch (e) {
    return null
  }
}

const safeSetStorage = (key: string, value: string): void => {
  try {
    localStorage.setItem(key, value)
  } catch (e) {
    // Silently fail
  }
}

// Initialize immediately when module loads
const initDarkModeImmediately = () => {
  const savedDarkMode = safeGetStorage('darkMode')
  if (savedDarkMode !== null) {
    isDarkMode.value = savedDarkMode === 'true'
    memoryDarkMode = isDarkMode.value
  } else if (memoryDarkMode !== null) {
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
      safeSetStorage('darkMode', 'true')
    } else {
      document.documentElement.classList.remove('dark')
      safeSetStorage('darkMode', 'false')
    }
  }

  const initDarkMode = () => {
    const savedDarkMode = safeGetStorage('darkMode')
    if (savedDarkMode !== null) {
      isDarkMode.value = savedDarkMode === 'true'
      memoryDarkMode = isDarkMode.value
    } else if (memoryDarkMode !== null) {
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
