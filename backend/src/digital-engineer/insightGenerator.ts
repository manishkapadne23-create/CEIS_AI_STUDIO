import { loadInsightTemplates } from "./loadEdeConfig.js";
import { analyzeExperienceSummary } from "./experienceAnalyzer.js";
import type {
  EdDigitalEngineerProfile,
  EdEngineeringInsight,
  EdExpertiseModel,
  EdSkillDevelopment,
  EdWorkingStyle,
} from "./types.js";

export const generateEngineeringInsights = (
  profile: EdDigitalEngineerProfile,
  workingStyle: EdWorkingStyle,
  expertise: EdExpertiseModel,
  skillDevelopment: EdSkillDevelopment
): EdEngineeringInsight[] => {
  const templates = loadInsightTemplates().insightTypes;
  const experience = analyzeExperienceSummary(profile);
  const discipline = profile.primaryDisciplineName ?? "Engineering";
  const now = new Date().toISOString();

  return templates.map((template) => {
    switch (template.id) {
      case "weekly-summary":
        return {
          type: "weekly-summary" as const,
          title: template.label,
          summary: `Weekly summary for ${discipline} — ${experience.summary}`,
          highlights: [
            `Top topics: ${workingStyle.frequentlyAskedTopics.slice(0, 3).join(", ") || "None yet"}`,
            `Standards used: ${workingStyle.frequentlyUsedStandards.slice(0, 3).join(", ") || "None yet"}`,
            `Agents used: ${workingStyle.preferredAgents.slice(0, 3).join(", ") || "None yet"}`,
          ],
          recommendations: skillDevelopment.professionalDevelopmentGoals.slice(0, 3),
          generatedAt: now,
        };
      case "monthly-learning":
        return {
          type: "monthly-learning" as const,
          title: template.label,
          summary: `Monthly learning report for ${discipline}.`,
          highlights: skillDevelopment.recommendedCourses,
          recommendations: skillDevelopment.suggestedCertifications,
          generatedAt: now,
        };
      case "skill-growth":
        return {
          type: "skill-growth" as const,
          title: template.label,
          summary: "Skill growth across engineering domains.",
          highlights: Object.entries(expertise).map(
            ([domain, level]) => `${domain}: ${level}`
          ),
          recommendations: skillDevelopment.knowledgeGaps,
          generatedAt: now,
        };
      default:
        return {
          type: "activity-report" as const,
          title: template.label,
          summary: `Engineering activity for the past ${template.horizonDays} days.`,
          highlights: [
            `Calculators: ${workingStyle.frequentlyUsedCalculators.length}`,
            `Templates: ${workingStyle.frequentlyUsedTemplates.length}`,
            `Reports: ${workingStyle.frequentlyUsedReports.length}`,
            `Workflows: ${workingStyle.preferredWorkflows.length}`,
          ],
          recommendations: [
            "Continue building your personal engineering library.",
            "Review knowledge gaps and schedule learning time.",
          ],
          generatedAt: now,
        };
    }
  });
};
