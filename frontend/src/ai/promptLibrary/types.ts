export interface DisciplinePromptDefinition {
  disciplineId: string;
  disciplineName: string;
  role: string;
  knowledgeScope: string[];
  answerStyle: string;
  terminology: string[];
  safetyRules: string[];
  responseFormat: string;
}

export interface CreateDisciplinePromptInput {
  disciplineId: string;
  disciplineName: string;
  role: string;
  knowledgeScope: string[];
  answerStyle: string;
  terminology: string[];
  safetyRules: string[];
}

export const SHARED_ENGINEERING_RESPONSE_FORMAT = [
  "Always respond using these sections in order:",
  "1. Summary",
  "2. Explanation",
  "3. Engineering Considerations",
  "4. Applicable Standards (metadata references only)",
  "5. Calculation Notes (if applicable)",
  "6. Practical Recommendations",
  "7. References (metadata only — no copyrighted documents)",
].join("\n");

export const createDisciplinePrompt = (
  input: CreateDisciplinePromptInput
): DisciplinePromptDefinition => ({
  ...input,
  responseFormat: SHARED_ENGINEERING_RESPONSE_FORMAT,
});
