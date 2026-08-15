import { createDisciplineStandardsCatalog } from "./createStandardEntry";

export const aerospaceStandardsCatalog = createDisciplineStandardsCatalog(
  "aerospace-engineering",
  "Aerospace Engineering",
  [
    {
      codeNumber: "FAA",
      title: "Federal Aviation Administration Regulations",
      publisher: "Federal Aviation Administration",
      category: "Aviation Certification",
      shortDescription:
        "US federal aviation regulations for aircraft design, operations, and airworthiness.",
      edition: "14 CFR",
      externalLink: "https://www.faa.gov/",
      relatedCodes: ["EASA", "NASA"],
      isPopular: true,
    },
    {
      codeNumber: "EASA",
      title: "European Union Aviation Safety Agency Standards",
      publisher: "European Union Aviation Safety Agency",
      category: "Aviation Certification",
      shortDescription:
        "European aviation safety standards and certification specifications.",
      edition: "EASA CS catalogue",
      externalLink: "https://www.easa.europa.eu/",
      relatedCodes: ["FAA", "NASA"],
      isPopular: true,
    },
    {
      codeNumber: "NASA",
      title: "NASA Technical Standards",
      publisher: "National Aeronautics and Space Administration",
      category: "Aerospace R&D",
      shortDescription:
        "NASA technical standards for space systems, materials, and engineering practice.",
      edition: "NASA standards database",
      externalLink: "https://standards.nasa.gov/",
      relatedCodes: ["FAA", "EASA"],
      isPopular: true,
    },
  ]
);
