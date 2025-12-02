/**
 * Safe storage utility that handles SecurityError when localStorage is not accessible
 * (e.g., in sandboxed iframes)
 */

class SafeStorage {
  private fallbackStorage: Map<string, string> = new Map()
  private isLocalStorageAvailable: boolean | null = null

  private checkLocalStorageAvailability(): boolean {
    if (this.isLocalStorageAvailable !== null) {
      return this.isLocalStorageAvailable
    }

    try {
      if (typeof window === 'undefined') {
        this.isLocalStorageAvailable = false
        return false
      }

      const testKey = '__localStorage_test__'
      window.localStorage.setItem(testKey, 'test')
      window.localStorage.removeItem(testKey)
      this.isLocalStorageAvailable = true
      return true
    } catch (error) {
      this.isLocalStorageAvailable = false
      return false
    }
  }

  getItem(key: string): string | null {
    try {
      if (this.checkLocalStorageAvailability()) {
        return window.localStorage.getItem(key)
      } else {
        return this.fallbackStorage.get(key) || null
      }
    } catch (error) {
      return this.fallbackStorage.get(key) || null
    }
  }

  setItem(key: string, value: string): void {
    try {
      if (this.checkLocalStorageAvailability()) {
        window.localStorage.setItem(key, value)
      } else {
        this.fallbackStorage.set(key, value)
      }
    } catch (error) {
      this.fallbackStorage.set(key, value)
    }
  }

  removeItem(key: string): void {
    try {
      if (this.checkLocalStorageAvailability()) {
        window.localStorage.removeItem(key)
      } else {
        this.fallbackStorage.delete(key)
      }
    } catch (error) {
      this.fallbackStorage.delete(key)
    }
  }

  clear(): void {
    try {
      if (this.checkLocalStorageAvailability()) {
        window.localStorage.clear()
      } else {
        this.fallbackStorage.clear()
      }
    } catch (error) {
      this.fallbackStorage.clear()
    }
  }
}

export const safeStorage = new SafeStorage()
