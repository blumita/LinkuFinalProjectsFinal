import { ref, computed } from 'vue';
import { u as useFormStore } from './form-CUJQskNk.mjs';
import { a as useNuxtApp } from './server.mjs';

const useMessageCounts = () => {
  const luckyDiceCount = ref(0);
  const luckyEggCount = ref(0);
  const luckyWheelCount = ref(0);
  const infoFormCount = ref(0);
  const questionBoxCount = ref(0);
  const pollCount = ref(0);
  const formStore = useFormStore();
  const { $axios } = useNuxtApp();
  const axios = $axios;
  const totalMessageCount = computed(() => {
    return luckyDiceCount.value + luckyEggCount.value + luckyWheelCount.value + infoFormCount.value + questionBoxCount.value + pollCount.value;
  });
  const formattedMessageCount = computed(() => {
    return totalMessageCount.value > 99 ? "99+" : totalMessageCount.value.toString();
  });
  const fetchCounts = async () => {
    var _a, _b, _c, _d, _e, _f, _g, _h, _i, _j;
    const cardId = (_a = formStore.defaultCard) == null ? void 0 : _a.id;
    if (!cardId || !axios) return;
    try {
      const diceResponse = await axios.get(`club/${cardId}/luckyDice/resultCount`);
      const diceData = ((_b = diceResponse.data) == null ? void 0 : _b.data) || {};
      luckyDiceCount.value = diceData.unreadCount || 0;
      const eggResponse = await axios.get(`club/${cardId}/luckyEgg/resultCount`);
      const eggData = ((_c = eggResponse.data) == null ? void 0 : _c.data) || {};
      luckyEggCount.value = eggData.unreadCount || 0;
      const wheelResponse = await axios.get(`club/${cardId}/luckyWheel/resultCount`);
      const wheelData = ((_d = wheelResponse.data) == null ? void 0 : _d.data) || {};
      luckyWheelCount.value = wheelData.unreadCount || 0;
      const [leadRes, formRes] = await Promise.all([
        axios.get(`v1/cards/${cardId}/leads/leadsCount`),
        axios.get(`v1/cards/${cardId}/forms/formsCount`)
      ]);
      const leadData = ((_e = leadRes.data) == null ? void 0 : _e.data) || {};
      const formData = ((_f = formRes.data) == null ? void 0 : _f.data) || {};
      infoFormCount.value = (leadData.unreadCount || 0) + (formData.unreadCount || 0);
      const questionResponse = await axios.get(`club/${cardId}/questions/questionsCount`);
      const questionData = ((_g = questionResponse.data) == null ? void 0 : _g.data) || {};
      questionBoxCount.value = questionData.unreadCount || 0;
      const pollResponse = await axios.get(`card/${cardId}/votes`, {
        params: { page: 1, perPage: 1 }
      });
      pollCount.value = ((_j = (_i = (_h = pollResponse.data) == null ? void 0 : _h.data) == null ? void 0 : _i.pagination) == null ? void 0 : _j.total) || 0;
      formStore.setInboxBadge(totalMessageCount.value);
    } catch (error) {
      console.error("Error fetching message counts:", error);
    }
  };
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
  };
};

export { useMessageCounts as u };
//# sourceMappingURL=useMessageCounts-Dq1nkOUx.mjs.map
