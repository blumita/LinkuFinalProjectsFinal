import { defineComponent, ref, mergeProps, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderList } from 'vue/server-renderer';
import { _ as _export_sfc } from './_plugin-vue_export-helper-1tPrXgE0.mjs';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "FinancialPage",
  __ssrInlineRender: true,
  setup(__props) {
    const isDataLoaded = ref(true);
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "min-h-screen bg-background pb-24" }, _attrs))} data-v-e3698c0d><div class="bg-card border-b border-border sticky top-0 z-10" data-v-e3698c0d><div class="max-w-4xl mx-auto px-4 py-4" data-v-e3698c0d><div class="flex items-center gap-3" data-v-e3698c0d><button class="w-10 h-10 flex items-center justify-center rounded-xl bg-background hover:bg-secondary transition-colors" data-v-e3698c0d><i class="ti ti-arrow-right text-xl text-primary" data-v-e3698c0d></i></button> <div data-v-e3698c0d><h1 class="text-xl font-bold text-primary" data-v-e3698c0d>\u0645\u0627\u0644\u06CC</h1> <p class="text-xs text-secondary" data-v-e3698c0d>\u0645\u062F\u06CC\u0631\u06CC\u062A \u0627\u0645\u0648\u0631 \u0645\u0627\u0644\u06CC</p></div></div></div></div> <div class="max-w-4xl mx-auto px-4 py-6" data-v-e3698c0d>`);
      if (!isDataLoaded.value) {
        _push(`<div class="space-y-6 animate-pulse" data-v-e3698c0d><div class="space-y-0 border-t border-border" data-v-e3698c0d><!--[-->`);
        ssrRenderList(6, (n) => {
          _push(`<div class="w-full flex items-center justify-between py-4 border-b border-border" data-v-e3698c0d><div class="flex items-center gap-3" data-v-e3698c0d><div class="w-5 h-5 bg-secondary rounded" data-v-e3698c0d></div> <div class="h-4 w-32 bg-secondary rounded" data-v-e3698c0d></div></div> <div class="w-3 h-3 bg-secondary rounded" data-v-e3698c0d></div></div>`);
        });
        _push(`<!--]--></div></div>`);
      } else {
        _push(`<div class="space-y-0 border-t border-border" data-v-e3698c0d><button class="w-full flex items-center justify-between py-4 border-b border-border hover:bg-secondary transition-colors" data-v-e3698c0d><div class="flex items-center gap-3" data-v-e3698c0d><i class="ti ti-file-invoice text-primary text-lg" data-v-e3698c0d></i> <span class="font-medium text-primary text-base" data-v-e3698c0d>\u0641\u0627\u06A9\u062A\u0648\u0631\u0647\u0627 \u0648 \u0635\u0648\u0631\u062A\u062D\u0633\u0627\u0628\u200C\u0647\u0627</span></div> <i class="ti ti-chevron-left text-secondary text-sm" data-v-e3698c0d></i></button> <button disabled class="w-full flex items-center justify-between py-4 border-b border-border opacity-50 cursor-not-allowed" data-v-e3698c0d><div class="flex items-center gap-3" data-v-e3698c0d><i class="ti ti-wallet text-secondary text-lg" data-v-e3698c0d></i> <span class="font-medium text-secondary text-base" data-v-e3698c0d>\u06A9\u06CC\u0641 \u067E\u0648\u0644</span> <span class="text-xs text-secondary bg-secondary px-2 py-1 rounded" data-v-e3698c0d>\u0628\u0647\u200C\u0632\u0648\u062F\u06CC</span></div> <i class="ti ti-chevron-left text-secondary text-sm" data-v-e3698c0d></i></button> <button class="w-full flex items-center justify-between py-4 border-b border-border hover:bg-secondary transition-colors" data-v-e3698c0d><div class="flex items-center gap-3" data-v-e3698c0d><i class="ti ti-history text-primary text-lg" data-v-e3698c0d></i> <span class="font-medium text-primary text-base" data-v-e3698c0d>\u062A\u0627\u0631\u06CC\u062E\u0686\u0647 \u067E\u0631\u062F\u0627\u062E\u062A\u200C\u0647\u0627</span></div> <i class="ti ti-chevron-left text-secondary text-sm" data-v-e3698c0d></i></button> <button disabled class="w-full flex items-center justify-between py-4 border-b border-border opacity-50 cursor-not-allowed" data-v-e3698c0d><div class="flex items-center gap-3" data-v-e3698c0d><i class="ti ti-receipt-refund text-secondary text-lg" data-v-e3698c0d></i> <span class="font-medium text-secondary text-base" data-v-e3698c0d>\u0628\u0627\u0632\u067E\u0631\u062F\u0627\u062E\u062A \u0648 \u0645\u0631\u062C\u0648\u0639\u06CC</span> <span class="text-xs text-secondary bg-secondary px-2 py-1 rounded" data-v-e3698c0d>\u0628\u0647\u200C\u0632\u0648\u062F\u06CC</span></div> <i class="ti ti-chevron-left text-secondary text-sm" data-v-e3698c0d></i></button> <button disabled class="w-full flex items-center justify-between py-4 border-b border-border opacity-50 cursor-not-allowed" data-v-e3698c0d><div class="flex items-center gap-3" data-v-e3698c0d><i class="ti ti-coins text-secondary text-lg" data-v-e3698c0d></i> <span class="font-medium text-secondary text-base" data-v-e3698c0d>\u062F\u0631\u0622\u0645\u062F\u0647\u0627\u06CC \u0645\u0646</span> <span class="text-xs text-secondary bg-secondary px-2 py-1 rounded" data-v-e3698c0d>\u0628\u0647\u200C\u0632\u0648\u062F\u06CC</span></div> <i class="ti ti-chevron-left text-secondary text-sm" data-v-e3698c0d></i></button> <button disabled class="w-full flex items-center justify-between py-4 opacity-50 cursor-not-allowed" data-v-e3698c0d><div class="flex items-center gap-3" data-v-e3698c0d><i class="ti ti-refresh text-secondary text-lg" data-v-e3698c0d></i> <span class="font-medium text-secondary text-base" data-v-e3698c0d>\u062A\u0646\u0638\u06CC\u0645\u0627\u062A \u067E\u0631\u062F\u0627\u062E\u062A \u062E\u0648\u062F\u06A9\u0627\u0631</span> <span class="text-xs text-secondary bg-secondary px-2 py-1 rounded" data-v-e3698c0d>\u0628\u0647\u200C\u0632\u0648\u062F\u06CC</span></div> <i class="ti ti-chevron-left text-secondary text-sm" data-v-e3698c0d></i></button></div>`);
      }
      _push(`</div></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/financial/FinancialPage.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const FinancialPage = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-e3698c0d"]]);

export { FinancialPage as default };
//# sourceMappingURL=FinancialPage-Duj5MmRv.mjs.map
