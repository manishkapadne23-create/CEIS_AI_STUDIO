import { searchKnowledgeNetwork } from "../knowledge-network";
import { searchWorkflows } from "../workflows";
import type { DocumentLink, EngineeringDocumentRecord } from "./types";

export const linkDocumentToResources = (
  document: EngineeringDocumentRecord
): DocumentLink[] => {
  const links: DocumentLink[] = [];
  const query = [
    document.name,
    document.contentPreview ?? "",
    ...document.keywords,
    ...document.standardsReferenced,
  ].join(" ");

  for (const standard of document.standardsReferenced) {
    links.push({
      documentId: document.id,
      relatedId: `std-${standard}`,
      relatedType: "standard",
      label: standard,
    });
  }

  const knowledgeResults = searchKnowledgeNetwork({
    query,
    disciplineId: document.disciplineId,
    limit: 8,
  });

  for (const result of knowledgeResults) {
    const typeMap: Record<string, DocumentLink["relatedType"]> = {
      "engineering-standards": "standard",
      "engineering-formulae": "calculator",
      "engineering-workflows": "workflow",
      "engineering-templates": "template",
      "engineering-checklists": "report",
      "engineering-concepts": "topic",
    };

    links.push({
      documentId: document.id,
      relatedId: result.entry.id,
      relatedType: typeMap[result.entry.category] ?? "topic",
      label: result.entry.title,
    });
  }

  const workflows = searchWorkflows(query, document.disciplineId ?? undefined);
  for (const workflow of workflows.slice(0, 3)) {
    links.push({
      documentId: document.id,
      relatedId: workflow.id,
      relatedType: "workflow",
      label: workflow.title,
    });
  }

  const seen = new Set<string>();
  return links.filter((link) => {
    const key = `${link.relatedType}:${link.relatedId}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
};

export const formatDocumentLinksForPrompt = (
  links: DocumentLink[]
): string => {
  if (links.length === 0) return "No linked resources.";

  const grouped = links.reduce<Record<string, DocumentLink[]>>((acc, link) => {
    if (!acc[link.relatedType]) acc[link.relatedType] = [];
    acc[link.relatedType].push(link);
    return acc;
  }, {});

  return Object.entries(grouped)
    .map(([type, items]) => {
      const lines = items
        .slice(0, 4)
        .map((item) => `  - ${item.label}`);
      return `${type}:\n${lines.join("\n")}`;
    })
    .join("\n\n");
};
