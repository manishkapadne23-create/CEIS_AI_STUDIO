import React, { useMemo } from "react";
import { ENGINEERING_TEMPLATES } from "../../sarathi/modules/templatesData";
import { useSarathiWorkspace } from "../../sarathi/context/SarathiWorkspaceContext";
import ModuleSearchBar from "../components/ModuleSearchBar";
import ModuleSection from "../components/ModuleSection";
import ModuleWorkspaceHeader from "../components/ModuleWorkspaceHeader";
import ModuleWorkspaceShell from "../components/ModuleWorkspaceShell";
import type { ModuleWorkspaceProps } from "../types";
import {
  createPlaceholderItems,
  filterModuleItems,
} from "../utils/filterModuleItems";

const DocumentsWorkspace: React.FC<ModuleWorkspaceProps> = ({
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

  const filteredTemplates = filterModuleItems(templateItems, moduleSearchQuery);
  const filteredReferences = filterModuleItems(referenceItems, moduleSearchQuery);
  const filteredUploads = filterModuleItems(uploadedItems, moduleSearchQuery);

  return (
    <ModuleWorkspaceShell>
      <ModuleWorkspaceHeader
        disciplineConfig={disciplineConfig}
        moduleTitle={disciplineConfig.modules.documents.title}
        moduleDescription={disciplineConfig.modules.documents.description}
        icon="📁"
      />

      <div className="mb-6">
        <ModuleSearchBar placeholder="Search documents..." />
      </div>

      <div className="space-y-8">
        <ModuleSection
          title="Recent Documents"
          items={[]}
          emptyMessage="Recent documents will appear here."
        />
        <ModuleSection
          title="Templates"
          items={filteredTemplates}
          emptyMessage="No document templates match your search."
        />
        <ModuleSection
          title="Uploaded Files"
          items={filteredUploads}
          emptyMessage="Uploaded files will appear here."
        />
        <ModuleSection
          title="Reference Library"
          items={filteredReferences}
          emptyMessage="Reference library items will appear here."
        />
      </div>
    </ModuleWorkspaceShell>
  );
};

export default DocumentsWorkspace;
