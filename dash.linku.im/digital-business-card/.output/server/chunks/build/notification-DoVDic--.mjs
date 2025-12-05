import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { a as useNuxtApp, n as navigateTo } from './server.mjs';
import { s as setInterval } from './interval-plzJUXXs.mjs';

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
  const pollingInterval = ref(null);
  const lastFetchTime = ref(0);
  const { $axios } = useNuxtApp();
  const axios = $axios;
  const fetchNotifications = async (silent = false) => {
    if (!silent) {
      loading.value = true;
    }
    try {
      const { data } = await axios.get("user/notifications", {
        params: {
          per_page: 100,
          page: 1
        }
      });
      if (!data || !data.notifications || !Array.isArray(data.notifications)) {
        notifications.value = [];
        return;
      }
      const newNotifications = data.notifications.map((n) => ({
        id: n.id,
        type: n.type || "general",
        rawType: n.raw_type || "unknown",
        title: n.title || "\u0627\u0637\u0644\u0627\u0639\u06CC\u0647",
        description: n.message || "",
        createdAt: n.created_at ? new Date(n.created_at) : /* @__PURE__ */ new Date(),
        read: !!n.read_at,
        is_pinned: n.is_pinned || false,
        imageUrl: n.image_url,
        iconUrl: n.icon_url,
        backgroundColor: n.background_color,
        actionLink: n.action_link,
        actions: getActionsByType(n.type || "general", n.raw_type || "unknown")
      }));
      const hasNewNotification = newNotifications.length > notifications.value.length || newNotifications.some(
        (n) => !notifications.value.find((old) => old.id === n.id)
      );
      notifications.value = newNotifications;
      lastFetchTime.value = Date.now();
      if (hasNewNotification && false) ;
    } catch (e) {
      console.error("Error fetching notifications:", e);
      notifications.value = [];
    } finally {
      if (!silent) {
        loading.value = false;
      }
    }
  };
  const startPolling = (intervalMs = 15e3) => {
    if (pollingInterval.value) {
      return;
    }
    pollingInterval.value = setInterval();
  };
  const stopPolling = () => {
    if (pollingInterval.value) {
      clearInterval(pollingInterval.value);
      pollingInterval.value = null;
    }
  };
  const filteredNotifications = computed(() => {
    let filtered = activeFilter.value === "all" ? notifications.value : notifications.value.filter((n) => n.type === activeFilter.value);
    return filtered.sort((a, b) => {
      if (a.is_pinned && !b.is_pinned) return -1;
      if (!a.is_pinned && b.is_pinned) return 1;
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
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
  const unreadCount = computed(() => {
    return notifications.value.filter((n) => !n.read).length;
  });
  return {
    notifications,
    filteredNotifications,
    activeFilter,
    loading,
    unreadCount,
    fetchNotifications,
    markAsRead,
    markAllAsRead,
    startPolling,
    stopPolling
  };
});

export { useNotificationStore as u };
//# sourceMappingURL=notification-DoVDic--.mjs.map
