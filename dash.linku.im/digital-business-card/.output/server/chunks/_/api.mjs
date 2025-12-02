const getApiBaseUrl = () => {
  return process.env.NUXT_PUBLIC_API_BASE || "https://api.linku.im";
};
const getApiUrl = (path) => {
  const base = getApiBaseUrl();
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${base}/api${normalizedPath}`;
};

export { getApiBaseUrl as a, getApiUrl as g };
//# sourceMappingURL=api.mjs.map
