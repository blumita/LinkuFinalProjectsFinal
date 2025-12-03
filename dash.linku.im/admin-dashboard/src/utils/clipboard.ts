/**
 * Copy text to clipboard with fallback for mobile browsers
 * @param text Text to copy
 * @returns Promise that resolves when copy is successful
 */
export async function copyToClipboard(text: string): Promise<void> {
  try {
    // Try modern clipboard API first (works in HTTPS and localhost)
    if (navigator.clipboard && navigator.clipboard.writeText) {
      await navigator.clipboard.writeText(text)
      return
    }
    
    // Fallback for older browsers and mobile
    const textArea = document.createElement('textarea')
    textArea.value = text
    
    // Make textarea invisible and off-screen
    textArea.style.position = 'fixed'
    textArea.style.left = '-999999px'
    textArea.style.top = '-999999px'
    textArea.style.opacity = '0'
    
    document.body.appendChild(textArea)
    
    // Select text
    textArea.focus()
    textArea.select()
    
    // For iOS compatibility
    textArea.setSelectionRange(0, 99999)
    
    try {
      // Execute copy command
      const successful = document.execCommand('copy')
      if (!successful) {
        throw new Error('execCommand returned false')
      }
    } finally {
      // Always remove textarea
      document.body.removeChild(textArea)
    }
  } catch (err) {
    console.error('Failed to copy text:', err)
    throw new Error('کپی کردن انجام نشد. لطفاً دوباره تلاش کنید.')
  }
}
