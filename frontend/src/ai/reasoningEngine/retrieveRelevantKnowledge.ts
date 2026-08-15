import {
  getStandardsCatalogByDisciplineId,
  searchStandardsMetadata,
  type EngineeringStandardMetadata,
} from "../../config/standards";
import {
  getCalculatorsCatalogByDisciplineId,
  searchCalculatorsMetadata,
} from "../../config/calculators";
import type { RetrievedKnowledgeArtifacts } from "./types";

const STANDARD_CODE_PATTERN =
  /\b(IS\s*\d+(?:\s*\(\s*Part\s*\d+\s*\))?|IRC[\s:-]?\d+|NBC\s*\d*|MORTH|ASTM\s*[A-Z]?\d+|AASHTO|BS\s*\d+|ISO\s*\d+|IEC\s*\d+)\b/gi;

const extractMentionedStandardCodes = (message: string): string[] => {
  const matches = message.match(STANDARD_CODE_PATTERN) ?? [];
  return [...new Set(matches.map((match) => match.trim().toUpperCase()))];
};

const scoreStandardRelevance = (
  standard: EngineeringStandardMetadata,
  message: string,
  mentionedCodes: string[]
): number => {
  const normalized = message.toLowerCase();
  let score = 0;

  const code = standard.codeNumber.toLowerCase();
  if (normalized.includes(code)) score += 10;
  if (mentionedCodes.some((mentioned) => code.includes(mentioned.toLowerCase()))) {
    score += 8;
  }

  if (standard.keywords.some((keyword) => normalized.includes(keyword.toLowerCase()))) {
    score += 3;
  }

  if (standard.title.toLowerCase().split(" ").some((word) => word.length > 4 && normalized.includes(word))) {
    score += 2;
  }

  if (standard.isPopular) score += 1;
  if (standard.isLatest) score += 1;

  return score;
};

const rankStandards = (
  standards: EngineeringStandardMetadata[],
  message: string,
  mentionedCodes: string[],
  limit: number
): EngineeringStandardMetadata[] =>
  standards
    .map((standard) => ({
      standard,
      score: scoreStandardRelevance(standard, message, mentionedCodes),
    }))
    .filter((entry) => entry.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((entry) => entry.standard);

export const retrieveRelevantKnowledge = (
  disciplineId: string | null,
  disciplineName: string | null,
  userMessage: string,
  selectedStandard: EngineeringStandardMetadata | null
): RetrievedKnowledgeArtifacts => {
  const mentionedStandardCodes = extractMentionedStandardCodes(userMessage);
  const standardsCatalog = getStandardsCatalogByDisciplineId(disciplineId);
  const calculatorsCatalog = getCalculatorsCatalogByDisciplineId(disciplineId);

  const allStandards = standardsCatalog?.standards ?? [];
  const searchedStandards = searchStandardsMetadata(
    allStandards,
    userMessage,
    disciplineName
  );

  const rankedStandards = rankStandards(
    searchedStandards.length > 0 ? searchedStandards : allStandards,
    userMessage,
    mentionedStandardCodes,
    6
  );

  const relevantStandards = selectedStandard
    ? [
        selectedStandard,
        ...rankedStandards.filter(
          (standard) => standard.id !== selectedStandard.id
        ),
      ].slice(0, 6)
    : rankedStandards.length > 0
      ? rankedStandards
      : allStandards.filter((s) => s.isPopular).slice(0, 4);

  const allCalculators = calculatorsCatalog?.calculators ?? [];
  const relevantCalculators = searchCalculatorsMetadata(
    allCalculators,
    userMessage,
    disciplineName
  ).slice(0, 4);

  return {
    relevantStandards,
    relevantCalculators,
    mentionedStandardCodes,
  };
};
