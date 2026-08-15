import type { EngineeringAgentCapability } from "./types";

export const ENGINEERING_AGENT_CAPABILITIES: EngineeringAgentCapability[] = [
  {
    id: "engineering-advice",
    label: "Engineering Advice",
    description: "Provide discipline-specific engineering guidance and design support.",
  },
  {
    id: "standards-guidance",
    label: "Standards Guidance",
    description: "Interpret and apply applicable codes, standards, and specifications.",
  },
  {
    id: "engineering-calculations",
    label: "Engineering Calculations",
    description: "Support calculations with formulas, inputs, units, and verification.",
  },
  {
    id: "professional-reports",
    label: "Professional Reports",
    description: "Draft technical reports, memos, and engineering deliverables.",
  },
  {
    id: "document-review",
    label: "Document Review",
    description: "Review drawings, specifications, and engineering documents.",
  },
  {
    id: "engineering-checklists",
    label: "Engineering Checklists",
    description: "Generate inspection, QA/QC, and compliance checklists.",
  },
  {
    id: "engineering-recommendations",
    label: "Engineering Recommendations",
    description: "Recommend next steps, best practices, and design improvements.",
  },
  {
    id: "workflow-assistance",
    label: "Workflow Assistance",
    description: "Guide users through discipline engineering workflows.",
  },
  {
    id: "learning-assistance",
    label: "Learning Assistance",
    description: "Explain concepts and support learning hub resources.",
  },
];

export const DEFAULT_DISCIPLINE_AGENT_CAPABILITIES = ENGINEERING_AGENT_CAPABILITIES.map(
  (capability) => capability.id
);

export const getAgentCapability = (
  id: EngineeringAgentCapability["id"]
): EngineeringAgentCapability | undefined =>
  ENGINEERING_AGENT_CAPABILITIES.find((capability) => capability.id === id);

export const formatCapabilitiesList = (
  capabilityIds: EngineeringAgentCapability["id"][]
): string =>
  capabilityIds
    .map((id) => getAgentCapability(id)?.label ?? id)
    .join(", ");
