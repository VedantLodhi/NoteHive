/**
 * API origin (protocol + host + port), no trailing slash.
 *
 * - Set REACT_APP_API_URL or REACT_APP_BACKEND_URL when the API is on another host (e.g. production).
 * - In development, if those are unset, we default to http://127.0.0.1:PORT so the browser talks
 *   to Express directly (CORS is enabled on the server). This avoids CRA's package.json "proxy",
 *   which often fails silently if the dev server was not restarted or the backend is down.
 * - Optional: REACT_APP_DEV_API_PORT (default 5000) if the API listens on another port.
 */
const trim = (s) => String(s ?? "").trim().replace(/\/$/, "");

export function getApiOrigin() {
  const fromEnv = trim(process.env.REACT_APP_API_URL || process.env.REACT_APP_BACKEND_URL || "");
  if (fromEnv) return fromEnv;

  if (process.env.NODE_ENV === "development") {
    const port = trim(process.env.REACT_APP_DEV_API_PORT || "5000");
    return `http://127.0.0.1:${port}`;
  }

  return "";
}

/** Path must start with `/`, e.g. `/api/notes` */
export function apiUrl(path) {
  const p = path.startsWith("/") ? path : `/${path}`;
  const origin = getApiOrigin();
  return origin ? `${origin}${p}` : p;
}
