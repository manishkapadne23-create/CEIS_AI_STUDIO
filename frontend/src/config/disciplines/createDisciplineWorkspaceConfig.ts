import type {
  DisciplineModuleKey,
  EngineeringDisciplineWorkspaceConfig,
} from "./types";

export interface CreateDisciplineWorkspaceConfigOptions {
  id: string;
  name: string;
  shortName?: string;
  moduleTitleOverrides?: Partial<Record<DisciplineModuleKey, string>>;
}

const createModule = (
  title: string,
  description: string
): { title: string; description: string } => ({ title, description });

export const createDisciplineWorkspaceConfig = ({
  id,
  name,
  shortName,
  moduleTitleOverrides = {},
}: CreateDisciplineWorkspaceConfigOptions): EngineeringDisciplineWorkspaceConfig => {
  const label = shortName ?? name;
  const useFullStandardsTitle = !shortName || shortName === name;

  const title = (key: DisciplineModuleKey, fallback: string) =>
    moduleTitleOverrides[key] ?? fallback;

  return {
    id,
    name,
    modules: {
      aiExpert: createModule(
        title("aiExpert", `${label} AI Expert`),
        `AI engineering expert for ${name}.`
      ),
      standards: createModule(
        title(
          "standards",
          useFullStandardsTitle
            ? `${name} Standards & Codes`
            : `${label} Standards`
        ),
        `Standards, codes, and regulatory references for ${name}.`
      ),
      calculators: createModule(
        title("calculators", `${label} Calculators`),
        `Engineering calculators for ${name}.`
      ),
      professionalTools: createModule(
        title("professionalTools", `${label} Professional Tools`),
        `Professional tools and utilities for ${name}.`
      ),
      templates: createModule(
        title("templates", `${label} Templates`),
        `Report templates and document starters for ${name}.`
      ),
      workflows: createModule(
        title("workflows", `${label} Workflows`),
        `Guided engineering workflows for ${name}.`
      ),
      documents: createModule(
        title("documents", `${label} Documents`),
        `Engineering documents and references for ${name}.`
      ),
      learningHub: createModule(
        title("learningHub", `${label} Learning Hub`),
        `Courses, references, and learning resources for ${name}.`
      ),
    },
    chatPlaceholder: `Ask anything about ${name}...`,
    workspaceLabel: "Engineering Workspace",
    assistantLabel: "Engineering Assistant",
  };
};
