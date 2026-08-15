import React, {
  createContext,
  useContext,
  useMemo,
  type ReactNode,
} from "react";
import { useEngineeringWorkspace } from "../../context/EngineeringWorkspaceContext";
import {
  resolveKnowledgeModuleFromWorkspace,
  resolveSpecializationNode,
} from "../utils/resolveKnowledgeModule";
import type { KnowledgeModule, KnowledgeNode } from "../types";

interface KnowledgeModuleContextValue {
  disciplineId: string | null;
  specialization: string | null;
  specializationNode: KnowledgeNode | null;
  module: KnowledgeModule | null;
  isAvailable: boolean;
}

const KnowledgeModuleContext =
  createContext<KnowledgeModuleContextValue | null>(null);

export interface KnowledgeModuleProviderProps {
  children: ReactNode;
}

export const KnowledgeModuleProvider: React.FC<
  KnowledgeModuleProviderProps
> = ({ children }) => {
  const { workspace } = useEngineeringWorkspace();

  const value = useMemo(() => {
    const module = resolveKnowledgeModuleFromWorkspace(workspace);
    const disciplineId = module?.disciplineId ?? null;
    const specializationNode = resolveSpecializationNode(
      module,
      workspace.specialization
    );

    return {
      disciplineId,
      specialization: workspace.specialization,
      specializationNode,
      module,
      isAvailable: Boolean(module?.rootNodes.length),
    };
  }, [workspace]);

  return (
    <KnowledgeModuleContext.Provider value={value}>
      {children}
    </KnowledgeModuleContext.Provider>
  );
};

export const useKnowledgeModuleContext =
  (): KnowledgeModuleContextValue => {
    const context = useContext(KnowledgeModuleContext);

    if (!context) {
      throw new Error(
        "useKnowledgeModuleContext must be used within KnowledgeModuleProvider"
      );
    }

    return context;
  };

export default KnowledgeModuleProvider;
