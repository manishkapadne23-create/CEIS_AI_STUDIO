import type { InterviewPrep } from "./types";

const TECHNICAL_QUESTIONS: Record<string, string[]> = {
  structural: [
    "Explain the difference between working stress and limit state design.",
    "How do you determine the effective length of a column?",
    "What factors influence the choice between RCC and steel structure?",
    "Describe the load combinations per IS 875 / ASCE 7.",
    "How would you check deflection limits for a floor slab?",
  ],
  mechanical: [
    "Explain the first and second laws of thermodynamics in engineering context.",
    "What is the difference between stress and strain? Draw a stress-strain curve for ductile material.",
    "How do you select a bearing for a rotating shaft?",
    "Describe types of heat exchangers and their applications.",
    "What is factor of safety and how is it determined?",
  ],
  electrical: [
    "Explain per-unit system and its advantages in power system analysis.",
    "What is the difference between earthing and grounding?",
    "How does a transformer tap changer work?",
    "Describe protection coordination for a distribution feeder.",
    "What are harmonics and how do they affect power quality?",
  ],
  software: [
    "Explain time and space complexity with an example.",
    "What is the difference between REST and GraphQL?",
    "Describe how you would design a scalable URL shortener.",
    "What are microservices trade-offs vs monolithic architecture?",
    "How do you handle database indexing for query optimization?",
  ],
  general: [
    "Walk me through a challenging engineering problem you solved.",
    "How do you ensure quality in your engineering deliverables?",
    "Explain a technical concept to a non-technical stakeholder.",
    "What engineering standards do you follow in your discipline?",
    "How do you approach troubleshooting an unexpected failure?",
  ],
};

const HR_QUESTIONS = [
  "Tell me about yourself and your engineering background.",
  "Why do you want to join this organization?",
  "Describe a time you worked in a team under pressure.",
  "How do you handle conflicting priorities on a project?",
  "What is your greatest professional achievement?",
  "Describe a situation where you made a mistake. How did you handle it?",
  "Where do you see yourself in 5 years?",
  "How do you stay updated with industry developments?",
  "Why should we hire you over other candidates?",
  "What are your salary expectations and notice period?",
];

const SCENARIO_QUESTIONS = [
  "A project is behind schedule by 3 weeks. Client demands delivery. What do you do?",
  "You discover a design error during construction. How do you respond?",
  "Two senior engineers disagree on a technical approach. How do you facilitate resolution?",
  "A junior team member consistently misses deadlines. How do you address this?",
  "You are asked to cut costs by 15% without compromising safety. What is your approach?",
];

const CASE_STUDIES = [
  "Design a water supply scheme for a township of 50,000 population.",
  "Optimize a manufacturing line with 20% bottleneck at one station.",
  "Propose a solar microgrid for a remote healthcare facility.",
  "Evaluate retrofit options for an aging bridge with traffic restrictions.",
  "Plan a phased migration from on-premise to cloud for an engineering firm.",
];

const resolveTopicCategory = (topic: string): string => {
  const t = topic.toLowerCase();
  if (/structural|civil|concrete|steel|bridge/i.test(t)) return "structural";
  if (/mechanical|thermal|machine|hvac/i.test(t)) return "mechanical";
  if (/electrical|power|grid|motor/i.test(t)) return "electrical";
  if (/software|computer|cloud|data|programming/i.test(t)) return "software";
  return "general";
};

export const buildInterviewPrep = (
  topic: string,
  disciplineName: string | null
): InterviewPrep => {
  const category = resolveTopicCategory(topic || (disciplineName ?? ""));
  const technicalQuestions = TECHNICAL_QUESTIONS[category] ?? TECHNICAL_QUESTIONS.general;

  return {
    topic: topic || disciplineName || "General Engineering",
    technicalQuestions,
    hrQuestions: HR_QUESTIONS,
    scenarioQuestions: SCENARIO_QUESTIONS,
    caseStudies: CASE_STUDIES.slice(0, 3),
    discussionTips: [
      "Structure answers using STAR method (Situation, Task, Action, Result)",
      "Show your engineering reasoning process, not just the final answer",
      "Reference relevant codes, standards, or best practices where applicable",
      "Ask clarifying questions before diving into complex problems",
      "Demonstrate safety-first mindset in all scenario responses",
      "Prepare 2-3 questions to ask the interviewer about team and projects",
    ],
  };
};

export const formatInterviewPrep = (prep: InterviewPrep): string =>
  [
    `INTERVIEW PREPARATION — ${prep.topic}`,
    "",
    "Technical Questions:",
    ...prep.technicalQuestions.map((q, i) => `${i + 1}. ${q}`),
    "",
    "HR Questions:",
    ...prep.hrQuestions.slice(0, 6).map((q, i) => `${i + 1}. ${q}`),
    "",
    "Scenario-Based Questions:",
    ...prep.scenarioQuestions.map((q, i) => `${i + 1}. ${q}`),
    "",
    "Case Studies for Discussion:",
    ...prep.caseStudies.map((c, i) => `${i + 1}. ${c}`),
    "",
    "Discussion Tips:",
    ...prep.discussionTips.map((t) => `- ${t}`),
  ].join("\n");

export const formatMockInterview = (prep: InterviewPrep): string =>
  [
    "MOCK INTERVIEW SESSION",
    `Topic: ${prep.topic}`,
    "",
    "Round 1 — Technical (15 min):",
    ...prep.technicalQuestions.slice(0, 3).map((q, i) => `Q${i + 1}: ${q}`),
    "",
    "Round 2 — HR & Behavioral (10 min):",
    ...prep.hrQuestions.slice(0, 3).map((q, i) => `Q${i + 1}: ${q}`),
    "",
    "Round 3 — Scenario & Case (15 min):",
    `Scenario: ${prep.scenarioQuestions[0]}`,
    `Case Study: ${prep.caseStudies[0]}`,
    "",
    "Self-Evaluation Checklist:",
    "- Did I explain assumptions clearly?",
    "- Did I reference safety and standards?",
    "- Was my communication structured and concise?",
    "- Did I ask thoughtful questions at the end?",
  ].join("\n");

export const formatTechnicalQuestions = (topic: string, disciplineName: string | null): string => {
  const prep = buildInterviewPrep(topic, disciplineName);
  return [
    `TECHNICAL INTERVIEW QUESTIONS — ${prep.topic}`,
    ...prep.technicalQuestions.map((q, i) => `${i + 1}. ${q}`),
  ].join("\n");
};

export const formatHrQuestions = (): string =>
  ["HR INTERVIEW QUESTIONS:", ...HR_QUESTIONS.map((q, i) => `${i + 1}. ${q}`)].join("\n");
