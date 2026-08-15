import { getAgentForDiscipline, getEngineeringAgent } from "./agentRegistry";
import type {
  ActiveAgentContext,
  AgentSelectionInput,
  EngineeringAgentProfile,
} from "./types";

let activeAgentContext: ActiveAgentContext | null = null;

const SPECIALIST_TRIGGER_PATTERNS: Array<{
  agentId: string;
  patterns: RegExp[];
}> = [
  {
    agentId: "highway-design-agent",
    patterns: [/highway\s+design/i, /expressway/i, /dpr\s+preparation/i],
  },
  {
    agentId: "bridge-design-agent",
    patterns: [/bridge\s+design/i, /superstructure/i],
  },
  {
    agentId: "geotechnical-agent",
    patterns: [/geotechnical/i, /bearing\s+capacity/i, /soil\s+investigation/i],
  },
  {
    agentId: "quantity-survey-agent",
    patterns: [/quantity\s+survey/i, /\bboq\b/i, /bill\s+of\s+quantities/i],
  },
  {
    agentId: "qa-qc-agent",
    patterns: [/qa\s*\/\s*qc/i, /quality\s+assurance/i, /inspection\s+checklist/i],
  },
  {
    agentId: "tender-agent",
    patterns: [/tender\s+preparation/i, /bid\s+document/i],
  },
  {
    agentId: "safety-agent",
    patterns: [/construction\s+safety/i, /hazard\s+assessment/i],
  },
  {
    agentId: "site-engineer-agent",
    patterns: [/site\s+engineer/i, /site\s+diary/i, /daily\s+progress/i],
  },
];

export const selectAgentForSession = (
  input: AgentSelectionInput,
  getAgentById: (id: string) => EngineeringAgentProfile | null
): ActiveAgentContext | null => {
  const disciplineAgent = getAgentForDiscipline(
    input.disciplineId,
    input.disciplineName
  );

  if (!disciplineAgent) {
    activeAgentContext = null;
    return null;
  }

  let selectedAgent = disciplineAgent;
  let selectionReason = `Auto-activated from discipline: ${disciplineAgent.disciplineName}`;

  if (input.userMessage) {
    for (const trigger of SPECIALIST_TRIGGER_PATTERNS) {
      if (trigger.patterns.some((pattern) => pattern.test(input.userMessage!))) {
        const specialist = getAgentById(trigger.agentId);
        if (specialist && specialist.status === "planned") {
          selectionReason = `Specialist intent detected (${specialist.name}) — using discipline agent until specialist is enabled`;
        } else if (specialist && specialist.status === "active") {
          selectedAgent = specialist;
          selectionReason = `Specialist agent activated: ${specialist.name}`;
          break;
        }
      }
    }
  }

  activeAgentContext = {
    agent: selectedAgent,
    selectedAt: Date.now(),
    selectionReason,
    disciplineId: input.disciplineId,
    disciplineName: input.disciplineName,
  };

  return activeAgentContext;
};

export const activateAgentForDiscipline = (
  disciplineId: string,
  disciplineName: string
): ActiveAgentContext | null =>
  selectAgentForSession({ disciplineId, disciplineName }, getEngineeringAgent);

export const getActiveAgentContext = (): ActiveAgentContext | null =>
  activeAgentContext;

export const clearActiveAgent = (): void => {
  activeAgentContext = null;
};

export const getActiveAgent = (): EngineeringAgentProfile | null =>
  activeAgentContext?.agent ?? null;
