import { DISCIPLINE_STANDARDS_CATALOGS } from "./catalogRegistry";
import { searchStandardsByFields } from "./standardsKnowledgeBase";
import type {
  EngineeringStandardMetadata,
  StandardsFilterId,
  StandardsUpdateType,
} from "./types";

export { DISCIPLINE_STANDARDS_CATALOGS } from "./catalogRegistry";
export { getDisciplineStandardsCount } from "./getStandardsCatalog";
export { getStandardsCatalogByDisciplineId } from "./getStandardsCatalog";
export {
  buildStandardKnowledgePanelData,
  getStandardById,
  resolveRelatedStandards,
  searchStandardsByFields,
} from "./standardsKnowledgeBase";

export const searchStandardsMetadata = (
  standards: EngineeringStandardMetadata[],
  query: string,
  disciplineName?: string | null
): EngineeringStandardMetadata[] =>
  searchStandardsByFields(standards, query, disciplineName);

export const filterStandardsByTab = (
  standards: EngineeringStandardMetadata[],
  filter: StandardsFilterId,
  recentIds: string[],
  favouriteIds: string[]
): EngineeringStandardMetadata[] => {
  switch (filter) {
    case "latest":
      return standards.filter(
        (standard) =>
          standard.isLatest || standard.status === "latest-revision"
      );
    case "popular":
      return standards.filter((standard) => standard.isPopular);
    case "recently-used":
      return recentIds
        .map((id) => standards.find((standard) => standard.id === id))
        .filter((standard): standard is EngineeringStandardMetadata =>
          Boolean(standard)
        );
    case "favourite":
      return favouriteIds
        .map((id) => standards.find((standard) => standard.id === id))
        .filter((standard): standard is EngineeringStandardMetadata =>
          Boolean(standard)
        );
    default:
      return standards;
  }
};

export const getStandardsUpdates = (
  standards: EngineeringStandardMetadata[],
  updateType: StandardsUpdateType
): EngineeringStandardMetadata[] =>
  standards.filter((standard) => standard.status === updateType);

export const getAllStandardsAcrossDisciplines = (): EngineeringStandardMetadata[] =>
  DISCIPLINE_STANDARDS_CATALOGS.flatMap((catalog) => catalog.standards);

export type {
  DisciplineStandardsCatalog,
  EngineeringStandardMetadata,
  EngineeringStandardPublicationStatus,
  StandardAttachmentRef,
  StandardKnowledgePanelData,
  StandardRevisionRecord,
  StandardsFilterId,
  StandardsUpdateType,
} from "./types";
