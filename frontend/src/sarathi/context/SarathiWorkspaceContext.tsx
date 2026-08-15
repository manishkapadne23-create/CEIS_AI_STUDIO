import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { EngineeringNode } from "../../data/engineeringTree";
import { useEngineeringWorkspace } from "../../context/EngineeringWorkspaceContext";
import type { EngineeringStandardMetadata } from "../../config/standards";
import type { ResolvedEngineeringStandard } from "../../knowledge/types/EngineeringStandard";
import { applyWorkspaceFromPath } from "../../utils/engineeringTreeUtils";
import { getDisciplineDefinitionByName } from "../utils/navigatorTree";
import {
  clearEngineeringSession,
  switchEngineeringDiscipline,
  switchEngineeringModule,
} from "../../context";
import { activateAgentForDiscipline } from "../../agents";
import {
  PERSISTED_KEYS,
  readPersistedBoolean,
  writePersistedBoolean,
} from "../../utils/persistedState";
import type { WorkspaceCategoryId } from "../../workspace/utils/workspaceCategoryConfig";
import { WORKSPACE_CATEGORY_DEFINITIONS } from "../../workspace/utils/workspaceCategoryConfig";

export type NavigatorView = "disciplines" | "specializations";

export type SearchScope = "all" | "workspace";

export interface SarathiActiveDiscipline {
  id: string;
  name: string;
}

export interface SarathiActiveSpecialization {
  id: string;
  name: string;
  path: EngineeringNode[];
}

interface SarathiWorkspaceContextValue {
  activeDiscipline: SarathiActiveDiscipline | null;
  activeSpecialization: SarathiActiveSpecialization | null;
  selectedDiscipline: SarathiActiveDiscipline | null;
  selectedSpecialization: SarathiActiveSpecialization | null;
  navigatorView: NavigatorView;
  searchScope: SearchScope;
  isWorkspaceActive: boolean;
  selectedStandard: ResolvedEngineeringStandard | null;
  openStandard: (standard: ResolvedEngineeringStandard) => void;
  closeStandard: () => void;
  selectedStandardKnowledge: EngineeringStandardMetadata | null;
  openStandardKnowledge: (standard: EngineeringStandardMetadata) => void;
  closeStandardKnowledge: () => void;
  isNavigatorOpen: boolean;
  setNavigatorOpen: (open: boolean) => void;
  isAppNavCollapsed: boolean;
  toggleAppNavCollapsed: () => void;
  isAssistantOpen: boolean;
  setAssistantOpen: (open: boolean) => void;
  isModulePanelCollapsed: boolean;
  toggleModulePanelCollapsed: () => void;
  previewModuleId: WorkspaceCategoryId | null;
  setPreviewModuleId: (moduleId: WorkspaceCategoryId | null) => void;
  activeModuleId: WorkspaceCategoryId | null;
  moduleSearchQuery: string;
  setModuleSearchQuery: (query: string) => void;
  openModule: (moduleId: WorkspaceCategoryId) => void;
  closeModule: () => void;
  isMobilePreviewOpen: boolean;
  setMobilePreviewOpen: (open: boolean) => void;
  selectDiscipline: (disciplineId: string, disciplineName: string) => void;
  selectSpecialization: (path: EngineeringNode[]) => void;
  navigateBack: () => void;
  setSearchScope: (scope: SearchScope) => void;
  clearWorkspace: () => void;
}

const SarathiWorkspaceContext =
  createContext<SarathiWorkspaceContextValue | null>(null);

