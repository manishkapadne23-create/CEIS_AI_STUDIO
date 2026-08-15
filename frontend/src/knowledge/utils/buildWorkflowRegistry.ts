import type {
  EngineeringWorkflow,
  EngineeringWorkflowRegistry,
} from "../types/EngineeringWorkflow";

export const buildWorkflowRegistry = (
  disciplineId: string,
  disciplineName: string,
  workflows: EngineeringWorkflow[]
): EngineeringWorkflowRegistry => ({
  disciplineId,
  disciplineName,
  workflows,
});
