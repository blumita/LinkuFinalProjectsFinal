import { d as defineEventHandler, r as readBody, o as ofetch, c as createError } from '../../../_/nitro.mjs';
import { g as getApiUrl } from '../../../_/api.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import 'node:url';

const sendOtpCode_post = defineEventHandler(async (event) => {
  var _a, _b;
  const body = await readBody(event);
  try {
    const response = await ofetch(getApiUrl("/auth/sendOtpCode"), {
      method: "POST",
      body,
      timeout: 15e3,
      // 15 ثانیه timeout
      retry: 2,
      // 2 بار retry
      retryDelay: 1e3
      // 1 ثانیه بین هر retry
    });
    return response;
  } catch (error) {
    const errorMessage = (error == null ? void 0 : error.data) || (error == null ? void 0 : error.message) || error;
    console.error("sendOtpCode error:", errorMessage);
    if (error == null ? void 0 : error.data) {
      return error.data;
    }
    if (((_a = error == null ? void 0 : error.message) == null ? void 0 : _a.includes("fetch failed")) || ((_b = error == null ? void 0 : error.message) == null ? void 0 : _b.includes("no response"))) {
      throw createError({
        statusCode: 503,
        message: "\u0633\u0631\u0648\u0631 API \u062F\u0631 \u062F\u0633\u062A\u0631\u0633 \u0646\u06CC\u0633\u062A. \u0644\u0637\u0641\u0627\u064B \u0686\u0646\u062F \u0644\u062D\u0638\u0647 \u062F\u06CC\u06AF\u0631 \u062A\u0644\u0627\u0634 \u06A9\u0646\u06CC\u062F."
      });
    }
    throw createError({
      statusCode: (error == null ? void 0 : error.statusCode) || 500,
      message: (error == null ? void 0 : error.message) || "\u062E\u0637\u0627 \u062F\u0631 \u0627\u0631\u0633\u0627\u0644 \u06A9\u062F"
    });
  }
});

export { sendOtpCode_post as default };
//# sourceMappingURL=sendOtpCode.post.mjs.map
