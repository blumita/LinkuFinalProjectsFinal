import process from 'node:process';globalThis._importMeta_=globalThis._importMeta_||{url:"file:///_entry.js",env:process.env};import { u as useAuthStore, a as useNuxtApp, _ as __nuxt_component_0$3, n as navigateTo, e as __nuxt_component_0$2 } from './server.mjs';
import { defineComponent, computed, ref, provide, mergeProps, unref, withCtx, createVNode, createTextVNode, createBlock, openBlock, Fragment, renderList, createCommentVNode, toDisplayString, mergeModels, watch, resolveDynamicComponent, markRaw, useModel, shallowRef, nextTick, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderClass, ssrRenderSlot, ssrInterpolate, ssrRenderList, ssrRenderAttr, ssrRenderVNode, ssrRenderStyle, ssrRenderTeleport } from 'vue/server-renderer';
import { useRoute, useRouter } from 'vue-router';
import QRCode from 'qrcode';
import { _ as _export_sfc } from './_plugin-vue_export-helper-1tPrXgE0.mjs';
import { _ as __nuxt_component_0 } from './BottomSheet-DZASh2SV.mjs';
import { u as useFormStore } from './form-CUJQskNk.mjs';
import { u as useNotificationStore } from './notification-DoVDic--.mjs';
import { u as useUserStore } from './user-D1YL8aKq.mjs';
import { u as useIconComponents } from './useIconComponentsMap-DPTCqB5g.mjs';
import { u as useCardStore } from './card-CINoY8tz.mjs';
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
import './interval-plzJUXXs.mjs';

