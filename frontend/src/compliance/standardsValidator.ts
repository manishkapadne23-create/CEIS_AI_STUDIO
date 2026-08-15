import { getStandardsCatalogByDisciplineId } from "../config/standards";
import { extractStandardsFromText } from "../documents/documentParser";
import type { StandardsFamily, StandardsValidationResult } from "./types";

export const STANDARDS_FAMILIES: StandardsFamily[] = [
  { id: "irc", label: "IRC (Indian Roads Congress)", patterns: [/\bIRC\b/i, /\bIRC\s*[\d:]/i], disciplines: ["civil-engineering", "railway-engineering"] },
  { id: "is", label: "IS Codes (Bureau of Indian Standards)", patterns: [/\bIS\s*\d+/i, /\bIS:\s*\d+/i], disciplines: ["civil-engineering", "mechanical-engineering", "electrical-engineering"] },
  { id: "morth", label: "MoRTH Specifications", patterns: [/\bMoRTH\b/i, /\bMORTH\b/i], disciplines: ["civil-engineering", "railway-engineering"] },
  { id: "nbc", label: "NBC (National Building Code)", patterns: [/\bNBC\b/i, /\bNational Building Code\b/i], disciplines: ["civil-engineering", "architecture-planning"] },
  { id: "asme", label: "ASME", patterns: [/\bASME\b/i], disciplines: ["mechanical-engineering", "chemical-engineering"] },
  { id: "api", label: "API", patterns: [/\bAPI\s*\d+/i], disciplines: ["oil-gas-engineering", "chemical-engineering"] },
  { id: "iec", label: "IEC", patterns: [/\bIEC\b/i, /\bIEC\s*\d+/i], disciplines: ["electrical-engineering", "electronics-telecommunication-engineering"] },
  { id: "ieee", label: "IEEE", patterns: [/\bIEEE\b/i], disciplines: ["electrical-engineering", "computer-engineering"] },
  { id: "iso", label: "ISO", patterns: [/\bISO\b/i, /\bISO\s*\d+/i], disciplines: [] },
  { id: "astm", label: "ASTM", patterns: [/\bASTM\b/i], disciplines: ["civil-engineering", "chemical-engineering"] },
  { id: "aashto", label: "AASHTO", patterns: [/\bAASHTO\b/i], disciplines: ["civil-engineering"] },
];

export const detectStandardsFamilies = (
  text: string,
  disciplineId: string | null
): StandardsFamily[] =>
  STANDARDS_FAMILIES.filter((family) => {
    const matchesPattern = family.patterns.some((pattern) => pattern.test(text));
    const matchesDiscipline =
      !disciplineId ||
      family.disciplines.length === 0 ||
      family.disciplines.includes(disciplineId);
    return matchesPattern && matchesDiscipline;
  });

export const validateStandardsCompliance = (
  message: string,
  disciplineId: string | null,
  selectedStandardCode?: string | null
): StandardsValidationResult => {
  const referencedStandards = extractStandardsFromText(message);
  if (selectedStandardCode && !referencedStandards.includes(selectedStandardCode)) {
    referencedStandards.unshift(selectedStandardCode);
  }

  const applicableFamilies = detectStandardsFamilies(message, disciplineId);

  const catalog = disciplineId
    ? getStandardsCatalogByDisciplineId(disciplineId)
    : null;
  const catalogCodes =
    catalog?.standards.slice(0, 8).map((s) => s.codeNumber) ?? [];

  const missingReferences: string[] = [];
  const complianceNotes: string[] = [];

  if (referencedStandards.length === 0 && catalogCodes.length > 0) {
    missingReferences.push(
      `No explicit standard cited — consider referencing: ${catalogCodes.slice(0, 4).join(", ")}`
    );
  }

  if (/\bhighway|expressway|pavement|bridge\b/i.test(message)) {
    if (!referencedStandards.some((s) => /IRC|MoRTH|IS/i.test(s))) {
      missingReferences.push("Highway/bridge work typically requires IRC or MoRTH reference");
    }
  }

  if (/\bbuilding|structural|concrete\b/i.test(message)) {
    if (!referencedStandards.some((s) => /IS\s*456|IS\s*800|NBC/i.test(s))) {
      missingReferences.push("Structural work typically requires IS 456, IS 800, or NBC reference");
    }
  }

  if (/\belectrical|transformer|cable\b/i.test(message)) {
    if (!referencedStandards.some((s) => /IEC|IEEE|IS/i.test(s))) {
      missingReferences.push("Electrical work typically requires IEC, IEEE, or IS reference");
    }
  }

  for (const family of applicableFamilies) {
    complianceNotes.push(`Check compliance with ${family.label}`);
  }

  if (catalogCodes.length > 0) {
    complianceNotes.push(
      `Discipline catalog standards available: ${catalogCodes.join(", ")}`
    );
  }

  return {
    referencedStandards,
    applicableFamilies,
    missingReferences,
    complianceNotes,
  };
};

export const formatStandardsValidationForPrompt = (
  result: StandardsValidationResult
): string => {
  return [
    `Referenced standards: ${result.referencedStandards.join(", ") || "none detected"}`,
    `Applicable families: ${result.applicableFamilies.map((f) => f.label).join(", ") || "general"}`,
    result.missingReferences.length > 0
      ? `Missing references:\n${result.missingReferences.map((m) => `  - ${m}`).join("\n")}`
      : "",
    result.complianceNotes.length > 0
      ? `Compliance notes:\n${result.complianceNotes.map((n) => `  - ${n}`).join("\n")}`
      : "",
  ]
    .filter(Boolean)
    .join("\n");
};
