import { createDisciplineStandardsCatalog } from "./createStandardEntry";

export const oilGasStandardsCatalog = createDisciplineStandardsCatalog(
  "oil-gas-engineering",
  "Oil & Gas Engineering",
  [
    {
      codeNumber: "API",
      title: "API Oil & Gas Standards",
      publisher: "American Petroleum Institute",
      category: "Upstream & Downstream",
      shortDescription:
        "Standards for oil and gas exploration, production, refining, and pipeline systems.",
      edition: "API standards catalogue",
      externalLink: "https://www.api.org/",
      relatedCodes: ["ASME", "ISO"],
      isPopular: true,
    },
    {
      codeNumber: "ASME",
      title: "ASME Pressure Equipment Codes",
      publisher: "American Society of Mechanical Engineers",
      category: "Pressure Systems",
      shortDescription:
        "Pressure vessel, piping, and boiler codes for oil and gas facilities.",
      edition: "BPVC / B31 series",
      externalLink: "https://www.asme.org/",
      relatedCodes: ["API", "ISO"],
      isPopular: true,
    },
    {
      codeNumber: "ISO",
      title: "ISO Oil & Gas Standards",
      publisher: "International Organization for Standardization",
      category: "International Standards",
      shortDescription:
        "International standards for petroleum, petrochemical, and gas industries.",
      edition: "ISO oil & gas catalogue",
      externalLink: "https://www.iso.org/",
      relatedCodes: ["API", "ASME"],
      isPopular: true,
    },
  ]
);
