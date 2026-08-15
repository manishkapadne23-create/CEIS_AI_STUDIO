import { getAgentById } from "./agentRegistry.js";
import type {
  EmaceAgentOutput,
  EmaceCollaborationInput,
  EmaceRequestAnalysis,
} from "./types.js";

const buildAgentObservations = (
  agentId: string,
  analysis: EmaceRequestAnalysis,
  input: EmaceCollaborationInput
): string[] => {
  const topic = analysis.topic ?? "the engineering request";
  const discipline = analysis.disciplineName ?? "engineering";
  const agent = getAgentById(agentId);

  const observationsByAgent: Record<string, string[]> = {
    "engineering-expert": [
      `Request analyzed for ${discipline} context.`,
      `Primary focus: ${topic}.`,
      `Multi-disciplinary review recommended for comprehensive guidance.`,
    ],
    "standards-expert": [
      `Applicable standards must be identified for ${topic}.`,
      `Code compliance review required for ${discipline} design.`,
      `Verify latest revisions of IRC, IS, MoRTH, and project-specific specifications.`,
    ],
    "design-expert": [
      `Design parameters and methodology need definition for ${topic}.`,
      `Consider alignment, cross-section, drainage, and structural elements as applicable.`,
      `Design assumptions must be documented before calculations.`,
    ],
    "calculation-expert": [
      `Engineering calculations required to validate design for ${topic}.`,
      `Load combinations, material properties, and safety factors must be established.`,
      `Calculation sheets should reference applicable code clauses.`,
    ],
    "qa-qc-expert": [
      `QA/QC plan required for design and construction phases.`,
      `Inspection and Test Plans (ITP) should cover critical activities.`,
      `Material testing and workmanship verification needed.`,
    ],
    "safety-expert": [
      `HSE hazards must be identified for ${topic}.`,
      `Traffic management, worker safety, and environmental protection required.`,
      `Safety plan and PPE requirements to be defined.`,
    ],
    "construction-expert": [
      `Constructability review needed for proposed design.`,
      `Method statements and equipment requirements to be defined.`,
      `Site constraints and staging plans should be evaluated.`,
    ],
    "estimation-expert": [
      `Preliminary cost estimate and BOQ preparation recommended.`,
      `Rate analysis should align with applicable SOR/DSR.`,
      `Contingency and escalation factors to be considered.`,
    ],
    "tender-expert": [
      `Tender documentation requirements to be reviewed.`,
      `Eligibility criteria and evaluation methodology need definition.`,
    ],
    "contract-expert": [
      `Contract conditions and risk allocation to be reviewed.`,
      `Variation and claims procedures should be clarified.`,
    ],
    "planning-expert": [
      `Project schedule and milestones need definition.`,
      `Critical path activities and resource loading to be planned.`,
    ],
    "risk-expert": [
      `Engineering and project risks identified for ${topic}.`,
      `Risk register with mitigation measures recommended.`,
    ],
    "research-expert": [
      `Research-backed best practices applicable to ${topic}.`,
      `Innovation opportunities and case studies may inform design.`,
    ],
    "learning-expert": [
      `Relevant learning resources available for ${discipline}.`,
      `Professional development paths suggested for specialization.`,
    ],
    "document-expert": [
      `Drawing, specification, and report deliverables to be defined.`,
      `Document control and submission requirements need clarification.`,
    ],
  };

  return (
    observationsByAgent[agentId] ?? [
      `${agent?.name ?? agentId} reviewed: ${input.userMessage.slice(0, 100)}.`,
    ]
  );
};

