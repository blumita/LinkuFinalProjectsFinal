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

const setReferralCode_post = defineEventHandler(async (event) => {
  return proxyRequest(event, getApiUrl("/user/setReferralCode"), {
    fetch: $fetch.native
  });
});

export { setReferralCode_post as default };
//# sourceMappingURL=setReferralCode.post.mjs.map
