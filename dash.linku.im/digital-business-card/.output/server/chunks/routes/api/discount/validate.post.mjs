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

const validate_post = defineEventHandler(async (event) => {
  return proxyRequest(event, getApiUrl("/discount/validate"), {
    fetch: $fetch.native
  });
});

export { validate_post as default };
//# sourceMappingURL=validate.post.mjs.map
