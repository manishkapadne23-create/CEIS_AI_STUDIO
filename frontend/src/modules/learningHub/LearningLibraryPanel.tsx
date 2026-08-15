import React, { useMemo } from "react";
import { useSarathiWorkspace } from "../../sarathi/context/SarathiWorkspaceContext";
import CollapsibleModuleSection from "../components/CollapsibleModuleSection";
import ModuleSearchBar from "../components/ModuleSearchBar";
import ModuleSection from "../components/ModuleSection";
import type { ModuleWorkspaceProps } from "../types";
import {
  createPlaceholderItems,
  filterModuleItems,
} from "../utils/filterModuleItems";

const LEARNING_SECTIONS = [
  { id: "courses", labels: ["Foundations", "Advanced Practice"] },
  { id: "tutorials", labels: ["Getting Started", "Workflow Tutorial"] },
  { id: "videos", labels: ["Intro Video", "Case Study"] },
  { id: "practice", labels: ["Practice Set", "Quiz Bank"] },
  { id: "books", labels: ["Reference Book", "Study Guide"] },
  { id: "resources", labels: ["Articles", "Webinars"] },
] as const;

const LearningLibraryPanel: React.FC<ModuleWorkspaceProps> = ({
  disciplineConfig,
}) => {
  const { moduleSearchQuery } = useSarathiWorkspace();

  const allItems = useMemo(
    () =>
      LEARNING_SECTIONS.flatMap((section) =>
        createPlaceholderItems(
          `${disciplineConfig.id}-${section.id}`,
          [...section.labels]
        )
      ),
    [disciplineConfig.id]
  );

  const filtered = filterModuleItems(allItems, moduleSearchQuery);

  return (
    <div className="shrink-0">
      <CollapsibleModuleSection title="Learning Resources">
      <div className="space-y-3">
        <ModuleSearchBar placeholder="Search learning resources..." />
        <ModuleSection
          title=""
          items={filtered}
          emptyMessage="No learning resources match your search."
        />
      </div>
    </CollapsibleModuleSection>
    </div>
  );
};

export default LearningLibraryPanel;
