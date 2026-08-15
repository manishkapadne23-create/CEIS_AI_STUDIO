import type {
  EngineeringCalculatorPlugin,
  EngineeringCalculatorPluginRegistry,
} from "../../types/EngineeringCalculator";

const pluginMap: Record<string, EngineeringCalculatorPlugin> = {};

export const engineeringCalculatorPluginRegistry: EngineeringCalculatorPluginRegistry =
  {
    plugins: pluginMap,
    register(plugin: EngineeringCalculatorPlugin) {
      pluginMap[plugin.calculatorId] = plugin;
    },
    get(calculatorId: string) {
      return pluginMap[calculatorId];
    },
    has(calculatorId: string) {
      return Boolean(pluginMap[calculatorId]);
    },
    list() {
      return Object.values(pluginMap);
    },
  };

export const registerCalculatorPlugin = (
  plugin: EngineeringCalculatorPlugin
): void => {
  engineeringCalculatorPluginRegistry.register(plugin);
};

export const getCalculatorPlugin = (
  calculatorId: string
): EngineeringCalculatorPlugin | undefined =>
  engineeringCalculatorPluginRegistry.get(calculatorId);
