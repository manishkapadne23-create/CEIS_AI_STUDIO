import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import { useSarathiWorkspace } from "../../sarathi/context/SarathiWorkspaceContext";
import { filtersToSearchParams } from "../../search/searchFilters";
import { DEFAULT_SEARCH_FILTERS } from "../../search/searchFilters";
import {
  exploreKnowledgePath,
  formatExplorerPath,
  generateGraphRecommendations,
  KNOWLEDGE_GRAPH_CAPABILITIES,
  listExplorerTopics,
  searchKnowledgeGraph,
} from "../index";

const QUICK_PROMPTS = [
  "Explore flexible pavement engineering knowledge path",
  "What is related to IRC 37 pavement design?",
  "Find calculators and workflows for reinforced concrete design",
  "Cross-reference IS 456 with related templates and documents",
  "Recommend next topics for highway engineering",
  "What standards apply to bridge design workflow?",
];

const KnowledgeGraphWorkspace: React.FC = () => {
  const navigate = useNavigate();
  const { activeDiscipline } = useSarathiWorkspace();
  const [query, setQuery] = useState("");

  const disciplineId = activeDiscipline?.id ?? null;
  const searchResults = useMemo(
    () => searchKnowledgeGraph({ query, disciplineId, limit: 8 }),
    [query, disciplineId]
  );
  const recommendations = useMemo(
    () => generateGraphRecommendations(query, disciplineId),
    [query, disciplineId]
  );
  const explorerPath = useMemo(() => {
    if (!query.trim()) return null;
    return exploreKnowledgePath(query, disciplineId);
  }, [query, disciplineId]);

  const openInChat = (message: string) => {
    const slug = disciplineId?.replace(/-engineering$/, "") ?? "";
    const chatPath = slug ? `/chat/${slug}` : "/chat";
    navigate(chatPath, { state: { knowledgePrompt: message } });
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!query.trim()) return;
    openInChat(query.trim());
  };

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-cyan-500/20 bg-cyan-500/5 p-5">
        <p className="text-xs uppercase tracking-[0.3em] text-cyan-400">
          Engineering Knowledge Graph
        </p>
        <h2 className="mt-2 text-xl font-semibold text-white">
          Knowledge Graph Explorer
        </h2>
        <p className="mt-2 text-sm text-slate-400">
          EKG connects disciplines, topics, standards, calculators, workflows,
          templates, documents, and AI experts into an intelligent semantic layer.
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
          Graph search (semantic, relationship, dependency, cross-reference)
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Engineering topic, standard, calculator, workflow..."
            className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:border-cyan-500 focus:outline-none"
          />
        </label>
        <div className="mt-4 flex flex-wrap gap-2">
          <button
            type="submit"
            className="rounded-xl bg-cyan-600 px-4 py-2 text-sm font-semibold text-white hover:bg-cyan-500"
          >
            Explore in AI Chat
          </button>
          <button
            type="button"
            onClick={() => {
              const params = filtersToSearchParams(query, DEFAULT_SEARCH_FILTERS);
              navigate(`/search?${params.toString()}`);
            }}
            className="rounded-xl border border-slate-700 px-4 py-2 text-sm text-slate-300 hover:bg-slate-800"
          >
            Universal Search
          </button>
        </div>
      </form>

      {explorerPath ? (
        <section className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5">
          <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-400">
            Knowledge Explorer Path
          </h3>
          <pre className="mt-3 whitespace-pre-wrap text-xs leading-6 text-slate-300">
            {formatExplorerPath(explorerPath)}
          </pre>
        </section>
      ) : null}

      {searchResults.length > 0 ? (
        <section className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5">
          <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-400">
            Matched Entities ({searchResults.length})
          </h3>
          <ul className="mt-3 space-y-2">
            {searchResults.map((result) => (
              <li key={result.entity.id}>
                <button
                  type="button"
                  onClick={() =>
                    openInChat(`Explain ${result.entity.label} and its related engineering resources`)
                  }
                  className="w-full rounded-lg border border-slate-800 bg-slate-950/60 px-3 py-2 text-left text-xs hover:border-cyan-500/40"
                >
                  <span className="font-medium text-slate-200">
                    [{result.entity.type}] {result.entity.label}
                  </span>
                  <span className="mt-0.5 block line-clamp-2 text-slate-500">
                    {result.entity.description}
                  </span>
                  {result.relatedEntities.length > 0 ? (
                    <span className="mt-1 block text-[10px] text-cyan-400/80">
                      {result.relatedEntities.length} related entities
                    </span>
                  ) : null}
                </button>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {recommendations.length > 0 ? (
        <section className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5">
          <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-400">
            Smart Recommendations
          </h3>
          <ul className="mt-3 space-y-2">
            {recommendations.slice(0, 8).map((rec) => (
              <li key={rec.entityId}>
                <button
                  type="button"
                  onClick={() => openInChat(`Tell me about ${rec.title} and how it relates to my engineering work`)}
                  className="w-full rounded-lg border border-slate-800 px-3 py-2 text-left text-xs hover:border-cyan-500/40"
                >
                  <span className="text-slate-200">[{rec.category}] {rec.title}</span>
                  <span className="mt-0.5 block line-clamp-1 text-slate-500">
                    {rec.description}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <section className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5">
        <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-400">
          Explorer Topics
        </h3>
        <div className="mt-3 flex flex-wrap gap-2">
          {listExplorerTopics().map((topic) => (
            <button
              key={topic}
              type="button"
              onClick={() => {
                setQuery(topic);
                openInChat(`Explore engineering knowledge path for ${topic}`);
              }}
              className="rounded-full border border-slate-700 px-3 py-1.5 text-xs text-slate-300 hover:border-cyan-500/40"
            >
              {topic}
            </button>
          ))}
        </div>
      </section>

      <section className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5">
        <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-400">
          Quick Graph Prompts
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
              className="rounded-full border border-slate-700 px-3 py-1.5 text-xs text-slate-300 hover:border-cyan-500/40"
            >
              {prompt}
            </button>
          ))}
        </div>
      </section>

      <section className="rounded-2xl border border-dashed border-slate-800 bg-slate-900/40 p-5">
        <h3 className="text-sm font-semibold text-slate-400">Visualization (Future Ready)</h3>
        <ul className="mt-2 space-y-1 text-xs text-slate-500">
          <li>Interactive graph: {KNOWLEDGE_GRAPH_CAPABILITIES.interactiveVisualization ? "on" : "planned"}</li>
          <li>Vector database / RAG: {KNOWLEDGE_GRAPH_CAPABILITIES.vectorDatabase ? "on" : "planned"}</li>
          <li>Ontology support: {KNOWLEDGE_GRAPH_CAPABILITIES.ontology ? "on" : "planned"}</li>
          <li>PMIS knowledge layer: {KNOWLEDGE_GRAPH_CAPABILITIES.pmisKnowledgeLayer ? "on" : "planned"}</li>
          <li>Digital twin integration: {KNOWLEDGE_GRAPH_CAPABILITIES.digitalTwin ? "on" : "planned"}</li>
        </ul>
      </section>
    </div>
  );
};

export default KnowledgeGraphWorkspace;
