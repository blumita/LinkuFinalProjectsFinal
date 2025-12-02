import { computed } from 'vue'
import { useFormStore } from '~/stores/form'

/**
 * Safe wrapper for form store that handles SSR/client hydration gracefully
 */
export const useSafeFormStore = () => {
  return computed(() => {
    // With @pinia/nuxt module, this should work properly in both SSR and client
    try {
      return useFormStore()
    } catch (error) {
      // Fallback for edge cases
      return {
        name: '',
        bio: '',
        job: '',
        company: '',
        profileImage: null,
        logoImage: null,
        coverImage: null,
        layout: 'right',
        themeColor: { background: '#ffffff' },
        iconColor: { background: '#000000' },
        isLeadCaptureEnabled: false,
        links: [],
        formTitle: '',
        connectButtonText: '',
        formDisclaimer: '',
        fields: []
      }
    }
  })
}
