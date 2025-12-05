import { defineComponent, ref, mergeProps, useSSRContext } from 'vue';
import { ssrRenderAttrs } from 'vue/server-renderer';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "online",
  __ssrInlineRender: true,
  setup(__props) {
    const isLoading = ref(true);
    const crispCode = ref("");
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "min-h-screen bg-background" }, _attrs))}><div class="fixed top-0 left-0 right-0 z-50 bg-card border-b border-border"><div class="flex items-center justify-between px-4 h-16"><button class="p-2 hover:bg-secondary rounded-lg transition-colors"><i class="ti ti-arrow-right text-primary text-xl"></i></button> <h1 class="text-lg font-bold text-foreground">\u067E\u0634\u062A\u06CC\u0628\u0627\u0646\u06CC \u0622\u0646\u0644\u0627\u06CC\u0646</h1> <div class="w-10"></div></div></div> <div class="pt-20 pb-6 px-4">`);
      if (isLoading.value) {
        _push(`<div class="flex items-center justify-center py-20"><div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div></div>`);
      } else if (!crispCode.value) {
        _push(`<div class="text-center py-20"><div class="w-20 h-20 rounded-full bg-muted flex items-center justify-center mx-auto mb-4"><i class="ti ti-message-circle-off text-muted-foreground text-3xl"></i></div> <p class="text-muted-foreground">\u0686\u062A \u0622\u0646\u0644\u0627\u06CC\u0646 \u062F\u0631 \u062D\u0627\u0644 \u062D\u0627\u0636\u0631 \u063A\u06CC\u0631\u0641\u0639\u0627\u0644 \u0627\u0633\u062A</p></div>`);
      } else {
        _push(`<div id="crisp-container"></div>`);
      }
      _push(`</div></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/dashboard/support/online.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=online-CaNUqJb7.mjs.map
