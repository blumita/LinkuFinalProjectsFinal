import { defineComponent, ref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderStyle, ssrInterpolate, ssrRenderList, ssrRenderClass } from 'vue/server-renderer';
import { _ as _export_sfc } from './_plugin-vue_export-helper-1tPrXgE0.mjs';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "WalletPage",
  __ssrInlineRender: true,
  setup(__props) {
    const walletBalance = ref(0);
    const recentTransactions = ref([]);
    const formatPrice = (price) => {
      return new Intl.NumberFormat("fa-IR").format(price) + " \u0631\u06CC\u0627\u0644";
    };
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(_attrs)} data-v-59c0e888><div class="fixed top-0 left-0 right-0 z-50 bg-card border-b divide-border" data-v-59c0e888><div class="flex items-center justify-between px-4 h-16" data-v-59c0e888><button class="p-2 hover:bg-secondary rounded-lg transition-colors" data-v-59c0e888><i class="ti ti-arrow-right text-primary text-xl" data-v-59c0e888></i></button> <h1 class="text-lg font-bold text-primary" data-v-59c0e888>\u06A9\u06CC\u0641 \u067E\u0648\u0644</h1> <div class="w-10" data-v-59c0e888></div></div></div> <div class="pt-20 py-4" data-v-59c0e888><div class="mb-6 px-6" data-v-59c0e888><div class="p-6 rounded-2xl text-white" style="${ssrRenderStyle({ "background": "var(--accent-color)" })}" data-v-59c0e888><div class="flex items-center justify-between mb-4" data-v-59c0e888><h3 class="text-lg font-bold" data-v-59c0e888>\u0645\u0648\u062C\u0648\u062F\u06CC \u06A9\u06CC\u0641 \u067E\u0648\u0644</h3> <i class="ti ti-wallet text-2xl" data-v-59c0e888></i></div> <div class="flex items-end justify-between" data-v-59c0e888><div data-v-59c0e888><p class="text-2xl font-bold mb-2" data-v-59c0e888>${ssrInterpolate(formatPrice(walletBalance.value))}</p> <p class="text-sm opacity-80" data-v-59c0e888>\u0645\u0648\u062C\u0648\u062F\u06CC \u0641\u0639\u0644\u06CC \u0634\u0645\u0627</p></div> <button class="bg-white/20 px-4 py-2 rounded-xl text-sm font-medium hover:bg-white/30 transition-colors" data-v-59c0e888>
              \u0634\u0627\u0631\u0698 \u06A9\u06CC\u0641 \u067E\u0648\u0644
            </button></div></div></div> <div class="mb-6 px-6" data-v-59c0e888><h4 class="text-lg font-bold text-primary mb-4" data-v-59c0e888>\u0639\u0645\u0644\u06CC\u0627\u062A \u0633\u0631\u06CC\u0639</h4> <div class="grid grid-cols-2 gap-4" data-v-59c0e888><button class="bg-card border border-border p-4 rounded-xl flex items-center gap-3 hover:bg-secondary transition-colors" data-v-59c0e888><div class="w-10 h-10 bg-green-500/10 rounded-lg flex items-center justify-center" data-v-59c0e888><i class="ti ti-plus text-green-500 text-lg" data-v-59c0e888></i></div> <div class="text-right" data-v-59c0e888><p class="font-medium text-primary text-sm" data-v-59c0e888>\u0634\u0627\u0631\u0698 \u06A9\u06CC\u0641 \u067E\u0648\u0644</p> <p class="text-xs text-secondary" data-v-59c0e888>\u0627\u0641\u0632\u0648\u062F\u0646 \u0627\u0639\u062A\u0628\u0627\u0631</p></div></button> <button class="bg-card border border-border p-4 rounded-xl flex items-center gap-3 hover:bg-secondary transition-colors" data-v-59c0e888><div class="w-10 h-10 bg-blue-500/10 rounded-lg flex items-center justify-center" data-v-59c0e888><i class="ti ti-cash text-blue-500 text-lg" data-v-59c0e888></i></div> <div class="text-right" data-v-59c0e888><p class="font-medium text-primary text-sm" data-v-59c0e888>\u0628\u0631\u062F\u0627\u0634\u062A \u0648\u062C\u0647</p> <p class="text-xs text-secondary" data-v-59c0e888>\u0627\u0646\u062A\u0642\u0627\u0644 \u0628\u0647 \u062D\u0633\u0627\u0628</p></div></button></div></div> <div class="space-y-0 px-6" data-v-59c0e888><button class="w-full flex items-center justify-between py-4 border-b divide-border hover:bg-secondary transition-colors" data-v-59c0e888><div class="flex items-center gap-3" data-v-59c0e888><i class="ti ti-history text-primary text-lg" data-v-59c0e888></i> <span class="font-medium text-primary text-base" data-v-59c0e888>\u062A\u0627\u0631\u06CC\u062E\u0686\u0647 \u062A\u0631\u0627\u06A9\u0646\u0634\u200C\u0647\u0627</span></div> <i class="ti ti-chevron-left text-secondary text-sm" data-v-59c0e888></i></button> <button disabled class="w-full flex items-center justify-between py-4 border-b divide-border opacity-50 cursor-not-allowed" data-v-59c0e888><div class="flex items-center gap-3" data-v-59c0e888><i class="ti ti-credit-card text-primary text-lg" data-v-59c0e888></i> <span class="font-medium text-primary text-base" data-v-59c0e888>\u0631\u0648\u0634\u200C\u0647\u0627\u06CC \u067E\u0631\u062F\u0627\u062E\u062A</span> <span class="text-xs text-secondary bg-secondary px-2 py-1 rounded" data-v-59c0e888>\u0628\u0647\u200C\u0632\u0648\u062F\u06CC</span></div> <i class="ti ti-chevron-left text-secondary text-sm" data-v-59c0e888></i></button> <button disabled class="w-full flex items-center justify-between py-4 border-b divide-border opacity-50 cursor-not-allowed" data-v-59c0e888><div class="flex items-center gap-3" data-v-59c0e888><i class="ti ti-building-bank text-primary text-lg" data-v-59c0e888></i> <span class="font-medium text-primary text-base" data-v-59c0e888>\u062D\u0633\u0627\u0628\u200C\u0647\u0627\u06CC \u0628\u0627\u0646\u06A9\u06CC</span> <span class="text-xs text-secondary bg-secondary px-2 py-1 rounded" data-v-59c0e888>\u0628\u0647\u200C\u0632\u0648\u062F\u06CC</span></div> <i class="ti ti-chevron-left text-secondary text-sm" data-v-59c0e888></i></button> <button disabled class="w-full flex items-center justify-between py-4 opacity-50 cursor-not-allowed" data-v-59c0e888><div class="flex items-center gap-3" data-v-59c0e888><i class="ti ti-settings text-primary text-lg" data-v-59c0e888></i> <span class="font-medium text-primary text-base" data-v-59c0e888>\u062A\u0646\u0638\u06CC\u0645\u0627\u062A \u06A9\u06CC\u0641 \u067E\u0648\u0644</span> <span class="text-xs text-secondary bg-secondary px-2 py-1 rounded" data-v-59c0e888>\u0628\u0647\u200C\u0632\u0648\u062F\u06CC</span></div> <i class="ti ti-chevron-left text-secondary text-sm" data-v-59c0e888></i></button></div> <div class="mt-6 px-6" data-v-59c0e888><h4 class="text-lg font-bold text-primary mb-4" data-v-59c0e888>\u0622\u062E\u0631\u06CC\u0646 \u062A\u0631\u0627\u06A9\u0646\u0634\u200C\u0647\u0627</h4> <div class="space-y-3" data-v-59c0e888>`);
      if (recentTransactions.value.length === 0) {
        _push(`<div class="bg-card border border-border p-6 rounded-xl text-center" data-v-59c0e888><i class="ti ti-receipt-off text-secondary text-3xl mb-2" data-v-59c0e888></i> <p class="text-secondary" data-v-59c0e888>\u0647\u06CC\u0686 \u062A\u0631\u0627\u06A9\u0646\u0634\u06CC \u06CC\u0627\u0641\u062A \u0646\u0634\u062F</p></div>`);
      } else {
        _push(`<!--[-->`);
        ssrRenderList(recentTransactions.value, (transaction) => {
          _push(`<div class="bg-card border border-border p-4 rounded-xl" data-v-59c0e888><div class="flex items-center justify-between" data-v-59c0e888><div class="flex items-center gap-3" data-v-59c0e888><div class="${ssrRenderClass([
            "w-10 h-10 rounded-lg flex items-center justify-center",
            transaction.type === "charge" ? "bg-green-500/10" : "bg-red-500/10"
          ])}" data-v-59c0e888><i class="${ssrRenderClass([
            "text-lg",
            transaction.type === "charge" ? "ti ti-plus text-green-500" : "ti ti-minus text-red-500"
          ])}" data-v-59c0e888></i></div> <div data-v-59c0e888><p class="font-medium text-primary text-sm" data-v-59c0e888>${ssrInterpolate(transaction.title)}</p> <p class="text-xs text-secondary" data-v-59c0e888>${ssrInterpolate(transaction.date)}</p></div></div> <div class="text-left" data-v-59c0e888><p class="${ssrRenderClass([
            "font-bold text-sm",
            transaction.type === "charge" ? "text-green-500" : "text-red-500"
          ])}" data-v-59c0e888>${ssrInterpolate(transaction.type === "charge" ? "+" : "-")}${ssrInterpolate(formatPrice(transaction.amount))}</p></div></div></div>`);
        });
        _push(`<!--]-->`);
      }
      _push(`</div></div></div></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/financial/WalletPage.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const WalletPage = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-59c0e888"]]);

export { WalletPage as default };
//# sourceMappingURL=WalletPage-C6XXJQ7V.mjs.map
