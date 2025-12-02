/**
 * Utility function to completely clear auth data and redirect to login
 */
export const forceLogout = () => {
    if (typeof window === 'undefined') return
    
    // Clear all localStorage auth items
    localStorage.removeItem('auth_token')
    localStorage.removeItem('token')
    localStorage.removeItem('authToken')
    localStorage.removeItem('user')
    localStorage.removeItem('userStore')
    localStorage.removeItem('formStore')
    
    // Clear all cookies
    const cookies = document.cookie.split(';')
    for (const cookie of cookies) {
        const name = cookie.split('=')[0].trim()
        document.cookie = `${name}=; path=/; max-age=0; expires=Thu, 01 Jan 1970 00:00:00 UTC`
    }
    
    // Redirect to login
    window.location.href = '/auth/login'
}

/**
 * Check if user is authenticated
 */
export const isAuthenticated = (): boolean => {
    if (typeof window === 'undefined') return false
    
    const token = localStorage.getItem('auth_token')
    const cookieToken = document.cookie.split('; ').find(row => row.startsWith('auth_token='))?.split('=')[1]
    
    return !!(token || cookieToken)
}
