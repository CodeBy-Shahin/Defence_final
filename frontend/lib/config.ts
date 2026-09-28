const DEFAULT_BACKEND_ORIGIN = "https://p-backend-mw09.onrender.com";
const DEFAULT_BACKEND_PORT = "";
const DEFAULT_API_PATH = "/api";

function getEnvValue(value: string | undefined) {
  const trimmed = value?.trim();
  return trimmed ? trimmed : undefined;
}

function normalizePath(path: string) {
  const trimmed = path.trim();
  const normalized = trimmed ? trimmed : DEFAULT_API_PATH;
  return normalized.startsWith("/") ? normalized : `/${normalized}`;
}

function normalizeOrigin(origin: string, port?: string) {
  try {
    const url = new URL(origin);

    if (port && !url.port) {
      url.port = port;
    }

    return url.toString().replace(/\/$/, "");
  } catch {
    const withoutTrailingSlash = origin.replace(/\/$/, "");
    const hasPort = /:\d+$/.test(withoutTrailingSlash);
    return port && !hasPort ? `${withoutTrailingSlash}:${port}` : withoutTrailingSlash;
  }
}

function normalizeApiBaseUrl(url: string) {
  const withoutTrailingSlash = url.replace(/\/$/, "");
  return withoutTrailingSlash.endsWith(DEFAULT_API_PATH)
    ? withoutTrailingSlash
    : `${withoutTrailingSlash}${DEFAULT_API_PATH}`;
}

function buildApiBaseUrl(options: {
  apiBaseUrl?: string;
  backendOrigin?: string;
  backendPort?: string;
  apiPath?: string;
}) {
  const apiBaseUrl = getEnvValue(options.apiBaseUrl);

  if (apiBaseUrl) {
    return normalizeApiBaseUrl(apiBaseUrl);
  }

  const backendOrigin = normalizeOrigin(
    getEnvValue(options.backendOrigin) ?? DEFAULT_BACKEND_ORIGIN,
    getEnvValue(options.backendPort) ?? DEFAULT_BACKEND_PORT,
  );
  const apiPath = normalizePath(getEnvValue(options.apiPath) ?? DEFAULT_API_PATH);

  return `${backendOrigin}${apiPath}`;
}

const publicApiBaseUrl = buildApiBaseUrl({
  apiBaseUrl: process.env.NEXT_PUBLIC_API_BASE_URL,
  backendOrigin: process.env.NEXT_PUBLIC_BACKEND_ORIGIN,
  backendPort: process.env.NEXT_PUBLIC_BACKEND_PORT,
  apiPath: process.env.NEXT_PUBLIC_API_PATH,
});

const internalApiBaseUrl = getEnvValue(process.env.INTERNAL_API_BASE_URL);
const explicitApiBaseUrl = getEnvValue(process.env.API_BASE_URL);

const serverApiBaseUrl =
  (internalApiBaseUrl ? normalizeApiBaseUrl(internalApiBaseUrl) : undefined) ??
  (explicitApiBaseUrl ? normalizeApiBaseUrl(explicitApiBaseUrl) : undefined) ??
  (getEnvValue(process.env.BACKEND_ORIGIN) || getEnvValue(process.env.BACKEND_PORT) || getEnvValue(process.env.API_PATH)
    ? buildApiBaseUrl({
        backendOrigin: process.env.BACKEND_ORIGIN,
        backendPort: process.env.BACKEND_PORT,
        apiPath: process.env.API_PATH,
      })
    : publicApiBaseUrl);

export const API_BASE_URL = typeof window === "undefined" ? serverApiBaseUrl : publicApiBaseUrl;
