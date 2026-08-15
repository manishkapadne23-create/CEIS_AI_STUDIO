import { createDisciplineStandardsCatalog } from "./createStandardEntry";

export const biomedicalStandardsCatalog = createDisciplineStandardsCatalog(
  "biomedical-engineering",
  "Biomedical Engineering",
  [
    {
      codeNumber: "FDA",
      title: "FDA Medical Device Regulations",
      publisher: "US Food and Drug Administration",
      category: "Medical Device Regulation",
      shortDescription:
        "US regulations for medical device design, manufacturing, and market approval.",
      edition: "21 CFR Part 820",
      externalLink: "https://www.fda.gov/",
      relatedCodes: ["ISO 13485", "IEC 60601"],
      isPopular: true,
    },
    {
      codeNumber: "ISO 13485",
      title: "ISO 13485 Medical Devices QMS",
      publisher: "International Organization for Standardization",
      category: "Quality Management",
      shortDescription:
        "Quality management system standard for medical device organizations.",
      edition: "ISO 13485:2016",
      externalLink: "https://www.iso.org/",
      relatedCodes: ["FDA", "IEC 60601"],
      isPopular: true,
    },
    {
      codeNumber: "IEC 60601",
      title: "IEC 60601 Medical Electrical Equipment",
      publisher: "International Electrotechnical Commission",
      category: "Medical Electrical Safety",
      shortDescription:
        "Safety and essential performance standards for medical electrical equipment.",
      edition: "IEC 60601 series",
      externalLink: "https://www.iec.ch/",
      relatedCodes: ["FDA", "ISO 13485"],
      isPopular: true,
    },
  ]
);
