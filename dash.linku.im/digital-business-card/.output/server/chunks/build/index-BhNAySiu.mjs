import { ssrRenderAttrs, ssrRenderAttr, ssrIncludeBooleanAttr, ssrLooseContain, ssrLooseEqual, ssrInterpolate, ssrRenderList, ssrRenderClass } from 'vue/server-renderer';
import { ref, computed, useSSRContext } from 'vue';
import moment from 'moment-jalaali';
import { a as useNuxtApp } from './server.mjs';
import { _ as _export_sfc } from './_plugin-vue_export-helper-1tPrXgE0.mjs';

const _sfc_main = {
  __name: "index",
  __ssrInlineRender: true,
  setup(__props) {
    const transactions = ref([]);
    const loading = ref(true);
    const selectedTransaction = ref(null);
    const searchQuery = ref("");
    const statusFilter = ref("all");
    const methodFilter = ref("all");
    const currentPage = ref(1);
    const perPage = ref(10);
    const filteredTransactions = computed(() => {
      let result = transactions.value;
      if (searchQuery.value) {
        const query = searchQuery.value.toLowerCase();
        result = result.filter(
          (tx) => tx.plan.toLowerCase().includes(query) || tx.ref.toLowerCase().includes(query) || tx.method.toLowerCase().includes(query)
        );
      }
      if (statusFilter.value !== "all") {
        result = result.filter((tx) => tx.status === statusFilter.value);
      }
      if (methodFilter.value !== "all") {
        result = result.filter((tx) => tx.method === methodFilter.value);
      }
      return result;
    });
    const paginatedTransactions = computed(() => {
      const start = (currentPage.value - 1) * perPage.value;
      const end = start + perPage.value;
      return filteredTransactions.value.slice(start, end);
    });
    const totalPages = computed(() => {
      return Math.ceil(filteredTransactions.value.length / perPage.value);
    });
    const visiblePages = computed(() => {
      const pages = [];
      const maxVisible = 5;
      let start = Math.max(1, currentPage.value - Math.floor(maxVisible / 2));
      let end = Math.min(totalPages.value, start + maxVisible - 1);
      if (end - start + 1 < maxVisible) {
        start = Math.max(1, end - maxVisible + 1);
      }
      for (let i = start; i <= end; i++) {
        pages.push(i);
      }
      return pages;
    });
    function toEnglishDigits(str) {
      return str.replace(/[۰-۹]/g, (d) => "\u06F0\u06F1\u06F2\u06F3\u06F4\u06F5\u06F6\u06F7\u06F8\u06F9".indexOf(d)).replace(/[٠-٩]/g, (d) => "\u0660\u0661\u0662\u0663\u0664\u0665\u0666\u0667\u0668\u0669".indexOf(d));
    }
    function formatPersianDate(date) {
      const m = moment(date, "YYYY/MM/DD");
      if (m.isValid()) {
        return toEnglishDigits(m.format("jYYYY/jMM/jDD"));
      }
      return toEnglishDigits(date.replace(/\s*/g, ""));
    }
    const { $axios } = useNuxtApp();
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(_attrs)} data-v-7e71c2c5><h2 class="text-2xl font-bold text-primary mb-6 flex items-center gap-2" data-v-7e71c2c5><i class="ti ti-credit-card text-xl" data-v-7e71c2c5></i>
      \u06AF\u0632\u0627\u0631\u0634 \u067E\u0631\u062F\u0627\u062E\u062A\u200C\u0647\u0627
    </h2> <div class="bg-secondary border border-border rounded-xl p-4 mb-6" data-v-7e71c2c5><div class="grid md:grid-cols-3 gap-4" data-v-7e71c2c5><div class="relative" data-v-7e71c2c5><i class="ti ti-search absolute right-3 top-1/2 -translate-y-1/2 text-primary opacity-50" data-v-7e71c2c5></i> <input${ssrRenderAttr("value", searchQuery.value)} type="text" placeholder="\u062C\u0633\u062A\u062C\u0648 \u062F\u0631 \u06A9\u062F \u062A\u0631\u0627\u06A9\u0646\u0634\u060C \u067E\u0644\u0646..." class="w-full pr-10 pl-4 py-2.5 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent bg-primary text-primary" data-v-7e71c2c5></div> <div class="relative" data-v-7e71c2c5><i class="ti ti-filter absolute right-3 top-1/2 -translate-y-1/2 text-primary opacity-50" data-v-7e71c2c5></i> <select class="w-full pr-10 pl-4 py-2.5 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent bg-primary text-primary appearance-none cursor-pointer" data-v-7e71c2c5><option value="all" data-v-7e71c2c5${ssrIncludeBooleanAttr(Array.isArray(statusFilter.value) ? ssrLooseContain(statusFilter.value, "all") : ssrLooseEqual(statusFilter.value, "all")) ? " selected" : ""}>\u0647\u0645\u0647 \u0648\u0636\u0639\u06CC\u062A\u200C\u0647\u0627</option> <option value="\u0645\u0648\u0641\u0642" data-v-7e71c2c5${ssrIncludeBooleanAttr(Array.isArray(statusFilter.value) ? ssrLooseContain(statusFilter.value, "\u0645\u0648\u0641\u0642") : ssrLooseEqual(statusFilter.value, "\u0645\u0648\u0641\u0642")) ? " selected" : ""}>\u0645\u0648\u0641\u0642</option> <option value="\u0646\u0627\u0645\u0648\u0641\u0642" data-v-7e71c2c5${ssrIncludeBooleanAttr(Array.isArray(statusFilter.value) ? ssrLooseContain(statusFilter.value, "\u0646\u0627\u0645\u0648\u0641\u0642") : ssrLooseEqual(statusFilter.value, "\u0646\u0627\u0645\u0648\u0641\u0642")) ? " selected" : ""}>\u0646\u0627\u0645\u0648\u0641\u0642</option></select> <i class="ti ti-chevron-down absolute left-3 top-1/2 -translate-y-1/2 text-primary opacity-50 pointer-events-none" data-v-7e71c2c5></i></div> <div class="relative" data-v-7e71c2c5><i class="ti ti-credit-card absolute right-3 top-1/2 -translate-y-1/2 text-primary opacity-50" data-v-7e71c2c5></i> <select class="w-full pr-10 pl-4 py-2.5 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent bg-primary text-primary appearance-none cursor-pointer" data-v-7e71c2c5><option value="all" data-v-7e71c2c5${ssrIncludeBooleanAttr(Array.isArray(methodFilter.value) ? ssrLooseContain(methodFilter.value, "all") : ssrLooseEqual(methodFilter.value, "all")) ? " selected" : ""}>\u0647\u0645\u0647 \u0631\u0648\u0634\u200C\u0647\u0627</option> <option value="\u062F\u0631\u06AF\u0627\u0647 \u0628\u0627\u0646\u06A9\u06CC" data-v-7e71c2c5${ssrIncludeBooleanAttr(Array.isArray(methodFilter.value) ? ssrLooseContain(methodFilter.value, "\u062F\u0631\u06AF\u0627\u0647 \u0628\u0627\u0646\u06A9\u06CC") : ssrLooseEqual(methodFilter.value, "\u062F\u0631\u06AF\u0627\u0647 \u0628\u0627\u0646\u06A9\u06CC")) ? " selected" : ""}>\u062F\u0631\u06AF\u0627\u0647 \u0628\u0627\u0646\u06A9\u06CC</option> <option value="\u06A9\u0627\u0631\u062A \u0628\u0647 \u06A9\u0627\u0631\u062A" data-v-7e71c2c5${ssrIncludeBooleanAttr(Array.isArray(methodFilter.value) ? ssrLooseContain(methodFilter.value, "\u06A9\u0627\u0631\u062A \u0628\u0647 \u06A9\u0627\u0631\u062A") : ssrLooseEqual(methodFilter.value, "\u06A9\u0627\u0631\u062A \u0628\u0647 \u06A9\u0627\u0631\u062A")) ? " selected" : ""}>\u06A9\u0627\u0631\u062A \u0628\u0647 \u06A9\u0627\u0631\u062A</option> <option value="\u06A9\u06CC\u0641 \u067E\u0648\u0644" data-v-7e71c2c5${ssrIncludeBooleanAttr(Array.isArray(methodFilter.value) ? ssrLooseContain(methodFilter.value, "\u06A9\u06CC\u0641 \u067E\u0648\u0644") : ssrLooseEqual(methodFilter.value, "\u06A9\u06CC\u0641 \u067E\u0648\u0644")) ? " selected" : ""}>\u06A9\u06CC\u0641 \u067E\u0648\u0644</option></select> <i class="ti ti-chevron-down absolute left-3 top-1/2 -translate-y-1/2 text-primary opacity-50 pointer-events-none" data-v-7e71c2c5></i></div></div> `);
      if (filteredTransactions.value.length !== transactions.value.length && !loading.value) {
        _push(`<div class="mt-3 flex items-center justify-between text-sm" data-v-7e71c2c5><span class="text-primary opacity-70" data-v-7e71c2c5><i class="ti ti-info-circle" data-v-7e71c2c5></i> ${ssrInterpolate(filteredTransactions.value.length)} \u0645\u0648\u0631\u062F \u0627\u0632 ${ssrInterpolate(transactions.value.length)} \u062A\u0631\u0627\u06A9\u0646\u0634 \u0646\u0645\u0627\u06CC\u0634 \u062F\u0627\u062F\u0647 \u0645\u06CC\u200C\u0634\u0648\u062F
        </span> <button class="text-accent hover:underline flex items-center gap-1" data-v-7e71c2c5><i class="ti ti-x text-xs" data-v-7e71c2c5></i>
          \u067E\u0627\u06A9 \u06A9\u0631\u062F\u0646 \u0641\u06CC\u0644\u062A\u0631\u0647\u0627
        </button></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div> `);
      if (loading.value) {
        _push(`<div class="bg-secondary border border-border rounded-xl overflow-hidden" data-v-7e71c2c5><div class="overflow-x-auto" data-v-7e71c2c5><table class="w-full" data-v-7e71c2c5><thead class="bg-primary border-b border-border" data-v-7e71c2c5><tr data-v-7e71c2c5><th class="px-4 py-3 text-right text-sm font-medium text-primary" data-v-7e71c2c5><div class="h-4 bg-primary rounded w-16 animate-pulse" data-v-7e71c2c5></div></th> <th class="px-4 py-3 text-right text-sm font-medium text-primary" data-v-7e71c2c5><div class="h-4 bg-primary rounded w-20 animate-pulse" data-v-7e71c2c5></div></th> <th class="px-4 py-3 text-right text-sm font-medium text-primary" data-v-7e71c2c5><div class="h-4 bg-primary rounded w-24 animate-pulse" data-v-7e71c2c5></div></th> <th class="px-4 py-3 text-right text-sm font-medium text-primary" data-v-7e71c2c5><div class="h-4 bg-primary rounded w-20 animate-pulse" data-v-7e71c2c5></div></th> <th class="px-4 py-3 text-right text-sm font-medium text-primary" data-v-7e71c2c5><div class="h-4 bg-primary rounded w-16 animate-pulse" data-v-7e71c2c5></div></th> <th class="px-4 py-3 text-right text-sm font-medium text-primary" data-v-7e71c2c5><div class="h-4 bg-primary rounded w-20 animate-pulse" data-v-7e71c2c5></div></th> <th class="px-4 py-3 text-center text-sm font-medium text-primary" data-v-7e71c2c5><div class="h-4 bg-primary rounded w-16 animate-pulse mx-auto" data-v-7e71c2c5></div></th></tr></thead> <tbody data-v-7e71c2c5><!--[-->`);
        ssrRenderList(5, (i) => {
          _push(`<tr class="border-b border-border" data-v-7e71c2c5><td class="px-4 py-4" data-v-7e71c2c5><div class="h-4 bg-primary rounded w-full animate-pulse" data-v-7e71c2c5></div></td> <td class="px-4 py-4" data-v-7e71c2c5><div class="h-4 bg-primary rounded w-full animate-pulse" data-v-7e71c2c5></div></td> <td class="px-4 py-4" data-v-7e71c2c5><div class="h-4 bg-primary rounded w-full animate-pulse" data-v-7e71c2c5></div></td> <td class="px-4 py-4" data-v-7e71c2c5><div class="h-4 bg-primary rounded w-full animate-pulse" data-v-7e71c2c5></div></td> <td class="px-4 py-4" data-v-7e71c2c5><div class="h-4 bg-primary rounded w-full animate-pulse" data-v-7e71c2c5></div></td> <td class="px-4 py-4" data-v-7e71c2c5><div class="h-4 bg-primary rounded w-full animate-pulse" data-v-7e71c2c5></div></td> <td class="px-4 py-4" data-v-7e71c2c5><div class="h-8 bg-primary rounded w-20 animate-pulse mx-auto" data-v-7e71c2c5></div></td></tr>`);
        });
        _push(`<!--]--></tbody></table></div></div>`);
      } else if (filteredTransactions.value.length) {
        _push(`<div class="bg-secondary border border-border rounded-xl overflow-hidden" data-v-7e71c2c5><div class="overflow-x-auto" data-v-7e71c2c5><table class="w-full" data-v-7e71c2c5><thead class="bg-primary border-b border-border" data-v-7e71c2c5><tr data-v-7e71c2c5><th class="px-4 py-3 text-right text-sm font-medium text-primary whitespace-nowrap" data-v-7e71c2c5><div class="flex items-center gap-2" data-v-7e71c2c5><i class="ti ti-package text-base" data-v-7e71c2c5></i>
                  \u0646\u0648\u0639 \u0627\u0634\u062A\u0631\u0627\u06A9
                </div></th> <th class="px-4 py-3 text-right text-sm font-medium text-primary whitespace-nowrap" data-v-7e71c2c5><div class="flex items-center gap-2" data-v-7e71c2c5><i class="ti ti-coin text-base" data-v-7e71c2c5></i>
                  \u0645\u0628\u0644\u063A
                </div></th> <th class="px-4 py-3 text-right text-sm font-medium text-primary whitespace-nowrap" data-v-7e71c2c5><div class="flex items-center gap-2" data-v-7e71c2c5><i class="ti ti-receipt text-base" data-v-7e71c2c5></i>
                  \u06A9\u062F \u062A\u0631\u0627\u06A9\u0646\u0634
                </div></th> <th class="px-4 py-3 text-right text-sm font-medium text-primary whitespace-nowrap" data-v-7e71c2c5><div class="flex items-center gap-2" data-v-7e71c2c5><i class="ti ti-credit-card text-base" data-v-7e71c2c5></i>
                  \u0631\u0648\u0634 \u067E\u0631\u062F\u0627\u062E\u062A
                </div></th> <th class="px-4 py-3 text-right text-sm font-medium text-primary whitespace-nowrap" data-v-7e71c2c5><div class="flex items-center gap-2" data-v-7e71c2c5><i class="ti ti-calendar text-base" data-v-7e71c2c5></i>
                  \u062A\u0627\u0631\u06CC\u062E
                </div></th> <th class="px-4 py-3 text-right text-sm font-medium text-primary whitespace-nowrap" data-v-7e71c2c5><div class="flex items-center gap-2" data-v-7e71c2c5><i class="ti ti-info-circle text-base" data-v-7e71c2c5></i>
                  \u0648\u0636\u0639\u06CC\u062A
                </div></th> <th class="px-4 py-3 text-center text-sm font-medium text-primary whitespace-nowrap" data-v-7e71c2c5>
                \u0639\u0645\u0644\u06CC\u0627\u062A
              </th></tr></thead> <tbody data-v-7e71c2c5><!--[-->`);
        ssrRenderList(paginatedTransactions.value, (tx) => {
          _push(`<tr class="border-b border-border hover:bg-primary transition-colors" data-v-7e71c2c5><td class="px-4 py-4 text-sm text-primary whitespace-nowrap" data-v-7e71c2c5><div class="flex items-center gap-2" data-v-7e71c2c5><div class="w-8 h-8 rounded-lg bg-accent flex items-center justify-center" data-v-7e71c2c5><i class="ti ti-crown text-white text-sm" data-v-7e71c2c5></i></div> <div data-v-7e71c2c5><div class="font-medium" data-v-7e71c2c5>${ssrInterpolate(tx.plan)}</div> `);
          if (tx.discount) {
            _push(`<div class="text-xs text-green-600" data-v-7e71c2c5>${ssrInterpolate(tx.discount)} \u062A\u062E\u0641\u06CC\u0641</div>`);
          } else {
            _push(`<!---->`);
          }
          _push(`</div></div></td> <td class="px-4 py-4 text-sm whitespace-nowrap" data-v-7e71c2c5><span class="font-bold text-green-600" data-v-7e71c2c5>${ssrInterpolate(tx.amount.toLocaleString())}</span> <span class="text-primary opacity-60 mr-1" data-v-7e71c2c5>\u062A\u0648\u0645\u0627\u0646</span></td> <td class="px-4 py-4 text-sm text-primary font-mono whitespace-nowrap" data-v-7e71c2c5>${ssrInterpolate(tx.ref)}</td> <td class="px-4 py-4 text-sm text-primary whitespace-nowrap" data-v-7e71c2c5><div class="flex items-center gap-2" data-v-7e71c2c5><i class="ti ti-credit-card text-base opacity-60" data-v-7e71c2c5></i> ${ssrInterpolate(tx.method)}</div></td> <td class="px-4 py-4 text-sm text-primary whitespace-nowrap" data-v-7e71c2c5>${ssrInterpolate(formatPersianDate(tx.date))}</td> <td class="px-4 py-4 text-sm whitespace-nowrap" data-v-7e71c2c5><span class="${ssrRenderClass([tx.status === "\u0645\u0648\u0641\u0642" ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400", "inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium"])}" data-v-7e71c2c5><i class="${ssrRenderClass([tx.status === "\u0645\u0648\u0641\u0642" ? "ti-circle-check" : "ti-alert-triangle", "ti"])}" data-v-7e71c2c5></i> ${ssrInterpolate(tx.status)}</span></td> <td class="px-4 py-4 text-sm text-center whitespace-nowrap" data-v-7e71c2c5><div class="flex items-center justify-center gap-2" data-v-7e71c2c5><button class="w-8 h-8 rounded-lg border border-border hover:bg-primary transition-colors flex items-center justify-center group" title="\u0645\u0634\u0627\u0647\u062F\u0647 \u062C\u0632\u0626\u06CC\u0627\u062A" data-v-7e71c2c5><i class="ti ti-eye text-base text-primary group-hover:text-accent" data-v-7e71c2c5></i></button> <button class="w-8 h-8 rounded-lg border border-border hover:bg-primary transition-colors flex items-center justify-center group" title="\u062F\u0627\u0646\u0644\u0648\u062F \u0631\u0633\u06CC\u062F" data-v-7e71c2c5><i class="ti ti-download text-base text-primary group-hover:text-accent" data-v-7e71c2c5></i></button></div></td></tr>`);
        });
        _push(`<!--]--></tbody></table></div> `);
        if (totalPages.value > 1) {
          _push(`<div class="border-t border-border px-4 py-3 flex items-center justify-between" data-v-7e71c2c5><div class="text-sm text-primary opacity-70" data-v-7e71c2c5>
          \u0646\u0645\u0627\u06CC\u0634 ${ssrInterpolate((currentPage.value - 1) * perPage.value + 1)} \u062A\u0627 ${ssrInterpolate(Math.min(currentPage.value * perPage.value, filteredTransactions.value.length))} \u0627\u0632 ${ssrInterpolate(filteredTransactions.value.length)} \u0645\u0648\u0631\u062F
        </div> <div class="flex items-center gap-2" data-v-7e71c2c5><button${ssrIncludeBooleanAttr(currentPage.value === 1) ? " disabled" : ""} class="px-3 py-1.5 border border-border rounded-lg text-sm text-primary hover:bg-primary transition-colors disabled:opacity-50 disabled:cursor-not-allowed" data-v-7e71c2c5><i class="ti ti-chevron-right" data-v-7e71c2c5></i></button> <div class="flex items-center gap-1" data-v-7e71c2c5><!--[-->`);
          ssrRenderList(visiblePages.value, (page) => {
            _push(`<button class="${ssrRenderClass([currentPage.value === page ? "accent-bg accent-text font-medium" : "border border-border text-primary hover:bg-primary", "w-8 h-8 rounded-lg text-sm transition-colors"])}" data-v-7e71c2c5>${ssrInterpolate(page)}</button>`);
          });
          _push(`<!--]--></div> <button${ssrIncludeBooleanAttr(currentPage.value === totalPages.value) ? " disabled" : ""} class="px-3 py-1.5 border border-border rounded-lg text-sm text-primary hover:bg-primary transition-colors disabled:opacity-50 disabled:cursor-not-allowed" data-v-7e71c2c5><i class="ti ti-chevron-left" data-v-7e71c2c5></i></button></div></div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div>`);
      } else {
        _push(`<div class="flex flex-col items-center justify-center py-16 text-center bg-secondary border border-border rounded-xl" data-v-7e71c2c5><div class="w-24 h-24 rounded-full bg-primary flex items-center justify-center mb-4" data-v-7e71c2c5><i class="ti ti-wallet-off text-5xl text-primary opacity-30" data-v-7e71c2c5></i></div> <h3 class="text-lg font-bold text-primary mb-2" data-v-7e71c2c5>${ssrInterpolate(searchQuery.value || statusFilter.value !== "all" || methodFilter.value !== "all" ? "\u0646\u062A\u06CC\u062C\u0647\u200C\u0627\u06CC \u06CC\u0627\u0641\u062A \u0646\u0634\u062F" : "\u0647\u06CC\u0686 \u062A\u0631\u0627\u06A9\u0646\u0634\u06CC \u06CC\u0627\u0641\u062A \u0646\u0634\u062F")}</h3> <p class="text-sm text-primary opacity-60 max-w-sm" data-v-7e71c2c5>${ssrInterpolate(searchQuery.value || statusFilter.value !== "all" || methodFilter.value !== "all" ? "\u0628\u0627 \u0641\u06CC\u0644\u062A\u0631\u0647\u0627\u06CC \u0627\u0646\u062A\u062E\u0627\u0628\u06CC \u0647\u06CC\u0686 \u062A\u0631\u0627\u06A9\u0646\u0634\u06CC \u06CC\u0627\u0641\u062A \u0646\u0634\u062F. \u0644\u0637\u0641\u0627 \u0641\u06CC\u0644\u062A\u0631\u0647\u0627\u06CC \u062F\u06CC\u06AF\u0631\u06CC \u0631\u0627 \u0627\u0645\u062A\u062D\u0627\u0646 \u06A9\u0646\u06CC\u062F." : "\u062A\u0627\u06A9\u0646\u0648\u0646 \u0647\u06CC\u0686 \u062A\u0631\u0627\u06A9\u0646\u0634 \u067E\u0631\u062F\u0627\u062E\u062A\u06CC \u062B\u0628\u062A \u0646\u0634\u062F\u0647 \u0627\u0633\u062A. \u067E\u0633 \u0627\u0632 \u062E\u0631\u06CC\u062F \u0627\u0634\u062A\u0631\u0627\u06A9\u060C \u062A\u0631\u0627\u06A9\u0646\u0634\u200C\u0647\u0627\u06CC \u0634\u0645\u0627 \u062F\u0631 \u0627\u06CC\u0646\u062C\u0627 \u0646\u0645\u0627\u06CC\u0634 \u062F\u0627\u062F\u0647 \u0645\u06CC\u200C\u0634\u0648\u062F.")}</p> `);
        if (searchQuery.value || statusFilter.value !== "all" || methodFilter.value !== "all") {
          _push(`<button class="mt-4 px-4 py-2 accent-bg accent-text rounded-lg text-sm font-medium hover:opacity-90 transition-opacity" data-v-7e71c2c5>
        \u067E\u0627\u06A9 \u06A9\u0631\u062F\u0646 \u0641\u06CC\u0644\u062A\u0631\u0647\u0627
      </button>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div>`);
      }
      _push(` `);
      if (selectedTransaction.value) {
        _push(`<div class="fixed inset-0 z-50 flex items-center justify-center p-4" data-v-7e71c2c5><div class="absolute inset-0 bg-black/80 backdrop-blur-sm" data-v-7e71c2c5></div> <div class="relative bg-secondary rounded-2xl shadow-xl p-6 w-full max-w-md z-50 border border-border" data-v-7e71c2c5><button class="absolute top-4 left-4 w-8 h-8 rounded-full hover:bg-primary transition-colors flex items-center justify-center" data-v-7e71c2c5><i class="ti ti-x text-xl text-primary" data-v-7e71c2c5></i></button> <h3 class="text-xl font-bold text-primary mb-4 flex items-center gap-2" data-v-7e71c2c5><i class="ti ti-receipt text-2xl" data-v-7e71c2c5></i>
            \u062C\u0632\u0626\u06CC\u0627\u062A \u062A\u0631\u0627\u06A9\u0646\u0634
          </h3> <div class="space-y-3" data-v-7e71c2c5><div class="flex justify-between py-2 border-b border-border" data-v-7e71c2c5><span class="text-primary opacity-70" data-v-7e71c2c5>\u0646\u0648\u0639 \u0627\u0634\u062A\u0631\u0627\u06A9:</span> <span class="font-medium text-primary" data-v-7e71c2c5>${ssrInterpolate(selectedTransaction.value.plan)}</span></div> <div class="flex justify-between py-2 border-b border-border" data-v-7e71c2c5><span class="text-primary opacity-70" data-v-7e71c2c5>\u0645\u0628\u0644\u063A:</span> <span class="font-bold text-green-600" data-v-7e71c2c5>${ssrInterpolate(selectedTransaction.value.amount.toLocaleString())} \u062A\u0648\u0645\u0627\u0646</span></div> <div class="flex justify-between py-2 border-b border-border" data-v-7e71c2c5><span class="text-primary opacity-70" data-v-7e71c2c5>\u06A9\u062F \u062A\u0631\u0627\u06A9\u0646\u0634:</span> <span class="font-mono text-primary" data-v-7e71c2c5>${ssrInterpolate(selectedTransaction.value.ref)}</span></div> <div class="flex justify-between py-2 border-b border-border" data-v-7e71c2c5><span class="text-primary opacity-70" data-v-7e71c2c5>\u0631\u0648\u0634 \u067E\u0631\u062F\u0627\u062E\u062A:</span> <span class="text-primary" data-v-7e71c2c5>${ssrInterpolate(selectedTransaction.value.method)}</span></div> <div class="flex justify-between py-2 border-b border-border" data-v-7e71c2c5><span class="text-primary opacity-70" data-v-7e71c2c5>\u062A\u0627\u0631\u06CC\u062E:</span> <span class="text-primary" data-v-7e71c2c5>${ssrInterpolate(formatPersianDate(selectedTransaction.value.date))}</span></div> `);
        if (selectedTransaction.value.startDate) {
          _push(`<div class="flex justify-between py-2 border-b border-border" data-v-7e71c2c5><span class="text-primary opacity-70" data-v-7e71c2c5>\u062A\u0627\u0631\u06CC\u062E \u0634\u0631\u0648\u0639:</span> <span class="text-primary" data-v-7e71c2c5>${ssrInterpolate(formatPersianDate(selectedTransaction.value.startDate))}</span></div>`);
        } else {
          _push(`<!---->`);
        }
        _push(` `);
        if (selectedTransaction.value.endDate) {
          _push(`<div class="flex justify-between py-2 border-b border-border" data-v-7e71c2c5><span class="text-primary opacity-70" data-v-7e71c2c5>\u062A\u0627\u0631\u06CC\u062E \u067E\u0627\u06CC\u0627\u0646:</span> <span class="text-primary" data-v-7e71c2c5>${ssrInterpolate(formatPersianDate(selectedTransaction.value.endDate))}</span></div>`);
        } else {
          _push(`<!---->`);
        }
        _push(` <div class="flex justify-between py-2" data-v-7e71c2c5><span class="text-primary opacity-70" data-v-7e71c2c5>\u0648\u0636\u0639\u06CC\u062A:</span> <span class="${ssrRenderClass([selectedTransaction.value.status === "\u0645\u0648\u0641\u0642" ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400", "inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium"])}" data-v-7e71c2c5><i class="${ssrRenderClass([selectedTransaction.value.status === "\u0645\u0648\u0641\u0642" ? "ti-circle-check" : "ti-alert-triangle", "ti"])}" data-v-7e71c2c5></i> ${ssrInterpolate(selectedTransaction.value.status)}</span></div></div> <div class="mt-6 flex gap-3" data-v-7e71c2c5><button class="flex-1 px-4 py-2.5 accent-bg accent-text rounded-lg font-medium hover:opacity-90 transition-opacity flex items-center justify-center gap-2" data-v-7e71c2c5><i class="ti ti-download" data-v-7e71c2c5></i>
              \u062F\u0627\u0646\u0644\u0648\u062F \u0631\u0633\u06CC\u062F
            </button> <button class="px-4 py-2.5 border border-border rounded-lg text-primary hover:bg-primary transition-colors" data-v-7e71c2c5>
              \u0628\u0633\u062A\u0646
            </button></div></div></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div>`);
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/UserDashboard/main/transactions/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const Transactions = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-7e71c2c5"]]);

export { Transactions as T };
//# sourceMappingURL=index-BhNAySiu.mjs.map
