import { ref, computed, mergeProps, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderAttr, ssrInterpolate } from 'vue/server-renderer';
import { u as useUserStore } from './user-D1YL8aKq.mjs';
import { u as useAuthStore } from './server.mjs';
import { u as useFormStore } from './form-CUJQskNk.mjs';
import { u as useMessageCounts } from './useMessageCounts-Dq1nkOUx.mjs';
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
import 'vue-router';
import 'axios';

const _sfc_main = {
  __name: "index",
  __ssrInlineRender: true,
  setup(__props) {
    ref("");
    useAuthStore();
    const userStore = useUserStore();
    const formStore = useFormStore();
    const loading = ref(true);
    const copied = ref(false);
    const showPreviewMobile = ref(false);
    const hasValidAuth = computed(() => {
      return false;
    });
    const userName = computed(() => {
      var _a;
      return ((_a = userStore.user) == null ? void 0 : _a.name) || "\u06A9\u0627\u0631\u0628\u0631";
    });
    const userUserName = computed(() => {
      var _a, _b;
      return ((_a = userStore.user) == null ? void 0 : _a.userName) || ((_b = userStore.user) == null ? void 0 : _b.username) || "";
    });
    const userAvatar = computed(() => {
      var _a;
      return ((_a = userStore.user) == null ? void 0 : _a.avatar) || "/logo.svg";
    });
    const isPro = computed(() => {
      var _a;
      return ((_a = userStore.user) == null ? void 0 : _a.isPro) || false;
    });
    const activeCard = computed(() => {
      var _a;
      return formStore.defaultCard || ((_a = formStore.cards) == null ? void 0 : _a[0]) || null;
    });
    useMessageCounts();
    return (_ctx, _push, _parent, _attrs) => {
      if (hasValidAuth.value) {
        _push(`<div${ssrRenderAttrs(mergeProps({ class: "h-full overflow-hidden" }, _attrs))}>`);
        if (showPreviewMobile.value) {
          _push(`<div class="fixed inset-0 z-[9999] lg:hidden bg-white"><div class="sticky top-0 z-10 bg-white border-b border-border safe-area-top"><div class="flex items-center justify-between px-4 py-3"><button class="flex items-center gap-2 text-foreground"><i class="ti ti-arrow-right text-xl"></i> <span class="font-medium">\u0628\u0627\u0632\u06AF\u0634\u062A</span></button> <span class="text-sm text-muted-foreground">\u067E\u06CC\u0634\u200C\u0646\u0645\u0627\u06CC\u0634</span> <div class="w-20"></div></div></div> <div class="h-[calc(100vh-60px)] overflow-y-auto"><iframe${ssrRenderAttr("src", `/${userUserName.value}`)} class="w-full h-full border-0" title="\u067E\u06CC\u0634\u200C\u0646\u0645\u0627\u06CC\u0634 \u067E\u0631\u0648\u0641\u0627\u06CC\u0644"></iframe></div></div>`);
        } else {
          _push(`<!---->`);
        }
        _push(` <div class="fixed inset-0 top-[60px] bottom-[80px] lg:relative lg:top-auto lg:bottom-auto lg:px-6 lg:py-8 lg:h-auto flex items-center justify-center overflow-hidden bg-background"><div class="w-full max-w-xs mx-auto px-4 lg:px-0">`);
        if (loading.value) {
          _push(`<div class="text-center animate-pulse"><div class="bg-card rounded-[22px] overflow-hidden shadow-[0_10px_30px_-10px_rgba(0,0,0,0.25)] border border-border"><div class="h-28 bg-muted"></div> <div class="relative px-4 pb-5 -mt-8"><div class="relative w-fit mx-auto"><div class="w-24 h-24 rounded-full bg-muted ring-4 ring-card shadow-md"></div> <div class="absolute -right-2 bottom-1 h-6 w-6 rounded-full bg-muted shadow border border-border"></div></div> <div class="text-center mt-3 mb-4 space-y-2"><div class="flex items-center justify-center gap-1"><div class="h-5 w-32 bg-muted rounded"></div> <div class="w-5 h-5 bg-muted rounded-full"></div></div> <div class="h-3 w-24 bg-muted-foreground/20 rounded mx-auto"></div></div> <div class="grid gap-2.5"><div class="w-full h-14 rounded-2xl bg-muted"></div> <div class="w-full h-14 rounded-2xl bg-muted"></div></div></div></div></div>`);
        } else if (activeCard.value) {
          _push(`<div class="text-center"><div class="bg-card rounded-[22px] overflow-hidden shadow-[0_10px_30px_-10px_rgba(0,0,0,0.25)] border border-border"><div class="relative h-28 bg-muted">`);
          if (activeCard.value.cover) {
            _push(`<img${ssrRenderAttr("src", activeCard.value.cover)} alt="\u0628\u0646\u0631 \u067E\u0631\u0648\u0641\u0627\u06CC\u0644" class="absolute inset-0 w-full h-full object-cover">`);
          } else {
            _push(`<!---->`);
          }
          _push(`</div> <div class="relative px-4 pb-5 -mt-8"><div class="relative w-fit mx-auto"><div class="w-24 h-24 rounded-full overflow-hidden ring-4 ring-card shadow-md bg-background"><img${ssrRenderAttr("src", activeCard.value.avatar || userAvatar.value)} alt="\u067E\u0631\u0648\u0641\u0627\u06CC\u0644" class="w-full h-full object-cover"></div> <button class="absolute -right-2 bottom-1 h-6 w-6 rounded-full bg-secondary shadow grid place-items-center border border-border hover:bg-secondary/80 transition-colors" title="\u06A9\u067E\u06CC \u0644\u06CC\u0646\u06A9"><i class="ti ti-link text-[14px] text-primary"></i></button></div> <div class="text-center mt-3 mb-4"><div class="flex items-center justify-center gap-1"><h3 class="text-[15px] font-extrabold text-foreground">${ssrInterpolate(userName.value)}</h3> `);
          if (isPro.value) {
            _push(`<i class="ti ti-rosette-discount-check-filled text-primary text-xl"></i>`);
          } else {
            _push(`<!---->`);
          }
          _push(`</div> <p class="text-[12px] text-muted-foreground mt-1">${ssrInterpolate(activeCard.value.bio || "\u067E\u0631\u0648\u0641\u0627\u06CC\u0644 \u0634\u0645\u0627")}</p></div> <div class="grid gap-2.5"><button class="w-full h-14 rounded-2xl bg-secondary text-[13px] font-semibold text-primary hover:bg-secondary/80 transition-colors border border-border">
                    \u067E\u06CC\u0634\u200C\u0646\u0645\u0627\u06CC\u0634
                  </button> <button class="w-full h-14 rounded-2xl bg-primary text-[13px] font-semibold text-primary-foreground hover:bg-primary/90 transition-colors">
                    \u0648\u06CC\u0631\u0627\u06CC\u0634
                  </button></div></div></div></div>`);
        } else {
          _push(`<div class="text-center py-8"><i class="ti ti-user-circle text-6xl text-muted-foreground mb-4"></i> <h3 class="text-lg font-semibold text-foreground mb-2">\u067E\u0631\u0648\u0641\u0627\u06CC\u0644\u06CC \u06CC\u0627\u0641\u062A \u0646\u0634\u062F</h3> <p class="text-sm text-muted-foreground mb-4">\u0627\u0628\u062A\u062F\u0627 \u06CC\u06A9 \u067E\u0631\u0648\u0641\u0627\u06CC\u0644 \u0627\u06CC\u062C\u0627\u062F \u06A9\u0646\u06CC\u062F</p> <button class="px-6 py-3 bg-primary text-primary-foreground rounded-xl text-sm font-semibold hover:bg-primary/90 transition-colors">
              \u0627\u06CC\u062C\u0627\u062F \u067E\u0631\u0648\u0641\u0627\u06CC\u0644 \u062C\u062F\u06CC\u062F
            </button></div>`);
        }
        _push(`</div> `);
        if (copied.value) {
          _push(`<div class="fixed bottom-24 left-1/2 transform -translate-x-1/2 bg-primary text-primary-foreground px-4 py-2 rounded-full text-sm font-medium z-50 shadow-lg">
        \u0644\u06CC\u0646\u06A9 \u06A9\u067E\u06CC \u0634\u062F!
      </div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div></div>`);
      } else {
        _push(`<!---->`);
      }
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/dashboard/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=index-8MbkGhGf.mjs.map
