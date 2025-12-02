import { e as __nuxt_component_0$2 } from './server.mjs';
import { ref, watch, mergeProps, unref, withCtx, createTextVNode, toDisplayString, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrInterpolate, ssrRenderList, ssrRenderComponent } from 'vue/server-renderer';
import { useRoute } from 'vue-router';
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

const _sfc_main = {
  __name: "feature",
  __ssrInlineRender: true,
  setup(__props) {
    const route = useRoute();
    const loading = ref(true);
    const error = ref("");
    const feature2 = ref({ title: "", content: "" });
    const features = ref([]);
    const featuresLoading = ref(true);
    const featuresError = ref("");
    async function fetchFeature(slug) {
      loading.value = true;
      error.value = "";
      try {
        if (!slug) {
          feature2.value = { title: "", content: "" };
          loading.value = false;
          return;
        }
        const res = await fetch(`/api/features/${slug}`);
        if (!res.ok) throw new Error("\u062E\u0637\u0627 \u062F\u0631 \u062F\u0631\u06CC\u0627\u0641\u062A \u0627\u0637\u0644\u0627\u0639\u0627\u062A");
        const data = await res.json();
        feature2.value = data;
      } catch (e) {
        error.value = e.message || "\u062E\u0637\u0627 \u062F\u0631 \u062F\u0631\u06CC\u0627\u0641\u062A \u0627\u0637\u0644\u0627\u0639\u0627\u062A";
      } finally {
        loading.value = false;
      }
    }
    function getShortDescription(html) {
      if (!html) return "";
      const text = html.replace(/<[^>]+>/g, "").trim();
      const firstSentence = text.split(/[.!؟\n]/)[0];
      return firstSentence.length > 0 ? firstSentence : text.slice(0, 60) + "...";
    }
    watch(() => route.query.slug, (newSlug) => {
      if (newSlug) fetchFeature(newSlug);
    });
    return (_ctx, _push, _parent, _attrs) => {
      var _a;
      const _component_NuxtLink = __nuxt_component_0$2;
      _push(`<section${ssrRenderAttrs(mergeProps({ class: "min-h-screen bg-white flex flex-col items-center py-8 px-2 sm:px-6" }, _attrs))} data-v-86e16c1d><div class="w-full max-w-2xl mb-8" data-v-86e16c1d>`);
      if (featuresLoading.value) {
        _push(`<div class="flex justify-center items-center h-20" data-v-86e16c1d><div class="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-900" data-v-86e16c1d></div> <span class="mr-2" data-v-86e16c1d>\u062F\u0631 \u062D\u0627\u0644 \u062F\u0631\u06CC\u0627\u0641\u062A \u0644\u06CC\u0633\u062A \u0648\u06CC\u0698\u06AF\u06CC\u200C\u0647\u0627...</span></div>`);
      } else if (featuresError.value) {
        _push(`<div class="text-red-500 text-center py-4" data-v-86e16c1d>${ssrInterpolate(featuresError.value)}</div>`);
      } else {
        _push(`<div data-v-86e16c1d><div class="mb-6" data-v-86e16c1d><h2 class="text-lg font-semibold mb-2 text-gray-800" data-v-86e16c1d>\u0648\u06CC\u0698\u06AF\u06CC\u200C\u0647\u0627\u06CC \u0627\u0634\u062A\u0631\u0627\u06A9</h2> <p class="text-gray-500 text-sm mb-3" data-v-86e16c1d>\u062F\u0631 \u0627\u06CC\u0646 \u0628\u062E\u0634 \u0645\u06CC\u200C\u062A\u0648\u0627\u0646\u06CC\u062F \u0628\u0627 \u0627\u0645\u06A9\u0627\u0646\u0627\u062A \u0648 \u0642\u0627\u0628\u0644\u06CC\u062A\u200C\u0647\u0627\u06CC \u0648\u06CC\u0698\u0647 \u0627\u0634\u062A\u0631\u0627\u06A9 \u0644\u06CC\u0646\u06A9\u0648 \u0622\u0634\u0646\u0627 \u0634\u0648\u06CC\u062F. \u0647\u0631 \u0648\u06CC\u0698\u06AF\u06CC \u0631\u0627 \u0627\u0646\u062A\u062E\u0627\u0628 \u06A9\u0646\u06CC\u062F \u062A\u0627 \u062A\u0648\u0636\u06CC\u062D\u0627\u062A \u06A9\u0627\u0645\u0644 \u0622\u0646 \u0631\u0627 \u0645\u0634\u0627\u0647\u062F\u0647 \u06A9\u0646\u06CC\u062F.</p> <ul class="flex flex-wrap gap-2" data-v-86e16c1d><!--[-->`);
        ssrRenderList(features.value, (item) => {
          _push(`<li data-v-86e16c1d>`);
          _push(ssrRenderComponent(_component_NuxtLink, {
            to: { path: "/dashboard/feature", query: { slug: item.slug } },
            class: ["px-3 py-1 rounded bg-gray-50 hover:bg-gray-100 text-sm transition border border-gray-200", { "bg-gray-900 text-white font-bold border-gray-900": item.slug === unref(route).query.slug }]
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(`${ssrInterpolate(item.title)}`);
              } else {
                return [
                  createTextVNode(toDisplayString(item.title), 1)
                ];
              }
            }),
            _: 2
          }, _parent));
          _push(`</li>`);
        });
        _push(`<!--]--></ul></div> `);
        if (loading.value) {
          _push(`<div class="flex justify-center items-center h-40" data-v-86e16c1d><div class="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" data-v-86e16c1d></div> <span class="mr-3" data-v-86e16c1d>\u062F\u0631 \u062D\u0627\u0644 \u0628\u0627\u0631\u06AF\u0630\u0627\u0631\u06CC...</span></div>`);
        } else if (error.value) {
          _push(`<div class="text-red-500 text-center py-8" data-v-86e16c1d>${ssrInterpolate(error.value)}</div>`);
        } else {
          _push(`<div data-v-86e16c1d><div class="flex flex-col items-center justify-center text-center mb-8 p-6 bg-white rounded-2xl border border-gray-200 shadow-sm" data-v-86e16c1d><h1 class="text-3xl font-extrabold mb-4 text-gray-900 sm:text-4xl" data-v-86e16c1d>${ssrInterpolate(feature2.value.title)}</h1> `);
          if (feature2.value.description) {
            _push(`<div class="text-lg sm:text-xl text-gray-900 mb-4 font-medium animate-fadein" data-v-86e16c1d>${ssrInterpolate(feature2.value.description)}</div>`);
          } else if (feature2.value.content) {
            _push(`<div class="text-base text-gray-700 mb-4 animate-fadein" data-v-86e16c1d>${ssrInterpolate(getShortDescription(feature2.value.content))}</div>`);
          } else {
            _push(`<div class="text-gray-400 text-base mb-4 animate-fadein" data-v-86e16c1d>\u062A\u0648\u0636\u06CC\u062D\u06CC \u0628\u0631\u0627\u06CC \u0627\u06CC\u0646 \u0648\u06CC\u0698\u06AF\u06CC \u062B\u0628\u062A \u0646\u0634\u062F\u0647 \u0627\u0633\u062A.</div>`);
          }
          _push(` <div class="prose max-w-none w-full text-right bg-gray-50 rounded-xl p-4 border border-gray-200 mb-6" data-v-86e16c1d>${(_a = feature2.value.content) != null ? _a : ""}</div> `);
          _push(ssrRenderComponent(_component_NuxtLink, {
            to: "/dashboard/upgrade",
            class: "inline-block bg-gray-900 hover:bg-black text-white font-bold px-8 py-3 rounded-xl text-lg shadow transition-all duration-200"
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(`\u062E\u0631\u06CC\u062F \u0627\u0634\u062A\u0631\u0627\u06A9 \u0648 \u0641\u0639\u0627\u0644\u200C\u0633\u0627\u0632\u06CC \u0627\u06CC\u0646 \u0648\u06CC\u0698\u06AF\u06CC`);
              } else {
                return [
                  createTextVNode("\u062E\u0631\u06CC\u062F \u0627\u0634\u062A\u0631\u0627\u06A9 \u0648 \u0641\u0639\u0627\u0644\u200C\u0633\u0627\u0632\u06CC \u0627\u06CC\u0646 \u0648\u06CC\u0698\u06AF\u06CC")
                ];
              }
            }),
            _: 1
          }, _parent));
          _push(`</div></div>`);
        }
        _push(`</div>`);
      }
      _push(`</div></section>`);
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/dashboard/upgrade/feature.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const feature = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-86e16c1d"]]);

export { feature as default };
//# sourceMappingURL=feature-V1lEb14v.mjs.map
