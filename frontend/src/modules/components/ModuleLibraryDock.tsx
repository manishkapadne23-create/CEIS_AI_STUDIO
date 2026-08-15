import React from "react";
import type { EngineeringDisciplineWorkspaceConfig } from "../../config/disciplines";
import type { WorkspaceCategoryId } from "../../workspace/utils/workspaceCategoryConfig";
import CalculatorsLibraryPanel from "../calculators/CalculatorsLibraryPanel";
import DocumentsLibraryPanel from "../documents/DocumentsLibraryPanel";
import LearningLibraryPanel from "../learningHub/LearningLibraryPanel";
import ProfessionalToolsLibraryPanel from "../professionalTools/ProfessionalToolsLibraryPanel";
import StandardsLibraryPanel from "../standards/StandardsLibraryPanel";

interface ModuleLibraryDockProps {
  moduleId: WorkspaceCategoryId;
  disciplineConfig: EngineeringDisciplineWorkspaceConfig;
}

const ModuleLibraryDock: React.FC<ModuleLibraryDockProps> = ({
  moduleId,
  disciplineConfig,
}) => {
  switch (moduleId) {
    case "standards":
      return (
        <StandardsLibraryPanel disciplineConfig={disciplineConfig} />
      );
    case "calculators":
      return (
        <CalculatorsLibraryPanel disciplineConfig={disciplineConfig} />
      );
    case "professional-tools":
      return (
        <ProfessionalToolsLibraryPanel disciplineConfig={disciplineConfig} />
      );
    case "documents":
      return <DocumentsLibraryPanel disciplineConfig={disciplineConfig} />;
    case "learning-hub":
      return <LearningLibraryPanel disciplineConfig={disciplineConfig} />;
    default:
      return null;
  }
};

export default ModuleLibraryDock;
