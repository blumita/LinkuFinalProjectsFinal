import { computed, mergeProps, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent } from 'vue/server-renderer';
import { E as EditCard } from './index-Bo0AYA9H.mjs';
import { useRoute, useRouter } from 'vue-router';
import { u as useFormStore } from './form-CUJQskNk.mjs';
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
import 'pinia';
import 'axios';
import './useIconComponentsMap-DPTCqB5g.mjs';
import './index-DEV-nTu9.mjs';
import './_plugin-vue_export-helper-1tPrXgE0.mjs';
import 'swiper/vue';
import 'swiper/modules';
import 'vuedraggable';
import './BottomSheet-DZASh2SV.mjs';
import './InfoToast-DdxwJ7kO.mjs';
import './user-D1YL8aKq.mjs';
import './ImageCropperModal-BfuAYe_c.mjs';
import 'vue-advanced-cropper';
import './card-CINoY8tz.mjs';

const _sfc_main = {
  __name: "index",
  __ssrInlineRender: true,
  setup(__props) {
    const route = useRoute();
    useRouter();
    useFormStore();
    const cardId = computed(() => {
      const id = route.params.cardId || route.query.id || route.params.id;
      return id && id !== "undefined" ? id : null;
    });
    const cardSlug = computed(() => {
      const slug = route.query.slug || route.params.slug;
      return slug && slug !== "undefined" ? slug : null;
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "p-1 lg:p-4" }, _attrs))}>`);
      _push(ssrRenderComponent(EditCard, {
        cardId: cardId.value,
        cardSlug: cardSlug.value
      }, null, _parent));
      _push(`</div>`);
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/dashboard/edit-card/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=index-DE3-2gMO.mjs.map
