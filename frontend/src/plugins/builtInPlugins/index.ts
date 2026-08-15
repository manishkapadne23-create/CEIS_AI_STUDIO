import { loadPlugin } from "../pluginLoader";
import type { SarathiPlugin } from "../types";

const checksumSignature = (id: string, version: string, author: string): string => {
  const payload = [id, version, author].join(":");
  let checksum = 0;
  for (let i = 0; i < payload.length; i++) {
    checksum = (checksum + payload.charCodeAt(i) * (i + 1)) % 1_000_000;
  }
  return `sarathi-${checksum}`;
};

const coreEngineeringPlugin: SarathiPlugin = {
  manifest: {
    id: "sarathi-core-engineering",
    name: "Sarathi Core Engineering",
    version: "1.0.0",
    author: "CEIS",
    description: "Core engineering intelligence plugin for Sarathi AI.",
    type: "engineering",
    supportedDisciplines: ["*"],
    supportedModules: ["*"],
    dependencies: [],
    permissions: ["read", "ai-access", "knowledge-access"],
    status: "installed",
    signature: checksumSignature("sarathi-core-engineering", "1.0.0", "CEIS"),
    storeCategory: "official",
  },
  contributions: {
    aiPrompts: [
      {
        id: "core-engineering-guidance",
        title: "Core Engineering Guidance",
        promptTemplate:
          "Apply discipline-aware engineering reasoning with safety and standards alignment.",
      },
    ],
  },
  getPromptAugmentation: ({ disciplineId }: { disciplineId: string | null; moduleId: string | null; userMessage: string }) =>
    disciplineId
      ? `Active plugin: Sarathi Core Engineering is augmenting guidance for discipline ${disciplineId}.`
      : "Active plugin: Sarathi Core Engineering is providing general engineering guidance.",
};

const standardsPlugin: SarathiPlugin = {
  manifest: {
    id: "sarathi-standards-pack",
    name: "Standards & Codes Pack",
    version: "1.0.0",
    author: "CEIS",
    description: "Standards metadata and compliance reference plugin.",
    type: "standards",
    supportedDisciplines: ["civil", "structural", "mechanical", "electrical"],
    supportedModules: ["standards", "compliance"],
    dependencies: ["sarathi-core-engineering"],
    permissions: ["read", "knowledge-access"],
    status: "installed",
    signature: checksumSignature("sarathi-standards-pack", "1.0.0", "CEIS"),
    storeCategory: "official",
  },
  contributions: {
    menuItems: [
      {
        id: "standards-pack-menu",
        label: "Standards Pack",
        path: "/workspace/standards",
      },
    ],
  },
};

const calculatorBridgePlugin: SarathiPlugin = {
  manifest: {
    id: "sarathi-calculator-bridge",
    name: "Calculator Bridge",
    version: "1.0.0",
    author: "CEIS",
    description: "Bridges calculator plugins into the Sarathi plugin framework.",
    type: "calculator",
    supportedDisciplines: ["*"],
    supportedModules: ["calculators"],
    dependencies: ["sarathi-core-engineering"],
    permissions: ["knowledge-access", "read"],
    status: "installed",
    signature: checksumSignature("sarathi-calculator-bridge", "1.0.0", "CEIS"),
    storeCategory: "official",
  },
  contributions: {
    calculators: [
      {
        id: "calculator-bridge",
        calculatorId: "engineering-calculators",
        title: "Engineering Calculators",
      },
    ],
  },
};

export const registerBuiltInPlugins = (): void => {
  [coreEngineeringPlugin, standardsPlugin, calculatorBridgePlugin].forEach(loadPlugin);
};
