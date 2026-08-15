import { createDisciplineStandardsCatalog } from "./createStandardEntry";

export const industrialStandardsCatalog = createDisciplineStandardsCatalog(
  "industrial-engineering",
  "Industrial Engineering",
  [
    {
      codeNumber: "Lean",
      title: "Lean Manufacturing Principles",
      publisher: "Industry Practice",
      category: "Lean Manufacturing",
      shortDescription:
        "Lean production system principles for waste reduction and flow optimization.",
      edition: "Lean toolkit reference",
      externalLink: "https://www.lean.org/",
      relatedCodes: ["Six Sigma", "ISO"],
      isPopular: true,
    },
    {
      codeNumber: "Six Sigma",
      title: "Six Sigma Quality Methodology",
      publisher: "Industry Practice",
      category: "Quality Management",
      shortDescription:
        "DMAIC-based quality improvement methodology for process variation reduction.",
      edition: "Six Sigma body of knowledge",
      externalLink: "https://www.asq.org/",
      relatedCodes: ["Lean", "ISO"],
      isPopular: true,
    },
    {
      codeNumber: "ISO",
      title: "ISO Quality & Operations Standards",
      publisher: "International Organization for Standardization",
      category: "Quality Management",
      shortDescription:
        "ISO 9001 and related standards for quality and operations management.",
      edition: "ISO 9001:2015",
      externalLink: "https://www.iso.org/",
      relatedCodes: ["Lean", "Six Sigma"],
      isPopular: true,
    },
  ]
);
