import { defineComponent, ref, computed, mergeProps, unref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderStyle, ssrInterpolate, ssrRenderList, ssrRenderClass, ssrRenderTeleport, ssrRenderAttr, ssrIncludeBooleanAttr } from 'vue/server-renderer';
import { u as usePlanStore } from './plan-BwkVH_kK.mjs';
import { b as useRouter, f as useRoute } from './server.mjs';
import { _ as _export_sfc } from './_plugin-vue_export-helper-1tPrXgE0.mjs';
import 'pinia';
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
  __name: "order",
  __ssrInlineRender: true,
  setup(__props) {
    useRouter();
    const route = useRoute();
    const planStore = usePlanStore();
    const isLoading = ref(true);
    const showSuccessModal = ref(false);
    const isNonIranIP = ref(false);
    const showDiscountSheet = ref(false);
    const discountCode = ref("");
    const isCheckingDiscount = ref(false);
    const discountStatus = ref(null);
    const popularDiscounts = ref([
      { code: "WELCOME20", description: "\u062A\u062E\u0641\u06CC\u0641 \u0648\u06CC\u0698\u0647 \u06A9\u0627\u0631\u0628\u0631\u0627\u0646 \u062C\u062F\u06CC\u062F", discount: "20%" },
      { code: "SUMMER2025", description: "\u062A\u062E\u0641\u06CC\u0641 \u062A\u0627\u0628\u0633\u062A\u0627\u0646\u0647", discount: "15%" },
      { code: "SPECIAL10", description: "\u062A\u062E\u0641\u06CC\u0641 \u0648\u06CC\u0698\u0647", discount: "10%" }
    ]);
    const getIconForPlan = (duration) => {
      if (duration.includes("12") || duration.includes("\u06F1\u06F2") || duration.includes("\u0633\u0627\u0644")) return "ti ti-crown";
      if (duration.includes("6") || duration.includes("\u06F6")) return "ti ti-star";
      if (duration.includes("3") || duration.includes("\u06F3")) return "ti ti-bolt";
      return "ti ti-calendar";
    };
    const formatPrice = (price) => {
      return price.toLocaleString("fa-IR");
    };
    computed(() => {
      if (!selectedPlan.value) return 0;
      return planStore.plans.findIndex((p) => Number(p.id) === Number(selectedPlan.value.id));
    });
    const getPlanIconGradient = () => {
      return "from-primary via-accent to-primary";
    };
    const getPlanIconColorClass = () => {
      return "text-white";
    };
    const getPriceCardGradient = () => {
      return "from-primary/5 via-accent/5 to-primary/10";
    };
    const getPriceCardBorder = () => {
      return "border-primary/20";
    };
    const getPriceCardDecoLight = () => {
      return "from-primary/10";
    };
    const getPriceCardDecoDark = () => {
      return "from-accent/10";
    };
    const getPriceIconBg = () => {
      return "bg-primary/10";
    };
    const getPriceIconColor = () => {
      return "text-primary";
    };
    const getPriceTextColor = () => {
      return "text-foreground";
    };
    const getPriceBigTextColor = () => {
      return "text-primary";
    };
    const getPriceSmallTextColor = () => {
      return "text-muted-foreground";
    };
    const getPriceBorderColor = () => {
      return "border-border";
    };
    const getMonthlyBadgeBg = () => {
      return "bg-accent/10";
    };
    const getBadgeGradient = () => {
      return "from-primary/5 to-accent/5";
    };
    const getPremiumBadgeGradient = () => {
      return "from-primary to-accent";
    };
    const getPaymentCardGradient = () => {
      return "from-primary/10 via-accent/5 to-primary/5";
    };
    const getPaymentCardBorder = () => {
      return "border-primary/30";
    };
    const getPaymentIconBg = () => {
      return "bg-primary/10 border-primary/20";
    };
    const getPaymentIconColor = () => {
      return "text-primary";
    };
    const getPaymentTextColor = () => {
      return "text-foreground";
    };
    const getPaymentSubTextColor = () => {
      return "text-muted-foreground";
    };
    const getPaymentCheckBg = () => {
      return "bg-primary";
    };
    const selectedPlan = computed(() => {
      const planId = route.query.id;
      if (!planId) return null;
      const plan = planStore.plans.find((p) => Number(p.id) === Number(planId));
      if (!plan) return null;
      const finalPrice = Math.round(plan.price * (1 - plan.discount / 100));
      const discountAmount = plan.price - finalPrice;
      const durationMatch = plan.duration.match(/\d+/);
      const months = durationMatch ? parseInt(durationMatch[0]) : 1;
      const monthlyPrice = Math.round(finalPrice / months);
      return {
        id: plan.id,
        title: plan.title,
        duration: plan.duration,
        monthlyPrice: `${formatPrice(monthlyPrice)} \u062A`,
        totalPrice: `${formatPrice(finalPrice)} \u062A`,
        originalPrice: `${formatPrice(plan.price)} \u062A`,
        discount: `${plan.discount}\u066A`,
        discountAmount: `${formatPrice(discountAmount)} \u062A`,
        icon: getIconForPlan(plan.duration),
        months,
        hasDiscount: plan.discount > 0
      };
    });
    const getExpiryDate = () => {
      if (!selectedPlan.value) return "";
      const now = /* @__PURE__ */ new Date();
      const monthsToAdd = selectedPlan.value.months;
      const expiryDate = new Date(now.getFullYear(), now.getMonth() + monthsToAdd, now.getDate());
      return expiryDate.toLocaleDateString("fa-IR", {
        year: "numeric",
        month: "long",
        day: "numeric"
      });
    };
    return (_ctx, _push, _parent, _attrs) => {
      var _a;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "min-h-screen bg-background" }, _attrs))} data-v-383c5463>`);
      if (unref(showSuccessModal) && !unref(isLoading) && unref(selectedPlan)) {
        _push(`<div class="fixed inset-0 z-[100] flex items-center justify-center px-4 bg-black/50" data-v-383c5463><div class="bg-card rounded-3xl p-8 text-center max-w-sm w-full shadow-2xl relative overflow-hidden" data-v-383c5463><div class="absolute inset-0 bg-gradient-to-br from-green-500/10 to-primary/10" data-v-383c5463></div> <div class="relative z-10" data-v-383c5463><div class="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg" style="${ssrRenderStyle({ "background": "linear-gradient(135deg, #10b981 0%, #059669 100%)" })}" data-v-383c5463><i class="ti ti-check text-white text-4xl" data-v-383c5463></i></div> <h3 class="text-2xl font-bold text-primary mb-3" data-v-383c5463>\u062A\u0628\u0631\u06CC\u06A9! \u{1F389}</h3> <p class="text-lg text-muted-foreground mb-6" data-v-383c5463>
            \u0627\u0634\u062A\u0631\u0627\u06A9 \u0634\u0645\u0627 \u0628\u0627 \u0645\u0648\u0641\u0642\u06CC\u062A \u0641\u0639\u0627\u0644 \u0634\u062F
          </p> <div class="bg-primary/10 rounded-xl p-4 mb-6 border border-primary/20" data-v-383c5463><div class="font-semibold text-lg mb-2 text-primary" data-v-383c5463>${ssrInterpolate((_a = unref(selectedPlan)) == null ? void 0 : _a.title)} \u067E\u0631\u0645\u06CC\u0648\u0645</div> <div class="text-sm text-muted-foreground" data-v-383c5463>
              \u062A\u0627 <span class="font-medium text-primary" data-v-383c5463>${ssrInterpolate(getExpiryDate())}</span> \u0645\u0639\u062A\u0628\u0631 \u0627\u0633\u062A
            </div></div> <div class="space-y-3" data-v-383c5463><button class="w-full bg-primary text-primary-foreground font-semibold py-3 px-6 rounded-xl hover:opacity-90 transition-all duration-200" data-v-383c5463>
              \u0648\u0631\u0648\u062F \u0628\u0647 \u067E\u0631\u0648\u0641\u0627\u06CC\u0644
            </button> <button class="w-full text-muted-foreground font-medium py-2" data-v-383c5463>
              \u0628\u0633\u062A\u0646
            </button></div></div></div></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(` <div class="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border" data-v-383c5463><div class="container mx-auto px-4" data-v-383c5463><div class="flex items-center justify-between h-16" data-v-383c5463><button class="flex items-center gap-2 text-foreground hover:text-primary transition-colors" data-v-383c5463><i class="ti ti-arrow-right text-xl" data-v-383c5463></i> <span class="text-sm font-medium" data-v-383c5463>\u0628\u0627\u0632\u06AF\u0634\u062A</span></button> <div class="text-center" data-v-383c5463><h1 class="text-lg font-bold text-foreground" data-v-383c5463>\u062A\u06A9\u0645\u06CC\u0644 \u062E\u0631\u06CC\u062F</h1> <p class="text-xs text-muted-foreground" data-v-383c5463>\u062C\u0632\u0626\u06CC\u0627\u062A \u0633\u0641\u0627\u0631\u0634 \u0634\u0645\u0627</p></div> <div class="w-20" data-v-383c5463></div></div></div></div> <div class="pt-[68px] pb-24 px-4 max-w-7xl mx-auto" data-v-383c5463>`);
      if (unref(isLoading) || !unref(selectedPlan)) {
        _push(`<div class="space-y-4 animate-pulse" data-v-383c5463><div class="bg-muted rounded-2xl h-40" data-v-383c5463></div> <div class="bg-muted rounded-2xl p-6" data-v-383c5463><div class="h-6 w-24 bg-muted-foreground/20 rounded mx-auto mb-3" data-v-383c5463></div> <div class="h-8 w-48 bg-muted-foreground/20 rounded mx-auto" data-v-383c5463></div></div> <div class="bg-card rounded-xl p-6" data-v-383c5463><div class="space-y-3" data-v-383c5463><!--[-->`);
        ssrRenderList(5, (n) => {
          _push(`<div class="flex justify-between" data-v-383c5463><div class="h-4 w-24 bg-muted rounded" data-v-383c5463></div> <div class="h-4 w-20 bg-muted rounded" data-v-383c5463></div></div>`);
        });
        _push(`<!--]--></div></div></div>`);
      } else {
        _push(`<!--[--><div class="hidden lg:grid lg:grid-cols-3 lg:gap-6" data-v-383c5463><div class="lg:col-span-2 space-y-6" data-v-383c5463><div class="relative" data-v-383c5463><div class="bg-card rounded-3xl border border-border overflow-hidden" data-v-383c5463><div class="relative bg-gradient-to-br from-primary/5 via-primary/10 to-accent/5 p-6 border-b border-border" data-v-383c5463><div class="flex items-center justify-between" data-v-383c5463><div class="flex items-center gap-4" data-v-383c5463><div class="relative" data-v-383c5463><div class="${ssrRenderClass([getPlanIconGradient(), "w-16 h-16 rounded-2xl bg-gradient-to-br"])}" data-v-383c5463><div class="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/20 to-transparent" data-v-383c5463></div> <div class="relative h-full flex items-center justify-center" data-v-383c5463><i class="${ssrRenderClass([unref(selectedPlan).icon, "text-3xl", getPlanIconColorClass()])}" data-v-383c5463></i></div></div> `);
        if (unref(selectedPlan).hasDiscount) {
          _push(`<div class="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-gradient-to-br from-red-500 to-pink-600 flex items-center justify-center text-white text-xs font-bold shadow-lg" data-v-383c5463>${ssrInterpolate(unref(selectedPlan).discount)}</div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div> <div data-v-383c5463><h2 class="text-2xl font-bold text-foreground mb-1" data-v-383c5463>${ssrInterpolate(unref(selectedPlan).title)}</h2> <p class="text-sm text-muted-foreground flex items-center gap-1" data-v-383c5463><i class="ti ti-calendar-month text-base" data-v-383c5463></i> <span data-v-383c5463>${ssrInterpolate(unref(selectedPlan).duration)}</span></p></div></div> <div class="text-left" data-v-383c5463><div class="text-xs text-muted-foreground mb-1" data-v-383c5463>\u0627\u0634\u062A\u0631\u0627\u06A9</div> <div class="${ssrRenderClass([getPremiumBadgeGradient(), "px-3 py-1 rounded-lg bg-gradient-to-r text-white text-xs font-bold"])}" data-v-383c5463>
                  \u067E\u0631\u0645\u06CC\u0648\u0645
                </div></div></div></div> <div class="p-6 bg-gradient-to-br from-muted/20 to-transparent" data-v-383c5463><div class="${ssrRenderClass([[getPriceCardGradient(), getPriceCardBorder()], "bg-gradient-to-br rounded-2xl p-6 border-2 relative overflow-hidden"])}" data-v-383c5463><div class="${ssrRenderClass([getPriceCardDecoLight(), "absolute top-0 right-0 w-32 h-32 bg-gradient-to-br to-transparent rounded-bl-full"])}" data-v-383c5463></div> <div class="${ssrRenderClass([getPriceCardDecoDark(), "absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr to-transparent rounded-tr-full"])}" data-v-383c5463></div> <div class="relative z-10" data-v-383c5463><div class="flex items-center justify-center gap-2 mb-4" data-v-383c5463><div class="${ssrRenderClass([getPriceIconBg(), "w-8 h-8 rounded-lg flex items-center justify-center"])}" data-v-383c5463><i class="${ssrRenderClass([getPriceIconColor(), "ti ti-currency-dollar text-lg"])}" data-v-383c5463></i></div> <span class="${ssrRenderClass([getPriceTextColor(), "text-sm font-medium"])}" data-v-383c5463>\u0642\u06CC\u0645\u062A \u0627\u0634\u062A\u0631\u0627\u06A9</span></div> `);
        if (unref(selectedPlan).hasDiscount) {
          _push(`<div class="text-center mb-3" data-v-383c5463><div class="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-red-100 dark:bg-red-900/30" data-v-383c5463><span class="text-sm text-muted-foreground line-through" data-v-383c5463>${ssrInterpolate(unref(selectedPlan).originalPrice)}</span> <span class="text-xs font-bold text-red-600 dark:text-red-400" data-v-383c5463>${ssrInterpolate(unref(selectedPlan).discount)} \u062A\u062E\u0641\u06CC\u0641</span></div></div>`);
        } else {
          _push(`<!---->`);
        }
        _push(` <div class="text-center mb-4" data-v-383c5463><div class="${ssrRenderClass([getPriceBigTextColor(), "text-4xl font-black mb-1"])}" data-v-383c5463>${ssrInterpolate(unref(selectedPlan).totalPrice)}</div> <div class="${ssrRenderClass([getPriceSmallTextColor(), "text-xs"])}" data-v-383c5463>
                    \u0628\u0631\u0627\u06CC ${ssrInterpolate(unref(selectedPlan).duration)}</div></div> <div class="relative py-3" data-v-383c5463><div class="absolute inset-0 flex items-center" data-v-383c5463><div class="${ssrRenderClass([getPriceBorderColor(), "w-full border-t"])}" data-v-383c5463></div></div> <div class="relative flex justify-center" data-v-383c5463><span class="${ssrRenderClass([[getBadgeGradient(), getPriceSmallTextColor()], "px-3 bg-gradient-to-br text-xs"])}" data-v-383c5463>\u0645\u0639\u0627\u062F\u0644</span></div></div> <div class="text-center" data-v-383c5463><div class="${ssrRenderClass([getMonthlyBadgeBg(), "inline-flex items-center gap-2 px-4 py-2 rounded-xl"])}" data-v-383c5463><i class="${ssrRenderClass([getPriceIconColor(), "ti ti-calendar-month"])}" data-v-383c5463></i> <span class="${ssrRenderClass([getPriceBigTextColor(), "text-lg font-bold"])}" data-v-383c5463>${ssrInterpolate(unref(selectedPlan).monthlyPrice)}</span> <span class="${ssrRenderClass([getPriceSmallTextColor(), "text-xs"])}" data-v-383c5463>\u062F\u0631 \u0645\u0627\u0647</span></div></div> `);
        if (unref(selectedPlan).hasDiscount) {
          _push(`<div class="mt-4 text-center" data-v-383c5463><div class="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-red-500 to-pink-600 text-white" data-v-383c5463><i class="ti ti-discount-check text-sm" data-v-383c5463></i> <span class="text-xs font-medium" data-v-383c5463>\u0634\u0645\u0627 ${ssrInterpolate(unref(selectedPlan).discountAmount)} \u0635\u0631\u0641\u0647\u200C\u062C\u0648\u06CC\u06CC \u0645\u06CC\u200C\u06A9\u0646\u06CC\u062F</span></div></div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div></div></div> <div class="p-6 bg-gradient-to-br from-primary/3 to-transparent border-t border-border" data-v-383c5463><div class="flex items-center justify-center gap-6 flex-wrap" data-v-383c5463><div class="flex items-center gap-2 text-sm" data-v-383c5463><div class="w-8 h-8 rounded-lg bg-green-500/10 flex items-center justify-center" data-v-383c5463><i class="ti ti-check text-green-600 dark:text-green-400" data-v-383c5463></i></div> <span class="text-muted-foreground" data-v-383c5463>\u062F\u0633\u062A\u0631\u0633\u06CC \u06A9\u0627\u0645\u0644</span></div> <div class="flex items-center gap-2 text-sm" data-v-383c5463><div class="w-8 h-8 rounded-lg bg-purple-500/10 flex items-center justify-center" data-v-383c5463><i class="ti ti-sparkles text-purple-600 dark:text-purple-400" data-v-383c5463></i></div> <span class="text-muted-foreground" data-v-383c5463>\u0627\u0645\u06A9\u0627\u0646\u0627\u062A \u0648\u06CC\u0698\u0647</span></div> <div class="flex items-center gap-2 text-sm" data-v-383c5463><div class="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center" data-v-383c5463><i class="ti ti-headset text-blue-600 dark:text-blue-400" data-v-383c5463></i></div> <span class="text-muted-foreground" data-v-383c5463>\u067E\u0634\u062A\u06CC\u0628\u0627\u0646\u06CC \u0648\u06CC\u0698\u0647</span></div></div></div></div> <div class="absolute -top-20 -right-20 w-40 h-40 rounded-full bg-gradient-to-br from-primary/5 to-accent/5 blur-3xl -z-10" data-v-383c5463></div> <div class="absolute -bottom-20 -left-20 w-40 h-40 rounded-full bg-gradient-to-br from-accent/5 to-primary/5 blur-3xl -z-10" data-v-383c5463></div></div></div> <div class="lg:col-span-1" data-v-383c5463><div class="sticky top-24 space-y-4" data-v-383c5463><div class="bg-card rounded-xl p-6 shadow-sm border border-border" data-v-383c5463><h3 class="text-lg font-semibold text-foreground mb-4 flex items-center" data-v-383c5463><i class="ti ti-receipt text-xl ml-2 text-primary" data-v-383c5463></i>
          \u062E\u0644\u0627\u0635\u0647 \u0633\u0641\u0627\u0631\u0634
        </h3> <div class="space-y-3" data-v-383c5463><div class="flex justify-between items-center py-2 border-b border-border" data-v-383c5463><span class="text-muted-foreground" data-v-383c5463>\u0646\u0648\u0639 \u0627\u0634\u062A\u0631\u0627\u06A9:</span> <span class="text-foreground font-medium" data-v-383c5463>${ssrInterpolate(unref(selectedPlan).title)} \u067E\u0631\u0645\u06CC\u0648\u0645</span></div> <div class="flex justify-between items-center py-2 border-b border-border" data-v-383c5463><span class="text-muted-foreground" data-v-383c5463>\u0645\u062F\u062A \u0627\u0634\u062A\u0631\u0627\u06A9:</span> <span class="text-foreground font-medium" data-v-383c5463>${ssrInterpolate(unref(selectedPlan).duration)}</span></div> `);
        if (unref(selectedPlan).hasDiscount) {
          _push(`<div class="flex justify-between items-center py-2 border-b border-border" data-v-383c5463><span class="text-muted-foreground" data-v-383c5463>\u0642\u06CC\u0645\u062A \u0627\u0635\u0644\u06CC:</span> <span class="text-muted-foreground line-through" data-v-383c5463>${ssrInterpolate(unref(selectedPlan).originalPrice)}</span></div>`);
        } else {
          _push(`<!---->`);
        }
        _push(` `);
        if (unref(selectedPlan).hasDiscount) {
          _push(`<div class="flex justify-between items-center py-2 border-b border-border" data-v-383c5463><span class="text-green-600 dark:text-green-400" data-v-383c5463>\u062A\u062E\u0641\u06CC\u0641 (${ssrInterpolate(unref(selectedPlan).discount)}):</span> <span class="text-green-600 dark:text-green-400 font-medium" data-v-383c5463>-${ssrInterpolate(unref(selectedPlan).discountAmount)}</span></div>`);
        } else {
          _push(`<!---->`);
        }
        _push(` <div class="flex justify-between items-center py-3 rounded-lg px-3 bg-primary/10" data-v-383c5463><span class="text-lg font-bold text-foreground" data-v-383c5463>\u0645\u0628\u0644\u063A \u0646\u0647\u0627\u06CC\u06CC:</span> <span class="text-2xl font-bold text-primary" data-v-383c5463>${ssrInterpolate(unref(selectedPlan).totalPrice)}</span></div></div></div> <div class="bg-card rounded-xl p-6 shadow-sm border border-border" data-v-383c5463><h3 class="text-lg font-semibold text-foreground mb-4 flex items-center" data-v-383c5463><i class="ti ti-credit-card text-xl ml-2 text-primary" data-v-383c5463></i>
          \u0631\u0648\u0634 \u067E\u0631\u062F\u0627\u062E\u062A
        </h3> <div class="space-y-3" data-v-383c5463><div class="${ssrRenderClass([[getPaymentCardGradient(), getPaymentCardBorder()], "relative overflow-hidden rounded-2xl p-5 cursor-pointer hover:shadow-xl transition-all duration-200 border-2"])}" data-v-383c5463><div class="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent dark:from-white/5" data-v-383c5463></div> <div class="relative flex items-center justify-between" data-v-383c5463><div class="flex items-center gap-3" data-v-383c5463><div class="${ssrRenderClass([getPaymentIconBg(), "w-12 h-12 rounded-xl flex items-center justify-center border"])}" data-v-383c5463><i class="${ssrRenderClass([getPaymentIconColor(), "ti ti-credit-card text-2xl"])}" data-v-383c5463></i></div> <div class="text-right" data-v-383c5463><div class="${ssrRenderClass([getPaymentTextColor(), "font-bold text-base mb-0.5"])}" data-v-383c5463>\u06A9\u0627\u0631\u062A \u0628\u0627\u0646\u06A9\u06CC</div> <div class="${ssrRenderClass([getPaymentSubTextColor(), "text-xs"])}" data-v-383c5463>\u067E\u0631\u062F\u0627\u062E\u062A \u0622\u0646\u0644\u0627\u06CC\u0646 \u0628\u0627 \u06A9\u0627\u0631\u062A</div></div></div> <div class="${ssrRenderClass([getPaymentCheckBg(), "w-6 h-6 rounded-full flex items-center justify-center"])}" data-v-383c5463><i class="ti ti-check text-white text-sm" data-v-383c5463></i></div></div></div> <div class="relative overflow-hidden rounded-xl bg-muted p-5 cursor-not-allowed opacity-50 border border-border" data-v-383c5463><div class="flex items-center justify-between" data-v-383c5463><div class="flex items-center gap-3" data-v-383c5463><div class="w-12 h-12 rounded-xl bg-card flex items-center justify-center border border-border" data-v-383c5463><i class="ti ti-wallet text-2xl text-muted-foreground" data-v-383c5463></i></div> <div class="text-right" data-v-383c5463><div class="font-medium text-muted-foreground text-base mb-0.5" data-v-383c5463>\u06A9\u06CC\u0641 \u067E\u0648\u0644 \u062F\u06CC\u062C\u06CC\u062A\u0627\u0644</div> <div class="text-xs text-muted-foreground" data-v-383c5463>\u0628\u0647 \u0632\u0648\u062F\u06CC \u062F\u0631 \u062F\u0633\u062A\u0631\u0633</div></div></div> <div class="w-6 h-6 rounded-full border-2 border-muted-foreground/30" data-v-383c5463></div></div></div></div></div> <div class="bg-card rounded-xl p-4 shadow-sm border border-border" data-v-383c5463><div class="flex items-start" data-v-383c5463><input type="checkbox" id="terms" class="mt-1 ml-3" checked data-v-383c5463> <label for="terms" class="text-sm text-foreground cursor-pointer" data-v-383c5463>
            \u0628\u0627 <span class="text-primary underline font-medium" data-v-383c5463>\u0642\u0648\u0627\u0646\u06CC\u0646 \u0648 \u0645\u0642\u0631\u0631\u0627\u062A</span> \u0648 
            <span class="text-primary underline font-medium" data-v-383c5463>\u0634\u0631\u0627\u06CC\u0637 \u0627\u0633\u062A\u0641\u0627\u062F\u0647</span> \u0645\u0648\u0627\u0641\u0642\u0645. 
            <span class="text-muted-foreground" data-v-383c5463>\u0627\u06CC\u0646 \u0627\u0634\u062A\u0631\u0627\u06A9 \u0628\u0647 \u0635\u0648\u0631\u062A \u062E\u0648\u062F\u06A9\u0627\u0631 \u062A\u0645\u062F\u06CC\u062F \u0646\u0645\u06CC\u200C\u0634\u0648\u062F.</span></label></div></div> <div class="bg-card rounded-xl p-4 shadow-sm border border-border" data-v-383c5463><button class="w-full flex items-center justify-between text-right hover:bg-muted/50 p-2 rounded-lg transition-colors" data-v-383c5463><div class="flex items-center gap-3" data-v-383c5463><div class="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center" data-v-383c5463><i class="ti ti-discount-2 text-primary text-xl" data-v-383c5463></i></div> <div data-v-383c5463><div class="text-sm font-medium text-foreground" data-v-383c5463>\u06A9\u062F \u062A\u062E\u0641\u06CC\u0641 \u062F\u0627\u0631\u06CC\u062F\u061F</div> <div class="text-xs text-muted-foreground" data-v-383c5463>\u0628\u0631\u0627\u06CC \u0627\u0639\u0645\u0627\u0644 \u06A9\u062F \u062A\u062E\u0641\u06CC\u0641 \u06A9\u0644\u06CC\u06A9 \u06A9\u0646\u06CC\u062F</div></div></div> <i class="ti ti-chevron-left text-muted-foreground" data-v-383c5463></i></button></div> <div class="bg-green-500/10 border border-green-500/20 rounded-lg p-4" data-v-383c5463><div class="flex items-start" data-v-383c5463><i class="ti ti-shield-check text-green-600 dark:text-green-400 text-xl ml-3 mt-0.5" data-v-383c5463></i> <div class="text-sm" data-v-383c5463><div class="text-green-600 dark:text-green-400 font-medium mb-1" data-v-383c5463>\u067E\u0631\u062F\u0627\u062E\u062A \u0627\u0645\u0646</div> <div class="text-muted-foreground" data-v-383c5463>
              \u062A\u0645\u0627\u0645\u06CC \u0627\u0637\u0644\u0627\u0639\u0627\u062A \u0634\u0645\u0627 \u0628\u0627 \u0631\u0645\u0632\u06AF\u0630\u0627\u0631\u06CC SSL \u0645\u062D\u0627\u0641\u0638\u062A \u0645\u06CC\u200C\u0634\u0648\u062F. 
              \u0647\u06CC\u0686 \u0627\u0637\u0644\u0627\u0639\u0627\u062A \u06A9\u0627\u0631\u062A\u06CC \u062F\u0631 \u0633\u0631\u0648\u0631\u0647\u0627\u06CC \u0645\u0627 \u0630\u062E\u06CC\u0631\u0647 \u0646\u0645\u06CC\u200C\u0634\u0648\u062F.
            </div></div></div></div> `);
        if (unref(isNonIranIP)) {
          _push(`<div class="bg-orange-500/10 border border-orange-500/20 rounded-lg p-4" data-v-383c5463><div class="flex items-start" data-v-383c5463><i class="ti ti-alert-triangle text-orange-600 dark:text-orange-400 text-xl ml-3 mt-0.5" data-v-383c5463></i> <div class="text-sm" data-v-383c5463><div class="text-orange-600 dark:text-orange-400 font-medium mb-1" data-v-383c5463>\u062A\u0648\u062C\u0647 \u0645\u0647\u0645</div> <div class="text-muted-foreground" data-v-383c5463>
              \u062F\u0631 \u0635\u0648\u0631\u062A \u0631\u0648\u0634\u0646 \u0628\u0648\u062F\u0646 \u0641\u06CC\u0644\u062A\u0631\u0634\u06A9\u0646\u060C \u0622\u0646 \u0631\u0627 \u062E\u0627\u0645\u0648\u0634 \u06A9\u0646\u06CC\u062F \u062A\u0627 \u067E\u0631\u062F\u0627\u062E\u062A \u0628\u0627 \u0645\u0648\u0641\u0642\u06CC\u062A \u0627\u0646\u062C\u0627\u0645 \u0634\u0648\u062F.
            </div></div></div></div>`);
        } else {
          _push(`<!---->`);
        }
        _push(` <button class="hidden lg:flex w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold py-4 px-6 rounded-xl shadow-lg hover:from-green-600 hover:to-emerald-700 transition-all duration-200 items-center justify-center" data-v-383c5463><i class="ti ti-lock text-xl ml-2" data-v-383c5463></i>
              \u067E\u0631\u062F\u0627\u062E\u062A \u0627\u0645\u0646 ${ssrInterpolate(unref(selectedPlan).totalPrice)}</button></div></div></div> <div class="lg:hidden space-y-4" data-v-383c5463><div class="relative" data-v-383c5463><div class="bg-card rounded-3xl shadow-2xl border border-border overflow-hidden" data-v-383c5463><div class="relative bg-gradient-to-br from-primary/5 via-primary/10 to-accent/5 p-6 border-b border-border" data-v-383c5463><div class="flex items-center justify-between" data-v-383c5463><div class="flex items-center gap-4" data-v-383c5463><div class="relative" data-v-383c5463><div class="${ssrRenderClass([getPlanIconGradient(), "w-16 h-16 rounded-2xl bg-gradient-to-br"])}" data-v-383c5463><div class="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/20 to-transparent" data-v-383c5463></div> <div class="relative h-full flex items-center justify-center" data-v-383c5463><i class="${ssrRenderClass([unref(selectedPlan).icon, "text-3xl", getPlanIconColorClass()])}" data-v-383c5463></i></div></div> `);
        if (unref(selectedPlan).hasDiscount) {
          _push(`<div class="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-gradient-to-br from-red-500 to-pink-600 flex items-center justify-center text-white text-xs font-bold shadow-lg" data-v-383c5463>${ssrInterpolate(unref(selectedPlan).discount)}</div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div> <div data-v-383c5463><h2 class="text-2xl font-bold text-foreground mb-1" data-v-383c5463>${ssrInterpolate(unref(selectedPlan).title)}</h2> <p class="text-sm text-muted-foreground flex items-center gap-1" data-v-383c5463><i class="ti ti-calendar-month text-base" data-v-383c5463></i> <span data-v-383c5463>${ssrInterpolate(unref(selectedPlan).duration)}</span></p></div></div> <div class="text-left" data-v-383c5463><div class="text-xs text-muted-foreground mb-1" data-v-383c5463>\u0627\u0634\u062A\u0631\u0627\u06A9</div> <div class="${ssrRenderClass([getPremiumBadgeGradient(), "px-3 py-1 rounded-lg bg-gradient-to-r text-white text-xs font-bold"])}" data-v-383c5463>
                    \u067E\u0631\u0645\u06CC\u0648\u0645
                  </div></div></div></div> <div class="p-6 bg-gradient-to-br from-muted/20 to-transparent" data-v-383c5463><div class="${ssrRenderClass([[getPriceCardGradient(), getPriceCardBorder()], "bg-gradient-to-br rounded-2xl p-6 border-2 relative overflow-hidden"])}" data-v-383c5463><div class="${ssrRenderClass([getPriceCardDecoLight(), "absolute top-0 right-0 w-32 h-32 bg-gradient-to-br to-transparent rounded-bl-full"])}" data-v-383c5463></div> <div class="${ssrRenderClass([getPriceCardDecoDark(), "absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr to-transparent rounded-tr-full"])}" data-v-383c5463></div> <div class="relative z-10" data-v-383c5463><div class="flex items-center justify-center gap-2 mb-4" data-v-383c5463><div class="${ssrRenderClass([getPriceIconBg(), "w-8 h-8 rounded-lg flex items-center justify-center"])}" data-v-383c5463><i class="${ssrRenderClass([getPriceIconColor(), "ti ti-currency-dollar text-lg"])}" data-v-383c5463></i></div> <span class="${ssrRenderClass([getPriceTextColor(), "text-sm font-medium"])}" data-v-383c5463>\u0642\u06CC\u0645\u062A \u0627\u0634\u062A\u0631\u0627\u06A9</span></div> `);
        if (unref(selectedPlan).hasDiscount) {
          _push(`<div class="text-center mb-3" data-v-383c5463><div class="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-red-100 dark:bg-red-900/30" data-v-383c5463><span class="text-sm text-muted-foreground line-through" data-v-383c5463>${ssrInterpolate(unref(selectedPlan).originalPrice)}</span> <span class="text-xs font-bold text-red-600 dark:text-red-400" data-v-383c5463>${ssrInterpolate(unref(selectedPlan).discount)} \u062A\u062E\u0641\u06CC\u0641</span></div></div>`);
        } else {
          _push(`<!---->`);
        }
        _push(` <div class="text-center mb-4" data-v-383c5463><div class="${ssrRenderClass([getPriceBigTextColor(), "text-4xl font-black mb-1"])}" data-v-383c5463>${ssrInterpolate(unref(selectedPlan).totalPrice)}</div> <div class="${ssrRenderClass([getPriceSmallTextColor(), "text-xs"])}" data-v-383c5463>
                      \u0628\u0631\u0627\u06CC ${ssrInterpolate(unref(selectedPlan).duration)}</div></div> <div class="relative py-3" data-v-383c5463><div class="absolute inset-0 flex items-center" data-v-383c5463><div class="${ssrRenderClass([getPriceBorderColor(), "w-full border-t"])}" data-v-383c5463></div></div> <div class="relative flex justify-center" data-v-383c5463><span class="${ssrRenderClass([[getBadgeGradient(), getPriceSmallTextColor()], "px-3 bg-gradient-to-br text-xs"])}" data-v-383c5463>\u0645\u0639\u0627\u062F\u0644</span></div></div> <div class="text-center" data-v-383c5463><div class="${ssrRenderClass([getMonthlyBadgeBg(), "inline-flex items-center gap-2 px-4 py-2 rounded-xl"])}" data-v-383c5463><i class="${ssrRenderClass([getPriceIconColor(), "ti ti-calendar-month"])}" data-v-383c5463></i> <span class="${ssrRenderClass([getPriceBigTextColor(), "text-lg font-bold"])}" data-v-383c5463>${ssrInterpolate(unref(selectedPlan).monthlyPrice)}</span> <span class="${ssrRenderClass([getPriceSmallTextColor(), "text-xs"])}" data-v-383c5463>\u062F\u0631 \u0645\u0627\u0647</span></div></div> `);
        if (unref(selectedPlan).hasDiscount) {
          _push(`<div class="mt-4 text-center" data-v-383c5463><div class="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-red-500 to-pink-600 text-white" data-v-383c5463><i class="ti ti-discount-check text-sm" data-v-383c5463></i> <span class="text-xs font-medium" data-v-383c5463>\u0634\u0645\u0627 ${ssrInterpolate(unref(selectedPlan).discountAmount)} \u0635\u0631\u0641\u0647\u200C\u062C\u0648\u06CC\u06CC \u0645\u06CC\u200C\u06A9\u0646\u06CC\u062F</span></div></div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div></div></div> <div class="p-6 bg-gradient-to-br from-primary/3 to-transparent border-t border-border" data-v-383c5463><div class="flex items-center justify-center gap-6 flex-wrap" data-v-383c5463><div class="flex items-center gap-2 text-sm" data-v-383c5463><div class="w-8 h-8 rounded-lg bg-green-500/10 flex items-center justify-center" data-v-383c5463><i class="ti ti-check text-green-600 dark:text-green-400" data-v-383c5463></i></div> <span class="text-muted-foreground" data-v-383c5463>\u062F\u0633\u062A\u0631\u0633\u06CC \u06A9\u0627\u0645\u0644</span></div> <div class="flex items-center gap-2 text-sm" data-v-383c5463><div class="w-8 h-8 rounded-lg bg-purple-500/10 flex items-center justify-center" data-v-383c5463><i class="ti ti-sparkles text-purple-600 dark:text-purple-400" data-v-383c5463></i></div> <span class="text-muted-foreground" data-v-383c5463>\u0627\u0645\u06A9\u0627\u0646\u0627\u062A \u0648\u06CC\u0698\u0647</span></div> <div class="flex items-center gap-2 text-sm" data-v-383c5463><div class="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center" data-v-383c5463><i class="ti ti-headset text-blue-600 dark:text-blue-400" data-v-383c5463></i></div> <span class="text-muted-foreground" data-v-383c5463>\u067E\u0634\u062A\u06CC\u0628\u0627\u0646\u06CC \u0648\u06CC\u0698\u0647</span></div></div></div></div></div> <div class="bg-card rounded-xl p-6 shadow-sm border border-border" data-v-383c5463><h3 class="text-lg font-semibold text-foreground mb-4 flex items-center" data-v-383c5463><i class="ti ti-receipt text-xl ml-2 text-primary" data-v-383c5463></i>
            \u062E\u0644\u0627\u0635\u0647 \u0633\u0641\u0627\u0631\u0634
          </h3> <div class="space-y-3" data-v-383c5463><div class="flex justify-between items-center py-2 border-b border-border" data-v-383c5463><span class="text-muted-foreground" data-v-383c5463>\u0646\u0648\u0639 \u0627\u0634\u062A\u0631\u0627\u06A9:</span> <span class="text-foreground font-medium" data-v-383c5463>${ssrInterpolate(unref(selectedPlan).title)} \u067E\u0631\u0645\u06CC\u0648\u0645</span></div> <div class="flex justify-between items-center py-2 border-b border-border" data-v-383c5463><span class="text-muted-foreground" data-v-383c5463>\u0645\u062F\u062A \u0627\u0634\u062A\u0631\u0627\u06A9:</span> <span class="text-foreground font-medium" data-v-383c5463>${ssrInterpolate(unref(selectedPlan).duration)}</span></div> `);
        if (unref(selectedPlan).hasDiscount) {
          _push(`<div class="flex justify-between items-center py-2 border-b border-border" data-v-383c5463><span class="text-muted-foreground" data-v-383c5463>\u0642\u06CC\u0645\u062A \u0627\u0635\u0644\u06CC:</span> <span class="text-muted-foreground line-through" data-v-383c5463>${ssrInterpolate(unref(selectedPlan).originalPrice)}</span></div>`);
        } else {
          _push(`<!---->`);
        }
        _push(` `);
        if (unref(selectedPlan).hasDiscount) {
          _push(`<div class="flex justify-between items-center py-2 border-b border-border" data-v-383c5463><span class="text-green-600 dark:text-green-400" data-v-383c5463>\u062A\u062E\u0641\u06CC\u0641 (${ssrInterpolate(unref(selectedPlan).discount)}):</span> <span class="text-green-600 dark:text-green-400 font-medium" data-v-383c5463>-${ssrInterpolate(unref(selectedPlan).discountAmount)}</span></div>`);
        } else {
          _push(`<!---->`);
        }
        _push(` <div class="flex justify-between items-center py-3 rounded-lg px-3 bg-primary/10" data-v-383c5463><span class="text-lg font-bold text-foreground" data-v-383c5463>\u0645\u0628\u0644\u063A \u0646\u0647\u0627\u06CC\u06CC:</span> <span class="text-2xl font-bold text-primary" data-v-383c5463>${ssrInterpolate(unref(selectedPlan).totalPrice)}</span></div></div></div> <div class="bg-card rounded-xl p-6 shadow-sm border border-border" data-v-383c5463><h3 class="text-lg font-semibold text-foreground mb-4 flex items-center" data-v-383c5463><i class="ti ti-credit-card text-xl ml-2 text-primary" data-v-383c5463></i>
            \u0631\u0648\u0634 \u067E\u0631\u062F\u0627\u062E\u062A
          </h3> <div class="space-y-3" data-v-383c5463><div class="${ssrRenderClass([[getPaymentCardGradient(), getPaymentCardBorder()], "relative overflow-hidden rounded-2xl p-5 cursor-pointer hover:shadow-xl transition-all duration-200 border-2"])}" data-v-383c5463><div class="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent dark:from-white/5" data-v-383c5463></div> <div class="relative flex items-center justify-between" data-v-383c5463><div class="flex items-center gap-3" data-v-383c5463><div class="${ssrRenderClass([getPaymentIconBg(), "w-12 h-12 rounded-xl flex items-center justify-center border"])}" data-v-383c5463><i class="${ssrRenderClass([getPaymentIconColor(), "ti ti-credit-card text-2xl"])}" data-v-383c5463></i></div> <div class="text-right" data-v-383c5463><div class="${ssrRenderClass([getPaymentTextColor(), "font-bold text-base mb-0.5"])}" data-v-383c5463>\u06A9\u0627\u0631\u062A \u0628\u0627\u0646\u06A9\u06CC</div> <div class="${ssrRenderClass([getPaymentSubTextColor(), "text-xs"])}" data-v-383c5463>\u067E\u0631\u062F\u0627\u062E\u062A \u0622\u0646\u0644\u0627\u06CC\u0646 \u0628\u0627 \u06A9\u0627\u0631\u062A</div></div></div> <div class="${ssrRenderClass([getPaymentCheckBg(), "w-6 h-6 rounded-full flex items-center justify-center"])}" data-v-383c5463><i class="ti ti-check text-white text-sm" data-v-383c5463></i></div></div></div> <div class="relative overflow-hidden rounded-xl bg-muted p-5 cursor-not-allowed opacity-50 border border-border" data-v-383c5463><div class="flex items-center justify-between" data-v-383c5463><div class="flex items-center gap-3" data-v-383c5463><div class="w-12 h-12 rounded-xl bg-card flex items-center justify-center border border-border" data-v-383c5463><i class="ti ti-wallet text-2xl text-muted-foreground" data-v-383c5463></i></div> <div class="text-right" data-v-383c5463><div class="font-medium text-muted-foreground text-base mb-0.5" data-v-383c5463>\u06A9\u06CC\u0641 \u067E\u0648\u0644 \u062F\u06CC\u062C\u06CC\u062A\u0627\u0644</div> <div class="text-xs text-muted-foreground" data-v-383c5463>\u0628\u0647 \u0632\u0648\u062F\u06CC \u062F\u0631 \u062F\u0633\u062A\u0631\u0633</div></div></div> <div class="w-6 h-6 rounded-full border-2 border-muted-foreground/30" data-v-383c5463></div></div></div></div></div> <div class="bg-card rounded-xl p-4 shadow-sm border border-border" data-v-383c5463><div class="flex items-start" data-v-383c5463><input type="checkbox" id="terms" class="mt-1 ml-3" checked data-v-383c5463> <label for="terms" class="text-sm text-foreground cursor-pointer" data-v-383c5463>
              \u0628\u0627 <span class="text-primary underline font-medium" data-v-383c5463>\u0642\u0648\u0627\u0646\u06CC\u0646 \u0648 \u0645\u0642\u0631\u0631\u0627\u062A</span> \u0648 
              <span class="text-primary underline font-medium" data-v-383c5463>\u0634\u0631\u0627\u06CC\u0637 \u0627\u0633\u062A\u0641\u0627\u062F\u0647</span> \u0645\u0648\u0627\u0641\u0642\u0645. 
              <span class="text-muted-foreground" data-v-383c5463>\u0627\u06CC\u0646 \u0627\u0634\u062A\u0631\u0627\u06A9 \u0628\u0647 \u0635\u0648\u0631\u062A \u062E\u0648\u062F\u06A9\u0627\u0631 \u062A\u0645\u062F\u06CC\u062F \u0646\u0645\u06CC\u200C\u0634\u0648\u062F.</span></label></div></div> <div class="bg-green-500/10 border border-green-500/20 rounded-lg p-4" data-v-383c5463><div class="flex items-start" data-v-383c5463><i class="ti ti-shield-check text-green-600 dark:text-green-400 text-xl ml-3 mt-0.5" data-v-383c5463></i> <div class="text-sm" data-v-383c5463><div class="text-green-600 dark:text-green-400 font-medium mb-1" data-v-383c5463>\u067E\u0631\u062F\u0627\u062E\u062A \u0627\u0645\u0646</div> <div class="text-muted-foreground" data-v-383c5463>
                \u062A\u0645\u0627\u0645\u06CC \u0627\u0637\u0644\u0627\u0639\u0627\u062A \u0634\u0645\u0627 \u0628\u0627 \u0631\u0645\u0632\u06AF\u0630\u0627\u0631\u06CC SSL \u0645\u062D\u0627\u0641\u0638\u062A \u0645\u06CC\u200C\u0634\u0648\u062F. 
                \u0647\u06CC\u0686 \u0627\u0637\u0644\u0627\u0639\u0627\u062A \u06A9\u0627\u0631\u062A\u06CC \u062F\u0631 \u0633\u0631\u0648\u0631\u0647\u0627\u06CC \u0645\u0627 \u0630\u062E\u06CC\u0631\u0647 \u0646\u0645\u06CC\u200C\u0634\u0648\u062F.
              </div></div></div></div> `);
        if (unref(isNonIranIP)) {
          _push(`<div class="bg-orange-500/10 border border-orange-500/20 rounded-lg p-4" data-v-383c5463><div class="flex items-start" data-v-383c5463><i class="ti ti-alert-triangle text-orange-600 dark:text-orange-400 text-xl ml-3 mt-0.5" data-v-383c5463></i> <div class="text-sm" data-v-383c5463><div class="text-orange-600 dark:text-orange-400 font-medium mb-1" data-v-383c5463>\u062A\u0648\u062C\u0647 \u0645\u0647\u0645</div> <div class="text-muted-foreground" data-v-383c5463>
                \u062F\u0631 \u0635\u0648\u0631\u062A \u0631\u0648\u0634\u0646 \u0628\u0648\u062F\u0646 \u0641\u06CC\u0644\u062A\u0631\u0634\u06A9\u0646\u060C \u0622\u0646 \u0631\u0627 \u062E\u0627\u0645\u0648\u0634 \u06A9\u0646\u06CC\u062F \u062A\u0627 \u067E\u0631\u062F\u0627\u062E\u062A \u0628\u0627 \u0645\u0648\u0641\u0642\u06CC\u062A \u0627\u0646\u062C\u0627\u0645 \u0634\u0648\u062F.
              </div></div></div></div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div><!--]-->`);
      }
      _push(`</div> `);
      if (unref(selectedPlan)) {
        _push(`<div class="lg:hidden fixed bottom-0 left-0 right-0 p-4 z-40 bg-card border-t border-border shadow-lg" data-v-383c5463><button class="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold py-4 px-6 rounded-xl shadow-lg hover:from-green-600 hover:to-emerald-700 transition-all duration-200 flex items-center justify-center" data-v-383c5463><i class="ti ti-lock text-xl ml-2" data-v-383c5463></i>
        \u067E\u0631\u062F\u0627\u062E\u062A \u0627\u0645\u0646 ${ssrInterpolate(unref(selectedPlan).totalPrice)}</button></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(` `);
      ssrRenderTeleport(_push, (_push2) => {
        if (unref(showDiscountSheet)) {
          _push2(`<div class="fixed inset-0 bg-black/50 z-[100] flex items-end lg:items-center lg:justify-center" data-v-383c5463><div class="bg-card w-full lg:max-w-md lg:rounded-2xl rounded-t-3xl p-6 transform transition-transform" data-v-383c5463><div class="flex items-center justify-between mb-6" data-v-383c5463><h3 class="text-xl font-bold text-foreground" data-v-383c5463>\u06A9\u062F \u062A\u062E\u0641\u06CC\u0641</h3> <button class="w-8 h-8 rounded-full bg-muted hover:bg-muted/80 flex items-center justify-center transition-colors" data-v-383c5463><i class="ti ti-x text-foreground" data-v-383c5463></i></button></div> <div class="space-y-4" data-v-383c5463><div data-v-383c5463><label class="text-sm text-muted-foreground mb-2 block" data-v-383c5463>\u06A9\u062F \u062A\u062E\u0641\u06CC\u0641 \u062E\u0648\u062F \u0631\u0627 \u0648\u0627\u0631\u062F \u06A9\u0646\u06CC\u062F</label> <div class="relative" data-v-383c5463><input${ssrRenderAttr("value", unref(discountCode))} type="text" placeholder="\u0645\u062B\u0627\u0644: SUMMER2025" class="w-full bg-muted border border-border rounded-xl px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all" data-v-383c5463> `);
          if (unref(discountCode)) {
            _push2(`<div class="absolute left-3 top-1/2 -translate-y-1/2" data-v-383c5463><button class="text-muted-foreground hover:text-foreground transition-colors" data-v-383c5463><i class="ti ti-x" data-v-383c5463></i></button></div>`);
          } else {
            _push2(`<!---->`);
          }
          _push2(`</div></div> `);
          if (unref(discountStatus)) {
            _push2(`<div class="${ssrRenderClass([[
              unref(discountStatus).type === "success" ? "bg-green-500/10 border border-green-500/20" : "bg-red-500/10 border border-red-500/20"
            ], "p-3 rounded-lg flex items-start gap-2"])}" data-v-383c5463><i class="${ssrRenderClass([[
              unref(discountStatus).type === "success" ? "ti-circle-check text-green-600 dark:text-green-400" : "ti-alert-circle text-red-600 dark:text-red-400"
            ], "ti text-lg"])}" data-v-383c5463></i> <div class="flex-1" data-v-383c5463><div class="${ssrRenderClass([[
              unref(discountStatus).type === "success" ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"
            ], "text-sm font-medium"])}" data-v-383c5463>${ssrInterpolate(unref(discountStatus).message)}</div> `);
            if (unref(discountStatus).type === "success" && unref(discountStatus).amount) {
              _push2(`<div class="text-xs text-muted-foreground mt-1" data-v-383c5463>${ssrInterpolate(unref(discountStatus).amount)} \u062A\u062E\u0641\u06CC\u0641 \u0627\u0639\u0645\u0627\u0644 \u0645\u06CC\u200C\u0634\u0648\u062F
                  </div>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</div></div>`);
          } else {
            _push2(`<!---->`);
          }
          _push2(` <div class="flex gap-3" data-v-383c5463><button${ssrIncludeBooleanAttr(!unref(discountCode) || unref(isCheckingDiscount)) ? " disabled" : ""} class="flex-1 bg-primary text-primary-foreground font-semibold py-3 px-6 rounded-xl hover:opacity-90 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2" data-v-383c5463>`);
          if (unref(isCheckingDiscount)) {
            _push2(`<i class="ti ti-loader-2 animate-spin" data-v-383c5463></i>`);
          } else {
            _push2(`<!---->`);
          }
          _push2(` <span data-v-383c5463>${ssrInterpolate(unref(isCheckingDiscount) ? "\u062F\u0631 \u062D\u0627\u0644 \u0628\u0631\u0631\u0633\u06CC..." : "\u0627\u0639\u0645\u0627\u0644 \u06A9\u062F \u062A\u062E\u0641\u06CC\u0641")}</span></button> <button class="px-6 py-3 rounded-xl text-muted-foreground hover:bg-muted transition-colors" data-v-383c5463>
                  \u0627\u0646\u0635\u0631\u0627\u0641
                </button></div> <div class="pt-4 border-t border-border" data-v-383c5463><div class="text-xs text-muted-foreground mb-3" data-v-383c5463>\u06A9\u062F\u0647\u0627\u06CC \u062A\u062E\u0641\u06CC\u0641 \u0645\u062D\u0628\u0648\u0628</div> <div class="space-y-2" data-v-383c5463><!--[-->`);
          ssrRenderList(unref(popularDiscounts), (code) => {
            _push2(`<button class="w-full flex items-center justify-between p-3 rounded-lg bg-muted hover:bg-muted/80 transition-colors text-right" data-v-383c5463><div class="flex items-center gap-3" data-v-383c5463><div class="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center" data-v-383c5463><i class="ti ti-tag text-primary" data-v-383c5463></i></div> <div data-v-383c5463><div class="text-sm font-medium text-foreground" data-v-383c5463>${ssrInterpolate(code.code)}</div> <div class="text-xs text-muted-foreground" data-v-383c5463>${ssrInterpolate(code.description)}</div></div></div> <div class="text-sm font-bold text-primary" data-v-383c5463>${ssrInterpolate(code.discount)}</div></button>`);
          });
          _push2(`<!--]--></div></div></div></div></div>`);
        } else {
          _push2(`<!---->`);
        }
      }, "body", false, _parent);
      _push(`</div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/dashboard/checkout/order.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const order = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-383c5463"]]);

export { order as default };
//# sourceMappingURL=order-CC0mpBE3.mjs.map
