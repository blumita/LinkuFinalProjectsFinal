import { computed, mergeProps, ref, withCtx, createTextVNode, createVNode, unref, createBlock, createCommentVNode, openBlock, withDirectives, withModifiers, vModelText, vModelCheckbox, Transition, Fragment, renderList, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderClass, ssrRenderAttr, ssrIncludeBooleanAttr, ssrLooseContain, ssrRenderList } from 'vue/server-renderer';
import { useRoute, useRouter } from 'vue-router';
import { a as useNuxtApp, e as __nuxt_component_0$2 } from './server.mjs';
import draggable from 'vuedraggable';
import { u as useFormStore } from './form-CUJQskNk.mjs';
import { u as useUserStore } from './user-D1YL8aKq.mjs';
import { I as InfoToast } from './InfoToast-DdxwJ7kO.mjs';
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
import './_plugin-vue_export-helper-1tPrXgE0.mjs';

const _sfc_main$1 = {
  __name: "TabLeadCapture",
  __ssrInlineRender: true,
  props: {
    cardId: String,
    isMobile: {
      type: Boolean,
      default: false
    }
  },
  setup(__props) {
    var _a;
    const form = useFormStore();
    const userStore = useUserStore();
    const user = computed(() => userStore.user);
    const showBanner = ref(false);
    const isPro = ref((_a = user.value) == null ? void 0 : _a.isPro);
    const props = __props;
    const dropdownOpen = ref(false);
    const expandedFields = ref({});
    const { $axios } = useNuxtApp();
    let bannerTimeout = null;
    const formTouched = ref(false);
    const titleError = computed(() => {
      var _a2;
      return !((_a2 = form.formTitle) == null ? void 0 : _a2.trim());
    });
    const showToast = ref(false);
    const toastMessage = ref("");
    const toastIcon = ref("ti-alert-triangle");
    const showInfoToast = (message, icon = "ti-check") => {
      toastMessage.value = message;
      toastIcon.value = icon;
      showToast.value = true;
      setTimeout(() => showToast.value = false, 3e3);
    };
    computed({
      get: () => form.isLeadCaptureEnabled,
      set: async (val) => {
        var _a2, _b;
        if (!props.cardId) {
          showInfoToast("\u062E\u0637\u0627: \u0634\u0646\u0627\u0633\u0647 \u06A9\u0627\u0631\u062A \u06CC\u0627\u0641\u062A \u0646\u0634\u062F", "ti-alert-triangle");
          return;
        }
        if (val && form.singleLink) {
          form.singleLink = false;
          try {
            await $axios.patch(`v1/cards/${props.cardId}/singlelink`, { is_single_link: false });
          } catch (error) {
            console.error("Error disabling single link:", error);
          }
        }
        form.toggleLeadCapture(val);
        try {
          const response = await $axios.patch(`v1/cards/${props.cardId}/leadcapture`, {
            is_lead_capture_enabled: val
          });
          showInfoToast(response.data.message || (val ? "\u0641\u0631\u0645 \u0627\u0631\u062A\u0628\u0627\u0637 \u0641\u0639\u0627\u0644 \u0634\u062F" : "\u0641\u0631\u0645 \u0627\u0631\u062A\u0628\u0627\u0637 \u063A\u06CC\u0631\u0641\u0639\u0627\u0644 \u0634\u062F"), "ti-check");
        } catch (error) {
          form.toggleLeadCapture(!val);
          showInfoToast(((_b = (_a2 = error.response) == null ? void 0 : _a2.data) == null ? void 0 : _b.message) || "\u062E\u0637\u0627 \u062F\u0631 \u062A\u063A\u06CC\u06CC\u0631 \u0648\u0636\u0639\u06CC\u062A \u0641\u0631\u0645", "ti-alert-triangle");
        }
      }
    });
    const checkProBeforeAction = (event) => {
      if (!isPro.value) {
        showBanner.value = true;
        clearTimeout(bannerTimeout);
        bannerTimeout = setTimeout(() => {
          showBanner.value = false;
        }, 5e3);
        if (event && event.preventDefault) {
          event.preventDefault();
          event.stopPropagation();
        }
        return false;
      }
      return true;
    };
    const getFieldIcon = (type) => {
      const icons = {
        text: "ti ti-forms",
        dropdown: "ti ti-selector",
        checkbox: "ti ti-checkbox",
        file: "ti ti-paperclip"
      };
      return icons[type] || "ti ti-forms";
    };
    const toggleFieldExpansion = (fieldId) => {
      if (!checkProBeforeAction({ target: { disabled: !isPro.value } })) return;
      expandedFields.value[fieldId] = !expandedFields.value[fieldId];
    };
    const addOption = (fieldIndex) => {
      if (!form.fields[fieldIndex].options) form.fields[fieldIndex].options = [];
      form.fields[fieldIndex].options.push("");
    };
    const removeOption = (fieldIndex, optionIndex) => {
      form.fields[fieldIndex].options.splice(optionIndex, 1);
    };
    const handleToggle = (index) => {
      if (!checkProBeforeAction({ target: { disabled: !isPro.value } })) return;
      form.fields[index].required = !form.fields[index].required;
    };
    const handleRemoveField = (index) => {
      if (!checkProBeforeAction({ target: { disabled: !isPro.value } })) return;
      const fieldId = form.fields[index].id;
      delete expandedFields.value[fieldId];
      form.fields.splice(index, 1);
    };
    const onDragEnd = () => {
    };
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0$2;
      _push(`<!--[--><div class="space-y-4">`);
      if (showBanner.value || !isPro.value) {
        _push(`<div class="rounded-xl overflow-hidden border border-primary/20"><div class="flex items-center justify-between gap-3 p-3 bg-gradient-to-r from-primary/10 via-accent/10 to-primary/10"><div class="flex items-center gap-2"><div class="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center"><i class="ti ti-crown text-primary"></i></div> <span class="text-sm font-medium text-foreground">\u0628\u0631\u0627\u06CC \u0648\u06CC\u0631\u0627\u06CC\u0634 \u0641\u06CC\u0644\u062F\u0647\u0627\u060C \u0627\u0634\u062A\u0631\u0627\u06A9 PRO \u0628\u06AF\u06CC\u0631\u06CC\u062F</span></div> `);
        _push(ssrRenderComponent(_component_NuxtLink, {
          to: "/pricing",
          class: "shrink-0 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition flex items-center gap-1"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`
            \u0627\u0631\u062A\u0642\u0627
            <i class="ti ti-arrow-up-right text-xs"${_scopeId}></i>`);
            } else {
              return [
                createTextVNode("\r\n            \u0627\u0631\u062A\u0642\u0627\r\n            "),
                createVNode("i", { class: "ti ti-arrow-up-right text-xs" })
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`</div></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(` <div class="${ssrRenderClass([{ "opacity-60 pointer-events-none": !isPro.value }, "space-y-2"])}"><label class="block text-sm font-medium text-foreground">\u0639\u0646\u0648\u0627\u0646 \u0641\u0631\u0645</label> <input type="text"${ssrRenderAttr("value", unref(form).formTitle)} placeholder="\u0645\u062B\u0627\u0644: \u0641\u0631\u0645 \u062A\u0645\u0627\u0633 \u0628\u0627 \u0645\u0627" class="${ssrRenderClass([{ "border-destructive": titleError.value && formTouched.value, "cursor-not-allowed": !isPro.value }, "w-full border border-border rounded-xl px-4 py-3.5 text-sm text-right text-foreground bg-card focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"])}"${ssrIncludeBooleanAttr(!isPro.value) ? " disabled" : ""}> `);
      if (titleError.value && formTouched.value && isPro.value) {
        _push(`<p class="text-destructive text-xs flex items-center gap-1"><i class="ti ti-alert-circle"></i>
        \u0639\u0646\u0648\u0627\u0646 \u0641\u0631\u0645 \u0631\u0627 \u0648\u0627\u0631\u062F \u06A9\u0646\u06CC\u062F
      </p>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div> <div class="flex justify-between items-center"><span class="text-sm font-medium text-foreground">\u0641\u06CC\u0644\u062F\u0647\u0627\u06CC \u0648\u0631\u0648\u062F\u06CC</span> <div class="relative"><button class="${ssrRenderClass([isPro.value ? "bg-primary text-primary-foreground hover:bg-primary/90" : "bg-muted text-muted-foreground cursor-not-allowed", "text-sm px-4 py-2 rounded-xl flex items-center gap-2 transition-colors"])}"${ssrIncludeBooleanAttr(!isPro.value) ? " disabled" : ""}><i class="ti ti-plus text-base"></i>
          \u0627\u0641\u0632\u0648\u062F\u0646 \u0641\u06CC\u0644\u062F
        </button> `);
      if (dropdownOpen.value && isPro.value) {
        _push(`<div class="absolute ltr:right-0 rtl:left-0 mt-2 w-52 bg-card border border-border rounded-xl shadow-xl z-50 overflow-hidden"><ul class="py-2 text-sm text-foreground"><li><button class="w-full px-4 py-2.5 hover:bg-accent flex items-center gap-3 text-right transition-colors"><i class="ti ti-forms text-muted-foreground"></i>
                \u0645\u062A\u0646
              </button></li> <li class="relative group"><div class="w-full px-4 py-2.5 hover:bg-accent flex items-center gap-3 cursor-pointer text-right transition-colors"><i class="ti ti-selector text-muted-foreground"></i> <span>\u06A9\u0634\u0648\u06CC\u06CC</span> <span class="rtl:mr-auto ltr:ml-auto"><i class="ti ti-chevron-left ltr:rotate-180 text-muted-foreground"></i></span></div> <div class="absolute top-0 ltr:left-full rtl:right-full mt-0 w-56 bg-card border border-border rounded-xl shadow-xl z-20 hidden group-hover:block overflow-hidden"><ul class="text-sm text-foreground"><li><button class="w-full px-4 py-2.5 hover:bg-accent text-right transition-colors">\u06A9\u0634\u0648\u06CC\u06CC \u0633\u0641\u0627\u0631\u0634\u06CC
                    </button></li> <li class="px-4 py-2 text-muted-foreground text-xs text-right border-t border-border">\u067E\u06CC\u0634\u200C\u0641\u0631\u0636</li> <li><button class="w-full px-4 py-2.5 hover:bg-accent text-right transition-colors">\u0644\u06CC\u0633\u062A \u06A9\u0634\u0648\u0631\u0647\u0627
                    </button></li> <li><button class="w-full px-4 py-2.5 hover:bg-accent text-right transition-colors">\u0644\u06CC\u0633\u062A \u0627\u0633\u062A\u0627\u0646\u200C\u0647\u0627
                    </button></li></ul></div></li> <li><button class="w-full px-4 py-2.5 hover:bg-accent flex items-center gap-3 text-right transition-colors"><i class="ti ti-checkbox text-muted-foreground"></i>
                \u0686\u06A9\u200C\u0628\u0627\u06A9\u0633
              </button></li> <li><button class="w-full px-4 py-2.5 hover:bg-accent flex items-center gap-3 text-right transition-colors"><i class="ti ti-paperclip text-muted-foreground"></i>
                \u0641\u0627\u06CC\u0644
              </button></li></ul></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div></div> `);
      _push(ssrRenderComponent(unref(draggable), {
        modelValue: unref(form).fields,
        "onUpdate:modelValue": ($event) => unref(form).fields = $event,
        "item-key": "id",
        disabled: !isPro.value,
        handle: ".drag-handle",
        "ghost-class": "opacity-50 bg-primary/10 scale-[1.02]",
        "chosen-class": "shadow-lg",
        animation: "200",
        onEnd: onDragEnd
      }, {
        item: withCtx(({ element, index }, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="bg-card rounded-xl px-4 py-3.5 mb-3 border border-border hover:border-primary/30 transition-all"${_scopeId}><div class="flex justify-between items-center"${_scopeId}><div class="flex items-center gap-3 w-full"${_scopeId}>`);
            if (isPro.value) {
              _push2(`<span class="drag-handle cursor-grab active:cursor-grabbing flex items-center p-1 rounded hover:bg-muted transition-colors"${_scopeId}><i class="ti ti-grip-vertical text-muted-foreground text-lg"${_scopeId}></i></span>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(` <div class="flex items-center gap-3 flex-1"${_scopeId}><div class="w-8 h-8 rounded-lg bg-muted flex items-center justify-center shrink-0"${_scopeId}><i class="${ssrRenderClass([getFieldIcon(element.type), "text-muted-foreground"])}"${_scopeId}></i></div> <input${ssrRenderAttr("value", element.label)}${ssrIncludeBooleanAttr(!isPro.value) ? " disabled" : ""} class="bg-transparent text-sm font-medium focus:outline-none w-full text-right text-foreground placeholder:text-muted-foreground" placeholder="\u0646\u0627\u0645 \u0641\u06CC\u0644\u062F..."${_scopeId}> `);
            if (element.type === "dropdown") {
              _push2(`<button class="p-1.5 rounded-lg hover:bg-muted transition-colors"${_scopeId}><i class="${ssrRenderClass([expandedFields.value[element.id] ? "ti ti-chevron-up" : "ti ti-chevron-down", "text-muted-foreground transition-transform"])}"${_scopeId}></i></button>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</div></div> <div class="flex items-center gap-3"${_scopeId}><div class="flex items-center gap-2 bg-muted/50 px-3 py-1.5 rounded-lg"${_scopeId}>`);
            if (element.type !== "checkbox") {
              _push2(`<span class="text-xs text-muted-foreground font-medium"${_scopeId}>\u0627\u0644\u0632\u0627\u0645\u06CC</span>`);
            } else {
              _push2(`<span class="text-xs text-muted-foreground font-medium"${_scopeId}>\u0641\u0639\u0627\u0644</span>`);
            }
            _push2(` <label class="relative inline-flex items-center cursor-pointer"${_scopeId}><input type="checkbox" class="sr-only peer"${ssrIncludeBooleanAttr(Array.isArray(element.required) ? ssrLooseContain(element.required, null) : element.required) ? " checked" : ""}${ssrIncludeBooleanAttr(!isPro.value) ? " disabled" : ""}${_scopeId}> <div class="w-10 h-6 bg-muted rounded-full peer peer-checked:bg-primary transition-colors"${_scopeId}></div> <div class="absolute left-1 top-1 bg-background rounded-full h-4 w-4 transition-all peer-checked:translate-x-4 shadow-sm"${_scopeId}></div></label></div> <button class="w-8 h-8 flex items-center justify-center rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"${ssrIncludeBooleanAttr(!isPro.value) ? " disabled" : ""}${_scopeId}><i class="ti ti-trash text-base"${_scopeId}></i></button></div></div> `);
            if (element.type === "dropdown") {
              _push2(`<div class="pr-12"${_scopeId}>`);
              if (expandedFields.value[element.id]) {
                _push2(`<div class="mt-3 space-y-2 overflow-hidden"${_scopeId}><!--[-->`);
                ssrRenderList(element.options, (opt, i) => {
                  _push2(`<div class="flex items-center gap-2"${_scopeId}><input${ssrRenderAttr("value", element.options[i])} class="text-sm px-3 py-2.5 w-full bg-muted/50 border border-border rounded-lg text-foreground text-right focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"${ssrIncludeBooleanAttr(!isPro.value) ? " disabled" : ""} placeholder="\u0645\u0642\u062F\u0627\u0631 \u06AF\u0632\u06CC\u0646\u0647"${_scopeId}> <button class="w-8 h-8 flex items-center justify-center rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"${ssrIncludeBooleanAttr(!isPro.value) ? " disabled" : ""}${_scopeId}><i class="ti ti-x"${_scopeId}></i></button></div>`);
                });
                _push2(`<!--]--> `);
                if (isPro.value) {
                  _push2(`<button class="text-sm text-primary hover:text-primary/80 flex items-center gap-1 transition-colors py-1"${_scopeId}><i class="ti ti-plus"${_scopeId}></i> <span${_scopeId}>\u0627\u0641\u0632\u0648\u062F\u0646 \u06AF\u0632\u06CC\u0646\u0647</span></button>`);
                } else {
                  _push2(`<!---->`);
                }
                _push2(`</div>`);
              } else {
                _push2(`<!---->`);
              }
              _push2(`</div>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</div>`);
          } else {
            return [
              createVNode("div", {
                class: "bg-card rounded-xl px-4 py-3.5 mb-3 border border-border hover:border-primary/30 transition-all",
                onClick: checkProBeforeAction
              }, [
                createVNode("div", { class: "flex justify-between items-center" }, [
                  createVNode("div", { class: "flex items-center gap-3 w-full" }, [
                    isPro.value ? (openBlock(), createBlock("span", {
                      key: 0,
                      class: "drag-handle cursor-grab active:cursor-grabbing flex items-center p-1 rounded hover:bg-muted transition-colors"
                    }, [
                      createVNode("i", { class: "ti ti-grip-vertical text-muted-foreground text-lg" })
                    ])) : createCommentVNode("", true),
                    createTextVNode(),
                    createVNode("div", { class: "flex items-center gap-3 flex-1" }, [
                      createVNode("div", { class: "w-8 h-8 rounded-lg bg-muted flex items-center justify-center shrink-0" }, [
                        createVNode("i", {
                          class: [getFieldIcon(element.type), "text-muted-foreground"]
                        }, null, 2)
                      ]),
                      createTextVNode(),
                      withDirectives(createVNode("input", {
                        "onUpdate:modelValue": ($event) => element.label = $event,
                        disabled: !isPro.value,
                        class: "bg-transparent text-sm font-medium focus:outline-none w-full text-right text-foreground placeholder:text-muted-foreground",
                        placeholder: "\u0646\u0627\u0645 \u0641\u06CC\u0644\u062F...",
                        onClick: withModifiers(() => {
                        }, ["stop"])
                      }, null, 8, ["onUpdate:modelValue", "disabled", "onClick"]), [
                        [vModelText, element.label]
                      ]),
                      createTextVNode(),
                      element.type === "dropdown" ? (openBlock(), createBlock("button", {
                        key: 0,
                        onClick: withModifiers(($event) => toggleFieldExpansion(element.id), ["stop"]),
                        class: "p-1.5 rounded-lg hover:bg-muted transition-colors"
                      }, [
                        createVNode("i", {
                          class: [expandedFields.value[element.id] ? "ti ti-chevron-up" : "ti ti-chevron-down", "text-muted-foreground transition-transform"]
                        }, null, 2)
                      ], 8, ["onClick"])) : createCommentVNode("", true)
                    ])
                  ]),
                  createTextVNode(),
                  createVNode("div", { class: "flex items-center gap-3" }, [
                    createVNode("div", { class: "flex items-center gap-2 bg-muted/50 px-3 py-1.5 rounded-lg" }, [
                      element.type !== "checkbox" ? (openBlock(), createBlock("span", {
                        key: 0,
                        class: "text-xs text-muted-foreground font-medium"
                      }, "\u0627\u0644\u0632\u0627\u0645\u06CC")) : (openBlock(), createBlock("span", {
                        key: 1,
                        class: "text-xs text-muted-foreground font-medium"
                      }, "\u0641\u0639\u0627\u0644")),
                      createTextVNode(),
                      createVNode("label", { class: "relative inline-flex items-center cursor-pointer" }, [
                        withDirectives(createVNode("input", {
                          type: "checkbox",
                          class: "sr-only peer",
                          "onUpdate:modelValue": ($event) => element.required = $event,
                          disabled: !isPro.value,
                          onClick: ($event) => handleToggle(index)
                        }, null, 8, ["onUpdate:modelValue", "disabled", "onClick"]), [
                          [vModelCheckbox, element.required]
                        ]),
                        createTextVNode(),
                        createVNode("div", { class: "w-10 h-6 bg-muted rounded-full peer peer-checked:bg-primary transition-colors" }),
                        createTextVNode(),
                        createVNode("div", { class: "absolute left-1 top-1 bg-background rounded-full h-4 w-4 transition-all peer-checked:translate-x-4 shadow-sm" })
                      ])
                    ]),
                    createTextVNode(),
                    createVNode("button", {
                      onClick: ($event) => handleRemoveField(index),
                      class: "w-8 h-8 flex items-center justify-center rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors",
                      disabled: !isPro.value
                    }, [
                      createVNode("i", { class: "ti ti-trash text-base" })
                    ], 8, ["onClick", "disabled"])
                  ])
                ]),
                createTextVNode(),
                element.type === "dropdown" ? (openBlock(), createBlock("div", {
                  key: 0,
                  class: "pr-12"
                }, [
                  createVNode(Transition, {
                    "enter-active-class": "transition-all duration-300 ease-out",
                    "leave-active-class": "transition-all duration-200 ease-in",
                    "enter-from-class": "opacity-0 max-h-0",
                    "enter-to-class": "opacity-100 max-h-60",
                    "leave-from-class": "opacity-100 max-h-60",
                    "leave-to-class": "opacity-0 max-h-0"
                  }, {
                    default: withCtx(() => [
                      expandedFields.value[element.id] ? (openBlock(), createBlock("div", {
                        key: 0,
                        class: "mt-3 space-y-2 overflow-hidden"
                      }, [
                        (openBlock(true), createBlock(Fragment, null, renderList(element.options, (opt, i) => {
                          return openBlock(), createBlock("div", {
                            key: i,
                            class: "flex items-center gap-2"
                          }, [
                            withDirectives(createVNode("input", {
                              "onUpdate:modelValue": ($event) => element.options[i] = $event,
                              class: "text-sm px-3 py-2.5 w-full bg-muted/50 border border-border rounded-lg text-foreground text-right focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all",
                              disabled: !isPro.value,
                              onClick: withModifiers(() => {
                              }, ["stop"]),
                              placeholder: "\u0645\u0642\u062F\u0627\u0631 \u06AF\u0632\u06CC\u0646\u0647"
                            }, null, 8, ["onUpdate:modelValue", "disabled", "onClick"]), [
                              [vModelText, element.options[i]]
                            ]),
                            createTextVNode(),
                            createVNode("button", {
                              onClick: withModifiers(($event) => removeOption(index, i), ["stop"]),
                              class: "w-8 h-8 flex items-center justify-center rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors",
                              disabled: !isPro.value
                            }, [
                              createVNode("i", { class: "ti ti-x" })
                            ], 8, ["onClick", "disabled"])
                          ]);
                        }), 128)),
                        createTextVNode(),
                        isPro.value ? (openBlock(), createBlock("button", {
                          key: 0,
                          onClick: withModifiers(($event) => addOption(index), ["stop"]),
                          class: "text-sm text-primary hover:text-primary/80 flex items-center gap-1 transition-colors py-1"
                        }, [
                          createVNode("i", { class: "ti ti-plus" }),
                          createTextVNode(),
                          createVNode("span", null, "\u0627\u0641\u0632\u0648\u062F\u0646 \u06AF\u0632\u06CC\u0646\u0647")
                        ], 8, ["onClick"])) : createCommentVNode("", true)
                      ])) : createCommentVNode("", true)
                    ]),
                    _: 2
                  }, 1024)
                ])) : createCommentVNode("", true)
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(` `);
      if (!__props.isMobile) {
        _push(`<div class="mt-6 space-y-4"><div class="space-y-2"><label class="block text-sm font-medium text-foreground">\u0645\u062A\u0646 \u062F\u06A9\u0645\u0647 \u0627\u0631\u0633\u0627\u0644</label> <input type="text"${ssrRenderAttr("value", unref(form).connectButtonText)} placeholder="\u0645\u062B\u0627\u0644: \u0627\u0631\u0633\u0627\u0644 \u067E\u06CC\u0627\u0645" class="${ssrRenderClass([isPro.value ? "" : "opacity-50 cursor-not-allowed", "w-full border border-border rounded-xl px-4 py-3.5 text-sm text-right text-foreground bg-card focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"])}"${ssrIncludeBooleanAttr(!isPro.value) ? " disabled" : ""}></div> <div class="space-y-2"><label class="block text-sm font-medium text-foreground">\u062A\u0648\u0636\u06CC\u062D \u0641\u0631\u0645</label> <input type="text"${ssrRenderAttr("value", unref(form).formDisclaimer)} placeholder="\u0645\u062B\u0627\u0644: \u0627\u0637\u0644\u0627\u0639\u0627\u062A \u0634\u0645\u0627 \u0645\u062D\u0641\u0648\u0638 \u0627\u0633\u062A" class="${ssrRenderClass([isPro.value ? "" : "opacity-50 cursor-not-allowed", "w-full border border-border rounded-xl px-4 py-3.5 text-sm text-right text-foreground bg-card focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"])}"${ssrIncludeBooleanAttr(!isPro.value) ? " disabled" : ""}></div></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(` `);
      if (!__props.isMobile) {
        _push(`<div class="flex justify-between pt-6 border-t border-border"><button class="${ssrRenderClass([isPro.value ? "" : "opacity-50 cursor-not-allowed", "text-sm px-5 py-2.5 rounded-xl border border-border hover:bg-muted transition-colors text-foreground"])}"${ssrIncludeBooleanAttr(!isPro.value) ? " disabled" : ""}>
        \u0628\u0627\u0632\u0646\u0634\u0627\u0646\u06CC \u067E\u06CC\u0634\u200C\u0641\u0631\u0636
      </button> <div class="flex gap-3"><button class="text-sm px-5 py-2.5 rounded-xl border border-border hover:bg-muted transition-colors text-foreground"${ssrIncludeBooleanAttr(!isPro.value) ? " disabled" : ""}>
          \u0627\u0646\u0635\u0631\u0627\u0641
        </button> <button class="text-sm px-6 py-2.5 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 transition-colors font-medium">
          \u0630\u062E\u06CC\u0631\u0647 \u062A\u063A\u06CC\u06CC\u0631\u0627\u062A
        </button></div></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(` `);
      if (__props.isMobile) {
        _push(`<div class="space-y-4"><div class="space-y-2"><label class="block text-sm font-medium text-foreground">\u0645\u062A\u0646 \u062F\u06A9\u0645\u0647 \u0627\u0631\u0633\u0627\u0644</label> <input type="text"${ssrRenderAttr("value", unref(form).connectButtonText)} placeholder="\u0645\u062B\u0627\u0644: \u0627\u0631\u0633\u0627\u0644 \u067E\u06CC\u0627\u0645" class="${ssrRenderClass([isPro.value ? "" : "opacity-50 cursor-not-allowed", "w-full border border-border rounded-xl px-4 py-3.5 text-sm text-right text-foreground bg-card focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"])}"${ssrIncludeBooleanAttr(!isPro.value) ? " disabled" : ""}></div> <div class="space-y-2"><label class="block text-sm font-medium text-foreground">\u062A\u0648\u0636\u06CC\u062D \u0641\u0631\u0645</label> <input type="text"${ssrRenderAttr("value", unref(form).formDisclaimer)} placeholder="\u0645\u062B\u0627\u0644: \u0627\u0637\u0644\u0627\u0639\u0627\u062A \u0634\u0645\u0627 \u0645\u062D\u0641\u0648\u0638 \u0627\u0633\u062A" class="${ssrRenderClass([isPro.value ? "" : "opacity-50 cursor-not-allowed", "w-full border border-border rounded-xl px-4 py-3.5 text-sm text-right text-foreground bg-card focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"])}"${ssrIncludeBooleanAttr(!isPro.value) ? " disabled" : ""}></div></div>`);
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/UserDashboard/main/EditCard/tabs/TabLeadCapture.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const _sfc_main = {
  __name: "lead-capture",
  __ssrInlineRender: true,
  setup(__props) {
    const route = useRoute();
    useRouter();
    const formStore = useFormStore();
    const cardId = computed(() => {
      var _a;
      return route.query.id || route.query.cardId || ((_a = formStore.defaultCard) == null ? void 0 : _a.id);
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "min-h-screen bg-background" }, _attrs))}><div class="lg:hidden flex flex-col min-h-screen"><div class="fixed top-0 left-0 right-0 w-full bg-background/95 backdrop-blur-lg border-b border-border z-50"><div class="flex items-center justify-between w-full px-4 py-3"><div class="flex items-center gap-3"><button class="w-10 h-10 flex items-center justify-center rounded-xl bg-muted/50 hover:bg-accent transition-colors"><i class="ti ti-arrow-right text-xl text-foreground"></i></button> <h1 class="text-lg font-bold text-foreground">\u0641\u0631\u0645 \u0627\u0631\u062A\u0628\u0627\u0637</h1></div></div></div> <div class="flex-1 px-4 pt-20 pb-24 overflow-y-auto">`);
      _push(ssrRenderComponent(_sfc_main$1, {
        cardId: cardId.value,
        isMobile: true
      }, null, _parent));
      _push(`</div> <div class="fixed bottom-0 left-0 right-0 bg-background/95 backdrop-blur-lg border-t border-border p-4 z-50"><div class="flex gap-3"><button class="flex-1 h-12 rounded-xl border border-border text-foreground font-medium hover:bg-muted transition-colors">
            \u0627\u0646\u0635\u0631\u0627\u0641
          </button> <button class="flex-1 h-12 rounded-xl bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors">
            \u0630\u062E\u06CC\u0631\u0647 \u062A\u063A\u06CC\u06CC\u0631\u0627\u062A
          </button></div></div></div> <div class="hidden lg:block"><div class="container mx-auto px-4 py-8"><div class="max-w-4xl mx-auto"><div class="mb-6"><button class="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"><i class="ti ti-arrow-right text-xl"></i> <span>\u0628\u0627\u0632\u06AF\u0634\u062A</span></button></div> <div class="bg-card border border-border rounded-2xl p-6"><div class="mb-6"><h1 class="text-2xl font-bold text-foreground mb-2">\u0641\u0631\u0645 \u0627\u0631\u062A\u0628\u0627\u0637</h1> <p class="text-muted-foreground">\u062A\u0646\u0638\u06CC\u0645\u0627\u062A \u0641\u0631\u0645 \u062F\u0631\u06CC\u0627\u0641\u062A \u0627\u0637\u0644\u0627\u0639\u0627\u062A \u0627\u0632 \u0645\u062E\u0627\u0637\u0628\u06CC\u0646</p></div> `);
      _push(ssrRenderComponent(_sfc_main$1, {
        cardId: cardId.value,
        isMobile: false
      }, null, _parent));
      _push(`</div></div></div></div></div>`);
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/profile/lead-capture.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=lead-capture-Dax1bTm-.mjs.map
