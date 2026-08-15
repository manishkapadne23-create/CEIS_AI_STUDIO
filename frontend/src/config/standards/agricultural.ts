import { createDisciplineStandardsCatalog } from "./createStandardEntry";

export const agriculturalStandardsCatalog = createDisciplineStandardsCatalog(
  "agricultural-engineering",
  "Agricultural Engineering",
  [
    {
      codeNumber: "FAO",
      title: "FAO Agricultural Standards & Guidelines",
      publisher: "Food and Agriculture Organization",
      category: "Agricultural Practice",
      shortDescription:
        "International guidelines for sustainable agriculture, irrigation, and food systems.",
      edition: "FAO technical guidelines",
      externalLink: "https://www.fao.org/",
      relatedCodes: ["BIS"],
      isPopular: true,
    },
    {
      codeNumber: "BIS",
      title: "Bureau of Indian Standards — Agricultural",
      publisher: "Bureau of Indian Standards",
      category: "Indian Standards",
      shortDescription:
        "Indian national standards for agricultural equipment, irrigation, and processing.",
      edition: "BIS agricultural catalogue",
      externalLink: "https://www.bis.gov.in/",
      relatedCodes: ["FAO"],
      isPopular: true,
    },
  ]
);
