import { d as defineEventHandler, g as getHeader, p as proxyRequest } from '../../../../_/nitro.mjs';
import { g as getApiUrl } from '../../../../_/api.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import 'node:url';

const createDefaultCard_post = defineEventHandler(async (event) => {
  const authHeader = getHeader(event, "authorization");
  return proxyRequest(event, getApiUrl("/v1/cards/createDefaultCard"), {
    fetch: $fetch.native,
    headers: authHeader ? { "Authorization": authHeader } : {}
  });
});

export { createDefaultCard_post as default };
//# sourceMappingURL=createDefaultCard.post.mjs.map
