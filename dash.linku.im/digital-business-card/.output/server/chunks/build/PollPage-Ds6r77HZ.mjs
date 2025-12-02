import { defineComponent, ref, computed, mergeProps, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderList, ssrInterpolate, ssrRenderStyle } from 'vue/server-renderer';
import { useRouter } from 'vue-router';
import { u as useFormStore } from './form-CUJQskNk.mjs';
import { a as useNuxtApp } from './server.mjs';
import 'pinia';
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
  __name: "PollPage",
  __ssrInlineRender: true,
  setup(__props) {
    useRouter();
    useFormStore();
    const { $axios } = useNuxtApp();
    const loading = ref(true);
    const pollData = ref(null);
    const totalVotes = computed(() => {
      var _a;
      return ((_a = pollData.value) == null ? void 0 : _a.totalVotes) || 0;
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "min-h-screen bg-background" }, _attrs))}><div class="fixed top-0 left-0 right-0 z-40 bg-card border-b border-border"><div class="flex items-center h-14 lg:h-16 px-4 lg:px-6"><button class="flex items-center justify-center w-10 h-10 rounded-lg text-foreground hover:bg-muted transition-colors"><i class="ti ti-arrow-right text-xl"></i></button> <div class="flex-1 text-center lg:text-right lg:mr-4"><h1 class="text-lg lg:text-xl font-bold text-foreground">\u0646\u0638\u0631\u0633\u0646\u062C\u06CC</h1></div> `);
      if (!loading.value && totalVotes.value > 0) {
        _push(`<button class="px-4 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors flex items-center gap-2"><i class="ti ti-download text-lg"></i> <span class="hidden lg:inline">\u062E\u0631\u0648\u062C\u06CC</span></button>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div></div> <div class="pt-20 lg:pt-24 pb-24 px-4 lg:px-6"><div class="max-w-4xl mx-auto">`);
      if (loading.value) {
        _push(`<div class="space-y-6"><div class="bg-card rounded-xl border border-border p-6 animate-pulse"><div class="h-6 bg-muted rounded w-3/4 mb-6"></div> <!--[-->`);
        ssrRenderList(2, (j) => {
          _push(`<div class="mb-4"><div class="flex justify-between mb-2"><div class="h-8 bg-muted rounded w-32"></div> <div class="h-6 bg-muted rounded w-12"></div></div> <div class="h-3 bg-muted rounded w-full"></div></div>`);
        });
        _push(`<!--]--></div></div>`);
      } else if (pollData.value) {
        _push(`<div><div class="bg-card rounded-xl border border-border p-6 mb-6"><h2 class="text-lg font-semibold text-foreground mb-6">${ssrInterpolate(pollData.value.question)}</h2> <div class="space-y-4"><div class="space-y-2"><div class="flex items-center justify-between"><span class="font-medium text-foreground">\u0628\u0644\u0647 (${ssrInterpolate(pollData.value.yesVotes)} \u0631\u0627\u06CC)</span> <span class="text-sm text-muted-foreground">${ssrInterpolate(pollData.value.yesPercentage)}%</span></div> <div class="w-full bg-muted/30 rounded-full h-3 overflow-hidden"><div class="h-full bg-primary rounded-full transition-all duration-1000 ease-out" style="${ssrRenderStyle({ width: `${pollData.value.yesPercentage}%` })}"></div></div></div> <div class="space-y-2"><div class="flex items-center justify-between"><span class="font-medium text-foreground">\u062E\u06CC\u0631 (${ssrInterpolate(pollData.value.noVotes)} \u0631\u0627\u06CC)</span> <span class="text-sm text-muted-foreground">${ssrInterpolate(pollData.value.noPercentage)}%</span></div> <div class="w-full bg-muted/30 rounded-full h-3 overflow-hidden"><div class="h-full bg-muted rounded-full transition-all duration-1000 ease-out" style="${ssrRenderStyle({ width: `${pollData.value.noPercentage}%` })}"></div></div></div></div></div> <div class="grid grid-cols-2 gap-4 mb-6"><div class="bg-card rounded-xl border border-border p-4"><div class="text-2xl font-bold text-foreground">${ssrInterpolate(pollData.value.totalVotes)}</div> <div class="text-sm text-muted-foreground">\u06A9\u0644 \u0622\u0631\u0627</div></div> <div class="bg-card rounded-xl border border-border p-4"><div class="text-2xl font-bold text-primary">${ssrInterpolate(pollData.value.yesPercentage)}%</div> <div class="text-sm text-muted-foreground">\u062F\u0631\u0635\u062F \u0628\u0644\u0647</div></div></div></div>`);
      } else if (!loading.value) {
        _push(`<div class="text-center py-12"><div class="w-16 h-16 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-4"><i class="ti ti-chart-bar text-primary text-2xl opacity-50"></i></div> <h3 class="text-foreground font-medium mb-2">\u0647\u06CC\u0686 \u0646\u0638\u0631\u0633\u0646\u062C\u06CC \u0641\u0639\u0627\u0644\u06CC \u0648\u062C\u0648\u062F \u0646\u062F\u0627\u0631\u062F</h3> <p class="text-muted-foreground text-sm">\u0647\u0646\u0648\u0632 \u0646\u0638\u0631\u0633\u0646\u062C\u06CC \u0627\u06CC\u062C\u0627\u062F \u0646\u0634\u062F\u0647 \u0627\u0633\u062A</p></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div></div></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/inbox/PollPage.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=PollPage-Ds6r77HZ.mjs.map
