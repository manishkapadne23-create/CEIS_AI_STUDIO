import { createDisciplineStandardsCatalog } from "./createStandardEntry";

export const electricalStandardsCatalog = createDisciplineStandardsCatalog(
  "electrical-engineering",
  "Electrical Engineering",
  [
    {
      codeNumber: "IEC",
      title: "International Electrotechnical Commission Standards",
      publisher: "International Electrotechnical Commission",
      category: "Power & Systems",
      shortDescription:
        "International electrical, electronic, and power system standards.",
      edition: "IEC catalogue",
      externalLink: "https://www.iec.ch/",
      relatedCodes: ["IEEE", "IS"],
      isPopular: true,
      isLatest: true,
    },
    {
      codeNumber: "IEEE",
      title: "IEEE Electrical Standards",
      publisher: "Institute of Electrical and Electronics Engineers",
      category: "Power & Systems",
      shortDescription:
        "Standards for electrical power, electronics, and industrial systems.",
      edition: "IEEE active standards",
      externalLink: "https://standards.ieee.org/",
      relatedCodes: ["IEC", "NEC"],
      isPopular: true,
    },
    {
      codeNumber: "NEC",
      title: "National Electrical Code",
      publisher: "National Fire Protection Association",
      category: "Wiring & Installation",
      shortDescription:
        "US national electrical code for safe electrical design and installation.",
      edition: "NEC 2023",
      externalLink: "https://www.nfpa.org/",
      relatedCodes: ["IEEE"],
      isPopular: true,
    },
    {
      codeNumber: "IS",
      title: "Bureau of Indian Standards — Electrical Codes",
      publisher: "Bureau of Indian Standards",
      category: "Indian Standards",
      shortDescription:
        "Indian Standards for electrical installations, cables, and protection.",
      edition: "BIS electrical catalogue",
      externalLink: "https://www.bis.gov.in/",
      relatedCodes: ["IEC", "IEEE"],
    },
  ]
);
