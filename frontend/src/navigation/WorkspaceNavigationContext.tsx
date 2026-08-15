import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { useLocation } from "react-router-dom";

import type { WorkspaceCategoryId } from "../workspace/utils/workspaceCategoryConfig";
import { PERSISTED_KEYS, readPersistedString, writePersistedString } from "../utils/persistedState";
import type { EngineeringHubSection } from "./routeConfig";

export interface WorkspaceNavigationState {
  disciplineId: string | null;
  disciplineSlug: string | null;
  specializationId: string | null;
  specializationName: string | null;
  moduleId: WorkspaceCategoryId | null;
  conversationId: string | null;
  documentId: string | null;
  calculatorId: string | null;
  standardId: string | null;
  engineeringHubSection: EngineeringHubSection | null;
  scrollPositions: Record<string, number>;
  filters: Record<string, string>;
  searchText: Record<string, string>;
  expandedPanels: Record<string, boolean>;
}

const DEFAULT_STATE: WorkspaceNavigationState = {
  disciplineId: null,
  disciplineSlug: null,
  specializationId: null,
  specializationName: null,
  moduleId: null,
  conversationId: null,
  documentId: null,
  calculatorId: null,
  standardId: null,
  engineeringHubSection: null,
  scrollPositions: {},
  filters: {},
  searchText: {},
  expandedPanels: {},
};

interface WorkspaceNavigationContextValue extends WorkspaceNavigationState {
  updateWorkspace: (patch: Partial<WorkspaceNavigationState>) => void;
  saveScrollPosition: (key: string, position: number) => void;
  getScrollPosition: (key: string) => number;
  setFilter: (key: string, value: string) => void;
  setSearchText: (key: string, value: string) => void;
  setPanelExpanded: (key: string, expanded: boolean) => void;
}

const WorkspaceNavigationContext =
  createContext<WorkspaceNavigationContextValue | null>(null);

const loadState = (): WorkspaceNavigationState => {
  const raw = readPersistedString(PERSISTED_KEYS.workspaceNavigation);
  if (!raw) {
    return DEFAULT_STATE;
  }
  try {
    return { ...DEFAULT_STATE, ...(JSON.parse(raw) as WorkspaceNavigationState) };
  } catch {
    return DEFAULT_STATE;
  }
};

export const WorkspaceNavigationProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const location = useLocation();
  const [state, setState] = useState<WorkspaceNavigationState>(loadState);

  useEffect(() => {
    writePersistedString(PERSISTED_KEYS.workspaceNavigation, JSON.stringify(state));
  }, [state]);

  const updateWorkspace = useCallback((patch: Partial<WorkspaceNavigationState>) => {
    setState((previous) => ({ ...previous, ...patch }));
  }, []);

  const saveScrollPosition = useCallback((key: string, position: number) => {
    setState((previous) => ({
      ...previous,
      scrollPositions: { ...previous.scrollPositions, [key]: position },
    }));
  }, []);

  const getScrollPosition = useCallback(
    (key: string) => state.scrollPositions[key] ?? 0,
    [state.scrollPositions]
  );

  const setFilter = useCallback((key: string, value: string) => {
    setState((previous) => ({
      ...previous,
      filters: { ...previous.filters, [key]: value },
    }));
  }, []);

  const setSearchText = useCallback((key: string, value: string) => {
    setState((previous) => ({
      ...previous,
      searchText: { ...previous.searchText, [key]: value },
    }));
  }, []);

  const setPanelExpanded = useCallback((key: string, expanded: boolean) => {
    setState((previous) => ({
      ...previous,
      expandedPanels: { ...previous.expandedPanels, [key]: expanded },
    }));
  }, []);

  const value = useMemo(
    () => ({
      ...state,
      updateWorkspace,
      saveScrollPosition,
      getScrollPosition,
      setFilter,
      setSearchText,
      setPanelExpanded,
    }),
    [
      state,
      updateWorkspace,
      saveScrollPosition,
      getScrollPosition,
      setFilter,
      setSearchText,
      setPanelExpanded,
    ]
  );

  useEffect(() => {
    const main = document.querySelector<HTMLElement>("[data-scroll-container='main']");
    if (!main) {
      return;
    }

    const saved = state.scrollPositions[location.pathname] ?? 0;
    main.scrollTop = saved;

    const onScroll = () => {
      saveScrollPosition(location.pathname, main.scrollTop);
    };

    main.addEventListener("scroll", onScroll, { passive: true });
    return () => main.removeEventListener("scroll", onScroll);
  }, [location.pathname, saveScrollPosition, state.scrollPositions]);

  return (
    <WorkspaceNavigationContext.Provider value={value}>
      {children}
    </WorkspaceNavigationContext.Provider>
  );
};

export const useWorkspaceNavigation = (): WorkspaceNavigationContextValue => {
  const context = useContext(WorkspaceNavigationContext);
  if (!context) {
    throw new Error("useWorkspaceNavigation must be used within WorkspaceNavigationProvider");
  }
  return context;
};
