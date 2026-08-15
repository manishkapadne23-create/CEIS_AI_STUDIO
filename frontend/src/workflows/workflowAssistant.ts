import type {
  WorkflowAIAssistanceType,
  WorkflowAssistantRequest,
  WorkflowAssistantResult,
  WorkflowStepActivity,
  WorkflowTemplate,
} from "./types";

const ASSISTANCE_PROMPTS: Record<WorkflowAIAssistanceType, string> = {
  "next-step":
    "What is the next step in this workflow? Guide me through it with engineering detail.",
  "generate-document":
    "Generate the required document for the current workflow step.",
  "suggest-standard":
    "Suggest applicable standards and codes for the current workflow step.",
  "generate-checklist":
    "Generate a checklist for the current workflow step.",
  "prepare-boq":
    "Prepare a BOQ for the current workflow scope.",
  "generate-inspection":
    "Generate an inspection format for the current workflow activity.",
  "create-report":
    "Create a professional engineering report for the current workflow step.",
  "review-step":
    "Review my completed workflow step and identify gaps or improvements.",
};

export const buildWorkflowAssistantPrompt = (
  request: WorkflowAssistantRequest,
  template: WorkflowTemplate,
  currentActivity: WorkflowStepActivity | null
): WorkflowAssistantResult => {
  const basePrompt = ASSISTANCE_PROMPTS[request.assistanceType];
  const stepTitle = currentActivity?.title ?? "current step";
  const topic = request.sessionTopic ?? template.title;

  const prompt = [
    `[Workflow: ${template.title}]`,
    `[Step: ${stepTitle}]`,
    `[Discipline: ${template.disciplineName}]`,
    "",
    basePrompt,
    "",
    `Workflow objective: ${template.objective}`,
    `Session topic: ${topic}`,
    currentActivity
      ? `Step description: ${currentActivity.description}`
      : "",
    currentActivity?.requiredStandards.length
      ? `Applicable standards: ${currentActivity.requiredStandards.join(", ")}`
      : "",
  ]
    .filter(Boolean)
    .join("\n");

  return {
    assistanceType: request.assistanceType,
    prompt,
    workflowTitle: template.title,
    stepTitle: currentActivity?.title ?? null,
    suggestedActions: currentActivity?.aiAssistance ?? [],
  };
};

export const detectWorkflowAssistanceIntent = (
  message: string
): WorkflowAIAssistanceType | null => {
  const normalized = message.trim().toLowerCase();

  if (/^next\s+step\b/i.test(normalized)) return "next-step";
  if (/generate\s+(required\s+)?document/i.test(normalized))
    return "generate-document";
  if (/suggest\s+(applicable\s+)?standard/i.test(normalized))
    return "suggest-standard";
  if (/generate\s+checklist/i.test(normalized)) return "generate-checklist";
  if (/prepare\s+boq|create\s+boq|generate\s+boq/i.test(normalized))
    return "prepare-boq";
  if (/generate\s+inspection|inspection\s+format/i.test(normalized))
    return "generate-inspection";
  if (/create\s+report|generate\s+report/i.test(normalized))
    return "create-report";
  if (/review\s+(completed\s+)?step/i.test(normalized)) return "review-step";

  return null;
};

export const detectWorkflowControlIntent = (
  message: string
): "pause" | "resume" | "complete" | "save" | "restart" | "bookmark" | "share" | null => {
  const normalized = message.trim().toLowerCase();
  if (/pause\s+workflow/i.test(normalized)) return "pause";
  if (/continue\s+workflow|resume\s+workflow/i.test(normalized)) return "resume";
  if (/complete\s+workflow|finish\s+workflow/i.test(normalized)) return "complete";
  if (/save\s+workflow/i.test(normalized)) return "save";
  if (/restart\s+workflow/i.test(normalized)) return "restart";
  if (/bookmark\s+workflow/i.test(normalized)) return "bookmark";
  if (/share\s+workflow/i.test(normalized)) return "share";
  return null;
};

export const formatWorkflowGuidanceSummary = (
  template: WorkflowTemplate,
  currentStepIndex: number,
  status: string
): string => {
  const current = template.activities[currentStepIndex];
  const lines = [
    "========================================",
    "Active Engineering Workflow",
    "========================================",
    `Workflow: ${template.title}`,
    `Status: ${status}`,
    `Objective: ${template.objective}`,
    `Progress: Step ${currentStepIndex + 1} of ${template.activities.length}`,
    current ? `Current activity: ${current.title}` : "",
    "",
    "Overview:",
    template.overview,
    "",
    "Prerequisites:",
    ...template.prerequisites.map((item) => `  • ${item}`),
    "",
    "Required standards:",
    ...template.requiredStandards.map((item) => `  • ${item}`),
    "",
    "Workflow outputs:",
    ...template.outputs.map((item) => `  • ${item}`),
    "",
    "Quality checks:",
    ...template.qualityChecks.map((item) => `  • ${item}`),
    "",
    "AI can assist with: next step, generate document, suggest standards, checklist, BOQ, inspection format, report, review step.",
  ];

  return lines.filter(Boolean).join("\n");
};
