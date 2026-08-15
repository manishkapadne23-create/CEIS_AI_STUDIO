import React, { type ReactNode } from "react";

import { civilDisciplineConfig } from "../config/disciplines/civil";
import { useDisciplineWorkspaceConfig } from "../config/disciplines/useDisciplineWorkspaceConfig";
import type { ModuleWorkspaceProps } from "../modules/types";

interface HubDisciplineModuleProps {
  children: (props: ModuleWorkspaceProps) => ReactNode;
}

const HubDisciplineModule: React.FC<HubDisciplineModuleProps> = ({
  children,
}) => {
  const disciplineConfig =
    useDisciplineWorkspaceConfig() ?? civilDisciplineConfig;

  return <>{children({ disciplineConfig })}</>;
};

export default HubDisciplineModule;
