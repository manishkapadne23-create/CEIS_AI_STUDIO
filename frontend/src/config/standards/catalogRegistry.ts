import { agriculturalStandardsCatalog } from "./agricultural";
import { aerospaceStandardsCatalog } from "./aerospace";
import { architectureStandardsCatalog } from "./architecture";
import { automationStandardsCatalog } from "./automation";
import { biomedicalStandardsCatalog } from "./biomedical";
import { chemicalStandardsCatalog } from "./chemical";
import { civilStandardsCatalog } from "./civil";
import { computerStandardsCatalog } from "./computer";
import { electricalStandardsCatalog } from "./electrical";
import { electronicsStandardsCatalog } from "./electronics";
import { environmentalStandardsCatalog } from "./environmental";
import { industrialStandardsCatalog } from "./industrial";
import { marineStandardsCatalog } from "./marine";
import { mechanicalStandardsCatalog } from "./mechanical";
import { miningStandardsCatalog } from "./mining";
import { oilGasStandardsCatalog } from "./oilgas";
import { railwayStandardsCatalog } from "./railway";
import { renewableStandardsCatalog } from "./renewable";
import type { DisciplineStandardsCatalog } from "./types";

export const DISCIPLINE_STANDARDS_CATALOGS: DisciplineStandardsCatalog[] = [
  civilStandardsCatalog,
  mechanicalStandardsCatalog,
  electricalStandardsCatalog,
  computerStandardsCatalog,
  electronicsStandardsCatalog,
  chemicalStandardsCatalog,
  environmentalStandardsCatalog,
  miningStandardsCatalog,
  marineStandardsCatalog,
  railwayStandardsCatalog,
  aerospaceStandardsCatalog,
  architectureStandardsCatalog,
  renewableStandardsCatalog,
  oilGasStandardsCatalog,
  biomedicalStandardsCatalog,
  automationStandardsCatalog,
  industrialStandardsCatalog,
  agriculturalStandardsCatalog,
];
