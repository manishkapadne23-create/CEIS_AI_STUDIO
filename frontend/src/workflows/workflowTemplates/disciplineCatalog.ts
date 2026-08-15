import { buildWorkflowTemplate } from "./buildWorkflowTemplate";
import type { WorkflowTemplate } from "../types";

interface DisciplineWorkflowCatalog {
  disciplineId: string;
  disciplineName: string;
  workflows: Array<{
    id: string;
    title: string;
    overview: string;
    objective: string;
    activities: string[];
    standards: string[];
    outputs: string[];
  }>;
}

const createDisciplineWorkflows = (
  catalog: DisciplineWorkflowCatalog
): WorkflowTemplate[] =>
  catalog.workflows.map((workflow) =>
    buildWorkflowTemplate({
      id: workflow.id,
      disciplineId: catalog.disciplineId,
      disciplineName: catalog.disciplineName,
      title: workflow.title,
      overview: workflow.overview,
      objective: workflow.objective,
      prerequisites: [
        "Project scope defined",
        "Applicable standards identified",
        "Required inputs available",
      ],
      activityTitles: workflow.activities.map((title) => ({ title })),
      requiredDocuments: ["Project brief", "Design basis", "Applicable drawings"],
      requiredStandards: workflow.standards,
      requiredCalculations: ["Discipline-specific calculations"],
      professionalTools: ["Professional tool templates", "Checklists"],
      outputs: workflow.outputs,
      qualityChecks: ["Standards compliance", "Design review", "Documentation complete"],
      completionChecklist: [
        "All steps completed",
        "Quality checks passed",
        "Deliverables approved",
        "Workspace saved",
      ],
    })
  );

