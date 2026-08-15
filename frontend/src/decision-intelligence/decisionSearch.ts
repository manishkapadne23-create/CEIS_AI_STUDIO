import { getStandardsCatalogByDisciplineId } from "../config/standards";
import { KNOWN_COMPARISON_TEMPLATES } from "../decision-support/comparisonEngine";
import { getDecisionCriteriaForDiscipline, DECISION_DISCIPLINES } from "./disciplineRegistry";
import type { DecisionSearchResult } from "./types";

export const searchDecisionIntelligence = (
  query: string,
  disciplineId: string | null,
  limit = 12
): DecisionSearchResult[] => {
  const normalized = query.trim().toLowerCase();
  if (!normalized) {
    return [];
  }

  const results: DecisionSearchResult[] = [];

  for (const template of KNOWN_COMPARISON_TEMPLATES) {
    if (
      template.title.toLowerCase().includes(normalized) ||
      template.alternatives.some((alt) => alt.toLowerCase().includes(normalized))
    ) {
      results.push({
        id: `alt-template-${template.id}`,
        type: "alternative",
        title: template.title,
        subtitle: template.alternatives.join(" vs "),
      });
    }
  }

  if (disciplineId) {
    const catalog = getStandardsCatalogByDisciplineId(disciplineId);
    for (const standard of catalog?.standards ?? []) {
      const haystack = `${standard.codeNumber} ${standard.title}`.toLowerCase();
      if (haystack.includes(normalized)) {
        results.push({
          id: `standard-${standard.id}`,
          type: "standard",
          title: standard.codeNumber,
          subtitle: standard.title,
          disciplineId,
        });
      }
    }
  }

  for (const criterion of getDecisionCriteriaForDiscipline(disciplineId)) {
    if (criterion.toLowerCase().includes(normalized)) {
      results.push({
        id: `criterion-${criterion}`,
        type: "criterion",
        title: criterion,
        subtitle: "Decision criterion",
        disciplineId,
      });
    }
  }

  const materialKeywords = ["concrete", "steel", "timber", "composite", "pvc", "hdpe"];
  for (const material of materialKeywords) {
    if (material.includes(normalized) || normalized.includes(material)) {
      results.push({
        id: `material-${material}`,
        type: "material",
        title: material.charAt(0).toUpperCase() + material.slice(1),
        subtitle: "Engineering material",
        disciplineId,
      });
    }
  }

  const techKeywords = ["solar", "wind", "bim", "precast", "automation", "robotics"];
  for (const tech of techKeywords) {
    if (tech.includes(normalized) || normalized.includes(tech)) {
      results.push({
        id: `tech-${tech}`,
        type: "technology",
        title: tech.charAt(0).toUpperCase() + tech.slice(1),
        subtitle: "Engineering technology",
        disciplineId,
      });
    }
  }

  for (const discipline of DECISION_DISCIPLINES) {
    if (discipline.name.toLowerCase().includes(normalized)) {
      results.push({
        id: `discipline-${discipline.id}`,
        type: "criterion",
        title: discipline.name,
        subtitle: "Supported discipline",
        disciplineId: discipline.id,
      });
    }
  }

  const deduped = new Map<string, DecisionSearchResult>();
  for (const result of results) {
    deduped.set(result.id, result);
  }

  return [...deduped.values()].slice(0, limit);
};
