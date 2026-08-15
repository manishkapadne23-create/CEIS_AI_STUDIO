import type { CareerStage } from "./types";

export const CAREER_STAGES: { id: CareerStage; label: string; description: string }[] = [
  { id: "student", label: "Student", description: "Building foundational engineering knowledge" },
  { id: "graduate", label: "Graduate / Fresher", description: "Entering the professional workforce" },
  { id: "junior", label: "Junior Engineer", description: "1–3 years of hands-on experience" },
  { id: "mid-level", label: "Mid-Level Engineer", description: "3–8 years with growing responsibility" },
  { id: "senior", label: "Senior Engineer", description: "Technical authority and mentoring others" },
  { id: "leadership", label: "Leadership / Management", description: "Leading teams, projects, or organizations" },
];

export const suggestCareerGoals = (
  disciplineName: string | null,
  stage: CareerStage
): string[] => {
  const discipline = disciplineName ?? "engineering";
  const base: Record<CareerStage, string[]> = {
    student: [
      `Master core ${discipline} fundamentals`,
      "Complete internships or industry projects",
      "Build a portfolio of academic and practical work",
      "Develop communication and teamwork skills",
    ],
    graduate: [
      `Secure entry-level role in ${discipline}`,
      "Obtain relevant software and safety certifications",
      "Learn industry standards and codes",
      "Find a mentor and build professional network",
    ],
    junior: [
      "Take ownership of design or analysis tasks",
      "Pursue professional membership (e.g. IEI, ASCE, IEEE)",
      "Improve technical writing and reporting",
      "Prepare for technical certification exams",
    ],
    "mid-level": [
      "Lead small to medium engineering projects",
      "Develop specialization in a niche area",
      "Mentor junior engineers",
      "Pursue PMP, PE, or equivalent credentials",
    ],
    senior: [
      "Drive technical decisions and innovation",
      "Contribute to standards, papers, or patents",
      "Build cross-functional leadership skills",
      "Shape organizational engineering strategy",
    ],
    leadership: [
      "Lead engineering departments or business units",
      "Drive digital transformation and R&D strategy",
      "Represent organization in industry forums",
      "Develop next-generation engineering leaders",
    ],
  };
  return base[stage];
};

export const getIndustryTrends = (disciplineName: string | null): string[] => {
  const d = (disciplineName ?? "engineering").toLowerCase();
  const universal = [
    "AI and digital twins transforming engineering workflows",
    "Sustainability and ESG driving design decisions",
    "Remote collaboration and cloud-based engineering tools",
    "Interdisciplinary skills increasingly valued",
  ];
  if (/civil|structural|architecture/i.test(d)) {
    return [
      ...universal,
      "BIM Level 3 and digital construction adoption",
      "Green building certifications (LEED, GRIHA)",
      "Prefabrication and modular construction growth",
      "Smart infrastructure and IoT-enabled assets",
    ];
  }
  if (/mechanical|aerospace|industrial/i.test(d)) {
    return [
      ...universal,
      "Additive manufacturing for production parts",
      "Predictive maintenance and condition monitoring",
      "Lightweight materials and composites",
      "Industry 4.0 and smart factory integration",
    ];
  }
  if (/electrical|electronics|computer|automation|renewable/i.test(d)) {
    return [
      ...universal,
      "Grid modernization and energy storage",
      "Edge computing and embedded AI",
      "Cybersecurity for OT/ICS systems",
      "EV infrastructure and power electronics",
    ];
  }
  return [
    ...universal,
    "Data-driven engineering decision making",
    "Regulatory evolution and compliance automation",
    "Global mobility and remote engineering teams",
    "Continuous learning as a career requirement",
  ];
};

export const getProfessionalDevelopment = (stage: CareerStage): string[] => {
  const items: Record<CareerStage, string[]> = {
    student: [
      "Join student chapters of professional bodies",
      "Participate in hackathons, competitions, and conferences",
      "Practice technical presentations",
      "Learn engineering ethics and professional conduct",
    ],
    graduate: [
      "Attend onboarding and safety training diligently",
      "Seek feedback from supervisors regularly",
      "Document lessons learned from each project",
      "Build LinkedIn and professional network presence",
    ],
    junior: [
      "Volunteer for cross-disciplinary project exposure",
      "Take short courses on emerging tools",
      "Present at team knowledge-sharing sessions",
      "Study engineering economics and project basics",
    ],
    "mid-level": [
      "Lead technical workshops or training sessions",
      "Pursue leadership and communication courses",
      "Engage in professional society committees",
      "Develop negotiation and client management skills",
    ],
    senior: [
      "Coach and formally mentor junior staff",
      "Publish technical articles or white papers",
      "Speak at industry conferences",
      "Contribute to organizational knowledge management",
    ],
    leadership: [
      "Executive education in strategy and finance",
      "Board-level governance and risk management",
      "Champion diversity and inclusion in engineering",
      "Drive organizational learning culture",
    ],
  };
  return items[stage];
};

