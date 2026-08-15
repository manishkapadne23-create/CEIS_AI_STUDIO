import { civilWorkflowTemplates } from "./civilWorkflows";
import { computerWorkflowTemplates } from "./computerWorkflows";
import { disciplineCatalogWorkflowTemplates } from "./disciplineCatalog";
import { electricalWorkflowTemplates } from "./electricalWorkflows";
import { mechanicalWorkflowTemplates } from "./mechanicalWorkflows";

export { buildWorkflowTemplate, formatWorkflowTemplateSummary } from "./buildWorkflowTemplate";

export const ALL_WORKFLOW_TEMPLATES = [
  ...civilWorkflowTemplates,
  ...mechanicalWorkflowTemplates,
  ...electricalWorkflowTemplates,
  ...computerWorkflowTemplates,
  ...disciplineCatalogWorkflowTemplates,
];

export {
  civilWorkflowTemplates,
  mechanicalWorkflowTemplates,
  electricalWorkflowTemplates,
  computerWorkflowTemplates,
  disciplineCatalogWorkflowTemplates,
};
