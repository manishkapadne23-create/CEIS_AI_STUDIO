import { createDisciplineCalculatorsCatalog } from "./createCalculatorEntry";

export const biomedicalCalculatorsCatalog = createDisciplineCalculatorsCatalog(
  "biomedical-engineering",
  "Biomedical Engineering",
  [
    {
      name: "Dosage",
      category: "Clinical",
      description:
        "Drug dosage calculations based on patient weight and concentration.",
      isPopular: true,
    },
    {
      name: "Biomedical Signals",
      category: "Signal Analysis",
      description:
        "ECG, EEG, and physiological signal parameter extraction and analysis.",
      isPopular: true,
    },
    {
      name: "Equipment Calibration",
      category: "Medical Devices",
      description:
        "Calibration intervals and tolerance checks for biomedical equipment.",
      isPopular: true,
    },
  ]
);