const DISCIPLINE_CATALOGS: DisciplineWorkflowCatalog[] = [
  {
    disciplineId: "electronics-telecommunication-engineering",
    disciplineName: "Electronics & Telecommunication",
    workflows: [
      { id: "circuit-design-workflow", title: "Circuit Design Workflow", overview: "Analog and digital circuit design.", objective: "Deliver validated circuit design.", activities: ["Define specifications", "Schematic design", "Simulation", "PCB layout review", "Prototype validation"], standards: ["IEC", "IEEE"], outputs: ["Schematic", "BOM", "Test report"] },
      { id: "pcb-development-workflow", title: "PCB Development Workflow", overview: "PCB design and fabrication workflow.", objective: "Release production-ready PCB.", activities: ["Layout design", "DRC/ERC checks", "Fabrication data", "Assembly verification", "Test and sign-off"], standards: ["IPC standards"], outputs: ["Gerber files", "Assembly drawing"] },
      { id: "rf-design-workflow", title: "RF Design Workflow", overview: "RF circuit and antenna design.", objective: "Meet RF performance targets.", activities: ["Link budget", "RF simulation", "Prototype test", "Compliance check", "Documentation"], standards: ["IEEE RF", "FCC/ETSI"], outputs: ["RF design report", "Test results"] },
      { id: "telecom-network-workflow", title: "Telecom Network Workflow", overview: "Telecom network planning and deployment.", objective: "Deploy optimized network.", activities: ["Site survey", "Link planning", "Equipment selection", "Installation", "Commissioning"], standards: ["ITU-T", "3GPP"], outputs: ["Network plan", "Commissioning report"] },
    ],
  },
  {
    disciplineId: "chemical-engineering",
    disciplineName: "Chemical Engineering",
    workflows: [
      { id: "process-design-workflow", title: "Process Design Workflow", overview: "Chemical process design from concept to P&ID.", objective: "Deliver process design package.", activities: ["Mass/energy balance", "Equipment sizing", "P&ID development", "HAZOP review", "Design approval"], standards: ["ASME", "API", "IS codes"], outputs: ["PFD", "P&ID", "Equipment list"] },
      { id: "pilot-plant-workflow", title: "Pilot Plant Workflow", overview: "Pilot plant setup and testing.", objective: "Validate process at pilot scale.", activities: ["Pilot setup", "Trial runs", "Data collection", "Scale-up analysis", "Report"], standards: ["Process safety"], outputs: ["Pilot report", "Scale-up memo"] },
      { id: "safety-hazop-workflow", title: "HAZOP Workflow", overview: "Hazard and operability study.", objective: "Identify and mitigate process hazards.", activities: ["Team formation", "Node definition", "Guideword analysis", "Action tracking", "Close-out"], standards: ["IEC 61882"], outputs: ["HAZOP report", "Action register"] },
    ],
  },
  {
    disciplineId: "environmental-engineering",
    disciplineName: "Environmental Engineering",
    workflows: [
      { id: "eia-workflow", title: "EIA Workflow", overview: "Environmental Impact Assessment.", objective: "Complete EIA report per regulations.", activities: ["Scoping", "Baseline study", "Impact prediction", "Mitigation plan", "Public consultation", "Final EIA"], standards: ["MoEFCC", "ISO 14001"], outputs: ["EIA report", "EMP"] },
      { id: "waste-management-workflow", title: "Waste Management Workflow", overview: "Waste handling and disposal planning.", objective: "Compliant waste management plan.", activities: ["Waste characterization", "Treatment selection", "Disposal planning", "Monitoring setup", "Approval"], standards: ["CPCB guidelines"], outputs: ["Waste management plan"] },
      { id: "water-treatment-workflow", title: "Water Treatment Workflow", overview: "Water/wastewater treatment design.", objective: "Design treatment system.", activities: ["Water quality analysis", "Process selection", "Design calculations", "Equipment spec", "O&M plan"], standards: ["IS:10500", "CPCB"], outputs: ["Treatment design report"] },
    ],
  },
  {
    disciplineId: "mining-engineering",
    disciplineName: "Mining Engineering",
    workflows: [
      { id: "mine-planning-workflow", title: "Mine Planning Workflow", overview: "Open pit or underground mine planning.", objective: "Optimized mine plan.", activities: ["Geological model", "Pit/UG design", "Production schedule", "Equipment plan", "Economic analysis"], standards: ["DGMS", "Mine rules"], outputs: ["Mine plan", "Production schedule"] },
      { id: "blasting-workflow", title: "Blasting Workflow", overview: "Blast design and execution.", objective: "Safe, effective blasting.", activities: ["Rock characterization", "Blast design", "Safety perimeter", "Execution", "Post-blast analysis"], standards: ["DGMS blasting rules"], outputs: ["Blast design", "Vibration report"] },
      { id: "mine-safety-workflow", title: "Mine Safety Workflow", overview: "Mine safety management.", objective: "Compliant safety system.", activities: ["Risk assessment", "Safety plan", "Training", "Inspections", "Incident review"], standards: ["DGMS"], outputs: ["Safety plan", "Inspection reports"] },
    ],
  },
  {
    disciplineId: "marine-engineering",
    disciplineName: "Marine Engineering",
    workflows: [
      { id: "vessel-design-workflow", title: "Vessel Design Workflow", overview: "Ship/vessel structural and systems design.", objective: "Class-approved design.", activities: ["Design basis", "Structural analysis", "Systems design", "Class submission", "Approval"], standards: ["SOLAS", "Class rules"], outputs: ["Design drawings", "Calculations"] },
      { id: "drydock-workflow", title: "Drydock Maintenance Workflow", overview: "Vessel drydock repair workflow.", objective: "Complete drydock scope.", activities: ["Survey", "Repair specification", "Execution", "Testing", "Class certification"], standards: ["Class society rules"], outputs: ["Repair spec", "Completion report"] },
      { id: "marine-survey-workflow", title: "Marine Survey Workflow", overview: "Condition survey and reporting.", objective: "Document vessel condition.", activities: ["Survey planning", "Inspection", "Thickness gauging", "Report preparation", "Recommendations"], standards: ["Class guidelines"], outputs: ["Survey report"] },
    ],
  },
  {
    disciplineId: "railway-engineering",
    disciplineName: "Railway Engineering",
    workflows: [
      { id: "track-design-workflow", title: "Track Design Workflow", overview: "Railway track geometry and alignment.", objective: "RDSO-compliant track design.", activities: ["Alignment design", "Sleeper spacing", "Ballast design", "Turnout design", "Approval"], standards: ["RDSO", "Indian Railways"], outputs: ["Track design report"] },
      { id: "signalling-workflow", title: "Signalling Workflow", overview: "Railway signalling system design.", objective: "Safe signalling installation.", activities: ["Interlocking plan", "Signal placement", "Circuit design", "Testing", "Commissioning"], standards: ["IRS", "RDSO"], outputs: ["Signalling plan", "Test report"] },
      { id: "rolling-stock-workflow", title: "Rolling Stock Workflow", overview: "Rolling stock maintenance workflow.", objective: "Maintain fleet reliability.", activities: ["Inspection schedule", "Maintenance execution", "Parts replacement", "Testing", "Release"], standards: ["RDSO maintenance"], outputs: ["Maintenance records"] },
    ],
  },
  {
    disciplineId: "aerospace-engineering",
    disciplineName: "Aerospace Engineering",
    workflows: [
      { id: "aircraft-design-workflow", title: "Aircraft Design Workflow", overview: "Aircraft component/system design.", objective: "Certifiable design package.", activities: ["Requirements", "Preliminary design", "Detailed design", "Analysis", "Certification docs"], standards: ["FAR/CS", "AS9100"], outputs: ["Design report", "Analysis package"] },
      { id: "flight-test-workflow", title: "Flight Test Workflow", overview: "Flight test planning and execution.", objective: "Validated flight performance.", activities: ["Test plan", "Instrumentation", "Flight execution", "Data analysis", "Report"], standards: ["FAR 23/25"], outputs: ["Flight test report"] },
      { id: "maintenance-repair-workflow", title: "MRO Workflow", overview: "Aircraft maintenance and repair.", objective: "Airworthy aircraft release.", activities: ["Work order", "Inspection", "Repair", "Testing", "Release to service"], standards: ["EASA/FAA MRO"], outputs: ["Work pack", "Release certificate"] },
    ],
  },
  {
    disciplineId: "industrial-engineering",
    disciplineName: "Industrial Engineering",
    workflows: [
      { id: "layout-planning-workflow", title: "Plant Layout Workflow", overview: "Industrial plant layout optimization.", objective: "Efficient facility layout.", activities: ["Process flow", "Space planning", "Material flow", "Simulation", "Layout approval"], standards: ["Lean principles"], outputs: ["Layout drawing", "Flow analysis"] },
      { id: "time-motion-workflow", title: "Time & Motion Study Workflow", overview: "Work study and standardization.", objective: "Optimized work methods.", activities: ["Process observation", "Time study", "Method improvement", "Standard work", "Training"], standards: ["IE standards"], outputs: ["Standard work sheet"] },
      { id: "capacity-planning-workflow", title: "Capacity Planning Workflow", overview: "Production capacity analysis.", objective: "Balanced capacity plan.", activities: ["Demand forecast", "Capacity assessment", "Bottleneck analysis", "Improvement plan", "Implementation"], standards: ["Operations management"], outputs: ["Capacity plan"] },
    ],
  },
  {
    disciplineId: "automation-robotics",
    disciplineName: "Automation & Robotics",
    workflows: [
      { id: "plc-programming-workflow", title: "PLC Programming Workflow", overview: "PLC logic development and testing.", objective: "Commissioned PLC program.", activities: ["I/O list", "Logic development", "Simulation", "FAT", "SAT"], standards: ["IEC 61131"], outputs: ["PLC program", "Test report"] },
      { id: "robot-integration-workflow", title: "Robot Integration Workflow", overview: "Industrial robot cell integration.", objective: "Operational robot cell.", activities: ["Cell design", "Programming", "Safety assessment", "Commissioning", "Training"], standards: ["ISO 10218"], outputs: ["Robot program", "Safety report"] },
      { id: "scada-implementation-workflow", title: "SCADA Implementation Workflow", overview: "SCADA system deployment.", objective: "Live SCADA system.", activities: ["Architecture design", "Tag database", "HMI development", "Integration test", "Go-live"], standards: ["IEC 62443"], outputs: ["SCADA report", "O&M manual"] },
    ],
  },
  {
    disciplineId: "renewable-energy",
    disciplineName: "Renewable Energy",
    workflows: [
      { id: "solar-plant-workflow", title: "Solar Plant Workflow", overview: "Solar PV plant design and commissioning.", objective: "Operational solar plant.", activities: ["Site assessment", "System design", "Installation", "Testing", "Grid connection"], standards: ["IEC 62446", "MNRE"], outputs: ["Solar design report", "Inspection report"] },
      { id: "wind-farm-workflow", title: "Wind Farm Workflow", overview: "Wind farm development workflow.", objective: "Commissioned wind farm.", activities: ["Wind resource assessment", "Turbine selection", "Foundation design", "Installation", "Commissioning"], standards: ["IEC 61400"], outputs: ["Wind farm report", "Checklist"] },
      { id: "energy-audit-workflow", title: "Energy Audit Workflow", overview: "Building/industrial energy audit.", objective: "Energy savings recommendations.", activities: ["Data collection", "Analysis", "Recommendations", "Report", "Implementation plan"], standards: ["BEE PAT"], outputs: ["Energy audit report"] },
    ],
  },
  {
    disciplineId: "architecture-planning",
    disciplineName: "Architecture & Planning",
    workflows: [
      { id: "concept-design-workflow", title: "Concept Design Workflow", overview: "Architectural concept development.", objective: "Approved concept design.", activities: ["Brief analysis", "Concept sketches", "Massing studies", "Client presentation", "Approval"], standards: ["NBC", "Local bylaws"], outputs: ["Concept drawings", "Design statement"] },
      { id: "spatial-planning-workflow", title: "Spatial Planning Workflow", overview: "Urban/spatial planning workflow.", objective: "Approved master plan.", activities: ["Site analysis", "Zoning", "Master plan", "Stakeholder consultation", "Approval"], standards: ["UDPFI", "Local plans"], outputs: ["Master plan", "Report"] },
      { id: "building-permit-workflow", title: "Building Permit Workflow", overview: "Building permit application.", objective: "Permit approval.", activities: ["Document preparation", "Drawing submission", "Authority review", "Compliance corrections", "Permit issuance"], standards: ["Local building codes"], outputs: ["Permit application", "Approved drawings"] },
    ],
  },
  {
    disciplineId: "agricultural-engineering",
    disciplineName: "Agricultural Engineering",
    workflows: [
      { id: "irrigation-design-workflow", title: "Irrigation Design Workflow", overview: "Irrigation system design.", objective: "Efficient irrigation system.", activities: ["Crop water requirement", "System selection", "Hydraulic design", "Equipment spec", "O&M plan"], standards: ["IS:11624", "MoA guidelines"], outputs: ["Irrigation design report"] },
      { id: "farm-machinery-workflow", title: "Farm Machinery Workflow", overview: "Farm equipment selection and maintenance.", objective: "Optimized machinery plan.", activities: ["Requirement analysis", "Equipment selection", "Cost analysis", "Maintenance plan", "Training"], standards: ["Agricultural standards"], outputs: ["Machinery plan"] },
      { id: "post-harvest-workflow", title: "Post-Harvest Workflow", overview: "Post-harvest processing facility.", objective: "Processing facility design.", activities: ["Process design", "Equipment layout", "Storage design", "Quality plan", "Commissioning"], standards: ["FSSAI", "APEDA"], outputs: ["Facility design report"] },
    ],
  },
  {
    disciplineId: "oil-gas-engineering",
    disciplineName: "Oil & Gas Engineering",
    workflows: [
      { id: "pipeline-design-workflow", title: "Pipeline Design Workflow", overview: "Pipeline engineering design.", objective: "Approved pipeline design.", activities: ["Route selection", "Hydraulic design", "Material selection", "Stress analysis", "Approval"], standards: ["ASME B31.4/B31.8", "API"], outputs: ["Pipeline design report"] },
      { id: "pipeline-inspection-workflow", title: "Pipeline Inspection Workflow", overview: "Pipeline integrity inspection.", objective: "Documented integrity assessment.", activities: ["ILI planning", "Inspection execution", "Defect assessment", "Repair recommendation", "Report"], standards: ["API 1163"], outputs: ["Pipeline inspection report"] },
      { id: "hazop-oilgas-workflow", title: "HAZOP Workflow", overview: "Oil & gas HAZOP study.", objective: "Hazard mitigation plan.", activities: ["Study preparation", "Node review", "Action identification", "Tracking", "Close-out"], standards: ["IEC 61882", "API RP 750"], outputs: ["HAZOP report", "Checklist"] },
    ],
  },
  {
    disciplineId: "biomedical-engineering",
    disciplineName: "Biomedical Engineering",
    workflows: [
      { id: "equipment-calibration-workflow", title: "Equipment Calibration Workflow", overview: "Medical equipment calibration.", objective: "Calibrated equipment with certificate.", activities: ["Schedule calibration", "Perform calibration", "Record results", "Issue certificate", "Update register"], standards: ["ISO 13485", "NABL"], outputs: ["Calibration report"] },
      { id: "hospital-equipment-workflow", title: "Hospital Equipment Workflow", overview: "Hospital equipment lifecycle management.", objective: "Maintained equipment fleet.", activities: ["Procurement spec", "Installation", "Acceptance test", "PM schedule", "Decommissioning"], standards: ["IEC 60601", "CDSCO"], outputs: ["Equipment checklist", "PM schedule"] },
      { id: "clinical-safety-workflow", title: "Clinical Safety Workflow", overview: "Clinical engineering safety program.", objective: "Patient-safe equipment environment.", activities: ["Risk assessment", "Safety testing", "Incident reporting", "Corrective action", "Audit"], standards: ["ISO 14971"], outputs: ["Safety report"] },
    ],
  },
];

export const disciplineCatalogWorkflowTemplates: WorkflowTemplate[] =
  DISCIPLINE_CATALOGS.flatMap(createDisciplineWorkflows);

export const getDisciplineCatalogWorkflows = (
  disciplineId: string
): WorkflowTemplate[] =>
  disciplineCatalogWorkflowTemplates.filter(
    (workflow) => workflow.disciplineId === disciplineId
  );
