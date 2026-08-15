import { createDisciplineStandardsCatalog } from "./createStandardEntry";

export const renewableStandardsCatalog = createDisciplineStandardsCatalog(
  "renewable-energy",
  "Renewable Energy",
  [
    {
      codeNumber: "IEC",
      title: "IEC Renewable Energy Standards",
      publisher: "International Electrotechnical Commission",
      category: "Renewable Systems",
      shortDescription:
        "International standards for solar PV, wind turbines, and grid integration.",
      edition: "IEC TC 82 / TC 88",
      externalLink: "https://www.iec.ch/",
      relatedCodes: ["MNRE", "BIS"],
      isPopular: true,
    },
    {
      codeNumber: "MNRE",
      title: "Ministry of New and Renewable Energy Guidelines",
      publisher: "Ministry of New and Renewable Energy",
      category: "Indian Policy",
      shortDescription:
        "Indian renewable energy policy, tariffs, and technical guidelines.",
      edition: "MNRE guidelines",
      externalLink: "https://mnre.gov.in/",
      relatedCodes: ["IEC", "BIS"],
      isPopular: true,
    },
    {
      codeNumber: "BIS",
      title: "Bureau of Indian Standards — Renewable",
      publisher: "Bureau of Indian Standards",
      category: "Indian Standards",
      shortDescription:
        "Indian national standards for solar, wind, and energy storage systems.",
      edition: "BIS renewable catalogue",
      externalLink: "https://www.bis.gov.in/",
      relatedCodes: ["MNRE", "IEC"],
    },
  ]
);
