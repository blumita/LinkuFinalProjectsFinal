import { f as useRoute, a as useNuxtApp, _ as __nuxt_component_0$3 } from './server.mjs';
import { ref, computed, watch, unref, defineComponent, withCtx, createVNode, resolveDynamicComponent, createTextVNode, createBlock, openBlock, toDisplayString, createCommentVNode, watchEffect, nextTick, useSSRContext } from 'vue';
import { ssrRenderAttr, ssrRenderClass, ssrRenderComponent, ssrIncludeBooleanAttr, ssrLooseContain, ssrRenderVNode, ssrInterpolate, ssrRenderStyle } from 'vue/server-renderer';
import { a as useSafeFormStore, u as useIconComponents } from './useIconComponentsMap-DPTCqB5g.mjs';
import { u as useFormStore, d as defaultFields } from './form-CUJQskNk.mjs';
import { d as _sfc_main$g, u as useLinkStore, _ as _sfc_main$1S, a as _sfc_main$1R, b as _sfc_main$1Q, c as _sfc_main$1P, C as CardNameModal, e as _sfc_main$e, E as EditForms } from './index-DEV-nTu9.mjs';
import { _ as __nuxt_component_0 } from './BottomSheet-DZASh2SV.mjs';
import { I as ImageCropperModal } from './ImageCropperModal-BfuAYe_c.mjs';
import { I as InfoToast } from './InfoToast-DdxwJ7kO.mjs';
import { u as useCardStore } from './card-CINoY8tz.mjs';
import draggable from 'vuedraggable';
import { _ as _export_sfc } from './_plugin-vue_export-helper-1tPrXgE0.mjs';

