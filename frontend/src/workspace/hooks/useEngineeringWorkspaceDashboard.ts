import { useMemo } from "react";
import { useEngineeringWorkspace } from "../../context/EngineeringWorkspaceContext";
import { resolveWorkspaceDashboard } from "../resolveWorkspaceDashboard";
import type { EngineeringWorkspaceDashboardData } from "../types/EngineeringWorkspaceDashboard";

export const useEngineeringWorkspaceDashboard =
  (): EngineeringWorkspaceDashboardData => {
    const { workspace } = useEngineeringWorkspace();

    return useMemo(
      () => resolveWorkspaceDashboard(workspace),
      [workspace]
    );
  };
