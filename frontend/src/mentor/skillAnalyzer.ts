import type { MentorDisciplineId, SkillEntry, SkillMatrix } from "./types";

const DISCIPLINE_SKILLS: Record<MentorDisciplineId, SkillEntry[]> = {
  "civil-engineering": [
    { name: "Structural Analysis", category: "technical", level: "intermediate", priority: "high" },
    { name: "AutoCAD / Revit", category: "software", level: "intermediate", priority: "high" },
    { name: "STAAD.Pro / ETABS", category: "software", level: "beginner", priority: "medium" },
    { name: "Project Coordination", category: "management", level: "beginner", priority: "medium" },
    { name: "Technical Report Writing", category: "communication", level: "intermediate", priority: "high" },
  ],
  "mechanical-engineering": [
    { name: "Thermodynamics & Heat Transfer", category: "technical", level: "intermediate", priority: "high" },
    { name: "SolidWorks / CATIA", category: "software", level: "intermediate", priority: "high" },
    { name: "ANSYS / FEA", category: "software", level: "beginner", priority: "medium" },
    { name: "Manufacturing Processes", category: "technical", level: "intermediate", priority: "high" },
    { name: "Team Leadership", category: "leadership", level: "beginner", priority: "medium" },
  ],
  "electrical-engineering": [
    { name: "Power Systems", category: "technical", level: "intermediate", priority: "high" },
    { name: "ETAP / MATLAB", category: "software", level: "beginner", priority: "medium" },
    { name: "Protection & Control", category: "technical", level: "intermediate", priority: "high" },
    { name: "Electrical Codes & Standards", category: "technical", level: "intermediate", priority: "high" },
    { name: "Presentation Skills", category: "communication", level: "beginner", priority: "medium" },
  ],
  "computer-engineering": [
    { name: "Data Structures & Algorithms", category: "technical", level: "intermediate", priority: "high" },
    { name: "Python / Java", category: "software", level: "intermediate", priority: "high" },
    { name: "Cloud (AWS/Azure)", category: "software", level: "beginner", priority: "high" },
    { name: "System Design", category: "technical", level: "beginner", priority: "high" },
    { name: "Agile Project Management", category: "management", level: "beginner", priority: "medium" },
  ],
  "electronics-telecommunication-engineering": [
    { name: "Digital Signal Processing", category: "technical", level: "intermediate", priority: "high" },
    { name: "Embedded Systems", category: "technical", level: "intermediate", priority: "high" },
    { name: "MATLAB / LabVIEW", category: "software", level: "beginner", priority: "medium" },
    { name: "RF & Wireless", category: "technical", level: "beginner", priority: "medium" },
    { name: "Technical Documentation", category: "communication", level: "intermediate", priority: "medium" },
  ],
  "chemical-engineering": [
    { name: "Process Design", category: "technical", level: "intermediate", priority: "high" },
    { name: "Aspen HYSYS", category: "software", level: "beginner", priority: "high" },
    { name: "Safety & HAZOP", category: "technical", level: "intermediate", priority: "high" },
    { name: "Plant Operations", category: "management", level: "beginner", priority: "medium" },
    { name: "Stakeholder Communication", category: "communication", level: "beginner", priority: "medium" },
  ],
  "environmental-engineering": [
    { name: "Environmental Impact Assessment", category: "technical", level: "intermediate", priority: "high" },
    { name: "GIS / QGIS", category: "software", level: "beginner", priority: "medium" },
    { name: "Water & Wastewater Treatment", category: "technical", level: "intermediate", priority: "high" },
    { name: "Regulatory Compliance", category: "technical", level: "intermediate", priority: "high" },
    { name: "Public Engagement", category: "communication", level: "beginner", priority: "medium" },
  ],
  "mining-engineering": [
    { name: "Mine Planning", category: "technical", level: "intermediate", priority: "high" },
    { name: "Surpac / Vulcan", category: "software", level: "beginner", priority: "medium" },
    { name: "Rock Mechanics", category: "technical", level: "intermediate", priority: "high" },
    { name: "Mine Safety", category: "technical", level: "advanced", priority: "high" },
    { name: "Operations Management", category: "management", level: "beginner", priority: "medium" },
  ],
  "marine-engineering": [
    { name: "Naval Architecture", category: "technical", level: "intermediate", priority: "high" },
    { name: "Marine Propulsion", category: "technical", level: "intermediate", priority: "high" },
    { name: "Classification Society Rules", category: "technical", level: "beginner", priority: "high" },
    { name: "Ship Design Software", category: "software", level: "beginner", priority: "medium" },
    { name: "Cross-functional Coordination", category: "leadership", level: "beginner", priority: "medium" },
  ],
  "railway-engineering": [
    { name: "Track & Alignment Design", category: "technical", level: "intermediate", priority: "high" },
    { name: "Signalling Systems", category: "technical", level: "beginner", priority: "high" },
    { name: "Rail Standards (IRS/UIC)", category: "technical", level: "intermediate", priority: "high" },
    { name: "Project Scheduling", category: "management", level: "beginner", priority: "medium" },
    { name: "Safety Culture", category: "leadership", level: "beginner", priority: "high" },
  ],
  "aerospace-engineering": [
    { name: "Aerodynamics", category: "technical", level: "intermediate", priority: "high" },
    { name: "Composite Materials", category: "technical", level: "intermediate", priority: "high" },
    { name: "CATIA / NASTRAN", category: "software", level: "beginner", priority: "high" },
    { name: "DO-178C / AS9100", category: "technical", level: "beginner", priority: "medium" },
    { name: "Systems Engineering", category: "management", level: "beginner", priority: "medium" },
  ],
  "industrial-engineering": [
    { name: "Operations Research", category: "technical", level: "intermediate", priority: "high" },
    { name: "Lean / Six Sigma", category: "technical", level: "beginner", priority: "high" },
    { name: "Simulation (Arena / FlexSim)", category: "software", level: "beginner", priority: "medium" },
    { name: "Supply Chain Optimization", category: "technical", level: "intermediate", priority: "high" },
    { name: "Change Management", category: "leadership", level: "beginner", priority: "medium" },
  ],
  "automation-robotics": [
    { name: "PLC Programming", category: "technical", level: "intermediate", priority: "high" },
    { name: "ROS / Robot Programming", category: "software", level: "beginner", priority: "high" },
    { name: "Industrial IoT", category: "technical", level: "beginner", priority: "high" },
    { name: "Machine Vision", category: "technical", level: "beginner", priority: "medium" },
    { name: "Automation Project Management", category: "management", level: "beginner", priority: "medium" },
  ],
  "renewable-energy": [
    { name: "Solar PV System Design", category: "technical", level: "intermediate", priority: "high" },
    { name: "Wind Energy Fundamentals", category: "technical", level: "intermediate", priority: "high" },
    { name: "PVsyst / HOMER", category: "software", level: "beginner", priority: "medium" },
    { name: "Grid Integration", category: "technical", level: "beginner", priority: "high" },
    { name: "Sustainability Reporting", category: "communication", level: "beginner", priority: "medium" },
  ],
  "architecture-planning": [
    { name: "Building Design", category: "technical", level: "intermediate", priority: "high" },
    { name: "Revit / SketchUp", category: "software", level: "intermediate", priority: "high" },
    { name: "Urban Planning", category: "technical", level: "beginner", priority: "medium" },
    { name: "Building Codes", category: "technical", level: "intermediate", priority: "high" },
    { name: "Client Presentation", category: "communication", level: "intermediate", priority: "high" },
  ],
  "agricultural-engineering": [
    { name: "Irrigation Systems", category: "technical", level: "intermediate", priority: "high" },
    { name: "Farm Machinery", category: "technical", level: "intermediate", priority: "high" },
    { name: "Precision Agriculture", category: "technical", level: "beginner", priority: "high" },
    { name: "GIS for Agriculture", category: "software", level: "beginner", priority: "medium" },
    { name: "Rural Development", category: "management", level: "beginner", priority: "medium" },
  ],
  "oil-gas-engineering": [
    { name: "Reservoir Engineering", category: "technical", level: "intermediate", priority: "high" },
    { name: "Process Safety", category: "technical", level: "intermediate", priority: "high" },
    { name: "Petrel / OLGA", category: "software", level: "beginner", priority: "medium" },
    { name: "HSE Management", category: "management", level: "intermediate", priority: "high" },
    { name: "Technical Leadership", category: "leadership", level: "beginner", priority: "medium" },
  ],
  "biomedical-engineering": [
    { name: "Medical Device Design", category: "technical", level: "intermediate", priority: "high" },
    { name: "Biomechanics", category: "technical", level: "intermediate", priority: "high" },
    { name: "MATLAB / LabVIEW", category: "software", level: "beginner", priority: "medium" },
    { name: "Regulatory (ISO 13485 / FDA)", category: "technical", level: "beginner", priority: "high" },
    { name: "Clinical Collaboration", category: "communication", level: "beginner", priority: "medium" },
  ],
};

