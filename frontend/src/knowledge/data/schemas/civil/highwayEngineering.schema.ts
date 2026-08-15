import type { EngineeringSpecializationKnowledge } from "../../../types/EngineeringKnowledgeSchema";

export const highwayEngineeringSchema: EngineeringSpecializationKnowledge =
  {
    id: "highway-engineering",
    title: "Highway Engineering",
    disciplineId: "civil-engineering",
    overview:
      "Highway Engineering covers the planning, geometric design, pavement engineering, drainage, traffic engineering, and maintenance of roads and expressways. In India, highway projects are governed by IRC codes and MORTH specifications for national and state highway development.",
    scope: [
      "Highway planning and feasibility studies",
      "Geometric design of alignments and intersections",
      "Pavement design for flexible and rigid pavements",
      "Drainage, cross-drainage, and roadside features",
      "Traffic engineering and road safety audits",
      "Construction methodology and quality control",
      "Maintenance, rehabilitation, and asset management",
      "DPR preparation, BOQ, and cost estimation",
    ],
    designStandards: [
      {
        id: "irc-37",
        title: "IRC:37",
        code: "IRC:37",
        description:
          "Guidelines for design of flexible pavements for roads and runways.",
      },
      {
        id: "irc-58",
        title: "IRC:58",
        code: "IRC:58",
        description:
          "Guidelines for design of plain jointed rigid pavements for highways.",
      },
      {
        id: "irc-86",
        title: "IRC:86",
        code: "IRC:86",
        description:
          "Geometric design standards for urban and rural highways.",
      },
      {
        id: "irc-73",
        title: "IRC:73",
        code: "IRC:73",
        description:
          "Geometric design standards for rural highways including hill roads.",
      },
      {
        id: "morth",
        title: "MORTH Specifications",
        code: "MORTH",
        description:
          "Ministry specifications for road and bridge works on national highways.",
      },
      {
        id: "is-2386",
        title: "IS:2386",
        code: "IS:2386",
        description:
          "Methods of test for aggregates for concrete including bituminous mixes.",
      },
    ],
    designModules: [
      {
        id: "alignment-design",
        title: "Alignment Design",
        description:
          "Horizontal and vertical alignment, superelevation, and sight distance checks.",
      },
      {
        id: "pavement-design",
        title: "Pavement Design",
        description:
          "Flexible and rigid pavement thickness design using CBR and traffic data.",
      },
      {
        id: "intersection-design",
        title: "Intersection Design",
        description:
          "At-grade intersections, channelization, and rotary design.",
      },
      {
        id: "drainage-design",
        title: "Drainage Design",
        description:
          "Side drains, culverts, and cross-drainage structures.",
      },
      {
        id: "road-safety",
        title: "Road Safety Engineering",
        description:
          "Safety audits, hazard identification, and mitigation measures.",
      },
      {
        id: "earthwork",
        title: "Earthwork & Embankment",
        description:
          "Cut-fill balancing, embankment design, and slope stability.",
      },
    ],
    designSoftware: [
      {
        id: "openroads",
        title: "OpenRoads Designer",
        description:
          "Bentley platform for corridor modeling and highway design.",
      },
      {
        id: "mx-road",
        title: "MX Road",
        description:
          "Road design and analysis software for alignment and pavement workflows.",
      },
      {
        id: "civil-3d",
        title: "AutoCAD Civil 3D",
        description:
          "Civil infrastructure design with alignment profiles and corridors.",
      },
      {
        id: "inroads",
        title: "Bentley InRoads",
        description:
          "Road design, survey, and drainage modeling for transportation projects.",
      },
      {
        id: "hdm-4",
        title: "HDM-4",
        description:
          "Highway development and management tool for planning and maintenance.",
      },
    ],
    aiEngineeringAgents: [
      {
        id: "pavement-agent",
        title: "Pavement Design Agent",
        description:
          "Assists with IRC:37 flexible pavement design and layer composition.",
      },
      {
        id: "geometric-agent",
        title: "Geometric Design Agent",
        description:
          "Reviews alignment parameters, superelevation, and IRC compliance.",
      },
      {
        id: "boq-agent",
        title: "BOQ Estimation Agent",
        description:
          "Generates bill of quantities and rate analysis for highway works.",
      },
      {
        id: "dpr-agent",
        title: "DPR Preparation Agent",
        description:
          "Supports detailed project report drafting for highway schemes.",
      },
      {
        id: "irc-agent",
        title: "IRC Code Interpreter",
        description:
          "Explains IRC clauses and applies them to project scenarios.",
      },
    ],
    engineeringCalculators: [
      {
        id: "flexible-pavement",
        title: "Flexible Pavement Calculator",
        description:
          "Pavement layer thickness design based on CBR and traffic loading.",
      },
      {
        id: "superelevation",
        title: "Superelevation Calculator",
        description:
          "Computes superelevation rates for horizontal curves.",
      },
      {
        id: "sight-distance",
        title: "Sight Distance Calculator",
        description:
          "Stopping, overtaking, and intersection sight distance checks.",
      },
      {
        id: "earthwork",
        title: "Earthwork Volume Calculator",
        description:
          "Cut and fill volume estimation from cross-sections.",
      },
      {
        id: "super-elevation-transition",
        title: "Transition Length Calculator",
        description:
          "Length of superelevation runoff and tangent transitions.",
      },
    ],
    templates: [
      {
        id: "dpr-template",
        title: "Highway DPR Template",
        description:
          "Structured template for detailed project reports.",
      },
      {
        id: "geometric-report",
        title: "Geometric Design Report",
        description:
          "Alignment design documentation with IRC parameter tables.",
      },
      {
        id: "boq-template",
        title: "Highway BOQ Template",
        description:
          "Bill of quantities format aligned with MORTH specifications.",
      },
      {
        id: "safety-audit",
        title: "Road Safety Audit Checklist",
        description:
          "Stage-wise safety audit template for highway projects.",
      },
      {
        id: "tender-document",
        title: "Tender Document Template",
        description:
          "Technical and commercial bid document framework.",
      },
    ],
    learningResources: [
      {
        id: "irc-library",
        title: "IRC Code Library",
        description:
          "Reference collection of IRC highway and bridge codes.",
      },
      {
        id: "morth-manuals",
        title: "MORTH Manuals",
        description:
          "Official manuals for national highway planning and design.",
      },
      {
        id: "pavement-notes",
        title: "Pavement Engineering Notes",
        description:
          "Study notes on flexible and rigid pavement design methods.",
      },
      {
        id: "geometric-design-course",
        title: "Geometric Design Course",
        description:
          "Structured learning path for highway alignment design.",
      },
      {
        id: "mcq-bank",
        title: "Highway Engineering MCQs",
        description:
          "Practice questions for GATE, ESE, and professional exams.",
      },
    ],
  };
