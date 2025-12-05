import { mergeProps, useSSRContext } from 'vue';
import { ssrRenderAttrs } from 'vue/server-renderer';

const _sfc_main = {
  __name: "index",
  __ssrInlineRender: true,
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "flex items-center justify-center min-h-[60vh]" }, _attrs))}><div class="text-center space-y-6 px-6"><div class="relative inline-block"><i class="ti ti-search text-8xl text-primary opacity-20"></i></div> <div class="space-y-2"><h2 class="text-2xl font-bold text-primary">\u062C\u0633\u062A\u062C\u0648</h2> <p class="text-primary opacity-60">\u0627\u06CC\u0646 \u0628\u062E\u0634 \u0628\u0647 \u0632\u0648\u062F\u06CC \u0631\u0627\u0647\u200C\u0627\u0646\u062F\u0627\u0632\u06CC \u062E\u0648\u0627\u0647\u062F \u0634\u062F</p></div> <div class="flex items-center justify-center gap-2 text-sm text-primary opacity-40"><i class="ti ti-sparkles"></i> <span>\u062F\u0631 \u062D\u0627\u0644 \u062A\u0648\u0633\u0639\u0647...</span></div></div></div>`);
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/dashboard/search/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=index-BndrYJBQ.mjs.map
