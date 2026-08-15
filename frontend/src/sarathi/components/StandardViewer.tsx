import React from "react";
import type { ResolvedEngineeringStandard } from "../../knowledge/types/EngineeringStandard";

interface StandardViewerProps {
  standard: ResolvedEngineeringStandard;
  onClose: () => void;
}

const StandardViewer: React.FC<StandardViewerProps> = ({
  standard,
  onClose,
}) => {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="standard-viewer-title"
    >
      <div className="max-h-[85vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-slate-700 bg-slate-950 shadow-2xl">
        <div className="sticky top-0 flex items-start justify-between gap-4 border-b border-slate-800 bg-slate-950/95 px-6 py-4 backdrop-blur">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-cyan-400">
              Standards Viewer
            </p>
            <h2
              id="standard-viewer-title"
              className="mt-1 text-2xl font-bold text-white"
            >
              {standard.code}
            </h2>
            <p className="mt-1 text-sm text-slate-400">{standard.title}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-slate-700 px-3 py-1.5 text-sm text-slate-300 hover:bg-slate-900"
          >
            Close
          </button>
        </div>

        <div className="space-y-5 px-6 py-5">
          <div className="flex flex-wrap gap-2">
            <span className="rounded-full border border-cyan-500/30 bg-cyan-500/10 px-3 py-1 text-xs text-cyan-300">
              {standard.familyLabel}
            </span>
            <span className="rounded-full border border-slate-700 bg-slate-900 px-3 py-1 text-xs text-slate-400">
              {standard.status}
            </span>
            {standard.fromKnowledgeRepository ? (
              <span className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs text-emerald-300">
                Knowledge Repository
              </span>
            ) : null}
          </div>

          <section>
            <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
              Description
            </h3>
            <p className="mt-2 text-sm leading-6 text-slate-300">
              {standard.description ??
                "Standard reference loaded from the Engineering Standards Registry."}
            </p>
          </section>

          <section className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
            <h3 className="text-sm font-semibold text-white">
              Engineering Reference
            </h3>
            <p className="mt-2 text-sm text-slate-400">
              Use this standard in design checks, compliance reviews, and AI
              engineering consultations. Sarathi AI references applicable
              codes automatically in chat responses.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default StandardViewer;
