import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export interface EngineeringWorkspace {
  domain: string | null;
  branch: string | null;
  specialization: string | null;
  country: string;
  codes: string[];
  activeModule: string | null;
}

interface EngineeringWorkspaceContextValue {
  workspace: EngineeringWorkspace;
  setDomain: (domain: string | null) => void;
  setBranch: (branch: string | null) => void;
  setSpecialization: (specialization: string | null) => void;
  setCountry: (country: string) => void;
  setCodes: (codes: string[]) => void;
  setActiveModule: (module: string | null) => void;
}

const defaultWorkspace: EngineeringWorkspace = {
  domain: null,
  branch: null,
  specialization: null,
  country: "India",
  codes: ["IRC", "MORTH", "IS"],
  activeModule: null,
};

const EngineeringWorkspaceContext =
  createContext<EngineeringWorkspaceContextValue | null>(
    null
  );

export const EngineeringWorkspaceProvider: React.FC<{
  children: ReactNode;
}> = ({ children }) => {
  const [workspace, setWorkspace] =
    useState<EngineeringWorkspace>(defaultWorkspace);

  const setDomain = useCallback((domain: string | null) => {
    setWorkspace((previous) => ({
      ...previous,
      domain,
    }));
  }, []);

  const setBranch = useCallback((branch: string | null) => {
    setWorkspace((previous) => ({
      ...previous,
      branch,
    }));
  }, []);

  const setSpecialization = useCallback(
    (specialization: string | null) => {
      setWorkspace((previous) => ({
        ...previous,
        specialization,
      }));
    },
    []
  );

  const setCountry = useCallback((country: string) => {
    setWorkspace((previous) => ({
      ...previous,
      country,
    }));
  }, []);

  const setCodes = useCallback((codes: string[]) => {
    setWorkspace((previous) => ({
      ...previous,
      codes,
    }));
  }, []);

  const setActiveModule = useCallback((activeModule: string | null) => {
    setWorkspace((previous) => ({
      ...previous,
      activeModule,
    }));
  }, []);

  const value = useMemo(
    () => ({
      workspace,
      setDomain,
      setBranch,
      setSpecialization,
      setCountry,
      setCodes,
      setActiveModule,
    }),
    [
      workspace,
      setDomain,
      setBranch,
      setSpecialization,
      setCountry,
      setCodes,
      setActiveModule,
    ]
  );

  return (
    <EngineeringWorkspaceContext.Provider value={value}>
      {children}
    </EngineeringWorkspaceContext.Provider>
  );
};

export const useEngineeringWorkspace =
  (): EngineeringWorkspaceContextValue => {
    const context = useContext(EngineeringWorkspaceContext);

    if (!context) {
      throw new Error(
        "useEngineeringWorkspace must be used within EngineeringWorkspaceProvider"
      );
    }

    return context;
  };
