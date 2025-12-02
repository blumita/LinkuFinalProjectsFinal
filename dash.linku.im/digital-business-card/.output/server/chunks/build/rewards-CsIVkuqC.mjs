import { defineComponent, ref, computed, mergeProps, unref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrInterpolate, ssrRenderList, ssrRenderClass, ssrRenderStyle, ssrIncludeBooleanAttr } from 'vue/server-renderer';
import { u as useRewardStore } from './reward-VWAw_5_I.mjs';
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
  __name: "rewards",
  __ssrInlineRender: true,
  setup(__props) {
    const rewardStore = useRewardStore();
    const copyingCode = ref(null);
    const selectedFilter = ref("all");
    const filters = [
      { label: "\u0647\u0645\u0647", value: "all" },
      { label: "\u0641\u0639\u0627\u0644", value: "active" },
      { label: "\u0627\u0633\u062A\u0641\u0627\u062F\u0647 \u0634\u062F\u0647", value: "used" },
      { label: "\u0645\u0646\u0642\u0636\u06CC", value: "expired" }
    ];
    const filteredDiscounts = computed(() => {
      if (selectedFilter.value === "all") {
        return rewardStore.rewards;
      }
      return rewardStore.rewards.filter((r) => r.status === selectedFilter.value);
    });
    const activeCount = computed(() => rewardStore.activeRewards.length);
    const usedCount = computed(() => rewardStore.usedRewards.length);
    const expiredCount = computed(() => rewardStore.expiredRewards.length);
    const formatDate = (dateString) => {
      if (!dateString) return "\u0646\u0627\u0645\u0634\u062E\u0635";
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        return "\u0646\u0627\u0645\u0634\u062E\u0635";
      }
      return new Intl.DateTimeFormat("fa-IR").format(date);
    };
    const getDaysRemaining = (expiryDate) => {
      if (!expiryDate) return 0;
      const today = /* @__PURE__ */ new Date();
      const expiry = new Date(expiryDate);
      if (isNaN(expiry.getTime())) {
        return 0;
      }
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
          return "bg-green-500/10 text-green-500";
        case "expired":
          return "bg-red-500/10 text-red-500";
        case "used":
          return "bg-gray-500/10 text-gray-500";
        default:
          return "bg-secondary text-secondary";
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
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "min-h-screen bg-background" }, _attrs))}><div class="lg:hidden fixed top-0 left-0 right-0 z-50 bg-card border-b border-border"><div class="flex items-center justify-between px-4 h-16"><button class="p-2 hover:bg-muted rounded-lg transition-colors"><i class="ti ti-arrow-right text-foreground text-xl"></i></button> <h1 class="text-lg font-bold text-foreground">\u062A\u062E\u0641\u06CC\u0641\u0627\u062A \u0648 \u062C\u0648\u0627\u06CC\u0632</h1> <div class="w-10"></div></div></div> <div class="hidden lg:block bg-card border-b border-border sticky top-0 z-40"><div class="px-4 lg:px-6 py-6"><div class="flex items-center justify-between"><div><h1 class="text-2xl font-bold text-foreground mb-1">\u062A\u062E\u0641\u06CC\u0641\u0627\u062A \u0648 \u062C\u0648\u0627\u06CC\u0632</h1> <p class="text-sm text-muted-foreground">\u0645\u062F\u06CC\u0631\u06CC\u062A \u06A9\u062F\u0647\u0627\u06CC \u062A\u062E\u0641\u06CC\u0641 \u062E\u0648\u062F</p></div> <div class="flex items-center gap-3">`);
      if (!unref(rewardStore).isLoading) {
        _push(`<div class="flex items-center gap-6 px-6 py-3 bg-muted rounded-xl"><div class="text-center"><p class="text-xs text-muted-foreground mb-1">\u0641\u0639\u0627\u0644</p> <p class="text-lg font-bold text-foreground">${ssrInterpolate(activeCount.value)}</p></div> <div class="w-px h-8 bg-border"></div> <div class="text-center"><p class="text-xs text-muted-foreground mb-1">\u0627\u0633\u062A\u0641\u0627\u062F\u0647 \u0634\u062F\u0647</p> <p class="text-lg font-bold text-foreground">${ssrInterpolate(usedCount.value)}</p></div> <div class="w-px h-8 bg-border"></div> <div class="text-center"><p class="text-xs text-muted-foreground mb-1">\u0645\u0646\u0642\u0636\u06CC</p> <p class="text-lg font-bold text-foreground">${ssrInterpolate(expiredCount.value)}</p></div></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div></div></div></div> <div class="lg:pt-0 pt-20 pb-24 lg:pb-8"><div class="px-4 lg:px-6 py-6">`);
      if (unref(rewardStore).isLoading) {
        _push(`<div class="space-y-6 animate-pulse"><div class="bg-muted rounded-2xl p-6 h-32"></div> <div class="space-y-4"><!--[-->`);
        ssrRenderList(4, (n) => {
          _push(`<div class="bg-card border border-border p-4 rounded-xl h-32"></div>`);
        });
        _push(`<!--]--></div></div>`);
      } else {
        _push(`<div><div class="mb-6"><div class="flex items-center gap-3 overflow-x-auto lg:overflow-visible pb-2 lg:justify-start"><!--[-->`);
        ssrRenderList(filters, (filter) => {
          _push(`<button class="${ssrRenderClass([
            "flex-shrink-0 px-4 py-2.5 rounded-xl text-sm font-medium transition-all",
            selectedFilter.value === filter.value ? "bg-primary text-primary-foreground shadow-sm" : "bg-muted text-muted-foreground hover:bg-muted/80"
          ])}">${ssrInterpolate(filter.label)}</button>`);
        });
        _push(`<!--]--></div></div> <div class="space-y-4 lg:grid lg:grid-cols-2 xl:grid-cols-3 lg:gap-6 lg:space-y-0">`);
        if (filteredDiscounts.value.length === 0) {
          _push(`<div class="bg-card border border-border p-8 rounded-xl text-center"><i class="ti ti-discount-off text-muted-foreground text-4xl mb-4"></i> <h4 class="font-medium text-foreground mb-2">\u0647\u06CC\u0686 \u062A\u062E\u0641\u06CC\u0641\u06CC \u06CC\u0627\u0641\u062A \u0646\u0634\u062F</h4> <p class="text-sm text-muted-foreground">\u062F\u0631 \u0627\u06CC\u0646 \u062F\u0633\u062A\u0647 \u062A\u062E\u0641\u06CC\u0641\u06CC \u0645\u0648\u062C\u0648\u062F \u0646\u06CC\u0633\u062A</p></div>`);
        } else {
          _push(`<!--[-->`);
          ssrRenderList(filteredDiscounts.value, (discount) => {
            _push(`<div class="${ssrRenderClass([
              "bg-card border border-border p-5 lg:p-6 rounded-xl transition-all flex flex-col",
              discount.status === "active" ? "cursor-pointer hover:shadow-lg hover:border-primary/30" : "opacity-60"
            ])}"><div class="flex items-start justify-between mb-3"><div class="flex-1"><div class="flex items-center gap-2 mb-2 flex-wrap"><h4 class="font-medium text-foreground lg:text-base">${ssrInterpolate(discount.title)}</h4> <span class="${ssrRenderClass([
              "text-xs px-2.5 py-1 rounded-full font-medium",
              getDiscountStatusClass(discount.status)
            ])}">${ssrInterpolate(getDiscountStatusText(discount.status))}</span></div> <p class="text-sm text-muted-foreground mb-4 line-clamp-2">${ssrInterpolate(discount.description)}</p> `);
            if (discount.status === "active" && getDaysRemaining(discount.expiryDate) <= 7 && getDaysRemaining(discount.expiryDate) > 0) {
              _push(`<div class="mb-4"><div class="flex items-center justify-between mb-1.5"><span class="text-xs text-muted-foreground">\u0632\u0645\u0627\u0646 \u0628\u0627\u0642\u06CC\u200C\u0645\u0627\u0646\u062F\u0647</span> <span class="text-xs font-medium text-primary">${ssrInterpolate(getDaysRemaining(discount.expiryDate))} \u0631\u0648\u0632
                    </span></div> <div class="w-full bg-muted rounded-full h-2"><div class="bg-primary h-2 rounded-full transition-all duration-300" style="${ssrRenderStyle({ width: `${getProgressPercentage(discount.expiryDate)}%` })}"></div></div></div>`);
            } else {
              _push(`<!---->`);
            }
            _push(` <div class="flex items-center gap-4 text-xs text-muted-foreground mb-4 lg:mb-0"><span class="flex items-center gap-1.5"><i class="ti ti-percentage"></i> ${ssrInterpolate(discount.value)}${ssrInterpolate(discount.type === "percentage" ? "%" : " \u0631\u06CC\u0627\u0644")}</span> <span class="flex items-center gap-1.5"><i class="ti ti-calendar"></i> ${ssrInterpolate(formatDate(discount.expiryDate))}</span></div></div> <div class="w-14 h-14 lg:w-16 lg:h-16 bg-gradient-to-br from-primary/10 to-primary/5 rounded-xl flex items-center justify-center border border-primary/20"><i class="ti ti-discount text-primary text-2xl lg:text-3xl"></i></div></div> <div class="pt-3 mt-auto border-t border-border">`);
            if (discount.status === "active") {
              _push(`<button${ssrIncludeBooleanAttr(copyingCode.value === discount.code) ? " disabled" : ""} class="${ssrRenderClass([
                "w-full flex items-center justify-center gap-2 text-sm py-2.5 px-4 rounded-lg font-medium transition-all",
                copyingCode.value === discount.code ? "bg-green-500/10 text-green-500 border border-green-500/20" : "bg-primary text-primary-foreground hover:opacity-90 hover:shadow-md"
              ])}"><i class="${ssrRenderClass([copyingCode.value === discount.code ? "ti ti-check" : "ti ti-copy", "text-base"])}"></i> `);
              if (copyingCode.value === discount.code) {
                _push(`<span>
                  \u06A9\u067E\u06CC \u0634\u062F!
                </span>`);
              } else {
                _push(`<span><span class="font-mono">${ssrInterpolate(discount.code)}</span> <span class="mr-1">\u06A9\u067E\u06CC \u06A9\u062F</span></span>`);
              }
              _push(`</button>`);
            } else {
              _push(`<div class="flex items-center justify-center gap-2 text-sm py-2.5 px-4 rounded-lg bg-muted text-muted-foreground"><i class="ti ti-copy text-base opacity-50"></i> <span class="opacity-50 font-mono">${ssrInterpolate(discount.code)}</span> <span class="mr-2 text-xs">${ssrInterpolate(discount.status === "expired" ? "(\u0645\u0646\u0642\u0636\u06CC)" : "(\u0627\u0633\u062A\u0641\u0627\u062F\u0647 \u0634\u062F\u0647)")}</span></div>`);
            }
            _push(`</div></div>`);
          });
          _push(`<!--]-->`);
        }
        _push(`</div></div>`);
      }
      _push(`</div></div></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/dashboard/rewards.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=rewards-CsIVkuqC.mjs.map
