import { defineComponent, ref, watch, computed, useSSRContext } from 'vue';
import { ssrRenderTeleport, ssrRenderStyle, ssrRenderClass, ssrRenderSlot, ssrInterpolate } from 'vue/server-renderer';
import { _ as _export_sfc } from './_plugin-vue_export-helper-1tPrXgE0.mjs';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "BottomSheet",
  __ssrInlineRender: true,
  props: {
    modelValue: { type: Boolean, default: false },
    visible: { type: Boolean, default: false },
    title: {},
    size: { default: "auto" },
    maxHeight: { default: "70vh" },
    closable: { type: Boolean, default: true },
    closeOnBackdrop: { type: Boolean, default: true },
    closeOnEscape: { type: Boolean, default: true },
    zIndex: { default: "z-[9999]" },
    desktopCentered: { type: Boolean, default: false },
    heightClass: { default: "" },
    contentPadding: { default: "" },
    desktopWidth: { default: "2xl" }
  },
  emits: ["update:modelValue", "close"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    ref(null);
    const setBodyLock = (hidden) => {
      (void 0).body.style.overflow = hidden ? "hidden" : "";
    };
    watch(() => props.modelValue, (val) => {
      setBodyLock(val);
      if (!val) setTimeout(() => setBodyLock(false), 250);
    });
    const desktopWidthClass = computed(() => {
      const widths = {
        sm: "lg:max-w-sm",
        md: "lg:max-w-md",
        lg: "lg:max-w-lg",
        xl: "lg:max-w-xl",
        "2xl": "lg:max-w-2xl",
        "3xl": "lg:max-w-3xl",
        "4xl": "lg:max-w-4xl",
        "5xl": "lg:max-w-5xl"
      };
      return widths[props.desktopWidth] || "lg:max-w-xl";
    });
    const bottomSheetStyle = computed(() => {
      const style = {};
      if (props.size === "full") style.height = "100vh";
      else if (props.size !== "auto") {
        const heights = { sm: "20vh", md: "35vh", lg: "60vh", xl: "80vh" };
        style.height = heights[props.size];
      }
      return style;
    });
    const contentStyle = computed(() => ({
      maxHeight: props.size === "auto" ? props.maxHeight : void 0
    }));
    return (_ctx, _push, _parent, _attrs) => {
      ssrRenderTeleport(_push, (_push2) => {
        if (_ctx.size === "full") {
          _push2(`<div style="${ssrRenderStyle(_ctx.modelValue ? null : { display: "none" })}" class="${ssrRenderClass(["fixed inset-0 lg:bg-black/50", _ctx.zIndex])}" data-v-de0ab630><div style="${ssrRenderStyle(_ctx.modelValue ? null : { display: "none" })}" class="${ssrRenderClass([
            "fixed inset-0 bg-background text-foreground flex flex-col",
            "lg:inset-auto lg:left-1/2 lg:top-1/2 lg:-translate-x-1/2 lg:-translate-y-1/2",
            "lg:w-full lg:max-w-4xl lg:max-h-[80vh] lg:rounded-2xl lg:shadow-2xl lg:border lg:border-border",
            _ctx.zIndex
          ])}" data-v-de0ab630><div class="overflow-y-auto flex-1 scrollbar-hidden" data-v-de0ab630>`);
          ssrRenderSlot(_ctx.$slots, "default", {}, null, _push2, _parent);
          _push2(`</div></div></div>`);
        } else {
          _push2(`<div style="${ssrRenderStyle(_ctx.modelValue ? null : { display: "none" })}" class="${ssrRenderClass(["fixed inset-0 bg-black/50", _ctx.zIndex])}" data-v-de0ab630><div style="${ssrRenderStyle([
            _ctx.modelValue ? null : { display: "none" },
            bottomSheetStyle.value
          ])}" class="${ssrRenderClass([
            "fixed left-0 right-0 bottom-0 bg-card text-foreground flex flex-col rounded-t-2xl shadow-xl border border-border",
            "lg:rounded-2xl lg:left-1/2 lg:right-auto lg:bottom-auto lg:top-1/2 lg:-translate-x-1/2 lg:-translate-y-1/2 lg:w-full lg:max-h-[80vh]",
            desktopWidthClass.value,
            _ctx.zIndex
          ])}" data-v-de0ab630>`);
          if (!_ctx.closable) {
            _push2(`<div class="flex justify-center pt-2 pb-1 lg:hidden" data-v-de0ab630><div class="w-10 h-1 bg-muted-foreground/30 rounded-full" data-v-de0ab630></div></div>`);
          } else {
            _push2(`<!---->`);
          }
          _push2(` `);
          if (_ctx.title || _ctx.closable) {
            _push2(`<div class="flex items-center border-b border-border px-4 py-3" data-v-de0ab630><div class="flex-1 text-center lg:text-right" data-v-de0ab630>`);
            if (_ctx.title) {
              _push2(`<h3 class="text-lg font-semibold text-foreground" data-v-de0ab630>${ssrInterpolate(_ctx.title)}</h3>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</div> `);
            if (_ctx.closable) {
              _push2(`<button type="button" class="w-8 h-8 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors" data-v-de0ab630><i class="ti ti-x text-xl" data-v-de0ab630></i></button>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</div>`);
          } else {
            _push2(`<!---->`);
          }
          _push2(` <div class="overflow-y-auto flex-1 scrollbar-hidden" style="${ssrRenderStyle(contentStyle.value)}" data-v-de0ab630>`);
          ssrRenderSlot(_ctx.$slots, "default", {}, null, _push2, _parent);
          _push2(`</div></div></div>`);
        }
      }, "body", false, _parent);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/ui/BottomSheet.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const __nuxt_component_0 = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-de0ab630"]]);

export { __nuxt_component_0 as _ };
//# sourceMappingURL=BottomSheet-DZASh2SV.mjs.map
