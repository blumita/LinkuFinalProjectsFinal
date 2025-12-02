import { computed, mergeProps, unref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderClass, ssrInterpolate } from 'vue/server-renderer';
import { _ as _export_sfc } from './_plugin-vue_export-helper-1tPrXgE0.mjs';

const _sfc_main = {
  __name: "InfoToast",
  __ssrInlineRender: true,
  props: {
    visible: Boolean,
    title: { type: String, default: "" },
    message: { type: String, default: "" },
    type: {
      type: String,
      default: ""
      // success, error, warning, info
    },
    // پراپ icon برای سازگاری با کدهای قبلی
    icon: {
      type: String,
      default: ""
    }
  },
  setup(__props) {
    const props = __props;
    const computedType = computed(() => {
      if (props.type) return props.type;
      if (props.icon) {
        if (props.icon.includes("check")) return "success";
        if (props.icon.includes("alert") || props.icon.includes("triangle")) return "error";
        if (props.icon.includes("lock")) return "warning";
      }
      return "info";
    });
    const computedIcon = computed(() => {
      if (props.icon) return props.icon;
      switch (computedType.value) {
        case "success":
          return "ti-check";
        case "error":
          return "ti-alert-circle";
        case "warning":
          return "ti-lock";
        default:
          return "ti-info-circle";
      }
    });
    const computedTitle = computed(() => {
      if (props.title) return props.title;
      switch (computedType.value) {
        case "success":
          return "\u0645\u0648\u0641\u0642\u06CC\u062A!";
        case "error":
          return "\u062E\u0637\u0627!";
        case "warning":
          return "\u0647\u0634\u062F\u0627\u0631!";
        default:
          return "\u062A\u0648\u062C\u0647!";
      }
    });
    const bgClass = computed(() => {
      switch (computedType.value) {
        case "success":
          return "bg-emerald-500/95";
        case "error":
          return "bg-red-500/95";
        case "warning":
          return "bg-amber-500/95";
        default:
          return "bg-blue-500/95";
      }
    });
    return (_ctx, _push, _parent, _attrs) => {
      if (__props.visible) {
        _push(`<div${ssrRenderAttrs(mergeProps({
          class: [
            "fixed top-6 left-1/2 -translate-x-1/2 z-[9999] min-w-[280px] max-w-sm",
            "rounded-2xl flex items-center gap-3 px-4 py-3 backdrop-blur-md shadow-2xl",
            unref(bgClass)
          ]
        }, _attrs))} data-v-7788f47e><div class="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0" data-v-7788f47e><i class="${ssrRenderClass(["ti", unref(computedIcon), "text-lg text-white"])}" data-v-7788f47e></i></div> <div class="flex-1 text-sm leading-tight" data-v-7788f47e><p class="font-semibold text-white" data-v-7788f47e>${ssrInterpolate(unref(computedTitle))}</p> `);
        if (__props.message) {
          _push(`<p class="text-white/70 text-xs mt-0.5" data-v-7788f47e>${ssrInterpolate(__props.message)}</p>`);
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/UserDashboard/modals/InfoToast.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const InfoToast = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-7788f47e"]]);

export { InfoToast as I };
//# sourceMappingURL=InfoToast-DdxwJ7kO.mjs.map
