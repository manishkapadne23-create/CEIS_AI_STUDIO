import {
  engineeringCalculatorPluginRegistry,
  registerCalculatorPlugin,
} from "../knowledge/calculators/plugins/calculatorPluginRegistry";
import type { EngineeringCalculatorPlugin } from "../knowledge/types/EngineeringCalculator";
import { pluginManager } from "./pluginManager";

export const bridgeCalculatorPluginsToFramework = (): void => {
  const calculatorPlugins = engineeringCalculatorPluginRegistry.list();

  calculatorPlugins.forEach((plugin: EngineeringCalculatorPlugin) => {
    registerCalculatorPlugin(plugin);
  });
};

export * from "./types";
export * from "./pluginRegistry";
export * from "./pluginLoader";
export * from "./pluginSandbox";
export * from "./pluginAPI";
export * from "./pluginMarketplace";
export * from "./pluginManager";
export { registerBuiltInPlugins } from "./builtInPlugins";

export const initializePluginFramework = async (): Promise<void> => {
  await pluginManager.initialize();
  bridgeCalculatorPluginsToFramework();
};
