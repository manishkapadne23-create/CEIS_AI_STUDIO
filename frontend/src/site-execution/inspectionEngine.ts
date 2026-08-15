import type { ExecutionPhase, InspectionRecord } from "./types";

export const getInspectionGuidance = (
  activity: string,
  disciplineName: string | null,
  phase: ExecutionPhase
): string[] => {
  const d = disciplineName ?? "engineering";
  const base = [
    `Review approved drawings and specifications before inspecting ${activity}`,
    "Use calibrated instruments and record calibration references",
    "Document all measurements with date, location, and inspector name",
    "Compare results against acceptance criteria in contract/specification",
    "Raise NCR for any non-conformance before proceeding",
  ];

  if (phase === "construction" || /concrete|rebar|formwork/i.test(activity)) {
    return [
      ...base,
      "Check formwork alignment, cleanliness, and release agent application",
      "Verify rebar spacing, cover, and lap lengths per drawing",
      "Confirm concrete mix design and slump before pour",
      "Record cube/cylinder sample IDs and casting location",
      "Inspect curing method and protection from weather",
    ];
  }
  if (/electrical|wiring|cable/i.test(activity)) {
    return [
      ...base,
      "Verify cable routing per cable schedule and segregation rules",
      "Check termination torque and crimp quality",
      "Perform insulation resistance and continuity tests",
      "Confirm earthing and bonding connections",
      "Label all circuits per single-line diagram",
    ];
  }
  if (/mechanical|piping|hvac|equipment/i.test(activity)) {
    return [
      ...base,
      "Verify equipment alignment and foundation grouting",
      "Check flange face condition and gasket selection",
      "Perform hydro/pneumatic test per procedure",
      "Confirm valve orientation and accessibility",
      "Record vibration and noise baseline readings",
    ];
  }
  return [
    ...base,
    `Apply ${d} inspection standards relevant to ${activity}`,
    "Coordinate with QA/QC for hold point release",
    "Archive inspection records with traceability to work package",
  ];
};

export const createInspectionRecord = (
  activity: string,
  findings: string[],
  status: InspectionRecord["status"],
  standard: string | null
): InspectionRecord => ({
  id: crypto.randomUUID(),
  activity,
  inspectionType: "Field Inspection",
  findings,
  status,
  standard,
  inspector: null,
  recordedAt: Date.now(),
});

export const formatInspectionGuidance = (
  activity: string,
  disciplineName: string | null,
  phase: ExecutionPhase
): string =>
  [
    `INSPECTION GUIDANCE — ${activity}`,
    `Phase: ${phase} | Discipline: ${disciplineName ?? "General"}`,
    "",
    ...getInspectionGuidance(activity, disciplineName, phase).map((g, i) => `${i + 1}. ${g}`),
  ].join("\n");

export const formatInspectionRecord = (record: InspectionRecord): string =>
  [
    `INSPECTION RECORD — ${record.activity}`,
    `Status: ${record.status.toUpperCase()}`,
    record.standard ? `Standard: ${record.standard}` : "",
    "",
    "Findings:",
    ...record.findings.map((f, i) => `${i + 1}. ${f}`),
    "",
    `Recorded: ${new Date(record.recordedAt).toLocaleString()}`,
  ]
    .filter(Boolean)
    .join("\n");

export const searchInspectionMethods = (query: string): string[] => {
  const methods = [
    "Visual inspection per ASTM E165 / ISO 9712",
    "Ultrasonic testing for weld examination",
    "Rebound hammer test for concrete strength estimation",
    "Dye penetrant inspection for surface cracks",
    "Magnetic particle inspection for ferromagnetic materials",
    "Thermographic inspection for electrical connections",
    "Pull-out test for anchor/fixing verification",
    "Falling weight deflectometer for pavement testing",
    "Hydrostatic pressure test for piping systems",
    "Insulation resistance test for electrical installations",
    "Ground penetrating radar for subsurface utilities",
    "Level and alignment survey for structural elements",
  ];
  const q = query.toLowerCase();
  return methods.filter((m) => m.toLowerCase().includes(q) || q.split(/\s+/).some((w) => m.toLowerCase().includes(w)));
};

export const formatInspectionMethods = (methods: string[]): string =>
  methods.length === 0
    ? "No matching inspection methods found."
    : ["INSPECTION METHODS:", ...methods.map((m, i) => `${i + 1}. ${m}`)].join("\n");
