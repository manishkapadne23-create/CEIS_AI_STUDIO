import type { Certification, MentorDisciplineId } from "./types";

const CERTIFICATION_CATALOG: Certification[] = [
  { id: "pe", name: "Professional Engineer (PE)", type: "engineering", disciplineId: "general", provider: "State/National Board", description: "Licensed professional practice credential", relevance: "Required for signing off designs in many jurisdictions" },
  { id: "pmp", name: "Project Management Professional (PMP)", type: "engineering", disciplineId: "general", provider: "PMI", description: "Global project management certification", relevance: "Valuable for engineers leading projects" },
  { id: "six-sigma", name: "Six Sigma Green/Black Belt", type: "engineering", disciplineId: "industrial-engineering", provider: "ASQ / IASSC", description: "Process improvement methodology", relevance: "Quality and operations excellence" },
  { id: "leed", name: "LEED Accredited Professional", type: "engineering", disciplineId: "architecture-planning", provider: "USGBC", description: "Green building certification", relevance: "Sustainable design and construction" },
  { id: "autocad", name: "AutoCAD Certified Professional", type: "software", disciplineId: "civil-engineering", provider: "Autodesk", description: "CAD drafting and design proficiency", relevance: "Industry-standard drafting credential" },
  { id: "revit", name: "Revit Professional Certification", type: "software", disciplineId: "architecture-planning", provider: "Autodesk", description: "BIM modeling certification", relevance: "Building information modeling careers" },
  { id: "aws", name: "AWS Certified Solutions Architect", type: "software", disciplineId: "computer-engineering", provider: "Amazon Web Services", description: "Cloud architecture certification", relevance: "Cloud engineering and DevOps roles" },
  { id: "azure", name: "Microsoft Azure Fundamentals", type: "software", disciplineId: "computer-engineering", provider: "Microsoft", description: "Cloud fundamentals certification", relevance: "Enterprise cloud adoption" },
  { id: "cisco", name: "CCNA / CCNP", type: "software", disciplineId: "electronics-telecommunication-engineering", provider: "Cisco", description: "Networking certification track", relevance: "Network engineering careers" },
  { id: "osha", name: "OSHA 30-Hour Construction Safety", type: "government", disciplineId: "civil-engineering", provider: "OSHA / Authorized Trainers", description: "Construction safety training", relevance: "Site safety compliance" },
  { id: "nebosh", name: "NEBOSH International General Certificate", type: "government", disciplineId: "oil-gas-engineering", provider: "NEBOSH", description: "Occupational health and safety", relevance: "HSE roles in oil & gas and construction" },
  { id: "iei", name: "IEI Membership (MIE / FIE)", type: "membership", disciplineId: "general", provider: "Institution of Engineers India", description: "Professional engineering membership", relevance: "Recognized professional standing in India" },
  { id: "ieee", name: "IEEE Membership", type: "membership", disciplineId: "electrical-engineering", provider: "IEEE", description: "Global electrical/electronics professional body", relevance: "Networking, standards, and publications" },
  { id: "asce", name: "ASCE Membership", type: "membership", disciplineId: "civil-engineering", provider: "ASCE", description: "American Society of Civil Engineers", relevance: "Civil engineering professional community" },
  { id: "nptel", name: "NPTEL Domain Certifications", type: "training", disciplineId: "general", provider: "IITs / NPTEL", description: "Free online engineering courses with certification", relevance: "Affordable skill building for students and professionals" },
  { id: "coursera-eng", name: "Coursera Engineering Specializations", type: "training", disciplineId: "general", provider: "Coursera / Universities", description: "Structured online engineering programs", relevance: "Flexible upskilling across disciplines" },
  { id: "solidworks", name: "SolidWorks CSWA/CSWP", type: "software", disciplineId: "mechanical-engineering", provider: "Dassault Systèmes", description: "3D CAD certification", relevance: "Mechanical design and manufacturing" },
  { id: "etap", name: "ETAP Power System Certification", type: "software", disciplineId: "electrical-engineering", provider: "ETAP", description: "Power system analysis software", relevance: "Electrical power engineering roles" },
  { id: "pvsyst", name: "PVsyst Training Certification", type: "software", disciplineId: "renewable-energy", provider: "PVsyst", description: "Solar PV system design software", relevance: "Renewable energy project design" },
  { id: "iso13485", name: "ISO 13485 Lead Auditor", type: "engineering", disciplineId: "biomedical-engineering", provider: "Various Accredited Bodies", description: "Medical device quality management", relevance: "Regulatory and quality roles in medtech" },
];

export const getCertificationsForDiscipline = (
  disciplineId: string | null
): Certification[] => {
  if (!disciplineId) return CERTIFICATION_CATALOG;
  return CERTIFICATION_CATALOG.filter(
    (c) => c.disciplineId === disciplineId || c.disciplineId === "general"
  );
};

export const recommendCertifications = (
  disciplineId: string | null,
  _disciplineName: string | null,
  focusArea: string
): Certification[] => {
  const base = getCertificationsForDiscipline(disciplineId);
  const focus = focusArea.toLowerCase();
  const scored = base.map((cert) => {
    let score = 0;
    if (cert.disciplineId === disciplineId) score += 2;
    if (cert.name.toLowerCase().includes(focus) || cert.description.toLowerCase().includes(focus)) score += 3;
    if (cert.type === "engineering") score += 1;
    return { cert, score };
  });
  return scored
    .sort((a, b) => b.score - a.score)
    .slice(0, 8)
    .map((s) => s.cert);
};

export const formatCertificationRoadmap = (
  certs: Certification[],
  disciplineName: string | null
): string =>
  [
    `CERTIFICATION ROADMAP — ${disciplineName ?? "Engineering"}`,
    "",
    ...certs.map(
      (c, i) =>
        [
          `${i + 1}. ${c.name} (${c.type})`,
          `   Provider: ${c.provider}`,
          `   ${c.description}`,
          `   Relevance: ${c.relevance}`,
        ].join("\n")
    ),
  ].join("\n\n");

export const searchCertifications = (query: string, disciplineId: string | null): Certification[] => {
  const pool = getCertificationsForDiscipline(disciplineId);
  const q = query.toLowerCase();
  if (!q) return pool;
  return pool.filter(
    (c) =>
      c.name.toLowerCase().includes(q) ||
      c.type.includes(q) ||
      c.provider.toLowerCase().includes(q) ||
      c.description.toLowerCase().includes(q)
  );
};

export const CERTIFICATION_CATALOG_SIZE = CERTIFICATION_CATALOG.length;

export type { MentorDisciplineId };
