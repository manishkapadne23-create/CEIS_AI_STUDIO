import { createDisciplineStandardsCatalog } from "./createStandardEntry";

export const electronicsStandardsCatalog = createDisciplineStandardsCatalog(
  "electronics-telecommunication-engineering",
  "Electronics & Telecommunication Engineering",
  [
    {
      codeNumber: "IPC",
      title: "IPC Electronics Manufacturing Standards",
      publisher: "Association Connecting Electronics Industries",
      category: "PCB & Assembly",
      shortDescription:
        "Standards for PCB design, assembly, and electronics manufacturing quality.",
      edition: "IPC-A-610 / IPC-2221",
      externalLink: "https://www.ipc.org/",
      relatedCodes: ["JEDEC", "IEEE"],
      isPopular: true,
    },
    {
      codeNumber: "IEEE",
      title: "IEEE Electronics Standards",
      publisher: "Institute of Electrical and Electronics Engineers",
      category: "Electronics",
      shortDescription:
        "Standards for electronic devices, circuits, and test methods.",
      edition: "IEEE electronics catalogue",
      externalLink: "https://standards.ieee.org/",
      relatedCodes: ["IPC", "JEDEC"],
      isPopular: true,
    },
    {
      codeNumber: "JEDEC",
      title: "JEDEC Solid State Technology Standards",
      publisher: "JEDEC Solid State Technology Association",
      category: "Semiconductors",
      shortDescription:
        "Semiconductor device, package, and reliability standards.",
      edition: "JEDEC standards catalogue",
      externalLink: "https://www.jedec.org/",
      relatedCodes: ["IPC"],
      isPopular: true,
    },
  ]
);
