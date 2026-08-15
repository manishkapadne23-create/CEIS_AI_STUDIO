import type { ReleaseRecord } from "./types.js";

const RELEASE_HISTORY: ReleaseRecord[] = [
  {
    version: "1.0.0",
    date: "2026-08-03",
    notes: [
      "Multi-LLM Intelligence Layer",
      "Plugin & Extension Framework",
      "Enterprise Architecture Governance Framework",
      "Production infrastructure (logging, cache, queue, Docker)",
    ],
    breakingChanges: [],
    migrations: [],
    backwardCompatible: true,
  },
];

export const parseSemver = (
  version: string
): { major: number; minor: number; patch: number } | null => {
  const match = version.match(/^(\d+)\.(\d+)\.(\d+)/);
  if (!match) {
    return null;
  }
  return {
    major: Number(match[1]),
    minor: Number(match[2]),
    patch: Number(match[3]),
  };
};

export const isBackwardCompatible = (
  fromVersion: string,
  toVersion: string
): boolean => {
  const from = parseSemver(fromVersion);
  const to = parseSemver(toVersion);
  if (!from || !to) {
    return false;
  }
  return from.major === to.major;
};

export const getCurrentRelease = (): ReleaseRecord =>
  RELEASE_HISTORY[RELEASE_HISTORY.length - 1];

export const getReleaseHistory = (): ReleaseRecord[] => [...RELEASE_HISTORY];

export const createReleaseRecord = (
  version: string,
  notes: string[],
  options?: { breakingChanges?: string[]; migrations?: string[] }
): ReleaseRecord => {
  const previous = getCurrentRelease();
  const record: ReleaseRecord = {
    version,
    date: new Date().toISOString().slice(0, 10),
    notes,
    breakingChanges: options?.breakingChanges ?? [],
    migrations: options?.migrations ?? [],
    backwardCompatible: isBackwardCompatible(previous.version, version),
  };
  RELEASE_HISTORY.push(record);
  return record;
};

export const generateReleaseNotes = (release: ReleaseRecord): string =>
  [
    `# Sarathi AI v${release.version}`,
    `Date: ${release.date}`,
    "",
    "## Release Notes",
    ...release.notes.map((note) => `- ${note}`),
    "",
    release.breakingChanges.length > 0
      ? `## Breaking Changes\n${release.breakingChanges.map((c) => `- ${c}`).join("\n")}`
      : "",
    release.migrations.length > 0
      ? `## Migrations\n${release.migrations.map((m) => `- ${m}`).join("\n")}`
      : "",
    "",
    `Backward compatible: ${release.backwardCompatible ? "Yes" : "No"}`,
  ]
    .filter(Boolean)
    .join("\n");
