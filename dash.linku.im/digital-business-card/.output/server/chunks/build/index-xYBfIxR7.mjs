import { c as buildAssetsURL } from '../routes/renderer.mjs';
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderAttr, ssrInterpolate, ssrRenderList, ssrRenderClass, ssrRenderStyle } from 'vue/server-renderer';
import { a as useNuxtApp, e as __nuxt_component_0$2 } from './server.mjs';
import { ref, computed, mergeProps, unref, withCtx, createVNode, createTextVNode, toDisplayString, useSSRContext } from 'vue';
import { u as useUserStore } from './user-D1YL8aKq.mjs';
import { u as usePlanStore } from './plan-BwkVH_kK.mjs';
import { defineStore } from 'pinia';
import { _ as _export_sfc } from './_plugin-vue_export-helper-1tPrXgE0.mjs';
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
import 'vue-router';
import 'axios';
import './form-CUJQskNk.mjs';

const _imports_0 = "" + buildAssetsURL("permium.Do37hPbn.png");
const _imports_1 = "" + buildAssetsURL("clock.CjPF14Cr.png");
const useSupportStore = defineStore("support", () => {
  const support = ref({
    email: "",
    phone: "",
    socialMediaLink: "",
    active: true
  });
  const { $axios } = useNuxtApp();
  const axios = $axios;
  const loading = ref(false);
  const error = ref(null);
  const fetchSupport = async () => {
    var _a;
    loading.value = true;
    error.value = null;
    try {
      const res = await axios.get("support/info");
      if ((_a = res.data) == null ? void 0 : _a.data) support.value = res.data.data;
    } catch (err) {
      error.value = err.message || "\u062E\u0637\u0627 \u062F\u0631 \u062F\u0631\u06CC\u0627\u0641\u062A Support";
    } finally {
      loading.value = false;
    }
  };
  return {
    support,
    loading,
    error,
    fetchSupport
  };
});
const _sfc_main$1 = {
  __name: "index",
  __ssrInlineRender: true,
  setup(__props) {
    const showDiscount = ref(false);
    const supportPopup = ref(false);
    const discountApplied = ref(false);
    const daysLeft = ref(0);
    const planStore = usePlanStore();
    const userStore = useUserStore();
    const loading = ref(true);
    const discountCode = ref("");
    const discountValue = ref(0);
    const discountType = ref("");
    const isPro = computed(() => {
      var _a;
      return (_a = userStore.user) == null ? void 0 : _a.isPro;
    });
    const plans = computed(() => planStore.plans);
    const features = computed(() => planStore.features);
    const { $axios } = useNuxtApp();
    const supportStore = useSupportStore();
    const finalMonthlyPrice = (plan) => {
      planStore.selectedPlanId === plan.id;
      let price = plan.price;
      if (plan.discount) {
        price = Math.round(price * (1 - plan.discount / 100));
      }
      if (discountApplied.value) {
        if (discountType.value === "percentage") {
          price = Math.round(price * (1 - discountValue.value / 100));
        } else if (discountType.value === "fixed") {
          price = Math.max(0, price - discountValue.value);
        }
      }
      let months = 1;
      switch (plan.duration) {
        case "\u0645\u0627\u0647":
          months = 1;
          break;
        case "3\u0645\u0627\u0647":
          months = 3;
          break;
        case "6\u0645\u0627\u0647":
          months = 6;
          break;
        case "\u0633\u0627\u0644":
          months = 12;
          break;
      }
      return Math.round(price / months);
    };
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0$2;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "space-y-4" }, _attrs))} data-v-616c83d7>`);
      if (loading.value) {
        _push(`<div class="relative rounded-2xl overflow-hidden bg-gradient-to-b from-gray-200 to-white py-16 px-4 animate-pulse" data-v-616c83d7><div class="absolute inset-0 bg-gray-300 opacity-20" data-v-616c83d7></div> <div class="relative z-10 text-center space-y-3" data-v-616c83d7><div class="h-6 w-1/3 mx-auto bg-gray-300 rounded" data-v-616c83d7></div> <div class="h-4 w-2/3 mx-auto bg-gray-200 rounded" data-v-616c83d7></div> <div class="h-3 w-1/2 mx-auto bg-gray-100 rounded" data-v-616c83d7></div></div></div>`);
      } else {
        _push(`<div data-v-616c83d7><div class="relative rounded-2xl overflow-hidden bg-gradient-to-b from-gray-200 to-white py-16 px-4" data-v-616c83d7><div class="absolute inset-0 z-0 opacity-20" data-v-616c83d7><img${ssrRenderAttr("src", _imports_0)} alt="\u06A9\u0627\u0631\u0628\u0631\u0627\u0646" class="w-full h-full object-cover" data-v-616c83d7></div> <div class="relative z-10 text-center text-gray-800" data-v-616c83d7><h2 class="text-3xl font-bold mb-4" data-v-616c83d7>\u062E\u0631\u06CC\u062F \u0627\u0634\u062A\u0631\u0627\u06A9 \u0644\u06CC\u0646\u06A9\u0648</h2> <p class="text-lg font-medium text-gray-600" data-v-616c83d7>\u0628\u0627 \u062E\u0631\u06CC\u062F \u0627\u0634\u062A\u0631\u0627\u06A9 <span class="font-bold text-black" data-v-616c83d7>\u0644\u06CC\u0646\u06A9\u0648</span> \u0627\u0632
            \u0645\u0632\u0627\u06CC\u0627\u06CC \u067E\u06CC\u0634\u0631\u0641\u062A\u0647 \u0648 \u0627\u0645\u06A9\u0627\u0646\u0627\u062A \u0648\u06CC\u0698\u0647 \u0628\u0647\u0631\u0647\u200C\u0645\u0646\u062F \u0634\u0648\u06CC\u062F.</p> <p class="text-sm text-gray-500 mt-2" data-v-616c83d7>\u062F\u0633\u062A\u0631\u0633\u06CC \u0633\u0631\u06CC\u0639\u200C\u062A\u0631\u060C \u0627\u0645\u06A9\u0627\u0646\u0627\u062A \u0627\u062E\u062A\u0635\u0627\u0635\u06CC\u060C \u0648 \u062A\u062C\u0631\u0628\u0647\u200C\u0627\u06CC \u062D\u0631\u0641\u0647\u200C\u0627\u06CC\u200C\u062A\u0631 \u0628\u0631\u0627\u06CC \u06A9\u0627\u0631\u0628\u0631\u0627\u0646
            \u0648\u06CC\u0698\u0647.</p></div></div> `);
        if (unref(isPro)) {
          _push(`<div class="relative bg-gradient-to-b from-gray-300 to-gray-100 rounded-2xl p-6 mt-12 max-w-7xl mx-auto flex items-center justify-between" data-v-616c83d7><div class="flex flex-col items-end justify-center text-gray-600" data-v-616c83d7><div class="flex items-end space-x-2" data-v-616c83d7><span class="text-[52px] font-bold text-gray-500 leading-none" data-v-616c83d7>${ssrInterpolate(daysLeft.value)}</span> <div class="flex items-center leading-none text-right" data-v-616c83d7><span class="text-sm" data-v-616c83d7>\u0631\u0648\u0632 \u0627\u0632 \u0627\u0634\u062A\u0631\u0627\u06A9 \u0634\u0645\u0627 \u0628\u0627\u0642\u06CC \u0645\u0627\u0646\u062F\u0647</span></div></div> <p class="text-xs mt-2 text-gray-500" data-v-616c83d7>\u0645\u06CC\u200C\u062A\u0648\u0627\u0646\u06CC\u062F \u0632\u0645\u0627\u0646 \u0627\u0634\u062A\u0631\u0627\u06A9 \u062E\u0648\u062F \u0631\u0627 \u0627\u0641\u0632\u0627\u06CC\u0634 \u062F\u0647\u06CC\u062F:</p></div> <div class="w-40 h-40 -mt-30 mr-2 rotate-[15deg]" data-v-616c83d7><img${ssrRenderAttr("src", _imports_1)} alt="\u0622\u06CC\u06A9\u0648\u0646 \u0633\u0627\u0639\u062A \u0628\u0627 \u062A\u0627\u062C" class="w-full h-full object-contain" data-v-616c83d7></div></div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div>`);
      }
      _push(` <div class="grid lg:grid-cols-4 gap-6" data-v-616c83d7>`);
      if (loading.value) {
        _push(`<!--[-->`);
        ssrRenderList(4, (i) => {
          _push(`<div class="rounded-xl p-4 bg-gradient-to-b from-gray-200 to-gray-100 animate-pulse h-40" data-v-616c83d7><div class="h-5 w-1/3 bg-gray-300 rounded mb-3" data-v-616c83d7></div> <div class="h-4 w-1/4 bg-gray-200 rounded mb-3" data-v-616c83d7></div> <div class="h-6 w-2/3 bg-gray-300 rounded mb-3" data-v-616c83d7></div> <div class="h-8 w-full bg-gray-200 rounded" data-v-616c83d7></div></div>`);
        });
        _push(`<!--]-->`);
      } else {
        _push(`<!--[-->`);
        ssrRenderList(unref(plans), (plan) => {
          _push(`<div class="${ssrRenderClass([
            "rounded-xl p-6 cursor-pointer transition-all text-center relative shadow-md border flex flex-col items-center justify-center space-y-4",
            unref(planStore).selectedPlanId === plan.id ? "ring-2 ring-yellow-300 scale-[1.02] shadow-lg" : "",
            plan.popularity === "recommended" ? "bg-gradient-to-b from-[#D4AF37] to-[#B8860B] text-white border-yellow-600" : "bg-gradient-to-b from-[#444] to-[#222] text-white border-gray-600"
          ])}" data-v-616c83d7><p class="font-bold text-2xl" data-v-616c83d7>${ssrInterpolate(plan.title)}</p> `);
          if (plan.subtitle) {
            _push(`<p class="text-sm hidden opacity-80" data-v-616c83d7>${ssrInterpolate(plan.subtitle)}</p>`);
          } else {
            _push(`<!---->`);
          }
          _push(` `);
          if (plan.discount !== 0) {
            _push(`<p class="text-lg text-center bg-white/20 px-6 py-1.5 rounded-full w-fit mx-auto tracking-wide" data-v-616c83d7>${ssrInterpolate(plan.discount)}\u066A \u062A\u062E\u0641\u06CC\u0641
          </p>`);
          } else {
            _push(`<!---->`);
          }
          _push(` <div class="flex flex-col items-center space-y-2" data-v-616c83d7><p class="text-lg font-semibold opacity-90" data-v-616c83d7>\u0647\u0631 \u0645\u0627\u0647</p> `);
          if (["\u0645\u0627\u0647", "3\u0645\u0627\u0647", "6\u0645\u0627\u0647", "\u0633\u0627\u0644"].includes(plan.duration)) {
            _push(`<p class="text-3xl font-extrabold opacity-95" data-v-616c83d7>`);
            if (plan.duration === "\u0645\u0627\u0647") {
              _push(`<!--[-->${ssrInterpolate(Math.round(finalMonthlyPrice(plan)).toLocaleString("fa-IR"))} \u062A\u0648\u0645\u0627\u0646
              <!--]-->`);
            } else {
              _push(`<!---->`);
            }
            _push(` `);
            if (plan.duration === "3\u0645\u0627\u0647") {
              _push(`<!--[-->${ssrInterpolate(Math.round(finalMonthlyPrice(plan)).toLocaleString("fa-IR"))} \u062A\u0648\u0645\u0627\u0646
              <!--]-->`);
            } else if (plan.duration === "6\u0645\u0627\u0647") {
              _push(`<!--[-->${ssrInterpolate(Math.round(finalMonthlyPrice(plan)).toLocaleString("fa-IR"))} \u062A\u0648\u0645\u0627\u0646
              <!--]-->`);
            } else if (plan.duration === "\u0633\u0627\u0644") {
              _push(`<!--[-->${ssrInterpolate(Math.round(finalMonthlyPrice(plan)).toLocaleString("fa-IR"))} \u062A\u0648\u0645\u0627\u0646
              <!--]-->`);
            } else {
              _push(`<!---->`);
            }
            _push(`</p>`);
          } else {
            _push(`<!---->`);
          }
          _push(`</div> `);
          _push(ssrRenderComponent(_component_NuxtLink, {
            to: {
              name: "dashboard-checkout",
              query: {
                id: plan.id,
                discountCode: discountCode.value.trim(),
                discountValue: discountValue.value,
                discountType: discountType.value.trim()
              }
            },
            class: "block w-full"
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(`<button class="w-full py-2 mt-3 bg-white text-black font-bold rounded hover:bg-yellow-100 transition" data-v-616c83d7${_scopeId}>
              \u0633\u0641\u0627\u0631\u0634
            </button>`);
              } else {
                return [
                  createVNode("button", { class: "w-full py-2 mt-3 bg-white text-black font-bold rounded hover:bg-yellow-100 transition" }, "\r\n              \u0633\u0641\u0627\u0631\u0634\r\n            ")
                ];
              }
            }),
            _: 2
          }, _parent));
          _push(`</div>`);
        });
        _push(`<!--]-->`);
      }
      _push(`</div> <div class="bg-white border rounded-lg shadow" data-v-616c83d7><button class="w-full flex items-center justify-between px-4 py-3 font-bold text-gray-800 text-right" data-v-616c83d7><span data-v-616c83d7>\u06A9\u062F \u062A\u062E\u0641\u06CC\u0641 \u062E\u0631\u06CC\u062F \u0627\u0634\u062A\u0631\u0627\u06A9 \u062E\u0648\u062F \u0631\u0627 \u0648\u0627\u0631\u062F \u06A9\u0646\u06CC\u062F.</span> <i class="ti ti-percentage text-xl text-gray-500" data-v-616c83d7></i></button> <div style="${ssrRenderStyle(showDiscount.value ? null : { display: "none" })}" class="border-t p-4 flex gap-2 items-center" data-v-616c83d7><button class="bg-green-500 hover:bg-green-600 text-white font-bold px-4 py-2 rounded" data-v-616c83d7>
            \u062A\u0627\u06CC\u06CC\u062F \u06A9\u062F
          </button> <input type="text"${ssrRenderAttr("value", discountCode.value)} class="flex-1 border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-400 text-gray-700" placeholder="\u0645\u062B\u0644\u0627\u064B: OFF50" data-v-616c83d7></div></div> <div class="space-y-3" data-v-616c83d7><h3 class="text-lg font-semibold text-gray-800 text-right" data-v-616c83d7>\u0648\u06CC\u0698\u06AF\u06CC\u200C\u0647\u0627\u06CC \u0627\u0634\u062A\u0631\u0627\u06A9</h3> `);
      if (loading.value) {
        _push(`<div class="space-y-2" data-v-616c83d7><!--[-->`);
        ssrRenderList(4, (i) => {
          _push(`<div class="h-10 bg-gray-200 rounded animate-pulse" data-v-616c83d7></div>`);
        });
        _push(`<!--]--></div>`);
      } else {
        _push(`<div class="bg-white rounded-xl border overflow-hidden divide-y divide-gray-200" data-v-616c83d7><!--[-->`);
        ssrRenderList(unref(features), (item) => {
          _push(ssrRenderComponent(_component_NuxtLink, {
            key: item.slug,
            to: { path: "/dashboard/upgrade/feature", query: { slug: item.slug } },
            class: "flex items-center justify-between px-4 py-3 hover:bg-gray-50 transition no-underline"
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(`<div class="flex items-center gap-3 text-gray-800" data-v-616c83d7${_scopeId}><i class="${ssrRenderClass(`ti ${item.icon} text-lg text-gray-600`)}" data-v-616c83d7${_scopeId}></i> <span class="text-sm font-medium" data-v-616c83d7${_scopeId}>${ssrInterpolate(item.title)}</span></div> <i class="ti ti-chevron-left text-gray-400 text-base" data-v-616c83d7${_scopeId}></i>`);
              } else {
                return [
                  createVNode("div", { class: "flex items-center gap-3 text-gray-800" }, [
                    createVNode("i", {
                      class: `ti ${item.icon} text-lg text-gray-600`
                    }, null, 2),
                    createTextVNode(),
                    createVNode("span", { class: "text-sm font-medium" }, toDisplayString(item.title), 1)
                  ]),
                  createTextVNode(),
                  createVNode("i", { class: "ti ti-chevron-left text-gray-400 text-base" })
                ];
              }
            }),
            _: 2
          }, _parent));
        });
        _push(`<!--]--></div>`);
      }
      _push(`</div> <div class="fixed bottom-4 left-4 z-50" data-v-616c83d7><button class="bg-black hover:bg-gray-800 text-white rounded-full shadow-lg px-4 py-2 flex items-center gap-2" data-v-616c83d7><i class="ti ti-headset" data-v-616c83d7></i>
        \u067E\u0634\u062A\u06CC\u0628\u0627\u0646\u06CC
      </button></div> `);
      if (supportPopup.value) {
        _push(`<div class="fixed bottom-24 left-4 z-50 w-80 bg-white border border-gray-300 rounded-xl shadow-lg p-4 space-y-4" data-v-616c83d7><div class="flex justify-between items-center" data-v-616c83d7><h3 class="font-bold text-gray-800" data-v-616c83d7>\u067E\u0634\u062A\u06CC\u0628\u0627\u0646\u06CC</h3> <button data-v-616c83d7><i class="ti ti-x text-gray-500 hover:text-red-500" data-v-616c83d7></i></button></div> <div class="space-y-3 text-sm text-gray-700" data-v-616c83d7><div class="flex items-center gap-2" data-v-616c83d7><i class="ti ti-mail text-gray-500" data-v-616c83d7></i> <span data-v-616c83d7><strong data-v-616c83d7>\u0627\u06CC\u0645\u06CC\u0644:</strong> ${ssrInterpolate(unref(supportStore).support.email)}</span></div> <div class="flex items-center gap-2" data-v-616c83d7><i class="ti ti-phone text-gray-500" data-v-616c83d7></i> <span data-v-616c83d7><strong data-v-616c83d7>\u062A\u0644\u0641\u0646:</strong> ${ssrInterpolate(unref(supportStore).support.phone)}</span></div> <div class="flex items-center gap-2" data-v-616c83d7><i class="ti ti-send text-gray-500" data-v-616c83d7></i> <span data-v-616c83d7><strong data-v-616c83d7>\u062A\u0644\u06AF\u0631\u0627\u0645:</strong> ${ssrInterpolate(unref(supportStore).support.socialMediaLink)}</span></div> <div class="flex items-center gap-2" data-v-616c83d7><i class="ti ti-help text-gray-500" data-v-616c83d7></i> `);
        _push(ssrRenderComponent(_component_NuxtLink, {
          to: "/dashboard/support/faq",
          class: "text-yellow-600 hover:underline transition-colors"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`
              \u067E\u0631\u0633\u0634\u200C\u0647\u0627\u06CC \u0645\u062A\u062F\u0627\u0648\u0644
            `);
            } else {
              return [
                createTextVNode("\r\n              \u067E\u0631\u0633\u0634\u200C\u0647\u0627\u06CC \u0645\u062A\u062F\u0627\u0648\u0644\r\n            ")
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`</div></div></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div>`);
    };
  }
};
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/UserDashboard/main/upgrade/index.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const upgrade = /* @__PURE__ */ _export_sfc(_sfc_main$1, [["__scopeId", "data-v-616c83d7"]]);
const _sfc_main = {
  __name: "index",
  __ssrInlineRender: true,
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(_attrs)}>`);
      _push(ssrRenderComponent(upgrade, null, null, _parent));
      _push(`</div>`);
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/dashboard/upgrade/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=index-xYBfIxR7.mjs.map
