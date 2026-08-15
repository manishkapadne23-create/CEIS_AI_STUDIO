import type {
  EngineeringWorkflow,
  EngineeringWorkflowRegistry,
  EngineeringWorkflowStatus,
  WorkflowStepResourceKey,
} from "../../types/EngineeringWorkflow";
import { WORKFLOW_STEP_RESOURCE_KEYS } from "../../types/EngineeringWorkflow";
import { buildWorkflowRegistry } from "../../utils/buildWorkflowRegistry";

const createCivilWorkflow = (
  id: string,
  title: string,
  description: string,
  specializationId: string,
  steps: EngineeringWorkflow["steps"],
  status: EngineeringWorkflowStatus = "available",
  enabled = true
): EngineeringWorkflow => ({
  id,
  key: id,
  title,
  description,
  status,
  enabled,
  disciplineId: "civil-engineering",
  specializationId,
  steps,
});

const step = (
  id: string,
  order: number,
  title: string,
  description: string,
  resourceType: WorkflowStepResourceKey,
  resourceId?: string,
  resourceRef?: string
): EngineeringWorkflow["steps"][number] => ({
  id,
  order,
  title,
  description,
  resourceType,
  resourceId,
  resourceRef,
});

const civilWorkflows: EngineeringWorkflow[] = [
  createCivilWorkflow(
    "highway-dpr-preparation",
    "Highway DPR Preparation",
    "End-to-end workflow for preparing a detailed project report for highway schemes.",
    "highway-engineering",
    [
      step(
        "dpr-knowledge",
        1,
        "Review Highway Knowledge",
        "Review highway engineering scope, design modules, and project requirements.",
        WORKFLOW_STEP_RESOURCE_KEYS.knowledge,
        "highway-engineering",
        "Highway Engineering Knowledge Module"
      ),
      step(
        "dpr-standards",
        2,
        "Apply IRC and MoRTH Standards",
        "Confirm applicable IRC geometric and pavement codes plus MoRTH specifications.",
        WORKFLOW_STEP_RESOURCE_KEYS.standards,
        "morth-specs",
        "IRC, MoRTH"
      ),
      step(
        "dpr-calculators",
        3,
        "Run Design Calculations",
        "Execute pavement, earthwork, and sight distance calculations for design justification.",
        WORKFLOW_STEP_RESOURCE_KEYS.calculators,
        "flexible-pavement",
        "Flexible Pavement Calculator"
      ),
      step(
        "dpr-tools",
        4,
        "Prepare BOQ and Templates",
        "Generate BOQ estimates and populate DPR documentation templates.",
        WORKFLOW_STEP_RESOURCE_KEYS.professionalTools,
        "highway-dpr-template",
        "Highway DPR Template"
      ),
      step(
        "dpr-ai-expert",
        5,
        "Consult DPR AI Expert",
        "Use the DPR Preparation Agent and Highway Engineering AI expert for drafting support.",
        WORKFLOW_STEP_RESOURCE_KEYS.aiExpert,
        "dpr-agent",
        "DPR Preparation Agent"
      ),
    ]
  ),
  createCivilWorkflow(
    "flexible-pavement-design",
    "Flexible Pavement Design",
    "Workflow for flexible pavement thickness design and layer composition per IRC:37.",
    "highway-engineering",
    [
      step(
        "pavement-knowledge",
        1,
        "Review Pavement Design Module",
        "Review pavement design scope, materials, and traffic assumptions.",
        WORKFLOW_STEP_RESOURCE_KEYS.knowledge,
        "highway-engineering",
        "Pavement Design Module"
      ),
      step(
        "pavement-standards",
        2,
        "Apply IRC:37 and IS Codes",
        "Reference IRC:37 and IS:2386 for mix and aggregate requirements.",
        WORKFLOW_STEP_RESOURCE_KEYS.standards,
        "irc-37",
        "IRC:37, IS:2386"
      ),
      step(
        "pavement-calculator",
        3,
        "Run Pavement Calculator",
        "Calculate pavement layer thickness using CBR and traffic loading inputs.",
        WORKFLOW_STEP_RESOURCE_KEYS.calculators,
        "flexible-pavement",
        "Flexible Pavement Calculator"
      ),
      step(
        "pavement-tools",
        4,
        "Use Pavement Design Assistant",
        "Validate layer composition with the pavement design assistant.",
        WORKFLOW_STEP_RESOURCE_KEYS.professionalTools,
        "pavement-design-assistant",
        "Pavement Design Assistant"
      ),
      step(
        "pavement-ai-expert",
        5,
        "Consult Pavement AI Agent",
        "Review design outputs with the Pavement Design Agent.",
        WORKFLOW_STEP_RESOURCE_KEYS.aiExpert,
        "pavement-agent",
        "Pavement Design Agent"
      ),
    ]
  ),
  createCivilWorkflow(
    "geometric-design-review",
    "Geometric Design Review",
    "Workflow for alignment geometric design verification and IRC compliance checks.",
    "highway-engineering",
    [
      step(
        "geometric-knowledge",
        1,
        "Review Alignment Design Knowledge",
        "Review horizontal and vertical alignment design requirements.",
        WORKFLOW_STEP_RESOURCE_KEYS.knowledge,
        "highway-engineering",
        "Alignment Design Module"
      ),
      step(
        "geometric-standards",
        2,
        "Apply IRC Geometric Standards",
        "Verify design against IRC:73, IRC:86, and IRC:66 sight distance provisions.",
        WORKFLOW_STEP_RESOURCE_KEYS.standards,
        "irc-73",
        "IRC:73, IRC:86, IRC:66"
      ),
      step(
        "geometric-calculators",
        3,
        "Run Geometric Calculators",
        "Check superelevation, sight distance, and transition lengths.",
        WORKFLOW_STEP_RESOURCE_KEYS.calculators,
        "superelevation",
        "Superelevation & Sight Distance Calculators"
      ),
      step(
        "geometric-tools",
        4,
        "Use Geometric Design Assistant",
        "Run alignment review and geometric design report generation.",
        WORKFLOW_STEP_RESOURCE_KEYS.professionalTools,
        "geometric-design-assistant",
        "Geometric Design Assistant"
      ),
      step(
        "geometric-ai-expert",
        5,
        "Consult Geometric AI Agent",
        "Validate IRC compliance with the Geometric Design Agent.",
        WORKFLOW_STEP_RESOURCE_KEYS.aiExpert,
        "geometric-agent",
        "Geometric Design Agent"
      ),
    ],
    "beta"
  ),
  createCivilWorkflow(
    "highway-boq-estimation",
    "Highway BOQ Estimation",
    "Workflow for bill of quantities preparation and rate analysis for highway works.",
    "highway-engineering",
    [
      step(
        "boq-knowledge",
        1,
        "Review BOQ Scope",
        "Review project scope, work items, and measurement conventions.",
        WORKFLOW_STEP_RESOURCE_KEYS.knowledge,
        "highway-engineering",
        "Highway Engineering Scope"
      ),
      step(
        "boq-standards",
        2,
        "Apply MoRTH Specifications",
        "Align BOQ items with MoRTH specifications and schedule of rates.",
        WORKFLOW_STEP_RESOURCE_KEYS.standards,
        "morth-specs",
        "MORTH Specifications"
      ),
      step(
        "boq-calculators",
        3,
        "Estimate Earthwork Volumes",
        "Calculate cut-fill quantities for BOQ earthwork items.",
        WORKFLOW_STEP_RESOURCE_KEYS.calculators,
        "earthwork",
        "Earthwork Volume Calculator"
      ),
      step(
        "boq-tools",
        4,
        "Generate BOQ and Rate Analysis",
        "Use BOQ estimation and rate analysis professional tools.",
        WORKFLOW_STEP_RESOURCE_KEYS.professionalTools,
        "boq-estimation-tool",
        "BOQ Estimation Tool"
      ),
      step(
        "boq-ai-expert",
        5,
        "Consult BOQ AI Agent",
        "Review quantities and rates with the BOQ Estimation Agent.",
        WORKFLOW_STEP_RESOURCE_KEYS.aiExpert,
        "boq-agent",
        "BOQ Estimation Agent"
      ),
    ],
    "beta"
  ),
  createCivilWorkflow(
    "road-safety-audit",
    "Road Safety Audit",
    "Workflow for stage-wise road safety audit and mitigation planning.",
    "highway-engineering",
    [
      step(
        "safety-knowledge",
        1,
        "Review Safety Engineering Scope",
        "Review road safety audit stages and hazard identification methods.",
        WORKFLOW_STEP_RESOURCE_KEYS.knowledge,
        "highway-engineering",
        "Road Safety Engineering"
      ),
      step(
        "safety-standards",
        2,
        "Reference Safety Standards",
        "Apply IRC geometric and safety-related codes for audit checkpoints.",
        WORKFLOW_STEP_RESOURCE_KEYS.standards,
        "irc-86",
        "IRC Geometric Standards"
      ),
      step(
        "safety-calculators",
        3,
        "Verify Sight Distance",
        "Run sight distance checks at critical audit locations.",
        WORKFLOW_STEP_RESOURCE_KEYS.calculators,
        "sight-distance",
        "Sight Distance Calculator"
      ),
      step(
        "safety-tools",
        4,
        "Complete Safety Audit Checklist",
        "Use road safety audit checklist and report generator tools.",
        WORKFLOW_STEP_RESOURCE_KEYS.professionalTools,
        "road-safety-audit-checklist",
        "Road Safety Audit Checklist"
      ),
      step(
        "safety-ai-expert",
        5,
        "Consult Safety AI Expert",
        "Review findings and mitigation measures with the AI expert.",
        WORKFLOW_STEP_RESOURCE_KEYS.aiExpert,
        "geometric-agent",
        "Geometric Design Agent"
      ),
    ],
    "beta"
  ),
];

export const civilEngineeringWorkflowRegistry: EngineeringWorkflowRegistry =
  buildWorkflowRegistry(
    "civil-engineering",
    "Civil Engineering",
    civilWorkflows
  );
