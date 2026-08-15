import type {
  EngineeringTemplate,
  GeneratedDocument,
  RevisionEntry,
} from "./types";

const formatDate = (): string => new Date().toISOString().slice(0, 10);

export const buildRevisionHistory = (): RevisionEntry[] => [
  {
    revision: "Rev 0",
    date: formatDate(),
    author: "Sarathi AI",
    description: "Initial issue — AI-generated draft",
  },
];

export const buildTableOfContents = (sections: string[]): string[] =>
  sections.map((section, index) => `${index + 1}. ${section}`);

export const buildDocumentHeader = (
  title: string,
  disciplineName: string | null,
  projectName: string | null
): string =>
  [
    "═".repeat(60),
    title.toUpperCase(),
    "═".repeat(60),
    `Discipline: ${disciplineName ?? "Engineering"}`,
    projectName ? `Project: ${projectName}` : "",
    `Document No: SAR-${Date.now().toString(36).toUpperCase()}`,
    `Date: ${formatDate()}`,
    `Status: DRAFT — For Review`,
    "═".repeat(60),
  ]
    .filter(Boolean)
    .join("\n");

export const buildDocumentFooter = (): string =>
  [
    "",
    "─".repeat(60),
    "Prepared by: _____________________  Date: __________",
    "Checked by:  _____________________  Date: __________",
    "Approved by: _____________________  Date: __________",
    "",
    "[Digital Signature Placeholder]",
    "Company Branding — Sarathi AI Engineering Documentation Platform",
    "─".repeat(60),
  ].join("\n");

export const buildReferencesSection = (standards: string[]): string => {
  if (standards.length === 0) {
    return [
      "## References",
      "",
      "- [Insert applicable engineering standards]",
      "- [Insert project specifications]",
      "- [Insert regulatory codes]",
    ].join("\n");
  }
  return [
    "## References",
    "",
    ...standards.map((s, i) => `${i + 1}. ${s}`),
  ].join("\n");
};

export const buildAnnexuresSection = (template: EngineeringTemplate): string =>
  [
    "## Annexures",
    "",
    "- Annex A: Drawings and Sketches",
    "- Annex B: Calculation Sheets",
    `- Annex C: ${template.documentTypeName} Supporting Data`,
    "- Annex D: Photographs / Test Reports",
  ].join("\n");

export const buildSectionContent = (
  section: string,
  index: number,
  userInputs: string,
  calculations: string[]
): string => {
  const sectionNumber = `${index + 1}`;
  const calculationNote =
    calculations.length > 0 && /calculat|design|result/i.test(section)
      ? `\n\nEngineering calculations:\n${calculations.map((c) => `- ${c}`).join("\n")}`
      : "";

  const inputNote = userInputs
    ? `\n\nUser context: ${userInputs.slice(0, 300)}`
    : "";

  return [
    `## ${sectionNumber}. ${section}`,
    "",
    `[AI-generated content for ${section} — populate with project-specific engineering data.]${inputNote}${calculationNote}`,
    "",
  ].join("\n");
};

export const assembleDocument = (
  template: EngineeringTemplate,
  options: {
    userInputs: string;
    disciplineName: string | null;
    projectName: string | null;
    standards: string[];
    calculations: string[];
  }
): GeneratedDocument => {
  const toc = buildTableOfContents(template.sections);
  const revisionHistory = buildRevisionHistory();
  const header = buildDocumentHeader(
    template.documentTypeName,
    options.disciplineName ?? template.disciplineName,
    options.projectName
  );
  const sections = template.sections
    .map((section, index) =>
      buildSectionContent(
        section,
        index,
        options.userInputs,
        options.calculations
      )
    )
    .join("\n");
  const references = buildReferencesSection(options.standards);
  const annexures = buildAnnexuresSection(template);
  const footer = buildDocumentFooter();

  const content = [
    header,
    "",
    "## Table of Contents",
    toc.join("\n"),
    "",
    "## Revision History",
    revisionHistory
      .map(
        (r) =>
          `| ${r.revision} | ${r.date} | ${r.author} | ${r.description} |`
      )
      .join("\n"),
    "",
    sections,
    references,
    "",
    annexures,
    footer,
  ].join("\n");

  return {
    id: crypto.randomUUID(),
    templateId: template.id,
    title: `${template.documentTypeName} — ${options.projectName ?? template.disciplineName}`,
    disciplineId: template.disciplineId,
    disciplineName: template.disciplineName,
    documentType: template.documentTypeName,
    content,
    tableOfContents: toc,
    revisionHistory,
    references: options.standards,
    annexures: [
      "Annex A: Drawings",
      "Annex B: Calculations",
      "Annex C: Supporting Data",
      "Annex D: Photographs",
    ],
    generatedAt: Date.now(),
    projectName: options.projectName,
    standardsUsed: options.standards,
  };
};

export const formatDocumentPreview = (doc: GeneratedDocument): string =>
  [
    `Generated: ${doc.title}`,
    `Type: ${doc.documentType}`,
    `Sections: ${doc.tableOfContents.length}`,
    `Standards: ${doc.standardsUsed.length > 0 ? doc.standardsUsed.join(", ") : "To be specified"}`,
    "",
    doc.content.slice(0, 1200) + (doc.content.length > 1200 ? "\n\n[... document continues ...]" : ""),
  ].join("\n");
