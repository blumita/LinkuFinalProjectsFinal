import { defineComponent, ref, computed, unref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderList, ssrRenderClass, ssrInterpolate, ssrRenderStyle, ssrRenderAttr, ssrIncludeBooleanAttr } from 'vue/server-renderer';
import { u as useRewardStore } from './reward-CUwOjHba.mjs';
import { _ as _export_sfc } from './_plugin-vue_export-helper-1tPrXgE0.mjs';
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
  __name: "RewardsPage",
  __ssrInlineRender: true,
  setup(__props) {
    const rewardStore = useRewardStore();
    const copyingCode = ref(null);
    const discounts = computed(() => rewardStore.rewards);
    const formatDate = (dateString) => {
      const date = new Date(dateString);
      return new Intl.DateTimeFormat("fa-IR").format(date);
    };
    const getDaysRemaining = (expiryDate) => {
      const today = /* @__PURE__ */ new Date("2025-09-24");
      const expiry = new Date(expiryDate);
      const timeDiff = expiry.getTime() - today.getTime();
      return Math.ceil(timeDiff / (1e3 * 3600 * 24));
    };
    const getProgressPercentage = (expiryDate) => {
      const totalDays = 30;
      const daysRemaining = getDaysRemaining(expiryDate);
      if (daysRemaining <= 0) return 0;
      return Math.max(0, Math.min(100, daysRemaining / totalDays * 100));
    };
    const getDiscountStatusClass = (status) => {
      switch (status) {
        case "active":
          return "bg-success/10 text-success border border-success/20";
        case "expired":
          return "bg-warning/10 text-warning border border-warning/20";
        case "used":
          return "bg-muted text-muted-foreground border border-muted";
        default:
          return "bg-muted text-muted-foreground";
      }
    };
    const getDiscountStatusText = (status) => {
      switch (status) {
        case "active":
          return "\u0641\u0639\u0627\u0644";
        case "expired":
          return "\u0645\u0646\u0642\u0636\u06CC";
        case "used":
          return "\u0627\u0633\u062A\u0641\u0627\u062F\u0647 \u0634\u062F\u0647";
        default:
          return "\u0646\u0627\u0645\u0634\u062E\u0635";
      }
    };
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(_attrs)} data-v-18ccce42><div class="fixed top-0 left-0 right-0 z-50 bg-card border-b divide-border" data-v-18ccce42><div class="flex items-center justify-between px-4 h-16" data-v-18ccce42><button class="p-2 hover:bg-secondary rounded-lg transition-colors" data-v-18ccce42><i class="ti ti-arrow-right text-primary text-xl" data-v-18ccce42></i></button> <h1 class="text-lg font-bold text-primary" data-v-18ccce42>\u062A\u062E\u0641\u06CC\u0641\u0627\u062A \u0648 \u062C\u0648\u0627\u06CC\u0632</h1> <div class="w-10" data-v-18ccce42></div></div></div> <div class="pt-[68px] pb-20" data-v-18ccce42>`);
      if (unref(rewardStore).isLoading) {
        _push(`<div class="space-y-6 animate-pulse px-6" data-v-18ccce42><div class="space-y-4" data-v-18ccce42><!--[-->`);
        ssrRenderList(4, (n) => {
          _push(`<div class="bg-card border border-border p-4 rounded-xl" data-v-18ccce42><div class="flex items-start justify-between mb-3" data-v-18ccce42><div class="flex-1 space-y-2" data-v-18ccce42><div class="h-5 w-32 bg-muted rounded" data-v-18ccce42></div> <div class="h-4 w-48 bg-muted-foreground/20 rounded" data-v-18ccce42></div> <div class="h-4 w-20 bg-muted-foreground/20 rounded" data-v-18ccce42></div></div> <div class="w-16 h-16 bg-muted rounded-xl" data-v-18ccce42></div></div></div>`);
        });
        _push(`<!--]--></div></div>`);
      } else {
        _push(`<div class="px-4" data-v-18ccce42><div class="space-y-4" data-v-18ccce42>`);
        if (discounts.value.length === 0) {
          _push(`<div class="bg-card border border-border p-8 rounded-xl text-center" data-v-18ccce42><i class="ti ti-discount-off text-secondary text-4xl mb-4" data-v-18ccce42></i> <h4 class="font-medium text-primary mb-2" data-v-18ccce42>\u0647\u06CC\u0686 \u062A\u062E\u0641\u06CC\u0641\u06CC \u06CC\u0627\u0641\u062A \u0646\u0634\u062F</h4> <p class="text-sm text-secondary" data-v-18ccce42>\u062F\u0631 \u062D\u0627\u0644 \u062D\u0627\u0636\u0631 \u062A\u062E\u0641\u06CC\u0641 \u0641\u0639\u0627\u0644\u06CC \u0646\u062F\u0627\u0631\u06CC\u062F</p></div>`);
        } else {
          _push(`<!--[-->`);
          ssrRenderList(discounts.value, (discount) => {
            _push(`<div class="${ssrRenderClass([
              "bg-card border border-border p-4 rounded-xl transition-colors",
              discount.status === "active" ? "cursor-pointer hover:bg-muted/30" : "opacity-60 cursor-not-allowed"
            ])}" data-v-18ccce42><div class="flex items-start justify-between mb-3" data-v-18ccce42><div class="flex-1" data-v-18ccce42><div class="flex items-center gap-2 mb-2" data-v-18ccce42><h4 class="font-medium text-primary" data-v-18ccce42>${ssrInterpolate(discount.title)}</h4> <span class="${ssrRenderClass([
              "text-xs px-2 py-1 rounded-full",
              getDiscountStatusClass(discount.status)
            ])}" data-v-18ccce42>${ssrInterpolate(getDiscountStatusText(discount.status))}</span></div> <p class="text-sm text-secondary mb-3" data-v-18ccce42>${ssrInterpolate(discount.description)}</p> `);
            if (discount.status === "active" && getDaysRemaining(discount.expiryDate) <= 7 && getDaysRemaining(discount.expiryDate) > 0) {
              _push(`<div class="mb-3" data-v-18ccce42><div class="flex items-center justify-between mb-1" data-v-18ccce42><span class="text-xs text-secondary" data-v-18ccce42>\u0632\u0645\u0627\u0646 \u0628\u0627\u0642\u06CC\u200C\u0645\u0627\u0646\u062F\u0647</span> <span class="text-xs font-medium accent-text" data-v-18ccce42>${ssrInterpolate(getDaysRemaining(discount.expiryDate))} \u0631\u0648\u0632
                    </span></div> <div class="w-full bg-secondary rounded-full h-2" data-v-18ccce42><div class="accent-bg h-2 rounded-full transition-all duration-300" style="${ssrRenderStyle({ width: `${getProgressPercentage(discount.expiryDate)}%` })}" data-v-18ccce42></div></div></div>`);
            } else {
              _push(`<!---->`);
            }
            _push(` <div class="flex items-center gap-4 text-xs text-secondary" data-v-18ccce42><span class="flex items-center gap-1" data-v-18ccce42><i class="ti ti-percentage" data-v-18ccce42></i> ${ssrInterpolate(discount.value)}${ssrInterpolate(discount.type === "percentage" ? "%" : " \u0631\u06CC\u0627\u0644")}</span> <span class="flex items-center gap-1" data-v-18ccce42><i class="ti ti-calendar" data-v-18ccce42></i> ${ssrInterpolate(formatDate(discount.expiryDate))}</span></div></div> <div class="w-16 h-16 rounded-xl flex items-center justify-center border border-border overflow-hidden flex-shrink-0" data-v-18ccce42>`);
            if (discount.banner || discount.image) {
              _push(`<img${ssrRenderAttr("src", discount.banner || discount.image)}${ssrRenderAttr("alt", discount.title)} class="w-full h-full object-cover" data-v-18ccce42>`);
            } else {
              _push(`<div class="w-full h-full bg-secondary flex items-center justify-center" data-v-18ccce42><i class="ti ti-discount accent-text text-2xl" data-v-18ccce42></i></div>`);
            }
            _push(`</div></div> <div class="flex items-center justify-between pt-3 border-t divide-border" data-v-18ccce42><div class="flex-1" data-v-18ccce42>`);
            if (discount.status === "active") {
              _push(`<button${ssrIncludeBooleanAttr(copyingCode.value === discount.code) ? " disabled" : ""} class="${ssrRenderClass([
                "w-full flex items-center justify-center gap-2 text-sm py-2.5 px-4 rounded-lg font-medium transition-all",
                copyingCode.value === discount.code ? "bg-green-500/10 text-green-500 border border-green-500/20" : "accent-bg accent-text hover:opacity-90 border border-border"
              ])}" data-v-18ccce42><i class="${ssrRenderClass([copyingCode.value === discount.code ? "ti ti-check" : "ti ti-copy", "text-base"])}" data-v-18ccce42></i> `);
              if (copyingCode.value === discount.code) {
                _push(`<span data-v-18ccce42>
                    \u06A9\u067E\u06CC \u0634\u062F!
                  </span>`);
              } else {
                _push(`<span data-v-18ccce42>
                    \u06A9\u067E\u06CC \u06A9\u062F: ${ssrInterpolate(discount.code)}</span>`);
              }
              _push(`</button>`);
            } else {
              _push(`<div class="flex items-center justify-center gap-2 text-sm py-2.5 px-4 rounded-lg bg-secondary text-secondary" data-v-18ccce42><i class="ti ti-copy text-base opacity-50" data-v-18ccce42></i> <span class="opacity-50" data-v-18ccce42>${ssrInterpolate(discount.code)}</span></div>`);
            }
            _push(`</div> <div class="mr-3" data-v-18ccce42>`);
            if (discount.status === "active") {
              _push(`<button class="text-sm accent-text hover:opacity-80 transition-colors flex items-center gap-1 px-2" data-v-18ccce42>
                  \u062C\u0632\u0626\u06CC\u0627\u062A
                  <i class="ti ti-chevron-left text-xs" data-v-18ccce42></i></button>`);
            } else {
              _push(`<span class="text-sm text-secondary opacity-50 px-2" data-v-18ccce42>${ssrInterpolate(discount.status === "expired" ? "\u0645\u0646\u0642\u0636\u06CC" : "\u0627\u0633\u062A\u0641\u0627\u062F\u0647 \u0634\u062F\u0647")}</span>`);
            }
            _push(`</div></div></div>`);
          });
          _push(`<!--]-->`);
        }
        _push(`</div></div>`);
      }
      _push(`</div></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/rewards/RewardsPage.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const RewardsPage = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-18ccce42"]]);

export { RewardsPage as default };
//# sourceMappingURL=RewardsPage-DyGqLvrS.mjs.map
