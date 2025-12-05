import { defineComponent, ref, computed, mergeProps, unref, withCtx, createVNode, createTextVNode, createBlock, createCommentVNode, openBlock, toDisplayString, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderList, ssrRenderStyle, ssrInterpolate, ssrRenderClass } from 'vue/server-renderer';
import { M as MobilePageHeader } from './MobilePageHeader-B_M2K2Mb.mjs';
import { e as __nuxt_component_0$2 } from './server.mjs';
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
import 'vue-router';
import 'axios';

const _sfc_main$1 = /* @__PURE__ */ defineComponent({
  __name: "ChecklistCard",
  __ssrInlineRender: true,
  props: {
    icon: {},
    title: {},
    description: {},
    action: {},
    status: {},
    to: {}
  },
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0$2;
      _push(ssrRenderComponent(_component_NuxtLink, mergeProps({
        to: _ctx.to,
        class: "block bg-card border border-border rounded-2xl relative min-h-[280px] overflow-hidden transition-all hover:shadow-lg hover:border-primary/30"
      }, _attrs), {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="w-full h-32 mb-6 relative flex items-center justify-center bg-muted/10" data-v-9eee413c${_scopeId}><div class="${ssrRenderClass([_ctx.status === "done" ? "bg-success/20" : "bg-primary/20", "w-16 h-16 rounded-full flex items-center justify-center"])}" data-v-9eee413c${_scopeId}><i class="${ssrRenderClass([_ctx.icon, "text-2xl", _ctx.status === "done" ? "text-success" : "text-primary"])}" data-v-9eee413c${_scopeId}></i></div> `);
            if (_ctx.status === "done") {
              _push2(`<div class="absolute top-4 right-4 w-8 h-8 bg-success rounded-full flex items-center justify-center" data-v-9eee413c${_scopeId}><i class="ti ti-check text-white text-sm" data-v-9eee413c${_scopeId}></i></div>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</div> <div class="space-y-3 mb-12 px-6 text-center" data-v-9eee413c${_scopeId}><h3 class="font-semibold text-foreground" data-v-9eee413c${_scopeId}>${ssrInterpolate(_ctx.title)}</h3> <p class="text-sm text-muted-foreground leading-relaxed" data-v-9eee413c${_scopeId}>${ssrInterpolate(_ctx.description)}</p></div> <div class="absolute bottom-0 left-0 right-0 flex items-center justify-between px-6 py-4 border-t border-border/30" data-v-9eee413c${_scopeId}><div class="flex items-center gap-2" data-v-9eee413c${_scopeId}><span class="${ssrRenderClass([_ctx.status === "done" ? "text-success" : "text-primary", "text-sm font-medium"])}" data-v-9eee413c${_scopeId}>${ssrInterpolate(_ctx.status === "done" ? "\u0627\u0646\u062C\u0627\u0645 \u0634\u062F\u0647" : _ctx.action)}</span> <i class="${ssrRenderClass([_ctx.status === "done" ? "ti ti-check" : "ti ti-chevron-left", "text-sm"])}" data-v-9eee413c${_scopeId}></i></div> <div class="${ssrRenderClass([_ctx.status === "done" ? "bg-success/20" : "bg-primary/20", "w-6 h-6 rounded-full flex items-center justify-center"])}" data-v-9eee413c${_scopeId}><i class="${ssrRenderClass([_ctx.status === "done" ? "ti ti-check text-success" : "ti ti-arrow-left text-primary", "text-xs"])}" data-v-9eee413c${_scopeId}></i></div></div>`);
          } else {
            return [
              createVNode("div", { class: "w-full h-32 mb-6 relative flex items-center justify-center bg-muted/10" }, [
                createVNode("div", {
                  class: ["w-16 h-16 rounded-full flex items-center justify-center", _ctx.status === "done" ? "bg-success/20" : "bg-primary/20"]
                }, [
                  createVNode("i", {
                    class: [_ctx.icon, "text-2xl", _ctx.status === "done" ? "text-success" : "text-primary"]
                  }, null, 2)
                ], 2),
                createTextVNode(),
                _ctx.status === "done" ? (openBlock(), createBlock("div", {
                  key: 0,
                  class: "absolute top-4 right-4 w-8 h-8 bg-success rounded-full flex items-center justify-center"
                }, [
                  createVNode("i", { class: "ti ti-check text-white text-sm" })
                ])) : createCommentVNode("", true)
              ]),
              createTextVNode(),
              createVNode("div", { class: "space-y-3 mb-12 px-6 text-center" }, [
                createVNode("h3", { class: "font-semibold text-foreground" }, toDisplayString(_ctx.title), 1),
                createTextVNode(),
                createVNode("p", { class: "text-sm text-muted-foreground leading-relaxed" }, toDisplayString(_ctx.description), 1)
              ]),
              createTextVNode(),
              createVNode("div", { class: "absolute bottom-0 left-0 right-0 flex items-center justify-between px-6 py-4 border-t border-border/30" }, [
                createVNode("div", { class: "flex items-center gap-2" }, [
                  createVNode("span", {
                    class: ["text-sm font-medium", _ctx.status === "done" ? "text-success" : "text-primary"]
                  }, toDisplayString(_ctx.status === "done" ? "\u0627\u0646\u062C\u0627\u0645 \u0634\u062F\u0647" : _ctx.action), 3),
                  createTextVNode(),
                  createVNode("i", {
                    class: [_ctx.status === "done" ? "ti ti-check" : "ti ti-chevron-left", "text-sm"]
                  }, null, 2)
                ]),
                createTextVNode(),
                createVNode("div", {
                  class: ["w-6 h-6 rounded-full flex items-center justify-center", _ctx.status === "done" ? "bg-success/20" : "bg-primary/20"]
                }, [
                  createVNode("i", {
                    class: [_ctx.status === "done" ? "ti ti-check text-success" : "ti ti-arrow-left text-primary", "text-xs"]
                  }, null, 2)
                ], 2)
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
    };
  }
});
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/shared/ChecklistCard.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const ChecklistCard = /* @__PURE__ */ _export_sfc(_sfc_main$1, [["__scopeId", "data-v-9eee413c"]]);
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "AccountStatusPage",
  __ssrInlineRender: true,
  setup(__props) {
    const isLoading = ref(true);
    const steps = [
      {
        icon: "ti ti-user-plus",
        title: "\u0627\u0641\u0632\u0648\u062F\u0646 \u062A\u0635\u0648\u06CC\u0631 \u067E\u0631\u0648\u0641\u0627\u06CC\u0644",
        description: "\u06A9\u0627\u0631\u062A \u062F\u06CC\u062C\u06CC\u062A\u0627\u0644 \u062E\u0648\u062F \u0631\u0627 \u0628\u0627 \u0627\u0641\u0632\u0648\u062F\u0646 \u0639\u06A9\u0633 \u062C\u0630\u0627\u0628\u200C\u062A\u0631 \u06A9\u0646\u06CC\u062F",
        action: "\u0627\u0641\u0632\u0648\u062F\u0646 \u0639\u06A9\u0633",
        status: "done",
        to: "/profile"
      },
      {
        icon: "ti ti-link",
        title: "\u0627\u0641\u0632\u0648\u062F\u0646 \u0627\u0648\u0644\u06CC\u0646 \u0644\u06CC\u0646\u06A9",
        description: "\u0644\u06CC\u0646\u06A9\u200C\u0647\u0627 \u0631\u0627 \u0628\u0647 \u067E\u0631\u0648\u0641\u0627\u06CC\u0644 \u062E\u0648\u062F \u0627\u0636\u0627\u0641\u0647 \u06A9\u0646\u06CC\u062F \u062A\u0627 \u062F\u06CC\u06AF\u0631\u0627\u0646 \u062F\u0631 \u067E\u0644\u062A\u0641\u0631\u0645\u200C\u0647\u0627\u06CC \u0645\u062E\u062A\u0644\u0641 \u0628\u0627 \u0634\u0645\u0627 \u0627\u0631\u062A\u0628\u0627\u0637 \u0628\u0631\u0642\u0631\u0627\u0631 \u06A9\u0646\u0646\u062F",
        action: "\u0627\u0641\u0632\u0648\u062F\u0646 \u0644\u06CC\u0646\u06A9",
        status: "done",
        to: "/profile"
      },
      {
        icon: "ti ti-credit-card",
        title: "\u0627\u0646\u062C\u0627\u0645 \u06CC\u06A9 \u067E\u0627\u067E!",
        description: "\u0627\u0632 \u062F\u0633\u062A\u06AF\u0627\u0647 \u0644\u06CC\u0646\u06A9\u0648 \u06CC\u0627 QR \u06A9\u062F \u062F\u0627\u062E\u0644 \u0627\u067E \u0628\u0631\u0627\u06CC \u0627\u0634\u062A\u0631\u0627\u06A9\u200C\u06AF\u0630\u0627\u0631\u06CC \u0627\u0637\u0644\u0627\u0639\u0627\u062A \u062E\u0648\u062F \u0627\u0633\u062A\u0641\u0627\u062F\u0647 \u06A9\u0646\u06CC\u062F",
        action: "\u0631\u0641\u062A\u0646 \u0628\u0647 QR \u06A9\u062F",
        status: "done",
        to: "/profile"
      },
      {
        icon: "ti ti-crown",
        title: "\u0628\u0647 \u062D\u0631\u0641\u0647\u200C\u0627\u06CC\u200C\u0647\u0627 \u0628\u067E\u06CC\u0648\u0646\u062F\u06CC\u062F!",
        description: "\u067E\u0631\u0645\u06CC\u0648\u0645 \u0628\u06AF\u06CC\u0631\u06CC\u062F \u0648 \u0628\u0627 \u0633\u0631\u0639\u062A \u0645\u0648\u0634\u06A9 \u067E\u06CC\u0634\u0631\u0641\u062A \u06A9\u0646\u06CC\u062F",
        action: "\u0631\u0641\u062A\u0646 \u0628\u0647 \u067E\u0631\u0645\u06CC\u0648\u0645",
        status: "pending",
        to: "/premium-upgrade"
      }
    ];
    const total = steps.length;
    const completed = steps.filter((step) => step.status === "done").length;
    const progress = computed(() => Math.round(completed / total * 100));
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "min-h-screen bg-background" }, _attrs))} data-v-4c4a1222>`);
      _push(ssrRenderComponent(MobilePageHeader, {
        title: "\u0648\u0636\u0639\u06CC\u062A \u062D\u0633\u0627\u0628 \u06A9\u0627\u0631\u0628\u0631\u06CC",
        "show-back": true
      }, null, _parent));
      _push(` <div class="pb-6 px-4" data-v-4c4a1222><div class="space-y-6" data-v-4c4a1222>`);
      if (isLoading.value) {
        _push(`<div class="animate-pulse" data-v-4c4a1222><div class="text-center" data-v-4c4a1222><div class="h-4 w-3/4 bg-muted/60 rounded mx-auto mb-6" data-v-4c4a1222></div> <div class="w-full h-3 rounded-full bg-muted/40 border border-border mb-4 overflow-hidden" data-v-4c4a1222><div class="h-full w-1/3 bg-muted/80 rounded-full animate-pulse" data-v-4c4a1222></div></div> <div class="flex justify-between" data-v-4c4a1222><div class="h-3 w-20 bg-muted/50 rounded" data-v-4c4a1222></div> <div class="h-3 w-24 bg-muted/50 rounded" data-v-4c4a1222></div></div></div> <div class="max-w-md mx-auto space-y-4 mt-8" data-v-4c4a1222><!--[-->`);
        ssrRenderList(4, (n) => {
          _push(`<div class="bg-card border border-border rounded-2xl relative min-h-[280px] overflow-hidden" data-v-4c4a1222><div class="w-full h-32 mb-6 relative flex items-center justify-center bg-muted/20" data-v-4c4a1222><div class="w-16 h-16 bg-muted/60 rounded-full flex items-center justify-center" data-v-4c4a1222><div class="w-6 h-6 bg-muted/40 rounded" data-v-4c4a1222></div></div> <div class="absolute top-4 left-4 w-8 h-8 bg-muted/40 rounded-full" data-v-4c4a1222></div> <div class="absolute top-6 right-6 w-6 h-6 bg-muted/40 rounded-full" data-v-4c4a1222></div> <div class="absolute bottom-4 left-8 w-7 h-7 bg-muted/40 rounded-full" data-v-4c4a1222></div> <div class="absolute bottom-6 right-4 w-5 h-5 bg-muted/40 rounded-full" data-v-4c4a1222></div></div> <div class="space-y-3 mb-12 px-6" data-v-4c4a1222><div class="h-5 w-48 bg-muted/60 rounded mx-auto" data-v-4c4a1222></div> <div class="space-y-2" data-v-4c4a1222><div class="h-3 w-full bg-muted/40 rounded" data-v-4c4a1222></div> <div class="h-3 w-4/5 bg-muted/40 rounded mx-auto" data-v-4c4a1222></div></div></div> <div class="absolute bottom-0 left-0 right-0 flex items-center justify-between px-6 py-4 border-t border-border/30" data-v-4c4a1222><div class="flex items-center gap-2" data-v-4c4a1222><div class="h-4 w-24 bg-muted/50 rounded" data-v-4c4a1222></div> <div class="w-4 h-4 bg-muted/40 rounded" data-v-4c4a1222></div></div> <div class="flex items-center gap-2" data-v-4c4a1222><div class="h-4 w-16 bg-muted/50 rounded" data-v-4c4a1222></div> <div class="w-6 h-6 bg-muted/60 rounded-full" data-v-4c4a1222></div></div></div></div>`);
        });
        _push(`<!--]--></div> <div class="bg-primary/5 border border-primary/20 rounded-xl p-4" data-v-4c4a1222><div class="flex items-start gap-3" data-v-4c4a1222><div class="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center" data-v-4c4a1222><div class="w-4 h-4 bg-primary/40 rounded" data-v-4c4a1222></div></div> <div class="space-y-2 flex-1" data-v-4c4a1222><div class="h-4 w-20 bg-muted/50 rounded" data-v-4c4a1222></div> <div class="h-3 w-full bg-muted/40 rounded" data-v-4c4a1222></div> <div class="h-3 w-3/4 bg-muted/40 rounded" data-v-4c4a1222></div></div></div></div></div>`);
      } else {
        _push(`<div class="text-center" data-v-4c4a1222><p class="text-sm text-muted-foreground mb-6 px-4" data-v-4c4a1222>
            \u0628\u0631\u0627\u06CC \u06AF\u0631\u0641\u062A\u0646 \u0628\u06CC\u0634\u062A\u0631\u06CC\u0646 \u0646\u062A\u06CC\u062C\u0647 \u0627\u0632 \u06A9\u0627\u0631\u062A \u062F\u06CC\u062C\u06CC\u062A\u0627\u0644 \u0644\u06CC\u0646\u06A9\u0648\u060C \u0627\u06CC\u0646 \u0686\u06A9\u200C\u0644\u06CC\u0633\u062A \u0631\u0627 \u06A9\u0627\u0645\u0644 \u06A9\u0646\u06CC\u062F
          </p> <div class="w-full h-3 rounded-full border border-border overflow-hidden mb-4 bg-muted/20" data-v-4c4a1222><div class="h-full bg-gradient-to-r from-primary to-success rounded-full transition-all duration-500 ease-out" style="${ssrRenderStyle({ width: progress.value + "%" })}" data-v-4c4a1222></div></div> <div class="flex justify-between text-sm text-muted-foreground" data-v-4c4a1222><span class="font-medium" data-v-4c4a1222>${ssrInterpolate(progress.value)}\u066A \u062A\u06A9\u0645\u06CC\u0644 \u0634\u062F\u0647</span> <span data-v-4c4a1222>${ssrInterpolate(unref(completed))} / ${ssrInterpolate(unref(total))} \u0645\u0631\u062D\u0644\u0647 \u0627\u0646\u062C\u0627\u0645 \u0634\u062F\u0647</span></div></div>`);
      }
      _push(` <div class="max-w-md mx-auto space-y-4" data-v-4c4a1222><!--[-->`);
      ssrRenderList(steps, (step, index) => {
        _push(ssrRenderComponent(ChecklistCard, {
          key: index,
          icon: step.icon,
          title: step.title,
          description: step.description,
          action: step.action,
          status: step.status,
          to: step.to
        }, null, _parent));
      });
      _push(`<!--]--></div> <div class="bg-primary/5 border border-primary/20 rounded-xl p-4" data-v-4c4a1222><div class="flex items-start gap-3" data-v-4c4a1222><div class="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center mt-1" data-v-4c4a1222><i class="ti ti-info-circle text-primary" data-v-4c4a1222></i></div> <div data-v-4c4a1222><h4 class="font-semibold text-foreground mb-2" data-v-4c4a1222>\u0646\u06A9\u062A\u0647 \u0645\u0647\u0645</h4> <p class="text-sm text-muted-foreground leading-relaxed" data-v-4c4a1222>
                \u062A\u06A9\u0645\u06CC\u0644 \u0647\u0645\u0647 \u0645\u0631\u0627\u062D\u0644 \u0628\u0647 \u0634\u0645\u0627 \u06A9\u0645\u06A9 \u0645\u06CC\u200C\u06A9\u0646\u062F \u062A\u0627 \u0628\u0647\u062A\u0631\u06CC\u0646 \u062A\u062C\u0631\u0628\u0647 \u0631\u0627 \u0627\u0632 \u0644\u06CC\u0646\u06A9\u0648 \u062F\u0627\u0634\u062A\u0647 \u0628\u0627\u0634\u06CC\u062F \u0648 \u0627\u0645\u0646\u06CC\u062A \u062D\u0633\u0627\u0628 \u0634\u0645\u0627 \u0627\u0641\u0632\u0627\u06CC\u0634 \u06CC\u0627\u0628\u062F.
              </p></div></div></div></div></div></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/profile/AccountStatusPage.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const AccountStatusPage = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-4c4a1222"]]);

export { AccountStatusPage as default };
//# sourceMappingURL=AccountStatusPage-bvhi8Vbk.mjs.map
