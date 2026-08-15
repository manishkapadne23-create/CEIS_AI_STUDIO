import { DISCIPLINE_DEFINITIONS } from "../disciplineManifest";
import { createPlaceholderKnowledgeModule } from "./createPlaceholderKnowledgeModule";
import { civilKnowledgeModule } from "./civil";

export { civilKnowledgeModule } from "./civil";

const placeholderModules = DISCIPLINE_DEFINITIONS.filter(
  (discipline) => discipline.id !== civilKnowledgeModule.disciplineId
).map((discipline) =>
  createPlaceholderKnowledgeModule(discipline)
);

export const disciplineKnowledgeModules = [
  civilKnowledgeModule,
  ...placeholderModules,
];
