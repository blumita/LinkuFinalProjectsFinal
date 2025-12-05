import { mergeProps, ref, computed, watch, createVNode, resolveDynamicComponent, unref, isRef, withCtx, watchEffect, provide, nextTick, defineComponent, createBlock, openBlock, inject, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderList, ssrRenderClass, ssrInterpolate, ssrIncludeBooleanAttr, ssrRenderVNode, ssrRenderStyle, ssrRenderAttr } from 'vue/server-renderer';
import { _ as __nuxt_component_0$3, a as useNuxtApp } from './server.mjs';
import { u as useFormStore, d as defaultFields } from './form-CUJQskNk.mjs';
import { u as useLinkStore, _ as _sfc_main$1S, a as _sfc_main$1R, b as _sfc_main$1Q, c as _sfc_main$1P, C as CardNameModal, d as _sfc_main$g, e as _sfc_main$e, E as EditForms } from './index-DEV-nTu9.mjs';
import { I as ImageCropperModal } from './ImageCropperModal-BfuAYe_c.mjs';
import { I as InfoToast } from './InfoToast-DdxwJ7kO.mjs';
import { u as useCardStore } from './card-CINoY8tz.mjs';
import draggable from 'vuedraggable';
import { u as useIconComponents } from './useIconComponentsMap-DPTCqB5g.mjs';
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
import 'swiper/vue';
import 'swiper/modules';
import './BottomSheet-DZASh2SV.mjs';
import './user-D1YL8aKq.mjs';
import 'vue-advanced-cropper';

