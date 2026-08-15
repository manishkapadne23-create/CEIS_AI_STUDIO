import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import { useSarathiWorkspace } from "../../sarathi/context/SarathiWorkspaceContext";
import { DECISION_DISCIPLINES } from "../disciplineRegistry";
import { searchDecisionIntelligence } from "../decisionSearch";
import {
  createDecisionSession,
  listDecisionSessions,
  deleteDecisionSession,
} from "../decisionWorkspace";
import { filtersToSearchParams } from "../../search/searchFilters";
import { DEFAULT_SEARCH_FILTERS } from "../../search/searchFilters";

const QUICK_PROMPTS = [
  "Compare rigid pavement vs flexible pavement for highway project",
  "Evaluate steel bridge vs PSC bridge for 45m span",
  "Decision matrix for solar vs wind energy at industrial site",
  "Risk assessment for bored tunnel vs open cut construction",
  "Recommend best foundation type for soft soil conditions",
];

const DecisionIntelligenceWorkspace: React.FC = () => {
  const navigate = useNavigate();
  const { activeDiscipline } = useSarathiWorkspace();
  const [problem, setProblem] = useState("");
  const [sessions, setSessions] = useState(() => listDecisionSessions());

  const disciplineId = activeDiscipline?.id ?? null;
  const searchResults = useMemo(
    () => searchDecisionIntelligence(problem, disciplineId, 6),
    [problem, disciplineId]
  );

  const openInChat = (message: string) => {
    createDecisionSession({
      title: message.slice(0, 80),
      problemStatement: message,
      disciplineId,
      disciplineName: activeDiscipline?.name ?? null,
    });
    setSessions(listDecisionSessions());

    const slug = disciplineId?.replace(/-engineering$/, "") ?? "";
    const chatPath = slug ? `/chat/${slug}` : "/chat";
    navigate(chatPath, { state: { decisionPrompt: message } });
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!problem.trim()) {
      return;
    }
    openInChat(problem.trim());
  };

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-cyan-500/20 bg-cyan-500/5 p-5">
        <p className="text-xs uppercase tracking-[0.3em] text-cyan-400">
          Engineering Decision Support
        </p>
        <h2 className="mt-2 text-xl font-semibold text-white">
          Decision Intelligence Workspace
        </h2>
        <p className="mt-2 text-sm text-slate-400">
          EDIE supports structured evaluation of engineering alternatives. Sarathi AI
          assists — it does not make automatic decisions.
        </p>
        {activeDiscipline ? (
          <p className="mt-2 text-sm text-cyan-300">
            Active discipline: {activeDiscipline.name}
          </p>
        ) : null}
      </div>

      <form onSubmit={handleSubmit} className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5">
        <label className="block text-sm font-medium text-slate-300">
          Engineering decision or comparison
          <textarea
            value={problem}
            onChange={(event) => setProblem(event.target.value)}
            rows={4}
            placeholder="Describe the engineering decision, alternatives, and constraints..."
            className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:border-cyan-500 focus:outline-none"
          />
        </label>
        <div className="mt-4 flex flex-wrap gap-2">
          <button
            type="submit"
            className="rounded-xl bg-cyan-600 px-4 py-2 text-sm font-semibold text-white hover:bg-cyan-500"
          >
            Analyze in AI Chat
          </button>
          <button
            type="button"
            onClick={() => {
              const params = filtersToSearchParams(problem, DEFAULT_SEARCH_FILTERS);
              navigate(`/search?${params.toString()}`);
            }}
            className="rounded-xl border border-slate-700 px-4 py-2 text-sm text-slate-300 hover:bg-slate-800"
          >
            Search References
          </button>
        </div>
      </form>

      <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5">
        <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-400">
          Quick Decision Prompts
        </h3>
        <div className="mt-3 flex flex-wrap gap-2">
          {QUICK_PROMPTS.map((prompt) => (
            <button
              key={prompt}
              type="button"
              onClick={() => {
                setProblem(prompt);
                openInChat(prompt);
              }}
              className="rounded-full border border-slate-700 px-3 py-1.5 text-xs text-slate-300 hover:border-cyan-500 hover:text-cyan-300"
            >
              {prompt}
            </button>
          ))}
        </div>
      </div>

      {searchResults.length > 0 ? (
        <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5">
          <h3 className="text-sm font-semibold text-white">Related References</h3>
          <ul className="mt-3 space-y-2">
            {searchResults.map((result) => (
              <li
                key={result.id}
                className="rounded-lg border border-slate-800 px-3 py-2 text-sm text-slate-300"
              >
                <span className="text-xs uppercase text-slate-500">{result.type}</span>
                <p className="font-medium text-white">{result.title}</p>
                {result.subtitle ? (
                  <p className="text-xs text-slate-400">{result.subtitle}</p>
                ) : null}
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5">
        <h3 className="text-sm font-semibold text-white">Supported Disciplines</h3>
        <div className="mt-3 flex flex-wrap gap-2">
          {DECISION_DISCIPLINES.map((discipline) => (
            <span
              key={discipline.id}
              className="rounded-full border border-slate-700 px-3 py-1 text-xs text-slate-400"
            >
              {discipline.name}
            </span>
          ))}
        </div>
      </div>

      <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5">
        <h3 className="text-sm font-semibold text-white">Recent Decision Sessions</h3>
        <ul className="mt-3 space-y-2">
          {sessions.length > 0 ? (
            sessions.slice(0, 8).map((session) => (
              <li
                key={session.id}
                className="flex items-center gap-3 rounded-lg border border-slate-800 px-3 py-2"
              >
                <button
                  type="button"
                  onClick={() => openInChat(session.problemStatement)}
                  className="min-w-0 flex-1 text-left text-sm text-slate-300 hover:text-white"
                >
                  <p className="truncate font-medium">{session.title}</p>
                  <p className="text-xs text-slate-500">
                    {session.disciplineName ?? "General"} ·{" "}
                    {new Date(session.updatedAt).toLocaleDateString()}
                  </p>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    deleteDecisionSession(session.id);
                    setSessions(listDecisionSessions());
                  }}
                  className="text-xs text-slate-500 hover:text-red-300"
                  aria-label="Delete session"
                >
                  ×
                </button>
              </li>
            ))
          ) : (
            <li className="text-sm text-slate-500">
              Decision sessions will appear here as you use EDIE.
            </li>
          )}
        </ul>
      </div>
    </div>
  );
};

export default DecisionIntelligenceWorkspace;
