import React from "react";
import type { EngineeringCalculatorMetadata } from "../../config/calculators";

interface CalculatorMetadataViewerProps {
  calculator: EngineeringCalculatorMetadata;
  isFavourite: boolean;
  onClose: () => void;
  onToggleFavourite: () => void;
  onShare: () => void;
}

const statusLabels: Record<
  EngineeringCalculatorMetadata["status"],
  string
> = {
  available: "Available",
  beta: "Beta",
  "coming-soon": "Coming Soon",
};

const CalculatorMetadataViewer: React.FC<CalculatorMetadataViewerProps> = ({
  calculator,
  isFavourite,
  onClose,
  onToggleFavourite,
  onShare,
}) => (
  <div
    className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
    role="dialog"
    aria-modal="true"
    aria-labelledby="calculator-metadata-viewer-title"
  >
    <div className="max-h-[85vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-slate-700 bg-slate-950 shadow-2xl">
      <div className="sticky top-0 flex items-start justify-between gap-4 border-b border-slate-800 bg-slate-950/95 px-6 py-4 backdrop-blur">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-cyan-400">
            Engineering Calculator
          </p>
          <h2
            id="calculator-metadata-viewer-title"
            className="mt-1 text-2xl font-bold text-white"
          >
            {calculator.name}
          </h2>
          <p className="mt-1 text-sm text-slate-400">
            {calculator.disciplineName}
          </p>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={onShare}
            className="rounded-lg border border-slate-700 px-3 py-1.5 text-sm text-slate-300 hover:bg-slate-900"
          >
            Share
          </button>
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
            {calculator.category}
          </span>
          <span className="rounded-full border border-slate-700 bg-slate-900 px-3 py-1 text-xs text-slate-400">
            {statusLabels[calculator.status]}
          </span>
        </div>

        <section>
          <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
            Description
          </h3>
          <p className="mt-2 text-sm leading-6 text-slate-300">
            {calculator.description}
          </p>
        </section>

        <section className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
          <h3 className="text-sm font-semibold text-white">
            Calculator engine coming soon
          </h3>
          <p className="mt-2 text-sm text-slate-400">
            Sarathi AI stores calculator metadata and discipline mappings only.
            The computational engine for this calculator will be added in a
            future release.
          </p>
        </section>
      </div>
    </div>
  </div>
);

export default CalculatorMetadataViewer;
