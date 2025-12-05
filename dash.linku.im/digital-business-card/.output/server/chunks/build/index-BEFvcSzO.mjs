import { defineComponent, computed, ref, reactive, watch, nextTick, mergeProps, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderStyle, ssrIncludeBooleanAttr, ssrRenderList, ssrRenderClass, ssrRenderAttr, ssrInterpolate, ssrRenderComponent } from 'vue/server-renderer';
import { useRouter } from 'vue-router';
import QRCode from 'qrcode';
import { I as ImageCropperModal } from './ImageCropperModal-BfuAYe_c.mjs';
import { u as useUserStore } from './user-D1YL8aKq.mjs';
import { u as useFormStore } from './form-CUJQskNk.mjs';
import { a as useNuxtApp } from './server.mjs';
import { _ as _export_sfc } from './_plugin-vue_export-helper-1tPrXgE0.mjs';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "CustomizeQRPage",
  __ssrInlineRender: true,
  setup(__props) {
    useRouter();
    const userStore = useUserStore();
    const formStore = useFormStore();
    const { $axios } = useNuxtApp();
    const subscriptionStatus = computed(() => ({
      isActive: userStore.isUserPro
    }));
    const isLoading = ref(false);
    const showSuccessToast = ref(false);
    const successMessage = ref("\u062A\u0646\u0638\u06CC\u0645\u0627\u062A \u06A9\u06CC\u0648\u0622\u0631 \u06A9\u062F \u0630\u062E\u06CC\u0631\u0647 \u0634\u062F!");
    ref(false);
    ref(247);
    ref(1543);
    const uploadedLogo = ref(null);
    ref("#000000");
    const showColorPicker = ref(false);
    const qrCanvas = ref(null);
    const qrCanvasDesktop = ref(null);
    const showCropperModal = ref(false);
    const tempImageFile = ref(null);
    const showFormatModal = ref(false);
    const qrData = computed(() => {
      var _a, _b;
      const username = ((_a = userStore.user) == null ? void 0 : _a.userName) || ((_b = userStore.user) == null ? void 0 : _b.username);
      return username ? `https://linku.im/${username}` : "https://linku.im";
    });
    const activeCard = computed(() => {
      var _a;
      return formStore.defaultCard || ((_a = formStore.cards) == null ? void 0 : _a[0]);
    });
    const getIconColor = () => {
      var _a;
      if (formStore.matchThemeColor) {
        const bg = (_a = formStore.themeColor) == null ? void 0 : _a.background;
        if (bg && bg !== "transparent" && bg.startsWith("#")) {
          console.log("Using themeColor (matchThemeColor):", bg);
          return bg;
        }
      }
      const iconColor = formStore.iconColor;
      console.log("getIconColor - formStore.iconColor:", iconColor);
      if (iconColor && typeof iconColor === "object") {
        if (iconColor.background && iconColor.background !== "transparent" && iconColor.background.startsWith("#")) {
          console.log("Using iconColor.background:", iconColor.background);
          return iconColor.background;
        }
      }
      if (typeof iconColor === "string" && iconColor.startsWith("#")) {
        return iconColor;
      }
      return "#000000";
    };
    const selectedOptions = reactive({
      style: "square",
      foregroundColor: "#000000",
      backgroundColor: "#ffffff",
      showLogo: true,
      size: "medium",
      format: "png"
    });
    watch(() => formStore.iconColor, (newIconColor) => {
      console.log("iconColor changed:", newIconColor);
      const card = activeCard.value;
      if (!(card == null ? void 0 : card.qrColor) && !formStore.qrColor) {
        selectedOptions.foregroundColor = getIconColor();
      }
    }, { immediate: true, deep: true });
    watch(activeCard, (card) => {
      if (card) {
        console.log("activeCard changed:", card);
        if (card.qrColor) {
          selectedOptions.foregroundColor = card.qrColor;
        } else {
          selectedOptions.foregroundColor = getIconColor();
        }
        if (card.qrBgColor) {
          selectedOptions.backgroundColor = card.qrBgColor;
        }
      }
    }, { immediate: true });
    const themeColors = [
      // { value: '#000000' }, // Black
      { value: "#FF69B4" },
      // Pink  
      { value: "#FF6347" },
      // Orange-Red
      { value: "#FFD700" },
      // Gold
      { value: "#ADFF2F" },
      // Green-Yellow
      // { value: '#00FF7F' }, // Spring Green
      { value: "#00BFFF" }
      // Deep Sky Blue
      // { value: '#8A2BE2' }  // Blue Violet
    ];
    const handleCroppedImage = (imageUrl, fieldName) => {
      console.log("Cropped image received:", imageUrl);
      uploadedLogo.value = imageUrl;
      selectedOptions.showLogo = true;
      showCropperModal.value = false;
    };
    const handleCropperCancel = () => {
      console.log("Cropper cancelled");
      showCropperModal.value = false;
      tempImageFile.value = null;
      const fileInput = (void 0).getElementById("logoUpload");
      if (fileInput) {
        fileInput.value = "";
      }
    };
    const convertHslToHex = (hslString) => {
      const match = hslString.match(/hsl\((\d+),\s*(\d+)%,\s*(\d+)%\)/);
      if (!match) return "#000000";
      const h = parseInt(match[1]) / 360;
      const s = parseInt(match[2]) / 100;
      const l = parseInt(match[3]) / 100;
      const hslToRgb = (h2, s2, l2) => {
        let r2, g2, b2;
        if (s2 === 0) {
          r2 = g2 = b2 = l2;
        } else {
          const hue2rgb = (p2, q2, t) => {
            if (t < 0) t += 1;
            if (t > 1) t -= 1;
            if (t < 1 / 6) return p2 + (q2 - p2) * 6 * t;
            if (t < 1 / 2) return q2;
            if (t < 2 / 3) return p2 + (q2 - p2) * (2 / 3 - t) * 6;
            return p2;
          };
          const q = l2 < 0.5 ? l2 * (1 + s2) : l2 + s2 - l2 * s2;
          const p = 2 * l2 - q;
          r2 = hue2rgb(p, q, h2 + 1 / 3);
          g2 = hue2rgb(p, q, h2);
          b2 = hue2rgb(p, q, h2 - 1 / 3);
        }
        return [Math.round(r2 * 255), Math.round(g2 * 255), Math.round(b2 * 255)];
      };
      const [r, g, b] = hslToRgb(h, s, l);
      const toHex = (c) => {
        const hex = c.toString(16);
        return hex.length === 1 ? "0" + hex : hex;
      };
      return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
    };
    const generateQRCode = async () => {
      await nextTick();
      if (!qrCanvas.value) {
        console.log("Canvas not found");
        return;
      }
      try {
        let darkColor = selectedOptions.foregroundColor || "#000000";
        let lightColor = selectedOptions.backgroundColor || "#FFFFFF";
        if (darkColor.startsWith("hsl")) {
          darkColor = convertHslToHex(darkColor);
        }
        if (lightColor.startsWith("hsl")) {
          lightColor = convertHslToHex(lightColor);
        }
        console.log("Converting colors:", {
          original: selectedOptions.foregroundColor,
          converted: darkColor
        });
        const canvas = qrCanvas.value;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        await QRCode.toCanvas(qrCanvas.value, qrData.value, {
          width: 250,
          margin: 2,
          color: {
            dark: darkColor,
            light: lightColor
          },
          errorCorrectionLevel: "M"
        });
        await addLogoToQR();
        if (qrCanvasDesktop.value) {
          const desktopCtx = qrCanvasDesktop.value.getContext("2d");
          if (desktopCtx) {
            desktopCtx.clearRect(0, 0, qrCanvasDesktop.value.width, qrCanvasDesktop.value.height);
            desktopCtx.drawImage(qrCanvas.value, 0, 0);
          }
        }
        console.log("QR code generated successfully");
      } catch (error) {
        console.error("QR Code generation failed:", error);
        const canvas = qrCanvas.value;
        const ctx = canvas.getContext("2d");
        if (ctx) {
          ctx.fillStyle = selectedOptions.backgroundColor || "#FFFFFF";
          ctx.fillRect(0, 0, 250, 250);
          ctx.fillStyle = selectedOptions.foregroundColor || "#000000";
          ctx.font = "12px Arial";
          ctx.textAlign = "center";
          ctx.fillText("QR Code", 125, 125);
        }
      }
    };
    const addLogoToQR = async (targetCanvas) => {
      return new Promise((resolve, reject) => {
        var _a, _b;
        const canvas = qrCanvas.value;
        if (!canvas) {
          resolve();
          return;
        }
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          resolve();
          return;
        }
        const img = new Image();
        img.onload = () => {
          try {
            const logoSize = canvas.width * 0.25;
            const x = (canvas.width - logoSize) / 2;
            const y = (canvas.height - logoSize) / 2;
            ctx.save();
            ctx.fillStyle = "#ffffff";
            ctx.beginPath();
            ctx.arc(canvas.width / 2, canvas.height / 2, logoSize / 2 + 4, 0, 2 * Math.PI);
            ctx.fill();
            ctx.beginPath();
            ctx.arc(canvas.width / 2, canvas.height / 2, logoSize / 2, 0, 2 * Math.PI);
            ctx.clip();
            ctx.drawImage(img, x, y, logoSize, logoSize);
            ctx.restore();
            console.log("Logo added to QR code");
            resolve();
          } catch (error) {
            console.error("Error adding logo:", error);
            resolve();
          }
        };
        img.onerror = () => {
          console.error("Failed to load logo image");
          resolve();
        };
        let logoSrc = "/logo.svg";
        console.log("=== Logo Selection Debug ===");
        console.log("uploadedLogo.value:", uploadedLogo.value);
        console.log("subscriptionStatus.value.isActive:", subscriptionStatus.value.isActive);
        console.log("userStore.user:", userStore.user);
        console.log("userStore.user?.avatar:", (_a = userStore.user) == null ? void 0 : _a.avatar);
        if (uploadedLogo.value) {
          logoSrc = uploadedLogo.value;
          console.log("Using uploaded logo");
        } else if (subscriptionStatus.value.isActive && ((_b = userStore.user) == null ? void 0 : _b.avatar)) {
          logoSrc = userStore.user.avatar;
          console.log("Using user avatar:", logoSrc);
        } else {
          console.log("Using default logo");
        }
        console.log("Final logoSrc:", logoSrc);
        console.log("=========================");
        img.src = logoSrc;
      });
    };
    watch([
      () => selectedOptions.foregroundColor,
      () => selectedOptions.backgroundColor,
      () => qrData.value
    ], () => {
      nextTick(() => {
        generateQRCode();
      });
    });
    watch(() => selectedOptions.foregroundColor, () => {
      nextTick(() => {
        generateQRCode();
      });
    });
    watch(() => selectedOptions.backgroundColor, () => {
      nextTick(() => {
        generateQRCode();
      });
    });
    watch(() => uploadedLogo.value, () => {
      nextTick(() => {
        generateQRCode();
      });
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "min-h-screen bg-background" }, _attrs))} data-v-49c80b66><div class="fixed top-0 left-0 right-0 z-40 bg-card border-b border-border" data-v-49c80b66><div class="flex items-center justify-between h-14 px-4" data-v-49c80b66><button class="flex items-center justify-center w-10 h-10 rounded-lg text-foreground hover:bg-accent transition-colors" data-v-49c80b66><i class="ti ti-arrow-right text-xl" data-v-49c80b66></i></button> <h1 class="flex-1 text-lg font-semibold text-foreground" data-v-49c80b66>\u0633\u0641\u0627\u0631\u0634\u06CC\u200C\u0633\u0627\u0632\u06CC \u06A9\u06CC\u0648\u0622\u0631 \u06A9\u062F</h1> <button class="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center hover:bg-primary/30 transition-colors" data-v-49c80b66><i class="ti ti-share-2 text-primary text-lg" data-v-49c80b66></i></button></div></div> <div class="px-4 pt-24 pb-32 lg:pb-8 overflow-y-auto" data-v-49c80b66><div class="max-w-7xl mx-auto lg:grid lg:grid-cols-2 lg:gap-8 lg:items-start" data-v-49c80b66><div class="hidden lg:block lg:sticky lg:top-24" data-v-49c80b66><div class="bg-card rounded-2xl p-6 border border-border" data-v-49c80b66><h3 class="text-lg font-semibold text-foreground mb-4 text-center" data-v-49c80b66>\u067E\u06CC\u0634\u200C\u0646\u0645\u0627\u06CC\u0634 \u06A9\u06CC\u0648\u0622\u0631 \u06A9\u062F</h3> <div class="flex justify-center mb-4" data-v-49c80b66><div style="${ssrRenderStyle([{ "width": "250px", "height": "250px" }, { backgroundColor: selectedOptions.backgroundColor }])}" class="rounded-xl flex items-center justify-center border border-border shadow-sm overflow-hidden" data-v-49c80b66><canvas class="w-full h-full" width="250" height="250" data-v-49c80b66></canvas></div></div> <div class="space-y-3" data-v-49c80b66><button${ssrIncludeBooleanAttr(isLoading.value) ? " disabled" : ""} class="w-full bg-primary text-primary-foreground py-3.5 rounded-xl font-medium text-base hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2" data-v-49c80b66><i class="ti ti-device-floppy text-lg" data-v-49c80b66></i> <span data-v-49c80b66>\u0630\u062E\u06CC\u0631\u0647 \u062A\u0646\u0638\u06CC\u0645\u0627\u062A</span></button> <button${ssrIncludeBooleanAttr(isLoading.value) ? " disabled" : ""} class="w-full bg-accent text-accent-foreground py-3.5 rounded-xl font-medium text-base hover:bg-accent/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2" data-v-49c80b66><i class="ti ti-download text-lg" data-v-49c80b66></i> <span data-v-49c80b66>\u062F\u0627\u0646\u0644\u0648\u062F \u06A9\u06CC\u0648\u0622\u0631 \u06A9\u062F</span></button> <button class="w-full bg-accent text-accent-foreground py-3.5 rounded-xl font-medium text-base hover:bg-accent/90 transition-colors flex items-center justify-center gap-2" data-v-49c80b66><i class="ti ti-share-2 text-lg" data-v-49c80b66></i> <span data-v-49c80b66>\u0627\u0634\u062A\u0631\u0627\u06A9\u200C\u06AF\u0630\u0627\u0631\u06CC</span></button> <button class="w-full bg-secondary text-secondary-foreground py-3.5 rounded-xl font-medium text-base hover:bg-secondary/80 transition-colors flex items-center justify-center gap-2" data-v-49c80b66><i class="ti ti-refresh text-lg" data-v-49c80b66></i> <span data-v-49c80b66>\u0628\u0627\u0632\u0646\u0634\u0627\u0646\u06CC</span></button></div></div></div> <div class="space-y-4" data-v-49c80b66><div class="lg:hidden flex justify-center mb-6" data-v-49c80b66><div class="relative" data-v-49c80b66><div style="${ssrRenderStyle([{ "width": "250px", "height": "250px" }, { backgroundColor: selectedOptions.backgroundColor }])}" class="rounded-xl flex items-center justify-center border border-border shadow-sm overflow-hidden" data-v-49c80b66><canvas class="w-full h-full" width="250" height="250" data-v-49c80b66></canvas></div></div></div> <div class="bg-card rounded-xl border border-border p-5" data-v-49c80b66><h3 class="text-base font-semibold text-foreground mb-4 flex items-center gap-2" data-v-49c80b66><i class="ti ti-palette text-primary" data-v-49c80b66></i> <span data-v-49c80b66>\u0627\u0646\u062A\u062E\u0627\u0628 \u0631\u0646\u06AF \u06A9\u06CC\u0648\u0622\u0631 \u06A9\u062F</span></h3> <div class="flex gap-1 flex-wrap" data-v-49c80b66><button class="w-8 h-8 rounded-xl border-2 border-border flex items-center justify-center hover:opacity-80 transition-all shadow-sm" style="${ssrRenderStyle({ backgroundColor: selectedOptions.foregroundColor })}" data-v-49c80b66><i class="ti ti-color-picker text-white text-lg" data-v-49c80b66></i></button> <!--[-->`);
      ssrRenderList(themeColors, (color) => {
        _push(`<button style="${ssrRenderStyle({ backgroundColor: color.value })}" class="${ssrRenderClass([selectedOptions.foregroundColor === color.value ? "border-foreground  ring-2 ring-foreground ring-offset-2" : "border-border", "w-8 h-8 rounded-xl border-2 transition-all shadow-sm"])}" data-v-49c80b66></button>`);
      });
      _push(`<!--]--></div></div> <div class="bg-card rounded-xl border border-border p-5" data-v-49c80b66><h3 class="text-base font-semibold text-foreground mb-4 flex items-center gap-2" data-v-49c80b66><i class="ti ti-photo text-primary" data-v-49c80b66></i> <span data-v-49c80b66>\u0644\u0648\u06AF\u0648 \u06A9\u06CC\u0648\u0622\u0631 \u06A9\u062F</span></h3> <button type="button"${ssrIncludeBooleanAttr(!subscriptionStatus.value.isActive) ? " disabled" : ""} class="${ssrRenderClass([
        "w-full p-4 rounded-xl font-medium text-sm transition-colors relative",
        subscriptionStatus.value.isActive ? "bg-primary text-primary-foreground hover:bg-primary/90 flex items-center justify-center gap-2" : "bg-muted text-muted-foreground cursor-not-allowed flex items-center justify-between"
      ])}" data-v-49c80b66><div class="flex items-center gap-2" data-v-49c80b66><i class="${ssrRenderClass(subscriptionStatus.value.isActive ? "ti ti-upload" : "ti ti-lock")}" data-v-49c80b66></i> <span class="text-sm" data-v-49c80b66>\u0622\u067E\u0644\u0648\u062F \u0644\u0648\u06AF\u0648</span></div> `);
      if (!subscriptionStatus.value.isActive) {
        _push(`<div class="cursor-pointer" data-v-49c80b66><div class="bg-gradient-to-r from-orange-500 to-red-500 text-white text-xs px-3 py-1 rounded-full font-bold hover:opacity-90 transition-opacity" data-v-49c80b66>
                  \u0627\u0631\u062A\u0642\u0627
                </div></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</button> `);
      if (uploadedLogo.value) {
        _push(`<div class="mt-3 p-3 bg-muted rounded-xl" data-v-49c80b66><div class="flex items-center justify-between" data-v-49c80b66><div class="flex items-center gap-2" data-v-49c80b66><img${ssrRenderAttr("src", uploadedLogo.value)} alt="Preview" class="w-10 h-10 rounded object-cover" data-v-49c80b66> <span class="text-sm text-foreground" data-v-49c80b66>\u0644\u0648\u06AF\u0648 \u0627\u0646\u062A\u062E\u0627\u0628 \u0634\u062F\u0647</span></div> <button class="w-8 h-8 hover:bg-destructive/10 text-destructive rounded flex items-center justify-center transition-colors" data-v-49c80b66><i class="ti ti-x" data-v-49c80b66></i></button></div></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(` <input id="logoUpload" type="file" class="hidden" accept="image/*,.svg" data-v-49c80b66></div></div></div></div> <div class="lg:hidden fixed bottom-0 left-0 right-0 bg-background/95 backdrop-blur-lg border-t border-border py-3 px-4 z-50" data-v-49c80b66><div class="max-w-sm mx-auto" data-v-49c80b66><div class="flex gap-3" data-v-49c80b66><button${ssrIncludeBooleanAttr(isLoading.value) ? " disabled" : ""} class="flex-1 bg-primary text-primary-foreground py-3 rounded-xl font-medium text-sm hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2" data-v-49c80b66><i class="ti ti-device-floppy text-base" data-v-49c80b66></i> <span data-v-49c80b66>\u0630\u062E\u06CC\u0631\u0647</span></button> <button${ssrIncludeBooleanAttr(isLoading.value) ? " disabled" : ""} class="flex-1 bg-accent text-accent-foreground py-3 rounded-xl font-medium text-sm hover:bg-accent/80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2" data-v-49c80b66><i class="ti ti-download text-base" data-v-49c80b66></i> <span data-v-49c80b66>\u062F\u0627\u0646\u0644\u0648\u062F</span></button> <button class="w-12 bg-secondary text-secondary-foreground py-3 rounded-xl font-medium text-sm hover:bg-secondary/80 transition-colors flex items-center justify-center" data-v-49c80b66><i class="ti ti-refresh text-base" data-v-49c80b66></i></button></div></div></div> `);
      if (showFormatModal.value) {
        _push(`<div class="fixed inset-0 bg-black/50 z-50 flex items-end lg:items-center justify-center" data-v-49c80b66><div class="bg-card rounded-t-2xl lg:rounded-2xl w-full lg:max-w-md p-6 animate-slide-up border-t lg:border border-border" data-v-49c80b66><div class="flex items-center justify-between mb-6" data-v-49c80b66><h2 class="text-xl font-bold text-foreground" data-v-49c80b66>\u0627\u0646\u062A\u062E\u0627\u0628 \u0641\u0631\u0645\u062A \u062F\u0627\u0646\u0644\u0648\u062F</h2> <button class="p-2 hover:bg-muted rounded-lg transition-colors text-muted-foreground hover:text-foreground" data-v-49c80b66><i class="ti ti-x text-xl" data-v-49c80b66></i></button></div> <div class="space-y-2" data-v-49c80b66><button class="w-full p-4 rounded-xl bg-primary/10 text-foreground hover:bg-primary/20 border border-primary/20 hover:border-primary/30 transition-all flex items-center justify-between group" data-v-49c80b66><div class="flex items-center gap-3" data-v-49c80b66><div class="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center" data-v-49c80b66><i class="ti ti-photo text-primary text-2xl" data-v-49c80b66></i></div> <div class="text-right" data-v-49c80b66><p class="font-semibold text-foreground" data-v-49c80b66>\u062A\u0635\u0648\u06CC\u0631 PNG</p> <p class="text-xs text-muted-foreground" data-v-49c80b66>\u0628\u062F\u0648\u0646 \u067E\u0633\u200C\u0632\u0645\u06CC\u0646\u0647 \u0648 \u0634\u0641\u0627\u0641</p></div></div> <i class="ti ti-chevron-left text-lg text-muted-foreground group-hover:text-foreground transition-colors" data-v-49c80b66></i></button> <button class="w-full p-4 rounded-xl bg-accent hover:bg-accent/80 border border-border transition-all flex items-center justify-between group" data-v-49c80b66><div class="flex items-center gap-3" data-v-49c80b66><div class="w-12 h-12 rounded-lg bg-muted flex items-center justify-center" data-v-49c80b66><i class="ti ti-photo text-foreground text-2xl" data-v-49c80b66></i></div> <div class="text-right" data-v-49c80b66><p class="font-semibold text-foreground" data-v-49c80b66>\u062A\u0635\u0648\u06CC\u0631 JPG</p> <p class="text-xs text-muted-foreground" data-v-49c80b66>\u0628\u0627 \u067E\u0633\u200C\u0632\u0645\u06CC\u0646\u0647 \u0633\u0641\u06CC\u062F</p></div></div> <i class="ti ti-chevron-left text-lg text-muted-foreground group-hover:text-foreground transition-colors" data-v-49c80b66></i></button> <button class="w-full p-4 rounded-xl bg-accent hover:bg-accent/80 border border-border transition-all flex items-center justify-between group" data-v-49c80b66><div class="flex items-center gap-3" data-v-49c80b66><div class="w-12 h-12 rounded-lg bg-muted flex items-center justify-center" data-v-49c80b66><i class="ti ti-file-type-pdf text-red-600 text-2xl" data-v-49c80b66></i></div> <div class="text-right" data-v-49c80b66><p class="font-semibold text-foreground" data-v-49c80b66>\u0641\u0627\u06CC\u0644 PDF</p> <p class="text-xs text-muted-foreground" data-v-49c80b66>\u0628\u0631\u0627\u06CC \u0686\u0627\u067E \u062D\u0631\u0641\u0647\u200C\u0627\u06CC</p></div></div> <i class="ti ti-chevron-left text-lg text-muted-foreground group-hover:text-foreground transition-colors" data-v-49c80b66></i></button></div> <button class="w-full mt-4 py-3 rounded-xl bg-muted text-foreground font-medium hover:bg-muted/80 transition-colors" data-v-49c80b66>
          \u0627\u0646\u0635\u0631\u0627\u0641
        </button></div></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(` `);
      if (showColorPicker.value) {
        _push(`<div class="fixed inset-0 bg-black/50 z-50 flex items-end lg:items-center justify-center" data-v-49c80b66><div class="bg-card rounded-t-2xl lg:rounded-2xl w-full lg:max-w-md p-6 animate-slide-up border-t lg:border border-border" data-v-49c80b66><div class="flex items-center justify-between mb-6" data-v-49c80b66><h2 class="text-xl font-bold text-foreground" data-v-49c80b66>\u0627\u0646\u062A\u062E\u0627\u0628 \u0631\u0646\u06AF \u062F\u0644\u062E\u0648\u0627\u0647</h2> <button class="p-2 hover:bg-muted rounded-lg transition-colors text-muted-foreground hover:text-foreground" data-v-49c80b66><i class="ti ti-x text-xl" data-v-49c80b66></i></button></div> <div class="space-y-4" data-v-49c80b66><div class="flex items-center gap-3 p-4 bg-muted rounded-xl" data-v-49c80b66><div class="w-14 h-14 rounded-lg border-2 border-border shadow-sm" style="${ssrRenderStyle({ backgroundColor: selectedOptions.foregroundColor })}" data-v-49c80b66></div> <div class="flex-1" data-v-49c80b66><p class="text-xs text-muted-foreground mb-1" data-v-49c80b66>\u0631\u0646\u06AF \u0627\u0646\u062A\u062E\u0627\u0628 \u0634\u062F\u0647</p> <p class="font-mono text-sm font-semibold text-foreground" data-v-49c80b66>${ssrInterpolate(selectedOptions.foregroundColor)}</p></div></div> <input${ssrRenderAttr("value", selectedOptions.foregroundColor)} type="color" class="w-full h-32 rounded-xl cursor-pointer border-2 border-border" data-v-49c80b66></div> <button class="mt-6 w-full bg-primary hover:bg-primary/90 text-primary-foreground py-3.5 rounded-xl font-medium transition-all" data-v-49c80b66>
          \u062A\u0623\u06CC\u06CC\u062F
        </button></div></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(` `);
      if (showSuccessToast.value) {
        _push(`<div class="fixed bottom-20 left-4 right-4 bg-green-600 text-white px-4 py-3 rounded-xl text-sm font-medium z-50 flex items-center gap-2" data-v-49c80b66><i class="ti ti-check text-lg" data-v-49c80b66></i> ${ssrInterpolate(successMessage.value)}</div>`);
      } else {
        _push(`<!---->`);
      }
      _push(` `);
      if (tempImageFile.value) {
        _push(ssrRenderComponent(ImageCropperModal, {
          show: showCropperModal.value,
          "image-file": tempImageFile.value,
          "field-name": "logo",
          onCropped: handleCroppedImage,
          onClose: handleCropperCancel
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/profile/CustomizeQRPage.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const CustomizeQRPage = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-49c80b66"]]);

const CustomizeQRPageCcfAjBQD = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: CustomizeQRPage
}, Symbol.toStringTag, { value: 'Module' }));

const indexBEFvcSzO = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: CustomizeQRPage
}, Symbol.toStringTag, { value: 'Module' }));

export { CustomizeQRPageCcfAjBQD as C, indexBEFvcSzO as i };
//# sourceMappingURL=index-BEFvcSzO.mjs.map
