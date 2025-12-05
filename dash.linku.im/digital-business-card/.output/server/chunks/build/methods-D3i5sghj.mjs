import { ssrInterpolate, ssrRenderAttr, ssrRenderTeleport, ssrIncludeBooleanAttr, ssrRenderList, ssrRenderComponent } from 'vue/server-renderer';
import { computed, ref, useSSRContext } from 'vue';
import { b as useRouter, f as useRoute, a as useNuxtApp } from './server.mjs';
import { I as InfoToast } from './InfoToast-DdxwJ7kO.mjs';
import { u as useFormStore } from './form-CUJQskNk.mjs';
import { _ as _export_sfc } from './_plugin-vue_export-helper-1tPrXgE0.mjs';
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
import 'pinia';
import 'vue-router';
import 'axios';

const _sfc_main = {
  __name: "methods",
  __ssrInlineRender: true,
  setup(__props) {
    useRouter();
    useRoute();
    const { $axios } = useNuxtApp();
    const formStore = useFormStore();
    const profiles = computed(() => formStore.cards.map((card) => ({
      id: Number(card.id),
      name: card.userName || "\u0628\u062F\u0648\u0646 \u0646\u0627\u0645",
      avatar: card.avatar || "/logo.svg",
      role: card.job || "\u06A9\u0627\u0631\u0628\u0631"
    })));
    const showToast = ref(false);
    const toastMessage = ref("");
    const toastIcon = ref("ti-alert-triangle");
    const selectedDevice = ref(null);
    const profileSelected = ref(null);
    const license = ref("");
    const success = ref(false);
    const error = ref(false);
    const errorMessage = ref("");
    const isActivating = ref(false);
    const showLicenseSheet = ref(false);
    const showProfileSheet = ref(false);
    const showQRScanner = ref(false);
    ref(null);
    ref(null);
    return (_ctx, _push, _parent, _attrs) => {
      var _a, _b, _c, _d, _e, _f;
      _push(`<!--[--><div class="min-h-screen bg-background flex flex-col" data-v-90f1c6e3><div class="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-lg border-b border-border" data-v-90f1c6e3><div class="flex items-center h-14 px-2 lg:px-6 max-w-4xl mx-auto" data-v-90f1c6e3><button class="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-accent transition-colors" data-v-90f1c6e3><i class="ti ti-arrow-right text-xl text-foreground" data-v-90f1c6e3></i></button> <h1 class="flex-1 text-base lg:text-lg font-semibold text-foreground text-center" data-v-90f1c6e3>
          \u0641\u0639\u0627\u0644\u200C\u0633\u0627\u0632\u06CC ${ssrInterpolate(((_a = selectedDevice.value) == null ? void 0 : _a.name) || "\u0645\u062D\u0635\u0648\u0644")}</h1> <div class="w-10" data-v-90f1c6e3></div></div></div> <div class="flex-1 pt-16 px-2 lg:px-6 max-w-4xl mx-auto w-full pb-8" data-v-90f1c6e3><div class="lg:max-w-md lg:mx-auto" data-v-90f1c6e3><div class="bg-card border border-border rounded-2xl p-4 mb-6" data-v-90f1c6e3><div class="flex items-center gap-3" data-v-90f1c6e3><img${ssrRenderAttr("src", (_b = selectedDevice.value) == null ? void 0 : _b.image)}${ssrRenderAttr("alt", (_c = selectedDevice.value) == null ? void 0 : _c.name)} class="w-14 h-14 lg:w-16 lg:h-16 object-contain" data-v-90f1c6e3> <div class="flex-1" data-v-90f1c6e3><h3 class="font-semibold text-foreground text-base" data-v-90f1c6e3>${ssrInterpolate((_d = selectedDevice.value) == null ? void 0 : _d.name)}</h3> <div class="flex items-center gap-2 mt-1.5" data-v-90f1c6e3><img${ssrRenderAttr("src", (_e = profileSelected.value) == null ? void 0 : _e.avatar)} class="w-6 h-6 rounded-full object-cover" data-v-90f1c6e3> <span class="text-sm text-muted-foreground" data-v-90f1c6e3>${ssrInterpolate((_f = profileSelected.value) == null ? void 0 : _f.name)}</span></div></div> <button class="text-xs text-primary font-medium px-3 py-1.5 rounded-lg hover:bg-primary/10 transition-colors" data-v-90f1c6e3>
              \u062A\u063A\u06CC\u06CC\u0631
            </button></div></div> `);
      if (success.value) {
        _push(`<div class="mb-6 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-6 text-center shadow-lg" data-v-90f1c6e3><div class="w-16 h-16 mx-auto mb-4 bg-white/20 rounded-full flex items-center justify-center" data-v-90f1c6e3><i class="ti ti-circle-check text-white text-4xl" data-v-90f1c6e3></i></div> <p class="text-white font-bold text-lg mb-2" data-v-90f1c6e3>\u0641\u0639\u0627\u0644\u200C\u0633\u0627\u0632\u06CC \u0645\u0648\u0641\u0642!</p> <p class="text-white/90 text-sm" data-v-90f1c6e3>\u0645\u062D\u0635\u0648\u0644 \u0628\u0647 \u067E\u0631\u0648\u0641\u0627\u06CC\u0644 \u0634\u0645\u0627 \u0645\u062A\u0635\u0644 \u0634\u062F</p> <button class="mt-4 bg-white/20 hover:bg-white/30 text-white px-6 py-2 rounded-lg transition-colors" data-v-90f1c6e3>
            \u0628\u0627\u0632\u06AF\u0634\u062A \u0628\u0647 \u062F\u0627\u0634\u0628\u0648\u0631\u062F
          </button></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(` `);
      if (error.value) {
        _push(`<div class="mb-6 bg-gradient-to-br from-red-500 to-red-600 rounded-2xl p-6 text-center shadow-lg" data-v-90f1c6e3><div class="w-16 h-16 mx-auto mb-4 bg-white/20 rounded-full flex items-center justify-center" data-v-90f1c6e3><i class="ti ti-alert-circle text-white text-4xl" data-v-90f1c6e3></i></div> <p class="text-white font-bold text-lg mb-2" data-v-90f1c6e3>\u062E\u0637\u0627 \u062F\u0631 \u0641\u0639\u0627\u0644\u200C\u0633\u0627\u0632\u06CC</p> <p class="text-white/90 text-sm" data-v-90f1c6e3>${ssrInterpolate(errorMessage.value || "\u06A9\u062F \u0648\u0627\u0631\u062F \u0634\u062F\u0647 \u0646\u0627\u0645\u0639\u062A\u0628\u0631 \u0627\u0633\u062A")}</p></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(` <div class="space-y-4" data-v-90f1c6e3><h3 class="text-base font-semibold text-foreground text-center mb-6" data-v-90f1c6e3>\u0631\u0648\u0634 \u0641\u0639\u0627\u0644\u200C\u0633\u0627\u0632\u06CC \u0631\u0627 \u0627\u0646\u062A\u062E\u0627\u0628 \u06A9\u0646\u06CC\u062F</h3> <button class="w-full bg-gradient-to-br from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all active:scale-[0.98] group" data-v-90f1c6e3><div class="flex items-center gap-4" data-v-90f1c6e3><div class="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform" data-v-90f1c6e3><i class="ti ti-key text-3xl" data-v-90f1c6e3></i></div> <div class="flex-1 text-right" data-v-90f1c6e3><h4 class="font-bold text-lg mb-1" data-v-90f1c6e3>\u06A9\u062F \u0641\u0639\u0627\u0644\u200C\u0633\u0627\u0632\u06CC \u062F\u0627\u0631\u0645</h4> <p class="text-sm text-white/80" data-v-90f1c6e3>\u06A9\u062F \u0631\u0648\u06CC \u0628\u0633\u062A\u0647\u200C\u0628\u0646\u062F\u06CC \u0645\u062D\u0635\u0648\u0644 \u0631\u0627 \u0648\u0627\u0631\u062F \u06A9\u0646\u06CC\u062F</p></div> <i class="ti ti-chevron-left text-xl opacity-50" data-v-90f1c6e3></i></div></button> <button class="w-full bg-gradient-to-br from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all active:scale-[0.98] group" data-v-90f1c6e3><div class="flex items-center gap-4" data-v-90f1c6e3><div class="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform" data-v-90f1c6e3><i class="ti ti-qrcode text-3xl" data-v-90f1c6e3></i></div> <div class="flex-1 text-right" data-v-90f1c6e3><h4 class="font-bold text-lg mb-1" data-v-90f1c6e3>\u0645\u062D\u0635\u0648\u0644 \u0631\u0648 \u0627\u0633\u06A9\u0646 \u0645\u06CC\u200C\u06A9\u0646\u0645</h4> <p class="text-sm text-white/80" data-v-90f1c6e3>QR \u06A9\u062F \u0631\u0648\u06CC \u0645\u062D\u0635\u0648\u0644 \u0631\u0627 \u0627\u0633\u06A9\u0646 \u06A9\u0646\u06CC\u062F</p></div> <i class="ti ti-chevron-left text-xl opacity-50" data-v-90f1c6e3></i></div></button></div> <div class="mt-8 text-center bg-muted/50 rounded-2xl p-6" data-v-90f1c6e3><i class="ti ti-shopping-bag text-2xl text-muted-foreground mb-2" data-v-90f1c6e3></i> <p class="text-sm text-muted-foreground mb-3" data-v-90f1c6e3>\u0647\u0646\u0648\u0632 \u0645\u062D\u0635\u0648\u0644 \u0644\u06CC\u0646\u06A9\u0648 \u0646\u062F\u0627\u0631\u06CC\u062F\u061F</p> <a href="https://linkutag.com/shop" target="_blank" class="inline-flex items-center gap-2 text-primary text-sm font-bold hover:underline" data-v-90f1c6e3><span data-v-90f1c6e3>\u062E\u0631\u06CC\u062F \u0627\u0632 \u0641\u0631\u0648\u0634\u06AF\u0627\u0647 \u0644\u06CC\u0646\u06A9\u0648</span> <i class="ti ti-arrow-left text-xs" data-v-90f1c6e3></i></a></div></div></div> `);
      ssrRenderTeleport(_push, (_push2) => {
        if (showLicenseSheet.value) {
          _push2(`<div class="fixed inset-0 z-[9998]" data-v-90f1c6e3><div class="absolute inset-0 bg-black/50 backdrop-blur-sm" data-v-90f1c6e3></div> <div class="absolute bottom-0 left-0 right-0 bg-background rounded-t-3xl overflow-hidden lg:bottom-auto lg:top-1/2 lg:left-1/2 lg:-translate-x-1/2 lg:-translate-y-1/2 lg:rounded-2xl lg:max-w-md lg:w-full" data-v-90f1c6e3><div class="lg:hidden flex justify-center py-3" data-v-90f1c6e3><div class="w-10 h-1 bg-muted-foreground/30 rounded-full" data-v-90f1c6e3></div></div> <div class="px-6 pb-4 lg:pt-6" data-v-90f1c6e3><div class="flex items-center justify-between mb-2" data-v-90f1c6e3><h3 class="text-xl font-bold text-foreground" data-v-90f1c6e3>\u06A9\u062F \u0641\u0639\u0627\u0644\u200C\u0633\u0627\u0632\u06CC</h3> <button class="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-muted transition-colors" data-v-90f1c6e3><i class="ti ti-x text-xl text-muted-foreground" data-v-90f1c6e3></i></button></div> <p class="text-sm text-muted-foreground" data-v-90f1c6e3>\u06A9\u062F \u0631\u0648\u06CC \u0628\u0633\u062A\u0647\u200C\u0628\u0646\u062F\u06CC \u0645\u062D\u0635\u0648\u0644 \u0631\u0627 \u0648\u0627\u0631\u062F \u06A9\u0646\u06CC\u062F</p></div> <div class="px-6 pb-6 space-y-4" data-v-90f1c6e3><div data-v-90f1c6e3><label class="block text-sm font-medium text-foreground mb-2" data-v-90f1c6e3>\u06A9\u062F \u0641\u0639\u0627\u0644\u200C\u0633\u0627\u0632\u06CC \u0645\u062D\u0635\u0648\u0644</label> <input${ssrRenderAttr("value", license.value)} type="text" dir="ltr" placeholder="LNK4781EPS7O" class="w-full px-4 py-4 bg-muted border-2 border-border rounded-xl text-foreground text-center font-mono text-lg tracking-wider focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all uppercase placeholder:lowercase placeholder:text-muted-foreground/50" data-v-90f1c6e3> <p class="text-xs text-muted-foreground mt-2 text-center" data-v-90f1c6e3>\u0645\u0639\u0645\u0648\u0644\u0627\u064B \u06F8 \u062A\u0627 \u06F1\u06F2 \u06A9\u0627\u0631\u0627\u06A9\u062A\u0631 \u0627\u0646\u06AF\u0644\u06CC\u0633\u06CC</p></div> <button${ssrIncludeBooleanAttr(!license.value || isActivating.value) ? " disabled" : ""} class="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 disabled:from-gray-400 disabled:to-gray-500 text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 disabled:cursor-not-allowed transition-all shadow-lg disabled:shadow-none" data-v-90f1c6e3>`);
          if (isActivating.value) {
            _push2(`<!--[--><div class="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" data-v-90f1c6e3></div> <span data-v-90f1c6e3>\u062F\u0631 \u062D\u0627\u0644 \u0641\u0639\u0627\u0644\u200C\u0633\u0627\u0632\u06CC...</span><!--]-->`);
          } else {
            _push2(`<!--[--><i class="ti ti-check text-xl" data-v-90f1c6e3></i> <span data-v-90f1c6e3>\u062A\u0627\u06CC\u06CC\u062F \u0648 \u0641\u0639\u0627\u0644\u200C\u0633\u0627\u0632\u06CC</span><!--]-->`);
          }
          _push2(`</button> <button class="w-full py-3 rounded-xl border-2 border-border text-foreground font-medium hover:bg-muted transition-colors" data-v-90f1c6e3>
                \u0627\u0646\u0635\u0631\u0627\u0641
              </button></div></div></div>`);
        } else {
          _push2(`<!---->`);
        }
      }, "body", false, _parent);
      _push(` `);
      ssrRenderTeleport(_push, (_push2) => {
        var _a2, _b2, _c2;
        if (showProfileSheet.value) {
          _push2(`<div class="fixed inset-0 z-[9998]" data-v-90f1c6e3><div class="absolute inset-0 bg-black/50 backdrop-blur-sm" data-v-90f1c6e3></div> <div class="absolute bottom-0 left-0 right-0 bg-background rounded-t-3xl max-h-[80vh] overflow-hidden lg:bottom-auto lg:top-1/2 lg:left-1/2 lg:-translate-x-1/2 lg:-translate-y-1/2 lg:rounded-2xl lg:max-w-md lg:w-full" data-v-90f1c6e3><div class="lg:hidden flex justify-center py-3" data-v-90f1c6e3><div class="w-10 h-1 bg-muted-foreground/30 rounded-full" data-v-90f1c6e3></div></div> <div class="px-4 pb-3 lg:p-4 lg:border-b lg:border-border" data-v-90f1c6e3><div class="flex items-center justify-between" data-v-90f1c6e3><h3 class="text-lg font-bold text-foreground" data-v-90f1c6e3>\u0627\u0646\u062A\u062E\u0627\u0628 \u067E\u0631\u0648\u0641\u0627\u06CC\u0644</h3> <button class="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-muted" data-v-90f1c6e3><i class="ti ti-x text-lg text-muted-foreground" data-v-90f1c6e3></i></button></div> <p class="text-xs text-muted-foreground mt-1" data-v-90f1c6e3>\u06A9\u062F\u0627\u0645 \u067E\u0631\u0648\u0641\u0627\u06CC\u0644 \u0628\u0647 \u0627\u06CC\u0646 \u0645\u062D\u0635\u0648\u0644 \u0645\u062A\u0635\u0644 \u0634\u0648\u062F\u061F</p></div> <div class="px-4 py-3 border-y border-border bg-muted/30" data-v-90f1c6e3><div class="flex items-center gap-3" data-v-90f1c6e3><img${ssrRenderAttr("src", (_a2 = selectedDevice.value) == null ? void 0 : _a2.image)}${ssrRenderAttr("alt", (_b2 = selectedDevice.value) == null ? void 0 : _b2.name)} class="w-12 h-12 object-contain" data-v-90f1c6e3> <div data-v-90f1c6e3><h4 class="font-semibold text-foreground text-sm" data-v-90f1c6e3>${ssrInterpolate((_c2 = selectedDevice.value) == null ? void 0 : _c2.name)}</h4> <p class="text-xs text-muted-foreground" data-v-90f1c6e3>\u0645\u062D\u0635\u0648\u0644 \u0627\u0646\u062A\u062E\u0627\u0628 \u0634\u062F\u0647</p></div></div></div> <div class="px-4 py-3 max-h-[50vh] overflow-y-auto" data-v-90f1c6e3>`);
          if (!profiles.value || profiles.value.length === 0) {
            _push2(`<div class="text-center py-8" data-v-90f1c6e3><i class="ti ti-user-off text-3xl text-muted-foreground mb-2" data-v-90f1c6e3></i> <p class="text-muted-foreground text-sm" data-v-90f1c6e3>\u067E\u0631\u0648\u0641\u0627\u06CC\u0644\u06CC \u06CC\u0627\u0641\u062A \u0646\u0634\u062F</p></div>`);
          } else {
            _push2(`<div class="space-y-2" data-v-90f1c6e3><!--[-->`);
            ssrRenderList(profiles.value, (profile) => {
              _push2(`<button class="w-full bg-card border border-border rounded-xl p-3 flex items-center gap-3 hover:border-primary/50 hover:bg-accent/50 transition-all active:scale-[0.98]" data-v-90f1c6e3><img${ssrRenderAttr("src", profile.avatar)}${ssrRenderAttr("alt", profile.name)} class="w-10 h-10 rounded-full object-cover border-2 border-border" data-v-90f1c6e3> <div class="flex-1 text-right" data-v-90f1c6e3><h4 class="font-medium text-foreground text-sm" data-v-90f1c6e3>${ssrInterpolate(profile.name)}</h4> <p class="text-xs text-muted-foreground" data-v-90f1c6e3>${ssrInterpolate(profile.role)}</p></div> <i class="ti ti-chevron-left text-muted-foreground" data-v-90f1c6e3></i></button>`);
            });
            _push2(`<!--]--></div>`);
          }
          _push2(`</div> <div class="p-4 border-t border-border" data-v-90f1c6e3><button class="w-full py-3 rounded-xl border border-border text-foreground font-medium hover:bg-muted transition-colors" data-v-90f1c6e3>
                \u0627\u0646\u0635\u0631\u0627\u0641
              </button></div></div></div>`);
        } else {
          _push2(`<!---->`);
        }
      }, "body", false, _parent);
      _push(` `);
      ssrRenderTeleport(_push, (_push2) => {
        if (showQRScanner.value) {
          _push2(`<div class="fixed inset-0 z-[9999] bg-black flex flex-col" data-v-90f1c6e3><div class="flex items-center justify-between p-4 bg-gradient-to-b from-black/80 to-transparent absolute top-0 left-0 right-0 z-10" data-v-90f1c6e3><button class="w-10 h-10 rounded-full bg-white/10 backdrop-blur-lg flex items-center justify-center" data-v-90f1c6e3><i class="ti ti-x text-white text-xl" data-v-90f1c6e3></i></button> <span class="text-white font-medium" data-v-90f1c6e3>\u0627\u0633\u06A9\u0646 QR \u06A9\u062F</span> <button class="w-10 h-10 rounded-full bg-white/10 backdrop-blur-lg flex items-center justify-center" data-v-90f1c6e3><i class="ti ti-photo text-white text-xl" data-v-90f1c6e3></i></button></div> <div class="flex-1 flex items-center justify-center p-6" data-v-90f1c6e3><div class="relative w-full max-w-xs aspect-square" data-v-90f1c6e3><video class="w-full h-full object-cover rounded-3xl" playsinline autoplay muted data-v-90f1c6e3></video> <div class="absolute inset-4 border-2 border-white/30 rounded-2xl pointer-events-none" data-v-90f1c6e3><div class="absolute -top-0.5 -left-0.5 w-8 h-8 border-t-4 border-l-4 border-primary rounded-tl-xl" data-v-90f1c6e3></div> <div class="absolute -top-0.5 -right-0.5 w-8 h-8 border-t-4 border-r-4 border-primary rounded-tr-xl" data-v-90f1c6e3></div> <div class="absolute -bottom-0.5 -left-0.5 w-8 h-8 border-b-4 border-l-4 border-primary rounded-bl-xl" data-v-90f1c6e3></div> <div class="absolute -bottom-0.5 -right-0.5 w-8 h-8 border-b-4 border-r-4 border-primary rounded-br-xl" data-v-90f1c6e3></div></div> <div class="absolute left-6 right-6 h-0.5 bg-gradient-to-r from-transparent via-primary to-transparent animate-scan" data-v-90f1c6e3></div></div></div> <div class="p-6 pb-10 text-center bg-gradient-to-t from-black/80 to-transparent" data-v-90f1c6e3><p class="text-white font-medium mb-2" data-v-90f1c6e3>QR \u06A9\u062F \u0645\u062D\u0635\u0648\u0644 \u0631\u0627 \u0627\u0633\u06A9\u0646 \u06A9\u0646\u06CC\u062F</p> <p class="text-white/60 text-sm" data-v-90f1c6e3>\u06A9\u062F \u0631\u0648\u06CC \u0628\u0633\u062A\u0647\u200C\u0628\u0646\u062F\u06CC \u06CC\u0627 \u067E\u0634\u062A \u0645\u062D\u0635\u0648\u0644 \u0642\u0631\u0627\u0631 \u062F\u0627\u0631\u062F</p></div> <input type="file" accept="image/*" class="hidden" data-v-90f1c6e3></div>`);
        } else {
          _push2(`<!---->`);
        }
      }, "body", false, _parent);
      _push(`</div> `);
      _push(ssrRenderComponent(InfoToast, {
        visible: showToast.value,
        message: toastMessage.value,
        icon: toastIcon.value
      }, null, _parent));
      _push(`<!--]-->`);
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/dashboard/activate/methods.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const methods = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-90f1c6e3"]]);

export { methods as default };
//# sourceMappingURL=methods-D3i5sghj.mjs.map
