import { defineComponent, mergeProps, ref, computed, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrInterpolate, ssrRenderClass, ssrRenderList, ssrRenderAttr, ssrIncludeBooleanAttr, ssrRenderTeleport } from 'vue/server-renderer';
import { b as useRouter, a as useNuxtApp } from './server.mjs';
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

const _sfc_main$1 = {
  __name: "CardList",
  __ssrInlineRender: true,
  setup(__props) {
    useRouter();
    const devices = ref([]);
    const formStore = useFormStore();
    const profiles = computed(() => formStore.cards.map((card) => ({
      id: Number(card.id),
      name: card.userName || "\u0628\u062F\u0648\u0646 \u0646\u0627\u0645",
      avatar: card.avatar || "/logo.svg",
      role: card.job || "\u06A9\u0627\u0631\u0628\u0631"
    })));
    const { $axios } = useNuxtApp();
    const showToast = ref(false);
    const toastMessage = ref("");
    const toastIcon = ref("ti-alert-triangle");
    const activatedCards = ref([]);
    const loadingActivated = ref(true);
    const loadingDevices = ref(true);
    const selectedDevice = ref(null);
    const profileSelected = ref(null);
    const license = ref("");
    const success = ref(false);
    const error = ref(false);
    const errorMessage = ref("");
    const isActivating = ref(false);
    const showProfileSheet = ref(false);
    const showQRScanner = ref(false);
    ref(null);
    ref(null);
    const pageTitle = computed(() => {
      var _a;
      if (showQRScanner.value) return "\u0627\u0633\u06A9\u0646 QR \u06A9\u062F";
      if (!profileSelected.value) return "\u0641\u0639\u0627\u0644\u200C\u0633\u0627\u0632\u06CC \u0645\u062D\u0635\u0648\u0644";
      return `\u0641\u0639\u0627\u0644\u200C\u0633\u0627\u0632\u06CC ${((_a = selectedDevice.value) == null ? void 0 : _a.name) || "\u0645\u062D\u0635\u0648\u0644"}`;
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<!--[--><div class="min-h-screen bg-background flex flex-col" data-v-f7c83c41><div class="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-lg border-b border-border" data-v-f7c83c41><div class="flex items-center h-14 px-2 lg:px-6 max-w-4xl mx-auto" data-v-f7c83c41><button class="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-accent transition-colors" data-v-f7c83c41><i class="ti ti-arrow-right text-xl text-foreground" data-v-f7c83c41></i></button> <h1 class="flex-1 text-base lg:text-lg font-semibold text-foreground text-center" data-v-f7c83c41>${ssrInterpolate(pageTitle.value)}</h1> <div class="w-10" data-v-f7c83c41></div></div></div> <div class="${ssrRenderClass([profileSelected.value ? "pb-28" : "pb-8", "flex-1 pt-16 px-2 lg:px-6 max-w-4xl mx-auto w-full"])}" data-v-f7c83c41>`);
      if (!profileSelected.value) {
        _push(`<!--[--><p class="text-sm text-muted-foreground text-center mb-4 lg:mb-6" data-v-f7c83c41>
          \u0645\u062D\u0635\u0648\u0644\u06CC \u06A9\u0647 \u0645\u06CC\u200C\u062E\u0648\u0627\u0647\u06CC\u062F \u0641\u0639\u0627\u0644 \u06A9\u0646\u06CC\u062F \u0631\u0627 \u0627\u0646\u062A\u062E\u0627\u0628 \u0646\u0645\u0627\u06CC\u06CC\u062F
        </p> `);
        if (loadingDevices.value) {
          _push(`<div class="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-3" data-v-f7c83c41><!--[-->`);
          ssrRenderList(8, (n) => {
            _push(`<div class="bg-card rounded-xl p-3 lg:p-3 animate-pulse" data-v-f7c83c41><div class="w-16 h-16 lg:w-14 lg:h-14 bg-muted rounded-lg mx-auto mb-2 -mt-3" data-v-f7c83c41></div> <div class="h-3 bg-muted rounded w-16 lg:w-16 mx-auto" data-v-f7c83c41></div></div>`);
          });
          _push(`<!--]--></div>`);
        } else {
          _push(`<div class="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-3" data-v-f7c83c41><!--[-->`);
          ssrRenderList(devices.value, (device) => {
            _push(`<button class="bg-card border border-border rounded-xl p-3 lg:p-3 text-center hover:border-primary/50 hover:shadow-md transition-all active:scale-95" data-v-f7c83c41><img${ssrRenderAttr("src", device.image)}${ssrRenderAttr("alt", device.name)} class="w-16 h-16 lg:w-14 lg:h-14 object-contain mx-auto mb-1 lg:mb-2 -mt-3" data-v-f7c83c41> <span class="text-xs lg:text-xs font-medium text-foreground line-clamp-2" data-v-f7c83c41>${ssrInterpolate(device.name)}</span></button>`);
          });
          _push(`<!--]--></div>`);
        }
        _push(` `);
        if (loadingActivated.value) {
          _push(`<div class="mt-6 lg:mt-8 space-y-3" data-v-f7c83c41><div class="h-5 bg-muted rounded w-32 animate-pulse" data-v-f7c83c41></div> <!--[-->`);
          ssrRenderList(2, (n) => {
            _push(`<div class="bg-card rounded-xl p-3 lg:p-4 animate-pulse" data-v-f7c83c41><div class="flex items-center gap-3" data-v-f7c83c41><div class="w-10 h-10 lg:w-12 lg:h-12 bg-muted rounded-lg" data-v-f7c83c41></div> <div class="flex-1 space-y-2" data-v-f7c83c41><div class="h-4 bg-muted rounded w-3/4" data-v-f7c83c41></div> <div class="h-3 bg-muted rounded w-1/2" data-v-f7c83c41></div></div></div></div>`);
          });
          _push(`<!--]--></div>`);
        } else if (activatedCards.value.length) {
          _push(`<div class="mt-6 lg:mt-8" data-v-f7c83c41><div class="flex items-center gap-2 mb-3 lg:mb-4" data-v-f7c83c41><i class="ti ti-device-mobile-check text-primary" data-v-f7c83c41></i> <h3 class="font-semibold text-foreground text-sm lg:text-base" data-v-f7c83c41>\u0645\u062D\u0635\u0648\u0644\u0627\u062A \u0641\u0639\u0627\u0644</h3> <span class="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full" data-v-f7c83c41>${ssrInterpolate(activatedCards.value.length)}</span></div> <div class="space-y-2 lg:space-y-3" data-v-f7c83c41><!--[-->`);
          ssrRenderList(activatedCards.value, (card) => {
            _push(`<div class="bg-card border border-border rounded-xl p-3 lg:p-4 flex items-center gap-2 lg:gap-3" data-v-f7c83c41><img${ssrRenderAttr("src", card.image)}${ssrRenderAttr("alt", card.name)} class="w-10 h-10 lg:w-12 lg:h-12 object-contain" data-v-f7c83c41> <div class="flex-1 min-w-0" data-v-f7c83c41><h4 class="font-medium text-foreground text-xs lg:text-sm" data-v-f7c83c41>${ssrInterpolate(card.name)}</h4> <p class="text-[10px] lg:text-xs text-muted-foreground font-mono truncate" data-v-f7c83c41>${ssrInterpolate(card.license)}</p> <p class="text-[10px] lg:text-xs text-muted-foreground" data-v-f7c83c41>${ssrInterpolate(card.activatedAt)}</p></div> <button class="text-[10px] lg:text-xs text-destructive bg-destructive/10 px-2 lg:px-3 py-1 lg:py-1.5 rounded-lg hover:bg-destructive/20 transition-colors" data-v-f7c83c41>
                \u063A\u06CC\u0631\u0641\u0639\u0627\u0644
              </button></div>`);
          });
          _push(`<!--]--></div></div>`);
        } else {
          _push(`<div class="mt-6 lg:mt-8 bg-card border border-dashed border-border rounded-xl p-6 lg:p-8 text-center" data-v-f7c83c41><i class="ti ti-device-mobile-off text-3xl lg:text-4xl text-muted-foreground mb-2 lg:mb-3" data-v-f7c83c41></i> <p class="text-foreground font-medium mb-1 text-sm lg:text-base" data-v-f7c83c41>\u0645\u062D\u0635\u0648\u0644 \u0641\u0639\u0627\u0644\u06CC \u0646\u062F\u0627\u0631\u06CC\u062F</p> <p class="text-[10px] lg:text-xs text-muted-foreground" data-v-f7c83c41>\u0627\u0628\u062A\u062F\u0627 \u06CC\u06A9 \u0645\u062D\u0635\u0648\u0644 \u0631\u0627 \u0627\u0646\u062A\u062E\u0627\u0628 \u0648 \u0641\u0639\u0627\u0644 \u06A9\u0646\u06CC\u062F</p></div>`);
        }
        _push(`<!--]-->`);
      } else {
        _push(`<div class="lg:max-w-md lg:mx-auto" data-v-f7c83c41><div class="bg-card border border-border rounded-xl p-3 lg:p-4 mb-4 lg:mb-6" data-v-f7c83c41><div class="flex items-center gap-3" data-v-f7c83c41><img${ssrRenderAttr("src", selectedDevice.value.image)}${ssrRenderAttr("alt", selectedDevice.value.name)} class="w-12 h-12 lg:w-14 lg:h-14 object-contain" data-v-f7c83c41> <div class="flex-1" data-v-f7c83c41><h3 class="font-semibold text-foreground text-sm" data-v-f7c83c41>${ssrInterpolate(selectedDevice.value.name)}</h3> <div class="flex items-center gap-2 mt-1" data-v-f7c83c41><img${ssrRenderAttr("src", profileSelected.value.avatar)} class="w-5 h-5 lg:w-6 lg:h-6 rounded-full object-cover" data-v-f7c83c41> <span class="text-xs text-muted-foreground" data-v-f7c83c41>${ssrInterpolate(profileSelected.value.name)}</span></div></div> <button class="text-xs text-primary" data-v-f7c83c41>\u062A\u063A\u06CC\u06CC\u0631</button></div></div> <div class="space-y-4" data-v-f7c83c41><div data-v-f7c83c41><label class="block text-sm font-medium text-foreground mb-2" data-v-f7c83c41>\u06A9\u062F \u0641\u0639\u0627\u0644\u200C\u0633\u0627\u0632\u06CC</label> <input${ssrRenderAttr("value", license.value)} type="text" dir="ltr" placeholder="\u0645\u062B\u0627\u0644: LNK4781EPS7O" class="${ssrRenderClass([[
          success.value ? "border-green-500 bg-green-50 dark:bg-green-500/10" : error.value ? "border-red-500 bg-red-50 dark:bg-red-500/10" : "border-border"
        ], "w-full px-4 py-3.5 bg-card border rounded-xl text-foreground text-center font-mono text-lg tracking-wider focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"])}" data-v-f7c83c41></div> <button class="w-full bg-muted text-foreground py-3 rounded-xl font-medium flex items-center justify-center gap-2 hover:bg-muted/80 transition-colors border border-border" data-v-f7c83c41><i class="ti ti-qrcode text-xl" data-v-f7c83c41></i> <span data-v-f7c83c41>\u0627\u0633\u06A9\u0646 QR \u06A9\u062F \u0645\u062D\u0635\u0648\u0644</span></button> `);
        if (success.value) {
          _push(`<div class="bg-green-50 dark:bg-green-500/10 border border-green-200 dark:border-green-500/30 rounded-xl p-4 text-center" data-v-f7c83c41><i class="ti ti-circle-check text-green-600 dark:text-green-400 text-2xl mb-2" data-v-f7c83c41></i> <p class="text-green-700 dark:text-green-400 font-medium" data-v-f7c83c41>\u0645\u062D\u0635\u0648\u0644 \u0628\u0627 \u0645\u0648\u0641\u0642\u06CC\u062A \u0641\u0639\u0627\u0644 \u0634\u062F!</p></div>`);
        } else {
          _push(`<!---->`);
        }
        _push(` `);
        if (error.value) {
          _push(`<div class="bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/30 rounded-xl p-4 text-center" data-v-f7c83c41><i class="ti ti-alert-circle text-red-600 dark:text-red-400 text-2xl mb-2" data-v-f7c83c41></i> <p class="text-red-700 dark:text-red-400 font-medium" data-v-f7c83c41>${ssrInterpolate(errorMessage.value || "\u06A9\u062F \u0648\u0627\u0631\u062F \u0634\u062F\u0647 \u0646\u0627\u0645\u0639\u062A\u0628\u0631 \u0627\u0633\u062A")}</p></div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div> <div class="mt-6 text-center" data-v-f7c83c41><p class="text-xs text-muted-foreground mb-2" data-v-f7c83c41>\u0647\u0646\u0648\u0632 \u0645\u062D\u0635\u0648\u0644 \u0644\u06CC\u0646\u06A9\u0648 \u0646\u062F\u0627\u0631\u06CC\u062F\u061F</p> <a href="https://linkutag.com/shop" target="_blank" class="text-primary text-sm font-medium hover:underline" data-v-f7c83c41>
              \u062E\u0631\u06CC\u062F \u0627\u0632 \u0641\u0631\u0648\u0634\u06AF\u0627\u0647 \u0644\u06CC\u0646\u06A9\u0648 \u2190
            </a></div></div>`);
      }
      _push(`</div> `);
      if (profileSelected.value) {
        _push(`<div class="fixed bottom-0 left-0 right-0 bg-background/95 backdrop-blur-lg border-t border-border p-4 safe-area-bottom" data-v-f7c83c41><div class="max-w-4xl mx-auto lg:max-w-md" data-v-f7c83c41><button${ssrIncludeBooleanAttr(!license.value || isActivating.value) ? " disabled" : ""} class="w-full bg-primary text-primary-foreground py-4 rounded-xl font-semibold flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primary/90 transition-colors shadow-lg" data-v-f7c83c41>`);
        if (isActivating.value) {
          _push(`<!--[--><div class="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" data-v-f7c83c41></div> <span data-v-f7c83c41>\u062F\u0631 \u062D\u0627\u0644 \u0641\u0639\u0627\u0644\u200C\u0633\u0627\u0632\u06CC...</span><!--]-->`);
        } else {
          _push(`<!--[--><i class="ti ti-device-mobile-check text-xl" data-v-f7c83c41></i> <span data-v-f7c83c41>\u0641\u0639\u0627\u0644\u200C\u0633\u0627\u0632\u06CC \u0645\u062D\u0635\u0648\u0644</span><!--]-->`);
        }
        _push(`</button></div></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(` `);
      ssrRenderTeleport(_push, (_push2) => {
        var _a, _b, _c;
        if (showProfileSheet.value) {
          _push2(`<div class="fixed inset-0 z-[9998]" data-v-f7c83c41><div class="absolute inset-0 bg-black/50 backdrop-blur-sm" data-v-f7c83c41></div> <div class="absolute bottom-0 left-0 right-0 bg-background rounded-t-3xl max-h-[80vh] overflow-hidden lg:bottom-auto lg:top-1/2 lg:left-1/2 lg:-translate-x-1/2 lg:-translate-y-1/2 lg:rounded-2xl lg:max-w-md lg:w-full" data-v-f7c83c41><div class="lg:hidden flex justify-center py-3" data-v-f7c83c41><div class="w-10 h-1 bg-muted-foreground/30 rounded-full" data-v-f7c83c41></div></div> <div class="px-4 pb-3 lg:p-4 lg:border-b lg:border-border" data-v-f7c83c41><div class="flex items-center justify-between" data-v-f7c83c41><h3 class="text-lg font-bold text-foreground" data-v-f7c83c41>\u0627\u0646\u062A\u062E\u0627\u0628 \u067E\u0631\u0648\u0641\u0627\u06CC\u0644</h3> <button class="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-muted" data-v-f7c83c41><i class="ti ti-x text-lg text-muted-foreground" data-v-f7c83c41></i></button></div> <p class="text-xs text-muted-foreground mt-1" data-v-f7c83c41>\u06A9\u062F\u0627\u0645 \u067E\u0631\u0648\u0641\u0627\u06CC\u0644 \u0628\u0647 \u0627\u06CC\u0646 \u0645\u062D\u0635\u0648\u0644 \u0645\u062A\u0635\u0644 \u0634\u0648\u062F\u061F</p></div> <div class="px-4 py-3 border-y border-border bg-muted/30" data-v-f7c83c41><div class="flex items-center gap-3" data-v-f7c83c41><img${ssrRenderAttr("src", (_a = selectedDevice.value) == null ? void 0 : _a.image)}${ssrRenderAttr("alt", (_b = selectedDevice.value) == null ? void 0 : _b.name)} class="w-12 h-12 object-contain" data-v-f7c83c41> <div data-v-f7c83c41><h4 class="font-semibold text-foreground text-sm" data-v-f7c83c41>${ssrInterpolate((_c = selectedDevice.value) == null ? void 0 : _c.name)}</h4> <p class="text-xs text-muted-foreground" data-v-f7c83c41>\u0645\u062D\u0635\u0648\u0644 \u0627\u0646\u062A\u062E\u0627\u0628 \u0634\u062F\u0647</p></div></div></div> <div class="px-4 py-3 max-h-[50vh] overflow-y-auto" data-v-f7c83c41>`);
          if (!profiles.value || profiles.value.length === 0) {
            _push2(`<div class="text-center py-8" data-v-f7c83c41><i class="ti ti-user-off text-3xl text-muted-foreground mb-2" data-v-f7c83c41></i> <p class="text-muted-foreground text-sm" data-v-f7c83c41>\u067E\u0631\u0648\u0641\u0627\u06CC\u0644\u06CC \u06CC\u0627\u0641\u062A \u0646\u0634\u062F</p></div>`);
          } else {
            _push2(`<div class="space-y-2" data-v-f7c83c41><!--[-->`);
            ssrRenderList(profiles.value, (profile) => {
              _push2(`<button class="w-full bg-card border border-border rounded-xl p-3 flex items-center gap-3 hover:border-primary/50 hover:bg-accent/50 transition-all active:scale-[0.98]" data-v-f7c83c41><img${ssrRenderAttr("src", profile.avatar)}${ssrRenderAttr("alt", profile.name)} class="w-10 h-10 rounded-full object-cover border-2 border-border" data-v-f7c83c41> <div class="flex-1 text-right" data-v-f7c83c41><h4 class="font-medium text-foreground text-sm" data-v-f7c83c41>${ssrInterpolate(profile.name)}</h4> <p class="text-xs text-muted-foreground" data-v-f7c83c41>${ssrInterpolate(profile.role)}</p></div> <i class="ti ti-chevron-left text-muted-foreground" data-v-f7c83c41></i></button>`);
            });
            _push2(`<!--]--></div>`);
          }
          _push2(`</div> <div class="p-4 border-t border-border" data-v-f7c83c41><button class="w-full py-3 rounded-xl border border-border text-foreground font-medium hover:bg-muted transition-colors" data-v-f7c83c41>
                \u0627\u0646\u0635\u0631\u0627\u0641
              </button></div></div></div>`);
        } else {
          _push2(`<!---->`);
        }
      }, "body", false, _parent);
      _push(` `);
      ssrRenderTeleport(_push, (_push2) => {
        if (showQRScanner.value) {
          _push2(`<div class="fixed inset-0 z-[9999] bg-black flex flex-col" data-v-f7c83c41><div class="flex items-center justify-between p-4 bg-gradient-to-b from-black/80 to-transparent absolute top-0 left-0 right-0 z-10" data-v-f7c83c41><button class="w-10 h-10 rounded-full bg-white/10 backdrop-blur-lg flex items-center justify-center" data-v-f7c83c41><i class="ti ti-x text-white text-xl" data-v-f7c83c41></i></button> <span class="text-white font-medium" data-v-f7c83c41>\u0627\u0633\u06A9\u0646 QR \u06A9\u062F</span> <button class="w-10 h-10 rounded-full bg-white/10 backdrop-blur-lg flex items-center justify-center" title="\u0627\u0646\u062A\u062E\u0627\u0628 \u0627\u0632 \u06AF\u0627\u0644\u0631\u06CC" data-v-f7c83c41><i class="ti ti-photo text-white text-xl" data-v-f7c83c41></i></button></div> <div class="flex-1 flex items-center justify-center p-6" data-v-f7c83c41><div class="relative w-full max-w-xs aspect-square" data-v-f7c83c41><video class="w-full h-full object-cover rounded-3xl" playsinline autoplay muted data-v-f7c83c41></video> <div class="absolute inset-4 border-2 border-white/30 rounded-2xl pointer-events-none" data-v-f7c83c41><div class="absolute -top-0.5 -left-0.5 w-8 h-8 border-t-4 border-l-4 border-primary rounded-tl-xl" data-v-f7c83c41></div> <div class="absolute -top-0.5 -right-0.5 w-8 h-8 border-t-4 border-r-4 border-primary rounded-tr-xl" data-v-f7c83c41></div> <div class="absolute -bottom-0.5 -left-0.5 w-8 h-8 border-b-4 border-l-4 border-primary rounded-bl-xl" data-v-f7c83c41></div> <div class="absolute -bottom-0.5 -right-0.5 w-8 h-8 border-b-4 border-r-4 border-primary rounded-br-xl" data-v-f7c83c41></div></div> <div class="absolute left-6 right-6 h-0.5 bg-gradient-to-r from-transparent via-primary to-transparent animate-scan" data-v-f7c83c41></div></div></div> <div class="p-6 pb-10 text-center bg-gradient-to-t from-black/80 to-transparent" data-v-f7c83c41><p class="text-white font-medium mb-2" data-v-f7c83c41>QR \u06A9\u062F \u0645\u062D\u0635\u0648\u0644 \u0631\u0627 \u0627\u0633\u06A9\u0646 \u06A9\u0646\u06CC\u062F</p> <p class="text-white/60 text-sm" data-v-f7c83c41>\u06A9\u062F \u0631\u0648\u06CC \u0628\u0633\u062A\u0647\u200C\u0628\u0646\u062F\u06CC \u06CC\u0627 \u067E\u0634\u062A \u0645\u062D\u0635\u0648\u0644 \u0642\u0631\u0627\u0631 \u062F\u0627\u0631\u062F</p></div> <input type="file" accept="image/*" class="hidden" data-v-f7c83c41></div>`);
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
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/UserDashboard/main/Activate/CardList.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const CardList = /* @__PURE__ */ _export_sfc(_sfc_main$1, [["__scopeId", "data-v-f7c83c41"]]);
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "index",
  __ssrInlineRender: true,
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "w-full min-h-screen" }, _attrs))}><div class="p-4">`);
      _push(ssrRenderComponent(CardList, null, null, _parent));
      _push(`</div></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/dashboard/activate/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=index-DGn97eut.mjs.map
