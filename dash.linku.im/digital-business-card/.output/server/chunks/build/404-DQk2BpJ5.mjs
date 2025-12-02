import { d as useHead, e as __nuxt_component_0$2 } from './server.mjs';
import { mergeProps, withCtx, createVNode, createTextVNode, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent } from 'vue/server-renderer';
import { useRouter } from 'vue-router';
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

const _sfc_main = {
  __name: "404",
  __ssrInlineRender: true,
  setup(__props) {
    useRouter();
    useHead({
      title: "404 - \u0635\u0641\u062D\u0647 \u06CC\u0627\u0641\u062A \u0646\u0634\u062F",
      meta: [
        { name: "robots", content: "noindex, nofollow" }
      ]
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0$2;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "min-h-screen flex items-center justify-center bg-background px-4 transition-colors duration-300" }, _attrs))} data-v-c4d7976e><div class="max-w-2xl w-full text-center" data-v-c4d7976e><div class="relative mb-8" data-v-c4d7976e><div class="flex items-center justify-center gap-4" data-v-c4d7976e><div class="text-[120px] md:text-[160px] font-black text-foreground leading-none animate-bounce-slow" data-v-c4d7976e>
            4
          </div> <div class="relative" data-v-c4d7976e><div class="w-24 h-24 md:w-32 md:h-32 rounded-full border-4 border-border bg-card flex items-center justify-center animate-spin-slow" data-v-c4d7976e><i class="ti ti-search text-4xl md:text-5xl text-foreground" data-v-c4d7976e></i></div> <div class="absolute -top-2 -right-2 w-8 h-8 bg-red-500 rounded-full flex items-center justify-center animate-ping" data-v-c4d7976e><i class="ti ti-x text-white text-sm" data-v-c4d7976e></i></div></div> <div class="text-[120px] md:text-[160px] font-black text-foreground leading-none animate-bounce-slow animation-delay-200" data-v-c4d7976e>
            4
          </div></div></div> <div class="mb-8 space-y-3" data-v-c4d7976e><h1 class="text-3xl md:text-4xl font-bold text-foreground" data-v-c4d7976e>
          \u0635\u0641\u062D\u0647 \u0645\u0648\u0631\u062F \u0646\u0638\u0631 \u06CC\u0627\u0641\u062A \u0646\u0634\u062F!
        </h1> <p class="text-base md:text-lg text-muted-foreground max-w-md mx-auto" data-v-c4d7976e>
          \u0645\u062A\u0623\u0633\u0641\u0627\u0646\u0647 \u0635\u0641\u062D\u0647\u200C\u0627\u06CC \u06A9\u0647 \u0628\u0647 \u062F\u0646\u0628\u0627\u0644 \u0622\u0646 \u0647\u0633\u062A\u06CC\u062F \u0648\u062C\u0648\u062F \u0646\u062F\u0627\u0631\u062F \u06CC\u0627 \u0645\u0645\u06A9\u0646 \u0627\u0633\u062A \u0645\u0646\u062A\u0642\u0644 \u0634\u062F\u0647 \u0628\u0627\u0634\u062F.
        </p></div> <div class="flex flex-col sm:flex-row items-center justify-center gap-4" data-v-c4d7976e>`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/",
        class: "group w-full sm:w-auto px-8 py-4 bg-primary text-primary-foreground rounded-lg font-semibold text-center transition-all duration-300 hover:opacity-90 hover:-translate-y-0.5 shadow-lg flex items-center justify-center gap-2"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<i class="ti ti-home text-xl" data-v-c4d7976e${_scopeId}></i> <span data-v-c4d7976e${_scopeId}>\u0628\u0627\u0632\u06AF\u0634\u062A \u0628\u0647 \u0635\u0641\u062D\u0647 \u0627\u0635\u0644\u06CC</span>`);
          } else {
            return [
              createVNode("i", { class: "ti ti-home text-xl" }),
              createTextVNode(),
              createVNode("span", null, "\u0628\u0627\u0632\u06AF\u0634\u062A \u0628\u0647 \u0635\u0641\u062D\u0647 \u0627\u0635\u0644\u06CC")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(` <button class="group w-full sm:w-auto px-8 py-4 bg-card text-foreground border-2 border-border rounded-lg font-semibold transition-all duration-300 hover:bg-accent hover:border-accent flex items-center justify-center gap-2" data-v-c4d7976e><i class="ti ti-arrow-right text-xl" data-v-c4d7976e></i> <span data-v-c4d7976e>\u0628\u0627\u0632\u06AF\u0634\u062A \u0628\u0647 \u0635\u0641\u062D\u0647 \u0642\u0628\u0644</span></button></div> <div class="mt-12 flex items-center justify-center gap-8 opacity-40" data-v-c4d7976e><div class="w-16 h-1 bg-border rounded-full" data-v-c4d7976e></div> <i class="ti ti-ghost text-3xl text-foreground" data-v-c4d7976e></i> <div class="w-16 h-1 bg-border rounded-full" data-v-c4d7976e></div></div> <div class="mt-8 flex items-center justify-center gap-6 text-sm" data-v-c4d7976e>`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/dashboard",
        class: "text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<i class="ti ti-layout-dashboard text-lg" data-v-c4d7976e${_scopeId}></i> <span data-v-c4d7976e${_scopeId}>\u062F\u0627\u0634\u0628\u0648\u0631\u062F</span>`);
          } else {
            return [
              createVNode("i", { class: "ti ti-layout-dashboard text-lg" }),
              createTextVNode(),
              createVNode("span", null, "\u062F\u0627\u0634\u0628\u0648\u0631\u062F")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(` `);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/dashboard/support",
        class: "text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<i class="ti ti-help text-lg" data-v-c4d7976e${_scopeId}></i> <span data-v-c4d7976e${_scopeId}>\u067E\u0634\u062A\u06CC\u0628\u0627\u0646\u06CC</span>`);
          } else {
            return [
              createVNode("i", { class: "ti ti-help text-lg" }),
              createTextVNode(),
              createVNode("span", null, "\u067E\u0634\u062A\u06CC\u0628\u0627\u0646\u06CC")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div></div></div>`);
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/404.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const _404 = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-c4d7976e"]]);

export { _404 as default };
//# sourceMappingURL=404-DQk2BpJ5.mjs.map
