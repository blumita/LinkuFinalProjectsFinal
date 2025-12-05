import { d as defineEventHandler, p as proxyRequest } from '../../_/nitro.mjs';
import { g as getApiUrl } from '../../_/api.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import 'node:url';

const payment_post = defineEventHandler(async (event) => {
  return proxyRequest(event, getApiUrl("/payment"), {
    fetch: $fetch.native
  });
});

export { payment_post as default };
//# sourceMappingURL=payment.post.mjs.map
