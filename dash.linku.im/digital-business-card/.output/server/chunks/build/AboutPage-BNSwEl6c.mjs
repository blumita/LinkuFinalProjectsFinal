import { defineComponent, ref, mergeProps, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderList, ssrRenderAttr } from 'vue/server-renderer';
import { p as publicAssetsURL } from '../routes/renderer.mjs';
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

const _imports_0 = publicAssetsURL("/assets/LinkuLogo/logo.png");
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "AboutPage",
  __ssrInlineRender: true,
  setup(__props) {
    const isLoading = ref(true);
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "min-h-screen bg-background" }, _attrs))}><div class="fixed top-0 left-0 right-0 z-50 bg-card border-b border-border"><div class="flex items-center justify-between px-4 h-16"><button class="p-2 hover:bg-secondary rounded-lg transition-colors"><i class="ti ti-arrow-right text-primary text-xl"></i></button> <h1 class="text-lg font-bold text-foreground">\u062F\u0631\u0628\u0627\u0631\u0647 \u0644\u06CC\u0646\u06A9\u0648</h1> <div class="w-10"></div></div></div> <div class="pt-20 pb-4 px-4"><div class="space-y-6">`);
      if (isLoading.value) {
        _push(`<div class="space-y-6 animate-pulse"><div class="text-center"><div class="w-48 h-12 bg-muted rounded mx-auto mb-4"></div></div> <div class="bg-card rounded-xl p-6 shadow-sm border border-border"><div class="h-6 w-24 bg-muted rounded mb-4"></div> <div class="space-y-3"><div class="h-4 w-full bg-muted-foreground/20 rounded"></div> <div class="h-4 w-3/4 bg-muted-foreground/20 rounded"></div> <div class="h-4 w-5/6 bg-muted-foreground/20 rounded"></div></div></div> <div class="bg-card rounded-xl p-6 shadow-sm border border-border"><div class="h-6 w-20 bg-muted rounded mb-4"></div> <div class="space-y-3"><!--[-->`);
        ssrRenderList(2, (n) => {
          _push(`<div class="flex justify-between items-center"><div class="h-4 w-16 bg-muted-foreground/20 rounded"></div> <div class="h-4 w-24 bg-muted rounded"></div></div>`);
        });
        _push(`<!--]--></div></div> <div class="text-center"><div class="h-4 w-40 bg-muted-foreground/20 rounded mx-auto"></div></div></div>`);
      } else {
        _push(`<div class="text-center"><div class="flex items-center justify-center mx-auto mb-4"><img${ssrRenderAttr("src", _imports_0)} alt="Linku Logo" class="w-[200px] h-[44px]"></div></div>`);
      }
      _push(` <div class="bg-card rounded-xl p-6 shadow-sm border border-border"><h4 class="text-lg font-semibold text-foreground mb-4">\u062F\u0631\u0628\u0627\u0631\u0647 \u0644\u06CC\u0646\u06A9\u0648</h4> <div class="space-y-4 text-muted-foreground"><p>
              \u0644\u06CC\u0646\u06A9\u0648 \u06CC\u06A9 \u067E\u0644\u062A\u0641\u0631\u0645 \u0646\u0648\u0622\u0648\u0631\u0627\u0646\u0647 \u0628\u0631\u0627\u06CC \u0645\u062F\u06CC\u0631\u06CC\u062A \u0648 \u0628\u0647\u200C\u0627\u0634\u062A\u0631\u0627\u06A9\u200C\u06AF\u0630\u0627\u0631\u06CC \u0644\u06CC\u0646\u06A9\u200C\u0647\u0627 \u0627\u0633\u062A \u06A9\u0647 \u0628\u0647 \u0634\u0645\u0627 \u0627\u0645\u06A9\u0627\u0646 \u0627\u06CC\u062C\u0627\u062F\u060C \u0633\u0627\u0632\u0645\u0627\u0646\u062F\u0647\u06CC \u0648 \u062A\u062C\u0632\u06CC\u0647 \u0648 \u062A\u062D\u0644\u06CC\u0644 \u0644\u06CC\u0646\u06A9\u200C\u0647\u0627\u06CC \u062E\u0648\u062F \u0631\u0627 \u0645\u06CC\u200C\u062F\u0647\u062F.
            </p> <p>
              \u0628\u0627 \u0627\u0633\u062A\u0641\u0627\u062F\u0647 \u0627\u0632 \u062A\u06A9\u0646\u0648\u0644\u0648\u0698\u06CC\u200C\u0647\u0627\u06CC \u0645\u062F\u0631\u0646\u060C \u0644\u06CC\u0646\u06A9\u0648 \u062A\u062C\u0631\u0628\u0647\u200C\u0627\u06CC \u0633\u0627\u062F\u0647 \u0648 \u06A9\u0627\u0631\u0622\u0645\u062F \u0628\u0631\u0627\u06CC \u06A9\u0627\u0631\u0628\u0631\u0627\u0646 \u062E\u0648\u062F \u0641\u0631\u0627\u0647\u0645 \u0645\u06CC\u200C\u06A9\u0646\u062F.
            </p></div></div> <div class="bg-card rounded-xl p-6 shadow-sm border border-border"><h4 class="text-lg font-semibold text-foreground mb-4">\u062A\u0645\u0627\u0633 \u0628\u0627 \u0645\u0627</h4> <div class="space-y-3"><div class="flex justify-between items-center"><span class="text-muted-foreground">\u0648\u0628\u200C\u0633\u0627\u06CC\u062A</span> <a href="https://linkutag.com" class="text-primary hover:underline">linku.im</a></div> <div class="flex justify-between items-center"><span class="text-muted-foreground">\u0627\u06CC\u0645\u06CC\u0644</span> <a href="mailto:info@linkutag.com" class="text-primary hover:underline">info@linku.im</a></div></div></div> <div class="text-center text-muted-foreground text-sm"><p>\xA9 \u06F1\u06F4\u06F0\u06F3 \u0644\u06CC\u0646\u06A9\u0648 . \u062A\u0645\u0627\u0645\u06CC \u062D\u0642\u0648\u0642 \u0645\u062D\u0641\u0648\u0638 \u0627\u0633\u062A.</p></div></div></div></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/dashboard/support/AboutPage.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=AboutPage-BNSwEl6c.mjs.map
