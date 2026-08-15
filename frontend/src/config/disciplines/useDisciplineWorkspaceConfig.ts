import { useMemo } from "react";
import { useEngineeringWorkspace } from "../../context/EngineeringWorkspaceContext";
import { getDisciplineIdByName } from "../../knowledge/utils/resolveKnowledgeModule";
import {
  getDisciplineWorkspaceConfigById,
  getDisciplineWorkspaceConfigByName,
  type EngineeringDisciplineWorkspaceConfig,
} from "./index";

export const useDisciplineWorkspaceConfig =
  (): EngineeringDisciplineWorkspaceConfig | null => {
    const { workspace } = useEngineeringWorkspace();

    return useMemo(() => {
      const disciplineId = getDisciplineIdByName(workspace.domain);

      return (
        getDisciplineWorkspaceConfigById(disciplineId) ??
        getDisciplineWorkspaceConfigByName(workspace.domain)
      );
    }, [workspace.domain]);
  };
