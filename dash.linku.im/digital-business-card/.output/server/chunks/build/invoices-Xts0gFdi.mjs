import { defineComponent, ref, computed, mergeProps, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderList, ssrRenderClass, ssrInterpolate } from 'vue/server-renderer';
import { defineStore } from 'pinia';
import { a as useNuxtApp } from './server.mjs';
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
import 'vue-router';
import 'axios';

const useFinancialStore = defineStore("financial", {
  state: () => ({
    invoices: [],
    payments: [],
    stats: null,
    loading: false,
    error: null
  }),
  getters: {
    // Filter invoices by status
    getInvoicesByStatus: (state) => (status) => {
      if (status === "all") return state.invoices;
      return state.invoices.filter((inv) => inv.status === status);
    },
    // Filter payments by status
    getPaymentsByStatus: (state) => (status) => {
      if (status === "all") return state.payments;
      return state.payments.filter((pay) => pay.status === status);
    },
    // Get total payments amount
    getTotalPaymentsAmount: (state) => {
      return state.payments.filter((p) => p.status === "\u0645\u0648\u0641\u0642").reduce((sum, p) => sum + p.amount, 0);
    },
    // Get this month payments
    getThisMonthPayments: (state) => {
      const now = /* @__PURE__ */ new Date();
      const currentMonth = now.getMonth();
      const currentYear = now.getFullYear();
      return state.payments.filter((payment) => {
        const dateParts = payment.date.split("/");
        if (dateParts.length !== 3) return false;
        const year = parseInt(dateParts[0]);
        const month = parseInt(dateParts[1]);
        return year === currentYear && month === currentMonth;
      });
    }
  },
  actions: {
    // Fetch all invoices from API
    async fetchInvoices() {
      this.loading = true;
      this.error = null;
      try {
        const { $axios } = useNuxtApp();
        const response = await $axios.get("invoices/list");
        if (response.data && response.data.data) {
          this.invoices = response.data.data;
        }
      } catch (error) {
        this.error = error.message || "\u062E\u0637\u0627 \u062F\u0631 \u062F\u0631\u06CC\u0627\u0641\u062A \u0641\u0627\u06A9\u062A\u0648\u0631\u0647\u0627";
        this.invoices = [];
      } finally {
        this.loading = false;
      }
    },
    // Fetch payment history from API
    async fetchPaymentHistory() {
      this.loading = true;
      this.error = null;
      try {
        const { $axios } = useNuxtApp();
        const response = await $axios.get("transactions/list");
        if (response.data && response.data.data) {
          this.payments = response.data.data.map((tx) => ({
            id: tx.id,
            title: tx.plan || tx.description || "\u067E\u0631\u062F\u0627\u062E\u062A",
            amount: typeof tx.amount === "string" ? parseInt(tx.amount.replace(/,/g, "")) : tx.amount,
            date: tx.date,
            time: tx.time,
            status: tx.status === "success" ? "\u0645\u0648\u0641\u0642" : tx.status === "failed" ? "\u0646\u0627\u0645\u0648\u0641\u0642" : "\u062F\u0631 \u0627\u0646\u062A\u0638\u0627\u0631",
            method: tx.method || "\u062F\u0631\u06AF\u0627\u0647 \u0628\u0627\u0646\u06A9\u06CC",
            transactionId: tx.ref || tx.transactionId || "",
            description: tx.description,
            icon: this.getPaymentIcon(tx.method)
          }));
          this.calculateStats();
        }
      } catch (error) {
        this.error = error.message || "\u062E\u0637\u0627 \u062F\u0631 \u062F\u0631\u06CC\u0627\u0641\u062A \u062A\u0627\u0631\u06CC\u062E\u0686\u0647 \u067E\u0631\u062F\u0627\u062E\u062A";
        this.payments = [];
      } finally {
        this.loading = false;
      }
    },
    // Calculate transaction statistics
    calculateStats() {
      const successful = this.payments.filter((p) => p.status === "\u0645\u0648\u0641\u0642");
      const failed = this.payments.filter((p) => p.status === "\u0646\u0627\u0645\u0648\u0641\u0642");
      this.stats = {
        totalPayments: successful.reduce((sum, p) => sum + p.amount, 0),
        thisMonthPayments: this.getThisMonthPayments.reduce((sum, p) => {
          if (p.status === "\u0645\u0648\u0641\u0642") return sum + p.amount;
          return sum;
        }, 0),
        successfulCount: successful.length,
        failedCount: failed.length
      };
    },
    // Download invoice PDF
    async downloadInvoice(invoiceId) {
      try {
        const { $axios } = useNuxtApp();
        const response = await $axios.get(`invoices/${invoiceId}/download`, {
          responseType: "blob"
        });
        const url = (void 0).URL.createObjectURL(new Blob([response.data]));
        const link = (void 0).createElement("a");
        link.href = url;
        link.setAttribute("download", `invoice_${invoiceId}.pdf`);
        (void 0).body.appendChild(link);
        link.click();
        link.remove();
      } catch (error) {
        throw new Error("\u062E\u0637\u0627 \u062F\u0631 \u062F\u0627\u0646\u0644\u0648\u062F \u0641\u0627\u06A9\u062A\u0648\u0631");
      }
    },
    // Get invoice details
    async getInvoiceDetails(invoiceId) {
      try {
        const { $axios } = useNuxtApp();
        const response = await $axios.get(`invoices/${invoiceId}`);
        if (response.data && response.data.data) {
          return response.data.data;
        }
        return null;
      } catch (error) {
        return null;
      }
    },
    // Helper: Get payment method icon
    getPaymentIcon(method) {
      const icons = {
        "\u062F\u0631\u06AF\u0627\u0647 \u0628\u0627\u0646\u06A9\u06CC": "ti ti-building-bank",
        "\u06A9\u0627\u0631\u062A \u0628\u0647 \u06A9\u0627\u0631\u062A": "ti ti-credit-card",
        "\u06A9\u06CC\u0641 \u067E\u0648\u0644": "ti ti-wallet"
      };
      return icons[method] || "ti ti-credit-card";
    }
  }
});
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "invoices",
  __ssrInlineRender: true,
  setup(__props) {
    const financialStore = useFinancialStore();
    const formatPrice = (price) => {
      return new Intl.NumberFormat("fa-IR").format(price) + " \u0631\u06CC\u0627\u0644";
    };
    const isDataLoaded = ref(false);
    const selectedFilter = ref("all");
    const invoiceFilters = [
      { label: "\u0647\u0645\u0647", value: "all" },
      { label: "\u067E\u0631\u062F\u0627\u062E\u062A \u0634\u062F\u0647", value: "paid" },
      { label: "\u062F\u0631 \u0627\u0646\u062A\u0638\u0627\u0631", value: "pending" },
      { label: "\u0645\u0646\u0642\u0636\u06CC", value: "overdue" }
    ];
    const filteredInvoices = computed(() => {
      return financialStore.getInvoicesByStatus(selectedFilter.value);
    });
    const getStatusClass = (status) => {
      const classes = {
        paid: "bg-green-500/10 text-green-600",
        pending: "bg-yellow-500/10 text-yellow-600",
        overdue: "bg-red-500/10 text-red-600",
        cancelled: "bg-gray-500/10 text-gray-600"
      };
      return classes[status] || "bg-muted text-muted-foreground";
    };
    const getStatusText = (status) => {
      const texts = {
        paid: "\u067E\u0631\u062F\u0627\u062E\u062A \u0634\u062F\u0647",
        pending: "\u062F\u0631 \u0627\u0646\u062A\u0638\u0627\u0631",
        overdue: "\u0645\u0646\u0642\u0636\u06CC",
        cancelled: "\u0644\u063A\u0648 \u0634\u062F\u0647"
      };
      return texts[status] || "\u0646\u0627\u0645\u0634\u062E\u0635";
    };
    const getPaymentMethodIcon = (method) => {
      const icons = {
        "\u06A9\u0627\u0631\u062A \u0628\u0627\u0646\u06A9\u06CC": "ti ti-credit-card",
        "\u06A9\u06CC\u0641 \u067E\u0648\u0644": "ti ti-wallet",
        "\u0627\u0646\u062A\u0642\u0627\u0644 \u0628\u0627\u0646\u06A9\u06CC": "ti ti-building-bank"
      };
      return icons[method] || "ti ti-payment";
    };
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "min-h-screen bg-background" }, _attrs))} data-v-306abe0a><div class="fixed top-0 left-0 right-0 z-50 bg-card border-b divide-border" data-v-306abe0a><div class="flex items-center justify-between px-4 h-16" data-v-306abe0a><button class="p-2 hover:bg-secondary rounded-lg transition-colors" data-v-306abe0a><i class="ti ti-arrow-right text-primary text-xl" data-v-306abe0a></i></button> <h1 class="text-lg font-bold text-primary" data-v-306abe0a>\u0641\u0627\u06A9\u062A\u0648\u0631\u0647\u0627 \u0648 \u0635\u0648\u0631\u062A\u062D\u0633\u0627\u0628</h1> <div class="w-10" data-v-306abe0a></div></div></div> <div class="pt-20 pb-24 px-6" data-v-306abe0a>`);
      if (!isDataLoaded.value) {
        _push(`<div class="space-y-6 animate-pulse" data-v-306abe0a><div class="flex items-center gap-3 overflow-x-auto pb-2" data-v-306abe0a><!--[-->`);
        ssrRenderList(4, (n) => {
          _push(`<div class="flex-shrink-0 w-20 h-8 bg-muted rounded-xl" data-v-306abe0a></div>`);
        });
        _push(`<!--]--></div> <div class="space-y-4" data-v-306abe0a><!--[-->`);
        ssrRenderList(6, (n) => {
          _push(`<div class="bg-card border border-border p-4 rounded-xl" data-v-306abe0a><div class="flex items-start justify-between mb-3" data-v-306abe0a><div class="flex-1 space-y-2" data-v-306abe0a><div class="flex items-center gap-2" data-v-306abe0a><div class="h-4 w-24 bg-muted rounded" data-v-306abe0a></div> <div class="w-16 h-5 bg-muted rounded-full" data-v-306abe0a></div></div> <div class="h-3 w-20 bg-muted-foreground/20 rounded" data-v-306abe0a></div> <div class="h-3 w-16 bg-muted-foreground/20 rounded" data-v-306abe0a></div></div> <div class="text-right space-y-1" data-v-306abe0a><div class="h-5 w-20 bg-muted rounded" data-v-306abe0a></div> <div class="h-3 w-12 bg-muted-foreground/20 rounded" data-v-306abe0a></div></div></div> <div class="flex items-center justify-between" data-v-306abe0a><div class="flex items-center gap-3" data-v-306abe0a><div class="w-8 h-8 bg-muted rounded" data-v-306abe0a></div> <div class="w-8 h-8 bg-muted rounded" data-v-306abe0a></div></div> <div class="h-8 w-20 bg-muted rounded" data-v-306abe0a></div></div></div>`);
        });
        _push(`<!--]--></div></div>`);
      } else {
        _push(`<!--[--><div class="mb-6" data-v-306abe0a><div class="flex items-center gap-3 overflow-x-auto pb-2" data-v-306abe0a><!--[-->`);
        ssrRenderList(invoiceFilters, (filter) => {
          _push(`<button class="${ssrRenderClass([
            "flex-shrink-0 px-4 py-2 rounded-xl text-sm font-medium transition-all",
            selectedFilter.value === filter.value ? "bg-primary text-white" : "bg-muted text-muted-foreground hover:bg-muted/80"
          ])}" data-v-306abe0a>${ssrInterpolate(filter.label)}</button>`);
        });
        _push(`<!--]--></div></div> <div class="space-y-4" data-v-306abe0a><!--[-->`);
        ssrRenderList(filteredInvoices.value, (invoice) => {
          _push(`<div class="bg-card border border-border/20 p-4 rounded-xl hover:bg-card/80 transition-colors" data-v-306abe0a><div class="flex items-start justify-between mb-3" data-v-306abe0a><div class="flex-1" data-v-306abe0a><div class="flex items-center gap-2 mb-1" data-v-306abe0a><h5 class="font-medium text-foreground" data-v-306abe0a>\u0641\u0627\u06A9\u062A\u0648\u0631 #${ssrInterpolate(invoice.invoiceNumber)}</h5> <span class="${ssrRenderClass([
            "text-xs px-2 py-1 rounded-full",
            getStatusClass(invoice.status)
          ])}" data-v-306abe0a>${ssrInterpolate(getStatusText(invoice.status))}</span></div> <p class="text-sm text-muted-foreground mb-2" data-v-306abe0a>${ssrInterpolate(invoice.description)}</p> <div class="flex items-center gap-4 text-xs text-muted-foreground" data-v-306abe0a><span data-v-306abe0a>\u062A\u0627\u0631\u06CC\u062E \u0635\u062F\u0648\u0631: ${ssrInterpolate(invoice.issueDate)}</span> <span data-v-306abe0a>\u0633\u0631\u0631\u0633\u06CC\u062F: ${ssrInterpolate(invoice.dueDate)}</span></div></div> <div class="text-left" data-v-306abe0a><p class="text-lg font-bold text-foreground" data-v-306abe0a>${ssrInterpolate(formatPrice(invoice.amount))}</p></div></div> <div class="flex items-center justify-between pt-3 border-t border-border/20" data-v-306abe0a><div class="flex items-center gap-3" data-v-306abe0a><button class="flex items-center gap-1 text-muted-foreground text-sm font-medium hover:text-foreground transition-colors" title="\u062F\u0627\u0646\u0644\u0648\u062F PDF" data-v-306abe0a><i class="ti ti-download text-base" data-v-306abe0a></i> <span class="hidden sm:inline" data-v-306abe0a>\u062F\u0627\u0646\u0644\u0648\u062F</span></button> <button class="flex items-center gap-1 text-muted-foreground text-sm font-medium hover:text-foreground transition-colors" title="\u0645\u0634\u0627\u0647\u062F\u0647 \u062C\u0632\u0626\u06CC\u0627\u062A" data-v-306abe0a><i class="ti ti-eye text-base" data-v-306abe0a></i> <span class="hidden sm:inline" data-v-306abe0a>\u062C\u0632\u0626\u06CC\u0627\u062A</span></button></div> <div class="flex items-center gap-2" data-v-306abe0a><i class="${ssrRenderClass(getPaymentMethodIcon(invoice.paymentMethod) + " text-muted-foreground text-sm")}" data-v-306abe0a></i> <span class="text-xs text-muted-foreground" data-v-306abe0a>${ssrInterpolate(invoice.paymentMethod)}</span></div></div></div>`);
        });
        _push(`<!--]--> `);
        if (filteredInvoices.value.length === 0) {
          _push(`<div class="text-center py-12" data-v-306abe0a><div class="w-20 h-20 bg-muted/50 rounded-full flex items-center justify-center mx-auto mb-4" data-v-306abe0a><i class="ti ti-file-invoice text-3xl text-muted-foreground" data-v-306abe0a></i></div> <h3 class="text-lg font-medium text-foreground mb-2" data-v-306abe0a>\u0641\u0627\u06A9\u062A\u0648\u0631\u06CC \u06CC\u0627\u0641\u062A \u0646\u0634\u062F</h3> <p class="text-sm text-muted-foreground" data-v-306abe0a>\u062F\u0631 \u0627\u06CC\u0646 \u0628\u0627\u0632\u0647 \u0632\u0645\u0627\u0646\u06CC \u0641\u0627\u06A9\u062A\u0648\u0631\u06CC \u0635\u0627\u062F\u0631 \u0646\u0634\u062F\u0647 \u0627\u0633\u062A</p></div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div><!--]-->`);
      }
      _push(`</div></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/financial/invoices.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const invoices = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-306abe0a"]]);

export { invoices as default };
//# sourceMappingURL=invoices-Xts0gFdi.mjs.map
