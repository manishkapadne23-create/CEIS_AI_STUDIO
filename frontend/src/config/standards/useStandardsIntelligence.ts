import { useCallback, useMemo, useState } from "react";
import {
  filterStandardsByTab,
  getStandardsCatalogByDisciplineId,
  getStandardsUpdates,
  searchStandardsMetadata,
} from "./index";
import { smartSearch } from "../../standards-intelligence";
import {
  readFavouriteStandardIds,
  readFrequentlyUsedStandardIds,
  readRecentlyViewedStandardIds,
  recordStandardView,
  toggleFavouriteStandard,
} from "./standardsPersistence";
import type {
  EngineeringStandardMetadata,
  StandardsFilterId,
  StandardsUpdateType,
} from "./types";

export const useStandardsIntelligence = (
  disciplineId: string | null | undefined,
  searchQuery: string
) => {
  const catalog = getStandardsCatalogByDisciplineId(disciplineId);
  const [activeFilter, setActiveFilter] = useState<StandardsFilterId>("all");
  const [favouriteIds, setFavouriteIds] = useState<string[]>(() =>
    disciplineId ? readFavouriteStandardIds(disciplineId) : []
  );
  const [recentIds, setRecentIds] = useState<string[]>(() =>
    disciplineId ? readRecentlyViewedStandardIds(disciplineId) : []
  );
  const [frequentIds, setFrequentIds] = useState<string[]>(() =>
    disciplineId ? readFrequentlyUsedStandardIds(disciplineId) : []
  );
  const allStandards = catalog?.standards ?? [];

  const searchedStandards = useMemo(() => {
    const base = searchStandardsMetadata(
      allStandards,
      searchQuery,
      catalog?.disciplineName
    );

    if (!searchQuery.trim()) {
      return base;
    }

    const smart = smartSearch(searchQuery, {
      disciplineId: disciplineId ?? undefined,
    }).standards.filter((standard) => standard.disciplineId === disciplineId);

    const seen = new Set(base.map((standard) => standard.id));
    const merged = [...base];
    for (const standard of smart) {
      if (!seen.has(standard.id)) {
        merged.push(standard);
      }
    }
    return merged;
  }, [allStandards, catalog?.disciplineName, disciplineId, searchQuery]);

  const matchedClauses = useMemo(() => {
    if (!searchQuery.trim()) {
      return [];
    }
    return smartSearch(searchQuery, {
      disciplineId: disciplineId ?? undefined,
    }).clauses;
  }, [disciplineId, searchQuery]);

  const filteredStandards = useMemo(
    () =>
      filterStandardsByTab(
        searchedStandards,
        activeFilter,
        recentIds,
        favouriteIds
      ),
    [searchedStandards, activeFilter, recentIds, favouriteIds]
  );

  const latestStandards = useMemo(
    () =>
      searchedStandards.filter(
        (standard) =>
          standard.isLatest || standard.status === "latest-revision"
      ),
    [searchedStandards]
  );

  const frequentlyUsedStandards = useMemo(
    () =>
      frequentIds
        .map((id) => searchedStandards.find((standard) => standard.id === id))
        .filter((standard): standard is EngineeringStandardMetadata =>
          Boolean(standard)
        ),
    [frequentIds, searchedStandards]
  );

  const recentlyViewedStandards = useMemo(
    () =>
      recentIds
        .map((id) => searchedStandards.find((standard) => standard.id === id))
        .filter((standard): standard is EngineeringStandardMetadata =>
          Boolean(standard)
        ),
    [recentIds, searchedStandards]
  );

  const favouriteStandards = useMemo(
    () =>
      favouriteIds
        .map((id) => searchedStandards.find((standard) => standard.id === id))
        .filter((standard): standard is EngineeringStandardMetadata =>
          Boolean(standard)
        ),
    [favouriteIds, searchedStandards]
  );

  const getUpdates = useCallback(
    (updateType: StandardsUpdateType) =>
      getStandardsUpdates(searchedStandards, updateType),
    [searchedStandards]
  );

  const handleStandardOpen = useCallback(
    (standard: EngineeringStandardMetadata) => {
      if (!disciplineId) {
        return;
      }

      recordStandardView(disciplineId, standard.id);
      setRecentIds(readRecentlyViewedStandardIds(disciplineId));
      setFrequentIds(readFrequentlyUsedStandardIds(disciplineId));
    },
    [disciplineId]
  );

  const handleToggleFavourite = useCallback(
    (standardId: string) => {
      if (!disciplineId) {
        return;
      }

      setFavouriteIds(toggleFavouriteStandard(disciplineId, standardId));
    },
    [disciplineId]
  );

  const isFavourite = useCallback(
    (standardId: string) => favouriteIds.includes(standardId),
    [favouriteIds]
  );

  return {
    catalog,
    activeFilter,
    setActiveFilter,
    filteredStandards,
    latestStandards,
    frequentlyUsedStandards,
    recentlyViewedStandards,
    favouriteStandards,
    disciplineStandards: searchedStandards,
    matchedClauses,
    getUpdates,
    handleStandardOpen,
    handleToggleFavourite,
    isFavourite,
  };
};