const _sfc_main$e = {
  __name: "Toast",
  __ssrInlineRender: true,
  props: {
    title: {
      type: String,
      required: true
    },
    message: {
      type: String,
      default: ""
    },
    type: {
      type: String,
      default: "success",
      validator: (value) => ["success", "error", "info", "warning"].includes(value)
    },
    duration: {
      type: Number,
      default: 2500
    },
    autoClose: {
      type: Boolean,
      default: true
    }
  },
  emits: ["close"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const show = ref(false);
    const toastBgClass = computed(() => {
      switch (props.type) {
        case "success":
          return "bg-emerald-600/95 border border-emerald-400/20";
        case "error":
          return "bg-red-600/95 border border-red-400/20";
        case "warning":
          return "bg-amber-600/95 border border-amber-400/20";
        case "info":
          return "bg-blue-600/95 border border-blue-400/20";
        default:
          return "bg-emerald-600/95 border border-emerald-400/20";
      }
    });
    const iconBgClass = computed(() => "bg-white/20");
    const iconClass = computed(() => {
      switch (props.type) {
        case "success":
          return "ti ti-check";
        case "error":
          return "ti ti-x";
        case "warning":
          return "ti ti-alert-triangle";
        case "info":
          return "ti ti-info-circle";
        default:
          return "ti ti-check";
      }
    });
    const iconColorClass = computed(() => "text-white");
    return (_ctx, _push, _parent, _attrs) => {
      ssrRenderTeleport(_push, (_push2) => {
        if (show.value) {
          _push2(`<div class="fixed top-8 left-1/2 -translate-x-1/2 z-[99999]"><div class="${ssrRenderClass([
            "flex items-center gap-3 px-5 py-3.5 rounded-2xl shadow-2xl backdrop-blur-2xl",
            "min-w-[200px] max-w-[90vw]",
            toastBgClass.value
          ])}"><div class="${ssrRenderClass(["w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0", iconBgClass.value])}"><i class="${ssrRenderClass([iconClass.value, "text-xl", iconColorClass.value])}"></i></div> <div class="flex flex-col flex-1 min-w-0"><span class="font-semibold text-sm text-white truncate">${ssrInterpolate(__props.title)}</span> `);
          if (__props.message) {
            _push2(`<span class="text-xs text-white/70 truncate">${ssrInterpolate(__props.message)}</span>`);
          } else {
            _push2(`<!---->`);
          }
          _push2(`</div></div></div>`);
        } else {
          _push2(`<!---->`);
        }
      }, "body", false, _parent);
    };
  }
};
const _sfc_setup$e = _sfc_main$e.setup;
_sfc_main$e.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/ui/Toast.vue");
  return _sfc_setup$e ? _sfc_setup$e(props, ctx) : void 0;
};
const _sfc_main$d = {
  __name: "EditPhoneModal",
  __ssrInlineRender: true,
  props: {
    visible: Boolean,
    modelValue: String
  },
  emits: ["close", "update"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const phone = ref(props.modelValue || "");
    watch(() => props.modelValue, (val) => {
      phone.value = val || "";
    });
    const otpError = ref(false);
    const otpSuccess = ref(false);
    const step = ref(1);
    const otp = ref(["", "", "", ""]);
    ref([]);
    ref(false);
    ref("");
    ref("ti-alert-triangle");
    return (_ctx, _push, _parent, _attrs) => {
      ssrRenderTeleport(_push, (_push2) => {
        if (__props.visible) {
          _push2(`<div class="fixed inset-0 z-[999] flex items-center justify-center bg-black/50 backdrop-blur-sm" data-v-8ed94b6a><div class="bg-white rounded-2xl w-96 shadow-xl p-6 scale-100" data-v-8ed94b6a><div class="flex items-center gap-2 mb-4 text-black" data-v-8ed94b6a><i class="ti ti-device-mobile text-2xl" data-v-8ed94b6a></i> <h2 class="text-lg font-bold" data-v-8ed94b6a>${ssrInterpolate(step.value === 1 ? "\u0648\u06CC\u0631\u0627\u06CC\u0634 \u0634\u0645\u0627\u0631\u0647 \u0645\u0648\u0628\u0627\u06CC\u0644" : "\u062A\u0627\u06CC\u06CC\u062F \u06A9\u062F")}</h2></div> `);
          if (step.value === 1) {
            _push2(`<div class="mb-4" data-v-8ed94b6a><label class="block text-sm text-gray-600 mb-1" data-v-8ed94b6a>\u0634\u0645\u0627\u0631\u0647 \u062C\u062F\u06CC\u062F</label> <input type="tel"${ssrRenderAttr("value", phone.value)} placeholder="\u0645\u062B\u0644\u0627\u064B 09123456789" class="w-full px-3 py-2 rounded-md border border-gray-300 focus:ring-2 focus:ring-black focus:outline-none text-sm text-gray-700" data-v-8ed94b6a></div>`);
          } else {
            _push2(`<div class="mb-4" data-v-8ed94b6a><div class="flex justify-center gap-2 ltr" data-v-8ed94b6a><!--[-->`);
            ssrRenderList(otp.value.length, (digit, index) => {
              _push2(`<input${ssrRenderAttr("value", otp.value[index])} type="text" inputmode="numeric" maxlength="1" pattern="[0-9]*" class="w-12 h-12 text-xl text-center border rounded-lg font-bold text-gray-700" dir="ltr" data-v-8ed94b6a>`);
            });
            _push2(`<!--]--> `);
            if (otpError.value) {
              _push2(`<p class="text-xs text-red-600" data-v-8ed94b6a>\u06A9\u062F \u0648\u0627\u0631\u062F \u0634\u062F\u0647 \u0646\u0627\u062F\u0631\u0633\u062A \u0627\u0633\u062A.</p>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(` `);
            if (otpSuccess.value) {
              _push2(`<p class="text-xs text-green-600" data-v-8ed94b6a>\u0634\u0645\u0627\u0631\u0647 \u0645\u0648\u0628\u0627\u06CC\u0644 \u062A\u0623\u06CC\u06CC\u062F \u0634\u062F.</p>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</div> <p class="text-xs text-gray-500 mt-2" data-v-8ed94b6a>
              \u06A9\u062F \u0628\u0647 \u0634\u0645\u0627\u0631\u0647 <span class="font-medium" data-v-8ed94b6a>${ssrInterpolate(phone.value)}</span> \u0627\u0631\u0633\u0627\u0644 \u0634\u062F.
            </p></div>`);
          }
          _push2(` <div class="flex justify-end gap-2 mt-6" data-v-8ed94b6a><button class="px-4 py-2 text-sm rounded-md border border-gray-300 text-gray-700 hover:bg-gray-100" data-v-8ed94b6a>
              \u0644\u063A\u0648
            </button> `);
          if (step.value === 1) {
            _push2(`<button class="px-4 py-2 text-sm rounded-md bg-black text-white hover:bg-gray-900" data-v-8ed94b6a>
              \u0627\u0631\u0633\u0627\u0644 \u06A9\u062F
            </button>`);
          } else {
            _push2(`<button class="px-4 py-2 text-sm rounded-md bg-black text-white hover:bg-gray-900" data-v-8ed94b6a>
              \u062A\u0627\u06CC\u06CC\u062F
            </button>`);
          }
          _push2(`</div></div></div>`);
        } else {
          _push2(`<!---->`);
        }
      }, "body", false, _parent);
    };
  }
};
const _sfc_setup$d = _sfc_main$d.setup;
_sfc_main$d.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/UserDashboard/modals/EditPhoneModal.vue");
  return _sfc_setup$d ? _sfc_setup$d(props, ctx) : void 0;
};
const EditPhoneModal = /* @__PURE__ */ _export_sfc(_sfc_main$d, [["__scopeId", "data-v-8ed94b6a"]]);
const _sfc_main$c = {
  __name: "ActionMenu",
  __ssrInlineRender: true,
  emits: ["action", "download-qr", "edit-mobile"],
  setup(__props, { emit: __emit }) {
    const open = ref(false);
    const isMobile = ref(false);
    const emit = __emit;
    const actions = [
      { key: "view", label: "\u0645\u0634\u0627\u0647\u062F\u0647 \u067E\u0631\u0648\u0642\u0627\u06CC\u0644", icon: "ti-eye" },
      { key: "share", label: "\u0627\u0634\u062A\u0631\u0627\u06A9 \u06A9\u0627\u0631\u062A", icon: "ti-share" },
      { key: "downloadQR", label: "\u062F\u0627\u0646\u0644\u0648\u062F QR", icon: "ti-download" },
      { key: "editMobile", label: "\u0648\u06CC\u0631\u0627\u06CC\u0634 \u0645\u0648\u0628\u0627\u06CC\u0644", icon: "ti-mail" }
    ];
    const handleAction = (key) => {
      switch (key) {
        case "view":
          emit("action", "show-profile");
          break;
        case "share":
          emit("action", "open-share");
          break;
        case "downloadQR":
          emit("download-qr");
          break;
        case "editMobile":
          emit("edit-mobile");
          break;
      }
      open.value = false;
    };
    return (_ctx, _push, _parent, _attrs) => {
      const _component_UiBottomSheet = __nuxt_component_0;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "relative min-w-0" }, _attrs))} data-v-c9d5f0d2><button class="w-10 h-10 border border-gray-300 text-gray-700 rounded-full flex items-center justify-center shrink-0 hover:bg-gray-100 transition" aria-label="\u0646\u0645\u0627\u06CC\u0634 \u0645\u0646\u0648" data-v-c9d5f0d2><i class="ti ti-dots" data-v-c9d5f0d2></i></button> `);
      if (open.value && !isMobile.value) {
        _push(`<div class="absolute left-0 mt-2 w-48 bg-white rounded-md shadow-lg z-50" data-v-c9d5f0d2><ul class="text-sm p-2 space-y-2" data-v-c9d5f0d2><!--[-->`);
        ssrRenderList(actions, (action) => {
          _push(`<li class="hover:bg-gray-100 p-2 rounded flex items-center gap-2 cursor-pointer text-gray-700" data-v-c9d5f0d2><i class="${ssrRenderClass(`ti ${action.icon} text-lg`)}" data-v-c9d5f0d2></i> ${ssrInterpolate(action.label)}</li>`);
        });
        _push(`<!--]--></ul></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(` `);
      _push(ssrRenderComponent(_component_UiBottomSheet, {
        visible: open.value && isMobile.value,
        title: "\u0645\u0646\u0648\u06CC \u0639\u0645\u0644\u06CC\u0627\u062A",
        "desktop-centered": false,
        "height-class": "max-h-[50vh]",
        "content-padding": "p-4",
        onClose: ($event) => open.value = false
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<ul class="text-base space-y-1" data-v-c9d5f0d2${_scopeId}><!--[-->`);
            ssrRenderList(actions, (action) => {
              _push2(`<li class="hover:bg-gray-100 p-4 rounded-lg flex items-center gap-3 cursor-pointer text-gray-700" data-v-c9d5f0d2${_scopeId}><i class="${ssrRenderClass(`ti ${action.icon} text-lg`)}" data-v-c9d5f0d2${_scopeId}></i> ${ssrInterpolate(action.label)}</li>`);
            });
            _push2(`<!--]--></ul>`);
          } else {
            return [
              createVNode("ul", { class: "text-base space-y-1" }, [
                (openBlock(), createBlock(Fragment, null, renderList(actions, (action) => {
                  return createVNode("li", {
                    key: action.key,
                    class: "hover:bg-gray-100 p-4 rounded-lg flex items-center gap-3 cursor-pointer text-gray-700",
                    onClick: ($event) => handleAction(action.key)
                  }, [
                    createVNode("i", {
                      class: `ti ${action.icon} text-lg`
                    }, null, 2),
                    createTextVNode(" " + toDisplayString(action.label), 1)
                  ], 8, ["onClick"]);
                }), 64))
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div>`);
    };
  }
};
const _sfc_setup$c = _sfc_main$c.setup;
_sfc_main$c.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/ui/ActionMenu.vue");
  return _sfc_setup$c ? _sfc_setup$c(props, ctx) : void 0;
};
const ActionMenu = /* @__PURE__ */ _export_sfc(_sfc_main$c, [["__scopeId", "data-v-c9d5f0d2"]]);
const _sfc_main$b = {
  __name: "NotificationMenu",
  __ssrInlineRender: true,
  setup(__props) {
    const open = ref(false);
    const isMobile = ref(false);
    const notificationStore = useNotificationStore();
    const unreadCount = computed(
      () => {
        var _a;
        return ((_a = notificationStore.notifications) == null ? void 0 : _a.length) ? notificationStore.notifications.filter((n) => !n.read).length : 0;
      }
    );
    const handleMarkAsRead = async (id) => {
      await notificationStore.markAsRead(id);
    };
    const iconClass = (type) => {
      switch (type) {
        case "subscription":
          return "ti ti-clock text-orange-600";
        case "payment":
          return "ti ti-check text-green-600";
        case "system":
          return "ti ti-refresh text-blue-600";
        case "security":
          return "ti ti-alert-circle text-red-600";
        case "general":
          return "ti ti-info-circle text-gray-600";
        default:
          return "ti ti-bell text-gray-600";
      }
    };
    const iconBgClass = (type) => {
      switch (type) {
        case "subscription":
          return "bg-orange-100";
        case "payment":
          return "bg-green-100";
        case "system":
          return "bg-blue-100";
        case "security":
          return "bg-red-100";
        case "general":
          return "bg-gray-100";
        default:
          return "bg-gray-100";
      }
    };
    const timeAgo = (date) => {
      const diff = (Date.now() - date.getTime()) / 1e3;
      if (diff < 60) return "\u0644\u062D\u0638\u0627\u062A\u06CC \u067E\u06CC\u0634";
      if (diff < 3600) return `${Math.floor(diff / 60)} \u062F\u0642\u06CC\u0642\u0647 \u067E\u06CC\u0634`;
      if (diff < 86400) return `${Math.floor(diff / 3600)} \u0633\u0627\u0639\u062A \u067E\u06CC\u0634`;
      return `${Math.floor(diff / 86400)} \u0631\u0648\u0632 \u067E\u06CC\u0634`;
    };
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0$2;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "relative min-w-0" }, _attrs))}><button class="w-10 h-10 flex items-center justify-center text-gray-600 hover:text-black transition-colors rounded-lg hover:bg-gray-100 shrink-0" title="\u0646\u0648\u062A\u06CC\u0641\u06CC\u06A9\u06CC\u0634\u0646\u200C\u0647\u0627"><i class="ti ti-bell text-xl"></i> `);
      if (unref(unreadCount) > 0) {
        _push(`<span class="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse"></span>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</button> `);
      if (open.value && !isMobile.value) {
        _push(`<div class="absolute left-0 mt-2 w-80 bg-white border border-gray-200 rounded-lg shadow-lg z-50 overflow-hidden"><div class="p-4 border-b border-gray-100"><h3 class="font-semibold text-gray-800 flex items-center gap-2"><i class="ti ti-bell text-lg"></i>
          \u0646\u0648\u062A\u06CC\u0641\u06CC\u06A9\u06CC\u0634\u0646\u200C\u0647\u0627
        </h3> `);
        if (unref(unreadCount) > 0) {
          _push(`<button class="text-xs text-blue-600 hover:text-blue-800">
          \u0639\u0644\u0627\u0645\u062A\u200C\u06AF\u0630\u0627\u0631\u06CC \u0647\u0645\u0647 \u0628\u0647 \u0639\u0646\u0648\u0627\u0646 \u062E\u0648\u0627\u0646\u062F\u0647 \u0634\u062F\u0647
        </button>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div> <div class="max-h-64 overflow-y-auto"><!--[-->`);
        ssrRenderList(unref(notificationStore).notifications, (notif) => {
          _push(`<div class="${ssrRenderClass([[!notif.read ? "border-r-4 border-blue-500 bg-blue-50" : "bg-white"], "p-4 hover:bg-gray-50 border-b border-gray-100 transition-colors cursor-pointer flex items-start gap-3"])}"><div class="flex items-start gap-3"><div class="${ssrRenderClass([iconBgClass(notif.type), "w-8 h-8 rounded-full flex items-center justify-center shrink-0"])}"><i class="${ssrRenderClass([iconClass(notif.type), "text-sm"])}"></i></div> <div class="flex-1"><p class="text-sm font-medium text-gray-800">${ssrInterpolate(notif.title)}</p> <p class="text-xs text-gray-600 mt-1">${ssrInterpolate(notif.description)}</p> <span class="text-xs text-gray-400">${ssrInterpolate(timeAgo(notif.createdAt))}</span></div></div></div>`);
        });
        _push(`<!--]--></div> <div class="p-3 border-t border-gray-100">`);
        _push(ssrRenderComponent(_component_NuxtLink, {
          to: "/dashboard/notifications",
          onClick: ($event) => open.value = false,
          class: "w-full block text-center text-sm text-blue-600 hover:text-blue-800 transition-colors"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`
          \u0645\u0634\u0627\u0647\u062F\u0647 \u0647\u0645\u0647 \u0646\u0648\u062A\u06CC\u0641\u06CC\u06A9\u06CC\u0634\u0646\u200C\u0647\u0627
        `);
            } else {
              return [
                createTextVNode("\r\n          \u0645\u0634\u0627\u0647\u062F\u0647 \u0647\u0645\u0647 \u0646\u0648\u062A\u06CC\u0641\u06CC\u06A9\u06CC\u0634\u0646\u200C\u0647\u0627\r\n        ")
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`</div></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(` `);
      _push(ssrRenderComponent(__nuxt_component_0, {
        visible: open.value && isMobile.value,
        title: "\u0646\u0648\u062A\u06CC\u0641\u06CC\u06A9\u06CC\u0634\u0646\u200C\u0647\u0627",
        "desktop-centered": false,
        "height-class": "max-h-[80vh]",
        "content-padding": "p-0",
        onClose: ($event) => open.value = false
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="max-h-64 overflow-y-auto"${_scopeId}><!--[-->`);
            ssrRenderList(unref(notificationStore).notifications, (notif) => {
              _push2(`<div class="${ssrRenderClass([
                "p-4 hover:bg-gray-50 border-b border-gray-100 transition-colors cursor-pointer",
                !notif.read ? "border-r-4 border-blue-500" : "bg-white"
              ])}"${_scopeId}><div class="flex items-start gap-3"${_scopeId}><div class="${ssrRenderClass([iconBgClass(notif.type), "w-8 h-8 rounded-full flex items-center justify-center shrink-0"])}"${_scopeId}><i class="${ssrRenderClass([iconClass(notif.type), "text-sm"])}"${_scopeId}></i></div> <div class="flex-1"${_scopeId}><p class="text-sm font-medium text-gray-800"${_scopeId}>${ssrInterpolate(notif.title)}</p> <p class="text-xs text-gray-600 mt-1"${_scopeId}>${ssrInterpolate(notif.description)}</p> <span class="text-xs text-gray-400"${_scopeId}>${ssrInterpolate(timeAgo(notif.createdAt))}</span></div></div></div>`);
            });
            _push2(`<!--]--></div> <div class="p-3 border-t border-gray-100"${_scopeId}>`);
            _push2(ssrRenderComponent(_component_NuxtLink, {
              to: "/dashboard/notifications",
              onClick: ($event) => open.value = false,
              class: "w-full block text-center text-sm text-blue-600 hover:text-blue-800 transition-colors"
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`
          \u0645\u0634\u0627\u0647\u062F\u0647 \u0647\u0645\u0647 \u0646\u0648\u062A\u06CC\u0641\u06CC\u06A9\u06CC\u0634\u0646\u200C\u0647\u0627
        `);
                } else {
                  return [
                    createTextVNode("\r\n          \u0645\u0634\u0627\u0647\u062F\u0647 \u0647\u0645\u0647 \u0646\u0648\u062A\u06CC\u0641\u06CC\u06A9\u06CC\u0634\u0646\u200C\u0647\u0627\r\n        ")
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(`</div>`);
          } else {
            return [
              createVNode("div", { class: "max-h-64 overflow-y-auto" }, [
                (openBlock(true), createBlock(Fragment, null, renderList(unref(notificationStore).notifications, (notif) => {
                  return openBlock(), createBlock("div", {
                    key: notif.id,
                    class: [
                      "p-4 hover:bg-gray-50 border-b border-gray-100 transition-colors cursor-pointer",
                      !notif.read ? "border-r-4 border-blue-500" : "bg-white"
                    ],
                    onClick: ($event) => handleMarkAsRead(notif.id)
                  }, [
                    createVNode("div", { class: "flex items-start gap-3" }, [
                      createVNode("div", {
                        class: ["w-8 h-8 rounded-full flex items-center justify-center shrink-0", iconBgClass(notif.type)]
                      }, [
                        createVNode("i", {
                          class: [iconClass(notif.type), "text-sm"]
                        }, null, 2)
                      ], 2),
                      createTextVNode(),
                      createVNode("div", { class: "flex-1" }, [
                        createVNode("p", { class: "text-sm font-medium text-gray-800" }, toDisplayString(notif.title), 1),
                        createTextVNode(),
                        createVNode("p", { class: "text-xs text-gray-600 mt-1" }, toDisplayString(notif.description), 1),
                        createTextVNode(),
                        createVNode("span", { class: "text-xs text-gray-400" }, toDisplayString(timeAgo(notif.createdAt)), 1)
                      ])
                    ])
                  ], 10, ["onClick"]);
                }), 128))
              ]),
              createTextVNode(),
              createVNode("div", { class: "p-3 border-t border-gray-100" }, [
                createVNode(_component_NuxtLink, {
                  to: "/dashboard/notifications",
                  onClick: ($event) => open.value = false,
                  class: "w-full block text-center text-sm text-blue-600 hover:text-blue-800 transition-colors"
                }, {
                  default: withCtx(() => [
                    createTextVNode("\r\n          \u0645\u0634\u0627\u0647\u062F\u0647 \u0647\u0645\u0647 \u0646\u0648\u062A\u06CC\u0641\u06CC\u06A9\u06CC\u0634\u0646\u200C\u0647\u0627\r\n        ")
                  ]),
                  _: 1
                }, 8, ["onClick"])
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div>`);
    };
  }
};
const _sfc_setup$b = _sfc_main$b.setup;
_sfc_main$b.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/ui/NotificationMenu.vue");
  return _sfc_setup$b ? _sfc_setup$b(props, ctx) : void 0;
};
const _sfc_main$a = {
  __name: "index",
  __ssrInlineRender: true,
  props: /* @__PURE__ */ mergeModels({
    showBack: Boolean,
    userName: String,
    showSearch: Boolean,
    showMore: Boolean,
    showNotifications: Boolean,
    showShare: Boolean,
    showAddCard: Boolean,
    title: String,
    showCardSelect: Boolean,
    showStateSelect: Boolean,
    userLogo: String,
    userPhone: String,
    cardSlug: String,
    qrBgColor: String,
    qrColor: String
  }, {
    "search": {},
    "searchModifiers": {}
  }),
  emits: /* @__PURE__ */ mergeModels([
    "open-share",
    "search",
    "action",
    "add-card",
    "toggle-sidebar"
  ], ["update:search"]),
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emit = __emit;
    const search = useModel(__props, "search");
    const searchModel = computed({
      get: () => search.value,
      set: (v) => search.value = v
    });
    const menuOpen = ref(false);
    const showEditModal = ref(false);
    const userPhone = ref(props.userPhone);
    const mobileSearchOpen = ref(false);
    const emitAction = (action) => {
      emit("action", action);
      menuOpen.value = false;
    };
    const handlePhoneUpdate = (newPhone) => {
      userPhone.value = newPhone;
    };
    const form = useFormStore();
    computed(() => form.defaultCard);
    const handleDownloadQR = async () => {
      var _a;
      const size = 800;
      const canvas = (void 0).createElement("canvas");
      canvas.width = size;
      canvas.height = size;
      const ctx = canvas.getContext("2d");
      const data = `https://linku.im/profile/${props.cardSlug}/share`;
      await QRCode.toCanvas(canvas, data, {
        errorCorrectionLevel: "H",
        width: size,
        margin: 2,
        color: {
          dark: props.qrColor ? props.qrColor : "#000000",
          light: props.qrBgColor ? props.qrBgColor : "#ffffff"
        }
      });
      const logoSrc = ((_a = props.userLogo) == null ? void 0 : _a.trim()) ? props.userLogo : new URL("@/assets/logo/logo.png", globalThis._importMeta_.url).href;
      const logo = new Image();
      logo.crossOrigin = "anonymous";
      logo.src = logoSrc;
      await new Promise((resolve, reject) => {
        logo.onload = () => {
          const boxSize = size * 0.22;
          const x = (size - boxSize) / 2;
          const y = (size - boxSize) / 2;
          ctx.save();
          ctx.beginPath();
          const r = 16;
          ctx.moveTo(x + r, y);
          ctx.lineTo(x + boxSize - r, y);
          ctx.quadraticCurveTo(x + boxSize, y, x + boxSize, y + r);
          ctx.lineTo(x + boxSize, y + boxSize - r);
          ctx.quadraticCurveTo(x + boxSize, y + boxSize, x + boxSize - r, y + boxSize);
          ctx.lineTo(x + r, y + boxSize);
          ctx.quadraticCurveTo(x, y + boxSize, x, y + boxSize - r);
          ctx.lineTo(x, y + r);
          ctx.quadraticCurveTo(x, y, x + r, y);
          ctx.closePath();
          ctx.fillStyle = "#ffffff";
          ctx.fill();
          ctx.clip();
          const padding = boxSize * 0.12;
          const maxLogoWidth = boxSize - padding * 2;
          const maxLogoHeight = boxSize - padding * 2;
          const ratio = Math.min(maxLogoWidth / logo.width, maxLogoHeight / logo.height);
          const drawWidth = logo.width * ratio;
          const drawHeight = logo.height * ratio;
          const offsetX = x + (boxSize - drawWidth) / 2;
          const offsetY = y + (boxSize - drawHeight) / 2;
          ctx.drawImage(logo, offsetX, offsetY, drawWidth, drawHeight);
          ctx.restore();
          resolve();
        };
        logo.onerror = reject;
      });
      const link = (void 0).createElement("a");
      link.href = canvas.toDataURL("image/png");
      link.download = `qr-${userPhone.value}.png`;
      link.click();
    };
    return (_ctx, _push, _parent, _attrs) => {
      var _a;
      const _component_NuxtLink = __nuxt_component_0$2;
      _push(`<!--[--><header class="hidden" data-v-db0bc4b5><div class="flex flex-wrap items-center justify-between gap-4 overflow-x-auto md:overflow-visible min-w-0" data-v-db0bc4b5><div class="flex items-center gap-2 flex-shrink-0 min-w-0" data-v-db0bc4b5><button class="w-10 h-10 bg-white border text-gray-700 rounded-lg md:hidden flex items-center justify-center shrink-0" data-v-db0bc4b5><i class="ti ti-menu text-base" data-v-db0bc4b5></i></button> `);
      if (__props.showBack) {
        _push(`<button class="w-10 h-10 flex items-center justify-center text-gray-500 hover:text-black text-xl shrink-0" data-v-db0bc4b5><i class="ti ti-chevron-right" data-v-db0bc4b5></i></button>`);
      } else {
        _push(`<!---->`);
      }
      _push(` `);
      if (__props.userName) {
        _push(`<div class="items-center gap-2 hidden md:flex min-w-0" data-v-db0bc4b5><div class="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-sm text-white shrink-0" data-v-db0bc4b5>`);
        if ((_a = unref(form).defaultCard) == null ? void 0 : _a.avatar) {
          _push(`<img${ssrRenderAttr("src", unref(form).defaultCard.avatar)} alt="cover_img_card" class="w-7 h-7 rounded-full object-cover" data-v-db0bc4b5>`);
        } else {
          _push(`<i class="ti ti-user" data-v-db0bc4b5></i>`);
        }
        _push(`</div> <span class="font-semibold text-sm truncate text-gray-700" data-v-db0bc4b5>${ssrInterpolate(__props.userName)}</span></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div> `);
      if (__props.title) {
        _push(`<div class="flex items-center gap-2 flex-1 min-w-0 sm:text-start text-center" data-v-db0bc4b5><h1 class="text-lg font-bold truncate min-w-0 text-gray-700" data-v-db0bc4b5>${ssrInterpolate(__props.title)}</h1> `);
        if (__props.showAddCard) {
          _push(ssrRenderComponent(_component_NuxtLink, {
            to: "/dashboard/add-card",
            class: "w-6 h-6 rounded-full bg-gray-200 hover:bg-gray-300 text-gray-800 flex items-center justify-center text-sm shrink-0 transition-colors",
            title: "\u0633\u0627\u062E\u062A \u067E\u0631\u0648\u0641\u0627\u06CC\u0644 \u062C\u062F\u06CC\u062F"
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(`<i class="ti ti-plus" data-v-db0bc4b5${_scopeId}></i>`);
              } else {
                return [
                  createVNode("i", { class: "ti ti-plus" })
                ];
              }
            }),
            _: 1
          }, _parent));
        } else {
          _push(`<!---->`);
        }
        _push(`</div>`);
      } else {
        _push(`<!---->`);
      }
      _push(` `);
      if (__props.showSearch) {
        _push(`<div class="relative min-w-0" data-v-db0bc4b5><button class="w-10 h-10 md:hidden flex items-center justify-center text-gray-500 hover:text-blue-600 text-xl bg-white border border-gray-200 shadow-sm rounded-full transition" data-v-db0bc4b5><i class="ti ti-search" data-v-db0bc4b5></i></button> <div class="hidden md:block w-full sm:max-w-sm min-w-0" data-v-db0bc4b5><i class="ti ti-search absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-base" data-v-db0bc4b5></i> <input type="text" placeholder="\u062C\u0633\u062A\u062C\u0648\u06CC \u06A9\u0627\u0631\u062A..."${ssrRenderAttr("value", searchModel.value)} class="w-full bg-white rounded-full py-3 ltr:pl-10 ltr:pr-4 rtl:pl-4 rtl:pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-black border border-gray-200 min-w-0 text-gray-700" data-v-db0bc4b5></div></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(` <div class="flex items-center gap-2 flex-shrink-0 min-w-0" data-v-db0bc4b5>`);
      if (__props.showCardSelect) {
        ssrRenderSlot(_ctx.$slots, "card-select", {}, null, _push, _parent);
      } else {
        _push(`<!---->`);
      }
      _push(` `);
      if (__props.showStateSelect) {
        ssrRenderSlot(_ctx.$slots, "state-select", {}, null, _push, _parent);
      } else {
        _push(`<!---->`);
      }
      _push(` `);
      if (__props.showNotifications) {
        _push(ssrRenderComponent(_sfc_main$b, null, null, _parent));
      } else {
        _push(`<!---->`);
      }
      _push(` `);
      if (__props.showShare) {
        _push(`<button class="w-10 h-10 lg:w-auto px-4 flex items-center justify-center bg-black text-white rounded-full text-sm gap-2 shrink-0" data-v-db0bc4b5><i class="ti ti-share" data-v-db0bc4b5></i> <span class="hidden lg:block" data-v-db0bc4b5>\u0627\u0634\u062A\u0631\u0627\u06A9\u200C\u06AF\u0630\u0627\u0631\u06CC \u06A9\u0627\u0631\u062A</span></button>`);
      } else {
        _push(`<!---->`);
      }
      _push(` `);
      if (__props.showMore) {
        _push(ssrRenderComponent(ActionMenu, {
          onAction: emitAction,
          onDownloadQr: handleDownloadQR,
          onEditMobile: ($event) => showEditModal.value = true
        }, null, _parent));
      } else {
        _push(`<!---->`);
      }
      _push(`</div></div></header> `);
      if (mobileSearchOpen.value) {
        _push(`<div class="fixed inset-x-0 top-0 z-50 bg-white shadow-lg flex flex-col items-center" style="${ssrRenderStyle({ "height": "96px" })}" data-v-db0bc4b5><div class="flex items-center w-full max-w-md mx-auto px-4 h-full" data-v-db0bc4b5><button class="w-10 h-10 flex items-center justify-center text-gray-500 mr-2" data-v-db0bc4b5><i class="ti ti-x" data-v-db0bc4b5></i></button> <input type="text" placeholder="\u062C\u0633\u062A\u062C\u0648\u06CC \u06A9\u0627\u0631\u062A..."${ssrRenderAttr("value", searchModel.value)} class="flex-1 bg-gray-100 rounded-full py-3 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" autofocus data-v-db0bc4b5></div></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(` `);
      _push(ssrRenderComponent(EditPhoneModal, {
        visible: showEditModal.value,
        modelValue: userPhone.value,
        onUpdate: handlePhoneUpdate,
        onClose: ($event) => showEditModal.value = false
      }, null, _parent));
      _push(`<!--]-->`);
    };
  }
};
const _sfc_setup$a = _sfc_main$a.setup;
_sfc_main$a.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/UserDashboard/main/header/index.vue");
  return _sfc_setup$a ? _sfc_setup$a(props, ctx) : void 0;
};
const Topbar = /* @__PURE__ */ _export_sfc(_sfc_main$a, [["__scopeId", "data-v-db0bc4b5"]]);
const _sfc_main$9 = {
  __name: "MobileHeader",
  __ssrInlineRender: true,
  setup(__props) {
    const route = useRoute();
    useRouter();
    const userStore = useUserStore();
    const formStore = useFormStore();
    const showProfileSelector = ref(false);
    const showSupportSheet = ref(false);
    const pageTitles = {
      "/profile": "\u067E\u0631\u0648\u0641\u0627\u06CC\u0644",
      "/settings": "\u062A\u0646\u0638\u06CC\u0645\u0627\u062A",
      "/settings/account-status": "\u0648\u0636\u0639\u06CC\u062A \u062D\u0633\u0627\u0628",
      "/dashboard/transactions": "\u062A\u0631\u0627\u06A9\u0646\u0634\u200C\u0647\u0627",
      "/dashboard/support": "\u067E\u0634\u062A\u06CC\u0628\u0627\u0646\u06CC",
      "/dashboard/activate": "\u0641\u0639\u0627\u0644\u200C\u0633\u0627\u0632\u06CC \u062F\u0633\u062A\u06AF\u0627\u0647",
      "/dashboard/checkout": "\u062E\u0631\u06CC\u062F \u0627\u0634\u062A\u0631\u0627\u06A9",
      "/dashboard/notifications": "\u0627\u0639\u0644\u0627\u0646\u200C\u0647\u0627",
      "/dashboard/inbox": "\u0635\u0646\u062F\u0648\u0642 \u0648\u0631\u0648\u062F\u06CC"
    };
    const showBackButton = computed(() => {
      const path = route.path;
      return path !== "/dashboard" && path !== "/dashboard/dashboard";
    });
    computed(() => {
      const path = route.path;
      return path === "/dashboard" || path === "/dashboard/dashboard" || path === "/";
    });
    const pageTitle = computed(() => {
      return pageTitles[route.path] || "";
    });
    computed(() => {
      return false;
    });
    const userName = computed(() => {
      var _a;
      return ((_a = userStore.user) == null ? void 0 : _a.name) || "\u06A9\u0627\u0631\u0628\u0631";
    });
    const userUserName = computed(() => {
      var _a, _b;
      return ((_a = userStore.user) == null ? void 0 : _a.userName) || ((_b = userStore.user) == null ? void 0 : _b.username) || "";
    });
    const isPro = computed(() => {
      var _a;
      return ((_a = userStore.user) == null ? void 0 : _a.isPro) || false;
    });
    computed(() => formStore.inboxBadge || 0);
    ref(true);
    const activeCard = computed(() => {
      var _a;
      return formStore.defaultCard || ((_a = formStore.cards) == null ? void 0 : _a[0]) || null;
    });
    const availableProfiles = computed(() => {
      const cards = formStore.cards || [];
      if (!isPro.value) return cards.slice(0, 1);
      return cards.filter((card) => card.isActive !== false);
    });
    const selectProfile = (profile) => {
      formStore.setDefaultCard(profile.id);
      showProfileSelector.value = false;
    };
    const addNewProfile = () => {
      showProfileSelector.value = false;
      if (!isPro.value && availableProfiles.value.length >= 1) {
        navigateTo("/dashboard/checkout");
        return;
      }
      if (isPro.value && availableProfiles.value.length >= 5) {
        return;
      }
      navigateTo("/dashboard/add-card");
    };
    const handlePremiumClick = () => {
      showProfileSelector.value = false;
      navigateTo("/dashboard/checkout");
    };
    const handleOnlineSupport = () => {
      showSupportSheet.value = false;
      navigateTo("/dashboard/support/online");
    };
    const handleFAQ = () => {
      showSupportSheet.value = false;
      navigateTo("/dashboard/support/faq");
    };
    const handleTicket = () => {
      showSupportSheet.value = false;
      navigateTo("/dashboard/support/ticket");
    };
    return (_ctx, _push, _parent, _attrs) => {
      const _component_ClientOnly = __nuxt_component_0$3;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "fixed top-0 left-0 right-0 w-full z-50 bg-background backdrop-blur-lg border-b border-border" }, _attrs))}><div class="flex items-center justify-between px-4 py-3">`);
      if (showBackButton.value) {
        _push(`<div class="flex items-center gap-3"><button class="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-foreground hover:bg-primary/10 hover:text-primary transition-all duration-200"><i class="ti ti-arrow-right text-xl"></i></button> `);
        if (pageTitle.value) {
          _push(`<h1 class="text-lg font-semibold text-foreground">${ssrInterpolate(pageTitle.value)}</h1>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div>`);
      } else {
        _push(`<!---->`);
      }
      _push(` `);
      _push(ssrRenderComponent(_component_ClientOnly, null, {}, _parent));
      _push(` `);
      _push(ssrRenderComponent(_component_ClientOnly, null, {}, _parent));
      _push(`</div> `);
      _push(ssrRenderComponent(__nuxt_component_0, {
        modelValue: showProfileSelector.value,
        "onUpdate:modelValue": ($event) => showProfileSelector.value = $event,
        closable: true,
        "close-on-backdrop": true,
        title: "\u0627\u0646\u062A\u062E\u0627\u0628 \u067E\u0631\u0648\u0641\u0627\u06CC\u0644"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="px-4 pb-6 pt-2"${_scopeId}><p class="text-sm text-primary opacity-60 text-center mb-4"${_scopeId}>\u067E\u0631\u0648\u0641\u0627\u06CC\u0644 \u0645\u0648\u0631\u062F \u0646\u0638\u0631 \u062E\u0648\u062F \u0631\u0627 \u0627\u0646\u062A\u062E\u0627\u0628 \u06A9\u0646\u06CC\u062F</p> <div class="space-y-2"${_scopeId}><!--[-->`);
            ssrRenderList(availableProfiles.value, (profile) => {
              var _a, _b;
              _push2(`<div class="${ssrRenderClass([profile.id === ((_a = activeCard.value) == null ? void 0 : _a.id) ? "bg-primary/5 border-primary" : "bg-secondary border-border hover:bg-accent-bg/30", "flex items-center gap-3 p-3 rounded-2xl border cursor-pointer transition-colors"])}"${_scopeId}><div class="relative w-11 h-11 rounded-full overflow-hidden ring-2 ring-border bg-white"${_scopeId}><img${ssrRenderAttr("src", profile.avatar || "/logo.svg")}${ssrRenderAttr("alt", profile.name)} class="w-full h-full object-cover"${_scopeId}></div> <div class="flex-1"${_scopeId}><div class="flex items-center justify-between mb-0.5"${_scopeId}><div class="flex items-center gap-1.5"${_scopeId}><h3 class="text-sm font-semibold text-primary"${_scopeId}>${ssrInterpolate(userName.value)}</h3> `);
              if (isPro.value) {
                _push2(`<i class="ti ti-rosette-discount-check-filled text-primary text-lg"${_scopeId}></i>`);
              } else {
                _push2(`<!---->`);
              }
              _push2(`</div> `);
              if (profile.id === ((_b = activeCard.value) == null ? void 0 : _b.id)) {
                _push2(`<span class="text-xs bg-secondary text-primary border border-border px-2 py-0.5 rounded-full font-medium flex items-center gap-1"${_scopeId}><i class="ti ti-check text-xs"${_scopeId}></i>
                  \u067E\u06CC\u0634\u200C\u0641\u0631\u0636
                </span>`);
              } else {
                _push2(`<!---->`);
              }
              _push2(`</div> <div class="flex flex-wrap items-center gap-1.5 text-xs text-foreground"${_scopeId}>`);
              if (userUserName.value) {
                _push2(`<span class="font-medium"${_scopeId}>
                  @${ssrInterpolate(userUserName.value)}</span>`);
              } else {
                _push2(`<!---->`);
              }
              _push2(`</div></div></div>`);
            });
            _push2(`<!--]--></div> <div class="mt-3 pt-3"${_scopeId}><div class="w-full flex items-center justify-between gap-2 p-3 rounded-2xl bg-secondary border-2 border-dashed border-border hover:bg-accent-bg/30 transition-colors"${_scopeId}><div class="flex items-center gap-2 flex-1 cursor-pointer"${_scopeId}><div class="w-11 h-11 rounded-full bg-accent-bg ring-2 ring-border flex items-center justify-center"${_scopeId}><i class="ti ti-plus text-primary text-sm"${_scopeId}></i></div> <span class="text-sm font-medium text-primary"${_scopeId}>
                \u0627\u06CC\u062C\u0627\u062F \u067E\u0631\u0648\u0641\u0627\u06CC\u0644 \u062C\u062F\u06CC\u062F
              </span></div> `);
            if (!isPro.value) {
              _push2(`<div class="bg-black dark:bg-white text-white dark:text-black px-3 py-1 rounded-full text-xs font-semibold cursor-pointer hover:opacity-90 transition-opacity"${_scopeId}>
              \u062E\u0631\u06CC\u062F \u0627\u0634\u062A\u0631\u0627\u06A9
            </div>`);
            } else {
              _push2(`<div class="bg-black dark:bg-white text-white dark:text-black px-3 py-1 rounded-full text-xs font-semibold"${_scopeId}>
              \u06A9\u0627\u0631\u0628\u0631 \u0648\u06CC\u0698\u0647
            </div>`);
            }
            _push2(`</div></div></div>`);
          } else {
            return [
              createVNode("div", { class: "px-4 pb-6 pt-2" }, [
                createVNode("p", { class: "text-sm text-primary opacity-60 text-center mb-4" }, "\u067E\u0631\u0648\u0641\u0627\u06CC\u0644 \u0645\u0648\u0631\u062F \u0646\u0638\u0631 \u062E\u0648\u062F \u0631\u0627 \u0627\u0646\u062A\u062E\u0627\u0628 \u06A9\u0646\u06CC\u062F"),
                createTextVNode(),
                createVNode("div", { class: "space-y-2" }, [
                  (openBlock(true), createBlock(Fragment, null, renderList(availableProfiles.value, (profile) => {
                    var _a, _b;
                    return openBlock(), createBlock("div", {
                      key: profile.id,
                      onClick: ($event) => selectProfile(profile),
                      class: ["flex items-center gap-3 p-3 rounded-2xl border cursor-pointer transition-colors", profile.id === ((_a = activeCard.value) == null ? void 0 : _a.id) ? "bg-primary/5 border-primary" : "bg-secondary border-border hover:bg-accent-bg/30"]
                    }, [
                      createVNode("div", { class: "relative w-11 h-11 rounded-full overflow-hidden ring-2 ring-border bg-white" }, [
                        createVNode("img", {
                          src: profile.avatar || "/logo.svg",
                          alt: profile.name,
                          class: "w-full h-full object-cover"
                        }, null, 8, ["src", "alt"])
                      ]),
                      createTextVNode(),
                      createVNode("div", { class: "flex-1" }, [
                        createVNode("div", { class: "flex items-center justify-between mb-0.5" }, [
                          createVNode("div", { class: "flex items-center gap-1.5" }, [
                            createVNode("h3", { class: "text-sm font-semibold text-primary" }, toDisplayString(userName.value), 1),
                            createTextVNode(),
                            isPro.value ? (openBlock(), createBlock("i", {
                              key: 0,
                              class: "ti ti-rosette-discount-check-filled text-primary text-lg"
                            })) : createCommentVNode("", true)
                          ]),
                          createTextVNode(),
                          profile.id === ((_b = activeCard.value) == null ? void 0 : _b.id) ? (openBlock(), createBlock("span", {
                            key: 0,
                            class: "text-xs bg-secondary text-primary border border-border px-2 py-0.5 rounded-full font-medium flex items-center gap-1"
                          }, [
                            createVNode("i", { class: "ti ti-check text-xs" }),
                            createTextVNode("\r\n                  \u067E\u06CC\u0634\u200C\u0641\u0631\u0636\r\n                ")
                          ])) : createCommentVNode("", true)
                        ]),
                        createTextVNode(),
                        createVNode("div", { class: "flex flex-wrap items-center gap-1.5 text-xs text-foreground" }, [
                          userUserName.value ? (openBlock(), createBlock("span", {
                            key: 0,
                            class: "font-medium"
                          }, "\r\n                  @" + toDisplayString(userUserName.value), 1)) : createCommentVNode("", true)
                        ])
                      ])
                    ], 10, ["onClick"]);
                  }), 128))
                ]),
                createTextVNode(),
                createVNode("div", { class: "mt-3 pt-3" }, [
                  createVNode("div", { class: "w-full flex items-center justify-between gap-2 p-3 rounded-2xl bg-secondary border-2 border-dashed border-border hover:bg-accent-bg/30 transition-colors" }, [
                    createVNode("div", {
                      onClick: addNewProfile,
                      class: "flex items-center gap-2 flex-1 cursor-pointer"
                    }, [
                      createVNode("div", { class: "w-11 h-11 rounded-full bg-accent-bg ring-2 ring-border flex items-center justify-center" }, [
                        createVNode("i", { class: "ti ti-plus text-primary text-sm" })
                      ]),
                      createTextVNode(),
                      createVNode("span", { class: "text-sm font-medium text-primary" }, "\r\n                \u0627\u06CC\u062C\u0627\u062F \u067E\u0631\u0648\u0641\u0627\u06CC\u0644 \u062C\u062F\u06CC\u062F\r\n              ")
                    ]),
                    createTextVNode(),
                    !isPro.value ? (openBlock(), createBlock("div", {
                      key: 0,
                      onClick: handlePremiumClick,
                      class: "bg-black dark:bg-white text-white dark:text-black px-3 py-1 rounded-full text-xs font-semibold cursor-pointer hover:opacity-90 transition-opacity"
                    }, "\r\n              \u062E\u0631\u06CC\u062F \u0627\u0634\u062A\u0631\u0627\u06A9\r\n            ")) : (openBlock(), createBlock("div", {
                      key: 1,
                      class: "bg-black dark:bg-white text-white dark:text-black px-3 py-1 rounded-full text-xs font-semibold"
                    }, "\r\n              \u06A9\u0627\u0631\u0628\u0631 \u0648\u06CC\u0698\u0647\r\n            "))
                  ])
                ])
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(` `);
      _push(ssrRenderComponent(__nuxt_component_0, {
        modelValue: showSupportSheet.value,
        "onUpdate:modelValue": ($event) => showSupportSheet.value = $event,
        closable: true,
        "close-on-backdrop": true,
        title: "\u067E\u0634\u062A\u06CC\u0628\u0627\u0646\u06CC"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="px-4 pb-6 pt-2"${_scopeId}><div class="space-y-3"${_scopeId}><button class="w-full flex items-center gap-4 p-4 rounded-2xl border border-border bg-card hover:bg-accent transition-colors group"${_scopeId}><div class="w-12 h-12 rounded-xl bg-green-500/10 flex items-center justify-center flex-shrink-0 group-hover:bg-green-500/20 transition-colors"${_scopeId}><i class="ti ti-message-circle text-green-500 text-2xl"${_scopeId}></i></div> <div class="flex-1 text-right"${_scopeId}><h3 class="text-sm font-semibold text-foreground mb-0.5"${_scopeId}>\u067E\u0634\u062A\u06CC\u0628\u0627\u0646\u06CC \u0622\u0646\u0644\u0627\u06CC\u0646</h3> <p class="text-xs text-muted-foreground"${_scopeId}>\u06AF\u0641\u062A\u06AF\u0648 \u0628\u0627 \u062A\u06CC\u0645 \u067E\u0634\u062A\u06CC\u0628\u0627\u0646\u06CC</p></div> <i class="ti ti-chevron-left text-muted-foreground"${_scopeId}></i></button> <button class="w-full flex items-center gap-4 p-4 rounded-2xl border border-border bg-card hover:bg-accent transition-colors group"${_scopeId}><div class="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center flex-shrink-0 group-hover:bg-blue-500/20 transition-colors"${_scopeId}><i class="ti ti-help text-blue-500 text-2xl"${_scopeId}></i></div> <div class="flex-1 text-right"${_scopeId}><h3 class="text-sm font-semibold text-foreground mb-0.5"${_scopeId}>\u0633\u0648\u0627\u0644\u0627\u062A \u0645\u062A\u062F\u0627\u0648\u0644</h3> <p class="text-xs text-muted-foreground"${_scopeId}>\u067E\u0627\u0633\u062E \u0633\u0648\u0627\u0644\u0627\u062A \u067E\u0631\u062A\u06A9\u0631\u0627\u0631</p></div> <i class="ti ti-chevron-left text-muted-foreground"${_scopeId}></i></button> <button class="w-full flex items-center gap-4 p-4 rounded-2xl border border-border bg-card hover:bg-accent transition-colors group"${_scopeId}><div class="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center flex-shrink-0 group-hover:bg-purple-500/20 transition-colors"${_scopeId}><i class="ti ti-phone text-purple-500 text-2xl"${_scopeId}></i></div> <div class="flex-1 text-right"${_scopeId}><h3 class="text-sm font-semibold text-foreground mb-0.5"${_scopeId}>\u062A\u0645\u0627\u0633 \u062A\u0644\u0641\u0646\u06CC</h3> <p class="text-xs text-muted-foreground"${_scopeId}>\u062A\u0645\u0627\u0633 \u0628\u0627 \u067E\u0634\u062A\u06CC\u0628\u0627\u0646\u06CC</p></div> <i class="ti ti-chevron-left text-muted-foreground"${_scopeId}></i></button></div> <div class="mt-6 p-4 rounded-2xl bg-muted/50 border border-border"${_scopeId}><p class="text-xs text-muted-foreground text-center mb-2"${_scopeId}><i class="ti ti-clock text-sm ml-1"${_scopeId}></i>
            \u067E\u0627\u0633\u062E\u06AF\u0648\u06CC\u06CC: \u0634\u0646\u0628\u0647 \u062A\u0627 \u0686\u0647\u0627\u0631\u0634\u0646\u0628\u0647\u060C \u06F9 \u0635\u0628\u062D \u062A\u0627 \u06F6 \u0639\u0635\u0631
          </p> <p class="text-xs text-muted-foreground text-center"${_scopeId}><i class="ti ti-mail text-sm ml-1"${_scopeId}></i>
            support@linku.im
          </p></div></div>`);
          } else {
            return [
              createVNode("div", { class: "px-4 pb-6 pt-2" }, [
                createVNode("div", { class: "space-y-3" }, [
                  createVNode("button", {
                    onClick: handleOnlineSupport,
                    class: "w-full flex items-center gap-4 p-4 rounded-2xl border border-border bg-card hover:bg-accent transition-colors group"
                  }, [
                    createVNode("div", { class: "w-12 h-12 rounded-xl bg-green-500/10 flex items-center justify-center flex-shrink-0 group-hover:bg-green-500/20 transition-colors" }, [
                      createVNode("i", { class: "ti ti-message-circle text-green-500 text-2xl" })
                    ]),
                    createTextVNode(),
                    createVNode("div", { class: "flex-1 text-right" }, [
                      createVNode("h3", { class: "text-sm font-semibold text-foreground mb-0.5" }, "\u067E\u0634\u062A\u06CC\u0628\u0627\u0646\u06CC \u0622\u0646\u0644\u0627\u06CC\u0646"),
                      createTextVNode(),
                      createVNode("p", { class: "text-xs text-muted-foreground" }, "\u06AF\u0641\u062A\u06AF\u0648 \u0628\u0627 \u062A\u06CC\u0645 \u067E\u0634\u062A\u06CC\u0628\u0627\u0646\u06CC")
                    ]),
                    createTextVNode(),
                    createVNode("i", { class: "ti ti-chevron-left text-muted-foreground" })
                  ]),
                  createTextVNode(),
                  createVNode("button", {
                    onClick: handleFAQ,
                    class: "w-full flex items-center gap-4 p-4 rounded-2xl border border-border bg-card hover:bg-accent transition-colors group"
                  }, [
                    createVNode("div", { class: "w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center flex-shrink-0 group-hover:bg-blue-500/20 transition-colors" }, [
                      createVNode("i", { class: "ti ti-help text-blue-500 text-2xl" })
                    ]),
                    createTextVNode(),
                    createVNode("div", { class: "flex-1 text-right" }, [
                      createVNode("h3", { class: "text-sm font-semibold text-foreground mb-0.5" }, "\u0633\u0648\u0627\u0644\u0627\u062A \u0645\u062A\u062F\u0627\u0648\u0644"),
                      createTextVNode(),
                      createVNode("p", { class: "text-xs text-muted-foreground" }, "\u067E\u0627\u0633\u062E \u0633\u0648\u0627\u0644\u0627\u062A \u067E\u0631\u062A\u06A9\u0631\u0627\u0631")
                    ]),
                    createTextVNode(),
                    createVNode("i", { class: "ti ti-chevron-left text-muted-foreground" })
                  ]),
                  createTextVNode(),
                  createVNode("button", {
                    onClick: handleTicket,
                    class: "w-full flex items-center gap-4 p-4 rounded-2xl border border-border bg-card hover:bg-accent transition-colors group"
                  }, [
                    createVNode("div", { class: "w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center flex-shrink-0 group-hover:bg-purple-500/20 transition-colors" }, [
                      createVNode("i", { class: "ti ti-phone text-purple-500 text-2xl" })
                    ]),
                    createTextVNode(),
                    createVNode("div", { class: "flex-1 text-right" }, [
                      createVNode("h3", { class: "text-sm font-semibold text-foreground mb-0.5" }, "\u062A\u0645\u0627\u0633 \u062A\u0644\u0641\u0646\u06CC"),
                      createTextVNode(),
                      createVNode("p", { class: "text-xs text-muted-foreground" }, "\u062A\u0645\u0627\u0633 \u0628\u0627 \u067E\u0634\u062A\u06CC\u0628\u0627\u0646\u06CC")
                    ]),
                    createTextVNode(),
                    createVNode("i", { class: "ti ti-chevron-left text-muted-foreground" })
                  ])
                ]),
                createTextVNode(),
                createVNode("div", { class: "mt-6 p-4 rounded-2xl bg-muted/50 border border-border" }, [
                  createVNode("p", { class: "text-xs text-muted-foreground text-center mb-2" }, [
                    createVNode("i", { class: "ti ti-clock text-sm ml-1" }),
                    createTextVNode("\r\n            \u067E\u0627\u0633\u062E\u06AF\u0648\u06CC\u06CC: \u0634\u0646\u0628\u0647 \u062A\u0627 \u0686\u0647\u0627\u0631\u0634\u0646\u0628\u0647\u060C \u06F9 \u0635\u0628\u062D \u062A\u0627 \u06F6 \u0639\u0635\u0631\r\n          ")
                  ]),
                  createTextVNode(),
                  createVNode("p", { class: "text-xs text-muted-foreground text-center" }, [
                    createVNode("i", { class: "ti ti-mail text-sm ml-1" }),
                    createTextVNode("\r\n            support@linku.im\r\n          ")
                  ])
                ])
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div>`);
    };
  }
};
const _sfc_setup$9 = _sfc_main$9.setup;
_sfc_main$9.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/UserDashboard/main/MobileHeader.vue");
  return _sfc_setup$9 ? _sfc_setup$9(props, ctx) : void 0;
};
const _sfc_main$8 = /* @__PURE__ */ defineComponent({
  __name: "BottomNavigation",
  __ssrInlineRender: true,
  emits: ["open-share"],
  setup(__props, { emit: __emit }) {
    const router = useRouter();
    const route = useRoute();
    const formStore = useFormStore();
    const userStore = useUserStore();
    const isBottomSheetOpen = ref(false);
    const qrCanvas = shallowRef(null);
    const showToast = ref(false);
    const toastMessage = ref("\u0644\u06CC\u0646\u06A9 \u06A9\u067E\u06CC \u0634\u062F!");
    const toastType = ref("success");
    const showProfileSelector = ref(false);
    const selectedSharingProfile = ref(null);
    const showToastMessage = (message, type = "success") => {
      toastMessage.value = message;
      toastType.value = type;
      showToast.value = true;
    };
    const defaultCard = computed(() => {
      return formStore.defaultCard || (formStore.cards || []).filter((card) => card.isActive !== false)[0] || null;
    });
    const userAvatar = computed(() => {
      var _a, _b;
      const cardAvatar = (_a = defaultCard.value) == null ? void 0 : _a.avatar;
      if (cardAvatar && typeof cardAvatar === "string" && cardAvatar.trim().length > 0) {
        return cardAvatar;
      }
      const profileImage = formStore.safeProfileImage;
      if (profileImage && typeof profileImage === "string" && profileImage.trim().length > 0) {
        return profileImage;
      }
      const userAvatarFromStore = (_b = userStore.user) == null ? void 0 : _b.avatar;
      if (userAvatarFromStore && typeof userAvatarFromStore === "string" && userAvatarFromStore.trim().length > 0) {
        return userAvatarFromStore;
      }
      return "/logo.svg";
    });
    const userName = computed(() => {
      var _a;
      return ((_a = userStore.user) == null ? void 0 : _a.name) || "\u06A9\u0627\u0631\u0628\u0631";
    });
    const userUserName = computed(() => {
      var _a, _b;
      return ((_a = userStore.user) == null ? void 0 : _a.userName) || ((_b = userStore.user) == null ? void 0 : _b.username) || "";
    });
    const availableProfiles = computed(() => {
      const cards = formStore.cards || [];
      return cards.filter((card) => card.isActive !== false);
    });
    watch(() => defaultCard.value, (newCard) => {
      if (newCard && !selectedSharingProfile.value) {
        selectedSharingProfile.value = newCard;
      }
    }, { immediate: true });
    const profileLink = computed(() => {
      return "https://linku.im";
    });
    const isPro = computed(() => {
      var _a;
      return ((_a = userStore.user) == null ? void 0 : _a.isPro) || false;
    });
    const navItems = computed(() => [
      {
        id: "profile",
        icon: "ti ti-user",
        label: "\u067E\u0631\u0648\u0641\u0627\u06CC\u0644",
        path: "/profile",
        isActive: route.path.includes("/profile")
      },
      {
        id: "analytics",
        icon: "ti ti-chart-line",
        label: "\u062A\u062D\u0644\u06CC\u0644\u200C\u0647\u0627",
        path: "/dashboard/insights",
        isActive: route.path.includes("/dashboard/insights")
      },
      {
        id: "share",
        icon: "ti ti-brand-telegram",
        label: "",
        action: "share",
        isCenter: true
      },
      {
        id: "search",
        icon: "ti ti-search",
        label: "\u062C\u0633\u062A\u062C\u0648",
        path: "/dashboard/search",
        action: "search"
      },
      {
        id: "dashboard",
        avatarUrl: userAvatar.value,
        label: "\u062F\u0627\u0634\u0628\u0648\u0631\u062F",
        path: "/dashboard",
        isActive: route.path === "/dashboard" || route.path.startsWith("/dashboard") && !route.path.includes("/insights")
      }
    ]);
    const drawQR = async () => {
      var _a, _b, _c, _d;
      if (!qrCanvas.value) return;
      try {
        const QRCode2 = (await import('qrcode')).default;
        const qrColor = ((_a = defaultCard.value) == null ? void 0 : _a.qrColor) || "#000000";
        const qrBgColor = ((_b = defaultCard.value) == null ? void 0 : _b.qrBgColor) || "#ffffff";
        await QRCode2.toCanvas(qrCanvas.value, profileLink.value, {
          width: 200,
          margin: 1,
          color: {
            dark: qrColor,
            light: qrBgColor
          },
          errorCorrectionLevel: "H"
        });
        const ctx = qrCanvas.value.getContext("2d");
        if (!ctx) return;
        const logoSrc = ((_c = selectedSharingProfile.value) == null ? void 0 : _c.avatar) || ((_d = selectedSharingProfile.value) == null ? void 0 : _d.logo) || userAvatar.value;
        const logo = new Image();
        logo.crossOrigin = "anonymous";
        logo.onload = () => {
          var _a2;
          const logoSize = 50;
          const centerX = 100;
          const centerY = 100;
          ctx.fillStyle = "#ffffff";
          ctx.beginPath();
          ctx.arc(centerX, centerY, logoSize / 2 + 4, 0, 2 * Math.PI);
          ctx.fill();
          ctx.save();
          ctx.beginPath();
          ctx.arc(centerX, centerY, logoSize / 2, 0, 2 * Math.PI);
          ctx.clip();
          ctx.drawImage(logo, centerX - logoSize / 2, centerY - logoSize / 2, logoSize, logoSize);
          ctx.restore();
          if (isPro.value && ((_a2 = selectedSharingProfile.value) == null ? void 0 : _a2.avatar)) {
            ctx.strokeStyle = "#ffd700";
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.arc(centerX, centerY, logoSize / 2, 0, 2 * Math.PI);
            ctx.stroke();
          }
        };
        logo.onerror = () => {
        };
        logo.src = logoSrc;
      } catch (error) {
      }
    };
    const copyLink = async () => {
      try {
        await (void 0).clipboard.writeText(profileLink.value);
        showToastMessage("\u0644\u06CC\u0646\u06A9 \u06A9\u067E\u06CC \u0634\u062F!", "success");
      } catch (error) {
      }
    };
    const downloadQR = async () => {
      var _a, _b, _c, _d, _e;
      try {
        const QRCode2 = (await import('qrcode')).default;
        const highResCanvas = (void 0).createElement("canvas");
        highResCanvas.width = 1e3;
        highResCanvas.height = 1e3;
        const qrColor = ((_a = defaultCard.value) == null ? void 0 : _a.qrColor) || "#000000";
        const qrBgColor = ((_b = defaultCard.value) == null ? void 0 : _b.qrBgColor) || "#ffffff";
        await QRCode2.toCanvas(highResCanvas, profileLink.value, {
          width: 1e3,
          margin: 2,
          color: {
            dark: qrColor,
            light: qrBgColor
          },
          errorCorrectionLevel: "H"
        });
        const ctx = highResCanvas.getContext("2d");
        if (ctx) {
          const logoSrc = ((_c = selectedSharingProfile.value) == null ? void 0 : _c.avatar) || ((_d = selectedSharingProfile.value) == null ? void 0 : _d.logo) || userAvatar.value;
          if (logoSrc && logoSrc !== "/logo.svg") {
            const logo = new Image();
            logo.crossOrigin = "anonymous";
            await new Promise((resolve) => {
              logo.onload = () => {
                var _a2;
                const logoSize = 250;
                const centerX = 500;
                const centerY = 500;
                ctx.fillStyle = "#ffffff";
                ctx.beginPath();
                ctx.arc(centerX, centerY, logoSize / 2 + 20, 0, 2 * Math.PI);
                ctx.fill();
                ctx.save();
                ctx.beginPath();
                ctx.arc(centerX, centerY, logoSize / 2, 0, 2 * Math.PI);
                ctx.clip();
                ctx.drawImage(logo, centerX - logoSize / 2, centerY - logoSize / 2, logoSize, logoSize);
                ctx.restore();
                if (isPro.value && ((_a2 = selectedSharingProfile.value) == null ? void 0 : _a2.avatar)) {
                  ctx.strokeStyle = "#ffd700";
                  ctx.lineWidth = 8;
                  ctx.beginPath();
                  ctx.arc(centerX, centerY, logoSize / 2 + 4, 0, 2 * Math.PI);
                  ctx.stroke();
                }
                resolve();
              };
              logo.onerror = () => resolve();
              logo.src = logoSrc;
            });
          }
        }
        const link = (void 0).createElement("a");
        link.href = highResCanvas.toDataURL("image/png", 1);
        link.download = `qr-${((_e = selectedSharingProfile.value) == null ? void 0 : _e.slug) || "profile"}-1000x1000.png`;
        link.click();
        showToastMessage("\u06A9\u06CC\u0648\u0622\u0631 \u06A9\u062F \u0628\u0627 \u06A9\u06CC\u0641\u06CC\u062A \u0628\u0627\u0644\u0627 \u0630\u062E\u06CC\u0631\u0647 \u0634\u062F!", "success");
      } catch (error) {
        console.error("Error downloading QR:", error);
        showToastMessage("\u062E\u0637\u0627 \u062F\u0631 \u0630\u062E\u06CC\u0631\u0647 \u06A9\u06CC\u0648\u0622\u0631 \u06A9\u062F", "error");
      }
    };
    const shareProfile = async () => {
      var _a;
      if ((void 0).share) {
        try {
          await (void 0).share({
            title: `\u067E\u0631\u0648\u0641\u0627\u06CC\u0644 ${((_a = selectedSharingProfile.value) == null ? void 0 : _a.name) || "\u0645\u0646"}`,
            text: "\u067E\u0631\u0648\u0641\u0627\u06CC\u0644 \u0645\u0646 \u0631\u0627 \u062F\u0631 \u0644\u06CC\u0646\u06A9\u0648 \u0628\u0628\u06CC\u0646\u06CC\u062F!",
            url: profileLink.value
          });
        } catch (error) {
          if ((error == null ? void 0 : error.name) !== "AbortError") {
            copyLink();
          }
        }
      } else {
        copyLink();
      }
    };
    const customizeLink = () => {
      router.push("/profile/customize-link");
      isBottomSheetOpen.value = false;
    };
    const customizeQR = () => {
      router.push("/QR");
      isBottomSheetOpen.value = false;
    };
    const shareViaSMS = () => {
      const text = `\u067E\u0631\u0648\u0641\u0627\u06CC\u0644 \u0645\u0646 \u0631\u0627 \u0628\u0628\u06CC\u0646\u06CC\u062F: ${profileLink.value}`;
      const isIOS = /iPad|iPhone|iPod/.test((void 0).userAgent);
      (void 0).location.href = isIOS ? `sms:&body=${encodeURIComponent(text)}` : `sms:?body=${encodeURIComponent(text)}`;
    };
    const shareViaEmail = () => {
      var _a;
      const subject = `\u067E\u0631\u0648\u0641\u0627\u06CC\u0644 ${((_a = selectedSharingProfile.value) == null ? void 0 : _a.name) || "\u0645\u0646"}`;
      const body = `\u0633\u0644\u0627\u0645\u060C

\u067E\u0631\u0648\u0641\u0627\u06CC\u0644 \u0645\u0646 \u0631\u0627 \u062F\u0631 \u0644\u06CC\u0646\u06A9\u0648 \u0628\u0628\u06CC\u0646\u06CC\u062F:
${profileLink.value}`;
      (void 0).location.href = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    };
    const shareViaWhatsApp = () => {
      const text = `\u067E\u0631\u0648\u0641\u0627\u06CC\u0644 \u0645\u0646 \u0631\u0627 \u0628\u0628\u06CC\u0646\u06CC\u062F: ${profileLink.value}`;
      (void 0).open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank");
    };
    const shareViaTelegram = () => {
      const text = `\u067E\u0631\u0648\u0641\u0627\u06CC\u0644 \u0645\u0646 \u0631\u0627 \u0628\u0628\u06CC\u0646\u06CC\u062F: ${profileLink.value}`;
      (void 0).open(`https://t.me/share/url?url=${encodeURIComponent(profileLink.value)}&text=${encodeURIComponent(text)}`, "_blank");
    };
    const shareViaInstagram = async () => {
      await copyLink();
      const isIOS = /iPad|iPhone|iPod/.test((void 0).userAgent);
      const isAndroid = /Android/.test((void 0).userAgent);
      if (isIOS) {
        (void 0).location.href = "instagram://app";
      } else if (isAndroid) {
        (void 0).location.href = "intent://instagram.com/#Intent;package=com.instagram.android;scheme=https;end";
      } else {
        (void 0).open("https://www.instagram.com/", "_blank");
      }
    };
    const shareAnotherWay = () => {
      shareProfile();
    };
    const selectProfileForSharing = (profile) => {
      selectedSharingProfile.value = profile;
      showProfileSelector.value = false;
      nextTick(() => drawQR());
    };
    const addNewProfile = () => {
      showProfileSelector.value = false;
      if (!isPro.value) {
        router.push("/dashboard/checkout");
        return;
      }
      if (availableProfiles.value.length >= 5) {
        showToastMessage("\u062D\u062F\u0627\u06A9\u062B\u0631 5 \u067E\u0631\u0648\u0641\u0627\u06CC\u0644 \u0645\u062C\u0627\u0632 \u0627\u0633\u062A", "warning");
        return;
      }
      router.push("/dashboard/add-card");
    };
    const handlePremiumClick = () => {
      router.push("/dashboard/checkout");
    };
    watch(isBottomSheetOpen, (newValue) => {
      if (newValue) {
        nextTick(() => drawQR());
      }
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(_attrs)} data-v-d2cd92b8>`);
      if (!isBottomSheetOpen.value) {
        _push(`<div class="fixed bottom-0 left-0 right-0 bg-card border-t border-border z-40" data-v-d2cd92b8><div class="flex items-center justify-around h-20 px-6 relative" data-v-d2cd92b8><!--[-->`);
        ssrRenderList(navItems.value, (item) => {
          _push(`<!--[-->`);
          if (item.isCenter) {
            _push(`<button class="w-16 h-16 bg-primary rounded-3xl flex items-center justify-center shadow-xl -mt-10 transition-all duration-200 hover:scale-105 hover:shadow-2xl" data-v-d2cd92b8><i class="${ssrRenderClass([item.icon, "text-primary-foreground font-bold text-4xl"])}" data-v-d2cd92b8></i></button>`);
          } else if (item.avatarUrl) {
            _push(`<a${ssrRenderAttr("href", item.path)} class="flex flex-col items-center justify-center p-3 transition-all duration-200 min-w-12" data-v-d2cd92b8><div class="${ssrRenderClass([
              "w-7 h-7 rounded-full overflow-hidden transition-all duration-200 border-2",
              item.isActive ? "border-primary scale-110 ring-2 ring-primary/20" : "border-muted-foreground/30 hover:border-primary/50"
            ])}" data-v-d2cd92b8><img${ssrRenderAttr("src", item.avatarUrl)}${ssrRenderAttr("alt", item.label)} class="w-full h-full object-cover" data-v-d2cd92b8></div></a>`);
          } else {
            _push(`<div class="${ssrRenderClass([
              "flex flex-col items-center justify-center p-3 transition-all duration-200 min-w-12 relative cursor-pointer",
              item.isActive ? "text-primary" : "text-muted-foreground hover:text-foreground"
            ])}" data-v-d2cd92b8><i class="${ssrRenderClass([item.icon, "text-2xl"])}" data-v-d2cd92b8></i></div>`);
          }
          _push(`<!--]-->`);
        });
        _push(`<!--]--></div></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(` `);
      _push(ssrRenderComponent(__nuxt_component_0, {
        modelValue: isBottomSheetOpen.value,
        "onUpdate:modelValue": ($event) => isBottomSheetOpen.value = $event,
        size: "full",
        closable: false,
        "close-on-backdrop": true
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          var _a, _b;
          if (_push2) {
            _push2(`<div class="sticky top-0 w-full z-10 bg-background lg:bg-card border-b border-border flex-shrink-0 lg:rounded-t-2xl" data-v-d2cd92b8${_scopeId}><div class="flex items-center justify-between px-6 py-4 lg:py-3" data-v-d2cd92b8${_scopeId}><h3 class="text-lg font-semibold text-foreground" data-v-d2cd92b8${_scopeId}>\u0627\u0634\u062A\u0631\u0627\u06A9\u200C\u06AF\u0630\u0627\u0631\u06CC</h3> <button class="w-8 h-8 rounded-full bg-muted hover:bg-muted/80 flex items-center justify-center transition-colors" data-v-d2cd92b8${_scopeId}><i class="ti ti-x text-foreground text-base" data-v-d2cd92b8${_scopeId}></i></button></div></div> <div class="flex-1 overflow-y-auto lg:overflow-hidden" data-v-d2cd92b8${_scopeId}><div class="flex flex-col lg:flex-row lg:h-full" data-v-d2cd92b8${_scopeId}><div class="lg:w-1/2 lg:border-l lg:border-border p-6 lg:flex lg:flex-col lg:justify-center lg:items-center bg-muted/30" data-v-d2cd92b8${_scopeId}><div class="flex justify-center mb-6" data-v-d2cd92b8${_scopeId}><button class="flex items-center gap-2 p-3 bg-background hover:bg-muted/80 rounded-full border border-border min-w-[164px] transition-colors" data-v-d2cd92b8${_scopeId}><div class="w-7 h-7 rounded-full overflow-hidden flex-shrink-0 ring-2 ring-primary/30" data-v-d2cd92b8${_scopeId}><img${ssrRenderAttr("src", ((_a = selectedSharingProfile.value) == null ? void 0 : _a.avatar) || userAvatar.value)}${ssrRenderAttr("alt", userName.value)} class="w-full h-full object-cover" data-v-d2cd92b8${_scopeId}></div> <span class="text-sm font-medium text-foreground truncate flex-1" data-v-d2cd92b8${_scopeId}>${ssrInterpolate(userName.value)}</span> <i class="ti ti-chevron-down text-muted-foreground flex-shrink-0" data-v-d2cd92b8${_scopeId}></i></button></div> <div class="flex flex-col items-center justify-center mb-6" data-v-d2cd92b8${_scopeId}><div class="p-4 rounded-2xl border-2 border-border shadow-lg bg-white" data-v-d2cd92b8${_scopeId}><canvas width="200" height="200" class="rounded-lg" data-v-d2cd92b8${_scopeId}></canvas></div></div> <div class="flex justify-center" data-v-d2cd92b8${_scopeId}><button class="flex items-center gap-3 px-10 py-3 bg-primary text-primary-foreground rounded-full font-semibold text-base hover:opacity-90 transition-opacity shadow-lg" data-v-d2cd92b8${_scopeId}><i class="ti ti-share-2 text-lg" data-v-d2cd92b8${_scopeId}></i>
                \u0627\u0634\u062A\u0631\u0627\u06A9\u200C\u06AF\u0630\u0627\u0631\u06CC
              </button></div></div> <div class="lg:w-1/2 p-6 lg:overflow-y-auto" data-v-d2cd92b8${_scopeId}><div class="lg:hidden space-y-0 bg-card rounded-2xl overflow-hidden border border-border shadow-sm" data-v-d2cd92b8${_scopeId}><button class="w-full flex items-center gap-3 p-4 hover:bg-muted/50 transition-all border-b border-border" data-v-d2cd92b8${_scopeId}><div class="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center" data-v-d2cd92b8${_scopeId}><i class="ti ti-link text-primary text-lg" data-v-d2cd92b8${_scopeId}></i></div> <span class="font-medium text-foreground text-sm" data-v-d2cd92b8${_scopeId}>\u06A9\u067E\u06CC \u0644\u06CC\u0646\u06A9</span></button> <button class="w-full flex items-center gap-3 p-4 hover:bg-muted/50 transition-all border-b border-border" data-v-d2cd92b8${_scopeId}><div class="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center" data-v-d2cd92b8${_scopeId}><i class="ti ti-edit text-primary text-lg" data-v-d2cd92b8${_scopeId}></i></div> <span class="font-medium text-foreground text-sm" data-v-d2cd92b8${_scopeId}>\u0633\u0641\u0627\u0631\u0634\u06CC\u200C\u0633\u0627\u0632\u06CC \u0644\u06CC\u0646\u06A9</span></button> <button class="w-full flex items-center gap-3 p-4 hover:bg-muted/50 transition-all border-b border-border" data-v-d2cd92b8${_scopeId}><div class="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center" data-v-d2cd92b8${_scopeId}><i class="ti ti-qrcode text-primary text-lg" data-v-d2cd92b8${_scopeId}></i></div> <span class="font-medium text-foreground text-sm" data-v-d2cd92b8${_scopeId}>\u0633\u0641\u0627\u0631\u0634\u06CC\u200C\u0633\u0627\u0632\u06CC \u06A9\u06CC\u0648\u0622\u0631 \u06A9\u062F</span></button> <button class="w-full flex items-center gap-3 p-4 hover:bg-muted/50 transition-all border-b border-border" data-v-d2cd92b8${_scopeId}><div class="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center" data-v-d2cd92b8${_scopeId}><i class="ti ti-photo text-primary text-lg" data-v-d2cd92b8${_scopeId}></i></div> <span class="font-medium text-foreground text-sm" data-v-d2cd92b8${_scopeId}>\u0630\u062E\u06CC\u0631\u0647 \u062F\u0631 \u06AF\u0627\u0644\u0631\u06CC</span></button> <button class="w-full flex items-center gap-3 p-4 hover:bg-muted/50 transition-all border-b border-border" data-v-d2cd92b8${_scopeId}><div class="w-9 h-9 rounded-xl bg-blue-500/10 flex items-center justify-center" data-v-d2cd92b8${_scopeId}><i class="ti ti-message text-blue-500 text-lg" data-v-d2cd92b8${_scopeId}></i></div> <span class="font-medium text-foreground text-sm" data-v-d2cd92b8${_scopeId}>\u0627\u0631\u0633\u0627\u0644 \u067E\u06CC\u0627\u0645\u06A9</span></button> <button class="w-full flex items-center gap-3 p-4 hover:bg-muted/50 transition-all border-b border-border" data-v-d2cd92b8${_scopeId}><div class="w-9 h-9 rounded-xl bg-red-500/10 flex items-center justify-center" data-v-d2cd92b8${_scopeId}><i class="ti ti-mail text-red-500 text-lg" data-v-d2cd92b8${_scopeId}></i></div> <span class="font-medium text-foreground text-sm" data-v-d2cd92b8${_scopeId}>\u0627\u0631\u0633\u0627\u0644 \u0627\u06CC\u0645\u06CC\u0644</span></button> <button class="w-full flex items-center gap-3 p-4 hover:bg-muted/50 transition-all border-b border-border" data-v-d2cd92b8${_scopeId}><div class="w-9 h-9 rounded-xl bg-green-500/10 flex items-center justify-center" data-v-d2cd92b8${_scopeId}><i class="ti ti-brand-whatsapp text-green-500 text-lg" data-v-d2cd92b8${_scopeId}></i></div> <span class="font-medium text-foreground text-sm" data-v-d2cd92b8${_scopeId}>\u0627\u0634\u062A\u0631\u0627\u06A9 \u062F\u0631 \u0648\u0627\u062A\u0633\u0627\u067E</span></button> <button class="w-full flex items-center gap-3 p-4 hover:bg-muted/50 transition-all border-b border-border" data-v-d2cd92b8${_scopeId}><div class="w-9 h-9 rounded-xl bg-pink-500/10 flex items-center justify-center" data-v-d2cd92b8${_scopeId}><i class="ti ti-brand-instagram text-pink-500 text-lg" data-v-d2cd92b8${_scopeId}></i></div> <span class="font-medium text-foreground text-sm" data-v-d2cd92b8${_scopeId}>\u0627\u0634\u062A\u0631\u0627\u06A9 \u062F\u0631 \u0627\u06CC\u0646\u0633\u062A\u0627\u06AF\u0631\u0627\u0645</span></button> <button class="w-full flex items-center gap-3 p-4 hover:bg-muted/50 transition-all border-b border-border" data-v-d2cd92b8${_scopeId}><div class="w-9 h-9 rounded-xl bg-blue-500/10 flex items-center justify-center" data-v-d2cd92b8${_scopeId}><i class="ti ti-brand-telegram text-blue-500 text-lg" data-v-d2cd92b8${_scopeId}></i></div> <span class="font-medium text-foreground text-sm" data-v-d2cd92b8${_scopeId}>\u0627\u0634\u062A\u0631\u0627\u06A9 \u062F\u0631 \u062A\u0644\u06AF\u0631\u0627\u0645</span></button> <button class="w-full flex items-center gap-3 p-4 hover:bg-muted/50 transition-all" data-v-d2cd92b8${_scopeId}><div class="w-9 h-9 rounded-xl bg-muted flex items-center justify-center" data-v-d2cd92b8${_scopeId}><i class="ti ti-dots text-muted-foreground text-lg" data-v-d2cd92b8${_scopeId}></i></div> <span class="font-medium text-foreground text-sm" data-v-d2cd92b8${_scopeId}>\u0631\u0648\u0634\u200C\u0647\u0627\u06CC \u062F\u06CC\u06AF\u0631</span></button></div> <div class="hidden lg:block" data-v-d2cd92b8${_scopeId}><h4 class="text-sm font-semibold text-muted-foreground mb-4" data-v-d2cd92b8${_scopeId}>\u0631\u0648\u0634\u200C\u0647\u0627\u06CC \u0627\u0634\u062A\u0631\u0627\u06A9\u200C\u06AF\u0630\u0627\u0631\u06CC</h4> <div class="grid grid-cols-4 gap-3" data-v-d2cd92b8${_scopeId}><button class="flex flex-col items-center gap-2 p-4 hover:bg-muted/50 rounded-xl transition-all border border-border bg-card" data-v-d2cd92b8${_scopeId}><div class="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center" data-v-d2cd92b8${_scopeId}><i class="ti ti-link text-primary text-xl" data-v-d2cd92b8${_scopeId}></i></div> <span class="font-medium text-foreground text-xs text-center" data-v-d2cd92b8${_scopeId}>\u06A9\u067E\u06CC \u0644\u06CC\u0646\u06A9</span></button> <button class="flex flex-col items-center gap-2 p-4 hover:bg-muted/50 rounded-xl transition-all border border-border bg-card" data-v-d2cd92b8${_scopeId}><div class="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center" data-v-d2cd92b8${_scopeId}><i class="ti ti-edit text-primary text-xl" data-v-d2cd92b8${_scopeId}></i></div> <span class="font-medium text-foreground text-xs text-center" data-v-d2cd92b8${_scopeId}>\u0633\u0641\u0627\u0631\u0634\u06CC \u0644\u06CC\u0646\u06A9</span></button> <button class="flex flex-col items-center gap-2 p-4 hover:bg-muted/50 rounded-xl transition-all border border-border bg-card" data-v-d2cd92b8${_scopeId}><div class="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center" data-v-d2cd92b8${_scopeId}><i class="ti ti-qrcode text-primary text-xl" data-v-d2cd92b8${_scopeId}></i></div> <span class="font-medium text-foreground text-xs text-center" data-v-d2cd92b8${_scopeId}>\u0633\u0641\u0627\u0631\u0634\u06CC QR</span></button> <button class="flex flex-col items-center gap-2 p-4 hover:bg-muted/50 rounded-xl transition-all border border-border bg-card" data-v-d2cd92b8${_scopeId}><div class="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center" data-v-d2cd92b8${_scopeId}><i class="ti ti-photo text-primary text-xl" data-v-d2cd92b8${_scopeId}></i></div> <span class="font-medium text-foreground text-xs text-center" data-v-d2cd92b8${_scopeId}>\u0630\u062E\u06CC\u0631\u0647 QR</span></button> <button class="flex flex-col items-center gap-2 p-4 hover:bg-muted/50 rounded-xl transition-all border border-border bg-card" data-v-d2cd92b8${_scopeId}><div class="w-11 h-11 rounded-xl bg-blue-500/10 flex items-center justify-center" data-v-d2cd92b8${_scopeId}><i class="ti ti-message text-blue-500 text-xl" data-v-d2cd92b8${_scopeId}></i></div> <span class="font-medium text-foreground text-xs text-center" data-v-d2cd92b8${_scopeId}>\u067E\u06CC\u0627\u0645\u06A9</span></button> <button class="flex flex-col items-center gap-2 p-4 hover:bg-muted/50 rounded-xl transition-all border border-border bg-card" data-v-d2cd92b8${_scopeId}><div class="w-11 h-11 rounded-xl bg-red-500/10 flex items-center justify-center" data-v-d2cd92b8${_scopeId}><i class="ti ti-mail text-red-500 text-xl" data-v-d2cd92b8${_scopeId}></i></div> <span class="font-medium text-foreground text-xs text-center" data-v-d2cd92b8${_scopeId}>\u0627\u06CC\u0645\u06CC\u0644</span></button> <button class="flex flex-col items-center gap-2 p-4 hover:bg-muted/50 rounded-xl transition-all border border-border bg-card" data-v-d2cd92b8${_scopeId}><div class="w-11 h-11 rounded-xl bg-green-500/10 flex items-center justify-center" data-v-d2cd92b8${_scopeId}><i class="ti ti-brand-whatsapp text-green-500 text-xl" data-v-d2cd92b8${_scopeId}></i></div> <span class="font-medium text-foreground text-xs text-center" data-v-d2cd92b8${_scopeId}>\u0648\u0627\u062A\u0633\u0627\u067E</span></button> <button class="flex flex-col items-center gap-2 p-4 hover:bg-muted/50 rounded-xl transition-all border border-border bg-card" data-v-d2cd92b8${_scopeId}><div class="w-11 h-11 rounded-xl bg-pink-500/10 flex items-center justify-center" data-v-d2cd92b8${_scopeId}><i class="ti ti-brand-instagram text-pink-500 text-xl" data-v-d2cd92b8${_scopeId}></i></div> <span class="font-medium text-foreground text-xs text-center" data-v-d2cd92b8${_scopeId}>\u0627\u06CC\u0646\u0633\u062A\u0627\u06AF\u0631\u0627\u0645</span></button> <button class="flex flex-col items-center gap-2 p-4 hover:bg-muted/50 rounded-xl transition-all border border-border bg-card" data-v-d2cd92b8${_scopeId}><div class="w-11 h-11 rounded-xl bg-blue-500/10 flex items-center justify-center" data-v-d2cd92b8${_scopeId}><i class="ti ti-brand-telegram text-blue-500 text-xl" data-v-d2cd92b8${_scopeId}></i></div> <span class="font-medium text-foreground text-xs text-center" data-v-d2cd92b8${_scopeId}>\u062A\u0644\u06AF\u0631\u0627\u0645</span></button> <button class="flex flex-col items-center gap-2 p-4 hover:bg-muted/50 rounded-xl transition-all border border-border bg-card" data-v-d2cd92b8${_scopeId}><div class="w-11 h-11 rounded-xl bg-muted flex items-center justify-center" data-v-d2cd92b8${_scopeId}><i class="ti ti-dots text-muted-foreground text-xl" data-v-d2cd92b8${_scopeId}></i></div> <span class="font-medium text-foreground text-xs text-center" data-v-d2cd92b8${_scopeId}>\u0628\u06CC\u0634\u062A\u0631</span></button></div></div></div></div></div>`);
          } else {
            return [
              createVNode("div", { class: "sticky top-0 w-full z-10 bg-background lg:bg-card border-b border-border flex-shrink-0 lg:rounded-t-2xl" }, [
                createVNode("div", { class: "flex items-center justify-between px-6 py-4 lg:py-3" }, [
                  createVNode("h3", { class: "text-lg font-semibold text-foreground" }, "\u0627\u0634\u062A\u0631\u0627\u06A9\u200C\u06AF\u0630\u0627\u0631\u06CC"),
                  createTextVNode(),
                  createVNode("button", {
                    onClick: ($event) => isBottomSheetOpen.value = false,
                    class: "w-8 h-8 rounded-full bg-muted hover:bg-muted/80 flex items-center justify-center transition-colors"
                  }, [
                    createVNode("i", { class: "ti ti-x text-foreground text-base" })
                  ], 8, ["onClick"])
                ])
              ]),
              createTextVNode(),
              createVNode("div", { class: "flex-1 overflow-y-auto lg:overflow-hidden" }, [
                createVNode("div", { class: "flex flex-col lg:flex-row lg:h-full" }, [
                  createVNode("div", { class: "lg:w-1/2 lg:border-l lg:border-border p-6 lg:flex lg:flex-col lg:justify-center lg:items-center bg-muted/30" }, [
                    createVNode("div", { class: "flex justify-center mb-6" }, [
                      createVNode("button", {
                        onClick: ($event) => showProfileSelector.value = true,
                        class: "flex items-center gap-2 p-3 bg-background hover:bg-muted/80 rounded-full border border-border min-w-[164px] transition-colors"
                      }, [
                        createVNode("div", { class: "w-7 h-7 rounded-full overflow-hidden flex-shrink-0 ring-2 ring-primary/30" }, [
                          createVNode("img", {
                            src: ((_b = selectedSharingProfile.value) == null ? void 0 : _b.avatar) || userAvatar.value,
                            alt: userName.value,
                            class: "w-full h-full object-cover"
                          }, null, 8, ["src", "alt"])
                        ]),
                        createTextVNode(),
                        createVNode("span", { class: "text-sm font-medium text-foreground truncate flex-1" }, toDisplayString(userName.value), 1),
                        createTextVNode(),
                        createVNode("i", { class: "ti ti-chevron-down text-muted-foreground flex-shrink-0" })
                      ], 8, ["onClick"])
                    ]),
                    createTextVNode(),
                    createVNode("div", { class: "flex flex-col items-center justify-center mb-6" }, [
                      createVNode("div", { class: "p-4 rounded-2xl border-2 border-border shadow-lg bg-white" }, [
                        createVNode("canvas", {
                          ref_key: "qrCanvas",
                          ref: qrCanvas,
                          width: "200",
                          height: "200",
                          class: "rounded-lg"
                        }, null, 512)
                      ])
                    ]),
                    createTextVNode(),
                    createVNode("div", { class: "flex justify-center" }, [
                      createVNode("button", {
                        onClick: shareProfile,
                        class: "flex items-center gap-3 px-10 py-3 bg-primary text-primary-foreground rounded-full font-semibold text-base hover:opacity-90 transition-opacity shadow-lg"
                      }, [
                        createVNode("i", { class: "ti ti-share-2 text-lg" }),
                        createTextVNode("\r\n                \u0627\u0634\u062A\u0631\u0627\u06A9\u200C\u06AF\u0630\u0627\u0631\u06CC\r\n              ")
                      ])
                    ])
                  ]),
                  createTextVNode(),
                  createVNode("div", { class: "lg:w-1/2 p-6 lg:overflow-y-auto" }, [
                    createVNode("div", { class: "lg:hidden space-y-0 bg-card rounded-2xl overflow-hidden border border-border shadow-sm" }, [
                      createVNode("button", {
                        onClick: copyLink,
                        class: "w-full flex items-center gap-3 p-4 hover:bg-muted/50 transition-all border-b border-border"
                      }, [
                        createVNode("div", { class: "w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center" }, [
                          createVNode("i", { class: "ti ti-link text-primary text-lg" })
                        ]),
                        createTextVNode(),
                        createVNode("span", { class: "font-medium text-foreground text-sm" }, "\u06A9\u067E\u06CC \u0644\u06CC\u0646\u06A9")
                      ]),
                      createTextVNode(),
                      createVNode("button", {
                        onClick: customizeLink,
                        class: "w-full flex items-center gap-3 p-4 hover:bg-muted/50 transition-all border-b border-border"
                      }, [
                        createVNode("div", { class: "w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center" }, [
                          createVNode("i", { class: "ti ti-edit text-primary text-lg" })
                        ]),
                        createTextVNode(),
                        createVNode("span", { class: "font-medium text-foreground text-sm" }, "\u0633\u0641\u0627\u0631\u0634\u06CC\u200C\u0633\u0627\u0632\u06CC \u0644\u06CC\u0646\u06A9")
                      ]),
                      createTextVNode(),
                      createVNode("button", {
                        onClick: customizeQR,
                        class: "w-full flex items-center gap-3 p-4 hover:bg-muted/50 transition-all border-b border-border"
                      }, [
                        createVNode("div", { class: "w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center" }, [
                          createVNode("i", { class: "ti ti-qrcode text-primary text-lg" })
                        ]),
                        createTextVNode(),
                        createVNode("span", { class: "font-medium text-foreground text-sm" }, "\u0633\u0641\u0627\u0631\u0634\u06CC\u200C\u0633\u0627\u0632\u06CC \u06A9\u06CC\u0648\u0622\u0631 \u06A9\u062F")
                      ]),
                      createTextVNode(),
                      createVNode("button", {
                        onClick: downloadQR,
                        class: "w-full flex items-center gap-3 p-4 hover:bg-muted/50 transition-all border-b border-border"
                      }, [
                        createVNode("div", { class: "w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center" }, [
                          createVNode("i", { class: "ti ti-photo text-primary text-lg" })
                        ]),
                        createTextVNode(),
                        createVNode("span", { class: "font-medium text-foreground text-sm" }, "\u0630\u062E\u06CC\u0631\u0647 \u062F\u0631 \u06AF\u0627\u0644\u0631\u06CC")
                      ]),
                      createTextVNode(),
                      createVNode("button", {
                        onClick: shareViaSMS,
                        class: "w-full flex items-center gap-3 p-4 hover:bg-muted/50 transition-all border-b border-border"
                      }, [
                        createVNode("div", { class: "w-9 h-9 rounded-xl bg-blue-500/10 flex items-center justify-center" }, [
                          createVNode("i", { class: "ti ti-message text-blue-500 text-lg" })
                        ]),
                        createTextVNode(),
                        createVNode("span", { class: "font-medium text-foreground text-sm" }, "\u0627\u0631\u0633\u0627\u0644 \u067E\u06CC\u0627\u0645\u06A9")
                      ]),
                      createTextVNode(),
                      createVNode("button", {
                        onClick: shareViaEmail,
                        class: "w-full flex items-center gap-3 p-4 hover:bg-muted/50 transition-all border-b border-border"
                      }, [
                        createVNode("div", { class: "w-9 h-9 rounded-xl bg-red-500/10 flex items-center justify-center" }, [
                          createVNode("i", { class: "ti ti-mail text-red-500 text-lg" })
                        ]),
                        createTextVNode(),
                        createVNode("span", { class: "font-medium text-foreground text-sm" }, "\u0627\u0631\u0633\u0627\u0644 \u0627\u06CC\u0645\u06CC\u0644")
                      ]),
                      createTextVNode(),
                      createVNode("button", {
                        onClick: shareViaWhatsApp,
                        class: "w-full flex items-center gap-3 p-4 hover:bg-muted/50 transition-all border-b border-border"
                      }, [
                        createVNode("div", { class: "w-9 h-9 rounded-xl bg-green-500/10 flex items-center justify-center" }, [
                          createVNode("i", { class: "ti ti-brand-whatsapp text-green-500 text-lg" })
                        ]),
                        createTextVNode(),
                        createVNode("span", { class: "font-medium text-foreground text-sm" }, "\u0627\u0634\u062A\u0631\u0627\u06A9 \u062F\u0631 \u0648\u0627\u062A\u0633\u0627\u067E")
                      ]),
                      createTextVNode(),
                      createVNode("button", {
                        onClick: shareViaInstagram,
                        class: "w-full flex items-center gap-3 p-4 hover:bg-muted/50 transition-all border-b border-border"
                      }, [
                        createVNode("div", { class: "w-9 h-9 rounded-xl bg-pink-500/10 flex items-center justify-center" }, [
                          createVNode("i", { class: "ti ti-brand-instagram text-pink-500 text-lg" })
                        ]),
                        createTextVNode(),
                        createVNode("span", { class: "font-medium text-foreground text-sm" }, "\u0627\u0634\u062A\u0631\u0627\u06A9 \u062F\u0631 \u0627\u06CC\u0646\u0633\u062A\u0627\u06AF\u0631\u0627\u0645")
                      ]),
                      createTextVNode(),
                      createVNode("button", {
                        onClick: shareViaTelegram,
                        class: "w-full flex items-center gap-3 p-4 hover:bg-muted/50 transition-all border-b border-border"
                      }, [
                        createVNode("div", { class: "w-9 h-9 rounded-xl bg-blue-500/10 flex items-center justify-center" }, [
                          createVNode("i", { class: "ti ti-brand-telegram text-blue-500 text-lg" })
                        ]),
                        createTextVNode(),
                        createVNode("span", { class: "font-medium text-foreground text-sm" }, "\u0627\u0634\u062A\u0631\u0627\u06A9 \u062F\u0631 \u062A\u0644\u06AF\u0631\u0627\u0645")
                      ]),
                      createTextVNode(),
                      createVNode("button", {
                        onClick: shareAnotherWay,
                        class: "w-full flex items-center gap-3 p-4 hover:bg-muted/50 transition-all"
                      }, [
                        createVNode("div", { class: "w-9 h-9 rounded-xl bg-muted flex items-center justify-center" }, [
                          createVNode("i", { class: "ti ti-dots text-muted-foreground text-lg" })
                        ]),
                        createTextVNode(),
                        createVNode("span", { class: "font-medium text-foreground text-sm" }, "\u0631\u0648\u0634\u200C\u0647\u0627\u06CC \u062F\u06CC\u06AF\u0631")
                      ])
                    ]),
                    createTextVNode(),
                    createVNode("div", { class: "hidden lg:block" }, [
                      createVNode("h4", { class: "text-sm font-semibold text-muted-foreground mb-4" }, "\u0631\u0648\u0634\u200C\u0647\u0627\u06CC \u0627\u0634\u062A\u0631\u0627\u06A9\u200C\u06AF\u0630\u0627\u0631\u06CC"),
                      createTextVNode(),
                      createVNode("div", { class: "grid grid-cols-4 gap-3" }, [
                        createVNode("button", {
                          onClick: copyLink,
                          class: "flex flex-col items-center gap-2 p-4 hover:bg-muted/50 rounded-xl transition-all border border-border bg-card"
                        }, [
                          createVNode("div", { class: "w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center" }, [
                            createVNode("i", { class: "ti ti-link text-primary text-xl" })
                          ]),
                          createTextVNode(),
                          createVNode("span", { class: "font-medium text-foreground text-xs text-center" }, "\u06A9\u067E\u06CC \u0644\u06CC\u0646\u06A9")
                        ]),
                        createTextVNode(),
                        createVNode("button", {
                          onClick: customizeLink,
                          class: "flex flex-col items-center gap-2 p-4 hover:bg-muted/50 rounded-xl transition-all border border-border bg-card"
                        }, [
                          createVNode("div", { class: "w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center" }, [
                            createVNode("i", { class: "ti ti-edit text-primary text-xl" })
                          ]),
                          createTextVNode(),
                          createVNode("span", { class: "font-medium text-foreground text-xs text-center" }, "\u0633\u0641\u0627\u0631\u0634\u06CC \u0644\u06CC\u0646\u06A9")
                        ]),
                        createTextVNode(),
                        createVNode("button", {
                          onClick: customizeQR,
                          class: "flex flex-col items-center gap-2 p-4 hover:bg-muted/50 rounded-xl transition-all border border-border bg-card"
                        }, [
                          createVNode("div", { class: "w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center" }, [
                            createVNode("i", { class: "ti ti-qrcode text-primary text-xl" })
                          ]),
                          createTextVNode(),
                          createVNode("span", { class: "font-medium text-foreground text-xs text-center" }, "\u0633\u0641\u0627\u0631\u0634\u06CC QR")
                        ]),
                        createTextVNode(),
                        createVNode("button", {
                          onClick: downloadQR,
                          class: "flex flex-col items-center gap-2 p-4 hover:bg-muted/50 rounded-xl transition-all border border-border bg-card"
                        }, [
                          createVNode("div", { class: "w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center" }, [
                            createVNode("i", { class: "ti ti-photo text-primary text-xl" })
                          ]),
                          createTextVNode(),
                          createVNode("span", { class: "font-medium text-foreground text-xs text-center" }, "\u0630\u062E\u06CC\u0631\u0647 QR")
                        ]),
                        createTextVNode(),
                        createVNode("button", {
                          onClick: shareViaSMS,
                          class: "flex flex-col items-center gap-2 p-4 hover:bg-muted/50 rounded-xl transition-all border border-border bg-card"
                        }, [
                          createVNode("div", { class: "w-11 h-11 rounded-xl bg-blue-500/10 flex items-center justify-center" }, [
                            createVNode("i", { class: "ti ti-message text-blue-500 text-xl" })
                          ]),
                          createTextVNode(),
                          createVNode("span", { class: "font-medium text-foreground text-xs text-center" }, "\u067E\u06CC\u0627\u0645\u06A9")
                        ]),
                        createTextVNode(),
                        createVNode("button", {
                          onClick: shareViaEmail,
                          class: "flex flex-col items-center gap-2 p-4 hover:bg-muted/50 rounded-xl transition-all border border-border bg-card"
                        }, [
                          createVNode("div", { class: "w-11 h-11 rounded-xl bg-red-500/10 flex items-center justify-center" }, [
                            createVNode("i", { class: "ti ti-mail text-red-500 text-xl" })
                          ]),
                          createTextVNode(),
                          createVNode("span", { class: "font-medium text-foreground text-xs text-center" }, "\u0627\u06CC\u0645\u06CC\u0644")
                        ]),
                        createTextVNode(),
                        createVNode("button", {
                          onClick: shareViaWhatsApp,
                          class: "flex flex-col items-center gap-2 p-4 hover:bg-muted/50 rounded-xl transition-all border border-border bg-card"
                        }, [
                          createVNode("div", { class: "w-11 h-11 rounded-xl bg-green-500/10 flex items-center justify-center" }, [
                            createVNode("i", { class: "ti ti-brand-whatsapp text-green-500 text-xl" })
                          ]),
                          createTextVNode(),
                          createVNode("span", { class: "font-medium text-foreground text-xs text-center" }, "\u0648\u0627\u062A\u0633\u0627\u067E")
                        ]),
                        createTextVNode(),
                        createVNode("button", {
                          onClick: shareViaInstagram,
                          class: "flex flex-col items-center gap-2 p-4 hover:bg-muted/50 rounded-xl transition-all border border-border bg-card"
                        }, [
                          createVNode("div", { class: "w-11 h-11 rounded-xl bg-pink-500/10 flex items-center justify-center" }, [
                            createVNode("i", { class: "ti ti-brand-instagram text-pink-500 text-xl" })
                          ]),
                          createTextVNode(),
                          createVNode("span", { class: "font-medium text-foreground text-xs text-center" }, "\u0627\u06CC\u0646\u0633\u062A\u0627\u06AF\u0631\u0627\u0645")
                        ]),
                        createTextVNode(),
                        createVNode("button", {
                          onClick: shareViaTelegram,
                          class: "flex flex-col items-center gap-2 p-4 hover:bg-muted/50 rounded-xl transition-all border border-border bg-card"
                        }, [
                          createVNode("div", { class: "w-11 h-11 rounded-xl bg-blue-500/10 flex items-center justify-center" }, [
                            createVNode("i", { class: "ti ti-brand-telegram text-blue-500 text-xl" })
                          ]),
                          createTextVNode(),
                          createVNode("span", { class: "font-medium text-foreground text-xs text-center" }, "\u062A\u0644\u06AF\u0631\u0627\u0645")
                        ]),
                        createTextVNode(),
                        createVNode("button", {
                          onClick: shareAnotherWay,
                          class: "flex flex-col items-center gap-2 p-4 hover:bg-muted/50 rounded-xl transition-all border border-border bg-card"
                        }, [
                          createVNode("div", { class: "w-11 h-11 rounded-xl bg-muted flex items-center justify-center" }, [
                            createVNode("i", { class: "ti ti-dots text-muted-foreground text-xl" })
                          ]),
                          createTextVNode(),
                          createVNode("span", { class: "font-medium text-foreground text-xs text-center" }, "\u0628\u06CC\u0634\u062A\u0631")
                        ])
                      ])
                    ])
                  ])
                ])
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(` `);
      if (showToast.value) {
        _push(ssrRenderComponent(_sfc_main$e, {
          title: toastMessage.value,
          type: toastType.value,
          onClose: ($event) => showToast.value = false
        }, null, _parent));
      } else {
        _push(`<!---->`);
      }
      _push(` `);
      _push(ssrRenderComponent(__nuxt_component_0, {
        modelValue: showProfileSelector.value,
        "onUpdate:modelValue": ($event) => showProfileSelector.value = $event,
        closable: true,
        "close-on-backdrop": true,
        title: "\u0627\u0646\u062A\u062E\u0627\u0628 \u067E\u0631\u0648\u0641\u0627\u06CC\u0644"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="px-4 pb-6 pt-2" data-v-d2cd92b8${_scopeId}><p class="text-sm text-primary opacity-60 text-center mb-4" data-v-d2cd92b8${_scopeId}>\u067E\u0631\u0648\u0641\u0627\u06CC\u0644 \u0645\u0648\u0631\u062F \u0646\u0638\u0631 \u062E\u0648\u062F \u0631\u0627 \u0627\u0646\u062A\u062E\u0627\u0628 \u06A9\u0646\u06CC\u062F</p> <div class="space-y-2" data-v-d2cd92b8${_scopeId}><!--[-->`);
            ssrRenderList(availableProfiles.value, (profile) => {
              var _a, _b;
              _push2(`<div class="${ssrRenderClass([((_a = selectedSharingProfile.value) == null ? void 0 : _a.id) === profile.id ? "bg-primary/5 border-primary" : "bg-secondary border-border hover:bg-accent-bg/30", "flex items-center gap-3 p-3 rounded-2xl border cursor-pointer transition-colors"])}" data-v-d2cd92b8${_scopeId}><div class="relative w-11 h-11 rounded-full overflow-hidden ring-2 ring-border bg-white" data-v-d2cd92b8${_scopeId}><img${ssrRenderAttr("src", profile.avatar || "/logo.svg")}${ssrRenderAttr("alt", profile.name)} class="w-full h-full object-cover" data-v-d2cd92b8${_scopeId}></div> <div class="flex-1" data-v-d2cd92b8${_scopeId}><div class="flex items-center justify-between mb-0.5" data-v-d2cd92b8${_scopeId}><div class="flex items-center gap-1.5" data-v-d2cd92b8${_scopeId}><h3 class="text-sm font-semibold text-primary" data-v-d2cd92b8${_scopeId}>${ssrInterpolate(userName.value)}</h3> `);
              if (isPro.value) {
                _push2(`<i class="ti ti-rosette-discount-check-filled text-primary text-lg" data-v-d2cd92b8${_scopeId}></i>`);
              } else {
                _push2(`<!---->`);
              }
              _push2(`</div> `);
              if (((_b = selectedSharingProfile.value) == null ? void 0 : _b.id) === profile.id) {
                _push2(`<span class="text-xs bg-secondary text-primary border border-border px-2 py-0.5 rounded-full font-medium flex items-center gap-1" data-v-d2cd92b8${_scopeId}><i class="ti ti-check text-xs" data-v-d2cd92b8${_scopeId}></i>
                  \u067E\u06CC\u0634\u200C\u0641\u0631\u0636
                </span>`);
              } else {
                _push2(`<!---->`);
              }
              _push2(`</div> <div class="flex flex-wrap items-center gap-1.5 text-xs text-foreground" data-v-d2cd92b8${_scopeId}>`);
              if (userUserName.value) {
                _push2(`<span class="font-medium" data-v-d2cd92b8${_scopeId}>
                  @${ssrInterpolate(userUserName.value)}</span>`);
              } else {
                _push2(`<!---->`);
              }
              _push2(`</div></div></div>`);
            });
            _push2(`<!--]--></div> <div class="mt-3 pt-3" data-v-d2cd92b8${_scopeId}><div class="w-full flex items-center justify-between gap-2 p-3 rounded-2xl bg-secondary border-2 border-dashed border-border hover:bg-accent-bg/30 transition-colors" data-v-d2cd92b8${_scopeId}><div class="flex items-center gap-2 flex-1 cursor-pointer" data-v-d2cd92b8${_scopeId}><div class="w-11 h-11 rounded-full bg-accent-bg ring-2 ring-border flex items-center justify-center" data-v-d2cd92b8${_scopeId}><i class="ti ti-plus text-primary text-sm" data-v-d2cd92b8${_scopeId}></i></div> <span class="text-sm font-medium text-primary" data-v-d2cd92b8${_scopeId}>
                \u0627\u06CC\u062C\u0627\u062F \u067E\u0631\u0648\u0641\u0627\u06CC\u0644 \u062C\u062F\u06CC\u062F
              </span></div> `);
            if (!isPro.value) {
              _push2(`<div class="bg-primary text-white px-3 py-1 rounded-full text-xs font-semibold cursor-pointer" data-v-d2cd92b8${_scopeId}>
              \u062E\u0631\u06CC\u062F \u0627\u0634\u062A\u0631\u0627\u06A9
            </div>`);
            } else {
              _push2(`<div class="bg-primary text-white px-3 py-1 rounded-full text-xs font-semibold" data-v-d2cd92b8${_scopeId}>
              \u06A9\u0627\u0631\u0628\u0631 \u0648\u06CC\u0698\u0647
            </div>`);
            }
            _push2(`</div></div></div>`);
          } else {
            return [
              createVNode("div", { class: "px-4 pb-6 pt-2" }, [
                createVNode("p", { class: "text-sm text-primary opacity-60 text-center mb-4" }, "\u067E\u0631\u0648\u0641\u0627\u06CC\u0644 \u0645\u0648\u0631\u062F \u0646\u0638\u0631 \u062E\u0648\u062F \u0631\u0627 \u0627\u0646\u062A\u062E\u0627\u0628 \u06A9\u0646\u06CC\u062F"),
                createTextVNode(),
                createVNode("div", { class: "space-y-2" }, [
                  (openBlock(true), createBlock(Fragment, null, renderList(availableProfiles.value, (profile) => {
                    var _a, _b;
                    return openBlock(), createBlock("div", {
                      key: profile.id,
                      onClick: ($event) => selectProfileForSharing(profile),
                      class: ["flex items-center gap-3 p-3 rounded-2xl border cursor-pointer transition-colors", ((_a = selectedSharingProfile.value) == null ? void 0 : _a.id) === profile.id ? "bg-primary/5 border-primary" : "bg-secondary border-border hover:bg-accent-bg/30"]
                    }, [
                      createVNode("div", { class: "relative w-11 h-11 rounded-full overflow-hidden ring-2 ring-border bg-white" }, [
                        createVNode("img", {
                          src: profile.avatar || "/logo.svg",
                          alt: profile.name,
                          class: "w-full h-full object-cover"
                        }, null, 8, ["src", "alt"])
                      ]),
                      createTextVNode(),
                      createVNode("div", { class: "flex-1" }, [
                        createVNode("div", { class: "flex items-center justify-between mb-0.5" }, [
                          createVNode("div", { class: "flex items-center gap-1.5" }, [
                            createVNode("h3", { class: "text-sm font-semibold text-primary" }, toDisplayString(userName.value), 1),
                            createTextVNode(),
                            isPro.value ? (openBlock(), createBlock("i", {
                              key: 0,
                              class: "ti ti-rosette-discount-check-filled text-primary text-lg"
                            })) : createCommentVNode("", true)
                          ]),
                          createTextVNode(),
                          ((_b = selectedSharingProfile.value) == null ? void 0 : _b.id) === profile.id ? (openBlock(), createBlock("span", {
                            key: 0,
                            class: "text-xs bg-secondary text-primary border border-border px-2 py-0.5 rounded-full font-medium flex items-center gap-1"
                          }, [
                            createVNode("i", { class: "ti ti-check text-xs" }),
                            createTextVNode("\r\n                  \u067E\u06CC\u0634\u200C\u0641\u0631\u0636\r\n                ")
                          ])) : createCommentVNode("", true)
                        ]),
                        createTextVNode(),
                        createVNode("div", { class: "flex flex-wrap items-center gap-1.5 text-xs text-foreground" }, [
                          userUserName.value ? (openBlock(), createBlock("span", {
                            key: 0,
                            class: "font-medium"
                          }, "\r\n                  @" + toDisplayString(userUserName.value), 1)) : createCommentVNode("", true)
                        ])
                      ])
                    ], 10, ["onClick"]);
                  }), 128))
                ]),
                createTextVNode(),
                createVNode("div", { class: "mt-3 pt-3" }, [
                  createVNode("div", { class: "w-full flex items-center justify-between gap-2 p-3 rounded-2xl bg-secondary border-2 border-dashed border-border hover:bg-accent-bg/30 transition-colors" }, [
                    createVNode("div", {
                      onClick: addNewProfile,
                      class: "flex items-center gap-2 flex-1 cursor-pointer"
                    }, [
                      createVNode("div", { class: "w-11 h-11 rounded-full bg-accent-bg ring-2 ring-border flex items-center justify-center" }, [
                        createVNode("i", { class: "ti ti-plus text-primary text-sm" })
                      ]),
                      createTextVNode(),
                      createVNode("span", { class: "text-sm font-medium text-primary" }, "\r\n                \u0627\u06CC\u062C\u0627\u062F \u067E\u0631\u0648\u0641\u0627\u06CC\u0644 \u062C\u062F\u06CC\u062F\r\n              ")
                    ]),
                    createTextVNode(),
                    !isPro.value ? (openBlock(), createBlock("div", {
                      key: 0,
                      onClick: handlePremiumClick,
                      class: "bg-primary text-white px-3 py-1 rounded-full text-xs font-semibold cursor-pointer"
                    }, "\r\n              \u062E\u0631\u06CC\u062F \u0627\u0634\u062A\u0631\u0627\u06A9\r\n            ")) : (openBlock(), createBlock("div", {
                      key: 1,
                      class: "bg-primary text-white px-3 py-1 rounded-full text-xs font-semibold"
                    }, "\r\n              \u06A9\u0627\u0631\u0628\u0631 \u0648\u06CC\u0698\u0647\r\n            "))
                  ])
                ])
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div>`);
    };
  }
});
const _sfc_setup$8 = _sfc_main$8.setup;
_sfc_main$8.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/UserDashboard/main/BottomNavigation.vue");
  return _sfc_setup$8 ? _sfc_setup$8(props, ctx) : void 0;
};
const BottomNavigation = /* @__PURE__ */ _export_sfc(_sfc_main$8, [["__scopeId", "data-v-d2cd92b8"]]);
const _sfc_main$7 = {
  __name: "ShareModal",
  __ssrInlineRender: true,
  props: { visible: Boolean, card: Object },
  emits: ["close"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const { getIconComponent } = useIconComponents();
    const profileLink = ref("");
    const qrLogoSrc = ref("/logo/logo.png");
    const copied = ref(false);
    const qrCanvas = ref(null);
    watch(() => props.card, (newVal) => {
      var _a;
      if (newVal !== null && newVal !== void 0) {
        qrLogoSrc.value = (_a = newVal.qrLogo) != null ? _a : "/logo/logo.png";
        profileLink.value = newVal.slug ? `https://linku.im/profile/${newVal.slug}/share` : "https://linku.im/profile/MA5PZ1jq/share";
      } else {
        qrLogoSrc.value = "/logo/logo.png";
        profileLink.value = "https://linku.im/profile/MA5PZ1jq/share";
      }
    });
    const copyLink = () => {
      (void 0).clipboard.writeText(profileLink.value);
      copied.value = true;
      setTimeout(() => copied.value = false, 2e3);
    };
    const drawQR = async (color, bgColor) => {
      if (!qrCanvas.value || true) return;
    };
    const downloadQR = async (color, bgColor) => {
      const size = 800;
      const canvas = (void 0).createElement("canvas");
      canvas.width = size;
      canvas.height = size;
      const ctx = canvas.getContext("2d");
      await QRCode.toCanvas(canvas, profileLink.value, {
        errorCorrectionLevel: "H",
        width: size,
        margin: 2,
        color: { dark: color, light: bgColor }
      });
      const logo = new Image();
      logo.src = qrLogoSrc.value;
      logo.crossOrigin = "anonymous";
      await logo.decode();
      const boxSize = size * 0.35;
      const x = (size - boxSize) / 2;
      const y = (size - boxSize) / 2;
      ctx.save();
      ctx.beginPath();
      const r = 24;
      ctx.moveTo(x + r, y);
      ctx.lineTo(x + boxSize - r, y);
      ctx.quadraticCurveTo(x + boxSize, y, x + boxSize, y + r);
      ctx.lineTo(x + boxSize, y + boxSize - r);
      ctx.quadraticCurveTo(x + boxSize, y + boxSize, x + boxSize - r, y + boxSize);
      ctx.lineTo(x + r, y + boxSize);
      ctx.quadraticCurveTo(x, y + boxSize, x, y + boxSize - r);
      ctx.lineTo(x, y + r);
      ctx.quadraticCurveTo(x, y, x + r, y);
      ctx.closePath();
      ctx.fillStyle = "#ffffff";
      ctx.fill();
      ctx.clip();
      const padding = boxSize * 0.12;
      const ratio = Math.min((boxSize - 2 * padding) / logo.width, (boxSize - 2 * padding) / logo.height);
      const w = logo.width * ratio;
      const h = logo.height * ratio;
      const offsetX = x + (boxSize - w) / 2;
      const offsetY = y + (boxSize - h) / 2;
      ctx.drawImage(logo, offsetX, offsetY, w, h);
      ctx.restore();
      const link = (void 0).createElement("a");
      link.href = canvas.toDataURL("image/png");
      link.download = "qr-high-quality.png";
      link.click();
    };
    const cardStore = useCardStore();
    watch(() => props.visible, async (val) => {
      var _a, _b, _c;
      if (val) {
        await cardStore.fetchCard(props.card.id);
        qrLogoSrc.value = (_b = (_a = cardStore.activeCard) == null ? void 0 : _a.qrLogo) != null ? _b : "/logo/logo.png";
        profileLink.value = `https://linku.im/profile/${(_c = cardStore.activeCard) == null ? void 0 : _c.slug}/share`;
        if (val) {
          setTimeout(() => {
            drawQR(
              cardStore.activeCard.qrColor ? cardStore.activeCard.qrColor : "#000000",
              cardStore.activeCard.qrBgColor ? cardStore.activeCard.qrBgColor : "#ffffff"
            );
          }, 50);
        }
      }
    }, { immediate: true });
    const shareLinks = computed(() => [
      {
        name: "\u0627\u06CC\u0645\u06CC\u0644",
        iconComponent: getIconComponent({ type: "component", name: "email" }),
        url: `mailto:?subject=\u06A9\u0627\u0631\u062A \u062F\u06CC\u062C\u06CC\u062A\u0627\u0644&body=\u0628\u0631\u0627\u06CC \u0645\u0634\u0627\u0647\u062F\u0647 \u067E\u0631\u0648\u0641\u0627\u06CC\u0644\u060C \u0631\u0648\u06CC \u0644\u06CC\u0646\u06A9 \u0632\u06CC\u0631 \u06A9\u0644\u06CC\u06A9 \u06A9\u0646\u06CC\u062F \u{1F447}\u{1F3FB}%0A%0A${profileLink.value}`
      },
      {
        name: "\u0644\u06CC\u0646\u06A9\u062F\u06CC\u0646",
        iconComponent: getIconComponent({ type: "component", name: "linkedin" }),
        url: `https://www.linkedin.com/sharing/share-offsite/?url=${profileLink.value}`
      },
      {
        name: "\u062A\u0644\u06AF\u0631\u0627\u0645",
        iconComponent: getIconComponent({ type: "component", name: "telegram" }),
        url: `https://t.me/share/url?url=${profileLink.value}&text=${encodeURIComponent("\u0628\u0631\u0627\u06CC \u0645\u0634\u0627\u0647\u062F\u0647 \u067E\u0631\u0648\u0641\u0627\u06CC\u0644\u060C \u0631\u0648\u06CC \u0644\u06CC\u0646\u06A9 \u0632\u06CC\u0631 \u06A9\u0644\u06CC\u06A9 \u06A9\u0646\u06CC\u062F \u{1F447}\u{1F3FB}")}`
      },
      {
        name: "\u0648\u0627\u062A\u0633\u0627\u067E",
        iconComponent: getIconComponent({ type: "component", name: "whatsapp" }),
        url: `https://api.whatsapp.com/send?text=${encodeURIComponent("\u0628\u0631\u0627\u06CC \u0645\u0634\u0627\u0647\u062F\u0647 \u067E\u0631\u0648\u0641\u0627\u06CC\u0644\u060C \u0631\u0648\u06CC \u0644\u06CC\u0646\u06A9 \u0632\u06CC\u0631 \u06A9\u0644\u06CC\u06A9 \u06A9\u0646\u06CC\u062F \u{1F447}\u{1F3FB}\n\n" + profileLink.value)}`
      }
    ]);
    return (_ctx, _push, _parent, _attrs) => {
      const _component_UiBottomSheet = __nuxt_component_0;
      _push(ssrRenderComponent(_component_UiBottomSheet, mergeProps({
        visible: __props.visible,
        title: "\u0627\u0634\u062A\u0631\u0627\u06A9 \u06A9\u0627\u0631\u062A",
        onClose: ($event) => _ctx.$emit("close")
      }, _attrs), {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="flex flex-col items-center gap-4 mb-8 border-b border-gray-100 pb-4"${_scopeId}><canvas width="160" height="160" class="rounded-lg"${_scopeId}></canvas> <button class="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 px-5 py-2 rounded-full font-medium mt-2"${_scopeId}><i class="ti ti-download"${_scopeId}></i>
        \u062F\u0627\u0646\u0644\u0648\u062F QR \u06A9\u062F
      </button></div> <div class="my-16"${_scopeId}><p class="text-sm font-semibold mb-4"${_scopeId}>\u06A9\u067E\u06CC \u0644\u06CC\u0646\u06A9 \u06A9\u0627\u0631\u062A</p> <div class="relative flex justify-between gap-4"${_scopeId}><input readonly${ssrRenderAttr("value", profileLink.value)} class="w-full bg-gray-100 text-sm text-gray-700 py-4 px-3 rounded-2xl ltr:pr-20 rtl:pl-20"${_scopeId}> <button class="text-blue-500 text-sm font-medium flex items-center justify-end gap-1 w-28"${_scopeId}><i class="ti ti-copy text-base"${_scopeId}></i> \u06A9\u067E\u06CC \u0644\u06CC\u0646\u06A9
        </button></div> `);
            if (copied.value) {
              _push2(`<p class="text-xs text-blue-500 mt-1"${_scopeId}>\u06A9\u067E\u06CC \u0634\u062F!</p>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</div> <div class="mt-6"${_scopeId}><p class="text-sm font-semibold mb-4"${_scopeId}>\u0627\u0634\u062A\u0631\u0627\u06A9 \u0627\u0632 \u0637\u0631\u06CC\u0642</p> <div class="grid grid-cols-2 gap-y-4 gap-x-4 pr-1"${_scopeId}><!--[-->`);
            ssrRenderList(shareLinks.value, (item) => {
              _push2(`<a${ssrRenderAttr("href", item.url)} target="_blank" rel="noreferrer" class="flex items-center justify-between text-gray-700 rounded-lg px-4 py-3 bg-gray-100 hover:bg-gray-50 transition"${_scopeId}><div class="flex items-center gap-2"${_scopeId}>`);
              ssrRenderVNode(_push2, createVNode(resolveDynamicComponent(markRaw(item.iconComponent)), { size: 24 }, null), _parent2, _scopeId);
              _push2(` <span class="text-sm font-medium"${_scopeId}>${ssrInterpolate(item.name)}</span></div> <i class="ti ti-external-link opacity-50"${_scopeId}></i></a>`);
            });
            _push2(`<!--]--></div></div>`);
          } else {
            return [
              createVNode("div", { class: "flex flex-col items-center gap-4 mb-8 border-b border-gray-100 pb-4" }, [
                createVNode("canvas", {
                  ref_key: "qrCanvas",
                  ref: qrCanvas,
                  width: "160",
                  height: "160",
                  class: "rounded-lg"
                }, null, 512),
                createTextVNode(),
                createVNode("button", {
                  onClick: ($event) => downloadQR(
                    __props.card.qrColor ? __props.card.qrColor : "#000000",
                    __props.card.qrBgColor ? __props.card.qrBgColor : "#ffffff"
                  ),
                  class: "flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 px-5 py-2 rounded-full font-medium mt-2"
                }, [
                  createVNode("i", { class: "ti ti-download" }),
                  createTextVNode("\r\n        \u062F\u0627\u0646\u0644\u0648\u062F QR \u06A9\u062F\r\n      ")
                ], 8, ["onClick"])
              ]),
              createTextVNode(),
              createVNode("div", { class: "my-16" }, [
                createVNode("p", { class: "text-sm font-semibold mb-4" }, "\u06A9\u067E\u06CC \u0644\u06CC\u0646\u06A9 \u06A9\u0627\u0631\u062A"),
                createTextVNode(),
                createVNode("div", { class: "relative flex justify-between gap-4" }, [
                  createVNode("input", {
                    readonly: "",
                    value: profileLink.value,
                    class: "w-full bg-gray-100 text-sm text-gray-700 py-4 px-3 rounded-2xl ltr:pr-20 rtl:pl-20"
                  }, null, 8, ["value"]),
                  createTextVNode(),
                  createVNode("button", {
                    onClick: copyLink,
                    class: "text-blue-500 text-sm font-medium flex items-center justify-end gap-1 w-28"
                  }, [
                    createVNode("i", { class: "ti ti-copy text-base" }),
                    createTextVNode(" \u06A9\u067E\u06CC \u0644\u06CC\u0646\u06A9\r\n        ")
                  ])
                ]),
                createTextVNode(),
                copied.value ? (openBlock(), createBlock("p", {
                  key: 0,
                  class: "text-xs text-blue-500 mt-1"
                }, "\u06A9\u067E\u06CC \u0634\u062F!")) : createCommentVNode("", true)
              ]),
              createTextVNode(),
              createVNode("div", { class: "mt-6" }, [
                createVNode("p", { class: "text-sm font-semibold mb-4" }, "\u0627\u0634\u062A\u0631\u0627\u06A9 \u0627\u0632 \u0637\u0631\u06CC\u0642"),
                createTextVNode(),
                createVNode("div", { class: "grid grid-cols-2 gap-y-4 gap-x-4 pr-1" }, [
                  (openBlock(true), createBlock(Fragment, null, renderList(shareLinks.value, (item) => {
                    return openBlock(), createBlock("a", {
                      key: item.name,
                      href: item.url,
                      target: "_blank",
                      rel: "noreferrer",
                      class: "flex items-center justify-between text-gray-700 rounded-lg px-4 py-3 bg-gray-100 hover:bg-gray-50 transition"
                    }, [
                      createVNode("div", { class: "flex items-center gap-2" }, [
                        (openBlock(), createBlock(resolveDynamicComponent(markRaw(item.iconComponent)), { size: 24 })),
                        createTextVNode(),
                        createVNode("span", { class: "text-sm font-medium" }, toDisplayString(item.name), 1)
                      ]),
                      createTextVNode(),
                      createVNode("i", { class: "ti ti-external-link opacity-50" })
                    ], 8, ["href"]);
                  }), 128))
                ])
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
    };
  }
};
const _sfc_setup$7 = _sfc_main$7.setup;
_sfc_main$7.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/UserDashboard/modals/ShareModal.vue");
  return _sfc_setup$7 ? _sfc_setup$7(props, ctx) : void 0;
};
async function fetchInfoFormCount(cardId, axiosInstance) {
  var _a, _b, _c, _d;
  try {
    const [leadRes, formRes] = await Promise.all([
      axiosInstance.get(`v1/cards/${cardId}/leads/leadsCount`),
      axiosInstance.get(`v1/cards/${cardId}/forms/formsCount`)
    ]);
    const leadData = leadRes.data.data || {};
    const formData = formRes.data.data || {};
    return {
      unreadCount: ((_a = leadData.unreadCount) != null ? _a : 0) + ((_b = formData.unreadCount) != null ? _b : 0),
      totalCount: ((_c = leadData.totalCount) != null ? _c : 0) + ((_d = formData.totalCount) != null ? _d : 0)
    };
  } catch (error) {
    return {
      unreadCount: 0,
      totalCount: 0
    };
  }
}
async function fetchPollCount(cardId, axiosInstance) {
  var _a;
  try {
    const response = await axiosInstance.get(`v1/cards/${cardId}/votes`);
    return ((_a = response.data) == null ? void 0 : _a.total_votes) || 0;
  } catch (error) {
    return 0;
  }
}
async function fetchPeopleLuckyDice(cardId, axiosInstance) {
  try {
    const response = await axiosInstance.get(`club/${cardId}/luckyDice/resultCount`);
    const { totalCount, unreadCount } = response.data.data || {};
    return {
      totalCount: totalCount != null ? totalCount : 0,
      unreadCount: unreadCount != null ? unreadCount : 0
    };
  } catch (error) {
    return {
      totalCount: 0,
      unreadCount: 0
    };
  }
}
async function fetchPeopleLuckyEgg(cardId, axiosInstance) {
  try {
    const response = await axiosInstance.get(`club/${cardId}/luckyEgg/resultCount`);
    const { totalCount, unreadCount } = response.data.data || {};
    return {
      totalCount: totalCount != null ? totalCount : 0,
      unreadCount: unreadCount != null ? unreadCount : 0
    };
  } catch (error) {
    return {
      totalCount: 0,
      unreadCount: 0
    };
  }
}
async function fetchPeopleLuckyWheel(cardId, axiosInstance) {
  try {
    const response = await axiosInstance.get(`club/${cardId}/luckyWheel/resultCount`);
    const { totalCount, unreadCount } = response.data.data || {};
    return {
      totalCount: totalCount != null ? totalCount : 0,
      unreadCount: unreadCount != null ? unreadCount : 0
    };
  } catch (error) {
    return {
      totalCount: 0,
      unreadCount: 0
    };
  }
}
const _sfc_main$1 = /* @__PURE__ */ defineComponent({
  __name: "CardSelect",
  __ssrInlineRender: true,
  setup(__props) {
    const form = useFormStore();
    const menuOpen = ref(false);
    const dropdownRef = ref(null);
    const isMobile = ref(false);
    const selectedCard = computed(() => form.defaultCard || { id: "default", name: "\u06A9\u0627\u0631\u062A \u0645\u0646", avatar: null, isDefault: false, description: "\u067E\u06CC\u0634\u200C\u0641\u0631\u0636" });
    const otherCards = computed(() => {
      if (!form.cards || !selectedCard.value) return [];
      return form.cards.filter((c) => {
        var _a;
        return c.id !== ((_a = selectedCard.value) == null ? void 0 : _a.id);
      });
    });
    const selectCard = async (card) => {
      var _a;
      form.setDefaultCard(card.id);
      menuOpen.value = false;
      const cardId = (_a = form.defaultCard) == null ? void 0 : _a.id;
      if (!cardId) return;
      const { $axios } = useNuxtApp();
      const infoCount = await fetchInfoFormCount(cardId, $axios);
      const pollCount = await fetchPollCount(cardId, $axios);
      const luckyDiceCount = await fetchPeopleLuckyDice(cardId, $axios);
      const luckyEggCount = await fetchPeopleLuckyEgg(cardId, $axios);
      const spinWheelCount = await fetchPeopleLuckyWheel(cardId, $axios);
      const total = infoCount + pollCount + luckyDiceCount + luckyEggCount + spinWheelCount;
      form.setInboxBadge(total);
    };
    const goToAddCard = async () => {
      menuOpen.value = false;
      await navigateTo("/dashboard/add-card");
    };
    return (_ctx, _push, _parent, _attrs) => {
      var _a, _b, _c;
      const _component_UiBottomSheet = __nuxt_component_0;
      _push(`<div${ssrRenderAttrs(mergeProps({
        ref_key: "dropdownRef",
        ref: dropdownRef,
        class: "relative z-50 w-20 md:w-72 text-sm text-right rtl"
      }, _attrs))}><button class="w-full rounded-full border border-gray-300 px-4 py-1.5 flex items-center justify-between bg-white"><div class="flex items-center gap-2 overflow-hidden">`);
      if ((_a = selectedCard.value) == null ? void 0 : _a.avatar) {
        _push(`<img${ssrRenderAttr("src", selectedCard.value.avatar)} class="w-6 h-6 rounded-full object-cover">`);
      } else {
        _push(`<span class="bg-gray-100 rounded-full w-7 h-7 flex items-center justify-center"><i class="ti ti-user text-xl text-gray-400"></i></span>`);
      }
      _push(` <span class="truncate font-medium hidden md:block text-gray-700">${ssrInterpolate(((_b = selectedCard.value) == null ? void 0 : _b.name) || "\u06A9\u0627\u0631\u062A \u0645\u0646")}</span> `);
      if ((_c = selectedCard.value) == null ? void 0 : _c.isDefault) {
        _push(`<span class="text-xs font-semibold bg-gray-100 text-black px-2 py-0.5 rounded-full hidden md:inline">
          \u067E\u06CC\u0634\u200C\u0641\u0631\u0636
        </span>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div> <i class="ti ti-chevron-down text-xs"></i></button> `);
      if (menuOpen.value && !isMobile.value) {
        _push(`<div class="absolute mt-4 left-0 w-72 bg-white border rounded-xl shadow-xl z-50">`);
        if (selectedCard.value) {
          _push(`<div class="px-4 py-3 border-b"><h3 class="text-xs text-gray-500 mb-2 flex items-center gap-1"><i class="ti ti-eye"></i> \u062F\u0631 \u062D\u0627\u0644 \u0645\u0634\u0627\u0647\u062F\u0647
        </h3> <div class="flex items-center gap-2">`);
          if (selectedCard.value.avatar) {
            _push(`<img${ssrRenderAttr("src", selectedCard.value.avatar)} class="w-8 h-8 rounded-full object-cover">`);
          } else {
            _push(`<!---->`);
          }
          _push(` <div><p class="font-medium text-gray-700">${ssrInterpolate(selectedCard.value.name)}</p> <p class="text-xs text-gray-500">${ssrInterpolate(selectedCard.value.description)}</p></div></div></div>`);
        } else {
          _push(`<!---->`);
        }
        _push(` <div class="px-4 py-3 border-b max-h-40 overflow-y-auto"><h3 class="text-xs text-gray-500 mb-2 flex items-center gap-1"><i class="ti ti-id"></i> \u06A9\u0627\u0631\u062A\u200C\u0647\u0627\u06CC \u062F\u06CC\u06AF\u0631
        </h3> <div class="space-y-3"><!--[-->`);
        ssrRenderList(otherCards.value, (card) => {
          var _a2;
          _push(`<div class="flex items-center gap-3 cursor-pointer hover:bg-gray-100 p-2 rounded-lg">`);
          if (card.avatar) {
            _push(`<img${ssrRenderAttr("src", card.avatar)} class="w-8 h-8 rounded-full object-cover">`);
          } else {
            _push(`<!---->`);
          }
          _push(` <div class="flex-1"><p class="font-medium flex items-center gap-1 text-gray-700">${ssrInterpolate(card.name)} `);
          if (card.isDefault) {
            _push(`<span class="text-xs bg-gray-200 text-gray-700 px-2 py-0.5 rounded-full">
                  \u067E\u06CC\u0634\u200C\u0641\u0631\u0636
                </span>`);
          } else {
            _push(`<!---->`);
          }
          _push(`</p> `);
          if (card.description) {
            _push(`<p class="text-xs text-gray-500">${ssrInterpolate(card.description)}</p>`);
          } else {
            _push(`<!---->`);
          }
          _push(`</div> `);
          if (card.id === ((_a2 = selectedCard.value) == null ? void 0 : _a2.id)) {
            _push(`<i class="ti ti-check text-green-600"></i>`);
          } else {
            _push(`<!---->`);
          }
          _push(`</div>`);
        });
        _push(`<!--]--></div> `);
        if (otherCards.value.length === 0) {
          _push(`<p class="text-xs text-gray-500 text-center py-2">
          \u06A9\u0627\u0631\u062A \u062F\u06CC\u06AF\u0631\u06CC \u0648\u062C\u0648\u062F \u0646\u062F\u0627\u0631\u062F
        </p>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div> <div class="p-4"><button class="w-full bg-black text-white py-2 rounded-full flex items-center justify-center gap-2"><i class="ti ti-plus"></i> \u0627\u06CC\u062C\u0627\u062F \u067E\u0631\u0648\u0641\u0627\u06CC\u0644 \u062C\u062F\u06CC\u062F
        </button></div></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(` `);
      _push(ssrRenderComponent(_component_UiBottomSheet, {
        visible: menuOpen.value && isMobile.value,
        title: "\u0627\u0646\u062A\u062E\u0627\u0628 \u06A9\u0627\u0631\u062A",
        "height-class": "max-h-[calc(100vh-80px)]",
        "content-padding": "p-4",
        onClose: ($event) => menuOpen.value = false
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            if (selectedCard.value) {
              _push2(`<div class="mb-6 transform transition-all duration-200"${_scopeId}><h3 class="text-sm text-gray-500 mb-3 flex items-center gap-2"${_scopeId}><i class="ti ti-eye"${_scopeId}></i> \u062F\u0631 \u062D\u0627\u0644 \u0645\u0634\u0627\u0647\u062F\u0647
        </h3> <div class="flex items-center gap-3 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"${_scopeId}>`);
              if (selectedCard.value.avatar) {
                _push2(`<img${ssrRenderAttr("src", selectedCard.value.avatar)} class="w-12 h-12 rounded-full object-cover shadow-sm"${_scopeId}>`);
              } else {
                _push2(`<span class="bg-gray-100 rounded-full w-12 h-12 flex items-center justify-center"${_scopeId}><i class="ti ti-user text-2xl text-gray-400"${_scopeId}></i></span>`);
              }
              _push2(` <div class="flex-1"${_scopeId}><p class="font-semibold text-base text-gray-800"${_scopeId}>${ssrInterpolate(selectedCard.value.name)}</p> `);
              if (selectedCard.value.description) {
                _push2(`<p class="text-sm text-gray-500"${_scopeId}>${ssrInterpolate(selectedCard.value.description)}</p>`);
              } else {
                _push2(`<!---->`);
              }
              _push2(`</div></div></div>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(` `);
            if (otherCards.value.length > 0) {
              _push2(`<div class="mb-6"${_scopeId}><h3 class="text-sm text-gray-500 mb-3 flex items-center gap-2"${_scopeId}><i class="ti ti-id"${_scopeId}></i> \u06A9\u0627\u0631\u062A\u200C\u0647\u0627\u06CC \u062F\u06CC\u06AF\u0631
        </h3> <div class="space-y-2"${_scopeId}><!--[-->`);
              ssrRenderList(otherCards.value, (card) => {
                var _a2;
                _push2(`<div class="flex items-center gap-3 cursor-pointer hover:bg-gray-50 active:bg-gray-100 p-4 rounded-xl transition-all duration-150 transform hover:scale-[0.98]"${_scopeId}>`);
                if (card.avatar) {
                  _push2(`<img${ssrRenderAttr("src", card.avatar)} class="w-12 h-12 rounded-full object-cover shadow-sm"${_scopeId}>`);
                } else {
                  _push2(`<span class="bg-gray-100 rounded-full w-12 h-12 flex items-center justify-center"${_scopeId}><i class="ti ti-user text-2xl text-gray-400"${_scopeId}></i></span>`);
                }
                _push2(` <div class="flex-1"${_scopeId}><p class="font-semibold text-base text-gray-800"${_scopeId}>${ssrInterpolate(card.name)}</p> `);
                if (card.description) {
                  _push2(`<p class="text-sm text-gray-500"${_scopeId}>${ssrInterpolate(card.description)}</p>`);
                } else {
                  _push2(`<!---->`);
                }
                _push2(`</div> `);
                if (card.id === ((_a2 = selectedCard.value) == null ? void 0 : _a2.id)) {
                  _push2(`<i class="ti ti-check text-green-600 text-xl"${_scopeId}></i>`);
                } else {
                  _push2(`<!---->`);
                }
                _push2(`</div>`);
              });
              _push2(`<!--]--></div></div>`);
            } else {
              _push2(`<p class="text-sm text-gray-500 text-center py-4 mb-6"${_scopeId}>
        \u06A9\u0627\u0631\u062A \u062F\u06CC\u06AF\u0631\u06CC \u0648\u062C\u0648\u062F \u0646\u062F\u0627\u0631\u062F
      </p>`);
            }
            _push2(` <button class="w-full bg-gray-900 hover:bg-black text-white py-3 rounded-xl flex items-center justify-center gap-2 text-base font-medium transition-all duration-200 transform active:scale-[0.98] shadow-lg"${_scopeId}><i class="ti ti-plus"${_scopeId}></i> \u0627\u06CC\u062C\u0627\u062F \u067E\u0631\u0648\u0641\u0627\u06CC\u0644 \u062C\u062F\u06CC\u062F
      </button>`);
          } else {
            return [
              selectedCard.value ? (openBlock(), createBlock("div", {
                key: 0,
                class: "mb-6 transform transition-all duration-200"
              }, [
                createVNode("h3", { class: "text-sm text-gray-500 mb-3 flex items-center gap-2" }, [
                  createVNode("i", { class: "ti ti-eye" }),
                  createTextVNode(" \u062F\u0631 \u062D\u0627\u0644 \u0645\u0634\u0627\u0647\u062F\u0647\r\n        ")
                ]),
                createTextVNode(),
                createVNode("div", { class: "flex items-center gap-3 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors" }, [
                  selectedCard.value.avatar ? (openBlock(), createBlock("img", {
                    key: 0,
                    src: selectedCard.value.avatar,
                    class: "w-12 h-12 rounded-full object-cover shadow-sm"
                  }, null, 8, ["src"])) : (openBlock(), createBlock("span", {
                    key: 1,
                    class: "bg-gray-100 rounded-full w-12 h-12 flex items-center justify-center"
                  }, [
                    createVNode("i", { class: "ti ti-user text-2xl text-gray-400" })
                  ])),
                  createTextVNode(),
                  createVNode("div", { class: "flex-1" }, [
                    createVNode("p", { class: "font-semibold text-base text-gray-800" }, toDisplayString(selectedCard.value.name), 1),
                    createTextVNode(),
                    selectedCard.value.description ? (openBlock(), createBlock("p", {
                      key: 0,
                      class: "text-sm text-gray-500"
                    }, toDisplayString(selectedCard.value.description), 1)) : createCommentVNode("", true)
                  ])
                ])
              ])) : createCommentVNode("", true),
              createTextVNode(),
              otherCards.value.length > 0 ? (openBlock(), createBlock("div", {
                key: 1,
                class: "mb-6"
              }, [
                createVNode("h3", { class: "text-sm text-gray-500 mb-3 flex items-center gap-2" }, [
                  createVNode("i", { class: "ti ti-id" }),
                  createTextVNode(" \u06A9\u0627\u0631\u062A\u200C\u0647\u0627\u06CC \u062F\u06CC\u06AF\u0631\r\n        ")
                ]),
                createTextVNode(),
                createVNode("div", { class: "space-y-2" }, [
                  (openBlock(true), createBlock(Fragment, null, renderList(otherCards.value, (card) => {
                    var _a2;
                    return openBlock(), createBlock("div", {
                      key: card.id,
                      onClick: ($event) => selectCard(card),
                      class: "flex items-center gap-3 cursor-pointer hover:bg-gray-50 active:bg-gray-100 p-4 rounded-xl transition-all duration-150 transform hover:scale-[0.98]"
                    }, [
                      card.avatar ? (openBlock(), createBlock("img", {
                        key: 0,
                        src: card.avatar,
                        class: "w-12 h-12 rounded-full object-cover shadow-sm"
                      }, null, 8, ["src"])) : (openBlock(), createBlock("span", {
                        key: 1,
                        class: "bg-gray-100 rounded-full w-12 h-12 flex items-center justify-center"
                      }, [
                        createVNode("i", { class: "ti ti-user text-2xl text-gray-400" })
                      ])),
                      createTextVNode(),
                      createVNode("div", { class: "flex-1" }, [
                        createVNode("p", { class: "font-semibold text-base text-gray-800" }, toDisplayString(card.name), 1),
                        createTextVNode(),
                        card.description ? (openBlock(), createBlock("p", {
                          key: 0,
                          class: "text-sm text-gray-500"
                        }, toDisplayString(card.description), 1)) : createCommentVNode("", true)
                      ]),
                      createTextVNode(),
                      card.id === ((_a2 = selectedCard.value) == null ? void 0 : _a2.id) ? (openBlock(), createBlock("i", {
                        key: 2,
                        class: "ti ti-check text-green-600 text-xl"
                      })) : createCommentVNode("", true)
                    ], 8, ["onClick"]);
                  }), 128))
                ])
              ])) : (openBlock(), createBlock("p", {
                key: 2,
                class: "text-sm text-gray-500 text-center py-4 mb-6"
              }, "\r\n        \u06A9\u0627\u0631\u062A \u062F\u06CC\u06AF\u0631\u06CC \u0648\u062C\u0648\u062F \u0646\u062F\u0627\u0631\u062F\r\n      ")),
              createTextVNode(),
              createVNode("button", {
                onClick: goToAddCard,
                class: "w-full bg-gray-900 hover:bg-black text-white py-3 rounded-xl flex items-center justify-center gap-2 text-base font-medium transition-all duration-200 transform active:scale-[0.98] shadow-lg"
              }, [
                createVNode("i", { class: "ti ti-plus" }),
                createTextVNode(" \u0627\u06CC\u062C\u0627\u062F \u067E\u0631\u0648\u0641\u0627\u06CC\u0644 \u062C\u062F\u06CC\u062F\r\n      ")
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div>`);
    };
  }
});
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/UserDashboard/main/header/CardSelect.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "default",
  __ssrInlineRender: true,
  setup(__props) {
    const userStore = useUserStore();
    useAuthStore();
    const formStore = useFormStore();
    const { $axios } = useNuxtApp();
    const route = useRoute();
    const hasValidAuth = computed(() => {
      return false;
    });
    const pagesWithOwnHeader = computed(() => {
      return route.path.includes("/notifications") || route.path.includes("/inbox") || route.path.includes("/QR") || route.path.includes("/profile/CustomizeQRPage") || route.path.includes("/profile/CustomizeLinkPage") || route.path.includes("/profile/lead-capture") || route.path.includes("/dashboard/activate") || route.path.includes("/dashboard/support") || route.path.includes("/dashboard/transactions") || route.path.includes("/dashboard/rewards") || route.path.includes("/financial") || route.path.includes("/settings") || route.path.includes("/rewards");
    });
    const showBottomNav = computed(() => {
      return route.path === "/dashboard" || route.path === "/dashboard/";
    });
    const showModal = ref(false);
    const searchQuery = ref("");
    const getPageConfig = (routePath) => {
      var _a, _b, _c, _d, _e, _f, _g, _h, _i, _j, _k, _l, _m, _n;
      if (routePath.includes("/edit-card")) {
        return {
          title: "\u0648\u06CC\u0631\u0627\u06CC\u0634 \u067E\u0631\u0648\u0641\u0627\u06CC\u0644",
          showBack: true,
          userName: (_a = userStore.user) == null ? void 0 : _a.name,
          showSearch: false,
          showMore: true,
          showNotifications: false,
          showShare: true,
          showAddCard: false,
          showCardSelect: false,
          showStateSelect: false
        };
      }
      if (routePath.includes("/add-card")) {
        return {
          title: "\u0627\u0641\u0632\u0648\u062F\u0646 \u067E\u0631\u0648\u0641\u0627\u06CC\u0644 \u062C\u062F\u06CC\u062F",
          showBack: true,
          userName: (_b = userStore.user) == null ? void 0 : _b.name,
          showSearch: false,
          showMore: false,
          showNotifications: false,
          showShare: false,
          showAddCard: false,
          showCardSelect: false,
          showStateSelect: false
        };
      }
      const configs = {
        // صفحه فعال‌سازی کارت (باید قبل از /dashboard باشه)
        "/dashboard/activate": {
          title: "\u0641\u0639\u0627\u0644\u200C\u0633\u0627\u0632\u06CC \u06A9\u0627\u0631\u062A",
          showBack: true,
          userName: (_c = userStore.user) == null ? void 0 : _c.name,
          showSearch: false,
          showMore: false,
          showNotifications: false,
          showShare: false,
          showAddCard: false,
          showCardSelect: false,
          showStateSelect: false
        },
        // صفحه اصلی داشبورد 
        "/dashboard/dashboard": {
          title: "\u067E\u0631\u0648\u0641\u0627\u06CC\u0644\u200C\u0647\u0627\u06CC \u0645\u0646",
          showBack: false,
          userName: (_d = userStore.user) == null ? void 0 : _d.name,
          showSearch: true,
          showMore: true,
          showNotifications: true,
          showShare: false,
          showAddCard: true,
          showCardSelect: true,
          showStateSelect: false
        },
        // صفحه تحلیل‌ها
        "/dashboard/insights": {
          title: "\u062A\u062D\u0644\u06CC\u0644 \u0648 \u0622\u0645\u0627\u0631",
          showBack: true,
          userName: (_e = userStore.user) == null ? void 0 : _e.name,
          showSearch: false,
          showMore: false,
          showNotifications: true,
          showShare: false,
          showAddCard: false,
          showCardSelect: true,
          showStateSelect: false
        },
        // صفحه نوتیفیکیشن‌ها
        "/dashboard/notifications": {
          title: "\u0627\u0639\u0644\u0627\u0646\u200C\u0647\u0627",
          showBack: true,
          userName: (_f = userStore.user) == null ? void 0 : _f.name,
          showSearch: false,
          showMore: false,
          showNotifications: false,
          showShare: false,
          showAddCard: false,
          showCardSelect: false,
          showStateSelect: false
        },
        // صفحه پشتیبانی
        "/dashboard/support": {
          title: "\u067E\u0634\u062A\u06CC\u0628\u0627\u0646\u06CC",
          showBack: true,
          userName: (_g = userStore.user) == null ? void 0 : _g.name,
          showSearch: false,
          showMore: false,
          showNotifications: false,
          showShare: false,
          showAddCard: false,
          showCardSelect: false,
          showStateSelect: false
        },
        // صفحه تراکنش‌ها
        "/dashboard/transactions": {
          title: "\u062A\u0631\u0627\u06A9\u0646\u0634\u200C\u0647\u0627",
          showBack: true,
          userName: (_h = userStore.user) == null ? void 0 : _h.name,
          showSearch: false,
          showMore: false,
          showNotifications: false,
          showShare: false,
          showAddCard: false,
          showCardSelect: false,
          showStateSelect: true
        },
        // صفحه خرید اشتراک
        "/dashboard/upgrade": {
          title: "\u062E\u0631\u06CC\u062F \u0627\u0634\u062A\u0631\u0627\u06A9",
          showBack: true,
          userName: (_i = userStore.user) == null ? void 0 : _i.name,
          showSearch: false,
          showMore: false,
          showNotifications: false,
          showShare: false,
          showAddCard: false,
          showCardSelect: false,
          showStateSelect: false
        },
        // صفحه اصلی (root dashboard) - باید آخر باشه
        "/dashboard": {
          title: "\u067E\u0631\u0648\u0641\u0627\u06CC\u0644\u200C\u0647\u0627\u06CC \u0645\u0646",
          showBack: false,
          userName: (_j = userStore.user) == null ? void 0 : _j.name,
          showSearch: true,
          showMore: true,
          showNotifications: true,
          showShare: false,
          showAddCard: true,
          showCardSelect: true,
          showStateSelect: false
        },
        // صفحه تنظیمات
        "/settings": {
          title: "\u062A\u0646\u0638\u06CC\u0645\u0627\u062A",
          showBack: true,
          userName: (_k = userStore.user) == null ? void 0 : _k.name,
          showSearch: false,
          showMore: false,
          showNotifications: false,
          showShare: false,
          showAddCard: false,
          showCardSelect: false,
          showStateSelect: false
        },
        // صفحه صندوق دریافتی
        "/inbox": {
          title: "\u0635\u0646\u062F\u0648\u0642 \u062F\u0631\u06CC\u0627\u0641\u062A\u06CC",
          showBack: true,
          userName: (_l = userStore.user) == null ? void 0 : _l.name,
          showSearch: false,
          showMore: false,
          showNotifications: false,
          showShare: false,
          showAddCard: false,
          showCardSelect: false,
          showStateSelect: false
        },
        // صفحه وضعیت حساب
        "/settings/account-status": {
          title: "\u0648\u0636\u0639\u06CC\u062A \u062D\u0633\u0627\u0628",
          showBack: true,
          userName: (_m = userStore.user) == null ? void 0 : _m.name,
          showSearch: false,
          showMore: false,
          showNotifications: false,
          showShare: false,
          showAddCard: false,
          showCardSelect: false,
          showStateSelect: false
        }
      };
      for (const [path, config] of Object.entries(configs)) {
        if (routePath.startsWith(path)) {
          return config;
        }
      }
      return {
        title: "\u062F\u0627\u0634\u0628\u0648\u0631\u062F",
        showBack: false,
        userName: (_n = userStore.user) == null ? void 0 : _n.name,
        showSearch: false,
        showMore: true,
        showNotifications: true,
        showShare: false,
        showAddCard: false,
        showCardSelect: false,
        showStateSelect: false
      };
    };
    const topbarConfig = computed(() => getPageConfig(route.path));
    route.params.slug;
    const selectedCard = ref({});
    function openShareModal(card) {
      selectedCard.value = card;
      showModal.value = true;
    }
    const handleAction = (action) => {
      var _a;
      switch (action) {
        case "show-profile":
          showProfile((_a = formStore.defaultCard) == null ? void 0 : _a.slug);
          break;
        case "open-share":
          openShareModal(formStore.defaultCard);
          break;
      }
    };
    const showProfile = (slug2) => {
      const params = new URLSearchParams();
      params.set("t", Date.now().toString());
      const url = `${(void 0).location.origin}/preview/${slug2}?${params.toString()}`;
      (void 0).open(url, "_blank");
    };
    provide("topbarConfig", topbarConfig);
    return (_ctx, _push, _parent, _attrs) => {
      var _a, _b, _c, _d;
      const _component_ClientOnly = __nuxt_component_0$3;
      if (hasValidAuth.value) {
        _push(`<div${ssrRenderAttrs(mergeProps({ class: "flex bg-background min-h-screen overflow-hidden transition-colors duration-300" }, _attrs))}>`);
        _push(ssrRenderComponent(_component_ClientOnly, null, {}, _parent));
        _push(` <div class="flex-1 flex flex-col relative">`);
        if (!pagesWithOwnHeader.value) {
          _push(ssrRenderComponent(_sfc_main$9, null, null, _parent));
        } else {
          _push(`<!---->`);
        }
        _push(` `);
        _push(ssrRenderComponent(Topbar, mergeProps(topbarConfig.value, {
          search: searchQuery.value,
          "onUpdate:search": ($event) => searchQuery.value = $event,
          userLogo: ((_a = unref(userStore).user) == null ? void 0 : _a.avatar) || "",
          userPhone: unref(userStore).user.phone || "",
          cardSlug: (_b = unref(formStore).defaultCard) == null ? void 0 : _b.slug,
          qrBgColor: (_c = unref(formStore).defaultCard) == null ? void 0 : _c.qrBgColor,
          qrColor: (_d = unref(formStore).defaultCard) == null ? void 0 : _d.qrColor,
          onOpenShare: openShareModal,
          onAction: handleAction
        }), {
          "card-select": withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(ssrRenderComponent(_component_ClientOnly, null, {}, _parent2, _scopeId));
            } else {
              return [
                createVNode(_component_ClientOnly, null, {
                  default: withCtx(() => [
                    createVNode(_sfc_main$1)
                  ]),
                  _: 1
                })
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(` <div class="${ssrRenderClass([[
          pagesWithOwnHeader.value ? "pt-0" : "pt-20",
          showBottomNav.value ? "pb-20" : "pb-0",
          unref(route).path.includes("/checkout") || !showBottomNav.value ? "" : "lg:px-4 px-2"
        ], "flex-1 overflow-y-auto lg:pb-4"])}">`);
        ssrRenderSlot(_ctx.$slots, "default", {
          search: searchQuery.value,
          onOpenShare: openShareModal
        }, null, _push, _parent);
        _push(`</div> `);
        if (showBottomNav.value) {
          _push(ssrRenderComponent(BottomNavigation, {
            onOpenShare: ($event) => openShareModal(unref(formStore).defaultCard)
          }, null, _parent));
        } else {
          _push(`<!---->`);
        }
        _push(`</div> `);
        _push(ssrRenderComponent(_sfc_main$7, {
          visible: showModal.value,
          card: selectedCard.value,
          onClose: ($event) => showModal.value = false
        }, null, _parent));
        _push(`</div>`);
      } else {
        _push(`<!---->`);
      }
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("layouts/default.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=default-BJee_2Dc.mjs.map
