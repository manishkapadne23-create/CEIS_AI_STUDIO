import type { StandardsPublisherId } from "./types";

export interface StandardsPublisherDefinition {
  id: StandardsPublisherId;
  label: string;
  aliases: string[];
  region: string;
}

export const STANDARDS_PUBLISHERS: StandardsPublisherDefinition[] = [
  { id: "is", label: "IS Codes", aliases: ["is", "bis", "bureau of indian standards"], region: "India" },
  { id: "irc", label: "IRC", aliases: ["irc", "indian roads congress"], region: "India" },
  { id: "morth", label: "MoRTH", aliases: ["morth", "ministry of road transport"], region: "India" },
  { id: "nbc", label: "NBC", aliases: ["nbc", "national building code"], region: "India" },
  { id: "astm", label: "ASTM", aliases: ["astm"], region: "International" },
  { id: "aashto", label: "AASHTO", aliases: ["aashto"], region: "USA" },
  { id: "aci", label: "ACI", aliases: ["aci", "american concrete institute"], region: "USA" },
  { id: "asce", label: "ASCE", aliases: ["asce"], region: "USA" },
  { id: "iso", label: "ISO", aliases: ["iso"], region: "International" },
  { id: "iec", label: "IEC", aliases: ["iec"], region: "International" },
  { id: "ieee", label: "IEEE", aliases: ["ieee"], region: "International" },
  { id: "api", label: "API", aliases: ["api", "american petroleum institute"], region: "USA" },
  { id: "asme", label: "ASME", aliases: ["asme"], region: "USA" },
  { id: "bs", label: "BS", aliases: ["bs", "british standards"], region: "UK" },
  { id: "en", label: "EN / Eurocodes", aliases: ["en", "eurocode", "eurocodes"], region: "Europe" },
];

export const resolvePublisherFromText = (text: string): StandardsPublisherId | null => {
  const normalized = text.toLowerCase();
  for (const publisher of STANDARDS_PUBLISHERS) {
    if (publisher.aliases.some((alias) => normalized.includes(alias))) {
      return publisher.id;
    }
  }
  if (/^is\s*\d+/i.test(text)) return "is";
  if (/^irc\s*\d+/i.test(text)) return "irc";
  if (/^iec\s*\d+/i.test(text)) return "iec";
  if (/^iso\s*\d+/i.test(text)) return "iso";
  if (/^astm\s*[a-z]/i.test(text)) return "astm";
  return null;
};

export const getPublisherLabel = (id: StandardsPublisherId): string =>
  STANDARDS_PUBLISHERS.find((publisher) => publisher.id === id)?.label ?? id.toUpperCase();
