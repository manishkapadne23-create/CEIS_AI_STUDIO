import {
  ENGINEERING_CAPABILITY_KEYS,
  ENGINEERING_CAPABILITY_LABELS,
  type EngineeringCapability,
  type EngineeringCapabilityRegistry,
} from "../../types/EngineeringCapability";

const createCivilCapability = (
  key: EngineeringCapability["key"],
  description: string,
  status: EngineeringCapability["status"] = "available",
  enabled = true
): EngineeringCapability => ({
  id: key,
  key,
  label: ENGINEERING_CAPABILITY_LABELS[key],
  description,
  enabled,
  status,
});

export const civilEngineeringCapabilityRegistry: EngineeringCapabilityRegistry =
  {
    disciplineId: "civil-engineering",
    disciplineName: "Civil Engineering",
    capabilities: [
      createCivilCapability(
        ENGINEERING_CAPABILITY_KEYS.aiChat,
        "Discipline-aware AI chat with civil engineering workspace context, IRC codes, and project guidance."
      ),
      createCivilCapability(
        ENGINEERING_CAPABILITY_KEYS.knowledge,
        "Structured civil engineering knowledge tree with branches, specializations, and highway engineering content."
      ),
      createCivilCapability(
        ENGINEERING_CAPABILITY_KEYS.standards,
        "IRC, IS, and MORTH standards catalog for highways, bridges, structures, and materials."
      ),
      createCivilCapability(
        ENGINEERING_CAPABILITY_KEYS.documentIntelligence,
        "Analyze DPRs, BOQs, tender documents, and technical reports for civil projects.",
        "beta"
      ),
      createCivilCapability(
        ENGINEERING_CAPABILITY_KEYS.professionalTools,
        "BOQ preparation, estimation, geometric design checks, and project documentation tools.",
        "beta"
      ),
      createCivilCapability(
        ENGINEERING_CAPABILITY_KEYS.calculators,
        "Pavement design, superelevation, sight distance, and earthwork volume calculators."
      ),
      createCivilCapability(
        ENGINEERING_CAPABILITY_KEYS.templates,
        "DPR, geometric design report, BOQ, safety audit, and tender document templates."
      ),
      createCivilCapability(
        ENGINEERING_CAPABILITY_KEYS.learning,
        "IRC code library, MORTH manuals, pavement notes, courses, and exam MCQs."
      ),
      createCivilCapability(
        ENGINEERING_CAPABILITY_KEYS.aiEngineeringAgents,
        "Specialized agents for pavement design, geometric design, BOQ estimation, DPR drafting, and IRC interpretation."
      ),
    ],
  };
