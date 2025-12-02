import { a as useNuxtApp, _ as __nuxt_component_0$3 } from './server.mjs';
import { defineComponent, ref, computed, useSSRContext } from 'vue';
import { ssrRenderComponent } from 'vue/server-renderer';
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
    const { $axios } = useNuxtApp();
    ref(true);
    const transactions = ref([]);
    const selectedFilter = ref("all");
    const filteredTransactions = computed(() => {
      const now = /* @__PURE__ */ new Date();
      const currentMonth = now.getMonth();
      const currentYear = now.getFullYear();
      if (selectedFilter.value === "all") {
        return transactions.value;
      }
      return transactions.value.filter((t) => {
        const dateStr = t.createdAt || t.created_at || t.date;
        if (!dateStr) return false;
        const date = new Date(dateStr);
        if (isNaN(date.getTime())) return false;
        const transactionMonth = date.getMonth();
        const transactionYear = date.getFullYear();
        if (selectedFilter.value === "thisMonth") {
          return transactionMonth === currentMonth && transactionYear === currentYear;
        } else if (selectedFilter.value === "lastMonth") {
          const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1;
          const lastMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear;
          return transactionMonth === lastMonth && transactionYear === lastMonthYear;
        } else if (selectedFilter.value === "lastThreeMonths") {
          const threeMonthsAgo = new Date(now);
          threeMonthsAgo.setMonth(currentMonth - 3);
          return date >= threeMonthsAgo;
        }
        return true;
      });
    });
    computed(() => {
      const groupMap = {};
      filteredTransactions.value.forEach((transaction) => {
        const date = formatPersianDate(transaction.createdAt || transaction.created_at || transaction.date);
        if (!groupMap[date]) {
          groupMap[date] = [];
        }
        groupMap[date].push(transaction);
      });
      return groupMap;
    });
    computed(() => {
      const now = /* @__PURE__ */ new Date();
      const currentMonth = now.getMonth();
      const currentYear = now.getFullYear();
      return transactions.value.filter((t) => {
        if (!isSuccess(t.status)) return false;
        const dateStr = t.createdAt || t.created_at || t.date;
        if (!dateStr) return false;
        const date = new Date(dateStr);
        if (isNaN(date.getTime())) return false;
        return date.getMonth() === currentMonth && date.getFullYear() === currentYear;
      }).reduce((sum, t) => sum + (t.amount || 0), 0);
    });
    const formatPersianDate = (date) => {
      try {
        if (!date) {
          return "\u2014";
        }
        const toPersianDigits = (str) => {
          const persianDigits = ["\u06F0", "\u06F1", "\u06F2", "\u06F3", "\u06F4", "\u06F5", "\u06F6", "\u06F7", "\u06F8", "\u06F9"];
          return str.replace(/\d/g, (d) => persianDigits[parseInt(d)]);
        };
        if (typeof date === "string") {
          const cleaned = date.trim();
          if (cleaned.includes("/")) {
            if (/^\d{4}\/\d{1,2}\/\d{1,2}$/.test(cleaned)) {
              return toPersianDigits(cleaned);
            }
          }
          if (cleaned.includes("-") || cleaned.includes("T")) {
            const dateObj2 = new Date(cleaned);
            if (!isNaN(dateObj2.getTime())) {
              return toPersianDigits(dateObj2.toLocaleDateString("fa-IR"));
            }
          }
          const dateObj = new Date(cleaned);
          if (!isNaN(dateObj.getTime())) {
            return toPersianDigits(dateObj.toLocaleDateString("fa-IR"));
          }
        }
        if (date instanceof Date && !isNaN(date.getTime())) {
          return toPersianDigits(date.toLocaleDateString("fa-IR"));
        }
        return "\u2014";
      } catch (error) {
        return "\u2014";
      }
    };
    const isSuccess = (status) => {
      if (!status) return false;
      const statusStr = status == null ? void 0 : status.toString().toLowerCase();
      const successStates = [
        "\u0645\u0648\u0641\u0642",
        "successful",
        "success",
        "completed",
        "paid",
        "\u062A\u06A9\u0645\u06CC\u0644 \u0634\u062F\u0647",
        "\u067E\u0631\u062F\u0627\u062E\u062A \u0634\u062F\u0647",
        "confirmed",
        "\u062A\u0627\u06CC\u06CC\u062F \u0634\u062F\u0647",
        "done",
        "\u0627\u0646\u062C\u0627\u0645 \u0634\u062F\u0647",
        "verified",
        "\u062A\u0627\u06CC\u06CC\u062F \u0634\u062F\u0647",
        "ok",
        "200",
        "true",
        "1"
      ];
      return successStates.some((s) => statusStr == null ? void 0 : statusStr.includes(s));
    };
    const totalPayments = computed(() => {
      return transactions.value.filter((t) => isSuccess(t.status)).reduce((sum, t) => sum + (t.amount || 0), 0);
    });
    const successfulTransactions = computed(() => {
      return transactions.value.filter((t) => isSuccess(t.status)).length;
    });
    computed(() => {
      const successfulCount = successfulTransactions.value;
      if (successfulCount === 0) return 0;
      return Math.round(totalPayments.value / successfulCount);
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_ClientOnly = __nuxt_component_0$3;
      _push(ssrRenderComponent(_component_ClientOnly, _attrs, {}, _parent));
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/financial/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=index-05Qx_fM7.mjs.map
