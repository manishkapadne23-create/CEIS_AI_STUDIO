import { loadExpertiseDomains } from "./loadEdeConfig.js";
import type {
  EdDigitalEngineerProfile,
  EdExpertiseModel,
  EdProficiencyLevel,
  EdSkillDevelopment,
  EdWorkingStyle,
} from "./types.js";

const proficiencyScore: Record<EdProficiencyLevel, number> = {
  beginner: 1,
  intermediate: 2,
  advanced: 3,
  expert: 4,
};

const scoreToProficiency = (score: number): EdProficiencyLevel => {
  if (score >= 4) return "expert";
  if (score >= 3) return "advanced";
  if (score >= 2) return "intermediate";
  return "beginner";
};

export const estimateExpertiseFromActivity = (
  profile: EdDigitalEngineerProfile,
  workingStyle: EdWorkingStyle
): EdExpertiseModel => {
  const base = { ...profile.expertise };
  const domains = loadExpertiseDomains().domains;
  const experienceBoost =
    (profile.yearsOfExperience ?? 0) >= 10
      ? 1
      : (profile.yearsOfExperience ?? 0) >= 5
        ? 0.5
        : 0;

  const topicText = workingStyle.frequentlyAskedTopics.join(" ").toLowerCase();

  const domainSignals: Record<string, string[]> = {
    design: ["design", "structural", "pavement", "highway", "bridge"],
    construction: ["construction", "site", "execution", "method"],
    planning: ["planning", "schedule", "milestone", "critical path"],
    contracts: ["contract", "claim", "variation", "eot"],
    "qa-qc": ["qa", "qc", "inspection", "quality"],
    safety: ["safety", "hse", "hazard", "risk"],
    research: ["research", "innovation", "study", "analysis"],
    "project-controls": ["cost", "estimate", "boq", "progress", "controls"],
  };

  for (const domain of domains) {
    const signals = domainSignals[domain.id] ?? [];
    const matchCount = signals.filter((signal) => topicText.includes(signal)).length;
    const currentScore = proficiencyScore[base[domain.id] ?? "intermediate"];
    const adjusted = Math.min(4, currentScore + matchCount * 0.3 + experienceBoost);
    base[domain.id] = scoreToProficiency(adjusted);
  }

  return base;
};

export const analyzeSkillDevelopment = (
  profile: EdDigitalEngineerProfile,
  expertise: EdExpertiseModel
): EdSkillDevelopment => {
  const gaps = Object.entries(expertise)
    .filter(([, level]) => level === "beginner" || level === "intermediate")
    .map(([domain]) => `Improve proficiency in ${domain.replace("-", " ")}`);

  const discipline = profile.primaryDisciplineName ?? "Engineering";

  return {
    knowledgeGaps: gaps.slice(0, 5),
    recommendedCourses: [
      `Advanced ${discipline} Design`,
      `${discipline} Project Management`,
      "Engineering Standards and Compliance",
    ],
    suggestedCertifications: [
      "Professional Engineer (PE) / Chartered Engineer",
      `${discipline} specialization certification`,
      "Project Management Professional (PMP)",
    ],
    emergingTechnologies: [
      "BIM and digital twin",
      "AI-assisted engineering design",
      "Sustainable and green engineering",
    ],
    professionalDevelopmentGoals: [
      "Strengthen design and calculation skills",
      "Expand standards knowledge",
      "Develop project leadership capabilities",
    ],
  };
};
