import { ref } from 'vue';

const _imports_0 = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAXCAMAAABODP0nAAAAVFBMVEXaAAAjn0D////wkZHkSUme1KtfunRduHOo2bTjRERYtW7xmpriPT2k17DujIzxl5f+9PT96enxnZ30sLBDrVzfJyeKy5nrd3fsfn7tg4P4y8v0s7NKuoUCAAAAkElEQVQoz+WPRxLDMAhFlSBLVrOae+5/zyCcsrAXrBPKvIH/FyBuzBA/ZRyVtlprq9QbloDdoOyhj2LuuxC6nvKF7xw+8yzu58j5Ynk2pr0+9sQwuhpLLQxjWcGtHCNsw7AB58bsfebciF+nq68XBxAhDggAR4jQgI1FAuqLmKSRHkvKBmMaDEHS1hz6JP4ynkIfCksRzajdAAAAAElFTkSuQmCC";
const _imports_1 = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAVBAMAAADGNLEtAAAALVBMVEX////GU3LZjKGzGUINM2PsxtAYPWotT3hed5enma46WoBPa46zGkMkR3Jrgp+6ntXWAAAAiklEQVQY02Nwc0lJcQMSxghgw+CRVdaWkVXWooQEGFxaPLxKWjxcGJCBn1fJExAWRAJglUuAKlEEPdyXgA1A0e62LTu9bFt2CopF3iCh9LItKE5yX5tVe31tVgmq9pL0NLcy95RQJMAAdiUQo2ifCQUoKrECY0xgw6CEBWDXLogFYBfECrBahM1JAItMTcEiMDpsAAAAAElFTkSuQmCC";
const _imports_2 = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAbCAMAAAA5zj1cAAAAQlBMVEUAVDBvnoohakoTYD9bkHkGWDU7e2ACVTFDgWaBq5kmbU95pZJRinFVjXU1d1pLhm2Os6OiwbMtclRkl4EKWje50MYuwG0pAAAAnklEQVQ4y+XTuQ4DMQgEULABj+9r9/9/NV0qK0qRajP1k9AgoEBfJdBDoRJdpD5cpEtTUtJ0HWEraXNp1sCoq0ssUo/QbY3ZyoZUKa5ice9H2GXbkI6SknCrSFHkCCtszlmQMTJ2he98Hg0Doy1nc9y5GXuzcoQ2B3oemfdwbQgyO3feYwruIu+8Nu8V60FHoZ/K+BzfueOUf3iFH8EXincH0Y/Lci4AAAAASUVORK5CYII=";
const _imports_3 = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAbCAMAAAA5zj1cAAAARVBMVEXjChf70dPqRlDnMDvnLDflIi383N7jCxj////kFCHmJjL4v8Pwe4LvbnbtZW3sUlv+8PHlHSn0naL3trrpO0XyjZPyiZBeDlMuAAAAjUlEQVQ4y+WTyxKDIAwAw0NYQETR9v8/tQenehHl3ObE7OxAQhLx0hVeflZctOkQ/egAlf2DODhQU1zKdC/6BHk/xVvxBfWgw9AUPRAOapNYcy0aUCfVzC5ciwXWLwsVKI2nI7iTbrNTjRtl7sxRRnj3VC2SYP/qYB86o6BuIY65r9er7pse+4c7cyd+AOKjBXOHX0j9AAAAAElFTkSuQmCC";
const useWebAuthn = () => {
  const isSupported = ref(false);
  const isPlatformAuthenticatorAvailable = ref(false);
  const isLoading = ref(false);
  const error = ref(void 0);
  const checkSupport = async () => {
    return false;
  };
  const base64URLToArrayBuffer = (base64url) => {
    const base64 = base64url.replace(/-/g, "+").replace(/_/g, "/");
    const padding = "=".repeat((4 - base64.length % 4) % 4);
    const binaryString = atob(base64 + padding);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes.buffer;
  };
  const arrayBufferToBase64URL = (buffer) => {
    const bytes = new Uint8Array(buffer);
    let binary = "";
    for (let i = 0; i < bytes.length; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=/g, "");
  };
  const registerPasskey = async (userId, userName, displayName) => {
    if (!isSupported.value) {
      return { success: false, error: "WebAuthn \u067E\u0634\u062A\u06CC\u0628\u0627\u0646\u06CC \u0646\u0645\u06CC\u200C\u0634\u0648\u062F" };
    }
    isLoading.value = true;
    error.value = void 0;
    try {
      const challenge = new Uint8Array(32);
      crypto.getRandomValues(challenge);
      const publicKeyCredentialCreationOptions = {
        challenge,
        rp: {
          name: "\u0644\u06CC\u0646\u06A9\u0648 - Linku",
          id: (void 0).location.hostname
        },
        user: {
          id: new TextEncoder().encode(userId),
          name: userName,
          displayName
        },
        pubKeyCredParams: [
          { type: "public-key", alg: -7 },
          // ES256 (recommended)
          { type: "public-key", alg: -257 }
          // RS256 (fallback)
        ],
        timeout: 6e4,
        attestation: "none",
        authenticatorSelection: {
          // Platform authenticator = Face ID / Touch ID / Windows Hello
          authenticatorAttachment: "platform",
          residentKey: "preferred",
          requireResidentKey: false,
          userVerification: "preferred"
        }
      };
      const credential = await (void 0).credentials.create({
        publicKey: publicKeyCredentialCreationOptions
      });
      if (!credential) {
        throw new Error("\u0627\u06CC\u062C\u0627\u062F Credential \u0646\u0627\u0645\u0648\u0641\u0642 \u0628\u0648\u062F");
      }
      const response = credential.response;
      const credentialData = {
        id: credential.id,
        rawId: arrayBufferToBase64URL(credential.rawId),
        type: credential.type,
        response: {
          attestationObject: arrayBufferToBase64URL(response.attestationObject),
          clientDataJSON: arrayBufferToBase64URL(response.clientDataJSON)
        }
      };
      const savedCredentials = JSON.parse(localStorage.getItem("webauthn_credentials") || "[]");
      savedCredentials.push({
        credentialId: credential.id,
        userId,
        createdAt: (/* @__PURE__ */ new Date()).toISOString()
      });
      localStorage.setItem("webauthn_credentials", JSON.stringify(savedCredentials));
      localStorage.setItem("webauthn_enabled", "true");
      isLoading.value = false;
      return { success: true, credential: credentialData };
    } catch (err) {
      isLoading.value = false;
      if (err.name === "NotAllowedError") {
        error.value = "\u062F\u0633\u062A\u0631\u0633\u06CC \u0631\u062F \u0634\u062F. \u0644\u0637\u0641\u0627\u064B \u062F\u0648\u0628\u0627\u0631\u0647 \u062A\u0644\u0627\u0634 \u06A9\u0646\u06CC\u062F.";
      } else if (err.name === "InvalidStateError") {
        error.value = "\u0627\u06CC\u0646 \u062F\u0633\u062A\u06AF\u0627\u0647 \u0642\u0628\u0644\u0627\u064B \u062B\u0628\u062A \u0634\u062F\u0647 \u0627\u0633\u062A.";
      } else {
        error.value = err.message || "\u062E\u0637\u0627 \u062F\u0631 \u062B\u0628\u062A Passkey";
      }
      return { success: false, error: error.value };
    }
  };
  const authenticateWithPasskey = async () => {
    if (!isSupported.value) {
      return { success: false, error: "WebAuthn \u067E\u0634\u062A\u06CC\u0628\u0627\u0646\u06CC \u0646\u0645\u06CC\u200C\u0634\u0648\u062F" };
    }
    if (localStorage.getItem("webauthn_enabled") !== "true") {
      return { success: false, error: "Passkey \u0641\u0639\u0627\u0644 \u0646\u06CC\u0633\u062A" };
    }
    isLoading.value = true;
    error.value = void 0;
    try {
      const challenge = new Uint8Array(32);
      crypto.getRandomValues(challenge);
      const savedCredentials = JSON.parse(localStorage.getItem("webauthn_credentials") || "[]");
      const publicKeyCredentialRequestOptions = {
        challenge,
        timeout: 6e4,
        rpId: (void 0).location.hostname,
        allowCredentials: savedCredentials.map((cred) => ({
          type: "public-key",
          id: base64URLToArrayBuffer(cred.credentialId),
          transports: ["internal"]
        })),
        userVerification: "preferred"
      };
      const credential = await (void 0).credentials.get({
        publicKey: publicKeyCredentialRequestOptions
      });
      if (!credential) {
        throw new Error("\u0627\u062D\u0631\u0627\u0632 \u0647\u0648\u06CC\u062A \u0646\u0627\u0645\u0648\u0641\u0642 \u0628\u0648\u062F");
      }
      const matchedCred = savedCredentials.find(
        (c) => c.credentialId === credential.id
      );
      isLoading.value = false;
      return {
        success: true,
        userId: matchedCred == null ? void 0 : matchedCred.userId,
        credential: {
          id: credential.id,
          type: credential.type
        }
      };
    } catch (err) {
      isLoading.value = false;
      if (err.name === "NotAllowedError") {
        error.value = "\u0627\u062D\u0631\u0627\u0632 \u0647\u0648\u06CC\u062A \u0644\u063A\u0648 \u0634\u062F";
      } else {
        error.value = err.message || "\u062E\u0637\u0627 \u062F\u0631 \u0627\u062D\u0631\u0627\u0632 \u0647\u0648\u06CC\u062A";
      }
      return { success: false, error: error.value };
    }
  };
  const isPasskeyEnabled = () => {
    return false;
  };
  const disablePasskey = () => {
    return;
  };
  const getRegisteredDevices = () => {
    return [];
  };
  return {
    // State
    isSupported,
    isPlatformAuthenticatorAvailable,
    isLoading,
    error,
    // Methods
    checkSupport,
    registerPasskey,
    authenticateWithPasskey,
    isPasskeyEnabled,
    disablePasskey,
    getRegisteredDevices
  };
};

export { _imports_0 as _, _imports_1 as a, _imports_2 as b, _imports_3 as c, useWebAuthn as u };
//# sourceMappingURL=useWebAuthn-BhHsk7sO.mjs.map