const _sfc_main$3 = /* @__PURE__ */ defineComponent({
  __name: "CoverAvatarSection",
  __ssrInlineRender: true,
  setup(__props) {
    const form = useFormStore();
    const showBottomSheet = ref(false);
    const showImageCropper = ref(false);
    const selectedFile = ref(null);
    const cropType = ref("cover");
    const coverImageUrl = computed({
      get: () => form.safeCoverImage || "",
      set: (value) => {
        form.coverImage = value;
      }
    });
    const profileImageUrl = computed({
      get: () => form.safeProfileImage || "",
      set: (value) => {
        form.profileImage = value;
      }
    });
    const logoImageUrl = computed({
      get: () => form.safeLogoImage || "",
      set: (value) => {
        form.logoImage = value;
      }
    });
    const selectCoverPhoto = () => {
      showBottomSheet.value = false;
      triggerFileInput("cover");
    };
    const selectProfilePhoto = () => {
      showBottomSheet.value = false;
      triggerFileInput("profile");
    };
    const selectCompanyLogo = () => {
      showBottomSheet.value = false;
      triggerFileInput("logo");
    };
    const triggerFileInput = (type) => {
      cropType.value = type;
      const input = (void 0).createElement("input");
      input.type = "file";
      input.accept = "image/*";
      input.onchange = (event) => {
        var _a;
        const file = (_a = event.target.files) == null ? void 0 : _a[0];
        if (file) {
          selectedFile.value = file;
          showImageCropper.value = true;
        }
      };
      input.click();
    };
    const handleImageCropped = async (croppedImageUrl, fieldName) => {
      switch (fieldName) {
        case "cover":
          coverImageUrl.value = croppedImageUrl;
          break;
        case "profile":
          profileImageUrl.value = croppedImageUrl;
          break;
        case "logo":
          logoImageUrl.value = croppedImageUrl;
          break;
      }
      await nextTick();
      showImageCropper.value = false;
      selectedFile.value = null;
    };
    const closeImageCropper = () => {
      showImageCropper.value = false;
      selectedFile.value = null;
    };
    const getAspectRatio = () => {
      switch (cropType.value) {
        case "cover":
          return 16 / 9;
        // Cover photo aspect ratio
        case "profile":
          return 1;
        // Square for profile
        case "logo":
          return 1;
        // Square for logo
        default:
          return 1;
      }
    };
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<!--[--><section class="relative rounded-xl bg-card border border-border h-36 hover:shadow-md transition-shadow">`);
      if (coverImageUrl.value) {
        _push(`<div class="absolute inset-0 w-full h-full"><img${ssrRenderAttr("src", coverImageUrl.value)} alt="Cover Photo" class="w-full h-full object-cover"> <div class="absolute inset-0 bg-black/10"></div></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(` <button class="absolute left-4 top-4 rounded-full bg-background/90 backdrop-blur-sm hover:bg-background text-foreground text-xs px-3 py-2 transition-all shadow-lg hover:shadow-xl border border-border/50">
      \u0648\u06CC\u0631\u0627\u06CC\u0634 \u062A\u0635\u0648\u06CC\u0631
    </button> <div class="absolute -bottom-10 left-1/2 transform -translate-x-1/2"><div class="relative"><button class="w-24 h-24 rounded-full bg-card ring-4 ring-card border border-border grid place-items-center hover:bg-muted/20 transition-colors overflow-hidden">`);
      if (profileImageUrl.value) {
        _push(`<img${ssrRenderAttr("src", profileImageUrl.value)} alt="Profile Photo" class="w-full h-full object-cover rounded-full">`);
      } else {
        _push(`<svg viewBox="0 0 24 24" class="w-10 h-10 text-muted-foreground"><path fill="currentColor" d="M12 12a4 4 0 1 0-4-4a4 4 0 0 0 4 4Zm0 2c-4.67 0-8 2.33-8 5v1h16v-1c0-2.67-3.33-5-8-5Z"></path></svg>`);
      }
      _push(`</button> <button class="absolute bottom-0 -left-1 w-10 h-10 rounded-full bg-muted border-2 border-card grid place-items-center hover:bg-primary/80 transition-colors overflow-hidden">`);
      if (logoImageUrl.value) {
        _push(`<img${ssrRenderAttr("src", logoImageUrl.value)} alt="Company Logo" class="w-full h-full object-cover rounded-full">`);
      } else {
        _push(`<span class="text-xs font-bold text-muted-foreground">\u0644\u0648\u06AF\u0648</span>`);
      }
      _push(`</button></div></div></section> <div class="h-16"></div> `);
      _push(ssrRenderComponent(__nuxt_component_0, {
        modelValue: showBottomSheet.value,
        "onUpdate:modelValue": ($event) => showBottomSheet.value = $event,
        size: "auto",
        closable: false
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="p-6"${_scopeId}><button class="w-full mb-6 p-6 rounded-2xl bg-card border border-border hover:bg-muted transition-colors flex flex-col items-center justify-center gap-3"${_scopeId}><div class="w-12 h-12 rounded-xl bg-primary flex items-center justify-center"${_scopeId}><svg viewBox="0 0 24 24" class="w-6 h-6 text-primary-foreground"${_scopeId}><path fill="currentColor" d="M5 21q-.825 0-1.413-.588T3 19V5q0-.825.588-1.413T5 3h14q.825 0 1.413.588T21 5v14q0 .825-.588 1.413T19 21H5Zm1-4h12l-3.75-5-3 4L9 13l-3 4Z"${_scopeId}></path></svg></div> <span class="text-foreground font-medium text-base"${_scopeId}>\u0627\u0641\u0632\u0648\u062F\u0646 \u0639\u06A9\u0633 \u06A9\u0627\u0648\u0631</span></button> <div class="grid grid-cols-2 gap-4 mb-6"${_scopeId}><button class="p-6 rounded-2xl bg-card border border-border hover:bg-muted transition-colors flex flex-col items-center justify-center gap-3"${_scopeId}><div class="w-10 h-10 rounded-full bg-primary flex items-center justify-center"${_scopeId}><svg viewBox="0 0 24 24" class="w-5 h-5 text-primary-foreground"${_scopeId}><path fill="currentColor" d="M12 12a4 4 0 1 0-4-4a4 4 0 0 0 4 4Zm0 2c-4.67 0-8 2.33-8 5v1h16v-1c0-2.67-3.33-5-8-5Z"${_scopeId}></path></svg></div> <span class="text-foreground font-medium text-sm"${_scopeId}>\u0627\u0641\u0632\u0648\u062F\u0646 \u067E\u0631\u0648\u0641\u0627\u06CC\u0644</span></button> <button class="p-6 rounded-2xl bg-card border border-border hover:bg-muted transition-colors flex flex-col items-center justify-center gap-3"${_scopeId}><div class="w-10 h-10 rounded-full border-2 border-primary flex items-center justify-center"${_scopeId}><svg viewBox="0 0 24 24" class="w-4 h-4 text-primary"${_scopeId}><path fill="currentColor" d="M11 11V6h2v5h5v2h-5v5h-2v-5H6v-2z"${_scopeId}></path></svg></div> <span class="text-foreground font-medium text-sm"${_scopeId}>\u0627\u0641\u0632\u0648\u062F\u0646 \u0644\u0648\u06AF\u0648</span></button></div> <button class="w-full p-4 rounded-2xl bg-muted border border-border text-foreground font-semibold text-base transition-colors hover:bg-muted/80"${_scopeId}>
        \u0627\u0646\u0635\u0631\u0627\u0641
      </button></div>`);
          } else {
            return [
              createVNode("div", { class: "p-6" }, [
                createVNode("button", {
                  onClick: selectCoverPhoto,
                  class: "w-full mb-6 p-6 rounded-2xl bg-card border border-border hover:bg-muted transition-colors flex flex-col items-center justify-center gap-3"
                }, [
                  createVNode("div", { class: "w-12 h-12 rounded-xl bg-primary flex items-center justify-center" }, [
                    (openBlock(), createBlock("svg", {
                      viewBox: "0 0 24 24",
                      class: "w-6 h-6 text-primary-foreground"
                    }, [
                      createVNode("path", {
                        fill: "currentColor",
                        d: "M5 21q-.825 0-1.413-.588T3 19V5q0-.825.588-1.413T5 3h14q.825 0 1.413.588T21 5v14q0 .825-.588 1.413T19 21H5Zm1-4h12l-3.75-5-3 4L9 13l-3 4Z"
                      })
                    ]))
                  ]),
                  createTextVNode(),
                  createVNode("span", { class: "text-foreground font-medium text-base" }, "\u0627\u0641\u0632\u0648\u062F\u0646 \u0639\u06A9\u0633 \u06A9\u0627\u0648\u0631")
                ]),
                createTextVNode(),
                createVNode("div", { class: "grid grid-cols-2 gap-4 mb-6" }, [
                  createVNode("button", {
                    onClick: selectProfilePhoto,
                    class: "p-6 rounded-2xl bg-card border border-border hover:bg-muted transition-colors flex flex-col items-center justify-center gap-3"
                  }, [
                    createVNode("div", { class: "w-10 h-10 rounded-full bg-primary flex items-center justify-center" }, [
                      (openBlock(), createBlock("svg", {
                        viewBox: "0 0 24 24",
                        class: "w-5 h-5 text-primary-foreground"
                      }, [
                        createVNode("path", {
                          fill: "currentColor",
                          d: "M12 12a4 4 0 1 0-4-4a4 4 0 0 0 4 4Zm0 2c-4.67 0-8 2.33-8 5v1h16v-1c0-2.67-3.33-5-8-5Z"
                        })
                      ]))
                    ]),
                    createTextVNode(),
                    createVNode("span", { class: "text-foreground font-medium text-sm" }, "\u0627\u0641\u0632\u0648\u062F\u0646 \u067E\u0631\u0648\u0641\u0627\u06CC\u0644")
                  ]),
                  createTextVNode(),
                  createVNode("button", {
                    onClick: selectCompanyLogo,
                    class: "p-6 rounded-2xl bg-card border border-border hover:bg-muted transition-colors flex flex-col items-center justify-center gap-3"
                  }, [
                    createVNode("div", { class: "w-10 h-10 rounded-full border-2 border-primary flex items-center justify-center" }, [
                      (openBlock(), createBlock("svg", {
                        viewBox: "0 0 24 24",
                        class: "w-4 h-4 text-primary"
                      }, [
                        createVNode("path", {
                          fill: "currentColor",
                          d: "M11 11V6h2v5h5v2h-5v5h-2v-5H6v-2z"
                        })
                      ]))
                    ]),
                    createTextVNode(),
                    createVNode("span", { class: "text-foreground font-medium text-sm" }, "\u0627\u0641\u0632\u0648\u062F\u0646 \u0644\u0648\u06AF\u0648")
                  ])
                ]),
                createTextVNode(),
                createVNode("button", {
                  onClick: ($event) => showBottomSheet.value = false,
                  class: "w-full p-4 rounded-2xl bg-muted border border-border text-foreground font-semibold text-base transition-colors hover:bg-muted/80"
                }, "\r\n        \u0627\u0646\u0635\u0631\u0627\u0641\r\n      ", 8, ["onClick"])
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(` `);
      _push(ssrRenderComponent(ImageCropperModal, {
        show: showImageCropper.value,
        "image-file": selectedFile.value || void 0,
        "aspect-ratio": getAspectRatio(),
        "field-name": cropType.value,
        onClose: closeImageCropper,
        onCropped: handleImageCropped
      }, null, _parent));
      _push(`<!--]-->`);
    };
  }
});
const _sfc_setup$3 = _sfc_main$3.setup;
_sfc_main$3.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/UserDashboard/main/EditCard/components/CoverAvatarSection.vue");
  return _sfc_setup$3 ? _sfc_setup$3(props, ctx) : void 0;
};
const _sfc_main$2 = {
  __name: "TabAbout",
  __ssrInlineRender: true,
  emits: ["open-preview"],
  setup(__props, { emit: __emit }) {
    const route = useRoute();
    const cardId = ref("");
    const slug = ref("");
    const form = useFormStore();
    const { $axios } = useNuxtApp();
    ref(false);
    const cardNameModalOpen = ref(false);
    ref(false);
    const showToast = ref(false);
    const toastMessage = ref("");
    const toastIcon = ref("ti-alert-triangle");
    watch(() => route.query, (query) => {
      if (query.id) {
        cardId.value = query.id;
        slug.value = query.slug || "";
      }
    }, { immediate: true });
    function closeCardNameModal() {
      cardNameModalOpen.value = false;
    }
    function updateCardName(newName) {
      form.cardName = newName;
      cardNameModalOpen.value = false;
    }
    ref(false);
    const layoutOptions = {
      right: "\u0631\u0627\u0633\u062A\u200C\u0686\u06CC\u0646",
      left: "\u0686\u067E\u200C\u0686\u06CC\u0646",
      center: "\u0648\u0633\u0637\u200C\u0686\u06CC\u0646",
      portrait: "\u067E\u0631\u062A\u0631\u0647"
    };
    computed(() => layoutOptions[form.layout]);
    computed(() => typeof form.cardName === "string" && form.cardName.trim() !== "" ? form.cardName : "\u0646\u0627\u0645 \u06A9\u0627\u0631\u062A \u0631\u0627 \u0648\u0627\u0631\u062F \u06A9\u0646\u06CC\u062F");
    computed(() => {
      var _a;
      return (_a = form.matchThemeColor) != null ? _a : false;
    });
    const cardStore = useCardStore();
    const linkStore = useLinkStore();
    watchEffect(async () => {
      var _a;
      const id = cardId.value;
      if (!id) return;
      await linkStore.fetchLinks(id);
      form.links = linkStore.links;
      await cardStore.fetchCard(id);
      const fetchedFields = (_a = cardStore.activeCard) == null ? void 0 : _a.fields;
      if (Array.isArray(fetchedFields)) {
        form.fields = fetchedFields;
      }
      if (!Array.isArray(form.fields) || form.fields.length === 0) {
        form.fields = structuredClone(defaultFields);
      }
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<!--[--><div class="space-y-3">`);
      _push(ssrRenderComponent(_sfc_main$3, null, null, _parent));
      _push(` <div class="space-y-4"><div class="grid grid-cols-1">`);
      _push(ssrRenderComponent(_sfc_main$1S, {
        label: "\u0646\u0627\u0645 \u06A9\u0627\u0645\u0644",
        modelValue: unref(form).name,
        "onUpdate:modelValue": ($event) => unref(form).name = $event,
        placeholder: "\u0646\u0627\u0645 \u0648 \u0646\u0627\u0645 \u062E\u0627\u0646\u0648\u0627\u062F\u06AF\u06CC",
        maxlength: 40,
        error: unref(form).name && unref(form).name.length > 40 ? "\u062D\u062F\u0627\u06A9\u062B\u0631 \u06F4\u06F0 \u06A9\u0627\u0631\u0627\u06A9\u062A\u0631 \u0645\u062C\u0627\u0632 \u0627\u0633\u062A" : ""
      }, null, _parent));
      _push(`</div> <div class="grid grid-cols-1 md:grid-cols-2 gap-4">`);
      _push(ssrRenderComponent(_sfc_main$1S, {
        label: "\u0633\u0645\u062A \u0634\u063A\u0644\u06CC",
        modelValue: unref(form).job,
        "onUpdate:modelValue": ($event) => unref(form).job = $event,
        placeholder: "\u0639\u0646\u0648\u0627\u0646 \u0634\u063A\u0644\u06CC",
        maxlength: 30,
        error: unref(form).job && unref(form).job.length > 30 ? "\u062D\u062F\u0627\u06A9\u062B\u0631 \u06F3\u06F0 \u06A9\u0627\u0631\u0627\u06A9\u062A\u0631 \u0645\u062C\u0627\u0632 \u0627\u0633\u062A" : ""
      }, null, _parent));
      _push(` `);
      _push(ssrRenderComponent(_sfc_main$1S, {
        label: "\u0634\u0631\u06A9\u062A",
        modelValue: unref(form).company,
        "onUpdate:modelValue": ($event) => unref(form).company = $event,
        placeholder: "\u0646\u0627\u0645 \u0633\u0627\u0632\u0645\u0627\u0646",
        maxlength: 30,
        error: unref(form).company && unref(form).company.length > 30 ? "\u062D\u062F\u0627\u06A9\u062B\u0631 \u06F3\u06F0 \u06A9\u0627\u0631\u0627\u06A9\u062A\u0631 \u0645\u062C\u0627\u0632 \u0627\u0633\u062A" : ""
      }, null, _parent));
      _push(`</div> <div class="grid grid-cols-1">`);
      _push(ssrRenderComponent(_sfc_main$1S, {
        label: "\u0645\u0648\u0642\u0639\u06CC\u062A \u062C\u063A\u0631\u0627\u0641\u06CC\u0627\u06CC\u06CC",
        modelValue: unref(form).location,
        "onUpdate:modelValue": ($event) => unref(form).location = $event,
        placeholder: "\u0634\u0647\u0631\u060C \u06A9\u0634\u0648\u0631",
        maxlength: 30,
        error: unref(form).location && unref(form).location.length > 30 ? "\u062D\u062F\u0627\u06A9\u062B\u0631 \u06F3\u06F0 \u06A9\u0627\u0631\u0627\u06A9\u062A\u0631 \u0645\u062C\u0627\u0632 \u0627\u0633\u062A" : ""
      }, null, _parent));
      _push(`</div></div> `);
      _push(ssrRenderComponent(_sfc_main$1R, {
        label: "\u0628\u06CC\u0648\u06AF\u0631\u0627\u0641\u06CC",
        modelValue: unref(form).bio,
        "onUpdate:modelValue": ($event) => unref(form).bio = $event,
        placeholder: "\u062F\u0631\u0628\u0627\u0631\u0647 \u062E\u0648\u062F \u062A\u0648\u0636\u06CC\u062D \u062F\u0647\u06CC\u062F... (\u062A\u0627 10 \u062E\u0637)",
        maxlength: 500,
        rows: 10,
        error: unref(form).bio && unref(form).bio.length > 500 ? "\u062D\u062F\u0627\u06A9\u062B\u0631 500 \u06A9\u0627\u0631\u0627\u06A9\u062A\u0631 \u0645\u062C\u0627\u0632 \u0627\u0633\u062A" : ""
      }, null, _parent));
      _push(` `);
      _push(ssrRenderComponent(_sfc_main$1S, {
        label: "\u0639\u0646\u0648\u0627\u0646 \u062F\u06A9\u0645\u0647 \u0630\u062E\u06CC\u0631\u0647 \u0645\u062E\u0627\u0637\u0628",
        modelValue: unref(form).saveContact,
        "onUpdate:modelValue": ($event) => unref(form).saveContact = $event,
        placeholder: "\u062F\u06A9\u0645\u0647 \u0630\u062E\u06CC\u0631\u0647 \u0645\u062E\u0627\u0637\u0628",
        maxlength: 20,
        error: unref(form).saveContact && unref(form).saveContact.length > 20 ? "\u062D\u062F\u0627\u06A9\u062B\u0631 \u06F2\u06F0 \u06A9\u0627\u0631\u0627\u06A9\u062A\u0631 \u0645\u062C\u0627\u0632 \u0627\u0633\u062A" : ""
      }, null, _parent));
      _push(` <div><h3 class="text-base font-medium text-foreground mb-3">\u0631\u0646\u06AF\u200C\u0628\u0646\u062F\u06CC \u06A9\u0627\u0631\u062A</h3> <div class="bg-card border border-border p-6 rounded-xl space-y-6"><div class="space-y-3"><h4 class="text-sm font-semibold text-foreground">\u0631\u0646\u06AF \u0627\u0635\u0644\u06CC</h4> <p class="text-xs text-muted-foreground">\u0628\u0627 \u0627\u0646\u062A\u062E\u0627\u0628 \u06CC\u06A9 \u0631\u0646\u06AF\u060C \u0647\u0645 \u067E\u0633\u200C\u0632\u0645\u06CC\u0646\u0647 \u0648 \u0647\u0645 \u0631\u0646\u06AF \u0622\u06CC\u06A9\u0648\u0646\u200C\u0647\u0627 \u062A\u0646\u0638\u06CC\u0645 \u0645\u06CC\u200C\u0634\u0648\u062F</p> `);
      _push(ssrRenderComponent(_sfc_main$1Q, null, null, _parent));
      _push(`</div> <div class="pt-4 border-t border-border/50">`);
      _push(ssrRenderComponent(_sfc_main$1P, {
        selected: unref(form).iconColor,
        matchThemeColor: unref(form).matchThemeColor,
        onUpdate: (color) => unref(form).iconColor = color,
        "onUpdate:matchTheme": (val) => unref(form).matchThemeColor = val
      }, null, _parent));
      _push(`</div></div></div> `);
      _push(ssrRenderComponent(CardNameModal, {
        isOpen: cardNameModalOpen.value,
        currentCardName: typeof unref(form).cardName === "string" ? unref(form).cardName : "",
        onClose: closeCardNameModal,
        onUpdate: updateCardName
      }, null, _parent));
      _push(`</div> `);
      _push(ssrRenderComponent(InfoToast, {
        visible: showToast.value,
        message: toastMessage.value,
        icon: toastIcon.value
      }, null, _parent));
      _push(`<!--]-->`);
    };
  }
};
const _sfc_setup$2 = _sfc_main$2.setup;
_sfc_main$2.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/UserDashboard/main/EditCard/tabs/TabAbout.vue");
  return _sfc_setup$2 ? _sfc_setup$2(props, ctx) : void 0;
};
const _sfc_main$1 = /* @__PURE__ */ defineComponent({
  __name: "LayoutSelector",
  __ssrInlineRender: true,
  props: {
    modelValue: {}
  },
  emits: ["update:modelValue", "layout-changed", "confirm"],
  setup(__props, { emit: __emit }) {
    var _a;
    const props = __props;
    const show = ref(false);
    const selected = ref((_a = props.modelValue) != null ? _a : "right");
    watch(() => props.modelValue, (v) => {
    });
    const labels = {
      right: "\u0631\u0627\u0633\u062A\u200C\u0686\u06CC\u0646",
      left: "\u0686\u067E\u200C\u0686\u06CC\u0646",
      center: "\u0648\u0633\u0637\u200C\u0686\u06CC\u0646",
      portrait: "\u067E\u0648\u0631\u062A\u0631\u06CC\u062A"
    };
    const currentLabel = computed(() => {
      var _a2;
      return labels[(_a2 = props.modelValue) != null ? _a2 : "right"] || "\u0631\u0627\u0633\u062A\u200C\u0686\u06CC\u0646";
    });
    function pick(v) {
    }
    function confirm() {
    }
    function cardClass(kind) {
      return [
        "relative w-36 h-64 rounded-2xl border border-border overflow-hidden shadow-sm transition-colors",
        selected.value === kind ? "ring-1 ring-foreground" : "hover:border-muted-foreground/60"
      ].join(" ");
    }
    function radioClass(kind) {
      return [
        "mt-1.5 inline-flex items-center justify-center w-6 h-6 rounded-full",
        selected.value === kind ? "bg-foreground text-background" : "border-2 border-muted"
      ].join(" ");
    }
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<!--[--><div class="w-full rounded-xl bg-card border border-border px-4 py-3 flex items-center justify-between hover:bg-muted transition-colors cursor-pointer"><span class="text-sm font-medium text-foreground">\u062A\u063A\u06CC\u06CC\u0631 \u0686\u06CC\u062F\u0645\u0627\u0646</span> <span class="flex items-center gap-2 text-sm text-muted-foreground">${ssrInterpolate(currentLabel.value)} <svg viewBox="0 0 24 24" class="w-5 h-5 rotate-180"><path fill="currentColor" d="M9.3 6.3a1 1 0 0 1 1.4 0l5 5a1 1 0 0 1 0 1.4l-5 5a1 1 0 0 1-1.4-1.4L13.6 12 9.3 7.7a1 1 0 0 1 0-1.4Z"></path></svg></span></div> `);
      _push(ssrRenderComponent(__nuxt_component_0, {
        modelValue: show.value,
        "onUpdate:modelValue": ($event) => show.value = $event,
        size: "auto",
        closable: true,
        role: "dialog",
        "aria-modal": "true",
        title: "\u0686\u06CC\u062F\u0645\u0627\u0646"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="px-6"${_scopeId}><div class="md:hidden"${_scopeId}><div class="flex gap-8 overflow-x-auto px-6 pb-6 pt-6 snap-x snap-mandatory" role="radiogroup" aria-label="\u06AF\u0632\u06CC\u0646\u0647\u200C\u0647\u0627\u06CC \u0686\u06CC\u062F\u0645\u0627\u0646"${_scopeId}><button${ssrRenderAttr("aria-checked", selected.value === "right")} role="radio" class="flex flex-col items-center flex-shrink-0 snap-start focus:outline-none"${_scopeId}><div class="${ssrRenderClass(cardClass("right"))}"${_scopeId}><div class="w-full h-full bg-card flex flex-col"${_scopeId}><div class="relative w-full h-24 bg-muted border-b border-border/40"${_scopeId}><div class="absolute -bottom-6 right-3"${_scopeId}><div class="w-14 h-14 rounded-full bg-card border border-border flex items-center justify-center shadow-sm"${_scopeId}><i class="ti ti-user text-xl text-muted-foreground"${_scopeId}></i></div> <div class="absolute -bottom-1 -left-2 w-7 h-7 rounded-full bg-muted border border-border"${_scopeId}></div></div></div> <div class="px-3 pt-8 pb-3"${_scopeId}><div class="flex flex-col items-end gap-2 mb-4"${_scopeId}><div class="w-24 h-2.5 bg-muted/40 rounded"${_scopeId}></div> <div class="w-16 h-2 bg-muted rounded"${_scopeId}></div></div> <div class="w-full h-6 bg-muted/40 rounded mb-4"${_scopeId}></div></div> <div class="grid grid-cols-3 gap-2 px-3 pb-3 mt-auto"${_scopeId}><div class="space-y-1"${_scopeId}><div class="aspect-square bg-muted rounded-lg"${_scopeId}></div><div class="h-1 bg-muted rounded"${_scopeId}></div></div> <div class="space-y-1"${_scopeId}><div class="aspect-square bg-muted rounded-lg"${_scopeId}></div><div class="h-1 bg-muted rounded"${_scopeId}></div></div> <div class="space-y-1"${_scopeId}><div class="aspect-square bg-muted rounded-lg"${_scopeId}></div><div class="h-1 bg-muted rounded"${_scopeId}></div></div></div></div></div> <p class="text-xs mt-2 text-foreground"${_scopeId}>\u0631\u0627\u0633\u062A\u200C\u0686\u06CC\u0646</p> <span class="${ssrRenderClass(radioClass("right"))}"${_scopeId}>`);
            if (selected.value === "right") {
              _push2(`<svg viewBox="0 0 24 24" class="w-4 h-4"${_scopeId}><path fill="currentColor" d="M9 16.17 4.83 12 3.4 13.41 9 19 21 7 19.59 5.59z"${_scopeId}></path></svg>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</span></button> <button${ssrRenderAttr("aria-checked", selected.value === "left")} role="radio" class="flex flex-col items-center flex-shrink-0 snap-start focus:outline-none"${_scopeId}><div class="${ssrRenderClass(cardClass("left"))}"${_scopeId}><div class="w-full h-full bg-card flex flex-col"${_scopeId}><div class="relative w-full h-24 bg-muted border-b border-border/40"${_scopeId}><div class="absolute -bottom-6 left-3"${_scopeId}><div class="w-14 h-14 rounded-full bg-card border border-border flex items-center justify-center shadow-sm"${_scopeId}><i class="ti ti-user text-xl text-muted-foreground"${_scopeId}></i></div> <div class="absolute -bottom-1 -right-2 w-7 h-7 rounded-full bg-muted border border-border"${_scopeId}></div></div></div> <div class="px-3 pt-8 pb-3"${_scopeId}><div class="flex flex-col items-start gap-2 mb-4"${_scopeId}><div class="w-24 h-2.5 bg-muted/40 rounded"${_scopeId}></div> <div class="w-16 h-2 bg-muted rounded"${_scopeId}></div></div> <div class="w-full h-6 bg-muted/40 rounded mb-4"${_scopeId}></div></div> <div class="grid grid-cols-3 gap-2 px-3 pb-3 mt-auto"${_scopeId}><div class="space-y-1"${_scopeId}><div class="aspect-square bg-muted rounded-lg"${_scopeId}></div><div class="h-1 bg-muted rounded"${_scopeId}></div></div> <div class="space-y-1"${_scopeId}><div class="aspect-square bg-muted rounded-lg"${_scopeId}></div><div class="h-1 bg-muted rounded"${_scopeId}></div></div> <div class="space-y-1"${_scopeId}><div class="aspect-square bg-muted rounded-lg"${_scopeId}></div><div class="h-1 bg-muted rounded"${_scopeId}></div></div></div></div></div> <p class="text-xs mt-2 text-foreground"${_scopeId}>\u0686\u067E\u200C\u0686\u06CC\u0646</p> <span class="${ssrRenderClass(radioClass("left"))}"${_scopeId}>`);
            if (selected.value === "left") {
              _push2(`<svg viewBox="0 0 24 24" class="w-4 h-4"${_scopeId}><path fill="currentColor" d="M9 16.17 4.83 12 3.4 13.41 9 19 21 7 19.59 5.59z"${_scopeId}></path></svg>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</span></button> <button${ssrRenderAttr("aria-checked", selected.value === "center")} role="radio" class="flex flex-col items-center flex-shrink-0 snap-start focus:outline-none"${_scopeId}><div class="${ssrRenderClass(cardClass("center"))}"${_scopeId}><div class="w-full h-full bg-card flex flex-col"${_scopeId}><div class="relative w-full h-24 bg-muted border-b border-border/40"${_scopeId}><div class="absolute -bottom-6 left-1/2 -translate-x-1/2"${_scopeId}><div class="w-14 h-14 rounded-full bg-card border border-border flex items-center justify-center shadow-sm"${_scopeId}><i class="ti ti-user text-xl text-muted-foreground"${_scopeId}></i></div> <div class="absolute -bottom-1 -right-2 w-7 h-7 rounded-full bg-muted border border-border"${_scopeId}></div></div></div> <div class="px-3 pt-8 pb-3"${_scopeId}><div class="flex flex-col items-center gap-2 mb-4"${_scopeId}><div class="w-24 h-2.5 bg-muted/40 rounded"${_scopeId}></div> <div class="w-16 h-2 bg-muted rounded"${_scopeId}></div></div> <div class="w-full h-6 bg-muted/40 rounded mb-4"${_scopeId}></div></div> <div class="grid grid-cols-3 gap-2 px-3 pb-3 mt-auto"${_scopeId}><div class="space-y-1"${_scopeId}><div class="aspect-square bg-muted rounded-lg"${_scopeId}></div><div class="h-1 bg-muted rounded"${_scopeId}></div></div> <div class="space-y-1"${_scopeId}><div class="aspect-square bg-muted rounded-lg"${_scopeId}></div><div class="h-1 bg-muted rounded"${_scopeId}></div></div> <div class="space-y-1"${_scopeId}><div class="aspect-square bg-muted rounded-lg"${_scopeId}></div><div class="h-1 bg-muted rounded"${_scopeId}></div></div></div></div></div> <p class="text-xs mt-2 text-foreground"${_scopeId}>\u0648\u0633\u0637\u200C\u0686\u06CC\u0646</p> <span class="${ssrRenderClass(radioClass("center"))}"${_scopeId}>`);
            if (selected.value === "center") {
              _push2(`<svg viewBox="0 0 24 24" class="w-4 h-4"${_scopeId}><path fill="currentColor" d="M9 16.17 4.83 12 3.4 13.41 9 19 21 7 19.59 5.59z"${_scopeId}></path></svg>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</span></button> <button${ssrRenderAttr("aria-checked", selected.value === "portrait")} role="radio" class="flex flex-col items-center flex-shrink-0 snap-start focus:outline-none"${_scopeId}><div class="${ssrRenderClass(cardClass("portrait"))}"${_scopeId}><div class="w-full h-full bg-card flex flex-col"${_scopeId}><div class="relative w-full h-20 bg-gradient-to-b from-muted to-card/90"${_scopeId}><div class="absolute bottom-2 right-2"${_scopeId}><div class="w-8 h-8 rounded-full bg-card border border-border flex items-center justify-center"${_scopeId}><i class="ti ti-user text-xs text-muted-foreground"${_scopeId}></i></div></div></div> <div class="px-3 pt-4 pb-3"${_scopeId}><div class="space-y-2 mb-4 text-center"${_scopeId}><div class="mx-auto w-20 h-2.5 bg-muted/40 rounded"${_scopeId}></div> <div class="mx-auto w-16 h-2 bg-muted rounded"${_scopeId}></div></div> <div class="w-full h-6 bg-muted/40 rounded mb-4"${_scopeId}></div> <div class="space-y-2"${_scopeId}><div class="flex items-center gap-2"${_scopeId}><div class="w-5 h-5 bg-muted rounded"${_scopeId}></div> <div class="flex-1"${_scopeId}><div class="w-20 h-1.5 bg-muted rounded mb-1"${_scopeId}></div> <div class="w-16 h-1.5 bg-muted rounded"${_scopeId}></div></div></div> <div class="flex items-center gap-2"${_scopeId}><div class="w-5 h-5 bg-muted rounded"${_scopeId}></div> <div class="flex-1"${_scopeId}><div class="w-18 h-1.5 bg-muted rounded mb-1"${_scopeId}></div> <div class="w-14 h-1.5 bg-muted rounded"${_scopeId}></div></div></div> <div class="flex items-center gap-2"${_scopeId}><div class="w-5 h-5 bg-muted rounded"${_scopeId}></div> <div class="flex-1"${_scopeId}><div class="w-16 h-1.5 bg-muted rounded mb-1"${_scopeId}></div> <div class="w-18 h-1.5 bg-muted rounded"${_scopeId}></div></div></div></div></div></div></div> <p class="text-xs mt-2 text-foreground"${_scopeId}>\u067E\u0648\u0631\u062A\u0631\u06CC\u062A</p> <span class="${ssrRenderClass(radioClass("portrait"))}"${_scopeId}>`);
            if (selected.value === "portrait") {
              _push2(`<svg viewBox="0 0 24 24" class="w-4 h-4"${_scopeId}><path fill="currentColor" d="M9 16.17 4.83 12 3.4 13.41 9 19 21 7 19.59 5.59z"${_scopeId}></path></svg>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</span></button></div></div> <div class="hidden md:block px-6 pb-6 pt-6"${_scopeId}><div class="grid grid-cols-2 lg:grid-cols-4 gap-12 max-w-6xl mx-auto" role="radiogroup" aria-label="\u06AF\u0632\u06CC\u0646\u0647\u200C\u0647\u0627\u06CC \u0686\u06CC\u062F\u0645\u0627\u0646"${_scopeId}><button${ssrRenderAttr("aria-checked", selected.value === "right")} role="radio" class="flex flex-col items-center focus:outline-none"${_scopeId}><div class="${ssrRenderClass(cardClass("right"))}"${_scopeId}><div class="w-full h-full bg-card flex flex-col"${_scopeId}><div class="relative w-full h-24 bg-muted border-b border-border/40"${_scopeId}><div class="absolute -bottom-6 right-3"${_scopeId}><div class="w-14 h-14 rounded-full bg-card border border-border flex items-center justify-center shadow-sm"${_scopeId}><i class="ti ti-user text-xl text-muted-foreground"${_scopeId}></i></div> <div class="absolute -bottom-1 -left-2 w-7 h-7 rounded-full bg-muted border border-border"${_scopeId}></div></div></div> <div class="px-3 pt-8 pb-3"${_scopeId}><div class="flex flex-col items-end gap-2 mb-4"${_scopeId}><div class="w-24 h-2.5 bg-muted/40 rounded"${_scopeId}></div> <div class="w-16 h-2 bg-muted rounded"${_scopeId}></div> <div class="w-28 h-2 bg-muted rounded"${_scopeId}></div></div> <div class="w-full h-8 bg-muted/40 rounded-full mb-4"${_scopeId}></div></div> <div class="grid grid-cols-3 gap-2 px-3 pb-3 mt-auto"${_scopeId}><div class="space-y-1"${_scopeId}><div class="aspect-square bg-muted rounded-lg"${_scopeId}></div><div class="h-1 bg-muted rounded"${_scopeId}></div></div> <div class="space-y-1"${_scopeId}><div class="aspect-square bg-muted rounded-lg"${_scopeId}></div><div class="h-1 bg-muted rounded"${_scopeId}></div></div> <div class="space-y-1"${_scopeId}><div class="aspect-square bg-muted rounded-lg"${_scopeId}></div><div class="h-1 bg-muted rounded"${_scopeId}></div></div></div></div></div> <p class="text-sm mt-3 text-foreground font-medium"${_scopeId}>\u0631\u0627\u0633\u062A\u200C\u0686\u06CC\u0646</p> <span class="${ssrRenderClass(radioClass("right"))}"${_scopeId}>`);
            if (selected.value === "right") {
              _push2(`<svg viewBox="0 0 24 24" class="w-4 h-4"${_scopeId}><path fill="currentColor" d="M9 16.17 4.83 12 3.4 13.41 9 19 21 7 19.59 5.59z"${_scopeId}></path></svg>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</span></button> <button${ssrRenderAttr("aria-checked", selected.value === "left")} role="radio" class="flex flex-col items-center focus:outline-none"${_scopeId}><div class="${ssrRenderClass(cardClass("left"))}"${_scopeId}><div class="w-full h-full bg-card flex flex-col"${_scopeId}><div class="relative w-full h-24 bg-muted border-b border-border/40"${_scopeId}><div class="absolute -bottom-6 left-3"${_scopeId}><div class="w-14 h-14 rounded-full bg-card border border-border flex items-center justify-center shadow-sm"${_scopeId}><i class="ti ti-user text-xl text-muted-foreground"${_scopeId}></i></div> <div class="absolute -bottom-1 -right-2 w-7 h-7 rounded-full bg-muted border border-border"${_scopeId}></div></div></div> <div class="px-3 pt-8 pb-3"${_scopeId}><div class="flex flex-col items-start gap-2 mb-4"${_scopeId}><div class="w-24 h-2.5 bg-muted/40 rounded"${_scopeId}></div> <div class="w-16 h-2 bg-muted rounded"${_scopeId}></div> <div class="w-28 h-2 bg-muted rounded"${_scopeId}></div></div> <div class="w-full h-8 bg-muted/40 rounded-full mb-4"${_scopeId}></div></div> <div class="px-3 pb-3 mt-auto space-y-3"${_scopeId}><div class="flex items-center gap-2"${_scopeId}><div class="w-5 h-5 bg-muted rounded"${_scopeId}></div> <div class="w-24 h-1.5 bg-muted rounded"${_scopeId}></div></div> <div class="flex items-center gap-2"${_scopeId}><div class="w-5 h-5 bg-muted rounded"${_scopeId}></div> <div class="w-20 h-1.5 bg-muted rounded"${_scopeId}></div></div></div></div></div> <p class="text-sm mt-3 text-foreground font-medium"${_scopeId}>\u0686\u067E\u200C\u0686\u06CC\u0646</p> <span class="${ssrRenderClass(radioClass("left"))}"${_scopeId}>`);
            if (selected.value === "left") {
              _push2(`<svg viewBox="0 0 24 24" class="w-4 h-4"${_scopeId}><path fill="currentColor" d="M9 16.17 4.83 12 3.4 13.41 9 19 21 7 19.59 5.59z"${_scopeId}></path></svg>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</span></button> <button${ssrRenderAttr("aria-checked", selected.value === "center")} role="radio" class="flex flex-col items-center focus:outline-none"${_scopeId}><div class="${ssrRenderClass(cardClass("center"))}"${_scopeId}><div class="w-full h-full bg-card flex flex-col"${_scopeId}><div class="relative w-full h-24 bg-muted border-b border-border/40"${_scopeId}><div class="absolute -bottom-6 left-1/2 -translate-x-1/2"${_scopeId}><div class="w-14 h-14 rounded-full bg-card border border-border flex items-center justify-center shadow-sm"${_scopeId}><i class="ti ti-user text-xl text-muted-foreground"${_scopeId}></i></div> <div class="absolute -bottom-1 -right-2 w-7 h-7 rounded-full bg-muted border border-border"${_scopeId}></div></div></div> <div class="px-3 pt-8 pb-3"${_scopeId}><div class="flex flex-col items-center gap-2 mb-4"${_scopeId}><div class="w-24 h-2.5 bg-muted/40 rounded"${_scopeId}></div> <div class="w-16 h-2 bg-muted rounded"${_scopeId}></div> <div class="w-28 h-2 bg-muted rounded"${_scopeId}></div></div> <div class="w-full h-8 bg-muted/40 rounded-full mb-4"${_scopeId}></div></div> <div class="grid grid-cols-3 gap-2 px-3 pb-3 mt-auto"${_scopeId}><div class="space-y-1"${_scopeId}><div class="aspect-square bg-muted rounded-lg"${_scopeId}></div><div class="h-1 bg-muted rounded"${_scopeId}></div></div> <div class="space-y-1"${_scopeId}><div class="aspect-square bg-muted rounded-lg"${_scopeId}></div><div class="h-1 bg-muted rounded"${_scopeId}></div></div> <div class="space-y-1"${_scopeId}><div class="aspect-square bg-muted rounded-lg"${_scopeId}></div><div class="h-1 bg-muted rounded"${_scopeId}></div></div></div></div></div> <p class="text-sm mt-3 text-foreground font-medium"${_scopeId}>\u0648\u0633\u0637\u200C\u0686\u06CC\u0646</p> <span class="${ssrRenderClass(radioClass("center"))}"${_scopeId}>`);
            if (selected.value === "center") {
              _push2(`<svg viewBox="0 0 24 24" class="w-4 h-4"${_scopeId}><path fill="currentColor" d="M9 16.17 4.83 12 3.4 13.41 9 19 21 7 19.59 5.59z"${_scopeId}></path></svg>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</span></button> <button${ssrRenderAttr("aria-checked", selected.value === "portrait")} role="radio" class="flex flex-col items-center focus:outline-none"${_scopeId}><div class="${ssrRenderClass(cardClass("portrait"))}"${_scopeId}><div class="w-full h-full bg-card flex flex-col"${_scopeId}><div class="relative w-full h-20 bg-gradient-to-b from-muted to-card/90"${_scopeId}><div class="absolute bottom-2 right-2"${_scopeId}><div class="w-8 h-8 rounded-full bg-card border border-border flex items-center justify-center"${_scopeId}><i class="ti ti-user text-xs text-muted-foreground"${_scopeId}></i></div></div></div> <div class="px-3 pt-4 pb-3"${_scopeId}><div class="space-y-3 mb-6 text-center"${_scopeId}><div class="mx-auto w-20 h-2.5 bg-muted/40 rounded"${_scopeId}></div> <div class="mx-auto w-16 h-2 bg-muted rounded"${_scopeId}></div> <div class="mx-auto w-24 h-2 bg-muted rounded"${_scopeId}></div></div> <div class="w-full h-8 bg-muted/40 rounded-full mb-6"${_scopeId}></div> <div class="space-y-3"${_scopeId}><div class="flex items-center gap-2"${_scopeId}><div class="w-5 h-5 bg-muted rounded"${_scopeId}></div> <div class="flex-1"${_scopeId}><div class="w-20 h-1.5 bg-muted rounded mb-1"${_scopeId}></div> <div class="w-24 h-1.5 bg-muted rounded"${_scopeId}></div></div></div> <div class="flex items-center gap-2"${_scopeId}><div class="w-5 h-5 bg-muted rounded"${_scopeId}></div> <div class="flex-1"${_scopeId}><div class="w-18 h-1.5 bg-muted rounded mb-1"${_scopeId}></div> <div class="w-22 h-1.5 bg-muted rounded"${_scopeId}></div></div></div> <div class="flex items-center gap-2"${_scopeId}><div class="w-5 h-5 bg-muted rounded"${_scopeId}></div> <div class="flex-1"${_scopeId}><div class="w-16 h-1.5 bg-muted rounded mb-1"${_scopeId}></div> <div class="w-20 h-1.5 bg-muted rounded"${_scopeId}></div></div></div></div></div></div></div> <p class="text-sm mt-3 text-foreground font-medium"${_scopeId}>\u067E\u0648\u0631\u062A\u0631\u06CC\u062A</p> <span class="${ssrRenderClass(radioClass("portrait"))}"${_scopeId}>`);
            if (selected.value === "portrait") {
              _push2(`<svg viewBox="0 0 24 24" class="w-4 h-4"${_scopeId}><path fill="currentColor" d="M9 16.17 4.83 12 3.4 13.41 9 19 21 7 19.59 5.59z"${_scopeId}></path></svg>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</span></button></div></div></div> <div class="px-4 pb-4 pt-4 border-t border-border space-y-3"${_scopeId}><button class="w-full py-3 bg-foreground/80 text-background rounded-xl font-semibold hover:bg-foreground transition-colors"${_scopeId}>
        \u062A\u0627\u06CC\u06CC\u062F \u0686\u06CC\u062F\u0645\u0627\u0646
      </button></div>`);
          } else {
            return [
              createVNode("div", { class: "px-6" }, [
                createVNode("div", { class: "md:hidden" }, [
                  createVNode("div", {
                    class: "flex gap-8 overflow-x-auto px-6 pb-6 pt-6 snap-x snap-mandatory",
                    role: "radiogroup",
                    "aria-label": "\u06AF\u0632\u06CC\u0646\u0647\u200C\u0647\u0627\u06CC \u0686\u06CC\u062F\u0645\u0627\u0646"
                  }, [
                    createVNode("button", {
                      onClick: ($event) => pick(),
                      "aria-checked": selected.value === "right",
                      role: "radio",
                      class: "flex flex-col items-center flex-shrink-0 snap-start focus:outline-none"
                    }, [
                      createVNode("div", {
                        class: cardClass("right")
                      }, [
                        createVNode("div", { class: "w-full h-full bg-card flex flex-col" }, [
                          createVNode("div", { class: "relative w-full h-24 bg-muted border-b border-border/40" }, [
                            createVNode("div", { class: "absolute -bottom-6 right-3" }, [
                              createVNode("div", { class: "w-14 h-14 rounded-full bg-card border border-border flex items-center justify-center shadow-sm" }, [
                                createVNode("i", { class: "ti ti-user text-xl text-muted-foreground" })
                              ]),
                              createTextVNode(),
                              createVNode("div", { class: "absolute -bottom-1 -left-2 w-7 h-7 rounded-full bg-muted border border-border" })
                            ])
                          ]),
                          createTextVNode(),
                          createVNode("div", { class: "px-3 pt-8 pb-3" }, [
                            createVNode("div", { class: "flex flex-col items-end gap-2 mb-4" }, [
                              createVNode("div", { class: "w-24 h-2.5 bg-muted/40 rounded" }),
                              createTextVNode(),
                              createVNode("div", { class: "w-16 h-2 bg-muted rounded" })
                            ]),
                            createTextVNode(),
                            createVNode("div", { class: "w-full h-6 bg-muted/40 rounded mb-4" })
                          ]),
                          createTextVNode(),
                          createVNode("div", { class: "grid grid-cols-3 gap-2 px-3 pb-3 mt-auto" }, [
                            createVNode("div", { class: "space-y-1" }, [
                              createVNode("div", { class: "aspect-square bg-muted rounded-lg" }),
                              createVNode("div", { class: "h-1 bg-muted rounded" })
                            ]),
                            createTextVNode(),
                            createVNode("div", { class: "space-y-1" }, [
                              createVNode("div", { class: "aspect-square bg-muted rounded-lg" }),
                              createVNode("div", { class: "h-1 bg-muted rounded" })
                            ]),
                            createTextVNode(),
                            createVNode("div", { class: "space-y-1" }, [
                              createVNode("div", { class: "aspect-square bg-muted rounded-lg" }),
                              createVNode("div", { class: "h-1 bg-muted rounded" })
                            ])
                          ])
                        ])
                      ], 2),
                      createTextVNode(),
                      createVNode("p", { class: "text-xs mt-2 text-foreground" }, "\u0631\u0627\u0633\u062A\u200C\u0686\u06CC\u0646"),
                      createTextVNode(),
                      createVNode("span", {
                        class: radioClass("right")
                      }, [
                        selected.value === "right" ? (openBlock(), createBlock("svg", {
                          key: 0,
                          viewBox: "0 0 24 24",
                          class: "w-4 h-4"
                        }, [
                          createVNode("path", {
                            fill: "currentColor",
                            d: "M9 16.17 4.83 12 3.4 13.41 9 19 21 7 19.59 5.59z"
                          })
                        ])) : createCommentVNode("", true)
                      ], 2)
                    ], 8, ["onClick", "aria-checked"]),
                    createTextVNode(),
                    createVNode("button", {
                      onClick: ($event) => pick(),
                      "aria-checked": selected.value === "left",
                      role: "radio",
                      class: "flex flex-col items-center flex-shrink-0 snap-start focus:outline-none"
                    }, [
                      createVNode("div", {
                        class: cardClass("left")
                      }, [
                        createVNode("div", { class: "w-full h-full bg-card flex flex-col" }, [
                          createVNode("div", { class: "relative w-full h-24 bg-muted border-b border-border/40" }, [
                            createVNode("div", { class: "absolute -bottom-6 left-3" }, [
                              createVNode("div", { class: "w-14 h-14 rounded-full bg-card border border-border flex items-center justify-center shadow-sm" }, [
                                createVNode("i", { class: "ti ti-user text-xl text-muted-foreground" })
                              ]),
                              createTextVNode(),
                              createVNode("div", { class: "absolute -bottom-1 -right-2 w-7 h-7 rounded-full bg-muted border border-border" })
                            ])
                          ]),
                          createTextVNode(),
                          createVNode("div", { class: "px-3 pt-8 pb-3" }, [
                            createVNode("div", { class: "flex flex-col items-start gap-2 mb-4" }, [
                              createVNode("div", { class: "w-24 h-2.5 bg-muted/40 rounded" }),
                              createTextVNode(),
                              createVNode("div", { class: "w-16 h-2 bg-muted rounded" })
                            ]),
                            createTextVNode(),
                            createVNode("div", { class: "w-full h-6 bg-muted/40 rounded mb-4" })
                          ]),
                          createTextVNode(),
                          createVNode("div", { class: "grid grid-cols-3 gap-2 px-3 pb-3 mt-auto" }, [
                            createVNode("div", { class: "space-y-1" }, [
                              createVNode("div", { class: "aspect-square bg-muted rounded-lg" }),
                              createVNode("div", { class: "h-1 bg-muted rounded" })
                            ]),
                            createTextVNode(),
                            createVNode("div", { class: "space-y-1" }, [
                              createVNode("div", { class: "aspect-square bg-muted rounded-lg" }),
                              createVNode("div", { class: "h-1 bg-muted rounded" })
                            ]),
                            createTextVNode(),
                            createVNode("div", { class: "space-y-1" }, [
                              createVNode("div", { class: "aspect-square bg-muted rounded-lg" }),
                              createVNode("div", { class: "h-1 bg-muted rounded" })
                            ])
                          ])
                        ])
                      ], 2),
                      createTextVNode(),
                      createVNode("p", { class: "text-xs mt-2 text-foreground" }, "\u0686\u067E\u200C\u0686\u06CC\u0646"),
                      createTextVNode(),
                      createVNode("span", {
                        class: radioClass("left")
                      }, [
                        selected.value === "left" ? (openBlock(), createBlock("svg", {
                          key: 0,
                          viewBox: "0 0 24 24",
                          class: "w-4 h-4"
                        }, [
                          createVNode("path", {
                            fill: "currentColor",
                            d: "M9 16.17 4.83 12 3.4 13.41 9 19 21 7 19.59 5.59z"
                          })
                        ])) : createCommentVNode("", true)
                      ], 2)
                    ], 8, ["onClick", "aria-checked"]),
                    createTextVNode(),
                    createVNode("button", {
                      onClick: ($event) => pick(),
                      "aria-checked": selected.value === "center",
                      role: "radio",
                      class: "flex flex-col items-center flex-shrink-0 snap-start focus:outline-none"
                    }, [
                      createVNode("div", {
                        class: cardClass("center")
                      }, [
                        createVNode("div", { class: "w-full h-full bg-card flex flex-col" }, [
                          createVNode("div", { class: "relative w-full h-24 bg-muted border-b border-border/40" }, [
                            createVNode("div", { class: "absolute -bottom-6 left-1/2 -translate-x-1/2" }, [
                              createVNode("div", { class: "w-14 h-14 rounded-full bg-card border border-border flex items-center justify-center shadow-sm" }, [
                                createVNode("i", { class: "ti ti-user text-xl text-muted-foreground" })
                              ]),
                              createTextVNode(),
                              createVNode("div", { class: "absolute -bottom-1 -right-2 w-7 h-7 rounded-full bg-muted border border-border" })
                            ])
                          ]),
                          createTextVNode(),
                          createVNode("div", { class: "px-3 pt-8 pb-3" }, [
                            createVNode("div", { class: "flex flex-col items-center gap-2 mb-4" }, [
                              createVNode("div", { class: "w-24 h-2.5 bg-muted/40 rounded" }),
                              createTextVNode(),
                              createVNode("div", { class: "w-16 h-2 bg-muted rounded" })
                            ]),
                            createTextVNode(),
                            createVNode("div", { class: "w-full h-6 bg-muted/40 rounded mb-4" })
                          ]),
                          createTextVNode(),
                          createVNode("div", { class: "grid grid-cols-3 gap-2 px-3 pb-3 mt-auto" }, [
                            createVNode("div", { class: "space-y-1" }, [
                              createVNode("div", { class: "aspect-square bg-muted rounded-lg" }),
                              createVNode("div", { class: "h-1 bg-muted rounded" })
                            ]),
                            createTextVNode(),
                            createVNode("div", { class: "space-y-1" }, [
                              createVNode("div", { class: "aspect-square bg-muted rounded-lg" }),
                              createVNode("div", { class: "h-1 bg-muted rounded" })
                            ]),
                            createTextVNode(),
                            createVNode("div", { class: "space-y-1" }, [
                              createVNode("div", { class: "aspect-square bg-muted rounded-lg" }),
                              createVNode("div", { class: "h-1 bg-muted rounded" })
                            ])
                          ])
                        ])
                      ], 2),
                      createTextVNode(),
                      createVNode("p", { class: "text-xs mt-2 text-foreground" }, "\u0648\u0633\u0637\u200C\u0686\u06CC\u0646"),
                      createTextVNode(),
                      createVNode("span", {
                        class: radioClass("center")
                      }, [
                        selected.value === "center" ? (openBlock(), createBlock("svg", {
                          key: 0,
                          viewBox: "0 0 24 24",
                          class: "w-4 h-4"
                        }, [
                          createVNode("path", {
                            fill: "currentColor",
                            d: "M9 16.17 4.83 12 3.4 13.41 9 19 21 7 19.59 5.59z"
                          })
                        ])) : createCommentVNode("", true)
                      ], 2)
                    ], 8, ["onClick", "aria-checked"]),
                    createTextVNode(),
                    createVNode("button", {
                      onClick: ($event) => pick(),
                      "aria-checked": selected.value === "portrait",
                      role: "radio",
                      class: "flex flex-col items-center flex-shrink-0 snap-start focus:outline-none"
                    }, [
                      createVNode("div", {
                        class: cardClass("portrait")
                      }, [
                        createVNode("div", { class: "w-full h-full bg-card flex flex-col" }, [
                          createVNode("div", { class: "relative w-full h-20 bg-gradient-to-b from-muted to-card/90" }, [
                            createVNode("div", { class: "absolute bottom-2 right-2" }, [
                              createVNode("div", { class: "w-8 h-8 rounded-full bg-card border border-border flex items-center justify-center" }, [
                                createVNode("i", { class: "ti ti-user text-xs text-muted-foreground" })
                              ])
                            ])
                          ]),
                          createTextVNode(),
                          createVNode("div", { class: "px-3 pt-4 pb-3" }, [
                            createVNode("div", { class: "space-y-2 mb-4 text-center" }, [
                              createVNode("div", { class: "mx-auto w-20 h-2.5 bg-muted/40 rounded" }),
                              createTextVNode(),
                              createVNode("div", { class: "mx-auto w-16 h-2 bg-muted rounded" })
                            ]),
                            createTextVNode(),
                            createVNode("div", { class: "w-full h-6 bg-muted/40 rounded mb-4" }),
                            createTextVNode(),
                            createVNode("div", { class: "space-y-2" }, [
                              createVNode("div", { class: "flex items-center gap-2" }, [
                                createVNode("div", { class: "w-5 h-5 bg-muted rounded" }),
                                createTextVNode(),
                                createVNode("div", { class: "flex-1" }, [
                                  createVNode("div", { class: "w-20 h-1.5 bg-muted rounded mb-1" }),
                                  createTextVNode(),
                                  createVNode("div", { class: "w-16 h-1.5 bg-muted rounded" })
                                ])
                              ]),
                              createTextVNode(),
                              createVNode("div", { class: "flex items-center gap-2" }, [
                                createVNode("div", { class: "w-5 h-5 bg-muted rounded" }),
                                createTextVNode(),
                                createVNode("div", { class: "flex-1" }, [
                                  createVNode("div", { class: "w-18 h-1.5 bg-muted rounded mb-1" }),
                                  createTextVNode(),
                                  createVNode("div", { class: "w-14 h-1.5 bg-muted rounded" })
                                ])
                              ]),
                              createTextVNode(),
                              createVNode("div", { class: "flex items-center gap-2" }, [
                                createVNode("div", { class: "w-5 h-5 bg-muted rounded" }),
                                createTextVNode(),
                                createVNode("div", { class: "flex-1" }, [
                                  createVNode("div", { class: "w-16 h-1.5 bg-muted rounded mb-1" }),
                                  createTextVNode(),
                                  createVNode("div", { class: "w-18 h-1.5 bg-muted rounded" })
                                ])
                              ])
                            ])
                          ])
                        ])
                      ], 2),
                      createTextVNode(),
                      createVNode("p", { class: "text-xs mt-2 text-foreground" }, "\u067E\u0648\u0631\u062A\u0631\u06CC\u062A"),
                      createTextVNode(),
                      createVNode("span", {
                        class: radioClass("portrait")
                      }, [
                        selected.value === "portrait" ? (openBlock(), createBlock("svg", {
                          key: 0,
                          viewBox: "0 0 24 24",
                          class: "w-4 h-4"
                        }, [
                          createVNode("path", {
                            fill: "currentColor",
                            d: "M9 16.17 4.83 12 3.4 13.41 9 19 21 7 19.59 5.59z"
                          })
                        ])) : createCommentVNode("", true)
                      ], 2)
                    ], 8, ["onClick", "aria-checked"])
                  ])
                ]),
                createTextVNode(),
                createVNode("div", { class: "hidden md:block px-6 pb-6 pt-6" }, [
                  createVNode("div", {
                    class: "grid grid-cols-2 lg:grid-cols-4 gap-12 max-w-6xl mx-auto",
                    role: "radiogroup",
                    "aria-label": "\u06AF\u0632\u06CC\u0646\u0647\u200C\u0647\u0627\u06CC \u0686\u06CC\u062F\u0645\u0627\u0646"
                  }, [
                    createVNode("button", {
                      onClick: ($event) => pick(),
                      "aria-checked": selected.value === "right",
                      role: "radio",
                      class: "flex flex-col items-center focus:outline-none"
                    }, [
                      createVNode("div", {
                        class: cardClass("right")
                      }, [
                        createVNode("div", { class: "w-full h-full bg-card flex flex-col" }, [
                          createVNode("div", { class: "relative w-full h-24 bg-muted border-b border-border/40" }, [
                            createVNode("div", { class: "absolute -bottom-6 right-3" }, [
                              createVNode("div", { class: "w-14 h-14 rounded-full bg-card border border-border flex items-center justify-center shadow-sm" }, [
                                createVNode("i", { class: "ti ti-user text-xl text-muted-foreground" })
                              ]),
                              createTextVNode(),
                              createVNode("div", { class: "absolute -bottom-1 -left-2 w-7 h-7 rounded-full bg-muted border border-border" })
                            ])
                          ]),
                          createTextVNode(),
                          createVNode("div", { class: "px-3 pt-8 pb-3" }, [
                            createVNode("div", { class: "flex flex-col items-end gap-2 mb-4" }, [
                              createVNode("div", { class: "w-24 h-2.5 bg-muted/40 rounded" }),
                              createTextVNode(),
                              createVNode("div", { class: "w-16 h-2 bg-muted rounded" }),
                              createTextVNode(),
                              createVNode("div", { class: "w-28 h-2 bg-muted rounded" })
                            ]),
                            createTextVNode(),
                            createVNode("div", { class: "w-full h-8 bg-muted/40 rounded-full mb-4" })
                          ]),
                          createTextVNode(),
                          createVNode("div", { class: "grid grid-cols-3 gap-2 px-3 pb-3 mt-auto" }, [
                            createVNode("div", { class: "space-y-1" }, [
                              createVNode("div", { class: "aspect-square bg-muted rounded-lg" }),
                              createVNode("div", { class: "h-1 bg-muted rounded" })
                            ]),
                            createTextVNode(),
                            createVNode("div", { class: "space-y-1" }, [
                              createVNode("div", { class: "aspect-square bg-muted rounded-lg" }),
                              createVNode("div", { class: "h-1 bg-muted rounded" })
                            ]),
                            createTextVNode(),
                            createVNode("div", { class: "space-y-1" }, [
                              createVNode("div", { class: "aspect-square bg-muted rounded-lg" }),
                              createVNode("div", { class: "h-1 bg-muted rounded" })
                            ])
                          ])
                        ])
                      ], 2),
                      createTextVNode(),
                      createVNode("p", { class: "text-sm mt-3 text-foreground font-medium" }, "\u0631\u0627\u0633\u062A\u200C\u0686\u06CC\u0646"),
                      createTextVNode(),
                      createVNode("span", {
                        class: radioClass("right")
                      }, [
                        selected.value === "right" ? (openBlock(), createBlock("svg", {
                          key: 0,
                          viewBox: "0 0 24 24",
                          class: "w-4 h-4"
                        }, [
                          createVNode("path", {
                            fill: "currentColor",
                            d: "M9 16.17 4.83 12 3.4 13.41 9 19 21 7 19.59 5.59z"
                          })
                        ])) : createCommentVNode("", true)
                      ], 2)
                    ], 8, ["onClick", "aria-checked"]),
                    createTextVNode(),
                    createVNode("button", {
                      onClick: ($event) => pick(),
                      "aria-checked": selected.value === "left",
                      role: "radio",
                      class: "flex flex-col items-center focus:outline-none"
                    }, [
                      createVNode("div", {
                        class: cardClass("left")
                      }, [
                        createVNode("div", { class: "w-full h-full bg-card flex flex-col" }, [
                          createVNode("div", { class: "relative w-full h-24 bg-muted border-b border-border/40" }, [
                            createVNode("div", { class: "absolute -bottom-6 left-3" }, [
                              createVNode("div", { class: "w-14 h-14 rounded-full bg-card border border-border flex items-center justify-center shadow-sm" }, [
                                createVNode("i", { class: "ti ti-user text-xl text-muted-foreground" })
                              ]),
                              createTextVNode(),
                              createVNode("div", { class: "absolute -bottom-1 -right-2 w-7 h-7 rounded-full bg-muted border border-border" })
                            ])
                          ]),
                          createTextVNode(),
                          createVNode("div", { class: "px-3 pt-8 pb-3" }, [
                            createVNode("div", { class: "flex flex-col items-start gap-2 mb-4" }, [
                              createVNode("div", { class: "w-24 h-2.5 bg-muted/40 rounded" }),
                              createTextVNode(),
                              createVNode("div", { class: "w-16 h-2 bg-muted rounded" }),
                              createTextVNode(),
                              createVNode("div", { class: "w-28 h-2 bg-muted rounded" })
                            ]),
                            createTextVNode(),
                            createVNode("div", { class: "w-full h-8 bg-muted/40 rounded-full mb-4" })
                          ]),
                          createTextVNode(),
                          createVNode("div", { class: "px-3 pb-3 mt-auto space-y-3" }, [
                            createVNode("div", { class: "flex items-center gap-2" }, [
                              createVNode("div", { class: "w-5 h-5 bg-muted rounded" }),
                              createTextVNode(),
                              createVNode("div", { class: "w-24 h-1.5 bg-muted rounded" })
                            ]),
                            createTextVNode(),
                            createVNode("div", { class: "flex items-center gap-2" }, [
                              createVNode("div", { class: "w-5 h-5 bg-muted rounded" }),
                              createTextVNode(),
                              createVNode("div", { class: "w-20 h-1.5 bg-muted rounded" })
                            ])
                          ])
                        ])
                      ], 2),
                      createTextVNode(),
                      createVNode("p", { class: "text-sm mt-3 text-foreground font-medium" }, "\u0686\u067E\u200C\u0686\u06CC\u0646"),
                      createTextVNode(),
                      createVNode("span", {
                        class: radioClass("left")
                      }, [
                        selected.value === "left" ? (openBlock(), createBlock("svg", {
                          key: 0,
                          viewBox: "0 0 24 24",
                          class: "w-4 h-4"
                        }, [
                          createVNode("path", {
                            fill: "currentColor",
                            d: "M9 16.17 4.83 12 3.4 13.41 9 19 21 7 19.59 5.59z"
                          })
                        ])) : createCommentVNode("", true)
                      ], 2)
                    ], 8, ["onClick", "aria-checked"]),
                    createTextVNode(),
                    createVNode("button", {
                      onClick: ($event) => pick(),
                      "aria-checked": selected.value === "center",
                      role: "radio",
                      class: "flex flex-col items-center focus:outline-none"
                    }, [
                      createVNode("div", {
                        class: cardClass("center")
                      }, [
                        createVNode("div", { class: "w-full h-full bg-card flex flex-col" }, [
                          createVNode("div", { class: "relative w-full h-24 bg-muted border-b border-border/40" }, [
                            createVNode("div", { class: "absolute -bottom-6 left-1/2 -translate-x-1/2" }, [
                              createVNode("div", { class: "w-14 h-14 rounded-full bg-card border border-border flex items-center justify-center shadow-sm" }, [
                                createVNode("i", { class: "ti ti-user text-xl text-muted-foreground" })
                              ]),
                              createTextVNode(),
                              createVNode("div", { class: "absolute -bottom-1 -right-2 w-7 h-7 rounded-full bg-muted border border-border" })
                            ])
                          ]),
                          createTextVNode(),
                          createVNode("div", { class: "px-3 pt-8 pb-3" }, [
                            createVNode("div", { class: "flex flex-col items-center gap-2 mb-4" }, [
                              createVNode("div", { class: "w-24 h-2.5 bg-muted/40 rounded" }),
                              createTextVNode(),
                              createVNode("div", { class: "w-16 h-2 bg-muted rounded" }),
                              createTextVNode(),
                              createVNode("div", { class: "w-28 h-2 bg-muted rounded" })
                            ]),
                            createTextVNode(),
                            createVNode("div", { class: "w-full h-8 bg-muted/40 rounded-full mb-4" })
                          ]),
                          createTextVNode(),
                          createVNode("div", { class: "grid grid-cols-3 gap-2 px-3 pb-3 mt-auto" }, [
                            createVNode("div", { class: "space-y-1" }, [
                              createVNode("div", { class: "aspect-square bg-muted rounded-lg" }),
                              createVNode("div", { class: "h-1 bg-muted rounded" })
                            ]),
                            createTextVNode(),
                            createVNode("div", { class: "space-y-1" }, [
                              createVNode("div", { class: "aspect-square bg-muted rounded-lg" }),
                              createVNode("div", { class: "h-1 bg-muted rounded" })
                            ]),
                            createTextVNode(),
                            createVNode("div", { class: "space-y-1" }, [
                              createVNode("div", { class: "aspect-square bg-muted rounded-lg" }),
                              createVNode("div", { class: "h-1 bg-muted rounded" })
                            ])
                          ])
                        ])
                      ], 2),
                      createTextVNode(),
                      createVNode("p", { class: "text-sm mt-3 text-foreground font-medium" }, "\u0648\u0633\u0637\u200C\u0686\u06CC\u0646"),
                      createTextVNode(),
                      createVNode("span", {
                        class: radioClass("center")
                      }, [
                        selected.value === "center" ? (openBlock(), createBlock("svg", {
                          key: 0,
                          viewBox: "0 0 24 24",
                          class: "w-4 h-4"
                        }, [
                          createVNode("path", {
                            fill: "currentColor",
                            d: "M9 16.17 4.83 12 3.4 13.41 9 19 21 7 19.59 5.59z"
                          })
                        ])) : createCommentVNode("", true)
                      ], 2)
                    ], 8, ["onClick", "aria-checked"]),
                    createTextVNode(),
                    createVNode("button", {
                      onClick: ($event) => pick(),
                      "aria-checked": selected.value === "portrait",
                      role: "radio",
                      class: "flex flex-col items-center focus:outline-none"
                    }, [
                      createVNode("div", {
                        class: cardClass("portrait")
                      }, [
                        createVNode("div", { class: "w-full h-full bg-card flex flex-col" }, [
                          createVNode("div", { class: "relative w-full h-20 bg-gradient-to-b from-muted to-card/90" }, [
                            createVNode("div", { class: "absolute bottom-2 right-2" }, [
                              createVNode("div", { class: "w-8 h-8 rounded-full bg-card border border-border flex items-center justify-center" }, [
                                createVNode("i", { class: "ti ti-user text-xs text-muted-foreground" })
                              ])
                            ])
                          ]),
                          createTextVNode(),
                          createVNode("div", { class: "px-3 pt-4 pb-3" }, [
                            createVNode("div", { class: "space-y-3 mb-6 text-center" }, [
                              createVNode("div", { class: "mx-auto w-20 h-2.5 bg-muted/40 rounded" }),
                              createTextVNode(),
                              createVNode("div", { class: "mx-auto w-16 h-2 bg-muted rounded" }),
                              createTextVNode(),
                              createVNode("div", { class: "mx-auto w-24 h-2 bg-muted rounded" })
                            ]),
                            createTextVNode(),
                            createVNode("div", { class: "w-full h-8 bg-muted/40 rounded-full mb-6" }),
                            createTextVNode(),
                            createVNode("div", { class: "space-y-3" }, [
                              createVNode("div", { class: "flex items-center gap-2" }, [
                                createVNode("div", { class: "w-5 h-5 bg-muted rounded" }),
                                createTextVNode(),
                                createVNode("div", { class: "flex-1" }, [
                                  createVNode("div", { class: "w-20 h-1.5 bg-muted rounded mb-1" }),
                                  createTextVNode(),
                                  createVNode("div", { class: "w-24 h-1.5 bg-muted rounded" })
                                ])
                              ]),
                              createTextVNode(),
                              createVNode("div", { class: "flex items-center gap-2" }, [
                                createVNode("div", { class: "w-5 h-5 bg-muted rounded" }),
                                createTextVNode(),
                                createVNode("div", { class: "flex-1" }, [
                                  createVNode("div", { class: "w-18 h-1.5 bg-muted rounded mb-1" }),
                                  createTextVNode(),
                                  createVNode("div", { class: "w-22 h-1.5 bg-muted rounded" })
                                ])
                              ]),
                              createTextVNode(),
                              createVNode("div", { class: "flex items-center gap-2" }, [
                                createVNode("div", { class: "w-5 h-5 bg-muted rounded" }),
                                createTextVNode(),
                                createVNode("div", { class: "flex-1" }, [
                                  createVNode("div", { class: "w-16 h-1.5 bg-muted rounded mb-1" }),
                                  createTextVNode(),
                                  createVNode("div", { class: "w-20 h-1.5 bg-muted rounded" })
                                ])
                              ])
                            ])
                          ])
                        ])
                      ], 2),
                      createTextVNode(),
                      createVNode("p", { class: "text-sm mt-3 text-foreground font-medium" }, "\u067E\u0648\u0631\u062A\u0631\u06CC\u062A"),
                      createTextVNode(),
                      createVNode("span", {
                        class: radioClass("portrait")
                      }, [
                        selected.value === "portrait" ? (openBlock(), createBlock("svg", {
                          key: 0,
                          viewBox: "0 0 24 24",
                          class: "w-4 h-4"
                        }, [
                          createVNode("path", {
                            fill: "currentColor",
                            d: "M9 16.17 4.83 12 3.4 13.41 9 19 21 7 19.59 5.59z"
                          })
                        ])) : createCommentVNode("", true)
                      ], 2)
                    ], 8, ["onClick", "aria-checked"])
                  ])
                ])
              ]),
              createTextVNode(),
              createVNode("div", { class: "px-4 pb-4 pt-4 border-t border-border space-y-3" }, [
                createVNode("button", {
                  onClick: ($event) => confirm(),
                  class: "w-full py-3 bg-foreground/80 text-background rounded-xl font-semibold hover:bg-foreground transition-colors"
                }, "\r\n        \u062A\u0627\u06CC\u06CC\u062F \u0686\u06CC\u062F\u0645\u0627\u0646\r\n      ", 8, ["onClick"])
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<!--]-->`);
    };
  }
});
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/UserDashboard/main/EditCard/components/LayoutSelector.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const _sfc_main = {
  __name: "index",
  __ssrInlineRender: true,
  props: { cardId: String, cardSlug: String },
  setup(__props) {
    const props = __props;
    const formStore = useSafeFormStore();
    const form = useFormStore();
    const route = useRoute();
    const isPageLoading = ref(true);
    const isDragging = ref(false);
    const showLeadFormPreview = ref(false);
    const { getIconComponent: getIconComponentFromMap, getSafeIcon } = useIconComponents();
    const showToast = ref(false);
    const toastMessage = ref("");
    const toastIcon = ref("ti-alert-triangle");
    const showInfoToast = (message, icon = "ti-check") => {
      toastMessage.value = message;
      toastIcon.value = icon;
      showToast.value = true;
      setTimeout(() => showToast.value = false, 3e3);
    };
    const cardId = computed(() => {
      const id = props.cardId || route.params.cardId || route.query.id || route.params.id || formStore.selectedCardId || null;
      return id;
    });
    const iconColor = computed(() => {
      var _a;
      if (((_a = formStore.value.iconColor) == null ? void 0 : _a.background) && formStore.value.iconColor.background !== "transparent") {
        return formStore.value.iconColor.background;
      }
      return void 0;
    });
    const isIconFilled = computed(() => {
      var _a;
      return !!(((_a = formStore.value.iconColor) == null ? void 0 : _a.background) && formStore.value.iconColor.background !== "transparent");
    });
    const showAddModal = ref(false);
    ref(false);
    const showEditSheet = ref(false);
    const editingLink = ref(null);
    const editingLinkIndex = ref(-1);
    const selectedLayout = ref(form.layout || "right");
    watch(() => form.layout, (newLayout) => {
      if (newLayout && newLayout !== selectedLayout.value) {
        selectedLayout.value = newLayout;
      }
    }, { immediate: true });
    function handleAddLink(newItem) {
      if (!form.links) {
        form.links = [];
      }
      const cleanedItem = { ...newItem };
      if (!cleanedItem.description || cleanedItem.description.trim() === "" || cleanedItem.description === "description") {
        delete cleanedItem.description;
      }
      const normalizedLink = form.normalizeLink ? form.normalizeLink(cleanedItem) : {
        ...cleanedItem,
        id: cleanedItem.id || Date.now() + "_" + Math.random(),
        title: cleanedItem.title || cleanedItem.name || "",
        enabled: cleanedItem.enabled !== void 0 ? cleanedItem.enabled : true
      };
      createNewLink(normalizedLink);
      showInfoToast("\u0644\u06CC\u0646\u06A9 \u0628\u0627 \u0645\u0648\u0641\u0642\u06CC\u062A \u0627\u0636\u0627\u0641\u0647 \u0634\u062F", "ti-check");
      showAddModal.value = false;
    }
    async function createNewLink(linkData) {
      if (!cardId.value) {
        console.warn("No cardId available for creating link");
        return;
      }
      try {
        const nuxtApp = useNuxtApp();
        const axios = nuxtApp.$axios;
        const payloadLink = {
          action: linkData.action || "",
          baseUrl: linkData.baseUrl || "",
          enabled: linkData.enabled !== void 0 ? linkData.enabled : true,
          icon: linkData.icon ? JSON.stringify(linkData.icon) : null,
          id: linkData.id || `${Date.now()}_${Math.random().toString(36).slice(2)}`,
          name: linkData.name || "",
          title: linkData.title || "",
          type: linkData.type || "link",
          value: linkData.value || "",
          username: linkData.username || "",
          placeholder: linkData.placeholder ? JSON.stringify(linkData.placeholder) : null,
          showDescription: linkData.showDescription || false,
          // اضافه کردن فیلدهای اضافی که ممکن است مورد نیاز باشد
          fullName: linkData.fullName || "",
          phoneNumber: linkData.phoneNumber || "",
          phoneRequired: linkData.phoneRequired || "",
          rewards: linkData.rewards || "",
          segments: linkData.segments || "",
          prizes: linkData.prizes || "",
          difficulty: linkData.difficulty || "",
          submitButtonText: linkData.submitButtonText || "",
          thankYouMessage: linkData.thankYouMessage || "",
          avatar: linkData.avatar || "",
          align: linkData.align || "",
          options: linkData.options || "",
          fileName: linkData.fileName || "",
          fileType: linkData.fileType || "",
          accountHolder: linkData.accountHolder || "",
          accountNumber: linkData.accountNumber || "",
          bankName: linkData.bankName || "",
          cardNumber: linkData.cardNumber || "",
          customBank: linkData.customBank || "",
          ibanNumber: linkData.ibanNumber || "",
          showBankDropdown: linkData.showBankDropdown || "",
          highlight: linkData.highlight || false,
          access: linkData.access || "",
          address: linkData.address || "",
          days: linkData.days || "",
          mode: linkData.mode || "",
          latitude: linkData.latitude || "",
          longitude: linkData.longitude || "",
          zoom: linkData.zoom || "",
          fields: linkData.fields || "",
          selectedItems: linkData.selectedItems || ""
        };
        if (linkData.description && linkData.description.trim() && linkData.description.trim() !== "") {
          payloadLink.description = linkData.description.trim();
        }
        if (linkData.customIcon && linkData.customIcon.trim()) {
          payloadLink.customIcon = linkData.customIcon;
        }
        console.log("Creating new link:", payloadLink);
        const response = await axios.post(`v1/cards/${cardId.value}/links`, {
          link: JSON.stringify(payloadLink)
        });
        if (response.data.success) {
          console.log("Link created successfully:", response.data.data);
          const normalizedNewLink = form.normalizeLink ? form.normalizeLink(response.data.data) : response.data.data;
          form.links.push(normalizedNewLink);
          sendFormDataToIframe();
        } else {
          throw new Error(response.data.message || "\u062E\u0637\u0627 \u062F\u0631 \u0627\u06CC\u062C\u0627\u062F \u0644\u06CC\u0646\u06A9");
        }
      } catch (error) {
        console.error("Error creating link:", error);
        showInfoToast("\u062E\u0637\u0627 \u062F\u0631 \u0627\u06CC\u062C\u0627\u062F \u0644\u06CC\u0646\u06A9", "ti-alert-triangle");
      }
    }
    function editLink(link, index) {
      var _a, _b, _c, _d;
      const actionToIconMap = {
        "map": "linkumap",
        "bank": "card",
        "bankcard": "card"
      };
      let parsedIcon = link.icon;
      if (typeof link.icon === "string") {
        try {
          parsedIcon = JSON.parse(link.icon);
        } catch (e) {
          const actionLower = (_a = link.action) == null ? void 0 : _a.toLowerCase();
          const iconName = actionToIconMap[actionLower] || actionLower;
          parsedIcon = iconName ? { type: "component", name: iconName, path: iconName } : null;
        }
      }
      if (!parsedIcon && link.action) {
        const actionLower = link.action.toLowerCase();
        const iconName = actionToIconMap[actionLower] || actionLower;
        parsedIcon = { type: "component", name: iconName, path: iconName };
      }
      const editable = {
        ...link,
        icon: parsedIcon,
        type: link.type || (((_b = link.action) == null ? void 0 : _b.includes("block")) ? "block" : "link"),
        action: ((_c = link.action) == null ? void 0 : _c.toLowerCase()) || "basiclink",
        username: link.baseUrl && ((_d = link.value) == null ? void 0 : _d.startsWith(link.baseUrl)) ? link.value.replace(link.baseUrl, "") : link.username || ""
      };
      if (!editable.title) editable.title = link.name || "\u0628\u062F\u0648\u0646 \u0639\u0646\u0648\u0627\u0646";
      if (!editable.value) editable.value = "";
      editingLink.value = editable;
      editingLinkIndex.value = index;
      showEditSheet.value = true;
    }
    function cancelEdit() {
      showEditSheet.value = false;
      editingLink.value = null;
      editingLinkIndex.value = -1;
    }
    function getEditSheetTitle() {
      var _a;
      if (!editingLink.value) return "\u0648\u06CC\u0631\u0627\u06CC\u0634 \u0645\u062D\u062A\u0648\u0627";
      const actionTitles = {
        basiclink: "\u0648\u06CC\u0631\u0627\u06CC\u0634 \u0644\u06CC\u0646\u06A9",
        email: "\u0648\u06CC\u0631\u0627\u06CC\u0634 \u0627\u06CC\u0645\u06CC\u0644",
        phone: "\u0648\u06CC\u0631\u0627\u06CC\u0634 \u062A\u0644\u0641\u0646",
        whatsapp: "\u0648\u06CC\u0631\u0627\u06CC\u0634 \u0648\u0627\u062A\u0633\u0627\u067E",
        telegram: "\u0648\u06CC\u0631\u0627\u06CC\u0634 \u062A\u0644\u06AF\u0631\u0627\u0645",
        instagram: "\u0648\u06CC\u0631\u0627\u06CC\u0634 \u0627\u06CC\u0646\u0633\u062A\u0627\u06AF\u0631\u0627\u0645",
        twitter: "\u0648\u06CC\u0631\u0627\u06CC\u0634 \u062A\u0648\u06CC\u06CC\u062A\u0631",
        youtube: "\u0648\u06CC\u0631\u0627\u06CC\u0634 \u06CC\u0648\u062A\u06CC\u0648\u0628",
        linkedin: "\u0648\u06CC\u0631\u0627\u06CC\u0634 \u0644\u06CC\u0646\u06A9\u062F\u06CC\u0646",
        map: "\u0648\u06CC\u0631\u0627\u06CC\u0634 \u0646\u0642\u0634\u0647",
        text: "\u0648\u06CC\u0631\u0627\u06CC\u0634 \u0645\u062A\u0646",
        faq: "\u0648\u06CC\u0631\u0627\u06CC\u0634 \u0633\u0648\u0627\u0644\u0627\u062A \u0645\u062A\u062F\u0627\u0648\u0644",
        divider: "\u0648\u06CC\u0631\u0627\u06CC\u0634 \u062C\u062F\u0627\u06A9\u0646\u0646\u062F\u0647",
        contact: "\u0648\u06CC\u0631\u0627\u06CC\u0634 \u0641\u0631\u0645 \u062A\u0645\u0627\u0633",
        payment: "\u0648\u06CC\u0631\u0627\u06CC\u0634 \u067E\u0631\u062F\u0627\u062E\u062A",
        file: "\u0648\u06CC\u0631\u0627\u06CC\u0634 \u0641\u0627\u06CC\u0644"
      };
      const action = (_a = editingLink.value.action) == null ? void 0 : _a.toLowerCase();
      return actionTitles[action] || "\u0648\u06CC\u0631\u0627\u06CC\u0634 \u0645\u062D\u062A\u0648\u0627";
    }
    function getLinkDisplayTitle(link) {
      var _a;
      const defaultTitles = {
        "call": "\u062A\u0645\u0627\u0633",
        "number": "\u067E\u06CC\u0627\u0645\u06A9",
        "email": "\u0627\u06CC\u0645\u06CC\u0644",
        "whatsapp": "\u0648\u0627\u062A\u0633\u0627\u067E",
        "telegram": "\u062A\u0644\u06AF\u0631\u0627\u0645",
        "instagram": "\u0627\u06CC\u0646\u0633\u062A\u0627\u06AF\u0631\u0627\u0645",
        "linkedin": "\u0644\u06CC\u0646\u06A9\u062F\u06CC\u0646",
        "twitter": "\u062A\u0648\u06CC\u06CC\u062A\u0631",
        "youtube": "\u06CC\u0648\u062A\u06CC\u0648\u0628",
        "tiktok": "\u062A\u06CC\u06A9\u200C\u062A\u0627\u06A9",
        "facebook": "\u0641\u06CC\u0633\u0628\u0648\u06A9",
        "snapchat": "\u0627\u0633\u0646\u067E\u200C\u0686\u062A",
        "threads": "\u062A\u0631\u062F\u0632",
        "twitch": "\u062A\u0648\u06CC\u06CC\u0686",
        "rubika": "\u0631\u0648\u0628\u06CC\u06A9\u0627",
        "bale": "\u0628\u0644\u0647",
        "eitaa": "\u0627\u06CC\u062A\u0627",
        "igap": "\u0622\u06CC\u200C\u06AF\u067E",
        "discord": "\u062F\u06CC\u0633\u06A9\u0648\u0631\u062F",
        "map": "\u0646\u0642\u0634\u0647",
        "address": "\u0622\u062F\u0631\u0633",
        "poll": "\u0646\u0638\u0631\u0633\u0646\u062C\u06CC",
        "questionbox": "\u062C\u0639\u0628\u0647 \u0633\u0648\u0627\u0644",
        "expandabletext": "\u0645\u062A\u0646 \u0628\u0627\u0632\u0634\u0648\u0646\u062F\u0647",
        "textsection": "\u0628\u062E\u0634 \u0645\u062A\u0646\u06CC",
        "file": "\u0641\u0627\u06CC\u0644",
        "bankcard": "\u06A9\u0627\u0631\u062A \u0628\u0627\u0646\u06A9\u06CC",
        "workhours": "\u0633\u0627\u0639\u0627\u062A \u06A9\u0627\u0631\u06CC",
        "contactcard": "\u06A9\u0627\u0631\u062A \u062A\u0645\u0627\u0633",
        "embeddedvideo": "\u0648\u06CC\u062F\u06CC\u0648",
        "customlink": "\u0644\u06CC\u0646\u06A9 \u0633\u0641\u0627\u0631\u0634\u06CC",
        "luckydice": "\u062A\u0627\u0633 \u0634\u0627\u0646\u0633",
        "luckywheel": "\u06AF\u0631\u062F\u0648\u0646\u0647 \u0634\u0627\u0646\u0633",
        "luckyegg": "\u062A\u062E\u0645 \u0645\u0631\u063A \u0634\u0627\u0646\u0633",
        "builder": "\u0641\u0631\u0645\u200C\u0633\u0627\u0632",
        "spotify": "\u0627\u0633\u067E\u0627\u062A\u06CC\u0641\u0627\u06CC",
        "soundcloud": "\u0633\u0627\u0646\u062F\u06A9\u0644\u0648\u062F",
        "aparat": "\u0622\u067E\u0627\u0631\u0627\u062A",
        "virgool": "\u0648\u06CC\u0631\u06AF\u0648\u0644"
      };
      const action = (_a = link.action) == null ? void 0 : _a.toLowerCase();
      if (link.title && link.title.trim()) {
        const trimmedTitle = link.title.trim();
        if (!/^\+?[\d\s-]{8,20}$/.test(trimmedTitle) && !/^[\d]+$/.test(trimmedTitle)) {
          return trimmedTitle;
        }
      }
      if (link.name && link.name.trim()) {
        return link.name.trim();
      }
      if (action && defaultTitles[action]) {
        return defaultTitles[action];
      }
      return "\u0628\u062F\u0648\u0646 \u0639\u0646\u0648\u0627\u0646";
    }
    function getEditLinkUrl(link) {
      if (!link) return null;
      const blockActions = [
        "bankcard",
        "workhours",
        "embeddedvideo",
        "file",
        "poll",
        "textsection",
        "questionbox",
        "expandabletext",
        "builder",
        "luckydice",
        "luckywheel",
        "luckyegg",
        "contactcard"
      ];
      if (link.action && blockActions.includes(link.action.toLowerCase())) {
        return null;
      }
      if (link.baseUrl && link.username) {
        return link.baseUrl + link.username;
      }
      if (link.username && link.action) {
        const baseUrls = {
          telegram: "https://t.me/",
          instagram: "https://instagram.com/",
          twitter: "https://x.com/",
          youtube: "https://youtube.com/",
          linkedin: "https://linkedin.com/in/",
          tiktok: "https://www.tiktok.com/@",
          whatsapp: "https://wa.me/",
          facebook: "https://facebook.com/",
          threads: "https://www.threads.net/@",
          snapchat: "https://snapchat.com/add/",
          twitch: "https://twitch.tv/",
          rubika: "https://rubika.ir/",
          bale: "https://ble.ir/",
          eitaa: "https://eitaa.com/"
        };
        const base = baseUrls[link.action.toLowerCase()];
        if (base) return base + link.username;
      }
      if (link.value && (link.value.startsWith("http") || link.value.startsWith("mailto:") || link.value.startsWith("tel:"))) {
        return link.value;
      }
      return null;
    }
    function getEditComponent(item) {
      if (!item || !item.action) return _sfc_main$e;
      const action = item.action.toLowerCase();
      if (Object.prototype.hasOwnProperty.call(EditForms, action)) {
        return EditForms[action];
      }
      const altKey = Object.keys(EditForms).find((k) => k.toLowerCase() === action);
      if (altKey) {
        return EditForms[altKey];
      }
      return _sfc_main$e;
    }
    async function saveEditedLink(updatedItem) {
      var _a, _b, _c, _d, _e, _f, _g, _h, _i, _j, _k, _l, _m, _n, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y, _z, _A, _B, _C, _D, _E, _F, _G, _H, _I, _J, _K, _L;
      const item = { ...updatedItem };
      if (item.baseUrl && item.username) {
        item.value = item.baseUrl + item.username;
      }
      if (!item.id) return;
      try {
        const nuxtApp = useNuxtApp();
        const axios = nuxtApp.$axios;
        const payloadLink = {
          backgroundImage: (_a = item.backgroundImage) != null ? _a : "",
          phoneRequired: (_b = item.phoneRequired) != null ? _b : "",
          rewards: (_c = item.rewards) != null ? _c : "",
          segments: (_d = item.segments) != null ? _d : "",
          prizes: (_e = item.prizes) != null ? _e : "",
          difficulty: (_f = item.difficulty) != null ? _f : "",
          submitButtonText: (_g = item.submitButtonText) != null ? _g : "",
          thankYouMessage: (_h = item.thankYouMessage) != null ? _h : "",
          avatar: (_i = item.avatar) != null ? _i : "",
          align: (_j = item.align) != null ? _j : "",
          options: (_k = item.options) != null ? _k : "",
          fileName: (_l = item.fileName) != null ? _l : "",
          fileType: (_m = item.fileType) != null ? _m : "",
          accountHolder: (_n = item.accountHolder) != null ? _n : "",
          accountNumber: (_o = item.accountNumber) != null ? _o : "",
          bankName: (_p = item.bankName) != null ? _p : "",
          cardNumber: (_q = item.cardNumber) != null ? _q : "",
          customBank: (_r = item.customBank) != null ? _r : "",
          ibanNumber: (_s = item.ibanNumber) != null ? _s : "",
          showBankDropdown: (_t = item.showBankDropdown) != null ? _t : "",
          highlight: (_u = item.highlight) != null ? _u : false,
          access: (_v = item.access) != null ? _v : "",
          address: (_w = item.address) != null ? _w : "",
          days: (_x = item.days) != null ? _x : "",
          mode: (_y = item.mode) != null ? _y : "",
          latitude: (_z = item.latitude) != null ? _z : "",
          longitude: (_A = item.longitude) != null ? _A : "",
          zoom: (_B = item.zoom) != null ? _B : "",
          action: (_C = item.action) != null ? _C : "",
          fields: (_D = item.fields) != null ? _D : "",
          baseUrl: (_E = item.baseUrl) != null ? _E : "",
          customIcon: (_F = item.customIcon) != null ? _F : "",
          description: (_G = item.description) != null ? _G : "",
          enabled: item.enabled,
          icon: item.icon ? typeof item.icon === "string" ? item.icon : JSON.stringify(item.icon) : item.action ? JSON.stringify({ type: "component", name: item.action }) : null,
          id: item.id,
          name: item.name,
          username: (_H = item.username) != null ? _H : "",
          selectedItems: (_I = item.selectedItems) != null ? _I : "",
          placeholder: item.placeholder ? JSON.stringify(item.placeholder) : null,
          showDescription: (_J = item.showDescription) != null ? _J : false,
          title: item.title,
          type: item.type,
          value: (_K = item.value) != null ? _K : ""
        };
        const response = await axios.put(`v1/cards/${cardId.value}/links/${item.id}/update`, { link: JSON.stringify(payloadLink) });
        if ((_L = response.data) == null ? void 0 : _L.success) {
          const idx = form.links.findIndex((l) => l.id === item.id);
          if (idx !== -1) {
            const responseData = response.data.data || {};
            if (typeof responseData.icon === "string") {
              try {
                responseData.icon = JSON.parse(responseData.icon);
              } catch (e) {
                responseData.icon = item.icon;
              }
            }
            if (!responseData.icon) {
              responseData.icon = item.icon;
            }
            form.links[idx] = { ...item, ...responseData };
            form.links = [...form.links];
          }
          showEditSheet.value = false;
          editingLink.value = null;
          editingLinkIndex.value = -1;
          sendFormDataToIframe();
          showInfoToast(response.data.message || "\u0644\u06CC\u0646\u06A9 \u0628\u0627 \u0645\u0648\u0641\u0642\u06CC\u062A \u0648\u06CC\u0631\u0627\u06CC\u0634 \u0634\u062F", "ti-check");
        } else {
          showInfoToast(response.data.message || "\u062E\u0637\u0627 \u062F\u0631 \u0648\u06CC\u0631\u0627\u06CC\u0634 \u0644\u06CC\u0646\u06A9", "ti-alert-triangle");
        }
      } catch (error) {
        if (error.response) {
          showInfoToast(error.response.data.message || "\u062E\u0637\u0627 \u062F\u0631 \u0648\u06CC\u0631\u0627\u06CC\u0634 \u0644\u06CC\u0646\u06A9", "ti-alert-triangle");
        } else {
          showInfoToast("\u0645\u0634\u06A9\u0644\u06CC \u062F\u0631 \u0627\u0631\u062A\u0628\u0627\u0637 \u0628\u0627 \u0633\u0631\u0648\u0631 \u0648\u062C\u0648\u062F \u062F\u0627\u0631\u062F", "ti-alert-triangle");
        }
      }
    }
    function removeLink(index) {
      if (form.links && form.links.length > index) {
        const linkToRemove = form.links[index];
        if (linkToRemove.id && cardId.value) {
          deleteLinkFromServer(linkToRemove.id, index);
        } else {
          form.links.splice(index, 1);
          showInfoToast("\u0644\u06CC\u0646\u06A9 \u062D\u0630\u0641 \u0634\u062F", "ti-check");
        }
      }
    }
    async function deleteLinkFromServer(linkId, index) {
      if (!cardId.value || !linkId) {
        console.warn("No cardId or linkId available for deletion");
        if (form.links && form.links.length > index) {
          form.links.splice(index, 1);
          showInfoToast("\u0644\u06CC\u0646\u06A9 \u062D\u0630\u0641 \u0634\u062F", "ti-check");
        }
        return;
      }
      try {
        const nuxtApp = useNuxtApp();
        const axios = nuxtApp.$axios;
        console.log("Deleting link:", linkId);
        const response = await axios.delete(`v1/cards/${cardId.value}/links/${linkId}/delete`);
        if (response.data.success) {
          console.log("Link deleted successfully");
          if (form.links && form.links.length > index) {
            form.links.splice(index, 1);
          }
          sendFormDataToIframe();
          showInfoToast("\u0644\u06CC\u0646\u06A9 \u062D\u0630\u0641 \u0634\u062F", "ti-check");
        } else {
          if (form.links && form.links.length > index) {
            form.links.splice(index, 1);
          }
          sendFormDataToIframe();
          showInfoToast("\u0644\u06CC\u0646\u06A9 \u062D\u0630\u0641 \u0634\u062F", "ti-check");
        }
      } catch (error) {
        console.error("Error deleting link:", error);
        if (form.links && form.links.length > index) {
          form.links.splice(index, 1);
        }
        showInfoToast("\u0644\u06CC\u0646\u06A9 \u062D\u0630\u0641 \u0634\u062F", "ti-check");
      }
    }
    function onDragEnd(evt) {
      isDragging.value = false;
      if (evt.oldIndex !== evt.newIndex) {
        saveLinksOrder();
        showInfoToast("\u062A\u0631\u062A\u06CC\u0628 \u0644\u06CC\u0646\u06A9\u200C\u0647\u0627 \u062A\u063A\u06CC\u06CC\u0631 \u06A9\u0631\u062F", "ti-arrows-move");
      }
    }
    async function saveLinksOrder() {
      if (!cardId.value || !form.links || form.links.length === 0) {
        return;
      }
      try {
        const nuxtApp = useNuxtApp();
        const axios = nuxtApp.$axios;
        const hashOrder = form.links.map((link) => link.hash);
        console.log("Saving links order by hash:", hashOrder);
        const response = await axios.post(`v1/cards/${cardId.value}/links/reorder`, {
          hashOrder
        });
        if (response.data.success) {
          console.log("Links order saved successfully");
        } else {
          throw new Error(response.data.message || "\u062E\u0637\u0627 \u062F\u0631 \u0630\u062E\u06CC\u0631\u0647 \u062A\u0631\u062A\u06CC\u0628 \u0644\u06CC\u0646\u06A9\u200C\u0647\u0627");
        }
      } catch (error) {
        console.error("Error saving links order:", error);
        saveLinksToServer();
      }
    }
    function getIconComponent(link) {
      const iconData = link.icon || null;
      if (iconData && typeof iconData === "object") {
        return getIconComponentFromMap(iconData);
      }
      return null;
    }
    function getSafeIconUrl(link) {
      return getSafeIcon(link);
    }
    function getFallbackIcon(link) {
      const iconMap = {
        // اطلاعات تماس
        "call": "phone",
        "number": "message",
        "email": "mail",
        "telegram": "brand-telegram",
        "whatsapp": "brand-whatsapp",
        "eitaa": "brand-telegram",
        "contactcard": "id-badge-2",
        "address": "map-pin",
        "facetime": "video",
        "map": "map",
        // شبکه‌های اجتماعی
        "instagram": "brand-instagram",
        "facebook": "brand-facebook",
        "tiktok": "brand-tiktok",
        "twitter": "brand-twitter",
        "x": "brand-x",
        "linkedin": "brand-linkedin",
        "youtube": "brand-youtube",
        "aparat": "video",
        "discord": "brand-discord",
        "snapchat": "brand-snapchat",
        "pinterest": "brand-pinterest",
        "threads": "brand-threads",
        "clubhouse": "microphone",
        "twitch": "brand-twitch",
        "rubika": "message-circle",
        "bale": "message-circle",
        "igap": "message-circle",
        "medium": "brand-medium",
        "virgool": "article",
        // کسب و کار
        "website": "world",
        "app_link": "apps",
        "github": "brand-github",
        "booksy": "calendar",
        "calendly": "calendar-event",
        "card": "credit-card",
        "chili": "chili",
        "etsy": "shopping-bag",
        "reviews": "star",
        "review": "star",
        "square": "square",
        "yelp": "star",
        "divar": "home",
        "snapp": "car",
        "nshan": "map",
        "neshan": "map",
        "balad": "map-pin",
        "figma": "brand-figma",
        "googlemeet": "video",
        "teams": "brand-teams",
        "zoom": "video",
        "trustpilot": "star",
        "zillow": "home",
        // پرداخت
        "cashapp": "currency-dollar",
        "paypal": "brand-paypal",
        "zelle": "currency-dollar",
        "remit": "currency-dollar",
        "reymit": "currency-dollar",
        "zarinpal": "credit-card",
        "trustwallet": "wallet",
        // محتوا
        "customlink": "external-link",
        "dropdown": "chevron-down",
        "embeddedvideo": "player-play",
        "featured": "star",
        "featuredlink": "star",
        "file": "file",
        "textsection": "file-text",
        "text-section": "file-text",
        "poll": "chart-bar",
        "questionbox": "help-circle",
        // موزیک
        "hoobe": "music",
        "linktree": "tree",
        "opensea_color": "palette",
        "podcasts": "microphone",
        "poshmark": "shopping-bag",
        "spotify": "brand-spotify",
        "youtube_music": "music",
        "apple_music": "music",
        // فرم و بازی
        "luckyegg": "egg",
        "luckydice": "dice",
        "luckywheel": "wheel",
        "form": "forms"
      };
      return iconMap[link.action] || "link";
    }
    async function saveLinksToServer() {
      if (!cardId.value) {
        console.warn("No cardId available for saving links");
        return;
      }
      try {
        const nuxtApp = useNuxtApp();
        const axios = nuxtApp.$axios;
        const formData = new FormData();
        const linksToSave = form.links ? form.links.map((link) => {
          const cleanedLink = {
            ...link,
            // اطمینان از وجود فیلدهای ضروری
            id: link.id || Date.now() + "_" + Math.random(),
            title: link.title || link.name || "",
            action: link.action || "customlink",
            url: link.url || "",
            enabled: link.enabled !== void 0 ? link.enabled : true,
            icon: link.icon || null,
            customIcon: link.customIcon || null,
            isListMode: link.isListMode !== void 0 ? link.isListMode : true
          };
          if (link.description && link.description.trim() && link.description.trim() !== "") {
            cleanedLink.description = link.description.trim();
          }
          return cleanedLink;
        }) : [];
        formData.append("linksDataList", JSON.stringify(linksToSave));
        console.log("Saving links to server:", linksToSave);
        const response = await axios.post(`v1/cards/${cardId.value}/update`, formData, {
          headers: { "X-HTTP-Method-Override": "PUT" }
        });
        if (response.data.success) {
          console.log("Links saved successfully");
          sendFormDataToIframe();
        } else {
          throw new Error(response.data.message || "\u062E\u0637\u0627 \u062F\u0631 \u0630\u062E\u06CC\u0631\u0647 \u0644\u06CC\u0646\u06A9\u200C\u0647\u0627");
        }
      } catch (error) {
        console.error("Error saving links:", error);
        showInfoToast("\u062E\u0637\u0627 \u062F\u0631 \u0630\u062E\u06CC\u0631\u0647 \u0644\u06CC\u0646\u06A9\u200C\u0647\u0627", "ti-alert-triangle");
      }
    }
    function handleLayoutChange(layout) {
    }
    async function handleLayoutConfirm(layout) {
      try {
        if (formStore.value) {
          formStore.value.layout = layout;
        }
        form.layout = layout;
        if (props.cardId) {
          const formData = new FormData();
          formData.append("layoutMode", layout);
          if (form.themeColor) {
            formData.append("themeColor", JSON.stringify(form.themeColor));
          }
          if (form.iconColor) {
            formData.append("iconColor", JSON.stringify(form.iconColor));
          }
          const nuxtApp = useNuxtApp();
          const axios = nuxtApp.$axios;
          const response = await axios.post(`v1/cards/${props.cardId}/update`, formData, {
            headers: { "X-HTTP-Method-Override": "PUT" }
          });
          if (response.data.success) {
            showInfoToast("\u0686\u06CC\u062F\u0645\u0627\u0646 \u0628\u0627 \u0645\u0648\u0641\u0642\u06CC\u062A \u0630\u062E\u06CC\u0631\u0647 \u0634\u062F", "ti-check");
          } else {
            throw new Error(response.data.message || "\u062E\u0637\u0627 \u062F\u0631 \u0630\u062E\u06CC\u0631\u0647 \u0686\u06CC\u062F\u0645\u0627\u0646");
          }
        } else {
          showInfoToast("\u0686\u06CC\u062F\u0645\u0627\u0646 \u062A\u063A\u06CC\u06CC\u0631 \u06A9\u0631\u062F", "ti-check");
        }
      } catch (error) {
        showInfoToast("\u062E\u0637\u0627 \u062F\u0631 \u0630\u062E\u06CC\u0631\u0647 \u0686\u06CC\u062F\u0645\u0627\u0646", "ti-alert-triangle");
      }
    }
    const isSaving = ref(false);
    const { $axios } = useNuxtApp();
    ref(null);
    ref(0);
    const showPreviewMobile = ref(false);
    ref(true);
    ref(false);
    computed(() => {
      return "about:blank";
    });
    const sendFormDataToIframe = () => {
      return;
    };
    watch(() => form.$state, () => {
    }, { deep: true });
    watch(() => form.cards, (c) => {
    }, { immediate: true });
    watch(() => form.links, (newLinks) => {
      if (formStore.value) {
        formStore.value.links = newLinks || [];
      }
    }, { deep: true, immediate: true });
    watch(() => form.isLeadCaptureEnabled, async (newValue, oldValue) => {
      console.log("Lead capture watch triggered:", { newValue, oldValue, cardId: cardId.value });
      if (newValue === oldValue) {
        console.log("No change in lead capture value, skipping");
        return;
      }
      if (cardId.value) {
        try {
          const nuxtApp = useNuxtApp();
          const axios = nuxtApp.$axios;
          console.log("Saving lead capture mode:", newValue, "for card:", cardId.value);
          const formData = new FormData();
          formData.append("leadCaptureMode", newValue ? "1" : "0");
          const response = await axios.post(`v1/cards/${cardId.value}/update`, formData, {
            headers: { "X-HTTP-Method-Override": "PUT" }
          });
          if (response.data.success) {
            console.log("\u0641\u0631\u0645 \u0644\u06CC\u062F \u0628\u0627 \u0645\u0648\u0641\u0642\u06CC\u062A \u0630\u062E\u06CC\u0631\u0647 \u0634\u062F:", newValue);
            showInfoToast(newValue ? "\u0641\u0631\u0645 \u0644\u06CC\u062F \u0641\u0639\u0627\u0644 \u0634\u062F" : "\u0641\u0631\u0645 \u0644\u06CC\u062F \u063A\u06CC\u0631\u0641\u0639\u0627\u0644 \u0634\u062F", "ti-check");
          } else {
            throw new Error(response.data.message || "\u062E\u0637\u0627 \u062F\u0631 \u0630\u062E\u06CC\u0631\u0647 \u0641\u0631\u0645 \u0644\u06CC\u062F");
          }
        } catch (error) {
          console.error("Error saving lead capture setting:", error);
          showInfoToast("\u062E\u0637\u0627 \u062F\u0631 \u0630\u062E\u06CC\u0631\u0647 \u062A\u0646\u0638\u06CC\u0645\u0627\u062A \u0641\u0631\u0645", "ti-alert-triangle");
          setTimeout(() => {
            form.isLeadCaptureEnabled = oldValue;
          }, 100);
        }
      } else {
        console.warn("No cardId available for saving lead capture setting");
        showInfoToast("\u062E\u0637\u0627: \u0634\u0646\u0627\u0633\u0647 \u06A9\u0627\u0631\u062A \u0645\u0648\u062C\u0648\u062F \u0646\u06CC\u0633\u062A", "ti-alert-triangle");
        setTimeout(() => {
          form.isLeadCaptureEnabled = oldValue;
        }, 100);
      }
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_ClientOnly = __nuxt_component_0$3;
      _push(`<!--[--><div class="flex flex-col" data-v-0f3499c7><div class="fixed top-0 left-0 right-0 w-full bg-background/95 backdrop-blur-lg border-b border-border z-[100] block lg:hidden" data-v-0f3499c7><div class="flex items-center justify-between w-full p-4" data-v-0f3499c7><div class="flex items-center gap-3" data-v-0f3499c7><button class="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-accent transition-colors" data-v-0f3499c7><i class="ti ti-arrow-right text-xl text-foreground" data-v-0f3499c7></i></button> <h1 class="text-lg font-semibold text-foreground" data-v-0f3499c7>\u0648\u06CC\u0631\u0627\u06CC\u0634 \u067E\u0631\u0648\u0641\u0627\u06CC\u0644</h1></div> <div class="flex items-center gap-2" data-v-0f3499c7>`);
      if (unref(form).isLeadCaptureEnabled) {
        _push(`<button type="button" class="bg-accent hover:bg-accent/80 text-accent-foreground px-3 py-2 rounded-xl flex items-center gap-2"${ssrRenderAttr("title", showLeadFormPreview.value ? "\u067E\u0646\u0647\u0627\u0646 \u06A9\u0631\u062F\u0646 \u0641\u0631\u0645" : "\u0646\u0645\u0627\u06CC\u0634 \u067E\u06CC\u0634\u200C\u0646\u0645\u0627\u06CC\u0634 \u0641\u0631\u0645")} data-v-0f3499c7><i class="${ssrRenderClass([showLeadFormPreview.value ? "ti ti-eye-off" : "ti ti-eye", "text-base"])}" data-v-0f3499c7></i></button>`);
      } else {
        _push(`<!---->`);
      }
      _push(` <button type="button" tabindex="-1" class="bg-primary text-primary-foreground px-3 py-2 rounded-xl flex items-center gap-2 relative z-[101]" data-v-0f3499c7><i class="ti ti-message text-base" data-v-0f3499c7></i> <span class="text-sm font-medium" data-v-0f3499c7>\u0641\u0631\u0645 \u0627\u0631\u062A\u0628\u0627\u0637</span></button></div></div></div> `);
      if (isPageLoading.value) {
        _push(`<div class="w-full grid grid-cols-1 lg:grid-cols-6 gap-4 lg:pt-6 pb-24 lg:pb-6 animate-pulse" data-v-0f3499c7><div class="lg:col-span-4 min-h-0 px-1 lg:px-0 space-y-6" data-v-0f3499c7><div class="bg-card p-4 rounded-xl border border-border" data-v-0f3499c7><div class="h-5 w-32 bg-muted rounded mb-3" data-v-0f3499c7></div> <div class="flex gap-3" data-v-0f3499c7><div class="h-16 flex-1 bg-muted rounded-xl" data-v-0f3499c7></div> <div class="h-16 flex-1 bg-muted rounded-xl" data-v-0f3499c7></div> <div class="h-16 flex-1 bg-muted rounded-xl" data-v-0f3499c7></div></div></div> <div class="bg-card p-4 sm:p-6 rounded-xl border border-border space-y-4" data-v-0f3499c7><div class="flex items-center gap-4" data-v-0f3499c7><div class="w-20 h-20 bg-muted rounded-full" data-v-0f3499c7></div> <div class="flex-1 space-y-2" data-v-0f3499c7><div class="h-5 w-3/4 bg-muted rounded" data-v-0f3499c7></div> <div class="h-4 w-1/2 bg-muted rounded" data-v-0f3499c7></div></div></div> <div class="space-y-3" data-v-0f3499c7><div class="h-10 bg-muted rounded-lg" data-v-0f3499c7></div> <div class="h-10 bg-muted rounded-lg" data-v-0f3499c7></div> <div class="h-20 bg-muted rounded-lg" data-v-0f3499c7></div></div></div> <div class="bg-card p-4 sm:p-6 rounded-xl border border-border" data-v-0f3499c7><div class="flex items-center justify-between" data-v-0f3499c7><div class="space-y-2" data-v-0f3499c7><div class="h-5 w-40 bg-muted rounded" data-v-0f3499c7></div> <div class="h-4 w-56 bg-muted rounded" data-v-0f3499c7></div></div> <div class="w-11 h-6 bg-muted rounded-full" data-v-0f3499c7></div></div></div> <div class="space-y-3" data-v-0f3499c7><div class="h-6 w-36 bg-muted rounded" data-v-0f3499c7></div> <div class="space-y-2" data-v-0f3499c7><div class="bg-card border border-border rounded-xl p-4 flex items-center justify-between" data-v-0f3499c7><div class="flex items-center gap-3" data-v-0f3499c7><div class="w-6 h-8 bg-muted rounded" data-v-0f3499c7></div> <div class="w-10 h-10 bg-muted rounded-lg" data-v-0f3499c7></div> <div class="h-5 w-32 bg-muted rounded" data-v-0f3499c7></div></div> <div class="flex gap-2" data-v-0f3499c7><div class="w-8 h-8 bg-muted rounded-lg" data-v-0f3499c7></div> <div class="w-8 h-8 bg-muted rounded-lg" data-v-0f3499c7></div></div></div> <div class="bg-card border border-border rounded-xl p-4 flex items-center justify-between" data-v-0f3499c7><div class="flex items-center gap-3" data-v-0f3499c7><div class="w-6 h-8 bg-muted rounded" data-v-0f3499c7></div> <div class="w-10 h-10 bg-muted rounded-lg" data-v-0f3499c7></div> <div class="h-5 w-28 bg-muted rounded" data-v-0f3499c7></div></div> <div class="flex gap-2" data-v-0f3499c7><div class="w-8 h-8 bg-muted rounded-lg" data-v-0f3499c7></div> <div class="w-8 h-8 bg-muted rounded-lg" data-v-0f3499c7></div></div></div> <div class="bg-card border border-border rounded-xl p-4 flex items-center justify-between" data-v-0f3499c7><div class="flex items-center gap-3" data-v-0f3499c7><div class="w-6 h-8 bg-muted rounded" data-v-0f3499c7></div> <div class="w-10 h-10 bg-muted rounded-lg" data-v-0f3499c7></div> <div class="h-5 w-36 bg-muted rounded" data-v-0f3499c7></div></div> <div class="flex gap-2" data-v-0f3499c7><div class="w-8 h-8 bg-muted rounded-lg" data-v-0f3499c7></div> <div class="w-8 h-8 bg-muted rounded-lg" data-v-0f3499c7></div></div></div></div></div> <div class="bg-card rounded-xl p-6 border border-border" data-v-0f3499c7><div class="flex gap-4 mb-6" data-v-0f3499c7><div class="w-12 h-12 bg-muted rounded-xl" data-v-0f3499c7></div> <div class="flex-1 space-y-2" data-v-0f3499c7><div class="h-5 w-28 bg-muted rounded" data-v-0f3499c7></div> <div class="h-4 w-full bg-muted rounded" data-v-0f3499c7></div></div></div> <div class="h-12 bg-muted rounded-xl" data-v-0f3499c7></div></div></div> <div class="lg:col-span-2 hidden lg:block" data-v-0f3499c7><div class="sticky top-6" data-v-0f3499c7><div class="bg-card rounded-2xl border border-border p-4 space-y-4" data-v-0f3499c7><div class="h-6 w-24 bg-muted rounded mx-auto" data-v-0f3499c7></div> <div class="aspect-[9/16] bg-muted rounded-xl" data-v-0f3499c7></div></div></div></div></div>`);
      } else {
        _push(`<div class="w-full grid grid-cols-1 lg:grid-cols-6 gap-4 lg:pt-6 pb-24 lg:pb-6" data-v-0f3499c7><div class="lg:col-span-4 min-h-0 px-1 lg:px-0" data-v-0f3499c7><div class="mb-6" data-v-0f3499c7>`);
        _push(ssrRenderComponent(_sfc_main$1, {
          modelValue: selectedLayout.value,
          "onUpdate:modelValue": ($event) => selectedLayout.value = $event,
          onLayoutChanged: handleLayoutChange,
          onConfirm: handleLayoutConfirm
        }, null, _parent));
        _push(`</div> `);
        _push(ssrRenderComponent(_sfc_main$2, {
          cardId: cardId.value,
          form: unref(formStore).value,
          "onUpdate:form": ($event) => unref(formStore).value = $event,
          onOpenPreview: ($event) => showPreviewMobile.value = true,
          class: "bg-card p-4 sm:p-6 rounded-xl mb-6 border border-border"
        }, null, _parent));
        _push(` <div class="bg-card p-4 sm:p-6 rounded-xl mb-6 border border-border mt-8" data-v-0f3499c7><div class="flex items-center justify-between" data-v-0f3499c7><div data-v-0f3499c7><h3 class="text-base font-semibold text-foreground mb-1" data-v-0f3499c7>\u0641\u0631\u0645 \u062F\u0631\u06CC\u0627\u0641\u062A \u0627\u0637\u0644\u0627\u0639\u0627\u062A</h3> <p class="text-sm text-muted-foreground" data-v-0f3499c7>\u0641\u0639\u0627\u0644\u200C\u0633\u0627\u0632\u06CC \u0641\u0631\u0645 \u0628\u0631\u0627\u06CC \u062C\u0645\u0639\u200C\u0622\u0648\u0631\u06CC \u0627\u0637\u0644\u0627\u0639\u0627\u062A \u0628\u0627\u0632\u062F\u06CC\u062F\u06A9\u0646\u0646\u062F\u06AF\u0627\u0646</p></div> <label class="relative inline-flex items-center cursor-pointer" data-v-0f3499c7><input type="checkbox"${ssrIncludeBooleanAttr(Array.isArray(unref(form).isLeadCaptureEnabled) ? ssrLooseContain(unref(form).isLeadCaptureEnabled, null) : unref(form).isLeadCaptureEnabled) ? " checked" : ""} class="sr-only peer" data-v-0f3499c7> <div class="w-11 h-6 bg-muted peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[&#39;&#39;] after:absolute after:top-[2px] after:start-[2px] after:bg-card after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary" data-v-0f3499c7></div></label></div></div> `);
        if (unref(form).links && unref(form).links.length > 0) {
          _push(`<div class="space-y-3 mb-6 mt-8" data-v-0f3499c7><h3 class="text-lg font-semibold text-foreground" data-v-0f3499c7>\u0645\u062D\u062A\u0648\u0627\u06CC \u0627\u0636\u0627\u0641\u0647 \u0634\u062F\u0647</h3> `);
          _push(ssrRenderComponent(unref(draggable), {
            modelValue: unref(form).links,
            "onUpdate:modelValue": ($event) => unref(form).links = $event,
            animation: 200,
            "ghost-class": "ghost-item",
            "chosen-class": "chosen-item",
            "drag-class": "drag-item",
            "item-key": "id",
            handle: ".drag-handle",
            class: "space-y-2",
            onEnd: onDragEnd
          }, {
            item: withCtx(({ element: link, index }, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(`<div class="${ssrRenderClass([{ "shadow-lg scale-[1.02]": isDragging.value }, "bg-card border border-border rounded-xl p-4 flex items-center justify-between hover:bg-muted/20 transition-all duration-200 group"])}" data-v-0f3499c7${_scopeId}><div class="flex items-center gap-3" data-v-0f3499c7${_scopeId}><div class="drag-handle cursor-grab active:cursor-grabbing transition-opacity p-2 -m-2 touch-none" data-v-0f3499c7${_scopeId}><i class="ti ti-grip-vertical text-muted-foreground text-xl" data-v-0f3499c7${_scopeId}></i></div> <div class="w-10 h-10 rounded-lg bg-muted flex items-center justify-center" data-v-0f3499c7${_scopeId}>`);
                if (getIconComponent(link)) {
                  ssrRenderVNode(_push2, createVNode(resolveDynamicComponent(getIconComponent(link)), {
                    size: 20,
                    color: iconColor.value,
                    filled: isIconFilled.value
                  }, null), _parent2, _scopeId);
                } else if (getSafeIconUrl(link)) {
                  _push2(`<img${ssrRenderAttr("src", getSafeIconUrl(link))} class="w-5 h-5 object-contain" alt="icon" data-v-0f3499c7${_scopeId}>`);
                } else {
                  _push2(`<i class="${ssrRenderClass(`ti ti-${getFallbackIcon(link)} text-muted-foreground`)}" data-v-0f3499c7${_scopeId}></i>`);
                }
                _push2(`</div> <div data-v-0f3499c7${_scopeId}><p class="font-medium text-foreground" data-v-0f3499c7${_scopeId}>${ssrInterpolate(getLinkDisplayTitle(link))}</p></div></div> <div class="flex items-center gap-2" data-v-0f3499c7${_scopeId}><button class="w-8 h-8 rounded-lg bg-muted hover:bg-muted-foreground/20 flex items-center justify-center transition-colors" data-v-0f3499c7${_scopeId}><i class="ti ti-edit text-sm text-muted-foreground" data-v-0f3499c7${_scopeId}></i></button> <button class="w-8 h-8 rounded-lg bg-destructive/10 hover:bg-destructive/20 flex items-center justify-center transition-colors" data-v-0f3499c7${_scopeId}><i class="ti ti-trash text-sm text-destructive" data-v-0f3499c7${_scopeId}></i></button></div></div>`);
              } else {
                return [
                  createVNode("div", {
                    class: ["bg-card border border-border rounded-xl p-4 flex items-center justify-between hover:bg-muted/20 transition-all duration-200 group", { "shadow-lg scale-[1.02]": isDragging.value }]
                  }, [
                    createVNode("div", { class: "flex items-center gap-3" }, [
                      createVNode("div", { class: "drag-handle cursor-grab active:cursor-grabbing transition-opacity p-2 -m-2 touch-none" }, [
                        createVNode("i", { class: "ti ti-grip-vertical text-muted-foreground text-xl" })
                      ]),
                      createTextVNode(),
                      createVNode("div", { class: "w-10 h-10 rounded-lg bg-muted flex items-center justify-center" }, [
                        getIconComponent(link) ? (openBlock(), createBlock(resolveDynamicComponent(getIconComponent(link)), {
                          key: 0,
                          size: 20,
                          color: iconColor.value,
                          filled: isIconFilled.value
                        }, null, 8, ["color", "filled"])) : getSafeIconUrl(link) ? (openBlock(), createBlock("img", {
                          key: 1,
                          src: getSafeIconUrl(link),
                          class: "w-5 h-5 object-contain",
                          alt: "icon"
                        }, null, 8, ["src"])) : (openBlock(), createBlock("i", {
                          key: 2,
                          class: `ti ti-${getFallbackIcon(link)} text-muted-foreground`
                        }, null, 2))
                      ]),
                      createTextVNode(),
                      createVNode("div", null, [
                        createVNode("p", { class: "font-medium text-foreground" }, toDisplayString(getLinkDisplayTitle(link)), 1)
                      ])
                    ]),
                    createTextVNode(),
                    createVNode("div", { class: "flex items-center gap-2" }, [
                      createVNode("button", {
                        onClick: ($event) => editLink(link, index),
                        class: "w-8 h-8 rounded-lg bg-muted hover:bg-muted-foreground/20 flex items-center justify-center transition-colors"
                      }, [
                        createVNode("i", { class: "ti ti-edit text-sm text-muted-foreground" })
                      ], 8, ["onClick"]),
                      createTextVNode(),
                      createVNode("button", {
                        onClick: ($event) => removeLink(index),
                        class: "w-8 h-8 rounded-lg bg-destructive/10 hover:bg-destructive/20 flex items-center justify-center transition-colors"
                      }, [
                        createVNode("i", { class: "ti ti-trash text-sm text-destructive" })
                      ], 8, ["onClick"])
                    ])
                  ], 2)
                ];
              }
            }),
            _: 1
          }, _parent));
          _push(`</div>`);
        } else {
          _push(`<!---->`);
        }
        _push(` <div class="bg-card mt-4 rounded-xl p-6 border border-border hover:shadow-md transition-shadow" data-v-0f3499c7><div class="flex gap-4 mb-6" data-v-0f3499c7><div class="w-12 h-12 bg-muted/40 rounded-xl flex items-center justify-center border-2 border-dashed border-border/60 hover:border-primary/50 hover:bg-primary/5 transition-colors" data-v-0f3499c7><i class="ti ti-plus text-muted-foreground text-xl" data-v-0f3499c7></i></div> <div class="flex-1" data-v-0f3499c7><h3 class="text-base font-semibold text-foreground mb-2" data-v-0f3499c7>\u0627\u0641\u0632\u0648\u062F\u0646 \u0645\u062D\u062A\u0648\u0627</h3> <p class="text-sm text-muted-foreground leading-relaxed" data-v-0f3499c7>
                \u0627\u0637\u0644\u0627\u0639\u0627\u062A \u062A\u0645\u0627\u0633\u060C \u0634\u0628\u06A9\u0647\u200C\u0647\u0627\u06CC \u0627\u062C\u062A\u0645\u0627\u0639\u06CC\u060C \u0644\u06CC\u0646\u06A9\u200C\u0647\u0627 \u0648 \u0645\u062D\u062A\u0648\u0627\u06CC \u062F\u06CC\u06AF\u0631 \u0631\u0627 \u0628\u0647 \u06A9\u0627\u0631\u062A \u062E\u0648\u062F \u0627\u0636\u0627\u0641\u0647 \u06A9\u0646\u06CC\u062F
              </p></div></div> <button class="w-full bg-primary text-primary-foreground px-6 py-3.5 rounded-xl text-sm font-medium transition-all duration-200 flex items-center justify-center gap-3 hover:bg-primary/90 hover:shadow-lg transform hover:-translate-y-0.5" data-v-0f3499c7><i class="ti ti-plus text-lg" data-v-0f3499c7></i> <span data-v-0f3499c7>\u0627\u0641\u0632\u0648\u062F\u0646 \u0645\u062D\u062A\u0648\u0627</span> <i class="ti ti-arrow-left text-sm" data-v-0f3499c7></i></button></div> <div class="hidden lg:block mt-8" data-v-0f3499c7><div class="flex justify-end" data-v-0f3499c7><button${ssrIncludeBooleanAttr(isSaving.value) ? " disabled" : ""} class="bg-primary text-primary-foreground px-8 py-3.5 rounded-xl text-sm font-semibold transition-all duration-200 flex items-center justify-center gap-2 hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-md" data-v-0f3499c7>`);
        if (isSaving.value) {
          _push(`<!--[--><svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" data-v-0f3499c7><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" data-v-0f3499c7></circle> <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" data-v-0f3499c7></path></svg> <span class="text-sm font-medium" data-v-0f3499c7>\u062F\u0631 \u062D\u0627\u0644 \u0630\u062E\u06CC\u0631\u0647...</span><!--]-->`);
        } else {
          _push(`<!--[--><i class="ti ti-device-floppy text-lg" data-v-0f3499c7></i> <span class="text-sm font-medium" data-v-0f3499c7>\u0630\u062E\u06CC\u0631\u0647 \u062A\u063A\u06CC\u06CC\u0631\u0627\u062A</span><!--]-->`);
        }
        _push(`</button></div></div></div> <div class="lg:col-span-2 space-y-4 sticky z-0 top-16 h-fit w-full hidden lg:block" data-v-0f3499c7><div class="flex justify-center" data-v-0f3499c7><div class="relative" style="${ssrRenderStyle({ "width": "390px", "height": "844px" })}" data-v-0f3499c7><div class="absolute inset-0 rounded-[40px] border-4 border-gray-800 bg-black shadow-xl" data-v-0f3499c7><div class="absolute top-[15%] -left-[5px] w-[4px] h-5 bg-slate-700 rounded-xl" data-v-0f3499c7></div> <div class="absolute top-[25%] -left-[5px] w-[4px] h-10 bg-slate-700 rounded-xl" data-v-0f3499c7></div> <div class="absolute top-[35%] -left-[5px] w-[4px] h-10 bg-slate-700 rounded-xl" data-v-0f3499c7></div> <div class="absolute top-[35%] -right-[5px] w-[4px] h-16 bg-slate-700 rounded-xl" data-v-0f3499c7></div> <div class="absolute top-3 left-1/2 -translate-x-1/2 w-16 h-5 bg-black rounded-xl z-20" data-v-0f3499c7></div> <div class="absolute inset-2 rounded-[32px] overflow-hidden bg-white" data-v-0f3499c7>`);
        _push(ssrRenderComponent(_component_ClientOnly, null, {
          fallback: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<div class="w-full h-full bg-gray-100 rounded-[28px] flex items-center justify-center" data-v-0f3499c7${_scopeId}><div class="text-gray-500" data-v-0f3499c7${_scopeId}>\u062F\u0631 \u062D\u0627\u0644 \u0628\u0627\u0631\u06AF\u0630\u0627\u0631\u06CC...</div></div>`);
            } else {
              return [
                createVNode("div", { class: "w-full h-full bg-gray-100 rounded-[28px] flex items-center justify-center" }, [
                  createVNode("div", { class: "text-gray-500" }, "\u062F\u0631 \u062D\u0627\u0644 \u0628\u0627\u0631\u06AF\u0630\u0627\u0631\u06CC...")
                ])
              ];
            }
          })
        }, _parent));
        _push(`</div></div></div></div></div></div>`);
      }
      _push(` <div class="fixed bottom-0 left-0 right-0 bg-background/95 backdrop-blur-lg border-t border-border p-4 z-40 lg:hidden" data-v-0f3499c7><div class="max-w-4xl mx-auto flex gap-3" data-v-0f3499c7><button class="flex-1 bg-muted text-foreground px-6 py-3 rounded-xl text-sm font-medium transition-all duration-200 flex items-center justify-center gap-2 hover:bg-muted/80" data-v-0f3499c7><i class="ti ti-eye text-lg" data-v-0f3499c7></i> <span data-v-0f3499c7>\u067E\u06CC\u0634\u200C\u0646\u0645\u0627\u06CC\u0634</span></button> <button${ssrIncludeBooleanAttr(isSaving.value) ? " disabled" : ""} class="flex-2 bg-primary text-primary-foreground px-6 py-3 rounded-xl text-sm font-medium transition-all duration-200 flex items-center justify-center gap-2 hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed" data-v-0f3499c7>`);
      if (isSaving.value) {
        _push(`<!--[--><svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" data-v-0f3499c7><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" data-v-0f3499c7></circle> <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" data-v-0f3499c7></path></svg> <span class="text-sm font-medium" data-v-0f3499c7>\u062F\u0631 \u062D\u0627\u0644 \u0630\u062E\u06CC\u0631\u0647...</span><!--]-->`);
      } else {
        _push(`<!--[--><i class="ti ti-device-floppy text-lg" data-v-0f3499c7></i> <span class="text-sm font-medium" data-v-0f3499c7>\u0630\u062E\u06CC\u0631\u0647 \u062A\u063A\u06CC\u06CC\u0631\u0627\u062A</span><!--]-->`);
      }
      _push(`</button></div></div> `);
      if (showPreviewMobile.value) {
        _push(`<div class="fixed inset-0 z-[9999] lg:hidden bg-white" data-v-0f3499c7><div class="fixed top-0 left-0 right-0 z-10 bg-white border-b border-gray-200 safe-area-top" data-v-0f3499c7><div class="flex items-center justify-between px-4 py-3" data-v-0f3499c7><button class="flex items-center gap-2 text-gray-700 hover:text-gray-900 transition-colors" data-v-0f3499c7><i class="ti ti-arrow-right text-xl" data-v-0f3499c7></i> <span class="text-sm font-medium" data-v-0f3499c7>\u0628\u0627\u0632\u06AF\u0634\u062A</span></button> <h2 class="text-base font-semibold text-gray-800" data-v-0f3499c7>\u067E\u06CC\u0634\u200C\u0646\u0645\u0627\u06CC\u0634</h2> <div class="w-16" data-v-0f3499c7></div></div></div> <div class="pt-14 h-full w-full bg-white" data-v-0f3499c7>`);
        _push(ssrRenderComponent(_component_ClientOnly, null, {
          fallback: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<div class="w-full h-full bg-white flex items-center justify-center" data-v-0f3499c7${_scopeId}><div class="text-gray-500" data-v-0f3499c7${_scopeId}>\u062F\u0631 \u062D\u0627\u0644 \u0628\u0627\u0631\u06AF\u0630\u0627\u0631\u06CC...</div></div>`);
            } else {
              return [
                createVNode("div", { class: "w-full h-full bg-white flex items-center justify-center" }, [
                  createVNode("div", { class: "text-gray-500" }, "\u062F\u0631 \u062D\u0627\u0644 \u0628\u0627\u0631\u06AF\u0630\u0627\u0631\u06CC...")
                ])
              ];
            }
          })
        }, _parent));
        _push(`</div></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(` `);
      if (showAddModal.value) {
        _push(ssrRenderComponent(_sfc_main$g, {
          cardId: cardId.value,
          onClose: ($event) => showAddModal.value = false,
          onAddLink: handleAddLink
        }, null, _parent));
      } else {
        _push(`<!---->`);
      }
      _push(` `);
      if (showEditSheet.value) {
        _push(`<div class="fixed inset-0 bg-black/50 backdrop-blur flex items-center justify-center z-[60] p-0 lg:p-4" data-v-0f3499c7><div class="bg-background rounded-none lg:rounded-2xl w-full h-full lg:max-w-md lg:h-auto lg:max-h-[90vh] overflow-y-auto overflow-x-hidden lg:shadow-2xl border-0 lg:border border-border" data-v-0f3499c7><div class="flex items-center justify-between p-4 border-b border-border bg-background sticky top-0 z-10" data-v-0f3499c7><button class="text-muted-foreground hover:text-foreground flex items-center gap-2 transition-colors" data-v-0f3499c7><i class="ti ti-arrow-right text-lg" data-v-0f3499c7></i> <span class="text-sm font-medium" data-v-0f3499c7>\u0628\u0631\u06AF\u0634\u062A</span></button> <h3 class="text-base font-semibold text-foreground" data-v-0f3499c7>${ssrInterpolate(getEditSheetTitle())}</h3> <div class="flex items-center gap-2" data-v-0f3499c7>`);
        if (editingLink.value && getEditLinkUrl(editingLink.value)) {
          _push(`<a${ssrRenderAttr("href", getEditLinkUrl(editingLink.value))} target="_blank" class="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors" title="\u0645\u0634\u0627\u0647\u062F\u0647 \u0644\u06CC\u0646\u06A9" data-v-0f3499c7><i class="ti ti-external-link text-lg" data-v-0f3499c7></i></a>`);
        } else {
          _push(`<!---->`);
        }
        _push(` `);
        if (editingLink.value) {
          _push(`<button type="button" class="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-destructive/10 text-destructive hover:text-destructive/80 transition-colors" title="\u062D\u0630\u0641" data-v-0f3499c7><i class="ti ti-trash text-lg" data-v-0f3499c7></i></button>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div></div> <div class="flex-1" data-v-0f3499c7>`);
        if (editingLink.value) {
          ssrRenderVNode(_push, createVNode(resolveDynamicComponent(getEditComponent(editingLink.value)), {
            link: editingLink.value,
            cardId: cardId.value,
            onCancel: cancelEdit,
            onBack: cancelEdit,
            onSubmit: saveEditedLink,
            onDelete: () => {
              removeLink(editingLinkIndex.value);
              cancelEdit();
            }
          }, null), _parent);
        } else {
          _push(`<!---->`);
        }
        _push(`</div></div></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div> `);
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/UserDashboard/main/EditCard/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const EditCard = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-0f3499c7"]]);

export { EditCard as E };
//# sourceMappingURL=index-Bo0AYA9H.mjs.map
