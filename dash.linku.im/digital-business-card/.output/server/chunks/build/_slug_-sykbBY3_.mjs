import { ref, withAsyncContext, computed, watch, unref, defineComponent, createVNode, resolveDynamicComponent, withCtx, createTextVNode, withDirectives, vModelRadio, vModelText, mergeProps, markRaw, useSSRContext } from 'vue';
import { ssrRenderComponent, ssrRenderAttr, ssrRenderStyle, ssrRenderClass, ssrInterpolate, ssrRenderList, ssrRenderVNode, ssrIncludeBooleanAttr, ssrLooseEqual, ssrRenderAttrs } from 'vue/server-renderer';
import { u as useAsyncData, a as _imports_0, b as _sfc_main$2, _ as _imports_1, P as PreviewItems, c as _sfc_main$6, d as _sfc_main$5 } from './LayoutLeadForm-D8SArOk-.mjs';
import { u as useFormStore } from './form-CUJQskNk.mjs';
import { u as useToast } from './useToast-D_iChEHW.mjs';
import { u as useIconComponents } from './useIconComponentsMap-DPTCqB5g.mjs';
import { _ as __nuxt_component_0 } from './BottomSheet-DZASh2SV.mjs';
import { f as useRoute, a as useNuxtApp, g as useRuntimeConfig, h as useSeoMeta, d as useHead } from './server.mjs';
import { I as InfoToast } from './InfoToast-DdxwJ7kO.mjs';
import { _ as _export_sfc } from './_plugin-vue_export-helper-1tPrXgE0.mjs';
import '../routes/renderer.mjs';
import 'vue-bundle-renderer/runtime';
import '../_/nitro.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import 'node:url';
import 'unhead/server';
import 'unhead/plugins';
import 'unhead/utils';
import 'canvas-confetti';
import './interval-plzJUXXs.mjs';
import 'pinia';
import 'vue-router';
import 'axios';

