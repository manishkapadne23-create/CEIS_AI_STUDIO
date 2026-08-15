import React from "react";
import type { KnowledgeFrameworkCategoryFolder } from "../types";

interface KnowledgeCategoryFolderListProps {
  categories: KnowledgeFrameworkCategoryFolder[];
  selectedCategoryId?: string | null;
  onSelectCategory?: (categoryId: string) => void;
}

const KnowledgeCategoryFolderList: React.FC<KnowledgeCategoryFolderListProps> = ({
  categories,
  selectedCategoryId,
  onSelectCategory,
}) => {
  return (
    <ul className="flex flex-col gap-2">
      {categories.map((category) => {
        const isSelected = selectedCategoryId === category.id;

        return (
          <li key={category.id}>
            <button
              type="button"
              onClick={() => onSelectCategory?.(category.id)}
              className={[
                "flex w-full items-start gap-3 rounded-xl border px-4 py-3 text-left transition-colors",
                isSelected
                  ? "border-cyan-500/50 bg-cyan-500/10"
                  : "border-slate-800 bg-slate-950/70 hover:border-slate-700 hover:bg-slate-900/80",
              ].join(" ")}
            >
              <span className="text-lg leading-none" aria-hidden>
                {category.icon}
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-sm font-medium text-slate-100">
                  {category.label}
                </span>
                <span className="mt-0.5 block text-xs text-slate-400">
                  {category.description}
                </span>
                <span className="mt-1 block font-mono text-[10px] text-slate-600">
                  {category.path}
                </span>
              </span>
              <span className="shrink-0 rounded-full border border-slate-700 px-2 py-0.5 text-[10px] text-slate-500">
                {category.documentCount} docs
              </span>
            </button>
          </li>
        );
      })}
    </ul>
  );
};

export default KnowledgeCategoryFolderList;
