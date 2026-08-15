import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const configDir = join(dirname(fileURLToPath(import.meta.url)), "config");

const readJson = <T>(fileName: string): T =>
  JSON.parse(readFileSync(join(configDir, fileName), "utf-8")) as T;

export interface IntentConfigEntry {
  id: string;
  label: string;
  patterns: string[];
  priority: number;
}

export interface ModuleConfigEntry {
  id: string;
  label: string;
  description: string;
  priority: number;
  fallbackModuleId: string | null;
  active: boolean;
}

export interface RoutingRuleEntry {
  intentId: string;
  modules: Array<{
    moduleId: string;
    role: string;
    priority: number;
    reason: string;
  }>;
}

export interface TaskTemplateEntry {
  id: string;
  label: string;
  triggerPatterns: string[];
  steps: Array<{ order: number; moduleId: string; action: string }>;
}

export interface TopicPatternEntry {
  pattern: string;
  disciplineId: string;
  disciplineName: string;
  specializationId: string;
  specializationName: string;
  topic: string;
}

export const loadIntentConfig = () =>
  readJson<{ intents: IntentConfigEntry[] }>("intents.json").intents;

export const loadModuleConfig = () =>
  readJson<{ modules: ModuleConfigEntry[] }>("modules.json").modules.filter(
    (module) => module.active
  );

export const loadRoutingRules = () =>
  readJson<{ routes: RoutingRuleEntry[] }>("routingRules.json").routes;

export const loadTaskTemplates = () =>
  readJson<{ templates: TaskTemplateEntry[] }>("taskTemplates.json").templates;

export const loadTopicPatterns = () =>
  readJson<{ patterns: TopicPatternEntry[] }>("topicPatterns.json").patterns;

export const getOrchestratorPublicConfig = () => ({
  engine: "Engineering Orchestrator Engine",
  version: "1.0.0",
  intents: loadIntentConfig(),
  modules: loadModuleConfig(),
  routingRules: loadRoutingRules(),
  taskTemplates: loadTaskTemplates(),
  topicPatterns: loadTopicPatterns(),
});
