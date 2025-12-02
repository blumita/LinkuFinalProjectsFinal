import { defineComponent, ref, computed, mergeProps, withCtx, createVNode, createTextVNode, createBlock, createCommentVNode, openBlock, Fragment, renderList, toDisplayString, unref, useSSRContext } from 'vue';
import { ssrRenderComponent, ssrRenderList, ssrRenderAttr, ssrInterpolate, ssrRenderClass, ssrRenderStyle, ssrIncludeBooleanAttr, ssrRenderAttrs, ssrRenderSlot } from 'vue/server-renderer';
import { useRouter, useRoute } from 'vue-router';
import { e as __nuxt_component_0$2 } from './server.mjs';
import { _ as _export_sfc } from './_plugin-vue_export-helper-1tPrXgE0.mjs';
import { u as useToast } from './useToast-D_iChEHW.mjs';
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

const _sfc_main$1 = /* @__PURE__ */ defineComponent({
  __name: "MobileLayout",
  __ssrInlineRender: true,
  props: {
    pageTitle: {
      type: String,
      default: ""
    },
    showBackButton: {
      type: Boolean,
      default: false
    },
    showBottomNav: {
      type: Boolean,
      default: true
    }
  },
  setup(__props) {
    useRouter();
    const navItems = [
      { icon: "ti ti-home", label: "\u062E\u0627\u0646\u0647", to: "/" },
      { icon: "ti ti-user", label: "\u067E\u0631\u0648\u0641\u0627\u06CC\u0644", to: "/profile" },
      { icon: "ti ti-gift", label: "\u062C\u0648\u0627\u06CC\u0632", to: "/rewards" },
      { icon: "ti ti-settings", label: "\u062A\u0646\u0638\u06CC\u0645\u0627\u062A", to: "/settings" }
    ];
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0$2;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "min-h-screen bg-background" }, _attrs))} data-v-17b8c352>`);
      if (__props.pageTitle || __props.showBackButton) {
        _push(`<header class="fixed top-0 left-0 right-0 z-40 bg-background/95 backdrop-blur-sm border-b border-border" data-v-17b8c352><div class="flex items-center justify-between px-4 h-16" data-v-17b8c352>`);
        if (__props.showBackButton) {
          _push(`<button class="p-2 -ml-2 text-foreground hover:bg-muted rounded-lg transition-colors" data-v-17b8c352><i class="ti ti-arrow-right text-xl" data-v-17b8c352></i></button>`);
        } else {
          _push(`<div class="w-10" data-v-17b8c352></div>`);
        }
        _push(` <h1 class="text-lg font-semibold text-foreground" data-v-17b8c352>${ssrInterpolate(__props.pageTitle)}</h1> <div class="w-10" data-v-17b8c352>`);
        ssrRenderSlot(_ctx.$slots, "header-right", {}, null, _push, _parent);
        _push(`</div></div></header>`);
      } else {
        _push(`<!---->`);
      }
      _push(` <main data-v-17b8c352>`);
      ssrRenderSlot(_ctx.$slots, "default", {}, null, _push, _parent);
      _push(`</main> `);
      if (__props.showBottomNav) {
        _push(`<nav class="fixed bottom-0 left-0 right-0 z-40 bg-background/95 backdrop-blur-sm border-t border-border" data-v-17b8c352><div class="flex items-center justify-around h-16" data-v-17b8c352><!--[-->`);
        ssrRenderList(navItems, (item) => {
          _push(ssrRenderComponent(_component_NuxtLink, {
            key: item.to,
            to: item.to,
            class: "flex flex-col items-center justify-center p-2 text-muted-foreground hover:text-primary transition-colors",
            "active-class": "text-primary"
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(`<i class="${ssrRenderClass([item.icon, "text-xl"])}" data-v-17b8c352${_scopeId}></i> <span class="text-xs mt-1" data-v-17b8c352${_scopeId}>${ssrInterpolate(item.label)}</span>`);
              } else {
                return [
                  createVNode("i", {
                    class: [item.icon, "text-xl"]
                  }, null, 2),
                  createTextVNode(),
                  createVNode("span", { class: "text-xs mt-1" }, toDisplayString(item.label), 1)
                ];
              }
            }),
            _: 2
          }, _parent));
        });
        _push(`<!--]--></div></nav>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div>`);
    };
  }
});
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/Mobile/layouts/MobileLayout.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const MobileLayout = /* @__PURE__ */ _export_sfc(_sfc_main$1, [["__scopeId", "data-v-17b8c352"]]);
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "DiscountDetailPage",
  __ssrInlineRender: true,
  setup(__props) {
    const router = useRouter();
    useRoute();
    const { quickSuccess } = useToast();
    const isDataLoaded = ref(true);
    const copySuccess = ref(false);
    const discount = ref(null);
    computed(() => {
      if (!discount.value) return false;
      return new Date(discount.value.expiryDate) < /* @__PURE__ */ new Date();
    });
    const getDiscountStatusText = (status) => {
      switch (status) {
        case "active":
          return "\u0641\u0639\u0627\u0644";
        case "expired":
          return "\u0645\u0646\u0642\u0636\u06CC";
        case "used":
          return "\u0627\u0633\u062A\u0641\u0627\u062F\u0647 \u0634\u062F\u0647";
        default:
          return "\u0646\u0627\u0645\u0634\u062E\u0635";
      }
    };
    const copyDiscountCode = async () => {
      if (!discount.value) return;
      try {
        const code = discount.value.code;
        if (!(void 0).clipboard) {
          const textArea = (void 0).createElement("textarea");
          textArea.value = code;
          textArea.style.position = "fixed";
          textArea.style.left = "-999999px";
          textArea.style.top = "-999999px";
          (void 0).body.appendChild(textArea);
          textArea.focus();
          textArea.select();
          (void 0).execCommand("copy");
          (void 0).body.removeChild(textArea);
        } else {
          await (void 0).clipboard.writeText(code);
        }
        copySuccess.value = true;
        quickSuccess("\u06A9\u067E\u06CC \u0634\u062F!", `\u06A9\u062F ${code} \u062F\u0631 \u06A9\u0644\u06CC\u067E\u200C\u0628\u0648\u0631\u062F \u0634\u0645\u0627 \u06A9\u067E\u06CC \u0634\u062F`);
        setTimeout(() => {
          copySuccess.value = false;
        }, 2e3);
      } catch (error2) {
        error2("\u062E\u0637\u0627 \u062F\u0631 \u06A9\u067E\u06CC \u274C", "\u0627\u0645\u06A9\u0627\u0646 \u06A9\u067E\u06CC \u06A9\u0631\u062F\u0646 \u06A9\u062F \u062A\u062E\u0641\u06CC\u0641 \u0648\u062C\u0648\u062F \u0646\u062F\u0627\u0631\u062F");
      }
    };
    return (_ctx, _push, _parent, _attrs) => {
      _push(ssrRenderComponent(MobileLayout, mergeProps({
        "page-title": "\u062C\u0632\u0626\u06CC\u0627\u062A \u062A\u062E\u0641\u06CC\u0641",
        "show-back-button": true,
        "show-bottom-nav": false
      }, _attrs), {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="pt-[68px] pb-20" data-v-d5623327${_scopeId}>`);
            if (!isDataLoaded.value) {
              _push2(`<div class="space-y-6 animate-pulse p-6" data-v-d5623327${_scopeId}><div class="bg-muted p-6 rounded-2xl h-48" data-v-d5623327${_scopeId}></div> <div class="space-y-4" data-v-d5623327${_scopeId}><!--[-->`);
              ssrRenderList(3, (n) => {
                _push2(`<div class="bg-card border border-border p-4 rounded-xl" data-v-d5623327${_scopeId}><div class="h-4 w-full bg-muted rounded mb-2" data-v-d5623327${_scopeId}></div> <div class="h-4 w-3/4 bg-muted-foreground/20 rounded" data-v-d5623327${_scopeId}></div></div>`);
              });
              _push2(`<!--]--></div></div>`);
            } else if (discount.value) {
              _push2(`<div class="space-y-6" data-v-d5623327${_scopeId}><div class="relative mx-6 rounded-2xl overflow-hidden h-48" data-v-d5623327${_scopeId}>`);
              if (discount.value.banner || discount.value.image) {
                _push2(`<img${ssrRenderAttr("src", discount.value.banner || discount.value.image)}${ssrRenderAttr("alt", discount.value.title)} class="absolute inset-0 w-full h-full object-cover" data-v-d5623327${_scopeId}>`);
              } else {
                _push2(`<div class="absolute inset-0 bg-gradient-to-br from-primary/20 via-primary/10 to-accent/20" data-v-d5623327${_scopeId}></div>`);
              }
              _push2(`</div> <div class="px-6 text-center" data-v-d5623327${_scopeId}><h1 class="text-2xl font-bold mb-3" data-v-d5623327${_scopeId}>${ssrInterpolate(discount.value.title)}</h1> <div class="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full font-bold text-lg" data-v-d5623327${_scopeId}><i class="ti ti-discount text-xl" data-v-d5623327${_scopeId}></i> ${ssrInterpolate(discount.value.value)}${ssrInterpolate(discount.value.type === "percentage" ? "%" : " \u0631\u06CC\u0627\u0644")}</div></div> <div class="px-6" data-v-d5623327${_scopeId}><div class="bg-card border border-border rounded-xl p-4" data-v-d5623327${_scopeId}><p class="text-muted-foreground leading-relaxed text-center" data-v-d5623327${_scopeId}>${ssrInterpolate(discount.value.description)}</p></div></div> <div class="px-6" data-v-d5623327${_scopeId}><div class="flex justify-center" data-v-d5623327${_scopeId}><span class="${ssrRenderClass([
                "inline-block text-sm px-4 py-2 rounded-full font-medium",
                discount.value.status === "active" ? "bg-success/10 text-success" : discount.value.status === "expired" ? "bg-warning/10 text-warning" : "bg-muted text-muted-foreground"
              ])}" data-v-d5623327${_scopeId}>${ssrInterpolate(getDiscountStatusText(discount.value.status))}</span></div></div></div>`);
            } else {
              _push2(`<div class="text-center py-12 px-6" data-v-d5623327${_scopeId}><i class="ti ti-discount-off text-muted-foreground text-6xl mb-4" data-v-d5623327${_scopeId}></i> <h3 class="text-lg font-bold text-foreground mb-2" data-v-d5623327${_scopeId}>\u062A\u062E\u0641\u06CC\u0641 \u06CC\u0627\u0641\u062A \u0646\u0634\u062F</h3> <p class="text-muted-foreground mb-6" data-v-d5623327${_scopeId}>\u062A\u062E\u0641\u06CC\u0641 \u0645\u0648\u0631\u062F \u0646\u0638\u0631 \u0634\u0645\u0627 \u06CC\u0627\u0641\u062A \u0646\u0634\u062F \u06CC\u0627 \u062D\u0630\u0641 \u0634\u062F\u0647 \u0627\u0633\u062A</p> <button class="bg-primary text-white px-6 py-2 rounded-xl" data-v-d5623327${_scopeId}>
          \u0628\u0627\u0632\u06AF\u0634\u062A
        </button></div>`);
            }
            _push2(`</div> `);
            if (discount.value && discount.value.status === "active") {
              _push2(`<div class="fixed bottom-0 left-0 right-0 bg-card/98 backdrop-blur-md border-t border-border p-4 z-50 shadow-2xl" data-v-d5623327${_scopeId}><button${ssrIncludeBooleanAttr(copySuccess.value) ? " disabled" : ""} class="${ssrRenderClass([
                "w-full py-4 px-6 rounded-2xl font-bold transition-all flex items-center justify-center gap-3 text-lg shadow-lg",
                copySuccess.value ? "bg-success/90 text-white scale-95 ring-2 ring-success/50" : "bg-gradient-to-r from-primary to-primary/90 text-white hover:shadow-xl hover:scale-[1.02] active:scale-95"
              ])}" data-v-d5623327${_scopeId}><i class="${ssrRenderClass([copySuccess.value ? "ti ti-check" : "ti ti-copy", "text-2xl transition-all duration-300"])}" style="${ssrRenderStyle({ transform: copySuccess.value ? "scale(1.3) rotate(360deg)" : "scale(1)" })}" data-v-d5623327${_scopeId}></i> <span class="text-lg font-black tracking-wide" data-v-d5623327${_scopeId}>${ssrInterpolate(copySuccess.value ? "\u06A9\u067E\u06CC \u0634\u062F!" : `\u06A9\u067E\u06CC \u06A9\u062F: ${discount.value.code}`)}</span></button></div>`);
            } else {
              _push2(`<!---->`);
            }
          } else {
            return [
              createVNode("div", { class: "pt-[68px] pb-20" }, [
                !isDataLoaded.value ? (openBlock(), createBlock("div", {
                  key: 0,
                  class: "space-y-6 animate-pulse p-6"
                }, [
                  createVNode("div", { class: "bg-muted p-6 rounded-2xl h-48" }),
                  createTextVNode(),
                  createVNode("div", { class: "space-y-4" }, [
                    (openBlock(), createBlock(Fragment, null, renderList(3, (n) => {
                      return createVNode("div", {
                        key: n,
                        class: "bg-card border border-border p-4 rounded-xl"
                      }, [
                        createVNode("div", { class: "h-4 w-full bg-muted rounded mb-2" }),
                        createTextVNode(),
                        createVNode("div", { class: "h-4 w-3/4 bg-muted-foreground/20 rounded" })
                      ]);
                    }), 64))
                  ])
                ])) : discount.value ? (openBlock(), createBlock("div", {
                  key: 1,
                  class: "space-y-6"
                }, [
                  createVNode("div", { class: "relative mx-6 rounded-2xl overflow-hidden h-48" }, [
                    discount.value.banner || discount.value.image ? (openBlock(), createBlock("img", {
                      key: 0,
                      src: discount.value.banner || discount.value.image,
                      alt: discount.value.title,
                      class: "absolute inset-0 w-full h-full object-cover"
                    }, null, 8, ["src", "alt"])) : (openBlock(), createBlock("div", {
                      key: 1,
                      class: "absolute inset-0 bg-gradient-to-br from-primary/20 via-primary/10 to-accent/20"
                    }))
                  ]),
                  createTextVNode(),
                  createVNode("div", { class: "px-6 text-center" }, [
                    createVNode("h1", { class: "text-2xl font-bold mb-3" }, toDisplayString(discount.value.title), 1),
                    createTextVNode(),
                    createVNode("div", { class: "inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full font-bold text-lg" }, [
                      createVNode("i", { class: "ti ti-discount text-xl" }),
                      createTextVNode(" " + toDisplayString(discount.value.value) + toDisplayString(discount.value.type === "percentage" ? "%" : " \u0631\u06CC\u0627\u0644"), 1)
                    ])
                  ]),
                  createTextVNode(),
                  createVNode("div", { class: "px-6" }, [
                    createVNode("div", { class: "bg-card border border-border rounded-xl p-4" }, [
                      createVNode("p", { class: "text-muted-foreground leading-relaxed text-center" }, toDisplayString(discount.value.description), 1)
                    ])
                  ]),
                  createTextVNode(),
                  createVNode("div", { class: "px-6" }, [
                    createVNode("div", { class: "flex justify-center" }, [
                      createVNode("span", {
                        class: [
                          "inline-block text-sm px-4 py-2 rounded-full font-medium",
                          discount.value.status === "active" ? "bg-success/10 text-success" : discount.value.status === "expired" ? "bg-warning/10 text-warning" : "bg-muted text-muted-foreground"
                        ]
                      }, toDisplayString(getDiscountStatusText(discount.value.status)), 3)
                    ])
                  ])
                ])) : (openBlock(), createBlock("div", {
                  key: 2,
                  class: "text-center py-12 px-6"
                }, [
                  createVNode("i", { class: "ti ti-discount-off text-muted-foreground text-6xl mb-4" }),
                  createTextVNode(),
                  createVNode("h3", { class: "text-lg font-bold text-foreground mb-2" }, "\u062A\u062E\u0641\u06CC\u0641 \u06CC\u0627\u0641\u062A \u0646\u0634\u062F"),
                  createTextVNode(),
                  createVNode("p", { class: "text-muted-foreground mb-6" }, "\u062A\u062E\u0641\u06CC\u0641 \u0645\u0648\u0631\u062F \u0646\u0638\u0631 \u0634\u0645\u0627 \u06CC\u0627\u0641\u062A \u0646\u0634\u062F \u06CC\u0627 \u062D\u0630\u0641 \u0634\u062F\u0647 \u0627\u0633\u062A"),
                  createTextVNode(),
                  createVNode("button", {
                    onClick: ($event) => unref(router).back(),
                    class: "bg-primary text-white px-6 py-2 rounded-xl"
                  }, "\r\n          \u0628\u0627\u0632\u06AF\u0634\u062A\r\n        ", 8, ["onClick"])
                ]))
              ]),
              createTextVNode(),
              discount.value && discount.value.status === "active" ? (openBlock(), createBlock("div", {
                key: 0,
                class: "fixed bottom-0 left-0 right-0 bg-card/98 backdrop-blur-md border-t border-border p-4 z-50 shadow-2xl"
              }, [
                createVNode("button", {
                  onClick: copyDiscountCode,
                  disabled: copySuccess.value,
                  class: [
                    "w-full py-4 px-6 rounded-2xl font-bold transition-all flex items-center justify-center gap-3 text-lg shadow-lg",
                    copySuccess.value ? "bg-success/90 text-white scale-95 ring-2 ring-success/50" : "bg-gradient-to-r from-primary to-primary/90 text-white hover:shadow-xl hover:scale-[1.02] active:scale-95"
                  ]
                }, [
                  createVNode("i", {
                    class: [copySuccess.value ? "ti ti-check" : "ti ti-copy", "text-2xl transition-all duration-300"],
                    style: { transform: copySuccess.value ? "scale(1.3) rotate(360deg)" : "scale(1)" }
                  }, null, 6),
                  createTextVNode(),
                  createVNode("span", { class: "text-lg font-black tracking-wide" }, toDisplayString(copySuccess.value ? "\u06A9\u067E\u06CC \u0634\u062F!" : `\u06A9\u067E\u06CC \u06A9\u062F: ${discount.value.code}`), 1)
                ], 10, ["disabled"])
              ])) : createCommentVNode("", true)
            ];
          }
        }),
        _: 1
      }, _parent));
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/rewards/DiscountDetailPage.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const DiscountDetailPage = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-d5623327"]]);

export { DiscountDetailPage as default };
//# sourceMappingURL=DiscountDetailPage-DxOsogWp.mjs.map
