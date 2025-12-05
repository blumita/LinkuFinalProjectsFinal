import { defineComponent, ref, computed, mergeProps, unref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderList, ssrRenderClass, ssrInterpolate } from 'vue/server-renderer';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "history",
  __ssrInlineRender: true,
  setup(__props) {
    const loading = ref(true);
    const notifications = ref([]);
    const selectedFilter = ref("all");
    const filters = [
      { label: "\u0647\u0645\u0647", value: "all" },
      { label: "\u0628\u0631\u0627\u06CC \u0647\u0645\u0647 \u06A9\u0627\u0631\u0628\u0631\u0627\u0646", value: "all-users" },
      { label: "\u067E\u0631\u0645\u06CC\u0648\u0645", value: "premium" },
      { label: "\u0631\u0627\u06CC\u06AF\u0627\u0646", value: "free" },
      { label: "\u062E\u0627\u0635", value: "specific" }
    ];
    const filteredNotifications = computed(() => {
      if (selectedFilter.value === "all") {
        return notifications.value;
      }
      return notifications.value.filter((n) => {
        if (selectedFilter.value === "all-users") return n.type === "all";
        return n.type === selectedFilter.value;
      });
    });
    function getTypeLabel(type) {
      const labels = {
        "all": "\u0647\u0645\u0647 \u06A9\u0627\u0631\u0628\u0631\u0627\u0646",
        "premium": "\u067E\u0631\u0645\u06CC\u0648\u0645",
        "free": "\u0631\u0627\u06CC\u06AF\u0627\u0646",
        "specific": "\u06A9\u0627\u0631\u0628\u0631\u0627\u0646 \u062E\u0627\u0635"
      };
      return labels[type] || type;
    }
    function formatDate(dateString) {
      const date = new Date(dateString);
      const now = /* @__PURE__ */ new Date();
      const diff = now.getTime() - date.getTime();
      const hours = Math.floor(diff / (1e3 * 60 * 60));
      if (hours < 1) return "\u0647\u0645\u06CC\u0646 \u0627\u0644\u0627\u0646";
      if (hours < 24) return `${hours} \u0633\u0627\u0639\u062A \u067E\u06CC\u0634`;
      const days = Math.floor(hours / 24);
      if (days < 7) return `${days} \u0631\u0648\u0632 \u067E\u06CC\u0634`;
      return new Intl.DateTimeFormat("fa-IR", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit"
      }).format(date);
    }
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "min-h-screen bg-gray-50 dark:bg-gray-900" }, _attrs))}><div class="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 py-4"><div class="flex items-center gap-3"><button class="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition"><svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path></svg></button> <div><h1 class="text-xl font-bold text-gray-900 dark:text-white">\u062A\u0627\u0631\u06CC\u062E\u0686\u0647 \u0627\u0639\u0644\u0627\u0646\u200C\u0647\u0627</h1> <p class="text-sm text-gray-500 dark:text-gray-400">
            \u0645\u0634\u0627\u0647\u062F\u0647 \u062A\u0645\u0627\u0645 \u0627\u0639\u0644\u0627\u0646\u200C\u0647\u0627\u06CC \u0627\u0631\u0633\u0627\u0644 \u0634\u062F\u0647
          </p></div></div></div> <div class="p-4 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700"><div class="flex gap-2 overflow-x-auto"><!--[-->`);
      ssrRenderList(filters, (filter) => {
        _push(`<button class="${ssrRenderClass([
          "px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition",
          unref(selectedFilter) === filter.value ? "bg-blue-500 text-white" : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
        ])}">${ssrInterpolate(filter.label)}</button>`);
      });
      _push(`<!--]--></div></div> `);
      if (unref(loading)) {
        _push(`<div class="flex items-center justify-center py-12"><div class="flex flex-col items-center gap-3"><div class="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div> <p class="text-sm text-gray-500 dark:text-gray-400">\u062F\u0631 \u062D\u0627\u0644 \u0628\u0627\u0631\u06AF\u0630\u0627\u0631\u06CC...</p></div></div>`);
      } else if (unref(filteredNotifications).length > 0) {
        _push(`<div class="p-4 space-y-3"><!--[-->`);
        ssrRenderList(unref(filteredNotifications), (notification) => {
          _push(`<div class="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700 hover:shadow-md transition"><div class="flex items-start justify-between gap-3 mb-3"><div class="flex-1"><h3 class="font-semibold text-gray-900 dark:text-white mb-1">${ssrInterpolate(notification.title)}</h3> <p class="text-sm text-gray-600 dark:text-gray-400">${ssrInterpolate(notification.message)}</p></div> <span class="${ssrRenderClass([
            "px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap",
            notification.type === "all" ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300" : notification.type === "premium" ? "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300" : notification.type === "free" ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300" : "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300"
          ])}">${ssrInterpolate(getTypeLabel(notification.type))}</span></div> <div class="grid grid-cols-3 gap-3 mb-3"><div class="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-2 text-center"><div class="text-lg font-bold text-gray-900 dark:text-white">${ssrInterpolate(notification.sentCount || 0)}</div> <div class="text-xs text-gray-500 dark:text-gray-400">\u0627\u0631\u0633\u0627\u0644 \u0634\u062F\u0647</div></div> <div class="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-2 text-center"><div class="text-lg font-bold text-green-600 dark:text-green-400">${ssrInterpolate(notification.deliveredCount || 0)}</div> <div class="text-xs text-gray-500 dark:text-gray-400">\u062A\u062D\u0648\u06CC\u0644 \u0634\u062F\u0647</div></div> <div class="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-2 text-center"><div class="text-lg font-bold text-blue-600 dark:text-blue-400">${ssrInterpolate(notification.clickedCount || 0)}</div> <div class="text-xs text-gray-500 dark:text-gray-400">\u06A9\u0644\u06CC\u06A9 \u0634\u062F\u0647</div></div></div> `);
          if (notification.actionLink) {
            _push(`<div class="mb-3"><div class="text-xs text-gray-500 dark:text-gray-400 mb-1">\u0644\u06CC\u0646\u06A9:</div> <div class="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-2 text-sm text-gray-700 dark:text-gray-300 break-all">${ssrInterpolate(notification.actionLink)}</div></div>`);
          } else {
            _push(`<!---->`);
          }
          _push(` <div class="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 pt-3 border-t border-gray-100 dark:border-gray-700"><div class="flex items-center gap-2"><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg> ${ssrInterpolate(formatDate(notification.createdAt))}</div> `);
          if (notification.scheduledFor) {
            _push(`<div class="flex items-center gap-1"><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
            \u0632\u0645\u0627\u0646\u200C\u0628\u0646\u062F\u06CC: ${ssrInterpolate(formatDate(notification.scheduledFor))}</div>`);
          } else {
            _push(`<!---->`);
          }
          _push(`</div></div>`);
        });
        _push(`<!--]--></div>`);
      } else {
        _push(`<div class="flex flex-col items-center justify-center py-16 px-4"><div class="w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4"><svg class="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path></svg></div> <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">
        \u0647\u06CC\u0686 \u0627\u0639\u0644\u0627\u0646\u06CC \u06CC\u0627\u0641\u062A \u0646\u0634\u062F
      </h3> <p class="text-sm text-gray-500 dark:text-gray-400 text-center">
        \u062A\u0627\u06A9\u0646\u0648\u0646 \u0647\u06CC\u0686 \u0627\u0639\u0644\u0627\u0646\u06CC \u0627\u0631\u0633\u0627\u0644 \u0646\u0634\u062F\u0647 \u0627\u0633\u062A
      </p></div>`);
      }
      _push(`</div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/dashboard/notifications/history.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=history-BPGf_xIQ.mjs.map
