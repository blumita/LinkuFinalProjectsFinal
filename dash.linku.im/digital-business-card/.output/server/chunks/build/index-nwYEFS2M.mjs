import { e as __nuxt_component_0$2 } from './server.mjs';
import { defineComponent, ref, computed, mergeProps, unref, withCtx, createVNode, createTextVNode, toDisplayString, createBlock, createCommentVNode, openBlock, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrInterpolate, ssrRenderAttr, ssrRenderClass, ssrRenderList, ssrRenderComponent } from 'vue/server-renderer';
import { p as publicAssetsURL } from '../routes/renderer.mjs';
import { useRouter } from 'vue-router';
import { u as useUserStore } from './user-D1YL8aKq.mjs';
import { u as usePlanStore } from './plan-BwkVH_kK.mjs';
import '../_/nitro.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import 'node:url';
import 'pinia';
import 'axios';
import 'vue-bundle-renderer/runtime';
import 'unhead/server';
import 'unhead/plugins';
import 'unhead/utils';
import './form-CUJQskNk.mjs';

const _imports_0 = publicAssetsURL("/assets/images/clock.png");
const _imports_1 = publicAssetsURL("/assets/images/avatars/avatar-1.png");
const _imports_2 = publicAssetsURL("/assets/images/avatars/avatar-2.png");
const _imports_3 = publicAssetsURL("/assets/images/avatars/avatar-3.png");
const _imports_4 = publicAssetsURL("/assets/images/avatars/avatar-4.png");
const _imports_5 = publicAssetsURL("/assets/images/avatars/avatar-5.png");
const _imports_6 = publicAssetsURL("/assets/images/avatars/avatar-6.png");
const _imports_7 = publicAssetsURL("/assets/images/avatars/avatar-7.png");
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "index",
  __ssrInlineRender: true,
  setup(__props) {
    useRouter();
    const userStore = useUserStore();
    const planStore = usePlanStore();
    ref(false);
    const features = ref([]);
    const transactions = ref([]);
    const currentSubscription = computed(() => {
      var _a, _b, _c, _d, _e;
      if (!userStore.user) {
        return {
          type: "\u0627\u0634\u062A\u0631\u0627\u06A9 \u0645\u0627\u0647\u0627\u0646\u0647",
          status: "expired",
          remainingDays: 0,
          expiryDate: "\u2014"
        };
      }
      const isPro = ((_a = userStore.user) == null ? void 0 : _a.isPro) || false;
      let daysRemaining = ((_b = userStore.user) == null ? void 0 : _b.daysRemaining) || ((_c = userStore.user) == null ? void 0 : _c.days_remaining) || 0;
      let endDate = ((_d = userStore.user) == null ? void 0 : _d.subscriptionEndDate) || ((_e = userStore.user) == null ? void 0 : _e.subscription_end_date);
      if (isPro && !daysRemaining && transactions.value.length > 0) {
        const successTransaction = transactions.value.filter((t) => t.status === "success" || t.status === "successful").sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())[0];
        if (successTransaction == null ? void 0 : successTransaction.endDate) {
          endDate = successTransaction.endDate;
          const end = new Date(successTransaction.endDate);
          const now = /* @__PURE__ */ new Date();
          daysRemaining = Math.ceil((end.getTime() - now.getTime()) / (1e3 * 60 * 60 * 24));
        }
      }
      return {
        type: "\u0627\u0634\u062A\u0631\u0627\u06A9 \u0645\u0627\u0647\u0627\u0646\u0647",
        status: isPro ? "active" : "expired",
        remainingDays: Math.max(0, Math.round(daysRemaining)),
        expiryDate: endDate ? new Date(endDate).toLocaleDateString("fa-IR") : "\u2014"
      };
    });
    computed(() => {
      return transactions.value.filter((t) => t.status === "success" || t.status === "successful" || t.status === "pending").map((t) => ({
        id: t.id,
        action: t.planTitle || "\u062E\u0631\u06CC\u062F \u0627\u0634\u062A\u0631\u0627\u06A9",
        description: `\u0627\u0634\u062A\u0631\u0627\u06A9 ${t.planTitle || ""} - ${t.planDuration || ""}`,
        amount: t.amount || 0,
        status: t.status === "success" || t.status === "successful" ? "completed" : t.status,
        date: t.createdAt ? formatPersianDate(t.createdAt) : "\u2014"
      })).sort((a, b) => b.id - a.id);
    });
    const formatPersianDate = (dateString) => {
      if (!dateString) return "\u2014";
      try {
        const date = new Date(dateString);
        return date.toLocaleDateString("fa-IR");
      } catch {
        return dateString;
      }
    };
    const getStatusText = (status) => {
      const statusTexts = {
        "active": "\u0641\u0639\u0627\u0644",
        "expired": "\u0645\u0646\u0642\u0636\u06CC \u0634\u062F\u0647",
        "cancelled": "\u0644\u063A\u0648 \u0634\u062F\u0647",
        "pending": "\u062F\u0631 \u0627\u0646\u062A\u0638\u0627\u0631",
        "completed": "\u062A\u06A9\u0645\u06CC\u0644 \u0634\u062F\u0647",
        "failed": "\u0646\u0627\u0645\u0648\u0641\u0642"
      };
      return statusTexts[status] || status;
    };
    const getPlanGradient = (index) => {
      const gradients = [
        "from-yellow-300 via-amber-400 to-yellow-600",
        "from-gray-500 via-gray-600 to-gray-700",
        "from-gray-600 via-gray-700 to-gray-800",
        "from-gray-700 via-gray-800 to-gray-900"
      ];
      return gradients[index % gradients.length];
    };
    const getPlanTextColor = (index) => {
      return index === 0 ? "text-amber-900" : "text-white";
    };
    const getPlanBgColor = (index) => {
      const bgColors = [
        "bg-amber-800/30 border-amber-700/40 text-amber-900",
        "bg-gray-700/50 border-gray-600/50 text-white",
        "bg-gray-800/50 border-gray-700/50 text-white",
        "bg-gray-900/50 border-gray-800/50 text-white"
      ];
      return bgColors[index % bgColors.length];
    };
    const getPlanButtonClass = (index) => {
      const buttons = [
        "bg-white/90 hover:bg-white text-amber-700 shadow-lg",
        "bg-gray-300/90 hover:bg-gray-200 text-gray-800",
        "bg-gray-400/90 hover:bg-gray-300 text-gray-800",
        "bg-gray-500/90 hover:bg-gray-400 text-gray-200"
      ];
      return buttons[index % buttons.length];
    };
    const iconColors = [
      { bg: "bg-blue-500/10 dark:bg-blue-500/20", bgGradient: "bg-gradient-to-br from-blue-500/20 to-blue-500/5 dark:from-blue-500/30 dark:to-blue-500/10", color: "text-blue-500" },
      { bg: "bg-purple-500/10 dark:bg-purple-500/20", bgGradient: "bg-gradient-to-br from-purple-500/20 to-purple-500/5 dark:from-purple-500/30 dark:to-purple-500/10", color: "text-purple-500" },
      { bg: "bg-emerald-500/10 dark:bg-emerald-500/20", bgGradient: "bg-gradient-to-br from-emerald-500/20 to-emerald-500/5 dark:from-emerald-500/30 dark:to-emerald-500/10", color: "text-emerald-500" },
      { bg: "bg-pink-500/10 dark:bg-pink-500/20", bgGradient: "bg-gradient-to-br from-pink-500/20 to-pink-500/5 dark:from-pink-500/30 dark:to-pink-500/10", color: "text-pink-500" },
      { bg: "bg-amber-500/10 dark:bg-amber-500/20", bgGradient: "bg-gradient-to-br from-amber-500/20 to-amber-500/5 dark:from-amber-500/30 dark:to-amber-500/10", color: "text-amber-500" },
      { bg: "bg-cyan-500/10 dark:bg-cyan-500/20", bgGradient: "bg-gradient-to-br from-cyan-500/20 to-cyan-500/5 dark:from-cyan-500/30 dark:to-cyan-500/10", color: "text-cyan-500" },
      { bg: "bg-rose-500/10 dark:bg-rose-500/20", bgGradient: "bg-gradient-to-br from-rose-500/20 to-rose-500/5 dark:from-rose-500/30 dark:to-rose-500/10", color: "text-rose-500" },
      { bg: "bg-indigo-500/10 dark:bg-indigo-500/20", bgGradient: "bg-gradient-to-br from-indigo-500/20 to-indigo-500/5 dark:from-indigo-500/30 dark:to-indigo-500/10", color: "text-indigo-500" }
    ];
    const getIconBgClass = (index) => {
      return iconColors[index % iconColors.length].bg;
    };
    const getIconBgGradientClass = (index) => {
      return iconColors[index % iconColors.length].bgGradient;
    };
    const getIconColorClass = (index) => {
      return iconColors[index % iconColors.length].color;
    };
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0$2;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "min-h-screen bg-background" }, _attrs))}><div class="pb-24 pt-4"><div class="xl:container xl:mx-auto xl:px-8"><div class="xl:grid xl:grid-cols-12 xl:gap-8"><div class="hidden xl:block xl:col-span-4 space-y-4">`);
      if (currentSubscription.value.status !== "active") {
        _push(`<div class="sticky top-24"><div class="bg-gradient-to-br from-primary/10 via-primary/5 to-transparent border border-primary/20 rounded-2xl p-6 text-center"><i class="ti ti-crown text-6xl text-primary mb-4 block"></i> <h2 class="text-2xl font-bold mb-2 text-foreground">\u067E\u0631\u0645\u06CC\u0648\u0645 \u0644\u06CC\u0646\u06A9\u0648</h2> <p class="text-sm text-muted-foreground">\u062F\u0633\u062A\u0631\u0633\u06CC \u0628\u0647 \u062A\u0645\u0627\u0645 \u0627\u0645\u06A9\u0627\u0646\u0627\u062A \u0644\u06CC\u0646\u06A9\u0648</p></div></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(` `);
      if (currentSubscription.value.status === "active") {
        _push(`<div class="sticky top-24 space-y-4"><div class="bg-gradient-to-br from-muted/50 to-transparent rounded-2xl p-6 border border-border"><div class="text-center mb-4"><div class="text-5xl font-bold text-foreground mb-2">${ssrInterpolate(currentSubscription.value.remainingDays)}</div> <p class="text-sm text-muted-foreground">\u0631\u0648\u0632 \u0628\u0627\u0642\u06CC\u200C\u0645\u0627\u0646\u062F\u0647</p></div> <div class="flex items-center justify-center"><img${ssrRenderAttr("src", _imports_0)} alt="\u0633\u0627\u0639\u062A" class="w-24 h-24 opacity-50"></div></div> <div class="bg-gradient-to-br from-primary via-primary/90 to-primary/80 p-6 rounded-2xl text-white"><div class="flex items-center gap-3 mb-4"><div class="p-2 bg-white/20 rounded-xl"><i class="ti ti-crown text-2xl text-yellow-300"></i></div> <div><h3 class="text-lg font-bold">\u0627\u0634\u062A\u0631\u0627\u06A9 \u0641\u0639\u0644\u06CC \u0634\u0645\u0627</h3> <p class="text-sm opacity-80">${ssrInterpolate(currentSubscription.value.type)}</p></div></div> <div class="space-y-2 mb-4"><div class="flex items-center justify-between text-sm"><span class="opacity-80">\u062A\u0627\u0631\u06CC\u062E \u0627\u0646\u0642\u0636\u0627</span> <span class="font-medium">${ssrInterpolate(currentSubscription.value.expiryDate)}</span></div> <div class="flex items-center justify-between text-sm"><span class="opacity-80">\u0648\u0636\u0639\u06CC\u062A</span> <span class="px-2 py-1 rounded-full text-xs bg-green-500/20 text-green-100">\u0641\u0639\u0627\u0644</span></div></div> <button class="w-full bg-white/20 px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-white/30 transition-all border border-white/20"><i class="ti ti-history ml-2"></i>
                  \u0645\u0634\u0627\u0647\u062F\u0647 \u062A\u0627\u0631\u06CC\u062E\u0686\u0647 \u06A9\u0627\u0645\u0644
                </button></div></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div> <div class="xl:col-span-8 space-y-4">`);
      if (currentSubscription.value.status !== "active") {
        _push(`<div class="relative overflow-visible xl:hidden"><div class="relative z-20 text-center text-foreground"><div class="relative w-full h-40 mb-4 overflow-visible"><div class="absolute inset-0 bg-gradient-to-b from-background/70 via-background/80 to-background/90 z-10"></div> <div class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-24 h-24 rounded-full border-4 border-primary/30 dark:border-primary/50 overflow-visible"><img${ssrRenderAttr("src", _imports_1)} alt="\u067E\u0631\u0648\u0641\u0627\u06CC\u0644 \u0627\u0635\u0644\u06CC" class="w-full h-full object-cover rounded-full"> <div class="absolute -bottom-1 -right-1 w-8 h-8"><i class="ti ti-rosette-discount-check-filled text-blue-500 text-2xl"></i></div></div> <div class="absolute top-2 left-1/2 transform -translate-x-1/2 w-10 h-10 bg-yellow-400 dark:bg-yellow-500 rounded-full flex items-center justify-center border-2 border-background"><i class="ti ti-crown text-foreground text-xl"></i></div> <div class="absolute top-2 left-2 w-12 h-12 rounded-full border-3 border-background overflow-visible"><img${ssrRenderAttr("src", _imports_2)} alt="\u067E\u0631\u0648\u0641\u0627\u06CC\u0644" class="w-full h-full object-cover rounded-full"> <div class="absolute -bottom-1 -right-1 w-5 h-5"><i class="ti ti-rosette-discount-check-filled text-green-500 text-lg"></i></div></div> <div class="absolute top-1 right-2 w-14 h-14 rounded-full border-3 border-background overflow-visible"><img${ssrRenderAttr("src", _imports_3)} alt="\u067E\u0631\u0648\u0641\u0627\u06CC\u0644" class="w-full h-full object-cover rounded-full"> <div class="absolute -bottom-1 -left-1 w-6 h-6"><i class="ti ti-rosette-discount-check-filled text-red-500 text-xl"></i></div></div> <div class="absolute top-20 left-1 w-10 h-10 rounded-full border-3 border-background overflow-visible"><img${ssrRenderAttr("src", _imports_4)} alt="\u067E\u0631\u0648\u0641\u0627\u06CC\u0644" class="w-full h-full object-cover rounded-full"> <div class="absolute -top-1 -right-1 w-4 h-4"><i class="ti ti-rosette-discount-check-filled text-purple-500 text-sm"></i></div></div> <div class="absolute top-20 right-1 w-11 h-11 rounded-full border-3 border-background overflow-visible"><img${ssrRenderAttr("src", _imports_5)} alt="\u067E\u0631\u0648\u0641\u0627\u06CC\u0644" class="w-full h-full object-cover rounded-full"> <div class="absolute -bottom-1 -left-1 w-5 h-5"><i class="ti ti-rosette-discount-check-filled text-orange-500 text-lg"></i></div></div> <div class="absolute top-12 left-16 w-13 h-13 rounded-full border-3 border-background overflow-visible"><img${ssrRenderAttr("src", _imports_6)} alt="\u067E\u0631\u0648\u0641\u0627\u06CC\u0644" class="w-full h-full object-cover rounded-full"> <div class="absolute -top-1 -right-1 w-5 h-5"><i class="ti ti-rosette-discount-check-filled text-pink-500 text-lg"></i></div></div> <div class="absolute top-8 right-16 w-10 h-10 rounded-full border-3 border-background overflow-visible"><img${ssrRenderAttr("src", _imports_7)} alt="\u067E\u0631\u0648\u0641\u0627\u06CC\u0644" class="w-full h-full object-cover rounded-full"> <div class="absolute -top-1 -left-1 w-4 h-4"><i class="ti ti-rosette-discount-check-filled text-teal-500 text-sm"></i></div></div> <div class="absolute top-15 left-8 w-8 h-8 rounded-full border-2 border-background overflow-visible"><img${ssrRenderAttr("src", _imports_2)} alt="\u067E\u0631\u0648\u0641\u0627\u06CC\u0644" class="w-full h-full object-cover rounded-full"> <div class="absolute -bottom-1 -right-1 w-4 h-4"><i class="ti ti-rosette-discount-check-filled text-indigo-500 text-sm"></i></div></div> <div class="absolute top-18 right-8 w-8 h-8 rounded-full border-2 border-background overflow-visible"><img${ssrRenderAttr("src", _imports_4)} alt="\u067E\u0631\u0648\u0641\u0627\u06CC\u0644" class="w-full h-full object-cover rounded-full"> <div class="absolute -top-1 -left-1 w-4 h-4"><i class="ti ti-rosette-discount-check-filled text-yellow-500 text-sm"></i></div></div></div> <div class="absolute bottom-6 left-0 right-0 text-center z-30"><h2 class="text-2xl font-bold mb-2 text-foreground">\u067E\u0631\u0645\u06CC\u0648\u0645 \u0644\u06CC\u0646\u06A9\u0648</h2> <p class="mb-1 opacity-90 text-foreground">\u06A9\u0627\u0631\u0628\u0631 \u0648\u06CC\u0698\u0647 \u0644\u06CC\u0646\u06A9\u0648 \u0628\u0627\u0634\u06CC\u062F!</p> <p class="text-sm opacity-80 text-foreground">\u0628\u0627 \u0627\u0634\u062A\u0631\u0627\u06A9 \u062F\u0631 \u0644\u06CC\u0646\u06A9\u0648 \u067E\u0631\u0645\u06CC\u0648\u0645\u060C \u0686\u06CC\u0632\u0647\u0627\u06CC \u062C\u062F\u06CC\u062F \u0631\u0627 \u0628\u0627\u0632 \u06A9\u0646\u06CC\u062F.</p></div></div></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(` `);
      if (currentSubscription.value.status === "active") {
        _push(`<div class="bg-gradient-to-t from-muted/30 via-muted/20 to-transparent p-4 relative mt-8 rounded-2xl mx-4 xl:hidden"><div class="text-center rtl:mr-24 ltr:ml-24"><div class="text-6xl font-bold text-foreground leading-none mb-2"><span class="rtl:ml-2 ltr:mr-2">${ssrInterpolate(currentSubscription.value.remainingDays)}</span><span class="text-lg">\u0631\u0648\u0632 \u0628\u0627\u0642\u06CC\u200C\u0645\u0627\u0646\u062F\u0647</span></div></div> <div class="absolute right-0 -top-8"><img${ssrRenderAttr("src", _imports_0)} alt="\u0633\u0627\u0639\u062A" class="w-40 h-40"></div> <p class="text-sm text-muted-foreground mt-4 text-center rtl:mr-24 ltr:ml-24">\u0645\u06CC\u200C\u062A\u0648\u0627\u0646\u06CC\u062F \u0632\u0645\u0627\u0646 \u0627\u0634\u062A\u0631\u0627\u06A9 \u062E\u0648\u062F \u0631\u0627 \u0627\u0641\u0632\u0627\u06CC\u0634 \u062F\u0647\u06CC\u062F.</p></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(` `);
      if (currentSubscription.value.status === "active") {
        _push(`<div class="px-4 xl:hidden"><div class="relative bg-gradient-to-br from-primary via-primary/90 to-primary/80 p-6 rounded-2xl text-white mb-4 overflow-hidden"><div class="absolute inset-0 opacity-20"><div class="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full transform translate-x-8 -translate-y-8 animate-pulse"></div> <div class="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full transform -translate-x-4 translate-y-4 animate-pulse delay-300"></div> <div class="absolute top-1/2 left-1/3 w-16 h-16 bg-white/10 rounded-full animate-bounce delay-700"></div></div> <div class="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent rounded-2xl"></div> <div class="relative z-10"><div class="flex items-center justify-between mb-4"><h3 class="text-lg font-bold">\u0627\u0634\u062A\u0631\u0627\u06A9 \u0641\u0639\u0644\u06CC \u0634\u0645\u0627</h3> <div class="p-2 bg-white/20 rounded-xl"><i class="ti ti-crown text-2xl text-yellow-300"></i></div></div> <div class="grid grid-cols-2 gap-4"><div><p class="text-sm opacity-80 mb-1">\u0646\u0648\u0639 \u0627\u0634\u062A\u0631\u0627\u06A9</p> <p class="text-xl font-bold">${ssrInterpolate(currentSubscription.value.type)}</p></div> <div><p class="text-sm opacity-80 mb-1">\u062A\u0627\u0631\u06CC\u062E \u0627\u0646\u0642\u0636\u0627</p> <p class="text-base font-medium">${ssrInterpolate(currentSubscription.value.expiryDate)}</p></div></div> <div class="flex items-center justify-between mt-4 pt-4 border-t border-white/20"><div><p class="text-sm opacity-80">\u0648\u0636\u0639\u06CC\u062A</p> <span class="${ssrRenderClass([
          "px-3 py-1 rounded-full text-sm font-medium",
          currentSubscription.value.status === "active" ? "bg-green-500/20 text-green-100" : "bg-red-500/20 text-red-100"
        ])}">${ssrInterpolate(getStatusText(currentSubscription.value.status))}</span></div> <button class="bg-white/20 px-4 py-2 rounded-xl text-sm font-medium hover:bg-white/30 transition-all duration-300 border border-white/20 hover:border-white/30">
                  \u0645\u0634\u0627\u0647\u062F\u0647 \u062A\u0627\u0631\u06CC\u062E\u0686\u0647 \u06A9\u0627\u0645\u0644
                </button></div></div></div></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(` <div class="px-4 mb-4"><h4 class="text-lg font-bold text-foreground mb-3">${ssrInterpolate(currentSubscription.value.status === "active" ? "\u0627\u0631\u062A\u0642\u0627 \u0627\u0634\u062A\u0631\u0627\u06A9" : "\u067E\u0644\u0627\u0646\u200C\u0647\u0627\u06CC \u0627\u0634\u062A\u0631\u0627\u06A9")}</h4> <p class="text-sm text-muted-foreground mb-4">${ssrInterpolate(currentSubscription.value.status === "active" ? "\u0628\u0627 \u0627\u0631\u062A\u0642\u0627 \u0627\u0634\u062A\u0631\u0627\u06A9 \u062E\u0648\u062F\u060C \u0632\u0645\u0627\u0646 \u0628\u06CC\u0634\u062A\u0631\u06CC \u0627\u0636\u0627\u0641\u0647 \u06A9\u0646\u06CC\u062F \u0648 \u0627\u0632 \u062A\u062E\u0641\u06CC\u0641\u200C\u0647\u0627\u06CC \u0648\u06CC\u0698\u0647 \u0628\u0647\u0631\u0647\u200C\u0645\u0646\u062F \u0634\u0648\u06CC\u062F." : "\u06CC\u06A9\u06CC \u0627\u0632 \u067E\u0644\u0627\u0646\u200C\u0647\u0627\u06CC \u0632\u06CC\u0631 \u0631\u0627 \u0627\u0646\u062A\u062E\u0627\u0628 \u06A9\u0646\u06CC\u062F \u0648 \u0627\u0632 \u0627\u0645\u06A9\u0627\u0646\u0627\u062A \u0648\u06CC\u0698\u0647 \u0644\u06CC\u0646\u06A9\u0648 \u0628\u0647\u0631\u0647\u200C\u0645\u0646\u062F \u0634\u0648\u06CC\u062F.")}</p></div> <div class="px-4"><div class="grid grid-cols-2 xl:grid-cols-4 gap-3"><!--[-->`);
      ssrRenderList(unref(planStore).plans, (plan, index) => {
        _push(`<div class="${ssrRenderClass([[
          getPlanGradient(index),
          index === 0 ? "border-yellow-300/50" : "border-gray-400/30"
        ], "bg-gradient-to-br rounded-2xl p-4 text-center relative overflow-hidden shadow-xl border"])}"><div class="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-2xl"></div> <div class="relative z-10"><div class="${ssrRenderClass([getPlanTextColor(index), "font-bold text-lg mb-1"])}">${ssrInterpolate(plan.title)}</div> `);
        if (plan.discount > 0) {
          _push(`<div class="${ssrRenderClass([getPlanBgColor(index), "rounded-lg px-2 py-1 text-xs mb-3 border inline-block"])}">${ssrInterpolate(plan.discount)}\u066A \u062A\u062E\u0641\u06CC\u0641
                </div>`);
        } else {
          _push(`<div class="h-6 mb-3"></div>`);
        }
        _push(` <div class="${ssrRenderClass([getPlanTextColor(index), "text-3xl font-bold mb-4"])}">${ssrInterpolate(Math.round(plan.price / 1e3))} \u062A
                </div> <button class="${ssrRenderClass([getPlanButtonClass(index), "w-full font-semibold py-3 px-4 rounded-xl transition-all duration-200 text-sm"])}">
                  \u0633\u0641\u0627\u0631\u0634
                </button></div> `);
        if (index === 0) {
          _push(`<div class="${ssrRenderClass([getPlanTextColor(index), "absolute top-3 right-3"])}"><i class="ti ti-crown text-xl"></i></div>`);
        } else {
          _push(`<!---->`);
        }
        _push(` `);
        if (index === 0) {
          _push(`<div class="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-12 transform -translate-x-full animate-pulse"></div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div>`);
      });
      _push(`<!--]--></div></div> <div class="px-4 mt-6"><div class="rtl:text-right ltr:text-left mb-4"><h3 class="text-lg font-semibold text-foreground mb-2">\u0648\u06CC\u0698\u06AF\u06CC\u200C\u0647\u0627\u06CC \u0627\u0634\u062A\u0631\u0627\u06A9 \u0648\u06CC\u0698\u0647</h3> <div class="w-12 h-0.5 bg-primary ml-auto rounded-full"></div></div></div> <div class="p-4 xl:hidden"><div class="space-y-3"><!--[-->`);
      ssrRenderList(features.value, (feature, index) => {
        _push(ssrRenderComponent(_component_NuxtLink, {
          key: feature.id,
          to: `/dashboard/checkout/feature/${feature.slug}`,
          class: "flex items-center justify-between p-3 bg-card hover:bg-accent rounded-xl transition-colors cursor-pointer border border-border"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<div class="flex items-center gap-3"${_scopeId}><div class="${ssrRenderClass([
                "w-10 h-10 rounded-lg flex items-center justify-center",
                getIconBgClass(index)
              ])}"${_scopeId}><i class="${ssrRenderClass([feature.icon || "ti ti-star", getIconColorClass(index), "text-xl"])}"${_scopeId}></i></div> <span class="text-foreground font-medium"${_scopeId}>${ssrInterpolate(feature.title)}</span></div> <i class="ti ti-chevron-left text-muted-foreground"${_scopeId}></i>`);
            } else {
              return [
                createVNode("div", { class: "flex items-center gap-3" }, [
                  createVNode("div", {
                    class: [
                      "w-10 h-10 rounded-lg flex items-center justify-center",
                      getIconBgClass(index)
                    ]
                  }, [
                    createVNode("i", {
                      class: [feature.icon || "ti ti-star", getIconColorClass(index), "text-xl"]
                    }, null, 2)
                  ], 2),
                  createTextVNode(),
                  createVNode("span", { class: "text-foreground font-medium" }, toDisplayString(feature.title), 1)
                ]),
                createTextVNode(),
                createVNode("i", { class: "ti ti-chevron-left text-muted-foreground" })
              ];
            }
          }),
          _: 2
        }, _parent));
      });
      _push(`<!--]--> `);
      if (features.value.length === 0) {
        _push(`<!--[--><div class="flex items-center justify-between p-3 bg-card hover:bg-accent rounded-xl transition-colors border border-border"><div class="flex items-center gap-3"><div class="w-10 h-10 rounded-lg bg-blue-500/10 dark:bg-blue-500/20 flex items-center justify-center"><i class="ti ti-credit-card text-blue-500 text-xl"></i></div> <span class="text-foreground font-medium">\u0627\u06CC\u062C\u0627\u062F \u062A\u0627 \u06F3 \u06A9\u0627\u0631\u062A \u0648\u06CC\u0632\u06CC\u062A \u062A\u062C\u0627\u0631\u06CC</span></div> <i class="ti ti-chevron-left text-muted-foreground"></i></div> <div class="flex items-center justify-between p-3 bg-card hover:bg-accent rounded-xl transition-colors border border-border"><div class="flex items-center gap-3"><div class="w-10 h-10 rounded-lg bg-purple-500/10 dark:bg-purple-500/20 flex items-center justify-center"><i class="ti ti-qrcode text-purple-500 text-xl"></i></div> <span class="text-foreground font-medium">\u0627\u06CC\u062C\u0627\u062F QR \u06A9\u062F \u0633\u0641\u0627\u0631\u0634\u06CC</span></div> <i class="ti ti-chevron-left text-muted-foreground"></i></div> <div class="flex items-center justify-between p-3 bg-card hover:bg-accent rounded-xl transition-colors border border-border"><div class="flex items-center gap-3"><div class="w-10 h-10 rounded-lg bg-emerald-500/10 dark:bg-emerald-500/20 flex items-center justify-center"><i class="ti ti-chart-line text-emerald-500 text-xl"></i></div> <span class="text-foreground font-medium">\u062F\u0633\u062A\u0631\u0633\u06CC \u0628\u0647 \u0622\u0645\u0627\u0631 \u0645\u0627\u062F\u0627\u0645\u200C\u0627\u0644\u0639\u0645\u0631</span></div> <i class="ti ti-chevron-left text-muted-foreground"></i></div><!--]-->`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div></div> <div class="hidden xl:block px-4 mt-2"><div class="grid grid-cols-2 2xl:grid-cols-3 gap-4"><!--[-->`);
      ssrRenderList(features.value, (feature, index) => {
        _push(ssrRenderComponent(_component_NuxtLink, {
          key: feature.id,
          to: `/dashboard/checkout/feature/${feature.slug}`,
          class: "group bg-card hover:bg-accent/50 rounded-2xl p-5 transition-all duration-300 cursor-pointer border border-border hover:border-primary/30 hover:shadow-lg"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<div class="flex items-start gap-4"${_scopeId}><div class="${ssrRenderClass([
                "w-14 h-14 rounded-xl flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform",
                getIconBgGradientClass(index)
              ])}"${_scopeId}><i class="${ssrRenderClass([feature.icon || "ti ti-star", getIconColorClass(index), "text-2xl"])}"${_scopeId}></i></div> <div class="flex-1 min-w-0"${_scopeId}><h4 class="text-foreground font-bold mb-1 group-hover:text-primary transition-colors"${_scopeId}>${ssrInterpolate(feature.title)}</h4> `);
              if (feature.description) {
                _push2(`<p class="text-muted-foreground text-sm line-clamp-2"${_scopeId}>${ssrInterpolate(feature.description)}</p>`);
              } else {
                _push2(`<!---->`);
              }
              _push2(`</div></div> <div class="mt-4 flex items-center justify-end text-primary text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity"${_scopeId}><span${_scopeId}>\u0645\u0634\u0627\u0647\u062F\u0647 \u062C\u0632\u0626\u06CC\u0627\u062A</span> <i class="ti ti-arrow-left mr-1"${_scopeId}></i></div>`);
            } else {
              return [
                createVNode("div", { class: "flex items-start gap-4" }, [
                  createVNode("div", {
                    class: [
                      "w-14 h-14 rounded-xl flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform",
                      getIconBgGradientClass(index)
                    ]
                  }, [
                    createVNode("i", {
                      class: [feature.icon || "ti ti-star", getIconColorClass(index), "text-2xl"]
                    }, null, 2)
                  ], 2),
                  createTextVNode(),
                  createVNode("div", { class: "flex-1 min-w-0" }, [
                    createVNode("h4", { class: "text-foreground font-bold mb-1 group-hover:text-primary transition-colors" }, toDisplayString(feature.title), 1),
                    createTextVNode(),
                    feature.description ? (openBlock(), createBlock("p", {
                      key: 0,
                      class: "text-muted-foreground text-sm line-clamp-2"
                    }, toDisplayString(feature.description), 1)) : createCommentVNode("", true)
                  ])
                ]),
                createTextVNode(),
                createVNode("div", { class: "mt-4 flex items-center justify-end text-primary text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity" }, [
                  createVNode("span", null, "\u0645\u0634\u0627\u0647\u062F\u0647 \u062C\u0632\u0626\u06CC\u0627\u062A"),
                  createTextVNode(),
                  createVNode("i", { class: "ti ti-arrow-left mr-1" })
                ])
              ];
            }
          }),
          _: 2
        }, _parent));
      });
      _push(`<!--]--> `);
      if (features.value.length === 0) {
        _push(`<!--[--><div class="group bg-card hover:bg-accent/50 rounded-2xl p-5 transition-all duration-300 border border-border hover:border-blue-300 dark:hover:border-blue-600"><div class="flex items-start gap-4"><div class="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-500/20 to-blue-500/5 dark:from-blue-500/30 dark:to-blue-500/10 flex items-center justify-center shrink-0"><i class="ti ti-credit-card text-blue-500 text-2xl"></i></div> <div class="flex-1"><h4 class="text-foreground font-bold mb-1">\u06A9\u0627\u0631\u062A \u0648\u06CC\u0632\u06CC\u062A \u062A\u062C\u0627\u0631\u06CC</h4> <p class="text-muted-foreground text-sm">\u0627\u06CC\u062C\u0627\u062F \u062A\u0627 \u06F3 \u06A9\u0627\u0631\u062A \u0648\u06CC\u0632\u06CC\u062A \u062D\u0631\u0641\u0647\u200C\u0627\u06CC</p></div></div></div> <div class="group bg-card hover:bg-accent/50 rounded-2xl p-5 transition-all duration-300 border border-border hover:border-purple-300 dark:hover:border-purple-600"><div class="flex items-start gap-4"><div class="w-14 h-14 rounded-xl bg-gradient-to-br from-purple-500/20 to-purple-500/5 dark:from-purple-500/30 dark:to-purple-500/10 flex items-center justify-center shrink-0"><i class="ti ti-qrcode text-purple-500 text-2xl"></i></div> <div class="flex-1"><h4 class="text-foreground font-bold mb-1">QR \u06A9\u062F \u0633\u0641\u0627\u0631\u0634\u06CC</h4> <p class="text-muted-foreground text-sm">\u0627\u06CC\u062C\u0627\u062F \u06A9\u062F\u0647\u0627\u06CC QR \u0645\u0646\u062D\u0635\u0631 \u0628\u0647 \u0641\u0631\u062F</p></div></div></div> <div class="group bg-card hover:bg-accent/50 rounded-2xl p-5 transition-all duration-300 border border-border hover:border-emerald-300 dark:hover:border-emerald-600"><div class="flex items-start gap-4"><div class="w-14 h-14 rounded-xl bg-gradient-to-br from-emerald-500/20 to-emerald-500/5 dark:from-emerald-500/30 dark:to-emerald-500/10 flex items-center justify-center shrink-0"><i class="ti ti-chart-line text-emerald-500 text-2xl"></i></div> <div class="flex-1"><h4 class="text-foreground font-bold mb-1">\u0622\u0645\u0627\u0631 \u067E\u06CC\u0634\u0631\u0641\u062A\u0647</h4> <p class="text-muted-foreground text-sm">\u062F\u0633\u062A\u0631\u0633\u06CC \u0628\u0647 \u0622\u0645\u0627\u0631 \u0645\u0627\u062F\u0627\u0645\u200C\u0627\u0644\u0639\u0645\u0631</p></div></div></div> <div class="group bg-card hover:bg-accent/50 rounded-2xl p-5 transition-all duration-300 border border-border hover:border-pink-300 dark:hover:border-pink-600"><div class="flex items-start gap-4"><div class="w-14 h-14 rounded-xl bg-gradient-to-br from-pink-500/20 to-pink-500/5 dark:from-pink-500/30 dark:to-pink-500/10 flex items-center justify-center shrink-0"><i class="ti ti-palette text-pink-500 text-2xl"></i></div> <div class="flex-1"><h4 class="text-foreground font-bold mb-1">\u062A\u0645\u200C\u0647\u0627\u06CC \u067E\u0631\u0648\u0641\u0627\u06CC\u0644</h4> <p class="text-muted-foreground text-sm">\u0634\u062E\u0635\u06CC\u200C\u0633\u0627\u0632\u06CC \u0638\u0627\u0647\u0631 \u067E\u0631\u0648\u0641\u0627\u06CC\u0644</p></div></div></div> <div class="group bg-card hover:bg-accent/50 rounded-2xl p-5 transition-all duration-300 border border-border hover:border-amber-300 dark:hover:border-amber-600"><div class="flex items-start gap-4"><div class="w-14 h-14 rounded-xl bg-gradient-to-br from-amber-500/20 to-amber-500/5 dark:from-amber-500/30 dark:to-amber-500/10 flex items-center justify-center shrink-0"><i class="ti ti-link text-amber-500 text-2xl"></i></div> <div class="flex-1"><h4 class="text-foreground font-bold mb-1">\u0644\u06CC\u0646\u06A9\u200C\u0647\u0627\u06CC \u067E\u0631\u0648</h4> <p class="text-muted-foreground text-sm">\u0644\u06CC\u0646\u06A9\u200C\u0647\u0627\u06CC \u0646\u0627\u0645\u062D\u062F\u0648\u062F \u062D\u0631\u0641\u0647\u200C\u0627\u06CC</p></div></div></div> <div class="group bg-card hover:bg-accent/50 rounded-2xl p-5 transition-all duration-300 border border-border hover:border-cyan-300 dark:hover:border-cyan-600"><div class="flex items-start gap-4"><div class="w-14 h-14 rounded-xl bg-gradient-to-br from-cyan-500/20 to-cyan-500/5 dark:from-cyan-500/30 dark:to-cyan-500/10 flex items-center justify-center shrink-0"><i class="ti ti-crown text-cyan-500 text-2xl"></i></div> <div class="flex-1"><h4 class="text-foreground font-bold mb-1">\u067E\u0634\u062A\u06CC\u0628\u0627\u0646\u06CC VIP</h4> <p class="text-muted-foreground text-sm">\u067E\u0634\u062A\u06CC\u0628\u0627\u0646\u06CC \u0627\u062E\u062A\u0635\u0627\u0635\u06CC \u067E\u0631\u0645\u06CC\u0648\u0645</p></div></div></div><!--]-->`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div></div></div></div></div></div></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/dashboard/checkout/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=index-nwYEFS2M.mjs.map
