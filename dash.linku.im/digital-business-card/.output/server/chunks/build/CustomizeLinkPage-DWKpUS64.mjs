import { _ as __nuxt_component_0 } from './BottomSheet-DZASh2SV.mjs';
import { ref, computed, watch, unref, isRef, withCtx, createVNode, createTextVNode, withDirectives, vModelText, createBlock, openBlock, Fragment, renderList, toDisplayString, createCommentVNode, useSSRContext } from 'vue';
import { ssrInterpolate, ssrRenderAttr, ssrRenderClass, ssrIncludeBooleanAttr, ssrLooseContain, ssrRenderList, ssrRenderComponent } from 'vue/server-renderer';
import { I as InfoToast } from './InfoToast-DdxwJ7kO.mjs';
import { u as useUserStore } from './user-D1YL8aKq.mjs';
import { d as defaultCountry, c as countries } from './countries-BosuECVZ.mjs';
import { b as useRouter, a as useNuxtApp } from './server.mjs';
import { _ as _export_sfc } from './_plugin-vue_export-helper-1tPrXgE0.mjs';
import 'pinia';
import './form-CUJQskNk.mjs';
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

const _sfc_main = {
  __name: "CustomizeLinkPage",
  __ssrInlineRender: true,
  setup(__props) {
    useRouter();
    const { $axios } = useNuxtApp();
    const userStore = useUserStore();
    const form = ref({
      username: "",
      email: "",
      phone: "",
      countryCode: "",
      removeBranding: false
    });
    const originalForm = ref({});
    const invalidUsername = ref(false);
    ref("");
    const emailError = ref("");
    const usernameStatus = ref(null);
    const showPhoneModal = ref(false);
    const showUpgradeModal = ref(false);
    const showCountryPicker = ref(false);
    const selectedCountry = ref({ ...defaultCountry });
    const countrySearchQuery = ref("");
    const otp = ref(["", "", "", ""]);
    const otpError = ref(false);
    const otpSuccess = ref(false);
    ref([]);
    const timer = ref(120);
    ref(false);
    const showToast = ref(false);
    const toastMessage = ref("");
    const toastIcon = ref("ti-alert-triangle");
    const isLoading = ref(false);
    const isProUser = computed(() => {
      var _a;
      return (_a = userStore.user) == null ? void 0 : _a.isPro;
    });
    const hasChanges = computed(() => {
      return form.value.username !== originalForm.value.username || form.value.email !== originalForm.value.email || form.value.phone !== originalForm.value.phone || form.value.removeBranding !== originalForm.value.removeBranding;
    });
    const currentFullLink = computed(() => `linku.im/${form.value.username || "username"}`);
    const filteredCountries = computed(() => {
      if (!countrySearchQuery.value) return countries;
      const query = countrySearchQuery.value.toLowerCase();
      return countries.filter(
        (c) => c.name.includes(query) || c.nameEn.toLowerCase().includes(query) || c.dialCode.includes(query)
      );
    });
    watch(() => userStore.user, (user) => {
      if (!user) return;
      form.value.username = user.username || "";
      form.value.email = user.email || "";
      form.value.phone = user.phone || "";
      form.value.countryCode = user.countryCode || "";
      form.value.removeBranding = !!user.removeBranding;
      originalForm.value = { ...form.value };
      if (user.countryCode) {
        const dialCode = user.countryCode.startsWith("+") ? user.countryCode : "+" + user.countryCode;
        const country = countries.find((c) => c.dialCode === dialCode);
        if (country) {
          selectedCountry.value = country;
        }
      }
    }, { immediate: true });
    function selectCountry(country) {
      selectedCountry.value = country;
      form.value.countryCode = country.dialCode;
      showCountryPicker.value = false;
      countrySearchQuery.value = "";
    }
    function formatTime(seconds) {
      const min = Math.floor(seconds / 60);
      const sec = seconds % 60;
      return `${min}:${sec < 10 ? "0" : ""}${sec}`;
    }
    return (_ctx, _push, _parent, _attrs) => {
      const _component_UiBottomSheet = __nuxt_component_0;
      _push(`<!--[--><div class="min-h-screen bg-background" data-v-47403ddd><div class="fixed top-0 left-0 right-0 w-full z-50 bg-card/95 backdrop-blur-lg border-b border-border safe-area-top" data-v-47403ddd><div class="flex items-center justify-between px-3 py-2.5" data-v-47403ddd><div class="flex items-center gap-3" data-v-47403ddd><button class="w-9 h-9 rounded-full bg-muted flex items-center justify-center text-foreground hover:bg-primary/10 hover:text-primary transition-all duration-200" data-v-47403ddd><i class="ti ti-arrow-right text-lg" data-v-47403ddd></i></button> <h1 class="text-base font-semibold text-foreground" data-v-47403ddd>\u062A\u0646\u0638\u06CC\u0645\u0627\u062A \u062D\u0633\u0627\u0628</h1></div></div></div> <div class="pt-14 pb-24 px-3" data-v-47403ddd><div class="space-y-3" data-v-47403ddd><div class="bg-card rounded-2xl p-4 shadow-sm border border-border/50" data-v-47403ddd><h3 class="text-sm font-semibold text-foreground mb-3 flex items-center" data-v-47403ddd><i class="ti ti-link text-primary text-lg ml-2" data-v-47403ddd></i>
            \u0622\u062F\u0631\u0633 \u067E\u0631\u0648\u0641\u0627\u06CC\u0644
          </h3> <div class="bg-muted/30 rounded-xl p-3 border border-border mb-3" data-v-47403ddd><div class="flex items-center justify-between" data-v-47403ddd><div class="flex-1 min-w-0" data-v-47403ddd><div class="text-xs text-muted-foreground mb-0.5" data-v-47403ddd>\u0644\u06CC\u0646\u06A9 \u0641\u0639\u0644\u06CC:</div> <div class="text-sm text-foreground font-mono truncate" data-v-47403ddd>${ssrInterpolate(unref(currentFullLink))}</div></div> <button class="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center hover:bg-primary/20 transition-colors shrink-0 mr-2" data-v-47403ddd><i class="ti ti-copy text-primary text-base" data-v-47403ddd></i></button></div></div> <div data-v-47403ddd><label class="text-xs font-medium text-foreground mb-1.5 block" data-v-47403ddd>\u06CC\u0648\u0632\u0631\u0646\u06CC\u0645 \u062C\u062F\u06CC\u062F</label> <div class="flex items-center border border-border rounded-xl bg-background px-3 py-3 ltr relative" data-v-47403ddd><span class="text-muted-foreground opacity-60 text-sm" data-v-47403ddd>linku.im/</span> <input type="text" class="bg-transparent flex-1 focus:outline-none text-foreground text-sm"${ssrRenderAttr("value", unref(form).username)} placeholder="username" maxlength="7" data-v-47403ddd> `);
      if (unref(usernameStatus)) {
        _push(`<div class="absolute ltr:left-3 rtl:right-3 top-1/2 -translate-y-1/2" data-v-47403ddd>`);
        if (unref(usernameStatus) === "available") {
          _push(`<i class="ti ti-check text-green-600 text-lg" data-v-47403ddd></i>`);
        } else if (unref(usernameStatus) === "taken") {
          _push(`<i class="ti ti-x text-red-500 text-lg" data-v-47403ddd></i>`);
        } else if (unref(usernameStatus) === "checking") {
          _push(`<i class="ti ti-loader-2 text-primary animate-spin text-lg" data-v-47403ddd></i>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div> `);
      if (unref(invalidUsername)) {
        _push(`<p class="text-[10px] text-red-600 mt-1 flex items-center gap-1" data-v-47403ddd><i class="ti ti-alert-circle text-xs" data-v-47403ddd></i>
              \u0646\u0627\u0645 \u06A9\u0627\u0631\u0628\u0631\u06CC \u0628\u0627\u06CC\u062F \u06F3 \u062A\u0627 \u06F7 \u06A9\u0627\u0631\u0627\u06A9\u062A\u0631 \u0648 \u0641\u0642\u0637 \u062D\u0631\u0648\u0641 \u0627\u0646\u06AF\u0644\u06CC\u0633\u06CC \u0648 \u0639\u062F\u062F \u0628\u0627\u0634\u062F.
            </p>`);
      } else {
        _push(`<!---->`);
      }
      _push(` `);
      if (unref(usernameStatus) === "taken") {
        _push(`<p class="text-[10px] text-red-600 mt-1 flex items-center gap-1" data-v-47403ddd><i class="ti ti-x text-xs" data-v-47403ddd></i>
              \u0627\u06CC\u0646 \u0646\u0627\u0645 \u06A9\u0627\u0631\u0628\u0631\u06CC \u0642\u0628\u0644\u0627\u064B \u062A\u0648\u0633\u0637 \u06A9\u0627\u0631\u0628\u0631 \u062F\u06CC\u06AF\u0631\u06CC \u0627\u0633\u062A\u0641\u0627\u062F\u0647 \u0634\u062F\u0647 \u0627\u0633\u062A. \u0644\u0637\u0641\u0627\u064B \u0646\u0627\u0645 \u062F\u06CC\u06AF\u0631\u06CC \u0627\u0646\u062A\u062E\u0627\u0628 \u06A9\u0646\u06CC\u062F.
            </p>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div></div> <div class="bg-card rounded-2xl p-4 shadow-sm space-y-3 border border-border/50" data-v-47403ddd><h3 class="text-sm font-semibold text-foreground mb-3 flex items-center" data-v-47403ddd><i class="ti ti-address-book text-primary text-lg ml-2" data-v-47403ddd></i>
            \u0627\u0637\u0644\u0627\u0639\u0627\u062A \u062A\u0645\u0627\u0633
          </h3> <div class="relative" data-v-47403ddd><input type="email"${ssrRenderAttr("value", unref(form).email)} id="emailInput" placeholder=" " dir="ltr" class="peer block w-full px-3 pt-4 pb-2.5 text-sm text-foreground bg-transparent rounded-xl border-2 border-border appearance-none focus:outline-none focus:ring-0 focus:border-primary transition-colors duration-200" data-v-47403ddd> <label for="emailInput" class="inline-flex items-center absolute text-sm text-muted-foreground duration-300 transform -translate-y-4 scale-[0.85] top-2 z-10 bg-background px-2 peer-focus:px-2 peer-focus:text-primary peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-[0.85] peer-focus:-translate-y-4 right-2 origin-top-right" data-v-47403ddd><i class="ti ti-mail w-4 h-4 ml-1.5" data-v-47403ddd></i> <span data-v-47403ddd>\u0627\u06CC\u0645\u06CC\u0644</span></label> `);
      if (unref(emailError)) {
        _push(`<p class="text-[10px] text-red-600 mt-1 flex items-center gap-1" data-v-47403ddd><i class="ti ti-alert-circle text-xs" data-v-47403ddd></i> ${ssrInterpolate(unref(emailError))}</p>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div> <div data-v-47403ddd><div class="relative mb-3" data-v-47403ddd><button class="block px-3 pb-2.5 pt-4 w-full text-sm text-foreground bg-transparent rounded-xl border-2 border-border appearance-none focus:outline-none focus:ring-0 hover:border-primary peer transition-colors duration-200 text-right" data-v-47403ddd><div class="flex items-center justify-between" data-v-47403ddd><div class="flex items-center gap-2" data-v-47403ddd><img${ssrRenderAttr("src", `/flag/${unref(selectedCountry).flag}.svg`)}${ssrRenderAttr("alt", unref(selectedCountry).nameEn)} class="w-6 h-4 object-cover rounded" data-v-47403ddd> <span class="text-foreground" data-v-47403ddd>${ssrInterpolate(unref(selectedCountry).name)}</span></div> <i class="ti ti-chevron-down text-muted-foreground" data-v-47403ddd></i></div></button> <label class="inline-flex items-center absolute text-sm text-muted-foreground duration-300 transform -translate-y-4 scale-[0.85] top-2 z-10 bg-background px-2 right-2 origin-top-right pointer-events-none" data-v-47403ddd><i class="ti ti-world w-4 h-4 ml-1.5" data-v-47403ddd></i> <span data-v-47403ddd>\u06A9\u0634\u0648\u0631</span></label></div> <div class="relative" data-v-47403ddd><input${ssrRenderAttr("value", unref(form).phone)} id="phoneInput" type="text" inputmode="numeric" placeholder=" " dir="ltr" class="block px-3 pb-2.5 pt-4 w-full text-sm text-foreground bg-transparent rounded-xl border-2 border-border appearance-none focus:outline-none focus:ring-0 focus:border-primary peer transition-colors duration-200 pl-12" data-v-47403ddd> <label for="phoneInput" class="inline-flex items-center absolute text-sm text-muted-foreground duration-300 transform -translate-y-4 scale-[0.85] top-2 z-10 bg-background px-2 peer-focus:px-2 peer-focus:text-primary peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-[0.85] peer-focus:-translate-y-4 right-2 origin-top-right" data-v-47403ddd><i class="ti ti-phone w-4 h-4 ml-1.5" data-v-47403ddd></i> <span data-v-47403ddd>\u0634\u0645\u0627\u0631\u0647 \u0645\u0648\u0628\u0627\u06CC\u0644</span></label> <div class="absolute top-1/2 -translate-y-1/2 left-3 text-muted-foreground text-sm font-medium pointer-events-none border-r border-border pr-2 mr-2" dir="ltr" data-v-47403ddd>${ssrInterpolate(unref(selectedCountry).dialCode)}</div></div></div></div> <div class="bg-card rounded-2xl p-4 shadow-sm border border-border/50" data-v-47403ddd><div class="flex items-center justify-between gap-3" data-v-47403ddd><div class="flex flex-col flex-1 min-w-0" data-v-47403ddd><span class="text-sm font-medium text-foreground" data-v-47403ddd>\u062D\u0630\u0641 \u0628\u0631\u0646\u062F\u06CC\u0646\u06AF \u0644\u06CC\u0646\u06A9\u0648</span> <span class="text-[10px] text-muted-foreground" data-v-47403ddd>
                \u062D\u0630\u0641 \u0644\u0648\u06AF\u0648 \u0644\u06CC\u0646\u06A9\u0648 \u0627\u0632 \u062D\u0633\u0627\u0628 \u06A9\u0627\u0631\u0628\u0631\u06CC
              </span></div> <label class="${ssrRenderClass([unref(isProUser) ? "cursor-pointer" : "cursor-not-allowed opacity-60", "inline-flex relative items-center shrink-0"])}" data-v-47403ddd><input type="checkbox" class="sr-only"${ssrIncludeBooleanAttr(Array.isArray(unref(form).removeBranding) ? ssrLooseContain(unref(form).removeBranding, null) : unref(form).removeBranding) ? " checked" : ""} data-v-47403ddd> <div class="${ssrRenderClass([unref(form).removeBranding ? "accent-bg border-accent" : "bg-gray-300 dark:bg-gray-600 border-gray-300 dark:border-gray-600", "w-10 h-5 rounded-full transition-colors duration-300 border"])}" data-v-47403ddd></div> <div class="${ssrRenderClass([unref(form).removeBranding ? "ltr:right-0.5 rtl:left-0.5" : "ltr:right-5 rtl:left-5", "absolute top-0.5 w-4 h-4 bg-white rounded-full shadow-md transition-transform duration-300"])}" data-v-47403ddd></div></label></div></div></div></div> <div class="fixed bottom-0 left-0 right-0 z-40 bg-card/95 backdrop-blur-lg border-t border-border safe-area-bottom" data-v-47403ddd><div class="px-4 py-3 flex gap-3" data-v-47403ddd><button class="flex-1 px-4 py-3 rounded-xl border border-border text-foreground font-medium hover:bg-secondary transition-colors disabled:opacity-40"${ssrIncludeBooleanAttr(!unref(hasChanges)) ? " disabled" : ""} data-v-47403ddd>
          \u0627\u0646\u0635\u0631\u0627\u0641
        </button> <button class="flex-1 px-4 py-3 rounded-xl bg-primary text-primary-foreground font-medium hover:opacity-90 transition-colors disabled:opacity-40 flex items-center justify-center gap-2"${ssrIncludeBooleanAttr(!unref(hasChanges) || unref(invalidUsername) || unref(isLoading)) ? " disabled" : ""} data-v-47403ddd>`);
      if (unref(isLoading)) {
        _push(`<i class="ti ti-loader-2 animate-spin" data-v-47403ddd></i>`);
      } else {
        _push(`<!---->`);
      }
      _push(` ${ssrInterpolate(unref(isLoading) ? "\u0630\u062E\u06CC\u0631\u0647..." : "\u0630\u062E\u06CC\u0631\u0647 \u062A\u063A\u06CC\u06CC\u0631\u0627\u062A")}</button></div></div> `);
      if (unref(showPhoneModal)) {
        _push(`<div class="fixed inset-0 z-50 flex items-center justify-center p-4" data-v-47403ddd><div class="absolute inset-0 bg-black/80 backdrop-blur-sm" data-v-47403ddd></div> <div class="relative bg-card rounded-2xl shadow-xl p-6 w-full max-w-sm z-50 text-center space-y-5 mx-4 border border-border" data-v-47403ddd><h2 class="text-xl font-bold text-foreground" data-v-47403ddd>\u06A9\u062F \u062A\u0623\u06CC\u06CC\u062F</h2> <p class="text-sm text-muted-foreground" data-v-47403ddd>
            \u06A9\u062F\u06CC \u06A9\u0647 \u0628\u0647 <strong data-v-47403ddd>${ssrInterpolate(unref(form).phone)}</strong> \u0627\u0631\u0633\u0627\u0644 \u0634\u062F\u0647 \u0631\u0627 \u0648\u0627\u0631\u062F \u06A9\u0646\u06CC\u062F.
          </p> <div class="flex justify-center gap-2 ltr" data-v-47403ddd><!--[-->`);
        ssrRenderList(unref(otp).length, (digit, index) => {
          _push(`<input${ssrRenderAttr("value", unref(otp)[index])} type="text" inputmode="numeric" maxlength="1" pattern="[0-9]*" class="w-12 h-12 text-xl text-center border border-border rounded-lg font-bold text-foreground bg-background" dir="ltr" data-v-47403ddd>`);
        });
        _push(`<!--]--></div> <p class="text-xs text-muted-foreground mt-2" data-v-47403ddd>${ssrInterpolate(unref(timer) > 0 ? `\u0645\u0627\u0646\u062F\u0647 \u062A\u0627 \u0627\u0631\u0633\u0627\u0644 \u0645\u062C\u062F\u062F: ${formatTime(unref(timer))}` : "\u0627\u0631\u0633\u0627\u0644 \u0645\u062C\u062F\u062F \u0641\u0639\u0627\u0644 \u0634\u062F.")}</p> `);
        if (unref(otpError)) {
          _push(`<p class="text-xs text-red-600" data-v-47403ddd>\u06A9\u062F \u0648\u0627\u0631\u062F \u0634\u062F\u0647 \u0646\u0627\u062F\u0631\u0633\u062A \u0627\u0633\u062A.</p>`);
        } else {
          _push(`<!---->`);
        }
        _push(` `);
        if (unref(otpSuccess)) {
          _push(`<p class="text-xs text-green-600" data-v-47403ddd>\u0634\u0645\u0627\u0631\u0647 \u0645\u0648\u0628\u0627\u06CC\u0644 \u062A\u0623\u06CC\u06CC\u062F \u0634\u062F.</p>`);
        } else {
          _push(`<!---->`);
        }
        _push(` <div class="flex flex-col sm:flex-row justify-center gap-3 pt-2" data-v-47403ddd><button class="w-full sm:w-auto px-4 py-2 rounded-lg border border-border text-foreground bg-background hover:bg-secondary order-2 sm:order-1" data-v-47403ddd>
              \u0627\u0646\u0635\u0631\u0627\u0641
            </button> <button class="w-full sm:w-auto px-4 py-2 rounded-lg accent-bg accent-text hover:opacity-90 order-1 sm:order-2" data-v-47403ddd>
              \u062A\u0623\u06CC\u06CC\u062F
            </button></div></div></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(` `);
      if (unref(showUpgradeModal)) {
        _push(`<div class="fixed inset-0 z-50 flex items-center justify-center" data-v-47403ddd><div class="absolute inset-0 bg-black/80 backdrop-blur-sm" data-v-47403ddd></div> <div class="relative bg-card rounded-2xl shadow-xl p-6 w-full max-w-md z-50 text-center space-y-5 border border-border" data-v-47403ddd><div class="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto" data-v-47403ddd><i class="ti ti-crown text-2xl text-yellow-600" data-v-47403ddd></i></div> <h2 class="text-xl font-bold text-foreground" data-v-47403ddd>\u0627\u0631\u062A\u0642\u0627 \u0628\u0647 \u0627\u0634\u062A\u0631\u0627\u06A9 \u067E\u0631\u0648</h2> <p class="text-sm text-muted-foreground" data-v-47403ddd>
            \u0628\u0631\u0627\u06CC \u062D\u0630\u0641 \u0628\u0631\u0646\u062F\u06CC\u0646\u06AF \u0644\u06CC\u0646\u06A9\u0648 \u0648 \u062F\u0633\u062A\u0631\u0633\u06CC \u0628\u0647 \u0627\u0645\u06A9\u0627\u0646\u0627\u062A \u0648\u06CC\u0698\u0647\u060C \u0646\u06CC\u0627\u0632 \u0628\u0647 \u0627\u0634\u062A\u0631\u0627\u06A9 \u067E\u0631\u0648 \u062F\u0627\u0631\u06CC\u062F.
          </p> <div class="flex flex-col gap-3 pt-2" data-v-47403ddd><button class="w-full px-4 py-3 rounded-lg bg-gradient-to-r from-yellow-400 to-yellow-600 text-white font-medium hover:opacity-90 transition-opacity" data-v-47403ddd>
              \u0645\u0634\u0627\u0647\u062F\u0647 \u067E\u0644\u0627\u0646\u200C\u0647\u0627\u06CC \u0627\u0634\u062A\u0631\u0627\u06A9
            </button> <button class="w-full px-4 py-2 rounded-lg border border-border text-foreground bg-background hover:bg-secondary transition-colors" data-v-47403ddd>
              \u0628\u0639\u062F\u0627\u064B
            </button></div></div></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div> `);
      _push(ssrRenderComponent(InfoToast, {
        visible: unref(showToast),
        message: unref(toastMessage),
        icon: unref(toastIcon)
      }, null, _parent));
      _push(` `);
      _push(ssrRenderComponent(_component_UiBottomSheet, {
        modelValue: unref(showCountryPicker),
        "onUpdate:modelValue": ($event) => isRef(showCountryPicker) ? showCountryPicker.value = $event : null,
        title: "\u0627\u0646\u062A\u062E\u0627\u0628 \u06A9\u0634\u0648\u0631",
        size: "lg",
        "desktop-width": "2xl",
        closable: true,
        "close-on-backdrop": true
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="px-4 pb-4" data-v-47403ddd${_scopeId}><div class="relative mb-4" data-v-47403ddd${_scopeId}><i class="ti ti-search absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground" data-v-47403ddd${_scopeId}></i> <input${ssrRenderAttr("value", unref(countrySearchQuery))} type="text" placeholder="\u062C\u0633\u062A\u062C\u0648 \u06A9\u0634\u0648\u0631..." class="w-full pr-10 pl-4 py-3 border border-border rounded-lg bg-card text-foreground focus:outline-none focus:border-primary" data-v-47403ddd${_scopeId}></div> <div class="max-h-[50vh] overflow-y-auto space-y-1" data-v-47403ddd${_scopeId}><!--[-->`);
            ssrRenderList(unref(filteredCountries), (country) => {
              _push2(`<button${ssrIncludeBooleanAttr(country.code !== "IR") ? " disabled" : ""} class="${ssrRenderClass([
                "w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all",
                unref(selectedCountry).code === country.code ? "bg-primary/10 border border-primary" : country.code === "IR" ? "hover:bg-accent cursor-pointer" : "opacity-50 cursor-not-allowed"
              ])}" data-v-47403ddd${_scopeId}><img${ssrRenderAttr("src", `/flag/${country.flag}.svg`)}${ssrRenderAttr("alt", country.nameEn)} class="w-7 h-5 object-cover rounded" data-v-47403ddd${_scopeId}> <div class="flex-1 text-right" data-v-47403ddd${_scopeId}><div class="text-foreground font-medium" data-v-47403ddd${_scopeId}>${ssrInterpolate(country.name)}</div> <div class="text-xs text-muted-foreground" data-v-47403ddd${_scopeId}>${ssrInterpolate(country.nameEn)}</div></div> <span class="text-muted-foreground text-sm" dir="ltr" data-v-47403ddd${_scopeId}>${ssrInterpolate(country.dialCode)}</span> `);
              if (country.code === "IR") {
                _push2(`<!--[-->`);
                if (unref(selectedCountry).code === country.code) {
                  _push2(`<i class="ti ti-check text-primary" data-v-47403ddd${_scopeId}></i>`);
                } else {
                  _push2(`<!---->`);
                }
                _push2(`<!--]-->`);
              } else {
                _push2(`<span class="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded" data-v-47403ddd${_scopeId}>\u0628\u0647\u200C\u0632\u0648\u062F\u06CC</span>`);
              }
              _push2(`</button>`);
            });
            _push2(`<!--]--></div></div>`);
          } else {
            return [
              createVNode("div", { class: "px-4 pb-4" }, [
                createVNode("div", { class: "relative mb-4" }, [
                  createVNode("i", { class: "ti ti-search absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground" }),
                  createTextVNode(),
                  withDirectives(createVNode("input", {
                    "onUpdate:modelValue": ($event) => isRef(countrySearchQuery) ? countrySearchQuery.value = $event : null,
                    type: "text",
                    placeholder: "\u062C\u0633\u062A\u062C\u0648 \u06A9\u0634\u0648\u0631...",
                    class: "w-full pr-10 pl-4 py-3 border border-border rounded-lg bg-card text-foreground focus:outline-none focus:border-primary"
                  }, null, 8, ["onUpdate:modelValue"]), [
                    [vModelText, unref(countrySearchQuery)]
                  ])
                ]),
                createTextVNode(),
                createVNode("div", { class: "max-h-[50vh] overflow-y-auto space-y-1" }, [
                  (openBlock(true), createBlock(Fragment, null, renderList(unref(filteredCountries), (country) => {
                    return openBlock(), createBlock("button", {
                      key: country.code,
                      onClick: ($event) => country.code === "IR" ? selectCountry(country) : null,
                      disabled: country.code !== "IR",
                      class: [
                        "w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all",
                        unref(selectedCountry).code === country.code ? "bg-primary/10 border border-primary" : country.code === "IR" ? "hover:bg-accent cursor-pointer" : "opacity-50 cursor-not-allowed"
                      ]
                    }, [
                      createVNode("img", {
                        src: `/flag/${country.flag}.svg`,
                        alt: country.nameEn,
                        class: "w-7 h-5 object-cover rounded"
                      }, null, 8, ["src", "alt"]),
                      createTextVNode(),
                      createVNode("div", { class: "flex-1 text-right" }, [
                        createVNode("div", { class: "text-foreground font-medium" }, toDisplayString(country.name), 1),
                        createTextVNode(),
                        createVNode("div", { class: "text-xs text-muted-foreground" }, toDisplayString(country.nameEn), 1)
                      ]),
                      createTextVNode(),
                      createVNode("span", {
                        class: "text-muted-foreground text-sm",
                        dir: "ltr"
                      }, toDisplayString(country.dialCode), 1),
                      createTextVNode(),
                      country.code === "IR" ? (openBlock(), createBlock(Fragment, { key: 0 }, [
                        unref(selectedCountry).code === country.code ? (openBlock(), createBlock("i", {
                          key: 0,
                          class: "ti ti-check text-primary"
                        })) : createCommentVNode("", true)
                      ], 64)) : (openBlock(), createBlock("span", {
                        key: 1,
                        class: "text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded"
                      }, "\u0628\u0647\u200C\u0632\u0648\u062F\u06CC"))
                    ], 10, ["onClick", "disabled"]);
                  }), 128))
                ])
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<!--]-->`);
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/profile/CustomizeLinkPage.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const CustomizeLinkPage = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-47403ddd"]]);

export { CustomizeLinkPage as default };
//# sourceMappingURL=CustomizeLinkPage-DWKpUS64.mjs.map
