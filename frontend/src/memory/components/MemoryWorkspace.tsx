import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import { useSarathiWorkspace } from "../../sarathi/context/SarathiWorkspaceContext";
import {
  clearSessionMemory,
  downloadMemoryExport,
  ENGINEERING_MEMORY_CAPABILITIES,
  getDocumentMemorySummary,
  getProjectMemorySummary,
  MEMORY_SECURITY_CONFIG,
  searchEngineeringMemory,
  viewMemoryBundle,
} from "../index";

const RECALL_PROMPTS = [
  "Continue our previous discussion",
  "Show my previous calculation",
  "Open my last report",
  "Restore my recent workflow",
  "Find my earlier recommendation",
];

const MemoryWorkspace: React.FC = () => {
  const navigate = useNavigate();
  const { activeDiscipline } = useSarathiWorkspace();
  const [query, setQuery] = useState("");
  const disciplineId = activeDiscipline?.id ?? null;

  const memoryBundle = useMemo(
    () => viewMemoryBundle(disciplineId),
    [disciplineId]
  );
  const searchResults = useMemo(
    () => searchEngineeringMemory(query, null, disciplineId),
    [query, disciplineId]
  );
  const projectSummary = useMemo(() => getProjectMemorySummary(), []);
  const documentSummary = useMemo(() => getDocumentMemorySummary(), []);

  const openInChat = (message: string) => {
    const slug = disciplineId?.replace(/-engineering$/, "") ?? "";
    const chatPath = slug ? `/chat/${slug}` : "/chat";
    navigate(chatPath, { state: { memoryPrompt: message } });
  };

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-cyan-500/20 bg-cyan-500/5 p-5">
        <p className="text-xs uppercase tracking-[0.3em] text-cyan-400">
          Engineering Digital Memory
        </p>
        <h2 className="mt-2 text-xl font-semibold text-white">
          Memory Workspace
        </h2>
        <p className="mt-2 text-sm text-slate-400">
          Structured engineering memory across conversations, projects, documents,
          standards, calculators, and workflows.
        </p>
        {activeDiscipline ? (
          <p className="mt-2 text-sm text-cyan-300">
            Active discipline: {activeDiscipline.name}
          </p>
        ) : null}
      </div>

      <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5">
        <label className="block text-sm font-medium text-slate-300">
          Memory search
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search projects, documents, standards, conversations..."
            className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:border-cyan-500 focus:outline-none"
          />
        </label>
        {searchResults.length > 0 ? (
          <ul className="mt-4 space-y-2">
            {searchResults.slice(0, 8).map((result) => (
              <li key={result.id}>
                <button
                  type="button"
                  onClick={() => openInChat(`Recall: ${result.title}`)}
                  className="w-full rounded-lg border border-slate-800 px-3 py-2 text-left text-xs hover:border-cyan-500/40"
                >
                  <span className="text-slate-200">
                    [{result.category}] {result.title}
                  </span>
                  <span className="mt-0.5 block line-clamp-1 text-slate-500">
                    {result.description}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        ) : null}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <section className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5">
          <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-400">
            User Memory
          </h3>
          <ul className="mt-3 space-y-1 text-xs text-slate-400">
            <li>Primary: {memoryBundle.user.primaryDisciplineName ?? "—"}</li>
            <li>Units: {memoryBundle.user.preferredUnits}</li>
            <li>Language: {memoryBundle.user.preferredLanguage}</li>
            <li>Standards: {memoryBundle.user.preferredStandards.join(", ") || "—"}</li>
          </ul>
        </section>
        <section className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5">
          <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-400">
            Context Memory
          </h3>
          <ul className="mt-3 space-y-1 text-xs text-slate-400">
            <li>Last module: {memoryBundle.context.lastModuleId ?? "—"}</li>
            <li>Last topic: {memoryBundle.context.lastTopic ?? "—"}</li>
            <li>Last route: {memoryBundle.context.lastWorkspaceRoute ?? "—"}</li>
          </ul>
        </section>
        <section className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5">
          <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-400">
            Project Memory
          </h3>
          <ul className="mt-3 space-y-1 text-xs text-slate-400">
            <li>Projects: {projectSummary.projectCount}</li>
            <li>Active: {projectSummary.activeProject?.name ?? "—"}</li>
            <li>Recent docs: {projectSummary.recentDocuments.length}</li>
            <li>Recent workflows: {projectSummary.recentWorkflows.length}</li>
          </ul>
        </section>
        <section className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5">
          <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-400">
            Document Memory
          </h3>
          <ul className="mt-3 space-y-1 text-xs text-slate-400">
            <li>Total documents: {documentSummary.totalDocuments}</li>
            <li>Bookmarked: {documentSummary.bookmarked.length}</li>
            <li>Recently viewed: {documentSummary.recentlyViewed.length}</li>
          </ul>
        </section>
      </div>

      <section className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5">
        <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-400">
          Smart Recall
        </h3>
        <div className="mt-3 flex flex-wrap gap-2">
          {RECALL_PROMPTS.map((prompt) => (
            <button
              key={prompt}
              type="button"
              onClick={() => openInChat(prompt)}
              className="rounded-full border border-slate-700 px-3 py-1.5 text-xs text-slate-300 hover:border-cyan-500/40"
            >
              {prompt}
            </button>
          ))}
        </div>
      </section>

      <section className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5">
        <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-400">
          Memory Controls
        </h3>
        <div className="mt-3 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => downloadMemoryExport()}
            className="rounded-xl border border-cyan-500/30 bg-cyan-500/10 px-4 py-2 text-xs text-cyan-300 hover:bg-cyan-500/20"
          >
            Export Memory
          </button>
          <button
            type="button"
            onClick={() => clearSessionMemory()}
            className="rounded-xl border border-slate-700 px-4 py-2 text-xs text-slate-300 hover:bg-slate-800"
          >
            Clear Session
          </button>
        </div>
      </section>

      <section className="rounded-2xl border border-dashed border-slate-800 bg-slate-900/40 p-5">
        <h3 className="text-sm font-semibold text-slate-400">Security & Future Ready</h3>
        <ul className="mt-2 space-y-1 text-xs text-slate-500">
          <li>User-scoped: {MEMORY_SECURITY_CONFIG.userScoped ? "yes" : "no"}</li>
          <li>Encryption: {MEMORY_SECURITY_CONFIG.encryptionEnabled ? "enabled" : "off"}</li>
          <li>GDPR-ready: {MEMORY_SECURITY_CONFIG.gdprReady ? "yes" : "no"}</li>
          <li>Enterprise memory: {ENGINEERING_MEMORY_CAPABILITIES.enterpriseMemory ? "on" : "planned"}</li>
          <li>Cross-device sync: {ENGINEERING_MEMORY_CAPABILITIES.crossDeviceSync ? "on" : "planned"}</li>
        </ul>
      </section>
    </div>
  );
};

export default MemoryWorkspace;