const _sfc_main$1 = /* @__PURE__ */ defineComponent({
  __name: "LayoutSingle",
  __ssrInlineRender: true,
  setup(__props) {
    const formStore = useFormStore();
    const { getIconComponent } = useIconComponents();
    const activeLink = computed(() => {
      const links = formStore.links || [];
      return links.length > 0 ? links[0] : null;
    });
    const iconData = computed(() => {
      var _a;
      return ((_a = activeLink.value) == null ? void 0 : _a.icon) || null;
    });
    const iconComponent = computed(() => {
      if (!iconData.value) return null;
      if (typeof iconData.value === "string") {
        return getIconComponent(iconData.value);
      }
      if (typeof iconData.value === "object" && "name" in iconData.value) {
        return getIconComponent(iconData.value.name);
      }
      return getIconComponent("link");
    });
    const iconColor = computed(() => {
      return formStore.iconColor || { background: "#000000", text: "#ffffff" };
    });
    function getBackgroundOpacity(color) {
      if (!color || color === "transparent") return 0.05;
      let r, g, b;
      if (color.startsWith("#")) {
        const hex = color.slice(1);
        r = parseInt(hex.slice(0, 2), 16);
        g = parseInt(hex.slice(2, 4), 16);
        b = parseInt(hex.slice(4, 6), 16);
      } else if (color.startsWith("rgb")) {
        const rgbMatch = color.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*[\d.]+)?\)/);
        if (rgbMatch) {
          [, r, g, b] = rgbMatch.map(Number);
        } else {
          return 0.05;
        }
      } else {
        return 0.05;
      }
      const brightness = (r * 299 + g * 587 + b * 114) / 1e3;
      if (color === "#000000" || brightness < 30) {
        return 0.02;
      } else if (brightness < 100) {
        return 0.1;
      } else if (brightness < 150) {
        return 0.15;
      } else {
        return 0.3;
      }
    }
    const displayTitle = computed(() => {
      const link = activeLink.value;
      if (!link) return "\u0644\u06CC\u0646\u06A9";
      if (link.title && link.title.trim()) {
        return link.title.trim();
      }
      if (link.action) {
        const actionNames = {
          "call": "\u062A\u0645\u0627\u0633",
          "sms": "\u067E\u06CC\u0627\u0645\u06A9",
          "email": "\u0627\u06CC\u0645\u06CC\u0644",
          "website": "\u0648\u0628\u200C\u0633\u0627\u06CC\u062A",
          "instagram": "\u0627\u06CC\u0646\u0633\u062A\u0627\u06AF\u0631\u0627\u0645",
          "telegram": "\u062A\u0644\u06AF\u0631\u0627\u0645",
          "whatsapp": "\u0648\u0627\u062A\u0633\u0627\u067E",
          "linkedin": "\u0644\u06CC\u0646\u06A9\u062F\u06CC\u0646",
          "twitter": "\u062A\u0648\u06CC\u06CC\u062A\u0631",
          "facebook": "\u0641\u06CC\u0633\u0628\u0648\u06A9",
          "youtube": "\u06CC\u0648\u062A\u06CC\u0648\u0628"
        };
        return actionNames[link.action] || "\u0644\u06CC\u0646\u06A9";
      }
      return "\u0644\u06CC\u0646\u06A9";
    });
    return (_ctx, _push, _parent, _attrs) => {
      var _a;
      _push(`<div${ssrRenderAttrs(mergeProps({
        style: {
          backgroundColor: unref(formStore).themeColor.background || "#fff"
        },
        class: "w-full h-full absolute bg-gradient-to-br from-white to-gray-100 flex items-center justify-center cursor-pointer transition-all duration-200"
      }, _attrs))}><div class="absolute inset-0 z-0" style="${ssrRenderStyle({
        backgroundColor: unref(formStore).themeColor.background || "#ffffff",
        opacity: getBackgroundOpacity(unref(formStore).themeColor.background)
      })}"></div> <div class="flex flex-col items-center space-y-4 z-10 text-center"><div class="w-28 h-28 rounded-2xl flex items-center justify-center" style="${ssrRenderStyle({ backgroundColor: iconColor.value.background, color: iconColor.value.text })}">`);
      if (iconComponent.value) {
        ssrRenderVNode(_push, createVNode(resolveDynamicComponent(iconComponent.value), { class: "w-20 h-20 text-current" }, null), _parent);
      } else if ((_a = activeLink.value) == null ? void 0 : _a.customIcon) {
        _push(`<img${ssrRenderAttr("src", activeLink.value.customIcon)} class="w-16 h-16 object-cover rounded-lg" alt="custom icon">`);
      } else {
        _push(`<i class="ti ti-link text-blue-500 text-4xl"></i>`);
      }
      _push(`</div> <div class="text-xl font-bold text-gray-800 max-w-xs text-center">${ssrInterpolate(displayTitle.value)}</div></div></div>`);
    };
  }
});
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/UserDashboard/main/EditCard/Preview/layouts/LayoutSingle.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const _sfc_main = {
  __name: "[slug]",
  __ssrInlineRender: true,
  async setup(__props) {
    let __temp, __restore;
    const showToast = ref(false);
    const toastMessage = ref("");
    const toastIcon = ref("ti-alert-triangle");
    const showInfoToast = (message, icon = "ti-lock") => {
      toastMessage.value = message;
      toastIcon.value = icon;
      showToast.value = true;
      setTimeout(() => showToast.value = false, 3e3);
    };
    const isLoading = ref(true);
    const formData = useFormStore();
    const route = useRoute();
    const cardId = route.query.cardId;
    const slug = route.params.slug;
    const isDefault = route.query.isDefault;
    const { $axios } = useNuxtApp();
    const runtimeConfig = useRuntimeConfig();
    const apiBase = runtimeConfig.public.apiBase || "https://api.linku.im";
    const urlPrefix = `${apiBase}/api/cards`;
    const { data: card } = ([__temp, __restore] = withAsyncContext(async () => useAsyncData("card", async () => {
      return await $fetch(`${urlPrefix}/${slug}/preview`, { method: "GET" });
    })), __temp = await __temp, __restore(), __temp);
    const generateMetaTags = () => {
      var _a;
      const data = ((_a = card.value) == null ? void 0 : _a.data) || {};
      const title = data.userName ? `${data.userName} - \u067E\u0631\u0648\u0641\u0627\u06CC\u0644 \u0644\u06CC\u0646\u06A9\u0648` : "\u067E\u0631\u0648\u0641\u0627\u06CC\u0644 \u0634\u062E\u0635\u06CC - \u0644\u06CC\u0646\u06A9\u0648";
      const description = data.bio;
      let image = data.avatar || "https://linku.im/logo/logo.png";
      if (image.startsWith("http://localhost:8000")) {
        image = image.replace("http://localhost:8000", "https://linku.im");
      } else if (image.startsWith("https://api.linku.im")) {
        image = image.replace("https://api.linku.im", "https://linku.im");
      }
      const themeColor = data.themeColor || "";
      const location = data.location || "";
      const url = `https://linku.im${route.fullPath}`;
      return { title, description, image, location, themeColor, url };
    };
    const metaTags = computed(() => generateMetaTags());
    watch(card, (val) => {
      if (val == null ? void 0 : val.data) ;
    });
    useSeoMeta({
      title: () => metaTags.value.title,
      ogTitle: () => metaTags.value.title,
      description: () => metaTags.value.description,
      ogDescription: () => metaTags.value.description,
      ogImage: () => `${metaTags.value.image || "https://linku.im/logo/logo.png"}`,
      ogUrl: () => metaTags.value.url,
      ogType: "profile",
      ogSiteName: "\u0644\u06CC\u0646\u06A9\u0648 - Linku.im",
      twitterCard: "summary_large_image",
      twitterTitle: () => metaTags.value.title,
      twitterDescription: () => metaTags.value.description,
      twitterImage: () => `${metaTags.value.image || "https://linku.im/logo/logo.png"}`,
      twitterCreator: "@linku.im",
      twitterSite: "@linku.im",
      robots: "index, follow",
      googlebot: "index, follow",
      author: () => metaTags.value.title || "linku.im User",
      creator: () => metaTags.value.title || "linku.im User",
      publisher: "linku.im",
      applicationName: "linku.im",
      referrer: "origin-when-cross-origin",
      formatDetection: "telephone=no",
      viewport: "width=device-width, initial-scale=1, maximum-scale=5",
      colorScheme: "light dark",
      themeColor: () => {
        var _a;
        return ((_a = metaTags.value.themeColor) == null ? void 0 : _a.background) || "#000000";
      }
    });
    useHead({
      htmlAttrs: {
        lang: "fa",
        dir: "rtl"
      },
      meta: [
        { name: "geo.region", content: "IR" },
        { name: "geo.country", content: "Iran" },
        { name: "geo.placename", content: () => (formData == null ? void 0 : formData.location) || "\u062A\u0647\u0631\u0627\u0646" },
        { name: "ICBM", content: "35.6892,51.3890" },
        { name: "msapplication-TileColor", content: () => {
          var _a;
          return ((_a = metaTags.value.themeColor) == null ? void 0 : _a.background) || "#000000";
        } },
        { name: "apple-mobile-web-app-capable", content: "yes" },
        { name: "apple-mobile-web-app-status-bar-style", content: "default" },
        { name: "apple-mobile-web-app-title", content: () => metaTags.value.title },
        { name: "mobile-web-app-capable", content: "yes" },
        { name: "HandheldFriendly", content: "true" },
        { name: "MobileOptimized", content: "320" },
        { name: "rating", content: "general" },
        { name: "distribution", content: "global" },
        { name: "coverage", content: "worldwide" },
        { name: "target", content: "all" },
        { name: "audience", content: "all" },
        { name: "revisit-after", content: "7 days" },
        { name: "owner", content: () => metaTags.value.name || "linku.im User" },
        { name: "url", content: () => metaTags.value.url },
        { name: "identifier-URL", content: () => metaTags.value.url },
        { name: "directory", content: "submission" },
        { name: "category", content: "business" },
        { name: "coverage", content: "worldwide" },
        { name: "distribution", content: "global" },
        { name: "rating", content: "general" },
        { name: "spiders", content: "all" },
        { name: "robots", content: "all" },
        { name: "googlebot", content: "all" },
        { name: "bingbot", content: "all" },
        { name: "slurp", content: "all" },
        { name: "msnbot", content: "all" },
        // LinkedIn specific
        { property: "profile:first_name", content: () => {
          var _a;
          return ((_a = metaTags.value.name) == null ? void 0 : _a.split(" ")[0]) || "";
        } },
        { property: "profile:last_name", content: () => {
          var _a;
          return ((_a = metaTags.value.name) == null ? void 0 : _a.split(" ").slice(1).join(" ")) || "";
        } },
        { property: "profile:username", content: () => {
          var _a;
          return ((_a = metaTags.value.name) == null ? void 0 : _a.toLowerCase().replace(/\s+/g, "")) || "user";
        } },
        // Article meta for better SEO
        { property: "article:author", content: () => metaTags.value.name || "linku.im User" },
        { property: "article:publisher", content: "https://www.facebook.com/linku.im" },
        { property: "article:section", content: "Profile" },
        { property: "article:tag", content: "profile, business card, links, social media" },
        // Facebook App ID
        { property: "fb:app_id", content: "123456789" },
        // Replace with your actual Facebook App ID
        // Additional OG properties
        { property: "og:locale", content: "fa_IR" },
        { property: "og:locale:alternate", content: "en_US" },
        { property: "business:contact_data:street_address", content: () => {
          var _a;
          return ((_a = metaTags.value) == null ? void 0 : _a.location) || "";
        } },
        { property: "business:contact_data:locality", content: "\u062A\u0647\u0631\u0627\u0646" },
        { property: "business:contact_data:region", content: "\u062A\u0647\u0631\u0627\u0646" },
        { property: "business:contact_data:postal_code", content: "1234567890" },
        { property: "business:contact_data:country_name", content: "\u0627\u06CC\u0631\u0627\u0646" }
      ],
      link: [
        { rel: "canonical", href: () => metaTags.value.url },
        { rel: "alternate", hreflang: "fa", href: () => metaTags.value.url },
        { rel: "alternate", hreflang: "en", href: () => metaTags.value.url.replace("/fa/", "/en/") },
        { rel: "alternate", hreflang: "x-default", href: () => metaTags.value.url },
        { rel: "author", href: () => metaTags.value.url },
        { rel: "publisher", href: "https://linku.im" },
        { rel: "me", href: () => metaTags.value.url },
        { rel: "bookmark", href: () => metaTags.value.url },
        { rel: "shortlink", href: () => metaTags.value.url },
        // Profile image preload
        { rel: "preload", as: "image", href: () => `${metaTags.value.image || "https://linku.im/logo/logo.png"}` },
        // DNS prefetch for performance
        { rel: "dns-prefetch", href: "//fonts.googleapis.com" },
        { rel: "dns-prefetch", href: "//cdn.jsdelivr.net" },
        { rel: "preconnect", href: "https://fonts.googleapis.com" },
        { rel: "preconnect", href: "https://fonts.gstatic.com", crossorigin: "anonymous" }
      ]
      // script: [
      //   {
      //     type: 'application/ld+json',
      //     children: () => JSON.stringify(generateStructuredData())
      //   }
      // ]
    });
    const enableBlueTick = ref(false);
    const { success, error, info } = useToast();
    const showReportModal = ref(false);
    const showOptionsMenu = ref(false);
    const showShareModal = ref(false);
    const reportType = ref("");
    const reportDescription = ref("");
    const handleLinkClick = async (item) => {
      if (!isDefault) {
        try {
          await $axios.post(`links/${item.hash}/recordClick`, {
            slug
            // اگه بک‌اند لازم داره
          });
        } catch (error2) {
        }
      }
    };
    const closeLeadCapture = () => {
      formData.isLeadCaptureEnabled = false;
    };
    const isDarkTheme = computed(() => {
      var _a;
      return ((_a = formData.themeColor) == null ? void 0 : _a.background) === "#000000";
    });
    const isLightTheme = computed(() => {
      var _a, _b;
      return ((_a = formData.themeColor) == null ? void 0 : _a.background) === "#ffffff" || ((_b = formData.themeColor) == null ? void 0 : _b.background) === "#FFFFFF";
    });
    function isColorDark(hex) {
      if (!hex || hex === "transparent") return false;
      const r = parseInt(hex.slice(1, 3), 16);
      const g = parseInt(hex.slice(3, 5), 16);
      const b = parseInt(hex.slice(5, 7), 16);
      const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
      return luminance < 0.5;
    }
    const isBackgroundDark = computed(() => {
      var _a;
      return isColorDark((_a = formData.themeColor) == null ? void 0 : _a.background);
    });
    computed(() => {
      const banners = Array.from({ length: 20 }, (_, i) => `banner-${i + 1}.jpg`);
      let seed = 1;
      if (iconBg.value && iconBg.value !== "transparent") {
        const hex = iconBg.value.replace("#", "");
        seed = parseInt(hex.substring(0, 6), 16) % banners.length;
      }
      return `/header/${banners[seed]}`;
    });
    const iconBg = computed(() => {
      var _a;
      return !((_a = formData.iconColor) == null ? void 0 : _a.background) || formData.iconColor.background === "transparent" ? "#000000" : formData.iconColor.background;
    });
    const iconText = computed(() => isDarkTheme.value ? "#ffffff" : "#000000");
    const iconColor = computed(() => isDarkTheme.value ? "#fff" : "#222");
    const iconShadow = computed(() => {
      const rgba = hexToRgba(iconBg.value, 0.4);
      return rgba;
    });
    function hexToRgba(hex, alpha) {
      if (!hex || hex === "transparent") return `rgba(0, 0, 0, ${alpha})`;
      const r = parseInt(hex.slice(1, 3), 16);
      const g = parseInt(hex.slice(3, 5), 16);
      const b = parseInt(hex.slice(5, 7), 16);
      return `rgba(${r}, ${g}, ${b}, ${alpha})`;
    }
    function getLighterColor(color) {
      if (!color || color === "transparent") return "rgba(255, 255, 255, 0.05)";
      let r, g, b;
      if (color.startsWith("#")) {
        const hex = color.slice(1);
        r = parseInt(hex.slice(0, 2), 16);
        g = parseInt(hex.slice(2, 4), 16);
        b = parseInt(hex.slice(4, 6), 16);
      } else if (color.startsWith("rgb")) {
        const rgbMatch = color.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*[\d.]+)?\)/);
        if (rgbMatch) {
          [, r, g, b] = rgbMatch.map(Number);
        } else {
          return "rgba(255, 255, 255, 0.05)";
        }
      } else {
        return "rgba(255, 255, 255, 0.05)";
      }
      const brightness = (r * 299 + g * 587 + b * 114) / 1e3;
      if (color === "#000000" || brightness < 30) {
        return `rgba(${r}, ${g}, ${b}, 0.92)`;
      } else if (brightness < 100) {
        return `rgba(${r}, ${g}, ${b}, 0.85)`;
      } else if (brightness < 150) {
        return `rgba(${r}, ${g}, ${b}, 0.3)`;
      } else {
        const lighterR = Math.min(255, r + Math.floor((255 - r) * 0.7));
        const lighterG = Math.min(255, g + Math.floor((255 - g) * 0.7));
        const lighterB = Math.min(255, b + Math.floor((255 - b) * 0.7));
        return `rgba(${lighterR}, ${lighterG}, ${lighterB}, 0.8)`;
      }
    }
    function getComponent(item) {
      try {
        if (!item) return markRaw("div");
        if (item.action && PreviewItems[item.action]) {
          return markRaw(PreviewItems[item.action]);
        }
        return markRaw(item.type === "block" ? _sfc_main$6 : _sfc_main$5);
      } catch {
        return markRaw("div");
      }
    }
    function getIsListMode(item) {
      const isPortrait = formData.layout === "portrait";
      const isSpecialAction = ["poll", "expandabletext", "questionbox", "textsection", "workhours", "map", "file", "embeddedvideo", "image", "video", "audio", "document"].includes(item.action);
      const hasDescriptionEnabled = item.showDescription === true;
      return !!(isPortrait || isSpecialAction || hasDescriptionEnabled);
    }
    const groupedItems = computed(() => {
      if (!formData.links) return [];
      if (formData.layout === "portrait" || formData.layout === "center") {
        return [{ type: "list", items: formData.links.filter((item) => item.enabled) }];
      }
      const groups = [];
      let currentGroup = null;
      formData.links.forEach((item) => {
        if (!item.enabled) return;
        const isListItem = getIsListMode(item);
        if (!currentGroup || currentGroup.type !== (isListItem ? "list" : "grid")) {
          currentGroup = { type: isListItem ? "list" : "grid", items: [] };
          groups.push(currentGroup);
        }
        currentGroup.items.push(item);
      });
      return groups;
    });
    const shareToTelegram = () => {
      const text = `\u067E\u0631\u0648\u0641\u0627\u06CC\u0644 ${formData.name || "\u06A9\u0627\u0631\u0628\u0631"} \u0631\u0627 \u062F\u0631 \u0644\u06CC\u0646\u06A9\u0648 \u0645\u0634\u0627\u0647\u062F\u0647 \u06A9\u0646\u06CC\u062F: ${(void 0).location.href}`;
      const url = `https://t.me/share/url?url=${encodeURIComponent((void 0).location.href)}&text=${encodeURIComponent(text)}`;
      (void 0).open(url, "_blank");
      showShareModal.value = false;
      success("\u0647\u062F\u0627\u06CC\u062A \u0628\u0647 \u062A\u0644\u06AF\u0631\u0627\u0645...");
    };
    const shareToWhatsApp = () => {
      const text = `\u067E\u0631\u0648\u0641\u0627\u06CC\u0644 ${formData.name || "\u06A9\u0627\u0631\u0628\u0631"} \u0631\u0627 \u062F\u0631 \u0644\u06CC\u0646\u06A9\u0648 \u0645\u0634\u0627\u0647\u062F\u0647 \u06A9\u0646\u06CC\u062F: ${(void 0).location.href}`;
      const url = `https://wa.me/?text=${encodeURIComponent(text)}`;
      (void 0).open(url, "_blank");
      showShareModal.value = false;
      success("\u0647\u062F\u0627\u06CC\u062A \u0628\u0647 \u0648\u0627\u062A\u0633\u0627\u067E...");
    };
    const shareToInstagram = () => {
      copyLink();
      info("\u0644\u06CC\u0646\u06A9 \u06A9\u067E\u06CC \u0634\u062F - \u062F\u0631 \u0627\u06CC\u0646\u0633\u062A\u0627\u06AF\u0631\u0627\u0645 paste \u06A9\u0646\u06CC\u062F");
    };
    const shareToLinkedIn = () => {
      const url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent((void 0).location.href)}`;
      (void 0).open(url, "_blank");
      showShareModal.value = false;
      success("\u0647\u062F\u0627\u06CC\u062A \u0628\u0647 \u0644\u06CC\u0646\u06A9\u062F\u06CC\u0646...");
    };
    const shareToX = () => {
      const text = `\u067E\u0631\u0648\u0641\u0627\u06CC\u0644 ${formData.name || "\u06A9\u0627\u0631\u0628\u0631"} \u0631\u0627 \u062F\u0631 \u0644\u06CC\u0646\u06A9\u0648 \u0645\u0634\u0627\u0647\u062F\u0647 \u06A9\u0646\u06CC\u062F`;
      const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent((void 0).location.href)}`;
      (void 0).open(url, "_blank");
      showShareModal.value = false;
      success("\u0647\u062F\u0627\u06CC\u062A \u0628\u0647 \u0627\u06CC\u06A9\u0633...");
    };
    const copyLink = async () => {
      try {
        if ((void 0).clipboard && (void 0).isSecureContext) {
          await (void 0).clipboard.writeText((void 0).location.href);
          showShareModal.value = false;
          return;
        }
        const textArea = (void 0).createElement("textarea");
        textArea.value = (void 0).location.href;
        textArea.style.position = "fixed";
        textArea.style.left = "-999999px";
        textArea.style.top = "-999999px";
        (void 0).body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        const successful = (void 0).execCommand("copy");
        (void 0).body.removeChild(textArea);
        if (successful) {
          showShareModal.value = false;
        }
      } catch (error2) {
        showShareModal.value = false;
      }
    };
    const submitReport = () => {
      if (!reportType.value) {
        error("\u0644\u0637\u0641\u0627\u064B \u0646\u0648\u0639 \u06AF\u0632\u0627\u0631\u0634 \u0631\u0627 \u0627\u0646\u062A\u062E\u0627\u0628 \u06A9\u0646\u06CC\u062F");
        return;
      }
      ({
        type: reportType.value,
        description: reportDescription.value,
        url: (void 0).location.href,
        timestamp: (/* @__PURE__ */ new Date()).toISOString()
      });
      success("\u06AF\u0632\u0627\u0631\u0634 \u0634\u0645\u0627 \u0628\u0627 \u0645\u0648\u0641\u0642\u06CC\u062A \u0627\u0631\u0633\u0627\u0644 \u0634\u062F");
      showReportModal.value = false;
      reportType.value = "";
      reportDescription.value = "";
    };
    return (_ctx, _push, _parent, _attrs) => {
      var _a, _b, _c, _d, _e, _f, _g, _h, _i, _j, _k, _l, _m, _n, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y, _z, _A, _B, _C, _D, _E, _F, _G, _H, _I, _J, _K, _L, _M, _N, _O, _P, _Q, _R, _S, _T, _U, _V, _W;
      if (!isLoading.value) {
        _push(`<div data-v-18fe3592>`);
        _push(ssrRenderComponent(InfoToast, {
          visible: showToast.value,
          message: toastMessage.value,
          icon: toastIcon.value
        }, null, _parent));
        _push(` `);
        if ((_a = unref(formData)) == null ? void 0 : _a.singleLink) {
          _push(ssrRenderComponent(_sfc_main$1, null, null, _parent));
        } else {
          _push(`<div class="w-full h-screen flex flex-col overflow-hidden relative scrollbar-hide"${ssrRenderAttr("dir", ((_b = unref(formData)) == null ? void 0 : _b.layout) === "left" ? "ltr" : "rtl")} data-v-18fe3592><div class="absolute inset-0 w-full h-full pointer-events-none" style="${ssrRenderStyle({ backgroundColor: getLighterColor((_e = (_d = (_c = unref(formData)) == null ? void 0 : _c.themeColor) == null ? void 0 : _d.background) != null ? _e : "#ffffff"), zIndex: 0, transition: "background-color 0.3s" })}" data-v-18fe3592></div> <div class="fixed top-0 left-0 right-0 z-50 pointer-events-none" data-v-18fe3592><div class="absolute top-4 ltr:right-4 rtl:left-4 pointer-events-auto" data-v-18fe3592><button type="button" class="w-10 h-10 rounded-full flex items-center justify-center text-white transition-all duration-300 shadow-lg" style="${ssrRenderStyle({
            backgroundColor: ((_g = (_f = unref(formData)) == null ? void 0 : _f.themeColor) == null ? void 0 : _g.background) || "#3b82f6",
            opacity: 0.95
          })}" data-v-18fe3592><i class="ti ti-dots-vertical text-lg" data-v-18fe3592></i></button> <div style="${ssrRenderStyle([
            showOptionsMenu.value ? null : { display: "none" },
            {
              borderColor: ((_i = (_h = unref(formData)) == null ? void 0 : _h.themeColor) == null ? void 0 : _i.background) || "#3b82f6",
              borderWidth: "2px"
            }
          ])}" class="absolute top-12 ltr:right-0 rtl:left-0 bg-white rounded-xl shadow-2xl border py-2 min-w-[160px] z-30" data-v-18fe3592><button type="button" class="w-full text-right px-4 py-3 hover:opacity-90 flex items-center gap-3 transition-all duration-200 font-medium" style="${ssrRenderStyle({
            color: ((_k = (_j = unref(formData)) == null ? void 0 : _j.themeColor) == null ? void 0 : _k.background) || "#3b82f6"
          })}" data-v-18fe3592><i class="ti ti-share text-lg" data-v-18fe3592></i>
                \u0627\u0634\u062A\u0631\u0627\u06A9\u200C\u06AF\u0630\u0627\u0631\u06CC
              </button> <button type="button" class="w-full text-right px-4 py-3 hover:opacity-90 flex items-center gap-3 transition-all duration-200 font-medium" style="${ssrRenderStyle({
            color: ((_m = (_l = unref(formData)) == null ? void 0 : _l.themeColor) == null ? void 0 : _m.background) || "#3b82f6"
          })}" data-v-18fe3592><i class="ti ti-flag text-lg" data-v-18fe3592></i>
                \u06AF\u0632\u0627\u0631\u0634 \u0645\u062D\u062A\u0648\u0627
              </button></div></div></div> <div class="relative z-10 flex-1 pb-8 overflow-auto scrollbar-hide" data-v-18fe3592><div class="${ssrRenderClass([
            "relative w-full bg-gray-200 bg-cover bg-center",
            ((_n = unref(formData)) == null ? void 0 : _n.layout) === "portrait" ? "h-60" : "h-40"
          ])}" data-v-18fe3592>`);
          if ((_o = unref(formData)) == null ? void 0 : _o.coverImage) {
            _push(`<div class="absolute inset-0 bg-cover bg-center" style="${ssrRenderStyle(`background-image: url('${unref(formData).coverImage}')`)}" data-v-18fe3592></div>`);
          } else {
            _push(`<!---->`);
          }
          _push(` `);
          if (((_p = unref(formData)) == null ? void 0 : _p.layout) === "portrait") {
            _push(`<div class="absolute inset-0" style="${ssrRenderStyle({
              background: `linear-gradient(to bottom,
              transparent 50%,
              ${getLighterColor((_s = (_r = (_q = unref(formData)) == null ? void 0 : _q.themeColor) == null ? void 0 : _r.background) != null ? _s : "#ffffff")} 85%,
              ${getLighterColor((_v = (_u = (_t = unref(formData)) == null ? void 0 : _t.themeColor) == null ? void 0 : _u.background) != null ? _v : "#ffffff")} 100%)`
            })}" data-v-18fe3592></div>`);
          } else {
            _push(`<!---->`);
          }
          _push(` `);
          if (((_w = unref(formData)) == null ? void 0 : _w.layout) !== "portrait") {
            _push(`<div class="${ssrRenderClass([
              "absolute -bottom-8 z-10 mx-5",
              ((_x = unref(formData)) == null ? void 0 : _x.layout) === "left" ? "left-1" : ((_y = unref(formData)) == null ? void 0 : _y.layout) === "center" ? "left-1/2 transform -translate-x-1/2" : "right-1"
              // default برای right
            ])}" data-v-18fe3592>`);
            if ((_z = unref(formData)) == null ? void 0 : _z.profileImage) {
              _push(`<div class="relative" data-v-18fe3592><div class="rounded-full border-4 border-white bg-slate-200 w-28 h-28 overflow-hidden" data-v-18fe3592><img${ssrRenderAttr("src", (_A = unref(formData)) == null ? void 0 : _A.profileImage)} class="w-full h-full object-cover" data-v-18fe3592></div> `);
              if ((_B = unref(formData)) == null ? void 0 : _B.logoImage) {
                _push(`<div class="${ssrRenderClass([
                  "absolute bottom-3 w-10 h-10 rounded-full shadow-md border-2 border-white overflow-hidden",
                  ((_C = unref(formData)) == null ? void 0 : _C.layout) === "left" ? "-right-3" : "-left-3",
                  "bg-white"
                ])}" data-v-18fe3592><img${ssrRenderAttr("src", (_D = unref(formData)) == null ? void 0 : _D.logoImage)} class="w-full h-full object-cover" data-v-18fe3592></div>`);
              } else {
                _push(`<!---->`);
              }
              _push(`</div>`);
            } else {
              _push(`<!---->`);
            }
            _push(`</div>`);
          } else {
            _push(`<!---->`);
          }
          _push(`</div> <div class="${ssrRenderClass([
            "z-10",
            ((_E = unref(formData)) == null ? void 0 : _E.layout) === "center" ? "px-4 py-4 text-center flex flex-col items-center" : ((_F = unref(formData)) == null ? void 0 : _F.layout) === "portrait" ? "px-4 py-3 text-right" : ((_G = unref(formData)) == null ? void 0 : _G.layout) === "left" ? "px-4 py-4 text-left" : "px-4 py-4 text-right"
            // default برای right
          ])}" data-v-18fe3592><div class="${ssrRenderClass([
            "space-y-2",
            ((_H = unref(formData)) == null ? void 0 : _H.layout) === "center" ? "mt-6 mx-auto max-w-xs" : ((_I = unref(formData)) == null ? void 0 : _I.layout) === "portrait" ? "mt-4 mx-2" : "mt-8 mx-2"
          ])}" style="${ssrRenderStyle({ color: iconText.value })}" data-v-18fe3592>`);
          if ((_J = unref(formData)) == null ? void 0 : _J.name) {
            _push(`<div class="${ssrRenderClass([
              "text-xl font-bold flex items-center",
              ((_K = unref(formData)) == null ? void 0 : _K.layout) === "center" ? "justify-center gap-3" : ((_L = unref(formData)) == null ? void 0 : _L.layout) === "portrait" ? "justify-between" : ((_M = unref(formData)) == null ? void 0 : _M.layout) === "left" ? "justify-start gap-3" : "justify-start gap-3"
              // default
            ])}" data-v-18fe3592>`);
            if (((_N = unref(formData)) == null ? void 0 : _N.layout) === "portrait" && ((_O = unref(formData)) == null ? void 0 : _O.logoImage)) {
              _push(`<div class="w-12 h-12 rounded-full shadow-md border border-gray-200 overflow-hidden bg-white flex-shrink-0 order-2" data-v-18fe3592><img${ssrRenderAttr("src", (_P = unref(formData)) == null ? void 0 : _P.logoImage)} class="w-full h-full object-cover" data-v-18fe3592></div>`);
            } else {
              _push(`<!---->`);
            }
            _push(` <div class="${ssrRenderClass([((_Q = unref(formData)) == null ? void 0 : _Q.layout) === "portrait" ? "order-1" : "", "flex items-center gap-2"])}" data-v-18fe3592>${ssrInterpolate((_R = unref(formData)) == null ? void 0 : _R.name)} <span class="${ssrRenderClass(((_S = unref(formData)) == null ? void 0 : _S.layout) === "left" ? "ml-2" : "mr-2")}" data-v-18fe3592>`);
            if (enableBlueTick.value) {
              _push(`<i class="ti ti-rosette-discount-check text-blue-500" data-v-18fe3592></i>`);
            } else {
              _push(`<!---->`);
            }
            _push(`</span></div></div>`);
          } else {
            _push(`<div class="${ssrRenderClass([
              "font-extrabold flex items-center",
              ((_T = unref(formData)) == null ? void 0 : _T.layout) === "center" ? "text-2xl justify-center gap-3" : ((_U = unref(formData)) == null ? void 0 : _U.layout) === "portrait" ? "text-xl justify-between" : unref(formData).layout === "left" ? "text-2xl justify-start gap-3" : "text-2xl justify-start gap-3"
              // default
            ])}" style="${ssrRenderStyle({ color: iconText.value })}" data-v-18fe3592>`);
            if (unref(formData).layout === "portrait") {
              _push(`<div class="w-12 h-12 rounded-full shadow-md border border-gray-200 overflow-hidden bg-white flex-shrink-0 order-2" data-v-18fe3592>`);
              if (unref(formData).logoImage) {
                _push(`<img${ssrRenderAttr("src", unref(formData).logoImage)} class="w-full h-full object-cover" data-v-18fe3592>`);
              } else {
                _push(`<!---->`);
              }
              _push(`</div>`);
            } else {
              _push(`<!---->`);
            }
            _push(` <div class="${ssrRenderClass([unref(formData).layout === "portrait" ? "order-1" : "", "flex items-center gap-2"])}" data-v-18fe3592></div></div>`);
          }
          _push(` `);
          if (unref(formData).job) {
            _push(`<div class="${ssrRenderClass([
              "text-base font-medium flex items-center gap-1",
              unref(formData).layout === "center" ? "justify-center" : unref(formData).layout === "portrait" ? "justify-start" : unref(formData).layout === "left" ? "justify-start" : "justify-start"
              // default
            ])}" data-v-18fe3592><i class="ti ti-briefcase text-sm" style="${ssrRenderStyle({ color: iconColor.value })}" data-v-18fe3592></i> ${ssrInterpolate(unref(formData).job)}</div>`);
          } else {
            _push(`<div class="${ssrRenderClass([
              "text-sm mt-4 text-black flex items-center gap-1",
              unref(formData).layout === "center" ? "justify-center" : unref(formData).layout === "portrait" ? "justify-start" : unref(formData).layout === "left" ? "justify-start" : "justify-start"
              // default
            ])}" data-v-18fe3592></div>`);
          }
          _push(` `);
          if (unref(formData).company) {
            _push(`<div class="${ssrRenderClass([
              "text-base font-medium flex items-center gap-1",
              unref(formData).layout === "center" ? "justify-center" : unref(formData).layout === "portrait" ? "justify-start" : unref(formData).layout === "left" ? "justify-start" : "justify-start"
              // default
            ])}" data-v-18fe3592><i class="ti ti-building text-sm" style="${ssrRenderStyle({ color: iconColor.value })}" data-v-18fe3592></i> ${ssrInterpolate(unref(formData).company)}</div>`);
          } else {
            _push(`<div class="${ssrRenderClass([
              "text-sm text-black flex items-center gap-1",
              unref(formData).layout === "center" ? "justify-center" : unref(formData).layout === "portrait" ? "justify-start" : unref(formData).layout === "left" ? "justify-start" : "justify-start"
              // default
            ])}" data-v-18fe3592></div>`);
          }
          _push(` `);
          if ((_V = unref(formData)) == null ? void 0 : _V.location) {
            _push(`<div class="${ssrRenderClass([
              "text-base font-medium flex items-center gap-1",
              unref(formData).layout === "center" ? "justify-center" : unref(formData).layout === "portrait" ? "justify-start" : unref(formData).layout === "left" ? "justify-start" : "justify-start"
              // default
            ])}" data-v-18fe3592><i class="ti ti-map-pin text-sm" style="${ssrRenderStyle({ color: iconColor.value })}" data-v-18fe3592></i> ${ssrInterpolate((_W = unref(formData)) == null ? void 0 : _W.location)}</div>`);
          } else {
            _push(`<div class="${ssrRenderClass([
              "text-sm text-black flex items-center gap-1",
              unref(formData).layout === "center" ? "justify-center" : unref(formData).layout === "portrait" ? "justify-start" : unref(formData).layout === "left" ? "justify-start" : "justify-start"
              // default
            ])}" data-v-18fe3592></div>`);
          }
          _push(` `);
          if (unref(formData).bio) {
            _push(`<div class="${ssrRenderClass([
              "text-xs leading-relaxed break-words",
              unref(formData).layout === "center" ? "text-center" : unref(formData).layout === "portrait" ? "text-justify" : "text-justify"
            ])}" style="${ssrRenderStyle({ "overflow": "hidden", "display": "-webkit-box", "-webkit-line-clamp": "10", "-webkit-box-orient": "vertical", "line-clamp": "10", "white-space": "pre-line" })}" data-v-18fe3592>${ssrInterpolate(unref(formData).bio)}</div>`);
          } else {
            _push(`<div class="${ssrRenderClass([
              "text-xs text-black",
              unref(formData).layout === "center" ? "text-center" : unref(formData).layout === "portrait" ? "text-justify" : "text-justify"
            ])}" data-v-18fe3592></div>`);
          }
          _push(`</div> <div class="${ssrRenderClass([
            "mt-5 w-full",
            unref(formData).layout === "center" ? "px-0" : unref(formData).layout === "portrait" ? "px-4" : "px-6"
          ])}" data-v-18fe3592>`);
          if (unref(formData).saveContact) {
            _push(`<button class="w-full py-3 rounded-full font-semibold text-center flex items-center justify-center gap-2" style="${ssrRenderStyle({
              backgroundColor: iconBg.value,
              color: iconBg.value === "#ffffff" || iconBg.value === "#FFFFFF" ? "#000000" : "#ffffff",
              boxShadow: `0 2px 6px ${iconShadow.value}`
            })}" data-v-18fe3592><i class="ti ti-download" data-v-18fe3592></i> ${ssrInterpolate(unref(formData).saveContact)}</button>`);
          } else {
            _push(`<button disabled class="w-full py-3 rounded-full text-center font-bold text-gray-400 bg-gray-200 flex items-center justify-center gap-2 cursor-not-allowed" data-v-18fe3592><div class="w-5 h-5 bg-gray-300 rounded-full animate-pulse" data-v-18fe3592></div> <div class="h-4 w-32 bg-gray-300 rounded animate-pulse" data-v-18fe3592></div></button>`);
          }
          _push(`</div></div> <div class="${ssrRenderClass([
            "flex-1 flex flex-col justify-start min-h-0",
            unref(formData).layout === "portrait" ? "px-4" : "px-2"
          ])}" data-v-18fe3592><!--[-->`);
          ssrRenderList(groupedItems.value, (group, groupIndex) => {
            _push(`<!--[-->`);
            if (group.type === "grid") {
              _push(`<div class="${ssrRenderClass([
                "auto-rows-max",
                unref(formData).layout === "left" ? "grid grid-cols-3 content-start gap-3" : unref(formData).layout === "right" ? "grid grid-cols-3 content-start gap-3" : "grid grid-cols-3 content-start gap-3"
              ])}" data-v-18fe3592><!--[-->`);
              ssrRenderList(group.items, (item) => {
                ssrRenderVNode(_push, createVNode(resolveDynamicComponent(getComponent(item)), {
                  key: item.id,
                  link: item,
                  "icon-bg": iconBg.value,
                  "icon-text": iconText.value,
                  "is-dark-theme": isDarkTheme.value,
                  "is-light-theme": isLightTheme.value,
                  "is-background-dark": isBackgroundDark.value,
                  "form-data": unref(formData),
                  slug: unref(slug),
                  onMessage: ($event) => showInfoToast($event),
                  onClick: ($event) => handleLinkClick(item),
                  "is-list-mode": false
                }, null), _parent);
              });
              _push(`<!--]--></div>`);
            } else {
              _push(`<div class="${ssrRenderClass([
                "my-3",
                unref(formData).layout === "center" ? "flex flex-col items-center space-y-3 w-full" : "flex flex-col gap-3 w-full"
              ])}" data-v-18fe3592><!--[-->`);
              ssrRenderList(group.items, (item) => {
                ssrRenderVNode(_push, createVNode(resolveDynamicComponent(getComponent(item)), {
                  key: item.id,
                  link: item,
                  "icon-bg": iconBg.value,
                  "icon-text": iconText.value,
                  "is-dark-theme": isDarkTheme.value,
                  "is-light-theme": isLightTheme.value,
                  "is-background-dark": isBackgroundDark.value,
                  "form-data": unref(formData),
                  slug: unref(slug),
                  onMessage: ($event) => showInfoToast($event),
                  onClick: ($event) => handleLinkClick(item),
                  class: "w-full",
                  "is-list-mode": true
                }, null), _parent);
              });
              _push(`<!--]--></div>`);
            }
            _push(`<!--]-->`);
          });
          _push(`<!--]--></div> `);
          if (!unref(formData).removeBranding) {
            _push(`<div class="flex items-center justify-center py-6 px-6" data-v-18fe3592><div class="flex items-center gap-2 text-xs text-gray-500 bg-gray-100/50 px-4 py-2 rounded-full border border-gray-200/50 backdrop-blur-sm" data-v-18fe3592><img${ssrRenderAttr("src", _imports_0)} alt="Linku Logo" class="w-4 h-4" data-v-18fe3592> <span class="font-medium" data-v-18fe3592>\u0633\u0627\u062E\u062A\u0647 \u0634\u062F\u0647 \u0628\u0627</span> <span class="font-bold text-gray-700" data-v-18fe3592>\u0644\u06CC\u0646\u06A9\u0648</span></div></div>`);
          } else {
            _push(`<!---->`);
          }
          _push(`</div> `);
          _push(ssrRenderComponent(__nuxt_component_0, {
            visible: showShareModal.value,
            title: "\u0627\u0634\u062A\u0631\u0627\u06A9\u200C\u06AF\u0630\u0627\u0631\u06CC \u067E\u0631\u0648\u0641\u0627\u06CC\u0644",
            "close-on-overlay": true,
            onClose: ($event) => showShareModal.value = false
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(`<div class="space-y-4" data-v-18fe3592${_scopeId}><div class="space-y-3" data-v-18fe3592${_scopeId}><button class="w-full flex items-center gap-3 p-3 bg-gray-50 hover:bg-blue-50 rounded-lg transition-colors border border-gray-200 hover:border-blue-300" data-v-18fe3592${_scopeId}><div class="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style="${ssrRenderStyle({ backgroundColor: iconBg.value })}" data-v-18fe3592${_scopeId}><i class="ti ti-brand-telegram text-white text-sm" data-v-18fe3592${_scopeId}></i></div> <span class="font-medium text-gray-800 text-right flex-1" data-v-18fe3592${_scopeId}>\u062A\u0644\u06AF\u0631\u0627\u0645</span></button> <button class="w-full flex items-center gap-3 p-3 bg-gray-50 hover:bg-green-50 rounded-lg transition-colors border border-gray-200 hover:border-green-300" data-v-18fe3592${_scopeId}><div class="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style="${ssrRenderStyle({ backgroundColor: iconBg.value })}" data-v-18fe3592${_scopeId}><i class="ti ti-brand-whatsapp text-white text-sm" data-v-18fe3592${_scopeId}></i></div> <span class="font-medium text-gray-800 text-right flex-1" data-v-18fe3592${_scopeId}>\u0648\u0627\u062A\u0633\u0627\u067E</span></button> <button class="w-full flex items-center gap-3 p-3 bg-gray-50 hover:bg-pink-50 rounded-lg transition-colors border border-gray-200 hover:border-pink-300" data-v-18fe3592${_scopeId}><div class="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style="${ssrRenderStyle({ backgroundColor: iconBg.value })}" data-v-18fe3592${_scopeId}><i class="ti ti-brand-instagram text-white text-sm" data-v-18fe3592${_scopeId}></i></div> <span class="font-medium text-gray-800 text-right flex-1" data-v-18fe3592${_scopeId}>\u0627\u06CC\u0646\u0633\u062A\u0627\u06AF\u0631\u0627\u0645</span></button> <button class="w-full flex items-center gap-3 p-3 bg-gray-50 hover:bg-blue-50 rounded-lg transition-colors border border-gray-200 hover:border-blue-300" data-v-18fe3592${_scopeId}><div class="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style="${ssrRenderStyle({ backgroundColor: iconBg.value })}" data-v-18fe3592${_scopeId}><i class="ti ti-brand-linkedin text-white text-sm" data-v-18fe3592${_scopeId}></i></div> <span class="font-medium text-gray-800 text-right flex-1" data-v-18fe3592${_scopeId}>\u0644\u06CC\u0646\u06A9\u062F\u06CC\u0646</span></button> <button class="w-full flex items-center gap-3 p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors border border-gray-200 hover:border-gray-400" data-v-18fe3592${_scopeId}><div class="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style="${ssrRenderStyle({ backgroundColor: iconBg.value })}" data-v-18fe3592${_scopeId}><i class="ti ti-brand-x text-white text-sm" data-v-18fe3592${_scopeId}></i></div> <span class="font-medium text-gray-800 text-right flex-1" data-v-18fe3592${_scopeId}>\u0627\u06CC\u06A9\u0633</span></button> <button class="w-full flex items-center gap-3 p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors border border-gray-200 hover:border-gray-400" data-v-18fe3592${_scopeId}><div class="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style="${ssrRenderStyle({ backgroundColor: iconBg.value })}" data-v-18fe3592${_scopeId}><i class="ti ti-copy text-white text-sm" data-v-18fe3592${_scopeId}></i></div> <span class="font-medium text-gray-800 text-right flex-1" data-v-18fe3592${_scopeId}>\u06A9\u067E\u06CC \u0644\u06CC\u0646\u06A9</span></button></div> <button class="w-full py-3 px-4 bg-gray-200 text-gray-700 rounded-xl font-medium hover:bg-gray-300 transition-colors" data-v-18fe3592${_scopeId}>
            \u0627\u0646\u0635\u0631\u0627\u0641
          </button></div>`);
              } else {
                return [
                  createVNode("div", { class: "space-y-4" }, [
                    createVNode("div", { class: "space-y-3" }, [
                      createVNode("button", {
                        onClick: shareToTelegram,
                        class: "w-full flex items-center gap-3 p-3 bg-gray-50 hover:bg-blue-50 rounded-lg transition-colors border border-gray-200 hover:border-blue-300"
                      }, [
                        createVNode("div", {
                          class: "w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0",
                          style: { backgroundColor: iconBg.value }
                        }, [
                          createVNode("i", { class: "ti ti-brand-telegram text-white text-sm" })
                        ], 4),
                        createTextVNode(),
                        createVNode("span", { class: "font-medium text-gray-800 text-right flex-1" }, "\u062A\u0644\u06AF\u0631\u0627\u0645")
                      ]),
                      createTextVNode(),
                      createVNode("button", {
                        onClick: shareToWhatsApp,
                        class: "w-full flex items-center gap-3 p-3 bg-gray-50 hover:bg-green-50 rounded-lg transition-colors border border-gray-200 hover:border-green-300"
                      }, [
                        createVNode("div", {
                          class: "w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0",
                          style: { backgroundColor: iconBg.value }
                        }, [
                          createVNode("i", { class: "ti ti-brand-whatsapp text-white text-sm" })
                        ], 4),
                        createTextVNode(),
                        createVNode("span", { class: "font-medium text-gray-800 text-right flex-1" }, "\u0648\u0627\u062A\u0633\u0627\u067E")
                      ]),
                      createTextVNode(),
                      createVNode("button", {
                        onClick: shareToInstagram,
                        class: "w-full flex items-center gap-3 p-3 bg-gray-50 hover:bg-pink-50 rounded-lg transition-colors border border-gray-200 hover:border-pink-300"
                      }, [
                        createVNode("div", {
                          class: "w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0",
                          style: { backgroundColor: iconBg.value }
                        }, [
                          createVNode("i", { class: "ti ti-brand-instagram text-white text-sm" })
                        ], 4),
                        createTextVNode(),
                        createVNode("span", { class: "font-medium text-gray-800 text-right flex-1" }, "\u0627\u06CC\u0646\u0633\u062A\u0627\u06AF\u0631\u0627\u0645")
                      ]),
                      createTextVNode(),
                      createVNode("button", {
                        onClick: shareToLinkedIn,
                        class: "w-full flex items-center gap-3 p-3 bg-gray-50 hover:bg-blue-50 rounded-lg transition-colors border border-gray-200 hover:border-blue-300"
                      }, [
                        createVNode("div", {
                          class: "w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0",
                          style: { backgroundColor: iconBg.value }
                        }, [
                          createVNode("i", { class: "ti ti-brand-linkedin text-white text-sm" })
                        ], 4),
                        createTextVNode(),
                        createVNode("span", { class: "font-medium text-gray-800 text-right flex-1" }, "\u0644\u06CC\u0646\u06A9\u062F\u06CC\u0646")
                      ]),
                      createTextVNode(),
                      createVNode("button", {
                        onClick: shareToX,
                        class: "w-full flex items-center gap-3 p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors border border-gray-200 hover:border-gray-400"
                      }, [
                        createVNode("div", {
                          class: "w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0",
                          style: { backgroundColor: iconBg.value }
                        }, [
                          createVNode("i", { class: "ti ti-brand-x text-white text-sm" })
                        ], 4),
                        createTextVNode(),
                        createVNode("span", { class: "font-medium text-gray-800 text-right flex-1" }, "\u0627\u06CC\u06A9\u0633")
                      ]),
                      createTextVNode(),
                      createVNode("button", {
                        onClick: copyLink,
                        class: "w-full flex items-center gap-3 p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors border border-gray-200 hover:border-gray-400"
                      }, [
                        createVNode("div", {
                          class: "w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0",
                          style: { backgroundColor: iconBg.value }
                        }, [
                          createVNode("i", { class: "ti ti-copy text-white text-sm" })
                        ], 4),
                        createTextVNode(),
                        createVNode("span", { class: "font-medium text-gray-800 text-right flex-1" }, "\u06A9\u067E\u06CC \u0644\u06CC\u0646\u06A9")
                      ])
                    ]),
                    createTextVNode(),
                    createVNode("button", {
                      onClick: ($event) => showShareModal.value = false,
                      class: "w-full py-3 px-4 bg-gray-200 text-gray-700 rounded-xl font-medium hover:bg-gray-300 transition-colors"
                    }, "\r\n            \u0627\u0646\u0635\u0631\u0627\u0641\r\n          ", 8, ["onClick"])
                  ])
                ];
              }
            }),
            _: 1
          }, _parent));
          _push(` `);
          _push(ssrRenderComponent(__nuxt_component_0, {
            visible: showReportModal.value,
            title: "\u06AF\u0632\u0627\u0631\u0634 \u0645\u062D\u062A\u0648\u0627",
            "close-on-overlay": true,
            onClose: ($event) => showReportModal.value = false
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(`<div class="space-y-6" data-v-18fe3592${_scopeId}><div class="space-y-3" data-v-18fe3592${_scopeId}><h4 class="font-semibold text-gray-700" data-v-18fe3592${_scopeId}>\u0646\u0648\u0639 \u06AF\u0632\u0627\u0631\u0634:</h4> <div class="space-y-2" data-v-18fe3592${_scopeId}><label class="flex items-center gap-3 p-3 bg-gray-50 rounded-xl cursor-pointer hover:bg-gray-100 transition-colors" data-v-18fe3592${_scopeId}><input type="radio"${ssrIncludeBooleanAttr(ssrLooseEqual(reportType.value, "inappropriate")) ? " checked" : ""} value="inappropriate" class="text-red-500" data-v-18fe3592${_scopeId}> <div class="flex items-center gap-2" data-v-18fe3592${_scopeId}><div class="w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0" style="${ssrRenderStyle({ backgroundColor: iconBg.value })}" data-v-18fe3592${_scopeId}><i class="ti ti-alert-triangle text-white text-xs" data-v-18fe3592${_scopeId}></i></div> <span class="text-gray-800" data-v-18fe3592${_scopeId}>\u0645\u062D\u062A\u0648\u0627\u06CC \u0646\u0627\u0645\u0646\u0627\u0633\u0628</span></div></label> <label class="flex items-center gap-3 p-3 bg-gray-50 rounded-xl cursor-pointer hover:bg-gray-100 transition-colors" data-v-18fe3592${_scopeId}><input type="radio"${ssrIncludeBooleanAttr(ssrLooseEqual(reportType.value, "spam")) ? " checked" : ""} value="spam" class="text-orange-500" data-v-18fe3592${_scopeId}> <div class="flex items-center gap-2" data-v-18fe3592${_scopeId}><div class="w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0" style="${ssrRenderStyle({ backgroundColor: iconBg.value })}" data-v-18fe3592${_scopeId}><i class="ti ti-mail-x text-white text-xs" data-v-18fe3592${_scopeId}></i></div> <span class="text-gray-800" data-v-18fe3592${_scopeId}>\u0627\u0633\u067E\u0645 \u06CC\u0627 \u062A\u0628\u0644\u06CC\u063A\u0627\u062A</span></div></label> <label class="flex items-center gap-3 p-3 bg-gray-50 rounded-xl cursor-pointer hover:bg-gray-100 transition-colors" data-v-18fe3592${_scopeId}><input type="radio"${ssrIncludeBooleanAttr(ssrLooseEqual(reportType.value, "fake")) ? " checked" : ""} value="fake" class="text-blue-500" data-v-18fe3592${_scopeId}> <div class="flex items-center gap-2" data-v-18fe3592${_scopeId}><div class="w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0" style="${ssrRenderStyle({ backgroundColor: iconBg.value })}" data-v-18fe3592${_scopeId}><i class="ti ti-user-x text-white text-xs" data-v-18fe3592${_scopeId}></i></div> <span class="text-gray-800" data-v-18fe3592${_scopeId}>\u0647\u0648\u06CC\u062A \u062C\u0639\u0644\u06CC</span></div></label> <label class="flex items-center gap-3 p-3 bg-gray-50 rounded-xl cursor-pointer hover:bg-gray-100 transition-colors" data-v-18fe3592${_scopeId}><input type="radio"${ssrIncludeBooleanAttr(ssrLooseEqual(reportType.value, "other")) ? " checked" : ""} value="other" class="text-gray-500" data-v-18fe3592${_scopeId}> <div class="flex items-center gap-2" data-v-18fe3592${_scopeId}><div class="w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0" style="${ssrRenderStyle({ backgroundColor: iconBg.value })}" data-v-18fe3592${_scopeId}><i class="ti ti-dots text-white text-xs" data-v-18fe3592${_scopeId}></i></div> <span class="text-gray-800" data-v-18fe3592${_scopeId}>\u0633\u0627\u06CC\u0631 \u0645\u0648\u0627\u0631\u062F</span></div></label></div></div> <div class="space-y-3" data-v-18fe3592${_scopeId}><h4 class="font-semibold text-gray-700" data-v-18fe3592${_scopeId}>\u062A\u0648\u0636\u06CC\u062D\u0627\u062A (\u0627\u062E\u062A\u06CC\u0627\u0631\u06CC):</h4> <textarea placeholder="\u0644\u0637\u0641\u0627\u064B \u062A\u0648\u0636\u06CC\u062D\u0627\u062A \u0628\u06CC\u0634\u062A\u0631\u06CC \u062F\u0631 \u0645\u0648\u0631\u062F \u06AF\u0632\u0627\u0631\u0634 \u062E\u0648\u062F \u0627\u0631\u0627\u0626\u0647 \u062F\u0647\u06CC\u062F..." class="w-full p-4 border border-gray-200 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" rows="4" data-v-18fe3592${_scopeId}>${ssrInterpolate(reportDescription.value)}</textarea></div> <div class="flex gap-3 pt-4 border-t border-gray-200" data-v-18fe3592${_scopeId}><button class="flex-1 py-3 px-4 bg-gray-200 text-gray-700 rounded-xl font-medium hover:bg-gray-300 transition-colors" data-v-18fe3592${_scopeId}>
              \u0627\u0646\u0635\u0631\u0627\u0641
            </button> <button${ssrIncludeBooleanAttr(!reportType.value) ? " disabled" : ""} class="${ssrRenderClass([{ "bg-gray-300 !text-gray-500 cursor-not-allowed": !reportType.value }, "flex-1 py-3 px-4 rounded-xl font-medium transition-colors text-white hover:opacity-90"])}" style="${ssrRenderStyle(reportType.value ? { backgroundColor: iconBg.value } : { backgroundColor: "#d1d5db" })}" data-v-18fe3592${_scopeId}>
              \u0627\u0631\u0633\u0627\u0644 \u06AF\u0632\u0627\u0631\u0634
            </button></div> <p class="text-xs text-gray-500 text-center" data-v-18fe3592${_scopeId}>
            \u06AF\u0632\u0627\u0631\u0634 \u0634\u0645\u0627 \u0645\u062D\u0631\u0645\u0627\u0646\u0647 \u0628\u0631\u0631\u0633\u06CC \u0648 \u0627\u0642\u062F\u0627\u0645 \u0644\u0627\u0632\u0645 \u0627\u0646\u062C\u0627\u0645 \u062E\u0648\u0627\u0647\u062F \u0634\u062F
          </p></div>`);
              } else {
                return [
                  createVNode("div", { class: "space-y-6" }, [
                    createVNode("div", { class: "space-y-3" }, [
                      createVNode("h4", { class: "font-semibold text-gray-700" }, "\u0646\u0648\u0639 \u06AF\u0632\u0627\u0631\u0634:"),
                      createTextVNode(),
                      createVNode("div", { class: "space-y-2" }, [
                        createVNode("label", { class: "flex items-center gap-3 p-3 bg-gray-50 rounded-xl cursor-pointer hover:bg-gray-100 transition-colors" }, [
                          withDirectives(createVNode("input", {
                            type: "radio",
                            "onUpdate:modelValue": ($event) => reportType.value = $event,
                            value: "inappropriate",
                            class: "text-red-500"
                          }, null, 8, ["onUpdate:modelValue"]), [
                            [vModelRadio, reportType.value]
                          ]),
                          createTextVNode(),
                          createVNode("div", { class: "flex items-center gap-2" }, [
                            createVNode("div", {
                              class: "w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0",
                              style: { backgroundColor: iconBg.value }
                            }, [
                              createVNode("i", { class: "ti ti-alert-triangle text-white text-xs" })
                            ], 4),
                            createTextVNode(),
                            createVNode("span", { class: "text-gray-800" }, "\u0645\u062D\u062A\u0648\u0627\u06CC \u0646\u0627\u0645\u0646\u0627\u0633\u0628")
                          ])
                        ]),
                        createTextVNode(),
                        createVNode("label", { class: "flex items-center gap-3 p-3 bg-gray-50 rounded-xl cursor-pointer hover:bg-gray-100 transition-colors" }, [
                          withDirectives(createVNode("input", {
                            type: "radio",
                            "onUpdate:modelValue": ($event) => reportType.value = $event,
                            value: "spam",
                            class: "text-orange-500"
                          }, null, 8, ["onUpdate:modelValue"]), [
                            [vModelRadio, reportType.value]
                          ]),
                          createTextVNode(),
                          createVNode("div", { class: "flex items-center gap-2" }, [
                            createVNode("div", {
                              class: "w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0",
                              style: { backgroundColor: iconBg.value }
                            }, [
                              createVNode("i", { class: "ti ti-mail-x text-white text-xs" })
                            ], 4),
                            createTextVNode(),
                            createVNode("span", { class: "text-gray-800" }, "\u0627\u0633\u067E\u0645 \u06CC\u0627 \u062A\u0628\u0644\u06CC\u063A\u0627\u062A")
                          ])
                        ]),
                        createTextVNode(),
                        createVNode("label", { class: "flex items-center gap-3 p-3 bg-gray-50 rounded-xl cursor-pointer hover:bg-gray-100 transition-colors" }, [
                          withDirectives(createVNode("input", {
                            type: "radio",
                            "onUpdate:modelValue": ($event) => reportType.value = $event,
                            value: "fake",
                            class: "text-blue-500"
                          }, null, 8, ["onUpdate:modelValue"]), [
                            [vModelRadio, reportType.value]
                          ]),
                          createTextVNode(),
                          createVNode("div", { class: "flex items-center gap-2" }, [
                            createVNode("div", {
                              class: "w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0",
                              style: { backgroundColor: iconBg.value }
                            }, [
                              createVNode("i", { class: "ti ti-user-x text-white text-xs" })
                            ], 4),
                            createTextVNode(),
                            createVNode("span", { class: "text-gray-800" }, "\u0647\u0648\u06CC\u062A \u062C\u0639\u0644\u06CC")
                          ])
                        ]),
                        createTextVNode(),
                        createVNode("label", { class: "flex items-center gap-3 p-3 bg-gray-50 rounded-xl cursor-pointer hover:bg-gray-100 transition-colors" }, [
                          withDirectives(createVNode("input", {
                            type: "radio",
                            "onUpdate:modelValue": ($event) => reportType.value = $event,
                            value: "other",
                            class: "text-gray-500"
                          }, null, 8, ["onUpdate:modelValue"]), [
                            [vModelRadio, reportType.value]
                          ]),
                          createTextVNode(),
                          createVNode("div", { class: "flex items-center gap-2" }, [
                            createVNode("div", {
                              class: "w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0",
                              style: { backgroundColor: iconBg.value }
                            }, [
                              createVNode("i", { class: "ti ti-dots text-white text-xs" })
                            ], 4),
                            createTextVNode(),
                            createVNode("span", { class: "text-gray-800" }, "\u0633\u0627\u06CC\u0631 \u0645\u0648\u0627\u0631\u062F")
                          ])
                        ])
                      ])
                    ]),
                    createTextVNode(),
                    createVNode("div", { class: "space-y-3" }, [
                      createVNode("h4", { class: "font-semibold text-gray-700" }, "\u062A\u0648\u0636\u06CC\u062D\u0627\u062A (\u0627\u062E\u062A\u06CC\u0627\u0631\u06CC):"),
                      createTextVNode(),
                      withDirectives(createVNode("textarea", {
                        "onUpdate:modelValue": ($event) => reportDescription.value = $event,
                        placeholder: "\u0644\u0637\u0641\u0627\u064B \u062A\u0648\u0636\u06CC\u062D\u0627\u062A \u0628\u06CC\u0634\u062A\u0631\u06CC \u062F\u0631 \u0645\u0648\u0631\u062F \u06AF\u0632\u0627\u0631\u0634 \u062E\u0648\u062F \u0627\u0631\u0627\u0626\u0647 \u062F\u0647\u06CC\u062F...",
                        class: "w-full p-4 border border-gray-200 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent",
                        rows: "4"
                      }, null, 8, ["onUpdate:modelValue"]), [
                        [vModelText, reportDescription.value]
                      ])
                    ]),
                    createTextVNode(),
                    createVNode("div", { class: "flex gap-3 pt-4 border-t border-gray-200" }, [
                      createVNode("button", {
                        onClick: ($event) => showReportModal.value = false,
                        class: "flex-1 py-3 px-4 bg-gray-200 text-gray-700 rounded-xl font-medium hover:bg-gray-300 transition-colors"
                      }, "\r\n              \u0627\u0646\u0635\u0631\u0627\u0641\r\n            ", 8, ["onClick"]),
                      createTextVNode(),
                      createVNode("button", {
                        onClick: submitReport,
                        disabled: !reportType.value,
                        class: ["flex-1 py-3 px-4 rounded-xl font-medium transition-colors text-white hover:opacity-90", { "bg-gray-300 !text-gray-500 cursor-not-allowed": !reportType.value }],
                        style: reportType.value ? { backgroundColor: iconBg.value } : { backgroundColor: "#d1d5db" }
                      }, "\r\n              \u0627\u0631\u0633\u0627\u0644 \u06AF\u0632\u0627\u0631\u0634\r\n            ", 14, ["disabled"])
                    ]),
                    createTextVNode(),
                    createVNode("p", { class: "text-xs text-gray-500 text-center" }, "\r\n            \u06AF\u0632\u0627\u0631\u0634 \u0634\u0645\u0627 \u0645\u062D\u0631\u0645\u0627\u0646\u0647 \u0628\u0631\u0631\u0633\u06CC \u0648 \u0627\u0642\u062F\u0627\u0645 \u0644\u0627\u0632\u0645 \u0627\u0646\u062C\u0627\u0645 \u062E\u0648\u0627\u0647\u062F \u0634\u062F\r\n          ")
                  ])
                ];
              }
            }),
            _: 1
          }, _parent));
          _push(` `);
          if (unref(formData).isLeadCaptureEnabled) {
            _push(`<div class="fixed inset-0 bg-white/70 bg-opacity-50 z-50 w-full p-4 backdrop-blur-[1px]" style="${ssrRenderStyle({ "display": "grid", "place-items": "center" })}" data-v-18fe3592>`);
            _push(ssrRenderComponent(_sfc_main$2, {
              class: "w-full",
              onClose: closeLeadCapture,
              cardId: unref(cardId),
              slug: unref(slug),
              isDefault: unref(isDefault)
            }, null, _parent));
            _push(`</div>`);
          } else {
            _push(`<!---->`);
          }
          _push(`</div>`);
        }
        _push(`</div>`);
      } else {
        _push(`<div class="fixed inset-0 flex flex-col items-center justify-center bg-white text-black z-50" data-v-18fe3592><img${ssrRenderAttr("src", _imports_1)} alt="Logo" class="w-32 h-32 mb-10 object-contain" data-v-18fe3592> <div class="flex space-x-3" data-v-18fe3592><span class="w-3 h-3 bg-black rounded-full animate-bounce [animation-delay:-0.3s]" data-v-18fe3592></span> <span class="w-3 h-3 bg-black rounded-full animate-bounce [animation-delay:-0.15s]" data-v-18fe3592></span> <span class="w-3 h-3 bg-black rounded-full animate-bounce" data-v-18fe3592></span></div></div>`);
      }
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/preview/[slug].vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const _slug_ = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-18fe3592"]]);

export { _slug_ as default };
//# sourceMappingURL=_slug_-sykbBY3_.mjs.map
