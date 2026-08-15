import React from "react";
import WorkspaceListItemCard from "../../workspace/components/WorkspaceListItemCard";
import type { ModuleWorkspaceItem } from "../types";

interface ModuleSectionProps {
  title: string;
  items: ModuleWorkspaceItem[];
  emptyMessage?: string;
  onItemClick?: (item: ModuleWorkspaceItem) => void;
}

const ModuleSection: React.FC<ModuleSectionProps> = ({
  title,
  items,
  emptyMessage = "No items available yet.",
  onItemClick,
}) => (
  <section className="space-y-3">
    {title ? (
      <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500">
        {title}
      </h3>
    ) : null}
    {items.length > 0 ? (
      <ul className="workspace-card-grid">
        {items.map((item) => (
          <li key={item.id} className="h-full min-w-0">
            <WorkspaceListItemCard
              title={item.title}
              description={item.description}
              badge={item.badge}
              icon={item.icon}
              status="available"
              onClick={onItemClick ? () => onItemClick(item) : undefined}
            />
          </li>
        ))}
      </ul>
    ) : (
      <p className="rounded-xl border border-dashed border-slate-800 px-4 py-6 text-center text-sm text-slate-500">
        {emptyMessage}
      </p>
    )}
  </section>
);

export default ModuleSection;
