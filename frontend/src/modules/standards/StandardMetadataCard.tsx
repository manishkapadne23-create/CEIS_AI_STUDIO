import React from "react";
import type { EngineeringStandardMetadata } from "../../config/standards";

interface StandardMetadataCardProps {
  standard: EngineeringStandardMetadata;
  isFavourite?: boolean;
  onOpen: (standard: EngineeringStandardMetadata) => void;
  onToggleFavourite?: (standardId: string) => void;
}

const statusLabels: Record<EngineeringStandardMetadata["status"], string> = {
  active: "Active",
  "latest-revision": "Latest Revision",
  "new-standard": "New Standard",
  withdrawn: "Withdrawn",
  superseded: "Superseded",
};

const StandardMetadataCard: React.FC<StandardMetadataCardProps> = ({
  standard,
  isFavourite = false,
  onOpen,
  onToggleFavourite,
}) => (
  <article className="flex h-full min-h-[11rem] flex-col rounded-xl border border-slate-800 bg-slate-950/60 p-4 transition hover:border-cyan-500/40 hover:bg-slate-900">
    <div className="flex items-start justify-between gap-3">
      <button
        type="button"
        onClick={() => onOpen(standard)}
        className="min-w-0 flex-1 text-left"
      >
        <p className="workspace-card-title text-base font-semibold text-white">
          {standard.codeNumber}
        </p>
        <p className="mt-0.5 line-clamp-1 text-xs text-slate-400">
          {standard.title}
        </p>
        <p className="mt-1 text-xs text-cyan-400/90">{standard.publisher}</p>
      </button>
      {onToggleFavourite ? (
        <button
          type="button"
          onClick={() => onToggleFavourite(standard.id)}
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
      onClick={() => onOpen(standard)}
      className="mt-3 flex flex-1 flex-col text-left"
    >
      <p className="line-clamp-3 text-sm text-slate-400">
        {standard.shortDescription}
      </p>
      <div className="mt-3 flex flex-wrap gap-2">
        <span className="rounded-full border border-slate-700 px-2 py-0.5 text-[10px] uppercase tracking-wide text-slate-400">
          {standard.category}
        </span>
        <span className="rounded-full border border-slate-700 px-2 py-0.5 text-[10px] text-slate-500">
          {standard.edition}
        </span>
        <span className="rounded-full border border-cyan-500/30 bg-cyan-500/10 px-2 py-0.5 text-[10px] text-cyan-300">
          {statusLabels[standard.status]}
        </span>
      </div>
    </button>

    <a
      href={standard.externalLink}
      target="_blank"
      rel="noreferrer noopener"
      className="mt-3 text-xs font-medium text-cyan-400 hover:text-cyan-300"
      onClick={(event) => event.stopPropagation()}
    >
      Official reference →
    </a>
  </article>
);

export default StandardMetadataCard;
