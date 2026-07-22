import { prisma } from "./prisma/prisma.js";

const domains = [
  "Civil Engineering",
  "Mechanical Engineering",
  "Electrical Engineering",
  "Electronics & Communication Engineering",
  "Computer Science Engineering",
  "Software Engineering",
  "Artificial Intelligence & Machine Learning Engineering",
  "Chemical Engineering",
  "Environmental Engineering",
  "Biomedical Engineering",
  "Biotechnology Engineering",
  "Agricultural Engineering",
  "Architectural Engineering",
  "Automotive Engineering",
  "Aerospace Engineering",
  "Aeronautical Engineering",
  "Avionics Engineering",
  "Marine Engineering",
  "Naval Architecture",
  "Mining Engineering",
  "Geological Engineering",
  "Geotechnical Engineering",
  "Petroleum Engineering",
  "Nuclear Engineering",
  "Materials Science & Engineering",
  "Metallurgical Engineering",
  "Polymer Engineering",
  "Nanotechnology Engineering",
  "Microelectronics Engineering",
  "Instrumentation & Control Engineering",
  "Industrial Engineering",
  "Production Engineering",
  "Systems Engineering",
  "Data Engineering",
  "Cybersecurity Engineering",
  "Information Technology",
  "Food Process Engineering",
  "Pharmaceutical Engineering",
  "Genetic Engineering",
  "Optical / Photonics Engineering",
  "Renewable Energy Engineering",
  "Robotics Engineering",
  "Mechatronics Engineering",
  "Telecommunication Engineering",
  "Textile Engineering",
];

const slugify = (value: string) =>
  value
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

const iconMap: Record<string, string> = {
  civil: "🏗️",
  mechanical: "⚙️",
  electrical: "⚡",
  electronics: "📡",
  computer: "💻",
  software: "🧠",
  artificial: "🤖",
  chemical: "🧪",
  environmental: "🌿",
  biomedical: "🩺",
  biotechnology: "🧬",
  agricultural: "🌾",
  architectural: "🏛️",
  automotive: "🚗",
  aerospace: "🚀",
  aeronautical: "✈️",
  avionics: "🛰️",
  marine: "⚓",
  naval: "🚢",
  mining: "⛏️",
  geological: "🪨",
  geotechnical: "🧱",
  petroleum: "🛢️",
  nuclear: "☢️",
  materials: "🧲",
  metallurgical: "🔥",
  polymer: "🧴",
  nanotechnology: "🔬",
  microelectronics: "🔌",
  instrumentation: "📏",
  industrial: "🏭",
  production: "🛠️",
  systems: "🧩",
  data: "📊",
  cybersecurity: "🔐",
  information: "💼",
  food: "🥫",
  pharmaceutical: "💊",
  genetic: "🧫",
  optical: "💡",
  renewable: "🌞",
  robotics: "🤖",
  mechatronics: "🦾",
  telecommunication: "📞",
  textile: "🧵",
};

const seed = async () => {
  for (const [index, name] of domains.entries()) {
    const slug = slugify(name);
    const icon = iconMap[slug.split("-")[0]] || "🛠️";

    await prisma.engineeringDomain.upsert({
      where: { slug },
      update: { name, isActive: true, displayOrder: index + 1 },
      create: {
        name,
        slug,
        icon,
        description: `${name} domain for CEIS AI Studio workflows.`,
        color: "#06b6d4",
        displayOrder: index + 1,
        isActive: true,
      },
    });
  }
};

seed()
  .then(() => prisma.$disconnect())
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
