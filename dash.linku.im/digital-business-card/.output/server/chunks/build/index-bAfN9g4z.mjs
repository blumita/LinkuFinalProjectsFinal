import { ssrRenderAttrs, ssrRenderComponent, ssrRenderList, ssrRenderAttr, ssrInterpolate, ssrRenderStyle, ssrRenderVNode, ssrRenderClass, ssrGetDirectiveProps } from 'vue/server-renderer';
import { defineComponent, ref, computed, watch, watchEffect, unref, createVNode, resolveDynamicComponent, markRaw, mergeProps, resolveDirective, useSSRContext } from 'vue';
import { p as publicAssetsURL } from '../routes/renderer.mjs';
import moment from 'moment';
import { _ as _export_sfc } from './_plugin-vue_export-helper-1tPrXgE0.mjs';
import { u as useUserStore } from './user-D1YL8aKq.mjs';
import { a as useNuxtApp, _ as __nuxt_component_0$3 } from './server.mjs';
import { u as useIconComponents } from './useIconComponentsMap-DPTCqB5g.mjs';
import { u as useFormStore } from './form-CUJQskNk.mjs';
import 'vue-bundle-renderer/runtime';
import '../_/nitro.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import 'node:url';
import 'unhead/server';
import 'unhead/plugins';
import 'unhead/utils';
import 'pinia';
import 'vue-router';
import 'axios';

