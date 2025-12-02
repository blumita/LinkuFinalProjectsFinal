import { d as defineEventHandler, g as getHeader, p as proxyRequest } from '../../_/nitro.mjs';
import { g as getApiUrl } from '../../_/api.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import 'node:url';

const _____ = defineEventHandler(async (event) => {
  const path = event.path.replace(/^\/api/, "");
  const targetUrl = getApiUrl(path);
  const authHeader = getHeader(event, "authorization");
  return proxyRequest(event, targetUrl, {
    fetch: $fetch.native,
    headers: authHeader ? { "Authorization": authHeader } : {}
  });
});

export { _____ as default };
//# sourceMappingURL=_..._.mjs.map
