import type {
  EngineeringProfessionalTool,
  EngineeringProfessionalToolsRegistry,
  ProfessionalToolCategoryKey,
  ProfessionalToolStatus,
} from "../../types/EngineeringProfessionalTool";
import { PROFESSIONAL_TOOL_CATEGORY_KEYS } from "../../types/EngineeringProfessionalTool";
import { buildProfessionalToolsRegistry } from "../../utils/buildProfessionalToolsRegistry";

const createCivilTool = (
  id: string,
  title: string,
  description: string,
  category: ProfessionalToolCategoryKey,
  status: ProfessionalToolStatus = "available",
  enabled = true,
  specializationId?: string
): EngineeringProfessionalTool => ({
  id,
  key: id,
  title,
  description,
  category,
  status,
  enabled,
  specializationId,
});

const civilProfessionalTools: EngineeringProfessionalTool[] = [
  createCivilTool(
    "flexible-pavement-calculator",
    "Flexible Pavement Calculator",
    "Pavement layer thickness design based on CBR and traffic loading per IRC:37.",
    PROFESSIONAL_TOOL_CATEGORY_KEYS.calculators,
    "available",
    true,
    "highway-engineering"
  ),
  createCivilTool(
    "superelevation-calculator",
    "Superelevation Calculator",
    "Computes superelevation rates and transition parameters for horizontal curves.",
    PROFESSIONAL_TOOL_CATEGORY_KEYS.calculators,
    "available",
    true,
    "highway-engineering"
  ),
  createCivilTool(
    "sight-distance-calculator",
    "Sight Distance Calculator",
    "Stopping, overtaking, and intersection sight distance checks per IRC geometric standards.",
    PROFESSIONAL_TOOL_CATEGORY_KEYS.calculators,
    "available",
    true,
    "highway-engineering"
  ),
  createCivilTool(
    "earthwork-volume-calculator",
    "Earthwork Volume Calculator",
    "Cut and fill volume estimation from cross-sections and mass haul analysis.",
    PROFESSIONAL_TOOL_CATEGORY_KEYS.calculators,
    "available",
    true,
    "highway-engineering"
  ),
  createCivilTool(
    "transition-length-calculator",
    "Transition Length Calculator",
    "Length of superelevation runoff and tangent transitions for highway alignments.",
    PROFESSIONAL_TOOL_CATEGORY_KEYS.calculators,
    "available",
    true,
    "highway-engineering"
  ),
  createCivilTool(
    "geometric-design-assistant",
    "Geometric Design Assistant",
    "Guided alignment design with IRC parameter checks for horizontal and vertical geometry.",
    PROFESSIONAL_TOOL_CATEGORY_KEYS.designAssistants,
    "beta",
    true,
    "highway-engineering"
  ),
  createCivilTool(
    "pavement-design-assistant",
    "Pavement Design Assistant",
    "Step-by-step flexible and rigid pavement design workflow with IRC:37 and IRC:58 references.",
    PROFESSIONAL_TOOL_CATEGORY_KEYS.designAssistants,
    "beta",
    true,
    "highway-engineering"
  ),
  createCivilTool(
    "drainage-design-assistant",
    "Drainage Design Assistant",
    "Side drain, culvert, and cross-drainage design support for highway corridors.",
    PROFESSIONAL_TOOL_CATEGORY_KEYS.designAssistants,
    "beta",
    true,
    "highway-engineering"
  ),
  createCivilTool(
    "alignment-review-assistant",
    "Alignment Review Assistant",
    "Reviews alignment parameters, superelevation, and sight distance compliance.",
    PROFESSIONAL_TOOL_CATEGORY_KEYS.designAssistants,
    "beta",
    true,
    "highway-engineering"
  ),
  createCivilTool(
    "boq-estimation-tool",
    "BOQ Estimation Tool",
    "Generates bill of quantities and rate analysis for highway works aligned with MORTH specifications.",
    PROFESSIONAL_TOOL_CATEGORY_KEYS.estimationTools,
    "beta",
    true,
    "highway-engineering"
  ),
  createCivilTool(
    "rate-analysis-tool",
    "Rate Analysis Tool",
    "Prepares item-wise rate analysis with material, labour, and equipment breakdowns.",
    PROFESSIONAL_TOOL_CATEGORY_KEYS.estimationTools,
    "beta",
    true,
    "highway-engineering"
  ),
  createCivilTool(
    "project-cost-estimator",
    "Project Cost Estimator",
    "High-level project cost estimation for highway schemes including contingencies.",
    PROFESSIONAL_TOOL_CATEGORY_KEYS.estimationTools,
    "coming-soon",
    false,
    "highway-engineering"
  ),
  createCivilTool(
    "highway-dpr-template",
    "Highway DPR Template",
    "Structured template for detailed project reports on national and state highway schemes.",
    PROFESSIONAL_TOOL_CATEGORY_KEYS.templates,
    "available",
    true,
    "highway-engineering"
  ),
  createCivilTool(
    "geometric-design-report-template",
    "Geometric Design Report Template",
    "Alignment design documentation with IRC parameter tables and design justification.",
    PROFESSIONAL_TOOL_CATEGORY_KEYS.templates,
    "available",
    true,
    "highway-engineering"
  ),
  createCivilTool(
    "highway-boq-template",
    "Highway BOQ Template",
    "Bill of quantities format aligned with MORTH specifications and schedule of rates.",
    PROFESSIONAL_TOOL_CATEGORY_KEYS.templates,
    "available",
    true,
    "highway-engineering"
  ),
  createCivilTool(
    "tender-document-template",
    "Tender Document Template",
    "Technical and commercial bid document framework for highway construction contracts.",
    PROFESSIONAL_TOOL_CATEGORY_KEYS.templates,
    "available",
    true,
    "highway-engineering"
  ),
  createCivilTool(
    "road-safety-audit-checklist",
    "Road Safety Audit Checklist",
    "Stage-wise safety audit checklist for planning, design, and pre-opening highway projects.",
    PROFESSIONAL_TOOL_CATEGORY_KEYS.checklists,
    "available",
    true,
    "highway-engineering"
  ),
  createCivilTool(
    "irc-compliance-checklist",
    "IRC Compliance Checklist",
    "Design compliance verification against IRC geometric and pavement standards.",
    PROFESSIONAL_TOOL_CATEGORY_KEYS.checklists,
    "available",
    true,
    "highway-engineering"
  ),
  createCivilTool(
    "construction-quality-checklist",
    "Construction Quality Checklist",
    "Field quality control checklist for earthwork, pavement, and drainage works.",
    PROFESSIONAL_TOOL_CATEGORY_KEYS.checklists,
    "beta",
    true,
    "highway-engineering"
  ),
  createCivilTool(
    "highway-dpr-report-generator",
    "Highway DPR Report Generator",
    "Assembles detailed project report sections from project inputs and design outputs.",
    PROFESSIONAL_TOOL_CATEGORY_KEYS.reportGenerators,
    "beta",
    true,
    "highway-engineering"
  ),
  createCivilTool(
    "geometric-design-report-generator",
    "Geometric Design Report Generator",
    "Produces geometric design reports with alignment drawings and IRC parameter summaries.",
    PROFESSIONAL_TOOL_CATEGORY_KEYS.reportGenerators,
    "beta",
    true,
    "highway-engineering"
  ),
  createCivilTool(
    "safety-audit-report-generator",
    "Safety Audit Report Generator",
    "Generates road safety audit reports with findings, risk ratings, and mitigation measures.",
    PROFESSIONAL_TOOL_CATEGORY_KEYS.reportGenerators,
    "coming-soon",
    false,
    "highway-engineering"
  ),
];

export const civilEngineeringProfessionalToolsRegistry: EngineeringProfessionalToolsRegistry =
  buildProfessionalToolsRegistry(
    "civil-engineering",
    "Civil Engineering",
    civilProfessionalTools
  );
