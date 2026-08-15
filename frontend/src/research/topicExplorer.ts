import type { ResearchCategory, ResearchDisciplineId, ResearchTopic } from "./types";

export const DISCIPLINES: { id: ResearchDisciplineId; name: string }[] = [
  { id: "civil-engineering", name: "Civil Engineering" },
  { id: "mechanical-engineering", name: "Mechanical Engineering" },
  { id: "electrical-engineering", name: "Electrical Engineering" },
  { id: "computer-engineering", name: "Computer Engineering" },
  { id: "electronics-telecommunication-engineering", name: "Electronics & Telecommunication" },
  { id: "chemical-engineering", name: "Chemical Engineering" },
  { id: "environmental-engineering", name: "Environmental Engineering" },
  { id: "mining-engineering", name: "Mining Engineering" },
  { id: "marine-engineering", name: "Marine Engineering" },
  { id: "railway-engineering", name: "Railway Engineering" },
  { id: "aerospace-engineering", name: "Aerospace Engineering" },
  { id: "industrial-engineering", name: "Industrial Engineering" },
  { id: "automation-robotics", name: "Automation & Robotics" },
  { id: "renewable-energy", name: "Renewable Energy" },
  { id: "architecture-planning", name: "Architecture & Planning" },
  { id: "agricultural-engineering", name: "Agricultural Engineering" },
  { id: "oil-gas-engineering", name: "Oil & Gas Engineering" },
  { id: "biomedical-engineering", name: "Biomedical Engineering" },
];

const TOPIC_SEEDS: Record<ResearchDisciplineId, string[]> = {
  "civil-engineering": ["Sustainable concrete", "Bridge health monitoring", "Smart infrastructure", "Geopolymer materials"],
  "mechanical-engineering": ["Additive manufacturing", "Thermal energy storage", "Vibration control", "CFD optimization"],
  "electrical-engineering": ["Smart grid", "Power electronics", "Renewable integration", "Energy storage systems"],
  "computer-engineering": ["Edge computing", "Cybersecurity", "IoT architectures", "Machine learning systems"],
  "electronics-telecommunication-engineering": ["5G/6G networks", "RF antenna design", "Embedded systems", "Signal processing"],
  "chemical-engineering": ["Green chemistry", "Process intensification", "Carbon capture", "Biorefinery"],
  "environmental-engineering": ["Water treatment", "Air quality modeling", "Waste valorization", "Climate adaptation"],
  "mining-engineering": ["Autonomous mining", "Slope stability AI", "Mine ventilation", "Sustainable extraction"],
  "marine-engineering": ["Offshore structures", "Propulsion efficiency", "Corrosion protection", "Wave energy"],
  "railway-engineering": ["Track degradation", "Signalling systems", "High-speed rail", "Predictive maintenance"],
  "aerospace-engineering": ["Composite structures", "UAV design", "Propulsion systems", "Lightweight materials"],
  "industrial-engineering": ["Lean manufacturing", "Supply chain optimization", "Human factors", "Digital twins"],
  "automation-robotics": ["Collaborative robots", "PLC/SCADA integration", "Computer vision", "Autonomous systems"],
  "renewable-energy": ["Solar PV efficiency", "Wind turbine design", "Green hydrogen", "Microgrids"],
  "architecture-planning": ["Urban resilience", "Green buildings", "BIM integration", "Passive design"],
  "agricultural-engineering": ["Precision agriculture", "Irrigation automation", "Post-harvest tech", "Soil sensors"],
  "oil-gas-engineering": ["Pipeline integrity", "Enhanced oil recovery", "Offshore safety", "Leak detection"],
  "biomedical-engineering": ["Medical devices", "Biomaterials", "Prosthetics", "Imaging systems"],
};

export const buildTopicCatalog = (): ResearchTopic[] =>
  DISCIPLINES.flatMap((d) =>
    TOPIC_SEEDS[d.id].map((title, i) => ({
      id: `${d.id}-topic-${i}`,
      title,
      disciplineId: d.id,
      disciplineName: d.name,
      category: (["applied", "experimental", "computational", "innovation"] as ResearchCategory[])[i % 4],
      description: `Research area in ${d.name}: ${title}`,
      keywords: title.toLowerCase().split(/\s+/),
      relatedTopics: TOPIC_SEEDS[d.id].filter((t) => t !== title).slice(0, 2),
    }))
  );

export const TOPIC_CATALOG = buildTopicCatalog();

export const exploreTopic = (
  query: string,
  disciplineId: string | null
): ResearchTopic[] => {
  let topics = [...TOPIC_CATALOG];
  if (disciplineId) topics = topics.filter((t) => t.disciplineId === disciplineId);
  if (query) {
    const kw = query.toLowerCase();
    topics = topics.filter(
      (t) =>
        t.title.toLowerCase().includes(kw) ||
        t.description.toLowerCase().includes(kw) ||
        t.keywords.some((k) => kw.includes(k))
    );
  }
  return topics.slice(0, 10);
};

export const extractKeywords = (text: string): string[] => {
  const stopWords = new Set(["the", "and", "for", "with", "using", "based", "study", "research", "engineering"]);
  return [...new Set(
    text
      .toLowerCase()
      .replace(/[^\w\s]/g, " ")
      .split(/\s+/)
      .filter((w) => w.length > 3 && !stopWords.has(w))
  )].slice(0, 12);
};

export const identifyResearchGaps = (topic: string, disciplineName: string | null): string[] => [
  `Limited field validation of ${topic} in ${disciplineName ?? "engineering"} practice`,
  "Insufficient comparative studies across material/system alternatives",
  "Gap in standardized testing protocols for this application",
  "Limited integration with digital monitoring and IoT platforms",
  "Need for life-cycle and sustainability assessment frameworks",
];

export const suggestObjectives = (topic: string): string[] => [
  `To investigate ${topic} and its engineering applications`,
  "To develop and validate an experimental or computational methodology",
  "To compare performance against existing conventional approaches",
  "To identify optimal parameters and design recommendations",
  "To document findings for engineering practice adoption",
];

export const formatTopicExploration = (topics: ResearchTopic[]): string =>
  topics.length > 0
    ? topics.map((t, i) => `${i + 1}. ${t.title} (${t.disciplineName}) — ${t.category}`).join("\n")
    : "No topics found. Try a broader keyword.";
