import { u as useAuthStore, c as __nuxt_component_0 } from './server.mjs';
import { defineComponent, useSSRContext, ref, computed, mergeProps, unref } from 'vue';
import { ssrInterpolate, ssrRenderComponent, ssrRenderAttrs, ssrRenderAttr } from 'vue/server-renderer';
import { useRoute, useRouter } from 'vue-router';
import { u as useUserStore } from './user-D1YL8aKq.mjs';
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
import 'axios';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "settings",
  __ssrInlineRender: true,
  setup(__props) {
    const userStore = useUserStore();
    useAuthStore();
    useFormStore();
    const route = useRoute();
    useRouter();
    const isDesktop = ref(false);
    const getPageTitle = (path) => {
      if (path === "/settings") return "\u062A\u0646\u0638\u06CC\u0645\u0627\u062A";
      if (path === "/settings/account-status") return "\u0648\u0636\u0639\u06CC\u062A \u062D\u0633\u0627\u0628";
      return "\u062A\u0646\u0638\u06CC\u0645\u0627\u062A";
    };
    const pageTitle = computed(() => getPageTitle(route.path));
    return (_ctx, _push, _parent, _attrs) => {
      var _a, _b;
      const _component_NuxtPage = __nuxt_component_0;
      if (!isDesktop.value) {
        _push(`<div class="flex flex-col min-h-screen bg-primary" data-v-e6b41fd8><header class="sticky top-0 z-30 bg-primary border-b border-border" data-v-e6b41fd8><div class="flex items-center justify-between px-4 h-16" data-v-e6b41fd8><button class="w-10 h-10 flex items-center justify-center rounded-full hover:bg-secondary transition-colors" data-v-e6b41fd8><i class="ti ti-arrow-right text-2xl text-primary" data-v-e6b41fd8></i></button> <h1 class="text-lg font-bold text-primary" data-v-e6b41fd8>${ssrInterpolate(pageTitle.value)}</h1> <div class="w-10" data-v-e6b41fd8></div></div></header> <main class="flex-1 overflow-y-auto" data-v-e6b41fd8><div class="max-w-2xl mx-auto p-4" data-v-e6b41fd8>`);
        _push(ssrRenderComponent(_component_NuxtPage, null, null, _parent));
        _push(`</div></main></div>`);
      } else {
        _push(`<div${ssrRenderAttrs(mergeProps({ class: "flex bg-background min-h-screen overflow-hidden transition-colors duration-300" }, _attrs))} data-v-e6b41fd8><div class="flex-1 flex flex-col relative" data-v-e6b41fd8><header class="sticky top-0 z-30 bg-primary border-b border-border" data-v-e6b41fd8><div class="flex items-center justify-between px-6 h-20" data-v-e6b41fd8><button class="flex items-center gap-2 text-primary hover:text-accent transition-colors" data-v-e6b41fd8><i class="ti ti-arrow-right text-xl" data-v-e6b41fd8></i> <span class="text-sm font-medium" data-v-e6b41fd8>\u0628\u0627\u0632\u06AF\u0634\u062A</span></button> <h1 class="text-xl font-bold text-primary" data-v-e6b41fd8>${ssrInterpolate(pageTitle.value)}</h1> <div class="flex items-center gap-3" data-v-e6b41fd8><div class="text-left rtl:text-right" data-v-e6b41fd8><p class="text-sm font-medium text-primary" data-v-e6b41fd8>${ssrInterpolate((_a = unref(userStore).user) == null ? void 0 : _a.phone)}</p> <p class="text-xs text-primary opacity-60" data-v-e6b41fd8>${ssrInterpolate(unref(userStore).isUserPro ? "\u06A9\u0627\u0631\u0628\u0631 \u062D\u0631\u0641\u0647\u200C\u0627\u06CC" : "\u06A9\u0627\u0631\u0628\u0631 \u0639\u0627\u062F\u06CC")}</p></div> <div class="w-10 h-10 rounded-full bg-primary flex items-center justify-center overflow-hidden" data-v-e6b41fd8>`);
        if ((_b = unref(userStore).user) == null ? void 0 : _b.avatar) {
          _push(`<img${ssrRenderAttr("src", unref(userStore).user.avatar)} alt="User" class="w-full h-full object-cover" data-v-e6b41fd8>`);
        } else {
          _push(`<i class="ti ti-user text-xl text-primary" data-v-e6b41fd8></i>`);
        }
        _push(`</div></div></div></header> <main class="flex-1 overflow-y-auto p-6" data-v-e6b41fd8><div class="max-w-4xl mx-auto" data-v-e6b41fd8>`);
        _push(ssrRenderComponent(_component_NuxtPage, null, null, _parent));
        _push(`</div></main></div></div>`);
      }
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("layouts/settings.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const settings = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-e6b41fd8"]]);

export { settings as default };
//# sourceMappingURL=settings-C7ArYxN-.mjs.map
