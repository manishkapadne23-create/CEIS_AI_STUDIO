import type { TroubleshootingResult } from "./types";

const TROUBLESHOOTING_PATTERNS: {
  pattern: RegExp;
  category: string;
  causes: string[];
  actions: string[];
  safety: string[];
  standards: string[];
}[] = [
  {
    pattern: /concrete.*(crack|set|slump|honeycomb)/i,
    category: "Construction — Concrete",
    causes: [
      "Incorrect water-cement ratio",
      "Inadequate vibration or compaction",
      "Rapid evaporation / hot weather placement",
      "Formwork movement during pour",
      "Retempering of concrete",
    ],
    actions: [
      "Stop pour and assess extent of defect",
      "Consult structural engineer for repair method",
      "Adjust mix design or placement procedure",
      "Improve curing and protection measures",
      "Record incident and update method statement",
    ],
    safety: ["Ensure formwork stability before resuming", "Barricade affected area"],
    standards: ["IS 456", "ACI 318", "Project concrete specification"],
  },
  {
    pattern: /(equipment|machine|crane|pump).*(fail|break|stop|malfunction)/i,
    category: "Equipment",
    causes: [
      "Insufficient maintenance or overdue service",
      "Operator error or unauthorized use",
      "Hydraulic/fluid leak or contamination",
      "Electrical fault or power supply issue",
      "Overload beyond rated capacity",
    ],
    actions: [
      "Isolate equipment and tag out of service",
      "Notify maintenance team for diagnosis",
      "Review maintenance logs and service history",
      "Deploy backup equipment if available",
      "Re-inspect before returning to service",
    ],
    safety: ["Do not operate faulty equipment", "Follow LOTO procedure"],
    standards: ["Manufacturer O&M manual", "Site equipment management plan"],
  },
  {
    pattern: /(install|alignment|fit|clearance)/i,
    category: "Installation",
    causes: [
      "Foundation not level or out of tolerance",
      "Thermal expansion not accounted for",
      "Incorrect assembly sequence",
      "Damaged components during handling",
      "Drawing revision not incorporated",
    ],
    actions: [
      "Re-survey foundation/anchor bolt positions",
      "Check latest IFC drawings for dimensions",
      "Adjust shims or modify base plate as approved",
      "Document as-built deviation and obtain approval",
      "Update installation procedure",
    ],
    safety: ["Use proper rigging for repositioning", "Verify load paths"],
    standards: ["Equipment installation manual", "Alignment tolerance specification"],
  },
  {
    pattern: /(material|steel|rebar|pipe).*(wrong|reject|defect|damage)/i,
    category: "Material",
    causes: [
      "Incorrect material grade delivered",
      "Damage during transport or handling",
      "Expired or non-conforming test certificates",
      "Improper storage causing degradation",
      "Substitution without approval",
    ],
    actions: [
      "Quarantine affected material immediately",
      "Notify procurement and QA/QC",
      "Request replacement from supplier",
      "Review receiving inspection procedure",
      "Update material traceability records",
    ],
    safety: ["Do not use unapproved materials", "Segregate rejected stock"],
    standards: ["Material specification", "QA material control plan"],
  },
  {
    pattern: /(quality|defect|ncr|reject|rework)/i,
    category: "Quality",
    causes: [
      "Workmanship below acceptance criteria",
      "Inadequate supervision or skill level",
      "Missing or unclear specification",
      "Rushed work to meet schedule",
      "Inspection hold point bypassed",
    ],
    actions: [
      "Issue formal NCR with photographic evidence",
      "Determine root cause through investigation",
      "Define repair method and get engineer approval",
      "Re-inspect after corrective action",
      "Provide additional training if skill gap identified",
    ],
    safety: ["Ensure repair area is safe before rework"],
    standards: ["Project QA plan", "Relevant workmanship standards"],
  },
  {
    pattern: /(access|constraint|weather|delay|space)/i,
    category: "Site Constraints",
    causes: [
      "Congested work area with overlapping trades",
      "Adverse weather conditions",
      "Utility conflict or unforeseen obstruction",
      "Permit or approval delays",
      "Logistics / material delivery delay",
    ],
    actions: [
      "Re-sequence work to avoid conflicts",
      "Implement weather protection measures",
      "Coordinate multi-trade interface meeting",
      "Escalate permit/approval blockers to PM",
      "Adjust daily plan and communicate to stakeholders",
    ],
    safety: ["Maintain safe access routes", "Review JSA for changed conditions"],
    standards: ["Site logistics plan", "Project schedule baseline"],
  },
];

export const troubleshootIssue = (
  issue: string,
  disciplineName: string | null
): TroubleshootingResult => {
  for (const pattern of TROUBLESHOOTING_PATTERNS) {
    if (pattern.pattern.test(issue)) {
      return {
        issue,
        category: pattern.category,
        probableCauses: pattern.causes,
        recommendedActions: pattern.actions,
        safetyNotes: pattern.safety,
        relatedStandards: pattern.standards,
      };
    }
  }

  return {
    issue,
    category: disciplineName ? `${disciplineName} — General` : "General Site Issue",
    probableCauses: [
      "Incomplete or unclear work instructions",
      "Resource or skill gap on site",
      "Coordination failure between trades",
      "Deviation from approved method statement",
      "Environmental or site condition change",
    ],
    recommendedActions: [
      "Stop work if safety or quality is compromised",
      "Gather facts: photos, measurements, witness statements",
      "Consult site engineer and relevant specialist",
      "Prepare deviation request or method modification",
      "Document resolution and update lessons learned",
    ],
    safetyNotes: [
      "Assess immediate safety risk before proceeding",
      "Brief all affected workers on revised approach",
    ],
    relatedStandards: ["Project method statements", "Applicable codes and specifications"],
  };
};

