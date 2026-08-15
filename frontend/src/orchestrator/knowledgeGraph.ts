import {
  getCalculatorsCatalogByDisciplineId,
  searchCalculatorsMetadata,
} from "../config/calculators";
import {
  getStandardsCatalogByDisciplineId,
  searchStandardsMetadata,
} from "../config/standards";
import { getActiveAgent } from "../agents";
import { searchEngineeringKnowledge } from "../knowledge";
import { getProfessionalToolsRegistry } from "../knowledge/professional-tools/professionalToolsRegistry";
import { getWorkflowsForDiscipline, searchWorkflows } from "../workflows";
import type {
  EngineeringKnowledgeGraph,
  EngineeringIntent,
  KnowledgeGraphEdge,
  KnowledgeGraphNode,
} from "./types";

const inferTopic = (message: string, intent: EngineeringIntent): string => {
  const normalized = message.trim().slice(0, 120);
  if (normalized.length > 0) return normalized;
  return intent.replace(/-/g, " ");
};

export const buildEngineeringKnowledgeGraph = (
  message: string,
  disciplineId: string | null,
  disciplineName: string | null,
  intent: EngineeringIntent
): EngineeringKnowledgeGraph => {
  const topic = inferTopic(message, intent);
  const nodes: KnowledgeGraphNode[] = [];
  const edges: KnowledgeGraphEdge[] = [];

  const topicNodeId = "topic-root";
  nodes.push({
    id: topicNodeId,
    type: "topic",
    label: topic,
    description: `Engineering topic (${intent})`,
  });

  if (!disciplineId) {
    return { topic, nodes, edges };
  }

  const standardsCatalog = getStandardsCatalogByDisciplineId(disciplineId);
  const rankedStandards = searchStandardsMetadata(
    standardsCatalog?.standards ?? [],
    message,
    disciplineName
  ).slice(0, 4);

  for (const standard of rankedStandards) {
    const nodeId = `std-${standard.id}`;
    nodes.push({
      id: nodeId,
      type: "standard",
      label: standard.codeNumber,
      description: standard.title,
      moduleId: "standards",
      resourceId: standard.id,
    });
    edges.push({
      from: topicNodeId,
      to: nodeId,
      relationship: "governed-by",
    });
  }

  const calculatorsCatalog = getCalculatorsCatalogByDisciplineId(disciplineId);
  const rankedCalculators = searchCalculatorsMetadata(
    calculatorsCatalog?.calculators ?? [],
    message,
    disciplineName
  ).slice(0, 4);

  for (const calculator of rankedCalculators) {
    const nodeId = `calc-${calculator.id}`;
    nodes.push({
      id: nodeId,
      type: "calculator",
      label: calculator.name,
      description: calculator.description,
      moduleId: "calculators",
      resourceId: calculator.id,
    });
    edges.push({
      from: topicNodeId,
      to: nodeId,
      relationship: "calculated-with",
    });
  }

  const workflows = searchWorkflows(message, disciplineId).slice(0, 3);
  const workflowList =
    workflows.length > 0
      ? workflows
      : getWorkflowsForDiscipline(disciplineId, disciplineName).slice(0, 3);

  for (const workflow of workflowList) {
    const nodeId = `wf-${workflow.id}`;
    nodes.push({
      id: nodeId,
      type: "workflow",
      label: workflow.title,
      description: workflow.objective,
      moduleId: "professional-tools",
      resourceId: workflow.id,
    });
    edges.push({
      from: topicNodeId,
      to: nodeId,
      relationship: "follows-workflow",
    });
  }

  const toolsRegistry = getProfessionalToolsRegistry(disciplineId);
  const tools =
    toolsRegistry?.categories.flatMap((category) => category.tools).slice(0, 4) ??
    [];

  for (const tool of tools) {
    const nodeId = `tool-${tool.id}`;
    nodes.push({
      id: nodeId,
      type: "professional-tool",
      label: tool.title,
      description: tool.description,
      moduleId: "professional-tools",
      resourceId: tool.id,
    });
    edges.push({
      from: topicNodeId,
      to: nodeId,
      relationship: "uses-tool",
    });
  }

  const knowledgeResults = searchEngineeringKnowledge(message, {
    disciplineId,
    limit: 4,
  });

  for (const result of knowledgeResults) {
    const nodeId = `know-${result.resourceId ?? result.title}`;
    const isLearning =
      result.type === "knowledge" &&
      "moduleId" in result &&
      result.moduleId === "learning-hub";

    nodes.push({
      id: nodeId,
      type: isLearning ? "learning-resource" : "document",
      label: result.title,
      description: result.subtitle ?? undefined,
      moduleId: isLearning ? "learning-hub" : "documents",
      resourceId: result.resourceId,
    });
    edges.push({
      from: topicNodeId,
      to: nodeId,
      relationship: isLearning ? "learn-from" : "references",
    });
  }

  const activeAgent = getActiveAgent();
  if (activeAgent) {
    const agentNodeId = `agent-${activeAgent.id}`;
    nodes.push({
      id: agentNodeId,
      type: "topic",
      label: activeAgent.name,
      description: activeAgent.description,
      moduleId: "ai-expert",
      resourceId: activeAgent.id,
    });
    edges.push({
      from: topicNodeId,
      to: agentNodeId,
      relationship: "handled-by-agent",
    });
  }

  for (const standard of rankedStandards.slice(0, 2)) {
    for (const calculator of rankedCalculators.slice(0, 2)) {
      edges.push({
        from: `std-${standard.id}`,
        to: `calc-${calculator.id}`,
        relationship: "supports-calculation",
      });
    }
  }

  return { topic, nodes, edges };
};

export const formatKnowledgeGraphForPrompt = (
  graph: EngineeringKnowledgeGraph
): string => {
  if (graph.nodes.length <= 1) {
    return "Knowledge graph: No related resources resolved for this discipline.";
  }

  const nodeLines = graph.nodes
    .filter((node) => node.id !== "topic-root")
    .slice(0, 12)
    .map((node) => `- [${node.type}] ${node.label}${node.description ? `: ${node.description}` : ""}`);

  const edgeLines = graph.edges
    .slice(0, 10)
    .map((edge) => {
      const from = graph.nodes.find((n) => n.id === edge.from)?.label ?? edge.from;
      const to = graph.nodes.find((n) => n.id === edge.to)?.label ?? edge.to;
      return `- ${from} → ${to} (${edge.relationship})`;
    });

  return [
    `Topic: ${graph.topic}`,
    "Related resources:",
    ...nodeLines,
    "",
    "Relationships:",
    ...edgeLines,
  ].join("\n");
};
