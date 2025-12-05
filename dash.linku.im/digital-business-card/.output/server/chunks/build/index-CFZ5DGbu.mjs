import { defineComponent, computed, mergeProps, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderAttr, ssrInterpolate, ssrRenderClass, ssrRenderList } from 'vue/server-renderer';
import { u as useUserStore } from './user-D1YL8aKq.mjs';
import { u as useFormStore } from './form-CUJQskNk.mjs';
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
  __name: "index",
  __ssrInlineRender: true,
  setup(__props) {
    const userStore = useUserStore();
    const formStore = useFormStore();
    const userName = computed(() => {
      var _a;
      return ((_a = userStore.user) == null ? void 0 : _a.name) || "\u06A9\u0627\u0631\u0628\u0631";
    });
    computed(() => {
      var _a, _b;
      return ((_a = userStore.user) == null ? void 0 : _a.userName) || ((_b = userStore.user) == null ? void 0 : _b.username) || "";
    });
    const userPhone = computed(() => {
      const user = userStore.user;
      const countryCode = (user == null ? void 0 : user.countryCode) || "";
      const phone = (user == null ? void 0 : user.phone) || "";
      if (phone) {
        return `${countryCode}${phone}`;
      }
      return (user == null ? void 0 : user.email) || "";
    });
    const userAvatar = computed(() => {
      var _a, _b;
      const avatar = ((_a = userStore.user) == null ? void 0 : _a.avatar) || ((_b = formStore.defaultCard) == null ? void 0 : _b.avatar);
      return avatar || "/logo.svg";
    });
    const isPro = computed(() => {
      var _a;
      return ((_a = userStore.user) == null ? void 0 : _a.isPro) || false;
    });
    const subscriptionStatusText = computed(() => {
      var _a;
      if (!((_a = userStore.user) == null ? void 0 : _a.isPro)) return "\u062F\u0633\u062A\u0631\u0633\u06CC \u0628\u0647 \u0627\u0645\u06A9\u0627\u0646\u0627\u062A \u0648\u06CC\u0698\u0647";
      const daysRemaining = userStore.user.daysRemaining || userStore.user.days_remaining;
      if (daysRemaining !== void 0 && daysRemaining !== null) {
        if (daysRemaining > 30) {
          const months = Math.floor(daysRemaining / 30);
          return `${months} \u0645\u0627\u0647 \u0628\u0627\u0642\u06CC\u200C\u0645\u0627\u0646\u062F\u0647`;
        }
        return `${daysRemaining} \u0631\u0648\u0632 \u0628\u0627\u0642\u06CC\u200C\u0645\u0627\u0646\u062F\u0647`;
      }
      const endDate = userStore.user.subscriptionEndDate || userStore.user.subscription_end_date;
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
      return "\u062A\u0645\u0627\u0645 \u0627\u0645\u06A9\u0627\u0646\u0627\u062A \u062F\u0631 \u062F\u0633\u062A\u0631\u0633 \u0634\u0645\u0627\u0633\u062A";
    });
    const isProfileLoaded = computed(() => !!userStore.user && !!userStore.user.id);
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "min-h-screen bg-background pb-24 lg:pb-12" }, _attrs))}><div class="px-3 lg:px-6 py-3 lg:py-6 bg-background"><div class="w-full max-w-6xl mx-auto"><div class="hidden lg:grid lg:grid-cols-3 lg:gap-6"><div class="lg:col-span-1"><div class="bg-card rounded-2xl p-8 border border-border sticky top-24 shadow-sm">`);
      if (isProfileLoaded.value) {
        _push(`<div class="text-center"><div class="relative w-32 h-32 mx-auto mb-6"><div class="absolute inset-0 bg-gradient-to-br from-primary to-primary/50 rounded-full blur-sm"></div> <div class="relative w-full h-full rounded-full flex items-center justify-center overflow-hidden ring-4 ring-card bg-muted">`);
        if (userAvatar.value) {
          _push(`<img${ssrRenderAttr("src", userAvatar.value)}${ssrRenderAttr("alt", userName.value)} class="w-full h-full object-cover">`);
        } else {
          _push(`<i class="ti ti-user text-primary text-5xl"></i>`);
        }
        _push(`</div></div> <div class="mb-6"><div class="flex items-center justify-center gap-2 mb-2"><h2 class="text-2xl font-bold text-foreground">${ssrInterpolate(userName.value)}</h2> `);
        if (isPro.value) {
          _push(`<i class="ti ti-crown text-primary text-2xl"></i>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div> <p class="text-sm text-muted-foreground font-mono" dir="ltr">${ssrInterpolate(userPhone.value)}</p></div> <button class="w-full py-3.5 rounded-xl bg-primary text-primary-foreground hover:shadow-lg hover:shadow-primary/20 font-medium transition-all flex items-center justify-center gap-2 group"><i class="ti ti-edit text-lg group-hover:rotate-12 transition-transform"></i> <span>\u0648\u06CC\u0631\u0627\u06CC\u0634 \u067E\u0631\u0648\u0641\u0627\u06CC\u0644</span></button></div>`);
      } else {
        _push(`<div class="text-center animate-pulse"><div class="w-32 h-32 mx-auto bg-muted rounded-full mb-6"></div> <div class="h-7 w-36 bg-muted rounded mx-auto mb-2"></div> <div class="h-4 w-28 bg-muted rounded mx-auto mb-6"></div> <div class="h-12 w-full bg-muted rounded-xl"></div></div>`);
      }
      _push(` `);
      if (isProfileLoaded.value) {
        _push(`<div class="mt-6 pt-6 border-t border-border">`);
        if (!isPro.value) {
          _push(`<button class="w-full p-4 rounded-xl hover:scale-[1.02] transition-all cursor-pointer text-center bg-gradient-to-br from-primary/10 to-primary/5 hover:from-primary/20 hover:to-primary/10 border border-primary/20"><i class="ti ti-crown text-3xl mb-2 block text-primary"></i> <p class="font-bold text-base text-primary mb-1">\u0627\u0631\u062A\u0642\u0627 \u0628\u0647 \u062D\u0633\u0627\u0628 \u0648\u06CC\u0698\u0647</p> <p class="text-xs text-muted-foreground">\u062F\u0633\u062A\u0631\u0633\u06CC \u0628\u0647 \u062A\u0645\u0627\u0645 \u0627\u0645\u06A9\u0627\u0646\u0627\u062A</p></button>`);
        } else {
          _push(`<div class="w-full p-4 rounded-xl text-center bg-gradient-to-br from-green-500/10 to-green-500/5 border border-green-500/20"><i class="ti ti-rosette-discount-check text-3xl mb-2 block text-green-500"></i> <p class="font-bold text-base text-green-500 mb-1">\u0627\u0634\u062A\u0631\u0627\u06A9 \u0648\u06CC\u0698\u0647 \u0641\u0639\u0627\u0644</p> <p class="text-xs text-green-600/70">${ssrInterpolate(subscriptionStatusText.value)}</p></div>`);
        }
        _push(`</div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div></div> <div class="lg:col-span-2"><div class="bg-card rounded-2xl border border-border overflow-hidden">`);
      if (isProfileLoaded.value) {
        _push(`<div class="divide-y divide-border"><button class="w-full flex items-center justify-between p-4 hover:bg-muted transition-colors"><div class="flex items-center gap-3"><div class="w-10 h-10 rounded-xl bg-green-500/10 flex items-center justify-center"><i class="ti ti-user-check text-green-500 text-lg"></i></div> <span class="font-medium text-foreground">\u0648\u0636\u0639\u06CC\u062A \u062D\u0633\u0627\u0628</span></div> <i class="ti ti-chevron-left text-muted-foreground"></i></button> <button class="w-full flex items-center justify-between p-4 hover:bg-muted transition-colors"><div class="flex items-center gap-3"><div class="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center"><i class="ti ti-wallet text-blue-500 text-lg"></i></div> <span class="font-medium text-foreground">\u0645\u0627\u0644\u06CC \u0648 \u062A\u0631\u0627\u06A9\u0646\u0634\u200C\u0647\u0627</span></div> <i class="ti ti-chevron-left text-muted-foreground"></i></button> <button class="w-full flex items-center justify-between p-4 hover:bg-muted transition-colors"><div class="flex items-center gap-3"><div class="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center"><i class="ti ti-shopping-cart text-purple-500 text-lg"></i></div> <span class="font-medium text-foreground">\u062E\u0631\u06CC\u062F \u0645\u062D\u0635\u0648\u0644\u0627\u062A \u0644\u06CC\u0646\u06A9\u0648</span></div> <i class="ti ti-chevron-left text-muted-foreground"></i></button> <button class="w-full flex items-center justify-between p-4 hover:bg-muted transition-colors"><div class="flex items-center gap-3"><div class="w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center"><i class="ti ti-nfc text-orange-500 text-lg"></i></div> <span class="font-medium text-foreground">\u0641\u0639\u0627\u0644\u200C\u0633\u0627\u0632\u06CC \u062F\u0633\u062A\u06AF\u0627\u0647</span></div> <i class="ti ti-chevron-left text-muted-foreground"></i></button> <button class="w-full flex items-center justify-between p-4 hover:bg-muted transition-colors"><div class="flex items-center gap-3"><div class="w-10 h-10 rounded-xl bg-cyan-500/10 flex items-center justify-center"><i class="ti ti-device-mobile-check text-cyan-500 text-lg"></i></div> <span class="font-medium text-foreground">\u0645\u062D\u0635\u0648\u0644\u0627\u062A \u0641\u0639\u0627\u0644 \u0645\u0646</span></div> <i class="ti ti-chevron-left text-muted-foreground"></i></button> <button class="${ssrRenderClass([!isPro.value ? "bg-primary/5 hover:bg-primary/10" : "hover:bg-muted", "w-full flex items-center justify-between p-4 transition-colors"])}"><div class="flex items-center gap-3"><div class="${ssrRenderClass([!isPro.value ? "bg-primary/15" : "bg-green-500/10", "w-10 h-10 rounded-xl flex items-center justify-center"])}"><i class="${ssrRenderClass([!isPro.value ? "text-primary" : "text-green-500", "ti ti-crown text-lg"])}"></i></div> <span class="${ssrRenderClass([!isPro.value ? "text-primary" : "text-foreground", "font-medium"])}">${ssrInterpolate(isPro.value ? "\u0645\u062F\u06CC\u0631\u06CC\u062A \u0627\u0634\u062A\u0631\u0627\u06A9" : "\u0627\u0631\u062A\u0642\u0627\u0621 \u0628\u0647 \u062D\u0633\u0627\u0628 \u0648\u06CC\u0698\u0647")}</span></div> <i class="${ssrRenderClass([!isPro.value ? "text-primary" : "text-muted-foreground", "ti ti-chevron-left"])}"></i></button> <button disabled class="w-full flex items-center justify-between p-4 opacity-50 cursor-not-allowed"><div class="flex items-center gap-3"><div class="w-10 h-10 rounded-xl bg-muted flex items-center justify-center"><i class="ti ti-building-store text-muted-foreground text-lg"></i></div> <div class="flex items-center gap-2"><span class="font-medium text-foreground">\u063A\u0631\u0641\u0647 \u0633\u0627\u0632 \u0644\u06CC\u0646\u06A9\u0648</span> <span class="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded">\u0628\u0632\u0648\u062F\u06CC</span></div></div> <i class="ti ti-chevron-left text-muted-foreground"></i></button> <button disabled class="w-full flex items-center justify-between p-4 opacity-50 cursor-not-allowed"><div class="flex items-center gap-3"><div class="w-10 h-10 rounded-xl bg-muted flex items-center justify-center"><i class="ti ti-users text-muted-foreground text-lg"></i></div> <div class="flex items-center gap-2"><span class="font-medium text-foreground">\u062F\u0639\u0648\u062A \u0627\u0632 \u062F\u0648\u0633\u062A\u0627\u0646</span> <span class="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded">\u0628\u0632\u0648\u062F\u06CC</span></div></div> <i class="ti ti-chevron-left text-muted-foreground"></i></button> <button class="w-full flex items-center justify-between p-4 hover:bg-muted transition-colors"><div class="flex items-center gap-3"><div class="w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center"><i class="ti ti-gift text-orange-500 text-lg"></i></div> <span class="font-medium text-foreground">\u062A\u062E\u0641\u06CC\u0641\u0627\u062A \u0648 \u062C\u0627\u06CC\u0632\u0647\u200C\u0647\u0627</span></div> <i class="ti ti-chevron-left text-muted-foreground"></i></button> <button disabled class="w-full flex items-center justify-between p-4 opacity-50 cursor-not-allowed"><div class="flex items-center gap-3"><div class="w-10 h-10 rounded-xl bg-muted flex items-center justify-center"><i class="ti ti-map text-muted-foreground text-lg"></i></div> <div class="flex items-center gap-2"><span class="font-medium text-foreground">\u062A\u0646\u0638\u06CC\u0645\u0627\u062A \u0646\u0642\u0634\u0647</span> <span class="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded">\u0628\u0632\u0648\u062F\u06CC</span></div></div> <i class="ti ti-chevron-left text-muted-foreground"></i></button> <button class="w-full flex items-center justify-between p-4 hover:bg-muted transition-colors"><div class="flex items-center gap-3"><div class="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center"><i class="ti ti-help text-red-500 text-lg"></i></div> <span class="font-medium text-foreground">\u0631\u0627\u0647\u0646\u0645\u0627 \u0648 \u067E\u0634\u062A\u06CC\u0628\u0627\u0646\u06CC</span></div> <i class="ti ti-chevron-left text-muted-foreground"></i></button> <button class="w-full flex items-center justify-between p-4 hover:bg-muted transition-colors"><div class="flex items-center gap-3"><div class="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center"><i class="ti ti-video text-purple-500 text-lg"></i></div> <span class="font-medium text-foreground">\u0648\u06CC\u062F\u06CC\u0648\u0647\u0627\u06CC \u0622\u0645\u0648\u0632\u0634\u06CC</span></div> <i class="ti ti-chevron-left text-muted-foreground"></i></button> <button class="w-full flex items-center justify-between p-4 hover:bg-muted transition-colors"><div class="flex items-center gap-3"><div class="w-10 h-10 rounded-xl bg-muted flex items-center justify-center"><i class="ti ti-info-circle text-foreground text-lg"></i></div> <span class="font-medium text-foreground">\u062F\u0631\u0628\u0627\u0631\u0647</span></div> <i class="ti ti-chevron-left text-muted-foreground"></i></button> <button class="w-full flex items-center justify-between p-4 hover:bg-muted transition-colors"><div class="flex items-center gap-3"><div class="w-10 h-10 rounded-xl bg-muted flex items-center justify-center"><i class="ti ti-settings text-foreground text-lg"></i></div> <span class="font-medium text-foreground">\u062A\u0646\u0638\u06CC\u0645\u0627\u062A</span></div> <i class="ti ti-chevron-left text-muted-foreground"></i></button> <button class="w-full flex items-center justify-between p-4 hover:bg-red-500/10 transition-colors group"><div class="flex items-center gap-3"><div class="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center group-hover:bg-red-500/20 transition-colors"><i class="ti ti-logout text-red-500 text-lg"></i></div> <span class="font-medium text-red-500">\u062E\u0631\u0648\u062C \u0627\u0632 \u062D\u0633\u0627\u0628</span></div> <i class="ti ti-chevron-left text-red-500"></i></button></div>`);
      } else {
        _push(`<div class="divide-y divide-border"><!--[-->`);
        ssrRenderList(13, (i) => {
          _push(`<div class="flex items-center justify-between p-4 animate-pulse"><div class="flex items-center gap-3"><div class="w-10 h-10 bg-muted rounded-xl"></div> <div class="space-y-2"><div class="h-4 w-32 bg-muted rounded"></div> <div class="h-3 w-24 bg-muted rounded"></div></div></div> <div class="w-3 h-3 bg-muted rounded"></div></div>`);
        });
        _push(`<!--]--></div>`);
      }
      _push(`</div></div></div> <div class="lg:hidden">`);
      if (isProfileLoaded.value) {
        _push(`<div class="flex items-center gap-4 mb-6"><div class="w-16 h-16 bg-muted rounded-full flex items-center justify-center overflow-hidden ring-2 ring-border">`);
        if (userAvatar.value) {
          _push(`<img${ssrRenderAttr("src", userAvatar.value)}${ssrRenderAttr("alt", userName.value)} class="w-full h-full object-cover">`);
        } else {
          _push(`<i class="ti ti-user text-primary text-2xl"></i>`);
        }
        _push(`</div> <div class="flex-1 text-right"><div class="flex items-center gap-2"><h2 class="text-xl font-bold text-foreground">${ssrInterpolate(userName.value)}</h2> `);
        if (isPro.value) {
          _push(`<i class="ti ti-rosette-discount-check-filled text-primary text-xl"></i>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div> <p class="text-sm text-muted-foreground pt-1" dir="ltr">${ssrInterpolate(userPhone.value)}</p></div> <button class="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center hover:bg-primary/20 transition-colors"><i class="ti ti-edit text-primary text-lg"></i></button></div>`);
      } else {
        _push(`<div class="flex items-center gap-4 mb-6 animate-pulse"><div class="w-16 h-16 bg-muted rounded-full"></div> <div class="flex-1 text-right space-y-2"><div class="flex items-center gap-2 justify-end"><div class="h-6 w-32 bg-muted rounded"></div> <div class="w-5 h-5 bg-muted rounded-full"></div></div> <div class="h-4 w-24 bg-muted rounded ml-auto"></div></div> <div class="w-9 h-9 bg-muted rounded-full"></div></div>`);
      }
      _push(` `);
      if (isProfileLoaded.value) {
        _push(`<div class="mb-6">`);
        if (!isPro.value) {
          _push(`<button class="w-full p-4 rounded-2xl flex items-center justify-between hover:opacity-90 transition-all cursor-pointer bg-primary/10 hover:bg-primary/20 border border-primary/20"><div class="flex-1 text-right"><p class="font-semibold text-base text-primary">\u0647\u06CC\u0686 \u0627\u0634\u062A\u0631\u0627\u06A9 \u0641\u0639\u0627\u0644\u06CC \u0646\u062F\u0627\u0631\u06CC\u062F</p> <p class="text-sm mt-1 text-muted-foreground">\u0628\u0631\u0627\u06CC \u0627\u0633\u062A\u0641\u0627\u062F\u0647 \u0627\u0632 \u0627\u0645\u06A9\u0627\u0646\u0627\u062A \u0648\u06CC\u0698\u0647\u060C \u0627\u0634\u062A\u0631\u0627\u06A9 \u062A\u0647\u06CC\u0647 \u06A9\u0646\u06CC\u062F</p></div> <div class="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center"><i class="ti ti-crown text-xl text-primary"></i></div></button>`);
        } else {
          _push(`<div class="w-full p-4 rounded-2xl flex items-center justify-between bg-green-500/10 border border-green-500/20"><div class="flex-1 text-right"><p class="font-semibold text-base flex items-center gap-2 text-green-500"><i class="ti ti-crown text-lg"></i>
                  \u0627\u0634\u062A\u0631\u0627\u06A9 \u0648\u06CC\u0698\u0647 \u0641\u0639\u0627\u0644 \u0627\u0633\u062A
                </p> <p class="text-sm mt-1 text-green-600/70">\u0634\u0645\u0627 \u0627\u0632 \u062A\u0645\u0627\u0645 \u0627\u0645\u06A9\u0627\u0646\u0627\u062A \u067E\u0631\u06CC\u0645\u06CC\u0648\u0645 \u0627\u0633\u062A\u0641\u0627\u062F\u0647 \u0645\u06CC\u200C\u06A9\u0646\u06CC\u062F</p></div> <div class="w-12 h-12 rounded-xl bg-green-500/20 flex items-center justify-center"><i class="ti ti-check text-xl text-green-500"></i></div></div>`);
        }
        _push(`</div>`);
      } else {
        _push(`<div class="mb-6 animate-pulse"><div class="bg-muted border border-border p-4 rounded-2xl flex items-center justify-between"><div class="flex-1 space-y-2"><div class="h-5 w-48 bg-muted/50 rounded"></div> <div class="h-4 w-32 bg-muted/50 rounded"></div></div> <div class="w-12 h-12 bg-muted/50 rounded-xl"></div></div></div>`);
      }
      _push(` `);
      if (isProfileLoaded.value) {
        _push(`<div class="space-y-0 divide-y divide-border border-t border-border"><button class="w-full flex items-center justify-between py-4 hover:bg-muted transition-colors"><div class="flex items-center gap-3"><i class="ti ti-user-check text-primary text-lg"></i> <span class="font-medium text-foreground text-base">\u0648\u0636\u0639\u06CC\u062A \u062D\u0633\u0627\u0628</span></div> <div class="flex items-center gap-2"><span class="w-2 h-2 bg-green-500 rounded-full"></span> <i class="ti ti-chevron-left text-muted-foreground text-sm"></i></div></button> <button class="w-full flex items-center justify-between py-4 hover:bg-muted transition-colors"><div class="flex items-center gap-3"><i class="ti ti-wallet text-primary text-lg"></i> <span class="font-medium text-foreground text-base">\u0645\u0627\u0644\u06CC \u0648 \u062A\u0631\u0627\u06A9\u0646\u0634\u200C\u0647\u0627</span></div> <i class="ti ti-chevron-left text-muted-foreground text-sm"></i></button> <button class="w-full flex items-center justify-between py-4 hover:bg-muted transition-colors"><div class="flex items-center gap-3"><i class="ti ti-shopping-cart text-primary text-lg"></i> <span class="font-medium text-foreground text-base">\u062E\u0631\u06CC\u062F \u0645\u062D\u0635\u0648\u0644\u0627\u062A \u0644\u06CC\u0646\u06A9\u0648</span></div> <i class="ti ti-chevron-left text-muted-foreground text-sm"></i></button> <button class="w-full flex items-center justify-between py-4 hover:bg-muted transition-colors"><div class="flex items-center gap-3"><i class="ti ti-nfc text-primary text-lg"></i> <span class="font-medium text-foreground text-base">\u0641\u0639\u0627\u0644\u200C\u0633\u0627\u0632\u06CC \u062F\u0633\u062A\u06AF\u0627\u0647</span></div> <i class="ti ti-chevron-left text-muted-foreground text-sm"></i></button> <button class="w-full flex items-center justify-between py-4 hover:bg-muted transition-colors"><div class="flex items-center gap-3"><i class="ti ti-device-mobile-check text-primary text-lg"></i> <span class="font-medium text-foreground text-base">\u0645\u062D\u0635\u0648\u0644\u0627\u062A \u0641\u0639\u0627\u0644 \u0645\u0646</span></div> <i class="ti ti-chevron-left text-muted-foreground text-sm"></i></button> <button class="w-full flex items-center justify-between py-4 hover:bg-muted transition-colors"><div class="flex items-center gap-3"><i class="ti ti-crown text-primary text-lg"></i> <span class="font-medium text-foreground text-base">${ssrInterpolate(isPro.value ? "\u0645\u062F\u06CC\u0631\u06CC\u062A \u0627\u0634\u062A\u0631\u0627\u06A9" : "\u0627\u0631\u062A\u0642\u0627\u0621 \u0628\u0647 \u062D\u0633\u0627\u0628 \u0648\u06CC\u0698\u0647")}</span></div> <i class="ti ti-chevron-left text-muted-foreground text-sm"></i></button> <button disabled class="w-full flex items-center justify-between py-4 opacity-50 cursor-not-allowed"><div class="flex items-center gap-3"><i class="ti ti-building-store text-muted-foreground text-lg"></i> <span class="font-medium text-foreground text-base">\u063A\u0631\u0641\u0647 \u0633\u0627\u0632 \u0644\u06CC\u0646\u06A9\u0648</span> <span class="text-xs text-muted-foreground bg-muted px-2 py-1 rounded">\u0628\u0632\u0648\u062F\u06CC</span></div> <i class="ti ti-chevron-left text-muted-foreground text-sm"></i></button> <button disabled class="w-full flex items-center justify-between py-4 opacity-50 cursor-not-allowed"><div class="flex items-center gap-3"><i class="ti ti-users text-muted-foreground text-lg"></i> <span class="font-medium text-foreground text-base">\u062F\u0639\u0648\u062A \u0627\u0632 \u062F\u0648\u0633\u062A\u0627\u0646</span> <span class="text-xs text-muted-foreground bg-muted px-2 py-1 rounded">\u0628\u0632\u0648\u062F\u06CC</span></div> <i class="ti ti-chevron-left text-muted-foreground text-sm"></i></button> <button class="w-full flex items-center justify-between py-4 hover:bg-muted transition-colors"><div class="flex items-center gap-3"><i class="ti ti-gift text-orange-500 text-lg"></i> <span class="font-medium text-foreground text-base">\u062A\u062E\u0641\u06CC\u0641\u0627\u062A \u0648 \u062C\u0627\u06CC\u0632\u0647\u200C\u0647\u0627</span></div> <i class="ti ti-chevron-left text-muted-foreground text-sm"></i></button> <button disabled class="w-full flex items-center justify-between py-4 opacity-50 cursor-not-allowed"><div class="flex items-center gap-3"><i class="ti ti-map text-muted-foreground text-lg"></i> <span class="font-medium text-foreground text-base">\u062A\u0646\u0638\u06CC\u0645\u0627\u062A \u0646\u0642\u0634\u0647</span> <span class="text-xs text-muted-foreground bg-muted px-2 py-1 rounded">\u0628\u0632\u0648\u062F\u06CC</span></div> <i class="ti ti-chevron-left text-muted-foreground text-sm"></i></button> <button class="w-full flex items-center justify-between py-4 hover:bg-muted transition-colors"><div class="flex items-center gap-3"><i class="ti ti-help text-primary text-lg"></i> <span class="font-medium text-foreground text-base">\u0631\u0627\u0647\u0646\u0645\u0627 \u0648 \u067E\u0634\u062A\u06CC\u0628\u0627\u0646\u06CC</span></div> <i class="ti ti-chevron-left text-muted-foreground text-sm"></i></button> <button class="w-full flex items-center justify-between py-4 hover:bg-muted transition-colors"><div class="flex items-center gap-3"><i class="ti ti-video text-purple-500 text-lg"></i> <span class="font-medium text-foreground text-base">\u0648\u06CC\u062F\u06CC\u0648\u0647\u0627\u06CC \u0622\u0645\u0648\u0632\u0634\u06CC</span></div> <i class="ti ti-chevron-left text-muted-foreground text-sm"></i></button> <button class="w-full flex items-center justify-between py-4 hover:bg-muted transition-colors"><div class="flex items-center gap-3"><i class="ti ti-info-circle text-primary text-lg"></i> <span class="font-medium text-foreground text-base">\u062F\u0631\u0628\u0627\u0631\u0647</span></div> <i class="ti ti-chevron-left text-muted-foreground text-sm"></i></button> <button class="w-full flex items-center justify-between py-4 hover:bg-muted transition-colors"><div class="flex items-center gap-3"><i class="ti ti-settings text-primary text-lg"></i> <span class="font-medium text-foreground text-base">\u062A\u0646\u0638\u06CC\u0645\u0627\u062A</span></div> <i class="ti ti-chevron-left text-muted-foreground text-sm"></i></button> <button class="w-full flex items-center justify-between py-4 hover:bg-red-500/10 transition-colors group"><div class="flex items-center gap-3"><i class="ti ti-logout text-red-500 text-lg"></i> <span class="font-medium text-red-500 text-base">\u062E\u0631\u0648\u062C \u0627\u0632 \u062D\u0633\u0627\u0628</span></div> <i class="ti ti-chevron-left text-red-500 text-sm"></i></button></div>`);
      } else {
        _push(`<div class="space-y-0 divide-y divide-border border-t border-border animate-pulse"><!--[-->`);
        ssrRenderList(13, (i) => {
          _push(`<div class="flex items-center justify-between py-4"><div class="flex items-center gap-3"><div class="w-5 h-5 bg-muted rounded"></div> <div class="h-4 w-36 bg-muted rounded"></div></div> <div class="w-3 h-3 bg-muted rounded"></div></div>`);
        });
        _push(`<!--]--></div>`);
      }
      _push(`</div></div></div></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/profile/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=index-CFZ5DGbu.mjs.map
