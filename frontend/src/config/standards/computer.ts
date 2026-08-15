import { createDisciplineStandardsCatalog } from "./createStandardEntry";

export const computerStandardsCatalog = createDisciplineStandardsCatalog(
  "computer-engineering",
  "Computer Engineering",
  [
    {
      codeNumber: "IEEE",
      title: "IEEE Computing & Networking Standards",
      publisher: "Institute of Electrical and Electronics Engineers",
      category: "Computing",
      shortDescription:
        "Standards for networking, software engineering, and computer systems.",
      edition: "IEEE CS standards",
      externalLink: "https://standards.ieee.org/",
      relatedCodes: ["ISO", "RFC"],
      isPopular: true,
    },
    {
      codeNumber: "ISO",
      title: "ISO Information Technology Standards",
      publisher: "International Organization for Standardization",
      category: "Information Technology",
      shortDescription:
        "International IT, software quality, and systems engineering standards.",
      edition: "ISO/IEC JTC 1",
      externalLink: "https://www.iso.org/",
      relatedCodes: ["IEEE", "W3C"],
      isPopular: true,
    },
    {
      codeNumber: "RFC",
      title: "IETF Request for Comments",
      publisher: "Internet Engineering Task Force",
      category: "Internet Protocols",
      shortDescription:
        "Internet protocol specifications and network engineering references.",
      edition: "Active RFC series",
      externalLink: "https://www.rfc-editor.org/",
      relatedCodes: ["W3C"],
      isPopular: true,
    },
    {
      codeNumber: "W3C",
      title: "World Wide Web Consortium Standards",
      publisher: "World Wide Web Consortium",
      category: "Web Technologies",
      shortDescription:
        "Web platform standards including HTML, CSS, and accessibility guidelines.",
      edition: "W3C recommendations",
      externalLink: "https://www.w3.org/",
      relatedCodes: ["RFC"],
    },
  ]
);
