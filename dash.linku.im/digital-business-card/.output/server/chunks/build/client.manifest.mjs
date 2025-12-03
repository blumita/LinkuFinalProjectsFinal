import { Server as Server$1 } from 'node:http';
import { Server } from 'node:https';
import { t as toNodeListener, q as destr, u as useRuntimeConfig, v as trapUnhandledNodeErrors, w as setupGracefulShutdown, l as useNitroApp } from '../_/nitro.mjs';
import 'file:///C:/Users/babaw/Downloads/projects_backup/dash.linku.im/digital-business-card/node_modules/@nuxt/vite-builder/dist/runtime/vite-node.mjs';
import 'file:///C:/Users/babaw/Downloads/projects_backup/dash.linku.im/digital-business-card/node_modules/@nuxt/vite-builder/dist/runtime/client.manifest.mjs';

const cert = process.env.NITRO_SSL_CERT;
const key = process.env.NITRO_SSL_KEY;
const nitroApp = useNitroApp();
const server$1 = cert && key ? new Server({ key, cert }, toNodeListener(nitroApp.h3App)) : new Server$1(toNodeListener(nitroApp.h3App));
const port = destr(process.env.NITRO_PORT || process.env.PORT) || 3e3;
const host = process.env.NITRO_HOST || process.env.HOST;
const path = process.env.NITRO_UNIX_SOCKET;
const listener = server$1.listen(path ? { path } : { port, host }, (err) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  const protocol = cert && key ? "https" : "http";
  const addressInfo = listener.address();
  if (typeof addressInfo === "string") {
    console.log(`Listening on unix socket ${addressInfo}`);
    return;
  }
  const baseURL = (useRuntimeConfig().app.baseURL || "").replace(/\/$/, "");
  const url = `${protocol}://${addressInfo.family === "IPv6" ? `[${addressInfo.address}]` : addressInfo.address}:${addressInfo.port}${baseURL}`;
  console.log(`Listening on ${url}`);
});
trapUnhandledNodeErrors();
setupGracefulShutdown(listener, nitroApp);
const nodeServer = {};

const getPreviewStats_get = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null
}, Symbol.toStringTag, { value: 'Module' }));

const server = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: default
}, Symbol.toStringTag, { value: 'Module' }));

const client_manifest = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: default
}, Symbol.toStringTag, { value: 'Module' }));

export { client_manifest as c, getPreviewStats_get as g, nodeServer as n, server as s };
//# sourceMappingURL=client.manifest.mjs.map
