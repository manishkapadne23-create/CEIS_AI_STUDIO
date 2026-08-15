import { createDisciplineStandardsCatalog } from "./createStandardEntry";

export const environmentalStandardsCatalog = createDisciplineStandardsCatalog(
  "environmental-engineering",
  "Environmental Engineering",
  [
    {
      codeNumber: "CPCB",
      title: "Central Pollution Control Board Standards",
      publisher: "Central Pollution Control Board",
      category: "Environmental Compliance",
      shortDescription:
        "Indian environmental emission, effluent, and ambient air quality standards.",
      edition: "CPCB norms & guidelines",
      externalLink: "https://cpcb.nic.in/",
      relatedCodes: ["BIS", "ISO 14001"],
      isPopular: true,
    },
    {
      codeNumber: "EPA",
      title: "US Environmental Protection Agency Regulations",
      publisher: "US Environmental Protection Agency",
      category: "Environmental Compliance",
      shortDescription:
        "US federal environmental regulations for air, water, and waste management.",
      edition: "EPA CFR Title 40",
      externalLink: "https://www.epa.gov/",
      relatedCodes: ["ISO 14001"],
      isPopular: true,
    },
    {
      codeNumber: "BIS",
      title: "Bureau of Indian Standards — Environmental",
      publisher: "Bureau of Indian Standards",
      category: "Indian Standards",
      shortDescription:
        "Indian environmental and sustainability-related national standards.",
      edition: "BIS environmental catalogue",
      externalLink: "https://www.bis.gov.in/",
      relatedCodes: ["CPCB", "ISO 14001"],
    },
    {
      codeNumber: "ISO 14001",
      title: "ISO 14001 Environmental Management",
      publisher: "International Organization for Standardization",
      category: "Environmental Management",
      shortDescription:
        "International environmental management system standard for organizations.",
      edition: "ISO 14001:2015",
      externalLink: "https://www.iso.org/",
      relatedCodes: ["CPCB", "EPA"],
      isLatest: true,
    },
  ]
);
