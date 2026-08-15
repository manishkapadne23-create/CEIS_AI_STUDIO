import type {
  CopilotContextSnapshot,
  EngineeringRecommendation,
} from "./types";
import { detectMissingInformation } from "./contextAnalyzer";

export const generateEngineeringRecommendations = (
  message: string,
  intent: string,
  snapshot: CopilotContextSnapshot
): EngineeringRecommendation[] => {
  const recommendations: EngineeringRecommendation[] = [];
  const missing = detectMissingInformation(message, intent);

  if (missing.length > 0) {
    recommendations.push({
      type: "missing-information",
      title: "Missing Information",
      message: `Please provide: ${missing.join("; ")}`,
      priority: 10,
    });
  }

  recommendations.push({
    type: "next-step",
    title: "Suggested Next Step",
    message: resolveNextStep(intent, snapshot),
    priority: 9,
  });

  const codeRec = resolveApplicableCode(intent, message);
  if (codeRec) {
    recommendations.push({
      type: "applicable-code",
      title: "Applicable Code",
      message: codeRec,
      priority: 8,
    });
  }

  const warning = resolveEngineeringWarning(intent, message);
  if (warning) {
    recommendations.push({
      type: "engineering-warning",
      title: "Engineering Warning",
      message: warning,
      priority: 9,
    });
  }

  const bestPractice = resolveBestPractice(intent);
  if (bestPractice) {
    recommendations.push({
      type: "best-practice",
      title: "Best Practice",
      message: bestPractice,
      priority: 7,
    });
  }

  if (intent === "inspection-qa" || intent === "construction-execution") {
    recommendations.push({
      type: "quality-check",
      title: "Quality Check",
      message:
        "Verify workmanship, material test certificates, and hold-point inspections before proceeding.",
      priority: 8,
    });
  }

  if (
    intent === "construction-execution" ||
    intent === "structural-design" ||
    /excavation|scaffold|safety/i.test(message)
  ) {
    recommendations.push({
      type: "safety-requirement",
      title: "Safety Requirement",
      message:
        "Confirm site safety plan, PPE requirements, and permit-to-work before field activities.",
      priority: 9,
    });
  }

  if (snapshot.activeWorkflowStep) {
    recommendations.push({
      type: "next-step",
      title: "Workflow Step",
      message: `Continue workflow "${snapshot.activeWorkflowTitle}" — current activity: ${snapshot.activeWorkflowStep}`,
      priority: 10,
    });
  }

  return recommendations.sort((a, b) => b.priority - a.priority);
};

const resolveNextStep = (
  intent: string,
  snapshot: CopilotContextSnapshot
): string => {
  const steps: Record<string, string> = {
    "concrete-design":
      "Confirm grade and exposure → select applicable IS codes → run mix design calculator → prepare material specification and cube test plan.",
    "pavement-design":
      "Collect CBR and traffic data → apply IRC 37/58 → run pavement calculator → prepare BOQ and method statement.",
    "electrical-design":
      "Complete load schedule → size transformer/cables → apply IEC/IS standards → prepare testing checklist.",
    "boq-preparation":
      "Verify drawings → take off quantities → align with specifications → generate BOQ and rate analysis.",
    "structural-design":
      "Define loads and geometry → run structural analysis → design members → prepare calculation report.",
    "inspection-qa":
      "Use inspection checklist → record test results → manage NCRs → close QA records.",
    "standards-inquiry":
      "Open Standards module for full code text → cross-check project applicability → document compliance basis.",
    "engineering-calculation":
      "Open Calculators module → enter validated inputs → document assumptions in calculation sheet.",
    "workflow-guidance":
      "Say 'Start [workflow name] workflow' or 'Next step' to continue guided execution.",
    "document-management":
      "Open Documents module → upload drawing or template → reference in current design discussion.",
  };

  if (snapshot.activeWorkflowTitle) {
    return `Continue "${snapshot.activeWorkflowTitle}" workflow or say "Next step" for guided assistance.`;
  }

  return steps[intent] ?? "Clarify project scope, then select the relevant standard, calculator, or workflow to proceed.";
};

const resolveApplicableCode = (
  intent: string,
  message: string
): string | null => {
  if (intent === "concrete-design") return "IS 456 (design) and IS 10262 (mix proportioning) are typically applicable.";
  if (intent === "pavement-design") return "IRC 37 for flexible pavement; IRC 58 for rigid pavement.";
  if (intent === "electrical-design") return "IEC/IEEE standards for equipment; IS 3043 for earthing; IE Rules for utilities.";
  if (/irc\s*37/i.test(message)) return "IRC 37 — Guidelines for design of flexible pavements.";
  if (/is\s*456/i.test(message)) return "IS 456 — Plain and reinforced concrete code of practice.";
  return null;
};

const resolveEngineeringWarning = (
  intent: string,
  message: string
): string | null => {
  if (intent === "concrete-design" && !/exposure|cover/i.test(message)) {
    return "Verify exposure conditions and cover requirements before finalizing mix design.";
  }
  if (intent === "pavement-design" && !/cbr/i.test(message)) {
    return "Pavement design is sensitive to subgrade CBR — confirm site investigation data.";
  }
  if (intent === "structural-design" && /seismic|earthquake/i.test(message) === false) {
    return "Confirm seismic zone and load combinations per IS 1893 where applicable.";
  }
  return null;
};

const resolveBestPractice = (intent: string): string | null => {
  const practices: Record<string, string> = {
    "concrete-design":
      "Document slump, w/c ratio, cement type, and admixture selection; retain cube test records for traceability.",
    "pavement-design":
      "Validate traffic growth factor and design life assumptions with the client before finalizing thickness.",
    "boq-preparation":
      "Cross-check BOQ quantities against latest approved drawings and include measurement notes.",
    "electrical-design":
      "Coordinate cable sizing with voltage drop limits and short-circuit protection settings.",
  };
  return practices[intent] ?? null;
};
