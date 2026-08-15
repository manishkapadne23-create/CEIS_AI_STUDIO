import type { InnovationAssessment } from "./types";

export const assessInnovation = (
  idea: string,
  disciplineName: string | null
): InnovationAssessment => {
  const text = idea.toLowerCase();
  let feasibility: InnovationAssessment["feasibility"] = "medium";
  let trl = "TRL 3-4 (proof of concept)";

  if (/pilot|field\s+test|deployed|commercial/i.test(text)) {
    feasibility = "high";
    trl = "TRL 6-7 (prototype demonstrated)";
  } else if (/concept|theoretical|novel\s+idea/i.test(text)) {
    feasibility = "low";
    trl = "TRL 1-2 (basic principles)";
  }

  return {
    idea,
    feasibility,
    trl,
    engineeringApplications: [
      `${disciplineName ?? "Engineering"} infrastructure projects`,
      "Industrial and manufacturing applications",
      "Research and academic demonstration projects",
      "Government innovation and startup programmes",
    ],
    comparisonNotes: [
      "Compare against state-of-the-art published solutions",
      "Assess cost-benefit vs incumbent technology",
      "Evaluate regulatory and standards compliance pathway",
    ],
    validationSteps: [
      "Define problem statement and success metrics",
      "Conduct literature and patent landscape review",
      "Develop proof-of-concept (lab or simulation)",
      "Seek expert/peer feedback",
      "Plan pilot demonstration with measurable KPIs",
    ],
  };
};

export const generateInnovationIdeas = (
  topic: string,
  disciplineName: string | null
): string[] => [
  `AI-assisted ${topic} monitoring and prediction`,
  `Sustainable materials approach for ${topic}`,
  `Digital twin framework for ${topic} in ${disciplineName ?? "engineering"}`,
  `Low-cost sensor integration for ${topic}`,
  `Automated quality assessment for ${topic}`,
];

export const formatInnovationAssessment = (assessment: InnovationAssessment): string =>
  [
    `INNOVATION: ${assessment.idea}`,
    `Feasibility: ${assessment.feasibility.toUpperCase()}`,
    `Technology Readiness: ${assessment.trl}`,
    "",
    "Engineering Applications:",
    ...assessment.engineeringApplications.map((a) => `- ${a}`),
    "",
    "Validation Steps:",
    ...assessment.validationSteps.map((s, i) => `${i + 1}. ${s}`),
  ].join("\n");

export const suggestMethodology = (topic: string): string[] => {
  const text = topic.toLowerCase();
  if (/simulation|model|cfd|fem/i.test(text)) {
    return ["Literature review", "Model development", "Validation against published data", "Parametric study", "Sensitivity analysis"];
  }
  if (/experiment|lab|test/i.test(text)) {
    return ["Literature review", "Experimental design", "Material preparation", "Testing protocol", "Statistical analysis"];
  }
  return ["Literature review", "Problem formulation", "Data collection", "Analysis (qualitative/quantitative)", "Conclusions and recommendations"];
};
