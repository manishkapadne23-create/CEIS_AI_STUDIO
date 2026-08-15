import React, { useMemo, useState } from "react";
import WorkspaceListItemCard from "../../workspace/components/WorkspaceListItemCard";
import ModuleSearchHeader from "./ModuleSearchHeader";
import { ENGINEERING_TEMPLATES } from "./templatesData";

const TemplatesModule: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    if (!query) {
      return ENGINEERING_TEMPLATES;
    }

    return ENGINEERING_TEMPLATES.filter((template) => {
      const haystack = [
        template.title,
        template.description,
        template.category,
      ]
        .join(" ")
        .toLowerCase();

      return haystack.includes(query);
    });
  }, [searchQuery]);

  const selected = ENGINEERING_TEMPLATES.find(
    (template) => template.id === selectedId
  );

  if (selected) {
    return (
      <div className="space-y-3">
        <ModuleSearchHeader
          searchQuery=""
          onSearchChange={() => undefined}
          searchPlaceholder=""
          onBack={() => setSelectedId(null)}
          detailTitle={selected.title}
        />
        <div className="rounded-lg border border-slate-800 bg-slate-900/70 p-3 text-xs text-slate-400">
          <p>
            <span className="text-slate-500">Category:</span> {selected.category}
          </p>
          <p className="mt-2">{selected.description}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <ModuleSearchHeader
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        searchPlaceholder="Search documents..."
      />
      <ul className="space-y-2">
        {filtered.map((template) => (
          <li key={template.id}>
            <WorkspaceListItemCard
              title={template.title}
              description={template.description}
              status={template.status}
              badge={template.category}
              onClick={() => setSelectedId(template.id)}
            />
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TemplatesModule;
