import type {
  EngineeringReasoningResult,
  EngineeringReasoningSections,
  SarathiReasoningContext,
} from "./types";

const formatStandardReference = (
  standard: SarathiReasoningContext["retrieved"]["relevantStandards"][number]
): string =>
  `${standard.codeNumber} — ${standard.title} (${standard.publisher}, ${standard.edition})`;

const buildStandardsExplanation = (
  context: SarathiReasoningContext
): string => {
  const { retrieved, userQuestion, disciplinePrompt } = context;
  const primary = retrieved.relevantStandards[0];

  if (!primary) {
    return [
      `For ${disciplinePrompt.disciplineName}, standards selection depends on project jurisdiction, client specifications, and the governing authority.`,
      `Your question — "${userQuestion}" — should be mapped to the applicable code family (${disciplinePrompt.knowledgeScope.slice(0, 3).join(", ")}) before detailed clause-level review.`,
      "Use the Standards & Codes workspace to browse the discipline catalog and open standard summaries for scope and related codes.",
    ].join(" ");
  }

  const relatedCodes =
    retrieved.relevantStandards.length > 1
      ? ` Related standards in this context include ${retrieved.relevantStandards
          .slice(1, 4)
          .map((s) => s.codeNumber)
          .join(", ")}.`
      : "";

  return [
    `**${primary.codeNumber}** (${primary.publisher}, ${primary.edition}) addresses: ${primary.scope || primary.shortDescription}`,
    primary.importantNotes.length > 0
      ? `Key notes: ${primary.importantNotes.slice(0, 2).join(" ")}`
      : null,
    relatedCodes,
    `This guidance is derived from Sarathi standards metadata for ${disciplinePrompt.disciplineName} — verify against the official published standard before contractual or regulatory use.`,
  ]
    .filter(Boolean)
    .join(" ");
};

const buildCalculationExplanation = (
  context: SarathiReasoningContext
): string => {
  const { retrieved, userQuestion, disciplinePrompt, moduleSnapshot } = context;
  const calculator = retrieved.relevantCalculators[0];

  if (calculator) {
    return [
      `For "${userQuestion}" in ${disciplinePrompt.disciplineName}, the **${calculator.name}** calculator (${calculator.category}) is the closest match in the active workspace.`,
      calculator.description,
      "Before computing: (1) confirm input units and design basis, (2) list all assumptions, (3) run the calculation in the Calculators module, and (4) verify results against applicable standards.",
      moduleSnapshot.moduleId === "calculators"
        ? "You are in the Calculators module — expand the Calculator Library to open this tool directly."
        : "Switch to the Calculators module to access structured calculation forms.",
    ].join(" ");
  }

  return [
    `For "${userQuestion}", apply ${disciplinePrompt.disciplineName} calculation practice: ${disciplinePrompt.answerStyle}`,
    "Define the design basis, list known inputs with units, select the governing equation or code procedure, solve with stated assumptions, and perform a reasonableness check against experience or code limits.",
    "No exact calculator match was found — use the Calculators module to browse discipline-specific tools or request a step-by-step manual solution.",
  ].join(" ");
};

const buildDesignExplanation = (context: SarathiReasoningContext): string => {
  const { disciplinePrompt, userQuestion, retrieved, expertIntelligence } =
    context;

  return [
    `Approaching "${userQuestion}" as a ${disciplinePrompt.disciplineName} design task under **${expertIntelligence.activeExpertMode.label}** mode.`,
    `Relevant practice areas: ${disciplinePrompt.knowledgeScope.slice(0, 4).join("; ")}.`,
    retrieved.relevantStandards.length > 0
      ? `Design should comply with ${retrieved.relevantStandards
          .slice(0, 3)
          .map((s) => s.codeNumber)
          .join(", ")} as applicable to the project scope.`
      : `Confirm governing standards for ${context.runtimeContext.workspaceLabel} before finalizing design parameters.`,
    disciplinePrompt.answerStyle,
  ].join(" ");
};

