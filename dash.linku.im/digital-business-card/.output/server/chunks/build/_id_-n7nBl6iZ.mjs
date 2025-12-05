import { defineComponent, ref, mergeProps, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderStyle, ssrRenderClass, ssrRenderAttr, ssrInterpolate } from 'vue/server-renderer';
import { useRoute, useRouter } from 'vue-router';
import { u as useNotificationStore } from './notification-DoVDic--.mjs';
import 'pinia';
import './server.mjs';
import '../_/nitro.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import 'node:url';
import '../routes/renderer.mjs';
import 'vue-bundle-renderer/runtime';
import 'unhead/server';
import 'unhead/plugins';
import 'unhead/utils';
import 'axios';
import './interval-plzJUXXs.mjs';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "[id]",
  __ssrInlineRender: true,
  setup(__props) {
    useRoute();
    useRouter();
    useNotificationStore();
    const loading = ref(true);
    const notification = ref(void 0);
    const getNotificationStyle = (notification2) => {
      const rawTypeStyles = {
        "discount_code": {
          icon: "ti ti-ticket",
          color: "text-orange-500",
          bg: "bg-orange-500/10"
        },
        "payment_success": {
          icon: "ti ti-check",
          color: "text-green-500",
          bg: "bg-green-500/10"
        },
        "subscription_expire": {
          icon: "ti ti-clock-exclamation",
          color: "text-amber-500",
          bg: "bg-amber-500/10"
        },
        "first_login": {
          icon: "ti ti-star",
          color: "text-amber-500",
          bg: "bg-amber-500/10"
        }
      };
      if (notification2.rawType && rawTypeStyles[notification2.rawType]) {
        return rawTypeStyles[notification2.rawType];
      }
      const typeStyles = {
        subscription: {
          icon: "ti ti-crown",
          color: "text-yellow-500",
          bg: "bg-yellow-500/10"
        },
        payment: {
          icon: "ti ti-credit-card",
          color: "text-green-500",
          bg: "bg-green-500/10"
        },
        security: {
          icon: "ti ti-shield",
          color: "text-red-500",
          bg: "bg-red-500/10"
        },
        system: {
          icon: "ti ti-settings",
          color: "text-purple-500",
          bg: "bg-purple-500/10"
        },
        general: {
          icon: "ti ti-info-circle",
          color: "text-blue-500",
          bg: "bg-blue-500/10"
        }
      };
      return typeStyles[notification2.type] || typeStyles.general;
    };
    const getTypeLabel = (type) => {
      const labels = {
        subscription: "\u0627\u0634\u062A\u0631\u0627\u06A9",
        payment: "\u067E\u0631\u062F\u0627\u062E\u062A",
        security: "\u0627\u0645\u0646\u06CC\u062A",
        system: "\u0633\u06CC\u0633\u062A\u0645",
        general: "\u0639\u0645\u0648\u0645\u06CC"
      };
      return labels[type] || "\u0639\u0645\u0648\u0645\u06CC";
    };
    const formatTime = (date) => {
      const now = /* @__PURE__ */ new Date();
      const targetDate = typeof date === "string" ? new Date(date) : date;
      const diff = now.getTime() - targetDate.getTime();
      const seconds = Math.floor(diff / 1e3);
      const minutes = Math.floor(seconds / 60);
      const hours = Math.floor(minutes / 60);
      const days = Math.floor(hours / 24);
      if (days > 7) {
        return targetDate.toLocaleDateString("fa-IR");
      } else if (days > 0) {
        return `${days} \u0631\u0648\u0632 \u067E\u06CC\u0634`;
      } else if (hours > 0) {
        return `${hours} \u0633\u0627\u0639\u062A \u067E\u06CC\u0634`;
      } else if (minutes > 0) {
        return `${minutes} \u062F\u0642\u06CC\u0642\u0647 \u067E\u06CC\u0634`;
      } else {
        return "\u0627\u0644\u0627\u0646";
      }
    };
    const formatFullDate = (date) => {
      const targetDate = typeof date === "string" ? new Date(date) : date;
      return targetDate.toLocaleDateString("fa-IR", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit"
      });
    };
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "min-h-screen bg-background" }, _attrs))}><div class="fixed top-0 left-0 right-0 z-40 bg-card border-b border-border"><div class="flex items-center h-14 px-4"><button class="flex items-center justify-center w-10 h-10 rounded-lg text-foreground hover:bg-accent transition-colors"><i class="ti ti-arrow-right text-xl"></i></button> <h1 class="flex-1 text-lg font-semibold text-foreground">\u062C\u0632\u0626\u06CC\u0627\u062A \u0627\u0637\u0644\u0627\u0639\u06CC\u0647</h1></div></div> <div class="pt-16 pb-8 px-4">`);
      if (loading.value) {
        _push(`<div class="max-w-2xl mx-auto space-y-4 animate-pulse"><div class="h-32 bg-accent rounded-xl"></div> <div class="h-24 bg-accent rounded-xl"></div> <div class="h-48 bg-accent rounded-xl"></div></div>`);
      } else if (notification.value) {
        _push(`<div class="max-w-2xl mx-auto space-y-4"><div class="bg-card border border-border rounded-2xl p-6 space-y-4" style="${ssrRenderStyle(notification.value.backgroundColor ? { backgroundColor: notification.value.backgroundColor } : {})}"><div class="flex items-start gap-4"><div class="${ssrRenderClass([
          "w-16 h-16 rounded-xl flex items-center justify-center flex-shrink-0",
          notification.value.backgroundColor ? "bg-white/20" : getNotificationStyle(notification.value).bg
        ])}">`);
        if (notification.value.iconUrl) {
          _push(`<img${ssrRenderAttr("src", notification.value.iconUrl)} class="w-full h-full object-cover rounded-xl" alt="Icon">`);
        } else {
          _push(`<i class="${ssrRenderClass([
            getNotificationStyle(notification.value).icon,
            notification.value.backgroundColor ? "text-white" : getNotificationStyle(notification.value).color,
            "text-3xl"
          ])}"></i>`);
        }
        _push(`</div> <div class="flex-1 space-y-2"><h2 class="text-xl font-bold text-foreground">${ssrInterpolate(notification.value.title)}</h2> <div class="flex items-center gap-2 text-sm text-muted-foreground"><i class="ti ti-clock text-base"></i> <span>${ssrInterpolate(formatTime(notification.value.createdAt))}</span></div></div> `);
        if (notification.value.is_pinned) {
          _push(`<div class="bg-amber-500/10 text-amber-600 dark:text-amber-400 px-3 py-1.5 rounded-full text-xs font-medium flex items-center gap-1.5"><i class="ti ti-pin text-sm"></i> <span>\u0633\u0646\u062C\u0627\u0642 \u0634\u062F\u0647</span></div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div> <div class="flex items-center gap-2"><span class="${ssrRenderClass([
          "px-3 py-1.5 rounded-full text-xs font-medium",
          getNotificationStyle(notification.value).bg,
          getNotificationStyle(notification.value).color
        ])}">${ssrInterpolate(getTypeLabel(notification.value.type))}</span></div></div> `);
        if (notification.value.imageUrl) {
          _push(`<div class="bg-card border border-border rounded-2xl overflow-hidden"><img${ssrRenderAttr("src", notification.value.imageUrl)} class="w-full h-auto object-cover" alt="Notification Image"></div>`);
        } else {
          _push(`<!---->`);
        }
        _push(` <div class="bg-card border border-border rounded-2xl p-6 space-y-4"><h3 class="text-lg font-semibold text-foreground">\u067E\u06CC\u0627\u0645</h3> <p class="text-foreground leading-relaxed whitespace-pre-wrap">${ssrInterpolate(notification.value.description)}</p></div> `);
        if (notification.value.actionLink) {
          _push(`<div class="bg-card border border-border rounded-2xl p-6 space-y-4"><h3 class="text-lg font-semibold text-foreground">\u0644\u06CC\u0646\u06A9 \u0639\u0645\u0644\u06CC\u0627\u062A</h3> <a${ssrRenderAttr("href", notification.value.actionLink)} target="_blank" rel="noopener noreferrer" class="flex items-center justify-between p-4 bg-primary/10 hover:bg-primary/20 rounded-xl transition-colors group"><div class="flex items-center gap-3"><i class="ti ti-link text-primary text-xl"></i> <span class="text-primary font-medium">\u0628\u0627\u0632 \u06A9\u0631\u062F\u0646 \u0644\u06CC\u0646\u06A9</span></div> <i class="ti ti-external-link text-primary text-lg group-hover:translate-x-1 transition-transform"></i></a></div>`);
        } else {
          _push(`<!---->`);
        }
        _push(` <div class="bg-card border border-border rounded-2xl p-6 space-y-3"><div class="flex items-center justify-between py-2 border-b border-border"><span class="text-muted-foreground">\u0648\u0636\u0639\u06CC\u062A</span> <span class="${ssrRenderClass([notification.value.read ? "text-green-600" : "text-blue-600", "font-medium flex items-center gap-2"])}"><i class="${ssrRenderClass(notification.value.read ? "ti ti-check" : "ti ti-bell-ringing")}"></i> ${ssrInterpolate(notification.value.read ? "\u062E\u0648\u0627\u0646\u062F\u0647 \u0634\u062F\u0647" : "\u062E\u0648\u0627\u0646\u062F\u0647 \u0646\u0634\u062F\u0647")}</span></div> <div class="flex items-center justify-between py-2"><span class="text-muted-foreground">\u062A\u0627\u0631\u06CC\u062E \u062F\u0631\u06CC\u0627\u0641\u062A</span> <span class="text-foreground font-medium">${ssrInterpolate(formatFullDate(notification.value.createdAt))}</span></div></div></div>`);
      } else {
        _push(`<div class="max-w-2xl mx-auto text-center py-12"><div class="w-20 h-20 mx-auto mb-4 rounded-full bg-red-500/10 flex items-center justify-center"><i class="ti ti-alert-circle text-red-500 text-4xl"></i></div> <h3 class="text-xl font-semibold text-foreground mb-2">\u0627\u0637\u0644\u0627\u0639\u06CC\u0647 \u06CC\u0627\u0641\u062A \u0646\u0634\u062F</h3> <p class="text-muted-foreground mb-6">\u0627\u06CC\u0646 \u0627\u0637\u0644\u0627\u0639\u06CC\u0647 \u062D\u0630\u0641 \u0634\u062F\u0647 \u06CC\u0627 \u0648\u062C\u0648\u062F \u0646\u062F\u0627\u0631\u062F</p> <button class="px-6 py-3 bg-primary text-primary-foreground rounded-xl font-medium hover:bg-primary/90 transition-colors">
          \u0628\u0627\u0632\u06AF\u0634\u062A \u0628\u0647 \u0644\u06CC\u0633\u062A \u0627\u0637\u0644\u0627\u0639\u06CC\u0647\u200C\u0647\u0627
        </button></div>`);
      }
      _push(`</div></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/dashboard/notifications/[id].vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=_id_-n7nBl6iZ.mjs.map
