import { useMemo } from "react";
import { useEngineeringWorkspace } from "../../context/EngineeringWorkspaceContext";
import {
  resolveDisciplineQuickPrompts,
  type DisciplineQuickPrompt,
} from "../resolveDisciplineQuickPrompts";

export const useDisciplineQuickPrompts = (): DisciplineQuickPrompt[] => {
  const { workspace } = useEngineeringWorkspace();

  return useMemo(
    () => resolveDisciplineQuickPrompts(workspace),
    [workspace]
  );
};
