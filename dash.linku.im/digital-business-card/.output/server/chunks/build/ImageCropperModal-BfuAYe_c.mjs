import { defineComponent, ref, watch, mergeProps, unref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrIncludeBooleanAttr } from 'vue/server-renderer';
import { Cropper } from 'vue-advanced-cropper';
import { _ as _export_sfc } from './_plugin-vue_export-helper-1tPrXgE0.mjs';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "ImageCropperModal",
  __ssrInlineRender: true,
  props: {
    show: Boolean,
    imageFile: File,
    aspectRatio: Number,
    fieldName: String
  },
  emits: ["close", "cropped"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const cropperRef = ref(null);
    const imageUrl = ref(null);
    const createImageUrl = (file) => {
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          var _a;
          resolve((_a = e.target) == null ? void 0 : _a.result);
        };
        reader.readAsDataURL(file);
      });
    };
    watch(() => props.imageFile, async (newFile) => {
      if (newFile) {
        imageUrl.value = await createImageUrl(newFile);
      } else {
        imageUrl.value = null;
      }
    }, { immediate: true });
    return (_ctx, _push, _parent, _attrs) => {
      if (__props.show) {
        _push(`<div${ssrRenderAttrs(mergeProps({ class: "fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm" }, _attrs))} data-v-1b74ff26><div class="bg-card rounded-lg shadow-xl w-full max-w-2xl mx-4 border border-border" data-v-1b74ff26><div class="p-4 border-b border-border flex justify-between items-center" data-v-1b74ff26><h3 class="text-lg font-medium text-foreground" data-v-1b74ff26>\u0648\u06CC\u0631\u0627\u06CC\u0634 \u062A\u0635\u0648\u06CC\u0631</h3> <button class="text-muted-foreground hover:text-foreground transition-colors" data-v-1b74ff26><i class="ti ti-x text-xl" data-v-1b74ff26></i></button></div> <div class="p-4" data-v-1b74ff26><div class="h-96 w-full relative bg-muted/30 rounded-lg overflow-hidden border border-border" data-v-1b74ff26>`);
        if (imageUrl.value) {
          _push(ssrRenderComponent(unref(Cropper), {
            ref_key: "cropperRef",
            ref: cropperRef,
            class: "cropper",
            src: imageUrl.value,
            "stencil-props": {
              aspectRatio: __props.aspectRatio,
              previewClass: "cropper-preview"
            },
            "auto-zoom": true,
            background: false
          }, null, _parent));
        } else {
          _push(`<div class="h-full flex flex-col items-center justify-center text-muted-foreground" data-v-1b74ff26><i class="ti ti-photo text-4xl mb-2" data-v-1b74ff26></i> <p class="text-sm" data-v-1b74ff26>\u062F\u0631 \u062D\u0627\u0644 \u0622\u0645\u0627\u062F\u0647\u200C\u0633\u0627\u0632\u06CC \u062A\u0635\u0648\u06CC\u0631...</p></div>`);
        }
        _push(`</div></div> <div class="p-4 border-t border-border flex justify-end gap-2" data-v-1b74ff26><button class="px-4 py-2 border border-border rounded-md text-muted-foreground hover:bg-muted hover:text-foreground transition-colors" data-v-1b74ff26>
            \u0627\u0646\u0635\u0631\u0627\u0641
          </button> <button${ssrIncludeBooleanAttr(!imageUrl.value) ? " disabled" : ""} class="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed" data-v-1b74ff26>
            \u062A\u0627\u06CC\u06CC\u062F \u0648 \u0630\u062E\u06CC\u0631\u0647
          </button></div></div></div>`);
      } else {
        _push(`<!---->`);
      }
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/UserDashboard/modals/ImageCropperModal.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const ImageCropperModal = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-1b74ff26"]]);

export { ImageCropperModal as I };
//# sourceMappingURL=ImageCropperModal-BfuAYe_c.mjs.map
