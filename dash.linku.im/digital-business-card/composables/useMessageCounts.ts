import { ref, computed } from 'vue'
import { useFormStore } from '~/stores/form'
import { useNuxtApp } from 'nuxt/app'
import type { AxiosInstance } from 'axios'

export const useMessageCounts = () => {
  const luckyDiceCount = ref(0)
  const luckyEggCount = ref(0)
  const luckyWheelCount = ref(0)
  const infoFormCount = ref(0)
  const questionBoxCount = ref(0)
  const pollCount = ref(0)
  
  const formStore = useFormStore()
  const { $axios } = useNuxtApp()
  const axios = $axios as AxiosInstance
  
  const totalMessageCount = computed(() => {
    return luckyDiceCount.value + luckyEggCount.value + luckyWheelCount.value + 
           infoFormCount.value + questionBoxCount.value + pollCount.value
  })
  
  const formattedMessageCount = computed(() => {
    return totalMessageCount.value > 99 ? '99+' : totalMessageCount.value.toString()
  })
  
  const fetchCounts = async () => {
    const cardId = formStore.defaultCard?.id
    if (!cardId || !axios) return
    
    try {
      // تاس شانس - استفاده از API خاص count
      const diceResponse = await axios.get(`club/${cardId}/luckyDice/resultCount`)
      const diceData = diceResponse.data?.data || {}
      luckyDiceCount.value = diceData.unreadCount || 0
      
      // تخم شانس - استفاده از API خاص count
      const eggResponse = await axios.get(`club/${cardId}/luckyEgg/resultCount`)
      const eggData = eggResponse.data?.data || {}
      luckyEggCount.value = eggData.unreadCount || 0
      
      // چرخ شانس - استفاده از API خاص count
      const wheelResponse = await axios.get(`club/${cardId}/luckyWheel/resultCount`)
      const wheelData = wheelResponse.data?.data || {}
      luckyWheelCount.value = wheelData.unreadCount || 0
      
      // فرم اطلاعات - استفاده از API خاص count
      const [leadRes, formRes] = await Promise.all([
        axios.get(`v1/cards/${cardId}/leads/leadsCount`),
        axios.get(`v1/cards/${cardId}/forms/formsCount`)
      ])
      const leadData = leadRes.data?.data || {}
      const formData = formRes.data?.data || {}
      infoFormCount.value = (leadData.unreadCount || 0) + (formData.unreadCount || 0)
      
      // جعبه سوالات - استفاده از API خاص count
      const questionResponse = await axios.get(`club/${cardId}/questions/questionsCount`)
      const questionData = questionResponse.data?.data || {}
      questionBoxCount.value = questionData.unreadCount || 0
      
      // نظرسنجی - استفاده از API خاص count (فقط total count داره)
      const pollResponse = await axios.get(`card/${cardId}/poll/votes`, {
        params: { page: 1, perPage: 1 }
      })
      // Poll API فعلاً فقط total داره، وقتی unread اضافه شد به unreadCount تغییر بده
      pollCount.value = pollResponse.data?.data?.pagination?.total || 0
      
      // بروزرسانی badge
      formStore.setInboxBadge(totalMessageCount.value)
    } catch (error) {
      console.error('Error fetching message counts:', error)
    }
  }
  
  // Fetch on mount
  if (process.client) {
    fetchCounts()
  }
  
  return {
    luckyDiceCount,
    luckyEggCount,
    luckyWheelCount,
    infoFormCount,
    questionBoxCount,
    pollCount,
    totalMessageCount,
    formattedMessageCount,
    fetchCounts
  }
}
