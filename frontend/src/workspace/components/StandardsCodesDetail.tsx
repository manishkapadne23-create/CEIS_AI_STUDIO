import React, { useMemo, useState } from "react";
import { useEngineeringWorkspace } from "../../context/EngineeringWorkspaceContext";
import { getStandardsRegistry } from "../../knowledge/standards/standardsRegistry";
import type {
  EngineeringStandardFamilyKey,
  ResolvedEngineeringStandard,
} from "../../knowledge/types/EngineeringStandard";
import { ENGINEERING_STANDARD_FAMILY_LABELS } from "../../knowledge/types/EngineeringStandard";
import { resolveStandardsWithKnowledge } from "../../knowledge/utils/resolveStandardsWithKnowledge";
import { useSarathiWorkspace } from "../../sarathi/context/SarathiWorkspaceContext";
import {
  getStandardsCategoriesForDiscipline,
  type StandardsNavigationCategory,
  type StandardsNavigationView,
} from "../utils/standardsNavigation";
import WorkspaceListItemCard from "./WorkspaceListItemCard";

interface StandardsCodesDetailProps {
  disciplineId: string | null;
  isPlaceholder: boolean;
  onBack: () => void;
}

const StandardsCodesDetail: React.FC<StandardsCodesDetailProps> = ({
  disciplineId,
  isPlaceholder,
  onBack,
}) => {
  const { workspace } = useEngineeringWorkspace();
  const { openStandard } = useSarathiWorkspace();
  const [view, setView] = useState<StandardsNavigationView>("categories");
  const [selectedCategory, setSelectedCategory] =
    useState<StandardsNavigationCategory | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const resolvedStandards = useMemo(
    () => resolveStandardsWithKnowledge(workspace),
    [workspace]
  );

  const registry = disciplineId ? getStandardsRegistry(disciplineId) : undefined;

  const categories = useMemo(
    () => getStandardsCategoriesForDiscipline(disciplineId),
    [disciplineId]
  );

  const publications = useMemo(() => {
    if (!selectedCategory?.familyKey) {
      return [];
    }

    const family = registry?.families.find(
      (entry) => entry.key === selectedCategory.familyKey
    );

    return family?.documents ?? [];
  }, [registry, selectedCategory]);

  const filteredCategories = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    if (!query || view !== "categories") {
      return categories;
    }

    return categories.filter((category) => {
      const haystack = [category.label, category.description]
        .join(" ")
        .toLowerCase();

      return haystack.includes(query);
    });
  }, [categories, searchQuery, view]);

  const filteredPublications = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    if (!query) {
      return publications;
    }

    return publications.filter((document) => {
      const haystack = [document.code, document.title, document.description]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return haystack.includes(query);
    });
  }, [publications, searchQuery]);

  const handleCategorySelect = (category: StandardsNavigationCategory) => {
    setSelectedCategory(category);
    setSearchQuery("");
    setView("publications");
  };

  const handleBackToCategories = () => {
    setView("categories");
    setSelectedCategory(null);
    setSearchQuery("");
  };

  const handleOpenPublication = (documentId: string) => {
    const standard = resolvedStandards.standards.find(
      (entry) => entry.id === documentId
    );

    if (standard) {
      openStandard(standard);
      return;
    }

    const document = publications.find((entry) => entry.id === documentId);

    if (!document || !selectedCategory?.familyKey) {
      return;
    }

    openStandard({
      id: document.id,
      code: document.code,
      title: document.title,
      description: document.description,
      family: document.family,
      familyLabel:
        ENGINEERING_STANDARD_FAMILY_LABELS[document.family] ??
        selectedCategory.label,
      status: document.status,
      fromKnowledgeRepository: false,
    });
  };

  const getCategoryCount = (familyKey?: EngineeringStandardFamilyKey) => {
    if (!familyKey || !registry) {
      return 0;
    }

    return (
      registry.families.find((family) => family.key === familyKey)?.documents
        .length ?? 0
    );
  };

  const getPublicationStatus = (
    status: ResolvedEngineeringStandard["status"]
  ): "available" | "coming-soon" | "beta" => {
    if (status === "coming-soon") {
      return "coming-soon";
    }

    return "available";
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex min-w-0 items-start gap-3">
          <button
            type="button"
            onClick={view === "categories" ? onBack : handleBackToCategories}
            className="shrink-0 rounded-lg border border-slate-700 px-2.5 py-1 text-xs text-slate-300 hover:bg-slate-900"
          >
            ← Back
          </button>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-xl" aria-hidden="true">
                📜
              </span>
              <h3 className="line-clamp-2 text-lg font-semibold text-white">
                {view === "categories"
                  ? "Standards & Codes"
                  : selectedCategory?.label}
              </h3>
            </div>
            <p className="mt-1 line-clamp-2 text-sm text-slate-400">
              {view === "categories"
                ? "Browse IRC, IS, MoRTH, ASTM, AASHTO, and applicable standards families."
                : `Search and open publications from ${selectedCategory?.label}.`}
            </p>
          </div>
        </div>
        <input
          type="search"
          value={searchQuery}
          onChange={(event) => setSearchQuery(event.target.value)}
          placeholder={
            view === "categories"
              ? "Search standards families..."
              : `Search ${selectedCategory?.label ?? "publications"}...`
          }
          className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white placeholder:text-slate-500 focus:border-cyan-500 focus:outline-none sm:max-w-xs"
          aria-label="Search standards"
        />
      </div>

      {view === "categories" ? (
        <ul className="workspace-card-grid">
          {filteredCategories.length > 0 ? (
            filteredCategories.map((category) => {
              const count = getCategoryCount(category.familyKey);
              const isComingSoon =
                !category.familyKey || count === 0 || isPlaceholder;

              return (
                <li key={category.id} className="h-full min-w-0">
                  <WorkspaceListItemCard
                    title={category.label}
                    description={category.description}
                    icon={category.icon}
                    status={isComingSoon ? "coming-soon" : "available"}
                    badge={
                      count > 0 ? `${count} publications` : undefined
                    }
                    onClick={
                      category.familyKey
                        ? () => handleCategorySelect(category)
                        : undefined
                    }
                  />
                </li>
              );
            })
          ) : (
            <li className="col-span-full rounded-xl border border-dashed border-slate-700 px-4 py-8 text-center text-sm text-slate-500">
              {categories.length === 0
                ? "Select a discipline to browse standards and codes."
                : "No standards families match your search."}
            </li>
          )}
        </ul>
      ) : (
        <ul className="workspace-card-grid">
          {filteredPublications.length > 0 ? (
            filteredPublications.map((document) => (
              <li key={document.id} className="h-full min-w-0">
                <WorkspaceListItemCard
                  title={document.code}
                  description={document.title}
                  status={getPublicationStatus(document.status)}
                  onClick={() => handleOpenPublication(document.id)}
                />
              </li>
            ))
          ) : (
            <li className="col-span-full rounded-xl border border-dashed border-slate-700 px-4 py-8 text-center text-sm text-slate-500">
              {publications.length === 0
                ? "Publications for this family are coming soon."
                : "No publications match your search."}
            </li>
          )}
        </ul>
      )}
    </div>
  );
};

export default StandardsCodesDetail;
