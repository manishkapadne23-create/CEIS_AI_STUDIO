export interface DisciplineDefinition {
  id: string;
  name: string;
}

export const DISCIPLINE_DEFINITIONS: DisciplineDefinition[] = [
  { id: "civil-engineering", name: "Civil Engineering" },
  { id: "mechanical-engineering", name: "Mechanical Engineering" },
  { id: "electrical-engineering", name: "Electrical Engineering" },
  { id: "computer-engineering", name: "Computer Engineering" },
  {
    id: "electronics-telecommunication-engineering",
    name: "Electronics & Telecommunication",
  },
  { id: "chemical-engineering", name: "Chemical Engineering" },
  { id: "environmental-engineering", name: "Environmental Engineering" },
  { id: "mining-engineering", name: "Mining Engineering" },
  { id: "marine-engineering", name: "Marine Engineering" },
  { id: "aerospace-engineering", name: "Aerospace Engineering" },
  { id: "railway-engineering", name: "Railway Engineering" },
  { id: "industrial-engineering", name: "Industrial Engineering" },
  { id: "automation-robotics", name: "Automation & Robotics" },
  { id: "renewable-energy", name: "Renewable Energy" },
  { id: "architecture-planning", name: "Architecture & Planning" },
  { id: "agricultural-engineering", name: "Agricultural Engineering" },
  { id: "biomedical-engineering", name: "Biomedical Engineering" },
  { id: "oil-gas-engineering", name: "Oil & Gas Engineering" },
];
