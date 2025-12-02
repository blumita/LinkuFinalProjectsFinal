import { defineComponent, computed, toValue, getCurrentInstance, onServerPrefetch, ref, reactive, mergeProps, unref, shallowRef, toRef, nextTick, createVNode, resolveDynamicComponent, watch, withCtx, createBlock, openBlock, Fragment, renderList, createTextVNode, toDisplayString, createCommentVNode, Transition, withDirectives, withKeys, vModelText, resolveComponent, withModifiers, vModelSelect, vModelRadio, vModelCheckbox, useSSRContext } from 'vue';
import { a as useNuxtApp, j as asyncDataDefaults, k as createError, _ as __nuxt_component_0$3 } from './server.mjs';
import { p as publicAssetsURL } from '../routes/renderer.mjs';
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderStyle, ssrInterpolate, ssrRenderList, ssrIncludeBooleanAttr, ssrRenderClass, ssrRenderVNode, ssrRenderSlot, ssrRenderAttr, ssrLooseContain, ssrLooseEqual } from 'vue/server-renderer';
import { u as useFormStore } from './form-CUJQskNk.mjs';
import { u as useIconComponents } from './useIconComponentsMap-DPTCqB5g.mjs';
import { _ as _export_sfc } from './_plugin-vue_export-helper-1tPrXgE0.mjs';
import confetti from 'canvas-confetti';
import { I as InfoToast } from './InfoToast-DdxwJ7kO.mjs';
import { _ as __nuxt_component_0 } from './BottomSheet-DZASh2SV.mjs';

//#region src/index.ts
const DEBOUNCE_DEFAULTS = { trailing: true };
/**
Debounce functions
@param fn - Promise-returning/async function to debounce.
@param wait - Milliseconds to wait before calling `fn`. Default value is 25ms
@returns A function that delays calling `fn` until after `wait` milliseconds have elapsed since the last time it was called.
@example
```
import { debounce } from 'perfect-debounce';
const expensiveCall = async input => input;
const debouncedFn = debounce(expensiveCall, 200);
for (const number of [1, 2, 3]) {
console.log(await debouncedFn(number));
}
//=> 1
//=> 2
//=> 3
```
*/
function debounce(fn, wait = 25, options = {}) {
	options = {
		...DEBOUNCE_DEFAULTS,
		...options
	};
	if (!Number.isFinite(wait)) throw new TypeError("Expected `wait` to be a finite number");
	let leadingValue;
	let timeout;
	let resolveList = [];
	let currentPromise;
	let trailingArgs;
	const applyFn = (_this, args) => {
		currentPromise = _applyPromised(fn, _this, args);
		currentPromise.finally(() => {
			currentPromise = null;
			if (options.trailing && trailingArgs && !timeout) {
				const promise = applyFn(_this, trailingArgs);
				trailingArgs = null;
				return promise;
			}
		});
		return currentPromise;
	};
	const debounced = function(...args) {
		if (options.trailing) trailingArgs = args;
		if (currentPromise) return currentPromise;
		return new Promise((resolve) => {
			const shouldCallNow = !timeout && options.leading;
			clearTimeout(timeout);
			timeout = setTimeout(() => {
				timeout = null;
				const promise = options.leading ? leadingValue : applyFn(this, args);
				trailingArgs = null;
				for (const _resolve of resolveList) _resolve(promise);
				resolveList = [];
			}, wait);
			if (shouldCallNow) {
				leadingValue = applyFn(this, args);
				resolve(leadingValue);
			} else resolveList.push(resolve);
		});
	};
	const _clearTimeout = (timer) => {
		if (timer) {
			clearTimeout(timer);
			timeout = null;
		}
	};
	debounced.isPending = () => !!timeout;
	debounced.cancel = () => {
		_clearTimeout(timeout);
		resolveList = [];
		trailingArgs = null;
	};
	debounced.flush = () => {
		_clearTimeout(timeout);
		if (!trailingArgs || currentPromise) return;
		const args = trailingArgs;
		trailingArgs = null;
		return applyFn(this, args);
	};
	return debounced;
}
async function _applyPromised(fn, _this, args) {
	return await fn.apply(_this, args);
}

