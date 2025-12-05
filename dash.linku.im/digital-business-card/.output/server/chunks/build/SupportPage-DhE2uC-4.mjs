import { defineComponent, ref, mergeProps, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderList, ssrRenderClass, ssrInterpolate, ssrRenderStyle } from 'vue/server-renderer';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "SupportPage",
  __ssrInlineRender: true,
  setup(__props) {
    const isLoading = ref(true);
    const openFaq = ref(null);
    const faqs = [
      {
        title: "\u0686\u06AF\u0648\u0646\u0647 \u0627\u06A9\u0627\u0646\u062A \u062E\u0648\u062F \u0631\u0627 \u0627\u06CC\u062C\u0627\u062F \u06A9\u0646\u0645\u061F",
        content: "\u0628\u0631\u0627\u06CC \u0627\u06CC\u062C\u0627\u062F \u0627\u06A9\u0627\u0646\u062A\u060C \u0631\u0648\u06CC \u062F\u06A9\u0645\u0647 '\u062B\u0628\u062A \u0646\u0627\u0645' \u06A9\u0644\u06CC\u06A9 \u06A9\u0646\u06CC\u062F \u0648 \u0634\u0645\u0627\u0631\u0647 \u0645\u0648\u0628\u0627\u06CC\u0644 \u062E\u0648\u062F \u0631\u0627 \u0648\u0627\u0631\u062F \u06A9\u0646\u06CC\u062F. \u06A9\u062F \u062A\u0627\u06CC\u06CC\u062F \u0628\u0647 \u0634\u0645\u0627 \u0627\u0631\u0633\u0627\u0644 \u062E\u0648\u0627\u0647\u062F \u0634\u062F.",
        icon: "ti ti-user-plus"
      },
      {
        title: "\u0686\u06AF\u0648\u0646\u0647 \u0631\u0645\u0632 \u0639\u0628\u0648\u0631 \u062E\u0648\u062F \u0631\u0627 \u062A\u063A\u06CC\u06CC\u0631 \u062F\u0647\u0645\u061F",
        content: "\u0628\u0647 \u0642\u0633\u0645\u062A \u062A\u0646\u0638\u06CC\u0645\u0627\u062A \u0628\u0631\u0648\u06CC\u062F \u0648 \u0631\u0648\u06CC '\u062A\u063A\u06CC\u06CC\u0631 \u0631\u0645\u0632 \u0639\u0628\u0648\u0631' \u06A9\u0644\u06CC\u06A9 \u06A9\u0646\u06CC\u062F. \u0631\u0645\u0632 \u062C\u062F\u06CC\u062F \u0631\u0627 \u0648\u0627\u0631\u062F \u06A9\u0631\u062F\u0647 \u0648 \u062A\u0627\u06CC\u06CC\u062F \u06A9\u0646\u06CC\u062F.",
        icon: "ti ti-key"
      },
      {
        title: "\u067E\u0631\u0645\u06CC\u0648\u0645 \u0686\u0647 \u0648\u06CC\u0698\u06AF\u06CC\u200C\u0647\u0627\u06CC\u06CC \u062F\u0627\u0631\u062F\u061F",
        content: "\u0628\u0627 \u067E\u0631\u0645\u06CC\u0648\u0645 \u0645\u06CC\u200C\u062A\u0648\u0627\u0646\u06CC\u062F \u0627\u0632 \u0642\u0627\u0628\u0644\u06CC\u062A\u200C\u0647\u0627\u06CC \u067E\u06CC\u0634\u0631\u0641\u062A\u0647\u060C \u0641\u0636\u0627\u06CC \u0630\u062E\u06CC\u0631\u0647 \u0628\u06CC\u0634\u062A\u0631 \u0648 \u067E\u0634\u062A\u06CC\u0628\u0627\u0646\u06CC \u0627\u0648\u0644\u0648\u06CC\u062A\u200C\u062F\u0627\u0631 \u0627\u0633\u062A\u0641\u0627\u062F\u0647 \u06A9\u0646\u06CC\u062F.",
        icon: "ti ti-crown"
      },
      {
        title: "\u0686\u06AF\u0648\u0646\u0647 \u0627\u0637\u0644\u0627\u0639\u0627\u062A \u062E\u0648\u062F \u0631\u0627 \u062D\u0630\u0641 \u06A9\u0646\u0645\u061F",
        content: "\u0628\u0631\u0627\u06CC \u062D\u0630\u0641 \u0627\u06A9\u0627\u0646\u062A\u060C \u0628\u0647 \u062A\u0646\u0638\u06CC\u0645\u0627\u062A \u0631\u0641\u062A\u0647 \u0648 \u0631\u0648\u06CC '\u062D\u0630\u0641 \u0627\u06A9\u0627\u0646\u062A' \u06A9\u0644\u06CC\u06A9 \u06A9\u0646\u06CC\u062F. \u0627\u06CC\u0646 \u0639\u0645\u0644 \u0642\u0627\u0628\u0644 \u0628\u0631\u06AF\u0634\u062A \u0646\u06CC\u0633\u062A.",
        icon: "ti ti-trash"
      },
      {
        title: "\u067E\u0634\u062A\u06CC\u0628\u0627\u0646\u06CC \u0641\u0646\u06CC \u0686\u06AF\u0648\u0646\u0647 \u06A9\u0627\u0631 \u0645\u06CC\u200C\u06A9\u0646\u062F\u061F",
        content: "\u062A\u06CC\u0645 \u067E\u0634\u062A\u06CC\u0628\u0627\u0646\u06CC \u0645\u0627 \u06F2\u06F4/\u06F7 \u0622\u0645\u0627\u062F\u0647 \u067E\u0627\u0633\u062E\u06AF\u0648\u06CC\u06CC \u0628\u0647 \u0633\u0648\u0627\u0644\u0627\u062A \u0634\u0645\u0627 \u0647\u0633\u062A\u0646\u062F. \u0627\u0632 \u0637\u0631\u06CC\u0642 \u062A\u0644\u06AF\u0631\u0627\u0645 \u06CC\u0627 \u0627\u06CC\u0645\u06CC\u0644 \u0628\u0627 \u0645\u0627 \u062A\u0645\u0627\u0633 \u0628\u06AF\u06CC\u0631\u06CC\u062F.",
        icon: "ti ti-headphones"
      }
    ];
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "min-h-screen bg-background" }, _attrs))}><div class="fixed top-0 left-0 right-0 z-50 bg-card border-b border-border"><div class="flex items-center justify-between px-4 h-16"><button class="p-2 hover:bg-secondary rounded-lg transition-colors"><i class="ti ti-arrow-right text-primary text-xl"></i></button> <h1 class="text-lg font-bold text-foreground">\u067E\u0634\u062A\u06CC\u0628\u0627\u0646\u06CC</h1> <div class="w-10"></div></div></div> <div class="pt-20 pb-4 px-4"><div class="space-y-6">`);
      if (isLoading.value) {
        _push(`<div class="space-y-6 animate-pulse"><div class="bg-card rounded-xl p-6 shadow-sm border border-border"><div class="h-6 w-32 bg-muted rounded mb-4"></div> <div class="space-y-3"><!--[-->`);
        ssrRenderList(5, (n) => {
          _push(`<div class="border border-border rounded-lg p-4"><div class="flex items-center gap-3"><div class="w-5 h-5 bg-muted rounded"></div> <div class="h-4 flex-1 bg-muted rounded"></div> <div class="w-4 h-4 bg-muted rounded"></div></div></div>`);
        });
        _push(`<!--]--></div></div> <div class="bg-card rounded-xl p-6 shadow-sm border border-border"><div class="h-6 w-24 bg-muted rounded mb-4"></div> <div class="space-y-3"><!--[-->`);
        ssrRenderList(3, (n) => {
          _push(`<div class="flex items-center gap-3 p-3 rounded-lg border border-border"><div class="w-10 h-10 bg-muted rounded-full"></div> <div class="flex-1 space-y-1"><div class="h-4 w-20 bg-muted rounded"></div> <div class="h-3 w-32 bg-muted-foreground/20 rounded"></div></div></div>`);
        });
        _push(`<!--]--></div></div></div>`);
      } else {
        _push(`<div class="bg-card rounded-xl p-6 shadow-sm border border-border"><h3 class="text-lg font-semibold text-foreground mb-4">\u0633\u0648\u0627\u0644\u0627\u062A \u0645\u062A\u062F\u0627\u0648\u0644</h3> <div class="space-y-3"><!--[-->`);
        ssrRenderList(faqs, (faq, index) => {
          _push(`<div class="border border-border rounded-lg overflow-hidden"><button class="w-full flex items-center justify-between p-4 text-right hover:bg-secondary/50 transition-colors"><div class="flex items-center gap-3"><i class="${ssrRenderClass([faq.icon, "text-primary"])}"></i> <span class="font-medium text-foreground">${ssrInterpolate(faq.title)}</span></div> <i class="${ssrRenderClass([openFaq.value === index ? "ti ti-chevron-up" : "ti ti-chevron-down", "text-muted-foreground transition-transform"])}"></i></button> <div style="${ssrRenderStyle(openFaq.value === index ? null : { display: "none" })}" class="px-4 pb-4 text-sm text-muted-foreground border-t border-border bg-muted/20">${ssrInterpolate(faq.content)}</div></div>`);
        });
        _push(`<!--]--></div></div>`);
      }
      _push(` <div class="bg-card rounded-xl p-6 shadow-sm border border-border"><h4 class="text-lg font-semibold text-foreground mb-4">\u0627\u0637\u0644\u0627\u0639\u0627\u062A \u062A\u0645\u0627\u0633</h4> <div class="space-y-3"><div class="flex items-center gap-3"><i class="ti ti-mail text-primary"></i> <div><div class="text-foreground font-medium">\u0627\u06CC\u0645\u06CC\u0644 \u067E\u0634\u062A\u06CC\u0628\u0627\u0646\u06CC</div> <div class="text-muted-foreground text-sm">support@linku.im</div></div></div> <div class="flex items-center gap-3"><i class="ti ti-brand-telegram text-primary"></i> <div><div class="text-foreground font-medium">\u06A9\u0627\u0646\u0627\u0644 \u062A\u0644\u06AF\u0631\u0627\u0645</div> <div class="text-muted-foreground text-sm">@linkusupport</div></div></div> <div class="flex items-center gap-3"><i class="ti ti-clock text-primary"></i> <div><div class="text-foreground font-medium">\u067E\u0627\u0633\u062E\u200C\u062F\u0647\u06CC</div> <div class="text-muted-foreground text-sm">\u06A9\u0645\u062A\u0631 \u0627\u0632 \u06F2\u06F4 \u0633\u0627\u0639\u062A</div></div></div></div></div></div></div></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/dashboard/support/SupportPage.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=SupportPage-DhE2uC-4.mjs.map
