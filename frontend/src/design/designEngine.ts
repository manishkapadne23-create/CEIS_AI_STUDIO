import {
  advanceDesignStep,
  getActiveDesignSession,
  startDesignSession,
  updateStepData,
} from "./designHistory";
import {
  findDesignTemplate,
  getDesignTemplate,
  listTemplatesForDiscipline,
} from "./designTemplates";
import type { DesignSession, DesignStep, DesignTemplate } from "./types";

export const getCurrentDesignStep = (
  session: DesignSession,
  template: DesignTemplate
): DesignStep | null => template.steps[session.currentStepIndex] ?? null;

export const startDesign = (
  query: string,
  disciplineId: string | null,
  disciplineName: string | null,
  conversationId: string | null
): { session: DesignSession; template: DesignTemplate } | null => {
  let template = findDesignTemplate(query);
  if (!template && disciplineId) {
    const disciplineTemplates = listTemplatesForDiscipline(disciplineId);
    template =
      disciplineTemplates.find((t) =>
        t.title.toLowerCase().includes(query.toLowerCase())
      ) ?? disciplineTemplates[0] ?? null;
  }
  if (!template) return null;

  const session = startDesignSession(
    template,
    conversationId,
    disciplineId,
    disciplineName
  );
  return { session, template };
};

export const captureStepInput = (
  sessionId: string,
  userMessage: string,
  template: DesignTemplate
): DesignSession | null => {
  const session = getActiveDesignSession();
  if (!session || session.id !== sessionId) return null;

  const currentStep = template.steps[session.currentStepIndex];
  if (!currentStep) return null;

  updateStepData(sessionId, currentStep.id, userMessage);
  return advanceDesignStep(sessionId, template);
};

export const formatStepGuidance = (
  step: DesignStep,
  template: DesignTemplate,
  stepNumber: number
): string =>
  [
    `DESIGN STEP ${stepNumber}/12: ${step.title}`,
    step.description,
    "",
    `Guidance: ${step.guidance}`,
    "",
    "Required inputs:",
    ...step.requiredInputs.map((i) => `- ${i}`),
    "",
    "Suggested standards:",
    ...template.suggestedStandards.map((s) => `- ${s}`),
    "",
    "Suggested calculators:",
    ...template.suggestedCalculators.map((c) => `- ${c}`),
    "",
    "Suggested tools:",
    ...template.suggestedTools.map((t) => `- ${t}`),
    "",
    "Suggested templates:",
    ...template.suggestedTemplates.map((t) => `- ${t}`),
  ].join("\n");

export const getActiveDesignContext = (): {
  session: DesignSession;
  template: DesignTemplate;
  currentStep: DesignStep | null;
} | null => {
  const session = getActiveDesignSession();
  if (!session) return null;
  const template = getDesignTemplate(session.templateId);
  if (!template) return null;
  return {
    session,
    template,
    currentStep: getCurrentDesignStep(session, template),
  };
};

export const suggestMissingInputs = (
  step: DesignStep,
  userMessage: string
): string[] => {
  const provided = userMessage.toLowerCase();
  return step.requiredInputs.filter(
    (input) => !provided.includes(input.toLowerCase().slice(0, 6))
  );
};
