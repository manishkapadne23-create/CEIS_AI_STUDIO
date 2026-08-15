import { createDisciplineStandardsCatalog } from "./createStandardEntry";

export const marineStandardsCatalog = createDisciplineStandardsCatalog(
  "marine-engineering",
  "Marine Engineering",
  [
    {
      codeNumber: "IMO",
      title: "International Maritime Organization Conventions",
      publisher: "International Maritime Organization",
      category: "Maritime Regulation",
      shortDescription:
        "Global maritime safety, pollution prevention, and operational conventions.",
      edition: "IMO conventions catalogue",
      externalLink: "https://www.imo.org/",
      relatedCodes: ["SOLAS", "DNV"],
      isPopular: true,
    },
    {
      codeNumber: "SOLAS",
      title: "Safety of Life at Sea Convention",
      publisher: "International Maritime Organization",
      category: "Maritime Safety",
      shortDescription:
        "International convention for ship safety, construction, and lifesaving equipment.",
      edition: "SOLAS consolidated edition",
      externalLink: "https://www.imo.org/",
      relatedCodes: ["IMO", "DNV"],
      isPopular: true,
    },
    {
      codeNumber: "DNV",
      title: "DNV Classification & Offshore Standards",
      publisher: "DNV",
      category: "Classification",
      shortDescription:
        "Classification society rules and offshore/marine engineering standards.",
      edition: "DNV rules catalogue",
      externalLink: "https://www.dnv.com/",
      relatedCodes: ["IMO", "SOLAS"],
      isPopular: true,
    },
  ]
);
