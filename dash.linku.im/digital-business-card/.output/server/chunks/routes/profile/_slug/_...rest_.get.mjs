import { d as defineEventHandler, a as sendRedirect } from '../../../_/nitro.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import 'node:url';

const ____rest__get = defineEventHandler((event) => {
  const { slug } = event.context.params;
  const redirectPath = `/${slug}`;
  return sendRedirect(event, redirectPath, 301);
});

export { ____rest__get as default };
//# sourceMappingURL=_...rest_.get.mjs.map
