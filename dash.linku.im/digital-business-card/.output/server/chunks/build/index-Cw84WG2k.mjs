import { _ as __nuxt_component_0$3 } from './server.mjs';
import { ref, computed, useSSRContext } from 'vue';
import { ssrRenderComponent } from 'vue/server-renderer';
import { u as useNotificationStore } from './notification-z7zNtY-X.mjs';
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

const _sfc_main = {
  __name: "index",
  __ssrInlineRender: true,
  setup(__props) {
    const notificationStore = useNotificationStore();
    const selectedCategory = ref("all");
    computed(() => notificationStore.loading);
    computed(() => {
      return notificationStore.notifications;
    });
    computed(() => {
      const all = notificationStore.notifications;
      if (selectedCategory.value === "all") {
        return all;
      } else if (selectedCategory.value === "unread") {
        return all.filter((n) => !n.read);
      } else {
        return all.filter((n) => n.type === selectedCategory.value);
      }
    });
    computed(() => {
      return notificationStore.notifications.length;
    });
    computed(() => {
      return notificationStore.notifications.filter((n) => !n.read).length;
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_ClientOnly = __nuxt_component_0$3;
      _push(ssrRenderComponent(_component_ClientOnly, _attrs, {}, _parent));
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/dashboard/notifications/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const index = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-9238259e"]]);

export { index as default };
//# sourceMappingURL=index-Cw84WG2k.mjs.map
