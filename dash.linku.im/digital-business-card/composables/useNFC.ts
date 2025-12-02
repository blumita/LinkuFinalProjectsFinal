// composables/useNFC.ts
// مدیریت NFC برای PWA

interface NFCReadResult {
  serialNumber: string
  records: Array<{
    recordType: string
    data: string
    encoding?: string
    lang?: string
  }>
}

export function useNFC() {
  const isSupported = ref(false)
  const isScanning = ref(false)
  const error = ref<string | null>(null)
  const lastRead = ref<NFCReadResult | null>(null)

  let ndefReader: any = null
  let abortController: AbortController | null = null

  // بررسی پشتیبانی NFC
  const checkSupport = () => {
    if (typeof window !== 'undefined' && 'NDEFReader' in window) {
      isSupported.value = true
      return true
    }
    isSupported.value = false
    return false
  }

  // شروع اسکن NFC
  const startScan = async (onRead?: (result: NFCReadResult) => void): Promise<boolean> => {
    if (!checkSupport()) {
      error.value = 'دستگاه شما از NFC پشتیبانی نمی‌کند'
      return false
    }

    try {
      ndefReader = new (window as any).NDEFReader()
      abortController = new AbortController()
      
      await ndefReader.scan({ signal: abortController.signal })
      isScanning.value = true
      error.value = null

      ndefReader.addEventListener('reading', ({ serialNumber, message }: any) => {
        const records = Array.from(message.records).map((record: any) => {
          const decoder = new TextDecoder(record.encoding || 'utf-8')
          return {
            recordType: record.recordType,
            data: decoder.decode(record.data),
            encoding: record.encoding,
            lang: record.lang
          }
        })

        const result: NFCReadResult = { serialNumber, records }
        lastRead.value = result
        
        if (onRead) {
          onRead(result)
        }
      })

      ndefReader.addEventListener('readingerror', () => {
        error.value = 'خطا در خواندن NFC'
      })

      return true
    } catch (e: any) {
      isScanning.value = false
      
      if (e.name === 'NotAllowedError') {
        error.value = 'دسترسی به NFC داده نشده است'
      } else if (e.name === 'NotSupportedError') {
        error.value = 'NFC در این مرورگر پشتیبانی نمی‌شود'
      } else {
        error.value = 'خطا در شروع اسکن NFC'
      }
      
      return false
    }
  }

  // توقف اسکن
  const stopScan = () => {
    if (abortController) {
      abortController.abort()
      abortController = null
    }
    isScanning.value = false
  }

  // نوشتن روی NFC تگ
  const write = async (data: string | object): Promise<boolean> => {
    if (!checkSupport()) {
      error.value = 'دستگاه شما از NFC پشتیبانی نمی‌کند'
      return false
    }

    try {
      const writer = new (window as any).NDEFReader()
      
      const content = typeof data === 'object' ? JSON.stringify(data) : data
      
      await writer.write({
        records: [
          { recordType: 'text', data: content }
        ]
      })
      
      return true
    } catch (e: any) {
      if (e.name === 'NotAllowedError') {
        error.value = 'دسترسی به نوشتن NFC داده نشده است'
      } else {
        error.value = 'خطا در نوشتن روی NFC'
      }
      return false
    }
  }

  // نوشتن URL روی NFC تگ
  const writeURL = async (url: string): Promise<boolean> => {
    if (!checkSupport()) {
      error.value = 'دستگاه شما از NFC پشتیبانی نمی‌کند'
      return false
    }

    try {
      const writer = new (window as any).NDEFReader()
      
      await writer.write({
        records: [
          { recordType: 'url', data: url }
        ]
      })
      
      return true
    } catch (e: any) {
      error.value = 'خطا در نوشتن URL روی NFC'
      return false
    }
  }

  // پاکسازی هنگام unmount
  onUnmounted(() => {
    stopScan()
  })

  // چک اولیه
  if (typeof window !== 'undefined') {
    checkSupport()
  }

  return {
    isSupported: readonly(isSupported),
    isScanning: readonly(isScanning),
    error: readonly(error),
    lastRead: readonly(lastRead),
    checkSupport,
    startScan,
    stopScan,
    write,
    writeURL
  }
}
