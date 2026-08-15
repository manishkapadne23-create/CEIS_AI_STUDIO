import { createDisciplineStandardsCatalog } from "./createStandardEntry";

export const architectureStandardsCatalog = createDisciplineStandardsCatalog(
  "architecture-planning",
  "Architecture & Planning",
  [
    {
      codeNumber: "NBC",
      title: "National Building Code of India",
      publisher: "Bureau of Indian Standards",
      category: "Building Codes",
      shortDescription:
        "National Building Code for planning, fire safety, and building services.",
      edition: "NBC 2016",
      externalLink: "https://www.bis.gov.in/",
      relatedCodes: ["IS Codes", "ADA"],
      isPopular: true,
    },
    {
      codeNumber: "IS Codes",
      title: "Bureau of Indian Standards — Building Codes",
      publisher: "Bureau of Indian Standards",
      category: "Indian Standards",
      shortDescription:
        "Indian Standards for architectural design, structures, and building services.",
      edition: "BIS building catalogue",
      externalLink: "https://www.bis.gov.in/",
      relatedCodes: ["NBC"],
      isPopular: true,
    },
    {
      codeNumber: "ADA",
      title: "Americans with Disabilities Act Standards",
      publisher: "US Department of Justice",
      category: "Accessibility",
      shortDescription:
        "Accessibility design standards for buildings and public spaces.",
      edition: "ADA Standards for Accessible Design",
      externalLink: "https://www.ada.gov/",
      relatedCodes: ["NBC"],
    },
  ]
);
