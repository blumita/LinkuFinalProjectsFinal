import { defineComponent, mergeProps, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent } from 'vue/server-renderer';
import { T as Transactions } from './index-BhNAySiu.mjs';
import { _ as _export_sfc } from './_plugin-vue_export-helper-1tPrXgE0.mjs';
import 'moment-jalaali';
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
import 'pinia';
import 'vue-router';
import 'axios';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "PaymentHistoryPage",
  __ssrInlineRender: true,
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "min-h-screen bg-background pb-24" }, _attrs))} data-v-cc9d9b4f><div class="bg-card border-b border-border sticky top-0 z-10" data-v-cc9d9b4f><div class="max-w-4xl mx-auto px-4 py-4" data-v-cc9d9b4f><div class="flex items-center gap-3" data-v-cc9d9b4f><button class="w-10 h-10 flex items-center justify-center rounded-xl bg-background hover:bg-secondary transition-colors" data-v-cc9d9b4f><i class="ti ti-arrow-right text-xl text-primary" data-v-cc9d9b4f></i></button> <div data-v-cc9d9b4f><h1 class="text-xl font-bold text-primary" data-v-cc9d9b4f>\u062A\u0627\u0631\u06CC\u062E\u0686\u0647 \u067E\u0631\u062F\u0627\u062E\u062A\u200C\u0647\u0627</h1> <p class="text-xs text-secondary" data-v-cc9d9b4f>\u06AF\u0632\u0627\u0631\u0634 \u06A9\u0627\u0645\u0644 \u062A\u0631\u0627\u06A9\u0646\u0634\u200C\u0647\u0627\u06CC \u0634\u0645\u0627</p></div></div></div></div> <div class="max-w-4xl mx-auto px-4 py-6" data-v-cc9d9b4f>`);
      _push(ssrRenderComponent(Transactions, null, null, _parent));
      _push(`</div></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/financial/PaymentHistoryPage.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const PaymentHistoryPage = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-cc9d9b4f"]]);

export { PaymentHistoryPage as default };
//# sourceMappingURL=PaymentHistoryPage-B0uRefeP.mjs.map