const _sfc_main$6 = {
  __name: "ImageUploader",
  __ssrInlineRender: true,
  props: {
    image: String,
    field: String,
    aspectRatio: Number,
    wide: Boolean,
    disabled: Boolean
  },
  emits: ["select", "remove"],
  setup(__props, { emit: __emit }) {
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "flex flex-col items-center" }, _attrs))}><div class="${ssrRenderClass(["relative", __props.wide ? "w-full h-32 rounded-lg" : "w-28 h-28 rounded-full"])}"><div class="${ssrRenderClass([
        "w-full h-full bg-card border border-border flex items-center justify-center transition overflow-hidden",
        __props.wide ? "rounded-lg" : "rounded-full",
        __props.disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer hover:border-primary"
      ])}"><input type="file" accept="image/*,video/*,.gif" class="${ssrRenderClass([__props.disabled ? "cursor-not-allowed" : "cursor-pointer", "absolute inset-0 opacity-0 w-full"])}"${ssrIncludeBooleanAttr(__props.disabled) ? " disabled" : ""}> `);
      if (__props.image) {
        _push(`<img${ssrRenderAttr("src", __props.image)} class="${ssrRenderClass(["w-full h-full object-cover", __props.wide ? "rounded-lg" : "rounded-full"])}">`);
      } else {
        _push(`<div class="flex flex-col items-center justify-center text-center px-1"><i class="${ssrRenderClass(["text-2xl text-muted-foreground", __props.wide ? "ti ti-photo" : "ti ti-user"])}"></i> <span class="text-[10px] text-muted-foreground mt-1 leading-tight">`);
        if (__props.disabled) {
          _push(`<!--[-->\u063A\u06CC\u0631\u0641\u0639\u0627\u0644<!--]-->`);
        } else if (__props.field === "profileImage") {
          _push(`<!--[-->\u0639\u06A9\u0633 \u067E\u0631\u0648\u0641\u0627\u06CC\u0644<!--]-->`);
        } else if (__props.field === "coverImage") {
          _push(`<!--[-->\u0639\u06A9\u0633 \u0647\u062F\u0631<!--]-->`);
        } else if (__props.field === "logoImage") {
          _push(`<!--[-->\u0644\u0648\u06AF\u0648 \u0634\u0631\u06A9\u062A<!--]-->`);
        } else {
          _push(`<!--[-->\u0627\u0646\u062A\u062E\u0627\u0628 \u0641\u0627\u06CC\u0644<!--]-->`);
        }
        _push(`</span></div>`);
      }
      _push(`</div> `);
      if (__props.image && !__props.disabled) {
        _push(`<button type="button" class="absolute -top-0 right-2 w-6 h-6 bg-background border border-border text-muted-foreground rounded-full flex items-center justify-center hover:bg-destructive hover:text-destructive-foreground transition text-xs shadow"><i class="ti ti-x text-sm"></i></button>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div></div>`);
    };
  }
};
const _sfc_setup$6 = _sfc_main$6.setup;
_sfc_main$6.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/UserDashboard/main/EditCard/tabs/about/ImageUploader.vue");
  return _sfc_setup$6 ? _sfc_setup$6(props, ctx) : void 0;
};
const _sfc_main$5 = {
  __name: "TabAbout",
  __ssrInlineRender: true,
  props: {
    isAddMode: {
      type: Boolean,
      default: false
    }
  },
  emits: ["go-to-next-step"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const { $axios } = useNuxtApp();
    const formStore = useFormStore();
    const form = useFormStore();
    ref(false);
    const cardNameModalOpen = ref(false);
    const cropper = ref({ show: false, imageFile: void 0, aspectRatio: 1, fieldName: "" });
    const saving = ref(false);
    const isAboutComplete = computed(() => {
      return !!(form.name && form.name.trim().length > 0 && !nameError.value);
    });
    const nameError = computed(() => {
      if (!form.name || form.name.trim().length === 0) {
        return props.isAddMode ? "\u0646\u0627\u0645 \u06A9\u0627\u0645\u0644 \u0627\u0644\u0632\u0627\u0645\u06CC \u0627\u0633\u062A" : "";
      }
      if (form.name.trim().length < 2) {
        return "\u0646\u0627\u0645 \u0628\u0627\u06CC\u062F \u062D\u062F\u0627\u0642\u0644 \u06F2 \u06A9\u0627\u0631\u0627\u06A9\u062A\u0631 \u0628\u0627\u0634\u062F";
      }
      if (form.name.length > 40) {
        return "\u062D\u062F\u0627\u06A9\u062B\u0631 \u06F4\u06F0 \u06A9\u0627\u0631\u0627\u06A9\u062A\u0631 \u0645\u062C\u0627\u0632 \u0627\u0633\u062A";
      }
      const namePattern = /^[آ-یa-zA-Z\s]+$/;
      if (!namePattern.test(form.name.trim())) {
        return "\u0641\u0642\u0637 \u062D\u0631\u0648\u0641 \u0641\u0627\u0631\u0633\u06CC\u060C \u0627\u0646\u06AF\u0644\u06CC\u0633\u06CC \u0648 \u0641\u0627\u0635\u0644\u0647 \u0645\u062C\u0627\u0632 \u0627\u0633\u062A";
      }
      return "";
    });
    const formSaved = computed(() => form.formSaved);
    ref("");
    const showToast = ref(false);
    const toastMessage = ref("");
    const toastIcon = ref("ti-alert-triangle");
    function handleImageUpload({ file, field, aspectRatio }) {
      cropper.value = { show: true, imageFile: file, aspectRatio, fieldName: field };
    }
    function saveCroppedImage(base64) {
      if (!base64 || !cropper.value.fieldName) return;
      form[cropper.value.fieldName] = base64;
      closeCropper();
    }
    function closeCropper() {
      cropper.value = { show: false, imageFile: void 0, aspectRatio: 1, fieldName: "" };
    }
    function removeImage(field) {
      form[field] = null;
    }
    function closeCardNameModal() {
      cardNameModalOpen.value = false;
    }
    function updateCardName(newName) {
      form.cardName = newName;
      cardNameModalOpen.value = false;
    }
    const dropdownOpen = ref(false);
    const layoutOptions = {
      right: "\u0631\u0627\u0633\u062A\u200C\u0686\u06CC\u0646",
      left: "\u0686\u067E\u200C\u0686\u06CC\u0646",
      center: "\u0648\u0633\u0637\u200C\u0686\u06CC\u0646",
      portrait: "\u067E\u0631\u062A\u0631\u0647"
    };
    const layoutLabel = computed(() => layoutOptions[form.layout]);
    const cardNameLabel = computed(() => typeof form.cardName === "string" && form.cardName.trim() !== "" ? form.cardName : "\u0646\u0627\u0645 \u06A9\u0627\u0631\u062A \u0631\u0627 \u0648\u0627\u0631\u062F \u06A9\u0646\u06CC\u062F");
    const linkStore = useLinkStore();
    const cardStore = useCardStore();
    watchEffect(async () => {
      const id = formStore.newCard.id;
      if (!id) return;
      await linkStore.fetchLinks(id);
      form.links = linkStore.links;
      await cardStore.fetchCard(id);
      const fetchedFields = cardStore.activeCard.fields;
      if (Array.isArray(fetchedFields)) {
        form.fields = fetchedFields;
      }
      if (!Array.isArray(form.fields) || form.fields.length === 0) {
        form.fields = structuredClone(defaultFields);
      }
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<!--[--><div class="space-y-3"><div class="flex flex-wrap justify-between items-center w-full"><div class="flex gap-2"><div class="${ssrRenderClass([[
        formSaved.value ? "cursor-not-allowed opacity-60" : "cursor-pointer",
        typeof unref(form).cardName !== "string" || !unref(form).cardName.trim() ? "border-red-500 text-red-600" : "border-gray-200 text-gray-700"
      ], "flex items-center gap-2 bg-gray-50 px-3 py-2 rounded-lg border border-gray-200"])}"><label class="text-sm font-medium text-gray-700 hidden md:block">\u0646\u0627\u0645 \u06A9\u0627\u0631\u062A:</label> <span class="text-sm font-semibold text-gray-800 hidden md:block">${ssrInterpolate(cardNameLabel.value)}</span> <i class="${ssrRenderClass([formSaved.value ? "text-gray-300" : "text-gray-400", "ti ti-pencil text-sm"])}"></i></div> <button class="bg-black text-white px-4 py-2 rounded-lg flex items-center gap-2 shadow-sm sm:hidden"><i class="ti ti-eye text-base"></i> <span class="text-sm font-medium">\u067E\u06CC\u0634\u200C\u0646\u0645\u0627\u06CC\u0634</span></button></div> <div class="relative text-sm"><div class="${ssrRenderClass([formSaved.value ? "text-gray-400 cursor-not-allowed bg-gray-100" : "text-gray-700", "flex items-center gap-1 cursor-pointer bg-gray-50 border border-gray-200 px-3 py-2 rounded-lg"])}"><span>${ssrInterpolate(layoutLabel.value)}</span> <i class="ti ti-chevron-down text-xs"></i></div> `);
      if (dropdownOpen.value) {
        _push(`<ul class="absolute right-0 mt-1 w-40 bg-white border border-gray-200 rounded shadow z-10 text-right text-gray-700"><!--[-->`);
        ssrRenderList(layoutOptions, (label, value) => {
          _push(`<li class="px-3 py-1.5 hover:bg-gray-100 cursor-pointer">${ssrInterpolate(label)}</li>`);
        });
        _push(`<!--]--></ul>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div></div> <div class="grid grid-cols-1 sm:grid-cols-3 gap-2 border p-4 border-gray-200 rounded-lg">`);
      _push(ssrRenderComponent(_sfc_main$6, {
        label: "\u0639\u06A9\u0633 \u067E\u0631\u0648\u0641\u0627\u06CC\u0644",
        image: unref(form).profileImage,
        field: "profileImage",
        aspectRatio: 1,
        onSelect: handleImageUpload,
        onRemove: removeImage,
        disabled: formSaved.value
      }, null, _parent));
      _push(` `);
      _push(ssrRenderComponent(_sfc_main$6, {
        label: "\u062A\u0635\u0648\u06CC\u0631 \u06A9\u0627\u0648\u0631",
        image: unref(form).coverImage,
        field: "coverImage",
        aspectRatio: 1.78,
        wide: "",
        onSelect: handleImageUpload,
        onRemove: removeImage,
        disabled: formSaved.value
      }, null, _parent));
      _push(` `);
      _push(ssrRenderComponent(_sfc_main$6, {
        label: "\u0644\u0648\u06AF\u0648\u06CC \u0634\u0631\u06A9\u062A",
        image: unref(form).logoImage,
        field: "logoImage",
        aspectRatio: 1,
        onSelect: handleImageUpload,
        onRemove: removeImage,
        disabled: formSaved.value
      }, null, _parent));
      _push(`</div> <div class="space-y-4"><div class="grid grid-cols-1">`);
      _push(ssrRenderComponent(_sfc_main$1S, {
        label: "\u0646\u0627\u0645 \u06A9\u0627\u0645\u0644",
        modelValue: unref(form).name,
        "onUpdate:modelValue": ($event) => unref(form).name = $event,
        placeholder: "\u0646\u0627\u0645 \u0648 \u0646\u0627\u0645 \u062E\u0627\u0646\u0648\u0627\u062F\u06AF\u06CC",
        maxlength: 40,
        required: true,
        error: nameError.value,
        disabled: formSaved.value
      }, null, _parent));
      _push(`</div> <div class="grid grid-cols-1 md:grid-cols-2 gap-4">`);
      _push(ssrRenderComponent(_sfc_main$1S, {
        label: "\u0633\u0645\u062A \u0634\u063A\u0644\u06CC",
        modelValue: unref(form).job,
        "onUpdate:modelValue": ($event) => unref(form).job = $event,
        placeholder: "\u0639\u0646\u0648\u0627\u0646 \u0634\u063A\u0644\u06CC",
        maxlength: 30,
        error: unref(form).job && unref(form).job.length > 30 ? "\u062D\u062F\u0627\u06A9\u062B\u0631 \u06F3\u06F0 \u06A9\u0627\u0631\u0627\u06A9\u062A\u0631 \u0645\u062C\u0627\u0632 \u0627\u0633\u062A" : "",
        disabled: formSaved.value
      }, null, _parent));
      _push(` `);
      _push(ssrRenderComponent(_sfc_main$1S, {
        label: "\u0634\u0631\u06A9\u062A",
        modelValue: unref(form).company,
        "onUpdate:modelValue": ($event) => unref(form).company = $event,
        placeholder: "\u0646\u0627\u0645 \u0633\u0627\u0632\u0645\u0627\u0646",
        maxlength: 30,
        error: unref(form).company && unref(form).company.length > 30 ? "\u062D\u062F\u0627\u06A9\u062B\u0631 \u06F3\u06F0 \u06A9\u0627\u0631\u0627\u06A9\u062A\u0631 \u0645\u062C\u0627\u0632 \u0627\u0633\u062A" : "",
        disabled: formSaved.value
      }, null, _parent));
      _push(`</div> <div class="grid grid-cols-1">`);
      _push(ssrRenderComponent(_sfc_main$1S, {
        label: "\u0645\u0648\u0642\u0639\u06CC\u062A \u062C\u063A\u0631\u0627\u0641\u06CC\u0627\u06CC\u06CC",
        modelValue: unref(form).location,
        "onUpdate:modelValue": ($event) => unref(form).location = $event,
        placeholder: "\u0634\u0647\u0631\u060C \u06A9\u0634\u0648\u0631",
        maxlength: 30,
        error: unref(form).location && unref(form).location.length > 30 ? "\u062D\u062F\u0627\u06A9\u062B\u0631 \u06F3\u06F0 \u06A9\u0627\u0631\u0627\u06A9\u062A\u0631 \u0645\u062C\u0627\u0632 \u0627\u0633\u062A" : "",
        disabled: formSaved.value
      }, null, _parent));
      _push(`</div></div> `);
      _push(ssrRenderComponent(_sfc_main$1R, {
        label: "\u0628\u06CC\u0648\u06AF\u0631\u0627\u0641\u06CC",
        modelValue: unref(form).bio,
        "onUpdate:modelValue": ($event) => unref(form).bio = $event,
        placeholder: "\u062F\u0631\u0628\u0627\u0631\u0647 \u062E\u0648\u062F \u062A\u0648\u0636\u06CC\u062D \u062F\u0647\u06CC\u062F...",
        maxlength: 100,
        error: unref(form).bio && unref(form).bio.length > 100 ? "\u062D\u062F\u0627\u06A9\u062B\u0631 100 \u06A9\u0627\u0631\u0627\u06A9\u062A\u0631 \u0645\u062C\u0627\u0632 \u0627\u0633\u062A" : "",
        disabled: formSaved.value
      }, null, _parent));
      _push(` `);
      _push(ssrRenderComponent(_sfc_main$1S, {
        label: "\u0639\u0646\u0648\u0627\u0646 \u062F\u06A9\u0645\u0647 \u0630\u062E\u06CC\u0631\u0647 \u0645\u062E\u0627\u0637\u0628",
        modelValue: unref(form).saveContact,
        "onUpdate:modelValue": ($event) => unref(form).saveContact = $event,
        placeholder: "\u062F\u06A9\u0645\u0647 \u0630\u062E\u06CC\u0631\u0647 \u0645\u062E\u0627\u0637\u0628",
        maxlength: 20,
        error: unref(form).saveContact && unref(form).saveContact.length > 20 ? "\u062D\u062F\u0627\u06A9\u062B\u0631 \u06F2\u06F0 \u06A9\u0627\u0631\u0627\u06A9\u062A\u0631 \u0645\u062C\u0627\u0632 \u0627\u0633\u062A" : "",
        disabled: formSaved.value
      }, null, _parent));
      _push(` <div><h3 class="text-base font-medium text-gray-600 pb-2">\u0628\u062E\u0634 \u0631\u0646\u06AF \u0638\u0627\u0647\u0631\u06CC \u06A9\u0627\u0631\u062A</h3> <div class="bg-gray-100 p-4 rounded-2xl space-y-4">`);
      _push(ssrRenderComponent(_sfc_main$1Q, {
        themeColor: unref(form).themeColor,
        onUpdate: (color) => unref(form).themeColor = color,
        disabled: formSaved.value
      }, null, _parent));
      _push(` `);
      _push(ssrRenderComponent(_sfc_main$1P, {
        selected: unref(form).iconColor,
        "match-theme-color": false,
        onUpdate: (color) => unref(form).iconColor = color,
        "onUpdate:matchTheme": (val) => unref(form).matchThemeColor = val,
        disabled: formSaved.value
      }, null, _parent));
      _push(`</div></div> `);
      if (__props.isAddMode) {
        _push(`<div class="flex justify-between items-center pt-4 border-t"><div class="text-sm">`);
        if (isAboutComplete.value) {
          _push(`<span class="text-green-600 flex items-center"><i class="ti ti-check ml-1"></i>
          \u0622\u0645\u0627\u062F\u0647 \u0628\u0631\u0627\u06CC \u0645\u0631\u062D\u0644\u0647 \u0628\u0639\u062F
        </span>`);
        } else if (nameError.value) {
          _push(`<span class="text-red-600 flex items-center"><i class="ti ti-alert-circle ml-1"></i> ${ssrInterpolate(nameError.value)}</span>`);
        } else {
          _push(`<span class="text-gray-600">
          \u0646\u0627\u0645 \u06A9\u0627\u0645\u0644 \u0631\u0627 \u0648\u0627\u0631\u062F \u06A9\u0646\u06CC\u062F
        </span>`);
        }
        _push(`</div> <button${ssrIncludeBooleanAttr(!isAboutComplete.value) ? " disabled" : ""} class="${ssrRenderClass([{
          "bg-black hover:bg-gray-800 text-white": isAboutComplete.value,
          "bg-gray-300 text-gray-500 cursor-not-allowed": !isAboutComplete.value
        }, "px-6 py-3 rounded-md transition-colors text-sm font-medium"])}"><i class="ti ti-arrow-left ml-1"></i>
        \u0627\u062F\u0627\u0645\u0647
      </button></div>`);
      } else {
        _push(`<div class="flex justify-end space-x-3 pt-4"><button class="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50">
        \u0628\u0627\u0632\u0646\u0634\u0627\u0646\u06CC
      </button> <button${ssrIncludeBooleanAttr(saving.value) ? " disabled" : ""} class="px-4 py-2 bg-black text-white rounded-md hover:bg-black/90 flex items-center min-w-[140px] justify-center">`);
        if (saving.value) {
          _push(`<!--[--><svg class="animate-spin mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle> <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path></svg> <span>\u062F\u0631 \u062D\u0627\u0644 \u0630\u062E\u06CC\u0631\u0647 \u0627\u0637\u0644\u0627\u0639\u0627\u062A...</span><!--]-->`);
        } else {
          _push(`<span>\u0630\u062E\u06CC\u0631\u0647 \u062A\u063A\u06CC\u06CC\u0631\u0627\u062A</span>`);
        }
        _push(`</button></div>`);
      }
      _push(` `);
      _push(ssrRenderComponent(CardNameModal, {
        isOpen: cardNameModalOpen.value,
        currentCardName: typeof unref(form).cardName === "string" ? unref(form).cardName : "",
        onClose: closeCardNameModal,
        onUpdate: updateCardName
      }, null, _parent));
      _push(` `);
      if (cropper.value.show) {
        _push(ssrRenderComponent(ImageCropperModal, {
          show: cropper.value.show,
          "image-file": cropper.value.imageFile,
          "aspect-ratio": cropper.value.aspectRatio,
          onClose: closeCropper,
          onSave: saveCroppedImage
        }, null, _parent));
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
const _sfc_setup$5 = _sfc_main$5.setup;
_sfc_main$5.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/UserDashboard/main/AddCard/tabs/TabAbout.vue");
  return _sfc_setup$5 ? _sfc_setup$5(props, ctx) : void 0;
};
const _sfc_main$4 = /* @__PURE__ */ defineComponent({
  __name: "LinkItem",
  __ssrInlineRender: true,
  props: {
    link: {},
    count: {}
  },
  emits: ["edit", "toggle", "remove", "select-as-single"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const formStore = useFormStore();
    const hasCustomColor = computed(() => {
      var _a;
      return !!(((_a = formStore.iconColor) == null ? void 0 : _a.background) && formStore.iconColor.background !== "transparent");
    });
    const iconColor = computed(() => {
      if (hasCustomColor.value) {
        return formStore.iconColor.background;
      }
      return void 0;
    });
    const { getIconComponent } = useIconComponents();
    const iconData = computed(() => {
      return props.link.icon || null;
    });
    const safeIconUrl = computed(() => {
      const icon = iconData.value;
      if (icon && typeof icon === "object") {
        const iconWithUrl = icon;
        if (iconWithUrl.url) {
          return iconWithUrl.url;
        }
      }
      return null;
    });
    const isBasicLink = inject("isBasicLink", null);
    const singleLink = inject("singleLink", ref(false));
    const isSingleLinkActive = computed(() => {
      if (typeof singleLink === "boolean") return singleLink;
      return (singleLink == null ? void 0 : singleLink.value) || false;
    });
    const isFirstLink = computed(() => {
      return props.link.index === 0;
    });
    const iconComponent = computed(() => {
      const icon = iconData.value;
      if (icon && typeof icon === "object") {
        return getIconComponent(icon);
      }
      return null;
    });
    const categories = inject("categories", null);
    const displayTitle = computed(() => {
      const link = props.link;
      if (typeof link.displayName === "string" && link.displayName.trim()) return link.displayName.trim();
      if (typeof link.title === "string" && link.title.trim()) return link.title.trim();
      if (typeof link.name === "string" && link.name.trim()) return link.name.trim();
      if (link.type === "block" && categories && Array.isArray(categories)) {
        for (const cat of categories) {
          if (cat && typeof cat === "object" && "items" in cat && Array.isArray(cat.items)) {
            const found = cat.items.find((i) => {
              if (i && typeof i === "object") {
                const item = i;
                return item.id === link.id || item.name === link.name || item.title === link.title;
              }
              return false;
            });
            if (found && typeof found === "object") {
              const foundItem = found;
              if (foundItem.displayName && typeof foundItem.displayName === "string" && foundItem.displayName.trim()) return foundItem.displayName.trim();
              if (foundItem.title && typeof foundItem.title === "string" && foundItem.title.trim()) return foundItem.title.trim();
              if (foundItem.name && typeof foundItem.name === "string" && foundItem.name.trim()) return foundItem.name.trim();
            }
          }
        }
      }
      return link.type === "block" ? "Untitled Block" : "Untitled";
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({
        class: [
          "flex items-center justify-between bg-gray-50 rounded-2xl px-4 py-3 transition",
          {
            "cursor-pointer hover:bg-gray-100": !isSingleLinkActive.value || isFirstLink.value,
            "touch-action-none user-select-none": isSingleLinkActive.value && !isFirstLink.value
          }
        ],
        style: isSingleLinkActive.value && !isFirstLink.value ? "pointer-events: none; touch-action: none; user-select: none;" : ""
      }, _attrs))}><div class="${ssrRenderClass([{ "opacity-50": isSingleLinkActive.value && !isFirstLink.value }, "flex items-center gap-3"])}"><span class="drag-handle text-gray-300 cursor-grab"><i class="ti ti-grip-vertical text-lg"></i></span> <div class="relative w-10 h-10 rounded-xl flex items-center justify-center bg-white">`);
      if (iconComponent.value) {
        ssrRenderVNode(_push, createVNode(resolveDynamicComponent(iconComponent.value), {
          size: 32,
          color: hasCustomColor.value ? iconColor.value : void 0,
          filled: hasCustomColor.value
        }, null), _parent);
      } else if (safeIconUrl.value) {
        _push(`<img${ssrRenderAttr("src", safeIconUrl.value)} class="w-full h-full object-contain" alt="icon">`);
      } else {
        _push(`<!--[-->`);
        if (_ctx.link.type === "block") {
          _push(`<i class="ti ti-layout-grid text-gray-400 text-xl"></i>`);
        } else {
          _push(`<i class="ti ti-link text-gray-400 text-xl"></i>`);
        }
        _push(`<!--]-->`);
      }
      _push(`</div> <div class="flex items-center gap-2"><div style="${ssrRenderStyle([
        _ctx.count > 1 ? null : { display: "none" },
        { "pointer-events": "none" }
      ])}" class="bg-blue-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center border-2 border-white shadow-md">${ssrInterpolate(_ctx.count)}</div> <div class="flex flex-col"><p class="font-semibold text-sm text-black">${ssrInterpolate(displayTitle.value)}</p> `);
      if (isSingleLinkActive.value && unref(isBasicLink) && unref(isBasicLink)(_ctx.link) && isFirstLink.value) {
        _push(`<p class="text-xs text-gray-500 mt-1">
            Default link
          </p>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div></div></div> <div class="flex items-center gap-2" style="${ssrRenderStyle({ "opacity": "1 !important" })}">`);
      if ("enabled" in _ctx.link && _ctx.link.enabled === false) {
        _push(`<button class="text-gray-400 hover:text-red-700 transition p-2" style="${ssrRenderStyle({ "opacity": "1 !important", "min-width": "44px", "min-height": "44px" })}" title="Delete"><i class="ti ti-trash text-lg"></i></button>`);
      } else {
        _push(`<!---->`);
      }
      _push(` `);
      if (isSingleLinkActive.value) {
        _push(`<!--[-->`);
        if (!isFirstLink.value && (_ctx.link.type !== "block" || _ctx.link.action === "contactcard")) {
          _push(`<button class="px-3 py-2 bg-gray-200 text-gray-600 text-sm font-medium rounded-lg border-none hover:bg-gray-300 transition-all duration-200 flex items-center gap-1 cursor-pointer" style="${ssrRenderStyle({ "opacity": "1 !important", "position": "relative", "z-index": "10", "pointer-events": "auto !important", "touch-action": "manipulation !important", "user-select": "auto !important", "min-height": "44px" })}"><i class="ti ti-arrow-up text-xs"></i>
          \u0627\u0646\u062A\u062E\u0627\u0628 \u0628\u0647 \u0639\u0646\u0648\u0627\u0646 \u067E\u06CC\u0634 \u0641\u0631\u0636
        </button>`);
        } else if (isFirstLink.value) {
          _push(`<label class="relative inline-flex items-center cursor-pointer p-2" style="${ssrRenderStyle({ "opacity": "1 !important", "z-index": "10", "min-width": "44px", "min-height": "44px" })}"><input type="checkbox" class="sr-only peer"${ssrIncludeBooleanAttr("enabled" in _ctx.link ? _ctx.link.enabled : true) ? " checked" : ""}> <div class="w-11 h-6 bg-gray-300 rounded-full peer peer-checked:bg-black transition-colors"></div> <div class="absolute left-0.5 top-0.5 bg-white w-5 h-5 rounded-full shadow transition-transform peer-checked:translate-x-5"></div></label>`);
        } else if (_ctx.link.type === "block" && _ctx.link.action !== "contactcard") {
          _push(`<span class="px-3 py-2 bg-gray-100 text-gray-400 text-sm font-medium rounded-lg cursor-not-allowed flex items-center gap-1"><i class="ti ti-ban text-xs"></i>
         \u0627\u06CC\u0646 \u06AF\u0632\u06CC\u0646\u0647 \u0646\u0645\u06CC \u062A\u0648\u0627\u0646\u062F \u0644\u06CC\u0646\u06A9 \u0627\u0648\u0644 \u0627\u0646\u062A\u062E\u0627\u0628 \u0634\u0648\u062F
        </span>`);
        } else {
          _push(`<!---->`);
        }
        _push(`<!--]-->`);
      } else {
        _push(`<label class="relative inline-flex items-center cursor-pointer p-2" style="${ssrRenderStyle({ "opacity": "1 !important", "z-index": "10", "min-width": "44px", "min-height": "44px" })}"><input type="checkbox" class="sr-only peer"${ssrIncludeBooleanAttr("enabled" in _ctx.link ? _ctx.link.enabled : true) ? " checked" : ""}> <div class="w-11 h-6 bg-gray-300 rounded-full peer peer-checked:bg-black transition-colors"></div> <div class="absolute left-0.5 top-0.5 bg-white w-5 h-5 rounded-full shadow transition-transform peer-checked:translate-x-5"></div></label>`);
      }
      _push(`</div></div>`);
    };
  }
});
const _sfc_setup$4 = _sfc_main$4.setup;
_sfc_main$4.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/ui/LinkItem.vue");
  return _sfc_setup$4 ? _sfc_setup$4(props, ctx) : void 0;
};
const _sfc_main$3 = {
  __name: "FormSwitch",
  __ssrInlineRender: true,
  props: {
    modelValue: Boolean,
    label: String
  },
  emits: ["update:modelValue"],
  setup(__props, { emit: __emit }) {
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<label${ssrRenderAttrs(mergeProps({ class: "flex items-center cursor-pointer select-none gap-2" }, _attrs))} data-v-727b5e18><span class="text-sm text-gray-700" data-v-727b5e18>${ssrInterpolate(__props.label)}</span> <div class="relative" data-v-727b5e18><input type="checkbox" class="sr-only"${ssrIncludeBooleanAttr(__props.modelValue) ? " checked" : ""} data-v-727b5e18> <div class="${ssrRenderClass([__props.modelValue ? "bg-gray-900" : "bg-gray-300", "w-10 h-5 bg-gray-300 rounded-full shadow-inner transition-colors duration-200"])}" data-v-727b5e18></div> <div class="${ssrRenderClass([__props.modelValue ? "translate-x-5" : "translate-x-0", "absolute left-0 top-0 w-5 h-5 bg-white rounded-full shadow transform transition-transform duration-200"])}" data-v-727b5e18></div></div></label>`);
    };
  }
};
const _sfc_setup$3 = _sfc_main$3.setup;
_sfc_main$3.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/ui/FormSwitch.vue");
  return _sfc_setup$3 ? _sfc_setup$3(props, ctx) : void 0;
};
const FormSwitch = /* @__PURE__ */ _export_sfc(_sfc_main$3, [["__scopeId", "data-v-727b5e18"]]);
const _sfc_main$2 = {
  __name: "TabLinks",
  __ssrInlineRender: true,
  props: {
    isAddMode: {
      type: Boolean,
      default: false
    }
  },
  emits: ["create-card"],
  setup(__props, { emit: __emit }) {
    useLinkStore();
    const { $axios } = useNuxtApp();
    const formStore = useFormStore();
    const showToast = ref(false);
    const toastMessage = ref("");
    const toastIcon = ref("ti-alert-triangle");
    const showInfoToast = (message, icon = "ti-lock") => {
      toastMessage.value = message;
      toastIcon.value = icon;
      showToast.value = true;
      setTimeout(() => showToast.value = false, 3e3);
    };
    ref(false);
    computed(() => {
      return !!(formStore.name && formStore.name.trim().length > 0);
    });
    function getUsageCount(action) {
      if (!action || !formStore.links) return 1;
      return formStore.links.filter((l) => l.action === action).length;
    }
    const countMap = computed(() => {
      const map = {};
      const links = formStore.links || [];
      for (const l of links) {
        const key = String(l.action || l.id || "unknown").toLowerCase();
        map[key] = (map[key] || 0) + 1;
      }
      return map;
    });
    const showAddModal = ref(false);
    const editingItem = ref(null);
    const categories = ref([]);
    function isBasicLink(link) {
      if (!link) return false;
      const nonBasicActions = [
        "poll",
        "expandabletext",
        "questionbox",
        "leadcapture",
        "form",
        "embeddedvideo",
        "map"
      ];
      if (link.action && nonBasicActions.includes(link.action)) {
        return false;
      }
      if (link.description && String(link.description).trim().length > 0) {
        return false;
      }
      return true;
    }
    provide("isBasicLink", isBasicLink);
    provide("singleLink", computed(() => formStore.singleLink));
    const singleLink = ref(formStore.singleLink);
    watch(() => formStore.singleLink, (newVal) => {
      singleLink.value = newVal;
    });
    watch(singleLink, (newVal) => {
      if (newVal) {
        const canEnable = formStore.canEnableSingleLink();
        if (!canEnable) {
          nextTick(() => {
            singleLink.value = false;
          });
          return;
        }
        if (formStore.isLeadCaptureEnabled) {
          formStore.toggleLeadCapture(false);
        }
      }
      formStore.singleLink = newVal;
    });
    const isLeadCaptureEnabled = computed({
      get: () => formStore.isLeadCaptureEnabled,
      set: (val) => {
        formStore.toggleLeadCapture(val);
      }
    });
    function normalize(text) {
      return (text || "").toString().trim().toLowerCase();
    }
    function findItemAction(item) {
      var _a;
      for (const cat of categories.value) {
        for (const entry of cat.items || []) {
          const match = normalize(entry.id) === normalize(item.id) || normalize(entry.name) === normalize(item.name) || normalize(entry.title) === normalize(item.title);
          if (match) {
            return { action: ((_a = entry.action) == null ? void 0 : _a.toLowerCase()) || null };
          }
        }
      }
      return { action: null };
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
      const partialKey = Object.keys(EditForms).find((k) => k.toLowerCase().includes(action));
      if (partialKey) {
        return EditForms[partialKey];
      }
      return _sfc_main$e;
    }
    function editItem(item) {
      var _a, _b, _c;
      const editable = {
        ...item,
        type: item.type || (((_a = item.action) == null ? void 0 : _a.includes("block")) ? "block" : "link"),
        action: ((_b = item.action) == null ? void 0 : _b.toLowerCase()) || findItemAction(item).action,
        username: item.baseUrl && ((_c = item.value) == null ? void 0 : _c.startsWith(item.baseUrl)) ? item.value.replace(item.baseUrl, "") : item.username || ""
      };
      if (!editable.title) editable.title = item.name || "\u0628\u062F\u0648\u0646 \u0639\u0646\u0648\u0627\u0646";
      if (!editable.value) editable.value = "";
      editingItem.value = editable;
    }
    function cancelEdit() {
      editingItem.value = null;
    }
    async function saveItem(updatedItem) {
      var _a, _b, _c, _d, _e, _f, _g, _h, _i, _j, _k, _l, _m, _n, _o, _p;
      const item = { ...updatedItem };
      if (item.baseUrl && item.username) {
        item.value = item.baseUrl + item.username;
      }
      if (!item.id) return;
      const customIcon = (_a = item == null ? void 0 : item.customIcon) != null ? _a : null;
      const fileData = (_b = item == null ? void 0 : item.fileData) != null ? _b : null;
      const backgroundImage = (_c = item == null ? void 0 : item.backgroundImage) != null ? _c : null;
      try {
        const payloadLink = {
          //backgroundImage: item.backgroundImage || '',
          phoneRequired: item.phoneRequired || "",
          rewards: item.rewards || "",
          segments: item.segments || "",
          prizes: item.prizes || "",
          difficulty: item.difficulty || "",
          submitButtonText: item.submitButtonText || "",
          thankYouMessage: item.thankYouMessage || "",
          avatar: item.avatar || "",
          align: item.align || "",
          options: item.options || "",
          fileName: item.fileName || "",
          fileType: item.fileType || "",
          accountHolder: item.accountHolder || "",
          accountNumber: item.accountNumber || "",
          bankName: item.bankName || "",
          cardNumber: item.cardNumber || "",
          customBank: item.customBank || "",
          ibanNumber: item.ibanNumber || "",
          showBankDropdown: item.showBankDropdown || "",
          highlight: item.highlight || false,
          access: item.access || "",
          address: item.address || "",
          days: item.days || "",
          mode: item.mode || "",
          latitude: item.latitude || "",
          longitude: item.longitude || "",
          zoom: item.zoom || "",
          action: item.action || "",
          fields: item.fields || "",
          baseUrl: item.baseUrl || "",
          //customIcon: item.customIcon || '',
          description: item.description || "",
          enabled: item.enabled,
          icon: item.icon ? JSON.stringify(item.icon) : null,
          id: item.id,
          name: item.name,
          username: item.username || "",
          selectedItems: item.selectedItems || "",
          placeholder: item.placeholder ? JSON.stringify(item.placeholder) : null,
          showDescription: item.showDescription || false,
          title: item.title,
          type: item.type,
          value: item.value || ""
        };
        const response = await $axios.post(`v1/cards/${formStore.newCardId}/links`, { link: JSON.stringify(payloadLink) });
        if (!((_d = response.data) == null ? void 0 : _d.success)) {
          showInfoToast(response.data.message, "ti-alert-triangle");
        } else {
          const normalized = normalizeLink(response.data.data);
          const idx = formStore.links.findIndex((l) => l.id === response.data.data.id);
          if (idx !== -1) {
            formStore.links[idx] = normalized;
          }
          editingItem.value = null;
          showInfoToast(response.data.message, "ti-alert-triangle");
          if (customIcon && typeof customIcon === "string" && customIcon.startsWith("data:")) {
            const uploadResponse = await uploadCustomIcon(
              (_e = response.data) == null ? void 0 : _e.data.id,
              (_f = response.data) == null ? void 0 : _f.data.cardId,
              (_g = response.data) == null ? void 0 : _g.data.modelType,
              customIcon
            );
            if (((_h = uploadResponse.data) == null ? void 0 : _h.success) && uploadResponse.data.data) {
              const idx2 = formStore.links.findIndex((l) => l.id === response.data.data.id);
              if (idx2 !== -1) {
                formStore.links[idx2].customIcon = uploadResponse.data.data;
                formStore.links = [...formStore.links];
              }
            }
          }
          if (fileData && typeof fileData === "string" && fileData.startsWith("data:")) {
            const uploadResponse = await uploadCustomIcon(
              (_i = response.data) == null ? void 0 : _i.data.id,
              (_j = response.data) == null ? void 0 : _j.data.cardId,
              (_k = response.data) == null ? void 0 : _k.data.modelType,
              fileData,
              "fileData"
            );
            if (((_l = uploadResponse.data) == null ? void 0 : _l.success) && uploadResponse.data.data) {
              const idx2 = formStore.links.findIndex((l) => l.id === response.data.data.id);
              if (idx2 !== -1) {
                formStore.links[idx2].fileData = uploadResponse.data.data;
                formStore.links = [...formStore.links];
              }
            }
          }
          if (backgroundImage && typeof backgroundImage === "string" && backgroundImage.startsWith("data:")) {
            const uploadResponse = await uploadCustomIcon(
              (_m = response.data) == null ? void 0 : _m.data.id,
              (_n = response.data) == null ? void 0 : _n.data.cardId,
              (_o = response.data) == null ? void 0 : _o.data.modelType,
              backgroundImage,
              "backgroundImage"
            );
            if (((_p = uploadResponse.data) == null ? void 0 : _p.success) && uploadResponse.data.data) {
              const idx2 = formStore.links.findIndex((l) => l.id === response.data.data.id);
              if (idx2 !== -1) {
                formStore.links[idx2].backgroundImage = uploadResponse.data.data;
                formStore.links = [...formStore.links];
              }
            }
          }
        }
      } catch (error) {
        if (error.response) {
          showInfoToast(error.response.data.message, "ti-alert-triangle");
        } else {
          showInfoToast("\u0645\u0634\u06A9\u0644\u06CC \u062F\u0631 \u0627\u0631\u062A\u0628\u0627\u0637 \u0628\u0627 \u0633\u0631\u0648\u0631 \u0648\u062C\u0648\u062F \u062F\u0627\u0631\u062F. \u0644\u0637\u0641\u0627\u064B \u0628\u0639\u062F\u0627\u064B \u0627\u0645\u062A\u062D\u0627\u0646 \u06A9\u0646\u06CC\u062F.", "ti-alert-triangle");
        }
      }
    }
    async function deleteItem(id) {
      var _a;
      try {
        formStore.links = formStore.links.filter((l) => l.id !== id);
        editingItem.value = null;
        const response = await $axios.delete(
          `v1/cards/${formStore.newCardId}/links/${id}`,
          {
            data: {
              fieldName: "customIcon"
            }
          }
        );
        if (!((_a = response.data) == null ? void 0 : _a.success)) {
          showInfoToast(response.data.message, "ti-check");
        } else {
          showInfoToast(response.data.message, "ti-alert-triangle");
        }
      } catch (error) {
        if (error.response) {
          showInfoToast(error.response.data.message, "ti-alert-triangle");
        } else {
          showInfoToast("\u0645\u0634\u06A9\u0644\u06CC \u062F\u0631 \u0627\u0631\u062A\u0628\u0627\u0637 \u0628\u0627 \u0633\u0631\u0648\u0631 \u0648\u062C\u0648\u062F \u062F\u0627\u0631\u062F. \u0644\u0637\u0641\u0627\u064B \u0628\u0639\u062F\u0627\u064B \u0627\u0645\u062A\u062D\u0627\u0646 \u06A9\u0646\u06CC\u062F.");
        }
      }
    }
    async function toggleItem(id) {
      var _a;
      const item = formStore.links.find((l) => l.id === id);
      if (!item) return;
      const previousState = item.enabled;
      const cardId = formStore.newCardId;
      try {
        const response = await $axios.patch(`v1/cards/${cardId}/links/${id}`, { enabled: !previousState });
        if (!((_a = response.data) == null ? void 0 : _a.success)) {
          showInfoToast(response.data.message, "ti-alert-triangle");
        } else {
          item.enabled = !previousState;
          formStore.links = [...formStore.links];
          showInfoToast(response.data.message, "ti-check");
        }
      } catch (error) {
        if (error.response) {
          showInfoToast(error.response.data.message, "ti-alert-triangle");
        } else {
          showInfoToast("\u0645\u0634\u06A9\u0644\u06CC \u062F\u0631 \u0627\u0631\u062A\u0628\u0627\u0637 \u0628\u0627 \u0633\u0631\u0648\u0631 \u0648\u062C\u0648\u062F \u062F\u0627\u0631\u062F. \u0644\u0637\u0641\u0627\u064B \u0628\u0639\u062F\u0627\u064B \u0627\u0645\u062A\u062D\u0627\u0646 \u06A9\u0646\u06CC\u062F.");
          item.enabled = previousState;
          formStore.links = [...formStore.links];
        }
      }
    }
    async function selectAsSingleLink(selectedLink) {
      if (selectedLink.type === "block" && selectedLink.action !== "contactcard") {
        alert("\u0641\u0642\u0637 \u0628\u0644\u0627\u06A9 \u06A9\u0627\u0631\u062A \u062A\u0645\u0627\u0633 \u0645\u06CC\u200C\u062A\u0648\u0627\u0646\u062F \u0628\u0647 \u0639\u0646\u0648\u0627\u0646 \u0644\u06CC\u0646\u06A9 \u0627\u0648\u0644 \u0627\u0646\u062A\u062E\u0627\u0628 \u0634\u0648\u062F");
        return;
      }
      try {
        const response = await $axios.put(`v1/cards/${formStore.newCardId}/links/${selectedLink.id}/toggleSelectedAsSingleLink`);
        if (response.data.success) {
          const selectedIndex = formStore.links.findIndex((l) => l.id === selectedLink.id);
          if (selectedIndex === -1 || selectedIndex === 0) return;
          const newLinks = [...formStore.links];
          const [movedLink] = newLinks.splice(selectedIndex, 1);
          newLinks.unshift(movedLink);
          formStore.links = newLinks;
          showInfoToast(response.data.message, "ti-lock");
        } else {
          showInfoToast(response.data.message, "ti-lock");
        }
      } catch (error) {
        showInfoToast("\u0628\u0627 \u062E\u0637\u0627 \u0645\u0648\u0627\u062C\u0647 \u0634\u062F", "ti-lock");
      } finally {
      }
    }
    function handleIconUpload(e) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = (ev) => {
        editingItem.value.customIcon = ev.target.result;
      };
      reader.readAsDataURL(file);
    }
    function normalizeLink(link) {
      return {
        ...link,
        icon: link.icon ? safeJsonParse(link.icon) : null,
        placeholder: link.placeholder ? safeJsonParse(link.placeholder) : null
      };
    }
    function safeJsonParse(str) {
      try {
        return typeof str === "string" ? JSON.parse(str) : str;
      } catch {
        return str;
      }
    }
    async function addNewItem(newItem) {
      var _a, _b, _c, _d, _e, _f, _g, _h, _i, _j, _k, _l, _m, _n, _o, _p, _q, _r;
      const item = { ...newItem };
      item.id = `${Date.now()}_${Math.random().toString(36).slice(2)}`;
      item.enabled = true;
      item.type = item.type || (((_a = item.action) == null ? void 0 : _a.includes("block")) ? "block" : "link");
      const found = findItemAction(item);
      if (found.action) item.action = found.action;
      if (item.baseUrl && ((_b = item.value) == null ? void 0 : _b.startsWith(item.baseUrl))) {
        item.username = item.value.replace(item.baseUrl, "");
      }
      const customIcon = (_c = item == null ? void 0 : item.customIcon) != null ? _c : null;
      const fileData = (_d = item == null ? void 0 : item.fileData) != null ? _d : null;
      const backgroundImage = (_e = item == null ? void 0 : item.backgroundImage) != null ? _e : null;
      try {
        const payloadLink = {
          //backgroundImage: item.backgroundImage || '',
          phoneRequired: item.phoneRequired || "",
          rewards: item.rewards || "",
          segments: item.segments || "",
          prizes: item.prizes || "",
          difficulty: item.difficulty || "",
          submitButtonText: item.submitButtonText || "",
          thankYouMessage: item.thankYouMessage || "",
          avatar: item.avatar || "",
          align: item.align || "",
          options: item.options || "",
          fileName: item.fileName || "",
          fileType: item.fileType || "",
          accountHolder: item.accountHolder || "",
          accountNumber: item.accountNumber || "",
          bankName: item.bankName || "",
          cardNumber: item.cardNumber || "",
          customBank: item.customBank || "",
          ibanNumber: item.ibanNumber || "",
          showBankDropdown: item.showBankDropdown || "",
          highlight: item.highlight || false,
          access: item.access || "",
          address: item.address || "",
          days: item.days || "",
          mode: item.mode || "",
          latitude: item.latitude || "",
          longitude: item.longitude || "",
          zoom: item.zoom || "",
          action: item.action || "",
          fields: item.fields || "",
          baseUrl: item.baseUrl || "",
          //customIcon: item.customIcon || '',
          description: item.description || "",
          enabled: item.enabled,
          icon: item.icon ? JSON.stringify(item.icon) : null,
          id: item.id,
          name: item.name,
          username: item.username || "",
          selectedItems: item.selectedItems || "",
          placeholder: item.placeholder ? JSON.stringify(item.placeholder) : null,
          showDescription: item.showDescription || false,
          title: item.title,
          type: item.type,
          value: item.value || ""
        };
        const response = await $axios.post(`v1/cards/${formStore.newCardId}/links`, { link: JSON.stringify(payloadLink) });
        if (!((_f = response.data) == null ? void 0 : _f.success)) {
          showInfoToast(response.data.message, "ti-alert-triangle");
        } else {
          const normalized = normalizeLink(response.data.data);
          formStore.addLink(normalized);
          showInfoToast(response.data.message, "ti-alert-triangle");
          if (customIcon && typeof customIcon === "string" && customIcon.startsWith("data:")) {
            const uploadResponse = await uploadCustomIcon(
              (_g = response.data) == null ? void 0 : _g.data.id,
              (_h = response.data) == null ? void 0 : _h.data.cardId,
              (_i = response.data) == null ? void 0 : _i.data.modelType,
              customIcon
            );
            if (((_j = uploadResponse.data) == null ? void 0 : _j.success) && uploadResponse.data.data) {
              const idx = formStore.links.findIndex((l) => l.id === response.data.data.id);
              if (idx !== -1) {
                formStore.links[idx].customIcon = uploadResponse.data.data;
                formStore.links = [...formStore.links];
              }
            }
          }
          if (fileData && typeof fileData === "string" && fileData.startsWith("data:")) {
            const uploadResponse = await uploadCustomIcon(
              (_k = response.data) == null ? void 0 : _k.data.id,
              (_l = response.data) == null ? void 0 : _l.data.cardId,
              (_m = response.data) == null ? void 0 : _m.data.modelType,
              fileData
            );
            if (((_n = uploadResponse.data) == null ? void 0 : _n.success) && uploadResponse.data.data) {
              const idx = formStore.links.findIndex((l) => l.id === response.data.data.id);
              if (idx !== -1) {
                formStore.links[idx].fileData = uploadResponse.data.data;
                formStore.links = [...formStore.links];
              }
            }
          }
          if (backgroundImage && typeof backgroundImage === "string" && backgroundImage.startsWith("data:")) {
            const uploadResponse = await uploadCustomIcon(
              (_o = response.data) == null ? void 0 : _o.data.id,
              (_p = response.data) == null ? void 0 : _p.data.cardId,
              (_q = response.data) == null ? void 0 : _q.data.modelType,
              backgroundImage
            );
            if (((_r = uploadResponse.data) == null ? void 0 : _r.success) && uploadResponse.data.data) {
              const idx = formStore.links.findIndex((l) => l.id === response.data.data.id);
              if (idx !== -1) {
                formStore.links[idx].backgroundImage = uploadResponse.data.data;
                formStore.links = [...formStore.links];
              }
            }
          }
        }
      } catch (error) {
        if (error.response) {
          showInfoToast(error.response.data.message, "ti-alert-triangle");
        } else {
          showInfoToast("\u0645\u0634\u06A9\u0644\u06CC \u062F\u0631 \u0627\u0631\u062A\u0628\u0627\u0637 \u0628\u0627 \u0633\u0631\u0648\u0631 \u0648\u062C\u0648\u062F \u062F\u0627\u0631\u062F. \u0644\u0637\u0641\u0627\u064B \u0628\u0639\u062F\u0627\u064B \u0627\u0645\u062A\u062D\u0627\u0646 \u06A9\u0646\u06CC\u062F.", "ti-alert-triangle");
        }
      }
      showAddModal.value = false;
    }
    async function uploadCustomIcon(linkId, cardId, modelType, base64Icon, fieldName) {
      var _a;
      const formData = new FormData();
      formData.append("modelType", modelType);
      formData.append("modelId", linkId);
      function base64ToBlob(base64, mime = "image/png") {
        const byteString = atob(base64.split(",")[1]);
        const ab = new ArrayBuffer(byteString.length);
        const ia = new Uint8Array(ab);
        for (let i = 0; i < byteString.length; i++) {
          ia[i] = byteString.charCodeAt(i);
        }
        return new Blob([ab], { type: mime });
      }
      const blob = base64ToBlob(base64Icon);
      formData.append(fieldName, blob, fieldName + ".png");
      try {
        const uploadResponse = await $axios.post(`file-manager/${linkId}/upload`, formData);
        if ((_a = uploadResponse.data) == null ? void 0 : _a.success) {
          showInfoToast("\u0622\u06CC\u06A9\u0648\u0646 \u0633\u0641\u0627\u0631\u0634\u06CC \u0628\u0627 \u0645\u0648\u0641\u0642\u06CC\u062A \u0622\u067E\u0644\u0648\u062F \u0634\u062F", "ti-image");
        } else {
          showInfoToast("\u0622\u067E\u0644\u0648\u062F \u0622\u06CC\u06A9\u0648\u0646 \u0633\u0641\u0627\u0631\u0634\u06CC \u0628\u0627 \u062E\u0637\u0627 \u0645\u0648\u0627\u062C\u0647 \u0634\u062F", "ti-alert-triangle");
        }
        return uploadResponse;
      } catch (error) {
        showInfoToast("\u062E\u0637\u0627 \u062F\u0631 \u0622\u067E\u0644\u0648\u062F \u0622\u06CC\u06A9\u0648\u0646 \u0633\u0641\u0627\u0631\u0634\u06CC", "ti-alert-triangle");
      }
    }
    const isDragging = ref(false);
    async function onDragStart() {
      isDragging.value = true;
    }
    async function onDragEnd() {
      setTimeout(async () => {
        var _a;
        isDragging.value = false;
        const hashOrder = formStore.links.map((link) => link == null ? void 0 : link.hash);
        const formData = new FormData();
        hashOrder.forEach((hash, index) => {
          formData.append(`hashOrder[${index}]`, hash);
        });
        try {
          const response = await $axios.post(
            `v1/cards/${formStore.newCardId}/links/reorder`,
            formData
          );
          if (!((_a = response.data) == null ? void 0 : _a.success)) {
            showInfoToast(response.data.message, "ti-alert-triangle");
          } else {
            showInfoToast(response.data.message, "ti-check");
          }
        } catch (error) {
          if (error.response) {
            showInfoToast(error.response.data.message, "ti-alert-triangle");
          } else {
            showInfoToast(
              "\u0645\u0634\u06A9\u0644\u06CC \u062F\u0631 \u0627\u0631\u062A\u0628\u0627\u0637 \u0628\u0627 \u0633\u0631\u0648\u0631 \u0648\u062C\u0648\u062F \u062F\u0627\u0631\u062F. \u0644\u0637\u0641\u0627\u064B \u0628\u0639\u062F\u0627\u064B \u0627\u0645\u062A\u062D\u0627\u0646 \u06A9\u0646\u06CC\u062F.",
              "ti-alert-triangle"
            );
          }
        }
      }, 100);
    }
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<!--[--><div data-v-5ce3179a>`);
      if (__props.isAddMode && !editingItem.value) {
        _push(`<div class="border-b" data-v-5ce3179a><div class="flex items-center justify-between p-4 w-full" data-v-5ce3179a><h1 class="text-xl font-semibold text-gray-700" data-v-5ce3179a>\u0644\u06CC\u0646\u06A9\u200C\u0647\u0627\u06CC \u0627\u062C\u062A\u0645\u0627\u0639\u06CC</h1> `);
        if (__props.isAddMode && !editingItem.value && unref(formStore).links && unref(formStore).links.length > 0) {
          _push(`<button class="bg-black text-white px-4 py-2 rounded text-sm hover:bg-gray-800 transition" data-v-5ce3179a>
          \u0627\u0641\u0632\u0648\u062F\u0646 \u0644\u06CC\u0646\u06A9
        </button>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div></div>`);
      } else if (!editingItem.value) {
        _push(`<div class="border-b" data-v-5ce3179a><div class="lg:flex lg:space-y-0 space-y-4 items-center justify-between p-4 w-full" data-v-5ce3179a><h1 class="text-xl font-semibold w-2/4" data-v-5ce3179a>\u0644\u06CC\u0646\u06A9\u200C\u0647\u0627 </h1> <div class="lg:flex items-center gap-2 lg:space-y-0 space-y-4 lg:w-2/4" data-v-5ce3179a><div class="flex items-center gap-4 lg:w-2/3" data-v-5ce3179a>`);
        _push(ssrRenderComponent(FormSwitch, {
          label: "\u062C\u0645\u0639\u200C\u0622\u0648\u0631\u06CC \u0644\u06CC\u062F",
          modelValue: isLeadCaptureEnabled.value,
          "onUpdate:modelValue": ($event) => isLeadCaptureEnabled.value = $event
        }, null, _parent));
        _push(` `);
        _push(ssrRenderComponent(FormSwitch, {
          label: "\u0644\u06CC\u0646\u06A9 \u062A\u06A9\u06CC",
          modelValue: singleLink.value,
          "onUpdate:modelValue": ($event) => singleLink.value = $event
        }, null, _parent));
        _push(`</div> <div data-v-5ce3179a><button class="bg-black text-white px-4 py-2 rounded text-sm hover:bg-gray-800 transition lg:w-24 mt-0" data-v-5ce3179a>
              \u0627\u0641\u0632\u0648\u062F\u0646
            </button></div></div></div></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(` <div class="p-4" data-v-5ce3179a>`);
      if (!editingItem.value) {
        _push(`<div data-v-5ce3179a>`);
        if (unref(formStore).links && unref(formStore).links.length > 0) {
          _push(`<div data-v-5ce3179a>`);
          _push(ssrRenderComponent(unref(draggable), {
            modelValue: unref(formStore).links,
            "onUpdate:modelValue": ($event) => unref(formStore).links = $event,
            key: unref(formStore).newCardId,
            "item-key": "id",
            handle: ".drag-handle",
            class: "space-y-3",
            disabled: false,
            "ghost-class": "ghost",
            "chosen-class": "chosen",
            "drag-class": "drag",
            onStart: onDragStart,
            onEnd: onDragEnd
          }, {
            item: withCtx(({ element, index }, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(ssrRenderComponent(_sfc_main$4, {
                  key: element.id,
                  link: { ...element, displayName: element.title || element.name, index },
                  count: getUsageCount(element.action),
                  onEdit: editItem,
                  onToggle: toggleItem,
                  onRemove: deleteItem,
                  onSelectAsSingle: selectAsSingleLink
                }, null, _parent2, _scopeId));
              } else {
                return [
                  (openBlock(), createBlock(_sfc_main$4, {
                    key: element.id,
                    link: { ...element, displayName: element.title || element.name, index },
                    count: getUsageCount(element.action),
                    onEdit: editItem,
                    onToggle: toggleItem,
                    onRemove: deleteItem,
                    onSelectAsSingle: selectAsSingleLink
                  }, null, 8, ["link", "count"]))
                ];
              }
            }),
            _: 1
          }, _parent));
          _push(`</div>`);
        } else {
          _push(`<div class="text-center py-8 text-gray-500" data-v-5ce3179a><div class="mb-4" data-v-5ce3179a><i class="ti ti-link text-4xl text-gray-300" data-v-5ce3179a></i></div> <p class="text-lg font-medium mb-2" data-v-5ce3179a>\u0647\u0646\u0648\u0632 \u0644\u06CC\u0646\u06A9\u06CC \u0627\u0636\u0627\u0641\u0647 \u0646\u06A9\u0631\u062F\u0647\u200C\u0627\u06CC\u062F</p> <p class="text-sm mb-4" data-v-5ce3179a>\u0644\u06CC\u0646\u06A9\u200C\u0647\u0627\u06CC \u0634\u0628\u06A9\u0647\u200C\u0647\u0627\u06CC \u0627\u062C\u062A\u0645\u0627\u0639\u06CC \u0648 \u0648\u0628\u200C\u0633\u0627\u06CC\u062A \u062E\u0648\u062F \u0631\u0627 \u0627\u0636\u0627\u0641\u0647 \u06A9\u0646\u06CC\u062F</p> <button class="bg-black text-white px-6 py-3 rounded-md text-sm hover:bg-gray-800 transition font-medium" data-v-5ce3179a><i class="ti ti-plus ml-1" data-v-5ce3179a></i>
            \u0627\u0641\u0632\u0648\u062F\u0646 \u0627\u0648\u0644\u06CC\u0646 \u0644\u06CC\u0646\u06A9
          </button></div>`);
        }
        _push(`</div>`);
      } else {
        ssrRenderVNode(_push, createVNode(resolveDynamicComponent(getEditComponent(editingItem.value)), {
          link: editingItem.value,
          cradId: unref(formStore).newCardId,
          onCancel: cancelEdit,
          onSubmit: saveItem,
          onDelete: () => deleteItem(editingItem.value.id),
          onUploadIcon: handleIconUpload
        }, null), _parent);
      }
      _push(`</div> `);
      if (showAddModal.value) {
        _push(ssrRenderComponent(_sfc_main$g, {
          "count-map": countMap.value,
          cardId: unref(formStore).newCardId,
          onClose: ($event) => showAddModal.value = false,
          onAddLink: addNewItem
        }, null, _parent));
      } else {
        _push(`<!---->`);
      }
      _push(` `);
      if (__props.isAddMode) {
        _push(`<div class="mt-8 pt-6 border-t" data-v-5ce3179a><div class="flex justify-between items-center" data-v-5ce3179a><div class="text-sm text-gray-600" data-v-5ce3179a><span data-v-5ce3179a>${ssrInterpolate(unref(formStore).links && unref(formStore).links.length > 0 ? `${unref(formStore).links.length} \u0644\u06CC\u0646\u06A9 \u0627\u0636\u0627\u0641\u0647 \u0634\u062F\u0647` : "\u0647\u0646\u0648\u0632 \u0644\u06CC\u0646\u06A9\u06CC \u0627\u0636\u0627\u0641\u0647 \u0646\u0634\u062F\u0647")}</span></div></div></div>`);
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
const _sfc_setup$2 = _sfc_main$2.setup;
_sfc_main$2.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/UserDashboard/main/AddCard/tabs/TabLinks.vue");
  return _sfc_setup$2 ? _sfc_setup$2(props, ctx) : void 0;
};
const TabLinks = /* @__PURE__ */ _export_sfc(_sfc_main$2, [["__scopeId", "data-v-5ce3179a"]]);
const _sfc_main$1 = {
  __name: "index",
  __ssrInlineRender: true,
  setup(__props) {
    const formStore = useFormStore();
    const showToast = ref(false);
    const toastMessage = ref("");
    const toastIcon = ref("ti-alert-triangle");
    const showInfoToast = (message, icon = "ti-lock") => {
      toastMessage.value = message;
      toastIcon.value = icon;
      showToast.value = true;
      setTimeout(() => showToast.value = false, 3e3);
    };
    const activeTab = ref("about");
    ref(false);
    const tabGroups = [
      {
        id: 1,
        items: [
          { id: "about", label: "\u062F\u0631\u0628\u0627\u0631\u0647", icon: "ti ti-user" },
          { id: "links", label: "\u0644\u06CC\u0646\u06A9\u200C\u0647\u0627", icon: "ti ti-link" }
        ]
      }
    ];
    const currentTabComponent = computed(() => {
      const components = {
        about: _sfc_main$5,
        links: TabLinks
      };
      return components[activeTab.value] || _sfc_main$5;
    });
    const isAboutComplete = computed(() => {
      var _a;
      const name = (_a = formStore.name) == null ? void 0 : _a.trim();
      if (!name || name.length === 0) return false;
      if (name.length < 2) return false;
      if (name.length > 40) return false;
      const namePattern = /^[آ-یa-zA-Z\s]+$/;
      return namePattern.test(name);
    });
    computed(() => {
      return isAboutComplete.value;
    });
    const canAccessTab = (tabId) => {
      if (tabId === "about") return true;
      if (tabId === "links") return isAboutComplete.value;
      return false;
    };
    computed(() => {
      return "about:blank";
    });
    const changeTab = (tabId, msg) => {
      if (!canAccessTab(tabId)) return;
      if (msg) {
        showInfoToast(msg, "ti-check");
      }
      activeTab.value = tabId;
    };
    const updateQrSettings = (settings) => {
    };
    const isIframeLoading = ref(true);
    const isIframeReady = ref(false);
    const iframeKey = ref(0);
    const iframeRef = ref(null);
    const showPreviewMobile = ref(false);
    watch(() => formStore.$state, (newState) => {
      if (isIframeReady.value && iframeRef.value && iframeRef.value.contentWindow) {
        try {
          iframeRef.value.contentWindow.postMessage({
            type: "FORM_DATA_UPDATE",
            data: JSON.parse(JSON.stringify(newState))
          }, (void 0).location.origin);
          return;
        } catch (error) {
        }
      }
      clearTimeout(iframeRefreshTimeout.value);
      iframeRefreshTimeout.value = setTimeout(() => {
        iframeKey.value++;
        isIframeLoading.value = true;
        isIframeReady.value = false;
      }, 300);
    }, { deep: true });
    const iframeRefreshTimeout = ref(null);
    return (_ctx, _push, _parent, _attrs) => {
      const _component_ClientOnly = __nuxt_component_0$3;
      _push(`<!--[--><div class="flex flex-col" data-v-cdf46fad><div class="flex flex-col sm:flex-row gap-4 mb-6 p-2" data-v-cdf46fad><div class="grid grid-cols-2 gap-4 flex-1" data-v-cdf46fad><!--[-->`);
      ssrRenderList(tabGroups, (group, groupIndex) => {
        _push(`<div class="contents" data-v-cdf46fad><!--[-->`);
        ssrRenderList(group.items, (tab) => {
          _push(`<button class="${ssrRenderClass([{
            "bg-black text-white shadow-sm": activeTab.value === tab.id,
            "text-gray-700 hover:bg-gray-100 bg-white": activeTab.value !== tab.id,
            "opacity-50 cursor-not-allowed": !canAccessTab(tab.id)
          }, "flex items-center gap-1.5 px-3 py-3 rounded-md transition-all text-sm w-full justify-center"])}"${ssrIncludeBooleanAttr(!canAccessTab(tab.id)) ? " disabled" : ""} data-v-cdf46fad><i class="${ssrRenderClass([tab.icon, "text-base"])}" data-v-cdf46fad></i> <span data-v-cdf46fad>${ssrInterpolate(tab.label)}</span></button>`);
        });
        _push(`<!--]--></div>`);
      });
      _push(`<!--]--></div></div> <div class="w-full grid grid-cols-1 lg:grid-cols-6 gap-4" data-v-cdf46fad><div class="lg:col-span-4" data-v-cdf46fad>`);
      ssrRenderVNode(_push, createVNode(resolveDynamicComponent(currentTabComponent.value), {
        form: unref(formStore),
        "onUpdate:form": ($event) => isRef(formStore) ? formStore.value = $event : null,
        "is-add-mode": true,
        "onUpdate:settings": updateQrSettings,
        onOpenPreview: ($event) => showPreviewMobile.value = true,
        onGoToNextStep: ($event) => changeTab("links", $event),
        class: "bg-white p-4 rounded-lg mb-16"
      }, null), _parent);
      _push(`</div> <div class="lg:col-span-2 space-y-4 sticky z-0 top-16 h-fit w-full hidden lg:block" data-v-cdf46fad><div class="flex justify-center" data-v-cdf46fad><div class="relative" style="${ssrRenderStyle({ "width": "390px", "height": "844px" })}" data-v-cdf46fad><div class="absolute inset-0 rounded-[40px] border-4 border-gray-800 bg-black shadow-xl" data-v-cdf46fad><div class="absolute top-[15%] -left-[5px] w-[4px] h-5 bg-slate-700 rounded-xl" data-v-cdf46fad></div> <div class="absolute top-[25%] -left-[5px] w-[4px] h-10 bg-slate-700 rounded-xl" data-v-cdf46fad></div> <div class="absolute top-[35%] -left-[5px] w-[4px] h-10 bg-slate-700 rounded-xl" data-v-cdf46fad></div> <div class="absolute top-[35%] -right-[5px] w-[4px] h-16 bg-slate-700 rounded-xl" data-v-cdf46fad></div> <div class="absolute top-3 left-1/2 -translate-x-1/2 w-16 h-5 bg-black rounded-xl z-20" data-v-cdf46fad></div> <div class="absolute inset-2 rounded-[32px] overflow-hidden bg-white" data-v-cdf46fad>`);
      _push(ssrRenderComponent(_component_ClientOnly, null, {
        fallback: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="w-full h-full bg-gray-100 rounded-[28px] flex items-center justify-center" data-v-cdf46fad${_scopeId}><div class="text-gray-500" data-v-cdf46fad${_scopeId}>\u062F\u0631 \u062D\u0627\u0644 \u0628\u0627\u0631\u06AF\u0630\u0627\u0631\u06CC...</div></div>`);
          } else {
            return [
              createVNode("div", { class: "w-full h-full bg-gray-100 rounded-[28px] flex items-center justify-center" }, [
                createVNode("div", { class: "text-gray-500" }, "\u062F\u0631 \u062D\u0627\u0644 \u0628\u0627\u0631\u06AF\u0630\u0627\u0631\u06CC...")
              ])
            ];
          }
        })
      }, _parent));
      _push(`</div></div></div></div></div></div> `);
      if (showPreviewMobile.value) {
        _push(`<div class="fixed inset-0 z-50 flex items-end lg:hidden" data-v-cdf46fad><div class="bg-white w-full h-full rounded-t-2xl p-4 overflow-y-auto shadow-xl flex flex-col" data-v-cdf46fad><div class="flex justify-between items-center mb-4 flex-shrink-0" data-v-cdf46fad><h2 class="text-base font-semibold" data-v-cdf46fad>\u067E\u06CC\u0634\u200C\u0646\u0645\u0627\u06CC\u0634</h2> <button class="text-gray-400 hover:text-black" data-v-cdf46fad><i class="ti ti-x" data-v-cdf46fad></i></button></div> <div class="w-full" style="${ssrRenderStyle({ "height": "calc(100vh - 120px)" })}" data-v-cdf46fad><div class="w-full h-full relative overflow-hidden rounded-lg" data-v-cdf46fad>`);
        if (isIframeLoading.value) {
          _push(`<div class="absolute inset-0 flex items-center justify-center bg-gray-50 rounded-lg z-10" data-v-cdf46fad><div class="flex flex-col items-center space-y-2" data-v-cdf46fad><div class="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" data-v-cdf46fad></div> <span class="text-sm text-gray-600" data-v-cdf46fad>\u062F\u0631 \u062D\u0627\u0644 \u0628\u0627\u0631\u06AF\u0630\u0627\u0631\u06CC...</span></div></div>`);
        } else {
          _push(`<!---->`);
        }
        _push(` `);
        _push(ssrRenderComponent(_component_ClientOnly, null, {
          fallback: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<div class="w-full h-full bg-gray-100 rounded-lg flex items-center justify-center" data-v-cdf46fad${_scopeId}><div class="text-gray-500" data-v-cdf46fad${_scopeId}>\u062F\u0631 \u062D\u0627\u0644 \u0628\u0627\u0631\u06AF\u0630\u0627\u0631\u06CC...</div></div>`);
            } else {
              return [
                createVNode("div", { class: "w-full h-full bg-gray-100 rounded-lg flex items-center justify-center" }, [
                  createVNode("div", { class: "text-gray-500" }, "\u062F\u0631 \u062D\u0627\u0644 \u0628\u0627\u0631\u06AF\u0630\u0627\u0631\u06CC...")
                ])
              ];
            }
          })
        }, _parent));
        _push(`</div></div></div></div>`);
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
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/UserDashboard/main/AddCard/index.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const AddCard = /* @__PURE__ */ _export_sfc(_sfc_main$1, [["__scopeId", "data-v-cdf46fad"]]);
const _sfc_main = {
  __name: "index",
  __ssrInlineRender: true,
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "p-4" }, _attrs))}>`);
      _push(ssrRenderComponent(AddCard, null, null, _parent));
      _push(`</div>`);
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/dashboard/add-card/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=index-BIhUrpMj.mjs.map
