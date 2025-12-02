import { e as __nuxt_component_0$2 } from './server.mjs';
import { defineComponent, ref, mergeProps, withCtx, createVNode, createTextVNode, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderAttr, ssrInterpolate } from 'vue/server-renderer';
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

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "index",
  __ssrInlineRender: true,
  setup(__props) {
    const supportPhone = ref("021-12345678");
    const supportEmail = ref("support@linku.im");
    const responseTime = ref("\u067E\u0627\u0633\u062E\u06AF\u0648\u06CC\u06CC: \u0634\u0646\u0628\u0647 \u062A\u0627 \u0686\u0647\u0627\u0631\u0634\u0646\u0628\u0647\u060C \u06F9 \u0635\u0628\u062D \u062A\u0627 \u06F6 \u0639\u0635\u0631");
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0$2;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "min-h-screen bg-background" }, _attrs))}><div class="fixed top-0 left-0 right-0 z-50 bg-card border-b border-border"><div class="flex items-center justify-between px-4 h-16"><button class="p-2 hover:bg-secondary rounded-lg transition-colors"><i class="ti ti-arrow-right text-primary text-xl"></i></button> <h1 class="text-lg font-bold text-foreground">\u067E\u0634\u062A\u06CC\u0628\u0627\u0646\u06CC</h1> <div class="w-10"></div></div></div> <div class="pt-[68px] pb-6 px-3"><div class="space-y-4">`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/dashboard/support/online",
        class: "block bg-card rounded-2xl p-6 shadow-sm border border-border hover:bg-accent transition-all group"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="flex items-center gap-4"${_scopeId}><div class="w-14 h-14 rounded-xl bg-green-500/10 flex items-center justify-center flex-shrink-0 group-hover:bg-green-500/20 transition-colors"${_scopeId}><i class="ti ti-message-circle text-green-500 text-2xl"${_scopeId}></i></div> <div class="flex-1"${_scopeId}><h3 class="text-base font-semibold text-foreground mb-1"${_scopeId}>\u067E\u0634\u062A\u06CC\u0628\u0627\u0646\u06CC \u0622\u0646\u0644\u0627\u06CC\u0646</h3> <p class="text-sm text-muted-foreground"${_scopeId}>\u06AF\u0641\u062A\u06AF\u0648 \u0628\u0627 \u062A\u06CC\u0645 \u067E\u0634\u062A\u06CC\u0628\u0627\u0646\u06CC</p></div> <i class="ti ti-chevron-left text-muted-foreground group-hover:text-foreground transition-colors"${_scopeId}></i></div>`);
          } else {
            return [
              createVNode("div", { class: "flex items-center gap-4" }, [
                createVNode("div", { class: "w-14 h-14 rounded-xl bg-green-500/10 flex items-center justify-center flex-shrink-0 group-hover:bg-green-500/20 transition-colors" }, [
                  createVNode("i", { class: "ti ti-message-circle text-green-500 text-2xl" })
                ]),
                createTextVNode(),
                createVNode("div", { class: "flex-1" }, [
                  createVNode("h3", { class: "text-base font-semibold text-foreground mb-1" }, "\u067E\u0634\u062A\u06CC\u0628\u0627\u0646\u06CC \u0622\u0646\u0644\u0627\u06CC\u0646"),
                  createTextVNode(),
                  createVNode("p", { class: "text-sm text-muted-foreground" }, "\u06AF\u0641\u062A\u06AF\u0648 \u0628\u0627 \u062A\u06CC\u0645 \u067E\u0634\u062A\u06CC\u0628\u0627\u0646\u06CC")
                ]),
                createTextVNode(),
                createVNode("i", { class: "ti ti-chevron-left text-muted-foreground group-hover:text-foreground transition-colors" })
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(` `);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/dashboard/support/faq",
        class: "block bg-card rounded-2xl p-6 shadow-sm border border-border hover:bg-accent transition-all group"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="flex items-center gap-4"${_scopeId}><div class="w-14 h-14 rounded-xl bg-blue-500/10 flex items-center justify-center flex-shrink-0 group-hover:bg-blue-500/20 transition-colors"${_scopeId}><i class="ti ti-help text-blue-500 text-2xl"${_scopeId}></i></div> <div class="flex-1"${_scopeId}><h3 class="text-base font-semibold text-foreground mb-1"${_scopeId}>\u0633\u0648\u0627\u0644\u0627\u062A \u0645\u062A\u062F\u0627\u0648\u0644</h3> <p class="text-sm text-muted-foreground"${_scopeId}>\u067E\u0627\u0633\u062E \u0633\u0648\u0627\u0644\u0627\u062A \u067E\u0631\u062A\u06A9\u0631\u0627\u0631</p></div> <i class="ti ti-chevron-left text-muted-foreground group-hover:text-foreground transition-colors"${_scopeId}></i></div>`);
          } else {
            return [
              createVNode("div", { class: "flex items-center gap-4" }, [
                createVNode("div", { class: "w-14 h-14 rounded-xl bg-blue-500/10 flex items-center justify-center flex-shrink-0 group-hover:bg-blue-500/20 transition-colors" }, [
                  createVNode("i", { class: "ti ti-help text-blue-500 text-2xl" })
                ]),
                createTextVNode(),
                createVNode("div", { class: "flex-1" }, [
                  createVNode("h3", { class: "text-base font-semibold text-foreground mb-1" }, "\u0633\u0648\u0627\u0644\u0627\u062A \u0645\u062A\u062F\u0627\u0648\u0644"),
                  createTextVNode(),
                  createVNode("p", { class: "text-sm text-muted-foreground" }, "\u067E\u0627\u0633\u062E \u0633\u0648\u0627\u0644\u0627\u062A \u067E\u0631\u062A\u06A9\u0631\u0627\u0631")
                ]),
                createTextVNode(),
                createVNode("i", { class: "ti ti-chevron-left text-muted-foreground group-hover:text-foreground transition-colors" })
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(` <a${ssrRenderAttr("href", "tel:" + supportPhone.value)} class="block bg-card rounded-2xl p-6 shadow-sm border border-border hover:bg-accent transition-all group"><div class="flex items-center gap-4"><div class="w-14 h-14 rounded-xl bg-purple-500/10 flex items-center justify-center flex-shrink-0 group-hover:bg-purple-500/20 transition-colors"><i class="ti ti-phone text-purple-500 text-2xl"></i></div> <div class="flex-1"><h3 class="text-base font-semibold text-foreground mb-1">\u062A\u0645\u0627\u0633 \u0628\u0627 \u067E\u0634\u062A\u06CC\u0628\u0627\u0646\u06CC</h3> <p class="text-sm text-muted-foreground">${ssrInterpolate(supportPhone.value)}</p></div> <i class="ti ti-chevron-left text-muted-foreground group-hover:text-foreground transition-colors"></i></div></a></div> <div class="mt-6 p-4 rounded-2xl bg-muted/50 border border-border"><p class="text-xs text-muted-foreground text-center mb-2"><i class="ti ti-clock text-sm ml-1"></i> ${ssrInterpolate(responseTime.value)}</p> <p class="text-xs text-muted-foreground text-center"><i class="ti ti-mail text-sm ml-1"></i> ${ssrInterpolate(supportEmail.value)}</p></div></div></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/dashboard/support/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=index-DoB2BuEE.mjs.map