const buildAgentRecommendations = (
  agentId: string,
  analysis: EmaceRequestAnalysis
): string[] => {
  const topic = analysis.topic ?? "the project";

  const recommendationsByAgent: Record<string, string[]> = {
    "engineering-expert": [
      `Conduct multidisciplinary review for ${topic}.`,
      `Define project scope, constraints, and design criteria.`,
    ],
    "standards-expert": [
      "Prepare applicable standards matrix with clause references.",
      "Verify code amendments and local authority requirements.",
    ],
    "design-expert": [
      `Develop preliminary design for ${topic}.`,
      "Document design assumptions and basis of design.",
    ],
    "calculation-expert": [
      "Perform design calculations with code-compliant safety factors.",
      "Prepare calculation sheets for independent review.",
    ],
    "qa-qc-expert": [
      "Develop Quality Assurance Plan (QAP).",
      "Define hold points and inspection checklists.",
    ],
    "safety-expert": [
      "Prepare Construction Safety Plan.",
      "Conduct hazard identification and risk assessment (HIRA).",
    ],
    "construction-expert": [
      "Prepare method statements for critical activities.",
      "Plan site logistics and temporary works.",
    ],
    "estimation-expert": [
      "Prepare preliminary BOQ and cost estimate.",
      "Align rates with applicable schedule of rates.",
    ],
    "planning-expert": [
      "Develop master project schedule with milestones.",
      "Identify critical path and float management strategy.",
    ],
    "risk-expert": [
      "Create project risk register with mitigation actions.",
      "Schedule periodic risk review meetings.",
    ],
    "document-expert": [
      "Define drawing list and document submission schedule.",
      "Establish document numbering and revision control.",
    ],
  };

  return (
    recommendationsByAgent[agentId] ?? [
      `Provide specialized guidance for ${topic}.`,
    ]
  );
};

const buildAgentWarnings = (agentId: string, analysis: EmaceRequestAnalysis): string[] => {
  const warnings: string[] = [];

  if (agentId === "safety-expert") {
    warnings.push("Construction and traffic safety hazards require proactive mitigation.");
  }
  if (agentId === "standards-expert" && !analysis.disciplineId) {
    warnings.push("Discipline not confirmed — standards selection may be incomplete.");
  }
  if (agentId === "calculation-expert") {
    warnings.push("Calculations must use verified input data and approved code provisions.");
  }
  if (agentId === "risk-expert") {
    warnings.push("Unmitigated risks may impact schedule, cost, and safety.");
  }

  return warnings;
};

const buildAgentReferences = (agentId: string, analysis: EmaceRequestAnalysis): string[] => {
  const refsByAgent: Record<string, string[]> = {
    "standards-expert": ["IRC codes", "IS codes", "MoRTH guidelines", "Project specifications"],
    "design-expert": ["Design manuals", "Geometric design standards", "Best practice guides"],
    "calculation-expert": ["Code calculation provisions", "Design handbooks"],
    "safety-expert": ["OSHA guidelines", "Indian Factory Act", "Site safety manuals"],
    "estimation-expert": ["MoRTH SOR", "CPWD DSR", "Project rate schedules"],
  };

  const disciplineRef = analysis.disciplineName
    ? [`${analysis.disciplineName} practice standards`]
    : [];

  return [...(refsByAgent[agentId] ?? []), ...disciplineRef].slice(0, 5);
};

export const executeAgent = (
  agentId: string,
  analysis: EmaceRequestAnalysis,
  input: EmaceCollaborationInput,
  executionOrder: number
): EmaceAgentOutput => {
  const agent = getAgentById(agentId);

  if (!agent) {
    return {
      agentId,
      agentName: agentId,
      role: "specialist",
      status: "unavailable",
      observations: [],
      recommendations: [],
      warnings: [`Agent ${agentId} is not registered.`],
      references: [],
      confidence: 0,
      executionOrder,
    };
  }

  return {
    agentId,
    agentName: agent.name,
    role: agent.role,
    status: "executed",
    observations: buildAgentObservations(agentId, analysis, input),
    recommendations: buildAgentRecommendations(agentId, analysis),
    warnings: buildAgentWarnings(agentId, analysis),
    references: buildAgentReferences(agentId, analysis),
    confidence: agent.role === "lead" ? 0.92 : 0.85,
    executionOrder,
  };
};

export const executeAgentsSequentially = (
  agentIds: string[],
  analysis: EmaceRequestAnalysis,
  input: EmaceCollaborationInput
): EmaceAgentOutput[] =>
  agentIds.map((agentId, index) =>
    executeAgent(agentId, analysis, input, index + 1)
  );
