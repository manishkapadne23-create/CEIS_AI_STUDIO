import { DISCIPLINE_DEFINITIONS } from "../knowledge/data/disciplineManifest";
import { getKnowledgeRepository } from "../knowledge-network/knowledgeRepository";
import type { KnowledgeEntry } from "../knowledge-network/types";
import { getAllStandardClauses } from "../standards-intelligence/clauseCatalog";
import { listAllAgents } from "../agents/agentRegistry";
import { TEMPLATE_LIBRARY } from "../templates/templateLibrary";
import type { GraphEntity, GraphEntityType } from "./types";

let cachedEntities: GraphEntity[] | null = null;

const mapKnowledgeCategoryToType = (
  entry: KnowledgeEntry
): GraphEntityType => {
  switch (entry.category) {
    case "engineering-standards":
      return "standard";
    case "engineering-formulae":
      return entry.moduleId === "calculators" ? "calculator" : "formula";
    case "engineering-workflows":
      return "workflow";
    case "engineering-templates":
      return "template";
    case "engineering-checklists":
      return "report";
    case "engineering-materials":
      return "material";
    case "engineering-equipment":
      return "equipment";
    default:
      if (entry.moduleId === "documents") return "document";
      if (entry.moduleId === "learning-hub") return "learning-resource";
      if (entry.moduleId === "professional-tools") return "professional-tool";
      if (entry.id.startsWith("discipline-")) return "discipline";
      return "topic";
  }
};

const entryToEntity = (entry: KnowledgeEntry): GraphEntity => ({
  id: entry.id,
  type: mapKnowledgeCategoryToType(entry),
  label: entry.title,
  description: entry.description,
  disciplineId: entry.disciplineId,
  disciplineName: entry.disciplineName,
  moduleId: entry.moduleId,
  resourceId: entry.resourceId,
  keywords: entry.keywords,
  route: entry.moduleId
    ? `/chat/${entry.disciplineId.replace(/-engineering$/, "")}/${entry.moduleId}`
    : undefined,
});

export const buildEntityRegistry = (): GraphEntity[] => {
  const entities: GraphEntity[] = [];

  for (const entry of getKnowledgeRepository()) {
    entities.push(entryToEntity(entry));
  }

  for (const clause of getAllStandardClauses()) {
    entities.push({
      id: `clause-${clause.id}`,
      type: "clause",
      label: `${clause.standardCode} §${clause.clauseNumber}`,
      description: clause.summary,
      disciplineId: null,
      disciplineName: null,
      moduleId: "standards",
      resourceId: clause.id,
      keywords: [clause.standardCode, clause.clauseNumber, clause.title, ...clause.keywords],
    });
  }

  for (const template of TEMPLATE_LIBRARY) {
    entities.push({
      id: `template-lib-${template.id}`,
      type: "template",
      label: template.title,
      description: template.description,
      disciplineId: template.disciplineId ?? null,
      disciplineName: template.disciplineName ?? null,
      moduleId: "professional-tools",
      resourceId: template.id,
      keywords: [template.title, template.category, template.description],
      route: `/chat/${template.disciplineId.replace(/-engineering$/, "")}/professional-tools`,
    });
  }

  for (const agent of listAllAgents()) {
    entities.push({
      id: `agent-${agent.id}`,
      type: "ai-agent",
      label: agent.name,
      description: agent.description,
      disciplineId: agent.disciplineId ?? null,
      disciplineName: agent.disciplineName ?? null,
      moduleId: "ai-expert",
      resourceId: agent.id,
      keywords: [agent.name, agent.description, ...agent.capabilities],
    });
  }

  for (const discipline of DISCIPLINE_DEFINITIONS) {
    if (!entities.some((entity) => entity.id === `discipline-${discipline.id}`)) {
      entities.push({
        id: `discipline-${discipline.id}`,
        type: "discipline",
        label: discipline.name,
        description: `${discipline.name} engineering discipline`,
        disciplineId: discipline.id,
        disciplineName: discipline.name,
        moduleId: "ai-expert",
        keywords: [discipline.name, discipline.id],
        route: `/chat/${discipline.id.replace(/-engineering$/, "")}`,
      });
    }
  }

  return entities;
};

export const getEntityRegistry = (): GraphEntity[] => {
  if (!cachedEntities) {
    cachedEntities = buildEntityRegistry();
  }
  return cachedEntities;
};

export const getEntityById = (entityId: string): GraphEntity | null =>
  getEntityRegistry().find((entity) => entity.id === entityId) ?? null;

export const getEntitiesByType = (type: GraphEntityType): GraphEntity[] =>
  getEntityRegistry().filter((entity) => entity.type === type);

export const getEntitiesByDiscipline = (disciplineId: string): GraphEntity[] =>
  getEntityRegistry().filter((entity) => entity.disciplineId === disciplineId);

export const invalidateEntityRegistry = (): void => {
  cachedEntities = null;
};
