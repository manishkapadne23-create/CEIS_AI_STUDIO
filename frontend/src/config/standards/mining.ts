import { createDisciplineStandardsCatalog } from "./createStandardEntry";

export const miningStandardsCatalog = createDisciplineStandardsCatalog(
  "mining-engineering",
  "Mining Engineering",
  [
    {
      codeNumber: "DGMS",
      title: "Directorate General of Mines Safety Regulations",
      publisher: "Directorate General of Mines Safety",
      category: "Mine Safety",
      shortDescription:
        "Indian mine safety regulations, ventilation, and operational compliance.",
      edition: "DGMS regulations",
      externalLink: "https://dgms.gov.in/",
      relatedCodes: ["BIS"],
      isPopular: true,
    },
    {
      codeNumber: "ISO",
      title: "ISO Mining & Minerals Standards",
      publisher: "International Organization for Standardization",
      category: "Mining Operations",
      shortDescription:
        "International standards for mining operations, safety, and minerals processing.",
      edition: "ISO mining catalogue",
      externalLink: "https://www.iso.org/",
      relatedCodes: ["DGMS"],
      isPopular: true,
    },
    {
      codeNumber: "BIS",
      title: "Bureau of Indian Standards — Mining",
      publisher: "Bureau of Indian Standards",
      category: "Indian Standards",
      shortDescription:
        "Indian national standards for mining equipment and mineral processing.",
      edition: "BIS mining catalogue",
      externalLink: "https://www.bis.gov.in/",
      relatedCodes: ["DGMS"],
    },
  ]
);
