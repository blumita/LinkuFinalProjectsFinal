import { _ as __nuxt_component_0$1 } from './BottomSheet-DZASh2SV.mjs';
import { defineComponent, ref, computed, reactive, unref, withCtx, createVNode, createTextVNode, withDirectives, vModelText, createBlock, openBlock, Fragment, renderList, toDisplayString, createCommentVNode, useSSRContext } from 'vue';
import { ssrRenderComponent, ssrRenderAttr, ssrInterpolate, ssrIncludeBooleanAttr, ssrRenderList, ssrRenderClass } from 'vue/server-renderer';
import { u as useWebAuthn, _ as _imports_0, a as _imports_1, b as _imports_2, c as _imports_3 } from './useWebAuthn-BhHsk7sO.mjs';
import { a as useNuxtApp, b as useRouter, u as useAuthStore } from './server.mjs';
import { I as InfoToast } from './InfoToast-DdxwJ7kO.mjs';
import { u as useUserStore } from './user-D1YL8aKq.mjs';
import { d as defaultCountry, c as countries } from './countries-BosuECVZ.mjs';
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

const otpLength = 4;
const _sfc_main$1 = /* @__PURE__ */ defineComponent({
  __name: "AuthPage",
  __ssrInlineRender: true,
  setup(__props) {
    const {
      isPlatformAuthenticatorAvailable,
      isLoading: isWebAuthnLoading,
      isPasskeyEnabled
    } = useWebAuthn();
    const step = ref("phone");
    const authMethod = ref("phone");
    const phone = ref("");
    const email = ref("");
    const name = ref("");
    ref("");
    const fullName = ref("");
    const profilePhone = ref("");
    const profileCountryCode = ref("+98");
    const selectedCountry = ref(defaultCountry);
    const selectedProfileCountry = ref(defaultCountry);
    const showCountryPicker = ref(false);
    const showProfileCountryPicker = ref(false);
    const countrySearchQuery = ref("");
    ref("");
    ref("");
    const referralCode = ref("");
    const displayPhone = ref("");
    const displayEmail = ref("");
    const isLanguageSheetOpen = ref(false);
    const currentLanguage = ref("fa");
    computed(() => {
      return false;
    });
    const filteredCountries = computed(() => {
      if (!countrySearchQuery.value) return countries;
      const query = countrySearchQuery.value.toLowerCase();
      return countries.filter(
        (c) => c.name.includes(query) || c.nameEn.toLowerCase().includes(query) || c.dialCode.includes(query)
      );
    });
    const errors = reactive({ phone: "", email: "", profilePhone: "", profileName: "" });
    const otp = reactive(Array(otpLength).fill(null));
    ref(null);
    const timer = ref(120);
    const isResendEnabled = ref(false);
    const isVerifying = ref(false);
    useUserStore();
    useFormStore();
    const showToast = ref(false);
    const toastMessage = ref("");
    const toastIcon = ref("ti-alert-triangle");
    const showInfoToast = (message, icon = "ti-lock") => {
      toastMessage.value = message;
      toastIcon.value = icon;
      showToast.value = true;
      setTimeout(() => showToast.value = false, 3e3);
    };
    const nuxtApp = useNuxtApp();
    useRouter();
    nuxtApp.$axios;
    useAuthStore();
    function toPersianDigits(str) {
      return str.replace(/[0-9]/g, (d) => "\u06F0\u06F1\u06F2\u06F3\u06F4\u06F5\u06F6\u06F7\u06F8\u06F9"[Number(d)]);
    }
    function formatTime(seconds) {
      return toPersianDigits(seconds.toString());
    }
    const selectCountry = (country) => {
      selectedCountry.value = country;
      showCountryPicker.value = false;
      countrySearchQuery.value = "";
    };
    const selectProfileCountry = (country) => {
      if (country.dialCode === "+972") {
        showInfoToast("\u0627\u06CC\u0646 \u06A9\u0634\u0648\u0631 \u067E\u0634\u062A\u06CC\u0628\u0627\u0646\u06CC \u0646\u0645\u06CC\u200C\u0634\u0648\u062F", "ti-alert-triangle");
        return;
      }
      selectedProfileCountry.value = country;
      profileCountryCode.value = country.dialCode;
      showProfileCountryPicker.value = false;
      countrySearchQuery.value = "";
    };
    const handleLanguageChange = async (lang) => {
      currentLanguage.value = lang;
      setTimeout(() => {
        isLanguageSheetOpen.value = false;
      }, 300);
    };
    return (_ctx, _push, _parent, _attrs) => {
      const _component_UiBottomSheet = __nuxt_component_0$1;
      _push(`<!--[--><div class="min-h-screen flex items-center justify-center bg-background px-4 transition-colors duration-300 relative" data-v-fbd90983><button class="fixed top-4 rtl:left-4 ltr:right-4 z-50 w-10 h-10 rounded-full bg-card border border-border flex items-center justify-center hover:bg-accent transition-colors" data-v-fbd90983><i class="ti ti-language text-foreground text-xl" data-v-fbd90983></i></button> <div class="w-full max-w-md rtl:text-right ltr:text-left" data-v-fbd90983>`);
      if (step.value === "phone") {
        _push(`<!--[--><div class="w-full text-center mb-8" data-v-fbd90983><h1 class="text-xl font-bold mb-2 text-foreground" data-v-fbd90983>\u0634\u0645\u0627\u0631\u0647 \u062A\u0644\u0641\u0646</h1> <p class="text-muted-foreground text-sm" data-v-fbd90983>\u0644\u0637\u0641\u0627\u064B \u06A9\u0634\u0648\u0631 \u0631\u0627 \u0627\u0646\u062A\u062E\u0627\u0628 \u0648 \u0633\u067E\u0633 \u0634\u0645\u0627\u0631\u0647 \u0631\u0648 \u0648\u0627\u0631\u062F \u06A9\u0646\u06CC\u062F</p></div> <div class="w-full mb-4 relative" data-v-fbd90983><label class="absolute rtl:right-4 ltr:left-4 top-[-10px] bg-background text-sm px-1 text-foreground transition-all duration-300" data-v-fbd90983>\u06A9\u0634\u0648\u0631</label> <button class="w-full flex items-center border border-border rounded-lg px-4 py-4 bg-card transition-all duration-300 hover:border-primary" data-v-fbd90983><img${ssrRenderAttr("src", `/flag/${selectedCountry.value.flag}.svg`)}${ssrRenderAttr("alt", selectedCountry.value.nameEn)} class="w-7 h-5 object-cover rounded rtl:ml-3 ltr:mr-3" data-v-fbd90983> <span class="flex-1 rtl:text-right ltr:text-left text-foreground" data-v-fbd90983>${ssrInterpolate(selectedCountry.value.name)}</span> <span class="text-muted-foreground text-sm mx-2" dir="ltr" data-v-fbd90983>${ssrInterpolate(selectedCountry.value.dialCode)}</span> <i class="ti ti-chevron-down text-muted-foreground" data-v-fbd90983></i></button></div> <div class="w-full mb-6 relative overflow-hidden" data-v-fbd90983><input${ssrRenderAttr("value", phone.value)} id="phoneInput" type="text" inputmode="numeric" placeholder=" " dir="ltr" class="peer block w-full px-4 py-4 text-sm border border-border rounded-lg focus:outline-none focus:ring-0 focus:border-primary text-foreground bg-card transition-all duration-300" data-v-fbd90983> <label for="phoneInput" class="absolute rtl:right-4 ltr:left-4 text-sm text-muted-foreground bg-background px-1 z-10 transition-all duration-200 cursor-text top-1/2 -translate-y-1/2 peer-focus:top-1 peer-focus:text-xs peer-focus:-translate-y-1/2 peer-focus:text-primary peer-[:not(:placeholder-shown)]:top-1 peer-[:not(:placeholder-shown)]:text-xs peer-[:not(:placeholder-shown)]:-translate-y-1/2" data-v-fbd90983>
            \u0634\u0645\u0627\u0631\u0647 \u0645\u0648\u0628\u0627\u06CC\u0644
          </label> `);
        if (errors.phone) {
          _push(`<p class="text-red-500 text-xs mt-1 block" data-v-fbd90983>${ssrInterpolate(errors.phone)}</p>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div> <button class="w-full bg-primary text-primary-foreground text-center py-4 rounded-lg text-lg font-medium relative flex items-center justify-center overflow-hidden transition-all duration-300 hover:opacity-90 hover:-translate-y-0.5" data-v-fbd90983><i class="ti ti-chevron-left w-4 rtl:mr-auto ltr:ml-auto absolute rtl:left-4 ltr:right-4 pt-1 text-2xl rtl:border-r ltr:border-l px-4 border-primary-foreground/30 ltr:hidden" data-v-fbd90983></i> <i class="ti ti-chevron-right w-4 ltr:ml-auto absolute ltr:right-4 pt-1 text-2xl ltr:border-l px-4 border-primary-foreground/30 rtl:hidden" data-v-fbd90983></i> <span data-v-fbd90983>\u0627\u062F\u0627\u0645\u0647</span></button> <div class="flex items-center gap-3 my-6" data-v-fbd90983><div class="flex-1 h-px bg-border" data-v-fbd90983></div> <span class="text-muted-foreground text-sm" data-v-fbd90983>\u06CC\u0627</span> <div class="flex-1 h-px bg-border" data-v-fbd90983></div></div> `);
        if (unref(isPlatformAuthenticatorAvailable) && unref(isPasskeyEnabled)()) {
          _push(`<button class="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white text-center py-4 rounded-lg text-lg font-medium relative flex items-center justify-center overflow-hidden transition-all duration-300 hover:opacity-90 hover:-translate-y-0.5 mb-3"${ssrIncludeBooleanAttr(unref(isWebAuthnLoading)) ? " disabled" : ""} data-v-fbd90983>`);
          if (unref(isWebAuthnLoading)) {
            _push(`<!--[--><div class="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin ml-2" data-v-fbd90983></div> <span data-v-fbd90983>\u062F\u0631 \u062D\u0627\u0644 \u0627\u062D\u0631\u0627\u0632 \u0647\u0648\u06CC\u062A...</span><!--]-->`);
          } else {
            _push(`<!--[--><i class="ti ti-face-id text-xl ml-2" data-v-fbd90983></i> <span data-v-fbd90983>\u0648\u0631\u0648\u062F \u0628\u0627 Face ID / Touch ID</span><!--]-->`);
          }
          _push(`</button>`);
        } else {
          _push(`<!---->`);
        }
        _push(` <button class="w-full bg-card border border-border text-foreground text-center py-4 rounded-lg text-lg font-medium relative flex items-center justify-center overflow-hidden transition-all duration-300 hover:bg-muted hover:-translate-y-0.5" data-v-fbd90983><i class="ti ti-mail text-xl ml-2" data-v-fbd90983></i> <span data-v-fbd90983>\u0648\u0631\u0648\u062F \u0628\u0627 \u0627\u06CC\u0645\u06CC\u0644</span></button><!--]-->`);
      } else if (step.value === "email") {
        _push(`<!--[--><div class="w-full mb-8" data-v-fbd90983><div class="flex items-center gap-3 mb-4" data-v-fbd90983><button class="w-10 h-10 rounded-full bg-card border border-border flex items-center justify-center hover:bg-accent transition-colors" data-v-fbd90983><i class="ti ti-arrow-right rtl:block ltr:hidden text-foreground text-xl" data-v-fbd90983></i> <i class="ti ti-arrow-left ltr:block rtl:hidden text-foreground text-xl" data-v-fbd90983></i></button> <h1 class="text-xl font-bold text-foreground flex-1 rtl:text-right ltr:text-left" data-v-fbd90983>\u0627\u06CC\u0645\u06CC\u0644</h1></div> <p class="text-muted-foreground text-sm rtl:text-right ltr:text-left" data-v-fbd90983>\u0622\u062F\u0631\u0633 \u0627\u06CC\u0645\u06CC\u0644 \u062E\u0648\u062F \u0631\u0627 \u0648\u0627\u0631\u062F \u06A9\u0646\u06CC\u062F</p></div> <div class="w-full mb-6 relative" data-v-fbd90983><input${ssrRenderAttr("value", email.value)} id="emailInput" type="email" inputmode="email" placeholder=" " dir="ltr" class="peer block w-full px-4 py-4 text-sm border border-border rounded-lg focus:outline-none focus:ring-0 focus:border-primary text-foreground bg-card transition-all duration-300" data-v-fbd90983> <label for="emailInput" class="absolute rtl:right-4 ltr:left-4 text-sm text-muted-foreground bg-background px-1 z-10 transition-all duration-200 cursor-text top-1/2 -translate-y-1/2 peer-focus:top-1 peer-focus:text-xs peer-focus:-translate-y-1/2 peer-focus:text-primary peer-[:not(:placeholder-shown)]:top-1 peer-[:not(:placeholder-shown)]:text-xs peer-[:not(:placeholder-shown)]:-translate-y-1/2" data-v-fbd90983>
            \u0627\u06CC\u0645\u06CC\u0644
          </label> `);
        if (errors.email) {
          _push(`<p class="text-red-500 text-xs mt-1 block" data-v-fbd90983>${ssrInterpolate(errors.email)}</p>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div> <button class="w-full bg-primary text-primary-foreground text-center py-4 rounded-lg text-lg font-medium relative flex items-center justify-center overflow-hidden transition-all duration-300 hover:opacity-90 hover:-translate-y-0.5" data-v-fbd90983><i class="ti ti-chevron-left w-4 rtl:mr-auto ltr:ml-auto absolute rtl:left-4 ltr:right-4 pt-1 text-2xl rtl:border-r ltr:border-l px-4 border-primary-foreground/30 ltr:hidden" data-v-fbd90983></i> <i class="ti ti-chevron-right w-4 ltr:ml-auto absolute ltr:right-4 pt-1 text-2xl ltr:border-l px-4 border-primary-foreground/30 rtl:hidden" data-v-fbd90983></i> <span data-v-fbd90983>\u0627\u062F\u0627\u0645\u0647</span></button><!--]-->`);
      } else if (step.value === "otp") {
        _push(`<!--[-->`);
        if (isVerifying.value) {
          _push(`<div class="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center" data-v-fbd90983><div class="flex flex-col items-center gap-4" data-v-fbd90983><div class="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" data-v-fbd90983></div> <p class="text-foreground font-medium" data-v-fbd90983>\u062F\u0631 \u062D\u0627\u0644 \u0648\u0631\u0648\u062F...</p></div></div>`);
        } else {
          _push(`<!---->`);
        }
        _push(` <div class="w-full mb-4" data-v-fbd90983><div class="flex items-center justify-between mb-4" data-v-fbd90983><button class="w-10 h-10 rounded-full bg-card border border-border flex items-center justify-center hover:bg-accent transition-colors" data-v-fbd90983><i class="ti ti-arrow-right rtl:block ltr:hidden text-foreground text-xl" data-v-fbd90983></i> <i class="ti ti-arrow-left ltr:block rtl:hidden text-foreground text-xl" data-v-fbd90983></i></button> <h2 class="text-xl font-bold text-foreground flex-1 text-center" data-v-fbd90983>\u06A9\u062F \u062A\u0627\u06CC\u06CC\u062F</h2> <div class="w-10" data-v-fbd90983></div></div></div> `);
        if (authMethod.value === "phone") {
          _push(`<p class="text-sm text-muted-foreground text-center mb-4" data-v-fbd90983>\u0644\u0637\u0641\u0627 \u06A9\u062F \u0627\u0631\u0633\u0627\u0644 \u0634\u062F\u0647 \u0628\u0647 \u0634\u0645\u0627\u0631\u0647 \u0645\u0648\u0628\u0627\u06CC\u0644
          ${ssrInterpolate(toPersianDigits(displayPhone.value))} \u0631\u0627 \u0648\u0627\u0631\u062F
          \u06A9\u0646\u06CC\u062F</p>`);
        } else {
          _push(`<p class="text-sm text-muted-foreground text-center mb-4" data-v-fbd90983>\u0644\u0637\u0641\u0627 \u06A9\u062F \u0627\u0631\u0633\u0627\u0644 \u0634\u062F\u0647 \u0628\u0647 \u0627\u06CC\u0645\u06CC\u0644
          ${ssrInterpolate(displayEmail.value)} \u0631\u0627 \u0648\u0627\u0631\u062F
          \u06A9\u0646\u06CC\u062F</p>`);
        }
        _push(` <div class="flex justify-center gap-2 mt-6 ltr" data-v-fbd90983><!--[-->`);
        ssrRenderList(otpLength, (_, ind) => {
          _push(`<input${ssrRenderAttr("id", `otp-input-${ind}`)} type="text"${ssrRenderAttr("value", otp[ind])} maxlength="1" placeholder="-" inputmode="numeric" autocomplete="one-time-code"${ssrIncludeBooleanAttr(ind === 0) ? " autofocus" : ""} class="${ssrRenderClass([{ bounce: otp[ind] !== null }, "p-4 w-14 h-14 border border-border rounded-lg bg-card text-center text-xl text-foreground flex items-center justify-center font-semibold ltr focus:outline-none focus:border-primary focus:bg-background transition-all duration-300"])}" data-v-fbd90983>`);
        });
        _push(`<!--]--></div> <div class="timer center flex justify-center py-4 text-sm" data-v-fbd90983>`);
        if (!isResendEnabled.value) {
          _push(`<div class="text-right" data-v-fbd90983><span class="font-bold inline-block text-foreground" dir="ltr" data-v-fbd90983>${ssrInterpolate(formatTime(timer.value))}</span> <strong class="mr-2 text-muted-foreground" data-v-fbd90983>\u062B\u0627\u0646\u06CC\u0647 \u0645\u0627\u0646\u062F\u0647 \u062A\u0627 \u0627\u0631\u0633\u0627\u0644 \u0645\u062C\u062F\u062F \u06A9\u062F</strong></div>`);
        } else {
          _push(`<button class="text-primary underline hover:opacity-80 transition-opacity" data-v-fbd90983>
              \u0627\u0631\u0633\u0627\u0644 \u0645\u062C\u062F\u062F \u06A9\u062F
            </button>`);
        }
        _push(`</div><!--]-->`);
      } else if (step.value === "register") {
        _push(`<!--[--><h2 class="text-xl font-bold mb-2 flex items-center gap-2 text-foreground" data-v-fbd90983>\u062B\u0628\u062A</h2> <div class="relative w-full mt-4" data-v-fbd90983><input${ssrRenderAttr("value", name.value)} id="nameInput" type="text" placeholder=" " class="peer block w-full px-3 pt-4 pb-4 text-sm text-foreground rtl:text-right ltr:text-left border border-border rounded-lg focus:outline-none focus:ring-0 focus:border-primary bg-card transition-all duration-300" data-v-fbd90983> <label for="nameInput" class="absolute rtl:right-4 ltr:left-4 text-sm text-muted-foreground bg-background px-1 z-10 transition-all duration-200 cursor-text top-1/2 -translate-y-1/2 peer-focus:top-1 peer-focus:text-xs peer-focus:-translate-y-1/2 peer-focus:text-primary peer-[:not(:placeholder-shown)]:top-1 peer-[:not(:placeholder-shown)]:text-xs peer-[:not(:placeholder-shown)]:-translate-y-1/2" data-v-fbd90983>
            \u0646\u0627\u0645
          </label></div> <div class="relative w-full my-4" data-v-fbd90983><input type="text" id="referralInput"${ssrRenderAttr("value", referralCode.value)} placeholder=" " class="peer block w-full px-3 pt-4 pb-4 text-sm text-foreground rtl:text-right ltr:text-left border border-border rounded-lg focus:outline-none focus:ring-0 focus:border-primary bg-card transition-all duration-300" data-v-fbd90983> <label for="referralInput" class="absolute rtl:right-4 ltr:left-4 text-sm text-muted-foreground bg-background px-1 z-10 transition-all duration-200 cursor-text top-1/2 -translate-y-1/2 peer-focus:top-1 peer-focus:text-xs peer-focus:-translate-y-1/2 peer-focus:text-primary peer-[:not(:placeholder-shown)]:top-1 peer-[:not(:placeholder-shown)]:text-xs peer-[:not(:placeholder-shown)]:-translate-y-1/2" data-v-fbd90983>
            \u06A9\u062F \u0645\u0639\u0631\u0641 (\u0627\u062E\u062A\u06CC\u0627\u0631\u06CC)
          </label></div> <button class="w-full bg-primary text-primary-foreground text-center py-4 rounded-lg text-lg font-medium relative flex items-center justify-center overflow-hidden transition-all duration-300 hover:opacity-90 hover:-translate-y-0.5" data-v-fbd90983><i class="ti ti-chevron-left w-4 rtl:mr-auto ltr:ml-auto absolute rtl:left-4 ltr:right-4 pt-1 text-2xl rtl:border-r ltr:border-l px-4 border-primary-foreground/30 ltr:hidden" data-v-fbd90983></i> <i class="ti ti-chevron-right w-4 ltr:ml-auto absolute ltr:right-4 pt-1 text-2xl ltr:border-l px-4 border-primary-foreground/30 rtl:hidden" data-v-fbd90983></i> <span data-v-fbd90983>\u062B\u0628\u062A</span></button><!--]-->`);
      } else if (step.value === "email_profile") {
        _push(`<!--[--><h2 class="text-xl font-bold mb-2 flex items-center gap-2 text-foreground" data-v-fbd90983>\u062A\u06A9\u0645\u06CC\u0644 \u0627\u0637\u0644\u0627\u0639\u0627\u062A</h2> <p class="text-sm text-muted-foreground mb-6" data-v-fbd90983>\u0644\u0637\u0641\u0627\u064B \u0627\u0637\u0644\u0627\u0639\u0627\u062A \u0632\u06CC\u0631 \u0631\u0627 \u062A\u06A9\u0645\u06CC\u0644 \u06A9\u0646\u06CC\u062F</p> <div class="relative w-full mt-4" data-v-fbd90983><input${ssrRenderAttr("value", fullName.value)} id="profileFullNameInput" type="text" placeholder=" " class="peer block w-full px-3 py-4 text-sm text-foreground rtl:text-right ltr:text-left border border-border rounded-lg focus:outline-none focus:ring-0 focus:border-primary bg-card transition-all duration-300" data-v-fbd90983> <label for="profileFullNameInput" class="absolute rtl:right-4 ltr:left-4 text-sm text-muted-foreground bg-background px-1 z-10 transition-all duration-200 cursor-text top-1/2 -translate-y-1/2 peer-focus:top-1 peer-focus:text-xs peer-focus:-translate-y-1/2 peer-focus:text-primary peer-[:not(:placeholder-shown)]:top-1 peer-[:not(:placeholder-shown)]:text-xs peer-[:not(:placeholder-shown)]:-translate-y-1/2" data-v-fbd90983>
            \u0646\u0627\u0645 \u0648 \u0646\u0627\u0645 \u062E\u0627\u0646\u0648\u0627\u062F\u06AF\u06CC *
          </label> `);
        if (errors.profileName) {
          _push(`<p class="text-red-500 text-xs mt-1 block" data-v-fbd90983>${ssrInterpolate(errors.profileName)}</p>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div> <div class="relative w-full mt-4" data-v-fbd90983><div class="flex gap-2 flex-row-reverse" data-v-fbd90983><button class="flex items-center gap-2 px-3 py-4 border border-border rounded-lg bg-card hover:border-primary transition-all duration-300" data-v-fbd90983><img${ssrRenderAttr("src", `/flag/${selectedProfileCountry.value.flag}.svg`)}${ssrRenderAttr("alt", selectedProfileCountry.value.nameEn)} class="w-6 h-4 object-cover rounded" data-v-fbd90983> <span class="text-sm text-foreground" dir="ltr" data-v-fbd90983>${ssrInterpolate(selectedProfileCountry.value.dialCode)}</span> <i class="ti ti-chevron-down text-muted-foreground text-sm" data-v-fbd90983></i></button> <div class="flex-1 relative" data-v-fbd90983><input${ssrRenderAttr("value", profilePhone.value)} id="profilePhoneInput" type="text" inputmode="numeric" placeholder=" " dir="ltr" class="peer block w-full px-3 py-4 text-sm text-foreground text-left border border-border rounded-lg focus:outline-none focus:ring-0 focus:border-primary bg-card transition-all duration-300" data-v-fbd90983> <label for="profilePhoneInput" class="absolute right-4 text-sm text-muted-foreground bg-background px-1 z-10 transition-all duration-200 cursor-text top-1/2 -translate-y-1/2 peer-focus:top-1 peer-focus:text-xs peer-focus:-translate-y-1/2 peer-focus:text-primary peer-[:not(:placeholder-shown)]:top-1 peer-[:not(:placeholder-shown)]:text-xs peer-[:not(:placeholder-shown)]:-translate-y-1/2" data-v-fbd90983>
                \u0634\u0645\u0627\u0631\u0647 \u0645\u0648\u0628\u0627\u06CC\u0644 (\u0627\u062E\u062A\u06CC\u0627\u0631\u06CC)
              </label></div></div> `);
        if (errors.profilePhone) {
          _push(`<p class="text-red-500 text-xs mt-1 block" data-v-fbd90983>${ssrInterpolate(errors.profilePhone)}</p>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div> <div class="relative w-full mt-4" data-v-fbd90983><input${ssrRenderAttr("value", referralCode.value)} id="profileReferralInput" type="text" placeholder=" " class="peer block w-full px-3 py-4 text-sm text-foreground rtl:text-right ltr:text-left border border-border rounded-lg focus:outline-none focus:ring-0 focus:border-primary bg-card transition-all duration-300" data-v-fbd90983> <label for="profileReferralInput" class="absolute rtl:right-4 ltr:left-4 text-sm text-muted-foreground bg-background px-1 z-10 transition-all duration-200 cursor-text top-1/2 -translate-y-1/2 peer-focus:top-1 peer-focus:text-xs peer-focus:-translate-y-1/2 peer-focus:text-primary peer-[:not(:placeholder-shown)]:top-1 peer-[:not(:placeholder-shown)]:text-xs peer-[:not(:placeholder-shown)]:-translate-y-1/2" data-v-fbd90983>
            \u06A9\u062F \u062F\u0639\u0648\u062A (\u0627\u062E\u062A\u06CC\u0627\u0631\u06CC)
          </label></div> <button class="w-full bg-primary text-primary-foreground text-center py-4 rounded-lg text-lg font-medium relative flex items-center justify-center overflow-hidden transition-all duration-300 hover:opacity-90 hover:-translate-y-0.5 mt-6"${ssrIncludeBooleanAttr(isVerifying.value) ? " disabled" : ""} data-v-fbd90983>`);
        if (isVerifying.value) {
          _push(`<!--[--><div class="w-5 h-5 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin ml-2" data-v-fbd90983></div> <span data-v-fbd90983>\u062F\u0631 \u062D\u0627\u0644 \u062B\u0628\u062A...</span><!--]-->`);
        } else {
          _push(`<!--[--><i class="ti ti-chevron-left w-4 rtl:mr-auto ltr:ml-auto absolute rtl:left-4 ltr:right-4 pt-1 text-2xl rtl:border-r ltr:border-l px-4 border-primary-foreground/30 ltr:hidden" data-v-fbd90983></i> <i class="ti ti-chevron-right w-4 ltr:ml-auto absolute ltr:right-4 pt-1 text-2xl ltr:border-l px-4 border-primary-foreground/30 rtl:hidden" data-v-fbd90983></i> <span data-v-fbd90983>\u062B\u0628\u062A \u0648 \u0648\u0631\u0648\u062F</span><!--]-->`);
        }
        _push(`</button><!--]-->`);
      } else if (step.value === "done") {
        _push(`<h2 class="text-xl font-bold text-center text-green-600 flex items-center justify-center gap-2" data-v-fbd90983><i class="ti ti-check" data-v-fbd90983></i> \u0648\u0631\u0648\u062F \u0645\u0648\u0641\u0642
        </h2>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div> `);
      _push(ssrRenderComponent(_component_UiBottomSheet, {
        modelValue: showCountryPicker.value,
        "onUpdate:modelValue": ($event) => showCountryPicker.value = $event,
        title: "\u0627\u0646\u062A\u062E\u0627\u0628 \u06A9\u0634\u0648\u0631",
        size: "lg",
        "desktop-width": "2xl",
        closable: true,
        "close-on-backdrop": true
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="px-4 pb-4" data-v-fbd90983${_scopeId}><div class="relative mb-4" data-v-fbd90983${_scopeId}><i class="ti ti-search absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground" data-v-fbd90983${_scopeId}></i> <input${ssrRenderAttr("value", countrySearchQuery.value)} type="text" placeholder="\u062C\u0633\u062A\u062C\u0648 \u06A9\u0634\u0648\u0631..." class="w-full pr-10 pl-4 py-3 border border-border rounded-lg bg-card text-foreground focus:outline-none focus:border-primary" data-v-fbd90983${_scopeId}></div> <div class="max-h-[50vh] overflow-y-auto space-y-1" data-v-fbd90983${_scopeId}><!--[-->`);
            ssrRenderList(filteredCountries.value, (country) => {
              _push2(`<button${ssrIncludeBooleanAttr(country.code !== "IR") ? " disabled" : ""} class="${ssrRenderClass([
                "w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all",
                selectedCountry.value.code === country.code ? "bg-primary/10 border border-primary" : country.code === "IR" ? "hover:bg-accent cursor-pointer" : "opacity-50 cursor-not-allowed"
              ])}" data-v-fbd90983${_scopeId}><img${ssrRenderAttr("src", `/flag/${country.flag}.svg`)}${ssrRenderAttr("alt", country.nameEn)} class="w-7 h-5 object-cover rounded" data-v-fbd90983${_scopeId}> <div class="flex-1 text-right" data-v-fbd90983${_scopeId}><div class="text-foreground font-medium" data-v-fbd90983${_scopeId}>${ssrInterpolate(country.name)}</div> <div class="text-xs text-muted-foreground" data-v-fbd90983${_scopeId}>${ssrInterpolate(country.nameEn)}</div></div> <span class="text-muted-foreground text-sm" dir="ltr" data-v-fbd90983${_scopeId}>${ssrInterpolate(country.dialCode)}</span> `);
              if (country.code === "IR") {
                _push2(`<!--[-->`);
                if (selectedCountry.value.code === country.code) {
                  _push2(`<i class="ti ti-check text-primary" data-v-fbd90983${_scopeId}></i>`);
                } else {
                  _push2(`<!---->`);
                }
                _push2(`<!--]-->`);
              } else {
                _push2(`<span class="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded" data-v-fbd90983${_scopeId}>\u0628\u0647\u200C\u0632\u0648\u062F\u06CC</span>`);
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
                    "onUpdate:modelValue": ($event) => countrySearchQuery.value = $event,
                    type: "text",
                    placeholder: "\u062C\u0633\u062A\u062C\u0648 \u06A9\u0634\u0648\u0631...",
                    class: "w-full pr-10 pl-4 py-3 border border-border rounded-lg bg-card text-foreground focus:outline-none focus:border-primary"
                  }, null, 8, ["onUpdate:modelValue"]), [
                    [vModelText, countrySearchQuery.value]
                  ])
                ]),
                createTextVNode(),
                createVNode("div", { class: "max-h-[50vh] overflow-y-auto space-y-1" }, [
                  (openBlock(true), createBlock(Fragment, null, renderList(filteredCountries.value, (country) => {
                    return openBlock(), createBlock("button", {
                      key: country.code,
                      onClick: ($event) => country.code === "IR" ? selectCountry(country) : null,
                      disabled: country.code !== "IR",
                      class: [
                        "w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all",
                        selectedCountry.value.code === country.code ? "bg-primary/10 border border-primary" : country.code === "IR" ? "hover:bg-accent cursor-pointer" : "opacity-50 cursor-not-allowed"
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
                        selectedCountry.value.code === country.code ? (openBlock(), createBlock("i", {
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
      _push(` `);
      _push(ssrRenderComponent(_component_UiBottomSheet, {
        modelValue: showProfileCountryPicker.value,
        "onUpdate:modelValue": ($event) => showProfileCountryPicker.value = $event,
        title: "\u0627\u0646\u062A\u062E\u0627\u0628 \u06A9\u0634\u0648\u0631",
        size: "lg",
        "desktop-width": "2xl",
        closable: true,
        "close-on-backdrop": true
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="px-4 pb-4" data-v-fbd90983${_scopeId}><div class="relative mb-4" data-v-fbd90983${_scopeId}><i class="ti ti-search absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground" data-v-fbd90983${_scopeId}></i> <input${ssrRenderAttr("value", countrySearchQuery.value)} type="text" placeholder="\u062C\u0633\u062A\u062C\u0648 \u06A9\u0634\u0648\u0631..." class="w-full pr-10 pl-4 py-3 border border-border rounded-lg bg-card text-foreground focus:outline-none focus:border-primary" data-v-fbd90983${_scopeId}></div> <div class="max-h-[50vh] overflow-y-auto space-y-1" data-v-fbd90983${_scopeId}><!--[-->`);
            ssrRenderList(filteredCountries.value, (country) => {
              _push2(`<button class="${ssrRenderClass([
                "w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all",
                selectedProfileCountry.value.code === country.code ? "bg-primary/10 border border-primary" : "hover:bg-accent"
              ])}" data-v-fbd90983${_scopeId}><img${ssrRenderAttr("src", `/flag/${country.flag}.svg`)}${ssrRenderAttr("alt", country.nameEn)} class="w-7 h-5 object-cover rounded" data-v-fbd90983${_scopeId}> <div class="flex-1 text-right" data-v-fbd90983${_scopeId}><div class="text-foreground font-medium" data-v-fbd90983${_scopeId}>${ssrInterpolate(country.name)}</div> <div class="text-xs text-muted-foreground" data-v-fbd90983${_scopeId}>${ssrInterpolate(country.nameEn)}</div></div> <span class="text-muted-foreground text-sm" dir="ltr" data-v-fbd90983${_scopeId}>${ssrInterpolate(country.dialCode)}</span> `);
              if (selectedProfileCountry.value.code === country.code) {
                _push2(`<i class="ti ti-check text-primary" data-v-fbd90983${_scopeId}></i>`);
              } else {
                _push2(`<!---->`);
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
                    "onUpdate:modelValue": ($event) => countrySearchQuery.value = $event,
                    type: "text",
                    placeholder: "\u062C\u0633\u062A\u062C\u0648 \u06A9\u0634\u0648\u0631...",
                    class: "w-full pr-10 pl-4 py-3 border border-border rounded-lg bg-card text-foreground focus:outline-none focus:border-primary"
                  }, null, 8, ["onUpdate:modelValue"]), [
                    [vModelText, countrySearchQuery.value]
                  ])
                ]),
                createTextVNode(),
                createVNode("div", { class: "max-h-[50vh] overflow-y-auto space-y-1" }, [
                  (openBlock(true), createBlock(Fragment, null, renderList(filteredCountries.value, (country) => {
                    return openBlock(), createBlock("button", {
                      key: country.code,
                      onClick: ($event) => selectProfileCountry(country),
                      class: [
                        "w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all",
                        selectedProfileCountry.value.code === country.code ? "bg-primary/10 border border-primary" : "hover:bg-accent"
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
                      selectedProfileCountry.value.code === country.code ? (openBlock(), createBlock("i", {
                        key: 0,
                        class: "ti ti-check text-primary"
                      })) : createCommentVNode("", true)
                    ], 10, ["onClick"]);
                  }), 128))
                ])
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(` `);
      _push(ssrRenderComponent(_component_UiBottomSheet, {
        modelValue: isLanguageSheetOpen.value,
        "onUpdate:modelValue": ($event) => isLanguageSheetOpen.value = $event,
        title: "\u062A\u0646\u0638\u06CC\u0645\u0627\u062A \u0632\u0628\u0627\u0646",
        size: "auto",
        "desktop-width": "lg",
        closable: true,
        "close-on-backdrop": true
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="px-6 py-4 pb-6" data-v-fbd90983${_scopeId}><div class="space-y-2" data-v-fbd90983${_scopeId}><button class="${ssrRenderClass([
              "w-full flex items-center justify-between p-4 rounded-xl border-2 transition-all duration-200",
              currentLanguage.value === "fa" ? "border-primary bg-primary/5 shadow-sm" : "border-border bg-card hover:border-primary/50 hover:bg-accent"
            ])}" data-v-fbd90983${_scopeId}><div class="flex items-center gap-3" data-v-fbd90983${_scopeId}><div class="w-10 h-10 rounded-full bg-green-500/10 flex items-center justify-center overflow-hidden" data-v-fbd90983${_scopeId}><img${ssrRenderAttr("src", _imports_0)} alt="Iran" class="w-7 h-5 object-cover" data-v-fbd90983${_scopeId}></div> <div class="text-right" data-v-fbd90983${_scopeId}><div class="font-semibold text-foreground" data-v-fbd90983${_scopeId}>\u0641\u0627\u0631\u0633\u06CC</div> <div class="text-xs text-muted-foreground" data-v-fbd90983${_scopeId}>Persian</div></div></div> `);
            if (currentLanguage.value === "fa") {
              _push2(`<i class="ti ti-check text-primary text-2xl" data-v-fbd90983${_scopeId}></i>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</button> <button disabled class="w-full flex items-center justify-between p-4 rounded-xl border-2 transition-all opacity-50 cursor-not-allowed border-border bg-muted/30" data-v-fbd90983${_scopeId}><div class="flex items-center gap-3" data-v-fbd90983${_scopeId}><div class="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center overflow-hidden" data-v-fbd90983${_scopeId}><img${ssrRenderAttr("src", _imports_1)} alt="USA" class="w-7 h-5 object-cover" data-v-fbd90983${_scopeId}></div> <div class="text-right" data-v-fbd90983${_scopeId}><div class="font-semibold text-foreground" data-v-fbd90983${_scopeId}>English</div> <div class="text-xs text-muted-foreground" data-v-fbd90983${_scopeId}>\u0628\u0647\u200C\u0632\u0648\u062F\u06CC</div></div></div> <div class="px-2 py-1 bg-muted rounded text-xs text-muted-foreground" data-v-fbd90983${_scopeId}>\u0642\u0641\u0644</div></button> <button disabled class="w-full flex items-center justify-between p-4 rounded-xl border-2 transition-all opacity-50 cursor-not-allowed border-border bg-muted/30" data-v-fbd90983${_scopeId}><div class="flex items-center gap-3" data-v-fbd90983${_scopeId}><div class="w-10 h-10 rounded-full bg-yellow-500/10 flex items-center justify-center overflow-hidden" data-v-fbd90983${_scopeId}><img${ssrRenderAttr("src", _imports_2)} alt="Saudi Arabia" class="w-7 h-5 object-cover" data-v-fbd90983${_scopeId}></div> <div class="text-right" data-v-fbd90983${_scopeId}><div class="font-semibold text-foreground" data-v-fbd90983${_scopeId}>\u0627\u0644\u0639\u0631\u0628\u064A\u0629</div> <div class="text-xs text-muted-foreground" data-v-fbd90983${_scopeId}>\u0628\u0647\u200C\u0632\u0648\u062F\u06CC</div></div></div></button> <button disabled class="w-full flex items-center justify-between p-4 rounded-xl border-2 transition-all opacity-50 cursor-not-allowed border-border bg-muted/30" data-v-fbd90983${_scopeId}><div class="flex items-center gap-3" data-v-fbd90983${_scopeId}><div class="w-10 h-10 rounded-full bg-red-500/10 flex items-center justify-center overflow-hidden" data-v-fbd90983${_scopeId}><img${ssrRenderAttr("src", _imports_3)} alt="Turkey" class="w-7 h-5 object-cover" data-v-fbd90983${_scopeId}></div> <div class="text-right" data-v-fbd90983${_scopeId}><div class="font-semibold text-foreground" data-v-fbd90983${_scopeId}>T\xFCrk\xE7e</div> <div class="text-xs text-muted-foreground" data-v-fbd90983${_scopeId}>\u0628\u0647\u200C\u0632\u0648\u062F\u06CC</div></div></div></button></div></div>`);
          } else {
            return [
              createVNode("div", { class: "px-6 py-4 pb-6" }, [
                createVNode("div", { class: "space-y-2" }, [
                  createVNode("button", {
                    onClick: ($event) => handleLanguageChange("fa"),
                    class: [
                      "w-full flex items-center justify-between p-4 rounded-xl border-2 transition-all duration-200",
                      currentLanguage.value === "fa" ? "border-primary bg-primary/5 shadow-sm" : "border-border bg-card hover:border-primary/50 hover:bg-accent"
                    ]
                  }, [
                    createVNode("div", { class: "flex items-center gap-3" }, [
                      createVNode("div", { class: "w-10 h-10 rounded-full bg-green-500/10 flex items-center justify-center overflow-hidden" }, [
                        createVNode("img", {
                          src: _imports_0,
                          alt: "Iran",
                          class: "w-7 h-5 object-cover"
                        })
                      ]),
                      createTextVNode(),
                      createVNode("div", { class: "text-right" }, [
                        createVNode("div", { class: "font-semibold text-foreground" }, "\u0641\u0627\u0631\u0633\u06CC"),
                        createTextVNode(),
                        createVNode("div", { class: "text-xs text-muted-foreground" }, "Persian")
                      ])
                    ]),
                    createTextVNode(),
                    currentLanguage.value === "fa" ? (openBlock(), createBlock("i", {
                      key: 0,
                      class: "ti ti-check text-primary text-2xl"
                    })) : createCommentVNode("", true)
                  ], 10, ["onClick"]),
                  createTextVNode(),
                  createVNode("button", {
                    disabled: "",
                    class: "w-full flex items-center justify-between p-4 rounded-xl border-2 transition-all opacity-50 cursor-not-allowed border-border bg-muted/30"
                  }, [
                    createVNode("div", { class: "flex items-center gap-3" }, [
                      createVNode("div", { class: "w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center overflow-hidden" }, [
                        createVNode("img", {
                          src: _imports_1,
                          alt: "USA",
                          class: "w-7 h-5 object-cover"
                        })
                      ]),
                      createTextVNode(),
                      createVNode("div", { class: "text-right" }, [
                        createVNode("div", { class: "font-semibold text-foreground" }, "English"),
                        createTextVNode(),
                        createVNode("div", { class: "text-xs text-muted-foreground" }, "\u0628\u0647\u200C\u0632\u0648\u062F\u06CC")
                      ])
                    ]),
                    createTextVNode(),
                    createVNode("div", { class: "px-2 py-1 bg-muted rounded text-xs text-muted-foreground" }, "\u0642\u0641\u0644")
                  ]),
                  createTextVNode(),
                  createVNode("button", {
                    disabled: "",
                    class: "w-full flex items-center justify-between p-4 rounded-xl border-2 transition-all opacity-50 cursor-not-allowed border-border bg-muted/30"
                  }, [
                    createVNode("div", { class: "flex items-center gap-3" }, [
                      createVNode("div", { class: "w-10 h-10 rounded-full bg-yellow-500/10 flex items-center justify-center overflow-hidden" }, [
                        createVNode("img", {
                          src: _imports_2,
                          alt: "Saudi Arabia",
                          class: "w-7 h-5 object-cover"
                        })
                      ]),
                      createTextVNode(),
                      createVNode("div", { class: "text-right" }, [
                        createVNode("div", { class: "font-semibold text-foreground" }, "\u0627\u0644\u0639\u0631\u0628\u064A\u0629"),
                        createTextVNode(),
                        createVNode("div", { class: "text-xs text-muted-foreground" }, "\u0628\u0647\u200C\u0632\u0648\u062F\u06CC")
                      ])
                    ])
                  ]),
                  createTextVNode(),
                  createVNode("button", {
                    disabled: "",
                    class: "w-full flex items-center justify-between p-4 rounded-xl border-2 transition-all opacity-50 cursor-not-allowed border-border bg-muted/30"
                  }, [
                    createVNode("div", { class: "flex items-center gap-3" }, [
                      createVNode("div", { class: "w-10 h-10 rounded-full bg-red-500/10 flex items-center justify-center overflow-hidden" }, [
                        createVNode("img", {
                          src: _imports_3,
                          alt: "Turkey",
                          class: "w-7 h-5 object-cover"
                        })
                      ]),
                      createTextVNode(),
                      createVNode("div", { class: "text-right" }, [
                        createVNode("div", { class: "font-semibold text-foreground" }, "T\xFCrk\xE7e"),
                        createTextVNode(),
                        createVNode("div", { class: "text-xs text-muted-foreground" }, "\u0628\u0647\u200C\u0632\u0648\u062F\u06CC")
                      ])
                    ])
                  ])
                ])
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div> `);
      _push(ssrRenderComponent(InfoToast, {
        visible: showToast.value,
        message: toastMessage.value,
        icon: toastIcon.value
      }, null, _parent));
      _push(`<!--]-->`);
    };
  }
});
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/Auth/AuthPage.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const __nuxt_component_0 = /* @__PURE__ */ _export_sfc(_sfc_main$1, [["__scopeId", "data-v-fbd90983"]]);
const _sfc_main = {
  __name: "login",
  __ssrInlineRender: true,
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      const _component_AuthPage = __nuxt_component_0;
      _push(ssrRenderComponent(_component_AuthPage, _attrs, null, _parent));
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/auth/login.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=login-RJrHW5z3.mjs.map
