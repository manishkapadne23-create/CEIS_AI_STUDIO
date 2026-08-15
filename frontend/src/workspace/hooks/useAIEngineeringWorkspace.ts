import { useMemo } from "react";
import { useEngineeringWorkspace } from "../../context/EngineeringWorkspaceContext";
import { resolveAIEngineeringWorkspace } from "../resolveAIEngineeringWorkspace";
import type { AIEngineeringWorkspaceData } from "../types/AIEngineeringWorkspace";

export const useAIEngineeringWorkspace = (): AIEngineeringWorkspaceData => {
  const { workspace } = useEngineeringWorkspace();

  return useMemo(
    () => resolveAIEngineeringWorkspace(workspace),
    [workspace]
  );
};
