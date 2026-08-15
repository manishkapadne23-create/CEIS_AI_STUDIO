import React, { useState } from "react";

import { useNavigate } from "react-router-dom";

import UserProfileMenu from "../../components/UserProfileMenu";

import { useChatSession } from "../../navigation/ChatSessionContext";

import { getChatRouteFromWorkspace } from "../../navigation/disciplineSlugs";

import { filtersToSearchParams } from "../../search/searchFilters";

import SearchDropdown from "../../search/components/SearchDropdown";

import { useUniversalSearch } from "../../search/hooks/useUniversalSearch";

import {

  executeSearchResultAction,

  toEngineeringSearchResult,

} from "../../search/searchActions";

import { useSarathiWorkspace } from "../context/SarathiWorkspaceContext";

import type { EngineeringSearchResult } from "../types";

import type { UniversalSearchResult } from "../../search/types";



interface WorkspaceGlobalHeaderProps {

  onSelectResult: (result: EngineeringSearchResult) => void;

  style?: React.CSSProperties;

}



const WorkspaceGlobalHeader: React.FC<WorkspaceGlobalHeaderProps> = ({

  onSelectResult,

  style,

}) => {

  const navigate = useNavigate();

  const [query, setQuery] = useState("");

  const [isFocused, setIsFocused] = useState(false);

  const {

    activeDiscipline,

    activeSpecialization,

    searchScope,

    setSearchScope,

    selectDiscipline,

    openModule,

  } = useSarathiWorkspace();

  const { selectChat } = useChatSession();



  const { dropdownResults, suggestions, isSearching } = useUniversalSearch(query, {

    scope: searchScope,

    disciplineId: activeDiscipline?.id ?? null,

    dropdownLimit: 8,

    mode: "dropdown",

  });



  const workspaceDisciplineName = activeDiscipline?.name ?? null;
  const workspaceSpecializationName = activeSpecialization?.name ?? null;
  const activeContextLabel =
    workspaceDisciplineName && workspaceSpecializationName
      ? `${workspaceDisciplineName} → ${workspaceSpecializationName}`
      : workspaceDisciplineName ?? workspaceSpecializationName;



  const handleUniversalResult = (result: UniversalSearchResult) => {

    const legacyResult = toEngineeringSearchResult(result);

    if (legacyResult) {

      onSelectResult(legacyResult);

      return;

    }



    executeSearchResultAction(result, {

      navigate,

      selectDiscipline,

      openModule,

      selectChat,

    });

  };



  const openSearchPage = (searchQuery = query) => {

    const params = filtersToSearchParams(searchQuery, {

      scope: searchScope,

      disciplineId: activeDiscipline?.id ?? null,

      moduleId: null,

      entityTypes: null,

      documentType: null,

      standardCode: null,

      calculatorId: null,

      templateCategory: null,

      dateFrom: null,

      dateTo: null,

      favoritesOnly: false,

      recentOnly: false,

      limit: 60,

      dropdownLimit: 8,

    });

    navigate(`/search?${params.toString()}`);

  };



  return (

    <header

      className="border-b border-slate-800 bg-slate-900/95 px-4 py-3 sm:px-5"

      style={style}

    >

      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:gap-4">

        <div className="min-w-0 flex-1 space-y-2">

          <div className="flex flex-wrap items-center gap-2">

            <button

              type="button"

              onClick={() => setSearchScope("workspace")}

              className={`rounded-full border px-3 py-1 text-xs transition ${

                searchScope === "workspace"

                  ? "border-cyan-500 bg-cyan-500/10 text-cyan-300"

                  : "border-slate-700 text-slate-400 hover:bg-slate-900"

              }`}

            >

              {activeDiscipline

                ? `Workspace: ${activeDiscipline.name}`

                : "Current Workspace"}

            </button>

            <button

              type="button"

              onClick={() => setSearchScope("all")}

              className={`rounded-full border px-3 py-1 text-xs transition ${

                searchScope === "all"

                  ? "border-cyan-500 bg-cyan-500/10 text-cyan-300"

                  : "border-slate-700 text-slate-400 hover:bg-slate-900"

              }`}

            >

              All Engineering

            </button>

          </div>



          <div className="flex items-center gap-3">

            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-cyan-500/10 text-cyan-400">

              🔍

            </div>

            <div className="relative min-w-0 flex-1">

              <input

                type="search"

                value={query}

                onChange={(event) => setQuery(event.target.value)}

                onFocus={() => setIsFocused(true)}

                onBlur={() => {

                  window.setTimeout(() => setIsFocused(false), 150);

                }}

                onKeyDown={(event) => {

                  if (event.key === "Enter") {

                    event.preventDefault();

                    openSearchPage();

                  }

                }}

                placeholder={

                  searchScope === "all"

                    ? "Search all engineering disciplines, standards, documents..."

                    : "Search within the active workspace..."

                }

                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-2.5 text-sm text-white placeholder:text-slate-500 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500/40"

                aria-label="Universal engineering search"

                data-voice-search-ready="true"

              />



              {isFocused ? (

                <SearchDropdown

                  query={query}

                  results={dropdownResults}

                  suggestions={suggestions}

                  isSearching={isSearching}

                  onSelectResult={handleUniversalResult}

                  onSelectSuggestion={setQuery}

                  onViewAll={() => openSearchPage()}

                />

              ) : null}

            </div>

          </div>



          {activeContextLabel ? (

            <nav

              aria-label="Active workspace"

              className="pl-12"

            >

              <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-slate-500">

                Active

              </p>

              <p className="mt-1 text-xs font-medium text-cyan-200">

                {activeContextLabel}

              </p>

            </nav>

          ) : null}

        </div>



        <UserProfileMenu

          className="shrink-0 self-start lg:self-center"

          onMenuAction={(action) => {

            if (action === "logout") {

              navigate("/");

              return;

            }

            if (action === "profile") navigate("/profile");

            if (action === "documents") navigate("/documents");

            if (action === "subscription") navigate("/subscription");

            if (action === "settings") navigate("/settings");

            if (action === "help") navigate("/help");

            if (action === "saved-chats") navigate(getChatRouteFromWorkspace());

          }}

        />

      </div>

    </header>

  );

};



export default WorkspaceGlobalHeader;

