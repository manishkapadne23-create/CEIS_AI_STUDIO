import React, { useMemo } from "react";
import type { EngineeringStandardMetadata } from "../../config/standards";
import { buildStandardKnowledgePanelData } from "../../config/standards";
import {
  buildStandardRelationships,
  getClausesForStandard,
  getLatestRevisionNote,
  buildComplianceNotes,
} from "../../standards-intelligence";

interface StandardsKnowledgePanelProps {
  standard: EngineeringStandardMetadata;
  isFavourite: boolean;
  onToggleFavourite: () => void;
  onSelectRelated: (standard: EngineeringStandardMetadata) => void;
  onAskAI?: (prompt: string) => void;
}

const AI_ACTIONS = [
  { label: "Explain Standard", prompt: (code: string) => `Explain standard ${code} and its key requirements` },
  { label: "Summarize", prompt: (code: string) => `Summarize ${code} for a practicing engineer` },
  { label: "Mandatory Clauses", prompt: (code: string) => `List mandatory requirements in ${code}` },
  { label: "Compare Revisions", prompt: (code: string) => `Compare revision changes for ${code}` },
  { label: "Applicability", prompt: (code: string) => `When should ${code} be applied on Indian projects?` },
] as const;

const StandardsKnowledgePanel: React.FC<StandardsKnowledgePanelProps> = ({
  standard,
  isFavourite,
  onToggleFavourite,
  onSelectRelated,
  onAskAI,
}) => {
  const panelData = buildStandardKnowledgePanelData(standard);
  const clauses = useMemo(() => getClausesForStandard(standard.id), [standard.id]);
  const relationships = useMemo(
    () => buildStandardRelationships(standard),
    [standard]
  );
  const complianceNotes = useMemo(
    () =>
      buildComplianceNotes(
        [standard],
        clauses.filter((clause) => clause.isMandatory)
      ),
    [clauses, standard]
  );

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4">
        <p className="text-[10px] font-semibold uppercase tracking-wider text-cyan-400">
          Standard Summary
        </p>
        <h3 className="mt-1 text-base font-semibold text-white">
          {standard.codeNumber}
        </h3>
        <p className="mt-1 text-sm text-slate-300">{standard.title}</p>
        <p className="mt-3 text-sm leading-6 text-slate-400">
          {panelData.summary}
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={onToggleFavourite}
            className="rounded-lg border border-slate-700 px-2.5 py-1 text-xs text-slate-300 hover:bg-slate-900"
          >
            {isFavourite ? "★ Favorited" : "☆ Favorite"}
          </button>
          <a
            href={standard.externalLink}
            target="_blank"
            rel="noreferrer noopener"
            className="rounded-lg border border-cyan-500/40 bg-cyan-500/10 px-2.5 py-1 text-xs text-cyan-300 hover:bg-cyan-500/20"
          >
            Official link
          </a>
        </div>
      </div>

      {onAskAI ? (
        <section className="rounded-xl border border-cyan-500/20 bg-cyan-500/5 p-4">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-cyan-400">
            AI Standards Assistant
          </h4>
          <div className="mt-2 flex flex-wrap gap-2">
            {AI_ACTIONS.map((action) => (
              <button
                key={action.label}
                type="button"
                onClick={() => onAskAI(action.prompt(standard.codeNumber))}
                className="rounded-lg border border-cyan-500/30 bg-slate-950/60 px-2.5 py-1 text-xs text-cyan-200 hover:bg-cyan-500/10"
              >
                {action.label}
              </button>
            ))}
          </div>
        </section>
      ) : null}

      <section className="rounded-xl border border-slate-800 bg-slate-950/60 p-4">
        <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500">
          Scope
        </h4>
        <p className="mt-2 text-sm leading-6 text-slate-300">
          {panelData.scope}
        </p>
      </section>

      <section className="rounded-xl border border-slate-800 bg-slate-950/60 p-4">
        <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500">
          Clause Intelligence
        </h4>
        <ul className="mt-2 space-y-2">
          {clauses.slice(0, 5).map((clause) => (
            <li key={clause.id}>
              <button
                type="button"
                onClick={() =>
                  onAskAI?.(
                    `Explain clause ${clause.clauseNumber} of ${clause.standardCode}: ${clause.title}`
                  )
                }
                className="w-full rounded-lg border border-slate-800 bg-slate-900/50 px-3 py-2 text-left text-xs hover:border-cyan-500/40"
              >
                <span className="font-medium text-slate-200">
                  §{clause.clauseNumber} {clause.title}
                </span>
                <span className="mt-0.5 block line-clamp-2 text-slate-500">
                  {clause.summary}
                </span>
                {clause.isMandatory ? (
                  <span className="mt-1 inline-block text-[10px] uppercase text-amber-400">
                    Mandatory
                  </span>
                ) : null}
              </button>
            </li>
          ))}
        </ul>
      </section>

      <section className="rounded-xl border border-slate-800 bg-slate-950/60 p-4">
        <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500">
          Latest Revision
        </h4>
        <p className="mt-2 text-sm text-cyan-300">{panelData.latestRevision}</p>
        <p className="mt-1 text-xs text-slate-500">{getLatestRevisionNote(standard)}</p>
        <p className="mt-1 text-xs text-slate-500">{standard.publisher}</p>
      </section>

      <section className="rounded-xl border border-slate-800 bg-slate-950/60 p-4">
        <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500">
          Related Codes
        </h4>
        {panelData.relatedStandards.length > 0 ? (
          <ul className="mt-2 space-y-2">
            {panelData.relatedStandards.map((related) => (
              <li key={related.id}>
                <button
                  type="button"
                  onClick={() => onSelectRelated(related)}
                  className="w-full rounded-lg border border-slate-800 bg-slate-900/50 px-3 py-2 text-left text-xs hover:border-cyan-500/40"
                >
                  <span className="font-medium text-slate-200">
                    {related.codeNumber}
                  </span>
                  <span className="mt-0.5 block line-clamp-1 text-slate-500">
                    {related.title}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-2 text-sm text-slate-500">
            No related codes linked for this entry.
          </p>
        )}
      </section>

      <section className="rounded-xl border border-slate-800 bg-slate-950/60 p-4">
        <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500">
          Compliance Support
        </h4>
        <pre className="mt-2 whitespace-pre-wrap text-xs leading-5 text-slate-400">
          {complianceNotes}
        </pre>
      </section>

      <section className="rounded-xl border border-slate-800 bg-slate-950/60 p-4">
        <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500">
          Linked Workspace
        </h4>
        <ul className="mt-2 space-y-1">
          {relationships.slice(0, 6).map((link) => (
            <li key={link.id} className="text-xs text-slate-400">
              <span className="text-slate-500">[{link.type}]</span> {link.title}
            </li>
          ))}
        </ul>
      </section>

      <section className="rounded-xl border border-slate-800 bg-slate-950/60 p-4">
        <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500">
          Important Notes
        </h4>
        <ul className="mt-2 space-y-2">
          {panelData.importantNotes.map((note) => (
            <li key={note} className="text-sm text-slate-400">
              • {note}
            </li>
          ))}
        </ul>
      </section>

      <section className="rounded-xl border border-dashed border-slate-800 bg-slate-900/40 p-4">
        <h4 className="text-xs font-semibold text-slate-400">Future Ready</h4>
        <p className="mt-2 text-xs leading-5 text-slate-500">
          Architecture supports OCR, AI clause extraction, automatic revision
          tracking, and PMIS compliance integration. Metadata only — no
          copyrighted documents stored.
        </p>
        <div className="mt-2 flex flex-wrap gap-1">
          {standard.keywords.slice(0, 6).map((keyword) => (
            <span
              key={keyword}
              className="rounded-full border border-slate-700 px-2 py-0.5 text-[10px] text-slate-500"
            >
              {keyword}
            </span>
          ))}
        </div>
      </section>
    </div>
  );
};

export default StandardsKnowledgePanel;
