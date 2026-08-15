import { createDisciplineStandardsCatalog } from "./createStandardEntry";

export const civilStandardsCatalog = createDisciplineStandardsCatalog(
  "civil-engineering",
  "Civil Engineering",
  [
    {
      codeNumber: "IRC",
      title: "Indian Roads Congress Standards",
      publisher: "Indian Roads Congress",
      category: "Highway & Transportation",
      shortDescription:
        "Highway planning, geometric design, pavement, bridge, and traffic engineering codes for Indian roads.",
      edition: "2024 catalogue",
      externalLink: "https://www.irc.org.in/",
      keywords: ["highway", "pavement", "bridge", "geometric design"],
      relatedCodes: ["MoRTH", "IS Codes"],
      isPopular: true,
      isLatest: true,
      status: "latest-revision",
    },
    {
      codeNumber: "MoRTH",
      title: "Ministry of Road Transport and Highways Specifications",
      publisher: "Ministry of Road Transport and Highways",
      category: "Highway Policy",
      shortDescription:
        "National highway specifications, manuals, and circulars for road development in India.",
      edition: "2023 revisions",
      externalLink: "https://morth.nic.in/",
      keywords: ["highway", "specifications", "manuals"],
      relatedCodes: ["IRC", "MoRTH Circulars"],
      isPopular: true,
    },
    {
      codeNumber: "MoRTH Circulars",
      title: "MoRTH Policy Circulars & Notifications",
      publisher: "Ministry of Road Transport and Highways",
      category: "Highway Policy",
      shortDescription:
        "Administrative circulars, policy updates, and technical notifications for national highways.",
      edition: "Ongoing updates",
      externalLink: "https://morth.nic.in/",
      keywords: ["circulars", "policy", "notifications"],
      relatedCodes: ["MoRTH", "IRC"],
    },
    {
      codeNumber: "IS Codes",
      title: "Bureau of Indian Standards — Civil Codes",
      publisher: "Bureau of Indian Standards",
      category: "Structural & General",
      shortDescription:
        "Indian Standards for structural design, materials, construction, and infrastructure works.",
      edition: "IS 456:2000 and updates",
      externalLink: "https://www.bis.gov.in/",
      keywords: ["structural", "concrete", "steel", "construction"],
      relatedCodes: ["NBC", "IRC"],
      isPopular: true,
    },
    {
      codeNumber: "ASTM",
      title: "ASTM International Standards",
      publisher: "ASTM International",
      category: "Materials & Testing",
      shortDescription:
        "International test methods and material standards used in civil and geotechnical works.",
      edition: "Annual book of standards",
      externalLink: "https://www.astm.org/",
      keywords: ["materials", "testing", "geotechnical"],
      relatedCodes: ["AASHTO"],
    },
    {
      codeNumber: "AASHTO",
      title: "AASHTO Transportation Standards",
      publisher: "American Association of State Highway and Transportation Officials",
      category: "Transportation",
      shortDescription:
        "US transportation design guides, bridge specifications, and pavement standards.",
      edition: "LRFD Bridge Design Specifications",
      externalLink: "https://www.transportation.org/",
      keywords: ["transportation", "bridge", "pavement"],
      relatedCodes: ["ASTM"],
    },
    {
      codeNumber: "BS",
      title: "British Standards",
      publisher: "British Standards Institution",
      category: "Structural & Construction",
      shortDescription:
        "British Standards for structural engineering, construction, and infrastructure practice.",
      edition: "BS EN catalogue",
      externalLink: "https://www.bsigroup.com/",
      keywords: ["structural", "construction", "UK"],
      relatedCodes: ["Eurocodes"],
    },
    {
      codeNumber: "Eurocodes",
      title: "European Structural Design Standards",
      publisher: "European Committee for Standardization",
      category: "Structural Design",
      shortDescription:
        "Harmonized European structural design standards for buildings and civil works.",
      edition: "EN 1990–1999 series",
      externalLink: "https://eurocodes.jrc.ec.europa.eu/",
      keywords: ["structural", "Europe", "EN"],
      relatedCodes: ["BS"],
      status: "new-standard",
    },
    {
      codeNumber: "NBC",
      title: "National Building Code of India",
      publisher: "Bureau of Indian Standards",
      category: "Building Codes",
      shortDescription:
        "National Building Code of India for building planning, fire safety, and services.",
      edition: "NBC 2016",
      externalLink: "https://www.bis.gov.in/",
      keywords: ["building", "fire safety", "planning"],
      relatedCodes: ["IS Codes"],
      isLatest: true,
    },
  ]
);
