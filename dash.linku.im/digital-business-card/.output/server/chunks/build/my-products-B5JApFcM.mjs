import { ssrRenderList, ssrRenderAttr, ssrInterpolate, ssrRenderComponent } from 'vue/server-renderer';
import { ref, useSSRContext } from 'vue';
import { b as useRouter, a as useNuxtApp } from './server.mjs';
import { I as InfoToast } from './InfoToast-DdxwJ7kO.mjs';
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

const _sfc_main = {
  __name: "my-products",
  __ssrInlineRender: true,
  setup(__props) {
    useRouter();
    const { $axios } = useNuxtApp();
    const showToast = ref(false);
    const toastMessage = ref("");
    const toastIcon = ref("ti-alert-triangle");
    const activatedCards = ref([]);
    const loadingActivated = ref(true);
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<!--[--><div class="min-h-screen bg-background flex flex-col" data-v-d77c89b5><div class="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-lg border-b border-border" data-v-d77c89b5><div class="flex items-center h-14 px-2 lg:px-6 max-w-4xl mx-auto" data-v-d77c89b5><button class="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-accent transition-colors" data-v-d77c89b5><i class="ti ti-arrow-right text-xl text-foreground" data-v-d77c89b5></i></button> <h1 class="flex-1 text-base lg:text-lg font-semibold text-foreground text-center" data-v-d77c89b5>
          \u0645\u062D\u0635\u0648\u0644\u0627\u062A \u0641\u0639\u0627\u0644 \u0645\u0646
        </h1> <div class="w-10" data-v-d77c89b5></div></div></div> <div class="flex-1 pt-16 px-2 lg:px-6 max-w-4xl mx-auto w-full pb-8" data-v-d77c89b5><p class="text-sm text-muted-foreground text-center mb-4 lg:mb-6" data-v-d77c89b5>
        \u0644\u06CC\u0633\u062A \u0645\u062D\u0635\u0648\u0644\u0627\u062A \u0641\u0639\u0627\u0644 \u0634\u062F\u0647 \u0634\u0645\u0627
      </p> `);
      if (loadingActivated.value) {
        _push(`<div class="space-y-3" data-v-d77c89b5><!--[-->`);
        ssrRenderList(3, (n) => {
          _push(`<div class="bg-card rounded-xl p-3 lg:p-4 animate-pulse" data-v-d77c89b5><div class="flex items-center gap-3" data-v-d77c89b5><div class="w-12 h-12 lg:w-14 lg:h-14 bg-muted rounded-lg" data-v-d77c89b5></div> <div class="flex-1 space-y-2" data-v-d77c89b5><div class="h-4 bg-muted rounded w-3/4" data-v-d77c89b5></div> <div class="h-3 bg-muted rounded w-1/2" data-v-d77c89b5></div></div></div></div>`);
        });
        _push(`<!--]--></div>`);
      } else if (activatedCards.value.length) {
        _push(`<div class="space-y-2 lg:space-y-3" data-v-d77c89b5><!--[-->`);
        ssrRenderList(activatedCards.value, (card) => {
          _push(`<div class="bg-card border border-border rounded-xl p-3 lg:p-4 flex items-center gap-2 lg:gap-3" data-v-d77c89b5><img${ssrRenderAttr("src", card.image)}${ssrRenderAttr("alt", card.name)} class="w-12 h-12 lg:w-14 lg:h-14 object-contain" data-v-d77c89b5> <div class="flex-1 min-w-0" data-v-d77c89b5><h4 class="font-medium text-foreground text-sm lg:text-base" data-v-d77c89b5>${ssrInterpolate(card.name)}</h4> <p class="text-xs lg:text-sm text-muted-foreground font-mono truncate" data-v-d77c89b5>${ssrInterpolate(card.license)}</p> <p class="text-xs text-muted-foreground" data-v-d77c89b5>\u0641\u0639\u0627\u0644 \u0634\u062F\u0647 \u062F\u0631: ${ssrInterpolate(card.activatedAt)}</p></div> <button class="text-xs lg:text-sm text-destructive bg-destructive/10 px-3 py-2 rounded-lg hover:bg-destructive/20 transition-colors" data-v-d77c89b5>
            \u063A\u06CC\u0631\u0641\u0639\u0627\u0644
          </button></div>`);
        });
        _push(`<!--]--></div>`);
      } else {
        _push(`<div class="bg-card border border-dashed border-border rounded-xl p-8 lg:p-12 text-center" data-v-d77c89b5><i class="ti ti-device-mobile-off text-4xl lg:text-5xl text-muted-foreground mb-3 lg:mb-4" data-v-d77c89b5></i> <p class="text-foreground font-semibold mb-2 text-base lg:text-lg" data-v-d77c89b5>\u0645\u062D\u0635\u0648\u0644 \u0641\u0639\u0627\u0644\u06CC \u0646\u062F\u0627\u0631\u06CC\u062F</p> <p class="text-xs lg:text-sm text-muted-foreground mb-6" data-v-d77c89b5>\u0647\u0646\u0648\u0632 \u0645\u062D\u0635\u0648\u0644\u06CC \u0631\u0627 \u0641\u0639\u0627\u0644 \u0646\u06A9\u0631\u062F\u0647\u200C\u0627\u06CC\u062F</p> <button class="inline-flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-xl font-medium hover:bg-primary/90 transition-colors" data-v-d77c89b5><i class="ti ti-plus" data-v-d77c89b5></i> <span data-v-d77c89b5>\u0641\u0639\u0627\u0644\u200C\u0633\u0627\u0632\u06CC \u0645\u062D\u0635\u0648\u0644 \u062C\u062F\u06CC\u062F</span></button></div>`);
      }
      _push(` `);
      if (activatedCards.value.length) {
        _push(`<div class="mt-6 lg:mt-8" data-v-d77c89b5><button class="w-full bg-gradient-to-r from-primary to-primary/80 text-white py-4 rounded-xl font-semibold hover:from-primary/90 hover:to-primary/70 transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2" data-v-d77c89b5><i class="ti ti-plus text-xl" data-v-d77c89b5></i> <span data-v-d77c89b5>\u0641\u0639\u0627\u0644\u200C\u0633\u0627\u0632\u06CC \u0645\u062D\u0635\u0648\u0644 \u062C\u062F\u06CC\u062F</span></button></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div></div> `);
      _push(ssrRenderComponent(InfoToast, {
        visible: showToast.value,
        message: toastMessage.value,
        icon: toastIcon.value
      }, null, _parent));
      _push(`<!--]-->`);
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/dashboard/my-products.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const myProducts = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-d77c89b5"]]);

export { myProducts as default };
//# sourceMappingURL=my-products-B5JApFcM.mjs.map
