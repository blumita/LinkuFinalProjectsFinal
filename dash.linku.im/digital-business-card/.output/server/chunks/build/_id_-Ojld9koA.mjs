import { defineComponent, ref, computed, mergeProps, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderAttr, ssrInterpolate, ssrRenderClass, ssrIncludeBooleanAttr, ssrRenderStyle, ssrRenderList } from 'vue/server-renderer';
import { useRoute, useRouter } from 'vue-router';
import { u as useRewardStore } from './reward-CUwOjHba.mjs';
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

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "[id]",
  __ssrInlineRender: true,
  setup(__props) {
    const route = useRoute();
    useRouter();
    const rewardStore = useRewardStore();
    const loading = ref(true);
    const copied = ref(false);
    const discount = computed(() => {
      const id = route.params.id;
      return rewardStore.rewards.find((r) => {
        return String(r.id) === String(id) || r.code === id;
      });
    });
    const formatDate = (dateString) => {
      const date = new Date(dateString);
      return new Intl.DateTimeFormat("fa-IR", {
        year: "numeric",
        month: "long",
        day: "numeric"
      }).format(date);
    };
    const formatPrice = (price) => {
      return new Intl.NumberFormat("fa-IR").format(price);
    };
    const getDaysRemaining = (expiryDate) => {
      const today = /* @__PURE__ */ new Date();
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
          return "bg-green-500/10 text-green-600 border border-green-500/20";
        case "expired":
          return "bg-orange-500/10 text-orange-600 border border-orange-500/20";
        case "used":
          return "bg-gray-500/10 text-gray-600 border border-gray-500/20";
        default:
          return "bg-gray-500/10 text-gray-600";
      }
    };
    const getDiscountStatusText = (status) => {
      switch (status) {
        case "active":
          return "\u0641\u0639\u0627\u0644";
        case "expired":
          return "\u0645\u0646\u0642\u0636\u06CC \u0634\u062F\u0647";
        case "used":
          return "\u0627\u0633\u062A\u0641\u0627\u062F\u0647 \u0634\u062F\u0647";
        default:
          return "\u0646\u0627\u0645\u0634\u062E\u0635";
      }
    };
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "min-h-screen bg-background" }, _attrs))}><div class="fixed top-0 left-0 right-0 z-40 bg-card border-b border-border"><div class="flex items-center h-14 px-4"><button class="flex items-center justify-center w-10 h-10 rounded-lg text-foreground hover:bg-accent transition-colors"><i class="ti ti-arrow-right text-xl"></i></button> <h1 class="flex-1 text-lg font-semibold text-foreground">\u062C\u0632\u0626\u06CC\u0627\u062A \u06A9\u062F \u062A\u062E\u0641\u06CC\u0641</h1></div></div> <div class="pt-16 pb-8">`);
      if (loading.value) {
        _push(`<div class="max-w-2xl mx-auto px-4 space-y-4 animate-pulse"><div class="h-48 bg-accent rounded-2xl"></div> <div class="h-32 bg-accent rounded-2xl"></div> <div class="h-48 bg-accent rounded-2xl"></div></div>`);
      } else if (discount.value) {
        _push(`<div class="max-w-2xl mx-auto px-4 space-y-4">`);
        if (discount.value.banner) {
          _push(`<div class="w-full rounded-2xl overflow-hidden border border-border"><img${ssrRenderAttr("src", discount.value.banner)}${ssrRenderAttr("alt", discount.value.title)} class="w-full h-48 object-cover"></div>`);
        } else {
          _push(`<!---->`);
        }
        _push(` <div class="bg-card border border-border rounded-2xl p-6 space-y-6"><div class="flex items-start gap-4"><div class="w-16 h-16 rounded-xl flex items-center justify-center border border-border overflow-hidden flex-shrink-0 bg-primary/5">`);
        if (discount.value.image) {
          _push(`<img${ssrRenderAttr("src", discount.value.image)}${ssrRenderAttr("alt", discount.value.title)} class="w-full h-full object-cover">`);
        } else {
          _push(`<i class="ti ti-discount text-primary text-3xl"></i>`);
        }
        _push(`</div> <div class="flex-1 space-y-2"><div class="flex items-start justify-between gap-2"><h2 class="text-xl font-bold text-foreground">${ssrInterpolate(discount.value.title)}</h2> <span class="${ssrRenderClass([
          "text-xs px-3 py-1.5 rounded-full font-medium whitespace-nowrap",
          getDiscountStatusClass(discount.value.status)
        ])}">${ssrInterpolate(getDiscountStatusText(discount.value.status))}</span></div> <p class="text-muted-foreground text-sm">${ssrInterpolate(discount.value.description)}</p></div></div> <div class="bg-gradient-to-br from-primary/10 to-primary/5 rounded-xl p-6 text-center border border-primary/20"><div class="text-4xl font-bold text-primary mb-2">${ssrInterpolate(discount.value.value)}${ssrInterpolate(discount.value.type === "percentage" ? "%" : " \u062A\u0648\u0645\u0627\u0646")}</div> <p class="text-sm text-muted-foreground">\u0645\u0642\u062F\u0627\u0631 \u062A\u062E\u0641\u06CC\u0641</p></div> <div class="space-y-3"><label class="text-sm font-medium text-foreground">\u06A9\u062F \u062A\u062E\u0641\u06CC\u0641</label> <div class="flex items-center gap-3"><div class="flex-1 bg-muted border border-border rounded-xl px-4 py-3 font-mono text-lg text-center text-foreground">${ssrInterpolate(discount.value.code)}</div> <button${ssrIncludeBooleanAttr(copied.value) ? " disabled" : ""} class="${ssrRenderClass([
          "px-6 py-3 rounded-xl font-medium transition-all flex items-center gap-2",
          copied.value ? "bg-green-500/10 text-green-600 border border-green-500/20" : "bg-primary text-primary-foreground hover:bg-primary/90"
        ])}"><i class="${ssrRenderClass(copied.value ? "ti ti-check" : "ti ti-copy")}"></i> ${ssrInterpolate(copied.value ? "\u06A9\u067E\u06CC \u0634\u062F" : "\u06A9\u067E\u06CC")}</button></div></div></div> <div class="bg-card border border-border rounded-2xl p-6 space-y-4"><h3 class="text-lg font-semibold text-foreground mb-4">\u062C\u0632\u0626\u06CC\u0627\u062A</h3> <div class="space-y-3"><div class="flex items-center justify-between py-3 border-b border-border"><div class="flex items-center gap-3 text-muted-foreground"><i class="ti ti-calendar text-xl"></i> <span>\u062A\u0627\u0631\u06CC\u062E \u0627\u0646\u0642\u0636\u0627</span></div> <span class="text-foreground font-medium">${ssrInterpolate(formatDate(discount.value.expiryDate))}</span></div> `);
        if (discount.value.status === "active") {
          _push(`<div class="flex items-center justify-between py-3 border-b border-border"><div class="flex items-center gap-3 text-muted-foreground"><i class="ti ti-clock text-xl"></i> <span>\u0632\u0645\u0627\u0646 \u0628\u0627\u0642\u06CC\u200C\u0645\u0627\u0646\u062F\u0647</span></div> <span class="${ssrRenderClass([
            "font-medium",
            getDaysRemaining(discount.value.expiryDate) <= 3 ? "text-red-500" : "text-green-600"
          ])}">${ssrInterpolate(getDaysRemaining(discount.value.expiryDate))} \u0631\u0648\u0632
              </span></div>`);
        } else {
          _push(`<!---->`);
        }
        _push(` `);
        if (discount.value.minAmount) {
          _push(`<div class="flex items-center justify-between py-3 border-b border-border"><div class="flex items-center gap-3 text-muted-foreground"><i class="ti ti-coins text-xl"></i> <span>\u062D\u062F\u0627\u0642\u0644 \u0645\u0628\u0644\u063A \u062E\u0631\u06CC\u062F</span></div> <span class="text-foreground font-medium">${ssrInterpolate(formatPrice(discount.value.minAmount))} \u062A\u0648\u0645\u0627\u0646</span></div>`);
        } else {
          _push(`<!---->`);
        }
        _push(` `);
        if (discount.value.maxDiscount) {
          _push(`<div class="flex items-center justify-between py-3 border-b border-border"><div class="flex items-center gap-3 text-muted-foreground"><i class="ti ti-circle-dashed text-xl"></i> <span>\u062D\u062F\u0627\u06A9\u062B\u0631 \u062A\u062E\u0641\u06CC\u0641</span></div> <span class="text-foreground font-medium">${ssrInterpolate(formatPrice(discount.value.maxDiscount))} \u062A\u0648\u0645\u0627\u0646</span></div>`);
        } else {
          _push(`<!---->`);
        }
        _push(` `);
        if (discount.value.usageLimit) {
          _push(`<div class="flex items-center justify-between py-3 border-b border-border"><div class="flex items-center gap-3 text-muted-foreground"><i class="ti ti-repeat text-xl"></i> <span>\u062A\u0639\u062F\u0627\u062F \u0627\u0633\u062A\u0641\u0627\u062F\u0647</span></div> <span class="text-foreground font-medium">${ssrInterpolate(discount.value.usageCount || 0)} \u0627\u0632 ${ssrInterpolate(discount.value.usageLimit)}</span></div>`);
        } else {
          _push(`<!---->`);
        }
        _push(` <div class="flex items-center justify-between py-3"><div class="flex items-center gap-3 text-muted-foreground"><i class="ti ti-tag text-xl"></i> <span>\u0646\u0648\u0639 \u062A\u062E\u0641\u06CC\u0641</span></div> <span class="text-foreground font-medium">${ssrInterpolate(discount.value.type === "percentage" ? "\u062F\u0631\u0635\u062F\u06CC" : "\u0645\u0628\u0644\u063A \u062B\u0627\u0628\u062A")}</span></div></div></div> `);
        if (discount.value.status === "active" && getDaysRemaining(discount.value.expiryDate) <= 7) {
          _push(`<div class="bg-card border border-border rounded-2xl p-6"><div class="flex items-center justify-between mb-3"><span class="text-sm font-medium text-foreground">\u067E\u06CC\u0634\u0631\u0641\u062A \u0632\u0645\u0627\u0646</span> <span class="text-sm font-medium text-primary">${ssrInterpolate(Math.round(getProgressPercentage(discount.value.expiryDate)))}%
            </span></div> <div class="w-full bg-muted rounded-full h-3 overflow-hidden"><div class="bg-gradient-to-r from-primary to-primary/60 h-3 rounded-full transition-all duration-300" style="${ssrRenderStyle({ width: `${getProgressPercentage(discount.value.expiryDate)}%` })}"></div></div> <p class="text-xs text-muted-foreground mt-2 text-center">${ssrInterpolate(getDaysRemaining(discount.value.expiryDate))} \u0631\u0648\u0632 \u062A\u0627 \u0627\u0646\u0642\u0636\u0627
          </p></div>`);
        } else {
          _push(`<!---->`);
        }
        _push(` `);
        if (discount.value.appliesTo && discount.value.appliesTo.length > 0) {
          _push(`<div class="bg-card border border-border rounded-2xl p-6"><h3 class="text-lg font-semibold text-foreground mb-4 flex items-center gap-2"><i class="ti ti-list-check"></i>
            \u0634\u0631\u0627\u06CC\u0637 \u0627\u0633\u062A\u0641\u0627\u062F\u0647
          </h3> <ul class="space-y-2"><!--[-->`);
          ssrRenderList(discount.value.appliesTo, (item, index) => {
            _push(`<li class="flex items-start gap-3 text-sm text-muted-foreground"><i class="ti ti-circle-check text-green-500 text-base mt-0.5 flex-shrink-0"></i> <span>${ssrInterpolate(item)}</span></li>`);
          });
          _push(`<!--]--></ul></div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div>`);
      } else {
        _push(`<div class="max-w-2xl mx-auto px-4 text-center py-12"><div class="w-20 h-20 mx-auto mb-4 rounded-full bg-red-500/10 flex items-center justify-center"><i class="ti ti-alert-circle text-red-500 text-4xl"></i></div> <h3 class="text-xl font-semibold text-foreground mb-2">\u06A9\u062F \u062A\u062E\u0641\u06CC\u0641 \u06CC\u0627\u0641\u062A \u0646\u0634\u062F</h3> <p class="text-muted-foreground mb-6">\u0627\u06CC\u0646 \u06A9\u062F \u062A\u062E\u0641\u06CC\u0641 \u062D\u0630\u0641 \u0634\u062F\u0647 \u06CC\u0627 \u0648\u062C\u0648\u062F \u0646\u062F\u0627\u0631\u062F</p> <button class="px-6 py-3 bg-primary text-primary-foreground rounded-xl font-medium hover:bg-primary/90 transition-colors">
          \u0628\u0627\u0632\u06AF\u0634\u062A \u0628\u0647 \u0644\u06CC\u0633\u062A \u062A\u062E\u0641\u06CC\u0641\u200C\u0647\u0627
        </button></div>`);
      }
      _push(`</div></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/rewards/discount/[id].vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=_id_-Ojld9koA.mjs.map
