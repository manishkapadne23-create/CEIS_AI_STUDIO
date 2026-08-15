import React from "react";
import type { EngineeringStandardMetadata } from "../../config/standards";

interface StandardMetadataViewerProps {
  standard: EngineeringStandardMetadata;
  isFavourite: boolean;
  onClose: () => void;
  onToggleFavourite: () => void;
}

const StandardMetadataViewer: React.FC<StandardMetadataViewerProps> = ({
  standard,
  isFavourite,
  onClose,
  onToggleFavourite,
}) => (
  <div
    className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
    role="dialog"
    aria-modal="true"
    aria-labelledby="standard-metadata-viewer-title"
  >
    <div className="max-h-[85vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-slate-700 bg-slate-950 shadow-2xl">
      <div className="sticky top-0 flex items-start justify-between gap-4 border-b border-slate-800 bg-slate-950/95 px-6 py-4 backdrop-blur">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-cyan-400">
            Standards Intelligence
          </p>
          <h2
            id="standard-metadata-viewer-title"
            className="mt-1 text-2xl font-bold text-white"
          >
            {standard.codeNumber}
          </h2>
          <p className="mt-1 text-sm text-slate-400">{standard.title}</p>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={onToggleFavourite}
            className="rounded-lg border border-slate-700 px-3 py-1.5 text-sm text-slate-300 hover:bg-slate-900"
          >
            {isFavourite ? "Favourited" : "Favourite"}
          </button>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-slate-700 px-3 py-1.5 text-sm text-slate-300 hover:bg-slate-900"
          >
            Close
          </button>
        </div>
      </div>

      <div className="space-y-5 px-6 py-5">
        <div className="flex flex-wrap gap-2">
          <span className="rounded-full border border-cyan-500/30 bg-cyan-500/10 px-3 py-1 text-xs text-cyan-300">
            {standard.category}
          </span>
          <span className="rounded-full border border-slate-700 bg-slate-900 px-3 py-1 text-xs text-slate-400">
            {standard.status}
          </span>
          <span className="rounded-full border border-slate-700 bg-slate-900 px-3 py-1 text-xs text-slate-400">
            {standard.edition}
          </span>
        </div>

        <section>
          <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
            Description
          </h3>
          <p className="mt-2 text-sm leading-6 text-slate-300">
            {standard.shortDescription}
          </p>
        </section>

        <section className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
          <h3 className="text-sm font-semibold text-white">Metadata only</h3>
          <p className="mt-2 text-sm text-slate-400">
            Sarathi AI stores standard metadata, revision information, and
            official reference links only. No copyrighted publications or PDFs
            are stored locally.
          </p>
          <a
            href={standard.externalLink}
            target="_blank"
            rel="noreferrer noopener"
            className="mt-4 inline-flex rounded-lg border border-cyan-500/40 bg-cyan-500/10 px-4 py-2 text-sm font-medium text-cyan-300 hover:bg-cyan-500/20"
          >
            Open official reference
          </a>
        </section>
      </div>
    </div>
  </div>
);

export default StandardMetadataViewer;
