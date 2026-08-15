import { createDisciplineStandardsCatalog } from "./createStandardEntry";

export const chemicalStandardsCatalog = createDisciplineStandardsCatalog(
  "chemical-engineering",
  "Chemical Engineering",
  [
    {
      codeNumber: "API",
      title: "API Process & Equipment Standards",
      publisher: "American Petroleum Institute",
      category: "Process Equipment",
      shortDescription:
        "Standards for chemical process equipment, piping, and refinery systems.",
      edition: "API process series",
      externalLink: "https://www.api.org/",
      relatedCodes: ["ASTM", "NFPA"],
      isPopular: true,
    },
    {
      codeNumber: "OSHA",
      title: "OSHA Process Safety Standards",
      publisher: "Occupational Safety and Health Administration",
      category: "Process Safety",
      shortDescription:
        "US occupational safety and process safety management requirements.",
      edition: "29 CFR 1910",
      externalLink: "https://www.osha.gov/",
      relatedCodes: ["NFPA"],
      isPopular: true,
    },
    {
      codeNumber: "NFPA",
      title: "NFPA Fire & Chemical Safety Codes",
      publisher: "National Fire Protection Association",
      category: "Fire & Safety",
      shortDescription:
        "Fire protection and hazardous material safety codes for chemical facilities.",
      edition: "NFPA 30 / 497 series",
      externalLink: "https://www.nfpa.org/",
      relatedCodes: ["OSHA", "API"],
      isPopular: true,
    },
    {
      codeNumber: "ASTM",
      title: "ASTM Chemical & Materials Standards",
      publisher: "ASTM International",
      category: "Materials & Testing",
      shortDescription:
        "Test methods and material standards for chemical process industries.",
      edition: "ASTM chemical catalogue",
      externalLink: "https://www.astm.org/",
      relatedCodes: ["API"],
    },
  ]
);
