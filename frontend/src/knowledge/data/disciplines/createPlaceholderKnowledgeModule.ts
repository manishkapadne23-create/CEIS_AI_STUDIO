import type { DisciplineDefinition } from "../disciplineManifest";
import type { KnowledgeModule } from "../../types";

export const createPlaceholderKnowledgeModule = (
  discipline: DisciplineDefinition
): KnowledgeModule => ({
  id: discipline.id,
  disciplineId: discipline.id,
  disciplineName: discipline.name,
  version: "0.0.0",
  rootNodes: [],
  metadata: {
    description: `${discipline.name} knowledge module coming soon.`,
    tags: [discipline.id],
  },
});
