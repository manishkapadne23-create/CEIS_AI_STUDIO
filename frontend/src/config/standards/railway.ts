import { createDisciplineStandardsCatalog } from "./createStandardEntry";

export const railwayStandardsCatalog = createDisciplineStandardsCatalog(
  "railway-engineering",
  "Railway Engineering",
  [
    {
      codeNumber: "IRS",
      title: "Indian Railway Standards",
      publisher: "Indian Railways",
      category: "Railway Engineering",
      shortDescription:
        "Indian Railway Standards for track, bridges, rolling stock, and signalling.",
      edition: "IRS catalogue",
      externalLink: "https://indianrailways.gov.in/",
      relatedCodes: ["RDSO", "UIC"],
      isPopular: true,
    },
    {
      codeNumber: "RDSO",
      title: "Research Designs & Standards Organisation",
      publisher: "Research Designs & Standards Organisation",
      category: "Railway R&D",
      shortDescription:
        "Indian railway research standards, specifications, and design codes.",
      edition: "RDSO specifications",
      externalLink: "https://rdso.indianrailways.gov.in/",
      relatedCodes: ["IRS", "UIC"],
      isPopular: true,
    },
    {
      codeNumber: "UIC",
      title: "International Union of Railways Standards",
      publisher: "International Union of Railways",
      category: "International Railways",
      shortDescription:
        "International railway interoperability, track, and operations standards.",
      edition: "UIC leaflets",
      externalLink: "https://uic.org/",
      relatedCodes: ["IRS", "RDSO"],
      isPopular: true,
    },
  ]
);
