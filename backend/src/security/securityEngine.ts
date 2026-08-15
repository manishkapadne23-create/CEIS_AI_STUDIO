import { validateUserLicense } from "./licenseManager.js";
import { getEsipfPublicConfig } from "./loadSecurityConfig.js";
import { detectDebugMode, detectTamperHeaders, verifyEnvironment } from "./tamperDetection.js";
import type { EsipfSecurityPackage } from "./types.js";

const ENGINE_VERSION = "1.0.0";

export const runSecurityEngine = async (
  userId?: string | null
): Promise<EsipfSecurityPackage> => {
  const environmentVerified = verifyEnvironment();
  const tamperDetected = detectDebugMode() && process.env.NODE_ENV === "production";

  let license = null;
  if (userId) {
    license = await validateUserLicense(userId);
  }

  return {
    engine:
      "Enterprise Security, IP Protection & Anti-Reverse Engineering Framework",
    version: ENGINE_VERSION,
    environmentVerified,
    tamperDetected,
    license,
    generatedAt: new Date().toISOString(),
  };
};

export const getSecurityEngineConfig = () => getEsipfPublicConfig();

export const inspectRequestSecurity = (headers: Record<string, unknown>) => ({
  environmentVerified: verifyEnvironment(),
  tamperDetected: detectTamperHeaders(headers),
  debugMode: detectDebugMode(),
});