const _imports_0 = publicAssetsURL("/vip.png");
const _sfc_main$4 = {
  __name: "ProToast",
  __ssrInlineRender: true,
  props: {
    visible: Boolean
  },
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      if (__props.visible) {
        _push(`<div${ssrRenderAttrs(mergeProps({ class: "fixed top-4 inset-x-4 sm:inset-x-auto sm:right-6 z-50 bg-gradient-to-r from-gray-700 via-gray-900 to-gray-700 text-white rounded-xl shadow-lg px-4 py-3 flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 overflow-hidden" }, _attrs))} data-v-2c5a754a><div class="flex items-center gap-2" data-v-2c5a754a><i class="ti ti-lock text-xl text-yellow-300" data-v-2c5a754a></i> <span class="text-sm font-medium" data-v-2c5a754a>
          \u0627\u06CC\u0646 \u0648\u06CC\u0698\u06AF\u06CC \u0645\u062E\u0635\u0648\u0635 \u0646\u0633\u062E\u0647 <span class="text-yellow-400 font-bold" data-v-2c5a754a>\u067E\u0631\u0648</span> \u0627\u0633\u062A.
        </span></div> <a href="/dashboard/upgrade" class="text-sm font-medium text-yellow-300 hover:underline mt-1 sm:mt-0" data-v-2c5a754a>
        \u0645\u0634\u0627\u0647\u062F\u0647 \u067E\u0644\u0646\u200C\u0647\u0627 \u0648 \u062E\u0631\u06CC\u062F \u0627\u0634\u062A\u0631\u0627\u06A9 <i class="ti ti-arrow-left" data-v-2c5a754a></i></a> <div class="absolute bottom-0 right-0 h-1 bg-yellow-400 animate-toast-bar" data-v-2c5a754a></div></div>`);
      } else {
        _push(`<!---->`);
      }
    };
  }
};
const _sfc_setup$4 = _sfc_main$4.setup;
_sfc_main$4.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/UserDashboard/modals/ProToast.vue");
  return _sfc_setup$4 ? _sfc_setup$4(props, ctx) : void 0;
};
const ProToast = /* @__PURE__ */ _export_sfc(_sfc_main$4, [["__scopeId", "data-v-2c5a754a"]]);
const _sfc_main$3 = {
  __name: "Filter",
  __ssrInlineRender: true,
  props: {
    modelValue: { type: String, default: "1day" },
    username: { type: String, default: "\u06A9\u0627\u0631\u0628\u0631" }
  },
  emits: ["update:modelValue"],
  setup(__props, { emit: __emit }) {
    const filters = {
      "1day": "\u0631\u0648\u0632\u0627\u0646\u0647",
      "7days": "\u0647\u0641\u062A\u0647",
      "30days": "\u0645\u0627\u0647",
      "90days": "\u06F3 \u0645\u0627\u0647"
    };
    const proKeys = ["7days", "30days", "90days"];
    const showToast = ref(false);
    const isPro = (key) => proKeys.includes(key);
    const userStore = useUserStore();
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "w-full space-y-4" }, _attrs))}>`);
      _push(ssrRenderComponent(ProToast, { visible: showToast.value }, null, _parent));
      _push(` <div class="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 sm:gap-2"><div class="text-center sm:text-right text-base sm:text-lg font-semibold text-foreground w-full sm:w-auto">${ssrInterpolate(__props.username)} \u0639\u0632\u06CC\u0632 \u062E\u0648\u0634 \u0622\u0645\u062F\u06CC\u062F
      </div> <div class="flex flex-wrap justify-center sm:justify-end gap-2 w-full sm:w-auto"><!--[-->`);
      ssrRenderList(filters, (label, key) => {
        var _a;
        _push(`<button class="${ssrRenderClass([
          "px-4 py-2 text-sm font-medium rounded-full border transition",
          __props.modelValue === key ? "bg-primary text-primary-foreground border-primary" : "bg-card text-foreground border-border hover:bg-muted",
          isPro(key) && !((_a = unref(userStore).user) == null ? void 0 : _a.isPro) ? "opacity-60 cursor-not-allowed" : "cursor-pointer"
        ])}">${ssrInterpolate(label)}</button>`);
      });
      _push(`<!--]--></div></div></div>`);
    };
  }
};
const _sfc_setup$3 = _sfc_main$3.setup;
_sfc_main$3.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/UserDashboard/main/insights/Filter.vue");
  return _sfc_setup$3 ? _sfc_setup$3(props, ctx) : void 0;
};
const _sfc_main$2 = /* @__PURE__ */ defineComponent({
  __name: "StatsCard",
  __ssrInlineRender: true,
  props: {
    label: {},
    value: {},
    trend: {},
    tooltip: {},
    loading: { type: Boolean }
  },
  setup(__props) {
    const props = __props;
    computed(() => {
      return [{
        name: "\u0622\u0645\u0627\u0631",
        data: props.trend || []
      }];
    });
    return (_ctx, _push, _parent, _attrs) => {
      var _a;
      const _component_client_only = __nuxt_component_0$3;
      const _directive_tooltip = resolveDirective("tooltip");
      let _temp0;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "border border-border rounded-xl p-4 text-center shadow-sm bg-card min-h-[160px]" }, _attrs))}>`);
      if (_ctx.loading) {
        _push(`<!--[--><div class="flex justify-end text-muted-foreground mb-1"><div class="w-4 h-4 rounded-full bg-muted animate-pulse"></div></div> <div class="h-6 w-20 bg-muted mx-auto my-2 rounded animate-pulse"></div> <div class="h-4 w-24 bg-muted/70 mx-auto my-2 rounded animate-pulse"></div> <div class="h-[50px] w-full bg-muted/50 rounded animate-pulse mt-2"></div><!--]-->`);
      } else {
        _push(`<!--[--><div class="flex justify-end text-muted-foreground mb-1"><i${ssrRenderAttrs(_temp0 = mergeProps({ class: "ti ti-info-circle" }, ssrGetDirectiveProps(_ctx, _directive_tooltip, _ctx.tooltip)))}>${"textContent" in _temp0 ? ssrInterpolate(_temp0.textContent) : (_a = _temp0.innerHTML) != null ? _a : ""}</i></div> <div class="text-2xl font-bold mb-1 text-foreground">${ssrInterpolate(_ctx.value)}</div> <div class="text-sm text-muted-foreground mb-2">${ssrInterpolate(_ctx.label)}</div> <div class="h-[50px]">`);
        if (!_ctx.trend || _ctx.trend.length === 0) {
          _push(`<div class="flex items-center justify-center text-muted-foreground text-xs h-full">
          \u062F\u0627\u062F\u0647\u200C\u0627\u06CC \u0628\u0631\u0627\u06CC \u0646\u0645\u0648\u062F\u0627\u0631 \u0645\u0648\u062C\u0648\u062F \u0646\u06CC\u0633\u062A
        </div>`);
        } else {
          _push(ssrRenderComponent(_component_client_only, null, {}, _parent));
        }
        _push(`</div><!--]-->`);
      }
      _push(`</div>`);
    };
  }
});
const _sfc_setup$2 = _sfc_main$2.setup;
_sfc_main$2.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/UserDashboard/main/insights/StatsCard.vue");
  return _sfc_setup$2 ? _sfc_setup$2(props, ctx) : void 0;
};
const _sfc_main$1 = /* @__PURE__ */ defineComponent({
  __name: "Index",
  __ssrInlineRender: true,
  setup(__props) {
    const nuxtApp = useNuxtApp();
    const $axios = nuxtApp.$axios;
    const formStore = useFormStore();
    const cardId = ref("");
    const statsCardsLoading = ref(true);
    const linksLoading = ref(true);
    const isLoading = ref(false);
    const store = ref(null);
    const statsCards = computed(() => {
      var _a;
      return ((_a = store.value) == null ? void 0 : _a.statsCards) || [];
    });
    const getLinks = computed(() => {
      var _a;
      return ((_a = store.value) == null ? void 0 : _a.getLinks) || [];
    });
    const selectedRange = ref("1day");
    const visibleLinks = computed(() => {
      return getLinks.value.slice(0, 5);
    });
    const isProFilter = computed(() => selectedRange.value !== "1day");
    let rawLinks = [];
    const clicksByDate = ref({});
    const viewsByDate = ref({});
    const applyFilter = async (key) => {
      var _a, _b, _c;
      if (!store.value) return;
      statsCardsLoading.value = true;
      linksLoading.value = true;
      const days = parseInt(key);
      const from = moment().subtract(days, "days").format("YYYY-MM-DD");
      const to = moment().format("YYYY-MM-DD");
      if (cardId.value) {
        try {
          const response = await $axios.get(`cards/${cardId.value}/views`, {
            params: { from, to }
          });
          rawLinks = Array.isArray((_a = formStore.defaultCard) == null ? void 0 : _a.linksDataList) ? (_c = (_b = formStore.defaultCard) == null ? void 0 : _b.linksDataList) == null ? void 0 : _c.map((link) => formStore.normalizeLink(link)) : [];
          clicksByDate.value = response.data.data.clicks_by_date || {};
          viewsByDate.value = response.data.data.views_by_date || {};
        } catch (error) {
        }
      }
      store.value.setRange([from, to]);
      store.value.generateMockData(clicksByDate.value, viewsByDate.value, rawLinks);
      statsCardsLoading.value = false;
      linksLoading.value = false;
    };
    watch(selectedRange, (val) => {
      applyFilter(val);
    });
    watchEffect(() => {
      var _a;
      if ((_a = formStore.defaultCard) == null ? void 0 : _a.id) {
        cardId.value = formStore.defaultCard.id;
      }
      applyFilter(selectedRange.value);
    });
    const { getIconComponent } = useIconComponents();
    const userStore = useUserStore();
    const isPro = computed(() => {
      var _a;
      return (_a = userStore.user) == null ? void 0 : _a.isPro;
    });
    const hasCustomColor = computed(() => {
      var _a;
      return !!(((_a = formStore.iconColor) == null ? void 0 : _a.background) && formStore.iconColor.background !== "transparent");
    });
    const iconColor = computed(() => {
      if (hasCustomColor.value) {
        return formStore.iconColor.background;
      }
      return void 0;
    });
    return (_ctx, _push, _parent, _attrs) => {
      var _a;
      if (store.value && statsCards.value && getLinks.value) {
        _push(`<div class="px-4 pb-24 pt-4">`);
        _push(ssrRenderComponent(_sfc_main$3, {
          modelValue: selectedRange.value,
          "onUpdate:modelValue": ($event) => selectedRange.value = $event,
          username: (_a = unref(userStore).user) == null ? void 0 : _a.name
        }, null, _parent));
        _push(` <div class="grid grid-cols-2 md:grid-cols-3 gap-4 mt-6">`);
        if (statsCards.value.length > 0) {
          _push(`<!--[-->`);
          ssrRenderList(statsCards.value, (card) => {
            _push(ssrRenderComponent(_sfc_main$2, {
              key: card.key,
              style: !isProFilter.value || isPro.value ? null : { display: "none" },
              label: card.label,
              value: card.value,
              trend: card.trend,
              tooltip: card.tooltip,
              loading: isLoading.value
            }, null, _parent));
          });
          _push(`<!--]-->`);
        } else if (statsCardsLoading.value) {
          _push(`<!--[-->`);
          ssrRenderList(3, (n) => {
            _push(`<div class="border border-border rounded-xl p-4 text-center shadow-sm bg-card min-h-[160px] animate-pulse"><div class="flex justify-end mb-1"><div class="w-4 h-4 rounded-full bg-muted"></div></div> <div class="h-7 w-16 bg-muted mx-auto my-2 rounded"></div> <div class="h-4 w-20 bg-muted/70 mx-auto my-2 rounded"></div> <div class="h-[50px] w-full bg-muted/50 rounded mt-2"></div></div>`);
          });
          _push(`<!--]-->`);
        } else {
          _push(`<div class="col-span-2 md:col-span-3 flex flex-col items-center justify-center bg-gradient-to-r from-primary/20 via-primary/10 to-primary/20 border border-border text-foreground rounded-xl p-6 text-center text-base font-bold gap-3 min-h-[160px] shadow-md"><img${ssrRenderAttr("src", _imports_0)} alt="\u067E\u0631\u0648" class="w-10 h-10 mb-2"> <span class="flex items-center gap-2 justify-center"><i class="ti ti-lock text-2xl text-primary"></i>
            \u0628\u0631\u0627\u06CC \u0645\u0634\u0627\u0647\u062F\u0647 \u0622\u0645\u0627\u0631 \u0627\u06CC\u0646 \u0628\u0627\u0632\u0647 \u0632\u0645\u0627\u0646\u06CC\u060C <span class="mx-1 text-primary font-semibold">\u0627\u0634\u062A\u0631\u0627\u06A9 \u067E\u0631\u0648</span> \u062A\u0647\u06CC\u0647 \u06A9\u0646\u06CC\u062F.
          </span></div>`);
        }
        _push(`</div> <div class="bg-card rounded-xl border border-border p-4 space-y-4 mt-6"><h2 class="text-sm font-bold text-foreground flex items-center gap-2">
        \u062A\u0639\u0627\u0645\u0644 \u0628\u0627 \u0644\u06CC\u0646\u06A9\u200C\u0647\u0627
        <span class="ml-2 text-xs font-normal text-muted-foreground">(${ssrInterpolate(visibleLinks.value.length)} \u0644\u06CC\u0646\u06A9)</span></h2> `);
        if (visibleLinks.value.length > 0) {
          _push(`<!--[--><!--[-->`);
          ssrRenderList(visibleLinks.value, (item, index) => {
            _push(`<div style="${ssrRenderStyle(index < 3 || isPro.value ? null : { display: "none" })}" class="flex items-center justify-between bg-muted/50 p-3 rounded-xl"><div class="flex items-center gap-3"><div class="relative w-10 h-10 rounded-xl flex items-center justify-center bg-white">`);
            if (unref(getIconComponent)(item.icon)) {
              ssrRenderVNode(_push, createVNode(resolveDynamicComponent(markRaw(unref(getIconComponent)(item.icon))), {
                size: 32,
                color: hasCustomColor.value ? iconColor.value : void 0,
                filled: hasCustomColor.value
              }, null), _parent);
            } else if (item.customIcon) {
              _push(`<img${ssrRenderAttr("src", item.customIcon)} class="w-full h-full object-contain" alt="icon">`);
            } else {
              _push(`<i class="ti ti-link text-gray-400 text-xl"></i>`);
            }
            _push(`</div> <div class="flex flex-col text-sm"><span class="font-semibold text-foreground">${ssrInterpolate(item.label)}</span></div></div> <div class="text-xs text-muted-foreground">${ssrInterpolate(item.clicks)} \u06A9\u0644\u06CC\u06A9</div></div>`);
          });
          _push(`<!--]--> `);
          if (visibleLinks.value.length > 3 && !isPro.value) {
            _push(`<div class="bg-gradient-to-r from-muted via-muted/80 to-muted border border-border text-foreground rounded-xl px-4 py-3 text-sm font-medium flex items-center gap-3 shadow-sm"><img${ssrRenderAttr("src", _imports_0)} alt="\u067E\u0631\u0648" class="w-6 h-6"> <span class="flex flex-col items-start gap-1 text-right"><span class="flex items-center gap-1"><i class="ti ti-lock text-muted-foreground text-base"></i>
              \u0628\u0631\u0627\u06CC \u0645\u0634\u0627\u0647\u062F\u0647 \u0622\u0645\u0627\u0631 \u0628\u06CC\u0634\u062A\u0631\u060C
              <span class="text-primary font-semibold underline decoration-dotted">\u0646\u0633\u062E\u0647 \u067E\u0631\u0648</span>
              \u0631\u0627 \u062A\u0647\u06CC\u0647 \u06A9\u0646\u06CC\u062F!
            </span> <span class="text-xs text-muted-foreground mt-1">${ssrInterpolate(visibleLinks.value.length - 3)} \u0644\u06CC\u0646\u06A9 \u062F\u06CC\u06AF\u0631 \u0642\u0627\u0628\u0644 \u0646\u0645\u0627\u06CC\u0634 \u0646\u06CC\u0633\u062A.</span></span></div>`);
          } else {
            _push(`<!---->`);
          }
          _push(`<!--]-->`);
        } else if (linksLoading.value) {
          _push(`<!--[-->`);
          ssrRenderList(3, (n) => {
            _push(`<div class="flex items-center justify-between bg-muted/50 p-3 rounded-xl animate-pulse"><div class="flex items-center gap-3"><div class="w-10 h-10 rounded-xl bg-white"></div> <div class="h-4 w-24 bg-muted rounded"></div></div> <div class="h-3 w-12 bg-muted/70 rounded"></div></div>`);
          });
          _push(`<!--]-->`);
        } else {
          _push(`<div class="bg-muted/50 border border-border text-muted-foreground rounded-xl px-4 py-6 text-sm font-semibold text-center">
          \u0628\u0631\u0627\u06CC \u062F\u06CC\u062F\u0646 \u0644\u06CC\u0646\u06A9\u200C\u0647\u0627\u06CC \u0622\u0645\u0627\u0631\u06CC \u0627\u06CC\u0646 \u0628\u0627\u0632\u0647\u060C \u0627\u0628\u062A\u062F\u0627 \u0627\u0634\u062A\u0631\u0627\u06A9 <span class="text-primary">\u067E\u0631\u0648</span> \u062A\u0647\u06CC\u0647 \u06A9\u0646\u06CC\u062F.
        </div>`);
        }
        _push(`</div></div>`);
      } else {
        _push(`<div${ssrRenderAttrs(mergeProps({ class: "px-4 pb-24 pt-4" }, _attrs))}><div class="w-full space-y-4 animate-pulse"><div class="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 sm:gap-2"><div class="h-6 w-40 bg-muted rounded mx-auto sm:mx-0"></div> <div class="flex flex-wrap justify-center sm:justify-end gap-2"><!--[-->`);
        ssrRenderList(4, (n) => {
          _push(`<div class="h-9 w-16 bg-muted rounded-full"></div>`);
        });
        _push(`<!--]--></div></div></div> <div class="grid grid-cols-2 md:grid-cols-3 gap-4 mt-6"><!--[-->`);
        ssrRenderList(3, (n) => {
          _push(`<div class="border border-border rounded-xl p-4 text-center shadow-sm bg-card min-h-[160px] animate-pulse"><div class="flex justify-end mb-1"><div class="w-4 h-4 rounded-full bg-muted"></div></div> <div class="h-7 w-16 bg-muted mx-auto my-2 rounded"></div> <div class="h-4 w-20 bg-muted/70 mx-auto my-2 rounded"></div> <div class="h-[50px] w-full bg-muted/50 rounded mt-2"></div></div>`);
        });
        _push(`<!--]--></div> <div class="bg-card rounded-xl border border-border p-4 space-y-4 mt-6 animate-pulse"><div class="flex items-center gap-2"><div class="h-4 w-24 bg-muted rounded"></div> <div class="h-3 w-12 bg-muted/70 rounded"></div></div> <!--[-->`);
        ssrRenderList(3, (n) => {
          _push(`<div class="flex items-center justify-between bg-muted/50 p-3 rounded-xl"><div class="flex items-center gap-3"><div class="w-10 h-10 rounded-xl bg-white"></div> <div class="h-4 w-24 bg-muted rounded"></div></div> <div class="h-3 w-12 bg-muted/70 rounded"></div></div>`);
        });
        _push(`<!--]--></div></div>`);
      }
    };
  }
});
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/UserDashboard/main/insights/Index.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const _sfc_main = {
  __name: "index",
  __ssrInlineRender: true,
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(_attrs)}>`);
      _push(ssrRenderComponent(_sfc_main$1, null, null, _parent));
      _push(`</div>`);
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/dashboard/insights/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=index-bAfN9g4z.mjs.map