const toSkillMatrix = (skills: SkillEntry[]): SkillMatrix => ({
  technical: skills.filter((s) => s.category === "technical"),
  software: skills.filter((s) => s.category === "software"),
  management: skills.filter((s) => s.category === "management"),
  communication: skills.filter((s) => s.category === "communication"),
  leadership: skills.filter((s) => s.category === "leadership"),
});

export const buildSkillMatrix = (
  disciplineId: string | null,
  disciplineName: string | null
): SkillMatrix => {
  const id = disciplineId as MentorDisciplineId | null;
  if (id && DISCIPLINE_SKILLS[id]) {
    return toSkillMatrix(DISCIPLINE_SKILLS[id]);
  }
  return toSkillMatrix([
    { name: `${disciplineName ?? "Core"} Engineering Fundamentals`, category: "technical", level: "intermediate", priority: "high" },
    { name: "Industry Software Tools", category: "software", level: "beginner", priority: "medium" },
    { name: "Project Management Basics", category: "management", level: "beginner", priority: "medium" },
    { name: "Technical Communication", category: "communication", level: "intermediate", priority: "high" },
    { name: "Professional Ethics", category: "leadership", level: "beginner", priority: "medium" },
  ]);
};

export const analyzeSkillGaps = (matrix: SkillMatrix): string[] => {
  const allSkills = [
    ...matrix.technical,
    ...matrix.software,
    ...matrix.management,
    ...matrix.communication,
    ...matrix.leadership,
  ];
  return allSkills
    .filter((s) => s.level === "beginner" || s.priority === "high")
    .map((s) => `Develop ${s.name} (${s.category}) — current: ${s.level}, priority: ${s.priority}`);
};

export const formatSkillMatrix = (matrix: SkillMatrix): string => {
  const section = (title: string, skills: SkillEntry[]) =>
    skills.length > 0
      ? [`${title}:`, ...skills.map((s) => `  - ${s.name} [${s.level}, ${s.priority} priority]`)].join("\n")
      : "";

  return [
    "SKILL MATRIX",
    section("Technical Skills", matrix.technical),
    section("Software Skills", matrix.software),
    section("Management Skills", matrix.management),
    section("Communication Skills", matrix.communication),
    section("Leadership Skills", matrix.leadership),
  ]
    .filter(Boolean)
    .join("\n\n");
};

export const formatSkillGapReport = (gaps: string[]): string =>
  ["SKILL GAP ANALYSIS:", ...gaps.map((g) => `- ${g}`)].join("\n");

export const searchSkills = (query: string, disciplineId: string | null): SkillEntry[] => {
  const matrix = buildSkillMatrix(disciplineId, null);
  const all = [
    ...matrix.technical,
    ...matrix.software,
    ...matrix.management,
    ...matrix.communication,
    ...matrix.leadership,
  ];
  const q = query.toLowerCase();
  if (!q) return all;
  return all.filter((s) => s.name.toLowerCase().includes(q) || s.category.includes(q));
};
