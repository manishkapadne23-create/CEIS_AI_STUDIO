import type { EngineeringWorkspace } from "../../context/EngineeringWorkspaceContext";
import type { EngineeringStandardMetadata } from "../../config/standards";
import type { EngineeringExpertContextInput } from "../contextEngine";
import type { DisciplineExpertIntelligence } from "../expertIntelligence";
import {
  buildReasoningContextSummary,
  buildSarathiReasoningContext,
} from "./buildReasoningContext";
import { formatReasoningOutput } from "./formatReasoningOutput";
import { generateEngineeringReasoning } from "./generateEngineeringReasoning";
import type { EngineeringReasoningResult } from "./types";

export interface RunEngineeringReasoningOptions {
  input: EngineeringExpertContextInput;
  workspace: EngineeringWorkspace;
  selectedStandard?: EngineeringStandardMetadata | null;
  moduleSearchQuery?: string;
  followUpIntent?: string | null;
}

export interface RunEngineeringReasoningResult extends EngineeringReasoningResult {
  content: string;
  contextSummary: string;
  expertIntelligence: DisciplineExpertIntelligence;
}

export const runEngineeringReasoning = (
  options: RunEngineeringReasoningOptions
): RunEngineeringReasoningResult => {
  const reasoningContext = buildSarathiReasoningContext(options);
  const reasoningResult = generateEngineeringReasoning(reasoningContext);
  const content = formatReasoningOutput(
    reasoningResult.sections,
    reasoningContext.expertIntelligence,
    reasoningContext.userQuestion
  );

  return {
    ...reasoningResult,
    content,
    contextSummary: buildReasoningContextSummary(reasoningContext),
    expertIntelligence: reasoningContext.expertIntelligence,
  };
};

export {
  buildSarathiReasoningContext,
  buildReasoningContextSummary,
} from "./buildReasoningContext";
export { classifyEngineeringQuery } from "./classifyEngineeringQuery";
export { retrieveRelevantKnowledge } from "./retrieveRelevantKnowledge";
export type {
  EngineeringQueryIntent,
  EngineeringReasoningResult,
  EngineeringReasoningSections,
  SarathiReasoningContext,
} from "./types";
