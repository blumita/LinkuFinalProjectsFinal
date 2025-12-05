import { defineComponent, useSSRContext } from 'vue';
import { ssrRenderComponent } from 'vue/server-renderer';
import CustomizeLinkPage from './CustomizeLinkPage-DWKpUS64.mjs';
import './BottomSheet-DZASh2SV.mjs';
import './_plugin-vue_export-helper-1tPrXgE0.mjs';
import './InfoToast-DdxwJ7kO.mjs';
import './user-D1YL8aKq.mjs';
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
import 'vue-router';
import 'axios';
import './form-CUJQskNk.mjs';
import './countries-BosuECVZ.mjs';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "customize-link",
  __ssrInlineRender: true,
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      _push(ssrRenderComponent(CustomizeLinkPage, _attrs, null, _parent));
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/profile/customize-link.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=customize-link-te6wMJZh.mjs.map
