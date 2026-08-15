import { getAllStandardsAcrossDisciplines } from "../config/standards";
import type { EngineeringStandardMetadata } from "../config/standards/types";
import type { StandardRelationshipLink } from "./types";

const MODULE_ROUTE = (disciplineSlug: string, moduleId: string): string =>
  `/chat/${disciplineSlug}/${moduleId}`;

export const buildStandardRelationships = (
  standard: EngineeringStandardMetadata
): StandardRelationshipLink[] => {
  const links: StandardRelationshipLink[] = [];
  const disciplineSlug = standard.disciplineId;

  links.push({
    type: "ai-expert",
    id: `expert-${standard.id}`,
    title: `Ask AI Expert about ${standard.codeNumber}`,
    route: MODULE_ROUTE(disciplineSlug, "chat"),
  });

  links.push({
    type: "topic",
    id: `topic-${standard.category}`,
    title: standard.category,
    route: `/chat/${disciplineSlug}/standards`,
  });

  if (/concrete|steel|structural|design/i.test(standard.category + standard.keywords.join(" "))) {
    links.push({
      type: "calculator",
      id: "structural-calculators",
      title: "Structural calculators",
      route: `/chat/${disciplineSlug}/calculators`,
    });
  }

  if (/road|pavement|highway|bridge/i.test(standard.scope + standard.keywords.join(" "))) {
    links.push({
      type: "workflow",
      id: "highway-design",
      title: "Highway design workflow",
      route: `/chat/${disciplineSlug}/workflows`,
    });
  }

  links.push({
    type: "template",
    id: `template-${standard.id}`,
    title: `${standard.codeNumber} compliance checklist`,
    route: `/chat/${disciplineSlug}/templates`,
  });

  links.push({
    type: "document",
    id: `doc-${standard.id}`,
    title: `Reference: ${standard.title}`,
    route: `/documents`,
  });

  links.push({
    type: "report",
    id: `report-${standard.id}`,
    title: `${standard.codeNumber} summary report`,
    route: `/standards-intelligence`,
  });

  for (const relatedId of standard.relatedStandardIds ?? []) {
    const related = getAllStandardsAcrossDisciplines().find((entry) => entry.id === relatedId);
    if (related) {
      links.push({
        type: "standard",
        id: related.id,
        title: related.codeNumber,
        route: `/chat/${related.disciplineId}/standards`,
      });
    }
  }

  return links;
};

export const buildComplianceRelationships = (
  standards: EngineeringStandardMetadata[]
): StandardRelationshipLink[] =>
  standards.flatMap((standard) => buildStandardRelationships(standard)).slice(0, 12);
