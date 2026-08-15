import { createDisciplineStandardsCatalog } from "./createStandardEntry";

export const mechanicalStandardsCatalog = createDisciplineStandardsCatalog(
  "mechanical-engineering",
  "Mechanical Engineering",
  [
    {
      codeNumber: "ASME",
      title: "ASME Boiler and Pressure Vessel Code",
      publisher: "American Society of Mechanical Engineers",
      category: "Pressure Vessels & Design",
      shortDescription:
        "Mechanical design, pressure vessels, piping, and boiler codes for engineering practice.",
      edition: "BPVC 2025",
      externalLink: "https://www.asme.org/",
      relatedCodes: ["API", "ISO"],
      isPopular: true,
      isLatest: true,
      status: "latest-revision",
    },
    {
      codeNumber: "ISO",
      title: "ISO Mechanical Engineering Standards",
      publisher: "International Organization for Standardization",
      category: "General Mechanical",
      shortDescription:
        "International mechanical engineering, quality, and dimensional standards.",
      edition: "ISO mechanical catalogue",
      externalLink: "https://www.iso.org/",
      relatedCodes: ["ASME", "DIN"],
      isPopular: true,
    },
    {
      codeNumber: "API",
      title: "API Equipment & Piping Standards",
      publisher: "American Petroleum Institute",
      category: "Equipment & Piping",
      shortDescription:
        "Standards for mechanical equipment, rotating machinery, and pressure systems.",
      edition: "API 610 / 617 series",
      externalLink: "https://www.api.org/",
      relatedCodes: ["ASME"],
      isPopular: true,
    },
    {
      codeNumber: "DIN",
      title: "DIN Mechanical Standards",
      publisher: "Deutsches Institut für Normung",
      category: "Mechanical Components",
      shortDescription:
        "German engineering standards for machine elements and manufacturing.",
      edition: "DIN mechanical series",
      externalLink: "https://www.din.de/",
      relatedCodes: ["ISO"],
    },
    {
      codeNumber: "ANSI",
      title: "ANSI Mechanical Reference Standards",
      publisher: "American National Standards Institute",
      category: "General Reference",
      shortDescription:
        "US reference standards coordinating mechanical and industrial engineering practice.",
      edition: "ANSI catalogue",
      externalLink: "https://www.ansi.org/",
      relatedCodes: ["ASME"],
    },
    {
      codeNumber: "IS",
      title: "Bureau of Indian Standards — Mechanical Codes",
      publisher: "Bureau of Indian Standards",
      category: "Indian Standards",
      shortDescription:
        "Indian Standards for mechanical engineering, materials, and industrial equipment.",
      edition: "BIS mechanical catalogue",
      externalLink: "https://www.bis.gov.in/",
      relatedCodes: ["ISO", "ASME"],
    },
  ]
);
