import { getConversationMemory } from "../context/conversationMemory";
import { getDisciplineSnapshot } from "../context/disciplineMemory";
import { getEngineeringSession } from "../context/sessionManager";
import { listWorkspaceItems } from "../actions/workspaceSaver";
import { getActiveWorkflowContext } from "../workflows";
import type { CopilotContextSnapshot, CopilotEngineInput } from "./types";

export const analyzeCopilotContext = (
  input: CopilotEngineInput
): CopilotContextSnapshot => {
  const session = getEngineeringSession();
  const conversation = getConversationMemory(input.conversationId);
  const workflow = getActiveWorkflowContext();
  const disciplineSnapshot = input.disciplineId
    ? getDisciplineSnapshot(input.disciplineId)
    : null;

  const workspaceReports = listWorkspaceItems("reports");
  const workspaceCalculations = listWorkspaceItems("calculations");

  return {
    disciplineId: input.disciplineId ?? session.currentDisciplineId,
    disciplineName:
      input.disciplineName ?? session.currentDisciplineName,
    moduleId: input.activeModuleId ?? session.currentModuleId,
    conversationId: input.conversationId,
    sessionTopic:
      input.sessionTopic ??
      conversation?.topic ??
      session.currentTopic,
    activeWorkflowTitle: workflow?.template.title ?? null,
    activeWorkflowStep: workflow?.currentActivity?.title ?? null,
    activeStandardCodes: session.activeStandardCodes,
    uploadedDocumentCount:
      disciplineSnapshot?.projectContext.uploadedDocuments.length ?? 0,
    calculationCount:
      (disciplineSnapshot?.projectContext.calculations.length ?? 0) +
      workspaceCalculations.length,
    generatedReportCount: workspaceReports.length,
  };
};

export const inferUserEngineeringIntent = (
  message: string,
  topic: string | null
): string => {
  const normalized = message.trim().toLowerCase();

  if (/design\s+m\s*\d+|concrete\s+mix|m\d+\s+concrete/i.test(normalized)) {
    return "concrete-design";
  }
  if (/flexible\s+pavement|rigid\s+pavement|pavement\s+design/i.test(normalized)) {
    return "pavement-design";
  }
  if (/transformer|cable\s+design|load\s+calculation/i.test(normalized)) {
    return "electrical-design";
  }
  if (/boq|bill\s+of\s+quantities/i.test(normalized)) {
    return "boq-preparation";
  }
  if (/bridge\s+design|retaining\s+wall|foundation/i.test(normalized)) {
    return "structural-design";
  }
  if (/inspection|checklist|qa\s*\/\s*qc/i.test(normalized)) {
    return "inspection-qa";
  }
  if (/method\s+statement|construction\s+sequence/i.test(normalized)) {
    return "construction-execution";
  }
  if (/explain\s+(is|irc|iec|astm|nbc)/i.test(normalized)) {
    return "standards-inquiry";
  }
  if (/calculate|computation|sizing/i.test(normalized)) {
    return "engineering-calculation";
  }
  if (/upload|drawing|document/i.test(normalized)) {
    return "document-management";
  }
  if (/workflow|next\s+step|procedure/i.test(normalized)) {
    return "workflow-guidance";
  }

  return topic ? "session-continuation" : "general-engineering";
};

export const detectMissingInformation = (
  message: string,
  intent: string
): string[] => {
  const missing: string[] = [];
  const normalized = message.toLowerCase();

  if (intent === "concrete-design" && !/grade|m\d+|slump/i.test(normalized)) {
    missing.push("Concrete grade (e.g. M40) and exposure conditions");
  }
  if (intent === "pavement-design") {
    if (!/cbr|traffic|msa/i.test(normalized)) {
      missing.push("Subgrade CBR and design traffic (MSA)");
    }
  }
  if (intent === "electrical-design" && !/kva|load|voltage/i.test(normalized)) {
    missing.push("Connected load or transformer rating requirements");
  }
  if (intent === "structural-design" && !/load|span|height/i.test(normalized)) {
    missing.push("Design loads and geometric parameters");
  }
  if (intent === "boq-preparation" && !/drawing|scope/i.test(normalized)) {
    missing.push("Approved drawings or scope of work");
  }

  return missing;
};
