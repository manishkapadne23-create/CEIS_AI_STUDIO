import { createDisciplineCalculatorsCatalog } from "./createCalculatorEntry";

export const environmentalCalculatorsCatalog =
  createDisciplineCalculatorsCatalog(
    "environmental-engineering",
    "Environmental Engineering",
    [
      {
        name: "STP Design",
        category: "Wastewater",
        description:
          "Sewage treatment plant capacity and process unit sizing.",
        isPopular: true,
      },
      {
        name: "WTP Design",
        category: "Water Treatment",
        description:
          "Water treatment plant flow and unit process design parameters.",
        isPopular: true,
      },
      {
        name: "Air Quality Index",
        category: "Air Quality",
        description:
          "AQI calculation from pollutant concentrations for ambient monitoring.",
        isPopular: true,
      },
      {
        name: "Emission Calculator",
        category: "Air Quality",
        description:
          "Stack and fugitive emission rate estimation for industrial sources.",
      },
      {
        name: "Noise Level",
        category: "Noise & Vibration",
        description:
          "Sound level addition and attenuation for environmental compliance.",
      },
    ]
  );
