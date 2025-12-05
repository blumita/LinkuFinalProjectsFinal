import { defineComponent, computed, mergeProps, unref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrInterpolate } from 'vue/server-renderer';
import { useRouter } from 'vue-router';
import { u as useMessageCounts } from './useMessageCounts-Dq1nkOUx.mjs';
import { _ as _export_sfc } from './_plugin-vue_export-helper-1tPrXgE0.mjs';
import './form-CUJQskNk.mjs';
import 'pinia';
import './server.mjs';
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
import 'axios';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "InboxPage",
  __ssrInlineRender: true,
  setup(__props) {
    useRouter();
    const {
      luckyDiceCount,
      luckyEggCount,
      luckyWheelCount,
      infoFormCount,
      questionBoxCount,
      pollCount
    } = useMessageCounts();
    const totalItems = computed(() => {
      return luckyDiceCount.value + luckyEggCount.value + luckyWheelCount.value + infoFormCount.value + questionBoxCount.value + (pollCount.value > 0 ? 1 : 0);
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "min-h-screen bg-background" }, _attrs))} data-v-57a1b043><div class="fixed top-0 left-0 right-0 z-40 bg-card border-b border-border" data-v-57a1b043><div class="flex items-center h-14 px-4" data-v-57a1b043><button class="flex items-center justify-center w-10 h-10 rounded-lg text-foreground hover:bg-accent transition-colors" data-v-57a1b043><i class="ti ti-arrow-right text-xl" data-v-57a1b043></i></button> <h1 class="flex-1 text-lg font-semibold text-foreground" data-v-57a1b043>\u0635\u0646\u062F\u0648\u0642 \u067E\u06CC\u0627\u0645\u200C\u0647\u0627</h1></div></div> <div class="pt-16 pb-24 px-4" data-v-57a1b043><div class="max-w-2xl mx-auto space-y-3 mt-6" data-v-57a1b043><div class="bg-card rounded-xl border border-border p-4 hover:bg-accent/5 transition-all duration-200 cursor-pointer" data-v-57a1b043><div class="flex items-center justify-between" data-v-57a1b043><div class="flex items-center gap-3" data-v-57a1b043><div class="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center" data-v-57a1b043><i class="ti ti-dice text-foreground text-lg" data-v-57a1b043></i></div> <div data-v-57a1b043><h3 class="font-medium text-foreground" data-v-57a1b043>\u062A\u0627\u0633 \u0634\u0627\u0646\u0633</h3></div></div> <div class="text-right flex items-center gap-2" data-v-57a1b043><span class="text-muted-foreground text-sm" data-v-57a1b043>${ssrInterpolate(unref(luckyDiceCount))} \u067E\u06CC\u0627\u0645</span> <i class="ti ti-chevron-left text-muted-foreground" data-v-57a1b043></i></div></div></div> <div class="bg-card rounded-xl border border-border p-4 hover:bg-accent/5 transition-all duration-200 cursor-pointer" data-v-57a1b043><div class="flex items-center justify-between" data-v-57a1b043><div class="flex items-center gap-3" data-v-57a1b043><div class="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center" data-v-57a1b043><i class="ti ti-egg text-secondary-foreground text-lg" data-v-57a1b043></i></div> <div data-v-57a1b043><h3 class="font-medium text-foreground" data-v-57a1b043>\u062A\u062E\u0645 \u0634\u0627\u0646\u0633</h3></div></div> <div class="text-right flex items-center gap-2" data-v-57a1b043><span class="text-muted-foreground text-sm" data-v-57a1b043>${ssrInterpolate(unref(luckyEggCount))} \u067E\u06CC\u0627\u0645</span> <i class="ti ti-chevron-left text-muted-foreground" data-v-57a1b043></i></div></div></div> <div class="bg-card rounded-xl border border-border p-4 hover:bg-accent/5 transition-all duration-200 cursor-pointer" data-v-57a1b043><div class="flex items-center justify-between" data-v-57a1b043><div class="flex items-center gap-3" data-v-57a1b043><div class="w-10 h-10 rounded-xl bg-accent flex items-center justify-center" data-v-57a1b043><i class="ti ti-wheel text-accent-foreground text-lg" data-v-57a1b043></i></div> <div data-v-57a1b043><h3 class="font-medium text-foreground" data-v-57a1b043>\u0686\u0631\u062E \u0634\u0627\u0646\u0633</h3></div></div> <div class="text-right flex items-center gap-2" data-v-57a1b043><span class="text-muted-foreground text-sm" data-v-57a1b043>${ssrInterpolate(unref(luckyWheelCount))} \u067E\u06CC\u0627\u0645</span> <i class="ti ti-chevron-left text-muted-foreground" data-v-57a1b043></i></div></div></div> <div class="bg-card rounded-xl border border-border p-4 hover:bg-accent/5 transition-all duration-200 cursor-pointer" data-v-57a1b043><div class="flex items-center justify-between" data-v-57a1b043><div class="flex items-center gap-3" data-v-57a1b043><div class="w-10 h-10 rounded-xl bg-muted flex items-center justify-center" data-v-57a1b043><i class="ti ti-forms text-muted-foreground text-lg" data-v-57a1b043></i></div> <div data-v-57a1b043><h3 class="font-medium text-foreground" data-v-57a1b043>\u0641\u0631\u0645 \u0627\u0637\u0644\u0627\u0639\u0627\u062A</h3></div></div> <div class="text-right flex items-center gap-2" data-v-57a1b043><span class="text-muted-foreground text-sm" data-v-57a1b043>${ssrInterpolate(unref(infoFormCount))} \u067E\u06CC\u0627\u0645</span> <i class="ti ti-chevron-left text-muted-foreground" data-v-57a1b043></i></div></div></div> <div class="bg-card rounded-xl border border-border p-4 hover:bg-accent/5 transition-all duration-200 cursor-pointer" data-v-57a1b043><div class="flex items-center justify-between" data-v-57a1b043><div class="flex items-center gap-3" data-v-57a1b043><div class="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center" data-v-57a1b043><i class="ti ti-help text-secondary-foreground text-lg" data-v-57a1b043></i></div> <div data-v-57a1b043><h3 class="font-medium text-foreground" data-v-57a1b043>\u0635\u0646\u062F\u0648\u0642 \u0633\u0648\u0627\u0644</h3></div></div> <div class="text-right flex items-center gap-2" data-v-57a1b043><span class="text-muted-foreground text-sm" data-v-57a1b043>${ssrInterpolate(unref(questionBoxCount))} \u067E\u06CC\u0627\u0645</span> <i class="ti ti-chevron-left text-muted-foreground" data-v-57a1b043></i></div></div></div> <div class="bg-card rounded-xl border border-border p-4 hover:bg-accent/5 transition-all duration-200 cursor-pointer" data-v-57a1b043><div class="flex items-center justify-between" data-v-57a1b043><div class="flex items-center gap-3" data-v-57a1b043><div class="w-10 h-10 rounded-xl bg-accent flex items-center justify-center" data-v-57a1b043><i class="ti ti-chart-bar text-accent-foreground text-lg" data-v-57a1b043></i></div> <div data-v-57a1b043><h3 class="font-medium text-foreground" data-v-57a1b043>\u0646\u0638\u0631\u0633\u0646\u062C\u06CC</h3></div></div> <div class="text-right flex items-center gap-2" data-v-57a1b043><span class="text-muted-foreground text-sm" data-v-57a1b043>${ssrInterpolate(unref(pollCount))} \u0631\u0627\u06CC</span> <i class="ti ti-chevron-left text-muted-foreground" data-v-57a1b043></i></div></div></div></div> `);
      if (totalItems.value === 0) {
        _push(`<div class="text-center py-12 mt-8" data-v-57a1b043><div class="w-16 h-16 rounded-full bg-muted/20 flex items-center justify-center mx-auto mb-4" data-v-57a1b043><i class="ti ti-inbox text-muted-foreground text-2xl" data-v-57a1b043></i></div> <h3 class="text-foreground font-medium mb-2" data-v-57a1b043>\u0635\u0646\u062F\u0648\u0642 \u062F\u0631\u06CC\u0627\u0641\u062A\u06CC \u062E\u0627\u0644\u06CC \u0627\u0633\u062A</h3> <p class="text-muted-foreground text-sm" data-v-57a1b043>\u0647\u0646\u0648\u0632 \u0645\u062D\u062A\u0648\u0627\u06CC\u06CC \u062F\u0631\u06CC\u0627\u0641\u062A \u0646\u06A9\u0631\u062F\u0647\u200C\u0627\u06CC\u062F</p></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/inbox/InboxPage.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const InboxPage = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-57a1b043"]]);

export { InboxPage as default };
//# sourceMappingURL=InboxPage-BzHYhKFJ.mjs.map
