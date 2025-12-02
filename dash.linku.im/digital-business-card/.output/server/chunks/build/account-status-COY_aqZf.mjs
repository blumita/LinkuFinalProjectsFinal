import { defineComponent, computed, mergeProps, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrInterpolate, ssrRenderStyle, ssrRenderClass } from 'vue/server-renderer';
import { u as useFormStore } from './form-CUJQskNk.mjs';
import { u as useUserStore } from './user-D1YL8aKq.mjs';
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
import 'vue-router';
import 'axios';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "account-status",
  __ssrInlineRender: true,
  setup(__props) {
    const formStore = useFormStore();
    const userStore = useUserStore();
    const defaultCard = computed(() => formStore.defaultCard);
    const user = computed(() => userStore.user || {});
    const actionHandlers = computed(() => {
      var _a, _b, _c;
      return {
        profile: {
          status: ((_a = defaultCard.value) == null ? void 0 : _a.avatar) ? "done" : "pending"
        },
        link: {
          status: ((_b = defaultCard.value) == null ? void 0 : _b.linksDataList) && defaultCard.value.linksDataList.length > 0 ? "done" : "pending"
        },
        map: {
          status: "pending",
          disabled: true
        },
        pro: {
          status: ((_c = user.value) == null ? void 0 : _c.isPro) ? "done" : "pending"
        }
      };
    });
    const total = computed(() => Object.keys(actionHandlers.value).length);
    const completed = computed(() => Object.values(actionHandlers.value).filter((item) => item.status === "done").length);
    const progress = computed(() => Math.round(completed.value / total.value * 100));
    const subscriptionStatusText = computed(() => {
      var _a;
      if (!((_a = user.value) == null ? void 0 : _a.isPro)) return "\u062F\u0633\u062A\u0631\u0633\u06CC \u0628\u0647 \u0627\u0645\u06A9\u0627\u0646\u0627\u062A \u0648\u06CC\u0698\u0647";
      const daysRemaining = user.value.daysRemaining || user.value.days_remaining;
      if (daysRemaining !== void 0 && daysRemaining !== null) {
        if (daysRemaining > 30) {
          const months = Math.floor(daysRemaining / 30);
          return `${months} \u0645\u0627\u0647 \u0628\u0627\u0642\u06CC\u200C\u0645\u0627\u0646\u062F\u0647`;
        }
        return `${daysRemaining} \u0631\u0648\u0632 \u0628\u0627\u0642\u06CC\u200C\u0645\u0627\u0646\u062F\u0647`;
      }
      const endDate = user.value.subscriptionEndDate || user.value.subscription_end_date;
      if (endDate) {
        const end = new Date(endDate);
        const now = /* @__PURE__ */ new Date();
        const diffTime = end.getTime() - now.getTime();
        const diffDays = Math.ceil(diffTime / (1e3 * 60 * 60 * 24));
        if (diffDays > 30) {
          const months = Math.floor(diffDays / 30);
          return `${months} \u0645\u0627\u0647 \u0628\u0627\u0642\u06CC\u200C\u0645\u0627\u0646\u062F\u0647`;
        } else if (diffDays > 0) {
          return `${diffDays} \u0631\u0648\u0632 \u0628\u0627\u0642\u06CC\u200C\u0645\u0627\u0646\u062F\u0647`;
        } else {
          return "\u0627\u0634\u062A\u0631\u0627\u06A9 \u0645\u0646\u0642\u0636\u06CC \u0634\u062F\u0647";
        }
      }
      return "\u0634\u0645\u0627 \u0639\u0636\u0648 \u067E\u0631\u0645\u06CC\u0648\u0645 \u0647\u0633\u062A\u06CC\u062F";
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "min-h-screen bg-background pb-24" }, _attrs))}><div class="px-4 lg:px-6 py-6 space-y-4"><div class="bg-card rounded-2xl p-4 lg:p-6 border border-border shadow-sm"><div class="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 mb-4"><div class="flex items-center gap-3"><div class="w-10 h-10 lg:w-12 lg:h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0"><i class="ti ti-chart-line text-primary text-xl lg:text-2xl"></i></div> <div><h3 class="font-bold text-foreground text-base lg:text-lg">\u067E\u06CC\u0634\u0631\u0641\u062A \u06A9\u0644\u06CC</h3> <p class="text-xs text-muted-foreground">${ssrInterpolate(completed.value)} \u0627\u0632 ${ssrInterpolate(total.value)} \u0645\u0631\u062D\u0644\u0647</p></div></div> <div class="text-2xl lg:text-3xl font-bold text-primary">${ssrInterpolate(progress.value)}\u066A</div></div> <div class="w-full h-2.5 lg:h-3 rounded-full bg-muted overflow-hidden"><div class="h-full rounded-full transition-all duration-500 bg-primary" style="${ssrRenderStyle({ width: progress.value + "%" })}"></div></div> <p class="text-xs text-muted-foreground mt-3 text-center">${ssrInterpolate(total.value - completed.value)} \u0645\u0631\u062D\u0644\u0647 \u0628\u0627\u0642\u06CC\u200C\u0645\u0627\u0646\u062F\u0647 \u0628\u0631\u0627\u06CC \u062A\u06A9\u0645\u06CC\u0644 \u067E\u0631\u0648\u0641\u0627\u06CC\u0644
        </p></div> <div class="bg-blue-500/10 border border-blue-500/20 rounded-2xl p-4"><div class="flex gap-3"><i class="ti ti-info-circle text-xl text-blue-500 mt-0.5"></i> <div><h4 class="font-semibold text-foreground mb-1">\u0686\u0631\u0627 \u0628\u0627\u06CC\u062F \u067E\u0631\u0648\u0641\u0627\u06CC\u0644 \u0631\u0627 \u062A\u06A9\u0645\u06CC\u0644 \u06A9\u0646\u0645\u061F</h4> <p class="text-sm text-muted-foreground leading-relaxed">
              \u062A\u06A9\u0645\u06CC\u0644 \u067E\u0631\u0648\u0641\u0627\u06CC\u0644 \u0628\u0647 \u0634\u0645\u0627 \u06A9\u0645\u06A9 \u0645\u06CC\u200C\u06A9\u0646\u062F \u062A\u0627 \u0628\u06CC\u0634\u062A\u0631\u06CC\u0646 \u0628\u0627\u0632\u062F\u06CC\u062F \u0648 \u062A\u0639\u0627\u0645\u0644 \u0631\u0627 \u0627\u0632 \u06A9\u0627\u0631\u062A \u062F\u06CC\u062C\u06CC\u062A\u0627\u0644 \u062E\u0648\u062F \u062F\u0631\u06CC\u0627\u0641\u062A \u06A9\u0646\u06CC\u062F.
            </p></div></div></div> <div class="space-y-3 lg:grid lg:grid-cols-2 lg:gap-4 lg:space-y-0"><h3 class="font-bold text-foreground px-2 lg:col-span-2">\u0686\u06A9\u200C\u0644\u06CC\u0633\u062A \u062A\u06A9\u0645\u06CC\u0644</h3> <div class="${ssrRenderClass([actionHandlers.value.profile.status === "done" ? "border-green-500/30 bg-green-500/5" : "border-primary/30 hover:border-primary/50", "bg-card rounded-2xl p-3 lg:p-4 border transition-all cursor-pointer hover:shadow-md"])}"><div class="flex items-center gap-3 lg:gap-4"><div class="${ssrRenderClass([actionHandlers.value.profile.status === "done" ? "bg-green-500/20" : "bg-primary/10", "w-10 h-10 lg:w-12 lg:h-12 rounded-xl flex items-center justify-center flex-shrink-0"])}"><i class="${ssrRenderClass([actionHandlers.value.profile.status === "done" ? "ti-check text-green-500" : "ti-user-plus text-primary", "ti text-xl lg:text-2xl"])}"></i></div> <div class="flex-1 min-w-0"><h4 class="font-semibold text-foreground text-sm lg:text-base">\u0627\u0641\u0632\u0648\u062F\u0646 \u062A\u0635\u0648\u06CC\u0631 \u067E\u0631\u0648\u0641\u0627\u06CC\u0644</h4> <p class="text-xs lg:text-sm text-muted-foreground mt-0.5">\u062A\u0635\u0648\u06CC\u0631 \u062E\u0648\u062F \u0631\u0627 \u0627\u0636\u0627\u0641\u0647 \u06A9\u0646\u06CC\u062F</p></div> <i class="ti ti-chevron-left text-lg lg:text-xl text-muted-foreground flex-shrink-0"></i></div></div> <div class="${ssrRenderClass([actionHandlers.value.link.status === "done" ? "border-green-500/30 bg-green-500/5" : "border-primary/30 hover:border-primary/50", "bg-card rounded-2xl p-3 lg:p-4 border transition-all cursor-pointer hover:shadow-md"])}"><div class="flex items-center gap-3 lg:gap-4"><div class="${ssrRenderClass([actionHandlers.value.link.status === "done" ? "bg-green-500/20" : "bg-primary/10", "w-10 h-10 lg:w-12 lg:h-12 rounded-xl flex items-center justify-center flex-shrink-0"])}"><i class="${ssrRenderClass([actionHandlers.value.link.status === "done" ? "ti-check text-green-500" : "ti-link text-primary", "ti text-xl lg:text-2xl"])}"></i></div> <div class="flex-1 min-w-0"><h4 class="font-semibold text-foreground">\u0627\u0641\u0632\u0648\u062F\u0646 \u0627\u0648\u0644\u06CC\u0646 \u0644\u06CC\u0646\u06A9</h4> <p class="text-sm text-muted-foreground mt-0.5">\u0644\u06CC\u0646\u06A9 \u0634\u0628\u06A9\u0647\u200C\u0647\u0627\u06CC \u0627\u062C\u062A\u0645\u0627\u0639\u06CC \u0631\u0627 \u0627\u0636\u0627\u0641\u0647 \u06A9\u0646\u06CC\u062F</p></div> <i class="ti ti-chevron-left text-xl text-muted-foreground"></i></div></div> <div class="bg-card rounded-2xl p-4 border border-border opacity-50 cursor-not-allowed"><div class="flex items-center gap-4"><div class="w-12 h-12 rounded-xl bg-muted flex items-center justify-center flex-shrink-0"><i class="ti ti-map-pin text-2xl text-muted-foreground"></i></div> <div class="flex-1 min-w-0"><h4 class="font-semibold text-foreground">\u062A\u0646\u0638\u06CC\u0645 \u0646\u0642\u0634\u0647</h4> <p class="text-sm text-muted-foreground mt-0.5">\u0628\u0647 \u0632\u0648\u062F\u06CC \u0641\u0639\u0627\u0644 \u0645\u06CC\u200C\u0634\u0648\u062F</p></div> <i class="ti ti-lock text-xl text-muted-foreground"></i></div></div> <div class="${ssrRenderClass([actionHandlers.value.pro.status === "done" ? "border-green-500/30 bg-green-500/5" : "border-primary/30 bg-primary/5 hover:border-primary/50 cursor-pointer", "bg-card rounded-2xl p-4 border transition-all hover:shadow-md"])}"><div class="flex items-center gap-4"><div class="${ssrRenderClass([actionHandlers.value.pro.status === "done" ? "bg-green-500/20" : "bg-primary/20", "w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"])}"><i class="${ssrRenderClass([actionHandlers.value.pro.status === "done" ? "ti-check text-green-500" : "ti-crown text-primary", "ti text-2xl"])}"></i></div> <div class="flex-1 min-w-0"><h4 class="font-semibold text-foreground">\u0639\u0636\u0648\u06CC\u062A \u062D\u0631\u0641\u0647\u200C\u0627\u06CC</h4> <p class="text-sm text-muted-foreground mt-0.5">${ssrInterpolate(actionHandlers.value.pro.status === "done" ? subscriptionStatusText.value : "\u062F\u0633\u062A\u0631\u0633\u06CC \u0628\u0647 \u0627\u0645\u06A9\u0627\u0646\u0627\u062A \u0648\u06CC\u0698\u0647")}</p></div> <i class="${ssrRenderClass([actionHandlers.value.pro.status === "done" ? "ti-circle-check text-green-500" : "ti-chevron-left text-primary", "ti text-lg lg:text-xl flex-shrink-0"])}"></i></div></div></div></div></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/settings/account-status.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=account-status-COY_aqZf.mjs.map