export const getTechnologyRoadmap = (disciplineName: string | null): string[] => {
  const d = disciplineName ?? "engineering";
  return [
    `Phase 1 (0–6 months): Strengthen core ${d} tools and standards`,
    "Phase 2 (6–12 months): Adopt simulation, BIM, or domain-specific software",
    "Phase 3 (1–2 years): Integrate data analytics and automation into workflows",
    "Phase 4 (2–3 years): Lead adoption of AI-assisted design and digital twins",
    "Phase 5 (3+ years): Shape technology strategy and mentor others on emerging tools",
  ];
};

export const formatCareerGuidance = (
  disciplineName: string | null,
  stage: CareerStage,
  focusArea: string
): string =>
  [
    `CAREER GUIDANCE — ${disciplineName ?? "Engineering"} (${CAREER_STAGES.find((s) => s.id === stage)?.label ?? stage})`,
    `Focus: ${focusArea}`,
    "",
    "Recommended Goals:",
    ...suggestCareerGoals(disciplineName, stage).map((g) => `- ${g}`),
    "",
    "Industry Trends:",
    ...getIndustryTrends(disciplineName).map((t) => `- ${t}`),
    "",
    "Professional Development:",
    ...getProfessionalDevelopment(stage).map((p) => `- ${p}`),
    "",
    "Technology Roadmap:",
    ...getTechnologyRoadmap(disciplineName).map((t) => `- ${t}`),
  ].join("\n");

export const resolveCareerStage = (message: string): CareerStage => {
  if (/student|undergrad|college/i.test(message)) return "student";
  if (/fresher|graduate|entry/i.test(message)) return "graduate";
  if (/junior|0-2\s*years|1-3\s*years/i.test(message)) return "junior";
  if (/mid|3-8|5\s*years/i.test(message)) return "mid-level";
  if (/senior|principal|8\+/i.test(message)) return "senior";
  if (/leadership|manager|director|head/i.test(message)) return "leadership";
  return "junior";
};

export const generateCareerReport = (
  disciplineName: string | null,
  stage: CareerStage,
  focusArea: string,
  skillGaps: string[]
): string =>
  [
    `CAREER REPORT — ${disciplineName ?? "Engineering"}`,
    `Stage: ${stage} | Focus: ${focusArea}`,
    `Generated: ${new Date().toLocaleDateString()}`,
    "",
    "Executive Summary:",
    `This report outlines career development priorities for a ${stage} ${disciplineName ?? "engineering"} professional focused on ${focusArea}.`,
    "",
    "Career Goals:",
    ...suggestCareerGoals(disciplineName, stage).map((g) => `- ${g}`),
    "",
    "Skill Gaps to Address:",
    ...(skillGaps.length > 0 ? skillGaps.map((g) => `- ${g}`) : ["- No critical gaps identified — focus on advancement"]),
    "",
    "Industry Trends:",
    ...getIndustryTrends(disciplineName).slice(0, 5).map((t) => `- ${t}`),
    "",
    "Technology Roadmap:",
    ...getTechnologyRoadmap(disciplineName).map((t) => `- ${t}`),
    "",
    "Professional Development Actions:",
    ...getProfessionalDevelopment(stage).map((p) => `- ${p}`),
  ].join("\n");

export const generateProfessionalDevelopmentReport = (
  disciplineName: string | null,
  stage: CareerStage
): string =>
  [
    "PROFESSIONAL DEVELOPMENT REPORT",
    `Discipline: ${disciplineName ?? "Engineering"} | Stage: ${stage}`,
    "",
    formatCareerGuidance(disciplineName, stage, "Professional growth"),
    "",
    "Ethics & Communication Focus:",
    "- Uphold engineering code of ethics in all decisions",
    "- Practice clear technical writing for reports and specifications",
    "- Develop presentation skills for stakeholder communication",
    "- Build active listening for client and team interactions",
    "",
    "Leadership Development:",
    "- Volunteer to lead small initiatives or task forces",
    "- Practice constructive feedback and conflict resolution",
    "- Study decision-making frameworks for engineering leaders",
  ].join("\n");
