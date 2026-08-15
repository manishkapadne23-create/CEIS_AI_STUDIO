import React, { useMemo, useState } from "react";
import type { WorkspaceDashboardSection } from "../types/EngineeringWorkspaceDashboard";
import WorkspaceListItemCard from "./WorkspaceListItemCard";

interface WorkspaceSectionDetailProps {
  section: WorkspaceDashboardSection;
  icon: string;
  onBack: () => void;
}

const WorkspaceSectionDetail: React.FC<WorkspaceSectionDetailProps> = ({
  section,
  icon,
  onBack,
}) => {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredItems = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    if (!query) {
      return section.items;
    }

    return section.items.filter((item) => {
      const haystack = [item.title, item.description, item.badge]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return haystack.includes(query);
    });
  }, [section.items, searchQuery]);

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex min-w-0 items-start gap-3">
          <button
            type="button"
            onClick={onBack}
            className="shrink-0 rounded-lg border border-slate-700 px-2.5 py-1 text-xs text-slate-300 hover:bg-slate-900"
          >
            ← Back
          </button>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-xl" aria-hidden="true">
                {icon}
              </span>
              <h3 className="line-clamp-2 text-lg font-semibold text-white">
                {section.title}
              </h3>
            </div>
            <p className="mt-1 line-clamp-2 text-sm text-slate-400">
              {section.description}
            </p>
          </div>
        </div>
        <input
          type="search"
          value={searchQuery}
          onChange={(event) => setSearchQuery(event.target.value)}
          placeholder={`Search ${section.title.toLowerCase()}...`}
          className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white placeholder:text-slate-500 focus:border-cyan-500 focus:outline-none sm:max-w-xs"
          aria-label={`Search ${section.title}`}
        />
      </div>

      <ul className="workspace-card-grid">
        {filteredItems.length > 0 ? (
          filteredItems.map((item) => (
            <li key={item.id} className="h-full min-w-0">
              <WorkspaceListItemCard
                title={item.title}
                description={item.description}
                status={item.status}
                badge={item.badge}
                icon={item.icon}
              />
            </li>
          ))
        ) : (
          <li className="col-span-full rounded-xl border border-dashed border-slate-700 px-4 py-8 text-center text-sm text-slate-500">
            {section.items.length === 0
              ? "No items available for this category yet."
              : "No items match your search."}
          </li>
        )}
      </ul>
    </div>
  );
};

export default WorkspaceSectionDetail;
