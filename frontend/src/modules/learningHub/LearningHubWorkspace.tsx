import React, { useMemo } from "react";
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

const LEARNING_SECTIONS = [
  { id: "courses", title: "Courses", labels: ["Foundations", "Advanced Practice"] },
  { id: "tutorials", title: "Tutorials", labels: ["Getting Started", "Workflow Tutorial"] },
  { id: "videos", title: "Videos", labels: ["Intro Video", "Case Study"] },
  { id: "articles", title: "Articles", labels: ["Best Practices", "Industry Insights"] },
  { id: "webinars", title: "Webinars", labels: ["Live Session", "Recorded Webinar"] },
  { id: "books", title: "Books", labels: ["Reference Book", "Study Guide"] },
] as const;

const LearningHubWorkspace: React.FC<ModuleWorkspaceProps> = ({
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
    <ModuleWorkspaceShell>
      <ModuleWorkspaceHeader
        disciplineConfig={disciplineConfig}
        moduleTitle={disciplineConfig.modules.learningHub.title}
        moduleDescription={disciplineConfig.modules.learningHub.description}
        icon="📚"
      />

      <div className="mb-6">
        <ModuleSearchBar placeholder="Search learning resources..." />
      </div>

      <div className="space-y-8">
        {LEARNING_SECTIONS.map((section) => {
          const sectionItems = filtered.filter((item) =>
            item.id.startsWith(`${disciplineConfig.id}-${section.id}-`)
          );

          return (
            <ModuleSection
              key={section.id}
              title={section.title}
              items={sectionItems}
              emptyMessage={`${section.title} will be available in a future release.`}
            />
          );
        })}
      </div>
    </ModuleWorkspaceShell>
  );
};

export default LearningHubWorkspace;
