import { defineComponent, ref, computed, watch, mergeProps, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrInterpolate, ssrRenderClass, ssrIncludeBooleanAttr, ssrRenderAttr, ssrLooseContain, ssrLooseEqual, ssrRenderList, ssrRenderTeleport } from 'vue/server-renderer';
import { useRouter } from 'vue-router';
import { u as useFormStore } from './form-CUJQskNk.mjs';
import { a as useNuxtApp } from './server.mjs';
import 'pinia';
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
import 'axios';

const messagesPerPage = 10;
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "InfoFormPage",
  __ssrInlineRender: true,
  setup(__props) {
    useRouter();
    useFormStore();
    const { $axios } = useNuxtApp();
    const loading = ref(true);
    const activeTab = ref("leads");
    const currentPage = ref(1);
    const searchQuery = ref("");
    const sortBy = ref("newest");
    const selectedMessage = ref(null);
    const leadMessages = ref([]);
    const leadCount = ref(0);
    const formMessages = ref([]);
    const formCount = ref(0);
    const currentTabCount = computed(() => {
      return activeTab.value === "leads" ? leadCount.value : formCount.value;
    });
    const allMessages = computed(() => {
      return activeTab.value === "leads" ? leadMessages.value : formMessages.value;
    });
    const filteredAndSortedMessages = computed(() => {
      let filtered = [...allMessages.value];
      if (searchQuery.value.trim()) {
        const query = searchQuery.value.toLowerCase();
        filtered = filtered.filter(
          (msg) => (msg.name || "").toLowerCase().includes(query) || (msg.mobile || "").includes(query) || (msg.email || "").toLowerCase().includes(query)
        );
      }
      if (sortBy.value === "newest") {
        filtered.sort((a, b) => b.id - a.id);
      } else if (sortBy.value === "oldest") {
        filtered.sort((a, b) => a.id - b.id);
      } else if (sortBy.value === "name") {
        filtered.sort((a, b) => (a.name || "").localeCompare(b.name || "", "fa"));
      }
      return filtered;
    });
    const filteredCount = computed(() => filteredAndSortedMessages.value.length);
    const totalPages = computed(() => Math.ceil(filteredCount.value / messagesPerPage));
    const messages = computed(() => {
      const start = (currentPage.value - 1) * messagesPerPage;
      const end = start + messagesPerPage;
      return filteredAndSortedMessages.value.slice(start, end);
    });
    watch(activeTab, () => {
      currentPage.value = 1;
      searchQuery.value = "";
    });
    const formatDate = (dateStr) => {
      if (!dateStr) return "-";
      try {
        const date = new Date(dateStr);
        return new Intl.DateTimeFormat("fa-IR", {
          year: "numeric",
          month: "long",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit"
        }).format(date);
      } catch {
        return dateStr;
      }
    };
    const isUrl = (value) => {
      if (typeof value !== "string") return false;
      return value.startsWith("http://") || value.startsWith("https://");
    };
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "min-h-screen bg-background" }, _attrs))}><div class="fixed top-0 left-0 right-0 z-40 bg-card border-b border-border"><div class="flex items-center h-12 lg:h-14 px-4 lg:px-8"><button class="flex items-center justify-center w-10 h-10 rounded-lg text-foreground hover:bg-accent transition-colors"><i class="ti ti-arrow-right text-xl"></i></button> <div class="flex-1 flex items-center justify-center lg:justify-start mr-2 lg:mr-4"><div class="flex items-center gap-3"><div class="w-10 h-10 lg:w-12 lg:h-12 rounded-xl bg-primary/10 flex items-center justify-center"><i class="ti ti-forms text-primary text-lg lg:text-xl"></i></div> <h1 class="text-lg lg:text-2xl font-semibold lg:font-bold text-foreground">\u0641\u0631\u0645\u200C\u0647\u0627\u06CC \u062F\u0631\u06CC\u0627\u0641\u062A\u06CC</h1></div></div> <div class="hidden lg:flex items-center gap-3"><div class="bg-primary/10 text-primary px-3 py-1.5 rounded-lg"><span class="text-sm font-medium">${ssrInterpolate(currentTabCount.value)} \u067E\u06CC\u0627\u0645</span></div> <button${ssrIncludeBooleanAttr(loading.value) ? " disabled" : ""} class="px-3 py-1.5 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors flex items-center gap-2 disabled:opacity-50"><i class="ti ti-download text-lg"></i> <span>\u062E\u0631\u0648\u062C\u06CC</span></button></div></div> <div class="flex border-t border-border"><button class="${ssrRenderClass([activeTab.value === "leads" ? "text-primary" : "text-muted-foreground hover:text-foreground", "flex-1 py-3 text-sm font-medium transition-colors relative"])}"><div class="flex items-center justify-center gap-2"><i class="ti ti-user-plus text-lg"></i> <span>\u0641\u0631\u0645 \u0644\u06CC\u062F</span> `);
      if (leadCount.value > 0) {
        _push(`<span class="${ssrRenderClass([activeTab.value === "leads" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground", "px-1.5 py-0.5 text-xs rounded-full"])}">${ssrInterpolate(leadCount.value)}</span>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div> `);
      if (activeTab.value === "leads") {
        _push(`<div class="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</button> <button class="${ssrRenderClass([activeTab.value === "forms" ? "text-primary" : "text-muted-foreground hover:text-foreground", "flex-1 py-3 text-sm font-medium transition-colors relative"])}"><div class="flex items-center justify-center gap-2"><i class="ti ti-forms text-lg"></i> <span>\u0641\u0631\u0645\u200C\u0647\u0627\u06CC \u062F\u06CC\u06AF\u0631</span> `);
      if (formCount.value > 0) {
        _push(`<span class="${ssrRenderClass([activeTab.value === "forms" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground", "px-1.5 py-0.5 text-xs rounded-full"])}">${ssrInterpolate(formCount.value)}</span>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div> `);
      if (activeTab.value === "forms") {
        _push(`<div class="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</button></div></div> <div class="pt-28 lg:pt-32 pb-24 px-4 lg:px-8"><div class="max-w-2xl lg:max-w-none mx-auto"><div class="hidden lg:flex items-center gap-3 mb-6"><div class="flex-1 relative"><i class="ti ti-search absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"></i> <input${ssrRenderAttr("value", searchQuery.value)} type="text" placeholder="\u062C\u0633\u062A\u062C\u0648 \u0628\u0631 \u0627\u0633\u0627\u0633 \u0646\u0627\u0645 \u06CC\u0627 \u0634\u0645\u0627\u0631\u0647 \u0645\u0648\u0628\u0627\u06CC\u0644..." class="w-full h-10 pr-10 pl-4 bg-card border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"></div> <select class="h-10 px-4 bg-card border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"><option value="newest"${ssrIncludeBooleanAttr(Array.isArray(sortBy.value) ? ssrLooseContain(sortBy.value, "newest") : ssrLooseEqual(sortBy.value, "newest")) ? " selected" : ""}>\u062C\u062F\u06CC\u062F\u062A\u0631\u06CC\u0646</option> <option value="oldest"${ssrIncludeBooleanAttr(Array.isArray(sortBy.value) ? ssrLooseContain(sortBy.value, "oldest") : ssrLooseEqual(sortBy.value, "oldest")) ? " selected" : ""}>\u0642\u062F\u06CC\u0645\u06CC\u200C\u062A\u0631\u06CC\u0646</option> <option value="name"${ssrIncludeBooleanAttr(Array.isArray(sortBy.value) ? ssrLooseContain(sortBy.value, "name") : ssrLooseEqual(sortBy.value, "name")) ? " selected" : ""}>\u0646\u0627\u0645 (\u0627\u0644\u0641-\u06CC)</option></select> <button class="h-10 px-4 bg-muted/50 hover:bg-muted text-foreground rounded-lg transition-colors flex items-center gap-2"><i class="ti ti-filter-off text-lg"></i> <span>\u067E\u0627\u06A9 \u06A9\u0631\u062F\u0646</span></button></div> <div class="lg:hidden flex items-center justify-between mb-6 bg-card rounded-xl border border-border p-4"><div class="flex items-center gap-3"><span class="text-muted-foreground text-sm">\u062A\u0639\u062F\u0627\u062F \u067E\u06CC\u0627\u0645\u200C\u0647\u0627:</span> <span class="text-foreground font-bold text-lg">${ssrInterpolate(filteredCount.value)}</span></div> <button${ssrIncludeBooleanAttr(loading.value) ? " disabled" : ""} class="px-4 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors text-sm disabled:opacity-50">
          \u062E\u0631\u0648\u062C\u06CC
        </button></div> `);
      if (loading.value) {
        _push(`<div class="bg-card rounded-xl border border-border overflow-hidden"><div class="bg-muted/20 px-4 py-3 border-b border-border"><div class="${ssrRenderClass([activeTab.value === "leads" ? "grid-cols-2 lg:grid-cols-5" : "grid-cols-2 lg:grid-cols-4", "grid gap-4"])}"><span class="font-medium text-foreground text-sm">\u0634\u0646\u0627\u0633\u0647</span> <span class="font-medium text-foreground text-sm">\u0646\u0627\u0645</span> <span class="hidden lg:block font-medium text-foreground text-sm">\u0634\u0645\u0627\u0631\u0647 \u0645\u0648\u0628\u0627\u06CC\u0644</span> `);
        if (activeTab.value === "leads") {
          _push(`<span class="hidden lg:block font-medium text-foreground text-sm">\u0627\u06CC\u0645\u06CC\u0644</span>`);
        } else {
          _push(`<!---->`);
        }
        _push(` <span class="hidden lg:block font-medium text-foreground text-sm text-left">\u0639\u0645\u0644\u06CC\u0627\u062A</span></div></div> <div class="divide-y divide-border"><!--[-->`);
        ssrRenderList(5, (i) => {
          _push(`<div class="px-4 py-3"><div class="${ssrRenderClass([activeTab.value === "leads" ? "grid-cols-2 lg:grid-cols-5" : "grid-cols-2 lg:grid-cols-4", "grid gap-4 items-center"])}"><div class="h-5 bg-muted/30 rounded animate-pulse"></div> <div class="h-5 bg-muted/30 rounded animate-pulse"></div> <div class="hidden lg:block h-5 bg-muted/30 rounded animate-pulse"></div> `);
          if (activeTab.value === "leads") {
            _push(`<div class="hidden lg:block h-5 bg-muted/30 rounded animate-pulse"></div>`);
          } else {
            _push(`<!---->`);
          }
          _push(` <div class="hidden lg:flex items-center justify-end gap-2"><div class="w-8 h-8 bg-muted/30 rounded animate-pulse"></div></div></div></div>`);
        });
        _push(`<!--]--></div></div>`);
      } else {
        _push(`<div class="bg-card rounded-xl border border-border overflow-hidden"><div class="bg-muted/20 px-4 py-3 border-b border-border"><div class="${ssrRenderClass([activeTab.value === "leads" ? "grid-cols-2 lg:grid-cols-5" : "grid-cols-2 lg:grid-cols-4", "grid gap-4"])}"><span class="font-medium text-foreground text-sm">\u0634\u0646\u0627\u0633\u0647</span> <span class="font-medium text-foreground text-sm">\u0646\u0627\u0645</span> <span class="hidden lg:block font-medium text-foreground text-sm">\u0634\u0645\u0627\u0631\u0647 \u0645\u0648\u0628\u0627\u06CC\u0644</span> `);
        if (activeTab.value === "leads") {
          _push(`<span class="hidden lg:block font-medium text-foreground text-sm">\u0627\u06CC\u0645\u06CC\u0644</span>`);
        } else {
          _push(`<!---->`);
        }
        _push(` <span class="hidden lg:block font-medium text-foreground text-sm text-left">\u0639\u0645\u0644\u06CC\u0627\u062A</span></div></div> <div class="divide-y divide-border"><!--[-->`);
        ssrRenderList(messages.value, (message) => {
          _push(`<div class="px-4 py-3 hover:bg-accent/5 transition-colors cursor-pointer"><div class="${ssrRenderClass([activeTab.value === "leads" ? "grid-cols-2 lg:grid-cols-5" : "grid-cols-2 lg:grid-cols-4", "grid gap-4 items-center"])}"><span class="text-foreground font-medium">#${ssrInterpolate(message.id)}</span> <div><div class="text-foreground font-medium">${ssrInterpolate(message.name || "\u0628\u062F\u0648\u0646 \u0646\u0627\u0645")}</div> <div class="lg:hidden text-muted-foreground text-sm font-mono mt-1" dir="ltr">${ssrInterpolate(message.mobile)}</div></div> <div class="hidden lg:block text-muted-foreground text-sm font-mono" dir="ltr">${ssrInterpolate(message.mobile || "-")}</div> `);
          if (activeTab.value === "leads") {
            _push(`<div class="hidden lg:block text-muted-foreground text-sm" dir="ltr">${ssrInterpolate(message.email || "-")}</div>`);
          } else {
            _push(`<!---->`);
          }
          _push(` <div class="hidden lg:flex items-center justify-end gap-2"><button class="p-2 hover:bg-primary/10 rounded-lg transition-colors group" title="\u0645\u0634\u0627\u0647\u062F\u0647 \u062C\u0632\u0626\u06CC\u0627\u062A"><i class="ti ti-eye text-muted-foreground group-hover:text-primary text-lg"></i></button> <button class="p-2 hover:bg-destructive/10 rounded-lg transition-colors group" title="\u062D\u0630\u0641"><i class="ti ti-trash text-muted-foreground group-hover:text-destructive text-lg"></i></button></div></div></div>`);
        });
        _push(`<!--]--></div></div>`);
      }
      _push(` `);
      if (!loading.value && totalPages.value > 1) {
        _push(`<div class="flex items-center justify-center gap-2 mt-6"><!--[-->`);
        ssrRenderList(totalPages.value, (page) => {
          _push(`<button class="${ssrRenderClass([currentPage.value === page ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground hover:bg-muted/30", "w-8 h-8 rounded-lg flex items-center justify-center text-sm font-medium transition-colors"])}">${ssrInterpolate(page)}</button>`);
        });
        _push(`<!--]--></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(` `);
      if (!loading.value && messages.value.length === 0) {
        _push(`<div class="text-center py-12"><div class="w-16 h-16 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-4"><i class="${ssrRenderClass([activeTab.value === "leads" ? "ti ti-user-plus" : "ti ti-forms", "text-primary text-2xl opacity-50"])}"></i></div> <h3 class="text-foreground font-medium mb-2">\u0647\u06CC\u0686 \u067E\u06CC\u0627\u0645\u06CC \u0648\u062C\u0648\u062F \u0646\u062F\u0627\u0631\u062F</h3> <p class="text-muted-foreground text-sm">${ssrInterpolate(activeTab.value === "leads" ? "\u0647\u0646\u0648\u0632 \u0647\u06CC\u0686 \u067E\u06CC\u0627\u0645\u06CC \u0627\u0632 \u0641\u0631\u0645 \u0644\u06CC\u062F \u062F\u0631\u06CC\u0627\u0641\u062A \u0646\u0634\u062F\u0647 \u0627\u0633\u062A" : "\u0647\u0646\u0648\u0632 \u0647\u06CC\u0686 \u067E\u06CC\u0627\u0645\u06CC \u0627\u0632 \u0641\u0631\u0645\u200C\u0647\u0627\u06CC \u062F\u06CC\u06AF\u0631 \u062F\u0631\u06CC\u0627\u0641\u062A \u0646\u0634\u062F\u0647 \u0627\u0633\u062A")}</p></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div></div> `);
      ssrRenderTeleport(_push, (_push2) => {
        if (selectedMessage.value) {
          _push2(`<div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"><div class="bg-card rounded-2xl border border-border w-full max-w-lg max-h-[80vh] overflow-hidden"><div class="flex items-center justify-between p-4 border-b border-border"><div class="flex items-center gap-3"><div class="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center"><i class="${ssrRenderClass([activeTab.value === "leads" ? "ti ti-user-plus" : "ti ti-forms", "text-primary text-lg"])}"></i></div> <div><h3 class="font-bold text-foreground">\u062C\u0632\u0626\u06CC\u0627\u062A \u0641\u0631\u0645 #${ssrInterpolate(selectedMessage.value.id)}</h3> <p class="text-xs text-muted-foreground">${ssrInterpolate(formatDate(selectedMessage.value.createdAt))}</p></div></div> <button class="w-8 h-8 rounded-lg hover:bg-muted flex items-center justify-center transition-colors"><i class="ti ti-x text-muted-foreground"></i></button></div> <div class="p-4 overflow-y-auto max-h-[60vh] space-y-3">`);
          if (activeTab.value === "leads") {
            _push2(`<!--[-->`);
            if (selectedMessage.value.name) {
              _push2(`<div class="bg-muted/30 rounded-xl p-3"><span class="text-xs text-muted-foreground block mb-1">\u0646\u0627\u0645</span> <span class="text-foreground font-medium">${ssrInterpolate(selectedMessage.value.name)}</span></div>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(` `);
            if (selectedMessage.value.mobile) {
              _push2(`<div class="bg-muted/30 rounded-xl p-3"><span class="text-xs text-muted-foreground block mb-1">\u0634\u0645\u0627\u0631\u0647 \u0645\u0648\u0628\u0627\u06CC\u0644</span> <span class="text-foreground font-medium font-mono" dir="ltr">${ssrInterpolate(selectedMessage.value.mobile)}</span></div>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(` `);
            if (selectedMessage.value.email) {
              _push2(`<div class="bg-muted/30 rounded-xl p-3"><span class="text-xs text-muted-foreground block mb-1">\u0627\u06CC\u0645\u06CC\u0644</span> <span class="text-foreground font-medium" dir="ltr">${ssrInterpolate(selectedMessage.value.email)}</span></div>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(` `);
            if (selectedMessage.value.data && typeof selectedMessage.value.data === "object") {
              _push2(`<!--[-->`);
              ssrRenderList(selectedMessage.value.data, (value, key) => {
                _push2(`<div class="bg-muted/30 rounded-xl p-3"><span class="text-xs text-muted-foreground block mb-1">${ssrInterpolate(key)}</span> <span class="text-foreground font-medium">${ssrInterpolate(value || "-")}</span></div>`);
              });
              _push2(`<!--]-->`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`<!--]-->`);
          } else {
            _push2(`<!--[-->`);
            if (selectedMessage.value.data && typeof selectedMessage.value.data === "object") {
              _push2(`<!--[-->`);
              ssrRenderList(selectedMessage.value.data, (value, key) => {
                _push2(`<div class="bg-muted/30 rounded-xl p-3"><span class="text-xs text-muted-foreground block mb-1">${ssrInterpolate(key)}</span> `);
                if (isUrl(value)) {
                  _push2(`<a${ssrRenderAttr("href", value)} target="_blank" class="text-primary hover:underline font-medium break-all">${ssrInterpolate(value)}</a>`);
                } else if (Array.isArray(value)) {
                  _push2(`<span class="text-foreground font-medium">${ssrInterpolate(value.join("\u060C "))}</span>`);
                } else {
                  _push2(`<span class="text-foreground font-medium">${ssrInterpolate(value || "-")}</span>`);
                }
                _push2(`</div>`);
              });
              _push2(`<!--]-->`);
            } else {
              _push2(`<div class="text-center py-8 text-muted-foreground">
                \u0627\u0637\u0644\u0627\u0639\u0627\u062A\u06CC \u0645\u0648\u062C\u0648\u062F \u0646\u06CC\u0633\u062A
              </div>`);
            }
            _push2(`<!--]-->`);
          }
          _push2(`</div> <div class="flex items-center gap-3 p-4 border-t border-border"><button class="flex-1 py-2.5 rounded-xl bg-muted text-foreground font-medium hover:bg-muted/80 transition-colors">
              \u0628\u0633\u062A\u0646
            </button> <button class="py-2.5 px-4 rounded-xl bg-destructive/10 text-destructive font-medium hover:bg-destructive/20 transition-colors flex items-center gap-2"><i class="ti ti-trash"></i>
              \u062D\u0630\u0641
            </button></div></div></div>`);
        } else {
          _push2(`<!---->`);
        }
      }, "body", false, _parent);
      _push(`</div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/inbox/InfoFormPage.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=InfoFormPage-CHAgaV3v.mjs.map