const buildComplianceExplanation = (
  context: SarathiReasoningContext
): string => {
  const { retrieved, userQuestion, disciplinePrompt } = context;

  if (retrieved.relevantStandards.length === 0) {
    return `Compliance review for "${userQuestion}" requires identifying the controlling standard for ${disciplinePrompt.disciplineName} in ${context.engineeringContext.workspace.country}. Map project requirements to the discipline catalog, then verify mandatory clauses through the official standard.`;
  }

  return retrieved.relevantStandards
    .slice(0, 3)
    .map(
      (standard) =>
        `**${standard.codeNumber}**: ${standard.scope} Compliance checks should cover scope applicability, edition in force, local amendments, and project-specific deviations documented in the design basis.`
    )
    .join(" ");
};

const buildComparisonExplanation = (
  context: SarathiReasoningContext
): string => {
  const { retrieved, userQuestion } = context;
  const items = retrieved.relevantStandards.slice(0, 3);

  if (items.length < 2) {
    return `To compare options for "${userQuestion}", identify at least two standards, methods, or design alternatives. Sarathi can then contrast scope, applicability, and engineering trade-offs using discipline metadata.`;
  }

  return items
    .map(
      (standard, index) =>
        `${index + 1}. **${standard.codeNumber}** — ${standard.shortDescription || standard.scope}`
    )
    .join(" ");
};

const buildProcedureExplanation = (
  context: SarathiReasoningContext
): string => {
  const { userQuestion, disciplinePrompt, moduleSnapshot, expertIntelligence } =
    context;

  return [
    `Procedure for "${userQuestion}" in ${disciplinePrompt.disciplineName} (${moduleSnapshot.moduleTitle} context):`,
    `1. Confirm project inputs, codes (${context.engineeringContext.workspace.codes.join(", ") || "as applicable"}), and safety requirements.`,
    `2. Apply ${expertIntelligence.activeExpertMode.label} methodology — ${expertIntelligence.activeExpertMode.description}`,
    `3. Execute technical analysis using discipline practice: ${disciplinePrompt.knowledgeScope[0] ?? "core fundamentals"}.`,
    "4. Document assumptions, calculations, and compliance checks.",
    "5. Review outputs with a qualified professional before implementation.",
  ].join("\n");
};

const buildGeneralExplanation = (context: SarathiReasoningContext): string => {
  const {
    disciplinePrompt,
    userQuestion,
    engineeringContext,
    moduleSnapshot,
    expertIntelligence,
  } = context;

  const specializationNote = engineeringContext.knowledge.specialization
    ? `Specialization context: **${engineeringContext.knowledge.specialization}**.`
    : "";

  const overviewNote = engineeringContext.knowledge.overview
    ? engineeringContext.knowledge.overview.slice(0, 280)
    : disciplinePrompt.knowledgeScope.join("; ");

  return [
    `Answering "${userQuestion}" as **${disciplinePrompt.disciplineName}** guidance within the **${moduleSnapshot.moduleTitle}** module.`,
    specializationNote,
    overviewNote,
    `${expertIntelligence.activeExpertMode.label}: ${expertIntelligence.activeExpertMode.description}`,
    disciplinePrompt.answerStyle,
  ]
    .filter(Boolean)
    .join(" ");
};

const buildExplanation = (context: SarathiReasoningContext): string => {
  switch (context.queryIntent) {
    case "standards-inquiry":
      return buildStandardsExplanation(context);
    case "calculation":
      return buildCalculationExplanation(context);
    case "design":
      return buildDesignExplanation(context);
    case "compliance":
      return buildComplianceExplanation(context);
    case "comparison":
      return buildComparisonExplanation(context);
    case "procedure":
      return buildProcedureExplanation(context);
    default:
      return buildGeneralExplanation(context);
  }
};

