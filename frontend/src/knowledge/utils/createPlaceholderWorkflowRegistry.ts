import { DISCIPLINE_DEFINITIONS } from "../data/disciplineManifest";
import type {
  EngineeringWorkflow,
  EngineeringWorkflowRegistry,
} from "../types/EngineeringWorkflow";
import { WORKFLOW_STEP_RESOURCE_KEYS } from "../types/EngineeringWorkflow";
import { buildWorkflowRegistry } from "./buildWorkflowRegistry";

export const createPlaceholderWorkflowRegistry = (
  disciplineId: string
): EngineeringWorkflowRegistry => {
  const discipline = DISCIPLINE_DEFINITIONS.find(
    (entry) => entry.id === disciplineId
  );

  if (!discipline) {
    throw new Error(`Unknown engineering discipline: ${disciplineId}`);
  }

  const placeholderWorkflow: EngineeringWorkflow = {
    id: `${disciplineId}-workflow-catalog`,
    key: "workflow-catalog",
    title: "Engineering Workflow Catalog",
    description: `Engineering workflows for ${discipline.name} are planned and will be added to this registry.`,
    status: "coming-soon",
    enabled: false,
    disciplineId: discipline.id,
    steps: [
      {
        id: `${disciplineId}-step-knowledge`,
        order: 1,
        title: "Knowledge Review",
        description: "Review discipline knowledge repository content.",
        resourceType: WORKFLOW_STEP_RESOURCE_KEYS.knowledge,
        resourceRef: discipline.name,
      },
      {
        id: `${disciplineId}-step-standards`,
        order: 2,
        title: "Standards Alignment",
        description: "Identify applicable standards and codes.",
        resourceType: WORKFLOW_STEP_RESOURCE_KEYS.standards,
      },
      {
        id: `${disciplineId}-step-calculators`,
        order: 3,
        title: "Engineering Calculations",
        description: "Run discipline calculators where applicable.",
        resourceType: WORKFLOW_STEP_RESOURCE_KEYS.calculators,
      },
      {
        id: `${disciplineId}-step-tools`,
        order: 4,
        title: "Professional Tools",
        description: "Use professional tools for deliverables.",
        resourceType: WORKFLOW_STEP_RESOURCE_KEYS.professionalTools,
      },
      {
        id: `${disciplineId}-step-ai-expert`,
        order: 5,
        title: "AI Expert Consultation",
        description: "Consult the discipline AI expert for guidance.",
        resourceType: WORKFLOW_STEP_RESOURCE_KEYS.aiExpert,
      },
    ],
  };

  return buildWorkflowRegistry(discipline.id, discipline.name, [
    placeholderWorkflow,
  ]);
};