export const SarathiWorkspaceProvider: React.FC<{
  children: ReactNode;
}> = ({ children }) => {
  const { setDomain, setBranch, setSpecialization, setActiveModule } =
    useEngineeringWorkspace();

  const [activeDiscipline, setActiveDiscipline] =
    useState<SarathiActiveDiscipline | null>(null);
  const [activeSpecialization, setActiveSpecialization] =
    useState<SarathiActiveSpecialization | null>(null);
  const [navigatorView, setNavigatorView] =
    useState<NavigatorView>("disciplines");
  const [searchScope, setSearchScope] = useState<SearchScope>("workspace");
  const [isWorkspaceActive, setIsWorkspaceActive] = useState(false);
  const [selectedStandard, setSelectedStandard] =
    useState<ResolvedEngineeringStandard | null>(null);
  const [selectedStandardKnowledge, setSelectedStandardKnowledge] =
    useState<EngineeringStandardMetadata | null>(null);
  const [isNavigatorOpen, setNavigatorOpen] = useState(true);
  const [isAppNavCollapsed, setAppNavCollapsed] = useState(() =>
    readPersistedBoolean(PERSISTED_KEYS.appSidebarCollapsed, false)
  );
  const [isAssistantOpen, setAssistantOpen] = useState(true);
  const [isModulePanelCollapsed, setModulePanelCollapsed] = useState(() =>
    readPersistedBoolean(PERSISTED_KEYS.modulePanelCollapsed, true)
  );
  const [previewModuleId, setPreviewModuleId] =
    useState<WorkspaceCategoryId | null>(null);
  const [activeModuleId, setActiveModuleId] =
    useState<WorkspaceCategoryId | null>(null);
  const [moduleSearchQuery, setModuleSearchQuery] = useState("");
  const [isMobilePreviewOpen, setMobilePreviewOpen] = useState(false);

  const openStandard = useCallback(
    (standard: ResolvedEngineeringStandard) => {
      setSelectedStandard(standard);
    },
    []
  );

  const closeStandard = useCallback(() => {
    setSelectedStandard(null);
  }, []);

  const openStandardKnowledge = useCallback(
    (standard: EngineeringStandardMetadata) => {
      setSelectedStandardKnowledge(standard);
      switchEngineeringModule({
        moduleId: activeModuleId ?? "standards",
        selectedStandard: standard,
      });
    },
    [activeModuleId]
  );

  const closeStandardKnowledge = useCallback(() => {
    setSelectedStandardKnowledge(null);
  }, []);

  const selectDiscipline = useCallback(
    (disciplineId: string, disciplineName: string) => {
      const isSameDiscipline = activeDiscipline?.id === disciplineId;

      if (!isSameDiscipline) {
        switchEngineeringDiscipline({ disciplineId, disciplineName });
        activateAgentForDiscipline(disciplineId, disciplineName);
        setActiveDiscipline({ id: disciplineId, name: disciplineName });
        setActiveSpecialization(null);
        setDomain(disciplineName);
        setBranch(null);
        setSpecialization(null);
      }

      setNavigatorView("specializations");
      setIsWorkspaceActive(true);
      setSearchScope("workspace");
    },
    [activeDiscipline?.id, setDomain, setBranch, setSpecialization]
  );

  const selectSpecialization = useCallback(
    (path: EngineeringNode[]) => {
      if (path.length === 0) {
        return;
      }

      const disciplineNode = path[0];
      const leaf = path[path.length - 1];
      const disciplineDefinition =
        getDisciplineDefinitionByName(disciplineNode.name) ?? {
          id: disciplineNode.id,
          name: disciplineNode.name,
        };

      if (activeDiscipline?.id !== disciplineDefinition.id) {
        switchEngineeringDiscipline({
          disciplineId: disciplineDefinition.id,
          disciplineName: disciplineDefinition.name,
        });
        activateAgentForDiscipline(
          disciplineDefinition.id,
          disciplineDefinition.name
        );
        setActiveDiscipline({
          id: disciplineDefinition.id,
          name: disciplineDefinition.name,
        });
        setNavigatorView("specializations");
      }

      applyWorkspaceFromPath(path, {
        setDomain,
        setBranch,
        setSpecialization,
      });

      setActiveSpecialization({
        id: leaf.id,
        name: leaf.name,
        path,
      });
      setIsWorkspaceActive(true);
      setSearchScope("workspace");
    },
    [
      activeDiscipline?.id,
      setDomain,
      setBranch,
      setSpecialization,
    ]
  );

  const navigateBack = useCallback(() => {
    if (navigatorView === "specializations") {
      setNavigatorView("disciplines");
    }
  }, [navigatorView]);

  const openModule = useCallback(
    (moduleId: WorkspaceCategoryId) => {
      const definition = WORKSPACE_CATEGORY_DEFINITIONS.find(
        (category) => category.id === moduleId
      );

      switchEngineeringModule({ moduleId });
      setActiveModuleId(moduleId);
      setPreviewModuleId(moduleId);
      setModuleSearchQuery("");
      setActiveModule(definition?.title ?? moduleId);
      setAssistantOpen(true);
    },
    [setActiveModule, setAssistantOpen]
  );

  const closeModule = useCallback(() => {
    switchEngineeringModule({ moduleId: null });
    setActiveModuleId(null);
    setModuleSearchQuery("");
    setActiveModule(null);
    setSelectedStandardKnowledge(null);
  }, [setActiveModule]);

  const toggleModulePanelCollapsed = useCallback(() => {
    setModulePanelCollapsed((previous) => {
      const next = !previous;
      writePersistedBoolean(PERSISTED_KEYS.modulePanelCollapsed, next);
      return next;
    });
  }, []);

  const toggleAppNavCollapsed = useCallback(() => {
    setAppNavCollapsed((previous) => {
      const next = !previous;
      writePersistedBoolean(PERSISTED_KEYS.appSidebarCollapsed, next);
      return next;
    });
  }, []);

  const clearWorkspace = useCallback(() => {
    clearEngineeringSession();
    setActiveDiscipline(null);
    setActiveSpecialization(null);
    setNavigatorView("disciplines");
    setIsWorkspaceActive(false);
    setDomain(null);
    setBranch(null);
    setSpecialization(null);
    setActiveModuleId(null);
    setModuleSearchQuery("");
    setActiveModule(null);
    setSelectedStandardKnowledge(null);
  }, [setDomain, setBranch, setSpecialization, setActiveModule]);

  const value = useMemo(
    () => ({
      activeDiscipline,
      activeSpecialization,
      selectedDiscipline: activeDiscipline,
      selectedSpecialization: activeSpecialization,
      navigatorView,
      searchScope,
      isWorkspaceActive,
      selectedStandard,
      openStandard,
      closeStandard,
      selectedStandardKnowledge,
      openStandardKnowledge,
      closeStandardKnowledge,
      isNavigatorOpen,
      setNavigatorOpen,
      isAppNavCollapsed,
      toggleAppNavCollapsed,
      isAssistantOpen,
      setAssistantOpen,
      isModulePanelCollapsed,
      toggleModulePanelCollapsed,
      previewModuleId,
      setPreviewModuleId,
      activeModuleId,
      moduleSearchQuery,
      setModuleSearchQuery,
      openModule,
      closeModule,
      isMobilePreviewOpen,
      setMobilePreviewOpen,
      selectDiscipline,
      selectSpecialization,
      navigateBack,
      setSearchScope,
      clearWorkspace,
    }),
    [
      activeDiscipline,
      activeSpecialization,
      navigatorView,
      searchScope,
      isWorkspaceActive,
      selectedStandard,
      openStandard,
      closeStandard,
      selectedStandardKnowledge,
      openStandardKnowledge,
      closeStandardKnowledge,
      isNavigatorOpen,
      isAppNavCollapsed,
      isAssistantOpen,
      isModulePanelCollapsed,
      previewModuleId,
      activeModuleId,
      moduleSearchQuery,
      isMobilePreviewOpen,
      openModule,
      closeModule,
      toggleModulePanelCollapsed,
      toggleAppNavCollapsed,
      selectDiscipline,
      selectSpecialization,
      navigateBack,
      clearWorkspace,
    ]
  );

  return (
    <SarathiWorkspaceContext.Provider value={value}>
      {children}
    </SarathiWorkspaceContext.Provider>
  );
};

export const useSarathiWorkspace = (): SarathiWorkspaceContextValue => {
  const context = useContext(SarathiWorkspaceContext);

  if (!context) {
    throw new Error(
      "useSarathiWorkspace must be used within SarathiWorkspaceProvider"
    );
  }

  return context;
};