const buildConsiderations = (
  context: SarathiReasoningContext
): string[] => {
  const { disciplinePrompt, moduleSnapshot, engineeringContext, queryIntent } =
    context;

  const enabledCapabilities = engineeringContext.capabilities
    .filter((capability) => capability.enabled)
    .slice(0, 3)
    .map((capability) => capability.label);

  const base = [
    `Active workspace: ${context.runtimeContext.workspaceLabel} (${moduleSnapshot.moduleTitle}).`,
    `Query classified as **${queryIntent.replace("-", " ")}** — responses follow ${disciplinePrompt.disciplineName} practice.`,
    ...disciplinePrompt.safetyRules.slice(0, 2),
    ...moduleSnapshot.moduleGuidance.slice(0, 1),
  ];

  if (enabledCapabilities.length > 0) {
    base.push(
      `Enabled discipline capabilities: ${enabledCapabilities.join(", ")}.`
    );
  }

  if (context.retrieved.mentionedStandardCodes.length > 0) {
    base.push(
      `Referenced codes in your message: ${context.retrieved.mentionedStandardCodes.join(", ")}.`
    );
  }

  return base;
};

const buildCalculationNotes = (
  context: SarathiReasoningContext
): string[] => {
  if (
    context.queryIntent !== "calculation" &&
    context.moduleSnapshot.moduleId !== "calculators"
  ) {
    return [];
  }

  const notes = [
    "State all input values with SI or project units before solving.",
    "Document factor of safety, load combinations, or code factors as applicable.",
  ];

  context.retrieved.relevantCalculators.forEach((calculator) => {
    notes.push(
      `Calculator available: **${calculator.name}** (${calculator.status}) — ${calculator.description}`
    );
  });

  if (context.retrieved.relevantCalculators.length === 0) {
    notes.push(
      "No automated calculator matched — provide manual step-by-step solution with verification."
    );
  }

  return notes;
};

const buildRecommendations = (
  context: SarathiReasoningContext
): string[] => {
  const { moduleSnapshot, retrieved, disciplinePrompt } = context;
  const recommendations = [
    `Validate this guidance against project specifications and ${disciplinePrompt.disciplineName} governing standards.`,
    "Escalate safety-critical decisions to a licensed professional engineer.",
  ];

  if (moduleSnapshot.moduleId === "standards" && retrieved.relevantStandards[0]) {
    recommendations.push(
      `Open **${retrieved.relevantStandards[0].codeNumber}** in the right panel for full scope, related codes, and revision notes.`
    );
  }

  if (
    moduleSnapshot.moduleId === "calculators" &&
    retrieved.relevantCalculators[0]
  ) {
    recommendations.push(
      `Use the **${retrieved.relevantCalculators[0].name}** calculator from the Calculator Library for structured inputs and outputs.`
    );
  }

  if (context.followUpIntent) {
    recommendations.push(
      "This continues a prior thread — confirm earlier assumptions still apply before acting on updated guidance."
    );
  }

  return recommendations;
};

export const generateEngineeringReasoning = (
  context: SarathiReasoningContext
): EngineeringReasoningResult => {
  const { expertIntelligence, retrieved, userQuestion, followUpIntent } =
    context;

  const applicableStandards =
    retrieved.relevantStandards.length > 0
      ? retrieved.relevantStandards.map(formatStandardReference)
      : context.engineeringContext.standards
          .slice(0, 4)
          .map((standard) => `${standard.code} — ${standard.title}`);

  const sections: EngineeringReasoningSections = {
    summary: `${expertIntelligence.activeExpertMode.label} guidance for ${expertIntelligence.disciplineName} (${context.moduleSnapshot.moduleTitle})${followUpIntent ? " — follow-up" : ""}.`,
    explanation: buildExplanation(context),
    engineeringConsiderations: buildConsiderations(context),
    applicableStandards,
    calculationNotes: buildCalculationNotes(context),
    practicalRecommendations: buildRecommendations(context),
    references: applicableStandards.map(
      (standard) => `${standard} (Sarathi metadata — verify official publication)`
    ),
  };

  return {
    sections,
    reasoningContext: context,
    systemPromptAugmentation: [
      "Reasoning context applied:",
      `- Discipline: ${expertIntelligence.disciplineName}`,
      `- Module: ${context.moduleSnapshot.moduleTitle}`,
      `- Intent: ${context.queryIntent}`,
      `- Standards matched: ${retrieved.relevantStandards.length}`,
      `- Calculators matched: ${retrieved.relevantCalculators.length}`,
      `- Question: ${userQuestion}`,
    ].join("\n"),
  };
};
