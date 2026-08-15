import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import { STANDARDS_PUBLISHERS } from "../publisherRegistry";
import { smartSearch, getFrequentlyUsedClauses } from "../index";
import { useSarathiWorkspace } from "../../sarathi/context/SarathiWorkspaceContext";
import { filtersToSearchParams } from "../../search/searchFilters";
import { DEFAULT_SEARCH_FILTERS } from "../../search/searchFilters";
import { STANDARDS_INTELLIGENCE_CAPABILITIES } from "../types";

const QUICK_PROMPTS = [
  "Explain IS 456 clause 6.1 for flexural design",
  "Compare IRC 37 vs MoRTH flexible pavement guidelines",
  "Summarize NBC 2016 fire safety requirements",
  "Which standard applies for highway bridge design in India?",
  "Mandatory requirements in IS 800 for steel connections",
  "Compare revision changes for IS 456:2000",
];

const StandardsIntelligenceWorkspace: React.FC = () => {
  const navigate = useNavigate();
  const { activeDiscipline } = useSarathiWorkspace();
  const [query, setQuery] = useState("");

  const disciplineId = activeDiscipline?.id ?? null;
  const searchResults = useMemo(
    () => smartSearch(query, { disciplineId }),
    [query, disciplineId]
  );
  const frequentClauses = useMemo(() => getFrequentlyUsedClauses(6), []);

  const openInChat = (message: string) => {
    const slug = disciplineId?.replace(/-engineering$/, "") ?? "";
    const chatPath = slug ? `/chat/${slug}/standards` : "/chat";
    navigate(chatPath, { state: { standardsPrompt: message } });
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!query.trim()) {
      return;
    }
    openInChat(query.trim());
  };

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-cyan-500/20 bg-cyan-500/5 p-5">
        <p className="text-xs uppercase tracking-[0.3em] text-cyan-400">
          Engineering Standards Intelligence
        </p>
        <h2 className="mt-2 text-xl font-semibold text-white">
          Standards Intelligence Workspace
        </h2>
        <p className="mt-2 text-sm text-slate-400">
          ESIE helps you understand, explain, compare, and apply engineering
          standards across IS, IRC, MoRTH, NBC, ASTM, ISO, IEC, and more.
        </p>
        {activeDiscipline ? (
          <p className="mt-2 text-sm text-cyan-300">
            Active discipline: {activeDiscipline.name}
          </p>
        ) : null}
      </div>

      <form
        onSubmit={handleSubmit}
        className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5"
      >
        <label className="block text-sm font-medium text-slate-300">
          Smart standards search
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Code number, keyword, clause, discipline, year, revision..."
            className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:border-cyan-500 focus:outline-none"
          />
        </label>
        <div className="mt-4 flex flex-wrap gap-2">
          <button
            type="submit"
            className="rounded-xl bg-cyan-600 px-4 py-2 text-sm font-semibold text-white hover:bg-cyan-500"
          >
            Ask in AI Chat
          </button>
          <button
            type="button"
            onClick={() => {
              const params = filtersToSearchParams(query, {
                ...DEFAULT_SEARCH_FILTERS,
                entityTypes: ["standard"],
              });
              navigate(`/search?${params.toString()}`);
            }}
            className="rounded-xl border border-slate-700 px-4 py-2 text-sm text-slate-300 hover:bg-slate-800"
          >
            Universal Search
          </button>
        </div>
      </form>

      {query.trim() ? (
        <div className="grid gap-4 lg:grid-cols-2">
          <section className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5">
            <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-400">
              Matched Standards ({searchResults.standards.length})
            </h3>
            <ul className="mt-3 space-y-2">
              {searchResults.standards.slice(0, 6).map((standard) => (
                <li key={standard.id}>
                  <button
                    type="button"
                    onClick={() =>
                      openInChat(`Explain ${standard.codeNumber}: ${standard.title}`)
                    }
                    className="w-full rounded-lg border border-slate-800 bg-slate-950/60 px-3 py-2 text-left text-xs hover:border-cyan-500/40"
                  >
                    <span className="font-medium text-slate-200">
                      {standard.codeNumber}
                    </span>
                    <span className="mt-0.5 block line-clamp-1 text-slate-500">
                      {standard.title}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </section>
          <section className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5">
            <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-400">
              Matched Clauses ({searchResults.clauses.length})
            </h3>
            <ul className="mt-3 space-y-2">
              {searchResults.clauses.slice(0, 6).map((clause) => (
                <li key={clause.id}>
                  <button
                    type="button"
                    onClick={() =>
                      openInChat(
                        `Explain clause ${clause.clauseNumber} of ${clause.standardCode}: ${clause.title}`
                      )
                    }
                    className="w-full rounded-lg border border-slate-800 bg-slate-950/60 px-3 py-2 text-left text-xs hover:border-cyan-500/40"
                  >
                    <span className="font-medium text-slate-200">
                      {clause.standardCode} §{clause.clauseNumber}
                    </span>
                    <span className="mt-0.5 block line-clamp-2 text-slate-500">
                      {clause.summary}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </section>
        </div>
      ) : null}

      <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5">
        <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-400">
          Quick Standards Prompts
        </h3>
        <div className="mt-3 flex flex-wrap gap-2">
          {QUICK_PROMPTS.map((prompt) => (
            <button
              key={prompt}
              type="button"
              onClick={() => {
                setQuery(prompt);
                openInChat(prompt);
              }}
              className="rounded-full border border-slate-700 px-3 py-1.5 text-xs text-slate-300 hover:border-cyan-500/40 hover:text-cyan-300"
            >
              {prompt}
            </button>
          ))}
        </div>
      </div>

      <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5">
        <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-400">
          Frequently Used Clauses
        </h3>
        <ul className="mt-3 space-y-2">
          {frequentClauses.map((clause) => (
            <li key={clause.id}>
              <button
                type="button"
                onClick={() =>
                  openInChat(
                    `Explain mandatory clause ${clause.clauseNumber} of ${clause.standardCode}`
                  )
                }
                className="w-full rounded-lg border border-slate-800 px-3 py-2 text-left text-xs hover:border-cyan-500/40"
              >
                <span className="text-slate-200">
                  {clause.standardCode} §{clause.clauseNumber}
                </span>
                <span className="mt-0.5 block text-slate-500">{clause.title}</span>
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5">
        <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-400">
          Supported Publishers
        </h3>
        <div className="mt-3 flex flex-wrap gap-2">
          {STANDARDS_PUBLISHERS.map((publisher) => (
            <span
              key={publisher.id}
              className="rounded-full border border-slate-700 px-3 py-1 text-xs text-slate-400"
            >
              {publisher.label}
            </span>
          ))}
        </div>
      </div>

      <div className="rounded-2xl border border-dashed border-slate-800 bg-slate-900/40 p-5">
        <h3 className="text-sm font-semibold text-slate-400">Future Ready</h3>
        <ul className="mt-2 space-y-1 text-xs text-slate-500">
          <li>OCR ingestion: {STANDARDS_INTELLIGENCE_CAPABILITIES.ocr ? "on" : "planned"}</li>
          <li>AI clause extraction: {STANDARDS_INTELLIGENCE_CAPABILITIES.aiClauseExtraction ? "on" : "planned"}</li>
          <li>Automatic revision tracking: {STANDARDS_INTELLIGENCE_CAPABILITIES.automaticRevisionTracking ? "on" : "planned"}</li>
          <li>PMIS compliance integration: {STANDARDS_INTELLIGENCE_CAPABILITIES.pmisCompliance ? "on" : "planned"}</li>
        </ul>
      </div>
    </div>
  );
};

export default StandardsIntelligenceWorkspace;
