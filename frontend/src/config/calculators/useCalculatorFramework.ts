import { useCallback, useMemo, useState } from "react";
import {
  filterCalculatorsByTab,
  getCalculatorsCatalogByDisciplineId,
  searchCalculatorsMetadata,
} from "./index";
import {
  readFavouriteCalculatorIds,
  readRecentlyUsedCalculatorIds,
  recordCalculatorOpen,
  toggleFavouriteCalculator,
} from "./calculatorsPersistence";
import type {
  CalculatorsFilterId,
  EngineeringCalculatorMetadata,
} from "./types";

export const useCalculatorFramework = (
  disciplineId: string | null | undefined,
  searchQuery: string
) => {
  const catalog = getCalculatorsCatalogByDisciplineId(disciplineId);
  const [activeFilter, setActiveFilter] = useState<CalculatorsFilterId>("all");
  const [favouriteIds, setFavouriteIds] = useState<string[]>(() =>
    disciplineId ? readFavouriteCalculatorIds(disciplineId) : []
  );
  const [recentIds, setRecentIds] = useState<string[]>(() =>
    disciplineId ? readRecentlyUsedCalculatorIds(disciplineId) : []
  );

  const allCalculators = catalog?.calculators ?? [];

  const searchedCalculators = useMemo(
    () =>
      searchCalculatorsMetadata(
        allCalculators,
        searchQuery,
        catalog?.disciplineName
      ),
    [allCalculators, catalog?.disciplineName, searchQuery]
  );

  const filteredCalculators = useMemo(
    () =>
      filterCalculatorsByTab(
        searchedCalculators,
        activeFilter,
        recentIds,
        favouriteIds
      ),
    [searchedCalculators, activeFilter, recentIds, favouriteIds]
  );

  const popularCalculators = useMemo(
    () => searchedCalculators.filter((calculator) => calculator.isPopular),
    [searchedCalculators]
  );

  const recentlyUsedCalculators = useMemo(
    () =>
      recentIds
        .map((id) => searchedCalculators.find((calculator) => calculator.id === id))
        .filter((calculator): calculator is EngineeringCalculatorMetadata =>
          Boolean(calculator)
        ),
    [recentIds, searchedCalculators]
  );

  const favouriteCalculators = useMemo(
    () =>
      favouriteIds
        .map((id) => searchedCalculators.find((calculator) => calculator.id === id))
        .filter((calculator): calculator is EngineeringCalculatorMetadata =>
          Boolean(calculator)
        ),
    [favouriteIds, searchedCalculators]
  );

  const handleCalculatorOpen = useCallback(
    (calculator: EngineeringCalculatorMetadata) => {
      if (!disciplineId) {
        return;
      }

      recordCalculatorOpen(disciplineId, calculator.id);
      setRecentIds(readRecentlyUsedCalculatorIds(disciplineId));
    },
    [disciplineId]
  );

  const handleToggleFavourite = useCallback(
    (calculatorId: string) => {
      if (!disciplineId) {
        return;
      }

      setFavouriteIds(toggleFavouriteCalculator(disciplineId, calculatorId));
    },
    [disciplineId]
  );

  const isFavourite = useCallback(
    (calculatorId: string) => favouriteIds.includes(calculatorId),
    [favouriteIds]
  );

  const handleShareCalculator = useCallback(
    async (calculator: EngineeringCalculatorMetadata) => {
      const shareText = `${calculator.name} — ${calculator.disciplineName}\n${calculator.description}`;

      if (navigator.share) {
        try {
          await navigator.share({
            title: calculator.name,
            text: shareText,
          });
          return;
        } catch {
          // Fall through to clipboard.
        }
      }

      try {
        await navigator.clipboard.writeText(shareText);
      } catch {
        // Ignore clipboard failures.
      }
    },
    []
  );

  return {
    catalog,
    activeFilter,
    setActiveFilter,
    filteredCalculators,
    popularCalculators,
    recentlyUsedCalculators,
    favouriteCalculators,
    disciplineCalculators: searchedCalculators,
    handleCalculatorOpen,
    handleToggleFavourite,
    handleShareCalculator,
    isFavourite,
  };
};
