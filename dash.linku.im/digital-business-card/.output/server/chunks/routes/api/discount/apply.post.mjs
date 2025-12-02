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

const apply_post = defineEventHandler(async (event) => {
  return proxyRequest(event, getApiUrl("/discount/apply"), {
    fetch: $fetch.native
  });
});

export { apply_post as default };
//# sourceMappingURL=apply.post.mjs.map
