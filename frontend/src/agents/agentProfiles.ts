import disciplineRegistry from "../knowledge/config/disciplineRegistry.json";
import { getCalculatorsCatalogByDisciplineId } from "../config/calculators";
import { getStandardsCatalogByDisciplineId } from "../config/standards";
import { getProfessionalToolsRegistry } from "../knowledge/professional-tools/professionalToolsRegistry";
import { getWorkflowsForDiscipline } from "../workflows";
import { DEFAULT_DISCIPLINE_AGENT_CAPABILITIES } from "./agentCapabilities";
import type { EngineeringAgentProfile } from "./types";
import {
  DEFAULT_AGENT_MODULES,
  SUPPORTED_LLM_PROVIDERS,
} from "./types";

const DISCIPLINE_DESCRIPTIONS: Record<string, string> = {
  "civil-engineering":
    "Expert agent for structural, geotechnical, transportation, and infrastructure engineering.",
  "mechanical-engineering":
    "Expert agent for machine design, manufacturing, HVAC, and mechanical systems.",
  "electrical-engineering":
    "Expert agent for power systems, cabling, transformers, and electrical design.",
  "computer-engineering":
    "Expert agent for software, systems, databases, and AI/ML engineering.",
  "electronics-telecommunication-engineering":
    "Expert agent for circuits, RF, telecommunications, and embedded systems.",
  "chemical-engineering":
    "Expert agent for process design, plant engineering, and chemical safety.",
  "environmental-engineering":
    "Expert agent for EIA, water treatment, waste management, and sustainability.",
  "mining-engineering":
    "Expert agent for mine planning, blasting, ventilation, and mineral processing.",
  "marine-engineering":
    "Expert agent for ship design, offshore structures, and marine systems.",
  "aerospace-engineering":
    "Expert agent for aircraft design, propulsion, and aerospace systems.",
  "railway-engineering":
    "Expert agent for track, signalling, rolling stock, and railway infrastructure.",
  "industrial-engineering":
    "Expert agent for plant layout, optimization, and production systems.",
  "automation-robotics":
    "Expert agent for PLC, SCADA, robotics, and industrial automation.",
  "renewable-energy":
    "Expert agent for solar, wind, and clean energy systems.",
  "architecture-planning":
    "Expert agent for architectural design, urban planning, and building regulations.",
  "agricultural-engineering":
    "Expert agent for irrigation, farm machinery, and post-harvest systems.",
  "biomedical-engineering":
    "Expert agent for medical devices, hospital equipment, and healthcare technology.",
  "oil-gas-engineering":
    "Expert agent for pipelines, refineries, upstream/downstream, and HSE.",
};

const buildDisciplineAgentProfile = (
  disciplineId: string,
  disciplineName: string,
  personalityKey: string
): EngineeringAgentProfile => {
  const standards =
    getStandardsCatalogByDisciplineId(disciplineId)?.standards
      .slice(0, 8)
      .map((standard) => standard.codeNumber) ?? [];

  const calculators =
    getCalculatorsCatalogByDisciplineId(disciplineId)?.calculators
      .slice(0, 8)
      .map((calculator) => calculator.name) ?? [];

  const tools =
    getProfessionalToolsRegistry(disciplineId)?.categories
      .flatMap((category) => category.tools)
      .slice(0, 6)
      .map((tool) => tool.title) ?? [];

  const workflows = getWorkflowsForDiscipline(disciplineId, disciplineName)
    .slice(0, 6)
    .map((workflow) => workflow.title);

  return {
    id: `${disciplineId}-agent`,
    name: `${disciplineName} Agent`,
    description:
      DISCIPLINE_DESCRIPTIONS[disciplineId] ??
      `Specialized AI agent for ${disciplineName}.`,
    disciplineId,
    disciplineName,
    type: "discipline",
    capabilities: DEFAULT_DISCIPLINE_AGENT_CAPABILITIES,
    supportedModules: DEFAULT_AGENT_MODULES,
    supportedStandards: standards,
    supportedCalculators: calculators,
    supportedTools: tools,
    supportedDocuments: [
      "Engineering drawings",
      "Specifications",
      "Method statements",
      "Reports",
      "Templates",
    ],
    supportedWorkflows: workflows,
    status: "active",
    personalityKey,
    compatibleProviders: SUPPORTED_LLM_PROVIDERS,
    systemPromptAugmentation: `You are the ${disciplineName} Agent — a senior ${disciplineName.toLowerCase()} specialist within Sarathi AI.`,
  };
};

export const DISCIPLINE_AGENT_PROFILES: EngineeringAgentProfile[] =
  disciplineRegistry.disciplines.map((discipline) =>
    buildDisciplineAgentProfile(
      discipline.id,
      discipline.name,
      discipline.aiPersonalityKey
    )
  );

