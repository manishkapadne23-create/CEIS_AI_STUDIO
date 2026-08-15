import React, { useMemo } from "react";
import { ENGINEERING_TEMPLATES } from "../../sarathi/modules/templatesData";
import { useSarathiWorkspace } from "../../sarathi/context/SarathiWorkspaceContext";
import CollapsibleModuleSection from "../components/CollapsibleModuleSection";
import ModuleSearchBar from "../components/ModuleSearchBar";
import ModuleSection from "../components/ModuleSection";
import type { ModuleWorkspaceProps } from "../types";
import {
  createPlaceholderItems,
  filterModuleItems,
} from "../utils/filterModuleItems";

const DocumentsLibraryPanel: React.FC<ModuleWorkspaceProps> = ({
  disciplineConfig,
}) => {
  const { moduleSearchQuery } = useSarathiWorkspace();

  const templateItems = useMemo(
    () =>
      ENGINEERING_TEMPLATES.map((template) => ({
        id: template.id,
        title: template.title,
        description: template.description,
        badge: template.category,
      })),
    []
  );

  const referenceItems = useMemo(
    () =>
      createPlaceholderItems(`${disciplineConfig.id}-reference`, [
        "Design Manual",
        "Code Reference Guide",
        "Technical Handbook",
      ]),
    [disciplineConfig.id]
  );

  const uploadedItems = useMemo(
    () =>
      createPlaceholderItems(`${disciplineConfig.id}-uploaded`, [
        "Uploaded Drawings",
        "Uploaded Specifications",
      ]),
    [disciplineConfig.id]
  );

  const allItems = filterModuleItems(
    [...templateItems, ...referenceItems, ...uploadedItems],
    moduleSearchQuery
  );

  return (
    <div className="shrink-0">
      <CollapsibleModuleSection title="Document Library">
      <div className="space-y-3">
        <ModuleSearchBar placeholder="Search documents..." />
        <ModuleSection
          title=""
          items={allItems}
          emptyMessage="No documents match your search."
        />
      </div>
    </CollapsibleModuleSection>
    </div>
  );
};

export default DocumentsLibraryPanel;
