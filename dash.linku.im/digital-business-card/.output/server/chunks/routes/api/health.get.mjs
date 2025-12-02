import { d as defineEventHandler, o as ofetch } from '../../_/nitro.mjs';
import { a as getApiBaseUrl } from '../../_/api.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import 'node:url';

const health_get = defineEventHandler(async () => {
  const apiBase = getApiBaseUrl();
  const results = {
    server: "ok",
    api: "unknown",
    apiUrl: apiBase,
    timestamp: (/* @__PURE__ */ new Date()).toISOString(),
    error: null
  };
  try {
    const start = Date.now();
    await ofetch(`${apiBase}/api`, {
      method: "GET",
      timeout: 5e3
    });
    results.api = `ok (${Date.now() - start}ms)`;
  } catch (error) {
    results.api = "failed";
    results.error = (error == null ? void 0 : error.message) || "Unknown error";
  }
  return results;
});

export { health_get as default };
//# sourceMappingURL=health.get.mjs.map