export const FUTURE_SPECIALIST_AGENT_PROFILES: EngineeringAgentProfile[] = [
  {
    id: "highway-design-agent",
    name: "Highway Design Agent",
    description: "Specialist for highway geometric design, pavement, and DPR.",
    disciplineId: "civil-engineering",
    disciplineName: "Civil Engineering",
    type: "specialist",
    capabilities: DEFAULT_DISCIPLINE_AGENT_CAPABILITIES,
    supportedModules: DEFAULT_AGENT_MODULES,
    supportedStandards: ["IRC", "MoRTH"],
    supportedCalculators: ["Pavement Design", "Sight Distance"],
    supportedTools: ["DPR Template", "BOQ Tool"],
    supportedDocuments: ["Highway drawings", "DPR chapters"],
    supportedWorkflows: ["Highway DPR Workflow", "Pavement Design Workflow"],
    status: "planned",
    personalityKey: "highway-design",
    compatibleProviders: SUPPORTED_LLM_PROVIDERS,
  },
  {
    id: "bridge-design-agent",
    name: "Bridge Design Agent",
    description: "Specialist for bridge structural design and IRC compliance.",
    disciplineId: "civil-engineering",
    disciplineName: "Civil Engineering",
    type: "specialist",
    capabilities: DEFAULT_DISCIPLINE_AGENT_CAPABILITIES,
    supportedModules: DEFAULT_AGENT_MODULES,
    supportedStandards: ["IRC 6", "IRC 21", "IRC 112"],
    supportedCalculators: ["Structural Design"],
    supportedTools: ["Bridge Design Report"],
    supportedDocuments: ["Bridge drawings", "Calculation sheets"],
    supportedWorkflows: ["Bridge Design Workflow"],
    status: "planned",
    personalityKey: "bridge-design",
    compatibleProviders: SUPPORTED_LLM_PROVIDERS,
  },
  {
    id: "traffic-engineering-agent",
    name: "Traffic Engineering Agent",
    description: "Specialist for traffic studies, intersections, and signage.",
    disciplineId: "civil-engineering",
    disciplineName: "Civil Engineering",
    type: "specialist",
    capabilities: DEFAULT_DISCIPLINE_AGENT_CAPABILITIES,
    supportedModules: DEFAULT_AGENT_MODULES,
    supportedStandards: ["IRC 67", "IRC 93"],
    supportedCalculators: ["Traffic Analysis"],
    supportedTools: ["Traffic Study Report"],
    supportedDocuments: ["Traffic surveys"],
    supportedWorkflows: [],
    status: "planned",
    personalityKey: "traffic-engineering",
    compatibleProviders: SUPPORTED_LLM_PROVIDERS,
  },
  {
    id: "structural-design-agent",
    name: "Structural Design Agent",
    description: "Specialist for RCC/steel structural design per IS codes.",
    disciplineId: "civil-engineering",
    disciplineName: "Civil Engineering",
    type: "specialist",
    capabilities: DEFAULT_DISCIPLINE_AGENT_CAPABILITIES,
    supportedModules: DEFAULT_AGENT_MODULES,
    supportedStandards: ["IS 456", "IS 800", "IS 1893"],
    supportedCalculators: ["RCC Design", "Steel Design"],
    supportedTools: ["Structural Report"],
    supportedDocuments: ["Structural drawings"],
    supportedWorkflows: ["Building Design Workflow"],
    status: "planned",
    personalityKey: "structural-design",
    compatibleProviders: SUPPORTED_LLM_PROVIDERS,
  },
  {
    id: "geotechnical-agent",
    name: "Geotechnical Agent",
    description: "Specialist for soil investigation, foundations, and slopes.",
    disciplineId: "civil-engineering",
    disciplineName: "Civil Engineering",
    type: "specialist",
    capabilities: DEFAULT_DISCIPLINE_AGENT_CAPABILITIES,
    supportedModules: DEFAULT_AGENT_MODULES,
    supportedStandards: ["IS 1892", "IS 2911"],
    supportedCalculators: ["Bearing Capacity", "Slope Stability"],
    supportedTools: ["Geotech Report"],
    supportedDocuments: ["Bore logs", "Lab reports"],
    supportedWorkflows: [],
    status: "planned",
    personalityKey: "geotechnical",
    compatibleProviders: SUPPORTED_LLM_PROVIDERS,
  },
  {
    id: "quantity-survey-agent",
    name: "Quantity Survey Agent",
    description: "Specialist for BOQ, estimation, and cost control.",
    disciplineId: "civil-engineering",
    disciplineName: "Civil Engineering",
    type: "specialist",
    capabilities: DEFAULT_DISCIPLINE_AGENT_CAPABILITIES,
    supportedModules: DEFAULT_AGENT_MODULES,
    supportedStandards: ["CPWD/MoRTH SOR"],
    supportedCalculators: ["Quantity Estimation"],
    supportedTools: ["BOQ Tool", "Rate Analysis"],
    supportedDocuments: ["BOQ schedules"],
    supportedWorkflows: ["BOQ Preparation Workflow"],
    status: "planned",
    personalityKey: "quantity-survey",
    compatibleProviders: SUPPORTED_LLM_PROVIDERS,
  },
  {
    id: "planning-agent",
    name: "Planning Agent",
    description: "Specialist for project planning, scheduling, and milestones.",
    disciplineId: "civil-engineering",
    disciplineName: "Civil Engineering",
    type: "specialist",
    capabilities: DEFAULT_DISCIPLINE_AGENT_CAPABILITIES,
    supportedModules: DEFAULT_AGENT_MODULES,
    supportedStandards: [],
    supportedCalculators: [],
    supportedTools: ["Planning Templates"],
    supportedDocuments: ["Schedules", "Progress reports"],
    supportedWorkflows: [],
    status: "planned",
    personalityKey: "planning",
    compatibleProviders: SUPPORTED_LLM_PROVIDERS,
  },
  {
    id: "contract-management-agent",
    name: "Contract Management Agent",
    description: "Specialist for contracts, clauses, and administration.",
    disciplineId: "civil-engineering",
    disciplineName: "Civil Engineering",
    type: "specialist",
    capabilities: DEFAULT_DISCIPLINE_AGENT_CAPABILITIES,
    supportedModules: DEFAULT_AGENT_MODULES,
    supportedStandards: ["FIDIC", "NEC", "Indian Contract Act"],
    supportedCalculators: [],
    supportedTools: ["Contract Templates"],
    supportedDocuments: ["Contract documents"],
    supportedWorkflows: ["Tender Preparation Workflow"],
    status: "planned",
    personalityKey: "contract-management",
    compatibleProviders: SUPPORTED_LLM_PROVIDERS,
  },
  {
    id: "claims-management-agent",
    name: "Claims Management Agent",
    description: "Specialist for extension of time, cost claims, and disputes.",
    disciplineId: "civil-engineering",
    disciplineName: "Civil Engineering",
    type: "specialist",
    capabilities: DEFAULT_DISCIPLINE_AGENT_CAPABILITIES,
    supportedModules: DEFAULT_AGENT_MODULES,
    supportedStandards: [],
    supportedCalculators: [],
    supportedTools: ["Claims Templates"],
    supportedDocuments: ["Claims dossiers"],
    supportedWorkflows: [],
    status: "planned",
    personalityKey: "claims-management",
    compatibleProviders: SUPPORTED_LLM_PROVIDERS,
  },
  {
    id: "tender-agent",
    name: "Tender Agent",
    description: "Specialist for tender preparation, evaluation, and queries.",
    disciplineId: "civil-engineering",
    disciplineName: "Civil Engineering",
    type: "specialist",
    capabilities: DEFAULT_DISCIPLINE_AGENT_CAPABILITIES,
    supportedModules: DEFAULT_AGENT_MODULES,
    supportedStandards: ["MoRTH", "CPWD"],
    supportedCalculators: [],
    supportedTools: ["Tender Templates"],
    supportedDocuments: ["Tender documents"],
    supportedWorkflows: ["Tender Preparation Workflow"],
    status: "planned",
    personalityKey: "tender",
    compatibleProviders: SUPPORTED_LLM_PROVIDERS,
  },
  {
    id: "qa-qc-agent",
    name: "QA/QC Agent",
    description: "Specialist for quality assurance and quality control.",
    disciplineId: "civil-engineering",
    disciplineName: "Civil Engineering",
    type: "specialist",
    capabilities: DEFAULT_DISCIPLINE_AGENT_CAPABILITIES,
    supportedModules: DEFAULT_AGENT_MODULES,
    supportedStandards: ["IS codes", "Project QAP"],
    supportedCalculators: [],
    supportedTools: ["QA Checklists", "ITP Templates"],
    supportedDocuments: ["Test reports"],
    supportedWorkflows: ["QA/QC Workflow"],
    status: "planned",
    personalityKey: "qa-qc",
    compatibleProviders: SUPPORTED_LLM_PROVIDERS,
  },
  {
    id: "safety-agent",
    name: "Safety Agent",
    description: "Specialist for construction safety and risk management.",
    disciplineId: "civil-engineering",
    disciplineName: "Civil Engineering",
    type: "specialist",
    capabilities: DEFAULT_DISCIPLINE_AGENT_CAPABILITIES,
    supportedModules: DEFAULT_AGENT_MODULES,
    supportedStandards: ["OSHA", "Indian Factory Act"],
    supportedCalculators: [],
    supportedTools: ["Safety Checklists"],
    supportedDocuments: ["Safety plans"],
    supportedWorkflows: [],
    status: "planned",
    personalityKey: "safety",
    compatibleProviders: SUPPORTED_LLM_PROVIDERS,
  },
  {
    id: "environmental-compliance-agent",
    name: "Environmental Compliance Agent",
    description: "Specialist for EIA, EMP, and environmental clearances.",
    disciplineId: "environmental-engineering",
    disciplineName: "Environmental Engineering",
    type: "specialist",
    capabilities: DEFAULT_DISCIPLINE_AGENT_CAPABILITIES,
    supportedModules: DEFAULT_AGENT_MODULES,
    supportedStandards: ["MoEFCC", "CPCB"],
    supportedCalculators: [],
    supportedTools: ["EIA Templates"],
    supportedDocuments: ["EIA reports"],
    supportedWorkflows: ["EIA Workflow"],
    status: "planned",
    personalityKey: "environmental-compliance",
    compatibleProviders: SUPPORTED_LLM_PROVIDERS,
  },
  {
    id: "site-engineer-agent",
    name: "Site Engineer Agent",
    description: "Specialist for site execution, diaries, and field records.",
    disciplineId: "civil-engineering",
    disciplineName: "Civil Engineering",
    type: "specialist",
    capabilities: DEFAULT_DISCIPLINE_AGENT_CAPABILITIES,
    supportedModules: DEFAULT_AGENT_MODULES,
    supportedStandards: [],
    supportedCalculators: [],
    supportedTools: ["Site Diary", "Inspection Formats"],
    supportedDocuments: ["Site records"],
    supportedWorkflows: ["Site Execution Workflow"],
    status: "planned",
    personalityKey: "site-engineer",
    compatibleProviders: SUPPORTED_LLM_PROVIDERS,
  },
  {
    id: "pmc-agent",
    name: "PMC Agent",
    description: "Specialist for project management consultancy oversight.",
    disciplineId: "civil-engineering",
    disciplineName: "Civil Engineering",
    type: "specialist",
    capabilities: DEFAULT_DISCIPLINE_AGENT_CAPABILITIES,
    supportedModules: DEFAULT_AGENT_MODULES,
    supportedStandards: [],
    supportedCalculators: [],
    supportedTools: ["PMC Reports"],
    supportedDocuments: ["Progress reports"],
    supportedWorkflows: [],
    status: "planned",
    personalityKey: "pmc",
    compatibleProviders: SUPPORTED_LLM_PROVIDERS,
  },
  {
    id: "independent-engineer-agent",
    name: "Independent Engineer Agent",
    description: "Specialist for lender/authority independent engineering review.",
    disciplineId: "civil-engineering",
    disciplineName: "Civil Engineering",
    type: "specialist",
    capabilities: DEFAULT_DISCIPLINE_AGENT_CAPABILITIES,
    supportedModules: DEFAULT_AGENT_MODULES,
    supportedStandards: [],
    supportedCalculators: [],
    supportedTools: ["IE Review Templates"],
    supportedDocuments: ["Review reports"],
    supportedWorkflows: [],
    status: "planned",
    personalityKey: "independent-engineer",
    compatibleProviders: SUPPORTED_LLM_PROVIDERS,
  },
  {
    id: "arbitration-agent",
    name: "Arbitration Agent",
    description: "Specialist for dispute analysis and arbitration support.",
    disciplineId: "civil-engineering",
    disciplineName: "Civil Engineering",
    type: "specialist",
    capabilities: DEFAULT_DISCIPLINE_AGENT_CAPABILITIES,
    supportedModules: DEFAULT_AGENT_MODULES,
    supportedStandards: ["Arbitration Act"],
    supportedCalculators: [],
    supportedTools: ["Arbitration Templates"],
    supportedDocuments: ["Claims evidence"],
    supportedWorkflows: [],
    status: "planned",
    personalityKey: "arbitration",
    compatibleProviders: SUPPORTED_LLM_PROVIDERS,
  },
];

export const rebuildDisciplineAgentProfile = (
  disciplineId: string
): EngineeringAgentProfile | null => {
  const discipline = disciplineRegistry.disciplines.find(
    (entry) => entry.id === disciplineId
  );
  if (!discipline) return null;
  return buildDisciplineAgentProfile(
    discipline.id,
    discipline.name,
    discipline.aiPersonalityKey
  );
};
