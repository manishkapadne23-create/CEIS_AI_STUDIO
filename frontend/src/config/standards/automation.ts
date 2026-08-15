import { createDisciplineStandardsCatalog } from "./createStandardEntry";

export const automationStandardsCatalog = createDisciplineStandardsCatalog(
  "automation-robotics",
  "Automation & Robotics",
  [
    {
      codeNumber: "IEC 61131",
      title: "IEC 61131 Programmable Controllers",
      publisher: "International Electrotechnical Commission",
      category: "PLC Programming",
      shortDescription:
        "International standard for PLC programming languages and architectures.",
      edition: "IEC 61131-3",
      externalLink: "https://www.iec.ch/",
      relatedCodes: ["ISA", "OPC-UA"],
      isPopular: true,
    },
    {
      codeNumber: "ISA",
      title: "ISA Automation Standards",
      publisher: "International Society of Automation",
      category: "Industrial Automation",
      shortDescription:
        "Instrumentation, control systems, and safety standards for automation.",
      edition: "ISA standards catalogue",
      externalLink: "https://www.isa.org/",
      relatedCodes: ["IEC 61131", "OPC-UA"],
      isPopular: true,
    },
    {
      codeNumber: "OPC-UA",
      title: "OPC Unified Architecture",
      publisher: "OPC Foundation",
      category: "Industrial Communication",
      shortDescription:
        "Machine-to-machine communication standard for industrial automation interoperability.",
      edition: "OPC UA specification",
      externalLink: "https://opcfoundation.org/",
      relatedCodes: ["IEC 61131", "ISA"],
      isPopular: true,
    },
  ]
);
