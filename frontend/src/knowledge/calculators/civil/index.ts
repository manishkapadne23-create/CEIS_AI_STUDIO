import type {
  EngineeringCalculator,
  EngineeringCalculatorCategoryKey,
  EngineeringCalculatorRegistry,
  EngineeringCalculatorStatus,
} from "../../types/EngineeringCalculator";
import { ENGINEERING_CALCULATOR_CATEGORY_KEYS } from "../../types/EngineeringCalculator";
import { buildCalculatorRegistry } from "../../utils/buildCalculatorRegistry";

const createCivilCalculator = (
  id: string,
  title: string,
  description: string,
  category: EngineeringCalculatorCategoryKey,
  options: {
    status?: EngineeringCalculatorStatus;
    enabled?: boolean;
    specializationId?: string;
    pluginId: string;
    standards: EngineeringCalculator["standards"];
    inputs: EngineeringCalculator["inputs"];
    outputs: EngineeringCalculator["outputs"];
  }
): EngineeringCalculator => ({
  id,
  key: id,
  title,
  description,
  category,
  status: options.status ?? "available",
  enabled: options.enabled ?? true,
  disciplineId: "civil-engineering",
  specializationId: options.specializationId,
  pluginId: options.pluginId,
  standards: options.standards,
  inputs: options.inputs,
  outputs: options.outputs,
});

const civilCalculators: EngineeringCalculator[] = [
  createCivilCalculator(
    "flexible-pavement",
    "Flexible Pavement Calculator",
    "Pavement layer thickness design based on CBR and traffic loading per IRC:37.",
    ENGINEERING_CALCULATOR_CATEGORY_KEYS.pavement,
    {
      specializationId: "highway-engineering",
      pluginId: "ceis.calculator.flexible-pavement",
      standards: [
        { code: "IRC:37", title: "Flexible Pavement Design" },
        { code: "MORTH", title: "Road Works Specifications" },
      ],
      inputs: [
        {
          id: "subgrade-cbr",
          label: "Subgrade CBR",
          type: "number",
          unit: "%",
          required: true,
        },
        {
          id: "commercial-vehicle-count",
          label: "Commercial Vehicles Per Day",
          type: "number",
          required: true,
        },
        {
          id: "design-life",
          label: "Design Life",
          type: "number",
          unit: "years",
          defaultValue: 15,
          required: true,
        },
      ],
      outputs: [
        {
          id: "total-pavement-thickness",
          label: "Total Pavement Thickness",
          unit: "mm",
        },
        {
          id: "layer-composition",
          label: "Recommended Layer Composition",
        },
      ],
    }
  ),
  createCivilCalculator(
    "superelevation",
    "Superelevation Calculator",
    "Computes superelevation rates for horizontal curves per IRC geometric standards.",
    ENGINEERING_CALCULATOR_CATEGORY_KEYS.geometric,
    {
      specializationId: "highway-engineering",
      pluginId: "ceis.calculator.superelevation",
      standards: [
        { code: "IRC:73", title: "Rural Highways Geometric Design" },
        { code: "IRC:86", title: "Urban Highways Geometric Design" },
      ],
      inputs: [
        {
          id: "design-speed",
          label: "Design Speed",
          type: "number",
          unit: "km/h",
          required: true,
        },
        {
          id: "radius",
          label: "Curve Radius",
          type: "number",
          unit: "m",
          required: true,
        },
      ],
      outputs: [
        {
          id: "superelevation-rate",
          label: "Superelevation Rate",
          unit: "%",
        },
        {
          id: "max-safe-speed",
          label: "Maximum Safe Speed",
          unit: "km/h",
        },
      ],
    }
  ),
  createCivilCalculator(
    "sight-distance",
    "Sight Distance Calculator",
    "Stopping, overtaking, and intersection sight distance checks.",
    ENGINEERING_CALCULATOR_CATEGORY_KEYS.geometric,
    {
      specializationId: "highway-engineering",
      pluginId: "ceis.calculator.sight-distance",
      standards: [
        { code: "IRC:66", title: "Sight Distance on Highways" },
      ],
      inputs: [
        {
          id: "design-speed",
          label: "Design Speed",
          type: "number",
          unit: "km/h",
          required: true,
        },
        {
          id: "gradient",
          label: "Longitudinal Gradient",
          type: "number",
          unit: "%",
          defaultValue: 0,
        },
        {
          id: "sight-distance-type",
          label: "Sight Distance Type",
          type: "select",
          required: true,
          options: [
            { value: "ssd", label: "Stopping Sight Distance" },
            { value: "osd", label: "Overtaking Sight Distance" },
          ],
        },
      ],
      outputs: [
        {
          id: "required-sight-distance",
          label: "Required Sight Distance",
          unit: "m",
        },
      ],
    }
  ),
  createCivilCalculator(
    "earthwork",
    "Earthwork Volume Calculator",
    "Cut and fill volume estimation from cross-sections.",
    ENGINEERING_CALCULATOR_CATEGORY_KEYS.earthwork,
    {
      specializationId: "highway-engineering",
      pluginId: "ceis.calculator.earthwork",
      standards: [
        { code: "MORTH", title: "Earthwork Measurement" },
      ],
      inputs: [
        {
          id: "chainage-interval",
          label: "Chainage Interval",
          type: "number",
          unit: "m",
          defaultValue: 20,
          required: true,
        },
        {
          id: "average-end-area",
          label: "Average End Area Method",
          type: "boolean",
          defaultValue: true,
        },
      ],
      outputs: [
        {
          id: "cut-volume",
          label: "Cut Volume",
          unit: "m³",
        },
        {
          id: "fill-volume",
          label: "Fill Volume",
          unit: "m³",
        },
        {
          id: "net-volume",
          label: "Net Volume",
          unit: "m³",
        },
      ],
    }
  ),
  createCivilCalculator(
    "super-elevation-transition",
    "Transition Length Calculator",
    "Length of superelevation runoff and tangent transitions for highway alignments.",
    ENGINEERING_CALCULATOR_CATEGORY_KEYS.geometric,
    {
      specializationId: "highway-engineering",
      pluginId: "ceis.calculator.transition-length",
      standards: [
        { code: "IRC:73", title: "Superelevation Transition" },
      ],
      inputs: [
        {
          id: "design-speed",
          label: "Design Speed",
          type: "number",
          unit: "km/h",
          required: true,
        },
        {
          id: "superelevation-rate",
          label: "Superelevation Rate",
          type: "number",
          unit: "%",
          required: true,
        },
        {
          id: "rotation-rate",
          label: "Rotation Rate",
          type: "number",
          unit: "%/s",
          defaultValue: 0.05,
        },
      ],
      outputs: [
        {
          id: "transition-length",
          label: "Transition Length",
          unit: "m",
        },
        {
          id: "runoff-length",
          label: "Superelevation Runoff Length",
          unit: "m",
        },
      ],
    }
  ),
];

export const civilEngineeringCalculatorRegistry: EngineeringCalculatorRegistry =
  buildCalculatorRegistry(
    "civil-engineering",
    "Civil Engineering",
    civilCalculators
  );
