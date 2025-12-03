import process from 'node:process';globalThis._importMeta_=globalThis._importMeta_||{url:"file:///_entry.js",env:process.env};import http from 'node:http';
import https from 'node:https';
import { EventEmitter } from 'node:events';
import { Buffer as Buffer$1 } from 'node:buffer';
import { promises, existsSync } from 'node:fs';
import { resolve as resolve$1, dirname as dirname$1, join } from 'node:path';
import { createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';

const suspectProtoRx = /"(?:_|\\u0{2}5[Ff]){2}(?:p|\\u0{2}70)(?:r|\\u0{2}72)(?:o|\\u0{2}6[Ff])(?:t|\\u0{2}74)(?:o|\\u0{2}6[Ff])(?:_|\\u0{2}5[Ff]){2}"\s*:/;
const suspectConstructorRx = /"(?:c|\\u0063)(?:o|\\u006[Ff])(?:n|\\u006[Ee])(?:s|\\u0073)(?:t|\\u0074)(?:r|\\u0072)(?:u|\\u0075)(?:c|\\u0063)(?:t|\\u0074)(?:o|\\u006[Ff])(?:r|\\u0072)"\s*:/;
const JsonSigRx = /^\s*["[{]|^\s*-?\d{1,16}(\.\d{1,17})?([Ee][+-]?\d+)?\s*$/;
function jsonParseTransform(key, value) {
  if (key === "__proto__" || key === "constructor" && value && typeof value === "object" && "prototype" in value) {
    warnKeyDropped(key);
    return;
  }
  return value;
}
function warnKeyDropped(key) {
  console.warn(`[destr] Dropping "${key}" key to prevent prototype pollution.`);
}
function destr(value, options = {}) {
  if (typeof value !== "string") {
    return value;
  }
  if (value[0] === '"' && value[value.length - 1] === '"' && value.indexOf("\\") === -1) {
    return value.slice(1, -1);
  }
  const _value = value.trim();
  if (_value.length <= 9) {
    switch (_value.toLowerCase()) {
      case "true": {
        return true;
      }
      case "false": {
        return false;
      }
      case "undefined": {
        return void 0;
      }
      case "null": {
        return null;
      }
      case "nan": {
        return Number.NaN;
      }
      case "infinity": {
        return Number.POSITIVE_INFINITY;
      }
      case "-infinity": {
        return Number.NEGATIVE_INFINITY;
      }
    }
  }
  if (!JsonSigRx.test(value)) {
    if (options.strict) {
      throw new SyntaxError("[destr] Invalid JSON");
    }
    return value;
  }
  try {
    if (suspectProtoRx.test(value) || suspectConstructorRx.test(value)) {
      if (options.strict) {
        throw new Error("[destr] Possible prototype pollution");
      }
      return JSON.parse(value, jsonParseTransform);
    }
    return JSON.parse(value);
  } catch (error) {
    if (options.strict) {
      throw error;
    }
    return value;
  }
}

const HASH_RE = /#/g;
const AMPERSAND_RE = /&/g;
const SLASH_RE = /\//g;
const EQUAL_RE = /=/g;
const PLUS_RE = /\+/g;
const ENC_CARET_RE = /%5e/gi;
const ENC_BACKTICK_RE = /%60/gi;
const ENC_PIPE_RE = /%7c/gi;
const ENC_SPACE_RE = /%20/gi;
const ENC_SLASH_RE = /%2f/gi;
function encode(text) {
  return encodeURI("" + text).replace(ENC_PIPE_RE, "|");
}
function encodeQueryValue(input) {
  return encode(typeof input === "string" ? input : JSON.stringify(input)).replace(PLUS_RE, "%2B").replace(ENC_SPACE_RE, "+").replace(HASH_RE, "%23").replace(AMPERSAND_RE, "%26").replace(ENC_BACKTICK_RE, "`").replace(ENC_CARET_RE, "^").replace(SLASH_RE, "%2F");
}
function encodeQueryKey(text) {
  return encodeQueryValue(text).replace(EQUAL_RE, "%3D");
}
function decode$1(text = "") {
  try {
    return decodeURIComponent("" + text);
  } catch {
    return "" + text;
  }
}
function decodePath(text) {
  return decode$1(text.replace(ENC_SLASH_RE, "%252F"));
}
function decodeQueryKey(text) {
  return decode$1(text.replace(PLUS_RE, " "));
}
function decodeQueryValue(text) {
  return decode$1(text.replace(PLUS_RE, " "));
}

function parseQuery(parametersString = "") {
  const object = /* @__PURE__ */ Object.create(null);
  if (parametersString[0] === "?") {
    parametersString = parametersString.slice(1);
  }
  for (const parameter of parametersString.split("&")) {
    const s = parameter.match(/([^=]+)=?(.*)/) || [];
    if (s.length < 2) {
      continue;
    }
    const key = decodeQueryKey(s[1]);
    if (key === "__proto__" || key === "constructor") {
      continue;
    }
    const value = decodeQueryValue(s[2] || "");
    if (object[key] === void 0) {
      object[key] = value;
    } else if (Array.isArray(object[key])) {
      object[key].push(value);
    } else {
      object[key] = [object[key], value];
    }
  }
  return object;
}
function encodeQueryItem(key, value) {
  if (typeof value === "number" || typeof value === "boolean") {
    value = String(value);
  }
  if (!value) {
    return encodeQueryKey(key);
  }
  if (Array.isArray(value)) {
    return value.map(
      (_value) => `${encodeQueryKey(key)}=${encodeQueryValue(_value)}`
    ).join("&");
  }
  return `${encodeQueryKey(key)}=${encodeQueryValue(value)}`;
}
function stringifyQuery(query) {
  return Object.keys(query).filter((k) => query[k] !== void 0).map((k) => encodeQueryItem(k, query[k])).filter(Boolean).join("&");
}

const PROTOCOL_STRICT_REGEX = /^[\s\w\0+.-]{2,}:([/\\]{1,2})/;
const PROTOCOL_REGEX = /^[\s\w\0+.-]{2,}:([/\\]{2})?/;
const PROTOCOL_RELATIVE_REGEX = /^([/\\]\s*){2,}[^/\\]/;
const PROTOCOL_SCRIPT_RE = /^[\s\0]*(blob|data|javascript|vbscript):$/i;
const TRAILING_SLASH_RE = /\/$|\/\?|\/#/;
const JOIN_LEADING_SLASH_RE = /^\.?\//;
function hasProtocol(inputString, opts = {}) {
  if (typeof opts === "boolean") {
    opts = { acceptRelative: opts };
  }
  if (opts.strict) {
    return PROTOCOL_STRICT_REGEX.test(inputString);
  }
  return PROTOCOL_REGEX.test(inputString) || (opts.acceptRelative ? PROTOCOL_RELATIVE_REGEX.test(inputString) : false);
}
function isScriptProtocol(protocol) {
  return !!protocol && PROTOCOL_SCRIPT_RE.test(protocol);
}
function hasTrailingSlash(input = "", respectQueryAndFragment) {
  if (!respectQueryAndFragment) {
    return input.endsWith("/");
  }
  return TRAILING_SLASH_RE.test(input);
}
function withoutTrailingSlash(input = "", respectQueryAndFragment) {
  if (!respectQueryAndFragment) {
    return (hasTrailingSlash(input) ? input.slice(0, -1) : input) || "/";
  }
  if (!hasTrailingSlash(input, true)) {
    return input || "/";
  }
  let path = input;
  let fragment = "";
  const fragmentIndex = input.indexOf("#");
  if (fragmentIndex !== -1) {
    path = input.slice(0, fragmentIndex);
    fragment = input.slice(fragmentIndex);
  }
  const [s0, ...s] = path.split("?");
  const cleanPath = s0.endsWith("/") ? s0.slice(0, -1) : s0;
  return (cleanPath || "/") + (s.length > 0 ? `?${s.join("?")}` : "") + fragment;
}
function withTrailingSlash(input = "", respectQueryAndFragment) {
  if (!respectQueryAndFragment) {
    return input.endsWith("/") ? input : input + "/";
  }
  if (hasTrailingSlash(input, true)) {
    return input || "/";
  }
  let path = input;
  let fragment = "";
  const fragmentIndex = input.indexOf("#");
  if (fragmentIndex !== -1) {
    path = input.slice(0, fragmentIndex);
    fragment = input.slice(fragmentIndex);
    if (!path) {
      return fragment;
    }
  }
  const [s0, ...s] = path.split("?");
  return s0 + "/" + (s.length > 0 ? `?${s.join("?")}` : "") + fragment;
}
function hasLeadingSlash(input = "") {
  return input.startsWith("/");
}
function withLeadingSlash(input = "") {
  return hasLeadingSlash(input) ? input : "/" + input;
}
function withBase(input, base) {
  if (isEmptyURL(base) || hasProtocol(input)) {
    return input;
  }
  const _base = withoutTrailingSlash(base);
  if (input.startsWith(_base)) {
    return input;
  }
  return joinURL(_base, input);
}
function withoutBase(input, base) {
  if (isEmptyURL(base)) {
    return input;
  }
  const _base = withoutTrailingSlash(base);
  if (!input.startsWith(_base)) {
    return input;
  }
  const trimmed = input.slice(_base.length);
  return trimmed[0] === "/" ? trimmed : "/" + trimmed;
}
function withQuery(input, query) {
  const parsed = parseURL(input);
  const mergedQuery = { ...parseQuery(parsed.search), ...query };
  parsed.search = stringifyQuery(mergedQuery);
  return stringifyParsedURL(parsed);
}
function getQuery$1(input) {
  return parseQuery(parseURL(input).search);
}
function isEmptyURL(url) {
  return !url || url === "/";
}
function isNonEmptyURL(url) {
  return url && url !== "/";
}
function joinURL(base, ...input) {
  let url = base || "";
  for (const segment of input.filter((url2) => isNonEmptyURL(url2))) {
    if (url) {
      const _segment = segment.replace(JOIN_LEADING_SLASH_RE, "");
      url = withTrailingSlash(url) + _segment;
    } else {
      url = segment;
    }
  }
  return url;
}
function joinRelativeURL(..._input) {
  const JOIN_SEGMENT_SPLIT_RE = /\/(?!\/)/;
  const input = _input.filter(Boolean);
  const segments = [];
  let segmentsDepth = 0;
  for (const i of input) {
    if (!i || i === "/") {
      continue;
    }
    for (const [sindex, s] of i.split(JOIN_SEGMENT_SPLIT_RE).entries()) {
      if (!s || s === ".") {
        continue;
      }
      if (s === "..") {
        if (segments.length === 1 && hasProtocol(segments[0])) {
          continue;
        }
        segments.pop();
        segmentsDepth--;
        continue;
      }
      if (sindex === 1 && segments[segments.length - 1]?.endsWith(":/")) {
        segments[segments.length - 1] += "/" + s;
        continue;
      }
      segments.push(s);
      segmentsDepth++;
    }
  }
  let url = segments.join("/");
  if (segmentsDepth >= 0) {
    if (input[0]?.startsWith("/") && !url.startsWith("/")) {
      url = "/" + url;
    } else if (input[0]?.startsWith("./") && !url.startsWith("./")) {
      url = "./" + url;
    }
  } else {
    url = "../".repeat(-1 * segmentsDepth) + url;
  }
  if (input[input.length - 1]?.endsWith("/") && !url.endsWith("/")) {
    url += "/";
  }
  return url;
}

const protocolRelative = Symbol.for("ufo:protocolRelative");
function parseURL(input = "", defaultProto) {
  const _specialProtoMatch = input.match(
    /^[\s\0]*(blob:|data:|javascript:|vbscript:)(.*)/i
  );
  if (_specialProtoMatch) {
    const [, _proto, _pathname = ""] = _specialProtoMatch;
    return {
      protocol: _proto.toLowerCase(),
      pathname: _pathname,
      href: _proto + _pathname,
      auth: "",
      host: "",
      search: "",
      hash: ""
    };
  }
  if (!hasProtocol(input, { acceptRelative: true })) {
    return parsePath(input);
  }
  const [, protocol = "", auth, hostAndPath = ""] = input.replace(/\\/g, "/").match(/^[\s\0]*([\w+.-]{2,}:)?\/\/([^/@]+@)?(.*)/) || [];
  let [, host = "", path = ""] = hostAndPath.match(/([^#/?]*)(.*)?/) || [];
  if (protocol === "file:") {
    path = path.replace(/\/(?=[A-Za-z]:)/, "");
  }
  const { pathname, search, hash } = parsePath(path);
  return {
    protocol: protocol.toLowerCase(),
    auth: auth ? auth.slice(0, Math.max(0, auth.length - 1)) : "",
    host,
    pathname,
    search,
    hash,
    [protocolRelative]: !protocol
  };
}
function parsePath(input = "") {
  const [pathname = "", search = "", hash = ""] = (input.match(/([^#?]*)(\?[^#]*)?(#.*)?/) || []).splice(1);
  return {
    pathname,
    search,
    hash
  };
}
function stringifyParsedURL(parsed) {
  const pathname = parsed.pathname || "";
  const search = parsed.search ? (parsed.search.startsWith("?") ? "" : "?") + parsed.search : "";
  const hash = parsed.hash || "";
  const auth = parsed.auth ? parsed.auth + "@" : "";
  const host = parsed.host || "";
  const proto = parsed.protocol || parsed[protocolRelative] ? (parsed.protocol || "") + "//" : "";
  return proto + auth + host + pathname + search + hash;
}

function parse(str, options) {
  if (typeof str !== "string") {
    throw new TypeError("argument str must be a string");
  }
  const obj = {};
  const opt = {};
  const dec = opt.decode || decode;
  let index = 0;
  while (index < str.length) {
    const eqIdx = str.indexOf("=", index);
    if (eqIdx === -1) {
      break;
    }
    let endIdx = str.indexOf(";", index);
    if (endIdx === -1) {
      endIdx = str.length;
    } else if (endIdx < eqIdx) {
      index = str.lastIndexOf(";", eqIdx - 1) + 1;
      continue;
    }
    const key = str.slice(index, eqIdx).trim();
    if (opt?.filter && !opt?.filter(key)) {
      index = endIdx + 1;
      continue;
    }
    if (void 0 === obj[key]) {
      let val = str.slice(eqIdx + 1, endIdx).trim();
      if (val.codePointAt(0) === 34) {
        val = val.slice(1, -1);
      }
      obj[key] = tryDecode(val, dec);
    }
    index = endIdx + 1;
  }
  return obj;
}
function decode(str) {
  return str.includes("%") ? decodeURIComponent(str) : str;
}
function tryDecode(str, decode2) {
  try {
    return decode2(str);
  } catch {
    return str;
  }
}

const fieldContentRegExp = /^[\u0009\u0020-\u007E\u0080-\u00FF]+$/;
function serialize$2(name, value, options) {
  const opt = options || {};
  const enc = opt.encode || encodeURIComponent;
  if (typeof enc !== "function") {
    throw new TypeError("option encode is invalid");
  }
  if (!fieldContentRegExp.test(name)) {
    throw new TypeError("argument name is invalid");
  }
  const encodedValue = enc(value);
  if (encodedValue && !fieldContentRegExp.test(encodedValue)) {
    throw new TypeError("argument val is invalid");
  }
  let str = name + "=" + encodedValue;
  if (void 0 !== opt.maxAge && opt.maxAge !== null) {
    const maxAge = opt.maxAge - 0;
    if (Number.isNaN(maxAge) || !Number.isFinite(maxAge)) {
      throw new TypeError("option maxAge is invalid");
    }
    str += "; Max-Age=" + Math.floor(maxAge);
  }
  if (opt.domain) {
    if (!fieldContentRegExp.test(opt.domain)) {
      throw new TypeError("option domain is invalid");
    }
    str += "; Domain=" + opt.domain;
  }
  if (opt.path) {
    if (!fieldContentRegExp.test(opt.path)) {
      throw new TypeError("option path is invalid");
    }
    str += "; Path=" + opt.path;
  }
  if (opt.expires) {
    if (!isDate(opt.expires) || Number.isNaN(opt.expires.valueOf())) {
      throw new TypeError("option expires is invalid");
    }
    str += "; Expires=" + opt.expires.toUTCString();
  }
  if (opt.httpOnly) {
    str += "; HttpOnly";
  }
  if (opt.secure) {
    str += "; Secure";
  }
  if (opt.priority) {
    const priority = typeof opt.priority === "string" ? opt.priority.toLowerCase() : opt.priority;
    switch (priority) {
      case "low": {
        str += "; Priority=Low";
        break;
      }
      case "medium": {
        str += "; Priority=Medium";
        break;
      }
      case "high": {
        str += "; Priority=High";
        break;
      }
      default: {
        throw new TypeError("option priority is invalid");
      }
    }
  }
  if (opt.sameSite) {
    const sameSite = typeof opt.sameSite === "string" ? opt.sameSite.toLowerCase() : opt.sameSite;
    switch (sameSite) {
      case true: {
        str += "; SameSite=Strict";
        break;
      }
      case "lax": {
        str += "; SameSite=Lax";
        break;
      }
      case "strict": {
        str += "; SameSite=Strict";
        break;
      }
      case "none": {
        str += "; SameSite=None";
        break;
      }
      default: {
        throw new TypeError("option sameSite is invalid");
      }
    }
  }
  if (opt.partitioned) {
    str += "; Partitioned";
  }
  return str;
}
function isDate(val) {
  return Object.prototype.toString.call(val) === "[object Date]" || val instanceof Date;
}

function parseSetCookie(setCookieValue, options) {
  const parts = (setCookieValue || "").split(";").filter((str) => typeof str === "string" && !!str.trim());
  const nameValuePairStr = parts.shift() || "";
  const parsed = _parseNameValuePair(nameValuePairStr);
  const name = parsed.name;
  let value = parsed.value;
  try {
    value = options?.decode === false ? value : (options?.decode || decodeURIComponent)(value);
  } catch {
  }
  const cookie = {
    name,
    value
  };
  for (const part of parts) {
    const sides = part.split("=");
    const partKey = (sides.shift() || "").trimStart().toLowerCase();
    const partValue = sides.join("=");
    switch (partKey) {
      case "expires": {
        cookie.expires = new Date(partValue);
        break;
      }
      case "max-age": {
        cookie.maxAge = Number.parseInt(partValue, 10);
        break;
      }
      case "secure": {
        cookie.secure = true;
        break;
      }
      case "httponly": {
        cookie.httpOnly = true;
        break;
      }
      case "samesite": {
        cookie.sameSite = partValue;
        break;
      }
      default: {
        cookie[partKey] = partValue;
      }
    }
  }
  return cookie;
}
function _parseNameValuePair(nameValuePairStr) {
  let name = "";
  let value = "";
  const nameValueArr = nameValuePairStr.split("=");
  if (nameValueArr.length > 1) {
    name = nameValueArr.shift();
    value = nameValueArr.join("=");
  } else {
    value = nameValuePairStr;
  }
  return { name, value };
}

const NODE_TYPES = {
  NORMAL: 0,
  WILDCARD: 1,
  PLACEHOLDER: 2
};

function createRouter$1(options = {}) {
  const ctx = {
    options,
    rootNode: createRadixNode(),
    staticRoutesMap: {}
  };
  const normalizeTrailingSlash = (p) => options.strictTrailingSlash ? p : p.replace(/\/$/, "") || "/";
  if (options.routes) {
    for (const path in options.routes) {
      insert(ctx, normalizeTrailingSlash(path), options.routes[path]);
    }
  }
  return {
    ctx,
    lookup: (path) => lookup(ctx, normalizeTrailingSlash(path)),
    insert: (path, data) => insert(ctx, normalizeTrailingSlash(path), data),
    remove: (path) => remove(ctx, normalizeTrailingSlash(path))
  };
}
function lookup(ctx, path) {
  const staticPathNode = ctx.staticRoutesMap[path];
  if (staticPathNode) {
    return staticPathNode.data;
  }
  const sections = path.split("/");
  const params = {};
  let paramsFound = false;
  let wildcardNode = null;
  let node = ctx.rootNode;
  let wildCardParam = null;
  for (let i = 0; i < sections.length; i++) {
    const section = sections[i];
    if (node.wildcardChildNode !== null) {
      wildcardNode = node.wildcardChildNode;
      wildCardParam = sections.slice(i).join("/");
    }
    const nextNode = node.children.get(section);
    if (nextNode === void 0) {
      if (node && node.placeholderChildren.length > 1) {
        const remaining = sections.length - i;
        node = node.placeholderChildren.find((c) => c.maxDepth === remaining) || null;
      } else {
        node = node.placeholderChildren[0] || null;
      }
      if (!node) {
        break;
      }
      if (node.paramName) {
        params[node.paramName] = section;
      }
      paramsFound = true;
    } else {
      node = nextNode;
    }
  }
  if ((node === null || node.data === null) && wildcardNode !== null) {
    node = wildcardNode;
    params[node.paramName || "_"] = wildCardParam;
    paramsFound = true;
  }
  if (!node) {
    return null;
  }
  if (paramsFound) {
    return {
      ...node.data,
      params: paramsFound ? params : void 0
    };
  }
  return node.data;
}
function insert(ctx, path, data) {
  let isStaticRoute = true;
  const sections = path.split("/");
  let node = ctx.rootNode;
  let _unnamedPlaceholderCtr = 0;
  const matchedNodes = [node];
  for (const section of sections) {
    let childNode;
    if (childNode = node.children.get(section)) {
      node = childNode;
    } else {
      const type = getNodeType(section);
      childNode = createRadixNode({ type, parent: node });
      node.children.set(section, childNode);
      if (type === NODE_TYPES.PLACEHOLDER) {
        childNode.paramName = section === "*" ? `_${_unnamedPlaceholderCtr++}` : section.slice(1);
        node.placeholderChildren.push(childNode);
        isStaticRoute = false;
      } else if (type === NODE_TYPES.WILDCARD) {
        node.wildcardChildNode = childNode;
        childNode.paramName = section.slice(
          3
          /* "**:" */
        ) || "_";
        isStaticRoute = false;
      }
      matchedNodes.push(childNode);
      node = childNode;
    }
  }
  for (const [depth, node2] of matchedNodes.entries()) {
    node2.maxDepth = Math.max(matchedNodes.length - depth, node2.maxDepth || 0);
  }
  node.data = data;
  if (isStaticRoute === true) {
    ctx.staticRoutesMap[path] = node;
  }
  return node;
}
function remove(ctx, path) {
  let success = false;
  const sections = path.split("/");
  let node = ctx.rootNode;
  for (const section of sections) {
    node = node.children.get(section);
    if (!node) {
      return success;
    }
  }
  if (node.data) {
    const lastSection = sections.at(-1) || "";
    node.data = null;
    if (Object.keys(node.children).length === 0 && node.parent) {
      node.parent.children.delete(lastSection);
      node.parent.wildcardChildNode = null;
      node.parent.placeholderChildren = [];
    }
    success = true;
  }
  return success;
}
function createRadixNode(options = {}) {
  return {
    type: options.type || NODE_TYPES.NORMAL,
    maxDepth: 0,
    parent: options.parent || null,
    children: /* @__PURE__ */ new Map(),
    data: options.data || null,
    paramName: options.paramName || null,
    wildcardChildNode: null,
    placeholderChildren: []
  };
}
function getNodeType(str) {
  if (str.startsWith("**")) {
    return NODE_TYPES.WILDCARD;
  }
  if (str[0] === ":" || str === "*") {
    return NODE_TYPES.PLACEHOLDER;
  }
  return NODE_TYPES.NORMAL;
}

function toRouteMatcher(router) {
  const table = _routerNodeToTable("", router.ctx.rootNode);
  return _createMatcher(table, router.ctx.options.strictTrailingSlash);
}
function _createMatcher(table, strictTrailingSlash) {
  return {
    ctx: { table },
    matchAll: (path) => _matchRoutes(path, table, strictTrailingSlash)
  };
}
function _createRouteTable() {
  return {
    static: /* @__PURE__ */ new Map(),
    wildcard: /* @__PURE__ */ new Map(),
    dynamic: /* @__PURE__ */ new Map()
  };
}
function _matchRoutes(path, table, strictTrailingSlash) {
  if (strictTrailingSlash !== true && path.endsWith("/")) {
    path = path.slice(0, -1) || "/";
  }
  const matches = [];
  for (const [key, value] of _sortRoutesMap(table.wildcard)) {
    if (path === key || path.startsWith(key + "/")) {
      matches.push(value);
    }
  }
  for (const [key, value] of _sortRoutesMap(table.dynamic)) {
    if (path.startsWith(key + "/")) {
      const subPath = "/" + path.slice(key.length).split("/").splice(2).join("/");
      matches.push(..._matchRoutes(subPath, value));
    }
  }
  const staticMatch = table.static.get(path);
  if (staticMatch) {
    matches.push(staticMatch);
  }
  return matches.filter(Boolean);
}
function _sortRoutesMap(m) {
  return [...m.entries()].sort((a, b) => a[0].length - b[0].length);
}
function _routerNodeToTable(initialPath, initialNode) {
  const table = _createRouteTable();
  function _addNode(path, node) {
    if (path) {
      if (node.type === NODE_TYPES.NORMAL && !(path.includes("*") || path.includes(":"))) {
        if (node.data) {
          table.static.set(path, node.data);
        }
      } else if (node.type === NODE_TYPES.WILDCARD) {
        table.wildcard.set(path.replace("/**", ""), node.data);
      } else if (node.type === NODE_TYPES.PLACEHOLDER) {
        const subTable = _routerNodeToTable("", node);
        if (node.data) {
          subTable.static.set("/", node.data);
        }
        table.dynamic.set(path.replace(/\/\*|\/:\w+/, ""), subTable);
        return;
      }
    }
    for (const [childPath, child] of node.children.entries()) {
      _addNode(`${path}/${childPath}`.replace("//", "/"), child);
    }
  }
  _addNode(initialPath, initialNode);
  return table;
}

function isPlainObject(value) {
  if (value === null || typeof value !== "object") {
    return false;
  }
  const prototype = Object.getPrototypeOf(value);
  if (prototype !== null && prototype !== Object.prototype && Object.getPrototypeOf(prototype) !== null) {
    return false;
  }
  if (Symbol.iterator in value) {
    return false;
  }
  if (Symbol.toStringTag in value) {
    return Object.prototype.toString.call(value) === "[object Module]";
  }
  return true;
}

function _defu(baseObject, defaults, namespace = ".", merger) {
  if (!isPlainObject(defaults)) {
    return _defu(baseObject, {}, namespace, merger);
  }
  const object = Object.assign({}, defaults);
  for (const key in baseObject) {
    if (key === "__proto__" || key === "constructor") {
      continue;
    }
    const value = baseObject[key];
    if (value === null || value === void 0) {
      continue;
    }
    if (merger && merger(object, key, value, namespace)) {
      continue;
    }
    if (Array.isArray(value) && Array.isArray(object[key])) {
      object[key] = [...value, ...object[key]];
    } else if (isPlainObject(value) && isPlainObject(object[key])) {
      object[key] = _defu(
        value,
        object[key],
        (namespace ? `${namespace}.` : "") + key.toString(),
        merger
      );
    } else {
      object[key] = value;
    }
  }
  return object;
}
function createDefu(merger) {
  return (...arguments_) => (
    // eslint-disable-next-line unicorn/no-array-reduce
    arguments_.reduce((p, c) => _defu(p, c, "", merger), {})
  );
}
const defu = createDefu();
const defuFn = createDefu((object, key, currentValue) => {
  if (object[key] !== void 0 && typeof currentValue === "function") {
    object[key] = currentValue(object[key]);
    return true;
  }
});

function o(n){throw new Error(`${n} is not implemented yet!`)}let i$1 = class i extends EventEmitter{__unenv__={};readableEncoding=null;readableEnded=true;readableFlowing=false;readableHighWaterMark=0;readableLength=0;readableObjectMode=false;readableAborted=false;readableDidRead=false;closed=false;errored=null;readable=false;destroyed=false;static from(e,t){return new i(t)}constructor(e){super();}_read(e){}read(e){}setEncoding(e){return this}pause(){return this}resume(){return this}isPaused(){return  true}unpipe(e){return this}unshift(e,t){}wrap(e){return this}push(e,t){return  false}_destroy(e,t){this.removeAllListeners();}destroy(e){return this.destroyed=true,this._destroy(e),this}pipe(e,t){return {}}compose(e,t){throw new Error("Method not implemented.")}[Symbol.asyncDispose](){return this.destroy(),Promise.resolve()}async*[Symbol.asyncIterator](){throw o("Readable.asyncIterator")}iterator(e){throw o("Readable.iterator")}map(e,t){throw o("Readable.map")}filter(e,t){throw o("Readable.filter")}forEach(e,t){throw o("Readable.forEach")}reduce(e,t,r){throw o("Readable.reduce")}find(e,t){throw o("Readable.find")}findIndex(e,t){throw o("Readable.findIndex")}some(e,t){throw o("Readable.some")}toArray(e){throw o("Readable.toArray")}every(e,t){throw o("Readable.every")}flatMap(e,t){throw o("Readable.flatMap")}drop(e,t){throw o("Readable.drop")}take(e,t){throw o("Readable.take")}asIndexedPairs(e){throw o("Readable.asIndexedPairs")}};let l$1 = class l extends EventEmitter{__unenv__={};writable=true;writableEnded=false;writableFinished=false;writableHighWaterMark=0;writableLength=0;writableObjectMode=false;writableCorked=0;closed=false;errored=null;writableNeedDrain=false;writableAborted=false;destroyed=false;_data;_encoding="utf8";constructor(e){super();}pipe(e,t){return {}}_write(e,t,r){if(this.writableEnded){r&&r();return}if(this._data===void 0)this._data=e;else {const s=typeof this._data=="string"?Buffer$1.from(this._data,this._encoding||t||"utf8"):this._data,a=typeof e=="string"?Buffer$1.from(e,t||this._encoding||"utf8"):e;this._data=Buffer$1.concat([s,a]);}this._encoding=t,r&&r();}_writev(e,t){}_destroy(e,t){}_final(e){}write(e,t,r){const s=typeof t=="string"?this._encoding:"utf8",a=typeof t=="function"?t:typeof r=="function"?r:void 0;return this._write(e,s,a),true}setDefaultEncoding(e){return this}end(e,t,r){const s=typeof e=="function"?e:typeof t=="function"?t:typeof r=="function"?r:void 0;if(this.writableEnded)return s&&s(),this;const a=e===s?void 0:e;if(a){const u=t===s?void 0:t;this.write(a,u,s);}return this.writableEnded=true,this.writableFinished=true,this.emit("close"),this.emit("finish"),this}cork(){}uncork(){}destroy(e){return this.destroyed=true,delete this._data,this.removeAllListeners(),this}compose(e,t){throw new Error("Method not implemented.")}[Symbol.asyncDispose](){return Promise.resolve()}};const c$1=class c{allowHalfOpen=true;_destroy;constructor(e=new i$1,t=new l$1){Object.assign(this,e),Object.assign(this,t),this._destroy=m(e._destroy,t._destroy);}};function _(){return Object.assign(c$1.prototype,i$1.prototype),Object.assign(c$1.prototype,l$1.prototype),c$1}function m(...n){return function(...e){for(const t of n)t(...e);}}const g=_();class A extends g{__unenv__={};bufferSize=0;bytesRead=0;bytesWritten=0;connecting=false;destroyed=false;pending=false;localAddress="";localPort=0;remoteAddress="";remoteFamily="";remotePort=0;autoSelectFamilyAttemptedAddresses=[];readyState="readOnly";constructor(e){super();}write(e,t,r){return  false}connect(e,t,r){return this}end(e,t,r){return this}setEncoding(e){return this}pause(){return this}resume(){return this}setTimeout(e,t){return this}setNoDelay(e){return this}setKeepAlive(e,t){return this}address(){return {}}unref(){return this}ref(){return this}destroySoon(){this.destroy();}resetAndDestroy(){const e=new Error("ERR_SOCKET_CLOSED");return e.code="ERR_SOCKET_CLOSED",this.destroy(e),this}}class y extends i$1{aborted=false;httpVersion="1.1";httpVersionMajor=1;httpVersionMinor=1;complete=true;connection;socket;headers={};trailers={};method="GET";url="/";statusCode=200;statusMessage="";closed=false;errored=null;readable=false;constructor(e){super(),this.socket=this.connection=e||new A;}get rawHeaders(){const e=this.headers,t=[];for(const r in e)if(Array.isArray(e[r]))for(const s of e[r])t.push(r,s);else t.push(r,e[r]);return t}get rawTrailers(){return []}setTimeout(e,t){return this}get headersDistinct(){return p(this.headers)}get trailersDistinct(){return p(this.trailers)}}function p(n){const e={};for(const[t,r]of Object.entries(n))t&&(e[t]=(Array.isArray(r)?r:[r]).filter(Boolean));return e}class w extends l$1{statusCode=200;statusMessage="";upgrading=false;chunkedEncoding=false;shouldKeepAlive=false;useChunkedEncodingByDefault=false;sendDate=false;finished=false;headersSent=false;strictContentLength=false;connection=null;socket=null;req;_headers={};constructor(e){super(),this.req=e;}assignSocket(e){e._httpMessage=this,this.socket=e,this.connection=e,this.emit("socket",e),this._flush();}_flush(){this.flushHeaders();}detachSocket(e){}writeContinue(e){}writeHead(e,t,r){e&&(this.statusCode=e),typeof t=="string"&&(this.statusMessage=t,t=void 0);const s=r||t;if(s&&!Array.isArray(s))for(const a in s)this.setHeader(a,s[a]);return this.headersSent=true,this}writeProcessing(){}setTimeout(e,t){return this}appendHeader(e,t){e=e.toLowerCase();const r=this._headers[e],s=[...Array.isArray(r)?r:[r],...Array.isArray(t)?t:[t]].filter(Boolean);return this._headers[e]=s.length>1?s:s[0],this}setHeader(e,t){return this._headers[e.toLowerCase()]=t,this}setHeaders(e){for(const[t,r]of Object.entries(e))this.setHeader(t,r);return this}getHeader(e){return this._headers[e.toLowerCase()]}getHeaders(){return this._headers}getHeaderNames(){return Object.keys(this._headers)}hasHeader(e){return e.toLowerCase()in this._headers}removeHeader(e){delete this._headers[e.toLowerCase()];}addTrailers(e){}flushHeaders(){}writeEarlyHints(e,t){typeof t=="function"&&t();}}const E=(()=>{const n=function(){};return n.prototype=Object.create(null),n})();function R(n={}){const e=new E,t=Array.isArray(n)||H(n)?n:Object.entries(n);for(const[r,s]of t)if(s){if(e[r]===void 0){e[r]=s;continue}e[r]=[...Array.isArray(e[r])?e[r]:[e[r]],...Array.isArray(s)?s:[s]];}return e}function H(n){return typeof n?.entries=="function"}function v(n={}){if(n instanceof Headers)return n;const e=new Headers;for(const[t,r]of Object.entries(n))if(r!==void 0){if(Array.isArray(r)){for(const s of r)e.append(t,String(s));continue}e.set(t,String(r));}return e}const S=new Set([101,204,205,304]);async function b(n,e){const t=new y,r=new w(t);t.url=e.url?.toString()||"/";let s;if(!t.url.startsWith("/")){const d=new URL(t.url);s=d.host,t.url=d.pathname+d.search+d.hash;}t.method=e.method||"GET",t.headers=R(e.headers||{}),t.headers.host||(t.headers.host=e.host||s||"localhost"),t.connection.encrypted=t.connection.encrypted||e.protocol==="https",t.body=e.body||null,t.__unenv__=e.context,await n(t,r);let a=r._data;(S.has(r.statusCode)||t.method.toUpperCase()==="HEAD")&&(a=null,delete r._headers["content-length"]);const u={status:r.statusCode,statusText:r.statusMessage,headers:r._headers,body:a};return t.destroy(),r.destroy(),u}async function C(n,e,t={}){try{const r=await b(n,{url:e,...t});return new Response(r.body,{status:r.status,statusText:r.statusText,headers:v(r.headers)})}catch(r){return new Response(r.toString(),{status:Number.parseInt(r.statusCode||r.code)||500,statusText:r.statusText})}}

function hasProp(obj, prop) {
  try {
    return prop in obj;
  } catch {
    return false;
  }
}

class H3Error extends Error {
  static __h3_error__ = true;
  statusCode = 500;
  fatal = false;
  unhandled = false;
  statusMessage;
  data;
  cause;
  constructor(message, opts = {}) {
    super(message, opts);
    if (opts.cause && !this.cause) {
      this.cause = opts.cause;
    }
  }
  toJSON() {
    const obj = {
      message: this.message,
      statusCode: sanitizeStatusCode(this.statusCode, 500)
    };
    if (this.statusMessage) {
      obj.statusMessage = sanitizeStatusMessage(this.statusMessage);
    }
    if (this.data !== void 0) {
      obj.data = this.data;
    }
    return obj;
  }
}
function createError$1(input) {
  if (typeof input === "string") {
    return new H3Error(input);
  }
  if (isError(input)) {
    return input;
  }
  const err = new H3Error(input.message ?? input.statusMessage ?? "", {
    cause: input.cause || input
  });
  if (hasProp(input, "stack")) {
    try {
      Object.defineProperty(err, "stack", {
        get() {
          return input.stack;
        }
      });
    } catch {
      try {
        err.stack = input.stack;
      } catch {
      }
    }
  }
  if (input.data) {
    err.data = input.data;
  }
  if (input.statusCode) {
    err.statusCode = sanitizeStatusCode(input.statusCode, err.statusCode);
  } else if (input.status) {
    err.statusCode = sanitizeStatusCode(input.status, err.statusCode);
  }
  if (input.statusMessage) {
    err.statusMessage = input.statusMessage;
  } else if (input.statusText) {
    err.statusMessage = input.statusText;
  }
  if (err.statusMessage) {
    const originalMessage = err.statusMessage;
    const sanitizedMessage = sanitizeStatusMessage(err.statusMessage);
    if (sanitizedMessage !== originalMessage) {
      console.warn(
        "[h3] Please prefer using `message` for longer error messages instead of `statusMessage`. In the future, `statusMessage` will be sanitized by default."
      );
    }
  }
  if (input.fatal !== void 0) {
    err.fatal = input.fatal;
  }
  if (input.unhandled !== void 0) {
    err.unhandled = input.unhandled;
  }
  return err;
}
function sendError(event, error, debug) {
  if (event.handled) {
    return;
  }
  const h3Error = isError(error) ? error : createError$1(error);
  const responseBody = {
    statusCode: h3Error.statusCode,
    statusMessage: h3Error.statusMessage,
    stack: [],
    data: h3Error.data
  };
  if (debug) {
    responseBody.stack = (h3Error.stack || "").split("\n").map((l) => l.trim());
  }
  if (event.handled) {
    return;
  }
  const _code = Number.parseInt(h3Error.statusCode);
  setResponseStatus(event, _code, h3Error.statusMessage);
  event.node.res.setHeader("content-type", MIMES.json);
  event.node.res.end(JSON.stringify(responseBody, void 0, 2));
}
function isError(input) {
  return input?.constructor?.__h3_error__ === true;
}

function getQuery(event) {
  return getQuery$1(event.path || "");
}
function isMethod(event, expected, allowHead) {
  if (typeof expected === "string") {
    if (event.method === expected) {
      return true;
    }
  } else if (expected.includes(event.method)) {
    return true;
  }
  return false;
}
function assertMethod(event, expected, allowHead) {
  if (!isMethod(event, expected)) {
    throw createError$1({
      statusCode: 405,
      statusMessage: "HTTP method is not allowed."
    });
  }
}
function getRequestHeaders(event) {
  const _headers = {};
  for (const key in event.node.req.headers) {
    const val = event.node.req.headers[key];
    _headers[key] = Array.isArray(val) ? val.filter(Boolean).join(", ") : val;
  }
  return _headers;
}
function getRequestHeader(event, name) {
  const headers = getRequestHeaders(event);
  const value = headers[name.toLowerCase()];
  return value;
}
const getHeader = getRequestHeader;
function getRequestHost(event, opts = {}) {
  if (opts.xForwardedHost) {
    const _header = event.node.req.headers["x-forwarded-host"];
    const xForwardedHost = (_header || "").split(",").shift()?.trim();
    if (xForwardedHost) {
      return xForwardedHost;
    }
  }
  return event.node.req.headers.host || "localhost";
}
function getRequestProtocol(event, opts = {}) {
  if (opts.xForwardedProto !== false && event.node.req.headers["x-forwarded-proto"] === "https") {
    return "https";
  }
  return event.node.req.connection?.encrypted ? "https" : "http";
}
function getRequestURL(event, opts = {}) {
  const host = getRequestHost(event, opts);
  const protocol = getRequestProtocol(event, opts);
  const path = (event.node.req.originalUrl || event.path).replace(
    /^[/\\]+/g,
    "/"
  );
  return new URL(path, `${protocol}://${host}`);
}

const RawBodySymbol = Symbol.for("h3RawBody");
const ParsedBodySymbol = Symbol.for("h3ParsedBody");
const PayloadMethods$1 = ["PATCH", "POST", "PUT", "DELETE"];
function readRawBody(event, encoding = "utf8") {
  assertMethod(event, PayloadMethods$1);
  const _rawBody = event._requestBody || event.web?.request?.body || event.node.req[RawBodySymbol] || event.node.req.rawBody || event.node.req.body;
  if (_rawBody) {
    const promise2 = Promise.resolve(_rawBody).then((_resolved) => {
      if (Buffer.isBuffer(_resolved)) {
        return _resolved;
      }
      if (typeof _resolved.pipeTo === "function") {
        return new Promise((resolve, reject) => {
          const chunks = [];
          _resolved.pipeTo(
            new WritableStream({
              write(chunk) {
                chunks.push(chunk);
              },
              close() {
                resolve(Buffer.concat(chunks));
              },
              abort(reason) {
                reject(reason);
              }
            })
          ).catch(reject);
        });
      } else if (typeof _resolved.pipe === "function") {
        return new Promise((resolve, reject) => {
          const chunks = [];
          _resolved.on("data", (chunk) => {
            chunks.push(chunk);
          }).on("end", () => {
            resolve(Buffer.concat(chunks));
          }).on("error", reject);
        });
      }
      if (_resolved.constructor === Object) {
        return Buffer.from(JSON.stringify(_resolved));
      }
      if (_resolved instanceof URLSearchParams) {
        return Buffer.from(_resolved.toString());
      }
      if (_resolved instanceof FormData) {
        return new Response(_resolved).bytes().then((uint8arr) => Buffer.from(uint8arr));
      }
      return Buffer.from(_resolved);
    });
    return encoding ? promise2.then((buff) => buff.toString(encoding)) : promise2;
  }
  if (!Number.parseInt(event.node.req.headers["content-length"] || "") && !String(event.node.req.headers["transfer-encoding"] ?? "").split(",").map((e) => e.trim()).filter(Boolean).includes("chunked")) {
    return Promise.resolve(void 0);
  }
  const promise = event.node.req[RawBodySymbol] = new Promise(
    (resolve, reject) => {
      const bodyData = [];
      event.node.req.on("error", (err) => {
        reject(err);
      }).on("data", (chunk) => {
        bodyData.push(chunk);
      }).on("end", () => {
        resolve(Buffer.concat(bodyData));
      });
    }
  );
  const result = encoding ? promise.then((buff) => buff.toString(encoding)) : promise;
  return result;
}
async function readBody(event, options = {}) {
  const request = event.node.req;
  if (hasProp(request, ParsedBodySymbol)) {
    return request[ParsedBodySymbol];
  }
  const contentType = request.headers["content-type"] || "";
  const body = await readRawBody(event);
  let parsed;
  if (contentType === "application/json") {
    parsed = _parseJSON(body, options.strict ?? true);
  } else if (contentType.startsWith("application/x-www-form-urlencoded")) {
    parsed = _parseURLEncodedBody(body);
  } else if (contentType.startsWith("text/")) {
    parsed = body;
  } else {
    parsed = _parseJSON(body, options.strict ?? false);
  }
  request[ParsedBodySymbol] = parsed;
  return parsed;
}
function getRequestWebStream(event) {
  if (!PayloadMethods$1.includes(event.method)) {
    return;
  }
  const bodyStream = event.web?.request?.body || event._requestBody;
  if (bodyStream) {
    return bodyStream;
  }
  const _hasRawBody = RawBodySymbol in event.node.req || "rawBody" in event.node.req || "body" in event.node.req || "__unenv__" in event.node.req;
  if (_hasRawBody) {
    return new ReadableStream({
      async start(controller) {
        const _rawBody = await readRawBody(event, false);
        if (_rawBody) {
          controller.enqueue(_rawBody);
        }
        controller.close();
      }
    });
  }
  return new ReadableStream({
    start: (controller) => {
      event.node.req.on("data", (chunk) => {
        controller.enqueue(chunk);
      });
      event.node.req.on("end", () => {
        controller.close();
      });
      event.node.req.on("error", (err) => {
        controller.error(err);
      });
    }
  });
}
function _parseJSON(body = "", strict) {
  if (!body) {
    return void 0;
  }
  try {
    return destr(body, { strict });
  } catch {
    throw createError$1({
      statusCode: 400,
      statusMessage: "Bad Request",
      message: "Invalid JSON body"
    });
  }
}
function _parseURLEncodedBody(body) {
  const form = new URLSearchParams(body);
  const parsedForm = /* @__PURE__ */ Object.create(null);
  for (const [key, value] of form.entries()) {
    if (hasProp(parsedForm, key)) {
      if (!Array.isArray(parsedForm[key])) {
        parsedForm[key] = [parsedForm[key]];
      }
      parsedForm[key].push(value);
    } else {
      parsedForm[key] = value;
    }
  }
  return parsedForm;
}

function handleCacheHeaders(event, opts) {
  const cacheControls = ["public", ...opts.cacheControls || []];
  let cacheMatched = false;
  if (opts.maxAge !== void 0) {
    cacheControls.push(`max-age=${+opts.maxAge}`, `s-maxage=${+opts.maxAge}`);
  }
  if (opts.modifiedTime) {
    const modifiedTime = new Date(opts.modifiedTime);
    const ifModifiedSince = event.node.req.headers["if-modified-since"];
    event.node.res.setHeader("last-modified", modifiedTime.toUTCString());
    if (ifModifiedSince && new Date(ifModifiedSince) >= modifiedTime) {
      cacheMatched = true;
    }
  }
  if (opts.etag) {
    event.node.res.setHeader("etag", opts.etag);
    const ifNonMatch = event.node.req.headers["if-none-match"];
    if (ifNonMatch === opts.etag) {
      cacheMatched = true;
    }
  }
  event.node.res.setHeader("cache-control", cacheControls.join(", "));
  if (cacheMatched) {
    event.node.res.statusCode = 304;
    if (!event.handled) {
      event.node.res.end();
    }
    return true;
  }
  return false;
}

const MIMES = {
  html: "text/html",
  json: "application/json"
};

const DISALLOWED_STATUS_CHARS = /[^\u0009\u0020-\u007E]/g;
function sanitizeStatusMessage(statusMessage = "") {
  return statusMessage.replace(DISALLOWED_STATUS_CHARS, "");
}
function sanitizeStatusCode(statusCode, defaultStatusCode = 200) {
  if (!statusCode) {
    return defaultStatusCode;
  }
  if (typeof statusCode === "string") {
    statusCode = Number.parseInt(statusCode, 10);
  }
  if (statusCode < 100 || statusCode > 999) {
    return defaultStatusCode;
  }
  return statusCode;
}

function getDistinctCookieKey(name, opts) {
  return [name, opts.domain || "", opts.path || "/"].join(";");
}

function parseCookies(event) {
  return parse(event.node.req.headers.cookie || "");
}
function getCookie(event, name) {
  return parseCookies(event)[name];
}
function setCookie(event, name, value, serializeOptions = {}) {
  if (!serializeOptions.path) {
    serializeOptions = { path: "/", ...serializeOptions };
  }
  const newCookie = serialize$2(name, value, serializeOptions);
  const currentCookies = splitCookiesString(
    event.node.res.getHeader("set-cookie")
  );
  if (currentCookies.length === 0) {
    event.node.res.setHeader("set-cookie", newCookie);
    return;
  }
  const newCookieKey = getDistinctCookieKey(name, serializeOptions);
  event.node.res.removeHeader("set-cookie");
  for (const cookie of currentCookies) {
    const parsed = parseSetCookie(cookie);
    const key = getDistinctCookieKey(parsed.name, parsed);
    if (key === newCookieKey) {
      continue;
    }
    event.node.res.appendHeader("set-cookie", cookie);
  }
  event.node.res.appendHeader("set-cookie", newCookie);
}
function deleteCookie(event, name, serializeOptions) {
  setCookie(event, name, "", {
    ...serializeOptions,
    maxAge: 0
  });
}
function splitCookiesString(cookiesString) {
  if (Array.isArray(cookiesString)) {
    return cookiesString.flatMap((c) => splitCookiesString(c));
  }
  if (typeof cookiesString !== "string") {
    return [];
  }
  const cookiesStrings = [];
  let pos = 0;
  let start;
  let ch;
  let lastComma;
  let nextStart;
  let cookiesSeparatorFound;
  const skipWhitespace = () => {
    while (pos < cookiesString.length && /\s/.test(cookiesString.charAt(pos))) {
      pos += 1;
    }
    return pos < cookiesString.length;
  };
  const notSpecialChar = () => {
    ch = cookiesString.charAt(pos);
    return ch !== "=" && ch !== ";" && ch !== ",";
  };
  while (pos < cookiesString.length) {
    start = pos;
    cookiesSeparatorFound = false;
    while (skipWhitespace()) {
      ch = cookiesString.charAt(pos);
      if (ch === ",") {
        lastComma = pos;
        pos += 1;
        skipWhitespace();
        nextStart = pos;
        while (pos < cookiesString.length && notSpecialChar()) {
          pos += 1;
        }
        if (pos < cookiesString.length && cookiesString.charAt(pos) === "=") {
          cookiesSeparatorFound = true;
          pos = nextStart;
          cookiesStrings.push(cookiesString.slice(start, lastComma));
          start = pos;
        } else {
          pos = lastComma + 1;
        }
      } else {
        pos += 1;
      }
    }
    if (!cookiesSeparatorFound || pos >= cookiesString.length) {
      cookiesStrings.push(cookiesString.slice(start));
    }
  }
  return cookiesStrings;
}

const defer = typeof setImmediate === "undefined" ? (fn) => fn() : setImmediate;
function send(event, data, type) {
  if (type) {
    defaultContentType(event, type);
  }
  return new Promise((resolve) => {
    defer(() => {
      if (!event.handled) {
        event.node.res.end(data);
      }
      resolve();
    });
  });
}
function sendNoContent(event, code) {
  if (event.handled) {
    return;
  }
  if (!code && event.node.res.statusCode !== 200) {
    code = event.node.res.statusCode;
  }
  const _code = sanitizeStatusCode(code, 204);
  if (_code === 204) {
    event.node.res.removeHeader("content-length");
  }
  event.node.res.writeHead(_code);
  event.node.res.end();
}
function setResponseStatus(event, code, text) {
  if (code) {
    event.node.res.statusCode = sanitizeStatusCode(
      code,
      event.node.res.statusCode
    );
  }
  if (text) {
    event.node.res.statusMessage = sanitizeStatusMessage(text);
  }
}
function getResponseStatus(event) {
  return event.node.res.statusCode;
}
function getResponseStatusText(event) {
  return event.node.res.statusMessage;
}
function defaultContentType(event, type) {
  if (type && event.node.res.statusCode !== 304 && !event.node.res.getHeader("content-type")) {
    event.node.res.setHeader("content-type", type);
  }
}
function sendRedirect(event, location, code = 302) {
  event.node.res.statusCode = sanitizeStatusCode(
    code,
    event.node.res.statusCode
  );
  event.node.res.setHeader("location", location);
  const encodedLoc = location.replace(/"/g, "%22");
  const html = `<!DOCTYPE html><html><head><meta http-equiv="refresh" content="0; url=${encodedLoc}"></head></html>`;
  return send(event, html, MIMES.html);
}
function getResponseHeader(event, name) {
  return event.node.res.getHeader(name);
}
function setResponseHeaders(event, headers) {
  for (const [name, value] of Object.entries(headers)) {
    event.node.res.setHeader(
      name,
      value
    );
  }
}
const setHeaders = setResponseHeaders;
function setResponseHeader(event, name, value) {
  event.node.res.setHeader(name, value);
}
const setHeader = setResponseHeader;
function appendResponseHeader(event, name, value) {
  let current = event.node.res.getHeader(name);
  if (!current) {
    event.node.res.setHeader(name, value);
    return;
  }
  if (!Array.isArray(current)) {
    current = [current.toString()];
  }
  event.node.res.setHeader(name, [...current, value]);
}
function removeResponseHeader(event, name) {
  return event.node.res.removeHeader(name);
}
function isStream(data) {
  if (!data || typeof data !== "object") {
    return false;
  }
  if (typeof data.pipe === "function") {
    if (typeof data._read === "function") {
      return true;
    }
    if (typeof data.abort === "function") {
      return true;
    }
  }
  if (typeof data.pipeTo === "function") {
    return true;
  }
  return false;
}
function isWebResponse(data) {
  return typeof Response !== "undefined" && data instanceof Response;
}
function sendStream(event, stream) {
  if (!stream || typeof stream !== "object") {
    throw new Error("[h3] Invalid stream provided.");
  }
  event.node.res._data = stream;
  if (!event.node.res.socket) {
    event._handled = true;
    return Promise.resolve();
  }
  if (hasProp(stream, "pipeTo") && typeof stream.pipeTo === "function") {
    return stream.pipeTo(
      new WritableStream({
        write(chunk) {
          event.node.res.write(chunk);
        }
      })
    ).then(() => {
      event.node.res.end();
    });
  }
  if (hasProp(stream, "pipe") && typeof stream.pipe === "function") {
    return new Promise((resolve, reject) => {
      stream.pipe(event.node.res);
      if (stream.on) {
        stream.on("end", () => {
          event.node.res.end();
          resolve();
        });
        stream.on("error", (error) => {
          reject(error);
        });
      }
      event.node.res.on("close", () => {
        if (stream.abort) {
          stream.abort();
        }
      });
    });
  }
  throw new Error("[h3] Invalid or incompatible stream provided.");
}
function sendWebResponse(event, response) {
  for (const [key, value] of response.headers) {
    if (key === "set-cookie") {
      event.node.res.appendHeader(key, splitCookiesString(value));
    } else {
      event.node.res.setHeader(key, value);
    }
  }
  if (response.status) {
    event.node.res.statusCode = sanitizeStatusCode(
      response.status,
      event.node.res.statusCode
    );
  }
  if (response.statusText) {
    event.node.res.statusMessage = sanitizeStatusMessage(response.statusText);
  }
  if (response.redirected) {
    event.node.res.setHeader("location", response.url);
  }
  if (!response.body) {
    event.node.res.end();
    return;
  }
  return sendStream(event, response.body);
}

const PayloadMethods = /* @__PURE__ */ new Set(["PATCH", "POST", "PUT", "DELETE"]);
const ignoredHeaders = /* @__PURE__ */ new Set([
  "transfer-encoding",
  "accept-encoding",
  "connection",
  "keep-alive",
  "upgrade",
  "expect",
  "host",
  "accept"
]);
async function proxyRequest(event, target, opts = {}) {
  let body;
  let duplex;
  if (PayloadMethods.has(event.method)) {
    if (opts.streamRequest) {
      body = getRequestWebStream(event);
      duplex = "half";
    } else {
      body = await readRawBody(event, false).catch(() => void 0);
    }
  }
  const method = opts.fetchOptions?.method || event.method;
  const fetchHeaders = mergeHeaders$1(
    getProxyRequestHeaders(event, { host: target.startsWith("/") }),
    opts.fetchOptions?.headers,
    opts.headers
  );
  return sendProxy(event, target, {
    ...opts,
    fetchOptions: {
      method,
      body,
      duplex,
      ...opts.fetchOptions,
      headers: fetchHeaders
    }
  });
}
async function sendProxy(event, target, opts = {}) {
  let response;
  try {
    response = await _getFetch(opts.fetch)(target, {
      headers: opts.headers,
      ignoreResponseError: true,
      // make $ofetch.raw transparent
      ...opts.fetchOptions
    });
  } catch (error) {
    throw createError$1({
      status: 502,
      statusMessage: "Bad Gateway",
      cause: error
    });
  }
  event.node.res.statusCode = sanitizeStatusCode(
    response.status,
    event.node.res.statusCode
  );
  event.node.res.statusMessage = sanitizeStatusMessage(response.statusText);
  const cookies = [];
  for (const [key, value] of response.headers.entries()) {
    if (key === "content-encoding") {
      continue;
    }
    if (key === "content-length") {
      continue;
    }
    if (key === "set-cookie") {
      cookies.push(...splitCookiesString(value));
      continue;
    }
    event.node.res.setHeader(key, value);
  }
  if (cookies.length > 0) {
    event.node.res.setHeader(
      "set-cookie",
      cookies.map((cookie) => {
        if (opts.cookieDomainRewrite) {
          cookie = rewriteCookieProperty(
            cookie,
            opts.cookieDomainRewrite,
            "domain"
          );
        }
        if (opts.cookiePathRewrite) {
          cookie = rewriteCookieProperty(
            cookie,
            opts.cookiePathRewrite,
            "path"
          );
        }
        return cookie;
      })
    );
  }
  if (opts.onResponse) {
    await opts.onResponse(event, response);
  }
  if (response._data !== void 0) {
    return response._data;
  }
  if (event.handled) {
    return;
  }
  if (opts.sendStream === false) {
    const data = new Uint8Array(await response.arrayBuffer());
    return event.node.res.end(data);
  }
  if (response.body) {
    for await (const chunk of response.body) {
      event.node.res.write(chunk);
    }
  }
  return event.node.res.end();
}
function getProxyRequestHeaders(event, opts) {
  const headers = /* @__PURE__ */ Object.create(null);
  const reqHeaders = getRequestHeaders(event);
  for (const name in reqHeaders) {
    if (!ignoredHeaders.has(name) || name === "host" && opts?.host) {
      headers[name] = reqHeaders[name];
    }
  }
  return headers;
}
function fetchWithEvent(event, req, init, options) {
  return _getFetch(options?.fetch)(req, {
    ...init,
    context: init?.context || event.context,
    headers: {
      ...getProxyRequestHeaders(event, {
        host: typeof req === "string" && req.startsWith("/")
      }),
      ...init?.headers
    }
  });
}
function _getFetch(_fetch) {
  if (_fetch) {
    return _fetch;
  }
  if (globalThis.fetch) {
    return globalThis.fetch;
  }
  throw new Error(
    "fetch is not available. Try importing `node-fetch-native/polyfill` for Node.js."
  );
}
function rewriteCookieProperty(header, map, property) {
  const _map = typeof map === "string" ? { "*": map } : map;
  return header.replace(
    new RegExp(`(;\\s*${property}=)([^;]+)`, "gi"),
    (match, prefix, previousValue) => {
      let newValue;
      if (previousValue in _map) {
        newValue = _map[previousValue];
      } else if ("*" in _map) {
        newValue = _map["*"];
      } else {
        return match;
      }
      return newValue ? prefix + newValue : "";
    }
  );
}
function mergeHeaders$1(defaults, ...inputs) {
  const _inputs = inputs.filter(Boolean);
  if (_inputs.length === 0) {
    return defaults;
  }
  const merged = new Headers(defaults);
  for (const input of _inputs) {
    const entries = Array.isArray(input) ? input : typeof input.entries === "function" ? input.entries() : Object.entries(input);
    for (const [key, value] of entries) {
      if (value !== void 0) {
        merged.set(key, value);
      }
    }
  }
  return merged;
}

class H3Event {
  "__is_event__" = true;
  // Context
  node;
  // Node
  web;
  // Web
  context = {};
  // Shared
  // Request
  _method;
  _path;
  _headers;
  _requestBody;
  // Response
  _handled = false;
  // Hooks
  _onBeforeResponseCalled;
  _onAfterResponseCalled;
  constructor(req, res) {
    this.node = { req, res };
  }
  // --- Request ---
  get method() {
    if (!this._method) {
      this._method = (this.node.req.method || "GET").toUpperCase();
    }
    return this._method;
  }
  get path() {
    return this._path || this.node.req.url || "/";
  }
  get headers() {
    if (!this._headers) {
      this._headers = _normalizeNodeHeaders(this.node.req.headers);
    }
    return this._headers;
  }
  // --- Respoonse ---
  get handled() {
    return this._handled || this.node.res.writableEnded || this.node.res.headersSent;
  }
  respondWith(response) {
    return Promise.resolve(response).then(
      (_response) => sendWebResponse(this, _response)
    );
  }
  // --- Utils ---
  toString() {
    return `[${this.method}] ${this.path}`;
  }
  toJSON() {
    return this.toString();
  }
  // --- Deprecated ---
  /** @deprecated Please use `event.node.req` instead. */
  get req() {
    return this.node.req;
  }
  /** @deprecated Please use `event.node.res` instead. */
  get res() {
    return this.node.res;
  }
}
function isEvent(input) {
  return hasProp(input, "__is_event__");
}
function createEvent(req, res) {
  return new H3Event(req, res);
}
function _normalizeNodeHeaders(nodeHeaders) {
  const headers = new Headers();
  for (const [name, value] of Object.entries(nodeHeaders)) {
    if (Array.isArray(value)) {
      for (const item of value) {
        headers.append(name, item);
      }
    } else if (value) {
      headers.set(name, value);
    }
  }
  return headers;
}

function defineEventHandler(handler) {
  if (typeof handler === "function") {
    handler.__is_handler__ = true;
    return handler;
  }
  const _hooks = {
    onRequest: _normalizeArray(handler.onRequest),
    onBeforeResponse: _normalizeArray(handler.onBeforeResponse)
  };
  const _handler = (event) => {
    return _callHandler(event, handler.handler, _hooks);
  };
  _handler.__is_handler__ = true;
  _handler.__resolve__ = handler.handler.__resolve__;
  _handler.__websocket__ = handler.websocket;
  return _handler;
}
function _normalizeArray(input) {
  return input ? Array.isArray(input) ? input : [input] : void 0;
}
async function _callHandler(event, handler, hooks) {
  if (hooks.onRequest) {
    for (const hook of hooks.onRequest) {
      await hook(event);
      if (event.handled) {
        return;
      }
    }
  }
  const body = await handler(event);
  const response = { body };
  if (hooks.onBeforeResponse) {
    for (const hook of hooks.onBeforeResponse) {
      await hook(event, response);
    }
  }
  return response.body;
}
const eventHandler = defineEventHandler;
function isEventHandler(input) {
  return hasProp(input, "__is_handler__");
}
function toEventHandler(input, _, _route) {
  if (!isEventHandler(input)) {
    console.warn(
      "[h3] Implicit event handler conversion is deprecated. Use `eventHandler()` or `fromNodeMiddleware()` to define event handlers.",
      _route && _route !== "/" ? `
     Route: ${_route}` : "",
      `
     Handler: ${input}`
    );
  }
  return input;
}
function defineLazyEventHandler(factory) {
  let _promise;
  let _resolved;
  const resolveHandler = () => {
    if (_resolved) {
      return Promise.resolve(_resolved);
    }
    if (!_promise) {
      _promise = Promise.resolve(factory()).then((r) => {
        const handler2 = r.default || r;
        if (typeof handler2 !== "function") {
          throw new TypeError(
            "Invalid lazy handler result. It should be a function:",
            handler2
          );
        }
        _resolved = { handler: toEventHandler(r.default || r) };
        return _resolved;
      });
    }
    return _promise;
  };
  const handler = eventHandler((event) => {
    if (_resolved) {
      return _resolved.handler(event);
    }
    return resolveHandler().then((r) => r.handler(event));
  });
  handler.__resolve__ = resolveHandler;
  return handler;
}
const lazyEventHandler = defineLazyEventHandler;

function createApp(options = {}) {
  const stack = [];
  const handler = createAppEventHandler(stack, options);
  const resolve = createResolver(stack);
  handler.__resolve__ = resolve;
  const getWebsocket = cachedFn(() => websocketOptions(resolve, options));
  const app = {
    // @ts-expect-error
    use: (arg1, arg2, arg3) => use(app, arg1, arg2, arg3),
    resolve,
    handler,
    stack,
    options,
    get websocket() {
      return getWebsocket();
    }
  };
  return app;
}
function use(app, arg1, arg2, arg3) {
  if (Array.isArray(arg1)) {
    for (const i of arg1) {
      use(app, i, arg2, arg3);
    }
  } else if (Array.isArray(arg2)) {
    for (const i of arg2) {
      use(app, arg1, i, arg3);
    }
  } else if (typeof arg1 === "string") {
    app.stack.push(
      normalizeLayer({ ...arg3, route: arg1, handler: arg2 })
    );
  } else if (typeof arg1 === "function") {
    app.stack.push(normalizeLayer({ ...arg2, handler: arg1 }));
  } else {
    app.stack.push(normalizeLayer({ ...arg1 }));
  }
  return app;
}
function createAppEventHandler(stack, options) {
  const spacing = options.debug ? 2 : void 0;
  return eventHandler(async (event) => {
    event.node.req.originalUrl = event.node.req.originalUrl || event.node.req.url || "/";
    const _reqPath = event._path || event.node.req.url || "/";
    let _layerPath;
    if (options.onRequest) {
      await options.onRequest(event);
    }
    for (const layer of stack) {
      if (layer.route.length > 1) {
        if (!_reqPath.startsWith(layer.route)) {
          continue;
        }
        _layerPath = _reqPath.slice(layer.route.length) || "/";
      } else {
        _layerPath = _reqPath;
      }
      if (layer.match && !layer.match(_layerPath, event)) {
        continue;
      }
      event._path = _layerPath;
      event.node.req.url = _layerPath;
      const val = await layer.handler(event);
      const _body = val === void 0 ? void 0 : await val;
      if (_body !== void 0) {
        const _response = { body: _body };
        if (options.onBeforeResponse) {
          event._onBeforeResponseCalled = true;
          await options.onBeforeResponse(event, _response);
        }
        await handleHandlerResponse(event, _response.body, spacing);
        if (options.onAfterResponse) {
          event._onAfterResponseCalled = true;
          await options.onAfterResponse(event, _response);
        }
        return;
      }
      if (event.handled) {
        if (options.onAfterResponse) {
          event._onAfterResponseCalled = true;
          await options.onAfterResponse(event, void 0);
        }
        return;
      }
    }
    if (!event.handled) {
      throw createError$1({
        statusCode: 404,
        statusMessage: `Cannot find any path matching ${event.path || "/"}.`
      });
    }
    if (options.onAfterResponse) {
      event._onAfterResponseCalled = true;
      await options.onAfterResponse(event, void 0);
    }
  });
}
function createResolver(stack) {
  return async (path) => {
    let _layerPath;
    for (const layer of stack) {
      if (layer.route === "/" && !layer.handler.__resolve__) {
        continue;
      }
      if (!path.startsWith(layer.route)) {
        continue;
      }
      _layerPath = path.slice(layer.route.length) || "/";
      if (layer.match && !layer.match(_layerPath, void 0)) {
        continue;
      }
      let res = { route: layer.route, handler: layer.handler };
      if (res.handler.__resolve__) {
        const _res = await res.handler.__resolve__(_layerPath);
        if (!_res) {
          continue;
        }
        res = {
          ...res,
          ..._res,
          route: joinURL(res.route || "/", _res.route || "/")
        };
      }
      return res;
    }
  };
}
function normalizeLayer(input) {
  let handler = input.handler;
  if (handler.handler) {
    handler = handler.handler;
  }
  if (input.lazy) {
    handler = lazyEventHandler(handler);
  } else if (!isEventHandler(handler)) {
    handler = toEventHandler(handler, void 0, input.route);
  }
  return {
    route: withoutTrailingSlash(input.route),
    match: input.match,
    handler
  };
}
function handleHandlerResponse(event, val, jsonSpace) {
  if (val === null) {
    return sendNoContent(event);
  }
  if (val) {
    if (isWebResponse(val)) {
      return sendWebResponse(event, val);
    }
    if (isStream(val)) {
      return sendStream(event, val);
    }
    if (val.buffer) {
      return send(event, val);
    }
    if (val.arrayBuffer && typeof val.arrayBuffer === "function") {
      return val.arrayBuffer().then((arrayBuffer) => {
        return send(event, Buffer.from(arrayBuffer), val.type);
      });
    }
    if (val instanceof Error) {
      throw createError$1(val);
    }
    if (typeof val.end === "function") {
      return true;
    }
  }
  const valType = typeof val;
  if (valType === "string") {
    return send(event, val, MIMES.html);
  }
  if (valType === "object" || valType === "boolean" || valType === "number") {
    return send(event, JSON.stringify(val, void 0, jsonSpace), MIMES.json);
  }
  if (valType === "bigint") {
    return send(event, val.toString(), MIMES.json);
  }
  throw createError$1({
    statusCode: 500,
    statusMessage: `[h3] Cannot send ${valType} as response.`
  });
}
function cachedFn(fn) {
  let cache;
  return () => {
    if (!cache) {
      cache = fn();
    }
    return cache;
  };
}
function websocketOptions(evResolver, appOptions) {
  return {
    ...appOptions.websocket,
    async resolve(info) {
      const url = info.request?.url || info.url || "/";
      const { pathname } = typeof url === "string" ? parseURL(url) : url;
      const resolved = await evResolver(pathname);
      return resolved?.handler?.__websocket__ || {};
    }
  };
}

const RouterMethods = [
  "connect",
  "delete",
  "get",
  "head",
  "options",
  "post",
  "put",
  "trace",
  "patch"
];
function createRouter(opts = {}) {
  const _router = createRouter$1({});
  const routes = {};
  let _matcher;
  const router = {};
  const addRoute = (path, handler, method) => {
    let route = routes[path];
    if (!route) {
      routes[path] = route = { path, handlers: {} };
      _router.insert(path, route);
    }
    if (Array.isArray(method)) {
      for (const m of method) {
        addRoute(path, handler, m);
      }
    } else {
      route.handlers[method] = toEventHandler(handler, void 0, path);
    }
    return router;
  };
  router.use = router.add = (path, handler, method) => addRoute(path, handler, method || "all");
  for (const method of RouterMethods) {
    router[method] = (path, handle) => router.add(path, handle, method);
  }
  const matchHandler = (path = "/", method = "get") => {
    const qIndex = path.indexOf("?");
    if (qIndex !== -1) {
      path = path.slice(0, Math.max(0, qIndex));
    }
    const matched = _router.lookup(path);
    if (!matched || !matched.handlers) {
      return {
        error: createError$1({
          statusCode: 404,
          name: "Not Found",
          statusMessage: `Cannot find any route matching ${path || "/"}.`
        })
      };
    }
    let handler = matched.handlers[method] || matched.handlers.all;
    if (!handler) {
      if (!_matcher) {
        _matcher = toRouteMatcher(_router);
      }
      const _matches = _matcher.matchAll(path).reverse();
      for (const _match of _matches) {
        if (_match.handlers[method]) {
          handler = _match.handlers[method];
          matched.handlers[method] = matched.handlers[method] || handler;
          break;
        }
        if (_match.handlers.all) {
          handler = _match.handlers.all;
          matched.handlers.all = matched.handlers.all || handler;
          break;
        }
      }
    }
    if (!handler) {
      return {
        error: createError$1({
          statusCode: 405,
          name: "Method Not Allowed",
          statusMessage: `Method ${method} is not allowed on this route.`
        })
      };
    }
    return { matched, handler };
  };
  const isPreemptive = opts.preemptive || opts.preemtive;
  router.handler = eventHandler((event) => {
    const match = matchHandler(
      event.path,
      event.method.toLowerCase()
    );
    if ("error" in match) {
      if (isPreemptive) {
        throw match.error;
      } else {
        return;
      }
    }
    event.context.matchedRoute = match.matched;
    const params = match.matched.params || {};
    event.context.params = params;
    return Promise.resolve(match.handler(event)).then((res) => {
      if (res === void 0 && isPreemptive) {
        return null;
      }
      return res;
    });
  });
  router.handler.__resolve__ = async (path) => {
    path = withLeadingSlash(path);
    const match = matchHandler(path);
    if ("error" in match) {
      return;
    }
    let res = {
      route: match.matched.path,
      handler: match.handler
    };
    if (match.handler.__resolve__) {
      const _res = await match.handler.__resolve__(path);
      if (!_res) {
        return;
      }
      res = { ...res, ..._res };
    }
    return res;
  };
  return router;
}
function toNodeListener(app) {
  const toNodeHandle = async function(req, res) {
    const event = createEvent(req, res);
    try {
      await app.handler(event);
    } catch (_error) {
      const error = createError$1(_error);
      if (!isError(_error)) {
        error.unhandled = true;
      }
      setResponseStatus(event, error.statusCode, error.statusMessage);
      if (app.options.onError) {
        await app.options.onError(error, event);
      }
      if (event.handled) {
        return;
      }
      if (error.unhandled || error.fatal) {
        console.error("[h3]", error.fatal ? "[fatal]" : "[unhandled]", error);
      }
      if (app.options.onBeforeResponse && !event._onBeforeResponseCalled) {
        await app.options.onBeforeResponse(event, { body: error });
      }
      await sendError(event, error, !!app.options.debug);
      if (app.options.onAfterResponse && !event._onAfterResponseCalled) {
        await app.options.onAfterResponse(event, { body: error });
      }
    }
  };
  return toNodeHandle;
}

function flatHooks(configHooks, hooks = {}, parentName) {
  for (const key in configHooks) {
    const subHook = configHooks[key];
    const name = parentName ? `${parentName}:${key}` : key;
    if (typeof subHook === "object" && subHook !== null) {
      flatHooks(subHook, hooks, name);
    } else if (typeof subHook === "function") {
      hooks[name] = subHook;
    }
  }
  return hooks;
}
const defaultTask = { run: (function_) => function_() };
const _createTask = () => defaultTask;
const createTask = typeof console.createTask !== "undefined" ? console.createTask : _createTask;
function serialTaskCaller(hooks, args) {
  const name = args.shift();
  const task = createTask(name);
  return hooks.reduce(
    (promise, hookFunction) => promise.then(() => task.run(() => hookFunction(...args))),
    Promise.resolve()
  );
}
function parallelTaskCaller(hooks, args) {
  const name = args.shift();
  const task = createTask(name);
  return Promise.all(hooks.map((hook) => task.run(() => hook(...args))));
}
function callEachWith(callbacks, arg0) {
  for (const callback of [...callbacks]) {
    callback(arg0);
  }
}

class Hookable {
  constructor() {
    this._hooks = {};
    this._before = void 0;
    this._after = void 0;
    this._deprecatedMessages = void 0;
    this._deprecatedHooks = {};
    this.hook = this.hook.bind(this);
    this.callHook = this.callHook.bind(this);
    this.callHookWith = this.callHookWith.bind(this);
  }
  hook(name, function_, options = {}) {
    if (!name || typeof function_ !== "function") {
      return () => {
      };
    }
    const originalName = name;
    let dep;
    while (this._deprecatedHooks[name]) {
      dep = this._deprecatedHooks[name];
      name = dep.to;
    }
    if (dep && !options.allowDeprecated) {
      let message = dep.message;
      if (!message) {
        message = `${originalName} hook has been deprecated` + (dep.to ? `, please use ${dep.to}` : "");
      }
      if (!this._deprecatedMessages) {
        this._deprecatedMessages = /* @__PURE__ */ new Set();
      }
      if (!this._deprecatedMessages.has(message)) {
        console.warn(message);
        this._deprecatedMessages.add(message);
      }
    }
    if (!function_.name) {
      try {
        Object.defineProperty(function_, "name", {
          get: () => "_" + name.replace(/\W+/g, "_") + "_hook_cb",
          configurable: true
        });
      } catch {
      }
    }
    this._hooks[name] = this._hooks[name] || [];
    this._hooks[name].push(function_);
    return () => {
      if (function_) {
        this.removeHook(name, function_);
        function_ = void 0;
      }
    };
  }
  hookOnce(name, function_) {
    let _unreg;
    let _function = (...arguments_) => {
      if (typeof _unreg === "function") {
        _unreg();
      }
      _unreg = void 0;
      _function = void 0;
      return function_(...arguments_);
    };
    _unreg = this.hook(name, _function);
    return _unreg;
  }
  removeHook(name, function_) {
    if (this._hooks[name]) {
      const index = this._hooks[name].indexOf(function_);
      if (index !== -1) {
        this._hooks[name].splice(index, 1);
      }
      if (this._hooks[name].length === 0) {
        delete this._hooks[name];
      }
    }
  }
  deprecateHook(name, deprecated) {
    this._deprecatedHooks[name] = typeof deprecated === "string" ? { to: deprecated } : deprecated;
    const _hooks = this._hooks[name] || [];
    delete this._hooks[name];
    for (const hook of _hooks) {
      this.hook(name, hook);
    }
  }
  deprecateHooks(deprecatedHooks) {
    Object.assign(this._deprecatedHooks, deprecatedHooks);
    for (const name in deprecatedHooks) {
      this.deprecateHook(name, deprecatedHooks[name]);
    }
  }
  addHooks(configHooks) {
    const hooks = flatHooks(configHooks);
    const removeFns = Object.keys(hooks).map(
      (key) => this.hook(key, hooks[key])
    );
    return () => {
      for (const unreg of removeFns.splice(0, removeFns.length)) {
        unreg();
      }
    };
  }
  removeHooks(configHooks) {
    const hooks = flatHooks(configHooks);
    for (const key in hooks) {
      this.removeHook(key, hooks[key]);
    }
  }
  removeAllHooks() {
    for (const key in this._hooks) {
      delete this._hooks[key];
    }
  }
  callHook(name, ...arguments_) {
    arguments_.unshift(name);
    return this.callHookWith(serialTaskCaller, name, ...arguments_);
  }
  callHookParallel(name, ...arguments_) {
    arguments_.unshift(name);
    return this.callHookWith(parallelTaskCaller, name, ...arguments_);
  }
  callHookWith(caller, name, ...arguments_) {
    const event = this._before || this._after ? { name, args: arguments_, context: {} } : void 0;
    if (this._before) {
      callEachWith(this._before, event);
    }
    const result = caller(
      name in this._hooks ? [...this._hooks[name]] : [],
      arguments_
    );
    if (result instanceof Promise) {
      return result.finally(() => {
        if (this._after && event) {
          callEachWith(this._after, event);
        }
      });
    }
    if (this._after && event) {
      callEachWith(this._after, event);
    }
    return result;
  }
  beforeEach(function_) {
    this._before = this._before || [];
    this._before.push(function_);
    return () => {
      if (this._before !== void 0) {
        const index = this._before.indexOf(function_);
        if (index !== -1) {
          this._before.splice(index, 1);
        }
      }
    };
  }
  afterEach(function_) {
    this._after = this._after || [];
    this._after.push(function_);
    return () => {
      if (this._after !== void 0) {
        const index = this._after.indexOf(function_);
        if (index !== -1) {
          this._after.splice(index, 1);
        }
      }
    };
  }
}
function createHooks() {
  return new Hookable();
}

const s$1=globalThis.Headers,i=globalThis.AbortController,l=globalThis.fetch||(()=>{throw new Error("[node-fetch-native] Failed to fetch: `globalThis.fetch` is not available!")});

class FetchError extends Error {
  constructor(message, opts) {
    super(message, opts);
    this.name = "FetchError";
    if (opts?.cause && !this.cause) {
      this.cause = opts.cause;
    }
  }
}
function createFetchError(ctx) {
  const errorMessage = ctx.error?.message || ctx.error?.toString() || "";
  const method = ctx.request?.method || ctx.options?.method || "GET";
  const url = ctx.request?.url || String(ctx.request) || "/";
  const requestStr = `[${method}] ${JSON.stringify(url)}`;
  const statusStr = ctx.response ? `${ctx.response.status} ${ctx.response.statusText}` : "<no response>";
  const message = `${requestStr}: ${statusStr}${errorMessage ? ` ${errorMessage}` : ""}`;
  const fetchError = new FetchError(
    message,
    ctx.error ? { cause: ctx.error } : void 0
  );
  for (const key of ["request", "options", "response"]) {
    Object.defineProperty(fetchError, key, {
      get() {
        return ctx[key];
      }
    });
  }
  for (const [key, refKey] of [
    ["data", "_data"],
    ["status", "status"],
    ["statusCode", "status"],
    ["statusText", "statusText"],
    ["statusMessage", "statusText"]
  ]) {
    Object.defineProperty(fetchError, key, {
      get() {
        return ctx.response && ctx.response[refKey];
      }
    });
  }
  return fetchError;
}

const payloadMethods = new Set(
  Object.freeze(["PATCH", "POST", "PUT", "DELETE"])
);
function isPayloadMethod(method = "GET") {
  return payloadMethods.has(method.toUpperCase());
}
function isJSONSerializable(value) {
  if (value === void 0) {
    return false;
  }
  const t = typeof value;
  if (t === "string" || t === "number" || t === "boolean" || t === null) {
    return true;
  }
  if (t !== "object") {
    return false;
  }
  if (Array.isArray(value)) {
    return true;
  }
  if (value.buffer) {
    return false;
  }
  return value.constructor && value.constructor.name === "Object" || typeof value.toJSON === "function";
}
const textTypes = /* @__PURE__ */ new Set([
  "image/svg",
  "application/xml",
  "application/xhtml",
  "application/html"
]);
const JSON_RE = /^application\/(?:[\w!#$%&*.^`~-]*\+)?json(;.+)?$/i;
function detectResponseType(_contentType = "") {
  if (!_contentType) {
    return "json";
  }
  const contentType = _contentType.split(";").shift() || "";
  if (JSON_RE.test(contentType)) {
    return "json";
  }
  if (textTypes.has(contentType) || contentType.startsWith("text/")) {
    return "text";
  }
  return "blob";
}
function resolveFetchOptions(request, input, defaults, Headers) {
  const headers = mergeHeaders(
    input?.headers ?? request?.headers,
    defaults?.headers,
    Headers
  );
  let query;
  if (defaults?.query || defaults?.params || input?.params || input?.query) {
    query = {
      ...defaults?.params,
      ...defaults?.query,
      ...input?.params,
      ...input?.query
    };
  }
  return {
    ...defaults,
    ...input,
    query,
    params: query,
    headers
  };
}
function mergeHeaders(input, defaults, Headers) {
  if (!defaults) {
    return new Headers(input);
  }
  const headers = new Headers(defaults);
  if (input) {
    for (const [key, value] of Symbol.iterator in input || Array.isArray(input) ? input : new Headers(input)) {
      headers.set(key, value);
    }
  }
  return headers;
}
async function callHooks(context, hooks) {
  if (hooks) {
    if (Array.isArray(hooks)) {
      for (const hook of hooks) {
        await hook(context);
      }
    } else {
      await hooks(context);
    }
  }
}

const retryStatusCodes = /* @__PURE__ */ new Set([
  408,
  // Request Timeout
  409,
  // Conflict
  425,
  // Too Early (Experimental)
  429,
  // Too Many Requests
  500,
  // Internal Server Error
  502,
  // Bad Gateway
  503,
  // Service Unavailable
  504
  // Gateway Timeout
]);
const nullBodyResponses = /* @__PURE__ */ new Set([101, 204, 205, 304]);
function createFetch(globalOptions = {}) {
  const {
    fetch = globalThis.fetch,
    Headers = globalThis.Headers,
    AbortController = globalThis.AbortController
  } = globalOptions;
  async function onError(context) {
    const isAbort = context.error && context.error.name === "AbortError" && !context.options.timeout || false;
    if (context.options.retry !== false && !isAbort) {
      let retries;
      if (typeof context.options.retry === "number") {
        retries = context.options.retry;
      } else {
        retries = isPayloadMethod(context.options.method) ? 0 : 1;
      }
      const responseCode = context.response && context.response.status || 500;
      if (retries > 0 && (Array.isArray(context.options.retryStatusCodes) ? context.options.retryStatusCodes.includes(responseCode) : retryStatusCodes.has(responseCode))) {
        const retryDelay = typeof context.options.retryDelay === "function" ? context.options.retryDelay(context) : context.options.retryDelay || 0;
        if (retryDelay > 0) {
          await new Promise((resolve) => setTimeout(resolve, retryDelay));
        }
        return $fetchRaw(context.request, {
          ...context.options,
          retry: retries - 1
        });
      }
    }
    const error = createFetchError(context);
    if (Error.captureStackTrace) {
      Error.captureStackTrace(error, $fetchRaw);
    }
    throw error;
  }
  const $fetchRaw = async function $fetchRaw2(_request, _options = {}) {
    const context = {
      request: _request,
      options: resolveFetchOptions(
        _request,
        _options,
        globalOptions.defaults,
        Headers
      ),
      response: void 0,
      error: void 0
    };
    if (context.options.method) {
      context.options.method = context.options.method.toUpperCase();
    }
    if (context.options.onRequest) {
      await callHooks(context, context.options.onRequest);
    }
    if (typeof context.request === "string") {
      if (context.options.baseURL) {
        context.request = withBase(context.request, context.options.baseURL);
      }
      if (context.options.query) {
        context.request = withQuery(context.request, context.options.query);
        delete context.options.query;
      }
      if ("query" in context.options) {
        delete context.options.query;
      }
      if ("params" in context.options) {
        delete context.options.params;
      }
    }
    if (context.options.body && isPayloadMethod(context.options.method)) {
      if (isJSONSerializable(context.options.body)) {
        context.options.body = typeof context.options.body === "string" ? context.options.body : JSON.stringify(context.options.body);
        context.options.headers = new Headers(context.options.headers || {});
        if (!context.options.headers.has("content-type")) {
          context.options.headers.set("content-type", "application/json");
        }
        if (!context.options.headers.has("accept")) {
          context.options.headers.set("accept", "application/json");
        }
      } else if (
        // ReadableStream Body
        "pipeTo" in context.options.body && typeof context.options.body.pipeTo === "function" || // Node.js Stream Body
        typeof context.options.body.pipe === "function"
      ) {
        if (!("duplex" in context.options)) {
          context.options.duplex = "half";
        }
      }
    }
    let abortTimeout;
    if (!context.options.signal && context.options.timeout) {
      const controller = new AbortController();
      abortTimeout = setTimeout(() => {
        const error = new Error(
          "[TimeoutError]: The operation was aborted due to timeout"
        );
        error.name = "TimeoutError";
        error.code = 23;
        controller.abort(error);
      }, context.options.timeout);
      context.options.signal = controller.signal;
    }
    try {
      context.response = await fetch(
        context.request,
        context.options
      );
    } catch (error) {
      context.error = error;
      if (context.options.onRequestError) {
        await callHooks(
          context,
          context.options.onRequestError
        );
      }
      return await onError(context);
    } finally {
      if (abortTimeout) {
        clearTimeout(abortTimeout);
      }
    }
    const hasBody = (context.response.body || // https://github.com/unjs/ofetch/issues/324
    // https://github.com/unjs/ofetch/issues/294
    // https://github.com/JakeChampion/fetch/issues/1454
    context.response._bodyInit) && !nullBodyResponses.has(context.response.status) && context.options.method !== "HEAD";
    if (hasBody) {
      const responseType = (context.options.parseResponse ? "json" : context.options.responseType) || detectResponseType(context.response.headers.get("content-type") || "");
      switch (responseType) {
        case "json": {
          const data = await context.response.text();
          const parseFunction = context.options.parseResponse || destr;
          context.response._data = parseFunction(data);
          break;
        }
        case "stream": {
          context.response._data = context.response.body || context.response._bodyInit;
          break;
        }
        default: {
          context.response._data = await context.response[responseType]();
        }
      }
    }
    if (context.options.onResponse) {
      await callHooks(
        context,
        context.options.onResponse
      );
    }
    if (!context.options.ignoreResponseError && context.response.status >= 400 && context.response.status < 600) {
      if (context.options.onResponseError) {
        await callHooks(
          context,
          context.options.onResponseError
        );
      }
      return await onError(context);
    }
    return context.response;
  };
  const $fetch = async function $fetch2(request, options) {
    const r = await $fetchRaw(request, options);
    return r._data;
  };
  $fetch.raw = $fetchRaw;
  $fetch.native = (...args) => fetch(...args);
  $fetch.create = (defaultOptions = {}, customGlobalOptions = {}) => createFetch({
    ...globalOptions,
    ...customGlobalOptions,
    defaults: {
      ...globalOptions.defaults,
      ...customGlobalOptions.defaults,
      ...defaultOptions
    }
  });
  return $fetch;
}

function createNodeFetch() {
  const useKeepAlive = JSON.parse(process.env.FETCH_KEEP_ALIVE || "false");
  if (!useKeepAlive) {
    return l;
  }
  const agentOptions = { keepAlive: true };
  const httpAgent = new http.Agent(agentOptions);
  const httpsAgent = new https.Agent(agentOptions);
  const nodeFetchOptions = {
    agent(parsedURL) {
      return parsedURL.protocol === "http:" ? httpAgent : httpsAgent;
    }
  };
  return function nodeFetchWithKeepAlive(input, init) {
    return l(input, { ...nodeFetchOptions, ...init });
  };
}
const fetch = globalThis.fetch ? (...args) => globalThis.fetch(...args) : createNodeFetch();
const Headers$1 = globalThis.Headers || s$1;
const AbortController = globalThis.AbortController || i;
const ofetch = createFetch({ fetch, Headers: Headers$1, AbortController });
const $fetch = ofetch;

function wrapToPromise(value) {
  if (!value || typeof value.then !== "function") {
    return Promise.resolve(value);
  }
  return value;
}
function asyncCall(function_, ...arguments_) {
  try {
    return wrapToPromise(function_(...arguments_));
  } catch (error) {
    return Promise.reject(error);
  }
}
function isPrimitive(value) {
  const type = typeof value;
  return value === null || type !== "object" && type !== "function";
}
function isPureObject(value) {
  const proto = Object.getPrototypeOf(value);
  return !proto || proto.isPrototypeOf(Object);
}
function stringify(value) {
  if (isPrimitive(value)) {
    return String(value);
  }
  if (isPureObject(value) || Array.isArray(value)) {
    return JSON.stringify(value);
  }
  if (typeof value.toJSON === "function") {
    return stringify(value.toJSON());
  }
  throw new Error("[unstorage] Cannot stringify value!");
}
const BASE64_PREFIX = "base64:";
function serializeRaw(value) {
  if (typeof value === "string") {
    return value;
  }
  return BASE64_PREFIX + base64Encode(value);
}
function deserializeRaw(value) {
  if (typeof value !== "string") {
    return value;
  }
  if (!value.startsWith(BASE64_PREFIX)) {
    return value;
  }
  return base64Decode(value.slice(BASE64_PREFIX.length));
}
function base64Decode(input) {
  if (globalThis.Buffer) {
    return Buffer.from(input, "base64");
  }
  return Uint8Array.from(
    globalThis.atob(input),
    (c) => c.codePointAt(0)
  );
}
function base64Encode(input) {
  if (globalThis.Buffer) {
    return Buffer.from(input).toString("base64");
  }
  return globalThis.btoa(String.fromCodePoint(...input));
}

const storageKeyProperties = [
  "has",
  "hasItem",
  "get",
  "getItem",
  "getItemRaw",
  "set",
  "setItem",
  "setItemRaw",
  "del",
  "remove",
  "removeItem",
  "getMeta",
  "setMeta",
  "removeMeta",
  "getKeys",
  "clear",
  "mount",
  "unmount"
];
function prefixStorage(storage, base) {
  base = normalizeBaseKey(base);
  if (!base) {
    return storage;
  }
  const nsStorage = { ...storage };
  for (const property of storageKeyProperties) {
    nsStorage[property] = (key = "", ...args) => (
      // @ts-ignore
      storage[property](base + key, ...args)
    );
  }
  nsStorage.getKeys = (key = "", ...arguments_) => storage.getKeys(base + key, ...arguments_).then((keys) => keys.map((key2) => key2.slice(base.length)));
  nsStorage.keys = nsStorage.getKeys;
  nsStorage.getItems = async (items, commonOptions) => {
    const prefixedItems = items.map(
      (item) => typeof item === "string" ? base + item : { ...item, key: base + item.key }
    );
    const results = await storage.getItems(prefixedItems, commonOptions);
    return results.map((entry) => ({
      key: entry.key.slice(base.length),
      value: entry.value
    }));
  };
  nsStorage.setItems = async (items, commonOptions) => {
    const prefixedItems = items.map((item) => ({
      key: base + item.key,
      value: item.value,
      options: item.options
    }));
    return storage.setItems(prefixedItems, commonOptions);
  };
  return nsStorage;
}
function normalizeKey$1(key) {
  if (!key) {
    return "";
  }
  return key.split("?")[0]?.replace(/[/\\]/g, ":").replace(/:+/g, ":").replace(/^:|:$/g, "") || "";
}
function joinKeys(...keys) {
  return normalizeKey$1(keys.join(":"));
}
function normalizeBaseKey(base) {
  base = normalizeKey$1(base);
  return base ? base + ":" : "";
}
function filterKeyByDepth(key, depth) {
  if (depth === void 0) {
    return true;
  }
  let substrCount = 0;
  let index = key.indexOf(":");
  while (index > -1) {
    substrCount++;
    index = key.indexOf(":", index + 1);
  }
  return substrCount <= depth;
}
function filterKeyByBase(key, base) {
  if (base) {
    return key.startsWith(base) && key[key.length - 1] !== "$";
  }
  return key[key.length - 1] !== "$";
}

function defineDriver$1(factory) {
  return factory;
}

const DRIVER_NAME$1 = "memory";
const memory = defineDriver$1(() => {
  const data = /* @__PURE__ */ new Map();
  return {
    name: DRIVER_NAME$1,
    getInstance: () => data,
    hasItem(key) {
      return data.has(key);
    },
    getItem(key) {
      return data.get(key) ?? null;
    },
    getItemRaw(key) {
      return data.get(key) ?? null;
    },
    setItem(key, value) {
      data.set(key, value);
    },
    setItemRaw(key, value) {
      data.set(key, value);
    },
    removeItem(key) {
      data.delete(key);
    },
    getKeys() {
      return [...data.keys()];
    },
    clear() {
      data.clear();
    },
    dispose() {
      data.clear();
    }
  };
});

function createStorage(options = {}) {
  const context = {
    mounts: { "": options.driver || memory() },
    mountpoints: [""],
    watching: false,
    watchListeners: [],
    unwatch: {}
  };
  const getMount = (key) => {
    for (const base of context.mountpoints) {
      if (key.startsWith(base)) {
        return {
          base,
          relativeKey: key.slice(base.length),
          driver: context.mounts[base]
        };
      }
    }
    return {
      base: "",
      relativeKey: key,
      driver: context.mounts[""]
    };
  };
  const getMounts = (base, includeParent) => {
    return context.mountpoints.filter(
      (mountpoint) => mountpoint.startsWith(base) || includeParent && base.startsWith(mountpoint)
    ).map((mountpoint) => ({
      relativeBase: base.length > mountpoint.length ? base.slice(mountpoint.length) : void 0,
      mountpoint,
      driver: context.mounts[mountpoint]
    }));
  };
  const onChange = (event, key) => {
    if (!context.watching) {
      return;
    }
    key = normalizeKey$1(key);
    for (const listener of context.watchListeners) {
      listener(event, key);
    }
  };
  const startWatch = async () => {
    if (context.watching) {
      return;
    }
    context.watching = true;
    for (const mountpoint in context.mounts) {
      context.unwatch[mountpoint] = await watch(
        context.mounts[mountpoint],
        onChange,
        mountpoint
      );
    }
  };
  const stopWatch = async () => {
    if (!context.watching) {
      return;
    }
    for (const mountpoint in context.unwatch) {
      await context.unwatch[mountpoint]();
    }
    context.unwatch = {};
    context.watching = false;
  };
  const runBatch = (items, commonOptions, cb) => {
    const batches = /* @__PURE__ */ new Map();
    const getBatch = (mount) => {
      let batch = batches.get(mount.base);
      if (!batch) {
        batch = {
          driver: mount.driver,
          base: mount.base,
          items: []
        };
        batches.set(mount.base, batch);
      }
      return batch;
    };
    for (const item of items) {
      const isStringItem = typeof item === "string";
      const key = normalizeKey$1(isStringItem ? item : item.key);
      const value = isStringItem ? void 0 : item.value;
      const options2 = isStringItem || !item.options ? commonOptions : { ...commonOptions, ...item.options };
      const mount = getMount(key);
      getBatch(mount).items.push({
        key,
        value,
        relativeKey: mount.relativeKey,
        options: options2
      });
    }
    return Promise.all([...batches.values()].map((batch) => cb(batch))).then(
      (r) => r.flat()
    );
  };
  const storage = {
    // Item
    hasItem(key, opts = {}) {
      key = normalizeKey$1(key);
      const { relativeKey, driver } = getMount(key);
      return asyncCall(driver.hasItem, relativeKey, opts);
    },
    getItem(key, opts = {}) {
      key = normalizeKey$1(key);
      const { relativeKey, driver } = getMount(key);
      return asyncCall(driver.getItem, relativeKey, opts).then(
        (value) => destr(value)
      );
    },
    getItems(items, commonOptions = {}) {
      return runBatch(items, commonOptions, (batch) => {
        if (batch.driver.getItems) {
          return asyncCall(
            batch.driver.getItems,
            batch.items.map((item) => ({
              key: item.relativeKey,
              options: item.options
            })),
            commonOptions
          ).then(
            (r) => r.map((item) => ({
              key: joinKeys(batch.base, item.key),
              value: destr(item.value)
            }))
          );
        }
        return Promise.all(
          batch.items.map((item) => {
            return asyncCall(
              batch.driver.getItem,
              item.relativeKey,
              item.options
            ).then((value) => ({
              key: item.key,
              value: destr(value)
            }));
          })
        );
      });
    },
    getItemRaw(key, opts = {}) {
      key = normalizeKey$1(key);
      const { relativeKey, driver } = getMount(key);
      if (driver.getItemRaw) {
        return asyncCall(driver.getItemRaw, relativeKey, opts);
      }
      return asyncCall(driver.getItem, relativeKey, opts).then(
        (value) => deserializeRaw(value)
      );
    },
    async setItem(key, value, opts = {}) {
      if (value === void 0) {
        return storage.removeItem(key);
      }
      key = normalizeKey$1(key);
      const { relativeKey, driver } = getMount(key);
      if (!driver.setItem) {
        return;
      }
      await asyncCall(driver.setItem, relativeKey, stringify(value), opts);
      if (!driver.watch) {
        onChange("update", key);
      }
    },
    async setItems(items, commonOptions) {
      await runBatch(items, commonOptions, async (batch) => {
        if (batch.driver.setItems) {
          return asyncCall(
            batch.driver.setItems,
            batch.items.map((item) => ({
              key: item.relativeKey,
              value: stringify(item.value),
              options: item.options
            })),
            commonOptions
          );
        }
        if (!batch.driver.setItem) {
          return;
        }
        await Promise.all(
          batch.items.map((item) => {
            return asyncCall(
              batch.driver.setItem,
              item.relativeKey,
              stringify(item.value),
              item.options
            );
          })
        );
      });
    },
    async setItemRaw(key, value, opts = {}) {
      if (value === void 0) {
        return storage.removeItem(key, opts);
      }
      key = normalizeKey$1(key);
      const { relativeKey, driver } = getMount(key);
      if (driver.setItemRaw) {
        await asyncCall(driver.setItemRaw, relativeKey, value, opts);
      } else if (driver.setItem) {
        await asyncCall(driver.setItem, relativeKey, serializeRaw(value), opts);
      } else {
        return;
      }
      if (!driver.watch) {
        onChange("update", key);
      }
    },
    async removeItem(key, opts = {}) {
      if (typeof opts === "boolean") {
        opts = { removeMeta: opts };
      }
      key = normalizeKey$1(key);
      const { relativeKey, driver } = getMount(key);
      if (!driver.removeItem) {
        return;
      }
      await asyncCall(driver.removeItem, relativeKey, opts);
      if (opts.removeMeta || opts.removeMata) {
        await asyncCall(driver.removeItem, relativeKey + "$", opts);
      }
      if (!driver.watch) {
        onChange("remove", key);
      }
    },
    // Meta
    async getMeta(key, opts = {}) {
      if (typeof opts === "boolean") {
        opts = { nativeOnly: opts };
      }
      key = normalizeKey$1(key);
      const { relativeKey, driver } = getMount(key);
      const meta = /* @__PURE__ */ Object.create(null);
      if (driver.getMeta) {
        Object.assign(meta, await asyncCall(driver.getMeta, relativeKey, opts));
      }
      if (!opts.nativeOnly) {
        const value = await asyncCall(
          driver.getItem,
          relativeKey + "$",
          opts
        ).then((value_) => destr(value_));
        if (value && typeof value === "object") {
          if (typeof value.atime === "string") {
            value.atime = new Date(value.atime);
          }
          if (typeof value.mtime === "string") {
            value.mtime = new Date(value.mtime);
          }
          Object.assign(meta, value);
        }
      }
      return meta;
    },
    setMeta(key, value, opts = {}) {
      return this.setItem(key + "$", value, opts);
    },
    removeMeta(key, opts = {}) {
      return this.removeItem(key + "$", opts);
    },
    // Keys
    async getKeys(base, opts = {}) {
      base = normalizeBaseKey(base);
      const mounts = getMounts(base, true);
      let maskedMounts = [];
      const allKeys = [];
      let allMountsSupportMaxDepth = true;
      for (const mount of mounts) {
        if (!mount.driver.flags?.maxDepth) {
          allMountsSupportMaxDepth = false;
        }
        const rawKeys = await asyncCall(
          mount.driver.getKeys,
          mount.relativeBase,
          opts
        );
        for (const key of rawKeys) {
          const fullKey = mount.mountpoint + normalizeKey$1(key);
          if (!maskedMounts.some((p) => fullKey.startsWith(p))) {
            allKeys.push(fullKey);
          }
        }
        maskedMounts = [
          mount.mountpoint,
          ...maskedMounts.filter((p) => !p.startsWith(mount.mountpoint))
        ];
      }
      const shouldFilterByDepth = opts.maxDepth !== void 0 && !allMountsSupportMaxDepth;
      return allKeys.filter(
        (key) => (!shouldFilterByDepth || filterKeyByDepth(key, opts.maxDepth)) && filterKeyByBase(key, base)
      );
    },
    // Utils
    async clear(base, opts = {}) {
      base = normalizeBaseKey(base);
      await Promise.all(
        getMounts(base, false).map(async (m) => {
          if (m.driver.clear) {
            return asyncCall(m.driver.clear, m.relativeBase, opts);
          }
          if (m.driver.removeItem) {
            const keys = await m.driver.getKeys(m.relativeBase || "", opts);
            return Promise.all(
              keys.map((key) => m.driver.removeItem(key, opts))
            );
          }
        })
      );
    },
    async dispose() {
      await Promise.all(
        Object.values(context.mounts).map((driver) => dispose(driver))
      );
    },
    async watch(callback) {
      await startWatch();
      context.watchListeners.push(callback);
      return async () => {
        context.watchListeners = context.watchListeners.filter(
          (listener) => listener !== callback
        );
        if (context.watchListeners.length === 0) {
          await stopWatch();
        }
      };
    },
    async unwatch() {
      context.watchListeners = [];
      await stopWatch();
    },
    // Mount
    mount(base, driver) {
      base = normalizeBaseKey(base);
      if (base && context.mounts[base]) {
        throw new Error(`already mounted at ${base}`);
      }
      if (base) {
        context.mountpoints.push(base);
        context.mountpoints.sort((a, b) => b.length - a.length);
      }
      context.mounts[base] = driver;
      if (context.watching) {
        Promise.resolve(watch(driver, onChange, base)).then((unwatcher) => {
          context.unwatch[base] = unwatcher;
        }).catch(console.error);
      }
      return storage;
    },
    async unmount(base, _dispose = true) {
      base = normalizeBaseKey(base);
      if (!base || !context.mounts[base]) {
        return;
      }
      if (context.watching && base in context.unwatch) {
        context.unwatch[base]?.();
        delete context.unwatch[base];
      }
      if (_dispose) {
        await dispose(context.mounts[base]);
      }
      context.mountpoints = context.mountpoints.filter((key) => key !== base);
      delete context.mounts[base];
    },
    getMount(key = "") {
      key = normalizeKey$1(key) + ":";
      const m = getMount(key);
      return {
        driver: m.driver,
        base: m.base
      };
    },
    getMounts(base = "", opts = {}) {
      base = normalizeKey$1(base);
      const mounts = getMounts(base, opts.parents);
      return mounts.map((m) => ({
        driver: m.driver,
        base: m.mountpoint
      }));
    },
    // Aliases
    keys: (base, opts = {}) => storage.getKeys(base, opts),
    get: (key, opts = {}) => storage.getItem(key, opts),
    set: (key, value, opts = {}) => storage.setItem(key, value, opts),
    has: (key, opts = {}) => storage.hasItem(key, opts),
    del: (key, opts = {}) => storage.removeItem(key, opts),
    remove: (key, opts = {}) => storage.removeItem(key, opts)
  };
  return storage;
}
function watch(driver, onChange, base) {
  return driver.watch ? driver.watch((event, key) => onChange(event, base + key)) : () => {
  };
}
async function dispose(driver) {
  if (typeof driver.dispose === "function") {
    await asyncCall(driver.dispose);
  }
}

const _assets = {

};

const normalizeKey = function normalizeKey(key) {
  if (!key) {
    return "";
  }
  return key.split("?")[0]?.replace(/[/\\]/g, ":").replace(/:+/g, ":").replace(/^:|:$/g, "") || "";
};

const assets$1 = {
  getKeys() {
    return Promise.resolve(Object.keys(_assets))
  },
  hasItem (id) {
    id = normalizeKey(id);
    return Promise.resolve(id in _assets)
  },
  getItem (id) {
    id = normalizeKey(id);
    return Promise.resolve(_assets[id] ? _assets[id].import() : null)
  },
  getMeta (id) {
    id = normalizeKey(id);
    return Promise.resolve(_assets[id] ? _assets[id].meta : {})
  }
};

function defineDriver(factory) {
  return factory;
}
function createError(driver, message, opts) {
  const err = new Error(`[unstorage] [${driver}] ${message}`, opts);
  if (Error.captureStackTrace) {
    Error.captureStackTrace(err, createError);
  }
  return err;
}
function createRequiredError(driver, name) {
  if (Array.isArray(name)) {
    return createError(
      driver,
      `Missing some of the required options ${name.map((n) => "`" + n + "`").join(", ")}`
    );
  }
  return createError(driver, `Missing required option \`${name}\`.`);
}

function ignoreNotfound(err) {
  return err.code === "ENOENT" || err.code === "EISDIR" ? null : err;
}
function ignoreExists(err) {
  return err.code === "EEXIST" ? null : err;
}
async function writeFile(path, data, encoding) {
  await ensuredir(dirname$1(path));
  return promises.writeFile(path, data, encoding);
}
function readFile(path, encoding) {
  return promises.readFile(path, encoding).catch(ignoreNotfound);
}
function unlink(path) {
  return promises.unlink(path).catch(ignoreNotfound);
}
function readdir(dir) {
  return promises.readdir(dir, { withFileTypes: true }).catch(ignoreNotfound).then((r) => r || []);
}
async function ensuredir(dir) {
  if (existsSync(dir)) {
    return;
  }
  await ensuredir(dirname$1(dir)).catch(ignoreExists);
  await promises.mkdir(dir).catch(ignoreExists);
}
async function readdirRecursive(dir, ignore, maxDepth) {
  if (ignore && ignore(dir)) {
    return [];
  }
  const entries = await readdir(dir);
  const files = [];
  await Promise.all(
    entries.map(async (entry) => {
      const entryPath = resolve$1(dir, entry.name);
      if (entry.isDirectory()) {
        if (maxDepth === void 0 || maxDepth > 0) {
          const dirFiles = await readdirRecursive(
            entryPath,
            ignore,
            maxDepth === void 0 ? void 0 : maxDepth - 1
          );
          files.push(...dirFiles.map((f) => entry.name + "/" + f));
        }
      } else {
        if (!(ignore && ignore(entry.name))) {
          files.push(entry.name);
        }
      }
    })
  );
  return files;
}
async function rmRecursive(dir) {
  const entries = await readdir(dir);
  await Promise.all(
    entries.map((entry) => {
      const entryPath = resolve$1(dir, entry.name);
      if (entry.isDirectory()) {
        return rmRecursive(entryPath).then(() => promises.rmdir(entryPath));
      } else {
        return promises.unlink(entryPath);
      }
    })
  );
}

const PATH_TRAVERSE_RE = /\.\.:|\.\.$/;
const DRIVER_NAME = "fs-lite";
const unstorage_47drivers_47fs_45lite = defineDriver((opts = {}) => {
  if (!opts.base) {
    throw createRequiredError(DRIVER_NAME, "base");
  }
  opts.base = resolve$1(opts.base);
  const r = (key) => {
    if (PATH_TRAVERSE_RE.test(key)) {
      throw createError(
        DRIVER_NAME,
        `Invalid key: ${JSON.stringify(key)}. It should not contain .. segments`
      );
    }
    const resolved = join(opts.base, key.replace(/:/g, "/"));
    return resolved;
  };
  return {
    name: DRIVER_NAME,
    options: opts,
    flags: {
      maxDepth: true
    },
    hasItem(key) {
      return existsSync(r(key));
    },
    getItem(key) {
      return readFile(r(key), "utf8");
    },
    getItemRaw(key) {
      return readFile(r(key));
    },
    async getMeta(key) {
      const { atime, mtime, size, birthtime, ctime } = await promises.stat(r(key)).catch(() => ({}));
      return { atime, mtime, size, birthtime, ctime };
    },
    setItem(key, value) {
      if (opts.readOnly) {
        return;
      }
      return writeFile(r(key), value, "utf8");
    },
    setItemRaw(key, value) {
      if (opts.readOnly) {
        return;
      }
      return writeFile(r(key), value);
    },
    removeItem(key) {
      if (opts.readOnly) {
        return;
      }
      return unlink(r(key));
    },
    getKeys(_base, topts) {
      return readdirRecursive(r("."), opts.ignore, topts?.maxDepth);
    },
    async clear() {
      if (opts.readOnly || opts.noClear) {
        return;
      }
      await rmRecursive(r("."));
    }
  };
});

const storage = createStorage({});

storage.mount('/assets', assets$1);

storage.mount('data', unstorage_47drivers_47fs_45lite({"driver":"fsLite","base":"./.data/kv"}));

function useStorage(base = "") {
  return base ? prefixStorage(storage, base) : storage;
}

function serialize$1(o){return typeof o=="string"?`'${o}'`:new c().serialize(o)}const c=/*@__PURE__*/function(){class o{#t=new Map;compare(t,r){const e=typeof t,n=typeof r;return e==="string"&&n==="string"?t.localeCompare(r):e==="number"&&n==="number"?t-r:String.prototype.localeCompare.call(this.serialize(t,true),this.serialize(r,true))}serialize(t,r){if(t===null)return "null";switch(typeof t){case "string":return r?t:`'${t}'`;case "bigint":return `${t}n`;case "object":return this.$object(t);case "function":return this.$function(t)}return String(t)}serializeObject(t){const r=Object.prototype.toString.call(t);if(r!=="[object Object]")return this.serializeBuiltInType(r.length<10?`unknown:${r}`:r.slice(8,-1),t);const e=t.constructor,n=e===Object||e===void 0?"":e.name;if(n!==""&&globalThis[n]===e)return this.serializeBuiltInType(n,t);if(typeof t.toJSON=="function"){const i=t.toJSON();return n+(i!==null&&typeof i=="object"?this.$object(i):`(${this.serialize(i)})`)}return this.serializeObjectEntries(n,Object.entries(t))}serializeBuiltInType(t,r){const e=this["$"+t];if(e)return e.call(this,r);if(typeof r?.entries=="function")return this.serializeObjectEntries(t,r.entries());throw new Error(`Cannot serialize ${t}`)}serializeObjectEntries(t,r){const e=Array.from(r).sort((i,a)=>this.compare(i[0],a[0]));let n=`${t}{`;for(let i=0;i<e.length;i++){const[a,l]=e[i];n+=`${this.serialize(a,true)}:${this.serialize(l)}`,i<e.length-1&&(n+=",");}return n+"}"}$object(t){let r=this.#t.get(t);return r===void 0&&(this.#t.set(t,`#${this.#t.size}`),r=this.serializeObject(t),this.#t.set(t,r)),r}$function(t){const r=Function.prototype.toString.call(t);return r.slice(-15)==="[native code] }"?`${t.name||""}()[native]`:`${t.name}(${t.length})${r.replace(/\s*\n\s*/g,"")}`}$Array(t){let r="[";for(let e=0;e<t.length;e++)r+=this.serialize(t[e]),e<t.length-1&&(r+=",");return r+"]"}$Date(t){try{return `Date(${t.toISOString()})`}catch{return "Date(null)"}}$ArrayBuffer(t){return `ArrayBuffer[${new Uint8Array(t).join(",")}]`}$Set(t){return `Set${this.$Array(Array.from(t).sort((r,e)=>this.compare(r,e)))}`}$Map(t){return this.serializeObjectEntries("Map",t.entries())}}for(const s of ["Error","RegExp","URL"])o.prototype["$"+s]=function(t){return `${s}(${t})`};for(const s of ["Int8Array","Uint8Array","Uint8ClampedArray","Int16Array","Uint16Array","Int32Array","Uint32Array","Float32Array","Float64Array"])o.prototype["$"+s]=function(t){return `${s}[${t.join(",")}]`};for(const s of ["BigInt64Array","BigUint64Array"])o.prototype["$"+s]=function(t){return `${s}[${t.join("n,")}${t.length>0?"n":""}]`};return o}();

function isEqual(object1, object2) {
  if (object1 === object2) {
    return true;
  }
  if (serialize$1(object1) === serialize$1(object2)) {
    return true;
  }
  return false;
}

const e=globalThis.process?.getBuiltinModule?.("crypto")?.hash,r="sha256",s="base64url";function digest(t){if(e)return e(r,t,s);const o=createHash(r).update(t);return globalThis.process?.versions?.webcontainer?o.digest().toString(s):o.digest(s)}

const Hasher = /* @__PURE__ */ (() => {
  class Hasher2 {
    buff = "";
    #context = /* @__PURE__ */ new Map();
    write(str) {
      this.buff += str;
    }
    dispatch(value) {
      const type = value === null ? "null" : typeof value;
      return this[type](value);
    }
    object(object) {
      if (object && typeof object.toJSON === "function") {
        return this.object(object.toJSON());
      }
      const objString = Object.prototype.toString.call(object);
      let objType = "";
      const objectLength = objString.length;
      objType = objectLength < 10 ? "unknown:[" + objString + "]" : objString.slice(8, objectLength - 1);
      objType = objType.toLowerCase();
      let objectNumber = null;
      if ((objectNumber = this.#context.get(object)) === void 0) {
        this.#context.set(object, this.#context.size);
      } else {
        return this.dispatch("[CIRCULAR:" + objectNumber + "]");
      }
      if (typeof Buffer !== "undefined" && Buffer.isBuffer && Buffer.isBuffer(object)) {
        this.write("buffer:");
        return this.write(object.toString("utf8"));
      }
      if (objType !== "object" && objType !== "function" && objType !== "asyncfunction") {
        if (this[objType]) {
          this[objType](object);
        } else {
          this.unknown(object, objType);
        }
      } else {
        const keys = Object.keys(object).sort();
        const extraKeys = [];
        this.write("object:" + (keys.length + extraKeys.length) + ":");
        const dispatchForKey = (key) => {
          this.dispatch(key);
          this.write(":");
          this.dispatch(object[key]);
          this.write(",");
        };
        for (const key of keys) {
          dispatchForKey(key);
        }
        for (const key of extraKeys) {
          dispatchForKey(key);
        }
      }
    }
    array(arr, unordered) {
      unordered = unordered === void 0 ? false : unordered;
      this.write("array:" + arr.length + ":");
      if (!unordered || arr.length <= 1) {
        for (const entry of arr) {
          this.dispatch(entry);
        }
        return;
      }
      const contextAdditions = /* @__PURE__ */ new Map();
      const entries = arr.map((entry) => {
        const hasher = new Hasher2();
        hasher.dispatch(entry);
        for (const [key, value] of hasher.#context) {
          contextAdditions.set(key, value);
        }
        return hasher.toString();
      });
      this.#context = contextAdditions;
      entries.sort();
      return this.array(entries, false);
    }
    date(date) {
      return this.write("date:" + date.toJSON());
    }
    symbol(sym) {
      return this.write("symbol:" + sym.toString());
    }
    unknown(value, type) {
      this.write(type);
      if (!value) {
        return;
      }
      this.write(":");
      if (value && typeof value.entries === "function") {
        return this.array(
          [...value.entries()],
          true
          /* ordered */
        );
      }
    }
    error(err) {
      return this.write("error:" + err.toString());
    }
    boolean(bool) {
      return this.write("bool:" + bool);
    }
    string(string) {
      this.write("string:" + string.length + ":");
      this.write(string);
    }
    function(fn) {
      this.write("fn:");
      if (isNativeFunction(fn)) {
        this.dispatch("[native]");
      } else {
        this.dispatch(fn.toString());
      }
    }
    number(number) {
      return this.write("number:" + number);
    }
    null() {
      return this.write("Null");
    }
    undefined() {
      return this.write("Undefined");
    }
    regexp(regex) {
      return this.write("regex:" + regex.toString());
    }
    arraybuffer(arr) {
      this.write("arraybuffer:");
      return this.dispatch(new Uint8Array(arr));
    }
    url(url) {
      return this.write("url:" + url.toString());
    }
    map(map) {
      this.write("map:");
      const arr = [...map];
      return this.array(arr, false);
    }
    set(set) {
      this.write("set:");
      const arr = [...set];
      return this.array(arr, false);
    }
    bigint(number) {
      return this.write("bigint:" + number.toString());
    }
  }
  for (const type of [
    "uint8array",
    "uint8clampedarray",
    "unt8array",
    "uint16array",
    "unt16array",
    "uint32array",
    "unt32array",
    "float32array",
    "float64array"
  ]) {
    Hasher2.prototype[type] = function(arr) {
      this.write(type + ":");
      return this.array([...arr], false);
    };
  }
  function isNativeFunction(f) {
    if (typeof f !== "function") {
      return false;
    }
    return Function.prototype.toString.call(f).slice(
      -15
      /* "[native code] }".length */
    ) === "[native code] }";
  }
  return Hasher2;
})();
function serialize(object) {
  const hasher = new Hasher();
  hasher.dispatch(object);
  return hasher.buff;
}
function hash(value) {
  return digest(typeof value === "string" ? value : serialize(value)).replace(/[-_]/g, "").slice(0, 10);
}

function defaultCacheOptions() {
  return {
    name: "_",
    base: "/cache",
    swr: true,
    maxAge: 1
  };
}
function defineCachedFunction(fn, opts = {}) {
  opts = { ...defaultCacheOptions(), ...opts };
  const pending = {};
  const group = opts.group || "nitro/functions";
  const name = opts.name || fn.name || "_";
  const integrity = opts.integrity || hash([fn, opts]);
  const validate = opts.validate || ((entry) => entry.value !== void 0);
  async function get(key, resolver, shouldInvalidateCache, event) {
    const cacheKey = [opts.base, group, name, key + ".json"].filter(Boolean).join(":").replace(/:\/$/, ":index");
    let entry = await useStorage().getItem(cacheKey).catch((error) => {
      console.error(`[cache] Cache read error.`, error);
      useNitroApp().captureError(error, { event, tags: ["cache"] });
    }) || {};
    if (typeof entry !== "object") {
      entry = {};
      const error = new Error("Malformed data read from cache.");
      console.error("[cache]", error);
      useNitroApp().captureError(error, { event, tags: ["cache"] });
    }
    const ttl = (opts.maxAge ?? 0) * 1e3;
    if (ttl) {
      entry.expires = Date.now() + ttl;
    }
    const expired = shouldInvalidateCache || entry.integrity !== integrity || ttl && Date.now() - (entry.mtime || 0) > ttl || validate(entry) === false;
    const _resolve = async () => {
      const isPending = pending[key];
      if (!isPending) {
        if (entry.value !== void 0 && (opts.staleMaxAge || 0) >= 0 && opts.swr === false) {
          entry.value = void 0;
          entry.integrity = void 0;
          entry.mtime = void 0;
          entry.expires = void 0;
        }
        pending[key] = Promise.resolve(resolver());
      }
      try {
        entry.value = await pending[key];
      } catch (error) {
        if (!isPending) {
          delete pending[key];
        }
        throw error;
      }
      if (!isPending) {
        entry.mtime = Date.now();
        entry.integrity = integrity;
        delete pending[key];
        if (validate(entry) !== false) {
          let setOpts;
          if (opts.maxAge && !opts.swr) {
            setOpts = { ttl: opts.maxAge };
          }
          const promise = useStorage().setItem(cacheKey, entry, setOpts).catch((error) => {
            console.error(`[cache] Cache write error.`, error);
            useNitroApp().captureError(error, { event, tags: ["cache"] });
          });
          if (event?.waitUntil) {
            event.waitUntil(promise);
          }
        }
      }
    };
    const _resolvePromise = expired ? _resolve() : Promise.resolve();
    if (entry.value === void 0) {
      await _resolvePromise;
    } else if (expired && event && event.waitUntil) {
      event.waitUntil(_resolvePromise);
    }
    if (opts.swr && validate(entry) !== false) {
      _resolvePromise.catch((error) => {
        console.error(`[cache] SWR handler error.`, error);
        useNitroApp().captureError(error, { event, tags: ["cache"] });
      });
      return entry;
    }
    return _resolvePromise.then(() => entry);
  }
  return async (...args) => {
    const shouldBypassCache = await opts.shouldBypassCache?.(...args);
    if (shouldBypassCache) {
      return fn(...args);
    }
    const key = await (opts.getKey || getKey)(...args);
    const shouldInvalidateCache = await opts.shouldInvalidateCache?.(...args);
    const entry = await get(
      key,
      () => fn(...args),
      shouldInvalidateCache,
      args[0] && isEvent(args[0]) ? args[0] : void 0
    );
    let value = entry.value;
    if (opts.transform) {
      value = await opts.transform(entry, ...args) || value;
    }
    return value;
  };
}
function cachedFunction(fn, opts = {}) {
  return defineCachedFunction(fn, opts);
}
function getKey(...args) {
  return args.length > 0 ? hash(args) : "";
}
function escapeKey(key) {
  return String(key).replace(/\W/g, "");
}
function defineCachedEventHandler(handler, opts = defaultCacheOptions()) {
  const variableHeaderNames = (opts.varies || []).filter(Boolean).map((h) => h.toLowerCase()).sort();
  const _opts = {
    ...opts,
    getKey: async (event) => {
      const customKey = await opts.getKey?.(event);
      if (customKey) {
        return escapeKey(customKey);
      }
      const _path = event.node.req.originalUrl || event.node.req.url || event.path;
      let _pathname;
      try {
        _pathname = escapeKey(decodeURI(parseURL(_path).pathname)).slice(0, 16) || "index";
      } catch {
        _pathname = "-";
      }
      const _hashedPath = `${_pathname}.${hash(_path)}`;
      const _headers = variableHeaderNames.map((header) => [header, event.node.req.headers[header]]).map(([name, value]) => `${escapeKey(name)}.${hash(value)}`);
      return [_hashedPath, ..._headers].join(":");
    },
    validate: (entry) => {
      if (!entry.value) {
        return false;
      }
      if (entry.value.code >= 400) {
        return false;
      }
      if (entry.value.body === void 0) {
        return false;
      }
      if (entry.value.headers.etag === "undefined" || entry.value.headers["last-modified"] === "undefined") {
        return false;
      }
      return true;
    },
    group: opts.group || "nitro/handlers",
    integrity: opts.integrity || hash([handler, opts])
  };
  const _cachedHandler = cachedFunction(
    async (incomingEvent) => {
      const variableHeaders = {};
      for (const header of variableHeaderNames) {
        const value = incomingEvent.node.req.headers[header];
        if (value !== void 0) {
          variableHeaders[header] = value;
        }
      }
      const reqProxy = cloneWithProxy(incomingEvent.node.req, {
        headers: variableHeaders
      });
      const resHeaders = {};
      let _resSendBody;
      const resProxy = cloneWithProxy(incomingEvent.node.res, {
        statusCode: 200,
        writableEnded: false,
        writableFinished: false,
        headersSent: false,
        closed: false,
        getHeader(name) {
          return resHeaders[name];
        },
        setHeader(name, value) {
          resHeaders[name] = value;
          return this;
        },
        getHeaderNames() {
          return Object.keys(resHeaders);
        },
        hasHeader(name) {
          return name in resHeaders;
        },
        removeHeader(name) {
          delete resHeaders[name];
        },
        getHeaders() {
          return resHeaders;
        },
        end(chunk, arg2, arg3) {
          if (typeof chunk === "string") {
            _resSendBody = chunk;
          }
          if (typeof arg2 === "function") {
            arg2();
          }
          if (typeof arg3 === "function") {
            arg3();
          }
          return this;
        },
        write(chunk, arg2, arg3) {
          if (typeof chunk === "string") {
            _resSendBody = chunk;
          }
          if (typeof arg2 === "function") {
            arg2(void 0);
          }
          if (typeof arg3 === "function") {
            arg3();
          }
          return true;
        },
        writeHead(statusCode, headers2) {
          this.statusCode = statusCode;
          if (headers2) {
            if (Array.isArray(headers2) || typeof headers2 === "string") {
              throw new TypeError("Raw headers  is not supported.");
            }
            for (const header in headers2) {
              const value = headers2[header];
              if (value !== void 0) {
                this.setHeader(
                  header,
                  value
                );
              }
            }
          }
          return this;
        }
      });
      const event = createEvent(reqProxy, resProxy);
      event.fetch = (url, fetchOptions) => fetchWithEvent(event, url, fetchOptions, {
        fetch: useNitroApp().localFetch
      });
      event.$fetch = (url, fetchOptions) => fetchWithEvent(event, url, fetchOptions, {
        fetch: globalThis.$fetch
      });
      event.waitUntil = incomingEvent.waitUntil;
      event.context = incomingEvent.context;
      event.context.cache = {
        options: _opts
      };
      const body = await handler(event) || _resSendBody;
      const headers = event.node.res.getHeaders();
      headers.etag = String(
        headers.Etag || headers.etag || `W/"${hash(body)}"`
      );
      headers["last-modified"] = String(
        headers["Last-Modified"] || headers["last-modified"] || (/* @__PURE__ */ new Date()).toUTCString()
      );
      const cacheControl = [];
      if (opts.swr) {
        if (opts.maxAge) {
          cacheControl.push(`s-maxage=${opts.maxAge}`);
        }
        if (opts.staleMaxAge) {
          cacheControl.push(`stale-while-revalidate=${opts.staleMaxAge}`);
        } else {
          cacheControl.push("stale-while-revalidate");
        }
      } else if (opts.maxAge) {
        cacheControl.push(`max-age=${opts.maxAge}`);
      }
      if (cacheControl.length > 0) {
        headers["cache-control"] = cacheControl.join(", ");
      }
      const cacheEntry = {
        code: event.node.res.statusCode,
        headers,
        body
      };
      return cacheEntry;
    },
    _opts
  );
  return defineEventHandler(async (event) => {
    if (opts.headersOnly) {
      if (handleCacheHeaders(event, { maxAge: opts.maxAge })) {
        return;
      }
      return handler(event);
    }
    const response = await _cachedHandler(
      event
    );
    if (event.node.res.headersSent || event.node.res.writableEnded) {
      return response.body;
    }
    if (handleCacheHeaders(event, {
      modifiedTime: new Date(response.headers["last-modified"]),
      etag: response.headers.etag,
      maxAge: opts.maxAge
    })) {
      return;
    }
    event.node.res.statusCode = response.code;
    for (const name in response.headers) {
      const value = response.headers[name];
      if (name === "set-cookie") {
        event.node.res.appendHeader(
          name,
          splitCookiesString(value)
        );
      } else {
        if (value !== void 0) {
          event.node.res.setHeader(name, value);
        }
      }
    }
    return response.body;
  });
}
function cloneWithProxy(obj, overrides) {
  return new Proxy(obj, {
    get(target, property, receiver) {
      if (property in overrides) {
        return overrides[property];
      }
      return Reflect.get(target, property, receiver);
    },
    set(target, property, value, receiver) {
      if (property in overrides) {
        overrides[property] = value;
        return true;
      }
      return Reflect.set(target, property, value, receiver);
    }
  });
}
const cachedEventHandler = defineCachedEventHandler;

function klona(x) {
	if (typeof x !== 'object') return x;

	var k, tmp, str=Object.prototype.toString.call(x);

	if (str === '[object Object]') {
		if (x.constructor !== Object && typeof x.constructor === 'function') {
			tmp = new x.constructor();
			for (k in x) {
				if (x.hasOwnProperty(k) && tmp[k] !== x[k]) {
					tmp[k] = klona(x[k]);
				}
			}
		} else {
			tmp = {}; // null
			for (k in x) {
				if (k === '__proto__') {
					Object.defineProperty(tmp, k, {
						value: klona(x[k]),
						configurable: true,
						enumerable: true,
						writable: true,
					});
				} else {
					tmp[k] = klona(x[k]);
				}
			}
		}
		return tmp;
	}

	if (str === '[object Array]') {
		k = x.length;
		for (tmp=Array(k); k--;) {
			tmp[k] = klona(x[k]);
		}
		return tmp;
	}

	if (str === '[object Set]') {
		tmp = new Set;
		x.forEach(function (val) {
			tmp.add(klona(val));
		});
		return tmp;
	}

	if (str === '[object Map]') {
		tmp = new Map;
		x.forEach(function (val, key) {
			tmp.set(klona(key), klona(val));
		});
		return tmp;
	}

	if (str === '[object Date]') {
		return new Date(+x);
	}

	if (str === '[object RegExp]') {
		tmp = new RegExp(x.source, x.flags);
		tmp.lastIndex = x.lastIndex;
		return tmp;
	}

	if (str === '[object DataView]') {
		return new x.constructor( klona(x.buffer) );
	}

	if (str === '[object ArrayBuffer]') {
		return x.slice(0);
	}

	// ArrayBuffer.isView(x)
	// ~> `new` bcuz `Buffer.slice` => ref
	if (str.slice(-6) === 'Array]') {
		return new x.constructor(x);
	}

	return x;
}

const inlineAppConfig = {
  "nuxt": {}
};



const appConfig = defuFn(inlineAppConfig);

const NUMBER_CHAR_RE = /\d/;
const STR_SPLITTERS = ["-", "_", "/", "."];
function isUppercase(char = "") {
  if (NUMBER_CHAR_RE.test(char)) {
    return void 0;
  }
  return char !== char.toLowerCase();
}
function splitByCase(str, separators) {
  const splitters = STR_SPLITTERS;
  const parts = [];
  if (!str || typeof str !== "string") {
    return parts;
  }
  let buff = "";
  let previousUpper;
  let previousSplitter;
  for (const char of str) {
    const isSplitter = splitters.includes(char);
    if (isSplitter === true) {
      parts.push(buff);
      buff = "";
      previousUpper = void 0;
      continue;
    }
    const isUpper = isUppercase(char);
    if (previousSplitter === false) {
      if (previousUpper === false && isUpper === true) {
        parts.push(buff);
        buff = char;
        previousUpper = isUpper;
        continue;
      }
      if (previousUpper === true && isUpper === false && buff.length > 1) {
        const lastChar = buff.at(-1);
        parts.push(buff.slice(0, Math.max(0, buff.length - 1)));
        buff = lastChar + char;
        previousUpper = isUpper;
        continue;
      }
    }
    buff += char;
    previousUpper = isUpper;
    previousSplitter = isSplitter;
  }
  parts.push(buff);
  return parts;
}
function kebabCase(str, joiner) {
  return str ? (Array.isArray(str) ? str : splitByCase(str)).map((p) => p.toLowerCase()).join(joiner) : "";
}
function snakeCase(str) {
  return kebabCase(str || "", "_");
}

function getEnv(key, opts) {
  const envKey = snakeCase(key).toUpperCase();
  return destr(
    process.env[opts.prefix + envKey] ?? process.env[opts.altPrefix + envKey]
  );
}
function _isObject(input) {
  return typeof input === "object" && !Array.isArray(input);
}
function applyEnv(obj, opts, parentKey = "") {
  for (const key in obj) {
    const subKey = parentKey ? `${parentKey}_${key}` : key;
    const envValue = getEnv(subKey, opts);
    if (_isObject(obj[key])) {
      if (_isObject(envValue)) {
        obj[key] = { ...obj[key], ...envValue };
        applyEnv(obj[key], opts, subKey);
      } else if (envValue === void 0) {
        applyEnv(obj[key], opts, subKey);
      } else {
        obj[key] = envValue ?? obj[key];
      }
    } else {
      obj[key] = envValue ?? obj[key];
    }
    if (opts.envExpansion && typeof obj[key] === "string") {
      obj[key] = _expandFromEnv(obj[key]);
    }
  }
  return obj;
}
const envExpandRx = /\{\{([^{}]*)\}\}/g;
function _expandFromEnv(value) {
  return value.replace(envExpandRx, (match, key) => {
    return process.env[key] || match;
  });
}

const _inlineRuntimeConfig = {
  "app": {
    "baseURL": "/",
    "buildId": "0a84cc71-8867-4008-8afc-9d7c2c782d09",
    "buildAssetsDir": "/_nuxt/",
    "cdnURL": ""
  },
  "nitro": {
    "envPrefix": "NUXT_",
    "routeRules": {
      "/__nuxt_error": {
        "cache": false
      },
      "/board/**": {
        "ssr": false
      },
      "/auth/**": {
        "ssr": false
      },
      "/preview/**": {
        "ssr": true,
        "headers": {
          "X-Frame-Options": "SAMEORIGIN",
          "Content-Security-Policy": "frame-ancestors 'self'; sandbox allow-scripts allow-same-origin allow-forms"
        }
      },
      "/api/sitemap.xml": {
        "headers": {
          "Content-Type": "application/xml"
        }
      },
      "/_nuxt/builds/meta/**": {
        "headers": {
          "cache-control": "public, max-age=31536000, immutable"
        }
      },
      "/_nuxt/builds/**": {
        "headers": {
          "cache-control": "public, max-age=1, immutable"
        }
      },
      "/_nuxt/**": {
        "headers": {
          "cache-control": "public, max-age=31536000, immutable"
        }
      }
    }
  },
  "public": {
    "apiBase": "http://127.0.0.1:8000",
    "isDevelopment": false,
    "baseUrl": "http://localhost:3001",
    "siteName": "لینکو - Linku",
    "siteDescription": "پلتفرم ایرانی ساخت بیو لینک و کارت دیجیتال - تمام لینک‌های شما در یک مکان"
  },
  "apiBase": "http://127.0.0.1:8000"
};
const envOptions = {
  prefix: "NITRO_",
  altPrefix: _inlineRuntimeConfig.nitro.envPrefix ?? process.env.NITRO_ENV_PREFIX ?? "_",
  envExpansion: _inlineRuntimeConfig.nitro.envExpansion ?? process.env.NITRO_ENV_EXPANSION ?? false
};
const _sharedRuntimeConfig = _deepFreeze(
  applyEnv(klona(_inlineRuntimeConfig), envOptions)
);
function useRuntimeConfig(event) {
  if (!event) {
    return _sharedRuntimeConfig;
  }
  if (event.context.nitro.runtimeConfig) {
    return event.context.nitro.runtimeConfig;
  }
  const runtimeConfig = klona(_inlineRuntimeConfig);
  applyEnv(runtimeConfig, envOptions);
  event.context.nitro.runtimeConfig = runtimeConfig;
  return runtimeConfig;
}
_deepFreeze(klona(appConfig));
function _deepFreeze(object) {
  const propNames = Object.getOwnPropertyNames(object);
  for (const name of propNames) {
    const value = object[name];
    if (value && typeof value === "object") {
      _deepFreeze(value);
    }
  }
  return Object.freeze(object);
}
new Proxy(/* @__PURE__ */ Object.create(null), {
  get: (_, prop) => {
    console.warn(
      "Please use `useRuntimeConfig()` instead of accessing config directly."
    );
    const runtimeConfig = useRuntimeConfig();
    if (prop in runtimeConfig) {
      return runtimeConfig[prop];
    }
    return void 0;
  }
});

function createContext(opts = {}) {
  let currentInstance;
  let isSingleton = false;
  const checkConflict = (instance) => {
    if (currentInstance && currentInstance !== instance) {
      throw new Error("Context conflict");
    }
  };
  let als;
  if (opts.asyncContext) {
    const _AsyncLocalStorage = opts.AsyncLocalStorage || globalThis.AsyncLocalStorage;
    if (_AsyncLocalStorage) {
      als = new _AsyncLocalStorage();
    } else {
      console.warn("[unctx] `AsyncLocalStorage` is not provided.");
    }
  }
  const _getCurrentInstance = () => {
    if (als) {
      const instance = als.getStore();
      if (instance !== void 0) {
        return instance;
      }
    }
    return currentInstance;
  };
  return {
    use: () => {
      const _instance = _getCurrentInstance();
      if (_instance === void 0) {
        throw new Error("Context is not available");
      }
      return _instance;
    },
    tryUse: () => {
      return _getCurrentInstance();
    },
    set: (instance, replace) => {
      if (!replace) {
        checkConflict(instance);
      }
      currentInstance = instance;
      isSingleton = true;
    },
    unset: () => {
      currentInstance = void 0;
      isSingleton = false;
    },
    call: (instance, callback) => {
      checkConflict(instance);
      currentInstance = instance;
      try {
        return als ? als.run(instance, callback) : callback();
      } finally {
        if (!isSingleton) {
          currentInstance = void 0;
        }
      }
    },
    async callAsync(instance, callback) {
      currentInstance = instance;
      const onRestore = () => {
        currentInstance = instance;
      };
      const onLeave = () => currentInstance === instance ? onRestore : void 0;
      asyncHandlers.add(onLeave);
      try {
        const r = als ? als.run(instance, callback) : callback();
        if (!isSingleton) {
          currentInstance = void 0;
        }
        return await r;
      } finally {
        asyncHandlers.delete(onLeave);
      }
    }
  };
}
function createNamespace(defaultOpts = {}) {
  const contexts = {};
  return {
    get(key, opts = {}) {
      if (!contexts[key]) {
        contexts[key] = createContext({ ...defaultOpts, ...opts });
      }
      return contexts[key];
    }
  };
}
const _globalThis = typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : typeof global !== "undefined" ? global : {};
const globalKey = "__unctx__";
const defaultNamespace = _globalThis[globalKey] || (_globalThis[globalKey] = createNamespace());
const getContext = (key, opts = {}) => defaultNamespace.get(key, opts);
const asyncHandlersKey = "__unctx_async_handlers__";
const asyncHandlers = _globalThis[asyncHandlersKey] || (_globalThis[asyncHandlersKey] = /* @__PURE__ */ new Set());
function executeAsync(function_) {
  const restores = [];
  for (const leaveHandler of asyncHandlers) {
    const restore2 = leaveHandler();
    if (restore2) {
      restores.push(restore2);
    }
  }
  const restore = () => {
    for (const restore2 of restores) {
      restore2();
    }
  };
  let awaitable = function_();
  if (awaitable && typeof awaitable === "object" && "catch" in awaitable) {
    awaitable = awaitable.catch((error) => {
      restore();
      throw error;
    });
  }
  return [awaitable, restore];
}

const config = useRuntimeConfig();
const _routeRulesMatcher = toRouteMatcher(
  createRouter$1({ routes: config.nitro.routeRules })
);
function createRouteRulesHandler(ctx) {
  return eventHandler((event) => {
    const routeRules = getRouteRules(event);
    if (routeRules.headers) {
      setHeaders(event, routeRules.headers);
    }
    if (routeRules.redirect) {
      let target = routeRules.redirect.to;
      if (target.endsWith("/**")) {
        let targetPath = event.path;
        const strpBase = routeRules.redirect._redirectStripBase;
        if (strpBase) {
          targetPath = withoutBase(targetPath, strpBase);
        }
        target = joinURL(target.slice(0, -3), targetPath);
      } else if (event.path.includes("?")) {
        const query = getQuery$1(event.path);
        target = withQuery(target, query);
      }
      return sendRedirect(event, target, routeRules.redirect.statusCode);
    }
    if (routeRules.proxy) {
      let target = routeRules.proxy.to;
      if (target.endsWith("/**")) {
        let targetPath = event.path;
        const strpBase = routeRules.proxy._proxyStripBase;
        if (strpBase) {
          targetPath = withoutBase(targetPath, strpBase);
        }
        target = joinURL(target.slice(0, -3), targetPath);
      } else if (event.path.includes("?")) {
        const query = getQuery$1(event.path);
        target = withQuery(target, query);
      }
      return proxyRequest(event, target, {
        fetch: ctx.localFetch,
        ...routeRules.proxy
      });
    }
  });
}
function getRouteRules(event) {
  event.context._nitro = event.context._nitro || {};
  if (!event.context._nitro.routeRules) {
    event.context._nitro.routeRules = getRouteRulesForPath(
      withoutBase(event.path.split("?")[0], useRuntimeConfig().app.baseURL)
    );
  }
  return event.context._nitro.routeRules;
}
function getRouteRulesForPath(path) {
  return defu({}, ..._routeRulesMatcher.matchAll(path).reverse());
}

function _captureError(error, type) {
  console.error(`[${type}]`, error);
  useNitroApp().captureError(error, { tags: [type] });
}
function trapUnhandledNodeErrors() {
  process.on(
    "unhandledRejection",
    (error) => _captureError(error, "unhandledRejection")
  );
  process.on(
    "uncaughtException",
    (error) => _captureError(error, "uncaughtException")
  );
}
function joinHeaders(value) {
  return Array.isArray(value) ? value.join(", ") : String(value);
}
function normalizeFetchResponse(response) {
  if (!response.headers.has("set-cookie")) {
    return response;
  }
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers: normalizeCookieHeaders(response.headers)
  });
}
function normalizeCookieHeader(header = "") {
  return splitCookiesString(joinHeaders(header));
}
function normalizeCookieHeaders(headers) {
  const outgoingHeaders = new Headers();
  for (const [name, header] of headers) {
    if (name === "set-cookie") {
      for (const cookie of normalizeCookieHeader(header)) {
        outgoingHeaders.append("set-cookie", cookie);
      }
    } else {
      outgoingHeaders.set(name, joinHeaders(header));
    }
  }
  return outgoingHeaders;
}

function isJsonRequest(event) {
  if (hasReqHeader(event, "accept", "text/html")) {
    return false;
  }
  return hasReqHeader(event, "accept", "application/json") || hasReqHeader(event, "user-agent", "curl/") || hasReqHeader(event, "user-agent", "httpie/") || hasReqHeader(event, "sec-fetch-mode", "cors") || event.path.startsWith("/api/") || event.path.endsWith(".json");
}
function hasReqHeader(event, name, includes) {
  const value = getRequestHeader(event, name);
  return value && typeof value === "string" && value.toLowerCase().includes(includes);
}

const errorHandler$0 = (async function errorhandler(error, event, { defaultHandler }) {
  if (event.handled || isJsonRequest(event)) {
    return;
  }
  const defaultRes = await defaultHandler(error, event, { json: true });
  const statusCode = error.statusCode || 500;
  if (statusCode === 404 && defaultRes.status === 302) {
    setResponseHeaders(event, defaultRes.headers);
    setResponseStatus(event, defaultRes.status, defaultRes.statusText);
    return send(event, JSON.stringify(defaultRes.body, null, 2));
  }
  const errorObject = defaultRes.body;
  const url = new URL(errorObject.url);
  errorObject.url = withoutBase(url.pathname, useRuntimeConfig(event).app.baseURL) + url.search + url.hash;
  errorObject.message ||= "Server Error";
  errorObject.data ||= error.data;
  errorObject.statusMessage ||= error.statusMessage;
  delete defaultRes.headers["content-type"];
  delete defaultRes.headers["content-security-policy"];
  setResponseHeaders(event, defaultRes.headers);
  const reqHeaders = getRequestHeaders(event);
  const isRenderingError = event.path.startsWith("/__nuxt_error") || !!reqHeaders["x-nuxt-error"];
  const res = isRenderingError ? null : await useNitroApp().localFetch(
    withQuery(joinURL(useRuntimeConfig(event).app.baseURL, "/__nuxt_error"), errorObject),
    {
      headers: { ...reqHeaders, "x-nuxt-error": "true" },
      redirect: "manual"
    }
  ).catch(() => null);
  if (event.handled) {
    return;
  }
  if (!res) {
    const { template } = await import('./error-500.mjs');
    setResponseHeader(event, "Content-Type", "text/html;charset=UTF-8");
    return send(event, template(errorObject));
  }
  const html = await res.text();
  for (const [header, value] of res.headers.entries()) {
    if (header === "set-cookie") {
      appendResponseHeader(event, header, value);
      continue;
    }
    setResponseHeader(event, header, value);
  }
  setResponseStatus(event, res.status && res.status !== 200 ? res.status : defaultRes.status, res.statusText || defaultRes.statusText);
  return send(event, html);
});

function defineNitroErrorHandler(handler) {
  return handler;
}

const errorHandler$1 = defineNitroErrorHandler(
  function defaultNitroErrorHandler(error, event) {
    const res = defaultHandler(error, event);
    setResponseHeaders(event, res.headers);
    setResponseStatus(event, res.status, res.statusText);
    return send(event, JSON.stringify(res.body, null, 2));
  }
);
function defaultHandler(error, event, opts) {
  const isSensitive = error.unhandled || error.fatal;
  const statusCode = error.statusCode || 500;
  const statusMessage = error.statusMessage || "Server Error";
  const url = getRequestURL(event, { xForwardedHost: true, xForwardedProto: true });
  if (statusCode === 404) {
    const baseURL = "/";
    if (/^\/[^/]/.test(baseURL) && !url.pathname.startsWith(baseURL)) {
      const redirectTo = `${baseURL}${url.pathname.slice(1)}${url.search}`;
      return {
        status: 302,
        statusText: "Found",
        headers: { location: redirectTo },
        body: `Redirecting...`
      };
    }
  }
  if (isSensitive && !opts?.silent) {
    const tags = [error.unhandled && "[unhandled]", error.fatal && "[fatal]"].filter(Boolean).join(" ");
    console.error(`[request error] ${tags} [${event.method}] ${url}
`, error);
  }
  const headers = {
    "content-type": "application/json",
    // Prevent browser from guessing the MIME types of resources.
    "x-content-type-options": "nosniff",
    // Prevent error page from being embedded in an iframe
    "x-frame-options": "DENY",
    // Prevent browsers from sending the Referer header
    "referrer-policy": "no-referrer",
    // Disable the execution of any js
    "content-security-policy": "script-src 'none'; frame-ancestors 'none';"
  };
  setResponseStatus(event, statusCode, statusMessage);
  if (statusCode === 404 || !getResponseHeader(event, "cache-control")) {
    headers["cache-control"] = "no-cache";
  }
  const body = {
    error: true,
    url: url.href,
    statusCode,
    statusMessage,
    message: isSensitive ? "Server Error" : error.message,
    data: isSensitive ? void 0 : error.data
  };
  return {
    status: statusCode,
    statusText: statusMessage,
    headers,
    body
  };
}

const errorHandlers = [errorHandler$0, errorHandler$1];

async function errorHandler(error, event) {
  for (const handler of errorHandlers) {
    try {
      await handler(error, event, { defaultHandler });
      if (event.handled) {
        return; // Response handled
      }
    } catch(error) {
      // Handler itself thrown, log and continue
      console.error(error);
    }
  }
  // H3 will handle fallback
}

const plugins = [
  
];

const assets = {
  "/android-chrome-192x192.png": {
    "type": "image/png",
    "etag": "\"2025-qOmZP1KRzDA0WR9PHQzRkLIY+ZY\"",
    "mtime": "2025-11-26T22:47:33.309Z",
    "size": 8229,
    "path": "../public/android-chrome-192x192.png"
  },
  "/android-chrome-512x512.png": {
    "type": "image/png",
    "etag": "\"81a2-JriF1gNXb6Zwm33c+fvFhyae0Nc\"",
    "mtime": "2025-11-26T22:47:33.311Z",
    "size": 33186,
    "path": "../public/android-chrome-512x512.png"
  },
  "/apple-touch-icon.png": {
    "type": "image/png",
    "etag": "\"1d17-ITbwvy0+db9KSiEypyhb6K7y59g\"",
    "mtime": "2025-11-26T22:47:33.311Z",
    "size": 7447,
    "path": "../public/apple-touch-icon.png"
  },
  "/cert.pem": {
    "type": "application/x-x509-ca-cert",
    "etag": "\"6b0-EzLgZlAhMPLMcmlrvI4vVNXGW48\"",
    "mtime": "2025-11-26T22:47:33.917Z",
    "size": 1712,
    "path": "../public/cert.pem"
  },
  "/favicon-16x16.png": {
    "type": "image/png",
    "etag": "\"16e-DKGbc26G5a6jcqH1+zth4MUCN9A\"",
    "mtime": "2025-11-26T22:47:34.028Z",
    "size": 366,
    "path": "../public/favicon-16x16.png"
  },
  "/favicon-32x32.png": {
    "type": "image/png",
    "etag": "\"2c5-76m9isyUNp11vyMvkUIbfqkzPrA\"",
    "mtime": "2025-11-26T22:47:34.028Z",
    "size": 709,
    "path": "../public/favicon-32x32.png"
  },
  "/favicon.ico": {
    "type": "image/vnd.microsoft.icon",
    "etag": "\"3c2e-ATorzvwnkbS5I42kWn3Hoh608HY\"",
    "mtime": "2025-11-26T22:47:34.028Z",
    "size": 15406,
    "path": "../public/favicon.ico"
  },
  "/logo.svg": {
    "type": "image/svg+xml",
    "etag": "\"e78-F2V/dAlvjBnRbckMXCDvYfw7w/g\"",
    "mtime": "2025-11-26T22:47:34.189Z",
    "size": 3704,
    "path": "../public/logo.svg"
  },
  "/manifest.json": {
    "type": "application/json",
    "etag": "\"bb0-119fCo5vJGHdXhQ82d/jDabmmfo\"",
    "mtime": "2025-12-02T16:39:36.238Z",
    "size": 2992,
    "path": "../public/manifest.json"
  },
  "/mkcert-root-ca.pem": {
    "type": "application/x-x509-ca-cert",
    "etag": "\"6b0-EzLgZlAhMPLMcmlrvI4vVNXGW48\"",
    "mtime": "2025-11-26T22:47:34.192Z",
    "size": 1712,
    "path": "../public/mkcert-root-ca.pem"
  },
  "/robots.txt": {
    "type": "text/plain; charset=utf-8",
    "etag": "\"274-IesnqZtj9vDoozp7nBIinQehYT8\"",
    "mtime": "2025-11-26T22:47:34.193Z",
    "size": 628,
    "path": "../public/robots.txt"
  },
  "/shortcuts.json": {
    "type": "application/json",
    "etag": "\"145d-Q7lsYhAqSuehdJGoYnhGd6fZ2Sk\"",
    "mtime": "2025-11-26T22:47:34.195Z",
    "size": 5213,
    "path": "../public/shortcuts.json"
  },
  "/site.webmanifest": {
    "type": "application/manifest+json",
    "etag": "\"20d-wlI6TgqEKUJ0yt9OlLfhLzGuzKg\"",
    "mtime": "2025-11-26T22:47:34.196Z",
    "size": 525,
    "path": "../public/site.webmanifest"
  },
  "/subscription.json": {
    "type": "application/json",
    "etag": "\"1d-eEtrG/OhOuxf4YuG4zNSnq9ufYg\"",
    "mtime": "2025-11-26T22:47:34.205Z",
    "size": 29,
    "path": "../public/subscription.json"
  },
  "/sw.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"fa2-SF9JGFxPgQqLwogvdF8iz6zUlZs\"",
    "mtime": "2025-12-03T03:38:22.051Z",
    "size": 4002,
    "path": "../public/sw.js"
  },
  "/vip.png": {
    "type": "image/png",
    "etag": "\"3b78-b+mPoIPv8ThW/D2EBmSuHKJTuWo\"",
    "mtime": "2025-11-26T22:47:34.206Z",
    "size": 15224,
    "path": "../public/vip.png"
  },
  "/AppImages/icons.json": {
    "type": "application/json",
    "etag": "\"951-K5HRYhMPc/vsl3bhQRk/xACXXdY\"",
    "mtime": "2025-11-26T22:47:33.288Z",
    "size": 2385,
    "path": "../public/AppImages/icons.json"
  },
  "/avatar/1.png": {
    "type": "image/png",
    "etag": "\"34e7-Qg/OYbJEjJ6rXSVDWl5FigEfU7c\"",
    "mtime": "2025-11-26T22:47:33.910Z",
    "size": 13543,
    "path": "../public/avatar/1.png"
  },
  "/avatar/2.png": {
    "type": "image/png",
    "etag": "\"3d63-eZjud8YlKt7rGLY1XVUKpNU9PZY\"",
    "mtime": "2025-11-26T22:47:33.913Z",
    "size": 15715,
    "path": "../public/avatar/2.png"
  },
  "/avatar/3.png": {
    "type": "image/png",
    "etag": "\"38fe-VScTNUFqSGRksIe6GQMsGcEFYH8\"",
    "mtime": "2025-11-26T22:47:33.914Z",
    "size": 14590,
    "path": "../public/avatar/3.png"
  },
  "/avatar/4.png": {
    "type": "image/png",
    "etag": "\"3f95-Y0Io0NlU0qY/yxy2Wszv7FDuFeE\"",
    "mtime": "2025-11-26T22:47:33.915Z",
    "size": 16277,
    "path": "../public/avatar/4.png"
  },
  "/avatar/5.png": {
    "type": "image/png",
    "etag": "\"3c82-lq42OCfWyrAnlFokIiKP4Tl1u+g\"",
    "mtime": "2025-11-26T22:47:33.916Z",
    "size": 15490,
    "path": "../public/avatar/5.png"
  },
  "/devices/bigsticky.png": {
    "type": "image/png",
    "etag": "\"7a1b8-8zKrPsmpoXkeb/lYA9CTODEUjtk\"",
    "mtime": "2025-11-26T22:47:33.962Z",
    "size": 500152,
    "path": "../public/devices/bigsticky.png"
  },
  "/devices/bracelet.png": {
    "type": "image/png",
    "etag": "\"114431-DcPwH3su01iNytNaMbJ27gmH50w\"",
    "mtime": "2025-11-26T22:47:33.963Z",
    "size": 1131569,
    "path": "../public/devices/bracelet.png"
  },
  "/devices/card.png": {
    "type": "image/png",
    "etag": "\"8e4b9-dKzZG5cds3po2835mYUPHQHbg5E\"",
    "mtime": "2025-11-26T22:47:33.983Z",
    "size": 582841,
    "path": "../public/devices/card.png"
  },
  "/devices/goldcard.png": {
    "type": "image/png",
    "etag": "\"95479-ysHfe6bLchaJJm/GjUnMp31nOEs\"",
    "mtime": "2025-11-26T22:47:33.988Z",
    "size": 611449,
    "path": "../public/devices/goldcard.png"
  },
  "/devices/minicard.png": {
    "type": "image/png",
    "etag": "\"282e6f-q9f898p5k33YWscDon3tVZh3zbs\"",
    "mtime": "2025-11-26T22:47:34.012Z",
    "size": 2633327,
    "path": "../public/devices/minicard.png"
  },
  "/devices/stand.png": {
    "type": "image/png",
    "etag": "\"1fa486-c8NkU+2XmexWLkEi7FcVO5Q1g2Q\"",
    "mtime": "2025-11-26T22:47:34.028Z",
    "size": 2073734,
    "path": "../public/devices/stand.png"
  },
  "/devices/sticky.png": {
    "type": "image/png",
    "etag": "\"be081-W6rZ2nhQQ0psZVtTedjlYFhwTmw\"",
    "mtime": "2025-11-26T22:47:34.028Z",
    "size": 778369,
    "path": "../public/devices/sticky.png"
  },
  "/devices/Titanium.png": {
    "type": "image/png",
    "etag": "\"359789-APtOAWIRWUGNFbs1xAlHevaSEOo\"",
    "mtime": "2025-11-26T22:47:33.955Z",
    "size": 3512201,
    "path": "../public/devices/Titanium.png"
  },
  "/fonts/Shabnam-Bold.woff2": {
    "type": "font/woff2",
    "etag": "\"930c-BR9EBM5cQ6qWB+YM+XxXKUgy0V0\"",
    "mtime": "2025-11-26T22:47:34.044Z",
    "size": 37644,
    "path": "../public/fonts/Shabnam-Bold.woff2"
  },
  "/fonts/Shabnam.woff2": {
    "type": "font/woff2",
    "etag": "\"8ba8-vkEFcfA8HlEIILdX1YtcFCyk5cU\"",
    "mtime": "2025-11-26T22:47:34.044Z",
    "size": 35752,
    "path": "../public/fonts/Shabnam.woff2"
  },
  "/header/banner-1.jpg": {
    "type": "image/jpeg",
    "etag": "\"14a54-0tfln7pmzK+iZK7SB1gCt0OUQHA\"",
    "mtime": "2025-11-26T22:47:34.044Z",
    "size": 84564,
    "path": "../public/header/banner-1.jpg"
  },
  "/header/banner-10.jpg": {
    "type": "image/jpeg",
    "etag": "\"181b3-7jm61rAmpPR+MSomp582/s7dCvY\"",
    "mtime": "2025-11-26T22:47:34.044Z",
    "size": 98739,
    "path": "../public/header/banner-10.jpg"
  },
  "/header/banner-11.jpg": {
    "type": "image/jpeg",
    "etag": "\"e607-s3x5Ehfm1N6mBAVu5AhtV6mutKQ\"",
    "mtime": "2025-11-26T22:47:34.050Z",
    "size": 58887,
    "path": "../public/header/banner-11.jpg"
  },
  "/header/banner-12.jpg": {
    "type": "image/jpeg",
    "etag": "\"da52-nXHjxVdkO46oFrhUoMECg59+/ko\"",
    "mtime": "2025-11-26T22:47:34.052Z",
    "size": 55890,
    "path": "../public/header/banner-12.jpg"
  },
  "/header/banner-13.jpg": {
    "type": "image/jpeg",
    "etag": "\"11ce4-xnkKdw0gKFEkeu8jbrniN/HRDcQ\"",
    "mtime": "2025-11-26T22:47:34.054Z",
    "size": 72932,
    "path": "../public/header/banner-13.jpg"
  },
  "/header/banner-14.jpg": {
    "type": "image/jpeg",
    "etag": "\"145c0-mrY9RAI+dE5Xztlu20j56ZCkFGA\"",
    "mtime": "2025-11-26T22:47:34.054Z",
    "size": 83392,
    "path": "../public/header/banner-14.jpg"
  },
  "/header/banner-15.jpg": {
    "type": "image/jpeg",
    "etag": "\"11fee-YjtdjmkAf5TsReI4D4bpI4JHv7E\"",
    "mtime": "2025-11-26T22:47:34.054Z",
    "size": 73710,
    "path": "../public/header/banner-15.jpg"
  },
  "/header/banner-16.jpg": {
    "type": "image/jpeg",
    "etag": "\"11bd8-2nT3S9ZrBFkOI316PDqPLCVHDQ8\"",
    "mtime": "2025-11-26T22:47:34.054Z",
    "size": 72664,
    "path": "../public/header/banner-16.jpg"
  },
  "/header/banner-17.jpg": {
    "type": "image/jpeg",
    "etag": "\"16bc8-29FHHUe97eEmxXGmtXv6Km1PbC8\"",
    "mtime": "2025-11-26T22:47:34.054Z",
    "size": 93128,
    "path": "../public/header/banner-17.jpg"
  },
  "/header/banner-18.jpg": {
    "type": "image/jpeg",
    "etag": "\"1294b-U61UcIj3VLxPFlhTBBKxSHh0/vU\"",
    "mtime": "2025-11-26T22:47:34.054Z",
    "size": 76107,
    "path": "../public/header/banner-18.jpg"
  },
  "/header/banner-19.jpg": {
    "type": "image/jpeg",
    "etag": "\"4650-r9D3JTH5hvGRuBVAEOotD99nQhg\"",
    "mtime": "2025-11-26T22:47:34.054Z",
    "size": 18000,
    "path": "../public/header/banner-19.jpg"
  },
  "/header/banner-2.jpg": {
    "type": "image/jpeg",
    "etag": "\"e9f2-MIp7SCGMnVcyjNPeQ3BT1ZINBZo\"",
    "mtime": "2025-11-26T22:47:34.054Z",
    "size": 59890,
    "path": "../public/header/banner-2.jpg"
  },
  "/header/banner-20.jpg": {
    "type": "image/jpeg",
    "etag": "\"b9bf-VVd/ZZL1/M9GTd3fnP7bMj4r2E8\"",
    "mtime": "2025-11-26T22:47:34.054Z",
    "size": 47551,
    "path": "../public/header/banner-20.jpg"
  },
  "/header/banner-3.jpg": {
    "type": "image/jpeg",
    "etag": "\"14528-7GmBaSSb9HBI2pIxyKA7hKE/PnE\"",
    "mtime": "2025-11-26T22:47:34.054Z",
    "size": 83240,
    "path": "../public/header/banner-3.jpg"
  },
  "/header/banner-4.jpg": {
    "type": "image/jpeg",
    "etag": "\"fb4c-5JqUb5rQ9fAOJ5gcTxb3sJ/4X4I\"",
    "mtime": "2025-11-26T22:47:34.067Z",
    "size": 64332,
    "path": "../public/header/banner-4.jpg"
  },
  "/header/banner-5.jpg": {
    "type": "image/jpeg",
    "etag": "\"15545-xD+ggeDXyExPZcuMIYOfZnGyKok\"",
    "mtime": "2025-11-26T22:47:34.067Z",
    "size": 87365,
    "path": "../public/header/banner-5.jpg"
  },
  "/header/banner-6.jpg": {
    "type": "image/jpeg",
    "etag": "\"29ed-VuDIsqTj0R3aRYKSrVQ9P2sgw8Y\"",
    "mtime": "2025-11-26T22:47:34.067Z",
    "size": 10733,
    "path": "../public/header/banner-6.jpg"
  },
  "/header/banner-7.jpg": {
    "type": "image/jpeg",
    "etag": "\"e79f-C49p4QhciyZ/eKloYB10ov3Xe3E\"",
    "mtime": "2025-11-26T22:47:34.072Z",
    "size": 59295,
    "path": "../public/header/banner-7.jpg"
  },
  "/header/banner-8.jpg": {
    "type": "image/jpeg",
    "etag": "\"93c6-BeFvZPdr2BFIux4a+vSEuz4IU5M\"",
    "mtime": "2025-11-26T22:47:34.072Z",
    "size": 37830,
    "path": "../public/header/banner-8.jpg"
  },
  "/header/banner-9.jpg": {
    "type": "image/jpeg",
    "etag": "\"11c47-u1BHl7AwZ9Fkur0OAqsGI/42dSo\"",
    "mtime": "2025-11-26T22:47:34.072Z",
    "size": 72775,
    "path": "../public/header/banner-9.jpg"
  },
  "/header/banner.png": {
    "type": "image/png",
    "etag": "\"894d-8Z2QpKjpVcCy8PuKG8EosJq+Op0\"",
    "mtime": "2025-11-26T22:47:34.072Z",
    "size": 35149,
    "path": "../public/header/banner.png"
  },
  "/flag/AD.svg": {
    "type": "image/svg+xml",
    "etag": "\"d68e-80FmNYX9Y0/Kv3ySwCwOikFVCGQ\"",
    "mtime": "2025-11-29T01:30:00.516Z",
    "size": 54926,
    "path": "../public/flag/AD.svg"
  },
  "/flag/AE.svg": {
    "type": "image/svg+xml",
    "etag": "\"e4-xeVJIvgEJfh16cLuYXXNQkktfHs\"",
    "mtime": "2025-11-29T01:47:34.303Z",
    "size": 228,
    "path": "../public/flag/AE.svg"
  },
  "/flag/AF.svg": {
    "type": "image/svg+xml",
    "etag": "\"36335-FRZZQ5Kkz1rqLTbIv7/FQBSkuvU\"",
    "mtime": "2025-11-29T01:47:33.769Z",
    "size": 222005,
    "path": "../public/flag/AF.svg"
  },
  "/flag/AL.svg": {
    "type": "image/svg+xml",
    "etag": "\"24d1-wS6cGPk0IDwYHTfBrI8y2f9OIHY\"",
    "mtime": "2025-11-29T01:30:01.310Z",
    "size": 9425,
    "path": "../public/flag/AL.svg"
  },
  "/flag/AM.svg": {
    "type": "image/svg+xml",
    "etag": "\"c9-K6bBlu1ARxne5yQWIaU/yJWya6I\"",
    "mtime": "2025-11-29T01:30:02.085Z",
    "size": 201,
    "path": "../public/flag/AM.svg"
  },
  "/flag/AO.svg": {
    "type": "image/svg+xml",
    "etag": "\"8b1-xfRN1ySxNJmrQG2ld9cKd8kRM7o\"",
    "mtime": "2025-11-29T01:30:06.553Z",
    "size": 2225,
    "path": "../public/flag/AO.svg"
  },
  "/flag/AR.svg": {
    "type": "image/svg+xml",
    "etag": "\"fa3-g8xJUBMHhkRyo//vvV1trtTB8PE\"",
    "mtime": "2025-11-29T01:30:07.172Z",
    "size": 4003,
    "path": "../public/flag/AR.svg"
  },
  "/flag/AT.svg": {
    "type": "image/svg+xml",
    "etag": "\"9a-KrWq0NVTOXFNMMcjdZBV7s5bT+I\"",
    "mtime": "2025-11-29T01:30:07.860Z",
    "size": 154,
    "path": "../public/flag/AT.svg"
  },
  "/flag/AU.svg": {
    "type": "image/svg+xml",
    "etag": "\"51b-wtNts3R0HRONFTKJmKqEyHYzvME\"",
    "mtime": "2025-11-29T01:30:11.263Z",
    "size": 1307,
    "path": "../public/flag/AU.svg"
  },
  "/flag/AZ.svg": {
    "type": "image/svg+xml",
    "etag": "\"207-+d2LA2i1HPPL7oMM+1dD0pFQnFk\"",
    "mtime": "2025-11-29T01:30:11.837Z",
    "size": 519,
    "path": "../public/flag/AZ.svg"
  },
  "/flag/BA.svg": {
    "type": "image/svg+xml",
    "etag": "\"1b5-HEOiR4uXuynqEpC7Y35Y0nleNb8\"",
    "mtime": "2025-11-29T01:30:12.329Z",
    "size": 437,
    "path": "../public/flag/BA.svg"
  },
  "/flag/BB.svg": {
    "type": "image/svg+xml",
    "etag": "\"25e-fkWs1cos/NcEHGRfNmsgYl94OLk\"",
    "mtime": "2025-11-29T01:30:13.194Z",
    "size": 606,
    "path": "../public/flag/BB.svg"
  },
  "/flag/BD.svg": {
    "type": "image/svg+xml",
    "etag": "\"96-uBedlO4cU6GQCPdwuHmNnFlE0HM\"",
    "mtime": "2025-11-29T01:30:13.864Z",
    "size": 150,
    "path": "../public/flag/BD.svg"
  },
  "/flag/BE.svg": {
    "type": "image/svg+xml",
    "etag": "\"b6-5yxKOQdcSBbebRuH3OL916O+OYo\"",
    "mtime": "2025-11-29T01:30:14.353Z",
    "size": 182,
    "path": "../public/flag/BE.svg"
  },
  "/flag/BF.svg": {
    "type": "image/svg+xml",
    "etag": "\"238-W7gs/dPPu0xxjixsDdg5msxt40A\"",
    "mtime": "2025-11-29T01:30:15.080Z",
    "size": 568,
    "path": "../public/flag/BF.svg"
  },
  "/flag/BG.svg": {
    "type": "image/svg+xml",
    "etag": "\"c9-wC9IvFxlk1sRo8oU6wsuuaYtvrA\"",
    "mtime": "2025-11-29T01:30:15.762Z",
    "size": 201,
    "path": "../public/flag/BG.svg"
  },
  "/flag/BH.svg": {
    "type": "image/svg+xml",
    "etag": "\"da-7FFwGhrSuyAarcBvFl6TT0Xct0c\"",
    "mtime": "2025-11-29T01:30:16.394Z",
    "size": 218,
    "path": "../public/flag/BH.svg"
  },
  "/flag/BI.svg": {
    "type": "image/svg+xml",
    "etag": "\"279-9sZOp5t8yAqpQl/MYoka4cLy/qE\"",
    "mtime": "2025-11-29T01:30:17.040Z",
    "size": 633,
    "path": "../public/flag/BI.svg"
  },
  "/flag/BJ.svg": {
    "type": "image/svg+xml",
    "etag": "\"c5-H3b/ySfiKKJO8wvBcCYpIDdBvXM\"",
    "mtime": "2025-11-29T01:30:18.109Z",
    "size": 197,
    "path": "../public/flag/BJ.svg"
  },
  "/flag/BN.svg": {
    "type": "image/svg+xml",
    "etag": "\"51ba-W+xk5DwHwgQjrm1si7PB5OxVYmI\"",
    "mtime": "2025-11-29T01:30:18.937Z",
    "size": 20922,
    "path": "../public/flag/BN.svg"
  },
  "/flag/BO.svg": {
    "type": "image/svg+xml",
    "etag": "\"3ab01-AsR7KAlTz5DU5f6eNHbRkWVvdKQ\"",
    "mtime": "2025-11-29T01:30:19.686Z",
    "size": 240385,
    "path": "../public/flag/BO.svg"
  },
  "/flag/BR.svg": {
    "type": "image/svg+xml",
    "etag": "\"1040-w8uHJ0JXoWCHelx2DkLjL4B9LZI\"",
    "mtime": "2025-11-29T01:30:20.287Z",
    "size": 4160,
    "path": "../public/flag/BR.svg"
  },
  "/flag/BS.svg": {
    "type": "image/svg+xml",
    "etag": "\"c3-95LxFfAQVdlb7SCrfS42mddhEPo\"",
    "mtime": "2025-11-29T01:30:20.729Z",
    "size": 195,
    "path": "../public/flag/BS.svg"
  },
  "/flag/BT.svg": {
    "type": "image/svg+xml",
    "etag": "\"8fd4-vpqJPtllkJ9bi1sSjKPcCwymQKY\"",
    "mtime": "2025-11-29T01:30:21.556Z",
    "size": 36820,
    "path": "../public/flag/BT.svg"
  },
  "/flag/BW.svg": {
    "type": "image/svg+xml",
    "etag": "\"c1-3v/dJHpwdl0nUC81/ByPUdG3htg\"",
    "mtime": "2025-11-29T01:30:22.067Z",
    "size": 193,
    "path": "../public/flag/BW.svg"
  },
  "/flag/BY.svg": {
    "type": "image/svg+xml",
    "etag": "\"7a7-GdzCMRyQeOpxOf8JU86GUjAtT8E\"",
    "mtime": "2025-11-29T01:30:22.798Z",
    "size": 1959,
    "path": "../public/flag/BY.svg"
  },
  "/flag/BZ.svg": {
    "type": "image/svg+xml",
    "etag": "\"13bf3-iB7yfxrkHU2apid/twEB0bF0NBo\"",
    "mtime": "2025-11-29T01:30:23.491Z",
    "size": 80883,
    "path": "../public/flag/BZ.svg"
  },
  "/flag/CA.svg": {
    "type": "image/svg+xml",
    "etag": "\"292-6AznNE5c7MhKl+8T/AbdSZ3nFj0\"",
    "mtime": "2025-11-29T01:30:24.134Z",
    "size": 658,
    "path": "../public/flag/CA.svg"
  },
  "/flag/CD.svg": {
    "type": "image/svg+xml",
    "etag": "\"133-p9IRnKWnzWtgbUDAMmnzeLepN5M\"",
    "mtime": "2025-11-29T01:30:24.843Z",
    "size": 307,
    "path": "../public/flag/CD.svg"
  },
  "/flag/CF.svg": {
    "type": "image/svg+xml",
    "etag": "\"14b-oQp9xK1zuXnrCRN1fTnDt7OnUMY\"",
    "mtime": "2025-11-29T01:30:25.702Z",
    "size": 331,
    "path": "../public/flag/CF.svg"
  },
  "/flag/CG.svg": {
    "type": "image/svg+xml",
    "etag": "\"cb-k7Nr/B7zN7fzkfC9bayEfOHbxIY\"",
    "mtime": "2025-11-29T01:30:26.474Z",
    "size": 203,
    "path": "../public/flag/CG.svg"
  },
  "/flag/CH.svg": {
    "type": "image/svg+xml",
    "etag": "\"b7-pXPVtedmUQ0QVooTp76Cuz2yDNs\"",
    "mtime": "2025-11-29T01:30:27.226Z",
    "size": 183,
    "path": "../public/flag/CH.svg"
  },
  "/flag/CI.svg": {
    "type": "image/svg+xml",
    "etag": "\"c2-WPZ7YX/J4eZwXnUfDSUGXXLT7XQ\"",
    "mtime": "2025-11-29T01:30:28.170Z",
    "size": 194,
    "path": "../public/flag/CI.svg"
  },
  "/flag/CL.svg": {
    "type": "image/svg+xml",
    "etag": "\"250-IqQ8gB09n1aYj22ZR+WgPh/FnEs\"",
    "mtime": "2025-11-29T01:30:28.794Z",
    "size": 592,
    "path": "../public/flag/CL.svg"
  },
  "/flag/CM.svg": {
    "type": "image/svg+xml",
    "etag": "\"10a-lsumUaoD+BkRB/b88YXquTzy/zk\"",
    "mtime": "2025-11-29T01:30:29.476Z",
    "size": 266,
    "path": "../public/flag/CM.svg"
  },
  "/flag/CN.svg": {
    "type": "image/svg+xml",
    "etag": "\"218-3mmp4tcKrc0Qg1RrW3y21aiH6lc\"",
    "mtime": "2025-11-29T01:30:30.048Z",
    "size": 536,
    "path": "../public/flag/CN.svg"
  },
  "/flag/CO.svg": {
    "type": "image/svg+xml",
    "etag": "\"c9-S8tVWfBMAGGYJSxqEy7Afp4ohhA\"",
    "mtime": "2025-11-29T01:33:49.033Z",
    "size": 201,
    "path": "../public/flag/CO.svg"
  },
  "/flag/CR.svg": {
    "type": "image/svg+xml",
    "etag": "\"f6c0-XSi8V+8BVuameXuPJhuaU7t9G8w\"",
    "mtime": "2025-11-29T01:33:50.382Z",
    "size": 63168,
    "path": "../public/flag/CR.svg"
  },
  "/flag/CU.svg": {
    "type": "image/svg+xml",
    "etag": "\"11a-6Zl402+WegFLhTa3DITYB6HodHk\"",
    "mtime": "2025-11-29T01:33:50.924Z",
    "size": 282,
    "path": "../public/flag/CU.svg"
  },
  "/flag/CV.svg": {
    "type": "image/svg+xml",
    "etag": "\"5d6-fU0n4L/lYW3Cv9LxN0iMJLdCEW4\"",
    "mtime": "2025-11-29T01:33:51.850Z",
    "size": 1494,
    "path": "../public/flag/CV.svg"
  },
  "/flag/CY.svg": {
    "type": "image/svg+xml",
    "etag": "\"5873-t0tOeGpwLPCuvxdnYFbtXI4Fuqs\"",
    "mtime": "2025-11-29T01:33:53.004Z",
    "size": 22643,
    "path": "../public/flag/CY.svg"
  },
  "/flag/CZ.svg": {
    "type": "image/svg+xml",
    "etag": "\"d2-OsGGzcPnj7o0lHpk4JyVV8Jxyic\"",
    "mtime": "2025-11-29T01:33:53.590Z",
    "size": 210,
    "path": "../public/flag/CZ.svg"
  },
  "/flag/DE.svg": {
    "type": "image/svg+xml",
    "etag": "\"ba-uezCJl05fBIRH6gZrVGJKELqyKw\"",
    "mtime": "2025-11-29T01:33:54.209Z",
    "size": 186,
    "path": "../public/flag/DE.svg"
  },
  "/flag/DJ.svg": {
    "type": "image/svg+xml",
    "etag": "\"173-sexUFsxvAJQWTGs0siofxyqHy+g\"",
    "mtime": "2025-11-29T01:33:54.847Z",
    "size": 371,
    "path": "../public/flag/DJ.svg"
  },
  "/flag/DK.svg": {
    "type": "image/svg+xml",
    "etag": "\"a5-i+zcQSyryqIKBSU0KU+7rjGsXro\"",
    "mtime": "2025-11-29T01:33:55.372Z",
    "size": 165,
    "path": "../public/flag/DK.svg"
  },
  "/flag/DO.svg": {
    "type": "image/svg+xml",
    "etag": "\"24321-SCSA5y2DZBbzQegy0zE+BZS3W8s\"",
    "mtime": "2025-11-29T01:33:56.757Z",
    "size": 148257,
    "path": "../public/flag/DO.svg"
  },
  "/flag/DZ.svg": {
    "type": "image/svg+xml",
    "etag": "\"11d-sAEAkRVE83d5+IX+CU3+FC+PM24\"",
    "mtime": "2025-11-29T01:33:57.268Z",
    "size": 285,
    "path": "../public/flag/DZ.svg"
  },
  "/flag/EC.svg": {
    "type": "image/svg+xml",
    "etag": "\"34f9c-RkGFMYYjTrlnwcrWe19OujYyaoY\"",
    "mtime": "2025-11-29T01:33:58.662Z",
    "size": 216988,
    "path": "../public/flag/EC.svg"
  },
  "/flag/EE.svg": {
    "type": "image/svg+xml",
    "etag": "\"b7-VbeFuXBugDrv1X55FE15abfPNV0\"",
    "mtime": "2025-11-29T01:33:59.160Z",
    "size": 183,
    "path": "../public/flag/EE.svg"
  },
  "/flag/EG.svg": {
    "type": "image/svg+xml",
    "etag": "\"47af-h0ZAR03RbgKcCoBDbSl1/bM+M/c\"",
    "mtime": "2025-11-29T01:34:00.132Z",
    "size": 18351,
    "path": "../public/flag/EG.svg"
  },
  "/flag/ER.svg": {
    "type": "image/svg+xml",
    "etag": "\"cb3-3XCqlUGZq8f4poblMqlLDNFFj/4\"",
    "mtime": "2025-11-29T01:34:00.790Z",
    "size": 3251,
    "path": "../public/flag/ER.svg"
  },
  "/flag/ES.svg": {
    "type": "image/svg+xml",
    "etag": "\"255cb-Ku4mW/YdqD/k+f9JO9l17+atoA4\"",
    "mtime": "2025-11-29T01:34:01.820Z",
    "size": 153035,
    "path": "../public/flag/ES.svg"
  },
  "/flag/ET.svg": {
    "type": "image/svg+xml",
    "etag": "\"329-aO7BCk47KUApK8i4ZBmpjI6pmAw\"",
    "mtime": "2025-11-29T01:34:02.864Z",
    "size": 809,
    "path": "../public/flag/ET.svg"
  },
  "/flag/FI.svg": {
    "type": "image/svg+xml",
    "etag": "\"c2-AgWvW4N9IBlH6x8OnrVYZPj14bM\"",
    "mtime": "2025-11-29T01:34:03.660Z",
    "size": 194,
    "path": "../public/flag/FI.svg"
  },
  "/flag/FJ.svg": {
    "type": "image/svg+xml",
    "etag": "\"9cb9-i4TidIcXvknTCqcRhBm80vi7/2w\"",
    "mtime": "2025-11-29T01:34:04.727Z",
    "size": 40121,
    "path": "../public/flag/FJ.svg"
  },
  "/flag/FR.svg": {
    "type": "image/svg+xml",
    "etag": "\"bf-GwA1Qo0QKCKK9D8y7bzONE3wXc0\"",
    "mtime": "2025-11-29T01:34:05.507Z",
    "size": 191,
    "path": "../public/flag/FR.svg"
  },
  "/flag/GA.svg": {
    "type": "image/svg+xml",
    "etag": "\"c9-wvKkX/iFlGpRBNZ3wFtLajp5CdM\"",
    "mtime": "2025-11-29T01:34:06.119Z",
    "size": 201,
    "path": "../public/flag/GA.svg"
  },
  "/flag/GB.svg": {
    "type": "image/svg+xml",
    "etag": "\"229-5sL/lIeQ5dmq/TUw5JFxYoJIzw8\"",
    "mtime": "2025-11-29T01:34:06.915Z",
    "size": 553,
    "path": "../public/flag/GB.svg"
  },
  "/flag/GE.svg": {
    "type": "image/svg+xml",
    "etag": "\"1e1-6gkL0UY491hjMI62Vfutlm4UhCU\"",
    "mtime": "2025-11-29T01:34:07.626Z",
    "size": 481,
    "path": "../public/flag/GE.svg"
  },
  "/flag/GH.svg": {
    "type": "image/svg+xml",
    "etag": "\"ff-uev7ewievZds4R3/s7Giv68uos0\"",
    "mtime": "2025-11-29T01:34:08.251Z",
    "size": 255,
    "path": "../public/flag/GH.svg"
  },
  "/flag/GM.svg": {
    "type": "image/svg+xml",
    "etag": "\"f6-vHwAAxygyoRjWA4zMDMudYnsSwE\"",
    "mtime": "2025-11-29T01:34:08.960Z",
    "size": 246,
    "path": "../public/flag/GM.svg"
  },
  "/flag/GN.svg": {
    "type": "image/svg+xml",
    "etag": "\"cd-+HUkX//cT1HJVJdkVQk7l+K1PnI\"",
    "mtime": "2025-11-29T01:34:09.511Z",
    "size": 205,
    "path": "../public/flag/GN.svg"
  },
  "/flag/GQ.svg": {
    "type": "image/svg+xml",
    "etag": "\"161a-l0D3nkA+x93TWnyOa8EQBSsGK8E\"",
    "mtime": "2025-11-29T01:34:10.394Z",
    "size": 5658,
    "path": "../public/flag/GQ.svg"
  },
  "/flag/GR.svg": {
    "type": "image/svg+xml",
    "etag": "\"e7-uT/k3zEdlirduom6n/FkjKc3Enc\"",
    "mtime": "2025-11-29T01:34:11.739Z",
    "size": 231,
    "path": "../public/flag/GR.svg"
  },
  "/flag/GT.svg": {
    "type": "image/svg+xml",
    "etag": "\"d8eb-1E8NERG/McbWaIKQ9mfClrEzpk8\"",
    "mtime": "2025-11-29T01:34:12.842Z",
    "size": 55531,
    "path": "../public/flag/GT.svg"
  },
  "/flag/GW.svg": {
    "type": "image/svg+xml",
    "etag": "\"247-bqFK0+LGpeL3bN9An5dYP0qn1+E\"",
    "mtime": "2025-11-29T01:34:13.491Z",
    "size": 583,
    "path": "../public/flag/GW.svg"
  },
  "/flag/GY.svg": {
    "type": "image/svg+xml",
    "etag": "\"1bf-un6tKHi5GzNg+3TZn1z0VGI16vI\"",
    "mtime": "2025-11-29T01:34:14.125Z",
    "size": 447,
    "path": "../public/flag/GY.svg"
  },
  "/flag/HK.svg": {
    "type": "image/svg+xml",
    "etag": "\"2b1-c9ckUMj1YqGAfa/ukZhf+xHWhzo\"",
    "mtime": "2025-11-29T01:34:14.676Z",
    "size": 689,
    "path": "../public/flag/HK.svg"
  },
  "/flag/HN.svg": {
    "type": "image/svg+xml",
    "etag": "\"191-YRuWv1M06XXdDuqXztCaZ4C5RSU\"",
    "mtime": "2025-11-29T01:34:15.487Z",
    "size": 401,
    "path": "../public/flag/HN.svg"
  },
  "/flag/HR.svg": {
    "type": "image/svg+xml",
    "etag": "\"13e43-voQPWxdczZ5ZctzVz1gPJjtCm2w\"",
    "mtime": "2025-11-29T01:34:16.700Z",
    "size": 81475,
    "path": "../public/flag/HR.svg"
  },
  "/flag/HT.svg": {
    "type": "image/svg+xml",
    "etag": "\"18b8d-0QS0iOqhcBFk1d7A+I1q0vYPLcw\"",
    "mtime": "2025-11-29T01:34:17.552Z",
    "size": 101261,
    "path": "../public/flag/HT.svg"
  },
  "/flag/HU.svg": {
    "type": "image/svg+xml",
    "etag": "\"c3-PD7cEi1ijSzp0eslxMTxRzRKiAY\"",
    "mtime": "2025-11-29T01:34:18.343Z",
    "size": 195,
    "path": "../public/flag/HU.svg"
  },
  "/flag/ID.svg": {
    "type": "image/svg+xml",
    "etag": "\"94-fb7kszcfQadLj6pI47jcbjIc0+Y\"",
    "mtime": "2025-11-29T01:34:18.957Z",
    "size": 148,
    "path": "../public/flag/ID.svg"
  },
  "/flag/IE.svg": {
    "type": "image/svg+xml",
    "etag": "\"cc-rVrrHBZA7q5p4dNgEgSMPmjHu1o\"",
    "mtime": "2025-11-29T01:41:49.433Z",
    "size": 204,
    "path": "../public/flag/IE.svg"
  },
  "/flag/IN.svg": {
    "type": "image/svg+xml",
    "etag": "\"2d0-dO9F6hJiHC5ILTrb+GefT6RRNWI\"",
    "mtime": "2025-11-29T01:41:50.226Z",
    "size": 720,
    "path": "../public/flag/IN.svg"
  },
  "/flag/IQ.svg": {
    "type": "image/svg+xml",
    "etag": "\"48d-OfmSmZgBmm5wPSptJIN4v6QsQB4\"",
    "mtime": "2025-11-29T01:41:50.923Z",
    "size": 1165,
    "path": "../public/flag/IQ.svg"
  },
  "/flag/IR.svg": {
    "type": "image/svg+xml",
    "etag": "\"512-HqY6LUfVJQK962AjqDE0dRXAw3Y\"",
    "mtime": "2025-11-29T01:41:51.518Z",
    "size": 1298,
    "path": "../public/flag/IR.svg"
  },
  "/flag/IS.svg": {
    "type": "image/svg+xml",
    "etag": "\"f9-X43BuGcecHHUbhjGjjE3S5+zQ4I\"",
    "mtime": "2025-11-29T01:41:52.095Z",
    "size": 249,
    "path": "../public/flag/IS.svg"
  },
  "/flag/IT.svg": {
    "type": "image/svg+xml",
    "etag": "\"ca-B7Ny6meWUqDB0Lj3fu2TrLdctRI\"",
    "mtime": "2025-11-29T01:41:52.710Z",
    "size": 202,
    "path": "../public/flag/IT.svg"
  },
  "/flag/JM.svg": {
    "type": "image/svg+xml",
    "etag": "\"103-9GJKB8Aw6spSI7WuUulYFJqooiA\"",
    "mtime": "2025-11-29T01:41:53.781Z",
    "size": 259,
    "path": "../public/flag/JM.svg"
  },
  "/flag/JO.svg": {
    "type": "image/svg+xml",
    "etag": "\"173-giRuKhKFedpDrCc7u6pYvukGsCs\"",
    "mtime": "2025-11-29T01:41:54.353Z",
    "size": 371,
    "path": "../public/flag/JO.svg"
  },
  "/flag/JP.svg": {
    "type": "image/svg+xml",
    "etag": "\"a0-pFsXkzcuemtl+Cy2flX80dZ6l0U\"",
    "mtime": "2025-11-29T01:41:54.869Z",
    "size": 160,
    "path": "../public/flag/JP.svg"
  },
  "/flag/KE.svg": {
    "type": "image/svg+xml",
    "etag": "\"3e9-NfbhSOl4UcrM6nyjFvDa+Fo8jRo\"",
    "mtime": "2025-11-29T01:41:55.379Z",
    "size": 1001,
    "path": "../public/flag/KE.svg"
  },
  "/flag/KG.svg": {
    "type": "image/svg+xml",
    "etag": "\"1f99-POVQEQFOS4CLUCYrRRMfYVw7QbM\"",
    "mtime": "2025-11-29T01:41:56.073Z",
    "size": 8089,
    "path": "../public/flag/KG.svg"
  },
  "/flag/KH.svg": {
    "type": "image/svg+xml",
    "etag": "\"2740-H80PeyGCILbsgxUpfjZuvU0PcJM\"",
    "mtime": "2025-11-29T01:41:57.227Z",
    "size": 10048,
    "path": "../public/flag/KH.svg"
  },
  "/flag/KM.svg": {
    "type": "image/svg+xml",
    "etag": "\"22e-ZukMEziZU20PJhoFYuPVuS+mwoc\"",
    "mtime": "2025-11-29T01:41:58.011Z",
    "size": 558,
    "path": "../public/flag/KM.svg"
  },
  "/flag/KP.svg": {
    "type": "image/svg+xml",
    "etag": "\"14e-HqSsz6U8nMxR2QFSMHTp7xkCiak\"",
    "mtime": "2025-11-29T01:41:58.896Z",
    "size": 334,
    "path": "../public/flag/KP.svg"
  },
  "/flag/KR.svg": {
    "type": "image/svg+xml",
    "etag": "\"331-53CPAzpN2pQdHXOiHQ0svcsQwb8\"",
    "mtime": "2025-11-29T01:41:59.512Z",
    "size": 817,
    "path": "../public/flag/KR.svg"
  },
  "/flag/KW.svg": {
    "type": "image/svg+xml",
    "etag": "\"e8-Mlj98PdxZYVlj4pcVmONAjr2hIQ\"",
    "mtime": "2025-11-29T01:42:00.370Z",
    "size": 232,
    "path": "../public/flag/KW.svg"
  },
  "/flag/KZ.svg": {
    "type": "image/svg+xml",
    "etag": "\"25a4-JIQqhxYz1tTy0kTl7Hg0kEiq02o\"",
    "mtime": "2025-11-29T01:42:01.207Z",
    "size": 9636,
    "path": "../public/flag/KZ.svg"
  },
  "/flag/LA.svg": {
    "type": "image/svg+xml",
    "etag": "\"e9-TlifmOPhpProSG9lfhz5ei7EsuE\"",
    "mtime": "2025-11-29T01:42:01.961Z",
    "size": 233,
    "path": "../public/flag/LA.svg"
  },
  "/flag/LB.svg": {
    "type": "image/svg+xml",
    "etag": "\"3830-ZJtjsuoHJRwaNrbszjaKPC0hCKQ\"",
    "mtime": "2025-11-29T01:42:02.947Z",
    "size": 14384,
    "path": "../public/flag/LB.svg"
  },
  "/flag/LI.svg": {
    "type": "image/svg+xml",
    "etag": "\"3078-bUdoa4BX/5oov/ZsBakSGyOmhDY\"",
    "mtime": "2025-11-29T01:42:03.621Z",
    "size": 12408,
    "path": "../public/flag/LI.svg"
  },
  "/flag/LK.svg": {
    "type": "image/svg+xml",
    "etag": "\"4b28-eFA2ipaqEVJnTOsGemUk+Y1muJA\"",
    "mtime": "2025-11-29T01:42:04.438Z",
    "size": 19240,
    "path": "../public/flag/LK.svg"
  },
  "/flag/LR.svg": {
    "type": "image/svg+xml",
    "etag": "\"2a3-8nTI7eMH1xWRClhDAvB4AZxkWkY\"",
    "mtime": "2025-11-29T01:42:05.038Z",
    "size": 675,
    "path": "../public/flag/LR.svg"
  },
  "/flag/LS.svg": {
    "type": "image/svg+xml",
    "etag": "\"5a2-zeOSWiIA8oSd99cU5i0UAdirrsw\"",
    "mtime": "2025-11-29T01:42:05.746Z",
    "size": 1442,
    "path": "../public/flag/LS.svg"
  },
  "/flag/LT.svg": {
    "type": "image/svg+xml",
    "etag": "\"c9-uGLB79eqMWaQPxBUk1QbfmDx56U\"",
    "mtime": "2025-11-29T01:42:06.506Z",
    "size": 201,
    "path": "../public/flag/LT.svg"
  },
  "/flag/LU.svg": {
    "type": "image/svg+xml",
    "etag": "\"ca-xWQKNi5c1SYs4k6dq6IIU/viE1g\"",
    "mtime": "2025-11-29T01:42:07.227Z",
    "size": 202,
    "path": "../public/flag/LU.svg"
  },
  "/flag/LV.svg": {
    "type": "image/svg+xml",
    "etag": "\"9b-lznAYK+iU3A+3edON9DTXS6eak8\"",
    "mtime": "2025-11-29T01:42:07.998Z",
    "size": 155,
    "path": "../public/flag/LV.svg"
  },
  "/flag/LY.svg": {
    "type": "image/svg+xml",
    "etag": "\"161-HeiGAfOzuH1PO22J3N4Wb77qzm4\"",
    "mtime": "2025-11-29T01:42:08.540Z",
    "size": 353,
    "path": "../public/flag/LY.svg"
  },
  "/flag/MA.svg": {
    "type": "image/svg+xml",
    "etag": "\"102-n+j1ka8ExW2zcveNZjEX7RaGuI8\"",
    "mtime": "2025-11-29T01:42:09.130Z",
    "size": 258,
    "path": "../public/flag/MA.svg"
  },
  "/flag/MC.svg": {
    "type": "image/svg+xml",
    "etag": "\"9b-A25kpWgxR7kiXAgw5lrc2wYuu/c\"",
    "mtime": "2025-11-29T01:42:09.798Z",
    "size": 155,
    "path": "../public/flag/MC.svg"
  },
  "/flag/MD.svg": {
    "type": "image/svg+xml",
    "etag": "\"84b7-xYI0DoFu7lLm8S05Krc28pKDp9I\"",
    "mtime": "2025-11-29T01:42:10.563Z",
    "size": 33975,
    "path": "../public/flag/MD.svg"
  },
  "/flag/ME.svg": {
    "type": "image/svg+xml",
    "etag": "\"1a737-9vUzlZt5JC7yEUZ1hJ5wgNwy1po\"",
    "mtime": "2025-11-29T01:42:12.125Z",
    "size": 108343,
    "path": "../public/flag/ME.svg"
  },
  "/flag/MG.svg": {
    "type": "image/svg+xml",
    "etag": "\"c2-TfHVWev1nTro4j/6rSY7vRatEw8\"",
    "mtime": "2025-11-29T01:42:12.686Z",
    "size": 194,
    "path": "../public/flag/MG.svg"
  },
  "/flag/MK.svg": {
    "type": "image/svg+xml",
    "etag": "\"16e-H9lyDPRPImrAIoiwj3BplwAHcuU\"",
    "mtime": "2025-11-29T01:42:13.232Z",
    "size": 366,
    "path": "../public/flag/MK.svg"
  },
  "/flag/ML.svg": {
    "type": "image/svg+xml",
    "etag": "\"c5-5o1Ys4D1GbiSrLGR/Yn0BZd/CHs\"",
    "mtime": "2025-11-29T01:42:13.773Z",
    "size": 197,
    "path": "../public/flag/ML.svg"
  },
  "/flag/MM.svg": {
    "type": "image/svg+xml",
    "etag": "\"21b-9qi2YqfrPelGnvTYGy2RUPbq9nM\"",
    "mtime": "2025-11-29T01:42:14.336Z",
    "size": 539,
    "path": "../public/flag/MM.svg"
  },
  "/flag/MN.svg": {
    "type": "image/svg+xml",
    "etag": "\"5d8-IEw3CrR/otsnOR6R3OtQXcTl3Zo\"",
    "mtime": "2025-11-29T01:42:14.850Z",
    "size": 1496,
    "path": "../public/flag/MN.svg"
  },
  "/flag/MO.svg": {
    "type": "image/svg+xml",
    "etag": "\"8d9-Kx3hgxgU8lDotbwvJ5Pz4aJCT/4\"",
    "mtime": "2025-11-29T01:45:58.857Z",
    "size": 2265,
    "path": "../public/flag/MO.svg"
  },
  "/flag/MR.svg": {
    "type": "image/svg+xml",
    "etag": "\"14d-CgldfOauYc/AZKk19mSNa9hnV6c\"",
    "mtime": "2025-11-29T01:45:59.464Z",
    "size": 333,
    "path": "../public/flag/MR.svg"
  },
  "/flag/MT.svg": {
    "type": "image/svg+xml",
    "etag": "\"3bb4-ZuCLVZRbScgc3xaYgG0CxzrIuH4\"",
    "mtime": "2025-11-29T01:46:00.033Z",
    "size": 15284,
    "path": "../public/flag/MT.svg"
  },
  "/flag/MU.svg": {
    "type": "image/svg+xml",
    "etag": "\"ef-kp2H0h/XL+6lg3mRM1poX9dVh/s\"",
    "mtime": "2025-11-29T01:46:01.063Z",
    "size": 239,
    "path": "../public/flag/MU.svg"
  },
  "/flag/MV.svg": {
    "type": "image/svg+xml",
    "etag": "\"f7-INFRfVN8gVSu3LgyagdzvQWTxWs\"",
    "mtime": "2025-11-29T01:46:01.824Z",
    "size": 247,
    "path": "../public/flag/MV.svg"
  },
  "/flag/MW.svg": {
    "type": "image/svg+xml",
    "etag": "\"313-2HcWIwLMEQdBvaEXpPthMFxh8Kg\"",
    "mtime": "2025-11-29T01:46:02.437Z",
    "size": 787,
    "path": "../public/flag/MW.svg"
  },
  "/flag/MX.svg": {
    "type": "image/svg+xml",
    "etag": "\"22fd6-yQIyQhoMCj0J0wQTaaWOnEezMjo\"",
    "mtime": "2025-11-29T01:46:05.320Z",
    "size": 143318,
    "path": "../public/flag/MX.svg"
  },
  "/flag/MY.svg": {
    "type": "image/svg+xml",
    "etag": "\"296-s4aL+H71CiVEp6jmktOdmxbfbDQ\"",
    "mtime": "2025-11-29T01:46:05.983Z",
    "size": 662,
    "path": "../public/flag/MY.svg"
  },
  "/flag/MZ.svg": {
    "type": "image/svg+xml",
    "etag": "\"ac5-n/pfQ98i2kC7WSppAoRP4aEMYEg\"",
    "mtime": "2025-11-29T01:46:06.582Z",
    "size": 2757,
    "path": "../public/flag/MZ.svg"
  },
  "/flag/NA.svg": {
    "type": "image/svg+xml",
    "etag": "\"2d8-gzWclSQinzMI0Yy7d1APBJ4Q9mM\"",
    "mtime": "2025-11-29T01:46:07.937Z",
    "size": 728,
    "path": "../public/flag/NA.svg"
  },
  "/flag/NE.svg": {
    "type": "image/svg+xml",
    "etag": "\"f3-qXHBVyZzVyVHpKP+p0e1zW95OM8\"",
    "mtime": "2025-11-29T01:46:08.652Z",
    "size": 243,
    "path": "../public/flag/NE.svg"
  },
  "/flag/NG.svg": {
    "type": "image/svg+xml",
    "etag": "\"a3-xJgkT4+Y3m6QNLnrjWzzYwG1Q6A\"",
    "mtime": "2025-11-29T01:46:09.164Z",
    "size": 163,
    "path": "../public/flag/NG.svg"
  },
  "/flag/NI.svg": {
    "type": "image/svg+xml",
    "etag": "\"5d56-s7M8Muqf+cFdccG4/8AHY8GH3vM\"",
    "mtime": "2025-11-29T01:46:09.956Z",
    "size": 23894,
    "path": "../public/flag/NI.svg"
  },
  "/flag/NL.svg": {
    "type": "image/svg+xml",
    "etag": "\"c8-C1WK77wdM8zpxgqDkqurkaL13i0\"",
    "mtime": "2025-11-29T01:46:10.612Z",
    "size": 200,
    "path": "../public/flag/NL.svg"
  },
  "/flag/NO.svg": {
    "type": "image/svg+xml",
    "etag": "\"df-VMhRT+bDNAbFski8BgNl6RVwaAM\"",
    "mtime": "2025-11-29T01:46:11.662Z",
    "size": 223,
    "path": "../public/flag/NO.svg"
  },
  "/flag/NP.svg": {
    "type": "image/svg+xml",
    "etag": "\"41c-E4CZG6jJ8xM7Soe66oFVZSyIMyo\"",
    "mtime": "2025-11-29T01:46:12.224Z",
    "size": 1052,
    "path": "../public/flag/NP.svg"
  },
  "/flag/NZ.svg": {
    "type": "image/svg+xml",
    "etag": "\"6d2-iREGekQRPI5RpJlgkYc69OiZv+w\"",
    "mtime": "2025-11-29T01:46:12.827Z",
    "size": 1746,
    "path": "../public/flag/NZ.svg"
  },
  "/flag/OM.svg": {
    "type": "image/svg+xml",
    "etag": "\"2af10-XTPT0UZwXWdT9Tz3qYQMux9cejQ\"",
    "mtime": "2025-11-29T01:46:14.496Z",
    "size": 175888,
    "path": "../public/flag/OM.svg"
  },
  "/flag/PA.svg": {
    "type": "image/svg+xml",
    "etag": "\"118-qElescufDQ7S1Rt4G35NYaHR8jA\"",
    "mtime": "2025-11-29T01:46:15.056Z",
    "size": 280,
    "path": "../public/flag/PA.svg"
  },
  "/flag/PE.svg": {
    "type": "image/svg+xml",
    "etag": "\"9c-l5SeQIFvH0Yekwn8aHX3BlDqrB0\"",
    "mtime": "2025-11-29T01:46:15.555Z",
    "size": 156,
    "path": "../public/flag/PE.svg"
  },
  "/flag/PG.svg": {
    "type": "image/svg+xml",
    "etag": "\"b99-jHzVXpNN9bbuKdiBicVhRhD+c8o\"",
    "mtime": "2025-11-29T01:46:16.343Z",
    "size": 2969,
    "path": "../public/flag/PG.svg"
  },
  "/flag/PH.svg": {
    "type": "image/svg+xml",
    "etag": "\"328-+eSmJTuCI9me+2mqLG7IP3b+Uv4\"",
    "mtime": "2025-11-29T01:46:17.523Z",
    "size": 808,
    "path": "../public/flag/PH.svg"
  },
  "/flag/PK.svg": {
    "type": "image/svg+xml",
    "etag": "\"17c-qa+nhoDo/TeqT7yV9+IA2uEjuEY\"",
    "mtime": "2025-11-29T01:46:18.204Z",
    "size": 380,
    "path": "../public/flag/PK.svg"
  },
  "/flag/PL.svg": {
    "type": "image/svg+xml",
    "etag": "\"a4-sW8E0FKJkbRly3cnwGoIdxD7whA\"",
    "mtime": "2025-11-29T01:46:18.972Z",
    "size": 164,
    "path": "../public/flag/PL.svg"
  },
  "/flag/PR.svg": {
    "type": "image/svg+xml",
    "etag": "\"10b-+GRzEWzFEztGy506ddpA3TPR1lA\"",
    "mtime": "2025-11-29T01:46:19.504Z",
    "size": 267,
    "path": "../public/flag/PR.svg"
  },
  "/flag/PS.svg": {
    "type": "image/svg+xml",
    "etag": "\"e4-9vtF2Z1oBg/Un4DdZK9ZFFfDkv0\"",
    "mtime": "2025-11-29T01:46:20.169Z",
    "size": 228,
    "path": "../public/flag/PS.svg"
  },
  "/flag/PT.svg": {
    "type": "image/svg+xml",
    "etag": "\"2a65-Q2Dh6hxk9u/y3bplCuQbS5flxwY\"",
    "mtime": "2025-11-29T01:46:20.916Z",
    "size": 10853,
    "path": "../public/flag/PT.svg"
  },
  "/flag/PY.svg": {
    "type": "image/svg+xml",
    "etag": "\"5bcc-08gWi4tzUzLKbsdjAN8aXjh/JdE\"",
    "mtime": "2025-11-29T01:46:22.000Z",
    "size": 23500,
    "path": "../public/flag/PY.svg"
  },
  "/flag/QA.svg": {
    "type": "image/svg+xml",
    "etag": "\"108-9C3hHKIKRx62o4Vgvjg1c+mLzOI\"",
    "mtime": "2025-11-29T01:46:23.003Z",
    "size": 264,
    "path": "../public/flag/QA.svg"
  },
  "/flag/RO.svg": {
    "type": "image/svg+xml",
    "etag": "\"cb-9I60fgmAj+pm54ykqSwi8myovbc\"",
    "mtime": "2025-11-29T01:46:23.562Z",
    "size": 203,
    "path": "../public/flag/RO.svg"
  },
  "/flag/RS.svg": {
    "type": "image/svg+xml",
    "etag": "\"70bb-5G36XsOTXQQPnxehLvHLpTrHCbc\"",
    "mtime": "2025-11-29T01:46:24.582Z",
    "size": 28859,
    "path": "../public/flag/RS.svg"
  },
  "/flag/RU.svg": {
    "type": "image/svg+xml",
    "etag": "\"c8-gtWvZ9X6I+/RJNiiSUH3zGFZB9Q\"",
    "mtime": "2025-11-29T01:46:24.995Z",
    "size": 200,
    "path": "../public/flag/RU.svg"
  },
  "/flag/RW.svg": {
    "type": "image/svg+xml",
    "etag": "\"37e-swbDpnj/pEMT9Hos6NS+CCL++EM\"",
    "mtime": "2025-11-29T01:46:25.819Z",
    "size": 894,
    "path": "../public/flag/RW.svg"
  },
  "/flag/SA.svg": {
    "type": "image/svg+xml",
    "etag": "\"6025-OVh54G06LK2Y9N9GDp+PQzWPy/U\"",
    "mtime": "2025-11-29T01:46:26.949Z",
    "size": 24613,
    "path": "../public/flag/SA.svg"
  },
  "/flag/SC.svg": {
    "type": "image/svg+xml",
    "etag": "\"111-I1mWkLSWxUHJZPxL+JgF5CeDvcE\"",
    "mtime": "2025-11-29T01:46:59.856Z",
    "size": 273,
    "path": "../public/flag/SC.svg"
  },
  "/flag/SD.svg": {
    "type": "image/svg+xml",
    "etag": "\"e5-EQx1RiNmC2CbWpmdzJLNiIXAP+k\"",
    "mtime": "2025-11-29T01:47:00.506Z",
    "size": 229,
    "path": "../public/flag/SD.svg"
  },
  "/flag/SE.svg": {
    "type": "image/svg+xml",
    "etag": "\"ac-3vXP0VrkyNCHu+EKMm+0oihxDOY\"",
    "mtime": "2025-11-29T01:47:01.100Z",
    "size": 172,
    "path": "../public/flag/SE.svg"
  },
  "/flag/SG.svg": {
    "type": "image/svg+xml",
    "etag": "\"226-UjNmJsikY9xn5ecdsvhEe8mmuVw\"",
    "mtime": "2025-11-29T01:47:01.613Z",
    "size": 550,
    "path": "../public/flag/SG.svg"
  },
  "/flag/SI.svg": {
    "type": "image/svg+xml",
    "etag": "\"529-ZTQ8mACsJib78cPeqhJhanOc2HY\"",
    "mtime": "2025-11-29T01:47:02.138Z",
    "size": 1321,
    "path": "../public/flag/SI.svg"
  },
  "/flag/SK.svg": {
    "type": "image/svg+xml",
    "etag": "\"402-BUcMuPHp69r5wvWEaP9CPZ/rifA\"",
    "mtime": "2025-11-29T01:47:02.806Z",
    "size": 1026,
    "path": "../public/flag/SK.svg"
  },
  "/flag/SL.svg": {
    "type": "image/svg+xml",
    "etag": "\"c2-a7E4CA6agsjMHLh8w/YykKN+HL4\"",
    "mtime": "2025-11-29T01:47:03.400Z",
    "size": 194,
    "path": "../public/flag/SL.svg"
  },
  "/flag/SM.svg": {
    "type": "image/svg+xml",
    "etag": "\"17505-S1b2UAu8zOeyicveZtJ3yI+Wxm4\"",
    "mtime": "2025-11-29T01:47:06.123Z",
    "size": 95493,
    "path": "../public/flag/SM.svg"
  },
  "/flag/SN.svg": {
    "type": "image/svg+xml",
    "etag": "\"e4-YZ4qybES9gG1uBB9SXMr44LIPqc\"",
    "mtime": "2025-11-29T01:47:06.740Z",
    "size": 228,
    "path": "../public/flag/SN.svg"
  },
  "/flag/SO.svg": {
    "type": "image/svg+xml",
    "etag": "\"112-4ALe/36bLzgqPA1E0xdNbyg9fNM\"",
    "mtime": "2025-11-29T01:47:07.370Z",
    "size": 274,
    "path": "../public/flag/SO.svg"
  },
  "/flag/SR.svg": {
    "type": "image/svg+xml",
    "etag": "\"133-R3OXZT0pl/Wd+CdjPeyAMjueOes\"",
    "mtime": "2025-11-29T01:47:07.983Z",
    "size": 307,
    "path": "../public/flag/SR.svg"
  },
  "/flag/SS.svg": {
    "type": "image/svg+xml",
    "etag": "\"181-lzKYafQVDMIEjViCKVMUpgxJAHE\"",
    "mtime": "2025-11-29T01:47:08.516Z",
    "size": 385,
    "path": "../public/flag/SS.svg"
  },
  "/flag/ST.svg": {
    "type": "image/svg+xml",
    "etag": "\"163-aU2tktoVGhwue63tZenLTI60AeY\"",
    "mtime": "2025-11-29T01:47:09.087Z",
    "size": 355,
    "path": "../public/flag/ST.svg"
  },
  "/flag/SV.svg": {
    "type": "image/svg+xml",
    "etag": "\"3cc69-QcYfRibXjuYdDTB46E/PLFxN87c\"",
    "mtime": "2025-11-29T01:47:10.677Z",
    "size": 248937,
    "path": "../public/flag/SV.svg"
  },
  "/flag/SY.svg": {
    "type": "image/svg+xml",
    "etag": "\"16f-5vnMA01VpAEJlLTib/xreI75Hw0\"",
    "mtime": "2025-11-29T01:47:11.273Z",
    "size": 367,
    "path": "../public/flag/SY.svg"
  },
  "/flag/SZ.svg": {
    "type": "image/svg+xml",
    "etag": "\"1948-NbC2Iy4I3mTSEDZBKf0dwcZCgEs\"",
    "mtime": "2025-11-29T01:47:11.985Z",
    "size": 6472,
    "path": "../public/flag/SZ.svg"
  },
  "/flag/TD.svg": {
    "type": "image/svg+xml",
    "etag": "\"c5-IoqBzprbGNpaHUQ+teOXmhagE/I\"",
    "mtime": "2025-11-29T01:47:13.111Z",
    "size": 197,
    "path": "../public/flag/TD.svg"
  },
  "/flag/TG.svg": {
    "type": "image/svg+xml",
    "etag": "\"1a7-D7zPv6/kg8nN6BvCQonVrbMgD7E\"",
    "mtime": "2025-11-29T01:47:13.956Z",
    "size": 423,
    "path": "../public/flag/TG.svg"
  },
  "/flag/TH.svg": {
    "type": "image/svg+xml",
    "etag": "\"c9-QSNnBUe4YtbW5Z0HJPFF58aW6G0\"",
    "mtime": "2025-11-29T01:47:14.616Z",
    "size": 201,
    "path": "../public/flag/TH.svg"
  },
  "/flag/TJ.svg": {
    "type": "image/svg+xml",
    "etag": "\"8a9-hqZ0oPbaONv0iXyeJ/VZK7L9pWw\"",
    "mtime": "2025-11-29T01:47:15.290Z",
    "size": 2217,
    "path": "../public/flag/TJ.svg"
  },
  "/flag/TL.svg": {
    "type": "image/svg+xml",
    "etag": "\"117-0ROCCltzeNQnkypKbUdH1TBvQJw\"",
    "mtime": "2025-11-29T01:47:15.813Z",
    "size": 279,
    "path": "../public/flag/TL.svg"
  },
  "/flag/TM.svg": {
    "type": "image/svg+xml",
    "etag": "\"a9c1-KMkoz8HnROpUA1LrjC6OUDxfV+I\"",
    "mtime": "2025-11-29T01:47:16.470Z",
    "size": 43457,
    "path": "../public/flag/TM.svg"
  },
  "/flag/TN.svg": {
    "type": "image/svg+xml",
    "etag": "\"116-MwZKs3QGSY5kMLnX3p9gWX+JAnU\"",
    "mtime": "2025-11-29T01:47:17.054Z",
    "size": 278,
    "path": "../public/flag/TN.svg"
  },
  "/flag/TO.svg": {
    "type": "image/svg+xml",
    "etag": "\"e3-5NXSsEhxjpMpUvON6DLuIUDkPBA\"",
    "mtime": "2025-11-29T01:47:17.793Z",
    "size": 227,
    "path": "../public/flag/TO.svg"
  },
  "/flag/TR.svg": {
    "type": "image/svg+xml",
    "etag": "\"11f-Y/A/d/kYCDBUs4+Qx3GydwqMFwA\"",
    "mtime": "2025-11-29T01:47:18.301Z",
    "size": 287,
    "path": "../public/flag/TR.svg"
  },
  "/flag/TT.svg": {
    "type": "image/svg+xml",
    "etag": "\"e1-ffJNOBlBfYsuDmKCcxcFHO0UXsM\"",
    "mtime": "2025-11-29T01:47:18.980Z",
    "size": 225,
    "path": "../public/flag/TT.svg"
  },
  "/flag/TW.svg": {
    "type": "image/svg+xml",
    "etag": "\"18d-SIOp8gWy8B1P0+e7mHM/otWJDK8\"",
    "mtime": "2025-11-29T01:47:19.734Z",
    "size": 397,
    "path": "../public/flag/TW.svg"
  },
  "/flag/TZ.svg": {
    "type": "image/svg+xml",
    "etag": "\"17f-5JveZOaU4R6kvot6sZDUHol39I8\"",
    "mtime": "2025-11-29T01:47:20.478Z",
    "size": 383,
    "path": "../public/flag/TZ.svg"
  },
  "/flag/UA.svg": {
    "type": "image/svg+xml",
    "etag": "\"a0-l/2L6P6g7UrWsXpnV9qWtD+YHco\"",
    "mtime": "2025-11-29T01:47:21.086Z",
    "size": 160,
    "path": "../public/flag/UA.svg"
  },
  "/flag/UG.svg": {
    "type": "image/svg+xml",
    "etag": "\"e20-d+LWqRJP24dheO+VF1b4ot67RUU\"",
    "mtime": "2025-11-29T01:47:21.900Z",
    "size": 3616,
    "path": "../public/flag/UG.svg"
  },
  "/flag/US.svg": {
    "type": "image/svg+xml",
    "etag": "\"2fd-qq0Pc0aUYlwx9p/D1eIFpEWyY7Y\"",
    "mtime": "2025-11-29T01:47:22.662Z",
    "size": 765,
    "path": "../public/flag/US.svg"
  },
  "/flag/UY.svg": {
    "type": "image/svg+xml",
    "etag": "\"1684-BGhHbw0vQU/XPQFwdLnLMEAGXy4\"",
    "mtime": "2025-11-29T01:47:23.492Z",
    "size": 5764,
    "path": "../public/flag/UY.svg"
  },
  "/flag/UZ.svg": {
    "type": "image/svg+xml",
    "etag": "\"4db-PngjWsyaxLzJ5lofQAkgiED+jPc\"",
    "mtime": "2025-11-29T01:47:24.152Z",
    "size": 1243,
    "path": "../public/flag/UZ.svg"
  },
  "/flag/VA.svg": {
    "type": "image/svg+xml",
    "etag": "\"19e90-APWcweUUoFvaSQ/rvt88CE2LQvI\"",
    "mtime": "2025-11-29T01:47:25.366Z",
    "size": 106128,
    "path": "../public/flag/VA.svg"
  },
  "/flag/VE.svg": {
    "type": "image/svg+xml",
    "etag": "\"760-0CQyG5AgLQa6LVbl2GmgwhVFWWA\"",
    "mtime": "2025-11-29T01:47:25.944Z",
    "size": 1888,
    "path": "../public/flag/VE.svg"
  },
  "/flag/VN.svg": {
    "type": "image/svg+xml",
    "etag": "\"c2-HChMBi0coO5ZUjZIVJ7c32Wp4XM\"",
    "mtime": "2025-11-29T01:47:26.475Z",
    "size": 194,
    "path": "../public/flag/VN.svg"
  },
  "/flag/VU.svg": {
    "type": "image/svg+xml",
    "etag": "\"a37-evH+/esXgg60FjhIb1huhvie/FM\"",
    "mtime": "2025-11-29T01:47:27.137Z",
    "size": 2615,
    "path": "../public/flag/VU.svg"
  },
  "/flag/WS.svg": {
    "type": "image/svg+xml",
    "etag": "\"280-GjzAMJMLYBzZ5eJYQixiepDiLeg\"",
    "mtime": "2025-11-29T01:47:27.906Z",
    "size": 640,
    "path": "../public/flag/WS.svg"
  },
  "/flag/XK.svg": {
    "type": "image/svg+xml",
    "etag": "\"1157-Q7Z+XAhm9IJ9CHaD4nS9cOlTjjE\"",
    "mtime": "2025-11-29T01:47:28.429Z",
    "size": 4439,
    "path": "../public/flag/XK.svg"
  },
  "/flag/YE.svg": {
    "type": "image/svg+xml",
    "etag": "\"b3-ceWpjFVulD2rmHc3kNh0Z3/tgK0\"",
    "mtime": "2025-11-29T01:47:28.979Z",
    "size": 179,
    "path": "../public/flag/YE.svg"
  },
  "/flag/ZA.svg": {
    "type": "image/svg+xml",
    "etag": "\"236-qrT/vtv2W6TT6ZflkrfvjDMduRk\"",
    "mtime": "2025-11-29T01:47:29.622Z",
    "size": 566,
    "path": "../public/flag/ZA.svg"
  },
  "/flag/ZM.svg": {
    "type": "image/svg+xml",
    "etag": "\"1469-8OkMBt7J/frveICvbMLqCZldOKM\"",
    "mtime": "2025-11-29T01:47:30.217Z",
    "size": 5225,
    "path": "../public/flag/ZM.svg"
  },
  "/flag/ZW.svg": {
    "type": "image/svg+xml",
    "etag": "\"6d0-m3sPESxG5uSRf+OhvaEvNdwYHTQ\"",
    "mtime": "2025-11-29T01:47:31.010Z",
    "size": 1744,
    "path": "../public/flag/ZW.svg"
  },
  "/icons/facetime.svg": {
    "type": "image/svg+xml",
    "etag": "\"128-PpX8GuN9Mg4l7w9+utU06l9Cz+c\"",
    "mtime": "2025-11-26T22:47:34.115Z",
    "size": 296,
    "path": "../public/icons/facetime.svg"
  },
  "/icons/icon-144x144.png": {
    "type": "image/png",
    "etag": "\"1b9a-RGdT1OzeKtDSIUDqb7363e02VM8\"",
    "mtime": "2025-11-26T22:47:34.116Z",
    "size": 7066,
    "path": "../public/icons/icon-144x144.png"
  },
  "/icons/instagram.svg": {
    "type": "image/svg+xml",
    "etag": "\"f11-M4kIUEjSWN4oWQPPT7dfFVnqHE4\"",
    "mtime": "2025-11-26T22:47:34.118Z",
    "size": 3857,
    "path": "../public/icons/instagram.svg"
  },
  "/icons/telegram.svg": {
    "type": "image/svg+xml",
    "etag": "\"b29-KsTRfNmflze2Xq32pXox+HZPqp8\"",
    "mtime": "2025-11-26T22:47:34.159Z",
    "size": 2857,
    "path": "../public/icons/telegram.svg"
  },
  "/icons/user.svg": {
    "type": "image/svg+xml",
    "etag": "\"736-7KKrpCm9Ox4dRqu3gmbwyhXap78\"",
    "mtime": "2025-11-26T22:47:34.159Z",
    "size": 1846,
    "path": "../public/icons/user.svg"
  },
  "/icons/whatsapp.svg": {
    "type": "image/svg+xml",
    "etag": "\"eb2-vY5ADAgGsox4+EJ/QY5fEQo/3MA\"",
    "mtime": "2025-11-26T22:47:34.159Z",
    "size": 3762,
    "path": "../public/icons/whatsapp.svg"
  },
  "/icons/wheel-pointer.svg": {
    "type": "image/svg+xml",
    "etag": "\"460-XssR4ShpNvhdVoHa3R6FZwqN2yI\"",
    "mtime": "2025-11-26T22:47:34.159Z",
    "size": 1120,
    "path": "../public/icons/wheel-pointer.svg"
  },
  "/images/lucky-dice.png": {
    "type": "image/png",
    "etag": "\"16cb44-o+JgvqNJBhoR8zupDHXS6Wi7T0E\"",
    "mtime": "2025-11-26T22:47:34.171Z",
    "size": 1493828,
    "path": "../public/images/lucky-dice.png"
  },
  "/images/lucky-egg.png": {
    "type": "image/png",
    "etag": "\"173eac-NWBbOZyKoQvwh8RpkN9EYtAWqlo\"",
    "mtime": "2025-11-26T22:47:34.180Z",
    "size": 1523372,
    "path": "../public/images/lucky-egg.png"
  },
  "/images/lucky-wheel.png": {
    "type": "image/png",
    "etag": "\"165af9-nMJQaAT2C7gEB04HXZfp5Vy/qhA\"",
    "mtime": "2025-11-26T22:47:34.188Z",
    "size": 1465081,
    "path": "../public/images/lucky-wheel.png"
  },
  "/logo/logo.png": {
    "type": "image/png",
    "etag": "\"1b9a-RGdT1OzeKtDSIUDqb7363e02VM8\"",
    "mtime": "2025-11-26T22:47:34.190Z",
    "size": 7066,
    "path": "../public/logo/logo.png"
  },
  "/logo/logowhite.png": {
    "type": "image/png",
    "etag": "\"1512-1knHhXXZwnEcSRFnNkxX1tJnxCk\"",
    "mtime": "2025-11-26T22:47:34.191Z",
    "size": 5394,
    "path": "../public/logo/logowhite.png"
  },
  "/sounds/crack.mp3": {
    "type": "audio/mpeg",
    "etag": "\"8433-FFB3W5mwJ2pnfvXHvO7knG5np4c\"",
    "mtime": "2025-11-26T22:47:34.198Z",
    "size": 33843,
    "path": "../public/sounds/crack.mp3"
  },
  "/sounds/loss.mp3": {
    "type": "audio/mpeg",
    "etag": "\"211db-MWBsjwDHLBrpsi0kBzPO6FTF7jQ\"",
    "mtime": "2025-11-26T22:47:34.200Z",
    "size": 135643,
    "path": "../public/sounds/loss.mp3"
  },
  "/sounds/README.md": {
    "type": "text/markdown; charset=utf-8",
    "etag": "\"af-QlQdJIP4qts5yLZIJmEctTZTnIM\"",
    "mtime": "2025-11-26T22:47:34.197Z",
    "size": 175,
    "path": "../public/sounds/README.md"
  },
  "/sounds/roll.mp3": {
    "type": "audio/mpeg",
    "etag": "\"b040-rEioAnwgxGNyk+DBTyVN99l6hu8\"",
    "mtime": "2025-11-26T22:47:34.200Z",
    "size": 45120,
    "path": "../public/sounds/roll.mp3"
  },
  "/sounds/tick.mp3": {
    "type": "audio/mpeg",
    "etag": "\"95e-TsXvagB/GjWOlUOWhPzLjsye04w\"",
    "mtime": "2025-11-26T22:47:34.200Z",
    "size": 2398,
    "path": "../public/sounds/tick.mp3"
  },
  "/sounds/win.mp3": {
    "type": "audio/mpeg",
    "etag": "\"7800-zW+wbZFVQN7yJs1mfuHaabBrk5I\"",
    "mtime": "2025-11-26T22:47:34.204Z",
    "size": 30720,
    "path": "../public/sounds/win.mp3"
  },
  "/_nuxt/-yLFTZKB.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"527-er2HnO8d9MHeICi8OhOsLcz7NVo\"",
    "mtime": "2025-12-03T10:02:39.939Z",
    "size": 1319,
    "path": "../public/_nuxt/-yLFTZKB.js"
  },
  "/_nuxt/1rFl7KhQ.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"622a-+k7fxuB1vp0pznNSFJB7Jg9jWJY\"",
    "mtime": "2025-12-03T10:02:39.939Z",
    "size": 25130,
    "path": "../public/_nuxt/1rFl7KhQ.js"
  },
  "/_nuxt/404.Dfd2sn8K.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"256-zDGHM1+iBRRdqAXm83iFEcZ7p2I\"",
    "mtime": "2025-12-03T10:02:39.939Z",
    "size": 598,
    "path": "../public/_nuxt/404.Dfd2sn8K.css"
  },
  "/_nuxt/4BHW6T-4.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"4f25-PAwuMVunFoO3pFBpOsz93f8subs\"",
    "mtime": "2025-12-03T10:02:39.939Z",
    "size": 20261,
    "path": "../public/_nuxt/4BHW6T-4.js"
  },
  "/_nuxt/9NzxrhqS.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"fad2-7pFZAUvo4/ntHkZhPppz4I0KuOA\"",
    "mtime": "2025-12-03T10:02:39.939Z",
    "size": 64210,
    "path": "../public/_nuxt/9NzxrhqS.js"
  },
  "/_nuxt/9OSXkS0Y.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"1c9a-4MHT6ZAdfKAILIXf00IAeIc6wmQ\"",
    "mtime": "2025-12-03T10:02:39.939Z",
    "size": 7322,
    "path": "../public/_nuxt/9OSXkS0Y.js"
  },
  "/_nuxt/AccountStatusPage.DmiHVoS-.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"216-d5+ApsCCHc7+JX9J9TcJFUz0Y6w\"",
    "mtime": "2025-12-03T10:02:39.939Z",
    "size": 534,
    "path": "../public/_nuxt/AccountStatusPage.DmiHVoS-.css"
  },
  "/_nuxt/AuYbrIUI.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"31f-1A4qDapFziZA9bsKX7umwTLfR6c\"",
    "mtime": "2025-12-03T10:02:39.939Z",
    "size": 799,
    "path": "../public/_nuxt/AuYbrIUI.js"
  },
  "/_nuxt/B0tyYwQk.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"3167b-rHTRwHaZunlshPtKtRGoIeyWH2M\"",
    "mtime": "2025-12-03T10:02:39.939Z",
    "size": 202363,
    "path": "../public/_nuxt/B0tyYwQk.js"
  },
  "/_nuxt/B11my1OW.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"a7d4-aJAwbdawhG7Seu3MrZedApWYJQ0\"",
    "mtime": "2025-12-03T10:02:39.939Z",
    "size": 42964,
    "path": "../public/_nuxt/B11my1OW.js"
  },
  "/_nuxt/B6FQ9oRL.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"5825-JFP9xlVIwHVYTd8UfDELJKntjJs\"",
    "mtime": "2025-12-03T10:02:39.939Z",
    "size": 22565,
    "path": "../public/_nuxt/B6FQ9oRL.js"
  },
  "/_nuxt/BbWS4ke3.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"fe-UZxEhAbYNId2MlqIGV4d0UjP2b0\"",
    "mtime": "2025-12-03T10:02:39.939Z",
    "size": 254,
    "path": "../public/_nuxt/BbWS4ke3.js"
  },
  "/_nuxt/BE0VU-x4.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"11061-YO3L7+rZObGpZm8m+1he4Z8fxog\"",
    "mtime": "2025-12-03T10:02:39.939Z",
    "size": 69729,
    "path": "../public/_nuxt/BE0VU-x4.js"
  },
  "/_nuxt/BH825GdU.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"2771-PO9AOl5Ihf1GML7vhDiNnIc1X14\"",
    "mtime": "2025-12-03T10:02:39.939Z",
    "size": 10097,
    "path": "../public/_nuxt/BH825GdU.js"
  },
  "/_nuxt/BHag2W66.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"2d7a-bLMYd+qEHN245Ew5fGyxkrDst3A\"",
    "mtime": "2025-12-03T10:02:39.939Z",
    "size": 11642,
    "path": "../public/_nuxt/BHag2W66.js"
  },
  "/_nuxt/BHjykYjX.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"ea6-H5Ej4j7IlC8szejatVWUnMVG+L4\"",
    "mtime": "2025-12-03T10:02:39.939Z",
    "size": 3750,
    "path": "../public/_nuxt/BHjykYjX.js"
  },
  "/_nuxt/BHrLhcxZ.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"19fc-bb9qi7nB/oMz1MSJtek1Bdk0FG8\"",
    "mtime": "2025-12-03T10:02:39.939Z",
    "size": 6652,
    "path": "../public/_nuxt/BHrLhcxZ.js"
  },
  "/_nuxt/BJ5m1LBI.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"17b8e-6gRsMBqvbuNWqHqqiaxp5ueO750\"",
    "mtime": "2025-12-03T10:02:39.943Z",
    "size": 97166,
    "path": "../public/_nuxt/BJ5m1LBI.js"
  },
  "/_nuxt/BKKF7lbJ.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"438-grv8g5Ovg8OzBxEix/iY3gniqfQ\"",
    "mtime": "2025-12-03T10:02:39.939Z",
    "size": 1080,
    "path": "../public/_nuxt/BKKF7lbJ.js"
  },
  "/_nuxt/BKn2-9y8.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"724-NmyA2Ep9Acj+D4jtx4nLnzhVaVc\"",
    "mtime": "2025-12-03T10:02:39.939Z",
    "size": 1828,
    "path": "../public/_nuxt/BKn2-9y8.js"
  },
  "/_nuxt/BO-F-Nrc.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"2e3-uVPBqyJJk2zN+1VrJmUMhhPUALI\"",
    "mtime": "2025-12-03T10:02:39.939Z",
    "size": 739,
    "path": "../public/_nuxt/BO-F-Nrc.js"
  },
  "/_nuxt/bOnkj39d.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"4c78-yMrRtdOUBbeM+zoo87BIJHyMHPo\"",
    "mtime": "2025-12-03T10:02:39.939Z",
    "size": 19576,
    "path": "../public/_nuxt/bOnkj39d.js"
  },
  "/_nuxt/BottomSheet.DuaFb-lg.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"94-JcvpxrRasw/0io8iSGB5BhbAu6I\"",
    "mtime": "2025-12-03T10:02:39.939Z",
    "size": 148,
    "path": "../public/_nuxt/BottomSheet.DuaFb-lg.css"
  },
  "/_nuxt/BQaf_e2d.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"227f-+r4BEa1Np8OXgjO82hN7asO7MHk\"",
    "mtime": "2025-12-03T10:02:39.939Z",
    "size": 8831,
    "path": "../public/_nuxt/BQaf_e2d.js"
  },
  "/_nuxt/Br9Aso-q.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"2259-XN1ay2uYWadiwdRWkbkqkmaCY1o\"",
    "mtime": "2025-12-03T10:02:39.939Z",
    "size": 8793,
    "path": "../public/_nuxt/Br9Aso-q.js"
  },
  "/_nuxt/BRBG3GYJ.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"47a-o5movsjc16i4zY7yOmjkaXpwYio\"",
    "mtime": "2025-12-03T10:02:39.939Z",
    "size": 1146,
    "path": "../public/_nuxt/BRBG3GYJ.js"
  },
  "/_nuxt/BS8ZxZht.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"1a8b-mOgZOIMVR/yh2Idme6LNLBPb0k4\"",
    "mtime": "2025-12-03T10:02:39.939Z",
    "size": 6795,
    "path": "../public/_nuxt/BS8ZxZht.js"
  },
  "/_nuxt/Bw2MbY2A.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"132-Rs8Yu0hZIpI55cIZ4lCE3P/4HyM\"",
    "mtime": "2025-12-03T10:02:39.939Z",
    "size": 306,
    "path": "../public/_nuxt/Bw2MbY2A.js"
  },
  "/_nuxt/Bw9k-xBj.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"639c-IXr4QoDwzkK7KHyNOOzsjldCEHE\"",
    "mtime": "2025-12-03T10:02:39.939Z",
    "size": 25500,
    "path": "../public/_nuxt/Bw9k-xBj.js"
  },
  "/_nuxt/Bwb75us3.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"525d-1YfA+p5h/FTP5vhnGkJAbDA91Vw\"",
    "mtime": "2025-12-03T10:02:39.939Z",
    "size": 21085,
    "path": "../public/_nuxt/Bwb75us3.js"
  },
  "/_nuxt/BwRPt94S.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"32ec-C1PpkMXVQq1WlNMRrDaVhI9zvKo\"",
    "mtime": "2025-12-03T10:02:39.939Z",
    "size": 13036,
    "path": "../public/_nuxt/BwRPt94S.js"
  },
  "/_nuxt/BWSmSm4H.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"22be-BCZ2Viqon5K1HbYwOgGBBF2prCY\"",
    "mtime": "2025-12-03T10:02:39.939Z",
    "size": 8894,
    "path": "../public/_nuxt/BWSmSm4H.js"
  },
  "/_nuxt/BzaVNimB.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"f9-wXLORqc9x1YaWb3SkItYQH9fec4\"",
    "mtime": "2025-12-03T10:02:39.939Z",
    "size": 249,
    "path": "../public/_nuxt/BzaVNimB.js"
  },
  "/_nuxt/BZtruDC6.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"9d6c-zvZwHCoGf+tKOq3z6PkqahEDaGE\"",
    "mtime": "2025-12-03T10:02:39.939Z",
    "size": 40300,
    "path": "../public/_nuxt/BZtruDC6.js"
  },
  "/_nuxt/BZ_1gHXj.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"891-Srrdnur9zRDs5qqNOvdZeJtiwxs\"",
    "mtime": "2025-12-03T10:02:39.939Z",
    "size": 2193,
    "path": "../public/_nuxt/BZ_1gHXj.js"
  },
  "/_nuxt/B_Ks4tWZ.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"9dc-B/orDexqdVXvSr+jvVqz59y3I04\"",
    "mtime": "2025-12-03T10:02:39.939Z",
    "size": 2524,
    "path": "../public/_nuxt/B_Ks4tWZ.js"
  },
  "/_nuxt/C18l44rG.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"1373-si0hEL2PM71MPQmbnz/6i344vzY\"",
    "mtime": "2025-12-03T10:02:39.939Z",
    "size": 4979,
    "path": "../public/_nuxt/C18l44rG.js"
  },
  "/_nuxt/C1aQa-TZ.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"df1-E/wisW2gAzw91x5SBP6O8Wx7GvY\"",
    "mtime": "2025-12-03T10:02:39.939Z",
    "size": 3569,
    "path": "../public/_nuxt/C1aQa-TZ.js"
  },
  "/_nuxt/C47fqy_T.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"24c-YBijbreZV/TdvoHCQr3cTJfMLYs\"",
    "mtime": "2025-12-03T10:02:39.939Z",
    "size": 588,
    "path": "../public/_nuxt/C47fqy_T.js"
  },
  "/_nuxt/C4HTObSL.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"6099-dH98makkVAuA2pzmaTPYFB4Y7y0\"",
    "mtime": "2025-12-03T10:02:39.946Z",
    "size": 24729,
    "path": "../public/_nuxt/C4HTObSL.js"
  },
  "/_nuxt/C5T1DFdo.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"1cc8-jFMxJjPeLfEZufScsagT4L6chD0\"",
    "mtime": "2025-12-03T10:02:39.939Z",
    "size": 7368,
    "path": "../public/_nuxt/C5T1DFdo.js"
  },
  "/_nuxt/CaE7J4IZ.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"bbc-Dko4X1osjQVFCeJ0eZLdQ6td5NU\"",
    "mtime": "2025-12-03T10:02:39.939Z",
    "size": 3004,
    "path": "../public/_nuxt/CaE7J4IZ.js"
  },
  "/_nuxt/CamtQw8Z.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"1d98-t5ghjtnK9VTso/qql06NPFzPrGw\"",
    "mtime": "2025-12-03T10:02:39.939Z",
    "size": 7576,
    "path": "../public/_nuxt/CamtQw8Z.js"
  },
  "/_nuxt/CD-sIVio.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"1ded-Qb6F1fYxJPraFl9NoWkw7VGPdWA\"",
    "mtime": "2025-12-03T10:02:39.939Z",
    "size": 7661,
    "path": "../public/_nuxt/CD-sIVio.js"
  },
  "/_nuxt/CE1G-McA.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"2f3-ZzFXd6i6fqKCtUh5P1kdubTrulk\"",
    "mtime": "2025-12-03T10:02:39.939Z",
    "size": 755,
    "path": "../public/_nuxt/CE1G-McA.js"
  },
  "/_nuxt/Cfo-17X4.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"2ca4-IYn4SG14kSHttGSDEk92UU8aTHY\"",
    "mtime": "2025-12-03T10:02:39.939Z",
    "size": 11428,
    "path": "../public/_nuxt/Cfo-17X4.js"
  },
  "/_nuxt/CFRFqJJ0.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"13f3f-9L4atv/8iwmu7AHoMDnOS5EJLwY\"",
    "mtime": "2025-12-03T10:02:39.939Z",
    "size": 81727,
    "path": "../public/_nuxt/CFRFqJJ0.js"
  },
  "/_nuxt/CfwJUcFS.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"ee5-qrkKXSPEwsBF9nP6I+GQ0i52jR0\"",
    "mtime": "2025-12-03T10:02:39.939Z",
    "size": 3813,
    "path": "../public/_nuxt/CfwJUcFS.js"
  },
  "/_nuxt/CFwlc10b.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"1499-2LmtO8ncG5gnz/HytoBTCsXxAT4\"",
    "mtime": "2025-12-03T10:02:39.939Z",
    "size": 5273,
    "path": "../public/_nuxt/CFwlc10b.js"
  },
  "/_nuxt/CghfBoBB.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"4190-SVWXDnLtSBQIK6UpayT9XzobxhI\"",
    "mtime": "2025-12-03T10:02:39.939Z",
    "size": 16784,
    "path": "../public/_nuxt/CghfBoBB.js"
  },
  "/_nuxt/CgleJCdt.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"24d-vLiJ52DvS19QgWJWBKQqDxwHFWI\"",
    "mtime": "2025-12-03T10:02:39.939Z",
    "size": 589,
    "path": "../public/_nuxt/CgleJCdt.js"
  },
  "/_nuxt/CiRxp0qH.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"2267-iWdjYgagAdPIBZkunxiQ0PXJdK4\"",
    "mtime": "2025-12-03T10:02:39.939Z",
    "size": 8807,
    "path": "../public/_nuxt/CiRxp0qH.js"
  },
  "/_nuxt/CiUXN6WC.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"30c0-lMe4EidNzKZcSKF+l+vTO+5SUHg\"",
    "mtime": "2025-12-03T10:02:39.939Z",
    "size": 12480,
    "path": "../public/_nuxt/CiUXN6WC.js"
  },
  "/_nuxt/clock.CjPF14Cr.png": {
    "type": "image/png",
    "etag": "\"9b0b-u0mrbKalyjaIp3Q6PBgYviyR8rA\"",
    "mtime": "2025-12-03T10:02:39.911Z",
    "size": 39691,
    "path": "../public/_nuxt/clock.CjPF14Cr.png"
  },
  "/_nuxt/CNh-RS3L.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"dc9-LuKlGzd/nngegtmFxPg1wXkCeCI\"",
    "mtime": "2025-12-03T10:02:39.939Z",
    "size": 3529,
    "path": "../public/_nuxt/CNh-RS3L.js"
  },
  "/_nuxt/Co7CtfSR.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"3f1-DGZWb4P3s2Z4NPMzqdwol5EGGpk\"",
    "mtime": "2025-12-03T10:02:39.939Z",
    "size": 1009,
    "path": "../public/_nuxt/Co7CtfSR.js"
  },
  "/_nuxt/COm-BwSM.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"1932-YKfHvQkWGqPwxhOOz2FARnIr2Gk\"",
    "mtime": "2025-12-03T10:02:39.939Z",
    "size": 6450,
    "path": "../public/_nuxt/COm-BwSM.js"
  },
  "/_nuxt/CP9hl-D4.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"25b-HIMM2ZBTjn2DOl4dxqsYoFStzXE\"",
    "mtime": "2025-12-03T10:02:39.939Z",
    "size": 603,
    "path": "../public/_nuxt/CP9hl-D4.js"
  },
  "/_nuxt/Cq8bXnGM.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"4be-MxsCLzQC3hDsRBuin+CjeZIzQno\"",
    "mtime": "2025-12-03T10:02:39.939Z",
    "size": 1214,
    "path": "../public/_nuxt/Cq8bXnGM.js"
  },
  "/_nuxt/CqVibRfq.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"107b-Z7+7ESBpkUDnKyYIzFg/f3mreF8\"",
    "mtime": "2025-12-03T10:02:39.939Z",
    "size": 4219,
    "path": "../public/_nuxt/CqVibRfq.js"
  },
  "/_nuxt/Cr5Iw68y.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"3857-6d2MfALK34suGFV0Z79yss+hA94\"",
    "mtime": "2025-12-03T10:02:39.939Z",
    "size": 14423,
    "path": "../public/_nuxt/Cr5Iw68y.js"
  },
  "/_nuxt/CRP29RWn.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"cd1bc-lXkl9blCG2u5sT+NS0RTqOVrGuM\"",
    "mtime": "2025-12-03T10:02:39.968Z",
    "size": 840124,
    "path": "../public/_nuxt/CRP29RWn.js"
  },
  "/_nuxt/CrrP3TQ3.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"c2-P44kTwbBk4xxVOyoTjLqFo52FzQ\"",
    "mtime": "2025-12-03T10:02:39.939Z",
    "size": 194,
    "path": "../public/_nuxt/CrrP3TQ3.js"
  },
  "/_nuxt/CT39rhyn.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"95d2-byMs/V+NUKask12B87TqThm7i0g\"",
    "mtime": "2025-12-03T10:02:39.939Z",
    "size": 38354,
    "path": "../public/_nuxt/CT39rhyn.js"
  },
  "/_nuxt/Ct89Yiyn.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"22dab-ImzjLaHoIdhkRLqYs1K94l5131s\"",
    "mtime": "2025-12-03T10:02:39.939Z",
    "size": 142763,
    "path": "../public/_nuxt/Ct89Yiyn.js"
  },
  "/_nuxt/CTrVYS27.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"4c1-aATmzBM6G8tWxgnqer0y3Ob2qOY\"",
    "mtime": "2025-12-03T10:02:39.939Z",
    "size": 1217,
    "path": "../public/_nuxt/CTrVYS27.js"
  },
  "/_nuxt/Cu1qF5xf.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"9399-W9XOsRmcgbSva2Wp/WbcR9AmXQ8\"",
    "mtime": "2025-12-03T10:02:39.939Z",
    "size": 37785,
    "path": "../public/_nuxt/Cu1qF5xf.js"
  },
  "/_nuxt/Cu2keg6Q.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"3455-bOvvFFb02OJHZMiJFslG9bVX90A\"",
    "mtime": "2025-12-03T10:02:39.939Z",
    "size": 13397,
    "path": "../public/_nuxt/Cu2keg6Q.js"
  },
  "/_nuxt/CU4qPF7-.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"19f3-EmbCfGQ/vC6PGjKtSgFb9w/+ymI\"",
    "mtime": "2025-12-03T10:02:39.939Z",
    "size": 6643,
    "path": "../public/_nuxt/CU4qPF7-.js"
  },
  "/_nuxt/CustomizeLinkPage.8WuFCuHs.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"148-lCjxZIbSLw/I3TurMmFkihZoxE4\"",
    "mtime": "2025-12-03T10:02:39.939Z",
    "size": 328,
    "path": "../public/_nuxt/CustomizeLinkPage.8WuFCuHs.css"
  },
  "/_nuxt/Cx6G6luq.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"20e3-zLXj9n83dvUk3vPt4JeOT205UTw\"",
    "mtime": "2025-12-03T10:02:39.939Z",
    "size": 8419,
    "path": "../public/_nuxt/Cx6G6luq.js"
  },
  "/_nuxt/CYu7s3iv.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"10e7-aNWM83sH5OW4fWmrxlnk8vMTpRg\"",
    "mtime": "2025-12-03T10:02:39.939Z",
    "size": 4327,
    "path": "../public/_nuxt/CYu7s3iv.js"
  },
  "/_nuxt/D31jHBk2.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"5bc7-ASoiQ05jJ0ixCsm1vv6EZLNi0Mg\"",
    "mtime": "2025-12-03T10:02:39.939Z",
    "size": 23495,
    "path": "../public/_nuxt/D31jHBk2.js"
  },
  "/_nuxt/D5PPH0Xh.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"1e32-e7xdxkikVpa8RmcVettF319X728\"",
    "mtime": "2025-12-03T10:02:39.939Z",
    "size": 7730,
    "path": "../public/_nuxt/D5PPH0Xh.js"
  },
  "/_nuxt/D64zF-rC.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"5c3-SSaW/+3uUxhVR2NaW9m96GMV/nE\"",
    "mtime": "2025-12-03T10:02:39.939Z",
    "size": 1475,
    "path": "../public/_nuxt/D64zF-rC.js"
  },
  "/_nuxt/D8JGLIeS.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"1fd7b-f6SjmdPzccj8eUilGBHmlODRmZI\"",
    "mtime": "2025-12-03T10:02:39.939Z",
    "size": 130427,
    "path": "../public/_nuxt/D8JGLIeS.js"
  },
  "/_nuxt/DcqXlS2i.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"13e8-w72No5UU6cZEP6iyBiL8KpdoGHc\"",
    "mtime": "2025-12-03T10:02:39.939Z",
    "size": 5096,
    "path": "../public/_nuxt/DcqXlS2i.js"
  },
  "/_nuxt/default.C_b-wKsV.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"2da-NyiERpWFTYJzsamN6gfL35uZVxo\"",
    "mtime": "2025-12-03T10:02:39.939Z",
    "size": 730,
    "path": "../public/_nuxt/default.C_b-wKsV.css"
  },
  "/_nuxt/DEXkvXcA.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"14ea-5WSXR7fvqyzHzgTPOruGivJmdSs\"",
    "mtime": "2025-12-03T10:02:39.939Z",
    "size": 5354,
    "path": "../public/_nuxt/DEXkvXcA.js"
  },
  "/_nuxt/DFzjRZmv.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"5eadd-OR6vHhwy05j8zbxA+hOuWaP0zMM\"",
    "mtime": "2025-12-03T10:02:39.939Z",
    "size": 387805,
    "path": "../public/_nuxt/DFzjRZmv.js"
  },
  "/_nuxt/DgT3uxKw.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"496b-d0WZryHaGlz3LrldrSUjn+334Yg\"",
    "mtime": "2025-12-03T10:02:39.939Z",
    "size": 18795,
    "path": "../public/_nuxt/DgT3uxKw.js"
  },
  "/_nuxt/DGzIcDwE.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"71d-tof8m5wQhEa58G4c3kP7/CSaS08\"",
    "mtime": "2025-12-03T10:02:39.939Z",
    "size": 1821,
    "path": "../public/_nuxt/DGzIcDwE.js"
  },
  "/_nuxt/DiscountDetailPage.BJRkrizL.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"34c-+sUPAQKoNLKxfOiQJ1FNu5o4/Sw\"",
    "mtime": "2025-12-03T10:02:39.939Z",
    "size": 844,
    "path": "../public/_nuxt/DiscountDetailPage.BJRkrizL.css"
  },
  "/_nuxt/DlAUqK2U.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"5b-eFCz/UrraTh721pgAl0VxBNR1es\"",
    "mtime": "2025-12-03T10:02:39.939Z",
    "size": 91,
    "path": "../public/_nuxt/DlAUqK2U.js"
  },
  "/_nuxt/DmNxi0ik.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"27f1-iZNty/GQ6pJ0RQRn9ih1WPnCSxA\"",
    "mtime": "2025-12-03T10:02:39.939Z",
    "size": 10225,
    "path": "../public/_nuxt/DmNxi0ik.js"
  },
  "/_nuxt/Dmv2tsM1.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"138b3-29Z+thBuBRkGIxE5ZEbYlcN3KlQ\"",
    "mtime": "2025-12-03T10:02:39.939Z",
    "size": 80051,
    "path": "../public/_nuxt/Dmv2tsM1.js"
  },
  "/_nuxt/dpsE-BPK.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"2ce-3FedN+k/pbppVSFHnk9TBORaCac\"",
    "mtime": "2025-12-03T10:02:39.939Z",
    "size": 718,
    "path": "../public/_nuxt/dpsE-BPK.js"
  },
  "/_nuxt/DqKRc5xS.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"a62-YiCdmlNoY203IfJ2sFpiaijSz9I\"",
    "mtime": "2025-12-03T10:02:39.939Z",
    "size": 2658,
    "path": "../public/_nuxt/DqKRc5xS.js"
  },
  "/_nuxt/Drd2Kxz2.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"2395-TOlESTAuawdqcHFThpOkJ2fPvNU\"",
    "mtime": "2025-12-03T10:02:39.939Z",
    "size": 9109,
    "path": "../public/_nuxt/Drd2Kxz2.js"
  },
  "/_nuxt/Drvv-Qqv.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"39f13-jvuRF7GuVYY/9so4xbc/OiwrThc\"",
    "mtime": "2025-12-03T10:02:39.943Z",
    "size": 237331,
    "path": "../public/_nuxt/Drvv-Qqv.js"
  },
  "/_nuxt/Ds5H_Usl.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"225e-zweCIlWUcVvIV2iCo8swUy1dEK4\"",
    "mtime": "2025-12-03T10:02:39.939Z",
    "size": 8798,
    "path": "../public/_nuxt/Ds5H_Usl.js"
  },
  "/_nuxt/DUksgA9l.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"1361-b748kEjutwolTDM8+1d9cFmnBBQ\"",
    "mtime": "2025-12-03T10:02:39.939Z",
    "size": 4961,
    "path": "../public/_nuxt/DUksgA9l.js"
  },
  "/_nuxt/DVSgOK_X.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"196a20-XdwppCQHFhK8YDf7/kZEjNlZQL4\"",
    "mtime": "2025-12-03T10:02:39.984Z",
    "size": 1665568,
    "path": "../public/_nuxt/DVSgOK_X.js"
  },
  "/_nuxt/Dx4lIkKJ.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"169-jLbliZ2SzQI2K684n81tkh0Qf7s\"",
    "mtime": "2025-12-03T10:02:39.939Z",
    "size": 361,
    "path": "../public/_nuxt/Dx4lIkKJ.js"
  },
  "/_nuxt/DzCZZX03.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"1cbf-HDp0WsLKxdMMx1Ba5aVUfaIKTsI\"",
    "mtime": "2025-12-03T10:02:39.939Z",
    "size": 7359,
    "path": "../public/_nuxt/DzCZZX03.js"
  },
  "/_nuxt/entry.BTsH7tao.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"101-dGXcEjpZZe2ELNnRUr2CZhxSqE4\"",
    "mtime": "2025-12-03T10:02:39.939Z",
    "size": 257,
    "path": "../public/_nuxt/entry.BTsH7tao.css"
  },
  "/_nuxt/feature.VuRgyHhH.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"100-JwVejTUImnJAuzu2vsnXfAgBDqc\"",
    "mtime": "2025-12-03T10:02:39.939Z",
    "size": 256,
    "path": "../public/_nuxt/feature.VuRgyHhH.css"
  },
  "/_nuxt/FinancialPage.qpRJPdis.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"337-E28pmyYn1NNQOOOzd2vmeW9DSqI\"",
    "mtime": "2025-12-03T10:02:39.939Z",
    "size": 823,
    "path": "../public/_nuxt/FinancialPage.qpRJPdis.css"
  },
  "/_nuxt/fO3kSNBp.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"165a-DUZDFPPFLYY1w2SR7sIc0CO3kc8\"",
    "mtime": "2025-12-03T10:02:39.939Z",
    "size": 5722,
    "path": "../public/_nuxt/fO3kSNBp.js"
  },
  "/_nuxt/FSCW1Yz2.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"2004-lZWd2Zm/O1rpHwjhAgwT6MgOxvU\"",
    "mtime": "2025-12-03T10:02:39.939Z",
    "size": 8196,
    "path": "../public/_nuxt/FSCW1Yz2.js"
  },
  "/_nuxt/FxhSDkxu.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"849fd-Gzp2Drlzatxb1pPibxtiKrHMUWk\"",
    "mtime": "2025-12-03T10:02:39.968Z",
    "size": 543229,
    "path": "../public/_nuxt/FxhSDkxu.js"
  },
  "/_nuxt/G_ABiRj2.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"14ff-A9EeCApx8etfUhz1q6zIvSHDlPA\"",
    "mtime": "2025-12-03T10:02:39.939Z",
    "size": 5375,
    "path": "../public/_nuxt/G_ABiRj2.js"
  },
  "/_nuxt/hWjkn-YR.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"10c2f-0N4OAd13iAV5gCd1TK7BoPfYLEI\"",
    "mtime": "2025-12-03T10:02:39.939Z",
    "size": 68655,
    "path": "../public/_nuxt/hWjkn-YR.js"
  },
  "/_nuxt/ImageCropperModal.BjIOXrOD.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"119b-RR8Nli5cDS6tTHuv2Kh5e8GgQyc\"",
    "mtime": "2025-12-03T10:02:39.939Z",
    "size": 4507,
    "path": "../public/_nuxt/ImageCropperModal.BjIOXrOD.css"
  },
  "/_nuxt/InboxPage.nXAtZMHP.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"e2-qmMlX6MLcELePfeOmt5MgzE+htU\"",
    "mtime": "2025-12-03T10:02:39.939Z",
    "size": 226,
    "path": "../public/_nuxt/InboxPage.nXAtZMHP.css"
  },
  "/_nuxt/index.adYEfPDQ.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"90-1MmqSFeSUUFibZWM8QzIeRN9V/c\"",
    "mtime": "2025-12-03T10:02:39.939Z",
    "size": 144,
    "path": "../public/_nuxt/index.adYEfPDQ.css"
  },
  "/_nuxt/index.BE6Sw3C7.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"b6-f0ufNlMfGtzmN8TveWzFeoUBZUI\"",
    "mtime": "2025-12-03T10:02:39.939Z",
    "size": 182,
    "path": "../public/_nuxt/index.BE6Sw3C7.css"
  },
  "/_nuxt/index.BIf0Dnw6.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"f9-OI6ifRJcfnGFfwU80+MYgv3oDYM\"",
    "mtime": "2025-12-03T10:02:39.939Z",
    "size": 249,
    "path": "../public/_nuxt/index.BIf0Dnw6.css"
  },
  "/_nuxt/index.BNpH1alc.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"1e21-5zQ0I/1SrVNm306UZ1KjSXLar7c\"",
    "mtime": "2025-12-03T10:02:39.939Z",
    "size": 7713,
    "path": "../public/_nuxt/index.BNpH1alc.css"
  },
  "/_nuxt/index.Bt1CnZZj.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"233-4Fn4+n2Ksdw6zVUJa+0dCxBK73o\"",
    "mtime": "2025-12-03T10:02:39.939Z",
    "size": 563,
    "path": "../public/_nuxt/index.Bt1CnZZj.css"
  },
  "/_nuxt/index.Cb4mHQ0Z.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"419-CTXtEkLfsf2C+p7gz+yoFTMNgYU\"",
    "mtime": "2025-12-03T10:02:39.939Z",
    "size": 1049,
    "path": "../public/_nuxt/index.Cb4mHQ0Z.css"
  },
  "/_nuxt/index.CMBujYbv.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"4af-x1vwf+sK963kBYAuq69GfjTtoz0\"",
    "mtime": "2025-12-03T10:02:39.939Z",
    "size": 1199,
    "path": "../public/_nuxt/index.CMBujYbv.css"
  },
  "/_nuxt/index.DnhdjAuP.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"27c-fKwSDmFTd3GA6pjj+wFlH54BHMw\"",
    "mtime": "2025-12-03T10:02:39.939Z",
    "size": 636,
    "path": "../public/_nuxt/index.DnhdjAuP.css"
  },
  "/_nuxt/index.DWfrPpgW.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"201-6Id7O3wVfZa9gqJ9T9uO8l3SEBU\"",
    "mtime": "2025-12-03T10:02:39.939Z",
    "size": 513,
    "path": "../public/_nuxt/index.DWfrPpgW.css"
  },
  "/_nuxt/InfoToast.m356R2re.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"19b-Wj46Dn5UTUiBAzvsJx/1OzQd1cY\"",
    "mtime": "2025-12-03T10:02:39.939Z",
    "size": 411,
    "path": "../public/_nuxt/InfoToast.m356R2re.css"
  },
  "/_nuxt/InvoiceDetailPage.wLARbDD3.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"ec-31mNZOqVWj+nb/64NaLuXhuo9h4\"",
    "mtime": "2025-12-03T10:02:39.939Z",
    "size": 236,
    "path": "../public/_nuxt/InvoiceDetailPage.wLARbDD3.css"
  },
  "/_nuxt/invoices.Bwb0SdXn.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"17d-mC+gdRKxlsN2OTOetTfoY4PMv7I\"",
    "mtime": "2025-12-03T10:02:39.939Z",
    "size": 381,
    "path": "../public/_nuxt/invoices.Bwb0SdXn.css"
  },
  "/_nuxt/Je2szWtn.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"26edf-7p3L1n1dfqHPXXx9tEwMwuwctTs\"",
    "mtime": "2025-12-03T10:02:39.946Z",
    "size": 159455,
    "path": "../public/_nuxt/Je2szWtn.js"
  },
  "/_nuxt/l1jQOxRu.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"47fa-WrPwBxnlHWL1QOg0zXv19+j3agw\"",
    "mtime": "2025-12-03T10:02:39.939Z",
    "size": 18426,
    "path": "../public/_nuxt/l1jQOxRu.js"
  },
  "/_nuxt/LayoutLeadForm.jiJn2JlH.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"d5a5-NJe/VVyda2iiQ6K21g02fTZLjeI\"",
    "mtime": "2025-12-03T10:02:39.939Z",
    "size": 54693,
    "path": "../public/_nuxt/LayoutLeadForm.jiJn2JlH.css"
  },
  "/_nuxt/lead-capture.B6bZo4zi.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"c7-DqwBi1VCwmrb16disvNF2rl0lEY\"",
    "mtime": "2025-12-03T10:02:39.939Z",
    "size": 199,
    "path": "../public/_nuxt/lead-capture.B6bZo4zi.css"
  },
  "/_nuxt/login.BL_qxhbp.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"97-vej7nsLbK49aXyx5zf6pe03qSIg\"",
    "mtime": "2025-12-03T10:02:39.939Z",
    "size": 151,
    "path": "../public/_nuxt/login.BL_qxhbp.css"
  },
  "/_nuxt/logo.Bw_Da6Fq.png": {
    "type": "image/png",
    "etag": "\"1b9a-RGdT1OzeKtDSIUDqb7363e02VM8\"",
    "mtime": "2025-12-03T10:02:39.931Z",
    "size": 7066,
    "path": "../public/_nuxt/logo.Bw_Da6Fq.png"
  },
  "/_nuxt/lVmvsOkf.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"1ab2-7OXBV01uSSh/sORd2qEyWmN3oMQ\"",
    "mtime": "2025-12-03T10:02:39.939Z",
    "size": 6834,
    "path": "../public/_nuxt/lVmvsOkf.js"
  },
  "/_nuxt/mapbox-gl.waQx7c2W.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"8c5c-2gRjVrlk026+UdIXsEs4K4YB3Ok\"",
    "mtime": "2025-12-03T10:02:39.939Z",
    "size": 35932,
    "path": "../public/_nuxt/mapbox-gl.waQx7c2W.css"
  },
  "/_nuxt/MapboxComponent.DdRz7ySr.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"205-yNr4uPjHJtcbCCbaATHx8h/2mG8\"",
    "mtime": "2025-12-03T10:02:39.939Z",
    "size": 517,
    "path": "../public/_nuxt/MapboxComponent.DdRz7ySr.css"
  },
  "/_nuxt/MnsCIIQl.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"2b66a-28clyLmc/LEXEg6ZSoJn9TpCbnw\"",
    "mtime": "2025-12-03T10:02:39.939Z",
    "size": 177770,
    "path": "../public/_nuxt/MnsCIIQl.js"
  },
  "/_nuxt/MobilePageHeader.C4-nitTb.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"2c-QdKwWTNNFrqwjz6wbviqtrhxzuA\"",
    "mtime": "2025-12-03T10:02:39.939Z",
    "size": 44,
    "path": "../public/_nuxt/MobilePageHeader.C4-nitTb.css"
  },
  "/_nuxt/ngrFHoWO.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"8ca7-6q1OTFSrrqb+Gnd+b3110ZSNjk0\"",
    "mtime": "2025-12-03T10:02:39.939Z",
    "size": 36007,
    "path": "../public/_nuxt/ngrFHoWO.js"
  },
  "/_nuxt/nZmYz_2H.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"52e0-g+halkW6b2Oj1eiyBpjhvvc4Cps\"",
    "mtime": "2025-12-03T10:02:39.939Z",
    "size": 21216,
    "path": "../public/_nuxt/nZmYz_2H.js"
  },
  "/_nuxt/Od7VY7mP.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"9aa3-BIWyUh1uGm1RKw4aLOf7JGd3J78\"",
    "mtime": "2025-12-03T10:02:39.939Z",
    "size": 39587,
    "path": "../public/_nuxt/Od7VY7mP.js"
  },
  "/_nuxt/order.e9QD2NBQ.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"20c-z3+VCWddrCHcI3zRzlVkKjIOlu0\"",
    "mtime": "2025-12-03T10:02:39.939Z",
    "size": 524,
    "path": "../public/_nuxt/order.e9QD2NBQ.css"
  },
  "/_nuxt/payment-history.Ddr22BEj.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"17d-PbhcaYZXPDuFki0DfxgUAZhNvIc\"",
    "mtime": "2025-12-03T10:02:39.939Z",
    "size": 381,
    "path": "../public/_nuxt/payment-history.Ddr22BEj.css"
  },
  "/_nuxt/PaymentHistoryPage.BDgffu51.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"17d-qIm5hi4weRnbO/yqvGhprb13js0\"",
    "mtime": "2025-12-03T10:02:39.939Z",
    "size": 381,
    "path": "../public/_nuxt/PaymentHistoryPage.BDgffu51.css"
  },
  "/_nuxt/permium.Do37hPbn.png": {
    "type": "image/png",
    "etag": "\"2027ac-urVbUdDxcAeABbDZLVy2fbHxf9M\"",
    "mtime": "2025-12-03T10:02:39.984Z",
    "size": 2107308,
    "path": "../public/_nuxt/permium.Do37hPbn.png"
  },
  "/_nuxt/preview.CXVQ4XXX.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"2a-dH8dM8ADfvnwSkNfhbAJRmI+51E\"",
    "mtime": "2025-12-03T10:02:39.939Z",
    "size": 42,
    "path": "../public/_nuxt/preview.CXVQ4XXX.css"
  },
  "/_nuxt/QRScannerPage.Clk6WBQT.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"128c-ddyB/xLo0WnzczLF6ai63nF/uFU\"",
    "mtime": "2025-12-03T10:02:39.939Z",
    "size": 4748,
    "path": "../public/_nuxt/QRScannerPage.Clk6WBQT.css"
  },
  "/_nuxt/RewardsPage.BnwOM8o0.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"7f-DbN6O2EKNc4N0Ao2Z+Gc2Q0uw6s\"",
    "mtime": "2025-12-03T10:02:39.939Z",
    "size": 127,
    "path": "../public/_nuxt/RewardsPage.BnwOM8o0.css"
  },
  "/_nuxt/settings.C8IEQS6X.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"38-iWZsZEzDMETbPg3F/+JGPyvjRoc\"",
    "mtime": "2025-12-03T10:02:39.939Z",
    "size": 56,
    "path": "../public/_nuxt/settings.C8IEQS6X.css"
  },
  "/_nuxt/Shabnam-Bold-FD.BNCwhB5A.woff": {
    "type": "font/woff",
    "etag": "\"b7a8-07H5O6a1GXGv2Lno+SMSRzos6pE\"",
    "mtime": "2025-12-03T10:02:39.931Z",
    "size": 47016,
    "path": "../public/_nuxt/Shabnam-Bold-FD.BNCwhB5A.woff"
  },
  "/_nuxt/Shabnam-Bold-FD.Dic6DtCy.woff2": {
    "type": "font/woff2",
    "etag": "\"8eb8-lNQHyGoFbWWnrfWyhJYPozEvIr8\"",
    "mtime": "2025-12-03T10:02:39.931Z",
    "size": 36536,
    "path": "../public/_nuxt/Shabnam-Bold-FD.Dic6DtCy.woff2"
  },
  "/_nuxt/Shabnam-Bold.0RkitpCl.woff": {
    "type": "font/woff",
    "etag": "\"bc8c-hDqBor8LurryPRMh9ALLJ9w0CFk\"",
    "mtime": "2025-12-03T10:02:39.931Z",
    "size": 48268,
    "path": "../public/_nuxt/Shabnam-Bold.0RkitpCl.woff"
  },
  "/_nuxt/Shabnam-Bold.C6MDpycz.woff2": {
    "type": "font/woff2",
    "etag": "\"930c-BR9EBM5cQ6qWB+YM+XxXKUgy0V0\"",
    "mtime": "2025-12-03T10:02:39.931Z",
    "size": 37644,
    "path": "../public/_nuxt/Shabnam-Bold.C6MDpycz.woff2"
  },
  "/_nuxt/Shabnam-Bold.C8tInzGW.ttf": {
    "type": "font/ttf",
    "etag": "\"153c4-xWBqPaCeLtj1AF39uyGZ9GsWf+8\"",
    "mtime": "2025-12-03T10:02:39.931Z",
    "size": 86980,
    "path": "../public/_nuxt/Shabnam-Bold.C8tInzGW.ttf"
  },
  "/_nuxt/Shabnam-FD.Bez3D4mh.ttf": {
    "type": "font/ttf",
    "etag": "\"14368-+nv9OGPkwuQ4kERgq+jyZ1xBgXs\"",
    "mtime": "2025-12-03T10:02:39.931Z",
    "size": 82792,
    "path": "../public/_nuxt/Shabnam-FD.Bez3D4mh.ttf"
  },
  "/_nuxt/Shabnam-Light.B6T3eGmr.woff": {
    "type": "font/woff",
    "etag": "\"d00c-KBoYNQbQBj+6C4OJCiSSO8ahnAI\"",
    "mtime": "2025-12-03T10:02:39.931Z",
    "size": 53260,
    "path": "../public/_nuxt/Shabnam-Light.B6T3eGmr.woff"
  },
  "/_nuxt/Shabnam-Light.C1deMUII.woff2": {
    "type": "font/woff2",
    "etag": "\"a628-T/4q8qTYt29sBBKcGSv40LiZTLE\"",
    "mtime": "2025-12-03T10:02:39.931Z",
    "size": 42536,
    "path": "../public/_nuxt/Shabnam-Light.C1deMUII.woff2"
  },
  "/_nuxt/Shabnam-Light.CcjBhOED.ttf": {
    "type": "font/ttf",
    "etag": "\"16ba4-BUivwpvJ3LWTVhz3/NiHGsWaaLA\"",
    "mtime": "2025-12-03T10:02:39.938Z",
    "size": 93092,
    "path": "../public/_nuxt/Shabnam-Light.CcjBhOED.ttf"
  },
  "/_nuxt/Shabnam-Medium.BDz9W7Bw.woff": {
    "type": "font/woff",
    "etag": "\"bafc-hjoBkDijMJgvdXiFY7I0TNNZDXc\"",
    "mtime": "2025-12-03T10:02:39.931Z",
    "size": 47868,
    "path": "../public/_nuxt/Shabnam-Medium.BDz9W7Bw.woff"
  },
  "/_nuxt/Shabnam-Medium.DDGEnMl9.ttf": {
    "type": "font/ttf",
    "etag": "\"15178-RoP087d9ZiP23cmFyJdvWhygoSA\"",
    "mtime": "2025-12-03T10:02:39.938Z",
    "size": 86392,
    "path": "../public/_nuxt/Shabnam-Medium.DDGEnMl9.ttf"
  },
  "/_nuxt/Shabnam-Medium.DNmzH3VD.woff2": {
    "type": "font/woff2",
    "etag": "\"9130-4voNz3EQE5TTDHWdaiagHWQWMJA\"",
    "mtime": "2025-12-03T10:02:39.931Z",
    "size": 37168,
    "path": "../public/_nuxt/Shabnam-Medium.DNmzH3VD.woff2"
  },
  "/_nuxt/Shabnam-Thin.Bvt2_Hr6.woff": {
    "type": "font/woff",
    "etag": "\"bc28-aMiUZwM5UE2zguu+Kz5VkhB4Cv8\"",
    "mtime": "2025-12-03T10:02:39.931Z",
    "size": 48168,
    "path": "../public/_nuxt/Shabnam-Thin.Bvt2_Hr6.woff"
  },
  "/_nuxt/Shabnam-Thin.C23aWo6c.woff2": {
    "type": "font/woff2",
    "etag": "\"92b0-4BulKuVAWSLXrrBDabzWGITtUrQ\"",
    "mtime": "2025-12-03T10:02:39.931Z",
    "size": 37552,
    "path": "../public/_nuxt/Shabnam-Thin.C23aWo6c.woff2"
  },
  "/_nuxt/Shabnam-Thin.RukRbn1k.ttf": {
    "type": "font/ttf",
    "etag": "\"15310-LS8XM3f1Ws2EwLBouWfKnTJ1xVk\"",
    "mtime": "2025-12-03T10:02:39.938Z",
    "size": 86800,
    "path": "../public/_nuxt/Shabnam-Thin.RukRbn1k.ttf"
  },
  "/_nuxt/Shabnam.Ci_87ogH.woff2": {
    "type": "font/woff2",
    "etag": "\"8ba8-vkEFcfA8HlEIILdX1YtcFCyk5cU\"",
    "mtime": "2025-12-03T10:02:39.931Z",
    "size": 35752,
    "path": "../public/_nuxt/Shabnam.Ci_87ogH.woff2"
  },
  "/_nuxt/Shabnam.DDmI0TtM.ttf": {
    "type": "font/ttf",
    "etag": "\"14910-BwpGGOEhvbTj4SFiWlWiC2HFhRY\"",
    "mtime": "2025-12-03T10:02:39.931Z",
    "size": 84240,
    "path": "../public/_nuxt/Shabnam.DDmI0TtM.ttf"
  },
  "/_nuxt/Shabnam.DnV26SWd.woff": {
    "type": "font/woff",
    "etag": "\"b52c-CD75vmWyFCKLY8cHm8oRbrrwoFQ\"",
    "mtime": "2025-12-03T10:02:39.931Z",
    "size": 46380,
    "path": "../public/_nuxt/Shabnam.DnV26SWd.woff"
  },
  "/_nuxt/tabler-icons-200-filled.B58NMnBP.woff": {
    "type": "font/woff",
    "etag": "\"24008-KhKpLXvGrZVvQ5YfDiEMWLH7bQU\"",
    "mtime": "2025-12-03T10:02:39.931Z",
    "size": 147464,
    "path": "../public/_nuxt/tabler-icons-200-filled.B58NMnBP.woff"
  },
  "/_nuxt/tabler-icons-200-filled.BESmfruF.woff2": {
    "type": "font/woff2",
    "etag": "\"1c350-vAM/b02gK7x7HylNgIVsA1Cvjzg\"",
    "mtime": "2025-12-03T10:02:39.931Z",
    "size": 115536,
    "path": "../public/_nuxt/tabler-icons-200-filled.BESmfruF.woff2"
  },
  "/_nuxt/tabler-icons-200-filled.DvLj7k_t.ttf": {
    "type": "font/ttf",
    "etag": "\"44fd0-8uY7Sycwves3Iw6roxiR1egQuD4\"",
    "mtime": "2025-12-03T10:02:39.931Z",
    "size": 282576,
    "path": "../public/_nuxt/tabler-icons-200-filled.DvLj7k_t.ttf"
  },
  "/_nuxt/tabler-icons-200-outline.BuOmwpvY.woff": {
    "type": "font/woff",
    "etag": "\"101660-6N9w31+hjB6XhbtrbYg4gcrA8dk\"",
    "mtime": "2025-12-03T10:02:39.975Z",
    "size": 1054304,
    "path": "../public/_nuxt/tabler-icons-200-outline.BuOmwpvY.woff"
  },
  "/_nuxt/tabler-icons-200-outline.CJ8anf5r.ttf": {
    "type": "font/ttf",
    "etag": "\"1f10a8-q9QE+l+uhC9nem7/me8+K9vrn8w\"",
    "mtime": "2025-12-03T10:02:39.988Z",
    "size": 2035880,
    "path": "../public/_nuxt/tabler-icons-200-outline.CJ8anf5r.ttf"
  },
  "/_nuxt/tabler-icons-200-outline.CK6DCKmu.woff2": {
    "type": "font/woff2",
    "etag": "\"af460-PSJNT0QLZ9PaOhRETNUQYZ2EAIc\"",
    "mtime": "2025-12-03T10:02:39.943Z",
    "size": 717920,
    "path": "../public/_nuxt/tabler-icons-200-outline.CK6DCKmu.woff2"
  },
  "/_nuxt/tabler-icons-200.Bc_u8NYc.ttf": {
    "type": "font/ttf",
    "etag": "\"237288-9ul59SjYbDh4cCclPMMrrOZns8Q\"",
    "mtime": "2025-12-03T10:02:39.988Z",
    "size": 2323080,
    "path": "../public/_nuxt/tabler-icons-200.Bc_u8NYc.ttf"
  },
  "/_nuxt/tabler-icons-200.CjCpgPF0.woff": {
    "type": "font/woff",
    "etag": "\"125744-7rzgs3z2XH7RRxs5dyWGG2t/ozI\"",
    "mtime": "2025-12-03T10:02:39.975Z",
    "size": 1201988,
    "path": "../public/_nuxt/tabler-icons-200.CjCpgPF0.woff"
  },
  "/_nuxt/tabler-icons-200.DMKDS6Ya.woff2": {
    "type": "font/woff2",
    "etag": "\"ca340-kXpQxHx8umjSbMk1optoV4u8Vvo\"",
    "mtime": "2025-12-03T10:02:39.943Z",
    "size": 828224,
    "path": "../public/_nuxt/tabler-icons-200.DMKDS6Ya.woff2"
  },
  "/_nuxt/tabler-icons-300-filled.CER9DB9C.woff2": {
    "type": "font/woff2",
    "etag": "\"1c29c-X1HwEhgf7hKBRE/FrSbjUVJKDJ8\"",
    "mtime": "2025-12-03T10:02:39.931Z",
    "size": 115356,
    "path": "../public/_nuxt/tabler-icons-300-filled.CER9DB9C.woff2"
  },
  "/_nuxt/tabler-icons-300-filled.D9pSmMpB.ttf": {
    "type": "font/ttf",
    "etag": "\"44fd0-B6QS1AFI5YsDg2AOd//oDbpdRzs\"",
    "mtime": "2025-12-03T10:02:39.931Z",
    "size": 282576,
    "path": "../public/_nuxt/tabler-icons-300-filled.D9pSmMpB.ttf"
  },
  "/_nuxt/tabler-icons-300-filled.DvxJV6jN.woff": {
    "type": "font/woff",
    "etag": "\"24008-dvTbMBPePRCuVtPudrR4oIhg5FM\"",
    "mtime": "2025-12-03T10:02:39.931Z",
    "size": 147464,
    "path": "../public/_nuxt/tabler-icons-300-filled.DvxJV6jN.woff"
  },
  "/_nuxt/tabler-icons-300-outline.B-IEwiP3.woff": {
    "type": "font/woff",
    "etag": "\"fee50-yt4c3/ZtVpTPFvWs1wG/xWYeEg8\"",
    "mtime": "2025-12-03T10:02:39.946Z",
    "size": 1044048,
    "path": "../public/_nuxt/tabler-icons-300-outline.B-IEwiP3.woff"
  },
  "/_nuxt/tabler-icons-300-outline.CQgK1Qnv.woff2": {
    "type": "font/woff2",
    "etag": "\"aad34-5J30C6jk2BrvKPy29bzHwLb1Lh8\"",
    "mtime": "2025-12-03T10:02:39.943Z",
    "size": 699700,
    "path": "../public/_nuxt/tabler-icons-300-outline.CQgK1Qnv.woff2"
  },
  "/_nuxt/tabler-icons-300-outline.HpSFTT6m.ttf": {
    "type": "font/ttf",
    "etag": "\"200208-BTb38/jfTOEJVPW/d75G43ZioOU\"",
    "mtime": "2025-12-03T10:02:39.994Z",
    "size": 2097672,
    "path": "../public/_nuxt/tabler-icons-300-outline.HpSFTT6m.ttf"
  },
  "/_nuxt/tabler-icons-300.APyrLer3.ttf": {
    "type": "font/ttf",
    "etag": "\"2463e8-esp+4mBP+SG0Yb4ThwxjQCzVU6I\"",
    "mtime": "2025-12-03T10:02:39.994Z",
    "size": 2384872,
    "path": "../public/_nuxt/tabler-icons-300.APyrLer3.ttf"
  },
  "/_nuxt/tabler-icons-300.SbBD20wV.woff2": {
    "type": "font/woff2",
    "etag": "\"c5f90-Rr8BcvQENlU7xJNeyQ71npBVh9o\"",
    "mtime": "2025-12-03T10:02:39.943Z",
    "size": 810896,
    "path": "../public/_nuxt/tabler-icons-300.SbBD20wV.woff2"
  },
  "/_nuxt/tabler-icons-300.x_UkVp37.woff": {
    "type": "font/woff",
    "etag": "\"122e6c-ytjLnsiqEySpi9lNWXu3Rh+LOBU\"",
    "mtime": "2025-12-03T10:02:39.975Z",
    "size": 1191532,
    "path": "../public/_nuxt/tabler-icons-300.x_UkVp37.woff"
  },
  "/_nuxt/tabler-icons-filled.CCyaZfTI.ttf": {
    "type": "font/ttf",
    "etag": "\"44fd0-EdzSyor6M+3+HW2TmLcHmxTPSeU\"",
    "mtime": "2025-12-03T10:02:39.931Z",
    "size": 282576,
    "path": "../public/_nuxt/tabler-icons-filled.CCyaZfTI.ttf"
  },
  "/_nuxt/tabler-icons-filled.CmVQ-26m.woff2": {
    "type": "font/woff2",
    "etag": "\"1c34c-na4yAQ6p3Lv2xIis5G8Ro8pRlgU\"",
    "mtime": "2025-12-03T10:02:39.931Z",
    "size": 115532,
    "path": "../public/_nuxt/tabler-icons-filled.CmVQ-26m.woff2"
  },
  "/_nuxt/tabler-icons-filled.DzhEaiUK.woff": {
    "type": "font/woff",
    "etag": "\"24008-cJ8QL/gGEOFK1bEpQ9E4MqP6DtI\"",
    "mtime": "2025-12-03T10:02:39.931Z",
    "size": 147464,
    "path": "../public/_nuxt/tabler-icons-filled.DzhEaiUK.woff"
  },
  "/_nuxt/tabler-icons-outline.BdRAetbD.woff": {
    "type": "font/woff",
    "etag": "\"1023dc-W+jfL3RZJGGWfKuLUHwWg6hoADE\"",
    "mtime": "2025-12-03T10:02:39.970Z",
    "size": 1057756,
    "path": "../public/_nuxt/tabler-icons-outline.BdRAetbD.woff"
  },
  "/_nuxt/tabler-icons-outline.CGUMFs3W.woff2": {
    "type": "font/woff2",
    "etag": "\"af2c0-QZ+urgUaoqmmy+zPNnU2pUiXolg\"",
    "mtime": "2025-12-03T10:02:39.943Z",
    "size": 717504,
    "path": "../public/_nuxt/tabler-icons-outline.CGUMFs3W.woff2"
  },
  "/_nuxt/tabler-icons-outline.DvXEid-x.ttf": {
    "type": "font/ttf",
    "etag": "\"1ff82c-vnsSEiz3xXIwiG2iSxif+pgcp7c\"",
    "mtime": "2025-12-03T10:02:39.984Z",
    "size": 2095148,
    "path": "../public/_nuxt/tabler-icons-outline.DvXEid-x.ttf"
  },
  "/_nuxt/tabler-icons.CthQ4-e5.woff2": {
    "type": "font/woff2",
    "etag": "\"c845c-RChmIkbKsnjZI7d2gse4TH3oZUE\"",
    "mtime": "2025-12-03T10:02:39.943Z",
    "size": 820316,
    "path": "../public/_nuxt/tabler-icons.CthQ4-e5.woff2"
  },
  "/_nuxt/tabler-icons.Cxsed65d.woff": {
    "type": "font/woff",
    "etag": "\"125e80-1ZqrBeapY+8oH/FOnm+sq/X5inA\"",
    "mtime": "2025-12-03T10:02:39.970Z",
    "size": 1203840,
    "path": "../public/_nuxt/tabler-icons.Cxsed65d.woff"
  },
  "/_nuxt/tabler-icons.FR5pMc0b.ttf": {
    "type": "font/ttf",
    "etag": "\"245a0c-oI40Ku+kEVk+45aReLGWHkg3G0g\"",
    "mtime": "2025-12-03T10:02:39.990Z",
    "size": 2382348,
    "path": "../public/_nuxt/tabler-icons.FR5pMc0b.ttf"
  },
  "/_nuxt/tutorials.DkUOoFMo.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"11e-2oendvUkw8KRH4TgVN9wPLMQRBY\"",
    "mtime": "2025-12-03T10:02:39.939Z",
    "size": 286,
    "path": "../public/_nuxt/tutorials.DkUOoFMo.css"
  },
  "/_nuxt/wallet.IojDjCHp.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"7e-FPGtVqlN7FH34Q/xdnAPf6Pr9Wk\"",
    "mtime": "2025-12-03T10:02:39.939Z",
    "size": 126,
    "path": "../public/_nuxt/wallet.IojDjCHp.css"
  },
  "/_nuxt/WalletPage.xKM0GTyU.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"7e-gAAZS32xhl7DMDUzCkHQvH5ttSk\"",
    "mtime": "2025-12-03T10:02:39.939Z",
    "size": 126,
    "path": "../public/_nuxt/WalletPage.xKM0GTyU.css"
  },
  "/_nuxt/xNkLou3x.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"6068-mZmchT8lduvJLWbVBRAcmMA1KtQ\"",
    "mtime": "2025-12-03T10:02:39.939Z",
    "size": 24680,
    "path": "../public/_nuxt/xNkLou3x.js"
  },
  "/_nuxt/YeGCIiDc.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"9f415-/9bqcw7t4/7jWkV/3j6h8qC1ZCs\"",
    "mtime": "2025-12-03T10:02:39.968Z",
    "size": 652309,
    "path": "../public/_nuxt/YeGCIiDc.js"
  },
  "/_nuxt/_slug_.BqSYvL2d.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"481-dsiZpX+qY/l19RunmxiSlApETx4\"",
    "mtime": "2025-12-03T10:02:39.939Z",
    "size": 1153,
    "path": "../public/_nuxt/_slug_.BqSYvL2d.css"
  },
  "/_nuxt/_slug_.B_EUb_9I.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"369-82wci0g7AtDs3qDrzrdnRYc0ps4\"",
    "mtime": "2025-12-03T10:02:39.939Z",
    "size": 873,
    "path": "../public/_nuxt/_slug_.B_EUb_9I.css"
  },
  "/_nuxt/_slug_.DHi-ZpHQ.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"481-LOowLwDLSxSlJfBLObf8j3Pc0OE\"",
    "mtime": "2025-12-03T10:02:39.939Z",
    "size": 1153,
    "path": "../public/_nuxt/_slug_.DHi-ZpHQ.css"
  },
  "/.well-known/appspecific/com.chrome.devtools.json": {
    "type": "application/json",
    "etag": "\"58-q4aeGmAXiWCPtP3TwFSsLux4VKg\"",
    "mtime": "2025-11-26T22:47:33.280Z",
    "size": 88,
    "path": "../public/.well-known/appspecific/com.chrome.devtools.json"
  },
  "/AppImages/android/android-launchericon-144-144.png": {
    "type": "image/png",
    "etag": "\"879-IVoivK5Rz39eBSFN42ZpaYRPqpk\"",
    "mtime": "2025-11-26T22:47:33.282Z",
    "size": 2169,
    "path": "../public/AppImages/android/android-launchericon-144-144.png"
  },
  "/AppImages/android/android-launchericon-192-192.png": {
    "type": "image/png",
    "etag": "\"b62-Oyk6p2y7b+gX7p0+2qBq/u56zGI\"",
    "mtime": "2025-11-26T22:47:33.282Z",
    "size": 2914,
    "path": "../public/AppImages/android/android-launchericon-192-192.png"
  },
  "/AppImages/android/android-launchericon-48-48.png": {
    "type": "image/png",
    "etag": "\"2b2-GWbJApmFETjBFx0JNQ4JU2wjXNk\"",
    "mtime": "2025-11-26T22:47:33.284Z",
    "size": 690,
    "path": "../public/AppImages/android/android-launchericon-48-48.png"
  },
  "/AppImages/android/android-launchericon-512-512.png": {
    "type": "image/png",
    "etag": "\"1ef5-IRKpLPLHMHzFbZpnELngQKFn8bw\"",
    "mtime": "2025-11-26T22:47:33.284Z",
    "size": 7925,
    "path": "../public/AppImages/android/android-launchericon-512-512.png"
  },
  "/AppImages/android/android-launchericon-72-72.png": {
    "type": "image/png",
    "etag": "\"42c-Q/lM84FFg45rLunAnh9fthnt4n8\"",
    "mtime": "2025-11-26T22:47:33.286Z",
    "size": 1068,
    "path": "../public/AppImages/android/android-launchericon-72-72.png"
  },
  "/AppImages/android/android-launchericon-96-96.png": {
    "type": "image/png",
    "etag": "\"5b6-28auK4cdlAM8YTuKHpHcl3c9vjU\"",
    "mtime": "2025-11-26T22:47:33.286Z",
    "size": 1462,
    "path": "../public/AppImages/android/android-launchericon-96-96.png"
  },
  "/AppImages/ios/100.png": {
    "type": "image/png",
    "etag": "\"5d2-2DvqVFG14jKQ+cbJIH2l7EipFVw\"",
    "mtime": "2025-11-26T22:47:33.288Z",
    "size": 1490,
    "path": "../public/AppImages/ios/100.png"
  },
  "/AppImages/ios/1024.png": {
    "type": "image/png",
    "etag": "\"4565-BBJXxo21U0qf+92SZ3zZDnAalyY\"",
    "mtime": "2025-11-26T22:47:33.290Z",
    "size": 17765,
    "path": "../public/AppImages/ios/1024.png"
  },
  "/AppImages/ios/114.png": {
    "type": "image/png",
    "etag": "\"6be-wH0w3c/gu4AYj+cXHbrpUiokh/U\"",
    "mtime": "2025-11-26T22:47:33.290Z",
    "size": 1726,
    "path": "../public/AppImages/ios/114.png"
  },
  "/AppImages/ios/120.png": {
    "type": "image/png",
    "etag": "\"6e7-a3nUr/55uC54Z29Hrsd0anIC4c8\"",
    "mtime": "2025-11-26T22:47:33.290Z",
    "size": 1767,
    "path": "../public/AppImages/ios/120.png"
  },
  "/AppImages/ios/128.png": {
    "type": "image/png",
    "etag": "\"775-CMDr4OFTH3AC9UITogHq7WPMdcw\"",
    "mtime": "2025-11-26T22:47:33.290Z",
    "size": 1909,
    "path": "../public/AppImages/ios/128.png"
  },
  "/AppImages/ios/144.png": {
    "type": "image/png",
    "etag": "\"879-IVoivK5Rz39eBSFN42ZpaYRPqpk\"",
    "mtime": "2025-11-26T22:47:33.293Z",
    "size": 2169,
    "path": "../public/AppImages/ios/144.png"
  },
  "/AppImages/ios/152.png": {
    "type": "image/png",
    "etag": "\"8d1-c/9rad+4AQlf1od17xTFqZNPt8s\"",
    "mtime": "2025-11-26T22:47:33.294Z",
    "size": 2257,
    "path": "../public/AppImages/ios/152.png"
  },
  "/AppImages/ios/16.png": {
    "type": "image/png",
    "etag": "\"119-MSzvkL0yoRU5A3dlarXSAj2QpAc\"",
    "mtime": "2025-11-26T22:47:33.294Z",
    "size": 281,
    "path": "../public/AppImages/ios/16.png"
  },
  "/AppImages/ios/167.png": {
    "type": "image/png",
    "etag": "\"9ca-+ZGvurb2bxiIJF8NVjcjLKVtj18\"",
    "mtime": "2025-11-26T22:47:33.297Z",
    "size": 2506,
    "path": "../public/AppImages/ios/167.png"
  },
  "/AppImages/ios/180.png": {
    "type": "image/png",
    "etag": "\"a8c-HjYNkzbjNLE/mrQS12vg1UAr6M8\"",
    "mtime": "2025-11-26T22:47:33.297Z",
    "size": 2700,
    "path": "../public/AppImages/ios/180.png"
  },
  "/AppImages/ios/192.png": {
    "type": "image/png",
    "etag": "\"b62-Oyk6p2y7b+gX7p0+2qBq/u56zGI\"",
    "mtime": "2025-11-26T22:47:33.298Z",
    "size": 2914,
    "path": "../public/AppImages/ios/192.png"
  },
  "/AppImages/ios/20.png": {
    "type": "image/png",
    "etag": "\"12c-Bz5EVvkA9FVzk1KivgD+6q2aAd4\"",
    "mtime": "2025-11-26T22:47:33.299Z",
    "size": 300,
    "path": "../public/AppImages/ios/20.png"
  },
  "/AppImages/ios/256.png": {
    "type": "image/png",
    "etag": "\"f36-45jWWdzvDSpf/MpFkQrz/yMYjOg\"",
    "mtime": "2025-11-26T22:47:33.299Z",
    "size": 3894,
    "path": "../public/AppImages/ios/256.png"
  },
  "/AppImages/ios/29.png": {
    "type": "image/png",
    "etag": "\"198-uqN266dXjQ1uuZebG0szci1tW1s\"",
    "mtime": "2025-11-26T22:47:33.299Z",
    "size": 408,
    "path": "../public/AppImages/ios/29.png"
  },
  "/AppImages/ios/32.png": {
    "type": "image/png",
    "etag": "\"1d8-UZPncYdZ81HtFf+7bZtmFJJwz9E\"",
    "mtime": "2025-11-26T22:47:33.301Z",
    "size": 472,
    "path": "../public/AppImages/ios/32.png"
  },
  "/AppImages/ios/40.png": {
    "type": "image/png",
    "etag": "\"240-60JoWN1NKIkOgMSjldmgarXUNkk\"",
    "mtime": "2025-11-26T22:47:33.301Z",
    "size": 576,
    "path": "../public/AppImages/ios/40.png"
  },
  "/AppImages/ios/50.png": {
    "type": "image/png",
    "etag": "\"2b5-iZTJRSVPpKpC0V+3aiG8XiA5sWo\"",
    "mtime": "2025-11-26T22:47:33.302Z",
    "size": 693,
    "path": "../public/AppImages/ios/50.png"
  },
  "/AppImages/ios/512.png": {
    "type": "image/png",
    "etag": "\"1ef5-IRKpLPLHMHzFbZpnELngQKFn8bw\"",
    "mtime": "2025-11-26T22:47:33.302Z",
    "size": 7925,
    "path": "../public/AppImages/ios/512.png"
  },
  "/AppImages/ios/57.png": {
    "type": "image/png",
    "etag": "\"335-t262HrMzdeGXM3pAKVBohH6j1Bc\"",
    "mtime": "2025-11-26T22:47:33.302Z",
    "size": 821,
    "path": "../public/AppImages/ios/57.png"
  },
  "/AppImages/ios/58.png": {
    "type": "image/png",
    "etag": "\"336-za0Yt2FjPYn/jP6Aq5g5TS0sya8\"",
    "mtime": "2025-11-26T22:47:33.305Z",
    "size": 822,
    "path": "../public/AppImages/ios/58.png"
  },
  "/AppImages/ios/60.png": {
    "type": "image/png",
    "etag": "\"34b-VXm2wrP8oLwD8OxOAq24fJPI5Kg\"",
    "mtime": "2025-11-26T22:47:33.305Z",
    "size": 843,
    "path": "../public/AppImages/ios/60.png"
  },
  "/AppImages/ios/64.png": {
    "type": "image/png",
    "etag": "\"380-Nq/aLWMXGxSpMRr0F4C9d4FnJUs\"",
    "mtime": "2025-11-26T22:47:33.306Z",
    "size": 896,
    "path": "../public/AppImages/ios/64.png"
  },
  "/AppImages/ios/72.png": {
    "type": "image/png",
    "etag": "\"42c-Q/lM84FFg45rLunAnh9fthnt4n8\"",
    "mtime": "2025-11-26T22:47:33.306Z",
    "size": 1068,
    "path": "../public/AppImages/ios/72.png"
  },
  "/AppImages/ios/76.png": {
    "type": "image/png",
    "etag": "\"485-TiLSUE/0FbODBqBkcbJdxMkLUpk\"",
    "mtime": "2025-11-26T22:47:33.306Z",
    "size": 1157,
    "path": "../public/AppImages/ios/76.png"
  },
  "/AppImages/ios/80.png": {
    "type": "image/png",
    "etag": "\"488-vdDkFCNlyP1MQiDYuxo0yF36SyY\"",
    "mtime": "2025-11-26T22:47:33.306Z",
    "size": 1160,
    "path": "../public/AppImages/ios/80.png"
  },
  "/AppImages/ios/87.png": {
    "type": "image/png",
    "etag": "\"4e6-ICtvta4IVEBMjXHCPnl0IQEDcVY\"",
    "mtime": "2025-11-26T22:47:33.309Z",
    "size": 1254,
    "path": "../public/AppImages/ios/87.png"
  },
  "/assets/devices/bigsticky.png": {
    "type": "image/png",
    "etag": "\"7a1b8-8zKrPsmpoXkeb/lYA9CTODEUjtk\"",
    "mtime": "2025-11-26T22:47:33.355Z",
    "size": 500152,
    "path": "../public/assets/devices/bigsticky.png"
  },
  "/assets/devices/bracelet.png": {
    "type": "image/png",
    "etag": "\"114431-DcPwH3su01iNytNaMbJ27gmH50w\"",
    "mtime": "2025-11-26T22:47:33.370Z",
    "size": 1131569,
    "path": "../public/assets/devices/bracelet.png"
  },
  "/assets/devices/card.png": {
    "type": "image/png",
    "etag": "\"8e4b9-dKzZG5cds3po2835mYUPHQHbg5E\"",
    "mtime": "2025-11-26T22:47:33.381Z",
    "size": 582841,
    "path": "../public/assets/devices/card.png"
  },
  "/assets/devices/goldcard.png": {
    "type": "image/png",
    "etag": "\"95479-ysHfe6bLchaJJm/GjUnMp31nOEs\"",
    "mtime": "2025-11-26T22:47:33.388Z",
    "size": 611449,
    "path": "../public/assets/devices/goldcard.png"
  },
  "/assets/devices/minicard.png": {
    "type": "image/png",
    "etag": "\"282e6f-q9f898p5k33YWscDon3tVZh3zbs\"",
    "mtime": "2025-11-26T22:47:33.417Z",
    "size": 2633327,
    "path": "../public/assets/devices/minicard.png"
  },
  "/assets/devices/stand.png": {
    "type": "image/png",
    "etag": "\"1fa486-c8NkU+2XmexWLkEi7FcVO5Q1g2Q\"",
    "mtime": "2025-11-26T22:47:33.441Z",
    "size": 2073734,
    "path": "../public/assets/devices/stand.png"
  },
  "/assets/devices/sticky.png": {
    "type": "image/png",
    "etag": "\"be081-W6rZ2nhQQ0psZVtTedjlYFhwTmw\"",
    "mtime": "2025-11-26T22:47:33.450Z",
    "size": 778369,
    "path": "../public/assets/devices/sticky.png"
  },
  "/assets/devices/Titanium.png": {
    "type": "image/png",
    "etag": "\"359789-APtOAWIRWUGNFbs1xAlHevaSEOo\"",
    "mtime": "2025-11-26T22:47:33.339Z",
    "size": 3512201,
    "path": "../public/assets/devices/Titanium.png"
  },
  "/assets/images/clock.png": {
    "type": "image/png",
    "etag": "\"9b0b-u0mrbKalyjaIp3Q6PBgYviyR8rA\"",
    "mtime": "2025-11-26T22:47:33.529Z",
    "size": 39691,
    "path": "../public/assets/images/clock.png"
  },
  "/assets/images/logo.svg": {
    "type": "image/svg+xml",
    "etag": "\"e78-F2V/dAlvjBnRbckMXCDvYfw7w/g\"",
    "mtime": "2025-11-26T22:47:33.780Z",
    "size": 3704,
    "path": "../public/assets/images/logo.svg"
  },
  "/assets/LinkuLogo/linku.svg": {
    "type": "image/svg+xml",
    "etag": "\"e78-F2V/dAlvjBnRbckMXCDvYfw7w/g\"",
    "mtime": "2025-11-26T22:47:33.314Z",
    "size": 3704,
    "path": "../public/assets/LinkuLogo/linku.svg"
  },
  "/assets/LinkuLogo/logo.png": {
    "type": "image/png",
    "etag": "\"1b9a-RGdT1OzeKtDSIUDqb7363e02VM8\"",
    "mtime": "2025-11-26T22:47:33.314Z",
    "size": 7066,
    "path": "../public/assets/LinkuLogo/logo.png"
  },
  "/icons/business/app_link.svg": {
    "type": "image/svg+xml",
    "etag": "\"a4d-7W+w5TeEi+/dVlSiX13x6rsj7sE\"",
    "mtime": "2025-11-26T22:47:34.072Z",
    "size": 2637,
    "path": "../public/icons/business/app_link.svg"
  },
  "/icons/business/booksy.svg": {
    "type": "image/svg+xml",
    "etag": "\"e40-B9B/TIpqdYAdekV/NmCr0DmeXwM\"",
    "mtime": "2025-11-26T22:47:34.072Z",
    "size": 3648,
    "path": "../public/icons/business/booksy.svg"
  },
  "/icons/business/calendly.svg": {
    "type": "image/svg+xml",
    "etag": "\"10bb-n1ijTh6NVo+hyZnpb7WGGT+Sqos\"",
    "mtime": "2025-11-26T22:47:34.072Z",
    "size": 4283,
    "path": "../public/icons/business/calendly.svg"
  },
  "/icons/business/card.svg": {
    "type": "image/svg+xml",
    "etag": "\"826-4FmJdglSgF0EQAflrkDqjYzyvdY\"",
    "mtime": "2025-11-26T22:47:34.083Z",
    "size": 2086,
    "path": "../public/icons/business/card.svg"
  },
  "/icons/business/chili.svg": {
    "type": "image/svg+xml",
    "etag": "\"bb7-8T6zlt4vWJ7LBTNMwWPzAceLlAU\"",
    "mtime": "2025-11-26T22:47:34.083Z",
    "size": 2999,
    "path": "../public/icons/business/chili.svg"
  },
  "/icons/business/clock.svg": {
    "type": "image/svg+xml",
    "etag": "\"7b2-xbJATfYji6PtS/xwoCY07wuhJ+E\"",
    "mtime": "2025-11-26T22:47:34.083Z",
    "size": 1970,
    "path": "../public/icons/business/clock.svg"
  },
  "/icons/business/divar.svg": {
    "type": "image/svg+xml",
    "etag": "\"9d0-CZ643BE/gnBlwZdUjUNPHFCOkXs\"",
    "mtime": "2025-11-26T22:47:34.083Z",
    "size": 2512,
    "path": "../public/icons/business/divar.svg"
  },
  "/icons/business/etsy.svg": {
    "type": "image/svg+xml",
    "etag": "\"1764-+cqIV6xhV5Pz3OTH/y4JnAzKpuc\"",
    "mtime": "2025-11-26T22:47:34.087Z",
    "size": 5988,
    "path": "../public/icons/business/etsy.svg"
  },
  "/icons/business/linkumap.svg": {
    "type": "image/svg+xml",
    "etag": "\"d37-so90SP2nc6qUh0h4rJwD7hfT9io\"",
    "mtime": "2025-11-26T22:47:34.087Z",
    "size": 3383,
    "path": "../public/icons/business/linkumap.svg"
  },
  "/icons/business/microsoft-bookings.svg": {
    "type": "image/svg+xml",
    "etag": "\"729-Yv9Nw7umlftJOOHMnm/HgJGRKc0\"",
    "mtime": "2025-11-26T22:47:34.087Z",
    "size": 1833,
    "path": "../public/icons/business/microsoft-bookings.svg"
  },
  "/icons/business/review.svg": {
    "type": "image/svg+xml",
    "etag": "\"a77-G6UlSDmOcUcqwBIcDhXGs7isXqI\"",
    "mtime": "2025-11-26T22:47:34.087Z",
    "size": 2679,
    "path": "../public/icons/business/review.svg"
  },
  "/icons/business/snapp.svg": {
    "type": "image/svg+xml",
    "etag": "\"b0f-14U5MtLVVpCByZL7Tg5Lo9UrEKA\"",
    "mtime": "2025-11-26T22:47:34.090Z",
    "size": 2831,
    "path": "../public/icons/business/snapp.svg"
  },
  "/icons/business/square.svg": {
    "type": "image/svg+xml",
    "etag": "\"798-Lu4tNCLImQJBWpVNYexRaPqWV0U\"",
    "mtime": "2025-11-26T22:47:34.090Z",
    "size": 1944,
    "path": "../public/icons/business/square.svg"
  },
  "/icons/business/website.svg": {
    "type": "image/svg+xml",
    "etag": "\"57bb-7kYBS8Q2sDXT9cow3KIiZzSnUZE\"",
    "mtime": "2025-11-26T22:47:34.092Z",
    "size": 22459,
    "path": "../public/icons/business/website.svg"
  },
  "/icons/business/yelp.svg": {
    "type": "image/svg+xml",
    "etag": "\"2712-bF6vbfn/yXD1NCmXCHeDUj7DqjE\"",
    "mtime": "2025-11-26T22:47:34.094Z",
    "size": 10002,
    "path": "../public/icons/business/yelp.svg"
  },
  "/icons/business/zillow.svg": {
    "type": "image/svg+xml",
    "etag": "\"c8f-XDhUchvhT++sW99NHDg97hnZMmM\"",
    "mtime": "2025-11-26T22:47:34.094Z",
    "size": 3215,
    "path": "../public/icons/business/zillow.svg"
  },
  "/icons/contact/address.svg": {
    "type": "image/svg+xml",
    "etag": "\"8dd-ZoOym7Yv4TbmMPxOzanWYIQgthw\"",
    "mtime": "2025-11-26T22:47:34.099Z",
    "size": 2269,
    "path": "../public/icons/contact/address.svg"
  },
  "/icons/contact/call.svg": {
    "type": "image/svg+xml",
    "etag": "\"647-GtLpX+5z43g8qJk7xBcCNSYXaW4\"",
    "mtime": "2025-11-26T22:47:34.100Z",
    "size": 1607,
    "path": "../public/icons/contact/call.svg"
  },
  "/icons/contact/contactcard.svg": {
    "type": "image/svg+xml",
    "etag": "\"1708c-5EG5hSeOucDSNwGw8DkCjwNbvtA\"",
    "mtime": "2025-11-26T22:47:34.102Z",
    "size": 94348,
    "path": "../public/icons/contact/contactcard.svg"
  },
  "/icons/contact/email.svg": {
    "type": "image/svg+xml",
    "etag": "\"9b4-d5o9w2+vw3fjE+YCHc7+jCrsErU\"",
    "mtime": "2025-11-26T22:47:34.104Z",
    "size": 2484,
    "path": "../public/icons/contact/email.svg"
  },
  "/icons/contact/facetime.svg": {
    "type": "image/svg+xml",
    "etag": "\"68c-N2R0ozRVLpISIdfYMwrNG5VfyGg\"",
    "mtime": "2025-11-26T22:47:34.104Z",
    "size": 1676,
    "path": "../public/icons/contact/facetime.svg"
  },
  "/icons/contact/ita.svg": {
    "type": "image/svg+xml",
    "etag": "\"af0-w2UNsha7HaahHEv9YI40zYLe5YY\"",
    "mtime": "2025-11-26T22:47:34.104Z",
    "size": 2800,
    "path": "../public/icons/contact/ita.svg"
  },
  "/icons/contact/number.svg": {
    "type": "image/svg+xml",
    "etag": "\"616-pStKUBZR1CQ/UuDV/m5cUfhh0bE\"",
    "mtime": "2025-11-26T22:47:34.104Z",
    "size": 1558,
    "path": "../public/icons/contact/number.svg"
  },
  "/icons/contact/telegram.svg": {
    "type": "image/svg+xml",
    "etag": "\"b29-KsTRfNmflze2Xq32pXox+HZPqp8\"",
    "mtime": "2025-11-26T22:47:34.107Z",
    "size": 2857,
    "path": "../public/icons/contact/telegram.svg"
  },
  "/icons/contact/whatsapp.svg": {
    "type": "image/svg+xml",
    "etag": "\"8c9-4A+wHV/Nsi/IVAizV+1J3KLpRlg\"",
    "mtime": "2025-11-26T22:47:34.110Z",
    "size": 2249,
    "path": "../public/icons/contact/whatsapp.svg"
  },
  "/icons/club/form.svg": {
    "type": "image/svg+xml",
    "etag": "\"8c1-RvpqxcR44zAFhXzqdtZq7OgWWF8\"",
    "mtime": "2025-11-26T22:47:34.094Z",
    "size": 2241,
    "path": "../public/icons/club/form.svg"
  },
  "/icons/club/luckydice.svg": {
    "type": "image/svg+xml",
    "etag": "\"9e9-5YCKpGvPdFBydDOVh1hAsg/waQQ\"",
    "mtime": "2025-11-26T22:47:34.094Z",
    "size": 2537,
    "path": "../public/icons/club/luckydice.svg"
  },
  "/icons/club/luckyegg.svg": {
    "type": "image/svg+xml",
    "etag": "\"d2b-xE+xd0bmr7MMu8np3FE2r8KEtEE\"",
    "mtime": "2025-11-26T22:47:34.094Z",
    "size": 3371,
    "path": "../public/icons/club/luckyegg.svg"
  },
  "/icons/club/luckywheel.svg": {
    "type": "image/svg+xml",
    "etag": "\"c64-n3G+zTp9/6uugV5EUilJ/EwXiJs\"",
    "mtime": "2025-11-26T22:47:34.094Z",
    "size": 3172,
    "path": "../public/icons/club/luckywheel.svg"
  },
  "/icons/content/dropDown.svg": {
    "type": "image/svg+xml",
    "etag": "\"5be-6Hz1dbhwgXuikz3MAUqvK11mJ7s\"",
    "mtime": "2025-11-26T22:47:34.111Z",
    "size": 1470,
    "path": "../public/icons/content/dropDown.svg"
  },
  "/icons/content/file.svg": {
    "type": "image/svg+xml",
    "etag": "\"80c-7f79V5eX2qyRgB/XE5tNo42udcY\"",
    "mtime": "2025-11-26T22:47:34.112Z",
    "size": 2060,
    "path": "../public/icons/content/file.svg"
  },
  "/icons/content/poll.svg": {
    "type": "image/svg+xml",
    "etag": "\"9c5-kz/XpAPqpD+2eaNSyzNJRW40UYc\"",
    "mtime": "2025-11-26T22:47:34.113Z",
    "size": 2501,
    "path": "../public/icons/content/poll.svg"
  },
  "/icons/content/questionbox.svg": {
    "type": "image/svg+xml",
    "etag": "\"5fb-fMHnNNjLyiTXs5vsenL3NqOa3/4\"",
    "mtime": "2025-11-26T22:47:34.113Z",
    "size": 1531,
    "path": "../public/icons/content/questionbox.svg"
  },
  "/icons/content/textSection.svg": {
    "type": "image/svg+xml",
    "etag": "\"692-/yZyHMD0+G977G6zUCrkm+2hP6Q\"",
    "mtime": "2025-11-26T22:47:34.114Z",
    "size": 1682,
    "path": "../public/icons/content/textSection.svg"
  },
  "/icons/content/video.svg": {
    "type": "image/svg+xml",
    "etag": "\"45e-pSoDoYvY5+ptAjZSghUt3eBjvQs\"",
    "mtime": "2025-11-26T22:47:34.115Z",
    "size": 1118,
    "path": "../public/icons/content/video.svg"
  },
  "/icons/more/balad.svg": {
    "type": "image/svg+xml",
    "etag": "\"b40-uN4zV063w7wSZOfDBvrFDoGZb7c\"",
    "mtime": "2025-11-26T22:47:34.119Z",
    "size": 2880,
    "path": "../public/icons/more/balad.svg"
  },
  "/icons/more/bale.svg": {
    "type": "image/svg+xml",
    "etag": "\"c2b-ymJx7ppIkbGTq3r81qJpKsstbKY\"",
    "mtime": "2025-11-26T22:47:34.120Z",
    "size": 3115,
    "path": "../public/icons/more/bale.svg"
  },
  "/icons/more/customlink.svg": {
    "type": "image/svg+xml",
    "etag": "\"c5e-eddOJt1dsAhAhrO01i9dDMAjbVo\"",
    "mtime": "2025-11-26T22:47:34.121Z",
    "size": 3166,
    "path": "../public/icons/more/customlink.svg"
  },
  "/icons/more/discord.svg": {
    "type": "image/svg+xml",
    "etag": "\"bcf-7CY/LATIbk7JCcLO7IxgIQVjKvA\"",
    "mtime": "2025-11-26T22:47:34.122Z",
    "size": 3023,
    "path": "../public/icons/more/discord.svg"
  },
  "/icons/more/featured.svg": {
    "type": "image/svg+xml",
    "etag": "\"8a0-nkOHeb3rQGSbr3C54UVtugtzkiU\"",
    "mtime": "2025-11-26T22:47:34.122Z",
    "size": 2208,
    "path": "../public/icons/more/featured.svg"
  },
  "/icons/more/figma.svg": {
    "type": "image/svg+xml",
    "etag": "\"ea1-/gh03xRj5XJ5xBp0CaYcKsTeMUk\"",
    "mtime": "2025-11-26T22:47:34.123Z",
    "size": 3745,
    "path": "../public/icons/more/figma.svg"
  },
  "/icons/more/github.svg": {
    "type": "image/svg+xml",
    "etag": "\"63e-myhdcMAokYrGS3YXNj6c/0BtCxg\"",
    "mtime": "2025-11-26T22:47:34.124Z",
    "size": 1598,
    "path": "../public/icons/more/github.svg"
  },
  "/icons/more/googlemeet.svg": {
    "type": "image/svg+xml",
    "etag": "\"5c6-71ydbv1dTLgWhRegB0sTjVJWKio\"",
    "mtime": "2025-11-26T22:47:34.125Z",
    "size": 1478,
    "path": "../public/icons/more/googlemeet.svg"
  },
  "/icons/more/hoobe.svg": {
    "type": "image/svg+xml",
    "etag": "\"982-xaqXmuJGBGimAB6xKvMAu/ugxqc\"",
    "mtime": "2025-11-26T22:47:34.126Z",
    "size": 2434,
    "path": "../public/icons/more/hoobe.svg"
  },
  "/icons/more/igap.svg": {
    "type": "image/svg+xml",
    "etag": "\"947-wsPtk2YBDSmplCH9colVPe6Y3+U\"",
    "mtime": "2025-11-26T22:47:34.127Z",
    "size": 2375,
    "path": "../public/icons/more/igap.svg"
  },
  "/icons/more/linktree.svg": {
    "type": "image/svg+xml",
    "etag": "\"7e6-cmbI+JNvs3Qdovvu+ShWjrEzyDg\"",
    "mtime": "2025-11-26T22:47:34.127Z",
    "size": 2022,
    "path": "../public/icons/more/linktree.svg"
  },
  "/icons/more/linkuLogoBlack.svg": {
    "type": "image/svg+xml",
    "etag": "\"e78-F2V/dAlvjBnRbckMXCDvYfw7w/g\"",
    "mtime": "2025-11-26T22:47:34.128Z",
    "size": 3704,
    "path": "../public/icons/more/linkuLogoBlack.svg"
  },
  "/icons/more/linkuLogoWhite.svg": {
    "type": "image/svg+xml",
    "etag": "\"10b1-A+E3yQzI22BpYZ2l6vCm46WTpOo\"",
    "mtime": "2025-11-26T22:47:34.129Z",
    "size": 4273,
    "path": "../public/icons/more/linkuLogoWhite.svg"
  },
  "/icons/more/medium.svg": {
    "type": "image/svg+xml",
    "etag": "\"201-D9IxTmOs0TnVEdW303o+U4DsHwo\"",
    "mtime": "2025-11-26T22:47:34.131Z",
    "size": 513,
    "path": "../public/icons/more/medium.svg"
  },
  "/icons/more/neshan.svg": {
    "type": "image/svg+xml",
    "etag": "\"1231-kA7Sdx+W6NZTD60JD0JELNA/fRI\"",
    "mtime": "2025-11-26T22:47:34.131Z",
    "size": 4657,
    "path": "../public/icons/more/neshan.svg"
  },
  "/icons/more/opensea.svg": {
    "type": "image/svg+xml",
    "etag": "\"1167-IrbrONxjE4dNMj1jRahbklOL8+8\"",
    "mtime": "2025-11-26T22:47:34.131Z",
    "size": 4455,
    "path": "../public/icons/more/opensea.svg"
  },
  "/icons/more/opensea_color.svg": {
    "type": "image/svg+xml",
    "etag": "\"11a0-DHP6N+RJwVBjdZE34TVaN+nyTjk\"",
    "mtime": "2025-11-26T22:47:34.131Z",
    "size": 4512,
    "path": "../public/icons/more/opensea_color.svg"
  },
  "/icons/more/podcasts.svg": {
    "type": "image/svg+xml",
    "etag": "\"b38-tVoG2Fm5p8INZdP/0a6i0Py8oCQ\"",
    "mtime": "2025-11-26T22:47:34.131Z",
    "size": 2872,
    "path": "../public/icons/more/podcasts.svg"
  },
  "/icons/more/poshmark.svg": {
    "type": "image/svg+xml",
    "etag": "\"93e-FekXNlh49b3nD4xL1XkSd7Ny768\"",
    "mtime": "2025-11-26T22:47:34.131Z",
    "size": 2366,
    "path": "../public/icons/more/poshmark.svg"
  },
  "/icons/more/teams.svg": {
    "type": "image/svg+xml",
    "etag": "\"d03-Pt/B1hxNZAGg10k3IG9WlDb3wb0\"",
    "mtime": "2025-11-26T22:47:34.135Z",
    "size": 3331,
    "path": "../public/icons/more/teams.svg"
  },
  "/icons/more/trustpilot.svg": {
    "type": "image/svg+xml",
    "etag": "\"138-AHOeA5K87IuopY6j1LjiBldu5AA\"",
    "mtime": "2025-11-26T22:47:34.135Z",
    "size": 312,
    "path": "../public/icons/more/trustpilot.svg"
  },
  "/icons/more/virgool.svg": {
    "type": "image/svg+xml",
    "etag": "\"349-ifyrsGqLsX4vzBMxDGcusNZ/9GE\"",
    "mtime": "2025-11-26T22:47:34.136Z",
    "size": 841,
    "path": "../public/icons/more/virgool.svg"
  },
  "/icons/more/zoom.svg": {
    "type": "image/svg+xml",
    "etag": "\"1300-SBYKVsCGZey7QeNi4x5fCD9ymzY\"",
    "mtime": "2025-11-26T22:47:34.137Z",
    "size": 4864,
    "path": "../public/icons/more/zoom.svg"
  },
  "/icons/music/apple music.svg": {
    "type": "image/svg+xml",
    "etag": "\"fff-OfMCBlbKhz1nPxkkBX1tpdrAnrU\"",
    "mtime": "2025-11-26T22:47:34.138Z",
    "size": 4095,
    "path": "../public/icons/music/apple music.svg"
  },
  "/icons/music/apple.svg": {
    "type": "image/svg+xml",
    "etag": "\"bde-IHQnCqylXpvE0UVardMQ7StQGHk\"",
    "mtime": "2025-11-26T22:47:34.138Z",
    "size": 3038,
    "path": "../public/icons/music/apple.svg"
  },
  "/icons/music/spotufy.svg": {
    "type": "image/svg+xml",
    "etag": "\"cb8-ySJ1umvVyBCGvf57PEtw3sZeCDs\"",
    "mtime": "2025-11-26T22:47:34.138Z",
    "size": 3256,
    "path": "../public/icons/music/spotufy.svg"
  },
  "/icons/music/youtube music.svg": {
    "type": "image/svg+xml",
    "etag": "\"7cd-0pRhDaWGVVG2DlUfO/gLfbKG0iE\"",
    "mtime": "2025-11-26T22:47:34.138Z",
    "size": 1997,
    "path": "../public/icons/music/youtube music.svg"
  },
  "/icons/payments/cashapp.svg": {
    "type": "image/svg+xml",
    "etag": "\"78d-pQjry2Qapo66yoUnkY3d6aP3pS0\"",
    "mtime": "2025-11-26T22:47:34.143Z",
    "size": 1933,
    "path": "../public/icons/payments/cashapp.svg"
  },
  "/icons/payments/paypal.svg": {
    "type": "image/svg+xml",
    "etag": "\"856-hsFbwMVggf9cYpRVVNIApqIMCjg\"",
    "mtime": "2025-11-26T22:47:34.144Z",
    "size": 2134,
    "path": "../public/icons/payments/paypal.svg"
  },
  "/icons/payments/reymit.svg": {
    "type": "image/svg+xml",
    "etag": "\"45e-Q89mokZTyFbY6y1PNuu19l2cwo4\"",
    "mtime": "2025-11-26T22:47:34.145Z",
    "size": 1118,
    "path": "../public/icons/payments/reymit.svg"
  },
  "/icons/payments/trustwallet.svg": {
    "type": "image/svg+xml",
    "etag": "\"5a2-wwknPEw3OLAuDWSM5CVN3HRikhU\"",
    "mtime": "2025-11-26T22:47:34.145Z",
    "size": 1442,
    "path": "../public/icons/payments/trustwallet.svg"
  },
  "/icons/payments/zarinpal.svg": {
    "type": "image/svg+xml",
    "etag": "\"569-NZGmcALjcR0CmfwehdgQ0UzquY8\"",
    "mtime": "2025-11-26T22:47:34.145Z",
    "size": 1385,
    "path": "../public/icons/payments/zarinpal.svg"
  },
  "/icons/payments/zelle.svg": {
    "type": "image/svg+xml",
    "etag": "\"18c4-zoMJbC2E0BHNi/FdFHXOw5zoUWg\"",
    "mtime": "2025-11-26T22:47:34.148Z",
    "size": 6340,
    "path": "../public/icons/payments/zelle.svg"
  },
  "/icons/social/aparat.svg": {
    "type": "image/svg+xml",
    "etag": "\"4af-VwEDXEiLlLjd19DPaQvg3JHD6wc\"",
    "mtime": "2025-11-26T22:47:34.149Z",
    "size": 1199,
    "path": "../public/icons/social/aparat.svg"
  },
  "/icons/social/clubhouse.svg": {
    "type": "image/svg+xml",
    "etag": "\"1821-Iu7vxZOShyGd7TXz38paDcKlNtU\"",
    "mtime": "2025-11-26T22:47:34.150Z",
    "size": 6177,
    "path": "../public/icons/social/clubhouse.svg"
  },
  "/icons/social/facebook.svg": {
    "type": "image/svg+xml",
    "etag": "\"313-cHdek5Yfp/0kNKI+8B5MFiVNOZs\"",
    "mtime": "2025-11-26T22:47:34.151Z",
    "size": 787,
    "path": "../public/icons/social/facebook.svg"
  },
  "/icons/social/instagram.svg": {
    "type": "image/svg+xml",
    "etag": "\"f11-M4kIUEjSWN4oWQPPT7dfFVnqHE4\"",
    "mtime": "2025-11-26T22:47:34.151Z",
    "size": 3857,
    "path": "../public/icons/social/instagram.svg"
  },
  "/icons/social/linkedin.svg": {
    "type": "image/svg+xml",
    "etag": "\"768-aMJw5Sd5ri3Vi46x6WFZf19dXC8\"",
    "mtime": "2025-11-26T22:47:34.152Z",
    "size": 1896,
    "path": "../public/icons/social/linkedin.svg"
  },
  "/icons/social/pinterest.svg": {
    "type": "image/svg+xml",
    "etag": "\"65d-8DI1NvcidiS3u0ZuNkaryzf0WAk\"",
    "mtime": "2025-11-26T22:47:34.153Z",
    "size": 1629,
    "path": "../public/icons/social/pinterest.svg"
  },
  "/icons/social/rubika.svg": {
    "type": "image/svg+xml",
    "etag": "\"2241-ktnEyV8XsksC+Sj3k3TLrx4Zj8Y\"",
    "mtime": "2025-11-26T22:47:34.154Z",
    "size": 8769,
    "path": "../public/icons/social/rubika.svg"
  },
  "/icons/social/snapchat.svg": {
    "type": "image/svg+xml",
    "etag": "\"f46-hpWqSAZDOxkZZL2Fxy8+TmAH7qg\"",
    "mtime": "2025-11-26T22:47:34.154Z",
    "size": 3910,
    "path": "../public/icons/social/snapchat.svg"
  },
  "/icons/social/theards.svg": {
    "type": "image/svg+xml",
    "etag": "\"8da-3Xm6e3qaLlDlF1Z4CsJtqZ4sLhY\"",
    "mtime": "2025-11-26T22:47:34.156Z",
    "size": 2266,
    "path": "../public/icons/social/theards.svg"
  },
  "/icons/social/tiktok.svg": {
    "type": "image/svg+xml",
    "etag": "\"1b48-D8WNs+bSIpM7YC5cS0pXOQHw/ow\"",
    "mtime": "2025-11-26T22:47:34.157Z",
    "size": 6984,
    "path": "../public/icons/social/tiktok.svg"
  },
  "/icons/social/twitch.svg": {
    "type": "image/svg+xml",
    "etag": "\"186b-hOWzDob50xLhxAgRVGrPL1hpFE0\"",
    "mtime": "2025-11-26T22:47:34.157Z",
    "size": 6251,
    "path": "../public/icons/social/twitch.svg"
  },
  "/icons/social/x.svg": {
    "type": "image/svg+xml",
    "etag": "\"3a2-8pQ60DPZSATWWMsHX2aZL8UhFAc\"",
    "mtime": "2025-11-26T22:47:34.157Z",
    "size": 930,
    "path": "../public/icons/social/x.svg"
  },
  "/icons/social/youtube.svg": {
    "type": "image/svg+xml",
    "etag": "\"432-rPskagrA3HKKzuFiBUS0F88hWF8\"",
    "mtime": "2025-11-26T22:47:34.159Z",
    "size": 1074,
    "path": "../public/icons/social/youtube.svg"
  },
  "/shared/data/categories.json": {
    "type": "application/json",
    "etag": "\"9645-dMKp2+r/4baWZ2Vt20zy0gg3rvw\"",
    "mtime": "2025-11-26T22:47:34.194Z",
    "size": 38469,
    "path": "../public/shared/data/categories.json"
  },
  "/_nuxt/builds/latest.json": {
    "type": "application/json",
    "etag": "\"47-RDxHGrKeo59bnU1gyqGE9hjUeCA\"",
    "mtime": "2025-12-03T10:02:53.532Z",
    "size": 71,
    "path": "../public/_nuxt/builds/latest.json"
  },
  "/assets/images/avatars/avatar-1.png": {
    "type": "image/png",
    "etag": "\"34e7-Qg/OYbJEjJ6rXSVDWl5FigEfU7c\"",
    "mtime": "2025-11-26T22:47:33.452Z",
    "size": 13543,
    "path": "../public/assets/images/avatars/avatar-1.png"
  },
  "/assets/images/avatars/avatar-10.png": {
    "type": "image/png",
    "etag": "\"42d8-hLpem5dbxvE0TAHTMLv0n6q0odg\"",
    "mtime": "2025-11-26T22:47:33.453Z",
    "size": 17112,
    "path": "../public/assets/images/avatars/avatar-10.png"
  },
  "/assets/images/avatars/avatar-11.png": {
    "type": "image/png",
    "etag": "\"3678-wyoGv/oygEeeHTRxEZDLAABLm1o\"",
    "mtime": "2025-11-26T22:47:33.455Z",
    "size": 13944,
    "path": "../public/assets/images/avatars/avatar-11.png"
  },
  "/assets/images/avatars/avatar-12.png": {
    "type": "image/png",
    "etag": "\"3f19-xCuUQlj2tlQDnrEL7KwpBDY0FAw\"",
    "mtime": "2025-11-26T22:47:33.455Z",
    "size": 16153,
    "path": "../public/assets/images/avatars/avatar-12.png"
  },
  "/assets/images/avatars/avatar-13.png": {
    "type": "image/png",
    "etag": "\"3ea8-9BT3a5JpjOPXnDHGdxXA/IOXdxU\"",
    "mtime": "2025-11-26T22:47:33.456Z",
    "size": 16040,
    "path": "../public/assets/images/avatars/avatar-13.png"
  },
  "/assets/images/avatars/avatar-14.png": {
    "type": "image/png",
    "etag": "\"3d9d-ILTbbH7GBgr5M1Li416dOwyXp+0\"",
    "mtime": "2025-11-26T22:47:33.457Z",
    "size": 15773,
    "path": "../public/assets/images/avatars/avatar-14.png"
  },
  "/assets/images/avatars/avatar-15.png": {
    "type": "image/png",
    "etag": "\"3dec-NJBq4h8ArxxRuB1W1mkWR9wXm1U\"",
    "mtime": "2025-11-26T22:47:33.458Z",
    "size": 15852,
    "path": "../public/assets/images/avatars/avatar-15.png"
  },
  "/assets/images/avatars/avatar-2.png": {
    "type": "image/png",
    "etag": "\"3d63-eZjud8YlKt7rGLY1XVUKpNU9PZY\"",
    "mtime": "2025-11-26T22:47:33.459Z",
    "size": 15715,
    "path": "../public/assets/images/avatars/avatar-2.png"
  },
  "/assets/images/avatars/avatar-3.png": {
    "type": "image/png",
    "etag": "\"38fe-VScTNUFqSGRksIe6GQMsGcEFYH8\"",
    "mtime": "2025-11-26T22:47:33.460Z",
    "size": 14590,
    "path": "../public/assets/images/avatars/avatar-3.png"
  },
  "/assets/images/avatars/avatar-4.png": {
    "type": "image/png",
    "etag": "\"3c82-lq42OCfWyrAnlFokIiKP4Tl1u+g\"",
    "mtime": "2025-11-26T22:47:33.461Z",
    "size": 15490,
    "path": "../public/assets/images/avatars/avatar-4.png"
  },
  "/assets/images/avatars/avatar-5.png": {
    "type": "image/png",
    "etag": "\"39cf-6kSELKGdpd7ryxO7gIik2XYqqQA\"",
    "mtime": "2025-11-26T22:47:33.462Z",
    "size": 14799,
    "path": "../public/assets/images/avatars/avatar-5.png"
  },
  "/assets/images/avatars/avatar-6.png": {
    "type": "image/png",
    "etag": "\"3f95-Y0Io0NlU0qY/yxy2Wszv7FDuFeE\"",
    "mtime": "2025-11-26T22:47:33.463Z",
    "size": 16277,
    "path": "../public/assets/images/avatars/avatar-6.png"
  },
  "/assets/images/avatars/avatar-7.png": {
    "type": "image/png",
    "etag": "\"35f7-5gJXh4T2cPcXo8rn+pMx94vUJ04\"",
    "mtime": "2025-11-26T22:47:33.464Z",
    "size": 13815,
    "path": "../public/assets/images/avatars/avatar-7.png"
  },
  "/assets/images/avatars/avatar-8.png": {
    "type": "image/png",
    "etag": "\"3ff8-w370gmk/X9jvTcpsLGgKbM0BZxQ\"",
    "mtime": "2025-11-26T22:47:33.465Z",
    "size": 16376,
    "path": "../public/assets/images/avatars/avatar-8.png"
  },
  "/assets/images/avatars/avatar-9.png": {
    "type": "image/png",
    "etag": "\"4655-FIsabQfFDNsSi8jhn3ffc8YuK+g\"",
    "mtime": "2025-11-26T22:47:33.466Z",
    "size": 18005,
    "path": "../public/assets/images/avatars/avatar-9.png"
  },
  "/assets/images/cards/logo-mastercard-small.png": {
    "type": "image/png",
    "etag": "\"be8-gPEgIxHNff/gYJNEEId7kUgf/to\"",
    "mtime": "2025-11-26T22:47:33.526Z",
    "size": 3048,
    "path": "../public/assets/images/cards/logo-mastercard-small.png"
  },
  "/assets/images/cards/paypal-primary.png": {
    "type": "image/png",
    "etag": "\"2a1-KBTX5UE4tpt8FpJbR4DeSsmfIUk\"",
    "mtime": "2025-11-26T22:47:33.526Z",
    "size": 673,
    "path": "../public/assets/images/cards/paypal-primary.png"
  },
  "/assets/images/cards/paypal-rounded.png": {
    "type": "image/png",
    "etag": "\"39c-s0u7iBZoYK+Ax1/0Hy4JD9Sobqc\"",
    "mtime": "2025-11-26T22:47:33.527Z",
    "size": 924,
    "path": "../public/assets/images/cards/paypal-rounded.png"
  },
  "/assets/images/banner/banner-1.jpg": {
    "type": "image/jpeg",
    "etag": "\"14a54-0tfln7pmzK+iZK7SB1gCt0OUQHA\"",
    "mtime": "2025-11-26T22:47:33.468Z",
    "size": 84564,
    "path": "../public/assets/images/banner/banner-1.jpg"
  },
  "/assets/images/banner/banner-10.jpg": {
    "type": "image/jpeg",
    "etag": "\"181b3-7jm61rAmpPR+MSomp582/s7dCvY\"",
    "mtime": "2025-11-26T22:47:33.470Z",
    "size": 98739,
    "path": "../public/assets/images/banner/banner-10.jpg"
  },
  "/assets/images/banner/banner-11.jpg": {
    "type": "image/jpeg",
    "etag": "\"e607-s3x5Ehfm1N6mBAVu5AhtV6mutKQ\"",
    "mtime": "2025-11-26T22:47:33.471Z",
    "size": 58887,
    "path": "../public/assets/images/banner/banner-11.jpg"
  },
  "/assets/images/banner/banner-12.jpg": {
    "type": "image/jpeg",
    "etag": "\"da52-nXHjxVdkO46oFrhUoMECg59+/ko\"",
    "mtime": "2025-11-26T22:47:33.473Z",
    "size": 55890,
    "path": "../public/assets/images/banner/banner-12.jpg"
  },
  "/assets/images/banner/banner-13.jpg": {
    "type": "image/jpeg",
    "etag": "\"11ce4-xnkKdw0gKFEkeu8jbrniN/HRDcQ\"",
    "mtime": "2025-11-26T22:47:33.474Z",
    "size": 72932,
    "path": "../public/assets/images/banner/banner-13.jpg"
  },
  "/assets/images/banner/banner-14.jpg": {
    "type": "image/jpeg",
    "etag": "\"145c0-mrY9RAI+dE5Xztlu20j56ZCkFGA\"",
    "mtime": "2025-11-26T22:47:33.476Z",
    "size": 83392,
    "path": "../public/assets/images/banner/banner-14.jpg"
  },
  "/assets/images/banner/banner-15.jpg": {
    "type": "image/jpeg",
    "etag": "\"11fee-YjtdjmkAf5TsReI4D4bpI4JHv7E\"",
    "mtime": "2025-11-26T22:47:33.478Z",
    "size": 73710,
    "path": "../public/assets/images/banner/banner-15.jpg"
  },
  "/assets/images/banner/banner-16.jpg": {
    "type": "image/jpeg",
    "etag": "\"11bd8-2nT3S9ZrBFkOI316PDqPLCVHDQ8\"",
    "mtime": "2025-11-26T22:47:33.479Z",
    "size": 72664,
    "path": "../public/assets/images/banner/banner-16.jpg"
  },
  "/assets/images/banner/banner-17.jpg": {
    "type": "image/jpeg",
    "etag": "\"16bc8-29FHHUe97eEmxXGmtXv6Km1PbC8\"",
    "mtime": "2025-11-26T22:47:33.481Z",
    "size": 93128,
    "path": "../public/assets/images/banner/banner-17.jpg"
  },
  "/assets/images/banner/banner-18.jpg": {
    "type": "image/jpeg",
    "etag": "\"1294b-U61UcIj3VLxPFlhTBBKxSHh0/vU\"",
    "mtime": "2025-11-26T22:47:33.483Z",
    "size": 76107,
    "path": "../public/assets/images/banner/banner-18.jpg"
  },
  "/assets/images/banner/banner-19.jpg": {
    "type": "image/jpeg",
    "etag": "\"4650-r9D3JTH5hvGRuBVAEOotD99nQhg\"",
    "mtime": "2025-11-26T22:47:33.483Z",
    "size": 18000,
    "path": "../public/assets/images/banner/banner-19.jpg"
  },
  "/assets/images/banner/banner-2.jpg": {
    "type": "image/jpeg",
    "etag": "\"e9f2-MIp7SCGMnVcyjNPeQ3BT1ZINBZo\"",
    "mtime": "2025-11-26T22:47:33.485Z",
    "size": 59890,
    "path": "../public/assets/images/banner/banner-2.jpg"
  },
  "/assets/images/banner/banner-20.jpg": {
    "type": "image/jpeg",
    "etag": "\"b9bf-VVd/ZZL1/M9GTd3fnP7bMj4r2E8\"",
    "mtime": "2025-11-26T22:47:33.486Z",
    "size": 47551,
    "path": "../public/assets/images/banner/banner-20.jpg"
  },
  "/assets/images/banner/banner-21.jpg": {
    "type": "image/jpeg",
    "etag": "\"7be9-wEXlRz/muvywjedAKEBv3zivgGc\"",
    "mtime": "2025-11-26T22:47:33.486Z",
    "size": 31721,
    "path": "../public/assets/images/banner/banner-21.jpg"
  },
  "/assets/images/banner/banner-22.jpg": {
    "type": "image/jpeg",
    "etag": "\"2ad6-LQHGCvTaR7BD3ezmOVZ57C2ZMX8\"",
    "mtime": "2025-11-26T22:47:33.489Z",
    "size": 10966,
    "path": "../public/assets/images/banner/banner-22.jpg"
  },
  "/assets/images/banner/banner-23.jpg": {
    "type": "image/jpeg",
    "etag": "\"96e4-qOiUu6+6FwXriga3tkQ4u2FJCK0\"",
    "mtime": "2025-11-26T22:47:33.489Z",
    "size": 38628,
    "path": "../public/assets/images/banner/banner-23.jpg"
  },
  "/assets/images/banner/banner-24.jpg": {
    "type": "image/jpeg",
    "etag": "\"471d-uxNbPTETE2udOQtrL3CHBU8cMo8\"",
    "mtime": "2025-11-26T22:47:33.490Z",
    "size": 18205,
    "path": "../public/assets/images/banner/banner-24.jpg"
  },
  "/assets/images/banner/banner-25.jpg": {
    "type": "image/jpeg",
    "etag": "\"7e2c-NZ5iKqRE0UaRpa6SXp9w/9W9ub4\"",
    "mtime": "2025-11-26T22:47:33.491Z",
    "size": 32300,
    "path": "../public/assets/images/banner/banner-25.jpg"
  },
  "/assets/images/banner/banner-26.jpg": {
    "type": "image/jpeg",
    "etag": "\"6dbf-2Ivdk7k5/qYsqd2IxQLGltLByMI\"",
    "mtime": "2025-11-26T22:47:33.492Z",
    "size": 28095,
    "path": "../public/assets/images/banner/banner-26.jpg"
  },
  "/assets/images/banner/banner-27.jpg": {
    "type": "image/jpeg",
    "etag": "\"1841-SiTaEQR+WANPDPqziMJR/lQlyoE\"",
    "mtime": "2025-11-26T22:47:33.494Z",
    "size": 6209,
    "path": "../public/assets/images/banner/banner-27.jpg"
  },
  "/assets/images/banner/banner-28.jpg": {
    "type": "image/jpeg",
    "etag": "\"980e-Bj52f0dP5QJriyIEJDMHbGUJjYU\"",
    "mtime": "2025-11-26T22:47:33.495Z",
    "size": 38926,
    "path": "../public/assets/images/banner/banner-28.jpg"
  },
  "/assets/images/banner/banner-29.jpg": {
    "type": "image/jpeg",
    "etag": "\"2766-IDWp7q/NJMZCXH5WY6RHAmJPs48\"",
    "mtime": "2025-11-26T22:47:33.496Z",
    "size": 10086,
    "path": "../public/assets/images/banner/banner-29.jpg"
  },
  "/assets/images/banner/banner-3.jpg": {
    "type": "image/jpeg",
    "etag": "\"14528-7GmBaSSb9HBI2pIxyKA7hKE/PnE\"",
    "mtime": "2025-11-26T22:47:33.497Z",
    "size": 83240,
    "path": "../public/assets/images/banner/banner-3.jpg"
  },
  "/assets/images/banner/banner-30.jpg": {
    "type": "image/jpeg",
    "etag": "\"fd29-Py6WjQ8+JnjoFrTQ1pJ79VPMoZE\"",
    "mtime": "2025-11-26T22:47:33.497Z",
    "size": 64809,
    "path": "../public/assets/images/banner/banner-30.jpg"
  },
  "/assets/images/banner/banner-31.jpg": {
    "type": "image/jpeg",
    "etag": "\"6fb1-wyuGmGf0KJZxCyNmxY1nvY6pylY\"",
    "mtime": "2025-11-26T22:47:33.497Z",
    "size": 28593,
    "path": "../public/assets/images/banner/banner-31.jpg"
  },
  "/assets/images/banner/banner-32.jpg": {
    "type": "image/jpeg",
    "etag": "\"2a71-683SiFuz/yOUka2kc5OUtLK5ZqY\"",
    "mtime": "2025-11-26T22:47:33.497Z",
    "size": 10865,
    "path": "../public/assets/images/banner/banner-32.jpg"
  },
  "/assets/images/banner/banner-33.jpg": {
    "type": "image/jpeg",
    "etag": "\"29ac-0fSQYsYQ514PpVgUQ8k78BSVlzg\"",
    "mtime": "2025-11-26T22:47:33.497Z",
    "size": 10668,
    "path": "../public/assets/images/banner/banner-33.jpg"
  },
  "/assets/images/banner/banner-34.jpg": {
    "type": "image/jpeg",
    "etag": "\"3833-U62XZAcogy/kPcIWHKcVJCMt+ss\"",
    "mtime": "2025-11-26T22:47:33.503Z",
    "size": 14387,
    "path": "../public/assets/images/banner/banner-34.jpg"
  },
  "/assets/images/banner/banner-35.jpg": {
    "type": "image/jpeg",
    "etag": "\"3318-+8EK5GmSbVCI4+f6GW4tZVxhtS4\"",
    "mtime": "2025-11-26T22:47:33.503Z",
    "size": 13080,
    "path": "../public/assets/images/banner/banner-35.jpg"
  },
  "/assets/images/banner/banner-36.jpg": {
    "type": "image/jpeg",
    "etag": "\"70cc-oi3R2FkDsSPkyzPAnR1fn5VQCag\"",
    "mtime": "2025-11-26T22:47:33.506Z",
    "size": 28876,
    "path": "../public/assets/images/banner/banner-36.jpg"
  },
  "/assets/images/banner/banner-37.jpg": {
    "type": "image/jpeg",
    "etag": "\"706d-Mn53BgY8x8orJuUS+R7q7UDt5u0\"",
    "mtime": "2025-11-26T22:47:33.507Z",
    "size": 28781,
    "path": "../public/assets/images/banner/banner-37.jpg"
  },
  "/assets/images/banner/banner-38.jpg": {
    "type": "image/jpeg",
    "etag": "\"1a86-2cPgA7FpSChcOBNtfjoRhOzVeMc\"",
    "mtime": "2025-11-26T22:47:33.508Z",
    "size": 6790,
    "path": "../public/assets/images/banner/banner-38.jpg"
  },
  "/assets/images/banner/banner-39.jpg": {
    "type": "image/jpeg",
    "etag": "\"79be-1EZnoW1qIeHbJRU+deiNxq1BTu0\"",
    "mtime": "2025-11-26T22:47:33.509Z",
    "size": 31166,
    "path": "../public/assets/images/banner/banner-39.jpg"
  },
  "/assets/images/banner/banner-4.jpg": {
    "type": "image/jpeg",
    "etag": "\"fb4c-5JqUb5rQ9fAOJ5gcTxb3sJ/4X4I\"",
    "mtime": "2025-11-26T22:47:33.511Z",
    "size": 64332,
    "path": "../public/assets/images/banner/banner-4.jpg"
  },
  "/assets/images/banner/banner-40.jpg": {
    "type": "image/jpeg",
    "etag": "\"2fe3-/1E59+mM4ICpHFa6Vb5H61YbXr4\"",
    "mtime": "2025-11-26T22:47:33.512Z",
    "size": 12259,
    "path": "../public/assets/images/banner/banner-40.jpg"
  },
  "/assets/images/banner/banner-5.jpg": {
    "type": "image/jpeg",
    "etag": "\"15545-xD+ggeDXyExPZcuMIYOfZnGyKok\"",
    "mtime": "2025-11-26T22:47:33.514Z",
    "size": 87365,
    "path": "../public/assets/images/banner/banner-5.jpg"
  },
  "/assets/images/banner/banner-6.jpg": {
    "type": "image/jpeg",
    "etag": "\"29ed-VuDIsqTj0R3aRYKSrVQ9P2sgw8Y\"",
    "mtime": "2025-11-26T22:47:33.515Z",
    "size": 10733,
    "path": "../public/assets/images/banner/banner-6.jpg"
  },
  "/assets/images/banner/banner-7.jpg": {
    "type": "image/jpeg",
    "etag": "\"e79f-C49p4QhciyZ/eKloYB10ov3Xe3E\"",
    "mtime": "2025-11-26T22:47:33.518Z",
    "size": 59295,
    "path": "../public/assets/images/banner/banner-7.jpg"
  },
  "/assets/images/banner/banner-8.jpg": {
    "type": "image/jpeg",
    "etag": "\"93c6-BeFvZPdr2BFIux4a+vSEuz4IU5M\"",
    "mtime": "2025-11-26T22:47:33.519Z",
    "size": 37830,
    "path": "../public/assets/images/banner/banner-8.jpg"
  },
  "/assets/images/banner/banner-9.jpg": {
    "type": "image/jpeg",
    "etag": "\"11c47-u1BHl7AwZ9Fkur0OAqsGI/42dSo\"",
    "mtime": "2025-11-26T22:47:33.521Z",
    "size": 72775,
    "path": "../public/assets/images/banner/banner-9.jpg"
  },
  "/assets/images/banner/banner.png": {
    "type": "image/png",
    "etag": "\"894d-8Z2QpKjpVcCy8PuKG8EosJq+Op0\"",
    "mtime": "2025-11-26T22:47:33.522Z",
    "size": 35149,
    "path": "../public/assets/images/banner/banner.png"
  },
  "/assets/images/banner/parallax-4.jpg": {
    "type": "image/jpeg",
    "etag": "\"834f-KGNkxX48xEcz2ea303AvLj8Voi4\"",
    "mtime": "2025-11-26T22:47:33.523Z",
    "size": 33615,
    "path": "../public/assets/images/banner/parallax-4.jpg"
  },
  "/assets/images/banner/upgrade.png": {
    "type": "image/png",
    "etag": "\"12ccd-FMCbLnt8OIDVtpZQdM0YIEP5Syc\"",
    "mtime": "2025-11-26T22:47:33.524Z",
    "size": 77005,
    "path": "../public/assets/images/banner/upgrade.png"
  },
  "/assets/images/eCommerce/1.png": {
    "type": "image/png",
    "etag": "\"caed-4HwcgBwzqDZkSvi2z5THiehyulQ\"",
    "mtime": "2025-11-26T22:47:33.540Z",
    "size": 51949,
    "path": "../public/assets/images/eCommerce/1.png"
  },
  "/assets/images/eCommerce/10.png": {
    "type": "image/png",
    "etag": "\"c078-ix3He9kENMq6xoBP8FzKn8ow/YA\"",
    "mtime": "2025-11-26T22:47:33.541Z",
    "size": 49272,
    "path": "../public/assets/images/eCommerce/10.png"
  },
  "/assets/images/eCommerce/11.png": {
    "type": "image/png",
    "etag": "\"eccb-LjsCZ6WDt+uY3RfSeec+unjv+ZM\"",
    "mtime": "2025-11-26T22:47:33.541Z",
    "size": 60619,
    "path": "../public/assets/images/eCommerce/11.png"
  },
  "/assets/images/eCommerce/12.png": {
    "type": "image/png",
    "etag": "\"10fde-uvMztayMLpCQgjHhpDrxpjZp6Lg\"",
    "mtime": "2025-11-26T22:47:33.541Z",
    "size": 69598,
    "path": "../public/assets/images/eCommerce/12.png"
  },
  "/assets/images/eCommerce/13.png": {
    "type": "image/png",
    "etag": "\"d7c7-1bE0vXUNX5G8elWGWkJKBQu47Rc\"",
    "mtime": "2025-11-26T22:47:33.545Z",
    "size": 55239,
    "path": "../public/assets/images/eCommerce/13.png"
  },
  "/assets/images/eCommerce/14.png": {
    "type": "image/png",
    "etag": "\"812d-GZN8NSPNS5s54Ah7RGCujb7LbQ8\"",
    "mtime": "2025-11-26T22:47:33.547Z",
    "size": 33069,
    "path": "../public/assets/images/eCommerce/14.png"
  },
  "/assets/images/eCommerce/15.png": {
    "type": "image/png",
    "etag": "\"c8d4-fhTKeH/7PQ/zXBsw9m/GHNHwkBA\"",
    "mtime": "2025-11-26T22:47:33.548Z",
    "size": 51412,
    "path": "../public/assets/images/eCommerce/15.png"
  },
  "/assets/images/eCommerce/16.png": {
    "type": "image/png",
    "etag": "\"cce5-0GrWc2DOLfKTcn3hNNnY2yXEvCI\"",
    "mtime": "2025-11-26T22:47:33.550Z",
    "size": 52453,
    "path": "../public/assets/images/eCommerce/16.png"
  },
  "/assets/images/eCommerce/17.png": {
    "type": "image/png",
    "etag": "\"a398-5N7X0OQAdJsWfvsCJvvR4rJHDjI\"",
    "mtime": "2025-11-26T22:47:33.551Z",
    "size": 41880,
    "path": "../public/assets/images/eCommerce/17.png"
  },
  "/assets/images/eCommerce/18.png": {
    "type": "image/png",
    "etag": "\"dbd7-Dz2cwgtk0r7yEElz0x8nf33BhEo\"",
    "mtime": "2025-11-26T22:47:33.552Z",
    "size": 56279,
    "path": "../public/assets/images/eCommerce/18.png"
  },
  "/assets/images/eCommerce/19.png": {
    "type": "image/png",
    "etag": "\"6c02-MLhUPmUXV53PDX9mG57HH6MuO4I\"",
    "mtime": "2025-11-26T22:47:33.553Z",
    "size": 27650,
    "path": "../public/assets/images/eCommerce/19.png"
  },
  "/assets/images/eCommerce/2.png": {
    "type": "image/png",
    "etag": "\"4117-HPjZme+g+ZfT9TGVr/PcobkEOUQ\"",
    "mtime": "2025-11-26T22:47:33.554Z",
    "size": 16663,
    "path": "../public/assets/images/eCommerce/2.png"
  },
  "/assets/images/eCommerce/20.png": {
    "type": "image/png",
    "etag": "\"8a1c-BCXbnmPxgtcRu7Ni0HgtoulITsA\"",
    "mtime": "2025-11-26T22:47:33.556Z",
    "size": 35356,
    "path": "../public/assets/images/eCommerce/20.png"
  },
  "/assets/images/eCommerce/21.png": {
    "type": "image/png",
    "etag": "\"10bef-HNpu1H00uaKyHRn5zmKfuxZ0Tsw\"",
    "mtime": "2025-11-26T22:47:33.558Z",
    "size": 68591,
    "path": "../public/assets/images/eCommerce/21.png"
  },
  "/assets/images/eCommerce/22.png": {
    "type": "image/png",
    "etag": "\"8c4f-Zqx+au9Npat5b4WsFexSYHOMi5I\"",
    "mtime": "2025-11-26T22:47:33.559Z",
    "size": 35919,
    "path": "../public/assets/images/eCommerce/22.png"
  },
  "/assets/images/eCommerce/23.png": {
    "type": "image/png",
    "etag": "\"73d6-j2QnvS1JPK4YoWOXykN8OT1D36c\"",
    "mtime": "2025-11-26T22:47:33.560Z",
    "size": 29654,
    "path": "../public/assets/images/eCommerce/23.png"
  },
  "/assets/images/eCommerce/24.png": {
    "type": "image/png",
    "etag": "\"e0cd-gHTqOeDA1KrUJvhajAtFJEAB+Pk\"",
    "mtime": "2025-11-26T22:47:33.561Z",
    "size": 57549,
    "path": "../public/assets/images/eCommerce/24.png"
  },
  "/assets/images/eCommerce/25.png": {
    "type": "image/png",
    "etag": "\"bba3-ezZdmLAbq3qI+ff0HEPBnbnvrYQ\"",
    "mtime": "2025-11-26T22:47:33.563Z",
    "size": 48035,
    "path": "../public/assets/images/eCommerce/25.png"
  },
  "/assets/images/eCommerce/26.png": {
    "type": "image/png",
    "etag": "\"99c6-EPTQFtHRXQuiV5m5sJAEkymQrFs\"",
    "mtime": "2025-11-26T22:47:33.564Z",
    "size": 39366,
    "path": "../public/assets/images/eCommerce/26.png"
  },
  "/assets/images/eCommerce/27.png": {
    "type": "image/png",
    "etag": "\"f561-OwF7FWgcvP4lT6AqptTWDHNs8UE\"",
    "mtime": "2025-11-26T22:47:33.564Z",
    "size": 62817,
    "path": "../public/assets/images/eCommerce/27.png"
  },
  "/assets/images/eCommerce/3.png": {
    "type": "image/png",
    "etag": "\"117b6-H0z2p8JwNSiJ0D6WPNean4cqFnk\"",
    "mtime": "2025-11-26T22:47:33.566Z",
    "size": 71606,
    "path": "../public/assets/images/eCommerce/3.png"
  },
  "/assets/images/eCommerce/4.png": {
    "type": "image/png",
    "etag": "\"af94-EHIAI5jEqjaPPCSNWn74y7wxruQ\"",
    "mtime": "2025-11-26T22:47:33.568Z",
    "size": 44948,
    "path": "../public/assets/images/eCommerce/4.png"
  },
  "/assets/images/eCommerce/5.png": {
    "type": "image/png",
    "etag": "\"ccca-WL/b5zfX1PzGtnKRoMa9vATDJTQ\"",
    "mtime": "2025-11-26T22:47:33.569Z",
    "size": 52426,
    "path": "../public/assets/images/eCommerce/5.png"
  },
  "/assets/images/eCommerce/6.png": {
    "type": "image/png",
    "etag": "\"cbc8-wN7LEawrhrz+c/IVip6rjy3nQt0\"",
    "mtime": "2025-11-26T22:47:33.571Z",
    "size": 52168,
    "path": "../public/assets/images/eCommerce/6.png"
  },
  "/assets/images/eCommerce/7.png": {
    "type": "image/png",
    "etag": "\"6dc5-yr7FLXZGvOU3XTYrzZJClKsiQwI\"",
    "mtime": "2025-11-26T22:47:33.572Z",
    "size": 28101,
    "path": "../public/assets/images/eCommerce/7.png"
  },
  "/assets/images/eCommerce/8.png": {
    "type": "image/png",
    "etag": "\"6fef-rPiHBf7QJaUklDqDdHws8uvWJrA\"",
    "mtime": "2025-11-26T22:47:33.573Z",
    "size": 28655,
    "path": "../public/assets/images/eCommerce/8.png"
  },
  "/assets/images/eCommerce/9.png": {
    "type": "image/png",
    "etag": "\"ac35-EJTgT7lNzJtforkPfBguLb7n7gE\"",
    "mtime": "2025-11-26T22:47:33.575Z",
    "size": 44085,
    "path": "../public/assets/images/eCommerce/9.png"
  },
  "/assets/images/eCommerce/amazon-echo-dot.png": {
    "type": "image/png",
    "etag": "\"1d10-nicU0JlAqrWe1zWFvue4ZhRzW70\"",
    "mtime": "2025-11-26T22:47:33.575Z",
    "size": 7440,
    "path": "../public/assets/images/eCommerce/amazon-echo-dot.png"
  },
  "/assets/images/eCommerce/apple-watch.png": {
    "type": "image/png",
    "etag": "\"14a6-9VwTf69/ruNLZ1z5jqa636AXzcc\"",
    "mtime": "2025-11-26T22:47:33.576Z",
    "size": 5286,
    "path": "../public/assets/images/eCommerce/apple-watch.png"
  },
  "/assets/images/eCommerce/headphone.png": {
    "type": "image/png",
    "etag": "\"222c-/6cb0BnUo/svjZ8YWJS+2c7QSmM\"",
    "mtime": "2025-11-26T22:47:33.577Z",
    "size": 8748,
    "path": "../public/assets/images/eCommerce/headphone.png"
  },
  "/assets/images/eCommerce/iphone.png": {
    "type": "image/png",
    "etag": "\"1ab5-csEzHHx979lRVDnhUVSVVr97l0E\"",
    "mtime": "2025-11-26T22:47:33.578Z",
    "size": 6837,
    "path": "../public/assets/images/eCommerce/iphone.png"
  },
  "/assets/images/eCommerce/nike.png": {
    "type": "image/png",
    "etag": "\"1b61-rwKAo+nHIveQao0TE5TbWbT5NDY\"",
    "mtime": "2025-11-26T22:47:33.579Z",
    "size": 7009,
    "path": "../public/assets/images/eCommerce/nike.png"
  },
  "/assets/images/eCommerce/rocket.png": {
    "type": "image/png",
    "etag": "\"4ab2-fw8w61T6hdVXNBk6ck4d6a0+oAI\"",
    "mtime": "2025-11-26T22:47:33.579Z",
    "size": 19122,
    "path": "../public/assets/images/eCommerce/rocket.png"
  },
  "/assets/images/eCommerce/sony-dualsense.png": {
    "type": "image/png",
    "etag": "\"194d-sy7GrkQ5ZCCaLu6o4yhys3nrsgE\"",
    "mtime": "2025-11-26T22:47:33.581Z",
    "size": 6477,
    "path": "../public/assets/images/eCommerce/sony-dualsense.png"
  },
  "/assets/images/ecommerce-images/product-1.png": {
    "type": "image/png",
    "etag": "\"2196-yotgE3vry6Rqn5W5PkoNNtiMHPA\"",
    "mtime": "2025-11-26T22:47:33.582Z",
    "size": 8598,
    "path": "../public/assets/images/ecommerce-images/product-1.png"
  },
  "/assets/images/ecommerce-images/product-10.png": {
    "type": "image/png",
    "etag": "\"1eee-9K2N311DspfxLAIweTiMCFSjo9E\"",
    "mtime": "2025-11-26T22:47:33.583Z",
    "size": 7918,
    "path": "../public/assets/images/ecommerce-images/product-10.png"
  },
  "/assets/images/ecommerce-images/product-11.png": {
    "type": "image/png",
    "etag": "\"1908-BNihk6MbzXDS/kSgjfE7QtLwFsY\"",
    "mtime": "2025-11-26T22:47:33.583Z",
    "size": 6408,
    "path": "../public/assets/images/ecommerce-images/product-11.png"
  },
  "/assets/images/ecommerce-images/product-12.png": {
    "type": "image/png",
    "etag": "\"1627-Xb50rPwftbFbNxPRBS9zXn3jktg\"",
    "mtime": "2025-11-26T22:47:33.586Z",
    "size": 5671,
    "path": "../public/assets/images/ecommerce-images/product-12.png"
  },
  "/assets/images/ecommerce-images/product-13.png": {
    "type": "image/png",
    "etag": "\"26c6-32yXlPOiuKhC/hjbPf+UuIP8sOE\"",
    "mtime": "2025-11-26T22:47:33.588Z",
    "size": 9926,
    "path": "../public/assets/images/ecommerce-images/product-13.png"
  },
  "/assets/images/ecommerce-images/product-14.png": {
    "type": "image/png",
    "etag": "\"18e9-zKVld1jl8sxG6X46sYo5KPB5X+s\"",
    "mtime": "2025-11-26T22:47:33.589Z",
    "size": 6377,
    "path": "../public/assets/images/ecommerce-images/product-14.png"
  },
  "/assets/images/ecommerce-images/product-15.png": {
    "type": "image/png",
    "etag": "\"1bcc-uPU4hJ8NS365mh1RavZDRqwLFH0\"",
    "mtime": "2025-11-26T22:47:33.590Z",
    "size": 7116,
    "path": "../public/assets/images/ecommerce-images/product-15.png"
  },
  "/assets/images/ecommerce-images/product-16.png": {
    "type": "image/png",
    "etag": "\"1d06-DZMxn9PxNVobM0KD2FVUxqHtReY\"",
    "mtime": "2025-11-26T22:47:33.591Z",
    "size": 7430,
    "path": "../public/assets/images/ecommerce-images/product-16.png"
  },
  "/assets/images/ecommerce-images/product-17.png": {
    "type": "image/png",
    "etag": "\"19ef-y6K2LoQgB24GSKm4P3otjm52cbg\"",
    "mtime": "2025-11-26T22:47:33.591Z",
    "size": 6639,
    "path": "../public/assets/images/ecommerce-images/product-17.png"
  },
  "/assets/images/ecommerce-images/product-18.png": {
    "type": "image/png",
    "etag": "\"2232-EAjtw5UaZTj0475ZyEj2T40T8j4\"",
    "mtime": "2025-11-26T22:47:33.593Z",
    "size": 8754,
    "path": "../public/assets/images/ecommerce-images/product-18.png"
  },
  "/assets/images/ecommerce-images/product-19.png": {
    "type": "image/png",
    "etag": "\"30d6-8lHP0yxybEntY5kFvMG8wOsSaCM\"",
    "mtime": "2025-11-26T22:47:33.593Z",
    "size": 12502,
    "path": "../public/assets/images/ecommerce-images/product-19.png"
  },
  "/assets/images/ecommerce-images/product-2.png": {
    "type": "image/png",
    "etag": "\"258f-KWYHshyyLHHavFcpb13OEM3TAUU\"",
    "mtime": "2025-11-26T22:47:33.595Z",
    "size": 9615,
    "path": "../public/assets/images/ecommerce-images/product-2.png"
  },
  "/assets/images/ecommerce-images/product-20.png": {
    "type": "image/png",
    "etag": "\"1936-pSyHDiL73bgmNbW428khTP/WJE0\"",
    "mtime": "2025-11-26T22:47:33.596Z",
    "size": 6454,
    "path": "../public/assets/images/ecommerce-images/product-20.png"
  },
  "/assets/images/ecommerce-images/product-21.png": {
    "type": "image/png",
    "etag": "\"938-XO7H1lmVTnlGE4e/YFXrb1bVAcQ\"",
    "mtime": "2025-11-26T22:47:33.597Z",
    "size": 2360,
    "path": "../public/assets/images/ecommerce-images/product-21.png"
  },
  "/assets/images/ecommerce-images/product-22.png": {
    "type": "image/png",
    "etag": "\"4a9-wIlPgfVnoRPHJSYO+zoTS+Kl824\"",
    "mtime": "2025-11-26T22:47:33.598Z",
    "size": 1193,
    "path": "../public/assets/images/ecommerce-images/product-22.png"
  },
  "/assets/images/ecommerce-images/product-23.png": {
    "type": "image/png",
    "etag": "\"59c-B5xlCUlKOchW1fZ6mENa3cC2qbY\"",
    "mtime": "2025-11-26T22:47:33.599Z",
    "size": 1436,
    "path": "../public/assets/images/ecommerce-images/product-23.png"
  },
  "/assets/images/ecommerce-images/product-24.png": {
    "type": "image/png",
    "etag": "\"606-VyiQtVFkitIiVgO5QxUxYX//tOg\"",
    "mtime": "2025-11-26T22:47:33.600Z",
    "size": 1542,
    "path": "../public/assets/images/ecommerce-images/product-24.png"
  },
  "/assets/images/ecommerce-images/product-25.png": {
    "type": "image/png",
    "etag": "\"13cf-FmRQ+eQBsTLZ3ySc8eEFLEEIWqI\"",
    "mtime": "2025-11-26T22:47:33.601Z",
    "size": 5071,
    "path": "../public/assets/images/ecommerce-images/product-25.png"
  },
  "/assets/images/ecommerce-images/product-26.png": {
    "type": "image/png",
    "etag": "\"166a-bq1d5q30Um+cqvzmaqREimO3kN4\"",
    "mtime": "2025-11-26T22:47:33.601Z",
    "size": 5738,
    "path": "../public/assets/images/ecommerce-images/product-26.png"
  },
  "/assets/images/ecommerce-images/product-27.png": {
    "type": "image/png",
    "etag": "\"10b5-wESdPySK3WtruMX2cX0uc0vMb28\"",
    "mtime": "2025-11-26T22:47:33.601Z",
    "size": 4277,
    "path": "../public/assets/images/ecommerce-images/product-27.png"
  },
  "/assets/images/ecommerce-images/product-28.png": {
    "type": "image/png",
    "etag": "\"1afd-PV96jTnDK2b+EbgfGao78YVMZr0\"",
    "mtime": "2025-11-26T22:47:33.601Z",
    "size": 6909,
    "path": "../public/assets/images/ecommerce-images/product-28.png"
  },
  "/assets/images/ecommerce-images/product-29.png": {
    "type": "image/png",
    "etag": "\"1793-e0nUqOlzlv2AsVKNcNzFXDNXVic\"",
    "mtime": "2025-11-26T22:47:33.603Z",
    "size": 6035,
    "path": "../public/assets/images/ecommerce-images/product-29.png"
  },
  "/assets/images/ecommerce-images/product-3.png": {
    "type": "image/png",
    "etag": "\"191a-c2b0HldzqBQHwpM1BUwF3FBq21Y\"",
    "mtime": "2025-11-26T22:47:33.603Z",
    "size": 6426,
    "path": "../public/assets/images/ecommerce-images/product-3.png"
  },
  "/assets/images/ecommerce-images/product-30.png": {
    "type": "image/png",
    "etag": "\"1d32-vv4YvbXV2ZmzaTAvkdHs3ldyLG0\"",
    "mtime": "2025-11-26T22:47:33.603Z",
    "size": 7474,
    "path": "../public/assets/images/ecommerce-images/product-30.png"
  },
  "/assets/images/ecommerce-images/product-4.png": {
    "type": "image/png",
    "etag": "\"26a4-o8sZLzbxdTDm4G1ztyj6Y9iHtzE\"",
    "mtime": "2025-11-26T22:47:33.603Z",
    "size": 9892,
    "path": "../public/assets/images/ecommerce-images/product-4.png"
  },
  "/assets/images/ecommerce-images/product-5.png": {
    "type": "image/png",
    "etag": "\"1ef2-EwnHtHsh6siMur/ZbOKf9Jx1Os8\"",
    "mtime": "2025-11-26T22:47:33.603Z",
    "size": 7922,
    "path": "../public/assets/images/ecommerce-images/product-5.png"
  },
  "/assets/images/ecommerce-images/product-6.png": {
    "type": "image/png",
    "etag": "\"1453-2e9qUegyTncD8Q6rZFNR8gTb5t4\"",
    "mtime": "2025-11-26T22:47:33.607Z",
    "size": 5203,
    "path": "../public/assets/images/ecommerce-images/product-6.png"
  },
  "/assets/images/ecommerce-images/product-7.png": {
    "type": "image/png",
    "etag": "\"1bf2-9F11TJ7dXylB7TvMfU5FRLzhYGM\"",
    "mtime": "2025-11-26T22:47:33.609Z",
    "size": 7154,
    "path": "../public/assets/images/ecommerce-images/product-7.png"
  },
  "/assets/images/ecommerce-images/product-8.png": {
    "type": "image/png",
    "etag": "\"2223-n+khDCk6zeDJxVC1+0iWsXIeNHM\"",
    "mtime": "2025-11-26T22:47:33.610Z",
    "size": 8739,
    "path": "../public/assets/images/ecommerce-images/product-8.png"
  },
  "/assets/images/ecommerce-images/product-9.png": {
    "type": "image/png",
    "etag": "\"1b12-XWfi/qSVxwlcC0DFTMgdmuekoSM\"",
    "mtime": "2025-11-26T22:47:33.611Z",
    "size": 6930,
    "path": "../public/assets/images/ecommerce-images/product-9.png"
  },
  "/assets/images/customizer-icons/border-light.svg": {
    "type": "image/svg+xml",
    "etag": "\"69b-xLcfS1lPTa0L/Mgck2mRnvERCx4\"",
    "mtime": "2025-11-26T22:47:33.531Z",
    "size": 1691,
    "path": "../public/assets/images/customizer-icons/border-light.svg"
  },
  "/assets/images/customizer-icons/collapsed-light.svg": {
    "type": "image/svg+xml",
    "etag": "\"702-qGLIEIMegcsVj3xZAuLzjPJHGHg\"",
    "mtime": "2025-11-26T22:47:33.531Z",
    "size": 1794,
    "path": "../public/assets/images/customizer-icons/collapsed-light.svg"
  },
  "/assets/images/customizer-icons/compact-light.svg": {
    "type": "image/svg+xml",
    "etag": "\"434-44/DUIRvo5EflXgbFuRCn8fVEPI\"",
    "mtime": "2025-11-26T22:47:33.532Z",
    "size": 1076,
    "path": "../public/assets/images/customizer-icons/compact-light.svg"
  },
  "/assets/images/customizer-icons/default-light.svg": {
    "type": "image/svg+xml",
    "etag": "\"702-QU2bDP7dod+UC5NKxGz+NdjtBs4\"",
    "mtime": "2025-11-26T22:47:33.534Z",
    "size": 1794,
    "path": "../public/assets/images/customizer-icons/default-light.svg"
  },
  "/assets/images/customizer-icons/horizontal-light.svg": {
    "type": "image/svg+xml",
    "etag": "\"4cd-v0PB/j16uyCJUWoPWSOo5HoF9uo\"",
    "mtime": "2025-11-26T22:47:33.534Z",
    "size": 1229,
    "path": "../public/assets/images/customizer-icons/horizontal-light.svg"
  },
  "/assets/images/customizer-icons/ltr-light.svg": {
    "type": "image/svg+xml",
    "etag": "\"648-4eh0TBJvRTQQmHNG5GWpFZf7ZzY\"",
    "mtime": "2025-11-26T22:47:33.534Z",
    "size": 1608,
    "path": "../public/assets/images/customizer-icons/ltr-light.svg"
  },
  "/assets/images/customizer-icons/rtl-light.svg": {
    "type": "image/svg+xml",
    "etag": "\"648-1TToaZQAij812FpnVON1ta81cPI\"",
    "mtime": "2025-11-26T22:47:33.534Z",
    "size": 1608,
    "path": "../public/assets/images/customizer-icons/rtl-light.svg"
  },
  "/assets/images/customizer-icons/wide-light.svg": {
    "type": "image/svg+xml",
    "etag": "\"430-fEVJ2QRXZLv4JBu7umY2JoJGLeg\"",
    "mtime": "2025-11-26T22:47:33.537Z",
    "size": 1072,
    "path": "../public/assets/images/customizer-icons/wide-light.svg"
  },
  "/assets/images/illustrations/boy-app-academy.png": {
    "type": "image/png",
    "etag": "\"99d1-psG/81/AX81g1lQslmJ6VIPx/us\"",
    "mtime": "2025-11-26T22:47:33.766Z",
    "size": 39377,
    "path": "../public/assets/images/illustrations/boy-app-academy.png"
  },
  "/assets/images/illustrations/congo-illustration.png": {
    "type": "image/png",
    "etag": "\"3994-eLm5hBtUOhtDFy631VzzayE6Xuk\"",
    "mtime": "2025-11-26T22:47:33.767Z",
    "size": 14740,
    "path": "../public/assets/images/illustrations/congo-illustration.png"
  },
  "/assets/images/illustrations/girl-app-academy.png": {
    "type": "image/png",
    "etag": "\"a3f7-IBJz7BuFHdeoDoJijMDpvtj36Xs\"",
    "mtime": "2025-11-26T22:47:33.769Z",
    "size": 41975,
    "path": "../public/assets/images/illustrations/girl-app-academy.png"
  },
  "/assets/images/illustrations/laptop-girl.png": {
    "type": "image/png",
    "etag": "\"aef9-wHiRr5UZhkUcMWAz2UaMxrYlyRU\"",
    "mtime": "2025-11-26T22:47:33.770Z",
    "size": 44793,
    "path": "../public/assets/images/illustrations/laptop-girl.png"
  },
  "/assets/images/illustrations/register-multi-step-illustration-dark.png": {
    "type": "image/png",
    "etag": "\"8155-moEtuVmaz7emqEMR+ejgrUYn7lo\"",
    "mtime": "2025-11-26T22:47:33.771Z",
    "size": 33109,
    "path": "../public/assets/images/illustrations/register-multi-step-illustration-dark.png"
  },
  "/assets/images/illustrations/register-multi-step-illustration-light.png": {
    "type": "image/png",
    "etag": "\"84e8-91gOn6kyQvr2M2uN2EbA4wQXMzQ\"",
    "mtime": "2025-11-26T22:47:33.771Z",
    "size": 34024,
    "path": "../public/assets/images/illustrations/register-multi-step-illustration-light.png"
  },
  "/assets/images/illustrations/sidebar-pic-1.png": {
    "type": "image/png",
    "etag": "\"5fdb-oTLaDAgL6RIUcMrim57jZ0r1sl8\"",
    "mtime": "2025-11-26T22:47:33.771Z",
    "size": 24539,
    "path": "../public/assets/images/illustrations/sidebar-pic-1.png"
  },
  "/assets/images/illustrations/sidebar-pic-2.png": {
    "type": "image/png",
    "etag": "\"9097-1YCTHs+eGF2xDibFZ3Hjl7WrGm0\"",
    "mtime": "2025-11-26T22:47:33.775Z",
    "size": 37015,
    "path": "../public/assets/images/illustrations/sidebar-pic-2.png"
  },
  "/assets/images/illustrations/sidebar-pic-3.png": {
    "type": "image/png",
    "etag": "\"6889-rSYrWsTU/6mhCzAvVQbk6QukEbA\"",
    "mtime": "2025-11-26T22:47:33.776Z",
    "size": 26761,
    "path": "../public/assets/images/illustrations/sidebar-pic-3.png"
  },
  "/assets/images/illustrations/sitting-girl-with-laptop.png": {
    "type": "image/png",
    "etag": "\"6ed2-isiz3DUSWQSAjQRHUNitsxok9rk\"",
    "mtime": "2025-11-26T22:47:33.777Z",
    "size": 28370,
    "path": "../public/assets/images/illustrations/sitting-girl-with-laptop.png"
  },
  "/assets/images/illustrations/standingGirlImg.png": {
    "type": "image/png",
    "etag": "\"8c79-2UMskSaUzd5A4G0BIheTjDubh3g\"",
    "mtime": "2025-11-26T22:47:33.779Z",
    "size": 35961,
    "path": "../public/assets/images/illustrations/standingGirlImg.png"
  },
  "/assets/images/logos/aviato.png": {
    "type": "image/png",
    "etag": "\"6cc-FdBFstC8qOji+lCLOYogYC+8yHg\"",
    "mtime": "2025-11-26T22:47:33.781Z",
    "size": 1740,
    "path": "../public/assets/images/logos/aviato.png"
  },
  "/assets/images/logos/bitbank.png": {
    "type": "image/png",
    "etag": "\"5a7-8o/PLMBRHS7v55rX/lbzkkicSBk\"",
    "mtime": "2025-11-26T22:47:33.782Z",
    "size": 1447,
    "path": "../public/assets/images/logos/bitbank.png"
  },
  "/assets/images/logos/brave.png": {
    "type": "image/png",
    "etag": "\"e3d-eviopFf4gCT0CP/vgyEyYBkXuHg\"",
    "mtime": "2025-11-26T22:47:33.782Z",
    "size": 3645,
    "path": "../public/assets/images/logos/brave.png"
  },
  "/assets/images/logos/chrome.png": {
    "type": "image/png",
    "etag": "\"1de3-FP5xtPM3VBj4HUdm9WEVXuhwbNs\"",
    "mtime": "2025-11-26T22:47:33.782Z",
    "size": 7651,
    "path": "../public/assets/images/logos/chrome.png"
  },
  "/assets/images/logos/firefox.png": {
    "type": "image/png",
    "etag": "\"7d4-yrYxggE3MPwvERJr8wRDE1eefq0\"",
    "mtime": "2025-11-26T22:47:33.782Z",
    "size": 2004,
    "path": "../public/assets/images/logos/firefox.png"
  },
  "/assets/images/logos/gumroad.png": {
    "type": "image/png",
    "etag": "\"83e-KdXsvoI8pV0OQhQAVTvI0+bd83k\"",
    "mtime": "2025-11-26T22:47:33.787Z",
    "size": 2110,
    "path": "../public/assets/images/logos/gumroad.png"
  },
  "/assets/images/logos/internet-explorer.png": {
    "type": "image/png",
    "etag": "\"cd1-K1A42AqW+HcsHY3T66a1wiQHx4o\"",
    "mtime": "2025-11-26T22:47:33.788Z",
    "size": 3281,
    "path": "../public/assets/images/logos/internet-explorer.png"
  },
  "/assets/images/logos/opera-mini.png": {
    "type": "image/png",
    "etag": "\"62d-gDBU9ffQ2vINZ3ekRYn1jV3QxHM\"",
    "mtime": "2025-11-26T22:47:33.789Z",
    "size": 1581,
    "path": "../public/assets/images/logos/opera-mini.png"
  },
  "/assets/images/logos/safari.png": {
    "type": "image/png",
    "etag": "\"41a-I3t+kQ8up1lEiaNky5ezWjOVJdk\"",
    "mtime": "2025-11-26T22:47:33.790Z",
    "size": 1050,
    "path": "../public/assets/images/logos/safari.png"
  },
  "/assets/images/logos/zipcar.png": {
    "type": "image/png",
    "etag": "\"586-If+OsYtFOjd0bVKfLwNnGkswJdI\"",
    "mtime": "2025-11-26T22:47:33.790Z",
    "size": 1414,
    "path": "../public/assets/images/logos/zipcar.png"
  },
  "/assets/images/misc/3d-safe-box-with-golden-dollar-coins.png": {
    "type": "image/png",
    "etag": "\"37bf-mJFtjIhv5okPWE5+MDuYFqjIqZ8\"",
    "mtime": "2025-11-26T22:47:33.792Z",
    "size": 14271,
    "path": "../public/assets/images/misc/3d-safe-box-with-golden-dollar-coins.png"
  },
  "/assets/images/misc/3d-space-rocket-with-smoke.png": {
    "type": "image/png",
    "etag": "\"2c1a-Z1mYEB/dONguPvKR3ZBzmpN6OV0\"",
    "mtime": "2025-11-26T22:47:33.794Z",
    "size": 11290,
    "path": "../public/assets/images/misc/3d-space-rocket-with-smoke.png"
  },
  "/assets/images/misc/dollar-coins-flying-pink-piggy-bank.png": {
    "type": "image/png",
    "etag": "\"282f-imylz94tak78fv9vv/HrNRdVIr8\"",
    "mtime": "2025-11-26T22:47:33.795Z",
    "size": 10287,
    "path": "../public/assets/images/misc/dollar-coins-flying-pink-piggy-bank.png"
  },
  "/assets/images/misc/fleet-car.png": {
    "type": "image/png",
    "etag": "\"1ac9-aKhJUahEdzmuCUtW7QnykPtN1pg\"",
    "mtime": "2025-11-26T22:47:33.796Z",
    "size": 6857,
    "path": "../public/assets/images/misc/fleet-car.png"
  },
  "/assets/images/svg/address.svg": {
    "type": "image/svg+xml",
    "etag": "\"f59-PwU3lbyLa5NI3EElyEZ4LFt0bUc\"",
    "mtime": "2025-11-26T22:47:33.884Z",
    "size": 3929,
    "path": "../public/assets/images/svg/address.svg"
  },
  "/assets/images/svg/auth-v1-bottom-shape.svg": {
    "type": "image/svg+xml",
    "etag": "\"16d-W+bkW0YkedcduhAbtHj7EMvcrSw\"",
    "mtime": "2025-11-26T22:47:33.885Z",
    "size": 365,
    "path": "../public/assets/images/svg/auth-v1-bottom-shape.svg"
  },
  "/assets/images/svg/auth-v1-top-shape.svg": {
    "type": "image/svg+xml",
    "etag": "\"148-vZnCVXGPi99zaFVA0k6TQM51KI8\"",
    "mtime": "2025-11-26T22:47:33.886Z",
    "size": 328,
    "path": "../public/assets/images/svg/auth-v1-top-shape.svg"
  },
  "/assets/images/svg/Card.svg": {
    "type": "image/svg+xml",
    "etag": "\"4d0-IRgKTE5v5qxtV3DmiG+61KYIwXo\"",
    "mtime": "2025-11-26T22:47:33.880Z",
    "size": 1232,
    "path": "../public/assets/images/svg/Card.svg"
  },
  "/assets/images/svg/cart.svg": {
    "type": "image/svg+xml",
    "etag": "\"a86-qTLWRjPWi8byhcMLGLCTk0ZN1GI\"",
    "mtime": "2025-11-26T22:47:33.887Z",
    "size": 2694,
    "path": "../public/assets/images/svg/cart.svg"
  },
  "/assets/images/svg/Check.svg": {
    "type": "image/svg+xml",
    "etag": "\"672-vF/wu6M/MdiU9ozRml/T520n93A\"",
    "mtime": "2025-11-26T22:47:33.881Z",
    "size": 1650,
    "path": "../public/assets/images/svg/Check.svg"
  },
  "/assets/images/svg/checkbox-checked.svg": {
    "type": "image/svg+xml",
    "etag": "\"147-pESRJl+5MOUpOXZmrIO4KHdAVHI\"",
    "mtime": "2025-11-26T22:47:33.889Z",
    "size": 327,
    "path": "../public/assets/images/svg/checkbox-checked.svg"
  },
  "/assets/images/svg/checkbox-indeterminate.svg": {
    "type": "image/svg+xml",
    "etag": "\"138-U+hSIxEkisPxl9pRW42mMFoTx5k\"",
    "mtime": "2025-11-26T22:47:33.891Z",
    "size": 312,
    "path": "../public/assets/images/svg/checkbox-indeterminate.svg"
  },
  "/assets/images/svg/checkbox-unchecked.svg": {
    "type": "image/svg+xml",
    "etag": "\"18b-wYV1HJdwCvxC2y9MFaii6QqA+ys\"",
    "mtime": "2025-11-26T22:47:33.892Z",
    "size": 395,
    "path": "../public/assets/images/svg/checkbox-unchecked.svg"
  },
  "/assets/images/svg/Diamond.svg": {
    "type": "image/svg+xml",
    "etag": "\"506-eSXWNbbHOCDEXYzjZo/cSgXaxgo\"",
    "mtime": "2025-11-26T22:47:33.882Z",
    "size": 1286,
    "path": "../public/assets/images/svg/Diamond.svg"
  },
  "/assets/images/svg/discord.svg": {
    "type": "image/svg+xml",
    "etag": "\"1902-PcKNxomqY8NND4eOqzUGUOlD6OI\"",
    "mtime": "2025-11-26T22:47:33.892Z",
    "size": 6402,
    "path": "../public/assets/images/svg/discord.svg"
  },
  "/assets/images/svg/gift.svg": {
    "type": "image/svg+xml",
    "etag": "\"1948-giuYiZ175uQLaHJ1lKBzp7Rv0i0\"",
    "mtime": "2025-11-26T22:47:33.893Z",
    "size": 6472,
    "path": "../public/assets/images/svg/gift.svg"
  },
  "/assets/images/svg/home.svg": {
    "type": "image/svg+xml",
    "etag": "\"4bd-W1UenGFf7+CqDbn5cHVJfVZozn0\"",
    "mtime": "2025-11-26T22:47:33.894Z",
    "size": 1213,
    "path": "../public/assets/images/svg/home.svg"
  },
  "/assets/images/svg/keyboard.svg": {
    "type": "image/svg+xml",
    "etag": "\"68a-CqMLoDsDP69CSyPSAwrhA17DQN8\"",
    "mtime": "2025-11-26T22:47:33.896Z",
    "size": 1674,
    "path": "../public/assets/images/svg/keyboard.svg"
  },
  "/assets/images/svg/laptop.svg": {
    "type": "image/svg+xml",
    "etag": "\"370-AwtqwCeOEy94Wk3aKHRmO/F/s7c\"",
    "mtime": "2025-11-26T22:47:33.897Z",
    "size": 880,
    "path": "../public/assets/images/svg/laptop.svg"
  },
  "/assets/images/svg/lightbulb.svg": {
    "type": "image/svg+xml",
    "etag": "\"1aaa-RaMLDb76FfZOMhIUMaqcUMleYuk\"",
    "mtime": "2025-11-26T22:47:33.897Z",
    "size": 6826,
    "path": "../public/assets/images/svg/lightbulb.svg"
  },
  "/assets/images/svg/office.svg": {
    "type": "image/svg+xml",
    "etag": "\"37f-TWup6Oral0NBdNspEASDQimWPYg\"",
    "mtime": "2025-11-26T22:47:33.898Z",
    "size": 895,
    "path": "../public/assets/images/svg/office.svg"
  },
  "/assets/images/svg/paper-send.svg": {
    "type": "image/svg+xml",
    "etag": "\"a6d-yTI5rtabmWta370eeim+86MEPFI\"",
    "mtime": "2025-11-26T22:47:33.899Z",
    "size": 2669,
    "path": "../public/assets/images/svg/paper-send.svg"
  },
  "/assets/images/svg/payment.svg": {
    "type": "image/svg+xml",
    "etag": "\"ced-tV6DeI59I263q9Id+bgsHEFVtYI\"",
    "mtime": "2025-11-26T22:47:33.900Z",
    "size": 3309,
    "path": "../public/assets/images/svg/payment.svg"
  },
  "/assets/images/svg/radio-checked.svg": {
    "type": "image/svg+xml",
    "etag": "\"da-BrXtS384ukpQz13CmlUlgiprswk\"",
    "mtime": "2025-11-26T22:47:33.900Z",
    "size": 218,
    "path": "../public/assets/images/svg/radio-checked.svg"
  },
  "/assets/images/svg/radio-unchecked.svg": {
    "type": "image/svg+xml",
    "etag": "\"d8-K2agxrEQOP6qaDB8b5rEovn1Z1s\"",
    "mtime": "2025-11-26T22:47:33.900Z",
    "size": 216,
    "path": "../public/assets/images/svg/radio-unchecked.svg"
  },
  "/assets/images/svg/rocket.svg": {
    "type": "image/svg+xml",
    "etag": "\"fae-aGrX1aTZjr5qZn+LE0AVeWaJaeI\"",
    "mtime": "2025-11-26T22:47:33.902Z",
    "size": 4014,
    "path": "../public/assets/images/svg/rocket.svg"
  },
  "/assets/images/svg/Suitcase.svg": {
    "type": "image/svg+xml",
    "etag": "\"623-mwPGVDWR/fhcOiEKSkL3ilnhOUw\"",
    "mtime": "2025-11-26T22:47:33.883Z",
    "size": 1571,
    "path": "../public/assets/images/svg/Suitcase.svg"
  },
  "/assets/images/svg/trending.svg": {
    "type": "image/svg+xml",
    "etag": "\"71a-1klJtNGTDnaOW6k3iYGnjXSIj90\"",
    "mtime": "2025-11-26T22:47:33.903Z",
    "size": 1818,
    "path": "../public/assets/images/svg/trending.svg"
  },
  "/assets/images/svg/user-info.svg": {
    "type": "image/svg+xml",
    "etag": "\"6fe-qpj/PGgvMc9sxi0t/9g6gksFjrk\"",
    "mtime": "2025-11-26T22:47:33.903Z",
    "size": 1790,
    "path": "../public/assets/images/svg/user-info.svg"
  },
  "/assets/images/svg/user.svg": {
    "type": "image/svg+xml",
    "etag": "\"736-7KKrpCm9Ox4dRqu3gmbwyhXap78\"",
    "mtime": "2025-11-26T22:47:33.903Z",
    "size": 1846,
    "path": "../public/assets/images/svg/user.svg"
  },
  "/assets/images/svg/Wallet.svg": {
    "type": "image/svg+xml",
    "etag": "\"987-zaqNFe5s4GAoI0jqcdK1R+YqOoE\"",
    "mtime": "2025-11-26T22:47:33.883Z",
    "size": 2439,
    "path": "../public/assets/images/svg/Wallet.svg"
  },
  "/assets/images/svg/wizard-account.svg": {
    "type": "image/svg+xml",
    "etag": "\"948-PJe+6GaqhVrtZB3TFrNuLEWjuW0\"",
    "mtime": "2025-11-26T22:47:33.906Z",
    "size": 2376,
    "path": "../public/assets/images/svg/wizard-account.svg"
  },
  "/assets/images/svg/wizard-address.svg": {
    "type": "image/svg+xml",
    "etag": "\"be9-zF9Ni1zTN8t0fRKM6iU72jmnnQI\"",
    "mtime": "2025-11-26T22:47:33.907Z",
    "size": 3049,
    "path": "../public/assets/images/svg/wizard-address.svg"
  },
  "/assets/images/svg/wizard-personal.svg": {
    "type": "image/svg+xml",
    "etag": "\"97b-svLfjR/Sk7VkWJmFqwD0LHkEh6E\"",
    "mtime": "2025-11-26T22:47:33.908Z",
    "size": 2427,
    "path": "../public/assets/images/svg/wizard-personal.svg"
  },
  "/assets/images/svg/wizard-social-link.svg": {
    "type": "image/svg+xml",
    "etag": "\"ca4-oRbxgnFWFKRbt5UHdckP6p4kY/0\"",
    "mtime": "2025-11-26T22:47:33.909Z",
    "size": 3236,
    "path": "../public/assets/images/svg/wizard-social-link.svg"
  },
  "/assets/images/svg/wizard-submit.svg": {
    "type": "image/svg+xml",
    "etag": "\"96b-K9WFuE/DZDJBgMviqu5XnZd8Ibs\"",
    "mtime": "2025-11-26T22:47:33.910Z",
    "size": 2411,
    "path": "../public/assets/images/svg/wizard-submit.svg"
  },
  "/assets/images/pages/1.png": {
    "type": "image/png",
    "etag": "\"15a08-b5QCWjp5IiFNL1cvTQDB/4aVP6Y\"",
    "mtime": "2025-11-26T22:47:33.796Z",
    "size": 88584,
    "path": "../public/assets/images/pages/1.png"
  },
  "/assets/images/pages/2.png": {
    "type": "image/png",
    "etag": "\"b413-1jGq2xD24q4hOSVhwcg6Wyiw4q8\"",
    "mtime": "2025-11-26T22:47:33.796Z",
    "size": 46099,
    "path": "../public/assets/images/pages/2.png"
  },
  "/assets/images/pages/3.png": {
    "type": "image/png",
    "etag": "\"e42d-ago9TctI/gwxQry43XmzQa2NRfs\"",
    "mtime": "2025-11-26T22:47:33.796Z",
    "size": 58413,
    "path": "../public/assets/images/pages/3.png"
  },
  "/assets/images/pages/401.png": {
    "type": "image/png",
    "etag": "\"748d-74BIT9iprCkAjtBWm4e99txxd08\"",
    "mtime": "2025-11-26T22:47:33.802Z",
    "size": 29837,
    "path": "../public/assets/images/pages/401.png"
  },
  "/assets/images/pages/404.png": {
    "type": "image/png",
    "etag": "\"8655-A01Y8gth+wPUZ3lJvu5+7y6o3m0\"",
    "mtime": "2025-11-26T22:47:33.804Z",
    "size": 34389,
    "path": "../public/assets/images/pages/404.png"
  },
  "/assets/images/pages/5.jpg": {
    "type": "image/jpeg",
    "etag": "\"1a86-2cPgA7FpSChcOBNtfjoRhOzVeMc\"",
    "mtime": "2025-11-26T22:47:33.805Z",
    "size": 6790,
    "path": "../public/assets/images/pages/5.jpg"
  },
  "/assets/images/pages/6.jpg": {
    "type": "image/jpeg",
    "etag": "\"da52-nXHjxVdkO46oFrhUoMECg59+/ko\"",
    "mtime": "2025-11-26T22:47:33.806Z",
    "size": 55890,
    "path": "../public/assets/images/pages/6.jpg"
  },
  "/assets/images/pages/academy-course-illustration1.png": {
    "type": "image/png",
    "etag": "\"aef6-8jdrNDIta0zV4x5+KBp2l+ydyv4\"",
    "mtime": "2025-11-26T22:47:33.812Z",
    "size": 44790,
    "path": "../public/assets/images/pages/academy-course-illustration1.png"
  },
  "/assets/images/pages/academy-course-illustration2.png": {
    "type": "image/png",
    "etag": "\"2ae0-RM2z8h8/v04HUfvRGqfYDoqtCM4\"",
    "mtime": "2025-11-26T22:47:33.813Z",
    "size": 10976,
    "path": "../public/assets/images/pages/academy-course-illustration2.png"
  },
  "/assets/images/pages/app-academy-tutor-1.png": {
    "type": "image/png",
    "etag": "\"12421-8WVY57W3/IVwgx0WbfYWkQh/kSA\"",
    "mtime": "2025-11-26T22:47:33.815Z",
    "size": 74785,
    "path": "../public/assets/images/pages/app-academy-tutor-1.png"
  },
  "/assets/images/pages/app-academy-tutor-2.png": {
    "type": "image/png",
    "etag": "\"ef27-KTbfolfMqNIlUrfgheSWFNtm5So\"",
    "mtime": "2025-11-26T22:47:33.816Z",
    "size": 61223,
    "path": "../public/assets/images/pages/app-academy-tutor-2.png"
  },
  "/assets/images/pages/app-academy-tutor-3.png": {
    "type": "image/png",
    "etag": "\"146e3-tWwzCNmdID5xmmkgIJ0dPQWaDXk\"",
    "mtime": "2025-11-26T22:47:33.818Z",
    "size": 83683,
    "path": "../public/assets/images/pages/app-academy-tutor-3.png"
  },
  "/assets/images/pages/app-academy-tutor-4.png": {
    "type": "image/png",
    "etag": "\"15f67-TUknj42neY2g8mp7WK3VJebl05Q\"",
    "mtime": "2025-11-26T22:47:33.818Z",
    "size": 89959,
    "path": "../public/assets/images/pages/app-academy-tutor-4.png"
  },
  "/assets/images/pages/app-academy-tutor-5.png": {
    "type": "image/png",
    "etag": "\"15cbb-6/+KkTJPzAxxA54fWzZHy43s73w\"",
    "mtime": "2025-11-26T22:47:33.818Z",
    "size": 89275,
    "path": "../public/assets/images/pages/app-academy-tutor-5.png"
  },
  "/assets/images/pages/app-academy-tutor-6.png": {
    "type": "image/png",
    "etag": "\"125b4-w9tctx8wXOjyGNSIWt3YOQd/2qo\"",
    "mtime": "2025-11-26T22:47:33.821Z",
    "size": 75188,
    "path": "../public/assets/images/pages/app-academy-tutor-6.png"
  },
  "/assets/images/pages/app-search-header-bg.png": {
    "type": "image/png",
    "etag": "\"7979-hL7kb9bRnnLxYu7hxSIvnY073Uk\"",
    "mtime": "2025-11-26T22:47:33.823Z",
    "size": 31097,
    "path": "../public/assets/images/pages/app-search-header-bg.png"
  },
  "/assets/images/pages/auth-v2-forgot-password-illustration-dark.png": {
    "type": "image/png",
    "etag": "\"c06a-uUB+vn6TN8nRgtT1yLZwG9WDDdI\"",
    "mtime": "2025-11-26T22:47:33.824Z",
    "size": 49258,
    "path": "../public/assets/images/pages/auth-v2-forgot-password-illustration-dark.png"
  },
  "/assets/images/pages/auth-v2-forgot-password-illustration-light.png": {
    "type": "image/png",
    "etag": "\"bc15-xNoNe9ZhF4aLWO4VadhBMgjy6N8\"",
    "mtime": "2025-11-26T22:47:33.825Z",
    "size": 48149,
    "path": "../public/assets/images/pages/auth-v2-forgot-password-illustration-light.png"
  },
  "/assets/images/pages/auth-v2-login-illustration-bordered-dark.png": {
    "type": "image/png",
    "etag": "\"c6a9-0PNEuMJqhKJEByymBYnVocZfeOM\"",
    "mtime": "2025-11-26T22:47:33.827Z",
    "size": 50857,
    "path": "../public/assets/images/pages/auth-v2-login-illustration-bordered-dark.png"
  },
  "/assets/images/pages/auth-v2-login-illustration-bordered-light.png": {
    "type": "image/png",
    "etag": "\"c39c-OlQYu8XgjvFHC62dvYsb6fAfEg8\"",
    "mtime": "2025-11-26T22:47:33.827Z",
    "size": 50076,
    "path": "../public/assets/images/pages/auth-v2-login-illustration-bordered-light.png"
  },
  "/assets/images/pages/auth-v2-login-illustration-dark.png": {
    "type": "image/png",
    "etag": "\"d68e-QYuG38fJ6c8x0v40IfgH8wQLNiE\"",
    "mtime": "2025-11-26T22:47:33.830Z",
    "size": 54926,
    "path": "../public/assets/images/pages/auth-v2-login-illustration-dark.png"
  },
  "/assets/images/pages/auth-v2-login-illustration-light.png": {
    "type": "image/png",
    "etag": "\"d7cc-+nV6ove1e5KUnVb+4hz7qGPhVUU\"",
    "mtime": "2025-11-26T22:47:33.832Z",
    "size": 55244,
    "path": "../public/assets/images/pages/auth-v2-login-illustration-light.png"
  },
  "/assets/images/pages/auth-v2-register-illustration-bordered-dark.png": {
    "type": "image/png",
    "etag": "\"14916-dfnUVIBf1c3/pZANMFRvRGnYuvk\"",
    "mtime": "2025-11-26T22:47:33.834Z",
    "size": 84246,
    "path": "../public/assets/images/pages/auth-v2-register-illustration-bordered-dark.png"
  },
  "/assets/images/pages/auth-v2-register-illustration-bordered-light.png": {
    "type": "image/png",
    "etag": "\"19aaa-hfpgnA4sNa79Oba081WIhAbiorE\"",
    "mtime": "2025-11-26T22:47:33.835Z",
    "size": 105130,
    "path": "../public/assets/images/pages/auth-v2-register-illustration-bordered-light.png"
  },
  "/assets/images/pages/auth-v2-register-illustration-dark.png": {
    "type": "image/png",
    "etag": "\"1593a-vm7M0+LTFWERJUz2NxZUvJg9Zsw\"",
    "mtime": "2025-11-26T22:47:33.836Z",
    "size": 88378,
    "path": "../public/assets/images/pages/auth-v2-register-illustration-dark.png"
  },
  "/assets/images/pages/auth-v2-register-illustration-light.png": {
    "type": "image/png",
    "etag": "\"1b8a4-AP/S85w//IwWtb4XFnmC4c34v4A\"",
    "mtime": "2025-11-26T22:47:33.838Z",
    "size": 112804,
    "path": "../public/assets/images/pages/auth-v2-register-illustration-light.png"
  },
  "/assets/images/pages/auth-v2-reset-password-illustration-dark.png": {
    "type": "image/png",
    "etag": "\"185cb-B04KJ8+aGKluDPMcJGCrLb6Afkg\"",
    "mtime": "2025-11-26T22:47:33.839Z",
    "size": 99787,
    "path": "../public/assets/images/pages/auth-v2-reset-password-illustration-dark.png"
  },
  "/assets/images/pages/auth-v2-reset-password-illustration-light.png": {
    "type": "image/png",
    "etag": "\"5f5a-flC+gPoyMgxObQQfDOiEmiucqbQ\"",
    "mtime": "2025-11-26T22:47:33.841Z",
    "size": 24410,
    "path": "../public/assets/images/pages/auth-v2-reset-password-illustration-light.png"
  },
  "/assets/images/pages/auth-v2-two-step-illustration-dark.png": {
    "type": "image/png",
    "etag": "\"c2c1-UApzACA7Evz4WZb+Q3HwPByn4HE\"",
    "mtime": "2025-11-26T22:47:33.842Z",
    "size": 49857,
    "path": "../public/assets/images/pages/auth-v2-two-step-illustration-dark.png"
  },
  "/assets/images/pages/auth-v2-two-step-illustration-light.png": {
    "type": "image/png",
    "etag": "\"c110-6RGQDmBtOrLkT39j7rWHW0nA2wo\"",
    "mtime": "2025-11-26T22:47:33.843Z",
    "size": 49424,
    "path": "../public/assets/images/pages/auth-v2-two-step-illustration-light.png"
  },
  "/assets/images/pages/auth-v2-verify-email-illustration-dark.png": {
    "type": "image/png",
    "etag": "\"e7a2-wbgZrISvn6T6xPHbFSRX7Rk+ZTQ\"",
    "mtime": "2025-11-26T22:47:33.846Z",
    "size": 59298,
    "path": "../public/assets/images/pages/auth-v2-verify-email-illustration-dark.png"
  },
  "/assets/images/pages/auth-v2-verify-email-illustration-light.png": {
    "type": "image/png",
    "etag": "\"e6d4-AfZg3ZcI49rwSvMq58b1+7ikTAQ\"",
    "mtime": "2025-11-26T22:47:33.847Z",
    "size": 59092,
    "path": "../public/assets/images/pages/auth-v2-verify-email-illustration-light.png"
  },
  "/assets/images/pages/background-1.jpg": {
    "type": "image/jpeg",
    "etag": "\"8fd4-CHRrqaGTl5kK+fQ9eDNUgG789QQ\"",
    "mtime": "2025-11-26T22:47:33.847Z",
    "size": 36820,
    "path": "../public/assets/images/pages/background-1.jpg"
  },
  "/assets/images/pages/background-2.jpg": {
    "type": "image/jpeg",
    "etag": "\"122cb-vXcP/GYl7lWmpK2upZEEiDK2VEA\"",
    "mtime": "2025-11-26T22:47:33.850Z",
    "size": 74443,
    "path": "../public/assets/images/pages/background-2.jpg"
  },
  "/assets/images/pages/background-3.jpg": {
    "type": "image/jpeg",
    "etag": "\"15acf-gGsaOwz18JYglWn3TczLp/gTLsY\"",
    "mtime": "2025-11-26T22:47:33.852Z",
    "size": 88783,
    "path": "../public/assets/images/pages/background-3.jpg"
  },
  "/assets/images/pages/boy-illustration.png": {
    "type": "image/png",
    "etag": "\"2f9b-qhf9qZrLsraiUpYXMU8SkQN+1i8\"",
    "mtime": "2025-11-26T22:47:33.853Z",
    "size": 12187,
    "path": "../public/assets/images/pages/boy-illustration.png"
  },
  "/assets/images/pages/custom-checkbox-img-1.png": {
    "type": "image/png",
    "etag": "\"64c7-AXs5Pz8BKj4KldZgoPL7zlqQrN0\"",
    "mtime": "2025-11-26T22:47:33.854Z",
    "size": 25799,
    "path": "../public/assets/images/pages/custom-checkbox-img-1.png"
  },
  "/assets/images/pages/custom-checkbox-img-2.png": {
    "type": "image/png",
    "etag": "\"89d0-eKdarfjnSMBfbULHfjlcpdbXQJ4\"",
    "mtime": "2025-11-26T22:47:33.855Z",
    "size": 35280,
    "path": "../public/assets/images/pages/custom-checkbox-img-2.png"
  },
  "/assets/images/pages/custom-checkbox-img-3.png": {
    "type": "image/png",
    "etag": "\"6cb3-yzSjWx2UEfkT/RCCyG6iYcfct2k\"",
    "mtime": "2025-11-26T22:47:33.857Z",
    "size": 27827,
    "path": "../public/assets/images/pages/custom-checkbox-img-3.png"
  },
  "/assets/images/pages/custom-radio-img-1.png": {
    "type": "image/png",
    "etag": "\"ae30-iOz4+ZCKCIpgIFZYFx4Na4o58tA\"",
    "mtime": "2025-11-26T22:47:33.858Z",
    "size": 44592,
    "path": "../public/assets/images/pages/custom-radio-img-1.png"
  },
  "/assets/images/pages/custom-radio-img-2.png": {
    "type": "image/png",
    "etag": "\"7530-nWyZ1bbn9yvknjOqyJ5ou5xCcmk\"",
    "mtime": "2025-11-26T22:47:33.860Z",
    "size": 30000,
    "path": "../public/assets/images/pages/custom-radio-img-2.png"
  },
  "/assets/images/pages/custom-radio-img-3.png": {
    "type": "image/png",
    "etag": "\"9796-J46BAp3yV6JCUF0Lbt8hTW3Z8TM\"",
    "mtime": "2025-11-26T22:47:33.861Z",
    "size": 38806,
    "path": "../public/assets/images/pages/custom-radio-img-3.png"
  },
  "/assets/images/pages/DealTypeBackground-dark.png": {
    "type": "image/png",
    "etag": "\"b4b-e7hbxnrJd2DTGqqBG+SxHHRNdis\"",
    "mtime": "2025-11-26T22:47:33.808Z",
    "size": 2891,
    "path": "../public/assets/images/pages/DealTypeBackground-dark.png"
  },
  "/assets/images/pages/DealTypeBackground-light.png": {
    "type": "image/png",
    "etag": "\"928-vrh4OfWZN3HnbKDA0aI1BxQakgc\"",
    "mtime": "2025-11-26T22:47:33.808Z",
    "size": 2344,
    "path": "../public/assets/images/pages/DealTypeBackground-light.png"
  },
  "/assets/images/pages/empty-cart.png": {
    "type": "image/png",
    "etag": "\"ccff-ARyNWacyuRarY9MhMWZGLCi83L8\"",
    "mtime": "2025-11-26T22:47:33.863Z",
    "size": 52479,
    "path": "../public/assets/images/pages/empty-cart.png"
  },
  "/assets/images/pages/forgot-password-illustration.png": {
    "type": "image/png",
    "etag": "\"343f-PNgclXA/OIxZMDudIMnikBGRIwM\"",
    "mtime": "2025-11-26T22:47:33.864Z",
    "size": 13375,
    "path": "../public/assets/images/pages/forgot-password-illustration.png"
  },
  "/assets/images/pages/girl-using-mobile.png": {
    "type": "image/png",
    "etag": "\"3176-TFI4FoN2d512RA6QeJdnVkALy+8\"",
    "mtime": "2025-11-26T22:47:33.864Z",
    "size": 12662,
    "path": "../public/assets/images/pages/girl-using-mobile.png"
  },
  "/assets/images/pages/google-home.png": {
    "type": "image/png",
    "etag": "\"2656-xJPvbrcuaBanH6Ay8w+ub+9GkLc\"",
    "mtime": "2025-11-26T22:47:33.865Z",
    "size": 9814,
    "path": "../public/assets/images/pages/google-home.png"
  },
  "/assets/images/pages/guitar-course-poster.png": {
    "type": "image/png",
    "etag": "\"81ea-tu6bF/ti5llPV8pForramiKWlb4\"",
    "mtime": "2025-11-26T22:47:33.866Z",
    "size": 33258,
    "path": "../public/assets/images/pages/guitar-course-poster.png"
  },
  "/assets/images/pages/instructor-poster.png": {
    "type": "image/png",
    "etag": "\"13990-KP41qA0xYVKQykWGY9IX3WDTceA\"",
    "mtime": "2025-11-26T22:47:33.867Z",
    "size": 80272,
    "path": "../public/assets/images/pages/instructor-poster.png"
  },
  "/assets/images/pages/iphone-11.png": {
    "type": "image/png",
    "etag": "\"2da1-bgCOll4VTqPzSNaGoHp/D5M2UBs\"",
    "mtime": "2025-11-26T22:47:33.868Z",
    "size": 11681,
    "path": "../public/assets/images/pages/iphone-11.png"
  },
  "/assets/images/pages/misc-coming-soon.png": {
    "type": "image/png",
    "etag": "\"8315-kbFt0pG0uKbT5EGeaVp6nHsEnB0\"",
    "mtime": "2025-11-26T22:47:33.870Z",
    "size": 33557,
    "path": "../public/assets/images/pages/misc-coming-soon.png"
  },
  "/assets/images/pages/misc-mask-dark.png": {
    "type": "image/png",
    "etag": "\"76e-Cplj8RwyA6Fr5W9F6Hsf+fOSZGY\"",
    "mtime": "2025-11-26T22:47:33.871Z",
    "size": 1902,
    "path": "../public/assets/images/pages/misc-mask-dark.png"
  },
  "/assets/images/pages/misc-mask-light.png": {
    "type": "image/png",
    "etag": "\"ec1-ox38jgHhLPqLkJhbNwIxCUYle24\"",
    "mtime": "2025-11-26T22:47:33.872Z",
    "size": 3777,
    "path": "../public/assets/images/pages/misc-mask-light.png"
  },
  "/assets/images/pages/misc-under-maintenance.png": {
    "type": "image/png",
    "etag": "\"1786e-JIqXkZVF0y06mj0+q0BpEAv7t1w\"",
    "mtime": "2025-11-26T22:47:33.873Z",
    "size": 96366,
    "path": "../public/assets/images/pages/misc-under-maintenance.png"
  },
  "/assets/images/pages/puma-shoes.jpeg": {
    "type": "image/jpeg",
    "etag": "\"3387-v9KPS7xVDHWFTrKn7W3uHOKsAMA\"",
    "mtime": "2025-11-26T22:47:33.874Z",
    "size": 13191,
    "path": "../public/assets/images/pages/puma-shoes.jpeg"
  },
  "/assets/images/pages/register-multi-step-bg-dark.png": {
    "type": "image/png",
    "etag": "\"c8d-QjlXTHONdeF+gMutyP/ux1WFhkk\"",
    "mtime": "2025-11-26T22:47:33.874Z",
    "size": 3213,
    "path": "../public/assets/images/pages/register-multi-step-bg-dark.png"
  },
  "/assets/images/pages/register-multi-step-bg-light.png": {
    "type": "image/png",
    "etag": "\"bac-kgDWz+5MMjJSmKgqbFJD9z/U7YY\"",
    "mtime": "2025-11-26T22:47:33.875Z",
    "size": 2988,
    "path": "../public/assets/images/pages/register-multi-step-bg-light.png"
  },
  "/assets/images/pages/singing-course-poster.png": {
    "type": "image/png",
    "etag": "\"7955-6aKjfZPsbYpHg9RXXb6nUmXpGKQ\"",
    "mtime": "2025-11-26T22:47:33.877Z",
    "size": 31061,
    "path": "../public/assets/images/pages/singing-course-poster.png"
  },
  "/assets/images/pages/themeselection-qr.png": {
    "type": "image/png",
    "etag": "\"e35-+iqMyYgZrb9ZTy9Kr1f3qtxyaTU\"",
    "mtime": "2025-11-26T22:47:33.878Z",
    "size": 3637,
    "path": "../public/assets/images/pages/themeselection-qr.png"
  },
  "/assets/images/pages/TimelineRectangle1.png": {
    "type": "image/png",
    "etag": "\"40fe-jlIC8zwV7lbyc92upwltR7AtXEY\"",
    "mtime": "2025-11-26T22:47:33.809Z",
    "size": 16638,
    "path": "../public/assets/images/pages/TimelineRectangle1.png"
  },
  "/assets/images/pages/TimelineRectangle2.png": {
    "type": "image/png",
    "etag": "\"271c-unhmo66fOJydrxL134fjRPNvMvw\"",
    "mtime": "2025-11-26T22:47:33.810Z",
    "size": 10012,
    "path": "../public/assets/images/pages/TimelineRectangle2.png"
  },
  "/assets/images/pages/TimelineRectangle3.png": {
    "type": "image/png",
    "etag": "\"3998-KWWkkPWpYsXsd/J2hk7ZYjnO3jk\"",
    "mtime": "2025-11-26T22:47:33.811Z",
    "size": 14744,
    "path": "../public/assets/images/pages/TimelineRectangle3.png"
  },
  "/assets/images/pages/TimelineRectangle4.png": {
    "type": "image/png",
    "etag": "\"5820-9nvQE0TLJfD2FG/9ouzdtGG+X+Q\"",
    "mtime": "2025-11-26T22:47:33.811Z",
    "size": 22560,
    "path": "../public/assets/images/pages/TimelineRectangle4.png"
  },
  "/assets/images/pages/user-profile-header-bg.png": {
    "type": "image/png",
    "etag": "\"10612-DMwXI2Xu7T8PMT0swRoWt9YrqRk\"",
    "mtime": "2025-11-26T22:47:33.879Z",
    "size": 67090,
    "path": "../public/assets/images/pages/user-profile-header-bg.png"
  },
  "/_nuxt/builds/meta/0a84cc71-8867-4008-8afc-9d7c2c782d09.json": {
    "type": "application/json",
    "etag": "\"8b-6poO1TlGAGFdgbkDu4Jz8HvNjPA\"",
    "mtime": "2025-12-03T10:02:53.532Z",
    "size": 139,
    "path": "../public/_nuxt/builds/meta/0a84cc71-8867-4008-8afc-9d7c2c782d09.json"
  },
  "/assets/images/front-pages/branding/logo-1-dark.png": {
    "type": "image/png",
    "etag": "\"efc-jP/RBUo3T72Nuskdh35DQQwASxs\"",
    "mtime": "2025-11-26T22:47:33.626Z",
    "size": 3836,
    "path": "../public/assets/images/front-pages/branding/logo-1-dark.png"
  },
  "/assets/images/front-pages/branding/logo-1-light.png": {
    "type": "image/png",
    "etag": "\"7f3-CzkaQ11MrEIZr36+6mDvCZkzkBw\"",
    "mtime": "2025-11-26T22:47:33.627Z",
    "size": 2035,
    "path": "../public/assets/images/front-pages/branding/logo-1-light.png"
  },
  "/assets/images/front-pages/branding/logo-1.png": {
    "type": "image/png",
    "etag": "\"c94-G+4OJgMIfjqsMgJh6FejYfyzWe4\"",
    "mtime": "2025-11-26T22:47:33.628Z",
    "size": 3220,
    "path": "../public/assets/images/front-pages/branding/logo-1.png"
  },
  "/assets/images/front-pages/branding/logo-2-dark.png": {
    "type": "image/png",
    "etag": "\"7bb-EoqdnnJrdNUawWo404awbzt7gvA\"",
    "mtime": "2025-11-26T22:47:33.628Z",
    "size": 1979,
    "path": "../public/assets/images/front-pages/branding/logo-2-dark.png"
  },
  "/assets/images/front-pages/branding/logo-2-light.png": {
    "type": "image/png",
    "etag": "\"483-G6F5aRCtHYQqFb6Y24tMgNSkv8A\"",
    "mtime": "2025-11-26T22:47:33.630Z",
    "size": 1155,
    "path": "../public/assets/images/front-pages/branding/logo-2-light.png"
  },
  "/assets/images/front-pages/branding/logo-2.png": {
    "type": "image/png",
    "etag": "\"13ec-NLBHwcxcrcCnVpmhu7DYVs/vsQM\"",
    "mtime": "2025-11-26T22:47:33.631Z",
    "size": 5100,
    "path": "../public/assets/images/front-pages/branding/logo-2.png"
  },
  "/assets/images/front-pages/branding/logo-3-dark.png": {
    "type": "image/png",
    "etag": "\"1192-4d50x605Rjvva4l5GeQh9+JWieY\"",
    "mtime": "2025-11-26T22:47:33.632Z",
    "size": 4498,
    "path": "../public/assets/images/front-pages/branding/logo-3-dark.png"
  },
  "/assets/images/front-pages/branding/logo-3-light.png": {
    "type": "image/png",
    "etag": "\"8df-8PnJFWiUJJZLlejlvY1Gpru9dSw\"",
    "mtime": "2025-11-26T22:47:33.632Z",
    "size": 2271,
    "path": "../public/assets/images/front-pages/branding/logo-3-light.png"
  },
  "/assets/images/front-pages/branding/logo-3.png": {
    "type": "image/png",
    "etag": "\"131c-R0xDHME0Acbb2CVpIAgwfOfj2VM\"",
    "mtime": "2025-11-26T22:47:33.633Z",
    "size": 4892,
    "path": "../public/assets/images/front-pages/branding/logo-3.png"
  },
  "/assets/images/front-pages/branding/logo-4-dark.png": {
    "type": "image/png",
    "etag": "\"e1b-+oHWVjDxTyFAyKB9+ffd9+0JTJQ\"",
    "mtime": "2025-11-26T22:47:33.633Z",
    "size": 3611,
    "path": "../public/assets/images/front-pages/branding/logo-4-dark.png"
  },
  "/assets/images/front-pages/branding/logo-4-light.png": {
    "type": "image/png",
    "etag": "\"74c-IpjMEq6K3wPCYzd99QuhczayQZ4\"",
    "mtime": "2025-11-26T22:47:33.635Z",
    "size": 1868,
    "path": "../public/assets/images/front-pages/branding/logo-4-light.png"
  },
  "/assets/images/front-pages/branding/logo-4.png": {
    "type": "image/png",
    "etag": "\"876-dCj8GAjqr8LpFMAe5Zh299idA2o\"",
    "mtime": "2025-11-26T22:47:33.636Z",
    "size": 2166,
    "path": "../public/assets/images/front-pages/branding/logo-4.png"
  },
  "/assets/images/front-pages/branding/logo-5-dark.png": {
    "type": "image/png",
    "etag": "\"13b3-BXs8BzOnWXtCzG40bZs7SAr9bfo\"",
    "mtime": "2025-11-26T22:47:33.637Z",
    "size": 5043,
    "path": "../public/assets/images/front-pages/branding/logo-5-dark.png"
  },
  "/assets/images/front-pages/branding/logo-5-light.png": {
    "type": "image/png",
    "etag": "\"9f8-Ma8Dz6R9eJxtHYWmg/VHm7BIU28\"",
    "mtime": "2025-11-26T22:47:33.637Z",
    "size": 2552,
    "path": "../public/assets/images/front-pages/branding/logo-5-light.png"
  },
  "/assets/images/front-pages/branding/logo-5.png": {
    "type": "image/png",
    "etag": "\"be5-cs2gSZTRMivUC40CJdf2+M8xQ/c\"",
    "mtime": "2025-11-26T22:47:33.638Z",
    "size": 3045,
    "path": "../public/assets/images/front-pages/branding/logo-5.png"
  },
  "/assets/images/front-pages/branding/logo-6.png": {
    "type": "image/png",
    "etag": "\"1712-RTWQQTcPzsTxT/tawuwrSMxwtiY\"",
    "mtime": "2025-11-26T22:47:33.639Z",
    "size": 5906,
    "path": "../public/assets/images/front-pages/branding/logo-6.png"
  },
  "/assets/images/front-pages/icons/check-warning.png": {
    "type": "image/png",
    "etag": "\"5f5-9qLqYPOSPANmSMOWEAjBxxcFB2w\"",
    "mtime": "2025-11-26T22:47:33.641Z",
    "size": 1525,
    "path": "../public/assets/images/front-pages/icons/check-warning.png"
  },
  "/assets/images/front-pages/icons/check.png": {
    "type": "image/png",
    "etag": "\"6f5-6jFhYlxYZpFRHwZ1xBgwGpWK1Xs\"",
    "mtime": "2025-11-26T22:47:33.642Z",
    "size": 1781,
    "path": "../public/assets/images/front-pages/icons/check.png"
  },
  "/assets/images/front-pages/icons/contact-border.png": {
    "type": "image/png",
    "etag": "\"1054-E6aOUiQW3bxw5/YRNram7aZnGKo\"",
    "mtime": "2025-11-26T22:47:33.643Z",
    "size": 4180,
    "path": "../public/assets/images/front-pages/icons/contact-border.png"
  },
  "/assets/images/front-pages/icons/diamond-info.png": {
    "type": "image/png",
    "etag": "\"6e5-SNGOf71y3dUwDDeKdAKKp3HIMZk\"",
    "mtime": "2025-11-26T22:47:33.644Z",
    "size": 1765,
    "path": "../public/assets/images/front-pages/icons/diamond-info.png"
  },
  "/assets/images/front-pages/icons/Join-community-arrow.png": {
    "type": "image/png",
    "etag": "\"683-rpg0KRF5uzz5mWyg4WVZ8SLtQiU\"",
    "mtime": "2025-11-26T22:47:33.641Z",
    "size": 1667,
    "path": "../public/assets/images/front-pages/icons/Join-community-arrow.png"
  },
  "/assets/images/front-pages/icons/keyboard.png": {
    "type": "image/png",
    "etag": "\"1b7-tzk8iy/+BTiptZn/tNyoEWAz2Fo\"",
    "mtime": "2025-11-26T22:47:33.645Z",
    "size": 439,
    "path": "../public/assets/images/front-pages/icons/keyboard.png"
  },
  "/assets/images/front-pages/icons/laptop.png": {
    "type": "image/png",
    "etag": "\"27a-QaaVgv3Ct49FyDH9/Nk7ipPy78w\"",
    "mtime": "2025-11-26T22:47:33.645Z",
    "size": 634,
    "path": "../public/assets/images/front-pages/icons/laptop.png"
  },
  "/assets/images/front-pages/icons/paper-airplane.png": {
    "type": "image/png",
    "etag": "\"fa9-9vBvfoOf2lE2NbumjQ203aFlyeU\"",
    "mtime": "2025-11-26T22:47:33.647Z",
    "size": 4009,
    "path": "../public/assets/images/front-pages/icons/paper-airplane.png"
  },
  "/assets/images/front-pages/icons/paper.png": {
    "type": "image/png",
    "etag": "\"5dd-Y1a7zTUaicx7k4xsYFhd5Rje4Gc\"",
    "mtime": "2025-11-26T22:47:33.647Z",
    "size": 1501,
    "path": "../public/assets/images/front-pages/icons/paper.png"
  },
  "/assets/images/front-pages/icons/plane.png": {
    "type": "image/png",
    "etag": "\"147b-TgIlOrCb+DhD8QSkkQZ108wDlyI\"",
    "mtime": "2025-11-26T22:47:33.647Z",
    "size": 5243,
    "path": "../public/assets/images/front-pages/icons/plane.png"
  },
  "/assets/images/front-pages/icons/pricing-plans-arrow.png": {
    "type": "image/png",
    "etag": "\"523-J5AV20qelchG2vbEoXDdhsemwPQ\"",
    "mtime": "2025-11-26T22:47:33.649Z",
    "size": 1315,
    "path": "../public/assets/images/front-pages/icons/pricing-plans-arrow.png"
  },
  "/assets/images/front-pages/icons/rocket.png": {
    "type": "image/png",
    "etag": "\"7ae-etWa0EpRo+VpoEd8kLcxb2vJbFk\"",
    "mtime": "2025-11-26T22:47:33.650Z",
    "size": 1966,
    "path": "../public/assets/images/front-pages/icons/rocket.png"
  },
  "/assets/images/front-pages/icons/section-title-icon.png": {
    "type": "image/png",
    "etag": "\"82a-IGJXq0IJBgeFdw3h95NUnyRClY4\"",
    "mtime": "2025-11-26T22:47:33.650Z",
    "size": 2090,
    "path": "../public/assets/images/front-pages/icons/section-title-icon.png"
  },
  "/assets/images/front-pages/icons/shuttle-rocket.png": {
    "type": "image/png",
    "etag": "\"1297-gKxSjcnC3loH/k/y9FdXjfi8hCA\"",
    "mtime": "2025-11-26T22:47:33.651Z",
    "size": 4759,
    "path": "../public/assets/images/front-pages/icons/shuttle-rocket.png"
  },
  "/assets/images/front-pages/icons/user-success.png": {
    "type": "image/png",
    "etag": "\"85c-iAGl939Trqri27sxsz2UgWCqYLA\"",
    "mtime": "2025-11-26T22:47:33.652Z",
    "size": 2140,
    "path": "../public/assets/images/front-pages/icons/user-success.png"
  },
  "/assets/images/front-pages/icons/user.png": {
    "type": "image/png",
    "etag": "\"872-zff+rAL6NYcePzf/PZUO+Cr/N4I\"",
    "mtime": "2025-11-26T22:47:33.653Z",
    "size": 2162,
    "path": "../public/assets/images/front-pages/icons/user.png"
  },
  "/assets/images/front-pages/backgrounds/cta-bg-dark.png": {
    "type": "image/png",
    "etag": "\"16e55-VbVWd3wh99sj/V/6hyQi8iH98ms\"",
    "mtime": "2025-11-26T22:47:33.611Z",
    "size": 93781,
    "path": "../public/assets/images/front-pages/backgrounds/cta-bg-dark.png"
  },
  "/assets/images/front-pages/backgrounds/cta-bg.png": {
    "type": "image/png",
    "etag": "\"3fb4a-BdhbN9iTsOBJLObX2C0U23TmdwE\"",
    "mtime": "2025-11-26T22:47:33.616Z",
    "size": 260938,
    "path": "../public/assets/images/front-pages/backgrounds/cta-bg.png"
  },
  "/assets/images/front-pages/backgrounds/footer-bg-dark.png": {
    "type": "image/png",
    "etag": "\"ebe4-7JWaO5cfwOZqzqHlZlanOIccqrQ\"",
    "mtime": "2025-11-26T22:47:33.617Z",
    "size": 60388,
    "path": "../public/assets/images/front-pages/backgrounds/footer-bg-dark.png"
  },
  "/assets/images/front-pages/backgrounds/footer-bg-light.png": {
    "type": "image/png",
    "etag": "\"d095-0yEPS64C+qCKoAnZaOsVu/3zowc\"",
    "mtime": "2025-11-26T22:47:33.619Z",
    "size": 53397,
    "path": "../public/assets/images/front-pages/backgrounds/footer-bg-light.png"
  },
  "/assets/images/front-pages/backgrounds/hero-bg.png": {
    "type": "image/png",
    "etag": "\"81f97-YgKyN2VaGuzea3l0Wgp0Q+Ks02I\"",
    "mtime": "2025-11-26T22:47:33.624Z",
    "size": 532375,
    "path": "../public/assets/images/front-pages/backgrounds/hero-bg.png"
  },
  "/assets/images/icons/brands/asana.png": {
    "type": "image/png",
    "etag": "\"8bc-J4QTBbLXJkoltcORR93erdymCy4\"",
    "mtime": "2025-11-26T22:47:33.705Z",
    "size": 2236,
    "path": "../public/assets/images/icons/brands/asana.png"
  },
  "/assets/images/icons/brands/behance.png": {
    "type": "image/png",
    "etag": "\"6c3-/t/OLhfSF1XJJdrd3R3DTBhNUxI\"",
    "mtime": "2025-11-26T22:47:33.705Z",
    "size": 1731,
    "path": "../public/assets/images/icons/brands/behance.png"
  },
  "/assets/images/icons/brands/bootstrap-logo.png": {
    "type": "image/png",
    "etag": "\"4a7-O9EKoolpF9gGu4a6vbfd4ze2veY\"",
    "mtime": "2025-11-26T22:47:33.705Z",
    "size": 1191,
    "path": "../public/assets/images/icons/brands/bootstrap-logo.png"
  },
  "/assets/images/icons/brands/dribbble.png": {
    "type": "image/png",
    "etag": "\"b20-vZ0ttukkOXtzRSBLfXTq/ngpWD8\"",
    "mtime": "2025-11-26T22:47:33.709Z",
    "size": 2848,
    "path": "../public/assets/images/icons/brands/dribbble.png"
  },
  "/assets/images/icons/brands/facebook.png": {
    "type": "image/png",
    "etag": "\"2a9-Pndsar82XOWzShpTJFXhVljBBnU\"",
    "mtime": "2025-11-26T22:47:33.709Z",
    "size": 681,
    "path": "../public/assets/images/icons/brands/facebook.png"
  },
  "/assets/images/icons/brands/figma-label.png": {
    "type": "image/png",
    "etag": "\"406-e4trotHVXKZi/SsTxFC5+xqO/g8\"",
    "mtime": "2025-11-26T22:47:33.710Z",
    "size": 1030,
    "path": "../public/assets/images/icons/brands/figma-label.png"
  },
  "/assets/images/icons/brands/figma-logo.png": {
    "type": "image/png",
    "etag": "\"30c-XHJGGKu0bUvoGG8Y0qBtsNSWGrM\"",
    "mtime": "2025-11-26T22:47:33.711Z",
    "size": 780,
    "path": "../public/assets/images/icons/brands/figma-logo.png"
  },
  "/assets/images/icons/brands/github.png": {
    "type": "image/png",
    "etag": "\"732-rReUjFvdev1a7SPwvGj80fl1LB8\"",
    "mtime": "2025-11-26T22:47:33.712Z",
    "size": 1842,
    "path": "../public/assets/images/icons/brands/github.png"
  },
  "/assets/images/icons/brands/google.png": {
    "type": "image/png",
    "etag": "\"78c-r+Y5ZM00pemRueOl9rss1OTaeII\"",
    "mtime": "2025-11-26T22:47:33.713Z",
    "size": 1932,
    "path": "../public/assets/images/icons/brands/google.png"
  },
  "/assets/images/icons/brands/html-label.png": {
    "type": "image/png",
    "etag": "\"8b5-bqsow1x8uxo7Engo+KwSnyGjaeI\"",
    "mtime": "2025-11-26T22:47:33.713Z",
    "size": 2229,
    "path": "../public/assets/images/icons/brands/html-label.png"
  },
  "/assets/images/icons/brands/instagram.png": {
    "type": "image/png",
    "etag": "\"c38-ibBZEsvzGFrkOuZbvdylODy/uM8\"",
    "mtime": "2025-11-26T22:47:33.714Z",
    "size": 3128,
    "path": "../public/assets/images/icons/brands/instagram.png"
  },
  "/assets/images/icons/brands/laravel-logo.png": {
    "type": "image/png",
    "etag": "\"443-Gi3RgqBEAmQ0f5jIwSZ+fANYep0\"",
    "mtime": "2025-11-26T22:47:33.715Z",
    "size": 1091,
    "path": "../public/assets/images/icons/brands/laravel-logo.png"
  },
  "/assets/images/icons/brands/linkedin.png": {
    "type": "image/png",
    "etag": "\"6f9-DKlHiNDLnXaU7KmlTENMf+GDc2M\"",
    "mtime": "2025-11-26T22:47:33.716Z",
    "size": 1785,
    "path": "../public/assets/images/icons/brands/linkedin.png"
  },
  "/assets/images/icons/brands/mailchimp.png": {
    "type": "image/png",
    "etag": "\"5a5-3qZVO89S3xQinGwtv8qfMP7OEzc\"",
    "mtime": "2025-11-26T22:47:33.717Z",
    "size": 1445,
    "path": "../public/assets/images/icons/brands/mailchimp.png"
  },
  "/assets/images/icons/brands/react-label.png": {
    "type": "image/png",
    "etag": "\"c60-x4eqQZJ8sswm2SUjXpIdiOYniMM\"",
    "mtime": "2025-11-26T22:47:33.718Z",
    "size": 3168,
    "path": "../public/assets/images/icons/brands/react-label.png"
  },
  "/assets/images/icons/brands/react-logo.png": {
    "type": "image/png",
    "etag": "\"78d-G5mPBlRVrfbh0lZ56pp5WbDlmW0\"",
    "mtime": "2025-11-26T22:47:33.719Z",
    "size": 1933,
    "path": "../public/assets/images/icons/brands/react-logo.png"
  },
  "/assets/images/icons/brands/sketch-label.png": {
    "type": "image/png",
    "etag": "\"7bc-RZB8zfKdZ9zUe9288YwtYYWZrU8\"",
    "mtime": "2025-11-26T22:47:33.720Z",
    "size": 1980,
    "path": "../public/assets/images/icons/brands/sketch-label.png"
  },
  "/assets/images/icons/brands/sketch-logo.png": {
    "type": "image/png",
    "etag": "\"44b-Sx2W2Ycsfe/9RYqO/f970JZTPzE\"",
    "mtime": "2025-11-26T22:47:33.720Z",
    "size": 1099,
    "path": "../public/assets/images/icons/brands/sketch-logo.png"
  },
  "/assets/images/icons/brands/slack.png": {
    "type": "image/png",
    "etag": "\"9f6-ZEnTZ9naq34sGaZKUhlYp0MLKpc\"",
    "mtime": "2025-11-26T22:47:33.721Z",
    "size": 2550,
    "path": "../public/assets/images/icons/brands/slack.png"
  },
  "/assets/images/icons/brands/social-label.png": {
    "type": "image/png",
    "etag": "\"495-+covcGM9ufIw+/0PpoLZ+MkK21A\"",
    "mtime": "2025-11-26T22:47:33.722Z",
    "size": 1173,
    "path": "../public/assets/images/icons/brands/social-label.png"
  },
  "/assets/images/icons/brands/twitter.png": {
    "type": "image/png",
    "etag": "\"61c-5yOv5F7DLuiKOt7IGRU5DN9l6/w\"",
    "mtime": "2025-11-26T22:47:33.723Z",
    "size": 1564,
    "path": "../public/assets/images/icons/brands/twitter.png"
  },
  "/assets/images/icons/brands/vue-label.png": {
    "type": "image/png",
    "etag": "\"7c2-uc2iG5JeHQ8+sIvA1aiRH/gEPoY\"",
    "mtime": "2025-11-26T22:47:33.723Z",
    "size": 1986,
    "path": "../public/assets/images/icons/brands/vue-label.png"
  },
  "/assets/images/icons/brands/vuejs-logo.png": {
    "type": "image/png",
    "etag": "\"42c-0/udCT1KAaGoeHuO9GW7L2xiqGA\"",
    "mtime": "2025-11-26T22:47:33.724Z",
    "size": 1068,
    "path": "../public/assets/images/icons/brands/vuejs-logo.png"
  },
  "/assets/images/icons/brands/xd-label.png": {
    "type": "image/png",
    "etag": "\"91e-ahwCI/HqA4gchi1UhflmXlKWFv8\"",
    "mtime": "2025-11-26T22:47:33.725Z",
    "size": 2334,
    "path": "../public/assets/images/icons/brands/xd-label.png"
  },
  "/assets/images/front-pages/landing-page/apple-icon.png": {
    "type": "image/png",
    "etag": "\"2d9-pNTe3kP7vBKVH3NhNmQ/Q2Kta2U\"",
    "mtime": "2025-11-26T22:47:33.653Z",
    "size": 729,
    "path": "../public/assets/images/front-pages/landing-page/apple-icon.png"
  },
  "/assets/images/front-pages/landing-page/contact-customer-service.png": {
    "type": "image/png",
    "etag": "\"184ba-A+29h0ckov/ZIDXemMrvY6KZPnA\"",
    "mtime": "2025-11-26T22:47:33.656Z",
    "size": 99514,
    "path": "../public/assets/images/front-pages/landing-page/contact-customer-service.png"
  },
  "/assets/images/front-pages/landing-page/cta-dashboard.png": {
    "type": "image/png",
    "etag": "\"bb97-kqdIacFY1/cLHWqCriZNvjk7YiA\"",
    "mtime": "2025-11-26T22:47:33.658Z",
    "size": 48023,
    "path": "../public/assets/images/front-pages/landing-page/cta-dashboard.png"
  },
  "/assets/images/front-pages/landing-page/faq-boy-with-logos.png": {
    "type": "image/png",
    "etag": "\"d495-jYM4LWmHgrbSc5eYZ1Nf+BPQdXQ\"",
    "mtime": "2025-11-26T22:47:33.659Z",
    "size": 54421,
    "path": "../public/assets/images/front-pages/landing-page/faq-boy-with-logos.png"
  },
  "/assets/images/front-pages/landing-page/google-play-icon.png": {
    "type": "image/png",
    "etag": "\"315-ZbqdoTorHg5JNpCa8sldXY5JjgI\"",
    "mtime": "2025-11-26T22:47:33.660Z",
    "size": 789,
    "path": "../public/assets/images/front-pages/landing-page/google-play-icon.png"
  },
  "/assets/images/front-pages/landing-page/hero-dashboard-dark.png": {
    "type": "image/png",
    "etag": "\"d7521-gNOy+TAK4H1ZHZGyz16xwR/9Pjo\"",
    "mtime": "2025-11-26T22:47:33.670Z",
    "size": 881953,
    "path": "../public/assets/images/front-pages/landing-page/hero-dashboard-dark.png"
  },
  "/assets/images/front-pages/landing-page/hero-dashboard-light.png": {
    "type": "image/png",
    "etag": "\"e364e-bA1Stoo9R4y292dOnX66zOQdhp4\"",
    "mtime": "2025-11-26T22:47:33.670Z",
    "size": 931406,
    "path": "../public/assets/images/front-pages/landing-page/hero-dashboard-light.png"
  },
  "/assets/images/front-pages/landing-page/hero-elements-dark.png": {
    "type": "image/png",
    "etag": "\"5feb0-2h7yaEStjKP9v6jK+T9i9Of946Q\"",
    "mtime": "2025-11-26T22:47:33.670Z",
    "size": 392880,
    "path": "../public/assets/images/front-pages/landing-page/hero-elements-dark.png"
  },
  "/assets/images/front-pages/landing-page/hero-elements-light.png": {
    "type": "image/png",
    "etag": "\"57e48-AIdWY0hlYper6cWD/P7SfL+Dvt4\"",
    "mtime": "2025-11-26T22:47:33.691Z",
    "size": 360008,
    "path": "../public/assets/images/front-pages/landing-page/hero-elements-light.png"
  },
  "/assets/images/front-pages/landing-page/lets-contact.png": {
    "type": "image/png",
    "etag": "\"f3d0-zZ1S5WT5/+iCPdcRRZx8ummkb0c\"",
    "mtime": "2025-11-26T22:47:33.692Z",
    "size": 62416,
    "path": "../public/assets/images/front-pages/landing-page/lets-contact.png"
  },
  "/assets/images/front-pages/landing-page/team-member-1.png": {
    "type": "image/png",
    "etag": "\"10e74-AbCbrRjUIpotaMHFPclm+Hih/fE\"",
    "mtime": "2025-11-26T22:47:33.693Z",
    "size": 69236,
    "path": "../public/assets/images/front-pages/landing-page/team-member-1.png"
  },
  "/assets/images/front-pages/landing-page/team-member-2.png": {
    "type": "image/png",
    "etag": "\"106dd-TWO+5fEa2IjB/2Mt2a6hvpmTYeo\"",
    "mtime": "2025-11-26T22:47:33.695Z",
    "size": 67293,
    "path": "../public/assets/images/front-pages/landing-page/team-member-2.png"
  },
  "/assets/images/front-pages/landing-page/team-member-3.png": {
    "type": "image/png",
    "etag": "\"13c7c-/csRC/rG/QIY534TlSVT1Y7bajs\"",
    "mtime": "2025-11-26T22:47:33.696Z",
    "size": 81020,
    "path": "../public/assets/images/front-pages/landing-page/team-member-3.png"
  },
  "/assets/images/front-pages/landing-page/team-member-4.png": {
    "type": "image/png",
    "etag": "\"1599b-I8qHw2SBXhg9PUSHW03gvUAWDS8\"",
    "mtime": "2025-11-26T22:47:33.697Z",
    "size": 88475,
    "path": "../public/assets/images/front-pages/landing-page/team-member-4.png"
  },
  "/assets/images/front-pages/misc/checkout-image.png": {
    "type": "image/png",
    "etag": "\"c1c3-E6tt3glA826QPwEX8v/ZDex9j2Y\"",
    "mtime": "2025-11-26T22:47:33.700Z",
    "size": 49603,
    "path": "../public/assets/images/front-pages/misc/checkout-image.png"
  },
  "/assets/images/front-pages/misc/nav-item-col-img.png": {
    "type": "image/png",
    "etag": "\"10978-KU3ADwy8COVrYKO52OrXPkHBLsI\"",
    "mtime": "2025-11-26T22:47:33.701Z",
    "size": 67960,
    "path": "../public/assets/images/front-pages/misc/nav-item-col-img.png"
  },
  "/assets/images/front-pages/misc/product-image.png": {
    "type": "image/png",
    "etag": "\"198c0-EbYSCZLHYUrwb8Z9EO1vmuxt5gM\"",
    "mtime": "2025-11-26T22:47:33.703Z",
    "size": 104640,
    "path": "../public/assets/images/front-pages/misc/product-image.png"
  },
  "/assets/images/icons/countries/au.png": {
    "type": "image/png",
    "etag": "\"634-eZRw6exbKKMIVgGFJAgzB1m7cyU\"",
    "mtime": "2025-11-26T22:47:33.728Z",
    "size": 1588,
    "path": "../public/assets/images/icons/countries/au.png"
  },
  "/assets/images/icons/countries/br.png": {
    "type": "image/png",
    "etag": "\"70d-vP71VJvovFRj/Twfwe1+EEu+Yko\"",
    "mtime": "2025-11-26T22:47:33.728Z",
    "size": 1805,
    "path": "../public/assets/images/icons/countries/br.png"
  },
  "/assets/images/icons/countries/cn.png": {
    "type": "image/png",
    "etag": "\"458-YXyZpzdN/2NPWIeoQ7MSQeCAvkA\"",
    "mtime": "2025-11-26T22:47:33.728Z",
    "size": 1112,
    "path": "../public/assets/images/icons/countries/cn.png"
  },
  "/assets/images/icons/countries/fr.png": {
    "type": "image/png",
    "etag": "\"28f-50UAKNS89avSqYWng4nBZtBTKRo\"",
    "mtime": "2025-11-26T22:47:33.730Z",
    "size": 655,
    "path": "../public/assets/images/icons/countries/fr.png"
  },
  "/assets/images/icons/countries/in.png": {
    "type": "image/png",
    "etag": "\"444-VDvjULDBIPxTUvt951vEm0a720Y\"",
    "mtime": "2025-11-26T22:47:33.730Z",
    "size": 1092,
    "path": "../public/assets/images/icons/countries/in.png"
  },
  "/assets/images/icons/countries/ir.png": {
    "type": "image/png",
    "etag": "\"3d00-L3mF/p+gx8DdkD71gnJIORjzlEw\"",
    "mtime": "2025-11-26T22:47:33.730Z",
    "size": 15616,
    "path": "../public/assets/images/icons/countries/ir.png"
  },
  "/assets/images/icons/countries/us.png": {
    "type": "image/png",
    "etag": "\"5a0-MM8smg3Pu6wzZ+kEMXfzbRCHWdw\"",
    "mtime": "2025-11-26T22:47:33.732Z",
    "size": 1440,
    "path": "../public/assets/images/icons/countries/us.png"
  },
  "/assets/images/icons/file/txt.png": {
    "type": "image/png",
    "etag": "\"213-5qmlGdhfoysdXKht4JsJ/p85MXQ\"",
    "mtime": "2025-11-26T22:47:33.733Z",
    "size": 531,
    "path": "../public/assets/images/icons/file/txt.png"
  },
  "/assets/images/icons/file/xls.png": {
    "type": "image/png",
    "etag": "\"974-OxzmokgeeVpG1QLSMITKldILyCs\"",
    "mtime": "2025-11-26T22:47:33.734Z",
    "size": 2420,
    "path": "../public/assets/images/icons/file/xls.png"
  },
  "/assets/images/icons/payments/ae-icon.png": {
    "type": "image/png",
    "etag": "\"c98-bKUg7RXTcTXkCSgVuVrSqfaIOjY\"",
    "mtime": "2025-11-26T22:47:33.735Z",
    "size": 3224,
    "path": "../public/assets/images/icons/payments/ae-icon.png"
  },
  "/assets/images/icons/payments/american-express.png": {
    "type": "image/png",
    "etag": "\"2090-SyyNFuriECJ/62FJluQ9w1pwZVs\"",
    "mtime": "2025-11-26T22:47:33.737Z",
    "size": 8336,
    "path": "../public/assets/images/icons/payments/american-express.png"
  },
  "/assets/images/icons/payments/mastercard-icon.png": {
    "type": "image/png",
    "etag": "\"e3c-q/752rUYJY8LwCmx3bW8ySlF14c\"",
    "mtime": "2025-11-26T22:47:33.748Z",
    "size": 3644,
    "path": "../public/assets/images/icons/payments/mastercard-icon.png"
  },
  "/assets/images/icons/payments/mastercard.png": {
    "type": "image/png",
    "etag": "\"5ac-kRcBj0FYvlmEDMXKtfB3GBffsMw\"",
    "mtime": "2025-11-26T22:47:33.749Z",
    "size": 1452,
    "path": "../public/assets/images/icons/payments/mastercard.png"
  },
  "/assets/images/icons/payments/visa-icon.png": {
    "type": "image/png",
    "etag": "\"948-RF8T/ycIfejggwXgedDJkX//D+c\"",
    "mtime": "2025-11-26T22:47:33.750Z",
    "size": 2376,
    "path": "../public/assets/images/icons/payments/visa-icon.png"
  },
  "/assets/images/icons/payments/visa.png": {
    "type": "image/png",
    "etag": "\"af5-cCtFYZUsNZXUSaTqC8UR21reKkI\"",
    "mtime": "2025-11-26T22:47:33.751Z",
    "size": 2805,
    "path": "../public/assets/images/icons/payments/visa.png"
  },
  "/assets/images/icons/project-icons/event.png": {
    "type": "image/png",
    "etag": "\"31c-oVnXpiNqeuizoqz6+D6o8boIp6U\"",
    "mtime": "2025-11-26T22:47:33.753Z",
    "size": 796,
    "path": "../public/assets/images/icons/project-icons/event.png"
  },
  "/assets/images/icons/project-icons/figma.png": {
    "type": "image/png",
    "etag": "\"299-XLadh9eMCYZVoiWrm/hNP+P0gNk\"",
    "mtime": "2025-11-26T22:47:33.754Z",
    "size": 665,
    "path": "../public/assets/images/icons/project-icons/figma.png"
  },
  "/assets/images/icons/project-icons/html5.png": {
    "type": "image/png",
    "etag": "\"5e8-WRQ0LQ5P/4Tu9mqlu9Gx5EAWC3g\"",
    "mtime": "2025-11-26T22:47:33.755Z",
    "size": 1512,
    "path": "../public/assets/images/icons/project-icons/html5.png"
  },
  "/assets/images/icons/project-icons/pdf.png": {
    "type": "image/png",
    "etag": "\"30d-JM5iJSMk1ZPK5fq/sIwcnQJ5qds\"",
    "mtime": "2025-11-26T22:47:33.756Z",
    "size": 781,
    "path": "../public/assets/images/icons/project-icons/pdf.png"
  },
  "/assets/images/icons/project-icons/python.png": {
    "type": "image/png",
    "etag": "\"10a8-14x9dIxyWowcgWM4rY4k715ivFA\"",
    "mtime": "2025-11-26T22:47:33.757Z",
    "size": 4264,
    "path": "../public/assets/images/icons/project-icons/python.png"
  },
  "/assets/images/icons/project-icons/react.png": {
    "type": "image/png",
    "etag": "\"53c-bvZZQIKurBPtW5/SU/5inW69DqE\"",
    "mtime": "2025-11-26T22:47:33.757Z",
    "size": 1340,
    "path": "../public/assets/images/icons/project-icons/react.png"
  },
  "/assets/images/icons/project-icons/sketch.png": {
    "type": "image/png",
    "etag": "\"ee3-JpH9BHh5Qgkip6NIgeeLjsR5xr8\"",
    "mtime": "2025-11-26T22:47:33.758Z",
    "size": 3811,
    "path": "../public/assets/images/icons/project-icons/sketch.png"
  },
  "/assets/images/icons/project-icons/social.png": {
    "type": "image/png",
    "etag": "\"32a-aTJb7Br4F2WFqv+9v84lKVlchPw\"",
    "mtime": "2025-11-26T22:47:33.760Z",
    "size": 810,
    "path": "../public/assets/images/icons/project-icons/social.png"
  },
  "/assets/images/icons/project-icons/support.png": {
    "type": "image/png",
    "etag": "\"304-SFrZqWCzQ4yUkLoUIJb1vUHHHsI\"",
    "mtime": "2025-11-26T22:47:33.761Z",
    "size": 772,
    "path": "../public/assets/images/icons/project-icons/support.png"
  },
  "/assets/images/icons/project-icons/twitter.png": {
    "type": "image/png",
    "etag": "\"362-yR00hH3TAjstkRFxPQKkV6SoxZM\"",
    "mtime": "2025-11-26T22:47:33.761Z",
    "size": 866,
    "path": "../public/assets/images/icons/project-icons/twitter.png"
  },
  "/assets/images/icons/project-icons/vue.png": {
    "type": "image/png",
    "etag": "\"40d-YUeDt7AEQGB+Axje2OiqWFs0K78\"",
    "mtime": "2025-11-26T22:47:33.762Z",
    "size": 1037,
    "path": "../public/assets/images/icons/project-icons/vue.png"
  },
  "/assets/images/icons/project-icons/xamarin.png": {
    "type": "image/png",
    "etag": "\"104f-56TruhrV0DHj3JhshN8Lx5LS1bI\"",
    "mtime": "2025-11-26T22:47:33.763Z",
    "size": 4175,
    "path": "../public/assets/images/icons/project-icons/xamarin.png"
  },
  "/assets/images/icons/project-icons/xd.png": {
    "type": "image/png",
    "etag": "\"51a-HDyTzFXr7DfaeFSxR441gceaUTA\"",
    "mtime": "2025-11-26T22:47:33.764Z",
    "size": 1306,
    "path": "../public/assets/images/icons/project-icons/xd.png"
  },
  "/assets/images/icons/payments/img/ae-dark.png": {
    "type": "image/png",
    "etag": "\"877-yNC5UHLfyy/D6n21FrhnIQe48T4\"",
    "mtime": "2025-11-26T22:47:33.737Z",
    "size": 2167,
    "path": "../public/assets/images/icons/payments/img/ae-dark.png"
  },
  "/assets/images/icons/payments/img/american-express.png": {
    "type": "image/png",
    "etag": "\"651-f3gqYPyP6L/8blPRZb5AehTPG18\"",
    "mtime": "2025-11-26T22:47:33.737Z",
    "size": 1617,
    "path": "../public/assets/images/icons/payments/img/american-express.png"
  },
  "/assets/images/icons/payments/img/dc-dark.png": {
    "type": "image/png",
    "etag": "\"51f-420RKnssO0pVeAf8kbbLhpMvKy0\"",
    "mtime": "2025-11-26T22:47:33.739Z",
    "size": 1311,
    "path": "../public/assets/images/icons/payments/img/dc-dark.png"
  },
  "/assets/images/icons/payments/img/dc-light.png": {
    "type": "image/png",
    "etag": "\"53b-FwTK4loS7F+GsjyDeCcFxJ4ufZA\"",
    "mtime": "2025-11-26T22:47:33.739Z",
    "size": 1339,
    "path": "../public/assets/images/icons/payments/img/dc-light.png"
  },
  "/assets/images/icons/payments/img/jcb-dark.png": {
    "type": "image/png",
    "etag": "\"4f1-h0733iAOMmG3R3eq6NEBYqSN85E\"",
    "mtime": "2025-11-26T22:47:33.741Z",
    "size": 1265,
    "path": "../public/assets/images/icons/payments/img/jcb-dark.png"
  },
  "/assets/images/icons/payments/img/jcb-light.png": {
    "type": "image/png",
    "etag": "\"4fc-80OndbJCjmMlbPexQ1Vf4ANFCGA\"",
    "mtime": "2025-11-26T22:47:33.742Z",
    "size": 1276,
    "path": "../public/assets/images/icons/payments/img/jcb-light.png"
  },
  "/assets/images/icons/payments/img/master-dark.png": {
    "type": "image/png",
    "etag": "\"997-cELCyGItVu+5ld2YfWFYPLmK18I\"",
    "mtime": "2025-11-26T22:47:33.743Z",
    "size": 2455,
    "path": "../public/assets/images/icons/payments/img/master-dark.png"
  },
  "/assets/images/icons/payments/img/mastercard.png": {
    "type": "image/png",
    "etag": "\"996-5CTRbYj2ZUp+UxFOCq0yZsBHP0g\"",
    "mtime": "2025-11-26T22:47:33.744Z",
    "size": 2454,
    "path": "../public/assets/images/icons/payments/img/mastercard.png"
  },
  "/assets/images/icons/payments/img/paypal-dark.png": {
    "type": "image/png",
    "etag": "\"575-Pv70ysgi5A5KGWX80gXSLdBOwak\"",
    "mtime": "2025-11-26T22:47:33.744Z",
    "size": 1397,
    "path": "../public/assets/images/icons/payments/img/paypal-dark.png"
  },
  "/assets/images/icons/payments/img/paypal-light.png": {
    "type": "image/png",
    "etag": "\"54f-WsaOEWRjykIslO8Qv7sKcfoHCgU\"",
    "mtime": "2025-11-26T22:47:33.746Z",
    "size": 1359,
    "path": "../public/assets/images/icons/payments/img/paypal-light.png"
  },
  "/assets/images/icons/payments/img/visa-dark.png": {
    "type": "image/png",
    "etag": "\"6d5-oktkzP/TWBa3CtYmpnn3mpx2JUY\"",
    "mtime": "2025-11-26T22:47:33.746Z",
    "size": 1749,
    "path": "../public/assets/images/icons/payments/img/visa-dark.png"
  },
  "/assets/images/icons/payments/img/visa-light.png": {
    "type": "image/png",
    "etag": "\"6ea-3c6E+o8PMbm3Wqeq3NfqK+LzSNA\"",
    "mtime": "2025-11-26T22:47:33.747Z",
    "size": 1770,
    "path": "../public/assets/images/icons/payments/img/visa-light.png"
  }
};

const _DRIVE_LETTER_START_RE = /^[A-Za-z]:\//;
function normalizeWindowsPath(input = "") {
  if (!input) {
    return input;
  }
  return input.replace(/\\/g, "/").replace(_DRIVE_LETTER_START_RE, (r) => r.toUpperCase());
}
const _IS_ABSOLUTE_RE = /^[/\\](?![/\\])|^[/\\]{2}(?!\.)|^[A-Za-z]:[/\\]/;
const _DRIVE_LETTER_RE = /^[A-Za-z]:$/;
const _ROOT_FOLDER_RE = /^\/([A-Za-z]:)?$/;
function cwd() {
  if (typeof process !== "undefined" && typeof process.cwd === "function") {
    return process.cwd().replace(/\\/g, "/");
  }
  return "/";
}
const resolve = function(...arguments_) {
  arguments_ = arguments_.map((argument) => normalizeWindowsPath(argument));
  let resolvedPath = "";
  let resolvedAbsolute = false;
  for (let index = arguments_.length - 1; index >= -1 && !resolvedAbsolute; index--) {
    const path = index >= 0 ? arguments_[index] : cwd();
    if (!path || path.length === 0) {
      continue;
    }
    resolvedPath = `${path}/${resolvedPath}`;
    resolvedAbsolute = isAbsolute(path);
  }
  resolvedPath = normalizeString(resolvedPath, !resolvedAbsolute);
  if (resolvedAbsolute && !isAbsolute(resolvedPath)) {
    return `/${resolvedPath}`;
  }
  return resolvedPath.length > 0 ? resolvedPath : ".";
};
function normalizeString(path, allowAboveRoot) {
  let res = "";
  let lastSegmentLength = 0;
  let lastSlash = -1;
  let dots = 0;
  let char = null;
  for (let index = 0; index <= path.length; ++index) {
    if (index < path.length) {
      char = path[index];
    } else if (char === "/") {
      break;
    } else {
      char = "/";
    }
    if (char === "/") {
      if (lastSlash === index - 1 || dots === 1) ; else if (dots === 2) {
        if (res.length < 2 || lastSegmentLength !== 2 || res[res.length - 1] !== "." || res[res.length - 2] !== ".") {
          if (res.length > 2) {
            const lastSlashIndex = res.lastIndexOf("/");
            if (lastSlashIndex === -1) {
              res = "";
              lastSegmentLength = 0;
            } else {
              res = res.slice(0, lastSlashIndex);
              lastSegmentLength = res.length - 1 - res.lastIndexOf("/");
            }
            lastSlash = index;
            dots = 0;
            continue;
          } else if (res.length > 0) {
            res = "";
            lastSegmentLength = 0;
            lastSlash = index;
            dots = 0;
            continue;
          }
        }
        if (allowAboveRoot) {
          res += res.length > 0 ? "/.." : "..";
          lastSegmentLength = 2;
        }
      } else {
        if (res.length > 0) {
          res += `/${path.slice(lastSlash + 1, index)}`;
        } else {
          res = path.slice(lastSlash + 1, index);
        }
        lastSegmentLength = index - lastSlash - 1;
      }
      lastSlash = index;
      dots = 0;
    } else if (char === "." && dots !== -1) {
      ++dots;
    } else {
      dots = -1;
    }
  }
  return res;
}
const isAbsolute = function(p) {
  return _IS_ABSOLUTE_RE.test(p);
};
const relative = function(from, to) {
  const _from = resolve(from).replace(_ROOT_FOLDER_RE, "$1").split("/");
  const _to = resolve(to).replace(_ROOT_FOLDER_RE, "$1").split("/");
  if (_to[0][1] === ":" && _from[0][1] === ":" && _from[0] !== _to[0]) {
    return _to.join("/");
  }
  const _fromCopy = [..._from];
  for (const segment of _fromCopy) {
    if (_to[0] !== segment) {
      break;
    }
    _from.shift();
    _to.shift();
  }
  return [..._from.map(() => ".."), ..._to].join("/");
};
const dirname = function(p) {
  const segments = normalizeWindowsPath(p).replace(/\/$/, "").split("/").slice(0, -1);
  if (segments.length === 1 && _DRIVE_LETTER_RE.test(segments[0])) {
    segments[0] += "/";
  }
  return segments.join("/") || (isAbsolute(p) ? "/" : ".");
};

function readAsset (id) {
  const serverDir = dirname(fileURLToPath(globalThis._importMeta_.url));
  return promises.readFile(resolve(serverDir, assets[id].path))
}

const publicAssetBases = {"/_nuxt/builds/meta/":{"maxAge":31536000},"/_nuxt/builds/":{"maxAge":1},"/_nuxt/":{"maxAge":31536000}};

function isPublicAssetURL(id = '') {
  if (assets[id]) {
    return true
  }
  for (const base in publicAssetBases) {
    if (id.startsWith(base)) { return true }
  }
  return false
}

function getAsset (id) {
  return assets[id]
}

const METHODS = /* @__PURE__ */ new Set(["HEAD", "GET"]);
const EncodingMap = { gzip: ".gz", br: ".br" };
const _fl4LWE = eventHandler((event) => {
  if (event.method && !METHODS.has(event.method)) {
    return;
  }
  let id = decodePath(
    withLeadingSlash(withoutTrailingSlash(parseURL(event.path).pathname))
  );
  let asset;
  const encodingHeader = String(
    getRequestHeader(event, "accept-encoding") || ""
  );
  const encodings = [
    ...encodingHeader.split(",").map((e) => EncodingMap[e.trim()]).filter(Boolean).sort(),
    ""
  ];
  if (encodings.length > 1) {
    appendResponseHeader(event, "Vary", "Accept-Encoding");
  }
  for (const encoding of encodings) {
    for (const _id of [id + encoding, joinURL(id, "index.html" + encoding)]) {
      const _asset = getAsset(_id);
      if (_asset) {
        asset = _asset;
        id = _id;
        break;
      }
    }
  }
  if (!asset) {
    if (isPublicAssetURL(id)) {
      removeResponseHeader(event, "Cache-Control");
      throw createError$1({ statusCode: 404 });
    }
    return;
  }
  const ifNotMatch = getRequestHeader(event, "if-none-match") === asset.etag;
  if (ifNotMatch) {
    setResponseStatus(event, 304, "Not Modified");
    return "";
  }
  const ifModifiedSinceH = getRequestHeader(event, "if-modified-since");
  const mtimeDate = new Date(asset.mtime);
  if (ifModifiedSinceH && asset.mtime && new Date(ifModifiedSinceH) >= mtimeDate) {
    setResponseStatus(event, 304, "Not Modified");
    return "";
  }
  if (asset.type && !getResponseHeader(event, "Content-Type")) {
    setResponseHeader(event, "Content-Type", asset.type);
  }
  if (asset.etag && !getResponseHeader(event, "ETag")) {
    setResponseHeader(event, "ETag", asset.etag);
  }
  if (asset.mtime && !getResponseHeader(event, "Last-Modified")) {
    setResponseHeader(event, "Last-Modified", mtimeDate.toUTCString());
  }
  if (asset.encoding && !getResponseHeader(event, "Content-Encoding")) {
    setResponseHeader(event, "Content-Encoding", asset.encoding);
  }
  if (asset.size > 0 && !getResponseHeader(event, "Content-Length")) {
    setResponseHeader(event, "Content-Length", asset.size);
  }
  return readAsset(id);
});

const _4LorV2 = defineEventHandler(async (event) => {
  var _a;
  if ((_a = event.node.req.url) == null ? void 0 : _a.startsWith("/preview")) {
    setHeader(event, "X-Frame-Options", "SAMEORIGIN");
    setHeader(event, "Content-Security-Policy", "frame-ancestors 'self'");
  }
});

const _SxA8c9 = defineEventHandler(() => {});

const _lazy_zaHTfc = () => import('../routes/api/_..._.mjs');
const _lazy_TBLDFr = () => import('../routes/api/auth/sendEmailOtp.post.mjs');
const _lazy_rJpONL = () => import('../routes/api/auth/sendOtpCode.post.mjs');
const _lazy_0jAeca = () => import('../routes/api/auth/verifyEmailOtp.post.mjs');
const _lazy_pjQAb9 = () => import('../routes/api/auth/verifyOtpCode.post.mjs');
const _lazy_7q4QIH = () => import('../routes/api/discount/apply.post.mjs');
const _lazy_4rV2Tt = () => import('../routes/api/discount/validate.post.mjs');
const _lazy_B2M49f = () => import('../routes/api/get-preview-stats.get.mjs').then(function (n) { return n.g; });
const _lazy__Gf415 = () => import('../routes/api/health.get.mjs');
const _lazy_pHsWw2 = () => import('../routes/api/payment.post.mjs');
const _lazy_TWMAQh = () => import('../routes/api/routes/data.mjs');
const _lazy_VEL4_c = () => import('../routes/api/sitemap.xml.mjs');
const _lazy_2zAlrb = () => import('../routes/api/user.get.mjs');
const _lazy_d_dowO = () => import('../routes/api/user/setReferralCode.post.mjs');
const _lazy_khQkQ2 = () => import('../routes/api/v1/cards/createDefaultCard.post.mjs');
const _lazy_RR0OF2 = () => import('../routes/api/v1/index.post.mjs');
const _lazy_AVDERJ = () => import('../routes/profile/_slug/_...rest_.get.mjs');
const _lazy_ygH2uj = () => import('../routes/renderer.mjs').then(function (n) { return n.r; });

const handlers = [
  { route: '', handler: _fl4LWE, lazy: false, middleware: true, method: undefined },
  { route: '', handler: _4LorV2, lazy: false, middleware: true, method: undefined },
  { route: '/api/**', handler: _lazy_zaHTfc, lazy: true, middleware: false, method: undefined },
  { route: '/api/auth/sendEmailOtp', handler: _lazy_TBLDFr, lazy: true, middleware: false, method: "post" },
  { route: '/api/auth/sendOtpCode', handler: _lazy_rJpONL, lazy: true, middleware: false, method: "post" },
  { route: '/api/auth/verifyEmailOtp', handler: _lazy_0jAeca, lazy: true, middleware: false, method: "post" },
  { route: '/api/auth/verifyOtpCode', handler: _lazy_pjQAb9, lazy: true, middleware: false, method: "post" },
  { route: '/api/discount/apply', handler: _lazy_7q4QIH, lazy: true, middleware: false, method: "post" },
  { route: '/api/discount/validate', handler: _lazy_4rV2Tt, lazy: true, middleware: false, method: "post" },
  { route: '/api/get-preview-stats', handler: _lazy_B2M49f, lazy: true, middleware: false, method: "get" },
  { route: '/api/health', handler: _lazy__Gf415, lazy: true, middleware: false, method: "get" },
  { route: '/api/payment', handler: _lazy_pHsWw2, lazy: true, middleware: false, method: "post" },
  { route: '/api/routes/data', handler: _lazy_TWMAQh, lazy: true, middleware: false, method: undefined },
  { route: '/api/sitemap.xml', handler: _lazy_VEL4_c, lazy: true, middleware: false, method: undefined },
  { route: '/api/user', handler: _lazy_2zAlrb, lazy: true, middleware: false, method: "get" },
  { route: '/api/user/setReferralCode', handler: _lazy_d_dowO, lazy: true, middleware: false, method: "post" },
  { route: '/api/v1/cards/createDefaultCard', handler: _lazy_khQkQ2, lazy: true, middleware: false, method: "post" },
  { route: '/api/v1/cards', handler: _lazy_RR0OF2, lazy: true, middleware: false, method: "post" },
  { route: '/profile/:slug/**:rest', handler: _lazy_AVDERJ, lazy: true, middleware: false, method: "get" },
  { route: '/__nuxt_error', handler: _lazy_ygH2uj, lazy: true, middleware: false, method: undefined },
  { route: '/__nuxt_island/**', handler: _SxA8c9, lazy: false, middleware: false, method: undefined },
  { route: '/**', handler: _lazy_ygH2uj, lazy: true, middleware: false, method: undefined }
];

function createNitroApp() {
  const config = useRuntimeConfig();
  const hooks = createHooks();
  const captureError = (error, context = {}) => {
    const promise = hooks.callHookParallel("error", error, context).catch((error_) => {
      console.error("Error while capturing another error", error_);
    });
    if (context.event && isEvent(context.event)) {
      const errors = context.event.context.nitro?.errors;
      if (errors) {
        errors.push({ error, context });
      }
      if (context.event.waitUntil) {
        context.event.waitUntil(promise);
      }
    }
  };
  const h3App = createApp({
    debug: destr(false),
    onError: (error, event) => {
      captureError(error, { event, tags: ["request"] });
      return errorHandler(error, event);
    },
    onRequest: async (event) => {
      event.context.nitro = event.context.nitro || { errors: [] };
      const fetchContext = event.node.req?.__unenv__;
      if (fetchContext?._platform) {
        event.context = {
          _platform: fetchContext?._platform,
          // #3335
          ...fetchContext._platform,
          ...event.context
        };
      }
      if (!event.context.waitUntil && fetchContext?.waitUntil) {
        event.context.waitUntil = fetchContext.waitUntil;
      }
      event.fetch = (req, init) => fetchWithEvent(event, req, init, { fetch: localFetch });
      event.$fetch = (req, init) => fetchWithEvent(event, req, init, {
        fetch: $fetch
      });
      event.waitUntil = (promise) => {
        if (!event.context.nitro._waitUntilPromises) {
          event.context.nitro._waitUntilPromises = [];
        }
        event.context.nitro._waitUntilPromises.push(promise);
        if (event.context.waitUntil) {
          event.context.waitUntil(promise);
        }
      };
      event.captureError = (error, context) => {
        captureError(error, { event, ...context });
      };
      await nitroApp.hooks.callHook("request", event).catch((error) => {
        captureError(error, { event, tags: ["request"] });
      });
    },
    onBeforeResponse: async (event, response) => {
      await nitroApp.hooks.callHook("beforeResponse", event, response).catch((error) => {
        captureError(error, { event, tags: ["request", "response"] });
      });
    },
    onAfterResponse: async (event, response) => {
      await nitroApp.hooks.callHook("afterResponse", event, response).catch((error) => {
        captureError(error, { event, tags: ["request", "response"] });
      });
    }
  });
  const router = createRouter({
    preemptive: true
  });
  const nodeHandler = toNodeListener(h3App);
  const localCall = (aRequest) => b(
    nodeHandler,
    aRequest
  );
  const localFetch = (input, init) => {
    if (!input.toString().startsWith("/")) {
      return globalThis.fetch(input, init);
    }
    return C(
      nodeHandler,
      input,
      init
    ).then((response) => normalizeFetchResponse(response));
  };
  const $fetch = createFetch({
    fetch: localFetch,
    Headers: Headers$1,
    defaults: { baseURL: config.app.baseURL }
  });
  globalThis.$fetch = $fetch;
  h3App.use(createRouteRulesHandler({ localFetch }));
  for (const h of handlers) {
    let handler = h.lazy ? lazyEventHandler(h.handler) : h.handler;
    if (h.middleware || !h.route) {
      const middlewareBase = (config.app.baseURL + (h.route || "/")).replace(
        /\/+/g,
        "/"
      );
      h3App.use(middlewareBase, handler);
    } else {
      const routeRules = getRouteRulesForPath(
        h.route.replace(/:\w+|\*\*/g, "_")
      );
      if (routeRules.cache) {
        handler = cachedEventHandler(handler, {
          group: "nitro/routes",
          ...routeRules.cache
        });
      }
      router.use(h.route, handler, h.method);
    }
  }
  h3App.use(config.app.baseURL, router.handler);
  const app = {
    hooks,
    h3App,
    router,
    localCall,
    localFetch,
    captureError
  };
  return app;
}
function runNitroPlugins(nitroApp2) {
  for (const plugin of plugins) {
    try {
      plugin(nitroApp2);
    } catch (error) {
      nitroApp2.captureError(error, { tags: ["plugin"] });
      throw error;
    }
  }
}
const nitroApp = createNitroApp();
function useNitroApp() {
  return nitroApp;
}
runNitroPlugins(nitroApp);

function defineRenderHandler(render) {
  const runtimeConfig = useRuntimeConfig();
  return eventHandler(async (event) => {
    const nitroApp = useNitroApp();
    const ctx = { event, render, response: void 0 };
    await nitroApp.hooks.callHook("render:before", ctx);
    if (!ctx.response) {
      if (event.path === `${runtimeConfig.app.baseURL}favicon.ico`) {
        setResponseHeader(event, "Content-Type", "image/x-icon");
        return send(
          event,
          "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7"
        );
      }
      ctx.response = await ctx.render(event);
      if (!ctx.response) {
        const _currentStatus = getResponseStatus(event);
        setResponseStatus(event, _currentStatus === 200 ? 500 : _currentStatus);
        return send(
          event,
          "No response returned from render handler: " + event.path
        );
      }
    }
    await nitroApp.hooks.callHook("render:response", ctx.response, ctx);
    if (ctx.response.headers) {
      setResponseHeaders(event, ctx.response.headers);
    }
    if (ctx.response.statusCode || ctx.response.statusMessage) {
      setResponseStatus(
        event,
        ctx.response.statusCode,
        ctx.response.statusMessage
      );
    }
    return ctx.response.body;
  });
}

const debug = (...args) => {
};
function GracefulShutdown(server, opts) {
  opts = opts || {};
  const options = Object.assign(
    {
      signals: "SIGINT SIGTERM",
      timeout: 3e4,
      development: false,
      forceExit: true,
      onShutdown: (signal) => Promise.resolve(signal),
      preShutdown: (signal) => Promise.resolve(signal)
    },
    opts
  );
  let isShuttingDown = false;
  const connections = {};
  let connectionCounter = 0;
  const secureConnections = {};
  let secureConnectionCounter = 0;
  let failed = false;
  let finalRun = false;
  function onceFactory() {
    let called = false;
    return (emitter, events, callback) => {
      function call() {
        if (!called) {
          called = true;
          return Reflect.apply(callback, this, arguments);
        }
      }
      for (const e of events) {
        emitter.on(e, call);
      }
    };
  }
  const signals = options.signals.split(" ").map((s) => s.trim()).filter((s) => s.length > 0);
  const once = onceFactory();
  once(process, signals, (signal) => {
    debug("received shut down signal", signal);
    shutdown(signal).then(() => {
      if (options.forceExit) {
        process.exit(failed ? 1 : 0);
      }
    }).catch((error) => {
      debug("server shut down error occurred", error);
      process.exit(1);
    });
  });
  function isFunction(functionToCheck) {
    const getType = Object.prototype.toString.call(functionToCheck);
    return /^\[object\s([A-Za-z]+)?Function]$/.test(getType);
  }
  function destroy(socket, force = false) {
    if (socket._isIdle && isShuttingDown || force) {
      socket.destroy();
      if (socket.server instanceof http.Server) {
        delete connections[socket._connectionId];
      } else {
        delete secureConnections[socket._connectionId];
      }
    }
  }
  function destroyAllConnections(force = false) {
    debug("Destroy Connections : " + (force ? "forced close" : "close"));
    let counter = 0;
    let secureCounter = 0;
    for (const key of Object.keys(connections)) {
      const socket = connections[key];
      const serverResponse = socket._httpMessage;
      if (serverResponse && !force) {
        if (!serverResponse.headersSent) {
          serverResponse.setHeader("connection", "close");
        }
      } else {
        counter++;
        destroy(socket);
      }
    }
    debug("Connections destroyed : " + counter);
    debug("Connection Counter    : " + connectionCounter);
    for (const key of Object.keys(secureConnections)) {
      const socket = secureConnections[key];
      const serverResponse = socket._httpMessage;
      if (serverResponse && !force) {
        if (!serverResponse.headersSent) {
          serverResponse.setHeader("connection", "close");
        }
      } else {
        secureCounter++;
        destroy(socket);
      }
    }
    debug("Secure Connections destroyed : " + secureCounter);
    debug("Secure Connection Counter    : " + secureConnectionCounter);
  }
  server.on("request", (req, res) => {
    req.socket._isIdle = false;
    if (isShuttingDown && !res.headersSent) {
      res.setHeader("connection", "close");
    }
    res.on("finish", () => {
      req.socket._isIdle = true;
      destroy(req.socket);
    });
  });
  server.on("connection", (socket) => {
    if (isShuttingDown) {
      socket.destroy();
    } else {
      const id = connectionCounter++;
      socket._isIdle = true;
      socket._connectionId = id;
      connections[id] = socket;
      socket.once("close", () => {
        delete connections[socket._connectionId];
      });
    }
  });
  server.on("secureConnection", (socket) => {
    if (isShuttingDown) {
      socket.destroy();
    } else {
      const id = secureConnectionCounter++;
      socket._isIdle = true;
      socket._connectionId = id;
      secureConnections[id] = socket;
      socket.once("close", () => {
        delete secureConnections[socket._connectionId];
      });
    }
  });
  process.on("close", () => {
    debug("closed");
  });
  function shutdown(sig) {
    function cleanupHttp() {
      destroyAllConnections();
      debug("Close http server");
      return new Promise((resolve, reject) => {
        server.close((err) => {
          if (err) {
            return reject(err);
          }
          return resolve(true);
        });
      });
    }
    debug("shutdown signal - " + sig);
    if (options.development) {
      debug("DEV-Mode - immediate forceful shutdown");
      return process.exit(0);
    }
    function finalHandler() {
      if (!finalRun) {
        finalRun = true;
        if (options.finally && isFunction(options.finally)) {
          debug("executing finally()");
          options.finally();
        }
      }
      return Promise.resolve();
    }
    function waitForReadyToShutDown(totalNumInterval) {
      debug(`waitForReadyToShutDown... ${totalNumInterval}`);
      if (totalNumInterval === 0) {
        debug(
          `Could not close connections in time (${options.timeout}ms), will forcefully shut down`
        );
        return Promise.resolve(true);
      }
      const allConnectionsClosed = Object.keys(connections).length === 0 && Object.keys(secureConnections).length === 0;
      if (allConnectionsClosed) {
        debug("All connections closed. Continue to shutting down");
        return Promise.resolve(false);
      }
      debug("Schedule the next waitForReadyToShutdown");
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve(waitForReadyToShutDown(totalNumInterval - 1));
        }, 250);
      });
    }
    if (isShuttingDown) {
      return Promise.resolve();
    }
    debug("shutting down");
    return options.preShutdown(sig).then(() => {
      isShuttingDown = true;
      cleanupHttp();
    }).then(() => {
      const pollIterations = options.timeout ? Math.round(options.timeout / 250) : 0;
      return waitForReadyToShutDown(pollIterations);
    }).then((force) => {
      debug("Do onShutdown now");
      if (force) {
        destroyAllConnections(force);
      }
      return options.onShutdown(sig);
    }).then(finalHandler).catch((error) => {
      const errString = typeof error === "string" ? error : JSON.stringify(error);
      debug(errString);
      failed = true;
      throw errString;
    });
  }
  function shutdownManual() {
    return shutdown("manual");
  }
  return shutdownManual;
}

function getGracefulShutdownConfig() {
  return {
    disabled: !!process.env.NITRO_SHUTDOWN_DISABLED,
    signals: (process.env.NITRO_SHUTDOWN_SIGNALS || "SIGTERM SIGINT").split(" ").map((s) => s.trim()),
    timeout: Number.parseInt(process.env.NITRO_SHUTDOWN_TIMEOUT || "", 10) || 3e4,
    forceExit: !process.env.NITRO_SHUTDOWN_NO_FORCE_EXIT
  };
}
function setupGracefulShutdown(listener, nitroApp) {
  const shutdownConfig = getGracefulShutdownConfig();
  if (shutdownConfig.disabled) {
    return;
  }
  GracefulShutdown(listener, {
    signals: shutdownConfig.signals.join(" "),
    timeout: shutdownConfig.timeout,
    forceExit: shutdownConfig.forceExit,
    onShutdown: async () => {
      await new Promise((resolve) => {
        const timeout = setTimeout(() => {
          console.warn("Graceful shutdown timeout, force exiting...");
          resolve();
        }, shutdownConfig.timeout);
        nitroApp.hooks.callHook("close").catch((error) => {
          console.error(error);
        }).finally(() => {
          clearTimeout(timeout);
          resolve();
        });
      });
    }
  });
}

export { $fetch as $, setCookie as A, getCookie as B, deleteCookie as C, joinRelativeURL as D, useRuntimeConfig as E, defineRenderHandler as F, getQuery as G, getRouteRules as H, relative as I, useNitroApp as J, getResponseStatusText as K, getResponseStatus as L, toNodeListener as M, trapUnhandledNodeErrors as N, setupGracefulShutdown as O, sendRedirect as a, parseQuery as b, createError$1 as c, defineEventHandler as d, sanitizeStatusCode as e, getContext as f, getHeader as g, hasProtocol as h, isScriptProtocol as i, joinURL as j, withTrailingSlash as k, withoutTrailingSlash as l, createHooks as m, executeAsync as n, ofetch as o, proxyRequest as p, createRouter$1 as q, readBody as r, setHeader as s, toRouteMatcher as t, defu as u, destr as v, withQuery as w, klona as x, getRequestHeader as y, isEqual as z };
//# sourceMappingURL=nitro.mjs.map
