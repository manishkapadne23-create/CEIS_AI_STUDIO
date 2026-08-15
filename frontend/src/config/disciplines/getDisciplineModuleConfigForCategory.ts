import type { DisciplineModuleKey } from "./types";
import type { WorkspaceCategoryId } from "../../workspace/utils/workspaceCategoryConfig";

const CATEGORY_TO_MODULE_KEY: Partial<
  Record<WorkspaceCategoryId, DisciplineModuleKey>
> = {
  standards: "standards",
  "ai-expert": "aiExpert",
  calculators: "calculators",
  "professional-tools": "professionalTools",
  documents: "documents",
  "learning-hub": "learningHub",
};

export const getDisciplineModuleConfigForCategory = (
  disciplineConfig: import("./types").EngineeringDisciplineWorkspaceConfig | null | undefined,
  categoryId: WorkspaceCategoryId
) => {
  if (!disciplineConfig) {
    return null;
  }

  const moduleKey = CATEGORY_TO_MODULE_KEY[categoryId];

  return moduleKey ? disciplineConfig.modules[moduleKey] : null;
};
