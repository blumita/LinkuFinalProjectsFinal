import { defineComponent, ref, mergeProps, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderList, ssrInterpolate, ssrRenderClass, ssrRenderStyle } from 'vue/server-renderer';
import { a as useNuxtApp } from './server.mjs';
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
  __name: "faq",
  __ssrInlineRender: true,
  setup(__props) {
    const { $axios } = useNuxtApp();
    const loading = ref(true);
    const openFaq = ref(null);
    const faqs = ref([]);
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "min-h-screen bg-background" }, _attrs))}><div class="fixed top-0 left-0 right-0 z-50 bg-card border-b border-border"><div class="flex items-center justify-between px-4 h-16"><button class="p-2 hover:bg-secondary rounded-lg transition-colors"><i class="ti ti-arrow-right text-primary text-xl"></i></button> <h1 class="text-lg font-bold text-foreground">\u0633\u0648\u0627\u0644\u0627\u062A \u0645\u062A\u062F\u0627\u0648\u0644</h1> <div class="w-10"></div></div></div> <div class="pt-20 lg:pt-10 pb-6 px-4">`);
      if (loading.value) {
        _push(`<div class="space-y-3"><!--[-->`);
        ssrRenderList(5, (n) => {
          _push(`<div class="bg-card rounded-xl p-4 shadow-sm border border-border animate-pulse"><div class="flex items-center gap-3"><div class="w-5 h-5 bg-muted rounded"></div> <div class="h-4 flex-1 bg-muted rounded"></div> <div class="w-4 h-4 bg-muted rounded"></div></div></div>`);
        });
        _push(`<!--]--></div>`);
      } else if (!loading.value && faqs.value.length === 0) {
        _push(`<div class="text-center py-12"><div class="w-20 h-20 rounded-full bg-muted/50 flex items-center justify-center mx-auto mb-4"><i class="ti ti-help text-4xl text-muted-foreground"></i></div> <h3 class="text-lg font-semibold text-foreground mb-2">\u0633\u0648\u0627\u0644\u06CC \u06CC\u0627\u0641\u062A \u0646\u0634\u062F</h3> <p class="text-sm text-muted-foreground">\u062F\u0631 \u062D\u0627\u0644 \u062D\u0627\u0636\u0631 \u0633\u0648\u0627\u0644 \u0645\u062A\u062F\u0627\u0648\u0644\u06CC \u0645\u0648\u062C\u0648\u062F \u0646\u06CC\u0633\u062A</p></div>`);
      } else {
        _push(`<div class="space-y-3"><!--[-->`);
        ssrRenderList(faqs.value, (faq, index) => {
          _push(`<div class="bg-card rounded-xl shadow-sm border border-border overflow-hidden"><button class="w-full flex items-center justify-between p-4 text-right hover:bg-secondary/50 transition-colors"><div class="flex items-center gap-3 flex-1 min-w-0"><i class="ti ti-help-circle text-primary flex-shrink-0"></i> <span class="font-medium text-foreground text-sm">${ssrInterpolate(faq.question)}</span></div> <i class="${ssrRenderClass([openFaq.value === index ? "ti ti-chevron-up" : "ti ti-chevron-down", "text-muted-foreground transition-transform flex-shrink-0 text-lg"])}"></i></button> <div style="${ssrRenderStyle(openFaq.value === index ? null : { display: "none" })}" class="px-4 pb-4 text-sm text-muted-foreground border-t border-border bg-muted/20 overflow-hidden"><div class="pt-3 leading-relaxed">${ssrInterpolate(faq.answer)}</div></div></div>`);
        });
        _push(`<!--]--></div>`);
      }
      _push(`</div></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/dashboard/support/faq.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=faq-CEA10G_G.mjs.map
