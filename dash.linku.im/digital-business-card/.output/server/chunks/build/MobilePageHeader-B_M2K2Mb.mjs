import { mergeProps, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrInterpolate, ssrRenderSlot } from 'vue/server-renderer';
import { _ as _export_sfc } from './_plugin-vue_export-helper-1tPrXgE0.mjs';

const _sfc_main = {
  __name: "MobilePageHeader",
  __ssrInlineRender: true,
  props: {
    title: { type: String, default: "" }
  },
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<header${ssrRenderAttrs(mergeProps({ class: "flex items-center gap-3 p-3 bg-white dark:bg-gray-900 border-b" }, _attrs))} data-v-be907685><button aria-label="back" class="p-2" data-v-be907685>
      \u2039
    </button> <h1 class="text-lg font-medium" data-v-be907685>${ssrInterpolate(__props.title)}</h1> `);
      ssrRenderSlot(_ctx.$slots, "default", {}, null, _push, _parent);
      _push(`</header>`);
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/shared/Header/MobilePageHeader.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const MobilePageHeader = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-be907685"]]);

export { MobilePageHeader as M };
//# sourceMappingURL=MobilePageHeader-B_M2K2Mb.mjs.map
