import { defineComponent, ref, computed, mergeProps, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderClass, ssrRenderList, ssrInterpolate, ssrRenderAttr, ssrRenderTeleport } from 'vue/server-renderer';
import { a as useNuxtApp } from './server.mjs';
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

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "tutorials",
  __ssrInlineRender: true,
  setup(__props) {
    const nuxtApp = useNuxtApp();
    nuxtApp.$axios;
    const tutorials2 = ref([]);
    const categories = ref([]);
    const loading = ref(true);
    const selectedCategory = ref("");
    const showModal = ref(false);
    const selectedTutorial = ref(null);
    const filteredTutorials = computed(() => {
      if (!selectedCategory.value) {
        return tutorials2.value;
      }
      return tutorials2.value.filter((t) => t.category === selectedCategory.value);
    });
    const formatDuration = (seconds) => {
      const mins = Math.floor(seconds / 60);
      const secs = seconds % 60;
      return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
    };
    const getEmbedUrl = (url) => {
      if (!url) return void 0;
      const ytMatch = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
      if (ytMatch) {
        return `https://www.youtube.com/embed/${ytMatch[1]}`;
      }
      const aparatMatch = url.match(/aparat\.com\/v\/([a-zA-Z0-9]+)/);
      if (aparatMatch) {
        return `https://www.aparat.com/video/video/embed/videohash/${aparatMatch[1]}/vt/frame`;
      }
      const vimeoMatch = url.match(/vimeo\.com\/(\d+)/);
      if (vimeoMatch) {
        return `https://player.vimeo.com/video/${vimeoMatch[1]}`;
      }
      return void 0;
    };
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "min-h-screen bg-background pb-24 lg:pb-12" }, _attrs))} data-v-ebc34cfc><div class="px-3 lg:px-6 py-3 lg:py-6 bg-background" data-v-ebc34cfc><div class="w-full mx-auto max-w-4xl" data-v-ebc34cfc><div class="relative overflow-hidden rounded-2xl bg-gradient-to-br from-purple-600 via-purple-700 to-pink-600 p-6 lg:p-8 mb-6 shadow-xl" data-v-ebc34cfc><div class="absolute inset-0 opacity-10" data-v-ebc34cfc><div class="absolute top-0 left-0 w-32 h-32 bg-white rounded-full blur-3xl" data-v-ebc34cfc></div> <div class="absolute bottom-0 right-0 w-40 h-40 bg-pink-300 rounded-full blur-3xl" data-v-ebc34cfc></div></div> <div class="relative z-10 flex items-center gap-4" data-v-ebc34cfc><div class="w-16 h-16 lg:w-20 lg:h-20 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center shadow-lg" data-v-ebc34cfc><i class="ti ti-video text-3xl lg:text-4xl text-white" data-v-ebc34cfc></i></div> <div class="flex-1" data-v-ebc34cfc><h1 class="text-xl lg:text-2xl font-bold text-white mb-2" data-v-ebc34cfc>\u0648\u06CC\u062F\u06CC\u0648\u0647\u0627\u06CC \u0622\u0645\u0648\u0632\u0634\u06CC</h1> <p class="text-purple-100 text-sm lg:text-base" data-v-ebc34cfc>
                \u0622\u0645\u0648\u0632\u0634 \u06A9\u0627\u0645\u0644 \u0627\u0633\u062A\u0641\u0627\u062F\u0647 \u0627\u0632 \u0645\u062D\u0635\u0648\u0644\u0627\u062A \u0648 \u062E\u062F\u0645\u0627\u062A \u0644\u06CC\u0646\u06A9\u0648
              </p></div></div></div> `);
      if (categories.value.length > 0) {
        _push(`<div class="flex flex-wrap gap-2 mb-6" data-v-ebc34cfc><button class="${ssrRenderClass([
          "px-4 py-2 rounded-full text-sm font-medium transition-all",
          !selectedCategory.value ? "bg-purple-600 text-white shadow-lg shadow-purple-500/30" : "bg-card text-foreground border border-border hover:border-purple-300"
        ])}" data-v-ebc34cfc>
            \u0647\u0645\u0647
          </button> <!--[-->`);
        ssrRenderList(categories.value, (cat) => {
          _push(`<button class="${ssrRenderClass([
            "px-4 py-2 rounded-full text-sm font-medium transition-all",
            selectedCategory.value === cat ? "bg-purple-600 text-white shadow-lg shadow-purple-500/30" : "bg-card text-foreground border border-border hover:border-purple-300"
          ])}" data-v-ebc34cfc>${ssrInterpolate(cat)}</button>`);
        });
        _push(`<!--]--></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(` `);
      if (loading.value) {
        _push(`<div class="flex flex-col justify-center items-center py-20" data-v-ebc34cfc><div class="animate-spin rounded-full h-10 w-10 border-2 border-purple-600 border-t-transparent mb-4" data-v-ebc34cfc></div> <span class="text-muted-foreground" data-v-ebc34cfc>\u062F\u0631 \u062D\u0627\u0644 \u0628\u0627\u0631\u06AF\u0630\u0627\u0631\u06CC...</span></div>`);
      } else {
        _push(`<div class="space-y-4" data-v-ebc34cfc><!--[-->`);
        ssrRenderList(filteredTutorials.value, (tutorial) => {
          _push(`<div class="group bg-card rounded-2xl border border-border overflow-hidden hover:shadow-lg hover:border-purple-300 transition-all duration-300 cursor-pointer" data-v-ebc34cfc><div class="flex flex-col sm:flex-row" data-v-ebc34cfc><div class="relative sm:w-48 lg:w-56 aspect-video sm:aspect-auto sm:h-32 lg:h-36 bg-muted flex-shrink-0" data-v-ebc34cfc>`);
          if (tutorial.thumbnail) {
            _push(`<img${ssrRenderAttr("src", tutorial.thumbnail)}${ssrRenderAttr("alt", tutorial.title)} class="w-full h-full object-cover" data-v-ebc34cfc>`);
          } else {
            _push(`<div class="w-full h-full flex items-center justify-center bg-gradient-to-br from-purple-500/10 to-pink-500/10" data-v-ebc34cfc><i class="ti ti-video text-4xl text-purple-400/50" data-v-ebc34cfc></i></div>`);
          }
          _push(` `);
          if (tutorial.duration) {
            _push(`<div class="absolute bottom-2 left-2 px-2 py-1 bg-black/70 text-white text-xs rounded" data-v-ebc34cfc>${ssrInterpolate(formatDuration(tutorial.duration))}</div>`);
          } else {
            _push(`<!---->`);
          }
          _push(` <div class="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/30" data-v-ebc34cfc><div class="w-12 h-12 rounded-full bg-white/90 flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform" data-v-ebc34cfc><i class="ti ti-player-play text-xl text-purple-600 mr-[-2px]" data-v-ebc34cfc></i></div></div></div> <div class="flex-1 p-4 flex flex-col justify-between" data-v-ebc34cfc><div data-v-ebc34cfc><div class="flex items-start justify-between gap-2 mb-2" data-v-ebc34cfc><h3 class="font-bold text-foreground text-base lg:text-lg line-clamp-2 group-hover:text-purple-600 transition-colors" data-v-ebc34cfc>${ssrInterpolate(tutorial.title)}</h3> `);
          if (tutorial.category) {
            _push(`<span class="px-2 py-0.5 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 text-xs rounded-full whitespace-nowrap" data-v-ebc34cfc>${ssrInterpolate(tutorial.category)}</span>`);
          } else {
            _push(`<!---->`);
          }
          _push(`</div> `);
          if (tutorial.description) {
            _push(`<p class="text-sm text-muted-foreground line-clamp-2 leading-relaxed" data-v-ebc34cfc>${ssrInterpolate(tutorial.description)}</p>`);
          } else {
            _push(`<!---->`);
          }
          _push(`</div> <div class="flex items-center justify-between mt-3 pt-3 border-t border-border" data-v-ebc34cfc><span class="text-xs text-muted-foreground" data-v-ebc34cfc><i class="ti ti-clock ml-1" data-v-ebc34cfc></i> ${ssrInterpolate(tutorial.duration ? formatDuration(tutorial.duration) : "\u0628\u062F\u0648\u0646 \u0645\u062F\u062A")}</span> <span class="text-xs text-purple-600 font-medium flex items-center gap-1 group-hover:gap-2 transition-all" data-v-ebc34cfc>
                    \u0645\u0634\u0627\u0647\u062F\u0647 \u0648\u06CC\u062F\u06CC\u0648
                    <i class="ti ti-chevron-left" data-v-ebc34cfc></i></span></div></div></div></div>`);
        });
        _push(`<!--]--> `);
        if (!loading.value && filteredTutorials.value.length === 0) {
          _push(`<div class="text-center py-16" data-v-ebc34cfc><div class="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 flex items-center justify-center" data-v-ebc34cfc><i class="ti ti-video-off text-4xl text-purple-400" data-v-ebc34cfc></i></div> <h3 class="text-lg font-semibold text-foreground mb-2" data-v-ebc34cfc>${ssrInterpolate(selectedCategory.value ? "\u0648\u06CC\u062F\u06CC\u0648\u06CC\u06CC \u062F\u0631 \u0627\u06CC\u0646 \u062F\u0633\u062A\u0647 \u06CC\u0627\u0641\u062A \u0646\u0634\u062F" : "\u0647\u0646\u0648\u0632 \u0648\u06CC\u062F\u06CC\u0648\u06CC\u06CC \u0645\u0646\u062A\u0634\u0631 \u0646\u0634\u062F\u0647")}</h3> <p class="text-muted-foreground max-w-sm mx-auto" data-v-ebc34cfc>${ssrInterpolate(selectedCategory.value ? "\u062F\u0633\u062A\u0647\u200C\u0628\u0646\u062F\u06CC \u062F\u06CC\u06AF\u0631\u06CC \u0631\u0627 \u0627\u0646\u062A\u062E\u0627\u0628 \u06A9\u0646\u06CC\u062F" : "\u0628\u0647 \u0632\u0648\u062F\u06CC \u0648\u06CC\u062F\u06CC\u0648\u0647\u0627\u06CC \u0622\u0645\u0648\u0632\u0634\u06CC \u0627\u0636\u0627\u0641\u0647 \u062E\u0648\u0627\u0647\u0646\u062F \u0634\u062F")}</p> `);
          if (selectedCategory.value) {
            _push(`<button class="mt-4 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors" data-v-ebc34cfc>
              \u0646\u0645\u0627\u06CC\u0634 \u0647\u0645\u0647 \u0648\u06CC\u062F\u06CC\u0648\u0647\u0627
            </button>`);
          } else {
            _push(`<!---->`);
          }
          _push(`</div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div>`);
      }
      _push(`</div></div> `);
      ssrRenderTeleport(_push, (_push2) => {
        if (showModal.value && selectedTutorial.value) {
          _push2(`<div class="fixed inset-0 z-[100] flex items-center justify-center p-4" data-v-ebc34cfc><div class="absolute inset-0 bg-black/80 backdrop-blur-sm" data-v-ebc34cfc></div> <div class="relative w-full max-w-4xl bg-card rounded-2xl overflow-hidden shadow-2xl z-10 max-h-[90vh] overflow-y-auto" data-v-ebc34cfc><button class="absolute top-4 left-4 z-20 w-10 h-10 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-black/70 transition-colors" data-v-ebc34cfc><i class="ti ti-x text-xl" data-v-ebc34cfc></i></button> <div class="aspect-video bg-black relative" data-v-ebc34cfc>`);
          if (getEmbedUrl(selectedTutorial.value.video_url)) {
            _push2(`<iframe${ssrRenderAttr("src", getEmbedUrl(selectedTutorial.value.video_url))} class="w-full h-full" allowfullscreen allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" data-v-ebc34cfc></iframe>`);
          } else {
            _push2(`<div class="w-full h-full flex flex-col items-center justify-center text-white" data-v-ebc34cfc><i class="ti ti-video-off text-5xl mb-4 opacity-50" data-v-ebc34cfc></i> <p class="text-lg mb-4" data-v-ebc34cfc>\u0648\u06CC\u062F\u06CC\u0648 \u0642\u0627\u0628\u0644 \u0646\u0645\u0627\u06CC\u0634 \u062F\u0631 \u0627\u06CC\u0646 \u0642\u0627\u0644\u0628 \u0646\u06CC\u0633\u062A</p> <a${ssrRenderAttr("href", selectedTutorial.value.video_url)} target="_blank" class="px-6 py-3 bg-purple-600 hover:bg-purple-700 rounded-xl text-white font-medium flex items-center gap-2 transition-colors" data-v-ebc34cfc><i class="ti ti-external-link" data-v-ebc34cfc></i>
                  \u0645\u0634\u0627\u0647\u062F\u0647 \u062F\u0631 \u0633\u0627\u06CC\u062A \u0627\u0635\u0644\u06CC
                </a></div>`);
          }
          _push2(`</div> <div class="p-6" data-v-ebc34cfc><div class="flex items-start justify-between gap-4 mb-4" data-v-ebc34cfc><h2 class="text-xl font-bold text-foreground" data-v-ebc34cfc>${ssrInterpolate(selectedTutorial.value.title)}</h2> `);
          if (selectedTutorial.value.category) {
            _push2(`<span class="px-3 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 text-sm rounded-full whitespace-nowrap" data-v-ebc34cfc>${ssrInterpolate(selectedTutorial.value.category)}</span>`);
          } else {
            _push2(`<!---->`);
          }
          _push2(`</div> `);
          if (selectedTutorial.value.description) {
            _push2(`<p class="text-muted-foreground leading-relaxed" data-v-ebc34cfc>${ssrInterpolate(selectedTutorial.value.description)}</p>`);
          } else {
            _push2(`<!---->`);
          }
          _push2(` `);
          if (selectedTutorial.value.duration) {
            _push2(`<div class="mt-4 pt-4 border-t border-border" data-v-ebc34cfc><span class="text-sm text-muted-foreground" data-v-ebc34cfc><i class="ti ti-clock ml-1" data-v-ebc34cfc></i>
                  \u0645\u062F\u062A \u0632\u0645\u0627\u0646: ${ssrInterpolate(formatDuration(selectedTutorial.value.duration))}</span></div>`);
          } else {
            _push2(`<!---->`);
          }
          _push2(`</div></div></div>`);
        } else {
          _push2(`<!---->`);
        }
      }, "body", false, _parent);
      _push(`</div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/profile/tutorials.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const tutorials = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-ebc34cfc"]]);

export { tutorials as default };
//# sourceMappingURL=tutorials-ClPUascC.mjs.map
