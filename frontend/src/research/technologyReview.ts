import type { TechnologyReview } from "./types";

export const generateTechnologyReview = (
  technology: string,
  disciplineName: string | null
): TechnologyReview => {
  const tech = technology.trim();
  const discipline = disciplineName ?? "engineering";

  return {
    technology: tech,
    overview: `${tech} is an emerging area in ${discipline} with growing research and industrial interest. It addresses key challenges in efficiency, sustainability and digitalization.`,
    advantages: [
      "Improved performance and efficiency over conventional methods",
      "Potential for cost reduction at scale",
      "Alignment with sustainability and decarbonization goals",
      "Enables digital monitoring and data-driven optimization",
    ],
    limitations: [
      "Technology maturity varies — pilot-scale validation may be needed",
      "Initial capital investment can be high",
      "Standards and codes may not yet fully address the technology",
      "Skilled workforce and training requirements",
    ],
    applications: [
      `Infrastructure and construction (${discipline})`,
      "Industrial process optimization",
      "Research and academic projects",
      "Government and public sector projects",
    ],
    emergingTrends: [
      "Integration with AI and IoT for smart systems",
      "Sustainable and circular economy approaches",
      "Modular and prefabricated deployment",
      "Digital twin and simulation-driven design",
    ],
    researchOpportunities: [
      `Field validation of ${tech} in ${discipline} projects`,
      "Life-cycle cost and environmental impact studies",
      "Development of design guidelines and standards",
      "Comparative benchmarking with existing technologies",
    ],
    readinessLevel: "TRL 4-6 (lab to pilot demonstration — verify for specific application)",
  };
};

export const formatTechnologyReview = (review: TechnologyReview): string =>
  [
    `TECHNOLOGY REVIEW: ${review.technology}`,
    "",
    "Overview:",
    review.overview,
    "",
    "Advantages:",
    ...review.advantages.map((a) => `- ${a}`),
    "",
    "Limitations:",
    ...review.limitations.map((l) => `- ${l}`),
    "",
    "Applications:",
    ...review.applications.map((a) => `- ${a}`),
    "",
    "Emerging Trends:",
    ...review.emergingTrends.map((t) => `- ${t}`),
    "",
    "Research Opportunities:",
    ...review.researchOpportunities.map((r) => `- ${r}`),
    "",
    `Technology Readiness: ${review.readinessLevel}`,
  ].join("\n");

export const compareTechnologies = (techA: string, techB: string): string =>
  [
    `TECHNOLOGY COMPARISON: ${techA} vs ${techB}`,
    "",
    `| Criteria | ${techA} | ${techB} |`,
    "| Maturity | Assess TRL | Assess TRL |",
    "| Cost | Compare CAPEX/OPEX | Compare CAPEX/OPEX |",
    "| Performance | Define KPIs | Define KPIs |",
    "| Sustainability | LCA comparison | LCA comparison |",
    "| Standards | Code compliance | Code compliance |",
    "",
    "Recommendation: Define evaluation criteria weighted by project priorities before selection.",
  ].join("\n");