const isDefer = (dedupe) => dedupe === "defer" || dedupe === false;
function useAsyncData(...args) {
  var _a, _b, _c, _d, _e, _f, _g, _h;
  const autoKey = typeof args[args.length - 1] === "string" ? args.pop() : void 0;
  if (_isAutoKeyNeeded(args[0], args[1])) {
    args.unshift(autoKey);
  }
  let [_key, _handler, options = {}] = args;
  const key = computed(() => toValue(_key));
  if (typeof key.value !== "string") {
    throw new TypeError("[nuxt] [useAsyncData] key must be a string.");
  }
  if (typeof _handler !== "function") {
    throw new TypeError("[nuxt] [useAsyncData] handler must be a function.");
  }
  const nuxtApp = useNuxtApp();
  (_a = options.server) != null ? _a : options.server = true;
  (_b = options.default) != null ? _b : options.default = getDefault;
  (_c = options.getCachedData) != null ? _c : options.getCachedData = getDefaultCachedData;
  (_d = options.lazy) != null ? _d : options.lazy = false;
  (_e = options.immediate) != null ? _e : options.immediate = true;
  (_f = options.deep) != null ? _f : options.deep = asyncDataDefaults.deep;
  (_g = options.dedupe) != null ? _g : options.dedupe = "cancel";
  options._functionName || "useAsyncData";
  nuxtApp._asyncData[key.value];
  const initialFetchOptions = { cause: "initial", dedupe: options.dedupe };
  if (!((_h = nuxtApp._asyncData[key.value]) == null ? void 0 : _h._init)) {
    initialFetchOptions.cachedData = options.getCachedData(key.value, nuxtApp, { cause: "initial" });
    nuxtApp._asyncData[key.value] = createAsyncData(nuxtApp, key.value, _handler, options, initialFetchOptions.cachedData);
  }
  const asyncData = nuxtApp._asyncData[key.value];
  asyncData._deps++;
  const initialFetch = () => nuxtApp._asyncData[key.value].execute(initialFetchOptions);
  const fetchOnServer = options.server !== false && nuxtApp.payload.serverRendered;
  if (fetchOnServer && options.immediate) {
    const promise = initialFetch();
    if (getCurrentInstance()) {
      onServerPrefetch(() => promise);
    } else {
      nuxtApp.hook("app:created", async () => {
        await promise;
      });
    }
  }
  const asyncReturn = {
    data: writableComputedRef(() => {
      var _a2;
      return (_a2 = nuxtApp._asyncData[key.value]) == null ? void 0 : _a2.data;
    }),
    pending: writableComputedRef(() => {
      var _a2;
      return (_a2 = nuxtApp._asyncData[key.value]) == null ? void 0 : _a2.pending;
    }),
    status: writableComputedRef(() => {
      var _a2;
      return (_a2 = nuxtApp._asyncData[key.value]) == null ? void 0 : _a2.status;
    }),
    error: writableComputedRef(() => {
      var _a2;
      return (_a2 = nuxtApp._asyncData[key.value]) == null ? void 0 : _a2.error;
    }),
    refresh: (...args2) => nuxtApp._asyncData[key.value].execute(...args2),
    execute: (...args2) => nuxtApp._asyncData[key.value].execute(...args2),
    clear: () => clearNuxtDataByKey(nuxtApp, key.value)
  };
  const asyncDataPromise = Promise.resolve(nuxtApp._asyncDataPromises[key.value]).then(() => asyncReturn);
  Object.assign(asyncDataPromise, asyncReturn);
  return asyncDataPromise;
}
function writableComputedRef(getter) {
  return computed({
    get() {
      var _a;
      return (_a = getter()) == null ? void 0 : _a.value;
    },
    set(value) {
      const ref2 = getter();
      if (ref2) {
        ref2.value = value;
      }
    }
  });
}
function _isAutoKeyNeeded(keyOrFetcher, fetcher) {
  if (typeof keyOrFetcher === "string") {
    return false;
  }
  if (typeof keyOrFetcher === "object" && keyOrFetcher !== null) {
    return false;
  }
  if (typeof keyOrFetcher === "function" && typeof fetcher === "function") {
    return false;
  }
  return true;
}
function clearNuxtDataByKey(nuxtApp, key) {
  if (key in nuxtApp.payload.data) {
    nuxtApp.payload.data[key] = void 0;
  }
  if (key in nuxtApp.payload._errors) {
    nuxtApp.payload._errors[key] = asyncDataDefaults.errorValue;
  }
  if (nuxtApp._asyncData[key]) {
    nuxtApp._asyncData[key].data.value = void 0;
    nuxtApp._asyncData[key].error.value = asyncDataDefaults.errorValue;
    {
      nuxtApp._asyncData[key].pending.value = false;
    }
    nuxtApp._asyncData[key].status.value = "idle";
  }
  if (key in nuxtApp._asyncDataPromises) {
    if (nuxtApp._asyncDataPromises[key]) {
      nuxtApp._asyncDataPromises[key].cancelled = true;
    }
    nuxtApp._asyncDataPromises[key] = void 0;
  }
}
function pick(obj, keys) {
  const newObj = {};
  for (const key of keys) {
    newObj[key] = obj[key];
  }
  return newObj;
}
function createAsyncData(nuxtApp, key, _handler, options, initialCachedData) {
  var _a, _b;
  (_b = (_a = nuxtApp.payload._errors)[key]) != null ? _b : _a[key] = asyncDataDefaults.errorValue;
  const hasCustomGetCachedData = options.getCachedData !== getDefaultCachedData;
  const handler = _handler ;
  const _ref = options.deep ? ref : shallowRef;
  const hasCachedData = initialCachedData != null;
  const unsubRefreshAsyncData = nuxtApp.hook("app:data:refresh", async (keys) => {
    if (!keys || keys.includes(key)) {
      await asyncData.execute({ cause: "refresh:hook" });
    }
  });
  const asyncData = {
    data: _ref(hasCachedData ? initialCachedData : options.default()),
    pending: shallowRef(!hasCachedData),
    error: toRef(nuxtApp.payload._errors, key),
    status: shallowRef("idle"),
    execute: (...args) => {
      var _a2, _b2;
      const [_opts, newValue = void 0] = args;
      const opts = _opts && newValue === void 0 && typeof _opts === "object" ? _opts : {};
      if (nuxtApp._asyncDataPromises[key]) {
        if (isDefer((_a2 = opts.dedupe) != null ? _a2 : options.dedupe)) {
          return nuxtApp._asyncDataPromises[key];
        }
        nuxtApp._asyncDataPromises[key].cancelled = true;
      }
      if (opts.cause === "initial" || nuxtApp.isHydrating) {
        const cachedData = "cachedData" in opts ? opts.cachedData : options.getCachedData(key, nuxtApp, { cause: (_b2 = opts.cause) != null ? _b2 : "refresh:manual" });
        if (cachedData != null) {
          nuxtApp.payload.data[key] = asyncData.data.value = cachedData;
          asyncData.error.value = asyncDataDefaults.errorValue;
          asyncData.status.value = "success";
          return Promise.resolve(cachedData);
        }
      }
      {
        asyncData.pending.value = true;
      }
      asyncData.status.value = "pending";
      const promise = new Promise(
        (resolve, reject) => {
          try {
            resolve(handler(nuxtApp));
          } catch (err) {
            reject(err);
          }
        }
      ).then(async (_result) => {
        if (promise.cancelled) {
          return nuxtApp._asyncDataPromises[key];
        }
        let result = _result;
        if (options.transform) {
          result = await options.transform(_result);
        }
        if (options.pick) {
          result = pick(result, options.pick);
        }
        nuxtApp.payload.data[key] = result;
        asyncData.data.value = result;
        asyncData.error.value = asyncDataDefaults.errorValue;
        asyncData.status.value = "success";
      }).catch((error) => {
        if (promise.cancelled) {
          return nuxtApp._asyncDataPromises[key];
        }
        asyncData.error.value = createError(error);
        asyncData.data.value = unref(options.default());
        asyncData.status.value = "error";
      }).finally(() => {
        if (promise.cancelled) {
          return;
        }
        {
          asyncData.pending.value = false;
        }
        delete nuxtApp._asyncDataPromises[key];
      });
      nuxtApp._asyncDataPromises[key] = promise;
      return nuxtApp._asyncDataPromises[key];
    },
    _execute: debounce((...args) => asyncData.execute(...args), 0, { leading: true }),
    _default: options.default,
    _deps: 0,
    _init: true,
    _hash: void 0,
    _off: () => {
      var _a2;
      unsubRefreshAsyncData();
      if ((_a2 = nuxtApp._asyncData[key]) == null ? void 0 : _a2._init) {
        nuxtApp._asyncData[key]._init = false;
      }
      if (!hasCustomGetCachedData) {
        nextTick(() => {
          var _a3;
          if (!((_a3 = nuxtApp._asyncData[key]) == null ? void 0 : _a3._init)) {
            clearNuxtDataByKey(nuxtApp, key);
            asyncData.execute = () => Promise.resolve();
            asyncData.data.value = asyncDataDefaults.value;
          }
        });
      }
    }
  };
  return asyncData;
}
const getDefault = () => asyncDataDefaults.value;
const getDefaultCachedData = (key, nuxtApp, ctx) => {
  if (nuxtApp.isHydrating) {
    return nuxtApp.payload.data[key];
  }
  if (ctx.cause !== "refresh:manual" && ctx.cause !== "refresh:hook") {
    return nuxtApp.static.data[key];
  }
};
const _imports_1 = publicAssetsURL("/logo/logo.png");
const _imports_0 = publicAssetsURL("/logo.svg");
const _sfc_main$m = {
  __name: "BaseModal",
  __ssrInlineRender: true,
  props: {
    modelValue: Boolean,
    // v-model:visible
    mobileSlide: { type: Boolean, default: true },
    desktopSlide: { type: Boolean, default: true },
    width: { type: String, default: "w-full" },
    height: { type: String, default: "h-fit" },
    rounded: { type: String, default: "lg:rounded-2xl rounded-t-2xl overflow-hidden" },
    zIndex: { type: String, default: "z-[999]" },
    rtl: { type: Boolean, default: true }
  },
  emits: ["update:modelValue", "close"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    ref(false);
    const inited = ref(false);
    watch(() => props.modelValue, (val) => {
      if (inited.value) ;
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<!--[-->`);
      if (props.modelValue && inited.value) {
        _push(`<div class="fixed inset-0 bg-stone-900/20 z-[998]" data-v-71b5c2b3></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(` <template>`);
      if (props.modelValue) {
        _push(`<div class="${ssrRenderClass([
          "fixed flex flex-col text-sm text-gray-800  h-screen min-h-96 max-h-[60vh] bg-white overflow-hidden",
          __props.zIndex,
          __props.width,
          __props.height,
          __props.rounded,
          __props.rtl ? "rtl:right-0 ltr:left-0" : "left-0",
          "bottom-0"
        ])}" data-v-71b5c2b3>`);
        ssrRenderSlot(_ctx.$slots, "header", {}, null, _push, _parent);
        _push(` <div class="flex-1 overflow-y-auto" data-v-71b5c2b3>`);
        ssrRenderSlot(_ctx.$slots, "default", {}, null, _push, _parent);
        _push(`</div> `);
        ssrRenderSlot(_ctx.$slots, "footer", {}, null, _push, _parent);
        _push(`</div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</template><!--]-->`);
    };
  }
};
const _sfc_setup$m = _sfc_main$m.setup;
_sfc_main$m.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/UserDashboard/main/EditCard/Preview/items/Modals/BaseModal.vue");
  return _sfc_setup$m ? _sfc_setup$m(props, ctx) : void 0;
};
const BaseModal = /* @__PURE__ */ _export_sfc(_sfc_main$m, [["__scopeId", "data-v-71b5c2b3"]]);
const _sfc_main$l = {
  __name: "poll",
  __ssrInlineRender: true,
  props: {
    link: {
      type: Object,
      required: true
    },
    formData: {
      type: Object,
      required: false,
      default: () => ({})
    },
    isDarkTheme: {
      type: Boolean,
      default: false
    },
    isLightTheme: {
      type: Boolean,
      default: false
    },
    isBackgroundDark: {
      type: Boolean,
      default: false
    }
  },
  emits: "message",
  setup(__props, { emit: __emit }) {
    ref(false);
    const props = __props;
    const emit = __emit;
    const { getIconComponent } = useIconComponents();
    const formStore = useFormStore();
    const formData = computed(() => props.formData || formStore);
    const iconData = computed(() => {
      var _a;
      return ((_a = props.link) == null ? void 0 : _a.icon) || null;
    });
    const iconColor = computed(() => {
      var _a;
      if (((_a = formStore.iconColor) == null ? void 0 : _a.background) && formStore.iconColor.background !== "transparent") {
        return formStore.iconColor.background;
      }
      return void 0;
    });
    const isIconFilled = computed(() => {
      var _a;
      return !!(((_a = formStore.iconColor) == null ? void 0 : _a.background) && formStore.iconColor.background !== "transparent");
    });
    const iconComponent = computed(() => {
      const component = getIconComponent(iconData.value);
      if (!component) {
        return "div";
      }
      return component;
    });
    const showPoll = ref(false);
    ref(false);
    const link = props.link;
    const options = ref(
      (link.options || ["Option 1", "Option 2", "Option 3"]).map(
        (opt) => {
          var _a;
          return typeof opt === "string" ? { text: opt, votes: 1 } : { ...opt, votes: (_a = opt.votes) != null ? _a : 1 };
        }
      )
    );
    const selected = ref(null);
    const voted = ref(false);
    const totalVotes = computed(
      () => options.value.reduce((sum, o) => sum + (o.votes || 0), 0)
    );
    function getPercent(votes) {
      if (!totalVotes.value) return 0;
      return Math.round(votes / totalVotes.value * 100);
    }
    const { $axios } = useNuxtApp();
    async function vote() {
      if (selected.value !== null) {
        voted.value = true;
        try {
          await $axios.post(`/links/${props.link.hash}/vote/${selected.value}`);
          const option = options.value.find((o) => o.id === selected.value);
          if (option) option.votes++;
          const res = await $axios.get(`/links/${props.link.hash}/polls`);
          emit("message", res.data.message || "\u0631\u0623\u06CC \u0634\u0645\u0627 \u0628\u0627 \u0645\u0648\u0641\u0642\u06CC\u062A \u062B\u0628\u062A \u0634\u062F");
          options.value = res.data.poll.options.map((opt) => {
            var _a;
            return {
              id: opt.id,
              text: opt.text,
              votes: (_a = opt.votes_count) != null ? _a : 0
            };
          });
          const audio = new Audio("/sounds/success.mp3");
          audio.volume = 0.3;
          audio.play().catch(() => {
          });
        } catch (err) {
        }
      }
    }
    function closePoll() {
      showPoll.value = false;
    }
    return (_ctx, _push, _parent, _attrs) => {
      var _a, _b, _c, _d;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "w-full" }, _attrs))} data-v-483160f5><div class="${ssrRenderClass([
        "backdrop-blur rounded-xl overflow-hidden",
        __props.isDarkTheme ? "bg-white/[0.02]" : __props.isLightTheme ? "bg-black/[0.02]" : "bg-gradient-to-br from-white/60 via-white/30 to-white/10 border border-white/20"
      ])}" data-v-483160f5><button tabindex="0" role="button" class="${ssrRenderClass("flex items-center gap-4 p-2 w-full cursor-pointer hover:bg-white/20 transition-all duration-200 " + (((_a = formData.value) == null ? void 0 : _a.layout) === "left" ? "text-left" : "text-right"))}" data-v-483160f5><div class="${ssrRenderClass(["flex items-center justify-center flex-shrink-0 rounded-xl overflow-hidden w-12 h-12", __props.isDarkTheme || __props.isLightTheme ? "" : "bg-white"])}" data-v-483160f5>`);
      ssrRenderVNode(_push, createVNode(resolveDynamicComponent(iconComponent.value), mergeProps({ size: 50 }, iconColor.value ? { color: iconColor.value, filled: isIconFilled.value } : {}), null), _parent);
      _push(`</div> <div class="${ssrRenderClass("flex flex-col justify-center flex-1 min-w-0 " + (((_b = formData.value) == null ? void 0 : _b.layout) === "left" ? "text-left" : "text-right"))}" data-v-483160f5><div class="${ssrRenderClass(["font-semibold text-sm leading-snug mb-1 " + (((_c = formData.value) == null ? void 0 : _c.layout) === "left" ? "text-left" : "text-right"), __props.isDarkTheme ? "text-white" : "text-gray-800"])}" data-v-483160f5>${ssrInterpolate(unref(link).title || "What is your opinion?")}</div> <div class="${ssrRenderClass("text-xs font-medium leading-relaxed flex items-center gap-1 " + (((_d = formData.value) == null ? void 0 : _d.layout) === "left" ? "text-left" : "text-right"))}" data-v-483160f5><span class="${ssrRenderClass(__props.isDarkTheme ? "text-gray-300" : "text-gray-500")}" data-v-483160f5>${ssrInterpolate(unref(link).description || "Participate in the poll")}</span></div></div></button></div> `);
      _push(ssrRenderComponent(BaseModal, {
        modelValue: showPoll.value,
        "onUpdate:modelValue": ($event) => showPoll.value = $event
      }, {
        header: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="flex justify-between items-center p-4 border-b border-gray-100 bg-white" data-v-483160f5${_scopeId}><div class="flex items-center gap-3" data-v-483160f5${_scopeId}>`);
            ssrRenderVNode(_push2, createVNode(resolveDynamicComponent(iconComponent.value), mergeProps({ size: 50 }, iconColor.value ? { color: iconColor.value, filled: isIconFilled.value } : {}), null), _parent2, _scopeId);
            _push2(` <h3 class="text-lg font-semibold text-gray-800" data-v-483160f5${_scopeId}>\u0646\u0638\u0631 \u0633\u0646\u062C\u06CC</h3></div> <button class="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors" data-v-483160f5${_scopeId}><i class="ti ti-x text-lg" data-v-483160f5${_scopeId}></i></button></div>`);
          } else {
            return [
              createVNode("div", { class: "flex justify-between items-center p-4 border-b border-gray-100 bg-white" }, [
                createVNode("div", { class: "flex items-center gap-3" }, [
                  (openBlock(), createBlock(resolveDynamicComponent(iconComponent.value), mergeProps({ size: 50 }, iconColor.value ? { color: iconColor.value, filled: isIconFilled.value } : {}), null, 16)),
                  createTextVNode(),
                  createVNode("h3", { class: "text-lg font-semibold text-gray-800" }, "\u0646\u0638\u0631 \u0633\u0646\u062C\u06CC")
                ]),
                createTextVNode(),
                createVNode("button", {
                  class: "w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors",
                  onClick: closePoll
                }, [
                  createVNode("i", { class: "ti ti-x text-lg" })
                ])
              ])
            ];
          }
        }),
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          var _a2, _b2, _c2, _d2;
          if (_push2) {
            _push2(`<div class="${ssrRenderClass([((_a2 = formData.value) == null ? void 0 : _a2.layout) === "left" ? "text-left" : "text-right", "flex-1 overflow-y-auto p-4"])}" data-v-483160f5${_scopeId}><div class="${ssrRenderClass([((_b2 = formData.value) == null ? void 0 : _b2.layout) === "left" ? "text-left" : "text-right", "text-lg font-semibold text-gray-800 mb-6 leading-relaxed"])}" data-v-483160f5${_scopeId}>${ssrInterpolate(unref(link).title || "What is your opinion?")}</div> `);
            if (!voted.value) {
              _push2(`<!--[--><div class="space-y-3 mb-6" data-v-483160f5${_scopeId}><!--[-->`);
              ssrRenderList(options.value, (option, idx) => {
                var _a3, _b3;
                _push2(`<div class="group relative" data-v-483160f5${_scopeId}><div class="${ssrRenderClass([[
                  selected.value === idx ? "bg-blue-50 border-2 border-blue-500" : "bg-gray-50 border-2 border-transparent hover:bg-gray-100",
                  ((_a3 = formData.value) == null ? void 0 : _a3.layout) === "left" ? "text-left" : "text-right"
                ], "flex items-center gap-3 p-4 rounded-lg cursor-pointer transition-all duration-200"])}" data-v-483160f5${_scopeId}><div class="${ssrRenderClass([[
                  selected.value === option.id ? "border-blue-500 bg-blue-500" : "border-gray-300 group-hover:border-blue-400"
                ], "flex-shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all"])}" data-v-483160f5${_scopeId}>`);
                if (selected.value === option.id) {
                  _push2(`<div class="w-2 h-2 bg-white rounded-full" data-v-483160f5${_scopeId}></div>`);
                } else {
                  _push2(`<!---->`);
                }
                _push2(`</div> <span class="${ssrRenderClass([[
                  selected.value === option.id ? "text-blue-700" : "text-gray-700",
                  ((_b3 = formData.value) == null ? void 0 : _b3.layout) === "left" ? "text-left" : "text-right"
                ], "flex-1 text-sm font-medium"])}" data-v-483160f5${_scopeId}>${ssrInterpolate(option.text)}</span></div></div>`);
              });
              _push2(`<!--]--></div> <button class="${ssrRenderClass([[
                selected.value !== null ? "bg-blue-500 hover:bg-blue-600 text-white shadow-sm" : "bg-gray-200 text-gray-400"
              ], "w-full py-3 px-4 rounded-lg font-semibold text-sm transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"])}"${ssrIncludeBooleanAttr(selected.value === null) ? " disabled" : ""} data-v-483160f5${_scopeId}>
              Vote
            </button><!--]-->`);
            } else {
              _push2(`<!--[--><div class="space-y-3 mb-6" data-v-483160f5${_scopeId}><!--[-->`);
              ssrRenderList(options.value, (option, idx) => {
                var _a3;
                _push2(`<div class="relative" data-v-483160f5${_scopeId}><div class="p-4 rounded-lg bg-gray-50 relative overflow-hidden" data-v-483160f5${_scopeId}><div class="${ssrRenderClass([[
                  selected.value === option.id ? "bg-blue-500" : "bg-gray-300"
                ], "absolute right-0 top-0 h-full rounded-lg transition-all duration-700 ease-out"])}" style="${ssrRenderStyle({ width: getPercent(option.votes) + "%" })}" data-v-483160f5${_scopeId}></div> <div class="relative flex justify-between items-center" data-v-483160f5${_scopeId}><div class="flex items-center gap-3" data-v-483160f5${_scopeId}>`);
                if (selected.value === option.id) {
                  _push2(`<div class="w-5 h-5 rounded-full bg-white flex items-center justify-center" data-v-483160f5${_scopeId}><i class="ti ti-check text-blue-500 text-xs" data-v-483160f5${_scopeId}></i></div>`);
                } else {
                  _push2(`<!---->`);
                }
                _push2(` <span class="${ssrRenderClass([[
                  getPercent(option.votes) > 15 && selected.value === option.id ? "text-white" : getPercent(option.votes) > 15 ? "text-white" : "text-gray-700"
                ], "font-bold text-sm"])}" data-v-483160f5${_scopeId}>${ssrInterpolate(getPercent(option.votes))}%
                      </span></div> <span class="${ssrRenderClass([[
                  getPercent(option.votes) > 15 && selected.value === option.id ? "text-white" : getPercent(option.votes) > 15 ? "text-white" : "text-gray-700",
                  ((_a3 = formData.value) == null ? void 0 : _a3.layout) === "left" ? "text-left" : "text-right"
                ], "text-sm font-medium"])}" data-v-483160f5${_scopeId}>${ssrInterpolate(option.text)}</span></div></div></div>`);
              });
              _push2(`<!--]--></div> <div class="text-center space-y-2" data-v-483160f5${_scopeId}><div class="text-sm text-gray-500" data-v-483160f5${_scopeId}><i class="ti ti-users text-gray-400 ml-1" data-v-483160f5${_scopeId}></i> ${ssrInterpolate(totalVotes.value)} \u0646\u0638\u0631 \u062B\u0628\u062A \u0634\u062F\u0647
              </div> <div class="text-sm text-blue-600 font-medium" data-v-483160f5${_scopeId}><i class="ti ti-check-circle text-blue-600 ml-1" data-v-483160f5${_scopeId}></i>
                \u0646\u0637\u0631 \u0634\u0645\u0627 \u062B\u0628\u062A \u0634\u062F
              </div></div><!--]-->`);
            }
            _push2(`</div>`);
          } else {
            return [
              createVNode("div", {
                class: ["flex-1 overflow-y-auto p-4", ((_c2 = formData.value) == null ? void 0 : _c2.layout) === "left" ? "text-left" : "text-right"]
              }, [
                createVNode("div", {
                  class: ["text-lg font-semibold text-gray-800 mb-6 leading-relaxed", ((_d2 = formData.value) == null ? void 0 : _d2.layout) === "left" ? "text-left" : "text-right"]
                }, toDisplayString(unref(link).title || "What is your opinion?"), 3),
                createTextVNode(),
                !voted.value ? (openBlock(), createBlock(Fragment, { key: 0 }, [
                  createVNode("div", { class: "space-y-3 mb-6" }, [
                    (openBlock(true), createBlock(Fragment, null, renderList(options.value, (option, idx) => {
                      var _a3, _b3;
                      return openBlock(), createBlock("div", {
                        key: idx,
                        class: "group relative"
                      }, [
                        createVNode("div", {
                          class: ["flex items-center gap-3 p-4 rounded-lg cursor-pointer transition-all duration-200", [
                            selected.value === idx ? "bg-blue-50 border-2 border-blue-500" : "bg-gray-50 border-2 border-transparent hover:bg-gray-100",
                            ((_a3 = formData.value) == null ? void 0 : _a3.layout) === "left" ? "text-left" : "text-right"
                          ]],
                          onClick: ($event) => selected.value = option.id
                        }, [
                          createVNode("div", {
                            class: ["flex-shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all", [
                              selected.value === option.id ? "border-blue-500 bg-blue-500" : "border-gray-300 group-hover:border-blue-400"
                            ]]
                          }, [
                            selected.value === option.id ? (openBlock(), createBlock("div", {
                              key: 0,
                              class: "w-2 h-2 bg-white rounded-full"
                            })) : createCommentVNode("", true)
                          ], 2),
                          createTextVNode(),
                          createVNode("span", {
                            class: ["flex-1 text-sm font-medium", [
                              selected.value === option.id ? "text-blue-700" : "text-gray-700",
                              ((_b3 = formData.value) == null ? void 0 : _b3.layout) === "left" ? "text-left" : "text-right"
                            ]]
                          }, toDisplayString(option.text), 3)
                        ], 10, ["onClick"])
                      ]);
                    }), 128))
                  ]),
                  createTextVNode(),
                  createVNode("button", {
                    class: ["w-full py-3 px-4 rounded-lg font-semibold text-sm transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed", [
                      selected.value !== null ? "bg-blue-500 hover:bg-blue-600 text-white shadow-sm" : "bg-gray-200 text-gray-400"
                    ]],
                    disabled: selected.value === null,
                    onClick: vote
                  }, "\r\n              Vote\r\n            ", 10, ["disabled"])
                ], 64)) : (openBlock(), createBlock(Fragment, { key: 1 }, [
                  createVNode("div", { class: "space-y-3 mb-6" }, [
                    (openBlock(true), createBlock(Fragment, null, renderList(options.value, (option, idx) => {
                      var _a3;
                      return openBlock(), createBlock("div", {
                        key: idx,
                        class: "relative"
                      }, [
                        createVNode("div", { class: "p-4 rounded-lg bg-gray-50 relative overflow-hidden" }, [
                          createVNode("div", {
                            class: ["absolute right-0 top-0 h-full rounded-lg transition-all duration-700 ease-out", [
                              selected.value === option.id ? "bg-blue-500" : "bg-gray-300"
                            ]],
                            style: { width: getPercent(option.votes) + "%" }
                          }, null, 6),
                          createTextVNode(),
                          createVNode("div", { class: "relative flex justify-between items-center" }, [
                            createVNode("div", { class: "flex items-center gap-3" }, [
                              selected.value === option.id ? (openBlock(), createBlock("div", {
                                key: 0,
                                class: "w-5 h-5 rounded-full bg-white flex items-center justify-center"
                              }, [
                                createVNode("i", { class: "ti ti-check text-blue-500 text-xs" })
                              ])) : createCommentVNode("", true),
                              createTextVNode(),
                              createVNode("span", {
                                class: ["font-bold text-sm", [
                                  getPercent(option.votes) > 15 && selected.value === option.id ? "text-white" : getPercent(option.votes) > 15 ? "text-white" : "text-gray-700"
                                ]]
                              }, toDisplayString(getPercent(option.votes)) + "%\r\n                      ", 3)
                            ]),
                            createTextVNode(),
                            createVNode("span", {
                              class: ["text-sm font-medium", [
                                getPercent(option.votes) > 15 && selected.value === option.id ? "text-white" : getPercent(option.votes) > 15 ? "text-white" : "text-gray-700",
                                ((_a3 = formData.value) == null ? void 0 : _a3.layout) === "left" ? "text-left" : "text-right"
                              ]]
                            }, toDisplayString(option.text), 3)
                          ])
                        ])
                      ]);
                    }), 128))
                  ]),
                  createTextVNode(),
                  createVNode("div", { class: "text-center space-y-2" }, [
                    createVNode("div", { class: "text-sm text-gray-500" }, [
                      createVNode("i", { class: "ti ti-users text-gray-400 ml-1" }),
                      createTextVNode(" " + toDisplayString(totalVotes.value) + " \u0646\u0638\u0631 \u062B\u0628\u062A \u0634\u062F\u0647\r\n              ", 1)
                    ]),
                    createTextVNode(),
                    createVNode("div", { class: "text-sm text-blue-600 font-medium" }, [
                      createVNode("i", { class: "ti ti-check-circle text-blue-600 ml-1" }),
                      createTextVNode("\r\n                \u0646\u0637\u0631 \u0634\u0645\u0627 \u062B\u0628\u062A \u0634\u062F\r\n              ")
                    ])
                  ])
                ], 64))
              ], 2)
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div>`);
    };
  }
};
const _sfc_setup$l = _sfc_main$l.setup;
_sfc_main$l.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/UserDashboard/main/EditCard/Preview/items/poll.vue");
  return _sfc_setup$l ? _sfc_setup$l(props, ctx) : void 0;
};
const poll = /* @__PURE__ */ _export_sfc(_sfc_main$l, [["__scopeId", "data-v-483160f5"]]);
const _sfc_main$k = {
  __name: "BaseModalGame",
  __ssrInlineRender: true,
  props: {
    modelValue: Boolean,
    // v-model:visible
    mobileSlide: { type: Boolean, default: true },
    desktopSlide: { type: Boolean, default: true },
    width: { type: String, default: "w-full" },
    height: { type: String, default: "h-fit" },
    rounded: { type: String, default: "lg:rounded-2xl rounded-t-2xl overflow-hidden" },
    zIndex: { type: String, default: "z-[999]" },
    rtl: { type: Boolean, default: true },
    maxHeight: { type: String, default: "70vh" }
    // prop جدید برای ارتفاع
  },
  emits: ["update:modelValue", "close"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    ref(false);
    const inited = ref(false);
    ref(null);
    watch(() => props.modelValue, (val) => {
      if (inited.value) ;
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<!--[-->`);
      if (props.modelValue && inited.value) {
        _push(`<div class="fixed inset-0 bg-stone-900/20 z-[998]" data-v-40afa3f0></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(` <template>`);
      if (props.modelValue) {
        _push(`<div class="${ssrRenderClass([
          "fixed flex flex-col text-sm text-gray-800 w-full bg-white overflow-hidden",
          __props.zIndex,
          __props.rounded,
          "bottom-0 left-0 right-0"
        ])}" style="${ssrRenderStyle({
          touchAction: "manipulation",
          WebkitOverflowScrolling: "touch",
          overscrollBehavior: "none",
          height: props.maxHeight,
          maxHeight: props.maxHeight
        })}" data-v-40afa3f0>`);
        ssrRenderSlot(_ctx.$slots, "header", {}, null, _push, _parent);
        _push(` <div class="flex-1 overflow-y-auto" style="${ssrRenderStyle({
          touchAction: "pan-y",
          WebkitOverflowScrolling: "touch",
          overscrollBehavior: "contain"
        })}" data-v-40afa3f0>`);
        ssrRenderSlot(_ctx.$slots, "default", {}, null, _push, _parent);
        _push(`</div> `);
        ssrRenderSlot(_ctx.$slots, "footer", {}, null, _push, _parent);
        _push(`</div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</template><!--]-->`);
    };
  }
};
const _sfc_setup$k = _sfc_main$k.setup;
_sfc_main$k.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/UserDashboard/main/EditCard/Preview/items/Modals/BaseModalGame.vue");
  return _sfc_setup$k ? _sfc_setup$k(props, ctx) : void 0;
};
const BaseModalGame = /* @__PURE__ */ _export_sfc(_sfc_main$k, [["__scopeId", "data-v-40afa3f0"]]);
const _sfc_main$j = {
  __name: "questionbox",
  __ssrInlineRender: true,
  props: {
    link: Object,
    formData: { type: Object, required: false }
  },
  setup(__props) {
    const { getIconComponent } = useIconComponents();
    const props = __props;
    const formStore = useFormStore();
    const formData = computed(() => props.formData || formStore);
    const iconData = computed(() => {
      var _a;
      return ((_a = props.link) == null ? void 0 : _a.icon) || null;
    });
    const iconColor = computed(() => {
      var _a;
      if (((_a = formStore.iconColor) == null ? void 0 : _a.background) && formStore.iconColor.background !== "transparent") {
        return formStore.iconColor.background;
      }
      return void 0;
    });
    const isIconFilled = computed(() => {
      var _a;
      return !!(((_a = formStore.iconColor) == null ? void 0 : _a.background) && formStore.iconColor.background !== "transparent");
    });
    const iconComponent = computed(() => {
      return getIconComponent(iconData.value);
    });
    const question = ref("");
    const sent = ref(false);
    const showBox = ref(false);
    const { $axios } = useNuxtApp();
    const showToast = ref(false);
    const toastMessage = ref("");
    const toastIcon = ref("ti-alert-triangle");
    const showInfoToast = (message, icon = "ti-lock") => {
      toastMessage.value = message;
      toastIcon.value = icon;
      showToast.value = true;
      setTimeout(() => showToast.value = false, 3e3);
    };
    async function send() {
      var _a, _b, _c, _d;
      if (typeof question.value !== "string") question.value = "";
      if (!question.value.trim()) return;
      try {
        const payload = {
          question: question.value,
          // سوال کاربر
          linkId: ((_a = props.link) == null ? void 0 : _a.id) || null,
          // آیدی لینک (در صورت نیاز)
          cardId: ((_b = props.link) == null ? void 0 : _b.card_id) || null
          // آیدی کارت (اختیاری)
        };
        const response = await $axios.post(
          `club/${(_c = props.link) == null ? void 0 : _c.hash}/recordQuestion`,
          payload
        );
        if ((_d = response.data) == null ? void 0 : _d.success) {
          sent.value = true;
          question.value = "";
        } else {
          showInfoToast("\u062E\u0637\u0627 \u062F\u0631 \u0627\u0631\u0633\u0627\u0644 \u0633\u0648\u0627\u0644", "ti-check");
        }
      } catch (e) {
        showInfoToast("\u0645\u0634\u06A9\u0644\u06CC \u062F\u0631 \u0627\u0631\u0633\u0627\u0644 \u0633\u0648\u0627\u0644 \u067E\u06CC\u0634 \u0622\u0645\u062F", "ti-check");
      }
    }
    return (_ctx, _push, _parent, _attrs) => {
      var _a, _b, _c, _d, _e;
      _push(`<div${ssrRenderAttrs(_attrs)} data-v-339be830><div class="${ssrRenderClass("flex items-center gap-4 bg-gradient-to-br from-white/60 via-white/30 to-white/10 backdrop-blur border rounded-xl p-2 w-full cursor-pointer " + (((_a = formData.value) == null ? void 0 : _a.layout) === "left" ? "text-left" : "text-right"))}" tabindex="0" role="button" data-v-339be830><div class="flex items-center justify-center flex-shrink-0 rounded-xl overflow-hidden" data-v-339be830>`);
      ssrRenderVNode(_push, createVNode(resolveDynamicComponent(iconComponent.value), mergeProps({ size: 50 }, iconColor.value ? { color: iconColor.value, filled: isIconFilled.value } : {}), null), _parent);
      _push(`</div> <div class="${ssrRenderClass("flex flex-col justify-center flex-1 min-w-0 " + (((_b = formData.value) == null ? void 0 : _b.layout) === "left" ? "text-left" : "text-right"))}" data-v-339be830><div class="${ssrRenderClass("font-bold text-xs text-gray-800 leading-snug mb-1 " + (((_c = formData.value) == null ? void 0 : _c.layout) === "left" ? "text-left" : "text-right"))}" data-v-339be830>${ssrInterpolate(__props.link.displayName || __props.link.title || __props.link.name || __props.link.value || __props.link.id)}</div> <div class="${ssrRenderClass("text-xs text-gray-600 font-normal leading-relaxed whitespace-pre-line break-words " + (((_d = formData.value) == null ? void 0 : _d.layout) === "left" ? "text-left" : "text-right"))}" data-v-339be830>${ssrInterpolate((_e = __props.link.description) != null ? _e : "")}</div></div></div> `);
      _push(ssrRenderComponent(BaseModalGame, {
        "max-height": "45vh",
        modelValue: showBox.value,
        "onUpdate:modelValue": ($event) => showBox.value = $event
      }, {
        header: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="flex justify-between items-center p-4 border-b border-gray-100 bg-white" data-v-339be830${_scopeId}><div class="flex items-center gap-3" data-v-339be830${_scopeId}>`);
            ssrRenderVNode(_push2, createVNode(resolveDynamicComponent(iconComponent.value), mergeProps({ size: 20 }, iconColor.value ? { color: iconColor.value, filled: isIconFilled.value } : {}), null), _parent2, _scopeId);
            _push2(` <h3 class="text-lg font-semibold text-gray-800" data-v-339be830${_scopeId}>${ssrInterpolate(__props.link.displayName || __props.link.title || __props.link.name || __props.link.value || __props.link.id || "\u0633\u0648\u0627\u0644 \u0628\u0627\u06A9\u0633")}</h3></div> <button class="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors" data-v-339be830${_scopeId}><i class="ti ti-x text-lg" data-v-339be830${_scopeId}></i></button></div>`);
          } else {
            return [
              createVNode("div", { class: "flex justify-between items-center p-4 border-b border-gray-100 bg-white" }, [
                createVNode("div", { class: "flex items-center gap-3" }, [
                  (openBlock(), createBlock(resolveDynamicComponent(iconComponent.value), mergeProps({ size: 20 }, iconColor.value ? { color: iconColor.value, filled: isIconFilled.value } : {}), null, 16)),
                  createTextVNode(),
                  createVNode("h3", { class: "text-lg font-semibold text-gray-800" }, toDisplayString(__props.link.displayName || __props.link.title || __props.link.name || __props.link.value || __props.link.id || "\u0633\u0648\u0627\u0644 \u0628\u0627\u06A9\u0633"), 1)
                ]),
                createTextVNode(),
                createVNode("button", {
                  onClick: ($event) => showBox.value = false,
                  class: "w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
                }, [
                  createVNode("i", { class: "ti ti-x text-lg" })
                ], 8, ["onClick"])
              ])
            ];
          }
        }),
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          var _a2, _b2;
          if (_push2) {
            _push2(`<div class="flex flex-col items-center justify-center w-full mt-6 mb-6" data-v-339be830${_scopeId}><div class="flex items-center justify-center rounded-full overflow-hidden border border-gray-200 mb-3" data-v-339be830${_scopeId}></div> <div class="font-bold text-base text-gray-800 leading-snug text-center mb-1" data-v-339be830${_scopeId}>${ssrInterpolate(__props.link.fullName || __props.link.phonenumber || __props.link.name || __props.link.value || __props.link.id || "\u0627\u0632 \u0645\u0646 \u0633\u0648\u0627\u0644 \u0628\u067E\u0631\u0633!")}</div> <div class="text-xs text-gray-600 font-normal leading-relaxed whitespace-pre-line break-words text-center" data-v-339be830${_scopeId}>${ssrInterpolate((_a2 = __props.link.phoneNumber) != null ? _a2 : "")}</div></div> <div class="w-full flex flex-col items-center gap-3 mt-2 px-4" data-v-339be830${_scopeId}>`);
            if (!sent.value) {
              _push2(`<div class="w-full flex flex-col items-center gap-3" data-v-339be830${_scopeId}><input${ssrRenderAttr("value", question.value)} type="text" class="w-full rounded-xl bg-gray-100 px-4 py-3 text-base text-gray-700 outline-none border border-gray-200 focus:border-blue-400 transition text-center"${ssrRenderAttr("placeholder", typeof __props.link.placeholder === "string" ? __props.link.placeholder : "\u0627\u06CC\u0646\u062C\u0627 \u0628\u0646\u0648\u06CC\u0633\u06CC\u062F...")} data-v-339be830${_scopeId}> <button class="bg-black text-white px-4 py-2 rounded-xl w-full font-bold shadow transition disabled:opacity-50"${ssrIncludeBooleanAttr(!question.value.trim()) ? " disabled" : ""} data-v-339be830${_scopeId}>
                \u0627\u0631\u0633\u0627\u0644 \u0633\u0648\u0627\u0644
              </button></div>`);
            } else {
              _push2(`<div class="text-green-600 text-xs font-medium text-center mt-4 flex items-center justify-center gap-2 py-3" data-v-339be830${_scopeId}><i class="ti ti-check text-base" data-v-339be830${_scopeId}></i> <span data-v-339be830${_scopeId}>\u0633\u0648\u0627\u0644 \u0634\u0645\u0627 \u0628\u0627 \u0645\u0648\u0641\u0642\u06CC\u062A \u0627\u0631\u0633\u0627\u0644 \u0634\u062F!</span></div>`);
            }
            _push2(`</div>`);
          } else {
            return [
              createVNode("div", { class: "flex flex-col items-center justify-center w-full mt-6 mb-6" }, [
                createVNode("div", { class: "flex items-center justify-center rounded-full overflow-hidden border border-gray-200 mb-3" }),
                createTextVNode(),
                createVNode("div", { class: "font-bold text-base text-gray-800 leading-snug text-center mb-1" }, toDisplayString(__props.link.fullName || __props.link.phonenumber || __props.link.name || __props.link.value || __props.link.id || "\u0627\u0632 \u0645\u0646 \u0633\u0648\u0627\u0644 \u0628\u067E\u0631\u0633!"), 1),
                createTextVNode(),
                createVNode("div", { class: "text-xs text-gray-600 font-normal leading-relaxed whitespace-pre-line break-words text-center" }, toDisplayString((_b2 = __props.link.phoneNumber) != null ? _b2 : ""), 1)
              ]),
              createTextVNode(),
              createVNode("div", { class: "w-full flex flex-col items-center gap-3 mt-2 px-4" }, [
                createVNode(Transition, { name: "fade" }, {
                  default: withCtx(() => [
                    !sent.value ? (openBlock(), createBlock("div", {
                      key: 0,
                      class: "w-full flex flex-col items-center gap-3"
                    }, [
                      withDirectives(createVNode("input", {
                        "onUpdate:modelValue": ($event) => question.value = $event,
                        type: "text",
                        class: "w-full rounded-xl bg-gray-100 px-4 py-3 text-base text-gray-700 outline-none border border-gray-200 focus:border-blue-400 transition text-center",
                        placeholder: typeof __props.link.placeholder === "string" ? __props.link.placeholder : "\u0627\u06CC\u0646\u062C\u0627 \u0628\u0646\u0648\u06CC\u0633\u06CC\u062F...",
                        onKeyup: withKeys(send, ["enter"])
                      }, null, 40, ["onUpdate:modelValue", "placeholder"]), [
                        [vModelText, question.value]
                      ]),
                      createTextVNode(),
                      createVNode("button", {
                        class: "bg-black text-white px-4 py-2 rounded-xl w-full font-bold shadow transition disabled:opacity-50",
                        disabled: !question.value.trim(),
                        onClick: send
                      }, "\r\n                \u0627\u0631\u0633\u0627\u0644 \u0633\u0648\u0627\u0644\r\n              ", 8, ["disabled"])
                    ])) : (openBlock(), createBlock("div", {
                      key: 1,
                      class: "text-green-600 text-xs font-medium text-center mt-4 flex items-center justify-center gap-2 py-3"
                    }, [
                      createVNode("i", { class: "ti ti-check text-base" }),
                      createTextVNode(),
                      createVNode("span", null, "\u0633\u0648\u0627\u0644 \u0634\u0645\u0627 \u0628\u0627 \u0645\u0648\u0641\u0642\u06CC\u062A \u0627\u0631\u0633\u0627\u0644 \u0634\u062F!")
                    ]))
                  ]),
                  _: 1
                })
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
const _sfc_setup$j = _sfc_main$j.setup;
_sfc_main$j.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/UserDashboard/main/EditCard/Preview/items/questionbox.vue");
  return _sfc_setup$j ? _sfc_setup$j(props, ctx) : void 0;
};
const questionbox = /* @__PURE__ */ _export_sfc(_sfc_main$j, [["__scopeId", "data-v-339be830"]]);
const _sfc_main$i = {
  __name: "expandabletext",
  __ssrInlineRender: true,
  props: {
    link: Object,
    formData: { type: Object, required: false }
  },
  setup(__props) {
    const { getIconComponent } = useIconComponents();
    const props = __props;
    const formStore = useFormStore();
    const formData = computed(() => props.formData || formStore);
    const iconData = computed(() => {
      var _a;
      return ((_a = props.link) == null ? void 0 : _a.icon) || null;
    });
    const iconColor = computed(() => {
      var _a;
      if (((_a = formStore.iconColor) == null ? void 0 : _a.background) && formStore.iconColor.background !== "transparent") {
        return formStore.iconColor.background;
      }
      return void 0;
    });
    const isIconFilled = computed(() => {
      var _a;
      return !!(((_a = formStore.iconColor) == null ? void 0 : _a.background) && formStore.iconColor.background !== "transparent");
    });
    const iconComponent = computed(() => {
      return getIconComponent(iconData.value);
    });
    const expanded = ref(false);
    return (_ctx, _push, _parent, _attrs) => {
      var _a;
      _push(`<div${ssrRenderAttrs(mergeProps({
        class: "rounded-2xl bg-white/90 max-w-full mx-auto transition-all duration-200 border",
        dir: ((_a = formData.value) == null ? void 0 : _a.layout) === "left" ? "ltr" : "rtl"
      }, _attrs))} data-v-719951c3><button class="flex items-center justify-between w-full px-2 py-3 font-bold text-base text-gray-800 rounded-2xl focus:outline-none rtl:text-right ltr:text-left"${ssrRenderAttr("aria-expanded", expanded.value)} data-v-719951c3><span class="flex items-center gap-2" data-v-719951c3>`);
      ssrRenderVNode(_push, createVNode(resolveDynamicComponent(iconComponent.value), mergeProps({ size: 50 }, iconColor.value ? { color: iconColor.value, filled: isIconFilled.value } : {}), null), _parent);
      _push(` ${ssrInterpolate(__props.link.title || "\u0645\u062A\u0646 \u062A\u0648\u0636\u06CC\u062D\u06CC")}</span> <i class="${ssrRenderClass([expanded.value ? "ti ti-chevron-up" : "ti ti-chevron-down", "text-xl text-gray-500 transition-transform"])}" data-v-719951c3></i></button> <div style="${ssrRenderStyle(expanded.value ? null : { display: "none" })}" class="px-4 pb-4 pt-1 text-sm leading-relaxed text-gray-700 rtl:text-right ltr:text-left" data-v-719951c3>${ssrInterpolate(__props.link.value || "\u0645\u062A\u0646\u06CC \u0628\u0631\u0627\u06CC \u0646\u0645\u0627\u06CC\u0634 \u0648\u0627\u0631\u062F \u0646\u0634\u062F\u0647 \u0627\u0633\u062A.")}</div></div>`);
    };
  }
};
const _sfc_setup$i = _sfc_main$i.setup;
_sfc_main$i.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/UserDashboard/main/EditCard/Preview/items/expandabletext.vue");
  return _sfc_setup$i ? _sfc_setup$i(props, ctx) : void 0;
};
const expandabletext = /* @__PURE__ */ _export_sfc(_sfc_main$i, [["__scopeId", "data-v-719951c3"]]);
const _sfc_main$h = {
  __name: "contactcard",
  __ssrInlineRender: true,
  props: {
    link: { type: Object, required: true },
    previewItems: { type: Object, required: false },
    formData: { type: Object, required: false },
    isDarkTheme: { type: Boolean, default: false },
    isLightTheme: { type: Boolean, default: false },
    isBackgroundDark: { type: Boolean, default: false }
  },
  setup(__props) {
    const { getIconComponent } = useIconComponents();
    const props = __props;
    const formStore = useFormStore();
    const formData = computed(() => props.formData || formStore);
    const sanitizedLink = computed(() => {
      const link = props.link || {};
      const getDefaultTitle = (action, originalTitle, name) => {
        const defaultTitles = {
          "call": "\u062A\u0645\u0627\u0633 \u0628\u0627 \u0645\u0627",
          "number": "\u067E\u06CC\u0627\u0645 \u062F\u0647\u06CC\u062F",
          "email": "\u0627\u06CC\u0645\u06CC\u0644 \u0627\u0631\u0633\u0627\u0644 \u06A9\u0646\u06CC\u062F",
          "whatsapp": "\u062F\u0631 \u0648\u0627\u062A\u0633\u0627\u067E \u067E\u06CC\u0627\u0645 \u062F\u0647\u06CC\u062F"
        };
        if (originalTitle && originalTitle.trim() && originalTitle !== name) {
          return originalTitle;
        }
        if (defaultTitles[action]) {
          return defaultTitles[action];
        }
        return originalTitle || name;
      };
      const sanitized = {
        ...link,
        displayName: getDefaultTitle(link.action, link.title, link.name)
      };
      if (link.description && link.description.trim() && link.description !== "") {
        sanitized.description = link.description;
      }
      return sanitized;
    });
    const iconData = computed(() => {
      var _a;
      return ((_a = sanitizedLink.value) == null ? void 0 : _a.icon) || null;
    });
    const iconColor = computed(() => {
      var _a;
      if (((_a = formStore.iconColor) == null ? void 0 : _a.background) && formStore.iconColor.background !== "transparent") {
        return formStore.iconColor.background;
      }
      return void 0;
    });
    const isIconFilled = computed(() => {
      var _a;
      return !!(((_a = formStore.iconColor) == null ? void 0 : _a.background) && formStore.iconColor.background !== "transparent");
    });
    const iconComponent = computed(() => {
      const component = getIconComponent(iconData.value);
      return component || null;
    });
    const isLinkType = computed(() => props.link.type === "link" || props.link.action !== "contactcard");
    const isListMode = computed(() => {
      var _a;
      return ((_a = sanitizedLink.value) == null ? void 0 : _a.description) && sanitizedLink.value.description.trim();
    });
    const finalUrl = computed(() => {
      if (props.link.action === "contactcard" && props.link.value) return props.link.value;
      return "#";
    });
    return (_ctx, _push, _parent, _attrs) => {
      var _a, _b, _c, _d;
      if (isLinkType.value) {
        _push(`<a class="${ssrRenderClass([
          isListMode.value ? "flex items-center gap-4 backdrop-blur rounded-xl p-2 w-full " + (((_a = formData.value) == null ? void 0 : _a.layout) === "left" ? "text-left" : "text-right") + (__props.isDarkTheme ? " bg-white/[0.02]" : __props.isLightTheme ? " bg-black/[0.02]" : " bg-gradient-to-br from-white/60 via-white/30 to-white/10 border border-white/20") : "rounded-xl text-center p-2 flex flex-col items-center justify-center transition hover:shadow-md backdrop-blur" + (__props.isDarkTheme ? " bg-white/[0.02]" : __props.isLightTheme ? " bg-black/[0.02]" : " bg-gradient-to-br from-white/60 via-white/30 to-white/10 border border-white/20")
        ])}"${ssrRenderAttr("href", finalUrl.value || void 0)}${ssrRenderAttr("tabindex", finalUrl.value ? 0 : -1)}${ssrRenderAttr("target", finalUrl.value ? "_blank" : void 0)}${ssrRenderAttr("rel", finalUrl.value ? "noopener" : void 0)}${ssrRenderAttr("aria-disabled", !finalUrl.value)} style="${ssrRenderStyle(!finalUrl.value ? "pointer-events: none; opacity: 0.5; touch-action: none; user-select: none;" : "")}"><div class="${ssrRenderClass(isListMode.value ? "w-13 h-13 flex-shrink-0 rounded-xl flex items-center justify-center overflow-hidden" : "w-16 h-16 rounded-xl flex items-center justify-center mb-2 overflow-hidden")}" style="${ssrRenderStyle({
          backgroundColor: iconColor.value || "#ffffff",
          color: iconColor.value ? iconColor.value === "#ffffff" || iconColor.value === "#FFFFFF" ? "#000000" : "#ffffff" : "#666666"
        })}">`);
        ssrRenderVNode(_push, createVNode(resolveDynamicComponent(iconComponent.value), {
          size: isListMode.value ? 20 : 24,
          class: "transition-colors"
        }, null), _parent);
        _push(`</div> <div class="${ssrRenderClass(isListMode.value ? "flex flex-col justify-center flex-1 min-w-0 " + (((_b = formData.value) == null ? void 0 : _b.layout) === "left" ? "text-left" : "text-right") : "w-full text-center mt-0")}"><div class="${ssrRenderClass([
          isListMode.value ? "font-bold text-xs leading-snug break-words " + (((_c = formData.value) == null ? void 0 : _c.layout) === "left" ? "text-left" : "text-right") : "font-bold text-xs leading-snug text-center break-words",
          __props.isDarkTheme ? "text-white" : "text-gray-800"
        ])}">${ssrInterpolate(sanitizedLink.value.displayName || sanitizedLink.value.title || sanitizedLink.value.name || sanitizedLink.value.value || sanitizedLink.value.id || "\u0628\u062F\u0648\u0646 \u0639\u0646\u0648\u0627\u0646")}</div> `);
        if (sanitizedLink.value.description && sanitizedLink.value.description.trim()) {
          _push(`<div class="${ssrRenderClass([
            isListMode.value ? "text-xs font-normal mt-1 leading-relaxed whitespace-pre-line break-words " + (((_d = formData.value) == null ? void 0 : _d.layout) === "left" ? "text-left" : "text-right") : "text-xs font-normal mt-1 leading-relaxed whitespace-pre-line break-words text-center",
            __props.isDarkTheme ? "text-gray-300" : "text-gray-700"
          ])}">${ssrInterpolate(sanitizedLink.value.description)}</div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div></a>`);
      } else {
        _push(`<div${ssrRenderAttrs(mergeProps({
          class: ["flex flex-col items-center justify-center rounded-xl p-4 w-full text-center", [
            __props.isDarkTheme ? "backdrop-blur bg-white/[0.02]" : __props.isLightTheme ? "backdrop-blur bg-black/[0.02]" : "bg-gradient-to-br from-white/60 via-white/30 to-white/10 backdrop-blur border"
          ]]
        }, _attrs))}>`);
        if (sanitizedLink.value.action === "contactcard") {
          _push(`<!--[--><div class="flex flex-col items-center mb-4"><div class="w-12 h-12 rounded-xl flex items-center justify-center mb-2" style="${ssrRenderStyle({
            backgroundColor: iconColor.value || "transparent",
            color: iconColor.value ? iconColor.value === "#ffffff" || iconColor.value === "#FFFFFF" ? "#000000" : "#ffffff" : "#666666"
          })}">`);
          ssrRenderVNode(_push, createVNode(resolveDynamicComponent(iconComponent.value), {
            size: 24,
            class: "transition-colors"
          }, null), _parent);
          _push(`</div> <div class="${ssrRenderClass([__props.isDarkTheme ? "text-white" : "text-gray-800", "font-bold text-sm sm:text-base text-gray-800 leading-snug"])}">${ssrInterpolate(sanitizedLink.value.title || sanitizedLink.value.name || "\u06A9\u0627\u0631\u062A \u062A\u0645\u0627\u0633")}</div> `);
          if (sanitizedLink.value.description && sanitizedLink.value.description.trim()) {
            _push(`<div class="${ssrRenderClass([__props.isDarkTheme ? "text-gray-300" : "text-gray-500", "text-xs mt-1"])}">${ssrInterpolate(sanitizedLink.value.description)}</div>`);
          } else {
            _push(`<!---->`);
          }
          _push(`</div> <button class="mt-4 px-4 py-3 text-white text-sm rounded-lg hover:opacity-90 transition font-medium flex items-center justify-center gap-2 w-full" style="${ssrRenderStyle({ backgroundColor: iconColor.value || "#10b981" })}"><i class="ti ti-address-book"></i>
        \u0630\u062E\u06CC\u0631\u0647 \u062F\u0631 \u0645\u062E\u0627\u0637\u0628\u06CC\u0646
      </button><!--]-->`);
        } else if (__props.previewItems && sanitizedLink.value.action && __props.previewItems[sanitizedLink.value.action]) {
          ssrRenderVNode(_push, createVNode(resolveDynamicComponent(__props.previewItems[sanitizedLink.value.action]), {
            link: sanitizedLink.value,
            "is-list-mode": isListMode.value,
            "preview-items": __props.previewItems
          }, null), _parent);
        } else {
          _push(`<!--[-->`);
          ssrRenderVNode(_push, createVNode(resolveDynamicComponent(iconComponent.value), mergeProps({ size: 50 }, iconColor.value ? { color: iconColor.value, filled: isIconFilled.value } : {}), null), _parent);
          _push(` <div class="font-bold text-sm sm:text-base text-gray-800 leading-snug mb-1">${ssrInterpolate(sanitizedLink.value.title || sanitizedLink.value.value || "\u0628\u062F\u0648\u0646 \u0639\u0646\u0648\u0627\u0646")}</div> `);
          if (sanitizedLink.value.description && sanitizedLink.value.description.trim()) {
            _push(`<div class="text-xs text-gray-500 mt-1">${ssrInterpolate(sanitizedLink.value.description)}</div>`);
          } else {
            _push(`<!---->`);
          }
          _push(`<!--]-->`);
        }
        _push(`</div>`);
      }
    };
  }
};
const _sfc_setup$h = _sfc_main$h.setup;
_sfc_main$h.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/UserDashboard/main/EditCard/Preview/items/contactcard.vue");
  return _sfc_setup$h ? _sfc_setup$h(props, ctx) : void 0;
};
const defaultTitle = "File";
const _sfc_main$g = {
  __name: "file",
  __ssrInlineRender: true,
  props: {
    link: Object,
    showDescription: Boolean,
    isDarkTheme: { type: Boolean, default: false },
    isLightTheme: { type: Boolean, default: false },
    isBackgroundDark: { type: Boolean, default: false }
  },
  setup(__props) {
    const { getIconComponent } = useIconComponents();
    const props = __props;
    const sanitizedDescription = computed(() => {
      if (!props.link.description) return null;
      const trimmed = props.link.description.trim();
      if (!trimmed || trimmed === "" || trimmed === "description") return null;
      return trimmed;
    });
    const formStore = useFormStore();
    const iconData = computed(() => {
      var _a;
      return ((_a = props.link) == null ? void 0 : _a.icon) || null;
    });
    const iconColor = computed(() => {
      var _a;
      if (((_a = formStore.iconColor) == null ? void 0 : _a.background) && formStore.iconColor.background !== "transparent") {
        return formStore.iconColor.background;
      }
      return void 0;
    });
    const isIconFilled = computed(() => {
      var _a;
      return !!(((_a = formStore.iconColor) == null ? void 0 : _a.background) && formStore.iconColor.background !== "transparent");
    });
    const iconComponent = computed(() => {
      return getIconComponent(iconData.value);
    });
    function isImage(url) {
      return /\.(jpe?g|png|gif|bmp|webp|svg)$/i.test(url || "");
    }
    return (_ctx, _push, _parent, _attrs) => {
      if (__props.link.fileData || __props.link.value) {
        _push(`<a${ssrRenderAttr("href", __props.link.fileData || __props.link.value)} target="_blank" rel="noopener" class="${ssrRenderClass([
          "flex items-center gap-4 backdrop-blur rounded-xl p-2 w-full text-right cursor-pointer",
          __props.isDarkTheme ? "bg-white/[0.02]" : __props.isLightTheme ? "bg-black/[0.02]" : "bg-gradient-to-br from-white/60 via-white/30 to-white/10 border border-white/20"
        ])}" tabindex="0" role="button"${ssrRenderAttr("title", __props.link.value)}><div class="${ssrRenderClass(["flex items-center justify-center flex-shrink-0 rounded-xl overflow-hidden", __props.isDarkTheme ? "" : ""])}">`);
        if (isImage(__props.link.value)) {
          _push(`<img${ssrRenderAttr("src", __props.link.value)} class="w-full h-full object-cover" alt="file">`);
        } else {
          ssrRenderVNode(_push, createVNode(resolveDynamicComponent(iconComponent.value), mergeProps({ size: 50 }, iconColor.value ? { color: iconColor.value, filled: isIconFilled.value } : {}), null), _parent);
        }
        _push(`</div> <div class="flex flex-col justify-center flex-1 min-w-0 text-right"><div class="${ssrRenderClass(["font-bold text-xs leading-snug text-right mb-1", __props.isDarkTheme ? "text-white" : "text-gray-800"])}">${ssrInterpolate(__props.link.displayName || __props.link.title || __props.link.name || __props.link.value || __props.link.id || defaultTitle)}</div> `);
        if (sanitizedDescription.value) {
          _push(`<div class="${ssrRenderClass(["text-xs font-normal leading-relaxed whitespace-pre-line break-words text-right", __props.isDarkTheme ? "text-gray-300" : "text-gray-600"])}">${ssrInterpolate(sanitizedDescription.value)}</div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div></a>`);
      } else {
        _push(`<div${ssrRenderAttrs(mergeProps({
          class: [
            "flex items-center gap-4 backdrop-blur rounded-xl p-2 w-full text-right",
            __props.isDarkTheme ? "bg-white/[0.02]" : __props.isLightTheme ? "bg-black/[0.02]" : "bg-gradient-to-br from-white/60 via-white/30 to-white/10 border border-white/20"
          ]
        }, _attrs))}><div class="${ssrRenderClass(["flex items-center justify-center flex-shrink-0 rounded-xl overflow-hidden w-14 h-14", __props.isDarkTheme || __props.isLightTheme ? "" : "bg-white"])}">`);
        ssrRenderVNode(_push, createVNode(resolveDynamicComponent(iconComponent.value), mergeProps({ size: 50 }, iconColor.value ? { color: iconColor.value, filled: isIconFilled.value } : {}), null), _parent);
        _push(`</div> <div class="flex flex-col justify-center flex-1 min-w-0 text-right"><div class="${ssrRenderClass(["font-bold text-xs leading-snug text-right mb-1", __props.isBackgroundDark ? "text-gray-400" : "text-gray-400"])}">
        \u0628\u062F\u0648\u0646 \u0641\u0627\u06CC\u0644
      </div> <div class="${ssrRenderClass(["text-xs font-normal leading-relaxed whitespace-pre-line break-words text-right", __props.isBackgroundDark ? "text-gray-500" : "text-gray-400"])}">
        \u0628\u062F\u0648\u0646 \u062A\u0648\u0636\u06CC\u062D
      </div></div></div>`);
      }
    };
  }
};
const _sfc_setup$g = _sfc_main$g.setup;
_sfc_main$g.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/UserDashboard/main/EditCard/Preview/items/file.vue");
  return _sfc_setup$g ? _sfc_setup$g(props, ctx) : void 0;
};
const _sfc_main$f = {
  __name: "featuredlink",
  __ssrInlineRender: true,
  props: {
    link: Object,
    isListMode: Boolean
  },
  setup(__props) {
    const props = __props;
    const sanitizedDescription = computed(() => {
      if (!displayMode.value) return null;
      if (!props.link.description) return null;
      const trimmed = props.link.description.trim();
      if (!trimmed || trimmed === "" || trimmed === "description") return null;
      return trimmed;
    });
    const displayMode = computed(() => {
      if (props.link.isListMode !== void 0) {
        return props.link.isListMode;
      }
      if (props.isListMode !== void 0) {
        return props.isListMode;
      }
      return true;
    });
    const value = props.link.value || "";
    const baseUrl = props.link.baseUrl || "";
    let finalUrl = value;
    if (baseUrl) {
      if (baseUrl.endsWith(":")) {
        finalUrl = baseUrl + value;
      } else {
        finalUrl = baseUrl + value.replace(/^[@+]/, "");
      }
    }
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<a${ssrRenderAttrs(mergeProps({
        href: unref(finalUrl),
        target: "_blank",
        rel: "noopener",
        class: "relative flex flex-col items-center justify-end rounded-2xl shadow-2xl border-2 border-blue-400 overflow-hidden w-full h-50 mx-auto bg-gray-900"
      }, _attrs))}>`);
      if (__props.link.backgroundImage || __props.link.customIcon || __props.link.icon && __props.link.icon.path) {
        _push(`<img${ssrRenderAttr("src", __props.link.backgroundImage || __props.link.customIcon || __props.link.icon.path)} alt="background" class="absolute inset-0 w-full h-full object-cover pointer-events-none rounded-2xl">`);
      } else {
        _push(`<!---->`);
      }
      _push(` <div class="absolute inset-0 pointer-events-none rounded-2xl" style="${ssrRenderStyle({ "background": "linear-gradient(to top, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.0) 70%)" })}"></div> <div class="relative z-10 flex flex-col items-center justify-end w-full p-4 pb-6"><span class="text-lg font-bold text-white drop-shadow text-center">${ssrInterpolate(__props.link.title || __props.link.name)}</span> `);
      if (unref(sanitizedDescription)) {
        _push(`<span class="text-xs text-white/80 mt-2 text-center drop-shadow">${ssrInterpolate(unref(sanitizedDescription))}</span>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div></a>`);
    };
  }
};
const _sfc_setup$f = _sfc_main$f.setup;
_sfc_main$f.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/UserDashboard/main/EditCard/Preview/items/featuredlink.vue");
  return _sfc_setup$f ? _sfc_setup$f(props, ctx) : void 0;
};
const _sfc_main$e = {
  __name: "embeddedvideo",
  __ssrInlineRender: true,
  props: {
    link: { type: Object, required: true }
  },
  setup(__props) {
    const props = __props;
    const videoRef = ref(null);
    let player = null;
    const isPlaying = ref(false);
    const isMuted = ref(false);
    const showPoster = ref(true);
    const posterImage = ref("");
    const isYoutube = (url) => /youtu\.be|youtube\.com/.test(url);
    const isAparat = (url) => /aparat\.com\/v\//.test(url);
    const getYoutubeId = (url) => {
      var _a;
      return (_a = url.match(/(?:v=|\/)([0-9A-Za-z_-]{11})/)) == null ? void 0 : _a[1];
    };
    const getAparatId = (url) => {
      var _a;
      return (_a = url.match(/aparat\.com\/v\/([^/?]+)/)) == null ? void 0 : _a[1];
    };
    const isEmbed = computed(() => isYoutube(props.link.value) || isAparat(props.link.value));
    const embedUrl = computed(() => {
      if (isYoutube(props.link.value)) {
        const id = getYoutubeId(props.link.value);
        return id ? `https://www.youtube.com/embed/${id}` : "";
      }
      if (isAparat(props.link.value)) {
        const id = getAparatId(props.link.value);
        return id ? `https://www.aparat.com/video/video/embed/videohash/${id}/vt/frame` : "";
      }
      return "";
    });
    const generatePosterFromVideo = async (targetSec = 2) => {
      return new Promise((resolve) => {
        const video = videoRef.value;
        const canvas = (void 0).createElement("canvas");
        const context = canvas.getContext("2d");
        video.addEventListener(
          "loadedmetadata",
          () => {
            const duration = video.duration;
            const captureTime = duration > targetSec ? targetSec : duration / 2;
            video.currentTime = captureTime;
          },
          { once: true }
        );
        video.addEventListener(
          "seeked",
          () => {
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            context.drawImage(video, 0, 0, canvas.width, canvas.height);
            const imgData = canvas.toDataURL("image/jpeg");
            resolve(imgData);
          },
          { once: true }
        );
      });
    };
    watch(
      () => props.link.value,
      async (src) => {
        if (!src || isEmbed.value) return;
        player.src({ src, type: "video/mp4" });
        showPoster.value = true;
        posterImage.value = await generatePosterFromVideo();
      }
    );
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "w-full rounded-2xl overflow-hidden shadow bg-white/90 border" }, _attrs))} data-v-e19df838><div class="flex items-center justify-between px-3 pt-3 pb-1" data-v-e19df838><div class="flex items-center gap-2" data-v-e19df838><span class="text-xs text-gray-700 font-bold" data-v-e19df838>${ssrInterpolate(__props.link.title || "\u0648\u06CC\u062F\u06CC\u0648\u06CC \u062A\u0633\u062A\u06CC")}</span></div></div> <div class="relative aspect-video bg-black rounded-t-2xl overflow-hidden" data-v-e19df838>`);
      if (isEmbed.value) {
        _push(`<iframe${ssrRenderAttr("src", embedUrl.value)} frameborder="0" allowfullscreen class="absolute inset-0 w-full h-full object-cover" data-v-e19df838></iframe>`);
      } else {
        _push(`<video class="video-js w-full h-full object-cover" playsinline preload="auto" muted data-v-e19df838></video>`);
      }
      _push(` `);
      if (showPoster.value && !isEmbed.value) {
        _push(`<img${ssrRenderAttr("src", posterImage.value)} class="absolute inset-0 w-full h-full object-cover pointer-events-none" alt="poster" data-v-e19df838>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div> `);
      if (!isEmbed.value) {
        _push(`<div class="flex items-center justify-between px-4 py-3 bg-gray-50 border-t" data-v-e19df838><div class="flex items-center gap-3" data-v-e19df838><button class="p-2 rounded hover:bg-gray-200 transition text-gray-700" data-v-e19df838><i class="${ssrRenderClass([isPlaying.value ? "ti ti-player-pause" : "ti ti-player-play", "text-xl"])}" data-v-e19df838></i></button> <button class="p-2 rounded hover:bg-gray-200 transition text-gray-700" data-v-e19df838><i class="${ssrRenderClass([isMuted.value ? "ti ti-volume-3" : "ti ti-volume", "text-xl"])}" data-v-e19df838></i></button></div> <button class="p-2 rounded hover:bg-gray-200 transition text-gray-700" data-v-e19df838><i class="ti ti-arrows-maximize text-xl" data-v-e19df838></i></button></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div>`);
    };
  }
};
const _sfc_setup$e = _sfc_main$e.setup;
_sfc_main$e.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/UserDashboard/main/EditCard/Preview/items/embeddedvideo.vue");
  return _sfc_setup$e ? _sfc_setup$e(props, ctx) : void 0;
};
const embeddedvideo = /* @__PURE__ */ _export_sfc(_sfc_main$e, [["__scopeId", "data-v-e19df838"]]);
const _sfc_main$d = {
  __name: "AuthForm",
  __ssrInlineRender: true,
  props: {
    gameIcon: { type: String, default: "\u{1F3B2}" },
    gameTitle: { type: String, default: "\u0628\u0627\u0632\u06CC \u0634\u0627\u0646\u0633" },
    authStep: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    codeInputs: { type: Array, required: true },
    countdown: { type: Number, default: 0 }
  },
  emits: ["update:phoneNumber", "update:codeInputs", "submit-phone", "submit-code", "cancel-auth"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emit = __emit;
    ref([]);
    const phoneNumber = computed({
      get: () => props.phoneNumber,
      set: (value) => emit("update:phoneNumber", value)
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(_attrs)} data-v-1d07c7f8>`);
      if (__props.authStep === "phone") {
        _push(`<div class="flex flex-col items-center justify-center py-8 px-4 text-center max-w-md mx-auto" data-v-1d07c7f8><div class="text-6xl mb-6" data-v-1d07c7f8><i class="ti ti-device-mobile text-6xl text-black" data-v-1d07c7f8></i></div> <h2 class="text-2xl font-bold mb-4 text-gray-800" data-v-1d07c7f8>${ssrInterpolate(__props.gameTitle)}</h2> <p class="text-gray-600 mb-6 text-center leading-relaxed" data-v-1d07c7f8>
        \u0628\u0631\u0627\u06CC \u0634\u0631\u06A9\u062A \u062F\u0631 \u0642\u0631\u0639\u0647\u200C\u06A9\u0634\u06CC \u0648 \u0627\u0645\u062A\u062D\u0627\u0646 \u0634\u0627\u0646\u0633\u062A\u060C \u0644\u0637\u0641\u0627\u064B \u0634\u0645\u0627\u0631\u0647 \u0645\u0648\u0628\u0627\u06CC\u0644\u062A \u0631\u0648 \u0648\u0627\u0631\u062F \u06A9\u0646
      </p> <div class="w-full space-y-4" data-v-1d07c7f8><div class="relative" data-v-1d07c7f8><input${ssrRenderAttr("value", phoneNumber.value)} type="tel" placeholder="\u0634\u0645\u0627\u0631\u0647 \u0645\u0648\u0628\u0627\u06CC\u0644 (\u0645\u062B\u0627\u0644: 09123456789)" class="${ssrRenderClass([
          "clean-input w-full px-4 py-4 pl-12 border-2 rounded-xl text-left text-lg font-medium transition-all duration-300 direction-ltr",
          phoneNumber.value && phoneNumber.value.length >= 11 ? "border-black bg-black/5 text-black" : "border-gray-300 bg-gray-50 text-gray-500 focus:border-black focus:bg-white"
        ])}" style="${ssrRenderStyle({ "direction": "ltr" })}" maxlength="11" data-v-1d07c7f8> <div class="absolute right-3 top-1/2 transform -translate-y-1/2" data-v-1d07c7f8><button class="p-1" data-v-1d07c7f8><i class="ti ti-edit text-gray-400 hover:text-gray-600 text-lg transition-colors" data-v-1d07c7f8></i></button></div> `);
        if (phoneNumber.value && phoneNumber.value.length >= 11) {
          _push(`<div class="absolute left-3 top-1/2 transform -translate-y-1/2 p-0.5 bg-green-500 text-white rounded-full w-7 h-7" data-v-1d07c7f8><i class="ti ti-check text-black text-lg" data-v-1d07c7f8></i></div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div> <button${ssrIncludeBooleanAttr(!phoneNumber.value || phoneNumber.value.length < 11) ? " disabled" : ""} class="${ssrRenderClass([
          "w-full px-6 py-4 rounded-xl font-bold transition-all duration-300 flex items-center justify-center",
          phoneNumber.value && phoneNumber.value.length >= 11 ? "bg-black text-white hover:bg-gray-800" : "bg-gray-200 text-gray-400 cursor-not-allowed"
        ])}" data-v-1d07c7f8>
          \u0627\u062F\u0627\u0645\u0647 \u0648 \u0634\u0631\u0648\u0639 \u0628\u0627\u0632\u06CC
        </button></div></div>`);
      } else if (__props.authStep === "code") {
        _push(`<div class="flex flex-col items-center justify-center py-8 px-4 text-center max-w-md mx-auto" data-v-1d07c7f8><div class="text-6xl mb-6" data-v-1d07c7f8><i class="ti ti-message-2-code text-6xl text-black" data-v-1d07c7f8></i></div> <h2 class="text-2xl font-bold mb-4 text-gray-800" data-v-1d07c7f8>\u06A9\u062F \u062A\u0627\u06CC\u06CC\u062F</h2> <div class="text-gray-600 mb-6 text-center" data-v-1d07c7f8><p class="mb-2" data-v-1d07c7f8>\u06A9\u062F \u062A\u0627\u06CC\u06CC\u062F 4 \u0631\u0642\u0645\u06CC \u0627\u0631\u0633\u0627\u0644 \u0634\u062F\u0647 \u0628\u0647 \u0634\u0645\u0627\u0631\u0647</p> <div class="flex items-center justify-center gap-2" data-v-1d07c7f8><strong class="text-black" data-v-1d07c7f8>${ssrInterpolate(phoneNumber.value)}</strong> <button class="p-1 rounded-lg hover:bg-gray-100 transition-colors" title="\u062A\u063A\u06CC\u06CC\u0631 \u0634\u0645\u0627\u0631\u0647" data-v-1d07c7f8><i class="ti ti-edit text-gray-400 hover:text-gray-600 text-sm transition-colors" data-v-1d07c7f8></i></button></div></div> <div class="flex gap-3 mb-6 justify-center" style="${ssrRenderStyle({ "direction": "ltr" })}" data-v-1d07c7f8><!--[-->`);
        ssrRenderList(__props.codeInputs, (code, index) => {
          _push(`<input${ssrRenderAttr("value", __props.codeInputs[index])} type="text" inputmode="numeric" pattern="[0-9]*" maxlength="1" class="${ssrRenderClass([
            "clean-input otp-input w-14 h-14 text-center text-xl font-bold rounded-xl transition-all duration-300 border-2",
            code ? "border-black bg-gray-100 text-black" : "border-gray-300 bg-gray-50 text-gray-400 hover:border-gray-400 focus:border-black focus:bg-gray-100 focus:text-black"
          ])}" data-v-1d07c7f8>`);
        });
        _push(`<!--]--></div> <div class="flex flex-col gap-4 w-full" data-v-1d07c7f8><button${ssrIncludeBooleanAttr(__props.codeInputs.join("").length < 4) ? " disabled" : ""} class="${ssrRenderClass([
          "w-full px-6 py-4 rounded-xl font-bold transition-all duration-300 flex items-center justify-center",
          __props.codeInputs.join("").length >= 4 ? "bg-black text-white hover:bg-gray-800" : "bg-gray-200 text-gray-400 cursor-not-allowed"
        ])}" data-v-1d07c7f8>
          \u062A\u0627\u06CC\u06CC\u062F \u0648 \u0634\u0631\u0648\u0639 \u0628\u0627\u0632\u06CC
        </button> <div class="flex justify-center items-center text-sm" data-v-1d07c7f8>`);
        if (__props.countdown > 0) {
          _push(`<div class="text-gray-600" data-v-1d07c7f8><span class="font-mono font-bold" data-v-1d07c7f8>${ssrInterpolate(Math.floor(__props.countdown / 60))}:${ssrInterpolate((__props.countdown % 60).toString().padStart(2, "0"))}</span></div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div></div></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div>`);
    };
  }
};
const _sfc_setup$d = _sfc_main$d.setup;
_sfc_main$d.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/UserDashboard/main/EditCard/Preview/items/Modals/AuthForm.vue");
  return _sfc_setup$d ? _sfc_setup$d(props, ctx) : void 0;
};
const AuthForm = /* @__PURE__ */ _export_sfc(_sfc_main$d, [["__scopeId", "data-v-1d07c7f8"]]);
function useOtpService() {
  const nuxtApp = useNuxtApp();
  const $axios = nuxtApp.$axios;
  const sendOtpCode = async (phone, countryCode = "+98", type = "authenticate") => {
    const response = await $axios.post("auth/sendOtpCode", {
      phone,
      countryCode,
      type
    });
    if (response.data && response.data.success === true) {
      return true;
    }
  };
  const verifyOtpCode = async (phone, code, countryCode = "+98", type = "authenticate") => {
    const response = await $axios.post("/auth/verifyOtpCode", {
      code,
      phone,
      countryCode,
      type
    });
    if (response.data && response.data.success === true) {
      return true;
    }
  };
  return { sendOtpCode, verifyOtpCode };
}
const intervalError = "[nuxt] `setInterval` should not be used on the server. Consider wrapping it with an `onNuxtReady`, `onBeforeMount` or `onMounted` lifecycle hook, or ensure you only call it in the browser by checking `false`.";
const setInterval = () => {
  console.error(intervalError);
};
const _sfc_main$c = {
  __name: "luckydice",
  __ssrInlineRender: true,
  props: {
    link: { type: Object, default: () => ({}) },
    isListMode: { type: Boolean, default: false },
    isDarkTheme: { type: Boolean, default: false },
    isLightTheme: { type: Boolean, default: false },
    isBackgroundDark: { type: Boolean, default: false }
  },
  emits: "message",
  setup(__props, { emit: __emit }) {
    const emit = __emit;
    const props = __props;
    const link = props.link || {};
    const formStore = useFormStore();
    const formData = computed(() => formStore);
    const { sendOtpCode, verifyOtpCode } = useOtpService();
    const { getIconComponent } = useIconComponents();
    const iconData = computed(() => {
      var _a;
      return ((_a = props.link) == null ? void 0 : _a.icon) || null;
    });
    const iconComponent = computed(() => {
      var _a, _b;
      if (((_a = iconData.value) == null ? void 0 : _a.type) === "component" && ((_b = iconData.value) == null ? void 0 : _b.name)) {
        return getIconComponent(iconData.value.name);
      }
      return getIconComponent("luckydice");
    });
    const iconColor = computed(() => {
      var _a;
      if (((_a = formStore.iconColor) == null ? void 0 : _a.background) && formStore.iconColor.background !== "transparent") {
        return formStore.iconColor.background;
      }
      return void 0;
    });
    const isIconFilled = computed(() => {
      var _a;
      return !!(((_a = formStore.iconColor) == null ? void 0 : _a.background) && formStore.iconColor.background !== "transparent");
    });
    const showGame = ref(false);
    const dice1 = ref(1);
    const dice2 = ref(1);
    const result = ref("");
    const prize = ref("");
    const phoneNumber = ref("");
    const hasPlayed = ref(false);
    const authStep = ref("none");
    const codeInputs = ref(["", "", "", ""]);
    const countdown = ref(0);
    const rolling = ref(false);
    const rollParity = ref(false);
    const rollSound = new Audio("/sounds/roll.mp3");
    ref([]);
    const getDots = (n) => Array.from({ length: n }, (_, i) => i + 1);
    const rollDice = async () => {
      var _a;
      const canPlay = await checkForPlay();
      if (!canPlay) {
        return;
      }
      if (((_a = props.link) == null ? void 0 : _a.phoneRequired) === false) {
        authStep.value = "authenticated";
      }
      if (authStep.value === "none") {
        authStep.value = "phone";
        return;
      }
      if (authStep.value === "phone" || authStep.value === "code") {
        return;
      }
      if (rolling.value || hasPlayed.value) return;
      rolling.value = true;
      rollSound.currentTime = 0;
      rollSound.play();
      rollParity.value = !rollParity.value;
      setTimeout(async () => {
        let result1 = Math.floor(Math.random() * 6) + 1;
        let result2 = Math.floor(Math.random() * 6) + 1;
        dice1.value = result1;
        dice2.value = result2;
        if (result1 === result2) {
          result.value = String(result1);
          confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
        } else {
          result.value = "\u0645\u062A\u0627\u0633\u0641\u0627\u0646\u0647 \u0627\u06CC\u0646\u0628\u0627\u0631 \u0628\u0631\u0646\u062F\u0647 \u0646\u0634\u062F\u06CC!";
        }
        hasPlayed.value = true;
        await sendResultToBackend();
        rolling.value = false;
      }, 1e3);
    };
    const submitPhone = async () => {
      authStep.value = "code";
      await sendOtpCode(phoneNumber.value);
      startCountdown();
    };
    const submitCode = async () => {
      const fullCode = codeInputs.value.join("");
      const response = await verifyOtpCode(phoneNumber.value, fullCode);
      if (response) {
        authStep.value = "authenticated";
      } else {
        alert("\u06A9\u062F \u0627\u0634\u062A\u0628\u0627\u0647\u0647 \u06CC\u0627 \u0645\u0646\u0642\u0636\u06CC \u0634\u062F\u0647!");
      }
    };
    const startCountdown = () => {
      countdown.value = 120;
      setInterval();
    };
    const cancelAuth = () => {
      authStep.value = "none";
      codeInputs.value = ["", "", "", ""];
      countdown.value = 0;
    };
    const { $axios } = useNuxtApp();
    const checkForPlay = async () => {
      var _a, _b;
      try {
        const response = await $axios.get(`club/${(_a = props.link) == null ? void 0 : _a.hash}/luckyDice/check`);
        emit("message", response.data.message || "");
        return response.status === 200;
      } catch (error) {
        if (((_b = error.response) == null ? void 0 : _b.status) === 403) {
          emit("message", error.response.data.message || "");
          return false;
        }
        return false;
      }
    };
    const sendResultToBackend = async () => {
      var _a, _b, _c, _d;
      try {
        const payload = {
          phone: phoneNumber.value,
          result: result.value
          // عددی مثل "1" تا "6" یا "متاسفانه اینبار برنده نشدی!"
        };
        const response = await $axios.post(`club/${(_a = props.link) == null ? void 0 : _a.hash}/luckyDice/result`, payload);
        if ((_d = (_c = (_b = response.data) == null ? void 0 : _b.data) == null ? void 0 : _c.reward) == null ? void 0 : _d.value) {
          prize.value = response.data.data.reward.value;
        }
        result.value = response.data.data.result.result;
      } catch (error) {
      }
    };
    return (_ctx, _push, _parent, _attrs) => {
      var _a, _b, _c, _d;
      _push(`<div${ssrRenderAttrs(mergeProps({
        class: __props.isListMode ? "w-full" : ""
      }, _attrs))} data-v-e77b38bb>`);
      if (!showGame.value) {
        _push(`<a class="${ssrRenderClass([
          __props.isListMode ? "flex items-center gap-4 backdrop-blur rounded-xl p-2 w-full cursor-pointer " + (((_a = formData.value) == null ? void 0 : _a.layout) === "left" ? "text-left" : "text-right") : "rounded-xl text-center p-2 flex flex-col items-center justify-center transition hover:shadow-md backdrop-blur cursor-pointer",
          __props.isDarkTheme ? "bg-white/[0.02]" : __props.isLightTheme ? "bg-black/[0.02]" : "bg-gradient-to-br from-white/60 via-white/30 to-white/10 border border-white/20"
        ])}" tabindex="0" role="button" data-v-e77b38bb><div class="${ssrRenderClass([
          __props.isListMode ? "flex-shrink-0 rounded-xl flex items-center overflow-hidden w-[54px] h-[54px]" : "w-[54px] h-[54px] rounded-xl flex items-center justify-center mb-2 overflow-hidden",
          __props.isDarkTheme || __props.isLightTheme ? "" : "bg-gray-100"
        ])}" data-v-e77b38bb>`);
        ssrRenderVNode(_push, createVNode(resolveDynamicComponent(iconComponent.value), mergeProps({ size: 50 }, iconColor.value ? { color: iconColor.value, filled: isIconFilled.value } : {}), null), _parent);
        _push(`</div> <div class="${ssrRenderClass(__props.isListMode ? "flex flex-col justify-center flex-1 min-w-0 " + (((_b = formData.value) == null ? void 0 : _b.layout) === "left" ? "text-left" : "text-right") : "w-full text-center mt-0 flex-1 flex flex-col justify-center")}" data-v-e77b38bb><div class="${ssrRenderClass([
          __props.isListMode ? "font-bold text-[14px] leading-snug break-words " + (((_c = formData.value) == null ? void 0 : _c.layout) === "left" ? "text-left" : "text-right") : "font-bold text-[15px] leading-snug text-center break-words",
          __props.isDarkTheme ? "text-white" : "text-gray-800"
        ])}" data-v-e77b38bb>${ssrInterpolate(unref(link).displayName || unref(link).title || unref(link).name || unref(link).value || unref(link).id || "\u062A\u0627\u0633 \u0634\u0627\u0646\u0633")}</div> `);
        if (__props.isListMode && unref(link).description && unref(link).description.trim()) {
          _push(`<div class="${ssrRenderClass([
            "text-xs font-normal mt-1 leading-relaxed whitespace-pre-line break-words " + (((_d = formData.value) == null ? void 0 : _d.layout) === "left" ? "text-left" : "text-right"),
            __props.isDarkTheme ? "text-gray-300" : "text-gray-600"
          ])}" data-v-e77b38bb>${ssrInterpolate(unref(link).description)}</div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div></a>`);
      } else {
        _push(`<!---->`);
      }
      _push(` `);
      _push(ssrRenderComponent(BaseModalGame, {
        modelValue: showGame.value,
        "onUpdate:modelValue": ($event) => showGame.value = $event
      }, {
        header: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="flex justify-between items-center p-4 border-b border-gray-100 bg-white" data-v-e77b38bb${_scopeId}><div class="flex items-center gap-3" data-v-e77b38bb${_scopeId}>`);
            ssrRenderVNode(_push2, createVNode(resolveDynamicComponent(iconComponent.value), mergeProps({ size: 50 }, iconColor.value ? { color: iconColor.value, filled: isIconFilled.value } : {}), null), _parent2, _scopeId);
            _push2(` <h3 class="text-lg font-semibold text-gray-800" data-v-e77b38bb${_scopeId}>${ssrInterpolate(unref(link).displayName || unref(link).title || unref(link).name || unref(link).value || unref(link).id || "\u062A\u0627\u0633 \u0634\u0627\u0646\u0633")}</h3></div> <button class="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors" data-v-e77b38bb${_scopeId}><i class="ti ti-x text-lg" data-v-e77b38bb${_scopeId}></i></button></div>`);
          } else {
            return [
              createVNode("div", { class: "flex justify-between items-center p-4 border-b border-gray-100 bg-white" }, [
                createVNode("div", { class: "flex items-center gap-3" }, [
                  (openBlock(), createBlock(resolveDynamicComponent(iconComponent.value), mergeProps({ size: 50 }, iconColor.value ? { color: iconColor.value, filled: isIconFilled.value } : {}), null, 16)),
                  createTextVNode(),
                  createVNode("h3", { class: "text-lg font-semibold text-gray-800" }, toDisplayString(unref(link).displayName || unref(link).title || unref(link).name || unref(link).value || unref(link).id || "\u062A\u0627\u0633 \u0634\u0627\u0646\u0633"), 1)
                ]),
                createTextVNode(),
                createVNode("button", {
                  onClick: ($event) => showGame.value = false,
                  class: "w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
                }, [
                  createVNode("i", { class: "ti ti-x text-lg" })
                ], 8, ["onClick"])
              ])
            ];
          }
        }),
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="flex-1 items-center h-full overflow-y-auto p-4 text-center" data-v-e77b38bb${_scopeId}>`);
            if (authStep.value === "phone" || authStep.value === "code") {
              _push2(ssrRenderComponent(AuthForm, {
                "game-icon": "\u{1F3B2}",
                "game-title": "\u062A\u0627\u0633 \u0634\u0627\u0646\u0633",
                "auth-step": authStep.value,
                "phone-number": phoneNumber.value,
                "onUpdate:phoneNumber": ($event) => phoneNumber.value = $event,
                "code-inputs": codeInputs.value,
                "onUpdate:codeInputs": ($event) => codeInputs.value = $event,
                countdown: countdown.value,
                onSubmitPhone: submitPhone,
                onSubmitCode: submitCode,
                onCancelAuth: cancelAuth
              }, null, _parent2, _scopeId));
            } else {
              _push2(`<div class="flex flex-col items-center justify-center py-4 px-4 text-center" data-v-e77b38bb${_scopeId}><div class="w-full flex flex-col items-center py-8 px-4 text-center" data-v-e77b38bb${_scopeId}><div class="dice mb-4 flex items-center justify-center gap-4 h-full" data-v-e77b38bb${_scopeId}><ol class="${ssrRenderClass([[rollParity.value ? "odd-roll" : "even-roll"], "die-list"])}"${ssrRenderAttr("data-roll", dice1.value)} id="die-1" data-v-e77b38bb${_scopeId}><!--[-->`);
              ssrRenderList(6, (n) => {
                _push2(`<li class="die-item"${ssrRenderAttr("data-side", n)} data-v-e77b38bb${_scopeId}><!--[-->`);
                ssrRenderList(getDots(n), (d) => {
                  var _a2;
                  _push2(`<span class="dot" style="${ssrRenderStyle({ backgroundColor: ((_a2 = unref(link).iconColor) == null ? void 0 : _a2.background) || "#000", boxShadow: "inset -0.15rem 0.15rem 0.25rem rgba(0,0,0,0.5)" })}" data-v-e77b38bb${_scopeId}></span>`);
                });
                _push2(`<!--]--></li>`);
              });
              _push2(`<!--]--></ol> <ol class="${ssrRenderClass([[!rollParity.value ? "odd-roll" : "even-roll"], "die-list"])}"${ssrRenderAttr("data-roll", dice2.value)} id="die-2" data-v-e77b38bb${_scopeId}><!--[-->`);
              ssrRenderList(6, (n) => {
                _push2(`<li class="die-item"${ssrRenderAttr("data-side", n)} data-v-e77b38bb${_scopeId}><!--[-->`);
                ssrRenderList(getDots(n), (d) => {
                  var _a2;
                  _push2(`<span class="dot" style="${ssrRenderStyle({ backgroundColor: ((_a2 = unref(link).iconColor) == null ? void 0 : _a2.background) || "#000", boxShadow: "inset -0.15rem 0.15rem 0.25rem rgba(0,0,0,0.5)" })}" data-v-e77b38bb${_scopeId}></span>`);
                });
                _push2(`<!--]--></li>`);
              });
              _push2(`<!--]--></ol></div> <button class="bg-black text-white px-6 py-2 rounded-full font-bold hover:bg-gray-800 transition flex items-center gap-2" data-v-e77b38bb${_scopeId}><i class="ti ti-dice text-lg" data-v-e77b38bb${_scopeId}></i>
            \u0627\u0645\u062A\u062D\u0627\u0646 \u0634\u0627\u0646\u0633!
          </button> `);
              if (result.value) {
                _push2(`<div class="mt-6 w-full flex flex-col items-center justify-center" data-v-e77b38bb${_scopeId}><div class="text-6xl mb-4" data-v-e77b38bb${_scopeId}><i class="${ssrRenderClass(result.value.includes("\u0628\u0631\u0646\u062F\u0647 \u0646\u0634\u062F\u06CC") ? "ti ti-mood-sad text-red-500" : "ti ti-trophy text-yellow-500 drop-shadow-lg")}" data-v-e77b38bb${_scopeId}></i></div> `);
                if (!result.value.includes("\u0628\u0631\u0646\u062F\u0647 \u0646\u0634\u062F\u06CC")) {
                  _push2(`<div class="mb-4" data-v-e77b38bb${_scopeId}><div class="text-2xl font-black mb-2 bg-gradient-to-r from-yellow-600 via-orange-500 to-red-500 bg-clip-text text-transparent" data-v-e77b38bb${_scopeId}>
                \u{1F389} \u062A\u0628\u0631\u06CC\u06A9 \u0645\u06CC\u06AF\u0645! \u{1F389}
              </div> <div class="text-base text-gray-700 font-bold" data-v-e77b38bb${_scopeId}>
                \u0634\u0645\u0627 \u0628\u0631\u0646\u062F\u0647 \u062E\u0648\u0634 \u0634\u0627\u0646\u0633 \u0645\u0627 \u0647\u0633\u062A\u06CC\u062F!
              </div></div>`);
                } else {
                  _push2(`<div class="text-xl font-bold mb-3 text-red-600" data-v-e77b38bb${_scopeId}>
              \u0645\u062A\u0627\u0633\u0641\u0627\u0646\u0647! \u{1F614}
            </div>`);
                }
                _push2(` <div class="mb-6" data-v-e77b38bb${_scopeId}>`);
                if (!result.value.includes("\u0628\u0631\u0646\u062F\u0647 \u0646\u0634\u062F\u06CC") && prize.value) {
                  _push2(`<div class="bg-gradient-to-r from-yellow-500 to-orange-500 text-white rounded-xl p-4 mb-3" data-v-e77b38bb${_scopeId}><div class="text-xs font-medium mb-2 opacity-90 flex items-center justify-center gap-1" data-v-e77b38bb${_scopeId}><i class="ti ti-trophy text-sm" data-v-e77b38bb${_scopeId}></i>
                  \u062C\u0627\u06CC\u0632\u0647 \u0634\u0645\u0627
                </div> <div class="text-lg font-mono font-bold tracking-wider bg-white/20 rounded-lg px-3 py-2 text-center select-all" data-v-e77b38bb${_scopeId}>${ssrInterpolate(prize.value)}</div></div>`);
                } else {
                  _push2(`<div class="text-lg font-bold text-gray-800 bg-gray-100 rounded-xl p-3" data-v-e77b38bb${_scopeId}>${ssrInterpolate(result.value)}</div>`);
                }
                _push2(`</div></div>`);
              } else {
                _push2(`<!---->`);
              }
              _push2(`</div></div>`);
            }
            _push2(`</div>`);
          } else {
            return [
              createVNode("div", { class: "flex-1 items-center h-full overflow-y-auto p-4 text-center" }, [
                authStep.value === "phone" || authStep.value === "code" ? (openBlock(), createBlock(AuthForm, {
                  key: 0,
                  "game-icon": "\u{1F3B2}",
                  "game-title": "\u062A\u0627\u0633 \u0634\u0627\u0646\u0633",
                  "auth-step": authStep.value,
                  "phone-number": phoneNumber.value,
                  "onUpdate:phoneNumber": ($event) => phoneNumber.value = $event,
                  "code-inputs": codeInputs.value,
                  "onUpdate:codeInputs": ($event) => codeInputs.value = $event,
                  countdown: countdown.value,
                  onSubmitPhone: submitPhone,
                  onSubmitCode: submitCode,
                  onCancelAuth: cancelAuth
                }, null, 8, ["auth-step", "phone-number", "onUpdate:phoneNumber", "code-inputs", "onUpdate:codeInputs", "countdown"])) : (openBlock(), createBlock("div", {
                  key: 1,
                  class: "flex flex-col items-center justify-center py-4 px-4 text-center"
                }, [
                  createVNode("div", { class: "w-full flex flex-col items-center py-8 px-4 text-center" }, [
                    createVNode("div", { class: "dice mb-4 flex items-center justify-center gap-4 h-full" }, [
                      createVNode("ol", {
                        class: ["die-list", [rollParity.value ? "odd-roll" : "even-roll"]],
                        "data-roll": dice1.value,
                        id: "die-1",
                        onClick: rollDice
                      }, [
                        (openBlock(), createBlock(Fragment, null, renderList(6, (n) => {
                          return createVNode("li", {
                            key: n,
                            class: "die-item",
                            "data-side": n
                          }, [
                            (openBlock(true), createBlock(Fragment, null, renderList(getDots(n), (d) => {
                              var _a2;
                              return openBlock(), createBlock("span", {
                                key: d,
                                class: "dot",
                                style: { backgroundColor: ((_a2 = unref(link).iconColor) == null ? void 0 : _a2.background) || "#000", boxShadow: "inset -0.15rem 0.15rem 0.25rem rgba(0,0,0,0.5)" }
                              }, null, 4);
                            }), 128))
                          ], 8, ["data-side"]);
                        }), 64))
                      ], 10, ["data-roll"]),
                      createTextVNode(),
                      createVNode("ol", {
                        class: ["die-list", [!rollParity.value ? "odd-roll" : "even-roll"]],
                        "data-roll": dice2.value,
                        id: "die-2",
                        onClick: rollDice
                      }, [
                        (openBlock(), createBlock(Fragment, null, renderList(6, (n) => {
                          return createVNode("li", {
                            key: n,
                            class: "die-item",
                            "data-side": n
                          }, [
                            (openBlock(true), createBlock(Fragment, null, renderList(getDots(n), (d) => {
                              var _a2;
                              return openBlock(), createBlock("span", {
                                key: d,
                                class: "dot",
                                style: { backgroundColor: ((_a2 = unref(link).iconColor) == null ? void 0 : _a2.background) || "#000", boxShadow: "inset -0.15rem 0.15rem 0.25rem rgba(0,0,0,0.5)" }
                              }, null, 4);
                            }), 128))
                          ], 8, ["data-side"]);
                        }), 64))
                      ], 10, ["data-roll"])
                    ]),
                    createTextVNode(),
                    createVNode("button", {
                      class: "bg-black text-white px-6 py-2 rounded-full font-bold hover:bg-gray-800 transition flex items-center gap-2",
                      onClick: rollDice
                    }, [
                      createVNode("i", { class: "ti ti-dice text-lg" }),
                      createTextVNode("\r\n            \u0627\u0645\u062A\u062D\u0627\u0646 \u0634\u0627\u0646\u0633!\r\n          ")
                    ]),
                    createTextVNode(),
                    result.value ? (openBlock(), createBlock("div", {
                      key: 0,
                      class: "mt-6 w-full flex flex-col items-center justify-center"
                    }, [
                      createVNode("div", { class: "text-6xl mb-4" }, [
                        createVNode("i", {
                          class: result.value.includes("\u0628\u0631\u0646\u062F\u0647 \u0646\u0634\u062F\u06CC") ? "ti ti-mood-sad text-red-500" : "ti ti-trophy text-yellow-500 drop-shadow-lg"
                        }, null, 2)
                      ]),
                      createTextVNode(),
                      !result.value.includes("\u0628\u0631\u0646\u062F\u0647 \u0646\u0634\u062F\u06CC") ? (openBlock(), createBlock("div", {
                        key: 0,
                        class: "mb-4"
                      }, [
                        createVNode("div", { class: "text-2xl font-black mb-2 bg-gradient-to-r from-yellow-600 via-orange-500 to-red-500 bg-clip-text text-transparent" }, "\r\n                \u{1F389} \u062A\u0628\u0631\u06CC\u06A9 \u0645\u06CC\u06AF\u0645! \u{1F389}\r\n              "),
                        createTextVNode(),
                        createVNode("div", { class: "text-base text-gray-700 font-bold" }, "\r\n                \u0634\u0645\u0627 \u0628\u0631\u0646\u062F\u0647 \u062E\u0648\u0634 \u0634\u0627\u0646\u0633 \u0645\u0627 \u0647\u0633\u062A\u06CC\u062F!\r\n              ")
                      ])) : (openBlock(), createBlock("div", {
                        key: 1,
                        class: "text-xl font-bold mb-3 text-red-600"
                      }, "\r\n              \u0645\u062A\u0627\u0633\u0641\u0627\u0646\u0647! \u{1F614}\r\n            ")),
                      createTextVNode(),
                      createVNode("div", { class: "mb-6" }, [
                        !result.value.includes("\u0628\u0631\u0646\u062F\u0647 \u0646\u0634\u062F\u06CC") && prize.value ? (openBlock(), createBlock("div", {
                          key: 0,
                          class: "bg-gradient-to-r from-yellow-500 to-orange-500 text-white rounded-xl p-4 mb-3"
                        }, [
                          createVNode("div", { class: "text-xs font-medium mb-2 opacity-90 flex items-center justify-center gap-1" }, [
                            createVNode("i", { class: "ti ti-trophy text-sm" }),
                            createTextVNode("\r\n                  \u062C\u0627\u06CC\u0632\u0647 \u0634\u0645\u0627\r\n                ")
                          ]),
                          createTextVNode(),
                          createVNode("div", { class: "text-lg font-mono font-bold tracking-wider bg-white/20 rounded-lg px-3 py-2 text-center select-all" }, toDisplayString(prize.value), 1)
                        ])) : (openBlock(), createBlock("div", {
                          key: 1,
                          class: "text-lg font-bold text-gray-800 bg-gray-100 rounded-xl p-3"
                        }, toDisplayString(result.value), 1))
                      ])
                    ])) : createCommentVNode("", true)
                  ])
                ]))
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/UserDashboard/main/EditCard/Preview/items/luckydice.vue");
  return _sfc_setup$c ? _sfc_setup$c(props, ctx) : void 0;
};
const luckydice = /* @__PURE__ */ _export_sfc(_sfc_main$c, [["__scopeId", "data-v-e77b38bb"]]);
const _sfc_main$b = defineComponent({
  components: {
    BaseModalGame,
    AuthForm
  },
  props: {
    link: { type: Object, required: false, default: () => ({}) },
    isListMode: { type: Boolean, default: false },
    isDarkTheme: { type: Boolean, default: false },
    isLightTheme: { type: Boolean, default: false },
    isBackgroundDark: { type: Boolean, default: false }
  },
  setup(props, { emit }) {
    const form = useFormStore();
    const formData = computed(() => form);
    const { sendOtpCode, verifyOtpCode } = useOtpService();
    const { getIconComponent } = useIconComponents();
    const iconData = computed(() => {
      var _a;
      return ((_a = props.link) == null ? void 0 : _a.icon) || null;
    });
    const iconComponent = computed(() => {
      var _a, _b;
      if (((_a = iconData.value) == null ? void 0 : _a.type) === "component" && ((_b = iconData.value) == null ? void 0 : _b.name)) {
        return getIconComponent(iconData.value.name);
      }
      return getIconComponent("luckywheel");
    });
    const iconColor = computed(() => {
      var _a;
      if (((_a = form.iconColor) == null ? void 0 : _a.background) && form.iconColor.background !== "transparent") {
        return form.iconColor.background;
      }
      return void 0;
    });
    const isIconFilled = computed(() => {
      var _a;
      return !!(((_a = form.iconColor) == null ? void 0 : _a.background) && form.iconColor.background !== "transparent");
    });
    const showGame = ref(false);
    const difficulty = ref("\u0633\u0627\u062F\u0647");
    const isSpinning = ref(false);
    const rotation = ref(0);
    const result = ref("");
    const codeInputRefs = ref([]);
    const authStep = ref("none");
    const phoneNumber = ref("");
    const verificationCode = ref("");
    const codeInputs = ref(["", "", "", ""]);
    const hasSpun = ref(false);
    const winningPrize = ref("");
    const countdown = ref(0);
    const canResendCode = ref(false);
    const isNewSpin = ref(false);
    const prize = ref("");
    const adjustOpacity = (hex, opacity) => {
      if (!hex.startsWith("#")) return hex;
      const r = parseInt(hex.slice(1, 3), 16);
      const g = parseInt(hex.slice(3, 5), 16);
      const b = parseInt(hex.slice(5, 7), 16);
      return `rgba(${r}, ${g}, ${b}, ${opacity})`;
    };
    const levels = [
      { value: "\u0633\u0627\u062F\u0647", label: "\u0633\u0627\u062F\u0647" },
      { value: "\u0645\u062A\u0648\u0633\u0637", label: "\u0645\u062A\u0648\u0633\u0637" },
      { value: "\u0633\u062E\u062A", label: "\u0633\u062E\u062A" }
    ];
    const wheelItems = computed(() => {
      var _a;
      const baseColor = ((_a = form.iconColor) == null ? void 0 : _a.background) || "#3B82F6";
      return [
        { name: "\u067E\u0648\u0686", color: adjustOpacity(baseColor, 0.3) },
        { name: "\u062C\u0627\u06CC\u0632\u0647 \u0648\u06CC\u0698\u0647", color: adjustOpacity(baseColor, 0.9) },
        { name: "\u062C\u0627\u06CC\u0632\u0647 \u0637\u0644\u0627\u06CC\u06CC", color: adjustOpacity(baseColor, 0.7) },
        { name: "\u062C\u0627\u06CC\u0632\u0647 \u0646\u0642\u0631\u0647\u200C\u0627\u06CC", color: adjustOpacity(baseColor, 0.8) },
        { name: "\u062C\u0627\u06CC\u0632\u0647 \u0628\u0631\u0646\u0632\u06CC", color: adjustOpacity(baseColor, 0.5) },
        { name: "\u062C\u0627\u06CC\u0632\u0647 \u0645\u0645\u062A\u0627\u0632", color: adjustOpacity(baseColor, 0.6) }
      ];
    });
    const startAuth = () => {
      var _a;
      if (hasSpun.value) {
        return;
      }
      if (((_a = props.link) == null ? void 0 : _a.phoneRequired) === false) {
        authStep.value = "authenticated";
        return;
      }
      if (authStep.value === "authenticated") {
        spinWheel();
      } else {
        authStep.value = "phone";
      }
    };
    const cancelAuth = () => {
      authStep.value = "none";
      codeInputs.value = ["", "", "", ""];
      countdown.value = 0;
    };
    const submitPhone = async () => {
      authStep.value = "code";
      await sendOtpCode(phoneNumber.value);
      startCountdown();
    };
    const startCountdown = () => {
      countdown.value = 120;
      setInterval();
    };
    const resendCode = () => {
      if (canResendCode.value) {
        canResendCode.value = false;
        startCountdown();
        alert("\u06A9\u062F \u062A\u0627\u06CC\u06CC\u062F \u0645\u062C\u062F\u062F \u0627\u0631\u0633\u0627\u0644 \u0634\u062F");
      }
    };
    const editPhoneNumber = () => {
      authStep.value = "phone";
      verificationCode.value = "";
      codeInputs.value = ["", "", "", ""];
      countdown.value = 0;
      canResendCode.value = false;
      setTimeout(() => {
        const phoneInput = (void 0).querySelector('input[type="tel"]');
        if (phoneInput) {
          phoneInput.focus();
          phoneInput.select();
        }
      }, 100);
    };
    const handleCodeInput = (index, event) => {
      const target = event.target;
      const value = target.value.replace(/[^0-9]/g, "");
      if (value.length > 1) {
        target.value = value.slice(-1);
        codeInputs.value[index] = value.slice(-1);
      } else {
        codeInputs.value[index] = value;
      }
      if (value && index < 3) {
        setTimeout(() => {
          const nextInput = codeInputRefs.value[index + 1];
          if (nextInput) {
            nextInput.focus();
          }
        }, 10);
      }
      verificationCode.value = codeInputs.value.join("");
    };
    const handleKeyDown = (index, event) => {
      if (event.key === "Backspace" && !codeInputs.value[index] && index > 0) {
        const prevInput = codeInputRefs.value[index - 1];
        if (prevInput) {
          prevInput.focus();
        }
      }
    };
    const handlePaste = (event) => {
      var _a;
      event.preventDefault();
      const pasteData = ((_a = event.clipboardData) == null ? void 0 : _a.getData("text")) || "";
      const digits = pasteData.replace(/[^0-9]/g, "").slice(0, 4);
      for (let i = 0; i < 4; i++) {
        codeInputs.value[i] = digits[i] || "";
      }
      verificationCode.value = codeInputs.value.join("");
      const lastFilledIndex = digits.length - 1;
      if (lastFilledIndex >= 0 && lastFilledIndex < 4) {
        const targetInput = codeInputRefs.value[lastFilledIndex];
        if (targetInput) {
          targetInput.focus();
        }
      }
    };
    const submitCode = async () => {
      const fullCode = codeInputs.value.join("");
      try {
        const res = await verifyOtpCode(phoneNumber.value, fullCode);
        if (res) {
          authStep.value = "authenticated";
          localStorage.setItem("luckywheel_user_data", JSON.stringify({
            phoneNumber: phoneNumber.value,
            hasSpun: false,
            authenticatedAt: (/* @__PURE__ */ new Date()).toISOString()
          }));
        } else {
          alert("\u06A9\u062F \u062A\u0623\u06CC\u06CC\u062F \u0627\u0634\u062A\u0628\u0627\u0647 \u0627\u0633\u062A");
        }
      } catch (e) {
        alert("\u0645\u0634\u06A9\u0644 \u062F\u0631 \u062A\u0623\u06CC\u06CC\u062F \u06A9\u062F");
      }
    };
    const goBack = () => {
      if (authStep.value === "code") {
        authStep.value = "phone";
        verificationCode.value = "";
        codeInputs.value = ["", "", "", ""];
        countdown.value = 0;
        canResendCode.value = false;
      }
    };
    const resetGame = () => {
      showGame.value = false;
    };
    const resetForTesting = () => {
      localStorage.removeItem("luckywheel_user_data");
      hasSpun.value = false;
      authStep.value = "none";
      phoneNumber.value = "";
      result.value = "";
      winningPrize.value = "";
      prize.value = "";
    };
    const lastMediumWasPrize = ref(false);
    const segmentAngle = computed(() => 360 / wheelItems.value.length);
    async function spinWheel() {
      const canPlay = await checkForPlay();
      if (!canPlay) {
        return;
      }
      if (isSpinning.value || hasSpun.value || authStep.value !== "authenticated") return;
      isSpinning.value = true;
      result.value = "";
      isNewSpin.value = true;
      let selectedIndex = 0;
      if (difficulty.value === "\u0633\u0627\u062F\u0647") {
        selectedIndex = Math.floor(Math.random() * 5) + 1;
      } else if (difficulty.value === "\u0645\u062A\u0648\u0633\u0637") {
        if (lastMediumWasPrize.value) {
          selectedIndex = 0;
        } else {
          selectedIndex = Math.floor(Math.random() * 5) + 1;
        }
        lastMediumWasPrize.value = !lastMediumWasPrize.value;
      } else if (difficulty.value === "\u0633\u062E\u062A") {
        selectedIndex = 0;
      }
      selectedIndex = Math.max(0, Math.min(selectedIndex, wheelItems.value.length - 1));
      const segmentSize = 360 / wheelItems.value.length;
      const prizeAngle = selectedIndex * segmentSize + segmentSize / 2;
      const spins = 6 + Math.floor(Math.random() * 3);
      const currentRotation = rotation.value % 360;
      const targetRotation = (360 - prizeAngle + 360) % 360;
      const rotationDifference = (targetRotation - currentRotation + 360) % 360;
      const totalRotation = 360 * spins + rotationDifference;
      rotation.value = rotation.value + totalRotation;
      new Audio("/sounds/tick.mp3");
      const tickInterval = setInterval();
      setTimeout(async () => {
        clearInterval(tickInterval);
        const selectedPrize = wheelItems.value[selectedIndex];
        result.value = selectedPrize ? selectedPrize.name : "\u067E\u0648\u0686";
        isSpinning.value = false;
        await sendResultToBackend(props.link.hash);
        if (result.value.includes("\u067E\u0648\u0686")) {
          result.value = "\u0627\u06CC\u0646\u0628\u0627\u0631 \u0628\u0631\u0646\u062F\u0647 \u0646\u0634\u062F\u06CC\u062F! \u062F\u0648\u0628\u0627\u0631\u0647 \u062A\u0644\u0627\u0634 \u06A9\u0646\u06CC\u062F";
        }
        hasSpun.value = true;
        if (isNewSpin.value && !result.value.includes("\u067E\u0648\u0686") && !result.value.includes("\u0628\u0631\u0646\u062F\u0647 \u0646\u0634\u062F\u06CC\u062F")) {
          setTimeout(() => {
            confetti({
              particleCount: 200,
              spread: 90,
              origin: { y: 0.6 },
              colors: ["#FFD700", "#FFA500", "#FF6347", "#32CD32", "#1E90FF", "#DA70D6", "#FF69B4"],
              scalar: 1.2,
              gravity: 0.8
            });
          }, 200);
        }
      }, 3500);
    }
    function hexToRgb(hex) {
      if (!hex.startsWith("#")) return [255, 255, 255];
      const r = parseInt(hex.slice(1, 3), 16);
      const g = parseInt(hex.slice(3, 5), 16);
      const b = parseInt(hex.slice(5, 7), 16);
      return [r, g, b];
    }
    function isDark(color) {
      var _a;
      let rgb = [255, 255, 255];
      if (color.startsWith("rgba")) {
        rgb = ((_a = color.match(/\d+/g)) == null ? void 0 : _a.slice(0, 3).map(Number)) || [255, 255, 255];
      } else if (color.startsWith("#")) {
        rgb = hexToRgb(color);
      }
      const brightness = (rgb[0] * 299 + rgb[1] * 587 + rgb[2] * 114) / 1e3;
      return brightness < 140;
    }
    function getHueRotation(hexColor) {
      if (!hexColor.startsWith("#")) return 0;
      const r = parseInt(hexColor.slice(1, 3), 16) / 255;
      const g = parseInt(hexColor.slice(3, 5), 16) / 255;
      const b = parseInt(hexColor.slice(5, 7), 16) / 255;
      const max = Math.max(r, g, b);
      const min = Math.min(r, g, b);
      const diff = max - min;
      let hue = 0;
      if (diff !== 0) {
        if (max === r) {
          hue = (g - b) / diff % 6;
        } else if (max === g) {
          hue = (b - r) / diff + 2;
        } else {
          hue = (r - g) / diff + 4;
        }
      }
      hue = Math.round(hue * 60);
      if (hue < 0) hue += 360;
      return hue - 45;
    }
    async function sendResultToBackend(hash) {
      var _a, _b, _c;
      const { $axios } = useNuxtApp();
      const axios = $axios;
      try {
        const payload = {
          phone: phoneNumber.value,
          result: result.value
        };
        const response = await axios.post(`club/${hash}/luckyWheel/result`, payload);
        if ((_c = (_b = (_a = response.data) == null ? void 0 : _a.data) == null ? void 0 : _b.reward) == null ? void 0 : _c.value) {
          prize.value = response.data.data.reward.value;
        }
        result.value = response.data.data.result.result;
      } catch (error) {
      }
    }
    const checkForPlay = async () => {
      var _a, _b;
      const { $axios } = useNuxtApp();
      const axios = $axios;
      try {
        const response = await axios.get(`club/${(_a = props.link) == null ? void 0 : _a.hash}/luckyWheel/check`);
        emit("message", response.data.message || "");
        return response.status === 200;
      } catch (error) {
        if (((_b = error.response) == null ? void 0 : _b.status) === 403) {
          emit("message", error.response.data.message || "");
          return false;
        }
        emit("message", "\u062E\u0637\u0627 \u062F\u0631 \u0628\u0631\u0631\u0633\u06CC \u0648\u0636\u0639\u06CC\u062A \u0628\u0627\u0632\u06CC:");
        return false;
      }
    };
    return {
      form,
      formData,
      showGame,
      wheelItems,
      difficulty,
      isSpinning,
      rotation,
      result,
      segmentAngle,
      spinWheel,
      levels,
      isDark,
      getHueRotation,
      adjustOpacity,
      authStep,
      phoneNumber,
      verificationCode,
      codeInputs,
      codeInputRefs,
      hasSpun,
      winningPrize,
      countdown,
      canResendCode,
      startAuth,
      cancelAuth,
      submitPhone,
      submitCode,
      editPhoneNumber,
      goBack,
      resetGame,
      resetForTesting,
      startCountdown,
      resendCode,
      handleCodeInput,
      handleKeyDown,
      handlePaste,
      prize,
      iconData,
      iconColor,
      isIconFilled,
      iconComponent
    };
  }
});
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  var _a, _b, _c, _d;
  const _component_BaseModalGame = resolveComponent("BaseModalGame");
  const _component_AuthForm = resolveComponent("AuthForm");
  _push(`<div${ssrRenderAttrs(mergeProps({
    class: _ctx.isListMode ? "w-full" : ""
  }, _attrs))} data-v-7d2183e8>`);
  if (!_ctx.showGame) {
    _push(`<a${ssrRenderAttrs(mergeProps(_ctx.$attrs, {
      class: [
        _ctx.isListMode ? "flex items-center gap-4 backdrop-blur rounded-xl p-2 w-full cursor-pointer " + (((_a = _ctx.formData) == null ? void 0 : _a.layout) === "left" ? "text-left" : "text-right") : "rounded-xl text-center p-2 flex flex-col items-center justify-center transition hover:shadow-md backdrop-blur cursor-pointer",
        _ctx.isDarkTheme ? "bg-white/[0.02]" : _ctx.isLightTheme ? "bg-black/[0.02]" : "bg-gradient-to-br from-white/60 via-white/30 to-white/10 border border-white/20"
      ],
      tabindex: "0",
      role: "button"
    }))} data-v-7d2183e8><div class="${ssrRenderClass([
      _ctx.isListMode ? "flex-shrink-0 rounded-xl flex items-center overflow-hidden w-[54px] h-[54px]" : "w-[54px] h-[54px] rounded-xl flex items-center justify-center mb-2 overflow-hidden",
      _ctx.isDarkTheme || _ctx.isLightTheme ? "" : "bg-gray-100"
    ])}" data-v-7d2183e8>`);
    ssrRenderVNode(_push, createVNode(resolveDynamicComponent(_ctx.iconComponent), mergeProps({ size: 50 }, _ctx.iconColor ? { color: _ctx.iconColor, filled: _ctx.isIconFilled } : {}), null), _parent);
    _push(`</div> <div class="${ssrRenderClass(_ctx.isListMode ? "flex flex-col justify-center flex-1 min-w-0 " + (((_b = _ctx.formData) == null ? void 0 : _b.layout) === "left" ? "text-left" : "text-right") : "w-full text-center mt-0 flex-1 flex flex-col justify-center")}" data-v-7d2183e8><div class="${ssrRenderClass([
      _ctx.isListMode ? "font-bold text-[14px] leading-snug break-words " + (((_c = _ctx.formData) == null ? void 0 : _c.layout) === "left" ? "text-left" : "text-right") : "font-bold text-[15px] leading-snug text-center break-words",
      _ctx.isDarkTheme ? "text-white" : "text-gray-800"
    ])}" data-v-7d2183e8>${ssrInterpolate(_ctx.link.displayName || _ctx.link.title || _ctx.link.name || _ctx.link.value || _ctx.link.id || "\u06AF\u0631\u062F\u0648\u0646\u0647 \u0634\u0627\u0646\u0633")}</div> `);
    if (_ctx.isListMode && _ctx.link.description && _ctx.link.description.trim()) {
      _push(`<div class="${ssrRenderClass([
        "text-xs font-normal mt-1 leading-relaxed whitespace-pre-line break-words " + (((_d = _ctx.formData) == null ? void 0 : _d.layout) === "left" ? "text-left" : "text-right"),
        _ctx.isDarkTheme ? "text-gray-300" : "text-gray-600"
      ])}" data-v-7d2183e8>${ssrInterpolate(_ctx.link.description)}</div>`);
    } else {
      _push(`<!---->`);
    }
    _push(`</div></a>`);
  } else {
    _push(`<!---->`);
  }
  _push(` `);
  _push(ssrRenderComponent(_component_BaseModalGame, {
    modelValue: _ctx.showGame,
    "onUpdate:modelValue": ($event) => _ctx.showGame = $event
  }, {
    header: withCtx((_, _push2, _parent2, _scopeId) => {
      if (_push2) {
        _push2(`<div class="flex justify-between items-center p-4 border-b border-gray-100 bg-white" data-v-7d2183e8${_scopeId}><div class="flex items-center gap-3" data-v-7d2183e8${_scopeId}>`);
        ssrRenderVNode(_push2, createVNode(resolveDynamicComponent(_ctx.iconComponent), mergeProps({ size: 50 }, _ctx.iconColor ? { color: _ctx.iconColor, filled: _ctx.isIconFilled } : {}), null), _parent2, _scopeId);
        _push2(` <h3 class="text-lg font-semibold text-gray-800" data-v-7d2183e8${_scopeId}>${ssrInterpolate(_ctx.link.displayName || _ctx.link.title || _ctx.link.name || _ctx.link.value || _ctx.link.id || "\u06AF\u0631\u062F\u0648\u0646\u0647 \u0634\u0627\u0646\u0633")}</h3></div> <button class="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors" data-v-7d2183e8${_scopeId}><i class="ti ti-x text-lg" data-v-7d2183e8${_scopeId}></i></button></div>`);
      } else {
        return [
          createVNode("div", { class: "flex justify-between items-center p-4 border-b border-gray-100 bg-white" }, [
            createVNode("div", { class: "flex items-center gap-3" }, [
              (openBlock(), createBlock(resolveDynamicComponent(_ctx.iconComponent), mergeProps({ size: 50 }, _ctx.iconColor ? { color: _ctx.iconColor, filled: _ctx.isIconFilled } : {}), null, 16)),
              createTextVNode(),
              createVNode("h3", { class: "text-lg font-semibold text-gray-800" }, toDisplayString(_ctx.link.displayName || _ctx.link.title || _ctx.link.name || _ctx.link.value || _ctx.link.id || "\u06AF\u0631\u062F\u0648\u0646\u0647 \u0634\u0627\u0646\u0633"), 1)
            ]),
            createTextVNode(),
            createVNode("button", {
              onClick: ($event) => _ctx.showGame = false,
              class: "w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
            }, [
              createVNode("i", { class: "ti ti-x text-lg" })
            ], 8, ["onClick"])
          ])
        ];
      }
    }),
    default: withCtx((_, _push2, _parent2, _scopeId) => {
      var _a2, _b2, _c2, _d2;
      if (_push2) {
        _push2(`<div class="${ssrRenderClass([_ctx.result ? "h-full" : "p-4", "flex-1 !overflow-y-auto h-full text-center relative"])}" data-v-7d2183e8${_scopeId}>`);
        if (_ctx.authStep === "phone" || _ctx.authStep === "code") {
          _push2(ssrRenderComponent(_component_AuthForm, {
            "game-icon": "\u{1F3B0}",
            "game-title": "\u06AF\u0631\u062F\u0648\u0646\u0647 \u0634\u0627\u0646\u0633",
            "auth-step": _ctx.authStep,
            "phone-number": _ctx.phoneNumber,
            "onUpdate:phoneNumber": ($event) => _ctx.phoneNumber = $event,
            "code-inputs": _ctx.codeInputs,
            "onUpdate:codeInputs": ($event) => _ctx.codeInputs = $event,
            countdown: _ctx.countdown,
            onSubmitPhone: _ctx.submitPhone,
            onSubmitCode: _ctx.submitCode,
            onCancelAuth: _ctx.cancelAuth
          }, null, _parent2, _scopeId));
        } else if (_ctx.authStep === "authenticated" && _ctx.hasSpun && !_ctx.result) {
          _push2(`<div class="flex flex-col items-center justify-center py-8 px-4 h-full" data-v-7d2183e8${_scopeId}><div class="text-4xl mb-4 text-orange-500" data-v-7d2183e8${_scopeId}><i class="ti ti-clock" data-v-7d2183e8${_scopeId}></i></div> <h3 class="text-xl font-bold mb-4 text-gray-700" data-v-7d2183e8${_scopeId}>\u0634\u0645\u0627 \u0642\u0628\u0644\u0627\u064B \u0634\u0631\u06A9\u062A \u06A9\u0631\u062F\u0647\u200C\u0627\u06CC\u062F</h3> <p class="text-gray-600 text-center mb-4" data-v-7d2183e8${_scopeId}>
              \u0647\u0631 \u0634\u0645\u0627\u0631\u0647 \u0645\u0648\u0628\u0627\u06CC\u0644 \u062A\u0646\u0647\u0627 \u06CC\u06A9\u0628\u0627\u0631 \u0645\u06CC\u200C\u062A\u0648\u0627\u0646\u062F \u062F\u0631 \u06AF\u0631\u062F\u0648\u0646\u0647 \u0634\u0627\u0646\u0633 \u0634\u0631\u06A9\u062A \u06A9\u0646\u062F.
            </p> <p class="text-sm text-gray-500" data-v-7d2183e8${_scopeId}>
              \u0634\u0645\u0627\u0631\u0647 \u0645\u0648\u0628\u0627\u06CC\u0644: ${ssrInterpolate(_ctx.phoneNumber)}</p></div>`);
        } else {
          _push2(`<div class="flex flex-col items-center justify-center py-6 px-4 text-center h-full" data-v-7d2183e8${_scopeId}>`);
          if (!_ctx.result) {
            _push2(`<div class="relative w-72 h-72 mb-8 mx-auto" data-v-7d2183e8${_scopeId}><div class="wheel w-full h-full rounded-full border-4 relative overflow-hidden transition-transform" style="${ssrRenderStyle({
              transform: `rotate(${_ctx.rotation}deg)`,
              borderColor: ((_a2 = _ctx.form.iconColor) == null ? void 0 : _a2.background) || "#3B82F6",
              transitionDuration: _ctx.isSpinning ? "3.5s" : "0s",
              transitionTimingFunction: "cubic-bezier(0.25, 0.46, 0.45, 0.94)",
              willChange: _ctx.isSpinning ? "transform" : "auto",
              backfaceVisibility: "hidden",
              perspective: "1000px"
            })}" data-v-7d2183e8${_scopeId}><!--[-->`);
            ssrRenderList(_ctx.wheelItems, (prize, index) => {
              _push2(`<div class="wheel-segment absolute w-full h-full" style="${ssrRenderStyle({
                transform: `rotate(${index * _ctx.segmentAngle}deg)`,
                backgroundColor: prize.color,
                color: _ctx.isDark(prize.color) ? "#fff" : "#222"
              })}" data-v-7d2183e8${_scopeId}><div class="absolute font-bold text-sm text-center flex flex-col items-center justify-center" style="${ssrRenderStyle({
                transform: `rotate(${_ctx.segmentAngle / 2}deg)`,
                left: "65%",
                top: "15px",
                transformOrigin: "0 60px",
                width: "60px",
                marginLeft: "-25px",
                color: _ctx.isDark(prize.color) ? "#fff" : "#222"
              })}" data-v-7d2183e8${_scopeId}><div class="text-lg" data-v-7d2183e8${_scopeId}>${ssrInterpolate(prize.name.split(" ")[0])}</div> <div class="text-xs font-medium mt-1 leading-tight" data-v-7d2183e8${_scopeId}>${ssrInterpolate(prize.name.split(" ").slice(1).join(" "))}</div></div></div>`);
            });
            _push2(`<!--]--> <div class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-20 h-20 rounded-full z-10 border-4 shadow-lg flex items-center justify-center" style="${ssrRenderStyle({
              backgroundColor: ((_b2 = _ctx.form.iconColor) == null ? void 0 : _b2.background) || "#3B82F6",
              borderColor: "#ffffff"
            })}" data-v-7d2183e8${_scopeId}><div class="text-white text-2xl font-bold" data-v-7d2183e8${_scopeId}>\u25CF</div></div></div> <div class="absolute -top-4 left-1/2 transform -translate-x-1/2 z-30" data-v-7d2183e8${_scopeId}><div class="relative" data-v-7d2183e8${_scopeId}><div class="relative flex flex-col items-center" data-v-7d2183e8${_scopeId}><div class="w-6 h-6 rounded-full border-2 border-white shadow-lg flex items-center justify-center" style="${ssrRenderStyle({ "background-color": "#FF8C00" })}" data-v-7d2183e8${_scopeId}><div class="w-2 h-2 bg-white rounded-full" data-v-7d2183e8${_scopeId}></div></div> <div class="relative -mt-1" data-v-7d2183e8${_scopeId}><div class="w-0 h-0 border-l-[8px] border-r-[8px] border-t-[12px] border-l-transparent border-r-transparent" style="${ssrRenderStyle({ "border-top-color": "#FF8C00", "filter": "drop-shadow(0 2px 4px rgba(255,140,0,0.4))" })}" data-v-7d2183e8${_scopeId}></div></div> <div class="absolute top-1 left-1 w-6 h-6 rounded-full opacity-20" style="${ssrRenderStyle({ "background-color": "#FF8C00", "filter": "blur(2px)" })}" data-v-7d2183e8${_scopeId}></div></div></div></div></div>`);
          } else {
            _push2(`<!---->`);
          }
          _push2(` `);
          if (!_ctx.result) {
            _push2(`<button${ssrIncludeBooleanAttr(_ctx.isSpinning || _ctx.hasSpun) ? " disabled" : ""} class="px-8 py-3 rounded-xl font-bold text-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:scale-105 bg-black text-white hover:bg-gray-800" data-v-7d2183e8${_scopeId}>${ssrInterpolate(_ctx.isSpinning ? "\u062F\u0631 \u062D\u0627\u0644 \u0686\u0631\u062E\u0634..." : _ctx.authStep === "authenticated" ? "\u0628\u0686\u0631\u062E\u0648\u0646!" : "\u0634\u0631\u0648\u0639 \u0628\u0627\u0632\u06CC")}</button>`);
          } else {
            _push2(`<!---->`);
          }
          _push2(` `);
          if (_ctx.result) {
            _push2(`<div class="absolute inset-0 flex flex-col items-center justify-center text-center overflow-hidden bg-white" data-v-7d2183e8${_scopeId}><div class="relative z-10 px-6 py-6 w-full h-full flex flex-col justify-center" data-v-7d2183e8${_scopeId}><div class="text-6xl mb-4" data-v-7d2183e8${_scopeId}><i class="${ssrRenderClass(_ctx.result.includes("\u0628\u0631\u0646\u062F\u0647 \u0646\u0634\u062F\u06CC\u062F") || _ctx.result === "\u067E\u0648\u0686" ? "ti ti-mood-sad text-red-500" : "ti ti-trophy text-yellow-500 drop-shadow-lg")}" data-v-7d2183e8${_scopeId}></i></div> `);
            if (!_ctx.result.includes("\u0628\u0631\u0646\u062F\u0647 \u0646\u0634\u062F\u06CC\u062F") && _ctx.result !== "\u067E\u0648\u0686") {
              _push2(`<div class="mb-4" data-v-7d2183e8${_scopeId}><div class="text-2xl font-black mb-2 bg-gradient-to-r from-yellow-600 via-orange-500 to-red-500 bg-clip-text text-transparent" data-v-7d2183e8${_scopeId}>
                      \u{1F389} \u062A\u0628\u0631\u06CC\u06A9 \u0645\u06CC\u06AF\u0645! \u{1F389}
                    </div> <div class="text-base text-gray-700 font-bold" data-v-7d2183e8${_scopeId}>
                   \u0634\u0645\u0627 \u0628\u0631\u0646\u062F\u0647 \u062E\u0648\u0634 \u0634\u0627\u0646\u0633 \u0645\u0627 \u0647\u0633\u062A\u06CC\u062F!
                    </div></div>`);
            } else {
              _push2(`<div class="text-xl font-bold mb-3 text-red-600" data-v-7d2183e8${_scopeId}>
                    \u0645\u062A\u0627\u0633\u0641\u0627\u0646\u0647! \u{1F614}
                  </div>`);
            }
            _push2(` <div class="mb-6" data-v-7d2183e8${_scopeId}>`);
            if (!_ctx.result.includes("\u0628\u0631\u0646\u062F\u0647 \u0646\u0634\u062F\u06CC\u062F") && _ctx.result !== "\u067E\u0648\u0686") {
              _push2(`<div class="border-yellow-300" data-v-7d2183e8${_scopeId}>`);
              if (_ctx.prize) {
                _push2(`<div class="bg-gradient-to-r from-yellow-500 to-orange-500 text-white rounded-xl p-4 mb-3 shadow-lg" data-v-7d2183e8${_scopeId}><div class="text-xs font-medium mb-2 opacity-90 flex items-center justify-center gap-1" data-v-7d2183e8${_scopeId}><i class="ti ti-trophy text-sm" data-v-7d2183e8${_scopeId}></i>
                          \u062C\u0627\u06CC\u0632\u0647 \u0634\u0645\u0627
                        </div> <div class="text-lg font-mono font-bold tracking-wider bg-white/20 rounded-lg px-3 py-2 text-center select-all" data-v-7d2183e8${_scopeId}>${ssrInterpolate(_ctx.prize)}</div></div>`);
              } else {
                _push2(`<!---->`);
              }
              _push2(`</div>`);
            } else {
              _push2(`<div class="text-lg font-bold text-gray-800 bg-gray-100 rounded-xl p-3" data-v-7d2183e8${_scopeId}>${ssrInterpolate(_ctx.result)}</div>`);
            }
            _push2(`</div></div></div>`);
          } else {
            _push2(`<!---->`);
          }
          _push2(`</div>`);
        }
        _push2(`</div>`);
      } else {
        return [
          createVNode("div", {
            class: ["flex-1 !overflow-y-auto h-full text-center relative", _ctx.result ? "h-full" : "p-4"]
          }, [
            _ctx.authStep === "phone" || _ctx.authStep === "code" ? (openBlock(), createBlock(_component_AuthForm, {
              key: 0,
              "game-icon": "\u{1F3B0}",
              "game-title": "\u06AF\u0631\u062F\u0648\u0646\u0647 \u0634\u0627\u0646\u0633",
              "auth-step": _ctx.authStep,
              "phone-number": _ctx.phoneNumber,
              "onUpdate:phoneNumber": ($event) => _ctx.phoneNumber = $event,
              "code-inputs": _ctx.codeInputs,
              "onUpdate:codeInputs": ($event) => _ctx.codeInputs = $event,
              countdown: _ctx.countdown,
              onSubmitPhone: _ctx.submitPhone,
              onSubmitCode: _ctx.submitCode,
              onCancelAuth: _ctx.cancelAuth
            }, null, 8, ["auth-step", "phone-number", "onUpdate:phoneNumber", "code-inputs", "onUpdate:codeInputs", "countdown", "onSubmitPhone", "onSubmitCode", "onCancelAuth"])) : _ctx.authStep === "authenticated" && _ctx.hasSpun && !_ctx.result ? (openBlock(), createBlock("div", {
              key: 1,
              class: "flex flex-col items-center justify-center py-8 px-4 h-full"
            }, [
              createVNode("div", { class: "text-4xl mb-4 text-orange-500" }, [
                createVNode("i", { class: "ti ti-clock" })
              ]),
              createTextVNode(),
              createVNode("h3", { class: "text-xl font-bold mb-4 text-gray-700" }, "\u0634\u0645\u0627 \u0642\u0628\u0644\u0627\u064B \u0634\u0631\u06A9\u062A \u06A9\u0631\u062F\u0647\u200C\u0627\u06CC\u062F"),
              createTextVNode(),
              createVNode("p", { class: "text-gray-600 text-center mb-4" }, "\r\n              \u0647\u0631 \u0634\u0645\u0627\u0631\u0647 \u0645\u0648\u0628\u0627\u06CC\u0644 \u062A\u0646\u0647\u0627 \u06CC\u06A9\u0628\u0627\u0631 \u0645\u06CC\u200C\u062A\u0648\u0627\u0646\u062F \u062F\u0631 \u06AF\u0631\u062F\u0648\u0646\u0647 \u0634\u0627\u0646\u0633 \u0634\u0631\u06A9\u062A \u06A9\u0646\u062F.\r\n            "),
              createTextVNode(),
              createVNode("p", { class: "text-sm text-gray-500" }, "\r\n              \u0634\u0645\u0627\u0631\u0647 \u0645\u0648\u0628\u0627\u06CC\u0644: " + toDisplayString(_ctx.phoneNumber), 1)
            ])) : (openBlock(), createBlock("div", {
              key: 2,
              class: "flex flex-col items-center justify-center py-6 px-4 text-center h-full"
            }, [
              !_ctx.result ? (openBlock(), createBlock("div", {
                key: 0,
                class: "relative w-72 h-72 mb-8 mx-auto"
              }, [
                createVNode("div", {
                  ref: "wheelEl",
                  class: "wheel w-full h-full rounded-full border-4 relative overflow-hidden transition-transform",
                  style: {
                    transform: `rotate(${_ctx.rotation}deg)`,
                    borderColor: ((_c2 = _ctx.form.iconColor) == null ? void 0 : _c2.background) || "#3B82F6",
                    transitionDuration: _ctx.isSpinning ? "3.5s" : "0s",
                    transitionTimingFunction: "cubic-bezier(0.25, 0.46, 0.45, 0.94)",
                    willChange: _ctx.isSpinning ? "transform" : "auto",
                    backfaceVisibility: "hidden",
                    perspective: "1000px"
                  }
                }, [
                  (openBlock(true), createBlock(Fragment, null, renderList(_ctx.wheelItems, (prize, index) => {
                    return openBlock(), createBlock("div", {
                      key: index,
                      class: "wheel-segment absolute w-full h-full",
                      style: {
                        transform: `rotate(${index * _ctx.segmentAngle}deg)`,
                        backgroundColor: prize.color,
                        color: _ctx.isDark(prize.color) ? "#fff" : "#222"
                      }
                    }, [
                      createVNode("div", {
                        class: "absolute font-bold text-sm text-center flex flex-col items-center justify-center",
                        style: {
                          transform: `rotate(${_ctx.segmentAngle / 2}deg)`,
                          left: "65%",
                          top: "15px",
                          transformOrigin: "0 60px",
                          width: "60px",
                          marginLeft: "-25px",
                          color: _ctx.isDark(prize.color) ? "#fff" : "#222"
                        }
                      }, [
                        createVNode("div", { class: "text-lg" }, toDisplayString(prize.name.split(" ")[0]), 1),
                        createTextVNode(),
                        createVNode("div", { class: "text-xs font-medium mt-1 leading-tight" }, toDisplayString(prize.name.split(" ").slice(1).join(" ")), 1)
                      ], 4)
                    ], 4);
                  }), 128)),
                  createTextVNode(),
                  createVNode("div", {
                    class: "absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-20 h-20 rounded-full z-10 border-4 shadow-lg flex items-center justify-center",
                    style: {
                      backgroundColor: ((_d2 = _ctx.form.iconColor) == null ? void 0 : _d2.background) || "#3B82F6",
                      borderColor: "#ffffff"
                    }
                  }, [
                    createVNode("div", { class: "text-white text-2xl font-bold" }, "\u25CF")
                  ], 4)
                ], 4),
                createTextVNode(),
                createVNode("div", { class: "absolute -top-4 left-1/2 transform -translate-x-1/2 z-30" }, [
                  createVNode("div", { class: "relative" }, [
                    createVNode("div", { class: "relative flex flex-col items-center" }, [
                      createVNode("div", {
                        class: "w-6 h-6 rounded-full border-2 border-white shadow-lg flex items-center justify-center",
                        style: { "background-color": "#FF8C00" }
                      }, [
                        createVNode("div", { class: "w-2 h-2 bg-white rounded-full" })
                      ]),
                      createTextVNode(),
                      createVNode("div", { class: "relative -mt-1" }, [
                        createVNode("div", {
                          class: "w-0 h-0 border-l-[8px] border-r-[8px] border-t-[12px] border-l-transparent border-r-transparent",
                          style: { "border-top-color": "#FF8C00", "filter": "drop-shadow(0 2px 4px rgba(255,140,0,0.4))" }
                        })
                      ]),
                      createTextVNode(),
                      createVNode("div", {
                        class: "absolute top-1 left-1 w-6 h-6 rounded-full opacity-20",
                        style: { "background-color": "#FF8C00", "filter": "blur(2px)" }
                      })
                    ])
                  ])
                ])
              ])) : createCommentVNode("", true),
              createTextVNode(),
              !_ctx.result ? (openBlock(), createBlock("button", {
                key: 1,
                onClick: ($event) => _ctx.authStep === "authenticated" ? _ctx.spinWheel() : _ctx.startAuth(),
                disabled: _ctx.isSpinning || _ctx.hasSpun,
                class: "px-8 py-3 rounded-xl font-bold text-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:scale-105 bg-black text-white hover:bg-gray-800"
              }, toDisplayString(_ctx.isSpinning ? "\u062F\u0631 \u062D\u0627\u0644 \u0686\u0631\u062E\u0634..." : _ctx.authStep === "authenticated" ? "\u0628\u0686\u0631\u062E\u0648\u0646!" : "\u0634\u0631\u0648\u0639 \u0628\u0627\u0632\u06CC"), 9, ["onClick", "disabled"])) : createCommentVNode("", true),
              createTextVNode(),
              createVNode(Transition, {
                "enter-active-class": "transition-all duration-500 ease-out",
                "enter-from-class": "opacity-0 scale-75 translate-y-4",
                "enter-to-class": "opacity-100 scale-100 translate-y-0",
                "leave-active-class": "transition-all duration-300 ease-in",
                "leave-from-class": "opacity-100 scale-100",
                "leave-to-class": "opacity-0 scale-95"
              }, {
                default: withCtx(() => [
                  _ctx.result ? (openBlock(), createBlock("div", {
                    key: 0,
                    class: "absolute inset-0 flex flex-col items-center justify-center text-center overflow-hidden bg-white"
                  }, [
                    createVNode("div", { class: "relative z-10 px-6 py-6 w-full h-full flex flex-col justify-center" }, [
                      createVNode("div", { class: "text-6xl mb-4" }, [
                        createVNode("i", {
                          class: _ctx.result.includes("\u0628\u0631\u0646\u062F\u0647 \u0646\u0634\u062F\u06CC\u062F") || _ctx.result === "\u067E\u0648\u0686" ? "ti ti-mood-sad text-red-500" : "ti ti-trophy text-yellow-500 drop-shadow-lg"
                        }, null, 2)
                      ]),
                      createTextVNode(),
                      !_ctx.result.includes("\u0628\u0631\u0646\u062F\u0647 \u0646\u0634\u062F\u06CC\u062F") && _ctx.result !== "\u067E\u0648\u0686" ? (openBlock(), createBlock("div", {
                        key: 0,
                        class: "mb-4"
                      }, [
                        createVNode("div", { class: "text-2xl font-black mb-2 bg-gradient-to-r from-yellow-600 via-orange-500 to-red-500 bg-clip-text text-transparent" }, "\r\n                      \u{1F389} \u062A\u0628\u0631\u06CC\u06A9 \u0645\u06CC\u06AF\u0645! \u{1F389}\r\n                    "),
                        createTextVNode(),
                        createVNode("div", { class: "text-base text-gray-700 font-bold" }, "\r\n                   \u0634\u0645\u0627 \u0628\u0631\u0646\u062F\u0647 \u062E\u0648\u0634 \u0634\u0627\u0646\u0633 \u0645\u0627 \u0647\u0633\u062A\u06CC\u062F!\r\n                    ")
                      ])) : (openBlock(), createBlock("div", {
                        key: 1,
                        class: "text-xl font-bold mb-3 text-red-600"
                      }, "\r\n                    \u0645\u062A\u0627\u0633\u0641\u0627\u0646\u0647! \u{1F614}\r\n                  ")),
                      createTextVNode(),
                      createVNode("div", { class: "mb-6" }, [
                        !_ctx.result.includes("\u0628\u0631\u0646\u062F\u0647 \u0646\u0634\u062F\u06CC\u062F") && _ctx.result !== "\u067E\u0648\u0686" ? (openBlock(), createBlock("div", {
                          key: 0,
                          class: "border-yellow-300"
                        }, [
                          _ctx.prize ? (openBlock(), createBlock("div", {
                            key: 0,
                            class: "bg-gradient-to-r from-yellow-500 to-orange-500 text-white rounded-xl p-4 mb-3 shadow-lg"
                          }, [
                            createVNode("div", { class: "text-xs font-medium mb-2 opacity-90 flex items-center justify-center gap-1" }, [
                              createVNode("i", { class: "ti ti-trophy text-sm" }),
                              createTextVNode("\r\n                          \u062C\u0627\u06CC\u0632\u0647 \u0634\u0645\u0627\r\n                        ")
                            ]),
                            createTextVNode(),
                            createVNode("div", { class: "text-lg font-mono font-bold tracking-wider bg-white/20 rounded-lg px-3 py-2 text-center select-all" }, toDisplayString(_ctx.prize), 1)
                          ])) : createCommentVNode("", true)
                        ])) : (openBlock(), createBlock("div", {
                          key: 1,
                          class: "text-lg font-bold text-gray-800 bg-gray-100 rounded-xl p-3"
                        }, toDisplayString(_ctx.result), 1))
                      ])
                    ])
                  ])) : createCommentVNode("", true)
                ]),
                _: 1
              })
            ]))
          ], 2)
        ];
      }
    }),
    _: 1
  }, _parent));
  _push(`</div>`);
}
const _sfc_setup$b = _sfc_main$b.setup;
_sfc_main$b.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/UserDashboard/main/EditCard/Preview/items/luckywheel.vue");
  return _sfc_setup$b ? _sfc_setup$b(props, ctx) : void 0;
};
const luckywheel = /* @__PURE__ */ _export_sfc(_sfc_main$b, [["ssrRender", _sfc_ssrRender], ["__scopeId", "data-v-7d2183e8"]]);
const _sfc_main$a = {
  __name: "EggIcon",
  __ssrInlineRender: true,
  props: {
    variant: {
      type: String,
      default: "normal",
      validator: (value) => ["normal", "cracked", "final"].includes(value)
    },
    size: {
      type: [String, Number],
      default: 150
    },
    iconColor: {
      type: String,
      default: "#8b5cf6"
    },
    crackColor: {
      type: String,
      default: "#4a4a4a"
    },
    shake: {
      type: Boolean,
      default: false
    }
  },
  setup(__props) {
    const props = __props;
    const uniqueId = ref("");
    const isShaking = computed(() => props.shake);
    const viewBoxStr = computed(() => {
      switch (props.variant) {
        case "normal":
          return "20 0 120 125";
        case "cracked":
          return "20 0 120 125";
        case "final":
          return "20 0 125 125";
        default:
          return "20 0 120 125";
      }
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({
        class: ["egg-container", { "animate-shake": isShaking.value }]
      }, _attrs))} data-v-69db0179><svg${ssrRenderAttrs(mergeProps({ viewBox: viewBoxStr.value }, _ctx.$attrs, { class: "egg-svg" }))} data-v-69db0179><g style="${ssrRenderStyle(props.variant === "normal" ? null : { display: "none" })}" class="egg-variant egg-normal" data-v-69db0179><defs data-v-69db0179><clipPath${ssrRenderAttr("id", `egg-clip-normal-${uniqueId.value}`)} data-v-69db0179><path d="M26.5,70c0,30.2,22.9,54.6,51.1,54.6s51.1-24.4,51.1-54.6S105.9,0,77.7,0,26.5,39.8,26.5,70Z" fill="none" data-v-69db0179></path></clipPath> <radialGradient${ssrRenderAttr("id", `egg-bg-normal-${uniqueId.value}`)} cx="108.2" cy="27.9" r="100.1" gradientUnits="userSpaceOnUse" data-v-69db0179><stop offset="0" stop-color="#fff" data-v-69db0179></stop> <stop offset=".2" stop-color="#f6f6f7" data-v-69db0179></stop> <stop offset=".6" stop-color="#e1dfe2" data-v-69db0179></stop> <stop offset="1" stop-color="#c2bfc5" data-v-69db0179></stop></radialGradient></defs> <g opacity=".6" data-v-69db0179><rect width="156" height="92" x="0" y="81.3" fill="#e0e0e0" opacity="0.3" data-v-69db0179></rect></g> <g${ssrRenderAttr("clip-path", `url(#egg-clip-normal-${uniqueId.value})`)} data-v-69db0179><g data-v-69db0179><path d="M26.5,70c0,30.2,22.9,54.6,51.1,54.6s51.1-24.4,51.1-54.6S105.9,0,77.7,0,26.5,39.8,26.5,70Z"${ssrRenderAttr("fill", `url(#egg-bg-normal-${uniqueId.value})`)} data-v-69db0179></path> <path d="M96.1,5.3s3.6,4.7-11.3-.7c0,0-5.1-1.4-10.7,.1,0,0-16.8,5.5-13.8-.3l-3.5,2.2s-1.9,5.3,10.2,2.2c0,0,6-2.5,12.2-2.6s12.8,2.5,12.8,2.5c0,0,14.5,3.8,4.1-3.6Z"${ssrRenderAttr("fill", __props.iconColor)} data-v-69db0179></path> <path d="M34.6,33.8s-2,12.1,33.9,.2c0,0,13.3-2.4,22.9,.9,0,0,26.5,10.3,28.7-.9l2.1,4s1.1,8.8-18.8,4.7c0,0-22-11.4-52.9,.2,0,0-17.6,4-18.1-4.7l2.1-4.4Z"${ssrRenderAttr("fill", __props.iconColor)} data-v-69db0179></path> <path d="M25.5,71.1s1.5,9.4,29.6,.9c0,0,17.2-5.2,38.7,.4,21.5,5.5,28.6,2.2,28.6,2.2,0,0,3.3-.9,6.6-4.7v4.7s-10.4,9.9-34.1,2.5-43,0-43,0c0,0-23.1,7.6-26.4-1.8v-4Z"${ssrRenderAttr("fill", __props.iconColor)} data-v-69db0179></path> <path d="M33.8,101.1s5,5,24.1-1.4c0,0,12.6-3.1,27.9,.3c0,0,26.8,7.6,36.6-1.1,9.8-8.7-.4,0-.4,0l-1.3,3.2s-15.4,8.2-35.6,.8c0,0-16.5-2.7-29.6,.8s-20.3,.5-20.3,.5l-1.4-3.2Z"${ssrRenderAttr("fill", __props.iconColor)} data-v-69db0179></path> <path d="M56.4,121.7s5.9,3,7.9,1.1,16.9-.4,16.9-.4c0,0,10.4,2.7,20.6-1.4,0,0-17.2,1.3-20.5,0s-12.6-.8-15.7-.3-1.1,.2-1.7,.4c-1.5,.5-5.2,1.4-7.6-.2v.9Z"${ssrRenderAttr("fill", __props.iconColor)} data-v-69db0179></path> <path d="M26.5,70c0,30.2,22.9,54.6,51.1,54.6s51.1-24.4,51.1-54.6S105.9,0,77.7,0,26.5,39.8,26.5,70Z" fill="none" data-v-69db0179></path></g></g></g> <g style="${ssrRenderStyle(props.variant === "cracked" ? null : { display: "none" })}" class="egg-variant egg-cracked" data-v-69db0179><defs data-v-69db0179><clipPath${ssrRenderAttr("id", `egg-clip-cracked-${uniqueId.value}`)} data-v-69db0179><path d="M27.4,70c0,30.2,22.9,54.6,51.1,54.6s51.1-24.4,51.1-54.6S106.8,0,78.6,0,27.4,39.8,27.4,70Z" fill="none" data-v-69db0179></path></clipPath> <radialGradient${ssrRenderAttr("id", `egg-bg-cracked-${uniqueId.value}`)} cx="109.1" cy="27.9" r="100.1" gradientUnits="userSpaceOnUse" data-v-69db0179><stop offset="0" stop-color="#fff" data-v-69db0179></stop> <stop offset=".2" stop-color="#f6f6f7" data-v-69db0179></stop> <stop offset=".6" stop-color="#e1dfe2" data-v-69db0179></stop> <stop offset="1" stop-color="#c2bfc5" data-v-69db0179></stop></radialGradient></defs> <g opacity=".6" data-v-69db0179><rect width="156" height="92" x="0" y="78.3" fill="#e0e0e0" opacity="0.3" data-v-69db0179></rect></g> <g${ssrRenderAttr("clip-path", `url(#egg-clip-cracked-${uniqueId.value})`)} data-v-69db0179><g data-v-69db0179><g data-v-69db0179><path d="M27.4,70c0,30.2,22.9,54.6,51.1,54.6s51.1-24.4,51.1-54.6S106.8,0,78.6,0,27.4,39.8,27.4,70Z"${ssrRenderAttr("fill", `url(#egg-bg-cracked-${uniqueId.value})`)} data-v-69db0179></path> <path d="M96.9,5.3s3.6,4.7-11.3-.7c0,0-5.1-1.4-10.7,.1,0,0-16.8,5.5-13.8-.3l-3.5,2.2s-1.9,5.3,10.2,2.2c0,0,6-2.5,12.2-2.6s12.8,2.5,12.8,2.5c0,0,14.5,3.8,4.1-3.6Z"${ssrRenderAttr("fill", __props.iconColor)} data-v-69db0179></path> <path d="M35.5,33.8s-2,12.1,33.9,.2c0,0,13.3-2.4,22.9,.9,0,0,26.5,10.3,28.7-.9l2.1,4s1.1,8.8-18.8,4.7c0,0-22-11.4-52.9,.2,0,0-17.6,4-18.1-4.7l2.1-4.4Z"${ssrRenderAttr("fill", __props.iconColor)} data-v-69db0179></path> <path d="M26.3,71.1s1.5,9.4,29.6,.9c0,0,17.2-5.2,38.7,.4,21.5,5.5,28.6,2.2,28.6,2.2,0,0,3.3-.9,6.6-4.7v4.7s-10.4,9.9-34.1,2.5c-23.7-7.4-43,0-43,0c0,0-23.1,7.6-26.4-1.8v-4Z"${ssrRenderAttr("fill", __props.iconColor)} data-v-69db0179></path> <path d="M34.7,101.1s5,5,24.1-1.4c0,0,12.6-3.1,27.9,.3c0,0,26.8,7.6,36.6-1.1,9.8-8.7-.4,0-.4,0l-1.3,3.2s-15.4,8.2-35.6,.8c0,0-16.5-2.7-29.6,.8s-20.3,.5-20.3,.5l-1.4-3.2Z"${ssrRenderAttr("fill", __props.iconColor)} data-v-69db0179></path> <path d="M57.3,121.7s5.9,3,7.9,1.1,16.9-.4,16.9-.4c0,0,10.4,2.7,20.6-1.4,0,0-17.2,1.3-20.5,0s-12.6-.8-15.7-.3-1.1,.2-1.7,.4c-1.5,.5-5.2,1.4-7.6-.2v.9Z"${ssrRenderAttr("fill", __props.iconColor)} data-v-69db0179></path> <path d="M27.4,70c0,30.2,22.9,54.6,51.1,54.6s51.1-24.4,51.1-54.6S106.8,0,78.6,0,27.4,39.8,27.4,70Z" fill="none" data-v-69db0179></path></g> <path d="M27.4,70c0,30.2,22.9,54.6,51.1,54.6s51.1-24.4,51.1-54.6S106.8,0,78.6,0,27.4,39.8,27.4,70Z" fill="none" data-v-69db0179></path> <polygon points="102.1 9.3 104.3 11.1 100 25.5 102.5 46.1 98.2 59.5 99.6 71.2 98.2 75.2 98.9 71 97.4 58.9 101 46.4 99.3 24.7 102.1 9.3"${ssrRenderAttr("fill", __props.crackColor)} data-v-69db0179></polygon> <polygon points="26.9 58 38 56.9 52 65.2 60.7 63.1 52.2 66.8 38.8 58.7 26.7 61.1 26.9 58"${ssrRenderAttr("fill", __props.crackColor)} data-v-69db0179></polygon></g></g></g> <g style="${ssrRenderStyle(props.variant === "final" ? null : { display: "none" })}" class="egg-variant egg-final" data-v-69db0179><defs data-v-69db0179><clipPath${ssrRenderAttr("id", `egg-clip-final-${uniqueId.value}`)} data-v-69db0179><path d="M27.9,70c0,30.2,22.9,54.6,51.1,54.6s51.1-24.4,51.1-54.6S107.3,0,79.1,0,27.9,39.8,27.9,70Z" fill="none" data-v-69db0179></path></clipPath> <radialGradient${ssrRenderAttr("id", `egg-bg-final-${uniqueId.value}`)} cx="109.7" cy="28.1" r="100.1" gradientUnits="userSpaceOnUse" data-v-69db0179><stop offset="0" stop-color="#fff" data-v-69db0179></stop> <stop offset=".2" stop-color="#f6f6f7" data-v-69db0179></stop> <stop offset=".6" stop-color="#e1dfe2" data-v-69db0179></stop> <stop offset="1" stop-color="#c2bfc5" data-v-69db0179></stop></radialGradient></defs> <g opacity=".6" data-v-69db0179><rect width="156" height="91" x="0" y="77.7" fill="#e0e0e0" opacity="0.3" data-v-69db0179></rect></g> <g${ssrRenderAttr("clip-path", `url(#egg-clip-final-${uniqueId.value})`)} data-v-69db0179><g opacity=".6" data-v-69db0179><rect width="156" height="92" x="1" y="78.7" fill="#e0e0e0" opacity="0.3" data-v-69db0179></rect></g> <path d="M28.1,70.2c0,30.2,22.9,54.6,51.1,54.6s51.1-24.4,51.1-54.6S107.4,.2,79.2,.2,28.1,40,28.1,70.2Z"${ssrRenderAttr("fill", `url(#egg-bg-final-${uniqueId.value})`)} data-v-69db0179></path> <path d="M97.6,5.5s3.6,4.7-11.3-.7c0,0-5.1-1.4-10.7,.1,0,0-16.8,5.5-13.8-.3l-3.5,2.2s-1.9,5.3,10.2,2.2c0,0,6-2.5,12.2-2.6s12.8,2.5,12.8,2.5c0,0,14.5,3.8,4.1-3.6Z"${ssrRenderAttr("fill", __props.iconColor)} data-v-69db0179></path> <path d="M36.1,34s-2,12.1,33.9,.2c0,0,13.3-2.4,22.9,.9,0,0,26.5,10.3,28.7-.9l2.1,4s1.1,8.8-18.8,4.7c0,0-22-11.4-52.9,.2,0,0-17.6,4-18.1-4.7l2.1-4.4Z"${ssrRenderAttr("fill", __props.iconColor)} data-v-69db0179></path> <path d="M27,71.3s1.5,9.4,29.6,.9c0,0,17.2-5.2,38.7,.4,21.5,5.5,28.6,2.2,28.6,2.2,0,0,3.3-.9,6.6-4.7v4.7s-10.4,9.9-34.1,2.5c-23.7-7.4-43,0-43,0c0,0-23.1,7.6-26.4-1.8v-4Z"${ssrRenderAttr("fill", __props.iconColor)} data-v-69db0179></path> <path d="M35.3,101.3s5,5,24.1-1.4c0,0,12.6-3.1,27.9,.3c0,0,26.8,7.6,36.6-1.1,9.8-8.7-.4,0-.4,0l-1.3,3.2s-15.4,8.2-35.6,.8c0,0-16.5-2.7-29.6,.8-13.1,3.5-20.3,.5-20.3,.5l-1.4-3.2Z"${ssrRenderAttr("fill", __props.iconColor)} data-v-69db0179></path> <path d="M57.9,121.9s5.9,3,7.9,1.1,16.9-.4,16.9-.4c0,0,10.4,2.7,20.6-1.4,0,0-17.2,1.3-20.5,0s-12.6-.8-15.7-.3-1.1,.2-1.7,.4c-1.5,.5-5.2,1.4-7.6-.2v.9Z"${ssrRenderAttr("fill", __props.iconColor)} data-v-69db0179></path> <path d="M28.1,70.2c0,30.2,22.9,54.6,51.1,54.6s51.1-24.4,51.1-54.6S107.4,.2,79.2,.2,28.1,40,28.1,70.2Z" fill="none" data-v-69db0179></path> <path d="M28.1,70.2c0,30.2,22.9,54.6,51.1,54.6s51.1-24.4,51.1-54.6S107.4,.2,79.2,.2,28.1,40,28.1,70.2Z" fill="none" data-v-69db0179></path> <polygon points="103 9.5 105.6 11.7 100.5 28.8 103.4 53.4 98.3 69.5 99.9 83.5 98.3 88.3 99.1 83.2 97.3 68.8 101.6 53.9 99.6 27.9 103 9.5"${ssrRenderAttr("fill", __props.crackColor)} data-v-69db0179></polygon> <polygon points="27.5 57.6 39.8 56.3 55.2 65.4 64.9 63.1 55.5 67.2 40.7 58.4 27.3 61 27.5 57.6"${ssrRenderAttr("fill", __props.crackColor)} data-v-69db0179></polygon> <path d="M28.1,70.2c0,30.2,22.9,54.6,51.1,54.6s51.1-24.4,51.1-54.6S107.4,.2,79.2,.2,28.1,40,28.1,70.2Z" fill="none" data-v-69db0179></path> <polygon points="55.5 8.8 60.9 14.7 61.8 24.6 70.8 30.7 73.7 39.2 69.2 32.2 59.8 25 58.9 16.6 53.2 9.9 55.5 8.8"${ssrRenderAttr("fill", __props.crackColor)} data-v-69db0179></polygon> <polygon points="28.3 96.1 33.8 93.5 40.5 96 46.1 92.2 52.7 92.1 63.4 86.5 70.9 86.4 76.3 82.4 71.5 87.2 64 87.2 53.5 93 46.6 93.1 41.1 97.1 34.1 94.8 28 97.5 27.6 96.3 28.3 96.1"${ssrRenderAttr("fill", __props.crackColor)} data-v-69db0179></polygon> <polygon points="60 123.5 69.2 121.5 72.4 117.9 80.4 114.8 83.4 112.1 81 115.7 73.1 118.7 69.6 122.7 60.4 124.4 60 123.5"${ssrRenderAttr("fill", __props.crackColor)} data-v-69db0179></polygon> <polygon points="114.1 112.6 108.9 109.8 108.6 106.5 105.5 105.1 105 103 99.6 101.4 105.5 101.9 106.8 104.4 109.4 105.7 110.1 108.5 113.9 110.9 114.1 112.6"${ssrRenderAttr("fill", __props.crackColor)} data-v-69db0179></polygon></g></g></svg></div>`);
    };
  }
};
const _sfc_setup$a = _sfc_main$a.setup;
_sfc_main$a.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/ui/EggIcon.vue");
  return _sfc_setup$a ? _sfc_setup$a(props, ctx) : void 0;
};
const EggIcon = /* @__PURE__ */ _export_sfc(_sfc_main$a, [["__scopeId", "data-v-69db0179"]]);
const _sfc_main$9 = {
  __name: "luckyegg",
  __ssrInlineRender: true,
  props: {
    link: {
      type: Object,
      default: () => ({})
    },
    isListMode: {
      type: Boolean,
      default: false
    },
    isDarkTheme: {
      type: Boolean,
      default: false
    },
    isLightTheme: {
      type: Boolean,
      default: false
    },
    isBackgroundDark: {
      type: Boolean,
      default: false
    }
  },
  emits: "message",
  setup(__props, { emit: __emit }) {
    const { sendOtpCode, verifyOtpCode } = useOtpService();
    const { getIconComponent } = useIconComponents();
    const emit = __emit;
    const props = __props;
    const link = props.link || {};
    const formStore = useFormStore();
    const formData = computed(() => formStore);
    const iconData = computed(() => {
      var _a;
      return ((_a = props.link) == null ? void 0 : _a.icon) || null;
    });
    const iconColor = computed(() => {
      var _a;
      if (((_a = formStore.iconColor) == null ? void 0 : _a.background) && formStore.iconColor.background !== "transparent") {
        return formStore.iconColor.background;
      }
      return void 0;
    });
    const isIconFilled = computed(() => {
      var _a;
      return !!(((_a = formStore.iconColor) == null ? void 0 : _a.background) && formStore.iconColor.background !== "transparent");
    });
    const iconComponent = computed(() => {
      if (!iconData.value) return null;
      return getIconComponent(iconData.value);
    });
    const eggVariant = computed(() => {
      const variant = eggClickCount.value === 0 ? "normal" : eggClickCount.value === 1 ? "cracked" : "final";
      return variant;
    });
    const showGame = ref(false);
    const isShaking = ref(false);
    const eggClickCount = ref(0);
    const result = ref("");
    const prize = ref("");
    const phoneNumber = ref("");
    const hasPlayed = ref(false);
    const authStep = ref("none");
    const codeInputs = ref(["", "", "", ""]);
    const countdown = ref(0);
    const playSound = (soundPath) => {
      try {
        const audio = new Audio(soundPath);
        audio.volume = 0.5;
        audio.play().catch(() => {
        });
      } catch (error) {
      }
    };
    const tryLuck = async () => {
      const canPlay = await checkForPlay(props.link.hash);
      if (!canPlay) {
        return;
      }
      if (isShaking.value || hasPlayed.value) return;
      if (eggClickCount.value < 1) {
        eggClickCount.value = 1;
        isShaking.value = true;
        playSound("/sounds/crack.mp3");
        setTimeout(() => {
          isShaking.value = false;
        }, 600);
        return;
      }
      eggClickCount.value = 2;
      isShaking.value = true;
      playSound("/sounds/crack.mp3");
      setTimeout(async () => {
        isShaking.value = false;
        hasPlayed.value = true;
        result.value = "true";
        await sendResultToBackend();
        if (prize.value) {
          confetti({ particleCount: 150, spread: 90, origin: { y: 0.6 } });
          playSound("/sounds/win.mp3");
        } else {
          result.value = "\u0645\u062A\u0627\u0633\u0641\u0627\u0646\u0647 \u0627\u06CC\u0646\u0628\u0627\u0631 \u0628\u0631\u0646\u062F\u0647 \u0646\u0634\u062F\u06CC!";
          playSound("/sounds/loss.mp3");
        }
      }, 600);
    };
    const startAuth = () => {
      var _a;
      if (((_a = props.link) == null ? void 0 : _a.phoneRequired) === false) {
        authStep.value = "authenticated";
        return;
      }
      if (hasPlayed.value) return;
      authStep.value = "phone";
    };
    const submitPhone = async () => {
      authStep.value = "code";
      await sendOtpCode(phoneNumber.value);
      startCountdown();
    };
    const submitCode = async () => {
      const fullCode = codeInputs.value.join("");
      const response = await verifyOtpCode(phoneNumber.value, fullCode);
      if (response) {
        authStep.value = "authenticated";
      } else {
        alert("\u06A9\u062F \u0627\u0634\u062A\u0628\u0627\u0647\u0647 \u06CC\u0627 \u0645\u0646\u0642\u0636\u06CC \u0634\u062F\u0647!");
      }
    };
    const startCountdown = () => {
      countdown.value = 120;
      setInterval();
    };
    const cancelAuth = () => {
      authStep.value = "none";
      codeInputs.value = ["", "", "", ""];
      countdown.value = 0;
    };
    const handleEggClick = () => {
      if (hasPlayed.value) return;
      if (authStep.value !== "authenticated") {
        startAuth();
        return;
      }
      tryLuck();
    };
    const { $axios } = useNuxtApp();
    const sendResultToBackend = async () => {
      var _a, _b, _c, _d;
      try {
        const payload = {
          phone: phoneNumber.value,
          result: result.value
          // عددی مثل "1" تا "6" یا "متاسفانه اینبار برنده نشدی!"
        };
        const response = await $axios.post(`club/${(_a = props.link) == null ? void 0 : _a.hash}/luckyEgg/result`, payload);
        if ((_d = (_c = (_b = response.data) == null ? void 0 : _b.data) == null ? void 0 : _c.reward) == null ? void 0 : _d.value) {
          prize.value = response.data.data.reward.value;
        }
        result.value = response.data.data.result.result;
      } catch (error) {
      }
    };
    const checkForPlay = async () => {
      var _a, _b;
      try {
        const response = await $axios.get(`club/${(_a = props.link) == null ? void 0 : _a.hash}/luckyEgg/check`);
        emit("message", response.data.message || "");
        return response.status === 200;
      } catch (error) {
        if (((_b = error.response) == null ? void 0 : _b.status) === 403) {
          emit("message", error.response.data.message || "");
          return false;
        }
        emit("message", "\u062E\u0637\u0627 \u062F\u0631 \u0628\u0631\u0631\u0633\u06CC \u0648\u0636\u0639\u06CC\u062A \u0628\u0627\u0632\u06CC:");
        return false;
      }
    };
    return (_ctx, _push, _parent, _attrs) => {
      var _a, _b, _c, _d;
      _push(`<div${ssrRenderAttrs(mergeProps({
        class: __props.isListMode ? "w-full" : ""
      }, _attrs))}>`);
      if (!showGame.value) {
        _push(`<a class="${ssrRenderClass([
          __props.isListMode ? "flex items-center gap-4 backdrop-blur rounded-xl p-2 w-full cursor-pointer " + (((_a = formData.value) == null ? void 0 : _a.layout) === "left" ? "text-left" : "text-right") : "rounded-xl text-center p-2 flex flex-col items-center justify-center transition hover:shadow-md backdrop-blur cursor-pointer",
          __props.isDarkTheme ? "bg-white/[0.02]" : __props.isLightTheme ? "bg-black/[0.02]" : "bg-gradient-to-br from-white/60 via-white/30 to-white/10 border border-white/20"
        ])}" tabindex="0" role="button"><div class="${ssrRenderClass([
          __props.isListMode ? "flex-shrink-0 rounded-xl flex items-center overflow-hidden w-[54px] h-[54px]" : "w-[54px] h-[54px] rounded-xl flex items-center justify-center mb-2 overflow-hidden",
          __props.isDarkTheme || __props.isLightTheme ? "" : "bg-gray-100"
        ])}">`);
        ssrRenderVNode(_push, createVNode(resolveDynamicComponent(iconComponent.value), mergeProps({ size: 50 }, iconColor.value ? { color: iconColor.value, filled: isIconFilled.value } : {}), null), _parent);
        _push(`</div> <div class="${ssrRenderClass(__props.isListMode ? "flex flex-col justify-center flex-1 min-w-0 " + (((_b = formData.value) == null ? void 0 : _b.layout) === "left" ? "text-left" : "text-right") : "w-full text-center mt-0 flex-1 flex flex-col justify-center")}"><div class="${ssrRenderClass([
          __props.isListMode ? "font-bold text-[14px] leading-snug break-words " + (((_c = formData.value) == null ? void 0 : _c.layout) === "left" ? "text-left" : "text-right") : "font-bold text-[15px] leading-snug text-center break-words",
          __props.isDarkTheme ? "text-white" : "text-gray-800"
        ])}">${ssrInterpolate(unref(link).displayName || unref(link).title || unref(link).name || unref(link).value || unref(link).id || "\u062A\u062E\u0645\u200C\u0645\u0631\u063A \u0634\u0627\u0646\u0633")}</div> `);
        if (__props.isListMode && unref(link).description && unref(link).description.trim()) {
          _push(`<div class="${ssrRenderClass([
            "text-xs font-normal mt-1 leading-relaxed whitespace-pre-line break-words " + (((_d = formData.value) == null ? void 0 : _d.layout) === "left" ? "text-left" : "text-right"),
            __props.isDarkTheme ? "text-gray-300" : "text-gray-600"
          ])}">${ssrInterpolate(unref(link).description)}</div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div></a>`);
      } else {
        _push(`<!---->`);
      }
      _push(` `);
      _push(ssrRenderComponent(BaseModalGame, {
        modelValue: showGame.value,
        "onUpdate:modelValue": ($event) => showGame.value = $event
      }, {
        header: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="flex justify-between items-center p-4 border-b border-gray-100 bg-white"${_scopeId}><div class="flex items-center gap-3"${_scopeId}>`);
            ssrRenderVNode(_push2, createVNode(resolveDynamicComponent(iconComponent.value), mergeProps({ size: 50 }, iconColor.value ? { color: iconColor.value, filled: isIconFilled.value } : {}), null), _parent2, _scopeId);
            _push2(` <h3 class="text-lg font-semibold text-gray-800"${_scopeId}>${ssrInterpolate(unref(link).displayName || unref(link).title || unref(link).name || unref(link).value || unref(link).id || "\u062A\u062E\u0645\u200C\u0645\u0631\u063A \u0634\u0627\u0646\u0633")}</h3></div> <button class="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"${_scopeId}><i class="ti ti-x text-lg"${_scopeId}></i></button></div>`);
          } else {
            return [
              createVNode("div", { class: "flex justify-between items-center p-4 border-b border-gray-100 bg-white" }, [
                createVNode("div", { class: "flex items-center gap-3" }, [
                  (openBlock(), createBlock(resolveDynamicComponent(iconComponent.value), mergeProps({ size: 50 }, iconColor.value ? { color: iconColor.value, filled: isIconFilled.value } : {}), null, 16)),
                  createTextVNode(),
                  createVNode("h3", { class: "text-lg font-semibold text-gray-800" }, toDisplayString(unref(link).displayName || unref(link).title || unref(link).name || unref(link).value || unref(link).id || "\u062A\u062E\u0645\u200C\u0645\u0631\u063A \u0634\u0627\u0646\u0633"), 1)
                ]),
                createTextVNode(),
                createVNode("button", {
                  onClick: ($event) => showGame.value = false,
                  class: "w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
                }, [
                  createVNode("i", { class: "ti ti-x text-lg" })
                ], 8, ["onClick"])
              ])
            ];
          }
        }),
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          var _a2, _b2, _c2, _d2, _e, _f, _g, _h, _i, _j, _k, _l, _m, _n, _o, _p;
          if (_push2) {
            _push2(`<div class="flex-1 overflow-y-auto p-4 text-center"${_scopeId}><div class="flex flex-col items-center justify-center py-4 px-4 text-center"${_scopeId}>`);
            if (authStep.value === "phone" || authStep.value === "code") {
              _push2(ssrRenderComponent(AuthForm, {
                "game-icon": "\u{1F95A}",
                "game-title": "\u062A\u062E\u0645\u200C\u0645\u0631\u063A \u0634\u0627\u0646\u0633",
                "auth-step": authStep.value,
                "phone-number": phoneNumber.value,
                "onUpdate:phoneNumber": ($event) => phoneNumber.value = $event,
                "code-inputs": codeInputs.value,
                "onUpdate:codeInputs": ($event) => codeInputs.value = $event,
                countdown: countdown.value,
                onSubmitPhone: submitPhone,
                onSubmitCode: submitCode,
                onCancelAuth: cancelAuth
              }, null, _parent2, _scopeId));
            } else if (!result.value && authStep.value === "authenticated") {
              _push2(`<!--[--><div class="mb-4 relative w-40 h-52"${_scopeId}>`);
              _push2(ssrRenderComponent(EggIcon, {
                variant: eggVariant.value,
                "is-shaking": isShaking.value,
                class: "w-full h-full cursor-pointer transition-all duration-300",
                onClick: handleEggClick
              }, null, _parent2, _scopeId));
              _push2(`</div> <div class="${ssrRenderClass([((_a2 = formData.value) == null ? void 0 : _a2.layout) === "left" ? "text-left" : "text-right", "text-lg font-bold text-gray-800 mb-2"])}"${_scopeId}>${ssrInterpolate(unref(link).title || "\u062A\u062E\u0645\u200C\u0645\u0631\u063A \u0634\u0627\u0646\u0633")}</div> <div class="${ssrRenderClass([((_b2 = formData.value) == null ? void 0 : _b2.layout) === "left" ? "text-left" : "text-right", "text-sm text-gray-500 mb-4"])}"${_scopeId}>${ssrInterpolate(unref(link).description || "\u0631\u0648\u06CC \u062A\u062E\u0645\u200C\u0645\u0631\u063A \u0628\u0632\u0646 \u06CC\u0627 \u06AF\u0648\u0634\u06CC \u0631\u0627 \u062A\u06A9\u0627\u0646 \u0628\u062F\u0647 \u0648 \u0634\u0627\u0646\u0633 \u062E\u0648\u062F\u062A \u0631\u0627 \u0627\u0645\u062A\u062D\u0627\u0646 \u06A9\u0646!")}</div> <button class="bg-orange-500 text-white px-6 py-2 rounded-full font-bold shadow hover:bg-orange-600 transition"${ssrIncludeBooleanAttr(hasPlayed.value) ? " disabled" : ""}${_scopeId}>
                \u0627\u0645\u062A\u062D\u0627\u0646 \u0634\u0627\u0646\u0633!
              </button><!--]-->`);
            } else if (!result.value && authStep.value === "none") {
              _push2(`<!--[--><div class="mb-4 relative w-40 h-52"${_scopeId}>`);
              _push2(ssrRenderComponent(EggIcon, {
                variant: "normal",
                class: "w-full h-full opacity-50"
              }, null, _parent2, _scopeId));
              _push2(`</div> <div class="${ssrRenderClass([((_c2 = formData.value) == null ? void 0 : _c2.layout) === "left" ? "text-left" : "text-right", "text-lg font-bold text-gray-800 mb-2"])}"${_scopeId}>${ssrInterpolate(unref(link).title || "\u062A\u062E\u0645\u200C\u0645\u0631\u063A \u0634\u0627\u0646\u0633")}</div> <div class="${ssrRenderClass([((_d2 = formData.value) == null ? void 0 : _d2.layout) === "left" ? "text-left" : "text-right", "text-sm text-gray-500 mb-4"])}"${_scopeId}>${ssrInterpolate(unref(link).description || "\u0628\u0631\u0627\u06CC \u0634\u0631\u06A9\u062A \u062F\u0631 \u0628\u0627\u0632\u06CC\u060C \u0627\u0628\u062A\u062F\u0627 \u0627\u062D\u0631\u0627\u0632 \u0647\u0648\u06CC\u062A \u06A9\u0646\u06CC\u062F")}</div> <button class="bg-black text-white px-6 py-3 rounded-xl font-bold shadow hover:bg-gray-800 transition"${_scopeId}>
                \u0634\u0631\u0648\u0639 \u0628\u0627\u0632\u06CC
              </button><!--]-->`);
            } else {
              _push2(`<!---->`);
            }
            _push2(` `);
            if (result.value) {
              _push2(`<div class="mt-6 w-full flex flex-col items-center justify-center"${_scopeId}><div class="text-6xl mb-4"${_scopeId}><i class="${ssrRenderClass(result.value.includes("\u0628\u0631\u0646\u062F\u0647 \u0646\u0634\u062F\u06CC") ? "ti ti-mood-sad text-red-500" : "ti ti-trophy text-yellow-500 drop-shadow-lg")}"${_scopeId}></i></div> `);
              if (!result.value.includes("\u0628\u0631\u0646\u062F\u0647 \u0646\u0634\u062F\u06CC")) {
                _push2(`<div class="mb-4"${_scopeId}><div class="${ssrRenderClass([((_e = formData.value) == null ? void 0 : _e.layout) === "left" ? "text-left" : "text-right", "text-2xl font-black mb-2 bg-gradient-to-r from-yellow-600 via-orange-500 to-red-500 bg-clip-text text-transparent"])}"${_scopeId}>
              \u{1F389} \u062A\u0628\u0631\u06CC\u06A9 \u0645\u06CC\u06AF\u0645! \u{1F389}
            </div> <div class="${ssrRenderClass([((_f = formData.value) == null ? void 0 : _f.layout) === "left" ? "text-left" : "text-right", "text-base text-gray-700 font-bold"])}"${_scopeId}>
              \u0634\u0645\u0627 \u0628\u0631\u0646\u062F\u0647 \u062E\u0648\u0634 \u0634\u0627\u0646\u0633 \u0645\u0627 \u0647\u0633\u062A\u06CC\u062F!
            </div></div>`);
              } else {
                _push2(`<div class="${ssrRenderClass([((_g = formData.value) == null ? void 0 : _g.layout) === "left" ? "text-left" : "text-right", "text-xl font-bold mb-3 text-red-600"])}"${_scopeId}>
            \u0645\u062A\u0627\u0633\u0641\u0627\u0646\u0647! \u{1F614}
          </div>`);
              }
              _push2(` <div class="mb-6"${_scopeId}>`);
              if (!result.value.includes("\u0628\u0631\u0646\u062F\u0647 \u0646\u0634\u062F\u06CC") && prize.value) {
                _push2(`<div class="bg-gradient-to-r from-yellow-500 to-orange-500 text-white rounded-xl p-4 mb-3 shadow-lg"${_scopeId}><div class="text-xs font-medium mb-2 opacity-90 flex items-center justify-center gap-1"${_scopeId}><i class="ti ti-trophy text-sm"${_scopeId}></i>
                \u062C\u0627\u06CC\u0632\u0647 \u0634\u0645\u0627
              </div> <div class="text-lg font-mono font-bold tracking-wider bg-white/20 rounded-lg px-3 py-2 text-center select-all"${_scopeId}>${ssrInterpolate(prize.value)}</div></div>`);
              } else {
                _push2(`<div class="${ssrRenderClass([((_h = formData.value) == null ? void 0 : _h.layout) === "left" ? "text-left" : "text-right", "text-lg font-bold text-gray-800 bg-gray-100 rounded-xl p-3"])}"${_scopeId}>${ssrInterpolate(result.value)}</div>`);
              }
              _push2(`</div></div>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</div></div>`);
          } else {
            return [
              createVNode("div", { class: "flex-1 overflow-y-auto p-4 text-center" }, [
                createVNode("div", { class: "flex flex-col items-center justify-center py-4 px-4 text-center" }, [
                  authStep.value === "phone" || authStep.value === "code" ? (openBlock(), createBlock(AuthForm, {
                    key: 0,
                    "game-icon": "\u{1F95A}",
                    "game-title": "\u062A\u062E\u0645\u200C\u0645\u0631\u063A \u0634\u0627\u0646\u0633",
                    "auth-step": authStep.value,
                    "phone-number": phoneNumber.value,
                    "onUpdate:phoneNumber": ($event) => phoneNumber.value = $event,
                    "code-inputs": codeInputs.value,
                    "onUpdate:codeInputs": ($event) => codeInputs.value = $event,
                    countdown: countdown.value,
                    onSubmitPhone: submitPhone,
                    onSubmitCode: submitCode,
                    onCancelAuth: cancelAuth
                  }, null, 8, ["auth-step", "phone-number", "onUpdate:phoneNumber", "code-inputs", "onUpdate:codeInputs", "countdown"])) : !result.value && authStep.value === "authenticated" ? (openBlock(), createBlock(Fragment, { key: 1 }, [
                    createVNode("div", { class: "mb-4 relative w-40 h-52" }, [
                      createVNode(EggIcon, {
                        variant: eggVariant.value,
                        "is-shaking": isShaking.value,
                        class: "w-full h-full cursor-pointer transition-all duration-300",
                        onClick: handleEggClick
                      }, null, 8, ["variant", "is-shaking"])
                    ]),
                    createTextVNode(),
                    createVNode("div", {
                      class: ["text-lg font-bold text-gray-800 mb-2", ((_i = formData.value) == null ? void 0 : _i.layout) === "left" ? "text-left" : "text-right"]
                    }, toDisplayString(unref(link).title || "\u062A\u062E\u0645\u200C\u0645\u0631\u063A \u0634\u0627\u0646\u0633"), 3),
                    createTextVNode(),
                    createVNode("div", {
                      class: ["text-sm text-gray-500 mb-4", ((_j = formData.value) == null ? void 0 : _j.layout) === "left" ? "text-left" : "text-right"]
                    }, toDisplayString(unref(link).description || "\u0631\u0648\u06CC \u062A\u062E\u0645\u200C\u0645\u0631\u063A \u0628\u0632\u0646 \u06CC\u0627 \u06AF\u0648\u0634\u06CC \u0631\u0627 \u062A\u06A9\u0627\u0646 \u0628\u062F\u0647 \u0648 \u0634\u0627\u0646\u0633 \u062E\u0648\u062F\u062A \u0631\u0627 \u0627\u0645\u062A\u062D\u0627\u0646 \u06A9\u0646!"), 3),
                    createTextVNode(),
                    createVNode("button", {
                      class: "bg-orange-500 text-white px-6 py-2 rounded-full font-bold shadow hover:bg-orange-600 transition",
                      onClick: handleEggClick,
                      disabled: hasPlayed.value
                    }, "\r\n                \u0627\u0645\u062A\u062D\u0627\u0646 \u0634\u0627\u0646\u0633!\r\n              ", 8, ["disabled"])
                  ], 64)) : !result.value && authStep.value === "none" ? (openBlock(), createBlock(Fragment, { key: 2 }, [
                    createVNode("div", { class: "mb-4 relative w-40 h-52" }, [
                      createVNode(EggIcon, {
                        variant: "normal",
                        class: "w-full h-full opacity-50"
                      })
                    ]),
                    createTextVNode(),
                    createVNode("div", {
                      class: ["text-lg font-bold text-gray-800 mb-2", ((_k = formData.value) == null ? void 0 : _k.layout) === "left" ? "text-left" : "text-right"]
                    }, toDisplayString(unref(link).title || "\u062A\u062E\u0645\u200C\u0645\u0631\u063A \u0634\u0627\u0646\u0633"), 3),
                    createTextVNode(),
                    createVNode("div", {
                      class: ["text-sm text-gray-500 mb-4", ((_l = formData.value) == null ? void 0 : _l.layout) === "left" ? "text-left" : "text-right"]
                    }, toDisplayString(unref(link).description || "\u0628\u0631\u0627\u06CC \u0634\u0631\u06A9\u062A \u062F\u0631 \u0628\u0627\u0632\u06CC\u060C \u0627\u0628\u062A\u062F\u0627 \u0627\u062D\u0631\u0627\u0632 \u0647\u0648\u06CC\u062A \u06A9\u0646\u06CC\u062F"), 3),
                    createTextVNode(),
                    createVNode("button", {
                      class: "bg-black text-white px-6 py-3 rounded-xl font-bold shadow hover:bg-gray-800 transition",
                      onClick: startAuth
                    }, "\r\n                \u0634\u0631\u0648\u0639 \u0628\u0627\u0632\u06CC\r\n              ")
                  ], 64)) : createCommentVNode("", true),
                  createTextVNode(),
                  result.value ? (openBlock(), createBlock("div", {
                    key: 3,
                    class: "mt-6 w-full flex flex-col items-center justify-center"
                  }, [
                    createVNode("div", { class: "text-6xl mb-4" }, [
                      createVNode("i", {
                        class: result.value.includes("\u0628\u0631\u0646\u062F\u0647 \u0646\u0634\u062F\u06CC") ? "ti ti-mood-sad text-red-500" : "ti ti-trophy text-yellow-500 drop-shadow-lg"
                      }, null, 2)
                    ]),
                    createTextVNode(),
                    !result.value.includes("\u0628\u0631\u0646\u062F\u0647 \u0646\u0634\u062F\u06CC") ? (openBlock(), createBlock("div", {
                      key: 0,
                      class: "mb-4"
                    }, [
                      createVNode("div", {
                        class: ["text-2xl font-black mb-2 bg-gradient-to-r from-yellow-600 via-orange-500 to-red-500 bg-clip-text text-transparent", ((_m = formData.value) == null ? void 0 : _m.layout) === "left" ? "text-left" : "text-right"]
                      }, "\r\n              \u{1F389} \u062A\u0628\u0631\u06CC\u06A9 \u0645\u06CC\u06AF\u0645! \u{1F389}\r\n            ", 2),
                      createTextVNode(),
                      createVNode("div", {
                        class: ["text-base text-gray-700 font-bold", ((_n = formData.value) == null ? void 0 : _n.layout) === "left" ? "text-left" : "text-right"]
                      }, "\r\n              \u0634\u0645\u0627 \u0628\u0631\u0646\u062F\u0647 \u062E\u0648\u0634 \u0634\u0627\u0646\u0633 \u0645\u0627 \u0647\u0633\u062A\u06CC\u062F!\r\n            ", 2)
                    ])) : (openBlock(), createBlock("div", {
                      key: 1,
                      class: ["text-xl font-bold mb-3 text-red-600", ((_o = formData.value) == null ? void 0 : _o.layout) === "left" ? "text-left" : "text-right"]
                    }, "\r\n            \u0645\u062A\u0627\u0633\u0641\u0627\u0646\u0647! \u{1F614}\r\n          ", 2)),
                    createTextVNode(),
                    createVNode("div", { class: "mb-6" }, [
                      !result.value.includes("\u0628\u0631\u0646\u062F\u0647 \u0646\u0634\u062F\u06CC") && prize.value ? (openBlock(), createBlock("div", {
                        key: 0,
                        class: "bg-gradient-to-r from-yellow-500 to-orange-500 text-white rounded-xl p-4 mb-3 shadow-lg"
                      }, [
                        createVNode("div", { class: "text-xs font-medium mb-2 opacity-90 flex items-center justify-center gap-1" }, [
                          createVNode("i", { class: "ti ti-trophy text-sm" }),
                          createTextVNode("\r\n                \u062C\u0627\u06CC\u0632\u0647 \u0634\u0645\u0627\r\n              ")
                        ]),
                        createTextVNode(),
                        createVNode("div", { class: "text-lg font-mono font-bold tracking-wider bg-white/20 rounded-lg px-3 py-2 text-center select-all" }, toDisplayString(prize.value), 1)
                      ])) : (openBlock(), createBlock("div", {
                        key: 1,
                        class: ["text-lg font-bold text-gray-800 bg-gray-100 rounded-xl p-3", ((_p = formData.value) == null ? void 0 : _p.layout) === "left" ? "text-left" : "text-right"]
                      }, toDisplayString(result.value), 3))
                    ])
                  ])) : createCommentVNode("", true)
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/UserDashboard/main/EditCard/Preview/items/luckyegg.vue");
  return _sfc_setup$9 ? _sfc_setup$9(props, ctx) : void 0;
};
const _sfc_main$8 = /* @__PURE__ */ defineComponent({
  __name: "bankcard",
  __ssrInlineRender: true,
  props: {
    link: { type: [Object, Array], required: true },
    isListMode: { type: Boolean, default: false },
    formData: { type: Object, required: false },
    isDarkTheme: { type: Boolean, default: false },
    isLightTheme: { type: Boolean, default: false },
    isBackgroundDark: { type: Boolean, default: false }
  },
  setup(__props) {
    const { getIconComponent } = useIconComponents();
    const props = __props;
    const formStore = useFormStore();
    const formData = computed(() => props.formData || formStore);
    const showBankCards = ref(false);
    const isListMode = computed(() => {
      const link = props.link;
      if ((link == null ? void 0 : link.isListMode) !== void 0) {
        return link.isListMode;
      }
      if (props.isListMode !== void 0) {
        return props.isListMode;
      }
      return true;
    });
    const sanitizedLink = computed(() => {
      const link = props.link;
      if (Array.isArray(link) && link.length > 0) {
        return link[0] || {};
      }
      return link || {};
    });
    const iconData = computed(() => {
      var _a;
      return ((_a = sanitizedLink.value) == null ? void 0 : _a.icon) || null;
    });
    const iconColor = computed(() => {
      var _a;
      if (((_a = formStore.iconColor) == null ? void 0 : _a.background) && formStore.iconColor.background !== "transparent") {
        return formStore.iconColor.background;
      }
      return void 0;
    });
    const isIconFilled = computed(() => {
      var _a;
      return !!(((_a = formStore.iconColor) == null ? void 0 : _a.background) && formStore.iconColor.background !== "transparent");
    });
    computed(() => {
      var _a, _b, _c, _d;
      if (((_a = formStore.iconColor) == null ? void 0 : _a.background) === "#000000" || ((_b = formStore.iconColor) == null ? void 0 : _b.background) === "black") {
        return "bg-black/5";
      }
      if (((_c = formStore.iconColor) == null ? void 0 : _c.background) === "#ffffff" || ((_d = formStore.iconColor) == null ? void 0 : _d.background) === "white") {
        return "bg-gray-100/30";
      }
      return "bg-white";
    });
    const iconComponent = computed(() => {
      return getIconComponent(iconData.value);
    });
    const cards = computed(() => {
      const link = props.link;
      if (Array.isArray(link) && link.length) return link;
      if (link && typeof link === "object") {
        if (Array.isArray(link.cards) && link.cards.length) return link.cards;
        if (link.cardNumber) return [link];
        if (link.type === "block" && link.action === "bankcard") return [link];
        if (link.cards && typeof link.cards === "object" && !Array.isArray(link.cards)) return [link.cards];
      }
      return [];
    });
    const dynamicTitle = computed(() => {
      var _a;
      const link = props.link;
      if (link == null ? void 0 : link.title) return link.title;
      if (cards.value.length > 0 && ((_a = cards.value[0]) == null ? void 0 : _a.title)) return cards.value[0].title;
      return "\u0645\u0634\u0627\u0647\u062F\u0647 \u06A9\u0627\u0631\u062A\u200C\u0647\u0627\u06CC \u0628\u0627\u0646\u06A9\u06CC";
    });
    const dynamicDescription = computed(() => {
      var _a;
      const link = props.link;
      if (link == null ? void 0 : link.description) return link.description;
      if (cards.value.length > 0 && ((_a = cards.value[0]) == null ? void 0 : _a.description)) return cards.value[0].description;
      return "\u0628\u0631\u0627\u06CC \u0645\u0634\u0627\u0647\u062F\u0647 \u0648 \u06A9\u067E\u06CC \u0627\u0637\u0644\u0627\u0639\u0627\u062A \u06A9\u0627\u0631\u062A\u200C\u0647\u0627 \u06A9\u0644\u06CC\u06A9 \u06A9\u0646\u06CC\u062F";
    });
    ref(cards.value.map(() => false));
    const openCards = ref(cards.value.map(() => false));
    const copiedMsg = ref(cards.value.map(() => ""));
    watch(cards, (val) => {
      while (openCards.value.length < val.length) openCards.value.push(false);
      while (openCards.value.length > val.length) openCards.value.pop();
      while (copiedMsg.value.length < val.length) copiedMsg.value.push("");
      while (copiedMsg.value.length > val.length) copiedMsg.value.pop();
    });
    function formatCardNumber(num) {
      return (num || "").replace(/\s+/g, "").replace(/(.{4})/g, "$1 ").trim();
    }
    function copyToClipboard(val, msg, idx) {
      if (!val) return;
      (void 0).clipboard.writeText(val.toString()).then(() => {
        copiedMsg.value[idx] = msg;
        setTimeout(() => copiedMsg.value[idx] = "", 2e3);
      });
    }
    function shareField(field, item, idx) {
      const labels = {
        cardNumber: "\u0634\u0645\u0627\u0631\u0647 \u06A9\u0627\u0631\u062A",
        ibanNumber: "\u0634\u0645\u0627\u0631\u0647 \u0634\u0628\u0627",
        accountNumber: "\u0634\u0645\u0627\u0631\u0647 \u062D\u0633\u0627\u0628"
      };
      const value = item[field];
      if (!value) return;
      const title = labels[field];
      const text = `${title}: ${value}`;
      if ((void 0).share) {
        const shareData = {
          title,
          text
        };
        (void 0).share(shareData).then(() => {
          copiedMsg.value[idx] = `${title} \u0628\u0627 \u0645\u0648\u0641\u0642\u06CC\u062A \u0627\u0634\u062A\u0631\u0627\u06A9 \u06AF\u0630\u0627\u0631\u06CC \u0634\u062F!`;
          setTimeout(() => copiedMsg.value[idx] = "", 3e3);
        }).catch((error) => {
          if (error.name !== "AbortError") {
            fallbackShare(text, idx, `${title} \u0627\u0634\u062A\u0631\u0627\u06A9 \u06AF\u0630\u0627\u0631\u06CC \u0646\u0634\u062F\u060C \u06A9\u067E\u06CC \u0634\u062F!`);
          }
        });
        return;
      }
      copiedMsg.value[idx] = "\u0645\u062A\u0627\u0633\u0641\u0627\u0646\u0647 \u062F\u0631 \u0645\u0631\u0648\u0631\u06AF\u0631 \u0634\u0645\u0627 \u067E\u0634\u062A\u06CC\u0628\u0627\u0646\u06CC \u0646\u0645\u06CC\u200C\u0634\u0648\u062F";
      setTimeout(() => copiedMsg.value[idx] = "", 3e3);
    }
    function fallbackShare(text, idx, message) {
      if ((void 0).clipboard && (void 0).clipboard.writeText) {
        (void 0).clipboard.writeText(text).then(() => {
          copiedMsg.value[idx] = message;
          setTimeout(() => copiedMsg.value[idx] = "", 2e3);
        }).catch((error) => {
        });
      } else {
        const textArea = (void 0).createElement("textarea");
        textArea.value = text;
        (void 0).body.appendChild(textArea);
        textArea.select();
        try {
          (void 0).execCommand("copy");
          copiedMsg.value[idx] = message;
          setTimeout(() => copiedMsg.value[idx] = "", 2e3);
        } catch (error) {
        }
        (void 0).body.removeChild(textArea);
      }
    }
    return (_ctx, _push, _parent, _attrs) => {
      var _a, _b, _c, _d;
      _push(`<div${ssrRenderAttrs(mergeProps({
        class: isListMode.value ? "w-full" : ""
      }, _attrs))} data-v-86637118><a class="${ssrRenderClass([
        isListMode.value ? "flex items-center gap-4 backdrop-blur rounded-xl p-2 w-full cursor-pointer " + (((_a = formData.value) == null ? void 0 : _a.layout) === "left" ? "text-left" : "text-right") : "rounded-xl text-center p-2 flex flex-col items-center justify-center transition hover:shadow-md backdrop-blur cursor-pointer",
        __props.isDarkTheme ? "bg-white/[0.02]" : __props.isLightTheme ? "bg-black/[0.02]" : "bg-gradient-to-br from-white/60 via-white/30 to-white/10 border border-white/20"
      ])}" tabindex="0" role="button" data-v-86637118><div class="${ssrRenderClass([
        isListMode.value ? "flex-shrink-0 rounded-xl flex items-center overflow-hidden w-[54px] h-[54px]" : "w-[54px] h-[54px] rounded-xl flex items-center justify-center mb-2 overflow-hidden",
        __props.isDarkTheme || __props.isLightTheme ? "" : "bg-gray-100"
      ])}" data-v-86637118>`);
      ssrRenderVNode(_push, createVNode(resolveDynamicComponent(iconComponent.value), mergeProps({ size: 50 }, iconColor.value ? { color: iconColor.value, filled: isIconFilled.value } : {}), null), _parent);
      _push(`</div> <div class="${ssrRenderClass(isListMode.value ? "flex flex-col justify-center flex-1 min-w-0 " + (((_b = formData.value) == null ? void 0 : _b.layout) === "left" ? "text-left" : "text-right") : "w-full text-center mt-0 flex-1 flex flex-col justify-center")}" data-v-86637118><div class="${ssrRenderClass([
        isListMode.value ? "font-bold text-[14px] leading-snug break-words " + (((_c = formData.value) == null ? void 0 : _c.layout) === "left" ? "text-left" : "text-right") : "font-bold text-[15px] leading-snug text-center break-words",
        __props.isDarkTheme ? "text-white" : "text-gray-800"
      ])}" data-v-86637118>${ssrInterpolate(dynamicTitle.value)}</div> `);
      if (isListMode.value && dynamicDescription.value && dynamicDescription.value.trim()) {
        _push(`<div class="${ssrRenderClass([
          "text-xs font-normal mt-1 leading-relaxed whitespace-pre-line break-words " + (((_d = formData.value) == null ? void 0 : _d.layout) === "left" ? "text-left" : "text-right"),
          __props.isDarkTheme ? "text-gray-300" : "text-gray-600"
        ])}" data-v-86637118>${ssrInterpolate(dynamicDescription.value)}</div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div></a> `);
      _push(ssrRenderComponent(BaseModal, {
        modelValue: showBankCards.value,
        "onUpdate:modelValue": ($event) => showBankCards.value = $event
      }, {
        header: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="flex justify-between items-center p-4 border-b border-gray-200" data-v-86637118${_scopeId}><h3 class="text-lg font-bold" data-v-86637118${_scopeId}>\u06A9\u0627\u0631\u062A\u200C\u0647\u0627\u06CC \u0628\u0627\u0646\u06A9\u06CC</h3> <button class="text-gray-500 hover:text-red-500 text-xl" data-v-86637118${_scopeId}>\xD7</button></div>`);
          } else {
            return [
              createVNode("div", { class: "flex justify-between items-center p-4 border-b border-gray-200" }, [
                createVNode("h3", { class: "text-lg font-bold" }, "\u06A9\u0627\u0631\u062A\u200C\u0647\u0627\u06CC \u0628\u0627\u0646\u06A9\u06CC"),
                createTextVNode(),
                createVNode("button", {
                  onClick: ($event) => showBankCards.value = false,
                  class: "text-gray-500 hover:text-red-500 text-xl"
                }, "\xD7", 8, ["onClick"])
              ])
            ];
          }
        }),
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="flex-1 overflow-y-auto text-right" data-v-86637118${_scopeId}><!--[-->`);
            ssrRenderList(cards.value, (item, idx) => {
              _push2(`<div class="border-b border-gray-200 mb-4 overflow-hidden" data-v-86637118${_scopeId}><div class="p-4 border-b border-gray-200" data-v-86637118${_scopeId}><div class="flex items-center gap-3" data-v-86637118${_scopeId}><div class="flex items-center justify-center flex-shrink-0 rounded-lg w-12 h-12 border border-gray-200" data-v-86637118${_scopeId}>`);
              ssrRenderVNode(_push2, createVNode(resolveDynamicComponent(iconComponent.value), mergeProps({ size: 24 }, { ref_for: true }, iconColor.value ? { color: iconColor.value, filled: isIconFilled.value } : {}), null), _parent2, _scopeId);
              _push2(`</div> <div class="flex-1" data-v-86637118${_scopeId}><h4 class="font-bold text-base text-gray-800 mb-1" data-v-86637118${_scopeId}>${ssrInterpolate(item.title || `\u06A9\u0627\u0631\u062A \u0628\u0627\u0646\u06A9\u06CC ${idx + 1}`)}</h4> `);
              if (item.description) {
                _push2(`<p class="text-sm text-gray-600 leading-relaxed" data-v-86637118${_scopeId}>${ssrInterpolate(item.description)}</p>`);
              } else {
                _push2(`<!---->`);
              }
              _push2(` `);
              if (item.bankName) {
                _push2(`<p class="text-sm text-blue-700 font-medium mt-1" data-v-86637118${_scopeId}>${ssrInterpolate(item.bankName)}</p>`);
              } else {
                _push2(`<!---->`);
              }
              _push2(`</div></div></div> <div class="p-4 space-y-4" data-v-86637118${_scopeId}>`);
              if (item.cardNumber) {
                _push2(`<div class="p-4 border border-gray-200" data-v-86637118${_scopeId}><div class="flex items-center justify-between mb-3" data-v-86637118${_scopeId}><span class="text-sm font-medium text-gray-700" data-v-86637118${_scopeId}>\u0634\u0645\u0627\u0631\u0647 \u06A9\u0627\u0631\u062A</span> <div class="flex gap-2" data-v-86637118${_scopeId}><button class="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors" title="\u06A9\u067E\u06CC \u0634\u0645\u0627\u0631\u0647 \u06A9\u0627\u0631\u062A" data-v-86637118${_scopeId}><i class="ti ti-copy text-lg" data-v-86637118${_scopeId}></i></button> <button class="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors" title="\u0627\u0634\u062A\u0631\u0627\u06A9 \u06AF\u0630\u0627\u0631\u06CC" data-v-86637118${_scopeId}><i class="ti ti-share text-lg" data-v-86637118${_scopeId}></i></button></div></div> <div class="flex items-center gap-2" data-v-86637118${_scopeId}><i class="ti ti-credit-card text-blue-600 text-lg" data-v-86637118${_scopeId}></i> <span class="text-lg font-mono font-bold text-gray-800 ltr tracking-wider" data-v-86637118${_scopeId}>${ssrInterpolate(formatCardNumber(item.cardNumber))}</span></div></div>`);
              } else {
                _push2(`<!---->`);
              }
              _push2(` `);
              if (item.accountNumber) {
                _push2(`<div class="p-4 border border-gray-200" data-v-86637118${_scopeId}><div class="flex items-center justify-between mb-3" data-v-86637118${_scopeId}><span class="text-sm font-medium text-gray-700" data-v-86637118${_scopeId}>\u0634\u0645\u0627\u0631\u0647 \u062D\u0633\u0627\u0628</span> <div class="flex gap-2" data-v-86637118${_scopeId}><button class="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors" title="\u06A9\u067E\u06CC \u0634\u0645\u0627\u0631\u0647 \u062D\u0633\u0627\u0628" data-v-86637118${_scopeId}><i class="ti ti-copy text-lg" data-v-86637118${_scopeId}></i></button> <button class="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors" title="\u0627\u0634\u062A\u0631\u0627\u06A9 \u06AF\u0630\u0627\u0631\u06CC" data-v-86637118${_scopeId}><i class="ti ti-share text-lg" data-v-86637118${_scopeId}></i></button></div></div> <div class="flex items-center gap-2" data-v-86637118${_scopeId}><i class="ti ti-building-bank text-blue-600" data-v-86637118${_scopeId}></i> <span class="text-base font-mono text-gray-800 ltr select-text" data-v-86637118${_scopeId}>${ssrInterpolate(item.accountNumber)}</span></div></div>`);
              } else {
                _push2(`<!---->`);
              }
              _push2(` `);
              if (item.ibanNumber) {
                _push2(`<div class="p-4 border border-gray-200" data-v-86637118${_scopeId}><div class="flex items-center justify-between mb-3" data-v-86637118${_scopeId}><span class="text-sm font-medium text-gray-700" data-v-86637118${_scopeId}>\u0634\u0645\u0627\u0631\u0647 \u0634\u0628\u0627</span> <div class="flex gap-2" data-v-86637118${_scopeId}><button class="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors" title="\u06A9\u067E\u06CC \u0634\u0645\u0627\u0631\u0647 \u0634\u0628\u0627" data-v-86637118${_scopeId}><i class="ti ti-copy text-lg" data-v-86637118${_scopeId}></i></button> <button class="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors" title="\u0627\u0634\u062A\u0631\u0627\u06A9 \u06AF\u0630\u0627\u0631\u06CC" data-v-86637118${_scopeId}><i class="ti ti-share text-lg" data-v-86637118${_scopeId}></i></button></div></div> <div class="flex items-center gap-2" data-v-86637118${_scopeId}><i class="ti ti-receipt text-blue-600" data-v-86637118${_scopeId}></i> <span class="text-base font-mono text-gray-800 ltr select-text" data-v-86637118${_scopeId}>${ssrInterpolate(item.ibanNumber)}</span></div></div>`);
              } else {
                _push2(`<!---->`);
              }
              _push2(` `);
              if (copiedMsg.value[idx]) {
                _push2(`<div class="border border-green-200 text-green-700 text-sm text-center p-3" data-v-86637118${_scopeId}><i class="ti ti-check-circle text-green-600 mr-1" data-v-86637118${_scopeId}></i> ${ssrInterpolate(copiedMsg.value[idx])}</div>`);
              } else {
                _push2(`<!---->`);
              }
              _push2(`</div></div>`);
            });
            _push2(`<!--]--></div>`);
          } else {
            return [
              createVNode("div", { class: "flex-1 overflow-y-auto text-right" }, [
                (openBlock(true), createBlock(Fragment, null, renderList(cards.value, (item, idx) => {
                  return openBlock(), createBlock("div", {
                    key: idx,
                    class: "border-b border-gray-200 mb-4 overflow-hidden"
                  }, [
                    createVNode("div", { class: "p-4 border-b border-gray-200" }, [
                      createVNode("div", { class: "flex items-center gap-3" }, [
                        createVNode("div", { class: "flex items-center justify-center flex-shrink-0 rounded-lg w-12 h-12 border border-gray-200" }, [
                          (openBlock(), createBlock(resolveDynamicComponent(iconComponent.value), mergeProps({ size: 24 }, { ref_for: true }, iconColor.value ? { color: iconColor.value, filled: isIconFilled.value } : {}), null, 16))
                        ]),
                        createTextVNode(),
                        createVNode("div", { class: "flex-1" }, [
                          createVNode("h4", { class: "font-bold text-base text-gray-800 mb-1" }, toDisplayString(item.title || `\u06A9\u0627\u0631\u062A \u0628\u0627\u0646\u06A9\u06CC ${idx + 1}`), 1),
                          createTextVNode(),
                          item.description ? (openBlock(), createBlock("p", {
                            key: 0,
                            class: "text-sm text-gray-600 leading-relaxed"
                          }, toDisplayString(item.description), 1)) : createCommentVNode("", true),
                          createTextVNode(),
                          item.bankName ? (openBlock(), createBlock("p", {
                            key: 1,
                            class: "text-sm text-blue-700 font-medium mt-1"
                          }, toDisplayString(item.bankName), 1)) : createCommentVNode("", true)
                        ])
                      ])
                    ]),
                    createTextVNode(),
                    createVNode("div", { class: "p-4 space-y-4" }, [
                      item.cardNumber ? (openBlock(), createBlock("div", {
                        key: 0,
                        class: "p-4 border border-gray-200"
                      }, [
                        createVNode("div", { class: "flex items-center justify-between mb-3" }, [
                          createVNode("span", { class: "text-sm font-medium text-gray-700" }, "\u0634\u0645\u0627\u0631\u0647 \u06A9\u0627\u0631\u062A"),
                          createTextVNode(),
                          createVNode("div", { class: "flex gap-2" }, [
                            createVNode("button", {
                              onClick: withModifiers(($event) => copyToClipboard(item.cardNumber, "\u0634\u0645\u0627\u0631\u0647 \u06A9\u0627\u0631\u062A \u06A9\u067E\u06CC \u0634\u062F!", idx), ["stop"]),
                              class: "p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors",
                              title: "\u06A9\u067E\u06CC \u0634\u0645\u0627\u0631\u0647 \u06A9\u0627\u0631\u062A"
                            }, [
                              createVNode("i", { class: "ti ti-copy text-lg" })
                            ], 8, ["onClick"]),
                            createTextVNode(),
                            createVNode("button", {
                              onClick: withModifiers(($event) => shareField("cardNumber", item, idx), ["stop"]),
                              class: "p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors",
                              title: "\u0627\u0634\u062A\u0631\u0627\u06A9 \u06AF\u0630\u0627\u0631\u06CC"
                            }, [
                              createVNode("i", { class: "ti ti-share text-lg" })
                            ], 8, ["onClick"])
                          ])
                        ]),
                        createTextVNode(),
                        createVNode("div", { class: "flex items-center gap-2" }, [
                          createVNode("i", { class: "ti ti-credit-card text-blue-600 text-lg" }),
                          createTextVNode(),
                          createVNode("span", { class: "text-lg font-mono font-bold text-gray-800 ltr tracking-wider" }, toDisplayString(formatCardNumber(item.cardNumber)), 1)
                        ])
                      ])) : createCommentVNode("", true),
                      createTextVNode(),
                      item.accountNumber ? (openBlock(), createBlock("div", {
                        key: 1,
                        class: "p-4 border border-gray-200"
                      }, [
                        createVNode("div", { class: "flex items-center justify-between mb-3" }, [
                          createVNode("span", { class: "text-sm font-medium text-gray-700" }, "\u0634\u0645\u0627\u0631\u0647 \u062D\u0633\u0627\u0628"),
                          createTextVNode(),
                          createVNode("div", { class: "flex gap-2" }, [
                            createVNode("button", {
                              onClick: withModifiers(($event) => copyToClipboard(item.accountNumber, "\u0634\u0645\u0627\u0631\u0647 \u062D\u0633\u0627\u0628 \u06A9\u067E\u06CC \u0634\u062F!", idx), ["stop"]),
                              class: "p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors",
                              title: "\u06A9\u067E\u06CC \u0634\u0645\u0627\u0631\u0647 \u062D\u0633\u0627\u0628"
                            }, [
                              createVNode("i", { class: "ti ti-copy text-lg" })
                            ], 8, ["onClick"]),
                            createTextVNode(),
                            createVNode("button", {
                              onClick: withModifiers(($event) => shareField("accountNumber", item, idx), ["stop"]),
                              class: "p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors",
                              title: "\u0627\u0634\u062A\u0631\u0627\u06A9 \u06AF\u0630\u0627\u0631\u06CC"
                            }, [
                              createVNode("i", { class: "ti ti-share text-lg" })
                            ], 8, ["onClick"])
                          ])
                        ]),
                        createTextVNode(),
                        createVNode("div", { class: "flex items-center gap-2" }, [
                          createVNode("i", { class: "ti ti-building-bank text-blue-600" }),
                          createTextVNode(),
                          createVNode("span", { class: "text-base font-mono text-gray-800 ltr select-text" }, toDisplayString(item.accountNumber), 1)
                        ])
                      ])) : createCommentVNode("", true),
                      createTextVNode(),
                      item.ibanNumber ? (openBlock(), createBlock("div", {
                        key: 2,
                        class: "p-4 border border-gray-200"
                      }, [
                        createVNode("div", { class: "flex items-center justify-between mb-3" }, [
                          createVNode("span", { class: "text-sm font-medium text-gray-700" }, "\u0634\u0645\u0627\u0631\u0647 \u0634\u0628\u0627"),
                          createTextVNode(),
                          createVNode("div", { class: "flex gap-2" }, [
                            createVNode("button", {
                              onClick: withModifiers(($event) => copyToClipboard(item.ibanNumber, "\u0634\u0645\u0627\u0631\u0647 \u0634\u0628\u0627 \u06A9\u067E\u06CC \u0634\u062F!", idx), ["stop"]),
                              class: "p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors",
                              title: "\u06A9\u067E\u06CC \u0634\u0645\u0627\u0631\u0647 \u0634\u0628\u0627"
                            }, [
                              createVNode("i", { class: "ti ti-copy text-lg" })
                            ], 8, ["onClick"]),
                            createTextVNode(),
                            createVNode("button", {
                              onClick: withModifiers(($event) => shareField("ibanNumber", item, idx), ["stop"]),
                              class: "p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors",
                              title: "\u0627\u0634\u062A\u0631\u0627\u06A9 \u06AF\u0630\u0627\u0631\u06CC"
                            }, [
                              createVNode("i", { class: "ti ti-share text-lg" })
                            ], 8, ["onClick"])
                          ])
                        ]),
                        createTextVNode(),
                        createVNode("div", { class: "flex items-center gap-2" }, [
                          createVNode("i", { class: "ti ti-receipt text-blue-600" }),
                          createTextVNode(),
                          createVNode("span", { class: "text-base font-mono text-gray-800 ltr select-text" }, toDisplayString(item.ibanNumber), 1)
                        ])
                      ])) : createCommentVNode("", true),
                      createTextVNode(),
                      copiedMsg.value[idx] ? (openBlock(), createBlock("div", {
                        key: 3,
                        class: "border border-green-200 text-green-700 text-sm text-center p-3"
                      }, [
                        createVNode("i", { class: "ti ti-check-circle text-green-600 mr-1" }),
                        createTextVNode(" " + toDisplayString(copiedMsg.value[idx]), 1)
                      ])) : createCommentVNode("", true)
                    ])
                  ]);
                }), 128))
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/UserDashboard/main/EditCard/Preview/items/bankcard.vue");
  return _sfc_setup$8 ? _sfc_setup$8(props, ctx) : void 0;
};
const bankcard = /* @__PURE__ */ _export_sfc(_sfc_main$8, [["__scopeId", "data-v-86637118"]]);
const _sfc_main$7 = /* @__PURE__ */ defineComponent({
  __name: "workhours",
  __ssrInlineRender: true,
  props: {
    link: {},
    isDarkTheme: { type: Boolean },
    isLightTheme: { type: Boolean },
    isBackgroundDark: { type: Boolean }
  },
  setup(__props) {
    const { getIconComponent } = useIconComponents();
    const props = __props;
    const formStore = useFormStore();
    const days = computed(() => {
      var _a;
      return Array.isArray((_a = props.link) == null ? void 0 : _a.days) ? props.link.days : [];
    });
    const showWorkHours = ref(false);
    const sanitizedLink = computed(() => props.link || {});
    const iconData = computed(() => {
      var _a;
      return ((_a = sanitizedLink.value) == null ? void 0 : _a.icon) || null;
    });
    const iconColor = computed(() => {
      var _a;
      if (((_a = formStore.iconColor) == null ? void 0 : _a.background) && formStore.iconColor.background !== "transparent") {
        return formStore.iconColor.background;
      }
      return void 0;
    });
    const isIconFilled = computed(() => {
      var _a;
      return !!(((_a = formStore.iconColor) == null ? void 0 : _a.background) && formStore.iconColor.background !== "transparent");
    });
    const iconBackgroundClass = computed(() => {
      var _a, _b, _c, _d;
      if (((_a = formStore.iconColor) == null ? void 0 : _a.background) === "#000000" || ((_b = formStore.iconColor) == null ? void 0 : _b.background) === "black") {
        return "bg-black/5";
      }
      if (((_c = formStore.iconColor) == null ? void 0 : _c.background) === "#ffffff" || ((_d = formStore.iconColor) == null ? void 0 : _d.background) === "white") {
        return "bg-gray-100/30";
      }
      return "bg-white";
    });
    const iconComponent = computed(() => {
      return getIconComponent(iconData.value);
    });
    return (_ctx, _push, _parent, _attrs) => {
      var _a;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "w-full max-w-full mx-auto space-y-4" }, _attrs))}><div class="${ssrRenderClass([
        "backdrop-blur rounded-xl overflow-hidden",
        _ctx.isDarkTheme ? "bg-white/[0.02]" : _ctx.isLightTheme ? "bg-black/[0.02]" : "bg-gradient-to-br from-white/60 via-white/30 to-white/10 border border-white/20"
      ])}"><button class="flex items-center gap-4 p-3 w-full rtl:text-right ltr:text-left cursor-pointer" tabindex="0" role="button"><div class="${ssrRenderClass(["flex items-center justify-center flex-shrink-0 rounded-xl overflow-hidden", _ctx.isDarkTheme || _ctx.isLightTheme ? "" : iconBackgroundClass.value])}">`);
      ssrRenderVNode(_push, createVNode(resolveDynamicComponent(iconComponent.value), mergeProps({ size: 50 }, iconColor.value ? { color: iconColor.value, filled: isIconFilled.value } : {}), null), _parent);
      _push(`</div> <div class="flex flex-col justify-center flex-1 min-w-0 rtl:text-right ltr:text-left"><div class="${ssrRenderClass(["font-bold text-sm leading-snug rtl:text-right ltr:text-left mb-1", props.isDarkTheme ? "text-white" : "text-gray-800"])}">${ssrInterpolate(((_a = props.link) == null ? void 0 : _a.title) || "\u0633\u0627\u0639\u0627\u062A \u06A9\u0627\u0631\u06CC \u0645\u062C\u0645\u0648\u0639\u0647")}</div> <div class="${ssrRenderClass(["text-xs font-normal leading-relaxed whitespace-pre-line break-words rtl:text-right ltr:text-left", props.isDarkTheme ? "text-gray-300" : "text-gray-600"])}">
            \u0628\u0631\u0627\u06CC \u0645\u0634\u0627\u0647\u062F\u0647 \u0633\u0627\u0639\u0627\u062A \u06A9\u0627\u0631\u06CC \u06A9\u0644\u06CC\u06A9 \u06A9\u0646\u06CC\u062F
          </div></div> <div class="flex items-center"><i class="${ssrRenderClass(["ti ti-chevron-left text-xl", props.isDarkTheme ? "text-gray-300" : "text-gray-400"])}"></i></div></button></div> `);
      _push(ssrRenderComponent(BaseModal, {
        modelValue: showWorkHours.value,
        "onUpdate:modelValue": ($event) => showWorkHours.value = $event
      }, {
        header: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="flex justify-between items-center p-4 border-b border-gray-200"${_scopeId}><h3 class="text-lg font-bold"${_scopeId}>\u0633\u0627\u0639\u0627\u062A \u06A9\u0627\u0631\u06CC \u0645\u062C\u0645\u0648\u0639\u0647</h3> <button class="text-gray-500 hover:text-red-500 text-xl"${_scopeId}>\xD7</button></div>`);
          } else {
            return [
              createVNode("div", { class: "flex justify-between items-center p-4 border-b border-gray-200" }, [
                createVNode("h3", { class: "text-lg font-bold" }, "\u0633\u0627\u0639\u0627\u062A \u06A9\u0627\u0631\u06CC \u0645\u062C\u0645\u0648\u0639\u0647"),
                createTextVNode(),
                createVNode("button", {
                  onClick: ($event) => showWorkHours.value = false,
                  class: "text-gray-500 hover:text-red-500 text-xl"
                }, "\xD7", 8, ["onClick"])
              ])
            ];
          }
        }),
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="flex-1 overflow-y-auto p-4 text-right"${_scopeId}><!--[-->`);
            ssrRenderList(days.value, (day, index) => {
              _push2(`<div class="flex justify-between items-center py-2 border-b last:border-b-0"${_scopeId}><span class="text-sm font-medium text-gray-800"${_scopeId}>${ssrInterpolate(day.name)}</span> <span class="text-sm text-gray-600 font-light"${_scopeId}>`);
              if (!day.enabled || day.type === "closed") {
                _push2(`<!--[-->\u062A\u0639\u0637\u06CC\u0644<!--]-->`);
              } else if (day.type === "by_appointment" || day.type === "appointment") {
                _push2(`<!--[-->\u0641\u0642\u0637 \u0628\u0627 \u0647\u0645\u0627\u0647\u0646\u06AF\u06CC \u0642\u0628\u0644\u06CC<!--]-->`);
              } else {
                _push2(`<!--[-->${ssrInterpolate(day.start)} \u062A\u0627 ${ssrInterpolate(day.end)}<!--]-->`);
              }
              _push2(`</span></div>`);
            });
            _push2(`<!--]--></div>`);
          } else {
            return [
              createVNode("div", { class: "flex-1 overflow-y-auto p-4 text-right" }, [
                (openBlock(true), createBlock(Fragment, null, renderList(days.value, (day, index) => {
                  return openBlock(), createBlock("div", {
                    key: index,
                    class: "flex justify-between items-center py-2 border-b last:border-b-0"
                  }, [
                    createVNode("span", { class: "text-sm font-medium text-gray-800" }, toDisplayString(day.name), 1),
                    createTextVNode(),
                    createVNode("span", { class: "text-sm text-gray-600 font-light" }, [
                      !day.enabled || day.type === "closed" ? (openBlock(), createBlock(Fragment, { key: 0 }, [
                        createTextVNode("\u062A\u0639\u0637\u06CC\u0644")
                      ], 64)) : day.type === "by_appointment" || day.type === "appointment" ? (openBlock(), createBlock(Fragment, { key: 1 }, [
                        createTextVNode("\u0641\u0642\u0637 \u0628\u0627 \u0647\u0645\u0627\u0647\u0646\u06AF\u06CC \u0642\u0628\u0644\u06CC")
                      ], 64)) : (openBlock(), createBlock(Fragment, { key: 2 }, [
                        createTextVNode(toDisplayString(day.start) + " \u062A\u0627 " + toDisplayString(day.end), 1)
                      ], 64))
                    ])
                  ]);
                }), 128))
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
const _sfc_setup$7 = _sfc_main$7.setup;
_sfc_main$7.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/UserDashboard/main/EditCard/Preview/items/workhours.vue");
  return _sfc_setup$7 ? _sfc_setup$7(props, ctx) : void 0;
};
const _sfc_main$6 = /* @__PURE__ */ defineComponent({
  __name: "basicblock",
  __ssrInlineRender: true,
  props: {
    link: { type: Object, required: true },
    iconBg: { type: String, default: "" },
    iconText: { type: String, default: "" },
    isDarkTheme: { type: Boolean, default: false },
    isLightTheme: { type: Boolean, default: false },
    isBackgroundDark: { type: Boolean, default: false },
    formData: { type: Object, required: false },
    previewItems: { type: Object, default: () => ({}) }
  },
  setup(__props) {
    const { getIconComponent } = useIconComponents();
    const props = __props;
    const formStore = useFormStore();
    computed(() => props.formData || formStore);
    const sanitizedLink = computed(() => props.link || {});
    const sanitizedDescription = computed(() => {
      var _a, _b;
      if ((_a = props.link) == null ? void 0 : _a.description) {
        const trimmed = props.link.description.trim();
        if (trimmed && trimmed !== "" && trimmed !== "description") {
          return trimmed;
        }
      }
      if ((_b = props.link) == null ? void 0 : _b.content) {
        const trimmed = props.link.content.trim();
        if (trimmed && trimmed !== "" && trimmed !== "content") {
          return trimmed;
        }
      }
      return null;
    });
    const iconData = computed(() => {
      var _a;
      return ((_a = sanitizedLink.value) == null ? void 0 : _a.icon) || null;
    });
    const iconColor = computed(() => {
      var _a;
      if (((_a = formStore.iconColor) == null ? void 0 : _a.background) && formStore.iconColor.background !== "transparent") {
        return formStore.iconColor.background;
      }
      return void 0;
    });
    const isIconFilled = computed(() => {
      var _a;
      return !!(((_a = formStore.iconColor) == null ? void 0 : _a.background) && formStore.iconColor.background !== "transparent");
    });
    const iconBackgroundClass = computed(() => {
      var _a, _b, _c, _d;
      if (((_a = formStore.iconColor) == null ? void 0 : _a.background) === "#000000" || ((_b = formStore.iconColor) == null ? void 0 : _b.background) === "black") {
        return "bg-black/5";
      }
      if (((_c = formStore.iconColor) == null ? void 0 : _c.background) === "#ffffff" || ((_d = formStore.iconColor) == null ? void 0 : _d.background) === "white") {
        return "bg-gray-100/30";
      }
      return "bg-white";
    });
    const iconComponent = computed(() => {
      var _a, _b;
      if (((_a = iconData.value) == null ? void 0 : _a.type) === "component" && ((_b = iconData.value) == null ? void 0 : _b.name)) {
        return getIconComponent(iconData.value.name) || getIconComponent("textSection");
      }
      return getIconComponent("textSection");
    });
    return (_ctx, _push, _parent, _attrs) => {
      var _a, _b, _c;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "w-full max-w-full mx-auto space-y-4" }, _attrs))}><div class="${ssrRenderClass([
        "backdrop-blur rounded-xl overflow-hidden",
        __props.isDarkTheme ? "bg-white/[0.02]" : __props.isLightTheme ? "bg-black/[0.02]" : "bg-gradient-to-br from-white/60 via-white/30 to-white/10 border border-white/20"
      ])}"><div class="flex items-center gap-4 p-3 w-full text-right"><div class="${ssrRenderClass(["flex items-center justify-center flex-shrink-0 rounded-xl overflow-hidden w-14 h-14", __props.isDarkTheme || __props.isLightTheme ? "" : iconBackgroundClass.value])}">`);
      ssrRenderVNode(_push, createVNode(resolveDynamicComponent(iconComponent.value), mergeProps({ size: 32 }, iconColor.value ? { color: iconColor.value, filled: isIconFilled.value } : {}), null), _parent);
      _push(`</div> <div class="flex flex-col justify-center flex-1 min-w-0 text-right"><div class="${ssrRenderClass(["font-bold text-sm leading-snug text-right mb-1", __props.isDarkTheme ? "text-white" : "text-gray-800"])}">${ssrInterpolate(((_a = __props.link) == null ? void 0 : _a.title) || ((_b = __props.link) == null ? void 0 : _b.name) || "\u0628\u0644\u0648\u06A9 \u0645\u062D\u062A\u0648\u0627")}</div> `);
      if (sanitizedDescription.value) {
        _push(`<div class="${ssrRenderClass(["text-xs font-normal leading-relaxed whitespace-pre-line break-words text-right", __props.isDarkTheme ? "text-gray-300" : "text-gray-600"])}">${ssrInterpolate(sanitizedDescription.value)}</div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div></div> `);
      if ((_c = __props.link) == null ? void 0 : _c.content) {
        _push(`<div class="${ssrRenderClass(["p-4", __props.isBackgroundDark ? "border-t border-white/10" : "border-t border-white/20"])}"><div class="${ssrRenderClass(["text-sm leading-relaxed whitespace-pre-line", __props.isDarkTheme ? "text-gray-200" : "text-gray-700"])}">${ssrInterpolate(__props.link.content)}</div></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(` `);
      if (_ctx.$slots.default) {
        _push(`<div class="${ssrRenderClass(["p-4", __props.isBackgroundDark ? "border-t border-white/10" : "border-t border-white/20"])}">`);
        ssrRenderSlot(_ctx.$slots, "default", {}, null, _push, _parent);
        _push(`</div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div></div>`);
    };
  }
});
const _sfc_setup$6 = _sfc_main$6.setup;
_sfc_main$6.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/UserDashboard/main/EditCard/Preview/items/basicblock.vue");
  return _sfc_setup$6 ? _sfc_setup$6(props, ctx) : void 0;
};
const _sfc_main$5 = {
  __name: "basiclink",
  __ssrInlineRender: true,
  props: {
    link: { type: Object, required: true },
    isListMode: { type: Boolean, default: false },
    formData: { type: Object, required: false },
    isDarkTheme: { type: Boolean, default: false },
    isLightTheme: { type: Boolean, default: false },
    isBackgroundDark: { type: Boolean, default: false }
  },
  setup(__props) {
    const props = __props;
    const formStore = useFormStore();
    const formData = computed(() => props.formData || formStore);
    const sanitizedLink = computed(() => {
      const link = props.link || {};
      const getDefaultTitle = (action, originalTitle, name) => {
        const defaultTitles = {
          "call": "\u062A\u0645\u0627\u0633",
          "number": "\u067E\u06CC\u0627\u0645\u06A9",
          "email": "\u0627\u06CC\u0645\u06CC\u0644",
          "whatsapp": "\u0648\u0627\u062A\u0633\u0627\u067E"
        };
        if (originalTitle && originalTitle.trim() && originalTitle !== name) {
          return originalTitle;
        }
        if (defaultTitles[action]) {
          return defaultTitles[action];
        }
        return originalTitle || name;
      };
      const result = {
        ...link,
        displayName: getDefaultTitle(link.action, link.title, link.name)
      };
      if (link.description && link.description.trim() && link.description.trim() !== "" && link.description !== "description") {
        result.description = link.description.trim();
      }
      return result;
    });
    const iconData = computed(() => {
      var _a;
      return ((_a = sanitizedLink.value) == null ? void 0 : _a.icon) || null;
    });
    const iconColor = computed(() => {
      var _a;
      if (((_a = formStore.iconColor) == null ? void 0 : _a.background) && formStore.iconColor.background !== "transparent") {
        return formStore.iconColor.background;
      }
      return void 0;
    });
    const isIconFilled = computed(() => {
      var _a;
      return !!(((_a = formStore.iconColor) == null ? void 0 : _a.background) && formStore.iconColor.background !== "transparent");
    });
    const { getIconComponent } = useIconComponents();
    const iconComponent = computed(() => {
      return getIconComponent(iconData.value);
    });
    const isLinkType = computed(() => {
      const actions = [
        "number",
        "contactcard",
        "call",
        "eitaa",
        "telegram",
        "email",
        "facetime",
        "whatsapp",
        "address",
        "clubhouse",
        "facebook",
        "instagram",
        "linkedin",
        "pinterest",
        "snapchat",
        "threads",
        "tiktok",
        "twitch",
        "twitter",
        "rubika",
        "youtube",
        "virgool",
        "app_link",
        "booksy",
        "calendly",
        "chili-piper",
        "etsy",
        "microsoft-bookings",
        "reviews",
        "safari",
        "square",
        "yelp",
        "zillow",
        "divar",
        "snapp",
        "balad",
        "nshan",
        "neshan",
        "trustpilot",
        "poll",
        "questionbox",
        "expandabletext",
        "aparat",
        "builder",
        "luckyegg",
        "luckydice",
        "luckywheel",
        "cashapp",
        "paypal",
        "venmo",
        "zelle",
        "raymit",
        "zarinpal",
        "trustwallet",
        "creditcard",
        "customlink",
        "igap",
        "discord",
        "bale",
        "linktree",
        "poshmark",
        "figma",
        "medium",
        "apple",
        "soundcloud",
        "spotify",
        "youtubemusic",
        "github",
        "googlemeet",
        "teams",
        "zoom",
        "opensea",
        "hobby",
        "podcast",
        "worktime"
      ];
      return actions.includes(props.link.action);
    });
    const baseUrls = {
      number: "sms:",
      call: "tel:",
      email: "mailto:",
      facetime: "facetime:",
      telegram: "https://t.me/",
      instagram: "https://instagram.com/",
      facebook: "https://facebook.com/",
      linkedin: "https://linkedin.com/in/",
      youtube: "https://youtube.com/",
      aparat: "https://aparat.com/",
      address: "/",
      virgool: "https://virgool.io/@",
      trustpilot: "https://www.trustpilot.com/review/"
    };
    const value = props.link.value || "";
    const base = baseUrls[props.link.action];
    const protocolRegex = /^(https?:|mailto:|tel:|facetime:|sms:|ftp:|ftps:|chrome:|edge:|file:|data:|webcal:|tg:|geo:|maps:|intent:|app:|custom:|\/)/i;
    const finalUrl = computed(() => {
      if (!base) return value;
      if (protocolRegex.test(value)) return value;
      if (/^https?:\/\//i.test(value)) return value;
      if (base.endsWith(":")) return `${base}${value}`;
      return `${base}${value.replace(/^[@+]/, "")}`;
    });
    const cardStyle = computed(() => {
      return "";
    });
    const isListMode = computed(() => {
      if (props.link.isListMode !== void 0) {
        return props.link.isListMode;
      }
      if (props.isListMode !== void 0) {
        return props.isListMode;
      }
      return true;
    });
    return (_ctx, _push, _parent, _attrs) => {
      var _a, _b, _c, _d, _e;
      if (isLinkType.value) {
        _push(`<a${ssrRenderAttrs(mergeProps(_ctx.$attrs, {
          class: [
            isListMode.value ? "flex items-center gap-4 backdrop-blur rounded-xl p-2 w-full " + (((_a = formData.value) == null ? void 0 : _a.layout) === "left" ? "text-left" : "text-right") + (__props.isDarkTheme ? " bg-white/[0.02]" : __props.isLightTheme ? " bg-black/[0.02]" : " bg-gradient-to-br from-white/60 via-white/30 to-white/10 border border-white/20") : "rounded-xl text-center p-2 flex flex-col items-center justify-center transition hover:shadow-md backdrop-blur" + (__props.isDarkTheme ? " bg-white/[0.02]" : __props.isLightTheme ? " bg-black/[0.02]" : " bg-gradient-to-br from-white/60 via-white/30 to-white/10 border border-white/20")
          ],
          style: cardStyle.value,
          href: finalUrl.value || void 0,
          target: finalUrl.value ? "_blank" : void 0,
          rel: finalUrl.value ? "noopener" : void 0
        }, _attrs))}><div class="${ssrRenderClass([
          isListMode.value ? "flex-shrink-0 rounded-xl flex items-center overflow-hidden w-[54px] h-[54px]" : "w-[54px] h-[54px] rounded-xl flex items-center justify-center mb-2 overflow-hidden",
          __props.isDarkTheme || __props.isLightTheme ? "" : "bg-gray-100"
        ])}">`);
        if (iconComponent.value && ((_b = iconData.value) == null ? void 0 : _b.type) === "component") {
          ssrRenderVNode(_push, createVNode(resolveDynamicComponent(iconComponent.value), mergeProps({ size: 50 }, iconColor.value ? { color: iconColor.value, filled: isIconFilled.value } : {}), null), _parent);
        } else {
          _push(`<i class="ti ti-link text-blue-500 text-xl"></i>`);
        }
        _push(`</div> <div class="${ssrRenderClass(isListMode.value ? "flex flex-col justify-center flex-1 min-w-0 " + (((_c = formData.value) == null ? void 0 : _c.layout) === "left" ? "text-left" : "text-right") : "w-full text-center mt-0 flex-1 flex flex-col justify-center")}"><div class="${ssrRenderClass([
          isListMode.value ? "font-bold text-[14px] leading-snug break-words " + (((_d = formData.value) == null ? void 0 : _d.layout) === "left" ? "text-left" : "text-right") : "font-bold text-[15px] leading-snug text-center break-words",
          __props.isDarkTheme ? "text-white" : "text-gray-800"
        ])}">${ssrInterpolate(sanitizedLink.value.displayName || sanitizedLink.value.title || sanitizedLink.value.name || sanitizedLink.value.value || sanitizedLink.value.id || "\u0628\u062F\u0648\u0646 \u0639\u0646\u0648\u0627\u0646")}</div> `);
        if (isListMode.value && sanitizedLink.value.description && sanitizedLink.value.description.trim()) {
          _push(`<div class="${ssrRenderClass([
            "text-xs font-normal mt-1 leading-relaxed whitespace-pre-line break-words " + (((_e = formData.value) == null ? void 0 : _e.layout) === "left" ? "text-left" : "text-right"),
            __props.isDarkTheme ? "text-gray-300" : "text-gray-600"
          ])}">${ssrInterpolate(sanitizedLink.value.description)}</div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div></a>`);
      } else {
        _push(`<!---->`);
      }
    };
  }
};
const _sfc_setup$5 = _sfc_main$5.setup;
_sfc_main$5.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/UserDashboard/main/EditCard/Preview/items/basiclink.vue");
  return _sfc_setup$5 ? _sfc_setup$5(props, ctx) : void 0;
};
const _sfc_main$4 = {
  __name: "builder",
  __ssrInlineRender: true,
  props: {
    link: { type: Object, default: () => ({}) },
    isListMode: { type: Boolean, default: false },
    isDarkTheme: { type: Boolean, default: false },
    isLightTheme: { type: Boolean, default: false },
    isBackgroundDark: { type: Boolean, default: false }
  },
  setup(__props) {
    const props = __props;
    const formStore = useFormStore();
    const { getIconComponent } = useIconComponents();
    const iconData = computed(() => {
      var _a;
      return ((_a = props.link) == null ? void 0 : _a.icon) || null;
    });
    const iconComponent = computed(() => {
      var _a, _b;
      if (((_a = iconData.value) == null ? void 0 : _a.type) === "component" && ((_b = iconData.value) == null ? void 0 : _b.name)) {
        return getIconComponent(iconData.value.name);
      }
      return getIconComponent("form");
    });
    const iconColor = computed(() => {
      var _a;
      if (((_a = formStore.iconColor) == null ? void 0 : _a.background) && formStore.iconColor.background !== "transparent") {
        return formStore.iconColor.background;
      }
      return void 0;
    });
    const isIconFilled = computed(() => {
      var _a;
      return !!(((_a = formStore.iconColor) == null ? void 0 : _a.background) && formStore.iconColor.background !== "transparent");
    });
    const formData = reactive({});
    const success = ref(false);
    const showModal = ref(false);
    const sanitizedLink = computed(() => {
      const link = props.link || {};
      const getDefaultTitle = (action, originalTitle, name) => {
        const defaultTitles = {
          "call": "\u062A\u0645\u0627\u0633 \u0628\u0627 \u0645\u0627",
          "number": "\u067E\u06CC\u0627\u0645 \u062F\u0647\u06CC\u062F",
          "email": "\u0627\u06CC\u0645\u06CC\u0644 \u0627\u0631\u0633\u0627\u0644 \u06A9\u0646\u06CC\u062F",
          "whatsapp": "\u062F\u0631 \u0648\u0627\u062A\u0633\u0627\u067E \u067E\u06CC\u0627\u0645 \u062F\u0647\u06CC\u062F"
        };
        if (originalTitle && originalTitle.trim() && originalTitle !== name) {
          return originalTitle;
        }
        if (defaultTitles[action]) {
          return defaultTitles[action];
        }
        return originalTitle || name;
      };
      return {
        ...link,
        description: link.description && link.description.trim() && link.description !== "" ? link.description : "",
        displayName: getDefaultTitle(link.action, link.title, link.name)
      };
    });
    function getOptions(field) {
      if (field.optionsText) {
        return field.optionsText.split(/\r?\n/).map((opt) => opt.trim()).filter(Boolean);
      }
      return [];
    }
    const { $axios } = useNuxtApp();
    const showToast = ref(false);
    const toastMessage = ref("");
    const toastIcon = ref("ti-alert-triangle");
    const showInfoToast = (message, icon = "ti-lock") => {
      toastMessage.value = message;
      toastIcon.value = icon;
      showToast.value = true;
      setTimeout(() => showToast.value = false, 3e3);
    };
    async function handleSubmit() {
      var _a, _b, _c, _d;
      try {
        const data = new FormData();
        const files = [];
        sanitizedLink.value.fields.forEach((field) => {
          const value = formData[field.id];
          if (value !== void 0 && value !== null) {
            if (field.type === "file" && value instanceof File) {
              files.push({ field: "fileData", file: value });
            } else if (Array.isArray(value)) {
              value.forEach((v) => data.append(field.label + "[]", v));
            } else {
              data.append(field.label, value);
            }
          }
        });
        const response = await $axios.post(`club/${(_a = props.link) == null ? void 0 : _a.hash}/recordForm`, data);
        if (files.length > 0) {
          const fileForm = new FormData();
          for (const { field, file } of files) {
            fileForm.append(field, file);
          }
          const uploadResponse = await uploadFiles(
            (_b = response.data) == null ? void 0 : _b.data.id,
            (_c = response.data) == null ? void 0 : _c.data.cardId,
            (_d = response.data) == null ? void 0 : _d.data.modelType,
            fileForm
          );
          showInfoToast(response.data.message, "ti-check");
        }
        success.value = true;
        setTimeout(() => {
          success.value = false;
          Object.keys(formData).forEach((k) => formData[k] = "");
        }, 2e3);
      } catch (error) {
        alert("\u0645\u0634\u06A9\u0644\u06CC \u062F\u0631 \u0627\u0631\u0633\u0627\u0644 \u0641\u0631\u0645 \u0631\u062E \u062F\u0627\u062F. \u0644\u0637\u0641\u0627\u064B \u062F\u0648\u0628\u0627\u0631\u0647 \u062A\u0644\u0627\u0634 \u06A9\u0646\u06CC\u062F.");
      }
    }
    async function uploadFiles(linkId, cardId, modelType, fileForm) {
      var _a;
      const formData2 = new FormData();
      formData2.append("modelType", modelType);
      formData2.append("modelId", linkId);
      for (const [field, value] of fileForm.entries()) {
        if (!value) continue;
        if (typeof value === "string" && value.startsWith("data:")) {
          const byteString = atob(value.split(",")[1]);
          const ab = new ArrayBuffer(byteString.length);
          const ia = new Uint8Array(ab);
          for (let i = 0; i < byteString.length; i++) ia[i] = byteString.charCodeAt(i);
          const blob = new Blob([ab], { type: "image/png" });
          formData2.append(field, blob, `${field}.png`);
        } else {
          formData2.append(field, value);
        }
      }
      try {
        const uploadResponse = await $axios.post(`file-manager/${linkId}/upload`, formData2);
        if ((_a = uploadResponse.data) == null ? void 0 : _a.success) {
          showInfoToast("\u0641\u0627\u06CC\u0644\u200C\u0647\u0627 \u0628\u0627 \u0645\u0648\u0641\u0642\u06CC\u062A \u0622\u067E\u0644\u0648\u062F \u0634\u062F\u0646\u062F \u2705", "ti-image");
        } else {
          showInfoToast("\u062E\u0637\u0627 \u062F\u0631 \u0622\u067E\u0644\u0648\u062F \u0641\u0627\u06CC\u0644\u200C\u0647\u0627 \u26A0\uFE0F", "ti-alert-triangle");
        }
        return uploadResponse;
      } catch (error) {
        showInfoToast("\u062E\u0637\u0627 \u062F\u0631 \u0627\u0631\u062A\u0628\u0627\u0637 \u0628\u0627 \u0633\u0631\u0648\u0631 \u26A0\uFE0F", "ti-alert-triangle");
      }
    }
    props.link.fields.forEach((field) => {
      if (field.type === "checkboxes") {
        formData[field.id] = [];
      } else {
        formData[field.id] = "";
      }
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<!--[--><div class="${ssrRenderClass(__props.isListMode ? "w-full" : "")}" data-v-5a674bb6><a${ssrRenderAttrs(mergeProps(_ctx.$attrs, {
        class: [
          __props.isListMode ? "flex items-center gap-4 backdrop-blur rounded-xl p-2 w-full cursor-pointer " + ((formData == null ? void 0 : formData.layout) === "left" ? "text-left" : "text-right") : "rounded-xl text-center p-2 flex flex-col items-center justify-center transition hover:shadow-md backdrop-blur cursor-pointer",
          __props.isDarkTheme ? "bg-white/[0.02]" : __props.isLightTheme ? "bg-black/[0.02]" : "bg-gradient-to-br from-white/60 via-white/30 to-white/10 border border-white/20"
        ],
        tabindex: "0",
        role: "button"
      }))} data-v-5a674bb6><div class="${ssrRenderClass([
        __props.isListMode ? "flex-shrink-0 rounded-xl flex items-center overflow-hidden w-[54px] h-[54px]" : "w-[54px] h-[54px] rounded-xl flex items-center justify-center mb-2 overflow-hidden",
        __props.isDarkTheme || __props.isLightTheme ? "" : "bg-gray-100"
      ])}" data-v-5a674bb6>`);
      ssrRenderVNode(_push, createVNode(resolveDynamicComponent(iconComponent.value), mergeProps({ size: 50 }, iconColor.value ? { color: iconColor.value, filled: isIconFilled.value } : {}), null), _parent);
      _push(`</div> <div class="${ssrRenderClass(__props.isListMode ? "flex flex-col justify-center flex-1 min-w-0 " + ((formData == null ? void 0 : formData.layout) === "left" ? "text-left" : "text-right") : "w-full text-center mt-0 flex-1 flex flex-col justify-center")}" data-v-5a674bb6><div class="${ssrRenderClass([
        __props.isListMode ? "font-bold text-[14px] leading-snug break-words " + ((formData == null ? void 0 : formData.layout) === "left" ? "text-left" : "text-right") : "font-bold text-[15px] leading-snug text-center break-words",
        __props.isDarkTheme ? "text-white" : "text-gray-800"
      ])}" data-v-5a674bb6>${ssrInterpolate(sanitizedLink.value.displayName || sanitizedLink.value.title || sanitizedLink.value.name || sanitizedLink.value.value || sanitizedLink.value.id || "\u0641\u0631\u0645 \u062A\u0645\u0627\u0633")}</div> `);
      if (__props.isListMode && sanitizedLink.value.description) {
        _push(`<div class="${ssrRenderClass([
          "text-xs font-normal mt-1 leading-relaxed whitespace-pre-line break-words " + ((formData == null ? void 0 : formData.layout) === "left" ? "text-left" : "text-right"),
          __props.isDarkTheme ? "text-gray-300" : "text-gray-600"
        ])}" data-v-5a674bb6>${ssrInterpolate(sanitizedLink.value.description)}</div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div></a> `);
      _push(ssrRenderComponent(BaseModalGame, {
        modelValue: showModal.value,
        "onUpdate:modelValue": ($event) => showModal.value = $event
      }, {
        header: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="flex justify-between items-center p-4 border-b border-gray-100 bg-white" data-v-5a674bb6${_scopeId}><div class="flex items-center gap-3" data-v-5a674bb6${_scopeId}>`);
            ssrRenderVNode(_push2, createVNode(resolveDynamicComponent(iconComponent.value), mergeProps({ size: 50 }, iconColor.value ? { color: iconColor.value, filled: isIconFilled.value } : {}), null), _parent2, _scopeId);
            _push2(` <h3 class="text-lg font-semibold text-gray-800" data-v-5a674bb6${_scopeId}>${ssrInterpolate(sanitizedLink.value.displayName || sanitizedLink.value.title || sanitizedLink.value.name || sanitizedLink.value.value || sanitizedLink.value.id || "\u0641\u0631\u0645 \u062A\u0645\u0627\u0633")}</h3></div> <button class="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors" data-v-5a674bb6${_scopeId}><i class="ti ti-x text-lg" data-v-5a674bb6${_scopeId}></i></button></div>`);
          } else {
            return [
              createVNode("div", { class: "flex justify-between items-center p-4 border-b border-gray-100 bg-white" }, [
                createVNode("div", { class: "flex items-center gap-3" }, [
                  (openBlock(), createBlock(resolveDynamicComponent(iconComponent.value), mergeProps({ size: 50 }, iconColor.value ? { color: iconColor.value, filled: isIconFilled.value } : {}), null, 16)),
                  createTextVNode(),
                  createVNode("h3", { class: "text-lg font-semibold text-gray-800" }, toDisplayString(sanitizedLink.value.displayName || sanitizedLink.value.title || sanitizedLink.value.name || sanitizedLink.value.value || sanitizedLink.value.id || "\u0641\u0631\u0645 \u062A\u0645\u0627\u0633"), 1)
                ]),
                createTextVNode(),
                createVNode("button", {
                  onClick: ($event) => showModal.value = false,
                  class: "w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
                }, [
                  createVNode("i", { class: "ti ti-x text-lg" })
                ], 8, ["onClick"])
              ])
            ];
          }
        }),
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<form class="space-y-5 p-4" data-v-5a674bb6${_scopeId}><!--[-->`);
            ssrRenderList(__props.link.fields, (field) => {
              var _a;
              _push2(`<!--[-->`);
              if (field.type === "text") {
                _push2(`<div data-v-5a674bb6${_scopeId}><label class="block text-xs font-bold text-gray-600 mb-1" data-v-5a674bb6${_scopeId}>${ssrInterpolate(field.label)}</label> <input${ssrRenderAttr("value", formData[field.id])}${ssrRenderAttr("placeholder", field.placeholder)} type="text" class="w-full px-3 py-2 rounded-lg border border-gray-200 bg-gray-50 focus:ring-2 focus:ring-blue-200 focus:border-blue-400 transition" data-v-5a674bb6${_scopeId}></div>`);
              } else if (field.type === "email") {
                _push2(`<div data-v-5a674bb6${_scopeId}><label class="block text-xs font-bold text-gray-600 mb-1" data-v-5a674bb6${_scopeId}>${ssrInterpolate(field.label)}</label> <input${ssrRenderAttr("value", formData[field.id])}${ssrRenderAttr("placeholder", field.placeholder)} type="email" class="w-full px-3 py-2 rounded-lg border border-gray-200 bg-gray-50 ltr focus:ring-2 focus:ring-blue-200 focus:border-blue-400 transition" data-v-5a674bb6${_scopeId}></div>`);
              } else if (field.type === "number") {
                _push2(`<div data-v-5a674bb6${_scopeId}><label class="block text-xs font-bold text-gray-600 mb-1" data-v-5a674bb6${_scopeId}>${ssrInterpolate(field.label)}</label> <input${ssrRenderAttr("value", formData[field.id])}${ssrRenderAttr("placeholder", field.placeholder)} type="number" class="w-full px-3 py-2 rounded-lg border border-gray-200 bg-gray-50 ltr focus:ring-2 focus:ring-blue-200 focus:border-blue-400 transition" data-v-5a674bb6${_scopeId}></div>`);
              } else if (field.type === "mobile") {
                _push2(`<div data-v-5a674bb6${_scopeId}><label class="block text-xs font-bold text-gray-600 mb-1" data-v-5a674bb6${_scopeId}>${ssrInterpolate(field.label)}</label> <input${ssrRenderAttr("value", formData[field.id])}${ssrRenderAttr("placeholder", field.placeholder || "\u0645\u062B\u0644\u0627\u064B 09123456789")} type="tel" class="w-full px-3 py-2 rounded-lg border border-gray-200 bg-gray-50 ltr focus:ring-2 focus:ring-blue-200 focus:border-blue-400 transition" data-v-5a674bb6${_scopeId}></div>`);
              } else if (field.type === "dropdown") {
                _push2(`<div data-v-5a674bb6${_scopeId}><label class="block text-xs font-bold text-gray-600 mb-1" data-v-5a674bb6${_scopeId}>${ssrInterpolate(field.label)}</label> <select class="w-full px-3 py-2 rounded-lg border border-gray-200 bg-gray-50 focus:ring-2 focus:ring-blue-200 focus:border-blue-400 transition" data-v-5a674bb6${_scopeId}><!--[-->`);
                ssrRenderList(getOptions(field), (opt) => {
                  _push2(`<option${ssrRenderAttr("value", opt)} data-v-5a674bb6${ssrIncludeBooleanAttr(Array.isArray(formData[field.id]) ? ssrLooseContain(formData[field.id], opt) : ssrLooseEqual(formData[field.id], opt)) ? " selected" : ""}${_scopeId}>${ssrInterpolate(opt)}</option>`);
                });
                _push2(`<!--]--></select></div>`);
              } else if (field.type === "radio") {
                _push2(`<div data-v-5a674bb6${_scopeId}><label class="block text-xs font-bold text-gray-600 mb-1" data-v-5a674bb6${_scopeId}>${ssrInterpolate(field.label)}</label> <div class="flex flex-col gap-2" data-v-5a674bb6${_scopeId}><!--[-->`);
                ssrRenderList(getOptions(field), (opt) => {
                  _push2(`<label class="flex items-center gap-2 cursor-pointer" data-v-5a674bb6${_scopeId}><input type="radio"${ssrRenderAttr("name", "radio_" + field.id)}${ssrRenderAttr("value", opt)}${ssrIncludeBooleanAttr(ssrLooseEqual(formData[field.id], opt)) ? " checked" : ""} class="accent-blue-600" data-v-5a674bb6${_scopeId}> <span class="text-xs" data-v-5a674bb6${_scopeId}>${ssrInterpolate(opt)}</span></label>`);
                });
                _push2(`<!--]--></div></div>`);
              } else if (field.type === "checkboxes") {
                _push2(`<div data-v-5a674bb6${_scopeId}><label class="block text-xs font-bold text-gray-600 mb-1" data-v-5a674bb6${_scopeId}>${ssrInterpolate(field.label)}</label> <div class="flex flex-col gap-2" data-v-5a674bb6${_scopeId}><!--[-->`);
                ssrRenderList(getOptions(field), (opt) => {
                  _push2(`<label class="flex items-center gap-2 cursor-pointer" data-v-5a674bb6${_scopeId}><input type="checkbox"${ssrRenderAttr("value", opt)}${ssrIncludeBooleanAttr(Array.isArray(formData[field.id]) ? ssrLooseContain(formData[field.id], opt) : formData[field.id]) ? " checked" : ""} class="accent-blue-600" data-v-5a674bb6${_scopeId}> <span class="text-xs" data-v-5a674bb6${_scopeId}>${ssrInterpolate(opt)}</span></label>`);
                });
                _push2(`<!--]--></div></div>`);
              } else if (field.type === "file") {
                _push2(`<div data-v-5a674bb6${_scopeId}><label class="block text-xs font-bold text-gray-600 mb-1" data-v-5a674bb6${_scopeId}>${ssrInterpolate(field.label)}</label> <input type="file" class="w-full file:mr-2 file:py-1 file:px-3 file:rounded-lg file:border-0 file:bg-blue-50 file:text-blue-700" data-v-5a674bb6${_scopeId}> `);
                if (formData[field.id]) {
                  _push2(`<span class="text-xs text-gray-500 mt-1 block" data-v-5a674bb6${_scopeId}>${ssrInterpolate((_a = formData[field.id]) == null ? void 0 : _a.name)}</span>`);
                } else {
                  _push2(`<!---->`);
                }
                _push2(`</div>`);
              } else if (field.type === "textarea") {
                _push2(`<div data-v-5a674bb6${_scopeId}><label class="block text-xs font-bold text-gray-600 mb-1" data-v-5a674bb6${_scopeId}>${ssrInterpolate(field.label)}</label> <textarea${ssrRenderAttr("placeholder", field.placeholder)} rows="3" class="w-full px-3 py-2 rounded-lg border border-gray-200 bg-gray-50 focus:ring-2 focus:ring-blue-200 focus:border-blue-400 transition" data-v-5a674bb6${_scopeId}>${ssrInterpolate(formData[field.id])}</textarea></div>`);
              } else if (field.type === "checkbox") {
                _push2(`<div data-v-5a674bb6${_scopeId}><label class="flex items-center gap-2 cursor-pointer" data-v-5a674bb6${_scopeId}><input${ssrIncludeBooleanAttr(Array.isArray(formData[field.id]) ? ssrLooseContain(formData[field.id], null) : formData[field.id]) ? " checked" : ""} type="checkbox" class="rounded border-gray-300 accent-blue-600" data-v-5a674bb6${_scopeId}> <span class="text-xs" data-v-5a674bb6${_scopeId}>${ssrInterpolate(field.label || field.placeholder || "\u062A\u06CC\u06A9 \u0628\u0632\u0646\u06CC\u062F")}</span></label></div>`);
              } else {
                _push2(`<!---->`);
              }
              _push2(`<!--]-->`);
            });
            _push2(`<!--]--> <button type="submit" class="w-full mt-6 py-3 bg-black text-white rounded-lg text-base font-bold hover:bg-gray-700 transition flex items-center justify-center gap-2" data-v-5a674bb6${_scopeId}><i class="ti ti-send" data-v-5a674bb6${_scopeId}></i> ${ssrInterpolate(__props.link.submitButtonText || "\u0627\u0631\u0633\u0627\u0644")}</button> `);
            if (success.value) {
              _push2(`<div class="bg-green-100 text-green-700 p-3 rounded-lg text-center mt-4" data-v-5a674bb6${_scopeId}>${ssrInterpolate(__props.link.thankYouMessage || "\u0641\u0631\u0645 \u0628\u0627 \u0645\u0648\u0641\u0642\u06CC\u062A \u0627\u0631\u0633\u0627\u0644 \u0634\u062F!")}</div>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</form>`);
          } else {
            return [
              createVNode("form", {
                onSubmit: withModifiers(handleSubmit, ["prevent"]),
                class: "space-y-5 p-4"
              }, [
                (openBlock(true), createBlock(Fragment, null, renderList(__props.link.fields, (field) => {
                  var _a;
                  return openBlock(), createBlock(Fragment, {
                    key: field.id
                  }, [
                    field.type === "text" ? (openBlock(), createBlock("div", { key: 0 }, [
                      createVNode("label", { class: "block text-xs font-bold text-gray-600 mb-1" }, toDisplayString(field.label), 1),
                      createTextVNode(),
                      withDirectives(createVNode("input", {
                        "onUpdate:modelValue": ($event) => formData[field.id] = $event,
                        placeholder: field.placeholder,
                        type: "text",
                        class: "w-full px-3 py-2 rounded-lg border border-gray-200 bg-gray-50 focus:ring-2 focus:ring-blue-200 focus:border-blue-400 transition"
                      }, null, 8, ["onUpdate:modelValue", "placeholder"]), [
                        [vModelText, formData[field.id]]
                      ])
                    ])) : field.type === "email" ? (openBlock(), createBlock("div", { key: 1 }, [
                      createVNode("label", { class: "block text-xs font-bold text-gray-600 mb-1" }, toDisplayString(field.label), 1),
                      createTextVNode(),
                      withDirectives(createVNode("input", {
                        "onUpdate:modelValue": ($event) => formData[field.id] = $event,
                        placeholder: field.placeholder,
                        type: "email",
                        class: "w-full px-3 py-2 rounded-lg border border-gray-200 bg-gray-50 ltr focus:ring-2 focus:ring-blue-200 focus:border-blue-400 transition"
                      }, null, 8, ["onUpdate:modelValue", "placeholder"]), [
                        [vModelText, formData[field.id]]
                      ])
                    ])) : field.type === "number" ? (openBlock(), createBlock("div", { key: 2 }, [
                      createVNode("label", { class: "block text-xs font-bold text-gray-600 mb-1" }, toDisplayString(field.label), 1),
                      createTextVNode(),
                      withDirectives(createVNode("input", {
                        "onUpdate:modelValue": ($event) => formData[field.id] = $event,
                        placeholder: field.placeholder,
                        type: "number",
                        class: "w-full px-3 py-2 rounded-lg border border-gray-200 bg-gray-50 ltr focus:ring-2 focus:ring-blue-200 focus:border-blue-400 transition"
                      }, null, 8, ["onUpdate:modelValue", "placeholder"]), [
                        [vModelText, formData[field.id]]
                      ])
                    ])) : field.type === "mobile" ? (openBlock(), createBlock("div", { key: 3 }, [
                      createVNode("label", { class: "block text-xs font-bold text-gray-600 mb-1" }, toDisplayString(field.label), 1),
                      createTextVNode(),
                      withDirectives(createVNode("input", {
                        "onUpdate:modelValue": ($event) => formData[field.id] = $event,
                        placeholder: field.placeholder || "\u0645\u062B\u0644\u0627\u064B 09123456789",
                        type: "tel",
                        class: "w-full px-3 py-2 rounded-lg border border-gray-200 bg-gray-50 ltr focus:ring-2 focus:ring-blue-200 focus:border-blue-400 transition"
                      }, null, 8, ["onUpdate:modelValue", "placeholder"]), [
                        [vModelText, formData[field.id]]
                      ])
                    ])) : field.type === "dropdown" ? (openBlock(), createBlock("div", { key: 4 }, [
                      createVNode("label", { class: "block text-xs font-bold text-gray-600 mb-1" }, toDisplayString(field.label), 1),
                      createTextVNode(),
                      withDirectives(createVNode("select", {
                        "onUpdate:modelValue": ($event) => formData[field.id] = $event,
                        class: "w-full px-3 py-2 rounded-lg border border-gray-200 bg-gray-50 focus:ring-2 focus:ring-blue-200 focus:border-blue-400 transition"
                      }, [
                        (openBlock(true), createBlock(Fragment, null, renderList(getOptions(field), (opt) => {
                          return openBlock(), createBlock("option", {
                            key: opt,
                            value: opt
                          }, toDisplayString(opt), 9, ["value"]);
                        }), 128))
                      ], 8, ["onUpdate:modelValue"]), [
                        [vModelSelect, formData[field.id]]
                      ])
                    ])) : field.type === "radio" ? (openBlock(), createBlock("div", { key: 5 }, [
                      createVNode("label", { class: "block text-xs font-bold text-gray-600 mb-1" }, toDisplayString(field.label), 1),
                      createTextVNode(),
                      createVNode("div", { class: "flex flex-col gap-2" }, [
                        (openBlock(true), createBlock(Fragment, null, renderList(getOptions(field), (opt) => {
                          return openBlock(), createBlock("label", {
                            key: opt,
                            class: "flex items-center gap-2 cursor-pointer"
                          }, [
                            withDirectives(createVNode("input", {
                              type: "radio",
                              name: "radio_" + field.id,
                              value: opt,
                              "onUpdate:modelValue": ($event) => formData[field.id] = $event,
                              class: "accent-blue-600"
                            }, null, 8, ["name", "value", "onUpdate:modelValue"]), [
                              [vModelRadio, formData[field.id]]
                            ]),
                            createTextVNode(),
                            createVNode("span", { class: "text-xs" }, toDisplayString(opt), 1)
                          ]);
                        }), 128))
                      ])
                    ])) : field.type === "checkboxes" ? (openBlock(), createBlock("div", { key: 6 }, [
                      createVNode("label", { class: "block text-xs font-bold text-gray-600 mb-1" }, toDisplayString(field.label), 1),
                      createTextVNode(),
                      createVNode("div", { class: "flex flex-col gap-2" }, [
                        (openBlock(true), createBlock(Fragment, null, renderList(getOptions(field), (opt) => {
                          return openBlock(), createBlock("label", {
                            key: opt,
                            class: "flex items-center gap-2 cursor-pointer"
                          }, [
                            withDirectives(createVNode("input", {
                              type: "checkbox",
                              value: opt,
                              "onUpdate:modelValue": ($event) => formData[field.id] = $event,
                              class: "accent-blue-600"
                            }, null, 8, ["value", "onUpdate:modelValue"]), [
                              [vModelCheckbox, formData[field.id]]
                            ]),
                            createTextVNode(),
                            createVNode("span", { class: "text-xs" }, toDisplayString(opt), 1)
                          ]);
                        }), 128))
                      ])
                    ])) : field.type === "file" ? (openBlock(), createBlock("div", { key: 7 }, [
                      createVNode("label", { class: "block text-xs font-bold text-gray-600 mb-1" }, toDisplayString(field.label), 1),
                      createTextVNode(),
                      createVNode("input", {
                        type: "file",
                        onChange: (e) => formData[field.id] = e.target.files[0],
                        class: "w-full file:mr-2 file:py-1 file:px-3 file:rounded-lg file:border-0 file:bg-blue-50 file:text-blue-700"
                      }, null, 40, ["onChange"]),
                      createTextVNode(),
                      formData[field.id] ? (openBlock(), createBlock("span", {
                        key: 0,
                        class: "text-xs text-gray-500 mt-1 block"
                      }, toDisplayString((_a = formData[field.id]) == null ? void 0 : _a.name), 1)) : createCommentVNode("", true)
                    ])) : field.type === "textarea" ? (openBlock(), createBlock("div", { key: 8 }, [
                      createVNode("label", { class: "block text-xs font-bold text-gray-600 mb-1" }, toDisplayString(field.label), 1),
                      createTextVNode(),
                      withDirectives(createVNode("textarea", {
                        "onUpdate:modelValue": ($event) => formData[field.id] = $event,
                        placeholder: field.placeholder,
                        rows: "3",
                        class: "w-full px-3 py-2 rounded-lg border border-gray-200 bg-gray-50 focus:ring-2 focus:ring-blue-200 focus:border-blue-400 transition"
                      }, null, 8, ["onUpdate:modelValue", "placeholder"]), [
                        [vModelText, formData[field.id]]
                      ])
                    ])) : field.type === "checkbox" ? (openBlock(), createBlock("div", { key: 9 }, [
                      createVNode("label", { class: "flex items-center gap-2 cursor-pointer" }, [
                        withDirectives(createVNode("input", {
                          "onUpdate:modelValue": ($event) => formData[field.id] = $event,
                          type: "checkbox",
                          class: "rounded border-gray-300 accent-blue-600"
                        }, null, 8, ["onUpdate:modelValue"]), [
                          [vModelCheckbox, formData[field.id]]
                        ]),
                        createTextVNode(),
                        createVNode("span", { class: "text-xs" }, toDisplayString(field.label || field.placeholder || "\u062A\u06CC\u06A9 \u0628\u0632\u0646\u06CC\u062F"), 1)
                      ])
                    ])) : createCommentVNode("", true)
                  ], 64);
                }), 128)),
                createTextVNode(),
                createVNode("button", {
                  type: "submit",
                  class: "w-full mt-6 py-3 bg-black text-white rounded-lg text-base font-bold hover:bg-gray-700 transition flex items-center justify-center gap-2"
                }, [
                  createVNode("i", { class: "ti ti-send" }),
                  createTextVNode(" " + toDisplayString(__props.link.submitButtonText || "\u0627\u0631\u0633\u0627\u0644"), 1)
                ]),
                createTextVNode(),
                success.value ? (openBlock(), createBlock("div", {
                  key: 0,
                  class: "bg-green-100 text-green-700 p-3 rounded-lg text-center mt-4"
                }, toDisplayString(__props.link.thankYouMessage || "\u0641\u0631\u0645 \u0628\u0627 \u0645\u0648\u0641\u0642\u06CC\u062A \u0627\u0631\u0633\u0627\u0644 \u0634\u062F!"), 1)) : createCommentVNode("", true)
              ], 32)
            ];
          }
        }),
        _: 1
      }, _parent));
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
const _sfc_setup$4 = _sfc_main$4.setup;
_sfc_main$4.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/UserDashboard/main/EditCard/Preview/items/builder.vue");
  return _sfc_setup$4 ? _sfc_setup$4(props, ctx) : void 0;
};
const builder = /* @__PURE__ */ _export_sfc(_sfc_main$4, [["__scopeId", "data-v-5a674bb6"]]);
const _sfc_main$3 = {
  __name: "textsection",
  __ssrInlineRender: true,
  props: {
    link: { type: Object, required: false },
    align: { type: String, default: "right" },
    formData: { type: Object, default: () => ({}) },
    isDarkTheme: { type: Boolean, default: false }
  },
  setup(__props) {
    const store = useFormStore();
    const props = __props;
    const link = computed(() => props.link);
    const getCurrentAlign = () => {
      var _a;
      if (((_a = props.formData) == null ? void 0 : _a.layout) === "left") {
        const originalAlign = props.link ? props.link.align : store.textsection.align || props.align;
        if (originalAlign === "right") return "left";
        if (originalAlign === "left") return "right";
        return originalAlign;
      }
      return props.link ? props.link.align : store.textsection.align || props.align;
    };
    function alignClass(val) {
      if (val === "center") return "text-center";
      if (val === "left") return "text-left";
      return "text-right";
    }
    return (_ctx, _push, _parent, _attrs) => {
      var _a;
      _push(`<div${ssrRenderAttrs(mergeProps({
        class: ["w-full py-3 flex items-center px-2", {
          "justify-start": getCurrentAlign() === "right",
          "justify-end": getCurrentAlign() === "left",
          "justify-center": getCurrentAlign() === "center"
        }],
        dir: ((_a = __props.formData) == null ? void 0 : _a.layout) === "left" ? "ltr" : "rtl"
      }, _attrs))}><div class="flex-1 items-center">`);
      if (link.value && link.value.title || !link.value && unref(store).textsection.title) {
        _push(`<div class="${ssrRenderClass(["font-bold text-lg", alignClass(getCurrentAlign()), __props.isDarkTheme ? "text-white" : "text-gray-800"])}">${ssrInterpolate(link.value ? link.value.title : unref(store).textsection.title)}</div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div></div>`);
    };
  }
};
const _sfc_setup$3 = _sfc_main$3.setup;
_sfc_main$3.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/UserDashboard/main/EditCard/Preview/items/textsection.vue");
  return _sfc_setup$3 ? _sfc_setup$3(props, ctx) : void 0;
};
const _sfc_main$2 = /* @__PURE__ */ defineComponent({
  __name: "map",
  __ssrInlineRender: true,
  props: {
    item: {},
    link: {},
    isActive: { type: Boolean },
    isDisabled: { type: Boolean },
    iconBg: {}
  },
  emits: ["click"],
  setup(__props) {
    const { getIconComponent } = useIconComponents();
    const formStore = useFormStore();
    const props = __props;
    const showMapOptions = ref(false);
    const isMobile = ref(false);
    const mapData = computed(() => props.item || props.link);
    computed(() => {
      var _a;
      if (props.iconBg && props.iconBg !== "#000000" && props.iconBg !== "transparent") {
        return props.iconBg;
      }
      if (((_a = formStore.iconColor) == null ? void 0 : _a.background) && formStore.iconColor.background !== "transparent") {
        return formStore.iconColor.background;
      }
      return "#e74c3c";
    });
    computed(() => {
      var _a;
      const icon = (_a = mapData.value) == null ? void 0 : _a.icon;
      if (!icon) return null;
      if (typeof icon === "string") {
        return getIconComponent(icon);
      }
      if (typeof icon === "object" && icon.type === "component") {
        return getIconComponent(icon.path || icon.url || "");
      }
      return null;
    });
    const googleMapsUrl = computed(() => {
      var _a, _b;
      const lat = ((_a = mapData.value) == null ? void 0 : _a.latitude) || 35.6992;
      const lng = ((_b = mapData.value) == null ? void 0 : _b.longitude) || 51.389;
      return `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}&travelmode=driving`;
    });
    const wazeUrl = computed(() => {
      var _a, _b;
      const lat = ((_a = mapData.value) == null ? void 0 : _a.latitude) || 35.6992;
      const lng = ((_b = mapData.value) == null ? void 0 : _b.longitude) || 51.389;
      return `https://waze.com/ul?ll=${lat},${lng}&navigate=yes`;
    });
    const neshanUrl = computed(() => {
      var _a, _b;
      const lat = ((_a = mapData.value) == null ? void 0 : _a.latitude) || 35.6992;
      const lng = ((_b = mapData.value) == null ? void 0 : _b.longitude) || 51.389;
      return `https://neshan.org/maps/@${lat},${lng},16z/directions/~/${lat},${lng}`;
    });
    async function copyCoordinates() {
      var _a, _b;
      const lat = ((_a = mapData.value) == null ? void 0 : _a.latitude) || 35.6992;
      const lng = ((_b = mapData.value) == null ? void 0 : _b.longitude) || 51.389;
      const coords = `${lat}, ${lng}`;
      try {
        await (void 0).clipboard.writeText(coords);
      } catch (err) {
        console.error("Failed to copy coordinates:", err);
      }
      showMapOptions.value = false;
    }
    return (_ctx, _push, _parent, _attrs) => {
      var _a;
      const _component_ClientOnly = __nuxt_component_0$3;
      _push(`<!--[--><div class="relative my-4 rounded-xl overflow-hidden transition duration-200 group cursor-pointer" data-v-9445c8c8><div class="h-40 rounded-xl overflow-hidden relative border border-black/10 shadow-sm" data-v-9445c8c8>`);
      _push(ssrRenderComponent(_component_ClientOnly, null, {
        fallback: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="h-full bg-gray-100 flex items-center justify-center" data-v-9445c8c8${_scopeId}><div class="text-center text-gray-400" data-v-9445c8c8${_scopeId}><i class="ti ti-map text-3xl mb-2 block" data-v-9445c8c8${_scopeId}></i> <p class="text-xs" data-v-9445c8c8${_scopeId}>\u067E\u06CC\u0634\u200C\u0646\u0645\u0627\u06CC\u0634 \u0646\u0642\u0634\u0647</p></div></div>`);
          } else {
            return [
              createVNode("div", { class: "h-full bg-gray-100 flex items-center justify-center" }, [
                createVNode("div", { class: "text-center text-gray-400" }, [
                  createVNode("i", { class: "ti ti-map text-3xl mb-2 block" }),
                  createTextVNode(),
                  createVNode("p", { class: "text-xs" }, "\u067E\u06CC\u0634\u200C\u0646\u0645\u0627\u06CC\u0634 \u0646\u0642\u0634\u0647")
                ])
              ])
            ];
          }
        })
      }, _parent));
      _push(` <div class="absolute inset-0 bg-transparent cursor-pointer" title="\u06A9\u0644\u06CC\u06A9 \u0628\u0631\u0627\u06CC \u0645\u0633\u06CC\u0631\u06CC\u0627\u0628\u06CC" data-v-9445c8c8></div></div></div> `);
      _push(ssrRenderComponent(__nuxt_component_0, {
        modelValue: showMapOptions.value,
        "onUpdate:modelValue": ($event) => showMapOptions.value = $event,
        title: ((_a = mapData.value) == null ? void 0 : _a.title) || "\u0645\u0633\u06CC\u0631\u06CC\u0627\u0628\u06CC",
        size: "auto",
        closable: true
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          var _a2, _b, _c, _d, _e, _f, _g, _h, _i, _j;
          if (_push2) {
            _push2(`<div class="p-4 space-y-3" data-v-9445c8c8${_scopeId}>`);
            if ((_a2 = mapData.value) == null ? void 0 : _a2.address) {
              _push2(`<div class="bg-muted/50 rounded-xl p-3 mb-4" data-v-9445c8c8${_scopeId}><div class="flex items-start gap-2" data-v-9445c8c8${_scopeId}><i class="ti ti-map-pin text-primary mt-0.5" data-v-9445c8c8${_scopeId}></i> <p class="text-sm text-foreground leading-relaxed" data-v-9445c8c8${_scopeId}>${ssrInterpolate(mapData.value.address)}</p></div></div>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(` <p class="text-sm text-muted-foreground text-center mb-4" data-v-9445c8c8${_scopeId}>\u0645\u0633\u06CC\u0631 \u0631\u0627 \u0628\u0627 \u06A9\u062F\u0627\u0645 \u0627\u067E\u0644\u06CC\u06A9\u06CC\u0634\u0646 \u0628\u0628\u06CC\u0646\u06CC\u062F\u061F</p> <a${ssrRenderAttr("href", googleMapsUrl.value)} target="_blank" rel="noopener noreferrer" class="w-full flex items-center gap-3 p-3 rounded-xl border border-border hover:bg-muted transition-colors" data-v-9445c8c8${_scopeId}><div class="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center" data-v-9445c8c8${_scopeId}><i class="ti ti-brand-google text-green-600 text-xl" data-v-9445c8c8${_scopeId}></i></div> <div class="flex-1 text-right" data-v-9445c8c8${_scopeId}><p class="font-medium text-foreground" data-v-9445c8c8${_scopeId}>Google Maps</p> <p class="text-xs text-muted-foreground" data-v-9445c8c8${_scopeId}>\u0645\u0633\u06CC\u0631\u06CC\u0627\u0628\u06CC \u0628\u0627 \u06AF\u0648\u06AF\u0644 \u0645\u067E</p></div> <i class="ti ti-route text-muted-foreground" data-v-9445c8c8${_scopeId}></i></a> `);
            if (isMobile.value) {
              _push2(`<a${ssrRenderAttr("href", wazeUrl.value)} target="_blank" rel="noopener noreferrer" class="w-full flex items-center gap-3 p-3 rounded-xl border border-border hover:bg-muted transition-colors" data-v-9445c8c8${_scopeId}><div class="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center" data-v-9445c8c8${_scopeId}><i class="ti ti-brand-waze text-blue-600 text-xl" data-v-9445c8c8${_scopeId}></i></div> <div class="flex-1 text-right" data-v-9445c8c8${_scopeId}><p class="font-medium text-foreground" data-v-9445c8c8${_scopeId}>Waze</p> <p class="text-xs text-muted-foreground" data-v-9445c8c8${_scopeId}>\u0645\u0633\u06CC\u0631\u06CC\u0627\u0628\u06CC \u0628\u0627 \u0648\u06CC\u0632</p></div> <i class="ti ti-route text-muted-foreground" data-v-9445c8c8${_scopeId}></i></a>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(` <a${ssrRenderAttr("href", neshanUrl.value)} target="_blank" rel="noopener noreferrer" class="w-full flex items-center gap-3 p-3 rounded-xl border border-border hover:bg-muted transition-colors" data-v-9445c8c8${_scopeId}><div class="w-10 h-10 rounded-lg bg-orange-100 flex items-center justify-center" data-v-9445c8c8${_scopeId}><i class="ti ti-map-2 text-orange-600 text-xl" data-v-9445c8c8${_scopeId}></i></div> <div class="flex-1 text-right" data-v-9445c8c8${_scopeId}><p class="font-medium text-foreground" data-v-9445c8c8${_scopeId}>\u0646\u0634\u0627\u0646</p> <p class="text-xs text-muted-foreground" data-v-9445c8c8${_scopeId}>\u0645\u0633\u06CC\u0631\u06CC\u0627\u0628\u06CC \u0628\u0627 \u0646\u0634\u0627\u0646</p></div> <i class="ti ti-route text-muted-foreground" data-v-9445c8c8${_scopeId}></i></a> <button class="w-full flex items-center gap-3 p-3 rounded-xl border border-border hover:bg-muted transition-colors" data-v-9445c8c8${_scopeId}><div class="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center" data-v-9445c8c8${_scopeId}><i class="ti ti-copy text-gray-600 text-xl" data-v-9445c8c8${_scopeId}></i></div> <div class="flex-1 text-right" data-v-9445c8c8${_scopeId}><p class="font-medium text-foreground" data-v-9445c8c8${_scopeId}>\u06A9\u067E\u06CC \u0645\u062E\u062A\u0635\u0627\u062A</p> <p class="text-xs text-muted-foreground" data-v-9445c8c8${_scopeId}>${ssrInterpolate((_c = (_b = mapData.value) == null ? void 0 : _b.latitude) == null ? void 0 : _c.toFixed(6))}, ${ssrInterpolate((_e = (_d = mapData.value) == null ? void 0 : _d.longitude) == null ? void 0 : _e.toFixed(6))}</p></div></button></div>`);
          } else {
            return [
              createVNode("div", { class: "p-4 space-y-3" }, [
                ((_f = mapData.value) == null ? void 0 : _f.address) ? (openBlock(), createBlock("div", {
                  key: 0,
                  class: "bg-muted/50 rounded-xl p-3 mb-4"
                }, [
                  createVNode("div", { class: "flex items-start gap-2" }, [
                    createVNode("i", { class: "ti ti-map-pin text-primary mt-0.5" }),
                    createTextVNode(),
                    createVNode("p", { class: "text-sm text-foreground leading-relaxed" }, toDisplayString(mapData.value.address), 1)
                  ])
                ])) : createCommentVNode("", true),
                createTextVNode(),
                createVNode("p", { class: "text-sm text-muted-foreground text-center mb-4" }, "\u0645\u0633\u06CC\u0631 \u0631\u0627 \u0628\u0627 \u06A9\u062F\u0627\u0645 \u0627\u067E\u0644\u06CC\u06A9\u06CC\u0634\u0646 \u0628\u0628\u06CC\u0646\u06CC\u062F\u061F"),
                createTextVNode(),
                createVNode("a", {
                  href: googleMapsUrl.value,
                  target: "_blank",
                  rel: "noopener noreferrer",
                  onClick: ($event) => showMapOptions.value = false,
                  class: "w-full flex items-center gap-3 p-3 rounded-xl border border-border hover:bg-muted transition-colors"
                }, [
                  createVNode("div", { class: "w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center" }, [
                    createVNode("i", { class: "ti ti-brand-google text-green-600 text-xl" })
                  ]),
                  createTextVNode(),
                  createVNode("div", { class: "flex-1 text-right" }, [
                    createVNode("p", { class: "font-medium text-foreground" }, "Google Maps"),
                    createTextVNode(),
                    createVNode("p", { class: "text-xs text-muted-foreground" }, "\u0645\u0633\u06CC\u0631\u06CC\u0627\u0628\u06CC \u0628\u0627 \u06AF\u0648\u06AF\u0644 \u0645\u067E")
                  ]),
                  createTextVNode(),
                  createVNode("i", { class: "ti ti-route text-muted-foreground" })
                ], 8, ["href", "onClick"]),
                createTextVNode(),
                isMobile.value ? (openBlock(), createBlock("a", {
                  key: 1,
                  href: wazeUrl.value,
                  target: "_blank",
                  rel: "noopener noreferrer",
                  onClick: ($event) => showMapOptions.value = false,
                  class: "w-full flex items-center gap-3 p-3 rounded-xl border border-border hover:bg-muted transition-colors"
                }, [
                  createVNode("div", { class: "w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center" }, [
                    createVNode("i", { class: "ti ti-brand-waze text-blue-600 text-xl" })
                  ]),
                  createTextVNode(),
                  createVNode("div", { class: "flex-1 text-right" }, [
                    createVNode("p", { class: "font-medium text-foreground" }, "Waze"),
                    createTextVNode(),
                    createVNode("p", { class: "text-xs text-muted-foreground" }, "\u0645\u0633\u06CC\u0631\u06CC\u0627\u0628\u06CC \u0628\u0627 \u0648\u06CC\u0632")
                  ]),
                  createTextVNode(),
                  createVNode("i", { class: "ti ti-route text-muted-foreground" })
                ], 8, ["href", "onClick"])) : createCommentVNode("", true),
                createTextVNode(),
                createVNode("a", {
                  href: neshanUrl.value,
                  target: "_blank",
                  rel: "noopener noreferrer",
                  onClick: ($event) => showMapOptions.value = false,
                  class: "w-full flex items-center gap-3 p-3 rounded-xl border border-border hover:bg-muted transition-colors"
                }, [
                  createVNode("div", { class: "w-10 h-10 rounded-lg bg-orange-100 flex items-center justify-center" }, [
                    createVNode("i", { class: "ti ti-map-2 text-orange-600 text-xl" })
                  ]),
                  createTextVNode(),
                  createVNode("div", { class: "flex-1 text-right" }, [
                    createVNode("p", { class: "font-medium text-foreground" }, "\u0646\u0634\u0627\u0646"),
                    createTextVNode(),
                    createVNode("p", { class: "text-xs text-muted-foreground" }, "\u0645\u0633\u06CC\u0631\u06CC\u0627\u0628\u06CC \u0628\u0627 \u0646\u0634\u0627\u0646")
                  ]),
                  createTextVNode(),
                  createVNode("i", { class: "ti ti-route text-muted-foreground" })
                ], 8, ["href", "onClick"]),
                createTextVNode(),
                createVNode("button", {
                  onClick: copyCoordinates,
                  class: "w-full flex items-center gap-3 p-3 rounded-xl border border-border hover:bg-muted transition-colors"
                }, [
                  createVNode("div", { class: "w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center" }, [
                    createVNode("i", { class: "ti ti-copy text-gray-600 text-xl" })
                  ]),
                  createTextVNode(),
                  createVNode("div", { class: "flex-1 text-right" }, [
                    createVNode("p", { class: "font-medium text-foreground" }, "\u06A9\u067E\u06CC \u0645\u062E\u062A\u0635\u0627\u062A"),
                    createTextVNode(),
                    createVNode("p", { class: "text-xs text-muted-foreground" }, toDisplayString((_h = (_g = mapData.value) == null ? void 0 : _g.latitude) == null ? void 0 : _h.toFixed(6)) + ", " + toDisplayString((_j = (_i = mapData.value) == null ? void 0 : _i.longitude) == null ? void 0 : _j.toFixed(6)), 1)
                  ])
                ])
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
const _sfc_setup$2 = _sfc_main$2.setup;
_sfc_main$2.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/UserDashboard/main/EditCard/Preview/items/map.vue");
  return _sfc_setup$2 ? _sfc_setup$2(props, ctx) : void 0;
};
const map = /* @__PURE__ */ _export_sfc(_sfc_main$2, [["__scopeId", "data-v-9445c8c8"]]);
const PreviewItems = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  bankcard,
  basicblock: _sfc_main$6,
  basiclink: _sfc_main$5,
  builder,
  contactcard: _sfc_main$h,
  embeddedvideo,
  expandabletext,
  featuredlink: _sfc_main$f,
  file: _sfc_main$g,
  luckydice,
  luckyegg: _sfc_main$9,
  luckywheel,
  map,
  poll,
  questionbox,
  textsection: _sfc_main$3,
  workhours: _sfc_main$7
}, Symbol.toStringTag, { value: "Module" }));
const _sfc_main$1 = /* @__PURE__ */ defineComponent({
  __name: "FormField",
  __ssrInlineRender: true,
  props: {
    field: {},
    modelValue: { type: [String, Boolean, null] },
    previewSrc: {},
    error: {}
  },
  emits: ["update:modelValue", "update:previewSrc"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emit = __emit;
    const fileName = ref("");
    const isDropdownOpen = ref(false);
    const dropdownRef = ref(null);
    const modelValue = computed({
      get: () => props.modelValue,
      set: (val) => emit("update:modelValue", val)
    });
    watch(modelValue, (val) => {
      if (val instanceof File) {
        fileName.value = val.name;
      }
      emit("update:modelValue", val);
    });
    const previewUrl = computed(() => props.previewSrc || "");
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({
        class: "mb-1.5 relative",
        ref_key: "dropdownRef",
        ref: dropdownRef
      }, _attrs))}>`);
      if (_ctx.field.type === "text") {
        _push(`<div><input${ssrRenderAttr("value", modelValue.value)} type="text" class="${ssrRenderClass([_ctx.error ? "border-red-500 bg-red-50" : "border-gray-300", "w-full border rounded-md px-3 py-1.5 text-xs text-right text-gray-700 placeholder-gray-400 transition-colors"])}"${ssrRenderAttr("placeholder", _ctx.field.label + (_ctx.field.required ? " *" : ""))}${ssrIncludeBooleanAttr(_ctx.field.required) ? " required" : ""}> `);
        if (_ctx.error) {
          _push(`<p class="text-red-500 text-[10px] mt-0.5 text-right">${ssrInterpolate(_ctx.error)}</p>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div>`);
      } else if (_ctx.field.type === "dropdown") {
        _push(`<div class="relative"><div class="${ssrRenderClass([_ctx.error ? "border-red-500 bg-red-50 text-gray-600" : "border-gray-300 text-gray-600", "w-full border rounded-md px-3 py-1.5 text-xs text-right cursor-pointer flex justify-between items-center transition-colors"])}"><span>${ssrInterpolate(modelValue.value || _ctx.field.label + (_ctx.field.required ? " *" : ""))}</span> <i class="ti ti-chevron-down text-gray-500 text-sm"></i></div> `);
        if (isDropdownOpen.value) {
          _push(`<ul class="absolute z-10 mt-1 w-full bg-white border border-gray-200 text-gray-700 rounded-md shadow-sm text-xs text-right"><!--[-->`);
          ssrRenderList(_ctx.field.options || [], (opt, i) => {
            _push(`<li class="px-3 py-2 hover:bg-gray-100 cursor-pointer">${ssrInterpolate(opt)}</li>`);
          });
          _push(`<!--]--></ul>`);
        } else {
          _push(`<!---->`);
        }
        _push(` `);
        if (_ctx.error) {
          _push(`<p class="text-red-500 text-[10px] mt-0.5 text-right">${ssrInterpolate(_ctx.error)}</p>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div>`);
      } else if (_ctx.field.type === "checkbox") {
        _push(`<label class="flex items-center gap-2 cursor-pointer"><input type="checkbox"${ssrIncludeBooleanAttr(Array.isArray(modelValue.value) ? ssrLooseContain(modelValue.value, null) : modelValue.value) ? " checked" : ""}${ssrIncludeBooleanAttr(_ctx.field.required) ? " required" : ""} class="w-4 h-4"> <span class="text-xs text-gray-600">${ssrInterpolate(_ctx.field.label)}</span></label>`);
      } else if (_ctx.field.type === "file") {
        _push(`<div class="flex flex-col gap-1"><div class="flex items-center gap-3 w-full"><label${ssrRenderAttr("for", `fileInput-${_ctx.field.id}`)} class="${ssrRenderClass([_ctx.error ? "text-red-600 border-red-400 bg-red-50" : "text-gray-700 border-gray-300", "inline-flex items-center gap-1 px-3 py-1.5 text-xs border-2 border-dotted rounded-md cursor-pointer w-full transition-colors"])}"><i class="ti ti-upload text-sm"></i> ${ssrInterpolate(_ctx.field.label)}${ssrInterpolate(_ctx.field.required ? " *" : "")}</label> `);
        if (previewUrl.value) {
          _push(`<img${ssrRenderAttr("src", previewUrl.value)} alt="\u062A\u0635\u0648\u06CC\u0631 \u062C\u062F\u06CC\u062F" class="h-[40px] w-auto rounded border border-gray-300 object-cover">`);
        } else if (typeof modelValue.value === "string" && modelValue.value.startsWith("http")) {
          _push(`<img${ssrRenderAttr("src", modelValue.value)} alt="\u062A\u0635\u0648\u06CC\u0631 \u0642\u0628\u0644\u06CC" class="h-[40px] w-auto rounded border border-gray-300 object-cover">`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div> <input${ssrRenderAttr("id", `fileInput-${_ctx.field.id}`)} type="file"${ssrIncludeBooleanAttr(_ctx.field.required) ? " required" : ""} class="hidden"> `);
        if (fileName.value) {
          _push(`<span class="text-xs text-gray-500">${ssrInterpolate(fileName.value)}</span>`);
        } else {
          _push(`<!---->`);
        }
        _push(` `);
        if (_ctx.error) {
          _push(`<p class="text-red-500 text-[10px] mt-0.5 text-right">${ssrInterpolate(_ctx.error)}</p>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div>`);
    };
  }
});
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/UserDashboard/main/EditCard/Preview/layouts/FormField.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "LayoutLeadForm",
  __ssrInlineRender: true,
  props: {
    cardId: String,
    slug: String,
    isDefault: {
      type: String,
      default: "0"
    }
  },
  emits: ["close"],
  setup(__props, { emit: __emit }) {
    const loading = ref(false);
    const { $axios } = useNuxtApp();
    const showToast = ref(false);
    const previewMap = reactive({});
    const toastMessage = ref("");
    const toastIcon = ref("ti-alert-triangle");
    const formStore = useFormStore();
    const formValues = reactive({});
    const formErrors = reactive({});
    const defaultFields = [
      { id: "1", type: "text", label: "\u0646\u0627\u0645", name: "fullName", required: true },
      { id: "2", type: "text", label: "\u0627\u06CC\u0645\u06CC\u0644", name: "email", required: false },
      { id: "3", type: "text", label: "\u0634\u0645\u0627\u0631\u0647 \u062A\u0645\u0627\u0633", name: "phoneNumber", required: true }
    ];
    const safeFields = computed(() => {
      try {
        const fields = formStore.fields || defaultFields;
        return Array.isArray(fields) ? fields : defaultFields;
      } catch {
        return defaultFields;
      }
    });
    const headerColor = computed(() => {
      var _a;
      const color = (_a = formStore.iconColor) == null ? void 0 : _a.background;
      if (!color || color === "transparent" || color === "#ffffff" || color === "#FFFFFF" || color === "white") {
        return "#000000";
      }
      return color;
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "flex items-center justify-center" }, _attrs))}>`);
      _push(ssrRenderComponent(InfoToast, {
        visible: unref(showToast),
        message: unref(toastMessage),
        icon: unref(toastIcon)
      }, null, _parent));
      _push(` <div class="relative w-full max-w-full m-4 bg-white rounded-2xl shadow-lg overflow-hidden"><button class="absolute top-3 left-3 p-2 text-white hover:text-gray-100 bg-black/30 hover:bg-black/40 rounded-full w-5 h-5 flex items-center justify-center z-10 transition"><i class="ti ti-x text-base"></i></button> <div class="px-6 py-3" style="${ssrRenderStyle({ backgroundColor: headerColor.value })}"><h3 class="text-lg font-semibold text-white">${ssrInterpolate(unref(formStore).formTitle || "\u0641\u0631\u0645 \u062A\u0645\u0627\u0633")}</h3></div> <div class="p-6 space-y-4 max-h-[70vh] overflow-y-auto">`);
      if (safeFields.value.length > 0) {
        _push(`<div><!--[-->`);
        ssrRenderList(safeFields.value, (field) => {
          _push(ssrRenderComponent(_sfc_main$1, {
            key: field.id,
            field,
            modelValue: unref(formValues)[field.name],
            "onUpdate:modelValue": ($event) => unref(formValues)[field.name] = $event,
            previewSrc: field.type === "file" ? unref(previewMap)[field.id] || "" : "",
            error: unref(formErrors)[field.name],
            "onUpdate:previewSrc": (val) => unref(previewMap)[field.id] = val || ""
          }, null, _parent));
        });
        _push(`<!--]--></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(` <button class="relative w-full py-2 px-4 rounded-md text-white font-medium transition duration-200 flex items-center justify-center" style="${ssrRenderStyle({ backgroundColor: headerColor.value, opacity: unref(loading) ? 0.8 : 1 })}"${ssrIncludeBooleanAttr(unref(loading)) ? " disabled" : ""}>`);
      if (!unref(loading)) {
        _push(`<span>${ssrInterpolate(unref(formStore).connectButtonText || "\u0627\u0631\u0633\u0627\u0644")}</span>`);
      } else {
        _push(`<svg class="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle> <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path></svg>`);
      }
      _push(`</button> <p class="text-xs text-gray-500 text-center">${ssrInterpolate(unref(formStore).formDisclaimer || "\u0627\u0637\u0644\u0627\u0639\u0627\u062A \u0634\u0645\u0627 \u0645\u062D\u0631\u0645\u0627\u0646\u0647 \u0645\u06CC\u200C\u0645\u0627\u0646\u062F")}</p></div></div></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/UserDashboard/main/EditCard/Preview/layouts/LayoutLeadForm.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { PreviewItems as P, _imports_1 as _, _imports_0 as a, _sfc_main as b, _sfc_main$6 as c, _sfc_main$5 as d, useAsyncData as u };
//# sourceMappingURL=LayoutLeadForm-Rod-lE9A.mjs.map
