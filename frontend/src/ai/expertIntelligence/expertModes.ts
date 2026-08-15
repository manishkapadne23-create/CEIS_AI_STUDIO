import type { ExpertModeDefinition } from "./types";

export const EXPERT_MODES: ExpertModeDefinition[] = [
  {
    id: "design-expert",
    label: "Design Expert",
    description: "Design methodology, sizing, and standards-aligned engineering solutions.",
  },
  {
    id: "execution-expert",
    label: "Execution Expert",
    description: "Site execution, construction methods, and practical implementation guidance.",
  },
  {
    id: "planning-expert",
    label: "Planning Expert",
    description: "Project planning, scheduling, and resource coordination.",
  },
  {
    id: "qa-qc-expert",
    label: "QA/QC Expert",
    description: "Quality assurance, quality control, testing, and compliance verification.",
  },
  {
    id: "contract-expert",
    label: "Contract Expert",
    description: "Contract clauses, obligations, claims, and commercial engineering practice.",
  },
  {
    id: "tender-expert",
    label: "Tender Expert",
    description: "Tender evaluation, bid preparation, and procurement engineering support.",
  },
  {
    id: "estimation-expert",
    label: "Estimation Expert",
    description: "Cost estimation, BOQ, rate analysis, and quantity surveying support.",
  },
  {
    id: "project-management-expert",
    label: "Project Management Expert",
    description: "Project controls, risk, stakeholder management, and delivery oversight.",
  },
  {
    id: "maintenance-expert",
    label: "Maintenance Expert",
    description: "O&M planning, asset maintenance, and lifecycle engineering.",
  },
  {
    id: "research-expert",
    label: "Research Expert",
    description: "Technical research, literature review, and engineering investigation.",
  },
  {
    id: "teaching-expert",
    label: "Teaching Expert",
    description: "Concept teaching, worked examples, and engineering education support.",
  },
  {
    id: "interview-expert",
    label: "Interview Expert",
    description: "Interview preparation, technical Q&A, and professional practice coaching.",
  },
];

export const DEFAULT_EXPERT_MODE_ID = "design-expert" as const;

export const getExpertModeById = (id: string): ExpertModeDefinition =>
  EXPERT_MODES.find((mode) => mode.id === id) ?? EXPERT_MODES[0];
