import { d as defineEventHandler, p as proxyRequest } from '../../../_/nitro.mjs';
import { g as getApiUrl } from '../../../_/api.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import 'node:url';

const index_post = defineEventHandler(async (event) => {
  return proxyRequest(event, getApiUrl("/v1/cards"), {
    fetch: $fetch.native
  });
});

export { index_post as default };
//# sourceMappingURL=index.post.mjs.map
