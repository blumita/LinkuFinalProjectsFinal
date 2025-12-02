import { defineComponent, computed, ref, resolveComponent, mergeProps, withCtx, createTextVNode, createVNode, withDirectives, vModelText, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderClass, ssrInterpolate, ssrRenderComponent, ssrRenderAttr } from 'vue/server-renderer';
import { u as useUserStore } from './user-D1YL8aKq.mjs';
import { u as useFormStore } from './form-CUJQskNk.mjs';
import { n as navigateTo } from './server.mjs';
import { _ as _export_sfc } from './_plugin-vue_export-helper-1tPrXgE0.mjs';
import 'pinia';
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

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "QRScannerPage",
  __ssrInlineRender: true,
  setup(__props) {
    const userStore = useUserStore();
    const formStore = useFormStore();
    const userName = computed(() => {
      var _a;
      return ((_a = userStore.user) == null ? void 0 : _a.name) || "\u06A9\u0627\u0631\u0628\u0631";
    });
    const defaultCard = computed(() => formStore.defaultCard);
    const userQRData = computed(() => {
      var _a;
      if ((_a = defaultCard.value) == null ? void 0 : _a.slug) {
        return `https://linku.im/${defaultCard.value.slug}`;
      }
      return "https://linku.im";
    });
    const videoElement = ref(null);
    const fileInput = ref(null);
    const cameraActive = ref(false);
    const isLoading = ref(false);
    const errorMessage = ref("");
    const showManualInputSheet = ref(false);
    const manualCode = ref("");
    const showSupportSheet = ref(false);
    const showQRCodeFullScreen = ref(false);
    const scanResult = ref({
      show: false,
      success: false,
      message: ""
    });
    let stream = null;
    const startCamera = async () => {
      if (isLoading.value) return;
      isLoading.value = true;
      errorMessage.value = "";
      try {
        stream = await (void 0).mediaDevices.getUserMedia({
          video: {
            facingMode: "environment",
            // Back camera
            width: { ideal: 1920 },
            height: { ideal: 1080 }
          }
        });
        if (videoElement.value) {
          videoElement.value.srcObject = stream;
          await videoElement.value.play();
          cameraActive.value = true;
          setTimeout(() => {
            const demoCode = "LINKU-DEMO-" + Math.random().toString(36).substring(7).toUpperCase();
            handleScanResult(demoCode);
          }, 3e3);
        }
      } catch (error) {
        handleCameraError(error);
      } finally {
        isLoading.value = false;
      }
    };
    const stopCamera = () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
        stream = null;
      }
      if (videoElement.value) {
        videoElement.value.srcObject = null;
      }
      cameraActive.value = false;
      errorMessage.value = "";
    };
    const handleCameraError = (error) => {
      if (error.name === "NotAllowedError") {
        errorMessage.value = "\u0644\u0637\u0641\u0627\u064B \u0627\u062C\u0627\u0632\u0647 \u062F\u0633\u062A\u0631\u0633\u06CC \u0628\u0647 \u062F\u0648\u0631\u0628\u06CC\u0646 \u0631\u0627 \u0628\u062F\u0647\u06CC\u062F";
      } else if (error.name === "NotFoundError") {
        errorMessage.value = "\u062F\u0648\u0631\u0628\u06CC\u0646 \u06CC\u0627\u0641\u062A \u0646\u0634\u062F";
      } else if (error.name === "NotSupportedError") {
        errorMessage.value = "\u0645\u0631\u0648\u0631\u06AF\u0631 \u0634\u0645\u0627 \u0627\u0632 \u062F\u0648\u0631\u0628\u06CC\u0646 \u067E\u0634\u062A\u06CC\u0628\u0627\u0646\u06CC \u0646\u0645\u06CC\u200C\u06A9\u0646\u062F";
      } else {
        errorMessage.value = "\u062E\u0637\u0627 \u062F\u0631 \u062F\u0633\u062A\u0631\u0633\u06CC \u0628\u0647 \u062F\u0648\u0631\u0628\u06CC\u0646";
      }
    };
    const handleScanResult = (data) => {
      stopCamera();
      processQRCode(data);
    };
    const processQRCode = (data) => {
      try {
        if (data && data.length > 5) {
          showScanResult(true, "\u06A9\u062F \u0628\u0627 \u0645\u0648\u0641\u0642\u06CC\u062A \u0627\u0633\u06A9\u0646 \u0634\u062F!");
          navigateTo({
            path: "/dashboard/activate",
            query: { code: data }
          });
        } else {
          showScanResult(false, "\u06A9\u062F \u0645\u0639\u062A\u0628\u0631 \u0646\u06CC\u0633\u062A");
        }
      } catch (error) {
        showScanResult(false, "\u062E\u0637\u0627 \u062F\u0631 \u067E\u0631\u062F\u0627\u0632\u0634 \u06A9\u062F");
      }
    };
    const showScanResult = (success, message) => {
      scanResult.value = {
        show: true,
        success,
        message
      };
      setTimeout(() => {
        scanResult.value.show = false;
      }, 3e3);
    };
    const triggerFileInput = () => {
      var _a;
      (_a = fileInput.value) == null ? void 0 : _a.click();
    };
    const goToMyQRCode = () => {
      stopCamera();
      showQRCodeFullScreen.value = true;
    };
    const handleManualInput = () => {
      stopCamera();
      showManualInputSheet.value = true;
    };
    const verifyManualCode = async () => {
      if (!manualCode.value.trim()) return;
      showManualInputSheet.value = false;
      processQRCode(manualCode.value.trim());
      manualCode.value = "";
    };
    const handleStartChat = () => {
      showSupportSheet.value = false;
      navigateTo("/dashboard/support");
    };
    const handleMakeCall = () => {
      const phoneNumber = "+98-21-12345678";
      showSupportSheet.value = false;
      (void 0).location.href = `tel:${phoneNumber}`;
    };
    const handleSendEmail = () => {
      const email = "support@linku.im";
      const subject = encodeURIComponent("\u062F\u0631\u062E\u0648\u0627\u0633\u062A \u067E\u0634\u062A\u06CC\u0628\u0627\u0646\u06CC - QR Scanner");
      const body = encodeURIComponent("\u0633\u0644\u0627\u0645\u060C \u0645\u0646 \u062F\u0631 \u0627\u0633\u062A\u0641\u0627\u062F\u0647 \u0627\u0632 QR Scanner \u0628\u0647 \u06A9\u0645\u06A9 \u0646\u06CC\u0627\u0632 \u062F\u0627\u0631\u0645...");
      showSupportSheet.value = false;
      (void 0).location.href = `mailto:${email}?subject=${subject}&body=${body}`;
    };
    return (_ctx, _push, _parent, _attrs) => {
      const _component_IconButton = resolveComponent("IconButton");
      const _component_IconTextButton = resolveComponent("IconTextButton");
      const _component_BlumitaBottomSheet = resolveComponent("BlumitaBottomSheet");
      const _component_BlumitaButton = resolveComponent("BlumitaButton");
      const _component_QRCodeFullScreen = resolveComponent("QRCodeFullScreen");
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "qr-scanner-wrapper" }, _attrs))} data-v-c9d97f11><div class="header-section" data-v-c9d97f11><div class="header-content" data-v-c9d97f11><div class="flex items-center justify-between" data-v-c9d97f11><button class="w-10 h-10 rounded-full bg-white/15 hover:bg-white/25 backdrop-blur-sm flex items-center justify-center transition-colors flex-shrink-0" data-v-c9d97f11><i class="ti ti-arrow-right text-white text-lg" data-v-c9d97f11></i></button> <h1 class="text-white text-lg font-medium" data-v-c9d97f11>\u0627\u0633\u06A9\u0646 \u06A9\u062F QR</h1> <button class="w-12 h-12 bg-white/10 backdrop-blur-sm text-white rounded-2xl flex items-center justify-center hover:bg-white/20 transition-all duration-300" data-v-c9d97f11><i class="ti ti-help text-xl" data-v-c9d97f11></i></button></div></div></div> <div class="camera-container" data-v-c9d97f11><video autoplay muted playsinline class="${ssrRenderClass([{ "opacity-0": !cameraActive.value }, "w-full h-full object-cover"])}" data-v-c9d97f11></video> `);
      if (!cameraActive.value && isLoading.value) {
        _push(`<div class="absolute inset-0 flex items-center justify-center" data-v-c9d97f11><div class="text-center" data-v-c9d97f11><div class="w-16 h-16 border-4 border-white/20 border-t-white rounded-full animate-spin mx-auto mb-4" data-v-c9d97f11></div> <p class="text-white text-lg font-medium" data-v-c9d97f11>\u0622\u0645\u0627\u062F\u0647\u200C\u0633\u0627\u0632\u06CC \u062F\u0648\u0631\u0628\u06CC\u0646...</p></div></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(` `);
      if (errorMessage.value && !isLoading.value) {
        _push(`<div class="absolute inset-0 flex items-center justify-center p-6" data-v-c9d97f11><div class="text-center max-w-sm" data-v-c9d97f11><div class="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4" data-v-c9d97f11><i class="ti ti-exclamation-triangle text-red-400 text-2xl" data-v-c9d97f11></i></div> <h3 class="text-white text-lg font-medium mb-2" data-v-c9d97f11>\u0645\u0634\u06A9\u0644 \u062F\u0631 \u062F\u0633\u062A\u0631\u0633\u06CC \u0628\u0647 \u062F\u0648\u0631\u0628\u06CC\u0646</h3> <p class="text-white/80 text-sm mb-6" data-v-c9d97f11>${ssrInterpolate(errorMessage.value)}</p> <div class="space-y-3" data-v-c9d97f11><button class="w-full bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white py-3 px-4 rounded-xl font-medium transition-all duration-300" data-v-c9d97f11>
              \u062A\u0644\u0627\u0634 \u0645\u062C\u062F\u062F
            </button> <button class="w-full bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white py-3 px-4 rounded-xl font-medium transition-all duration-300" data-v-c9d97f11>
              \u0627\u0646\u062A\u062E\u0627\u0628 \u0627\u0632 \u06AF\u0627\u0644\u0631\u06CC
            </button></div></div></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(` `);
      if (cameraActive.value) {
        _push(`<div class="absolute inset-0 pointer-events-none" data-v-c9d97f11><div class="scanning-overlay" data-v-c9d97f11><div class="overlay-top" data-v-c9d97f11></div> <div class="overlay-bottom" data-v-c9d97f11></div> <div class="overlay-left" data-v-c9d97f11></div> <div class="overlay-right" data-v-c9d97f11></div></div> <div class="scanning-frame" data-v-c9d97f11><div class="w-64 h-64 relative" data-v-c9d97f11><div class="absolute -top-2 -left-2 w-6 h-6 border-l-3 border-t-3 border-white rounded-tl-lg" data-v-c9d97f11></div> <div class="absolute -top-2 -right-2 w-6 h-6 border-r-3 border-t-3 border-white rounded-tr-lg" data-v-c9d97f11></div> <div class="absolute -bottom-2 -left-2 w-6 h-6 border-l-3 border-b-3 border-white rounded-bl-lg" data-v-c9d97f11></div> <div class="absolute -bottom-2 -right-2 w-6 h-6 border-r-3 border-b-3 border-white rounded-br-lg" data-v-c9d97f11></div> <div class="absolute top-0 left-0 right-0 h-0.5 bg-white scan-line" data-v-c9d97f11></div></div></div> <div class="absolute bottom-32 left-4 right-4 text-center z-50" data-v-c9d97f11><div class="bg-black/30 backdrop-blur-sm rounded-xl p-3" data-v-c9d97f11><p class="text-white text-base font-medium" data-v-c9d97f11>QR \u06A9\u062F \u0631\u0627 \u062F\u0631 \u0642\u0627\u0628 \u0642\u0631\u0627\u0631 \u062F\u0647\u06CC\u062F</p></div></div></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div> <div class="footer-section" data-v-c9d97f11><div class="footer-content" data-v-c9d97f11>`);
      _push(ssrRenderComponent(_component_IconButton, {
        icon: "photo",
        variant: "tonal-primary",
        size: "lg",
        rounded: "",
        onClick: triggerFileInput,
        class: "qr-footer-button"
      }, null, _parent));
      _push(` `);
      if (!cameraActive.value) {
        _push(ssrRenderComponent(_component_IconTextButton, {
          icon: "camera",
          variant: "tonal-primary",
          size: "lg",
          style: { boxShadow: "none", marginBottom: "32px", background: "var(--color-primary)" },
          onClick: startCamera,
          class: "qr-main-button"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`
          \u0634\u0631\u0648\u0639 \u0627\u0633\u06A9\u0646
        `);
            } else {
              return [
                createTextVNode("\r\n          \u0634\u0631\u0648\u0639 \u0627\u0633\u06A9\u0646\r\n        ")
              ];
            }
          }),
          _: 1
        }, _parent));
      } else {
        _push(`<!---->`);
      }
      _push(` `);
      if (cameraActive.value) {
        _push(ssrRenderComponent(_component_IconTextButton, {
          icon: "qrcode",
          variant: "tonal-primary",
          size: "lg",
          style: { boxShadow: "none", marginBottom: "32px", background: "var(--color-primary)" },
          onClick: goToMyQRCode,
          class: "qr-main-button"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`
          QR \u06A9\u062F \u0645\u0646
        `);
            } else {
              return [
                createTextVNode("\r\n          QR \u06A9\u062F \u0645\u0646\r\n        ")
              ];
            }
          }),
          _: 1
        }, _parent));
      } else {
        _push(`<!---->`);
      }
      _push(` `);
      _push(ssrRenderComponent(_component_IconButton, {
        icon: "keyboard",
        variant: "tonal-primary",
        size: "lg",
        rounded: "",
        onClick: handleManualInput,
        class: "qr-footer-button"
      }, null, _parent));
      _push(`</div></div> <input type="file" accept="image/*" class="hidden" data-v-c9d97f11> `);
      _push(ssrRenderComponent(_component_BlumitaBottomSheet, {
        modelValue: showManualInputSheet.value,
        "onUpdate:modelValue": ($event) => showManualInputSheet.value = $event,
        title: "\u0648\u0627\u0631\u062F \u06A9\u0631\u062F\u0646 \u06A9\u062F \u062F\u0633\u062A\u06CC",
        size: "md",
        closable: true,
        "close-on-backdrop": true,
        "show-default-footer": false,
        "z-index": "99999"
      }, {
        header: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="text-center" data-v-c9d97f11${_scopeId}><div class="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4" data-v-c9d97f11${_scopeId}><i class="ti ti-keyboard text-primary text-2xl" data-v-c9d97f11${_scopeId}></i></div> <h3 class="text-xl font-bold text-foreground mb-2" data-v-c9d97f11${_scopeId}>\u0648\u0627\u0631\u062F \u06A9\u0631\u062F\u0646 \u06A9\u062F \u062F\u0633\u062A\u06CC</h3> <p class="text-muted-foreground text-sm" data-v-c9d97f11${_scopeId}>\u06A9\u062F \u0641\u0639\u0627\u0644\u200C\u0633\u0627\u0632\u06CC \u062F\u0633\u062A\u06AF\u0627\u0647 \u0631\u0627 \u0648\u0627\u0631\u062F \u06A9\u0646\u06CC\u062F</p></div>`);
          } else {
            return [
              createVNode("div", { class: "text-center" }, [
                createVNode("div", { class: "w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4" }, [
                  createVNode("i", { class: "ti ti-keyboard text-primary text-2xl" })
                ]),
                createTextVNode(),
                createVNode("h3", { class: "text-xl font-bold text-foreground mb-2" }, "\u0648\u0627\u0631\u062F \u06A9\u0631\u062F\u0646 \u06A9\u062F \u062F\u0633\u062A\u06CC"),
                createTextVNode(),
                createVNode("p", { class: "text-muted-foreground text-sm" }, "\u06A9\u062F \u0641\u0639\u0627\u0644\u200C\u0633\u0627\u0632\u06CC \u062F\u0633\u062A\u06AF\u0627\u0647 \u0631\u0627 \u0648\u0627\u0631\u062F \u06A9\u0646\u06CC\u062F")
              ])
            ];
          }
        }),
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(` <div class="px-6 pb-6" data-v-c9d97f11${_scopeId}><div class="mb-6" data-v-c9d97f11${_scopeId}><input${ssrRenderAttr("value", manualCode.value)} type="text" placeholder="\u06A9\u062F \u0641\u0639\u0627\u0644\u200C\u0633\u0627\u0632\u06CC" class="w-full p-4 border-2 border-border bg-background text-foreground placeholder-muted-foreground rounded-2xl text-center text-lg font-mono tracking-wider focus:border-primary focus:outline-none transition-colors" maxlength="20" autofocus data-v-c9d97f11${_scopeId}></div> <div class="flex gap-3" data-v-c9d97f11${_scopeId}>`);
            _push2(ssrRenderComponent(_component_BlumitaButton, {
              variant: "outline",
              size: "lg",
              class: "flex-1",
              onClick: ($event) => showManualInputSheet.value = false
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`
            \u0627\u0646\u0635\u0631\u0627\u0641
          `);
                } else {
                  return [
                    createTextVNode("\r\n            \u0627\u0646\u0635\u0631\u0627\u0641\r\n          ")
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(` `);
            _push2(ssrRenderComponent(_component_BlumitaButton, {
              variant: "primary",
              size: "lg",
              class: "flex-1",
              disabled: !manualCode.value.trim(),
              onClick: verifyManualCode
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`
            \u062A\u0627\u06CC\u06CC\u062F
          `);
                } else {
                  return [
                    createTextVNode("\r\n            \u062A\u0627\u06CC\u06CC\u062F\r\n          ")
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(`</div></div>`);
          } else {
            return [
              createTextVNode(),
              createVNode("div", { class: "px-6 pb-6" }, [
                createVNode("div", { class: "mb-6" }, [
                  withDirectives(createVNode("input", {
                    "onUpdate:modelValue": ($event) => manualCode.value = $event,
                    type: "text",
                    placeholder: "\u06A9\u062F \u0641\u0639\u0627\u0644\u200C\u0633\u0627\u0632\u06CC",
                    class: "w-full p-4 border-2 border-border bg-background text-foreground placeholder-muted-foreground rounded-2xl text-center text-lg font-mono tracking-wider focus:border-primary focus:outline-none transition-colors",
                    maxlength: "20",
                    autofocus: ""
                  }, null, 8, ["onUpdate:modelValue"]), [
                    [vModelText, manualCode.value]
                  ])
                ]),
                createTextVNode(),
                createVNode("div", { class: "flex gap-3" }, [
                  createVNode(_component_BlumitaButton, {
                    variant: "outline",
                    size: "lg",
                    class: "flex-1",
                    onClick: ($event) => showManualInputSheet.value = false
                  }, {
                    default: withCtx(() => [
                      createTextVNode("\r\n            \u0627\u0646\u0635\u0631\u0627\u0641\r\n          ")
                    ]),
                    _: 1
                  }, 8, ["onClick"]),
                  createTextVNode(),
                  createVNode(_component_BlumitaButton, {
                    variant: "primary",
                    size: "lg",
                    class: "flex-1",
                    disabled: !manualCode.value.trim(),
                    onClick: verifyManualCode
                  }, {
                    default: withCtx(() => [
                      createTextVNode("\r\n            \u062A\u0627\u06CC\u06CC\u062F\r\n          ")
                    ]),
                    _: 1
                  }, 8, ["disabled"])
                ])
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(` `);
      _push(ssrRenderComponent(_component_BlumitaBottomSheet, {
        modelValue: showSupportSheet.value,
        "onUpdate:modelValue": ($event) => showSupportSheet.value = $event,
        title: "\u067E\u0634\u062A\u06CC\u0628\u0627\u0646\u06CC \u0644\u06CC\u0646\u06A9\u0648",
        size: "md",
        closable: true,
        "close-on-backdrop": true,
        "show-default-footer": false,
        "z-index": "99999"
      }, {
        header: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="flex items-center py-2" data-v-c9d97f11${_scopeId}><div class="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center ml-3" data-v-c9d97f11${_scopeId}><i class="ti ti-headset text-primary text-2xl" data-v-c9d97f11${_scopeId}></i></div> <div class="text-right" data-v-c9d97f11${_scopeId}><h3 class="text-xl font-bold text-foreground mb-1" data-v-c9d97f11${_scopeId}>\u067E\u0634\u062A\u06CC\u0628\u0627\u0646\u06CC \u0644\u06CC\u0646\u06A9\u0648</h3> <p class="text-sm text-muted-foreground" data-v-c9d97f11${_scopeId}>\u0645\u0627 \u0622\u0645\u0627\u062F\u0647 \u06A9\u0645\u06A9 \u0628\u0647 \u0634\u0645\u0627 \u0647\u0633\u062A\u06CC\u0645</p></div></div>`);
          } else {
            return [
              createVNode("div", { class: "flex items-center py-2" }, [
                createVNode("div", { class: "w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center ml-3" }, [
                  createVNode("i", { class: "ti ti-headset text-primary text-2xl" })
                ]),
                createTextVNode(),
                createVNode("div", { class: "text-right" }, [
                  createVNode("h3", { class: "text-xl font-bold text-foreground mb-1" }, "\u067E\u0634\u062A\u06CC\u0628\u0627\u0646\u06CC \u0644\u06CC\u0646\u06A9\u0648"),
                  createTextVNode(),
                  createVNode("p", { class: "text-sm text-muted-foreground" }, "\u0645\u0627 \u0622\u0645\u0627\u062F\u0647 \u06A9\u0645\u06A9 \u0628\u0647 \u0634\u0645\u0627 \u0647\u0633\u062A\u06CC\u0645")
                ])
              ])
            ];
          }
        }),
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(` <div class="px-4 py-6" data-v-c9d97f11${_scopeId}><div class="space-y-4" data-v-c9d97f11${_scopeId}><button class="w-full bg-muted/50 border border-border rounded-xl p-4 transition-colors duration-200 flex items-center hover:bg-muted" data-v-c9d97f11${_scopeId}><div class="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center ml-4" data-v-c9d97f11${_scopeId}><i class="ti ti-message-circle text-primary text-xl" data-v-c9d97f11${_scopeId}></i></div> <div class="flex-1 text-right" data-v-c9d97f11${_scopeId}><div class="font-semibold text-foreground mb-1" data-v-c9d97f11${_scopeId}>\u06AF\u0641\u062A\u06AF\u0648\u06CC \u0622\u0646\u0644\u0627\u06CC\u0646</div> <div class="text-sm text-muted-foreground" data-v-c9d97f11${_scopeId}>\u067E\u0627\u0633\u062E \u0641\u0648\u0631\u06CC - \u06F2\u06F4/\u06F7 \u062F\u0631 \u062F\u0633\u062A\u0631\u0633</div></div> <i class="ti ti-chevron-left text-muted-foreground" data-v-c9d97f11${_scopeId}></i></button> <button class="w-full bg-muted/50 border border-border rounded-xl p-4 transition-colors duration-200 flex items-center hover:bg-muted" data-v-c9d97f11${_scopeId}><div class="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center ml-4" data-v-c9d97f11${_scopeId}><i class="ti ti-phone text-primary text-xl" data-v-c9d97f11${_scopeId}></i></div> <div class="flex-1 text-right" data-v-c9d97f11${_scopeId}><div class="font-semibold text-foreground mb-1" data-v-c9d97f11${_scopeId}>\u062A\u0645\u0627\u0633 \u062A\u0644\u0641\u0646\u06CC</div> <div class="text-sm text-muted-foreground" data-v-c9d97f11${_scopeId}>\u0634\u0646\u0628\u0647 \u062A\u0627 \u067E\u0646\u062C\u200C\u0634\u0646\u0628\u0647 \u06F9 \u062A\u0627 \u06F1\u06F8</div></div> <i class="ti ti-chevron-left text-muted-foreground" data-v-c9d97f11${_scopeId}></i></button> <button class="w-full bg-muted/50 border border-border rounded-xl p-4 transition-colors duration-200 flex items-center hover:bg-muted" data-v-c9d97f11${_scopeId}><div class="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center ml-4" data-v-c9d97f11${_scopeId}><i class="ti ti-mail text-primary text-xl" data-v-c9d97f11${_scopeId}></i></div> <div class="flex-1 text-right" data-v-c9d97f11${_scopeId}><div class="font-semibold text-foreground mb-1" data-v-c9d97f11${_scopeId}>\u0627\u06CC\u0645\u06CC\u0644 \u067E\u0634\u062A\u06CC\u0628\u0627\u0646\u06CC</div> <div class="text-sm text-muted-foreground" data-v-c9d97f11${_scopeId}>\u067E\u0627\u0633\u062E \u062F\u0631 \u06A9\u0645\u062A\u0631 \u0627\u0632 \u06F2\u06F4 \u0633\u0627\u0639\u062A</div></div> <i class="ti ti-chevron-left text-muted-foreground" data-v-c9d97f11${_scopeId}></i></button> `);
            _push2(ssrRenderComponent(_component_BlumitaButton, {
              variant: "outline",
              size: "lg",
              class: "w-full",
              onClick: ($event) => showSupportSheet.value = false
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`
            \u0628\u0633\u062A\u0646
          `);
                } else {
                  return [
                    createTextVNode("\r\n            \u0628\u0633\u062A\u0646\r\n          ")
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(`</div></div>`);
          } else {
            return [
              createTextVNode(),
              createVNode("div", { class: "px-4 py-6" }, [
                createVNode("div", { class: "space-y-4" }, [
                  createVNode("button", {
                    onClick: handleStartChat,
                    class: "w-full bg-muted/50 border border-border rounded-xl p-4 transition-colors duration-200 flex items-center hover:bg-muted"
                  }, [
                    createVNode("div", { class: "w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center ml-4" }, [
                      createVNode("i", { class: "ti ti-message-circle text-primary text-xl" })
                    ]),
                    createTextVNode(),
                    createVNode("div", { class: "flex-1 text-right" }, [
                      createVNode("div", { class: "font-semibold text-foreground mb-1" }, "\u06AF\u0641\u062A\u06AF\u0648\u06CC \u0622\u0646\u0644\u0627\u06CC\u0646"),
                      createTextVNode(),
                      createVNode("div", { class: "text-sm text-muted-foreground" }, "\u067E\u0627\u0633\u062E \u0641\u0648\u0631\u06CC - \u06F2\u06F4/\u06F7 \u062F\u0631 \u062F\u0633\u062A\u0631\u0633")
                    ]),
                    createTextVNode(),
                    createVNode("i", { class: "ti ti-chevron-left text-muted-foreground" })
                  ]),
                  createTextVNode(),
                  createVNode("button", {
                    onClick: handleMakeCall,
                    class: "w-full bg-muted/50 border border-border rounded-xl p-4 transition-colors duration-200 flex items-center hover:bg-muted"
                  }, [
                    createVNode("div", { class: "w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center ml-4" }, [
                      createVNode("i", { class: "ti ti-phone text-primary text-xl" })
                    ]),
                    createTextVNode(),
                    createVNode("div", { class: "flex-1 text-right" }, [
                      createVNode("div", { class: "font-semibold text-foreground mb-1" }, "\u062A\u0645\u0627\u0633 \u062A\u0644\u0641\u0646\u06CC"),
                      createTextVNode(),
                      createVNode("div", { class: "text-sm text-muted-foreground" }, "\u0634\u0646\u0628\u0647 \u062A\u0627 \u067E\u0646\u062C\u200C\u0634\u0646\u0628\u0647 \u06F9 \u062A\u0627 \u06F1\u06F8")
                    ]),
                    createTextVNode(),
                    createVNode("i", { class: "ti ti-chevron-left text-muted-foreground" })
                  ]),
                  createTextVNode(),
                  createVNode("button", {
                    onClick: handleSendEmail,
                    class: "w-full bg-muted/50 border border-border rounded-xl p-4 transition-colors duration-200 flex items-center hover:bg-muted"
                  }, [
                    createVNode("div", { class: "w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center ml-4" }, [
                      createVNode("i", { class: "ti ti-mail text-primary text-xl" })
                    ]),
                    createTextVNode(),
                    createVNode("div", { class: "flex-1 text-right" }, [
                      createVNode("div", { class: "font-semibold text-foreground mb-1" }, "\u0627\u06CC\u0645\u06CC\u0644 \u067E\u0634\u062A\u06CC\u0628\u0627\u0646\u06CC"),
                      createTextVNode(),
                      createVNode("div", { class: "text-sm text-muted-foreground" }, "\u067E\u0627\u0633\u062E \u062F\u0631 \u06A9\u0645\u062A\u0631 \u0627\u0632 \u06F2\u06F4 \u0633\u0627\u0639\u062A")
                    ]),
                    createTextVNode(),
                    createVNode("i", { class: "ti ti-chevron-left text-muted-foreground" })
                  ]),
                  createTextVNode(),
                  createVNode(_component_BlumitaButton, {
                    variant: "outline",
                    size: "lg",
                    class: "w-full",
                    onClick: ($event) => showSupportSheet.value = false
                  }, {
                    default: withCtx(() => [
                      createTextVNode("\r\n            \u0628\u0633\u062A\u0646\r\n          ")
                    ]),
                    _: 1
                  }, 8, ["onClick"])
                ])
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(` `);
      if (scanResult.value.show) {
        _push(`<div class="${ssrRenderClass([
          "fixed top-28 left-4 right-4 p-4 rounded-2xl text-white z-40 flex items-center gap-3 transition-all duration-300 backdrop-blur-sm",
          scanResult.value.success ? "bg-green-600/90" : "bg-red-600/90"
        ])}" data-v-c9d97f11>`);
        if (scanResult.value.success) {
          _push(`<i class="ti ti-check text-2xl flex-shrink-0" data-v-c9d97f11></i>`);
        } else {
          _push(`<i class="ti ti-x text-2xl flex-shrink-0" data-v-c9d97f11></i>`);
        }
        _push(` <span class="font-medium" data-v-c9d97f11>${ssrInterpolate(scanResult.value.message)}</span></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(` `);
      if (showQRCodeFullScreen.value) {
        _push(ssrRenderComponent(_component_QRCodeFullScreen, {
          "qr-data": userQRData.value,
          "user-name": userName.value,
          onClose: ($event) => showQRCodeFullScreen.value = false
        }, null, _parent));
      } else {
        _push(`<!---->`);
      }
      _push(`</div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/QR/QRScannerPage.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const QRScannerPage = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-c9d97f11"]]);

export { QRScannerPage as default };
//# sourceMappingURL=QRScannerPage-DSI_i77s.mjs.map
