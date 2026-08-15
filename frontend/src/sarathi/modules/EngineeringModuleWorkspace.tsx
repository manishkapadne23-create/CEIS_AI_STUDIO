import React from "react";
import type { WorkspaceCategoryId } from "../../workspace/utils/workspaceCategoryConfig";
import AIExpertModule from "./AIExpertModule";
import CalculatorsModule from "./CalculatorsModule";
import ProfessionalToolsModule from "./ProfessionalToolsModule";
import StandardsModulePanel from "./StandardsModulePanel";
import TemplatesModule from "./TemplatesModule";
import ModulePreviewContent from "../components/ModulePreviewContent";

interface EngineeringModuleWorkspaceProps {
  moduleId: WorkspaceCategoryId;
}

const EngineeringModuleWorkspace: React.FC<EngineeringModuleWorkspaceProps> = ({
  moduleId,
}) => {
  switch (moduleId) {
    case "standards":
      return <StandardsModulePanel />;
    case "calculators":
      return <CalculatorsModule />;
    case "professional-tools":
      return <ProfessionalToolsModule />;
    case "documents":
      return <TemplatesModule />;
    case "learning-hub":
      return <ModulePreviewContent moduleId="learning-hub" />;
    case "ai-expert":
      return <AIExpertModule />;
    default:
      return (
        <p className="text-sm text-slate-500">
          This module is not available for the active discipline.
        </p>
      );
  }
};

export default EngineeringModuleWorkspace;
