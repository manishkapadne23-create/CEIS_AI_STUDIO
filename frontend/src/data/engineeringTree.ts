export interface EngineeringNode {
  id: string;
  name: string;
  icon?: string;
  children?: EngineeringNode[];
}

const specialization = (id: string, name: string): EngineeringNode => ({
  id,
  name,
});

export const engineeringTree: EngineeringNode[] = [
  {
    id: "civil-engineering",
    name: "Civil Engineering",
    children: [
      specialization("structural-engineering", "Structural Engineering"),
      {
        id: "transportation-engineering",
        name: "Transportation Engineering",
        children: [
          specialization("highway-engineering", "Highway Engineering"),
          specialization("bridge-engineering", "Bridge Engineering"),
          specialization("pavement-engineering", "Pavement Engineering"),
          specialization("tunnel-engineering", "Tunnel Engineering"),
          specialization(
            "transportation-railway-engineering",
            "Railway Engineering"
          ),
          specialization("airport-engineering", "Airport Engineering"),
          specialization("traffic-engineering", "Traffic Engineering"),
          specialization("road-safety-engineering", "Road Safety Engineering"),
          specialization(
            "intelligent-transportation-systems",
            "Intelligent Transportation Systems"
          ),
        ],
      },
      specialization("geotechnical-engineering", "Geotechnical Engineering"),
      specialization(
        "water-resources-hydraulic-engineering",
        "Water Resources & Hydraulic Engineering"
      ),
      specialization(
        "civil-environmental-engineering",
        "Environmental Engineering"
      ),
      specialization(
        "construction-engineering-management",
        "Construction Engineering & Management"
      ),
      specialization("surveying-geomatics", "Surveying & Geomatics"),
      specialization(
        "urban-infrastructure-engineering",
        "Urban & Infrastructure Engineering"
      ),
      specialization(
        "coastal-marine-engineering",
        "Coastal & Marine Engineering"
      ),
      specialization("materials-engineering", "Materials Engineering"),
      specialization(
        "digital-construction-engineering",
        "Digital Construction Engineering"
      ),
      specialization("building-engineering", "Building Engineering"),
      specialization("pipeline-engineering", "Pipeline Engineering"),
    ],
  },
  {
    id: "mechanical-engineering",
    name: "Mechanical Engineering",
    children: [
      specialization("design-engineering", "Design Engineering"),
      specialization(
        "manufacturing-engineering",
        "Manufacturing Engineering"
      ),
      specialization("thermal-engineering", "Thermal Engineering"),
      specialization("automobile-engineering", "Automobile Engineering"),
      specialization("hvac-engineering", "HVAC Engineering"),
      specialization(
        "mechanical-industrial-engineering",
        "Industrial Engineering"
      ),
      specialization("mechatronics", "Mechatronics"),
      specialization("robotics", "Robotics"),
      specialization("production-engineering", "Production Engineering"),
      specialization("maintenance-engineering", "Maintenance Engineering"),
    ],
  },
  {
    id: "electrical-engineering",
    name: "Electrical Engineering",
    children: [
      specialization("power-systems", "Power Systems"),
      specialization("electrical-machines", "Electrical Machines"),
      specialization("high-voltage-engineering", "High Voltage Engineering"),
      specialization("power-electronics", "Power Electronics"),
      specialization("control-systems", "Control Systems"),
      specialization("instrumentation", "Instrumentation"),
      specialization("electrical-renewable-energy", "Renewable Energy"),
      specialization("smart-grid", "Smart Grid"),
      specialization(
        "transmission-distribution",
        "Transmission & Distribution"
      ),
    ],
  },
  {
    id: "computer-engineering",
    name: "Computer Engineering",
    children: [
      specialization("software-engineering", "Software Engineering"),
      specialization("artificial-intelligence", "Artificial Intelligence"),
      specialization("machine-learning", "Machine Learning"),
      specialization("data-science", "Data Science"),
      specialization("cyber-security", "Cyber Security"),
      specialization("cloud-computing", "Cloud Computing"),
      specialization("database-systems", "Database Systems"),
      specialization("networking", "Networking"),
      specialization("web-development", "Web Development"),
      specialization("mobile-development", "Mobile Development"),
    ],
  },
  {
    id: "electronics-telecommunication-engineering",
    name: "Electronics & Telecommunication",
    children: [
      specialization("analog-electronics", "Analog Electronics"),
      specialization("digital-electronics", "Digital Electronics"),
      specialization("communication-systems", "Communication Systems"),
      specialization("embedded-systems", "Embedded Systems"),
      specialization("internet-of-things", "Internet of Things (IoT)"),
      specialization("vlsi-design", "VLSI Design"),
      specialization("signal-processing", "Signal Processing"),
      specialization("wireless-communication", "Wireless Communication"),
      specialization("optical-communication", "Optical Communication"),
    ],
  },
  {
    id: "chemical-engineering",
    name: "Chemical Engineering",
    children: [
      specialization("process-engineering", "Process Engineering"),
      specialization("plant-design", "Plant Design"),
      specialization("petrochemical-engineering", "Petrochemical Engineering"),
      specialization("polymer-engineering", "Polymer Engineering"),
      specialization("fertilizer-technology", "Fertilizer Technology"),
      specialization(
        "chemical-reaction-engineering",
        "Chemical Reaction Engineering"
      ),
      specialization("heat-transfer", "Heat Transfer"),
      specialization("mass-transfer", "Mass Transfer"),
      specialization("process-safety", "Process Safety"),
    ],
  },
  {
    id: "environmental-engineering",
    name: "Environmental Engineering",
    children: [
      specialization("water-treatment", "Water Treatment"),
      specialization("wastewater-engineering", "Wastewater Engineering"),
      specialization("air-pollution-control", "Air Pollution Control"),
      specialization("solid-waste-management", "Solid Waste Management"),
      specialization(
        "environmental-impact-assessment",
        "Environmental Impact Assessment"
      ),
      specialization("climate-change", "Climate Change"),
      specialization("sustainability", "Sustainability"),
      specialization("environmental-monitoring", "Environmental Monitoring"),
    ],
  },
  {
    id: "mining-engineering",
    name: "Mining Engineering",
    children: [
      specialization("surface-mining", "Surface Mining"),
      specialization("underground-mining", "Underground Mining"),
      specialization("mine-planning", "Mine Planning"),
      specialization("rock-mechanics", "Rock Mechanics"),
      specialization("mineral-processing", "Mineral Processing"),
      specialization("mine-safety", "Mine Safety"),
      specialization("blasting-engineering", "Blasting Engineering"),
    ],
  },
  {
    id: "marine-engineering",
    name: "Marine Engineering",
    children: [
      specialization("ship-design", "Ship Design"),
      specialization("ship-construction", "Ship Construction"),
      specialization("marine-machinery", "Marine Machinery"),
      specialization("offshore-engineering", "Offshore Engineering"),
      specialization("port-engineering", "Port Engineering"),
      specialization("naval-architecture", "Naval Architecture"),
    ],
  },
  {
    id: "aerospace-engineering",
    name: "Aerospace Engineering",
    children: [
      specialization("aerodynamics", "Aerodynamics"),
      specialization("aircraft-structures", "Aircraft Structures"),
      specialization("propulsion-systems", "Propulsion Systems"),
      specialization("flight-mechanics", "Flight Mechanics"),
      specialization("space-engineering", "Space Engineering"),
      specialization("avionics", "Avionics"),
    ],
  },
  {
    id: "railway-engineering",
    name: "Railway Engineering",
    children: [
      specialization("track-engineering", "Track Engineering"),
      specialization("railway-bridges", "Railway Bridges"),
      specialization("railway-signalling", "Railway Signalling"),
      specialization("electrification", "Electrification"),
      specialization("rolling-stock", "Rolling Stock"),
      specialization("metro-systems", "Metro Systems"),
    ],
  },
  {
    id: "architecture-planning",
    name: "Architecture & Planning",
    children: [
      specialization("building-design", "Building Design"),
      specialization("urban-planning", "Urban Planning"),
      specialization("landscape-architecture", "Landscape Architecture"),
      specialization("interior-design", "Interior Design"),
      specialization("green-buildings", "Green Buildings"),
      specialization("smart-cities", "Smart Cities"),
    ],
  },
  {
    id: "agricultural-engineering",
    name: "Agricultural Engineering",
    children: [
      specialization("irrigation-engineering", "Irrigation Engineering"),
      specialization("farm-machinery", "Farm Machinery"),
      specialization(
        "soil-water-conservation",
        "Soil & Water Conservation"
      ),
      specialization(
        "post-harvest-technology",
        "Post Harvest Technology"
      ),
      specialization(
        "agricultural-renewable-energy",
        "Renewable Energy"
      ),
    ],
  },
  {
    id: "oil-gas-engineering",
    name: "Oil & Gas Engineering",
    children: [
      specialization("exploration-engineering", "Exploration Engineering"),
      specialization("drilling-engineering", "Drilling Engineering"),
      specialization("reservoir-engineering", "Reservoir Engineering"),
      specialization(
        "oil-gas-production-engineering",
        "Production Engineering"
      ),
      specialization("oil-gas-pipeline-engineering", "Pipeline Engineering"),
      specialization("refinery-engineering", "Refinery Engineering"),
      specialization(
        "oil-gas-petrochemical-engineering",
        "Petrochemical Engineering"
      ),
      specialization("lng-gas-processing", "LNG & Gas Processing"),
      specialization("oil-gas-offshore-engineering", "Offshore Engineering"),
    ],
  },
  {
    id: "biomedical-engineering",
    name: "Biomedical Engineering",
    children: [
      specialization("medical-devices", "Medical Devices"),
      specialization(
        "biomedical-instrumentation",
        "Biomedical Instrumentation"
      ),
      specialization("biomaterials", "Biomaterials"),
      specialization("clinical-engineering", "Clinical Engineering"),
      specialization(
        "rehabilitation-engineering",
        "Rehabilitation Engineering"
      ),
      specialization("medical-imaging", "Medical Imaging"),
      specialization("tissue-engineering", "Tissue Engineering"),
      specialization("bioinformatics", "Bioinformatics"),
      specialization("healthcare-technology", "Healthcare Technology"),
    ],
  },
  {
    id: "renewable-energy",
    name: "Renewable Energy",
    children: [
      specialization("solar-energy", "Solar Energy"),
      specialization("wind-energy", "Wind Energy"),
      specialization("hydropower", "Hydropower"),
      specialization("bioenergy", "Bioenergy"),
      specialization("geothermal-energy", "Geothermal Energy"),
      specialization("hydrogen-energy", "Hydrogen Energy"),
      specialization("energy-storage-systems", "Energy Storage Systems"),
      specialization("smart-energy-systems", "Smart Energy Systems"),
      specialization("energy-management", "Energy Management"),
    ],
  },
  {
    id: "automation-robotics",
    name: "Automation & Robotics",
    children: [
      specialization("industrial-automation", "Industrial Automation"),
      specialization("plc-scada", "PLC & SCADA"),
      specialization(
        "automation-robotics-engineering",
        "Robotics Engineering"
      ),
      specialization("automation-mechatronics", "Mechatronics"),
      specialization("motion-control", "Motion Control"),
      specialization("machine-vision", "Machine Vision"),
      specialization("industrial-iot", "Industrial IoT (IIoT)"),
      specialization(
        "artificial-intelligence-in-automation",
        "Artificial Intelligence in Automation"
      ),
      specialization("digital-manufacturing", "Digital Manufacturing"),
    ],
  },
  {
    id: "industrial-engineering",
    name: "Industrial Engineering",
    children: [
      specialization(
        "industrial-production-engineering",
        "Production Engineering"
      ),
      specialization("operations-management", "Operations Management"),
      specialization(
        "supply-chain-management",
        "Supply Chain Management"
      ),
      specialization("quality-engineering", "Quality Engineering"),
      specialization("lean-manufacturing", "Lean Manufacturing"),
      specialization("six-sigma", "Six Sigma"),
      specialization("facility-planning", "Facility Planning"),
      specialization("ergonomics", "Ergonomics"),
      specialization("logistics-engineering", "Logistics Engineering"),
    ],
  },
];
