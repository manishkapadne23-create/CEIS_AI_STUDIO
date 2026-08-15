const resolveApiBaseUrl = (): string => {
  const viteApiUrl = (import.meta as { env?: { VITE_API_URL?: string } }).env
    ?.VITE_API_URL;
  const base =
    typeof viteApiUrl === "string" && viteApiUrl.trim().length > 0
      ? viteApiUrl
      : "http://localhost:5000";
  return base.replace(/\/$/, "");
};

const API_BASE_URL = resolveApiBaseUrl();
const AI_API = `${API_BASE_URL}/api/v1/ai`;

export const getAiApiBaseUrl = (): string => AI_API;
