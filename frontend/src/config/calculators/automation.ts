import { createDisciplineCalculatorsCatalog } from "./createCalculatorEntry";

export const automationCalculatorsCatalog = createDisciplineCalculatorsCatalog(
  "automation-robotics",
  "Automation & Robotics",
  [
    {
      name: "Servo Selection",
      category: "Motion Control",
      description:
        "Servo motor torque and speed selection for automation applications.",
      isPopular: true,
    },
    {
      name: "Robot Reach",
      category: "Robotics",
      description:
        "Robot workspace reach and payload capacity for manipulator selection.",
      isPopular: true,
    },
    {
      name: "PLC IO Count",
      category: "Control Systems",
      description:
        "PLC input/output module count for automation and control panels.",
      isPopular: true,
    },
  ]
);
