import { agriculturalDisciplineConfig } from "./agricultural";
import { aerospaceDisciplineConfig } from "./aerospace";
import { architectureDisciplineConfig } from "./architecture";
import { automationDisciplineConfig } from "./automation";
import { biomedicalDisciplineConfig } from "./biomedical";
import { chemicalDisciplineConfig } from "./chemical";
import { civilDisciplineConfig } from "./civil";
import { computerDisciplineConfig } from "./computer";
import { electricalDisciplineConfig } from "./electrical";
import { electronicsDisciplineConfig } from "./electronics";
import { environmentalDisciplineConfig } from "./environmental";
import { industrialDisciplineConfig } from "./industrial";
import { marineDisciplineConfig } from "./marine";
import { mechanicalDisciplineConfig } from "./mechanical";
import { miningDisciplineConfig } from "./mining";
import { oilGasDisciplineConfig } from "./oilgas";
import { railwayDisciplineConfig } from "./railway";
import { renewableDisciplineConfig } from "./renewable";
import type { EngineeringDisciplineWorkspaceConfig } from "./types";

export const DISCIPLINE_WORKSPACE_CONFIGS: EngineeringDisciplineWorkspaceConfig[] =
  [
    civilDisciplineConfig,
    mechanicalDisciplineConfig,
    electricalDisciplineConfig,
    computerDisciplineConfig,
    electronicsDisciplineConfig,
    chemicalDisciplineConfig,
    environmentalDisciplineConfig,
    miningDisciplineConfig,
    marineDisciplineConfig,
    aerospaceDisciplineConfig,
    railwayDisciplineConfig,
    industrialDisciplineConfig,
    automationDisciplineConfig,
    renewableDisciplineConfig,
    architectureDisciplineConfig,
    agriculturalDisciplineConfig,
    oilGasDisciplineConfig,
    biomedicalDisciplineConfig,
  ];

const disciplineConfigById = new Map(
  DISCIPLINE_WORKSPACE_CONFIGS.map((config) => [config.id, config])
);

const disciplineConfigByName = new Map(
  DISCIPLINE_WORKSPACE_CONFIGS.map((config) => [config.name, config])
);

export const getDisciplineWorkspaceConfigById = (
  disciplineId: string | null | undefined
): EngineeringDisciplineWorkspaceConfig | null =>
  disciplineId ? disciplineConfigById.get(disciplineId) ?? null : null;

export const getDisciplineWorkspaceConfigByName = (
  disciplineName: string | null | undefined
): EngineeringDisciplineWorkspaceConfig | null =>
  disciplineName ? disciplineConfigByName.get(disciplineName) ?? null : null;

export type {
  DisciplineModuleConfig,
  DisciplineModuleKey,
  EngineeringDisciplineWorkspaceConfig,
} from "./types";
