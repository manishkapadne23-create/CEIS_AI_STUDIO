export const CURRENT_VERSION = "1.0.0";

export const parseSemver = (
  version: string
): { major: number; minor: number; patch: number } | null => {
  const match = version.match(/^(\d+)\.(\d+)\.(\d+)/);
  if (!match) return null;
  return { major: Number(match[1]), minor: Number(match[2]), patch: Number(match[3]) };
};

export const getCurrentRelease = () => ({
  version: CURRENT_VERSION,
  date: "2026-08-03",
  notes: [
    "Enterprise Architecture Governance Framework",
    "Plugin & Extension Framework",
    "Multi-LLM Intelligence Layer",
  ],
  backwardCompatible: true,
});
