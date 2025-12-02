import { defineStore } from 'pinia';
import { s as safeStorage } from './server.mjs';

const transformMediaUrl = (url) => {
  if (!url) return null;
  if (url.startsWith("data:")) return url;
  if (url.startsWith("/") && !url.startsWith("//")) return url;
  if (url.startsWith("https://")) return url;
  return url;
};
const defaultFields = [
  { id: "1", label: "\u0646\u0627\u0645 \u06A9\u0627\u0645\u0644", name: "fullName", required: false, type: "text" },
  { id: "2", label: "\u0627\u06CC\u0645\u06CC\u0644", name: "email", required: false, type: "text" },
  { id: "3", label: "\u0634\u0645\u0627\u0631\u0647 \u062A\u0645\u0627\u0633", name: "phoneNumber", required: false, type: "text" },
  { id: "4", label: "\u0639\u0646\u0648\u0627\u0646 \u0634\u063A\u0644\u06CC", name: "jobTitle", required: false, type: "text" },
  { id: "5", label: "\u0634\u0631\u06A9\u062A", name: "company", required: false, type: "text" },
  { id: "6", label: "\u06CC\u0627\u062F\u062F\u0627\u0634\u062A", name: "note", required: false, type: "text" }
];
const useFormStore = defineStore("form", {
  state: () => ({
    layout: "right",
    isListMode: true,
    themeColor: {
      background: "transparent",
      text: "#000000"
    },
    iconColor: {
      background: "transparent",
      text: "#000000"
    },
    matchThemeColor: false,
    name: "",
    cardName: "",
    location: "",
    job: "",
    company: "",
    bio: "",
    saveContact: "",
    profileImage: null,
    coverImage: null,
    logoImage: null,
    links: [],
    activeLinkIndex: 0,
    removeBranding: false,
    formTitle: "",
    connectButtonText: "\u0627\u0631\u0633\u0627\u0644",
    formDisclaimer: "\u0627\u0637\u0644\u0627\u0639\u0627\u062A \u0634\u0645\u0627 \u0645\u062D\u0631\u0645\u0627\u0646\u0647 \u0645\u06CC\u200C\u0645\u0627\u0646\u062F",
    isLeadCaptureEnabled: false,
    fields: [],
    leadCaptureForm: {
      name: "",
      email: "",
      message: ""
    },
    qrColor: "",
    qrBgColor: "",
    qrLogo: "",
    qrRadius: 0,
    qrLogoSize: 0,
    qrSize: 0,
    qrMargin: 0,
    logoBackground: false,
    formSaved: false,
    newCardId: null,
    selectedCardId: null,
    // Add selectedCardId property
    cards: [],
    inboxBadge: 0,
    textsection: {
      title: "",
      value: "",
      align: "right",
      icon: "",
      customIcon: ""
    }
  }),
  getters: {
    activeLink(state) {
      const index = Math.max(0, Math.min(state.activeLinkIndex || 0, state.links.length - 1));
      return state.links[index] || {
        id: "",
        title: "\u0644\u06CC\u0646\u06A9 \u062C\u062F\u06CC\u062F",
        description: "",
        value: "",
        type: "default",
        enabled: true
      };
    },
    layoutClass(state) {
      return `layout-${state.layout}`;
    },
    // Getters برای تصاویر با URL های transformed
    safeProfileImage(state) {
      return transformMediaUrl(state.profileImage);
    },
    safeCoverImage(state) {
      return transformMediaUrl(state.coverImage);
    },
    safeLogoImage(state) {
      return transformMediaUrl(state.logoImage);
    },
    themeClass(state) {
      return `theme-${(state.themeColor.background || "#ffffff").replace("#", "")}`;
    },
    requiredFields(state) {
      return state.fields.filter((f) => f.required);
    },
    defaultCard(state) {
      return state.cards.find((c) => c.isDefault) || null;
    }
  },
  actions: {
    setListMode(val) {
      this.isListMode = val;
    },
    setInboxBadge(val) {
      this.inboxBadge = val;
    },
    // کنترل leadcapture در links
    toggleLeadCapture(enabled) {
      this.isLeadCaptureEnabled = enabled;
    },
    resetAbout() {
      this.name = "";
      this.job = "";
      this.company = "";
      this.location = "";
      this.bio = "";
      this.saveContact = "";
      this.profileImage = null;
      this.coverImage = null;
      this.logoImage = null;
      this.iconColor = { background: "transparent", text: "#000000" };
      this.themeColor = { background: "transparent", text: "#000000" };
    },
    addLink(link) {
      this.links.push({ id: `${Date.now()}_${Math.floor(Math.random() * 1e8)}`, ...link, enabled: true });
    },
    updateLink(id, updates) {
      const index = this.links.findIndex((l) => l.id === id);
      if (index !== -1) this.links[index] = { ...this.links[index], ...updates };
    },
    removeLink(id) {
      this.links = this.links.filter((l) => l.id !== id);
      if (this.activeLinkIndex >= this.links.length) {
        this.activeLinkIndex = Math.max(0, this.links.length - 1);
      }
    },
    addField(field) {
      this.fields.push({ id: Date.now().toString(), ...field });
    },
    updateField(id, updates) {
      const index = this.fields.findIndex((f) => f.id === id);
      if (index !== -1) this.fields[index] = { ...this.fields[index], ...updates };
    },
    resetFormFields() {
      this.fields = JSON.parse(JSON.stringify(defaultFields));
      this.formTitle = "";
      this.connectButtonText = "\u0627\u0631\u0633\u0627\u0644";
      this.formDisclaimer = "\u0627\u0637\u0644\u0627\u0639\u0627\u062A \u0634\u0645\u0627 \u0645\u062D\u0631\u0645\u0627\u0646\u0647 \u0645\u06CC\u200C\u0645\u0627\u0646\u062F";
      this.isLeadCaptureEnabled = false;
      this.leadCaptureForm = { name: "", email: "", message: "" };
    },
    saveLeadCaptureForm() {
      safeStorage.setItem("leadCaptureForm", JSON.stringify(this.leadCaptureForm));
    },
    loadLeadCaptureForm() {
      const saved = safeStorage.getItem("leadCaptureForm");
      if (saved) this.leadCaptureForm = JSON.parse(saved);
    },
    addCard(card) {
      this.cards.push({ id: Date.now().toString(), ...card });
      this.formSaved = true;
      this.setNewCardId(Number(card.id));
    },
    setNewCardId(id) {
      this.newCardId = id;
    },
    updateCard(id, updates) {
      const index = this.cards.findIndex((c) => c.id === id);
      if (index !== -1) this.cards[index] = { ...this.cards[index], ...updates };
    },
    removeCard(id) {
      this.cards = this.cards.filter((c) => c.id !== id);
    },
    setDefaultCard(id) {
      this.cards = this.cards.map((c) => ({ ...c, isDefault: c.id === id }));
    },
    setAboutFrom(cardId) {
      var _a, _b, _c, _d, _e, _f, _g, _h;
      this.selectedCardId = cardId;
      const card = this.cards.find((c) => Number(c.id) === Number(cardId));
      if (!card) {
        return;
      }
      this.name = card.userName || "";
      this.cardName = card.name || "";
      this.job = card.job || "";
      this.company = card.company || "";
      this.location = card.location || "";
      this.bio = card.bio || "";
      this.profileImage = card.avatar || null;
      this.coverImage = card.cover || null;
      this.logoImage = card.logo || null;
      const themeColor = typeof card.themeColor === "string" ? JSON.parse(card.themeColor) : card.themeColor;
      const iconColor = typeof card.iconColor === "string" ? JSON.parse(card.iconColor) : card.iconColor;
      this.themeColor = {
        background: (themeColor == null ? void 0 : themeColor.background) || "transparent",
        text: (themeColor == null ? void 0 : themeColor.text) || "#000000"
      };
      this.iconColor = {
        background: (iconColor == null ? void 0 : iconColor.background) || "transparent",
        text: (iconColor == null ? void 0 : iconColor.text) || "#000000"
      };
      this.matchThemeColor = card.matchThemeColor || false;
      this.saveContact = card.saveContact || "";
      this.layout = card.layoutMode || "right";
      this.formTitle = card.formTitle || "";
      this.connectButtonText = card.connectButtonText || "\u0627\u0631\u0633\u0627\u0644";
      this.isLeadCaptureEnabled = !!card.leadCaptureMode;
      this.removeBranding = card.removeBranding || false;
      this.links = card.linksDataList ? card.linksDataList.map((link) => this.normalizeLink(link)) : [];
      const defaultLeadFields = [
        { id: "1", type: "text", label: "\u0646\u0627\u0645", name: "fullName", required: true },
        { id: "2", type: "text", label: "\u0627\u06CC\u0645\u06CC\u0644", name: "email", required: true },
        { id: "3", type: "text", label: "\u0634\u0645\u0627\u0631\u0647 \u062A\u0645\u0627\u0633", name: "phoneNumber", required: false }
      ];
      this.fields = card.fields && card.fields.length > 0 ? card.fields : defaultLeadFields;
      this.formTitle = card.formTitle || "\u0641\u0631\u0645 \u062A\u0645\u0627\u0633";
      this.connectButtonText = card.submitButtonText || card.connectButtonText || "\u0627\u0631\u0633\u0627\u0644";
      this.formDisclaimer = card.formDisclaimer || "\u0627\u0637\u0644\u0627\u0639\u0627\u062A \u0634\u0645\u0627 \u0645\u062D\u0631\u0645\u0627\u0646\u0647 \u0645\u06CC\u200C\u0645\u0627\u0646\u062F";
      this.qrColor = (_a = card.qrColor) != null ? _a : "#000000";
      this.qrBgColor = (_b = card.qrBgColor) != null ? _b : "#ffffff";
      this.qrLogoSize = (_c = card.qrLogoSize) != null ? _c : 15;
      this.qrLogo = (_d = card.qrLogo) != null ? _d : "/logo/logo.png";
      this.qrRadius = (_e = card.qrRadius) != null ? _e : 10;
      this.qrSize = (_f = card.qrSize) != null ? _f : 200;
      this.qrMargin = (_g = card.qrMargin) != null ? _g : 10;
      this.logoBackground = (_h = card.logoBackground) != null ? _h : false;
    },
    normalizeLink(link) {
      const defaultDescriptions = [
        "\u0628\u0631\u0642\u0631\u0627\u0631\u06CC \u062A\u0645\u0627\u0633 \u0628\u0627 \u0634\u0645\u0627\u0631\u0647 \u062F\u0644\u062E\u0648\u0627\u0647",
        "\u0627\u0631\u0633\u0627\u0644 \u0627\u06CC\u0645\u06CC\u0644 \u0628\u0627 \u0622\u062F\u0631\u0633 \u062F\u0644\u062E\u0648\u0627\u0647",
        "\u0627\u0641\u0632\u0648\u062F\u0646 \u0646\u0642\u0634\u0647 \u062A\u0639\u0627\u0645\u0644\u06CC \u0628\u0627 \u0645\u062E\u062A\u0635\u0627\u062A \u062C\u063A\u0631\u0627\u0641\u06CC\u0627\u06CC\u06CC",
        "\u0627\u0631\u0633\u0627\u0644 \u067E\u06CC\u0627\u0645 \u0628\u0647 \u0634\u0645\u0627\u0631\u0647 \u0645\u0648\u0631\u062F \u0646\u0638\u0631",
        "\u0645\u0634\u0627\u0647\u062F\u0647 \u067E\u0631\u0648\u0641\u0627\u06CC\u0644 \u062F\u0631 \u0627\u06CC\u0646\u0633\u062A\u0627\u06AF\u0631\u0627\u0645",
        "\u0627\u0631\u062A\u0628\u0627\u0637 \u0627\u0632 \u0637\u0631\u06CC\u0642 \u062A\u0644\u06AF\u0631\u0627\u0645",
        "\u0686\u062A \u062F\u0631 \u0648\u0627\u062A\u0633\u0627\u067E",
        "\u0645\u0634\u0627\u0647\u062F\u0647 \u0648\u0628\u0633\u0627\u06CC\u062A",
        "description",
        // پیش‌فرض خالی
        "",
        // خالی
        " "
        // فقط اسپیس
      ];
      let validDescription = "";
      if (link.description && typeof link.description === "string" && link.description.trim() && !defaultDescriptions.includes(link.description.trim()) && link.description.trim().length > 0) {
        validDescription = link.description.trim();
      }
      const normalizedLink = {
        ...link,
        icon: link.icon ? this.safeJsonParse(link.icon) : null,
        placeholder: link.placeholder ? this.safeJsonParse(link.placeholder) : null,
        showDescription: link.showDescription || false
      };
      if (validDescription) {
        normalizedLink.description = validDescription;
      } else {
        delete normalizedLink.description;
      }
      return normalizedLink;
    },
    safeJsonParse(str) {
      try {
        return typeof str === "string" ? JSON.parse(str) : str;
      } catch {
        return str;
      }
    },
    setTextSectionField(key, value) {
      this.textsection[key] = value;
    },
    resetTextSection() {
      this.textsection = { title: "", value: "", align: "right", icon: "", customIcon: "" };
    },
    // Icon color management
    setIconColor(color) {
      this.iconColor = { ...color };
    },
    resetIconColor() {
      this.iconColor = { background: "transparent", text: "#000000" };
    }
  }
});

export { defaultFields as d, useFormStore as u };
//# sourceMappingURL=form-CUJQskNk.mjs.map
