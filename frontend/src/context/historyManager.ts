import type { WorkspaceCategoryId } from "../workspace/utils/workspaceCategoryConfig";
import type {
  EngineeringCalculationRecord,
  EngineeringProjectContext,
  EngineeringResponseRecord,
} from "./memoryTypes";
import { updateDisciplineProjectContext } from "./disciplineMemory";

const MATERIAL_PATTERNS = [
  /\b(M\d{2,3}|grade\s+\d+\s+steel|fe\s*\d+)\b/gi,
  /\b(concrete|cement|aggregate|rebar|timber|aluminum|copper|pvc|hdpe)\b/gi,
];

const STANDARD_CODE_PATTERNS = [
  /\b(IS\s*\d{3,5}(?:\s*:\s*\d{4})?)\b/gi,
  /\b(IRC\s*\d{1,4}(?:\s*:\s*\d{4})?)\b/gi,
  /\b(ASTM\s*[A-Z]\d+)\b/gi,
  /\b(ASME\s*[A-Z]?\d+)\b/gi,
  /\b(IEC\s*\d+)\b/gi,
  /\b(NFPA\s*\d+)\b/gi,
];

const CALCULATION_PATTERNS = [
  /\b(calculate|computation|sizing|design\s+calculation|load\s+calculation)\b/i,
  /\b(reinforcement|shear|moment|deflection|capacity|stress|strain)\b/i,
];

const LOCATION_PATTERNS = [
  /\b(?:in|at|for)\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+){0,2}(?:,\s*[A-Z][a-z]+)?)\b/,
  /\b(India|Maharashtra|Karnataka|Tamil Nadu|Delhi|Mumbai|Bangalore|Chennai)\b/i,
];

const PROJECT_TYPE_PATTERNS: Array<{ pattern: RegExp; label: string }> = [
  { pattern: /\brigid\s+pavement\b/i, label: "Rigid pavement" },
  { pattern: /\bflexible\s+pavement\b/i, label: "Flexible pavement" },
  { pattern: /\bretaining\s+wall\b/i, label: "Retaining wall" },
  { pattern: /\bfoundation\b/i, label: "Foundation" },
  { pattern: /\bbridge\b/i, label: "Bridge" },
  { pattern: /\bbuilding\b/i, label: "Building" },
  { pattern: /\bpipeline\b/i, label: "Pipeline" },
  { pattern: /\bhvac\b/i, label: "HVAC system" },
  { pattern: /\btransformer\b/i, label: "Transformer" },
  { pattern: /\bboq\b/i, label: "Bill of quantities" },
];

const uniquePush = (list: string[], values: string[], limit = 20): string[] => {
  const set = new Set(list.map((v) => v.toLowerCase()));
  const next = [...list];
  for (const value of values) {
    const normalized = value.trim();
    if (!normalized || set.has(normalized.toLowerCase())) continue;
    set.add(normalized.toLowerCase());
    next.push(normalized);
  }
  return next.slice(-limit);
};

const extractMatches = (text: string, patterns: RegExp[]): string[] => {
  const matches: string[] = [];
  for (const pattern of patterns) {
    const globalPattern = new RegExp(
      pattern.source,
      pattern.flags.includes("g") ? pattern.flags : `${pattern.flags}g`
    );
    for (const match of text.matchAll(globalPattern)) {
      if (match[0]) matches.push(match[0].trim());
    }
  }
  return matches;
};

export interface HistoryTurnInput {
  disciplineId: string | null;
  disciplineName: string | null;
  moduleId: WorkspaceCategoryId | null;
  conversationId: string;
  userMessage: string;
  assistantContent: string;
  topic: string | null;
}

export const recordEngineeringHistoryTurn = (
  input: HistoryTurnInput
): void => {
  if (!input.disciplineId) return;

  const materials = extractMatches(input.userMessage, MATERIAL_PATTERNS);
  const standards = extractMatches(
    `${input.userMessage} ${input.assistantContent}`,
    STANDARD_CODE_PATTERNS
  );
  const isCalculation = CALCULATION_PATTERNS.some(
    (pattern) =>
      pattern.test(input.userMessage) || pattern.test(input.assistantContent)
  );

  let projectType: string | null = null;
  for (const entry of PROJECT_TYPE_PATTERNS) {
    if (entry.pattern.test(input.userMessage)) {
      projectType = entry.label;
      break;
    }
  }

  let location: string | null = null;
  for (const pattern of LOCATION_PATTERNS) {
    const match = input.userMessage.match(pattern);
    if (match?.[1] ?? match?.[0]) {
      location = (match[1] ?? match[0]).trim();
      break;
    }
  }

  const responseRecord: EngineeringResponseRecord = {
    id: crypto.randomUUID(),
    conversationId: input.conversationId,
    userMessage: input.userMessage,
    assistantSummary: input.assistantContent.slice(0, 400),
    disciplineId: input.disciplineId,
    moduleId: input.moduleId,
    topic: input.topic,
    timestamp: Date.now(),
  };

  updateDisciplineProjectContext(input.disciplineId, (context) => {
    const calculations: EngineeringCalculationRecord[] = isCalculation
      ? [
          ...context.calculations,
          {
            id: crypto.randomUUID(),
            label: input.topic ?? input.userMessage.slice(0, 60),
            disciplineId: input.disciplineId,
            moduleId: input.moduleId,
            conversationId: input.conversationId,
            timestamp: Date.now(),
          },
        ].slice(-15)
      : context.calculations;

    return {
      ...context,
      disciplineId: input.disciplineId,
      disciplineName: input.disciplineName,
      projectType: projectType ?? context.projectType,
      location: location ?? context.location,
      standardsUsed: uniquePush(context.standardsUsed, standards),
      materials: uniquePush(context.materials, materials),
      calculations,
      previousResponses: [...context.previousResponses, responseRecord].slice(-12),
      extractedTopics: input.topic
        ? uniquePush(context.extractedTopics, [input.topic], 10)
        : context.extractedTopics,
    };
  });
};

export const registerUploadedDocument = (
  disciplineId: string,
  documentId: string
): void => {
  updateDisciplineProjectContext(disciplineId, (context) => ({
    ...context,
    uploadedDocuments: uniquePush(context.uploadedDocuments, [documentId], 30),
  }));
};

export const getRecentResponses = (
  context: EngineeringProjectContext,
  limit = 3
): EngineeringResponseRecord[] =>
  context.previousResponses.slice(-limit);

export const formatHistorySummary = (
  context: EngineeringProjectContext
): string[] => {
  const lines: string[] = [];

  if (context.projectType) {
    lines.push(`Project type: ${context.projectType}`);
  }
  if (context.location) {
    lines.push(`Location: ${context.location}`);
  }
  if (context.standardsUsed.length > 0) {
    lines.push(`Standards referenced: ${context.standardsUsed.join(", ")}`);
  }
  if (context.materials.length > 0) {
    lines.push(`Materials discussed: ${context.materials.join(", ")}`);
  }
  if (context.calculations.length > 0) {
    const recent = context.calculations.slice(-3).map((c) => c.label);
    lines.push(`Recent calculations: ${recent.join("; ")}`);
  }
  if (context.extractedTopics.length > 0) {
    lines.push(`Session topics: ${context.extractedTopics.join(", ")}`);
  }

  const recentResponses = getRecentResponses(context, 2);
  for (const response of recentResponses) {
    lines.push(
      `Prior exchange — User: "${response.userMessage.slice(0, 80)}" → AI: "${response.assistantSummary.slice(0, 100)}"`
    );
  }

  return lines;
};
