import React from "react";
import type { EngineeringCalculatorMetadata } from "../../config/calculators";

interface CalculatorMetadataCardProps {
  calculator: EngineeringCalculatorMetadata;
  isFavourite?: boolean;
  onOpen: (calculator: EngineeringCalculatorMetadata) => void;
  onToggleFavourite?: (calculatorId: string) => void;
  onShare?: (calculator: EngineeringCalculatorMetadata) => void;
}

const statusLabels: Record<
  EngineeringCalculatorMetadata["status"],
  string
> = {
  available: "Available",
  beta: "Beta",
  "coming-soon": "Coming Soon",
};

const CalculatorMetadataCard: React.FC<CalculatorMetadataCardProps> = ({
  calculator,
  isFavourite = false,
  onOpen,
  onToggleFavourite,
  onShare,
}) => (
  <article className="flex h-full min-h-[11rem] flex-col rounded-xl border border-slate-800 bg-slate-950/60 p-4 transition hover:border-cyan-500/40 hover:bg-slate-900">
    <div className="flex items-start justify-between gap-3">
      <button
        type="button"
        onClick={() => onOpen(calculator)}
        className="min-w-0 flex-1 text-left"
      >
        <p className="workspace-card-title text-base font-semibold text-white">
          {calculator.name}
        </p>
        <p className="mt-1 text-xs text-cyan-400/90">{calculator.disciplineName}</p>
      </button>
      {onToggleFavourite ? (
        <button
          type="button"
          onClick={() => onToggleFavourite(calculator.id)}
          aria-label={
            isFavourite ? "Remove from favourites" : "Add to favourites"
          }
          className="shrink-0 rounded-lg border border-slate-700 px-2 py-1 text-xs text-slate-300 hover:bg-slate-900"
        >
          {isFavourite ? "★" : "☆"}
        </button>
      ) : null}
    </div>

    <button
      type="button"
      onClick={() => onOpen(calculator)}
      className="mt-3 flex flex-1 flex-col text-left"
    >
      <p className="line-clamp-3 text-sm text-slate-400">
        {calculator.description}
      </p>
      <div className="mt-3 flex flex-wrap gap-2">
        <span className="rounded-full border border-slate-700 px-2 py-0.5 text-[10px] uppercase tracking-wide text-slate-400">
          {calculator.category}
        </span>
        <span className="rounded-full border border-cyan-500/30 bg-cyan-500/10 px-2 py-0.5 text-[10px] text-cyan-300">
          {statusLabels[calculator.status]}
        </span>
      </div>
    </button>

    <div className="mt-3 flex flex-wrap gap-2">
      <button
        type="button"
        onClick={() => onOpen(calculator)}
        className="rounded-lg border border-cyan-500/40 bg-cyan-500/10 px-3 py-1.5 text-xs font-medium text-cyan-300 hover:bg-cyan-500/20"
      >
        Open Calculator
      </button>
      {onShare ? (
        <button
          type="button"
          onClick={() => onShare(calculator)}
          className="rounded-lg border border-slate-700 px-3 py-1.5 text-xs text-slate-300 hover:bg-slate-900"
        >
          Share
        </button>
      ) : null}
    </div>
  </article>
);

export default CalculatorMetadataCard;