export const formatTroubleshooting = (result: TroubleshootingResult): string =>
  [
    `TROUBLESHOOTING — ${result.category}`,
    `Issue: ${result.issue}`,
    "",
    "Probable Causes:",
    ...result.probableCauses.map((c, i) => `${i + 1}. ${c}`),
    "",
    "Recommended Actions:",
    ...result.recommendedActions.map((a, i) => `${i + 1}. ${a}`),
    "",
    "Safety Notes:",
    ...result.safetyNotes.map((s) => `- ${s}`),
    "",
    "Related Standards:",
    ...result.relatedStandards.map((s) => `- ${s}`),
  ].join("\n");

export const getExecutionSequence = (
  activity: string,
  phase: string
): string[] => {
  const a = activity.toLowerCase();
  if (/concrete|pour/i.test(a)) {
    return [
      "1. Verify formwork, rebar, and embedments inspection complete",
      "2. Confirm concrete mix approval and plant calibration",
      "3. Check weather forecast and arrange protection",
      "4. Position pump/plant and establish pour sequence",
      "5. Pour in layers with continuous vibration",
      "6. Finish surface and commence curing immediately",
      "7. Strip formwork per specification timing",
      "8. Test cubes and record results",
    ];
  }
  if (/steel|erect/i.test(a)) {
    return [
      "1. Survey and verify anchor bolt positions",
      "2. Pre-assemble components on ground where possible",
      "3. Erect columns and install temporary bracing",
      "4. Install beams and connections per sequence",
      "5. Torque/tension connections to specification",
      "6. Align and plumb — survey check",
      "7. Install decking/floor system",
      "8. Final inspection and bolt audit",
    ];
  }
  if (/commission/i.test(a)) {
    return [
      "1. Confirm mechanical completion and punch list clearance",
      "2. Verify all pre-commissioning tests passed",
      "3. Energize systems in approved sequence",
      "4. Perform functional performance tests",
      "5. Tune controls and set operating parameters",
      "6. Run reliability trial period",
      "7. Train operations team",
      "8. Issue commissioning certificate",
    ];
  }
  return [
    `1. Review method statement for ${activity}`,
    "2. Obtain permits and brief work crew",
    "3. Set out and verify dimensions",
    "4. Execute work per specification",
    `5. Inspect and test (${phase})`,
    "6. Document and obtain sign-off",
    "7. Protect completed work",
    "8. Handover to next trade or phase",
  ];
};

export const formatExecutionSequence = (activity: string, phase: string): string =>
  [
    `EXECUTION SEQUENCE — ${activity}`,
    `Phase: ${phase}`,
    "",
    ...getExecutionSequence(activity, phase),
  ].join("\n");

export const getConstructionGuidance = (
  activity: string,
  disciplineName: string | null
): string[] => [
  `Follow approved method statement for ${activity}`,
  "Verify all hold points cleared before proceeding",
  `Apply ${disciplineName ?? "engineering"} standards and project specifications`,
  "Maintain daily site records and progress photos",
  "Coordinate with adjacent trades to avoid conflicts",
  "Report deviations immediately to site engineer",
];

export const getCommissioningGuidance = (system: string): string[] => [
  `Verify ${system} mechanical completion checklist signed off`,
  "Confirm all safety systems operational before energization",
  "Perform pre-commissioning checks per OEM manual",
  "Execute functional test procedures step by step",
  "Record all test data and compare against design criteria",
  "Resolve punch list items before final handover",
  "Prepare O&M manuals and as-built documentation",
  "Conduct operator training and issue commissioning certificate",
];

export const searchExecutionProcedures = (query: string): string[] => {
  const procedures = [
    "Concrete placement and curing procedure",
    "Structural steel erection sequence",
    "Electrical cable pulling and termination",
    "Piping hydrostatic test procedure",
    "HVAC duct installation and leakage test",
    "Waterproofing application method",
    "Scaffolding erection and dismantling",
    "Hot work permit and fire watch procedure",
    "Confined space entry procedure",
    "Equipment alignment and grouting",
    "Pre-commissioning electrical checks",
    "Building envelope pressure test",
  ];
  const q = query.toLowerCase();
  return procedures.filter(
    (p) =>
      p.toLowerCase().includes(q) ||
      q.split(/\s+/).some((w) => w.length > 2 && p.toLowerCase().includes(w))
  );
};

export const searchSafetyPractices = (query: string): string[] => {
  const practices = [
    "Fall protection for work at height",
    "Excavation shoring and benching",
    "LOTO for electrical and mechanical isolation",
    "Confined space atmospheric monitoring",
    "Hot work fire watch requirements",
    "Manual handling and lifting techniques",
    "PPE selection for chemical exposure",
    "Traffic management plan for site vehicles",
    "Emergency evacuation and muster points",
    "Toolbox talk topics for daily briefing",
  ];
  const q = query.toLowerCase();
  return practices.filter(
    (p) =>
      p.toLowerCase().includes(q) ||
      q.split(/\s+/).some((w) => w.length > 2 && p.toLowerCase().includes(w))
  );
};
