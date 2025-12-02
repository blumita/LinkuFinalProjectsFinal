import { e as __nuxt_component_0$2 } from './server.mjs';
import { defineComponent, ref, computed, mergeProps, withCtx, createTextVNode, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrInterpolate, ssrRenderClass, ssrRenderComponent } from 'vue/server-renderer';
import { useRouter, useRoute } from 'vue-router';
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
import 'pinia';
import 'axios';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "[slug]",
  __ssrInlineRender: true,
  setup(__props) {
    useRouter();
    useRoute();
    const feature = ref(null);
    const isLoading = ref(true);
    const error = ref(null);
    const colorSchemes = [
      { card: "bg-gradient-to-br from-blue-500/10 via-blue-500/5 to-transparent border-blue-500/20", icon: "bg-blue-500/20 dark:bg-blue-500/30", color: "text-blue-500" },
      { card: "bg-gradient-to-br from-purple-500/10 via-purple-500/5 to-transparent border-purple-500/20", icon: "bg-purple-500/20 dark:bg-purple-500/30", color: "text-purple-500" },
      { card: "bg-gradient-to-br from-emerald-500/10 via-emerald-500/5 to-transparent border-emerald-500/20", icon: "bg-emerald-500/20 dark:bg-emerald-500/30", color: "text-emerald-500" },
      { card: "bg-gradient-to-br from-pink-500/10 via-pink-500/5 to-transparent border-pink-500/20", icon: "bg-pink-500/20 dark:bg-pink-500/30", color: "text-pink-500" },
      { card: "bg-gradient-to-br from-amber-500/10 via-amber-500/5 to-transparent border-amber-500/20", icon: "bg-amber-500/20 dark:bg-amber-500/30", color: "text-amber-500" },
      { card: "bg-gradient-to-br from-cyan-500/10 via-cyan-500/5 to-transparent border-cyan-500/20", icon: "bg-cyan-500/20 dark:bg-cyan-500/30", color: "text-cyan-500" },
      { card: "bg-gradient-to-br from-rose-500/10 via-rose-500/5 to-transparent border-rose-500/20", icon: "bg-rose-500/20 dark:bg-rose-500/30", color: "text-rose-500" },
      { card: "bg-gradient-to-br from-indigo-500/10 via-indigo-500/5 to-transparent border-indigo-500/20", icon: "bg-indigo-500/20 dark:bg-indigo-500/30", color: "text-indigo-500" }
    ];
    const colorIndex = computed(() => {
      var _a;
      if ((_a = feature.value) == null ? void 0 : _a.id) {
        return (feature.value.id - 1) % colorSchemes.length;
      }
      return 0;
    });
    const getCardBgClass = computed(() => colorSchemes[colorIndex.value].card);
    const getIconBgClass = computed(() => colorSchemes[colorIndex.value].icon);
    const getIconColorClass = computed(() => colorSchemes[colorIndex.value].color);
    return (_ctx, _push, _parent, _attrs) => {
      var _a;
      const _component_NuxtLink = __nuxt_component_0$2;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "min-h-screen bg-background" }, _attrs))} data-v-da301b37>`);
      if (isLoading.value) {
        _push(`<div class="flex items-center justify-center py-20" data-v-da301b37><div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" data-v-da301b37></div></div>`);
      } else if (error.value) {
        _push(`<div class="flex flex-col items-center justify-center py-20 px-4" data-v-da301b37><i class="ti ti-alert-circle text-6xl text-muted-foreground mb-4" data-v-da301b37></i> <p class="text-muted-foreground text-center" data-v-da301b37>${ssrInterpolate(error.value)}</p> <button class="mt-4 px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors" data-v-da301b37>
        \u0628\u0627\u0632\u06AF\u0634\u062A
      </button></div>`);
      } else if (feature.value) {
        _push(`<div class="pb-24" data-v-da301b37><div class="xl:container xl:mx-auto xl:px-8" data-v-da301b37><div class="xl:grid xl:grid-cols-12 xl:gap-8 xl:py-8" data-v-da301b37><div class="hidden xl:block xl:col-span-4" data-v-da301b37><div class="sticky top-24 space-y-4" data-v-da301b37><div class="${ssrRenderClass(["rounded-2xl p-6 text-center border", getCardBgClass.value])}" data-v-da301b37><div class="${ssrRenderClass(["inline-flex items-center justify-center w-24 h-24 rounded-2xl mb-4", getIconBgClass.value])}" data-v-da301b37><i class="${ssrRenderClass([feature.value.icon || "ti ti-star", "text-5xl", getIconColorClass.value])}" data-v-da301b37></i></div> <h2 class="text-2xl font-bold text-foreground mb-3" data-v-da301b37>${ssrInterpolate(feature.value.title)}</h2> `);
        if (feature.value.description) {
          _push(`<p class="text-muted-foreground text-sm leading-relaxed" data-v-da301b37>${ssrInterpolate(feature.value.description)}</p>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div> <div class="bg-gradient-to-br from-amber-500/10 via-yellow-500/5 to-transparent border border-amber-500/20 rounded-2xl p-5" data-v-da301b37><div class="flex items-center gap-3 mb-3" data-v-da301b37><i class="ti ti-crown text-2xl text-amber-500" data-v-da301b37></i> <span class="font-bold text-foreground" data-v-da301b37>\u0627\u0634\u062A\u0631\u0627\u06A9 \u0648\u06CC\u0698\u0647</span></div> <p class="text-sm text-muted-foreground mb-4" data-v-da301b37>\u0628\u0631\u0627\u06CC \u062F\u0633\u062A\u0631\u0633\u06CC \u0628\u0647 \u0627\u06CC\u0646 \u0648\u06CC\u0698\u06AF\u06CC \u0648 \u062F\u0647\u200C\u0647\u0627 \u0627\u0645\u06A9\u0627\u0646 \u062F\u06CC\u06AF\u0631\u060C \u0627\u0634\u062A\u0631\u0627\u06A9 \u0648\u06CC\u0698\u0647 \u062A\u0647\u06CC\u0647 \u06A9\u0646\u06CC\u062F.</p> `);
        _push(ssrRenderComponent(_component_NuxtLink, {
          to: "/dashboard/checkout",
          class: "block w-full py-2.5 bg-gradient-to-r from-amber-500 to-yellow-500 text-white text-center rounded-xl font-medium hover:from-amber-600 hover:to-yellow-600 transition-all"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`
                  \u0645\u0634\u0627\u0647\u062F\u0647 \u067E\u0644\u0627\u0646\u200C\u0647\u0627
                `);
            } else {
              return [
                createTextVNode("\r\n                  \u0645\u0634\u0627\u0647\u062F\u0647 \u067E\u0644\u0627\u0646\u200C\u0647\u0627\r\n                ")
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`</div></div></div> <div class="xl:col-span-8" data-v-da301b37><div class="xl:hidden px-4 py-6 text-center" data-v-da301b37><div class="${ssrRenderClass(["inline-flex items-center justify-center w-20 h-20 rounded-2xl mb-4", getIconBgClass.value])}" data-v-da301b37><i class="${ssrRenderClass([feature.value.icon || "ti ti-star", "text-4xl", getIconColorClass.value])}" data-v-da301b37></i></div> <h2 class="text-2xl font-bold text-foreground mb-2" data-v-da301b37>${ssrInterpolate(feature.value.title)}</h2> `);
        if (feature.value.description) {
          _push(`<p class="text-muted-foreground" data-v-da301b37>${ssrInterpolate(feature.value.description)}</p>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div> <div class="px-4 xl:px-0" data-v-da301b37>`);
        if (feature.value.content) {
          _push(`<div class="prose prose-sm xl:prose-base dark:prose-invert max-w-none bg-card rounded-2xl p-6 xl:p-8 border border-border" data-v-da301b37>${(_a = feature.value.content) != null ? _a : ""}</div>`);
        } else {
          _push(`<div class="bg-card rounded-2xl p-6 xl:p-8 border border-border text-center" data-v-da301b37><i class="ti ti-file-text text-5xl text-muted-foreground/50 mb-4 block" data-v-da301b37></i> <p class="text-muted-foreground" data-v-da301b37>\u0645\u062D\u062A\u0648\u0627\u06CC\u06CC \u0628\u0631\u0627\u06CC \u0627\u06CC\u0646 \u0648\u06CC\u0698\u06AF\u06CC \u062B\u0628\u062A \u0646\u0634\u062F\u0647 \u0627\u0633\u062A.</p></div>`);
        }
        _push(`</div> <div class="xl:hidden px-4 mt-6" data-v-da301b37><div class="bg-gradient-to-br from-amber-500/10 via-yellow-500/5 to-transparent border border-amber-500/20 rounded-2xl p-4" data-v-da301b37><div class="flex items-center gap-3 mb-3" data-v-da301b37><i class="ti ti-crown text-xl text-amber-500" data-v-da301b37></i> <span class="font-bold text-foreground text-sm" data-v-da301b37>\u0627\u0634\u062A\u0631\u0627\u06A9 \u0648\u06CC\u0698\u0647</span></div> `);
        _push(ssrRenderComponent(_component_NuxtLink, {
          to: "/dashboard/checkout",
          class: "block w-full py-2.5 bg-gradient-to-r from-amber-500 to-yellow-500 text-white text-center rounded-xl font-medium text-sm"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`
                  \u0645\u0634\u0627\u0647\u062F\u0647 \u067E\u0644\u0627\u0646\u200C\u0647\u0627
                `);
            } else {
              return [
                createTextVNode("\r\n                  \u0645\u0634\u0627\u0647\u062F\u0647 \u067E\u0644\u0627\u0646\u200C\u0647\u0627\r\n                ")
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`</div></div></div></div></div></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/dashboard/checkout/feature/[slug].vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const _slug_ = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-da301b37"]]);

export { _slug_ as default };
//# sourceMappingURL=_slug_-Zwhh7aMD.mjs.map
