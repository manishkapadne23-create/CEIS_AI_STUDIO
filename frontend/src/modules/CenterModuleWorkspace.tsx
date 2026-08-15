import React from "react";
import type { EngineeringDisciplineWorkspaceConfig } from "../config/disciplines";
import type { WorkspaceCategoryId } from "../workspace/utils/workspaceCategoryConfig";
import CalculatorsWorkspace from "./calculators/CalculatorsWorkspace";
import DocumentsWorkspace from "./documents/DocumentsWorkspace";
import LearningHubWorkspace from "./learningHub/LearningHubWorkspace";
import ProfessionalToolsWorkspace from "./professionalTools/ProfessionalToolsWorkspace";
import StandardsWorkspace from "./standards/StandardsWorkspace";

interface CenterModuleWorkspaceProps {
  moduleId: WorkspaceCategoryId;
  disciplineConfig: EngineeringDisciplineWorkspaceConfig;
}

const CenterModuleWorkspace: React.FC<CenterModuleWorkspaceProps> = ({
  moduleId,
  disciplineConfig,
}) => {
  switch (moduleId) {
    case "standards":
      return <StandardsWorkspace disciplineConfig={disciplineConfig} />;
    case "calculators":
      return <CalculatorsWorkspace disciplineConfig={disciplineConfig} />;
    case "professional-tools":
      return (
        <ProfessionalToolsWorkspace disciplineConfig={disciplineConfig} />
      );
    case "documents":
      return <DocumentsWorkspace disciplineConfig={disciplineConfig} />;
    case "learning-hub":
      return <LearningHubWorkspace disciplineConfig={disciplineConfig} />;
    default:
      return null;
  }
};

export default CenterModuleWorkspace;
