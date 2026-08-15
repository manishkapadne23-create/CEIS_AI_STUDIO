import React from "react";

export interface SpecializationCardItem {
  id: string;
  title: string;
  subtitle?: string;
}

interface SpecializationCardGridProps {
  items: SpecializationCardItem[];
  selectedId?: string | null;
  onSelect: (id: string) => void;
  emptyMessage?: string;
}

const SpecializationCardGrid: React.FC<SpecializationCardGridProps> = ({
  items,
  selectedId = null,
  onSelect,
  emptyMessage = "No specializations available for this discipline.",
}) => {
  if (items.length === 0) {
    return (
      <p className="rounded-xl border border-dashed border-slate-800 px-4 py-6 text-center text-sm text-slate-500">
        {emptyMessage}
      </p>
    );
  }

  return (
    <div className="space-y-2">
      {items.map((item) => {
        const isActive = selectedId === item.id;
        return (
          <button
            key={item.id}
            type="button"
            onClick={() => onSelect(item.id)}
            className={`flex w-full items-center rounded-xl border px-3 py-3 text-left transition ${
              isActive
                ? "border-cyan-500 bg-cyan-500/10 text-cyan-200"
                : "border-slate-800 bg-slate-900/50 text-slate-300 hover:border-slate-700 hover:bg-slate-900"
            }`}
          >
            <span className="block text-sm font-medium">{item.title}</span>
          </button>
        );
      })}
    </div>
  );
};

export default SpecializationCardGrid;
