import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { a as useNuxtApp, n as navigateTo } from './server.mjs';

const getActionsByType = (type, rawType) => {
  if (type === "subscription" && rawType === "renewal_reminder") {
    return [
      { label: "\u062A\u0645\u062F\u06CC\u062F \u0627\u0634\u062A\u0631\u0627\u06A9", type: "primary", action: () => navigateTo("/dashboard/upgrade") },
      { label: "\u0628\u0639\u062F\u0627\u064B \u06CC\u0627\u062F\u0622\u0648\u0631\u06CC \u06A9\u0646", type: "secondary", action: () => {
      } }
    ];
  }
  if (type === "subscription" && rawType === "subscription_expired") {
    return [
      { label: "\u062A\u0645\u062F\u06CC\u062F \u0641\u0648\u0631\u06CC", type: "primary", action: () => navigateTo("/dashboard/upgrade") }
    ];
  }
  if (type === "subscription" && rawType === "welcome") {
    return [
      { label: "\u0627\u06CC\u062C\u0627\u062F \u067E\u0631\u0648\u0641\u0627\u06CC\u0644", type: "primary", action: () => navigateTo("/dashboard/add-card") }
    ];
  }
  if (type === "payment" && rawType === "payment_warning" || rawType === "purchase_success") {
    return [
      { label: "\u062A\u0645\u062F\u06CC\u062F \u0641\u0648\u0631\u06CC", type: "primary", action: () => navigateTo("/dashboard/upgrade") }
    ];
  }
  if (type === "security" && rawType === "new_login") {
    return [
      { label: "\u0627\u06CC\u0646 \u0645\u0646 \u0628\u0648\u062F\u0645", type: "secondary", action: () => {
      } },
      { label: "\u0627\u0645\u0646\u06CC\u062A \u062D\u0633\u0627\u0628", type: "primary", action: () => navigateTo("/dashboard/settings") }
    ];
  }
  if (type === "general" && rawType === "login") {
    return [
      { label: "\u0645\u0634\u0627\u0647\u062F\u0647 \u062C\u0632\u0626\u06CC\u0627\u062A", type: "secondary", action: () => navigateTo("/dashboard/settings") }
    ];
  }
  return [];
};
const useNotificationStore = defineStore("notifications", () => {
  const notifications = ref([]);
  const activeFilter = ref("all");
  const loading = ref(false);
  const { $axios } = useNuxtApp();
  const axios = $axios;
  const fetchNotifications = async () => {
    loading.value = true;
    try {
      const { data } = await axios.get("user/notifications");
      if (!data || !data.notifications) {
        notifications.value = [];
        return;
      }
      notifications.value = data.notifications.map((n) => ({
        id: n.id,
        type: n.type,
        rawType: n.raw_type,
        title: n.title,
        description: n.message,
        createdAt: new Date(n.created_at),
        read: !!n.read_at,
        actions: getActionsByType(n.type, n.raw_type)
      }));
    } catch (e) {
      notifications.value = [];
    } finally {
      loading.value = false;
    }
  };
  const filteredNotifications = computed(() => {
    if (activeFilter.value === "all") {
      return notifications.value;
    }
    return notifications.value.filter((n) => n.type === activeFilter.value);
  });
  const markAsRead = async (id) => {
    const notif = notifications.value.find((n) => n.id === id);
    if (notif && !notif.read) {
      notif.read = true;
      try {
        await axios.post(`user/notifications/${id}/read`);
      } catch (error) {
        notif.read = false;
      }
    }
  };
  const markAllAsRead = async () => {
    notifications.value.forEach((n) => n.read = true);
    await axios.post(`user/notifications/readAll`);
  };
  return {
    notifications,
    filteredNotifications,
    activeFilter,
    loading,
    fetchNotifications,
    markAsRead,
    markAllAsRead
  };
});

export { useNotificationStore as u };
//# sourceMappingURL=notification-z7zNtY-X.mjs.map
