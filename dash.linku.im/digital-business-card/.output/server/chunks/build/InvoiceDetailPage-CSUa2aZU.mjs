import { defineComponent, ref, mergeProps, unref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderList, ssrInterpolate, ssrRenderClass } from 'vue/server-renderer';
import { useRoute, useRouter } from 'vue-router';
import { M as MobilePageHeader } from './MobilePageHeader-B_M2K2Mb.mjs';
import { _ as _export_sfc } from './_plugin-vue_export-helper-1tPrXgE0.mjs';

function usePersianImage() {
  const formatPrice = (amount) => {
    return new Intl.NumberFormat("fa-IR").format(amount) + " \u062A\u0648\u0645\u0627\u0646";
  };
  const getStatusText = (status) => {
    const statusMap = {
      "paid": "\u067E\u0631\u062F\u0627\u062E\u062A \u0634\u062F\u0647",
      "pending": "\u062F\u0631 \u0627\u0646\u062A\u0638\u0627\u0631 \u067E\u0631\u062F\u0627\u062E\u062A",
      "overdue": "\u0633\u0631\u0631\u0633\u06CC\u062F \u06AF\u0630\u0634\u062A\u0647",
      "cancelled": "\u0644\u063A\u0648 \u0634\u062F\u0647",
      "refunded": "\u0628\u0627\u0632\u067E\u0631\u062F\u0627\u062E\u062A \u0634\u062F\u0647"
    };
    return statusMap[status] || status;
  };
  const downloadInvoiceImage = async (invoice) => {
    const invoiceText = `
      \u0641\u0627\u06A9\u062A\u0648\u0631 \u0634\u0645\u0627\u0631\u0647: ${invoice.invoiceNumber}
      \u0645\u0628\u0644\u063A: ${formatPrice(invoice.amount)}
      \u0648\u0636\u0639\u06CC\u062A: ${getStatusText(invoice.status)}
      \u062A\u0627\u0631\u06CC\u062E \u0635\u062F\u0648\u0631: ${invoice.issueDate}
    `;
    const blob = new Blob([invoiceText], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = (void 0).createElement("a");
    link.href = url;
    link.download = `invoice-${invoice.invoiceNumber}.txt`;
    (void 0).body.appendChild(link);
    link.click();
    (void 0).body.removeChild(link);
    URL.revokeObjectURL(url);
  };
  return {
    formatPrice,
    getStatusText,
    downloadInvoiceImage
  };
}
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "InvoiceDetailPage",
  __ssrInlineRender: true,
  setup(__props) {
    useRoute();
    useRouter();
    const { formatPrice, getStatusText } = usePersianImage();
    const isDataLoaded = ref(false);
    const invoice = ref(null);
    const getStatusClass = (status) => {
      const classes = {
        paid: "bg-green-500/10 text-green-600",
        pending: "bg-yellow-500/10 text-yellow-600",
        overdue: "bg-red-500/10 text-red-600",
        cancelled: "bg-gray-500/10 text-gray-600"
      };
      return classes[status] || "bg-muted text-muted-foreground";
    };
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "min-h-screen bg-background" }, _attrs))} data-v-d28e7bd1>`);
      _push(ssrRenderComponent(MobilePageHeader, {
        title: "\u062C\u0632\u0626\u06CC\u0627\u062A \u0641\u0627\u06A9\u062A\u0648\u0631",
        "home-route": "/dashboard",
        "show-back": true,
        "show-home": true
      }, null, _parent));
      _push(` <div class="pt-24 px-6 py-4" data-v-d28e7bd1>`);
      if (!isDataLoaded.value) {
        _push(`<div class="space-y-6 animate-pulse" data-v-d28e7bd1><div class="bg-card border border-border/20 p-6 rounded-2xl" data-v-d28e7bd1><div class="flex items-center justify-between mb-4" data-v-d28e7bd1><div data-v-d28e7bd1><div class="h-6 w-40 bg-muted rounded mb-2" data-v-d28e7bd1></div> <div class="h-5 w-20 bg-muted rounded-full" data-v-d28e7bd1></div></div> <div class="text-right" data-v-d28e7bd1><div class="h-8 w-32 bg-muted rounded mb-1" data-v-d28e7bd1></div> <div class="h-4 w-16 bg-muted-foreground/20 rounded" data-v-d28e7bd1></div></div></div> <div class="grid grid-cols-2 gap-4 pt-4 border-t border-border/20" data-v-d28e7bd1><div data-v-d28e7bd1><div class="h-4 w-16 bg-muted-foreground/20 rounded mb-1" data-v-d28e7bd1></div> <div class="h-5 w-24 bg-muted rounded" data-v-d28e7bd1></div></div> <div data-v-d28e7bd1><div class="h-4 w-20 bg-muted-foreground/20 rounded mb-1" data-v-d28e7bd1></div> <div class="h-5 w-24 bg-muted rounded" data-v-d28e7bd1></div></div></div></div> <div class="bg-card border border-border/20 p-6 rounded-2xl" data-v-d28e7bd1><div class="h-6 w-28 bg-muted rounded mb-4" data-v-d28e7bd1></div> <div class="space-y-3" data-v-d28e7bd1><!--[-->`);
        ssrRenderList(4, (n) => {
          _push(`<div class="flex justify-between" data-v-d28e7bd1><div class="h-4 w-20 bg-muted-foreground/20 rounded" data-v-d28e7bd1></div> <div class="h-4 w-24 bg-muted rounded" data-v-d28e7bd1></div></div>`);
        });
        _push(`<!--]--></div></div> <div class="bg-card border border-border/20 p-6 rounded-2xl" data-v-d28e7bd1><div class="h-6 w-24 bg-muted rounded mb-4" data-v-d28e7bd1></div> <div class="space-y-4" data-v-d28e7bd1><!--[-->`);
        ssrRenderList(2, (n) => {
          _push(`<div class="flex justify-between items-center py-3 border-b border-border/20" data-v-d28e7bd1><div data-v-d28e7bd1><div class="h-5 w-32 bg-muted rounded mb-1" data-v-d28e7bd1></div> <div class="h-4 w-20 bg-muted-foreground/20 rounded" data-v-d28e7bd1></div></div> <div class="h-5 w-24 bg-muted rounded" data-v-d28e7bd1></div></div>`);
        });
        _push(`<!--]--></div> <div class="flex justify-between items-center pt-4 border-t border-border/20" data-v-d28e7bd1><div class="h-6 w-16 bg-muted rounded" data-v-d28e7bd1></div> <div class="h-6 w-28 bg-muted rounded" data-v-d28e7bd1></div></div></div> <div class="bg-card border border-border/20 p-6 rounded-2xl" data-v-d28e7bd1><div class="h-6 w-32 bg-muted rounded mb-4" data-v-d28e7bd1></div> <div class="space-y-3" data-v-d28e7bd1><!--[-->`);
        ssrRenderList(3, (n) => {
          _push(`<div class="flex justify-between" data-v-d28e7bd1><div class="h-4 w-24 bg-muted-foreground/20 rounded" data-v-d28e7bd1></div> <div class="h-4 w-20 bg-muted rounded" data-v-d28e7bd1></div></div>`);
        });
        _push(`<!--]--></div></div> <div class="flex gap-3" data-v-d28e7bd1><div class="flex-1 h-12 bg-muted rounded-xl" data-v-d28e7bd1></div> <div class="flex-1 h-12 bg-muted rounded-xl" data-v-d28e7bd1></div></div></div>`);
      } else if (invoice.value) {
        _push(`<div class="space-y-6" data-v-d28e7bd1><div class="bg-card border border-border/20 p-6 rounded-2xl" data-v-d28e7bd1><div class="flex items-center justify-between mb-4" data-v-d28e7bd1><div data-v-d28e7bd1><h2 class="text-xl font-bold text-foreground mb-1" data-v-d28e7bd1>\u0641\u0627\u06A9\u062A\u0648\u0631 #${ssrInterpolate(invoice.value.invoiceNumber)}</h2> <span class="${ssrRenderClass([
          "text-sm px-3 py-1 rounded-full",
          getStatusClass(invoice.value.status)
        ])}" data-v-d28e7bd1>${ssrInterpolate(unref(getStatusText)(invoice.value.status))}</span></div> <div class="text-right" data-v-d28e7bd1><p class="text-2xl font-bold text-foreground" data-v-d28e7bd1>${ssrInterpolate(unref(formatPrice)(invoice.value.amount))}</p> <p class="text-sm text-muted-foreground" data-v-d28e7bd1>\u0645\u0628\u0644\u063A \u06A9\u0644</p></div></div> <div class="grid grid-cols-2 gap-4 pt-4 border-t border-border/20" data-v-d28e7bd1><div data-v-d28e7bd1><p class="text-sm text-muted-foreground mb-1" data-v-d28e7bd1>\u062A\u0627\u0631\u06CC\u062E \u0635\u062F\u0648\u0631</p> <p class="font-medium" data-v-d28e7bd1>${ssrInterpolate(invoice.value.issueDate)}</p></div> <div data-v-d28e7bd1><p class="text-sm text-muted-foreground mb-1" data-v-d28e7bd1>\u062A\u0627\u0631\u06CC\u062E \u0633\u0631\u0631\u0633\u06CC\u062F</p> <p class="font-medium" data-v-d28e7bd1>${ssrInterpolate(invoice.value.dueDate)}</p></div></div></div> <div class="bg-card border border-border/20 p-6 rounded-2xl" data-v-d28e7bd1><h3 class="text-lg font-semibold text-foreground mb-4" data-v-d28e7bd1>\u0627\u0637\u0644\u0627\u0639\u0627\u062A \u0645\u0634\u062A\u0631\u06CC</h3> <div class="space-y-3" data-v-d28e7bd1><div class="flex justify-between" data-v-d28e7bd1><span class="text-muted-foreground" data-v-d28e7bd1>\u0646\u0627\u0645 \u0645\u0634\u062A\u0631\u06CC:</span> <span class="font-medium" data-v-d28e7bd1>\u06A9\u0627\u0631\u0628\u0631 \u0644\u06CC\u0646\u06A9\u0648</span></div> <div class="flex justify-between" data-v-d28e7bd1><span class="text-muted-foreground" data-v-d28e7bd1>\u0634\u0645\u0627\u0631\u0647 \u06A9\u0627\u0631\u0628\u0631\u06CC:</span> <span class="font-medium" data-v-d28e7bd1>USER-2024</span></div> <div class="flex justify-between" data-v-d28e7bd1><span class="text-muted-foreground" data-v-d28e7bd1>\u0627\u06CC\u0645\u06CC\u0644:</span> <span class="font-medium" data-v-d28e7bd1>user@linku.im</span></div></div></div> <div class="bg-card border border-border/20 p-6 rounded-2xl" data-v-d28e7bd1><h3 class="text-lg font-semibold text-foreground mb-4" data-v-d28e7bd1>\u0622\u06CC\u062A\u0645\u200C\u0647\u0627\u06CC \u0641\u0627\u06A9\u062A\u0648\u0631</h3> <div class="space-y-3" data-v-d28e7bd1><div class="flex items-center justify-between p-4 bg-muted/30 rounded-xl" data-v-d28e7bd1><div class="flex-1" data-v-d28e7bd1><h4 class="font-medium text-foreground" data-v-d28e7bd1>${ssrInterpolate(invoice.value.description)}</h4> <p class="text-sm text-muted-foreground mt-1" data-v-d28e7bd1>\u0645\u0642\u062F\u0627\u0631: 1 \u0639\u062F\u062F</p></div> <div class="text-right" data-v-d28e7bd1><p class="font-bold text-foreground" data-v-d28e7bd1>${ssrInterpolate(unref(formatPrice)(invoice.value.amount))}</p></div></div></div> <div class="mt-4 pt-4 border-t border-border/20" data-v-d28e7bd1><div class="flex justify-between text-lg font-bold" data-v-d28e7bd1><span data-v-d28e7bd1>\u0645\u062C\u0645\u0648\u0639 \u06A9\u0644:</span> <span data-v-d28e7bd1>${ssrInterpolate(unref(formatPrice)(invoice.value.amount))}</span></div></div></div> <div class="bg-card border border-border/20 p-6 rounded-2xl" data-v-d28e7bd1><h3 class="text-lg font-semibold text-foreground mb-4" data-v-d28e7bd1>\u0627\u0637\u0644\u0627\u0639\u0627\u062A \u067E\u0631\u062F\u0627\u062E\u062A</h3> <div class="space-y-3" data-v-d28e7bd1><div class="flex justify-between" data-v-d28e7bd1><span class="text-muted-foreground" data-v-d28e7bd1>\u0631\u0648\u0634 \u067E\u0631\u062F\u0627\u062E\u062A:</span> <span class="font-medium" data-v-d28e7bd1>${ssrInterpolate(invoice.value.paymentMethod)}</span></div> <div class="flex justify-between" data-v-d28e7bd1><span class="text-muted-foreground" data-v-d28e7bd1>\u0648\u0636\u0639\u06CC\u062A \u067E\u0631\u062F\u0627\u062E\u062A:</span> <span class="${ssrRenderClass(getStatusClass(invoice.value.status))}" data-v-d28e7bd1>${ssrInterpolate(unref(getStatusText)(invoice.value.status))}</span></div> `);
        if (invoice.value.status === "paid") {
          _push(`<div class="flex justify-between" data-v-d28e7bd1><span class="text-muted-foreground" data-v-d28e7bd1>\u062A\u0627\u0631\u06CC\u062E \u067E\u0631\u062F\u0627\u062E\u062A:</span> <span class="font-medium" data-v-d28e7bd1>${ssrInterpolate(invoice.value.paymentDate || invoice.value.issueDate)}</span></div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div></div> <div class="space-y-3" data-v-d28e7bd1><button class="w-full bg-muted text-muted-foreground py-3 px-4 rounded-xl font-medium hover:bg-muted/80 transition-colors flex items-center justify-center gap-2" data-v-d28e7bd1><i class="ti ti-download text-lg" data-v-d28e7bd1></i>
            \u062F\u0627\u0646\u0644\u0648\u062F \u0641\u0627\u06A9\u062A\u0648\u0631 (PDF)
          </button> `);
        if (invoice.value.status === "pending") {
          _push(`<button class="w-full bg-green-500 text-white py-3 px-4 rounded-xl font-medium hover:bg-green-600 transition-colors flex items-center justify-center gap-2" data-v-d28e7bd1><i class="ti ti-credit-card text-lg" data-v-d28e7bd1></i>
            \u067E\u0631\u062F\u0627\u062E\u062A \u0641\u0627\u06A9\u062A\u0648\u0631
          </button>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/financial/InvoiceDetailPage.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const InvoiceDetailPage = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-d28e7bd1"]]);

export { InvoiceDetailPage as default };
//# sourceMappingURL=InvoiceDetailPage-CSUa2aZU.mjs.map
