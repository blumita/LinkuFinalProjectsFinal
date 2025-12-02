import { _ as __nuxt_component_0 } from './BottomSheet-DZASh2SV.mjs';
import { a as useNuxtApp, _ as __nuxt_component_0$3 } from './server.mjs';
import { defineComponent, ref, computed, mergeProps, withCtx, createVNode, createTextVNode, createBlock, openBlock, Fragment, renderList, createCommentVNode, unref, toDisplayString, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrInterpolate, ssrRenderComponent, ssrRenderClass, ssrRenderAttr, ssrIncludeBooleanAttr } from 'vue/server-renderer';
import { u as useWebAuthn, _ as _imports_0, a as _imports_1, b as _imports_2, c as _imports_3 } from './useWebAuthn-BhHsk7sO.mjs';
import { useRouter } from 'vue-router';
import { u as useFormStore } from './form-CUJQskNk.mjs';
import { u as useUserStore } from './user-D1YL8aKq.mjs';
import './_plugin-vue_export-helper-1tPrXgE0.mjs';
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
import 'axios';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "index",
  __ssrInlineRender: true,
  setup(__props) {
    useRouter();
    const formStore = useFormStore();
    const userStore = useUserStore();
    const { $pwa } = useNuxtApp();
    const {
      isLoading: isWebAuthnLoading,
      registerPasskey
    } = useWebAuthn();
    const showBiometricOption = ref(false);
    const isBiometricEnabled = ref(false);
    const isBiometricSheetOpen = ref(false);
    computed(() => formStore.defaultCard);
    const isThemeSheetOpen = ref(false);
    const isLanguageSheetOpen = ref(false);
    const currentThemeMode = ref("system");
    const currentColorScheme = ref("blue");
    const currentLanguage = ref("fa");
    const colorSchemes = [
      { name: "black", color: "#0f0f0f" },
      { name: "blue", color: "#3b82f6" },
      { name: "violet", color: "#8b5cf6" },
      { name: "green", color: "#10b981" },
      { name: "orange", color: "#f59e0b" },
      { name: "red", color: "#ef4444" }
    ];
    const getColorName = (colorName) => {
      const colorNames = {
        "black": "\u0645\u0634\u06A9\u06CC",
        "blue": "\u0622\u0628\u06CC",
        "violet": "\u0628\u0646\u0641\u0634",
        "green": "\u0633\u0628\u0632",
        "orange": "\u0646\u0627\u0631\u0646\u062C\u06CC",
        "red": "\u0642\u0631\u0645\u0632"
      };
      return colorNames[colorName] || colorName;
    };
    const getCurrentThemeLabel = () => {
      switch (currentThemeMode.value) {
        case "light":
          return "\u0631\u0648\u0634\u0646";
        case "dark":
          return "\u062A\u0627\u0631\u06CC\u06A9";
        case "system":
          return "\u0627\u062A\u0648\u0645\u0627\u062A\u06CC\u06A9";
        default:
          return "\u0627\u062A\u0648\u0645\u0627\u062A\u06CC\u06A9";
      }
    };
    const getCurrentLanguageLabel = () => {
      switch (currentLanguage.value) {
        case "fa":
          return "\u0641\u0627\u0631\u0633\u06CC";
        case "en":
          return "English";
        default:
          return "\u0641\u0627\u0631\u0633\u06CC";
      }
    };
    const handleBiometricToggle = async () => {
      if (isBiometricEnabled.value) {
        isBiometricEnabled.value = false;
        localStorage.removeItem("passkey_auth_token");
      } else {
        const user = userStore.user;
        if (!user) {
          alert("\u0644\u0637\u0641\u0627\u064B \u0627\u0628\u062A\u062F\u0627 \u0648\u0627\u0631\u062F \u0634\u0648\u06CC\u062F");
          return;
        }
        const result = await registerPasskey(
          String(user.id || user.phone || user.email),
          user.phone || user.email || "user",
          user.name || "\u06A9\u0627\u0631\u0628\u0631 \u0644\u06CC\u0646\u06A9\u0648"
        );
        if (result.success) {
          isBiometricEnabled.value = true;
          const currentToken = localStorage.getItem("auth_token");
          if (currentToken) {
            localStorage.setItem("passkey_auth_token", currentToken);
          }
          alert("Face ID / Touch ID \u0628\u0627 \u0645\u0648\u0641\u0642\u06CC\u062A \u0641\u0639\u0627\u0644 \u0634\u062F");
        } else {
          alert(result.error || "\u062E\u0637\u0627 \u062F\u0631 \u0641\u0639\u0627\u0644\u200C\u0633\u0627\u0632\u06CC");
        }
      }
      isBiometricSheetOpen.value = false;
    };
    const handleThemeModeChange = (mode) => {
      currentThemeMode.value = mode;
    };
    const handleColorSchemeChange = (scheme) => {
      currentColorScheme.value = scheme;
    };
    const applyThemeChanges = () => {
      isThemeSheetOpen.value = false;
    };
    const handleLanguageChange = async (lang) => {
      currentLanguage.value = lang;
      setTimeout(() => {
        isLanguageSheetOpen.value = false;
      }, 300);
    };
    return (_ctx, _push, _parent, _attrs) => {
      const _component_UiBottomSheet = __nuxt_component_0;
      const _component_ClientOnly = __nuxt_component_0$3;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "min-h-screen bg-background" }, _attrs))}><div class="fixed top-0 left-0 right-0 z-40 bg-card border-b border-border"><div class="flex items-center h-14 px-4 max-w-5xl mx-auto"><button class="flex items-center justify-center w-10 h-10 rounded-lg text-foreground hover:bg-accent transition-colors"><i class="ti ti-arrow-right text-xl"></i></button> <h1 class="flex-1 text-lg font-semibold text-foreground text-center mr-10">\u062A\u0646\u0638\u06CC\u0645\u0627\u062A</h1></div></div> <div class="pt-[60px] pb-20 px-3"><div class="max-w-5xl mx-auto lg:max-w-none lg:px-8"><div class="lg:hidden space-y-0"><button class="w-full flex items-center justify-between py-4 border-b border-border/20"><div class="flex items-center gap-3"><i class="ti ti-user-edit text-foreground text-lg"></i> <span class="font-medium text-foreground text-base">\u0648\u06CC\u0631\u0627\u06CC\u0634 \u067E\u0631\u0648\u0641\u0627\u06CC\u0644</span></div> <i class="ti ti-chevron-left text-muted-foreground text-sm"></i></button> <button class="w-full flex items-center justify-between py-4 border-b border-border/20"><div class="flex items-center gap-3"><i class="ti ti-link text-foreground text-lg"></i> <span class="font-medium text-foreground text-base">\u0633\u0641\u0627\u0631\u0634\u06CC\u200C\u0633\u0627\u0632\u06CC \u0644\u06CC\u0646\u06A9</span></div> <i class="ti ti-chevron-left text-muted-foreground text-sm"></i></button> <button class="w-full flex items-center justify-between py-4 border-b border-border/20"><div class="flex items-center gap-3"><i class="ti ti-qrcode text-foreground text-lg"></i> <span class="font-medium text-foreground text-base">\u0633\u0641\u0627\u0631\u0634\u06CC\u200C\u0633\u0627\u0632\u06CC \u06A9\u062F QR</span></div> <i class="ti ti-chevron-left text-muted-foreground text-sm"></i></button> <button class="w-full flex items-center justify-between py-4 border-b border-border/20"><div class="flex items-center gap-3"><i class="ti ti-palette text-foreground text-lg"></i> <span class="font-medium text-foreground text-base">\u062A\u0646\u0638\u06CC\u0645\u0627\u062A \u0638\u0627\u0647\u0631\u06CC</span></div> <div class="flex items-center gap-2"><span class="text-sm text-muted-foreground">${ssrInterpolate(getCurrentThemeLabel())}</span> <i class="ti ti-chevron-left text-muted-foreground text-sm"></i></div></button> <button class="w-full flex items-center justify-between py-4 border-b border-border/20"><div class="flex items-center gap-3"><i class="ti ti-language text-foreground text-lg"></i> <span class="font-medium text-foreground text-base">\u0632\u0628\u0627\u0646</span></div> <div class="flex items-center gap-2"><span class="text-sm text-muted-foreground">${ssrInterpolate(getCurrentLanguageLabel())}</span> <i class="ti ti-chevron-left text-muted-foreground text-sm"></i></div></button> <button class="w-full flex items-center justify-between py-4 border-b border-border/20"><div class="flex items-center gap-3"><i class="ti ti-bell text-foreground text-lg"></i> <span class="font-medium text-foreground text-base">\u062A\u0646\u0638\u06CC\u0645\u0627\u062A \u0627\u0639\u0644\u0627\u0646\u200C\u0647\u0627</span></div> <i class="ti ti-chevron-left text-muted-foreground text-sm"></i></button> `);
      if (showBiometricOption.value) {
        _push(`<button class="w-full flex items-center justify-between py-4 border-b border-border/20"><div class="flex items-center gap-3"><i class="ti ti-face-id text-foreground text-lg"></i> <span class="font-medium text-foreground text-base">Face ID / Touch ID</span></div> <div class="flex items-center gap-2">`);
        if (isBiometricEnabled.value) {
          _push(`<span class="text-xs text-primary bg-primary/10 px-2 py-1 rounded">\u0641\u0639\u0627\u0644</span>`);
        } else {
          _push(`<!---->`);
        }
        _push(` <i class="ti ti-chevron-left text-muted-foreground text-sm"></i></div></button>`);
      } else {
        _push(`<!---->`);
      }
      _push(` <button disabled class="w-full flex items-center justify-between py-4 border-b border-border/20 opacity-50 cursor-not-allowed"><div class="flex items-center gap-3"><i class="ti ti-key text-foreground text-lg"></i> <span class="font-medium text-foreground text-base">\u062A\u063A\u06CC\u06CC\u0631 \u0631\u0645\u0632 \u0639\u0628\u0648\u0631</span> <span class="text-xs text-muted-foreground bg-muted px-2 py-1 rounded">\u0628\u0632\u0648\u062F\u06CC</span></div> <i class="ti ti-chevron-left text-muted-foreground text-sm"></i></button> <button disabled class="w-full flex items-center justify-between py-4 opacity-50 cursor-not-allowed"><div class="flex items-center gap-3"><i class="ti ti-map text-foreground text-lg"></i> <span class="font-medium text-foreground text-base">\u062A\u0646\u0638\u06CC\u0645\u0627\u062A \u0646\u0642\u0634\u0647</span> <span class="text-xs text-muted-foreground bg-muted px-2 py-1 rounded">\u0628\u0632\u0648\u062F\u06CC</span></div> <i class="ti ti-chevron-left text-muted-foreground text-sm"></i></button></div> <div class="hidden lg:grid lg:grid-cols-3 lg:gap-6 lg:auto-rows-fr"><button class="bg-card border border-border rounded-xl p-5 hover:bg-accent hover:border-primary/30 transition-all text-right group"><div class="flex items-center gap-4"><div class="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center"><i class="ti ti-user-edit text-primary text-2xl"></i></div> <div class="flex-1"><h3 class="text-base font-semibold text-foreground">\u0648\u06CC\u0631\u0627\u06CC\u0634 \u067E\u0631\u0648\u0641\u0627\u06CC\u0644</h3></div> <i class="ti ti-chevron-left text-muted-foreground group-hover:text-foreground transition-colors"></i></div></button> <button class="bg-card border border-border rounded-xl p-5 hover:bg-accent hover:border-primary/30 transition-all text-right group"><div class="flex items-center gap-4"><div class="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center"><i class="ti ti-link text-primary text-2xl"></i></div> <div class="flex-1"><h3 class="text-base font-semibold text-foreground">\u0633\u0641\u0627\u0631\u0634\u06CC\u200C\u0633\u0627\u0632\u06CC \u0644\u06CC\u0646\u06A9</h3></div> <i class="ti ti-chevron-left text-muted-foreground group-hover:text-foreground transition-colors"></i></div></button> <button class="bg-card border border-border rounded-xl p-5 hover:bg-accent hover:border-primary/30 transition-all text-right group"><div class="flex items-center gap-4"><div class="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center"><i class="ti ti-qrcode text-primary text-2xl"></i></div> <div class="flex-1"><h3 class="text-base font-semibold text-foreground">\u0633\u0641\u0627\u0631\u0634\u06CC\u200C\u0633\u0627\u0632\u06CC QR</h3></div> <i class="ti ti-chevron-left text-muted-foreground group-hover:text-foreground transition-colors"></i></div></button> <button class="bg-card border border-border rounded-xl p-5 hover:bg-accent hover:border-primary/30 transition-all text-right group"><div class="flex items-center gap-4"><div class="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center"><i class="ti ti-palette text-primary text-2xl"></i></div> <div class="flex-1"><h3 class="text-base font-semibold text-foreground mb-1">\u062A\u0646\u0638\u06CC\u0645\u0627\u062A \u0638\u0627\u0647\u0631\u06CC</h3> <span class="text-xs text-primary font-medium">${ssrInterpolate(getCurrentThemeLabel())}</span></div> <i class="ti ti-chevron-left text-muted-foreground group-hover:text-foreground transition-colors"></i></div></button> <button class="bg-card border border-border rounded-xl p-5 hover:bg-accent hover:border-primary/30 transition-all text-right group"><div class="flex items-center gap-4"><div class="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center"><i class="ti ti-language text-primary text-2xl"></i></div> <div class="flex-1"><h3 class="text-base font-semibold text-foreground mb-1">\u062A\u0646\u0638\u06CC\u0645\u0627\u062A \u0632\u0628\u0627\u0646</h3> <span class="text-xs text-primary font-medium">${ssrInterpolate(getCurrentLanguageLabel())}</span></div> <i class="ti ti-chevron-left text-muted-foreground group-hover:text-foreground transition-colors"></i></div></button> <button class="bg-card border border-border rounded-xl p-5 hover:bg-accent hover:border-primary/30 transition-all text-right group"><div class="flex items-center gap-4"><div class="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center"><i class="ti ti-bell text-primary text-2xl"></i></div> <div class="flex-1"><h3 class="text-base font-semibold text-foreground">\u0627\u0639\u0644\u0627\u0646\u200C\u0647\u0627</h3></div> <i class="ti ti-chevron-left text-muted-foreground group-hover:text-foreground transition-colors"></i></div></button> `);
      if (showBiometricOption.value) {
        _push(`<button class="bg-card border border-border rounded-xl p-5 hover:bg-accent hover:border-primary/30 transition-all text-right group"><div class="flex items-center gap-4"><div class="w-12 h-12 rounded-lg bg-blue-500/10 flex items-center justify-center"><i class="ti ti-face-id text-blue-500 text-2xl"></i></div> <div class="flex-1"><h3 class="text-base font-semibold text-foreground mb-1">Face ID / Touch ID</h3> `);
        if (isBiometricEnabled.value) {
          _push(`<span class="text-xs text-primary font-medium">\u0641\u0639\u0627\u0644</span>`);
        } else {
          _push(`<span class="text-xs text-muted-foreground font-medium">\u063A\u06CC\u0631\u0641\u0639\u0627\u0644</span>`);
        }
        _push(`</div> <i class="ti ti-chevron-left text-muted-foreground group-hover:text-foreground transition-colors"></i></div></button>`);
      } else {
        _push(`<!---->`);
      }
      _push(` <button disabled class="bg-card border border-border rounded-xl p-5 opacity-50 cursor-not-allowed text-right"><div class="flex items-center gap-4"><div class="w-12 h-12 rounded-lg bg-muted flex items-center justify-center"><i class="ti ti-key text-muted-foreground text-2xl"></i></div> <div class="flex-1"><h3 class="text-base font-semibold text-foreground">\u062A\u063A\u06CC\u06CC\u0631 \u0631\u0645\u0632 \u0639\u0628\u0648\u0631</h3></div> <span class="text-xs bg-muted px-2 py-1 rounded text-muted-foreground">\u0628\u0632\u0648\u062F\u06CC</span></div></button> <button disabled class="bg-card border border-border rounded-xl p-5 opacity-50 cursor-not-allowed text-right"><div class="flex items-center gap-4"><div class="w-12 h-12 rounded-lg bg-muted flex items-center justify-center"><i class="ti ti-map text-muted-foreground text-2xl"></i></div> <div class="flex-1"><h3 class="text-base font-semibold text-foreground">\u062A\u0646\u0638\u06CC\u0645\u0627\u062A \u0646\u0642\u0634\u0647</h3></div> <span class="text-xs bg-muted px-2 py-1 rounded text-muted-foreground">\u0628\u0632\u0648\u062F\u06CC</span></div></button></div></div></div> `);
      _push(ssrRenderComponent(_component_UiBottomSheet, {
        modelValue: isThemeSheetOpen.value,
        "onUpdate:modelValue": ($event) => isThemeSheetOpen.value = $event,
        title: "\u062A\u0646\u0638\u06CC\u0645\u0627\u062A \u0638\u0627\u0647\u0631\u06CC",
        size: "auto",
        closable: true,
        "close-on-backdrop": false
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="px-6 py-6 space-y-6"${_scopeId}><div class="space-y-4"${_scopeId}><div class="flex items-center gap-3"${_scopeId}><div class="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center"${_scopeId}><i class="ti ti-palette text-primary text-xl"${_scopeId}></i></div> <div${_scopeId}><h4 class="text-base font-semibold text-foreground"${_scopeId}>\u062D\u0627\u0644\u062A \u062A\u0645</h4> <p class="text-xs text-muted-foreground"${_scopeId}>\u0627\u0646\u062A\u062E\u0627\u0628 \u062D\u0627\u0644\u062A \u0631\u0648\u0634\u0646 \u06CC\u0627 \u062A\u0627\u0631\u06CC\u06A9</p></div></div> <div class="grid grid-cols-3 gap-3"${_scopeId}><button class="${ssrRenderClass([
              "flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all duration-200 focus:outline-none focus-visible:outline-none",
              currentThemeMode.value === "light" ? "border-primary bg-primary/5 shadow-sm" : "border-border bg-card hover:border-primary/50 hover:bg-accent"
            ])}"${_scopeId}><div class="${ssrRenderClass([
              "w-12 h-12 rounded-full flex items-center justify-center transition-colors",
              currentThemeMode.value === "light" ? "bg-yellow-500/20" : "bg-muted"
            ])}"${_scopeId}><i class="ti ti-sun text-yellow-600 text-2xl"${_scopeId}></i></div> <span class="text-sm font-medium text-foreground"${_scopeId}>\u0631\u0648\u0634\u0646</span></button> <button class="${ssrRenderClass([
              "flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all duration-200 focus:outline-none focus-visible:outline-none",
              currentThemeMode.value === "dark" ? "border-primary bg-primary/5 shadow-sm" : "border-border bg-card hover:border-primary/50 hover:bg-accent"
            ])}"${_scopeId}><div class="${ssrRenderClass([
              "w-12 h-12 rounded-full flex items-center justify-center transition-colors",
              currentThemeMode.value === "dark" ? "bg-blue-500/20" : "bg-muted"
            ])}"${_scopeId}><i class="ti ti-moon text-blue-600 text-2xl"${_scopeId}></i></div> <span class="text-sm font-medium text-foreground"${_scopeId}>\u062A\u0627\u0631\u06CC\u06A9</span></button> <button class="${ssrRenderClass([
              "flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all duration-200 focus:outline-none focus-visible:outline-none",
              currentThemeMode.value === "system" ? "border-primary bg-primary/5 shadow-sm" : "border-border bg-card hover:border-primary/50 hover:bg-accent"
            ])}"${_scopeId}><div class="${ssrRenderClass([
              "w-12 h-12 rounded-full flex items-center justify-center transition-colors",
              currentThemeMode.value === "system" ? "bg-green-500/20" : "bg-muted"
            ])}"${_scopeId}><i class="ti ti-device-desktop text-green-600 text-2xl"${_scopeId}></i></div> <span class="text-sm font-medium text-foreground"${_scopeId}>\u0633\u06CC\u0633\u062A\u0645</span></button></div></div> <div class="space-y-4"${_scopeId}><div class="flex items-center gap-3"${_scopeId}><div class="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center"${_scopeId}><i class="ti ti-color-swatch text-primary text-xl"${_scopeId}></i></div> <div${_scopeId}><h4 class="text-base font-semibold text-foreground"${_scopeId}>\u0631\u0646\u06AF \u0627\u0635\u0644\u06CC</h4> <p class="text-xs text-muted-foreground"${_scopeId}>\u0627\u0646\u062A\u062E\u0627\u0628 \u0631\u0646\u06AF \u062A\u0645 \u0627\u067E\u0644\u06CC\u06A9\u06CC\u0634\u0646</p></div></div> `);
            _push2(ssrRenderComponent(_component_ClientOnly, null, {}, _parent2, _scopeId));
            _push2(`</div> <div class="pt-2"${_scopeId}><button class="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-medium py-3.5 px-6 rounded-xl transition-all duration-200 hover:shadow-md flex items-center justify-center gap-2"${_scopeId}><i class="ti ti-check text-lg"${_scopeId}></i> <span${_scopeId}>\u0627\u0639\u0645\u0627\u0644 \u062A\u063A\u06CC\u06CC\u0631\u0627\u062A</span></button></div></div>`);
          } else {
            return [
              createVNode("div", { class: "px-6 py-6 space-y-6" }, [
                createVNode("div", { class: "space-y-4" }, [
                  createVNode("div", { class: "flex items-center gap-3" }, [
                    createVNode("div", { class: "w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center" }, [
                      createVNode("i", { class: "ti ti-palette text-primary text-xl" })
                    ]),
                    createTextVNode(),
                    createVNode("div", null, [
                      createVNode("h4", { class: "text-base font-semibold text-foreground" }, "\u062D\u0627\u0644\u062A \u062A\u0645"),
                      createTextVNode(),
                      createVNode("p", { class: "text-xs text-muted-foreground" }, "\u0627\u0646\u062A\u062E\u0627\u0628 \u062D\u0627\u0644\u062A \u0631\u0648\u0634\u0646 \u06CC\u0627 \u062A\u0627\u0631\u06CC\u06A9")
                    ])
                  ]),
                  createTextVNode(),
                  createVNode("div", { class: "grid grid-cols-3 gap-3" }, [
                    createVNode("button", {
                      onClick: ($event) => handleThemeModeChange("light"),
                      class: [
                        "flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all duration-200 focus:outline-none focus-visible:outline-none",
                        currentThemeMode.value === "light" ? "border-primary bg-primary/5 shadow-sm" : "border-border bg-card hover:border-primary/50 hover:bg-accent"
                      ]
                    }, [
                      createVNode("div", {
                        class: [
                          "w-12 h-12 rounded-full flex items-center justify-center transition-colors",
                          currentThemeMode.value === "light" ? "bg-yellow-500/20" : "bg-muted"
                        ]
                      }, [
                        createVNode("i", { class: "ti ti-sun text-yellow-600 text-2xl" })
                      ], 2),
                      createTextVNode(),
                      createVNode("span", { class: "text-sm font-medium text-foreground" }, "\u0631\u0648\u0634\u0646")
                    ], 10, ["onClick"]),
                    createTextVNode(),
                    createVNode("button", {
                      onClick: ($event) => handleThemeModeChange("dark"),
                      class: [
                        "flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all duration-200 focus:outline-none focus-visible:outline-none",
                        currentThemeMode.value === "dark" ? "border-primary bg-primary/5 shadow-sm" : "border-border bg-card hover:border-primary/50 hover:bg-accent"
                      ]
                    }, [
                      createVNode("div", {
                        class: [
                          "w-12 h-12 rounded-full flex items-center justify-center transition-colors",
                          currentThemeMode.value === "dark" ? "bg-blue-500/20" : "bg-muted"
                        ]
                      }, [
                        createVNode("i", { class: "ti ti-moon text-blue-600 text-2xl" })
                      ], 2),
                      createTextVNode(),
                      createVNode("span", { class: "text-sm font-medium text-foreground" }, "\u062A\u0627\u0631\u06CC\u06A9")
                    ], 10, ["onClick"]),
                    createTextVNode(),
                    createVNode("button", {
                      onClick: ($event) => handleThemeModeChange("system"),
                      class: [
                        "flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all duration-200 focus:outline-none focus-visible:outline-none",
                        currentThemeMode.value === "system" ? "border-primary bg-primary/5 shadow-sm" : "border-border bg-card hover:border-primary/50 hover:bg-accent"
                      ]
                    }, [
                      createVNode("div", {
                        class: [
                          "w-12 h-12 rounded-full flex items-center justify-center transition-colors",
                          currentThemeMode.value === "system" ? "bg-green-500/20" : "bg-muted"
                        ]
                      }, [
                        createVNode("i", { class: "ti ti-device-desktop text-green-600 text-2xl" })
                      ], 2),
                      createTextVNode(),
                      createVNode("span", { class: "text-sm font-medium text-foreground" }, "\u0633\u06CC\u0633\u062A\u0645")
                    ], 10, ["onClick"])
                  ])
                ]),
                createTextVNode(),
                createVNode("div", { class: "space-y-4" }, [
                  createVNode("div", { class: "flex items-center gap-3" }, [
                    createVNode("div", { class: "w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center" }, [
                      createVNode("i", { class: "ti ti-color-swatch text-primary text-xl" })
                    ]),
                    createTextVNode(),
                    createVNode("div", null, [
                      createVNode("h4", { class: "text-base font-semibold text-foreground" }, "\u0631\u0646\u06AF \u0627\u0635\u0644\u06CC"),
                      createTextVNode(),
                      createVNode("p", { class: "text-xs text-muted-foreground" }, "\u0627\u0646\u062A\u062E\u0627\u0628 \u0631\u0646\u06AF \u062A\u0645 \u0627\u067E\u0644\u06CC\u06A9\u06CC\u0634\u0646")
                    ])
                  ]),
                  createTextVNode(),
                  createVNode(_component_ClientOnly, null, {
                    default: withCtx(() => [
                      createVNode("div", { class: "flex gap-3 flex-wrap justify-start" }, [
                        (openBlock(), createBlock(Fragment, null, renderList(colorSchemes, (color) => {
                          return createVNode("button", {
                            key: color.name,
                            onClick: ($event) => handleColorSchemeChange(color.name),
                            class: [
                              "relative w-12 h-12 rounded-xl transition-all duration-200 p-1 focus:outline-none focus-visible:outline-none focus:ring-0",
                              currentColorScheme.value === color.name ? "shadow-lg ring-2 ring-offset-2" : "hover:shadow-md"
                            ],
                            style: currentColorScheme.value === color.name ? { "--tw-ring-color": color.color } : {},
                            title: getColorName(color.name)
                          }, [
                            createVNode("div", {
                              class: "w-full h-full rounded-lg border",
                              style: {
                                backgroundColor: color.color,
                                borderColor: color.color,
                                opacity: currentColorScheme.value === color.name ? "1" : "0.9"
                              }
                            }, [
                              currentColorScheme.value === color.name ? (openBlock(), createBlock("i", {
                                key: 0,
                                class: "ti ti-check text-white text-xl drop-shadow-lg absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
                              })) : createCommentVNode("", true)
                            ], 4)
                          ], 14, ["onClick", "title"]);
                        }), 64))
                      ])
                    ]),
                    _: 1
                  })
                ]),
                createTextVNode(),
                createVNode("div", { class: "pt-2" }, [
                  createVNode("button", {
                    onClick: applyThemeChanges,
                    class: "w-full bg-primary hover:bg-primary/90 text-primary-foreground font-medium py-3.5 px-6 rounded-xl transition-all duration-200 hover:shadow-md flex items-center justify-center gap-2"
                  }, [
                    createVNode("i", { class: "ti ti-check text-lg" }),
                    createTextVNode(),
                    createVNode("span", null, "\u0627\u0639\u0645\u0627\u0644 \u062A\u063A\u06CC\u06CC\u0631\u0627\u062A")
                  ])
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
        closable: true,
        "close-on-backdrop": true
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="px-6 py-4 pb-6"${_scopeId}><div class="space-y-2"${_scopeId}><button class="${ssrRenderClass([
              "w-full flex items-center justify-between p-4 rounded-xl border-2 transition-all duration-200",
              currentLanguage.value === "fa" ? "border-primary bg-primary/5 shadow-sm" : "border-border bg-card hover:border-primary/50 hover:bg-accent"
            ])}"${_scopeId}><div class="flex items-center gap-3"${_scopeId}><div class="w-10 h-10 rounded-full bg-green-500/10 flex items-center justify-center overflow-hidden"${_scopeId}><img${ssrRenderAttr("src", _imports_0)} alt="Iran" class="w-7 h-5 object-cover"${_scopeId}></div> <div class="text-right"${_scopeId}><div class="font-semibold text-foreground"${_scopeId}>\u0641\u0627\u0631\u0633\u06CC</div> <div class="text-xs text-muted-foreground"${_scopeId}>Persian</div></div></div> `);
            if (currentLanguage.value === "fa") {
              _push2(`<i class="ti ti-check text-primary text-2xl"${_scopeId}></i>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</button> <button disabled class="w-full flex items-center justify-between p-4 rounded-xl border-2 transition-all opacity-50 cursor-not-allowed border-border bg-muted/30"${_scopeId}><div class="flex items-center gap-3"${_scopeId}><div class="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center overflow-hidden"${_scopeId}><img${ssrRenderAttr("src", _imports_1)} alt="USA" class="w-7 h-5 object-cover"${_scopeId}></div> <div class="text-right"${_scopeId}><div class="font-semibold text-foreground"${_scopeId}>English</div> <div class="text-xs text-muted-foreground"${_scopeId}>\u0628\u0647\u200C\u0632\u0648\u062F\u06CC</div></div></div> <div class="px-2 py-1 bg-muted rounded text-xs text-muted-foreground"${_scopeId}>\u0642\u0641\u0644</div></button> <button disabled class="w-full flex items-center justify-between p-4 rounded-xl border-2 transition-all opacity-50 cursor-not-allowed border-border bg-muted/30"${_scopeId}><div class="flex items-center gap-3"${_scopeId}><div class="w-10 h-10 rounded-full bg-yellow-500/10 flex items-center justify-center overflow-hidden"${_scopeId}><img${ssrRenderAttr("src", _imports_2)} alt="Saudi Arabia" class="w-7 h-5 object-cover"${_scopeId}></div> <div class="text-right"${_scopeId}><div class="font-semibold text-foreground"${_scopeId}>\u0627\u0644\u0639\u0631\u0628\u064A\u0629</div> <div class="text-xs text-muted-foreground"${_scopeId}>\u0628\u0647\u200C\u0632\u0648\u062F\u06CC</div></div></div></button> <button disabled class="w-full flex items-center justify-between p-4 rounded-xl border-2 transition-all opacity-50 cursor-not-allowed border-border bg-muted/30"${_scopeId}><div class="flex items-center gap-3"${_scopeId}><div class="w-10 h-10 rounded-full bg-red-500/10 flex items-center justify-center overflow-hidden"${_scopeId}><img${ssrRenderAttr("src", _imports_3)} alt="Turkey" class="w-7 h-5 object-cover"${_scopeId}></div> <div class="text-right"${_scopeId}><div class="font-semibold text-foreground"${_scopeId}>T\xFCrk\xE7e</div> <div class="text-xs text-muted-foreground"${_scopeId}>\u0628\u0647\u200C\u0632\u0648\u062F\u06CC</div></div></div></button></div></div>`);
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
      _push(` `);
      _push(ssrRenderComponent(_component_UiBottomSheet, {
        modelValue: isBiometricSheetOpen.value,
        "onUpdate:modelValue": ($event) => isBiometricSheetOpen.value = $event,
        title: "Face ID / Touch ID",
        size: "auto",
        closable: true,
        "close-on-backdrop": true
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="px-6 py-4 pb-6"${_scopeId}><div class="text-center mb-6"${_scopeId}><div class="w-20 h-20 mx-auto rounded-full bg-blue-500/10 flex items-center justify-center mb-4"${_scopeId}><i class="ti ti-face-id text-blue-500 text-4xl"${_scopeId}></i></div> <h3 class="text-lg font-semibold text-foreground mb-2"${_scopeId}>${ssrInterpolate(isBiometricEnabled.value ? "Face ID \u0641\u0639\u0627\u0644 \u0627\u0633\u062A" : "Face ID / Touch ID")}</h3> <p class="text-sm text-muted-foreground"${_scopeId}>${ssrInterpolate(isBiometricEnabled.value ? "\u0645\u06CC\u200C\u062A\u0648\u0627\u0646\u06CC\u062F \u0628\u0627 Face ID \u06CC\u0627 Touch ID \u0648\u0627\u0631\u062F \u062D\u0633\u0627\u0628 \u062E\u0648\u062F \u0634\u0648\u06CC\u062F" : "\u0628\u0631\u0627\u06CC \u0648\u0631\u0648\u062F \u0633\u0631\u06CC\u0639\u200C\u062A\u0631\u060C Face ID \u06CC\u0627 Touch ID \u0631\u0627 \u0641\u0639\u0627\u0644 \u06A9\u0646\u06CC\u062F")}</p></div> <button${ssrIncludeBooleanAttr(unref(isWebAuthnLoading)) ? " disabled" : ""} class="${ssrRenderClass([
              "w-full py-3.5 px-6 rounded-xl font-medium transition-all duration-200 flex items-center justify-center gap-2",
              isBiometricEnabled.value ? "bg-destructive/10 text-destructive hover:bg-destructive/20" : "bg-primary text-primary-foreground hover:bg-primary/90"
            ])}"${_scopeId}>`);
            if (unref(isWebAuthnLoading)) {
              _push2(`<!--[--><div class="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin"${_scopeId}></div> <span${_scopeId}>\u062F\u0631 \u062D\u0627\u0644 \u067E\u0631\u062F\u0627\u0632\u0634...</span><!--]-->`);
            } else {
              _push2(`<!--[--><i class="${ssrRenderClass([isBiometricEnabled.value ? "ti ti-x" : "ti ti-check", "text-lg"])}"${_scopeId}></i> <span${_scopeId}>${ssrInterpolate(isBiometricEnabled.value ? "\u063A\u06CC\u0631\u0641\u0639\u0627\u0644 \u06A9\u0631\u062F\u0646" : "\u0641\u0639\u0627\u0644\u200C\u0633\u0627\u0632\u06CC")}</span><!--]-->`);
            }
            _push2(`</button> <p class="text-xs text-muted-foreground text-center mt-4"${_scopeId}>
          \u0627\u06CC\u0646 \u0642\u0627\u0628\u0644\u06CC\u062A \u0641\u0642\u0637 \u062F\u0631 \u062F\u0633\u062A\u06AF\u0627\u0647\u200C\u0647\u0627\u06CC \u067E\u0634\u062A\u06CC\u0628\u0627\u0646\u06CC\u200C\u06A9\u0646\u0646\u062F\u0647 Face ID / Touch ID \u06A9\u0627\u0631 \u0645\u06CC\u200C\u06A9\u0646\u062F
        </p></div>`);
          } else {
            return [
              createVNode("div", { class: "px-6 py-4 pb-6" }, [
                createVNode("div", { class: "text-center mb-6" }, [
                  createVNode("div", { class: "w-20 h-20 mx-auto rounded-full bg-blue-500/10 flex items-center justify-center mb-4" }, [
                    createVNode("i", { class: "ti ti-face-id text-blue-500 text-4xl" })
                  ]),
                  createTextVNode(),
                  createVNode("h3", { class: "text-lg font-semibold text-foreground mb-2" }, toDisplayString(isBiometricEnabled.value ? "Face ID \u0641\u0639\u0627\u0644 \u0627\u0633\u062A" : "Face ID / Touch ID"), 1),
                  createTextVNode(),
                  createVNode("p", { class: "text-sm text-muted-foreground" }, toDisplayString(isBiometricEnabled.value ? "\u0645\u06CC\u200C\u062A\u0648\u0627\u0646\u06CC\u062F \u0628\u0627 Face ID \u06CC\u0627 Touch ID \u0648\u0627\u0631\u062F \u062D\u0633\u0627\u0628 \u062E\u0648\u062F \u0634\u0648\u06CC\u062F" : "\u0628\u0631\u0627\u06CC \u0648\u0631\u0648\u062F \u0633\u0631\u06CC\u0639\u200C\u062A\u0631\u060C Face ID \u06CC\u0627 Touch ID \u0631\u0627 \u0641\u0639\u0627\u0644 \u06A9\u0646\u06CC\u062F"), 1)
                ]),
                createTextVNode(),
                createVNode("button", {
                  onClick: handleBiometricToggle,
                  disabled: unref(isWebAuthnLoading),
                  class: [
                    "w-full py-3.5 px-6 rounded-xl font-medium transition-all duration-200 flex items-center justify-center gap-2",
                    isBiometricEnabled.value ? "bg-destructive/10 text-destructive hover:bg-destructive/20" : "bg-primary text-primary-foreground hover:bg-primary/90"
                  ]
                }, [
                  unref(isWebAuthnLoading) ? (openBlock(), createBlock(Fragment, { key: 0 }, [
                    createVNode("div", { class: "w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" }),
                    createTextVNode(),
                    createVNode("span", null, "\u062F\u0631 \u062D\u0627\u0644 \u067E\u0631\u062F\u0627\u0632\u0634...")
                  ], 64)) : (openBlock(), createBlock(Fragment, { key: 1 }, [
                    createVNode("i", {
                      class: [isBiometricEnabled.value ? "ti ti-x" : "ti ti-check", "text-lg"]
                    }, null, 2),
                    createTextVNode(),
                    createVNode("span", null, toDisplayString(isBiometricEnabled.value ? "\u063A\u06CC\u0631\u0641\u0639\u0627\u0644 \u06A9\u0631\u062F\u0646" : "\u0641\u0639\u0627\u0644\u200C\u0633\u0627\u0632\u06CC"), 1)
                  ], 64))
                ], 10, ["disabled"]),
                createTextVNode(),
                createVNode("p", { class: "text-xs text-muted-foreground text-center mt-4" }, "\r\n          \u0627\u06CC\u0646 \u0642\u0627\u0628\u0644\u06CC\u062A \u0641\u0642\u0637 \u062F\u0631 \u062F\u0633\u062A\u06AF\u0627\u0647\u200C\u0647\u0627\u06CC \u067E\u0634\u062A\u06CC\u0628\u0627\u0646\u06CC\u200C\u06A9\u0646\u0646\u062F\u0647 Face ID / Touch ID \u06A9\u0627\u0631 \u0645\u06CC\u200C\u06A9\u0646\u062F\r\n        ")
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/settings/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=index-DL6bPulg.mjs.map
