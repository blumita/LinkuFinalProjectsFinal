import { d as defineEventHandler, g as getHeader, p as proxyRequest } from '../../../_/nitro.mjs';
import { g as getApiUrl } from '../../../_/api.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import 'node:url';

const verifyEmailOtp_post = defineEventHandler(async (event) => {
  const targetUrl = getApiUrl("/auth/verifyEmailOtp");
  const authHeader = getHeader(event, "authorization");
  return proxyRequest(event, targetUrl, {
    fetch: $fetch.native,
    headers: authHeader ? { "Authorization": authHeader } : {}
  });
});

export { verifyEmailOtp_post as default };
//# sourceMappingURL=verifyEmailOtp.post.mjs.map
